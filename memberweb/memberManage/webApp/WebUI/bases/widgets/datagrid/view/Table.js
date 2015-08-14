define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var TabTableView =   WidgetsView.extend({
            events: {
               "click .toolColumn.body a"  : "toolClickEvent"
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/datagrid/view/Table.html"];
            },
            toolClickEvent : function(event){
                var ThisJo =  $(event.currentTarget);
                var key = ThisJo.attr('key');
                var index = ThisJo.attr('index');

                var theTool = this.model.attributes.toolColumn.tools[key];

                if (_.isFunction(theTool.event))
                    theTool.event(this.model, index);
            },
            buildHtmlByTamplate : function(tampArray){
                var tabHtml =  _.template(tampArray[0]);
                $(this.el).html( tabHtml(this.model) );

            }

        });
        return TabTableView;
    });
