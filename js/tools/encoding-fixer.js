(function () {
  var id = "encoding-fixer";
  var title = "Encoding Fixer";
  var icon = "\ud83d\udcde";
  var category = "Developer";
  var description = "Fix GBK/UTF8 encoding issues";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"乱码文本\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-output\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.type') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-type\">" +
        "<option value=\"gbk-utf8\">GBK → UTF-8</option>" +
        "<option value=\"utf8-gbk\">UTF-8 → GBK</option>" +
        "<option value=\"url-decode\">URL Decode</option>" +
        "<option value=\"double-encode\">Double Encode Fix</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-fix\">" + __('tool.' + id + '.fix') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var output = box.querySelector("#" + id + "-output");
      var typeInput = box.querySelector("#" + id + "-type");

      function fixEncoding(text, type) {
        switch (type) {
          case 'gbk-utf8':
            try {
              var bytes = new Uint8Array(text.split('').map(function (c) { return c.charCodeAt(0); }));
              var decoder = new TextDecoder('gbk');
              return decoder.decode(bytes);
            } catch (e) { return text; }
          case 'utf8-gbk':
            try {
              var encoder = new TextEncoder();
              var bytes = encoder.encode(text);
              var decoder = new TextDecoder('gbk');
              return decoder.decode(bytes);
            } catch (e) { return text; }
          case 'url-decode':
            return decodeURIComponent(text);
          case 'double-encode':
            try {
              var decoded = text;
              while (decoded !== decodeURIComponent(decoded)) {
                decoded = decodeURIComponent(decoded);
              }
              return decoded;
            } catch (e) { return text; }
          default:
            return text;
        }
      }

      box.querySelector("#" + id + "-fix").addEventListener("click", function () {
        output.value = fixEncoding(input.value, typeInput.value);
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