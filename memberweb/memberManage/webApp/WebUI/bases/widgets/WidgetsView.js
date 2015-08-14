define(
    ["backbone", "underscore",  "jquery.bootstrap", "jquery.ui"],
    function(Backbone, _){

        var WidgetsView =   Backbone.View.extend({
            initialize : function(){
                this.model.contents.id = (new Date()).getTime();
            },
            tampPathArray : function(){
                return [];
            },
            _requireTamp : function(){
                var tamp = this.tampPathArray();
                var This = this;
                require(tamp, function(){
                    This.buildHtmlByTamplate(arguments)
                    This.extensionsListenerAPI();
                    This.model.syWgCallbackFun();
                });
            },
            buildHtmlByTamplate : function(tampArray){

            },
            extensionsListenerAPI: function(){},
            render : function(){
                this._requireTamp();
                return this;
            }

        });
        return WidgetsView;
    });