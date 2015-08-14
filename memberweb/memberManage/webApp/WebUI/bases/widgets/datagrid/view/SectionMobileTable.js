define(
    ["SY_WIDGET/datagrid/view/MobileTable"],
    function( MobileTable ){

        var TabTableView =   MobileTable.extend({
            tampPathArray : function(){
                return ["text!SY_WIDGET/datagrid/view/SectionMobileTable.html"];
            },
            extensionsListenerAPI : function(){
                $(".sectionMobileTable").accordion({
                    collapsible: true
                });
            }

        });
        return TabTableView;
    });