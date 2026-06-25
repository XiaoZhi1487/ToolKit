(function () {
  var id = "data-filter";
  var title = "Data Filter";
  var icon = "\ud83d\uddd8";
  var category = "Developer";
  var description = "Remove null/undefined/empty fields from JSON";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder='{\"name\": \"test\", \"empty\": \"\", \"null\": null}'></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-output\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.null') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-null\" checked>" +
        "<label>" + __('tool.' + id + '.undefined') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-undefined\" checked>" +
        "<label>" + __('tool.' + id + '.empty') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-empty\" checked>" +
        "<label>" + __('tool.' + id + '.emptyArray') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-emptyArray\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-filter\">" + __('tool.' + id + '.filter') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var output = box.querySelector("#" + id + "-output");
      var nullInput = box.querySelector("#" + id + "-null");
      var undefinedInput = box.querySelector("#" + id + "-undefined");
      var emptyInput = box.querySelector("#" + id + "-empty");
      var emptyArrayInput = box.querySelector("#" + id + "-emptyArray");

      function shouldRemove(value) {
        if (nullInput.checked && value === null) return true;
        if (undefinedInput.checked && value === undefined) return true;
        if (emptyInput.checked && value === '') return true;
        if (emptyArrayInput.checked && Array.isArray(value) && value.length === 0) return true;
        return false;
      }

      function filterObject(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) {
          return obj.map(filterObject).filter(function (v) { return !shouldRemove(v); });
        }
        var result = {};
        Object.keys(obj).forEach(function (key) {
          var value = filterObject(obj[key]);
          if (!shouldRemove(value)) result[key] = value;
        });
        return result;
      }

      box.querySelector("#" + id + "-filter").addEventListener("click", function () {
        try {
          var obj = JSON.parse(input.value.trim() || '{}');
          output.value = JSON.stringify(filterObject(obj), null, 2);
        } catch (e) {
          output.value = e.message;
        }
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