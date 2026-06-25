// Tool :: Countdown Timer
(function () {
  var id = "countdown-timer";
  var title = "Countdown Timer";
  var icon = "\u23f2\ufe0f";
  var category = "Productivity";
  var description = "Set a countdown timer with pause and reset";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:8px;justify-content:center\">" +
        "  <div><label style=\"font-size:0.75rem;text-align:center;display:block\">" + __("tool.countdown-timer.hours") + "</label><input type=\"number\" id=\"ctHours\" class=\"tool-input\" value=\"0\" min=\"0\" style=\"width:70px;text-align:center;font-size:1.25rem\"></div>" +
        "  <div><label style=\"font-size:0.75rem;text-align:center;display:block\">" + __("tool.countdown-timer.minutes") + "</label><input type=\"number\" id=\"ctMinutes\" class=\"tool-input\" value=\"5\" min=\"0\" style=\"width:70px;text-align:center;font-size:1.25rem\"></div>" +
        "  <div><label style=\"font-size:0.75rem;text-align:center;display:block\">" + __("tool.countdown-timer.seconds") + "</label><input type=\"number\" id=\"ctSeconds\" class=\"tool-input\" value=\"0\" min=\"0\" style=\"width:70px;text-align:center;font-size:1.25rem\"></div>" +
        "</div>" +
        "<div id=\"ctDisplay\" style=\"font-size:3rem;font-weight:700;text-align:center;font-family:var(--font-mono);margin:12px 0;letter-spacing:4px\">00:00:00</div>" +
        "<div class=\"flex-row\" style=\"gap:8px;justify-content:center\">" +
        "  <button class=\"btn btn-primary\" id=\"ctStartBtn\">" + __("tool.countdown-timer.start") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"ctPauseBtn\">" + __("tool.countdown-timer.pause") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"ctResetBtn\">" + __("tool.countdown-timer.reset") + "</button>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var hours = document.getElementById("ctHours");
      var minutes = document.getElementById("ctMinutes");
      var seconds = document.getElementById("ctSeconds");
      var display = document.getElementById("ctDisplay");
      var startBtn = document.getElementById("ctStartBtn");
      var pauseBtn = document.getElementById("ctPauseBtn");
      var resetBtn = document.getElementById("ctResetBtn");
      var totalSec = 0, remaining = 0;
      var timer = null, running = false;
      function updateDisplay() {
        var h = Math.floor(remaining / 3600);
        var m = Math.floor((remaining % 3600) / 60);
        var s = remaining % 60;
        display.textContent = [h,m,s].map(function(v){return ("0"+v).slice(-2);}).join(":");
      }
      function start() {
        if (running) return;
        if (remaining <= 0) {
          totalSec = parseInt(hours.value)*3600 + parseInt(minutes.value)*60 + parseInt(seconds.value);
          remaining = totalSec;
        }
        if (remaining <= 0) return;
        running = true;
        timer = setInterval(function() {
          remaining--;
          updateDisplay();
          if (remaining <= 0) {
            clearInterval(timer);
            running = false;
            display.textContent = __("tool.countdown-timer.done");
          }
        }, 1000);
      }
      function pause() {
        clearInterval(timer);
        running = false;
      }
      function reset() {
        clearInterval(timer);
        running = false;
        totalSec = parseInt(hours.value)*3600 + parseInt(minutes.value)*60 + parseInt(seconds.value);
        remaining = totalSec;
        updateDisplay();
      }
      startBtn.addEventListener("click", start);
      pauseBtn.addEventListener("click", pause);
      resetBtn.addEventListener("click", reset);
      reset();
    },
    destroy: function () {
      if (timer) clearInterval(timer);
    }
  };
})();