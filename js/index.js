// Index page scripts

function refreshSession() {
        $('.logged_in_item').css('display', session.logged ? 'block' : 'none');
        $('.logged_out_item').css('display', session.logged ? 'none' : 'block');
        $('#loggedUser').text('Logged as ' + session.user + ' (' + session.status + ')'); 
}

$( function() 
{
    checkSession( function() { refreshSession(); } );
    
    var worker = new Worker('js/clockTask.js');
    worker.onmessage = function(event) { 
        $('#currDateDiv').html('<time datetime="' + event.data + '" pubdate>' + event.data.toLocaleString() + '</time>');
    };
    worker.postMessage('clock');
});
