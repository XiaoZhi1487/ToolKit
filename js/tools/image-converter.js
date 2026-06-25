// Tool :: Image Converter
(function () {
  var id = "image-converter";
  var title = "Image Converter";
  var icon = "\ud83d\uddbc\ufe0f";
  var category = "Media";
  var description = "Convert images between PNG, JPEG, WebP formats";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"icvUpload\" accept=\"image/*\" class=\"file-input\">" +
        "<div class=\"flex-row\" style=\"gap:8px;align-items:end\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.image-converter.format") + "</label><select id=\"icvFormat\" class=\"tool-input\"><option value=\"image/png\">PNG</option><option value=\"image/jpeg\">JPEG</option><option value=\"image/webp\">WebP</option></select></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.image-converter.quality") + "</label><input type=\"range\" id=\"icvQuality\" min=\"10\" max=\"100\" value=\"90\" class=\"tool-input\"></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"icvConvertBtn\">" + __("tool.image-converter.convert") + "</button>" +
        "<div id=\"icvPreview\" style=\"text-align:center;min-height:100px;display:flex;align-items:center;justify-content:center;background:var(--surface-secondary);border-radius:8px;padding:8px;margin-top:8px\">" +
        "  <span style=\"color:var(--text-tertiary);font-size:0.875rem\">" + __("common.waiting") + "</span>" +
        "</div>" +
        "<div style=\"font-size:0.75rem;color:var(--text-tertiary)\" id=\"icvInfo\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"icvDownloadBtn\" style=\"display:none\">" + __("tool.image-converter.download") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("icvUpload");
      var format = document.getElementById("icvFormat");
      var quality = document.getElementById("icvQuality");
      var convertBtn = document.getElementById("icvConvertBtn");
      var preview = document.getElementById("icvPreview");
      var info = document.getElementById("icvInfo");
      var downloadBtn = document.getElementById("icvDownloadBtn");
      var img = null;
      var origDataUrl = "";
      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          origDataUrl = ev.target.result;
          var temp = new Image();
          temp.onload = function() {
            img = temp;
            preview.innerHTML = "<img src=\"" + ev.target.result + "\" style=\"max-width:100%;max-height:300px;border-radius:8px\">";
            info.textContent = __("tool.image-converter.originalSize") + ": " + file.size + " bytes";
          };
          temp.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
      convertBtn.addEventListener("click", function() {
        if (!img) return;
        var cvs = document.createElement("canvas");
        cvs.width = img.naturalWidth;
        cvs.height = img.naturalHeight;
        var ctx = cvs.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var mimeType = format.value;
        var q = parseInt(quality.value) / 100;
        var dataUrl = cvs.toDataURL(mimeType, q);
        preview.innerHTML = "<img src=\"" + dataUrl + "\" style=\"max-width:100%;max-height:300px;border-radius:8px\">";
        var sizeBytes = Math.round(dataUrl.length * 3 / 4);
        info.textContent = __("tool.image-converter.newSize") + ": " + sizeBytes + " bytes";
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = function() {
          var ext = mimeType.split("/")[1];
          var a = document.createElement("a");
          a.href = dataUrl;
          a.download = "converted." + ext;
          a.click();
        };
      });
    },
    destroy: function () {}
  };
})();