/* Datapath | progress.js
 * Lesson completion and best quiz scores, saved in the browser.
 * Storage key is unchanged from the original site (datapath_progress_v1), so existing progress keeps working.
 * Data shape: { "<lessonId>": { best: <score>, total: <questions> } }
 * Exposed as Datapath.progress.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $ } = DP.utils;
  const KEY = 'datapath_progress_v1';

  let data = {};
  try { data = JSON.parse(DP.store.get(KEY) || '{}') || {}; } catch (e) { data = {}; }

  function save(){ DP.store.set(KEY, JSON.stringify(data)); }
  function isDone(id){ return !!data[id]; }

  function markDone(id){
    data[id] = Object.assign({}, data[id], { completed:true });
    save();
  }

  /* Called when a quiz is finished: keeps the best score so far. */
  function record(id, score, total){
    const prev = data[id] && typeof data[id].best === 'number' ? data[id].best : 0;
    data[id] = Object.assign({}, data[id], { best:Math.max(prev, score), total });
    save();
  }

  /* Top bar text ("N of M lessons") and progress bar width. */
  function updateTop(){
    const ORDER = DP.curriculum.ORDER;
    const total = ORDER.length, done = ORDER.filter(isDone).length;
    $('progText').textContent = done + ' of ' + total + ' lessons';
    $('progBar').style.width = (total ? Math.round(done / total * 100) : 0) + '%';
  }

  DP.progress = { data, isDone, save, markDone, record, updateTop };
})();
