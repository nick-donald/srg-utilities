SrgUtilities.Views.BaseViews = SrgUtilities.Views.BaseViews || {};

SrgUtilities.Views.BaseViews.LoginView = Backbone.View.extend({
	template: JST['backbone/templates/base_views/login'],

	render: function() {
		this.$el.html(this.template());
		return this;
	}
});