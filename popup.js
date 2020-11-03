$("#alert-error").hide();
$("#token-copiado").hide();
chrome.storage.sync.get(null, function ({ url, username, password, clientId }) {
  $("#url").val(url);
  $("#username").val(username);
  $("#password").val(password);
  $("#clientId").val(clientId);
});

function setGenerateButtonDisabled(isDisabled) {
  $("#button-generate").prop("disabled", isDisabled);
}

function setGenerateButtonLoading(isLoading) {
  $("#button-generate span").prop("hidden", !isLoading);
  setGenerateButtonDisabled(isLoading);
}

function clearErrors() {
  $("#error-area").empty();
}

function showError(error) {
  clearErrors();
  $("#error-area")
    .append(`<span style="padding: 8px;position:absolute" class="alert alert-danger" id="alert-error" role="alert">
  ${error}
</span>`);
}

function handleGenerate(e) {
  clearErrors();
  setGenerateButtonLoading(true);
  $("#token-copiado").hide();
  var url = $("#url").val();
  var username = $("#username").val();
  var password = $("#password").val();
  var clientId = $("#clientId").val();

  chrome.storage.sync.set({ url, username, password, clientId }, function () {
    result = $.ajax({
      url: url,
      contentType: "application/json",
      dataType: "json",
      headers: {
        username: username,
        password: password,
        client_id: clientId,
      },
      error: function (result, textStatus) {
        let textMessage =
          textStatus == "timeout"
            ? "Timeout of 10 seconds exceeded"
            : "Failed to generate token. Please check your connection.";
        showError(textMessage);
        setGenerateButtonLoading(false);
      },
      success: function (result, textStatus) {
        if (result.success) {
          $("#token").val(result.data.token.accessToken);
        } else {
          showError("Failed to generate token. Please check the parameters.");
        }
        setGenerateButtonLoading(false);
      },
      timeout: 10000,
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
