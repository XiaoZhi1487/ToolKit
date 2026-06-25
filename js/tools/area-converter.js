// Tool :: Area Converter
(function () {
  var id = "area-converter";
  var title = "Area Converter";
  var icon = "\ud83d\udccf";
  var category = "Converter";
  var description = "Convert between square meters, km\u00b2, hectares, acres, etc.";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.area-converter.value") + "</label>" +
        "<input type=\"number\" id=\"acValue\" class=\"tool-input\" value=\"100\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.area-converter.from") + "</label><select id=\"acFrom\" class=\"tool-input\"><option value=\"sqm\">" + __("tool.area-converter.sqm") + "</option><option value=\"sqkm\">" + __("tool.area-converter.sqkm") + "</option><option value=\"ha\">" + __("tool.area-converter.ha") + "</option><option value=\"acre\">" + __("tool.area-converter.acre") + "</option><option value=\"sqft\">" + __("tool.area-converter.sqft") + "</option><option value=\"sqin\">" + __("tool.area-converter.sqin") + "</option></select></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.area-converter.to") + "</label><select id=\"acTo\" class=\"tool-input\"><option value=\"sqm\">" + __("tool.area-converter.sqm") + "</option><option value=\"sqkm\">" + __("tool.area-converter.sqkm") + "</option><option value=\"ha\" selected>" + __("tool.area-converter.ha") + "</option><option value=\"acre\">" + __("tool.area-converter.acre") + "</option><option value=\"sqft\">" + __("tool.area-converter.sqft") + "</option><option value=\"sqin\">" + __("tool.area-converter.sqin") + "</option></select></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"acConvertBtn\">" + __("tool.area-converter.convert") + "</button>" +
        "<label>" + __("tool.area-converter.result") + "</label>" +
        "<div id=\"acResult\" style=\"font-family:var(--font-mono);font-size:1.25rem;font-weight:600;padding:8px;background:var(--surface-secondary);border-radius:8px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var value = document.getElementById("acValue");
      var from = document.getElementById("acFrom");
      var to = document.getElementById("acTo");
      var convertBtn = document.getElementById("acConvertBtn");
      var result = document.getElementById("acResult");
      // All to sqm
      var TO_SQM = { sqm:1, sqkm:1000000, ha:10000, acre:4046.86, sqft:0.092903, sqin:0.00064516 };
      function convert() {
        var v = parseFloat(value.value) || 0;
        var sqm = v * (TO_SQM[from.value] || 1);
        var out = sqm / (TO_SQM[to.value] || 1);
        result.textContent = out.toFixed(4) + " " + to.value;
      }
      convertBtn.addEventListener("click", convert);
      convert();
    },
    destroy: function () {}
  };
})();