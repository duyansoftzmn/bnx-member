define([
    'jquery',
    'jquery.ui'
],function( $ ){

    SyApp.NG.directive('syPageEditor',function(){

        return {
            restrict:'EA',
            replace:false,
            templateUrl:'/WebUI/bases/Ng/directive/template/pageEditor.html',
            scope:{
                config:'=config'
            },
            link:function(scope,element,attrs){
                element.addClass('container-fluid row');
                scope.setting = {
                    show: false,
                    elements:[]
                    //elements:[
                    //    {
                    //        dom:'dom',
                    //        settings:[
                    //            {
                    //                key:'key',
                    //                value:'value'
                    //            }
                    //        ]
                    //    }
                    //]
                };
                scope.style = {
                    height: '100%',
                    width : '100%'
                };
                angular.extend(scope.style, scope.config.style);
                element.css(scope.style);
                var _editingDom = null;
                scope.saveSetting  = function(){
                    var element;
                    for(var i = 0; i < scope.setting.elements.length; i++){
                        element = scope.setting.elements[i];
                        var domJo = $(element.dom);
                        for( var index = 0; index < element.settings.length; index++ ){
                            switch(element.settings[index].key){
                                case 'text':
                                case 'option':
                                case 'label':
                                    domJo.html(element.settings[index].value);
                                    break;
                                case 'bindValue':
                                    if(element.settings[index].value){
                                      domJo.attr('ng-model', element.settings[index].value);
                                    }else{
                                        domJo.removeAttr('ng-model')
                                    }
                                    break;
                                case 'initValue':
                                    if(element.settings[index].value.variable){
                                        domJo.attr('ng-init', domJo.attr('ng-model') + '=' + ( element.settings[index].value.type == 'space'? '' :  '__' + element.settings[index].value.type + '_' ) +  element.settings[index].value.variable);
                                    }else{
                                        domJo.removeAttr('ng-init');
                                    }
                                    break;
                                case 'placeholder':
                                    domJo.attr('placeholder', element.settings[index].value);
                                    break;
                                case 'table':
                                    var headJo = domJo.find('thead > tr').html('');
                                    var bodyJo = domJo.find('tbody > tr').html('');
                                    bodyJo.attr('ng-repeat','item in ' + element.settings[index].value[0].variable + ' track by $index');
                                    var columnValue = null;
                                    for(var columnIndex = 0 ; columnIndex < element.settings[index].value.length ; columnIndex++){
                                        columnValue = element.settings[index].value[columnIndex];
                                        headJo.append('<th>'+ columnValue.header + '</th>');

                                        bodyJo.append(_tableVariableDom[columnValue.type.toUpperCase()](columnValue.variable , columnValue.data));
                                    }
                                    break;
                                case 'button':
                                    domJo.html('');
                                    for(var btnIndex = 0 ; btnIndex < element.settings[index].value.length ; btnIndex ++ ){
                                        domJo.append($('<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"'+ element.settings[index].value[btnIndex].click +'\">'+ element.settings[index].value[btnIndex].show +'</button></div>'))
                                    }
                                    break;
                                case 'richText':
                                    domJo.html(_getContentfromEditor());
                                    break;
                                case 'feedback':
                                    domJo.find('> span').each(function(i,ui){
                                        var variable = element.settings[index].value.variable;
                                        var value = element.settings[index].value.fullMark / 5*( i + 1 );
                                        $(ui).attr('ng-click',variable + '=' + value);
                                        $(ui).attr('ng-class','{\'icon-star-outline\':' + variable + '<' + value + ',\'icon-stars\':' + variable + '>=' + value + '}')
                                    });
                                    break;
                                case 'required':
                                    if(element.settings[index].value){
                                        domJo.attr('required','');
                                    }else{
                                        domJo.removeAttr('required')
                                    }
                                    break;
                                case 'disabled':
                                    if(element.settings[index].value){
                                        domJo.attr('disabled','');
                                    }else{
                                        domJo.removeAttr('disabled')
                                    }
                                    break;
                                case 'readonly':
                                    if(element.settings[index].value){
                                        domJo.attr('readonly','');
                                    }else{
                                        domJo.removeAttr('readonly')
                                    }
                                    break;
                                case 'row':
                                    var headJo = domJo.find('thead > tr').html('');
                                    var bodyJo = domJo.find('tbody > tr').html('');
                                    var rowHeadIndex;
                                    for(rowHeadIndex = 0; rowHeadIndex < element.settings[index].value.head.length; rowHeadIndex++){
                                        headJo.append('<th>'+ element.settings[index].value.head[rowHeadIndex] + '</th>');
                                        bodyJo.append('<td>{{' + element.settings[index].value.body[rowHeadIndex] + '}}</td>');
                                    }
                                    break;
                                case 'readDT':
                                    var suffix = (new Date).getTime();
                                    var dtCatchKey = 'dtCache' + suffix,
                                        resultCacheKey = 'dtSearch' + suffix;
                                    var readDTHtml = '<div class="input-group" ng-init="__temp.' + dtCatchKey + '=[]">'
                                                    + '<input type="text" class="form-control" ng-model="__temp.' + resultCacheKey + '">'
                                                    + '<span class="input-group-btn dropdown" style="position:static;">'
                                                    + '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-click="__util.readDT(\'' + element.settings[index].value + '\',__temp.' + resultCacheKey + ',\'' + dtCatchKey + '\')"><span class="icon-search"></span></a>'
                                                    + '<ul class="dropdown-menu" role="menu" ng-show="__temp.' + dtCatchKey + '.length">'
                                                    + '<li ng-repeat="item in __temp.' + dtCatchKey + '" ng-click="__util.overWrite(item);__temp.' + dtCatchKey + '=[];">'
                                                    + '<a href=""><span ng-repeat="__var in item.variables">{{__varDesc[__var.variable].name}}:{{__var.value}};</span></a></li></ul></span></div>';
                                    domJo.html(readDTHtml);
                                    console.log(element.settings[index]);
                                    break;
                            }
                        }
                    }
                    _updateCode();
                    scope.setting.show = false;
                };

                scope.removeComponent = function(){
                    if(confirm('Are You Sure To Remove Component ?') == false){
                        return;
                    }
                    _editingDom.parentNode.removeChild(_editingDom);
                    scope.setting.show = false;
                    _updateCode();
                };


                //load components
                var componentHtml = [];
                for(var i = 0 ; i < scope.config.components.length ; i++){
                    componentHtml.push('');
                    (function(){
                        var index = i;
                        componentHtml[index] += '<div class=\"peComponent peComponent-'+ index +'\">Loding<\/div>';
                        $.get(scope.config.componentsPath +'\/'+scope.config.components[index] +'\/body.html',function(data){
                            $('.peComponent-' + index).html(data);
                            $('.peComponent-' + index + ' > *').draggable({
                                connectToSortable:'#peContent',
                                appendTo: "body",
                                helper: "clone"
                            });
                        });
                    })();
                }
                componentHtml = componentHtml.join('\n');
                element.find('#peComponents').html(componentHtml);
                _updateDom();
                //sortable
                $( "#peContent" ).sortable({
                    cursor: "move",
                    revert:true,
                    opacity:0.5,
                    placeholder:'peSortablePlaceholder',
                    create:function(event, ui){
                        $(this).find('> *').each(function(){
                            _bindComponentClick(this);
                        });
                    },
                    deactivate:function(event, ui){
                        _bindComponentClick(ui.item);
                    },
                    update:function(event, ui){
                        _updateCode()
                    }
                });

                function _updateCode(){
                    scope.config.data.html = $('#peContent').html()
                }

                function _updateDom(){
                    element.find('#peContent').html(scope.config.data.html);
                }

                scope.onSettingInit = function(setting){
                    if(typeof _settingOnInit[setting.key] == 'function'){
                        _settingOnInit[setting.key].call({},setting);
                    }
                };
                var _settingOnInit = {
                    'richText':function(setting){
                        _initEditor(setting.value);
                    }
                };


                function _bindComponentClick(dom){
                    $(dom).unbind('click');
                    $(dom).click(function(){
                        _editingDom = this;
                        if(tinymce.activeEditor){
                            tinymce.EditorManager.execCommand('mceRemoveEditor',true, 'peRichTextEditor');
                        }
                        var elements = [];
                        $(this).find('.settable').each(function(index){
                            var element = {
                                dom: this,
                                settings :[]
                            };
                            var expression;
                            var setting;
                            var settings = ( $(this)[0].dataset.settings || '' ).split(',');
                            for(var i = 0; i < settings.length; i++){
                                setting = {
                                    key:settings[i],
                                    value:''
                                };
                                switch(settings[i]){
                                    case 'text':
                                    case 'option':
                                    case 'label':
                                        setting.value =  $(this).html() || '';
                                        break;
                                    case 'bindValue':
                                        setting.value = ( $(this).attr('ng-model') || '').replace(/\s/g,'');
                                        break;
                                    case 'initValue':
                                        expression = ($(this).attr('ng-init') || '').replace(/\s/g,'');
                                        if(expression != '' && expression.search('=') != -1){
                                            //valid expression
                                            var initVar = expression.split('=')[1].replace('__','').replace('_','.').split('.');
                                            if(initVar.length == 1){
                                                setting.value = {
                                                    type:'space',
                                                    variable:initVar[0]
                                                }
                                            }else{
                                                setting.value = {
                                                    type: initVar[0],
                                                    variable: initVar[1]
                                                }
                                            }
                                        }else{
                                            //not a valid expression
                                            setting.value = {
                                                type:'',
                                                variable:''
                                            };
                                            break;
                                        }
                                        break;
                                    case 'placeholder':
                                        setting.value = $(this).attr('placeholder') || '';
                                        break;
                                    case 'table':
                                        setting.value = [];
                                        var headCol = $(this).find('thead tr:first-child th');
                                        var bodyCol = $(this).find('tbody tr:first-child td');
                                        var columnCount = bodyCol.length;
                                        while(setting.value.length < columnCount){
                                            setting.value.push(_getTableSettingValue(headCol[setting.value.length],bodyCol[setting.value.length]));
                                        }

                                        if(setting.value.length == 0){
                                            setting.value.push({
                                                header:'Header',
                                                variable:'Var',
                                                type:'Input',
                                                data:'Default'
                                            });
                                        }
                                        break;
                                    case 'button':
                                        setting.value = [];
                                        $(this).find('.btn-group').each(function(){
                                            setting.value.push({
                                                show:  $(this).find('button').html()|| '',
                                                click: $(this).find('button').attr('ng-click') || ''
                                            });
                                        });
                                        break;
                                    case 'richText':
                                        setting.value = $(this).html();
                                        break;
                                    case 'feedback':
                                        setting.value = {
                                            variable:'',
                                            fullMark:100
                                        };
                                        var feedbackClick = ( $($(this).find('>span')[0]).attr('ng-click') || '' ).replace(' ','');
                                        setting.value = {
                                            variable:feedbackClick.split('=')[0],
                                            fullMark:feedbackClick.split('=')[1]*5
                                        };
                                        break;
                                    case 'required':
                                        setting.value = !!$(this).attr('required');
                                        break;
                                    case 'disabled':
                                        setting.value = !!$(this).attr('disabled');
                                        break;
                                    case 'readonly':
                                        setting.value = !!$(this).attr('readonly');
                                        break;
                                    case 'row':
                                        setting.value = {
                                            head:[],
                                            body:[]
                                        };
                                        $(this).find('thead').find('tr:first-child').find('th').each(function(){
                                            setting.value.head.push( $(this).html() )
                                        });
                                        $(this).find('tbody').find('tr:first-child').find('td').each(function(){
                                            setting.value.body.push( $(this).html().replace(/{/g,'').replace(/}/g,'') )
                                        });
                                        break;
                                    case 'readDT':
                                        setting.value = '';
                                        var readDTMatch = $(this).html().match(/__util.readDT\('.*',__temp./);
                                        if(readDTMatch){
                                            setting.value = readDTMatch[0].replace('__util.readDT(\'', '').replace('\',__temp.', '');
                                        }
                                        setting.value = setting.value.length == 36 ? setting.value : '';
                                        break;
                                }
                                if(setting.key){
                                    element.settings.push(setting);
                                }
                            }
                            elements.push(element)
                        });
                        scope.$apply(function(){
                            scope.setting.show = elements.length != 0;
                            scope.setting.elements = elements;
                            var sCount = 0;
                            for(var i = elements.length; i--; ){
                                sCount += elements[i].settings.length
                            }
                            scope.showSaveBtn = sCount != 0
                        });
                    })
                }
                scope.util = {
                    getKeyList: function(obj){
                        var result = [] ;
                        for(var key in obj){
                            result.push(key);
                        }
                        return result;
                    },
                    copy:function(obj){
                        return angular.copy(obj);
                    },
                    updateCode: _updateCode,
                    updateDom: _updateDom
                };
                scope.tableSettingDataName = {
                    'Expression' : 'expression',
                    'Select' : 'options',
                    'Input' : 'defaultVal'
                };

                var _tableVariableDom = {
                    'INPUT': function(variable, defaultValue){
                        return '<td><input ng-model=\"' + variable + '[$index]\" data-defaultValue=\"'+defaultValue+'\"></td>';
                    },
                    'SELECT': function(variable, options){
                        return '<td><select ng-model=\" '+ variable +'[$index]\" ng-options=\"item as item for item in ' + options + '\"><option value="">- No -</option></select></td>';
                    },
                    'TEXT': function(variable){
                        return '<td ng-bind=\"'+ variable +'[$index]\">Text</td>';
                    },
                    'EXPRESSION': function(variable, expression){
                        return '<td ng-bind=\"'+ expression +'\">Expression</td>';
                    }
                };

                var _getTableSettingValue = function(th,td){
                    var value ={
                        header:$(th).html(),
                        type:'Input',
                        variable:'',
                        data:''
                    };
                    if($($(td).html()).length > 0){
                        var innerDom = $($(td).html())[0];
                        switch( innerDom.nodeName){
                            case 'SELECT' :
                                value.type = 'Select';
                                value.variable = $(innerDom).attr('ng-model').replace(' ', '');
                                value.data = ( $(innerDom).attr('ng-options').split(' in ')[1] || '' ).replace(' ','').replace('[$index]','');
                                break;
                            case 'INPUT' :
                                value.type = 'Input';
                                value.variable = $(innerDom).attr('ng-model').replace(' ', '').replace('[$index]','');
                                value.data = $(innerDom).attr('data-defaultValue') || '';
                                break;
                        }
                    }else{
                        var isTypeText = ( scope.config.data.variables.space.join('__') + '__' ).search( ( $(td).attr('ng-bind') || '' ).replace(' ','').replace('[$index]','') + '__' ) != -1;
                        value.type = isTypeText ? 'Text' : 'Expression';
                        value.variable = isTypeText ? ( $(td).attr('ng-bind') || '' ).replace(' ','').replace('[$index]','') : '' ;
                        value.data = isTypeText ? '' : $(td).attr('ng-bind') || '';
                    }
                    return value;
                }

                var _initEditor = function(content){
                    //update available variables
                    tinymce.settings.variables = scope.config.data.variables;

                    //set content
                    $('#peRichTextEditor').html(_encodeWidget(content));

                    //init editor
                    var editor = tinymce.EditorManager.execCommand('mceAddEditor',true, 'peRichTextEditor');
                };

                var _decodeWidget = function(html){
                    var tmp, tmpData, re =/wgtdata=\"[^"]*\"/g;
                    var wgtdata = html.match(re);

                    for (var i in wgtdata)
                    {
                        tmpData = wgtdata[i].replace('wgtdata="', '').replace('"', '');
                        tmpData = JSON.parse(decodeURIComponent(tmpData));

                        var viewHtml = "<!--<%=div.id%>><!--><wdgbody id='<%=div.id%>'>";
                        viewHtml = viewHtml + "<input style='display:none', ng-model='<%=input.ngModel%>' id='<%=div.id%>input'/>"
                        viewHtml = viewHtml + "<iframe height='100%' width='100%' frameborder='0' src='/painting/index.php?showChart/wid/<%=iframe.wgtId%>#ifr=<%=div.id%>'></iframe></wdgbody><!--/<%=div.id%>><!-->"

                        viewHtml = _.template(viewHtml);
                        var htmlTmp = viewHtml(tmpData);

                        html = html.replace("<"+tmpData.div.id+"><div class=\"dyWidgetPreImg\"></div></"+tmpData.div.id+">", htmlTmp);
                    }


                    html = html.replace(/ng-model/g, "oldmodel");
                    html = html.replace(/ngmodel/g, "ng-model");

                    return html;
                };

                var _encodeWidget = function(html){
                    var tmp, wgtId, reg, re =/wdgbody id=\'[^']*\'/g;
                    var wgtBodys = html.match(re);

                    for (var i in wgtBodys){

                        wgtId = wgtBodys[i].replace("wdgbody id='", '').replace("'", '');
                        reg=new RegExp("<!--"+wgtId+"><!-->.*<!--/"+wgtId+"><!-->");
                        html = html.replace(reg, "<"+wgtId+">Widget</"+wgtId+">");
                    }

                    html = html.replace(/ng-model/g, "ngmodel");
                    return html;
                };
                var _getContentfromEditor = function(){
                    var tmpHtml = tinymce.activeEditor.getContent({ format:'raw'});
                    tmpHtml = _decodeWidget(tmpHtml);
                    return tmpHtml;
                }

                var editConf = {
                    theme: "modern",
                    skin: 'light',
                    height : "240",
                    //selector:'#peRichTextEditor',
                    plugins: [
                        "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                        "table contextmenu directionality emoticons textcolor paste textcolor colorpicker textpattern",
                        "textbox clickbox selectbox dywidget frame string"
                    ],
                    variables : scope.config.data.variables,
                    //widgets : msgRec.widgets,
                    menu : { // this is the complete default configuration
                        edit   : {title : 'Edit'  , items : 'undo redo | cut copy paste pastetext | searchreplace | selectall'},
                        table  : {title : 'Table' , items : 'inserttable tableprops deletetable | cell row column'},
                        variable  : {title : 'Variable' , items : 'textbox clickbox selectbox string'},
                        media  : {title:'Media' , items :'link image media | dywidget frame'}
                    },
                    content_css : "WebUI/bases/syArt/bootstrap/css/bootstrap.min.css,WebUI/bases/editor/css/content.css",
                    setup : function(editor) {
                        editor.on('click', function(e) {
                            var targetJo = $(e.target);
                            var form  = targetJo.attr('form');
                            switch(form)
                            {
                                case 'textbox':
                                    editor.execCommand('mceInput', true, targetJo);
                                    break;
                                case 'clickbox':
                                    editor.execCommand('mceClickbox', true, targetJo);
                                    break;
                                case 'selectbox':
                                    editor.execCommand('mceSelectbox', true, targetJo);
                                    break;
                                case 'widgetgroup':
                                    editor.execCommand('mceDywidget', true, targetJo);
                                    break;
                                case 'frame':
                                    editor.execCommand('mceFrame',true,targetJo);
                                    break
                            }

                        });
                    }

                };
                tinymce.init(editConf); //tiny init end

            }
        }
    })
});

