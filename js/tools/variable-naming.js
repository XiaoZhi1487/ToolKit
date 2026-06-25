(function () {
  var id = "variable-naming";
  var title = "Variable Naming";
  var icon = "\ud83d\udcdd";
  var category = "Developer";
  var description = "Convert variable naming conventions";
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
        "<input type=\"text\" class=\"input\" id=\"" + id + "-input\" placeholder=\"my_variable_name\">" +
        "</div>" +
        "<div class=\"grid-3\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.snake') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-snake\" readonly>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.camel') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-camel\" readonly>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.pascal') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-pascal\" readonly>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.kebab') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-kebab\" readonly>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.constant') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-constant\" readonly>" +
        "</div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-convert\">" + __('tool.' + id + '.convert') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var snake = box.querySelector("#" + id + "-snake");
      var camel = box.querySelector("#" + id + "-camel");
      var pascal = box.querySelector("#" + id + "-pascal");
      var kebab = box.querySelector("#" + id + "-kebab");
      var constant = box.querySelector("#" + id + "-constant");

      function toWords(str) {
        str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
        str = str.replace(/[^a-zA-Z0-9]+/g, ' ');
        return str.trim().toLowerCase().split(' ').filter(Boolean);
      }

      function convert() {
        var words = toWords(input.value);
        snake.value = words.join('_');
        camel.value = words[0] + words.slice(1).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('');
        pascal.value = words.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('');
        kebab.value = words.join('-');
        constant.value = words.join('_').toUpperCase();
      }

      box.querySelector("#" + id + "-convert").addEventListener("click", convert);
      input.addEventListener("input", convert);

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        snake.value = '';
        camel.value = '';
        pascal.value = '';
        kebab.value = '';
        constant.value = '';
      });

      return box;
    }
  };
})();