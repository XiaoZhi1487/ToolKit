(function () {
  var id = "mortgage-calculator";
  var title = "Mortgage Calculator";
  var icon = "\ud83c\udfe0";
  var category = "Productivity";
  var description = "Calculate mortgage payments (equal principal/interest)";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-3\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.principal') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-principal\" value=\"1000000\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.rate') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-rate\" value=\"4.2\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.years') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-years\" value=\"30\">" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.type') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-type\">" +
        "<option value=\"equal-payment\">" + __('tool.' + id + '.equalPayment') + "</option>" +
        "<option value=\"equal-principal\">" + __('tool.' + id + '.equalPrincipal') + "</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-calculate\">" + __('tool.' + id + '.calculate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var principalInput = box.querySelector("#" + id + "-principal");
      var rateInput = box.querySelector("#" + id + "-rate");
      var yearsInput = box.querySelector("#" + id + "-years");
      var typeInput = box.querySelector("#" + id + "-type");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-calculate").addEventListener("click", function () {
        var principal = parseFloat(principalInput.value);
        var monthlyRate = parseFloat(rateInput.value) / 100 / 12;
        var months = parseInt(yearsInput.value) * 12;

        var report = '';

        if (typeInput.value === 'equal-payment') {
          var monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
          var totalPayment = monthlyPayment * months;
          var totalInterest = totalPayment - principal;
          report = "Monthly Payment: " + monthlyPayment.toFixed(2) + "\nTotal Payment: " + totalPayment.toFixed(2) + "\nTotal Interest: " + totalInterest.toFixed(2);
        } else {
          var monthlyPrincipal = principal / months;
          var totalInterest = 0;
          var payments = [];
          for (var i = 1; i <= months; i++) {
            var interest = (principal - (i - 1) * monthlyPrincipal) * monthlyRate;
            totalInterest += interest;
            var payment = monthlyPrincipal + interest;
            payments.push("Month " + i + ": " + payment.toFixed(2) + " (principal: " + monthlyPrincipal.toFixed(2) + ", interest: " + interest.toFixed(2) + ")");
          }
          var totalPayment = principal + totalInterest;
          report = "Total Payment: " + totalPayment.toFixed(2) + "\nTotal Interest: " + totalInterest.toFixed(2) + "\n\n" + payments.slice(0, 12).join('\n') + "\n...";
        }

        result.textContent = report;
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        principalInput.value = '1000000';
        rateInput.value = '4.2';
        yearsInput.value = '30';
        result.textContent = '';
      });

      return box;
    }
  };
})();