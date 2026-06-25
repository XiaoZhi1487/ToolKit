// Tool :: Tip Calculator
(function () {
  var id = "tip-calculator";
  var title = "Tip Calculator";
  var icon = "\ud83d\udcb0";
  var category = "Productivity";
  var description = "Calculate tip amounts and split bills";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.tip-calculator.billAmount") + "</label>" +
        "<input type=\"number\" id=\"tcBill\" class=\"tool-input\" value=\"100\" min=\"0\" step=\"0.01\">" +
        "<label>" + __("tool.tip-calculator.tipPercent") + "</label>" +
        "<input type=\"range\" id=\"tcPercent\" min=\"0\" max=\"30\" value=\"15\" step=\"0.5\" class=\"tool-input\">" +
        "<div style=\"text-align:center;font-size:1.25rem;font-weight:600;margin:4px 0\"><span id=\"tcPercentLabel\">15</span>%</div>" +
        "<label>" + __("tool.tip-calculator.splitCount") + "</label>" +
        "<input type=\"number\" id=\"tcSplit\" class=\"tool-input\" value=\"1\" min=\"1\">" +
        "<button class=\"btn btn-primary\" id=\"tcCalcBtn\">" + __("tool.tip-calculator.calculate") + "</button>" +
        "<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px\">" +
        "  <div class=\"result-card\"><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.tip-calculator.tipAmount") + "</div><div id=\"tcTip\" style=\"font-size:1.25rem;font-weight:600\">$0.00</div></div>" +
        "  <div class=\"result-card\"><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.tip-calculator.totalAmount") + "</div><div id=\"tcTotal\" style=\"font-size:1.25rem;font-weight:600\">$0.00</div></div>" +
        "  <div class=\"result-card\" style=\"grid-column:1/-1\"><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.tip-calculator.perPerson") + "</div><div id=\"tcPerPerson\" style=\"font-size:1.5rem;font-weight:700\">$0.00</div></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var bill = document.getElementById("tcBill");
      var percent = document.getElementById("tcPercent");
      var percentLabel = document.getElementById("tcPercentLabel");
      var split = document.getElementById("tcSplit");
      var calcBtn = document.getElementById("tcCalcBtn");
      var tipEl = document.getElementById("tcTip");
      var totalEl = document.getElementById("tcTotal");
      var perPersonEl = document.getElementById("tcPerPerson");
      function calculate() {
        var b = parseFloat(bill.value) || 0;
        var p = parseFloat(percent.value) || 0;
        var s = parseInt(split.value) || 1;
        percentLabel.textContent = p;
        var tip = b * p / 100;
        var total = b + tip;
        tipEl.textContent = "$" + tip.toFixed(2);
        totalEl.textContent = "$" + total.toFixed(2);
        perPersonEl.textContent = "$" + (total / s).toFixed(2);
      }
      percent.addEventListener("input", calculate);
      calcBtn.addEventListener("click", calculate);
      calculate();
    },
    destroy: function () {}
  };
})();