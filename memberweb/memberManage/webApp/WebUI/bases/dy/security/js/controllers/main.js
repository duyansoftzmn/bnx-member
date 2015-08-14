/**
 * Created by Jian on 11/10/2014.
 */
define([
  "SY_BASE/Ng/directive/syi18n"
],function(){
  SyApp.NG.controller('Ng.securityCtrl',[
    '$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http){
    $scope.phoneNumber = '';
    $scope.verifyCode ='';
    $scope.password='';
    $scope.newPwdParams = {};
    $scope.verifyDisabled = false;
    $scope.verifyCountDown = -1;
    $scope.checkPass = false;

    $scope.getVerifyCode = function(){
      $http({
        url : '/cake/sms/send',
        method : 'POST',
        params : {
          mobile : $scope.phoneNumber
        }
      }).success(function(response){
        if(response.status == 1){
          _verifyTimeout(120);
        }
      })
    };

    $scope.checkVerifyCode = function(){
      $http({
        url:'/cake/studio/check',
        method:'POST',
        params:{
          mobile : $scope.phoneNumber,
          token : $scope.verifyCode
        }
      }).success(function(response){
        if(response.status ==1 ){
          //uid token spaceid orgid
          $scope.newPwdParams = {
            uid : response.data.userId,
            token : response.data.token
          };
          $('.newPwd').removeAttr('disabled');
        }
      })
    };

    $scope.resetPassword = function(){
      $scope.newPwdParams.password = $scope.password;
      $http({
        url : '/cake/account/password',
        method:'POST',
        params : $scope.newPwdParams
      }).success(function(response){
        alert(response.message);
      })
    };


    $scope.isAccountPhone = function(){
      if(!$scope.phoneNumber)
        return false;
      return (/(^[0-9]{11}$)/).test($scope.phoneNumber);
    };
    var _verifyTimeout = function(time){
      if(time== 0 ){
        $scope.verifyCountDown = -1;
        $('#verifyCountDown').html('');
        $scope.verifyDisabled = false;
      }else{
        $scope.verifyDisabled = true;
        $scope.verifyCountDown = time;
        $('#verifyCountDown').html('('+time+')');
        setTimeout(function(){
          _verifyTimeout(time-1)
        },1000)
      }
    }



  }])
});