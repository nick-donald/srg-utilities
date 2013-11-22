SrgUtilities.Views.Queries = SrgUtilities.Views.Queries || {};

SrgUtilities.Views.Queries.QueryIndex = Backbone.View.extend({
  template: JST['backbone/templates/query_results/index'],

  events: {
    'click .query-detail': 'showDetail'
  },

  initialize: function() {
    this.collection = new SrgUtilities.Collections.QueryIndex ();
    this.collection.fetch();
    this.collection.on('reset', this.render, this);
  },

  render: function() {
    this.$el.html(this.template({results: this.collection}));
    return this;
  },

  showDetail: function(e) {
    // To do: DRY this up by using the results table view class instead of creating a new class
    e.preventDefault();
    var view = new SrgUtilities.Views.Queries.QueryIndexDetail({id: $(e.target).attr('data-id')});
    $('#app-target').html(view.render().el);
  }

});