(function () {
  var id = "api-signature";
  var title = "API Signature";
  var icon = "\ud83d\udd10";
  var category = "Developer";
  var description = "Generate MD5/SHA256 API signatures";
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
        "<label>" + __('tool.' + id + '.method') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-method\">" +
        "<option value=\"MD5\">MD5</option>" +
        "<option value=\"SHA256\">SHA256</option>" +
        "<option value=\"SHA512\">SHA512</option>" +
        "</select>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.key') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-key\" placeholder=\"secret key\">" +
        "</div>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.params') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-params\" placeholder='{\"timestamp\": 1234567890, \"data\": \"test\"}'></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.sort') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-sort\" checked>" +
        "<label>" + __('tool.' + id + '.upper') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-upper\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-sign\">" + __('tool.' + id + '.sign') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var methodInput = box.querySelector("#" + id + "-method");
      var keyInput = box.querySelector("#" + id + "-key");
      var paramsInput = box.querySelector("#" + id + "-params");
      var sortInput = box.querySelector("#" + id + "-sort");
      var upperInput = box.querySelector("#" + id + "-upper");
      var result = box.querySelector("#" + id + "-result");

      async function hash(str, algorithm) {
        var encoder = new TextEncoder();
        var data = encoder.encode(str);
        var hash = await crypto.subtle.digest(algorithm.toUpperCase(), data);
        return Array.from(new Uint8Array(hash)).map(function (b) {
          return b.toString(16).padStart(2, '0');
        }).join('');
      }

      box.querySelector("#" + id + "-sign").addEventListener("click", async function () {
        try {
          var params = JSON.parse(paramsInput.value.trim() || '{}');
          var keys = Object.keys(params);
          if (sortInput.checked) keys.sort();
          var signStr = keys.map(function (k) {
            return k + '=' + params[k];
          }).join('&');
          if (keyInput.value) signStr += '&key=' + keyInput.value;
          var signature = await hash(signStr, methodInput.value);
          if (upperInput.checked) signature = signature.toUpperCase();
          result.textContent = signature;
        } catch (e) {
          result.textContent = e.message;
          result.style.color = '#ef4444';
        }
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        keyInput.value = '';
        paramsInput.value = '';
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();