// Tool :: SVG to Data URL Converter
(function () {
  var id = "svg-dataurl";
  var title = "SVG to Data URL";
  var icon = "\ud83d\uddbc\ufe0f";
  var category = "Developer";
  var description = "Convert SVG code to data URL with preview";
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
        "  <textarea id=\"svgInput\" rows=\"8\" spellcheck=\"false\" style=\"font-family:var(--font-mono);font-size:0.75rem\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"svgConvertBtn\">" + __('tool.' + id + '.convert') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"svgClearBtn\">" + __('common.clear') + "</button>",
        "  </div>",
        "  <label>" + __('tool.' + id + '.output') + "</label>",
        "  <div class=\"output-box\" id=\"svgOutput\" style=\"font-family:var(--font-mono);font-size:0.75rem;word-break:break-all;max-height:200px;overflow:auto\"></div>",
        "  <button class=\"btn btn-secondary\" id=\"svgCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "  <label style=\"margin-top:12px\">" + __('tool.' + id + '.preview') + "</label>",
        "  <div id=\"svgPreviewArea\" style=\"border:1px solid var(--bg-input-border);border-radius:var(--radius-md);padding:20px;display:flex;justify-content:center;align-items:center;min-height:140px;background:repeating-conic-gradient(var(--bg-input) 0% 25%,var(--bg-card) 0% 50%) 50%/20px 20px\"></div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("svgInput");
      var output = document.getElementById("svgOutput");
      var preview = document.getElementById("svgPreviewArea");
      var convertBtn = document.getElementById("svgConvertBtn");
      var clearBtn = document.getElementById("svgClearBtn");
      var copyBtn = document.getElementById("svgCopyBtn");

      // Default SVG example
      var defaultSvg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">',
        '  <circle cx="50" cy="50" r="40" fill="#6366f1" stroke="#4f46e5" stroke-width="3"/>',
        '</svg>'
      ].join("\n");
      input.value = defaultSvg;

      function svgToDataURL(svg) {
        var cleaned = svg.replace(/<\?xml[^>]*\?>/, '').trim();
        var encoded = encodeURIComponent(cleaned)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22');
        return 'data:image/svg+xml;charset=utf-8,' + encoded;
      }

      function doConvert() {
        var text = input.value.trim();
        if (!text) return;
        try {
          var dataUrl = svgToDataURL(text);
          output.textContent = dataUrl;
          preview.innerHTML = '<img src="' + dataUrl + '" alt="SVG Preview" style="max-width:100%;max-height:300px">';
        } catch (e) {
          output.textContent = "Error: " + e.message;
          preview.innerHTML = "";
        }
      }

      convertBtn.addEventListener("click", doConvert);

      clearBtn.addEventListener("click", function () {
        input.value = defaultSvg;
        output.textContent = "";
        preview.innerHTML = "";
      });

      copyBtn.addEventListener("click", function () {
        if (output.textContent) copyToClipboard(output.textContent);
      });

      doConvert();
    },
    destroy: function () {}
  };
})();