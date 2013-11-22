SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.QueryIndexDetail = Backbone.View.extend({
	initialize: function() {
		this.collection = new SrgUtilities.Collections.QueryIndexDetail();
		this.collection.fetch();
		this.collection.on('reset', this.render, this);
	},
	
	render: function() {
		this.$el.html(this.template({results: this.collection}));
		return this;
	}
});