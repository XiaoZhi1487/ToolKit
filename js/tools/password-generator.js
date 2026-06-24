// Tool :: Password Generator
(function () {
  const id = "password-generator";
  const title = "密码生成器";
  const icon = "\uD83D\uDD10";
  const category = "安全";
  const description = "生成强密码，支持自定义长度和字符类型";

  window.toolMeta.push({ id, title, icon, category, description });

  const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DIGITS = "0123456789";
  const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  window.tools[id] = {
    id, title, icon,
    render() {
      const box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = `
        <div class="tool-header">
          <span class="tool-header-icon">${icon}</span>
          <h2>${title}</h2>
        </div>
        <div class="tool-content">
          <div class="flex-row">
            <label style="flex:1">长度: <strong id="pwLenLabel">16</strong></label>
            <span style="color:var(--text-tertiary);font-size:0.75rem">8 – 64</span>
          </div>
          <input type="range" id="pwLength" min="8" max="64" value="16">
          <label class="toggle-wrap"><input type="checkbox" id="pwUpper" checked><span class="toggle-label">大写字母 (A-Z)</span></label>
          <label class="toggle-wrap"><input type="checkbox" id="pwLower" checked><span class="toggle-label">小写字母 (a-z)</span></label>
          <label class="toggle-wrap"><input type="checkbox" id="pwDigits" checked><span class="toggle-label">数字 (0-9)</span></label>
          <label class="toggle-wrap"><input type="checkbox" id="pwSymbols"><span class="toggle-label">特殊符号 (!@#$...)</span></label>
          <label class="toggle-wrap"><input type="checkbox" id="pwExcludeAmbiguous"><span class="toggle-label">排除易混淆字符 (il1Lo0O)</span></label>
          <div class="mt-2">
            <label>强度</label>
            <div class="strength-meter" id="pwMeter">
              <div class="strength-bar"></div>
              <div class="strength-bar"></div>
              <div class="strength-bar"></div>
              <div class="strength-bar"></div>
            </div>
          </div>
          <div class="output-box mt-2" id="pwOutput">
            <span id="pwResult">点击生成</span>
            <button class="copy-btn" id="pwCopyBtn">复制</button>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" id="pwGenBtn">生成密码</button>
          </div>
        </div>
      `;
      return box;
    },
    init() {
      const lenEl = document.getElementById("pwLength");
      const lenLabel = document.getElementById("pwLenLabel");
      const genBtn = document.getElementById("pwGenBtn");
      const output = document.getElementById("pwResult");
      const copyBtn = document.getElementById("pwCopyBtn");
      const meter = document.getElementById("pwMeter");

      const update = () => {
        const len = +lenEl.value;
        lenLabel.textContent = len;
        const pw = this._generate(len);
        output.textContent = pw;
        this._updateMeter(pw, meter);
      };

      lenEl.addEventListener("input", update);
      genBtn.addEventListener("click", update);
      copyBtn.addEventListener("click", () => {
        copyToClipboard(output.textContent);
      });

      update();
    },
    destroy() {},

    _generate(len) {
      let chars = "";
      if (document.getElementById("pwLower").checked) chars += LOWERCASE;
      if (document.getElementById("pwUpper").checked) chars += UPPERCASE;
      if (document.getElementById("pwDigits").checked) chars += DIGITS;
      if (document.getElementById("pwSymbols").checked) chars += SYMBOLS;

      if (!chars) chars = LOWERCASE + UPPERCASE + DIGITS;

      if (document.getElementById("pwExcludeAmbiguous").checked) {
        chars = chars.replace(/[il1Lo0O]/g, "");
      }

      let result = "";
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      for (let i = 0; i < len; i++) {
        result += chars[array[i] % chars.length];
      }
      return result;
    },

    _updateMeter(pw, meter) {
      const bars = meter.querySelectorAll(".strength-bar");
      let score = 0;
      if (pw.length >= 12) score++;
      if (pw.length >= 20) score++;
      if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
      if (/\d/.test(pw)) score++;
      if (/[^a-zA-Z0-9]/.test(pw)) score++;

      const levels = ["weak", "medium", "strong", "strong"];
      bars.forEach((b, i) => {
        b.className = "strength-bar";
        if (i < score) b.classList.add("active", levels[i] || "strong");
      });
    }
  };
})();
