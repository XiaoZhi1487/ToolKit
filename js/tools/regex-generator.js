(function () {
  var id = "regex-generator";
  var title = "Regex Generator";
  var icon = "\ud83d\uddd2";
  var category = "Developer";
  var description = "Generate common business regex patterns";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.type') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-type\">" +
        "<option value=\"phone\">" + __('tool.' + id + '.phone') + "</option>" +
        "<option value=\"email\">" + __('tool.' + id + '.email') + "</option>" +
        "<option value=\"idcard\">" + __('tool.' + id + '.idcard') + "</option>" +
        "<option value=\"bankcard\">" + __('tool.' + id + '.bankcard') + "</option>" +
        "<option value=\"ip\">" + __('tool.' + id + '.ip') + "</option>" +
        "<option value=\"domain\">" + __('tool.' + id + '.domain') + "</option>" +
        "<option value=\"url\">" + __('tool.' + id + '.url') + "</option>" +
        "<option value=\"credit\">" + __('tool.' + id + '.credit') + "</option>" +
        "<option value=\"date\">" + __('tool.' + id + '.date') + "</option>" +
        "<option value=\"time\">" + __('tool.' + id + '.time') + "</option>" +
        "</select>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-generate\">" + __('tool.' + id + '.generate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>" +
        "</div>";

      var typeInput = box.querySelector("#" + id + "-type");
      var result = box.querySelector("#" + id + "-result");

      var patterns = {
        phone: '^1[3-9]\\d{9}$',
        email: '^[\\w.-]+@[\\w.-]+\\.\\w{2,}$',
        idcard: '^[1-9]\\d{5}(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$',
        bankcard: '^\\d{16,19}$',
        ip: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
        domain: '^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$',
        url: '^https?:\\/\\/([\\w.-]+)(:[0-9]+)?([\\/\\w.-]*)*(\\?[\\w=&-]*)?(#\\w*)?$',
        credit: '^4[0-9]{12}(?:[0-9]{3})?$|^5[1-5][0-9]{14}$|^3[47][0-9]{13}$',
        date: '^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
        time: '^([01]\\d|2[0-3]):([0-5]\\d)(:([0-5]\\d))?$'
      };

      box.querySelector("#" + id + "-generate").addEventListener("click", function () {
        result.textContent = '/^' + patterns[typeInput.value] + '$/';
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      return box;
    }
  };
})();