// Tool :: Duplicate Remover
(function () {
  var id = "duplicate-remover";
  var title = "Duplicate Remover";
  var icon = "\ud83e\uddf9";
  var category = "Tools";
  var description = "Remove duplicate lines from text";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.duplicate-remover.input") + "</label>" +
        "<textarea id=\"drInput\" rows=\"6\" placeholder=\"" + __("tool.duplicate-remover.placeholder") + "\">apple\nbanana\napple\ncherry\nbanana\ndate</textarea>" +
        "<button class=\"btn btn-primary\" id=\"drRemoveBtn\">" + __("tool.duplicate-remover.remove") + "</button>" +
        "<div class=\"flex-row\" style=\"gap:16px\">" +
        "  <span style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.duplicate-remover.original") + ": <strong id=\"drOriginal\">-</strong></span>" +
        "  <span style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.duplicate-remover.unique") + ": <strong id=\"drUnique\">-</strong></span>" +
        "  <span style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + __("tool.duplicate-remover.removed") + ": <strong id=\"drRemoved\">-</strong></span>" +
        "</div>" +
        "<label>" + __("tool.duplicate-remover.output") + "</label>" +
        "<textarea id=\"drOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"drCopyBtn\">" + __("tool.duplicate-remover.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("drInput");
      var removeBtn = document.getElementById("drRemoveBtn");
      var output = document.getElementById("drOutput");
      var original = document.getElementById("drOriginal");
      var unique = document.getElementById("drUnique");
      var removed = document.getElementById("drRemoved");
      var copyBtn = document.getElementById("drCopyBtn");
      function removeDups() {
        var lines = input.value.split("\n");
        var total = lines.length;
        var seen = {};
        var result = [];
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (!seen[line]) { seen[line] = true; result.push(line); }
        }
        output.value = result.join("\n");
        original.textContent = total;
        unique.textContent = result.length;
        removed.textContent = total - result.length;
      }
      removeBtn.addEventListener("click", removeDups);
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
      removeDups();
    },
    destroy: function () {}
  };
})();