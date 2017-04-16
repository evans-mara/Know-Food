function pieChart(filename) {
var margin = {top: 20, bottom: 20, left: 60, right: 60};
var width = 750 - margin.left - margin.right;
var height = 750 - margin.top - margin.bottom;
var radius = Math.min(width, height) / 2;
var categoryCounts = [];
var pieData = [];
var currentCategory = $("#categorySelect").val();
console.log(currentCategory);

var pie = d3.pie()
			.sort(null)
			.value(function(d) {
				return d.count;
			})


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
//	console.log(categoryCounts);
});

for (obj in categoryCounts) {
	if (obj.Category == currentCategory) {
		pieData.push(
			{
				Restaurant: obj.Restaurant;
				count: obj.count;
			});
	}
}

console.log(pieData);

}