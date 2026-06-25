// Tool :: Unit Price
(function () {
  var id = "unit-price";
  var title = "Unit Price";
  var icon = "\ud83c\udf7d\ufe0f";
  var category = "Productivity";
  var description = "Compare unit prices of different package sizes";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div id=\"upItems\"></div>" +
        "<button class=\"btn btn-primary\" id=\"upAddBtn\">" + __("tool.unit-price.addItem") + "</button>" +
        "<button class=\"btn btn-secondary\" id=\"upCompareBtn\">" + __("tool.unit-price.compare") + "</button>" +
        "<div id=\"upResult\" style=\"margin-top:8px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var container = document.getElementById("upItems");
      var addBtn = document.getElementById("upAddBtn");
      var compareBtn = document.getElementById("upCompareBtn");
      var result = document.getElementById("upResult");
      var itemCount = 0;
      function addItem(name, price, qty, unit) {
        itemCount++;
        var idx = itemCount;
        var div = document.createElement("div");
        div.className = "flex-row";
        div.style.cssText = "gap:6px;margin-bottom:6px;flex-wrap:wrap;padding:8px;background:var(--surface-secondary);border-radius:8px";
        div.innerHTML = "<input type=\"text\" class=\"tool-input\" id=\"upName" + idx + "\" placeholder=\"" + __("tool.unit-price.itemName") + "\" value=\"" + (name || "Item " + idx) + "\" style=\"flex:1;min-width:80px\">" +
          "<input type=\"number\" class=\"tool-input\" id=\"upPrice" + idx + "\" placeholder=\"" + __("tool.unit-price.totalPrice") + "\" value=\"" + (price || "") + "\" style=\"width:90px\" min=\"0\" step=\"0.01\">" +
          "<input type=\"number\" class=\"tool-input\" id=\"upQty" + idx + "\" placeholder=\"" + __("tool.unit-price.quantity") + "\" value=\"" + (qty || "") + "\" style=\"width:80px\" min=\"0\" step=\"0.1\">" +
          "<input type=\"text\" class=\"tool-input\" id=\"upUnit" + idx + "\" placeholder=\"" + __("tool.unit-price.unit") + "\" value=\"" + (unit || "oz") + "\" style=\"width:60px\">" +
          "<button class=\"btn btn-sm\" data-remove=\"" + idx + "\" style=\"color:var(--danger)\">" + __("tool.unit-price.remove") + "</button>";
        container.appendChild(div);
        div.querySelector("[data-remove]").addEventListener("click", function() { div.remove(); });
      }
      addBtn.addEventListener("click", function() { addItem(); });
      compareBtn.addEventListener("click", function() {
        var items = [];
        var inputs = container.querySelectorAll(".flex-row");
        inputs.forEach(function(div) {
          var name = div.querySelector("[id^=upName]").value || "Item";
          var price = parseFloat(div.querySelector("[id^=upPrice]").value) || 0;
          var qty = parseFloat(div.querySelector("[id^=upQty]").value) || 1;
          var unit = div.querySelector("[id^=upUnit]").value || "unit";
          if (price > 0 && qty > 0) {
            items.push({ name: name, price: price, qty: qty, unit: unit, unitPrice: price / qty });
          }
        });
        if (items.length === 0) { result.innerHTML = "<div style=\"color:var(--text-tertiary);text-align:center;padding:8px\">Add items to compare</div>"; return; }
        items.sort(function(a,b){ return a.unitPrice - b.unitPrice; });
        var min = items[0].unitPrice;
        var html = "<table style=\"width:100%;border-collapse:collapse\"><thead><tr style=\"background:var(--surface-secondary)\">" +
          "<th style=\"padding:6px 8px;text-align:left\">" + __("tool.unit-price.itemName") + "</th>" +
          "<th style=\"padding:6px 8px;text-align:right\">" + __("tool.unit-price.totalPrice") + "</th>" +
          "<th style=\"padding:6px 8px;text-align:right\">" + __("tool.unit-price.quantity") + "</th>" +
          "<th style=\"padding:6px 8px;text-align:right\">" + __("tool.unit-price.unitPrice") + "</th></tr></thead><tbody>";
        for (var i = 0; i < items.length; i++) {
          var isBest = items[i].unitPrice === min;
          html += "<tr style=\"" + (isBest ? "background:var(--success);color:white" : "") + "\">" +
            "<td style=\"padding:6px 8px\">" + items[i].name + (isBest ? " \u2b50" : "") + "</td>" +
            "<td style=\"padding:6px 8px;text-align:right\">$" + items[i].price.toFixed(2) + "</td>" +
            "<td style=\"padding:6px 8px;text-align:right\">" + items[i].qty + " " + items[i].unit + "</td>" +
            "<td style=\"padding:6px 8px;text-align:right;font-weight:600\">$" + items[i].unitPrice.toFixed(4) + "/" + items[i].unit + "</td></tr>";
        }
        html += "</tbody></table>";
        result.innerHTML = html;
      });
      // Add 3 default items
      addItem("Brand A", 5.99, 12, "oz");
      addItem("Brand B", 8.49, 16, "oz");
      addItem("Brand C", 12.99, 24, "oz");
    },
    destroy: function () {}
  };
})();