// Tool :: Border Radius Builder
(function () {
  var id = "border-radius";
  var title = "Border Radius Builder";
  var icon = "\u2b1c";
  var category = "Design";
  var description = "Generate CSS border-radius values visually";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div style=\"display:flex;justify-content:center;align-items:center;height:200px;margin-bottom:16px\">" +
        "  <div id=\"brPreview\" style=\"width:180px;height:140px;background:linear-gradient(135deg,#6366f1,#ec4899);border-radius:20px\"></div>" +
        "</div>" +
        "<div class=\"flex-row\" style=\"display:flex;align-items:center;gap:12px;margin-bottom:12px\">" +
        "  <label style=\"flex:1\">" + __('tool.' + id + '.all') + "</label>" +
        "  <input type=\"range\" id=\"brAll\" min=\"0\" max=\"100\" value=\"20\" style=\"flex:3\">" +
        "  <span id=\"brAllVal\" style=\"min-width:32px;text-align:right\">20</span>" +
        "  <label style=\"margin-left:12px\"><input type=\"checkbox\" id=\"brLinked\" checked> " + __('tool.' + id + '.linked') + "</label>" +
        "</div>" +
        "<div class=\"grid-2\" id=\"brCorners\" style=\"grid-template-columns:1fr 1fr;gap:8px\">" +
        "  <div><label>" + __('tool.' + id + '.tl') + "</label><input type=\"range\" class=\"br-corner\" data-corner=\"tl\" min=\"0\" max=\"100\" value=\"20\" style=\"width:100%\"><span class=\"br-corner-val\" data-corner=\"tl\">20</span></div>" +
        "  <div><label>" + __('tool.' + id + '.tr') + "</label><input type=\"range\" class=\"br-corner\" data-corner=\"tr\" min=\"0\" max=\"100\" value=\"20\" style=\"width:100%\"><span class=\"br-corner-val\" data-corner=\"tr\">20</span></div>" +
        "  <div><label>" + __('tool.' + id + '.br') + "</label><input type=\"range\" class=\"br-corner\" data-corner=\"br\" min=\"0\" max=\"100\" value=\"20\" style=\"width:100%\"><span class=\"br-corner-val\" data-corner=\"br\">20</span></div>" +
        "  <div><label>" + __('tool.' + id + '.bl') + "</label><input type=\"range\" class=\"br-corner\" data-corner=\"bl\" min=\"0\" max=\"100\" value=\"20\" style=\"width:100%\"><span class=\"br-corner-val\" data-corner=\"bl\">20</span></div>" +
        "</div>" +
        "<label style=\"margin-top:16px;display:block\">" + __('tool.' + id + '.code') + "</label>" +
        "<div class=\"output-box\" id=\"brCode\" style=\"font-size:0.75rem;font-family:var(--font-mono);word-break:break-all\">border-radius: 20px;</div>" +
        "<button class=\"btn btn-secondary\" id=\"brCopy\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var preview = document.getElementById("brPreview");
      var allInput = document.getElementById("brAll");
      var allVal = document.getElementById("brAllVal");
      var linked = document.getElementById("brLinked");
      var codeEl = document.getElementById("brCode");
      var copyBtn = document.getElementById("brCopy");
      var cornerInputs = document.querySelectorAll(".br-corner");
      var cornerVals = document.querySelectorAll(".br-corner-val");

      var corners = { tl: 20, tr: 20, br: 20, bl: 20 };

      function updateCode() {
        if (corners.tl === corners.tr && corners.tr === corners.br && corners.br === corners.bl) {
          codeEl.textContent = "border-radius: " + corners.tl + "px;";
        } else {
          codeEl.textContent = "border-radius: " + corners.tl + "px " + corners.tr + "px " + corners.br + "px " + corners.bl + "px;";
        }
      }

      function updatePreview() {
        preview.style.borderRadius = corners.tl + "px " + corners.tr + "px " + corners.br + "px " + corners.bl + "px";
        updateCode();
      }

      function setAll(value) {
        var v = parseInt(value, 10);
        corners.tl = corners.tr = corners.br = corners.bl = v;
        allVal.textContent = v;
        allInput.value = v;
        cornerInputs.forEach(function (el) { el.value = v; });
        cornerVals.forEach(function (el) { el.textContent = v; });
        updatePreview();
      }

      allInput.addEventListener("input", function () {
        if (linked.checked) {
          setAll(allInput.value);
        }
      });

      linked.addEventListener("change", function () {
        if (linked.checked) {
          setAll(allInput.value);
        }
      });

      cornerInputs.forEach(function (el) {
        el.addEventListener("input", function () {
          var corner = el.dataset.corner;
          corners[corner] = parseInt(el.value, 10);
          var valEl = document.querySelector(".br-corner-val[data-corner=\"" + corner + "\"]");
          if (valEl) valEl.textContent = el.value;
          if (linked.checked) {
            setAll(el.value);
          } else {
            updatePreview();
          }
        });
      });

      copyBtn.addEventListener("click", function () { copyToClipboard(codeEl.textContent); });

      updatePreview();
    },
    destroy: function () {}
  };
})();