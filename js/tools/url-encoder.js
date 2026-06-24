// Tool :: URL Encoder / Decoder
(function () {
  var id = "url-encoder";
  var title = "URL Encoder / Decoder";
  var icon = "\uD83D\uDD17";
  var category = "Developer";
  var description = "Encode or decode URL strings";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = { id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\">",
        "  <span class=\"tool-header-icon\">" + icon + "</span>",
        "  <h2>" + __('tool.' + id + '.title') + "</h2>",
        "</div>",
        "<div class=\"tool-content\">",
        "  <div class=\"tab-bar\" id=\"urlTabBar\">",
        "    <button class=\"tab-btn active\" data-tab=\"encode\">" + __('tool.' + id + '.tabEncode') + "</button>",
        "    <button class=\"tab-btn\" data-tab=\"decode\">" + __('tool.' + id + '.tabDecode') + "</button>",
        "  </div>",
        "  <label>" + __('common.input') + "</label>",
        "  <textarea id=\"urlInput\" rows=\"4\" placeholder=\"" + __('common.input') + "\" spellcheck=\"false\"></textarea>",
        "  <div class=\"btn-group\">",
        "    <button class=\"btn btn-primary\" id=\"urlRunBtn\">" + __('common.execute') + "</button>",
        "    <button class=\"btn btn-secondary\" id=\"urlSwapBtn\">" + __('common.swap') + "</button>",
        "  </div>",
        "  <label>" + __('common.result') + "</label>",
        "  <div class=\"output-box\" id=\"urlOutput\">" + __('common.result') + "</div>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var input = document.getElementById("urlInput");
      var output = document.getElementById("urlOutput");
      var runBtn = document.getElementById("urlRunBtn");
      var swapBtn = document.getElementById("urlSwapBtn");
      var tabBar = document.getElementById("urlTabBar");
      var mode = "encode";
      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.tab;
        run();
      });
      function run() {
        try {
          output.textContent = mode === "encode"
            ? encodeURIComponent(input.value)
            : decodeURIComponent(input.value);
        } catch (e) {
          output.textContent = "\u274C " + __('common.result') + ": " + e.message;
        }
      }
      runBtn.addEventListener("click", run);
      swapBtn.addEventListener("click", function () {
        var cur = output.textContent;
        if (cur && !cur.startsWith("\u274C")) {
          input.value = cur;
          var other = tabBar.querySelector(".tab-btn:not(.active)");
          if (other) {
            tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
            other.classList.add("active");
            mode = other.dataset.tab;
          }
          run();
        }
      });
      run();
    },
    destroy: function () {}
  };
})();