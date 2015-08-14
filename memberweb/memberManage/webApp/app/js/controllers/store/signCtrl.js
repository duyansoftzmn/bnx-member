define(['SY_BASE/syUtil', 'PROD_DIR/util/httpUtil'], function(SyUtil){

    SyApp.NG.service('SignCtrl', function($cookies, $http, HttpUtil) {
        var self = this;
        self.scope = null;

        self.init = function(scope, callbackFun){
            self.scope = scope;
            self.scope.isloading = true;
            self.scope.logined = false;
            self.scope.signType = "login";

            self.scope.isGetVerifyCode = false;
            self.scope.getVerifyCode = function(signInObj){
                if (signInObj.mobile.length != 11){
                    self.scope.alert("请填写11位手机号");
                    return;
                }
                    

                self.scope.isGetVerifyCode = true;
            
                var countDownTimer = setInterval(function(){
                    scope.$apply(function(){
                        if (signInObj.vcCountdown == 0){
                            clearInterval(signInObj.vcCountdown);
                            signInObj.vcCountdown = 120;
                            self.scope.isGetVerifyCode = false;
                        }else{
                            signInObj.vcCountdown --;
                        }
                    })
                }, 1000)



                HttpUtil.post("/yiren/sms/send", null, function(data){
                    if (data.status != 1){
                        if (data.errorCode == "SE_1001"){
                            self.scope.alert("请稍候再试");
                            return;
                        }
                        self.scope.alert("获取验证码失败");
                    }else{
                        self.scope.alert("验证码已发送, 请查看手机短信");
                    }
                    
                }, false, {mobile: signInObj.mobile});
            }
          
            var userId = SyUtil.store.localStorage.get('userId');
            $cookies["userId"] = userId;

            if(userId){
                callbackFun();
             }

            var _checkCookies = function (){
                if($cookies["userId"]){
                    self.scope.logined = true;
                }else{
                    if (!!userId && userId.length > 5){
                         self.scope.logined = true;
                    }else{
                        self.scope.logined = false;
                    }
                    
                }

            };
             
            setInterval(function(){
                self.scope.$apply(function(){
                    _checkCookies();
                    $("#loginStorePanel, #signInPanel").removeAttr("style");
                    self.scope.isloading = false;
                });
            },500);  



            self.scope.logoutStore = function(){
                $cookies['userId'] = '';
                
                SyUtil.store.localStorage.delOne('userId');

                location.reload();
            }

            var setLoginCookie = function(data){
                $cookies['userId'] = data.userId;
                SyUtil.store.localStorage.set('userId', data.userId);

                $cookies['storeId'] = data.storeId;
                SyUtil.store.localStorage.set('storeId',data.storeId);
                
                self.scope.logined = true;

                self.scope.signInObj = {
                    mobile:"",
                    password1:"",
                    password2:"",
                    verifyCode: ""
                };
            }

            self.scope.signInStore = function(signInObj, event){
                if (signInObj.mobile.length != 11){
                    self.scope.alert("请填写11位手机号");
                    return;
                }

                if (
                        signInObj.password1.length == 0 ||
                         signInObj.password2.length == 0 || 
                         signInObj.password1.length != signInObj.password2.length
                    ){
                    self.scope.alert("请输入密码, 并确保2次输入一致！");
                    return;
                }

                if (signInObj.verifyCode.length != 4){
                    self.scope.alert("请输入正确验证码");
                    return;
                }


                
                var data = {
                    'mobile': signInObj.mobile,
                    'passcode' : signInObj.password1,
                    'userId' : signInObj.verifyCode
                }

                var thisBtnJo = $(event.target);
                thisBtnJo.attr("disabled", "disabled");

                HttpUtil.post("/yiren/store", null, function(result){

                    if (result.status == 1){
                        self.scope.signType = 'login';
                        self.scope.alert("修改成功！请重新登录");
                    }else{
                        self.scope.alert("修改失败！");
                    }
                    thisBtnJo.removeAttr("disabled");
                    
                }, false, data);
            }

            
            self.scope.loginStore = function(loginObj, event){

                if (loginObj.mobile.length == 0){
                    self.scope.alert("请输入会员手机");
                    return;
                }

                if (loginObj.password.length == 0){
                    self.scope.alert("请输入会员密码");
                    return;
                }

                var data = {
                    'mobile' : loginObj.mobile,
                    'password' : loginObj.password
                }

                var thisBtnJo = $(event.target);
                thisBtnJo.attr("disabled", "disabled");

                 $http({method: 'POST',
                     url: "/member/user/login",
                     data :  $.param(data),
                     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                 }).success(function(result){
                    if (result.status == 1){
                        setLoginCookie(result.data);
                    }else{
                        self.scope.alert("手机号码或者密码错误！", "登录失败");
                    }
                    thisBtnJo.removeAttr("disabled");
                    callbackFun();
                }).error(function(){
                    thisBtnJo.removeAttr("disabled");
                });
            } 

        }

    });
});