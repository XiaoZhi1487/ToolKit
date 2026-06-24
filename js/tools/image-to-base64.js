// Tool :: Image to Base64 Converter
(function () {
  var id = "image-to-base64";
  var title = "Image to Base64";
  var icon = "\ud83d\udcf7";
  var category = "Media";
  var description = "Upload an image and get its Base64 data URL";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>Upload Image</label>" +
        "<input type=\"file\" id=\"imgB64Input\" accept=\"image/*\">" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-secondary\" id=\"imgB64ClearBtn\">Clear</button>" +
        "  <button class=\"btn btn-secondary\" id=\"imgB64CopyBtn\">Copy Base64</button>" +
        "</div>" +
        "<div id=\"imgB64Preview\" style=\"max-width:200px;margin:8px 0;border-radius:var(--radius-md);display:none\"></div>" +
        "<label>Base64 Data URL</label>" +
        "<textarea id=\"imgB64Output\" rows=\"5\" readonly style=\"font-size:0.75rem;font-family:var(--font-mono)\"></textarea>" +
        "<label>Or drag & drop image here</label>" +
        "<div id=\"imgB64Dropzone\" style=\"border:2px dashed var(--bg-input-border);border-radius:var(--radius-md);padding:40px 20px;text-align:center;color:var(--text-tertiary);cursor:pointer;transition:all var(--transition)\">Drop image here</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var fileInput = document.getElementById("imgB64Input");
      var output = document.getElementById("imgB64Output");
      var preview = document.getElementById("imgB64Preview");
      var clearBtn = document.getElementById("imgB64ClearBtn");
      var copyBtn = document.getElementById("imgB64CopyBtn");
      var dropzone = document.getElementById("imgB64Dropzone");

      function handleFile(file) {
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          var dataUrl = e.target.result;
          output.value = dataUrl;
          preview.innerHTML = "<img src=\"" + dataUrl + "\" style=\"max-width:100%;border-radius:var(--radius-sm)\">";
          preview.style.display = "block";
          dropzone.textContent = "Drop another image";
          dropzone.style.borderColor = "var(--green)";
        };
        reader.readAsDataURL(file);
      }

      fileInput.addEventListener("change", function () {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
      });

      dropzone.addEventListener("click", function () { fileInput.click(); });
      dropzone.addEventListener("dragover", function (e) {
        e.preventDefault();
        dropzone.style.borderColor = "var(--accent-1)";
        dropzone.style.background = "var(--accent-soft)";
      });
      dropzone.addEventListener("dragleave", function () {
        dropzone.style.borderColor = "var(--bg-input-border)";
        dropzone.style.background = "transparent";
      });
      dropzone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropzone.style.borderColor = "var(--bg-input-border)";
        dropzone.style.background = "transparent";
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
      });

      clearBtn.addEventListener("click", function () {
        output.value = "";
        preview.innerHTML = "";
        preview.style.display = "none";
        fileInput.value = "";
        dropzone.textContent = "Drop image here";
        dropzone.style.borderColor = "var(--bg-input-border)";
      });

      copyBtn.addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
      });
    },
    destroy: function () {}
  };
})();
