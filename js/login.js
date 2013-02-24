function validateLogin()
{
    if (!session.logged) {
        var loginUser = document.getElementById('loginUser').value;
        var loginPassword = document.getElementById('loginPassword').value;
        doLogin( loginUser, loginPassword,  function() { refreshSession(); } );
    }    
    return false;
}

function validateRegister()
{
    var registerUser = document.getElementById('registerUser').value;
    var registerPassword = document.getElementById('registerPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var registerEmail = document.getElementById('registerEmail').value;
    // TODO validate email
    if (registerPassword != confirmPassword) {
        alert("Password and confirmation don't match");
        return false;
    }
    var data = "request=register&user="+registerUser+"&password="+hex_md5(registerPassword)+"&email="+registerEmail;
    doRegister(data, function() { refreshSession(); })

    return false;
}
