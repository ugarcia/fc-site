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
            lastContent = JSON.parse(sessionStorage.getItem("lastVisitedSiteContent"))
            if lastContent == null
                setTimeout(
                    () -> 
                        $('#home').click()
                    , 1000
                )
        SiteModel.bind "ajaxError", (record, xhr, settings, error) =>
            @log error
        SiteModel.fetch()
        lastContent = JSON.parse(sessionStorage.getItem("lastVisitedSiteContent"))
        if lastContent != null
            view = new SiteView  siteModel: lastContent
            @content.html view.render().el

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
              sessionStorage.setItem("lastVisitedSiteContent", JSON.stringify(item));
        @content.html view.render().el

    addContent: ->
        cm = SiteModel.create name: "mycontent"
        #cm.save()

$ ->
    new SiteApp el: $('body')
