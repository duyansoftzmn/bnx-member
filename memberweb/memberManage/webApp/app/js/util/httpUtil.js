define([], function(){
	SyApp.NG.service('HttpUtil', function($cookies, $http) {
		var self = this;

		var _checkAndResponse = function(callbackFun, result){
			if (result.status == 0 && result.errorCode == 'E_1000'){
				alert("登录超时，请重新登录！");
				$cookies['token'] = '';
				SyUtil.store.localStorage.delOne('token');
				SyUtil.store.localStorage.delOne('storeId');
				window.location.reload();
				return;
			}
			
			callbackFun(result);
		}


		var _setToken = function(param, _withToken){
			if (!_withToken){
				return;
			}

			if (SyApp.PROD_NAME == "store"){
				param['storeId'] = $cookies['storeId'];
				param['token'] = $cookies['token'];
			}else{
				param['vendorId'] = $cookies['vendorId'];
				param['token'] = $cookies['token'];
			}
		}

		self.get = function(url, param, callbackFun, _withToken){
			if (!param)
				param = {}

			
			_setToken(param, _withToken);
			

			$http({method: 'GET',
                     url: url,
                     params : param
             }).success(function(result){
             	_checkAndResponse(callbackFun, result);
            }).error(function(data, status, headers, config) {
		      	callbackFun({'status': 0});
		    });
		}

		self.post = function(url, data, callbackFun, _withToken, _param){
			if (!_param)
				_param = {}

			_setToken(_param, _withToken);

			$http({method: 'POST',
                url: url,
                data : data,
                params : _param
             }).success(function(result){
             	_checkAndResponse(callbackFun, result);
            }).error(function(data, status, headers, config) {
		      	callbackFun({'status': 0});
		    });
		}

		self.postNoJson = function(url, data, callbackFun, _withToken, _param){
			if (!_param)
				_param = {}

			_setToken(_param, _withToken);


            $http({method: 'POST',
                 url: url,
                 data :  $.param(data),
                 params : _param,
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             }).success(function(result){
                _checkAndResponse(callbackFun, result);
            }).error(function(data, status, headers, config) {
		      	callbackFun({'status': 0});
		    });
		}

		self.delete = function(url, param, callbackFun, _withToken){
			if (!param)
				param = {}

			_setToken(param, _withToken);

			$http({method: 'DELETE',
                url: url,
                params : param
             }).success(function(result){
             	_checkAndResponse(callbackFun, result);
            }).error(function(data, status, headers, config) {
		      	callbackFun({'status': 0});
		    });
		}

		self.put = function(url, data, callbackFun, _withToken, _param){
			if (!_param)
				_param = {}

			_setToken(_param, _withToken);

			$http({method: 'PUT',
                url: url,
                data : data,
                params : _param
             }).success(function(result){
             	_checkAndResponse(callbackFun, result);
            }).error(function(data, status, headers, config) {
		      	callbackFun({'status': 0});
		    });
		}




	});//service
});