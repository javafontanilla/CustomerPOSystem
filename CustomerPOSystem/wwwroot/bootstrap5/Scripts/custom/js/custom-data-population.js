var g_currFilterList = [];
var g_filterDateFrom = '';
var g_filterDateTo = '';
var g_goLiveDate = '10/01/2019';
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

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
            console.log(jqXHR)
            if (typeof errorCallBackFunction === "function") {
                errorCallBackFunction(errorThrown);
            }

        },
        complete: function (jqXHR, textStatus) {
            if (typeof completeCallbackFunction === "function") {
                completeCallbackFunction();
            }
        }
    });

}
 
function GeneratePanelHeader(status) {
    $('#preloader').fadeIn();
    $('#statusHeader').text('');
    var dateRangeStyle = 'cursor: pointer;';
    if (status !== 'Completed' && status !== 'Reports') {
        dateRangeStyle = 'cursor: initial; pointer-events: none; color: #a8b9bff5';
    }

    var dateRange = '<div id="dataRange" class="pull-left" name="datetimes" style="' + dateRangeStyle + '">' +
        '<i class="mdi mdi-calendar-multiple-check"></i>' +
        '<span></span><i class="mdi mdi-chevron-down"></i> &nbsp;' +
        '</div>';

    var panelHeader =
        '<div class="page-header" style="background: transparent;margin: 0px;box-shadow: none;" >' +
        '<div class="panel-heading" style="padding: 0px 0px;">' +
        '<i class="fa fa-archive"></i>  &nbsp;' + status + '</div>' +
        '<nav aria-label="breadcrumb" id="filterDateNav" >' +
        dateRange +
        '</nav>' +
        '</div>';

    $('#statusHeader').html(panelHeader);
    GetUserFilterDetermination(status);

}

function GenerateDataTable(status, deptId) {

    setTimeout(function () {

        var str = window.location.pathname;
        var n = str.lastIndexOf('/');
        var currentPath = str.substring(n + 1);
        if (currentPath === 'RequestForm') {
            location.href = 'RequestList.aspx?status=' + status;
        }

        g_currentStatus = status;
        $('#divDataTableHeader').text(null);
        $('#divDataTableHeader').append('<table id="tblTransaction" class="table"></table>');

        var tableLoader = '<tr class="js-table-row-loader">' +
            '<td colspan="12" class="table-cell-loader">' +
            '<div class="row-loader u-flex">' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '</div>' +
            '<div class="row-loader u-flex">' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '</div>' +
            '<div class="row-loader u-flex">' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '</div>' +
            '<div class="row-loader u-flex">' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '</div>' +
            '<div class="row-loader u-flex">' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '</div>' +
            '<div class="row-loader u-flex">' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '</div>' +
            '<div class="row-loader u-flex">' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '<div class="u-flex__cell u-mg--sm u-pd--sm loading-animation u-show-large-only--flex"></div>' +
            '</div>' +
            '</td>' +
            '</tr>';

        $('#tblTransaction').text('');

        $('#tblTransaction').append(tableLoader);

        var table = $('#tblTransaction').DataTable({
            //"info": false,
            "pageLength": 10,
            "lengthChange": false,
            "searching": true,
            "ordering": true,
            "responsive": true,
            "scrollX": true,
            "scrollCollapse": true,
            "autoWidth": false,
            "destroy": true,
            "processing": true, // for show progress bar
            /*            oLanguage: { sProcessing: "<div id='loader'></div>" },*/
            oLanguage: { sProcessing: "" },
            async: true,
            "serverSide": true, // for process server side
            "filter": false, // this is for disable filter (search box)
            "orderMulti": false, // for disable multiple column at once
            "ajax": {
                "url": 'Services/DataBindService.asmx/GetDataList',
                data: { 'hasSuperUserAccess': uz.BMAS_HasSuperUserAccess, 'status': status, 'userId': uz.UserId, 'deptId': deptId, 'dateRangeFrom': g_filterDateFrom, 'dateRangeTo': g_filterDateTo },
                "type": "POST",
                "dataType": 'JSON',

            },
            "deferRender": true,
            "order": [[2, "desc"]],
            "columns": [
                {
                    "tite": "",
                    //"className": 'child-control text-center', //0
                    "orderable": false,
                    "defaultContent": '',
                    "data": function (data, type, dataToSet) {
                        return '<a href="#" class="btnParent"> <i class="fa fa-chevron-right aLink" ></i></a>';
                    }
                },

                { "title": "Budget Memo No.", "data": "BudgetMemoNo", "name": "BudgetMemoNo", "autoWidth": true },
                { "title": "Requested By", "data": "RequestedBy", "name": "RequestedBy", "autoWidth": true },
                { "title": "Date Requested", "data": "RequestedDate", "name": "RequestedDate", "autoWidth": true },
                { "title": "Category", "data": "CategoryDesc", "name": "CategoryDesc", "autoWidth": true },
                { "title": "Sub-Category", "data": "SubCategoryDesc", "name": "SubCategoryDesc", "autoWidth": true },
                { "title": "Project", "data": "ProjectName", "name": "ProjectName", "autoWidth": true },
                { "title": "Department", "data": "DepartmentDesc", "name": "DepartmentDesc", "autoWidth": true },
                { "title": "Request Type", "data": "RequestTypeDesc", "name": "RequestTypeDesc", "autoWidth": true },
                { "title": "Amount", "data": "Amount", "name": "Amount", "autoWidth": true },
                {
                    "title": "Status",
                    "className": 'child-control text-center', //0
                    "orderable": true,
                    "name": "StatusDesc",
                    "defaultContent": '',
                    "data": function (data, type, dataToSet) {
                        var statusHtml = '';
                        if (data.Status === Draft) {
                            statusHtml = '<label class="badge badge-draft">Draft</label>';
                        } else if (data.Status === ForApproval) {
                            statusHtml = '<label class="badge badge-info">For Approval</label>';
                        } else if (data.Status === Disapproved) {
                            statusHtml = '<label class="badge badge-danger">Disapproved</label>';
                        } else if (data.Status === FullyApproved) {
                            statusHtml = '<label class="badge badge-success">Completed</label>';
                        } else if (data.Status === Cancelled) {
                            statusHtml = '<label class="badge badge-cancelled">Cancelled</label>';
                        }
                        return statusHtml;
                    }
                },

            ],

            "initComplete": function (settings, json) {
                dataListed = json.data;
                $('#preloader').hide();
                //g_currFilterList

            }, "drawCallback": function (settings) {

                var response = settings.json;
                dataListed = response.data;
            },

        }).on('processing.dt', function (e, settings, processing) {
            // The processing variable is a boolean.
            if (processing) {
                $('.dataTables_scroll').css('pointer-events', 'none');
                $('.js-table-row-loader').attr('hidden', false);
                $('#tblTransaction tbody tr').attr('hidden', true);
            } else {
                $('.dataTables_scroll').css('pointer-events', 'initial');
                $('#tblTransaction tbody tr').attr('hidden', false);
                $('.js-table-row-loader').attr('hidden', true);
                if (status === 'For Approval') {
                    if (unseenRecordsForApproval.length > 0) {
                        GetNewRecordForApproval();
                        $('#divBadge').attr('hidden', true);
                    }
                }
            }

        })

        $('#tblTransaction').on('click', 'tbody tr[role=row]', function () {

            //alert('waass');
            var tr = $(this);
            var row = table.row(tr);

            if (row.child.isShown()) {

                row.child.hide();
                tr.removeClass('shown');
                tr.find('td').eq(0).html('<a href="#" class=""> <i class="fa fa-chevron-right aLink" ></i></a>');
            } else {
                CloseEveryChildOpen();
                tr.find('td').eq(0).html('<a href="#" class=""> <i class="fa fa-chevron-down aLink" ></i></a>');
                var transactionNo = parseInt($(this).find("td:eq(2)").text().trim());
                //alert(transactionNo);
                childItems = rcpData.find(t => t.TransactionNo === transactionNo.toString());

                $('#preloader').fadeIn();

                setTimeout(function () {
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
                        tr.append("<td style='padding: 2px 10px;'>" + requirementDesc + isRequired + "</td>");
                        tr.append('<td style="padding: 2px 10px;border-bottom: 1px solid #e3e3e3;"><a href="#" onclick="ViewFile(\'' + budgetMemoNo + '\', \'' + routeNo + '\', \'' + requirementDesc + '\', \'' + fileType + '\')">' + attachmentList[i].FileName + '</a></td>');
                        tblAttachments.append(tr);
                    }

                    $('a').click(function ($e) {
                        $e.preventDefault();
                    });

                    switch (g_currentStatus) {
                        case "Draft":
                            $('#btnModify').attr('disabled', false);
                            $('#btnApprove').attr('disabled', true);
                            $('#btndisApprove').attr('disabled', true);
                            $('#btnPrint').attr('disabled', false);
                            break;
                        case "For Approval":
                            $('#btnModify').attr('disabled', true);
                            $('#btnApprove').attr('disabled', false);
                            $('#btndisApprove').attr('disabled', false);
                            $('#btnPrint').attr('disabled', true);
                            break;
                        case "Ongoing":
                            $('#btnModify').attr('disabled', true);
                            $('#btnApprove').attr('disabled', true);
                            $('#btndisApprove').attr('disabled', true);
                            $('#btnPrint').attr('disabled', false);
                            break;
                        case "Cancelled":
                            $('#btnModify').attr('disabled', true);
                            $('#btnApprove').attr('disabled', true);
                            $('#btndisApprove').attr('disabled', true);
                            $('#btnPrint').attr('disabled', true);
                        case "Completed":
                            $('#btnModify').attr('disabled', true);
                            $('#btnApprove').attr('disabled', true);
                            $('#btndisApprove').attr('disabled', true);
                            $('#btnPrint').attr('disabled', false);
                        case "Reports":
                            $('#btnModify').attr('disabled', true);
                            $('#btnApprove').attr('disabled', true);
                            $('#btndisApprove').attr('disabled', true);
                            $('#btnPrint').attr('disabled', false);
                            break;
                        default:
                            break;
                    }

                    tr.addClass('shown');
                 
                    $('#preloader').fadeOut();
                }, 200);

            }
        });

        function CloseEveryChildOpen() {
            table.rows().every(function () {
                // If row has details expanded
                if (this.child.isShown()) {
                    // Collapse row details
                    this.child.hide();
                    $(this.node()).removeClass('shown');
                    $(this.node()).find('td').eq(0).html('<a href="#" class=""> <i class="fa fa-chevron-right" ></i></a>');
                }
            });
        }

        $('#tblTransaction').on('page.dt', function () {
            CloseEveryChildOpen();
        });

        $('input[type="search"]').keyup(function () {
            CloseEveryChildOpen();
        });

        $('#tblTransaction tbody > tr[role=row]').addClass('c-pointer');
        $('#tblTransaction').removeAttr('style');
        $('#tblTransaction_length').text('');
     
        $("div.dataTables_filter input").bind("paste", function (e) {
            alert('wa');
            var pastedData = e.originalEvent.clipboardData.getData('text');

            $("#error_sp_msg").remove();

            var ar = /^[0-9A-Za-z ()_.-]*$/;
            var k = e.keyCode;
            if (ar.test(pastedData) == false) {
              
                return false;
            }
        });

        $("div.dataTables_filter input").keypress(function (e) {
            $("#error_sp_msg").remove();

            var ar = /^[0-9A-Za-z ()_.-]*$/;
            var k = e.keyCode;
            if (ar.test(e.key) == false) {
                
                return false;
            }
        })

    }, 200)

}


function GetDepartmentFiltering() {

    var result = [];

    var params = JSON.stringify({
        hasSuperUserAccess: uz.BMAS_HasSuperUserAccess,
        deptId: uz.BMAS_DepartmentId,
        location: uz.BMAS_Location
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetDepartmentFiltering',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            result = JSON.parse(response.d);
            departmentsWithPositions = result;
            for (i = 0; i < result.length; i++) {
                var dept = new Option(result[i].DepartmentName, result[i].DepartmentId);
                $("#deptName").append(dept);
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

function FormatChildItem(d, statusUpdate) {

    g_transNo = d.TransactionNo;

    var requestedDate = d.RequestedDate === null ? '' : FormatDateToDateAndTime(d.RequestedDate);



    var actionBtns = '<div class="template-demo d-flex" style="padding-top: 15px">' +
        '<button type="button" id="btnModify" onclick="GoToRequestForm(\'' + d.TransactionNo + '\', \'' + d.Status + '\', \'' + d.CompanyName + '\');" title="Modify" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-pencil-alt"></i></button>' +
        '<button type="button" id="btnApprove" onclick="ValidateIsActionTaken(\'' + d.TransactionNo + '\',\'' + d.RouteNo + '\', \'' + 'Approve' + '\'); " title="Approve" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-thumbs-up"></i></button>' +
        '<button type="button" id="btndisApprove" onclick="ValidateIsActionTaken(\'' + d.TransactionNo + '\',\'' + d.RouteNo + '\', \'' + 'Disapprove' + '\');" title="Disapprove" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-thumbs-down"></i></button>' +
        '<button type="button" id="btnPrint" onclick="PrintRCPCompleted(\'' + d.TransactionNo + '\', \'' + d.RouteNo + '\')"  title="Print" class="btn btn-social-icon btn-outline-twitter"><i class="fas fa-print"></i></button>' +
        '</div>';

    var pesoAmount = NumberWithCommas(d.PesoAmount);

    if (pesoAmount.substr((pesoAmount.indexOf('.') + 1)).length === 1) {
        pesoAmount = pesoAmount + "0";
    }
    var wordAmount = AmountInWords(pesoAmount, d.Currency);


    if (d.PesoAmountNet !== null) {
        var pesoAmountNet = NumberWithCommas(d.PesoAmountNet);

        if (pesoAmountNet.substr((pesoAmountNet.indexOf('.') + 1)).length === 1) {
            pesoAmountNet = pesoAmountNet + "0";
        }

        var wordAmountNet = AmountInWords(pesoAmountNet, d.Currency);

    } else {
        var pesoAmountNet = '';
        var wordAmountNet = '';
    }

    var sapInvoiceNo = d.SapInvoiceNo === null ? '' : d.SapInvoiceNo;
    var sapDocNo = d.SapDocNo === null ? '' : d.SapDocNo;
    var sapCheckVoucherNo = d.SapCheckVoucherDocNo === null ? '' : d.SapCheckVoucherDocNo;

    var hideOrder = '';
    var hideCostCenter = '';
    var hideNetwork = '';
    var hideWBS = '';
    var hideProfitCenter = '';
    var hideIsAsset = 'hidden';
    var project = childItems.ProjectCode;

    if (childItems.CategoryId === 2) {

        if (project === null || project === '') {
            hideOrder = '';
            hideCostCenter = '';
            hideNetwork = 'hidden';
            hideWBS = 'hidden';
        } else {
            hideOrder = 'hidden';
            hideCostCenter = 'hidden';
            hideNetwork = '';
            hideWBS = '';
        }

        if (childItems.GLAccounts.length > 0) {
            if (childItems.GLAccounts[0].OrderCode !== null) {
                if (childItems.GLAccounts[0].OrderCode.trim() === '') {
                    hideOrder = 'hidden';
                    hideCostCenter = 'hidden';
                    hideNetwork = '';
                    hideWBS = '';
                } else {
                    hideOrder = '';
                    hideCostCenter = '';
                    hideNetwork = 'hidden';
                    hideWBS = 'hidden';
                }
            }
        }

    } else if (childItems.CategoryId === 1) {

        if (project === null || project === '') {
            hideOrder = '';
            hideCostCenter = '';
            hideNetwork = 'hidden';
            hideWBS = 'hidden';
        } else {
            hideOrder = 'hidden';
            hideCostCenter = 'hidden';
            hideNetwork = '';
            hideWBS = '';
        }

    } else if (childItems.CategoryId === 3) {
        hideProfitCenter = 'hidden';
        hideCostCenter = 'hidden';
    }

    if (childItems.GLAccounts.length > 0) {
        if (childItems.GLAccounts[0].AssetCode !== null) {
            if (childItems.GLAccounts[0].AssetCode.trim() === '') {
                var hideIsAsset = 'hidden';
            } else {
                hideNetwork = 'hidden';
                hideOrder = 'hidden';
                hideWBS = 'hidden';
                hideCostCenter = '';
                hideIsAsset = '';
            }
        }
    }

    var thStyle = 'padding: 8px 10px;border-bottom: 1px solid #edf3f3;background-color: #edf3f3;line-height: 5px;font-weight: 600;'
    var childTabs = '<div class="nav nav-tabs mb-3 p-t-10" id="nav-tab" role="tablist">' +
        '<button class="nav-link active" id="nav-attachment-tab" data-bs-toggle="tab" data-bs-target="#nav-attachment" type="button" role="tab" aria-controls="nav-attachment" aria-selected="false">Attachments</button>' +
        '<button class="nav-link " id="nav-gl-tab" data-bs-toggle="tab" data-bs-target="#nav-gl" type="button" role="tab" aria-controls="nav-gl" aria-selected="true">GL Account</button>' +
        '<button class="nav-link" id="nav-doc-tab" data-bs-toggle="tab" data-bs-target="#nav-doc" type="button" role="tab" aria-controls="nav-doc" aria-selected="false">SAP Document</button>' +
        '</div>' +

        '<div class="tab-content border bg-light" id="nav-tabContent">' +

        '<div class="tab-pane fade active show" id="nav-attachment" role="tabpanel" aria-labelledby="nav-attachment-tab">' +

        '<div class="col-sm-7 p-l-0">' +
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

        '<div class="tab-pane fade" id="nav-gl" role="tabpanel" aria-labelledby="nav-gl-tab">' +
        '<table id="tblGLAccounts" class="table table-bordered"> ' +
        '<thead> ' +
        '<tr> ' +
        '<th scope="col" style="' + thStyle + '">GL Account</th> ' +
        '<th scope="col" style="' + thStyle + '">Amount</th> ' +
        '<th ' + hideNetwork + ' scope="col" style="' + thStyle + '">Network</th> ' +
        '<th ' + hideWBS + ' scope="col" style="' + thStyle + '">WBS</th> ' +
        '<th ' + hideOrder + ' scope="col" style="' + thStyle + '">Order</th> ' +
        '<th ' + hideIsAsset + ' scope="col" style="' + thStyle + '">Asset</th> ' +
        '<th ' + hideCostCenter + ' scope="col" style="' + thStyle + '">Cost Center</th> ' +
        '<th ' + hideProfitCenter + ' scope="col" style="' + thStyle + '">Profit Center</th> ' +
        '</tr> ' +
        '</thead> ' +
        '<tbody> ' +
        '</tbody> ' +
        '</table> ' +
        '</div>' +

        '<div class="tab-pane fade" id="nav-doc" role="tabpanel" aria-labelledby="nav-doc-tab">' +
        '<table id="tblSAPDocuments" class="table table-bordered table-heading no-border-bottom "> ' +
        '<thead> ' +
        '<tr> ' +
        '<th scope="col" style="' + thStyle + '">Document Number</th> ' +
        '<th scope="col" style="' + thStyle + '">Document Year</th> ' +
        '<th scope="col" style="' + thStyle + '">Vendor Name</th> ' +
        '<th scope="col" style="' + thStyle + '">GLAccount</th> ' +
        '<th scope="col" style="' + thStyle + '">Amount</th> ' +
        '<th scope="col" style="' + thStyle + '">Description</th> ' +
        '<th scope="col" style="' + thStyle + '">WBS</th> ' +
        '<th scope="col" style="' + thStyle + '">Project</th> ' +
        '<th scope="col" style="' + thStyle + '">Status</th> ' +
        '</tr> ' +
        '</thead> ' +
        '<tbody> ' +
        '</tbody> ' +
        '</table> ' +
        '</div>' +
        actionBtns +
        '</div>';

 
    var html = '<div class="childTrClass">' +

        '<div class="col-sm-12 childStatusUpdateClass">' +
        '<a href="#" class="aLink" onclick="ShowStatusUpdate(\'' + d.RouteNo + '\')"><i class="fa fa-users"></i> Status Update ' + statusUpdate + '</a></div> ' +

        '<div class="row">' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Requested By:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<input type="text" value="' + d.CreatedByDesc + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Date of Request:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<input type="text" value="' + requestedDate + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Department:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<input type="text" value="' + d.ProjDeptDesc + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '</div>' +

        '<div class="row p-t-10">' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Vendor Name:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<input type="text" value="' + d.VendorDesc + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Gross Amount:</label>' +
        '</div>' +
        '<div class="col-sm-1 ">' +
        '<input type="text" value="' + (d.Currency == null ? '' : d.Currency) + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-2 p-l-0 p-r-15">' +
        '<input type="text" value="' + pesoAmount + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">Net Amount:</label>' +
        '</div>' +
        '<div class="col-sm-1">' +
        '<input type="text" value="' + (childItems.PesoAmountNet !== null ? d.Currency : '') + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-2 p-l-0 p-r-15">' +
        '<input type="text" value="' + pesoAmountNet + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '</div>' +

        '<div class="row p-t-10">' +
        '<div class="col-sm-1 long-label-wrap">' +
        '<label class="childLabelClass">Purpose of Payment:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<textarea rows="3" class="form-control childTextClass" disabled>' + d.PaymentPurpose + '</textarea>' +
        '</div>' +
        '<div class="col-sm-1 long-label-wrap">' +
        '<label class="childLabelClass">Gross Amount in Words:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<textarea rows="3" class="form-control childTextClass" disabled>' + wordAmount + '</textarea>' +
        '</div>' +
        '<div class="col-sm-1 long-label-wrap">' +
        '<label class="childLabelClass">Net Amount in Words:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<textarea rows="3" class="form-control childTextClass" disabled>' + wordAmountNet + '</textarea>' +
        '</div>' +
        '</div>' +

        '<div class="row p-t-10">' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">SAP Invoice No.:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<input type="text" value="' + sapInvoiceNo + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">SAP Doc. No.:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<input type="text" value="' + sapDocNo + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '<div class="col-sm-1 p-0">' +
        '<label class="childLabelClass">SAP CV No.:</label>' +
        '</div>' +
        '<div class="col-sm-3">' +
        '<input type="text" value="' + sapCheckVoucherNo + '" class="form-control childInputClass" disabled />' +
        '</div>' +
        '</div>' +

        childTabs +

        '</div>';



    return html;
}



function GetStatusUpdate(transactionNo, routeNo) {
    var result = [];

    var exeParams = JSON.stringify({
        transactionNo: transactionNo,
        routeNo: routeNo
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/RCPService.asmx/GetStatusUpdate';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        result = data;
    }
    DoAjax(params);

    return result;

}


function ViewFile(transactionNo, routeNo, requirementDesc, fileType) {

    if (fileType === '.xls' || fileType === '.xlsx') {
        //OpenExcelAttachment(transactionNo, routeNo, requirementDesc, fileType);
        var urlFile = '/RCPAttachments/' + transactionNo + '_' + routeNo + '/' + requirementDesc + fileType;
        PopupCenter(urlFile, transactionNo, 700, 600);
    } else {
        var urlFile = '/RCPAttachments/' + transactionNo + '_' + routeNo + '/' + requirementDesc + fileType;
        PopupCenter(urlFile, transactionNo, 700, 600);
    }
}
function PrintRCPCompleted(transactionNo, routeNo) {
    PopupCenter("/ViewReport.aspx?TransactionNo=" + transactionNo + "&RouteNo=" + routeNo, transactionNo, 700, 600);
}


function ShowStatusUpdate(routeNo, isSelectFromDropdown = false) {
    $('#progressUpdateModal').modal('show');

    var status = '';
    var requestedDate = '';
    var pesoAmount = 0;

    if (isSelectFromDropdown === false) {
        statusPerRouteNo = "";
        $('#divRouteNo').attr('hidden', true);
        if (routeNo > 1) {
            $('#divRouteNo').removeAttr('hidden');
        }

        GetRouteNoList(routeNo);
        $("#routeNo").val(routeNo);

        status = childItems.Status === Draft ? 'Draft'
            : childItems.Status === Disapproved ? 'Disapproved'
                : childItems.Status === Cancelled ? 'Cancelled'
                    : childItems.Status === FullyApproved ? 'Fully Approved' : 'Routed For Approval';


        requestedDate = childItems.RequestedDate == null ? '' : FormatDateToDateAndTime(childItems.RequestedDate);
        pesoAmount = childItems.PesoAmount;

    } else {

        GetRCPPerRouteNo(routeNo);

        status = statusPerRouteNo === Draft ? 'Draft'
            : statusPerRouteNo === Disapproved ? 'Disapproved'
                : statusPerRouteNo === Cancelled ? 'Cancelled'
                    : statusPerRouteNo === FullyApproved ? 'Fully Approved' : 'Routed For Approval';

        requestedDate = FormatDateToDateAndTime(requestedDatePerRouteNo);
        pesoAmount = pesoAmountPerRouteNo;

    }

    GetStatusUpdateList(childItems.TransactionNo, routeNo);

    $('#status').text(status);

    if (childItems.Status !== Draft) {
        $('#requestedDate').text(requestedDate);
        $('#divRequestDate').removeAttr('hidden');
    } else {
        $('#divRequestDate').attr('hidden', true);
    }


    $('#transactionNo').text(childItems.TransactionNo);
}

function GetStatusUpdateRoles(transactionNo, routeNo) {
    var result = [];

    var exeParams = JSON.stringify({
        transactionNo: transactionNo,
        routeNo: routeNo,
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/RCPService.asmx/GetStatusUpdateRoles';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        result = JSON.parse(data);
        if (result.length > 0) {
            $('#statusUpdate').text('');

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


            $('#stepNo3').addClass('without-after-element');
            //$('#stepNo4').addClass('without-after-element');
            //$('#stepNo8').addClass('without-after-element');
            //$('#stepNo12').addClass('without-after-element');
        }
    }
    DoAjax(params);





}

$('#routeNo').on('change', function () {
    var selectedRouteNo = $('#routeNo').val();
    ShowStatusUpdate(selectedRouteNo, true);
});



function GetStatusUpdateList(transactionNo, routeNo) {
    $('#tblStatusUpdateList tbody').text('');
    var exeParams = JSON.stringify({
        transactionNo: transactionNo,
        routeNo: routeNo,
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/RCPService.asmx/GetStatusUpdateList';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        data = JSON.parse(data);
        var table = $('#tblStatusUpdateList tbody');

        for (i = 0; i < data.length; i++) {

            var businessDate = data[i].BusinessDate === null ? '' : FormatDateToDateAndTime(DateFormatNumber(data[i].BusinessDate));
            if (data[i].Status === '000002' && data[i].RoleId !== 1) {
                businessDate = '';
            }

            var remarks = data[i].Remarks === null ? '' : data[i].Remarks;
            var name = data[i].Name === null ? '' : data[i].Name;
            var status = data[i].StatusDesc === null ? '' : data[i].StatusDesc;
            tr = $('<tr/>');
            tr.append("<td class='text-center' style='text-align:center'>  " + data[i].RoleDesc + "</td>");
            tr.append("<td >" + name + "</td>");
            tr.append("<td >" + status + "</td>");
            tr.append("<td >" + businessDate + "</td>");
            tr.append("<td style='word-wrap: break-word; padding: 2px 10px;'>" + remarks + "</td>");
            table.append(tr);

        }

        if ($('#tblStatusUpdateList tbody tr:first').find('td').eq(2).text() === "For Approval") {
            $('#tblStatusUpdateList tbody tr:first').find('td').eq(2).text("Routed For Approval");
        }
        GetStatusUpdateRoles(childItems.TransactionNo, routeNo);
    }
    DoAjax(params);


}
function GetRouteNoList(routeNo) {
    $("#routeNo").text('');

    for (i = 0; i < routeNo; i++) {
        var a = i + 1;
        var route = new Option(a, a);
        $("#routeNo").append(route);
    }
}
function GetRCPPerRouteNo(routeNo) {

    var exeParams = JSON.stringify({
        transactionNo: childItems.TransactionNo,
        routeNo: routeNo,
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/RCPService.asmx/GetRCPPerRouteNo';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        var result = JSON.parse(data);

        if (result[0].RequestedDate !== null) {
            requestedDatePerRouteNo = FormatDateToDateAndTime(DateFormatNumber(result[0].RequestedDate));
        }

        statusPerRouteNo = result[0].Status;
        pesoAmountPerRouteNo = result[0].PesoAmount;
    }
    DoAjax(params);


}


function GetGLAcountFromChildItem() {

    var exeParams = JSON.stringify({
        transactionNo: childItems.TransactionNo,
        routeNo: childItems.RouteNo,
        companyCode: childItems.CompanyName
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/RCPService.asmx/GetGLAccountFromParent';
    params['successCallbackFunction'] = function (data) {

        childItems.GLAccounts = JSON.parse(data);
    }
    params['data'] = exeParams;
    DoAjax(params);

}

function GetAttachmentFromParent() {

    var exeParams = JSON.stringify({
        transactionNo: childItems.TransactionNo,
        routeNo: childItems.RouteNo
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/DataBindService.asmx/GetAttachmentFromParent';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function (data) {
        childItems.Attachments = JSON.parse(data);
    }
    DoAjax(params);

}
function GetUserFilterDetermination(status) {

    var exeParams = JSON.stringify({
        status: status,
        userName: uz.UserName
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/UserService.asmx/GetUserFilterDetermination';
    params['successCallbackFunction'] = function (data) {
        g_currFilterList = JSON.parse(data);

        function cb(start, end) {

            $('#dataRange span').html('&nbsp;' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            if (g_currentFilterDesc !== '') {
                UpdateUserFilterDetermination(g_currentFilterDesc, FormatDateMMDDYYYYSlash(start._d), FormatDateMMDDYYYYSlash(end._d))
                g_currentFilterDesc = '';
            }
            var defDept = uz.BMAS_DepartmentId.toString();
            if (uz.BMAS_HasSuperUserAccess !== 'True') {

                if (defDept.includes(',')) {
                    defDept = defDept.substring(0, defDept.indexOf(","));
                }
            } else {
                defDept = '0';
            }

            g_filterDateFrom = FormatDateMMDDYYYYSlash(start._d);
            g_filterDateTo = FormatDateMMDDYYYYSlash(end._d);

            GenerateDataTable(status, defDept);

            $('.filterList').remove();
            if (status === 'Reports') {
                var filterHtml = '<div class="row p-b-10 filterList">' +
                    '<div class="col-sm-3 p-0">' +
                    '<label>Department:</label>' +
                    '<select class="form-select" style="padding: 4px; padding-left: 15px" id="deptName"></select>' +
                    '</div>' +
                    + '</div>';
                $(filterHtml).insertAfter($(".header-buttons"));
                GetDepartmentFiltering();
                $('#deptName').val(defDept);
                $('#deptName').on('change', function () {
                    GenerateDataTable('Reports', this.value);
                });
            }
        }
        var goLiveMoment = moment();
        var dateRangeGoLiveFrom = new Date(g_goLiveDate);//new Date(new Date(DateFormatNumber(g_goLiveDate)));
        var goLiveDateRangeFrom = moment(dateRangeGoLiveFrom);
        var goLiveDate = goLiveMoment.set(goLiveDateRangeFrom.toObject());

        var start;
        var end;

        if (g_currFilterList.length > 0) {
            if (g_currFilterList[0].IsCustomDateRange === false) {
                switch (g_currFilterList[0].FilterId) {

                    case 1: //This Month
                        start = moment().startOf('month');
                        end = moment().endOf('month');
                        break;
                    case 2: //Last Month
                        start = moment().subtract(1, 'month').startOf('month');
                        end = moment().subtract(1, 'month').endOf('month');
                    case 3: //last 60 days
                        start = moment().subtract(59, 'days');
                        end = moment();
                    case 4: //last 365 days
                        start = moment().subtract(364, 'days');
                        end = moment();
                        break;
                    case 5: //All
                        start = goLiveDate;
                        end = moment();
                        break;
                    default:
                        break;
                }
            } else {
                var dateFromMoment = moment();
                var dateToMoment = moment();
                var dateRangeFrom = new Date(new Date(DateFormatNumber(g_currFilterList[0].DateRangeFrom)));
                var momentDateRangeFrom = moment(dateRangeFrom);
                var dateRangeTo = new Date(new Date(DateFormatNumber(g_currFilterList[0].DateRangeTo)));
                var momentDateRangeTo = moment(dateRangeTo);
                start = dateFromMoment.set(momentDateRangeFrom.toObject());
                end = dateToMoment.set(momentDateRangeTo.toObject());

                g_filterDateFrom = FormatDateMMDDYYYYSlash(start._d);
                g_filterDateTo = FormatDateMMDDYYYYSlash(end._d);
            }


            $('#dataRange').daterangepicker({
                startDate: start,
                endDate: end,
                ranges: {
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Last 60 Days': [moment().subtract(59, 'days'), moment()],
                    'Last 365 Days': [moment().subtract(364, 'days'), moment()],
                    'All Data': [goLiveDate, moment()]
                },
                onSelect: function (dateText) {
                    console.log("Selected date: " + dateText + "; input's current value: " + this.value);
                }
            }, cb)

        } else {
            var dateFromMoment = moment();
            var dateRangeFrom = new Date(g_goLiveDate);
            var momentDateRangeFrom = moment(dateRangeFrom);
            start = dateFromMoment.set(momentDateRangeFrom.toObject());

            end = moment();
            g_filterDateFrom = FormatDateMMDDYYYYSlash(start._d);
            g_filterDateTo = FormatDateMMDDYYYYSlash(end._d);

            $('#dataRange').daterangepicker({
                startDate: start,
                endDate: end,
                ranges: {
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Last 60 Days': [moment().subtract(29, 'days'), moment()],
                    'Last 365 Days': [moment().subtract(364, 'days'), moment()],
                    'All Data': [goLiveDate, moment()]
                }
            }, cb)
        }
        debugger;
        cb(start, end);
    }
    params['data'] = exeParams;
    DoAjax(params);

}

function UpdateUserFilterDetermination(filterValueDesc, dateRangeFrom, dateRangeTo) {

    var exeParams = JSON.stringify({
        userName: uz.UserName,
        filterValueDesc: filterValueDesc,
        dateRangeFrom: dateRangeFrom,
        dateRangeTo: dateRangeTo,
        status: g_currentStatus
    });

    var params = $.extend({}, doAjax_params_default);
    params['url'] = 'Services/UserService.asmx/UpdateUserFilterDetermination';
    params['data'] = exeParams;
    params['successCallbackFunction'] = function () {

    }
    DoAjax(params);

}