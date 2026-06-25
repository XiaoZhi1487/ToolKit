(function () {
  var id = "array-methods";
  var title = "Array Methods";
  var icon = "\ud83d\udc3d";
  var category = "Developer";
  var description = "Convert for loops to array methods";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"for (let i = 0; i < arr.length; i++) {\\n  if (arr[i] > 10) {\\n    result.push(arr[i]);\\n  }\\n}\"></textarea>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<textarea class=\"code-input\" id=\"" + id + "-output\"></textarea>" +
        "</div>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.method') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-method\">" +
        "<option value=\"filter\">filter</option>" +
        "<option value=\"map\">map</option>" +
        "<option value=\"reduce\">reduce</option>" +
        "<option value=\"find\">find</option>" +
        "<option value=\"forEach\">forEach</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-convert\">" + __('tool.' + id + '.convert') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var output = box.querySelector("#" + id + "-output");
      var methodInput = box.querySelector("#" + id + "-method");

      function convert() {
        var code = input.value;
        var method = methodInput.value;
        var arrMatch = code.match(/for\s*\(\s*let\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*(\w+)\.length\s*;\s*\1\+\+\s*\)/);
        if (!arrMatch) {
          output.value = code;
          return;
        }
        var i = arrMatch[1];
        var arr = arrMatch[2];
        var body = code.match(/\{\s*([\s\S]*)\s*\}/);
        if (!body) {
          output.value = code;
          return;
        }
        var bodyContent = body[1].trim();
        bodyContent = bodyContent.replace(new RegExp(i + '\\[\\]', 'g'), 'element');
        bodyContent = bodyContent.replace(new RegExp(i + '\\.length', 'g'), 'arr.length');

        switch (method) {
          case 'filter':
            output.value = "const result = " + arr + ".filter(element => {\n  return " + bodyContent.split('\n')[0].replace(/if\s*\(\s*([^)]+)\s*\)/, '$1').trim() + ";\n});";
            break;
          case 'map':
            output.value = "const result = " + arr + ".map(element => {\n  " + bodyContent.replace(/result\.push\(/g, 'return ').replace(/\);/g, ';') + "\n});";
            break;
          case 'reduce':
            output.value = "const result = " + arr + ".reduce((acc, element) => {\n  " + bodyContent.replace(/result\./g, 'acc.') + "\n  return acc;\n}, []);";
            break;
          case 'forEach':
            output.value = arr + ".forEach(element => {\n  " + bodyContent + "\n});";
            break;
          default:
            output.value = code;
        }
      }

      box.querySelector("#" + id + "-convert").addEventListener("click", convert);

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