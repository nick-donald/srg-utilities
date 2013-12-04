SrgUtilities.Views.BaseViews = SrgUtilities.Views.BaseViews || {};

SrgUtilities.Views.BaseViews.HomeView = Backbone.View.extend({
	id: 'app-container',
	template: JST['backbone/templates/base_views/home'],

	events: {
		'click a': 'nav'
	},

	initialize: function() {

	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	nav: function(e) {
		e.preventDefault();

		this.goTo($(e.target).attr('href'));
	}
});