/**
 * Created by Lee on 1/14/2015.
 */
 var DyMenu;
 var _tempUrl = window.location.search;
 var _orgId = _tempUrl.split("=")[1].split("&")[0];
(function($){     
	$.fn.extend({     
		getMenu:function(config){
			var _appList;
			var self = this;
			console.log(config);
			loadLogin(self,config);
			getAppList(self,config);
			setInterval(function(){
		      _checkCookies(self);
		    },500);
		}     
	})     

	function loadLogin(thisElement,config){
		thisElement.css('padding-top','30px');
		thisElement.append("<div id='smsCheckBlock' style='display:'><div id='inputGroup-p' class='form-group has-success'><label class='control-label' for='feedbackAccount'>手机</label><div class='input-group'><input type='text' class='form-control' placeholder='手机' id='feedbackAccount'><span class='input-group-btn'><button class='btn btn-default btn-verify' type='button' id='getVerifyCode'>获取验证码<span id='countDown'></span></button></span></div></div><div id='inputGroup-v' class='form-group has-success'><label class='control-label' for='feedbackVerify'>验证码</label><div class='input-group'><input type='text' class='form-control' placeholder='验证码' id='feedbackVerify'><span class='input-group-btn'><button class='btn btn-default btn-verify-submit' type='button'>验证</button></span></div></div><hr></div>");
		$(".btn-verify").bind("click",function(){
			$.post("http://www.duyansoft.com/cake/sms/send",{mobile:$("#feedbackAccount")[0].value},function(response){
				$('#getVerifyCode').attr('disabled',true);
				_verifyTimeout(120);
			})
		});
		$(".btn-verify-submit").bind("click",function(){
			$.post("http://www.duyansoft.com/cake/sms/check",{mobile:$("#feedbackAccount")[0].value,token:$("#feedbackVerify")[0].value,gid:config},function(response){
				if(response.status == 1){
					syUtil.store.cookie.set('uid',response.data.userId);
					syUtil.store.cookie.set('token',response.data.token);
					syUtil.store.cookie.set('orgid',_orgId);
                    $('#smsCheckBlock').fadeOut(500);
				}
			})
		})
	}

	function getAppList(thisElement,config){
		console.log(config);
		$.get("/cake/group/"+config+"/application",function(response){
			if(response.status == 1){
				_appList = response.data;
				loadMenu(_appList,thisElement);
				console.log(_appList);
			}else{
			}
		});
	};

	function loadMenu(appList, thisElement){
		for(var i=0;i<appList.length;i++){

			thisElement.append("<button type='button' class='servBtn btn btn-default btn-lg btn-block' homepage='"+(appList[i].homepage||'')+"' flowid="+appList[i].applicationId+" title="+appList[i].name+">"+appList[i].name+"</button>");
		}
		var _buttonList = $(thisElement.selector+" .servBtn");
		_buttonList.bind("click",function(){
			var _uId = syUtil.store.cookie.get('uid');
			var _token = syUtil.store.cookie.get('token');
			if(!!$(this).attr('homepage')){
				window.postMessage({'cmd':'open','params': ['/cake/show?appId='+$(this).attr('flowid')]},window.location.origin);
			}else{
				$.post("http://www.duyansoft.com/cake/start",{uid:_uId,token:_token,oid:_orgId,flowId:$(this).attr('flowid')},function(response){
					if(response.status == 1){
						window.postMessage({'cmd':'open','params': [response.data.url+"&token="+_token,response.data.title]},window.location.origin);
					}
				})
			}

		})
	};

	function _verifyTimeout(time){
        if(time == 0 ){
            $('#countDown').html('');
            $('#getVerifyCode').removeAttr('disabled');
        }else{
            $('#countDown').html('('+time+')');
            $('#getVerifyCode').attr('disabled','disabled');
            setTimeout(function(){
                _verifyTimeout(time-1);
            },1000)
        }
    };

    function _checkCookies(thisElement){
    	// console.log($(thisElement.selector+" .servBtn"));
        if(!syUtil.store.cookie.get('token') || syUtil.store.cookie.get('token').length != 36) {
            $(thisElement.selector).find('.servBtn').attr("disabled",'disabled');
            $('#smsCheckBlock').show();
        }else{
            $(thisElement.selector+" .servBtn").removeAttr("disabled");
            $('#smsCheckBlock').fadeOut(500);
        }
    };
    
})(jQuery);     
