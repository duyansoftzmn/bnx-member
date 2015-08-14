define(["backbone", "jquery",  "SY_WIDGET/WidgetsCtrl"],function(Backbone,$, WidgetsCtrl){
    var Selector =   WidgetsCtrl.extend({
        'VIEW_PATH' : 'SY_WIDGET/selector/view/',
        initialize: function(paramters) {
            this.viewFileName = paramters.viewFileName;
            this.parentSelector = paramters.parentSelector;
            this.templateSelector = paramters.templateSelector;
            this.lang = paramters.lang;
            this.attributes = paramters.attributes;
        }
    });

    return Selector;
})