// design and code by michael
// Useage: script(id="syMainJs" data-main="/WebUI/bases/sy", src="/WebUI/bases/jslibs/require-2.1.4.min.js", prod-path="/myproduct/js", is-min="#{minimizeUI}")
//         noDefaultInit = "YES"

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

            //jquery
            "jquery": SyApp.LIBS_PATH + "/jslibs/jquery-2.1.1.min",
            "jquery.ui": SyApp.LIBS_PATH + "/jQplugin/jquery-ui-1.11.0/jquery-ui.min",
            "jquery.ui.touch": SyApp.LIBS_PATH + "/jQplugin/jquery.ui.touch-punch.min",
            "jquery.bootstrap":SyApp.LIBS_PATH + "/syArt/bootstrap/js/bootstrap.min",
            "jquery.form.validator" : SyApp.LIBS_PATH + "/jQplugin/jquery.form-validator.min",
            "jquery.qrcode" : SyApp.LIBS_PATH + "/jQplugin/jquery.qrcode.min",

            //js  lib
            "underscore": SyApp.LIBS_PATH +"/jslibs/underscore-1.5.0.min",
            "backbone": SyApp.LIBS_PATH + "/jslibs/backbone-1.1.min",
            "text" :  SyApp.LIBS_PATH + "/jslibs/text-1.0.8.min",
            "normalize" : SyApp.LIBS_PATH + "/jslibs/normalize",
            "css" :  SyApp.LIBS_PATH + "/jslibs/css-1.1.2.min",
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
            "bootstrapSwitch" :  SyApp.LIBS_PATH +"/jQplugin/bootstrap-switch-master/js/bootstrap-switch.min",

            //raphael
            'eve' : SyApp.LIBS_PATH +'/syArt/raphael-amd/eve',
            'raphael-core' : SyApp.LIBS_PATH +'/syArt/raphael-amd/raphael.core',
            'raphael-svg' : SyApp.LIBS_PATH +'/syArt/raphael-amd/raphael.svg',
            'raphael-vml' : SyApp.LIBS_PATH +'/syArt/raphael-amd/raphael.vml',
            'raphael' : SyApp.LIBS_PATH +'/syArt/raphael-amd/raphael.amd',
            "jquery.morris" :  SyApp.LIBS_PATH + "/chart/morris.js-0.4.3/morris",

            "nv-d3-lib" : SyApp.LIBS_PATH + "/chart/nvd3/lib/d3.v3",
            "nvd3" : SyApp.LIBS_PATH + "/chart/nvd3/nv.d3.min",

            'tinyMCE' : SyApp.LIBS_PATH + '/editor/tinymce/tinymce',
            'ui.tinymce' : SyApp.LIBS_PATH + '/editor/tinymce/ng/tinymce'

        },
        shim: {
            "jquery.ui": {
                deps: ['jquery']
            },
            "jquery.qrcode": {
                deps: ['jquery']
            },
            "hChart": {
                deps: ["jquery"]
            },
            "css": {
                deps: ['normalize']
            },
            "jquery.bootstrap": {
                deps: ["jquery"]
            },
            "jquery.form.validator": {
                deps: ["jquery"]
            },
            'raphael':{
                exports : 'Raphael'
            },
            "underscore": {
                exports: '_'
            },
            "backbone": {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
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
                "deps": [  "angular" ]
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
            nvd3: {
              exports: 'nv',
              deps: ['nv-d3-lib']
            },
            'tinyMCE' : {
                exports: 'tinyMCE',
                init: function () {
                    this.tinyMCE.DOM.events.domLoaded = true;
                    return this.tinyMCE;
                }
            },
            'ui.tinymce' : {
                deps: ["tinyMCE"]
            }
        }
    });


    if (!mainCtrl || mainCtrl.length === 0) {
        require(["PROD_DIR/rootes", "PROD_DIR/defaultPageInit", "backbone", "jquery"], function (Rootes, DefaultPageInit) {

            if (runProdInitFun && !!DefaultPageInit){
                 DefaultPageInit.pageInit();
            }
               
            //init is a must be interface in project Rootes, it is defined in rootes.js
            Rootes.init();
        });
    } else {
        require(["PROD_DIR/"+ mainCtrl,  "jquery"], function (MainCtrl) {
            MainCtrl.initApp();
        });
    }

})();