define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var RichView =   WidgetsView.extend({
            tampPathArray : function(){
                return ["text!SY_WIDGET/dialog/view/RichDialog.html"];
            },
            buildHtmlByTamplate : function(tampArray){
                var richHtml = _.template(tampArray[0]);
                $(this.el).prepend( richHtml(this.model) );
                var This = this;

                $("#" + this.model.contents.id).dialog({
                    modal: true,
                    width:  This.model.attributes.width,
                    buttons :This.model.attributes.buttons,
                    close: function( event, ui ) {
                        $(event.target).remove();
                    }
                });
            }
        });
        return RichView;
    });