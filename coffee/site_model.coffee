class window.SiteModel extends Spine.Model
    @configure "SiteModel", "name", "content"
    @extend Spine.Model.Ajax

    @url: "/Site/json/sites.json"
