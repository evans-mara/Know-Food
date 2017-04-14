function pieChart(filename) {
var margin = {top: 20, bottom: 20, left: 60, right: 60};
var width = 750 - margin.left - margin.right;
var height = 750 - margin.top - margin.bottom;
var radius = Math.min(width, height) / 2,


var canvas = d3.select(".canvas")
			 	.append("svg")
			 	.attr("width", width)
			 	.attr("height", height);


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

	var modifiedData = [];
	Object.keys(counts).forEach(function(key) {
    modifiedData.push(counts[key]);
});
	console.log(modifiedData);
});
}