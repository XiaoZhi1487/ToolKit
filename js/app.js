// ToolKit :: Core Application

const App = {
  tools: window.tools,
  meta: window.toolMeta,
  _currentTool: null,

  init() {
    this._cache = {
      homeSection: $id('homeSection'),
      toolSection: $id('toolSection'),
      toolsGrid: $id('toolsGrid'),
      toolContainer: $id('toolContainer'),
      searchInput: $id('searchInput'),
      categoryFilter: $id('categoryFilter'),
      backBtn: $id('backBtn'),
      themeToggle: $id('themeToggle'),
      toolCount: $id('toolCount'),
      navMenuBtn: $id('navMenuBtn'),
    };

    this._initTheme();
    this._initCategories();
    this._renderGrid();
    this._bindEvents();

    // Auto-filter from URL hash
    if (location.hash && location.hash.startsWith('#tool-')) {
      const id = location.hash.slice(6);
      this.openTool(id);
    }
  },

  /* ---------- Theme ---------- */
  _initTheme() {
    const stored = localStorage.getItem('tk-theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    }
    this._updateThemeIcons();
  },

  _toggleTheme() {
    const html = document.documentElement;
    const cur = html.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('tk-theme', next);
    this._updateThemeIcons();
  },

  _updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sun = qs('.sun-icon');
    const moon = qs('.moon-icon');
    if (sun) sun.style.display = isDark ? 'block' : 'none';
    if (moon) moon.style.display = isDark ? 'none' : 'block';
    if (!isDark) { if (sun) sun.style.display = 'block'; if (moon) moon.style.display = 'none'; }
  },

  /* ---------- Categories ---------- */
  _initCategories() {
    const cats = new Set();
    this.meta.forEach(t => cats.add(t.category));
    const filter = this._cache.categoryFilter;
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn';
      btn.dataset.cat = cat;
      btn.textContent = cat;
      filter.appendChild(btn);
    });
  },

  /* ---------- Render Grid ---------- */
  _renderGrid(filterText, filterCat) {
    const grid = this._cache.toolsGrid;
    const search = (filterText || '').toLowerCase().trim();
    const cat = filterCat || 'all';
    let count = 0;

    grid.innerHTML = '';
    this.meta.forEach(t => {
      if (cat !== 'all' && t.category !== cat) return;
      if (search && !t.title.toLowerCase().includes(search) && !t.description.toLowerCase().includes(search)) return;
      count++;
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.style.animationDelay = `${count * 0.04}s`;
      card.innerHTML = `
        <span class="tool-card-icon">${t.icon}</span>
        <div class="tool-card-title">${t.title}</div>
        <div class="tool-card-desc">${t.description}</div>
        <span class="tool-card-cat">${t.category}</span>
      `;
      card.addEventListener('click', () => this.openTool(t.id));
      grid.appendChild(card);
    });

    if (count === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-tertiary)">没有找到匹配的工具</div>';
    }
    if (this._cache.toolCount) this._cache.toolCount.textContent = count;
  },

  /* ---------- Open Tool ---------- */
  openTool(id) {
    const tool = this.tools[id];
    if (!tool) return;
    this._currentTool = tool;
    this._cache.homeSection.style.display = 'none';
    this._cache.toolSection.style.display = 'block';
    this._cache.toolContainer.innerHTML = '';
    this._cache.toolContainer.appendChild(tool.render());
    location.hash = `tool-${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tool.init) tool.init();
  },

  /* ---------- Go Home ---------- */
  goHome() {
    if (this._currentTool && this._currentTool.destroy) this._currentTool.destroy();
    this._currentTool = null;
    this._cache.toolSection.style.display = 'none';
    this._cache.homeSection.style.display = 'block';
    location.hash = '';
    this._renderGrid(this._cache.searchInput.value, qs('.cat-btn.active')?.dataset.cat);
  },

  /* ---------- Events ---------- */
  _bindEvents() {
    // Theme
    this._cache.themeToggle.addEventListener('click', () => this._toggleTheme());

    // Search
    this._cache.searchInput.addEventListener('input', debounce(() => {
      const active = qs('.cat-btn.active');
      this._renderGrid(this._cache.searchInput.value, active?.dataset.cat);
    }, 200));

    // Categories
    this._cache.categoryFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      qsa('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this._renderGrid(this._cache.searchInput.value, btn.dataset.cat);
    });

    // Back
    this._cache.backBtn.addEventListener('click', () => this.goHome());

    // Nav home
    qs('.nav-brand').addEventListener('click', (e) => {
      e.preventDefault();
      this.goHome();
    });

    // Hash change
    window.addEventListener('hashchange', () => {
      if (!location.hash || !location.hash.startsWith('#tool-')) {
        if (this._cache.toolSection.style.display !== 'none') this.goHome();
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
