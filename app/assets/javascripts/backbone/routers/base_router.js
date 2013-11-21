SrgUtilities.Routers.BaseRouter = Backbone.Router.extend({
	routes: {
		'': 'home',
		'login': 'login',
		'users': 'usersIndex',
		'backbonetest': 'backbonetest',
		'query/new': 'newQuery',
		'query/previous': 'previousQuery'
	},

	initialize: function() {
	},

	home: function() {
		var view = new SrgUtilities.Views.BaseViews.HomeView();
		$('#app-target').html(view.render().el);
	},

	login: function() {
		var view = new SrgUtilities.Views.BaseViews.LoginView();
		$('#app-target').html(view.render().el);
	},

	backbonetest: function() {
		console.log('back');
	},

	newQuery: function() {
		var view = new SrgUtilities.Views.Queries.QueryNew();
		$('#app-target').html(view.render().el);
	},

	previousQuery: function() {
		var view = new SrgUtilities.Views.Queries.PrevQuery();
		$('#app-target').html(view.render().el);	
	}

});