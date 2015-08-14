define(['text!SY_BASE/Ng/directive/template/link.html'],function(template){

    SyApp.NG.directive('dyLink',function($cookies){

        return {
            restrict:'EA',
            replace:true,
            template:template,
            scope:{},
            link:function(scope, element, attrs){

                scope.lang = {current:'zh'};
                scope.name = {zh:'链接', en:'Link'};

                scope.links = [
                    {
                        link:{zh:'设计室',en:'Designer'},
                        href:'http://designer.duyansoft.com',
                        icon:'icon-48-all',
                        isShown:true
                    },
                    {
                        link:{zh:'工作室',en:'Studio'},
                        href:'http://studio.duyansoft.com',
                        icon:'icon-agent',
                        isShown:true
                    },
                    {
                        link:{zh:'邮件',en:'Mail'},
                        href:'http://mail.duyansoft.com',
                        icon:'icon-email',
                        isShown:true
                    },
                    {
                        link:{zh:'数据',en:'Data'},
                        href:'http://data.duyansoft.com',
                        icon:'icon-graph-spark',
                        isShown:true
                    },
                    {
                        link:{zh:'员工管理',en:'Hrm'},
                        href:'http://hrm.duyansoft.com',
                        icon:'icon-group',
                        isShown:true
                    },
                    {
                        link:{zh:'客户管理',en:'Crm'},
                        href:'http://crm.duyansoft.com',
                        icon:'icon-book-address',
                        isShown:true
                    },
                    {
                        link:{zh:'站点',en:'Site'},
                        href:'http://site.duyansoft.com',
                        icon:'icon-cobrowse-chat',
                        isShown:true
                    },
                    {
                        link:{zh:'活动',en:'Event'},
                        href:'http://event.duyansoft.com',
                        icon:'icon-calendar-month-highlight',
                        isShown:true
                    },
                    {
                        link:{zh:'维基',en:'Wiki'},
                        href:'http://wiki.duyansoft.com',
                        icon:'icon-book-open-details',
                        isShown:true
                    },
                    {
                        link:{zh:'圈子',en:'Loop'},
                        href:'http://loop.duyansoft.com',
                        icon:'icon-chat-oval-multi',
                        isShown:true
                    }
                ];

                setInterval(function(){
                    scope.$apply(function(){
                        scope.lang.current = scope.$parent.language.currentLang.code;
                    });
                }, 50);

            }
        }
    })
});