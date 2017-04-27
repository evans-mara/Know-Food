
var firstItem = null;
var secondItem = null;
var firstRest = null;
var secondRest = null;
var allData = [];

var restaurants = ["Arby's", "Burger King", "Carl's Jr", "Chick-fil-a", "In-N-Out", "Jack in the Box", "KFC", "McDonald's", "Popeye's", "Sonic", "Taco Bell", "Wendy's", "Whataburger"];
var statNames = ["Calories", "Calories From Fat", "Total Fat (g)", "Saturated Fat (g)", "Trans Fat (g)", "Cholesterol (mg)", "Sodium (mg)", "Carbohydrates (g)", "Fiber (g)", "Sugars (g)", "Protein (g)"];
var shortStats = ["Cals", "Fat Cals", "Fat", "Sat Fat", "Trans Fat", "Chol", "Sodium", "Carbs", "Fiber", "Sugars", "Protein"];
var stats  = [];

function compare(filename) {

	var tempStat = {};
	for (stat in statNames) {
		tempStat[stat] = {
			stat: statNames[stat],
			val: 0,
		};
	};

	Object.keys(tempStat).forEach(function(key) {
		stats.push(tempStat[key]);
	});

	d3.csv(filename, function(data) {
		allData = data;
	})

	$("#addItem1").click(function(){
		var selectedItem = $("#restaurantItems").val();
		if (selectedItem == null) {
			alert("Please select an item!");
		}
		else {
			firstItem = selectedItem;
			firstRest = allData[selectedItem].Restaurant;
			$("#item1").text(allData[selectedItem].Item + " (" + firstRest + ")");
			if (secondItem != null) {
				update();
			}
		}
	});
	$("#addItem2").click(function(){
		var selectedItem = $("#restaurantItems").val();
		if (selectedItem == null) {
			alert("Please select an item!");
		}
		else {
			secondItem = selectedItem;
			secondRest = allData[selectedItem].Restaurant;
			$("#item2").text(allData[selectedItem].Item + " (" + secondRest + ")");
			if (firstItem != null) {
				update();
			}
		}
	});

	if (firstItem != null && secondItem != null) {
		update();

	}

	function update() {
		d3.select(".compare").remove();
		var margin = {top: 20, bottom: 20, left: 60, right: 60};
		var width = 700 - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom;
		var max = 0;


		for (stat in stats) {
			var currentStat = stats[stat].stat;
			if (stat < 11) {
				var val = +allData[firstItem][currentStat];
				if (currentStat == "Calories" || currentStat == "Calories From Fat" || currentStat ==  "Cholesterol (mg)" || currentStat == "Sodium (mg)") {
					val = val/10.0;
				}
				stats[stat].val = val;
				if (parseInt(stats[stat].val) > parseInt(max)) {
					max = parseInt(stats[stat].val);
				}
			}
			else {
				var val = +allData[secondItem][currentStat];
				if (currentStat == "Calories" || currentStat == "Calories From Fat" || currentStat ==  "Cholesterol (mg)" || currentStat == "Sodium (mg)") {
					val = val/10.0;
				}
				stats[stat].val = val;
				if (parseInt(stats[stat].val) > parseInt(max)) {
					max = parseInt(stats[stat].val);
				}
			}

		}


		var canvas = d3.select(".comparison")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("padding", "20px")
		.style("padding-left", "40px");

		d3.select(".comparison svg").attr("class", "compare");

		var ctooltip = d3.select("body").append("div")   
		.attr("class", "comptooltip")               
		.style("opacity", 0);

		var xScale = d3.scaleLinear()
		.range([0, width])
		.domain([0, 11]);

		var xAxis = d3.axisBottom()
		.scale(xScale);

		var yScale = d3.scaleLinear()
		.range([height,0])
		.domain([0,max + 10]);

		var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

		canvas.selectAll("rect")
		.data(stats)
		.enter()
		.append("rect")
		.attr("fill", function(d) {
			var scale = stats.indexOf(d);
			if (scale > 10) {
				scale -= 11;
			}
			return colorScale(scale);
		})
		.attr("x", function(d) {
			var scale = stats.indexOf(d);
			if (scale > 10) {
				scale -= 10.75;
			}
			return xScale(scale);
		})
		.attr("y", function(d) {
			return yScale(d.val);
		})
		.attr("height", function(d) {
			return height - yScale(d.val);
		})
		.attr("width", "10")
		.on("mouseover", function(d) { 
			var currentStat = d.stat;
			var val = d.val; 
			var key = firstItem;
			if (stats.indexOf(d) > 10) {
				key = secondItem;
			}
			var itemName = allData[key].Item + " (" + allData[key].Restaurant + ")";
			if (currentStat == "Calories" || currentStat == "Calories From Fat" || currentStat ==  "Cholesterol (mg)" || currentStat == "Sodium (mg)") {
					val = val*10.0;
				}                  
			ctooltip.html("<strong>" + itemName + "</strong><br><span style= \"color:purple\">" +d.stat + "</span><br>" + "<strong style=\"color:rgb(91,121,145)\">" + val + "</strong>")  
			.style("left", (d3.event.pageX + 20) + "px")     
			.style("top", (d3.event.pageY - 28) + "px")
			.style("opacity", 1);  

		})                  
		.on("mouseout", function(d) {           
			ctooltip.style("opacity", 0);    
		});

		canvas.selectAll("text")
			.data(statNames)
			.enter()
			.append("text")
			.text(function(d) {
				return shortStats[statNames.indexOf(d)];
			})
			.attr("x", function(d) {
				var scale = statNames.indexOf(d);
			if (scale > 10) {
				scale -= 10.75;
			}
			return xScale(statNames.indexOf(d));
			})
			.attr("y", height + margin.bottom)
			.style("font", "10px sans-serif");
	}

}


