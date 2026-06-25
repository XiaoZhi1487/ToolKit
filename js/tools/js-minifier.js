// Tool :: JS Minifier/Beautifier
(function () {
  var id = "js-minifier";
  var title = "JS Minify/Beautify";
  var icon = "📜";
  var category = "Developer";
  var description = "Minify or beautify JavaScript code";

  window.toolMeta.push({ id, title, icon, category, description });

  function repeatStr(str, n) {
    var result = "";
    for (var i = 0; i < n; i++) result += str;
    return result;
  }

  function minifyJS(js) {
    var result = js;
    // Remove single-line comments
    result = result.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove whitespace
    result = result.replace(/\s+/g, ' ');
    result = result.replace(/\s*([=+\-*/%?:;,{}()\[\]])\s*/g, '$1');
    return result.trim();
  }

  function beautifyJS(js) {
    var indent = 0;
    var result = '';
    // Remove existing whitespace first
    var cleaned = js.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    // Token-based beautification
    for (var i = 0; i < cleaned.length; i++) {
      var ch = cleaned[i];
      if (ch === '{' || ch === '[') {
        result += ch + '\n' + repeatStr('  ', indent + 1);
        indent++;
      } else if (ch === '}' || ch === ']') {
        indent--;
        result += '\n' + repeatStr('  ', indent) + ch;
      } else if (ch === ';') {
        result += ch + '\n' + repeatStr('  ', indent);
      } else if (ch === ',') {
        result += ch + '\n' + repeatStr('  ', indent);
      } else {
        result += ch;
      }
    }
    return result;
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
        "  <textarea id=\"jmInput\" rows=\"8\" placeholder=\"" + __('tool.' + id + '.placeholder') + "\" spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"jmMinifyBtn\">" + __('tool.' + id + '.minify') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"jmBeautifyBtn\">" + __('tool.' + id + '.beautify') + "</button>",
        "  </div>",
        "  <label>" + __('tool.' + id + '.output') + "</label>",
        "  <textarea id=\"jmOutput\" rows=\"8\" readonly spellcheck=\"false\"></textarea>",
        "  <button class=\"btn btn-secondary\" id=\"jmCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("jmInput");
      var output = document.getElementById("jmOutput");
      var minifyBtn = document.getElementById("jmMinifyBtn");
      var beautifyBtn = document.getElementById("jmBeautifyBtn");
      var copyBtn = document.getElementById("jmCopyBtn");

      minifyBtn.addEventListener("click", function () {
        if (!input.value.trim()) { output.value = ""; return; }
        try {
          output.value = minifyJS(input.value);
        } catch (e) {
          output.value = "Error: " + e.message;
        }
      });

      beautifyBtn.addEventListener("click", function () {
        if (!input.value.trim()) { output.value = ""; return; }
        try {
          output.value = beautifyJS(input.value);
        } catch (e) {
          output.value = "Error: " + e.message;
        }
      });

      copyBtn.addEventListener("click", function () { copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();