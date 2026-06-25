// Tool :: Meme Generator
(function () {
  var id = "meme-generator";
  var title = "Meme Generator";
  var icon = "\ud83d\ude02";
  var category = "Media";
  var description = "Add top and bottom text to images";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"mgUpload\" accept=\"image/*\" class=\"file-input\">" +
        "<div class=\"flex-row\" style=\"gap:8px;flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:120px\"><label style=\"font-size:0.75rem\">" + __("tool.meme-generator.topText") + "</label><input type=\"text\" id=\"mgTopText\" class=\"tool-input\" value=\"TOP TEXT\"></div>" +
        "  <div style=\"flex:1;min-width:120px\"><label style=\"font-size:0.75rem\">" + __("tool.meme-generator.bottomText") + "</label><input type=\"text\" id=\"mgBottomText\" class=\"tool-input\" value=\"BOTTOM TEXT\"></div>" +
        "  <div style=\"flex:0 0 80px\"><label style=\"font-size:0.75rem\">" + __("tool.meme-generator.fontSize") + "</label><input type=\"number\" id=\"mgFontSize\" class=\"tool-input\" value=\"48\" min=\"12\"></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"mgGenerateBtn\">" + __("tool.meme-generator.generate") + "</button>" +
        "<div id=\"mgPreview\" style=\"text-align:center;min-height:100px;display:flex;align-items:center;justify-content:center;background:var(--surface-secondary);border-radius:8px;padding:8px;margin-top:8px\">" +
        "  <span style=\"color:var(--text-tertiary);font-size:0.875rem\">" + __("common.waiting") + "</span>" +
        "</div>" +
        "<button class=\"btn btn-secondary\" id=\"mgDownloadBtn\" style=\"display:none\">" + __("tool.meme-generator.download") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("mgUpload");
      var topText = document.getElementById("mgTopText");
      var bottomText = document.getElementById("mgBottomText");
      var fontSize = document.getElementById("mgFontSize");
      var generateBtn = document.getElementById("mgGenerateBtn");
      var preview = document.getElementById("mgPreview");
      var downloadBtn = document.getElementById("mgDownloadBtn");
      var img = null;
      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          var temp = new Image();
          temp.onload = function() {
            img = temp;
            generateMeme();
          };
          temp.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
      function generateMeme() {
        if (!img) return;
        var cvs = document.createElement("canvas");
        cvs.width = img.naturalWidth;
        cvs.height = img.naturalHeight;
        var ctx = cvs.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var fs = Math.min(parseInt(fontSize.value) || 48, cvs.width * 0.15);
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.max(2, fs * 0.05);
        ctx.font = "bold " + fs + "px Impact, Arial Black, sans-serif";
        var top = topText.value.toUpperCase();
        var bottom = bottomText.value.toUpperCase();
        if (top) {
          ctx.textBaseline = "top";
          ctx.strokeText(top, cvs.width/2, fs * 0.2);
          ctx.fillText(top, cvs.width/2, fs * 0.2);
        }
        if (bottom) {
          ctx.textBaseline = "bottom";
          ctx.strokeText(bottom, cvs.width/2, cvs.height - fs * 0.2);
          ctx.fillText(bottom, cvs.width/2, cvs.height - fs * 0.2);
        }
        preview.innerHTML = "<img src=\"" + cvs.toDataURL() + "\" style=\"max-width:100%;max-height:400px;border-radius:8px\">";
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = function() {
          var a = document.createElement("a");
          a.href = cvs.toDataURL();
          a.download = "meme.png";
          a.click();
        };
      }
      generateBtn.addEventListener("click", generateMeme);
    },
    destroy: function () {}
  };
})();