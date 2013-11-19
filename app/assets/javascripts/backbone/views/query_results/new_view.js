SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.QueryNew = Backbone.View.extend({
  template: JST['backbone/templates/query_results/new'],

  events: {
  	'submit #new-query': 'submitQuery'
  },

  submitQuery: function(e) {
  	e.preventDefault();
  	
  	this.collection = new SrgUtilities.Collections.Queries();
  	var data = {
  		retailers: $('#stores').val(),
  		city: $('#city').val(),
  		radius: $('#radius').val()
  	};

	  this.collection.fetch({ data: data });
  	var view = new SrgUtilities.Views.Queries.ResultsTable({ collection: this.collection });
  	$('#target').html(view.render().el);
    Backbone.history.navigate("/query-results");
    $('h1').text('Query Results');
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});