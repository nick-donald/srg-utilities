SrgUtilities.Views.QueryResults = SrgUtilities.Views.QueryResults || {};

SrgUtilities.Views.QueryResults.ResultsTable = Backbone.View.extend({
	template: JST['backbone/templates/query_results/results_table'],

	initialize: function() {
		this.collection.on('reset', this.render, this)
	},

	render: function() {
		this.$el.html(this.template({ results: this.collection }));
		console.log(this.collection.models);
		return this;
	}
});