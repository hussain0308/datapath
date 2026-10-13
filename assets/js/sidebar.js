/* Datapath | sidebar.js
 * Sidebar rendering (modules, expandable sections, lesson links, completion dots) and its click handling.
 * Exposed as Datapath.sidebar.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $, esc, CHECK, CHEV } = DP.utils;
  const CURRICULUM = DP.courses;
  const isDone = DP.progress.isDone;
  const LESSONS = DP.lessons;
  const lessonModule = DP.curriculum.lessonModule;

  /* ---------- Sidebar ---------- */
  let openMods = { excel: true };
  let openSecs = { 'excel:Excel basics': true };
  function renderSidebar(activeId){
    const sb = $('sidebar');
    let h = '<a class="back-link" href="#/learn">&larr; All modules</a><input class="search" id="search" type="search" placeholder="Search lessons" aria-label="Search lessons" value="' + esc(DP.search.query) + '">';
    const q = DP.search.query.trim().toLowerCase();
    if (q){
      const hits = DP.search.lessons(q);
      if (!hits.length) h += '<div class="none">No lesson matches yet. New lessons are added in batches.</div>';
      hits.forEach(id => h += lessonLink(id, activeId, true));
    } else {
      CURRICULUM.forEach(m => {
        if (m.hub){
          h += '<div class="mod"><a class="mod-head" href="#/interview"><span>' + esc(m.title) + '</span><span class="soon-note">Open</span></a></div>';
          return;
        }
        const live = m.sections.some(s => s.lessons);
        const open = live && (openMods[m.id] || m.sections.some(sx => sx.lessons && sx.lessons.includes(activeId)));
        h += '<div class="mod ' + (live ? '' : 'soon ') + (open ? 'open' : '') + '">';
        if (live){
          h += '<button class="mod-head" data-mod="' + m.id + '" aria-expanded="' + (!!open) + '"><span>' + esc(m.title) + '</span>' + CHEV + '</button>';
          h += '<div class="mod-body">';
          m.sections.forEach(s => {
            if (s.lessons){
              const key = m.id + ':' + s.title;
              const isOpen = s.lessons.includes(activeId) || openSecs[key];
              const done = s.lessons.filter(isDone).length;
              h += '<div class="sec ' + (isOpen ? 'open' : '') + '"><button class="sec-head" data-sec="' + esc(key) + '" aria-expanded="' + (!!isOpen) + '"><span>' + esc(s.title) + '</span><span class="sec-count">' + done + '/' + s.lessons.length + '</span></button><div class="sec-body">';
              s.lessons.forEach(id => h += lessonLink(id, activeId));
              h += '</div></div>';
            } else h += '<div class="sec-soon">Coming soon: ' + esc(s.soon) + '</div>';
          });
          h += '</div>';
        } else {
          h += '<div class="mod-head"><span>' + esc(m.title) + '</span><span class="soon-note">Soon</span></div>';
        }
        h += '</div>';
      });
    }
    sb.innerHTML = h;
    const s = $('search');
    if (s && q){ s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
  }
  function lessonLink(id, activeId, showMod){
    const L = LESSONS[id];
    return '<a class="lnk ' + (id === activeId ? 'active' : '') + '" href="#/lesson/' + id + '"' + (id === activeId ? ' aria-current="page"' : '') + '>' +
      '<span class="dot ' + (isDone(id) ? 'done' : '') + '">' + (isDone(id) ? CHECK : '') + '</span><span>' + esc(L.title) + (showMod ? ' <small class="mname">' + esc(lessonModule(id).m.title) + '</small>' : '') + '</span></a>';
  }

  $('sidebar').addEventListener('click', e => {
    const mh = e.target.closest('.mod-head[data-mod]');
    if (mh){ const k = mh.dataset.mod; openMods[k] = !openMods[k]; const m = location.hash.match(/^#\/lesson\/([\w-]+)/); renderSidebar(m ? m[1] : null); }
  });
  $('sidebar').addEventListener('click', e => {
    const sh = e.target.closest('.sec-head[data-sec]');
    if (sh){ const k = sh.dataset.sec; openSecs[k] = !openSecs[k]; const m = location.hash.match(/^#\/lesson\/([\w-]+)/); renderSidebar(m ? m[1] : null); }
  });

  DP.sidebar = { render: renderSidebar, state: { openMods, openSecs } };
})();
