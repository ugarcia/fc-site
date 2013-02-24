

var session = { logged: false, 
                user: '', 
                status: '' };              

function checkSession(callback) 
{
    $.ajax({
        type: "post", 
        url: Properties.SERVER_REQUESTS_PATH + "authRequests.php", 
        data: "request=checksession", 
        success: function(response) {
            var aResp = response.replace(/^\s+|\s+$/g,"").split("@");
            session = { 
                logged: false, 
                user: '', 
                status: '' 
            };
            if (aResp[0] == 'success') {
                var aParam = aResp[1].split("#");
                session.logged = true;
                session.user = aParam[0];
                session.status = aParam[1];
            }
            callback();
        }
    }); 
}

function doLogin(user, password, callback) 
{
    $.ajax({
        type: "post", 
        url: Properties.SERVER_REQUESTS_PATH + "authRequests.php", 
        data: "request=login&user="+user+"&password="+hex_md5(password), 
        success: function(response) {
            var aResp = response.replace(/^\s+|\s+$/g,"").split("@");
            if (aResp[0] == 'fail') {
                alert(aResp[1]);
            } else if (aResp[0] == 'success') {
                session.logged = true;
                session.user = user;
                session.status = aResp[1];                                                
            }
            console.log('here');
            callback(); 
        }
    });
}

function doLogout(callback) 
{
    $.ajax({
        type: "post", 
        url: Properties.SERVER_REQUESTS_PATH + "authRequests.php", 
        data: "request=logout", 
    });
    session.logged = false;
    callback();
}

function doRegister(data, callback) {
    $.ajax({
        type: "post", 
        url: Properties.SERVER_REQUESTS_PATH + "authRequests.php", 
        data: data, 
        success: function(response) {
            // TODO server response handler
            alert(response.replace(/^\s+|\s+$/g,""));
            callback();
        }
    });
}