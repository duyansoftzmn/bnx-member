var Knowledge = function(scope,url){
	var _cookieLang = syUtil.store.cookie.get('language');
	this.loadKnowledgePackage

}
Knowledge.prototype.loadKnowledgePackage = function(){
	var self = this;

	// TODO add mask layout
	jQuery.getJSON(langUrl, function(data){

        if(!data.lang)
        return false;
		// TODO remove mask
		self.lang[data.lang] = data.content;

		return self.refreshLang(data.lang);

	})
};