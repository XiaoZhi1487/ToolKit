(function () {
  var id = "debounce-throttle";
  var title = "Debounce/Throttle";
  var icon = "\u26A1";
  var category = "Developer";
  var description = "Generate debounce and throttle functions";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.type') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-type\">" +
        "<option value=\"debounce\">" + __('tool.' + id + '.debounce') + "</option>" +
        "<option value=\"throttle\">" + __('tool.' + id + '.throttle') + "</option>" +
        "</select>" +
        "<label>" + __('tool.' + id + '.delay') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-delay\" value=\"300\">" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.immediate') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-immediate\">" +
        "<label>" + __('tool.' + id + '.trailing') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-trailing\" checked>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-generate\">" + __('tool.' + id + '.generate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var typeInput = box.querySelector("#" + id + "-type");
      var delayInput = box.querySelector("#" + id + "-delay");
      var immediateInput = box.querySelector("#" + id + "-immediate");
      var trailingInput = box.querySelector("#" + id + "-trailing");
      var result = box.querySelector("#" + id + "-result");

      function generateCode() {
        var type = typeInput.value;
        var delay = delayInput.value;
        var immediate = immediateInput.checked;
        var trailing = trailingInput.checked;

        if (type === 'debounce') {
          return "function debounce(fn, delay" + (immediate || !trailing ? ", options" : "") + ") {\n" +
            "  let timer = null;\n" +
            "  " + (immediate || !trailing ? "const { immediate = " + immediate + ", trailing = " + trailing + " } = options || {};\n" : "") +
            "  return function(...args) {\n" +
            "    if (timer) clearTimeout(timer);\n" +
            (immediate ? "    if (!timer && immediate) fn.apply(this, args);\n" : "") +
            "    timer = setTimeout(() => {\n" +
            (trailing ? "      fn.apply(this, args);\n" : "") +
            "      timer = null;\n" +
            "    }, " + delay + ");\n" +
            "  };\n" +
            "}";
        } else {
          return "function throttle(fn, delay" + (immediate || !trailing ? ", options" : "") + ") {\n" +
            "  let lastTime = 0;\n" +
            "  let timer = null;\n" +
            "  " + (immediate || !trailing ? "const { immediate = " + immediate + ", trailing = " + trailing + " } = options || {};\n" : "") +
            "  return function(...args) {\n" +
            "    const now = Date.now();\n" +
            (immediate ? "    if (!lastTime && immediate) fn.apply(this, args);\n" : "") +
            "    if (now - lastTime >= " + delay + ") {\n" +
            "      lastTime = now;\n" +
            "      fn.apply(this, args);\n" +
            "    }" + (trailing ? " else {\n" +
            "      if (timer) clearTimeout(timer);\n" +
            "      timer = setTimeout(() => {\n" +
            "        fn.apply(this, args);\n" +
            "        lastTime = Date.now();\n" +
            "      }, " + delay + ");\n" +
            "    }" : "") +
            "  };\n" +
            "}";
        }
      }

      box.querySelector("#" + id + "-generate").addEventListener("click", function () {
        result.textContent = generateCode();
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      return box;
    }
  };
})();