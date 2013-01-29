class window.BlogView extends Spine.Controller

    TPL = Handlebars.compile $('#blogContent-template').html()

    constructor: ->
        super

    render: =>
        @replace TPL(@blogModel)
        @
