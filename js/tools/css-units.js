// Tool :: CSS Units Converter
(function () {
  var id = "css-units";
  var title = "CSS Units Converter";
  var icon = "\ud83d\udccf";
  var category = "Developer";
  var description = "Convert between px, rem, em, vw, vh, and %";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "  <div>" +
        "    <label>" + __('tool.' + id + '.from') + "</label>" +
        "    <select id=\"cssFromUnit\" class=\"form-input\">" +
        "      <option value=\"px\">" + __('tool.' + id + '.px') + "</option>" +
        "      <option value=\"rem\">" + __('tool.' + id + '.rem') + "</option>" +
        "      <option value=\"em\">" + __('tool.' + id + '.em') + "</option>" +
        "      <option value=\"vw\">" + __('tool.' + id + '.vw') + "</option>" +
        "      <option value=\"vh\">" + __('tool.' + id + '.vh') + "</option>" +
        "      <option value=\"percent\">" + __('tool.' + id + '.percent') + "</option>" +
        "    </select>" +
        "  </div>" +
        "  <div>" +
        "    <label>" + __('tool.' + id + '.to') + "</label>" +
        "    <select id=\"cssToUnit\" class=\"form-input\">" +
        "      <option value=\"px\">" + __('tool.' + id + '.px') + "</option>" +
        "      <option value=\"rem\" selected>" + __('tool.' + id + '.rem') + "</option>" +
        "      <option value=\"em\">" + __('tool.' + id + '.em') + "</option>" +
        "      <option value=\"vw\">" + __('tool.' + id + '.vw') + "</option>" +
        "      <option value=\"vh\">" + __('tool.' + id + '.vh') + "</option>" +
        "      <option value=\"percent\">" + __('tool.' + id + '.percent') + "</option>" +
        "    </select>" +
        "  </div>" +
        "</div>" +
        "<div>" +
        "  <label for=\"cssValueInput\">" + __('tool.' + id + '.value') + "</label>" +
        "  <input type=\"number\" id=\"cssValueInput\" class=\"form-input\" value=\"16\" step=\"any\" />" +
        "</div>" +
        "<hr style=\"border:none;border-top:1px solid var(--bg-input-border);margin:12px 0\">" +
        "<div class=\"flex-row\" style=\"gap:12px\">" +
        "  <div style=\"flex:1\">" +
        "    <label>" + __('tool.' + id + '.baseFontSize') + "</label>" +
        "    <input type=\"number\" id=\"cssBaseFontSize\" class=\"form-input\" value=\"16\" step=\"any\" />" +
        "  </div>" +
        "  <div style=\"flex:1\">" +
        "    <label>" + __('tool.' + id + '.viewportWidth') + "</label>" +
        "    <input type=\"number\" id=\"cssViewportWidth\" class=\"form-input\" value=\"1920\" step=\"any\" />" +
        "  </div>" +
        "  <div style=\"flex:1\">" +
        "    <label>" + __('tool.' + id + '.viewportHeight') + "</label>" +
        "    <input type=\"number\" id=\"cssViewportHeight\" class=\"form-input\" value=\"1080\" step=\"any\" />" +
        "  </div>" +
        "</div>" +
        "<div class=\"btn-group\" style=\"margin-top:12px\">" +
        "  <button class=\"btn btn-primary\" id=\"cssConvertBtn\">" + __('tool.' + id + '.convert') + "</button>" +
        "</div>" +
        "<div style=\"margin-top:12px\">" +
        "  <label>" + __('tool.' + id + '.result') + "</label>" +
        "  <div class=\"output-box\" id=\"cssResult\" style=\"font-family:var(--font-mono);font-size:1rem;text-align:center;padding:16px\"></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var valueInput = document.getElementById("cssValueInput");
      var fromUnit = document.getElementById("cssFromUnit");
      var toUnit = document.getElementById("cssToUnit");
      var baseFontSize = document.getElementById("cssBaseFontSize");
      var viewportWidth = document.getElementById("cssViewportWidth");
      var viewportHeight = document.getElementById("cssViewportHeight");
      var convertBtn = document.getElementById("cssConvertBtn");
      var result = document.getElementById("cssResult");

      function convert() {
        var val = parseFloat(valueInput.value);
        var from = fromUnit.value;
        var to = toUnit.value;
        var base = parseFloat(baseFontSize.value) || 16;
        var vw = parseFloat(viewportWidth.value) || 1920;
        var vh = parseFloat(viewportHeight.value) || 1080;

        if (isNaN(val)) {
          result.textContent = "0";
          return;
        }

        // Step 1: Convert input value to px
        var px;
        switch (from) {
          case "px": px = val; break;
          case "rem": px = val * base; break;
          case "em": px = val * base; break;
          case "vw": px = val * vw / 100; break;
          case "vh": px = val * vh / 100; break;
          case "percent": px = val * vw / 100; break;
          default: px = val;
        }

        // Step 2: Convert px to target unit
        var out;
        switch (to) {
          case "px": out = px; break;
          case "rem": out = px / base; break;
          case "em": out = px / base; break;
          case "vw": out = px / vw * 100; break;
          case "vh": out = px / vh * 100; break;
          case "percent": out = px / vw * 100; break;
          default: out = px;
        }

        // Format: max 4 decimal places, remove trailing zeros
        var formatted = parseFloat(out.toFixed(4));
        result.textContent = formatted + to;
      }

      convertBtn.addEventListener("click", convert);
      // Auto-convert on Enter key in any input
      var inputs = [valueInput, baseFontSize, viewportWidth, viewportHeight, fromUnit, toUnit];
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", convert);
        if (inputs[i].tagName === "INPUT" && inputs[i].type === "number") {
          inputs[i].addEventListener("keydown", function (e) {
            if (e.key === "Enter") convert();
          });
        }
      }

      convert();
    },
    destroy: function () {}
  };
})();