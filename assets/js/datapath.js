/* Datapath | datapath.js
 * Core namespace and registries. Loaded FIRST.
 *
 * The site is a static single-page app that uses plain <script> files (no build step, no ES modules),
 * so it works from a local server, from GitHub Pages and even from file://.
 * Every file hangs its public pieces off one global object: window.Datapath.
 *
 *   Datapath.courses   ordered list of course manifests (see courses/<name>/lessons.js)
 *   Datapath.lessons   lesson id -> core lesson content        (filled by courses/<name>/<topic>.js)
 *   Datapath.deep      lesson id -> extended lesson content    (filled by courses/<name>/<topic>.js)
 *   Datapath.datasets  course id -> sample tables used in lessons
 */
(function (root) {
  "use strict";
  const DP = root.Datapath = root.Datapath || {};

  DP.courses = [];
  DP.lessons = {};
  DP.datasets = {};

  /* Extended ("deep") content registry. Writing the same lesson id twice logs a warning. */
  DP.deep = new Proxy({}, {
    set(target, id, value) {
      if (Object.prototype.hasOwnProperty.call(target, id)) console.warn('[Datapath] Duplicate extended content for lesson id:', id);
      target[id] = value;
      return true;
    }
  });

  /* Register one course manifest (id, title, planned, blurb, sections). Order of registration = order in the app. */
  DP.registerCourse = function (course) {
    if (DP.courses.some(c => c.id === course.id)) { console.warn('[Datapath] Duplicate course id:', course.id); return; }
    DP.courses.push(course);
  };

  /* Add core lesson content: an object of { lessonId: {...lesson...} }. */
  DP.addLessons = function (lessons) {
    Object.keys(lessons).forEach(id => {
      if (Object.prototype.hasOwnProperty.call(DP.lessons, id)) console.warn('[Datapath] Duplicate lesson id:', id);
      DP.lessons[id] = lessons[id];
    });
  };
})(window);
