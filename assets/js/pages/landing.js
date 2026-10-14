/* Datapath | pages/landing.js
 * The marketing/home page (hero, what you get, tools and topics, outcomes, how it works).
 * The "Coming soon" / "Complete" status text for each track is page copy and lives here.
 * Exposed as Datapath.pages.landing.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { gridHTML } = DP.visuals;
  const { withHl } = DP.builders;
  const { $, esc } = DP.utils;

/* ---------- Landing ---------- */
function renderLanding(){
  const demo = gridHTML(withHl(DP.datasets.excel.PRODUCTS, {'A4':'find','D4':'hit','A2:D6':'range'}, 'Sheet: Products'));
  const tracks = [
    ['Analytics foundations','Available now',true,['Frame an analysis around a decision','Turn requests into measurable questions','Understand row grain and define metrics','Audit data before using it','Explore patterns responsibly','Communicate evidence and limitations']],
    ['Excel','Complete: all Excel lessons available',true,['Excel basics, math and ranking functions','Logical, lookup and conditional-math functions','Text, date and dynamic array functions','Sorting, cleaning, validation and formatting tools','PivotTables, charts and dashboards','Power Query, macros and VBA basics']],
    ['SQL','Complete: all SQL lessons available',true,['SQL foundations, SELECT, WHERE, ORDER BY and LIMIT','Aggregates, GROUP BY and HAVING','String, numeric and date functions','NULLs, CASE and CAST','Joins, set operations, subqueries and CTEs','Window functions','Creating and changing data, indexes, views, transactions','Design, optimization and interview patterns']],
    ['Python and Pandas','Available now',true,['Python basics for analysts','NumPy arrays','Pandas: cleaning, grouping and merging','Matplotlib and Seaborn charts','Exploratory data analysis']],
    ['Power BI','Complete: all Power BI lessons available',true,['Connect to data and prepare it in Power Query','Build a star schema and write DAX measures','Design interactive, accessible reports','Publish, refresh and secure content in the Power BI service']],
    ['Statistics','Available now',true,['Mean, median, mode and spread','Distributions and outliers','Correlation','Hypothesis testing','A/B testing']],
    ['Cleaning, EDA and case studies','Available now',true,['Audit and clean data reliably','Explore distributions, trends and relationships','Work through retail, churn, delivery and marketing cases']],
    ['Interview preparation','Available now',true,['Practise tool, analysis, statistics and HR questions','Work through practical analyst scenarios','Take a mock test and review your answers']]
  ];
  const can = [
    ['Analytics foundations','Available now',true,['Turn a business request into a measurable question','Check what each row represents and define meaningful metrics','Audit and explore data without overstating results','Communicate findings with context, limitations and next steps']],
    ['Excel','Available now',true,['Pull data between sheets with lookups, and explain which lookup suits which job','Make formulas decide with IF, AND, OR and IFERROR','Summarise data by condition with COUNTIFS, SUMIFS and AVERAGEIFS','Clean data with text and date functions, then summarise it in PivotTables and charts','Build a simple dashboard with slicers, KPIs and charts','Clean messy data and summarise it with pivot tables','Build clear charts and a one-page dashboard']],
    ['SQL','Available now',true,['Write queries with filters, grouping and joins','Use subqueries, CTEs and window functions for rankings and running totals','Clean and reshape data with CASE, string and date functions','Solve classic interview questions such as second highest salary and top N per group']],
    ['Python and Pandas','Available now',true,['Load, clean and reshape data with Pandas','Explore a dataset and chart it with Matplotlib and Seaborn','Explain why vectorised code beats loops']],
    ['Power BI','Available now',true,['Prepare data in Power Query','Model tables with a star schema and write DAX measures','Build interactive reports and manage Power BI service content']],
    ['Statistics and case studies','Available now',true,['Explain averages, spread, correlation and the idea behind A/B tests','Clean and explore data, then work through business cases from question to recommendation']],
    ['Interview confidence','Available in every lesson',true,['Explain each topic in plain English, the way interviewers expect','Handle scenario questions by walking through your approach step by step']]
  ];
  const st = (t, live) => `<span class='status ${live ? 'live' : ''}'>${esc(t)}</span>`;
  const trackTitle = t => t[0] === 'Interview preparation'
    ? `<a class='track-link' href='#/interview'>${esc(t[0])}</a>`
    : `<b>${esc(t[0])}</b>`;
  const items = a => a.map(x => `<li>${esc(x)}</li>`).join('');
  $('view').innerHTML = `
<section class='hero'>
  <div>
    <h1>Learn data analytics one concept at a time</h1>
    <p class='lede'>Short bullet lessons on Excel, SQL, Python and Power BI. Every topic comes with a real example, a practice question, interview questions and a quick quiz.</p>
    <div class='cta-row'><a class='btn big' href='#/learn'>Start learning</a><button class='btn ghost big' data-scroll='outcomes'>See what you will learn</button><a class='btn ghost big' href='jobs/'>Jobs &amp; Internships</a></div>
    <p class='fine'>Free to use. No login. Progress is saved in your browser.</p>
  </div>
  <div class='demo'>
    <p class='cap'>A taste of a lesson: the VLOOKUP example</p>
    <div class='code'>=VLOOKUP(&quot;P103&quot;, A2:D6, 4, FALSE)</div>
    ${demo}
    <div class='result'>Returns 1499, the price of P103.</div>
  </div>
</section>

<section class='sect' id='offer'>
  <h2>What you get in every lesson</h2>
  <p class='sect-lede'>One topic per lesson, always in the same order, so you always know where you are.</p>
  <dl class='inc'>
    <div><dt>Short explanation</dt><dd>Plain-English bullet points, the syntax, key points and common mistakes.</dd></div>
    <div><dt>Real-world example</dt><dd>A small business scenario with sample data laid out like a real sheet.</dd></div>
    <div><dt>Practice question</dt><dd>Try it yourself, then open the hint and the solution.</dd></div>
    <div><dt>Interview questions</dt><dd>Basic, intermediate and scenario questions on that topic only, with answers you can say out loud.</dd></div>
    <div><dt>Five-question check</dt><dd>Instant feedback and a one-line reason for every answer.</dd></div>
    <div><dt>Recap</dt><dd>Three points to remember before you move on.</dd></div>
  </dl>
</section>

<section class='sect' id='tools'>
  <h2>Tools and topics you will learn</h2>
  <p class='sect-lede'>The tools analysts use every day, taught from the basics. Each function or concept has its own lesson.</p>
  <div class='tracks'>${tracks.map(t => `<div class='tr'><div>${trackTitle(t)}${st(t[1], t[2])}</div><ul>${items(t[3])}</ul></div>`).join('')}</div>
</section>

<section class='sect' id='outcomes'>
  <h2>What you will be able to do</h2>
  <p class='sect-lede'>After you finish a module, you should be able to do these things without looking them up.</p>
  <div class='can-grid'>${can.map(c => `<div class='can'><h3>${esc(c[0])}</h3>${st(c[1], c[2])}<ul>${items(c[3])}</ul></div>`).join('')}</div>
  <p class='note'>Datapath builds your knowledge and your interview answers. Employers also look at what you have built, so pair the lessons with small projects on real datasets.</p>
</section>

<section class='sect' id='how'>
  <h2>How it works</h2>
  <div class='flow'>
    <div><span class='n'>1</span><b>Read the lesson</b><p>A few minutes of clear bullet points and one real example.</p></div>
    <div><span class='n'>2</span><b>Practise and prepare</b><p>Solve the practice question, then answer the interview questions out loud.</p></div>
    <div><span class='n'>3</span><b>Check yourself</b><p>Take the five-question quiz, see your score and move to the next topic.</p></div>
  </div>
</section>

<section class='sect' id='who'>
  <h2>Who it is for</h2>
  <ul>
    <li>Final-year students and recent graduates aiming for Data Analyst, MIS Executive or Business Analyst roles.</li>
    <li>Freshers who know some of the tools but freeze when an interviewer asks them to explain.</li>
    <li>Career switchers who want a clear, ordered path instead of scattered videos.</li>
  </ul>
</section>

<section class='final'>
  <h2>Ready to start?</h2>
  <p>Begin with Excel basics. Each lesson takes a few minutes.</p>
  <a class='btn big' href='#/learn'>Start learning</a>
</section>
<p class='foot'>Datapath is free. Progress is saved in this browser only. New modules are added in batches.</p>`;
  document.title = 'Datapath | Learn data analytics one concept at a time';
  DP.sidebar.render(null);
}

  DP.pages = DP.pages || {};
  DP.pages.landing = renderLanding;
})();
