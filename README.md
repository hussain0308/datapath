# Datapath — Data Analytics Learning Platform

**Learn data analytics one concept at a time.**

Datapath is a free, interactive learning platform designed to help aspiring data analysts learn practical concepts, practise technical skills, and prepare for interviews.

The platform uses plain HTML, CSS, and JavaScript, with individual course files that make it easy to maintain existing lessons and add new learning content.

## ✨ Features

- **Excel:** Formulas, lookup functions, data cleaning, pivot tables, charts, and dashboards.
- **SQL:** Queries, filtering, joins, aggregations, subqueries, CTEs, window functions, and more.
- **Python:** Learn data analysis concepts and practise with examples.
- **Power BI:** Explore business intelligence and reporting concepts.
- **Statistics and Data Analysis:** Build an understanding of analytical concepts and practical problem-solving.
- **Case Studies:** Practise applying analytical skills to business problems.
- **Interview Preparation:** Technical questions, scenario-based questions, interview answers, and interactive mock tests.
- **Interactive Learning:** Examples, practice exercises, quizzes, answer feedback, and lesson navigation.
- **Progress Tracking:** Save lesson completion and quiz scores in your browser.
- **Light and Dark Themes:** Switch between themes to suit your preference.
- **Responsive Design:** Use the platform on desktop and mobile devices.

Excel and SQL contain 178 lessons combined. Other modules contain learning content that can be expanded as development continues.

## 🚀 Getting Started

Datapath is a static website. It does not require a backend, database, framework, or build process.

### Option 1: Run with VS Code

1. Download or clone this repository.
2. Open the `datapath` folder in Visual Studio Code.
3. Install the **Live Server** extension by Ritwick Dey if it is not already installed.
4. Right-click `index.html`.
5. Select **Open with Live Server**.

Your browser will open the website on a local development address.

### Option 2: Run with Python

Open a terminal in the project root and run:

```bash
python -m http.server 8000
```

Then open:

<http://localhost:8000>

If `python` is not recognized, try `python3 -m http.server 8000` where supported.

## 📁 Project Structure

```text
datapath/
├── index.html
├── about.html
├── contact.html
├── privacy.html
├── README.md
├── .nojekyll
│
├── assets/
│   ├── css/
│   └── js/
│       └── pages/
│
├── courses/
│   ├── excel/
│   ├── sql/
│   ├── python/
│   ├── power-bi/
│   ├── statistics/
│   ├── foundations/
│   ├── case-studies/
│   └── interview-preparation/
│
├── docs/
└── dev-tools/
```

### What the main folders contain

| Path | Purpose |
|---|---|
| `index.html` | Main website entry point and script loading |
| `assets/css/` | Website styles, layout, and components |
| `assets/js/` | Application logic, navigation, quizzes, progress, and theme settings |
| `assets/js/pages/` | JavaScript that renders landing and module pages |
| `courses/` | Course manifests, lesson content, examples, and exercises |
| `docs/` | Project documentation |
| `dev-tools/` | Optional scripts for development and content checks |

## 📚 Adding and Updating Lessons

Course content is organized into separate files to make future development easier.

### Add a lesson to an existing topic

1. Open the appropriate course manifest, such as `courses/sql/lessons.js`.
2. Add the new lesson ID to the correct section.
3. Open the corresponding topic file, such as `courses/sql/joins.js`.
4. Add the lesson content using the existing structure.
5. Include examples, practice questions, answers, and quiz questions as appropriate.
6. Run the website locally and verify that the lesson appears correctly.

Keep lesson IDs unique and ensure the manifest ID matches the ID used in the lesson content.

### Add a new topic

1. Create the new topic file inside the appropriate course folder.
2. Follow the existing lesson structure.
3. Add a script reference to `index.html` in the correct loading order.
4. Test the new topic and check the browser console for errors.

For more detailed development instructions, see the documentation in `docs/` and the existing course files.

## 🌐 Deployment

Datapath can be hosted on **GitHub Pages** without a paid hosting service.

To publish the website:

1. Push the project files to a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/(root)` folder.
5. Click **Save** and wait for deployment to finish.

For a repository named `datapath`, the published address follows this format:

`https://hussain0308.github.io/datapath/`

The address becomes available after GitHub Pages successfully deploys the site.

## 🔒 Privacy and Storage

Datapath does not require visitor accounts or a backend for its current functionality.

- Lesson progress and theme preferences are stored in the visitor's browser.
- Browser storage may be cleared by the visitor or by their browser settings.
- The website loads fonts from Google Fonts.
- Any future analytics, advertising, or third-party integrations should be documented according to their actual data collection and cookie practices.

Read the [Privacy Policy](privacy.html) for further information.

## 🛠️ Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`
- Git and GitHub
- GitHub Pages

No JavaScript framework, application server, or build step is required for the current website.

## 🎯 Project Goal

The goal of Datapath is to provide an accessible place for aspiring data analysts to learn concepts, practise with examples, improve problem-solving skills, and prepare for data analytics interviews.

The platform is being developed incrementally, with course content and features added as they are completed.

---

**Datapath — Learn. Practise. Analyse. Grow.**
