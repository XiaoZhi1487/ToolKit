// Tool :: World Clock
(function () {
  var id = "world-clock";
  var title = "World Clock";
  var icon = "\ud83c\udf0d";
  var category = "Productivity";
  var description = "View current time across multiple time zones";
  window.toolMeta.push({ id, title, icon, category, description });
  var DEFAULT_CITIES = [
    { name: "beijing", tz: "Asia/Shanghai" },
    { name: "tokyo", tz: "Asia/Tokyo" },
    { name: "london", tz: "Europe/London" },
    { name: "newYork", tz: "America/New_York" },
    { name: "sydney", tz: "Australia/Sydney" },
    { name: "paris", tz: "Europe/Paris" },
    { name: "dubai", tz: "Asia/Dubai" }
  ];
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <input type=\"text\" id=\"wcCustom\" class=\"tool-input\" placeholder=\"" + __("tool.world-clock.custom") + " (e.g. America/Los_Angeles)\" style=\"flex:1\">" +
        "  <button class=\"btn btn-primary\" id=\"wcAddBtn\">" + __("tool.world-clock.addCity") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"wcRefreshBtn\">" + __("tool.world-clock.refresh") + "</button>" +
        "</div>" +
        "<div id=\"wcGrid\" style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:8px\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var grid = document.getElementById("wcGrid");
      var custom = document.getElementById("wcCustom");
      var addBtn = document.getElementById("wcAddBtn");
      var refreshBtn = document.getElementById("wcRefreshBtn");
      var cities = JSON.parse(localStorage.getItem("tk-worldclock") || "null") || DEFAULT_CITIES;
      function saveCities() {
        localStorage.setItem("tk-worldclock", JSON.stringify(cities));
      }
      function render() {
        grid.innerHTML = "";
        for (var i = 0; i < cities.length; i++) {
          (function(city, idx){
            var now = new Date();
            var timeStr = now.toLocaleString("en-US", { timeZone: city.tz, hour12: false });
            var date = new Date(timeStr);
            var time = date.toLocaleTimeString("en-US", { hour12: false });
            var el = document.createElement("div");
            el.style.cssText = "background:var(--surface-secondary);border-radius:8px;padding:12px;position:relative";
            el.innerHTML = "<div style=\"font-weight:600;font-size:0.9375rem\">" + __("tool.world-clock." + city.name) + "</div>" +
              "<div style=\"font-size:1.5rem;font-weight:700;font-family:var(--font-mono);margin:4px 0\">" + time + "</div>" +
              "<div style=\"font-size:0.75rem;color:var(--text-tertiary)\">" + city.tz + "</div>" +
              "<button class=\"btn btn-sm\" data-remove=\"" + idx + "\" style=\"position:absolute;top:4px;right:4px;padding:2px 6px;font-size:0.75rem;color:var(--danger)\">" + __("tool.world-clock.remove") + "</button>";
            grid.appendChild(el);
            el.querySelector("[data-remove]").addEventListener("click", function() {
              cities.splice(idx, 1);
              saveCities();
              render();
            });
          })(cities[i], i);
        }
      }
      addBtn.addEventListener("click", function() {
        var tz = custom.value.trim();
        if (!tz) return;
        try {
          new Date().toLocaleString("en-US", { timeZone: tz });
          cities.push({ name: tz.split("/").pop(), tz: tz });
          saveCities();
          render();
          custom.value = "";
        } catch(e) {
          custom.value = "Invalid timezone";
        }
      });
      refreshBtn.addEventListener("click", render);
      render();
      setInterval(render, 1000);
    },
    destroy: function () {}
  };
})();