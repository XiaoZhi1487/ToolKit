(function () {
  var id = "data-masking";
  var title = "Data Masking";
  var icon = "\ud83d\udc64";
  var category = "Security";
  var description = "Mask sensitive information";
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
        "<textarea class=\"code-input\" id=\"" + id + "-input\" placeholder=\"Phone: 13812345678\\nID: 110101199001011234\"></textarea>" +
        "</div>" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.phone') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-phone\" checked>" +
        "<label>" + __('tool.' + id + '.idcard') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-idcard\" checked>" +
        "<label>" + __('tool.' + id + '.email') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-email\">" +
        "<label>" + __('tool.' + id + '.name') + "</label>" +
        "<input type=\"checkbox\" id=\"" + id + "-name\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-mask\">" + __('tool.' + id + '.mask') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var phoneInput = box.querySelector("#" + id + "-phone");
      var idcardInput = box.querySelector("#" + id + "-idcard");
      var emailInput = box.querySelector("#" + id + "-email");
      var nameInput = box.querySelector("#" + id + "-name");
      var result = box.querySelector("#" + id + "-result");

      box.querySelector("#" + id + "-mask").addEventListener("click", function () {
        var text = input.value;
        if (phoneInput.checked) text = text.replace(/1[3-9]\d{9}/g, '1*******');
        if (idcardInput.checked) text = text.replace(/[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]/g, '**********');
        if (emailInput.checked) text = text.replace(/([\w.-]+)@([\w.-]+)\.\w{2,}/g, '***@$2');
        if (nameInput.checked) text = text.replace(/[\u4e00-\u9fa5]{2,4}/g, function (n) { return n.charAt(0) + '*'.repeat(n.length - 1); });
        result.textContent = text;
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();