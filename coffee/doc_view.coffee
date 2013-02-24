class window.DocView extends Spine.Controller

    TPL = Handlebars.compile $('#doc-template').html()

    constructor: ->
        super

    render: =>
        @replace TPL(@docModel)
        @
