/**
 * plugin.js
 *
 *  added by michael
 *	for input [text]
 *		textarea
 */

/*global tinymce:true */

tinymce.PluginManager.add('textbox', function(editor) {


	function createInput(callback) {
		return function() {
			callback();
		};
	}


	function showDialog(targetJo) {
		var win, data = {}, dom = editor.dom, textboxElm = editor.selection.getNode();
		var width, height;

		function recalcSize() {
			var widthCtrl, heightCtrl, newWidth, newHeight;

			widthCtrl = win.find('#width')[0];
			heightCtrl = win.find('#height')[0];

			if (!widthCtrl || !heightCtrl) {
				return;
			}

			newWidth = widthCtrl.value();
			newHeight = heightCtrl.value();

			width = newWidth;
			height = newHeight;
		}

		function onSubmitForm() {
			recalcSize();
			var domName = 'input';
			data = tinymce.extend(data, win.toJSON());
//            if(data.required.length==0){
//                data.splice('required',1);
//            }
//            data.required = !!data.required;
            if(data.default.length > 0 && data.ngmodel){
                data['ng-init']=data.ngmodel+ '=' + data.default;
            }else{
                data['ng-init']='';
            }
            data.style = ['width:'+data.width+'px;','height:'+data.height+'px;'].join('')
			if (targetJo){
				if (
					targetJo.attr('type') != data.type &&
						(targetJo.attr('type') == 'textarea' || data.type == 'textarea')
					){
					data.type = targetJo.attr('type');
				}
                dom.setAttribs(targetJo[0], data);
			}else{
				data.id = '__mcenew';
				editor.focus();

				var domHtml = (data.type == 'textarea')?dom.createHTML('textarea', data, ''):dom.createHTML('input', data);
				editor.selection.setContent(domHtml);

				textboxElm = dom.get('__mcenew');
				dom.setAttrib(textboxElm, 'id', null);
				dom.setAttrib(textboxElm, 'form', 'textbox');
			}
		}

        function onChangeCatogory(){
            var btn = win.find('#default')[0];value = '';
            if(btn.menu){
                btn.menu.remove();
                btn.menu = null;
            }
            var tempVars = this.value().length>0?tmpVar[this.value()]:[{text:'None',value:''}];
            btn.settings.values = btn.settings.menu = tempVars;
            for(key in tempVars){
                if(tempVars[key].value == btn.value()){
                    value = tempVars[key].value;
                }
            }
            btn.value(value);
        }


		function removePixelSuffix(value) {
			if (value) {
				value = value.replace(/px$/, '');
			}

			return value;
		}

		width = dom.getAttrib(textboxElm, 'width');
		height = dom.getAttrib(textboxElm, 'height');
		var generalFormItems = [
			{
				name: 'placeholder',
				type: 'textbox',
				label: 'Placeholder',
				autofocus: true
			},
			{
				label: 'Type',
				name: 'type',
				type: 'listbox',
				text: 'Text',
				values:[
                    {text: 'Text', value: 'text'},
                    {text: 'TextArea', value: 'textarea'}
                ],
                disabled:!!targetJo
			}
		];


		if (editor.settings.variables){
            var tmpVar = {},category = [{text:'None',value:''}],variables = [];
            if(editor.settings.variables){
                for(key in editor.settings.variables){
                    if(key!='space'&&editor.settings.variables[key]){
                        category.push({text:key,value:key});
                    }

                    for( var i in editor.settings.variables[key]){
                        if(!Array.isArray(tmpVar[key])){
                            tmpVar[key] = [];
                            tmpVar[key].push({text:'None',value:''})
                        }
                        if(key=='space'){
                            prefix = '';
                        }else{
                            prefix = '__'+ key + '_';
                        }
                        tmpVar[key].push({text:editor.settings.variables[key][i],value:prefix+editor.settings.variables[key][i]});

                    }
                }
                variables = [{text:'None',value:''}]
            }
			generalFormItems.push({
				label: 'Bind Variable',
				name: 'ngmodel',
				type: 'listbox',
				values: tmpVar['space']
			});

            generalFormItems.push({
                label: 'Default Value',
                name: 'category',
                type: 'listbox',
                values: category,
                onSelect : onChangeCatogory
            });

            generalFormItems.push({
                label: ' ',
                name: 'default',
                type: 'listbox',
                values: variables
            });

            generalFormItems.push({
                label: 'Required',
                name: 'required',
                type: 'listbox',
                values: [{text:'No',value:''},{text:'Yes',value:'required'}]
            })
		}

        var inputStyleItems = [
			{
				name: 'class',
				type: 'textbox',
				label: 'Class',
				autofocus: true
			},
			{
				type: 'form',
				layout: 'grid',
				packV: 'start',
				columns: 2,
				padding: 0,
				alignH: ['left', 'right'],
				defaults: {
					type: 'textbox',
					maxWidth: 50
				},
				items: [
					{label: 'Width', name: 'width'},
					{label: 'Height', name: 'height'}
				]
			}
		];
		
		win = editor.windowManager.open({
			title: 'Form Text Box',
	
			bodyType: 'tabpanel',
			body: [
				{
					title: 'General',
					type: 'form',
					items: generalFormItems
				},

				{
					title: 'Style',
					type: 'form',
					pack: 'start',
					items: inputStyleItems
				}
			],
			onSubmit: onSubmitForm
		});

		if (targetJo){
            win.find('#placeholder').value(targetJo.attr("placeholder"));
            win.find('#class').value(targetJo.attr("class"));
            win.find('#width').value(targetJo.attr("width"));
            win.find('#height').value(targetJo.attr("height"));
            win.find('#required').value(targetJo.attr("required"));
            win.find('#ngmodel').value(targetJo.attr("ngmodel"));
            win.find('#default').value(targetJo.attr("default"));
            win.find('#category').value(targetJo.attr("category"));
			win.find('#type').value(targetJo.attr("type"));
            onChangeCatogory.call(win.find('#category'))

		}

	}

	editor.addButton('textbox', {
		tooltip: 'Form/Text Box',
		onclick: createInput(showDialog)
	});

	editor.addMenuItem('textbox', {
		text: 'Text Box',
		onclick: createInput(showDialog),
		context: 'insert',
		prependToContext: true
	});

	editor.addCommand('mceInput', function(ui, targetJo) {
		 showDialog(targetJo);
    });

});
