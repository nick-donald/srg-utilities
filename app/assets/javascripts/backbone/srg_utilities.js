window.SrgUtilities = {
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
  init: function() {
  	new SrgUtilities.Routers.BaseRouter();
  	Backbone.history.start({pushState: true});
  	this.session = new SrgUtilities.Models.Sessions();
  	if (this.session.authenticated()) {

  	} else {
  		Backbone.history.navigate('/login');
  	}
  	
  }
}

function get_cookie(name) {
	var cookies = document.cookie.split(name + '=');
	if (cookies.length == 2) return cookies.pop().split(';').shift();
}


$(function() {
	SrgUtilities.init();
});