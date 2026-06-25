// Tool :: Password Strength
(function () {
  var id = "password-strength";
  var title = "Password Strength";
  var icon = "\ud83d\udd11";
  var category = "Security";
  var description = "Check password strength and get improvement suggestions";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.password-strength.input") + "</label>" +
        "<input type=\"text\" id=\"psInput\" class=\"tool-input\" placeholder=\"" + __("tool.password-strength.placeholder") + "\" style=\"font-family:var(--font-mono)\">" +
        "<div style=\"margin-top:8px\">" +
        "  <div style=\"font-size:0.75rem;color:var(--text-tertiary);margin-bottom:4px\">" + __("tool.password-strength.strength") + ": <strong id=\"psLabel\">-</strong></div>" +
        "  <div style=\"height:8px;background:var(--surface-secondary);border-radius:4px;overflow:hidden\"><div id=\"psBar\" style=\"height:100%;width:0%;border-radius:4px;transition:all 0.3s\"></div></div>" +
        "</div>" +
        "<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;font-size:0.75rem\">" +
        "  <span>" + __("tool.password-strength.length") + ": <strong id=\"psLen\">0</strong></span>" +
        "  <span>" + __("tool.password-strength.uppercase") + ": <strong id=\"psUpper\">0</strong></span>" +
        "  <span>" + __("tool.password-strength.lowercase") + ": <strong id=\"psLower\">0</strong></span>" +
        "  <span>" + __("tool.password-strength.numbers") + ": <strong id=\"psNums\">0</strong></span>" +
        "  <span>" + __("tool.password-strength.symbols") + ": <strong id=\"psSymbols\">0</strong></span>" +
        "</div>" +
        "<div id=\"psSuggestions\" style=\"margin-top:8px;font-size:0.75rem;color:var(--danger)\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("psInput");
      var bar = document.getElementById("psBar");
      var label = document.getElementById("psLabel");
      var lenEl = document.getElementById("psLen");
      var upperEl = document.getElementById("psUpper");
      var lowerEl = document.getElementById("psLower");
      var numsEl = document.getElementById("psNums");
      var symbolsEl = document.getElementById("psSymbols");
      var suggestions = document.getElementById("psSuggestions");
      var STRENGTH_LABELS = ["veryWeak","weak","fair","strong","veryStrong"];
      var STRENGTH_COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#10b981"];
      function check() {
        var pwd = input.value;
        var len = pwd.length;
        var upper = (pwd.match(/[A-Z]/g) || []).length;
        var lower = (pwd.match(/[a-z]/g) || []).length;
        var nums = (pwd.match(/[0-9]/g) || []).length;
        var symbols = (pwd.match(/[^A-Za-z0-9]/g) || []).length;
        lenEl.textContent = len;
        upperEl.textContent = upper;
        lowerEl.textContent = lower;
        numsEl.textContent = nums;
        symbolsEl.textContent = symbols;
        var score = 0;
        if (len >= 8) score += 25;
        else if (len >= 6) score += 15;
        if (upper > 0) score += 15;
        if (lower > 0) score += 15;
        if (nums > 0) score += 15;
        if (symbols > 0) score += 20;
        if (len >= 12) score += 10;
        if (upper > 0 && lower > 0 && nums > 0 && symbols > 0) score += 10;
        var idx = Math.min(4, Math.floor(score / 20));
        bar.style.width = score + "%";
        bar.style.background = STRENGTH_COLORS[idx];
        label.textContent = __("tool.password-strength." + STRENGTH_LABELS[idx]);
        var tips = [];
        if (len < 8) tips.push(__("tool.password-strength.addLength"));
        if (upper === 0) tips.push(__("tool.password-strength.addUppercase"));
        if (lower === 0) tips.push(__("tool.password-strength.addLowercase"));
        if (nums === 0) tips.push(__("tool.password-strength.addNumbers"));
        if (symbols === 0) tips.push(__("tool.password-strength.addSymbols"));
        suggestions.innerHTML = tips.length ? "<strong>" + __("tool.password-strength.suggestions") + ":</strong><ul style=\"margin:4px 0 0 16px;padding:0\">" + tips.map(function(t){return "<li>"+t+"</li>";}).join("") + "</ul>" : "";
      }
      input.addEventListener("input", check);
    },
    destroy: function () {}
  };
})();