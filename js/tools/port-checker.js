(function () {
  var id = "port-checker";
  var title = "Port Checker";
  var icon = "\ud83d\udcde";
  var category = "Security";
  var description = "Check port compliance and security";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div>" +
        "<label>" + __('tool.' + id + '.input') + "</label>" +
        "<input type=\"text\" class=\"input\" id=\"" + id + "-input\" placeholder=\"80, 443, 3306, 22\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "<button class=\"btn btn-primary\" id=\"" + id + "-check\">" + __('tool.' + id + '.check') + "</button>" +
        "<button class=\"btn\" id=\"" + id + "-clear\">" + __('tool.' + id + '.clear') + "</button>" +
        "</div>" +
        "<div>" +
        "<label>" + __('tool.' + id + '.result') + "</label>" +
        "<pre class=\"code-output\" id=\"" + id + "-result\"></pre>" +
        "</div>" +
        "</div>";

      var input = box.querySelector("#" + id + "-input");
      var result = box.querySelector("#" + id + "-result");

      var wellKnownPorts = {
        21: { name: 'FTP', risk: 'high' },
        22: { name: 'SSH', risk: 'high' },
        23: { name: 'Telnet', risk: 'high' },
        25: { name: 'SMTP', risk: 'medium' },
        53: { name: 'DNS', risk: 'medium' },
        80: { name: 'HTTP', risk: 'low' },
        110: { name: 'POP3', risk: 'high' },
        143: { name: 'IMAP', risk: 'medium' },
        443: { name: 'HTTPS', risk: 'low' },
        3306: { name: 'MySQL', risk: 'high' },
        5432: { name: 'PostgreSQL', risk: 'high' },
        6379: { name: 'Redis', risk: 'high' },
        8080: { name: 'HTTP Alt', risk: 'low' },
        9200: { name: 'Elasticsearch', risk: 'high' },
        27017: { name: 'MongoDB', risk: 'high' }
      };

      box.querySelector("#" + id + "-check").addEventListener("click", function () {
        var ports = input.value.split(',').map(function (p) { return parseInt(p.trim()); }).filter(Boolean);
        var report = [];
        ports.forEach(function (port) {
          var info = wellKnownPorts[port] || { name: 'Unknown', risk: 'unknown' };
          var status = info.risk === 'high' ? '⚠️ 高危' : info.risk === 'medium' ? '⚠️ 中等' : '✓ 安全';
          report.push(port + ' (' + info.name + '): ' + status);
        });
        result.textContent = report.join('\n');
      });

      box.querySelector("#" + id + "-clear").addEventListener("click", function () {
        input.value = '';
        result.textContent = '';
      });

      return box;
    }
  };
})();