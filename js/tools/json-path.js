// Tool :: JSON Path Extractor
(function () {
  var id = "json-path";
  var title = "JSON Path Extractor";
  var icon = "\ud83d\udd0d";
  var category = "Developer";
  var description = "Extract data from JSON using JSONPath expressions";
  window.toolMeta.push({ id, title, icon, category, description });
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
        "  <label>" + __('tool.' + id + '.json') + "</label>",
        "  <textarea id=\"jsonPathInput\" rows=\"8\" spellcheck=\"false\" style=\"font-family:var(--font-mono);font-size:0.75rem\"></textarea>",
        "  <label>" + __('tool.' + id + '.path') + "</label>",
        "  <input type=\"text\" id=\"jsonPathExpr\" placeholder=\"" + __('tool.' + id + '.pathPlaceholder') + "\" style=\"width:100%;box-sizing:border-box;font-family:var(--font-mono);font-size:0.8125rem\">",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"jsonPathExtractBtn\">" + __('tool.' + id + '.extract') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"jsonPathClearBtn\">" + __('common.clear') + "</button>",
        "  </div>",
        "  <label>" + __('tool.' + id + '.result') + "</label>",
        "  <div class=\"output-box\" id=\"jsonPathOutput\" style=\"font-family:var(--font-mono);font-size:0.75rem;white-space:pre;overflow:auto;max-height:300px\"></div>",
        "  <button class=\"btn btn-secondary\" id=\"jsonPathCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("jsonPathInput");
      var expr = document.getElementById("jsonPathExpr");
      var output = document.getElementById("jsonPathOutput");
      var extractBtn = document.getElementById("jsonPathExtractBtn");
      var clearBtn = document.getElementById("jsonPathClearBtn");
      var copyBtn = document.getElementById("jsonPathCopyBtn");

      // Default example JSON
      var defaultJson = JSON.stringify({
        "store": {
          "book": [
            { "title": "Book A", "price": 12.99 },
            { "title": "Book B", "price": 8.99 }
          ],
          "bicycle": { "color": "red", "price": 199.99 }
        }
      }, null, 2);
      input.value = defaultJson;
      expr.value = "$.store.book[0].title";

      function jsonPath(obj, expr) {
        var path = expr.replace(/^\$\.?/, '');
        if (!path) return [obj];
        var parts = path.split('.');
        var results = [obj];
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          var newResults = [];
          var bracketMatch = part.match(/(\w+)\[(\d+)\]/);
          for (var j = 0; j < results.length; j++) {
            var current = results[j];
            if (current === null || current === undefined) continue;
            if (bracketMatch) {
              var key = bracketMatch[1];
              var idx = parseInt(bracketMatch[2]);
              if (current[key] && current[key][idx] !== undefined) {
                newResults.push(current[key][idx]);
              }
            } else if (part === '*') {
              if (Array.isArray(current)) {
                for (var k = 0; k < current.length; k++) newResults.push(current[k]);
              } else if (typeof current === 'object') {
                for (var key in current) newResults.push(current[key]);
              }
            } else {
              if (current[part] !== undefined) newResults.push(current[part]);
            }
          }
          results = newResults;
        }
        return results;
      }

      function doExtract() {
        var jsonStr = input.value.trim();
        var pathExpr = expr.value.trim();
        if (!jsonStr || !pathExpr) return;
        try {
          var obj = JSON.parse(jsonStr);
          var result = jsonPath(obj, pathExpr);
          if (result.length === 0) {
            output.textContent = __('tool.' + id + '.error');
          } else {
            output.textContent = JSON.stringify(result.length === 1 ? result[0] : result, null, 2);
          }
        } catch (e) {
          output.textContent = "Error: " + e.message;
        }
      }

      extractBtn.addEventListener("click", doExtract);

      clearBtn.addEventListener("click", function () {
        input.value = defaultJson;
        expr.value = "$.store.book[0].title";
        output.textContent = "";
      });

      copyBtn.addEventListener("click", function () {
        if (output.textContent) copyToClipboard(output.textContent);
      });

      doExtract();
    },
    destroy: function () {}
  };
})();