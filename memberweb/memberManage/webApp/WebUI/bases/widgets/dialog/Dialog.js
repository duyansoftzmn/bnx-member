define(["backbone", "jquery",  "SY_WIDGET/WidgetsCtrl"],function(Backbone,$, WidgetsCtrl){
    var Dialog =   WidgetsCtrl.extend({
        'VIEW_PATH' : 'SY_WIDGET/dialog/view/',
        initialize: function(paramters) {
            this.viewFileName = paramters.viewFileName;
            this.parentSelector = paramters.parentSelector;
            this.templateSelector = paramters.templateSelector;
            this.lang = paramters.lang;
            this.attributes = paramters.attributes;
        },
        confirm : function(callbackFun){
            var id = (new Date()).getTime();
            this._build({id: id, callbackFun: callbackFun});
        },
        show : function(callbackFun){
            this._build({ callbackFun: callbackFun});
        },
        buildHtmlByAjaxText : function(_callbackFun){
            var params = {
                id :(new Date()).getTime()
            }

            var This = this;

            this._build(params, function(){
                // load popup panel handle controller
                require([This.attributes.content.ctrlModel], function(ctrlModel){
                    if (_.isFunction(ctrlModel.init))
                        ctrlModel.init(params, _callbackFun);
                });


            });
        }
    });

    return Dialog;
})
