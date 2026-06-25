// Tool :: Favicon Generator
(function () {
  var id = "favicon-gen";
  var title = "Favicon Generator";
  var icon = "\u2b50";
  var category = "Design";
  var description = "Generate favicons from text or emoji";
  window.toolMeta.push({ id, title, icon, category, description });

  function generateFavicon(text, bgColor, textColor, shape) {
    var canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    var ctx = canvas.getContext('2d');
    var w = 64, h = 64;

    ctx.fillStyle = bgColor;
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'square') {
      ctx.fillRect(2, 2, w - 4, h - 4);
    } else {
      var r = 12;
      ctx.beginPath();
      ctx.moveTo(r, 2); ctx.lineTo(w - r, 2);
      ctx.quadraticCurveTo(w - 2, 2, w - 2, r);
      ctx.lineTo(w - 2, h - r);
      ctx.quadraticCurveTo(w - 2, h - 2, w - r, h - 2);
      ctx.lineTo(r, h - 2);
      ctx.quadraticCurveTo(2, h - 2, 2, h - r);
      ctx.lineTo(2, r);
      ctx.quadraticCurveTo(2, 2, r, 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = textColor;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), w / 2, h / 2);

    return canvas;
  }

  function downloadFavicon(canvas) {
    var link = document.createElement('a');
    link.download = 'favicon.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div style=\"display:flex;flex-direction:column;align-items:center;gap:16px\">" +
        "  <div id=\"fgPreviewWrap\" style=\"display:flex;flex-direction:column;align-items:center;gap:8px\">" +
        "    <canvas id=\"fgPreviewSmall\" width=\"64\" height=\"64\" style=\"border:2px solid var(--bg-card-border);border-radius:var(--radius-md);image-rendering:pixelated\"></canvas>" +
        "    <canvas id=\"fgPreviewLarge\" width=\"192\" height=\"192\" style=\"border:2px solid var(--bg-card-border);border-radius:var(--radius-md);image-rendering:pixelated\"></canvas>" +
        "  </div>" +
        "  <div class=\"grid-2\" style=\"grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:400px\">" +
        "    <div><label>" + __('tool.' + id + '.text') + "</label><input type=\"text\" id=\"fgText\" value=\"F\" maxlength=\"2\" style=\"width:100%;text-align:center;font-size:1.25rem\"></div>" +
        "    <div><label>" + __('tool.' + id + '.shape') + "</label><select id=\"fgShape\" style=\"width:100%\">" +
        "      <option value=\"circle\">" + __('tool.' + id + '.circle') + "</option>" +
        "      <option value=\"square\">" + __('tool.' + id + '.square') + "</option>" +
        "      <option value=\"rounded\" selected>" + __('tool.' + id + '.rounded') + "</option>" +
        "    </select></div>" +
        "    <div><label>" + __('tool.' + id + '.bgColor') + "</label><input type=\"color\" id=\"fgBg\" value=\"#6366f1\" style=\"width:100%;height:36px\"></div>" +
        "    <div><label>" + __('tool.' + id + '.textColor') + "</label><input type=\"color\" id=\"fgFg\" value=\"#ffffff\" style=\"width:100%;height:36px\"></div>" +
        "  </div>" +
        "  <button class=\"btn btn-primary\" id=\"fgDownload\">" + __('tool.' + id + '.download') + "</button>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var textInput = document.getElementById("fgText");
      var bgInput = document.getElementById("fgBg");
      var fgInput = document.getElementById("fgFg");
      var shapeSelect = document.getElementById("fgShape");
      var smallCanvas = document.getElementById("fgPreviewSmall");
      var largeCanvas = document.getElementById("fgPreviewLarge");
      var downloadBtn = document.getElementById("fgDownload");

      function updatePreview() {
        var text = textInput.value || "F";
        var bg = bgInput.value;
        var fg = fgInput.value;
        var shape = shapeSelect.value;

        var canvas = generateFavicon(text, bg, fg, shape);

        var ctxSmall = smallCanvas.getContext('2d');
        ctxSmall.clearRect(0, 0, 64, 64);
        ctxSmall.drawImage(canvas, 0, 0);

        var ctxLarge = largeCanvas.getContext('2d');
        ctxLarge.clearRect(0, 0, 192, 192);
        ctxLarge.drawImage(canvas, 0, 0, 192, 192);
      }

      textInput.addEventListener("input", updatePreview);
      bgInput.addEventListener("input", updatePreview);
      fgInput.addEventListener("input", updatePreview);
      shapeSelect.addEventListener("change", updatePreview);

      downloadBtn.addEventListener("click", function () {
        var text = textInput.value || "F";
        var bg = bgInput.value;
        var fg = fgInput.value;
        var shape = shapeSelect.value;
        var canvas = generateFavicon(text, bg, fg, shape);
        downloadFavicon(canvas);
      });

      updatePreview();
    },
    destroy: function () {}
  };
})();