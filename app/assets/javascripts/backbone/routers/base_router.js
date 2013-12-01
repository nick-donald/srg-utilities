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
		// TODO: Add before and after functions to enable loading
		// image and transitions
	},

	home: function() {
		var view = new SrgUtilities.Views.BaseViews.HomeView();
		$('body').append(view.render().el);
	},

	login: function() {
		var view = new SrgUtilities.Views.BaseViews.LoginView();
		$('#app-target').html(view.render().el);
	},

	backbonetest: function() {
		console.log('back');
	},

	newQuery: function() {
		this.minimizeSidebar();
		var view = new SrgUtilities.Views.Queries.QueryNew();
		$('#load-target').html(view.render().el);
	},

	indexQuery: function() {
		var view = new SrgUtilities.Views.Queries.QueryIndex();
		$('#load-target').html(view.render().el);	
	},

	minimizeSidebar: function() {
		$('#sidebar').addClass('sidebar-minimized');
	}

});