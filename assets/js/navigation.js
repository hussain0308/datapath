/* Datapath | navigation.js
 * Hash-based routing and page-level UI wiring.
 *   #/            landing page
 *   #/learn       all modules
 *   #/module/<id> one module
 *   #/lesson/<id> one lesson (direct lesson links work)
 * Also handles smooth-scroll buttons and the mobile menu drawer. Exposed as Datapath.navigation.route.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $ } = DP.utils;

  /* ---------- Routing and UI wiring ---------- */
  function route(){
    const h = location.hash;
    const m = h.match(/^#\/lesson\/([\w-]+)/);
    const mm = h.match(/^#\/module\/([\w-]+)/);
    const interview = h === '#/interview';
    const mock = h === '#/mock';
    document.body.classList.remove('drawer');
    const learn = h === '#/learn';
    const landing = !m && !mm && !learn && !interview && !mock;
    document.body.classList.toggle('landing', landing);
    document.body.classList.toggle('nosidebar', learn || interview || mock);
    document.body.classList.toggle('lesson', !!m);
    document.body.classList.toggle('interview-page', interview);
    if (m) DP.pages.lesson(m[1]);
    else if (mm) DP.pages.module(mm[1]);
    else if (interview) DP.pages.interview();
    else if (mock) DP.pages.mock();
    else if (learn) DP.pages.learn();
    else DP.pages.landing();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  $('view').addEventListener('click', e => {
    const b = e.target.closest('[data-scroll]');
    if (b){ const t = document.getElementById(b.dataset.scroll); if (t) t.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });

  $('menuBtn').addEventListener('click', () => document.body.classList.toggle('drawer'));
  $('scrim').addEventListener('click', () => document.body.classList.remove('drawer'));

  DP.navigation = { route };
})();
