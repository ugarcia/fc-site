class BlogApp extends Spine.Controller

    elements:
        '#blogList':                'blogList'
        '#titleInput':              'titleInput'
        '#blogInput':             'blogInput'
        '#urlImageInput':     'urlImageInput'
        '#fsImageInput':      'fsImageInput'
        '#dummyFrame':      'dummyFrame'
    events:
        'submit #blogForm':       'submitForm'
        'click #addBlog':       'addBlog'
        'click .likeBlog':         'likeBlog'
        'click #addImage':    'insertImages'

    constructor: ->
        super
        @dummyFrame.load @insertImagesFromFiles
        BlogModel.bind "ajaxSuccess", (status, xhr) =>
            @log "Ajax success: #{status}"
        BlogModel.bind "ajaxError", (record, xhr, settings, error) =>
            @log "Ajax error: #{error}"
        BlogModel.bind "refresh", @renderBlogs
        BlogModel.fetch()

    insertImages: ->
        @blogInput.append "<img src='#{img}' />" for img in @urlImageInput.val().split ';'

    insertImagesFromFiles: =>
        @blogInput.append "<img src='#{img}' />" for img in @dummyFrame.contents().find('body').html().split ';'

    submitForm:  (ref) =>
        @fsImageInput.val() != ''

    clearFields: ->
        @titleInput.val ''
        @blogInput.html ''
        @urlImageInput.val ''
        @fsImageInput.val ''

    renderBlogs: =>
        @blogList.html ''
        BlogModel.each (item) => 
            view = new BlogView  blogModel: item
            @blogList.prepend view.render().el

    addBlog: ->
        bm = new BlogModel(
            title: @titleInput.val(), 
            content: @blogInput.html(),
            date: (new Date()).toLocaleString(),
            likes: 0)
        view = new BlogView  blogModel: bm
        @blogList.prepend view.render().el
        bm.save()
        @clearFields()

    likeBlog: (e) ->
        if (!e) 
            e = window.event
        targ = if e.srcElement then e.srcElement else e.target
        if (targ.nodeType == 3)
            targ = targ.parentNode
        blog_id = $(targ).attr('id').split('%')[1];
        bm = BlogModel.find(blog_id)
        bm.likes += 1
        $(targ).next().text "+#{bm.likes}"
        bm.update()

$ ->
    new BlogApp el: $('body')
