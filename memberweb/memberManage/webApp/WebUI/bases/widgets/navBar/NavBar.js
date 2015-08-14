/*
*   Use Case:
*
*    Main navigation item Json data format
*   [{"id":"the item id, string, optional","text":"display name, string, require","iconCls":"icon class, string, require","state":"item state, string, optional","checked":false,"attributes":{url : "the item's url, string, optional"},"children":[{"id":"","text":"","iconCls":"","state":null,"checked":false,"attributes":{"url":"/sub url"}},{id.....}]
*
*  TODO Assist navigation item Json data format,  e.g: Logout
*    [{"id":"the item id, string, optional","text":"display name, string, require",.....},....{"html" : "item html, string, optional,ps: if html parameter exist just build using html"},.....]
 */
define(["backbone",  "SY_WIDGET/WidgetsCtrl"],function(Backbone, WidgetsCtrl){
    var NavBar =   WidgetsCtrl.extend({
            'VIEW_PATH' : 'SY_WIDGET/navBar/view/',
            'viewFileName' : 'NavTopFixed1',           //default fixed top bar
            'parentSelector' : "",
            'templateSelector' : ""         //for get html for init page
    });

    return NavBar;
});