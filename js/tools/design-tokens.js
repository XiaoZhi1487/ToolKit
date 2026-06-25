// Tool :: Design Tokens Generator
(function () {
  var id = "design-tokens";
  var title = "Design Tokens";
  var icon = "\ud83c\udf9b\ufe0f";
  var category = "Design";
  var description = "Generate CSS custom properties (design tokens)";
  window.toolMeta.push({ id, title, icon, category, description });

  var defaultColors = [
    { name: '--color-primary', value: '#6366f1' },
    { name: '--color-secondary', value: '#8b5cf6' },
    { name: '--color-accent', value: '#f59e0b' },
    { name: '--color-background', value: '#ffffff' },
    { name: '--color-text', value: '#1f2937' },
  ];

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"tab-bar\" id=\"dtTabs\">" +
        "  <button class=\"tab-btn active\" data-tab=\"colors\">" + __("tool.design-tokens.colors") + "</button>" +
        "  <button class=\"tab-btn\" data-tab=\"typography\">" + __("tool.design-tokens.typography") + "</button>" +
        "  <button class=\"tab-btn\" data-tab=\"spacing\">" + __("tool.design-tokens.spacing") + "</button>" +
        "  <button class=\"tab-btn\" data-tab=\"shadows\">" + __("tool.design-tokens.shadows") + "</button>" +
        "</div>" +
        "<div id=\"dtTabColors\" class=\"dt-tab-content\">" +
        "  <div id=\"dtColorRows\"></div>" +
        "  <button class=\"btn btn-secondary\" id=\"dtAddColor\" style=\"margin-top:var(--spacing-sm)\">" + __("tool.design-tokens.addColor") + "</button>" +
        "</div>" +
        "<div id=\"dtTabTypography\" class=\"dt-tab-content\" style=\"display:none\">" +
        "  <div class=\"grid-2\">" +
        "    <div><label>" + __("tool.design-tokens.tokenName") + "</label><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-heading\" readonly style=\"text-align:left\"></div>" +
        "    <div><label>" + __("tool.design-tokens.tokenValue") + "</label><input class=\"dt-typo-val\" value=\"'Inter', sans-serif\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><label>" + __("tool.design-tokens.tokenName") + "</label><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-body\" readonly style=\"text-align:left\"></div>" +
        "    <div><label>" + __("tool.design-tokens.tokenValue") + "</label><input class=\"dt-typo-val\" value=\"'System UI', sans-serif\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><label>" + __("tool.design-tokens.tokenName") + "</label><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-code\" readonly style=\"text-align:left\"></div>" +
        "    <div><label>" + __("tool.design-tokens.tokenValue") + "</label><input class=\"dt-typo-val\" value=\"'Fira Code', monospace\"></div>" +
        "  </div>" +
        "  <label style=\"margin-top:var(--spacing-sm);display:block\">" + __("tool.design-tokens.tokenName") + " - Font Size Scale</label>" +
        "  <div class=\"grid-2\">" +
        "    <div><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-size-xs\" readonly style=\"text-align:left\"></div>" +
        "    <div><input class=\"dt-typo-val\" value=\"0.75rem\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-size-sm\" readonly style=\"text-align:left\"></div>" +
        "    <div><input class=\"dt-typo-val\" value=\"0.875rem\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-size-base\" readonly style=\"text-align:left\"></div>" +
        "    <div><input class=\"dt-typo-val\" value=\"1rem\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-size-lg\" readonly style=\"text-align:left\"></div>" +
        "    <div><input class=\"dt-typo-val\" value=\"1.125rem\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-size-xl\" readonly style=\"text-align:left\"></div>" +
        "    <div><input class=\"dt-typo-val\" value=\"1.25rem\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-size-2xl\" readonly style=\"text-align:left\"></div>" +
        "    <div><input class=\"dt-typo-val\" value=\"1.5rem\"></div>" +
        "  </div>" +
        "  <div class=\"grid-2\">" +
        "    <div><input class=\"btn btn-secondary dt-typo-name\" value=\"--font-size-3xl\" readonly style=\"text-align:left\"></div>" +
        "    <div><input class=\"dt-typo-val\" value=\"1.875rem\"></div>" +
        "  </div>" +
        "</div>" +
        "<div id=\"dtTabSpacing\" class=\"dt-tab-content\" style=\"display:none\">" +
        "  <label>" + __("tool.design-tokens.tokenName") + " - Base Unit</label>" +
        "  <div class=\"flex-row\" style=\"gap:var(--spacing-sm);align-items:center\">" +
        "    <input type=\"number\" id=\"dtSpacingBase\" value=\"4\" min=\"1\" max=\"16\" style=\"width:80px\" class=\"btn btn-secondary\">" +
        "    <span>px</span>" +
        "  </div>" +
        "  <div id=\"dtSpacingScale\" style=\"margin-top:var(--spacing-sm)\"></div>" +
        "</div>" +
        "<div id=\"dtTabShadows\" class=\"dt-tab-content\" style=\"display:none\">" +
        "  <div id=\"dtShadowRows\"></div>" +
        "  <button class=\"btn btn-secondary\" id=\"dtAddShadow\" style=\"margin-top:var(--spacing-sm)\">" + __("tool.design-tokens.addToken") + "</button>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"dtGenerateBtn\" style=\"margin-top:var(--spacing-md)\">" + __("tool.design-tokens.generate") + "</button>" +
        "<div class=\"output-box\" id=\"dtOutput\" style=\"margin-top:var(--spacing-sm);font-size:0.75rem;font-family:var(--font-mono);white-space:pre-wrap;display:none\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"dtCopyBtn\" style=\"display:none;margin-top:var(--spacing-sm)\">" + __("tool.design-tokens.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var colorContainer = document.getElementById("dtColorRows");
      var shadowContainer = document.getElementById("dtShadowRows");
      var output = document.getElementById("dtOutput");
      var copyBtn = document.getElementById("dtCopyBtn");
      var generateBtn = document.getElementById("dtGenerateBtn");

      function addColorRow(name, value) {
        var row = document.createElement("div");
        row.className = "flex-row";
        row.style.cssText = "gap:var(--spacing-sm);margin-bottom:var(--spacing-xs);align-items:center";
        row.innerHTML = "<input type=\"text\" class=\"dt-color-name btn btn-secondary\" value=\"" + name + "\" placeholder=\"--name\" style=\"flex:1;text-align:left;font-family:var(--font-mono);font-size:0.8125rem\">" +
          "<input type=\"color\" class=\"dt-color-val\" value=\"" + value + "\" style=\"width:40px;height:32px;padding:2px;cursor:pointer\">" +
          "<button class=\"btn btn-secondary dt-color-remove\" style=\"padding:2px 8px;font-size:0.75rem\">\u2716</button>";
        colorContainer.appendChild(row);
        row.querySelector(".dt-color-remove").addEventListener("click", function () { row.remove(); });
      }

      function addShadowRow() {
        var row = document.createElement("div");
        row.className = "flex-row";
        row.style.cssText = "gap:var(--spacing-sm);margin-bottom:var(--spacing-xs);align-items:center;flex-wrap:wrap";
        row.innerHTML = "<input type=\"text\" class=\"dt-shadow-name btn btn-secondary\" value=\"--shadow-sm\" placeholder=\"--name\" style=\"flex:1;min-width:120px;text-align:left;font-family:var(--font-mono);font-size:0.8125rem\">" +
          "<input type=\"text\" class=\"dt-shadow-val\" value=\"0 1px 3px rgba(0,0,0,0.12)\" placeholder=\"shadow value\" style=\"flex:2;min-width:180px\">" +
          "<div class=\"dt-shadow-preview\" style=\"width:40px;height:32px;border-radius:4px;background:var(--bg-card);box-shadow:0 1px 3px rgba(0,0,0,0.12)\"></div>" +
          "<button class=\"btn btn-secondary dt-shadow-remove\" style=\"padding:2px 8px;font-size:0.75rem\">\u2716</button>";
        shadowContainer.appendChild(row);
        var valInput = row.querySelector(".dt-shadow-val");
        var preview = row.querySelector(".dt-shadow-preview");
        valInput.addEventListener("input", function () {
          preview.style.boxShadow = valInput.value || "none";
        });
        row.querySelector(".dt-shadow-remove").addEventListener("click", function () { row.remove(); });
      }

      defaultColors.forEach(function (c) { addColorRow(c.name, c.value); });

      document.getElementById("dtAddColor").addEventListener("click", function () {
        addColorRow("--color-new", "#cccccc");
      });

      document.getElementById("dtAddShadow").addEventListener("click", addShadowRow);

      addShadowRow();

      var tabs = document.querySelectorAll("#dtTabs .tab-btn");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (t) { t.classList.remove("active"); });
          tab.classList.add("active");
          var contents = document.querySelectorAll(".dt-tab-content");
          contents.forEach(function (c) { c.style.display = "none"; });
          var target = document.getElementById("dtTab" + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
          if (target) target.style.display = "block";
        });
      });

      var spacingBase = document.getElementById("dtSpacingBase");
      var spacingScale = document.getElementById("dtSpacingScale");

      function updateSpacingScale() {
        var base = parseInt(spacingBase.value) || 4;
        var steps = [
          { name: '--space-xs', mult: 1 },
          { name: '--space-sm', mult: 2 },
          { name: '--space-md', mult: 3 },
          { name: '--space-lg', mult: 4 },
          { name: '--space-xl', mult: 6 },
          { name: '--space-2xl', mult: 8 },
          { name: '--space-3xl', mult: 12 },
          { name: '--space-4xl', mult: 16 },
        ];
        spacingScale.innerHTML = steps.map(function (s) {
          var val = base * s.mult;
          return "<div class=\"flex-row\" style=\"gap:var(--spacing-sm);align-items:center;margin-bottom:var(--spacing-xs)\">" +
            "<input class=\"btn btn-secondary\" value=\"" + s.name + "\" readonly style=\"flex:1;text-align:left;font-family:var(--font-mono);font-size:0.8125rem\">" +
            "<span style=\"min-width:60px;font-family:var(--font-mono);font-size:0.8125rem\">" + val + "px</span>" +
            "<div style=\"background:var(--color-primary);height:8px;width:" + Math.min(val, 200) + "px;border-radius:4px;opacity:0.6\"></div>" +
          "</div>";
        }).join("");
      }

      spacingBase.addEventListener("input", updateSpacingScale);
      updateSpacingScale();

      generateBtn.addEventListener("click", function () {
        var css = ":root {\n";
        var colorNames = document.querySelectorAll(".dt-color-name");
        var colorVals = document.querySelectorAll(".dt-color-val");
        for (var i = 0; i < colorNames.length; i++) {
          css += "  " + colorNames[i].value + ": " + colorVals[i].value + ";\n";
        }
        var typoNames = document.querySelectorAll(".dt-typo-name");
        var typoVals = document.querySelectorAll(".dt-typo-val");
        for (var i = 0; i < typoNames.length; i++) {
          css += "  " + typoNames[i].value + ": " + typoVals[i].value + ";\n";
        }
        var spacingRows = spacingScale.querySelectorAll(".flex-row");
        spacingRows.forEach(function (row) {
          var nameInput = row.querySelector(".btn-secondary");
          var valSpan = row.querySelector("span");
          if (nameInput && valSpan) {
            css += "  " + nameInput.value + ": " + valSpan.textContent + ";\n";
          }
        });
        var shadowNames = document.querySelectorAll(".dt-shadow-name");
        var shadowVals = document.querySelectorAll(".dt-shadow-val");
        for (var i = 0; i < shadowNames.length; i++) {
          css += "  " + shadowNames[i].value + ": " + shadowVals[i].value + ";\n";
        }
        css += "}";
        output.textContent = css;
        output.style.display = "block";
        copyBtn.style.display = "inline-block";
      });

      copyBtn.addEventListener("click", function () {
        copyToClipboard(output.textContent);
      });
    },
    destroy: function () {}
  };
})();