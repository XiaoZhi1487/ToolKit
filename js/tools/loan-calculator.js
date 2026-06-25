// Tool :: Loan Calculator
(function () {
  var id = "loan-calculator";
  var title = "Loan Calculator";
  var icon = "\ud83c\udfe6";
  var category = "Productivity";
  var description = "Calculate monthly payments and total interest";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.loan-calculator.loanAmount") + "</label>" +
        "<input type=\"number\" id=\"lcAmount\" class=\"tool-input\" value=\"300000\" min=\"0\">" +
        "<label>" + __("tool.loan-calculator.interestRate") + "</label>" +
        "<input type=\"number\" id=\"lcRate\" class=\"tool-input\" value=\"4.5\" min=\"0\" step=\"0.1\">" +
        "<label>" + __("tool.loan-calculator.loanTerm") + "</label>" +
        "<input type=\"number\" id=\"lcTerm\" class=\"tool-input\" value=\"360\" min=\"1\">" +
        "<button class=\"btn btn-primary\" id=\"lcCalcBtn\">" + __("tool.loan-calculator.calculate") + "</button>" +
        "<div style=\"display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px\">" +
        "  <div class=\"result-card\"><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.loan-calculator.monthlyPayment") + "</div><div id=\"lcMonthly\" style=\"font-size:1.25rem;font-weight:600\">-</div></div>" +
        "  <div class=\"result-card\"><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.loan-calculator.totalPayment") + "</div><div id=\"lcTotal\" style=\"font-size:1.25rem;font-weight:600\">-</div></div>" +
        "  <div class=\"result-card\"><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.loan-calculator.totalInterest") + "</div><div id=\"lcInterest\" style=\"font-size:1.25rem;font-weight:600\">-</div></div>" +
        "</div>" +
        "<div style=\"margin-top:12px\">" +
        "  <div style=\"font-size:0.75rem;color:var(--text-tertiary);margin-bottom:4px\">" + __("tool.loan-calculator.paymentSchedule") + ":</div>" +
        "  <div id=\"lcSchedule\" style=\"max-height:200px;overflow-y:auto;font-family:var(--font-mono);font-size:0.75rem\"></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var amount = document.getElementById("lcAmount");
      var rate = document.getElementById("lcRate");
      var term = document.getElementById("lcTerm");
      var calcBtn = document.getElementById("lcCalcBtn");
      var monthlyEl = document.getElementById("lcMonthly");
      var totalEl = document.getElementById("lcTotal");
      var interestEl = document.getElementById("lcInterest");
      var scheduleEl = document.getElementById("lcSchedule");
      function calculate() {
        var p = parseFloat(amount.value) || 0;
        var r = (parseFloat(rate.value) || 0) / 100 / 12;
        var n = parseInt(term.value) || 1;
        if (r === 0) {
          var m = p / n;
          monthlyEl.textContent = "$" + m.toFixed(2);
          totalEl.textContent = "$" + p.toFixed(2);
          interestEl.textContent = "$0.00";
          scheduleEl.innerHTML = "";
          return;
        }
        var monthly = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        var total = monthly * n;
        var interest = total - p;
        monthlyEl.textContent = "$" + monthly.toFixed(2);
        totalEl.textContent = "$" + total.toFixed(2);
        interestEl.textContent = "$" + interest.toFixed(2);
        var html = "<table style=\"width:100%;border-collapse:collapse\"><thead><tr style=\"background:var(--surface-secondary)\">" +
          "<th style=\"padding:4px 6px;text-align:left\">" + __("tool.loan-calculator.month") + "</th>" +
          "<th style=\"padding:4px 6px;text-align:right\">" + __("tool.loan-calculator.principal") + "</th>" +
          "<th style=\"padding:4px 6px;text-align:right\">" + __("tool.loan-calculator.interest") + "</th>" +
          "<th style=\"padding:4px 6px;text-align:right\">" + __("tool.loan-calculator.balance") + "</th></tr></thead><tbody>";
        var balance = p;
        for (var i = 1; i <= n && i <= 60; i++) {
          var intPortion = balance * r;
          var prinPortion = monthly - intPortion;
          balance -= prinPortion;
          html += "<tr><td style=\"padding:3px 6px\">" + i + "</td><td style=\"padding:3px 6px;text-align:right\">$" + prinPortion.toFixed(2) + "</td><td style=\"padding:3px 6px;text-align:right\">$" + intPortion.toFixed(2) + "</td><td style=\"padding:3px 6px;text-align:right\">$" + Math.max(0, balance).toFixed(2) + "</td></tr>";
        }
        if (n > 60) html += "<tr><td colspan=\"4\" style=\"padding:3px 6px;text-align:center;color:var(--text-tertiary)\">... " + (n - 60) + " more months</td></tr>";
        html += "</tbody></table>";
        scheduleEl.innerHTML = html;
      }
      calcBtn.addEventListener("click", calculate);
      calculate();
    },
    destroy: function () {}
  };
})();