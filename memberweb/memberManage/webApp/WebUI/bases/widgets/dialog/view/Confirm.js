define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var confirmView =   WidgetsView.extend({
            tampPathArray : function(){
                return ["text!SY_WIDGET/dialog/view/Confirm.html"];
            },
            buildHtmlByTamplate : function(tampArray){
                var confirmHtml = _.template(tampArray[0]);
                $(this.el).prepend( confirmHtml(this.model) );
                var This = this;

                $(".confirmDialog").dialog({
                        resizable: false,
                        modal: true,
                        close: function( event, ui ) {
                            $(event.target).remove();
                        },
                        buttons: [{
                                text : This.model.attributes.buttons.Yes.lang,
                                class : This.model.attributes.buttons.Yes.class,
                                click: function() {
                                    This.model.contents.callbackFun()
                                    $(this).dialog( "close" );
                                }
                             },
                            {
                                text : This.model.attributes.buttons.No.lang,
                                class : This.model.attributes.buttons.No.class,
                                click : function() {
                                    $(this).dialog( "close" );
                                }
                            }]
                    });
            }

        });
        return confirmView;
    });