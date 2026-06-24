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
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("common.input") + "</label>" +
        "<textarea id=\"ccInput\" rows=\"4\" placeholder=\"" + __("tool.case-converter.placeholder") + "\"></textarea>" +
        "<div class=\"grid-2\">" +
        "  <button class=\"btn btn-secondary\" data-case=\"upper\">" + __("tool.case-converter.upper") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"lower\">" + __("tool.case-converter.lower") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"title\">" + __("tool.case-converter.titleCase") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"sentence\">" + __("tool.case-converter.sentenceCase") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"camel\">" + __("tool.case-converter.camelCase") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"pascal\">" + __("tool.case-converter.pascalCase") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"snake\">" + __("tool.case-converter.snakeCase") + "</button>" +
        "  <button class=\"btn btn-secondary\" data-case=\"kebab\">" + __("tool.case-converter.kebabCase") + "</button>" +
        "</div>" +
        "<label>" + __("common.result") + "</label>" +
        "<div class=\"output-box\" id=\"ccOutput\">" + __("common.result") + "</div>" +
        "<button class=\"btn btn-secondary\" id=\"ccCopyBtn\">" + __("common.copy") + "</button>" +
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
        if (output.textContent && output.textContent !== __("common.result")) copyToClipboard(output.textContent);
      });
    },
    destroy: function () {}
  };
})();
