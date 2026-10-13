/* Datapath | search.js
 * Lesson search. The search box lives at the top of the sidebar; typing filters lessons by title and tagline.
 * Exposed as Datapath.search. The sidebar calls search.lessons(query) to get matching lesson ids.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $ } = DP.utils;

  const search = {
    query: '',
    lessons(q){
      const ORDER = DP.curriculum.ORDER, LESSONS = DP.lessons;
      return ORDER.filter(id => (LESSONS[id].title + ' ' + LESSONS[id].tagline).toLowerCase().includes(q));
    }
  };
  DP.search = search;

  $('sidebar').addEventListener('input', e => {
    if (e.target.id === 'search'){ search.query = e.target.value; const m = location.hash.match(/^#\/lesson\/([\w-]+)/); DP.sidebar.render(m ? m[1] : null); }
  });
})();
