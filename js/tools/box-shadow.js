// Tool :: Box Shadow Generator
(function () {
  var id = "box-shadow";
  var title = "Box Shadow Generator";
  var icon = "\ud83d\udca1";
  var category = "Design";
  var description = "Generate CSS box-shadow effects visually";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div id=\"bsPreviewWrap\" style=\"display:flex;justify-content:center;align-items:center;height:180px;background:var(--bg-subtle);border-radius:var(--radius-md);margin-bottom:16px\">" +
        "  <div id=\"bsPreview\" style=\"width:160px;height:100px;background:var(--bg-card);border-radius:var(--radius-md);box-shadow:0 4px 12px 0 rgba(0,0,0,0.15)\"></div>" +
        "</div>" +
        "<div id=\"bsLayers\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"bsAddLayer\">" + __('tool.' + id + '.addLayer') + "</button>" +
        "<label style=\"margin-top:16px;display:block\">" + __('tool.' + id + '.code') + "</label>" +
        "<div class=\"output-box\"><textarea id=\"bsCode\" readonly style=\"width:100%;min-height:70px;border:none;background:transparent;resize:vertical;font-family:var(--font-mono);font-size:0.75rem\"></textarea></div>" +
        "<button class=\"btn btn-secondary\" id=\"bsCopy\">" + __('tool.' + id + '.copy') + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var preview = document.getElementById("bsPreview");
      var layersEl = document.getElementById("bsLayers");
      var codeEl = document.getElementById("bsCode");
      var addBtn = document.getElementById("bsAddLayer");
      var copyBtn = document.getElementById("bsCopy");
      var layers = [{ hOffset: 0, vOffset: 4, blur: 12, spread: 0, color: "rgba(0,0,0,0.15)", inset: false }];

      function buildShadowCSS() {
        var parts = [];
        for (var i = 0; i < layers.length; i++) {
          var l = layers[i];
          var s = (l.inset ? 'inset ' : '') + l.hOffset + 'px ' + l.vOffset + 'px ' + l.blur + 'px ' + l.spread + 'px ' + l.color;
          parts.push(s);
        }
        return parts.join(',\n  ');
      }

      function updatePreview() {
        var css = buildShadowCSS();
        preview.style.boxShadow = css;
        codeEl.value = 'box-shadow:\n  ' + css + ';';
      }

      function renderLayers() {
        layersEl.innerHTML = "";
        for (var i = 0; i < layers.length; i++) {
          (function (idx) {
            var l = layers[idx];
            var div = document.createElement("div");
            div.className = "bs-layer";
            div.style.cssText = "border:1px solid var(--bg-card-border);border-radius:var(--radius-md);padding:12px;margin-bottom:8px";
            div.innerHTML =
              "<div class=\"grid-2\" style=\"grid-template-columns:1fr 1fr;gap:8px\">" +
              "  <div><label>" + __('tool.' + id + '.hOffset') + "</label><input type=\"range\" class=\"bs-h\" min=\"-50\" max=\"50\" value=\"" + l.hOffset + "\" style=\"width:100%\"><span class=\"bs-hv\">" + l.hOffset + "</span></div>" +
              "  <div><label>" + __('tool.' + id + '.vOffset') + "</label><input type=\"range\" class=\"bs-v\" min=\"-50\" max=\"50\" value=\"" + l.vOffset + "\" style=\"width:100%\"><span class=\"bs-vv\">" + l.vOffset + "</span></div>" +
              "  <div><label>" + __('tool.' + id + '.blur') + "</label><input type=\"range\" class=\"bs-b\" min=\"0\" max=\"100\" value=\"" + l.blur + "\" style=\"width:100%\"><span class=\"bs-bv\">" + l.blur + "</span></div>" +
              "  <div><label>" + __('tool.' + id + '.spread') + "</label><input type=\"range\" class=\"bs-s\" min=\"-50\" max=\"50\" value=\"" + l.spread + "\" style=\"width:100%\"><span class=\"bs-sv\">" + l.spread + "</span></div>" +
              "</div>" +
              "<div class=\"flex-row\" style=\"display:flex;align-items:center;gap:12px;margin-top:8px\">" +
              "  <div><label>" + __('tool.' + id + '.color') + "</label><input type=\"color\" class=\"bs-c\" value=\"" + l.color.replace('rgba(0,0,0,0.15)', '#000000') + "\"></div>" +
              "  <div style=\"display:flex;align-items:center;gap:4px\"><input type=\"checkbox\" class=\"bs-i\"" + (l.inset ? " checked" : "") + "><label>" + __('tool.' + id + '.inset') + "</label></div>" +
              "  <button class=\"btn btn-secondary bs-remove\" style=\"margin-left:auto;font-size:0.75rem;padding:2px 8px\">" + __('tool.' + id + '.removeLayer') + "</button>" +
              "</div>";
            layersEl.appendChild(div);

            var hInput = div.querySelector(".bs-h");
            var vInput = div.querySelector(".bs-v");
            var bInput = div.querySelector(".bs-b");
            var sInput = div.querySelector(".bs-s");
            var cInput = div.querySelector(".bs-c");
            var iInput = div.querySelector(".bs-i");
            var hVal = div.querySelector(".bs-hv");
            var vVal = div.querySelector(".bs-vv");
            var bVal = div.querySelector(".bs-bv");
            var sVal = div.querySelector(".bs-sv");

            function onLayerChange() {
              l.hOffset = parseInt(hInput.value, 10);
              l.vOffset = parseInt(vInput.value, 10);
              l.blur = parseInt(bInput.value, 10);
              l.spread = parseInt(sInput.value, 10);
              l.color = cInput.value;
              l.inset = iInput.checked;
              hVal.textContent = l.hOffset;
              vVal.textContent = l.vOffset;
              bVal.textContent = l.blur;
              sVal.textContent = l.spread;
              updatePreview();
            }

            hInput.addEventListener("input", onLayerChange);
            vInput.addEventListener("input", onLayerChange);
            bInput.addEventListener("input", onLayerChange);
            sInput.addEventListener("input", onLayerChange);
            cInput.addEventListener("input", onLayerChange);
            iInput.addEventListener("change", onLayerChange);

            div.querySelector(".bs-remove").addEventListener("click", function () {
              if (layers.length > 1) {
                layers.splice(idx, 1);
                renderLayers();
                updatePreview();
              }
            });
          })(i);
        }
      }

      addBtn.addEventListener("click", function () {
        layers.push({ hOffset: 0, vOffset: 0, blur: 10, spread: 0, color: "#000000", inset: false });
        renderLayers();
        updatePreview();
      });

      copyBtn.addEventListener("click", function () { copyToClipboard(codeEl.value); });

      renderLayers();
      updatePreview();
    },
    destroy: function () {}
  };
})();