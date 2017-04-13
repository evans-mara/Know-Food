function highLow(filename) {

var margin = {top: 20, bottom: 20, left: 60, right: 60};
var width = 1000 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var canvas = d3.select(".canvas")
			 	.append("svg")
			 	.attr("width", width)
			 	.attr("height", height);

d3.csv(filename, function(data) {
		var allKeys = d3.keys(data[0]);
		console.log(allKeys);
		var keys = allKeys;
		console.log(keys);

		//console.log(data);

		var restaurants = ["Arby's", "Burger King", "Carl's Jr", "Chick-fil-a", "In-N-Out", "Jack in the Box", "KFC", "McDonald's", "Popeye's", "Sonic", "Taco Bell", "Wendy's", "Whataburger"];
		
		var barMaxVals = {};
		var barMinVals = {};
		var barMaxName = {};
		var barMinName = {};

		for (var i = 0; i < restaurants.length; i++) {
			barMaxVals[restaurants[i]] = 0;
			barMinVals[restaurants[i]] = 999;
			barMaxName[restaurants[i]] = "";
			barMinName[restaurants[i]] = "";
			
		}

		for (object in data) {
			//console.log(object);
			//console.log(data[object]["Calories"]);
			//console.log(data[object]["Restaurant"]);
			if (barMaxVals[data[object]["Restaurant"]] < data[object]["Calories"]) {
				barMaxVals[data[object]["Restaurant"]] = data[object]["Calories"];
				barMaxName[data[object]["Restaurant"]] = data[object]["Item"];
			}
			if (barMinVals[data[object]["Restaurant"]] > data[object]["Calories"]) {
				barMinVals[data[object]["Restaurant"]] = data[object]["Calories"];
				barMinName[data[object]["Restaurant"]] = data[object]["Item"];
			}
		}

		 console.log(barMaxVals);
		 console.log(barMinVals);
		// console.log(barMaxName);
		// console.log(barMinName);

		var xScale = d3.scaleLinear()
						.range([0, width])
						.domain([0, 26]);

		var maxY = 0;
		var minY = 0;


		for(object in barMaxVals){
			if(barMaxVals[object] > maxY) {
				maxY = barMaxVals[object];
			}
		}

		for(object in barMinVals){
			if(barMinVals[object] < minY) {
				minY = barMinVals[object];
			}
		}

		var array = [];


		for(obj in barMaxVals){
			if (barMinVals != 999) {
				array.push({
					key: obj,
					num: barMaxVals[obj]
				});
				array.push({
					key: obj,
					num: barMinVals[obj]
				});
			}
		}

		var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
		//console.log(maxY);

		var yScale = d3.scaleLinear()
						.range([height,0])
						.domain([0,maxY]);


		var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
		console.log(array);
		canvas.selectAll("rect")
			  .data(array)
			  .enter()
			  .append("rect")
			  .attr("fill", function(d) {
			  	return colorScale(d.key);
			  })
			  .attr("x", function(d) {
			  	console.log(array.indexOf(d));
			  	return xScale(array.indexOf(d));
			  })
			  .attr("y", function(d) {
			  	console.log(d.num);
			  	return yScale(d.num);
			  })
			  .attr("height", function(d) {
			  	return d.num;
			  })
			  .attr("width", 10);




		
	});
}