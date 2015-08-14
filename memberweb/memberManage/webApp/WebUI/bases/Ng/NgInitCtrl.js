/*
useAge
1, init with dom tmp insert
 NgInitCtrl.init({
    ngpath : 'PROD_DIR/Ng',
    widget : [{ng:'createSite', selector:'body', insertFun : 'append', tmpUrl:'/kkk/mmm'}],
    callbackFun : function(){},    
    runFun : function(){},  
    configFun : function(){},
    ngmodels : [] 
 });

 // ngmodels : ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngAnimate', 'ui.tinymce']   -> only 6
 // add more check sy.js

2, init with single Ctrl
NgInitCtrl.initWithOneCtrl({
    ngpath : 'PROD_DIR/Ng',
    ngCtrl :'demo',
    callbackFun : function(){

    },
    runFun : function(){},
    configFun : function(){},
    ngmodels : [] 
});




// tmpUrl: optional, it is for get jsp or c# template by ajax
 ****You only can use init function once in a page. ****
 */
define(['underscore'],function(_){
    var AngularLoader = {
        ngpath : 'PROD_DIR/Ng',
        widget : [],
        callbackFun : function(){},
        _basesInit : function(data){
            this.callbackFun = data.callbackFun;
            this.runFun = data.runFun;
            this.configFun = data.configFun;
            this.bootstrapCaller = data.bootstrapCaller;

            this.ngmodels = [];
            if (data.ngmodels && _.isArray(data.ngmodels))
                this.ngmodels = data.ngmodels;
        },
        init : function(data){
            if (!!data.ngpath)
                this.ngpath = data.ngpath;

            this.widget = data.widget;
            this._basesInit(data);

            this.insertNgTmpAndCtrl();
          },
        initWithOneCtrl : function(data){

            var This = this;
            this._basesInit(data);

            this.setNameSpace(function(ngAppStr){
                var ctrlPath = data.ngpath + '/' + data.ngCtrl;

                require([ctrlPath], function(){
                    This._initNgDone(ngAppStr);
                });                                

            });
        },
        _initNgDone : function(ngAppStr){
            var This = this,
                bootstrap = function(){
                    angular.element(document).ready(function() {
                        angular.bootstrap(document.body, [ngAppStr]);
                        This.callbackFun();
                    });
                }

            if (this.configFun && _.indexOf(this.ngmodels, 'ngRoute') != -1){
                SyApp.NG.config(function($routeProvider){
                    This.configFun($routeProvider);
                });
            }

            if (this.runFun){
                SyApp.NG.run(function($rootScope){
                    This.runFun($rootScope);
                });
            }
            if(typeof this.bootstrapCaller == 'function'){
                this.bootstrapCaller(bootstrap);
            }else{
                bootstrap();
            }

        },
        setNameSpace :function(callbackFun){

            var This = this;
            var tmparray = _.union(['angular'], This.ngmodels);
            var ngAppStr = 'SyNgApp';

            require(tmparray, function(){

                // var topTag = $('[ng-app]');
                // var ngAppStr = topTag.attr('ng-app')
                // if (!!ngAppStr && ngAppStr.length > 0){
                //     SyApp.NG =  angular.module(ngAppStr, This.ngmodels);
                // }
                // else{
                //     ngAppStr = 'SyNgApp';
                //     $('html').attr('ng-app', ngAppStr);
                //     SyApp.NG =  angular.module(ngAppStr, This.ngmodels);

                // }

                SyApp.NG =  angular.module(ngAppStr, This.ngmodels);
                callbackFun(ngAppStr);
            });
        },
        loadUrlTmp : function(urlTmp,callbackFun){
            var This = this;

            if (urlTmp.length == 0)
                callbackFun();
            else {
                var widget =  urlTmp.pop();
                $.get(widget.tmpUrl, function(data){
                    var widgetJo =  $(widget.selector);
                     if ( widgetJo.length > 0)
                           widgetJo[widget.insertFun](data);
                    This.loadUrlTmp(urlTmp,callbackFun);
                })
            }

        },
        insertNgTmpAndCtrl : function(){
            var tmp = [], urlTmp = [], ctrls = [];
            var This = this;

            for ( i in this.widget)
            {
                var widget =   this.widget[i];
                if (!!widget.tmpUrl && widget.tmpUrl.length > 0)
                    urlTmp.push(widget);
                else
                    tmp.push('text!'+this.ngpath + '/' + widget.ng + '.html' );

                ctrls.push(this.ngpath + '/' + widget.ng);
            }


            this.loadUrlTmp(urlTmp, function(){
                This.setNameSpace(function(ngAppStr){
                    var rquireList  = tmp.concat(ctrls);
                    require(rquireList, function(){
                        var len =  tmp.length, i ,thisWidget;
                        for ( argNum in arguments)
                        {
                            if (argNum <  len ) {
                                // load template
                                thisWidget  = This.widget[argNum];
                                $(thisWidget.selector)[thisWidget.insertFun](arguments[argNum]);
                            }
                        }

                        // after require init angular
                        This._initNgDone(ngAppStr);

                    }) //require
                }); //setNameSpace
            }); //loadUrlTmp

        }
    };

    return AngularLoader;
});