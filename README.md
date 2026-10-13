# Datapath

Learn data analytics one concept at a time. Excel and SQL are complete (178 lessons); Python, Power BI,
Statistics and Cleaning, EDA and case studies have course content. Interview preparation includes at least 60 standard interview questions each for Excel, SQL, Python and Power BI, at least 30 each for Data Analysis, Statistics, Projects & Resume and HR, 40 separate scenarios and interactive mock tests. Multiple-choice questions are counted separately from the standard-question minimums.

This is a static website: plain HTML, CSS and JavaScript. No framework, no build step, no backend.

---

## 1. Run it locally in VS Code

1. Unzip the project and open the `datapath` folder in VS Code (**File > Open Folder**).
2. Start a local server, using either option:
   - **Live Server extension (easiest):** install "Live Server" (Ritwick Dey), then right-click `index.html` and choose **Open with Live Server**.
   - **Terminal (needs Python):** open **Terminal > New Terminal** in VS Code and run
     `python -m http.server 8000` (on macOS/Linux you may need `python3`), then browse to <http://localhost:8000>.
3. Edit a file, save, refresh the browser.

Because the site uses ordinary `<script>` tags (not ES modules), double-clicking `index.html` also works.
A local server is still recommended, because it behaves like GitHub Pages.

> Your original single-file site is kept untouched at `backup/Datapath-original.html`.

---

## 2. Folder structure

```text
datapath/
├── index.html                  App shell: top bar, sidebar, main area, and the <script>/<link> tags
├── README.md
├── .nojekyll                   Tells GitHub Pages to serve files as-is (for later)
│
├── assets/
│   ├── css/
│   │   ├── main.css            Colour tokens (light and dark), reset, base elements, typography
│   │   ├── layout.css          Top bar, page grid, sidebar container, mobile drawer, page modes, responsive layout
│   │   └── components.css      Buttons, sidebar items, spreadsheet grid, tables, examples, quiz, pager, cards, landing sections
│   └── js/
│       ├── datapath.js         Core namespace (window.Datapath) and the lesson/course registries
│       ├── builders.js         Helpers lesson files use: withHl, T, X, P, Q, FL, RT, D
│       ├── utils.js            esc, fmt, li, shuffle, $ and two icons
│       ├── storage.js          Safe localStorage wrapper (falls back to memory)
│       ├── progress.js         Completion and best quiz score (key: datapath_progress_v1)
│       ├── curriculum.js       Builds the module list and the learning ORDER from the course manifests
│       ├── theme.js            Light/dark switching (key: datapath_theme)
│       ├── visuals.js          SVG charts, spreadsheet grids, Venn and flow diagrams
│       ├── search.js           Sidebar lesson search
│       ├── sidebar.js          Sidebar rendering, expandable modules and sections
│       ├── lesson.js           Lesson page: merges core + extended content, builds "On this page"
│       ├── quiz.js             Five-question quiz, feedback, score, retry
│       ├── navigation.js       Hash routing (#/, #/learn, #/module/<id>, #/lesson/<id>), menu drawer
│       ├── app.js              Start-up and a content check that reports problems in the browser console
│       └── pages/
│           ├── landing.js      Home page
│           └── modules.js      "Choose what you want to learn" page and single-module page
│
├── courses/
│   ├── excel/                  13 topic files (84 lessons), manifest and shared sample tables
│   │   ├── lessons.js          Manifest: sections and the ordered lesson ids (what the sidebar shows)
│   │   ├── datasets.js         Sample tables shared by Excel lessons (PRODUCTS, SALESLOG, ...)
│   │   ├── basics.js  math-ranking.js  logical-functions.js  lookup-functions.js  conditional-math.js
│   │   ├── text-functions.js  date-functions.js  dynamic-arrays.js  data-cleaning.js  tables-names.js
│   │   └── pivot-tables.js  charts-dashboards.js  power-query-macros.js
│   ├── sql/                    16 topic files (94 lessons), manifest and shared sample tables
│   │   ├── lessons.js  datasets.js     (EMP, DEPT, CUST, ORD)
│   │   ├── foundations.js  select-queries.js  filtering-sorting.js  aggregation.js  string-functions.js
│   │   ├── numeric-functions.js  date-functions.js  null-case-cast.js  joins.js  set-operations.js
│   │   └── subqueries.js  ctes.js  window-functions.js  creating-changing-data.js
│   │       design-performance.js  interview-patterns.js
│   ├── foundations/
│   │   ├── lessons.js          Six introductory lessons on framing, auditing and communicating analysis
│   │   └── content.js          Core and extended foundation lesson content
│   ├── python/  power-bi/  statistics/  case-studies/  interview-preparation/
│
├── backup/Datapath-original.html   Your untouched original file
├── docs/MIGRATION_REPORT.md        What was moved, what changed, what was tested
└── dev-tools/                      Optional scripts that compare this project to the original (not needed to run the site)
```

### How a lesson is stored

Every lesson has two layers, kept together in its topic file so a topic is edited in one place:

| Layer | Where it is written | Contains |
|---|---|---|
| Core | `DP.addLessons({ 'lesson-id': {...} })` | `title`, `tagline`, `prereq`, `what`, `why`, `syntax`, `compare`, `points`, `mistakes`, `example`, `practice`, `interview`, `mcq` (quiz), `recap` |
| Extended | `D('lesson-id', {...})` or `DEEP['lesson-id'] = {...}` | `level`, `tldr`, `intuition`, `how`, `diagrams`, `examples`, `edge`, `tiers`, `interviewPlus`, `ref`, `related` |

`lesson.js` loads both layers and merges them. Exercises, answers, hints, interview answers and quizzes stay inside
the lesson they belong to. The sidebar order and sections come only from `courses/<name>/lessons.js`.

---

## 3. Add a new lesson to an existing topic (Excel or SQL)

Example: a new SQL lesson `right-anti-join` in the Joins topic. You touch **only** these two files:

1. `courses/sql/lessons.js`: add the id to the right section, in the position you want it to appear:
   `{ title:'Joins', lessons:['inner-join', ..., 'multiple-joins', 'right-anti-join'] }`
2. `courses/sql/joins.js`:
   - inside `DP.addLessons({ ... })` add `'right-anti-join': { title:..., tagline:..., what:[...], ... mcq:[...], recap:[...] }`
     (copy an existing lesson in that file and edit it; the quiz needs 5 questions);
   - add the extended content below it: `DP.deep['right-anti-join'] = { ... }` (or a `D(...)` call).
     This part is optional; without it the lesson opens with the basic layout.

Open the site and check the browser console (F12). `app.js` prints a warning if an id is listed but missing,
duplicated, or incomplete.

To create a **new topic file** inside a course (for example `courses/sql/pivoting.js`): copy a small topic file such as
`courses/sql/ctes.js`, change the lessons, then add `<script src="courses/sql/pivoting.js"></script>` to `index.html`
inside the SQL block. The file must load **after** `courses/sql/lessons.js` and `datasets.js`.

Shared sample tables go in the course's `datasets.js`. Add the table, add its name to the export at the bottom,
then list it in the destructuring line at the top of the topic file that uses it.

---

## 4. Add a completely new technology (for example Python)

A placeholder already exists at `courses/python/lessons.js`. To make it real:

1. In `courses/python/lessons.js` fill in `sections:[ { title:'Python basics', lessons:['py-intro', ...] } ]`
   (keep `id`, `title`, `planned`, `blurb`).
2. Create topic files in the same folder, for example `courses/python/basics.js`, containing
   `window.Datapath.addLessons({...})` and the extended content. Copy the shape of a small Excel or SQL topic file.
   If the course needs sample tables, create `courses/python/datasets.js` that sets `window.Datapath.datasets.python = {...}`.
3. In `index.html`, add `<script src="courses/python/basics.js"></script>` (and `datasets.js`) right after the
   `courses/python/lessons.js` line. The order of the course blocks in `index.html` is the order in the sidebar.

For a brand-new technology that has no placeholder (for example `courses/tableau/`):
create `courses/tableau/lessons.js` calling `window.Datapath.registerCourse({ id:'tableau', title:'Tableau', planned:'...', blurb:'...', sections:[...] })`,
add its topic files, and add the script tags in the position you want it to appear in the sidebar.

Optional: the home page copy ("Tools and topics you will learn", "What you will be able to do") is plain text in
`assets/js/pages/landing.js`. Update it when a course goes live; nothing else depends on it.

---

## 5. Why it is built this way

- **Kept as a single-page app.** Your site is one page that switches views by URL hash (`#/lesson/vlookup`). That is ideal for
  GitHub Pages (no server rules needed) and keeps every existing link working, so it was kept. The shell (`index.html`),
  styles, application code and course content are now separate files.
- **Plain `<script>` files sharing one object (`window.Datapath`), not ES modules.** The original runs without a server and
  with no tooling; this keeps both true. Modules would force a local server and a rewrite of 1.4 MB of lesson data.
- **No `pages/home.html`, `dashboard.html`, `about.html`, `assets/images/`, per-course `index.html` or `exercises.js`.**
  The original has no dashboard or about page, uses no image files (all icons and charts are inline SVG), and
  its home and module pages are generated by JavaScript. Its exercises live inside each lesson (practice, tiered practice,
  interview questions, quiz). Splitting them out would break lessons apart, so they stay with their topic.
  Folders and files can be added when real content exists.
- **Excel and SQL are in separate folders with separate topic files**, and neither is mixed into the application code.

## 6. Features found in the original and preserved

Landing page; "Choose a module" page; module page with section lists; sidebar with expandable modules and sections
and per-section completion counts; lesson search (title and tagline); lesson pages with a table of contents, previous/next,
related and prerequisite links; spreadsheet-style tables with highlighted cells, SVG charts, Venn and flow diagrams, code blocks;
reveal blocks (hint, solution, interview answers); five-question quizzes with shuffled options, per-answer feedback, score and retry;
progress (top-bar count and bar, sidebar ticks) saved in `localStorage`; light/dark theme (saved, and follows the system by default);
responsive layout with a mobile menu drawer; hash URLs and direct lesson links; "Coming soon" modules.
There is no dashboard, login, or server feature in the original, and none was added.

Browser storage keys are unchanged (`datapath_progress_v1`, `datapath_theme`), so existing progress carries over.

## 7. Deploying later (not done)

Nothing here touches Git or GitHub. When you are ready: push the folder to a repository, then
**Settings > Pages > Deploy from a branch** and choose the root folder. All paths are relative, so the site works at
`https://<user>.github.io/<repo>/`. `.nojekyll` is already included. Remove `dev-tools/` and `docs/` first if you prefer a lean repository.
