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
      Backbone.history.start();
      console.log("from start: " + SrgUtilities.session.authenticated());
      console.log(appRouter);

      Backbone.View.prototype.goTo = function(path) {
        appRouter.navigate(path, {trigger:true});
      }
      if (SrgUtilities.session.authenticated()) {
        appRouter.navigate('', true);
      } else {
        appRouter.navigate('login', true);
      }
    });
  }
}

function get_cookie(name) {
	var cookies = document.cookie.split(name + '=');
	if (cookies.length == 2) return cookies.pop().split(';').shift();
}

// Backbone.Collection.queryify prepares a particular colelction attribute
// for a url. If optional labels is true, it will categorize by the given
// label
Backbone.Collection.prototype.queryify = function(attr, labels, label) {
  if (labels) {
    var colors = ['black', 'brown', 'green', 'purple', 'yellow', 'blue', 'gray', 'orange', 'red', 'white'];
    var uniqLabel = {}, returnStr = '', count = 0;
    this.models.forEach(function(m, i, arr) {
      if (uniqLabel[m.get(label)]) {
        uniqLabel[m.get(label)].push(m);
      } else {
        uniqLabel[m.get(label)] = []
      }
    });
    console.log(uniqLabel);
    for (prop in uniqLabel) {
      count++;
      var str = uniqLabel[prop].reduce(function(a, b, i, arr) {
        return a + b.get(attr).replace(/\s+/g, '+') + '%7C';
      }, '');
      returnStr += '&markers=label:' + prop.slice(0,1).toUpperCase() + '%7Ccolor:' + colors[count] + '%7C' + str;
    }
  }
  return returnStr.slice(0, returnStr.lastIndexOf('%7C'));
  // var str = this.models.reduce(function(a, b, i, arr) {
  //   return a + b.get(attr).replace(/\s+/g, '+') + '%7C';
  // }, '');
  // return str.slice(0, str.lastIndexOf('%7C'));
};




$(function() {
	SrgUtilities.init();
});