// Tool :: Image Color Picker
(function () {
  var id = "color-picker";
  var title = "Image Color Picker";
  var icon = "\ud83c\udfa8";
  var category = "Media";
  var description = "Extract colors from uploaded images";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"cpUpload\" accept=\"image/*\" class=\"file-input\">" +
        "<div id=\"cpImageWrap\" style=\"position:relative;text-align:center;min-height:100px;display:flex;align-items:center;justify-content:center;background:var(--surface-secondary);border-radius:8px;padding:8px;margin-top:8px;cursor:crosshair\">" +
        "  <span style=\"color:var(--text-tertiary);font-size:0.875rem\" id=\"cpPlaceholder\">" + __("tool.color-picker.clickHint") + "</span>" +
        "  <canvas id=\"cpCanvas\" style=\"display:none;max-width:100%;max-height:400px\"></canvas>" +
        "</div>" +
        "<div class=\"flex-row\" style=\"gap:12px;margin-top:8px;flex-wrap:wrap\">" +
        "  <div style=\"display:flex;align-items:center;gap:8px\"><div id=\"cpSwatch\" style=\"width:40px;height:40px;border-radius:8px;border:2px solid var(--border);background:#ccc\"></div></div>" +
        "  <div><label style=\"font-size:0.75rem\">HEX</label><div id=\"cpHex\" style=\"font-family:var(--font-mono);cursor:pointer\">-</div></div>" +
        "  <div><label style=\"font-size:0.75rem\">RGB</label><div id=\"cpRgb\" style=\"font-family:var(--font-mono);cursor:pointer\">-</div></div>" +
        "  <div><label style=\"font-size:0.75rem\">HSL</label><div id=\"cpHsl\" style=\"font-family:var(--font-mono);cursor:pointer\">-</div></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("cpUpload");
      var canvas = document.getElementById("cpCanvas");
      var ctx = canvas.getContext("2d");
      var placeholder = document.getElementById("cpPlaceholder");
      var wrap = document.getElementById("cpImageWrap");
      var swatch = document.getElementById("cpSwatch");
      var hexEl = document.getElementById("cpHex");
      var rgbEl = document.getElementById("cpRgb");
      var hslEl = document.getElementById("cpHsl");
      var imgLoaded = false;
      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          var img = new Image();
          img.onload = function() {
            placeholder.style.display = "none";
            canvas.style.display = "block";
            var maxW = wrap.clientWidth - 16;
            var scale = Math.min(1, maxW / img.naturalWidth, 400 / img.naturalHeight);
            canvas.width = img.naturalWidth * scale;
            canvas.height = img.naturalHeight * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            imgLoaded = true;
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
      wrap.addEventListener("click", function(e) {
        if (!imgLoaded) return;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var px = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
        var r = px[0], g = px[1], b = px[2];
        var hex = "#" + [r,g,b].map(function(v){return ("0" + v.toString(16)).slice(-2);}).join("");
        var rgb = "rgb(" + r + "," + g + "," + b + ")";
        var r2 = r/255, g2 = g/255, b2 = b/255;
        var max = Math.max(r2,g2,b2), min = Math.min(r2,g2,b2);
        var h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          if (max === r2) h = ((g2 - b2) / d + (g2 < b2 ? 6 : 0)) / 6;
          else if (max === g2) h = ((b2 - r2) / d + 2) / 6;
          else h = ((r2 - g2) / d + 4) / 6;
        }
        var hsl = "hsl(" + Math.round(h * 360) + "," + Math.round(s * 100) + "%," + Math.round(l * 100) + "%)";
        swatch.style.background = hex;
        hexEl.textContent = hex;
        rgbEl.textContent = rgb;
        hslEl.textContent = hsl;
        [hexEl, rgbEl, hslEl].forEach(function(el) {
          el.onclick = function() { copyToClipboard(el.textContent); };
        });
      });
    },
    destroy: function () {}
  };
})();