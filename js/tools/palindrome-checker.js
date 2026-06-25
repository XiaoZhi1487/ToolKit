// Tool :: Palindrome Checker
(function () {
  var id = "palindrome-checker";
  var title = "Palindrome Checker";
  var icon = "\ud83d\udd18";
  var category = "Text";
  var description = "Check if text reads the same forwards and backwards";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.palindrome-checker.input") + "</label>" +
        "<textarea id=\"pcInput\" rows=\"4\" placeholder=\"A man, a plan, a canal: Panama\"></textarea>" +
        "<div class=\"flex-row\" style=\"gap:8px;align-items:center\">" +
        "  <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"pcIgnoreCase\" checked> " + __("tool.palindrome-checker.ignoreCase") + "</label>" +
        "  <label style=\"font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer\"><input type=\"checkbox\" id=\"pcIgnoreSpaces\" checked> " + __("tool.palindrome-checker.ignoreSpaces") + "</label>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"pcCheckBtn\">" + __("tool.palindrome-checker.check") + "</button>" +
        "<div class=\"result-card\" id=\"pcResult\" style=\"margin-top:12px\"></div>" +
        "<div class=\"flex-row\" style=\"gap:16px;margin-top:8px\">" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.palindrome-checker.original") + "</label><div id=\"pcOriginal\" style=\"font-family:var(--font-mono);font-size:0.8125rem;word-break:break-all\"></div></div>" +
        "  <div style=\"flex:1\"><label style=\"font-size:0.75rem\">" + __("tool.palindrome-checker.reversed") + "</label><div id=\"pcReversed\" style=\"font-family:var(--font-mono);font-size:0.8125rem;word-break:break-all\"></div></div>" +
        "</div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("pcInput");
      var checkBtn = document.getElementById("pcCheckBtn");
      var result = document.getElementById("pcResult");
      var original = document.getElementById("pcOriginal");
      var reversed = document.getElementById("pcReversed");
      function check() {
        var text = input.value;
        var processed = text;
        if (document.getElementById("pcIgnoreSpaces").checked) {
          processed = processed.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "");
        }
        if (document.getElementById("pcIgnoreCase").checked) {
          processed = processed.toLowerCase();
        }
        var rev = processed.split("").reverse().join("");
        var isPal = processed === rev;
        result.className = "result-card";
        result.style.borderLeft = "4px solid " + (isPal ? "var(--success)" : "var(--danger)");
        result.textContent = isPal ? __("tool.palindrome-checker.isPalindrome") : __("tool.palindrome-checker.notPalindrome");
        original.textContent = processed || "(empty)";
        reversed.textContent = rev || "(empty)";
      }
      checkBtn.addEventListener("click", check);
    },
    destroy: function () {}
  };
})();