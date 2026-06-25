// Tool :: Image Resizer
(function () {
  var id = "image-resizer";
  var title = "Image Resizer";
  var icon = "\ud83d\uddd1\ufe0f";
  var category = "Media";
  var description = "Resize images with preview and download";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"irUpload\" accept=\"image/*\" class=\"file-input\">" +
        "<div class=\"flex-row\" style=\"gap:8px;flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:100px\"><label style=\"font-size:0.75rem\">" + __("tool.image-resizer.width") + "</label><input type=\"number\" id=\"irWidth\" class=\"tool-input\" min=\"1\"></div>" +
        "  <div style=\"flex:1;min-width:100px\"><label style=\"font-size:0.75rem\">" + __("tool.image-resizer.height") + "</label><input type=\"number\" id=\"irHeight\" class=\"tool-input\" min=\"1\"></div>" +
        "  <div style=\"display:flex;align-items:center;padding-top:16px\"><label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"irKeepRatio\" checked> " + __("tool.image-resizer.keepRatio") + "</label></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"irResizeBtn\">" + __("tool.image-resizer.resize") + "</button>" +
        "<div style=\"font-size:0.75rem;color:var(--text-tertiary)\" id=\"irInfo\"></div>" +
        "<div id=\"irPreview\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"irDownloadBtn\" style=\"display:none\">" + __("tool.image-resizer.download") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("irUpload");
      var width = document.getElementById("irWidth");
      var height = document.getElementById("irHeight");
      var keepRatio = document.getElementById("irKeepRatio");
      var resizeBtn = document.getElementById("irResizeBtn");
      var preview = document.getElementById("irPreview");
      var info = document.getElementById("irInfo");
      var downloadBtn = document.getElementById("irDownloadBtn");
      var img = null;
      var origW = 0, origH = 0;
      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          var temp = new Image();
          temp.onload = function() {
            img = temp;
            origW = temp.naturalWidth;
            origH = temp.naturalHeight;
            width.value = origW;
            height.value = origH;
            info.textContent = __("tool.image-resizer.original") + ": " + origW + " x " + origH;
            preview.innerHTML = "<img src=\"" + ev.target.result + "\" style=\"max-width:100%;max-height:300px;border-radius:8px\">";
          };
          temp.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
      function updateHeight() {
        if (keepRatio.checked && origW > 0) {
          height.value = Math.round(width.value * origH / origW);
        }
      }
      function updateWidth() {
        if (keepRatio.checked && origH > 0) {
          width.value = Math.round(height.value * origW / origH);
        }
      }
      width.addEventListener("input", updateHeight);
      height.addEventListener("input", updateWidth);
      resizeBtn.addEventListener("click", function() {
        if (!img) return;
        var cvs = document.createElement("canvas");
        cvs.width = parseInt(width.value) || origW;
        cvs.height = parseInt(height.value) || origH;
        var ctx = cvs.getContext("2d");
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
        preview.innerHTML = "<img src=\"" + cvs.toDataURL() + "\" style=\"max-width:100%;max-height:300px;border-radius:8px\">";
        info.textContent = __("tool.image-resizer.newSize") + ": " + cvs.width + " x " + cvs.height;
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = function() {
          var a = document.createElement("a");
          a.href = cvs.toDataURL();
          a.download = "resized-" + cvs.width + "x" + cvs.height + ".png";
          a.click();
        };
      });
    },
    destroy: function () {}
  };
})();