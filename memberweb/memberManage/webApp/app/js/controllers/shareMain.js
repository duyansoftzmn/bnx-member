define(['SY_BASE/syUtil'], function(SyUtil){

    SyApp.NG.service('MainCtrl', function() {
    	  var self = this;
	 	    self.scope = null;

        self.init = function(scope, callbackFun){
            self.scope = scope;
            self.scope.PROD_NAME = SyApp.PROD_NAME;

            self.scope.refreshList = function(event, _showingTab){
              var thisBtnJo = $(event.target);
              if (thisBtnJo.is(":disabled"))
                return;

              var showingTab;
              if (_showingTab){
                showingTab = _showingTab;
              }else{
                showingTab = self.scope.showingTab;
                $("#filterStrInput").val('');
              }
              

              thisBtnJo.attr("disabled", "disabled");
              self.scope.refreshListByTab(showingTab);

              setTimeout(function(){
                thisBtnJo.removeAttr("disabled");
              }, 2000);
                
            }

      
            self.scope.navTabClick =  function(showType){
                if (self.scope.showingTab == showType)
                    return;

                self.scope.customerFound = null;

                $("#search-input").val('');
                self.scope.listFilter();
                self.scope.showingTab = showType;

                if (SyUtil.base.isMobile()){
                  $("#srNavBar").collapse('toggle');
                }
            }


            self.scope.alert = function(msg, _title){
                  if (!_title){
                    _title = "系统消息";
                  }

                  self.scope.alertMsgObj = {
                    "title" : _title,
                    "msg" : msg,
                    "is4confirm" : false
                  }
                  $("#alertConfirmPanel").modal("show");
              
            }

            self.scope.popCurrentImg = function(imgUrl){
                self.scope.currentImgUrl = imgUrl;
                $("#showCurrentImage").modal("show");
            }


            self.scope.inputNumOnly = function(event){            
                var thisJo = $(event.target);
                var text = thisJo.val();

                var reg = /^([0-9])*$/;
                var arr = text.match(reg)

                  if(arr &&  arr[0].length >0)
                  {
                      thisJo.val(text); 
                  }else{
                      thisJo.val(''); 
                  }
            }

            self.scope.inputFloatOnly = function(event){            
                var thisJo = $(event.target);
                var text = thisJo.val();

                var reg = /^\d*\.?\d*$/;
                var arr = text.match(reg);

                  if(arr &&  arr[0].length >0)
                  {
                      thisJo.val(text); 
                  }else{
                      thisJo.val(''); 
                  }
            }


        }

        self.eventAfterLogin = function(){
  			
        };

    })
})