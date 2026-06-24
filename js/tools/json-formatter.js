// Tool :: JSON Formatter
(function () {
  var id = "json-formatter";
  var title = "JSON Formatter";
  var icon = "{ }";
  var category = "Developer";
  var description = "Format, compress, and validate JSON data";

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
        "  <div class=\"tab-bar\" id=\"jsonTabBar\">",
        "    <button class=\"tab-btn active\" data-tab=\"format\">" + __('tool.' + id + '.tabFormat') + "</button>",
        "    <button class=\"tab-btn\" data-tab=\"compress\">" + __('tool.' + id + '.tabCompress') + "</button>",
        "  </div>",
        "  <textarea id=\"jsonInput\" rows=\"8\" placeholder='{\"name\": \"ToolKit\", \"version\": 1}' spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"jsonRunBtn\">" + __('common.execute') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"jsonClearBtn\">" + __('common.clear') + "</button>",
        "  </div>",
        "  <div id=\"jsonError\" style=\"font-size:0.8125rem;color:var(--red);min-height:20px\"></div>",
        "  <div class=\"output-box\" id=\"jsonOutput\" style=\"white-space:pre;overflow:auto;max-height:400px\">" + __('tool.' + id + '.waiting') + "</div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("jsonInput");
      var output = document.getElementById("jsonOutput");
      var error = document.getElementById("jsonError");
      var runBtn = document.getElementById("jsonRunBtn");
      var clearBtn = document.getElementById("jsonClearBtn");
      var tabBar = document.getElementById("jsonTabBar");
      var mode = "format";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.tab;
      });

      function run() {
        error.textContent = "";
        try {
          var parsed = JSON.parse(input.value);
          if (mode === "format") {
            output.textContent = JSON.stringify(parsed, null, 2);
          } else {
            output.textContent = JSON.stringify(parsed);
          }
        } catch (e) {
          error.textContent = "❌ " + e.message;
          output.textContent = input.value;
        }
      }

      runBtn.addEventListener("click", run);
      clearBtn.addEventListener("click", function () {
        input.value = "";
        output.textContent = __('tool.' + id + '.waiting');
        error.textContent = "";
      });
      input.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
      });
      run();
    },
    destroy: function () {}
  };
})();