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

    $(function() {
      // set date picker
      $('#datepicker .date').datepicker({
          format: "yyyy/mm/dd",
          language: 'ja',
          autoclose: true,
          todayHighlight: true,
          startDate: Date()
      });

      // click radio button
      $('#modal-infoEditor input[name="articleType"]:radio').on('change', function() {
        var val = $(this).val();
        if(val == "info"){
          $("#modal-infoEditor .date").prop('disabled', true);
          $("#modal-infoEditor .time").prop('disabled', true);
          $("#modal-infoEditor .selectDate .editorItem").removeClass('must');
        } else {
          $("#modal-infoEditor .date").prop('disabled', false);
          $("#modal-infoEditor .time").prop('disabled', false);
          $("#modal-infoEditor .selectDate .editorItem").addClass('must');
        }
      });

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

    // If it does not exist, the parent window can not be scrolled.
    $('#modal-preview').on('hidden.bs.modal', function () {
      $('body').addClass('modal-open');
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
  $("#editModal").load("personalData.html #modal-edit_" + name, function(){
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

function showInfoPreview() {
  $("#modal-preview").load("infoPreview.html", function(){
    var title = $('#editorTitle').val();
    var startDate = $('#infoStartDate').val();
    var startTime = $('#infoStartTime').val();
    var endDate = $('#infoEndDate').val();
    var endTime = $('#infoEndTime').val();
    var url = $('#editorUrl').val();
    var text = $('#editor').val();
    var img = $('#infoThumbnail').html();

    if(!(title && url && text && img)) {
      alert('入力項目に誤りがあります');
      return;
    }

    link = $('<a></a>').attr('href', url);
    link.text(url);

    if(startDate && endDate) {
      var term = startDate + ' ' + startTime + ' ~ ' + endDate + ' ' + endTime;
    }

    $('#modal-preview .title').html(title);
    $('#modal-preview .url').html(link);
    $('#modal-preview .term').html(term);
    $('#modal-preview .text').html(text);
    $('#modal-preview .img').html(img);

    $('#modal-preview').modal('show');
  });
}
