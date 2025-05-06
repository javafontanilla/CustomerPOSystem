$('.navbar-toggler').click();
$('#linkChangePassword').click(function () {
    $('#modalChangePassword').modal('show');
})

$('#btnSubmitChangePassword').click(function () {

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

function GetCurrentPassword() {
    var currentUserPassword = '';
    var exeParams = JSON.stringify({
        userName: uz.UserName
    });
    var params = $.extend({}, doAjax_params_default);
    params['url'] = currentDomainName + '/Services/UserAccessService.asmx/GetCurrentPassword';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        currentUserPassword = JSON.parse(data);
        currentUserPassword = currentUserPassword[0].Password;
    }
    DoAjax(params);

    return currentUserPassword;
}

function GetCurrentPasswordInputed() {

    var currentUserPasswordInputed = '';
    var exeParams = JSON.stringify({
        password: $('#currentPassword').val()
    });
    var params = $.extend({}, doAjax_params_default);
    params['url'] = currentDomainName + '/Services/UserAccessService.asmx/GetCurrentPasswordInputed';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        currentUserPasswordInputed = data;
    }
    DoAjax(params);
    return currentUserPasswordInputed;
}

function ChangePassword() {
    var exeParams = JSON.stringify({
        userName: uz.UserName,
        password: $('#confirmNewPassword').val()
    });
    var params = $.extend({}, doAjax_params_default);
    params['url'] = currentDomainName + '/Services/UserAccessService.asmx/ChangePassword';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        $('#modalChangePassword').modal('hide');
        setTimeout(function () {
            ShowNotification('success', 'Password has been successfully changed.');
            localStorage.setItem('IsInitialPassword', 'False');
        }, 200);
    }
    DoAjax(params);
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
    clearInterval(interval);
    sessionStorage.removeItem('TimeOutValue');
    RenewTokenIfNeeded();
});

$('#btnSessionOut').click(function () {
    SessionAbandon();
    window.location.href = currentDomainName;
});

function RenewTokenIfNeeded() {

    var token = GetCookie(currentCookieName);
    var exeParams = JSON.stringify({
        tokenString: token
    });
    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/UserService.asmx/RenewTokenIfNeeded';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        location.reload();
    }
    DoAjax(params);
}