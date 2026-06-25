// Tool :: XML ↔ JSON Converter
(function () {
  var id = "xml-json";
  var title = "XML ↔ JSON";
  var icon = "\uD83D\uDD00";
  var category = "Developer";
  var description = "Convert between XML and JSON formats";

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
        "  <div class=\"tab-bar\" id=\"xjTabBar\">",
        "    <button class=\"tab-btn active\" data-mode=\"xml2json\">" + __('tool.' + id + '.tabXml2Json') + "</button>",
        "    <button class=\"tab-btn\" data-mode=\"json2xml\">" + __('tool.' + id + '.tabJson2Xml') + "</button>",
        "  </div>",
        "  <textarea id=\"xjInput\" rows=\"8\" spellcheck=\"false\" style=\"width:100%;padding:8px;border:1px solid var(--border-color);border-radius:6px;background:var(--bg);color:var(--fg);font-family:var(--font-mono);font-size:0.75rem\"></textarea>",
        "  <div class=\"btn-group\" style=\"margin:8px 0\">",
        "    <button class=\"btn btn-primary\" id=\"xjConvertBtn\">" + __('tool.' + id + '.convert') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"xjCopyBtn\">" + __('tool.' + id + '.copy') + "</button>",
        "  </div>",
        "  <label>" + __('tool.' + id + '.output') + "</label>",
        "  <textarea id=\"xjOutput\" rows=\"8\" readonly spellcheck=\"false\" style=\"width:100%;padding:8px;border:1px solid var(--border-color);border-radius:6px;background:var(--bg);color:var(--fg);font-family:var(--font-mono);font-size:0.75rem\"></textarea>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("xjInput");
      var output = document.getElementById("xjOutput");
      var convertBtn = document.getElementById("xjConvertBtn");
      var copyBtn = document.getElementById("xjCopyBtn");
      var tabBar = document.getElementById("xjTabBar");
      var mode = "xml2json";

      input.placeholder = "<root><item id=\"1\">Hello</item></root>";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.mode;
        input.value = "";
        output.value = "";
      });

      function xmlToJson(xml) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, 'text/xml');
        var parseError = doc.querySelector("parsererror");
        if (parseError) throw new Error(parseError.textContent);
        var result = {};
        function parseNode(node) {
          var obj = {};
          if (node.attributes) {
            for (var i = 0; i < node.attributes.length; i++) {
              obj['@' + node.attributes[i].name] = node.attributes[i].value;
            }
          }
          if (node.children.length > 0) {
            for (var i = 0; i < node.children.length; i++) {
              var child = node.children[i];
              var childObj = parseNode(child);
              if (obj[child.tagName]) {
                if (!Array.isArray(obj[child.tagName])) obj[child.tagName] = [obj[child.tagName]];
                obj[child.tagName].push(childObj);
              } else {
                obj[child.tagName] = childObj;
              }
            }
          } else if (node.textContent.trim()) {
            return node.textContent.trim();
          }
          return obj;
        }
        result[doc.documentElement.tagName] = parseNode(doc.documentElement);
        return JSON.stringify(result, null, 2);
      }

      function jsonToXml(json) {
        var obj;
        try {
          obj = typeof json === 'string' ? JSON.parse(json) : json;
        } catch (e) {
          throw new Error("Invalid JSON: " + e.message);
        }
        function convert(obj, name) {
          var xml = '<' + name;
          if (typeof obj !== 'object' || obj === null) {
            xml += '>' + (obj === null ? '' : String(obj)) + '</' + name + '>';
            return xml;
          }
          // Check for attributes
          var attrs = "";
          var hasAttrs = false;
          for (var key in obj) {
            if (key.startsWith('@')) {
              attrs += ' ' + key.substring(1) + '="' + String(obj[key]) + '"';
              hasAttrs = true;
            }
          }
          xml += attrs;
          xml += '>';
          for (var key in obj) {
            if (key.startsWith('@')) continue;
            if (Array.isArray(obj[key])) {
              for (var i = 0; i < obj[key].length; i++) {
                xml += convert(obj[key][i], key);
              }
            } else {
              xml += convert(obj[key], key);
            }
          }
          xml += '</' + name + '>';
          return xml;
        }
        // Get root key
        var rootKey = Object.keys(obj)[0] || 'root';
        return convert(obj[rootKey], rootKey);
      }

      function convert() {
        try {
          if (mode === "xml2json") {
            output.value = xmlToJson(input.value);
          } else {
            output.value = jsonToXml(input.value);
          }
        } catch (e) {
          output.value = __('tool.' + id + '.error') + "\n" + e.message;
        }
      }

      convertBtn.addEventListener("click", convert);
      copyBtn.addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
      });
    },
    destroy: function () {}
  };
})();