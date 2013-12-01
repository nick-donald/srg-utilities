SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.ResultsMap = Backbone.View.extend({
	id: 'map-container',
	template: JST['backbone/templates/query_results/query_map'],

	events: {
		'click .remove': 'alertTest'
	},

	alertTest: function() {
		alert('remove');
	},

	initialize: function() {
		console.log(this.collection);
		var city = this.collection.models[0].get('city');
		var _this = this;
		$.ajax({
			url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + city.replace(/\s/g, '+') + '&sensor=false',
			type: 'GET',
			success: function(data) {
				_this.renderGoogleMap(data, _this);
			}
		});
		// this.collection.on('remove',this.addMapMarkers, this);
	},

	renderGoogleMap: function(data) {
		var marker, mapParams = {
			zoom: 8,
			center: data.results[0].geometry.location,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		this.map = new google.maps.Map(document.getElementById('map-canvas'), mapParams);
		this.addMapMarkers();
	},

	addMapMarkers: function() {
		var icon = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png';
		var _this = this;
		this.mapMarkers = [];

		var infoWindow = new google.maps.InfoWindow();
		// var colors = ["red", "blue", "green", "orange", "pink", "yellow", "purple"];

		for (var i = 0; i < this.collection.models.length; i++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(this.collection.models[i].attributes.geometry.location.lat, 
					this.collection.models[i].attributes.geometry.location.lng),
				map: this.map,
				icon: icon
			});
			this.mapMarkers.push(marker);
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

	removeMarker: function(num) {
		console.log(this.mapMarkers.length);
		console.log(this.mapMarkers[num]);
		this.mapMarkers[num].setMap(null);
		this.mapMarkers.splice(num, 1);
		if (this.mapMarkers.length < 1) {
			$('#map-canvas').remove();
		}
	},

	getAttributes: function() {
		return {zoom: this.map.getZoom(), center: this.map.getCenter()};
	},

	render: function() {
		this.$el.html(this.template())
		return this;
	}

});