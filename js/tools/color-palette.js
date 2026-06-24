// Tool :: Color Palette
(function () {
  const id = "color-palette";
  const title = "色彩调色板";
  const icon = "\uD83C\uDFA8";
  const category = "设计";
  const description = "颜色选择器，支持 HEX / RGB / HSL 互转和色板生成";

  window.toolMeta.push({ id, title, icon, category, description });

  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) { h = 0; s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  }

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
          <label>选择颜色</label>
          <input type="color" id="cpPicker" value="#6366f1">
          <div class="color-preview" id="cpPreview" style="background:#6366f1"></div>
          <div class="grid-2">
            <div><label>HEX</label><input type="text" id="cpHex" value="#6366f1"></div>
            <div><label>RGB</label><input type="text" id="cpRgb" value="rgb(99, 102, 241)"></div>
            <div><label>HSL</label><input type="text" id="cpHsl" value="hsl(239, 84%, 67%)"></div>
            <div><label>CSS 变量名</label><input type="text" id="cpVarName" value="--accent-1"></div>
          </div>
          <label>生成配色方案</label>
          <div class="btn-group">
            <button class="btn btn-secondary" data-palette="mono">单色</button>
            <button class="btn btn-secondary" data-palette="complement">互补</button>
            <button class="btn btn-secondary" data-palette="triad">三角</button>
            <button class="btn btn-secondary" data-palette="analogous">邻近</button>
          </div>
          <div class="color-swatch-grid" id="cpSwatches"></div>
        </div>
      `;
      return box;
    },
    init() {
      const picker = document.getElementById("cpPicker");
      const preview = document.getElementById("cpPreview");
      const hex = document.getElementById("cpHex");
      const rgb = document.getElementById("cpRgb");
      const hsl = document.getElementById("cpHsl");
      const swatches = document.getElementById("cpSwatches");

      const update = (color) => {
        preview.style.background = color;
        picker.value = color;
        hex.value = color;
        const { r, g, b } = hexToRgb(color);
        rgb.value = `rgb(${r}, ${g}, ${b})`;
        const { h, s, l } = rgbToHsl(r, g, b);
        hsl.value = `hsl(${h}, ${s}%, ${l}%)`;
      };

      const generatePalette = (type) => {
        const { h, s, l } = rgbToHsl(
          ...Object.values(hexToRgb(picker.value))
        );
        let colors = [];
        const steps = 5;

        switch (type) {
          case "mono":
            for (let i = 0; i < steps; i++)
              colors.push(rgbToHex(...Object.values(hslToRgb(h, s, Math.max(10, Math.min(90, 20 + i * 15))))));
            break;
          case "complement":
            colors.push(picker.value);
            colors.push(rgbToHex(...Object.values(hslToRgb((h + 180) % 360, s, l))));
            for (let i = 1; i <= 3; i++) {
              colors.push(rgbToHex(...Object.values(hslToRgb(h, Math.max(5, s - i * 15), Math.max(15, l - i * 10)))));
            }
            break;
          case "triad":
            colors.push(picker.value);
            colors.push(rgbToHex(...Object.values(hslToRgb((h + 120) % 360, s, l))));
            colors.push(rgbToHex(...Object.values(hslToRgb((h + 240) % 360, s, l))));
            colors.push(rgbToHex(...Object.values(hslToRgb(h, s, Math.max(15, l - 15)))));
            colors.push(rgbToHex(...Object.values(hslToRgb(h, s, Math.min(85, l + 15)))));
            break;
          case "analogous":
            for (let i = -2; i <= 2; i++)
              colors.push(rgbToHex(...Object.values(hslToRgb((h + i * 30 + 360) % 360, s, l))));
            break;
        }

        swatches.innerHTML = colors.map(c =>
          `<div class="color-swatch" style="background:${c}" data-color="${c}" title="${c}"></div>`
        ).join("");

        swatches.querySelectorAll(".color-swatch").forEach(el => {
          el.addEventListener("click", () => {
            update(el.dataset.color);
          });
        });
      };

      picker.addEventListener("input", () => update(picker.value));
      hex.addEventListener("change", () => {
        if (/^#[0-9a-f]{6}$/i.test(hex.value)) update(hex.value);
      });

      document.querySelectorAll("[data-palette]").forEach(btn => {
        btn.addEventListener("click", () => generatePalette(btn.dataset.palette));
      });

      generatePalette("mono");
    },
    destroy() {}
  };
})();
