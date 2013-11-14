SrgUtilities.Views.QueryResults ||= {}

class SrgUtilities.Views.QueryResults.EditView extends Backbone.View
  template : JST["backbone/templates/query_results/edit"]

  events :
    "submit #edit-query_results" : "update"

  update : (e) ->
    e.preventDefault()
    e.stopPropagation()

    @model.save(null,
      success : (query_results) =>
        @model = query_results
        window.location.hash = "/#{@model.id}"
    )

  render : ->
    $(@el).html(@template(@model.toJSON() ))

    this.$("form").backboneLink(@model)

    return this
