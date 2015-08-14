/**
 * Created by Jian on 11/10/2014.
 */
define([
  "jquery",
  "ngInitCtrl",
  "SY_BASE/i18n/i18n",
  "jquery.bootstrap"
],function($, NgInitCtrl, SyI18n){
  return{
    initApp:function(){
      NgInitCtrl.initWithOneCtrl({
        ngpath : '/WebUI/bases/dy/security/js/controllers',
        ngCtrl :'main.js',
        callbackFun:function(){

        },
        runFun :function($rootScope){
          SyApp.syI18n = new SyI18n({url:"/WebUI/bases/dy/security/js/langs/", lang:'en', existLangs: "en,zh"}, $rootScope) //i18n
        },
        configFun : function(){},
        ngmodels:['ngResource', 'ngCookies']
      })
    }
  }
});