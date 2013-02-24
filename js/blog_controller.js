// Generated by CoffeeScript 1.4.0
(function() {
  var BlogApp,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BlogApp = (function(_super) {

    __extends(BlogApp, _super);

    BlogApp.prototype.elements = {
      '#blogList': 'blogList',
      '#titleInput': 'titleInput',
      '#blogInput': 'blogInput',
      '#urlImageInput': 'urlImageInput',
      '#fsImageInput': 'fsImageInput',
      '#dummyFrame': 'dummyFrame'
    };

    BlogApp.prototype.events = {
      'submit #blogForm': 'submitForm',
      'click #addBlog': 'addBlog',
      'click .likeBlog': 'likeBlog',
      'click #addImage': 'insertImages'
    };

    function BlogApp() {
      this.renderBlogs = __bind(this.renderBlogs, this);

      this.submitForm = __bind(this.submitForm, this);

      this.insertImagesFromFiles = __bind(this.insertImagesFromFiles, this);

      var _this = this;
      BlogApp.__super__.constructor.apply(this, arguments);
      this.dummyFrame.load(this.insertImagesFromFiles);
      BlogModel.bind("ajaxSuccess", function(status, xhr) {
        return _this.log("Ajax success: " + status);
      });
      BlogModel.bind("ajaxError", function(record, xhr, settings, error) {
        return _this.log("Ajax error: " + error);
      });
      BlogModel.bind("refresh", this.renderBlogs);
      BlogModel.fetch();
    }

    BlogApp.prototype.insertImages = function() {
      var img, _i, _len, _ref, _results;
      _ref = this.urlImageInput.val().split(';');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        _results.push(this.blogInput.append("<img src='" + img + "' />"));
      }
      return _results;
    };

    BlogApp.prototype.insertImagesFromFiles = function() {
      var img, _i, _len, _ref, _results;
      _ref = this.dummyFrame.contents().find('body').html().split(';');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        _results.push(this.blogInput.append("<img src='" + img + "' />"));
      }
      return _results;
    };

    BlogApp.prototype.submitForm = function(ref) {
      return this.fsImageInput.val() !== '';
    };

    BlogApp.prototype.clearFields = function() {
      this.titleInput.val('');
      this.blogInput.html('');
      this.urlImageInput.val('');
      return this.fsImageInput.val('');
    };

    BlogApp.prototype.renderBlogs = function() {
      var _this = this;
      this.blogList.html('');
      return BlogModel.each(function(item) {
        var view;
        view = new BlogView({
          blogModel: item
        });
        return _this.blogList.prepend(view.render().el);
      });
    };

    BlogApp.prototype.addBlog = function() {
      var bm, view;
      bm = new BlogModel({
        title: this.titleInput.val(),
        content: this.blogInput.html(),
        date: (new Date()).toLocaleString(),
        likes: 0
      });
      view = new BlogView({
        blogModel: bm
      });
      this.blogList.prepend(view.render().el);
      bm.save();
      return this.clearFields();
    };

    BlogApp.prototype.likeBlog = function(e) {
      var blog_id, bm, targ;
      if (!e) {
        e = window.event;
      }
      targ = e.srcElement ? e.srcElement : e.target;
      if (targ.nodeType === 3) {
        targ = targ.parentNode;
      }
      blog_id = $(targ).attr('id').split('%')[1];
      bm = BlogModel.find(blog_id);
      bm.likes += 1;
      $(targ).next().text("+" + bm.likes);
      return bm.update();
    };

    return BlogApp;

  })(Spine.Controller);

  $(function() {
    return new BlogApp({
      el: $('body')
    });
  });

}).call(this);