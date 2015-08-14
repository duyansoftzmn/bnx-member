define(['SY_BASE/syUtil', 'underscore', 'PROD_DIR/util/httpUtil'], function(SyUtil,_){

    SyApp.NG.service('SearchMemberCtrl', function($cookies, $http, HttpUtil) {
    	var self = this;
	 	self.scope = null;

	 	self.init = function(scope){
            self.scope = scope;
            self.scope.referMemberName = "";
            self.scope.modifyReferee = "";
            self.scope.searchContent = "";
        self.changeContentLock = false;
        self.scope.changeContent = function(){
          //todo ajax -> java
            if (self.scope.searchContent.length == 0) {
                return;
            };
            if (self.changeContentLock)
                    return;        
                self.changeContentLock = true;

                setTimeout(function(){
                    self.changeContentLock = false;
                    if (self.scope.searchContent.length == 0) {
                        return;
                    };
                    var data = {
                        'key': self.scope.searchContent
                    // 'transientData':{'referrerId': $cookies['userId']}
                    };
                    $('#noResultMsg').hide();
                    HttpUtil.get("/member/user/key", data, function(result){
                        if (result.status == 1) {
                            self.scope.searchResultList = result.data;
                            if (result.data.length == 0) {
                                $('#noResultMsg').show();
                            };
                        }else{
                            $('#noResultMsg').show();
                        }
                        $('#searchResult').fadeIn('fast')
                    },false)

                },500);
        }

        self.refereeContentLock = false;
        self.scope.refereeContent = function(){
            if (self.scope.referMemberName.length == 0) {
                return;
            };
            if (self.refereeContentLock)
                return;

            self.refereeContentLock = true;

            setTimeout(function(){
                self.refereeContentLock = false;
                if (self.scope.referMemberName.length == 0) {
                return;
            };

                var data = {
                    'key': self.scope.referMemberName
                // 'transientData':{'referrerId': $cookies['userId']}
                };
                $('#noReferResult').hide();
                HttpUtil.get("/member/user/key", data, function(result){
                    if (result.status == 1) {
                        self.scope.searchRefereeList = result.data;
                        if (result.data.length == 0) {
                           $('#noReferResult').show(); 
                        };
                    }else{
                        $('#noReferResult').show();
                    }
                    $('#refereeList').fadeIn('fast')
                },false)

            },500);
            
        }

        self.modifyRefereeChangeLock = false;
        self.scope.modifyRefereeChange = function(){
            if (self.scope.modifyReferee.length == 0) {
                return;
            };
            if (self.modifyRefereeChangeLock)
                return;

            self.modifyRefereeChangeLock = true;

            setTimeout(function(){
                self.modifyRefereeChangeLock = false;
                if (self.scope.modifyReferee.length == 0) {
                return;
            };

                var data = {
                    'key': self.scope.modifyReferee
                // 'transientData':{'referrerId': $cookies['userId']}
                };
                $('#noReferMsg').hide();
                HttpUtil.get("/member/user/key", data, function(result){
                    if (result.status == 1) {
                        self.scope.modifyRefereeList = result.data;
                        if (result.data.length == 0) {
                            $('#noReferMsg').show();
                        };
                    }else{
                        $('#noReferMsg').show();
                    }
                    $('#modifyReferList').fadeIn('fast')
                },false)

            },500);   
        }
        
        self.scope.modifyReferee = null;
        self.scope.getModifyReferee = function(modifyRef){
            //todo member...
            $('#modifyReferList').fadeOut('fast')
            self.scope.modifyReferee = modifyRef.userName;
            self.scope.member.referrerId = modifyRef.userId;
            self.scope.modifyRef = modifyRef;
        }

        self.scope.referee = null;
        self.scope.refereeDisabled = false;
        self.scope.getRefereeName = function(referee){

            $('#refereeList').fadeOut('fast');
            self.scope.referMemberName = referee.userName;
            self.scope.refereeDisabled = true;
            self.scope.showingHideInput = 'showingCreateMsg';
            self.scope.referee = referee;
        }

        self.scope.member = null;
        self.scope.referrerDisabled = false;
        self.scope.openMemberMsg = function(member, newmember){
            //todo member...
            $('#searchResult').fadeOut('fast')

            HttpUtil.get("/member/user/getParentChild", {'userId': member.userId}, function(result){
                if (result.status == 1) {
                    self.scope.propertyParent = result.data.parent;
                    self.scope.propertyLeft = result.data.left;
                    self.scope.propertyRight = result.data.right;
                    if(result.data.user.userName == 'root'){
                        self.scope.referrerDisabled = true;
                        self.scope.modifyReferee = '无推荐人';
                        return;
                    }else{
                        self.scope.referrerDisabled = false;
                        self.scope.modifyReferee = result.data.referrer.userName;
                    }
                };
            },false);

            self.scope.searchContent = member.userName;
            self.scope.member = member;
            switch(member.property){
                case 'member':
                    self.scope.propertyContent = '普通会员'
                    break;
                case 'VIP':
                    self.scope.propertyContent = 'VIP'
                    break;
                case 'ESite':
                    self.scope.propertyContent = 'E站'
                    break;
                case 'manage':
                    self.scope.propertyContent = '管理公司'
                    break;
                case 'referrer':
                    self.scope.propertyContent = '推荐人'
                    break;
            }
            // self.scope.propertyList = modifyReferee;
            self.scope.showingTab = 'searchUserList';
            if (member != null && self.scope.showMemberChart == false) {
                $('#memberChart').hide();
                self.scope.showingTab = 'searchUserList';
                self.scope.showMemberChart = true;             
            };
            if (member != null && self.scope.showMemberPng == true) {
                self.scope.showingTab = 'searchUserList';                
                $('#memberChart').hide();
                $('#memberListCtrl').show();
                self.scope.showMemberPng = false;
                self.scope.showMemberChart = true;
            };
        }

        self.scope.member = null;
        self.scope.referrerDisabled = false;
        self.scope.openParentMsg = function(member){
            self.scope.member = member;
            $('#selectAddress').show();
            $('#selectAddressOption').hide();
            $('#selectAddress button').show();
            HttpUtil.get("/member/user/"+ self.scope.propertyParent.userId, null, function(result){
                if (result.status == 1) {
                    self.scope.member = result.data;
                    switch(result.data.property){
                case 'member':
                    self.scope.propertyContent = '普通会员'
                    break;
                case 'VIP':
                    self.scope.propertyContent = 'VIP'
                    break;
                case 'ESite':
                    self.scope.propertyContent = 'E站'
                    break;
                case 'manage':
                    self.scope.propertyContent = '管理公司'
                    break;
                case 'referrer':
                    self.scope.propertyContent = '推荐人'
                    break;
            }
                };
            },false);

            HttpUtil.get("/member/user/getParentChild", {'userId': self.scope.propertyParent.userId}, function(result){
                if (result.status == 1) {
                    self.scope.propertyParent = result.data.parent;
                    self.scope.propertyLeft = result.data.left;
                    self.scope.propertyRight = result.data.right;
                    if(result.data.user.userName == 'root'){
                        self.scope.referrerDisabled = true;
                        self.scope.modifyReferee = '无推荐人';
                        return;
                    }else{
                        self.scope.referrerDisabled = false;
                        self.scope.modifyReferee = result.data.referrer.userName;
                    }
                };
            },false);
           
            // self.scope.modifyReferee = modifyReferee;
        }

        self.scope.member = null;
        self.scope.referrerDisabled = false;
        self.scope.openLeftMsg = function(member){
            $('#selectAddress').show();
            $('#selectAddressOption').hide();
            $('#selectAddress button').show();
            HttpUtil.get("/member/user/"+ self.scope.propertyLeft.userId, null, function(result){
                if (result.status == 1) {
                    self.scope.member = result.data;
                    switch(result.data.property){
                case 'member':
                    self.scope.propertyContent = '普通会员'
                    break;
                case 'VIP':
                    self.scope.propertyContent = 'VIP'
                    break;
                case 'ESite':
                    self.scope.propertyContent = 'E站'
                    break;
                case 'manage':
                    self.scope.propertyContent = '管理公司'
                    break;
                case 'referrer':
                    self.scope.propertyContent = '推荐人'
                    break;
            }
                };
            },false);

            HttpUtil.get("/member/user/getParentChild", {'userId': self.scope.propertyLeft.userId}, function(result){
                if (result.status == 1) {
                    self.scope.propertyParent = result.data.parent;
                    self.scope.propertyLeft = result.data.left;
                    self.scope.propertyRight = result.data.right;
                    if(result.data.user.userName == 'root'){
                        self.scope.referrerDisabled = true;
                        self.scope.modifyReferee = '无推荐人';
                        return;
                    }else{
                        self.scope.referrerDisabled = false;
                        self.scope.modifyReferee = result.data.referrer.userName;
                    }
                };
            },false);
            self.scope.member = member;
            // self.scope.modifyReferee = modifyReferee;
        }

        self.scope.member = null;
        self.scope.referrerDisabled = false;
        self.scope.openRightMsg = function(member){
            $('#selectAddress').show();
            $('#selectAddressOption').hide();
            $('#selectAddress button').show();
            HttpUtil.get("/member/user/"+ self.scope.propertyRight.userId, null, function(result){
                if (result.status == 1) {
                    self.scope.member = result.data;
                    switch(result.data.property){
                case 'member':
                    self.scope.propertyContent = '普通会员'
                    break;
                case 'VIP':
                    self.scope.propertyContent = 'VIP'
                    break;
                case 'ESite':
                    self.scope.propertyContent = 'E站'
                    break;
                case 'manage':
                    self.scope.propertyContent = '管理公司'
                    break;
                case 'referrer':
                    self.scope.propertyContent = '推荐人'
                    break;
            }
                };
            },false);

            HttpUtil.get("/member/user/getParentChild", {'userId': self.scope.propertyRight.userId}, function(result){
                if (result.status == 1) {
                    self.scope.propertyParent = result.data.parent;
                    self.scope.propertyLeft = result.data.left;
                    self.scope.propertyRight = result.data.right;
                    if(result.data.user.userName == 'root'){
                        self.scope.referrerDisabled = true;
                        self.scope.modifyReferee = '无推荐人';
                        return;
                    }else{
                        self.scope.referrerDisabled = false;
                        self.scope.modifyReferee = result.data.referrer.userName;
                    }
                };
            },false);
            self.scope.member = member;
            // self.scope.modifyReferee = modifyReferee;
        }

        self.scope.openModal = function(){
            $('#addMemberModal').modal('show');
            self.scope.referMemberName = null;
            self.scope.showingHideInput = !'showingCreateMsg';
            self.scope.refereeDisabled = false;
            $('#userName').val("");
            $('#userPhoneNumber').val("");
            $('#userAddress').val("");
            $('#userRemarks').val("");
            self.scope.province = "";
            self.scope.city = "";
            self.scope.county = "";
        }

        self.scope.isDisabled = false;
        self.scope.createMember = function(){            

            self.scope.noUserName = false;
            if ($('#userName').val().length == 0) {
                self.scope.noUserName = true;
                return;
            };
            self.scope.errorLengthPhone = false;
            if ($('#userPhoneNumber').val().length != 11) {
                self.scope.errorLengthPhone = true;
                return;
            };
            self.scope.noAddress = false;
            if ($('#userAddress').val().length == 0) {
                self.scope.noAddress = true;
                return;
            };
            if ($('#selectP option:selected').text() == '-- 请选择省份 --' || $('#selectC option:selected').text() 
                == '-- 请选择城市 --' || $('#selectCt option:selected') == '-- 请选择县或区 --') {
                var data = {
                    'userName' : $('#userName').val(),
                    'mobile' : $('#userPhoneNumber').val(),                
                    'note' : $('#userRemarks').val(),
                    'province' : '',
                    'city' : '',
                    'county' : '',
                    'address' : $('#userAddress').val(),
                    'referrerId' : self.scope.referee.userId
                };
            }else{
                var data = {
                    'userName' : $('#userName').val(),
                    'mobile' : $('#userPhoneNumber').val(),                
                    'note' : $('#userRemarks').val(),
                    'province' : $('#selectP option:selected').text(),
                    'city' : $('#selectC option:selected').text(),
                    'county' : $('#selectCt option:selected').text(),
                    'address' : $('#userAddress').val(),
                    'referrerId' : self.scope.referee.userId
                }
            }
            self.scope.isDisabled = true;
            HttpUtil.post("/member/user", data, function(result){
                // todo ajax to java                    
                if (result.status == 1) {
                    self.scope.isDisabled = false;
                    self.scope.alert('添加成功！');
                    self.scope.isDisabled = false;
                }else{
                    self.scope.isDisabled = false;
                    if (result.message == 'invalid mobile') {
                        self.scope.alert('非法的手机号码')    
                    };
                    if (result.message == 'mobile exists') {
                        self.scope.alert('该手机号码已被使用')    
                    };
                }
            })
            $('#addMemberModal').modal('hide');
      

        }
        self.scope.modifyDisabled = false;
        self.scope.modifyMemberInfo = function(){             
            self.scope.mdfNoUserNamen = false;
            if (self.scope.member.userName.length == 0) {
                self.scope.mdfNoUserNamen = true;
            };
            self.scope.mdfNoMobile = false;
            if (self.scope.member.mobile.length != 11) {
                self.scope.mdfNoMobile = true;
            };
            self.scope.mdfNoAddress = false;
            if (self.scope.member.address.length == 0) {
                self.scope.mdfNoAddress = true;
            };
            if (self.scope.member.userName != 'root') {
                if (self.scope.modifyReferee.length == 0) {
                    self.scope.noReferee = true;
                };
            };
            if ($('#modifyP option:selected').text() == '-- 请选择省份 --' || $('#modifyC option:selected').text() == '-- 请选择城市 --'
                || $('#modifyCt option:selected').text() == '-- 请选择县或区 --') {
                province = self.scope.member.province;
                city = self.scope.member.city;
                county = self.scope.member.county;
                address = self.scope.member.address;
                var data = {
                    'userId' : self.scope.member.userId,
                    'userName' : self.scope.member.userName,
                    'mobile' : self.scope.member.mobile,                
                    'note' : self.scope.member.note,
                    'referrerId' : self.scope.member.referrerId,
                    'property' : self.scope.member.property,
                    'province' : province,
                    'city' : city,
                    'county' : county,
                    'address' : address
                };
            }else{
                var data = {
                    'userId' : self.scope.member.userId,
                    'userName' : self.scope.member.userName,
                    'mobile' : self.scope.member.mobile,                
                    'note' : self.scope.member.note,
                    'referrerId' : self.scope.member.referrerId,
                    'property' : self.scope.member.property,
                    'province' : $('#modifyP option:selected').text(),
                    'city' : $('#modifyC option:selected').text(),
                    'county' : $('#modifyCt option:selected').text(),
                    'address' : $('#modifyDetail').val()
                };
            }
            
            if (self.scope.member.userName.length != 0 && self.scope.member.mobile.length == 11 && self.scope.member.address.length != 0 && self.scope.modifyReferee.length != 0) {
                self.scope.modifyDisabled = true;
               HttpUtil.post("/member/user/update", data, function(result){
                    self.scope.mdfNoUserNamen = false;
                    self.scope.mdfNoMobile = false;
                    self.scope.mdfNoAddress = false;
                    self.scope.noReferee = false;
                    // todo ajax to java
                    if (result.status === 1) {                        
                        self.scope.modifyDisabled = false;
                        self.scope.alert('修改成功！');
                        $('#inputCash').hide();
                        self.scope.member = result.data;
                        $('#selectAddressOption').hide();
                        $('#selectAddress button').show();
                    }else{
                        self.scope.alert('该区域已有管理公司，请重新修改角色！')
                        self.scope.modifyDisabled = false;
                        $('#inputCash').hide();
                        $('#selectAddressOption').hide();
                        $('#selectAddress button').show();
                    }
                }) 
            };
        }

        self.searchKeyIndex = -1;
        self.scope.searchKeyOrder = function(event){
            if ($("#searchResult").is(":hidden"))
                return;
            switch (event.keyCode){
                case 13: 
                     //input enter key
                     if (self.searchKeyIndex < 0)
                        return;
                     self.scope.openMemberMsg(self.scope.searchResultList[self.searchKeyIndex]);
                     self.searchKeyIndex = -1;
                    break;
                case 40:                    
                    // input down key
                    var len = self.scope.searchResultList.length;
                    if (self.searchKeyIndex < len-1 ){
                        self.searchKeyIndex ++;                        
                        $("#searchResult .active").removeClass('active');
                        $("#sm_" + self.searchKeyIndex).addClass('active');
                        self.scope.searchContent = self.scope.searchResultList[self.searchKeyIndex].userName;
                    }else{
                        if (self.searchKeyIndex == len-1) {
                            self.searchKeyIndex = 0;
                            $("#searchResult .active").removeClass('active');
                            $("#sm_" + self.searchKeyIndex).addClass('active');
                            self.scope.searchContent = self.scope.searchResultList[self.searchKeyIndex].userName;
                        };
                    }
                    break;
                case 38:
                    // input up key
                    var len = self.scope.searchResultList.length;                                        
                    if (self.searchKeyIndex >= 1){
                        self.searchKeyIndex --;
                        $("#searchResult .active").removeClass('active');
                        $("#sm_" + self.searchKeyIndex).addClass('active');
                        self.scope.searchContent = self.scope.searchResultList[self.searchKeyIndex].userName;
                    }else{
                        if (self.searchKeyIndex == 0) {
                            self.searchKeyIndex = len-1;
                            $("#searchResult .active").removeClass('active');
                            $("#sm_" + self.searchKeyIndex).addClass('active');
                            self.scope.searchContent = self.scope.searchResultList[self.searchKeyIndex].userName;
                        };
                    }
                    break;
            }
        }
        self.searchModifyKeyIndex = -1;
        self.scope.searchModifyKeyOrder = function(event){
            if ($("#modifyReferList").is(":hidden"))
                return;
            switch (event.keyCode){
                case 13: 
                     //input enter key
                     if (self.searchModifyKeyIndex == -1)
                        return;
                     self.scope.getModifyReferee(self.scope.modifyRefereeList[self.searchModifyKeyIndex]);
                     self.searchModifyKeyIndex = -1;
                    break;
                case 40:
                    // input down key
                    var len = self.scope.modifyRefereeList.length;

                    if (self.searchModifyKeyIndex < len-1 ){
                        self.searchModifyKeyIndex ++;
                        $("#modifyReferSyl .active").removeClass('active');
                        $("#msr_" + self.searchModifyKeyIndex).addClass('active'); 
                        self.scope.modifyReferee = self.scope.modifyRefereeList[self.searchModifyKeyIndex].userName;
                    }else{
                        if (self.searchModifyKeyIndex == len-1) {
                            self.searchModifyKeyIndex = 0;
                            $("#modifyReferSyl .active").removeClass('active');
                            $("#msr_" + self.searchModifyKeyIndex).addClass('active');
                            self.scope.modifyReferee = self.scope.modifyRefereeList[self.searchModifyKeyIndex].userName;
                        };
                    }                   
                    break;
                case 38:
                    // input up key
                    var len = self.scope.modifyRefereeList.length;
                    if (self.searchModifyKeyIndex >= 1){
                        self.searchModifyKeyIndex --;
                        $("#modifyReferSyl .active").removeClass('active');
                        $("#msr_" + self.searchModifyKeyIndex).addClass('active');
                        self.scope.modifyReferee = self.scope.modifyRefereeList[self.searchModifyKeyIndex].userName;
                    }else{
                        if (self.searchModifyKeyIndex == 0) {
                            self.searchModifyKeyIndex = len-1;
                            $("#modifyReferSyl .active").removeClass('active');
                            $("#msr_" + self.searchModifyKeyIndex).addClass('active');
                            self.scope.modifyReferee = self.scope.modifyRefereeList[self.searchModifyKeyIndex].userName;
                        };
                    }
                    break;
            }
            event.stopPropagation();
        }
        self.searchNewKeyIndex = -1;
        self.scope.searchNewKeyOrder = function(event){
            switch (event.keyCode){
                case 13: 
                     //input enter key
                     if (self.searchNewKeyIndex == -1)
                        return;
                     self.scope.getRefereeName(self.scope.searchRefereeList[self.searchNewKeyIndex]);
                     self.searchNewKeyIndex = -1;
                    break;
                case 40:
                    // input down key
                    var len = self.scope.searchRefereeList.length;

                    if (self.searchNewKeyIndex < len-1 ){
                        self.searchNewKeyIndex ++;
                        $("#addMemberModal .active").removeClass('active');
                        $("#nsr_" + self.searchNewKeyIndex).addClass('active');
                        self.scope.referMemberName = self.scope.searchRefereeList[self.searchNewKeyIndex].userName;
                    }else{
                        if (self.searchNewKeyIndex == len-1) {
                            self.searchNewKeyIndex = 0;
                            $("#addMemberModal .active").removeClass('active');
                            $("#nsr_" + self.searchNewKeyIndex).addClass('active');
                            self.scope.referMemberName = self.scope.searchRefereeList[self.searchNewKeyIndex].userName;
                        };
                    }                   
                    break;
                case 38:
                    // input up key
                    var len = self.scope.searchRefereeList.length;

                    if (self.searchNewKeyIndex >= 1){
                        self.searchNewKeyIndex --;
                        $("#addMemberModal .active").removeClass('active');
                        $("#nsr_" + self.searchNewKeyIndex).addClass('active');
                        self.scope.referMemberName = self.scope.searchRefereeList[self.searchNewKeyIndex].userName;
                    }else{
                        if (self.searchNewKeyIndex == 0) {
                            self.searchNewKeyIndex = len-1;
                            $("#addMemberModal .active").removeClass('active');
                            $("#nsr_" + self.searchNewKeyIndex).addClass('active');
                            self.scope.referMemberName = self.scope.searchRefereeList[self.searchNewKeyIndex].userName;
                        };
                    } 
                    break;
            }
        }

        self.scope.propertyChange = function(pContent){
            switch (pContent){
                case 'mcontent':
                    self.scope.propertyContent = '普通会员',
                    self.scope.member.property = 'member'
                    break;
                case 'vcontent':
                    self.scope.propertyContent = 'VIP',
                    self.scope.member.property = 'VIP'
                    break;
                case 'econtent':
                    self.scope.propertyContent = 'E站',
                    self.scope.member.property = 'ESite'
                    break;
                case 'mgcontent':
                    self.scope.propertyContent = '管理公司',
                    self.scope.member.property = 'manage'
                    break;
                case 'rcontent':
                    self.scope.propertyContent = '推荐人',
                    self.scope.member.property = 'referrer'
                    break;
            } 
        }

        self.scope.closeSearchList = function(blurId){
            //todo fadeout member    
            $('#'+ blurId).fadeOut('fast')
        }
        $('#selectAddressOption').hide();
        self.scope.showSelectOption = function(){
            $('#selectAddressOption').show();
            $('#selectAddress button').hide();
        }
        $('#inputCash').hide();
        self.scope.openCashApply = function(){
            $('#inputCash').show();
        }
        self.scope.cancelCashApply = function(){
            $('#inputCash').hide();
            $('#cashValue').val("")
        }
        self.scope.dealwithApply = false;
        self.scope.submitCashApply = function(){
            if ($('#cashValue').val() > self.scope.member.money || $('#cashValue').val() <=0) {
                self.scope.alert('余额不足！')
                $('#cashValue').val("")
                return;
            };
            var data = {
                'userId' : self.scope.member.userId,
                'cash' : $('#cashValue').val()
            }
            self.scope.dealwithApply = true;
            HttpUtil.post("/member/user/cash", null, function(result){
                if (result.status == 1) {
                    self.scope.alert('提现成功')
                    self.scope.dealwithApply = false;
                    self.scope.member = result.data.user;
                    $('#cashValue').val("");
                    $('#inputCash').hide();
                }else{
                    if (result.message == "money isn't enough") {
                        self.scope.alert('余额不足')
                    };
                    if (result.message == "you have no access") {
                        self.scope.alert('普通用户不能进行提现操作！');
                    };                    
                    self.scope.dealwithApply = false;
                }
            }, false, data)
        }        
    }//end init    

		self.eventAfterLogin = function(){

        }    
    }); //searchMemberCtrl
});