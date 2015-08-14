/**
 * Created by Jian on 7/3/2014.
 */
tinymce.PluginManager.add('string', function(editor) {


    function createInput(callback) {
        return function() {
            callback();
        };
    }


    var showDialog = function(targetJo){
        var win, data = {} , dom = editor.dom , thisElm = editor.selection.getNode();
        var tmpVar = {},category = [],variables = [];
        if(editor.settings.variables){
            for(key in editor.settings.variables){
                if(editor.settings.variables[key]){
                    category.push({text:key,value:key});
                }
                for( var i in editor.settings.variables[key]){
                    if(!Array.isArray(tmpVar[key])){
                        tmpVar[key] = [];
                    }
                    if(key=='space'){
                        prefix = '';
                    }else{
                        prefix = '__'+ key + '_';
                    }
                    tmpVar[key].push({text:editor.settings.variables[key][i],value:prefix+editor.settings.variables[key][i]});

                }
            }
            variables = tmpVar[category[0].value];
        }
        function onSubmitForm(){
            data = tinymce.extend(data, win.toJSON());
            tinyMCE.execCommand('mceInsertContent','','{{'+data.variable+'}}');
        }

        function onChangeCatogory(v){
            var btn = win.find('#variable')[0];
            if(btn.menu){
                btn.menu.remove();
                btn.menu = null;
            }
            btn.settings.values = btn.settings.menu = tmpVar[this.value()]
            btn.value(tmpVar[this.value()][0].value);
        }

        win = editor.windowManager.open({
            title:'Variable String',
            bodyType :'form',
            items : [
                {
                    type:'form',
                    items:[{
                        label :'Category',
                        name :'category',
                        type :'listbox',
                        values : category,
                        onSelect : onChangeCatogory
                    },{
                        label :'Variable',
                        name :'variable',
                        type :'listbox',
                        values : variables
                    }],
                    minWidth : 300
                }
            ],
            onSubmit : onSubmitForm
        });
    }

    editor.addButton('string', {
        tooltip: 'String/Variable',
        onclick: createInput(showDialog)
    });

    editor.addMenuItem('string', {
        text: 'Variable',
        onclick: createInput(showDialog),
        context: 'insert',
        prependToContext: true
    });

    editor.addCommand('mceString', function(ui, targetJo) {
        showDialog(targetJo);
    });
});