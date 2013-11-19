SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.Download = Backbone.View.extend({
	template: JST['backbone/templates/query_results/download'],

	render: function() {
		console.log("query_id: " + this.options.query_id);
		this.$el.html(this.template({query_id: this.options.query_id}));
		return this;
	}
});