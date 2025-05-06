var currentEnvironment = '';
var currentDomainName = '';
var currentCookieName = '';
var timer = 58;
var uz = {};

function GetQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
function GetCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
setInterval(function () {
    if (typeof GetCookie(currentCookieName) === 'undefined') {
        window.location.href = currentDomainName;
    }
}, 2400000)

$(document).ready(function () {

    GetCurrentCookieName();
    SessionTimer();
    GetCurrentEnvironment();
    GetCurrentDomainName();

    $('#logOutUserName').text(uz.Name);
    $('#fullNameSideBar').text(uz.Name);
    $('#fullNameheader').text(uz.Name);
    $('#currentUserName').text(uz.UserName);

    if (uz.IsInitialPassword === 'True') {
        $('#modalChangePassword').modal('show');
        $('#newPassword').focus();
        $('#currentPassword').val(uz.LiveInitialPassword);
        $('#divCurrentPassword').attr('hidden', true);
        $('#btnCancel').attr('hidden', true);
    }

    $('#btnChangePassword').click(function () {
        $('#modalChangePassword').modal('show');
        $('#currentPassword').focus();
        $('#currentPassword').val('');
        $('#newPassword').val('');
        $('#confirmNewPassword').val('');
    });

    $('#btnSessionStayIn').click(function () {
        $('#modalSession').modal('hide');
        setTimeout(function () {
            RenewTokenIfNeeded();
        }, 200)
    });

    $('#btnSessionOut').click(function () {
        SessionAbandon();
        window.location.href = currentDomainName;
    })

    $('#btnOk').click(function () {

        $('#changePasswordErrorMsg').attr('hidden', true);

        if ($('#currentPassword').val() === '') {

            $('#changePasswordErrorMsg').removeAttr('hidden');
            $('#changePasswordErrorMsg').text('Please enter current password.');
            return;
        }

        if ($('#newPassword').val() === '') {

            $('#changePasswordErrorMsg').removeAttr('hidden');
            $('#changePasswordErrorMsg').text('Please enter new password.');
            return;
        }

        if ($('#confirmNewPassword').val() === '') {

            $('#changePasswordErrorMsg').removeAttr('hidden');
            $('#changePasswordErrorMsg').text('Please enter new password.');
            return;
        }

        if ($('#currentPassword').val() !== '') {

            var currentUserPassword = GetCurrentPassword();
            var currentPasswordInputed = GetCurrentPasswordInputed();

            if (currentPasswordInputed !== currentUserPassword) {
                $('#changePasswordErrorMsg').removeAttr('hidden');
                $('#changePasswordErrorMsg').text('Current password is incorrect.');
                return;
            }

        }

        if ($('#newPassword').val() !== '' && $('#confirmNewPassword').val() !== '') {

            if ($('#newPassword').val() !== $('#confirmNewPassword').val()) {
                $('#changePasswordErrorMsg').removeAttr('hidden');
                $('#changePasswordErrorMsg').text('New password must match.');
                return;
            }
        }

        var passwordValidation = 0;

        if ($('#newPassword').val().length >= 8) {
            passwordValidation = passwordValidation + 1;
        }

        var regexLowerCase = /^(?=.*[a-z]).+$/; // Lowercase character pattern

        if (regexLowerCase.test($('#newPassword').val())) {
            passwordValidation = passwordValidation + 1;
        }

        var regexUpperCase = /^(?=.*[A-Z]).+$/; // Uppercase character pattern

        if (regexUpperCase.test($('#newPassword').val())) {
            passwordValidation = passwordValidation + 1;
        }

        var regexSpecialChar = /^(?=.*[0-9_\W]).+$/; // Special character or number pattern

        if (regexSpecialChar.test($('#newPassword').val())) {
            passwordValidation = passwordValidation + 1;
        }

        if (passwordValidation < 4) {
            $('#changePasswordErrorMsg').removeAttr('hidden');
            $('#changePasswordErrorMsg').text('Please consider choosing a stronger password.');
            return;
        }

        ChangePassword();

    });

})
function RenewTokenIfNeeded() {
    debugger;
    var token = GetCookie(currentCookieName);
    var params = JSON.stringify({
        tokenString: token
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/UserService.asmx/RenewTokenIfNeeded',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            debugger;
            location.reload();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function SessionAbandon() {
    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/UserService.asmx/SessionAbandon',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function SessionTimer() {
    if (typeof GetCookie(currentCookieName) === 'undefined') {
        window.location.href = currentDomainName;
    }
    var token = GetCookie(currentCookieName);
    uz = jwt_decode(token);
    /*    uz.RCP_DepartmentId = '1,21,17'*/
    var decodedToken = uz;
    var tokenExpirationDate = new Date(decodedToken.exp * 1000);

    interval = setInterval(function () {

        var now = new Date();
        var timeDiff = tokenExpirationDate.getTime() - now.getTime();
        var secondsRemaining = Math.floor(timeDiff / 1000);

        if (secondsRemaining < 0) {
            SessionAbandon();
            window.location.href = currentDomainName;
        }
        if (secondsRemaining < 60) {
            --timer;
            $('.modal').modal('hide');
            $('#modalSession').modal('show');
            $('#sessionTimer').text(timer);

            if (timer === 0) {
                SessionAbandon();
                window.location.href = currentDomainName;
            }
            return;
        }
    }, 1000);
}


function GetCurrentPassword() {

    var currentUserPassword = '';

    var params1 = JSON.stringify({
        userName: $('#currentUserName').text()
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: currentDomainName + '/Services/UserAccessService.asmx/GetCurrentPassword',
        data: params1,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            currentUserPassword = JSON.parse(response.d);
            currentUserPassword = currentUserPassword[0].Password;
        },
        error: function (error) {
            console.log(error);
        }
    });

    return currentUserPassword;
}

function GetCurrentPasswordInputed() {

    var currentUserPasswordInputed = '';

    var params1 = JSON.stringify({
        password: $('#currentPassword').val()
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: currentDomainName + '/Services/UserAccessService.asmx/GetCurrentPasswordInputed',
        data: params1,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            currentUserPasswordInputed = response.d;
        },
        error: function (error) {
            console.log(error);
        }
    });

    return currentUserPasswordInputed;
}



function ChangePassword() {

    var params = JSON.stringify({
        userName: $('#currentUserName').text(),
        password: $('#confirmNewPassword').val()
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: currentDomainName + '/Services/UserAccessService.asmx/ChangePassword',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $('#modalChangePassword').modal('hide');

            setTimeout(function () {
                ShowNotification('success', 'Password has been successfully changed.');
            }, 200)

        },
        error: function (error) {
            console.log(error);
        }
    });
}


function GetCurrentEnvironment() {

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/EnvironmentService.asmx/GetCurrentEnvironmentClient',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            currentEnvironment = response.d;
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function GetCurrentDomainName() {

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/DomainService.asmx/GetCurrentDomainNameClient',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            currentDomainName = response.d;
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function GetCurrentCookieName() {
    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/DomainService.asmx/GetCurrentCookieNameClient',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            currentCookieName = response.d;
        },
        error: function (error) {
            console.log(error);
        }
    });
}

