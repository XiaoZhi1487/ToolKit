(function () {
  var id = 'quick-reply';
  var title = 'Quick Reply';
  var icon = '\u{1F4AC}';
  var category = 'Productivity';
  var description = 'Preset reply templates, one-click copy';
  window.toolMeta.push({ id: id, title: title, icon: icon, category: category, description: description });

  var STORAGE_KEY = 'tk-quick-reply';

  function loadTemplates() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }

  function saveTemplates(data) {
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
        '<div class="btn-group" style="margin-bottom:16px">' +
        '<button class="btn btn-primary" id="qr-addBtn">+ ' + __('tool.' + id + '.add') + '</button>' +
        '</div>' +
        '<div id="qr-list"></div>' +
        '</div>' +
        // Modal
        '<div class="modal-overlay" id="qr-modal" style="display:none">' +
        '<div class="modal" style="max-width:480px">' +
        '<div class="modal-header"><h3 id="qr-modalTitle">' + __('tool.' + id + '.add') + '</h3></div>' +
        '<div class="modal-body">' +
        '<div class="form-row"><label>' + __('tool.' + id + '.group') + '</label><input class="input" id="qr-editGroup" placeholder="' + __('tool.' + id + '.groupPlaceholder') + '"></div>' +
        '<div class="form-row"><label>' + __('tool.' + id + '.content') + '</label><textarea class="input code-input" id="qr-editContent" rows="4" placeholder="' + __('tool.' + id + '.placeholder') + '"></textarea></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn" id="qr-cancel">' + __('tool.' + id + '.cancel') + '</button><button class="btn btn-primary" id="qr-save">' + __('tool.' + id + '.save') + '</button></div>' +
        '</div>' +
        '</div>';

      var list = box.querySelector('#qr-list');
      var modal = box.querySelector('#qr-modal');
      var editGroup = box.querySelector('#qr-editGroup');
      var editContent = box.querySelector('#qr-editContent');
      var modalTitle = box.querySelector('#qr-modalTitle');
      var editingId = null;

      function render() {
        var data = loadTemplates();
        // Group by group name
        var groups = {};
        data.forEach(function (item) {
          if (!groups[item.group]) groups[item.group] = [];
          groups[item.group].push(item);
        });
        var groupNames = Object.keys(groups).sort();

        if (groupNames.length === 0) {
          list.innerHTML = '<div class="empty-state">' + __('tool.' + id + '.empty') + '</div>';
          return;
        }

        var html = '';
        groupNames.forEach(function (g) {
          html += '<div class="install-group" style="margin-bottom:16px">';
          html += '<div class="install-group-title" style="font-weight:600;font-size:0.95rem;margin-bottom:8px;color:var(--text-primary)">' + _escapeHtml(g) + '</div>';
          groups[g].forEach(function (item) {
            html += '<div class="reply-card" style="background:var(--bg-surface);border:1px solid var(--bg-card-border);border-radius:var(--radius-md);padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px">';
            html += '<div style="flex:1;white-space:pre-wrap;word-break:break-word;font-size:0.9rem;color:var(--text-primary);line-height:1.5">' + _escapeHtml(item.content) + '</div>';
            html += '<div style="display:flex;gap:6px;flex-shrink:0">';
            html += '<button class="btn btn-sm" data-copy="' + item.id + '">' + __('tool.' + id + '.copy') + '</button>';
            html += '<button class="btn btn-sm" data-edit="' + item.id + '">' + __('tool.' + id + '.edit') + '</button>';
            html += '<button class="btn btn-sm btn-danger" data-delete="' + item.id + '">' + __('tool.' + id + '.delete') + '</button>';
            html += '</div></div>';
          });
          html += '</div>';
        });
        list.innerHTML = html;

        // Bind events
        list.querySelectorAll('[data-copy]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var item = data.find(function (t) { return t.id === this.dataset.copy; }.bind(this));
            if (item) copyToClipboard(item.content);
          }.bind(btn));
        });
        list.querySelectorAll('[data-edit]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var item = data.find(function (t) { return t.id === this.dataset.edit; }.bind(this));
            if (item) {
              editingId = item.id;
              editGroup.value = item.group;
              editContent.value = item.content;
              modalTitle.textContent = __('tool.' + id + '.edit');
              modal.style.display = 'flex';
            }
          }.bind(btn));
        });
        list.querySelectorAll('[data-delete]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = data.findIndex(function (t) { return t.id === this.dataset.delete; }.bind(this));
            if (idx !== -1) {
              data.splice(idx, 1);
              saveTemplates(data);
              render();
            }
          }.bind(btn));
        });
      }

      box.querySelector('#qr-addBtn').addEventListener('click', function () {
        editingId = null;
        editGroup.value = '';
        editContent.value = '';
        modalTitle.textContent = __('tool.' + id + '.add');
        modal.style.display = 'flex';
      });

      box.querySelector('#qr-cancel').addEventListener('click', function () {
        modal.style.display = 'none';
      });

      box.querySelector('#qr-save').addEventListener('click', function () {
        var group = editGroup.value.trim();
        var content = editContent.value.trim();
        if (!group || !content) return;
        var data = loadTemplates();
        if (editingId) {
          var item = data.find(function (t) { return t.id === editingId; });
          if (item) { item.group = group; item.content = content; }
        } else {
          data.push({ id: Date.now().toString(36), group: group, content: content, created: Date.now() });
        }
        saveTemplates(data);
        modal.style.display = 'none';
        render();
      });

      // Close modal on overlay click
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.style.display = 'none';
      });

      render();
      return box;
    }
  };

  function _escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();