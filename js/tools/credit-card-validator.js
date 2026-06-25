// Tool :: Credit Card Validator
(function () {
  var id = "credit-card-validator";
  var title = "Credit Card Validator";
  var icon = "\ud83d\udcb3";
  var category = "Security";
  var description = "Validate credit card numbers and identify card type";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.credit-card-validator.input") + "</label>" +
        "<input type=\"text\" id=\"ccInput\" class=\"tool-input\" placeholder=\"" + __("tool.credit-card-validator.placeholder") + "\" style=\"font-family:var(--font-mono);font-size:1rem\">" +
        "<button class=\"btn btn-primary\" id=\"ccValidateBtn\">" + __("tool.credit-card-validator.validate") + "</button>" +
        "<div class=\"result-card\" id=\"ccResult\" style=\"margin-top:8px\">" +
        "  <div style=\"font-size:0.875rem\">" + __("tool.credit-card-validator.type") + ": <strong id=\"ccType\">-</strong></div>" +
        "  <div style=\"font-size:0.875rem\">" + __("tool.credit-card-validator.issuer") + ": <strong id=\"ccIssuer\">-</strong></div>" +
        "  <div style=\"font-size:1.25rem;font-weight:600;margin-top:4px\" id=\"ccStatus\">-</div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("ccInput");
      var btn = document.getElementById("ccValidateBtn");
      var typeEl = document.getElementById("ccType");
      var issuerEl = document.getElementById("ccIssuer");
      var statusEl = document.getElementById("ccStatus");
      function luhnCheck(num) {
        var sum = 0, alt = false;
        for (var i = num.length - 1; i >= 0; i--) {
          var d = parseInt(num.charAt(i), 10);
          if (alt) { d *= 2; if (d > 9) d -= 9; }
          sum += d;
          alt = !alt;
        }
        return sum % 10 === 0;
      }
      function getCardType(num) {
        if (/^4/.test(num)) return "Visa";
        if (/^5[1-5]/.test(num)) return "Mastercard";
        if (/^3[47]/.test(num)) return "American Express";
        if (/^6011|^65/.test(num)) return "Discover";
        if (/^35(2[89]|[3-8])/.test(num)) return "JCB";
        if (/^3(0[0-5]|6|8|9)/.test(num)) return "Diners Club";
        return "Unknown";
      }
      function validate() {
        var num = input.value.replace(/\s/g, "");
        if (!num || !/^\d+$/.test(num)) {
          statusEl.textContent = __("tool.credit-card-validator.invalid");
          statusEl.style.color = "var(--danger)";
          typeEl.textContent = "-";
          issuerEl.textContent = "-";
          return;
        }
        var valid = luhnCheck(num);
        var type = getCardType(num);
        typeEl.textContent = __("tool.credit-card-validator." + type.toLowerCase().replace(/\s/g, ""));
        issuerEl.textContent = type;
        if (valid) {
          statusEl.textContent = __("tool.credit-card-validator.valid");
          statusEl.style.color = "var(--success)";
        } else {
          statusEl.textContent = __("tool.credit-card-validator.invalid");
          statusEl.style.color = "var(--danger)";
        }
      }
      btn.addEventListener("click", validate);
      input.addEventListener("keydown", function(e) { if (e.key === "Enter") validate(); });
    },
    destroy: function () {}
  };
})();