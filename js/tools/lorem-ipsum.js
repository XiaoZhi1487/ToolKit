// Tool :: Lorem Ipsum Generator
(function () {
  var id = "lorem-ipsum";
  var title = "Lorem Ipsum Generator";
  var icon = "\ud83d\udcdd";
  var category = "Text";
  var description = "Generate placeholder text in various lengths and formats";
  window.toolMeta.push({ id, title, icon, category, description });

  var WORDS = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","ut","aliquip","ex","ea","commodo","consequat","duis","aute","irure","dolor","in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"];

  function generateWords(count) {
    var result = [];
    for (var i = 0; i < count; i++) {
      result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    return result.join(" ");
  }

  function generateSentences(count) {
    var result = [];
    for (var i = 0; i < count; i++) {
      var wordCount = 8 + Math.floor(Math.random() * 12);
      var sentence = generateWords(wordCount);
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
      result.push(sentence);
    }
    return result.join(" ");
  }

  function generateParagraphs(count) {
    var result = [];
    for (var i = 0; i < count; i++) {
      result.push(generateSentences(3 + Math.floor(Math.random() * 5)));
    }
    return result.join("\n\n");
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>Type</label>" +
        "<div class=\"tab-bar\" id=\"liTabBar\">" +
        "  <button class=\"tab-btn active\" data-type=\"words\">Words</button>" +
        "  <button class=\"tab-btn\" data-type=\"sentences\">Sentences</button>" +
        "  <button class=\"tab-btn\" data-type=\"paragraphs\">Paragraphs</button>" +
        "</div>" +
        "<label>Count</label>" +
        "<input type=\"number\" id=\"liCount\" value=\"3\" min=\"1\" max=\"100\" style=\"width:100px\">" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"liGenBtn\">Generate</button>" +
        "  <button class=\"btn btn-secondary\" id=\"liCopyBtn\">Copy</button>" +
        "</div>" +
        "<textarea id=\"liOutput\" rows=\"8\" readonly style=\"font-size:0.875rem\"></textarea>" +
        "</div>";
      return box;
    },
    init: function () {
      var genBtn = document.getElementById("liGenBtn");
      var copyBtn = document.getElementById("liCopyBtn");
      var output = document.getElementById("liOutput");
      var countEl = document.getElementById("liCount");
      var tabBar = document.getElementById("liTabBar");
      var type = "words";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        type = btn.dataset.type;
      });

      function generate() {
        var count = Math.min(100, Math.max(1, parseInt(countEl.value) || 1));
        switch (type) {
          case "words": output.value = generateWords(count); break;
          case "sentences": output.value = generateSentences(count); break;
          case "paragraphs": output.value = generateParagraphs(count); break;
        }
      }

      genBtn.addEventListener("click", generate);
      copyBtn.addEventListener("click", function () { if (output.value) copyToClipboard(output.value); });
      generate();
    },
    destroy: function () {}
  };
})();
