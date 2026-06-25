// Tool :: SVG Optimizer
(function () {
  var id = "svg-optimizer";
  var title = "SVG Optimizer";
  var icon = "\u2702\ufe0f";
  var category = "Design";
  var description = "Clean and optimize SVG code";
  window.toolMeta.push({ id, title, icon, category, description });

  var defaultSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <!-- Icon: star -->\n  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>\n</svg>';

  function optimizeSVG(svg) {
    var result = svg;
    result = result.replace(/<\?xml[^>]*\?>/g, '');
    result = result.replace(/<!--[\s\S]*?-->/g, '');
    result = result.replace(/<!DOCTYPE[^>]*>/gi, '');
    result = result.replace(/\s+(id|class|style|data-[^=]+)="[^"]*"/g, '');
    result = result.replace(/ xmlns="[^"]*"/g, '');
    result = result.replace(/>\s+</g, '><');
    result = result.replace(/\s{2,}/g, ' ');
    result = result.replace(/\s*=\s*/g, '=');
    result = result.replace(/\s+\/>/g, '/>');
    result = result.trim();
    return result;
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.svg-optimizer.input") + "</label>" +
        "<textarea id=\"svgInput\" rows=\"8\" class=\"btn btn-secondary\" style=\"width:100%;font-family:var(--font-mono);font-size:0.75rem;resize:vertical\">" + defaultSvg + "</textarea>" +
        "<div class=\"flex-row\" style=\"gap:var(--spacing-sm);margin:var(--spacing-sm) 0;align-items:center\">" +
        "  <button class=\"btn btn-primary\" id=\"svgOptimizeBtn\">" + __("tool.svg-optimizer.optimize") + "</button>" +
        "  <span id=\"svgStats\" style=\"font-size:0.75rem;color:var(--text-secondary)\"></span>" +
        "</div>" +
        "<label>" + __("tool.svg-optimizer.output") + "</label>" +
        "<textarea id=\"svgOutput\" rows=\"8\" class=\"btn btn-secondary\" style=\"width:100%;font-family:var(--font-mono);font-size:0.75rem;resize:vertical\" readonly></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"svgCopyBtn\" style=\"margin-top:var(--spacing-sm)\">" + __("tool.svg-optimizer.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("svgInput");
      var output = document.getElementById("svgOutput");
      var optimizeBtn = document.getElementById("svgOptimizeBtn");
      var copyBtn = document.getElementById("svgCopyBtn");
      var stats = document.getElementById("svgStats");

      function optimize() {
        var original = input.value;
        var optimized = optimizeSVG(original);
        output.value = optimized;
        var origSize = new Blob([original]).size;
        var optSize = new Blob([optimized]).size;
        var saved = origSize - optSize;
        var pct = origSize > 0 ? ((saved / origSize) * 100).toFixed(1) : 0;
        stats.textContent = origSize + "B \u2192 " + optSize + "B (" + __("tool.svg-optimizer.saved") + " " + saved + "B, " + pct + "%)";
      }

      optimizeBtn.addEventListener("click", optimize);
      copyBtn.addEventListener("click", function () {
        copyToClipboard(output.value);
      });
      optimize();
    },
    destroy: function () {}
  };
})();