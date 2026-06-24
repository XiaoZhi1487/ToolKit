// Tool :: URL Encoder / Decoder
(function () {
  const id = "url-encoder";
  const title = "URL 编解码";
  const icon = "\uD83D\uDD17";
  const category = "开发者";
  const description = "编码或解码 URL 字符串";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = { id, title, icon,
    render() {
      const box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = `
        <div class="tool-header">
          <span class="tool-header-icon">${icon}</span>
          <h2>${title}</h2>
        </div>
        <div class="tool-content">
          <div class="tab-bar" id="urlTabBar">
            <button class="tab-btn active" data-tab="encode">编码</button>
            <button class="tab-btn" data-tab="decode">解码</button>
          </div>
          <label>输入</label>
          <textarea id="urlInput" rows="4" placeholder="输入 URL 或文本…" spellcheck="false"></textarea>
          <div class="btn-group">
            <button class="btn btn-primary" id="urlRunBtn">执行</button>
            <button class="btn btn-secondary" id="urlSwapBtn">互换</button>
          </div>
          <label>结果</label>
          <div class="output-box" id="urlOutput">结果</div>
        </div>
      `;
      return box;
    },
    init() {
      const input = document.getElementById("urlInput");
      const output = document.getElementById("urlOutput");
      const runBtn = document.getElementById("urlRunBtn");
      const swapBtn = document.getElementById("urlSwapBtn");
      const tabBar = document.getElementById("urlTabBar");
      let mode = "encode";
      tabBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.tab;
        run();
      });
      const run = () => {
        try {
          output.textContent = mode === "encode"
            ? encodeURIComponent(input.value)
            : decodeURIComponent(input.value);
        } catch (e) {
          output.textContent = "\u274C 错误: " + e.message;
        }
      };
      runBtn.addEventListener("click", run);
      swapBtn.addEventListener("click", () => {
        const cur = output.textContent;
        if (cur && !cur.startsWith("\u274C")) {
          input.value = cur;
          const other = tabBar.querySelector(".tab-btn:not(.active)");
          if (other) {
            tabBar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            other.classList.add("active");
            mode = other.dataset.tab;
          }
          run();
        }
      });
      run();
    },
    destroy() {}
  };
})();
