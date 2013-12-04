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
		//       image and transitions
		
	},

	home: function() {
		// TODO: refactor home with a sidebar partial view and so that home has all options displayed
		//       instead of 'new query page'
		var view = new SrgUtilities.Views.BaseViews.HomeView();
		$('#app-container').remove();
		$('body').append(view.render().el);
	},

	login: function() {
		// TODO: After above TODO is complete, I can get rid of this conditional
		if (!$('#load-target').length) {
			$('body').append('<div id="app-container"><div id="load-target"></div></div>');
		}
		var view = new SrgUtilities.Views.BaseViews.LoginView();
		$('#load-target').html(view.render().el);
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