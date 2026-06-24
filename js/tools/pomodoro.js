// Tool :: Pomodoro Timer
(function () {
  const id = "pomodoro";
  const title = "番茄钟";
  const icon = "\u23F1\uFE0F";
  const category = "生产力";
  const description = "专注计时器，支持自定义时长和暂停";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = {
    id, title, icon,
    _timer: null,
    _remaining: 0,
    _running: false,
    _total: 0,

    render() {
      const box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = `
        <div class="tool-header">
          <span class="tool-header-icon">${icon}</span>
          <h2>${title}</h2>
        </div>
        <div class="tool-content">
          <div class="pomodoro-display">
            <div class="pomodoro-time" id="pmTime">25:00</div>
            <div class="pomodoro-label" id="pmLabel">专注时间</div>
          </div>
          <div class="flex-row" style="justify-content:center;gap:12px">
            <button class="btn btn-primary" id="pmStartBtn">开始</button>
            <button class="btn btn-secondary" id="pmPauseBtn" disabled>暂停</button>
            <button class="btn btn-secondary" id="pmResetBtn">重置</button>
          </div>
          <div style="margin-top:8px">
            <label>专注时长（分钟）</label>
            <div class="flex-row">
              <button class="btn btn-secondary" data-min="25">25</button>
              <button class="btn btn-secondary" data-min="15">15</button>
              <button class="btn btn-secondary" data-min="30">30</button>
              <button class="btn btn-secondary" data-min="45">45</button>
              <button class="btn btn-secondary" data-min="60">60</button>
            </div>
          </div>
          <div style="margin-top:8px">
            <label class="toggle-wrap">
              <input type="checkbox" id="pmAutoReset" checked>
              <span class="toggle-label">完成后自动重置</span>
            </label>
          </div>
          <div id="pmProgress" style="height:4px;background:var(--bg-input-border);border-radius:2px;margin-top:8px;overflow:hidden">
            <div id="pmProgressBar" style="height:100%;width:100%;background:var(--accent-gradient);border-radius:2px;transition:width 1s linear"></div>
          </div>
        </div>
      `;
      return box;
    },
    init() {
      const timeEl = document.getElementById("pmTime");
      const labelEl = document.getElementById("pmLabel");
      const startBtn = document.getElementById("pmStartBtn");
      const pauseBtn = document.getElementById("pmPauseBtn");
      const resetBtn = document.getElementById("pmResetBtn");
      const progressBar = document.getElementById("pmProgressBar");

      const setTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        timeEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        if (this._total > 0) {
          progressBar.style.width = `${(seconds / this._total) * 100}%`;
        }
      };

      const stopTimer = () => {
        if (this._timer) { clearInterval(this._timer); this._timer = null; }
        this._running = false;
        startBtn.textContent = "开始";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        labelEl.textContent = "已暂停";
      };

      const startTimer = () => {
        if (this._timer) clearInterval(this._timer);
        this._running = true;
        startBtn.textContent = "运行中";
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        labelEl.textContent = "专注中…";

        this._timer = setInterval(() => {
          this._remaining--;
          setTime(this._remaining);
          if (this._remaining <= 0) {
            stopTimer();
            timeEl.textContent = "00:00";
            progressBar.style.width = "0%";
            labelEl.textContent = "时间到！";
            showCopyFeedback("⏰ 时间到！");
            if (document.getElementById("pmAutoReset").checked) {
              setTimeout(() => this._reset(), 2000);
            }
          }
        }, 1000);
      };

      this._reset = () => {
        stopTimer();
        this._remaining = this._total;
        setTime(this._remaining);
        labelEl.textContent = "专注时间";
        startBtn.textContent = "开始";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
      };

      // Init total
      const presets = document.querySelectorAll("[data-min]");
      presets.forEach(btn => {
        btn.addEventListener("click", () => {
          const mins = parseInt(btn.dataset.min);
          this._total = mins * 60;
          this._reset();
        });
      });

      startBtn.addEventListener("click", () => {
        if (this._remaining <= 0) {
          this._total = 25 * 60;
          this._remaining = this._total;
          setTime(this._remaining);
        }
        startTimer();
      });

      pauseBtn.addEventListener("click", () => {
        stopTimer();
      });

      resetBtn.addEventListener("click", () => this._reset());

      // Default 25 min
      this._total = 25 * 60;
      this._remaining = this._total;
      setTime(this._remaining);
    },
    destroy() {
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
      this._running = false;
    }
  };
})();
