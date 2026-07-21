// ToolKit :: Core Application

var App = {
  tools: window.tools,
  meta: window.toolMeta,
  _currentTool: null,
  RECENT_KEY: 'tk-recent',
  POS_KEY: 'tk-recent-pos',
  OPEN_KEY: 'tk-recent-open',
  MAX_RECENT: 20,
  _dragging: false,
  _dragOffset: { x: 0, y: 0 },

  init: function () {
    this._cache = {
      homeSection: $id('homeSection'),
      toolSection: $id('toolSection'),
      toolsGrid: $id('toolsGrid'),
      toolContainer: $id('toolContainer'),
      searchInput: $id('searchInput'),
      categoryFilter: $id('categoryFilter'),
      backBtn: $id('backBtn'),
      themeToggle: $id('themeToggle'),
      langToggle: $id('langToggle'),
      navBrand: $id('navBrand'),
      navMenuBtn: $id('navMenuBtn'),
      mobileCatPanel: $id('mobileCatPanel'),
      mobileCatInner: $id('mobileCatInner'),
      overlay: $id('overlay'),
      recentToggle: $id('recentToggle'),
      recentPanel: $id('recentPanel'),
      recentList: $id('recentList'),
      recentClear: $id('recentClear'),
    };

    // Init i18n first
    initLang();

    this._initTheme();
    this._initCategories();
    this._initMobileCategories();
    this._initStats();
    this._renderRecent();
    this._initDraggable();
    // Restore recent panel open state
    this._restoreOpenState();
    this._renderGrid();
    this._bindEvents();

    // Auto-filter from URL hash
    if (location.hash && location.hash.startsWith('#tool-')) {
      var id = location.hash.slice(6);
      this.openTool(id);
    }
  },

  /* ---------- Theme ---------- */
  _initTheme: function () {
    var stored = localStorage.getItem('tk-theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    }
    this._updateThemeIcons();
  },

  _toggleTheme: function () {
    var html = document.documentElement;
    var cur = html.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('tk-theme', next);
    this._updateThemeIcons();
  },

  _updateThemeIcons: function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var sun = qs('.sun-icon');
    var moon = qs('.moon-icon');
    if (sun) sun.style.display = isDark ? 'block' : 'none';
    if (moon) moon.style.display = isDark ? 'none' : 'block';
    if (!isDark) { if (sun) sun.style.display = 'block'; if (moon) moon.style.display = 'none'; }
    var tt = $id('themeToggle');
    if (tt) tt.setAttribute('aria-label', isDark ? __('theme.dark') : __('theme.light'));
  },

  /* ---------- Categories ---------- */
  _initCategories: function () {
    var cats = [];
    var seen = {};
    this.meta.forEach(function (t) {
      if (!seen[t.category]) {
        seen[t.category] = true;
        cats.push(t.category);
      }
    });
    var filter = this._cache.categoryFilter;
    cats.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'cat-btn';
      btn.dataset.cat = cat;
      btn.textContent = __('cat.' + cat);
      filter.appendChild(btn);
    });
  },

  /* ---------- Translate Category Buttons ---------- */
  _translateCats: function () {
    var btns = qsa('.cat-btn');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var key = 'cat.' + btn.dataset.cat;
      btn.textContent = __(key);
    }
  },

  /* ---------- Stats ---------- */
  _initStats: function () {
    var toolCount = this.meta.length;
    var cats = {};
    this.meta.forEach(function (t) { cats[t.category] = true; });
    var catCount = Object.keys(cats).length;
    var statTools = $id('statTools');
    var statCats = $id('statCategories');
    if (statTools) {
      var start = 0;
      var step = Math.max(1, Math.floor(toolCount / 30));
      var interval = setInterval(function () {
        start += step;
        if (start >= toolCount) {
          start = toolCount;
          clearInterval(interval);
        }
        statTools.textContent = start;
      }, 30);
    }
    if (statCats) statCats.textContent = catCount;
  },

  /* ---------- Mobile Categories ---------- */
  _initMobileCategories: function () {
    var inner = this._cache.mobileCatInner;
    var desktopBtns = qsa('.cat-btn', this._cache.categoryFilter);
    inner.innerHTML = '';
    for (var i = 0; i < desktopBtns.length; i++) {
      var btn = desktopBtns[i];
      var clone = document.createElement('button');
      clone.className = 'cat-btn' + (btn.classList.contains('active') ? ' active' : '');
      clone.dataset.cat = btn.dataset.cat;
      clone.textContent = btn.textContent;
      inner.appendChild(clone);
    }
  },

  /* ---------- Recent Tools ---------- */
  _getRecent: function () {
    try {
      return JSON.parse(localStorage.getItem(this.RECENT_KEY)) || [];
    } catch { return []; }
  },

  _saveRecent: function (list) {
    try {
      localStorage.setItem(this.RECENT_KEY, JSON.stringify(list));
    } catch {}
  },

  _addRecent: function (id) {
    var list = this._getRecent();
    // Remove duplicate if exists
    var idx = list.indexOf(id);
    if (idx !== -1) list.splice(idx, 1);
    // Add to front
    list.unshift(id);
    // Trim to max
    if (list.length > this.MAX_RECENT) list = list.slice(0, this.MAX_RECENT);
    this._saveRecent(list);
    this._renderRecent();
  },

  _renderRecent: function () {
    var list = this._getRecent();
    var panel = this._cache.recentPanel;
    var listEl = this._cache.recentList;
    var toggle = this._cache.recentToggle;

    if (!listEl) return;

    // Show/hide toggle button based on whether there's history
    if (list.length === 0) {
      toggle.classList.remove('has-recent');
      panel.classList.remove('open');
      listEl.innerHTML = '';
      return;
    }
    toggle.classList.add('has-recent');

    // Build list
    var html = '';
    var self = this;
    list.forEach(function (id) {
      var tool = self.tools[id];
      if (!tool) return;
      // Find meta for icon and i18n title
      var icon = '';
      var title = tool.title || id;
      for (var i = 0; i < self.meta.length; i++) {
        if (self.meta[i].id === id) {
          icon = self.meta[i].icon || '';
          title = getToolTitle(self.meta[i]);
          break;
        }
      }
      html += '<div class="recent-item" data-id="' + id + '">' +
        '<span class="recent-item-icon">' + icon + '</span>' +
        '<span class="recent-item-name">' + title + '</span>' +
        '</div>';
    });
    listEl.innerHTML = html;
  },

  /* ---------- Draggable Recent Panel ---------- */
  _getPanelPos: function () {
    try {
      return JSON.parse(localStorage.getItem(this.POS_KEY));
    } catch { return null; }
  },
  _savePanelPos: function (left, top) {
    try {
      localStorage.setItem(this.POS_KEY, JSON.stringify({ left: left, top: top }));
    } catch {}
  },
  _clearPanelPos: function () {
    try { localStorage.removeItem(this.POS_KEY); } catch {}
  },
  _saveOpenState: function (open) {
    try { localStorage.setItem(this.OPEN_KEY, open ? '1' : '0'); } catch {}
  },
  _restoreOpenState: function () {
    try {
      var val = localStorage.getItem(this.OPEN_KEY);
      if (val === '1') {
        var panel = this._cache.recentPanel;
        var list = this._getRecent();
        if (list.length > 0) {
          panel.classList.add('open');
          this._applyPanelPos();
        }
      }
    } catch {}
  },
  _applyPanelPos: function () {
    var pos = this._getPanelPos();
    var panel = this._cache.recentPanel;
    if (pos && panel.classList.contains('open')) {
      // Validate position - reset if out of bounds
      var pw = 220, ph = 420;
      if (pos.left + pw < 20 || pos.left > window.innerWidth - 20 ||
          pos.top + ph < 20 || pos.top > window.innerHeight - 20 ||
          pos.left < 0 || pos.top < 0) {
        this._clearPanelPos();
        panel.style.left = '';
        panel.style.top = '';
        panel.style.right = '';
        return;
      }
      panel.style.left = pos.left + 'px';
      panel.style.top = pos.top + 'px';
      panel.style.right = 'auto';
    }
  },
  _initDraggable: function () {
    var self = this;
    var panel = this._cache.recentPanel;
    var handle = $id('recentDragHandle');
    // Apply saved position when panel opens
    var origToggle = this._toggleRecent;
    this._toggleRecent = function () {
      origToggle.call(self);
      if (panel.classList.contains('open')) {
        self._applyPanelPos();
      }
    };

    // Drag start
    function onStart(e) {
      if (e.button !== undefined && e.button !== 0) return; // left click only
      var pos = self._getPanelPos();
      if (!pos) {
        // First time: compute from current CSS position
        var rect = panel.getBoundingClientRect();
        pos = { left: rect.left, top: rect.top };
      }
      self._dragOffset.x = (e.clientX || e.touches[0].clientX) - pos.left;
      self._dragOffset.y = (e.clientY || e.touches[0].clientY) - pos.top;
      self._dragging = true;
      panel.style.left = pos.left + 'px';
      panel.style.top = pos.top + 'px';
      panel.style.right = 'auto';
      panel.style.transition = 'none';
      panel.classList.add('dragging');
      e.preventDefault();
    }

    function onMove(e) {
      if (!self._dragging) return;
      var cx = e.clientX || (e.touches && e.touches[0].clientX);
      var cy = e.clientY || (e.touches && e.touches[0].clientY);
      if (cx === undefined) return;
      var left = Math.max(0, cx - self._dragOffset.x);
      var top = Math.max(0, cy - self._dragOffset.y);
      // Keep within viewport bounds
      var mw = 260;
      var mh = 420;
      left = Math.min(left, window.innerWidth - mw);
      top = Math.min(top, window.innerHeight - mh);
      panel.style.left = left + 'px';
      panel.style.top = top + 'px';
      e.preventDefault();
    }

    function onEnd() {
      if (!self._dragging) return;
      self._dragging = false;
      panel.classList.remove('dragging');
      panel.style.transition = '';
      // Save position
      var left = parseInt(panel.style.left, 10);
      var top = parseInt(panel.style.top, 10);
      if (!isNaN(left) && !isNaN(top)) {
        self._savePanelPos(left, top);
      }
    }

    // Mouse events
    handle.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    // Handle mouse leaving the window while dragging
    window.addEventListener('blur', function onBlur() { if (self._dragging) onEnd(); });

    // Touch events
    handle.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  },

  /* ---------- Render Grid ---------- */
  _renderGrid: function (filterText, filterCat) {
    var grid = this._cache.toolsGrid;
    var search = (filterText || '').toLowerCase().trim();
    var cat = filterCat || 'all';
    var count = 0;
    var self = this;

    grid.innerHTML = '';
    var frag = document.createDocumentFragment();
    this.meta.forEach(function (t) {
      if (cat !== 'all' && t.category !== cat) return;
      var title = getToolTitle(t);
      var desc = getToolDesc(t);
      var catName = getToolCat(t);
      if (search && !title.toLowerCase().includes(search) && !desc.toLowerCase().includes(search) && !matchPinyin(search, title) && !matchPinyin(search, desc)) return;
      count++;
      var card = document.createElement('div');
      card.className = 'tool-card';
      card.style.animationDelay = String((count - 1) * 0.025) + 's';
      card.innerHTML = [
        '<span class="tool-card-icon">' + t.icon + '</span>',
        '<div class="tool-card-title">' + title + '</div>',
        '<div class="tool-card-desc">' + desc + '</div>',
        '<span class="tool-card-cat">' + catName + '</span>'
      ].join('');
      card.addEventListener('click', function (e) { e.stopPropagation(); self.openTool(t.id); });
      frag.appendChild(card);
    });
    grid.appendChild(frag);

    if (count === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-tertiary)">' + __('home.noMatch') + '</div>';
    }
    var countEl = qs('[data-i18n="home.tools.count"]');
    if (countEl) countEl.textContent = __('home.tools.count', count);
  },

  /* ---------- Open Tool ---------- */
  openTool: function (id) {
    var tool = this.tools[id];
    if (!tool) return;
    this._currentTool = tool;
    // Record to recent
    this._addRecent(id);
    this._cache.homeSection.style.display = 'none';
    this._cache.toolSection.style.display = 'block';
    this._cache.toolContainer.innerHTML = '';
    this._cache.toolContainer.appendChild(tool.render());
    location.hash = 'tool-' + id;
    window.scrollTo({ top: 0 });
    if (tool.init) tool.init();
  },

  /* ---------- Go Home ---------- */
  goHome: function () {
    if (this._currentTool && this._currentTool.destroy) this._currentTool.destroy();
    this._currentTool = null;
    this._cache.toolSection.style.display = 'none';
    this._cache.homeSection.style.display = 'block';
    location.hash = '';
    this._renderGrid(this._cache.searchInput.value, qs('.cat-btn.active')?.dataset.cat);
  },

  /* ---------- Recent Panel Toggle ---------- */
  _toggleRecent: function () {
    var panel = this._cache.recentPanel;
    if (panel.classList.contains('open')) {
      this._closeRecent();
    } else {
      // Close mobile menu if open
      this._closeMobileMenu();
      panel.classList.add('open');
      this._saveOpenState(true);
    }
  },

  _closeRecent: function () {
    var panel = this._cache.recentPanel;
    if (panel) {
      panel.classList.remove('open');
      this._saveOpenState(false);
    }
  },

  /* ---------- Toggle Mobile Menu ---------- */
  _toggleMobileMenu: function () {
    var panel = this._cache.mobileCatPanel;
    var overlay = this._cache.overlay;
    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
      overlay.classList.remove('open');
    } else {
      this._closeRecent();
      panel.classList.add('open');
      overlay.classList.add('open');
    }
  },

  _closeMobileMenu: function () {
    this._cache.mobileCatPanel.classList.remove('open');
    this._cache.overlay.classList.remove('open');
  },

  /* ---------- Events ---------- */
  _bindEvents: function () {
    var self = this;

    // Theme
    this._cache.themeToggle.addEventListener('click', function () { self._toggleTheme(); });

    // Language
    this._cache.langToggle.addEventListener('click', function () {
      var newLang = getLang() === 'en' ? 'zh-CN' : 'en';
      setLang(newLang);
      self._translateCats();
      self._renderGrid(self._cache.searchInput.value, qs('.cat-btn.active')?.dataset.cat);
      self._initMobileCategories();
      self._updateThemeIcons();
      if (self._currentTool) {
        self.openTool(self._currentTool.id);
      }
      // Re-render recent panel labels
      self._renderRecent();
    });

    document.addEventListener('langchange', function () {
      self._updateThemeIcons();
    });

    // Search
    this._cache.searchInput.addEventListener('input', debounce(function () {
      var active = qs('.cat-btn.active');
      self._renderGrid(self._cache.searchInput.value, active?.dataset.cat);
    }, 200));

    // Categories (desktop)
    this._cache.categoryFilter.addEventListener('click', function (e) {
      var btn = e.target.closest('.cat-btn');
      if (!btn) return;
      qsa('.cat-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      // If in a tool view, go home first (goHome will re-render with active category)
      if (self._currentTool) {
        self.goHome();
      } else {
        self._renderGrid(self._cache.searchInput.value, btn.dataset.cat);
      }
      var mobileBtns = qsa('.mobile-cat-inner .cat-btn');
      for (var i = 0; i < mobileBtns.length; i++) {
        mobileBtns[i].classList.toggle('active', mobileBtns[i].dataset.cat === btn.dataset.cat);
      }
    });

    // Categories (mobile)
    this._cache.mobileCatInner.addEventListener('click', function (e) {
      var btn = e.target.closest('.cat-btn');
      if (!btn) return;
      qsa('.cat-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      // If in a tool view, go home first
      if (self._currentTool) {
        self.goHome();
      } else {
        self._renderGrid(self._cache.searchInput.value, btn.dataset.cat);
      }
      var desktopBtns = qsa('.category-filter .cat-btn');
      for (var i = 0; i < desktopBtns.length; i++) {
        desktopBtns[i].classList.toggle('active', desktopBtns[i].dataset.cat === btn.dataset.cat);
      }
      self._closeMobileMenu();
    });

    // Mobile menu toggle
    this._cache.navMenuBtn.addEventListener('click', function () { self._toggleMobileMenu(); });

    // Overlay click to close
    this._cache.overlay.addEventListener('click', function () { self._closeMobileMenu(); });

    // Back
    this._cache.backBtn.addEventListener('click', function () { self.goHome(); });

    // Nav home - use direct reference
    this._cache.navBrand.addEventListener('click', function (e) {
      e.preventDefault();
      self.goHome();
    });

    // Recent toggle
    this._cache.recentToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      self._toggleRecent();
    });

    // Recent item click
    this._cache.recentList.addEventListener('click', function (e) {
      var item = e.target.closest('.recent-item');
      if (item) {
        self.openTool(item.dataset.id);
      }
    });

    // Recent clear
    this._cache.recentClear.addEventListener('click', function (e) {
      e.stopPropagation();
      self._saveRecent([]);
      self._renderRecent();
    });

    // Hash change
    window.addEventListener('hashchange', function () {
      if (!location.hash || !location.hash.startsWith('#tool-')) {
        if (self._cache.toolSection.style.display !== 'none') self.goHome();
      }
      self._closeMobileMenu();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { App.init(); });