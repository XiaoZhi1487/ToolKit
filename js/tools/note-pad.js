// Tool :: Note Pad
(function () {
  var id = "note-pad";
  var title = "Note Pad";
  var icon = "\ud83d\udcdd";
  var category = "Productivity";
  var description = "Simple note taking with auto-save in browser";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:8px;flex-wrap:wrap\">" +
        "  <div style=\"flex:1;min-width:150px\"><input type=\"text\" id=\"npTitle\" class=\"tool-input\" placeholder=\"" + __("tool.note-pad.title") + "\"></div>" +
        "  <button class=\"btn btn-primary\" id=\"npSaveBtn\">" + __("tool.note-pad.save") + "</button>" +
        "</div>" +
        "<textarea id=\"npContent\" rows=\"6\" placeholder=\"" + __("tool.note-pad.placeholder") + "\"></textarea>" +
        "<div style=\"font-size:0.75rem;color:var(--text-tertiary);margin-bottom:8px\">" + __("tool.note-pad.notes") + ":</div>" +
        "<div id=\"npList\" style=\"max-height:200px;overflow-y:auto\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var titleInput = document.getElementById("npTitle");
      var contentInput = document.getElementById("npContent");
      var saveBtn = document.getElementById("npSaveBtn");
      var list = document.getElementById("npList");
      function loadNotes() {
        list.innerHTML = "";
        var notes = JSON.parse(localStorage.getItem("tk-notes") || "[]");
        if (notes.length === 0) {
          list.innerHTML = "<div style=\"color:var(--text-tertiary);font-size:0.875rem;padding:8px;text-align:center\">" + __("tool.note-pad.empty") + "</div>";
          return;
        }
        for (var i = notes.length - 1; i >= 0; i--) {
          (function(idx, note){
            var el = document.createElement("div");
            el.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:8px;margin-bottom:4px;background:var(--surface-secondary);border-radius:8px;gap:8px";
            el.innerHTML = "<div style=\"flex:1;overflow:hidden\"><div style=\"font-weight:500;font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">" + (note.title || "Untitled") + "</div><div style=\"font-size:0.75rem;color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">" + (note.content || "").substring(0,50) + "</div></div>" +
              "<button class=\"btn btn-sm\" data-del=\"" + idx + "\" style=\"flex-shrink:0\">" + __("tool.note-pad.delete") + "</button>";
            list.appendChild(el);
            el.querySelector("[data-del]").addEventListener("click", function(e) {
              var notes2 = JSON.parse(localStorage.getItem("tk-notes") || "[]");
              notes2.splice(parseInt(e.target.getAttribute("data-del")), 1);
              localStorage.setItem("tk-notes", JSON.stringify(notes2));
              loadNotes();
            });
          })(i, notes[i]);
        }
      }
      saveBtn.addEventListener("click", function() {
        var notes = JSON.parse(localStorage.getItem("tk-notes") || "[]");
        notes.push({ title: titleInput.value, content: contentInput.value, date: new Date().toISOString() });
        localStorage.setItem("tk-notes", JSON.stringify(notes));
        titleInput.value = "";
        contentInput.value = "";
        loadNotes();
      });
      loadNotes();
    },
    destroy: function () {}
  };
})();