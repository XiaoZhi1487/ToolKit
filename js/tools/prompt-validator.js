(function () {
  var id = "prompt-validator";
  var title = "Prompt Validator";
  var icon = "\u2705";
  var category = "AI";
  var description = "Validate AI output format compliance";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.input') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder='{\"result\": \"test\"}'></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.format') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-format\">" +
        "<option value=\"json\">JSON</option>" +
        "<option value=\"markdown\">Markdown</option>" +
        "<option value=\"html\">HTML</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-validate\">" + __('tool.' + id + '.validate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-fix\">" + __('tool.' + id + '.fix') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var formatInput = box.querySelector("#" + id + "-format");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-validate").addEventListener("click", function () {
        var text = input.value.trim();
        try {
          if (formatInput.value === 'json') {
            JSON.parse(text);
            result.textContent = "Valid JSON ✓";
            result.style.color = '#22c55e';
          } else if (formatInput.value === 'markdown') {
            if (text.includes('#') || text.includes('**') || text.includes('- ')) {
              result.textContent = "Valid Markdown ✓";
              result.style.color = '#22c55e';
            } else {
              result.textContent = "Warning: May not be valid markdown";
              result.style.color = '#eab308';
            }
          } else {
            if (text.includes('<') && text.includes('>')) {
              result.textContent = "Valid HTML ✓";
              result.style.color = '#22c55e';
            } else {
              result.textContent = "Warning: May not be valid HTML";
              result.style.color = '#eab308';
            }
          }
        } catch (e) {
          result.textContent = "Invalid: " + e.message;
          result.style.color = '#ef4444';
        }
      });

      box.querySelector("#" + id + "-fix").addEventListener("click", function () {
        var text = input.value.trim();
        try {
          if (formatInput.value === 'json') {
            var jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              var fixed = JSON.parse(jsonMatch[0]);
              input.value = JSON.stringify(fixed, null, 2);
              result.textContent = "Fixed ✓";
              result.style.color = '#22c55e';
            } else {
              result.textContent = "No JSON found";
              result.style.color = '#ef4444';
            }
          }
        } catch (e) {
          result.textContent = "Fix failed: " + e.message;
          result.style.color = '#ef4444';
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();