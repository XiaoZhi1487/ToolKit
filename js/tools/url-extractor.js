(function () {
  var id = "url-extractor";
  var title = "URL Extractor";
  var icon = "\ud83d\udccd";
  var category = "Developer";
  var description = "Extract URLs from text";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"Visit https://example.com and http://test.org/path\"></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.unique') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-unique\" checked>" +
        "<label>" + __('tool.' + id + '.validate') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-validate\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-extract\">" + __('tool.' + id + '.extract') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var uniqueInput = box.querySelector("#" + id + "-unique");
      var validateInput = box.querySelector("#" + id + "-validate");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-extract").addEventListener("click", function () {
        var regex = /https?:\/\/[\w.-]+(?:\/[\w./?%&=-]*)*/g;
        var matches = input.value.match(regex) || [];
        if (uniqueInput.checked) matches = [...new Set(matches)];
        if (validateInput.checked) {
          matches = matches.filter(function (url) {
            try {
              new URL(url);
              return true;
            } catch {
              return false;
            }
          });
        }
        result.textContent = matches.join('\n');
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