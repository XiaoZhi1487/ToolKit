(function () {
  var id = "query-body-converter";
  var title = "Query/Body Converter";
  var icon = "\ud83d\udce1";
  var category = "Developer";
  var description = "Convert URL query params to JSON body and vice versa";
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
        "<label>" + __('tool.' + id + '.query') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-query\" placeholder=\"name=test&age=20&tags=a&tags=b\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.body') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-body\" placeholder='{\"name\": \"test\", \"age\": 20}'></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-queryToBody\">" + __('tool.' + id + '.queryToBody') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-bodyToQuery\">" + __('tool.' + id + '.bodyToQuery') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var queryInput = box.querySelector("#" + id + "-query");
      var bodyInput = box.querySelector("#" + id + "-body");

      function queryToObject(query) {
        var obj = {};
        query.split('&').forEach(function (pair) {
          var parts = pair.split('=');
          var key = decodeURIComponent(parts[0]);
          var value = parts.length > 1 ? decodeURIComponent(parts[1]) : '';
          if (key.includes('.')) {
            var keys = key.split('.');
            var target = obj;
            for (var i = 0; i < keys.length - 1; i++) {
              if (!target[keys[i]]) target[keys[i]] = {};
              target = target[keys[i]];
            }
            target[keys[keys.length - 1]] = value;
          } else if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
            obj[key].push(value);
          } else {
            obj[key] = value;
          }
        });
        return obj;
      }

      function objectToQuery(obj, prefix) {
        var parts = [];
        Object.keys(obj).forEach(function (key) {
          var fullKey = prefix ? prefix + '.' + key : key;
          var value = obj[key];
          if (Array.isArray(value)) {
            value.forEach(function (v) {
              parts.push(encodeURIComponent(fullKey) + '=' + encodeURIComponent(v));
            });
          } else if (typeof value === 'object' && value !== null) {
            parts.push(objectToQuery(value, fullKey));
          } else {
            parts.push(encodeURIComponent(fullKey) + '=' + encodeURIComponent(value));
          }
        });
        return parts.join('&');
      }

      box.querySelector("#" + id + "-queryToBody").addEventListener("click", function () {
        try {
          bodyInput.value = JSON.stringify(queryToObject(queryInput.value), null, 2);
        } catch (e) {
          bodyInput.value = e.message;
        }
      });

      box.querySelector("#" + id + "-bodyToQuery").addEventListener("click", function () {
        try {
          var obj = JSON.parse(bodyInput.value.trim() || '{}');
          queryInput.value = objectToQuery(obj);
        } catch (e) {
          queryInput.value = e.message;
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        queryInput.value = '';
        bodyInput.value = '';
      });

      return box;
    }
  };
})();