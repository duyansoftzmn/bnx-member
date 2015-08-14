/**
 * plugin.js
 *
 *  added by michael
 *	for insert dy widget
 *		
 */

/*global tinymce:true */

tinymce.PluginManager.add('frame', function(editor,url) {
    function createFrame(callback) {
        return function() {
            callback();
        };
    }

    function showDialog(frameList) {
        var containerElm,iframeElm;
        if(frameList){
            containerElm = frameList[0];
        }
        var win, containerData = {},iframeData={},data={}, dom = editor.dom
        var width, height ,style;
        function onSubmitForm() {
            data = tinymce.extend(data, win.toJSON());
            style = '';
            if (data.width === '') {
                style.replace(/width:[\s0-9]+(px|%);/,'');
            }else{
                if(style.match(/width:[\s0-9]+(px|%)/)){
                    style.replace(/width:[\s0-9]+(px|%)/,'width:'+data.width);
                }else{
                    style +='width:'+data.width+';'
                }
            }

            if (data.height === '') {
                style.replace(/height:[\s0-9]+(px|%);/,'');
            }else{
                if(style.match(/height:[\s0-9]+(px|%)/)) {
                    style.replace(/height:[\s0-9]+(px|%)/, 'height:'+data.height);
                }else{
                    style +='height:'+data.height+';'
                }
            }

            // Setup new data excluding style properties
            containerData = {
                form:'frame',
                class:'frameContainer',
                style : style
            };
            iframeData={
                src:'http://'+data.src.replace(/http:\/\//,''),
                height:'100%',
                width:'100%',
                frameborder:'0'
            }

            editor.undoManager.transact(function() {
                if (!data.src) {
                    if (iframeElm) {
                        dom.remove(iframeElm);
                        editor.focus();
                        editor.nodeChanged();
                    }

                    return;
                }

                if (!containerElm) {
                    containerData.id = '__mcenew';
                    editor.focus();
                    editor.selection.setContent(dom.createHTML('p',containerData,dom.createHTML('iframe',iframeData,'')));
                    containerElm = dom.get('__mcenew');
                    dom.setAttrib(containerElm, 'id', null);
                } else {
                    dom.setAttribs(iframeElm,iframeData);
                    dom.setAttribs(containerElm,containerData);
                    //dom.replace(dom.createHTML('iframe',iframeData,''), iframeElm);
                }
            });
        }
        if(containerElm){
            iframeElm = dom.select('iframe',containerElm)[0];
            style = dom.getAttrib(containerElm, 'style')||'';
            width = style.match(/width:[\s0-9]+(px|%);/)&&style.match(/width:[\s0-9]+(px|%);/)[0].match(/[0-9]+(px|%)/)[0];
            height = style.match(/height:[\s0-9]+(px|%);/)&&style.match(/height:[\s0-9]+(px|%);/)[0].match(/[0-9]+(px|%)/)[0];
            data = {
                src: dom.getAttrib(iframeElm, 'src'),
                width: width,
                height: height
            };
        }else{
            data={
                width: '800px',
                height: '600px',
                src:'http://'
            }
        }
        // General settings shared between simple and advanced dialogs
        var generalFormItems = [
            {
                name: 'src',
                type: 'filepicker',
                filetype: 'iframe',
                label: 'Url',
                autofocus: true
            },
            {
                type: 'container',
                label: 'Size',
                layout: 'flex',
                direction: 'row',
                align: 'center',
                spacing: 5,
                items: [
                    {name: 'width', type: 'textbox', maxLength: 5, size: 3, ariaLabel: 'Width'},
                    {type: 'label', text: 'x'},
                    {name: 'height', type: 'textbox', maxLength: 5, size: 3, ariaLabel: 'Height'}
                ]
            }
        ];



        win = editor.windowManager.open({
            title: 'Insert/edit iframe',
            data: data,
            body: generalFormItems,
            onSubmit: onSubmitForm
        });
    }

    editor.addButton('frame',{
        tooltip:'Insert/edit frame',
        onclick:createFrame(showDialog)
    });
    editor.addMenuItem('frame',{
        text:'Frame',
        onclick:createFrame(showDialog),
        context:'insert',
        prependToContext:'true'
    });
    editor.addCommand('mceFrame',function(ui,frameList){
        showDialog(frameList);
    });


});
