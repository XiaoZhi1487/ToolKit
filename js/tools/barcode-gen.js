// Tool :: Barcode Generator
(function () {
  var id = "barcode-gen";
  var title = "Barcode Generator";
  var icon = "\ud83d\udcf1";
  var category = "Media";
  var description = "Generate Code128 format barcodes";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.barcode-gen.input") + "</label>" +
        "<input type=\"text\" id=\"bgInput\" class=\"tool-input\" value=\"1234567890\" placeholder=\"" + __("tool.barcode-gen.input") + "\">" +
        "<div class=\"flex-row\" style=\"gap:8px;flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:80px\"><label style=\"font-size:0.75rem\">" + __("tool.barcode-gen.width") + "</label><input type=\"number\" id=\"bgWidth\" class=\"tool-input\" value=\"2\" min=\"1\" max=\"10\"></div>" +
        "  <div style=\"flex:1;min-width:80px\"><label style=\"font-size:0.75rem\">" + __("tool.barcode-gen.height") + "</label><input type=\"number\" id=\"bgHeight\" class=\"tool-input\" value=\"80\" min=\"20\" max=\"400\"></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"bgGenerateBtn\">" + __("tool.barcode-gen.generate") + "</button>" +
        "<div id=\"bgOutput\" style=\"text-align:center;margin-top:8px;min-height:100px;display:flex;align-items:center;justify-content:center;background:var(--surface-secondary);border-radius:8px\">" +
        "  <span style=\"color:var(--text-tertiary);font-size:0.875rem\">" + __("common.waiting") + "</span>" +
        "</div>" +
        "<button class=\"btn btn-secondary\" id=\"bgDownloadBtn\" style=\"display:none\">" + __("tool.barcode-gen.download") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("bgInput");
      var barWidth = document.getElementById("bgWidth");
      var barHeight = document.getElementById("bgHeight");
      var generateBtn = document.getElementById("bgGenerateBtn");
      var output = document.getElementById("bgOutput");
      var downloadBtn = document.getElementById("bgDownloadBtn");
      // Simple Code128B encoding
      function encode128B(text) {
        var values = [];
        for (var i = 0; i < text.length; i++) {
          var code = text.charCodeAt(i);
          if (code >= 32 && code <= 126) values.push(code - 32);
          else values.push(0); // replace invalid chars with space
        }
        // Start Code B = 104
        var codes = [104];
        for (var i = 0; i < values.length; i++) codes.push(values[i]);
        // Checksum
        var sum = codes[0];
        for (var i = 1; i < codes.length; i++) sum += codes[i] * i;
        codes.push(sum % 103);
        // Stop
        codes.push(106); // stop code
        return codes;
      }
      // Code128 patterns (11-bit per code)
      var CODE128_PATTERNS = [
        "11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100","10001100100","11001001000",
        "11001000100","11000100100","10110011100","10011011100","10011001110","10111001100","10011101100","10011100110","11001110010","11001011100",
        "11001001110","11011100100","11001110100","11101101110","11101001100","11100101100","11100100110","11101100100","11100110100","11100110010",
        "11011011000","11011000110","11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000",
        "11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110","11101110110","11010001110",
        "11000101110","11011101000","11011100010","11011101110","11101011000","11101000110","11100010110","11101101000","11101100010","11100011010",
        "11101111010","11001000010","11110001010","10100110000","10100001100","10010110000","10010000110","10000101100","10000100110","10110010000",
        "10110000100","10011010000","10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100","10001111010",
        "10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100","11110010010","11011011110",
        "11011110110","11110110110","10101111000","10100011110","10001011110","10111101000","10111100010","11110101000","11110100010","10111011110",
        "10111101110","11101011110","11110101110","11010000100","11010010000","11010011100","1100011101011"
      ];
      function generateBarcode() {
        var text = input.value || " ";
        var w = parseInt(barWidth.value) || 2;
        var h = parseInt(barHeight.value) || 80;
        var codes = encode128B(text);
        var totalW = 0;
        for (var i = 0; i < codes.length; i++) totalW += 11;
        totalW += 2; // quiet zone
        var cvs = document.createElement("canvas");
        cvs.width = totalW * w;
        cvs.height = h + 40;
        var ctx = cvs.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        var x = w * 2; // quiet zone
        for (var i = 0; i < codes.length; i++) {
          var pattern = CODE128_PATTERNS[codes[i]];
          if (!pattern) continue;
          for (var j = 0; j < pattern.length; j++) {
            if (pattern[j] === "1") {
              ctx.fillStyle = "black";
              ctx.fillRect(x, 0, w, h);
            }
            x += w;
          }
        }
        // Draw text below
        ctx.fillStyle = "black";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(text, cvs.width / 2, h + 28);
        output.innerHTML = "<img src=\"" + cvs.toDataURL() + "\" style=\"border-radius:4px\">";
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = function() {
          var a = document.createElement("a");
          a.href = cvs.toDataURL();
          a.download = "barcode.png";
          a.click();
        };
      }
      generateBtn.addEventListener("click", generateBarcode);
      generateBarcode();
    },
    destroy: function () {}
  };
})();