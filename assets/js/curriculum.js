/* Datapath | curriculum.js
 * Builds the curriculum from the registered course manifests (courses/<name>/lessons.js).
 * Must load AFTER all course files and BEFORE the pages. Exposed as Datapath.curriculum.
 *   modules          ordered list of courses (each with sections and lesson ids)
 *   ORDER            every lesson id in learning order (drives previous/next and progress totals)
 *   lessonModule(id) { m: course, s: section } that contains a lesson
 *   modLessons(m)    all lesson ids of one course
 */
(function () {
  "use strict";
  const DP = window.Datapath;

  const modLessons = m => m.sections.flatMap(s => s.lessons || []);

  DP.curriculum = {
    modules: DP.courses,
    ORDER: DP.courses.flatMap(modLessons),
    lessonModule(id){
      for (const m of DP.courses) for (const s of m.sections) if ((s.lessons || []).includes(id)) return { m, s };
      return null;
    },
    modLessons
  };
})();
