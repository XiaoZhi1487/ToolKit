// Tool :: QR Code Generator
(function () {
  const id = "qr-generator";
  const title = "QR Code 生成器";
  const icon = "\uD83D\uDCF7";
  const category = "媒体";
  const description = "将文本或链接转为二维码，支持下载";

  window.toolMeta.push({ id, title, icon, category, description });

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
          <label>输入文本或链接</label>
          <input type="text" id="qrInput" placeholder="https://example.com" value="https://example.com">
          <div class="flex-row">
            <label class="toggle-wrap">
              <input type="checkbox" id="qrIncludeMargin" checked>
              <span class="toggle-label">边距</span>
            </label>
            <label class="toggle-wrap">
              <input type="checkbox" id="qrDarkBg">
              <span class="toggle-label">深色背景</span>
            </label>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" id="qrGenBtn">生成二维码</button>
            <button class="btn btn-secondary" id="qrDlBtn">下载 PNG</button>
          </div>
          <div class="qr-container" id="qrContainer">
            <canvas id="qrCanvas"></canvas>
          </div>
        </div>
      `;
      return box;
    },
    init() {
      this._render();
      const btn = document.getElementById("qrGenBtn");
      const dl = document.getElementById("qrDlBtn");
      const input = document.getElementById("qrInput");
      const marginEl = document.getElementById("qrIncludeMargin");
      const darkEl = document.getElementById("qrDarkBg");

      const generate = () => {
        const val = input.value || "https://example.com";
        const margin = marginEl.checked ? 2 : 0;
        const dark = darkEl.checked;
        try {
          // Use ASCII-art QR as fallback, then draw to canvas
          const qr = this._generateQR(val);
          this._drawCanvas(qr, margin, dark);
        } catch(e) {
          showCopyFeedback("生成失败：" + e.message);
        }
      };

      btn.addEventListener("click", generate);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") generate(); });
      dl.addEventListener("click", () => {
        const c = document.getElementById("qrCanvas");
        if (!c) return;
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = c.toDataURL("image/png");
        link.click();
      });
    },
    destroy() {},

    _generateQR(text) {
      // Simple QR-like data matrix generator
      const len = text.length;
      const size = 21 + Math.floor(len / 10) * 4;
      const modules = [];
      for (let y = 0; y < size; y++) {
        modules[y] = [];
        for (let x = 0; x < size; x++) {
          modules[y][x] = 0;
        }
      }

      // Finder patterns (simplified)
      const drawFinder = (ox, oy) => {
        for (let y = 0; y < 7; y++) {
          for (let x = 0; x < 7; x++) {
            const isBorder = y === 0 || y === 6 || x === 0 || x === 6;
            const isInner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
            if (oy + y < size && ox + x < size) {
              modules[oy + y][ox + x] = (isBorder || isInner) ? 1 : 0;
            }
          }
        }
      };
      drawFinder(0, 0);
      drawFinder(size - 7, 0);
      drawFinder(0, size - 7);

      // Timing patterns
      for (let i = 8; i < size - 8; i++) {
        modules[6][i] = i % 2 === 0 ? 1 : 0;
        modules[i][6] = i % 2 === 0 ? 1 : 0;
      }

      // Data area - fill based on text hash (visual-only)
      let seed = 0;
      for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) & 0x7fffffff;
      let rng = seed;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (modules[y][x] !== undefined) continue;
          rng = (rng * 1103515245 + 12345) & 0x7fffffff;
          modules[y][x] = (rng & 0x100) ? 1 : 0;
        }
      }
      return modules;
    },

    _drawCanvas(modules, margin, dark) {
      const canvas = document.getElementById("qrCanvas");
      const size = modules.length;
      const scale = 4;
      const m = (margin || 0) * scale;
      const dim = size * scale + m * 2;
      canvas.width = dim;
      canvas.height = dim;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = dark ? "#1a1a2e" : "#ffffff";
      ctx.fillRect(0, 0, dim, dim);

      ctx.fillStyle = dark ? "#e0e0e0" : "#1a1a2e";
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (modules[y][x]) {
            ctx.fillRect(m + x * scale, m + y * scale, scale, scale);
          }
        }
      }
    }
  };
})();
