function compare(filename) {

var firstItem = document.getElementById("first").value;
var secondItem = document.getElementById("sec").value;
var firstRest = document.getElementById("firstRest").value;
var secondRest = document.getElementById("secRest").value;

var margin = {top: 20, bottom: 20, left: 60, right: 60};
var width = 1000 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var canvas = d3.select(".canvas")
			 	.append("svg")
			 	.attr("width", width)
			 	.attr("height", height)
			 	.style("padding", "20px")
                .style("padding-left", "40px");

var tooltip = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

var xScale = d3.scaleLinear()
						.range([0, width])
						.domain([0, 6]);

var xAxis = d3.axisBottom()
                      .scale(xScale);

d3.csv(filename, function(data) {
		var allKeys = d3.keys(data[0]);
		console.log(allKeys);
		var keys = allKeys;

		var restaurants = ["Arby's", "Burger King", "Carl's Jr", "Chick-fil-a", "In-N-Out", "Jack in the Box", "KFC", "McDonald's", "Popeye's", "Sonic", "Taco Bell", "Wendy's", "Whataburger"];
		
		var barCalories = {};
		var barCholesterol = {};
		var barCarbs = {};

		for (object in data) {
			if (data[object]["Restaurant"] == firstRest) {
				if(data[object]["Item"] == firstItem){
					console.log(data[object]);
					barCalories[object] = data[object];
					barCarbs[object] = data[object];
					barCholesterol[object] = data[object];
				}
			}
			if (data[object]["Restaurant"] == secondRest) {
				if(data[object]["Item"] == secondItem){
					barCalories[object] = data[object];
					barCarbs[object] = data[object];
					barCholesterol[object] = data[object];
				}
			}
		}

		var maxY = 0;
		var minY = 0;

		maxChol=0;
		maxCarb = 0;
		maxCal = 0;


		for(object in barCholesterol){
			if(barCholesterol[object]["Cholesterol (mg)"] > maxChol) {
				maxChol = barCholesterol[object]["Cholesterol (mg)"];
			}
		}

		for(object in barCarbs){
			if(barCarbs[object]["Carbohydrates (g)"] > maxCarb) {
				maxCarb = barCarbs[object]["Carbohydrates (g)"];
			}
		}

		for(object in barCalories){
			if(barCalories[object]["Calories"] > maxCal) {
				maxCal = barCalories[object]["Calories"];
			}
		}

		if(maxChol>maxCarb){
			if(maxChol>maxCal){
				maxY = maxChol;
			}
			else{
				maxY = maxCal;
			}
		}
		else{
			if(maxCarb>maxCal){
				maxY = maxCarb;
			}
			else{
				maxY = maxCal;
			}
		}

		var array = [];

		for(obj in barCalories){
			if(barCalories[obj]["Calories"] == 0){
				barCalories[obj]["Calories"] = 1;
			}
			array.push({
				key: obj,
				num: barCalories[obj]["Calories"],
				itemName: barCalories[obj]["Item"]
			});
		}

		for(obj in barCarbs){
			if(barCarbs[obj]["Carbohydrates (g)"] == 0){
				barCarbs[obj]["Carbohydrates (g)"] = 1;
			}
			array.push({
				key: obj,
				num: barCarbs[obj]["Carbohydrates (g)"],
				itemName: barCarbs[obj]["Item"]
			});
		}

		for(obj in barCholesterol){
			if(barCholesterol[obj]["Cholesterol (mg)"] == 0){
				barCholesterol[obj]["Cholesterol (mg)"] = 1;
			}
			array.push({
				key: obj,
				num: barCholesterol[obj]["Cholesterol (mg)"],
				itemName: barCholesterol[obj]["Item"]
			});
		}

		console.log(array);

		var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
		//console.log(maxY);

		var yScale = d3.scaleLinear()
						.range([height,0])
						.domain([0,maxY]);

		var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
		//console.log(array);
		canvas.selectAll("rect")
			  .data(array)
			  .enter()
			  .append("rect")
			  .attr("fill", function(d) {
			  	return colorScale(d.key);
			  })
			  .attr("x", function(d) {
			  	//console.log(array.indexOf(d));
			  	return xScale(array.indexOf(d));
			  })
			  .attr("y", function(d) {
			  	//console.log(d.num);
			  	return yScale(d.num);
			  })
			  .attr("height", function(d) {
			  	return d.num;
			  })
			  .attr("width", 50)
			  .on("mouseover", function(d) {
                        var ev = 0;                        
                        if(d!=null){
	                       tooltip.html("<strong style=\"color:rgb(91,121,145)\">" + d.itemName + "</strong>" + "<p style=\"color:black\">" + d.num)  
	                        .style("left", (d3.event.pageX) + "px")     
	                        .style("top", (d3.event.pageY - 28) + "px")
	                        .style("opacity", 1);  
                      }
                    })                  
                .on("mouseout", function(d) {           
                        tooltip.style("opacity", 0);    
                });


		//console.log(maxY);
	});

document.getElementById("wordsId").style.visibility = "visible";

	// canvas.append("g")
 //                  .attr("class", "axis")
 //                  .attr("transform", "translate(0," + height + ")")
 //                  .call(xAxis);
// canvas.append("g")
//                   .attr("class", "axis")
//                   .attr("transform", "translate(0," + height + ")")
//                   .call(xAxis);
}


function remove(){
	d3.select("svg").remove();
	document.getElementById("wordsId").style.visibility = "hidden";
	console.log("remove called");
}