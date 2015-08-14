define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var NavBarView =   WidgetsView.extend({
            "rightItemsHtml"  : "",
            events: {
                "click .dropdown-toggle"                : "dropdownToggle",
                "click .dropdown-menu > li > a.trigger"                : "dropSubMenu",
                "click .dropdown-menu > li > a:not(.trigger)"          : "hideSubMenu"
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/navBar/view/NavTopFixed2.html"];
            },
            dropdownToggle : function(){
                $('.dropdown-toggle').dropdown()
            },
            dropSubMenu : function(e){
                var current=$(this).next();
                var grandparent=$(this).parent().parent();
                if($(this).hasClass('left-caret')||$(this).hasClass('right-caret'))
                    $(this).toggleClass('right-caret left-caret');
                grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
                grandparent.find(".sub-menu:visible").not(current).hide();
                current.toggle();
                e.stopPropagation();
            },
            hideSubMenu : function(){
                var root=$(this).closest('.dropdown');
                root.find('.left-caret').toggleClass('right-caret left-caret');
                root.find('.sub-menu:visible').hide();
            },
            buildHtmlByTamplate : function(tampArray){
                var navBarHtml = _.template(tampArray[0]);

                if (!_.isEmpty(this.model.templateSelector))
                {

                    var rightNavBarHtml =  _.template($( this.model.templateSelector).html());
                    this.rightItemsHtml =  rightNavBarHtml();
                }

                this.model.rightItemsHtml =  this.rightItemsHtml;
                $(this.el).html( navBarHtml(this.model) );
            }

    });
    return NavBarView;
});