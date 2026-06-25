// Tool :: Age Calculator
(function () {
  var id = "age-calculator";
  var title = "Age Calculator";
  var icon = "\ud83c\udf82";
  var category = "Tools";
  var description = "Calculate precise age from birth date";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.age-calculator.birthDate") + "</label>" +
        "<input type=\"date\" id=\"acBirthDate\" value=\"2000-01-01\">" +
        "<button class=\"btn btn-primary\" id=\"acCalcBtn\">" + __("tool.age-calculator.calculate") + "</button>" +
        "<div class=\"grid-2\" style=\"grid-template-columns:repeat(3,1fr)\">" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--accent-1)\" id=\"acYears\">24</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.age-calculator.years") + "</div></div>" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--accent-1)\" id=\"acMonths\">0</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.age-calculator.months") + "</div></div>" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--accent-1)\" id=\"acDays\">0</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.age-calculator.days") + "</div></div>" +
        "</div>" +
        "<div class=\"output-box\">" +
        "  <div style=\"display:flex;justify-content:space-between;font-size:0.8125rem\"><span>" + __("tool.age-calculator.totalDays") + "</span><span id=\"acTotalDays\">-</span></div>" +
        "  <div style=\"display:flex;justify-content:space-between;font-size:0.8125rem;margin-top:4px\"><span>" + __("tool.age-calculator.totalHours") + "</span><span id=\"acTotalHours\">-</span></div>" +
        "  <div style=\"display:flex;justify-content:space-between;font-size:0.8125rem;margin-top:4px\"><span>" + __("tool.age-calculator.totalMinutes") + "</span><span id=\"acTotalMinutes\">-</span></div>" +
        "  <div style=\"display:flex;justify-content:space-between;font-size:0.8125rem;margin-top:4px;padding-top:4px;border-top:1px solid var(--bg-card-border)\"><span>" + __("tool.age-calculator.nextBirthday") + "</span><span id=\"acNextBday\">-</span></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var birthInput = document.getElementById("acBirthDate");
      var calcBtn = document.getElementById("acCalcBtn");
      function calculate() {
        var birth = new Date(birthInput.value);
        if (isNaN(birth.getTime())) return;
        var now = new Date();
        var years = now.getFullYear() - birth.getFullYear();
        var months = now.getMonth() - birth.getMonth();
        var days = now.getDate() - birth.getDate();
        if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }
        document.getElementById("acYears").textContent = years;
        document.getElementById("acMonths").textContent = months;
        document.getElementById("acDays").textContent = days;
        var totalMs = now - birth;
        document.getElementById("acTotalDays").textContent = Math.floor(totalMs / 86400000);
        document.getElementById("acTotalHours").textContent = Math.floor(totalMs / 3600000);
        document.getElementById("acTotalMinutes").textContent = Math.floor(totalMs / 60000);
        // Next birthday
        var nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
        var diffDays = Math.ceil((nextBday - now) / 86400000);
        document.getElementById("acNextBday").textContent = diffDays + " " + __("tool.age-calculator.days");
      }
      calcBtn.addEventListener("click", calculate);
      calculate();
    },
    destroy: function () {}
  };
})();