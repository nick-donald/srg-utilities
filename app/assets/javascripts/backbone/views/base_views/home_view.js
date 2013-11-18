SrgUtilities.Views.BaseViews = SrgUtilities.Views.BaseViews || {};

SrgUtilities.Views.BaseViews.HomeView = Backbone.View.extend({
	template: JST['backbone/templates/base_views/home'],

	initialize: function() {

	},

	render: function() {
		this.$el.html(this.template());
		return this;
	}
});