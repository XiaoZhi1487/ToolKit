// Tool :: Text to ASCII Codes
(function () {
  var id = "text-to-ascii";
  var title = "Text to ASCII Codes";
  var icon = "\ud83d\udc68\u200d\ud83d\udcbb";
  var category = "Converter";
  var description = "View ASCII/Unicode code points for each character";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.text-to-ascii.input") + "</label>" +
        "<textarea id=\"taInput\" rows=\"4\" placeholder=\"Hello\">Hello</textarea>" +
        "<button class=\"btn btn-primary\" id=\"taConvertBtn\">" + __("common.convert") + "</button>" +
        "<div id=\"taTable\" style=\"font-family:var(--font-mono);font-size:0.8125rem\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"taCopyBtn\">" + __("tool.text-to-ascii.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("taInput");
      var convertBtn = document.getElementById("taConvertBtn");
      var table = document.getElementById("taTable");
      var copyBtn = document.getElementById("taCopyBtn");
      function convert() {
        var text = input.value;
        var html = "<table style=\"width:100%;border-collapse:collapse;margin-top:8px\">" +
          "<thead><tr style=\"background:var(--surface-secondary)\">" +
          "<th style=\"padding:4px 8px;text-align:left;font-size:0.75rem\">" + __("tool.text-to-ascii.char") + "</th>" +
          "<th style=\"padding:4px 8px;text-align:left;font-size:0.75rem\">" + __("tool.text-to-ascii.decimal") + "</th>" +
          "<th style=\"padding:4px 8px;text-align:left;font-size:0.75rem\">" + __("tool.text-to-ascii.hex") + "</th>" +
          "<th style=\"padding:4px 8px;text-align:left;font-size:0.75rem\">" + __("tool.text-to-ascii.binary") + "</th>" +
          "</tr></thead><tbody>";
        for (var i = 0; i < text.length; i++) {
          var code = text.charCodeAt(i);
          html += "<tr><td style=\"padding:4px 8px;border-bottom:1px solid var(--border)\">" + text[i] + "</td>" +
            "<td style=\"padding:4px 8px;border-bottom:1px solid var(--border)\">" + code + "</td>" +
            "<td style=\"padding:4px 8px;border-bottom:1px solid var(--border)\">" + code.toString(16).toUpperCase() + "</td>" +
            "<td style=\"padding:4px 8px;border-bottom:1px solid var(--border)\">" + code.toString(2).padStart(8,"0") + "</td></tr>";
        }
        html += "</tbody></table>";
        table.innerHTML = html;
        table._text = Array.from(text).map(function(c){return c+"\t"+c.charCodeAt(0)+"\t"+c.charCodeAt(0).toString(16).toUpperCase()+"\t"+c.charCodeAt(0).toString(2).padStart(8,"0");}).join("\n");
      }
      convertBtn.addEventListener("click", convert);
      copyBtn.addEventListener("click", function() { if (table._text) copyToClipboard(table._text); });
      convert();
    },
    destroy: function () {}
  };
})();