define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var ListSelector =   WidgetsView.extend({
            events : {
                "click .listSelector .list li" : "toggleFocusItem",
                "click .listSelector .selectAllBtn" : "toggleSelectBtn",
                "keyup .listSelector .filter"  : "filteInList",
                "click .listSelector .toolBar button"  : "clickToolBarBtn"
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/selector/view/ListSelector.html"];
            },
            clickToolBarBtn : function(event){
                var ThisJo =  $(event.currentTarget);
                var todo = ThisJo.attr('todo');

                switch(todo)
                {
                    case "add":
                        $(this.el).find(".left .list li.selected").appendTo( $(this.el).find(".right .list")).removeClass("selected").find(".status").hide();
                        break;
                    case "addAll":
                        $(this.el).find(".left .list li").appendTo( $(this.el).find(".right .list")).removeClass("selected").find(".status").hide();
                        break;
                    case "remove":
                        $(this.el).find(".right .list li.selected").appendTo( $(this.el).find(".left .list")).removeClass("selected").find(".status").hide();
                        break;
                    case "removeAll":
                        $(this.el).find(".right .list li").appendTo( $(this.el).find(".left .list")).removeClass("selected").find(".status").hide();
                        break;

                }
            },
            filteInList : function(event){
                var ThisJo =  $(event.currentTarget);
                var side =  ThisJo.attr("for");
                var typingText = ThisJo.val().toLowerCase();

                $(this.el).find("." + side + ' .list li').each(function(){
                    var thisText = $(this).text().toLowerCase().replace(/\s/ig, "");
                    console.log(typingText);
                    console.log(thisText)
                    if (thisText.indexOf(typingText) != -1) {
                        $(this).show();
                    }
                    else  {
                        $(this).hide();
                    }

                });
            },
            toggleSelectBtn : function(event){
                var ThisJo =  $(event.currentTarget);
                var side =  ThisJo.attr("for");
                var isChecked =  ThisJo.is(":checked");

               $(this.el).find("." + side + ' .list li').each(function(){
                   var ThisJo = $(this);
                   if (isChecked){
                       ThisJo.addClass("selected")
                       ThisJo.find(".status").show();
                   }
                   else {
                       ThisJo.removeClass("selected");
                       ThisJo.find(".status").hide();
                   }

               });
            },
            toggleFocusItem : function(event){
                var ThisJo =  $(event.currentTarget);
                if (ThisJo.hasClass("selected"))
                {
                    ThisJo.removeClass("selected");
                    ThisJo.find(".status").hide();
                }
                else
                {
                    ThisJo.addClass("selected");
                    ThisJo.find(".status").show();
                }


            },
            buildHtmlByTamplate : function(tampArray){
                var lsHtml = _.template(tampArray[0]);
                $(this.el).html( lsHtml(this.model) );
                this.extensionsListenerAPI(this.model);
                return this;
            }
        });
        return ListSelector;
    });