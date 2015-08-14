/**
 * plugin.js
 *
 *  added by michael
 *	for checkbox  radio
 */

/*global tinymce:true */

tinymce.PluginManager.add('selectbox', function(editor) {

	function createInput(callback) {
		return function() {
			callback();
		};
	}


	function showDialog(targetJo) {
		var win, data = {}, dom = editor.dom, thisElm = editor.selection.getNode();
		var width, height;

		function onSubmitForm() {
			data = tinymce.extend(data, win.toJSON());
			data['ng-options'] = 'item for item in ' + data.options;
			if (targetJo){
				dom.setAttribs(targetJo[0], data);
			}else{
				data.id = '__mcenew';
				editor.focus();
				//var optionArray = data.options.split('|');
				//var optionStr = '';
				//for(var i in optionArray){
				//	if( i != 0){
				//		optionStr += ',';
				//	}
				//	optionStr += '\'' + optionArray[i] + '\'';
				//}
				//optionStr = '[' + optionStr + ']';
				data['ng-options'] = 'item for item in ' + data.options;
				var domHtml = dom.createHTML('select', data ,'<option value="">None</option>');
				editor.selection.setContent(domHtml);

				thisElm = dom.get('__mcenew');
				dom.setAttrib(thisElm, 'id', null);
				dom.setAttrib(thisElm, 'form', 'selectbox');
			}
		}

		width = dom.getAttrib(thisElm, 'width');
		height = dom.getAttrib(thisElm, 'height');


		var generalFormItems = [
			{
				name: 'name',
				type: 'textbox',
				label: 'Group Name',
				autofocus: true
			}
		];


		if (editor.settings.variables){
			var tmpVar = [{text: 'None', value: ''}];
			var listVar = [{text: 'None', value: '[]'}];
			for (key in editor.settings.variables.space){
				tmpVar.push({text: editor.settings.variables.space[key], value: editor.settings.variables.space[key]});
				listVar.push({text: editor.settings.variables.space[key], value: editor.settings.variables.space[key]});
			}
			
			generalFormItems.push({
				label: 'Bind Variable',
				name: 'ngmodel',
				type: 'listbox',
				text: 'None',
				values: tmpVar
			});



			generalFormItems.push({
				label: 'Bind Options',
				name: 'options',
				type: 'listbox',
				text: 'None',
				values: listVar
			})
		}

		var inputStyleItems = [
			{
				name: 'class',
				type: 'textbox',
				label: 'Class',
				autofocus: true
			}
		];
		
		win = editor.windowManager.open({
			title: 'Form Select Box',
	
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
			win.find('#name').value(targetJo.attr("name"));
			win.find('#type').value(targetJo.attr("type"));
			win.find('#ngmodel').value(targetJo.attr("ngmodel"));
			win.find('#options').value(targetJo.attr("options"));
		}

	}

	editor.addButton('selectbox', {
		tooltip: 'Form/Select Box',
		onclick: createInput(showDialog)
	});

	editor.addMenuItem('selectbox', {
		text: 'Select Box',
		onclick: createInput(showDialog),
		context: 'insert',
		prependToContext: true
	});

	editor.addCommand('mceSelectbox', function(ui, targetJo) {
		 showDialog(targetJo);
    });

});
