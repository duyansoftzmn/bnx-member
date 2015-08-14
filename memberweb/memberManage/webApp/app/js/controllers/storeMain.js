define(
	[
      'underscore',
      'jquery',
      'SY_BASE/syUtil',
      'PROD_DIR/util/util',
      'PROD_DIR/controllers/shareMain',
      'PROD_DIR/controllers/store/signCtrl',
      'PROD_DIR/util/httpUtil',
      'PROD_DIR/controllers/store/searchMemberCtrl',
      'PROD_DIR/controllers/store/simuTradeCtrl',
      'PROD_DIR/controllers/store/hChartCtrl',
      'PROD_DIR/controllers/store/benefitCtrl',
      'PROD_DIR/controllers/store/addressDataCtrl'
	 ], function(_, $, SyUtil){

   SyApp.NG.controller('Ng.srAdmin',
      ['$scope', 'MainCtrl', 'SignCtrl', 'HttpUtil','SearchMemberCtrl','SimuTradeCtrl', 'HChartCtrl', 'BenefitCtrl', 'AddressDataCtrl',
      function($scope, MainCtrl, SignCtrl, HttpUtil, SearchMemberCtrl, SimuTradeCtrl, HChartCtrl, BenefitCtrl, AddressDataCtrl) {
        
        MainCtrl.init($scope);
        SearchMemberCtrl.init($scope);
        SimuTradeCtrl.init($scope);
        HChartCtrl.init($scope);
        BenefitCtrl.init($scope);
        AddressDataCtrl.init($scope);
        SignCtrl.init($scope, function(){

            SearchMemberCtrl.eventAfterLogin();
            SimuTradeCtrl.eventAfterLogin();
            BenefitCtrl.eventAfterLogin();
            AddressDataCtrl.eventAfterLogin();

            $scope.searchPlaceholder = function(){
                switch($scope.showingTab){
                  case "createOrder":
                    return "输入客户名称（如：张三）或者手机号码 开始搜索";
                  case "orderList":
                    return "输入客户姓名，或4位以上定单号或者手机号";
                  case "prodList":
                      return "输入名称 或者 条码 开始搜索";
                }
            }

            $scope.listFilter = function(_filterStr, _showingTab){

              var filterStr = _filterStr? _filterStr: $("#search-input").val();
              var showingTab = _showingTab? _showingTab: $scope.showingTab;
             
              if (!filterStr && filterStr != "")
                return;

              $scope.filterStr = filterStr;

              switch(showingTab){
                case "createOrder":
                  searchCustomer(filterStr);
                  break;
                case "orderList":
                  regexOrder(filterStr);
                break;
                case "prodList":
                  ShareProductCtrl.search4ProdFilter();
                break;

              }
            };

          /*
          Search Customer
          */
            $scope.customerFound = null;
            var searchTimeout;
            function searchCustomer(key){
              clearTimeout(searchTimeout);
              if(/^\s*$/.test(key)){
                cancelSearchCustomer();
                $scope.customerFound = null;
                return;
              }

              var type = /^[0-9]+$/.test(key) ? 'mobile' : 'name';
              var params = {};
              params[type] = key;
              searchTimeout = setTimeout(function(){
                HttpUtil.get('/yiren/order/'+ type, params, function(response){

                  if(response.status === 1){
                   $scope.customerFound = response.data;
                  }else{
                   $scope.customerFound = [];
                  }
                },true)
              }, 500);
            }
            function cancelSearchCustomer(){
              switch ($scope.showingTab){
                case 'createOrder':
                break;
                case 'orderList':
                  ShareOrderCtrl.cancelSearch();
                  break;
              }
            }


          $scope.selectCustomer= function(customer){
            var isKeepDropdown = false;
            switch ($scope.showingTab){
              case 'createOrder':
                CreateOrderCtrl.selectCustomer(customer);
                break;
              case 'orderList':
                ShareOrderCtrl.selectCustomer(customer);
                break;
            }

            if(!isKeepDropdown){
              $scope.customerFound = null;
            }
          }

          /*search Prod*/


          $scope.searchProdByBarCode = function(barCode){

            $('.name-found-dropdown').removeClass('open');
            if(!barCode || barCode.length < 5){
              $scope.productFound = null;
            }
            HttpUtil.get('/yiren/product',{barCode: barCode}, function(response){
              if(response.status === 1){
                $scope.productFound = response.data;
              }else{
                $scope.productFound = [];
              }

              $('.barcode-found-dropdown').addClass('open')
            }, true)
          };

          $scope.searchProdByName = function(name){

            $('.barcode-found-dropdown').removeClass('open');
            if(!name){
              $scope.productFound = null;
            }
            HttpUtil.get('/yiren/product',{name: name}, function(response){
              if(response.status === 1){
                $scope.productFound = response.data;
              }else{
                $scope.productFound = [];
              }

              $('.name-found-dropdown').addClass('open')
            }, true)
          };


          /*Search regex*/
          function regexOrder(key){

            clearTimeout(searchTimeout);


            if(/^\s*$/.test(key) || /^[0-9]+$/.test(key) && key.length < 4 ){
              cancelSearchCustomer();
              $scope.customerFound = null;
              return;
            }
            var params = {
              key : key
            };
            searchTimeout = setTimeout(function(){
              HttpUtil.get('/yiren/order/regex', params, function(response){

                if(response.status === 1){
                  $scope.customerFound = response.data;
                }else{
                  $scope.customerFound = [];
                }
              },true)
            }, 500);
          }


        });

    }]);
});