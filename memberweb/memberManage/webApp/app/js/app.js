define(["ngInitCtrl", 'jquery.bootstrap'], function(NgInitCtrl){

	return {

	 	initApp : function(){
	 			var mainJs = "storeMain.js";
	 			SyApp.PROD_NAME = "store";

				var _ngpath = (SyApp.IS_MIN)? '/min/js/controllers': 'app/js/controllers';

				NgInitCtrl.initWithOneCtrl({
				    ngpath : _ngpath,
				    ngCtrl : mainJs,
				    callbackFun : function(){
				    	
				    },
				    runFun : function(){},
				    configFun : function(){},
				    ngmodels : ['ngResource', 'ngCookies']
				});
	 	}

	};
})