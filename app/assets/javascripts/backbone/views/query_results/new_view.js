SrgUtilities.Views.QueryResults = SrgUtilities.Views.QueryResults || {};

SrgUtilities.Views.QueryResults.QueryNew = Backbone.View.extend({
  template: JST['backbone/templates/query_results/new'],

  events: {
  	'submit #new-query': 'submitQuery'
  },

  submitQuery: function(e) {
  	e.preventDefault();
  	
  	this.collection = new SrgUtilities.Collections.QueryResults();
  	var data = {
  		retailers: $('#stores').val(),
  		city: $('#city').val(),
  		radius: $('#radius').val()
  	};

	  this.collection.fetch({ data: data });
  	var view = new SrgUtilities.Views.QueryResults.ResultsTable({ collection: this.collection });
  	$('#target').html(view.render().el);
    $('h1').text('Query Results');
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }

});