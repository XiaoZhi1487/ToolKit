// Tool :: Number to Words
(function () {
  var id = "number-to-words";
  var title = "Number to Words";
  var icon = "\ud83d\udd22";
  var category = "Tools";
  var description = "Convert numbers to Chinese uppercase and English words";
  window.toolMeta.push({ id, title, icon, category, description });

  function numToChinese(num) {
    if (num === 0) return "零";
    var units = ["", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿"];
    var digits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    var str = "";
    var s = String(Math.floor(num));
    var len = s.length;
    for (var i = 0; i < len; i++) {
      var d = parseInt(s[i]);
      var pos = len - 1 - i;
      if (d === 0) {
        if (pos === 4 || pos === 8) str += (pos === 4 && len > 8 ? "" : "") + (pos === 4 ? "万" : "亿");
        else if (i > 0 && parseInt(s[i-1]) !== 0) str += "零";
      } else {
        str += digits[d] + (pos > 0 ? units[pos % 9] || "" : "");
      }
    }
    return str;
  }

  function numToEnglish(num) {
    if (num === 0) return "zero";
    var ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    var tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    var scales = ["", "thousand", "million", "billion"];
    function convertChunk(n) {
      if (n === 0) return "";
      var parts = [];
      if (n >= 100) { parts.push(ones[Math.floor(n / 100)] + " hundred"); n %= 100; }
      if (n >= 20) { parts.push(tens[Math.floor(n / 10)]); n %= 10; }
      if (n > 0) parts.push(ones[n]);
      return parts.join(" ");
    }
    var n = Math.floor(num);
    if (n === 0) return "zero";
    var result = "";
    var scaleIdx = 0;
    while (n > 0) {
      var chunk = n % 1000;
      if (chunk > 0) {
        var chunkStr = convertChunk(chunk);
        if (scaleIdx > 0) chunkStr += " " + scales[scaleIdx];
        result = chunkStr + (result ? " " + result : "");
      }
      n = Math.floor(n / 1000);
      scaleIdx++;
    }
    return result;
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.number-to-words.input") + "</label>" +
        "<input type=\"number\" id=\"nwInput\" value=\"1234567\" placeholder=\"" + __("tool.number-to-words.placeholder") + "\">" +
        "<button class=\"btn btn-primary\" id=\"nwConvertBtn\">" + __("tool.number-to-words.convert") + "</button>" +
        "<label>" + __("tool.number-to-words.chinese") + "</label>" +
        "<div class=\"output-box\" id=\"nwChinese\" style=\"font-size:1rem;word-break:break-all\">壹佰贰拾叁万肆仟伍佰陆拾柒</div>" +
        "<button class=\"btn btn-secondary\" id=\"nwCopyCn\">" + __("tool.number-to-words.copyChinese") + "</button>" +
        "<label>" + __("tool.number-to-words.english") + "</label>" +
        "<div class=\"output-box\" id=\"nwEnglish\" style=\"font-size:0.8125rem;word-break:break-all\">one million two hundred thirty four thousand five hundred sixty seven</div>" +
        "<button class=\"btn btn-secondary\" id=\"nwCopyEn\">" + __("tool.number-to-words.copyEnglish") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("nwInput");
      var convertBtn = document.getElementById("nwConvertBtn");
      var chinese = document.getElementById("nwChinese");
      var english = document.getElementById("nwEnglish");
      var copyCn = document.getElementById("nwCopyCn");
      var copyEn = document.getElementById("nwCopyEn");
      function convert() {
        var val = parseFloat(input.value);
        if (isNaN(val) || val < 0) { chinese.textContent = "-"; english.textContent = "-"; return; }
        if (val > 999999999999) { chinese.textContent = "数值过大"; english.textContent = "Number too large"; return; }
        chinese.textContent = numToChinese(val);
        english.textContent = numToEnglish(val);
      }
      convertBtn.addEventListener("click", convert);
      input.addEventListener("keydown", function(e) { if (e.key === "Enter") convert(); });
      copyCn.addEventListener("click", function() { if (chinese.textContent !== "-") copyToClipboard(chinese.textContent); });
      copyEn.addEventListener("click", function() { if (english.textContent !== "-") copyToClipboard(english.textContent); });
      convert();
    },
    destroy: function () {}
  };
})();