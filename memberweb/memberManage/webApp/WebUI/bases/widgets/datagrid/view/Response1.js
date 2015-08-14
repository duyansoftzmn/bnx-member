define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var DatagridView =   WidgetsView.extend({
            events : {
                "click .datagrid" : "clickDatagridItem",
                "mouseenter .datagridParam" : "mouseenterParams" ,
                "click #dgItemsTable tr"  : "switchActiveInTab",
                "click .dropdown-menu li" : "changeColumn",
                "click #searchBtn" : "startFilter",
                "click #searchAdvBtn" : "showAdvSearch",
                "click #toggleTableView" : "toggleTableView",
                "click #advSearchBtn" : "startAdvFilter",
                "mouseover #advSearch li" : "showSortBtn",
                "click .sortBtn" : "doSort",
                "click #loadMore" : "loadMoreItems"
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/datagrid/view/Response1.html"];
            },
            loadMoreItems : function(event){
//                var ThisJo =  $(event.currentTarget);
//                var page = parseInt(ThisJo.attr("page"))
            },
            _toggleSort : function(ThisJo){
                var sortOrder =  "desc";
                if (ThisJo.attr("sort") == sortOrder)
                {
                    ThisJo.attr("sort", 'asc').removeClass("fa-sort-desc").addClass("fa-sort-asc");
                    sortOrder = 'asc';
                }
                else if (ThisJo.hasClass("fa-sort-asc"))
                {
                    ThisJo.attr("sort", 'desc').removeClass("fa-sort-asc").addClass("fa-sort-desc");
                }

                return sortOrder;
            },
            doSort : function(event){
                var This = this;
                var ThisJo =  $(event.currentTarget);
                var prevInputJo = ThisJo.prev();
                var sortOrder =  this._toggleSort(ThisJo);
                var loadMoreJo = $("#loadMore");



                var param =  {
                    order : sortOrder,
                    page :  loadMoreJo.attr("page"),
                    rows : loadMoreJo.attr("rows"),
                    sort :  prevInputJo.attr("key")
                };

                ThisJo.attr("selected", "selected");

                $.post(This.model.attributes.dataSourceUrl, param, function(data){
                    This.rebuildDataView(data);
                });
            },
            showSortBtn : function(event){
                var ThisJo =  $(event.currentTarget);
                $(".sortBtn").hide();
                ThisJo.find(".sortBtn").show();
            },
            clickDatagridItem : function(event){
                if( !$(event.target).hasClass("btn") && !$(event.target).hasClass("ibtn"))
                {
                    var ThisJo =  $(event.currentTarget);
                    var dgId = ThisJo.attr("dgid");

                    ThisJo.toggleClass("active");
                    ThisJo.find(".showAll").toggleClass("active");
                    $("#dgItemsTable tr[dgid='"+dgId+"']").toggleClass("active");
                }

            },
            mouseenterParams : function(event){
                var ThisJo = $(event.currentTarget);
                ThisJo.parent().find(".datagridParamText").hide();
                ThisJo.find(".datagridParamText").show();
                ThisJo.tooltip('show');

                ThisJo.popover({
                    placement : "bottom",
                    content : ThisJo.attr("content")
                })
            },
            switchActiveInTab : function(event){
                var ThisJo = $(event.currentTarget);
                ThisJo.toggleClass("active");
                var dgId = ThisJo.attr("dgid");

                var   datagridItemJo =  $(".datagrid[dgid='"+dgId+"']");
                datagridItemJo.toggleClass("active");
                datagridItemJo.find(".showAll").toggleClass("active");

            },
            changeColumn : function(event){
                var ThisJo = $(event.currentTarget);

                $("#searchColumn").html(ThisJo.text() + ' <span class="caret"></span>').attr("key",ThisJo.attr('key') );

                $(".datagrid").each(function(){
                       var thisDatagridJo = $(this);
                       var key = ThisJo.attr("key");


                        if (key == "All")
                        {
                            $(".showOne").hide();
                            $(".showAll").show();

                            if (!$("#searchAdvBtn").hasClass("btn-success"))
                            {
                                $("#searchAdvBtn").addClass("btn-success");
                                $("#advSearch").slideDown();
                            }

                            $("#searchText").attr("disabled", "disabled")
                        }
                        else
                        {
                            $(".showAll").hide();
                            $(".showOne").show();
                            var vItem = $(".datagridParam[key="+key+"]");
                            var title = vItem.attr('data-original-title');
                            var content = vItem.attr('content');
                            thisDatagridJo.find(".vTitle").html(title);
                            thisDatagridJo.find(".vContent").html(content);
                            $("#searchText").removeAttr("disabled");
                        }

                });

            },
            startFilter : function(){
                var searchTextJo = $("#searchText");
                var val = searchTextJo.val();

                if (!searchTextJo.is(":disabled") )
                {
                    var filter	= val.length > 0 ?  '[{"Name":"' + $("#searchColumn").attr("key")+'","Value":"^' +val +'" ,"Mode":0}]': "";
                    this.requestNewData(filter);
                }
            },
            startAdvFilter : function(){
                var filter	= "";
               $(".advFilterItem").each(function(){
                     var This = $(this);
                     var value =  This.val();
                     if (value.length > 0) {
                         if (filter.length > 0)
                             filter += ',{"Name":"' + This.attr("key")+'","Value":"^' +value +'" ,"Mode":0}';
                         else
                            filter += '{"Name":"' + This.attr("key")+'","Value":"^' +value +'" ,"Mode":0}';
                     }

               });

                filter = filter.length > 0 ? "[" + filter + "]" : filter;

                this.requestNewData(filter);
            },
            showAdvSearch : function(){
                $("#searchAdvBtn").toggleClass("btn-success");
                $("#advSearch").slideToggle();
            },
            requestNewData : function(filter){
                var This =  this;
                var param =  {
                    filter : filter,
                    order	: This.model.attributes.order,
                    page :  This.model.attributes.page,
                    rows : This.model.attributes.rows,
                    sort :  This.model.attributes.searchKeySort
                };

                $.post(This.model.attributes.dataSourceUrl, param, function(data){
                    This.rebuildDataView(data);
                });
            },
            rebuildDataView : function(data){
                var choices = this._getMaintainChoices(data)
                this.render();
                this._maintainChoices(choices)
            },
            _getMaintainChoices : function(data){
                data = (_.isString(data))? $.parseJSON(data):data;
                this.model.contents.rows = data.rows;
                var selectedSortBtnJo = $(".sortBtn[selected='selected']");

                var choices = {
                    sortKey :selectedSortBtnJo.prev().attr("key"),
                    sort :  selectedSortBtnJo.attr("sort"),
                    searchVal : $("#searchText").val(),
                    isTableClicked : $("#searchText").hasClass('toggle'),
                    isClickSearchAdvBtn : $("#searchAdvBtn").hasClass('btn-success'),
                    searchedColumnHtml : $("#searchColumn").html()
                }

                return  choices;
            },
            _maintainChoices : function(choices){
                $("#searchText").val(choices.searchVal);
                var sortInputJo = $(".advFilterItem[key='"+choices.sortKey+"']");
                var sortBtnJo =  sortInputJo.next();

                sortBtnJo.show();
                if (this.model.attributes.order != choices.sort) {
                    sortBtnJo.attr("sort", choices.sort).removeClass("fa-sort-" + this.model.attributes.order).addClass("fa-sort-" + choices.sort)
                }

                if (choices.isTableClicked )
                    $("#searchText").addClass('toggle');

                if (choices.isClickSearchAdvBtn ){
                    $("#searchAdvBtn").addClass('btn-success');
                    $("#advSearch").show();
                }

                $("#searchColumn").html(choices.searchedColumnHtml);
            },
            toggleTableView : function(event){
                $(event.currentTarget).toggleClass("toggle");

                var tableHead = [];
                tableHead.push('<tr>');
                $(".searchKey a").each(function(){
                    tableHead.push("<th>")
                    tableHead.push($(this).html())
                    tableHead.push("</th>")
                });
                tableHead.push('</tr>');
                $("#dgItemsTable thead").html(tableHead.join(""));

                var tableBody = [];

                $(".showAll").each(function(){
                    var thisShowAllBoxJo = $(this);

                    tableBody.push("<tr dgid='");
                    tableBody.push(thisShowAllBoxJo.parent().attr("dgid"));
                    var classStr = thisShowAllBoxJo.hasClass("active")? "' class='active'>" : "'>";
                    tableBody.push(classStr);

                    thisShowAllBoxJo.find("li").each(function(){
                        tableBody.push('<td>');
                        tableBody.push($(this).text());
                        tableBody.push('</td>');
                    });
                    tableBody.push('</tr>');
                });

                $("#dgItemsTable tbody").html(tableBody.join(""));

                $("#dgItems").toggle();
                $("#dgItemsTable").toggle();
            },
            buildHtmlByTamplate : function(tampArray){
                var datagridHtml = _.template(tampArray[0]);
                $(this.el).html( datagridHtml(this.model) );
            }
        });

    return DatagridView;
});