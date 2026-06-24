// Tool :: Base64 Encoder / Decoder - Enhanced with file support
(function () {
  var id = "base64";
  var title = "Base64 Encode / Decode";
  var icon = "\u2194\ufe0f";
  var category = "Developer";
  var description = "Encode text/files to Base64 or decode Base64 back to text";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"tab-bar\" id=\"b64TabBar\">" +
        "  <button class=\"tab-btn active\" data-tab=\"encode\">" + __("tool.base64.tabEncode") + "</button>" +
        "  <button class=\"tab-btn\" data-tab=\"decode\">" + __("tool.base64.tabDecode") + "</button>" +
        "  <button class=\"tab-btn\" data-tab=\"file\">" + __("tool.base64.tabFile") + "</button>" +
        "</div>" +
        "<textarea id=\"b64Input\" rows=\"5\" placeholder=\"" + __("tool.base64.enterText") + "...\" spellcheck=\"false\"></textarea>" +
        "<div id=\"b64FileArea\" style=\"display:none\">" +
        "  <label>" + __("tool.base64.uploadFile") + "</label>" +
        "  <div id=\"b64Dropzone\" style=\"border:2px dashed var(--bg-input-border);border-radius:var(--radius-md);padding:30px 20px;text-align:center;color:var(--text-tertiary);cursor:pointer\">" + __("tool.base64.clickToSelect") + "</div>" +
        "  <div style=\"font-size:0.75rem;color:var(--text-tertiary);margin-top:4px\" id=\"b64FileName\"></div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"b64RunBtn\">" + __("common.execute") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"b64SwapBtn\">" + __("common.swap") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"b64ClearBtn\">" + __("common.clear") + "</button>" +
        "</div>" +
        "<label>" + __("common.result") + "</label>" +
        "<textarea id=\"b64Output\" rows=\"4\" readonly style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"b64CopyBtn\">" + __("common.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("b64Input");
      var output = document.getElementById("b64Output");
      var runBtn = document.getElementById("b64RunBtn");
      var swapBtn = document.getElementById("b64SwapBtn");
      var clearBtn = document.getElementById("b64ClearBtn");
      var copyBtn = document.getElementById("b64CopyBtn");
      var tabBar = document.getElementById("b64TabBar");
      var fileArea = document.getElementById("b64FileArea");
      var dropzone = document.getElementById("b64Dropzone");
      var fileName = document.getElementById("b64FileName");
      var mode = "encode";
      var fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.tab;
        if (mode === "file") { fileArea.style.display = "block"; input.style.display = "none"; }
        else { fileArea.style.display = "none"; input.style.display = ""; }
        input.placeholder = mode === "encode" ? __("tool.base64.enterText") + "..." : __("tool.base64.enterBase64") + "...";
        run();
      });

      function run() {
        try {
          if (mode === "encode") {
            output.value = btoa(unescape(encodeURIComponent(input.value)));
          } else if (mode === "decode") {
            output.value = decodeURIComponent(escape(atob(input.value.trim())));
          }
        } catch (e) {
          output.value = "Error: " + e.message;
        }
      }

      runBtn.addEventListener("click", function () {
        if (mode === "file" && fileInput.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) { output.value = e.target.result; };
          reader.readAsDataURL(fileInput.files[0]);
        } else { run(); }
      });

      swapBtn.addEventListener("click", function () {
        var cur = output.value;
        if (cur && !cur.startsWith("Error")) {
          input.value = cur;
          var oldMode = mode;
          if (oldMode === "encode") { mode = "decode"; tabBar.querySelector("[data-tab='decode']").click(); }
          else if (oldMode === "decode") { mode = "encode"; tabBar.querySelector("[data-tab='encode']").click(); }
        }
      });

      clearBtn.addEventListener("click", function () {
        input.value = ""; output.value = ""; fileInput.value = "";
        fileName.textContent = "";
        dropzone.textContent = __("tool.base64.clickToSelect");
      });

      copyBtn.addEventListener("click", function () { if (output.value) copyToClipboard(output.value); });

      dropzone.addEventListener("click", function () { fileInput.click(); });
      fileInput.addEventListener("change", function () {
        if (fileInput.files[0]) {
          fileName.textContent = fileInput.files[0].name + " (" + Math.round(fileInput.files[0].size / 1024) + " KB)";
          dropzone.textContent = __("tool.base64.fileSelected");
        }
      });
    },
    destroy: function () {
      var fi = document.querySelector("input[type='file'][style*='display:none']");
      if (fi) fi.remove();
    }
  };
})();
