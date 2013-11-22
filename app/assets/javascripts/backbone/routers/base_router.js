SrgUtilities.Routers.BaseRouter = Backbone.Router.extend({
	routes: {
		'': 'home',
		'login': 'login',
		'users': 'usersIndex',
		'backbonetest': 'backbonetest',
		'query/new': 'newQuery',
		'query/all': 'indexQuery'
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

	indexQuery: function() {
		var view = new SrgUtilities.Views.Queries.QueryIndex();
		$('#app-target').html(view.render().el);	
	}

});