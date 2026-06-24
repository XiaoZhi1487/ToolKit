// Tool :: Number Base Converter
(function () {
  var id = "number-base";
  var title = "Number Base Converter";
  var icon = "\ud83d\udd22";
  var category = "Converter";
  var description = "Convert numbers between binary, octal, decimal, and hexadecimal";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("common.input") + "</label>" +
        "<div class=\"flex-row\">" +
        "  <select id=\"nbFrom\" style=\"width:120px\">" +
        "    <option value=\"2\">" + __("tool.number-base.binary") + " (2)</option>" +
        "    <option value=\"8\">" + __("tool.number-base.octal") + " (8)</option>" +
        "    <option value=\"10\" selected>" + __("tool.number-base.decimal") + " (10)</option>" +
        "    <option value=\"16\">" + __("tool.number-base.hexadecimal") + " (16)</option>" +
        "  </select>" +
        "  <input type=\"text\" id=\"nbInput\" value=\"255\" style=\"flex:1\">" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"nbConvertBtn\">" + __("common.convert") + "</button>" +
        "<div class=\"grid-2\">" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.number-base.binary") + "</div>" +
        "    <div style=\"word-break:break-all;font-family:var(--font-mono);font-size:0.8125rem\" id=\"nbBin\">-</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.number-base.octal") + "</div>" +
        "    <div style=\"font-family:var(--font-mono);font-size:0.8125rem\" id=\"nbOct\">-</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.number-base.decimal") + "</div>" +
        "    <div style=\"font-family:var(--font-mono);font-size:0.8125rem\" id=\"nbDec\">-</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.number-base.hexadecimal") + "</div>" +
        "    <div style=\"font-family:var(--font-mono);font-size:0.8125rem;text-transform:uppercase\" id=\"nbHex\">-</div>" +
        "  </div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("nbInput");
      var from = document.getElementById("nbFrom");
      var bin = document.getElementById("nbBin");
      var oct = document.getElementById("nbOct");
      var dec = document.getElementById("nbDec");
      var hex = document.getElementById("nbHex");
      var btn = document.getElementById("nbConvertBtn");

      function convert() {
        try {
          var base = parseInt(from.value);
          var val = parseInt(input.value, base);
          if (isNaN(val)) { bin.textContent = oct.textContent = dec.textContent = hex.textContent = __("tool.number-base.invalid"); return; }
          bin.textContent = val.toString(2);
          oct.textContent = val.toString(8);
          dec.textContent = val.toString(10);
          hex.textContent = val.toString(16).toUpperCase();
        } catch (e) {
          bin.textContent = oct.textContent = dec.textContent = hex.textContent = __("tool.number-base.error");
        }
      }

      btn.addEventListener("click", convert);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") convert(); });
      convert();
    },
    destroy: function () {}
  };
})();
