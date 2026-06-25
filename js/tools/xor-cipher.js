// Tool :: XOR Cipher
(function () {
  var id = "xor-cipher";
  var title = "XOR Cipher";
  var icon = "\ud83d\udd10";
  var category = "Security";
  var description = "Encrypt or decrypt text using XOR algorithm";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.xor-cipher.input") + "</label>" +
        "<textarea id=\"xcInput\" rows=\"4\" placeholder=\"Hello World\"></textarea>" +
        "<label>" + __("tool.xor-cipher.key") + "</label>" +
        "<input type=\"text\" id=\"xcKey\" class=\"tool-input\" value=\"key\" style=\"font-family:var(--font-mono)\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <button class=\"btn btn-primary\" id=\"xcEncryptBtn\">" + __("tool.xor-cipher.encrypt") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"xcDecryptBtn\">" + __("tool.xor-cipher.decrypt") + "</button>" +
        "</div>" +
        "<label>" + __("tool.xor-cipher.result") + "</label>" +
        "<textarea id=\"xcOutput\" rows=\"3\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"xcCopyBtn\">" + __("tool.xor-cipher.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("xcInput");
      var key = document.getElementById("xcKey");
      var output = document.getElementById("xcOutput");
      var copyBtn = document.getElementById("xcCopyBtn");
      function xorTransform(text, keyStr) {
        var result = "";
        for (var i = 0; i < text.length; i++) {
          var k = keyStr.charCodeAt(i % keyStr.length);
          result += String.fromCharCode(text.charCodeAt(i) ^ k);
        }
        return result;
      }
      document.getElementById("xcEncryptBtn").addEventListener("click", function() {
        var raw = xorTransform(input.value, key.value || " ");
        output.value = btoa(unescape(encodeURIComponent(raw)));
      });
      document.getElementById("xcDecryptBtn").addEventListener("click", function() {
        try {
          var raw = decodeURIComponent(escape(atob(input.value.trim())));
          output.value = xorTransform(raw, key.value || " ");
        } catch(e) {
          output.value = "Error: Invalid Base64 input";
        }
      });
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();