// Tool :: Regex Tester
(function () {
  var id = "regex-tester";
  var title = "Regex Tester";
  var icon = "\ud83d\udd0d";
  var category = "Developer";
  var description = "Test regular expressions against text with real-time match highlighting";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>Regular Expression</label>" +
        "<div class=\"flex-row\">" +
        "  <input type=\"text\" id=\"rtPattern\" value=\"(\\\\w+)@(\\\\w+)\\.(\\\\w+)\" placeholder=\"Enter regex pattern\" style=\"flex:1;font-family:var(--font-mono)\">" +
        "  <label class=\"toggle-wrap\" style=\"flex-shrink:0\"><input type=\"checkbox\" id=\"rtGlobal\" checked><span class=\"toggle-label\">g</span></label>" +
        "  <label class=\"toggle-wrap\" style=\"flex-shrink:0\"><input type=\"checkbox\" id=\"rtCaseInsensitive\"><span class=\"toggle-label\">i</span></label>" +
        "  <label class=\"toggle-wrap\" style=\"flex-shrink:0\"><input type=\"checkbox\" id=\"rtMultiline\"><span class=\"toggle-label\">m</span></label>" +
        "</div>" +
        "<label>Test String</label>" +
        "<textarea id=\"rtInput\" rows=\"5\" placeholder=\"Enter test string...\">hello@example.com and world@test.org</textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"rtTestBtn\">Test</button>" +
        "  <button class=\"btn btn-secondary\" id=\"rtClearBtn\">Clear</button>" +
        "</div>" +
        "<div class=\"grid-2\">" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">Matches</div>" +
        "    <div style=\"font-size:1.5rem;font-weight:700\" id=\"rtCount\">0</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">Time (ms)</div>" +
        "    <div style=\"font-size:1.5rem;font-weight:700\" id=\"rtTime\">0</div>" +
        "  </div>" +
        "</div>" +
        "<label>Match Details</label>" +
        "<div class=\"output-box\" id=\"rtDetails\" style=\"font-family:var(--font-mono);font-size:0.75rem;max-height:200px;overflow-y:auto;white-space:pre\">No matches</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var pattern = document.getElementById("rtPattern");
      var input = document.getElementById("rtInput");
      var testBtn = document.getElementById("rtTestBtn");
      var clearBtn = document.getElementById("rtClearBtn");
      var countEl = document.getElementById("rtCount");
      var timeEl = document.getElementById("rtTime");
      var details = document.getElementById("rtDetails");
      var globalCb = document.getElementById("rtGlobal");
      var ciCb = document.getElementById("rtCaseInsensitive");
      var mlCb = document.getElementById("rtMultiline");

      function test() {
        try {
          var flags = "";
          if (globalCb.checked) flags += "g";
          if (ciCb.checked) flags += "i";
          if (mlCb.checked) flags += "m";
          var regex = new RegExp(pattern.value, flags);
          var text = input.value;
          var start = performance.now();
          var matches = [];
          var match;
          if (flags.includes("g")) {
            while ((match = regex.exec(text)) !== null) {
              matches.push({ full: match[0], index: match.index, groups: match.slice(1) });
              if (match.index === regex.lastIndex) regex.lastIndex++;
              if (matches.length > 1000) break;
            }
          } else {
            match = regex.exec(text);
            if (match) matches.push({ full: match[0], index: match.index, groups: match.slice(1) });
          }
          var elapsed = (performance.now() - start).toFixed(2);

          countEl.textContent = matches.length;
          timeEl.textContent = elapsed;
          if (matches.length === 0) {
            details.textContent = "No matches found";
          } else {
            details.textContent = matches.map(function (m, i) {
              var line = "Match #" + (i + 1) + " at " + m.index + ": \"" + m.full + "\"";
              if (m.groups.length > 0) {
                line += "\n" + m.groups.map(function (g, j) { return "  Group " + (j + 1) + ": \"" + g + "\""; }).join("\n");
              }
              return line;
            }).join("\n\n");
          }
        } catch (e) {
          details.textContent = "Error: " + e.message;
          countEl.textContent = "!";
          timeEl.textContent = "0";
        }
      }

      testBtn.addEventListener("click", test);
      clearBtn.addEventListener("click", function () {
        pattern.value = "";
        input.value = "";
        countEl.textContent = "0";
        timeEl.textContent = "0";
        details.textContent = "No matches";
      });
      test();
    },
    destroy: function () {}
  };
})();
