// Tool :: CSS Gradient Generator
(function () {
  var id = "css-gradient";
  var title = "CSS Gradient Generator";
  var icon = "\ud83c\udfa8";
  var category = "Tools";
  var description = "Generate CSS gradient backgrounds visually";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.css-gradient.direction") + "</label>" +
        "<select id=\"cgDirection\">" +
        "  <option value=\"to bottom\">" + __("tool.css-gradient.topToBottom") + "</option>" +
        "  <option value=\"to right\">" + __("tool.css-gradient.leftToRight") + "</option>" +
        "  <option value=\"to bottom right\">" + __("tool.css-gradient.diagonal") + "</option>" +
        "  <option value=\"radial\">" + __("tool.css-gradient.radial") + "</option>" +
        "</select>" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.css-gradient.color1") + "</label><input type=\"color\" id=\"cgColor1\" value=\"#6366f1\"></div>" +
        "  <div><label>" + __("tool.css-gradient.color2") + "</label><input type=\"color\" id=\"cgColor2\" value=\"#ec4899\"></div>" +
        "</div>" +
        "<div id=\"cgPreview\" style=\"height:150px;border-radius:var(--radius-md);border:1px solid var(--bg-card-border);background:linear-gradient(to right,#6366f1,#ec4899)\"></div>" +
        "<div class=\"output-box\" id=\"cgOutput\" style=\"font-size:0.75rem;font-family:var(--font-mono);word-break:break-all\">background: linear-gradient(to right, #6366f1, #ec4899);</div>" +
        "<button class=\"btn btn-secondary\" id=\"cgCopyBtn\">" + __("tool.css-gradient.copyCss") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var dir = document.getElementById("cgDirection");
      var c1 = document.getElementById("cgColor1");
      var c2 = document.getElementById("cgColor2");
      var preview = document.getElementById("cgPreview");
      var output = document.getElementById("cgOutput");
      var copyBtn = document.getElementById("cgCopyBtn");
      function update() {
        var d = dir.value;
        var gradient = d === "radial" ? "radial-gradient(circle, " + c1.value + ", " + c2.value + ")" : "linear-gradient(" + d + ", " + c1.value + ", " + c2.value + ")";
        preview.style.background = gradient;
        output.textContent = "background: " + gradient + ";";
      }
      dir.addEventListener("change", update);
      c1.addEventListener("input", update);
      c2.addEventListener("input", update);
      copyBtn.addEventListener("click", function() { copyToClipboard(output.textContent); });
      update();
    },
    destroy: function () {}
  };
})();