define(['SY_BASE/syUtil', 'underscore', 'PROD_DIR/util/httpUtil', 'SY_BASE/bSplugin/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min'], function(SyUtil,_){

    SyApp.NG.service('NtfBaseCtrl', function($cookies, HttpUtil) {
    	var self = this;
	 	self.scope = null;
        self.Param = {};

        self.popAddNotificationDetail = function(noResetTime){
                if (!noResetTime){
                    $("#notifEarliestTime").val('');
                    $("#notifLastTime").val('');
                }

                $("#writeNotification").modal('show');
                $('.notifTime').unbind().datetimepicker({
                  language: 'zh-CN'
                });
        }

        self.setParam = function(showingTab, Param){
             if (showingTab == 'groupNtfList'){
                self.Param.groupNtf = Param;
            }else{
                self.Param.ntf = Param;
            }
        }

        self.getParam = function(){

             if (self.scope.showingTab == 'groupNtfList'){
                return self.Param.groupNtf;
            }else{
                return self.Param.ntf;
            }
        }


        self.init = function(scope){
            if (self.scope != null)
                return;

            self.scope = scope;
            
            self.scope.startNtfListen = function(){
                $('.notifFilterTime').unbind().datetimepicker({
                  language: 'zh-CN'
                });
            }

            self.scope.startNtfFilter = function(){
                var ntfFilterEarliestTime = $("#ntfFilterEarliestTime").val();
                ntfFilterEarliestTime = (new Date(ntfFilterEarliestTime)).getTime()

                if (_.isNaN(ntfFilterEarliestTime)){
                    self.scope.alert("请填写搜索开始时间")
                    return;
                }

                var ntfFilterLastTime = $("#ntfFilterLastTime").val();
                ntfFilterLastTime = (new Date(ntfFilterLastTime)).getTime()

                if (_.isNaN(ntfFilterLastTime)){
                    self.scope.alert("请填写搜索结束时间");
                    return;
                }

                 var _filterParam = {
                    fromTime : ntfFilterEarliestTime,
                    toTime : ntfFilterLastTime
                };

               

                self.getParam().startNtfFilter(_filterParam);
            }

            self.scope.stopNtfFilter = function(){
                self.getParam().stopNtfFilter();
            }


            self.scope.updateNotification = function(notificationTable){
                 var notifEarliestTime = $("#notifEarliestTime").val();
                notifEarliestTime = (new Date(notifEarliestTime)).getTime()

                if (_.isNaN(notifEarliestTime)){
                    self.scope.alert("请填写开始通知时间")
                    return;
                }

                var notifLastTime = $("#notifLastTime").val();
                notifLastTime = (new Date(notifLastTime)).getTime()

                if (_.isNaN(notifLastTime)){
                    self.scope.alert("请填写结束通知时间")
                    return;
                }


                if (!notificationTable.isGroup && notificationTable.dnis.length != 11){
                    self.scope.alert("请填写通知人11位电话号码")
                    return;
                }

                if (notificationTable.isGroup && notificationTable.dnis.length == 0){
                    self.scope.alert("请填选择会员")
                    return;
                }

                if (notificationTable.content.length == 0){
                    self.scope.alert("请填写通知内容")
                    return;
                }

                if (notificationTable.hasHotLine && notificationTable.hotLine.length ==0){
                    self.scope.alert("请填写人工服务号码")
                    return;
                }


                var ntfId = self.getParam().getNtfId(notificationTable);
                var hotLine = (notificationTable.hasHotLine && notificationTable.hotLine.length >0)?notificationTable.hotLine: "";

                var url = self.getParam().URL.base;
                url = (ntfId && ntfId.length > 20)? url+ '/'+ ntfId : url;

                HttpUtil.post(url , {
                    content: notificationTable.content,
                    dnis: notificationTable.dnis,
                    earliestTime: notifEarliestTime,
                    latestTime: notifLastTime,
                    hotLine: hotLine
                }, function(result){
                    if (result.status === 1){
            
                        self.scope.refreshListByTab(self.scope.showingTab);
 
                        notificationTable.earliestTime = notifEarliestTime;
                        notificationTable.latestTime = notifLastTime;

                        $("#writeNotification").modal('hide');
                        self.scope.alert("提交成功！");
                    }else{
                        self.scope.alert("提交失败！");
                    }
                }, true);

            }


             self.scope.popChgNotification = function(ntf){
                self.scope.notificationTable = ntf;

                if (ntf.hotLine && ntf.hotLine.length > 0){
                    self.scope.notificationTable.hasHotLine = true;
                }

                 if (self.scope.showingTab == 'groupNtfList'){
                    self.scope.notificationTable.isGroup = true;
                }else{
                    self.scope.notificationTable.isGroup = false;
                }

                $("#writeNotification").modal('show');

                $('.notifTime').unbind().datetimepicker({
                  language: 'zh-CN'
                });
            }


            self.scope.popAddNotification = function(){
                self.scope.notificationTable = {
                    content: '',
                    earliestTime: '',
                    latestTime: '',
                    hotLine: self.scope.storeInfo.mobile,
                    hasHotLine: false
                }

                if (self.scope.showingTab == 'groupNtfList'){
                    self.scope.notificationTable.dnis = [];
                    self.scope.notificationTable.isGroup = true;
                    self.scope.popMemberSelector();
                }else{
                    self.scope.notificationTable.dnis = '';
                    self.scope.notificationTable.isGroup = false;
                    self.popAddNotificationDetail();
                } 
            }

             self.scope.delNotification = function(notification){
                if (confirm("确认删除？")){
                    var ntfId = self.getParam().getNtfId(notification);
                     HttpUtil.delete(self.getParam().URL.base + '/'+ ntfId, null, function(result){
                         if (result.status == 1){
                            self.scope.refreshListByTab(self.scope.showingTab);
                            self.scope.alert("删除成功！");
                        }     
                        else{
                            self.scope.alert("删除失败！");
                        }

                    }, true);
                }
            }

        }//init

    }); 

});