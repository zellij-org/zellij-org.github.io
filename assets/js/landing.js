/* zellij.dev homepage: theme toggle, copy buttons, search, install tabs,
   the terminal demo with its guided try-it mode, and the status bar shortcuts. */
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

  /* Copy buttons */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.copy');
    if (!btn) return;
    function reset(label, ms) {
      btn.textContent = label;
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, ms);
    }
    function selectFallback() {
      var code = btn.parentElement.querySelector('code');
      if (code) {
        var r = document.createRange();
        r.selectNodeContents(code);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      reset('Selected', 2200);
    }
    try {
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        btn.classList.add('is-done');
        reset('Copied', 1600);
      }, selectFallback);
    } catch (err) { selectFallback(); }
  });

  /* Search: page titles from the docs, tutorials, news and site pages.
     Hugo builds the index (layouts/partials/landing/header.html); it loads on first open. */
  var searchBtn = $('searchBtn');
  var popular = [
    '/documentation/installation.html',
    '/tutorials/zellij-with-coding-agents/',
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
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
    searchBtn.addEventListener('pointerenter', loadIndex);
  }

  /* Install tabs, picked from the visitor's OS */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.os-tab'));
  function selectTab(id, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-os') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      $('panel-' + t.getAttribute('data-os')).hidden = !on;
      if (on && focus) t.focus();
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t.getAttribute('data-os')); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next.getAttribute('data-os'), true);
    });
  });
  if (tabs.length) selectTab(/win/.test(plat) ? 'windows' : isMac ? 'macos' : 'linux');

  /* Terminal demo: three agents; one asks for permission and is answered from the inbox */
  var term = $('term');
  var trying = false, visible = true;
  var startTry = null;
  if (term) {
    var panes = term.querySelectorAll('.tpane');
    var paneA = term.querySelector('.tp-a');
    var floatSeg = term.querySelector('.tseg-float');
    var stateEls = term.querySelectorAll('[data-states]');
    var chip = term.querySelector('.t-key');
    var states = [
      { key: '', focus: 'a', need: false, fl: false },
      { key: '', focus: 'a', need: true, fl: false },
      { key: 'Ctrl g  o  i', focus: 'fl', need: true, fl: true },
      { key: 'Alt Enter  1', focus: 'fl', need: false, fl: true },
      { key: 'Esc', focus: 'a', need: false, fl: false }
    ];
    var showChip = function (text) {
      chip.textContent = text;
      chip.hidden = false;
      chip.classList.remove('pop');
      void chip.offsetWidth;
      chip.classList.add('pop');
    };
    var render = function (i, quiet) {
      var s = states[i], id = String(i);
      Array.prototype.forEach.call(stateEls, function (el) {
        el.hidden = el.getAttribute('data-states').split(',').indexOf(id) === -1;
      });
      Array.prototype.forEach.call(panes, function (p) { p.classList.toggle('focused', p.getAttribute('data-pane') === s.focus); });
      paneA.classList.toggle('need', s.need);
      floatSeg.classList.toggle('on', s.fl);
      if (quiet) return;
      if (s.key) showChip(s.key); else chip.hidden = true;
    };
    var idx = 0, timer = null, paused = false;
    var step = function () {
      idx = (idx + 1) % states.length;
      if (idx === 0) {
        term.classList.add('resetting');
        setTimeout(function () { if (!trying) render(0); term.classList.remove('resetting'); }, 260);
      } else {
        render(idx);
      }
    };
    var sync = function () {
      clearInterval(timer);
      timer = null;
      if (!trying && !paused && visible) timer = setInterval(step, 2600);
    };
    var toggle = $('termToggle');
    var setPaused = function (p) {
      paused = p;
      toggle.textContent = p ? 'Play' : 'Pause';
      toggle.setAttribute('aria-pressed', p ? 'true' : 'false');
      sync();
    };
    toggle.addEventListener('click', function () { setPaused(!paused); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }).observe(term);
    }
    if (reduce) { idx = 2; render(2); setPaused(true); }
    else { render(0); setPaused(false); }

    /* Try it yourself: the same scenes, driven by the real keys (or taps) */
    var fig = $('tryit');
    var cap = $('termCap');
    var guide = $('termGuide');
    var gStep = $('guideStep');
    var gText = $('guideText');
    var gRow = $('guideRow');
    var gKeys = $('guideKeys');
    var gHint = $('guideHint');
    var gEnd = $('guideEnd');
    var tryBtn = $('termTry');
    var steps = [
      { done: 2, keys: ['Ctrl g', 'o', 'i'],
        text: 'The api agent needs you. Open the inbox:',
        hint: 'Ctrl g unlocks Zellij, o opens session mode and i opens the inbox. On a phone, tap the keys.' },
      { done: 3, keys: ['Alt Enter', '1'],
        text: 'Answer it from the preview, without leaving the inbox:',
        hint: (isMac ? 'Option Enter' : 'Alt Enter') + ' types into the agent, and 1 picks "Allow once".' },
      { done: 4, keys: ['Esc'],
        text: 'The tests are running. Close the inbox:',
        hint: 'You never left your tab, and the other two agents kept working.' }
    ];
    var gi = 0, ki = 0;

    var paintKeys = function () {
      Array.prototype.forEach.call(gKeys.querySelectorAll('.g-key'), function (b, i) {
        b.classList.toggle('is-done', i < ki);
        b.classList.toggle('is-next', i === ki);
      });
    };
    var press;
    var showStep = function () {
      gHint.classList.remove('is-warn');
      gKeys.innerHTML = '';
      if (gi >= steps.length) {
        gStep.textContent = 'Done';
        gText.textContent = 'The tests passed, and the docs agent finished while you were answering. That is the inbox.';
        gRow.hidden = true;
        gEnd.hidden = false;
        return;
      }
      var s = steps[gi];
      gStep.textContent = 'Step ' + (gi + 1) + ' of ' + steps.length;
      gText.textContent = s.text;
      gHint.textContent = s.hint;
      gRow.hidden = false;
      gEnd.hidden = true;
      s.keys.forEach(function (k, i) {
        if (i) {
          var then = document.createElement('span');
          then.className = 'g-then';
          then.textContent = 'then';
          gKeys.appendChild(then);
        }
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'g-key';
        b.textContent = k;
        b.addEventListener('click', function () { press(k); });
        gKeys.appendChild(b);
      });
      paintKeys();
    };
    press = function (name) {
      if (!trying || gi >= steps.length) return;
      var s = steps[gi];
      if (name === s.keys[ki]) {
        ki++;
        showChip(s.keys.slice(0, ki).join('  '));
        gHint.classList.remove('is-warn');
        gHint.textContent = s.hint;
        paintKeys();
        if (ki === s.keys.length) {
          render(s.done, true);
          gi++;
          ki = 0;
          showStep();
        }
      } else {
        var next = gKeys.querySelectorAll('.g-key')[ki];
        if (next) {
          next.classList.remove('is-wrong');
          void next.offsetWidth;
          next.classList.add('is-wrong');
        }
        gHint.classList.add('is-warn');
        gHint.textContent = 'Not quite. Press ' + s.keys[ki] + ' next.';
      }
    };
    /* The demo floats centered and wide while you try it; the slot keeps its space in the hero */
    var slot = $('termSlot');
    var scrim = $('tryScrim');
    var floatOpen = function () {
      if (fig.classList.contains('is-floating')) return;
      slot.style.minHeight = fig.offsetHeight + 'px';
      fig.classList.add('is-floating');
      fig.setAttribute('role', 'dialog');
      fig.setAttribute('aria-modal', 'true');
      fig.setAttribute('aria-label', 'Try Zellij');
      scrim.hidden = false;
      root.classList.add('is-trying');
    };
    var floatClose = function () {
      fig.classList.remove('is-floating');
      fig.removeAttribute('role');
      fig.removeAttribute('aria-modal');
      fig.removeAttribute('aria-label');
      scrim.hidden = true;
      root.classList.remove('is-trying');
      slot.style.minHeight = '';
    };
    startTry = function () {
      floatOpen();
      trying = true;
      sync();
      term.classList.remove('resetting');
      term.classList.add('trying');
      gi = 0;
      ki = 0;
      render(1, true);
      chip.hidden = true;
      cap.hidden = true;
      guide.hidden = false;
      showStep();
      guide.focus({ preventScroll: true });
    };
    var stopTry = function () {
      trying = false;
      term.classList.remove('trying');
      guide.hidden = true;
      cap.hidden = false;
      idx = reduce ? 2 : 0;
      render(idx);
      sync();
      floatClose();
      tryBtn.focus({ preventScroll: true });
    };
    var keyName = function (e) {
      var k = e.key || '';
      if (/^(Control|Shift|Alt|Meta|AltGraph|CapsLock)$/.test(k)) return null;
      if (e.ctrlKey && !e.altKey && !e.metaKey && k.toLowerCase() === 'g') return 'Ctrl g';
      if (e.altKey && !e.ctrlKey && !e.metaKey && k === 'Enter') return 'Alt Enter';
      if (e.ctrlKey || e.altKey || e.metaKey) return null;
      if (k === 'Escape') return 'Esc';
      if (k === 'Enter') return 'Enter';
      return k.length === 1 ? k.toLowerCase() : null;
    };
    /* Capture phase, so the page's own shortcuts (i, Ctrl g...) don't fire while you play */
    window.addEventListener('keydown', function (e) {
      if (!trying || !visible || document.querySelector('dialog[open]')) return;
      var t = e.target;
      if (inField(t)) return;
      /* Keep Tab inside the floating panel */
      if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(fig.querySelectorAll('button, a[href]'), function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1], at = document.activeElement;
        if (e.shiftKey && (at === first || at === guide)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
        return;
      }
      var name = keyName(e);
      if (!name) return;
      if ((name === 'Enter' || name === ' ') && t && t.closest && t.closest('button, a')) return;
      e.preventDefault();
      e.stopPropagation();
      /* Esc closes what's on top: the inbox when that's the step, otherwise the floating demo */
      if (name === 'Esc' && (gi >= steps.length || steps[gi].keys[ki] !== 'Esc')) { stopTry(); return; }
      if (gi >= steps.length) return;
      press(name);
    }, true);
    scrim.addEventListener('click', stopTry);
    tryBtn.addEventListener('click', startTry);
    $('guideExit').addEventListener('click', stopTry);
    $('guideAgain').addEventListener('click', startTry);
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
    var sbTry = bar.querySelector('[data-action="try"]');
    if (sbTry) sbTry.addEventListener('click', function () { if (startTry) startTry(); });

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
