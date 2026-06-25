// Tool :: CSS Minifier
(function () {
  var id = "css-minifier";
  var title = "CSS Minifier";
  var icon = "🎨";
  var category = "Developer";
  var description = "Minify CSS code by removing whitespace and comments";

  window.toolMeta.push({ id, title, icon, category, description });

  function minifyCSS(css) {
    var result = css;
    // Remove comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove whitespace around ,:;{}
    result = result.replace(/\s*([,:;{}])\s*/g, '$1');
    // Remove last semicolon in blocks
    result = result.replace(/\}([^}]*)$/g, function(m) { return m.replace(/;}/g, '}'); });
    result = result.replace(/;}/g, '}');
    // Remove whitespace around property values
    result = result.replace(/:\s+/g, ':');
    result = result.replace(/\s+{/g, '{');
    // Remove extra whitespace
    result = result.replace(/\s+/g, ' ');
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
        "  <textarea id=\"cmInput\" rows=\"8\" placeholder=\"" + __('tool.' + id + '.placeholder') + "\" spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"cmRunBtn\">" + __('tool.' + id + '.minify') + "</button>",
        "  </div>",
        "  <div id=\"cmInfo\" style=\"font-size:0.8125rem;color:var(--green);min-height:20px\"></div>",
        "  <label>" + __('tool.' + id + '.output') + "</label>",
        "  <textarea id=\"cmOutput\" rows=\"8\" readonly spellcheck=\"false\"></textarea>",
        "  <button class=\"btn btn-secondary\" id=\"cmCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("cmInput");
      var output = document.getElementById("cmOutput");
      var info = document.getElementById("cmInfo");
      var runBtn = document.getElementById("cmRunBtn");
      var copyBtn = document.getElementById("cmCopyBtn");

      function run() {
        var original = input.value;
        if (!original.trim()) {
          output.value = "";
          info.textContent = "";
          return;
        }
        var minified = minifyCSS(original);
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