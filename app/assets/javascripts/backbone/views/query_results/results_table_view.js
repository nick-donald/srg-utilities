SrgUtilities.Views.QueryResults = SrgUtilities.Views.QueryResults || {};

SrgUtilities.Views.QueryResults.ResultsTable = Backbone.View.extend({
	template: JST['backbone/templates/query_results/results_table'],

	events: {
		'click #get-map': 'getMap',
		'click .remove': 'removeElement'
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
		console.log(this.collection.models);
		return this;
	},

	getMap: function() {
		
	},

	removeElement: function(e) {
		e.preventDefault();
		var num = $(e.target).attr('data-entry');
		this.collection.remove(this.collection.at(num));
		this.collection.save();
		console.log('Num: ' + num);
		console.log(this.collection);
	}

});