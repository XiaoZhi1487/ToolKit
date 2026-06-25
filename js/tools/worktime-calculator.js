(function () {
  var id = "worktime-calculator";
  var title = "Worktime Calculator";
  var icon = "\u23F1";
  var category = "Productivity";
  var description = "Calculate working hours and overtime";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.input') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"2024-01-01 09:00 18:00\\n2024-01-02 08:30 19:30\"></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.normalHours') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-normalHours\" value=\"8\">" +
        "<label>" + __('tool.' + id + '.hourlyRate') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-hourlyRate\" value=\"50\">" +
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

      var input = box.querySelector("#" + id + "-input");
      var normalHoursInput = box.querySelector("#" + id + "-normalHours");
      var hourlyRateInput = box.querySelector("#" + id + "-hourlyRate");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-calculate").addEventListener("click", function () {
        var lines = input.value.split('\n').filter(Boolean);
        var totalHours = 0;
        var overtimeHours = 0;

        lines.forEach(function (line) {
          var parts = line.split(' ');
          var start = new Date(parts[0] + ' ' + parts[1]);
          var end = new Date(parts[0] + ' ' + parts[2]);
          var hours = (end - start) / (1000 * 60 * 60);
          totalHours += hours;
          if (hours > parseFloat(normalHoursInput.value)) {
            overtimeHours += hours - parseFloat(normalHoursInput.value);
          }
        });

        var normalPay = (totalHours - overtimeHours) * parseFloat(hourlyRateInput.value);
        var overtimePay = overtimeHours * parseFloat(hourlyRateInput.value) * 1.5;
        var totalPay = normalPay + overtimePay;

        result.textContent = "Total Hours: " + totalHours.toFixed(2) + "\nNormal Hours: " + (totalHours - overtimeHours).toFixed(2) + "\nOvertime Hours: " + overtimeHours.toFixed(2) + "\n\nNormal Pay: " + normalPay.toFixed(2) + "\nOvertime Pay: " + overtimePay.toFixed(2) + "\nTotal Pay: " + totalPay.toFixed(2);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();