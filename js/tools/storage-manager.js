(function () {
  var id = "storage-manager";
  var title = "Storage Manager";
  var icon = "\ud83d\udcbe";
  var category = "Developer";
  var description = "Manage localStorage and sessionStorage";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"form-row\">" +
        "<label>" + __('tool.' + id + '.storage') + "</label>" +
        "<select class=\"input\" id=\"" + id + "-storage\">" +
        "<option value=\"local\">localStorage</option>" +
        "<option value=\"session\">sessionStorage</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"grid-2\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.key') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-key\" placeholder=\"key\">" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.value') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-value\" placeholder=\"value\">" +
        "</div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-get\">" + __('tool.' + id + '.get') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-set\">" + __('tool.' + id + '.set') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-remove\">" + __('tool.' + id + '.remove') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-export\">" + __('tool.' + id + '.export') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.items') + "</label>" +
        "<div class=\"code-output\" id=\"" + id + "-items\"></div>" +
        "</div>" +
        "</div>";

      var storageSelect = box.querySelector("#" + id + "-storage");
      var keyInput = box.querySelector("#" + id + "-key");
      var valueInput = box.querySelector("#" + id + "-value");
      var itemsDiv = box.querySelector("#" + id + "-items");

      function getStorage() {
        return storageSelect.value === 'local' ? localStorage : sessionStorage;
      }

      function renderItems() {
        var storage = getStorage();
        var html = '<table><thead><tr><th>' + __('tool.' + id + '.key') + '</th><th>' + __('tool.' + id + '.value') + '</th><th></th></tr></thead><tbody>';
        for (var i = 0; i < storage.length; i++) {
          var key = storage.key(i);
          var val = storage.getItem(key);
          html += '<tr><td>' + key + '</td><td>' + val + '</td><td><button onclick="window.tools[\'' + id + '\'].removeItem(\'' + key + '\')">×</button></td></tr>';
        }
        html += '</tbody></table>';
        itemsDiv.innerHTML = html;
      }

      box.querySelector("#" + id + "-get").addEventListener("click", function () {
        valueInput.value = getStorage().getItem(keyInput.value) || '';
      });

      box.querySelector("#" + id + "-set").addEventListener("click", function () {
        getStorage().setItem(keyInput.value, valueInput.value);
        renderItems();
      });

      box.querySelector("#" + id + "-remove").addEventListener("click", function () {
        getStorage().removeItem(keyInput.value);
        renderItems();
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        getStorage().clear();
        renderItems();
      });

      box.querySelector("#" + id + "-export").addEventListener("click", function () {
        var data = {};
        var storage = getStorage();
        for (var i = 0; i < storage.length; i++) {
          data[storage.key(i)] = storage.getItem(storage.key(i));
        }
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'storage-backup.json';
        a.click();
        URL.revokeObjectURL(url);
      });

      storageSelect.addEventListener("change", renderItems);
      setTimeout(renderItems, 100);

      this.removeItem = function (key) {
        getStorage().removeItem(key);
        renderItems();
      };

      return box;
    }
  };
})();