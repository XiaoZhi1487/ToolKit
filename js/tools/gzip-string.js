// Tool :: Gzip Compress / Decompress
(function () {
  var id = "gzip-string";
  var title = "Gzip Compress";
  var icon = "\ud83d\udddc\ufe0f";
  var category = "Developer";
  var description = "Compress or decompress text using Gzip";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\">",
        "  <span class=\"tool-header-icon\">" + icon + "</span>",
        "  <h2>" + __('tool.' + id + '.title') + "</h2>",
        "</div>",
        "<div class=\"tool-content\">",
        "  <label>" + __('tool.' + id + '.input') + "</label>",
        "  <textarea id=\"gzipInput\" rows=\"6\" placeholder=\"" + __('tool.' + id + '.placeholder') + "\" spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"gzipCompressBtn\">" + __('tool.' + id + '.compress') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"gzipDecompressBtn\">" + __('tool.' + id + '.decompress') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"gzipClearBtn\">" + __('common.clear') + "</button>",
        "  </div>",
        "  <div id=\"gzipSizeInfo\" style=\"font-size:0.8125rem;color:var(--text-tertiary);margin-bottom:6px\"></div>",
        "  <label>" + __('tool.' + id + '.output') + "</label>",
        "  <textarea id=\"gzipOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\"></textarea>",
        "  <button class=\"btn btn-secondary\" id=\"gzipCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("gzipInput");
      var output = document.getElementById("gzipOutput");
      var compressBtn = document.getElementById("gzipCompressBtn");
      var decompressBtn = document.getElementById("gzipDecompressBtn");
      var clearBtn = document.getElementById("gzipClearBtn");
      var copyBtn = document.getElementById("gzipCopyBtn");
      var sizeInfo = document.getElementById("gzipSizeInfo");

      function gzipCompress(str) {
        var encoder = new TextEncoder();
        return new Response(
          new Blob([encoder.encode(str)]).stream().pipeThrough(new CompressionStream('gzip'))
        ).arrayBuffer().then(function (compressed) {
          var bytes = new Uint8Array(compressed);
          var binary = '';
          for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          return btoa(binary);
        });
      }

      function gzipDecompress(base64) {
        var binary = atob(base64);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Response(
          new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
        ).arrayBuffer().then(function (decompressed) {
          return new TextDecoder().decode(decompressed);
        });
      }

      function doCompress() {
        var text = input.value;
        if (!text) return;
        var originalSize = new TextEncoder().encode(text).length;
        gzipCompress(text).then(function (compressed) {
          output.value = compressed;
          sizeInfo.textContent = __('tool.' + id + '.originalSize') + ': ' + originalSize + ' B | ' + __('tool.' + id + '.compressedSize') + ': ' + Math.round(compressed.length * 0.75) + ' B';
        }).catch(function (err) {
          output.value = 'Error: ' + err.message;
          sizeInfo.textContent = '';
        });
      }

      function doDecompress() {
        var text = input.value.trim();
        if (!text) return;
        output.value = '';
        sizeInfo.textContent = '';
        gzipDecompress(text).then(function (decompressed) {
          output.value = decompressed;
          var originalSize = new TextEncoder().encode(decompressed).length;
          sizeInfo.textContent = __('tool.' + id + '.originalSize') + ': ' + originalSize + ' B | ' + __('tool.' + id + '.compressedSize') + ': ' + Math.round(text.length * 0.75) + ' B';
        }).catch(function (err) {
          output.value = 'Error: ' + err.message;
          sizeInfo.textContent = '';
        });
      }

      compressBtn.addEventListener("click", doCompress);
      decompressBtn.addEventListener("click", doDecompress);

      clearBtn.addEventListener("click", function () {
        input.value = "";
        output.value = "";
        sizeInfo.textContent = "";
      });

      copyBtn.addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
      });
    },
    destroy: function () {}
  };
})();