(function () {
  var id = 'install-guide';
  var title = 'Install Guide';
  var icon = '\u2705';
  var category = 'Productivity';
  var description = 'Create software installation checklists, track progress';
  window.toolMeta.push({ id: id, title: title, icon: icon, category: category, description: description });

  var STORAGE_KEY = 'tk-install-guide';

  function loadBoards() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }

  function saveBoards(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  window.tools[id] = {
    id: id, title: title, icon: icon,
    render: function () {
      var box = document.createElement('div');
      box.className = 'tool-body';
      box.innerHTML =
        '<div class="tool-header"><span class="tool-header-icon">' + icon + '</span><h2>' + __('tool.' + id + '.title') + '</h2></div>' +
        '<div class="tool-content">' +
        '<div class="btn-group" style="margin-bottom:16px;flex-wrap:wrap;gap:8px">' +
        '<button class="btn btn-primary" id="ig-addBoard">+ ' + __('tool.' + id + '.add') + '</button>' +
        '</div>' +
        '<div id="ig-list"></div>' +
        '</div>' +
        // Board modal
        '<div class="modal-overlay" id="ig-modal" style="display:none">' +
        '<div class="modal" style="max-width:520px">' +
        '<div class="modal-header"><h3 id="ig-modalTitle">' + __('tool.' + id + '.add') + '</h3></div>' +
        '<div class="modal-body">' +
        '<div class="form-row"><label>' + __('tool.' + id + '.name') + '</label><input class="input" id="ig-editName" placeholder="' + __('tool.' + id + '.namePlaceholder') + '"></div>' +
        '<div class="form-row"><label>' + __('tool.' + id + '.step') + '</label><div id="ig-stepList"><div class="ig-step-row" style="display:flex;gap:8px;margin-bottom:6px"><input class="input" placeholder="' + __('tool.' + id + '.stepPlaceholder') + '" style="flex:1"><button class="btn btn-sm btn-danger ig-step-rm">\u2716</button></div></div>' +
        '<button class="btn btn-sm" id="ig-addStep">+ ' + __('tool.' + id + '.addStep') + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn" id="ig-cancel">' + __('tool.' + id + '.cancel') + '</button><button class="btn btn-primary" id="ig-save">' + __('tool.' + id + '.save') + '</button></div>' +
        '</div>' +
        '</div>';

      var list = box.querySelector('#ig-list');
      var modal = box.querySelector('#ig-modal');
      var editName = box.querySelector('#ig-editName');
      var stepList = box.querySelector('#ig-stepList');
      var modalTitle = box.querySelector('#ig-modalTitle');
      var editingId = null;

      function getStepInputs() {
        var inputs = stepList.querySelectorAll('.ig-step-row input');
        var steps = [];
        inputs.forEach(function (inp) {
          var v = inp.value.trim();
          if (v) steps.push({ text: v, done: false });
        });
        return steps;
      }

      function addStepRow(value) {
        var row = document.createElement('div');
        row.className = 'ig-step-row';
        row.style.cssText = 'display:flex;gap:8px;margin-bottom:6px';
        row.innerHTML = '<input class="input" placeholder="' + __('tool.' + id + '.stepPlaceholder') + '" style="flex:1" value="' + (value || '') + '"><button class="btn btn-sm btn-danger ig-step-rm">\u2716</button>';
        row.querySelector('.ig-step-rm').addEventListener('click', function () { row.remove(); });
        stepList.appendChild(row);
      }

      function renderBoards() {
        var data = loadBoards();
        if (data.length === 0) {
          list.innerHTML = '<div class="empty-state">' + __('tool.' + id + '.empty') + '</div>';
          return;
        }
        var html = '';
        data.forEach(function (board, bi) {
          var total = board.steps.length;
          var done = board.steps.filter(function (s) { return s.done; }).length;
          var pct = total > 0 ? Math.round(done / total * 100) : 0;
          html += '<div class="install-board" style="background:var(--bg-surface);border:1px solid var(--bg-card-border);border-radius:var(--radius-lg);padding:20px;margin-bottom:16px">';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
          html += '<h3 style="margin:0;font-size:1.05rem;color:var(--text-primary)">' + _escapeHtml(board.name) + '</h3>';
          html += '<div style="display:flex;gap:6px">';
          html += '<button class="btn btn-sm ig-export" data-idx="' + bi + '">' + __('tool.' + id + '.export') + '</button>';
          html += '<button class="btn btn-sm ig-edit" data-idx="' + bi + '">' + __('tool.' + id + '.edit') + '</button>';
          html += '<button class="btn btn-sm btn-danger ig-delete" data-idx="' + bi + '">' + __('tool.' + id + '.delete') + '</button>';
          html += '</div></div>';
          // Progress bar
          html += '<div style="margin-bottom:12px;display:flex;align-items:center;gap:8px">';
          html += '<span style="font-size:0.8rem;color:var(--text-secondary);flex-shrink:0">' + __('tool.' + id + '.progress') + ': ' + pct + '%</span>';
          html += '<div style="flex:1;height:6px;background:var(--bg-card-border);border-radius:3px;overflow:hidden">';
          html += '<div style="height:100%;width:' + pct + '%;background:var(--accent-gradient);border-radius:3px;transition:width 0.3s"></div>';
          html += '</div>';
          html += '<span style="font-size:0.8rem;color:var(--text-secondary);flex-shrink:0">' + done + '/' + total + '</span>';
          html += '</div>';
          // Steps
          html += '<div style="padding-left:4px">';
          board.steps.forEach(function (step, si) {
            html += '<div class="ig-step-item" style="display:flex;align-items:center;gap:10px;padding:6px 0;cursor:pointer" data-idx="' + bi + '" data-step="' + si + '">';
            html += '<span style="width:20px;height:20px;border-radius:50%;border:2px solid ' + (step.done ? 'var(--accent-1)' : 'var(--text-tertiary)') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;color:' + (step.done ? 'var(--accent-1)' : 'transparent') + '">' + (step.done ? '\u2713' : '') + '</span>';
            html += '<span style="font-size:0.9rem;color:var(--text-primary);' + (step.done ? 'text-decoration:line-through;opacity:0.6' : '') + '">' + _escapeHtml(step.text) + '</span>';
            html += '</div>';
          });
          html += '</div></div>';
        });
        list.innerHTML = html;

        // Toggle step
        list.querySelectorAll('.ig-step-item').forEach(function (el) {
          el.addEventListener('click', function () {
            var data = loadBoards();
            var bi = parseInt(el.dataset.idx);
            var si = parseInt(el.dataset.step);
            if (data[bi] && data[bi].steps[si]) {
              data[bi].steps[si].done = !data[bi].steps[si].done;
              saveBoards(data);
              renderBoards();
            }
          });
        });
        // Edit
        list.querySelectorAll('.ig-edit').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var data = loadBoards();
            var board = data[parseInt(this.dataset.idx)];
            if (!board) return;
            editingId = this.dataset.idx;
            editName.value = board.name;
            stepList.innerHTML = '';
            board.steps.forEach(function (s) { addStepRow(s.text); });
            if (board.steps.length === 0) addStepRow('');
            modalTitle.textContent = __('tool.' + id + '.edit');
            modal.style.display = 'flex';
          });
        });
        // Delete
        list.querySelectorAll('.ig-delete').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var data = loadBoards();
            data.splice(parseInt(this.dataset.idx), 1);
            saveBoards(data);
            renderBoards();
          });
        });
        // Export
        list.querySelectorAll('.ig-export').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var data = loadBoards();
            var board = data[parseInt(this.dataset.idx)];
            if (!board) return;
            var lines = [];
            lines.push('[' + board.name + '] ' + __('tool.' + id + '.progress') + ':');
            board.steps.forEach(function (s) {
              lines.push((s.done ? '[\u2713]' : '[ ]') + ' ' + s.text);
            });
            var total = board.steps.length;
            var done = board.steps.filter(function (s) { return s.done; }).length;
            lines.push('');
            lines.push(done + '/' + total + ' (' + (total > 0 ? Math.round(done / total * 100) : 0) + '%)');
            copyToClipboard(lines.join('\n'));
          });
        });
      }

      box.querySelector('#ig-addBoard').addEventListener('click', function () {
        editingId = null;
        editName.value = '';
        stepList.innerHTML = '';
        addStepRow('');
        modalTitle.textContent = __('tool.' + id + '.add');
        modal.style.display = 'flex';
      });

      box.querySelector('#ig-addStep').addEventListener('click', function () {
        addStepRow('');
      });

      box.querySelector('#ig-cancel').addEventListener('click', function () {
        modal.style.display = 'none';
      });

      box.querySelector('#ig-save').addEventListener('click', function () {
        var name = editName.value.trim();
        var steps = getStepInputs();
        if (!name || steps.length === 0) return;
        var data = loadBoards();
        if (editingId !== null) {
          var idx = parseInt(editingId);
          if (data[idx]) { data[idx].name = name; data[idx].steps = steps; }
        } else {
          data.push({ name: name, steps: steps, created: Date.now() });
        }
        saveBoards(data);
        modal.style.display = 'none';
        renderBoards();
      });

      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.style.display = 'none';
      });

      renderBoards();
      return box;
    }
  };

  function _escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();