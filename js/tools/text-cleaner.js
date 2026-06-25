// Tool :: Text Cleaner
(function () {
  var id = "text-cleaner";
  var title = "Text Cleaner";
  var icon = "\ud83e\uddf9";
  var category = "Text";
  var description = "Clean text by removing extra spaces, empty lines, special chars";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.text-cleaner.input") + "</label>" +
        "<textarea id=\"tcInput\" rows=\"6\" placeholder=\"  Hello   World  \n\n  Line with spaces   \n\t\nAnother line\"></textarea>" +
        "<div class=\"flex-row\" style=\"gap:6px;flex-wrap:wrap\">" +
        "  <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"tcTrimLines\" checked> " + __("tool.text-cleaner.trimLines") + "</label>" +
        "  <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"tcRemoveEmpty\" checked> " + __("tool.text-cleaner.removeEmpty") + "</label>" +
        "  <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"tcCollapseSpaces\" checked> " + __("tool.text-cleaner.collapseSpaces") + "</label>" +
        "  <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"tcRemoveNonPrintable\"> " + __("tool.text-cleaner.removeNonPrintable") + "</label>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"tcCleanBtn\">" + __("tool.text-cleaner.clean") + "</button>" +
        "<label>" + __("tool.text-cleaner.result") + "</label>" +
        "<textarea id=\"tcOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"tcCopyBtn\">" + __("tool.text-cleaner.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("tcInput");
      var output = document.getElementById("tcOutput");
      var cleanBtn = document.getElementById("tcCleanBtn");
      var copyBtn = document.getElementById("tcCopyBtn");
      function clean() {
        var text = input.value;
        if (document.getElementById("tcRemoveNonPrintable").checked) {
          text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
        }
        var lines = text.split("\n");
        if (document.getElementById("tcTrimLines").checked) {
          for (var i = 0; i < lines.length; i++) lines[i] = lines[i].trim();
        }
        if (document.getElementById("tcRemoveEmpty").checked) {
          lines = lines.filter(function(l){ return l !== ""; });
        }
        text = lines.join("\n");
        if (document.getElementById("tcCollapseSpaces").checked) {
          text = text.replace(/[ \t]+/g, " ");
        }
        output.value = text;
      }
      cleanBtn.addEventListener("click", clean);
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();