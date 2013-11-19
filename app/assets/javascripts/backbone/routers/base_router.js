SrgUtilities.Routers.BaseRouter = Backbone.Router.extend({
	routes: {
		'': 'home',
		'login': 'login',
		'users': 'usersIndex',
		'backbonetest': 'backbonetest',
		'query/new': 'newQuery'
	},

	initialize: function() {
	},

	home: function() {
		var view = new SrgUtilities.Views.BaseViews.HomeView();
		$('body').html(view.render().el);
	},

	login: function() {
		var view = new SrgUtilities.Views.BaseViews.LoginView();
		$('body').html(view.render().el);
	},

	backbonetest: function() {
		console.log('back');
	},

	newQuery: function() {
		var view = new SrgUtilities.Views.Queries.QueryNew();
		$('body').html(view.render().el);
	}

});