// Tool :: CSV ↔ JSON Converter
(function () {
  var id = "csv-json";
  var title = "CSV ↔ JSON";
  var icon = "\ud83d\udd04";
  var category = "Converter";
  var description = "Convert CSV data to JSON and JSON to CSV";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"tab-bar\" id=\"cjTabBar\">" +
        "  <button class=\"tab-btn active\" data-mode=\"csv2json\">CSV → JSON</button>" +
        "  <button class=\"tab-btn\" data-mode=\"json2csv\">JSON → CSV</button>" +
        "</div>" +
        "<textarea id=\"cjInput\" rows=\"6\" spellcheck=\"false\">name,age,city\nAlice,30,New York\nBob,25,London\nCharlie,35,Tokyo</textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"cjRunBtn\">Convert</button>" +
        "  <button class=\"btn btn-secondary\" id=\"cjSwapBtn\">Swap</button>" +
        "  <button class=\"btn btn-secondary\" id=\"cjCopyBtn\">Copy</button>" +
        "</div>" +
        "<label>Result</label>" +
        "<textarea id=\"cjOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.75rem\"></textarea>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("cjInput");
      var output = document.getElementById("cjOutput");
      var runBtn = document.getElementById("cjRunBtn");
      var swapBtn = document.getElementById("cjSwapBtn");
      var copyBtn = document.getElementById("cjCopyBtn");
      var tabBar = document.getElementById("cjTabBar");
      var mode = "csv2json";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.mode;
        input.placeholder = mode === "csv2json" ? "CSV input..." : "JSON input...";
        convert();
      });

      function csvToJson(csv) {
        var lines = csv.trim().split("\n");
        if (lines.length < 2) return "[]";
        var headers = lines[0].split(",").map(function (h) { return h.trim(); });
        var result = [];
        for (var i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          var values = lines[i].split(",").map(function (v) { return v.trim(); });
          var obj = {};
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j] || "";
          }
          result.push(obj);
        }
        return JSON.stringify(result, null, 2);
      }

      function jsonToCsv(json) {
        var data;
        try { data = typeof json === "string" ? JSON.parse(json) : json; } catch (e) { return "Invalid JSON"; }
        if (!Array.isArray(data) || data.length === 0) return "Empty array";
        var headers = Object.keys(data[0]);
        var lines = [headers.join(",")];
        for (var i = 0; i < data.length; i++) {
          lines.push(headers.map(function (h) { return String(data[i][h] || ""); }).join(","));
        }
        return lines.join("\n");
      }

      function convert() {
        try {
          if (mode === "csv2json") output.value = csvToJson(input.value);
          else output.value = jsonToCsv(input.value);
        } catch (e) { output.value = "Error: " + e.message; }
      }

      runBtn.addEventListener("click", convert);
      swapBtn.addEventListener("click", function () {
        var cur = output.value;
        if (cur && !cur.startsWith("Error") && !cur.startsWith("Invalid") && !cur.startsWith("Empty")) {
          input.value = cur;
          tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
          var next = tabBar.querySelector(".tab-btn:not(.active)");
          if (next) { next.classList.add("active"); mode = next.dataset.mode; }
          convert();
        }
      });
      copyBtn.addEventListener("click", function () { copyToClipboard(output.value); });
      convert();
    },
    destroy: function () {}
  };
})();
