// Tool :: HTML Entity Encoder / Decoder
(function () {
  var id = "html-entity";
  var title = "HTML Entity Converter";
  var icon = "&";
  var category = "Developer";
  var description = "Encode or decode HTML entities (&amp; &lt; &gt; &quot; &#x27;)";
  window.toolMeta.push({ id, title, icon, category, description });

  var ENTITY_MAP = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#x27;": "'", "&#x2F;": "/", "&#x60;": "`", "&#xA;": "\n", "&#xD;": "\r", "&nbsp;": "\u00a0",
    "&copy;": "\u00a9", "&reg;": "\u00ae", "&euro;": "\u20ac", "&pound;": "\u00a3", "&yen;": "\u00a5", "&cent;": "\u00a2", "&sect;": "\u00a7", "&deg;": "\u00b0"
  };
  var REV_MAP = {};
  for (var k in ENTITY_MAP) REV_MAP[ENTITY_MAP[k]] = k;

  function encodeEntities(text) {
    return text.replace(/[&<>"'\/`\n\r\u00a0\u00a9\u00ae\u20ac\u00a3\u00a5\u00a2\u00a7\u00b0]/g, function (c) {
      return REV_MAP[c] || "&#" + c.charCodeAt(0) + ";";
    });
  }

  function decodeEntities(text) {
    return text.replace(/&[#a-zA-Z0-9]+;/g, function (m) {
      return ENTITY_MAP[m] || m;
    });
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"tab-bar\" id=\"heTabBar\">" +
        "  <button class=\"tab-btn active\" data-mode=\"encode\">" + __("tool.html-entity.tabEncode") + "</button>" +
        "  <button class=\"tab-btn\" data-mode=\"decode\">" + __("tool.html-entity.tabDecode") + "</button>" +
        "</div>" +
        "<textarea id=\"heInput\" rows=\"5\" placeholder=\"" + __("tool.html-entity.enterText") + "...\" spellcheck=\"false\">Hello <World> & \"Test\"</textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"heRunBtn\">" + __("common.convert") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"heSwapBtn\">" + __("common.swap") + "</button>" +
        "</div>" +
        "<label>" + __("common.result") + "</label>" +
        "<div class=\"output-box\" id=\"heOutput\" style=\"word-break:break-all\">" + __("common.result") + "</div>" +
        "<button class=\"btn btn-secondary\" id=\"heCopyBtn\">" + __("common.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("heInput");
      var output = document.getElementById("heOutput");
      var runBtn = document.getElementById("heRunBtn");
      var swapBtn = document.getElementById("heSwapBtn");
      var copyBtn = document.getElementById("heCopyBtn");
      var tabBar = document.getElementById("heTabBar");
      var mode = "encode";

      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mode = btn.dataset.mode;
        convert();
      });

      function convert() {
        try {
          output.textContent = mode === "encode" ? encodeEntities(input.value) : decodeEntities(input.value);
        } catch (e) {
          output.textContent = "Error: " + e.message;
        }
      }

      runBtn.addEventListener("click", convert);
      swapBtn.addEventListener("click", function () {
        var cur = output.textContent;
        if (cur && !cur.startsWith("Error")) {
          input.value = cur;
          tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
          var next = tabBar.querySelector(".tab-btn:not(.active)");
          if (next) { next.classList.add("active"); mode = next.dataset.mode; }
          convert();
        }
      });
      copyBtn.addEventListener("click", function () { copyToClipboard(output.textContent); });
      convert();
    },
    destroy: function () {}
  };
})();
