(function () {
  var id = "float-precision";
  var title = "Float Precision";
  var icon = "\u03C0";
  var category = "Developer";
  var description = "Fix JavaScript floating point precision issues";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-3\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.num1') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-num1\" placeholder=\"0.1\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.num2') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-num2\" placeholder=\"0.2\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.decimals') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-decimals\" value=\"10\">" +
        "</div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-add\">+</button>" +
        "<button class=\"btn\" id=\"" + id + "-sub\">-</button>" +
        "<button class=\"btn\" id=\"" + id + "-mul\">×</button>" +
        "<button class=\"btn\" id=\"" + id + "-div\">÷</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var num1Input = box.querySelector("#" + id + "-num1");
      var num2Input = box.querySelector("#" + id + "-num2");
      var decimalsInput = box.querySelector("#" + id + "-decimals");
      var result = box.querySelector("#" + id + "-result");

      function calculate(op) {
        try {
          var num1 = parseFloat(num1Input.value);
          var num2 = parseFloat(num2Input.value);
          var decimals = parseInt(decimalsInput.value) || 10;
          var multiplier = Math.pow(10, decimals);

          var resultNum;
          switch (op) {
            case 'add':
              resultNum = (Math.round(num1 * multiplier) + Math.round(num2 * multiplier)) / multiplier;
              break;
            case 'sub':
              resultNum = (Math.round(num1 * multiplier) - Math.round(num2 * multiplier)) / multiplier;
              break;
            case 'mul':
              resultNum = (num1 * num2).toFixed(decimals);
              break;
            case 'div':
              resultNum = (num1 / num2).toFixed(decimals);
              break;
          }

          var normalResult = op === 'add' ? num1 + num2 : op === 'sub' ? num1 - num2 : op === 'mul' ? num1 * num2 : num1 / num2;
          result.textContent = "Normal: " + normalResult + "\nFixed: " + resultNum;
        } catch (e) {
          result.textContent = e.message;
          result.style.color = '#ef4444';
        }
      }

      box.querySelector("#" + id + "-add").addEventListener("click", function () { calculate('add'); });
      box.querySelector("#" + id + "-sub").addEventListener("click", function () { calculate('sub'); });
      box.querySelector("#" + id + "-mul").addEventListener("click", function () { calculate('mul'); });
      box.querySelector("#" + id + "-div").addEventListener("click", function () { calculate('div'); });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        num1Input.value = '';
        num2Input.value = '';
        decimalsInput.value = '10';
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();