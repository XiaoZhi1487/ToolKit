// Tool :: UUID Generator
(function () {
  const id = "uuid-generator";
  const title = "UUID 生成器";
  const icon = "\uD83D\uDD11";
  const category = "开发者";
  const description = "生成 UUID v4 / v7 以及批量生成";
  window.toolMeta.push({ id, title, icon, category, description });
  function uuidV4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  function uuidV7() {
    const now = Date.now();
    const hex = now.toString(16).padStart(12, "0");
    const random = crypto.getRandomValues(new Uint8Array(10));
    return (
      hex.slice(0,8)+"-"+hex.slice(8,12)+"-7"+(random[0]&0x0f).toString(16)+
      Array.from(random.slice(1,5)).map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,4)+"-"+
      Array.from(random.slice(5)).map(b=>b.toString(16).padStart(2,"0")).join("")
    );
  }
  window.tools[id] = { id, title, icon,
    render() {
      const box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = `
        <div class="tool-header"><span class="tool-header-icon">${icon}</span><h2>${title}</h2></div>
        <div class="tool-content">
          <div class="tab-bar" id="uuidTabBar">
            <button class="tab-btn active" data-type="v4">UUID v4</button>
            <button class="tab-btn" data-type="v7">UUID v7</button>
          </div>
          <label>批量数量</label>
          <div class="flex-row">
            <input type="number" id="uuidCount" value="1" min="1" max="100" style="width:80px">
            <button class="btn btn-primary" id="uuidGenBtn">生成</button>
          </div>
          <textarea id="uuidOutput" rows="6" readonly style="font-family:var(--font-mono);font-size:0.75rem"></textarea>
          <button class="btn btn-secondary" id="uuidCopyBtn">复制全部</button>
        </div>
      `;
      return box;
    },
    init() {
      const output=document.getElementById("uuidOutput"), genBtn=document.getElementById("uuidGenBtn");
      const copyBtn=document.getElementById("uuidCopyBtn"), countEl=document.getElementById("uuidCount");
      const tabBar=document.getElementById("uuidTabBar");
      let type="v4";
      tabBar.addEventListener("click",e=>{
        const btn=e.target.closest(".tab-btn"); if(!btn)return;
        tabBar.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active"); type=btn.dataset.type; generate();
      });
      const generate=()=>{
        const count=Math.min(100,Math.max(1,parseInt(countEl.value)||1));
        const fn=type==="v4"?uuidV4:uuidV7;
        output.value=Array.from({length:count},()=>fn()).join("\n");
      };
      genBtn.addEventListener("click",generate);
      copyBtn.addEventListener("click",()=>copyToClipboard(output.value));
      generate();
    },
    destroy(){}
  };
})();
