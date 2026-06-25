// Tool :: WCAG Color Contrast Checker
(function () {
  var id = "color-contrast";
  var title = "Color Contrast Checker";
  var icon = "\uD83D\uDC41\uFE0F";
  var category = "Developer";
  var description = "Check WCAG contrast ratio between two colors";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\">",
        "  <span class=\"tool-header-icon\">" + icon + "</span>",
        "  <h2>" + __('tool.' + id + '.title') + "</h2>",
        "</div>",
        "<div class=\"tool-content\">",
        "  <div class=\"grid-2\">",
        "    <div>",
        "      <label>" + __('tool.' + id + '.foreground') + "</label>",
        "      <input type=\"color\" id=\"ccFg\" value=\"#333333\" style=\"display:block;width:100%;height:48px;border:none;cursor:pointer\">",
        "    </div>",
        "    <div>",
        "      <label>" + __('tool.' + id + '.background') + "</label>",
        "      <input type=\"color\" id=\"ccBg\" value=\"#FFFFFF\" style=\"display:block;width:100%;height:48px;border:none;cursor:pointer\">",
        "    </div>",
        "  </div>",
        "  <div style=\"margin:16px 0;padding:24px;border-radius:8px;border:1px solid var(--border-color);text-align:center;font-size:1.25rem\" id=\"ccSample\">",
        "    The quick brown fox jumps over the lazy dog.",
        "  </div>",
        "  <div class=\"output-box\" id=\"ccResult\"></div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var fgInput = document.getElementById("ccFg");
      var bgInput = document.getElementById("ccBg");
      var sample = document.getElementById("ccSample");
      var result = document.getElementById("ccResult");

      function hexToRgb(hex) {
        hex = hex.replace("#", "");
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      }

      function linearize(c) {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      }

      function relativeLuminance(r, g, b) {
        return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
      }

      function contrastRatio(l1, l2) {
        var lighter = Math.max(l1, l2);
        var darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      function update() {
        var fgHex = fgInput.value;
        var bgHex = bgInput.value;

        var fgRgb = hexToRgb(fgHex);
        var bgRgb = hexToRgb(bgHex);

        var fgL = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
        var bgL = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        var ratio = contrastRatio(fgL, bgL);

        sample.style.color = fgHex;
        sample.style.backgroundColor = bgHex;

        var aaNormal = ratio >= 4.5;
        var aaLarge = ratio >= 3.0;
        var aaaNormal = ratio >= 7.0;
        var aaaLarge = ratio >= 4.5;

        var pass = __('tool.' + id + '.pass');
        var fail = __('tool.' + id + '.fail');

        result.innerHTML = [
          "<div style=\"text-align:center;font-size:2rem;font-weight:700;margin-bottom:12px\">" + ratio.toFixed(2) + ":1</div>",
          "<div style=\"font-size:0.875rem;margin-bottom:8px\">" + __('tool.' + id + '.ratio') + "</div>",
          "<table style=\"width:100%;border-collapse:collapse;font-size:0.875rem\">",
          "  <tr>",
          "    <td style=\"padding:6px 8px\">" + __('tool.' + id + '.aaNormal') + "</td>",
          "    <td style=\"padding:6px 8px;text-align:right\"><span style=\"padding:2px 8px;border-radius:4px;font-weight:600;color:#fff;background:" + (aaNormal ? "var(--green,#22c55e)" : "var(--red,#ef4444)") + "\">" + (aaNormal ? pass : fail) + "</span></td>",
          "  </tr>",
          "  <tr>",
          "    <td style=\"padding:6px 8px\">" + __('tool.' + id + '.aaLarge') + "</td>",
          "    <td style=\"padding:6px 8px;text-align:right\"><span style=\"padding:2px 8px;border-radius:4px;font-weight:600;color:#fff;background:" + (aaLarge ? "var(--green,#22c55e)" : "var(--red,#ef4444)") + "\">" + (aaLarge ? pass : fail) + "</span></td>",
          "  </tr>",
          "  <tr>",
          "    <td style=\"padding:6px 8px\">" + __('tool.' + id + '.aaaNormal') + "</td>",
          "    <td style=\"padding:6px 8px;text-align:right\"><span style=\"padding:2px 8px;border-radius:4px;font-weight:600;color:#fff;background:" + (aaaNormal ? "var(--green,#22c55e)" : "var(--red,#ef4444)") + "\">" + (aaaNormal ? pass : fail) + "</span></td>",
          "  </tr>",
          "  <tr>",
          "    <td style=\"padding:6px 8px\">" + __('tool.' + id + '.aaaLarge') + "</td>",
          "    <td style=\"padding:6px 8px;text-align:right\"><span style=\"padding:2px 8px;border-radius:4px;font-weight:600;color:#fff;background:" + (aaaLarge ? "var(--green,#22c55e)" : "var(--red,#ef4444)") + "\">" + (aaaLarge ? pass : fail) + "</span></td>",
          "  </tr>",
          "</table>"
        ].join("");
      }

      fgInput.addEventListener("input", update);
      bgInput.addEventListener("input", update);
      update();
    },
    destroy: function () {}
  };
})();