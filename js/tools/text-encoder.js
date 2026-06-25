// Tool :: Text Encoding
(function () {
  var id = "text-encoder";
  var title = "Text Encoding";
  var icon = "\ud83d\udd24";
  var category = "Security";
  var description = "Convert text to binary, hex, decimal, and octal formats";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.text-encoder.input") + "</label>" +
        "<textarea id=\"teInput\" rows=\"4\" placeholder=\"Hello\"></textarea>" +
        "<label>" + __("tool.text-encoder.mode") + "</label>" +
        "<select id=\"teMode\" class=\"tool-input\">" +
        "  <option value=\"toBinary\">" + __("tool.text-encoder.toBinary") + "</option>" +
        "  <option value=\"toHex\">" + __("tool.text-encoder.toHex") + "</option>" +
        "  <option value=\"toDecimal\">" + __("tool.text-encoder.toDecimal") + "</option>" +
        "  <option value=\"toOctal\">" + __("tool.text-encoder.toOctal") + "</option>" +
        "  <option value=\"fromBinary\">" + __("tool.text-encoder.fromBinary") + "</option>" +
        "  <option value=\"fromHex\">" + __("tool.text-encoder.fromHex") + "</option>" +
        "</select>" +
        "<button class=\"btn btn-primary\" id=\"teConvertBtn\">" + __("tool.text-encoder.convert") + "</button>" +
        "<label>" + __("tool.text-encoder.result") + "</label>" +
        "<textarea id=\"teOutput\" rows=\"4\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"teCopyBtn\">" + __("tool.text-encoder.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("teInput");
      var mode = document.getElementById("teMode");
      var convertBtn = document.getElementById("teConvertBtn");
      var output = document.getElementById("teOutput");
      var copyBtn = document.getElementById("teCopyBtn");
      function convert() {
        var text = input.value;
        var m = mode.value;
        try {
          switch (m) {
            case "toBinary":
              output.value = Array.from(text).map(function(c){return c.charCodeAt(0).toString(2).padStart(8,"0");}).join(" ");
              break;
            case "toHex":
              output.value = Array.from(text).map(function(c){return c.charCodeAt(0).toString(16).toUpperCase();}).join(" ");
              break;
            case "toDecimal":
              output.value = Array.from(text).map(function(c){return c.charCodeAt(0);}).join(" ");
              break;
            case "toOctal":
              output.value = Array.from(text).map(function(c){return c.charCodeAt(0).toString(8);}).join(" ");
              break;
            case "fromBinary":
              output.value = text.split(/\s+/).filter(function(s){return s;}).map(function(s){return String.fromCharCode(parseInt(s,2));}).join("");
              break;
            case "fromHex":
              output.value = text.split(/\s+/).filter(function(s){return s;}).map(function(s){return String.fromCharCode(parseInt(s,16));}).join("");
              break;
          }
        } catch(e) {
          output.value = "Error: " + e.message;
        }
      }
      convertBtn.addEventListener("click", convert);
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();