define(
    ["backbone", "underscore",  "text!SY_WIDGET/comments/view/Comments1.html",  "SY_BASE/syUtil", "jquery.bootstrap"],
    function(Backbone, _, template, SyUtil){

        var CommentsView =   Backbone.View.extend({
			loadMoreBtnListener : function(){
				var This = this;

				 $(".comments1LoadMore.btn").click(function(){
					This.loadNextPageComments($(this), This.model);
				 })
			},
        	loadNextPageComments : function(thisJo, thisModel){
        		var This = this;
        		thisJo.attr("disabled", "disabled");
        		
        		var postParam = {
    				"pageNum" : parseInt(thisJo.attr("pagenumber")) + 1,
           		  	"pageSize" : thisJo.attr("pageSize")
        		}
        		postParam[thisModel.attributes.groupParamName] = thisModel.attributes.groupId;
        		
        		$.post(thisModel.attributes.dataSourceUrl, postParam, function(data){
        			thisModel.contents = data;
        			thisModel.attributes.todo = "addmore";
        			
        			
        			$(".comments1LoadMore.btn").remove();
        			 var viewHtml = _.template(template);
                     $(This.el).find(".comments1").append( viewHtml(thisModel) );
                     $(".comments1LoadMore.btn").appendTo($("#commentsList"));
					 
					 This.loadMoreBtnListener();
        		});
        	},
            render : function(){
        	
//        	this.model.contents = {
//        			'total' : 10, 
//        			'rows' : [
//        			          {'date' : '12/34/2014 12:00PM', 'userIcon' : '/MSPUI/bases/img/people.jpg', 'userName' : "testcsd", 'comment' : 'Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.' },
//        			          {'date' : '13/34/2014 12:00PM', 'userIcon' : '/MSPUI/bases/img/people.jpg', 'userName' : "SDstcsd", 'comment' : '123 posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.' }
//        			          ]
//        			};
        	this.model.dateFormat = SyUtil.base.dateFormat;
        	
        	 var viewHtml = _.template(template);
             $(this.el).html( viewHtml(this.model) );
			 this.loadMoreBtnListener();
            	
             return this;
            }

        });
        return CommentsView;
});
