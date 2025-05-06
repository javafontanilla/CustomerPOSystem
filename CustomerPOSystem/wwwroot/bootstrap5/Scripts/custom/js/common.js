var dateToday = new Date();
var isMobileView = false;
var g_currentStatus = '';
var g_currentFilterDesc = '';
var countForActionList = 0;
$(document).ready(function () {


    GetMenuList();
    DeleteOldFolderTemp();

    if (parseInt(uz.RCP_RoleId) === 0) {
        return;
    }
    $('#diasHome').click(function () {
        window.location.href = currentDomainName + '/DashboardPanel.aspx';
    })

    $('.diasHome').click(function () {
        window.location.href = currentDomainName + '/DashboardPanel.aspx';
    })


    CheckHasUploadedPhoto();


});

var doAjax_params_default = {
    'url': null,
    'requestType': "POST",
    'contentType': 'application/json; charset=utf-8',
    'dataType': 'json',
    'data': {},
    'beforeSendCallbackFunction': null,
    'successCallbackFunction': null,
    'completeCallbackFunction': null,
    'errorCallBackFunction': null,
};

function DoAjax(doAjax_params) {

    var url = doAjax_params['url'];
    var requestType = 'POST'; //doAjax_params['requestType'];
    var contentType = doAjax_params['contentType'];
    var dataType = doAjax_params['dataType'];
    var data = doAjax_params['data'];
    var beforeSendCallbackFunction = doAjax_params['beforeSendCallbackFunction'];
    var successCallbackFunction = doAjax_params['successCallbackFunction'];
    var completeCallbackFunction = doAjax_params['completeCallbackFunction'];
    var errorCallBackFunction = doAjax_params['errorCallBackFunction'];

    $.ajax({
        url: url,
        async: false,
        crossDomain: true,
        type: requestType,
        contentType: contentType,
        dataType: dataType,
        data: data,
        //headers: {'x-api-key' : 'gt'},
        beforeSend: function (jqXHR, settings) {
            if (typeof beforeSendCallbackFunction === "function") {
                beforeSendCallbackFunction();
            }
        },
        success: function (data, textStatus, jqXHR) {
            if (typeof successCallbackFunction === "function") {
                successCallbackFunction(data.d);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(jqXHR);

        },
        complete: function (jqXHR, textStatus) {
            if (typeof completeCallbackFunction === "function") {
                completeCallbackFunction();
            }
        }
    });

}
function CheckHasUploadedPhoto() {


    var photoFileName = '';
    var params = JSON.stringify({
        userId: uz.UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: currentDomainName + '/Services/UserAccessService.asmx/CheckHasUploadedPhoto',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            photoFileName = response.d;
            if (photoFileName !== '') {
                var photoPath = currentDomainName + '/Images/UserPhoto/' + photoFileName + '?random=' + (new Date()).getTime();

                $('#sidebarProfilePic').attr('src', photoPath);
                $('#userProfilePic').attr('src', photoPath);
                $('#menuBarProfilePic').attr('src', photoPath);
            } else {
                var defaultPhotoPath = 'Images/avatar1.png?random=' + (new Date()).getTime();
                $('#sidebarProfilePic').attr('src', defaultPhotoPath);
            }

        },
        error: function (error) {
            console.log(error);
        }
    });

    return photoFileName;

}
function MergeObjectArray(list) {
    var result = [];
    $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function GetQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function LiveDateTime(id) {
    date = new Date;
    year = date.getFullYear();
    month = date.getMonth();
    months = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];
    d = date.getDate();
    day = date.getDay();
    days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    h = date.getHours();
    //if (h < 10) {
    //    h = "0" + h;

    //}
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'

    var ampm = h >= 12 ? 'AM' : 'PM';

    m = date.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    s = date.getSeconds();
    if (s < 10) {
        s = "0" + s;
    }
    //result = '' + days[day] + ' ' + months[month] + ' ' + d + ' ' + year + ' ' + h + ':' + m + ':' + s;
    result = '' + months[month] + ' ' + d + ', ' + year + ' ' + h + ':' + m + ':' + s + ' ' + ampm;
    //document.getElementById(id).innerHTML = result;
    $('#' + id).val(result);
    setTimeout('LiveDateTime("' + id + '");', '1000');
    return true;
}

function GetBudgetMemoList(currentStatus) {

    var str = window.location.pathname;
    var n = str.lastIndexOf('/');
    var currentPath = str.substring(n + 1);


    if (currentPath === 'requestform' || currentPath === 'RequestForm') {
        location.href = 'requestlist.aspx?status=' + currentStatus;
    }

    $('#preloader').fadeIn();

    setTimeout(function () {
        switch (currentStatus) {
            case "draft":
                g_currentStatus = "draft";

                GetDraftList();
                $('#statusHeader').text('');
                $('#statusHeader').append('<i class="mdi mdi-archive"></i><span> Draft</span>');
                break;
            case "forapproval":
                g_currentStatus = "forapproval";

                GetForApprovalList();
                $('#statusHeader').text('');
                $('#statusHeader').append('<i class="mdi mdi-file-export"></i>&nbsp;<span>For Approval</span>');
                break;
            case "ongoing":
                g_currentStatus = "ongoing";

                GetOngoingApprovalList();
                $('#statusHeader').text('');
                $('#statusHeader').append('<i class="mdi mdi-sitemap"></i>&nbsp;<span>On-Going Approval</span>');
                break;
            case "cancelled":
                g_currentStatus = "cancelled";

                GetCancelledList();
                $('#statusHeader').text('');
                $('#statusHeader').append('<i class="mdi mdi-cancel"></i>&nbsp;<span>Cancelled</span>');
                break;
            case "completed":
                g_currentStatus = "completed";

                GetCompletedList();
                $('#statusHeader').text('');
                $('#statusHeader').append('<i class="mdi mdi-bookmark-check"></i>&nbsp;<span>Completed</span>');
                break;
            case "reports":

                g_currentStatus = "reports";
                var deptId = 0;

                var loggedDeptId = uz.BMAS_DepartmentId;

                if (loggedDeptId !== null) {
                    if (loggedDeptId.includes(',')) {
                        deptId = loggedDeptId.substr(0, loggedDeptId.indexOf(','));
                    } else {
                        deptId = loggedDeptId;
                    }
                }

                GetReportList(deptId);

                $('#statusHeader').text('');
                $('#statusHeader').append('<i class="mdi mdi-file-document-box"></i>&nbsp;<span>Reports</span>');
                break;
            default:
                g_currentStatus = "draft";

                GetDraftList();
                $('#statusHeader').text('');
                $('#statusHeader').append('<i class="mdi mdi-archive"></i><span> Draft</span>');
                break;
        }
        $('#btnRefresh').find('i').removeClass('fa-spin');
        $('#preloader').fadeOut();
    }, 200)

}


function GetDepartment() {

    var loggedDeptId = uz.BMAS_DepartmentId;
    loggedDeptId = loggedDeptId.replace('|', ',').replace('|', ',').replace('|', ',').replace('|', ',').replace('|', ',').replace('|', ',');

    var params = JSON.stringify({
        deptId: uz.BMAS_DepartmentId,
        location: uz.OfficeLocation
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetDepartment',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var result = JSON.parse(response.d);

            departmentsWithPositions = result;
            //$("#deptName").text(null);
            //var defValue = new Option('[Select Department]', '0');
            //$("#department").append(defValue);

            for (i = 0; i < result.length; i++) {
                var resultData = new Option(result[i].DepartmentDesc, result[i].DepartmentId);
                $("#deptName").append(resultData);
            }

            if (result.length > 1) {
                $("#deptName").removeAttr('disabled');
                $("#deptName").val('0');
            } else {
                $("#deptName").attr('disabled', true);
                $('#deptName').val(uz.BMAS_DepartmentId);
                $('#deptName').trigger('change');
            }

        },
        error: function (error) {
            console.log(error); alert(error);
        }
    });
}

function DeleteOldFolderTemp() {

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/AttachmentService.asmx/DeleteOldFolderTemp',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function GetUnseenBudgetMemo() {

    var result = [];
    var params = JSON.stringify({
        userId: uz.BMAS_UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetUnseenBudgetMemo',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            result = JSON.parse(response.d);

            //$('#btn' + ForApproval).click(function () {
            //    GetNewRecordForApproval();
            //});
        },
        error: function (error) {
            console.log(error);
        }
    });
    return result;
}
function GetNewRecordForApproval() {

    $('#tblDataTable tbody tr').each(function () {
        var tblTransactionNo = $(this).find('td:eq(1)').text();

        for (var i = 0; i < unseenBudgetMemo.length; i++) {

            if (tblTransactionNo === unseenBudgetMemo[i].BudgetMemoNo) {

                var trRow = $(this);
                trRow.addClass('stylish');

                setTimeout(function () {
                    trRow.removeClass('stylish');
                }, 6000);

            }
        }
    });

    if (unseenBudgetMemo.length > 0) {
        UpdateUnSeenRecordsForApproval(unseenBudgetMemo);
    }
}

function UpdateUnSeenRecordsForApproval(budgetMemoNos) {

    var params = "{request:" + JSON.stringify(budgetMemoNos) + ", handlerId: '" + uz.BMAS_UserId + "'}";

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/UpdateUnSeenRecordsForApproval',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            GetUnseenBudgetMemo();
            $('#divBadge').text('');
            unseenBudgetMemo = [];
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function GoToRequestFormCheck() {

    if (parseInt(uz.BMAS_PositionId) !== 1) {
        ShowNotification('info', 'You dont have an access in this module.');
        return;
    }

    window.location.href = 'RequestForm.aspx';
}


function GetMenuList() {
    var liHtml = '';
    $('#menuList').text(liHtml);

    GetCountForAction();

    var badge = '<div class="badge-pulse pulsate"></div>';
    var badgeDraft = countForActionList.find(c => c.Status === 'Disapproved').TotalCount > 0 ? badge : '';
    var badgeForApproval = countForActionList.find(c => c.Status === 'For Approval').TotalCount > 0 ? badge : '';


    var defDept = uz.RCP_DepartmentId.toString();
    if (defDept.includes(',')) {
        defDept = defDept.substring(0, defDept.indexOf(","));
    }

    liHtml =
        '<li class="nav-item active">' +
    '<a class="nav-link" href="#"  onclick="GetBudgetMemoList(\'' + 'draft' + '\')" >' +
        '<span class="menu-title">Draft</span>' +
        '<i class="mdi mdi-archive menu-icon">' + badgeDraft + '</i>' +
        '</a>' +
        '</li>' +
        '<li class="nav-item">' +
    '<a class="nav-link" href="#"  onclick="GetBudgetMemoList(\'' + 'forapproval' + '\')">' +
        '<span class="menu-title">For Approval</span>' +
        '<i class="mdi mdi-file-export menu-icon">' + badgeForApproval + '</i>' +
        '</a>' +
        '</li>' +
        '<li class="nav-item">' +
    '<a class="nav-link" href="#"  onclick="GetBudgetMemoList(\'' + 'ongoing' + '\')">' +
        '<span class="menu-title">On-Going Approval</span>' +
        '<i class="mdi mdi-sitemap menu-icon"></i>' +
        '</a>' +
        '</li>' +
        '<li class="nav-item">' +
    '<a class="nav-link" href="#"  onclick="GetBudgetMemoList(\'' + 'cancelled' + '\')">' +
        '<span class="menu-title">Cancelled</span>' +
        '<i class="mdi mdi-cancel menu-icon"></i>' +
        '</a>' +
        '</li>' +
        '<li class="nav-item">' +
    '<a class="nav-link" href="#" onclick="GetBudgetMemoList(\'' + 'completed' + '\')">' +
        '<span class="menu-title">Completed</span>' +
        '<i class="mdi mdi-bookmark-check menu-icon"></i>' +
        '</a>' +
        '</li>' +
        '<li class="nav-item" id="reportSidebar">' +
    '<a class="nav-link" href="#" onclick="GetBudgetMemoList(\'' + 'reports' + '\')">' +
        '<span class="menu-title">Reports</span>' +
        '<i class="mdi mdi-file-document-box menu-icon"></i>' +
        '</a>' +
        '</li>';;

    $('#menuList').append(liHtml);

    //alert(g_taftPortal[0].HasReportSideBar);
    if (uz.HasReportSideBar === 'True') {
        $('#reportSidebar').attr('hidden', false);
    } else {
        $('#reportSidebar').attr('hidden', true);
    }
    $('#btnRefresh').find('i').removeClass('fa-spin');
    $(".nav-item a").on("click", function () {
        $(".nav-item").removeClass("active");
        $(this).parent().addClass("active");
    });
}

function ShowNotification(notifType, notifMessage) {

    var title = '';
    var icon = '';
    switch (notifType) {
        case "success":
            title = 'Success!  ';
            icon = 'mdi-check-circle-outline';
            break;
        case "info":
            title = 'Info!  ';
            icon = 'mdi mdi-information-outline';
            break;
        case "danger":
            title = 'Alert!  ';
            icon = 'mdi-close-circle-outline';
            break;
        default:
            break;
    }

    $.notify({
        title: '',
        icon: 'mdi ' + icon + ' ',
        message: notifMessage
    }, {
        type: notifType,
        animate: {
            enter: 'animated fadeIn',
            exit: 'animated fadeOutUp'
        },
        placement: {
            from: "top",
            align: "center"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
    });

}

function GetCountForAction() {

    var params = JSON.stringify({
        userName: uz.UserName
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/UserService.asmx/GetCountForAction',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            countForActionList = JSON.parse(response.d);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function MobileView() {

    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobileView = true;
    }
}


function LiveDateTime(id) {
    date = new Date;
    year = date.getFullYear();
    month = date.getMonth();
    months = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];
    d = date.getDate();
    day = date.getDay();
    days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    m = date.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    s = date.getSeconds();
    if (s < 10) {
        s = "0" + s;
    }
    //result = '' + days[day] + ' ' + months[month] + ' ' + d + ' ' + year + ' ' + h + ':' + m + ':' + s;
    result = '' + months[month] + ' ' + d + ', ' + year + ' ' + hours + ':' + m + ':' + s + ' ' + ampm;
    //document.getElementById(id).innerHTML = result;
    $('#' + id).val(result);
    setTimeout('LiveDateTime("' + id + '");', '1000');
    return true;
}



function PopupCenter(url, title, w, h) {

    // Fixes dual-screen position                         Most browsers      Firefox  
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    //url = GetSystemName() + url;
    window.open(url + '?v=' + (new Date()).getTime(), "", 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow  
    //if (window.focus) {
    //    newWindow.focus();
    //}
}


function InputFocusOutMoney(inputId) {
    $('#' + inputId).focusout(function () {
        var val = $(this).val();
        var decimals = val.split('.')[1];
        var dotOnly = val[val.length - 1];
        if (typeof decimals === 'undefined') {
            val = val + '.00';
        } else {

            if (decimals === '0') {
                val = val.substring(0, val.length - 2);
            }

            if (dotOnly === '.') {
                val = val.substring(0, val.length - 1);
            }

            if (decimals.length === 1) {

                if (decimals !== '0') {
                    val = val.substring(0, val.length - 2);
                    val = val + '.0' + decimals;
                }
            }
        }

        if (parseFloat(val) === 0) {
            //val = '0.00';
            val = '';
        }


        $(this).val(val);

    });
}

function InputKeyPressMoneyFormat(inputId) {
    $('#' + inputId).on('keyup blur change paste input', function (event) {
        $(this).val(function (index, value) {
            if (value != "") {
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var decimalCount;
                value.match(/\./g) === null ? decimalCount = 0 : decimalCount = value.match(/\./g);

                if (decimalCount.length > 1) {
                    value = value.slice(0, -1);
                }

                var components = value.toString().split(".");
                if (components.length === 1)
                    components[0] = value;
                components[0] = components[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                if (components.length === 2) {
                    components[1] = components[1].replace(/\D/g, '').replace(/^\d{3}$/, '');
                }

                if (components.join('.') != '') {
                    //var wordAmount = AmountInWords($(this).val());
                    //$('#' + inputIdToWord).val(wordAmount);
                    return components.join('.');
                }
                else {
                    return '';
                }

            } else {
                //$('#' + inputIdToWord).val('');
            }
        });

    });
}

function FormatDateNoSpace(date) {

    var getDate = new Date(date);
    var day = getDate.getDate();
    var month = getDate.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    var year = getDate.getFullYear();

    return "" + year + "" + month + "" + day;
}

function GetDiffSeconds(dateFrom, dateTo) {

    var t1 = new Date(dateFrom);
    var t2 = new Date(dateTo);
    var dif = t1.getTime() - t2.getTime();

    var Seconds_from_T1_to_T2 = dif / 1000;
    var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);

    return Seconds_Between_Dates;
}
function GetProcessingTime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}


function FormatDate(date) {
    var month_names = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];

    var getDate = new Date(date);
    var day = getDate.getDate();
    var month_index = getDate.getMonth();
    var year = getDate.getFullYear();

    return "" + month_names[month_index] + " " + day + ", " + year;
}

function FormatDateDashYearMonthDay(date) {

    var getDate = new Date(date);
    var day = getDate.getDate();
    var month_index = getDate.getMonth() + 1;
    var year = getDate.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month_index < 10) {
        month_index = '0' + month_index;
    }

    return "" + year + "-" + month_index + "-" + day;
}

function GetNumberFromString(x) {
    var numbers = x.match(/\d+/g).map(Number);
    return numbers[0];
}

function DateFormatNumber(x) {
    var numbers = x.match(/\d+/g).map(Number);
    return numbers[0];
}

function DateFormatToNumber(x) {
    var dateFormatToNumber = '' + '/Date(' + Date.parse(x).toString() + ')/';
    return dateFormatToNumber;
}
function FormatDateMMDDYYYYSlash(date) {

    var getDate = new Date(date);
    var day = getDate.getDate();
    day = day < 10 ? '0' + day : day;
    var month = getDate.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var year = getDate.getFullYear();

    return "" + month + "/" + day + "/" + year;
}

function FormatDateToDateAndTime(date) {

    var month_names = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];

    var getDate = new Date(date);
    var day = getDate.getDate();
    var month_index = getDate.getMonth();
    var year = getDate.getFullYear();

    var hours = getDate.getHours();
    var minutes = getDate.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    return "" + month_names[month_index] + " " + day + ", " + year + " " + strTime;
}

function ConvertToMoneyFormat(money) {
    var val = money;
    var decimals = val.split('.')[1];
    var dotOnly = val[val.length - 1];
    if (typeof decimals === 'undefined') {
        val = val + '.00';
    } else {

        if (decimals === '0') {
            val = val.substring(0, val.length - 2);
        }

        if (dotOnly === '.') {
            val = val.substring(0, val.length - 1);
        }

        if (decimals.length === 1) {

            if (decimals !== '0') {
                val = val.substring(0, val.length - 2);
                val = val + '.0' + decimals;
            }
        }
    }

    if (parseFloat(val) === 0) {
        //val = '0.00';
        val = '';
    }

    var value = val;

    //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var decimalCount;
    value.match(/\./g) === null ? decimalCount = 0 : decimalCount = value.match(/\./g);

    if (decimalCount.length > 1) {
        value = value.slice(0, -1);
    }

    var components = value.toString().split(".");
    if (components.length === 1)
        components[0] = value;
    components[0] = components[0].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (components.length === 2) {
        components[1] = components[1].replace(/\D/g, '').replace(/^\d{3}$/, '');
    }

    return components.join('.');

}

function NumberWithCommas(x) {
    var decimal = '';
    if (x.toString().indexOf('.') === -1) {
        decimal = '.00';
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimal;
}

//function NumberWithCommas(x) {
//    var decimal = '';
//    if (x.toString().indexOf('.') === -1) {
//        decimal = '.00';
//    }

//    var a = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimal;

//    var decimals = a.split('.')[1];

//    if (decimals.length === 1) {

//        if (decimals !== '0') {
//            a = a.substring(0, a.length - 2);
//            a = a + '.0' + decimals;
//        }
//    }

//    return a;
//}

function GetDatePickerDateToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = mm + '/' + dd + '/' + yyyy;
    return today;
}


function CustomizeSelect2(selectId, theData) {
    if (theData.length === 0) {
        $('#' + selectId).val('');
    }
    $('#' + selectId).select2({
        placeholder: '',
        //multiple: false,
        query: function (q) {
            var pageSize,
                results,
                pageSize = 20; // or whatever pagesize
            results = [];
            if (q.term && q.term !== '') {
                results = _.filter(theData, function (e) {
                    return e.text.toUpperCase().indexOf(q.term.toUpperCase()) >= 0;
                });
            } else if (q.term === '') {
                results = theData;
            }
            q.callback({
                results: results.slice((q.page - 1) * pageSize, q.page * pageSize),
                more: results.length >= q.page * pageSize,
            });
        },
    });
}

function DisableCustomSelect2(selectId) {
    $('#s2id_' + selectId).css('cursor', 'not-allowed');
    $('#s2id_' + selectId).find('a').eq(0).css('pointer-events', 'none');
    $('#s2id_' + selectId).find('a').eq(0).css('background', '#eeeeee');
}



function EnableCustomSelect2(selectId) {
    $('#s2id_' + selectId).find('a').eq(0).removeAttr('style');
    $('#s2id_' + selectId).find('a').eq(0).removeAttr('style');
}

function GetDateTimeNow(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    //var ampm = hours >= 12 ? 'pm' : 'am';
    var seconds = date.getSeconds();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + '' + minutes + '' + seconds;

    var getDate = new Date(date);
    var day = getDate.getDate();
    var month = getDate.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var year = getDate.getFullYear();
    var dateNow = "" + year + "" + month + "" + day;

    return dateNow + "" + strTime;
}



function GetSpiels(spielType) {
    $('#divSpielsItem').removeAttr('style');
    $('#divSpielsItem').css("margin-top", "15px");
    $('#divSpielsItem').text('');
    var htmlSpiels = '';
    var tableStyle = 'color: #ffffff; font-family: Calibri; font-size: 16px;';
    var td1Style = "background-color: #3c8dbc; font-weight: 800";

    switch (spielType) {
        case "4":

            htmlSpiels = '<table class="table table-bordered" style="' + tableStyle + '"> ' +
                '<tbody><tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>Hello &lt;name of the buyer with proper salutation&gt;, I am &lt;your name&gt; calling on behalf of Taft Properties.</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>We would like to follow up about your overdues concerning your booking at unit &lt;unit number&gt; of &lt;project name&gt;.</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>In order to avoid any further follow-up calls, we would like to ask for a date when you settle the amount.</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Do</td> ' +
                '<td>Encode the commitment date on the system.</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>Thank you. We will look forward to this date. Have a nice day!</td> ' +
                '</tr> ' +
                '</tbody></table>';
            break
        case "3":

            htmlSpiels = '<table class="table table-bordered" style="' + tableStyle + '"> ' +
                '<tbody><tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>Hello &lt;name of the buyer with proper salutation&gt;, I am &lt;your name&gt; calling on behalf of Taft Properties.</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>We would like to follow up about the remaining required documents that need to be submitted concerning your booking at unit &lt;unit number&gt; of &lt;project name&gt;.</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>In order to avoid any further follow-up calls, we would like to ask for a date when we can have the documents</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Do</td> ' +
                '<td>Encode the commitment date on the system.</td> ' +
                '</tr> ' +
                '<tr class="SpielItem"> ' +
                '<td style="' + td1Style + '">Say</td> ' +
                '<td>Thank you. We will look forward to this date. Have a nice day!</td> ' +
                '</tr> ' +
                '</tbody></table>';

            break;

        case "1":

            htmlSpiels = '<table class="table table-bordered" style="' + tableStyle + '"> ' +
                '<tbody><tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>Hi!, This is &lt;your name&gt; on behalf of Taft Properties may I know your name so that I can properly address you.</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Go To</td>' +
                '<td>Express Information and search the name to see if the person is existing buyer and view all his/her transactions with Taft.</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>May I ask what is your request?</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>May I know on what UNIT you want your request to be applied?</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Go To</td>' +
                '<td>Select the contract of the unit and click NEW SRF to create new request on the said unit.</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Do</td>' +
                '<td>Encode the details of the request.</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>A signed Special Request Form is needed for us to honor your request. Do you want me to send it to your e-mail address and signed it then send it back to us or do you want to sign it personally at one of our offices or via your sales person?</td>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Do</td>' +
                '<td>If the buyer wants it to be e-mailed, then at the list of SRFs, click the printer icon then click the "Send To E-mail" button.</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                "<td>Thank you, we will contact you again if we received the signed SRF or there's some progress on your request.</td >" +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>Thank you, have a nice day!</td>' +
                '</tr>' +
                '</tbody></table>';

            $('#divSpielsItem').css("height", "515px");
            $('#divSpielsItem').css("overflow-y", "scroll");
            $('#divSpielsItem').css("border", "1px solid #ffffff");

            break;
        case "2":

            htmlSpiels = '<table class="table table-bordered" style="' + tableStyle + '"> ' +
                '<tbody><tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>Hello &lt;name of the buyer with proper salutation&gt;, I am &lt;your name&gt; on behalf of Taft Properties, regarding your request on your unit &lt;unit number&gt;, we have some updates on it.</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>&lt;State the current status / progress of the request. (e.g. : your request has been approved.&gt;</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Do</td>' +
                '<td>Ask if there are still some requirements like payments or required documents regarding the request.</td>' +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                "<td>That's all for your request as of this moment, we will contact you again if there's a progress on your request.</td>" +
                '</tr>' +
                '<tr class="SpielItem">' +
                '<td style="' + td1Style + '">Say</td>' +
                '<td>Thank you, have a nice day!</td>' +
                '</tr>' +
                '</tbody></table>';
            break;
        default:
            break;
    }

    $('#divSpielsItem').append(htmlSpiels);
}

function GetCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}