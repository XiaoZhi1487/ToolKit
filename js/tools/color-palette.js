// Tool :: Color Palette - Enhanced with copy functionality
(function () {
  var id = "color-palette";
  var title = "Color Palette";
  var icon = "\ud83c\udfa8";
  var category = "Design";
  var description = "Color picker with HEX/RGB/HSL conversion, palette generation (mono, complement, triad, analogous)";
  window.toolMeta.push({ id, title, icon, category, description });

  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    } else { s = 0; }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hexToRgb(hex) {
    var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.color-palette.pickColor") + "</label>" +
        "<input type=\"color\" id=\"cpPicker\" value=\"#6366f1\">" +
        "<div class=\"color-preview\" id=\"cpPreview\" style=\"background:#6366f1;height:60px;border-radius:var(--radius-md);cursor:pointer\" title=\"" + __("tool.color-palette.clickCopy") + " HEX\"></div>" +
        "<div class=\"grid-2\">" +
        "  <div><label>HEX</label><div class=\"output-box\" id=\"cpHex\" style=\"cursor:pointer;font-size:0.8125rem\" title=\"" + __("tool.color-palette.clickCopy") + "\">#6366f1</div></div>" +
        "  <div><label>RGB</label><div class=\"output-box\" id=\"cpRgb\" style=\"cursor:pointer;font-size:0.8125rem\" title=\"" + __("tool.color-palette.clickCopy") + "\">rgb(99,102,241)</div></div>" +
        "  <div><label>HSL</label><div class=\"output-box\" id=\"cpHsl\" style=\"cursor:pointer;font-size:0.8125rem\" title=\"" + __("tool.color-palette.clickCopy") + "\">hsl(239,84%,67%)</div></div>" +
        "  <div><label>CSS Variable</label><input type=\"text\" id=\"cpVarName\" value=\"--accent-1\"></div>" +
        "</div>" +
        "<label>" + __("tool.color-palette.paletteGen") + "</label>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-secondary\" data-palette=\"mono\">" + __("tool.color-palette.monochrome") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-palette=\"complement\">" + __("tool.color-palette.complement") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-palette=\"triad\">" + __("tool.color-palette.triad") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-palette=\"analogous\">" + __("tool.color-palette.analogous") + "</button>" +
        "</div>" +
        "<div class=\"color-swatch-grid\" id=\"cpSwatches\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var picker = document.getElementById("cpPicker");
      var preview = document.getElementById("cpPreview");
      var hex = document.getElementById("cpHex");
      var rgb = document.getElementById("cpRgb");
      var hsl = document.getElementById("cpHsl");
      var varName = document.getElementById("cpVarName");
      var swatches = document.getElementById("cpSwatches");

      function copyToClipWithFeedback(text) {
        copyToClipboard(text);
      }

      function update(color) {
        preview.style.background = color;
        picker.value = color;
        hex.textContent = color;
        var c = hexToRgb(color);
        rgb.textContent = "rgb(" + c.r + "," + c.g + "," + c.b + ")";
        var h = rgbToHsl(c.r, c.g, c.b);
        hsl.textContent = "hsl(" + h.h + "," + h.s + "%," + h.l + "%)";
      }

      function generatePalette(type) {
        var c = hexToRgb(picker.value);
        var h = rgbToHsl(c.r, c.g, c.b);
        var colors = [];
        switch (type) {
          case "mono":
            for (var i = 0; i < 6; i++) colors.push(rgbToHex.apply(null, Object.values(hslToRgb(h.h, h.s, Math.max(8, Math.min(92, 15 + i * 13))))));
            break;
          case "complement":
            colors.push(picker.value);
            colors.push(rgbToHex.apply(null, Object.values(hslToRgb((h.h + 180) % 360, h.s, h.l))));
            for (var i = 1; i <= 3; i++) colors.push(rgbToHex.apply(null, Object.values(hslToRgb(h.h, Math.max(5, h.s - i * 20), Math.max(20, h.l - i * 12)))));
            break;
          case "triad":
            colors.push(picker.value);
            colors.push(rgbToHex.apply(null, Object.values(hslToRgb((h.h + 120) % 360, h.s, h.l))));
            colors.push(rgbToHex.apply(null, Object.values(hslToRgb((h.h + 240) % 360, h.s, h.l))));
            colors.push(rgbToHex.apply(null, Object.values(hslToRgb(h.h, h.s, Math.max(15, h.l - 20)))));
            colors.push(rgbToHex.apply(null, Object.values(hslToRgb(h.h, h.s, Math.min(85, h.l + 20)))));
            break;
          case "analogous":
            for (var i = -2; i <= 2; i++) colors.push(rgbToHex.apply(null, Object.values(hslToRgb((h.h + i * 25 + 360) % 360, h.s, h.l))));
            break;
        }
        swatches.innerHTML = colors.map(function (c2) {
          return "<div class=\"color-swatch\" style=\"background:" + c2 + "\" data-color=\"" + c2 + "\" title=\"" + __("tool.color-palette.clickCopy") + " " + c2 + "\"></div>";
        }).join("");
        swatches.querySelectorAll(".color-swatch").forEach(function (el) {
          el.addEventListener("click", function () { update(el.dataset.color); });
          el.addEventListener("dblclick", function () { copyToClipboard(el.dataset.color); showCopyFeedback(__("tool.color-palette.copied") + " " + el.dataset.color); });
        });
      }

      picker.addEventListener("input", function () { update(picker.value); });
      hex.addEventListener("click", function () { copyToClipboard(hex.textContent); showCopyFeedback("Copied " + hex.textContent); });
      rgb.addEventListener("click", function () { copyToClipboard(rgb.textContent); showCopyFeedback("Copied " + rgb.textContent); });
      hsl.addEventListener("click", function () { copyToClipboard(hsl.textContent); showCopyFeedback("Copied " + hsl.textContent); });
      preview.addEventListener("click", function () { copyToClipboard(hex.textContent); showCopyFeedback("Copied " + hex.textContent); });

      document.querySelectorAll("[data-palette]").forEach(function (btn) {
        btn.addEventListener("click", function () { generatePalette(btn.dataset.palette); });
      });
      generatePalette("mono");
    },
    destroy: function () {}
  };
})();
