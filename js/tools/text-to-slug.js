// Tool :: Text to Slug
(function () {
  var id = "text-to-slug";
  var title = "Text to Slug";
  var icon = "\ud83d\udd17";
  var category = "Tools";
  var description = "Convert text to URL-friendly slug format";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.text-to-slug.input") + "</label>" +
        "<textarea id=\"tsInput\" rows=\"4\" placeholder=\"" + __("tool.text-to-slug.placeholder") + "\">Hello World! This is a Test.</textarea>" +
        "<button class=\"btn btn-primary\" id=\"tsConvertBtn\">" + __("tool.text-to-slug.convert") + "</button>" +
        "<label>" + __("tool.text-to-slug.output") + "</label>" +
        "<div class=\"output-box\" id=\"tsOutput\" style=\"word-break:break-all\">hello-world-this-is-a-test</div>" +
        "<button class=\"btn btn-secondary\" id=\"tsCopyBtn\">" + __("tool.text-to-slug.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("tsInput");
      var convertBtn = document.getElementById("tsConvertBtn");
      var output = document.getElementById("tsOutput");
      var copyBtn = document.getElementById("tsCopyBtn");
      function convert() {
        var text = input.value.trim().toLowerCase();
        var slug = text.replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
        output.textContent = slug || "-";
      }
      convertBtn.addEventListener("click", convert);
      input.addEventListener("input", convert);
      copyBtn.addEventListener("click", function() { if (output.textContent !== "-") copyToClipboard(output.textContent); });
      convert();
    },
    destroy: function () {}
  };
})();