/* Datapath | SQL | Common table expressions (CTEs)
 * Lessons in this file: cte, recursive-cte
 *
 * Every lesson has two layers, kept together here so a topic can be edited in one place:
 *   1. Core content      Datapath.addLessons({...})   what it is, why, syntax, key points, mistakes, example,
 *                                                       practice, interview questions, quiz, recap
 *   2. Extended content  Datapath.deep (D(...))       overview, step-by-step, diagrams, extra worked examples,
 *                                                       edge cases, tiered practice, deeper interview answers,
 *                                                       quick reference, related lessons
 * The lesson page loads both layers and merges them.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { withHl, T, X, P, Q, FL, D, RT } = DP.builders;
  const { EMP, CUST, ORD } = DP.datasets.sql;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- cte --- */
'cte': {
  title:'CTE (WITH clause)', tagline:'Name a subquery and reuse it, so queries read top to bottom.',
  prereq:['derived-table'],
  what:['A **CTE** (Common Table Expression) is a named temporary result defined with WITH.','You can use it like a table in the main query.','It makes complex queries easier to read.'],
  why:['Break a problem into clear steps.','Interviewers like readable SQL.'],
  syntax:{ code:'WITH name AS (\n  SELECT ...\n)\nSELECT ...\nFROM name;', parts:[['WITH name AS (...)','Defines the CTE.'],['SELECT ... FROM name','The main query uses it.']] },
  points:['Needs **MySQL 8.0 or later** (and is standard in other systems).','You can define several CTEs separated by commas.','A CTE exists only for that one statement.','Can be referenced more than once in the main query.','A CTE is not stored; it is not a view.'],
  mistakes:['Using a CTE in MySQL 5.7.','Forgetting the comma between several CTEs.','Thinking CTE results are saved.'],
  example:{ title:'Above the department average', scenario:'You want employees above their department average, shown with that average.',
    table:T(EMP,'Table: employees'), task:'Compute the averages in a CTE first.', formula:'WITH dept_avg AS (\n  SELECT dept_id, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY dept_id\n)\nSELECT e.name, e.salary, d.avg_sal\nFROM employees e\nJOIN dept_avg d ON e.dept_id = d.dept_id\nWHERE e.salary > d.avg_sal;',
    steps:['The CTE dept_avg holds one average per department.','The main query joins employees to it and filters.'],
    table2:{ rows:[['name','salary','avg_sal'],['Chitra',60000,55000]], caption:'Result' }, result:'Chitra earns 60000 against a department average of 55000.' },
  practice:{ q:'Write a CTE named totals that sums orders per customer, then select the customers with a total above 1500.', table:T(ORD,'Table: orders'), hint:'WITH totals AS (...) SELECT ... FROM totals WHERE ...', solution:'WITH totals AS (\n  SELECT customer_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT customer_id, total\nFROM totals\nWHERE total > 1500;', explain:'Customers 101 (3300) and 102 (1700) qualify.' },
  interview:[
    { level:'Basic', q:'What is a CTE?', a:'A named temporary result set defined with WITH, which the main query can use like a table.' },
    { level:'Intermediate', q:'CTE versus subquery?', a:'They can produce the same result. A CTE is named, readable, and can be reused in the same statement, so I prefer it for multi-step logic.' },
    { level:'Intermediate', q:'Is a CTE the same as a view or a temp table?', a:'No. A CTE exists only for one statement. A view is stored in the database, and a temp table holds data for the session.' },
    { level:'Scenario', q:'How do you chain steps?', a:'Define several CTEs separated by commas, where later ones can use earlier ones: WITH a AS (...), b AS (SELECT ... FROM a) SELECT ... FROM b;' }
  ],
  mcq:[
    { q:'Which keyword starts a CTE?', o:['WITH','USING','TEMP','LET'], a:0, why:'WITH name AS (...).' },
    { q:'How long does a CTE exist?', o:['For one statement','For the session','Forever','Until restart'], a:0, why:'It is temporary.' },
    { q:'MySQL version needed:', o:['8.0 or later','5.7','5.0','Any'], a:0, why:'CTEs arrived in MySQL 8.' },
    { q:'Several CTEs are separated by:', o:['Commas','Semicolons','Nothing','UNION'], a:0, why:'WITH a AS (...), b AS (...)' },
    { q:'Is a CTE stored in the database?', o:['No','Yes','Only recursive','Only in views'], a:0, why:'It lives within the statement.' }
  ],
  recap:['A CTE names a subquery with WITH.','It exists for one statement only.','Chain several CTEs for step-by-step logic (MySQL 8+).']
},

/* --- recursive-cte --- */
'recursive-cte': {
  title:'Recursive CTE', tagline:'Repeat a query on its own output, such as walking a hierarchy.',
  prereq:['cte','self-join'],
  what:['A recursive CTE refers to itself.','It starts with an **anchor** query, then repeatedly adds rows with a **recursive** query.','It stops when no new rows are produced.'],
  why:['Org charts, category trees and sequences of numbers or dates.','A favourite advanced interview question.'],
  syntax:{ code:'WITH RECURSIVE name AS (\n  SELECT ...          -- anchor\n  UNION ALL\n  SELECT ... FROM name JOIN ... -- recursive part\n)\nSELECT * FROM name;', parts:[['Anchor','The starting rows.'],['Recursive part','Uses the CTE itself to find the next level.'],['UNION ALL','Joins the two parts.']] },
  points:['MySQL needs the word **RECURSIVE**.','Make sure it ends: add a stop condition or a level limit.','Keep a level counter to see the depth.','Use for hierarchies of unknown depth.','A runaway recursion is stopped by a limit setting.'],
  mistakes:['No stopping condition.','Forgetting RECURSIVE in MySQL.','Cycles in the data causing endless loops.'],
  example:{ title:'The reporting chain', scenario:'You want every employee with their level, starting from the person with no manager.',
    table:withHl(EMP,{'E2:E7':'range'},'Table: employees'), task:'Walk down the hierarchy.', formula:'WITH RECURSIVE org AS (\n  SELECT emp_id, name, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.name, o.level + 1\n  FROM employees e\n  JOIN org o ON e.manager_id = o.emp_id\n)\nSELECT name, level FROM org ORDER BY level, name;',
    steps:['The anchor picks Asha, who has no manager, at level 1.','The recursive part finds employees whose manager is already in org: Bilal and Chitra at level 2, then Deepak, Esha and Farhan at level 3.','No further rows are found, so it stops.'],
    table2:{ rows:[['name','level'],['Asha',1],['Bilal',2],['Chitra',2],['Deepak',3],['Esha',3],['Farhan',3]], caption:'Result' }, result:'A three-level hierarchy.' },
  practice:{ q:'Write a recursive CTE that produces the numbers 1 to 5.', hint:'Anchor: SELECT 1. Recursive: add 1 while below 5.', solution:'WITH RECURSIVE n AS (\n  SELECT 1 AS x\n  UNION ALL\n  SELECT x + 1 FROM n WHERE x < 5\n)\nSELECT x FROM n;', explain:'The anchor gives 1. Each round adds 1 until x reaches 5, then the WHERE condition stops it.' },
  interview:[
    { level:'Basic', q:'What is a recursive CTE?', a:'A CTE that references itself: an anchor query gives the first rows and a recursive query keeps adding rows until nothing new is found.' },
    { level:'Intermediate', q:'What are its two parts?', a:'The anchor member (starting rows) and the recursive member, joined by UNION ALL.' },
    { level:'Intermediate', q:'How do you prevent infinite recursion?', a:'Make sure the recursive part eventually returns no rows, add a WHERE limit on a level counter, and watch for cycles in the data.' },
    { level:'Scenario', q:'Find all employees who report, directly or indirectly, to Asha.', a:'A recursive CTE anchored on Asha, then joined to employees on manager_id = cte.emp_id.' }
  ],
  mcq:[
    { q:'Which word does MySQL need?', o:['RECURSIVE','LOOP','REPEAT','CYCLE'], a:0, why:'WITH RECURSIVE.' },
    { q:'What does the anchor do?', o:['Gives the starting rows','Stops the loop','Sorts','Deletes'], a:0, why:'It is the first step.' },
    { q:'What joins anchor and recursive parts?', o:['UNION ALL','JOIN','INTERSECT','CROSS'], a:0, why:'The usual form.' },
    { q:'When does recursion stop?', o:['When no new rows are produced','After 10 rows','Never','At the first NULL'], a:0, why:'Nothing new to add.' },
    { q:'In the example, Deepak is at level:', o:['3','2','1','4'], a:0, why:'Asha, then Bilal, then Deepak.' }
  ],
  recap:['A recursive CTE has an anchor and a recursive part.','It stops when no new rows appear.','Use it for hierarchies and generated sequences.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- cte --- */
DEEP['cte'] = {
  level:'Intermediate',
  tldr:'A CTE names a subquery with `WITH`, so a long query reads top to bottom as a series of small steps.',
  intuition:{ text:[
    'Complex questions are easier to answer in stages: first total the orders per customer, then keep customers above the average, then add their names. A CTE lets you write each stage as a named, temporary result and build on it.',
    'It does not make the query faster by itself. It makes it **readable**, which matters because you, or a reviewer, will read it many times.'
  ], analogy:'Writing a recipe as numbered steps instead of one very long sentence.' },
  how:[
    'Start with `WITH name AS ( ... )` and write the first stage as a SELECT.',
    'Add more stages separated by commas; a later stage can use an earlier one.',
    'Finish with a normal SELECT that uses the named results like tables.',
    'The CTE exists only for that one statement. It is not stored.',
    'Needs MySQL 8.0 or later.'
  ],
  diagrams:[
    { type:'flow', arrows:['feeds','feeds'], panels:[
      { title:'Step 1: monthly', text:'total per month' },
      { title:'Step 2: stats', text:'average of the monthly totals' },
      { title:'Final SELECT', text:'months above the average' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Two chained CTEs', scenario:'Find the months whose total is above the average monthly total.', table:T(ORD,'Table: orders'), task:'Total per month, average of those, then compare.',
      formula:'WITH monthly AS (\n  SELECT MONTH(order_date) AS m, SUM(amount) AS total\n  FROM orders\n  GROUP BY MONTH(order_date)\n),\nstats AS (\n  SELECT AVG(total) AS avg_total FROM monthly\n)\nSELECT m.m, m.total, ROUND(s.avg_total) AS avg_total\nFROM monthly m\nCROSS JOIN stats s\nWHERE m.total > s.avg_total;', steps:['monthly returns 2000, 2200 and 1500.','stats averages them to 1900.','The final query keeps months above 1900.'], table2:{ rows:[['m','total','avg_total'],[1,2000,1900],[2,2200,1900]], caption:'Result' }, result:'January and February are above the average.' },
    { level:'Business case', title:'A customer summary report', scenario:'Customer success wants, for each customer, the first and last order date, order count and total, with the name and city.', table:T(CUST,'Table: customers'), task:'Aggregate first, then join the names.',
      formula:'WITH summary AS (\n  SELECT customer_id,\n         MIN(order_date) AS first_order,\n         MAX(order_date) AS last_order,\n         COUNT(*) AS orders,\n         SUM(amount) AS total\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT c.name, c.city, s.first_order, s.last_order, s.orders, s.total\nFROM customers c\nJOIN summary s ON c.customer_id = s.customer_id\nORDER BY s.total DESC;', steps:['Aggregating orders first keeps one row per customer.','Joining names afterwards cannot multiply the totals.'], table2:{ rows:[['name','city','first_order','last_order','orders','total'],['Asha','Pune','2026-01-05','2026-03-15',3,3300],['Bilal','Delhi','2026-01-18','2026-03-09',2,1700],['Chitra','Pune','2026-02-21','2026-02-21',1,700]], caption:'Result' }, result:'The query reads in three clear steps, and is safe from row multiplication.' }
  ],
  edge:[
    { t:'Version', d:'CTEs and WITH need MySQL 8.0 or later. In MySQL 5.7, use derived tables.' },
    { t:'A CTE is not materialised by default', d:'The database may run the CTE query each time you reference it. If you reference it twice, consider a temporary table for large data.' },
    { t:'Commas between CTEs', d:'Several CTEs are separated by commas, with one WITH at the start. A missing comma is a common syntax error.' },
    { t:'Scope', d:'A CTE lives for one statement. The next statement cannot see it.' },
    { t:'Not the same as a view', d:'A view is stored in the database. A CTE exists only inside one query.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Using a CTE, list the customers whose total order amount is above the average customer total.', table:T(ORD,'Table: orders'), hint:'CTE of totals per customer, then compare with its AVG.', solution:'WITH totals AS (\n  SELECT customer_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT customer_id, total\nFROM totals\nWHERE total > (SELECT AVG(total) FROM totals);', explain:'Totals are 3300, 1700 and 700, with an average of 1900. Only customer 101 is above it.' },
    { level:'Interview', q:'Rewrite a nested subquery as a CTE and explain why you would.', hint:'Name the inner part and call it from the outer query.', solution:'-- before\nSELECT * FROM (SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id) t WHERE total > 1500;\n-- after\nWITH t AS (SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id)\nSELECT * FROM t WHERE total > 1500;', explain:'The logic is the same. The CTE names the step, reads top to bottom and can be reused, so reviewers understand it faster.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a CTE and why use it?', a:'A CTE (Common Table Expression) is a named temporary result defined with WITH, which the main query can use like a table. I use it to break a complex query into readable steps and to reuse a result within one statement.',
      follow:[ { q:'Is a CTE faster than a subquery?', a:'Not by itself. It is mainly for readability. Performance depends on the optimizer, and it is often the same.' } ] },
    { level:'Intermediate', q:'CTE, derived table, view and temp table: how do they differ?', a:'A derived table is an unnamed subquery in FROM. A CTE is a named version for one statement. A view is a stored query. A temporary table stores actual data for the session.',
      tradeoff:'Use a temp table when the intermediate result is large and reused several times; use CTEs for readability.' },
    { level:'Scenario', q:'You inherit a 200-line query with five nested subqueries. How do you make it maintainable?', a:'I rewrite each nested block as a named CTE in logical order, test each stage separately, and add comments describing the business rule of each stage. Then I compare the output with the original to make sure it did not change.' }
  ],
  ref:{ headers:['Part','Rule'], rows:[['`WITH name AS (...)`','Defines a CTE'],['Several CTEs','Separate with commas'],['Lifetime','One statement'],['Recursion','`WITH RECURSIVE`'],['Version','MySQL 8.0+']] },
  related:['derived-table','recursive-cte','subquery-where','window-intro']
};

/* --- recursive-cte --- */
D('recursive-cte',{ l:'Advanced', t:'A recursive CTE has an anchor and a recursive part joined by UNION ALL. It repeats until no new rows appear.',
  i:['Some data is a tree of unknown depth: an org chart, a category tree, a bill of materials. A normal query cannot follow it to the bottom. A recursive CTE starts from a root and repeatedly adds the next level.','You need a stop condition, or a cycle in the data makes it run forever.'], a:'Climbing a family tree one generation at a time.',
  h:['Write the **anchor** query (the starting rows).','Join with `UNION ALL` to the **recursive** query that refers to the CTE.','Carry a level counter.','Stops when the recursive part returns no rows.'],
  d:[FL(['level by level'],[{ title:'Result', rows:[['name','level'],['Asha',1],['Bilal',2],['Chitra',2],['Deepak',3],['Esha',3],['Farhan',3]] }])],
  x:[X('Variation','Generating numbers','A list of numbers 1 to 5.','Increment until a limit.','WITH RECURSIVE n AS (\n  SELECT 1 AS x\n  UNION ALL\n  SELECT x + 1 FROM n WHERE x < 5\n)\nSELECT x FROM n;',['The WHERE stops the recursion.'],'1, 2, 3, 4, 5.'),
     X('Business case','A reporting chain','Everyone under Bilal, with depth.','Start at Bilal.','WITH RECURSIVE t AS (\n  SELECT emp_id, name, 0 AS depth FROM employees WHERE name = \'Bilal\'\n  UNION ALL\n  SELECT e.emp_id, e.name, t.depth + 1\n  FROM employees e JOIN t ON e.manager_id = t.emp_id\n)\nSELECT * FROM t;',['Bilal is depth 0, Deepak and Esha depth 1.'],'Three rows.',T(EMP,'Table: employees'))],
  e:[['Needs a stop','A WHERE limit or a data end. Cycles loop forever.'],['MySQL syntax','`WITH RECURSIVE`, version 8.0+.'],['Row limit','`cte_max_recursion_depth` caps recursion (default 1000).'],['UNION ALL','Use UNION ALL, not UNION, for speed.']],
  p:[P('Medium','Generate dates for a week.','Add one day each step.','WITH RECURSIVE d AS (SELECT DATE(\'2026-03-01\') AS day UNION ALL SELECT day + INTERVAL 1 DAY FROM d WHERE day < \'2026-03-07\') SELECT * FROM d;','Seven dates. Handy for calendars.'),
     P('Interview','How do you prevent infinite recursion?','Stop condition.','Ensure the recursive part eventually returns no rows, add a level limit, and watch for cycles.','Mention the recursion depth setting.')],
  q:[Q('Basic','What is a recursive CTE?','A CTE that references itself with an anchor and a recursive member.',{ f:[['When does it stop?','When no new rows are produced.']] }),
     Q('Scenario','All employees below a manager.','A recursive CTE starting at the manager and joining on manager_id.',{ t:'A self join only goes one level.' })],
  r:RT(['Part','Role'],[['Anchor','Starting rows'],['Recursive','Next level'],['`UNION ALL`','Joins them'],['Stop','No new rows']]), rel:['cte','self-join','cross-join','month-over-month'] });
})();
