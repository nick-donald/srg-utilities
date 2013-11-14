SrgUtilities.Views.QueryResults = SrgUtilities.Views.QueryResults || {};

SrgUtilities.Views.QueryResults.QueryShow = Backbone.View.extend({
  template: JST['backbone/templates/query_results/show'],
  render: function() {
  	this.$el.html(this.template({ results: this.collection.response }));
	return this;
  }
});