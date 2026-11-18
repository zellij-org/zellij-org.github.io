/* zellij.dev landing pages (the homepage and Agents): install tabs, and the demos.
   Runs after site.js, which provides window.zj. */
(function (zj) {
  var $ = zj.$, reduce = zj.reduce, plat = zj.plat, isMac = zj.isMac;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* Install tabs, picked from the visitor's OS */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.os-tab'));
  var scrollers = [];
  function selectTab(id, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-os') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      $('panel-' + t.getAttribute('data-os')).hidden = !on;
      if (on && focus) t.focus();
    });
    scrollers.forEach(function (s) { s.check(); });
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

  /* An install command too long for its box scrolls slowly back and forth, pausing at each end, so it can be read whole.
     Pointing at the box pauses it; scrolling it by hand stops it. It only runs while shown, and never with reduced motion. */
  function Scroller(el) {
    var s = { run: false, held: false, stopped: false, visible: true, dir: 1, wait: 0, pos: 0, last: 0 };
    var SPEED = 28, PAUSE = 1600; /* pixels a second; milliseconds at each end */
    function tick(t) {
      if (!s.run) return;
      var max = el.scrollWidth - el.clientWidth, dt = s.last ? Math.min(t - s.last, 100) : 0;
      s.last = t;
      if (s.wait > 0) s.wait -= dt;
      else {
        s.pos += s.dir * SPEED * dt / 1000;
        if (s.pos >= max) { s.pos = max; s.dir = -1; s.wait = PAUSE; }
        else if (s.pos <= 0) { s.pos = 0; s.dir = 1; s.wait = PAUSE; }
        el.scrollLeft = s.pos;
      }
      requestAnimationFrame(tick);
    }
    s.check = function () {
      var want = !reduce && !s.held && !s.stopped && s.visible && el.offsetParent !== null && el.scrollWidth - el.clientWidth > 1;
      if (want && !s.run) {
        s.run = true;
        s.last = 0;
        s.pos = el.scrollLeft;
        if (s.pos <= 0) { s.dir = 1; s.wait = PAUSE; }
        requestAnimationFrame(tick);
      } else if (!want) s.run = false;
    };
    var box = el.parentElement;
    box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { s.held = true; s.check(); } });
    box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { s.held = false; s.check(); } });
    var byHand = function () { s.stopped = true; s.check(); };
    el.addEventListener('touchstart', byHand, { passive: true });
    el.addEventListener('wheel', byHand, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { s.visible = entries[0].isIntersecting; s.check(); }).observe(el);
    }
    return s;
  }
  each(document.querySelectorAll('.cmd'), function (el) { scrollers.push(Scroller(el)); });
  var recheck = function () { scrollers.forEach(function (s) { s.check(); }); };
  window.addEventListener('resize', recheck);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(recheck);
  recheck();

  /* Demos (layouts/partials/demo/demo.html). Each plays its scenes in a loop while it's on screen; the scenes come from
     data/demos/<name>.yaml through data-config. The pause button stops it. With reduced motion, it shows one scene, still,
     and the button plays it. A peek, inside a link, has no button. */
  function Demo(el) {
    var cfg = JSON.parse(el.getAttribute('data-config'));
    var states = cfg.states;
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
    function render(i, quiet) {
      var s = states[i];
      term.setAttribute('data-state', i);
      each(panes, function (p) { p.classList.toggle('focused', p.getAttribute('data-pane') === s.focus); });
      managed.forEach(function (m) { var on = sets(s, m); each(m.els, function (x) { x.classList.toggle(m.cls, on); }); });
      if (quiet || !s.key) { chip.hidden = true; return; }
      chip.textContent = s.key;
      chip.hidden = false;
      chip.classList.remove('pop');
      void chip.offsetWidth;
      chip.classList.add('pop');
    }

    var visible = true, paused = false, idx = 0, timer = null;
    var step = function () {
      idx = (idx + 1) % states.length;
      if (idx === 0) {
        term.classList.add('resetting');
        setTimeout(function () { render(0); term.classList.remove('resetting'); }, 260);
      } else {
        render(idx);
      }
    };
    var sync = function () {
      clearInterval(timer);
      timer = null;
      if (!paused && visible) timer = setInterval(step, 2600);
    };
    var toggle = el.querySelector('.demo-pause');
    var setPaused = function (p) {
      paused = p;
      if (toggle) {
        toggle.textContent = p ? 'play' : 'pause';
        toggle.setAttribute('aria-label', p ? 'Play the demo' : 'Pause the demo');
      }
      sync();
    };
    if (toggle) toggle.addEventListener('click', function () { setPaused(!paused); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }).observe(term);
    }
    var peek = el.hasAttribute('data-peek');
    if (reduce) { idx = peek ? +el.getAttribute('data-peek') : cfg.reduced; render(idx, peek); setPaused(true); }
    else { render(0); setPaused(false); }
  }
  each(document.querySelectorAll('[data-demo]'), Demo);
})(window.zj);
