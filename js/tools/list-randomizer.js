// Tool :: List Randomizer
(function () {
  var id = "list-randomizer";
  var title = "List Randomizer";
  var icon = "\ud83d\udd00";
  var category = "Tools";
  var description = "Shuffle, sort, or reverse lists";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.list-randomizer.input") + "</label>" +
        "<textarea id=\"lrInput\" rows=\"6\" placeholder=\"" + __("tool.list-randomizer.placeholder") + "\">Item A\nItem B\nItem C\nItem D\nItem E</textarea>" +
        "<div class=\"btn-group\">" +
        "  <button class=\"btn btn-primary\" id=\"lrShuffleBtn\">" + __("tool.list-randomizer.shuffle") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"lrSortBtn\">" + __("tool.list-randomizer.sort") + "</button>" +
        "  <button class=\"btn btn-secondary\" id=\"lrReverseBtn\">" + __("tool.list-randomizer.reverse") + "</button>" +
        "</div>" +
        "<label>" + __("tool.list-randomizer.output") + " (<span id=\"lrCount\">5</span> " + __("tool.list-randomizer.items") + ")</label>" +
        "<textarea id=\"lrOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<button class=\"btn btn-secondary\" id=\"lrCopyBtn\">" + __("tool.list-randomizer.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("lrInput");
      var shuffleBtn = document.getElementById("lrShuffleBtn");
      var sortBtn = document.getElementById("lrSortBtn");
      var reverseBtn = document.getElementById("lrReverseBtn");
      var output = document.getElementById("lrOutput");
      var count = document.getElementById("lrCount");
      var copyBtn = document.getElementById("lrCopyBtn");
      function getItems() {
        return input.value.split("\n").map(function(s) { return s.trim(); }).filter(function(s) { return s; });
      }
      function updateOutput(items) {
        output.value = items.join("\n");
        count.textContent = items.length;
      }
      shuffleBtn.addEventListener("click", function() {
        var items = getItems();
        for (var i = items.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = items[i]; items[i] = items[j]; items[j] = t;
        }
        updateOutput(items);
      });
      sortBtn.addEventListener("click", function() {
        updateOutput(getItems().sort());
      });
      reverseBtn.addEventListener("click", function() {
        updateOutput(getItems().reverse());
      });
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
      updateOutput(getItems());
    },
    destroy: function () {}
  };
})();