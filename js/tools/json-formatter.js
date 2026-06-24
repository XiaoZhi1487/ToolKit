// Tool :: JSON Formatter
(function () {
  const id = "json-formatter";
  const title = "JSON 格式化";
  const icon = "{ }";
  const category = "开发者";
  const description = "格式化、压缩和验证 JSON 数据";

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
          <div class="tab-bar" id="jsonTabBar">
            <button class="tab-btn active" data-tab="format">格式化</button>
            <button class="tab-btn" data-tab="compress">压缩</button>
          </div>
          <textarea id="jsonInput" rows="8" placeholder='{"name": "ToolKit", "version": 1}' spellcheck="false"></textarea>
          <div class="btn-group">
            <button class="btn btn-primary" id="jsonRunBtn">执行</button>
            <button class="btn btn-secondary" id="jsonClearBtn">清空</button>
          </div>
          <div id="jsonError" style="font-size:0.8125rem;color:var(--red);min-height:20px"></div>
          <div class="output-box" id="jsonOutput" style="white-space:pre;overflow:auto;max-height:400px">
            等待输入…
          </div>
        </div>
      `;
      return box;
    },
    init() {
      const input = document.getElementById("jsonInput");
      const output = document.getElementById("jsonOutput");
      const error = document.getElementById("jsonError");
      const runBtn = document.getElementById("jsonRunBtn");
      const clearBtn = document.getElementById("jsonClearBtn");
      const tabBar = document.getElementById("jsonTabBar");
      let mode = "format";

      tabBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.tab;
      });

      const run = () => {
        error.textContent = "";
        try {
          const parsed = JSON.parse(input.value);
          if (mode === "format") {
            output.textContent = JSON.stringify(parsed, null, 2);
          } else {
            output.textContent = JSON.stringify(parsed);
          }
        } catch (e) {
          error.textContent = "❌ " + e.message;
          output.textContent = input.value;
        }
      };

      runBtn.addEventListener("click", run);
      clearBtn.addEventListener("click", () => {
        input.value = "";
        output.textContent = "等待输入…";
        error.textContent = "";
      });
      input.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
      });
      run();
    },
    destroy() {}
  };
})();
