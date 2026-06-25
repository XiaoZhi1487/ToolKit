// Tool :: Byte Converter
(function () {
  var id = "byte-converter";
  var title = "Byte Converter";
  var icon = "\ud83d\udcc0";
  var category = "Converter";
  var description = "Convert between B, KB, MB, GB, TB units";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.byte-converter.value") + "</label>" +
        "<input type=\"number\" id=\"bcValue\" class=\"tool-input\" value=\"1024\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.byte-converter.from") + "</label><select id=\"bcFrom\" class=\"tool-input\"><option value=\"B\">B</option><option value=\"KB\" selected>KB</option><option value=\"MB\">MB</option><option value=\"GB\">GB</option><option value=\"TB\">TB</option></select></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.byte-converter.to") + "</label><select id=\"bcTo\" class=\"tool-input\"><option value=\"B\">B</option><option value=\"KB\">KB</option><option value=\"MB\" selected>MB</option><option value=\"GB\">GB</option><option value=\"TB\">TB</option></select></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"bcConvertBtn\">" + __("tool.byte-converter.convert") + "</button>" +
        "<label>" + __("tool.byte-converter.result") + "</label>" +
        "<div id=\"bcResult\" style=\"font-family:var(--font-mono);font-size:1.25rem;font-weight:600;padding:8px;background:var(--surface-secondary);border-radius:8px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var value = document.getElementById("bcValue");
      var from = document.getElementById("bcFrom");
      var to = document.getElementById("bcTo");
      var convertBtn = document.getElementById("bcConvertBtn");
      var result = document.getElementById("bcResult");
      var UNITS = { "B":1, "KB":1024, "MB":1048576, "GB":1073741824, "TB":1099511627776 };
      function convert() {
        var v = parseFloat(value.value) || 0;
        var bytes = v * (UNITS[from.value] || 1);
        var out = bytes / (UNITS[to.value] || 1);
        result.textContent = out.toFixed(4) + " " + to.value;
      }
      convertBtn.addEventListener("click", convert);
      convert();
    },
    destroy: function () {}
  };
})();