(function () {
  var id = "json-diff-merge";
  var title = "JSON Diff Merge";
  var icon = "\ud83d\udd04";
  var category = "Developer";
  var description = "Deep compare two JSON objects and merge differences";
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
        "<label>" + __('tool.' + id + '.json1') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-json1\" placeholder='{\"name\": \"test\"}'></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.json2') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-json2\" placeholder='{\"name\": \"new\", \"age\": 20}'></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.ignore') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-ignore\" placeholder=\"id,updatedAt\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-compare\">" + __('tool.' + id + '.compare') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-merge\">" + __('tool.' + id + '.merge') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<div class=\"code-output\" id=\"" + id + "-result\"></div>" +
        "</div>" +
        "</div>";

      var json1 = box.querySelector("#" + id + "-json1");
      var json2 = box.querySelector("#" + id + "-json2");
      var ignore = box.querySelector("#" + id + "-ignore");
      var result = box.querySelector("#" + id + "-result");

      function parseJson(s) {
        try { return JSON.parse(s.trim() || '{}'); } catch { return {}; }
      }

      function diff(obj1, obj2, path, ignoreKeys) {
        var changes = [];
        var keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
        keys.forEach(function (key) {
          if (ignoreKeys.includes(key)) return;
          var p = path ? path + '.' + key : key;
          if (!(key in obj1)) {
            changes.push({ type: 'add', path: p, value: obj2[key] });
          } else if (!(key in obj2)) {
            changes.push({ type: 'remove', path: p, value: obj1[key] });
          } else if (typeof obj1[key] !== typeof obj2[key]) {
            changes.push({ type: 'type', path: p, old: obj1[key], new: obj2[key] });
          } else if (typeof obj1[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
            changes.push(...diff(obj1[key], obj2[key], p, ignoreKeys));
          } else if (obj1[key] !== obj2[key]) {
            changes.push({ type: 'modify', path: p, old: obj1[key], new: obj2[key] });
          }
        });
        return changes;
      }

      function merge(obj1, obj2) {
        var result = Object.assign({}, obj1);
        Object.keys(obj2).forEach(function (key) {
          if (typeof obj2[key] === 'object' && obj2[key] !== null && typeof obj1[key] === 'object' && obj1[key] !== null) {
            result[key] = merge(obj1[key], obj2[key]);
          } else {
            result[key] = obj2[key];
          }
        });
        return result;
      }

      function renderDiff(changes) {
        if (changes.length === 0) {
          result.innerHTML = '<pre style="color:#22c55e;">' + __('tool.' + id + '.noDiff') + '</pre>';
          return;
        }
        var html = '<pre>';
        changes.forEach(function (c) {
          var color = c.type === 'add' ? '#22c55e' : c.type === 'remove' ? '#ef4444' : c.type === 'modify' ? '#eab308' : '#3b82f6';
          var prefix = c.type === 'add' ? '+' : c.type === 'remove' ? '-' : '~';
          html += '<span style="color:' + color + ';">' + prefix + ' ' + c.path + ': ' + JSON.stringify(c.type === 'add' || c.type === 'modify' ? c.new : c.old) + '</span>\n';
        });
        html += '</pre>';
        result.innerHTML = html;
      }

      box.querySelector("#" + id + "-compare").addEventListener("click", function () {
        var ignoreKeys = ignore.value.split(',').map(function (k) { return k.trim(); }).filter(Boolean);
        var d = diff(parseJson(json1.value), parseJson(json2.value), '', ignoreKeys);
        renderDiff(d);
      });

      box.querySelector("#" + id + "-merge").addEventListener("click", function () {
        var m = merge(parseJson(json1.value), parseJson(json2.value));
        result.innerHTML = '<pre>' + JSON.stringify(m, null, 2) + '</pre>';
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        json1.value = '';
        json2.value = '';
        ignore.value = '';
        result.innerHTML = '';
      });

      return box;
    }
  };
})();