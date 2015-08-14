/**
 * plugin.js
 *
 *  added by michael
 *	for checkbox  radio
 */

/*global tinymce:true */

tinymce.PluginManager.add('clickbox', function(editor) {

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
	
			if (targetJo){
				dom.setAttribs(targetJo[0], data);
			}else{
				data.id = '__mcenew';
				editor.focus();

				var domHtml = dom.createHTML('input', data);
				editor.selection.setContent(domHtml);

				thisElm = dom.get('__mcenew');
				dom.setAttrib(thisElm, 'id', null);
				dom.setAttrib(thisElm, 'form', 'clickbox');
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
			},
			{
				label: 'Type',
				name: 'type',
				type: 'listbox',
				text: 'Checkbox',
				values: [
					{text: 'Checkbox', value: 'checkbox'},
					{text: 'Radio', value: 'radio'}
				]
			},
			{
				label: 'Default Checked',
				name: 'checked',
				type: 'checkbox',
				checked: false
			}
		];


		if (editor.settings.variables){
			var tmpVar = [{text: 'None', value: ''}];
            for (key in editor.settings.variables.space){
                tmpVar.push({text: editor.settings.variables.space[key], value: editor.settings.variables.space[key]})
            }
			
			generalFormItems.push({
				label: 'Bind Variable',
				name: 'ngmodel',
				type: 'listbox',
				text: 'None',
				values: tmpVar
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
			title: 'Form Click Box',
	
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
		}

	}

	editor.addButton('clickbox', {
		tooltip: 'Form/Click Box',
		onclick: createInput(showDialog)
	});

	editor.addMenuItem('clickbox', {
		text: 'Click Box',
		onclick: createInput(showDialog),
		context: 'insert',
		prependToContext: true
	});

	editor.addCommand('mceClickbox', function(ui, targetJo) {
		 showDialog(targetJo);
    });

});
