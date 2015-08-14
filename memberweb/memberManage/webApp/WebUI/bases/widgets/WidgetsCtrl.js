define(["backbone", "underscore",  "jquery"],function(Backbone,_, $){
    var WidgetsCtrl =   Backbone.Model.extend({
            'viewFileName' : '',
            'parentSelector' : '',
            'templateSelector' : '',    //for get html from outside (original page)
            'attributes' : {},
            'lang' : {},
           _build : function(json, callbackFun){
               var This =  this;
                require([this.VIEW_PATH + this.viewFileName], function(WidgetsView){
                    var model = {
                        contents : This.rebuildData(json),
                        templateSelector : This.templateSelector,
                        lang : This.lang,
                        attributes : This.attributes,
                        syWgCallbackFun : function(){
                            if (_.isFunction(callbackFun))
                                callbackFun(model);
                        }
                    };

                    var widgetsView  = new WidgetsView({
                        model : model,
                        el : This.parentSelector
                    });
                    widgetsView.render();
                });
           },
           rebuildData : function(json){
                 return json;
           },
           buildHtmlByAjaxJson : function(url, params, callbackFun){
               var This = this;
               $.post(url, params, function(json){
                   if (_.isString(json))
                       json = $.parseJSON(json);
                   This._build(json, callbackFun);
               });
           },
            buildHtmlByJson : function(json, callbackFun){
                this._build(json, callbackFun);
            },
            buildHtml : function(callbackFun){
                this._build({}, callbackFun);
            }
    });
    return WidgetsCtrl;
});