SrgUtilities.Routers.BaseRouter = Backbone.Router.extend({
	routes: {
		'': 'home',
		'login': 'login',
		'users': 'usersIndex',

		// Module specific routing
		'query/*subroute': 'invokeQueriesModule'
	},

	initilaize: function() {

	},

	home: function() {
		var view = new SrgUtilities.Views.BaseViews.HomeView();
		$('body').html(view.render().el);
	},

	invokeQueriesModule: function(subroute) {

	},

	login: function() {
		var view = new SrgUtilities.Views.BaseViews.LoginView();
		$('body').html(view.render().el);
	}

});