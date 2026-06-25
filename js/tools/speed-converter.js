// Tool :: Speed Converter
(function () {
  var id = "speed-converter";
  var title = "Speed Converter";
  var icon = "\ud83d\ude80";
  var category = "Converter";
  var description = "Convert between km/h, mph, knots, and Mach";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.speed-converter.value") + "</label>" +
        "<input type=\"number\" id=\"scValue\" class=\"tool-input\" value=\"100\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.speed-converter.from") + "</label><select id=\"scFrom\" class=\"tool-input\"><option value=\"kmh\">" + __("tool.speed-converter.kmh") + "</option><option value=\"mph\">" + __("tool.speed-converter.mph") + "</option><option value=\"knots\">" + __("tool.speed-converter.knots") + "</option><option value=\"mach\">" + __("tool.speed-converter.mach") + "</option></select></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.speed-converter.to") + "</label><select id=\"scTo\" class=\"tool-input\"><option value=\"kmh\">" + __("tool.speed-converter.kmh") + "</option><option value=\"mph\" selected>" + __("tool.speed-converter.mph") + "</option><option value=\"knots\">" + __("tool.speed-converter.knots") + "</option><option value=\"mach\">" + __("tool.speed-converter.mach") + "</option></select></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"scConvertBtn\">" + __("tool.speed-converter.convert") + "</button>" +
        "<label>" + __("tool.speed-converter.result") + "</label>" +
        "<div id=\"scResult\" style=\"font-family:var(--font-mono);font-size:1.25rem;font-weight:600;padding:8px;background:var(--surface-secondary);border-radius:8px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var value = document.getElementById("scValue");
      var from = document.getElementById("scFrom");
      var to = document.getElementById("scTo");
      var convertBtn = document.getElementById("scConvertBtn");
      var result = document.getElementById("scResult");
      // All to km/h first
      var TO_KMH = { kmh:1, mph:1.60934, knots:1.852, mach:1234.8 };
      function convert() {
        var v = parseFloat(value.value) || 0;
        var kmh = v * (TO_KMH[from.value] || 1);
        var out = kmh / (TO_KMH[to.value] || 1);
        result.textContent = out.toFixed(4) + " " + to.value;
      }
      convertBtn.addEventListener("click", convert);
      convert();
    },
    destroy: function () {}
  };
})();