// Common scripts

$('iframe').load(function() {
    $(this).iframeHeight({
        heightOffset: 90,    
      });
});

function reloadStylesheets() {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}
