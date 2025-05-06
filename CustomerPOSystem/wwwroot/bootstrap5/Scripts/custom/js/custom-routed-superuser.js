var dateToday = new Date();
var g_budgetMemoNo = '';
var g_routeNo = '';
var budgetMemoList = [];
$(document).ready(function () {

    $('a').click(function ($e) {
        $e.preventDefault();
    });

    //if (parseInt(uz.BMAS_RoleId) !== '99') {
    //    window.location.href = currentDomainName;
    //}

    $('.userButtons').attr('hidden', true);
    GetBudgetMemoSuperUser();
    $('.approverMenu').removeAttr('hidden');
    $('.approverMenu').css('pointer-events', 'none');

});

function GetBudgetMemoSuperUser() {

    var params = JSON.stringify({
        userId: uz.BMAS_UserId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/AdminService.asmx/GetBudgetMemoSuperUser',
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
  
    PopupCenter("/ViewReport.aspx?BudgetMemoNo=" + budgetMemoNo + "&RouteNo=" + routeNo, budgetMemoNo, 700, 600);
   
    //$('#modalLoader').modal('show');
    //var params = JSON.stringify({
    //    budgetMemoNo: budgetMemoNo,
    //    routeNo: routeNo
    //});

    //$.ajax({
    //    async: false,
    //    type: 'POST',
    //    url: 'Services/ReportService.asmx/PrintBudgetMemo',
    //    data: params,
    //    dataType: 'json',
    //    contentType: 'application/json; charset=utf-8',
    //    success: function (response) {
    //        //result = JSON.parse(response.d);

    //        var urlFile = '';
    //        var fileType = '.pdf';
    //        var fileName = '-BudgetMemo_' + budgetMemoNo;

    //        if (window.location.href.includes('local')) {
    //            urlFile = 'BMA_Attachment/' + budgetMemoNo + '_' + routeNo + '/' + fileName + fileType;
    //        } else {
    //            urlFile = 'BMA_Attachment/' + budgetMemoNo + '_' + routeNo + '/' + fileName + fileType;
    //        }

    //        setTimeout(function () {
    //            $('#modalLoader').modal('hide');
    //            PopupCenter(urlFile.trim(), budgetMemoNo, 700, 600);
    //        }, 300)

    //        setTimeout(function () {
    //            DeleteAfterViewing(budgetMemoNo, routeNo);
    //        }, 5000);
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});

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


$('a').click(function ($e) {

    $e.preventDefault();
});
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
            statusHtml = '<div class="badge badge-pill badge-info ml-2" style=" font-size:13px">Draft</div>';
        } else if (item.Status === "000002") {
            statusHtml = '<div class="badge badge-pill badge-info ml-2" style="background-color: #2676c7; font-size:13px">For Approval</div>';
        } else if (item.Status === "000004") {
            statusHtml = '<div class="badge badge-pill badge-info ml-2" style="background-color: #d9534e; font-size:13px">Disapproved</div>';
        } else if (item.Status === "000006") {
            statusHtml = '<div class="badge badge-pill badge-info ml-2" style="background-color: #2ecc71; font-size:13px">Completed</div>';
        } else if (item.Status === "000005") {
            statusHtml = '<div class="badge badge-pill badge-info ml-2" style="background-color: #bf4c91; font-size:13px">Cancelled</div>';
        }
        data.push(statusHtml);
        //data.push(statusHtml);
        dataItems.push(data);

    });

    var table = $('#tblDataTable').DataTable({
        "autoWidth": true,
        "order": [[1, "desc"]],
        "scrollX": isMobileView,
        data: dataItems,
        columns: [
            {
                "className": 'child-control text-center', //0
                "orderable": false,
                "defaultContent": ''
            },
            { "title": "Budget Memo No." }, //1
            { "title": "Requested By" }, //3
            { "title": "Date Requested" }, //5
            { "title": "Category" }, //5
            { "title": "Sub-Category" }, //5
            { "title": "Project" }, //5
            { "title": "Department" }, //5
            { "title": "Request Type" }, //5
            { "title": "Amount" }, //5
            { "title": "Status" }, //5
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
            $('#modalLoader').modal('show');
            tr.find('td').eq(0).html('<a href="#" class=""> <i class="fa fa-chevron-down" ></i></a>');

            var budgetMemoNo = $(this).find("td:eq(1)").text().trim();

            g_budgetMemoNo = budgetMemoNo;
            setTimeout(function () {

                var routeNo = budgetMemoList.find(c => c.BudgetMemoNo === budgetMemoNo).RouteNo;
                var status = budgetMemoList.find(c => c.BudgetMemoNo === budgetMemoNo).Status;
                g_currentStatus = status;
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
                    $('#budgetMemoNo').text(budgetMemoNo);
                    if (parseInt(routeNo) > 1) {
                        $('#divRouteNo').removeAttr('hidden');
                        GetRouteNoList(parseInt(g_routeNo));
                        $('#routeNo').val(g_routeNo);

                        $('#routeNo').on('change', function () {
                            GetStatusUpdateList(g_budgetMemoNo, this.value);
                            $('#budgetMemoNo').text(g_budgetMemoNo);
                        })
                    }
                })

                $('#btnApprove').attr('disabled', true);
                $('#btnDisapprove').attr('disabled', true);
                $('.commentAction').attr('hidden', true);
                $('#divCommentBox').remove();

                $('#btnModify').attr('disabled', true);

                if (g_currentStatus !== '000006') {
                    $('#btnPrint').attr('disabled', true);
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
                    tr.append("<td style='padding: 2px 10px;'>" + requirementDesc + "</td>");
                    tr.append('<td style="padding: 2px 10px;border-bottom: 1px solid #e3e3e3;"><a href="#" onclick="ViewFile(\'' + budgetMemoNo + '\', \'' + routeNo + '\', \'' + requirementDesc + '\', \'' + fileType + '\')">' + attachmentList[i].FileName + '</a></td>');
                    tblAttachments.append(tr);
                }

                $('a').click(function ($e) {
                    $e.preventDefault();
                });

                $('#modalLoader').modal('hide');
            }, 200);

        }
    });

    // $('.table thead tr th').removeClass('sorting_asc');
    $('#tblDataTable tbody > tr[role=row]').addClass('c-pointer');
    $('#tblDataTable').removeAttr('style');
    $('#tblDataTable_length').text('')
    //$('#tblDataTable_filter').attr('hidden', true);

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
                    '<h4 class="user" style="padding-left:10px">' +
                    '<span class="dropdown">' +
                    '<a id="dLabel" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
                    '<p id="commmentBox' + result[i].CommentNo + '">' + result[i].CommentDesc + '</p>' +
                    '</div>' +
                    '</li>';

                $('.comments-list').append(liHtmlComment);


            }

            if (result.length === 0) {
                $('#divCommentBadge').remove();
            }

        },
        error: function (error) {
            console.log(error);
        }
    });


}

function InsertToApproverComments(budgetMemoNo, routeNo, commentedBy, commentDesc) {

    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo,
        commentedBy: commentedBy,
        commentDesc: commentDesc
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/CommentService.asmx/InsertToApproverComments',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var returnResult = JSON.parse(response.d);

            var liHtmlComment = '<li class="comment" id="commentNo' + returnResult[0].CommentNo + '"> ' +
                '<a class="pull-left" href="#"> <img class="avatar" src="Images/avatar1.png" alt="avatar"> </a>' +
                '<div class="comment-body">' +
                '<div class="comment-heading">' +
                '<h4 class="time" style="padding-right:5px">Route #' + returnResult[0].RouteNo + '</h4>' +
                '<h4 class="user">' + uz.Name + '</h4>' +
                '<h5 class="time">' + FormatDateToDateAndTime(DateFormatNumber(returnResult[0].CommentDate)) + '</h5>' +
                '<h4 class="user" style="padding-left:10px">' +
                '<span class="dropdown">' +
                '<a id="dLabel" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
                '<span class="commentAction" id="commentDots' + returnResult[0].CommentNo + '" style="font-size:20px">...</span>' +
                '</a>' +
                '<ul class="dropdown-menu" aria-labelledby="dLabel">' +
                '<li><a href="#" class="editBtn" onclick="ShowCommentBoxText(\'' + returnResult[0].CommentNo + '\'); "> <i class="fa fa-pen" ></i> Edit comment</a></li>' +
                '<li><a href="#" class="deleteBtn" onclick="ShowConfirmationDeleteComment(\'' + returnResult[0].CommentNo + '\');"><i class="fa fa-trash"></i> Delete comment</a></li>' +
                '</ul>' +
                '</div>' +
                '</h4 > ' +
                '</span>' +
                '<p id="commmentBox' + returnResult[0].CommentNo + '">' + returnResult[0].CommentDesc + '</p>' +
                '</div>' +
                '</li>';

            if ($('.comments-list li').length === 0) {
                $('.comments-list').append(liHtmlComment);
            } else {
                $('.comments-list li:eq(0)').before(liHtmlComment);
            }


            var commentCount = $('.comment').length;
            $('#commentCount').text(commentCount);

            $('.editBtn').click(function ($e) {
                $e.preventDefault();
            });

            $('.deleteBtn').click(function ($e) {
                $e.preventDefault();
            });

            $('#approverComment').val(null);

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
}

function ValidateIsActionTaken(action) {
    $('#remarks').val('');
    ShowConfirmApprovalModal(action);
}

function ShowConfirmApprovalModal(action) {
    g_currentAction = action;

    switch (action) {
        case 'Approve':
            $('#confirmationApproval').modal('show');
            $('#confirmationModalMsg').text('Do you want to approve this request?');
            break;
        case 'Disapprove':
            $('#confirmationApproval').modal('show');
            $('#confirmationModalMsg').text('Do you want to disapprove this request?');
            $('#divRemarks').attr('hidden', false);
            break;
        default:
            break;
    }

}


$('#btnYes').click(function () {

    if (g_currentAction === 'Approve') {
        $('#confirmationApproval').modal('hide');
        $('#modalLoader').modal('show');
        setTimeout(function () {
            ApproveRequest();
            $('#modalLoader').modal('hide');
        }, 200)
    } else if (g_currentAction === 'Disapprove') {
        $('#confirmationApproval').modal('hide');
        $('#modalLoader').modal('show');

        setTimeout(function () {
            DisapproveRequest();
            $('#modalLoader').modal('hide');
        }, 200)

    }

})


function ApproveRequest() {

    var remarks = $('#remarks').val();

    var params = JSON.stringify({
        budgetMemoNo: g_budgetMemoNo,
        routeNo: g_routeNo,
        currentHandler: uz.BMAS_UserId,
        remarks: remarks
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/ApproveRequest',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            ShowNotification('success', 'EF No. ' + g_budgetMemoNo + ' has been successfully approved!');
            GetBudgetMemoList(g_currentStatus);
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function DisapproveRequest() {

    var remarks = $('#remarks').val();

    var params = JSON.stringify({
        budgetMemoNo: g_budgetMemoNo,
        routeNo: g_routeNo,
        currentHandler: uz.BMAS_UserId,
        remarks: remarks
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/BudgetMemoService.asmx/DisapproveRequest',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            ShowNotification('success', 'EF No. ' + g_budgetMemoNo + ' has been successfully disapproved!');
            GetBudgetMemoList(g_currentStatus);
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

    urlFile = currentDomainName + '/Sys_eBudget/BMA_Attachment/' + budgetMemoNo + '_' + routeNo + '/' + fileName + fileType;

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
                tr.append("<td style='padding: 2px 10px; text-align: center'>" + result[i].RoleDesc + "</td>");
                tr.append("<td style='padding: 2px 10px;'>" + result[i].Name + "</td>");
                tr.append("<td style='padding: 2px 10px;'>" + (result[i].StatusDesc == null ? '' : result[i].StatusDesc) + "</td>");
                tr.append("<td style='padding: 2px 10px;'>" + businessDate + "</td>");
                tr.append("<td style='padding: 2px 10px;'>" + (result[i].Remarks == null ? '' : result[i].Remarks) + "</td>");
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


    var approveDisapproveBtn = '';

    approveDisapproveBtn = '<button type="button"  id="btnApprove" data-toggle="tooltip" data-placement="top" title="Approve" class="btn btn-default child-btns" onclick="ValidateIsActionTaken(\'' + 'Approve' + '\'); "><i class="fa fa-thumbs-up"></i></button>' +
        '&nbsp' +
        //' <button id="btnDisapprove" class="btn btn-default bouton-image monBouton" data-toggle="tooltip" data-placement="top" title="For Review" onclick="ValidateIsActionTaken(\'' + 'Disapprove' + '\');" style="padding-right: 4px; padding-top: 4px"></button>' +
        '<button type="button"  id="btnDisapprove" data-toggle="tooltip" data-placement="top" title="Disapprove" class="btn btn-default child-btns" onclick="ValidateIsActionTaken(\'' + 'Disapprove' + '\');"><i class="fa fa-thumbs-down"></i></button>' +
        '&nbsp' +
        '<button type="button"  id="btnModify" data-toggle="tooltip" data-placement="top" title="Modify" class="btn btn-default child-btns"  onclick="GoToRequestForm(\'' + budgetMemoNo + '\', \'' + status + '\');" ><i class="fa fa-pencil-alt"></i></button>' +
        '&nbsp' +
        '<button type="button"  id="btnPrint" data-toggle="tooltip" data-placement="top" title="Print" class="btn btn-default child-btns" onclick="PrintBudgetMemo(\'' + budgetMemoNo + '\', \'' + g_routeNo + '\');"><i class="fa fa-print"></i></button>';



    var childItemBtns = '<div class="div-child-btns">' +
        approveDisapproveBtn +
        '</div>';

    var processorTabs = '';



    var commentNoBadge = '<div class="button" id="divCommentBadge" style="top: 4px;position: absolute;left: 79px;font-size: 10px;top: 24px;"><span id="commentCount" class="button__badge animated shake"></span></div>';



    var attachmentHtml = '<div style="margin-left: 15px; margin-right: 30px; ">' +
        '<ul class="nav nav-tabs" style="display: block"> ' +
        '<li class="active"><a href="#attachment" data-toggle="tab" style="padding:3px 10px;">Attachments</a></li> ' +
        '<li ><a href="#userComments" data-toggle="tab" style="padding:3px 10px;">Comments' +

        commentNoBadge +
        '</a></li> ' +
        processorTabs +
        '</ul>' +
        '<div class="tab-content">' +

        '<div class="tab-pane active" id="attachment">' +
        '<div class="row" style="padding-top: 15px">' +
        '<div class="col-sm-6">' +
        '<div class="box-content box-content-transparent" style="padding:0px">' +
        '<div class="form-group2 has-feedback">' +
        '<div id="divAttachments" class="table-responsive">' +
        '<table id="tblAttachments" class="table table-bordered table-heading no-border-bottom ">' +
        '<thead>' +
        '<tr style="padding: 2px 10px;">' +
        '<th scope="col" style="padding: 2px 10px; border-bottom: 1px solid #e3e3e3; background-color:#e3e3e3">Description</th>' +
        '<th scope="col" style="padding: 2px 10px; border-bottom: 1px solid #e3e3e3; background-color:#e3e3e3">File</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab-pane" id="userComments">' +
        '<div class="row" style="padding-top: 15px">' +
        '<div class="col-sm-12">' +
        '<div class="box-content box-content-transparent" style="padding:0px">' +
        '<div class="form-group2 has-feedback">' +
        '<div id="divComments" class="table-responsive">' +


        '<div class="post" >' +
        '<label style="color: black; padding-left:15px">Comment Section:</label>' +
        '<div class="post-footer" style="padding-top:0px; font-family: Calibri"> ' +
        '<div class="col-sm-12 input-group" id="divCommentBox">' +
        '<input id="approverComment" class="form-control" placeholder="Add a comment" type="text">' +
        '<span class="input-group-addon" id="btnSend"> <a href="#"><i class="fa fa-paper-plane"></i></a> </span>' +
        '</div>' +
        '<ul class="comments-list">' +



        '</ul>' +
        '</div>' +
        '</div>' +

        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +


        '</div>' +
        '</div>';

    var statusUpdate = GetStatusUpdate(budgetMemoNo);

    var inputStyle = 'background: #F3FBFF; font-family: Calibri; font-size: 14px; height: 27px;';
    var html = '<div class="well well-sm col-sm-12" style="background-color: transparent; padding: 10px 20px" >' +
        '<div class="row">' +
        '<div class="col-sm-12 p-t-10" style="padding-top: 10px"><a href="#" id="btnStatusUpdate" style="font-weight: 700"><i class="fa fa-random"></i> Status Update ' + statusUpdate + ' </a></div> ' +
        '<div class="col-sm-12 p-t-10" style="padding-top: 15px; padding-bottom: 15px">' +
        '<label class="col-sm-1 p-0">Subject:</label>' +
        '<div class="col-sm-5">' +
        '<textarea id="subject" rows="5" class="form-control" disabled="" style="resize: none; font-size: 14px; background-color: #F3FBFF;">' + subject + '</textarea>' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label>Purpose:</label>' +
        '</div>' +
        '<div class="col-sm-5">' +
        '<textarea id="subject" rows="5" class="form-control" disabled="" style="resize: none; font-size: 14px; background-color: #F3FBFF;">' + purpose + '</textarea>' +
        '</div>' +

        '</div>' +


        //'<div class="col-sm-12 p-t-10" style="padding-top: 10px; padding-bottom: 15px">' +
        //'<label class="col-sm-1 p-0" style="padding-right: 0px">Date Reserved</label>' +
        //'<div class="col-sm-3">' +
        //'<input type="text" style="' + inputStyle + '" value="' + FormatDate(DateFormatNumber(d.ContractDate)) + '" class="form-control" disabled />' +
        //'</div>' +
        //'<div class="col-sm-1 p-0">' +
        //'<label>Unit/Lot No.:</label>' +
        //'</div>' +
        //'<div class="col-sm-3">' +
        //'<input type="text" style="' + inputStyle + '" value="' + d.Unit + '" class="form-control" disabled />' +
        //'</div>' +
        //'<div class="col-sm-1 p-0">' +
        //'<label>Unit Type</label>' +
        //'</div>' +
        //'<div class="col-sm-3">' +
        //'<input type="text" style="' + inputStyle + '" value="' + d.UnitDescription + '" class="form-control" disabled />' +
        //'</div>' +
        //'</div>' +


        attachmentHtml +
        '<div class="col-sm-12 p-t-10" style="padding-left: 16px; padding-top: 0px">' +
        childItemBtns +
        '</div>' +

        '</div>' +
        '</div>';

    return html;
}




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