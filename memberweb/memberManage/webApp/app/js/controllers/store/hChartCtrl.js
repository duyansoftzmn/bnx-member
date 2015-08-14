define(['SY_BASE/syUtil', 'underscore', 'PROD_DIR/util/httpUtil', 'hChart'], function(SyUtil,_){

    SyApp.NG.service('HChartCtrl', function($cookies, $http, HttpUtil) {
    	var self = this;
	 	self.scope = null;

	 	self.init = function(scope){
            self.scope = scope;
            var data = {};
            HttpUtil.get("/member/user/count",data, function(result){
            	$('#chartTable').highcharts({
					chart: {
			        },
			        title: { 
			            text: '会员增长统计'                                     
			        },                                                                
			        xAxis: {                                                          
			            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
			        },
			        yAxis: [{ // 纵坐标人数
	                    labels: {
	                        format: '{value}人'
	                    },
	                    title: {
	                        text: '人数'
	                    }
	                }],
			        tooltip: {                                                        
			            formatter: function() {                                       
			                var s;                                                    
			                if (this.point.name) { // the pie chart                   
			                    s = ''+                                               
			                        this.point.name +': '+ this.y +' 人';         
			                } else {                                                  
			                    s = ''+                                               
			                        this.x  +': '+ this.y;                            
			                }                                                         
			                return s;                                                 
			            }                                                             
			        },
			        series: [{                                               
			            type: 'column',
			            name: '会员',                  
			            data: [result.data.Jan.member, result.data.Feb.member, result.data.Mar.member, result.data.Apr.member,
			            	   result.data.May.member, result.data.Jun.member, result.data.Jul.member, result.data.Aug.member, 
			            	   result.data.Sep.member, result.data.Oct.member, result.data.Nov.member, result.data.Dec.member]
			        }, {                                               
			            type: 'column',
			            name: 'VIP',
			            data: [result.data.Jan.vip, result.data.Feb.vip, result.data.Mar.vip, result.data.Apr.vip, 
			            	   result.data.May.vip, result.data.Jun.vip, result.data.Jul.vip, result.data.Aug.vip, 
			           		   result.data.Sep.vip, result.data.Oct.vip, result.data.Nov.vip, result.data.Dec.vip]
			        }, {                                               
			            type: 'column',
			            name: 'E站',                    
			            data: [result.data.Jan.esite, result.data.Feb.esite, result.data.Mar.esite, result.data.Apr.esite, 
			            	   result.data.May.esite, result.data.Jun.esite, result.data.Jul.esite, result.data.Aug.esite, 
			            	   result.data.Sep.esite, result.data.Oct.esite, result.data.Nov.esite, result.data.Dec.esite]
			        }, {
			            type: 'column',
			            name: '管理公司',
			            data: [result.data.Jan.manage, result.data.Feb.manage, result.data.Mar.manage, result.data.Apr.manage, 
			            	   result.data.May.manage, result.data.Jun.manage, result.data.Jul.manage, result.data.Aug.manage, 
			            	   result.data.Sep.manage, result.data.Oct.manage, result.data.Nov.manage, result.data.Dec.manage]
			        }, {
			            type: 'column',
			            name: '推荐人',
			            data: [result.data.Jan.referrer, result.data.Feb.referrer, result.data.Mar.referrer, result.data.Apr.referrer, 
			            	   result.data.May.referrer, result.data.Jun.referrer, result.data.Jul.referrer, result.data.Aug.referrer, 
			            	   result.data.Sep.referrer, result.data.Oct.referrer, result.data.Nov.referrer, result.data.Dec.referrer]
			        }, {              
			            type: 'spline',                                               
			            name: '平均人数',                                              
			            data: [result.data.Jan.ave, result.data.Feb.ave, result.data.Mar.ave, result.data.Apr.ave, 
			            	   result.data.May.ave, result.data.Jun.ave, result.data.Jul.ave, result.data.Aug.ave, 
			            	   result.data.Sep.ave, result.data.Oct.ave, result.data.Nov.ave, result.data.Dec.ave],
			            marker: {                                                     
			            	lineWidth: 2,                                               
			            	lineColor: Highcharts.getOptions().colors[5],               
			            	fillColor: 'white'                                          
						}                                                     
			        }] 
			    });//end
            })            
		    self.scope.showMemberChart = false;
		    self.scope.showMemberPng = false;
	        self.scope.switchChart = function(whichPng){
	        	if (whichPng == 'memberChart') {
	        		$('#memberListCtrl').hide();
	        		$('#memberChart').show();
	        		self.scope.showMemberPng = true;
	        		self.scope.showMemberChart = false;
	        	};
	        	if (whichPng == 'memberPng') {
	        		$('#memberListCtrl').show();
	        		$('#memberChart').hide();
	        		self.scope.showMemberPng = false;
	        		self.scope.showMemberChart = true;
	        	};
	        }  
        } //end init        

    })
})