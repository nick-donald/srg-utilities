SrgUtilities.Models.Sessions = Backbone.Model.extend({
	defaults: {
		rememberToken: null
	},

	initialize: function() {
		this.load();
	},

	load: function() {
		this.set("rememberToken", get_cookie("remember_token"));
	},

	authenticated: function() {
		return this.get("remember_token") !== undefined
	}
});