SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.QueryIndexDetail = Backbone.View.extend({
	template: JST['backbone/templates/query_results/index_detail'],

	initialize: function() {
		this.collection = new SrgUtilities.Collections.QueryIndexDetail();
		this.collection.fetch({data:{id: this.options.id}});
		this.collection.on('reset', this.render, this);
	},
	
	render: function() {
		this.$el.html(this.template({results: this.collection}));
		return this;
	}
});