SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.ResultsTable = Backbone.View.extend({
	template: JST['backbone/templates/query_results/results_table'],

	events: {
		'click #get-map': 'getMap',
		'click .remove': 'removeElement',
		'click #get-excel': 'getExcel'
	},

	triggers: {
		'remove': 'alert "hello"'
	},

	initialize: function() {
		this.collection.on('reset', this.render, this);
		this.collection.on('remove', this.render, this);
	},

	render: function() {
		this.$el.html(this.template({ results: this.collection }));
		return this;
	},

	getMap: function() {
		
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
		
		console.log('Num: ' + num);
		console.log(this.collection);
	}

});