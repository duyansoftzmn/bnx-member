define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var NavBarView =   WidgetsView.extend({
            "rightItemsHtml"  : "",
            events: {
                "click .dropdown-toggle"                : "dropdownToggle"
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/navBar/view/NavTopFixed1.html"];
            },
            dropdownToggle : function(){
                $('.dropdown-toggle').dropdown()
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