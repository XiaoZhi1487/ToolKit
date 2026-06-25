// Tool :: Random Number Generator
(function () {
  var id = "random-number";
  var title = "Random Number";
  var icon = "\ud83c\udfb2";
  var category = "Tools";
  var description = "Generate random numbers within a range";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.random-number.min") + "</label><input type=\"number\" id=\"rnMin\" value=\"1\"></div>" +
        "  <div><label>" + __("tool.random-number.max") + "</label><input type=\"number\" id=\"rnMax\" value=\"100\"></div>" +
        "</div>" +
        "<div class=\"grid-2\">" +
        "  <div><label>" + __("tool.random-number.count") + "</label><input type=\"number\" id=\"rnCount\" value=\"1\" min=\"1\" max=\"1000\"></div>" +
        "  <div><label class=\"toggle-wrap\" style=\"margin-top:22px\"><input type=\"checkbox\" id=\"rnNoDup\"><span class=\"toggle-label\">" + __("tool.random-number.noDuplicates") + "</span></label></div>" +
        "</div>" +
        "<button class=\"btn btn-primary\" id=\"rnGenBtn\">" + __("tool.random-number.generate") + "</button>" +
        "<label>" + __("tool.random-number.result") + "</label>" +
        "<textarea id=\"rnOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"rnCopyBtn\">" + __("tool.random-number.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var minEl = document.getElementById("rnMin");
      var maxEl = document.getElementById("rnMax");
      var countEl = document.getElementById("rnCount");
      var noDup = document.getElementById("rnNoDup");
      var genBtn = document.getElementById("rnGenBtn");
      var output = document.getElementById("rnOutput");
      var copyBtn = document.getElementById("rnCopyBtn");
      function generate() {
        var min = parseInt(minEl.value) || 0;
        var max = parseInt(maxEl.value) || 100;
        var count = Math.min(1000, Math.max(1, parseInt(countEl.value) || 1));
        var noDuplicates = noDup.checked;
        var range = max - min + 1;
        if (noDuplicates && count > range) count = range;
        var result = [];
        if (noDuplicates) {
          var pool = [];
          for (var i = min; i <= max; i++) pool.push(i);
          for (var i = pool.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
          }
          result = pool.slice(0, count);
        } else {
          for (var i = 0; i < count; i++) {
            result.push(Math.floor(Math.random() * (max - min + 1)) + min);
          }
        }
        output.value = result.join("\n");
      }
      genBtn.addEventListener("click", generate);
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
      generate();
    },
    destroy: function () {}
  };
})();