SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.ResultsTable = Backbone.View.extend({
	template: JST['backbone/templates/query_results/results_table'],

	events: {
		'click #get-map': 'getMap',
		'click .remove': 'removeElement',
		'click #get-excel': 'getExcel',
		'click #get-static-map': 'getStaticMap'
	},

	triggers: {
		'remove': 'alert "hello"'
	},

	initialize: function() {
		this.collection.on('reset', this.render, this);
		this.collection.on('remove',this.render , this);
	},

	render: function() {
		this.$el.html(this.template({ results: this.collection }));
		return this;
	},

	getMap: function() {
		// var city = this.collection.models[0].get('city');
		// var _this = this;
		// $.ajax({
		// 	url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + city.replace(/\s/g, '+') + '&sensor=false',
		// 	type: 'GET',
		// 	success: function(data) {
		// 		_this.renderGoogleMap(data, _this);
		// 	}
		// });
		$('#get-static-map').prop('disabled', '');
		this.mapView = new SrgUtilities.Views.Queries.ResultsMap({collection: this.collection});
		$('#target').append(this.mapView.render().el);

		// console.log(this.collection);

	},

	renderGoogleMap: function(data, _this) {
		var marker, mapParams = {
			zoom: 8,
			center: data.results[0].geometry.location,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		_this.map = new google.maps.Map(document.getElementById('map-canvas'), mapParams);

		this.addMapMarkers(_this);
		// var icon = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png';

		// var infoWindow = new google.maps.InfoWindow();
		// // var colors = ["red", "blue", "green", "orange", "pink", "yellow", "purple"];

		// for (var i = 0; i < _this.collection.models.length; i++) {
		// 	marker = new google.maps.Marker({
		// 		position: new google.maps.LatLng(_this.collection.models[i].attributes.geometry.location.lat, 
		// 			_this.collection.models[i].attributes.geometry.location.lng),
		// 		map: map,
		// 		icon: icon
		// 	});
		// 	google.maps.event.addListener(marker, 'click', function(marker, j) {
		// 		var windowStr = _this.collection.models[j].get('name') + '<br>' 
		// 		+ _this.collection.models[j].get('vicinity');
		// 		return (function() {
		// 			infoWindow.setContent(windowStr);
		// 			infoWindow.open(map, marker);
		// 		});
		// 	}(marker, i));
		// 	// this.collection.models[i]
		// };
	},

	addMapMarkers: function(_this) {
		var icon = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png';

		var infoWindow = new google.maps.InfoWindow();
		// var colors = ["red", "blue", "green", "orange", "pink", "yellow", "purple"];

		for (var i = 0; i < _this.collection.models.length; i++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(_this.collection.models[i].attributes.geometry.location.lat, 
					_this.collection.models[i].attributes.geometry.location.lng),
				map: _this.map,
				icon: icon
			});
			google.maps.event.addListener(marker, 'click', function(marker, j) {
				var windowStr = _this.collection.models[j].get('name') + '<br>' 
				+ _this.collection.models[j].get('vicinity');
				return (function() {
					infoWindow.setContent(windowStr);
					infoWindow.open(_this.map, marker);
				});
			}(marker, i));
			// this.collection.models[i]
		};
	},

	getExcel: function() {
		var data = {query_id: this.collection.at(0).get("query_id")};
		$.ajax({
			url: '/query/getexcel',
			type: 'GET',
			data: data,
			success: this.downloadExcel
		});
	},

	downloadExcel: function(data) {
		var query_id = data.query_id;
		console.log(query_id);
		var view = new SrgUtilities.Views.Queries.Download({query_id: query_id});
		$('body').append(view.render().el);
	},

	removeElement: function(e) {
		e.preventDefault();
		var num = $(e.target).attr('data-entry');
		Backbone.sync("delete", this.collection.at(num), {
			complete: function() {}
		});
		this.collection.remove(this.collection.at(num));

		if (this.mapView) {
			this.mapView.removeMarker(num);
		}
	},

	getStaticMap: function(e) {
		e.preventDefault();
		var mapStr = 'http://maps.googleapis.com/maps/api/staticmap?size=800x600&zoom=';
		console.log(this.collection);
		var queryStr = this.collection.queryify('vicinity', true, 'store_name');
		console.log(queryStr);
		var attributes = this.mapView.getAttributes();
		console.log(attributes);
		mapStr += attributes.zoom + '&center=' + attributes.center.ob + ',' + 
		attributes.center.pb + queryStr + '&sensor=false';
		console.log(mapStr);
	}

});