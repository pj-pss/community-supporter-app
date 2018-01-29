// function ID currently displayed
var nowViewFunction = "proviedInfoList";
// switch the screen to be displayed
function view(functionId) {
  $("#" + nowViewFunction).addClass('hidden');
  $("#" + functionId).removeClass('hidden');
  nowViewFunction = functionId;

  $('.side-nav').find('.current').removeClass('current');
  $('#menu_' + functionId).addClass('current');
}

// load html
$(function() {
  $("#proviedInfoList").load("proviedInfoList.html");
  $("#operationHistory").load("operationHistory.html");
  $("#disclosureInfotList").load("disclosureInfotList.html" , function(){
    // when select file
    $('#inputFileCsv').on('change', function() {
    // $(document).on('change', ':file', function() {
      var input = $(this),
      // delete file path
      fileName = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      $('#fileNameCsv').html(fileName);

      // show or hide: error message, clear button, upload button
      if(fileName){
        if(fileName.match(/.*\.csv/)){
          showFileFormButton(true, true);
          showFileFormErrorMessage('errorMessageCsv', false);
        }else{
          showFileFormButton(true, false);
          showFileFormErrorMessage('errorMessageCsv', true);
        }
      }else{
        showFileFormButton(false, false);
        showFileFormErrorMessage('errorMessageCsv', false);
      }
    });
  });
  $("#tenantList").load("tenantList.html");
});

function openInfoEdit(id){
  $("#modal-infoEditor").load("infoEditor.html #modal-infoEditor_" + id, null, function(){
    // Set up wisywig editor
    $("#editor").jqte();

    // Set up date picker
    $("#infoDatepicker").datepicker({
      format: "yyyy/mm/dd",
      autoclose: true,
      todayHighlight: true,
    }).on({
      changeDate: function(e) {
        var selected_date = e["date"];
        $("#infoYear").val(selected_date.getFullYear());
        $("#infoMonth").val(selected_date.getMonth() + 1);
        $("#infoDay").val(selected_date.getDate());
      }
    })

    $(function() {
      // select upload file
      $('#inputFileImg').on('change', function() {
        var file = $(this).prop('files')[0];
        if(!file) return;

        // show file name
        var input = $(this);
        var fileName = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $('#fileNameImg').html(fileName);


        // allow only image file
        if (! file.type.match('image.*')) {
          // show error message
          showFileFormErrorMessage('errorMessageImg', true);
          $('#infoThumbnail').html('');
          return;
        }
        showFileFormErrorMessage('errorMessageImg', false);

        // preview
        var reader = new FileReader();
        reader.onload = function() {
          var img_src = $('<img>').attr('src', reader.result).addClass('thumbnail');
          $('#infoThumbnail').html(img_src);
        }
        reader.readAsDataURL(file);
      });
    });

    $('#modal-infoEditor').modal('show');
  });
}

function openComment(id){
  $("#modal-situationAggregate").load("comment.html #modal-situationAggregate_" + id, null, function(){

    $(function() {
      // pop over action
      $("[data-toggle=popover]").popover({
        trigger: 'hover',
        html: true,
      });
    });

    // If it does not exist, the parent window can not be scrolled.
    $('#modal-confirm-delete').on('hidden.bs.modal', function () {
      $('body').addClass('modal-open');
    });

    $('#modal-situationAggregate').modal('show');
  });
}

// load personal data and show modal window
function openEditModal(name) {
  $("#editModal").load("personalData.html #modal-edit_" + name, function(response){
    $('#modal-edit_' + name).modal('show');
  });
}

function showConfirm() {
  $('#modal-confirm').modal('show');
}

function submitFile() {
  var fileName = document.getElementById('fileNameCsv').innerHTML;

  $('#modal-loading').modal('show');

  // show loading modal for 3sec
  setTimeout(function(){
    $('#modal-loading').modal('hide');

    // check only file type
    if(fileName.match(/.*\.csv/)){
      $('#modal-success').modal('show');
    }else{
      $('#modal-faild').modal('show');
    }
  },3000);
}

function clearInputFile() {
  showFileFormButton(false, false);
  showFileFormErrorMessage('errorMessageCsv', false);
  $("#inputFile").val("");
  document.getElementById('fileNameCsv').innerHTML = "";
}

function showFileFormButton(clear, upload){
  document.getElementById('clearButton').style.display = clear ? "" : "none";
  document.getElementById('uploadButton').style.display = upload ? "" : "none";
}

function showFileFormErrorMessage(id, errorMessage){
  document.getElementById(id).style.display = errorMessage ? "" : "none";
}

function showDeleteCommentConfirm() {
  $('#modal-confirm-delete').modal('show');
}

function deleteComment(){
  // dummy
  $('#modal-confirm-delete').modal('hide');
}
