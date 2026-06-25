(function () {
  var id = "ts-type-inference";
  var title = "TS Type Inference";
  var icon = "\ud83d\udc9a";
  var category = "Developer";
  var description = "Generate TypeScript interface from JSON";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.json') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-json\" placeholder='{\"name\": \"test\", \"items\": [{\"id\": 1}]}'></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.name') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-name\" value=\"MyInterface\">" +
        "<label>" + __('tool.' + id + '.optional') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-optional\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-generate\">" + __('tool.' + id + '.generate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var jsonInput = box.querySelector("#" + id + "-json");
      var nameInput = box.querySelector("#" + id + "-name");
      var optionalInput = box.querySelector("#" + id + "-optional");
      var result = box.querySelector("#" + id + "-result");

      function toTsType(value, depth) {
        if (depth > 5) return 'any';
        if (value === null) return 'null';
        if (Array.isArray(value)) {
          if (value.length === 0) return 'any[]';
          return toTsType(value[0], depth + 1) + '[]';
        }
        if (typeof value === 'object') {
          return '{' + Object.keys(value).map(function (k) {
            return k + (optionalInput.checked ? '?' : '') + ': ' + toTsType(value[k], depth + 1);
          }).join('; ') + '}';
        }
        var map = { 'string': 'string', 'number': 'number', 'boolean': 'boolean' };
        return map[typeof value] || 'any';
      }

      box.querySelector("#" + id + "-generate").addEventListener("click", function () {
        try {
          var obj = JSON.parse(jsonInput.value.trim() || '{}');
          var name = nameInput.value.trim() || 'MyInterface';
          var type = toTsType(obj, 0);
          result.textContent = "export interface " + name + " " + type;
        } catch (e) {
          result.textContent = e.message;
          result.style.color = '#ef4444';
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        jsonInput.value = '';
        nameInput.value = 'MyInterface';
        optionalInput.checked = false;
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();