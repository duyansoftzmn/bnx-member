/*
 *   Use Case:
 *
 *    var datagrid = new SiteDatagrid({
         'viewFileName' : 'Response1',
         'parentSelector' : "#domId",
         'templateSelector' : "",
         'attributes' : {
             dataSourceUrl : "/test",
             order : "desc",   //or asc
             page	: 1,
             rows	: 10,
             searchKeySort :"ID"
         },
         'lang' : {
         t_all : t_all,
         t_address : t_address
         }
       });

 *  XHR response: "rows":[{"ID":"22","key":"value","iconClass":"class"}
 *
 */
define(["backbone",  "SY_WIDGET/WidgetsCtrl"],function(Backbone, WidgetsCtrl){
    var Datagrid =   WidgetsCtrl.extend({
        'VIEW_PATH' : 'SY_WIDGET/datagrid/view/',
        initialize: function(paramters) {
            this.viewFileName = paramters.viewFileName;
            this.parentSelector = paramters.parentSelector;
            this.templateSelector = paramters.templateSelector;
            this.lang = paramters.lang;
            this.attributes = paramters.attributes;
        },
        buildTabTableHtmlByAjaxJson : function(callbackFun){
            var This = this;
            var defaultTab = this.attributes[0];

            $.post(defaultTab.dataSourceUrl, {
                order :	defaultTab.order,
                page :	defaultTab.page,
                rows :	defaultTab.rows,
                sort :	defaultTab.defaultKey
            }, function(json){
                if (_.isString(json))
                    json = $.parseJSON(json);
                This._build(json, callbackFun);
            });
        }
    });

    return Datagrid;
});