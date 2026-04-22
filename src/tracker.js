(function () {
  var SUPABASE_URL = 'https://iswwjhrmswcxbpctgzyj.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_m5c_aT_bw-HECc__kgkeqQ_V0-MOtLH';
  var SITE = 'ssullemon';

  function waitForSupabase(cb) {
    if (window.supabase && window.supabase.createClient) return cb();
    var tries = 0;
    var id = setInterval(function () {
      if (window.supabase && window.supabase.createClient) { clearInterval(id); cb(); }
      if (++tries > 50) clearInterval(id);
    }, 100);
  }

  function track(eventType) {
    if (!window.__sbTracker) return;
    window.__sbTracker.from('page_events').insert({
      site: SITE,
      event_type: eventType,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    }).then();
  }

  waitForSupabase(function () {
    window.__sbTracker = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    if (!sessionStorage.getItem('_kc_visited')) {
      track('page_visit');
      sessionStorage.setItem('_kc_visited', '1');
    }
  });

  window.trackEvent = track;
})();
