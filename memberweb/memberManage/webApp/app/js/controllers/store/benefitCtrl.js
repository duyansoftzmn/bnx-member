define(['SY_BASE/syUtil', 'underscore', 'PROD_DIR/util/httpUtil'], function(SyUtil,_){

    SyApp.NG.service('BenefitCtrl', function($cookies, $http, HttpUtil) {
        var self = this;
        self.scope = null;

        self.init = function(scope){
            self.scope = scope;
            var data = {};
            self.scope.benefitMsg = {};

            HttpUtil.get("/member/percent/find", data, function(result){
            	for (i in result.data){
            		var tmp = result.data[i];
            		self.scope.benefitMsg[tmp.property] = tmp;
            	}
            }, false)
            self.scope.memberBtnDisabled = false;
            self.scope.vipBtnDisabled = false;
            self.scope.esiteBtnDisabled = false;
            self.scope.manageBtnDisabled = false;
            self.scope.referrerBtnDisabled = false;
            self.scope.saveBenefit = function(membertype){
            	switch(membertype){
            		case 'member':            			
            			if (self.scope.benefitMsg.member.buyPercent  == null || self.scope.benefitMsg.member.sellPercent == null) {
            				self.scope.alert('分配比不能为空！');
            				return;
            			};
            			if (self.scope.benefitMsg.member.buyPercent + self.scope.benefitMsg.member.sellPercent > 100) {
            				self.scope.alert('买卖分配比之和不能大于100%');
            				return;	
            			};
            			var data = {
            				'property': membertype,
	            			'buyPercent': self.scope.benefitMsg.member.buyPercent,
	            			'sellPercent': self.scope.benefitMsg.member.sellPercent,
	            			'level': self.scope.benefitMsg.member.level,
	            			'sellLevel': self.scope.benefitMsg.member.sellLevel
            			}
            			HttpUtil.post("/member/percent/update", data, function(result){
            				syUtil.base.LoadingBtn.disable("#memberBtn", "保存中...");
            				self.scope.memberBtnDisabled = true;
            				if (result.status == 1) {
            					self.scope.memberBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#memberBtn", "保存成功", 'btn-success');
            					}, 1000)
            				}else{
            					self.scope.memberBtnDisabled = false;
            					if (result.message == 'percent is greater than 100% ') {
                                    self.scope.alert('买卖分配比总和不能超过100%！');
                                    setTimeout(function(){
                                        syUtil.base.LoadingBtn.enable("#memberBtn", "保存", '');
                                    }, 1000)
                                };
            				}
            			})
            			break;
            		case 'VIP':            			
            			if (self.scope.benefitMsg.VIP.buyPercent  == null || self.scope.benefitMsg.VIP.sellPercent == null) {
            				self.scope.alert('分配比不能为空！');
            				return;
            			};
            			if (self.scope.benefitMsg.VIP.buyPercent + self.scope.benefitMsg.VIP.sellPercent > 100) {
            				self.scope.alert('买卖分配比之和不能大于100%');
            				return;	
            			};
            			var data = {
            				'property': membertype,
	            			'buyPercent': self.scope.benefitMsg.VIP.buyPercent,
	            			'sellPercent': self.scope.benefitMsg.VIP.sellPercent
            			}
            			HttpUtil.post("/member/percent/update", data, function(result){
            				syUtil.base.LoadingBtn.disable("#vipBtn", "保存中...");
            				self.scope.vipBtnDisabled = true;
            				if (result.status == 1) {
            					self.scope.vipBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#vipBtn", "保存成功", 'btn-success');
            					}, 1000)
            				}else{
            					self.scope.vipBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#vipBtn", "保存失败", 'btn-danger');
            					}, 1000)
            				}
            			})
            			break;
            		case 'ESite':            			
            			if (self.scope.benefitMsg.ESite.buyPercent  == null || self.scope.benefitMsg.ESite.sellPercent == null) {
            				self.scope.alert('分配比不能为空！');
            				return;
            			};
            			if (self.scope.benefitMsg.ESite.buyPercent + self.scope.benefitMsg.ESite.sellPercent > 100) {
            				self.scope.alert('买卖分配比之和不能大于100%');
            				return;	
            			};
            			var data = {
            				'property': membertype,
	            			'buyPercent': self.scope.benefitMsg.ESite.buyPercent,
	            			'sellPercent': self.scope.benefitMsg.ESite.sellPercent
            			}
            			HttpUtil.post("/member/percent/update", data, function(result){
            				syUtil.base.LoadingBtn.disable("#esiteBtn", "保存中...");
            				self.scope.esiteBtnDisabled = true;
            				if (result.status == 1) {
            					self.scope.esiteBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#esiteBtn", "保存成功", 'btn-success');
            					}, 1000)
            				}else{
            					self.scope.esiteBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#esiteBtn", "保存失败", 'btn-danger');
            					}, 1000)
            				}
            			})
            			break;
            		case 'manage':            			
            			if (self.scope.benefitMsg.manage.buyPercent  == null || self.scope.benefitMsg.manage.sellPercent == null) {
            				self.scope.alert('分配比不能为空！');
            				return;
            			};
            			if (self.scope.benefitMsg.manage.buyPercent + self.scope.benefitMsg.manage.sellPercent > 100) {
            				self.scope.alert('买卖分配比之和不能大于100%');
            				return;	
            			};
            			var data = {
            				'property': membertype,
	            			'buyPercent': self.scope.benefitMsg.manage.buyPercent,
	            			'sellPercent': self.scope.benefitMsg.manage.sellPercent
            			}
            			HttpUtil.post("/member/percent/update", data, function(result){
            				syUtil.base.LoadingBtn.disable("#manageBtn", "保存中...");
            				self.scope.manageBtnDisabled = true;
            				if (result.status == 1) {
            					self.scope.manageBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#manageBtn", "保存成功", 'btn-success');
            					}, 1000)
            				}else{
            					self.scope.manageBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#manageBtn", "保存失败", 'btn-danger');
            					}, 1000)
            				}
            			})
            			break;
            		case 'referrer':            			
            			if (self.scope.benefitMsg.referrer.buyPercent  == null || self.scope.benefitMsg.referrer.sellPercent == null) {
            				self.scope.alert('分配比不能为空！');
            				return;
            			};
            			if (self.scope.benefitMsg.referrer.buyPercent + self.scope.benefitMsg.referrer.sellPercent > 100) {
            				self.scope.alert('买卖分配比之和不能大于100%');
            				return;	
            			};
            			var data = {
            				'property': membertype,
	            			'buyPercent': self.scope.benefitMsg.referrer.buyPercent,
	            			'sellPercent': self.scope.benefitMsg.referrer.sellPercent
            			}
            			HttpUtil.post("/member/percent/update", data, function(result){
            				syUtil.base.LoadingBtn.disable("#referrerBtn", "保存中...");
            				self.scope.referrerBtnDisabled = true;
            				if (result.status == 1) {
            					self.scope.referrerBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#referrerBtn", "保存成功", 'btn-success');
            					}, 1000)
            				}else{
            					self.scope.referrerBtnDisabled = false;
            					setTimeout(function(){
            						syUtil.base.LoadingBtn.enable("#referrerBtn", "保存失败", 'btn-danger');
            					}, 1000)
            				}
            			})
            			break;
            	}
            }
        } //end init
        self.eventAfterLogin = function(){

        }  

    })
})