(function () {
  var id = "amount-converter";
  var title = "Amount Converter";
  var icon = "\u5143";
  var category = "Productivity";
  var description = "Convert numeric amounts to Chinese characters";
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
        "<input type=\"text\" class=\"input\" id=\"" + id + "-input\" placeholder=\"12345.67\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-convert\">" + __('tool.' + id + '.convert') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var result = box.querySelector("#" + id + "-result");

      function toChinese(num) {
        var digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var units = ['元', '拾', '佰', '仟', '万', '亿'];
        var decimals = ['角', '分'];
        
        var parts = num.toString().split('.');
        var integer = parts[0];
        var decimal = parts[1] || '';
        
        var result = '';
        for (var i = 0; i < integer.length; i++) {
          var digit = parseInt(integer[i]);
          var pos = integer.length - i - 1;
          if (digit !== 0) {
            result += digits[digit] + units[pos % 4];
          } else {
            if (pos % 4 === 0 && result) {
              result += units[pos % 4];
            }
          }
        }
        
        if (decimal) {
          for (var j = 0; j < decimal.length && j < 2; j++) {
            var d = parseInt(decimal[j]);
            if (d !== 0) {
              result += digits[d] + decimals[j];
            }
          }
        }
        
        return result || '零元';
      }

      box.querySelector("#" + id + "-convert").addEventListener("click", function () {
        var num = parseFloat(input.value);
        if (isNaN(num)) {
          result.textContent = "Invalid number";
          result.style.color = '#ef4444';
          return;
        }
        result.textContent = toChinese(num);
        result.style.color = '';
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
        result.style.color = '';
      });

      return box;
    }
  };
})();