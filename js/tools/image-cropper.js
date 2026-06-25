// Tool :: Image Cropper
(function () {
  var id = "image-cropper";
  var title = "Image Cropper";
  var icon = "\u2702\ufe0f";
  var category = "Media";
  var description = "Crop images with preset aspect ratios";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"icUpload\" accept=\"image/*\" class=\"file-input\">" +
        "<div class=\"flex-row\" style=\"gap:6px;flex-wrap:wrap;margin:8px 0\">" +
        "  <button class=\"btn btn-sm active\" data-ratio=\"free\">" + __("tool.image-cropper.free") + "</button>" +
        "  <button class=\"btn btn-sm\" data-ratio=\"1:1\">" + __("tool.image-cropper.square") + "</button>" +
        "  <button class=\"btn btn-sm\" data-ratio=\"3:4\">" + __("tool.image-cropper.portrait") + "</button>" +
        "  <button class=\"btn btn-sm\" data-ratio=\"4:3\">" + __("tool.image-cropper.landscape") + "</button>" +
        "  <button class=\"btn btn-sm\" data-ratio=\"16:9\">" + __("tool.image-cropper.wide") + "</button>" +
        "</div>" +
        "<div id=\"icContainer\" style=\"position:relative;overflow:hidden;background:var(--surface-secondary);border-radius:8px;min-height:200px;display:flex;align-items:center;justify-content:center\">" +
        "  <span style=\"color:var(--text-tertiary);font-size:0.875rem\" id=\"icPlaceholder\">" + __("common.waiting") + "</span>" +
        "  <canvas id=\"icCanvas\" style=\"display:none;max-width:100%\"></canvas>" +
        "  <div id=\"icCropBox\" style=\"display:none;position:absolute;border:2px dashed #fff;cursor:move;background:rgba(255,255,255,0.1)\"></div>" +
        "</div>" +
        "<div class=\"flex-row\" style=\"gap:8px;margin-top:8px\">" +
        "  <button class=\"btn btn-primary\" id=\"icCropBtn\">" + __("tool.image-cropper.crop") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"icDownloadBtn\" style=\"display:none\">" + __("tool.image-cropper.download") + "</button>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("icUpload");
      var canvas = document.getElementById("icCanvas");
      var ctx = canvas.getContext("2d");
      var cropBox = document.getElementById("icCropBox");
      var placeholder = document.getElementById("icPlaceholder");
      var container = document.getElementById("icContainer");
      var cropBtn = document.getElementById("icCropBtn");
      var downloadBtn = document.getElementById("icDownloadBtn");
      var img = null;
      var ratio = "free";
      var isDragging = false, dragStartX, dragStartY, dragOrigX, dragOrigY;
      var isResizing = false, resizeDir = "";
      var cropX = 0, cropY = 0, cropW = 100, cropH = 100;
      var imgW = 0, imgH = 0, scale = 1;

      var ratioBtns = document.querySelectorAll("[data-ratio]");
      for (var i = 0; i < ratioBtns.length; i++) {
        (function(btn){
          btn.addEventListener("click", function() {
            ratioBtns.forEach(function(b){b.classList.remove("active");});
            btn.classList.add("active");
            ratio = btn.getAttribute("data-ratio");
            if (img) initCropBox();
          });
        })(ratioBtns[i]);
      }

      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          var temp = new Image();
          temp.onload = function() {
            img = temp;
            imgW = temp.naturalWidth;
            imgH = temp.naturalHeight;
            canvas.style.display = "block";
            placeholder.style.display = "none";
            var maxW = container.clientWidth - 16;
            scale = Math.min(1, maxW / imgW, 400 / imgH);
            canvas.width = imgW * scale;
            canvas.height = imgH * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            initCropBox();
          };
          temp.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });

      function initCropBox() {
        cropW = Math.round(canvas.width * 0.8);
        cropH = Math.round(canvas.height * 0.8);
        if (ratio !== "free") {
          var parts = ratio.split(":");
          var r = parseInt(parts[0]) / parseInt(parts[1]);
          if (cropW / cropH > r) cropW = Math.round(cropH * r);
          else cropH = Math.round(cropW / r);
        }
        cropX = Math.round((canvas.width - cropW) / 2);
        cropY = Math.round((canvas.height - cropH) / 2);
        updateCropBox();
      }

      function updateCropBox() {
        cropBox.style.display = "block";
        cropBox.style.left = cropX + "px";
        cropBox.style.top = cropY + "px";
        cropBox.style.width = cropW + "px";
        cropBox.style.height = cropH + "px";
      }

      cropBtn.addEventListener("click", function() {
        if (!img) return;
        var outCvs = document.createElement("canvas");
        var outW = Math.round(cropW / scale);
        var outH = Math.round(cropH / scale);
        outCvs.width = outW;
        outCvs.height = outH;
        var outCtx = outCvs.getContext("2d");
        outCtx.drawImage(img, Math.round(cropX / scale), Math.round(cropY / scale), outW, outH, 0, 0, outW, outH);
        canvas.width = outW;
        canvas.height = outH;
        ctx.drawImage(outCvs, 0, 0);
        scale = 1;
        imgW = outW; imgH = outH;
        img = new Image();
        img.src = outCvs.toDataURL();
        cropBox.style.display = "none";
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = function() {
          var a = document.createElement("a");
          a.href = outCvs.toDataURL();
          a.download = "cropped.png";
          a.click();
        };
      });

      cropBox.addEventListener("mousedown", function(e) {
        if (e.target === cropBox) {
          isDragging = true;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          dragOrigX = cropX;
          dragOrigY = cropY;
        }
      });
      document.addEventListener("mousemove", function(e) {
        if (isDragging) {
          var dx = e.clientX - dragStartX;
          var dy = e.clientY - dragStartY;
          cropX = Math.max(0, Math.min(canvas.width - cropW, dragOrigX + dx));
          cropY = Math.max(0, Math.min(canvas.height - cropH, dragOrigY + dy));
          updateCropBox();
        }
      });
      document.addEventListener("mouseup", function() { isDragging = false; isResizing = false; });
    },
    destroy: function () {}
  };
})();