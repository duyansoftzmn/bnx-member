define(['SY_BASE/syUtil', 'underscore', 'PROD_DIR/util/httpUtil'], function(SyUtil,_){
		SyUtil.prod = {
			nameBarcodeFilter : function(filterStr, itemFilterParam){
	            var isBarcodeSearch = SyUtil.base.isNumber(filterStr);
	            if (
	                    (isBarcodeSearch && filterStr.length < 6) ||
	                        (!isBarcodeSearch && filterStr.length == 0)

	                    ){

	                        if (itemFilterParam.isFilting){
	                                itemFilterParam.scope[itemFilterParam.listItemName] = itemFilterParam.tmpData;
	                                itemFilterParam.tmpData = [];
	                                itemFilterParam.isFilting = false;
	                        }
	                        return;
	            }

	           
	            var param = (isBarcodeSearch)? {'barCode': filterStr} : {'name': filterStr};

	            itemFilterParam.HttpUtil.get(itemFilterParam.url, param, function(data){
	                if (data.status === 1){
	                    if (!itemFilterParam.isFilting){
	                        itemFilterParam.tmpData = _.clone(itemFilterParam.scope[itemFilterParam.listItemName]);
	                    }

	                    itemFilterParam.isFilting = true;
	                    itemFilterParam.scope[itemFilterParam.listItemName] = data.data;
	                }
	            }, true);

        	},//nameBarcodeFilter
        	stringFilter : function(filterStr, itemFilterParam){
	            if (filterStr.length == 0){

                    if (itemFilterParam.isFilting){
                            itemFilterParam.scope[itemFilterParam.listItemName] = itemFilterParam.tmpData;
                            itemFilterParam.tmpData = [];
                            itemFilterParam.isFilting = false;
                    }
                    return;
	            }
           
	            var param = {'key': filterStr};

	            itemFilterParam.HttpUtil.get(itemFilterParam.url, param, function(data){
	                if (data.status === 1){
	                    if (!itemFilterParam.isFilting){
	                        itemFilterParam.tmpData = _.clone(itemFilterParam.scope[itemFilterParam.listItemName]);
	                    }

	                    itemFilterParam.isFilting = true;
	                    itemFilterParam.scope[itemFilterParam.listItemName] = data.data;
	                }
	            }, true);

        	},//nameBarcodeFilter
        	mobileFilter : function(filterStr, itemFilterParam){
	            if (filterStr.length < 4){
	                if (itemFilterParam.isFilting){
	                    itemFilterParam.scope[itemFilterParam.listItemName] = itemFilterParam.tmpData;
	                    itemFilterParam.tmpData = [];
	                    itemFilterParam.isFilting = false;
	                }
	                return;
	            }

	            itemFilterParam.HttpUtil.get(itemFilterParam.url, {'mobile': filterStr}, function(data){
	 
	                if (data.status === 1){

	                    if (!itemFilterParam.isFilting){
	                        itemFilterParam.tmpData = _.clone(itemFilterParam.scope[itemFilterParam.listItemName]);
	                    }
	                    itemFilterParam.isFilting = true;
	                    itemFilterParam.scope[itemFilterParam.listItemName] = data.data;
	                }
	            }, true);
			}//mobileFilter


		}//prod

});