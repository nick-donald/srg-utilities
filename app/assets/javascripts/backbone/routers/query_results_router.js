SrgUtilities.Routers.QueryResults = Backbone.Router.extend({

	routes: {
		'': 'home',
		'show': 'show',
		'new-query': 'newQuery'
	},

	initialize: function() {
		// this.collection = new SrgUtilities.Collections.QueryResults();
  		// this.collection.fetch();
	},

	index: function() {
		var view = new SrgUtilities.Views.QueryResults.QueryIndex();
		$('body').html(view.render().el);
	},

	show: function() {
		var view = new SrgUtilities.Views.QueryResults.QueryShow();
		$('body').html(view.render().el);
	},

	newQuery: function() {
		var view = new SrgUtilities.Views.QueryResults.QueryNew();
		$('body').html(view.render().el);
	},

	home: function() {
		
	}
});