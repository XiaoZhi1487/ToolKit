(function () {
  var id = "json-schema";
  var title = "JSON Schema";
  var icon = "\ud83d\udccb";
  var category = "Developer";
  var description = "Generate and validate JSON Schema";
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
        "<label>" + __('tool.' + id + '.json') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-json\" placeholder='{\"name\": \"test\", \"age\": 20}'></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.schema') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-schema\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.required') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-required\" placeholder=\"name,age\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-generate\">" + __('tool.' + id + '.generate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-validate\">" + __('tool.' + id + '.validate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<div class=\"code-output\" id=\"" + id + "-result\"></div>" +
        "</div>" +
        "</div>";

      var jsonInput = box.querySelector("#" + id + "-json");
      var schemaInput = box.querySelector("#" + id + "-schema");
      var requiredInput = box.querySelector("#" + id + "-required");
      var result = box.querySelector("#" + id + "-result");

      function getType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
      }

      function generateSchema(obj, requiredKeys) {
        var schema = { type: 'object', properties: {}, required: [] };
        Object.keys(obj).forEach(function (key) {
          var value = obj[key];
          var prop = {};
          var type = getType(value);
          prop.type = type;
          if (type === 'object' && value !== null) {
            prop = generateSchema(value, []);
          } else if (type === 'array' && value.length > 0) {
            prop.items = generateSchema({ '0': value[0] }, []).properties['0'];
          }
          schema.properties[key] = prop;
          if (requiredKeys.includes(key)) schema.required.push(key);
        });
        return schema;
      }

      function validateSchema(obj, schema) {
        var errors = [];
        function validate(value, sch, path) {
          if (sch.type && getType(value) !== sch.type) {
            errors.push(path + ': expected ' + sch.type + ', got ' + getType(value));
          }
          if (sch.required) {
            sch.required.forEach(function (key) {
              if (!(key in value)) errors.push(path + '.' + key + ': required');
            });
          }
          if (sch.properties) {
            Object.keys(sch.properties).forEach(function (key) {
              if (key in value) validate(value[key], sch.properties[key], path ? path + '.' + key : key);
            });
          }
          if (sch.items && Array.isArray(value)) {
            value.forEach(function (item, i) { validate(item, sch.items, path + '[' + i + ']'); });
          }
        }
        validate(obj, schema, '');
        return errors;
      }

      box.querySelector("#" + id + "-generate").addEventListener("click", function () {
        try {
          var obj = JSON.parse(jsonInput.value.trim() || '{}');
          var required = requiredInput.value.split(',').map(function (k) { return k.trim(); }).filter(Boolean);
          var schema = generateSchema(obj, required);
          schemaInput.value = JSON.stringify(schema, null, 2);
          result.innerHTML = '<pre style="color:#22c55e;">' + __('tool.' + id + '.generated') + '</pre>';
        } catch (e) {
          result.innerHTML = '<pre style="color:#ef4444;">' + e.message + '</pre>';
        }
      });

      box.querySelector("#" + id + "-validate").addEventListener("click", function () {
        try {
          var obj = JSON.parse(jsonInput.value.trim() || '{}');
          var schema = JSON.parse(schemaInput.value.trim() || '{}');
          var errors = validateSchema(obj, schema);
          if (errors.length === 0) {
            result.innerHTML = '<pre style="color:#22c55e;">' + __('tool.' + id + '.valid') + '</pre>';
          } else {
            result.innerHTML = '<pre style="color:#ef4444;">' + errors.join('\n') + '</pre>';
          }
        } catch (e) {
          result.innerHTML = '<pre style="color:#ef4444;">' + e.message + '</pre>';
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        jsonInput.value = '';
        schemaInput.value = '';
        requiredInput.value = '';
        result.innerHTML = '';
      });

      return box;
    }
  };
})();