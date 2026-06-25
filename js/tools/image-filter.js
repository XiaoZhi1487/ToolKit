// Tool :: Image Filter
(function () {
  var id = "image-filter";
  var title = "Image Filter";
  var icon = "\ud83c\udfa8";
  var category = "Media";
  var description = "Apply filter effects to images";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"ifUpload\" accept=\"image/*\" class=\"file-input\">" +
        "<div style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:6px;margin:8px 0\">" +
        "  <button class=\"btn btn-sm\" data-filter=\"grayscale\">" + __("tool.image-filter.grayscale") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"sepia\">" + __("tool.image-filter.sepia") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"invert\">" + __("tool.image-filter.invert") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"blur\">" + __("tool.image-filter.blur") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"brightness\">" + __("tool.image-filter.brightness") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"contrast\">" + __("tool.image-filter.contrast") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"saturate\">" + __("tool.image-filter.saturate") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"hueRotate\">" + __("tool.image-filter.hueRotate") + "</button>" +
        "  <button class=\"btn btn-sm\" id=\"ifReset\">" + __("tool.image-filter.reset") + "</button>" +
        "</div>" +
        "<div id=\"ifPreview\" style=\"text-align:center;min-height:100px;display:flex;align-items:center;justify-content:center;background:var(--surface-secondary);border-radius:8px;padding:8px\">" +
        "  <span style=\"color:var(--text-tertiary);font-size:0.875rem\">" + __("common.waiting") + "</span>" +
        "</div>" +
        "<button class=\"btn btn-secondary\" id=\"ifDownloadBtn\" style=\"display:none\">" + __("tool.image-filter.download") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("ifUpload");
      var preview = document.getElementById("ifPreview");
      var downloadBtn = document.getElementById("ifDownloadBtn");
      var img = null;
      var currentFilter = "";
      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          var temp = new Image();
          temp.onload = function() {
            img = temp;
            applyFilter("");
          };
          temp.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
      function applyFilter(filter) {
        if (!img) return;
        currentFilter = filter;
        var cvs = document.createElement("canvas");
        cvs.width = img.naturalWidth;
        cvs.height = img.naturalHeight;
        var ctx = cvs.getContext("2d");
        ctx.filter = getFilterCSS(filter);
        ctx.drawImage(img, 0, 0);
        preview.innerHTML = "<img src=\"" + cvs.toDataURL() + "\" style=\"max-width:100%;max-height:400px;border-radius:8px\">";
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = function() {
          var a = document.createElement("a");
          a.href = cvs.toDataURL();
          a.download = "filtered-" + (filter || "original") + ".png";
          a.click();
        };
      }
      function getFilterCSS(filter) {
        switch (filter) {
          case "grayscale": return "grayscale(1)";
          case "sepia": return "sepia(1)";
          case "invert": return "invert(1)";
          case "blur": return "blur(5px)";
          case "brightness": return "brightness(1.5)";
          case "contrast": return "contrast(2)";
          case "saturate": return "saturate(2)";
          case "hueRotate": return "hue-rotate(90deg)";
          default: return "none";
        }
      }
      var filterBtns = document.querySelectorAll("[data-filter]");
      for (var i = 0; i < filterBtns.length; i++) {
        (function(btn){
          btn.addEventListener("click", function(){ applyFilter(btn.getAttribute("data-filter")); });
        })(filterBtns[i]);
      }
      document.getElementById("ifReset").addEventListener("click", function() { applyFilter(""); });
    },
    destroy: function () {}
  };
})();