SrgUtilities.Models.Sessions = Backbone.Model.extend({
	defaults: {
		rememberToken: null
	},

	initialize: function() {
		this.on('login', this.load);
		this.load();
	},

	load: function() {
		this.set("rememberToken", get_cookie("remember_token"));
	},

	authenticated: function() {
		return this.get("rememberToken") !== undefined
	}
});