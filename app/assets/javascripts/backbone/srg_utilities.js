window.SrgUtilities = {
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
  init: function() {
  	new SrgUtilities.Routers.QueryResults();
  	Backbone.history.start({pushState: true});
  }
}


$(function() {
	SrgUtilities.init();
});