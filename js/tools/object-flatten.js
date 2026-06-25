(function () {
  var id = "object-flatten";
  var title = "Object Flatten";
  var icon = "\ud83d\udccf";
  var category = "Developer";
  var description = "Flatten and unflatten nested objects";
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
        "<label>" + __('tool.' + id + '.nested') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-nested\" placeholder='{\"user\": {\"name\": \"test\"}}'></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.flattened') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-flattened\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.separator') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-separator\" value=\".\" maxlength=\"1\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-flatten\">" + __('tool.' + id + '.flatten') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-unflatten\">" + __('tool.' + id + '.unflatten') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var nestedInput = box.querySelector("#" + id + "-nested");
      var flattenedInput = box.querySelector("#" + id + "-flattened");
      var separatorInput = box.querySelector("#" + id + "-separator");

      function flatten(obj, separator, prefix) {
        var result = {};
        Object.keys(obj).forEach(function (key) {
          var fullKey = prefix ? prefix + separator + key : key;
          var value = obj[key];
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(result, flatten(value, separator, fullKey));
          } else {
            result[fullKey] = value;
          }
        });
        return result;
      }

      function unflatten(obj, separator) {
        var result = {};
        Object.keys(obj).forEach(function (key) {
          var keys = key.split(separator);
          var target = result;
          for (var i = 0; i < keys.length - 1; i++) {
            if (!target[keys[i]]) target[keys[i]] = {};
            target = target[keys[i]];
          }
          target[keys[keys.length - 1]] = obj[key];
        });
        return result;
      }

      box.querySelector("#" + id + "-flatten").addEventListener("click", function () {
        try {
          var obj = JSON.parse(nestedInput.value.trim() || '{}');
          flattenedInput.value = JSON.stringify(flatten(obj, separatorInput.value || '.'), null, 2);
        } catch (e) {
          flattenedInput.value = e.message;
        }
      });

      box.querySelector("#" + id + "-unflatten").addEventListener("click", function () {
        try {
          var obj = JSON.parse(flattenedInput.value.trim() || '{}');
          nestedInput.value = JSON.stringify(unflatten(obj, separatorInput.value || '.'), null, 2);
        } catch (e) {
          nestedInput.value = e.message;
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        nestedInput.value = '';
        flattenedInput.value = '';
        separatorInput.value = '.';
      });

      return box;
    }
  };
})();