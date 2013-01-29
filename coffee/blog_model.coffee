class window.BlogModel extends Spine.Model
    @configure "BlogModel", "title", "content", "date", "likes"
    @extend Spine.Model.Ajax
