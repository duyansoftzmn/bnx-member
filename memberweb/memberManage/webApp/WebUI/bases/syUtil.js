var syUtil = {
        base : {
            isMobile : function(){
               if (window.innerWidth > 768 ){
                  return false;
                }
                return true
            },
            int2StringTime: function(intTime){
              //intTime:  0 - 2359  -> stringTime: 00:00 - 23:59
              var t = syUtil.base.intTime2HourMin(intTime);
              var h = t[0], m = t[1];

               return (h>9? h: '0'+ h)+ ':' +(m ==0? '0'+ m : m);
   
            },
            intTime2HourMin: function(intTime){
              //intTime->[intHour, intMin]:  0 - 2359  -> [0,0] - [23, 59]
              var hour, min;
                intTime = intTime || 0;
                if (intTime < 60){
                    hour = 0;
                    min = intTime;
                }else{
                    hour =  parseInt(intTime/100);
                    min = intTime%100;
                }

                return [hour, min]
            },
            hourMin2IntTime: function(hour, min){
              // h,m->  0,0  23,59 -> 0  2359
              return (hour>0)? hour* 100 + min: min;
            },
            hourMin2StringTime : function(hour,min){
                var intTime = (hour>0)? hour* 100 + min: min;
                return syUtil.base.int2StringTime(intTime);
            },
            jsonToString : function (o) {
                var arr = [];
                var fmt = function(s) {
                    if (typeof s == 'object' && s != null) return syUtil.base.jsonToString(s);
                    return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
                }
                for (var i in o)
                    arr.push("'" + i + "':" + fmt(o[i]));
                return '{' + arr.join(',') + '}';
            },
            getURLParam : function(name){
                var locString = String(window.document.location.href.replace(window.document.location.hash, ''));
                var rs = new RegExp("(^|)"+name+"=([^\&]*)(\&|$)","gi").exec(locString), tmp;
                return (tmp=rs)? tmp[2]:"";
            },
            dateFormat : function (fmt, timestamp) {
                var date = (!!timestamp)? new Date(parseInt(timestamp)) : new Date();
                if(!!date.getMonth)
                {

                    var o = {
                        "M+": date.getMonth() + 1,
                        "d+": date.getDate(),
                        "h+": date.getHours(),
                        "m+": date.getMinutes(),
                        "s+": date.getSeconds(),
                        "q+": Math.floor((date.getMonth() + 3) / 3),
                        "S": date.getMilliseconds()
                    };

                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

                    for (var k in o){
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                else
                    fmt = date;

                return fmt;
            },
            strpad : function(string, totalLen, sign){
              var len = string.length;
              if (totalLen > len)
              {
                var pre_string_len =  totalLen - len;
                var pre_string = "";
                for (i = 0; i < pre_string_len; i++)
                {
                  pre_string += sign;
                }

                return pre_string + string;
              }

              return string;
              
            },
            uuid : function() {
              var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
              var chars = CHARS, uuid = new Array(36), rnd=0, r;
              for (var i = 0; i < 36; i++) {
                if (i==8 || i==13 ||  i==18 || i==23) {
                  uuid[i] = '-';
                } else if (i==14) {
                  uuid[i] = '4';
                } else {
                  if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
                  r = rnd & 0xf;
                  rnd = rnd >> 4;
                  uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
              }
              return uuid.join('').toLowerCase();
            },
            getUrlReg : function(){
              var strRegex = /(http[s]?:\/\/+)*[\d\w]([\d\w-]*\.[\d\w-]+\.[\d\w-]+|[\d\w-]*\.[\d\w-]+|[\d\w-]*)\.([\d\w-]+)(:\d{2,6})?(\/[~!=%&;#\._\d\w-\/]*(\?\S*)?)*/gi;
              return new RegExp(strRegex);
            },
            //support 0000 type
            isNumber : function(str){
              for (i in str){
                if (isNaN(parseInt(str[i]))){
                  return false;
                }

              }
              return true;
            },
            isAvaliableURL : function(url){
              var isAvaliable = _AppUtil.getUrlReg().test(url);
              return isAvaliable;
            },
            parseURLfromStr : function(Str, showStrLimitLen){
              if (!Str || Str.length == 0)
                return;
              
              var isUrl = false;
              var tmp = Str.replace(_AppUtil.getUrlReg(), function($1){
                var url = $1;
                var href = (url.indexOf("http") == -1)? 'http://'+ url: url;
                if(!!showStrLimitLen)
                  url = _AppUtil.subString(url, 20, '...');
                isUrl = true;
                return "<a href='" + href + "' target='_blank'>" + url + "</a>";
              });
              
              if (!isUrl)
                tmp = _AppUtil.subString(tmp, showStrLimitLen, '...');
              
              return tmp;
             },
            log : function(type, output){
                if (!console) return;

                switch (type){
                  case 'debug':
                  case 'error':
                  case 'info':
                  case 'log':
                    break;
                  default:
                    type = 'log';
                }

                console[type](output);
            }
        }
    }; 


    syUtil.base.geo = {
        EARTH_RADIUS : 6378137.0,   //单位M
        PI : Math.PI,
        getRad: function(d){
          return d*this.PI/180.0;
        },
        getFlatternDistance: function(lat1,lng1,lat2,lng2){
            var f = this.getRad((lat1 + lat2)/2);
            var g = this.getRad((lat1 - lat2)/2);
            var l = this.getRad((lng1 - lng2)/2);
            
            var sg = Math.sin(g);
            var sl = Math.sin(l);
            var sf = Math.sin(f);
            
            var s,c,w,r,d,h1,h2;
            var a = this.EARTH_RADIUS;
            var fl = 1/298.257;
            
            sg = sg*sg;
            sl = sl*sl;
            sf = sf*sf;
            
            s = sg*(1-sl) + (1-sf)*sl;
            c = (1-sg)*(1-sl) + sf*sl;
            
            w = Math.atan(Math.sqrt(s/c));
            r = Math.sqrt(s*c)/w;
            d = 2*w*a;
            h1 = (3*r -1)/2/c;
            h2 = (3*r +1)/2/s;
            
            return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
        },
        getGeoLocation : function(geoSuccessCallbackFunc, _geoErrorCallbackFunc, _options){
          if (window.navigator.geolocation) {
              if (!_options) 
                    _options = {enableHighAccuracy: true};

               window.navigator.geolocation.getCurrentPosition(function(position){
                  geoSuccessCallbackFunc(position);
               }, function(){
                  if (_geoErrorCallbackFunc)
                    geoErrorCallbackFunc(position);
               }, _options);

           } else {
               console.log("浏览器不支持html5来获取地理位置信息");
           }
        }
    }


      syUtil.base.fullscreen = {   
            isSupportFullscreen : function(){
              if (!!document.exitFullscreen || !!document.mozCancelFullScreen || !!document.webkitCancelFullScreen)
                return true;

              return false;
            },
            openFullscreen : function(panelDom, openedCallbackFun, canceledCallbackFun){
              if (_AppUtil.isSupportFullscreen())
              {
                if (panelDom.requestFullscreen) {  
                    panelDom.requestFullscreen();  
                }
                else if (panelDom.mozRequestFullScreen) {  
                    panelDom.mozRequestFullScreen();  
                }  
                else if (panelDom.webkitRequestFullScreen) {  
                    panelDom.webkitRequestFullScreen();  
                } 

                jQuery( document ).bind(
                    'fullscreenchange webkitfullscreenchange mozfullscreenchange',
                    function(){
                        if (!!_AppUtil.getFullscreenElement())
                          openedCallbackFun();
                        else
                          canceledCallbackFun();
                       
                    }
                );
              }
            },
            _cancelFullScreen : function(){
              if (document.exitFullscreen) {
                  document.exitFullscreen();  
              }  
              else if (document.mozCancelFullScreen) {  
                  document.mozCancelFullScreen();  
              }  
              else if (document.webkitCancelFullScreen) {  
                  document.webkitCancelFullScreen();  
              }

              jQuery( document ).unbind('fullscreenchange webkitfullscreenchange mozfullscreenchange');
            },
            getFullscreenElement : function(){
              return  document.fullscreenElement ||
                     document.webkitCurrentFullScreenElement ||
                     document.mozFullScreenElement ||
                     null;
            }
    };
   

    syUtil.base.AjaxFormSubmit = {
           _getDoc : function(){
               var doc = null;

               // IE8 cascading access check
               try {
                   if (frame.contentWindow) {
                       doc = frame.contentWindow.document;
                   }
               } catch(err) {
               }

               if (doc) { // successful getting content
                   return doc;
               }

               try { // simply checking may throw in ie8 under ssl or mismatched protocol
                   doc = frame.contentDocument ? frame.contentDocument : frame.document;
               } catch(err) {
                   // last attempt
                   doc = frame.document;
               }
               return doc;
           },
           doSubmit : function(selector, callbackFun, _formData){
               var formJo = $(selector);
               var formURL = formJo.attr("action");

               if(window.FormData !== undefined)  // for HTML5 browsers
               {
                   var formData = _formData? _formData: new FormData(formJo[0]);
                   
                   $.ajax({
                       url: formURL,
                       type: 'POST',
                       data:  formData,
                       mimeType:"multipart/form-data",
                       contentType: false,
                       cache: false,
                       processData:false,
                       success: function(data, textStatus, jqXHR)
                       {
                           callbackFun( data);
                       },
                       error: function(jqXHR, textStatus, errorThrown)
                       {
                           callbackFun(0);
                       }
                   });
               }
               else  //for olden browsers
               {
                   //generate a random id
                   var  iframeId = 'unique' + (new Date().getTime());

                   //create an empty iframe
                   var iframe = $('<iframe hidden src="javascript:false;" name="'+iframeId+'" />');

                   //set form target to iframe
                   formJo.attr('target',iframeId);

                   //Add iframe to body
                   iframe.appendTo('body');
                   iframe.load(function(e)
                   {
                       var doc = This._getDoc(iframe[0]);
                       var docRoot = doc.body ? doc.body : doc.documentElement;
                       var data = docRoot.innerHTML;
                       callbackFun(data);
                   });

               }
           },
           onSubmit : function(selector, callbackFun){
               var This = this;

               $(selector).submit(function(e){
                   This.doSubmit(selector, callbackFun);
                   if (_.isFunction(e.preventDefault))
                         e.preventDefault();

                   if (_.isFunction(e.unbind))
                        e.unbind();
               });
           }
    }

    syUtil.base.FileReader = {
        _isValidBrowser : function(){
            return !!window.FileReader
        },
        img : {
            bindImgReader1To1 : function(browserSelector, imgSelector, callBackFun){
                if (syUtil.base.FileReader._isValidBrowser() )
                {
                    $(browserSelector).change(function(){
                        var file = $(this)[0].files[0];
                        var imageType = /image.*/;
                        if (file.type.match(imageType)) {
                            var reader = new FileReader();

                            reader.onload = function(e) {
                                $(imgSelector).attr("src", reader.result);
                                if (_.isFunction(callBackFun))
                                    callBackFun(true)
                            }
                            reader.readAsDataURL(file);
                        }
                        else{
                            if (_.isFunction(callBackFun))
                                callBackFun(false)
                        }

                    });
                }
            },
            //MaxItemNum = 0, means not limit
            //hasImg = 1, means successful
            //hasImg = 0, means unsuccessful
            //hasImg = -1, means too many items
            bindImgReader1ToN : function(browserSelector, imgListSelector, MaxItemNum, callBackFun){
                var self = this;
                self.MaxItemNum = MaxItemNum;
                if (syUtil.base.FileReader._isValidBrowser() )
                {
                    $(browserSelector).change(function(){

                        var imageType = /image.*/;
                        var fileList = $(this)[0].files;
                        var fileListLen = fileList.length;
                        var hasImg = 0;

                        if (self.MaxItemNum > 0 && self.MaxItemNum >= fileListLen )
                        {
                            $(imgListSelector).html('');

                            for (var i =0; i <= fileListLen -1;  i++ )
                            {
                                hasImg = 1;
                                var file = fileList[i];
                                if (file.type.match(imageType)) {
                                    var reader = new FileReader();
                                    reader.index = i;
                                    $(imgListSelector).append('<li class="uploadedImgLi preview"><img index="'+i+'" id="'+imgListSelector.replace("#","")+i+'" src="" width="80" height="80"/></li>');
                                    reader.onload = function(e) {
                                        $(imgListSelector + e.target.index).attr("src", e.target.result);

                                    }
                                    reader.readAsDataURL(file);
                                }
                            }
                        }
                        else
                            hasImg = -1;

                        if ( _.isFunction(callBackFun))
                            callBackFun(hasImg)


                    });
                }
                else{
                    if (_.isFunction(callBackFun))
                        callBackFun(false)
                }
            }

        } //img obj end


    }

    //for html button tag
    syUtil.base.LoadingBtn = {
       //loadingText  加载中 提示
        disable : function(selector, loadingText){
            var imgUid = (new Date()).getTime();
            var btnJo = $(selector);
            btnJo.attr({'for': imgUid, 'disabled' : 'disabled', 'oldText': btnJo.text()});

            btnJo.text(loadingText);
            btnJo.after('<img id="'+imgUid+'" style="padding-left: 10px;" src="'+SyApp.LIBS_PATH+'/img/ajaxLoader4.gif">');

        },
        //resultText  成功 提示
        enable : function(selector, resultText, btnClassStr ){
            var btnJo = $(selector);
            var imgUid = btnJo.attr('for');
            $("#" + imgUid).fadeOut(1000, function(){$(this).remove()});
            var oldText =  btnJo.attr('oldText');
            btnJo.addClass(btnClassStr).text(resultText);
            setTimeout(function(){
                btnJo.removeAttr('disabled').text(oldText).removeClass(btnClassStr);
            }, 2000);

        }
    };


    syUtil.store = {
        cookie : {
            get : function(key){
               var i,x,y,ARRcookies=document.cookie.split(";");

                for (i=0;i<ARRcookies.length;i++)
                {
                  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
                  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                  x=x.replace(/^\s+|\s+$/g,"");
                  if (x==key)
                  {
                    return unescape(y);
                  }
                 }
                 return "";
            },
            set : function(key, value, _hours, _domain, _path){

              var str = key + "=" + escape(value);
              if (!_hours) _hours = 0;

              if(_hours > 0){
              //为0时不设定过期时间，浏览器关闭时cookie自动消失
                var date = new Date();
                var ms = _hours*3600*1000;
                date.setTime(date.getTime() + ms);
                str += "; expires=" + date.toGMTString();
              }else{
                str += ";";
              }

              if (_domain && _domain.length > 0)
                 str += ";domain=" + _domain + ';';

              str += ";path=" + ( _path || '/' ) + ';';
              document.cookie = str;

            },
            delOne : function(key){
                 var date = new Date();
                 date.setTime(date.getTime() - 10000);
                 document.cookie = key + "=a; expires=" + date.toGMTString();
            }
        },
        localStorage : {
          get : function(key){
              return localStorage.getItem(key);
          },
          set : function(key, value){
              localStorage.setItem(key, value);
          },
          delOne : function(key){
              localStorage.removeItem(key);
          }
        }
    };

    syUtil.store.localstore = {
        localstore : (typeof(localStorage) !== "undefined")? syUtil.store.localStorage : syUtil.store.cookie,
        get : function(key){
            return this.localstore.get(key);
        },
        set : function(key, value, _hour, _domain){
            this.localstore.set(key, value);
        },
        delOne : function(key){
            this.localstore.delOne(key);
        }
    };



if (typeof define != "undefined"){
    define(["underscore", "jquery"], function(_, $){
      return syUtil;
    })
}