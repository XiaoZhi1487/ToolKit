(function () {
  var id = "token-calculator";
  var title = "Token Calculator";
  var icon = "\ud83e\udd16";
  var category = "AI";
  var description = "Calculate LLM token count";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"Hello world\"></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.model') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-model\">" +
        "<option value=\"gpt\">GPT</option>" +
        "<option value=\"claude\">Claude</option>" +
        "<option value=\"gemini\">Gemini</option>" +
        "</select>" +
        "<label>" + __('tool.' + id + '.max') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-max\" value=\"4096\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-calculate\">" + __('tool.' + id + '.calculate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var modelInput = box.querySelector("#" + id + "-model");
      var maxInput = box.querySelector("#" + id + "-max");
      var result = box.querySelector("#" + id + "-result");

      function countTokens(text) {
        var chars = text.length;
        var chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        var english = chars - chinese;
        var tokens = Math.ceil(chinese * 1.5 + english * 0.25);
        return tokens;
      }

      box.querySelector("#" + id + "-calculate").addEventListener("click", function () {
        var tokens = countTokens(input.value);
        var max = parseInt(maxInput.value);
        var remaining = max - tokens;
        var cost = (tokens / 1000) * 0.002;
        result.textContent = "Tokens: " + tokens + "\nMax: " + max + "\nRemaining: " + remaining + "\nEstimated Cost: $" + cost.toFixed(4);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();