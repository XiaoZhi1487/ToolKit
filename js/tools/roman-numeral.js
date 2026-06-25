// Tool :: Roman Numeral
(function () {
  var id = "roman-numeral";
  var title = "Roman Numeral";
  var icon = "\u2164";
  var category = "Converter";
  var description = "Convert between Arabic numbers and Roman numerals";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <button class=\"btn btn-sm active\" id=\"rnTabToRoman\">" + __("tool.roman-numeral.toRoman") + "</button>" +
        "  <button class=\"btn btn-sm\" id=\"rnTabToNumber\">" + __("tool.roman-numeral.toNumber") + "</button>" +
        "</div>" +
        "<label>" + __("tool.roman-numeral.input") + "</label>" +
        "<input type=\"text\" id=\"rnInput\" class=\"tool-input\" placeholder=\"" + __("tool.roman-numeral.placeholder") + "\" value=\"2024\">" +
        "<button class=\"btn btn-primary\" id=\"rnConvertBtn\">" + __("tool.roman-numeral.convert") + "</button>" +
        "<label>" + __("tool.roman-numeral.result") + "</label>" +
        "<div id=\"rnOutput\" style=\"font-family:var(--font-mono);font-size:1.25rem;font-weight:600;padding:8px;background:var(--surface-secondary);border-radius:8px\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"rnCopyBtn\">" + __("tool.roman-numeral.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("rnInput");
      var output = document.getElementById("rnOutput");
      var copyBtn = document.getElementById("rnCopyBtn");
      var toRoman = true;
      var tabToRoman = document.getElementById("rnTabToRoman");
      var tabToNumber = document.getElementById("rnTabToNumber");
      tabToRoman.addEventListener("click", function() {
        toRoman = true;
        tabToRoman.classList.add("active");
        tabToNumber.classList.remove("active");
        input.placeholder = __("tool.roman-numeral.placeholder");
        convert();
      });
      tabToNumber.addEventListener("click", function() {
        toRoman = false;
        tabToNumber.classList.add("active");
        tabToRoman.classList.remove("active");
        input.placeholder = __("tool.roman-numeral.romanPlaceholder");
        convert();
      });
      function toRomanNum(num) {
        if (num < 1 || num > 3999) return "Out of range (1-3999)";
        var vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
        var chars = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
        var result = "";
        for (var i = 0; i < vals.length; i++) {
          while (num >= vals[i]) { result += chars[i]; num -= vals[i]; }
        }
        return result;
      }
      function fromRoman(str) {
        var map = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
        var total = 0;
        for (var i = 0; i < str.length; i++) {
          var cur = map[str[i]] || 0;
          var next = map[str[i+1]] || 0;
          if (cur < next) total -= cur;
          else total += cur;
        }
        return total;
      }
      function convert() {
        var val = input.value.trim();
        if (!val) { output.textContent = "-"; return; }
        if (toRoman) {
          var n = parseInt(val, 10);
          if (isNaN(n)) { output.textContent = "Invalid number"; return; }
          output.textContent = toRomanNum(n);
        } else {
          output.textContent = fromRoman(val.toUpperCase()).toString();
        }
      }
      document.getElementById("rnConvertBtn").addEventListener("click", convert);
      copyBtn.addEventListener("click", function() { if (output.textContent && output.textContent !== "-") copyToClipboard(output.textContent); });
      convert();
    },
    destroy: function () {}
  };
})();