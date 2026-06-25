(function () {
  var id = "prompt-optimizer";
  var title = "Prompt Optimizer";
  var icon = "\u26A1";
  var category = "AI";
  var description = "Optimize and restructure prompts";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"write code for login\"></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.tone') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-tone\">" +
        "<option value=\"professional\">Professional</option>" +
        "<option value=\"friendly\">Friendly</option>" +
        "<option value=\"technical\">Technical</option>" +
        "</select>" +
        "<label>" + __('tool.' + id + '.length') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-length\">" +
        "<option value=\"short\">Short</option>" +
        "<option value=\"medium\">Medium</option>" +
        "<option value=\"detailed\">Detailed</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-optimize\">" + __('tool.' + id + '.optimize') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var toneInput = box.querySelector("#" + id + "-tone");
      var lengthInput = box.querySelector("#" + id + "-length");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-optimize").addEventListener("click", function () {
        var original = input.value;
        var optimized = "Please provide a " + toneInput.value + " and " + lengthInput.value + " response for the following request:\n\n";
        optimized += "Request: " + original + "\n\n";
        optimized += "Requirements:\n- Be specific and clear\n- Provide examples if applicable\n- Follow best practices\n- Deliver high-quality results";
        result.textContent = optimized;
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();