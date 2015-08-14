define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var DatagridView =   WidgetsView.extend({
            events : {
                "click .datagrid" : "clickDatagridItem",
                "mouseenter .datagridParam" : "mouseenterParams" ,
                "click .dgItemsTable tr"  : "switchActiveInTab",
                "click .dropdown-menu li" : "changeColumn",
                "click #searchBtn" : "startFilter",
                "click #searchAdvBtn" : "showAdvSearch",
                "click #toggleTableView" : "toggleTableView",
                "click #advSearchBtn" : "startAdvFilter",
                "mouseover #advSearch li" : "showSortBtn",
                "click .sortBtn" : "doSort",
                "click .loadmoreBtn" : "loadMoreItems",
                "click .datagrid .showDetail" : "showDetailInfo",
                "keydown #searchText" : "keydownEnterForSearch"
            },
            keydownEnterForSearch : function(event){
                if(event.keyCode==13){
                   this.startFilter();
                }
            },
            showDetailInfo : function(event){
                var ThisJo =  $(event.currentTarget);
                ThisJo.parents(".datagrid").find(".detailpop").fadeToggle();
            },
            loadMoreItems : function(event){
                var ThisJo =  $(event.currentTarget);
                var page = parseInt(ThisJo.attr("page"))
                ThisJo.remove();

                this.requestNewData(this.model.attributes.filter, page + 1, 'loadMore');
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
                var loadMoreJo = $(this.el).find(".loadmoreBtn");

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
                if( !$(event.target).hasClass("btn") && !$(event.target).hasClass("ibtn") && !$(event.currentTarget).hasClass(".loadmoreBtn"))
                {
                    var ThisJo =  $(event.currentTarget);
                    var dgId = ThisJo.attr("dgid");

                    ThisJo.toggleClass("active");
                    ThisJo.find(".showAll").toggleClass("active");
                    $(this.el).find(".dgItemsTable tr[dgid='"+dgId+"']").toggleClass("active");
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
                var defaultItem =  ThisJo.text();
                defaultItem =  (defaultItem.length > 12)?  defaultItem.substring(0, 10) + "..": defaultItem;

                $("#searchColumn").html(defaultItem + ' <span class="caret"></span>').attr("key",ThisJo.attr('key') );

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
                            var vlabel = thisDatagridJo.find("label[key="+key+"]");
                            var title = vlabel.text();
                            var content = vlabel.next().text();
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
                    this.requestNewData(filter, 0);
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

                this.requestNewData(filter, 0);
            },
            showAdvSearch : function(){
                $("#searchAdvBtn").toggleClass("btn-success");
                $("#advSearch").slideToggle();
                var searchBtnJo = $("#searchBtn");
                var searchTextJo = $("#searchText");

                if (searchTextJo.is(":disabled")){
                    searchTextJo.removeAttr("disabled");
                    searchBtnJo.removeAttr("disabled");
                }
                else {
                    searchTextJo.attr("disabled","disabled");
                    searchBtnJo.attr("disabled","disabled");
                }


            },
            requestNewData : function(filter, pageNumber, _type){
                var This =  this;
                var param =  {
                    order	: This.model.attributes.order,
                    rows : This.model.attributes.rows,
                    sort :  This.model.attributes.searchKeySort
                };

               if (!!filter){
                   param.filter = filter;
                   This.model.attributes.filter  = filter;
               }


               if (!!pageNumber)  {
                   This.model.attributes.page = pageNumber;
               }

                param.page =  This.model.attributes.page;


                $.post(This.model.attributes.dataSourceUrl, param, function(data){
                    This.rebuildDataView(data, _type);
                });
            },
            rebuildDataView : function(data, _type){
                this._getMaintainChoices(data);

                if (_type == 'loadMore')  {
                    var datagridHtml = _.template(this.model.tampArray[0]);
                    this.model.attributes.isloadMore = "1";
                    $(this.el).find(".dgItems").append( datagridHtml(this.model) );
                }
                else
                    this.render();

            },
            _getMaintainChoices : function(data){
                data = (_.isString(data))? $.parseJSON(data):data;
                var This = this;
                this.model.contents.rows = data.rows;
                this.model.contents.total = data.total;
                var selectedSortBtnJo = $(".sortBtn[selected='selected']");

                this.model.maintainData = {
                    sortKey :selectedSortBtnJo.prev().attr("key"),
                    sort :  selectedSortBtnJo.attr("sort"),
                    searchVal : $("#searchText").val(),
                    isTableClicked : $("#searchText").hasClass('toggle'),
                    isClickSearchAdvBtn : $("#searchAdvBtn").hasClass('btn-success'),
                    searchedColumnHtml : $("#searchColumn").html(),
                    isAdvSearchHidden : $("#advSearch").is(":hidden") ? true : false
                }

                $('.advFilterItem').each(function(){
                    var thisJo = $(this);
                    var key =   thisJo.attr("key");
                    This.model.maintainData[key] =  thisJo.val();
                })

            },
            _maintainChoices : function(){
                var choices = this.model.maintainData;
                if (!choices)
                    return;


                $("#searchText").val(choices.searchVal);
                var sortInputJo = $(".advFilterItem[key='"+choices.sortKey+"']");
                var sortBtnJo =  sortInputJo.next();

                sortBtnJo.show();
                if (this.model.attributes.order != choices.sort) {
                    sortBtnJo.attr("sort", choices.sort).removeClass("fa-sort-" + this.model.attributes.order).addClass("fa-sort-" + choices.sort)
                }

                $('.advFilterItem').each(function(){
                    var thisJo = $(this);
                    var key =   thisJo.attr("key");
                    thisJo.val(choices[key]);
                })

                if (choices.isTableClicked )
                    $("#searchText").addClass('toggle');

                if (choices.isClickSearchAdvBtn ){
                    $("#searchAdvBtn").addClass('btn-success');
                    $("#advSearch").show();
                }

                $("#searchColumn").html(choices.searchedColumnHtml);

                if (choices.isAdvSearchHidden){
                    $("#advSearch").show();
                    $("#searchText, #searchBtn").attr("disabled");
                    $("#searchAdvBtn").addClass("btn-success");
                }

                this.model.maintainData = null;
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
                $(this.el).find(".dgItemsTable thead").html(tableHead.join(""));

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

                $(this.el).find(".dgItemsTable tbody").html(tableBody.join(""));

                $(this.el).find(".dgItems").toggle();
                $(this.el).find(".dgItemsTable").toggle();
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/datagrid/view/Response2.html"];
            },
            buildHtmlByTamplate : function(tampArray){
                var datagridHtml = _.template(tampArray[0]);
                this.model.attributes.isloadMore = "0";
                this.model.tampArray = tampArray;

                $(this.el).html( datagridHtml(this.model) );

                this._maintainChoices()
            }
        });

    return DatagridView;
});