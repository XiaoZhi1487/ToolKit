// Tool :: UUID Generator
(function () {
  var id = "uuid-generator";
  var title = "UUID Generator";
  var icon = "\uD83D\uDD11";
  var category = "Developer";
  var description = "Generate UUID v4 / v7 and batch generation";
  window.toolMeta.push({ id, title, icon, category, description });

  function uuidV4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
  }

  function uuidV7() {
    var now = Date.now();
    var hex = now.toString(16).padStart(12, "0");
    var random = crypto.getRandomValues(new Uint8Array(10));
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-7" + (random[0] & 0x0f).toString(16) +
      Array.from(random.slice(1, 5)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("").slice(0, 4) + "-" +
      Array.from(random.slice(5)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  window.tools[id] = { id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = [
        "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>",
        "<div class=\"tool-content\">",
        "  <div class=\"tab-bar\" id=\"uuidTabBar\">",
        "    <button class=\"tab-btn active\" data-type=\"v4\">UUID v4</button>",
        "    <button class=\"tab-btn\" data-type=\"v7\">UUID v7</button>",
        "  </div>",
        "  <label>" + __('tool.' + id + '.batchCount') + "</label>",
        "  <div class=\"flex-row\">",
        "    <input type=\"number\" id=\"uuidCount\" value=\"1\" min=\"1\" max=\"100\" style=\"width:80px\">",
        "    <button class=\"btn btn-primary\" id=\"uuidGenBtn\">" + __('common.generate') + "</button>",
        "  </div>",
        "  <textarea id=\"uuidOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.75rem\"></textarea>",
        "  <button class=\"btn btn-secondary\" id=\"uuidCopyBtn\">" + __('tool.' + id + '.copyAll') + "</button>",
        "</div>"
      ].join("");
      return box;
    },
    init: function () {
      var output = document.getElementById("uuidOutput"), genBtn = document.getElementById("uuidGenBtn");
      var copyBtn = document.getElementById("uuidCopyBtn"), countEl = document.getElementById("uuidCount");
      var tabBar = document.getElementById("uuidTabBar");
      var type = "v4";
      tabBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".tab-btn");
        if (!btn) return;
        tabBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        type = btn.dataset.type;
        generate();
      });
      function generate() {
        var count = Math.min(100, Math.max(1, parseInt(countEl.value) || 1));
        var fn = type === "v4" ? uuidV4 : uuidV7;
        var arr = [];
        for (var i = 0; i < count; i++) arr.push(fn());
        output.value = arr.join("\n");
      }
      genBtn.addEventListener("click", generate);
      copyBtn.addEventListener("click", function () { copyToClipboard(output.value); });
      generate();
    },
    destroy: function () {}
  };
})();