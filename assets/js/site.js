/* zellij.dev, every page: theme toggle, copy buttons, search and the status bar shortcuts.
   Page scripts (landing.js) are appended after this file and use window.zj. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  };
  var plat = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '').toLowerCase();
  var isMac = /mac|iphone|ipad/.test(plat);
  function inField(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  function $(id) { return document.getElementById(id); }
  /* Shared with page scripts. They add status bar actions to zj.actions (data-action="name"). */
  var zj = window.zj = { $: $, root: root, reduce: reduce, plat: plat, isMac: isMac, inField: inField, actions: {} };

  /* Theme: the system setting until the visitor picks one */
  var themeBtn = $('themeBtn');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  function theme() { return root.getAttribute('data-theme') || (mq && mq.matches ? 'light' : 'dark'); }
  function paintTheme() {
    if (!themeBtn) return;
    var t = theme(), label = t === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    themeBtn.setAttribute('data-mode', t);
    themeBtn.setAttribute('aria-label', label);
    themeBtn.title = label;
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = theme() === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      store.set('zj-theme', next);
      paintTheme();
    });
  }
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', paintTheme);
    else if (mq.addListener) mq.addListener(paintTheme);
  }
  paintTheme();

  /* Copy buttons: the text in data-copy, or else the code block next to the button */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.copy');
    if (!btn) return;
    var src = btn.parentElement.querySelector('code');
    var text = btn.hasAttribute('data-copy') ? btn.getAttribute('data-copy') : src ? src.textContent.replace(/\n$/, '') : '';
    function reset(label, ms) {
      btn.textContent = label;
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, ms);
    }
    function selectFallback() {
      if (src) {
        var r = document.createRange();
        r.selectNodeContents(src);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      reset('Selected', 2200);
    }
    try {
      navigator.clipboard.writeText(text).then(function () {
        btn.classList.add('is-done');
        reset('Copied', 1600);
      }, selectFallback);
    } catch (err) { selectFallback(); }
  });

  /* Search: page titles from the docs, tutorials, news and site pages.
     Hugo builds the index (layouts/partials/site/header.html); it loads on first open. */
  var searchBtn = $('searchBtn');
  var popular = [
    '/documentation/installation.html',
    '/agents/',
    '/documentation/inbox.html',
    '/documentation/keybinding-presets.html',
    '/documentation/layouts.html',
    '/documentation/web-client.html'
  ];
  var pages = null, loading = null;
  var dlg = null, input, list, hits = [], active = 0;

  function loadIndex() {
    if (pages || loading || !searchBtn) return loading;
    loading = fetch(searchBtn.getAttribute('data-index'))
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (d) { pages = d || []; if (dlg && dlg.open) update(); })
      .catch(function () { pages = []; if (dlg && dlg.open) update(); });
    return loading;
  }
  function buildSearch() {
    dlg = document.createElement('dialog');
    dlg.className = 'search-dlg';
    dlg.setAttribute('aria-label', 'Search the docs');
    dlg.innerHTML =
      '<div class="search-field"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input type="search" placeholder="Search docs, tutorials and news" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="searchList" aria-autocomplete="list" aria-label="Search">' +
      '<button class="search-close" type="button">Esc</button></div>' +
      '<ul class="search-list" id="searchList" role="listbox" aria-label="Results"></ul>' +
      '<div class="search-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>';
    document.body.appendChild(dlg);
    input = dlg.querySelector('input');
    list = dlg.querySelector('.search-list');
    input.addEventListener('input', update);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!hits.length) return;
        active = (active + (e.key === 'ArrowDown' ? 1 : hits.length - 1)) % hits.length;
        paintActive();
      } else if (e.key === 'Enter' && hits[active]) {
        e.preventDefault();
        window.location.href = hits[active].u;
      }
    });
    dlg.querySelector('.search-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (searchBtn) searchBtn.focus(); });
  }
  function score(p, words) {
    var title = p.t.toLowerCase(), hay = (p.t + ' ' + p.k + ' ' + p.u + ' ' + (p.d || '')).toLowerCase(), s = 0;
    for (var i = 0; i < words.length; i++) {
      if (hay.indexOf(words[i]) === -1) return 0;
      s += title.indexOf(words[i]) === 0 ? 4 : title.indexOf(words[i]) > -1 ? 3 : 1;
    }
    return s;
  }
  function message(text) {
    var li = document.createElement('li');
    li.className = 'search-empty';
    li.setAttribute('role', 'presentation');
    li.textContent = text;
    list.appendChild(li);
    input.removeAttribute('aria-activedescendant');
  }
  function update() {
    var q = input.value.trim().toLowerCase(), cap;
    active = 0;
    list.innerHTML = '';
    if (!pages) { message('Loading…'); return; }
    if (!q) {
      hits = popular.map(function (u) { return pages.filter(function (p) { return p.u === u; })[0]; }).filter(Boolean);
      cap = 'Popular';
    } else {
      var words = q.split(/\s+/);
      hits = pages.map(function (p, i) { return { p: p, s: score(p, words), i: i }; })
        .filter(function (h) { return h.s > 0; })
        .sort(function (a, b) { return b.s - a.s || a.i - b.i; })
        .slice(0, 8)
        .map(function (h) { return h.p; });
      cap = 'Results';
    }
    if (!hits.length) { message(q ? 'No page titles match "' + input.value.trim() + '".' : 'Type to search.'); return; }
    var c = document.createElement('li');
    c.className = 'search-cap';
    c.setAttribute('role', 'presentation');
    c.textContent = cap;
    list.appendChild(c);
    hits.forEach(function (p, i) {
      var li = document.createElement('li'), a = document.createElement('a'), main = document.createElement('span');
      var b = document.createElement('b'), path = document.createElement('span'), kind = document.createElement('span');
      li.className = 'search-hit';
      li.id = 'sh-' + i;
      li.setAttribute('role', 'option');
      a.href = p.u;
      a.tabIndex = -1;
      main.className = 'sh-main';
      b.textContent = p.t;
      path.className = 'sh-path';
      path.textContent = p.u.replace(/^https:\/\//, '');
      kind.className = 'sh-kind';
      kind.textContent = p.k;
      main.appendChild(b);
      main.appendChild(path);
      a.appendChild(main);
      a.appendChild(kind);
      a.addEventListener('mousemove', function () { if (active !== i) { active = i; paintActive(); } });
      li.appendChild(a);
      list.appendChild(li);
    });
    paintActive();
  }
  function paintActive() {
    Array.prototype.forEach.call(list.querySelectorAll('.search-hit'), function (li, i) {
      li.setAttribute('aria-selected', i === active ? 'true' : 'false');
      if (i === active) {
        input.setAttribute('aria-activedescendant', li.id);
        if (li.scrollIntoView) li.scrollIntoView({ block: 'nearest' });
      }
    });
  }
  function openSearch() {
    if (!searchBtn) return;
    if (!dlg) buildSearch();
    if (dlg.open) return;
    loadIndex();
    input.value = '';
    update();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    input.focus();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.search-key'), function (k) { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });
  /* Other search buttons, like the one on the 404 page */
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-search]')) openSearch(); });
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
    searchBtn.addEventListener('pointerenter', loadIndex);
  }

  /* Panes: like Zellij with mouse focus, the pane under the pointer, or holding keyboard focus, is the focused one.
     On touch screens, it's the pane crossing the middle of the screen. */
  var paneEls = document.querySelectorAll('.pane');
  function focusPane(p) {
    if (!p || p.classList.contains('is-focus')) return;
    Array.prototype.forEach.call(paneEls, function (x) { x.classList.toggle('is-focus', x === p); });
  }
  if (paneEls.length) {
    if (!document.querySelector('.pane.is-focus')) paneEls[0].classList.add('is-focus');
    document.addEventListener('pointerover', function (e) {
      if (e.pointerType !== 'touch') focusPane(e.target.closest && e.target.closest('.pane'));
    });
    document.addEventListener('focusin', function (e) { focusPane(e.target.closest && e.target.closest('.pane')); });
    if (window.matchMedia && window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
      var middle = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) focusPane(en.target); });
      }, { rootMargin: '-50% 0px -50% 0px' });
      Array.prototype.forEach.call(paneEls, function (p) { if (!p.parentElement.closest('.pane')) middle.observe(p); });
    }
  }

  /* Status bar: single-key shortcuts, like Zellij's own status bar. Ctrl g locks them. */
  var bar = $('statusbar');
  var locked = false, keymap = {}, setLock = null;
  if (bar) {
    var navSegs = Array.prototype.slice.call(bar.querySelectorAll('.seg[data-target]'));
    Array.prototype.forEach.call(bar.querySelectorAll('.seg[data-key]'), function (b) { keymap[b.getAttribute('data-key')] = b; });
    navSegs.forEach(function (b) {
      b.addEventListener('click', function () {
        var el = $(b.getAttribute('data-target'));
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
    /* Page actions: TRY IT on the homepage (landing.js), TOP everywhere */
    zj.actions.top = function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); };
    Array.prototype.forEach.call(bar.querySelectorAll('[data-action]:not([data-action="lock"])'), function (b) {
      b.addEventListener('click', function () { var fn = zj.actions[b.getAttribute('data-action')]; if (fn) fn(); });
    });

    var lockBtn = bar.querySelector('[data-action="lock"]');
    var sbLabel = $('sbLabel');
    var sbName = sbLabel ? sbLabel.textContent : '';
    setLock = function (on) {
      locked = on;
      bar.classList.toggle('is-locked', on);
      lockBtn.classList.toggle('is-active', on);
      lockBtn.querySelector('.seg-text').textContent = on ? 'UNLOCK' : 'LOCK';
      if (sbLabel) sbLabel.textContent = on ? 'LOCKED' : sbName;
    };
    if (lockBtn) lockBtn.addEventListener('click', function () { setLock(!locked); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          navSegs.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-target') === en.target.id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      navSegs.forEach(function (b) {
        var el = $(b.getAttribute('data-target'));
        if (el) io.observe(el);
      });
    }
  }

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      if (!searchBtn) return;
      e.preventDefault();
      openSearch();
      return;
    }
    if (inField(e.target) || (dlg && dlg.open)) return;
    if (setLock && e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey && (e.key === 'g' || e.key === 'G')) {
      e.preventDefault();
      setLock(!locked);
      return;
    }
    if (locked || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === '/' && searchBtn) {
      e.preventDefault();
      openSearch();
      return;
    }
    var b = keymap[(e.key || '').toLowerCase()];
    if (!b) return;
    e.preventDefault();
    b.click();
  });
})();
