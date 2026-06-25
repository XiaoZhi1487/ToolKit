// Tool :: Pressure Converter
(function () {
  var id = "pressure-converter";
  var title = "Pressure Converter";
  var icon = "\ud83c\udf00";
  var category = "Converter";
  var description = "Convert between Pa, kPa, bar, psi, atm";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.pressure-converter.value") + "</label>" +
        "<input type=\"number\" id=\"pcValue\" class=\"tool-input\" value=\"101325\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.pressure-converter.from") + "</label><select id=\"pcFrom\" class=\"tool-input\"><option value=\"pa\">" + __("tool.pressure-converter.pa") + "</option><option value=\"kpa\">" + __("tool.pressure-converter.kpa") + "</option><option value=\"bar\">" + __("tool.pressure-converter.bar") + "</option><option value=\"psi\">" + __("tool.pressure-converter.psi") + "</option><option value=\"atm\">" + __("tool.pressure-converter.atm") + "</option></select></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.pressure-converter.to") + "</label><select id=\"pcTo\" class=\"tool-input\"><option value=\"pa\">" + __("tool.pressure-converter.pa") + "</option><option value=\"kpa\" selected>" + __("tool.pressure-converter.kpa") + "</option><option value=\"bar\">" + __("tool.pressure-converter.bar") + "</option><option value=\"psi\">" + __("tool.pressure-converter.psi") + "</option><option value=\"atm\">" + __("tool.pressure-converter.atm") + "</option></select></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"pcConvertBtn\">" + __("tool.pressure-converter.convert") + "</button>" +
        "<label>" + __("tool.pressure-converter.result") + "</label>" +
        "<div id=\"pcResult\" style=\"font-family:var(--font-mono);font-size:1.25rem;font-weight:600;padding:8px;background:var(--surface-secondary);border-radius:8px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var value = document.getElementById("pcValue");
      var from = document.getElementById("pcFrom");
      var to = document.getElementById("pcTo");
      var convertBtn = document.getElementById("pcConvertBtn");
      var result = document.getElementById("pcResult");
      // All to Pa
      var TO_PA = { pa:1, kpa:1000, bar:100000, psi:6894.76, atm:101325 };
      function convert() {
        var v = parseFloat(value.value) || 0;
        var pa = v * (TO_PA[from.value] || 1);
        var out = pa / (TO_PA[to.value] || 1);
        result.textContent = out.toFixed(4) + " " + to.value;
      }
      convertBtn.addEventListener("click", convert);
      convert();
    },
    destroy: function () {}
  };
})();