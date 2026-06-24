// Tool :: Base64 Encoder / Decoder
(function () {
  const id = "base64";
  const title = "Base64 编解码";
  const icon = "\u2194\uFE0F";
  const category = "开发者";
  const description = "将文本编码为 Base64 或解码 Base64 为原始文本";

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
          <div class="tab-bar" id="b64TabBar">
            <button class="tab-btn active" data-tab="encode">编码 (→)</button>
            <button class="tab-btn" data-tab="decode">解码 (←)</button>
          </div>
          <textarea id="b64Input" rows="6" placeholder="输入文本…" spellcheck="false"></textarea>
          <div class="btn-group">
            <button class="btn btn-primary" id="b64RunBtn">执行</button>
            <button class="btn btn-secondary" id="b64SwapBtn">互换</button>
            <button class="btn btn-secondary" id="b64ClearBtn">清空</button>
          </div>
          <div class="output-box" id="b64Output" style="word-break:break-all">结果</div>
        </div>
      `;
      return box;
    },
    init() {
      const input = document.getElementById("b64Input");
      const output = document.getElementById("b64Output");
      const runBtn = document.getElementById("b64RunBtn");
      const swapBtn = document.getElementById("b64SwapBtn");
      const clearBtn = document.getElementById("b64ClearBtn");
      const tabBar = document.getElementById("b64TabBar");
      let mode = "encode";

      tabBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.tab;
        input.placeholder = mode === "encode" ? "输入文本…" : "输入 Base64…";
        run();
      });

      const run = () => {
        try {
          if (mode === "encode") {
            output.textContent = btoa(unescape(encodeURIComponent(input.value)));
          } else {
            output.textContent = decodeURIComponent(escape(atob(input.value.trim())));
          }
        } catch (e) {
          output.textContent = "❌ 错误: " + e.message;
        }
      };

      runBtn.addEventListener("click", run);
      swapBtn.addEventListener("click", () => {
        const cur = output.textContent;
        if (cur && !cur.startsWith("❌")) {
          input.value = cur;
          const active = tabBar.querySelector(".tab-btn.active");
          const other = tabBar.querySelector('.tab-btn:not(.active)');
          if (other) {
            tabBar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            other.classList.add("active");
            mode = other.dataset.tab;
            input.placeholder = mode === "encode" ? "输入文本…" : "输入 Base64…";
          }
          run();
        }
      });
      clearBtn.addEventListener("click", () => { input.value = ""; output.textContent = "结果"; });
      run();
    },
    destroy() {}
  };
})();
