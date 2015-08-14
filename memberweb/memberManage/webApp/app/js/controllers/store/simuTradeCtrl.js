define(['SY_BASE/syUtil', 'underscore', 'PROD_DIR/util/httpUtil'], function(SyUtil,_){

    SyApp.NG.service('SimuTradeCtrl', function($cookies, $http, HttpUtil) {
    	var self = this;
	 	self.scope = null;

	 	self.init = function(scope){
            self.scope = scope;
            self.scope.buyer = "";
            self.scope.seller = "";

            self.buyerLock = false;                        
            self.scope.buyerChange = function(){
            	if (self.buyerLock) 
            		return;
            	if (self.scope.buyerName.length == 0) {
	            	return;
	            };
            	self.buyerLock = true;
            	setTimeout(function(){
            		self.buyerLock = false;
            		if (self.scope.buyerName.length == 0) {
		            	return;
		            };
            		var data = {
            			'key': self.scope.buyerName
            		}
            		self.scope.buyerList = null;
            		$('#noBuyer').hide();
            		HttpUtil.get("/member/user/key", data, function(result){
	                    if (result.status == 1) {
	                        self.scope.buyerList = result.data;
	                        if (result.data.length == 0) {
	                        	$('#noBuyer').show();
	                        	return;
	                        };
	                    }else{
	                    	$('#noBuyer').show();
	                    }
	                    $('#buyerSelect').fadeIn('fast')
	                },false)
            	},500)
            }

            self.scope.buyer = null;
            self.scope.getBuyerMsg = function(buyer){
            	$('#buyerSelect').fadeOut('fast')
            	self.scope.buyerName = buyer.userName; 
            	self.scope.buyer = buyer;
            }

            self.sellerLock = false;
            self.scope.sellerChange = function(){
            	if (self.sellerLock) 
            		return;
            	if (self.scope.sellerName.length == 0) {
	            	return;
	            };
            	self.sellerLock = true;
            	setTimeout(function(){
            		self.sellerLock = false;
            		var data = {
            			'key': self.scope.sellerName            			
            		}
            		self.scope.sellerList = null;
            		$('#noSeller').hide();
            		HttpUtil.get("/member/user/key", data, function(result){   //等待后端API
	                    if (result.status == 1) {
	                        self.scope.sellerList = result.data;
	                        if (result.data.length == 0) {
	                        	$('#noSeller').show();
	                        };
	                    }else{
	                    	$('#noSeller').show();
	                    }
	                    $('#sellerSelect').fadeIn('fast')
	                },false)
            	},500)
            }
            self.scope.seller = null;
            self.scope.getSellerMsg = function(seller){
            	$('#sellerSelect').fadeOut('fast')
            	self.scope.sellerName = seller.userName; 
            	self.scope.seller = seller;
            }
            self.searchBuyerKeyIndex = -1;
	        self.scope.searchBuyerKeyOrder = function(event){
	            if ($("#buyerSelect").is(":hidden"))
	                return;
	            switch (event.keyCode){
	                case 13: 
	                     //input enter key
	                     if (self.searchBuyerKeyIndex < 0)
	                        return;
	                     self.scope.getBuyerMsg(self.scope.buyerList[self.searchBuyerKeyIndex]);
	                    break;
	                case 40:                    
	                    // input down key
	                    var len = self.scope.buyerList.length;
	                    if (self.searchBuyerKeyIndex < len-1 ){
	                        self.searchBuyerKeyIndex ++;                        
	                        $("#buyerSelect .active").removeClass('active');
	                        $("#buyerList_" + self.searchBuyerKeyIndex).addClass('active');
	                        self.scope.buyerName = self.scope.buyerList[self.searchBuyerKeyIndex].userName;                        
	                    }else{
	                        if (self.searchBuyerKeyIndex == len-1) {
	                            self.searchBuyerKeyIndex = 0;
	                            $("#buyerSelect .active").removeClass('active');
	                            $("#buyerList_" + self.searchBuyerKeyIndex).addClass('active');
	                            self.scope.buyerName = self.scope.buyerList[self.searchBuyerKeyIndex].userName;
	                        };
	                    }
	                    break;
	                case 38:
	                    // input up key
	                    var len = self.scope.buyerList.length;                                        
	                    if (self.searchBuyerKeyIndex >= 1){
	                        self.searchBuyerKeyIndex --;
	                        $("#buyerSelect .active").removeClass('active');
	                        $("#buyerList_" + self.searchBuyerKeyIndex).addClass('active');
	                        self.scope.buyerName = self.scope.buyerList[self.searchBuyerKeyIndex].userName;
	                    }else{
	                        if (self.searchBuyerKeyIndex == 0) {
	                            self.searchBuyerKeyIndex = len-1;
	                            $("#buyerSelect .active").removeClass('active');
	                            $("#buyerList_" + self.searchBuyerKeyIndex).addClass('active');
	                            self.scope.buyerName = self.scope.buyerList[self.searchBuyerKeyIndex].userName;
	                        };
	                    }
	                    break;
	            }
	        }
	        self.searchSellerKeyIndex = -1;
	        self.scope.searchSellerKeyOrder = function(event){
	            if ($("#sellerSelect").is(":hidden"))
	                return;
	            switch (event.keyCode){
	                case 13: 
	                     //input enter key
	                     if (self.searchSellerKeyIndex < 0)
	                        return;
	                     self.scope.getSellerMsg(self.scope.sellerList[self.searchSellerKeyIndex]);
	                    break;
	                case 40:                    
	                    // input down key
	                    var len = self.scope.sellerList.length;
	                    if (self.searchSellerKeyIndex < len-1 ){
	                        self.searchSellerKeyIndex ++;                        
	                        $("#sellerSelect .active").removeClass('active');
	                        $("#sellerList_" + self.searchSellerKeyIndex).addClass('active');
	                        self.scope.sellerName = self.scope.sellerList[self.searchSellerKeyIndex].userName;                        
	                    }else{
	                        if (self.searchSellerKeyIndex == len-1) {
	                            self.searchSellerKeyIndex = 0;
	                            $("#sellerSelect .active").removeClass('active');
	                            $("#sellerList_" + self.searchSellerKeyIndex).addClass('active');
	                            self.scope.sellerName = self.scope.sellerList[self.searchSellerKeyIndex].userName;
	                        };
	                    }
	                    break;
	                case 38:
	                    // input up key
	                    var len = self.scope.sellerList.length;                                        
	                    if (self.searchSellerKeyIndex >= 1){
	                        self.searchSellerKeyIndex --;
	                        $("#sellerSelect .active").removeClass('active');
	                        $("#sellerList_" + self.searchSellerKeyIndex).addClass('active');
	                        self.scope.sellerName = self.scope.sellerList[self.searchSellerKeyIndex].userName;
	                    }else{
	                        if (self.searchSellerKeyIndex == 0) {
	                            self.searchSellerKeyIndex = len-1;
	                            $("#sellerSelect .active").removeClass('active');
	                            $("#sellerList_" + self.searchSellerKeyIndex).addClass('active');
	                            self.scope.sellerName = self.scope.sellerList[self.searchSellerKeyIndex].userName;
	                        };
	                    }
	                    break;
	            }
	        }
	        self.scope.tradeDisabled = false;
	        self.scope.trade = function(){
	        	// syUtil.base.LoadingBtn.disable("#tradeBtn", "加载中...");
	        	// setTimeout(function(){
          //       syUtil.base.LoadingBtn.enable("#tradeBtn", "成功", 'btn-success');
          //   }, 2000);
	        	
	        	// return;

	        	if (self.scope.buyer == null || self.scope.seller ==null  || self.scope.buyer.userName.length == 0 || self.scope.seller.userName.length == 0) {
	        		self.scope.alert('请选择交易双方');
	        		return;
	        	};
	        	if ($('#quantity').val().length == 0) {
	        		self.scope.alert('交易数量不能为空！');
	        		return;
	        	};	        	
	        	if (self.scope.buyer.userName == self.scope.seller.userName) {
	        		self.scope.alert('买家和卖家不能相同');
	        		return;
	        	};
	        	var data = {
	        		'buyId': self.scope.buyer.userId,
	        		'sellId': self.scope.seller.userId,
	        		'number': parseInt($('#quantity').val())
	        	}	        	
	        	HttpUtil.post("/member/trade", null, function(result){
	        		self.scope.tradeDisabled = true;
	        		syUtil.base.LoadingBtn.disable("#tradeBtn", "加载中...");
	        		if (result.status == 1) {
	        			self.scope.tradeDisabled = false;
	        			setTimeout(function(){
			                syUtil.base.LoadingBtn.enable("#tradeBtn", "交易成功", 'btn-success');
			            }, 1000);
	        			syUtil.base.LoadingBtn.enable("#tradeBtn", "交易", "");
	        			for(var beneficiary in result.data) {  //Beneficiary   受益者
	        				self.scope.beneficiaryMsg = result.data;
	        			}   
	        		}else{
	        			self.scope.tradeDisabled = false;
	        			self.scope.alert('余额不足，无法交易！')
	        			syUtil.base.LoadingBtn.enable("#tradeBtn", "交易", "");
	        		}
	        	}, false, data)
        	}
        	self.scope.getProperty = function(property){
	            switch(property) {
	            	case 'member':  
	            		return '普通会员';
	            		break;
	            	case 'VIP':
	            		return 'VIP会员';
	            		break;
	            	case 'manage':
	            		return '管理公司';
	            		break;
	            	case 'ESite':
	            		return 'E站';
	            		break;
	            	case 'referrer':
	            		return '推荐人';
	            		break;
	            }
	        }
        }//end init
        
        self.eventAfterLogin = function(){

        } 
    }); //simuTradeCtrl
});