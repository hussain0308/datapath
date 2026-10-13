/* Datapath | SQL | Subqueries
 * Lessons in this file: subquery-where, derived-table, correlated-subquery, exists-sql, any-all
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
  const { EMP, DEPT, CUST, ORD } = DP.datasets.sql;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- subquery-where --- */
'subquery-where': {
  title:'Subquery in WHERE', tagline:'Use the result of one query inside another.',
  prereq:['where','avg-sql'],
  what:['A subquery is a query inside another query, in brackets.','A **scalar** subquery returns one value; a list subquery returns many.','The inner query runs first.'],
  why:['Compare a row to an overall figure, such as the average.','Filter by values from another table.'],
  syntax:{ code:'SELECT columns\nFROM table1\nWHERE column > (SELECT AVG(column) FROM table1);\n\nWHERE column IN (SELECT column FROM table2);', parts:[['(SELECT ...)','The subquery, always in brackets.'],['IN / = / >','How the outer query uses the result.']] },
  points:['A scalar subquery must return exactly **one** value, or you get an error.','Use IN when the subquery returns several values.','The subquery can use a different table.','Subqueries can be replaced by joins; choose the clearer one.','Avoid NOT IN with NULLs.'],
  mistakes:['A scalar subquery returning more than one row.','NOT IN with NULLs.','Overly nested subqueries.'],
  example:{ title:'Employees above the average salary', scenario:'You want employees who earn more than the company average.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Return the employees above average.', formula:'SELECT name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);',
    steps:['The inner query returns the average, 45000.','The outer query keeps rows where salary is greater than 45000.'],
    table2:{ rows:[['name','salary'],['Asha',50000],['Chitra',60000]], caption:'Result' }, result:'Asha and Chitra earn above average.' },
  practice:{ q:'Write a query for the orders with an amount above the average order amount.', table:T(ORD,'Table: orders'), hint:'The average is 950.', solution:'SELECT *\nFROM orders\nWHERE amount > (SELECT AVG(amount) FROM orders);', explain:'Orders 1 (1200) and 3 (1500) are above 950.' },
  interview:[
    { level:'Basic', q:'What is a subquery?', a:'A query nested inside another query, in brackets. The inner query provides a value or list for the outer one.' },
    { level:'Intermediate', q:'What happens if a scalar subquery returns more than one row?', a:'The database raises an error, such as "Subquery returns more than 1 row". Use IN, or fix the query.' },
    { level:'Intermediate', q:'Subquery or JOIN?', a:'Both can work. I use a subquery for a simple comparison with an aggregate, and a join when I need columns from the other table.' },
    { level:'Scenario', q:'Employees in the Sales department, using department names.', a:'WHERE dept_id IN (SELECT dept_id FROM departments WHERE dept_name = \'Sales\').' }
  ],
  mcq:[
    { q:'The inner query runs:', o:['First','Last','Never','At the same time'], a:0, why:'Its result feeds the outer query.' },
    { q:'A scalar subquery returns:', o:['One value','Many rows','A table','Nothing'], a:0, why:'One row and one column.' },
    { q:'Which operator handles a list from a subquery?', o:['IN','=','>','LIKE'], a:0, why:'IN accepts several values.' },
    { q:'Employees above the average salary:', o:['Asha and Chitra','Bilal and Esha','Deepak only','Everyone'], a:0, why:'Above 45000.' },
    { q:'Where is a subquery written?', o:['In brackets','In quotes','After a semicolon','At the end'], a:0, why:'Always in brackets.' }
  ],
  recap:['A subquery is a query inside brackets.','Scalar returns one value; IN handles lists.','Choose a join when you need the other table\'s columns.']
},

/* --- derived-table --- */
'derived-table': {
  title:'Subquery in FROM (derived table)', tagline:'Use a query result as a temporary table.',
  prereq:['subquery-where','group-by'],
  what:['A derived table is a subquery in the FROM clause.','The outer query treats it like a table.','It lets you filter or join aggregated results.'],
  why:['Filter on an aggregate, such as an average per department, with more flexibility.','Break a complex problem into steps.'],
  syntax:{ code:'SELECT columns\nFROM (SELECT ... FROM ... GROUP BY ...) AS alias\nWHERE ...;', parts:[['AS alias','A name for the derived table. MySQL requires it.']] },
  points:['It **must have an alias** in MySQL.','The inner query runs first and produces a temporary result.','Columns of the derived table are the SELECT list of the inner query.','CTEs often make the same logic easier to read.','You can join a derived table to other tables.'],
  mistakes:['Forgetting the alias.','Duplicate column names in the inner query.','Nesting too deeply.'],
  example:{ title:'Departments with a high average salary', scenario:'You want departments whose average salary is above 42000.',
    table:withHl(EMP,{'C2:D7':'range'},'Table: employees'), task:'Calculate averages first, then filter them.', formula:'SELECT d.dept_id, d.avg_sal\nFROM (\n  SELECT dept_id, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY dept_id\n) AS d\nWHERE d.avg_sal > 42000;',
    steps:['The inner query returns an average per department: 10 is 55000, 20 is 40000, 30 is 45000 and NULL is 35000.','The outer query keeps those above 42000.'],
    table2:{ rows:[['dept_id','avg_sal'],[10,55000],[30,45000]], caption:'Result' }, result:'Departments 10 and 30.' },
  practice:{ q:'Write a query that uses a derived table to show customers whose total order amount is above 1500.', table:T(ORD,'Table: orders'), hint:'Total per customer in the inner query.', solution:'SELECT t.customer_id, t.total\nFROM (\n  SELECT customer_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY customer_id\n) AS t\nWHERE t.total > 1500;', explain:'Customer 101 totals 3300 and customer 102 totals 1700. Customer 103 totals 700.' },
  interview:[
    { level:'Basic', q:'What is a derived table?', a:'A subquery in the FROM clause that acts as a temporary table for the outer query.' },
    { level:'Intermediate', q:'Why does MySQL ask for an alias?', a:'Every derived table must have a name, so the outer query can refer to its columns.' },
    { level:'Intermediate', q:'Derived table versus CTE?', a:'They give the same result. A CTE is named at the top, can be reused and reads better, but needs MySQL 8.' },
    { level:'Scenario', q:'Show each employee with their department average salary.', a:'Join employees to a derived table of AVG(salary) per dept_id, or use AVG(salary) OVER (PARTITION BY dept_id).' }
  ],
  mcq:[
    { q:'Where does a derived table appear?', o:['In FROM','In WHERE','In SELECT only','After LIMIT'], a:0, why:'It replaces a table name.' },
    { q:'What does MySQL require for it?', o:['An alias','An index','A key','A view'], a:0, why:'Every derived table needs a name.' },
    { q:'Which runs first?', o:['The inner query','The outer query','Neither','Both'], a:0, why:'It builds the temporary result.' },
    { q:'Departments with average above 42000:', o:['10 and 30','20 only','10 only','All'], a:0, why:'55000 and 45000.' },
    { q:'A cleaner modern alternative:', o:['CTE','Cursor','Trigger','Index'], a:0, why:'WITH makes it readable.' }
  ],
  recap:['A derived table is a subquery in FROM, with an alias.','Compute aggregates first, then filter them.','CTEs are a more readable alternative.']
},

/* --- correlated-subquery --- */
'correlated-subquery': {
  title:'Correlated subquery', tagline:'A subquery that depends on the current row of the outer query.',
  prereq:['subquery-where'],
  what:['A correlated subquery refers to a column of the outer query.','It is evaluated once for each outer row.','It lets each row be compared with its own group.'],
  why:['"Employees who earn more than their department average."','A common interview question.'],
  syntax:{ code:'SELECT columns\nFROM table1 t1\nWHERE column > (\n  SELECT AVG(column)\n  FROM table1 t2\n  WHERE t2.group_col = t1.group_col\n);', parts:[['t1','The outer table (alias).'],['t2.group_col = t1.group_col','The link between inner and outer rows.']] },
  points:['The inner query cannot run on its own, because it uses the outer alias.','It runs once per outer row, so it can be slow.','A join with a derived table, or a window function, is often faster.','NULL keys give no matching rows, so the comparison is unknown.','EXISTS is a common correlated subquery.'],
  mistakes:['Forgetting the correlation condition.','Slow queries on large tables.','NULL keys being silently excluded.'],
  example:{ title:'Above their own department\'s average', scenario:'You want employees who earn more than the average of their own department.',
    table:withHl(EMP,{'C2:D7':'range'},'Table: employees'), task:'Compare each salary with its department average.', formula:'SELECT e.name, e.salary\nFROM employees e\nWHERE e.salary > (\n  SELECT AVG(x.salary)\n  FROM employees x\n  WHERE x.dept_id = e.dept_id\n);',
    steps:['For each employee, the inner query averages the salaries in the same department.','Chitra (60000) beats the Sales average of 55000. Bilal and Esha equal their department\'s average, so they are not above it.','Farhan has a NULL department, so no average exists and he is excluded.'],
    table2:{ rows:[['name','salary'],['Chitra',60000]], caption:'Result' }, result:'Only Chitra earns more than her department average.' },
  practice:{ q:'In this query, why does Deepak not appear?', hint:'He is alone in department 30.', solution:'He is the only employee in department 30, so his salary equals the department average. It is not greater than it.', explain:'The condition is salary greater than the average, and an employee alone in a department always equals it.' },
  interview:[
    { level:'Basic', q:'What is a correlated subquery?', a:'A subquery that uses a column from the outer query, so it is evaluated for each outer row.' },
    { level:'Intermediate', q:'What is the drawback of correlated subqueries?', a:'They can run once per row, which is slow on large tables. A join with a pre-aggregated derived table or a window function is usually faster.' },
    { level:'Intermediate', q:'Rewrite the department-average example with a window function.', a:'SELECT name, salary FROM (SELECT name, salary, AVG(salary) OVER (PARTITION BY dept_id) AS avg_sal FROM employees) t WHERE salary > avg_sal;' },
    { level:'Scenario', q:'Find each customer\'s most recent order.', a:'WHERE order_date = (SELECT MAX(order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id), or ROW_NUMBER() partitioned by customer.' }
  ],
  mcq:[
    { q:'A correlated subquery refers to:', o:['The outer query\'s row','Nothing','A view','An index'], a:0, why:'It uses the outer alias.' },
    { q:'How often is it evaluated?', o:['Once per outer row','Once in total','Never','Twice'], a:0, why:'Conceptually per row.' },
    { q:'Who earns more than their department average?', o:['Chitra','Asha','Bilal','Esha'], a:0, why:'60000 against 55000.' },
    { q:'A faster alternative:', o:['Window function or join','Another subquery','LIKE','LIMIT'], a:0, why:'They avoid per-row evaluation.' },
    { q:'Can the inner query run alone?', o:['No, it needs the outer value','Yes','Only in MySQL','Only with LIMIT'], a:0, why:'It depends on the outer row.' }
  ],
  recap:['Correlated subqueries depend on the outer row.','They can be slow; prefer joins or window functions on big data.','NULL keys never match.']
},

/* --- exists-sql --- */
'exists-sql': {
  title:'EXISTS and NOT EXISTS', tagline:'Test whether a subquery returns any row.',
  prereq:['correlated-subquery'],
  what:['EXISTS is true if the subquery returns at least one row.','NOT EXISTS is true if it returns none.','What the subquery selects does not matter, only whether a row exists.'],
  why:['Customers with orders, or without.','Safer than NOT IN when NULLs exist.'],
  syntax:{ code:'SELECT columns\nFROM table1 t1\nWHERE EXISTS (\n  SELECT 1 FROM table2 t2 WHERE t2.key = t1.key\n);', parts:[['SELECT 1','A convention: the value is not used.'],['t2.key = t1.key','Links the inner row to the outer row.']] },
  points:['EXISTS stops at the first matching row, so it can be fast.','NOT EXISTS is not affected by NULLs, unlike NOT IN.','It returns only TRUE or FALSE.','Equivalent to a semi join; NOT EXISTS to an anti join.','Often written with `SELECT 1`.'],
  mistakes:['NOT IN where NOT EXISTS is safer.','Forgetting the link condition.','Expecting columns from the inner table.'],
  example:{ title:'Customers who have placed orders', scenario:'You want customers with at least one order.',
    table:T(CUST,'Table: customers'), task:'Use EXISTS.', formula:'SELECT c.name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1\n  FROM orders o\n  WHERE o.customer_id = c.customer_id\n);',
    steps:['For each customer, the subquery looks for any matching order.','Deepak (104) has no order, so EXISTS is false for him.'],
    table2:{ rows:[['name'],['Asha'],['Bilal'],['Chitra']], caption:'Result' }, result:'Asha, Bilal and Chitra. With NOT EXISTS, only Deepak.' },
  practice:{ q:'Write a query for the customers who have never placed an order.', table:T(CUST,'Table: customers'), hint:'Use NOT EXISTS.', solution:'SELECT c.name\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);', explain:'Only Deepak has no matching order.' },
  interview:[
    { level:'Basic', q:'What does EXISTS do?', a:'It returns true when the subquery returns at least one row.' },
    { level:'Intermediate', q:'EXISTS versus IN?', a:'Both test membership. EXISTS can stop at the first match and handles NULLs safely in the NOT form. IN suits short lists.' },
    { level:'Intermediate', q:'Why is NOT EXISTS safer than NOT IN?', a:'If the NOT IN list contains NULL, the comparison is unknown and no rows return. NOT EXISTS is not affected.' },
    { level:'Scenario', q:'Find departments with no employees.', a:'SELECT dept_name FROM departments d WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id);' }
  ],
  mcq:[
    { q:'EXISTS is true when the subquery:', o:['Returns at least one row','Returns NULL','Returns zero rows','Has a join'], a:0, why:'Any row makes it true.' },
    { q:'Which customers have no orders?', o:['Deepak','Asha','Bilal','Chitra'], a:0, why:'No orders for 104.' },
    { q:'Safer with NULLs:', o:['NOT EXISTS','NOT IN','NOT LIKE','NOT BETWEEN'], a:0, why:'NOT IN fails with NULLs.' },
    { q:'What does the subquery select usually?', o:['1','*always needed','A column used by outer','Nothing'], a:0, why:'The selected value is ignored.' },
    { q:'Does EXISTS return columns?', o:['No, only TRUE or FALSE','Yes','Only keys','Only counts'], a:0, why:'It is a test.' }
  ],
  recap:['EXISTS tests whether the subquery returns a row.','NOT EXISTS is the NULL-safe way to find missing matches.','The selected value does not matter.']
},

/* --- any-all --- */
'any-all': {
  title:'ANY and ALL', tagline:'Compare a value with a whole list from a subquery.',
  prereq:['subquery-where'],
  what:['`> ANY` is true if the value is greater than **at least one** value in the list.','`> ALL` is true if it is greater than **every** value.','They combine a comparison operator with a subquery.'],
  why:['"Earns more than everyone in Finance."','Appears in interviews and tricky subquery questions.'],
  syntax:{ code:'WHERE column > ANY (SELECT ...)\nWHERE column > ALL (SELECT ...)', parts:[['ANY','True if the comparison holds for at least one value.'],['ALL','True if the comparison holds for every value.']] },
  points:['`> ALL (list)` means greater than the **maximum**.','`> ANY (list)` means greater than the **minimum**.','`= ANY` is the same as IN.','`<> ALL` is the same as NOT IN.','An empty list: ALL is true, ANY is false.'],
  mistakes:['Confusing ANY and ALL.','Forgetting that `<> ALL` has NULL issues like NOT IN.','Using them when MAX or MIN is simpler.'],
  example:{ title:'Earning more than everyone in Finance', scenario:'Finance (dept 20) employees earn 40000 each.',
    table:withHl(EMP,{'C3':'find','D3':'find','C6':'find','D6':'find'},'Table: employees'), task:'Find employees earning more than every Finance employee.', formula:'SELECT name, salary\nFROM employees\nWHERE salary > ALL (\n  SELECT salary FROM employees WHERE dept_id = 20\n);',
    steps:['The subquery returns 40000 and 40000.','> ALL needs the salary to beat each value, so it must exceed 40000.'],
    table2:{ rows:[['name','salary'],['Asha',50000],['Chitra',60000],['Deepak',45000]], caption:'Result' }, result:'Asha, Chitra and Deepak.' },
  practice:{ q:'Which employees satisfy salary < ANY (SELECT salary FROM employees WHERE dept_id = 10)?', table:T(EMP,'Table: employees'), hint:'Department 10 salaries are 50000 and 60000. Less than any means less than the maximum.', solution:'Asha, Bilal, Deepak, Esha and Farhan', explain:'The value must be below at least one of 50000 or 60000, so below 60000. Only Chitra (60000) fails.' },
  interview:[
    { level:'Basic', q:'What is the difference between ANY and ALL?', a:'ANY is true if the comparison holds for at least one value in the list. ALL needs it to hold for every value.' },
    { level:'Intermediate', q:'What is > ALL equivalent to?', a:'Greater than the maximum of the list: > (SELECT MAX(...)). > ANY is greater than the minimum.' },
    { level:'Intermediate', q:'What are = ANY and <> ALL equivalent to?', a:'= ANY is IN, and <> ALL is NOT IN.' },
    { level:'Scenario', q:'Which is clearer: > ALL or > (SELECT MAX)?', a:'The MAX form is usually clearer and handles empty lists predictably, so I prefer it unless ALL makes the intent obvious.' }
  ],
  mcq:[
    { q:'> ALL (list) means greater than:', o:['The maximum','The minimum','The average','Any one'], a:0, why:'It must beat every value.' },
    { q:'> ANY (list) means greater than:', o:['The minimum','The maximum','The average','The sum'], a:0, why:'Beating one value suffices.' },
    { q:'= ANY equals:', o:['IN','NOT IN','LIKE','BETWEEN'], a:0, why:'Equal to at least one.' },
    { q:'<> ALL equals:', o:['NOT IN','IN','EXISTS','LIKE'], a:0, why:'Different from every value.' },
    { q:'Employees earning more than all Finance staff (40000):', o:['Asha, Chitra, Deepak','Everyone','Bilal','Farhan'], a:0, why:'Above 40000.' }
  ],
  recap:['ANY needs one match; ALL needs every match.','> ALL is above the max; > ANY is above the min.','= ANY is IN; <> ALL is NOT IN.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- subquery-where --- */
DEEP['subquery-where'] = {
  level:'Intermediate',
  tldr:'A subquery is a query inside brackets. Its result (one value or a list) feeds the outer query\'s condition.',
  intuition:{ text:[
    'Sometimes you cannot write the condition until you have computed something: "earning more than the average" needs the average first. A subquery lets you do both in one statement: the inner query calculates the average, and the outer query uses it.',
    'The key question is the shape of the result: one value (a scalar subquery, used with `=`, `>`), or a list (used with `IN`).'
  ], analogy:'Looking up the pass mark in a rulebook, and then checking each student against it.' },
  how:[
    'The inner query (in brackets) runs first.',
    'A scalar subquery returns exactly one row and one column: use it with `=`, `>`, `<`.',
    'A list subquery returns several values: use it with `IN`.',
    'The outer query uses the result in its WHERE (or SELECT, or HAVING).',
    'A subquery that uses columns of the outer query is **correlated** (separate lesson).'
  ],
  diagrams:[
    { type:'flow', arrows:['inner query first','used by the outer query'], panels:[
      { title:'(SELECT AVG(salary) FROM employees)', text:'**45000**' },
      { title:'WHERE salary > 45000', rows:[['name','salary'],['Asha',50000],['Chitra',60000]], hl:{1:'hit',2:'hit'} }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A list subquery with IN', scenario:'Employees in the Sales department, using the department name.', table:T(DEPT,'Table: departments'), task:'Find the department id with a subquery.', formula:'SELECT name, dept_id\nFROM employees\nWHERE dept_id IN (\n  SELECT dept_id\n  FROM departments\n  WHERE dept_name = \'Sales\'\n);', steps:['The inner query returns 10.','The outer query keeps employees whose dept_id is in that list.'], table2:{ rows:[['name','dept_id'],['Asha',10],['Chitra',10]], caption:'Result' }, result:'A JOIN would give the same result and lets you show department columns too.' },
    { level:'Business case', title:'A scalar subquery in SELECT: share of total', scenario:'Show each order\'s percentage of total sales.', table:T(ORD,'Table: orders'), task:'Divide each amount by the grand total.',
      formula:'SELECT order_id, amount,\n       ROUND(amount * 100.0 /\n             (SELECT SUM(amount) FROM orders), 1) AS pct\nFROM orders;', steps:['The subquery returns 5700 once.','Every row divides its amount by that total.'], table2:{ rows:[['order_id','amount','pct'],[1,1200,21.1],[2,800,14],[3,1500,26.3],[4,700,12.3],[5,900,15.8],[6,600,10.5]], caption:'Result' }, result:'The percentages add up to 100. A window function `SUM(amount) OVER ()` is a modern alternative.' }
  ],
  edge:[
    { t:'Scalar subquery must return one value', d:'If it returns several rows, you get "Subquery returns more than 1 row". Use IN, or aggregate.' },
    { t:'NOT IN and NULL', d:'`NOT IN (subquery)` returns nothing if the subquery produces a NULL. Use NOT EXISTS.' },
    { t:'Empty subquery', d:'A scalar subquery with no rows returns NULL, so the comparison is UNKNOWN and no rows match.' },
    { t:'Subquery or JOIN?', d:'Use a subquery to compare with an aggregate or to test existence. Use a join when you need columns from the other table.' },
    { t:'Readability', d:'Deeply nested subqueries are hard to read. Use CTEs when you have more than one level.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the employees who earn the same as the lowest-paid employee.', table:T(EMP,'Table: employees'), hint:'Compare with MIN.', solution:'SELECT name, salary\nFROM employees\nWHERE salary = (SELECT MIN(salary) FROM employees);', explain:'The minimum is 35000, so only Farhan is returned.' },
    { level:'Interview', q:'Return the customers who have placed more orders than the average number of orders per customer.', table:T(ORD,'Table: orders'), hint:'A subquery of counts inside another subquery.', solution:'SELECT customer_id, COUNT(*) AS orders\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > (\n  SELECT AVG(n) FROM (\n    SELECT COUNT(*) AS n FROM orders GROUP BY customer_id\n  ) t\n);', explain:'Counts are 3, 2 and 1, with an average of 2. Only customer 101 has more than 2.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a subquery?', a:'A query nested inside another query, in brackets. The inner query runs first and its result is used by the outer query, for example to compare each salary with the average.',
      follow:[ { q:'What types are there?', a:'Scalar (one value), list (one column of many rows), table (derived table in FROM) and correlated (depends on the outer row).' } ] },
    { level:'Intermediate', q:'What happens if a scalar subquery returns more than one row?', a:'The database raises an error. I either aggregate to get one value, or change the operator to IN.' },
    { level:'Scenario', q:'Subquery or JOIN for "customers who have orders"?', a:'EXISTS or IN with a subquery returns each customer once. A JOIN repeats customers with several orders unless I add DISTINCT, and is better when I need order columns.',
      tradeoff:'The optimizer often produces the same plan. I choose the form that is clearest and returns the right number of rows.' }
  ],
  ref:{ headers:['Shape','Use with'], rows:[['One value','`=`, `>`, `<`'],['A list','`IN`, `NOT IN`, `ANY`, `ALL`'],['A table','In `FROM` as a derived table'],['Depends on outer row','Correlated subquery']] },
  related:['derived-table','correlated-subquery','exists-sql','cte']
};

/* --- derived-table --- */
DEEP['derived-table'] = {
  level:'Intermediate',
  tldr:'A derived table is a subquery in FROM. It is a temporary table you can filter, join or aggregate again.',
  intuition:{ text:[
    'Some questions need two levels of aggregation: "the average of the customers\' totals". You cannot write `AVG(SUM(amount))` directly. The solution is to compute the totals first as a temporary table, and then aggregate that table.',
    'The derived table is that temporary table, written inline in FROM. Give it an alias, and treat it exactly like a normal table.'
  ], analogy:'Making a summary sheet first, and then analysing the summary.' },
  how:[
    'Write the inner query that produces the intermediate result.',
    'Put it in brackets in the FROM clause and give it an alias.',
    'The outer query selects, filters or joins that result like any table.',
    'MySQL **requires** the alias.',
    'A CTE does the same job and is often easier to read.'
  ],
  diagrams:[
    { type:'flow', arrows:['inner query','outer query'], panels:[
      { title:'Derived table t (totals per customer)', rows:[['customer_id','total'],[101,3300],[102,1700],[103,700]] },
      { title:'SELECT AVG(total) FROM t', text:'**1900**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Joining a derived table', scenario:'Show each employee with their department\'s average salary.', table:T(EMP,'Table: employees'), task:'Join employees to per-department averages.', formula:'SELECT e.name, e.salary, a.avg_salary\nFROM employees e\nJOIN (\n  SELECT dept_id, AVG(salary) AS avg_salary\n  FROM employees\n  GROUP BY dept_id\n) a ON e.dept_id = a.dept_id;', steps:['The derived table a has one row per department.','The join attaches the average to every employee.','Farhan (NULL department) is dropped by the inner join.'], table2:{ rows:[['name','salary','avg_salary'],['Asha',50000,55000],['Bilal',40000,40000],['Chitra',60000,55000],['Deepak',45000,45000],['Esha',40000,40000]], caption:'Result' }, result:'A window function gives the same result more compactly.' },
    { level:'Business case', title:'The average of customer totals', scenario:'Management asks for the average total spend per customer, which needs two levels of aggregation.', table:T(ORD,'Table: orders'), task:'Total per customer, then average the totals.', formula:'SELECT ROUND(AVG(t.total), 0) AS avg_customer_total\nFROM (\n  SELECT customer_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY customer_id\n) AS t;', steps:['The inner query gives 3300, 1700 and 700.','The outer query averages them.'], table2:{ rows:[['avg_customer_total'],[1900]], caption:'Result' }, result:'The average customer spent 1900. Averaging all orders directly would give 950, a different question.' }
  ],
  edge:[
    { t:'The alias is mandatory in MySQL', d:'"Every derived table must have its own alias". Add `AS t`.' },
    { t:'Column names must be unique', d:'Give every expression in the inner query an alias, such as `SUM(amount) AS total`, or the outer query cannot refer to it.' },
    { t:'Derived table or CTE?', d:'The result is the same. A CTE reads top to bottom and can be reused. Derived tables work in MySQL 5.7, where CTEs do not exist.' },
    { t:'Performance', d:'MySQL may materialise the derived table. Keep it small, filtered and indexed through its source tables.' },
    { t:'Inner join drops unmatched rows', d:'Joining to a derived table with an INNER JOIN removes rows without a match. Use LEFT JOIN to keep them.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Using a derived table, list customers whose total is above the average customer total.', table:T(ORD,'Table: orders'), hint:'Compare each total with the average of the totals.', solution:'SELECT t.customer_id, t.total\nFROM (\n  SELECT customer_id, SUM(amount) AS total\n  FROM orders GROUP BY customer_id\n) t\nWHERE t.total > (SELECT AVG(total) FROM (SELECT SUM(amount) AS total FROM orders GROUP BY customer_id) x);', explain:'Only customer 101 (3300) is above the average of 1900. A CTE would let you write the totals once.' },
    { level:'Interview', q:'Why does MySQL say "Every derived table must have its own alias"?', hint:'What does the outer query need?', solution:'The outer query refers to the derived table by name, to prefix columns and to avoid ambiguity. MySQL requires you to name it.\nFix: add AS t after the closing bracket.', explain:'A short, correct answer; the follow-up is usually "how would you rewrite it as a CTE?".' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a derived table?', a:'A subquery in the FROM clause that works as a temporary table for the outer query. It must have an alias.',
      follow:[ { q:'When do you need one?', a:'For two-level aggregation, or to filter or join the result of an aggregate.' } ] },
    { level:'Intermediate', q:'Derived table, CTE and temporary table: when do you use each?', a:'A derived table or CTE for one query (a CTE for readability and reuse). A temporary table when I need the intermediate result several times, or it is large and benefits from an index.',
      tradeoff:'Temporary tables cost write time but can be indexed and reused across statements.' },
    { level:'Scenario', q:'Compute the average of daily totals from an events table.', a:'SELECT AVG(daily_total) FROM (SELECT DATE(ts) AS d, SUM(amount) AS daily_total FROM events GROUP BY DATE(ts)) t; The inner query totals per day, and the outer query averages the totals.' }
  ],
  ref:{ headers:['Rule','Detail'], rows:[['Where','In `FROM` or `JOIN`'],['Alias','Required in MySQL'],['Column names','Alias every expression'],['Alternative','CTE (MySQL 8+)']] },
  related:['subquery-where','cte','group-by','window-intro']
};

/* --- correlated-subquery --- */
DEEP['correlated-subquery'] = {
  level:'Advanced',
  tldr:'A correlated subquery refers to the **current row** of the outer query, so it is evaluated once per row.',
  intuition:{ text:[
    'An ordinary subquery runs once and hands a value to the outer query. A correlated subquery cannot run alone: it needs to know which outer row it is working for. It is like asking, for each person in a list, "what is the average of **their own** group?".',
    'This is exactly what is needed for questions such as "employees above their department average" or "each customer\'s latest order".'
  ], analogy:'A teacher who, for every student, looks up that student\'s own class average before grading.' },
  how:[
    'The outer query takes the first row.',
    'The inner query runs using values from that row, linked through an alias such as `e.dept_id`.',
    'The outer condition uses the inner result to keep or drop the row.',
    'The process repeats for every row of the outer query (the optimizer may rewrite it).',
    'The inner query cannot be run on its own, because it refers to the outer alias.'
  ],
  diagrams:[
    { type:'flow', arrows:['for each row','compare'], panels:[
      { title:'Outer row (Chitra, dept 10)', text:'salary = 60000' },
      { title:'Inner query for dept 10', text:'AVG(salary) of dept 10 = 55000' },
      { title:'Condition', text:'60000 > 55000, so keep the row' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Each customer\'s latest order', scenario:'Return only the most recent order of each customer.', table:T(ORD,'Table: orders'), task:'Compare each order date with that customer\'s maximum date.',
      formula:'SELECT o.order_id, o.customer_id, o.order_date, o.amount\nFROM orders o\nWHERE o.order_date = (\n  SELECT MAX(x.order_date)\n  FROM orders x\n  WHERE x.customer_id = o.customer_id\n);', steps:['For each order, the inner query finds the latest date of the same customer.','The order is kept only if its date equals that latest date.'], table2:{ rows:[['order_id','customer_id','order_date','amount'],[4,103,'2026-02-21',700],[5,102,'2026-03-09',900],[6,101,'2026-03-15',600]], caption:'Result' }, result:'One row per customer. A window function with ROW_NUMBER gives the same answer.' },
    { level:'Business case', title:'Orders above the customer\'s own average', scenario:'Flag unusually large orders compared with each customer\'s normal order.', table:T(ORD,'Table: orders'), task:'Keep orders above that customer\'s average amount.',
      formula:'SELECT o.order_id, o.customer_id, o.amount\nFROM orders o\nWHERE o.amount > (\n  SELECT AVG(x.amount)\n  FROM orders x\n  WHERE x.customer_id = o.customer_id\n);', steps:['Customer 101 averages 1100, 102 averages 850 and 103 averages 700.','Orders 1 (1200), 3 (1500) and 5 (900) are above their customer\'s average.'], table2:{ rows:[['order_id','customer_id','amount'],[1,101,1200],[3,101,1500],[5,102,900]], caption:'Result' }, result:'Order 4 equals its customer\'s average, so it is not above it.' }
  ],
  edge:[
    { t:'Performance', d:'Conceptually the inner query runs for every outer row. On large tables, a join with a pre-aggregated table or a window function is usually faster.' },
    { t:'The correlation condition', d:'Forgetting `x.customer_id = o.customer_id` turns it into an ordinary subquery returning one global value.' },
    { t:'NULL keys', d:'If the correlation column is NULL, the inner query matches nothing, and the comparison is unknown. The row is dropped.' },
    { t:'Ties', d:'`order_date = MAX(order_date)` returns several rows when a customer has two orders on the latest date. Add a tie-breaker or use ROW_NUMBER.' },
    { t:'Alias discipline', d:'Use different aliases for the inner and outer copies of the same table, or the condition compares a row with itself.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return employees who earn the highest salary in their department.', table:T(EMP,'Table: employees'), hint:'Compare with the department MAX.', solution:'SELECT e.name, e.dept_id, e.salary\nFROM employees e\nWHERE e.salary = (\n  SELECT MAX(x.salary)\n  FROM employees x\n  WHERE x.dept_id = e.dept_id\n);', explain:'Chitra (dept 10), Bilal and Esha (dept 20, tied) and Deepak (dept 30). Farhan is excluded: his dept_id is NULL, so no inner row matches.' },
    { level:'Interview', q:'Rewrite the "above department average" query with a window function and say which you prefer.', table:T(EMP,'Table: employees'), hint:'AVG() OVER (PARTITION BY dept_id) in a derived table.', solution:'SELECT name, salary\nFROM (\n  SELECT name, salary,\n         AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg\n  FROM employees\n) t\nWHERE salary > dept_avg;', explain:'Both return Chitra. The window version computes each department average once, so it scales better. The correlated version is more portable to old MySQL versions without window functions.' }
  ],
  interviewPlus:[
    { level:'Intermediate', q:'What is a correlated subquery?', a:'A subquery that refers to a column of the outer query, so it depends on the current outer row and is evaluated for each row. For example, comparing each employee\'s salary with the average of their own department.',
      structure:'Define it, contrast with an ordinary subquery, then give the department average example.',
      follow:[ { q:'Why can it be slow?', a:'Because conceptually it runs once per outer row. On large tables I prefer a join to a pre-aggregated derived table, or a window function.' },
               { q:'How can you recognise it?', a:'The inner query refers to an outer alias, and it cannot run on its own.' } ] },
    { level:'Advanced', q:'Get the latest order per customer in three different ways.', a:'1) A correlated subquery comparing the date with MAX per customer. 2) A join to a derived table of MAX(order_date) per customer. 3) ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1.',
      tradeoff:'ROW_NUMBER handles ties deterministically and is easiest to extend. The join is portable. The correlated subquery is the most readable for small data.' },
    { level:'Scenario', q:'Your correlated query takes minutes on 10 million rows. What do you do?', a:'I check EXPLAIN, make sure the correlation column is indexed, and rewrite it as a join with a pre-aggregated table or a window function so the aggregate is computed once per group instead of once per row.' }
  ],
  ref:{ headers:['Question','Answer'], rows:[['Runs alone?','No, depends on the outer row'],['Typical use','Compare a row with its own group'],['Faster alternatives','Window function, join to a derived table'],['Danger','Ties and NULL keys']] },
  related:['subquery-where','exists-sql','window-intro','cte']
};

/* --- exists-sql --- */
DEEP['exists-sql'] = {
  level:'Intermediate',
  tldr:'EXISTS tests whether a subquery returns **at least one row**. NOT EXISTS is the NULL-safe way to find rows with no match.',
  intuition:{ text:[
    'Often you do not need the matching rows themselves. You only need to know whether a match exists: does this customer have any order? EXISTS answers that yes or no question, and stops looking as soon as it finds the first match.',
    'That makes it efficient, and it also avoids the duplicate rows a join would create when a customer has many orders.'
  ], analogy:'Asking "is anyone home?" instead of "list everyone who is home".' },
  how:[
    'For each row of the outer query, run the inner query with the link condition.',
    'If the inner query returns at least one row, EXISTS is true.',
    'The columns selected inside do not matter, so `SELECT 1` is the convention.',
    'NOT EXISTS is true when the inner query returns no rows.',
    'The outer query keeps the row if the test is true.'
  ],
  diagrams:[
    { type:'flow', arrows:['EXISTS?'], panels:[
      { title:'customers', rows:[['customer_id','name'],[101,'Asha'],[102,'Bilal'],[103,'Chitra'],[104,'Deepak']], hl:{4:'miss'} },
      { title:'Has a matching order?', rows:[['customer_id','EXISTS'],[101,'TRUE'],[102,'TRUE'],[103,'TRUE'],[104,'FALSE']], hl:{4:'miss'} }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Departments with no employees', scenario:'Find departments that nobody belongs to.', table:T(DEPT,'Table: departments'), task:'Use NOT EXISTS.',
      formula:'SELECT d.dept_name\nFROM departments d\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM employees e\n  WHERE e.dept_id = d.dept_id\n);', steps:['For each department, the inner query looks for employees in it.','IT has none, so NOT EXISTS is true.'], table2:{ rows:[['dept_name'],['IT']], caption:'Result' }, result:'IT is the only empty department.' },
    { level:'Business case', title:'Customers who ever placed a large order', scenario:'Marketing wants customers who have at least one order of 1000 or more, each customer listed once.', table:T(ORD,'Table: orders'), task:'Use EXISTS with an extra condition.',
      formula:'SELECT c.name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1\n  FROM orders o\n  WHERE o.customer_id = c.customer_id\n    AND o.amount >= 1000\n);', steps:['Asha has orders of 1200 and 1500, so she qualifies.','Bilal\'s largest order is 900, and Chitra\'s is 700.'], table2:{ rows:[['name'],['Asha']], caption:'Result' }, result:'Asha appears once, even though she has two large orders. A join would have returned her twice.' }
  ],
  edge:[
    { t:'NOT IN versus NOT EXISTS', d:'If the NOT IN list contains a NULL, no rows are returned. NOT EXISTS is not affected, so it is the safe choice.' },
    { t:'SELECT 1 is just a convention', d:'The select list is ignored. `SELECT *` works the same, but `SELECT 1` makes the intention clear.' },
    { t:'The link condition is essential', d:'Without `o.customer_id = c.customer_id`, EXISTS is true for every row whenever the orders table is not empty.' },
    { t:'No duplicates', d:'Unlike a join, EXISTS never repeats the outer row, because it only asks whether a match exists.' },
    { t:'Performance', d:'It can stop at the first match, so it is often faster than IN or a join on large tables. Index the inner link column.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return customers who placed an order in March 2026.', table:T(ORD,'Table: orders'), hint:'EXISTS with a date range inside.', solution:'SELECT c.name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.customer_id\n    AND o.order_date >= \'2026-03-01\'\n    AND o.order_date <  \'2026-04-01\'\n);', explain:'Orders 5 (customer 102) and 6 (customer 101) are in March, so the result is Asha and Bilal.' },
    { level:'Interview', q:'What is wrong with: SELECT name FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM orders) when orders.customer_id can be NULL?', hint:'Think about how NOT IN handles NULL.', solution:'If the subquery returns a NULL, `x NOT IN (..., NULL)` is never TRUE, so the query returns no rows.\nFix: use NOT EXISTS, or add WHERE customer_id IS NOT NULL inside the subquery.', explain:'This is a standard interview trap. Naming it shows you understand three-valued logic.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does EXISTS do?', a:'EXISTS returns true if the subquery returns at least one row. I use it to test for the presence of related rows, such as customers who have orders, without caring about the details of those rows.',
      follow:[ { q:'Why SELECT 1?', a:'The selected values are ignored by EXISTS. It is a convention that shows the subquery is only a test.' } ] },
    { level:'Intermediate', q:'EXISTS, IN or JOIN to find customers with orders?', a:'For "customers who have orders", EXISTS is clear and returns each customer once. IN is fine for short lists. A JOIN repeats customers who have several orders unless I use DISTINCT, so I use it when I need columns from orders.',
      tradeoff:'Modern optimizers often produce the same plan. Choose the clearest form and index the join key.' },
    { level:'Scenario', q:'Find products that were never ordered.', a:'SELECT p.name FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id); NOT EXISTS is safe even if order_items.product_id has NULLs.' }
  ],
  ref:{ headers:['Need','Use'], rows:[['Has at least one match','`EXISTS (SELECT 1 ...)`'],['Has no match','`NOT EXISTS (SELECT 1 ...)`'],['Avoid NULL trap','Prefer NOT EXISTS to NOT IN'],['Need the other table\'s columns','`JOIN`']] },
  related:['left-join','customers-without-orders','correlated-subquery','in-sql']
};

/* --- any-all --- */
D('any-all',{ l:'Intermediate', t:'`> ALL` means greater than every value in the list (the maximum). `> ANY` means greater than at least one (the minimum).',
  i:['ANY and ALL compare one value with a whole list from a subquery. "Earns more than everyone in Finance" is ALL. "Earns more than someone in Finance" is ANY.','They are equivalent to comparing with MAX or MIN, which is often clearer.'], a:'Beating every runner versus beating at least one runner.',
  h:['Write `column > ALL (subquery)` or `> ANY (subquery)`.','ALL needs the comparison true for every value.','ANY needs it true for at least one.','`= ANY` is IN; `<> ALL` is NOT IN.'],
  d:[FL(['> ALL'],[{ title:'Finance salaries', rows:[['salary'],[40000],[40000]] },{ title:'> ALL means > 40000', rows:[['name','salary'],['Asha',50000],['Chitra',60000],['Deepak',45000]], hl:{1:'hit',2:'hit',3:'hit'} }])],
  x:[X('Variation','ANY','Earn less than at least one Sales employee.','Use < ANY.','SELECT name FROM employees WHERE salary < ANY (SELECT salary FROM employees WHERE dept_id = 10);',['Sales salaries are 50000 and 60000; below 60000 qualifies.'],'Everyone except Chitra.',T(EMP,'Table: employees')),
     X('Business case','The clearer MAX form','Same logic with MAX.','Prefer aggregate comparison.','WHERE salary > (SELECT MAX(salary) FROM employees WHERE dept_id = 20)',['Equivalent to > ALL.'],'Easier to read and handles an empty list predictably.')],
  e:[['> ALL is greater than the maximum','> ANY is greater than the minimum.'],['Empty list','ALL is true, ANY is false.'],['NULLs','A NULL in the list can make ALL unknown.'],['MAX/MIN are clearer','Use them unless ALL reads better.']],
  p:[P('Medium','Earn more than all Finance employees.','> ALL.','WHERE salary > ALL (SELECT salary FROM employees WHERE dept_id = 20)','Asha, Chitra, Deepak.',T(EMP,'Table: employees')),
     P('Interview','= ANY and <> ALL are equivalent to what?','IN and NOT IN.','= ANY is IN, and <> ALL is NOT IN (with the same NULL issues).','Show the symmetry.')],
  q:[Q('Basic','ANY versus ALL?','ANY needs one comparison true, ALL needs every one.',{ f:[['> ALL equals?','Greater than the maximum.']] }),
     Q('Scenario','Which is clearer, > ALL or > (SELECT MAX)?','Usually the MAX form.',{ t:'ALL helps when the intent reads naturally.' })],
  r:RT(['Form','Means'],[['`> ALL (list)`','> maximum'],['`> ANY (list)`','> minimum'],['`= ANY`','IN'],['`<> ALL`','NOT IN']]), rel:['subquery-where','in-sql','correlated-subquery','exists-sql'] });
})();
