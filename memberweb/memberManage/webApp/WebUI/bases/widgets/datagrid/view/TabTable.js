define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var TabTableView =   WidgetsView.extend({
            initialize : function(){
                this.model.contents.id = (new Date()).getTime();
            },
            events: {
                "click .tabTitle" : "switchTab"
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/datagrid/view/TabTable.html", "text!SY_WIDGET/datagrid/view/module/selectableTable1.html"];
            },
            switchTab : function(event){
                var This = this;
                var ThisJo =  $(event.currentTarget);
                var tabid = parseInt(ThisJo.attr('tabid'));
                var attributes = this.model.attributes[tabid];
                $.post(attributes.dataSourceUrl, {
                    order :	attributes.order,
                    page :	attributes.page,
                    rows :	attributes.rows,
                    sort :	attributes.defaultKey
                },
                function(data){
                    var domId = tabid +1;
                    data = (_.isString(data))? $.parseJSON(data):data;

                    This._refreshNewData("#tabs-"+ domId + "-" + This.model.contents.id, attributes, data);
                });
            },
            _getObjectFortemplate : function(attributes, contents){
                var objForTmp = {
                    attributes :  attributes,
                    selector : attributes.selector.replace("#",''),
                    contents :  contents,
                    lang : this.model.lang
                };

                return objForTmp;
            },
            _refreshNewData : function(tabBodyDomId, attributes, contents){
                var This = this;
                var objForTmp = this._getObjectFortemplate(attributes, contents);
                var tableHtml =   _.template(this.model.tampArray[1]);
                var tableHtmlStr = tableHtml(objForTmp);
                $(tabBodyDomId).html(tableHtmlStr);

                $(attributes.selector + " li").click(function(){
                    var thisJo = $(this);
                    if (!!This.model.attributes[0].singleSelect) {
                        //for single select mode
                        var isSelected = thisJo.hasClass('selected');
                        $(This.el).find(".selectable li.selected").removeClass("selected");
                        $(This.el).find(".selectable li .status").hide();

                        if (!isSelected) {
                            thisJo.addClass("selected");
                            thisJo.find(".status").show();
                        }
                    } else{
                        thisJo.toggleClass("selected");
                        thisJo.find(".status").toggle();
                    }
                });

                for (i in This.model.attributes[0].tools) {

                    $(".st1handle" + This.model.attributes[0].tools[i].key).click(function(){
                        var key = $(this).attr('key');
                        var handleObj = This.model.attributes[0].tools[key];
                        handleObj.event($(this).attr('index'), This.model);
                    })
                }


            },
            _initDefaultTabContent : function(){
                  this._refreshNewData("#tabs-1-"+ this.model.contents.id, this.model.attributes[0], this.model.contents);
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