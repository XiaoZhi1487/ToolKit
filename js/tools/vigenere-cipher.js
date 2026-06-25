// Tool :: Vigenere Cipher
(function () {
  var id = "vigenere-cipher";
  var title = "Vigenere Cipher";
  var icon = "\ud83d\udd12";
  var category = "Security";
  var description = "Encrypt or decrypt text using Vigenere cipher";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.vigenere-cipher.input") + "</label>" +
        "<textarea id=\"vcInput\" rows=\"4\" placeholder=\"Hello World\"></textarea>" +
        "<label>" + __("tool.vigenere-cipher.key") + "</label>" +
        "<input type=\"text\" id=\"vcKey\" class=\"tool-input\" value=\"KEY\" style=\"font-family:var(--font-mono)\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <button class=\"btn btn-primary\" id=\"vcEncryptBtn\">" + __("tool.vigenere-cipher.encrypt") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"vcDecryptBtn\">" + __("tool.vigenere-cipher.decrypt") + "</button>" +
        "</div>" +
        "<label>" + __("tool.vigenere-cipher.result") + "</label>" +
        "<textarea id=\"vcOutput\" rows=\"4\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"vcCopyBtn\">" + __("tool.vigenere-cipher.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("vcInput");
      var key = document.getElementById("vcKey");
      var output = document.getElementById("vcOutput");
      var copyBtn = document.getElementById("vcCopyBtn");
      function vigenere(text, keyStr, decrypt) {
        var result = "";
        var ki = 0;
        for (var i = 0; i < text.length; i++) {
          var ch = text.charAt(i);
          if (ch >= 'a' && ch <= 'z') {
            var k = keyStr.charCodeAt(ki % keyStr.length) - 65;
            if (k < 0 || k > 25) k = 0;
            var code = ch.charCodeAt(0) - 97;
            if (decrypt) code = (code - k + 26) % 26;
            else code = (code + k) % 26;
            result += String.fromCharCode(code + 97);
            ki++;
          } else if (ch >= 'A' && ch <= 'Z') {
            var k = keyStr.charCodeAt(ki % keyStr.length) - 65;
            if (k < 0 || k > 25) k = 0;
            var code = ch.charCodeAt(0) - 65;
            if (decrypt) code = (code - k + 26) % 26;
            else code = (code + k) % 26;
            result += String.fromCharCode(code + 65);
            ki++;
          } else {
            result += ch;
          }
        }
        return result;
      }
      document.getElementById("vcEncryptBtn").addEventListener("click", function() {
        output.value = vigenere(input.value, (key.value || "").toUpperCase(), false);
      });
      document.getElementById("vcDecryptBtn").addEventListener("click", function() {
        output.value = vigenere(input.value, (key.value || "").toUpperCase(), true);
      });
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();