SrgUtilities.Models.Sessions = Backbone.Model.extend({
	url: '/authenticate',

	defaults: {
		rememberToken: null
	},

	initialize: function() {
		this.on('login', this.loginRedirect);
		this.load();
	},

	load: function() {
		var _this = this;
		// if (get_cookie("remember_token")) {
		// 	data = {
		// 		remember_token: get_cookie("remember_token")
		// 	};
		// 	var response = this.fetch({
		// 		data: data, 
		// 		success: function() {
		// 			_this.trigger('sync');
		// 		}
		// 	});
		// 	if (response === 'true') {
		// 		this.set("rememberToken", get_cookie("remember_token"));
		// 		console.log("true");
		// 	}
		// } else {
		// 	this.trigger('sync');
		// }
		console.log("autenticating...");
		var response = $.ajax({
			url: '/authenticate',
			type: 'GET',
			data: {
				remember_token: get_cookie("remember_token")
			},
			success: function(data) {
				_this.auth = data;
				console.log("ajax: " + data.authenticated);
				if (data.authenticated) {
					_this.set("rememberToken", get_cookie('remember_token'));
				}
				_this.trigger('sync');
			}
		});
	},

	loginRedirect: function() {
		if (get_cookie("remember_token")) {
			this.set("rememberToken", get_cookie("remember_token"));
		}
	},

	authenticated: function() {
		// var _this = this;
		// // return true;

		// if (this.get("rememberToken")) {
		// 	console.log("autenticating...");
		// 	var response = $.ajax({
		// 		url: '/authenticate',
		// 		type: 'GET',
		// 		data: {
		// 			remember_token: this.get("rememberToken")
		// 		},
		// 		success: function(data) {
		// 			_this.auth = data;
		// 			console.log("ajax: " + _this.auth);
		// 			return true;
		// 		}
		// 	});
		// 	response.done(function() {
		// 		// return _this.auth === 'true';
		// 		// return true;
		// 	});
		// } else {
		// 	return false;
		// }
		// if (get_cookie("remember_token")) {
			return get_cookie("remember_token") === this.get("rememberToken");
		// } else {
		// 	return false;
		// }
	},

	pageAuth: function () {
		if (get_cookie("remember_token")) {
			return get_cookie("remember_token") === this.get("rememberToken");
		}
	}
});