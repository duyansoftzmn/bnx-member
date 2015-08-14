// design and code by michael
// This is base on angular  requirejs and  jquery mobile
// Useage: script(id="syJqMainJs", data-main="/WebUI/bases/syJqm", src="/WebUI/bases/jslibs/require-2.1.4.min.js", prod-path="/myproduct")

// Should be have app.js in prod-path with initApp funtion as main function

 var SyApp = window['syApp'] = {
    "PRODUCT_BASE_PATH" :  '/WebUI/product/js',
    "LIBS_PATH" :  '/WebUI/bases',
    "MAIN_JQS_DOM" : {
        ID : "syJqMainJs",
        PROD_PATH : "prod-path"
    }
};

(function(){
    var mianJsDom = document.getElementById(SyApp.MAIN_JQS_DOM.ID);
    if (mianJsDom){
        SyApp.PRODUCT_BASE_PATH = mianJsDom.getAttribute(SyApp.MAIN_JQS_DOM.PROD_PATH) + "/js";
    }

    require.config( {

            paths: {
                "SY_BASE" :  SyApp.LIBS_PATH,
                "PROD_DIR" : SyApp.PRODUCT_BASE_PATH,

                "jquery": SyApp.LIBS_PATH + "/jslibs/jquery-1.9.0.min",
                "jquery.ui": SyApp.LIBS_PATH + "/jQplugin/jquery-ui-1.11.0/jquery-ui.min",
                "jquery.ui.touch": SyApp.LIBS_PATH + "/jQplugin/jquery.ui.touch-punch.min",
                "jquerymobile": SyApp.LIBS_PATH + "/mobile/jquery.mobile-1.4.2/jquery.mobile-1.4.2.min",
                
                "underscore": SyApp.LIBS_PATH +"/jslibs/underscore-1.5.0.min",
                "angular" : SyApp.LIBS_PATH + "/jslibs/angular/angular.min",
                "ngCookies" : SyApp.LIBS_PATH + "/jslibs/angular/angular-cookies",
                "ngResource" : SyApp.LIBS_PATH + "/jslibs/angular/angular-resource",
                "ngSanitize" : SyApp.LIBS_PATH + "/jslibs/angular/angular-sanitize",
                "ngRoute" : SyApp.LIBS_PATH + "/jslibs/angular/angular-route",
                'NgNamespaceInit' : SyApp.LIBS_PATH + "/Ng/NgNamespaceInit",
                'ngInitCtrl' : SyApp.LIBS_PATH + "/Ng/NgInitCtrl",
                "ngShareMoudle" : SyApp.LIBS_PATH + "/Ng/NgShareMoudle",

                "text" :  SyApp.LIBS_PATH + "/jslibs/text-1.0.8.min"

            },
            shim: {
                "jquerymobile": {
                      "deps": [  "jquery" ],
                      "exports": "jquerymobile"  
                },
                "underscore": {
                    exports: '_'
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
                'jquery.ui' : {
                    deps: ['jquery']
                },
                'jquery.ui.touch' : {
                    deps: ['jquery', 'jquery.ui']
                }

            } 

          });


    // Includes File Dependencies
    require([ "jquery", "jquerymobile", "PROD_DIR/app" ], function( $, Mobile, App ) {
        App.initApp();
    });
})();