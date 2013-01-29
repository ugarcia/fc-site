class window.SiteView extends Spine.Controller

    TPL = Handlebars.compile $('#content-template').html()

    constructor: ->
        super

    render: =>
        @replace TPL(@siteModel)
        @
