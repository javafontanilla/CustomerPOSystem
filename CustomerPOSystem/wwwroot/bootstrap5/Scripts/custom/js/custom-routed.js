var dateToday = new Date();
var g_budgetMemoNo = '';
var g_routeNo = '';
var budgetMemoList = [];

$(document).ready(function () {
    var currentStatus = GetQueryStringValue('status');
    GetBudgetMemoList(currentStatus);
    window.history.pushState({}, document.title, window.location.pathname);

    $('#currentPageLink').text('Dashboard');
    $('#btnSave').attr('disabled', true);
    $('#btnRoute').attr('disabled', true);
    $('#btnCancelBudgetMemo').attr('disabled', true);
});
$('#btnRefresh').click(function () {
    $(this).find('i').addClass('fa-spin');
    GetBudgetMemoList(g_currentStatus);
})


$('#btnNew').click(function () {

    if (parseInt(uz.BMAS_PositionId) !== 1) {
        ShowNotification('info', 'You dont have an access in this module.');
        return;
    }

    window.location.href = 'RequestForm.aspx';
})

function GetDraftList() {

    var params = JSON.stringify({
        userId: uz.BMAS_UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetDraftList',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            budgetMemoList = JSON.parse(response.d);
            GenerateDataTable(budgetMemoList);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function GetForApprovalList() {

    var params = JSON.stringify({
        userId: uz.BMAS_UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetForApprovalList',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            budgetMemoList = JSON.parse(response.d);
            GenerateDataTable(budgetMemoList);
        },
        error: function (error) {
            console.log(error);
        }
    });

}


function GetOngoingApprovalList() {

    var params = JSON.stringify({
        userId: uz.BMAS_UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetOngoingApprovalList',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            budgetMemoList = JSON.parse(response.d);
            GenerateDataTable(budgetMemoList);
        },
        error: function (error) {
            console.log(error);
        }
    });

}


function GetCancelledList() {

    var params = JSON.stringify({
        userId: uz.BMAS_UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetCancelledList',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            budgetMemoList = JSON.parse(response.d);
            GenerateDataTable(budgetMemoList);
        },
        error: function (error) {
            console.log(error);
        }
    });

}


function GetCompletedList() {

    var params = JSON.stringify({
        userId: uz.BMAS_UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetCompletedList',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            budgetMemoList = JSON.parse(response.d);
            GenerateDataTable(budgetMemoList);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function GetDepartmentFiltering() {

    var result = [];

    var params = JSON.stringify({
        hasSuperUserAccess: uz.BMAS_HasSuperUserAccess,
        deptId: uz.BMAS_DepartmentId,
        location: uz.OfficeLocation
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetDepartmentFiltering',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var result = JSON.parse(response.d);

            departmentsWithPositions = result;

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
            console.log(error);
        }
    });

}
function GetReportList(deptId) {

    var params = JSON.stringify({
        hasSuperUserAccess: uz.BMAS_HasSuperUserAccess,
        deptId: deptId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetReportList',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            budgetMemoList = JSON.parse(response.d);
            GenerateDataTable(budgetMemoList);

            $('.filterList').remove();
            if (g_currentStatus === 'reports') {
                var filterHtml = '<div class="row p-b-10 filterList">' +
                    '<div class="col-sm-3 p-0">' +
                    '<label>Department:</label>' +
                    '<select class="form-select" id="deptName"></select>' +
                    '</div>' +
                    + '</div>';
                $(filterHtml).insertAfter($(".header-buttons"));
                GetDepartmentFiltering();
                deptId = deptId === '' ? 0 : deptId;
                $('#deptName').val(deptId);
                $('#deptName').on('change', function () {
                    GetReportList(this.value);
                });
            }
       
        },
        error: function (error) {
            console.log(error);
        }
    });
    $('#preloader').fadeOut();
}

function GetAttachment(budgetMemoNo, routeNo) {

    var result = [];

    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetAttachment',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            result = JSON.parse(response.d);
        },
        error: function (error) {
            console.log(error);
        }
    });


    return result;
}

function PrintBudgetMemo(budgetMemoNo, routeNo) {

    //PopupCenter(currentDomainName + "/BMAS/ViewReport.aspx?Type=BudgetMemo&BudgetMemoNo=" + budgetMemoNo + "&RouteNo=" + routeNo, budgetMemoNo, 700, 600);

    $('#preloader').fadeIn();
    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/ReportService.asmx/PrintBudgetMemo',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            //result = JSON.parse(response.d);

            var urlFile = '';
            var fileType = '.pdf';
            var fileName = '-BudgetMemo_' + budgetMemoNo;

            urlFile = 'BMA_Attachment/' + budgetMemoNo + '_' + routeNo + '/' + fileName + fileType;

            setTimeout(function () {
                $('#preloader').fadeOut();
                PopupCenter(urlFile.trim(), budgetMemoNo, 700, 600);
            }, 300)

            setTimeout(function () {
                DeleteAfterViewing(budgetMemoNo, routeNo);
            }, 5000);
        },
        error: function (error) {
            console.log(error);
        }
    });

}
function DeleteAfterViewing(budgetMemoNo, routeNo) {

    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/ReportService.asmx/DeleteAfterViewing',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            budgetMemoNo;
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function GoToRequestForm(transactionNo, status, companyCode) {
    window.location.href = 'RequestForm.aspx?BudgetMemoNo=' + transactionNo + '&Status=' + status;
}

function GenerateDataTable(budgetMemoList) {

    $('#divDataTableHeader').text(null);
    $('#divDataTableHeader').append('<table id="tblDataTable" class="table"></table>');

    dataItems = [];
    $.each(budgetMemoList, function (i, item) {

        var data = [];
        data.push('<a href="#" class=""> <i class="fa fa-chevron-right" ></i></a>');
        data.push(item.BudgetMemoNo);
        data.push(item.CreatedByDesc);
        data.push(item.RequestedDate === null ? '' : FormatDateToDateAndTime(DateFormatNumber(item.RequestedDate)));
        data.push(item.CategoryDesc);
        data.push(item.SubCategoryDesc);

        var projectCode = item.ProjectCode == null ? '' : item.ProjectCode;
        var projectDesc = item.ProjectDesc === null ? '' : item.ProjectDesc;

        data.push(projectCode + ' ' + projectDesc);
        data.push(item.DepartmentDesc);
        data.push(item.RequestTypeDesc);

        var pesoAmount = NumberWithCommas(item.Amount);

        if (pesoAmount.substr((pesoAmount.indexOf('.') + 1)).length === 1) {
            pesoAmount = pesoAmount + "0";
        }

        data.push(pesoAmount);
        //  data.push(item.StatusDesc);

        var statusHtml = '';
        if (item.Status === "000001") {
            statusHtml = '<label class="badge badge-draft">Draft</label>';
        } else if (item.Status === "000002") {
            statusHtml = '<label class="badge badge-info">For Approval</label>';
        } else if (item.Status === "000004") {
            statusHtml = '<label class="badge badge-danger">Disapproved</label>';
        } else if (item.Status === "000006") {
            statusHtml = '<label class="badge badge-success">Completed</label>';
        } else if (item.Status === "000005") {
            statusHtml = '<label class="badge badge-cancelled">Cancelled</label>';
        }

        data.push(statusHtml);
        data.push(item.Subject);
        data.push(item.Purpose);

        dataItems.push(data);
    });

    var table = $('#tblDataTable').DataTable({
        "autoWidth": true,
        "order": [[1, "desc"]],
        "scrollX": isMobileView,
        data: dataItems,
        dom: 'Bfrtip',
        buttons: [
            //'copy', 'csv', 'excel', 'pdf', 'print'
            'excel'
        ],
        columns: [
            {
                "className": 'child-control text-center', //0
                "orderable": false,
                "defaultContent": ''
            },
            { "title": "Budget Memo No." }, //1
            { "title": "Requested By" }, //2
            { "title": "Date Requested" }, //3
            { "title": "Category" }, //4
            { "title": "Sub-Category" }, //5
            { "title": "Project" }, //6
            { "title": "Department" }, //7
            { "title": "Request Type" }, //8
            { "title": "Amount" }, //9
            { "title": "Status" }, //10
            { "title": "Subject" }, //11
            { "title": "Purpose" } //12
        ],
        "columnDefs": [
            {
                "targets": [11],
                "visible": false
            },
            {
                "targets": [12],
                "visible": false
            }
        ]
    });

    function CloseEveryChildOpen() {
        table.rows().every(function () {
            if (this.child.isShown()) {
                this.child.hide();
                $(this.node()).removeClass('shown');
                $(this.node()).find('td').eq(0).html('<a href="#" class=""> <i class="fa fa-chevron-right" ></i></a>');
            }
        });
    }

    $('#tblDataTable').on('page.dt', function () {
        CloseEveryChildOpen();
    });

    $('input[type="search"]').keyup(function () {
        CloseEveryChildOpen();
    });

    $('#tblDataTable').on('click', 'tbody tr[role=row]', function () {
        //alert('waass');
        var tr = $(this);
        var row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
            tr.find('td').eq(0).html('<a href="#" class=""> <i class="fa fa-chevron-right" ></i></a>');
        } else {
            $('#preloader').fadeIn();
            tr.find('td').eq(0).html('<a href="#" class=""> <i class="fa fa-chevron-down" ></i></a>');

            var budgetMemoNo = $(this).find("td:eq(1)").text().trim();

            g_budgetMemoNo = budgetMemoNo;
            setTimeout(function () {

                var routeNo = budgetMemoList.find(c => c.BudgetMemoNo === budgetMemoNo).RouteNo;
                var status = budgetMemoList.find(c => c.BudgetMemoNo === budgetMemoNo).Status;
                var subject = budgetMemoList.find(c => c.BudgetMemoNo === budgetMemoNo).Subject;
                var purpose = budgetMemoList.find(c => c.BudgetMemoNo === budgetMemoNo).Purpose;
                g_routeNo = routeNo;

                //var efDetails = GetEFDetails(customerId, contractNo);
                row.child(FormatChildItem(budgetMemoNo, subject, purpose, status)).show();
                /*Comment this script if you want to view many to many details*/
                if (table.row('.shown').length) {
                    $('.child-control', table.row('.shown').node()).click();
                }

                tr.addClass('shown');

                GetApproverComments(budgetMemoNo, routeNo);

                var commentCount = $('.comment').length;
                $('#commentCount').text(commentCount);


                $('#approverComment').on('keypress', function (e) {
                    if (e.which == 13) {
                        var commentDesc = $('#approverComment').val().trim();

                        if (commentDesc !== '') {
                            InsertToApproverComments(budgetMemoNo, routeNo, uz.BMAS_UserId, commentDesc);
                            e.preventDefault();
                        }
                    }
                });

                $('#btnSend').click(function ($e) {
                    var commentDesc = $('#approverComment').val().trim();
                    if (commentDesc !== '') {
                        InsertToApproverComments(budgetMemoNo, routeNo, uz.BMAS_UserId, commentDesc);
                    }
                    $e.preventDefault();
                })


                $('#btnStatusUpdate').click(function () {
                    $('#progressUpdateModal').modal('show');
                    $('#routeNo').text(null);
                    $('#divRouteNo').attr('hidden', true);
                    GetStatusUpdateList(budgetMemoNo, routeNo);
                    $('#budgetMemoNo').val(budgetMemoNo);
                    $('#divRouteNo').removeAttr('hidden');
                    GetRouteNoList(parseInt(g_routeNo));
                    $('#routeNo').val(g_routeNo);

                    $('#routeNo').on('change', function () {
                        GetStatusUpdateList(g_budgetMemoNo, this.value);
                        $('#budgetMemoNo').val(g_budgetMemoNo);
                    })
                    GetRouteNoList(parseInt(g_routeNo));
                })

                if (g_currentStatus !== 'forapproval') {
                    $('#btnApprove').attr('disabled', true);
                    $('#btnDisApprove').attr('disabled', true);
                    $('#tblProcessing').css('pointer-events', 'none');
                    $('.commentAction').attr('hidden', true);
                }

                if (g_currentStatus !== 'draft') {
                    $('#btnModify').attr('disabled', true);
                } else {
                    $('#divCommentBox').remove();
                }

                if (g_currentStatus !== 'completed') {
                    $('#btnPrint').attr('disabled', true);
                } else {
                    $('#divCommentBox').remove();
                }

                if (g_currentStatus === 'reports') {

                    if (status === '000006') {
                        $('#btnPrint').attr('disabled', false);
                    }
                }


                var attachmentList = GetAttachment(budgetMemoNo, routeNo);

                var tblAttachments = $('#tblAttachments tbody');
                tblAttachments.text(null);

                for (i = 0; i < attachmentList.length; i++) {
                    var isRequired = '';

                    var str = attachmentList[i].FileName;
                    var n = str.lastIndexOf('.');
                    var fileType = str.substring(n).trim();

                    if (attachmentList[i].IsRequired) {
                        isRequired = '<span style="color:red">*</span>';
                    }

                    var requirementDesc = attachmentList[i].RequirementDesc === null ? attachmentList[i].OtherAttachmentDesc : attachmentList[i].RequirementDesc;

                    tr = $('<tr/>');
                    tr.append("<td >" + requirementDesc + isRequired + "</td>");
                    tr.append('<td ><a href="#" onclick="ViewFile(\'' + budgetMemoNo + '\', \'' + routeNo + '\', \'' + requirementDesc + '\', \'' + fileType + '\')">' + attachmentList[i].FileName + '</a></td>');
                    tblAttachments.append(tr);
                }

                $('a').click(function ($e) {
                    $e.preventDefault();
                });

                switch (g_currentStatus) {
                    case "draft":
                        $('#btnModify').attr('disabled', false);
                        $('#btnApprove').attr('disabled', true);
                        $('#btnDisApprove').attr('disabled', true);
                        $('#btnPrint').attr('disabled', false);
                        break;
                    case "forapproval":
                        $('#btnModify').attr('disabled', true);
                        $('#btnApprove').attr('disabled', false);
                        $('#btnDisApprove').attr('disabled', false);
                        $('#btnPrint').attr('disabled', true);
                        break;
                    case "ongoing":
                        $('#btnModify').attr('disabled', true);
                        $('#btnApprove').attr('disabled', true);
                        $('#btnDisApprove').attr('disabled', true);
                        $('#btnPrint').attr('disabled', false);
                        break;
                    case "cancelled":
                        $('#btnModify').attr('disabled', true);
                        $('#btnApprove').attr('disabled', true);
                        $('#btnDisApprove').attr('disabled', true);
                        $('#btnPrint').attr('disabled', true);
                    case "completed":
                        $('#btnModify').attr('disabled', true);
                        $('#btnApprove').attr('disabled', true);
                        $('#btnDisApprove').attr('disabled', true);
                        $('#btnPrint').attr('disabled', false);
                    case "reports":
                        $('#btnModify').attr('disabled', true);
                        $('#btnApprove').attr('disabled', true);
                        $('#btnDisApprove').attr('disabled', true);
                        $('#btnPrint').attr('disabled', false);
                        if (status !== '000006') {
                            $('#btnPrint').attr('disabled', true);
                        }
                        $('#divCommentbox').attr('hidden', true);
                        break;
                    default:
                        break;
                }

                $('#preloader').fadeOut();
            }, 200);

        }
    });

    // $('.table thead tr th').removeClass('sorting_asc');
    $('#tblDataTable tbody > tr[role=row]').addClass('c-pointer');
    $('#tblDataTable').removeAttr('style');
    $('#tblDataTable_length').text('');
    //$('#tblDataTable_filter').attr('hidden', true);

    if (g_currentStatus !== 'reports') {
        $('.buttons-html5').remove();
    } else {
        $('.buttons-html5').find('span').text('Export to Excel File');
    }

}



function GetApproverComments(budgetMemoNo, routeNo) {


    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/CommentService.asmx/GetApproverComments',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var result = JSON.parse(response.d);

            var hideCommentAction = '';

            for (var i = 0; i < result.length; i++) {


                var liHtmlComment = '<li class="comment" id="commentNo' + result[i].CommentNo + '" >' +
                    '<a class="pull-left" href="#"> <img class="avatar" src="Images/avatar1.png" alt="avatar"> </a>' +
                    '<div class="comment-body">' +
                    '<div class="comment-heading">' +
                    '<h4 class="time" style="padding-right:5px">Route #' + result[i].RouteNo + '</h4>' +
                    '<h4 class="user">' + result[i].CommentedByDesc + '</h4>' +
                    '<h5 class="time">' + FormatDateToDateAndTime(DateFormatNumber(result[i].CommentDate)) + '</h5>' +
                   
                    '<p id="commmentBox' + result[i].CommentNo + '">' + result[i].CommentDesc + '</p>' +
                    '</div>' +
                    '</li>';

                $('.comments-list').append(liHtmlComment);

            }

            if (result.length === 0) {
                $('#nav-comment-tab').html('Comments');
            } else {
                $('#nav-comment-tab').html('<div class="badge-pulse" style="background-color: #13CDC0;font-size: 10px; margin-left: 54px;margin-top: -9px;height: 16px;width: 18px;line-height: 16px;font-weight: 800;text-align: center;">' + $('.comment').length + '</div>Comments');
            }



        },
        error: function (error) {
            console.log(error);
        }
    });


}





function InsertToApproverComments(budgetMemoNo, routeNo, commentedBy, commentDesc) {


    var liHtmlComment = '<li class="comment"> ' +
        '<a class="pull-left" href="#"> <img class="avatar" src="Images/avatar1.png" alt="avatar"> </a>' +
        '<div class="comment-body">' +
        '<div class="comment-heading">' +
        '<h4 class="time" style="padding-right:5px">Route #' + g_routeNo + '</h4>' +
        '<h4 class="user">' + uz.Name + '</h4>' +
        '<h5 class="time">' + FormatDateToDateAndTime(new Date()) + '</h5>' +
        '<p >' + commentDesc + '</p>' +
        '</div>' +
        '</li>';

    if ($('.comments-list li').length === 0) {
        $('.comments-list').append(liHtmlComment);
    } else {
        $('.comments-list li:eq(0)').before(liHtmlComment);
    }

    var commentCount = $('.comment').length;
    $('#nav-comment-tab').html('<div class="badge-pulse" style="background-color: #13CDC0;font-size: 10px; margin-left: 54px;margin-top: -9px;height: 16px;width: 18px;line-height: 16px;font-weight: 800;text-align: center;">' + commentCount + '</div>Comments');

    $('#approverComment').val(null);

    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo,
        commentedBy: commentedBy,
        commentDesc: commentDesc
    });

    $.ajax({
        async: true,
        type: 'POST',
        url: 'Services/CommentService.asmx/InsertToApproverComments',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var returnResult = JSON.parse(response.d);



        },
        error: function (error) {
            console.log(error);
        }
    });

}

function GetRouteNoList(routeNo) {
 
    $("#routeNo").text(null);

    for (i = 0; i < routeNo; i++) {
        var a = i + 1;
        var route = new Option(a, a);
        $("#routeNo").append(route);
    }

    if (routeNo === 0) {
        var route = new Option(0, 0);
        $("#routeNo").append(route);
        $("#routeNo").val(0);
    }
}
function ValidateIsActionTaken(action) {
    $('#remarks').val('');
    ShowConfirmApprovalModal(action);
}

function ShowConfirmApprovalModal(action) {
    $('#divErrorRemarks').attr('hidden', true);
    g_currentAction = action;

    switch (action) {
        case 'Approve':
            $('#confirmationApproval').modal('show');
            $('#confirmationModalMsg').text('Do you want to approve this request?');
            break;
        case 'Disapprove':
            $('#confirmationApproval').modal('show');
            $('#confirmationModalMsg').text('Do you want to disapprove this request? Please indicate reason.');
            break;
        default:
            break;
    }

}


$('#btnYes').click(function () {

    if (g_currentAction === 'Approve') {
        $('#confirmationApproval').modal('hide');
        $('#preloader').fadeIn();
        setTimeout(function () {
            ApproveRequest();
            $('#preloader').fadeOut();
        }, 200)
    } else if (g_currentAction === 'Disapprove') {

        var remarks = $('#remarks').val().trim();

        if (remarks === '') {
            $('#divErrorRemarks').attr('hidden', false);
            return;
        }

        $('#confirmationApproval').modal('hide');
        $('#preloader').fadeIn();

        setTimeout(function () {
            DisapproveRequest();
            $('#preloader').fadeOut();
        }, 200)

    }

})


function ApproveRequest() {

    ShowNotification('success', 'Budget Memo No. ' + g_budgetMemoNo + ' has been successfully approved!');
    var arrIndex = budgetMemoList.findIndex(c => c.BudgetMemoNo === g_budgetMemoNo);
    budgetMemoList.splice(arrIndex, 1);

    if (budgetMemoList.length === 0) {
        $('.pulsate').remove()
    }

    GenerateDataTable(budgetMemoList);

    var remarks = $('#remarks').val();

    var params = JSON.stringify({
        budgetMemoNo: g_budgetMemoNo,
        routeNo: g_routeNo,
        currentHandler: uz.BMAS_UserId,
        remarks: remarks
    });

    $.ajax({
        async: true,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/ApproveRequest',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
       
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function DisapproveRequest() {

    ShowNotification('success', 'Budget Memo No. ' + g_budgetMemoNo + ' has been successfully disapproved!');
    var arrIndex = budgetMemoList.findIndex(c => c.BudgetMemoNo === g_budgetMemoNo);
    budgetMemoList.splice(arrIndex, 1);

    if (budgetMemoList.length === 0) {
        $('.pulsate').remove()
    }

    GenerateDataTable(budgetMemoList);

    var remarks = $('#remarks').val();

    var params = JSON.stringify({
        budgetMemoNo: g_budgetMemoNo,
        routeNo: g_routeNo,
        currentHandler: uz.BMAS_UserId,
        remarks: remarks
    });

    $.ajax({
        async: true,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/DisapproveRequest',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            


       
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function ViewFile(budgetMemoNo, routeNo, fileName, fileType) {

    var urlFile = '';

    //if (currentEnvironment === 'QAS') {
    //    urlFile = '/CRMQAS/EFReqDocAttachment/' + efNo + '_' + routeNo + '/' + fileName + fileType;
    //} else if (currentEnvironment === 'PROD') {
    //    urlFile = '/EFReqDocAttachment/' + efNo + '_' + routeNo + '/' + fileName + fileType;
    //}

    urlFile = 'BMA_Attachment/' + budgetMemoNo + '_' + routeNo + '/' + fileName + fileType;

    PopupCenter(urlFile.trim(), budgetMemoNo, 700, 600);
}


function GetStatusUpdateList(budgetMemoNo, routeNo) {


    $('#statusUpdate').text(null);
    var result = [];
    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetStatusUpdateList',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            result = JSON.parse(response.d);
            var tblStatusUpdateList = $('#tblStatusUpdateList tbody');
            tblStatusUpdateList.text(null);

            for (i = 0; i < result.length; i++) {

                var businessDate = result[i].BusinessDate == null ? '' : FormatDateToDateAndTime(DateFormatNumber(result[i].BusinessDate))

                if (result[i].RoleId !== 1) {
                    if (result[i].Status === '000002') {
                        businessDate = '';
                    }
                }

                tr = $('<tr/>');
                tr.append("<td style='text-align: center'>" + result[i].RoleDesc + "</td>");
                tr.append("<td style=''>" + result[i].Name + "</td>");
                tr.append("<td style=''>" + (result[i].StatusDesc == null ? '' : result[i].StatusDesc) + "</td>");
                tr.append("<td style=''>" + businessDate + "</td>");
                tr.append("<td style=''>" + (result[i].Remarks == null ? '' : result[i].Remarks) + "</td>");
                tblStatusUpdateList.append(tr);

            }

            GetProgressSteps(budgetMemoNo, routeNo);


        },
        error: function (error) {
            console.log(error);
        }
    });

    return result;
}


function GetProgressSteps(budgetMemoNo, routeNo) {

    var result = [];
    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetProgressSteps',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            result = JSON.parse(response.d);

            $('#statusUpdate').text(null);

            for (i = 0; i < result.length; i++) {
                var liClass = 'pending';

                if (result[i].RoleId === 1) {
                    if (result[i].Status !== '000001') {
                        liClass = 'done';
                    }
                }

                if (result[i].Status === '000001') {
                    liClass = 'active fa draftColorBefore draftColorAfter';
                }

                if (result[i].Status === '000003') {
                    liClass = 'done';

                    if (result[i].Counter === 1) {
                        liClass = 'done active';
                    }
                }

                if (result[i].Status === '000004') {
                    if (result[i].Counter === 1) {
                        liClass = 'done active fa disapproved changedBefore changedAfter';
                    }
                }

                if (result[i].Status !== '000001') {
                    if (result[i].Counter === 1 && result[i].RoleId === 1) {
                        liClass = 'done active';
                    }
                }

                var liHtml = '<li id="stepNo' + i + '" class="liProgress fa ' + liClass + '  handler' + result[i].RoleId + '"><span>' + result[i].RoleDesc + '</span></li>';
                $('#statusUpdate').append(liHtml);

            }

            $('.liProgress').css('display', 'block');
            //var currentRoleHandler = efList.find(c => c.EFNo === efNo).CurrentRoleHandler;
            //var status = efList.find(c => c.EFNo === efNo).Status;
            ////$('#stepNo' + currentRoleHandler).removeClass('liProgress fa pending');

            //if (status === '000004') {
            //    $('.handler' + (currentRoleHandler - 1)).removeClass('pending');
            //    $('.handler' + (currentRoleHandler - 1)).addClass('active done');
            //    $('.handler' + currentRoleHandler).addClass('active fa disapproved changedBefore changedAfter ');
            //} else {
            //    
            //    $('.handler' + (currentRoleHandler - 1)).removeClass('pending');
            //    $('.handler' + (currentRoleHandler - 1)).addClass('active done');
            //    //$('#stepNo' + currentRoleHandler).addClass('liProgress fa active done');
            //}
            //$('#handler' + (currentRoleHandler + 1)).removeClass('done');

            $('#stepNo3').addClass('without-after-element');
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function FormatChildItem(budgetMemoNo, subject, purpose, status) {

    var actionBtns = '<div class="template-demo d-flex" style="padding-top: 15px">' +
        '<button type="button" id="btnModify" onclick="GoToRequestForm(\'' + budgetMemoNo + '\', \'' + status + '\');" title="Modify" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-pencil-alt"></i></button>' +
        '<button type="button" id="btnApprove" onclick="ValidateIsActionTaken(\'' + 'Approve' + '\'); " title="Approve" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-thumbs-up"></i></button>' +
        '<button type="button" id="btnDisApprove" onclick="ValidateIsActionTaken(\'' + 'Disapprove' + '\');" title="Disapprove" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-thumbs-down"></i></button>' +
        '<button type="button" id="btnPrint" onclick="PrintBudgetMemo(\'' + budgetMemoNo + '\', \'' + g_routeNo + '\');"  title="Print" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-print"></i></button>' +
        '</div>';

    var thStyle = 'padding: 8px 10px;border-bottom: 1px solid #edf3f3;background-color: #edf3f3;line-height: 5px;font-weight: 600;'
    var childTabs = '<div class="nav nav-tabs mb-3 p-t-10" id="nav-tab" role="tablist">' +
        '<button class="nav-link active" id="nav-attachment-tab" data-bs-toggle="tab" data-bs-target="#nav-attachment" type="button" role="tab" aria-controls="nav-attachment" aria-selected="false">Attachments</button>' +
        '<button class="nav-link " id="nav-comment-tab" data-bs-toggle="tab" data-bs-target="#nav-comment" type="button" role="tab" aria-controls="nav-gl" aria-selected="true">Comments</button>' +
        '</div>' +

        '<div class="tab-content border bg-light" id="nav-tabContent">' +

        '<div class="tab-pane fade active show" id="nav-attachment" role="tabpanel" aria-labelledby="nav-attachment-tab">' +

        '<div class="col-sm-10 p-l-0">' +
        '<table id="tblAttachments" class="table table-bordered">' +
        '<thead>' +
        '<tr>' +
        '<th scope="col" style="' + thStyle + '" >Description</th>' +
        '<th scope="col" style="' + thStyle + '" >File</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +

        '<div class="tab-pane fade" id="nav-comment" role="tabpanel" aria-labelledby="nav-gl-tab">' +
        '<div class="post" >' +
        '<div class="post-footer" style="padding-top:0px; font-family: calibri"> ' +
        '<div class="col-sm-12 input-group" id="divCommentbox">' +
        '<input id="approverComment" autocomplete="off" class="form-control" placeholder="Add a comment" type="text">' +
        '<span class="input-group-addon" id="btnSend"> <a href="#"><i class="fa fa-paper-plane"></i></a> </span>' +
        '</div>' +
        '<ul class="comments-list">' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>' +

        actionBtns +
        '</div>';
    var statusUpdate = GetStatusUpdate(budgetMemoNo);

    var html = '<div class="childTrClass">' +

        '<div class="col-sm-12 childStatusUpdateClass">' +
        '<a href="#" class="aLink" id="btnStatusUpdate"><i class="fa fa-users"></i> Status Update ' + statusUpdate + '</a></div> ' +

        '<div class="row">' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Subject:</label>' +
        '</div>' +
        '<div class="col-sm-5">' +
        '<textarea rows="7" class="form-control childTextClass" disabled>' + subject + '</textarea>' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Purpose:</label>' +
        '</div>' +
        '<div class="col-sm-5">' +
        '<textarea rows="7" class="form-control childTextClass" disabled>' + purpose + '</textarea>' +
        '</div>' +
        '</div>' +

        childTabs +

        '</div>';

    return html;
}

//function FormatChildItem(budgetMemoNo, subject, purpose, status) {


//    var approveDisapproveBtn = '';

//    approveDisapproveBtn = '<button type="button"  id="btnApprove" data-toggle="tooltip" data-placement="top" title="Approve" class="btn btn-default child-btns" onclick="ValidateIsActionTaken(\'' + 'Approve' + '\'); "><i class="fa fa-thumbs-up"></i></button>' +
//        '&nbsp' +
//        '<button type="button"  id="btnDisApprove" data-toggle="tooltip" data-placement="top" title="Disapprove" class="btn btn-default child-btns" onclick="ValidateIsActionTaken(\'' + 'Disapprove' + '\');"><i class="fa fa-thumbs-down"></i></button>' +
//        '&nbsp' +
//        '<button type="button"  id="btnModify" data-toggle="tooltip" data-placement="top" title="Modify" class="btn btn-default child-btns"  onclick="GoToRequestForm(\'' + budgetMemoNo + '\', \'' + status + '\');" ><i class="fa fa-pencil-alt"></i></button>' +
//        '&nbsp' +
//        '<button type="button"  id="btnPrint" data-toggle="tooltip" data-placement="top" title="Print" class="btn btn-default child-btns" onclick="PrintBudgetMemo(\'' + budgetMemoNo + '\', \'' + g_routeNo + '\');"><i class="fa fa-print"></i></button>';



//    var childItemBtns = '<div class="div-child-btns">' +
//        approveDisapproveBtn +
//        '</div>';

//    var processorTabs = '';



//    var commentNoBadge = '<div class="button" id="divCommentBadge" style="top: 4px;position: absolute;left: 79px;font-size: 10px;top: 24px;"><span id="commentCount" class="button__badge animated shake"></span></div>';



//    var attachmentHtml = '<div style="margin-left: 15px; margin-right: 30px; ">' +
//        '<ul class="nav nav-tabs" style="display: block"> ' +
//        '<li class="active"><a href="#attachment" data-toggle="tab" style="padding:3px 10px;">Attachments</a></li> ' +
//        '<li ><a href="#userComments" data-toggle="tab" style="padding:3px 10px;">Comments' +
//        commentNoBadge +
//        '</a></li> ' +
//        processorTabs +
//        '</ul>' +
//        '<div class="tab-content">' +

//        '<div class="tab-pane active" id="attachment">' +
//        '<div class="row" style="padding-top: 15px">' +
//        '<div class="col-sm-6">' +
//        '<div class="box-content box-content-transparent" style="padding:0px">' +
//        '<div class="form-group2 has-feedback">' +
//        '<div id="divAttachments" class="table-responsive">' +
//        '<table id="tblAttachments" class="table table-bordered table-heading no-border-bottom ">' +
//        '<thead>' +
//        '<tr style="padding: 2px 10px;">' +
//        '<th scope="col" style="padding: 2px 10px; border-bottom: 1px solid #e3e3e3; background-color:#e3e3e3">Description</th>' +
//        '<th scope="col" style="padding: 2px 10px; border-bottom: 1px solid #e3e3e3; background-color:#e3e3e3">File</th>' +
//        '</tr>' +
//        '</thead>' +
//        '<tbody>' +
//        '</tbody>' +
//        '</table>' +
//        '</div>' +
//        '</div>' +
//        '</div>' +
//        '</div>' +
//        '</div>' +
//        '</div>' +

//        '<div class="tab-pane" id="userComments">' +
//        '<div class="row" style="padding-top: 15px">' +
//        '<div class="col-sm-12">' +
//        '<div class="box-content box-content-transparent" style="padding:0px">' +
//        '<div class="form-group2 has-feedback">' +
//        '<div id="divComments" class="table-responsive">' +


//        '<div class="post" >' +
//        '<label style="color: black; padding-left:15px">Comment Section:</label>' +
//        '<div class="post-footer" style="padding-top:0px; font-family: Calibri"> ' +
//        '<div class="col-sm-12 input-group" id="divCommentBox">' +
//        '<input id="approverComment" class="form-control" placeholder="Add a comment" type="text">' +
//        '<span class="input-group-addon" id="btnSend"> <a href="#"><i class="fa fa-paper-plane"></i></a> </span>' +
//        '</div>' +
//        '<ul class="comments-list">' +



//        '</ul>' +
//        '</div>' +
//        '</div>' +

//        '</div>' +
//        '</div>' +
//        '</div>' +
//        '</div>' +
//        '</div>' +
//        '</div>' +


//        '</div>' +
//        '</div>';

//    var statusUpdate = GetStatusUpdate(budgetMemoNo);

//    var inputStyle = 'background: #F3FBFF; font-family: Calibri; font-size: 14px; height: 27px;';
//    var html = '<div class="well well-sm col-sm-12" style="background-color: transparent; padding: 10px 20px" >' +
//        '<div class="row">' +
//        '<div class="col-sm-12 p-t-10" style="padding-top: 10px"><a href="#" id="btnStatusUpdate" style="font-weight: 700"><i class="fa fa-random"></i> Status Update ' + statusUpdate + ' </a></div> ' +
//        '<div class="col-sm-12 p-t-10" style="padding-top: 15px; padding-bottom: 15px">' +
//        '<label class="col-sm-1 p-0">Subject:</label>' +
//        '<div class="col-sm-5">' +
//        '<textarea id="subject" rows="5" class="form-control" disabled="" style="resize: none; font-size: 14px; background-color: #F3FBFF;">' + subject + '</textarea>' +
//        '</div>' +
//        '<div class="col-sm-1 p-0">' +
//        '<label>Purpose:</label>' +
//        '</div>' +
//        '<div class="col-sm-5">' +
//        '<textarea id="subject" rows="5" class="form-control" disabled="" style="resize: none; font-size: 14px; background-color: #F3FBFF;">' + purpose + '</textarea>' +
//        '</div>' +

//        '</div>' +



//        attachmentHtml +
//        '<div class="col-sm-12 p-t-10" style="padding-left: 16px; padding-top: 0px">' +
//        childItemBtns +
//        '</div>' +

//        '</div>' +
//        '</div>';




//    return html;
//}



function GetStatusUpdate(budgetMemoNo) {

    var result = '';
    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: g_routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/GetBMAStatusUpdate',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            result = response.d;
        },
        error: function (error) {
            console.log(error);
        }
    });

    return result;
}