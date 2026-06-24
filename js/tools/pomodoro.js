// Tool :: Pomodoro Timer
(function () {
  var id = "pomodoro";
  var title = "Pomodoro Timer";
  var icon = "\u23F1\uFE0F";
  var category = "Productivity";
  var description = "Focus timer with customizable duration and pause support";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = {
    id: id, title: title, icon: icon,
    _timer: null,
    _remaining: 0,
    _running: false,
    _total: 0,

    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\">",
        "  <span class=\"tool-header-icon\">" + icon + "</span>",
        "  <h2>" + __('tool.' + id + '.title') + "</h2>",
        "</div>",
        "<div class=\"tool-content\">",
        "  <div class=\"pomodoro-display\">",
        "    <div class=\"pomodoro-time\" id=\"pmTime\">25:00</div>",
        "    <div class=\"pomodoro-label\" id=\"pmLabel\">" + __('tool.' + id + '.focus') + "</div>",
        "  </div>",
        "  <div class=\"flex-row\" style=\"justify-content:center;gap:12px\">",
        "    <button class=\"btn btn-primary\" id=\"pmStartBtn\">" + __('tool.' + id + '.start') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"pmPauseBtn\" disabled>" + __('tool.' + id + '.pause') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"pmResetBtn\">" + __('tool.' + id + '.reset') + "</button>",
        "  </div>",
        "  <div style=\"margin-top:8px\">",
        "    <label>" + __('tool.' + id + '.focusDuration') + "</label>",
        "    <div class=\"flex-row\">",
        "      <button class=\"btn btn-secondary\" data-min=\"25\">25</button>",
        "      <button class=\"btn btn-secondary\" data-min=\"15\">15</button>",
        "      <button class=\"btn btn-secondary\" data-min=\"30\">30</button>",
        "      <button class=\"btn btn-secondary\" data-min=\"45\">45</button>",
        "      <button class=\"btn btn-secondary\" data-min=\"60\">60</button>",
        "    </div>",
        "  </div>",
        "  <div style=\"margin-top:8px\">",
        "    <label class=\"toggle-wrap\">",
        "      <input type=\"checkbox\" id=\"pmAutoReset\" checked>",
        "      <span class=\"toggle-label\">" + __('tool.' + id + '.autoReset') + "</span>",
        "    </label>",
        "  </div>",
        "  <div id=\"pmProgress\" style=\"height:4px;background:var(--bg-input-border);border-radius:2px;margin-top:8px;overflow:hidden\">",
        "    <div id=\"pmProgressBar\" style=\"height:100%;width:100%;background:var(--accent-gradient);border-radius:2px;transition:width 1s linear\"></div>",
        "  </div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var timeEl = document.getElementById("pmTime");
      var labelEl = document.getElementById("pmLabel");
      var startBtn = document.getElementById("pmStartBtn");
      var pauseBtn = document.getElementById("pmPauseBtn");
      var resetBtn = document.getElementById("pmResetBtn");
      var progressBar = document.getElementById("pmProgressBar");
      var self = this;

      function setTime(seconds) {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        timeEl.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
        if (self._total > 0) {
          progressBar.style.width = (seconds / self._total) * 100 + "%";
        }
      }

      function stopTimer() {
        if (self._timer) { clearInterval(self._timer); self._timer = null; }
        self._running = false;
        startBtn.textContent = __('tool.' + id + '.start');
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        labelEl.textContent = __('tool.' + id + '.paused');
      }

      function startTimer() {
        if (self._timer) clearInterval(self._timer);
        self._running = true;
        startBtn.textContent = __('tool.' + id + '.running');
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        labelEl.textContent = __('tool.' + id + '.focusing');

        self._timer = setInterval(function () {
          self._remaining--;
          setTime(self._remaining);
          if (self._remaining <= 0) {
            stopTimer();
            timeEl.textContent = "00:00";
            progressBar.style.width = "0%";
            labelEl.textContent = __('tool.' + id + '.timeUp');
            showCopyFeedback("\u23F0 " + __('tool.' + id + '.timeUp'));
            if (document.getElementById("pmAutoReset").checked) {
              setTimeout(function () { self._reset(); }, 2000);
            }
          }
        }, 1000);
      }

      this._reset = function () {
        stopTimer();
        self._remaining = self._total;
        setTime(self._remaining);
        labelEl.textContent = __('tool.' + id + '.focus');
        startBtn.textContent = __('tool.' + id + '.start');
        startBtn.disabled = false;
        pauseBtn.disabled = true;
      };

      var presets = document.querySelectorAll("[data-min]");
      presets.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var mins = parseInt(btn.dataset.min);
          self._total = mins * 60;
          self._reset();
        });
      });

      startBtn.addEventListener("click", function () {
        if (self._remaining <= 0) {
          self._total = 25 * 60;
          self._remaining = self._total;
          setTime(self._remaining);
        }
        startTimer();
      });

      pauseBtn.addEventListener("click", function () {
        stopTimer();
      });

      resetBtn.addEventListener("click", function () { self._reset(); });

      self._total = 25 * 60;
      self._remaining = self._total;
      setTime(self._remaining);
    },
    destroy: function () {
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
      this._running = false;
    }
  };
})();