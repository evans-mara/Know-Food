function pieChart(filename) {
	var margin = {top: 20, bottom: 20, left: 60, right: 60};
	var width = 500 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	var radius = Math.min(width, height) / 2;
	var categoryCounts = [];
	var pieData = [];
	var currentCategory = $("#categorySelect").val();
	var restaurants = ["Arby's", "Burger King", "Carl's Jr", "Chick-fil-a", "In-N-Out", "Jack in the Box", "KFC", "McDonald's", "Popeye's", "Sonic", "Taco Bell", "Wendy's", "Whataburger"];

var canvas = d3.select(".piecanvas")
			 	.append("svg")
			 	.attr("width", width)
			 	.attr("height", height);

$('svg:nth-child(1)').attr("id", "pc");

var tooltip = d3.select("body").append("div") 
        .attr("class", "pietooltip")       
        .style("opacity", 0);


var g = canvas.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var pie = d3.pie()
	.sort(null)
	.value(function(d) {
		return d.count;
	})

var color = d3.scaleOrdinal(d3.schemeCategory20);


var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

	d3.csv(filename, function(data) {
		var counts = {};
		data.forEach(function(d) {
			var key = d.Restaurant + d.Category;
			if (!counts[key]) {
				counts[key] = {
					Restaurant: d.Restaurant,
					Category: d.Category,
					count: 0
				};
			}
			counts[key].count++;
		});


		Object.keys(counts).forEach(function(key) {
			categoryCounts.push(counts[key]);
		});
		for (obj in categoryCounts) {
			if (categoryCounts[obj].Category == currentCategory) {
				pieData.push(
				{
					Restaurant: categoryCounts[obj].Restaurant,
					count: categoryCounts[obj].count
				});
			}
		}
	
	var arc = g.selectAll(".arc")
    .data(pie(pieData))
    .enter().append("g")
      .attr("class", "arc")
      .on("mouseover", function(d) { 
                tooltip.html(d.data.Restaurant + ": " + d.data.count + " " +currentCategory+ " Items")
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px")
                .style("opacity", .9);  
            })          
            .on("mouseout", function(d) {     
                tooltip.style("opacity", 0);  
            });
  
  	

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { 
      	return color(restaurants.indexOf(d.data.Restaurant));;
      	});

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.data.Restaurant; });

	});

}
