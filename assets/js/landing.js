/* zellij.dev homepage: install tabs, and the terminal demo with its guided try-it mode.
   Runs after site.js, which provides window.zj. */
(function (zj) {
  var $ = zj.$, root = zj.root, reduce = zj.reduce, plat = zj.plat, isMac = zj.isMac, inField = zj.inField;

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

  /* The status bar's TRY IT segment, and the t key */
  zj.actions.try = function () { if (startTry) startTry(); };
})(window.zj);
