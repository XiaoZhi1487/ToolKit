// Tool :: Case Converter
(function () {
  var id = "case-converter";
  var title = "Case Converter";
  var icon = "\ud83d\udd24";
  var category = "Text";
  var description = "Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>Input text</label>" +
        "<textarea id=\"ccInput\" rows=\"4\" placeholder=\"Type or paste text here...\"></textarea>" +
        "<div class=\"grid-2\">" +
        "  <button class=\"btn btn-secondary\" data-case=\"upper\">UPPERCASE</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"lower\">lowercase</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"title\">Title Case</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"sentence\">Sentence case</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"camel\">camelCase</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"pascal\">PascalCase</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"snake\">snake_case</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"kebab\">kebab-case</button>" +
        "</div>" +
        "<label>Result</label>" +
        "<div class=\"output-box\" id=\"ccOutput\">Result</div>" +
        "<button class=\"btn btn-secondary\" id=\"ccCopyBtn\">Copy</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("ccInput");
      var output = document.getElementById("ccOutput");
      var copyBtn = document.getElementById("ccCopyBtn");

      var converters = {
        upper: function (s) { return s.toUpperCase(); },
        lower: function (s) { return s.toLowerCase(); },
        title: function (s) { return s.replace(/\w\S*/g, function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); },
        sentence: function (s) { return s.toLowerCase().replace(/^(\s*\w)/, function (m) { return m.toUpperCase(); }); },
        camel: function (s) { return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (_, c) { return c.toUpperCase(); }); },
        pascal: function (s) { return s.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, function (_, c) { return c.toUpperCase(); }); },
        snake: function (s) { return s.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_"); },
        kebab: function (s) { return s.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-"); }
      };

      document.querySelectorAll("[data-case]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var fn = converters[btn.dataset.case];
          if (fn) output.textContent = fn(input.value);
        });
      });

      copyBtn.addEventListener("click", function () {
        if (output.textContent && output.textContent !== "Result") copyToClipboard(output.textContent);
      });
    },
    destroy: function () {}
  };
})();
