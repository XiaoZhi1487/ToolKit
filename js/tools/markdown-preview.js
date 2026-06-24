// Tool :: Markdown Preview
(function () {
  var id = "markdown-preview";
  var title = "Markdown Preview";
  var icon = "\ud83d\udcdd";
  var category = "Text";
  var description = "Real-time Markdown editor with HTML preview";
  window.toolMeta.push({ id, title, icon, category, description });
  function mdToHtml(text) {
    var html = text
      .replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>").replace(/^---$/gm, "<hr>")
      .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
      .replace(/^[-*] (.+)$/gm, "<li>$1</li>").replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");
    html = html.replace(/(<li>.*?<\/li>(?:<br>)?)+/g, function(m) {
      var items = m.replace(/<br>/g, "\n").split("\n").filter(function(l) { return l.trim(); });
      return "<ul>" + items.join("") + "</ul>";
    });
    return "<p>" + html + "</p>";
  }
  var DEFAULT_MD = "# Hello Markdown\n\n## Live Preview\n\nThis is a **Markdown** editor with *HTML preview*.\n\n### Features\n\n- Headings (H1 ~ H3)\n- **Bold** and *Italic*\n- `Inline code`\n- [Links](https://example.com)\n- Lists\n\n> Blockquote support\n\n```\nCode blocks work too\n```\n\n---\n\nEdit the left panel, see changes in real time.";
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function() {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = '<div class="tool-header"><span class="tool-header-icon">' + icon + '</span><h2>' + __('tool.' + id + '.title') + '</h2></div>' +
        '<div class="tool-content">' +
        '<div class="grid-2" style="min-height:400px">' +
        '<div style="display:flex;flex-direction:column">' +
        '<label>' + __("tool.markdown-preview.markdown") + '</label>' +
        '<textarea id="mdInput" rows="16" style="flex:1;resize:none;font-family:var(--font-mono);font-size:0.8125rem">' + DEFAULT_MD + '</textarea>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column">' +
        '<label>' + __("tool.markdown-preview.preview") + '</label>' +
        '<div class="output-box markdown-output" id="mdPreview" style="flex:1;overflow-y:auto;min-height:300px"></div>' +
        '</div>' +
        '</div>' +
        '<div class="btn-group">' +
        '<button class="btn btn-secondary" id="mdCopyHtmlBtn">' + __("tool.markdown-preview.copyHtml") + '</button>' +
        '<button class="btn btn-secondary" id="mdClearBtn">' + __("common.clear") + '</button>' +
        '</div>' +
        '</div>';
      return box;
    },
    init: function() {
      var input = document.getElementById("mdInput");
      var preview = document.getElementById("mdPreview");
      var copyBtn = document.getElementById("mdCopyHtmlBtn");
      var clearBtn = document.getElementById("mdClearBtn");
      var update = function() { preview.innerHTML = mdToHtml(input.value); };
      input.addEventListener("input", update);
      copyBtn.addEventListener("click", function() { copyToClipboard(preview.innerHTML); });
      clearBtn.addEventListener("click", function() { input.value = ""; update(); });
      update();
    },
    destroy: function() {}
  };
})();
