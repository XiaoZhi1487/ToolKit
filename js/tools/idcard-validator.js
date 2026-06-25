(function () {
  var id = "idcard-validator";
  var title = "ID Card Validator";
  var icon = "\ud83d\udc64";
  var category = "Productivity";
  var description = "Validate Chinese ID card number";
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
        "<input type=\"text\" class=\"input\" id=\"" + id + "-input\" placeholder=\"110101199001011234\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-validate\">" + __('tool.' + id + '.validate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var result = box.querySelector("#" + id + "-result");

      function validateIDCard(idcard) {
        if (!/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idcard)) {
          return { valid: false, message: "Invalid format" };
        }

        var checkCode = idcard[idcard.length - 1].toUpperCase();
        var factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        var sum = 0;
        for (var i = 0; i < 17; i++) {
          sum += parseInt(idcard[i]) * factors[i];
        }
        
        var expectedCode = codes[sum % 11];
        
        if (checkCode !== expectedCode) {
          return { valid: false, message: "Check digit mismatch" };
        }

        var birth = idcard.substring(6, 14);
        var year = parseInt(birth.substring(0, 4));
        var month = parseInt(birth.substring(4, 6));
        var day = parseInt(birth.substring(6, 8));
        var gender = parseInt(idcard[16]) % 2 === 1 ? 'Male' : 'Female';

        return {
          valid: true,
          birth: year + '-' + month + '-' + day,
          gender: gender
        };
      }

      box.querySelector("#" + id + "-validate").addEventListener("click", function () {
        var resultData = validateIDCard(input.value);
        if (resultData.valid) {
          result.textContent = "Valid ✓\nBirth: " + resultData.birth + "\nGender: " + resultData.gender;
          result.style.color = '#22c55e';
        } else {
          result.textContent = "Invalid ✗\n" + resultData.message;
          result.style.color = '#ef4444';
        }
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