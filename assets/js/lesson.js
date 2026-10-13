/* Datapath | lesson.js
 * Lesson page renderer: assembles one lesson from its core content (Datapath.lessons) and its extended
 * content (Datapath.deep) into the page, builds the "On this page" list, then mounts the quiz.
 * Exposed as Datapath.pages.lesson.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $, esc, fmt, li } = DP.utils;
  const { chartHTML, gridHTML, diagramHTML } = DP.visuals;
  const LESSONS = DP.lessons;
  const DEEP = DP.deep;
  const lessonModule = DP.curriculum.lessonModule;
  const ORDER = DP.curriculum.ORDER;
  const isDone = DP.progress.isDone;

  function completionHTML(id){
    const done = isDone(id);
    return '<div class="lesson-completion"><button class="btn' + (done ? ' ghost' : '') + '" type="button" data-complete-lesson="' + esc(id) + '"' +
      (done ? ' disabled aria-pressed="true"' : ' aria-pressed="false"') + '>' +
      (done ? 'Lesson completed' : 'Mark lesson complete') +
      '</button><span>Progress is saved in this browser.</span></div>';
  }

  /* ---------- Lesson ---------- */
  function readMins(id){
    const words = JSON.stringify([LESSONS[id], DEEP[id] || {}]).replace(/[{}\[\]":,]/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(3, Math.round(words / 210));
  }
  function exampleHTML(E, label, cls){
    let h = '<div class="example"><h3>' + (label ? '<span class="tag ' + cls + '">' + esc(label) + '</span> ' : '') + esc(E.title) + '</h3><p>' + fmt(E.scenario) + '</p>';
    if (E.table) h += gridHTML(E.table);
    if (E.task) h += '<p><strong>Task:</strong> ' + fmt(E.task) + '</p>';
    if (E.formula) h += '<div class="code">' + esc(E.formula) + '</div>';
    h += E.unordered ? li(E.steps) : '<ol>' + E.steps.map(x => '<li>' + fmt(x) + '</li>').join('') + '</ol>';
    if (E.table2) h += gridHTML(E.table2);
    if (E.chart) h += chartHTML(E.chart);
    return h + '<div class="result">' + fmt(E.result) + '</div></div>';
  }
  function practiceItemHTML(P, label, cls){
    let h = '<details class="reveal qa"><summary><span class="tag ' + cls + '">' + esc(label) + '</span><span>' + fmt(P.q) + '</span></summary><div class="inner">';
    if (P.table) h += gridHTML(P.table);
    h += '<details class="reveal sub"><summary>Hint</summary><div class="inner">' + fmt(P.hint) + '</div></details>';
    h += '<details class="reveal sub"><summary>Show solution</summary><div class="inner"><div class="code">' + esc(P.solution) + '</div><p>' + fmt(P.explain) + '</p></div></details></div></details>';
    return h;
  }
  const TAGCLS = { Basic:'Basic', Variation:'Intermediate', 'Business case':'Scenario', Easy:'Basic', Medium:'Intermediate', Interview:'Scenario', Intermediate:'Intermediate', Scenario:'Scenario' };
  function renderStatsLesson(id, L, D, loc, idx){
    let h = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/learn">Modules</a> / <a href="#/module/' + loc.m.id + '">' + esc(loc.m.title) + '</a> / ' + esc(loc.s.title) + '</nav>';
    h += '<h1>' + esc(L.title) + '</h1><p class="lede">' + fmt(L.question) + '</p>';
    h += '<div class="meta"><span class="chip">' + readMins(id) + ' min read</span><span class="chip">Concept lesson</span><span class="chip">5-question check</span></div>';
    if (L.prereq && L.prereq.length)
      h += '<div class="prereq">Useful first: ' + L.prereq.map(p => '<a href="#/lesson/' + p + '">' + esc(LESSONS[p].title) + '</a>').join(', ') + '</div>';
    h += '<section class="stat-idea"><h2>Start with the idea</h2><p>' + fmt(L.idea) + '</p></section>';
    if (L.visual || L.table){
      h += '<section class="stat-visual"><h2>See the pattern</h2>';
      if (L.visual) h += chartHTML(L.visual);
      if (L.table) h += gridHTML(L.table);
      if (L.visualNote) h += '<p class="muted">' + fmt(L.visualNote) + '</p>';
      h += '</section>';
    }
    if (L.work && L.work.length)
      h += '<section class="stat-work"><h2>Work through it</h2><ol>' + L.work.map(x => '<li>' + fmt(x) + '</li>').join('') + '</ol></section>';
    if (L.reading)
      h += '<section class="stat-read"><h2>What the result tells us</h2><p>' + fmt(L.reading) + '</p></section>';
    if (L.limits)
      h += '<section class="stat-limits"><h2>What it does not tell us</h2><p>' + fmt(L.limits) + '</p></section>';
    if (L.practice){
      h += '<section class="stat-practice"><h2>Make the analyst’s call</h2><p>' + fmt(L.practice.q) + '</p>';
      if (L.practice.table) h += gridHTML(L.practice.table);
      h += '<details class="reveal"><summary>Show a reasoned answer</summary><div class="inner"><p>' + fmt(L.practice.answer) + '</p>' +
        (L.practice.caveat ? '<p><strong>Check:</strong> ' + fmt(L.practice.caveat) + '</p>' : '') + '</div></details></section>';
    }
    if (D && D.diagrams) h += '<section class="stat-visual"><h2>Another way to see it</h2>' + D.diagrams.map(diagramHTML).join('') + '</section>';
    h += '<section class="stat-quiz"><h2>Check your understanding</h2><p>Use the concept, not just the formula.</p><div id="quiz"></div></section>';
    h += '<section class="stat-recap"><h2>Keep in mind</h2><ul>' + L.recap.map(x => '<li>' + fmt(x) + '</li>').join('') + '</ul></section>';
    h += completionHTML(id);
    let rel = (D && D.related && D.related.length) ? D.related : null;
    if (rel) h += '<h3>Related ideas</h3><p>' + rel.map(r => '<a href="#/lesson/' + r + '">' + esc(LESSONS[r].title) + '</a>').join(' · ') + '</p>';
    h += '<div class="pager">';
    if (idx > 0) h += '<a class="prev" href="#/lesson/' + ORDER[idx-1] + '"><small>Previous</small>' + esc(LESSONS[ORDER[idx-1]].title) + '</a>';
    if (idx < ORDER.length - 1) h += '<a class="next" href="#/lesson/' + ORDER[idx+1] + '"><small>Next</small>' + esc(LESSONS[ORDER[idx+1]].title) + '</a>';
    h += '</div>';
    $('view').innerHTML = '<div class="lesson-wrap stats-lesson"><article id="article">' + h + '</article><aside class="toc" id="toc"></aside></div>';
    const heads = Array.prototype.slice.call(document.querySelectorAll('#article h2'));
    let toc = '<b>On this page</b>';
    heads.forEach((hd, i) => { hd.id = 'sec-' + i; toc += '<button class="toc-link" data-scroll="sec-' + i + '">' + esc(hd.textContent) + '</button>'; });
    $('toc').innerHTML = toc;
    document.title = L.title + ' | Datapath';
    DP.sidebar.render(id);
    DP.quiz.mount(id);
  }
  function renderLesson(id){
    const L = LESSONS[id], D = DEEP[id];
    if (!L){ location.hash = '#/learn'; return; }
    const loc = lessonModule(id);
    const idx = ORDER.indexOf(id);
    if (L.format === 'statistics'){ renderStatsLesson(id, L, D, loc, idx); return; }
    let h = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/learn">Modules</a> / <a href="#/module/' + loc.m.id + '">' + esc(loc.m.title) + '</a> / ' + esc(loc.s.title) + '</nav>';
    h += '<h1>' + esc(L.title) + '</h1><p class="lede">' + esc(L.tagline) + '</p>';
    h += '<div class="meta">' + '<span class="chip">' + readMins(id) + ' min read</span>' + (D && D.level ? '<span class="chip">' + esc(D.level) + '</span>' : '') + '<span class="chip">5-question check</span></div>';
    if (D && D.tldr) h += '<div class="tldr"><b>In one sentence</b>' + fmt(D.tldr) + '</div>';
    if (L.prereq && L.prereq.length)
      h += '<div class="prereq">Before this lesson: ' + L.prereq.map(p => '<a href="#/lesson/' + p + '">' + esc(LESSONS[p].title) + '</a>').join(', ') + '</div>';

    h += '<h2>' + esc(L.whatTitle || ('What is ' + L.title + '?')) + '</h2>' + li(L.what);
    if (D && D.intuition){
      h += '<h2>Concept overview</h2>' + D.intuition.text.map(t => '<p>' + fmt(t) + '</p>').join('');
      if (D.intuition.analogy) h += '<div class="analogy"><b>Think of it like this</b>' + fmt(D.intuition.analogy) + '</div>';
    }
    h += '<h2>Why analysts use it</h2>' + li(L.why);
    if (D && D.diagrams){ h += '<h2>See it</h2>' + D.diagrams.map(diagramHTML).join(''); }
    if (D && D.how){ h += '<h2>How it works, step by step</h2><ol class="steps-list">' + D.how.map(x => '<li>' + fmt(x) + '</li>').join('') + '</ol>'; }
    if (L.syntax){
      h += '<h2>Syntax</h2><div class="code">' + esc(L.syntax.code) + '</div><dl class="params">' +
        L.syntax.parts.map(p => '<div><dt>' + esc(p[0]) + '</dt><dd>' + fmt(p[1]) + '</dd></div>').join('') + '</dl>';
    }
    if (L.compare){
      h += '<h2>Side by side</h2><div class="cmp-wrap"><table class="cmp"><thead><tr>' +
        L.compare.headers.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' +
        L.compare.rows.map(r => '<tr><th>' + esc(r[0]) + '</th>' + r.slice(1).map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table></div>';
    }
    h += '<h2>Key points</h2>' + li(L.points);

    if (D && D.examples){
      h += '<h2>Worked examples</h2><p class="muted">Three examples, from the basic case to a realistic business problem.</p>';
      D.examples.forEach(ex => { const E = ex.base ? L.example : ex; h += exampleHTML(E, ex.level, TAGCLS[ex.level] || 'Basic'); });
    } else {
      h += '<h2>Real-world example</h2>' + exampleHTML(L.example);
    }
    if (D && D.edge){
      h += '<h2>Edge cases and gotchas</h2><div class="edge">' + D.edge.map(e => '<div><b>' + esc(e.t) + '</b><p>' + fmt(e.d) + '</p></div>').join('') + '</div>';
    }
    h += '<h2>Common mistakes</h2>' + li(L.mistakes);

    if (D && D.tiers){
      h += '<h2>Practice in three levels</h2><p class="muted">Try each one before opening the hint and the solution.</p>';
      D.tiers.forEach(t => { const P = t.base ? L.practice : t; h += practiceItemHTML(P, t.level, TAGCLS[t.level] || 'Basic'); });
    } else {
      const P = L.practice;
      h += '<h2>Practice question</h2><p>' + fmt(P.q) + '</p>';
      if (P.table) h += gridHTML(P.table);
      h += '<details class="reveal"><summary>Hint</summary><div class="inner">' + fmt(P.hint) + '</div></details>' +
           '<details class="reveal"><summary>Show solution</summary><div class="inner"><div class="code">' + esc(P.solution) + '</div><p>' + fmt(P.explain) + '</p></div></details>';
    }

    if (D && D.interviewPlus){
      h += '<h2>Interview preparation</h2><p class="muted">Each answer shows what to say, how to structure it and what the interviewer may ask next.</p>';
      D.interviewPlus.forEach(q => {
        h += '<details class="reveal qa"><summary><span class="tag ' + (TAGCLS[q.level] || 'Basic') + '">' + esc(q.level) + '</span><span>' + fmt(q.q) + '</span></summary><div class="inner ans">';
        h += '<p><strong>Model answer</strong></p><p>' + fmt(q.a) + '</p>';
        if (q.structure) h += '<div class="callout"><b>How to structure it</b>' + fmt(q.structure) + '</div>';
        if (q.tradeoff) h += '<div class="callout alt"><b>Trade-offs to mention</b>' + fmt(q.tradeoff) + '</div>';
        if (q.follow && q.follow.length) h += '<h4>Likely follow-up questions</h4>' + q.follow.map(f => '<details class="reveal sub"><summary>' + fmt(f.q) + '</summary><div class="inner">' + fmt(f.a) + '</div></details>').join('');
        h += '</div></details>';
      });
      h += '<h3>More quick-fire questions</h3>';
      L.interview.forEach(x => {
        h += '<details class="reveal qa"><summary><span class="tag ' + x.level + '">' + x.level + '</span><span>' + fmt(x.q) + '</span></summary><div class="inner ans">' + fmt(x.a) + '</div></details>';
      });
    } else {
      h += '<h2>Interview questions</h2><p>Questions on ' + esc(L.title) + ' only. Try answering out loud before you open the answer.</p>';
      L.interview.forEach(x => {
        h += '<details class="reveal qa"><summary><span class="tag ' + x.level + '">' + x.level + '</span><span>' + fmt(x.q) + '</span></summary><div class="inner ans">' + fmt(x.a) + '</div></details>';
      });
    }
    if (D && D.ref){
      h += '<h2>Quick reference</h2><div class="cmp-wrap"><table class="cmp"><thead><tr>' + D.ref.headers.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' +
        D.ref.rows.map(r => '<tr><th>' + fmt(r[0]) + '</th>' + r.slice(1).map(c => '<td>' + fmt(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    }

    h += '<h2>Check yourself</h2><p>Five questions. Pick an answer to see why it is right or wrong.</p><div id="quiz"></div>';
    h += '<h2>Recap</h2>' + li(L.recap);
    h += completionHTML(id);
    let rel = (D && D.related && D.related.length) ? D.related : null;
    if (!rel){ const sib = loc.s.lessons.filter(x => x !== id); const i0 = loc.s.lessons.indexOf(id); rel = sib.sort((a, b) => Math.abs(loc.s.lessons.indexOf(a) - i0) - Math.abs(loc.s.lessons.indexOf(b) - i0)).slice(0, 4); }
    if (rel.length) h += '<h3>Related lessons</h3><p>' + rel.map(r => '<a href="#/lesson/' + r + '">' + esc(LESSONS[r].title) + '</a>').join(' · ') + '</p>';

    h += '<div class="pager">';
    if (idx > 0) h += '<a class="prev" href="#/lesson/' + ORDER[idx-1] + '"><small>Previous</small>' + esc(LESSONS[ORDER[idx-1]].title) + '</a>';
    if (idx < ORDER.length - 1) h += '<a class="next" href="#/lesson/' + ORDER[idx+1] + '"><small>Next</small>' + esc(LESSONS[ORDER[idx+1]].title) + '</a>';
    h += '</div>';

    $('view').innerHTML = '<div class="lesson-wrap"><article id="article">' + h + '</article><aside class="toc" id="toc"></aside></div>';
    const heads = Array.prototype.slice.call(document.querySelectorAll('#article h2'));
    let toc = '<b>On this page</b>';
    heads.forEach((hd, i) => { hd.id = 'sec-' + i; toc += '<button class="toc-link" data-scroll="sec-' + i + '">' + esc(hd.textContent) + '</button>'; });
    $('toc').innerHTML = toc;
    document.title = L.title + ' | Datapath';
    DP.sidebar.render(id);
    DP.quiz.mount(id);
  }

  $('view').addEventListener('click', e => {
    const button = e.target.closest('[data-complete-lesson]');
    if (!button || button.disabled) return;
    const id = button.dataset.completeLesson;
    DP.progress.markDone(id);
    button.textContent = 'Lesson completed';
    button.classList.add('ghost');
    button.disabled = true;
    button.setAttribute('aria-pressed', 'true');
    DP.progress.updateTop();
    DP.sidebar.render(id);
  });

  DP.pages = DP.pages || {};
  DP.pages.lesson = renderLesson;
})();
