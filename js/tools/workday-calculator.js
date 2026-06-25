(function () {
  var id = "workday-calculator";
  var title = "Workday Calculator";
  var icon = "\ud83d\udcc5";
  var category = "Productivity";
  var description = "Calculate working days excluding holidays";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.start') + "</label>" +
        "<input type=\"date\" class=\"input\" id=\"" + id + "-start\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.end') + "</label>" +
        "<input type=\"date\" class=\"input\" id=\"" + id + "-end\">" +
        "</div>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.holidays') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-holidays\" placeholder=\"2024-01-01, 2024-02-10\">" +
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

      var startInput = box.querySelector("#" + id + "-start");
      var endInput = box.querySelector("#" + id + "-end");
      var holidaysInput = box.querySelector("#" + id + "-holidays");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-calculate").addEventListener("click", function () {
        var start = new Date(startInput.value);
        var end = new Date(endInput.value);
        var holidays = holidaysInput.value.split(',').map(function (h) { return h.trim(); }).filter(Boolean);
        var workdays = 0;
        var totalDays = 0;

        for (var d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          totalDays++;
          var day = d.getDay();
          var dateStr = d.toISOString().split('T')[0];
          if (day !== 0 && day !== 6 && !holidays.includes(dateStr)) {
            workdays++;
          }
        }

        result.textContent = "Total Days: " + totalDays + "\nWorking Days: " + workdays + "\nWeekends/Holidays: " + (totalDays - workdays);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        startInput.value = '';
        endInput.value = '';
        holidaysInput.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();