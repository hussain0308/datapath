/* Datapath | SQL | Interview patterns
 * Lessons in this file: second-highest, top-n-per-group, find-duplicates, customers-without-orders, month-over-month, pivot-with-case, delete-duplicate-rows
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

/* --- second-highest --- */
'second-highest': {
  title:'Second highest salary (and Nth)', tagline:'The classic SQL interview question, solved three ways.',
  prereq:['dense-rank','subquery-where','limit-sql'],
  what:['Find the second highest **distinct** salary.','There are three standard approaches.','They generalize to the Nth highest.'],
  why:['Asked in a huge share of analyst interviews.','It tests ties, NULLs and window functions.'],
  syntax:{ code:'-- 1 LIMIT / OFFSET\nSELECT DISTINCT salary FROM employees\nORDER BY salary DESC LIMIT 1 OFFSET 1;\n\n-- 2 Subquery\nSELECT MAX(salary) FROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n\n-- 3 DENSE_RANK\nSELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\n  FROM employees) t\nWHERE dr = 2 LIMIT 1;', parts:[['LIMIT 1 OFFSET 1','Skip the highest, take the next.'],['MAX < MAX','The largest value below the maximum.'],['DENSE_RANK = 2','The second distinct rank.']] },
  points:['Use **DISTINCT** (or DENSE_RANK) so ties do not count as separate ranks.','LIMIT/OFFSET returns nothing if there is no second value, while the MAX approach returns NULL.','DENSE_RANK is the most general: change 2 to N.','Handle NULL salaries: they sort first or last depending on the system.','Mention edge cases: fewer than two distinct salaries.'],
  mistakes:['Forgetting DISTINCT and returning a tie of the highest.','Using RANK, which gaps after ties.','Not discussing what happens with no second value.'],
  example:{ title:'Second highest salary', scenario:'The salaries are 60000, 50000, 45000, 40000, 40000 and 35000.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Find the second highest salary.', formula:'SELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;',
    steps:['DISTINCT leaves 60000, 50000, 45000, 40000 and 35000.','Sorted from the highest, the second is 50000.'],
    table2:{ rows:[['salary'],[50000]], caption:'Result' }, result:'The second highest salary is 50000.' },
  practice:{ q:'Write the DENSE_RANK version for the Nth highest salary, with N = 4.', hint:'Change dr = 2 to dr = 4.', solution:'SELECT DISTINCT salary\nFROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\n  FROM employees\n) t\nWHERE dr = 4;', explain:'The fourth distinct salary is 40000, even though two people earn it.' },
  interview:[
    { level:'Basic', q:'How do you find the second highest salary?', a:'SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1; or the MAX of salaries below the maximum, or DENSE_RANK = 2.' },
    { level:'Intermediate', q:'Why use DISTINCT or DENSE_RANK?', a:'If two people share the top salary, a plain second row would still show the top salary. DISTINCT or DENSE_RANK counts distinct values.' },
    { level:'Intermediate', q:'What if there is no second highest value?', a:'LIMIT/OFFSET returns no rows, and the MAX approach returns NULL. I choose based on how the caller needs it, and may wrap it with IFNULL.' },
    { level:'Scenario', q:'Second highest salary in each department?', a:'DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) in a CTE, then WHERE dr = 2.' }
  ],
  mcq:[
    { q:'Second highest distinct salary in the table is:', o:['50000','60000','45000','40000'], a:0, why:'After 60000.' },
    { q:'Which handles Nth generally?', o:['DENSE_RANK','LIMIT 1','MAX only','COUNT'], a:0, why:'Change the rank number.' },
    { q:'Why DISTINCT?', o:['Ties would repeat a value','To sort','To join','To limit'], a:0, why:'Distinct values only.' },
    { q:'MAX-below-MAX approach returns when only one salary exists:', o:['NULL','0','The same salary','Error'], a:0, why:'No smaller value.' },
    { q:'RANK instead of DENSE_RANK for Nth highest can:', o:['Skip the Nth value after ties','Be faster','Return NULL','Join tables'], a:0, why:'Gaps after ties.' }
  ],
  recap:['Three methods: LIMIT/OFFSET, MAX < MAX, DENSE_RANK.','Use DISTINCT or DENSE_RANK for ties.','DENSE_RANK generalizes to Nth and to per-group.']
},

/* --- top-n-per-group --- */
'top-n-per-group': {
  title:'Top N per group', tagline:'The highest rows within each category.',
  prereq:['row-number','rank-sql'],
  what:['Return the top N rows for each group, such as the top earner per department.','Use a window function in a CTE, then filter on the rank.','ROW_NUMBER gives exactly N rows; RANK includes ties.'],
  why:['Top product per category, best salesperson per region.','A frequent interview task.'],
  syntax:{ code:'WITH ranked AS (\n  SELECT *,\n         RANK() OVER (PARTITION BY group_col ORDER BY value DESC) AS rnk\n  FROM table_name\n)\nSELECT * FROM ranked WHERE rnk <= N;', parts:[['PARTITION BY','The groups.'],['ORDER BY value DESC','What "top" means.'],['rnk <= N','Keep the top N.']] },
  points:['**ROW_NUMBER** returns exactly N per group, breaking ties arbitrarily.','**RANK / DENSE_RANK** include everyone tied at the cut-off.','Add a tie-breaker to ROW_NUMBER for repeatable results.','Filter in an outer query or CTE.','Before MySQL 8, use correlated subqueries.'],
  mistakes:['Filtering in WHERE directly.','Using LIMIT, which cuts the whole result, not per group.','Not deciding how ties are treated.'],
  example:{ title:'Top earner per department', scenario:'You want the highest-paid employee of each department, including ties.',
    table:withHl(EMP,{'C2:D7':'range'},'Table: employees'), task:'Rank within departments and keep rank 1.', formula:'WITH ranked AS (\n  SELECT name, dept_id, salary,\n         RANK() OVER (\n           PARTITION BY dept_id ORDER BY salary DESC\n         ) AS rnk\n  FROM employees\n)\nSELECT name, dept_id, salary\nFROM ranked\nWHERE rnk = 1;',
    steps:['RANK restarts for each dept_id.','Chitra is first in department 10, and Bilal and Esha tie for first in department 20.','Deepak and Farhan are alone in their groups.'],
    table2:{ rows:[['name','dept_id','salary'],['Farhan','NULL',35000],['Chitra',10,60000],['Bilal',20,40000],['Esha',20,40000],['Deepak',30,45000]], caption:'Result' }, result:'Five rows: department 20 shows both tied employees.' },
  practice:{ q:'Change the query so that exactly one employee per department is returned.', hint:'Switch to ROW_NUMBER with a tie-breaker.', solution:'ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, name) AS rn\n... WHERE rn = 1;', explain:'Department 20 now returns only Bilal, because his name comes before Esha.' },
  interview:[
    { level:'Basic', q:'How do you get the top row per group?', a:'Use ROW_NUMBER() OVER (PARTITION BY group ORDER BY value DESC) in a CTE and keep rn = 1.' },
    { level:'Intermediate', q:'ROW_NUMBER or RANK for top N per group?', a:'ROW_NUMBER gives exactly N rows per group. RANK includes ties at the cut-off. I choose based on the business rule.' },
    { level:'Intermediate', q:'Why not use LIMIT?', a:'LIMIT cuts the whole result, not each group.' },
    { level:'Scenario', q:'Top 2 customers by total spend in each city.', a:'Aggregate spend per customer in a CTE, then DENSE_RANK() OVER (PARTITION BY city ORDER BY total DESC) and keep rnk <= 2.' }
  ],
  mcq:[
    { q:'Which returns exactly N rows per group?', o:['ROW_NUMBER','RANK','DENSE_RANK','NTILE'], a:0, why:'No ties in numbering.' },
    { q:'Where do you filter on rnk?', o:['Outer query or CTE','WHERE in same query','HAVING','ORDER BY'], a:0, why:'Window results are created at SELECT.' },
    { q:'Does LIMIT work per group?', o:['No','Yes','Only with PARTITION','Only in MySQL 8'], a:0, why:'It limits the whole result.' },
    { q:'RANK = 1 in department 20 returns:', o:['Two employees','One employee','None','Three'], a:0, why:'Bilal and Esha tie.' },
    { q:'Make ROW_NUMBER repeatable by adding:', o:['A tie-breaker column','DISTINCT','LIMIT','HAVING'], a:0, why:'Fixes the tie order.' }
  ],
  recap:['Rank within groups in a CTE, then filter.','ROW_NUMBER: exactly N; RANK: includes ties.','LIMIT does not work per group.']
},

/* --- find-duplicates --- */
'find-duplicates': {
  title:'Finding duplicates', tagline:'Detect repeated rows with GROUP BY and HAVING.',
  prereq:['group-by','having'],
  what:['Duplicates are rows that repeat on the columns that should be unique.','GROUP BY those columns and keep groups with more than one row.','It is the first step before cleaning data.'],
  why:['Data quality checks happen in every analyst job.','Always asked in interviews.'],
  syntax:{ code:'SELECT col1, col2, COUNT(*) AS times\nFROM table_name\nGROUP BY col1, col2\nHAVING COUNT(*) > 1;', parts:[['GROUP BY col1, col2','The columns that define a duplicate.'],['HAVING COUNT(*) > 1','Keep only repeated combinations.']] },
  points:['Decide first which columns define a duplicate.','COUNT(*) > 1 finds repeated groups.','To see the full duplicate rows, join back or use ROW_NUMBER.','Trim and standardise text before checking.','NULLs form one group.'],
  mistakes:['Choosing the wrong columns.','Not cleaning spaces and case.','Checking only a part of the key.'],
  example:{ title:'Repeated customers', scenario:'A customer table has the same person entered more than once.',
    table:withHl({rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[3,'Asha','Pune'],[4,'Chitra','Pune'],[5,'Bilal','Delhi']]},{'B2:C2':'hit','B4:C4':'hit','B3:C3':'find','B6:C6':'find'},'Table: cust_dup'), task:'List the repeated combinations.', formula:'SELECT customer, city, COUNT(*) AS times\nFROM cust_dup\nGROUP BY customer, city\nHAVING COUNT(*) > 1;',
    steps:['Rows are grouped by customer and city.','Asha with Pune and Bilal with Delhi appear twice.'],
    table2:{ rows:[['customer','city','times'],['Asha','Pune',2],['Bilal','Delhi',2]], caption:'Result' }, result:'Two repeated combinations.' },
  practice:{ q:'Write a query that shows every row that belongs to a duplicate, including its id.', hint:'Use COUNT(*) OVER (PARTITION BY customer, city) in a CTE.', solution:'WITH c AS (\n  SELECT *, COUNT(*) OVER (PARTITION BY customer, city) AS n\n  FROM cust_dup\n)\nSELECT id, customer, city\nFROM c\nWHERE n > 1;', explain:'The result shows ids 1, 2, 3 and 5, all rows in duplicate groups.' },
  interview:[
    { level:'Basic', q:'How do you find duplicate rows?', a:'GROUP BY the columns that should be unique and HAVING COUNT(*) > 1.' },
    { level:'Intermediate', q:'How do you list the duplicate rows themselves?', a:'Use COUNT(*) OVER (PARTITION BY ...) in a CTE and keep rows where the count is above 1, or join back to the grouped result.' },
    { level:'Intermediate', q:'Why might real duplicates not show up?', a:'Case or spacing differences. I standardise with TRIM and LOWER before grouping.' },
    { level:'Scenario', q:'Prevent duplicates in future.', a:'Add a UNIQUE constraint on the identifying columns, such as email, after cleaning the existing data.' }
  ],
  mcq:[
    { q:'Which clause finds repeated groups?', o:['HAVING COUNT(*) > 1','WHERE COUNT(*) > 1','ORDER BY','LIMIT'], a:0, why:'Aggregates need HAVING.' },
    { q:'Duplicates in the example:', o:['Asha-Pune and Bilal-Delhi','Chitra','All rows','None'], a:0, why:'Each appears twice.' },
    { q:'Why TRIM and LOWER first?', o:['Hidden differences hide duplicates','To sort','To join','To speed up'], a:0, why:'\'Asha \' differs from \'asha\'.' },
    { q:'Prevent future duplicates with:', o:['UNIQUE constraint','LIMIT','VIEW','INDEX only'], a:0, why:'The database rejects them.' },
    { q:'COUNT(*) OVER (PARTITION BY ...) is used to:', o:['Keep all rows with their group count','Group rows','Delete rows','Sort rows'], a:0, why:'Rows stay and get a count.' }
  ],
  recap:['GROUP BY plus HAVING COUNT(*) > 1 finds duplicates.','COUNT OVER shows the actual rows.','Clean text first and add UNIQUE constraints.']
},

/* --- customers-without-orders --- */
'customers-without-orders': {
  title:'Customers without orders', tagline:'Find rows in one table with no match in another, three ways.',
  prereq:['left-join','exists-sql'],
  what:['A classic "anti join": rows with no match elsewhere.','Three methods: LEFT JOIN with IS NULL, NOT EXISTS and NOT IN.','They behave the same, except NOT IN with NULLs.'],
  why:['Inactive customers, products never sold, employees without a department.'],
  syntax:{ code:'-- 1 LEFT JOIN\nSELECT c.name FROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;\n\n-- 2 NOT EXISTS\nSELECT c.name FROM customers c\nWHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);\n\n-- 3 NOT IN\nSELECT name FROM customers\nWHERE customer_id NOT IN (SELECT customer_id FROM orders);', parts:[['LEFT JOIN ... IS NULL','Unmatched rows have NULL in the right table.'],['NOT EXISTS','True when no matching row is found.'],['NOT IN','True when the id is not in the list.']] },
  points:['All three return Deepak here.','**NOT IN returns nothing** if the subquery can return NULL.','NOT EXISTS and LEFT JOIN are NULL-safe.','Check the column you test for NULL is a **non-nullable** column of the right table, such as its key.','Prefer NOT EXISTS or LEFT JOIN in production.'],
  mistakes:['NOT IN on a nullable column.','Testing a nullable column with IS NULL, which also matches real NULL values.','Filtering the right table in WHERE.'],
  example:{ title:'Customers who never ordered', scenario:'Marketing wants customers with no orders.',
    table:T(CUST,'Table: customers'), task:'Find them with a LEFT JOIN.', formula:'SELECT c.name\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;',
    steps:['LEFT JOIN keeps every customer.','Deepak has no order, so o.order_id is NULL.','WHERE keeps only those rows.'],
    table2:{ rows:[['name'],['Deepak']], caption:'Result' }, result:'Only Deepak has never placed an order.' },
  practice:{ q:'Which of the three methods fails silently if orders.customer_id contains NULL, and why?', hint:'Think about NULL comparisons.', solution:'NOT IN', explain:'x NOT IN (..., NULL) is never true, so no rows are returned.' },
  interview:[
    { level:'Basic', q:'How do you find customers with no orders?', a:'LEFT JOIN orders and keep rows where the order key IS NULL, or use NOT EXISTS.' },
    { level:'Intermediate', q:'Why can NOT IN give wrong results?', a:'If the subquery returns a NULL, the NOT IN comparison is unknown for every row and nothing is returned. NOT EXISTS avoids this.' },
    { level:'Intermediate', q:'Which method is fastest?', a:'Modern optimizers treat them similarly. NOT EXISTS and LEFT JOIN with an index on the join key are usually best.' },
    { level:'Scenario', q:'Products never sold?', a:'Products LEFT JOIN order_items ON product_id WHERE order_items.product_id IS NULL.' }
  ],
  mcq:[
    { q:'Which customer has no orders?', o:['Deepak','Asha','Bilal','Chitra'], a:0, why:'Customer 104.' },
    { q:'LEFT JOIN anti join keeps rows where the right key is:', o:['NULL','0','Equal','Duplicated'], a:0, why:'No match means NULL.' },
    { q:'Which is risky with NULLs?', o:['NOT IN','NOT EXISTS','LEFT JOIN','All'], a:0, why:'It returns no rows.' },
    { q:'NOT EXISTS is true when:', o:['The subquery finds no rows','The subquery finds a row','The table is empty','The key is NULL'], a:0, why:'No match.' },
    { q:'Which column should you test for NULL after the join?', o:['A non-nullable right-table key','Any column','The left key','A calculated column'], a:0, why:'So real NULLs are not confused with no match.' }
  ],
  recap:['Anti join: LEFT JOIN IS NULL, NOT EXISTS or NOT IN.','NOT IN fails with NULLs.','Test a non-nullable right-table key.']
},

/* --- month-over-month --- */
'month-over-month': {
  title:'Month-over-month growth', tagline:'Compare each month with the previous one.',
  prereq:['lag','month-sql'],
  what:['Summarise by month, then compare each month with the previous month.','LAG gives the previous month\'s value.','Growth % = (this month - last month) / last month x 100.'],
  why:['The most common business metric question.','Combines CTE, GROUP BY and window functions.'],
  syntax:{ code:'WITH monthly AS (\n  SELECT DATE_FORMAT(order_date, \'%Y-%m\') AS ym,\n         SUM(amount) AS total\n  FROM orders\n  GROUP BY ym\n)\nSELECT ym, total,\n       LAG(total) OVER (ORDER BY ym) AS prev_total,\n       ROUND((total - LAG(total) OVER (ORDER BY ym))\n             * 100.0 / LAG(total) OVER (ORDER BY ym), 2) AS growth_pct\nFROM monthly;', parts:[['monthly','A CTE with one row per month.'],['LAG(total)','Last month\'s total.'],['growth_pct','Percentage change.']] },
  points:['Aggregate first (CTE), then use LAG.','Sort by a year-month key such as `%Y-%m`, which orders correctly.','The first month has no previous value, so NULL.','Guard against a zero previous value with NULLIF.','Missing months need a calendar table.'],
  mistakes:['Using LAG on unaggregated rows.','Grouping by month number across years.','Dividing by a zero or NULL previous value.'],
  example:{ title:'Monthly growth of orders', scenario:'You want each month\'s total and the growth versus the previous month.',
    table:withHl(ORD,{'C2:D7':'range'},'Table: orders'), task:'Calculate monthly totals and growth.', formula:'(see the syntax block above)',
    steps:['The CTE totals each month: January 2000, February 2200, March 1500.','LAG brings in the previous month.','February: (2200 - 2000) / 2000 = 10%. March: (1500 - 2200) / 2200 = -31.82%.'],
    table2:{ rows:[['ym','total','prev_total','growth_pct'],['2026-01',2000,'NULL','NULL'],['2026-02',2200,2000,10],['2026-03',1500,2200,-31.82]], caption:'Result' }, result:'February grew by 10%, and March fell by 31.82%.' },
  practice:{ q:'Why must you aggregate in a CTE before applying LAG?', hint:'LAG looks at the previous row.', solution:'Otherwise LAG would compare with the previous order, not the previous month.', explain:'After the CTE, each row is one month, so the previous row is the previous month.' },
  interview:[
    { level:'Basic', q:'How do you calculate month-over-month growth in SQL?', a:'Aggregate sales by month in a CTE, then use LAG to get last month\'s value and compute (current - previous) / previous x 100.' },
    { level:'Intermediate', q:'Why aggregate first?', a:'LAG works on rows. If rows are orders, the previous row is the previous order. After grouping by month, the previous row is the previous month.' },
    { level:'Intermediate', q:'How do you avoid divide-by-zero?', a:'Divide by NULLIF(LAG(total) OVER (...), 0), so a zero previous month gives NULL.' },
    { level:'Scenario', q:'A month has no sales and is missing from the results. How do you handle it?', a:'Generate all months with a recursive CTE or calendar table and LEFT JOIN the totals, using COALESCE(total, 0).' }
  ],
  mcq:[
    { q:'Which function brings in last month\'s total?', o:['LAG','LEAD','RANK','NTILE'], a:0, why:'LAG reads the previous row.' },
    { q:'Growth for February in the example:', o:['10%','-10%','200%','2200'], a:0, why:'(2200 - 2000) / 2000.' },
    { q:'Why use a CTE first?', o:['To get one row per month','To speed up inserts','To create keys','To rank'], a:0, why:'LAG then compares months.' },
    { q:'Growth for March:', o:['-31.82%','31.82%','-700','10%'], a:0, why:'(1500 - 2200) / 2200.' },
    { q:'Avoid divide-by-zero with:', o:['NULLIF','COALESCE','CAST','ROUND'], a:0, why:'Zero becomes NULL.' }
  ],
  recap:['Aggregate by month first, then LAG.','Growth % = (current - previous) / previous x 100.','Use NULLIF and a calendar table for edge cases.']
},

/* --- pivot-with-case --- */
'pivot-with-case': {
  title:'Pivoting with CASE', tagline:'Turn row values into columns.',
  prereq:['case-when','group-by'],
  what:['Pivoting turns values of one column into separate columns.','In MySQL you do it with SUM(CASE WHEN ... THEN ... END) and GROUP BY.','SQL Server has a PIVOT keyword; MySQL does not.'],
  why:['Reports with months or categories as columns.','Often asked: "convert rows to columns".'],
  syntax:{ code:'SELECT key_column,\n  SUM(CASE WHEN category = \'A\' THEN value ELSE 0 END) AS a,\n  SUM(CASE WHEN category = \'B\' THEN value ELSE 0 END) AS b\nFROM table_name\nGROUP BY key_column;', parts:[['CASE WHEN ...','Picks the values for one new column.'],['SUM(...)','Adds them up within each group.'],['GROUP BY','One row per key.']] },
  points:['Each new column needs its own SUM(CASE ...).','ELSE 0 gives zeros instead of NULLs.','The column list is fixed in advance; dynamic pivots need dynamic SQL.','Use COUNT(CASE ... THEN 1 END) to count instead of sum.','The reverse (columns to rows) is an UNPIVOT, done with UNION ALL in MySQL.'],
  mistakes:['Forgetting GROUP BY.','Using ELSE NULL when zeros are wanted.','Hard-coded columns going stale.'],
  example:{ title:'Monthly amount per customer', scenario:'You want one row per customer with a column for each month.',
    table:withHl(ORD,{'B2:D7':'range'},'Table: orders'), task:'Pivot the months into columns.', formula:'SELECT customer_id,\n  SUM(CASE WHEN MONTH(order_date) = 1 THEN amount ELSE 0 END) AS jan,\n  SUM(CASE WHEN MONTH(order_date) = 2 THEN amount ELSE 0 END) AS feb,\n  SUM(CASE WHEN MONTH(order_date) = 3 THEN amount ELSE 0 END) AS mar\nFROM orders\nGROUP BY customer_id;',
    steps:['Each CASE keeps only the amounts of one month.','SUM adds them per customer.'],
    table2:{ rows:[['customer_id','jan','feb','mar'],[101,1200,1500,600],[102,800,0,900],[103,0,700,0]], caption:'Result' }, result:'Months are now columns.' },
  practice:{ q:'Write the query for the number of orders per customer in each month, as columns jan, feb and mar.', hint:'COUNT(CASE WHEN ... THEN 1 END).', solution:'SELECT customer_id,\n  COUNT(CASE WHEN MONTH(order_date) = 1 THEN 1 END) AS jan,\n  COUNT(CASE WHEN MONTH(order_date) = 2 THEN 1 END) AS feb,\n  COUNT(CASE WHEN MONTH(order_date) = 3 THEN 1 END) AS mar\nFROM orders\nGROUP BY customer_id;', explain:'Customer 101 gets 1, 1 and 1. Customer 102 gets 1, 0 and 1.' },
  interview:[
    { level:'Basic', q:'How do you pivot rows into columns in MySQL?', a:'With SUM(CASE WHEN ... THEN value ELSE 0 END) for each new column and a GROUP BY on the row key.' },
    { level:'Intermediate', q:'Does MySQL have a PIVOT keyword?', a:'No. SQL Server and Oracle do. In MySQL I use conditional aggregation.' },
    { level:'Intermediate', q:'How do you handle an unknown number of categories?', a:'Build the SQL dynamically: query the distinct values, generate the CASE columns as a string and run it as a prepared statement.' },
    { level:'Scenario', q:'Turn the columns jan, feb, mar back into rows.', a:'UNION ALL: SELECT customer_id, \'jan\' AS month, jan AS amount FROM t UNION ALL SELECT customer_id, \'feb\', feb FROM t, and so on.' }
  ],
  mcq:[
    { q:'How does MySQL pivot?', o:['SUM(CASE ...) with GROUP BY','PIVOT keyword','ROTATE','TRANSPOSE'], a:0, why:'Conditional aggregation.' },
    { q:'January amount for customer 101:', o:['1200','800','1500','600'], a:0, why:'Order 1.' },
    { q:'What does ELSE 0 do?', o:['Gives zeros instead of NULLs','Deletes rows','Adds rows','Sorts'], a:0, why:'Missing months show 0.' },
    { q:'To count instead of sum use:', o:['COUNT(CASE WHEN ... THEN 1 END)','SUM(1)','COUNT(*) only','MAX'], a:0, why:'COUNT skips NULLs.' },
    { q:'The reverse of a pivot is:', o:['Unpivot','Cross join','Union','Rank'], a:0, why:'Columns to rows.' }
  ],
  recap:['Pivot with SUM(CASE ...) and GROUP BY.','Each new column needs its own CASE.','Dynamic pivots need dynamic SQL; unpivot with UNION ALL.']
},

/* --- delete-duplicate-rows --- */
'delete-duplicate-rows': {
  title:'Deleting duplicate rows', tagline:'Keep one copy of each repeated row.',
  prereq:['find-duplicates','delete-sql'],
  what:['After finding duplicates, you often need to remove the extra copies.','Keep the row with the lowest id and delete the others.','Do it inside a transaction.'],
  why:['A real data cleaning task and a common interview question.'],
  syntax:{ code:'DELETE c\nFROM cust_dup c\nJOIN cust_dup d\n  ON c.customer = d.customer\n AND c.city = d.city\n AND c.id > d.id;', parts:[['JOIN cust_dup d','The same table again, to find an earlier twin.'],['c.id > d.id','A row is deleted when a lower-id twin exists.']] },
  points:['A unique **id** column makes it easy to pick which row to keep.','Preview with a SELECT using the same joins.','MySQL does not allow selecting from the table being deleted in a subquery; use a self-join.','Run it in a transaction.','Then add a UNIQUE constraint to prevent new duplicates.','Alternative: ROW_NUMBER() in a CTE, then delete rows with rn > 1 (where supported).'],
  mistakes:['Deleting without a preview.','Choosing the wrong columns as the duplicate key.','No constraint afterwards.'],
  example:{ title:'Keep the first copy', scenario:'Asha-Pune appears as ids 1 and 3, and Bilal-Delhi as ids 2 and 5.',
    table:withHl({rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[3,'Asha','Pune'],[4,'Chitra','Pune'],[5,'Bilal','Delhi']]},{'A4:C4':'hit','A6:C6':'hit'},'Table: cust_dup (rows to delete are highlighted)'), task:'Delete the later copies.', formula:'START TRANSACTION;\nDELETE c\nFROM cust_dup c\nJOIN cust_dup d\n  ON c.customer = d.customer\n AND c.city = d.city\n AND c.id > d.id;\nCOMMIT;',
    steps:['For id 3, a twin with a lower id (1) exists, so it is deleted.','For id 5, the twin id 2 exists, so it is deleted.','Ids 1, 2 and 4 have no lower-id twin and stay.'],
    table2:{ rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[4,'Chitra','Pune']], caption:'cust_dup (after)' }, result:'Two rows were deleted; three unique rows remain.' },
  practice:{ q:'Write a SELECT that previews which rows the DELETE will remove.', hint:'Use the same FROM and JOIN with SELECT c.*.', solution:'SELECT c.*\nFROM cust_dup c\nJOIN cust_dup d\n  ON c.customer = d.customer\n AND c.city = d.city\n AND c.id > d.id;', explain:'It returns ids 3 and 5, exactly the rows that will be deleted.' },
  interview:[
    { level:'Basic', q:'How do you delete duplicates and keep one row?', a:'Self-join the table on the duplicate columns and delete rows that have a twin with a lower id, so the lowest id remains.' },
    { level:'Intermediate', q:'Why not DELETE ... WHERE id NOT IN (SELECT MIN(id) ... FROM same_table)?', a:'MySQL does not allow a subquery on the table being modified. The self-join, or wrapping the subquery in a derived table, avoids that.' },
    { level:'Intermediate', q:'How do you do it with ROW_NUMBER?', a:'Number rows per duplicate group in a CTE and delete those with rn > 1 where the database allows deleting through a CTE, such as SQL Server and PostgreSQL.' },
    { level:'Scenario', q:'How do you make the cleanup safe?', a:'Back up or copy the table, preview with SELECT, delete inside a transaction, check the counts, then COMMIT and add a UNIQUE constraint.' }
  ],
  mcq:[
    { q:'Which row is kept by c.id > d.id?', o:['The lowest id','The highest id','A random one','None'], a:0, why:'Only later copies are deleted.' },
    { q:'Rows deleted in the example:', o:['Ids 3 and 5','Ids 1 and 2','Id 4','All'], a:0, why:'They have lower-id twins.' },
    { q:'Safest first step:', o:['Preview with SELECT','Run DELETE','Drop the table','Truncate'], a:0, why:'See the affected rows.' },
    { q:'Prevent future duplicates with:', o:['A UNIQUE constraint','A view','LIMIT','ORDER BY'], a:0, why:'The database rejects them.' },
    { q:'Why use a transaction?', o:['To roll back mistakes','To speed up','To create keys','To sort'], a:0, why:'ROLLBACK undoes the delete.' }
  ],
  recap:['Self-join with c.id > d.id deletes later copies.','Preview first and use a transaction.','Add a UNIQUE constraint afterwards.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- second-highest --- */
DEEP['second-highest'] = {
  level:'Advanced',
  tldr:'Find the second highest **distinct** value with LIMIT/OFFSET, MAX below MAX, or DENSE_RANK. DENSE_RANK scales to the Nth value and to each group.',
  intuition:{ text:[
    'The question sounds simple, but it hides a trap: if two people tie for the top salary, is the "second highest" the next person, or the next distinct salary? Interviewers use it to see whether you notice ties, NULLs and missing values.',
    'The cleanest way to think about it is "remove duplicates, sort downwards, take the second one". All three methods are just different ways of writing that sentence.'
  ], analogy:'A podium with distinct heights: if two athletes jump the same top height, the second-highest height is still the next different height.' },
  how:[
    'Decide how ties count: distinct values or rows. Interviews usually mean **distinct** values.',
    'Method 1: DISTINCT, ORDER BY DESC, then LIMIT 1 OFFSET 1.',
    'Method 2: the MAX of the salaries that are below the overall MAX.',
    'Method 3: DENSE_RANK() OVER (ORDER BY salary DESC) and keep rank 2.',
    'Decide what to return when there is no second value: no row (method 1) or NULL (method 2).'
  ],
  diagrams:[
    { type:'flow', arrows:['DISTINCT + sort DESC','take position 2'], panels:[
      { title:'salary column', rows:[['salary'],[60000],[50000],[45000],[40000],[40000],[35000]], hl:{4:'find',5:'find'} },
      { title:'Distinct, sorted', rows:[['position','salary'],[1,60000],[2,50000],[3,45000],[4,40000],[5,35000]], hl:{2:'hit'} },
      { title:'Answer', text:'50000' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Method 2: MAX below MAX', scenario:'No LIMIT or window function needed; works in any database.', table:T(EMP,'Table: employees'), task:'Return the second highest distinct salary.',
      formula:'SELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);', steps:['The inner query returns the highest salary, 60000.','The outer query takes the MAX of everything below it.'], table2:{ rows:[['second_highest'],[50000]], caption:'Result' }, result:'50000. If only one distinct salary existed, the result would be NULL instead of no row.' },
    { level:'Business case', title:'Second highest salary in each department', scenario:'HR wants the runner-up salary per department, and expects some departments to have none.', table:T(EMP,'Table: employees'), task:'Use DENSE_RANK with PARTITION BY.',
      formula:'WITH r AS (\n  SELECT dept_id, salary,\n         DENSE_RANK() OVER (\n           PARTITION BY dept_id\n           ORDER BY salary DESC\n         ) AS dr\n  FROM employees\n)\nSELECT DISTINCT dept_id, salary\nFROM r\nWHERE dr = 2;', steps:['Department 10 has 60000 and 50000, so 50000 is rank 2.','Department 20 has only one distinct salary (40000 twice), so it has no rank 2.','Departments 30 and NULL have a single employee.'], table2:{ rows:[['dept_id','salary'],[10,50000]], caption:'Result' }, result:'Only department 10 has a second highest salary. Missing groups are expected, not an error.' }
  ],
  edge:[
    { t:'Ties at the top', d:'Without DISTINCT, `LIMIT 1 OFFSET 1` could return the same top salary when two people tie for first.' },
    { t:'Fewer than two distinct values', d:'LIMIT/OFFSET returns no row, MAX-below-MAX returns NULL. Choose one and document it, or wrap with `IFNULL` to give a default message.' },
    { t:'NULL salaries', d:'NULLs sort first in ascending order and last in descending in MySQL, and are ignored by MAX. Filter them if they should not count.' },
    { t:'OFFSET on big tables', d:'Large offsets read and discard many rows. For the Nth highest on millions of rows, an indexed column with DENSE_RANK or a subquery is usually better.' },
    { t:'RANK is the wrong tool', d:'RANK leaves gaps after ties, so `rank = 2` may not exist. Use DENSE_RANK for "Nth highest".' }
  ],
  tiers:[
    { level:'Easy', q:'Return the highest salary and the name of the person who earns it.', table:T(EMP,'Table: employees'), hint:'ORDER BY salary DESC LIMIT 1.', solution:'SELECT name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1;', explain:'Chitra at 60000.' },
    { level:'Medium', q:'Return the third highest distinct salary.', table:T(EMP,'Table: employees'), hint:'Change the OFFSET, or the rank number.', solution:'SELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 2;', explain:'Distinct salaries are 60000, 50000, 45000, 40000 and 35000, so the third is 45000.' },
    { level:'Interview', q:'Return the Nth highest distinct salary, written so that N can be changed in one place, and say what happens when N is too large.', table:T(EMP,'Table: employees'), hint:'DENSE_RANK and a parameter.', solution:'SET @n = 4;\nSELECT DISTINCT salary\nFROM (\n  SELECT salary,\n         DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\n  FROM employees\n) t\nWHERE dr = @n;', explain:'For N = 4 the answer is 40000, although two people earn it. For N = 6, no distinct salary has rank 6, so no row is returned.' }
  ],
  interviewPlus:[
    { level:'Intermediate', q:'Write a query for the second highest salary and explain how you handle ties.', a:'SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1. DISTINCT removes duplicate salaries, so a tie for the top does not count as the second value. The alternatives are SELECT MAX(salary) WHERE salary < (SELECT MAX(salary)), or DENSE_RANK = 2.',
      structure:'Clarify distinct versus row-based first, give one query, name two alternatives, then state the edge cases.',
      tradeoff:'LIMIT/OFFSET is short and MySQL-specific. The MAX subquery is portable. DENSE_RANK generalises to Nth and to groups.',
      follow:[ { q:'What if there is no second highest salary?', a:'LIMIT/OFFSET returns no row. The MAX approach returns NULL. I confirm which the caller expects, and can wrap with IFNULL.' },
               { q:'How would you get the second highest per department?', a:'DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) in a CTE, then WHERE dr = 2.' },
               { q:'Why DENSE_RANK and not RANK?', a:'RANK leaves gaps after ties, so rank 2 may not exist. DENSE_RANK has consecutive ranks.' } ] },
    { level:'Scenario', q:'How would you find the Nth highest salary on a table with 50 million rows?', a:'I make sure salary is indexed, then use a window function or a LIMIT on the distinct values, and check the plan with EXPLAIN. I avoid a huge OFFSET. If the question is asked often, I pre-compute a table of distinct salaries.',
      tradeoff:'Exact answers cost a sort or index scan. If an approximate answer is acceptable, sampling is faster.' }
  ],
  ref:{ headers:['Method','Strength','Weakness'], rows:[['`DISTINCT ... LIMIT 1 OFFSET 1`','Short, readable','MySQL syntax; slow with large offsets'],['`MAX(...) WHERE < MAX`','Portable; returns NULL if missing','Only works for the second, awkward for Nth'],['`DENSE_RANK`','Works for Nth and per group','Needs MySQL 8 and a CTE']] },
  related:['dense-rank','rank-sql','top-n-per-group','limit-sql']
};

/* --- top-n-per-group --- */
DEEP['top-n-per-group'] = {
  level:'Advanced',
  tldr:'Rank rows inside each group in a CTE, then keep the ranks you want. LIMIT cannot do this, because it cuts the whole result.',
  intuition:{ text:[
    '"Who is the top earner?" is easy. "Who is the top earner **in each department**?" is harder, because LIMIT 1 returns one row for the whole table. You need the database to number rows separately inside every department.',
    'Window functions do exactly that: PARTITION BY restarts the numbering for each group, and a filter on the number keeps the top N.'
  ], analogy:'A competition with several categories: a separate podium for each one.' },
  how:[
    'Choose the group (`PARTITION BY dept_id`).',
    'Choose what "top" means (`ORDER BY salary DESC`).',
    'Choose the function: ROW_NUMBER (exactly N rows), RANK or DENSE_RANK (include ties).',
    'Compute the rank in a CTE.',
    'Filter on `rank <= N` in the outer query.'
  ],
  diagrams:[
    { type:'flow', arrows:['rank within each department','keep rnk = 1'], panels:[
      { title:'Ranked', rows:[['name','dept','salary','rnk'],['Chitra',10,60000,1],['Asha',10,50000,2],['Bilal',20,40000,1],['Esha',20,40000,1],['Deepak',30,45000,1],['Farhan','NULL',35000,1]], hl:{1:'hit',3:'hit',4:'hit',5:'hit',6:'hit'} },
      { title:'Top 1 per department', rows:[['name','dept'],['Chitra',10],['Bilal',20],['Esha',20],['Deepak',30],['Farhan','NULL']] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Exactly one row per department', scenario:'Ties must not produce two rows. Break them by name.', table:T(EMP,'Table: employees'), task:'Use ROW_NUMBER with a tie-breaker.',
      formula:'WITH r AS (\n  SELECT name, dept_id, salary,\n         ROW_NUMBER() OVER (\n           PARTITION BY dept_id\n           ORDER BY salary DESC, name\n         ) AS rn\n  FROM employees\n)\nSELECT name, dept_id, salary\nFROM r\nWHERE rn = 1;', steps:['ROW_NUMBER never repeats a number.','In department 20, Bilal comes before Esha alphabetically.'], table2:{ rows:[['name','dept_id','salary'],['Farhan','NULL',35000],['Chitra',10,60000],['Bilal',20,40000],['Deepak',30,45000]], caption:'Result' }, result:'Four rows, one per department group (the NULL group included).' },
    { level:'Business case', title:'Top customer in each city by spend', scenario:'Regional managers want the best customer of their city.', table:T(ORD,'Table: orders'), task:'Total per customer, join the city, then rank within city.',
      formula:'WITH totals AS (\n  SELECT c.city, c.name, SUM(o.amount) AS total\n  FROM customers c\n  JOIN orders o ON c.customer_id = o.customer_id\n  GROUP BY c.city, c.customer_id, c.name\n),\nranked AS (\n  SELECT city, name, total,\n         DENSE_RANK() OVER (PARTITION BY city ORDER BY total DESC) AS rnk\n  FROM totals\n)\nSELECT city, name, total\nFROM ranked\nWHERE rnk = 1;', steps:['Pune has Asha (3300) and Chitra (700), so Asha is first.','Delhi has only Bilal (1700).','Mumbai has Deepak, who has no orders, so it does not appear.'], table2:{ rows:[['city','name','total'],['Delhi','Bilal',1700],['Pune','Asha',3300]], caption:'Result' }, result:'Aggregate first, then rank. Ranking before aggregating would rank individual orders.' }
  ],
  edge:[
    { t:'LIMIT does not work per group', d:'`LIMIT 1` returns one row for the whole result. Per-group limits need a window function.' },
    { t:'Ties: which function?', d:'ROW_NUMBER gives exactly N rows and breaks ties arbitrarily. RANK and DENSE_RANK include everyone tied at the cut-off, which can return more than N rows.' },
    { t:'Make ROW_NUMBER deterministic', d:'Add a unique tie-breaker, otherwise the result may differ between runs.' },
    { t:'Aggregate before ranking', d:'To rank customers by total spend, group first in a CTE, then rank the totals.' },
    { t:'NULL groups', d:'Rows with a NULL partition value form their own group and get their own top row.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the two largest orders of each customer.', table:T(ORD,'Table: orders'), hint:'ROW_NUMBER per customer by amount, keep rn <= 2.', solution:'WITH r AS (\n  SELECT order_id, customer_id, amount,\n         ROW_NUMBER() OVER (\n           PARTITION BY customer_id ORDER BY amount DESC, order_id\n         ) AS rn\n  FROM orders\n)\nSELECT order_id, customer_id, amount\nFROM r\nWHERE rn <= 2;', explain:'Customer 101: orders 3 (1500) and 1 (1200). Customer 102: orders 5 (900) and 2 (800). Customer 103 has only order 4 (700).' },
    { level:'Interview', q:'Explain why RANK might return three rows for "top 2 per group", and how to guarantee exactly two.', hint:'Think about ties at the cut-off.', solution:'If the 2nd and 3rd rows tie, RANK gives them the same rank 2, so rnk <= 2 returns three rows.\nTo guarantee exactly two rows use ROW_NUMBER with a deterministic tie-breaker.', explain:'The right answer depends on the business rule: include ties, or return exactly N.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you get the top N rows per group in SQL?', a:'Number or rank the rows with PARTITION BY the group and ORDER BY the value descending, in a CTE or derived table, then filter on the rank. ROW_NUMBER gives exactly N rows, and RANK or DENSE_RANK include ties.',
      structure:'Say "window function in a CTE", name the three ranking functions, then explain the tie rule.',
      follow:[ { q:'Why not LIMIT?', a:'LIMIT applies to the whole result set, not to each group.' } ] },
    { level:'Intermediate', q:'Top product by sales in each category: ROW_NUMBER, RANK or DENSE_RANK?', a:'It depends on the requirement. If the business wants one product per category, ROW_NUMBER with a tie-breaker. If ties should all be shown, RANK or DENSE_RANK.',
      tradeoff:'ROW_NUMBER silently drops tied products. State the rule and confirm it with the stakeholder.' },
    { level:'Scenario', q:'Before MySQL 8 there were no window functions. How would you solve it?', a:'With a correlated subquery that counts how many rows in the same group have a higher value: WHERE (SELECT COUNT(*) FROM t x WHERE x.group = t.group AND x.value > t.value) < N. It is less efficient but works.' }
  ],
  ref:{ headers:['Need','Use'], rows:[['Exactly one row per group','`ROW_NUMBER`'],['Include ties','`RANK` / `DENSE_RANK`'],['Rank totals','Aggregate in a CTE first'],['Older MySQL','Correlated subquery with COUNT']] },
  related:['row-number','rank-sql','dense-rank','cte']
};

/* --- find-duplicates --- */
DEEP['find-duplicates'] = {
  level:'Intermediate',
  tldr:'Group by the columns that should be unique and keep groups with `HAVING COUNT(*) > 1`.',
  intuition:{ text:[
    'A duplicate is not a property of one row. It is a property of a **group** of rows that share the same values in the columns that should be unique. So the natural tool is GROUP BY: collect rows with equal values, count them, and keep counts above one.',
    'The first decision is business, not technical: which columns define "the same"? Name and city? Email only? Cleaning decisions follow from that answer.'
  ], analogy:'Sorting a pile of duplicate photos: group identical ones together and look at piles bigger than one.' },
  how:[
    'Decide which columns define a duplicate.',
    'Standardise them first: TRIM and LOWER for text.',
    '`GROUP BY` those columns with `COUNT(*)`.',
    '`HAVING COUNT(*) > 1` keeps repeated groups.',
    'To see the actual rows, join back or use a window COUNT.'
  ],
  diagrams:[
    { type:'flow', arrows:['group by customer, city','HAVING COUNT(*) > 1'], panels:[
      { title:'cust_dup', rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[3,'Asha','Pune'],[4,'Chitra','Pune'],[5,'Bilal','Delhi']], hl:{1:'miss',3:'miss',2:'find',5:'find'} },
      { title:'Duplicate groups', rows:[['customer','city','times'],['Asha','Pune',2],['Bilal','Delhi',2]] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Show the duplicate rows themselves', scenario:'A reviewer wants every row that belongs to a duplicate group, with its id.', table:withHl({rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[3,'Asha','Pune'],[4,'Chitra','Pune'],[5,'Bilal','Delhi']]},{},'Table: cust_dup'), task:'Use a window COUNT.',
      formula:'WITH c AS (\n  SELECT id, customer, city,\n         COUNT(*) OVER (PARTITION BY customer, city) AS n\n  FROM cust_dup\n)\nSELECT id, customer, city\nFROM c\nWHERE n > 1\nORDER BY customer, id;', steps:['COUNT OVER attaches the group size to each row.','Rows in groups of 2 or more are kept.'], table2:{ rows:[['id','customer','city'],[1,'Asha','Pune'],[3,'Asha','Pune'],[2,'Bilal','Delhi'],[5,'Bilal','Delhi']], caption:'Result' }, result:'Four rows belong to two duplicate groups.' },
    { level:'Business case', title:'Duplicate emails that differ only by case and spaces', scenario:'A newsletter list holds emails typed in different ways. They must be matched ignoring case and spaces.', table:withHl({rows:[['id','email'],[1,'asha@example.com'],[2,' ASHA@example.com '],[3,'bilal@example.com']]},{'B2:B3':'miss'},'Table: subscribers'), task:'Standardise before grouping.',
      formula:'SELECT LOWER(TRIM(email)) AS clean_email,\n       COUNT(*) AS times\nFROM subscribers\nGROUP BY LOWER(TRIM(email))\nHAVING COUNT(*) > 1;', steps:['TRIM removes the spaces and LOWER ignores case.','Both asha rows become the same value.'], table2:{ rows:[['clean_email','times'],['asha@example.com',2]], caption:'Result' }, result:'Without cleaning, no duplicates would be found. After cleaning, add a UNIQUE constraint on the cleaned column to prevent new ones.' }
  ],
  edge:[
    { t:'Decide what "duplicate" means', d:'Same email? Same name and city? Different definitions give different answers. Agree on the key before cleaning.' },
    { t:'Hidden differences', d:'Case, trailing spaces and different spellings hide duplicates. Standardise first.' },
    { t:'NULLs form one group', d:'Several NULLs in a grouping column count as duplicates of each other in GROUP BY, although `NULL = NULL` is not true.' },
    { t:'Keep one, delete the rest', d:'Finding is the easy part. Decide which copy to keep (usually the earliest id) and delete in a transaction.' },
    { t:'Prevent them', d:'A UNIQUE constraint rejects future duplicates at the source.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Find order amounts that appear more than once in the orders table.', table:T(ORD,'Table: orders'), hint:'Group by amount.', solution:'SELECT amount, COUNT(*) AS times\nFROM orders\nGROUP BY amount\nHAVING COUNT(*) > 1;', explain:'All six amounts (1200, 800, 1500, 700, 900, 600) are different, so no rows are returned. An empty result is a valid answer.' },
    { level:'Interview', q:'Return only the extra copies (not the first of each group) of the duplicate rows in cust_dup.', table:withHl({rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[3,'Asha','Pune'],[4,'Chitra','Pune'],[5,'Bilal','Delhi']]},{},'Table: cust_dup'), hint:'ROW_NUMBER partitioned by the duplicate columns; keep rn > 1.',
      solution:'WITH n AS (\n  SELECT id, customer, city,\n         ROW_NUMBER() OVER (PARTITION BY customer, city ORDER BY id) AS rn\n  FROM cust_dup\n)\nSELECT id, customer, city FROM n WHERE rn > 1;', explain:'Ids 3 and 5. These are the rows you would delete to keep one copy of each.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you find duplicate rows in SQL?', a:'Group by the columns that should be unique and use HAVING COUNT(*) > 1. For example, SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1.',
      structure:'State the key decision (what defines a duplicate), then the query, then how you would clean and prevent them.',
      follow:[ { q:'How do you see the full duplicate rows?', a:'Use COUNT(*) OVER (PARTITION BY ...) in a CTE and keep rows where the count is above 1, or join back to the grouped result.' } ] },
    { level:'Intermediate', q:'How do you delete duplicates and keep one?', a:'Number rows in each duplicate group with ROW_NUMBER ordered by id and delete rn > 1, or self-join and delete rows that have a twin with a lower id. I preview with a SELECT and run it in a transaction.' },
    { level:'Scenario', q:'Duplicates keep appearing every month. What is your approach?', a:'Fix it at the source: add a UNIQUE constraint or a dedupe step in the load process, and standardise values (TRIM, LOWER) before loading. Cleaning repeatedly downstream treats the symptom.' }
  ],
  ref:{ headers:['Task','Pattern'], rows:[['Find duplicate keys','`GROUP BY k HAVING COUNT(*) > 1`'],['See all rows','`COUNT(*) OVER (PARTITION BY k)`'],['Extra copies only','`ROW_NUMBER() ... rn > 1`'],['Prevent','`UNIQUE` constraint']] },
  related:['group-by','having','delete-duplicate-rows','row-number']
};

/* --- customers-without-orders --- */
DEEP['customers-without-orders'] = {
  level:'Intermediate',
  tldr:'This is the "anti join": rows in one table with **no match** in another. Use LEFT JOIN with IS NULL, or NOT EXISTS. Avoid NOT IN when NULLs are possible.',
  intuition:{ text:[
    'Most questions ask what exists. This one asks what is missing: customers who never ordered, products never sold, employees without a department. The answer is a set difference: all customers minus those who appear in orders.',
    'SQL gives you three ways to write it. They look different, but they ask the same thing. The only one with a trap is NOT IN.'
  ], analogy:'Taking the full class list and crossing off everyone who handed in homework, to see who is left.' },
  how:[
    '**LEFT JOIN + IS NULL**: keep all customers, attach orders, keep rows where the order key is NULL.',
    '**NOT EXISTS**: for each customer, test that no matching order exists.',
    '**NOT IN**: customers whose id is not in the list of order customer ids (careful with NULLs).',
    'Test a column of the right table that can never be NULL in a real match (its key).',
    'Add extra conditions (such as a date range) inside the join or the subquery, not in the outer WHERE.'
  ],
  diagrams:[
    { type:'venn', kind:'left-anti', a:'customers', b:'orders', caption:'Only the part of customers that has no overlap with orders.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'NOT EXISTS with a time window', scenario:'Customers who did not order in March 2026.', table:T(ORD,'Table: orders'), task:'Add the date range inside the subquery.',
      formula:'SELECT c.name\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM orders o\n  WHERE o.customer_id = c.customer_id\n    AND o.order_date >= \'2026-03-01\'\n    AND o.order_date <  \'2026-04-01\'\n);', steps:['Customers 101 and 102 ordered in March.','Customers 103 and 104 did not.'], table2:{ rows:[['name'],['Chitra'],['Deepak']], caption:'Result' }, result:'Chitra and Deepak did not order in March.' },
    { level:'Business case', title:'Win-back list with the last order date', scenario:'Marketing wants customers whose last order was more than 30 days before 2026-03-20, plus customers who never ordered.', table:T(ORD,'Table: orders'), task:'LEFT JOIN a per-customer summary.',
      formula:'SELECT c.name, s.last_order\nFROM customers c\nLEFT JOIN (\n  SELECT customer_id, MAX(order_date) AS last_order\n  FROM orders GROUP BY customer_id\n) s ON c.customer_id = s.customer_id\nWHERE s.last_order IS NULL\n   OR s.last_order < DATE_SUB(\'2026-03-20\', INTERVAL 30 DAY);', steps:['Last order dates are 2026-03-15 (101), 2026-03-09 (102) and 2026-02-21 (103).','The cut-off is 2026-02-18, so nobody has ordered earlier than that.','Deepak never ordered, so his last_order is NULL.'], table2:{ rows:[['name','last_order'],['Deepak','NULL']], caption:'Result' }, result:'Only Deepak qualifies on these dates. Change the cut-off and the list changes.' }
  ],
  edge:[
    { t:'NOT IN returns nothing with NULLs', d:'If the subquery can return NULL, `NOT IN` is UNKNOWN for every row. This is the classic trap.' },
    { t:'Filter inside the join, not WHERE', d:'For "no orders in March", the date test belongs in the ON clause (or the subquery). In WHERE it would remove the NULL rows you are looking for.' },
    { t:'Check the right column for NULL', d:'Test the key of the right table. If you test a column that can be NULL for real matches, you also catch matched rows.' },
    { t:'Duplicates', d:'LEFT JOIN with IS NULL returns each customer once because unmatched rows have only one NULL row. EXISTS does too.' },
    { t:'Performance', d:'Index the foreign key (`orders.customer_id`). With it, all three forms are efficient.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List departments that have no employees, using NOT EXISTS.', table:T(DEPT,'Table: departments'), hint:'Correlate on dept_id.', solution:'SELECT d.dept_name\nFROM departments d\nWHERE NOT EXISTS (\n  SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id\n);', explain:'IT has no employees, so it is the only row returned.' },
    { level:'Interview', q:'Show the three ways to find products never sold, and which one is risky and why.', hint:'LEFT JOIN, NOT EXISTS, NOT IN.', solution:'1. products p LEFT JOIN order_items i ON p.product_id = i.product_id WHERE i.product_id IS NULL\n2. WHERE NOT EXISTS (SELECT 1 FROM order_items i WHERE i.product_id = p.product_id)\n3. WHERE p.product_id NOT IN (SELECT product_id FROM order_items)\nRisky: NOT IN, because a NULL product_id in order_items makes it return no rows.', explain:'This is one of the most common SQL interview questions. Name the trap explicitly.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you find customers who have never placed an order?', a:'LEFT JOIN orders to customers and keep rows where the order key IS NULL, or use NOT EXISTS with a correlated subquery. Both return customers with no matching order.',
      structure:'Name two methods, show the LEFT JOIN, and mention the NOT IN trap.',
      follow:[ { q:'Why might NOT IN return no rows?', a:'If the subquery returns a NULL, x NOT IN (...) is never true, so every row is rejected.' } ] },
    { level:'Intermediate', q:'Which of the three methods is fastest?', a:'On modern optimizers they usually perform similarly when the join key is indexed. NOT EXISTS and LEFT JOIN with IS NULL are the safest choices. I confirm with EXPLAIN on the real data.' },
    { level:'Scenario', q:'Find customers who ordered last year but not this year.', a:'Customers with an order in the last year, and NOT EXISTS an order in the current year: WHERE EXISTS (last year) AND NOT EXISTS (this year). It combines both tests with correlated subqueries.' }
  ],
  ref:{ headers:['Method','NULL-safe?'], rows:[['`LEFT JOIN ... WHERE r.key IS NULL`','Yes'],['`NOT EXISTS`','Yes'],['`NOT IN (subquery)`','No: avoid with nullable columns']] },
  related:['left-join','exists-sql','in-sql','is-null']
};

/* --- month-over-month --- */
DEEP['month-over-month'] = {
  level:'Advanced',
  tldr:'Aggregate by month in a CTE, then use LAG for last month\'s value, and compute `(current - previous) / previous x 100`.',
  intuition:{ text:[
    'Every business asks "are we growing?". The answer needs two numbers side by side: this month and last month. LAG puts them on the same row. The only care needed is to aggregate **first**, so each row is a month and "the previous row" means "the previous month".',
    'A subtle issue is missing months. If a month has no sales, there is no row for it, and LAG would compare with the month before. A calendar table solves that.'
  ], analogy:'Reading a monthly bank statement summary: each line compared with the line above.' },
  how:[
    'Aggregate to one row per month in a CTE (use `DATE_FORMAT(order_date, \'%Y-%m\')` to keep years apart).',
    'Add `LAG(total) OVER (ORDER BY month)`.',
    'Compute the difference and the percentage.',
    'Guard against division by zero with `NULLIF`.',
    'If months can be missing, join the totals to a calendar of all months.'
  ],
  diagrams:[
    { type:'flow', arrows:['aggregate','LAG and growth'], panels:[
      { title:'Orders', text:'six rows' },
      { title:'Monthly totals', rows:[['ym','total'],['2026-01',2000],['2026-02',2200],['2026-03',1500]] },
      { title:'Growth', rows:[['ym','total','prev','growth_pct'],['2026-01',2000,'NULL','NULL'],['2026-02',2200,2000,10],['2026-03',1500,2200,-31.82]], hl:{3:'miss'} }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Year-to-date totals', scenario:'Show the cumulative total at the end of each month.', table:T(ORD,'Table: orders'), task:'Combine monthly totals with a running sum.',
      formula:'WITH m AS (\n  SELECT DATE_FORMAT(order_date, \'%Y-%m\') AS ym, SUM(amount) AS total\n  FROM orders\n  GROUP BY ym\n)\nSELECT ym, total,\n       SUM(total) OVER (ORDER BY ym) AS ytd\nFROM m;', steps:['Monthly totals are 2000, 2200 and 1500.','The running sum gives 2000, 4200 and 5700.'], table2:{ rows:[['ym','total','ytd'],['2026-01',2000,2000],['2026-02',2200,4200],['2026-03',1500,5700]], caption:'Result' }, result:'By the end of March the year-to-date total is 5700.' },
    { level:'Business case', title:'A growth report that survives a zero month', scenario:'If a month has zero sales, growth would divide by zero. The report must show NULL instead of failing.', table:T(ORD,'Table: orders'), task:'Use NULLIF in the denominator.',
      formula:'WITH m AS (\n  SELECT DATE_FORMAT(order_date, \'%Y-%m\') AS ym, SUM(amount) AS total\n  FROM orders GROUP BY ym\n)\nSELECT ym, total,\n       LAG(total) OVER (ORDER BY ym) AS prev_total,\n       ROUND(100.0 * (total - LAG(total) OVER (ORDER BY ym))\n             / NULLIF(LAG(total) OVER (ORDER BY ym), 0), 2) AS growth_pct\nFROM m;', steps:['NULLIF turns a zero previous total into NULL, so the division returns NULL, not an error.'], table2:{ rows:[['ym','total','prev_total','growth_pct'],['2026-01',2000,'NULL','NULL'],['2026-02',2200,2000,10],['2026-03',1500,2200,-31.82]], caption:'Result' }, result:'February grew by 10%, and March fell by 31.82%.' }
  ],
  edge:[
    { t:'Aggregate before LAG', d:'LAG works on rows. If the rows are orders, "previous" is the previous order, not the previous month.' },
    { t:'Group by year and month', d:'Grouping by `MONTH()` alone merges January 2025 and January 2026. Use `YEAR-MONTH`.' },
    { t:'Missing months', d:'A month with no sales has no row, so LAG compares with an earlier month. Join to a calendar table with COALESCE(total, 0).' },
    { t:'Division by zero and the base effect', d:'Growth from a tiny base looks huge. Show absolute values next to percentages.' },
    { t:'Sort key', d:'Sort by a text key like `2026-03`, which sorts chronologically. Month names sort alphabetically.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show each month\'s total, the change in amount from the previous month, and whether it increased.', table:T(ORD,'Table: orders'), hint:'LAG and a CASE.', solution:'WITH m AS (\n  SELECT DATE_FORMAT(order_date, \'%Y-%m\') AS ym, SUM(amount) AS total\n  FROM orders GROUP BY ym\n)\nSELECT ym, total,\n       total - LAG(total) OVER (ORDER BY ym) AS change_amt,\n       CASE WHEN total > LAG(total) OVER (ORDER BY ym) THEN \'Up\' ELSE \'Down/Same\' END AS trend\nFROM m;', explain:'February is +200 (Up), and March is -700 (Down/Same). January has no previous month, so its change is NULL.' },
    { level:'Interview', q:'Your growth numbers look wrong because April has no orders and is missing from the results. How do you fix it?', hint:'Generate all months first.', solution:'Generate a calendar of months (recursive CTE or calendar table), LEFT JOIN the monthly totals to it, and use COALESCE(total, 0).', explain:'Then April appears with 0, and May\'s growth is measured against April instead of March.' }
  ],
  interviewPlus:[
    { level:'Intermediate', q:'How do you calculate month-over-month growth in SQL?', a:'Aggregate sales by month in a CTE, then use LAG to get the previous month\'s total and calculate (total - previous) * 100.0 / previous, using NULLIF to protect against a zero previous value.',
      structure:'Aggregate, then LAG, then formula, then edge cases (first month, zero, missing months).',
      follow:[ { q:'Why aggregate first?', a:'LAG moves by rows. After grouping by month, each row is a month, so the previous row is the previous month.' },
               { q:'What does the first month show?', a:'NULL, because there is no previous month.' } ] },
    { level:'Advanced', q:'How would you compare each month with the same month last year?', a:'LAG with an offset of 12 on a complete monthly series, or a self join on year-1 and the same month. A calendar table makes the offset reliable.',
      tradeoff:'LAG(total, 12) is short but assumes no missing months. A join on (year - 1, month) is safe with gaps.' },
    { level:'Scenario', q:'A manager sees +900% growth in one month. What do you check?', a:'The base: the previous month may have been tiny or partially loaded. I show absolute values next to the percentage, check for data loading issues and consider a rolling or year-over-year comparison.' }
  ],
  ref:{ headers:['Part','Detail'], rows:[['Key','`DATE_FORMAT(date, \'%Y-%m\')`'],['Previous','`LAG(total) OVER (ORDER BY ym)`'],['Growth %','`(total - prev) * 100.0 / NULLIF(prev, 0)`'],['Missing months','Calendar table + `COALESCE`'],['Year-over-year','`LAG(total, 12)` on a complete series']] },
  related:['lag','running-total','cte','date-format']
};

/* --- pivot-with-case --- */
DEEP['pivot-with-case'] = {
  level:'Advanced',
  tldr:'Pivot rows into columns with `SUM(CASE WHEN ... THEN value ELSE 0 END)` and GROUP BY. MySQL has no PIVOT keyword.',
  intuition:{ text:[
    'A pivot turns a tall list into a wide table: months as columns, categories across the top. In Excel you drag fields. In MySQL you describe each new column yourself: "this column is the sum of amounts where the month is January".',
    'Each of those descriptions is a CASE expression inside an aggregate. GROUP BY keeps one row per key, and the CASE columns spread the values across.'
  ], analogy:'Sorting a pile of coins into one cup per coin type, then counting each cup.' },
  how:[
    'Decide the row key (what each output row represents), for example the customer.',
    'For each new column write `SUM(CASE WHEN category = x THEN value ELSE 0 END) AS x`.',
    'Use `COUNT(CASE WHEN ... THEN 1 END)` to count instead of sum.',
    '`GROUP BY` the row key.',
    'The list of columns is fixed in the query. A dynamic list needs dynamic SQL.'
  ],
  diagrams:[
    { type:'flow', arrows:['SUM(CASE ...) + GROUP BY'], panels:[
      { title:'Tall (orders)', rows:[['customer','month','amount'],[101,1,1200],[101,2,1500],[101,3,600],[102,1,800],[102,3,900]] },
      { title:'Wide (pivoted)', rows:[['customer','jan','feb','mar'],[101,1200,1500,600],[102,800,0,900]] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Counting instead of summing', scenario:'How many orders did each customer place in each month?', table:T(ORD,'Table: orders'), task:'Pivot counts.',
      formula:'SELECT customer_id,\n  COUNT(CASE WHEN MONTH(order_date)=1 THEN 1 END) AS jan,\n  COUNT(CASE WHEN MONTH(order_date)=2 THEN 1 END) AS feb,\n  COUNT(CASE WHEN MONTH(order_date)=3 THEN 1 END) AS mar\nFROM orders\nGROUP BY customer_id;', steps:['CASE returns 1 for a matching month and NULL otherwise.','COUNT ignores NULLs, so only matching orders are counted.'], table2:{ rows:[['customer_id','jan','feb','mar'],[101,1,1,1],[102,1,0,1],[103,0,1,0]], caption:'Result' }, result:'Customer 101 ordered once every month.' },
    { level:'Business case', title:'Headcount by department and pay band', scenario:'HR wants a department by band grid.', table:T(EMP,'Table: employees'), task:'Pivot the bands into columns.',
      formula:'SELECT dept_id,\n  SUM(salary >= 50000)                      AS high,\n  SUM(salary >= 40000 AND salary < 50000)   AS medium,\n  SUM(salary < 40000)                       AS low\nFROM employees\nGROUP BY dept_id;', steps:['In MySQL a comparison returns 1 or 0, so SUM counts matches.','In standard SQL write SUM(CASE WHEN ... THEN 1 ELSE 0 END).'], table2:{ rows:[['dept_id','high','medium','low'],['NULL',0,0,1],[10,2,0,0],[20,0,2,0],[30,0,1,0]], caption:'Result' }, result:'Department 10 has two high earners, and department 20 has two medium earners.' }
  ],
  edge:[
    { t:'ELSE 0 versus NULL', d:'`ELSE 0` shows zeros for missing combinations. Without ELSE, SUM returns NULL where nothing matched.' },
    { t:'The column list is static', d:'New categories need new columns in the query. For unknown categories, build the SQL dynamically (prepared statements).' },
    { t:'Grouping key', d:'Every non-aggregated column in SELECT must be in GROUP BY. Choose the row key deliberately.' },
    { t:'Portability', d:'SQL Server and Oracle have a PIVOT keyword. The CASE approach works everywhere.' },
    { t:'Unpivot', d:'The reverse (columns to rows) uses UNION ALL of one SELECT per column.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Pivot order amounts into one column per customer (101, 102, 103), with one row for the whole table.', table:T(ORD,'Table: orders'), hint:'No GROUP BY, SUM(CASE ...) per customer.', solution:'SELECT\n  SUM(CASE WHEN customer_id = 101 THEN amount ELSE 0 END) AS c101,\n  SUM(CASE WHEN customer_id = 102 THEN amount ELSE 0 END) AS c102,\n  SUM(CASE WHEN customer_id = 103 THEN amount ELSE 0 END) AS c103\nFROM orders;', explain:'The result is one row: 3300, 1700 and 700.' },
    { level:'Interview', q:'Convert the pivoted jan/feb/mar columns back into rows (unpivot) in MySQL.', hint:'UNION ALL, one SELECT per column.', solution:'SELECT customer_id, \'jan\' AS month, jan AS amount FROM pivoted\nUNION ALL\nSELECT customer_id, \'feb\', feb FROM pivoted\nUNION ALL\nSELECT customer_id, \'mar\', mar FROM pivoted;', explain:'Each SELECT emits one row per customer for one column. Stacked together, they restore the tall layout.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you pivot data in MySQL?', a:'With conditional aggregation: SUM(CASE WHEN category = x THEN value ELSE 0 END) for each new column, and a GROUP BY on the row key. MySQL has no PIVOT keyword.',
      follow:[ { q:'How would you count instead of sum?', a:'COUNT(CASE WHEN ... THEN 1 END), or SUM(CASE WHEN ... THEN 1 ELSE 0 END).' } ] },
    { level:'Intermediate', q:'The categories change every month. How do you handle it?', a:'Generate the CASE columns dynamically: query the distinct categories, build the SQL string, and run it with a prepared statement. Or pivot in the reporting tool instead.',
      tradeoff:'Dynamic SQL adds complexity and injection risk, so I validate the category names.' },
    { level:'Scenario', q:'Why pivot in SQL rather than in Excel?', a:'When the dataset is too large for Excel, the pivot must be refreshed automatically, or other tools consume the result. Otherwise a PivotTable is quicker to build and explore.' }
  ],
  ref:{ headers:['Goal','Pattern'], rows:[['Sum per category','`SUM(CASE WHEN c = x THEN v ELSE 0 END)`'],['Count per category','`COUNT(CASE WHEN c = x THEN 1 END)`'],['Row key','`GROUP BY key`'],['Reverse','`UNION ALL` per column']] },
  related:['case-when','group-by','sum-sql','count-sql']
};

/* --- delete-duplicate-rows --- */
D('delete-duplicate-rows',{ l:'Advanced', t:'Keep one row per duplicate group by self-joining and deleting rows that have a lower-id twin. Preview first and use a transaction.',
  i:['Finding duplicates is easy. Removing them safely is the careful part: you must decide which copy survives, usually the earliest id, and delete the rest without touching the survivors.','MySQL does not let you select from the table being modified in a subquery, so the self-join form is the standard approach.'], a:'Keeping the first copy of each document and shredding the repeats.',
  h:['Define which columns make a duplicate.','Choose the survivor (lowest id).','Preview the rows to delete with a SELECT.','Run the DELETE in a transaction, check the count, then add a UNIQUE constraint.'],
  d:[FL(['c.id > d.id'],[{ title:'cust_dup', rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[3,'Asha','Pune'],[4,'Chitra','Pune'],[5,'Bilal','Delhi']], hl:{3:'miss',5:'miss'} },{ title:'After DELETE', rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[4,'Chitra','Pune']] }])],
  x:[X('Variation','Using ROW_NUMBER to find the extras','List ids to delete.','Number rows per group.','WITH n AS (SELECT id, ROW_NUMBER() OVER (PARTITION BY customer, city ORDER BY id) AS rn FROM cust_dup)\nSELECT id FROM n WHERE rn > 1;',['Rows numbered above 1 are extra copies.'],'Ids 3 and 5.'),
     X('Business case','Deleting through a join, then preventing recurrence','Clean the table and stop new duplicates.','Delete, then constrain.','DELETE c FROM cust_dup c JOIN (\n  SELECT id FROM (\n    SELECT id, ROW_NUMBER() OVER (PARTITION BY customer, city ORDER BY id) rn FROM cust_dup) x\n  WHERE rn > 1) d ON c.id = d.id;\nALTER TABLE cust_dup ADD UNIQUE (customer, city);',['The numbered copies are deleted by id.','The unique constraint rejects future duplicates.'],'Three rows remain, and duplicates cannot return.')],
  e:[['Decide the key first','Different definitions of duplicate give different deletions.'],['Same-table subquery','MySQL rejects selecting from the table you delete from; wrap in a derived table or join.'],['Standardise first','TRIM and LOWER before comparing.'],['Back up','Deletes are permanent after COMMIT.']],
  p:[P('Medium','Preview the rows that the cleanup would delete.','Same join with SELECT.','SELECT c.* FROM cust_dup c JOIN cust_dup d ON c.customer = d.customer AND c.city = d.city AND c.id > d.id;','Ids 3 and 5.'),
     P('Interview','Delete duplicates keeping the earliest id.','Self join.','DELETE c FROM t c JOIN t d ON c.k1 = d.k1 AND c.k2 = d.k2 AND c.id > d.id;','Then add a UNIQUE constraint.')],
  q:[Q('Basic','How do you delete duplicates and keep one?','Self-join and delete rows with a lower-id twin, or number rows and delete rn > 1.',{ f:[['Why preview first?','Deletes are permanent after COMMIT.']] }),
     Q('Scenario','The same duplicates reappear monthly.','Fix at the source: a UNIQUE constraint and cleaning in the load process.',{ t:'Repeated clean-up treats the symptom.' })],
  r:RT(['Step','Action'],[['Define','Which columns make a duplicate'],['Preview','`SELECT` the extras'],['Delete','Self-join in a transaction'],['Prevent','`UNIQUE` constraint']]), rel:['find-duplicates','row-number','delete-sql','constraints'] });
})();
