(function () {
  var id = "comment-remover";
  var title = "Comment Remover";
  var icon = "\u2716";
  var category = "Developer";
  var description = "Remove comments from code";
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
        "<label>" + __('tool.' + id + '.input') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"// comment\\nconsole.log('test');\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-output\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.language') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-language\">" +
        "<option value=\"js\">JavaScript</option>" +
        "<option value=\"css\">CSS</option>" +
        "<option value=\"html\">HTML</option>" +
        "<option value=\"all\">All</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-remove\">" + __('tool.' + id + '.remove') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var output = box.querySelector("#" + id + "-output");
      var languageInput = box.querySelector("#" + id + "-language");

      function removeComments(text, lang) {
        if (lang === 'js' || lang === 'all') {
          text = text.replace(/\/\/.*$/gm, '');
          text = text.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        if (lang === 'css' || lang === 'all') {
          text = text.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        if (lang === 'html' || lang === 'all') {
          text = text.replace(/<!--[\s\S]*?-->/g, '');
        }
        text = text.replace(/^\s*\n/gm, '');
        return text.trim();
      }

      box.querySelector("#" + id + "-remove").addEventListener("click", function () {
        output.value = removeComments(input.value, languageInput.value);
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(output.value);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        output.value = '';
      });

      return box;
    }
  };
})();