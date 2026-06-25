// Tool :: Unit Converter
(function () {
  var id = "unit-converter";
  var title = "Unit Converter";
  var icon = "\ud83d\udcd0";
  var category = "Tools";
  var description = "Convert between length, weight, temperature, and volume units";
  window.toolMeta.push({ id, title, icon, category, description });
  var unitTypes = {
    length: { units: ["mm","cm","m","km","inch","foot"], base: 1,
      rates: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048 } },
    weight: { units: ["g","kg","ton","lb","oz"], base: 1,
      rates: { g: 1, kg: 1000, ton: 1000000, lb: 453.592, oz: 28.3495 } },
    temperature: { units: ["celsius","fahrenheit","kelvin"], base: 1 },
    volume: { units: ["ml","l","gal"], base: 1,
      rates: { ml: 0.001, l: 1, gal: 3.78541 } }
  };
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"tab-bar\" id=\"ucTabBar\">" +
        "  <button class=\"tab-btn active\" data-type=\"length\">" + __("tool.unit-converter.length") + "</button>" +
        "  <button class=\"tab-btn\" data-type=\"weight\">" + __("tool.unit-converter.weight") + "</button>" +
        "  <button class=\"tab-btn\" data-type=\"temperature\">" + __("tool.unit-converter.temperature") + "</button>" +
        "  <button class=\"tab-btn\" data-type=\"volume\">" + __("tool.unit-converter.volume") + "</button>" +
        "</div>" +
        "<input type=\"number\" id=\"ucInput\" value=\"1\" step=\"any\">" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.unit-converter.from") + "</label><select id=\"ucFrom\"></select></div>" +
        "  <div><label>" + __("tool.unit-converter.to") + "</label><select id=\"ucTo\"></select></div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"ucConvertBtn\">" + __("tool.unit-converter.convert") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"ucSwapBtn\">" + __("tool.unit-converter.swap") + "</button>" +
        "</div>" +
        "<div class=\"output-box\" style=\"text-align:center;font-size:1.25rem;font-weight:600;color:var(--accent-1)\" id=\"ucResult\">-</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var tabBar = document.getElementById("ucTabBar");
      var input = document.getElementById("ucInput");
      var fromSel = document.getElementById("ucFrom");
      var toSel = document.getElementById("ucTo");
      var convertBtn = document.getElementById("ucConvertBtn");
      var swapBtn = document.getElementById("ucSwapBtn");
      var result = document.getElementById("ucResult");
      var type = "length";
      function populateSelects() {
        var typeData = unitTypes[type];
        fromSel.innerHTML = typeData.units.map(function(u) { return "<option value=\"" + u + "\">" + __("tool.unit-converter." + u) + "</option>"; }).join("");
        toSel.innerHTML = typeData.units.map(function(u) { return "<option value=\"" + u + "\">" + __("tool.unit-converter." + u) + "</option>"; }).join("");
        toSel.value = typeData.units[1] || typeData.units[0];
        convert();
      }
      function convert() {
        var val = parseFloat(input.value);
        if (isNaN(val)) { result.textContent = "-"; return; }
        var typeData = unitTypes[type];
        var from = fromSel.value, to = toSel.value;
        if (type === "temperature") {
          if (from === "celsius" && to === "fahrenheit") result.textContent = (val * 9/5 + 32).toFixed(2) + " °F";
          else if (from === "celsius" && to === "kelvin") result.textContent = (val + 273.15).toFixed(2) + " K";
          else if (from === "fahrenheit" && to === "celsius") result.textContent = ((val - 32) * 5/9).toFixed(2) + " °C";
          else if (from === "fahrenheit" && to === "kelvin") result.textContent = ((val - 32) * 5/9 + 273.15).toFixed(2) + " K";
          else if (from === "kelvin" && to === "celsius") result.textContent = (val - 273.15).toFixed(2) + " °C";
          else if (from === "kelvin" && to === "fahrenheit") result.textContent = ((val - 273.15) * 9/5 + 32).toFixed(2) + " °F";
          else result.textContent = val.toFixed(2) + (from === "celsius" ? " °C" : from === "fahrenheit" ? " °F" : " K");
        } else {
          var baseVal = val * typeData.rates[from];
          var converted = baseVal / typeData.rates[to];
          result.textContent = converted.toFixed(6).replace(/\.?0+$/, "") + " " + __("tool.unit-converter." + to);
        }
      }
      tabBar.addEventListener("click", function(e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        type = btn.dataset.type;
        populateSelects();
      });
      convertBtn.addEventListener("click", convert);
      swapBtn.addEventListener("click", function() { var t = fromSel.value; fromSel.value = toSel.value; toSel.value = t; convert(); });
      input.addEventListener("input", convert);
      fromSel.addEventListener("change", convert);
      toSel.addEventListener("change", convert);
      populateSelects();
    },
    destroy: function () {}
  };
})();