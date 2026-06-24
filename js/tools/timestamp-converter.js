// Tool :: Timestamp Converter
(function () {
  var id = "timestamp-converter";
  var title = "Timestamp Converter";
  var icon = "\u23f0";
  var category = "Developer";
  var description = "Convert between Unix timestamps and human-readable dates";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + title + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"tab-bar\" id=\"tsTabBar\">" +
        "  <button class=\"tab-btn active\" data-mode=\"ts2date\">Timestamp to Date</button>" +
        "  <button class=\"tab-btn\" data-mode=\"date2ts\">Date to Timestamp</button>" +
        "</div>" +
        "<div id=\"tsInputArea\">" +
        "  <label>Unix Timestamp (seconds)</label>" +
        "  <input type=\"number\" id=\"tsInput\" value=\"1719216000\">" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"tsConvertBtn\">Convert</button>" +
        "  <button class=\"btn btn-secondary\" id=\"tsNowBtn\">Now</button>" +
        "</div>" +
        "<div class=\"grid-2\">" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">UTC</div>" +
        "    <div style=\"font-weight:600\" id=\"tsUtc\">-</div>" +
        "  </div>" +
        "  <div class=\"output-box\" style=\"text-align:center;font-family:var(--font-sans)\">" +
        "    <div style=\"font-size:0.75rem;color:var(--text-tertiary)\">Local</div>" +
        "    <div style=\"font-weight:600\" id=\"tsLocal\">-</div>" +
        "  </div>" +
        "</div>" +
        "<div class=\"output-box\" style=\"font-family:var(--font-sans);font-size:0.8125rem\">" +
        "  <span style=\"color:var(--text-tertiary)\">ISO 8601:</span> <span id=\"tsIso\">-</span>" +
        "</div>" +
        "<div class=\"output-box\" style=\"font-family:var(--font-sans);font-size:0.8125rem\">" +
        "  <span style=\"color:var(--text-tertiary)\">Relative:</span> <span id=\"tsRelative\">-</span>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("tsInput");
      var tabBar = document.getElementById("tsTabBar");
      var inputArea = document.getElementById("tsInputArea");
      var utcEl = document.getElementById("tsUtc");
      var localEl = document.getElementById("tsLocal");
      var isoEl = document.getElementById("tsIso");
      var relativeEl = document.getElementById("tsRelative");
      var convertBtn = document.getElementById("tsConvertBtn");
      var nowBtn = document.getElementById("tsNowBtn");
      var mode = "ts2date";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.mode;
        if (mode === "ts2date") {
          inputArea.innerHTML = "<label>Unix Timestamp (seconds)</label><input type=\"number\" id=\"tsInput\" value=\"1719216000\">";
        } else {
          inputArea.innerHTML = "<label>Date & Time</label><input type=\"datetime-local\" id=\"tsInput\" value=\"2024-06-24T12:00\">";
        }
        document.getElementById("tsInput").addEventListener("change", convert);
        convert();
      });

      function relativeTime(d) {
        var now = new Date();
        var diff = Math.floor((d - now) / 1000);
        var abs = Math.abs(diff);
        var suffix = diff >= 0 ? "from now" : "ago";
        if (abs < 60) return abs + " seconds " + suffix;
        if (abs < 3600) return Math.floor(abs / 60) + " minutes " + suffix;
        if (abs < 86400) return Math.floor(abs / 3600) + " hours " + suffix;
        if (abs < 2592000) return Math.floor(abs / 86400) + " days " + suffix;
        if (abs < 31536000) return Math.floor(abs / 2592000) + " months " + suffix;
        return Math.floor(abs / 31536000) + " years " + suffix;
      }

      function convert() {
        try {
          var el = document.getElementById("tsInput");
          if (!el) return;
          var d;
          if (mode === "ts2date") {
            var ts = parseInt(el.value);
            if (isNaN(ts)) return;
            d = new Date(ts * 1000);
          } else {
            d = new Date(el.value);
          }
          if (isNaN(d.getTime())) return;
          utcEl.textContent = d.toUTCString();
          localEl.textContent = d.toLocaleString();
          isoEl.textContent = d.toISOString();
          relativeEl.textContent = relativeTime(d);
        } catch (e) {}
      }

      convertBtn.addEventListener("click", convert);
      nowBtn.addEventListener("click", function () {
        var el = document.getElementById("tsInput");
        if (el && mode === "ts2date") el.value = Math.floor(Date.now() / 1000);
        else if (el) el.value = new Date().toISOString().slice(0, 16);
        convert();
      });
      convert();
    },
    destroy: function () {}
  };
})();
