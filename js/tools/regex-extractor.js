(function () {
  var id = "regex-extractor";
  var title = "Regex Extractor";
  var icon = "\ud83d\udd0d";
  var category = "Developer";
  var description = "Extract content using regex patterns";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.pattern') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-pattern\" placeholder=\"\\d+\"> " +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.flags') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-flags\" value=\"g\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.text') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-text\" placeholder=\"Text with numbers 123 and 456\"></textarea>" +
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

      var patternInput = box.querySelector("#" + id + "-pattern");
      var flagsInput = box.querySelector("#" + id + "-flags");
      var textInput = box.querySelector("#" + id + "-text");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-extract").addEventListener("click", function () {
        try {
          var regex = new RegExp(patternInput.value, flagsInput.value);
          var matches = textInput.value.match(regex) || [];
          result.textContent = matches.join('\n');
        } catch (e) {
          result.textContent = e.message;
          result.style.color = '#ef4444';
        }
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        patternInput.value = '';
        flagsInput.value = 'g';
        textInput.value = '';
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();