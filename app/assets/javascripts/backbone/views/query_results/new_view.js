SrgUtilities.Views.QueryResults = SrgUtilities.Views.QueryResults || {};

SrgUtilities.Views.QueryResults.QueryNew = Backbone.View.extend({
  template: JST['backbone/templates/query_results/new'],

  events: {
  	'submit #new-query': 'submitQuery'
  },

  submitQuery: function(e) {
  	e.preventDefault();
  	
  	this.collection = new SrgUtilities.Collections.QueryResults();
	this.collection.fetch();
  	var view = new SrgUtilities.Views.QueryResults.ResultsTable({ collection: this.collection });
  	$('body').append(view.render().el);
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }

});