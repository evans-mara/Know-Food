function pieChart(filename) {
var margin = {top: 20, bottom: 20, left: 60, right: 60};
var width = 1000 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var canvas = d3.select(".canvas")
			 	.append("svg")
			 	.attr("width", width)
			 	.attr("height", height);


d3.csv(filename, function(data) {
	var keys = d3.keys(data[0]);
});
}