/**
 * Created by Jian on 8/25/2014.
 *
 * DOM:<input type="file" file-upload-params="prodImgUploader" file-upload>
 * ps:  directive is file-upload is required
 * API

$scope.prodImgUploader = {
    params:{
        url : '/testest',

    },
    callback : {
        add : function(e,data){
            data.formData = {a:123}; // for change post param
            data.submit();
        },
        done : function(){
            alert(123)
        },
        fail: function(){
            alert("上传失败！");
        }
    }                   

}
 *
 */
define([
    "SY_BASE/jQplugin/jquery-file-upload/jquery.fileupload",
    "SY_BASE/jQplugin/jquery-file-upload/jquery.iframe-transport",
    "SY_BASE/jQplugin/jquery-file-upload/vendor/jquery.ui.widget"
],function(){
    SyApp.NG.directive('fileUpload',function(){
        return {
            restrict:'A',
            scope:{
                INIT : '=fileUploadParams'
            },
            link:function(scope,element,attrs){
                scope.INIT.init = function(){
                    var UPLOAD_OPTIONS = this;

                    var optionsObj = {
                        url : UPLOAD_OPTIONS.params.url,
                        formData : UPLOAD_OPTIONS.params.data,
                        add:function(e,data){
                            if(UPLOAD_OPTIONS.callback.add){
                                UPLOAD_OPTIONS.callback.add(e,data);
                                return
                            }
                            data.submit();
                        },
                        fail: function(e,data){
                            if(UPLOAD_OPTIONS.callback.fail){
                                UPLOAD_OPTIONS.callback.fail(e,data);
                            }
                        },
                        done:function(e,data){
                            data.result = JSON.parse(data.result);
                            if(UPLOAD_OPTIONS.callback.done){
                                UPLOAD_OPTIONS.callback.done(e,data);
                            }
                        },
                        submit : function(e,data){                            
                            if(UPLOAD_OPTIONS.callback.submit){
                                UPLOAD_OPTIONS.callback.submit(e,data);
                            }
                        }
                    };

                    element.fileupload(optionsObj);

                };
                scope.INIT.init();
            }
        };
    })
})

