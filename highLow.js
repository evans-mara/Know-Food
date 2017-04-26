function highLow(filename) {


	var category = document.getElementById("categorySelect").value;
	var unit = document.getElementById("statSelect").value;


	var margin = {top: 20, bottom: 20, left: 60, right: 60};
	var width = 800 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	var canvas = d3.select(".highLowcanvas")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.style("padding", "20px")
	.style("padding-left", "40px");
	var axis = d3.select(".hlAxis")
	.append("svg")
	.attr("width", width)
	.attr("height", 50)
	.style("padding", "20px")
	.style("padding-left", "40px");

	var tooltip = d3.select("body").append("div")   
	.attr("class", "hilotooltip")               
	.style("opacity", 0);

	d3.csv(filename, function(data) {
		var allKeys = d3.keys(data[0]);
		var keys = allKeys;

		var restaurants = ["Arby's", "Burger King", "Carl's Jr", "Chick-fil-a", "In-N-Out", "Jack in the Box", "KFC", "McDonald's", "Popeye's", "Sonic", "Taco Bell", "Wendy's", "Whataburger"];
		var rLabels = ["Arby's", "BK", "Carl's Jr", "Chick-fil-a", "In-N-Out", "JitB", "KFC", "McD's", "Popeye's", "Sonic", "Taco Bell", "Wendy's", "Whataburger"];


		var barMaxVals = {};
		var barMinVals = {};
		var barMaxName = {};
		var barMinName = {};

		for (var i = 0; i < restaurants.length; i++) {
			barMaxVals[restaurants[i]] = 0;
			barMinVals[restaurants[i]] = 9999;
			barMaxName[restaurants[i]] = "";
			barMinName[restaurants[i]] = "";	
		}
		var i = 0;
		for (object in data) {
			
			if (data[object]["Category"] == category) {			
				i++;
				if (parseInt(barMaxVals[data[object]["Restaurant"]]) < parseInt(data[object][unit])) {
					barMaxVals[data[object]["Restaurant"]] = data[object][unit];
					barMaxName[data[object]["Restaurant"]] = data[object]["Item"];
				}
				if (parseInt(barMinVals[data[object]["Restaurant"]]) > parseInt(data[object][unit])) {
					barMinVals[data[object]["Restaurant"]] = data[object][unit];
					barMinName[data[object]["Restaurant"]] = data[object]["Item"];
				}
			}
		}

		var xScale = d3.scaleLinear()
		.range([0, width])
		.domain([0, 26]);

		var axisScale = d3.scaleLinear()
		.range([0, width])
		.domain([0, 13]);

		var maxY = 0;
		var minY = 0;


		for(object in barMaxVals){
			if(parseInt(barMaxVals[object]) > parseInt(maxY)) {
				maxY = parseInt(barMaxVals[object]);
			}
		}

		for(object in barMinVals){
			if(barMinVals[object] < minY) {
				minY = parseInt(barMinVals[object]);
			}
		}

		var array = [];


		for(obj in barMaxVals){
			if(parseInt(barMinVals[obj]) == parseInt(9999)){
				barMinVals[obj] = 1.5;
			}
			if(parseInt(barMaxVals[obj]) == parseInt(0)){
				barMaxVals[obj] = 1.5;
			}
			array.push({
				key: obj,
				num: barMaxVals[obj],
				itemName: barMaxName[obj]
			});
			if(parseInt(barMinVals[obj]) == 0){
				barMinVals[obj] = 1.5;
			}
			array.push({
				key: obj,
				num: barMinVals[obj],
				itemName: barMinName[obj]
			});
		}

		var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

		var yScale = d3.scaleLinear()
		.range([height,0])
		.domain([0,maxY]);

		var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
		canvas.selectAll("rect")
		.data(array)
		.enter()
		.append("rect")
		.attr("fill", function(d) {
			return colorScale(d.key);
		})
		.attr("x", function(d) {
			return xScale(array.indexOf(d));
		})
		.attr("y", function(d) {
			return yScale(d.num);
		})
		.attr("height", function(d) {
			return height+d.num;
		})
		.attr("width", 10)
		.on("mouseover", function(d) {
			var ev = 0;                        
			if(d!=null && d.num!=1.5){
				tooltip.html("<strong style=\"color:red\">" + d.key + "<br>" + "</strong>" + "<strong style=\"color:rgb(91,121,145)\">" + d.itemName + "</strong>" + "<p style=\"color:black\">" + d.num)  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px")
				.style("opacity", 1);  
			}
			if(d!=null && d.num==1.5){
				tooltip.html("<strong style=\"color:red\">" + d.key + "<br>" + "</strong>" + "<strong style=\"color:rgb(91,121,145)\">" + d.itemName + "</strong>" + "<p style=\"color:black\">" + "N/A")  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px")
				.style("opacity", 1);  
			}
		})                  
		.on("mouseout", function(d) {           
			tooltip.style("opacity", 0);    
		});

		axis.selectAll("text")
		.data(array)
		.enter()
		.append("text")
		.attr("y", 0)
		.attr("x", function(d) {
			return axisScale(restaurants.indexOf(d.key))-2;
		})
		.text(function(d) {
			return rLabels[restaurants.indexOf(d.key)];
		})
		.style("font", "10px sans-serif");
	});

}
