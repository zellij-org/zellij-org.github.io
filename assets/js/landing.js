/* zellij.dev landing pages (the homepage and Agents): install tabs, and the demos with their guided "Try it yourself".
   Runs after site.js, which provides window.zj. */
(function (zj) {
  var $ = zj.$, root = zj.root, reduce = zj.reduce, plat = zj.plat, isMac = zj.isMac, inField = zj.inField;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

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

  /* Demos (layouts/partials/demo/demo.html). Each plays its scenes in a loop; the scenes, steps and text come from
     data/demos/<name>.yaml through data-config. "Try it yourself" floats the demo above the page and plays it again
     with the real keys (or taps). A "peek" only shows one scene, still. */
  var scrim = null, current = null;
  function getScrim() {
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.className = 'try-scrim';
      scrim.hidden = true;
      scrim.addEventListener('click', function () { if (current) current.stop(); });
      document.body.appendChild(scrim);
    }
    return scrim;
  }
  /* The name of a key press, as written in the steps: "Ctrl g", "Alt Enter", "Alt f", "Esc", "1" */
  function keyName(e) {
    var k = e.key || '';
    if (/^(Control|Shift|Alt|Meta|AltGraph|CapsLock)$/.test(k)) return null;
    if (e.ctrlKey && !e.altKey && !e.metaKey && k.toLowerCase() === 'g') return 'Ctrl g';
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      if (k === 'Enter') return 'Alt Enter';
      /* By the physical key, since Option + a letter types another character on a Mac */
      if (/^Key[A-Z]$/.test(e.code || '')) return 'Alt ' + e.code.slice(3).toLowerCase();
      return null;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) return null;
    if (k === 'Escape') return 'Esc';
    if (k === 'Enter') return 'Enter';
    return k.length === 1 ? k.toLowerCase() : null;
  }

  function Demo(el) {
    var cfg = JSON.parse(el.getAttribute('data-config'));
    var states = cfg.states, steps = cfg.steps || [];
    var term = el.querySelector('.term');
    var chip = term.querySelector('.t-key');
    var panes = term.querySelectorAll('.tpane[data-pane]');
    /* Every class a scene can add, so each scene also turns off the ones it doesn't */
    var managed = [];
    states.forEach(function (s) {
      Object.keys(s.set || {}).forEach(function (sel) {
        String(s.set[sel]).split(/\s+/).forEach(function (cls) {
          if (!managed.some(function (m) { return m.sel === sel && m.cls === cls; })) managed.push({ sel: sel, cls: cls, els: term.querySelectorAll(sel) });
        });
      });
    });
    function sets(s, m) { return !!(s.set && s.set[m.sel] && String(s.set[m.sel]).split(/\s+/).indexOf(m.cls) > -1); }
    function showChip(text) {
      chip.textContent = text;
      chip.hidden = false;
      chip.classList.remove('pop');
      void chip.offsetWidth;
      chip.classList.add('pop');
    }
    function render(i, quiet) {
      var s = states[i];
      term.setAttribute('data-state', i);
      each(panes, function (p) { p.classList.toggle('focused', p.getAttribute('data-pane') === s.focus); });
      managed.forEach(function (m) { var on = sets(s, m); each(m.els, function (x) { x.classList.toggle(m.cls, on); }); });
      if (quiet) return;
      if (s.key) showChip(s.key); else chip.hidden = true;
    }

    if (el.hasAttribute('data-peek')) { render(+el.getAttribute('data-peek'), true); return null; }

    var trying = false, visible = true, paused = false, idx = 0, timer = null;
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
    var toggle = el.querySelector('.demo-pause');
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
    if (reduce) { idx = cfg.reduced; render(idx); setPaused(true); }
    else { render(0); setPaused(false); }

    /* Try it yourself */
    var cap = el.querySelector('.term-cap');
    var guide = el.querySelector('.guide');
    var gStep = el.querySelector('.guide-step');
    var gText = el.querySelector('.guide-text');
    var gRow = el.querySelector('.guide-row');
    var gKeys = el.querySelector('.guide-keys');
    var gHint = el.querySelector('.guide-hint');
    var gEnd = el.querySelector('.guide-end');
    var tryBtn = el.querySelector('.demo-try');
    var slot = el.parentElement;
    var gi = 0, ki = 0;
    var hint = function (t) { return (t || '').replace(/\{Alt\}/g, isMac ? 'Option' : 'Alt'); };

    var paintKeys = function () {
      each(gKeys.querySelectorAll('.g-key'), function (b, i) {
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
        gText.textContent = cfg.finish || '';
        gRow.hidden = true;
        gEnd.hidden = false;
        return;
      }
      var s = steps[gi];
      gStep.textContent = 'Step ' + (gi + 1) + ' of ' + steps.length;
      gText.textContent = s.text;
      gHint.textContent = hint(s.hint);
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
        gHint.textContent = hint(s.hint);
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
    /* While trying, the demo floats centered and wide; the slot keeps its space in the page */
    var floatOpen = function () {
      if (el.classList.contains('is-floating')) return;
      slot.style.minHeight = el.offsetHeight + 'px';
      el.classList.add('is-floating');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', 'Try Zellij');
      getScrim().hidden = false;
      root.classList.add('is-trying');
    };
    var floatClose = function () {
      el.classList.remove('is-floating');
      el.removeAttribute('role');
      el.removeAttribute('aria-modal');
      el.removeAttribute('aria-label');
      getScrim().hidden = true;
      root.classList.remove('is-trying');
      slot.style.minHeight = '';
    };
    var api = {};
    api.start = function () {
      if (current && current !== api) current.stop();
      current = api;
      floatOpen();
      trying = true;
      sync();
      term.classList.remove('resetting');
      term.classList.add('trying');
      gi = 0;
      ki = 0;
      render(cfg.start, true);
      chip.hidden = true;
      cap.hidden = true;
      guide.hidden = false;
      showStep();
      guide.focus({ preventScroll: true });
    };
    api.stop = function () {
      if (!trying) return;
      trying = false;
      if (current === api) current = null;
      term.classList.remove('trying');
      guide.hidden = true;
      cap.hidden = false;
      idx = reduce ? cfg.reduced : 0;
      render(idx);
      sync();
      floatClose();
      tryBtn.focus({ preventScroll: true });
    };
    /* Capture phase, so the page's own shortcuts (t, Ctrl g...) don't fire while you play */
    window.addEventListener('keydown', function (e) {
      if (!trying || document.querySelector('dialog[open]')) return;
      var t = e.target;
      if (inField(t)) return;
      /* Keep Tab inside the floating demo */
      if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(el.querySelectorAll('button, a[href]'), function (x) { return x.offsetParent !== null; });
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
      if (name === 'Esc' && (gi >= steps.length || steps[gi].keys[ki] !== 'Esc')) { api.stop(); return; }
      if (gi >= steps.length) return;
      press(name);
    }, true);
    tryBtn.addEventListener('click', api.start);
    el.querySelector('.guide-close').addEventListener('click', api.stop);
    el.querySelector('.guide-again').addEventListener('click', api.start);
    return api;
  }

  var demos = [];
  each(document.querySelectorAll('[data-demo]'), function (el) { var d = Demo(el); if (d) demos.push(d); });

  /* The status bar's TRY IT segment, and the t key: the page's first demo */
  zj.actions.try = function () { if (demos[0]) demos[0].start(); };
})(window.zj);
