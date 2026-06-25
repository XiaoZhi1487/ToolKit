// Tool :: User-Agent Parser
(function () {
  var id = "ua-parser";
  var title = "UA Parser";
  var icon = "\uD83C\uDF10";
  var category = "Developer";
  var description = "Parse User-Agent strings to identify browser and OS";

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
        "  <textarea id=\"uaInput\" rows=\"4\" spellcheck=\"false\" style=\"width:100%;padding:8px;border:1px solid var(--border-color);border-radius:6px;background:var(--bg);color:var(--fg);font-family:var(--font-mono);font-size:0.8125rem\"></textarea>",
        "  <button class=\"btn btn-primary\" id=\"uaParseBtn\" style=\"margin:8px 0\">" + __('tool.' + id + '.parse') + "</button>",
        "  <div id=\"uaResult\"></div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("uaInput");
      var parseBtn = document.getElementById("uaParseBtn");
      var result = document.getElementById("uaResult");

      input.placeholder = __('tool.' + id + '.placeholder');

      function parseUA(ua) {
        var result = { browser: 'Unknown', engine: 'Unknown', os: 'Unknown', device: 'Desktop' };

        // Browser detection
        if (/Edg\//i.test(ua)) result.browser = 'Microsoft Edge';
        else if (/Chrome\//i.test(ua)) result.browser = 'Google Chrome';
        else if (/Firefox\//i.test(ua)) result.browser = 'Mozilla Firefox';
        else if (/Safari\//i.test(ua)) result.browser = 'Apple Safari';
        else if (/MSIE|Trident/i.test(ua)) result.browser = 'Internet Explorer';
        else if (/Opera|OPR\//i.test(ua)) result.browser = 'Opera';

        // Engine detection
        if (/WebKit\//i.test(ua)) result.engine = 'WebKit';
        else if (/Gecko\//i.test(ua)) result.engine = 'Gecko';
        else if (/Trident\//i.test(ua)) result.engine = 'Trident';
        else if (/Blink\//i.test(ua)) result.engine = 'Blink';

        // OS detection
        if (/Windows NT/i.test(ua)) result.os = 'Windows';
        else if (/Mac OS X/i.test(ua)) result.os = 'macOS';
        else if (/Linux/i.test(ua) && !/Android/i.test(ua)) result.os = 'Linux';
        else if (/Android/i.test(ua)) result.os = 'Android';
        else if (/iOS|iPhone|iPad|iPod/i.test(ua)) result.os = 'iOS';

        // Device detection
        if (/Mobile/i.test(ua)) result.device = 'Mobile';
        else if (/Tablet|iPad/i.test(ua)) result.device = 'Tablet';

        return result;
      }

      function parse() {
        var ua = input.value.trim();
        if (!ua) {
          result.innerHTML = "<div style=\"color:var(--red);font-size:0.875rem\">" + __('tool.' + id + '.placeholder') + "</div>";
          return;
        }
        var data = parseUA(ua);
        var keys = ['browser', 'engine', 'os', 'device'];
        var labels = [
          __('tool.' + id + '.browser'),
          __('tool.' + id + '.engine'),
          __('tool.' + id + '.os'),
          __('tool.' + id + '.device')
        ];
        var html = "<table style=\"width:100%;border-collapse:collapse;font-size:0.875rem\">";
        for (var i = 0; i < keys.length; i++) {
          html += "<tr" + (i % 2 === 0 ? " style=\"background:var(--bg-secondary,transparent)\"" : "") + ">";
          html += "  <td style=\"padding:8px 12px;font-weight:600;width:120px\">" + labels[i] + "</td>";
          html += "  <td style=\"padding:8px 12px\">" + data[keys[i]] + "</td>";
          html += "</tr>";
        }
        html += "</table>";
        result.innerHTML = html;
      }

      parseBtn.addEventListener("click", parse);

      // Default to current UA
      input.value = navigator.userAgent;
      parse();
    },
    destroy: function () {}
  };
})();