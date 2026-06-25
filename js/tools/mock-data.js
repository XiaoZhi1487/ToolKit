(function () {
  var id = "mock-data";
  var title = "Mock Data";
  var icon = "\ud83d\udcbc";
  var category = "Security";
  var description = "Generate mock business data";
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
        "<option value=\"phone\">Phone</option>" +
        "<option value=\"idcard\">ID Card</option>" +
        "<option value=\"email\">Email</option>" +
        "<option value=\"name\">Name</option>" +
        "<option value=\"address\">Address</option>" +
        "<option value=\"all\">All</option>" +
        "</select>" +
        "<label>" + __('tool.' + id + '.count') + "</label>" +
        "<input type=\"number\" class=\"input\" id=\"" + id + "-count\" value=\"10\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-generate\">" + __('tool.' + id + '.generate') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-copy\">" + __('tool.' + id + '.copy') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var typeInput = box.querySelector("#" + id + "-type");
      var countInput = box.querySelector("#" + id + "-count");
      var result = box.querySelector("#" + id + "-result");

      function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function generatePhone() {
        return '1' + randomInt(3, 9) + randomInt(100000000, 999999999);
      }

      function generateIDCard() {
        var area = ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65'];
        var year = randomInt(1950, 2000);
        var month = String(randomInt(1, 12)).padStart(2, '0');
        var day = String(randomInt(1, 28)).padStart(2, '0');
        var seq = String(randomInt(100, 999)).padStart(3, '0');
        var check = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'][randomInt(0, 10)];
        return area[randomInt(0, area.length - 1)] + '01' + String(year) + month + day + seq + check;
      }

      function generateEmail() {
        var domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'qq.com', '163.com'];
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var name = '';
        for (var i = 0; i < 8; i++) name += chars[randomInt(0, chars.length - 1)];
        return name + '@' + domains[randomInt(0, domains.length - 1)];
      }

      function generateName() {
        var surnames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
        var names = ['伟', '芳', '敏', '强', '军', '磊', '洋', '勇', '涛', '明'];
        return surnames[randomInt(0, surnames.length - 1)] + names[randomInt(0, names.length - 1)];
      }

      function generateAddress() {
        var provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省'];
        var cities = ['朝阳区', '浦东新区', '天河区', '西湖区', '鼓楼区'];
        return provinces[randomInt(0, provinces.length - 1)] + cities[randomInt(0, cities.length - 1)] + '路' + randomInt(1, 999) + '号';
      }

      box.querySelector("#" + id + "-generate").addEventListener("click", function () {
        var count = parseInt(countInput.value);
        var data = [];
        for (var i = 0; i < count; i++) {
          var item = {};
          if (typeInput.value === 'phone' || typeInput.value === 'all') item.phone = generatePhone();
          if (typeInput.value === 'idcard' || typeInput.value === 'all') item.idcard = generateIDCard();
          if (typeInput.value === 'email' || typeInput.value === 'all') item.email = generateEmail();
          if (typeInput.value === 'name' || typeInput.value === 'all') item.name = generateName();
          if (typeInput.value === 'address' || typeInput.value === 'all') item.address = generateAddress();
          data.push(item);
        }
        result.textContent = JSON.stringify(data, null, 2);
      });

      box.querySelector("#" + id + "-copy").addEventListener("click", function () {
        navigator.clipboard.writeText(result.textContent);
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        result.textContent = '';
      });

      return box;
    }
  };
})();