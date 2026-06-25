// Tool :: HTML Minifier
(function () {
  var id = "html-minifier";
  var title = "HTML Minifier";
  var icon = "📦";
  var category = "Developer";
  var description = "Minify HTML code by removing whitespace and comments";

  window.toolMeta.push({ id, title, icon, category, description });

  function minifyHTML(html) {
    var result = html;
    // Remove HTML comments
    result = result.replace(/<!--[\s\S]*?-->/g, '');
    // Remove whitespace between tags
    result = result.replace(/>\s+</g, '><');
    // Remove extra whitespace
    result = result.replace(/\s{2,}/g, ' ');
    // Trim lines
    result = result.replace(/>\s+/g, '>');
    result = result.replace(/\s+</g, '<');
    return result.trim();
  }

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
        "  <textarea id=\"hmInput\" rows=\"8\" placeholder=\"" + __('tool.' + id + '.placeholder') + "\" spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"hmRunBtn\">" + __('tool.' + id + '.minify') + "</button>",
        "  </div>",
        "  <div id=\"hmInfo\" style=\"font-size:0.8125rem;color:var(--green);min-height:20px\"></div>",
        "  <label>" + __('tool.' + id + '.output') + "</label>",
        "  <textarea id=\"hmOutput\" rows=\"8\" readonly spellcheck=\"false\"></textarea>",
        "  <button class=\"btn btn-secondary\" id=\"hmCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("hmInput");
      var output = document.getElementById("hmOutput");
      var info = document.getElementById("hmInfo");
      var runBtn = document.getElementById("hmRunBtn");
      var copyBtn = document.getElementById("hmCopyBtn");

      function run() {
        var original = input.value;
        if (!original.trim()) {
          output.value = "";
          info.textContent = "";
          return;
        }
        var minified = minifyHTML(original);
        output.value = minified;
        var saved = original.length - minified.length;
        info.textContent = saved >= 0
          ? "✓ " + __('tool.' + id + '.minify') + " - " + saved + " bytes " + __('common.result')
          : "";
      }

      runBtn.addEventListener("click", run);
      copyBtn.addEventListener("click", function () { copyToClipboard(output.value); });
      input.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
      });
    },
    destroy: function () {}
  };
})();