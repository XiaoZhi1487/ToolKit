// Tool :: HTTP Status Code Lookup
(function () {
  var id = "http-status";
  var title = "HTTP Status Codes";
  var icon = "\ud83d\udce1";
  var category = "Developer";
  var description = "Look up HTTP status code meanings and descriptions";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<input type=\"text\" id=\"httpSearchInput\" class=\"form-input\" placeholder=\"" + __('tool.' + id + '.search') + "\" style=\"margin-bottom:12px\" />" +
        "<div style=\"overflow-x:auto\">" +
        "  <table class=\"status-table\" style=\"width:100%;border-collapse:collapse;font-size:0.8125rem\">" +
        "    <thead>" +
        "      <tr style=\"background:var(--bg-card-hover)\">" +
        "        <th style=\"padding:8px 12px;text-align:left;border-bottom:2px solid var(--bg-input-border)\">" + __('tool.' + id + '.code') + "</th>" +
        "        <th style=\"padding:8px 12px;text-align:left;border-bottom:2px solid var(--bg-input-border)\">" + __('tool.' + id + '.titleLabel') + "</th>" +
        "        <th style=\"padding:8px 12px;text-align:left;border-bottom:2px solid var(--bg-input-border)\">" + __('tool.' + id + '.description') + "</th>" +
        "        <th style=\"padding:8px 12px;text-align:left;border-bottom:2px solid var(--bg-input-border)\">" + __('tool.' + id + '.category') + "</th>" +
        "      </tr>" +
        "    </thead>" +
        "    <tbody id=\"httpTableBody\">" +
        "    </tbody>" +
        "  </table>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var searchInput = document.getElementById("httpSearchInput");
      var tbody = document.getElementById("httpTableBody");

      var statuses = [
        { code: 100, title: "Continue", desc: "Server has received request headers", cat: "1xx" },
        { code: 101, title: "Switching Protocols", desc: "Server is switching protocols", cat: "1xx" },
        { code: 200, title: "OK", desc: "Request succeeded", cat: "2xx" },
        { code: 201, title: "Created", desc: "Resource created successfully", cat: "2xx" },
        { code: 204, title: "No Content", desc: "Request succeeded but no content returned", cat: "2xx" },
        { code: 301, title: "Moved Permanently", desc: "Resource permanently moved", cat: "3xx" },
        { code: 302, title: "Found", desc: "Resource temporarily moved", cat: "3xx" },
        { code: 304, title: "Not Modified", desc: "Cached version is still valid", cat: "3xx" },
        { code: 400, title: "Bad Request", desc: "Server cannot process the request", cat: "4xx" },
        { code: 401, title: "Unauthorized", desc: "Authentication is required", cat: "4xx" },
        { code: 403, title: "Forbidden", desc: "Server refuses to authorize the request", cat: "4xx" },
        { code: 404, title: "Not Found", desc: "Resource does not exist", cat: "4xx" },
        { code: 405, title: "Method Not Allowed", desc: "HTTP method not supported", cat: "4xx" },
        { code: 408, title: "Request Timeout", desc: "Server timed out waiting for request", cat: "4xx" },
        { code: 429, title: "Too Many Requests", desc: "Rate limit exceeded", cat: "4xx" },
        { code: 500, title: "Internal Server Error", desc: "Server encountered an unexpected condition", cat: "5xx" },
        { code: 502, title: "Bad Gateway", desc: "Invalid response from upstream server", cat: "5xx" },
        { code: 503, title: "Service Unavailable", desc: "Server temporarily unavailable", cat: "5xx" },
        { code: 504, title: "Gateway Timeout", desc: "Upstream server timed out", cat: "5xx" },
      ];

      function renderTable(filter) {
        var html = "";
        for (var i = 0; i < statuses.length; i++) {
          var s = statuses[i];
          if (filter) {
            var q = filter.toLowerCase();
            var codeMatch = String(s.code).indexOf(q) !== -1;
            var titleMatch = s.title.toLowerCase().indexOf(q) !== -1;
            var descMatch = s.desc.toLowerCase().indexOf(q) !== -1;
            var catMatch = s.cat.toLowerCase().indexOf(q) !== -1;
            if (!codeMatch && !titleMatch && !descMatch && !catMatch) continue;
          }
          var bg = i % 2 === 0 ? "" : " style=\"background:var(--bg-card-hover)\"";
          html += "<tr" + bg + ">" +
            "<td style=\"padding:6px 12px;font-weight:600;font-family:var(--font-mono)\">" + s.code + "</td>" +
            "<td style=\"padding:6px 12px\">" + s.title + "</td>" +
            "<td style=\"padding:6px 12px;color:var(--text-tertiary)\">" + s.desc + "</td>" +
            "<td style=\"padding:6px 12px\"><span style=\"background:var(--bg-input-border);padding:2px 8px;border-radius:4px;font-size:0.75rem\">" + s.cat + "</span></td>" +
            "</tr>";
        }
        tbody.innerHTML = html;

        if (!html) {
          tbody.innerHTML = "<tr><td colspan=\"4\" style=\"padding:20px;text-align:center;color:var(--text-tertiary)\">" + __('common.noMatches') + "</td></tr>";
        }
      }

      searchInput.addEventListener("input", function () {
        renderTable(searchInput.value);
      });

      renderTable("");
    },
    destroy: function () {}
  };
})();