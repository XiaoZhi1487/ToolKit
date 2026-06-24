// Tool :: Text Analyzer
(function () {
  const id = "text-analyzer";
  const title = "文本分析器";
  const icon = "\uD83D\uDCCA";
  const category = "文本";
  const description = "统计字数、字符数、段落、行数和阅读时间";

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
          <label>输入文本</label>
          <textarea id="taInput" rows="8" placeholder="粘贴或输入文本…"></textarea>
          <div class="grid-2">
            <div class="output-box" style="text-align:center;font-family:var(--font-sans)">
              <div style="font-size:1.5rem;font-weight:700" id="taChars">0</div>
              <div style="font-size:0.75rem;color:var(--text-tertiary)">字符数</div>
            </div>
            <div class="output-box" style="text-align:center;font-family:var(--font-sans)">
              <div style="font-size:1.5rem;font-weight:700" id="taWords">0</div>
              <div style="font-size:0.75rem;color:var(--text-tertiary)">单词 / 字数</div>
            </div>
            <div class="output-box" style="text-align:center;font-family:var(--font-sans)">
              <div style="font-size:1.5rem;font-weight:700" id="taLines">0</div>
              <div style="font-size:0.75rem;color:var(--text-tertiary)">行数</div>
            </div>
            <div class="output-box" style="text-align:center;font-family:var(--font-sans)">
              <div style="font-size:1.5rem;font-weight:700" id="taParas">0</div>
              <div style="font-size:0.75rem;color:var(--text-tertiary)">段落数</div>
            </div>
          </div>
          <div class="output-box" style="font-family:var(--font-sans);text-align:center">
            <span style="color:var(--text-tertiary)">阅读时间 ≈ </span>
            <strong id="taReadTime">0</strong>
            <span style="color:var(--text-tertiary)"> 分钟</span>
          </div>
        </div>
      `;
      return box;
    },
    init() {
      const input = document.getElementById("taInput");
      const update = () => {
        const text = input.value;
        document.getElementById("taChars").textContent = text.length;
        document.getElementById("taWords").textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById("taLines").textContent = text ? text.split("\n").length : 0;
        document.getElementById("taParas").textContent = text ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById("taReadTime").textContent = Math.max(1, Math.ceil(words / 200));
      };
      input.addEventListener("input", update);
    },
    destroy() {}
  };
})();
