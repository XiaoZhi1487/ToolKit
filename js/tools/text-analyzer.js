// Tool :: Text Analyzer - Enhanced
(function () {
  var id = "text-analyzer";
  var title = "Text Analyzer";
  var icon = "\ud83d\udcca";
  var category = "Text";
  var description = "Comprehensive text statistics: words, chars, lines, paragraphs, unique words, readability";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>Input Text</label>" +
        "<textarea id=\"taInput\" rows=\"8\" placeholder=\"Paste or type text here...\"></textarea>" +
        "<div class=\"grid-2\">" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:1.25rem;font-weight:700\" id=\"taChars\">0</div>" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary)\">Characters</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:1.25rem;font-weight:700\" id=\"taCharsNoSpace\">0</div>" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary)\">Chars (no space)</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:1.25rem;font-weight:700\" id=\"taWords\">0</div>" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary)\">Words</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:1.25rem;font-weight:700\" id=\"taUnique\">0</div>" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary)\">Unique Words</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:1.25rem;font-weight:700\" id=\"taSentences\">0</div>" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary)\">Sentences</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:1.25rem;font-weight:700\" id=\"taParas\">0</div>" +
        "    <div style=\"font-size:0.6875rem;color:var(--text-tertiary)\">Paragraphs</div>" +
        "  </div>" +
        "</div>" +
        "<div class=\"flex-row\" style=\"justify-content:space-between\">" +
        "  <span style=\"font-size:0.8125rem\">Readability: <strong id=\"taReadability\">-</strong></span>" +
        "  <span style=\"font-size:0.8125rem\">Reading time: <strong id=\"taReadTime\">0</strong> min</span>" +
        "  <span style=\"font-size:0.8125rem\">Avg word length: <strong id=\"taAvgLen\">0</strong></span>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-secondary\" id=\"taCopyBtn\">Copy Stats</button>" +
        "  <button class=\"btn btn-secondary\" id=\"taClearBtn\">Clear</button>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("taInput");
      var copyBtn = document.getElementById("taCopyBtn");
      var clearBtn = document.getElementById("taClearBtn");

      function update() {
        var text = input.value;
        var chars = text.length;
        var charsNoSpace = text.replace(/[\s]/g, "").length;
        var words = text.trim() ? text.trim().split(/\s+/).length : 0;
        var unique = text.trim() ? new Set(text.trim().toLowerCase().split(/\s+/)).size : 0;
        var sentences = text ? (text.match(/[.!?]+/g) || []).length : 0;
        if (sentences === 0 && text.trim()) sentences = 1;
        var paras = text ? text.split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length : 0;
        if (paras === 0 && text.trim()) paras = 1;
        var avgLen = words > 0 ? (charsNoSpace / words).toFixed(1) : 0;
        var readTime = Math.max(1, Math.ceil(words / 200));

        document.getElementById("taChars").textContent = chars;
        document.getElementById("taCharsNoSpace").textContent = charsNoSpace;
        document.getElementById("taWords").textContent = words;
        document.getElementById("taUnique").textContent = unique;
        document.getElementById("taSentences").textContent = sentences;
        document.getElementById("taParas").textContent = paras;
        document.getElementById("taAvgLen").textContent = avgLen;
        document.getElementById("taReadTime").textContent = readTime;

        // Readability (Flesch-Kincaid simplified)
        var syllables = 0;
        if (words > 0) {
          var wordArr = text.trim().toLowerCase().split(/\s+/);
          for (var i = 0; i < wordArr.length; i++) {
            syllables += wordArr[i].replace(/[^aeiouy]/g, "").length || 1;
          }
          var fkScore = 206.835 - 1.015 * (words / (sentences || 1)) - 84.6 * (syllables / words);
          var level = fkScore > 90 ? "Very Easy" : fkScore > 80 ? "Easy" : fkScore > 70 ? "Fairly Easy" : fkScore > 60 ? "Standard" : fkScore > 50 ? "Fairly Difficult" : fkScore > 30 ? "Difficult" : "Very Difficult";
          document.getElementById("taReadability").textContent = Math.round(fkScore) + " (" + level + ")";
        }
      }

      copyBtn.addEventListener("click", function () {
        var lines = ["=== Text Statistics ==="];
        lines.push("Characters: " + document.getElementById("taChars").textContent);
        lines.push("Characters (no spaces): " + document.getElementById("taCharsNoSpace").textContent);
        lines.push("Words: " + document.getElementById("taWords").textContent);
        lines.push("Unique Words: " + document.getElementById("taUnique").textContent);
        lines.push("Sentences: " + document.getElementById("taSentences").textContent);
        lines.push("Paragraphs: " + document.getElementById("taParas").textContent);
        lines.push("Average Word Length: " + document.getElementById("taAvgLen").textContent);
        lines.push("Reading Time: " + document.getElementById("taReadTime").textContent + " min");
        lines.push("Readability: " + document.getElementById("taReadability").textContent);
        copyToClipboard(lines.join("\n"));
      });

      clearBtn.addEventListener("click", function () { input.value = ""; update(); });
      input.addEventListener("input", update);

      input.value = "The quick brown fox jumps over the lazy dog.\nThis is a sample text paragraph for testing.\nIt contains multiple sentences and line breaks.\n\nPerfect for analyzing text statistics and readability scores.";
      update();
    },
    destroy: function () {}
  };
})();
