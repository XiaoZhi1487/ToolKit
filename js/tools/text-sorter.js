// Tool :: Text Sorter
(function () {
  var id = "text-sorter";
  var title = "Text Sorter";
  var icon = "\ud83d\udd22";
  var category = "Text";
  var description = "Sort, reverse, deduplicate text lines";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<label>" + __("tool.text-sorter.input") + "</label>" +
        "<textarea id=\"tsInput\" rows=\"6\" placeholder=\"apple\nbanana\ncherry\">apple\nbanana\ncherry\napple\ndate</textarea>" +
        "<div class=\"flex-row\" style=\"gap:6px;flex-wrap:wrap\">" +
        "  <button class=\"btn btn-sm\" data-action=\"sortAZ\">" + __("tool.text-sorter.sortAZ") + "</button>" +
        "  <button class=\"btn btn-sm\" data-action=\"sortZA\">" + __("tool.text-sorter.sortZA") + "</button>" +
        "  <button class=\"btn btn-sm\" data-action=\"sortLen\">" + __("tool.text-sorter.sortLength") + "</button>" +
        "  <button class=\"btn btn-sm\" data-action=\"reverse\">" + __("tool.text-sorter.reverse") + "</button>" +
        "  <button class=\"btn btn-sm\" data-action=\"shuffle\">" + __("tool.text-sorter.shuffle") + "</button>" +
        "  <button class=\"btn btn-sm\" data-action=\"unique\">" + __("tool.text-sorter.unique") + "</button>" +
        "  <button class=\"btn btn-sm\" data-action=\"trim\">" + __("tool.text-sorter.trim") + "</button>" +
        "  <button class=\"btn btn-sm\" data-action=\"removeEmpty\">" + __("tool.text-sorter.removeEmpty") + "</button>" +
        "</div>" +
        "<label>" + __("tool.text-sorter.result") + "</label>" +
        "<textarea id=\"tsOutput\" rows=\"6\" readonly style=\"font-family:var(--font-mono);font-size:0.8125rem\"></textarea>" +
        "<div style=\"font-size:0.75rem;color:var(--text-tertiary)\" id=\"tsLineCount\"></div>" +
        "<button class=\"btn btn-secondary\" id=\"tsCopyBtn\">" + __("tool.text-sorter.copy") + "</button>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("tsInput");
      var output = document.getElementById("tsOutput");
      var lineCount = document.getElementById("tsLineCount");
      var copyBtn = document.getElementById("tsCopyBtn");
      var buttons = document.querySelectorAll("[data-action]");
      function process(action) {
        var lines = input.value.split("\n");
        switch (action) {
          case "sortAZ": lines.sort(function(a,b){return a.localeCompare(b);}); break;
          case "sortZA": lines.sort(function(a,b){return b.localeCompare(a);}); break;
          case "sortLen": lines.sort(function(a,b){return a.length - b.length;}); break;
          case "reverse": lines.reverse(); break;
          case "shuffle": for(var i=lines.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=lines[i];lines[i]=lines[j];lines[j]=t;} break;
          case "unique": var seen={};var r=[];for(var i=0;i<lines.length;i++){if(!seen[lines[i]]){seen[lines[i]]=true;r.push(lines[i]);}}lines=r; break;
          case "trim": for(var i=0;i<lines.length;i++)lines[i]=lines[i].trim(); break;
          case "removeEmpty": lines=lines.filter(function(l){return l.trim()!=="";}); break;
        }
        output.value = lines.join("\n");
        lineCount.textContent = __("tool.text-sorter.lineCount", lines.length);
      }
      for (var i = 0; i < buttons.length; i++) {
        (function(btn){
          btn.addEventListener("click", function(){ process(btn.getAttribute("data-action")); });
        })(buttons[i]);
      }
      copyBtn.addEventListener("click", function() { if (output.value) copyToClipboard(output.value); });
      process("sortAZ");
    },
    destroy: function () {}
  };
})();