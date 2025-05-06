var tempAttachmentNo = '';
tempAttachmentNo = GetDateTimeNow(new Date());
var no_required_attachment = 0;
var g_ReqIdToRemove = '';
var g_ReqId = '';
var g_budgetMemoNo = '';
var g_status = '';
var g_routeNo = 0;
var g_fakeBrowserId;
$(document).ready(function () {
    GetDepartment();
    GetRequestType();
    GetCategory();
    CustomizeSelect2('subCategory', []);
    $('#s2id_subCategory').children().find('span').eq(0).text('N/A');
    //DisableCustomSelect2('subCategory');

    GetProject();
    //GetCategory();
    $('#currentPageLink').text('Request Form');
    $('#btnRefresh').attr('disabled', true);
    $('#requestedByDesc').val(uz.Name);
    LiveDateTime('requestedDate');
    //GetRequirements();

    //$("#project").text(null);
    //var defValue = new Option('[Select Project]', '0');
    //$("#project").append(defValue);

    //$("#project").attr('disabled', true);

    InputFocusOutMoney('amount');
    InputKeyPressMoneyFormat('amount');


    var budgetMemoNoQString = GetQueryStringValue('BudgetMemoNo');
    var statusQString = GetQueryStringValue('Status');

    if (budgetMemoNoQString !== '') {

        GetModifyDetails(budgetMemoNoQString, statusQString);

    } else {
        $('#btnCancelBudgetMemo').attr('disabled', true);
    }
    GetSubCategory();
    EnableCustomSelect2('subCategory');
    //window.history.pushState({}, document.title, window.location.pathname);
    //$('#status').val('New');
});


$('#btnCancelBudgetMemo').click(function () {
    $('#confirmationCancelBudgetMemo').modal('show');
})

$('#btnYesCancel').click(function () {
    $('#confirmationCancelBudgetMemo').modal('hide');
    $('#preloader').fadeIn();

    setTimeout(function () {
        CancelBudgetMemo();
        $('#preloader').fadeOut();
    }, 200)
})

function CancelBudgetMemo() {

    var params = JSON.stringify({
        budgetMemoNo: g_budgetMemoNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/RequestFormService.asmx/CancelBudgetMemo',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            ShowNotification('success', 'Budget Memo has been successfully cancelled!.');
            ClearAllFields();
            window.history.pushState({}, document.title, window.location.pathname);
        },
        error: function (error) {
            console.log(error);
        }
    });

}


function GetModifyDetails(budgetMemoNo, status) {
    GetSubCategory();
    GetProject();
    $('#preloader').fadeIn();

    setTimeout(function () {
        var params = JSON.stringify({
            budgetMemoNo: budgetMemoNo,
            status: status
        });

        $.ajax({
            async: false,
            type: 'POST',
            url: 'Services/BudgetMemoService.asmx/GetModifyDetails',
            data: params,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                var result = JSON.parse(response.d);

                $('#budgetMemoNo').val(result[0].BudgetMemoNo);
                $('#requestType').val(result[0].RequestTypeId);
                $('#category').val(result[0].CategoryId);
                
                var subCategoryId = result[0].SubCategoryId === null ? '' : result[0].SubCategoryId;
                var subCategoryDesc = result[0].SubCategoryDesc === null ? '' : result[0].SubCategoryDesc;
                subCategoryDesc = subCategoryDesc === '' ? 'N/A' : subCategoryDesc;
                $('#s2id_subCategory').children().find('span').eq(0).text(subCategoryDesc);
                $('#subCategory').val(subCategoryId);
                if (result[0].CategoryId === 1) {
                    EnableCustomSelect2('budgetProject');

                    var projectCode = result[0].ProjectCode === null ? '' : result[0].ProjectCode;
                    var projectDesc = result[0].ProjectDesc === null ? '' : result[0].ProjectDesc;
                    $('#budgetProject').val(projectCode);
                    $('#s2id_budgetProject').children().find('span').eq(0).text(projectCode + ' ' + projectDesc);



               
                } else {
                    //DisableCustomSelect2('subCategory');
                }



                $('#amount').val(NumberWithCommas(result[0].Amount));
                $('#subject').val(result[0].Subject);
                $('#purpose').val(result[0].Purpose);
                g_status = result[0].Status;

                if (g_status === "000004") {
                    $('#btnSave').attr('disabled', true);
                }

                $('#department').val(result[0].DepartmentId);
                $('#department').trigger('change');
                g_routeNo = result[0].RouteNo;
                g_budgetMemoNo = result[0].BudgetMemoNo;
                $('#requestType').trigger('change');

                $('#preloader').fadeOut();

                CheckEveryFileIfSuccessful();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }, 200)

}

$('#btnNew').click(function () {
    window.history.pushState({}, document.title, window.location.pathname);
    location.reload();
})

$('#requestType').on('change', function () {
    var tblRequirements = $('#tblRequirements tbody');
    tblRequirements.text(null);

    if (this.value !== '0') {
        GetRequirements(this.value);
    }
})

function GetRequirements(requestTypeId) {

    var params = JSON.stringify({
        requestTypeId: requestTypeId
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetRequirements',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var result = JSON.parse(response.d);

            var tblRequirements = $('#tblRequirements tbody');
            tblRequirements.text(null);

            for (i = 0; i < result.length; i++) {
                var requirementDesc = result[i].RequirementDesc;

                if (result[i].IsRequired === 1) {
                    requirementDesc = requirementDesc + ' *';
                    no_required_attachment = no_required_attachment + 1;
                }


                var viewFile = 'view' + result[i].RequirementId;
                var removeFile = 'remove' + result[i].RequirementId;
                var fileBrowserId = 'fileBrowser' + result[i].RequirementId;
                var fakeBrowserId = 'fakeBrowser' + result[i].RequirementId;
                var fileBrowser = "<input type='file' accept='.pdf' id='" + fileBrowserId + "' class='form-control'>";
                var reqBtns = ' <button title="Upload File" id="' + fakeBrowserId + '" onclick="document.getElementById(\'' + fileBrowserId + '\').click()" type="button" style="padding: 3px 12px; margin-right:5px" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-upload"></i></button>' +
                    '<button disabled title="View File" id="' + viewFile + '" onclick="ViewFile(\'' + requirementDesc + '\', \'' + fileBrowserId + '\')" type="button" style="padding: 3px 12px; margin-right:5px" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-eye"></i></button>' +
                    '<button disabled title="Remove File" id="' + removeFile + '" onclick="OpenConfirmationRemoveAttachment(\'' + result[i].RequirementId + '\')" type="button" style="padding: 3px 12px;" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-trash-alt"></i></button>';

                tr = $('<tr/>');
                tr.append("<td style='display: none'>" + result[i].RequirementId + "</td>");
                tr.append("<td>" + requirementDesc + "</td>");
                tr.append('<td></td>');
                tr.append('<td style="text-align:center">' + reqBtns + ' </td>');
                tr.append("<td style='display: none'>" + fileBrowser + "</td>");
                tr.append("<td style='display: none'></td>");
                tr.append("<td style='display: none'>" + false + "</td>");
                tblRequirements.append(tr);

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById(fileBrowserId).addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
            }

            var addOthersHtml = '<tr class="OthersAttachmentRow">' +
                '<td></td>' +
                '<td></td>' +
                '<td style="text-align: center"><button title="Add Others" id="btnAddAttachment" type="button" style="padding: 3px 12px;" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-plus-square"></i></button></td>' +
                '</tr > ';
            tblRequirements.append(addOthersHtml);
            $('#btnAddAttachment').click(function () {
                $('#newAttachmentModal').modal('show');
                $('#attachmentDesc').val('');
                $('#errorOtherAttachment').text('');
                $('#fileOthers').val('');
            })

            var budgetMemoNoQString = GetQueryStringValue('BudgetMemoNo');

            if (budgetMemoNoQString !== '') {
                var uploadedAttachment = GetAttachment(budgetMemoNoQString, g_routeNo);

                for (var i = 0; i < uploadedAttachment.length; i++) {

                    $("#tblRequirements tbody tr").each(function () {
                        var reqId = $("#tblRequirements tbody tr").find('td').eq(0).text();


                        if (parseInt(reqId) === uploadedAttachment[i].RequirementId) {


                            $("#tblRequirements tbody tr").find('td').eq(2).text(uploadedAttachment[i].FileName);
                            $("#tblRequirements tbody tr").find('td').eq(3).find('button').eq(1).removeAttr('disabled');
                            $("#tblRequirements tbody tr").find('td').eq(3).find('button').eq(2).removeAttr('disabled');
                            $("#tblRequirements tbody tr").find('td').eq(5).text(uploadedAttachment[i].FileSize);
                            $("#tblRequirements tbody tr").find('td').eq(6).text(false);
                        } else {


                            if (uploadedAttachment[i].OtherAttachmentDesc !== '') {

                                var isAlreadyAdded = false;
                                $("#tblRequirements tbody tr").each(function () {
                                    var requirementDesc = $(this).find('td').eq(1).text();

                                    if (uploadedAttachment[i].OtherAttachmentDesc === requirementDesc) {
                                        isAlreadyAdded = true;
                                    }
                                });

                                if (isAlreadyAdded === true) {
                                    return;
                                }

                                var currentTrLength = $('#tblRequirements tbody tr').length + 100;

                                var fileName = uploadedAttachment[i].FileName;


                                var viewFile = 'view' + currentTrLength;
                                var removeFile = 'remove' + currentTrLength;
                                var fileBrowserId = 'fileBrowser' + currentTrLength;
                                var fakeBrowserId = 'fakeBrowser' + currentTrLength;
                                var fileBrowser = "<input type='file' accept='.pdf' id='" + fileBrowserId + "' class='form-control'>";
                                var reqBtns = ' <button title="Upload File" id="' + fakeBrowserId + '" onclick="document.getElementById(\'' + fileBrowserId + '\').click()" type="button" style="padding: 3px 12px; margin-right:5px" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-upload"></i></button>' +
                                    '<button title="View File" id="' + viewFile + '" onclick="ViewFile(\'' + uploadedAttachment[i].OtherAttachmentDesc + '\', \'' + fileBrowserId + '\')" type="button" style="padding: 3px 12px; margin-right:5px" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-eye"></i></button>' +
                                    '<button title="Remove File" id="' + removeFile + '" onclick="OpenConfirmationRemoveAttachment(\'' + currentTrLength + '\')" type="button" style="padding: 3px 12px;" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-trash-alt"></i></button>';

                                tr = $('<tr/>');
                                tr.append("<td style='display: none'>" + currentTrLength + "</td>");
                                tr.append("<td>" + uploadedAttachment[i].OtherAttachmentDesc + "</td>");
                                tr.append('<td>' + fileName + '</td>');
                                tr.append('<td style="text-align:center">' + reqBtns + ' </td>');
                                tr.append("<td style='display: none'>" + fileBrowser + "</td>");
                                tr.append("<td style='display: none'>" + uploadedAttachment[i].FileSize + "</td>");
                                tr.append("<td style='display: none'>" + true + "</td>");
                                $('#tblRequirements tr.OthersAttachmentRow').before(tr);

                                if (window.File && window.FileReader && window.FileList && window.Blob) {
                                    document.getElementById(fileBrowserId).addEventListener('change', handleFileSelect, false);
                                } else {
                                    alert('The File APIs are not fully supported in this browser.');
                                }
                            }
                        }
                    });
                }

            }

        },
        error: function (error) {
            console.log(error);
        }
    });


}

function CopyFilesFromRoutedDraftBudgetMemo(budgetMemoNo, routeNo) {

    var result = [];
    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo,
        userId: uz.BMAS_UserId,
        tempAttachmentNo: tempAttachmentNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/AttachmentService.asmx/CopyFilesFromRoutedDraftBudgetMemo',
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

function GetAttachment(budgetMemoNo, routeNo) {
    CopyFilesFromRoutedDraftBudgetMemo(budgetMemoNo, g_routeNo);
    var result = [];
    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: routeNo
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/RequestFormService.asmx/GetAttachment',
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

$("#attachmentDesc").bind("paste", function (e) {
    // access the clipboard using the api
    var pastedData = e.originalEvent.clipboardData.getData('text');

    $("#error_sp_msg").remove();

    var ar = /^[0-9A-Za-z ()_.-]*$/;
    var k = e.keyCode;
    if (ar.test(pastedData) == false) {
        $("<span/>", {
            "id": "error_sp_msg",
            "html": "Special characters are not allowed."
        }).insertAfter($(this));
        $("#error_sp_msg").css("color", "red");
        return false;
    }
});


$("#attachmentDesc").keypress(function (e) {
    $("#error_sp_msg").remove();

    var ar = /^[0-9A-Za-z ()_.-]*$/;
    var k = e.keyCode;
    if (ar.test(e.key) == false) {
        $("<span/>", {
            "id": "error_sp_msg",
            "html": "Special characters are not allowed."
        }).insertAfter($(this));
        $("#error_sp_msg").css("color", "red");
        return false;
    }

})

$('#btnOkAddAttachment').click(function () {

    if (handleFileSelectOthers() === false) {
        return false;
    }

    $('#newAttachmentModal').modal('hide');


    var currentTrLength = $('#tblRequirements tbody tr').length + 100;

    g_ReqId = currentTrLength;
    var fakeBrowserId = 'fakeBrowser' + currentTrLength;
    g_fakeBrowserId = fakeBrowserId;

    var str = $('#fileOthers').val();
    var n = str.lastIndexOf('\\');
    var fileName = str.substring(n + 1);

    var requirementDesc = $('#attachmentDesc').val();

    var viewFile = 'view' + currentTrLength;
    var removeFile = 'remove' + currentTrLength;
    var fileBrowserId = 'fileBrowser' + currentTrLength;
    var fakeBrowserId = 'fakeBrowser' + currentTrLength;
    var fileBrowser = "<input type='file' accept='.pdf' id='" + fileBrowserId + "' class='form-control'>";
    var reqBtns = ' <button title="Upload File" id="' + fakeBrowserId + '" onclick="document.getElementById(\'' + fileBrowserId + '\').click()" type="button" style="padding: 3px 12px; margin-right:5px" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-upload"></i></button>' +
        '<button title="View File" id="' + viewFile + '" onclick="ViewFile(\'' + requirementDesc + '\', \'' + fileBrowserId + '\')" type="button" style="padding: 3px 12px; margin-right:5px" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-eye"></i></button>' +
        '<button title="Remove File" id="' + removeFile + '" onclick="OpenConfirmationRemoveAttachment(\'' + currentTrLength + '\')" type="button" style="padding: 3px 12px;" class="btn btn-social-icon btn-outline-twitter"><i class="fa fa-trash-alt"></i></button>';

    tr = $('<tr/>');
    tr.append("<td style='display: none'>" + currentTrLength + "</td>");
    tr.append("<td>" + requirementDesc + "</td>");
    tr.append('<td>' + fileName + '</td>');
    tr.append('<td style="text-align:center">' + reqBtns + ' </td>');
    tr.append("<td style='display: none'>" + fileBrowser + "</td>");
    tr.append("<td style='display: none'>" + othersFileSizeToAdd + "</td>");
    tr.append("<td style='display: none'>" + true + "</td>");
    $('#tblRequirements tr.OthersAttachmentRow').before(tr);

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById(fileBrowserId).addEventListener('change', handleFileSelect, false);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

});

function handleFileSelectOthers() {
    $('#errorOtherAttachment').text(null);

    if ($('#attachmentDesc').val().trim() === '') {
        $('#errorOtherAttachment').append('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Description is required.');
        return false;
    }

    if ($('#fileOthers').val() === '') {
        $('#errorOtherAttachment').append('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Please choose file.');
        return false;
    }

    var isOk = true;

    var requirementDesc = $('#attachmentDesc').val();

    $("#tblRequirements tbody tr").each(function () {

        var existingAttachment = $(this).find('td').eq(1).text().replace(' *', '');
        if (requirementDesc.trim() === existingAttachment) {
            $('#errorOtherAttachment').append('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Attachment description already exist.');
            isOk = false;
        }

    });

    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        isOk = false;
        return;
    }

    input = document.getElementById('fileOthers');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
        isOk = false;
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
        isOk = false;
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
        isOk = false;
    }
    else {
        file = input.files[0];

        if ((file.size / 1048576.0) > 10) {
            ShowNotification('danger', 'The file size cannot exceeds 10MB.');
            $('#newAttachmentModal').modal('hide');
            return false;
        }


        var fileName = file.name;
        var fileType = fileName.substr(fileName.indexOf('.'));

        fileType = fileName.split(/\.(?=[^\.]+$)/);
        fileType = '.' + fileType[1];

        othersFileTypeToAdd = fileType;
        othersFileSizeToAdd = file.size;


        if (isOk === false) {
            return false;
        }

        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsDataURL(file);
    }

    return isOk;
}
var othersFileTypeToAdd = '';
var othersFileSizeToAdd = '';
function receivedText() {

    var requirementDesc = $('#attachmentDesc').val();
    var othersBase64 = fr.result.substring(fr.result.indexOf(",") + 1);

    UploadAttachmentTemp(othersBase64, requirementDesc, othersFileTypeToAdd);
}


function CheckIfSuccessUploadingToTemp(fileName, fileType) {

    var isSuccessUploaded = 0;

    var params = JSON.stringify({
        userId: uz.BMAS_UserId,
        tempAttachmentNo: tempAttachmentNo,
        fileName: fileName,
        fileType: fileType
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/AttachmentService.asmx/CheckIfSuccessUploadingToTemp',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            isSuccessUploaded = response.d;
        },
        error: function (error) {

        }
    });

    return isSuccessUploaded;
}

function CheckEveryFileIfSuccessful() {
    $("#tblRequirements tbody tr").each(function () {

        var requirementDesc = $(this).find('td').eq(1).text().replace(' *', '');
        if (requirementDesc !== '') {
            var checkIfSuccessfullyUploaded = CheckIfSuccessfullyUploaded(requirementDesc);

            var iClassSuccessAndFailed = '';

            if (checkIfSuccessfullyUploaded === 0) {
                iClassSuccessAndFailed = '&nbsp;&nbsp;<i style="color: red" title="Failed to upload file." class="fa fa-exclamation"></i>';
            } else {
                iClassSuccessAndFailed = '&nbsp;&nbsp;<i style="color: #4ec237" title="File successfully uploaded." class="fa fa-check"></i>';
            }

            if ($(this).find('td').eq(2).text().trim() !== '') {
                $(this).find('td').eq(2).append(iClassSuccessAndFailed);
            }
        }
    });
}

function CheckIfSuccessfullyUploaded(fileNameToCheck) {

    var result = 0;

    var params = JSON.stringify({
        userId: uz.BMAS_UserId,
        tempAttachmentNo: tempAttachmentNo,
        fileNameToCheck: fileNameToCheck
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/AttachmentService.asmx/CheckIfSuccessfullyUploaded',
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

var handleFileSelect = function (evt) {

    var reqId = GetNumberFromString(evt.currentTarget.id);
    var files = evt.target.files;
    var file = files[0];

    if ((file.size / 1048576.0) > 10) {
        alert('The file size cannot exceeds 10MB.');
        return;
    }

    var fileName = file.name;
    var fileType = fileName.substr(fileName.indexOf('.'));

    fileType = fileName.split(/\.(?=[^\.]+$)/);
    fileType = '.' + fileType[1];

    var fileBrowserId = 'fileBrowser' + reqId;
    $('#' + fileBrowserId).val('');
    var fakeBrowserId = 'fakeBrowser' + reqId;
    var requirementDesc = $('#' + fakeBrowserId).closest('td').siblings().eq(1).text().trim();

    $('#' + fakeBrowserId).closest('td').siblings().eq(4).text(file.size);

    if (files && file) {
        var reader = new FileReader();

        reader.onload = function (readerEvt) {
            var binaryString = readerEvt.target.result;
            base64String = btoa(binaryString);
            requirementDesc = requirementDesc.replace(' *', '');
            g_fakeBrowserId = fakeBrowserId;
            UploadAttachmentTemp(base64String, requirementDesc, fileType);
        };

        $('#view' + reqId).removeAttr('disabled');
        $('#remove' + reqId).removeAttr('disabled');
        $('#' + fileBrowserId).closest('td').siblings().eq(2).text(fileName);
        reader.readAsBinaryString(file);
    }
};

function OpenConfirmationRemoveAttachment(reqId) {
    g_ReqIdToRemove = reqId;
    $('#confirmRemoveAttachment').modal('show');
}

$('#btnYesRemoveFile').click(function () {

    var requirementDesc = $('#remove' + g_ReqIdToRemove).closest('td').siblings().eq(1).text();
    var fileName = $('#remove' + g_ReqIdToRemove).closest('td').siblings().eq(2).text();

    var fileType = fileName.split(/\.(?=[^\.]+$)/);
    fileType = '.' + fileType[1];

    RemoveAttachmentTemp(requirementDesc, fileType);
})


function RemoveAttachmentTemp(fileName, fileType) {

    if (fileName.includes(' *') === true) {
        no_required_attachment = no_required_attachment + 1;
    }

    fileName = fileName.replace(' *', '');

    var params = JSON.stringify({
        userId: uz.BMAS_UserId,
        tempAttachmentNo: tempAttachmentNo,
        fileName: fileName,
        fileType: fileType
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/AttachmentService.asmx/RemoveAttachmentTemp',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $('#remove' + g_ReqIdToRemove).closest('td').siblings().eq(2).text('');
            $('#remove' + g_ReqIdToRemove).attr('disabled', true);
            $('#view' + g_ReqIdToRemove).attr('disabled', true);
            $('#confirmRemoveAttachment').modal('hide');
            $("html, body").animate({ scrollTop: 0 }, 200);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ViewFile(fileName, fileBrowserId) {
    fileName = fileName.replace(' *', '');
    var tempFolderDate = FormatDateNoSpace(new Date());
    var str = $('#' + fileBrowserId).closest('td').siblings().eq(2).text();
    var fileType = '.' + str.slice(str.lastIndexOf('.') + 1);
    var urlFile = 'BMA_AttachmentTemp/' + tempFolderDate + '/' + uz.BMAS_UserId + '_' + tempAttachmentNo + '/' + fileName + fileType;
    PopupCenter(urlFile.trim(), tempAttachmentNo, 700, 600);
}


function UploadAttachmentTemp(base64String, fileName, fileType) {
    debugger;
    var params = JSON.stringify({
        userId: uz.BMAS_UserId,
        tempAttachmentNo: tempAttachmentNo,
        base64String: base64String,
        fileName: fileName,
        fileType: fileType
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/AttachmentService.asmx/UploadAttachmentTemp',
        data: params,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var isSuccessUploaded = CheckIfSuccessUploadingToTemp(fileName, fileType);

            if (isSuccessUploaded === 1) {
                $('#' + g_fakeBrowserId).closest('td').siblings().eq(2).append('&nbsp;&nbsp;<i style="color: #4ec237" title="File successfully uploaded." class="fa fa-check"></i>')
            } else {
                $('#' + g_fakeBrowserId).closest('td').siblings().eq(2).append('&nbsp;&nbsp;<i style="color: red" title="Failed to upload file." class="fa fa-exclamation"></i>');
            }
        },
        error: function (error) {
            $('#' + g_fakeBrowserId).closest('td').siblings().eq(2).append('&nbsp;&nbsp;<i style="color: red" title="Failed to upload file." class="fa fa-exclamation"></i>');
            console.log(error);
        }
    });
}


function GetRequestType() {

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetRequestType',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var result = JSON.parse(response.d);
            $("#requestType").text(null);
            var defValue = new Option('[Select Request Type]', '0');
            $("#requestType").append(defValue);

            for (i = 0; i < result.length; i++) {
                var resultData = new Option(result[i].RequestTypeDesc, result[i].RequestTypeId);
                $("#requestType").append(resultData);
            }

        },
        error: function (error) {
            console.log(error); alert(error);
        }
    });
}


$('#category').on('change', function () {


    //if (this.value !== '0') {
    //    if (this.value === '1') {
    //        GetSubCategory();
    //    } else {
    //        $('#subCategory').attr('disabled', true);
    //        $("#category").text(null);
    //        var defValue = new Option('[Select Category]', '0');
    //        $("#category").append(defValue);
    //    }
    //} else {
    //    $('#subCategory').attr('disabled', true);
    //    $("#category").text(null);
    //    var defValue = new Option('[Select Category]', '0');
    //    $("#category").append(defValue);
    //}
 
    if (this.value === '1') {
    
        GetProject();
        EnableCustomSelect2('budgetProject');
  
    } else {
       // CustomizeSelect2('subCategory', []);
        $('#s2id_subCategory').children().find('span').eq(0).text('N/A');
        //DisableCustomSelect2('subCategory');

        CustomizeSelect2('budgetProject', []);
        $('#s2id_budgetProject').children().find('span').eq(0).text('[Select Project]');
        DisableCustomSelect2('budgetProject');
    }
});
function GetCategory() {

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetCategory',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var result = JSON.parse(response.d);

            $("#subCategory").text(null);
            var defValue = new Option('[Select Sub-Category]', '0');
            $("#subCategory").append(defValue);

            $("#category").text(null);
            var defValue = new Option('[Select Category]', '0');
            $("#category").append(defValue);

            for (i = 0; i < result.length; i++) {
                var resultData = new Option(result[i].CategoryDesc, result[i].CategoryId);
                $("#category").append(resultData);
            }

        },
        error: function (error) {
            console.log(error); alert(error);
        }
    });
}


function GetSubCategory() {
    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetSubCategory',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var result = JSON.parse(response.d);
            CustomizeSelect2('subCategory', result);

            $('#s2id_subCategory').children().find('span').eq(0).text('N/A');
            $('#subCategory').val('0')
        },
        error: function (error) {
            console.log(error); alert(error);
        }
    });
}


function GetProject() {
    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/MasterDataService.asmx/GetProject',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var result = JSON.parse(response.d);

            CustomizeSelect2('budgetProject', result);
            $('#s2id_budgetProject').children().find('span').eq(0).text('[Select Project]');
            DisableCustomSelect2('budgetProject');
            //for (i = 0; i < result.length; i++) {
            //    var resultData = new Option(result[i].id, result[i].text);
            //    $("#budgetProject").append(resultData);
            //}

        },
        error: function (error) {
            console.log(error); alert(error);
        }
    });
}


function GetDepartment() {

    uz.BMAS_DepartmentId = uz.BMAS_DepartmentId.replace('|', ',').replace('|', ',').replace('|', ',').replace('|', ',').replace('|', ',').replace('|', ',');

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
            debugger;
            departmentsWithPositions = result;
            $("#department").text(null);
            var defValue = new Option('[Select Department]', '0');
            $("#department").append(defValue);

            for (i = 0; i < result.length; i++) {
                var resultData = new Option(result[i].DepartmentName, result[i].DepartmentId);
                $("#department").append(resultData);
            }

            if (result.length > 1) {
                $("#department").removeAttr('disabled');
                $("#department").val('0');
            } else {
                $("#department").attr('disabled', true);
                $('#department').val(uz.BMAS_DepartmentId);
                $('#department').trigger('change');
            }

        },
        error: function (error) {
            console.log(error); alert(error);
        }
    });
}


$("#department").on('change', function () {

    for (var i = 0; i < departmentsWithPositions.length; i++) {

        if (departmentsWithPositions[i].DepartmentId === parseInt(this.value)) {
            loggedDeptId = departmentsWithPositions[i].DepartmentId;
            loggedSupervisorId = departmentsWithPositions[i].SupervisorId;
            loggedDeptHeadId = departmentsWithPositions[i].DepartmentHeadId;
        }
    }
});

//$('#category').on('change', function () {
//    $("#project").text(null);
//    var defValue = new Option('[Select Project]', '0');
//    $("#project").append(defValue);

//    if (this.value !== '0') {
//        if (this.value === '1') {
//            GetProject();
//            $('#project').removeAttr('disabled');
//        } else {
//            $('#project').attr('disabled', true);
//        }
//    }
//});


function InsertBudgetMemo(status) {


    if (status === '000001') {
        $('#confirmationSaveBudgetMemo').modal('hide');
    } else if (status === '000002') {
        $('#confirmationRouteBudgetMemo').modal('hide');
    }

    $('#preloader').fadeIn();

    setTimeout(function () {
        var subCategoryId = $('#subCategory').val() === "" ? 0 : $('#subCategory').val();
        var projectCode = $('#budgetProject').val() === "" ? "" : $('#budgetProject').val();
        var departmentId = parseInt($('#department').val());
        var requestTypeId = parseInt($('#requestType').val());
        var amount = $('#amount').val();

        var project = $('#s2id_budgetProject').children().find('span').eq(0).text();
        var projectDesc = projectCode === "" ? "" : project.substr(project.indexOf(' ') + 1);
        var categoryId = $('#category').val();
        var subCategoryDesc = subCategoryId === 0 ? '' : $('#s2id_subCategory').children().find('span').eq(0).text();
        var subject = $('#subject').val();
        var purpose = $('#purpose').val();

        var createdBy = uz.BMAS_UserId;

        var params = JSON.stringify({
            location: uz.OfficeLocation,
            tempAttachmentNo: tempAttachmentNo,
            departmentId: departmentId,
            requestTypeId: requestTypeId,
            amount: amount,
            projectCode: projectCode,
            projectDesc: projectDesc,
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            subCategoryDesc: subCategoryDesc,
            subject: subject,
            purpose: purpose,
            createdBy: createdBy,
            status: status
        });

        $.ajax({
            async: false,
            type: 'POST',
            url: 'Services/RequestFormService.asmx/InsertBudgetMemo',
            data: params,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {

                var result = JSON.parse(response.d);

                var returnResult = result[0];
                var budgetMemoNo = returnResult.BudgetMemoNo;
                var routeNo = returnResult.RouteNo;

                $("#tblRequirements tbody tr").each(function () {
                    $this = $(this);
                    var reqId = $this.find("td").eq(0).text();
                    var othersAttachmentDesc = $this.find("td").eq(1).text();
                    var fileName = $this.find("td").eq(2).text();
                    var fileSize = $this.find("td").eq(5).text();
                    var isOthers = $this.find("td").eq(6).text();
                    if (fileName !== '') {
                        if (fileName !== '') {
                            InsertAttachment(budgetMemoNo, routeNo, reqId, othersAttachmentDesc, fileName, fileSize, isOthers);
                        }
                    }
                });


                ClearAllFields();

                if (status === '000001') {
                    $('#confirmationSaveBudgetMemo').modal('hide');
                    ShowNotification('success', 'Budget Memo has been successfully created!.');
                } else if (status === '000002') {
                    $('#confirmationRouteBudgetMemo').modal('hide');
                    ShowNotification('success', 'Budget Memo has been successfully routed!.');
                }

                $('#preloader').fadeOut();
                window.history.pushState({}, document.title, window.location.pathname);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }, 200);

}

function ClearAllFields() {

    CustomizeSelect2('subCategory', []);
    $('#s2id_subCategory').children().find('span').eq(0).text('N/A');
    //DisableCustomSelect2('subCategory');


    CustomizeSelect2('budgetProject', []);
    $('#s2id_budgetProject').children().find('span').eq(0).text('[Select Project]');
    DisableCustomSelect2('budgetProject');

    $('#requestType').val('0');
    $('#amount').val('');
    $('#subject').val('');
    $('#purpose').val('');
    $('#tblRequirements tbody tr').text('');
    $('#budgetMemoNo').val('');
    $('#btnCancelBudgetMemo').attr('disabled', true);
    g_routeNo = 0;
    g_budgetMemoNo = '';
}

function InsertAttachment(budgetMemoNo, routeNo, reqId, othersAttachmentDesc, fileName, fileSize, isOthers) {

    var params = JSON.stringify({
        budgetMemoNo: budgetMemoNo,
        routeNo: parseInt(routeNo),
        reqId: reqId,
        othersAttachmentDesc: othersAttachmentDesc,
        fileName: fileName,
        fileSize: fileSize,
        isOthers: isOthers
    });

    $.ajax({
        async: false,
        type: 'POST',
        url: 'Services/RequestFormService.asmx/InsertAttachment',
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


$('#btnSave').click(function () {

    var hasFailedUpload = 0;

    $("#tblRequirements tbody tr").each(function () {
        var value = $(this).find('td').eq(2).find('i').hasClass('fa-exclamation')
        if (value === true) {
            hasFailedUpload = hasFailedUpload + 1;
        }
    });

    if (hasFailedUpload > 0) {
        ShowNotification('danger', 'There are error on the attachments, please re-upload file.');
        return;
    }

    if (ValidateSaving() === false) {
        return;
    }

    $('#confirmationSaveBudgetMemo').modal('show');
})

function ValidateSaving() {
    var canProceed = true;

    if ($('#requestType').val() === '0') {
        ShowNotification('danger', 'Request Type is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#amount').val() === '') {
        ShowNotification('danger', 'Amount is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#subject').val() === '') {
        ShowNotification('danger', 'Subject is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#purpose').val() === '') {
        ShowNotification('danger', 'Subject is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#category').val() === '0') {
        ShowNotification('danger', 'Category is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#category').val() === '1') {
        if ($('#subCategory').val() === '') {
            ShowNotification('danger', 'Sub-Category is required.');
            canProceed = false;
            return canProceed;
        }

        if ($('#budgetProject').val() === '') {
            ShowNotification('danger', 'Project is required.');
            canProceed = false;
            return canProceed;
        }
    }
}

function ValidateRouting() {
    var canProceed = true;





    if ($('#requestType').val() === '0') {
        ShowNotification('danger', 'Request Type is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#amount').val() === '') {
        ShowNotification('danger', 'Amount is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#subject').val() === '') {
        ShowNotification('danger', 'Subject is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#purpose').val() === '') {
        ShowNotification('danger', 'Subject is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#category').val() === '0') {
        ShowNotification('danger', 'Category is required.');
        canProceed = false;
        return canProceed;
    }

    if ($('#category').val() === '1') {
        if ($('#subCategory').val() === '') {
            ShowNotification('danger', 'Sub-Category is required.');
            canProceed = false;
            return canProceed;
        }

        if ($('#budgetProject').val() === '') {
            ShowNotification('danger', 'Project is required.');
            canProceed = false;
            return canProceed;
        }
    }


    var uploadedFileCount = 0;
    var requiredFileCount = 0;
    $("#tblRequirements tbody tr").each(function () {
        $this = $(this);
        var required = $this.find("td").eq(1).text();

        if (required.includes('*')) {
            requiredFileCount = requiredFileCount + 1;

            var fileName = $this.find("td").eq(2).text();

            if (fileName !== '') {
                uploadedFileCount = uploadedFileCount + 1;
            }
        }

    });

    if (requiredFileCount !== uploadedFileCount) {
        ShowNotification('danger', 'Please upload on the required document.');
        canProceed = false;
        return canProceed;
    }



}

$('#btnRoute').click(function () {

    var hasFailedUpload = 0;

    $("#tblRequirements tbody tr").each(function () {
        var value = $(this).find('td').eq(2).find('i').hasClass('fa-exclamation')
        if (value === true) {
            hasFailedUpload = hasFailedUpload + 1;
        }
    });

    if (hasFailedUpload > 0) {
        ShowNotification('danger', 'There are error on the attachments, please re-upload file.');
        return;
    }

    if (ValidateRouting() === false) {
        return;
    }

    $('#confirmationRouteBudgetMemo').modal('show');
})

$('#btnYesRoute').click(function () {

    if (g_budgetMemoNo !== '') {
        UpdateBudgetMemo('000002');
    } else {
        InsertBudgetMemo('000002');
    }
})

$('#btnYesSave').click(function () {

    if (g_budgetMemoNo !== '') {
        UpdateBudgetMemo(g_status);
    } else {
        InsertBudgetMemo('000001');
    }
})


function UpdateBudgetMemo(status) {

    if (status === '000001') {
        $('#confirmationSaveBudgetMemo').modal('hide');
    } else if (status === '000002') {
        $('#confirmationRouteBudgetMemo').modal('hide');
    }

    $('#preloader').fadeIn();

    setTimeout(function () {

        var subCategoryId = $('#subCategory').val() === "" ? 0 : $('#subCategory').val();
        var projectCode = $('#budgetProject').val() === "" ? "" : $('#budgetProject').val();

        var departmentId = $('#department').val();
        var requestTypeId = parseInt($('#requestType').val());
        var amount = $('#amount').val();
        var project = $('#s2id_budgetProject').children().find('span').eq(0).text();
        var projectDesc = projectCode === "" ? "" : project.substr(project.indexOf(' ') + 1);
        var categoryId = $('#category').val();
        var subCategoryDesc = subCategoryId === 0 ? '' : $('#s2id_subCategory').children().find('span').eq(0).text();
        var subject = $('#subject').val();
        var purpose = $('#purpose').val();
        var createdBy = uz.BMAS_UserId;

        var params = JSON.stringify({
            location: uz.OfficeLocation,
            budgetMemoNo: g_budgetMemoNo,
            routeNo: g_routeNo,
            tempAttachmentNo: tempAttachmentNo,
            departmentId: departmentId,
            requestTypeId: requestTypeId,
            amount: amount,
            projectCode: projectCode,
            projectDesc: projectDesc,
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            subCategoryDesc: subCategoryDesc,
            subject: subject,
            purpose: purpose,
            createdBy: createdBy,
            status: status,
            previousStatus: g_status
        });

        $.ajax({
            async: false,
            type: 'POST',
            url: 'Services/RequestFormService.asmx/UpdateBudgetMemo',
            data: params,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {


                var result = JSON.parse(response.d);

                var returnResult = result[0];
                var budgetMemoNo = returnResult.BudgetMemoNo;
                var routeNo = returnResult.RouteNo;

                $("#tblRequirements tbody tr").each(function () {
                    $this = $(this);
                    var reqId = $this.find("td").eq(0).text();
                    var othersAttachmentDesc = $this.find("td").eq(1).text();
                    var fileName = $this.find("td").eq(2).text();
                    var fileSize = $this.find("td").eq(5).text();
                    var isOthers = $this.find("td").eq(6).text();
                    if (fileName !== '') {
                        InsertAttachment(budgetMemoNo, routeNo, reqId, othersAttachmentDesc, fileName, fileSize, isOthers);
                    }
                });

                ClearAllFields();

                if (status === '000001') {
                    $('#confirmationSaveBudgetMemo').modal('hide');

                    if (g_budgetMemoNo !== '') {
                        ShowNotification('success', 'Budget Memo No. ' + g_budgetMemoNo + ' has been successfully updated!.');
                    } else {
                        ShowNotification('success', 'Budget Memo No. ' + g_budgetMemoNo + ' has been successfully created!.');
                    }

                } else if (status === '000002') {
                    $('#confirmationRouteBudgetMemo').modal('hide');
                    ShowNotification('success', 'Budget Memo has been successfully routed!.');
                }

                $('#preloader').fadeOut();
                window.history.pushState({}, document.title, window.location.pathname);
                console.log(result);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }, 200)

}