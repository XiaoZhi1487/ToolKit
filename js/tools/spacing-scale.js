// Tool :: Spacing Scale Generator
(function () {
  var id = "spacing-scale";
  var title = "Spacing Scale Generator";
  var icon = "\ud83d\udccf";
  var category = "Design";
  var description = "Generate consistent spacing scale systems";
  window.toolMeta.push({ id, title, icon, category, description });

  var names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

  function generateScale(base, max, unit) {
    var result = [];
    for (var i = 0; i < Math.min(max, names.length); i++) {
      var val = base * Math.pow(2, i);
      result.push({
        name: names[i],
        value: val + unit,
        cssVar: '--space-' + names[i]
      });
    }
    return result;
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"display:flex;align-items:center;gap:16px;margin-bottom:16px\">" +
        "  <div style=\"flex:1\"><label>" + __('tool.' + id + '.baseUnit') + "</label><input type=\"number\" id=\"ssBase\" value=\"4\" min=\"1\" max=\"32\" style=\"width:100%\"></div>" +
        "  <div style=\"flex:1\"><label>" + __('tool.' + id + '.maxSteps') + "</label><input type=\"number\" id=\"ssMax\" value=\"8\" min=\"1\" max=\"10\" style=\"width:100%\"></div>" +
        "  <div style=\"flex:1\"><label>Unit</label><select id=\"ssUnit\" style=\"width:100%\">" +
        "    <option value=\"px\">" + __('tool.' + id + '.px') + "</option>" +
        "    <option value=\"rem\">" + __('tool.' + id + '.rem') + "</option>" +
        "  </select></div>" +
        "</div>" +
        "<label>" + __('tool.' + id + '.scale') + "</label>" +
        "<div style=\"overflow-x:auto\"><table id=\"ssTable\" style=\"width:100%;border-collapse:collapse;font-size:0.8125rem;margin-top:8px\">" +
        "  <thead><tr style=\"border-bottom:2px solid var(--bg-card-border)\">" +
        "    <th style=\"padding:6px 8px;text-align:left\">Name</th>" +
        "    <th style=\"padding:6px 8px;text-align:right\">Value</th>" +
        "    <th style=\"padding:6px 8px;text-align:left\">CSS Variable</th>" +
        "    <th style=\"padding:6px 8px;text-align:left\">Visual</th>" +
        "  </tr></thead>" +
        "  <tbody id=\"ssBody\"></tbody>" +
        "</table></div>" +
        "<label style=\"margin-top:16px;display:block\">CSS Custom Properties</label>" +
        "<div class=\"output-box\"><textarea id=\"ssCss\" readonly style=\"width:100%;min-height:100px;border:none;background:transparent;resize:vertical;font-family:var(--font-mono);font-size:0.75rem\"></textarea></div>" +
        "<button class=\"btn btn-secondary\" id=\"ssCopy\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var baseInput = document.getElementById("ssBase");
      var maxInput = document.getElementById("ssMax");
      var unitSelect = document.getElementById("ssUnit");
      var tbody = document.getElementById("ssBody");
      var cssEl = document.getElementById("ssCss");
      var copyBtn = document.getElementById("ssCopy");

      function render() {
        var base = parseFloat(baseInput.value) || 4;
        var max = parseInt(maxInput.value, 10) || 8;
        var unit = unitSelect.value || "px";
        var scale = generateScale(base, max, unit);

        var maxVal = 0;
        for (var i = 0; i < scale.length; i++) {
          var numVal = parseFloat(scale[i].value);
          if (numVal > maxVal) maxVal = numVal;
        }

        var rows = "";
        for (var j = 0; j < scale.length; j++) {
          var item = scale[j];
          var numVal = parseFloat(item.value);
          var pct = maxVal > 0 ? (numVal / maxVal) * 100 : 0;
          rows += "<tr style=\"border-bottom:1px solid var(--bg-card-border)\">" +
            "<td style=\"padding:8px;text-align:left;font-family:var(--font-mono)\">" + item.name + "</td>" +
            "<td style=\"padding:8px;text-align:right;font-family:var(--font-mono)\">" + item.value + "</td>" +
            "<td style=\"padding:8px;text-align:left;font-family:var(--font-mono);color:var(--text-muted)\">" + item.cssVar + "</td>" +
            "<td style=\"padding:8px;text-align:left\"><div style=\"height:12px;width:" + pct + "%;max-width:200px;background:#6366f1;border-radius:4px;min-width:4px\"></div></td>" +
            "</tr>";
        }
        tbody.innerHTML = rows;

        var css = ":root {\n";
        for (var k = 0; k < scale.length; k++) {
          css += "  " + scale[k].cssVar + ": " + scale[k].value + ";\n";
        }
        css += "}";
        cssEl.value = css;
      }

      baseInput.addEventListener("input", render);
      maxInput.addEventListener("input", render);
      unitSelect.addEventListener("change", render);
      copyBtn.addEventListener("click", function () { copyToClipboard(cssEl.value); });

      render();
    },
    destroy: function () {}
  };
})();