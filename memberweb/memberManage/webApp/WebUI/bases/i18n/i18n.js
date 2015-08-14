/*
*	Code by michael
*
*	Depend：  jquery
*
*  lang file path: /lang/en.json
*
*  json	file content:

	{
		"lang" : "en",
		"content" : {
			"t_name" : "Name",
			"t_desc" : "Description"
		}
	}
*
	new SyI18n({url: "/abc/lang/", lang : 'en', existLangs: "en,zh"}, $rootScope)

	var app = new SyI18n({url: "/abc/lang/", lang : 'en', existLangs: "en,zh"});
*
*	normal html part:
*  <font syi18n="weather" > 今天天气真好 </font>
*
*   angular html part:
*	<font> {{syi18n.weather}} </font>
*
 * !!!!!!!!   Selector Element  <dy-language></dy-language>
*
*  language Obj :{name:'中文',image:'/WebUI/bases/img/flags/China.png',disabled:false,code:'zh'},
*
*  I18ned Scope :
*    scope.syi18n  cache string
*    scope.language store syi18n data  and syi18n functions
*       scope.language.currentLang  is current language
*       scope.language.existLangs is array of all languages
*       scope.language.switchLang(langObj) for switch language
*/
var SyI18n = function(lang, _scope, _domSelector){  //_domSelector is for jquery build menu
    var _cookieLang = syUtil.store.cookie.get('language');
    lang.lang = _cookieLang?_cookieLang:lang.lang;
    var self =this;
	this.lang = {};
	this.url = lang.url;

	this.loadLangPackage(lang.lang);
	this.currentLang = lang.lang;
	this.existLangs = lang.existLangs.split(",");
	this.isForAngular = !!_scope? true : false;
	if (this.isForAngular){
		this._scope = _scope;
        this._scope.language={};
        this._scope.language.currentLang = _langInfo[lang.lang];
        this._scope.language.existLangs =[]
        for(var i in  _langInfo){
					if(!_langInfo[i].disabled)
            this._scope.language.existLangs.push(_langInfo[i]);
        }
        //this._scope.language.existLangs = _langInfo;
        this._scope.language.switchLang = function (lang){
            if(lang.disabled||lang.code == self._scope.language.currentLang.code)
                return;
            self.switchLangFromCache(lang.code);
        };
		this._scope.syi18n = {}
	}

  //  check cookies lang code change
    var _checkCookies = function(){
        var _cookie = syUtil.store.cookie.get('language');
        if(_cookie&&_cookie != self.currentLang){
            self.switchLangFromCache(_cookie);
        }
    }

    setInterval(function(){
        _checkCookies();
    },100)

	return this;
};

var _langInfo = {
    zh:{name:'中文',image:'/WebUI/bases/img/flags/China.png',disabled:false,code:'zh'},
    en:{name:'English',image:"/WebUI/bases/img/flags/United-States-of-America.png",disabled:false,code:'en'},
    jp:{name:'日本語',image:"/WebUI/bases/img/flags/Japan.png",disabled:true,code:'jp'}
};

SyI18n.prototype.get = function(key, defaultLangStr){

	if (this.lang[this.currentLang][key])
		return this.lang[this.currentLang][key];
	else
		return defaultLangStr;
};

SyI18n.prototype.loadLangPackage = function(lang){
	var self = this;
	var langUrl = this.url + lang + '.json?'+ (new Date()).getTime();

	// TODO add mask layout
	jQuery.getJSON(langUrl, function(data){

        if(!data.lang)
        return false;
		// TODO remove mask
		self.lang[data.lang] = data.content;

		return self.refreshLang(data.lang);

	})
};

SyI18n.prototype.switchLangFromCache = function(lang){
	if (!this.lang[lang]) {
        return this.loadLangPackage(lang);
    }else {
        return this.refreshLang(lang, 1);
    }
};

SyI18n.prototype.refreshLang = function(lang,noApply){
    if (this.isForAngular)
		return this._refreshLangByAngular(lang,noApply);
	else
		return this._refreshLangByDom(lang);
};

SyI18n.prototype._refreshLangByDom = function(lang){
	var self = this;

	$("[syi18n]").each(function(){
		var thisJo = $(this);
		var langKey = thisJo.attr("syi18n");


		if (!!self.lang[lang] && !!self.lang[lang][langKey]){
			thisJo.text(self.lang[lang][langKey]);
		}
	})
};

SyI18n.prototype._refreshLangByAngular = function(lang,noApply){
	var self = this;
    if(noApply){
        self._scope.syi18n = self.lang[lang];
        this._scope.language.currentLang = _langInfo[lang];

    }else{
        this._scope.$apply(function(){
            self._scope.syi18n = self.lang[lang];
            self._scope.language.currentLang = _langInfo[lang];
        });
    }
    syUtil.store.cookie.set('language', lang, 6, 'duyansoft.com');
    this.currentLang = lang;
    return true;
};

if (typeof define != "undefined"){
	define(['SY_BASE/syUtil'],function(){
		return SyI18n;
	});
}