/**
 * Created by Lee on 13/1/2015.
 *
 * DOM:<sy-knowledge sy-example="'lalala'" sy-config="knowledge"></sy-knowledge>
 * 		sy-example必须和id的值一致，sy-config代表json的内容，值来自你的本地cache
 * 		如：
 * 		    $.getJSON('/js/knowledge/knowledge.json',function(json){
 *		      $scope.knowledge = json.content;
 *		    })
 * ps:  directive is file-upload is required
 * API
 *  id:knowledge唯一标识，用来给每一个点命名
 *  url:外链内容来源
 *  ifActive：该点是否在页面上显示（true  false）
 *  showWay：该点展示的方式，目前有的类型是（modal  blank）
 *  width：若为modal弹出方式，iframe的宽度
 *  height：若为modal弹出方式，iframe的高度
 *  iconType：该点在页面上的图标样式，样式名称来自图标库的类名（如：icon-alert-circle 代表感叹号）
 * 注意事项：
 *	根据需求要求，配置文件knowledge.json需要写在对应的项目下，并调取
 *	json结构例子：
 * 	{
 *		"content":[
 *			{"id":"lalala",
 *			 "url":"http://www.baidu.com",
 *			 "ifActive":"true",
 *			 "showWay":"modal",
 *			 "width":"100%",
 *			 "height":"200px",
 *			 "iconType":"icon-alert-circle"
 *			},
 *			{"id":"lululu",
 *			 "url":"http://www.google.com",
 *			 "ifActive":"true",
 *			 "showWay":"blank",
 *			 "iconType":"icon-alert-circle"
 *			}
 *		]
 *	}
 *
 */
define([],function(){
	SyApp.NG.directive('syKnowledge',function(){
		return {
            restrict:'E',
      		templateUrl: '/WebUI/bases/Ng/directive/template/knowledge.html',
      		config:'',
      		scope:{
      			example:'=syExample',
      			config:'=syConfig'      		
      		},
      		link:function(scope){
      			var _tempConfig = _.find(scope.config, function(item){
      				return item.id == scope.example;
      			})
      			scope.knowledgeIfActive = _tempConfig.ifActive;
      			scope.knowledgeIcon = _tempConfig.iconType;
      			scope.knowledgeShow = _tempConfig.showWay;
      			if(scope.knowledgeShow == 'modal'){
      				scope.knowledgeWidth = _tempConfig.width;
      				scope.knowledgeHeight = _tempConfig.height;
      			}
      			scope.show = function(){
      				var _cookieLang = syUtil.store.cookie.get('language');
      				scope.knowledgeUrl = _tempConfig.url;
      				console.log(_cookieLang);
      			}
      		}
        }
	})
})