// Tool :: Color Palette Scheme Generator
(function () {
  var id = "color-palette-scheme";
  var title = "Color Palette Scheme";
  var icon = "\ud83c\udfa8";
  var category = "Design";
  var description = "Generate harmonious color schemes from a base color";
  window.toolMeta.push({ id, title, icon, category, description });

  function hexToHsl(hex) {
    var r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    var max = Math.max(r,g,b), min = Math.min(r,g,b), h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else { var d = max - min; s = l > 0.5 ? d/(2-max-min) : d/(max+min); switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break;
      case g: h = ((b-r)/d + 2)/6; break;
      case b: h = ((r-g)/d + 4)/6; break;
    }}
    return { h: h*360, s: s*100, l: l*100 };
  }

  function hslToHex(h,s,l) {
    s /= 100; l /= 100; var c = (1-Math.abs(2*l-1))*s, x = c*(1-Math.abs((h/60)%2-1)), m = l-c/2;
    var r,g,b; if (h<60) { r=c;g=x;b=0; } else if (h<120) { r=x;g=c;b=0; } else if (h<180) { r=0;g=c;b=x; } else if (h<240) { r=0;g=x;b=c; } else if (h<300) { r=x;g=0;b=c; } else { r=c;g=0;b=x; }
    return '#'+[r,g,b].map(function(v){return Math.round((v+m)*255).toString(16).padStart(2,'0');}).join('');
  }

  function generateScheme(baseHex, type) {
    var hsl = hexToHsl(baseHex);
    var colors = [];
    var i;

    switch (type) {
      case 'monochromatic':
        for (i = 0; i < 6; i++) {
          var s = Math.max(10, Math.min(90, 30 + i * 12));
          var l = Math.max(10, Math.min(90, 20 + i * 12));
          colors.push(hslToHex(hsl.h, s, l));
        }
        break;
      case 'complementary':
        colors.push(baseHex);
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        for (i = 1; i <= 3; i++) {
          colors.push(hslToHex(hsl.h, Math.max(10, hsl.s - i * 20), Math.max(15, hsl.l - i * 10)));
        }
        colors.push(hslToHex((hsl.h + 180) % 360, Math.max(10, hsl.s - 20), Math.min(85, hsl.l + 15)));
        break;
      case 'analogous':
        for (i = -2; i <= 2; i++) {
          colors.push(hslToHex((hsl.h + i * 25 + 360) % 360, hsl.s, hsl.l));
        }
        colors.push(hslToHex(hsl.h, Math.max(10, hsl.s - 20), Math.max(15, hsl.l - 15)));
        break;
      case 'triadic':
        colors.push(baseHex);
        colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 20)));
        colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, Math.min(85, hsl.l + 20)));
        break;
      case 'tetradic':
        colors.push(baseHex);
        colors.push(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
        colors.push(hslToHex(hsl.h, Math.max(10, hsl.s - 25), Math.max(20, hsl.l - 15)));
        break;
      case 'splitComplementary':
        colors.push(baseHex);
        colors.push(hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
        colors.push(hslToHex(hsl.h, Math.max(10, hsl.s - 20), Math.max(20, hsl.l - 12)));
        colors.push(hslToHex((hsl.h + 150) % 360, Math.max(10, hsl.s - 15), Math.min(80, hsl.l + 15)));
        break;
    }
    return colors;
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:var(--spacing-md);flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:180px\"><label>" + __("tool.color-palette-scheme.baseColor") + "</label><input type=\"color\" id=\"cpsPicker\" value=\"#6366f1\" style=\"width:100%;height:40px;padding:2px;cursor:pointer\"></div>" +
        "  <div style=\"flex:1;min-width:180px\"><label>" + __("tool.color-palette-scheme.scheme") + "</label><select id=\"cpsScheme\" class=\"btn btn-secondary\" style=\"width:100%\">" +
        "    <option value=\"monochromatic\">" + __("tool.color-palette-scheme.monochromatic") + "</option>" +
        "    <option value=\"complementary\">" + __("tool.color-palette-scheme.complementary") + "</option>" +
        "    <option value=\"analogous\">" + __("tool.color-palette-scheme.analogous") + "</option>" +
        "    <option value=\"triadic\">" + __("tool.color-palette-scheme.triadic") + "</option>" +
        "    <option value=\"tetradic\">" + __("tool.color-palette-scheme.tetradic") + "</option>" +
        "    <option value=\"splitComplementary\">" + __("tool.color-palette-scheme.splitComplementary") + "</option>" +
        "  </select></div>" +
        "</div>" +
        "<div id=\"cpsSwatches\" style=\"display:flex;gap:var(--spacing-sm);flex-wrap:wrap;margin:var(--spacing-md) 0;min-height:60px\"></div>" +
        "<button class=\"btn btn-primary\" id=\"cpsCopyBtn\">" + __("tool.color-palette-scheme.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var picker = document.getElementById("cpsPicker");
      var scheme = document.getElementById("cpsScheme");
      var swatches = document.getElementById("cpsSwatches");
      var copyBtn = document.getElementById("cpsCopyBtn");

      function update() {
        var colors = generateScheme(picker.value, scheme.value);
        swatches.innerHTML = colors.map(function (c) {
          var lum = hexToHsl(c).l;
          var textColor = lum > 60 ? "#1f2937" : "#ffffff";
          return "<div class=\"color-swatch\" data-color=\"" + c + "\" style=\"background:" + c + ";width:80px;height:80px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;cursor:pointer;border:1px solid var(--bg-card-border);font-size:0.6875rem;font-family:var(--font-mono);color:" + textColor + ";word-break:break-all;padding:2px;text-align:center\">" + c + "</div>";
        }).join("");
        Array.from(swatches.children).forEach(function (el) {
          el.addEventListener("click", function () {
            copyToClipboard(el.dataset.color);
          });
        });
      }

      picker.addEventListener("input", update);
      scheme.addEventListener("change", update);
      copyBtn.addEventListener("click", function () {
        var colors = Array.from(swatches.children).map(function (el) { return el.dataset.color; });
        copyToClipboard(colors.join(", "));
      });
      update();
    },
    destroy: function () {}
  };
})();