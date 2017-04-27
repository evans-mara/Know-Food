var allData = [];
var myMeal = [];
var statNames = ["Calories", "Calories From Fat", "Total Fat (g)", "Saturated Fat (g)", "Trans Fat (g)", "Cholesterol (mg)", "Sodium (mg)", "Carbohydrates (g)", "Fiber (g)", "Sugars (g)", "Protein (g)"];
var stats  = [];
var suggested = [200, 58.5, 65, 20, 2, 30, 240, 300, 25.01, 25, 50];


function buildMeal() {
		var tempStat = {};
		for (stat in statNames) {
			tempStat[stat] = {
				stat: statNames[stat],
				value: 0
			};
		};

		Object.keys(tempStat).forEach(function(key) {
			stats.push(tempStat[key]);
		});

		d3.csv("foodDataSet.csv", function(data) {
			allData = data;
		});
		updateStats();
		$("#selectedRestaurant").change(function() {
			$("#restaurantCategories").html('');
			$("#restaurantSubcategories").html('');
			$("#restaurantItems").html('');
			var addedCats = {};
			for (obj in allData) {
				if (allData[obj].Restaurant == $("#selectedRestaurant").val()) {
					if (!(allData[obj].Category in addedCats)) {
						$("#restaurantCategories").append('<option>' +allData[obj].Category+' </option>');
						addedCats[allData[obj].Category] = 1;
					}
				}
			}
		});

		$("#restaurantCategories").change(function() {
			$("#restaurantSubcategories").html('');
			$("#restaurantItems").html('');
			var added = {};
			for (obj in allData) {
				if ((allData[obj].Restaurant == $("#selectedRestaurant").val()) && (allData[obj].Category == $("#restaurantCategories").val())) {
					if (!(allData[obj].SubCategory in added)) {
						$("#restaurantSubcategories").append('<option>' +allData[obj].SubCategory+' </option>');
						added[allData[obj].SubCategory] = 1;
					}
				}
			}

		});

		$("#restaurantSubcategories").change(function() {
			$("#restaurantItems").html('');
			var added = {};
			for (obj in allData) {
				if ((allData[obj].Restaurant == $("#selectedRestaurant").val()) && (allData[obj].Category == $("#restaurantCategories").val())
					&& (allData[obj].SubCategory == $("#restaurantSubcategories").val())) {
					if (!(allData[obj].Item in added)) {
						$("#restaurantItems").append('<option value = '+obj+'>' +allData[obj].Item+' </option>');
						added[allData[obj].Item] = 1;
					}
				}
			}

		});

		$( "#addItem" ).click(function() {
			var selectedItem = $("#restaurantItems").val();
			if (selectedItem == null) {
				alert("Please select an item!");
			}
			else {
				$("#meal").append('<option value ='+selectedItem+'>'+allData[selectedItem].Item + ' (' + allData[selectedItem].Restaurant + ') </option>');
				myMeal.push(allData[selectedItem]);
				updateStats();
			}

		});

		$("#removeSelected").click(function() {
			var selectedItem = $("#meal").val();
			if (selectedItem == null) {
				alert("Please select an item!");
			}
			else {
				myMeal.splice(myMeal.indexOf(allData[selectedItem]),1);
				$("#meal option[value="+selectedItem+"]").remove();
				updateStats();
			}
		});
		$("#clearButton").click(function() {
			myMeal = [];
			$("#meal").empty();
			updateStats();
		});



}
		function updateStats() {


		var tooltip = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

		for (stat in stats) {
			var statSum = 0
			stats[stat].value = 0;
			for (item in myMeal) {
				var currentStat = stats[stat].stat;

				stats[stat].value += +myMeal[item][currentStat];
			}
			var currentStat = stats[stat].stat
			currentStat =currentStat.replace(/\s+/g, '');
			currentStat = currentStat.replace(/[()]/g, '')
			$("#"+currentStat).text(stats[stat].value);
			}


		d3.select("svg").remove();


		var margin = {top: 20, bottom: 20, left: 0, right: 60};
		var width = 700 - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom;

		var canvas = d3.select(".canvas")
			 	.append("svg")
			 	.attr("width", width)
			 	.attr("height", height)
			 	.style("padding", "20px")
                .style("padding-left", "40px");

        var xScale = d3.scaleLinear()
						.range([0, width])
						.domain([0, width]);

		var yScale = d3.scaleLinear()
						.range([0,height])
						.domain([0,11]);

		canvas.selectAll("rect")
				.data(stats)
				.enter()
				.append("rect")
				.attr("fill", "blue")
				.attr("y", function(d) { 
					return yScale(stats.indexOf(d));
				})
				.attr("x", function(d) {
					return xScale(0)+85;
				})
				.attr("height", "20")
				.attr("width", function(d) {
					if (d.stat == "Calories" || d.stat == "Calories From Fat" || d.stat ==  "Cholesterol (mg)" || d.stat == "Sodium (mg)") {
						return d.value/10.0;
					}
					else {
						return d.value;
					}
					
				})
				.on("mouseover", function(d) {                    
	                   tooltip.html("<strong style=\"color:red\">" + d.stat + "<br>" + "</strong>" + "<strong style=\"color:rgb(91,121,145)\">" + d.value + "</strong>")  
	                        .style("left", (d3.event.pageX) + "px")     
	                        .style("top", (d3.event.pageY - 28) + "px")
	                        .style("opacity", 1);  
                      
                    })                  
              .on("mouseout", function(d) {           
                        tooltip.style("opacity", 0);    
              });

		
		canvas.selectAll("line")
				.data(suggested)
				.enter()
				.append("line")
				.attr("stroke", "red")
				.attr("y1", function(d) {
					return yScale(suggested.indexOf(d));
				})
				.attr("y2", function(d) {
					return yScale(suggested.indexOf(d))+20;
				})
				.attr("x1", function(d) {
					return xScale(d)+85;
				})
				.attr("x2", function(d) {
					return xScale(d)+85;
				})
				.attr("height", "20")
				.attr("stroke-width", "5")
				.on("mouseover", function(d) {
						var statname = stats[suggested.indexOf(d)].stat
						var val = d;
						if (statname == "Calories" || statname == "Calories From Fat" || statname ==  "Cholesterol (mg)" || statname == "Sodium (mg)") {
							val *= 10;
						} 
						if (statname == "Fiber (g)") {
							val = 25;
						}            
	                   tooltip.html("<strong style=\"color:red\"> Suggested " + statname + " based on 2000 Calorie Diet <br>" + "</strong>" + "<strong style=\"color:rgb(91,121,145)\">" + val + "</strong>")  
	                        .style("left", (d3.event.pageX + 10) + "px")     
	                        .style("top", (d3.event.pageY - 20) + "px")
	                        .style("opacity", 1);  
                      
                    })                  
              .on("mouseout", function(d) {           
                        tooltip.style("opacity", 0);    
              });

         canvas.selectAll("text")
         		.data(stats)
         		.enter()
         		.append("text")
         		.attr("y", function(d) {
         			return yScale(stats.indexOf(d))+15;
         		})
         		.attr("x", "0")
         		.text(function(d) {
         			return d.stat;
         		})
         		.style("font", "10px sans-serif");
		}