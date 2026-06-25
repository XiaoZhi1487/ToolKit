// Tool :: Gitignore Generator
(function () {
  var id = "gitignore";
  var title = "Gitignore Generator";
  var icon = "\uD83D\uDCC4";
  var category = "Developer";
  var description = "Generate .gitignore content based on project type";

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
        "  <label>" + __('tool.' + id + '.select') + "</label>",
        "  <div style=\"margin:8px 0\">",
        "    <button class=\"btn btn-secondary\" id=\"giSelectAll\">" + __('tool.' + id + '.selectAll') + "</button>",
        "  </div>",
        "  <div id=\"giCheckboxes\" style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin-bottom:12px\"></div>",
        "  <button class=\"btn btn-primary\" id=\"giGenBtn\">" + __('tool.' + id + '.generate') + "</button>",
        "  <div style=\"margin-top:12px\">",
        "    <label>" + __('tool.' + id + '.output') + "</label>",
        "    <textarea id=\"giOutput\" rows=\"12\" readonly spellcheck=\"false\" style=\"width:100%;padding:8px;border:1px solid var(--border-color);border-radius:6px;background:var(--bg);color:var(--fg);font-family:var(--font-mono);font-size:0.75rem\"></textarea>",
        "  </div>",
        "  <button class=\"btn btn-secondary\" id=\"giCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var templates = {
        Node: "node_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n.env\n.env.local\n",
        Python: "__pycache__/\n*.py[cod]\n*.so\n.Python\nvenv/\nenv/\n*.egg-info/\n.eggs/\ndist/\nbuild/\n",
        Java: "*.class\n*.jar\n*.war\n*.nar\ntarget/\n!.mvn/wrapper/maven-wrapper.jar\n",
        macOS: ".DS_Store\n.AppleDouble\n.LSOverride\nIcon\r\n._*\n.Spotlight-V100\n.Trashes\n",
        Windows: "Thumbs.db\nehthumbs.db\nehthumbs_vista.db\n*.stackdump\n*.cab\n*.msi\n*.msm\n*.msp\n",
        Linux: "*~\n*.swp\n*.swo\n*.swn\n*.bak\n",
        VisualStudioCode: ".vscode/\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n",
        JetBrains: ".idea/\n*.iml\n*.iws\nout/\n.idea_modules/\n",
        Vue: "dist/\nnode_modules/\n*.js.map\n*.css.map\n",
        React: "build/\nnode_modules/\n*.js.map\n*.css.map\n",
        Angular: "dist/\nnode_modules/\n*.js.map\n*.css.map\n",
        Docker: ".dockerignore\nDockerfile\n",
        Go: "*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\nvendor/\n",
        Rust: "target/\n**/*.rs.bk\nCargo.lock\n",
        Ruby: "*.gem\n.bundle/\nGemfile.lock\nvendor/bundle/\n",
        PHP: "vendor/\ncomposer.lock\n.phpunit.result.cache\n"
      };

      var checkboxes = document.getElementById("giCheckboxes");
      var output = document.getElementById("giOutput");
      var genBtn = document.getElementById("giGenBtn");
      var copyBtn = document.getElementById("giCopyBtn");
      var selectAllBtn = document.getElementById("giSelectAll");

      var names = Object.keys(templates);
      var checkboxEls = {};

      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var label = document.createElement("label");
        label.style.cssText = "display:flex;align-items:center;gap:6px;font-size:0.8125rem;cursor:pointer;padding:4px 6px;border-radius:4px;background:var(--bg-secondary,transparent)";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = false;
        cb.style.cssText = "accent-color:var(--primary,#3b82f6)";
        label.appendChild(cb);
        label.appendChild(document.createTextNode(name));
        checkboxes.appendChild(label);
        checkboxEls[name] = cb;
      }

      function generate() {
        var selected = [];
        for (var name in checkboxEls) {
          if (checkboxEls[name].checked) {
            selected.push(templates[name]);
          }
        }
        if (selected.length === 0) {
          output.value = "# No templates selected";
          return;
        }
        output.value = selected.join("\n# --- separator ---\n");
      }

      genBtn.addEventListener("click", generate);

      copyBtn.addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
      });

      selectAllBtn.addEventListener("click", function () {
        var allChecked = true;
        for (var name in checkboxEls) {
          if (!checkboxEls[name].checked) {
            allChecked = false;
            break;
          }
        }
        var newState = !allChecked;
        for (var name in checkboxEls) {
          checkboxEls[name].checked = newState;
        }
        generate();
      });

      // Generate on checkbox change
      for (var name in checkboxEls) {
        checkboxEls[name].addEventListener("change", generate);
      }
    },
    destroy: function () {}
  };
})();