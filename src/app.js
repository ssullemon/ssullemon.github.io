// ssullemon (K-Community) landing — vanilla interactions
(function () {
  // ── Theme (dark mode) ────────────────────────────────────
  var saved = null;
  try { saved = localStorage.getItem('kc-theme'); } catch (e) {}
  var theme = saved || 'light';
  document.documentElement.setAttribute('data-theme', theme);

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('kc-theme', next); } catch (e) {}
    });
  }

  // ── Language dropdown ────────────────────────────────────
  var picker = document.querySelector('.lang-picker');
  if (picker) {
    var btn = picker.querySelector('.lang-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      picker.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!picker.contains(e.target)) picker.classList.remove('open');
    });
  }

  // ── Hero phone carousel (front phone, 5 screens) ─────────
  var screens = Array.prototype.slice.call(document.querySelectorAll('.phone-front .phone-screen-slot'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.phone-dots button'));
  if (screens.length > 1) {
    var idx = 0;
    function show(i) {
      idx = ((i % screens.length) + screens.length) % screens.length;
      screens.forEach(function (el, j) {
        el.style.display = j === idx ? '' : 'none';
        if (j === idx) {
          el.classList.remove('phone-swap');
          // force reflow to restart animation
          void el.offsetWidth;
          el.classList.add('phone-swap');
        }
      });
      dots.forEach(function (d, j) { d.classList.toggle('active', j === idx); });
    }
    dots.forEach(function (d, j) { d.addEventListener('click', function () { show(j); reset(); }); });
    var timer;
    function reset() { clearInterval(timer); timer = setInterval(function () { show(idx + 1); }, 3800); }
    show(0); reset();
  }

  // ── Modes pill — hover highlight only (first is active) ──
  // (No JS needed; pure CSS :hover)

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
