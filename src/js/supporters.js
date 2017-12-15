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
  $("#disclosureInfotList").load("disclosureInfotList.html");
  $("#tenantList").load("tenantList.html");
});

// load personal data and show modal window
function openEditModal(name) {
  $("#editModal").load("personalData.html #modal-edit_" + name, function(response){
    $('#modal-edit_' + name).modal('show');
  });
}

// when select file
$(document).on('change', ':file', function() {
  var input = $(this),
  // delete file path
  fileName = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  document.getElementById('fileName').innerHTML = "<strong>" + fileName + "</strong>";

  if(fileName){
    if(fileName.match(/.*\.csv/)){
      document.getElementById('uploadButton').style.display = "";
      document.getElementById('errorMessage').style.display = "none";
    }else{
      document.getElementById('uploadButton').style.display = "none";
      document.getElementById('errorMessage').style.display = "";
    }
  }else{
    document.getElementById('uploadButton').style.display = "none";
    document.getElementById('errorMessage').style.display = "none";
  }
});

function showConfirm() {
  $('#modal-confirm').modal('show');
}

function submitFile() {
  var fileName = document.getElementById('fileName').innerHTML;

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
