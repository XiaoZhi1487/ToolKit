// Tool :: QR Code Generator - Using qrcode-generator library
(function () {
  var id = "qr-generator";
  var title = "QR Code Generator";
  var icon = "\ud83d\udcf7";
  var category = "Media";
  var description = "Generate QR codes from text or URLs with customizable colors and sizes";

  window.toolMeta.push({ id, title, icon, category, description });

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.qr-generator.textOrUrl") + "</label>" +
        "<input type=\"text\" id=\"qrInput\" value=\"https://example.com\" placeholder=\"" + __("tool.qr-generator.enterText") + "...\">" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.qr-generator.foreground") + "</label><input type=\"color\" id=\"qrFg\" value=\"#1a1a2e\"></div>" +
        "  <div><label>" + __("tool.qr-generator.background") + "</label><input type=\"color\" id=\"qrBg\" value=\"#ffffff\"></div>" +
        "</div>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"qrGenBtn\">" + __("tool.qr-generator.generate") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"qrDlBtn\">" + __("tool.qr-generator.downloadPng") + "</button>" +
        "</div>" +
        "<div class=\"qr-container\" id=\"qrContainer\"><canvas id=\"qrCanvas\"></canvas></div>" +
        "<div class=\"output-box\" id=\"qrOutput\" style=\"font-family:var(--font-sans);font-size:0.8125rem;text-align:center;word-break:break-all\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("qrInput");
      var genBtn = document.getElementById("qrGenBtn");
      var dlBtn = document.getElementById("qrDlBtn");
      var fgPicker = document.getElementById("qrFg");
      var bgPicker = document.getElementById("qrBg");
      var canvas = document.getElementById("qrCanvas");
      var output = document.getElementById("qrOutput");

      function generate() {
        var text = input.value.trim() || "https://example.com";
        var fg = fgPicker.value;
        var bg = bgPicker.value;

        // Use the qrcode-generator library to generate a proper QR code
        try {
          var qr = qrcode(0, 'M');
          qr.addData(text);
          qr.make();

          var count = qr.getModuleCount();
          var scale = 8;
          var margin = 4;
          var dim = (count + margin * 2) * scale;

          canvas.width = dim;
          canvas.height = dim;

          var ctx = canvas.getContext("2d");

          // Background
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, dim, dim);

          // Draw QR modules
          ctx.fillStyle = fg;
          for (var row = 0; row < count; row++) {
            for (var col = 0; col < count; col++) {
              if (qr.isDark(row, col)) {
                ctx.fillRect(
                  (col + margin) * scale,
                  (row + margin) * scale,
                  scale,
                  scale
                );
              }
            }
          }

          output.textContent = text.length + " chars | " + count + "x" + count + " modules";
        } catch (e) {
          output.textContent = "Error: " + e.message;
        }
      }

      genBtn.addEventListener("click", generate);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") generate(); });
      dlBtn.addEventListener("click", function () {
        var link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
      fgPicker.addEventListener("input", generate);
      bgPicker.addEventListener("input", generate);
      generate();
    },
    destroy: function () {}
  };
})();