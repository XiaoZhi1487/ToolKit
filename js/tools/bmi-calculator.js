// Tool :: BMI Calculator
(function () {
  var id = "bmi-calculator";
  var title = "BMI Calculator";
  var icon = "\u2696\uFE0F";
  var category = "Tools";
  var description = "Calculate Body Mass Index and assess weight status";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.bmi-calculator.height") + "</label><input type=\"number\" id=\"bmiHeight\" value=\"170\" min=\"50\" max=\"250\"></div>" +
        "  <div><label>" + __("tool.bmi-calculator.weight") + "</label><input type=\"number\" id=\"bmiWeight\" value=\"65\" min=\"20\" max=\"300\"></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"bmiCalcBtn\">" + __("tool.bmi-calculator.calculate") + "</button>" +
        "<div class=\"output-box\" style=\"text-align:center\">" +
        "  <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.bmi-calculator.bmiValue") + "</div>" +
        "  <div style=\"font-size:2.5rem;font-weight:700;color:var(--accent-1)\" id=\"bmiValue\">22.5</div>" +
        "  <div style=\"font-size:0.8125rem;color:var(--text-secondary);margin-top:4px\"><span id=\"bmiCategory\">" + __("tool.bmi-calculator.normal") + "</span></div>" +
        "</div>" +
        "<div class=\"flex-row\" id=\"bmiBars\" style=\"gap:4px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var height = document.getElementById("bmiHeight");
      var weight = document.getElementById("bmiWeight");
      var btn = document.getElementById("bmiCalcBtn");
      var valueEl = document.getElementById("bmiValue");
      var catEl = document.getElementById("bmiCategory");
      var barsEl = document.getElementById("bmiBars");
      var categories = [
        { key: "underweight", max: 18.5 },
        { key: "normal", max: 25 },
        { key: "overweight", max: 30 },
        { key: "obese", max: Infinity }
      ];
      function calculate() {
        var h = parseFloat(height.value) / 100;
        var w = parseFloat(weight.value);
        if (!h || !w) return;
        var bmi = w / (h * h);
        valueEl.textContent = bmi.toFixed(1);
        var cat = __("tool.bmi-calculator.obese");
        var activeIdx = categories.length - 1;
        for (var i = 0; i < categories.length; i++) {
          if (bmi < categories[i].max) { cat = __("tool.bmi-calculator." + categories[i].key); activeIdx = i; break; }
        }
        catEl.textContent = cat;
        var colors = ["var(--green)", "var(--green)", "var(--amber)", "var(--red)"];
        barsEl.innerHTML = categories.map(function(c, idx) {
          var pct = Math.min(100, (bmi / categories[categories.length-1].max) * 100);
          var active = idx === activeIdx;
          return "<div style=\"flex:1;height:6px;border-radius:3px;background:" + (active ? colors[idx] : "var(--bg-input-border)") + "\"></div>";
        }).join("");
      }
      btn.addEventListener("click", calculate);
      height.addEventListener("input", calculate);
      weight.addEventListener("input", calculate);
      calculate();
    },
    destroy: function () {}
  };
})();