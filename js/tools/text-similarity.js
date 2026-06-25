(function () {
  var id = "text-similarity";
  var title = "Text Similarity";
  var icon = "\ud83d\udd0d";
  var category = "AI";
  var description = "Calculate text similarity percentage";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.text1') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-text1\" placeholder=\"First text\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.text2') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-text2\" placeholder=\"Second text\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-compare\">" + __('tool.' + id + '.compare') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var text1 = box.querySelector("#" + id + "-text1");
      var text2 = box.querySelector("#" + id + "-text2");
      var result = box.querySelector("#" + id + "-result");

      function getWords(text) {
        return text.toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ' ').split(' ').filter(Boolean);
      }

      function jaccardSimilarity(text1, text2) {
        var words1 = new Set(getWords(text1));
        var words2 = new Set(getWords(text2));
        var intersection = 0;
        words1.forEach(function (w) {
          if (words2.has(w)) intersection++;
        });
        var union = words1.size + words2.size - intersection;
        return union === 0 ? 0 : (intersection / union * 100).toFixed(2);
      }

      box.querySelector("#" + id + "-compare").addEventListener("click", function () {
        var similarity = jaccardSimilarity(text1.value, text2.value);
        result.textContent = "Similarity: " + similarity + "%";
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        text1.value = '';
        text2.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();