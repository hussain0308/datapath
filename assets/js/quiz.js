/* Datapath | quiz.js
 * Five-question quiz at the end of each lesson: shuffled options, instant feedback, score, retry.
 * On completion it records the best score through Datapath.progress. Exposed as Datapath.quiz.mount(lessonId).
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $, fmt, shuffle } = DP.utils;
  const LESSONS = DP.lessons;
  const ORDER = DP.curriculum.ORDER;

  /* ---------- Quiz ---------- */
  function mountQuiz(id){
    const L = LESSONS[id], box = $('quiz');
    let order = L.mcq.map(q => shuffle(q.o.map((t,i) => ({t,i}))));
    let answered = new Array(L.mcq.length).fill(null);

    function draw(focusQ){
      const all = answered.every(a => a !== null);
      const score = answered.reduce((n,a,qi) => n + (a === L.mcq[qi].a ? 1 : 0), 0);
      let h = L.mcq.map((q,qi) => {
        const a = answered[qi];
        return '<div class="q"><p class="q-text"><span>' + (qi+1) + '.</span> ' + fmt(q.q) + '</p><div class="opts">' +
          order[qi].map(o => {
            let cls = '';
            if (a !== null){ if (o.i === q.a) cls = 'correct'; else if (a === o.i) cls = 'wrong'; }
            return '<button class="opt ' + cls + '" data-q="' + qi + '" data-o="' + o.i + '"' + (a !== null ? ' disabled' : '') + '>' + fmt(o.t) + '</button>';
          }).join('') + '</div>' +
          (a !== null ? '<div class="why ' + (a === q.a ? 'ok' : 'no') + '" id="why' + qi + '" tabindex="-1"><strong>' + (a === q.a ? 'Correct.' : 'Not quite.') + '</strong> ' + fmt(q.why) + '</div>' : '') +
          '</div>';
      }).join('');
      if (all){
        const msg = score >= 4 ? 'Solid. You are ready to move on.' : 'Revisit the key points above and try again.';
        const idx = ORDER.indexOf(id);
        h += '<div class="score"><div><strong>' + score + ' / ' + L.mcq.length + '</strong><div>' + msg + '</div></div><div>' +
          '<button class="btn ghost" id="retry">Retry quiz</button> ' +
          (idx < ORDER.length - 1 ? '<a class="btn" href="#/lesson/' + ORDER[idx+1] + '">Next lesson</a>' : '') + '</div></div>';
      }
      box.innerHTML = h;
      if (focusQ !== undefined){ const w = $('why' + focusQ); if (w) w.focus({ preventScroll:true }); }
    }

    box.onclick = e => {
      const b = e.target.closest('.opt');
      if (b && !b.disabled){
        const qi = +b.dataset.q, oi = +b.dataset.o;
        answered[qi] = oi;
        draw(qi);
        if (answered.every(a => a !== null)){
          const score = answered.reduce((n,a,i) => n + (a === L.mcq[i].a ? 1 : 0), 0);
          DP.progress.record(id, score, L.mcq.length);
          DP.progress.updateTop(); DP.sidebar.render(id);
        }
        return;
      }
      if (e.target.id === 'retry'){
        order = L.mcq.map(q => shuffle(q.o.map((t,i) => ({t,i}))));
        answered = new Array(L.mcq.length).fill(null);
        draw();
        box.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    };
    draw();
  }

  DP.quiz = { mount: mountQuiz };
})();
