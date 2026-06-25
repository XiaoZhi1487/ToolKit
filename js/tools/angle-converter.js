// Tool :: Angle Converter
(function () {
  var id = "angle-converter";
  var title = "Angle Converter";
  var icon = "\u2220";
  var category = "Converter";
  var description = "Convert between degrees, radians, and gradians";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.angle-converter.value") + "</label>" +
        "<input type=\"number\" id=\"acValue\" class=\"tool-input\" value=\"180\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.angle-converter.from") + "</label><select id=\"acFrom\" class=\"tool-input\"><option value=\"deg\">" + __("tool.angle-converter.degrees") + "</option><option value=\"rad\">" + __("tool.angle-converter.radians") + "</option><option value=\"grad\">" + __("tool.angle-converter.gradians") + "</option></select></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.angle-converter.to") + "</label><select id=\"acTo\" class=\"tool-input\"><option value=\"deg\">" + __("tool.angle-converter.degrees") + "</option><option value=\"rad\">" + __("tool.angle-converter.radians") + "</option><option value=\"grad\">" + __("tool.angle-converter.gradians") + "</option></select></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"acConvertBtn\">" + __("tool.angle-converter.convert") + "</button>" +
        "<label>" + __("tool.angle-converter.result") + "</label>" +
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
      function convert() {
        var v = parseFloat(value.value) || 0;
        var f = from.value, t = to.value;
        if (f === "deg") { /* keep as deg */ }
        else if (f === "rad") v = v * 180 / Math.PI;
        else if (f === "grad") v = v * 0.9;
        if (t === "deg") { /* keep */ }
        else if (t === "rad") v = v * Math.PI / 180;
        else if (t === "grad") v = v / 0.9;
        result.textContent = v.toFixed(6) + " " + t;
      }
      convertBtn.addEventListener("click", convert);
      convert();
    },
    destroy: function () {}
  };
})();