// Tool :: Stopwatch
(function () {
  var id = "stopwatch";
  var title = "Stopwatch";
  var icon = "\u23f1\ufe0f";
  var category = "Productivity";
  var description = "Precision stopwatch with lap recording";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div id=\"swDisplay\" style=\"font-size:3rem;font-weight:700;text-align:center;font-family:var(--font-mono);margin:12px 0;letter-spacing:2px\">00:00.00</div>" +
        "<div class=\"flex-row\" style=\"gap:8px;justify-content:center\">" +
        "  <button class=\"btn btn-primary\" id=\"swStartBtn\">" + __("tool.stopwatch.start") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"swPauseBtn\">" + __("tool.stopwatch.pause") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"swLapBtn\">" + __("tool.stopwatch.lap") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"swResetBtn\">" + __("tool.stopwatch.reset") + "</button>" +
        "</div>" +
        "<div style=\"margin-top:12px\">" +
        "  <div style=\"font-size:0.75rem;color:var(--text-tertiary);margin-bottom:4px\">" + __("tool.stopwatch.laps") + ":</div>" +
        "  <div id=\"swLaps\" style=\"max-height:150px;overflow-y:auto;font-family:var(--font-mono);font-size:0.8125rem\"></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var display = document.getElementById("swDisplay");
      var startBtn = document.getElementById("swStartBtn");
      var pauseBtn = document.getElementById("swPauseBtn");
      var lapBtn = document.getElementById("swLapBtn");
      var resetBtn = document.getElementById("swResetBtn");
      var lapsEl = document.getElementById("swLaps");
      var startTime = 0, elapsed = 0;
      var timer = null, running = false;
      var laps = [];
      function format(ms) {
        var totalSec = ms / 1000;
        var m = Math.floor(totalSec / 60);
        var s = totalSec % 60;
        return ("0"+m).slice(-2) + ":" + s.toFixed(2).padStart(5,"0");
      }
      function update() {
        var now = Date.now();
        elapsed = startTime ? now - startTime + (elapsed) : elapsed;
        display.textContent = format(elapsed);
      }
      function start() {
        if (running) return;
        startTime = Date.now();
        running = true;
        timer = setInterval(function() {
          var now = Date.now();
          display.textContent = format(now - startTime + elapsed);
        }, 30);
      }
      function pause() {
        if (!running) return;
        clearInterval(timer);
        update();
        elapsed = elapsed;
        startTime = 0;
        running = false;
      }
      function lap() {
        if (!running) return;
        laps.push(format(Date.now() - startTime + elapsed));
        lapsEl.innerHTML = laps.map(function(l, i){ return "<div style=\"padding:2px 0\">#" + (i+1) + " " + l + "</div>"; }).join("");
      }
      function reset() {
        clearInterval(timer);
        startTime = 0;
        elapsed = 0;
        running = false;
        laps = [];
        lapsEl.innerHTML = "<div style=\"color:var(--text-tertiary);font-size:0.75rem\">" + __("tool.stopwatch.noLaps") + "</div>";
        display.textContent = "00:00.00";
      }
      startBtn.addEventListener("click", start);
      pauseBtn.addEventListener("click", pause);
      lapBtn.addEventListener("click", lap);
      resetBtn.addEventListener("click", reset);
    },
    destroy: function () { if (timer) clearInterval(timer); }
  };
})();