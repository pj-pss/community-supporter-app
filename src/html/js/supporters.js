const TYPE = {
  INFO: 0,
  EVENT: 1
}

const SEX = {
  ALL: 0,
  MALE: 1,
  FEMALE: 2
}

const AGE = {
  ALL: 0,
  OVER_EIGHTY: 1,
  SEVENTY: 2,
  SIXTY: 3,
  UNDER_FIFTY: 4
}

Object.freeze(TYPE);
Object.freeze(SEX);
Object.freeze(AGE);

const APP_URL = "https://demo.personium.io/app-fst-community-user/";
const APP_BOX_NAME = 'io_personium_demo_app-fst-community-user';
const ORGANIZATION_CELL_URL = 'https://demo.personium.io/fst-community-organization/'

getEngineEndPoint = function () {
  return Common.getAppCellUrl() + "__/html/Engine/getAppAuthToken";
};

additionalCallback = function () {
  Common.setIdleTime();
  getArticleList();
}

getNamesapces = function () {
  return ['common', 'glossary'];
};

var inputImage;
var getImage;
var debug_token;

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

function openInfoCreate(){
  $("#modal-infoEditor").load("infoEditor.html #modal-infoEditor", null, function(){
    initInfoEdit();

    getImage = null;
    $('#saveArticleButton').attr('onclick', "saveArticle()");
    $('#modal-infoEditor').modal('show');
  });
}

function openInfoEdit(id){
  $("#modal-infoEditor").load("infoEditor.html #modal-infoEditor", null, function(){
    initInfoEdit();
    getArticleDetail(id);
    var deleteButton = $('<button></button>')
                          .text('削除').addClass('btn').addClass('btn-danger')
                          .attr('onclick', "showDeleteArticleConfirm('" + id + "')");
    $('#modal-infoEditor .modal-footer').append(deleteButton);
    $('#saveArticleButton').attr('onclick', "saveArticle('" + id + "')");

    $('#modal-infoEditor').modal('show');
  });
}

function initInfoEdit(){
  // set input value
  $('#info').val(TYPE.INFO);
  $('#event').val(TYPE.EVENT);

  var i = 1;
  for(var key in SEX){
    $('#editorSex option:nth-child(' + i + ')').val(SEX[key]);
    i++;
  }
  i = 1;
  for(var key in AGE) {
    $('#editorAge option:nth-child(' + i + ')').val(AGE[key]);
    i++;
  }

  // set date picker
  $('#datepicker .date').datepicker({
      language: 'ja',
      format: "yyyy/mm/dd (D)",
      autoclose: true,
      todayHighlight: true,
      startDate: Date()
  });

  // click radio button
  $('#modal-infoEditor input[name="articleType"]:radio').on('change', function () {
    var val = $(this).val();
    if (parseInt(val) == TYPE.INFO) {
      $("#modal-infoEditor .venue .editorItem").removeClass('must');
    } else {
      $("#modal-infoEditor .venue .editorItem").addClass('must');
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
      $('#inputFileImg').val('');
      $('#fileNameImg').html('');
      return;
    }
    showFileFormErrorMessage('errorMessageImg', false);
    $('#clearImgButton')[0].style.display = '';

    // preview
    var reader = new FileReader();
    reader.onload = function() {
      var img_src = $('<img>').attr('src', reader.result).addClass('thumbnail');
      inputImage = reader.result;
      $('#infoThumbnail').html(img_src);
    }
    reader.readAsDataURL(file);
  });

  // If it does not exist, the parent window can not be scrolled.
  $('#modal-preview').on('hidden.bs.modal', function () {
    $('body').addClass('modal-open');
  });
  $('#modal-confirm-delete').on('hidden.bs.modal', function () {
    $('body').addClass('modal-open');
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
  $('#inputFileCsv').val('');
  document.getElementById('fileNameCsv').innerHTML = "";
}

function showFileFormButton(clear, upload){
  document.getElementById('clearButton').style.display = clear ? "" : "none";
  document.getElementById('uploadButton').style.display = upload ? "" : "none";
}

function showFileFormErrorMessage(id, errorMessage){
  document.getElementById(id).style.display = errorMessage ? "" : "none";
}

function showinfoEditorAlert() {
  // If it does not exist, the parent window can not be scrolled.
  $('#modal-infoEditor-alert').on('hidden.bs.modal', function () {
    $('body').addClass('modal-open');
  });

  $('#modal-infoEditor-alert').modal('show');
}

function showInfoPreview() {
  $("#modal-preview").load("infoPreview.html", function(){
    var article = validateArticle();

    if(article.errMsg.length > 0){
      $('#articleError').html('');
      for(i in article.errMsg) {
        $('<li></li>').append(article.errMsg[i]).appendTo('#articleError');
      }
      showinfoEditorAlert();
      return;
    }

    if(article.startDate && article.endDate) {
      var term = article.startDate + ' ' + article.startTime + ' ~ ' + (article.endDate == article.startDate ? '' : article.endDate) + ' ' + article.endTime;
    }

    link = $('<a></a>').attr('href', article.url);
    link.text(article.url);

    var venue = article.venue ? '開催場所: ' + article.venue : '';
    if(!venue) {
      $('#modal-preview .term')[0].style.display = 'none';
    }

    var img = $('<img>').attr('src', article.previewImg).addClass('thumbnail');

    $('#modal-preview .title').html(article.title);
    $('#modal-preview .url').html(link);
    $('#modal-preview .venue').html(venue);
    $('#modal-preview .date').html(term);
    $('#modal-preview .text').html(article.text);
    $('#modal-preview .img').html(img);

    $('#modal-preview').modal('show');
  });
}

function clearInputImg() {
  showFileFormErrorMessage('errorMessageImg', false);
  $('#inputFileImg').val('');
  $('#fileNameImg').empty();
  $('#clearImgButton')[0].style.display = 'none';
  $('#infoThumbnail').empty();
  getImage = null;
}

/**
 * validate article input and return input object
 * @return input object and error message list
 */
function validateArticle() {
  var type = $('#modal-infoEditor input[name="articleType"]:checked').val();
  var title = $('#editorTitle').val();
  var url = $('#editorUrl').val();
  var venue = $('#editorVenue').val();
  var text = $('#editor').val();
  var age = $('#editorAge').val();
  var sex = $('#editorSex').val();
  var img = $('#inputFileImg').prop('files')[0];
  var startDate = $('#infoStartDate').val();
  var startTime = $('#infoStartTime').val();
  var endDate = $('#infoEndDate').val();
  var endTime = $('#infoEndTime').val();
  var errMsg = [];

  // required items
  if (!(title && text && startDate && endDate && startTime && endTime)) {
    errMsg.push('<span class="must"></span> は必須項目です');
  } else {
    switch (parseInt(type)) {
      case TYPE.INFO:
        break;

      case TYPE.EVENT:
        if(!venue){
          errMsg.push('<span class="must"></span> は必須項目です');
        }
        break;

      default:
        errMsg.push('記事区分が不正です');
        break;

    }
  }

    // check startDate is before endDate
    var start = moment(startDate + startTime);
    var end = moment(endDate + endTime);
    if(start > end) {
      errMsg.push('終了日時は開始日時の後に設定してください');
    }

  // check url
  pUrl = $.url(url);
  if(url) {
    if(!(pUrl.attr('protocol').match(/^(https?|ftp)$/) && pUrl.attr('host'))) {
      errMsg.push('正しいURLを入力してください');
    } else {
      var labels = pUrl.attr('host').split('.');
      for(var label of labels){
        if( !label.match(/^([a-zA-Z0-9\-])+$/) || label.match(/(^-)|(-$)/) ) {
          errMsg.push('正しいURLを入力してください');
          break;
        }
      }
    }
  }

  // check drop down list
  if( isNaN(type + age + sex) ||
      type < 0 || age < 0 || sex < 0 ||
      Object.keys(TYPE).length < type || Object.keys(AGE).length < age || Object.keys(SEX).length < sex) {
    errMsg.push('不正な値です');
  }


  // set image
  if(img) {
    img = inputImage;

    var image = new Image();
    image.src = img;

    // resize
    var ratio = image.height / image.width;
    var width = 300;
    var height = width * ratio;

    var cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    var ctx = cvs.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
    previewImg = cvs.toDataURL('image/jpeg');

  } else {
    if(getImage) {
      previewImg = getImage;
    } else {
      var cvs = document.createElement('canvas');
      cvs.height = cvs.width = 300;
      var ctx = cvs.getContext('2d');
      jdenticon.drawIcon(ctx, title, cvs.height);
      previewImg = cvs.toDataURL('image/jpeg');
    }
  }
  img = dataURLtoBlob(previewImg);

  return {
    'type' : type,
    'title' : title,
    'startDate' : startDate,
    'startTime' : startTime,
    'endDate' : endDate,
    'endTime' : endTime,
    'url' : url,
    'venue' : venue,
    'text' : text,
    'img' : img,
    'previewImg' : previewImg,
    'age' : age,
    'sex' : sex,
    'errMsg' : errMsg
  }
}

function saveArticle(editId) {
  callArticleFunction(function(token) {
    var article = validateArticle();

    if(article.errMsg.length > 0){
      $('#articleError').html('');
      for(i in article.errMsg) {
        $('<li></li>').append(article.errMsg[i]).appendTo('#articleError');
      }
      showinfoEditorAlert();
      return;
    }

    var base = 'https://demo.personium.io';
    var cell = 'fst-community-organization';
    var box = 'app-fst-community-user';
    var oData = 'test_article';
    var entityType = 'provide_information';

    var err = [];

    // save text
    var saveText = function(){
      var method = 'POST';
      var url = base + '/' + cell + '/' + box + '/' + oData + '/' + entityType;
      if(editId){
        method = 'PUT';
        url += "('" + editId + "')";
      }

      return $.ajax({
        type : method,
        url : url,
        headers : {
          'Authorization': 'Bearer ' + token
        },
        data : JSON.stringify({
          'type' : article.type,
          'title' : article.title,
          'start_date' : article.startDate,
          'start_time' : article.startTime,
          'end_date' : article.endDate,
          'end_time' : article.endTime,
          'url' : article.url,
          'venue' : article.venue,
          'detail' : article.text,
          'post_place' : 'みんなの掲示板',
          'target_age' : article.age,
          'target_sex' : article.sex
          // ,'update_user_id' : user_id
        })
      })
      .then(
        function(res) {
          return editId || res;
        },
        function(XMLHttpRequest, textStatus, errorThrown) {
          err.push(XMLHttpRequest.status + ' ' + textStatus + ' ' + errorThrown);
        }
      );
    };

    // save img
    var saveImg = function(res){
      var DAV = 'test_article_image';
      var id = res.d ? res.d.results.__id : res;

      return $.ajax({
        type : 'PUT',
        url : base + '/' + cell + '/' + box + '/' + DAV + '/' + id,
        processData: false,
        headers : {
          'Authorization': 'Bearer ' + token,
          'Content-Type' : 'image/jpeg'
        },
        data : article.img
      }).then(
        function(res) {
          return res
        },
        function(XMLHttpRequest, textStatus, errorThrown) {
          err.push(XMLHttpRequest.status + ' ' + textStatus + ' ' + errorThrown);

          // delete text
          if (!editId){
            $.ajax({
              type : 'DELETE',
              url : base + '/' + cell + '/' + box + '/' + oData + '/' + entityType + "('" + id + "')",
              headers : {
                'Authorization': 'Bearer ' + token
              }
            })
            .fail(function(XMLHttpRequest, textStatus, errorThrown){
              alert('delete failed');
            });
          }

          return Promise.reject();
        }
      )
    }

    saveText().then(saveImg)
    .fail(function() {
      alert('記事の保存に失敗しました\n\n' + err.join('\n'));
    })
    .done(function() {
      alert('記事の保存が完了しました');
      $("#modal-infoEditor").modal('hide');
      getArticleList();
    });
  }, editId);
}

function dataURLtoBlob(dataURL) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURL.split(',')[1]);

  // write the bytes of the string to an ArrayBuffer
  var len = byteString.length;
  var arr = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      arr[i] = byteString.charCodeAt(i);
  }

  return new Blob([arr], {type: 'image/jpeg'});
}


function getArticleList() {

  callArticleFunction(function(token) {
    var base = 'https://demo.personium.io';
    var cell = 'fst-community-organization';
    var box = 'app-fst-community-user';
    var oData = 'test_article';
    var entityType = 'provide_information';

    $('#infoList').empty();
    $.ajax({
        type: "GET",
        url : base + '/' + cell + '/' + box + '/' + oData + '/' + entityType,
        headers: {
            "Authorization": "Bearer " + token,
            "Accept" : "application/json"
        }
    }).done(function(data) {
        var list = [];
        for(result of data.d.results){
          // format datetime (yyyy/mm/dd hh:mm:ss)
          var dateTime = new Date(parseInt(result.__updated.substr(6)));
          var date =  dateTime.getFullYear() + '/' +
                      ('0' + (dateTime.getMonth() + 1)).slice(-2) + '/' +
                      ('0' + (dateTime.getDate())).slice(-2);
          var time =  ('0' + dateTime.getHours()).slice(-2) + ':' +
                      ('0' + dateTime.getMinutes()).slice(-2) + ':' +
                      ('0' + dateTime.getSeconds()).slice(-2);
          var row = '<tr><td>' + date + ' ' + time +
                    '</td><td>' + result.post_place +
                    '</td><td class="flushleft">' +
                    '<a href="javascript:openInfoEdit(\'' + result.__id + '\')">' + result.title +
                    '</a></td><td><a href="javascript:dummyFunction(\'' + result.__id + '\')">-' +
                    '</a></td><td><a href="javascript:dummyFunction(\'' + result.__id + '\')">-' +
                    '</a></td></tr>';

            list.push(row);
        }
        $('#infoList').html(list.join(''));
    });
  });
}


function getArticleDetail(id) {

  callArticleFunction(function(token) {
    var base = 'https://demo.personium.io';
    var cell = 'fst-community-organization';
    var box = 'app-fst-community-user';
    var oData = 'test_article';
    var entityType = 'provide_information';
    var DAV = 'test_article_image';

    var err = [];

    $.when(
      // get text
      $.ajax({
        type: 'GET',
        url : base + '/' + cell + '/' + box + '/' + oData + '/' + entityType + "('" + id + "')",
        headers: {
          'Authorization': 'Bearer ' + token,
            'Accept' : 'application/json'
        },
        success: function(res){
          return res;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          err.push(XMLHttpRequest.status + ' ' + textStatus + ' ' + errorThrown);
        }
      }),

      // get image
      $.ajax({
        type: 'GET',
        url : base + '/' + cell + '/' + box + '/' + DAV + '/' + id,
        dataType: 'binary',
        processData: false,
        responseType: 'blob',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        success: function(res){
          return res;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          err.push(XMLHttpRequest.status + ' ' + textStatus + ' ' + errorThrown);
        }
      })
    )
    .done(function(text, image) {
      var article = text[0].d.results;
      $('#modal-infoEditor input[name="articleType"]').val([article.type]);
      $('#editorTitle').val(article.title);
      $('#infoStartDate').val(article.start_date);
      $('#infoStartTime').val(article.start_time);
      $('#infoEndDate').val(article.end_date);
      $('#infoEndTime').val(article.end_time);
      $('#editorUrl').val(article.url);
      $('#editorVenue').val(article.venue);
      $('#editor').val(article.detail);
      $('#editorAge').val(article.target_age);
      $('#editorSex').val(article.target_sex);
      $("#modal-infoEditor .selectDate .editorItem").addClass('must');
      $("#modal-infoEditor .venue .editorItem").addClass('must');

      var reader = new FileReader();
      reader.onloadend = $.proxy(function(event) {
          var binary = '';
              var bytes = new Uint8Array(event.currentTarget.result);
              var len = bytes.byteLength;
              for (var i = 0; i < len; i++) {
                  binary += String.fromCharCode(bytes[i]);
              }
          window.btoa(binary);
          getImage = "data:image/jpg;base64," + btoa(binary);
          var img_src = $('<img>').attr('src', getImage).addClass('thumbnail');
          $('#infoThumbnail').html(img_src);
      }, this);
      reader.readAsArrayBuffer(image[0]);
      $('#clearImgButton')[0].style.display = '';

    })
    .fail(function() {
      alert('記事の取得に失敗しました\n\n' + err.join('\n'));
    });
  }, id);
}

function showDeleteArticleConfirm(id) {
  $('#deleteArticle').attr('onclick', "deleteArticle('" + id + "')");
  $('#modal-confirm-delete').modal('show');
}

function deleteArticle(id) {

  callArticleFunction(function(token) {
    var base = 'https://demo.personium.io';
    var cell = 'fst-community-organization';
    var box = 'app-fst-community-user';
    var oData = 'test_article';
    var entityType = 'provide_information';
    var DAV = 'test_article_image';

    var err = [];

    var deleteImage = function(){
      return $.ajax({
        type: 'DELETE',
        url : base + '/' + cell + '/' + box + '/' + DAV + '/' + id,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(
        function(res) {
          return res;
        },
        function(XMLHttpRequest, textStatus, errorThrown) {
          err.push(XMLHttpRequest.status + ' ' + textStatus + ' ' + errorThrown);
          return Promise.reject();
        }
      );
    }

    var deleteText = function() {
      return $.ajax({
        type: 'DELETE',
        url : base + '/' + cell + '/' + box + '/' + oData + '/' + entityType + "('" + id + "')",
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(
        function(res) {
          return res;
        },
        function(XMLHttpRequest, textStatus, errorThrown) {
          err.push(XMLHttpRequest.status + ' ' + textStatus + ' ' + errorThrown);

          // save image if delete text failed
          var img = dataURLtoBlob(getImage);
          $.ajax({
            type : 'PUT',
            url : base + '/' + cell + '/' + box + '/' + DAV + '/' + id,
            processData: false,
            headers : {
              'Authorization': 'Bearer ' + token,
              'Content-Type' : 'image/jpeg'
            },
            data : img
          })
          .fail(function() {
            alert('rollback error');
          })

          return Promise.reject();
        }
      );
    }


    deleteImage().then(deleteText)
    .done(function() {
      alert('記事の削除が完了しました');
      $("#modal-infoEditor").modal('hide');
      getArticleList();
    })
    .fail(function() {
      alert('記事の削除に失敗しました\n\n' + err.join('\n'));
    });
  }, id);
}

function callArticleFunction(callback, id) {
  if(Common.getCellUrl() == ORGANIZATION_CELL_URL) {
    callback(Common.getToken(), id);
  } else {
    $.when(Common.getTranscellToken(ORGANIZATION_CELL_URL), Common.getAppAuthToken(ORGANIZATION_CELL_URL))
      .done(function (result1, result2) {
        let tempTCAT = result1[0].access_token; // Transcell Access Token
        let tempAAAT = result2[0].access_token; // App Authentication Access Token
        Common.perpareToCellInfo(ORGANIZATION_CELL_URL, tempTCAT, tempAAAT, function (cellUrl, boxUrl, token) {
          callback(token, id);
        });
      })
      .fail(function () {
        alert('failed to get token');
      });
  }
}
