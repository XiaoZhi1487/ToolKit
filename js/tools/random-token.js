// Tool :: Random Token Generator
(function () {
  var id = "random-token";
  var title = "Random Token Generator";
  var icon = "\ud83c\udfaf";
  var category = "Security";
  var description = "Generate secure random tokens and keys";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:8px;flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:80px\"><label style=\"font-size:0.75rem\">" + __("tool.random-token.format") + "</label><select id=\"rtFormat\" class=\"tool-input\"><option value=\"hex\">" + __("tool.random-token.hex") + "</option><option value=\"base64\">" + __("tool.random-token.base64") + "</option><option value=\"alphanumeric\">" + __("tool.random-token.alphanumeric") + "</option></select></div>" +
        "  <div style=\"flex:0 0 80px\"><label style=\"font-size:0.75rem\">" + __("tool.random-token.length") + "</label><input type=\"number\" id=\"rtLength\" class=\"tool-input\" value=\"32\" min=\"8\" max=\"256\"></div>" +
        "  <div style=\"flex:0 0 80px\"><label style=\"font-size:0.75rem\">" + __("tool.random-token.count") + "</label><input type=\"number\" id=\"rtCount\" class=\"tool-input\" value=\"1\" min=\"1\" max=\"100\"></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"rtGenerateBtn\">" + __("tool.random-token.generate") + "</button>" +
        "<div id=\"rtOutput\" style=\"font-family:var(--font-mono);font-size:0.8125rem;word-break:break-all\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"rtCopyBtn\">" + __("tool.random-token.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var format = document.getElementById("rtFormat");
      var length = document.getElementById("rtLength");
      var count = document.getElementById("rtCount");
      var generateBtn = document.getElementById("rtGenerateBtn");
      var output = document.getElementById("rtOutput");
      var copyBtn = document.getElementById("rtCopyBtn");
      function generate() {
        var len = parseInt(length.value) || 32;
        var num = parseInt(count.value) || 1;
        var fmt = format.value;
        var tokens = [];
        var arr = new Uint8Array(len);
        for (var t = 0; t < num; t++) {
          crypto.getRandomValues(arr);
          var token = "";
          if (fmt === "hex") {
            token = Array.from(arr).map(function(b){return ("0" + b.toString(16)).slice(-2);}).join("");
          } else if (fmt === "base64") {
            token = btoa(String.fromCharCode.apply(null, arr)).replace(/=/g, "");
          } else {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < len; i++) token += chars[arr[i] % chars.length];
          }
          tokens.push(token);
        }
        output.innerHTML = tokens.join("<br>");
        output._text = tokens.join("\n");
      }
      generateBtn.addEventListener("click", generate);
      copyBtn.addEventListener("click", function() { if (output._text) copyToClipboard(output._text); });
      generate();
    },
    destroy: function () {}
  };
})();