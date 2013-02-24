class DocController extends Spine.Controller

    elements:
        '#docList':                'docList'
    events:
        'click .downloadDoc':         'downloadDoc'

    constructor: ->
        super
        DocModel.bind "ajaxSuccess", (status, xhr) =>
            @log "Ajax success: #{status}"
        DocModel.bind "ajaxError", (record, xhr, settings, error) =>
            @log "Ajax error: #{error}"
        DocModel.bind "refresh", @renderDocs
        DocModel.fetch()

    renderDocs: =>
        @docList.html ''
        DocModel.each (item) => 
            view = new DocView  docModel: item
            @docList.prepend view.render().el

$ ->
    new DocController el: $('body')
