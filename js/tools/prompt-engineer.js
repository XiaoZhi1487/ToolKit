(function () {
  var id = "prompt-engineer";
  var title = "Prompt Engineer";
  var icon = "\ud83d\udca1";
  var category = "AI";
  var description = "Build structured system prompts";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.role') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-role\" placeholder=\"Senior Software Engineer\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.constraints') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-constraints\" placeholder=\"Use TypeScript\\nKeep code clean\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.format') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-format\" placeholder=\"JSON format\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.prohibited') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-prohibited\" placeholder=\"Do not explain\"></textarea>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-generate\">" + __('tool.' + id + '.generate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var roleInput = box.querySelector("#" + id + "-role");
      var constraintsInput = box.querySelector("#" + id + "-constraints");
      var formatInput = box.querySelector("#" + id + "-format");
      var prohibitedInput = box.querySelector("#" + id + "-prohibited");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-generate").addEventListener("click", function () {
        var prompt = "## Role\n" + roleInput.value + "\n\n";
        if (constraintsInput.value) prompt += "## Constraints\n" + constraintsInput.value + "\n\n";
        if (formatInput.value) prompt += "## Output Format\n" + formatInput.value + "\n\n";
        if (prohibitedInput.value) prompt += "## Prohibited\n" + prohibitedInput.value + "\n\n";
        prompt += "## Task\n[Enter your task here]";
        result.textContent = prompt;
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        roleInput.value = '';
        constraintsInput.value = '';
        formatInput.value = '';
        prohibitedInput.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();