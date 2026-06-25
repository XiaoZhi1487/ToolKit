// Tool :: CSS Grid Generator
(function () {
  var id = "grid-generator";
  var title = "Grid Generator";
  var icon = "\ud83d\udcd0";
  var category = "Design";
  var description = "CSS Grid Generator with visual preview";
  window.toolMeta.push({ id, title, icon, category, description });

  function generateGridCSS(cols, rows, gap, colType, colVal, rowType, rowVal) {
    var css = '.grid-container {\n';
    css += '  display: grid;\n';
    css += '  grid-template-columns: ';
    for (var i = 0; i < cols; i++) {
      if (colType === 'auto') css += '1fr ';
      else if (colType === 'fixed') css += colVal + 'px ';
      else css += '1fr ';
    }
    css += ';\n';
    css += '  grid-template-rows: ';
    for (var i = 0; i < rows; i++) {
      if (rowType === 'auto') css += 'auto ';
      else if (rowType === 'fixed') css += rowVal + 'px ';
      else css += 'auto ';
    }
    css += ';\n';
    css += '  gap: ' + gap + 'px;\n';
    css += '}\n';
    return css;
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.grid-generator.columns") + "</label><input type=\"number\" id=\"ggCols\" value=\"3\" min=\"1\" max=\"12\" class=\"btn btn-secondary\"></div>" +
        "  <div><label>" + __("tool.grid-generator.rows") + "</label><input type=\"number\" id=\"ggRows\" value=\"3\" min=\"1\" max=\"12\" class=\"btn btn-secondary\"></div>" +
        "</div>" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.grid-generator.gap") + "</label><div class=\"flex-row\" style=\"gap:var(--spacing-sm);align-items:center\"><input type=\"number\" id=\"ggGap\" value=\"8\" min=\"0\" max=\"100\" class=\"btn btn-secondary\" style=\"width:80px\"><span>px</span></div></div>" +
        "  <div></div>" +
        "</div>" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.grid-generator.columns") + " " + __("tool.grid-generator.auto") + "</label>" +
        "    <select id=\"ggColType\" class=\"btn btn-secondary\" style=\"width:100%\">" +
        "      <option value=\"auto\">" + __("tool.grid-generator.fr") + "</option>" +
        "      <option value=\"fixed\">" + __("tool.grid-generator.fixed") + "</option>" +
        "    </select>" +
        "  </div>" +
        "  <div><label>" + __("tool.grid-generator.rows") + " " + __("tool.grid-generator.auto") + "</label>" +
        "    <select id=\"ggRowType\" class=\"btn btn-secondary\" style=\"width:100%\">" +
        "      <option value=\"auto\">" + __("tool.grid-generator.auto") + "</option>" +
        "      <option value=\"fixed\">" + __("tool.grid-generator.fixed") + "</option>" +
        "    </select>" +
        "  </div>" +
        "</div>" +
        "<div class=\"grid-2\" id=\"ggFixedRow\" style=\"display:none\">" +
        "  <div><label>" + __("tool.grid-generator.columns") + " " + __("tool.design-tokens.tokenValue") + "</label><input type=\"number\" id=\"ggColVal\" value=\"100\" min=\"10\" max=\"500\" class=\"btn btn-secondary\"></div>" +
        "  <div><label>" + __("tool.grid-generator.rows") + " " + __("tool.design-tokens.tokenValue") + "</label><input type=\"number\" id=\"ggRowVal\" value=\"80\" min=\"10\" max=\"500\" class=\"btn btn-secondary\"></div>" +
        "</div>" +
        "<label style=\"margin-top:var(--spacing-md);display:block\">" + __("tool.grid-generator.preview") + "</label>" +
        "<div id=\"ggPreview\" style=\"border:1px solid var(--bg-card-border);border-radius:var(--radius-md);padding:var(--spacing-sm);margin:var(--spacing-sm) 0;min-height:120px\"></div>" +
        "<label>" + __("tool.grid-generator.code") + "</label>" +
        "<div class=\"output-box\" id=\"ggOutput\" style=\"font-size:0.75rem;font-family:var(--font-mono)\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"ggCopyBtn\" style=\"margin-top:var(--spacing-sm)\">" + __("tool.grid-generator.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var cols = document.getElementById("ggCols");
      var rows = document.getElementById("ggRows");
      var gap = document.getElementById("ggGap");
      var colType = document.getElementById("ggColType");
      var rowType = document.getElementById("ggRowType");
      var colVal = document.getElementById("ggColVal");
      var rowVal = document.getElementById("ggRowVal");
      var preview = document.getElementById("ggPreview");
      var output = document.getElementById("ggOutput");
      var copyBtn = document.getElementById("ggCopyBtn");
      var fixedRow = document.getElementById("ggFixedRow");

      function update() {
        var c = parseInt(cols.value) || 3;
        var r = parseInt(rows.value) || 3;
        var g = parseInt(gap.value) || 8;
        var ct = colType.value;
        var rt = rowType.value;
        var cv = parseInt(colVal.value) || 100;
        var rv = parseInt(rowVal.value) || 80;

        if (ct === 'fixed' || rt === 'fixed') {
          fixedRow.style.display = "grid";
        } else {
          fixedRow.style.display = "none";
        }

        var css = generateGridCSS(c, r, g, ct, cv, rt, rv);
        output.textContent = css;

        preview.style.display = "grid";
        preview.style.gridTemplateColumns = ct === 'fixed' ? ("repeat(" + c + ", " + cv + "px)") : ("repeat(" + c + ", 1fr)");
        preview.style.gridTemplateRows = rt === 'fixed' ? ("repeat(" + r + ", " + rv + "px)") : ("repeat(" + r + ", auto)");
        preview.style.gap = g + "px";

        var colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#3b82f6','#ef4444','#84cc16','#14b8a6','#d946ef','#f97316'];
        var html = '';
        var total = c * r;
        for (var i = 0; i < total; i++) {
          var color = colors[i % colors.length];
          html += '<div style="background:' + color + ';border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:700;color:#ffffff;padding:8px;min-height:40px">' + (i + 1) + '</div>';
        }
        preview.innerHTML = html;
      }

      var inputs = [cols, rows, gap, colType, rowType, colVal, rowVal];
      inputs.forEach(function (el) {
        el.addEventListener("input", update);
        el.addEventListener("change", update);
      });

      copyBtn.addEventListener("click", function () {
        copyToClipboard(output.textContent);
      });
      update();
    },
    destroy: function () {}
  };
})();