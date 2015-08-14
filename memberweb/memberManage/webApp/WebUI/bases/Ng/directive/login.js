/**
 * Created by Jian on 8/25/2014.

useage:
    sy-login(sy-login-url="'/cake/account/login'",sy-sign-up-url="'/cake/account/signup'",sy-check="true", sy-goto-url="/mobile" ,sy-sign-up="false")
callback:
 function(response , callback){
    ----------
    logic
    ----------
    if(1){
        callback(message1);
    }else{
        callback(message2);
    }
 }
syi18n : {
    "t_signUp":"Sign Up",
    "t_login":"Login",
    "t_phone":"Phone",
    "t_email":"Email",
    "t_accountPlaceHolder":"Enter phone or email as account",
    "t_dynamicPassword":"Dynamic Pwd",
    "t_password":"Password",
    "t_verifycode":"Verify Code",
    "t_forgetPassword":"Forget Password",
    "t_signIn":"Sign In",
    "t_confirmYourPassword":"Confirm your Password",
    "t_submit":"Submit"
}

 */
define([],function(){

    SyApp.NG.directive('syLogin',function($cookies,$http){

        return {
            restrict:'EA',
            replace:false,
            templateUrl:'/WebUI/bases/Ng/directive/template/login.html',
            scope:{
                checkKey:"=syCheck",
                loginUrl:"=syLoginUrl",
                signUpUrl:"=sySignUpUrl",
                isSignUp:'=sySignUp',
                loginSuccess :'=syLoginSuccess',
                signUpSuccess:'=sySignUpSuccess',
                verifyLogin :'=syVerifyLogin',
                sendVerifyCode:"=syVerifyGet",
                verifyTime:"=syVerifyTime",
                dynamicLogin:"=syVerifyCheck"
            },
            link:function(scope,element,attrs){
                scope.loginChannel = 'password';
                var _isCheck = scope.checkKey&&scope.checkKey.length > 0;
                scope.elementId = 'syLoginModal';
                var _checkCookies = function (){
                    if($cookies[scope.checkKey]){
                        scope.logined = true;
                    }else{
                        scope.logined = false;
                        // open login modal!
                        $('#'+scope.elementId).modal({
                            backdrop:'static',
                            show:true,
                            keyboard:true
                        });
                    }
                };
                if(_isCheck){
                    setInterval(function(){
                        _checkCookies()
                    },500);
                }

                scope.msg = {};
                var _login = function(){

                    var url = scope.loginUrl;
                    scope.logining = true;
                    if(scope.loginChannel == 'verifyCode'){
                        scope.dynamicLogin($("#account").val(),$("#password").val() ,_loginCallBack);
                        return;
                    }

                    $http({method: 'POST',
                        url:url ,
                        data : $.param({name: $("#account").val(), password: $("#password").val()}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function(data){
                            if(scope.loginSuccess){
                                scope.loginSuccess(data ,_loginCallBack)
                            }else{
                                _loginCallBack(1)
                            }
                        }).error(function(){
                            _showMsg('login fail!','warning');
                        });
                };

                scope.login = function(user){
                    var accountJo = $("#account");
                    var accountLen = accountJo.val().length;
                    var pwdJo = $("#password");
                    var pwdLen = pwdJo.val().length;

                    if (accountLen == 0)
                        accountJo.parents('.form-group').addClass('has-error');
                    else
                        accountJo.parents('.form-group').removeClass('has-error');

                    if (pwdLen == 0)
                        pwdJo.parents('.form-group').addClass('has-error');
                    else
                        pwdJo.parents('.form-group').removeClass('has-error');


                    if (accountLen > 0 &&  pwdLen >0){
                        _login()
                        return true;
                    }

                    return false;
                }
                scope.isPwdMatch = function(user){
                    if (user.password.length > 0 && user.confirmPassword == user.password){
                        return false;
                    }
                    else {
                        return true;
                    }

                }
               scope.signUp = function(user){
                   scope.joining = true;
                   if (!(!!user.account &&user.account.length >0))
                   {
                       scope.joining = false;
                       scope.error = {has: true, content: "Error:  Incorrect account" , classStr:"alert alert-warning"};
                       return;
                   }

                   var params = {name: user.account, password: user.password};
                   var url = scope.signUpUrl;
                   $http({method: 'POST',
                       url: url ,
                       params :  params
                   }).success(function(data){
                            if(scope.signUpSuccess){
                                scope.signUpSuccess(data , _signUpCallBack)
                            }else{
                                _signUpCallBack(1)
                            }
                       }).error(function(){
                             _showMsg("Error: 500",'warning')
                       });
               };

                scope.getVerifyCode = function(){
                    scope.sendVerifyCode(scope.user.account,_getVerifyCallback);
                };
                var _showMsg = function (msg,type){
                    scope.logining = false;
                    scope.joining = false;
                    scope.msg.content = msg;
                    scope.msg.type = type||'info';
                    setTimeout(_resetMsg,3000)
                };
                var _resetMsg = function(){
                    scope.$apply(function(){
                        scope.msg = {};
                    })
                };

                var _loginCallBack = function(status,message){
                    scope.logining = false;
                    switch(status){
                        default :
                        case 0:
                            _showMsg(message||'Login Failed !',msgTypes[0]);
                            break;
                        case 1:
                            $('#' + scope.elementId).modal('hide');
                            _showMsg(message||'Login Success !',msgTypes[1]);
                            break;
                    }

                };
                var _signUpCallBack =function(status,message){
                    switch(status){
                        default :
                        case 0:
                            _showMsg(message||'Sign Up Failed !',msgTypes[0]);
                            break;
                        case 1:
                            setTimeout(function(){
                                $('[href="#'+scope.elementId+'SignIn"]').tab('show');
                            }, 1000)
                            _showMsg(message||'Sign Up Success !',msgTypes[1]);
                            break;
                    }
                };
                var _getVerifyCallback = function(status , message){
                    switch(status){
                        default :
                        case 0:
                            _showMsg(message||'Get Verify Code Failed !',msgTypes[0]);
                            break;
                        case 1:
                            _verifyTimeout(scope.verifyTime);
                            scope.loginChannel = 'verifyCode';
                            break;
                    }

                };

                var msgTypes = {
                    0:'warning',
                    1:'success'
                }


                scope.validStyle = {
                    'true':{},
                    'false':{
                        'border-color':'red'
                    }
                };

                scope.isAccountPhone = function(){
                    if(!scope.user||!scope.user.account)
                        return false;
                    return (/(^[0-9]{11}$)/).test(scope.user.account);
                };

                scope.verifyDisabled = false;
                scope.verifyCountDown = -1;
                var _verifyTimeout = function(time){
                    if(time== 0 ){
                        scope.verifyCountDown = -1;
                        $('#verifyCountDown').html('');
                        scope.verifyDisabled = false;
                    }else{
                        scope.verifyDisabled = true;
                        scope.verifyCountDown = time;
                        $('#verifyCountDown').html('('+time+')');
                        setTimeout(function(){
                            _verifyTimeout(time-1)
                        },1000)
                    };
                }

                scope.switchChannel = function(channel){
                    if(channel == 'verifyCode'&&!scope.isAccountPhone()){
                        return;
                    }
                    scope.loginChannel = channel;
                }
            }
        }
    })
})

