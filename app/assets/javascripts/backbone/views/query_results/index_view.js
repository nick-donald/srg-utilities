SrgUtilities.Views.QueryResults = SrgUtilities.Views.QueryResults || {};

SrgUtilities.Views.QueryResults.QueryIndex = Backbone.View.extend({
  template: JST['backbone/templates/query_results/index'],

  initialize: function() {
    this.collection.on('reset', this.render, this);
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }

});