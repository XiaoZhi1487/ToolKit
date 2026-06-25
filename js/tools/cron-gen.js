// Tool :: Cron Expression Generator
(function () {
  var id = "cron-gen";
  var title = "Cron Generator";
  var icon = "\u23F0";
  var category = "Developer";
  var description = "Generate and explain cron schedule expressions";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\">",
        "  <span class=\"tool-header-icon\">" + icon + "</span>",
        "  <h2>" + __('tool.' + id + '.title') + "</h2>",
        "</div>",
        "<div class=\"tool-content\">",
        "  <label>" + __('tool.' + id + '.expression') + "</label>",
        "  <input type=\"text\" id=\"cronInput\" value=\"* * * * *\" spellcheck=\"false\" style=\"font-family:var(--font-mono);font-size:1rem;width:100%;padding:8px;border:1px solid var(--border-color);border-radius:6px;background:var(--bg);color:var(--fg)\">",
        "  <div style=\"font-size:0.75rem;color:var(--fg-light);margin-top:4px\">",
        "    " + __('tool.' + id + '.minute') + " " + __('tool.' + id + '.hour') + " " + __('tool.' + id + '.day') + " " + __('tool.' + id + '.month') + " " + __('tool.' + id + '.weekday'),
        "  </div>",
        "  <div class=\"flex-row\" style=\"gap:6px;margin:12px 0;flex-wrap:wrap\">",
        "    <span style=\"font-size:0.875rem;font-weight:600;align-self:center\">" + __('tool.' + id + '.preset') + ":</span>",
        "    <button class=\"btn btn-secondary\" data-preset=\"* * * * *\">" + __('tool.' + id + '.everyMinute') + "</button>",
        "    <button class=\"btn btn-secondary\" data-preset=\"0 * * * *\">" + __('tool.' + id + '.everyHour') + "</button>",
        "    <button class=\"btn btn-secondary\" data-preset=\"0 0 * * *\">" + __('tool.' + id + '.everyDay') + "</button>",
        "    <button class=\"btn btn-secondary\" data-preset=\"0 0 * * 0\">" + __('tool.' + id + '.everyWeek') + "</button>",
        "    <button class=\"btn btn-secondary\" data-preset=\"0 0 1 * *\">" + __('tool.' + id + '.everyMonth') + "</button>",
        "  </div>",
        "  <button class=\"btn btn-primary\" id=\"cronGenBtn\">" + __('tool.' + id + '.generate') + "</button>",
        "  <div class=\"output-box\" id=\"cronOutput\" style=\"margin-top:12px\">" + __('common.waiting') + "</div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("cronInput");
      var output = document.getElementById("cronOutput");
      var genBtn = document.getElementById("cronGenBtn");

      function describeCron(expr) {
        var parts = expr.trim().split(/\s+/);
        if (parts.length !== 5) return "Invalid: need 5 fields";
        var desc = [];

        // minute
        if (parts[0] === '*') desc.push('every minute');
        else if (parts[0].includes('/')) desc.push('every ' + parts[0].split('/')[1] + ' minutes');
        else desc.push('at minute ' + parts[0]);

        // hour
        if (parts[1] === '*') {
          if (parts[0] !== '*') desc.push('of every hour');
        } else if (parts[1].includes('/')) {
          desc.push('every ' + parts[1].split('/')[1] + ' hours');
        } else {
          desc.push('at ' + parts[1] + ':00');
        }

        // day
        if (parts[2] !== '*') {
          desc.push('on day ' + parts[2]);
        }

        // month
        if (parts[3] !== '*') {
          desc.push('in month ' + parts[3]);
        }

        // weekday
        if (parts[4] !== '*') {
          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          desc.push('on ' + (days[parseInt(parts[4])] || parts[4]));
        }

        return desc.join(', ');
      }

      function generate() {
        var desc = describeCron(input.value);
        output.textContent = desc;
      }

      // Preset buttons
      var presetBtns = document.querySelectorAll("[data-preset]");
      for (var i = 0; i < presetBtns.length; i++) {
        presetBtns[i].addEventListener("click", function (e) {
          input.value = e.target.getAttribute("data-preset");
          generate();
        });
      }

      genBtn.addEventListener("click", generate);
      generate();
    },
    destroy: function () {}
  };
})();