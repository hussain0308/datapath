/* Datapath | Interview hub | question registry
 * Interview records use plain browser JavaScript, matching the rest of the site.
 * Each question has an area, kind, difficulty, prompt and a sample response or explanation.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const items = [];
  const ids = new Set();
  const guidance = {
    interview:'Answer the question directly, explain your reasoning in your own words, and add an example you can honestly support.',
    scenario:'Talk through the situation in order: clarify the goal, explain what you would check, then say what you would do and report.',
    mcq:'After choosing, explain why that option fits the question and why a tempting alternative does not.'
  };

  DP.interviewBank = {
    add(questions){
      questions.forEach(q => {
        if (!q.id || ids.has(q.id)) {
          console.warn('[Datapath] Missing or duplicate interview question id:', q.id);
          return;
        }
        if (!q.area || !q.kind || !q.difficulty || !q.question || !q.answer) {
          console.warn('[Datapath] Incomplete interview question:', q.id);
          return;
        }
        if (q.kind === 'mcq' && (!Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length)) {
          console.warn('[Datapath] Invalid interview multiple-choice question:', q.id);
          return;
        }
        ids.add(q.id);
        q.guidance = q.guidance || (q.area === 'HR' || q.area === 'Projects & Resume'
          ? 'Use the sample as a starting point, then replace details with your own verified experience. Be clear about your contribution and do not claim impact you cannot measure.'
          : guidance[q.kind]);
        items.push(q);
      });
    },
    all(){ return items.slice(); }
  };
})();
