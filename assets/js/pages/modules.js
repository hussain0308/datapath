/* Datapath | pages/modules.js
 * "Choose what you want to learn" page (all modules) and the single-module page (lesson list per section).
 * Exposed as Datapath.pages.learn and Datapath.pages.module.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $, esc, CHECK } = DP.utils;
  const CURRICULUM = DP.courses;
  const modLessons = DP.curriculum.modLessons;
  const isDone = DP.progress.isDone;
  const LESSONS = DP.lessons;

  /* ---------- Home ---------- */
  function renderLearn(){
    let h = '<h1>Choose what you want to learn</h1><p class="lede">Pick a module. Lessons cover one topic each; the interview hub has question practice and mock tests.</p><div class="mods">';
    CURRICULUM.forEach(m => {
      const ls = modLessons(m), done = ls.filter(isDone).length;
      if (m.hub) h += '<a class="modcard" href="#/interview"><b>' + esc(m.title) + '</b><span>' + esc(m.blurb) + '</span><em>Question bank and mock tests</em></a>';
      else if (ls.length) h += '<a class="modcard" href="#/module/' + m.id + '"><b>' + esc(m.title) + '</b><span>' + esc(m.blurb) + '</span><em>' + ls.length + ' lessons' + (done ? ', ' + done + ' completed' : '') + '</em></a>';
      else h += '<div class="modcard soon"><b>' + esc(m.title) + '</b><span>' + esc(m.blurb) + '</span><em>Coming soon</em></div>';
    });
    h += '</div><p class="foot">Progress is saved in this browser only.</p>';
    $('view').innerHTML = h;
    document.title = 'Choose a module | Datapath';
  }
  function renderModule(id){
    const m = CURRICULUM.find(x => x.id === id);
    if (m && m.hub){ location.hash = '#/interview'; return; }
    if (!m || !modLessons(m).length){ location.hash = '#/learn'; return; }
    const ls = modLessons(m), done = ls.filter(isDone).length;
    let h = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/learn">Modules</a> / ' + esc(m.title) + '</nav>' +
      '<h1>' + esc(m.title) + '</h1><p class="lede">' + esc(m.blurb) + '</p><p class="fine">' + ls.length + ' lessons, ' + done + ' completed. Open any lesson you like.</p>';
    m.sections.forEach(sec => {
      if (!sec.lessons) return;
      h += '<h2>' + esc(sec.title) + '</h2><div class="lesson-list">' + sec.lessons.map(lid =>
        '<a class="ll" href="#/lesson/' + lid + '"><span class="dot ' + (isDone(lid) ? 'done' : '') + '">' + (isDone(lid) ? CHECK : '') + '</span><span><b>' + esc(LESSONS[lid].title) + '</b><small>' + esc(LESSONS[lid].tagline) + '</small></span></a>').join('') + '</div>';
    });
    $('view').innerHTML = h;
    document.title = m.title + ' | Datapath';
    DP.sidebar.state.openMods[m.id] = true;
    DP.sidebar.render(null);
  }

  DP.pages = DP.pages || {};
  DP.pages.learn = renderLearn;
  DP.pages.module = renderModule;
})();
