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

  var starEl = document.querySelector('[data-stars]');
  if (starEl && window.fetch) {
    var fmt = function (n) { return n >= 1000 ? (Math.round(n / 100) / 10).toFixed(1) + 'k' : String(n); };
    var show = function (n) {
      var t = fmt(n);
      starEl.textContent = t;
      var link = starEl.closest('a');
      if (link) link.setAttribute('aria-label', 'Zellij on GitHub, ' + t + ' stars');
    };
    var cached = null;
    try { cached = JSON.parse(store.get('zj-stars') || 'null'); } catch (e) {}
    if (cached && typeof cached.n === 'number') show(cached.n);
    var next = cached ? (cached.retry || cached.t + 6 * 3600 * 1000) : 0;
    var later = function (until) {
      store.set('zj-stars', JSON.stringify({ n: cached && cached.n, t: Date.now(), retry: until }));
    };
    if (Date.now() >= next) {
      fetch('https://api.github.com/repos/zellij-org/zellij', { headers: { Accept: 'application/vnd.github+json' } })
        .then(function (r) {
          if (r.ok) return r.json();
          var reset = +r.headers.get('X-RateLimit-Reset') * 1000;
          later(reset > Date.now() ? reset : Date.now() + 3600 * 1000);
          return null;
        })
        .then(function (d) {
          if (!d || typeof d.stargazers_count !== 'number') return;
          store.set('zj-stars', JSON.stringify({ n: d.stargazers_count, t: Date.now() }));
          show(d.stargazers_count);
        })
        .catch(function () { later(Date.now() + 3600 * 1000); });
    }
  }

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
    Array.prototype.forEach.call(bar.querySelectorAll('.seg[data-key]'), function (b) { keymap[b.getAttribute('data-key')] = b; });

    /* Section shortcuts. The one for the section being read is lit: the first section still at least half on screen
       (or filling half the screen, for one taller than it), and the last one at the end of the page.
       A clicked shortcut stays lit until the visitor scrolls, even when its section can't scroll up to the top. */
    var spots = Array.prototype.slice.call(bar.querySelectorAll('.seg[data-target]'))
      .map(function (b) { return { b: b, el: $(b.getAttribute('data-target')) }; })
      .filter(function (s) { return s.el; });
    var pinned = false, spyQueued = false;
    var light = function (b) { spots.forEach(function (s) { s.b.classList.toggle('is-active', s.b === b); }); };
    var spy = function () {
      spyQueued = false;
      if (pinned) return;
      var h = window.innerHeight - bar.offsetHeight, last = spots.length - 1, i = -1, j;
      var shown = spots.map(function (s) {
        var r = s.el.getBoundingClientRect();
        return Math.max(0, Math.min(r.bottom, h) - Math.max(r.top, 0)) / Math.min(r.height, h);
      });
      if (shown[last] >= 0.5 && document.documentElement.scrollHeight - window.innerHeight - window.scrollY < 2) i = last;
      for (j = 0; i < 0 && j <= last; j++) if (shown[j] >= 0.5) i = j;
      /* Between two big sections, neither half on screen: the one showing more */
      for (j = 0; j <= last; j++) if (shown[j] > 0 && (i < 0 || (shown[i] < 0.5 && shown[j] > shown[i]))) i = j;
      light(i < 0 ? null : spots[i].b);
    };
    var spySoon = function () { if (!spyQueued) { spyQueued = true; window.requestAnimationFrame(spy); } };
    var unpin = function () { pinned = false; };
    spots.forEach(function (s) {
      s.b.addEventListener('click', function () {
        pinned = true;
        light(s.b);
        s.el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
    if (spots.length) {
      window.addEventListener('scroll', spySoon, { passive: true });
      window.addEventListener('resize', spySoon);
      ['wheel', 'touchstart', 'mousedown'].forEach(function (t) { window.addEventListener(t, unpin, { passive: true }); });
      window.addEventListener('keydown', function (e) { if (/^(Arrow(Up|Down)|Page(Up|Down)|Home|End| )$/.test(e.key)) unpin(); });
      spy();
    }
    /* Page actions: TOP on most pages. Page scripts can add their own to zj.actions. */
    zj.actions.top = function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); };
    Array.prototype.forEach.call(bar.querySelectorAll('[data-action]:not([data-action="lock"])'), function (b) {
      b.addEventListener('click', function () { var fn = zj.actions[b.getAttribute('data-action')]; if (fn) fn(); });
    });

    /* Locked, like Zellij's locked mode: only UNLOCK answers, to a click or Ctrl g. The shortcuts can't be clicked, focused or typed. */
    var lockBtn = bar.querySelector('[data-action="lock"]');
    var sbSegs = bar.querySelector('.sb-segs');
    var sbLabel = $('sbLabel');
    var sbName = sbLabel ? sbLabel.textContent : '';
    setLock = function (on) {
      locked = on;
      bar.classList.toggle('is-locked', on);
      if (sbSegs) sbSegs.inert = on;
      lockBtn.classList.toggle('is-active', on);
      lockBtn.querySelector('.seg-text').textContent = on ? 'UNLOCK' : 'LOCK';
      if (sbLabel) sbLabel.textContent = on ? 'LOCKED' : sbName;
    };
    if (lockBtn) lockBtn.addEventListener('click', function () { setLock(!locked); });

    /* A shortcut clicked with the mouse doesn't keep the focus, or the next key pressed would show it in focus blue,
       next to the green of the section shortcut lit, and Space would press it again instead of scrolling. */
    bar.addEventListener('click', function (e) {
      var a = document.activeElement;
      if (e.detail > 0 && a && bar.contains(a)) a.blur();
    });
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
    /* The same for a shortcut tabbed to before, when another one is typed */
    if (bar.contains(document.activeElement)) document.activeElement.blur();
    b.click();
  });
})();
