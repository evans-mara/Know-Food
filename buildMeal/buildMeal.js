function buildMeal() {
var allData = [];
		var myMeal = [];

		var statNames = ["Calories", "Calories From Fat", "Total Fat (g)", "Saturated Fat (g)", "Trans Fat (g)", "Cholesterol (mg)", "Sodium (mg)", "Carbohydrates (g)", "Fiber (g)", "Sugars (g)", "Protein (g)"];
		var stats  = [];
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
				delete myMeal[myMeal.indexOf(allData[selectedItem])];
				$("#meal option[value="+selectedItem+"]").remove();
				updateStats();
			}
		});

}
		function updateStats() {

			for (stat in stats) {
				var statSum = 0
				for (item in myMeal) {
					var currentStat = stats[stat].stat;
					//console.log(currentStat + " " + myMeal[item][currentStat]);
					//console.log(myMeal[item].stats[stat].stat);
					statSum += +myMeal[item][currentStat];
				}
				var currentStat = stats[stat].stat
				currentStat =currentStat.replace(/\s+/g, '');
				currentStat = currentStat.replace(/[()]/g, '')
				$("#"+currentStat).text(statSum);
			}
		}