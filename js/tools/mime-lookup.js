// Tool :: MIME Type Lookup
(function () {
  var id = "mime-lookup";
  var title = "MIME Type Lookup";
  var icon = "\ud83d\udccb";
  var category = "Developer";
  var description = "Look up MIME types by file extension";
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
        "  <input type=\"text\" id=\"mimeSearch\" placeholder=\"" + __('tool.' + id + '.search') + "\" style=\"width:100%;margin-bottom:12px;box-sizing:border-box\">",
        "  <div class=\"output-box\" id=\"mimeTableWrap\" style=\"max-height:400px;overflow:auto;padding:0\">",
        "    <table id=\"mimeTable\" style=\"width:100%;border-collapse:collapse;font-size:0.8125rem\">",
        "      <thead style=\"position:sticky;top:0;background:var(--bg-card);z-index:1\">",
        "        <tr>",
        "          <th style=\"padding:8px 12px;text-align:left;border-bottom:1px solid var(--bg-input-border)\">" + __('tool.' + id + '.extension') + "</th>",
        "          <th style=\"padding:8px 12px;text-align:left;border-bottom:1px solid var(--bg-input-border)\">" + __('tool.' + id + '.mimeType') + "</th>",
        "          <th style=\"padding:8px 12px;text-align:left;border-bottom:1px solid var(--bg-input-border)\">" + __('tool.' + id + '.type') + "</th>",
        "        </tr>",
        "      </thead>",
        "      <tbody id=\"mimeBody\"></tbody>",
        "    </table>",
        "  </div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var mimeTypes = [
        { ext: '.html', mime: 'text/html', cat: 'Web' },
        { ext: '.css', mime: 'text/css', cat: 'Web' },
        { ext: '.js', mime: 'application/javascript', cat: 'Web' },
        { ext: '.json', mime: 'application/json', cat: 'Data' },
        { ext: '.xml', mime: 'application/xml', cat: 'Data' },
        { ext: '.csv', mime: 'text/csv', cat: 'Data' },
        { ext: '.txt', mime: 'text/plain', cat: 'Text' },
        { ext: '.md', mime: 'text/markdown', cat: 'Text' },
        { ext: '.png', mime: 'image/png', cat: 'Image' },
        { ext: '.jpg', mime: 'image/jpeg', cat: 'Image' },
        { ext: '.jpeg', mime: 'image/jpeg', cat: 'Image' },
        { ext: '.gif', mime: 'image/gif', cat: 'Image' },
        { ext: '.svg', mime: 'image/svg+xml', cat: 'Image' },
        { ext: '.ico', mime: 'image/x-icon', cat: 'Image' },
        { ext: '.webp', mime: 'image/webp', cat: 'Image' },
        { ext: '.bmp', mime: 'image/bmp', cat: 'Image' },
        { ext: '.avif', mime: 'image/avif', cat: 'Image' },
        { ext: '.mp3', mime: 'audio/mpeg', cat: 'Audio' },
        { ext: '.wav', mime: 'audio/wav', cat: 'Audio' },
        { ext: '.ogg', mime: 'audio/ogg', cat: 'Audio' },
        { ext: '.mp4', mime: 'video/mp4', cat: 'Video' },
        { ext: '.webm', mime: 'video/webm', cat: 'Video' },
        { ext: '.avi', mime: 'video/x-msvideo', cat: 'Video' },
        { ext: '.pdf', mime: 'application/pdf', cat: 'Document' },
        { ext: '.doc', mime: 'application/msword', cat: 'Document' },
        { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', cat: 'Document' },
        { ext: '.xls', mime: 'application/vnd.ms-excel', cat: 'Document' },
        { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', cat: 'Document' },
        { ext: '.ppt', mime: 'application/vnd.ms-powerpoint', cat: 'Document' },
        { ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', cat: 'Document' },
        { ext: '.zip', mime: 'application/zip', cat: 'Archive' },
        { ext: '.rar', mime: 'application/vnd.rar', cat: 'Archive' },
        { ext: '.tar', mime: 'application/x-tar', cat: 'Archive' },
        { ext: '.gz', mime: 'application/gzip', cat: 'Archive' },
        { ext: '.7z', mime: 'application/x-7z-compressed', cat: 'Archive' },
        { ext: '.woff', mime: 'font/woff', cat: 'Font' },
        { ext: '.woff2', mime: 'font/woff2', cat: 'Font' },
        { ext: '.ttf', mime: 'font/ttf', cat: 'Font' },
        { ext: '.otf', mime: 'font/otf', cat: 'Font' },
        { ext: '.eot', mime: 'application/vnd.ms-fontobject', cat: 'Font' },
        { ext: '.wasm', mime: 'application/wasm', cat: 'Code' },
        { ext: '.map', mime: 'application/json', cat: 'Code' },
      ];

      var searchInput = document.getElementById("mimeSearch");
      var tbody = document.getElementById("mimeBody");

      function renderTable(filter) {
        var html = "";
        for (var i = 0; i < mimeTypes.length; i++) {
          var item = mimeTypes[i];
          if (filter) {
            var q = filter.toLowerCase();
            if (item.ext.toLowerCase().indexOf(q) === -1 && item.mime.toLowerCase().indexOf(q) === -1) {
              continue;
            }
          }
          var bg = i % 2 === 0 ? "background:var(--bg-card)" : "background:var(--bg-input)";
          html += "<tr style=\"" + bg + "\">" +
            "<td style=\"padding:6px 12px;font-family:var(--font-mono);font-size:0.75rem\">" + item.ext + "</td>" +
            "<td style=\"padding:6px 12px;font-family:var(--font-mono);font-size:0.75rem;word-break:break-all\">" + item.mime + "</td>" +
            "<td style=\"padding:6px 12px\">" + item.cat + "</td>" +
            "</tr>";
        }
        if (!html) {
          html = "<tr><td colspan=\"3\" style=\"padding:20px;text-align:center;color:var(--text-tertiary)\">" + __('common.noMatches') + "</td></tr>";
        }
        tbody.innerHTML = html;
      }

      searchInput.addEventListener("input", function () {
        renderTable(this.value);
      });

      renderTable("");
    },
    destroy: function () {}
  };
})();