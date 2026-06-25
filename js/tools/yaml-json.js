// Tool :: YAML ↔ JSON Converter
(function () {
  var id = "yaml-json";
  var title = "YAML ↔ JSON";
  var icon = "\ud83d\udd04";
  var category = "Developer";
  var description = "Convert between YAML and JSON formats";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"tab-bar\" id=\"yjTabBar\">" +
        "  <button class=\"tab-btn active\" data-mode=\"yaml2json\">" + __('tool.' + id + '.tabYaml2Json') + "</button>" +
        "  <button class=\"tab-btn\" data-mode=\"json2yaml\">" + __('tool.' + id + '.tabJson2Yaml') + "</button>" +
        "</div>" +
        "<label for=\"yjInput\">" + __('tool.' + id + '.input') + "</label>" +
        "<textarea id=\"yjInput\" rows=\"8\" spellcheck=\"false\"></textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"yjConvertBtn\">" + __('tool.' + id + '.convert') + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"yjCopyBtn\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<textarea id=\"yjOutput\" rows=\"8\" readonly style=\"font-family:var(--font-mono);font-size:0.75rem\"></textarea>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("yjInput");
      var output = document.getElementById("yjOutput");
      var convertBtn = document.getElementById("yjConvertBtn");
      var copyBtn = document.getElementById("yjCopyBtn");
      var tabBar = document.getElementById("yjTabBar");
      var mode = "yaml2json";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.mode;
        input.placeholder = mode === "yaml2json" ? "key: value\nnested:\n  key2: value2" : '{"key": "value"}';
        output.value = "";
      });

      function yamlToJson(yaml) {
        var lines = yaml.split("\n");
        var root = {};
        var stack = [{ indent: -1, obj: root, key: null }];

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          var trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;

          var indent = line.length - line.replace(/^\s+/, "").length;

          // Remove trailing whitespace
          trimmed = trimmed.replace(/\s+$/, "");

          // Pop stack until we find a parent with smaller indent
          while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
          }

          var parent = stack[stack.length - 1];

          // Check if it's an array item
          if (trimmed.startsWith("- ")) {
            var val = trimmed.substring(2);
            if (!Array.isArray(parent.obj)) {
              parent.obj = [];
              if (parent.parent) {
                parent.parent[parent.key] = parent.obj;
              }
            }
            var parsed = parseYamlValue(val);
            parent.obj.push(parsed);
            // If the value is an object, push it onto the stack for nesting
            if (typeof parsed === "object" && parsed !== null) {
              stack.push({ indent: indent, obj: parsed, parent: parent.obj, key: parent.obj.length - 1 });
            }
          } else {
            // key: value or key:
            var colonIdx = trimmed.indexOf(":");
            if (colonIdx === -1) continue;
            var key = trimmed.substring(0, colonIdx).trim();
            var val = trimmed.substring(colonIdx + 1).trim();

            if (val === "" || val === "|" || val === ">") {
              // It's a nested object or complex value
              if (!parent.obj || Array.isArray(parent.obj)) {
                // Need to create object
                if (!parent.obj) {
                  parent.obj = {};
                  if (parent.parent) {
                    parent.parent[parent.key] = parent.obj;
                  }
                }
              }
              parent.obj[key] = {};
              stack.push({ indent: indent, obj: parent.obj[key], parent: parent.obj, key: key });
            } else {
              var pv = parseYamlValue(val);
              if (Array.isArray(parent.obj)) {
                // If parent is array, this shouldn't happen at top level
                // But handle it: create an object in the array
              }
              parent.obj[key] = pv;
            }
          }
        }

        return root;
      }

      function parseYamlValue(val) {
        if (val === "null" || val === "~") return null;
        if (val === "true" || val === "True" || val === "TRUE") return true;
        if (val === "false" || val === "False" || val === "FALSE") return false;
        // Try number
        if (/^-?\d+(\.\d+)?$/.test(val)) {
          return parseFloat(val);
        }
        // Try JSON parse for complex values
        try {
          return JSON.parse(val);
        } catch (e) {
          // Remove surrounding quotes if present
          if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
            return val.substring(1, val.length - 1);
          }
          return val;
        }
      }

      function jsonToYaml(obj, indent) {
        if (indent === undefined) indent = 0;
        var prefix = indent > 0 ? " ".repeat(indent) : "";
        var result = "";

        if (obj === null || obj === undefined) {
          return "null";
        }

        if (typeof obj === "string") {
          // Check if the string needs quotes
          if (/[:\[\]{}#,|>]/.test(obj) || obj === "" || obj === "null" || obj === "true" || obj === "false" || /^-?\d+(\.\d+)?$/.test(obj)) {
            return "\"" + obj.replace(/"/g, "\\\"") + "\"";
          }
          return obj;
        }

        if (typeof obj === "number" || typeof obj === "boolean") {
          return String(obj);
        }

        if (Array.isArray(obj)) {
          if (obj.length === 0) return "[]";
          for (var i = 0; i < obj.length; i++) {
            if (typeof obj[i] === "object" && obj[i] !== null) {
              result += prefix + "- " + jsonToYaml(obj[i], indent + 2).trimStart();
            } else {
              result += prefix + "- " + jsonToYaml(obj[i], indent) + "\n";
            }
          }
          return result;
        }

        if (typeof obj === "object") {
          var keys = Object.keys(obj);
          if (keys.length === 0) return "{}";
          for (var j = 0; j < keys.length; j++) {
            var k = keys[j];
            var v = obj[k];
            if (typeof v === "object" && v !== null && !Array.isArray(v)) {
              result += prefix + k + ":\n" + jsonToYaml(v, indent + 2);
            } else if (Array.isArray(v)) {
              if (v.length === 0) {
                result += prefix + k + ": []\n";
              } else {
                result += prefix + k + ":\n";
                for (var a = 0; a < v.length; a++) {
                  if (typeof v[a] === "object" && v[a] !== null) {
                    result += prefix + "  - " + jsonToYaml(v[a], indent + 4).trimStart();
                  } else {
                    result += prefix + "  - " + jsonToYaml(v[a], indent + 2) + "\n";
                  }
                }
              }
            } else {
              result += prefix + k + ": " + jsonToYaml(v, indent) + "\n";
            }
          }
          return result;
        }

        return String(obj);
      }

      function convert() {
        try {
          if (mode === "yaml2json") {
            var parsed = yamlToJson(input.value);
            output.value = JSON.stringify(parsed, null, 2);
          } else {
            var json = JSON.parse(input.value);
            output.value = jsonToYaml(json).replace(/\n$/, "");
          }
        } catch (e) {
          output.value = "❌ " + __('tool.' + id + '.error') + ": " + e.message;
        }
      }

      convertBtn.addEventListener("click", convert);
      copyBtn.addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
      });
      input.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") convert();
      });
    },
    destroy: function () {}
  };
})();