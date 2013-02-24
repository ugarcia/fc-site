// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.SiteModel = (function(_super) {

    __extends(SiteModel, _super);

    function SiteModel() {
      return SiteModel.__super__.constructor.apply(this, arguments);
    }

    SiteModel.configure("SiteModel", "name", "content");

    SiteModel.extend(Spine.Model.Ajax);

    SiteModel.url = "/Site/json/sites.json";

    return SiteModel;

  })(Spine.Model);

}).call(this);