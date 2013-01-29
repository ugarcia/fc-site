class SiteApp extends Spine.Controller

    elements:
        '#contentDiv':        'content'

    events:
        'click .contentLink':      'changeContent'
        'click .addItem':      'addContent'

    constructor: ->
        super
        SiteModel.bind "ajaxSuccess", (status, xhr) =>
            @log "success loading sites"
        SiteModel.bind "ajaxError", (record, xhr, settings, error) =>
            @log error
        SiteModel.fetch()
        
    changeContent: (e) ->
        if (!e) 
            e = window.event
        targ = if e.srcElement then e.srcElement else e.target
        if (targ.nodeType == 3)
            targ = targ.parentNode

        view = {}
        SiteModel.each (item) =>
            if item.name == $(targ).attr('id')
              view = new SiteView  siteModel: item
        @content.html view.render().el

    addContent: ->
        cm = SiteModel.create name: "mycontent"
        #cm.save()

$ ->
    new SiteApp el: $('body')
