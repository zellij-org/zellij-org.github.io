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
    var max = 0, timer = null;
    function tick(t) {
      if (!s.run) return;
      var dt = s.last ? Math.min(t - s.last, 100) : 0;
      s.last = t;
      s.pos += s.dir * SPEED * dt / 1000;
      if (s.pos >= max && s.dir > 0) { s.pos = max; s.dir = -1; s.wait = PAUSE; }
      else if (s.pos <= 0 && s.dir < 0) { s.pos = 0; s.dir = 1; s.wait = PAUSE; }
      el.scrollLeft = s.pos;
      if (s.wait > 0) { hold(); return; }
      requestAnimationFrame(tick);
    }
    function hold() {
      var w = s.wait;
      s.wait = 0;
      clearTimeout(timer);
      timer = setTimeout(function () { timer = null; if (s.run) { s.last = 0; requestAnimationFrame(tick); } }, w);
    }
    s.check = function () {
      var want = !reduce && !s.held && !s.stopped && s.visible && el.offsetParent !== null && !el.closest('[hidden]') && el.scrollWidth - el.clientWidth > 1;
      if (want) max = el.scrollWidth - el.clientWidth;
      if (want && !s.run) {
        s.run = true;
        s.last = 0;
        s.pos = el.scrollLeft;
        if (s.pos <= 0) { s.dir = 1; s.wait = PAUSE; hold(); }
        else requestAnimationFrame(tick);
      } else if (!want) { s.run = false; clearTimeout(timer); timer = null; }
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
     and the button plays it. */
  function Demo(el) {
    var cfg = JSON.parse(el.getAttribute('data-config'));
    var chapters = cfg.chapters, SCENE = cfg.scene || 2600, CAP = cfg.caption || 0;
    var term = el.querySelector('.term');
    var blocks = term.querySelectorAll('.t-chapter');
    var navs = el.querySelectorAll('.demo-ch');
    var hasCap = CAP > 0 && blocks.length > 0;
    chapters.forEach(function (c, i) {
      var scope = blocks[i] || term;
      c.scope = scope;
      c.mouse = scope.querySelector('.t-mouse');
      c.cams = scope.querySelectorAll('.t-cam');
      c.panes = scope.querySelectorAll('.tpane[data-pane]');
      c.managed = [];
      c.states.forEach(function (s) {
        Object.keys(s.set || {}).forEach(function (sel) {
          String(s.set[sel]).split(/\s+/).forEach(function (cls) {
            if (!c.managed.some(function (m) { return m.sel === sel && m.cls === cls; })) c.managed.push({ sel: sel, cls: cls, els: scope.querySelectorAll(sel) });
          });
        });
      });
    });
    function sets(s, m) { return !!(s.set && s.set[m.sel] && String(s.set[m.sel]).split(/\s+/).indexOf(m.cls) > -1); }

    function camera(c) {
      each(c.cams, function (cam) {
        var area = cam.querySelector('.t-desk-area'), win = null;
        each(cam.querySelectorAll('.t-zw'), function (w) { if (!win && w.offsetParent !== null) win = w; });
        var W = cam.offsetWidth, H = cam.offsetHeight;
        if (!win || !area || !W || !H) { if (!cam.classList.contains('zoom')) cam.style.transform = ''; return; }
        var zj = win.querySelector('.t-win-zj') || win, r = parseFloat(getComputedStyle(win).borderBottomLeftRadius) || 0;
        var fitW = (zj.offsetHeight - r) * W / H + 2 * r;
        each(cam.querySelectorAll('.t-zw'), function (w) { w.style.width = fitW + 'px'; w.style.left = ((area.offsetWidth - fitW) / 2) + 'px'; });
        var ww = zj.offsetWidth - 2 * r, wh = zj.offsetHeight - r, wx = win.offsetLeft + area.offsetLeft + zj.offsetLeft + r, wy = win.offsetTop + area.offsetTop + zj.offsetTop;
        var k = Math.max(W / ww, H / wh);
        cam.style.setProperty('--zs', (1 / k).toFixed(4));
        cam.style.transform = cam.classList.contains('zoom') ? 'translate(' + ((W - ww * k) / 2 - wx * k) + 'px, ' + ((H - wh * k) / 2 - wy * k) + 'px) scale(' + k + ')' : '';
      });
    }
    window.addEventListener('resize', function () { camera(chapters[ci]); });

    function placeMouse(c, s) {
      var m = c.mouse;
      if (!m) return;
      if (m.offsetParent === null) { m.removeAttribute('data-at'); return; }
      var W = m.offsetParent.offsetWidth, H = m.offsetParent.offsetHeight;
      if (!m.hasAttribute('data-at')) {
        m.style.transition = 'none';
        m.style.transform = 'translate(' + W * 0.5 + 'px, ' + H * 0.62 + 'px)';
        void m.offsetWidth;
        m.style.transition = '';
        m.setAttribute('data-at', '');
      }
      if (!s.mouse || m.getAttribute('data-at') === s.mouse) return;
      var t = c.scope.querySelector(s.mouse);
      if (!t) return;
      var box = m.offsetParent.getBoundingClientRect(), r = t.getBoundingClientRect();
      if (!box.width || !box.height) return;
      m.setAttribute('data-at', s.mouse);
      m.style.transform = 'translate(' + (r.left + r.width / 2 - box.left) / box.width * W + 'px, ' + (r.top + r.height / 2 - box.top) / box.height * H + 'px)';
    }

    var ci = 0, si = 0, capOn = false;
    function render() {
      var c = chapters[ci], s = c.states[si];
      each(blocks, function (b, i) { b.hidden = i !== ci; });
      term.setAttribute('data-state', si);
      each(c.panes, function (p) {
        var on = p.getAttribute('data-pane') === s.focus;
        p.classList.toggle('focused', on);
      });
      c.managed.forEach(function (m) { var on = sets(s, m); each(m.els, function (x) { x.classList.toggle(m.cls, on); }); });
      camera(c);
      placeMouse(c, s);
    }
    function caption(on) { capOn = on; term.classList.toggle('captioning', on); }
    function mark(run) {
      each(navs, function (b, i) {
        var on = i === ci;
        b.classList.toggle('is-on', on);
        b.classList.remove('run');
        if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      var b = navs[ci];
      if (!b || !run) return;
      var total = hasCap ? CAP : 0;
      chapters[ci].states.forEach(function (s) { total += s.time || SCENE; });
      el.style.setProperty('--ch-dur', total + 'ms');
      void b.offsetWidth;
      b.classList.add('run');
    }

    var visible = true, paused = false, fading = false, timer = null, due = 0, left = null;
    function running() { return !paused && visible; }
    function dur() { return chapters[ci].states[si].time || SCENE; }
    function arm(ms) {
      clearTimeout(timer);
      timer = null;
      left = ms;
      if (running()) { due = Date.now() + ms; timer = setTimeout(step, ms); }
    }
    function step() {
      timer = null;
      left = null;
      if (capOn) { caption(false); render(); arm(dur()); return; }
      if (si + 1 < chapters[ci].states.length) { si++; render(); arm(dur()); return; }
      go((ci + 1) % chapters.length);
    }
    function start() {
      si = 0;
      mark(true);
      if (hasCap) { caption(true); render(); arm(CAP); }
      else { caption(false); render(); arm(dur()); }
    }
    function go(n) {
      clearTimeout(timer);
      timer = null;
      left = null;
      fading = true;
      term.classList.add('resetting');
      setTimeout(function () {
        fading = false;
        ci = n;
        start();
        term.classList.remove('resetting');
      }, 260);
    }
    function sync() {
      el.classList.toggle('is-held', !running());
      if (running()) {
        if (!timer && !fading) {
          if (left === null) left = dur();
          due = Date.now() + left;
          timer = setTimeout(step, left);
        }
      } else if (timer) {
        clearTimeout(timer);
        timer = null;
        left = Math.max(0, due - Date.now());
      }
    }
    var toggle = el.querySelector('.demo-pause');
    function setPaused(p) {
      paused = p;
      if (toggle) {
        toggle.textContent = p ? 'play' : 'pause';
        toggle.setAttribute('aria-label', p ? 'Play the demo' : 'Pause the demo');
      }
      sync();
    }
    if (toggle) toggle.addEventListener('click', function () { setPaused(!paused); });
    each(navs, function (b, i) {
      b.addEventListener('click', function () {
        if (reduce && paused) {
          ci = i;
          si = chapters[i].reduced || 0;
          left = null;
          caption(false);
          render();
          mark(false);
          return;
        }
        go(i);
        setPaused(false);
      });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }).observe(term);
    }
    var progs = term.querySelectorAll('.t-prog');
    if (progs.length) {
      setInterval(function () {
        if (!running() || capOn || fading || blocks[ci] && !blocks[ci].querySelector('.t-prog')) return;
        each(progs, function (p) {
          if (p.offsetParent === null) return;
          var own = p.closest('.t-ln'), n = 0;
          each(p.closest('pre').querySelectorAll('.t-ln'), function (l) { if (l !== own && l.offsetHeight > 0) n++; });
          var v = +p.getAttribute('data-c0') + n, cnt = p.querySelector('.t-cnt');
          if (cnt.textContent === String(v)) return;
          cnt.textContent = v;
          p.querySelector('.t-bar i').style.width = (v * 14 / 350) + 'ch';
        });
      }, 40);
    }
    if (reduce) {
      ci = cfg.still || 0;
      si = chapters[ci].reduced || 0;
      paused = true;
      render();
      mark(false);
      setPaused(true);
    } else {
      start();
      setPaused(false);
    }
  }
  each(document.querySelectorAll('[data-demo]'), Demo);
})(window.zj);
