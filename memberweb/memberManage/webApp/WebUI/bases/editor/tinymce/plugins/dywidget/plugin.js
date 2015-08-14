/**
 * plugin.js
 *
 *  added by michael
 *	for insert dy widget
 *		
 */

/*global tinymce:true */

tinymce.PluginManager.add('dywidget', function(editor,url) {
	function createInput(callback) {
		return function() {
			callback();
		};
	}


	function showDialog(targetJo) {
		var win, data = {}, dom = editor.dom, widgetElm = editor.selection.getNode();
		var width, height;
		var targetAssignData = (targetJo)? JSON.parse(decodeURIComponent(targetJo.attr("wgtdata"))):false;
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
			data.height = data.height.length == 0? "40" :data.height;

			var _width = (data.width.indexOf("%") != -1) ? data.width:data.width + 'px';
			var _height = (data.height.indexOf("%") != -1) ? data.height:data.height + 'px';
			var _id = (targetAssignData)?targetAssignData.div.id : "wgt-" + (new Date).getTime();
			var assign = {
				div : {
					id : _id,
					width: data.width,
					height: data.height
				},
				input : {
					"ngModel" : data["ng-model"]
				}, 
				iframe : {
					wgtId : data.widgetId
				}

			}
			assign.div.wgtdata =  encodeURIComponent(JSON.stringify(assign));

			assign.div.style = "border: 1px solid #E2E2E2;background:#eee;text-align: center;line-height: "+_height+";height:" + _height +";width:"+ _width,
			assign.div.form ='widgetgroup';

			if (targetJo){
	                dom.setAttribs(targetJo[0], assign.div);
			}else{
				editor.focus();
				var domHtml = dom.createHTML('div', assign.div, '<'+_id+'><div class="dyWidgetPreImg"></div></'+_id+'>');
				editor.selection.setContent(domHtml);

			}
		}

		function removePixelSuffix(value) {
			if (value) {
				value = value.replace(/px$/, '');
			}

			return value;
		}

		width = dom.getAttrib(widgetElm, 'width');
		height = dom.getAttrib(widgetElm, 'height');

		if (editor.settings.widgets){
			var tmpVar = [];
			for (key in editor.settings.widgets)
				tmpVar.push({text: key, value: editor.settings.widgets[key]})
			
			var generalFormItems = [{
				label: 'Widget Name',
				name: 'widgetId',
				type: 'listbox',
				values: tmpVar
			}];
		}

		if (editor.settings.variables&&editor.settings.variables.space){
			var tmpVar = [{text: 'None', value: ''}];
			for (key in editor.settings.variables.space){
                tmpVar.push({text: editor.settings.variables.space[key], value: editor.settings.variables.space[key]})
            }


			generalFormItems.push({
				label: 'Bind Variable',
				name: 'ng-model',
				type: 'listbox',
				values: tmpVar
			})
		}

        var inputStyleItems = [
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
			title: 'Widget',
	
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
            win.find('#width').value(targetJo.attr("width"));
            win.find('#height').value(targetJo.attr("height"));
			win.find('#ng-model').value(targetJo.attr("ng-model"));
		}

	}

	editor.addButton('dywidget', {
		tooltip: 'Form/Widget',
		onclick: createInput(showDialog)
	});

	editor.addMenuItem('dywidget', {
		text: 'Widget',
		onclick: createInput(showDialog),
		context: 'insert',
		prependToContext: true
	});

	editor.addCommand('mceDywidget', function(ui, targetJo) {
		 showDialog(targetJo);
    });

});
