define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var TView =   WidgetsView.extend({
            tampPathArray : function(){
                return ["text!SY_WIDGET/dialog/view/Textarea.html"];
            },
            buildHtmlByTamplate : function(tampArray){
                var tHtml = _.template(tampArray[0]);
                $(this.el).prepend( tHtml(this.model) );
            },
            extensionsListenerAPI : function(){
                $( "#" + this.model.contents.id ).dialog({
                    autoOpen: false,
                    modal: true
                }).dialog( "open" );
            }

        });
        return TView;
    });