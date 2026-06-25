// Tool :: JWT Decoder
(function () {
  var id = "jwt-decoder";
  var title = "JWT Decoder";
  var icon = "\ud83d\udd10";
  var category = "Developer";
  var description = "Decode JWT tokens and inspect Header & Payload";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label for=\"jwtInput\">" + __('tool.' + id + '.input') + "</label>" +
        "<textarea id=\"jwtInput\" rows=\"3\" placeholder=\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\" spellcheck=\"false\"></textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"jwtDecodeBtn\">" + __('tool.' + id + '.decode') + "</button>" +
        "</div>" +
        "<div id=\"jwtError\" style=\"font-size:0.8125rem;color:var(--red);min-height:20px\"></div>" +
        "<div id=\"jwtResult\">" +
        "  <div style=\"margin-top:12px\">" +
        "    <strong>" + __('tool.' + id + '.header') + "</strong>" +
        "    <button class=\"btn btn-secondary\" id=\"jwtCopyHeaderBtn\" style=\"float:right;padding:2px 8px;font-size:0.75rem\">" + __('tool.' + id + '.copyHeader') + "</button>" +
        "    <div class=\"output-box\" id=\"jwtHeaderOutput\" style=\"white-space:pre;font-family:var(--font-mono);font-size:0.75rem;overflow:auto;max-height:200px;margin-top:4px\"></div>" +
        "  </div>" +
        "  <div style=\"margin-top:12px\">" +
        "    <strong>" + __('tool.' + id + '.payload') + "</strong>" +
        "    <button class=\"btn btn-secondary\" id=\"jwtCopyPayloadBtn\" style=\"float:right;padding:2px 8px;font-size:0.75rem\">" + __('tool.' + id + '.copyPayload') + "</button>" +
        "    <div class=\"output-box\" id=\"jwtPayloadOutput\" style=\"white-space:pre;font-family:var(--font-mono);font-size:0.75rem;overflow:auto;max-height:300px;margin-top:4px\"></div>" +
        "  </div>" +
        "  <div style=\"margin-top:12px\">" +
        "    <strong>" + __('tool.' + id + '.signature') + "</strong>" +
        "    <div class=\"output-box\" id=\"jwtSignatureOutput\" style=\"white-space:pre;font-family:var(--font-mono);font-size:0.75rem;word-break:break-all;margin-top:4px\"></div>" +
        "  </div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("jwtInput");
      var decodeBtn = document.getElementById("jwtDecodeBtn");
      var error = document.getElementById("jwtError");
      var headerOutput = document.getElementById("jwtHeaderOutput");
      var payloadOutput = document.getElementById("jwtPayloadOutput");
      var signatureOutput = document.getElementById("jwtSignatureOutput");
      var copyHeaderBtn = document.getElementById("jwtCopyHeaderBtn");
      var copyPayloadBtn = document.getElementById("jwtCopyPayloadBtn");

      function base64UrlDecode(str) {
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4 !== 0) str += "=";
        try {
          return decodeURIComponent(atob(str).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(""));
        } catch (e) {
          return atob(str);
        }
      }

      function decode() {
        error.textContent = "";
        var token = input.value.trim();
        if (!token) {
          error.textContent = "❌ " + __('tool.' + id + '.invalid');
          headerOutput.textContent = "";
          payloadOutput.textContent = "";
          signatureOutput.textContent = "";
          return;
        }
        var parts = token.split(".");
        if (parts.length !== 3) {
          error.textContent = "❌ " + __('tool.' + id + '.invalid');
          headerOutput.textContent = "";
          payloadOutput.textContent = "";
          signatureOutput.textContent = "";
          return;
        }
        try {
          var headerJson = JSON.parse(base64UrlDecode(parts[0]));
          var payloadJson = JSON.parse(base64UrlDecode(parts[1]));
          headerOutput.textContent = JSON.stringify(headerJson, null, 2);
          payloadOutput.textContent = JSON.stringify(payloadJson, null, 2);
          signatureOutput.textContent = parts[2];
        } catch (e) {
          error.textContent = "❌ " + __('tool.' + id + '.invalid');
          headerOutput.textContent = "";
          payloadOutput.textContent = "";
          signatureOutput.textContent = "";
        }
      }

      decodeBtn.addEventListener("click", decode);
      copyHeaderBtn.addEventListener("click", function () {
        if (headerOutput.textContent) copyToClipboard(headerOutput.textContent);
      });
      copyPayloadBtn.addEventListener("click", function () {
        if (payloadOutput.textContent) copyToClipboard(payloadOutput.textContent);
      });
      input.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") decode();
      });
    },
    destroy: function () {}
  };
})();