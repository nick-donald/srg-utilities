// To Do: Add close() to view prototype for memory cleanup
window.SrgUtilities = {
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
  init: function() {
    this.session = new SrgUtilities.Models.Sessions();
  	
    // Create session before rendering anything
    this.session.on('sync', function() {
      var appRouter = new SrgUtilities.Routers.BaseRouter();
      console.log("from start: " + SrgUtilities.session.authenticated());

      Backbone.history.start({pushState: true});
        SrgUtilities.Views.goTo = function(path, view) {
          appRouter.navigate(path, {trigger:true});
          // view.unbind();
          // view.remove();
          // delete view.$el;
          // delete view.el;
          console.log(view);
        };
    });
    
  	
    // Backbone.history.navigate('/login');
  }
}

function get_cookie(name) {
	var cookies = document.cookie.split(name + '=');
	if (cookies.length == 2) return cookies.pop().split(';').shift();
}




$(function() {
	SrgUtilities.init();
});