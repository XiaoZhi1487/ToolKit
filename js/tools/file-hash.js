// Tool :: File Hash
(function () {
  var id = "file-hash";
  var title = "File Hash";
  var icon = "\ud83d\udd22";
  var category = "Security";
  var description = "Calculate SHA-256 hash of files";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"file\" id=\"fhUpload\" class=\"file-input\">" +
        "<div style=\"font-size:0.75rem;color:var(--text-tertiary);margin:4px 0\" id=\"fhInfo\">" + __("tool.file-hash.fileName") + ": -, " + __("tool.file-hash.fileSize") + ": -</div>" +
        "<button class=\"btn btn-primary\" id=\"fhCalcBtn\">" + __("tool.file-hash.calculate") + "</button>" +
        "<label>" + __("tool.file-hash.result") + "</label>" +
        "<textarea id=\"fhOutput\" rows=\"3\" readonly style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"fhCopyBtn\">" + __("tool.file-hash.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var upload = document.getElementById("fhUpload");
      var info = document.getElementById("fhInfo");
      var calcBtn = document.getElementById("fhCalcBtn");
      var output = document.getElementById("fhOutput");
      var copyBtn = document.getElementById("fhCopyBtn");
      var fileData = null;
      upload.addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          fileData = ev.target.result;
          info.innerHTML = __("tool.file-hash.fileName") + ": " + file.name + ", " + __("tool.file-hash.fileSize") + ": " + file.size + " bytes";
        };
        reader.readAsArrayBuffer(file);
      });
      calcBtn.addEventListener("click", function() {
        if (!fileData) return;
        crypto.subtle.digest("SHA-256", fileData).then(function(hash) {
          var hex = Array.from(new Uint8Array(hash)).map(function(b){return ("0" + b.toString(16)).slice(-2);}).join("");
          output.value = hex;
        });
      });
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();