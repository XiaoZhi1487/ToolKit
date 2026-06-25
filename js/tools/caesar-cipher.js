// Tool :: Caesar Cipher
(function () {
  var id = "caesar-cipher";
  var title = "Caesar Cipher";
  var icon = "\ud83d\udd20";
  var category = "Security";
  var description = "Encrypt or decrypt text using Caesar cipher";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.caesar-cipher.input") + "</label>" +
        "<textarea id=\"ccInput\" rows=\"4\" placeholder=\"Hello World\"></textarea>" +
        "<div class=\"flex-row\" style=\"gap:8px;align-items:end\">" +
        "  <div style=\"flex:0 0 100px\"><label style=\"font-size:0.75rem\">" + __("tool.caesar-cipher.shift") + "</label><input type=\"number\" id=\"ccShift\" class=\"tool-input\" value=\"3\" min=\"-26\" max=\"26\"></div>" +
        "  <button class=\"btn btn-primary\" id=\"ccEncryptBtn\">" + __("tool.caesar-cipher.encrypt") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"ccDecryptBtn\">" + __("tool.caesar-cipher.decrypt") + "</button>" +
        "</div>" +
        "<label>" + __("tool.caesar-cipher.result") + "</label>" +
        "<textarea id=\"ccOutput\" rows=\"4\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"ccCopyBtn\">" + __("tool.caesar-cipher.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("ccInput");
      var shift = document.getElementById("ccShift");
      var output = document.getElementById("ccOutput");
      var copyBtn = document.getElementById("ccCopyBtn");
      function transform(text, s) {
        var result = "";
        for (var i = 0; i < text.length; i++) {
          var ch = text.charAt(i);
          if (ch >= 'a' && ch <= 'z') {
            var code = ((ch.charCodeAt(0) - 97 + s) % 26 + 26) % 26;
            result += String.fromCharCode(code + 97);
          } else if (ch >= 'A' && ch <= 'Z') {
            var code = ((ch.charCodeAt(0) - 65 + s) % 26 + 26) % 26;
            result += String.fromCharCode(code + 65);
          } else {
            result += ch;
          }
        }
        return result;
      }
      document.getElementById("ccEncryptBtn").addEventListener("click", function() {
        output.value = transform(input.value, parseInt(shift.value) || 0);
      });
      document.getElementById("ccDecryptBtn").addEventListener("click", function() {
        output.value = transform(input.value, -(parseInt(shift.value) || 0));
      });
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();