// Tool :: Type Scale Generator
(function () {
  var id = "type-scale";
  var title = "Type Scale Generator";
  var icon = "\ud83d\udcdd";
  var category = "Design";
  var description = "Generate modular typography scale systems";
  window.toolMeta.push({ id, title, icon, category, description });

  var steps = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
  var names = {
    '-2': 'caption', '-1': 'small', '0': 'body', '1': 'h6', '2': 'h5',
    '3': 'h4', '4': 'h3', '5': 'h2', '6': 'h1'
  };

  var ratios = {
    '1.067': 'Minor Second',
    '1.125': 'Major Second',
    '1.200': 'Minor Third',
    '1.250': 'Major Third',
    '1.333': 'Perfect Fourth',
    '1.414': 'Augmented Fourth',
    '1.500': 'Perfect Fifth',
    '1.618': 'Golden Ratio'
  };

  function generateScale(base, ratio) {
    var scale = [];
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i];
      var size = base * Math.pow(ratio, s);
      scale.push({
        step: s,
        name: names[String(s)],
        px: size.toFixed(2),
        rem: (size / base).toFixed(4),
        lineHeight: (s > 0) ? '1.2' : '1.5'
      });
    }
    return scale;
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      var ratioOpts = "";
      for (var r in ratios) {
        if (ratios.hasOwnProperty(r)) {
          ratioOpts += "<option value=\"" + r + "\">" + ratios[r] + " (" + r + ")</option>";
        }
      }
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"display:flex;align-items:center;gap:16px;margin-bottom:16px\">" +
        "  <div style=\"flex:1\"><label>" + __('tool.' + id + '.baseSize') + "</label><input type=\"number\" id=\"tsBase\" value=\"16\" min=\"8\" max=\"72\" style=\"width:100%\"></div>" +
        "  <div style=\"flex:2\"><label>" + __('tool.' + id + '.ratio') + "</label><select id=\"tsRatio\" style=\"width:100%\">" + ratioOpts + "</select></div>" +
        "</div>" +
        "<label>" + __('tool.' + id + '.scale') + "</label>" +
        "<div style=\"overflow-x:auto\"><table id=\"tsTable\" style=\"width:100%;border-collapse:collapse;font-size:0.8125rem;margin-top:8px\">" +
        "  <thead><tr style=\"border-bottom:2px solid var(--bg-card-border)\">" +
        "    <th style=\"padding:6px 8px;text-align:left\">Step</th>" +
        "    <th style=\"padding:6px 8px;text-align:left\">Name</th>" +
        "    <th style=\"padding:6px 8px;text-align:right\">px</th>" +
        "    <th style=\"padding:6px 8px;text-align:right\">rem</th>" +
        "    <th style=\"padding:6px 8px;text-align:right\">" + __('tool.' + id + '.lineHeight') + "</th>" +
        "    <th style=\"padding:6px 8px;text-align:left\">Sample</th>" +
        "  </tr></thead>" +
        "  <tbody id=\"tsBody\"></tbody>" +
        "</table></div>" +
        "<label style=\"margin-top:16px;display:block\">CSS Custom Properties</label>" +
        "<div class=\"output-box\"><textarea id=\"tsCss\" readonly style=\"width:100%;min-height:120px;border:none;background:transparent;resize:vertical;font-family:var(--font-mono);font-size:0.75rem\"></textarea></div>" +
        "<button class=\"btn btn-secondary\" id=\"tsCopy\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var baseInput = document.getElementById("tsBase");
      var ratioSelect = document.getElementById("tsRatio");
      var tbody = document.getElementById("tsBody");
      var cssEl = document.getElementById("tsCss");
      var copyBtn = document.getElementById("tsCopy");

      function render() {
        var base = parseFloat(baseInput.value) || 16;
        var ratio = parseFloat(ratioSelect.value) || 1.333;
        var scale = generateScale(base, ratio);

        var rows = "";
        for (var i = 0; i < scale.length; i++) {
          var item = scale[i];
          var fontSize = item.px + "px";
          rows += "<tr style=\"border-bottom:1px solid var(--bg-card-border)\">" +
            "<td style=\"padding:8px;text-align:left\">" + item.step + "</td>" +
            "<td style=\"padding:8px;text-align:left\">" + item.name + "</td>" +
            "<td style=\"padding:8px;text-align:right;font-family:var(--font-mono)\">" + item.px + "</td>" +
            "<td style=\"padding:8px;text-align:right;font-family:var(--font-mono)\">" + item.rem + "</td>" +
            "<td style=\"padding:8px;text-align:right\">" + item.lineHeight + "</td>" +
            "<td style=\"padding:8px;text-align:left;font-size:" + fontSize + ";line-height:" + item.lineHeight + "\">The quick brown fox</td>" +
            "</tr>";
        }
        tbody.innerHTML = rows;

        var css = ":root {\n";
        for (var j = 0; j < scale.length; j++) {
          var s = scale[j];
          css += "  --text-" + s.name + ": " + s.rem + "rem;\n";
        }
        css += "}";
        cssEl.value = css;
      }

      baseInput.addEventListener("input", render);
      ratioSelect.addEventListener("change", render);
      copyBtn.addEventListener("click", function () { copyToClipboard(cssEl.value); });

      render();
    },
    destroy: function () {}
  };
})();