SrgUtilities.Views.BaseViews = SrgUtilities.Views.BaseViews || {};

SrgUtilities.Views.BaseViews.HeaderView = Backbone.View.extend({
	id: 'header-buffer',

	template: JST['backbone/templates/base_views/header'],
	events: {

	},

	initialize: function() {

	},

	render: function() {
		this.$el.html(this.template());
		return this;
	}
});