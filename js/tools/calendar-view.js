// Tool :: Calendar View
(function () {
  var id = "calendar-view";
  var title = "Calendar View";
  var icon = "\ud83d\udcc5";
  var category = "Productivity";
  var description = "View calendar with month navigation and date selection";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:8px;justify-content:center;align-items:center;margin-bottom:8px\">" +
        "  <button class=\"btn btn-sm\" id=\"calPrev\">" + __("tool.calendar-view.prevMonth") + "</button>" +
        "  <span id=\"calTitle\" style=\"font-weight:600;font-size:1rem;min-width:160px;text-align:center\"></span>" +
        "  <button class=\"btn btn-sm\" id=\"calNext\">" + __("tool.calendar-view.nextMonth") + "</button>" +
        "  <button class=\"btn btn-sm\" id=\"calToday\">" + __("tool.calendar-view.today") + "</button>" +
        "</div>" +
        "<table style=\"width:100%;border-collapse:collapse\">" +
        "  <thead><tr id=\"calHeader\"></tr></thead>" +
        "  <tbody id=\"calBody\"></tbody>" +
        "</table>" +
        "</div>";
      return box;
    },
    init: function () {
      var title = document.getElementById("calTitle");
      var header = document.getElementById("calHeader");
      var body = document.getElementById("calBody");
      var prevBtn = document.getElementById("calPrev");
      var nextBtn = document.getElementById("calNext");
      var todayBtn = document.getElementById("calToday");
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth();
      var WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      function render() {
        header.innerHTML = "";
        for (var i = 0; i < 7; i++) {
          header.innerHTML += "<th style=\"padding:4px;font-size:0.75rem;color:var(--text-tertiary);font-weight:400\">" + WEEKDAYS[i] + "</th>";
        }
        title.textContent = new Date(year, month).toLocaleDateString("en-US", { year: "numeric", month: "long" });
        body.innerHTML = "";
        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var today = new Date();
        var tr = document.createElement("tr");
        for (var i = 0; i < firstDay; i++) {
          tr.innerHTML += "<td></td>";
        }
        for (var d = 1; d <= daysInMonth; d++) {
          var td = document.createElement("td");
          td.textContent = d;
          td.style.cssText = "padding:6px;text-align:center;font-size:0.875rem;border-radius:6px;cursor:pointer";
          if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            td.style.background = "var(--accent)";
            td.style.color = "white";
            td.style.fontWeight = "600";
          }
          td.addEventListener("mouseenter", function(){ this.style.background = this.style.background !== "var(--accent)" ? "var(--surface-hover)" : this.style.background; });
          td.addEventListener("mouseleave", function(){ this.style.background = this.style.background === "var(--surface-hover)" ? "" : this.style.background; });
          tr.appendChild(td);
          if ((firstDay + d) % 7 === 0 && d < daysInMonth) {
            body.appendChild(tr);
            tr = document.createElement("tr");
          }
        }
        body.appendChild(tr);
      }
      prevBtn.addEventListener("click", function() { month--; if (month < 0) { month = 11; year--; } render(); });
      nextBtn.addEventListener("click", function() { month++; if (month > 11) { month = 0; year++; } render(); });
      todayBtn.addEventListener("click", function() { year = now.getFullYear(); month = now.getMonth(); render(); });
      render();
    },
    destroy: function () {}
  };
})();