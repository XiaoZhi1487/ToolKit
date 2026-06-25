// Tool :: Text Replacer
(function () {
  var id = "text-replacer";
  var title = "Text Replacer";
  var icon = "\u2702\ufe0f";
  var category = "Text";
  var description = "Find and replace text with regex support";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.text-replacer.input") + "</label>" +
        "<textarea id=\"trInput\" rows=\"6\" placeholder=\"" + __("tool.text-replacer.placeholder") + "\"></textarea>" +
        "<div class=\"flex-row\" style=\"gap:8px;align-items:end;flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:120px\"><label style=\"font-size:0.75rem\">" + __("tool.text-replacer.find") + "</label><input type=\"text\" id=\"trFind\" class=\"tool-input\"></div>" +
        "  <div style=\"flex:1;min-width:120px\"><label style=\"font-size:0.75rem\">" + __("tool.text-replacer.replace") + "</label><input type=\"text\" id=\"trReplace\" class=\"tool-input\"></div>" +
        "  <div style=\"display:flex;gap:8px;align-items:center;padding-bottom:4px\">" +
        "    <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"trRegex\"> " + __("tool.text-replacer.regex") + "</label>" +
        "    <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"trCaseSensitive\"> " + __("tool.text-replacer.caseSensitive") + "</label>" +
        "  </div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"trReplaceBtn\">" + __("tool.text-replacer.replaceAll") + "</button>" +
        "<div style=\"font-size:0.75rem;color:var(--text-tertiary)\" id=\"trCount\"></div>" +
        "<label>" + __("tool.text-replacer.result") + "</label>" +
        "<textarea id=\"trOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"trCopyBtn\">" + __("tool.text-replacer.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("trInput");
      var find = document.getElementById("trFind");
      var replace = document.getElementById("trReplace");
      var regex = document.getElementById("trRegex");
      var caseSensitive = document.getElementById("trCaseSensitive");
      var btn = document.getElementById("trReplaceBtn");
      var output = document.getElementById("trOutput");
      var count = document.getElementById("trCount");
      var copyBtn = document.getElementById("trCopyBtn");
      function doReplace() {
        var text = input.value;
        var findVal = find.value;
        var replaceVal = replace.value;
        if (!findVal) { output.value = text; count.textContent = ""; return; }
        try {
          var flags = "g" + (caseSensitive.checked ? "" : "i");
          var pattern = regex.checked ? new RegExp(findVal, flags) : new RegExp(findVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
          var result = text.replace(pattern, replaceVal);
          output.value = result;
          var matches = text.match(pattern);
          var n = matches ? matches.length : 0;
          count.textContent = __("tool.text-replacer.count", n);
        } catch (e) {
          output.value = e.message;
          count.textContent = "";
        }
      }
      btn.addEventListener("click", doReplace);
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
    },
    destroy: function () {}
  };
})();