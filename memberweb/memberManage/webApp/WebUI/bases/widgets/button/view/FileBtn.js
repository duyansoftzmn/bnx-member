define(
    ["SY_WIDGET/WidgetsView"],
    function(WidgetsView){

        var FileBtnView =   WidgetsView.extend({
            tampPathArray : function(){
                return ["text!SY_WIDGET/button/view/FileBtn.html"];
            },
            buildHtmlByTamplate : function(tampArray){

                for (i in this.model.attributes.btns) {
                    var btnParam = this.model.attributes.btns[i];
                    var btnHtml = _.template(tampArray[0]);

                    $(btnParam.targetSelector).html( btnHtml({param : btnParam}) );

                    $("#" + btnParam.fileId).change(function(){
                        var ThisJo =  $(this);

                        var forParam = ThisJo.attr("for");
                        if (!!forParam)
                            $("#" +forParam).val(ThisJo.val())
                    });
                }
            }
        });
        return FileBtnView;
    });