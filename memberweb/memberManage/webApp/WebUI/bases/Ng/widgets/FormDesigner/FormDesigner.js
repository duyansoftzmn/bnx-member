
/***********code by Jian**********************
*----------------------Save API---------------------------
*add onmessage event in parents window

*run  JSON.parse(event.data)
*
*click save widget will post message to parent frame with data :
* {
*   form:form obj,
*   cmd:formDesignerSave
* }
*--------------defaultValue API------------------------
*2 load ready api
 * when widget load ok ,widget will post message to parent frame with data:
 * {
 *  cmd:'formDesignerLoad'
 * }
*when parent frame receive this message ,parent frame should postMessage to this widget with data:
 *{
 * variables : obj,
 * form: form obj
 *  cmd : 'setDefaultValue'
 * }


demo:
            window.onmessage = function (event) {
                var msgRec =event.data;
                if(msgRec.cmd=='formDesignerSave'){
                    msgRec.form.modifiedDate = Date.now();
                    FormService.create(msgRec.form).$promise.then(function (data) {
                        _updateForm(data.forms);
                        $modalInstance.close();
                    });
                }else if(msgRec.cmd=='formDesignerLoad'){
                    var data={};
                    data.msgUrl=window.location.origin;
                    data.variables=varJson;
                    data.form=formmaker;
                    data.cmd='setDefaultValue';
                    document.getElementById('dyFormDesigner').contentWindow.postMessage(data,window.location.origin);
                }
            };

*
* 
*/


define([
    "underscore",  
    "text!SY_NG_WIDGET/FormDesigner/PerviewFormTmp.html",
    "text!SY_NG_WIDGET/FormDesigner/PreviewNgMobileFormTmp.html",
    "text!SY_NG_WIDGET/FormDesigner/PreviewJqMobileFormTmp.html",
    'tinyMCE',
    'SY_BASE/syUtil',
    'ngShareMoudle',
    'jquery.bootstrap',
    'SY_BASE/Ng/directive/pageEditor'
    ], function (_, PerviewFormTmp, PreviewNgMobileFormTmp, PreviewJqMobileFormTmp, tinyMCE, SyUtil) {

    SyApp.NG.controller('Ng.FormDesignerCtrl', ['$scope', function($scope) {
        $scope.pageEditorConfig = {
            data:{
                html:'',
                css:''
            },
            components:['inputGroup', 'input','textarea','number','date','checkbox','table','row','button','hr','richText','feedback','start'],
            componentsPath : '/WebUI/bases/Ng/directive/pageEditorComponents',
            variables:{}
        };
        $scope.runPageEditor = false;

        $scope.variables = '{}';

        $scope.form = {
            'name' : '',
            'description' : '',
            'website' : {
                "html" : '',
                'css' : '',
                'pageSize' : 'a4'
            },
            'mobile' : {
                "html" : '',
                'css' : '',
                'pageSize' : 'jqMobile'
            }
        };

        $scope.currentFormType = 'website';
        $scope.formTmp = $scope.form[$scope.currentFormType];


        //var _decodeWidget = function(html){
        //    var tmp, tmpData, re =/wgtdata=\"[^"]*\"/g;
        //    var wgtdata = html.match(re);
        //
        //    for (var i in wgtdata)
        //    {
        //        tmpData = wgtdata[i].replace('wgtdata="', '').replace('"', '');
        //        tmpData = JSON.parse(decodeURIComponent(tmpData));
        //
        //        var viewHtml = "<!--<%=div.id%>><!--><wdgbody id='<%=div.id%>'>";
        //        viewHtml = viewHtml + "<input style='display:none', ng-model='<%=input.ngModel%>' id='<%=div.id%>input'/>"
        //        viewHtml = viewHtml + "<iframe height='100%' width='100%' frameborder='0' src='/painting/index.php?showChart/wid/<%=iframe.wgtId%>#ifr=<%=div.id%>'></iframe></wdgbody><!--/<%=div.id%>><!-->"
        //
        //        viewHtml = _.template(viewHtml);
        //        var htmlTmp = viewHtml(tmpData);
        //
        //        html = html.replace("<"+tmpData.div.id+"><div class=\"dyWidgetPreImg\"></div></"+tmpData.div.id+">", htmlTmp);
        //    }
        //
        //
        //    html = html.replace(/ng-model/g, "oldmodel");
        //    html = html.replace(/ngmodel/g, "ng-model");
        //
        //    return html;
        //};
        //
        //var _encodeWidget = function(html){
        //    var tmp, wgtId, reg, re =/wdgbody id=\'[^']*\'/g;
        //    var wgtBodys = html.match(re);
        //
        //    for (var i in wgtBodys){
        //
        //        wgtId = wgtBodys[i].replace("wdgbody id='", '').replace("'", '');
        //        reg=new RegExp("<!--"+wgtId+"><!-->.*<!--/"+wgtId+"><!-->");
        //        html = html.replace(reg, "<"+wgtId+">Widget</"+wgtId+">");
        //    }
        //
        //    html = html.replace(/ng-model/g, "ngmodel");
        //    return html;
        //}

        var _getHTMLfromEditor = function(){
            //var tmpHtml = tinymce.activeEditor.getContent({ format:'raw'});
            //tmpHtml = _decodeWidget(tmpHtml);
            var tmpHtml = $scope.pageEditorConfig.data.html;
            return tmpHtml;
        }

        var _setHTMLtoEditor = function(html){
            //html = _encodeWidget(html);
            //tinymce.activeEditor.setContent(html, {format : 'raw'});
        }

        //$scope.switchType = function(type){
        //    if ($scope.currentFormType == type)
        //        return;
        //
        //    $scope.form[$scope.currentFormType].css = $scope.formTmp.css;
        //
        //    if(type == "website")
        //        $scope.form[$scope.currentFormType].html = _getHTMLfromEditor();
        //
        //    $scope.currentFormType = type;
        //    $scope.formTmp = $scope.form[type];
        //
        //    if(type == "website")
        //        _setHTMLtoEditor($scope.formTmp.html);
        //}

        //$scope.previewForm=function(){
        //    var viewHtml;
        //
        //    switch ($scope.formTmp.pageSize){
        //        case "ngMobile":
        //            viewHtml = _.template(PreviewNgMobileFormTmp);
        //        break;
        //        case "jqMobile":
        //            viewHtml = _.template(PreviewJqMobileFormTmp);
        //        break;
        //        default: //a4
        //            $scope.form[$scope.currentFormType].html = _getHTMLfromEditor();
        //            $scope.form[$scope.currentFormType].css = $scope.formTmp.css;
        //            viewHtml = _.template(PerviewFormTmp);
        //        break;
        //    }
        //
        //    var obj = {form : $scope.form};
        //    //obj.form.variables = $scope.variables;
        //
        //    var html = viewHtml(obj);
        //
        //    window.previewWin=window.open('');
        //    previewWin.document.open();
        //    previewWin.document.write(html);
        //    previewWin.document.close();
        //}
        //
        //$scope.previewResult=function(){
        //    var ifr=document.getElementById('previewIfr');
        //    ifr.contentWindow.switchOutput();
        //};
        //
        //$scope.printPreview=function(){
        //    $scope.previewResult();
        //    var ifr=document.getElementById('previewIfr');
        //    ifr.contentWindow.print();
        //};

        $scope.save=function(){
         
            if($scope.currentFormType == "website")
                $scope.form[$scope.currentFormType].html = _getHTMLfromEditor();
            else
                $scope.form[$scope.currentFormType].html = $scope.formTmp.html;

            $scope.form[$scope.currentFormType].css = $scope.formTmp.css;

            var formTmpObj = angular.copy($scope.form);
            formTmpObj = _.omit(formTmpObj,  "_id", '$$hashKey');

            var msgData = {
                cmd : 'formDesignerSave',
                form : formTmpObj
            }
           parent.window.postMessage(msgData, window.location.origin);
        };

        $scope.pickAll=function(type){
            var ifAllPicked = function(){
                for(i in $scope.variablesStatus[type]){
                    if($scope.variablesStatus[type][i] == false){
                        return false;
                    }
                }
                return true;
            }
            if( !$('.'+type)[0].checked && ifAllPicked()){
                for(i in $scope.variablesStatus[type]){
                    $scope.variablesStatus[type][i] = false;
                }
            }else{
                for(j in $scope.variablesStatus[type]){
                    $scope.variablesStatus[type][j] = true;
                }
            }
            $scope.updataVariables(type);
        }

        $(document).ready(function(){
            var msgData={};
            msgData.cmd='formDesignerLoad';
            parent.window.postMessage(msgData,window.location.origin);
        });
        angular.element(window).bind('message',function (event) {
            var msgRec =event.originalEvent.data;

            if(msgRec.cmd=='setDefaultValue'){
                $scope.$apply(function(){
                    //$scope.variables = JSON.stringify(msgRec.variables)
                    $scope.variables = msgRec.variables || [];
                    $scope.dataTemplates = msgRec.dataTemplates || [];
                    if(msgRec.form) {
                        $scope.form = msgRec.form;

                        //$scope.form.website.html = _encodeWidget($scope.form.website.html);
                        $scope.form.website.css = decodeURIComponent($scope.form.website.css);

                        $scope.form.mobile.html = decodeURIComponent($scope.form.mobile.html);
                        $scope.form.mobile.css = decodeURIComponent($scope.form.mobile.css);

                        $scope.currentFormType = 'website';
                        $scope.formTmp = $scope.form[$scope.currentFormType];

                        $scope.pageEditorConfig.data.html = $scope.form.website.html;
                        $scope.pageEditorConfig.data.css = $scope.form.website.css;
                        $scope.pageEditorConfig.data.variables = $scope.form.variables;
                        $scope.pageEditorConfig.data.dataTemplates = $scope.dataTemplates;
                        $scope.runPageEditor = true;
                        //$scope.pageEditorConfig.setInitData({
                        //    html: $scope.form.website.html,
                        //    variables: $scope.form.variables
                        //});
                    }

                    $scope.form.variables = $scope.form.variables || {};
                    $scope.variablesStatus = {};
                    for(var i in $scope.variables){
                        $scope.form.variables[i] = $scope.form.variables[i] || [];
                        $scope.variablesStatus [i] = {}
                        for(var j in $scope.variables[i]){
                            $scope.variablesStatus [i][$scope.variables[i][j]] = $scope.form.variables[i].indexOf($scope.variables[i][j]) != -1 ? true : false;
                        }
                    }
                    $scope.variables_init = {
                        employee : [],
                        customer: [],
                        organization : [],
                        space : []
                    }
                    $scope.pickAllButton = function(type){
                        var ifAllPicked = function(){
                            for(i in $scope.variablesStatus[type]){
                                if($scope.variablesStatus[type][i] == false){
                                    return false;
                                }
                            }
                            return true;
                        }
                        if(!ifAllPicked()){
                            $('.'+type)[0].checked = false;
                        }else{
                            $('.'+type)[0].checked = true;
                        }
                    }
                    for(i in $scope.variables_init){
                        $scope.pickAllButton(i);
                    }
                    
                }); // end $scope.$apply
                

                $scope.updataVariables = function(type){
                    $scope.pickAllButton(type);
                    $scope.form.variables = angular.copy($scope.variables_init);
                    for(var i in $scope.variablesStatus) {
                        for (var j in $scope.variablesStatus[i]) {
                            if($scope.variablesStatus[i][j])
                                $scope.form.variables[i].push(j);
                        }
                    }
                    //tinyMCE.activeEditor.settings.variables = $scope.form.variables;//update editor settings
                    $scope.pageEditorConfig.data.variables = $scope.form.variables;
                };


                try{
                    msgRec.widgets = JSON.parse(msgRec.widgets);
                }
                catch(e){
                    SyUtil.base.log('error', 'parse widgets Json fail');
                    msgRec.widgets = {};
                }
                //var editConf = {
                //    theme: "modern",
                //    skin: 'light',
                //    selector: "#wshtmlArea",
                //    height : "240",
                //    plugins: [
                //        "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                //        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                //        "table contextmenu directionality emoticons textcolor paste textcolor colorpicker textpattern",
                //        "textbox clickbox selectbox dywidget frame string"
                //    ],
                //    variables : msgRec.variables,
                //    widgets : msgRec.widgets,
                //    menu : { // this is the complete default configuration
                //        file   : {title : 'Window'  , items : 'newdocument print | code'},
                //        edit   : {title : 'Edit'  , items : 'undo redo | cut copy paste pastetext | searchreplace | selectall'},
                //        format : {title : 'Format', items : 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                //        table  : {title : 'Table' , items : 'inserttable tableprops deletetable | cell row column'},
                //        Forms  : {title : 'Form' , items : 'textbox clickbox selectbox | dywidget frame'},
                //        String  : {title : 'String', items :'string'},
                //        Media  : {title:'Media' , items :'link image media'}
                //    },
                //    content_css : "WebUI/bases/syArt/bootstrap/css/bootstrap.min.css,WebUI/bases/editor/css/content.css",
                //    toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | formatselect fontselect fontsizeselect | outdent indent blockquote | code",
                //    toolbar2: "undo redo | inserttime | forecolor backcolor | hr removeformat | bullist numlist  | subscript superscript | charmap emoticons | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft | ltr rtl ",
                //    setup : function(editor) {
                //        editor.on('click', function(e) {
                //            var targetJo = $(e.target);
                //            var form  = targetJo.attr('form');
                //            switch(form)
                //            {
                //                case 'textbox':
                //                    editor.execCommand('mceInput', true, targetJo);
                //                    break;
                //                case 'clickbox':
                //                    editor.execCommand('mceClickbox', true, targetJo);
                //                    break;
                //                case 'selectbox':
                //                    editor.execCommand('mceSelectbox', true, targetJo);
                //                    break;
                //                case 'widgetgroup':
                //                    editor.execCommand('mceDywidget', true, targetJo);
                //                    break;
                //                case 'frame':
                //                    editor.execCommand('mceFrame',true,targetJo);
                //                    break
                //            }
                //
                //        });
                //    }
                //
                //}

                //tinyMCE.init(editConf); //tiny init end
                $('#formMakerLoading').hide();
            } // if(msgRec.cmd=='setDefaultValue')
        });


    }])//end SyApp.NG.controller

}); //end define
