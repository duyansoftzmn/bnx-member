define(
    ["SY_WIDGET/datagrid/view/TabTable"],
    function(TabTable){

        var TabTableView =   TabTable.extend({
            tampPathArray : function(){
                return ["text!SY_WIDGET/datagrid/view/TabTable.html", "text!SY_WIDGET/datagrid/view/module/selectableTable2.html"];
            },
            buildHtmlByTamplate : function(tampArray){
                var tabHtml = _.template(tampArray[0]);
                $(this.el).html( tabHtml(this.model) );

                this.model.tampArray = tampArray;

                if (!this.model.contents.isDisableTab)
                {
                    $( "#tabTableBox-"+ this.model.contents.id ).tabs({
                        active: 0
                    });
                }

                this._initDefaultTabContent();
            }

        });
        return TabTableView;
    });