// Tool :: To-Do List
(function () {
  var id = "todo-list";
  var title = "To-Do List";
  var icon = "\u2611\ufe0f";
  var category = "Productivity";
  var description = "Manage tasks with auto-save in browser";
  window.toolMeta.push({ id, title, icon, category, description });
  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement("div");
      box.className = "tool-body";
      box.innerHTML = "<div class=\"tool-header\"><span class=\"tool-header-icon\">" + icon + "</span><h2>" + __('tool.' + id + '.title') + "</h2></div>" +
        "<div class=\"tool-content\">" +
        "<div class=\"flex-row\" style=\"gap:8px\">" +
        "  <input type=\"text\" id=\"tdInput\" class=\"tool-input\" placeholder=\"" + __("tool.todo-list.placeholder") + "\" style=\"flex:1\">" +
        "  <button class=\"btn btn-primary\" id=\"tdAddBtn\">" + __("tool.todo-list.add") + "</button>" +
        "</div>" +
        "<div class=\"flex-row\" style=\"gap:8px;margin-top:4px\">" +
        "  <button class=\"btn btn-sm active\" data-filter=\"all\">" + __("tool.todo-list.all") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"pending\">" + __("tool.todo-list.pending") + "</button>" +
        "  <button class=\"btn btn-sm\" data-filter=\"complete\">" + __("tool.todo-list.complete") + "</button>" +
        "  <button class=\"btn btn-sm\" id=\"tdClearBtn\">" + __("tool.todo-list.clearCompleted") + "</button>" +
        "</div>" +
        "<div id=\"tdList\" style=\"margin-top:8px\"></div>" +
        "<div style=\"font-size:0.75rem;color:var(--text-tertiary);text-align:center;margin-top:8px\" id=\"tdCount\"></div>" +
        "</div>";
      return box;
    },
    init: function () {
      var input = document.getElementById("tdInput");
      var addBtn = document.getElementById("tdAddBtn");
      var list = document.getElementById("tdList");
      var count = document.getElementById("tdCount");
      var clearBtn = document.getElementById("tdClearBtn");
      var filter = "all";
      var filterBtns = document.querySelectorAll("[data-filter]");
      for (var i = 0; i < filterBtns.length; i++) {
        (function(btn){
          btn.addEventListener("click", function() {
            filterBtns.forEach(function(b){b.classList.remove("active");});
            btn.classList.add("active");
            filter = btn.getAttribute("data-filter");
            render();
          });
        })(filterBtns[i]);
      }
      function getTasks() {
        return JSON.parse(localStorage.getItem("tk-todos") || "[]");
      }
      function saveTasks(tasks) {
        localStorage.setItem("tk-todos", JSON.stringify(tasks));
      }
      function render() {
        var tasks = getTasks();
        var filtered = tasks.filter(function(t) {
          if (filter === "pending") return !t.done;
          if (filter === "complete") return t.done;
          return true;
        });
        list.innerHTML = "";
        if (filtered.length === 0) {
          list.innerHTML = "<div style=\"color:var(--text-tertiary);font-size:0.875rem;padding:16px;text-align:center\">" + __("tool.todo-list.empty") + "</div>";
        }
        for (var i = 0; i < filtered.length; i++) {
          (function(task, idx){
            var el = document.createElement("div");
            el.style.cssText = "display:flex;align-items:center;gap:8px;padding:8px;margin-bottom:4px;background:var(--surface-secondary);border-radius:8px";
            el.innerHTML = "<input type=\"checkbox\" " + (task.done ? "checked" : "") + " data-idx=\"" + idx + "\" style=\"width:18px;height:18px;cursor:pointer\">" +
              "<span style=\"flex:1;text-decoration:" + (task.done ? "line-through" : "none") + ";color:" + (task.done ? "var(--text-tertiary)" : "inherit") + ";font-size:0.875rem\">" + task.text + "</span>" +
              "<button class=\"btn btn-sm\" data-remove=\"" + idx + "\" style=\"flex-shrink:0;color:var(--danger)\">\u2715</button>";
            list.appendChild(el);
            el.querySelector("input[type=checkbox]").addEventListener("change", function(e) {
              var tasks2 = getTasks();
              var realIdx = tasks2.indexOf(task);
              if (realIdx > -1) tasks2[realIdx].done = e.target.checked;
              saveTasks(tasks2);
              render();
            });
            el.querySelector("[data-remove]").addEventListener("click", function() {
              var tasks2 = getTasks();
              var realIdx = tasks2.indexOf(task);
              if (realIdx > -1) tasks2.splice(realIdx, 1);
              saveTasks(tasks2);
              render();
            });
          })(filtered[i], i);
        }
        var pending = tasks.filter(function(t){return !t.done;}).length;
        count.textContent = __("tool.todo-list.count", pending);
      }
      addBtn.addEventListener("click", function() {
        var text = input.value.trim();
        if (!text) return;
        var tasks = getTasks();
        tasks.push({ text: text, done: false });
        saveTasks(tasks);
        input.value = "";
        render();
      });
      input.addEventListener("keydown", function(e) { if (e.key === "Enter") addBtn.click(); });
      clearBtn.addEventListener("click", function() {
        var tasks = getTasks().filter(function(t){return !t.done;});
        saveTasks(tasks);
        render();
      });
      render();
    },
    destroy: function () {}
  };
})();