window.addEventListener("load", function() {

	// var addresser_form = document.getElementById("retail-addresser");


	addresser_form = $("#retail-addresser");

	addresser_form.submit(function() {
		addresser();
		return false;
	});

	var display_retailer_info = function(data) {
		console.log(data);
		var responses = data.response;
		var i;

		$("#results-title").html("Displaying results for " + "<span></span>");

		for (i = 0; i < responses.length; i += 1) {
			var chain = data.request_params["Retailers"][i];
			i === responses.length - 1 ?  $("#results-title span").append(chain) : $("#results-title span").append(chain + " | ");
			responses[i].forEach(function(entry) {
				var appender = "<tr><td>" + entry["name"] + "</td><td>" + chain + "</td><td>" + entry["vicinity"] + "</td></tr>";
				$("#results-table tbody").append(appender);
			});
		}
		add_delete_links();
	}

	var add_delete_links = function() {

		

		var $rows = $.makeArray($("#results-table tbody tr"));
		var count = 0;

		$rows.forEach(function(row) {
			$row = $(row);

			var row_top = $row.offset().top;

			var delete_link = document.createElement("a");
			var delete_link_content = document.createTextNode("Remove Entry");
			delete_link.appendChild(delete_link_content);
			delete_link.href = "#";
			delete_link.setAttribute("class", "delete-entry");
			$(delete_link).addClass("entry-" + count);
			delete_link.style.display = "block";
			delete_link.style.marginBottom = "3px";
			// delete_link.style.top = String(row_top) + "px";

			$("#remove-buttons").append(delete_link);
			count += 1;
		});

		$(".delete-entry").click(function() {
			$this = $(this);
			var eq = $this.index();
			
			$("#results-table tbody tr").eq(eq).remove();

			$this.remove();

			return false;
		});

	}

	var get_map = function(data) {
		var city = data.request_params.City;

		var locations = [], i, j, marker;

		$body = $('body');

		
		var map_params = {}
		map_params.zoom = 8;

		var colors = ["red", "blue", "green", "orange", "pink", "yellow", "purple"];
		var latlng = get_geocode(city, function(center) {
			
			map_params.center = center;
			map_params.mapTypeId = google.maps.MapTypeId.ROADMAP;
			// srg_googleMaps.initialize(map_params);
			var map = new google.maps.Map(document.getElementById('map-canvas'),
	      	map_params);
	      	var infoWindow = new google.maps.InfoWindow();

	      	for (i = 0; i < data.response.length; i += 1) {
	      		var stores = data.response[i];
	      		var image = "http://www.google.com/intl/en_us/mapfiles/ms/micons/" + colors[i] + "-dot.png";

	      		for (j = 0; j < stores.length; j += 1) {

					marker = new google.maps.Marker({
						position: new google.maps.LatLng(stores[j].geometry.location.lat, stores[j].geometry.location.lng),
						map: map,
						icon: image
					});

					google.maps.event.addListener(marker, 'click', (function(marker, j) {
						var store_string = stores[j].name + "</br>" + stores[j].vicinity;
						return function() {

							infoWindow.setContent(store_string);
							infoWindow.open(map, marker);
						}
					})(marker, j));
				}	
	      	}

		});	
	}

	function showAlert() {
		alert("clicked");
	}

	var get_geocode = function(city, callback) {
		var geocoder = new google.maps.Geocoder();
		var result = "";
		geocoder.geocode( {'address': city }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				result = results[0].geometry.location;
				callback(result);
			} else {
				result = "Unsuccessful: " + status;
			}
		});
	}

	var get_more_data = function(data) {
		var posting = $.post(
			"/addresserDetails", 
			{ "prevResults": data }
		);

		posting.done(function(data) {
			$("#results-table thead tr").append("<th>Phone Number</th>");
			var trs = $("#results-table tbody tr");
			var i;
			for (i = 0; i < trs.length; i += 1) {
				trs.eq(i).append("<td>" + data[i] + "</td>");
			}
		});
	}

	var addresser = function() {
		var retailers = document.getElementById("addresser-form-retailers").value;
		var city = document.getElementById("addresser-form-city").value;
		var radius = document.getElementById("addresser-form-radius").value;

		$.ajax({
			type: 'GET',
			data: {
				"retailers": retailers,
				"city": city,
				"radius": radius
			},
			dataType: "json",
			url: "/addresser",
			beforeSend: function() {

			},
			success: function(data) {
				var download_link = '<button value="Download as Excel" id="download">Download as Excel</button>';
				var more_details_link = '<button value="More Details" id="more-details">More Details</button>'
				$("body").append(data.Retailers);
				display_retailer_info(data);
				$("body").append(download_link);
				$("body").append(more_details_link);
				get_map(data);
				$("#more-details").click(function(){
					get_more_data(data);
				});
				$("#download").click(function() {

					var data = assemble_data();

					get_file(data);
				});
			}
		});
	}



	var get_file = function(data) {
		$.ajax({
			type: 'POST',
			data: {
				"download_data": data
			},
			url: "/addresser/download",
			beforeSend: function() {

			},
			success: function(data) {
				var file_src = "/download?filepath=" + data.filepath;
				var iframe = '<iframe style="display:none;" src="' + file_src + '"></iframe>';

				$("body").append(iframe);
				// window.open("/download?filepath=" + data.filepath, "_blank");

			}
		});
	}

	var assemble_data = function() {
		var results = [];

		var entries = $("#results-table tbody tr");

		var headers_find = $("#results-table thead tr th");
		var headers = [];

		for (var j = 0; j < headers_find.length; j += 1) {
			headers[j] = headers_find.eq(j).text();
		}

		var entries_a = $.makeArray(entries);

		var count = 0;



		entries_a.forEach(function(entry) {
			results[count] = {}
			$entry = $(entry);
			$row_data = $entry.find("td");

			for (var i = 0; i < $row_data.length; i += 1) {
				results[count][ headers[i] ] = $row_data.eq(i).text();
			}
			count += 1;
		});

		var data = {
			"columns": headers,
			"results": results 
		}

		getStaticMap(data);

		return data;
	}

	var ajax_send_file = function() {
		var data = $("#file-input").val();
		var posting = $.post(
			"/mapper/map",
			{ "file": data }
		)

		posting.done(function() {
			alert("done");
		});
	}

	$("#file-submit").submit(function(e) {
		// e.preventDefault();
		// alert("sending");
		// ajax_send_file();
		
	});

});

var srg_googleMaps = {
	initialize: function(mapOptions) {
	  // var mapOptions = {
	  //   zoom: 8,
	  //   center: new google.maps.LatLng(-34.397, 150.644),
	  //   mapTypeId: google.maps.MapTypeId.ROADMAP
	  // };
	  var map = new google.maps.Map(document.getElementById('map-canvas'),
	      mapOptions);
	}
}

var getStaticMap = function(data) {
	var addrArray = [];
	var chainsStr = $("#results-title span").text();
	var chainsArr = chainsStr.split(" | ");
	var colors = ["red", "blue", "green", "orange", "pink", "yellow", "purple"];
	var count = 0;

	var outputObj = {};

	chainsArr.forEach(function(v, i, a) {
		outputObj[v] = [];
	});


	data.results.forEach(function(v, i, a) {
		var eachAddress = v["Address"].replace(",", "%2C")
									  .replace(/\s/g, "+");
		outputObj[v["Chain"]].push(eachAddress);
	});

	for (entry in outputObj) {
		var markerLabel = chainsArr[count].slice(0,1).toUpperCase();
		addrArray.push("&markers=color:" + colors[count]);
		addrArray.push("label:" + markerLabel);

		outputObj[entry].forEach(function(v, i, a) {
			addrArray.push(v);
		});

		count += 1;
	}
	console.log(outputObj);


	var formattedAddr = addrArray.join("%7C");

	console.log(formattedAddr);
	

	var staticMapSRC = "http://maps.googleapis.com/maps/api/staticmap?&size=640x540" + formattedAddr + "&sensor=false";
	var staticMap = '<img src="' + staticMapSRC + '">';

	$('body').append(staticMap);
}
// google.maps.event.addDomListener(window, 'load', initialize);