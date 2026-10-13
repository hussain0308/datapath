/* Datapath | app.js
 * Start-up. Loaded LAST. Checks that course manifests and lesson content agree (problems are printed to the
 * browser console, which is the place to look after adding a lesson), then shows the top-bar progress and
 * opens the page for the current URL hash.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

    function checkContent(){
      const problems = [];
      const seen = Object.create(null);

      const STANDARD_REQUIRED = [
        'title', 'tagline', 'what', 'why', 'points',
        'mistakes', 'example', 'practice', 'interview',
        'mcq', 'recap'
      ];

      const STATISTICS_REQUIRED = [
        'title', 'question', 'idea', 'reading',
        'limits', 'work', 'practice', 'recap', 'mcq'
      ];

      DP.curriculum.ORDER.forEach(id => {
        if (seen[id]) {
          problems.push('Lesson id appears twice in the course manifests: ' + id);
        }
        seen[id] = true;

        const L = DP.lessons[id];

        if (!L) {
          problems.push(
            'Listed in a course manifest but no lesson content registered: ' + id
          );
          return;
        }

        const requiredFields =
          L.format === 'statistics'
            ? STATISTICS_REQUIRED
            : STANDARD_REQUIRED;

        requiredFields.forEach(field => {
          if (L[field] == null) {
            problems.push(
              'Lesson "' + id + '" is missing "' + field + '"'
            );
          }
        });

        // Extended content in DP.deep is optional.
        // The lesson renderer supports lessons without it.
      });

      Object.keys(DP.lessons).forEach(id => {
        if (!seen[id]) {
          problems.push(
            'Lesson content exists but is not listed in any course manifest (unreachable): ' + id
          );
        }
      });

      Object.keys(DP.deep).forEach(id => {
        if (!DP.lessons[id]) {
          problems.push(
            'Extended content exists without core lesson content: ' + id
          );
        }
      });

      if (DP.interviewBank) {
        const questions = DP.interviewBank.all();

        const requiredInterviewCounts = {
          Excel: 60,
          SQL: 60,
          Python: 60,
          'Power BI': 60,
          'Data Analysis': 30,
          Statistics: 30,
          'Projects & Resume': 30,
          HR: 30
        };

        Object.keys(requiredInterviewCounts).forEach(area => {
          const count = questions.filter(
            q => q.area === area && q.kind === 'interview'
          ).length;

          const required = requiredInterviewCounts[area];

          if (count < required) {
            problems.push(
              'Interview bank "' + area + '" has ' + count +
              ' standard questions; at least ' + required +
              ' are required (MCQs and scenarios are counted separately)'
            );
          }
        });

        const scenarios = questions.filter(
          q => q.kind === 'scenario'
        ).length;

        if (scenarios < 40) {
          problems.push(
            'Interview bank has ' + scenarios +
            ' scenarios; at least 40 are required'
          );
        }
      }

      if (problems.length) {
        console.warn(
          '[Datapath] ' + problems.length +
          ' content problem(s):\n - ' + problems.join('\n - ')
        );
      } else {
        console.info('[Datapath] Content validation passed.');
      }
    }

  checkContent();
  DP.progress.updateTop();
  DP.navigation.route();
})();
