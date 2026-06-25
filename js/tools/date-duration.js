// Tool :: Date Duration Calculator
(function () {
  var id = "date-duration";
  var title = "Date Duration";
  var icon = "\ud83d\udcc5";
  var category = "Tools";
  var description = "Calculate days between two dates";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.date-duration.startDate") + "</label><input type=\"date\" id=\"ddStart\"></div>" +
        "  <div><label>" + __("tool.date-duration.endDate") + "</label><input type=\"date\" id=\"ddEnd\"></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"ddCalcBtn\">" + __("tool.date-duration.calculate") + "</button>" +
        "<div class=\"grid-2\">" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--accent-1)\" id=\"ddDays\">-</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.date-duration.totalDays") + "</div></div>" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--accent-1)\" id=\"ddWeeks\">-</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.date-duration.totalWeeks") + "</div></div>" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--accent-1)\" id=\"ddMonths\">-</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.date-duration.totalMonths") + "</div></div>" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--accent-1)\" id=\"ddYears\">-</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.date-duration.totalYears") + "</div></div>" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--green)\" id=\"ddWorkdays\">-</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.date-duration.workdays") + "</div></div>" +
        "  <div class=\"output-box\" style=\"text-align:center\"><div style=\"font-size:2rem;font-weight:700;color:var(--amber)\" id=\"ddWeekends\">-</div><div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.date-duration.weekends") + "</div></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var start = document.getElementById("ddStart");
      var end = document.getElementById("ddEnd");
      var btn = document.getElementById("ddCalcBtn");
      var now = new Date();
      start.value = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
      end.value = now.toISOString().slice(0, 10);
      function calc() {
        var s = new Date(start.value);
        var e = new Date(end.value);
        if (isNaN(s.getTime()) || isNaN(e.getTime())) return;
        var diffMs = e - s;
        var diffDays = Math.abs(Math.round(diffMs / 86400000));
        document.getElementById("ddDays").textContent = diffDays;
        document.getElementById("ddWeeks").textContent = (diffDays / 7).toFixed(1);
        // Approximate months/years
        var totalMonths = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
        if (e.getDate() < s.getDate()) totalMonths--;
        document.getElementById("ddMonths").textContent = Math.abs(totalMonths);
        document.getElementById("ddYears").textContent = (Math.abs(totalMonths) / 12).toFixed(1);
        // Calculate workdays
        var workdays = 0, weekends = 0;
        var d = new Date(s);
        while (d <= e) {
          var day = d.getDay();
          if (day === 0 || day === 6) weekends++; else workdays++;
          d.setDate(d.getDate() + 1);
        }
        document.getElementById("ddWorkdays").textContent = workdays;
        document.getElementById("ddWeekends").textContent = weekends;
      }
      btn.addEventListener("click", calc);
      start.addEventListener("change", calc);
      end.addEventListener("change", calc);
      calc();
    },
    destroy: function () {}
  };
})();