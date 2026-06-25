// Tool :: SQL Formatter
(function () {
  var id = "sql-formatter";
  var title = "SQL Formatter";
  var icon = "\ud83d\uddc3\ufe0f";
  var category = "Developer";
  var description = "Format SQL queries with multiple styles";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label for=\"sqlInput\">" + __('tool.' + id + '.input') + "</label>" +
        "<textarea id=\"sqlInput\" rows=\"8\" placeholder=\"" + __('tool.' + id + '.placeholder') + "\" spellcheck=\"false\"></textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"sqlFormatBtn\">" + __('tool.' + id + '.format') + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"sqlCopyBtn\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>" +
        "<label>" + __('tool.' + id + '.output') + "</label>" +
        "<div class=\"output-box\" id=\"sqlOutput\" style=\"white-space:pre;font-family:var(--font-mono);font-size:0.75rem;overflow:auto;max-height:400px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("sqlInput");
      var output = document.getElementById("sqlOutput");
      var formatBtn = document.getElementById("sqlFormatBtn");
      var copyBtn = document.getElementById("sqlCopyBtn");

      var keywords = ["SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "AND", "OR", "NOT", "IN", "SET", "VALUES", "INTO", "GROUP", "ORDER", "BY", "HAVING", "LIMIT", "OFFSET", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "BETWEEN", "LIKE", "IS", "NULL", "TRUE", "FALSE"];

      var mainKeywords = ["SELECT", "FROM", "WHERE", "INSERT INTO", "UPDATE", "DELETE", "SET", "VALUES", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "ON"];

      function formatSql(sql) {
        var upper = sql.toUpperCase();
        var lower = sql;

        // Capitalize keywords
        for (var i = 0; i < keywords.length; i++) {
          var re = new RegExp("\\b" + keywords[i] + "\\b", "gi");
          upper = upper.replace(re, keywords[i]);
        }

        var formatted = upper;

        // Add newlines before main keywords
        for (var j = 0; j < mainKeywords.length; j++) {
          var kw = mainKeywords[j];
          var idx = formatted.indexOf(kw);
          while (idx !== -1) {
            var before = formatted.substring(0, idx);
            var after = formatted.substring(idx);
            if (kw === "ON") {
              // Check if this ON is after JOIN context
              var beforeTrimmed = before.trim();
              if (beforeTrimmed.endsWith("JOIN") || /JOIN\s*$/.test(beforeTrimmed)) {
                formatted = before + "\n  " + after;
              } else {
                formatted = before + "\n" + after;
              }
            } else {
              formatted = before + "\n" + after;
            }
            idx = formatted.indexOf(kw, idx + kw.length + 1);
          }
        }

        // Basic indentation: indent lines after main clauses
        var lines = formatted.split("\n");
        var result = [];
        var indent = false;
        for (var k = 0; k < lines.length; k++) {
          var line = lines[k].trim();
          if (!line) continue;
          var isMain = false;
          for (var m = 0; m < mainKeywords.length; m++) {
            if (line.toUpperCase().startsWith(mainKeywords[m])) {
              isMain = true;
              break;
            }
          }
          if (isMain) {
            indent = false;
            result.push(line);
            // Indent subsequent lines (columns, conditions)
            if (line.toUpperCase().startsWith("SELECT") || line.toUpperCase().startsWith("SET")) {
              indent = true;
            }
          } else {
            if (indent) {
              result.push("  " + line);
            } else {
              result.push(line);
            }
          }
        }

        return result.join("\n");
      }

      function format() {
        var sql = input.value.trim();
        if (!sql) {
          output.textContent = "";
          return;
        }
        try {
          output.textContent = formatSql(sql);
        } catch (e) {
          output.textContent = "Error: " + e.message;
        }
      }

      formatBtn.addEventListener("click", format);
      copyBtn.addEventListener("click", function () {
        if (output.textContent) copyToClipboard(output.textContent);
      });
      input.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") format();
      });
    },
    destroy: function () {}
  };
})();