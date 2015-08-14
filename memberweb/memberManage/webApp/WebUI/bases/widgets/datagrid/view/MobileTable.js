define([
    "SY_WIDGET/WidgetsView",
    "css!SY_BASE/jQplugin/bootstrap-switch-master/css4bootstrap3/bootstrap-switch.min.css",
    "bootstrapSwitch"],
    function(WidgetsView){

        var MTableView =   WidgetsView.extend({
            events: {
                "click .ui-switch" : "clickBoolBtn",
                "mousemove .inputTextArea" : "showStringEditor",
                "mouseleave .inputTextArea" : "hideStringEditor",
                "click .inputTextArea .edit" : "editStringInput",
                "click .inputTextArea .update" : "updateStringInput",
                "click .inputTextArea .roleback" : "rolebackStringInput"
            },
            tampPathArray : function(){
                return ["text!SY_WIDGET/datagrid/view/MobileTable.html"];
            },
            updateStringInput : function(event){
                //type : srting,email  handler
                var ThisJo =  $(event.currentTarget);
                var parentJo = ThisJo.parent();
                parentJo.find("i").hide();
                parentJo.find('input').attr("disabled", "disabled");

                if (!!this.model.attributes.ajaxHandler && !!this.model.attributes.ajaxHandler.string)
                    this.model.attributes.ajaxHandler.string(ThisJo.attr("index"), this.model, parentJo.find("input").val(), ThisJo.attr("key"));
            },
            rolebackStringInput : function(event){
                //type : srting,email  handler
                var ThisJo =  $(event.currentTarget);
                var parentJo = ThisJo.parent();
                parentJo.find("i").hide();
                parentJo.find('input').attr("disabled", "disabled");

            },
            editStringInput : function(event){
                //type : srting,email  handler
                var ThisJo =  $(event.currentTarget);
                var parentJo = ThisJo.parent();
                parentJo.find("i").hide();

                ThisJo.hide().attr("stats", "showEdit");
                parentJo.find('.change').fadeIn();
                parentJo.find("input").removeAttr("disabled")
            },
            showStringEditor : function(event){
                //type : srting,email  handler
                var ThisJo =  $(event.currentTarget);

                if (ThisJo.find("input").is(":disabled"))
                    ThisJo.find(".edit").fadeIn();

            },
            hideStringEditor : function(event){
                //type : srting,email  handler
                var ThisJo =  $(event.currentTarget);
                ThisJo.find(".edit").fadeOut();
            },
            clickBoolBtn : function(event){
                //type : bool  handler
                var ThisJo =  $(event.currentTarget);
                var inputJo =  ThisJo.find("input[type='checkbox']");

                var index=inputJo.attr("index"), value=null, key=inputJo.attr("key");
                if (inputJo.attr('value') == 'N')
                {
                    inputJo.bootstrapSwitch('state', true).val('Y');
                    value =  'Y';
                }else {
                    inputJo.bootstrapSwitch('state', false).val('N');
                    value =  'N';
                }
                if (!!this.model.attributes.ajaxHandler && !! this.model.attributes.ajaxHandler.bool)
                    this.model.attributes.ajaxHandler.bool(index, this.model, value, key);
            },
            buildHtmlByTamplate : function(tampArray){
                var This = this;
                var mtableHtml = _.template(tampArray[0]);

                $(This.el).html( mtableHtml(This.model) );

                $(".ui-switch").each(function(){
                    var inputJo = $(this).find('input[type="checkbox"]');
                    if(inputJo.attr('value') == 'Y'){
                        inputJo.bootstrapSwitch('state', true);
                    }else{
                        inputJo.bootstrapSwitch('state', false);
                    }
                });

                $(".slider").each(function(){
                     var key = $(this).attr("id");
                     var param =  This.model.contents.param[key];
                    param.value =  $(this).prev(".inputSliderText").val();

                    $(this).slider({
                        min: param.min,
                        max: param.max,
                        value : param.value,
                        slide: function( event, ui ) {
                            var value =  ui.value
                            var inputSliderTextJo =   $(this).prev(".inputSliderText");
                            inputSliderTextJo.val(value);

                            if (!!This.model.attributes.ajaxHandler && !! This.model.attributes.ajaxHandler.slider)
                                This.model.attributes.ajaxHandler.slider(inputSliderTextJo.attr("index"), This.model, value, inputSliderTextJo.attr("key"));
                        }
                    });
                });

                //type : slider  handler
                $(".inputSliderText").change(function(){
                    var thisJo = $(this);
                    var newValue = thisJo.val();
                    var newValue2 = parseInt(thisJo.val());
                    var key = thisJo.attr("for");
                    var param =  This.model.contents.param[key];

                    if (
                        newValue == newValue2 &&
                            (newValue >=param.min || newValue <=param.max)
                        )
                    {
                        var sliderJo = $("#" + key)
                        sliderJo.slider( "value", newValue );
                        thisJo.attr('backupValue', newValue);

                        if (!!this.model.attributes.ajaxHandler && !!this.model.attributes.ajaxHandler.slider)
                            this.model.attributes.ajaxHandler.slider(thisJo.attr("index"), this.model, newValue);
                    }
                    else
                    {
                        thisJo.val(thisJo.attr('backupValue'));
                    }

                })
            }

        });
        return MTableView;
    });