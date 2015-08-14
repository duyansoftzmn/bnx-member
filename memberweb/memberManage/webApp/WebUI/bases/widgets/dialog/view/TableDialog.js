define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var TView =   WidgetsView.extend({
            tampPathArray : function(){
                return ["text!SY_WIDGET/dialog/view/TableDialog.html"];
            },
            buildHtmlByTamplate : function(tampArray){
                var tHtml = _.template(tampArray[0]);
                $(this.el).prepend( tHtml(this.model) );
            },
            extensionsListenerAPI : function(){
                var param = {
                    autoOpen: false,
                    modal: true
                }

                if (!!this.model.attributes.width)
                    param.width = this.model.attributes.width;

                $( "#" + this.model.contents.id ).dialog(param).dialog( "open" );
            }

        });
        return TView;
    });