// design and code by michael
// Useage: script(id="syMainJs" data-main="/WebUI/bases/sy", src="/WebUI/bases/jslibs/require-2.1.4.min.js", prod-path="/myproduct/js", main-ctrl="app", is-min="#{minimizeUI}")

 var SyApp = window['syApp'] = {
    "PRODUCT_BASE_PATH" :  '/WebUI/product',
    "LIBS_PATH" :  '/WebUI/bases',
    "NG" : {},     //angular MODULE
    "IS_MIN" : false
};

(function(){
    var SyConfigParam = {
        ID : "syMainJs",
        PROD_PATH : "prod-path",
        NO_PROD_INIT : "noDefaultInit",
        MAIN_CTRL : "main-ctrl",
        IS_MIN: "is-min"
    }
   
    var runProdInitFun = true;
    var mainCtrl = "";
    var mianJsDom = document.getElementById(SyConfigParam.ID);
 
    if (mianJsDom){
        runProdInitFun = (mianJsDom.getAttribute(SyConfigParam.NO_PROD_INIT) != "YES");
        SyApp.PRODUCT_BASE_PATH = mianJsDom.getAttribute(SyConfigParam.PROD_PATH);
        mainCtrl = mianJsDom.getAttribute(SyConfigParam.MAIN_CTRL);
        SyApp.IS_MIN = mianJsDom.getAttribute(SyConfigParam.IS_MIN) == 'true'? true: false;
    }

    SyApp.PRODUCT_BASE_PATH += (SyApp.IS_MIN)? "/min/js": "/js";

    requirejs.config({
        paths: {
            //path
            "SY_BASE" :  SyApp.LIBS_PATH,
            "PROD_DIR" : SyApp.PRODUCT_BASE_PATH,
            "SY_WIDGET" : SyApp.LIBS_PATH + "/widgets",
            "SY_NG_WIDGET" : SyApp.LIBS_PATH + "/Ng/widgets",
            "PROD_WIDGET" : SyApp.PRODUCT_BASE_PATH + "/widgets",
            "NG_SCOPE" : SyApp.LIBS_PATH + "/Ng/Component/scope",
            "NG_DIRECTIVE" : SyApp.LIBS_PATH + "/Ng/Component/directive",
  

            //js  lib
            "jquery": SyApp.LIBS_PATH + "/jslibs/jquery-2.1.1.min",
            "jquery.bootstrap":SyApp.LIBS_PATH + "/syArt/bootstrap/js/bootstrap.min",
            "text" :  SyApp.LIBS_PATH + "/jslibs/text-1.0.8.min",
            "underscore": SyApp.LIBS_PATH +"/jslibs/underscore-1.5.0.min",
            "hChart" : SyApp.LIBS_PATH +"/chart/Highcharts/js/highcharts",

            "angular" : SyApp.LIBS_PATH + "/jslibs/angular/angular.min",
            "ngCookies" : SyApp.LIBS_PATH + "/jslibs/angular/angular-cookies.min",
            "ngResource" : SyApp.LIBS_PATH + "/jslibs/angular/angular-resource.min",
            "ngSanitize" : SyApp.LIBS_PATH + "/jslibs/angular/angular-sanitize.min",
            "ngRoute" : SyApp.LIBS_PATH + "/jslibs/angular/angular-route.min",
            "ngAnimate" : SyApp.LIBS_PATH + "/jslibs/angular/angular-animate.min",
            'NgNamespaceInit' : SyApp.LIBS_PATH + "/Ng/NgNamespaceInit",
            'ngInitCtrl' : SyApp.LIBS_PATH + "/Ng/NgInitCtrl",
            "ngShareMoudle" : SyApp.LIBS_PATH + "/Ng/NgShareMoudle",

            //jq plugin
            "bootstrapSwitch" :  SyApp.LIBS_PATH +"/jQplugin/bootstrap-switch-master/js/bootstrap-switch.min"

        },
        shim: {
            "jquery.bootstrap": {
                deps: ["jquery"]
            },
            "hChart": {
                deps: ["jquery"]
            },
            'angular' : {
                'exports' : 'angular'
            },
            "ngResource": {
                "deps": [  "angular" ]
            },
            "ngCookies": {
                "deps": [  "angular" ]
            },
            "ngSanitize": {
                "deps": ["angular"]
            },
            "ngRoute": {
                "deps": [  "angular" ]
            },
            "ngAnimate": {
                "deps": [  "angular" ]
            },
            'ngShareMoudle' : {
                deps: ["angular"],
                exports : 'ngShareMoudle'
            },
            'bootstrapSwitch' : {
                deps: ["jquery.bootstrap"]
            },
             "underscore": {
                exports: '_'
            }
        }
    });

    require(["PROD_DIR/"+ mainCtrl,  "jquery"], function (MainCtrl) {
        MainCtrl.initApp();
    });
    
})();