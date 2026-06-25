(function () {
  var id = "cookie-editor";
  var title = "Cookie Editor";
  var icon = "\ud83d\udc36";
  var category = "Developer";
  var description = "Parse and manage browser cookies";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"name=value; path=/; expires=...\"></textarea>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-parse\">" + __('tool.' + id + '.parse') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-stringify\">" + __('tool.' + id + '.stringify') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var result = box.querySelector("#" + id + "-result");

      function parseCookie(cookieStr) {
        var cookies = [];
        cookieStr.split(';').forEach(function (part) {
          part = part.trim();
          if (!part) return;
          var eqIdx = part.indexOf('=');
          var key, value;
          if (eqIdx === -1) {
            key = part;
            value = '';
          } else {
            key = part.substring(0, eqIdx);
            value = part.substring(eqIdx + 1);
          }
          cookies.push({ key: key, value: value });
        });
        return cookies;
      }

      function stringifyCookie(cookies) {
        return cookies.map(function (c) {
          return c.key + '=' + c.value;
        }).join('; ');
      }

      box.querySelector("#" + id + "-parse").addEventListener("click", function () {
        try {
          var parsed = parseCookie(input.value);
          result.textContent = JSON.stringify(parsed, null, 2);
        } catch (e) {
          result.textContent = e.message;
        }
      });

      box.querySelector("#" + id + "-stringify").addEventListener("click", function () {
        try {
          var obj = JSON.parse(input.value.trim());
          input.value = stringifyCookie(Array.isArray(obj) ? obj : [obj]);
        } catch (e) {
          result.textContent = e.message;
        }
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();