define(['nvd3'],function(){
	var Chart = {
		randomColor : function(){
			//16进制方式表示颜色0-F
			var arrHex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
			var strHex = "#";
			var index;
			for(var i = 0; i < 6; i++) {
				//取得0-15之间的随机整数
				index = Math.round(Math.random() * 15);
				strHex += arrHex[index];
			}
			return strHex;
		},
		getChart : function(type, _data){
			var chart, axis;

			switch(type)
			{
				case "Line":
					chart = this.getLineChart();
					axis = {
						x : {
							label : _data.xLabel,
							format : d3.format(',r')
						},
						y : {
							label : _data.yLabel,
							format : d3.format('.f')
						}
					}
					this.setAxis(chart, axis);
					break;
				case "MultiBar": //Stacked/Grouped Multi-Bar
					chart = this.getMultiBarChart();
					axis = {
						x : {
							format : d3.format(',r')
						},
						y : {
							format : d3.format('.f')
						}
					}
					this.setAxis(chart, axis);
					break;
				case "Pie": //Stacked/Grouped Multi-Bar
					chart = this.getPieChart();
					break;
				case "DiscreteBar":
					chart = this.getDiscreteBar();
					break;
				case "MultiBarHorizontal":
					chart = this.getMultiBarHorizontal();
					chart.yAxis.tickFormat(d3.format(',.f'));
					break;
			}

            return chart;

        },
        setAxis : function(chart, axis){

        	if (axis.x.label)
        		chart.xAxis.axisLabel(axis.x.label);     //Chart x-axis settings
  	
            chart.xAxis.tickFormat(axis.x.format);

            if (axis.y.label)
            	 chart.yAxis.axisLabel(axis.y.label);     //Chart y-axis settings
                  
            
            chart.yAxis.tickFormat(axis.y.format);

        },
        getLineChart : function(){
            return nv.models.lineChart()
                            .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                            .transitionDuration(350)  //how fast do you want the lines to transition?
                            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                            .showYAxis(true)        //Show the y-axis
                            .showXAxis(true)        //Show the x-axis
              ;
        },
        getMultiBarChart : function(){
            return nv.models.multiBarChart()  
		      .transitionDuration(350)
		      .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
		      .rotateLabels(0)      //Angle to rotate x-axis labels.
		      .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
		      .groupSpacing(0.1)    //Distance between each group of bars.
		    ;
        },
        getPieChart : function(){
            return nv.models.pieChart()
		          .x(function(d) { return d.label })
			      .y(function(d) { return d.value })
			      .showLabels(true)     //Display pie labels
			      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
			      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
			      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
			      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
			      ;
		},
		getDiscreteBar : function(){

            return nv.models.discreteBarChart()
			      .x(function(d) { return d.label })    //Specify the data accessors.
			      .y(function(d) { return d.value })
			      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
			      .tooltips(false)        //Don't show tooltips
			      .showValues(true)       //...instead, show the bar value right on top of each bar.
			      .transitionDuration(350)
			      ;
		},
		getMultiBarHorizontal : function(){

			return nv.models.multiBarHorizontalChart()
		        .x(function(d) { return d.label })
		        .y(function(d) { return d.value })
		        .margin({top: 30, right: 20, bottom: 50, left: 175})
		        .showValues(true)           //Show bar value next to each bar.
		        .tooltips(true)             //Show tooltips on hover.
		        .transitionDuration(350)
		        .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

		}
	}

	return Chart;

})