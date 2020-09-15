$("#alert-error").hide();
$("#token-copiado").hide();
chrome.storage.sync.get(null, function ({ url, username, password, clientId }) {
  $("#url").val(url);
  $("#username").val(username);
  $("#password").val(password);
  $("#clientId").val(clientId);
});

async function getToken(url, username, password, clientId) {
  var result;
  try {
    result = $.ajax({
      url: url,
      contentType: "application/json",
      dataType: "json",
      headers: {
        username: username,
        password: password,
        client_id: clientId,
      },
    });
  } catch (error) {
    result.success = false;
  }

  return result;
}

function handleGenerate(e) {
  $("#alert-error").hide();
  $("#token-copiado").hide();
  var url = $("#url").val();
  var username = $("#username").val();
  var password = $("#password").val();
  var clientId = $("#clientId").val();

  chrome.storage.sync.set({ url, username, password, clientId }, function () {
    getToken(url, username, password, clientId).then(function (result) {
      if (result.success) {
        $("#token").val(result.data.token.accessToken);
      } else {
        $("#alert-error").show();
      }
    });
  });
}

function handleTokenClick() {
  var copyText = document.getElementById("token");
  if (copyText.value != "") {
    copyText.select();
    document.execCommand("copy");

    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }

    $("#token-copiado").show();
    $("#token-copiado").fadeOut(2000);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  $("#button-generate").on("click", handleGenerate);
  $("#token").on("click", handleTokenClick);
});
