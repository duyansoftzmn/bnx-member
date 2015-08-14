/**
 * Created by Jian on 8/25/2014.
 */
define(['text!SY_BASE/Ng/directive/template/syi18n.html'],function(template){

    SyApp.NG.directive('dyLanguage',function(){

        return {
            restrict:'EA',
            replace:true,
            template:template
        }
    })
})

