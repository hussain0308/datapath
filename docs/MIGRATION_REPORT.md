# Migration report

Source: `backup/Datapath-original.html` (1,478,203 bytes, 12,701 lines: one `<style>` block, one 12,300-line `<script>`).
Result: 62 files in the site (excluding `backup/` and `dev-tools/`), about 1.5 MB in total. The largest file is
`courses/sql/window-functions.js` (about 91 KB); the original was one 1.4 MB file.

## What the original contained (inspected before changing anything)

- One IIFE holding: storage and progress; the curriculum map (8 modules: Foundations, Excel, SQL, Python, Power BI, Statistics,
  Cleaning/EDA/case studies, Interview hub); shared sample tables; 178 core lessons (84 Excel, 94 SQL);
  178 extended ("DEEP") entries (73 written out in full, 105 made with the compact `D()` builder); then the application code
  (sidebar, search, landing, module pages, lesson renderer, charts, grids, diagrams, quiz, routing, theme).
- Every lesson id in the curriculum has exactly one core entry and one extended entry (no duplicates, none missing).
- Only Excel and SQL have lessons. The other six modules are placeholders with empty `sections`.

## What was moved where

| Original | New location |
|---|---|
| `<style>` (279 rules) | `assets/css/main.css` (21), `layout.css` (40), `components.css` (218) |
| Header, sidebar, main, scrim markup | `index.html` (unchanged) |
| `CURRICULUM` entries + `MODBLURB` | one manifest per course: `courses/<name>/lessons.js` |
| Excel sample tables (24) / SQL sample tables (EMP, DEPT, CUST, ORD) | `courses/excel/datasets.js` / `courses/sql/datasets.js` |
| `withHl, T, X, P, Q, FL, RT, D` | `assets/js/builders.js` |
| 178 core lessons + 178 extended entries | 13 Excel and 16 SQL topic files (below); each file holds core and extended content for its lessons |
| Storage / progress / theme / search / sidebar / pages / lesson / quiz / visuals / routing | `storage.js`, `progress.js`, `theme.js`, `search.js`, `sidebar.js`, `pages/*.js`, `lesson.js`, `quiz.js`, `visuals.js`, `navigation.js` |

### Lesson to file map

**Excel**

| File | Lessons |
|---|---|
| `courses/excel/basics.js` | 7: cell-references, sum, average, count, counta, max, min |
| `courses/excel/math-ranking.js` | 6: round, rank, large, small, sumproduct, subtotal |
| `courses/excel/logical-functions.js` | 8: if, nested-if, ifs, and, or, not, if-and-or, iferror |
| `courses/excel/lookup-functions.js` | 7: vlookup, hlookup, xlookup, index, match, index-match, lookup-compare |
| `courses/excel/conditional-math.js` | 9: criteria, countif, countifs, sumif, sumifs, averageif, averageifs, maxifs, minifs |
| `courses/excel/text-functions.js` | 13: left, right, mid, len, trim, upper, lower, proper, concat, textjoin, substitute, find, text |
| `courses/excel/date-functions.js` | 8: today, year, month, day, date, datedif, eomonth, networkdays |
| `courses/excel/dynamic-arrays.js` | 3: unique, filter-function, sort-function |
| `courses/excel/data-cleaning.js` | 8: sort, filter, remove-duplicates, text-to-columns, flash-fill, find-replace, data-validation, conditional-formatting |
| `courses/excel/tables-names.js` | 2: excel-tables, named-ranges |
| `courses/excel/pivot-tables.js` | 5: pivot-basics, pivot-fields, pivot-grouping, slicers, calculated-field |
| `courses/excel/charts-dashboards.js` | 5: column-chart, line-chart, pie-chart, combo-chart, dashboard |
| `courses/excel/power-query-macros.js` | 3: power-query, macros, vba-basics |

**SQL**

| File | Lessons |
|---|---|
| `courses/sql/foundations.js` | 5: sql-intro, sql-data-types, primary-key, foreign-key, sql-command-types |
| `courses/sql/select-queries.js` | 3: select, select-distinct, aliases |
| `courses/sql/filtering-sorting.js` | 8: where, sql-and-or-not, in-sql, between-sql, like-sql, is-null, order-by, limit-sql |
| `courses/sql/aggregation.js` | 8: count-sql, count-distinct, sum-sql, avg-sql, max-sql, min-sql, group-by, having |
| `courses/sql/string-functions.js` | 7: upper-sql, lower-sql, length-sql, substring-sql, concat-sql, trim-sql, replace-sql |
| `courses/sql/numeric-functions.js` | 4: round-sql, ceil-sql, floor-sql, mod-sql |
| `courses/sql/date-functions.js` | 6: now-curdate, year-sql, month-sql, date-format, datediff, date-add |
| `courses/sql/null-case-cast.js` | 5: coalesce, ifnull, nullif, case-when, cast-sql |
| `courses/sql/joins.js` | 7: inner-join, left-join, right-join, full-outer-join, cross-join, self-join, multiple-joins |
| `courses/sql/set-operations.js` | 3: union, union-all, intersect-except |
| `courses/sql/subqueries.js` | 5: subquery-where, derived-table, correlated-subquery, exists-sql, any-all |
| `courses/sql/ctes.js` | 2: cte, recursive-cte |
| `courses/sql/window-functions.js` | 10: window-intro, row-number, rank-sql, dense-rank, ntile, lag, lead, first-value, running-total, moving-average |
| `courses/sql/creating-changing-data.js` | 10: create-table, alter-table, drop-truncate, insert-into, update-sql, delete-sql, constraints, indexes, views, transactions |
| `courses/sql/design-performance.js` | 4: normalization, execution-order, query-optimization, stored-procedures |
| `courses/sql/interview-patterns.js` | 7: second-highest, top-n-per-group, find-duplicates, customers-without-orders, month-over-month, pivot-with-case, delete-duplicate-rows |

## What was changed (code, not content)

1. Lesson text, formulas, queries, tables, hints, solutions, answers, quizzes and recaps were **copied verbatim** (see tests).
2. Application code was moved with its logic intact. These deliberate edits were needed to split one closure into files:
   - shared variables became properties of `window.Datapath` (`progress` object, `search.query`, `sidebar.state`);
   - `saveProgress()` + the best-score update became `Datapath.progress.record()`; `updateTopProgress()` became `progress.updateTop()`;
   - the module blurbs (`MODBLURB`) moved into each course manifest as `blurb`;
   - the landing-page demo table now reads `Datapath.datasets.excel.PRODUCTS`;
   - each topic file imports only the helpers and tables it uses.
3. Added: `app.js` start-up content check (console warnings for duplicate, missing or unreachable lesson ids; no change to what users see),
   a duplicate-id warning when registering lessons, `.nojekyll`, README, this report, `dev-tools/`.
4. The CSS was split by purpose. Rule text is unchanged; only file placement and rule order across files changed (see tests).
5. Not added: no framework, library, backend, database, login, build tool or dependency. Nothing was deployed and no Git repository was touched.

## Tests performed

Each was run against the original file and the refactored project.

| Test | Result |
|---|---|
| Core content of all 178 lessons, deep-compared (JSON) | identical |
| Extended content of all 178 lessons, deep-compared | identical |
| 392 original source blocks (lessons, extended entries, tables, section lists; 1,378 KB) searched verbatim in the new files | 0 missing |
| Curriculum, learning order (ORDER), module blurbs, 10 sample tables | identical |
| Duplicate lesson ids, missing content, unreachable lessons, broken script or stylesheet references | none (start-up check prints nothing; build refuses missing files) |
| Rendered HTML (page, sidebar, title, body class, progress) for 185 routes: landing, modules, both course pages, unfinished-module redirects, invalid lesson, all 178 lessons | identical |
| Search ("join", "sum", "Window", empty, no-match), sidebar expand/collapse | identical |
| Quiz answers, feedback, score card, retry, saved progress, top-bar count, sidebar ticks | identical |
| Progress saved by the **original** site and the saved dark theme read by the refactor | identical (storage keys unchanged) |
| Theme toggle and mobile drawer | identical |
| CSS: all 279 rules present; cascade computed for 16 pages x 4 widths x 2 schemes (about 305,000 element/pseudo-element comparisons) | 0 differences. Deliberately wrong file order: detected (negative control) |
| Real Chromium screenshots, original vs refactor: 7 pages x desktop/mobile x light/dark (28) | pixel-identical (with scroll position reset and fixed random seed for quiz shuffling) |
| Real Chromium, over `http://` and `file://`: direct links, reload, back/forward, search, next lesson, quiz, progress persistence, theme persistence, all 178 lessons render, mobile drawer, "Coming soon" modules, console errors | 34/34 passed, no console errors |
| Static lint for undefined variables | none |
| Adding a lesson by the README procedure (on a scratch copy) | appears in sidebar, totals and previous/next, no warnings |

Re-run the comparison yourself (needs Node.js): `cd dev-tools && npm install && npm run verify`.

## Not verified

- Other browsers (Firefox, Safari) and real phones or tablets; only Chromium was used.
- Google Fonts: this test environment has no internet access, so both versions fell back to system fonts. The font link is unchanged.
- Load-time performance on GitHub Pages. The page still loads about 1.5 MB of script like the original, now across 55 script files instead of one;
  this is normally fine on HTTP/2 hosting, but it was not measured.
- Deployment (not done, as requested).
