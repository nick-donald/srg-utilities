SrgUtilities.Views.BaseViews = SrgUtilities.Views.BaseViews || {};

SrgUtilities.Views.BaseViews.LoginView = Backbone.View.extend({
	template: JST['backbone/templates/base_views/login'],

	events: {
		'submit form': 'login',
		'closeview': 'close'
	},

	login: function(e) {
		e.preventDefault();

		var _this = this;
		var data = {
			email: $('#email').val(),
			password: $('#password').val()
		};
		var posting = $.post('/login', data, function() {
			_this.triggerLogin(_this); 
		});
	},

	triggerLogin: function(obj) {
		SrgUtilities.session.trigger('login');
		// previous view is passed to "goTo" so that it can be unbound, not currently working correctly
		SrgUtilities.session.on('sync', function() {
			alert("synced");
		});
		SrgUtilities.session.authenticated() ? SrgUtilities.Views.goTo("", obj) : this.flash();
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	flash: function() {
		alert("no log");
	},

	goHome: function() {
		SrgUtilities.Views.goTo("", {trigger:true});
	},

	close: function() {
		alert('closed');
	}
});