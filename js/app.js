// ToolKit :: Core Application

var App = {
  tools: window.tools,
  meta: window.toolMeta,
  _currentTool: null,

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
      toolCount: $id('toolCount'),
      navMenuBtn: $id('navMenuBtn'),
      mobileCatPanel: $id('mobileCatPanel'),
      mobileCatInner: $id('mobileCatInner'),
      overlay: $id('overlay'),
    };

    // Init i18n first
    initLang();

    this._initTheme();
    this._initCategories();
    this._initMobileCategories();
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
    // Update aria-label for theme toggle
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

  /* ---------- Mobile Categories ---------- */
  _initMobileCategories: function () {
    var inner = this._cache.mobileCatInner;
    // Clone desktop category buttons into mobile panel
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

  /* ---------- Render Grid ---------- */
  _renderGrid: function (filterText, filterCat) {
    var grid = this._cache.toolsGrid;
    var search = (filterText || '').toLowerCase().trim();
    var cat = filterCat || 'all';
    var count = 0;
    var self = this;

    grid.innerHTML = '';
    this.meta.forEach(function (t) {
      if (cat !== 'all' && t.category !== cat) return;
      var title = getToolTitle(t);
      var desc = getToolDesc(t);
      var catName = getToolCat(t);
      if (search && !title.toLowerCase().includes(search) && !desc.toLowerCase().includes(search)) return;
      count++;
      var card = document.createElement('div');
      card.className = 'tool-card';
      card.style.animationDelay = String(count * 0.04) + 's';
      card.innerHTML = [
        '<span class="tool-card-icon">' + t.icon + '</span>',
        '<div class="tool-card-title">' + title + '</div>',
        '<div class="tool-card-desc">' + desc + '</div>',
        '<span class="tool-card-cat">' + catName + '</span>'
      ].join('');
      card.addEventListener('click', function () { self.openTool(t.id); });
      grid.appendChild(card);
    });

    if (count === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-tertiary)">' + __('home.noMatch') + '</div>';
    }
    if (this._cache.toolCount) {
      this._cache.toolCount.textContent = String(count);
    }
    // Update the i18n count text
    var countEl = qs('[data-i18n="home.tools.count"]');
    if (countEl) countEl.textContent = __('home.tools.count', count);
  },

  /* ---------- Open Tool ---------- */
  openTool: function (id) {
    var tool = this.tools[id];
    if (!tool) return;
    this._currentTool = tool;
    this._cache.homeSection.style.display = 'none';
    this._cache.toolSection.style.display = 'block';
    this._cache.toolContainer.innerHTML = '';
    this._cache.toolContainer.appendChild(tool.render());
    location.hash = 'tool-' + id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  /* ---------- Toggle Mobile Menu ---------- */
  _toggleMobileMenu: function () {
    var panel = this._cache.mobileCatPanel;
    var overlay = this._cache.overlay;
    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
      overlay.classList.remove('open');
    } else {
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
      // Re-translate category filter buttons
      self._translateCats();
      // Re-render grid to update tool titles/descriptions using new language
      self._renderGrid(self._cache.searchInput.value, qs('.cat-btn.active')?.dataset.cat);
      // Sync mobile category buttons
      self._initMobileCategories();
      // Update theme icon aria-label
      self._updateThemeIcons();
      // Re-open current tool to refresh its content with new language
      if (self._currentTool) {
        self.openTool(self._currentTool.id);
      }
    });

    // Listen for language changes to update tool count and dynamic text
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
      self._renderGrid(self._cache.searchInput.value, btn.dataset.cat);
      // Sync mobile active state
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
      // Sync desktop active state
      var desktopBtns = qsa('.category-filter .cat-btn');
      for (var i = 0; i < desktopBtns.length; i++) {
        desktopBtns[i].classList.toggle('active', desktopBtns[i].dataset.cat === btn.dataset.cat);
      }
      self._renderGrid(self._cache.searchInput.value, btn.dataset.cat);
      self._closeMobileMenu();
    });

    // Mobile menu toggle
    this._cache.navMenuBtn.addEventListener('click', function () { self._toggleMobileMenu(); });

    // Overlay click to close
    this._cache.overlay.addEventListener('click', function () { self._closeMobileMenu(); });

    // Back
    this._cache.backBtn.addEventListener('click', function () { self.goHome(); });

    // Nav home
    qs('.nav-brand').addEventListener('click', function (e) {
      e.preventDefault();
      self.goHome();
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