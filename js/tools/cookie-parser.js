// Tool :: Cookie String Parser
(function () {
  var id = "cookie-parser";
  var title = "Cookie Parser";
  var icon = "\ud83c\udf6a";
  var category = "Developer";
  var description = "Parse cookie strings and inspect field details";
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
        "  <label>" + __('tool.' + id + '.input') + "</label>",
        "  <textarea id=\"cookieInput\" rows=\"4\" placeholder=\"" + __('tool.' + id + '.placeholder') + "\" spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"cookieParseBtn\">" + __('tool.' + id + '.parse') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"cookieClearBtn\">" + __('common.clear') + "</button>",
        "  </div>",
        "  <div id=\"cookieCount\" style=\"font-size:0.8125rem;color:var(--text-tertiary);margin-bottom:8px\"></div>",
        "  <div id=\"cookieResults\"></div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("cookieInput");
      var parseBtn = document.getElementById("cookieParseBtn");
      var clearBtn = document.getElementById("cookieClearBtn");
      var results = document.getElementById("cookieResults");
      var countEl = document.getElementById("cookieCount");

      function parseCookies(str) {
        var cookies = [];
        var pairs = str.split(';');
        for (var i = 0; i < pairs.length; i++) {
          var parts = pairs[i].split('=');
          var name = parts[0].trim();
          var value = parts.slice(1).join('=').trim();
          if (name) cookies.push({ name: name, value: value });
        }
        return cookies;
      }

      function doParse() {
        var text = input.value.trim();
        if (!text) return;
        var cookies = parseCookies(text);
        countEl.textContent = __('tool.' + id + '.name') + ": " + cookies.length;
        var html = "";
        for (var i = 0; i < cookies.length; i++) {
          var c = cookies[i];
          html += "<div class=\"output-box\" style=\"margin-bottom:8px;padding:8px 12px\">" +
            "<div><strong>" + __('tool.' + id + '.name') + ":</strong> " + $esc(c.name) + "</div>" +
            "<div style=\"word-break:break-all;margin-top:4px;font-family:var(--font-mono);font-size:0.75rem;color:var(--text-secondary)\"><strong>" + __('tool.' + id + '.value') + ":</strong> " + $esc(c.value) + "</div>" +
            "</div>";
        }
        results.innerHTML = html;
      }

      clearBtn.addEventListener("click", function () {
        input.value = "";
        results.innerHTML = "";
        countEl.textContent = "";
      });

      parseBtn.addEventListener("click", doParse);

      // Simple HTML escape helper
      function $esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
    },
    destroy: function () {}
  };
})();