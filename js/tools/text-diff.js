// Tool :: Text Diff Checker
(function () {
  var id = "text-diff";
  var title = "Text Diff Checker";
  var icon = "\ud83d\udd0d";
  var category = "Text";
  var description = "Compare two texts and highlight differences line by line";
  window.toolMeta.push({ id, title, icon, category, description });

  // Simple word-level diff using LCS
  function diffLines(a, b) {
    var linesA = a.split("\n");
    var linesB = b.split("\n");
    var m = linesA.length, n = linesB.length;
    var dp = [];
    for (var i = 0; i <= m; i++) { dp[i] = []; dp[i][0] = 0; }
    for (var j = 0; j <= n; j++) dp[0][j] = 0;
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        dp[i][j] = linesA[i - 1] === linesB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    var result = [];
    var i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
        result.unshift({ type: "same", text: linesA[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: "added", text: linesB[j - 1] });
        j--;
      } else {
        result.unshift({ type: "removed", text: linesA[i - 1] });
        i--;
      }
    }
    return result;
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "  <div style=\"display:flex;flex-direction:column\"><label>Original Text</label><textarea id=\"diffA\" rows=\"8\" style=\"flex:1\"></textarea></div>" +
        "  <div style=\"display:flex;flex-direction:column\"><label>Changed Text</label><textarea id=\"diffB\" rows=\"8\" style=\"flex:1\"></textarea></div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"diffRunBtn\">Compare</button>" +
        "  <button class=\"btn btn-secondary\" id=\"diffClearBtn\">Clear</button>" +
        "</div>" +
        "<label>Difference</label>" +
        "<div class=\"output-box\" id=\"diffOutput\" style=\"font-family:var(--font-mono);font-size:0.75rem;line-height:1.8;max-height:400px;overflow-y:auto;padding:8px 12px\">Waiting for comparison...</div>" +
        "<div class=\"flex-row\" style=\"gap:16px\">" +
        "  <span style=\"font-size:0.75rem;color:var(--text-tertiary)\"><span style=\"display:inline-block;width:12px;height:12px;background:var(--green-soft);border:1px solid var(--green);border-radius:2px;vertical-align:middle\"></span> Added</span>" +
        "  <span style=\"font-size:0.75rem;color:var(--text-tertiary)\"><span style=\"display:inline-block;width:12px;height:12px;background:var(--red-soft);border:1px solid var(--red);border-radius:2px;vertical-align:middle\"></span> Removed</span>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var diffA = document.getElementById("diffA");
      var diffB = document.getElementById("diffB");
      var output = document.getElementById("diffOutput");
      var runBtn = document.getElementById("diffRunBtn");
      var clearBtn = document.getElementById("diffClearBtn");

      function compare() {
        var a = diffA.value, b = diffB.value;
        if (!a && !b) { output.textContent = "Enter text in both panels"; return; }
        var diffs = diffLines(a, b);
        output.innerHTML = diffs.map(function (d) {
          var bg = d.type === "same" ? "transparent" : d.type === "added" ? "var(--green-soft)" : "var(--red-soft)";
          var prefix = d.type === "added" ? "+ " : d.type === "removed" ? "- " : "  ";
          return "<div style=\"background:" + bg + ";padding:1px 4px;border-radius:2px;white-space:pre-wrap\">" + prefix + escapeHtml(d.text) + "</div>";
        }).join("");
      }

      function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      runBtn.addEventListener("click", compare);
      clearBtn.addEventListener("click", function () { diffA.value = ""; diffB.value = ""; output.textContent = "Cleared"; });

      diffA.value = "Hello World\nThis is a test\nLine three\nLine four";
      diffB.value = "Hello World\nThis is a test\nModified line\nLine four\nNew line";
      compare();
    },
    destroy: function () {}
  };
})();
