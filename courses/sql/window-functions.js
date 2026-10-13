/* Datapath | SQL | Window functions
 * Lessons in this file: window-intro, row-number, rank-sql, dense-rank, ntile, lag, lead, first-value, running-total, moving-average
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
  const { EMP, ORD } = DP.datasets.sql;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- window-intro --- */
'window-intro': {
  title:'Window functions: OVER and PARTITION BY', tagline:'Calculate across related rows without collapsing them.',
  prereq:['group-by'],
  what:['A **window function** calculates over a set of rows related to the current row.','Unlike GROUP BY, it **keeps every row**.','The OVER clause defines the window.'],
  why:['Rankings, running totals, comparisons with the previous row and group averages next to each row.','The most asked advanced SQL topic.'],
  syntax:{ code:'function() OVER (\n  PARTITION BY column\n  ORDER BY column\n  ROWS BETWEEN ... AND ...\n)', parts:[['PARTITION BY','Splits rows into groups. Like GROUP BY, but rows are kept.'],['ORDER BY','Orders rows inside each partition.'],['ROWS BETWEEN','Optional frame: which rows around the current one to include.']] },
  points:['**GROUP BY** reduces rows; a window function **keeps rows**.','Without PARTITION BY, the whole result is one window.','Aggregates (SUM, AVG, COUNT, MIN, MAX) also work as window functions.','Needs **MySQL 8.0 or later**.','Window functions run after WHERE, GROUP BY and HAVING, so you cannot filter on them in WHERE.','To filter on a window result, use a CTE or derived table.'],
  mistakes:['Using a window function in WHERE.','Confusing PARTITION BY with GROUP BY.','Forgetting ORDER BY inside OVER for rankings.'],
  example:{ title:'Each salary next to its department average', scenario:'You want every employee row, plus the average salary of their department.',
    table:withHl(EMP,{'C2:D7':'range'},'Table: employees'), task:'Add the department average to every row.', formula:'SELECT name, dept_id, salary,\n       AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg\nFROM employees;',
    steps:['PARTITION BY dept_id forms a window per department (NULL forms its own).','AVG is calculated per window, but all six rows are kept.'],
    table2:{ rows:[['name','dept_id','salary','dept_avg'],['Asha',10,50000,55000],['Bilal',20,40000,40000],['Chitra',10,60000,55000],['Deepak',30,45000,45000],['Esha',20,40000,40000],['Farhan','NULL',35000,35000]], caption:'Result' }, result:'Asha and Chitra both show their department average of 55000.' },
  practice:{ q:'Write a query that shows each order with the total amount of that customer\'s orders next to it.', table:T(ORD,'Table: orders'), hint:'SUM(amount) OVER (PARTITION BY customer_id).', solution:'SELECT order_id, customer_id, amount,\n       SUM(amount) OVER (PARTITION BY customer_id) AS customer_total\nFROM orders;', explain:'Customer 101\'s three orders each show 3300, customer 102\'s two orders show 1700 and customer 103\'s order shows 700.' },
  interview:[
    { level:'Basic', q:'What is a window function?', a:'A function that calculates over a set of related rows while keeping every row in the result, defined by an OVER clause.' },
    { level:'Basic', q:'How is PARTITION BY different from GROUP BY?', a:'GROUP BY collapses each group into one row. PARTITION BY only defines the window for the calculation, so all rows are returned.' },
    { level:'Intermediate', q:'Why can you not use a window function in WHERE?', a:'Window functions are evaluated after WHERE. I put the query in a CTE or derived table and filter in the outer query.' },
    { level:'Scenario', q:'Show each employee\'s salary as a percentage of their department total.', a:'salary * 100.0 / SUM(salary) OVER (PARTITION BY dept_id).' }
  ],
  mcq:[
    { q:'What does a window function keep?', o:['Every row','One row per group','Only NULLs','Only the first row'], a:0, why:'Unlike GROUP BY.' },
    { q:'PARTITION BY does what?', o:['Splits rows into groups for the window','Sorts the result','Filters rows','Joins tables'], a:0, why:'It defines the groups.' },
    { q:'Which MySQL version supports window functions?', o:['8.0 or later','5.7','5.5','Any'], a:0, why:'Window functions arrived in MySQL 8.' },
    { q:'Can you filter on a window result in WHERE?', o:['No, use a CTE or subquery','Yes','Only with HAVING','Only with LIMIT'], a:0, why:'They are evaluated after WHERE.' },
    { q:'Department 10 average in the example is:', o:['55000','50000','60000','45000'], a:0, why:'(50000 + 60000) / 2.' }
  ],
  recap:['Window functions calculate over related rows and keep all rows.','OVER defines the window; PARTITION BY splits it into groups.','Filter on them through a CTE or subquery.']
},

/* --- row-number --- */
'row-number': {
  title:'ROW_NUMBER', tagline:'Number the rows 1, 2, 3, ... in a chosen order.',
  prereq:['window-intro'],
  what:['ROW_NUMBER gives each row a unique number.','Numbers follow the ORDER BY inside OVER.','Ties get different numbers.'],
  why:['Pick the top row per group, remove duplicates and paginate.'],
  syntax:{ code:'ROW_NUMBER() OVER (\n  [PARTITION BY column]\n  ORDER BY column\n)', parts:[['ORDER BY','Decides the numbering order.'],['PARTITION BY','Optional. Restarts numbering for each group.']] },
  points:['Always unique, even for equal values.','Ties are numbered in an arbitrary order unless you add a tie-breaker column.','With PARTITION BY, numbering restarts at 1 for each group.','Perfect for "top 1 per group" and deleting duplicates.','Filter on it through a CTE.'],
  mistakes:['Expecting equal numbers for ties.','No tie-breaker, so results are not repeatable.','Filtering in WHERE directly.'],
  example:{ title:'Numbering employees by salary', scenario:'You want to number employees from the highest salary down.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Add a row number.', formula:'SELECT name, salary,\n       ROW_NUMBER() OVER (ORDER BY salary DESC, name) AS rn\nFROM employees;',
    steps:['Rows are ordered by salary, highest first, and ties by name.','Bilal and Esha both earn 40000, but get 4 and 5.'],
    table2:{ rows:[['name','salary','rn'],['Chitra',60000,1],['Asha',50000,2],['Deepak',45000,3],['Bilal',40000,4],['Esha',40000,5],['Farhan',35000,6]], caption:'Result' }, result:'Every row has a different number.' },
  practice:{ q:'Number each customer\'s orders from the earliest to the latest.', table:T(ORD,'Table: orders'), hint:'PARTITION BY customer_id and ORDER BY order_date.', solution:'SELECT order_id, customer_id, order_date,\n       ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS order_no\nFROM orders;', explain:'For customer 101, orders 1, 3 and 6 get 1, 2 and 3. Numbering restarts for each customer.' },
  interview:[
    { level:'Basic', q:'What does ROW_NUMBER do?', a:'It assigns a unique sequential number to each row in the order defined in OVER.' },
    { level:'Intermediate', q:'How does ROW_NUMBER treat ties?', a:'It still gives different numbers, in an arbitrary order unless a tie-breaker is added to ORDER BY.' },
    { level:'Intermediate', q:'How do you get the latest order per customer?', a:'ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) in a CTE, then keep rn = 1.' },
    { level:'Scenario', q:'How do you paginate with ROW_NUMBER?', a:'Number the rows in a CTE and filter WHERE rn BETWEEN 11 AND 20 for page 2 of 10.' }
  ],
  mcq:[
    { q:'Do ties get the same ROW_NUMBER?', o:['No','Yes','Only in MySQL','Only with PARTITION BY'], a:0, why:'Numbers are always unique.' },
    { q:'What restarts numbering for each group?', o:['PARTITION BY','GROUP BY','HAVING','DISTINCT'], a:0, why:'Each partition starts at 1.' },
    { q:'Chitra\'s row number in the example is:', o:['1','2','6','3'], a:0, why:'She earns the most.' },
    { q:'A common use is:', o:['Top 1 row per group','Joining tables','Creating tables','Adding indexes'], a:0, why:'Keep rn = 1.' },
    { q:'Where do you filter on rn?', o:['In an outer query or CTE','In WHERE of the same query','In SELECT','In ORDER BY'], a:0, why:'The window result must exist first.' }
  ],
  recap:['ROW_NUMBER gives unique numbers in the OVER order.','PARTITION BY restarts the numbering.','Use it for top-1 per group and duplicate removal.']
},

/* --- rank-sql --- */
'rank-sql': {
  title:'RANK', tagline:'Rank rows with ties, leaving gaps after them.',
  prereq:['row-number'],
  what:['RANK gives equal values the same rank.','The next rank **skips** numbers after a tie.','For example, 1, 2, 3, 4, 4, 6.'],
  why:['Leaderboards, top earners and "rank within department".'],
  syntax:{ code:'RANK() OVER (\n  [PARTITION BY column]\n  ORDER BY column DESC\n)', parts:[['ORDER BY','Decides the ranking order.']] },
  points:['Ties share a rank, and the next rank is skipped.','Compare: ROW_NUMBER never ties; DENSE_RANK has no gaps.','Add PARTITION BY to rank within groups.','Requires ORDER BY inside OVER.','Use `RANK() ... <= 3` in an outer query for the top 3 with ties.'],
  mistakes:['Expecting no gaps.','Using it when a unique number is needed.','Forgetting ORDER BY direction.'],
  example:{ title:'Salary ranking with ties', scenario:'Bilal and Esha earn the same 40000.',
    table:withHl(EMP,{'D3':'find','D6':'find'},'Table: employees'), task:'Rank employees by salary.', formula:'SELECT name, salary,\n       RANK() OVER (ORDER BY salary DESC) AS rnk\nFROM employees;',
    steps:['Bilal and Esha tie, so both get rank 4.','The next salary, 35000, gets rank 6, because rank 5 is skipped.'],
    table2:{ rows:[['name','salary','rnk'],['Chitra',60000,1],['Asha',50000,2],['Deepak',45000,3],['Bilal',40000,4],['Esha',40000,4],['Farhan',35000,6]], caption:'Result' }, result:'Ranks run 1, 2, 3, 4, 4, 6.' },
  practice:{ q:'Rank employees by salary within each department.', table:T(EMP,'Table: employees'), hint:'PARTITION BY dept_id.', solution:'SELECT name, dept_id, salary,\n       RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_rank\nFROM employees;', explain:'Chitra ranks 1 and Asha 2 in department 10. Bilal and Esha both rank 1 in department 20.' },
  interview:[
    { level:'Basic', q:'What does RANK do with ties?', a:'Tied rows get the same rank, and the next rank skips the tied positions.' },
    { level:'Intermediate', q:'RANK vs DENSE_RANK vs ROW_NUMBER?', a:'ROW_NUMBER is always unique. RANK gives ties the same number and leaves gaps. DENSE_RANK gives ties the same number without gaps.' },
    { level:'Intermediate', q:'Top 3 salaries including ties?', a:'Rank in a CTE or subquery and keep rnk <= 3, because RANK includes everyone tied at the cut-off.' },
    { level:'Scenario', q:'Which rank type for a competition leaderboard?', a:'RANK, because positions after a tie are skipped, like 1, 2, 2, 4.' }
  ],
  mcq:[
    { q:'RANK for salaries 60000, 50000, 45000, 40000, 40000, 35000 gives the last row:', o:['6','5','4','1'], a:0, why:'After the tie, rank 5 is skipped.' },
    { q:'Do tied rows share a rank?', o:['Yes','No','Only in MySQL','Only the first'], a:0, why:'Equal values get equal ranks.' },
    { q:'Which has no gaps?', o:['DENSE_RANK','RANK','ROW_NUMBER','NTILE'], a:0, why:'DENSE_RANK is consecutive.' },
    { q:'What does PARTITION BY do for RANK?', o:['Ranks within each group','Removes ties','Sorts the table','Creates gaps'], a:0, why:'Ranking restarts per group.' },
    { q:'Rank of Bilal and Esha:', o:['4 and 4','4 and 5','5 and 5','3 and 4'], a:0, why:'They tie at 4.' }
  ],
  recap:['RANK gives ties the same rank and skips the next numbers.','Add PARTITION BY to rank within groups.','Use a CTE to filter on rank.']
},

/* --- dense-rank --- */
'dense-rank': {
  title:'DENSE_RANK', tagline:'Rank rows with ties, without gaps.',
  prereq:['rank-sql'],
  what:['DENSE_RANK gives ties the same rank.','The next rank follows without skipping.','For example, 1, 2, 3, 4, 4, 5.'],
  why:['"Nth highest salary" questions, where each distinct value counts once.'],
  syntax:{ code:'DENSE_RANK() OVER (\n  [PARTITION BY column]\n  ORDER BY column DESC\n)', parts:[['ORDER BY','Decides the ranking order.']] },
  points:['Ties share a rank; ranks stay consecutive.','Best for the Nth highest **distinct** value.','Works with PARTITION BY.','Compare with RANK, which leaves gaps.','Filter via a CTE.'],
  mistakes:['Using RANK for Nth highest and getting gaps.','Forgetting DISTINCT thinking: DENSE_RANK handles it.','No ORDER BY inside OVER.'],
  example:{ title:'Dense salary ranking', scenario:'You want ranks with no gaps after ties.',
    table:withHl(EMP,{'D3':'find','D6':'find'},'Table: employees'), task:'Use DENSE_RANK.', formula:'SELECT name, salary,\n       DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\nFROM employees;',
    steps:['Bilal and Esha tie at 4.','Farhan gets 5, with no skipped number.'],
    table2:{ rows:[['name','salary','dr'],['Chitra',60000,1],['Asha',50000,2],['Deepak',45000,3],['Bilal',40000,4],['Esha',40000,4],['Farhan',35000,5]], caption:'Result' }, result:'Ranks run 1, 2, 3, 4, 4, 5.' },
  practice:{ q:'Write a query for the third highest distinct salary.', table:T(EMP,'Table: employees'), hint:'DENSE_RANK in a derived table, then keep dr = 3.', solution:'SELECT DISTINCT salary\nFROM (\n  SELECT salary,\n         DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\n  FROM employees\n) t\nWHERE dr = 3;', explain:'The distinct salaries are 60000, 50000, 45000, 40000 and 35000, so the third highest is 45000.' },
  interview:[
    { level:'Basic', q:'What is the difference between RANK and DENSE_RANK?', a:'Both give ties the same rank. RANK skips the following ranks, DENSE_RANK does not.' },
    { level:'Intermediate', q:'Which do you use for the Nth highest salary?', a:'DENSE_RANK, because the Nth distinct value is wanted, and ties should not push it down.' },
    { level:'Intermediate', q:'Can DENSE_RANK return the same number for different rows?', a:'Yes, for equal values in the ORDER BY.' },
    { level:'Scenario', q:'Second highest salary per department?', a:'DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) in a CTE, then WHERE dr = 2.' }
  ],
  mcq:[
    { q:'DENSE_RANK for 60000, 50000, 45000, 40000, 40000, 35000 gives the last row:', o:['5','6','4','3'], a:0, why:'No gap after the tie.' },
    { q:'Which suits "Nth highest salary"?', o:['DENSE_RANK','ROW_NUMBER','NTILE','LAG'], a:0, why:'Ties count once.' },
    { q:'DENSE_RANK skips numbers after ties?', o:['No','Yes','Sometimes','Only first'], a:0, why:'Consecutive ranks.' },
    { q:'Third highest distinct salary:', o:['45000','50000','40000','35000'], a:0, why:'60000, 50000, 45000.' },
    { q:'How do you filter on the rank?', o:['CTE or derived table','WHERE in same query','HAVING','ORDER BY'], a:0, why:'Window results are not available in WHERE.' }
  ],
  recap:['DENSE_RANK ties share a rank with no gaps.','Use it for the Nth highest distinct value.','Filter through a CTE or derived table.']
},

/* --- ntile --- */
'ntile': {
  title:'NTILE', tagline:'Split rows into n equal-sized groups.',
  prereq:['window-intro'],
  what:['NTILE(n) divides the ordered rows into n buckets.','Each row gets its bucket number, 1 to n.','Bucket sizes differ by at most one row.'],
  why:['Quartiles, deciles and top-half / bottom-half splits.'],
  syntax:{ code:'NTILE(n) OVER (ORDER BY column)', parts:[['n','The number of buckets.']] },
  points:['`NTILE(4)` gives quartiles.','If rows do not divide evenly, the first buckets get one extra row.','Ties may fall into different buckets.','Add PARTITION BY to bucket within groups.','Bucket 1 holds the first rows in the ORDER BY.'],
  mistakes:['Expecting ties to share a bucket.','Using too many buckets for few rows.','Forgetting the sort direction.'],
  example:{ title:'Top half and bottom half', scenario:'You want to split employees into two salary groups.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Use NTILE(2).', formula:'SELECT name, salary,\n       NTILE(2) OVER (ORDER BY salary DESC) AS half\nFROM employees;',
    steps:['Six rows, two buckets: three rows each.','The first three (highest) get 1 and the last three get 2.'],
    table2:{ rows:[['name','salary','half'],['Chitra',60000,1],['Asha',50000,1],['Deepak',45000,1],['Bilal',40000,2],['Esha',40000,2],['Farhan',35000,2]], caption:'Result' }, result:'Three employees in each half.' },
  practice:{ q:'Divide the 6 orders into 3 buckets by amount, highest first. How many orders are in each?', table:T(ORD,'Table: orders'), hint:'6 rows into 3 buckets.', solution:'NTILE(3) OVER (ORDER BY amount DESC): 2 orders in each bucket', explain:'6 divided by 3 is exactly 2 per bucket.' },
  interview:[
    { level:'Basic', q:'What does NTILE do?', a:'It splits the ordered rows into n roughly equal buckets and returns the bucket number.' },
    { level:'Intermediate', q:'What if 10 rows are split into 3 buckets?', a:'Bucket sizes are 4, 3 and 3. The first bucket gets the extra row.' },
    { level:'Intermediate', q:'How do you compute quartiles?', a:'NTILE(4) OVER (ORDER BY value). Bucket 1 is the lowest (or highest) quarter, depending on the sort.' },
    { level:'Scenario', q:'Label customers as top 25 percent by spend.', a:'NTILE(4) OVER (ORDER BY total_spend DESC) and keep bucket 1.' }
  ],
  mcq:[
    { q:'NTILE(4) creates:', o:['Four buckets','Four rows','A rank of 4','Four tables'], a:0, why:'Quartiles.' },
    { q:'6 rows into 2 buckets gives:', o:['3 and 3','4 and 2','5 and 1','2 and 4'], a:0, why:'Equal sizes.' },
    { q:'Who is in bucket 1 with ORDER BY salary DESC?', o:['The highest salaries','The lowest','Random','Ties only'], a:0, why:'The first rows in the order.' },
    { q:'10 rows into 3 buckets, first bucket size:', o:['4','3','2','5'], a:0, why:'The remainder goes to the first buckets.' },
    { q:'Do ties share a bucket?', o:['Not necessarily','Always','Never in MySQL','Only top'], a:0, why:'NTILE splits by position.' }
  ],
  recap:['NTILE(n) splits ordered rows into n buckets.','Uneven splits give the first buckets extra rows.','Use NTILE(4) for quartiles.']
},

/* --- lag --- */
'lag': {
  title:'LAG', tagline:'Read a value from the previous row.',
  prereq:['window-intro'],
  what:['LAG returns the value from an earlier row.','By default it is the row just before the current one.','If there is no earlier row, it returns NULL.'],
  why:['Change from the previous day, month or order.','Growth rates and gaps.'],
  syntax:{ code:'LAG(column, offset, default) OVER (\n  [PARTITION BY column]\n  ORDER BY column\n)', parts:[['offset','How many rows back. Default is 1.'],['default','Value to use when there is no earlier row. Default is NULL.']] },
  points:['The first row has no previous row, so the result is NULL unless you give a default.','`LAG(col, 2)` looks two rows back.','Needs ORDER BY inside OVER.','Add PARTITION BY to compare within groups.','The change from the previous value is `col - LAG(col)`.'],
  mistakes:['Forgetting the NULL on the first row.','No ORDER BY.','Dividing by a NULL or zero previous value.'],
  example:{ title:'Change from the previous order', scenario:'You want each order\'s amount, the previous amount and the difference.',
    table:withHl(ORD,{'D2:D7':'range'},'Table: orders'), task:'Use LAG over the order date.', formula:'SELECT order_id, amount,\n       LAG(amount) OVER (ORDER BY order_date) AS prev_amount,\n       amount - LAG(amount) OVER (ORDER BY order_date) AS change_amt\nFROM orders;',
    steps:['Orders are sorted by date.','Each row reads the amount of the row before it.','The first order has no earlier row, so it is NULL.'],
    table2:{ rows:[['order_id','amount','prev_amount','change_amt'],[1,1200,'NULL','NULL'],[2,800,1200,-400],[3,1500,800,700],[4,700,1500,-800],[5,900,700,200],[6,600,900,-300]], caption:'Result' }, result:'Order 3 rose by 700 compared with order 2.' },
  practice:{ q:'Write a query that shows each order\'s amount and the previous amount of the same customer.', table:T(ORD,'Table: orders'), hint:'PARTITION BY customer_id ORDER BY order_date.', solution:'SELECT order_id, customer_id, amount,\n       LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amount\nFROM orders;', explain:'For customer 101, order 3 shows 1200 and order 6 shows 1500. The first order of each customer shows NULL.' },
  interview:[
    { level:'Basic', q:'What does LAG do?', a:'It returns a value from a previous row in the window, such as yesterday\'s sales for today\'s row.' },
    { level:'Intermediate', q:'What does LAG return for the first row?', a:'NULL, unless a default is given as the third argument.' },
    { level:'Intermediate', q:'How do you calculate the percentage change from the previous row?', a:'(amount - LAG(amount) OVER (ORDER BY d)) * 100.0 / LAG(amount) OVER (ORDER BY d), guarding against zero with NULLIF.' },
    { level:'Scenario', q:'Find the days between consecutive orders of a customer.', a:'DATEDIFF(order_date, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)).' }
  ],
  mcq:[
    { q:'LAG returns a value from:', o:['The previous row','The next row','The first row','The last row'], a:0, why:'LAG looks back.' },
    { q:'LAG on the first row returns:', o:['NULL','0','The same row','Error'], a:0, why:'There is no earlier row.' },
    { q:'LAG(amount, 2) looks:', o:['Two rows back','Two rows ahead','At two rows','At the second row'], a:0, why:'Offset 2.' },
    { q:'Order 3 change in the example is:', o:['700','-800','800','1500'], a:0, why:'1500 - 800.' },
    { q:'Which clause is needed inside OVER?', o:['ORDER BY','GROUP BY','HAVING','LIMIT'], a:0, why:'Previous depends on the order.' }
  ],
  recap:['LAG reads from an earlier row.','The first row is NULL, or a default.','Subtract it to get changes.']
},

/* --- lead --- */
'lead': {
  title:'LEAD', tagline:'Read a value from the next row.',
  prereq:['lag'],
  what:['LEAD returns the value from a later row.','By default it is the next row.','If there is no later row, it returns NULL.'],
  why:['Time until the next order, next date or next status.'],
  syntax:{ code:'LEAD(column, offset, default) OVER (\n  [PARTITION BY column]\n  ORDER BY column\n)', parts:[['offset','How many rows ahead. Default is 1.'],['default','Value when there is no later row.']] },
  points:['The last row returns NULL unless a default is given.','Mirror image of LAG.','Needs ORDER BY inside OVER.','Great for gaps between events.','`LEAD(date) - date` gives the time to the next event.'],
  mistakes:['Expecting a value on the last row.','No ORDER BY.','Mixing up LEAD and LAG.'],
  example:{ title:'The next order amount', scenario:'You want each order\'s amount and the amount of the following order.',
    table:withHl(ORD,{'D2:D7':'range'},'Table: orders'), task:'Use LEAD.', formula:'SELECT order_id, amount,\n       LEAD(amount) OVER (ORDER BY order_date) AS next_amount\nFROM orders;',
    steps:['Each row reads the amount of the row after it.','The last order has no later row, so NULL.'],
    table2:{ rows:[['order_id','amount','next_amount'],[1,1200,800],[2,800,1500],[3,1500,700],[4,700,900],[5,900,600],[6,600,'NULL']], caption:'Result' }, result:'Order 1 shows 800, the amount of order 2.' },
  practice:{ q:'Write a query for the number of days until each customer\'s next order.', table:T(ORD,'Table: orders'), hint:'DATEDIFF(LEAD(date) ..., date).', solution:'SELECT order_id, customer_id, order_date,\n       DATEDIFF(\n         LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date),\n         order_date) AS days_to_next\nFROM orders;', explain:'For customer 101, order 1 (Jan 5) to order 3 (Feb 3) is 29 days, and order 3 to order 6 (Mar 15) is 40 days.' },
  interview:[
    { level:'Basic', q:'What does LEAD do?', a:'It returns a value from a following row in the window, such as the next order\'s date.' },
    { level:'Basic', q:'What is the difference between LAG and LEAD?', a:'LAG looks at earlier rows and LEAD looks at later rows.' },
    { level:'Intermediate', q:'What does LEAD return on the last row?', a:'NULL, unless you specify a default.' },
    { level:'Scenario', q:'Find customers whose next order came more than 30 days later.', a:'Compute days_to_next with LEAD in a CTE, then filter WHERE days_to_next > 30.' }
  ],
  mcq:[
    { q:'LEAD returns a value from:', o:['The next row','The previous row','The first row','All rows'], a:0, why:'LEAD looks ahead.' },
    { q:'LEAD on the last row returns:', o:['NULL','0','Itself','Error'], a:0, why:'No later row.' },
    { q:'Order 1 next_amount in the example:', o:['800','1200','1500','NULL'], a:0, why:'Order 2 amount.' },
    { q:'Opposite of LEAD:', o:['LAG','RANK','NTILE','FIRST_VALUE'], a:0, why:'LAG looks back.' },
    { q:'Customer 101 days from order 1 to 3:', o:['29','31','40','10'], a:0, why:'Jan 5 to Feb 3.' }
  ],
  recap:['LEAD reads from a later row.','The last row is NULL, or a default.','Use it for time-to-next-event.']
},

/* --- first-value --- */
'first-value': {
  title:'FIRST_VALUE and LAST_VALUE', tagline:'Read the first or last value in a window.',
  prereq:['window-intro'],
  what:['FIRST_VALUE returns the first value of the window in the given order.','LAST_VALUE returns the last.','Both can be used per group with PARTITION BY.'],
  why:['Compare each row with the group\'s best, earliest or latest value.'],
  syntax:{ code:'FIRST_VALUE(column) OVER (\n  PARTITION BY column ORDER BY column\n)\nLAST_VALUE(column) OVER (\n  PARTITION BY column ORDER BY column\n  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\n)', parts:[['PARTITION BY','The groups.'],['ORDER BY','Defines which row is first.'],['ROWS BETWEEN ...','The frame. Needed for LAST_VALUE.']] },
  points:['With ORDER BY, the default frame ends at the **current row**, so LAST_VALUE returns the current row\'s value unless you widen the frame.','Use `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` for LAST_VALUE.','FIRST_VALUE works with the default frame.','Ties need a tie-breaker column.','Alternative: ORDER BY the opposite direction and use FIRST_VALUE.'],
  mistakes:['LAST_VALUE returning the current row because of the default frame.','No tie-breaker.','Forgetting PARTITION BY.'],
  example:{ title:'Highest-paid person in each department', scenario:'You want every employee with the name of the top earner in their department.',
    table:withHl(EMP,{'B2:D7':'range'},'Table: employees'), task:'Use FIRST_VALUE.', formula:'SELECT name, dept_id, salary,\n       FIRST_VALUE(name) OVER (\n         PARTITION BY dept_id\n         ORDER BY salary DESC, name\n       ) AS top_earner\nFROM employees;',
    steps:['Rows are grouped by department and ordered by salary, highest first.','FIRST_VALUE returns the name in the first position of each group.','Bilal and Esha tie, so the name breaks the tie.'],
    table2:{ rows:[['name','dept_id','salary','top_earner'],['Asha',10,50000,'Chitra'],['Bilal',20,40000,'Bilal'],['Chitra',10,60000,'Chitra'],['Deepak',30,45000,'Deepak'],['Esha',20,40000,'Bilal'],['Farhan','NULL',35000,'Farhan']], caption:'Result' }, result:'Asha sees Chitra as the top earner of department 10.' },
  practice:{ q:'Why does LAST_VALUE(name) OVER (PARTITION BY dept_id ORDER BY salary DESC) often return the current row\'s name?', hint:'Think about the default frame.', solution:'The default frame runs from the first row to the current row, so the last row in the frame is the current row.', explain:'Add ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING to see the real last row of the group.' },
  interview:[
    { level:'Basic', q:'What does FIRST_VALUE do?', a:'It returns the first value in the window according to ORDER BY, for each row.' },
    { level:'Intermediate', q:'Why does LAST_VALUE give surprising results?', a:'The default frame ends at the current row, so the last row of the frame is the current row. I use ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.' },
    { level:'Intermediate', q:'A simpler way to get the last value?', a:'Reverse the ORDER BY and use FIRST_VALUE, which works with the default frame.' },
    { level:'Scenario', q:'Show each order beside the customer\'s first order amount.', a:'FIRST_VALUE(amount) OVER (PARTITION BY customer_id ORDER BY order_date).' }
  ],
  mcq:[
    { q:'FIRST_VALUE returns:', o:['The first value in the window','The last value','The average','The count'], a:0, why:'According to ORDER BY.' },
    { q:'Why does LAST_VALUE return the current row?', o:['The default frame ends at the current row','It is a bug','Wrong data type','Missing PARTITION BY'], a:0, why:'The frame is limited.' },
    { q:'Which frame fixes it?', o:['UNBOUNDED PRECEDING to UNBOUNDED FOLLOWING','CURRENT ROW only','1 PRECEDING','None'], a:0, why:'It covers the whole partition.' },
    { q:'Top earner in department 10 is:', o:['Chitra','Asha','Bilal','Deepak'], a:0, why:'60000.' },
    { q:'Ties are handled by:', o:['A tie-breaker in ORDER BY','HAVING','DISTINCT','LIMIT'], a:0, why:'Add another sort column.' }
  ],
  recap:['FIRST_VALUE gets the first row\'s value in each window.','LAST_VALUE needs a wider frame.','Add a tie-breaker to ORDER BY.']
},

/* --- running-total --- */
'running-total': {
  title:'Running total (SUM OVER)', tagline:'Add up values cumulatively, row by row.',
  prereq:['window-intro','sum-sql'],
  what:['A running total adds each row to everything before it.','It uses SUM with OVER and ORDER BY.','All rows are kept.'],
  why:['Cumulative sales, balance over time, year-to-date numbers.'],
  syntax:{ code:'SUM(column) OVER (\n  [PARTITION BY column]\n  ORDER BY column\n  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n)', parts:[['ORDER BY','Defines the order of accumulation.'],['PARTITION BY','Optional. Restarts the total for each group.']] },
  points:['With ORDER BY, SUM uses a running frame by default.','Writing the frame explicitly (`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`) is clearer.','`ROWS` treats each row separately; the default `RANGE` adds all tied rows together.','PARTITION BY restarts the total per group.','Use a unique ORDER BY column to avoid tie surprises.'],
  mistakes:['Ties in ORDER BY giving unexpected totals with RANGE.','Forgetting ORDER BY (then it is the group total).','Using GROUP BY instead.'],
  example:{ title:'Cumulative order value', scenario:'You want the running total of the order amounts by date.',
    table:withHl(ORD,{'D2:D7':'range'},'Table: orders'), task:'Add a running total.', formula:'SELECT order_id, order_date, amount,\n       SUM(amount) OVER (\n         ORDER BY order_date\n         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS running_total\nFROM orders;',
    steps:['Each row adds its amount to all earlier rows.','1200, then 1200 + 800, then plus 1500, and so on.'],
    table2:{ rows:[['order_id','order_date','amount','running_total'],[1,'2026-01-05',1200,1200],[2,'2026-01-18',800,2000],[3,'2026-02-03',1500,3500],[4,'2026-02-21',700,4200],[5,'2026-03-09',900,5100],[6,'2026-03-15',600,5700]], caption:'Result' }, result:'The final running total is 5700, equal to the grand total.' },
  practice:{ q:'Write a query for the running total of each customer\'s orders.', table:T(ORD,'Table: orders'), hint:'Add PARTITION BY customer_id.', solution:'SELECT order_id, customer_id, amount,\n       SUM(amount) OVER (\n         PARTITION BY customer_id\n         ORDER BY order_date\n       ) AS running_total\nFROM orders;', explain:'Customer 101\'s orders run 1200, 2700, then 3300. The total restarts for each customer.' },
  interview:[
    { level:'Basic', q:'How do you calculate a running total in SQL?', a:'SUM(amount) OVER (ORDER BY date). Each row shows the sum of all rows up to the current one.' },
    { level:'Intermediate', q:'What is the difference between ROWS and RANGE frames?', a:'ROWS counts physical rows. RANGE includes all rows with the same ORDER BY value, so ties are added together. I use ROWS for predictable running totals.' },
    { level:'Intermediate', q:'How do you restart a running total for each customer?', a:'Add PARTITION BY customer_id inside OVER.' },
    { level:'Scenario', q:'Show year-to-date sales by month.', a:'SUM(monthly_total) OVER (PARTITION BY year ORDER BY month) on a monthly summary, so the total restarts every year.' }
  ],
  mcq:[
    { q:'Which makes a running total?', o:['SUM(x) OVER (ORDER BY d)','SUM(x) GROUP BY d','COUNT(x)','MAX(x) OVER ()'], a:0, why:'ORDER BY builds the cumulative frame.' },
    { q:'Final running total of the example:', o:['5700','950','600','1200'], a:0, why:'The sum of all amounts.' },
    { q:'Which restarts the total per group?', o:['PARTITION BY','HAVING','LIMIT','DISTINCT'], a:0, why:'Each partition starts fresh.' },
    { q:'ROWS vs RANGE: which adds tied rows together?', o:['RANGE','ROWS','Both','Neither'], a:0, why:'RANGE treats ties as one group.' },
    { q:'Running total at order 3:', o:['3500','1500','2000','4200'], a:0, why:'1200 + 800 + 1500.' }
  ],
  recap:['Running total = SUM OVER with ORDER BY.','Use ROWS for predictable results.','PARTITION BY restarts the total.']
},

/* --- moving-average --- */
'moving-average': {
  title:'Moving average', tagline:'Average a sliding window of recent rows.',
  prereq:['running-total'],
  what:['A moving average averages the current row and a few rows before it.','The window slides as you move down the rows.','It smooths ups and downs.'],
  why:['Trends in sales or traffic without daily noise.'],
  syntax:{ code:'AVG(column) OVER (\n  ORDER BY column\n  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n)', parts:[['2 PRECEDING','The two rows before the current one.'],['CURRENT ROW','Includes the current row.']] },
  points:['`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` is a 3-row moving average.','The first rows use fewer rows, so they are partial averages.','Use `ROUND` to tidy decimals.','You can centre the window: `1 PRECEDING AND 1 FOLLOWING`.','Use PARTITION BY for a moving average per group.'],
  mistakes:['Forgetting the frame, which gives a running average.','Misreading the partial averages at the start.','Not ordering rows.'],
  example:{ title:'3-order moving average', scenario:'You want a smoothed view of the order amounts, using each order and the two before it.',
    table:withHl(ORD,{'D2:D7':'range'},'Table: orders'), task:'Calculate the moving average.', formula:'SELECT order_id, amount,\n       ROUND(AVG(amount) OVER (\n         ORDER BY order_date\n         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n       ), 2) AS moving_avg\nFROM orders;',
    steps:['Order 1 has no earlier rows, so the average is 1200.','Order 3 averages orders 1, 2 and 3: (1200 + 800 + 1500) / 3.','Order 6 averages orders 4, 5 and 6: (700 + 900 + 600) / 3.'],
    table2:{ rows:[['order_id','amount','moving_avg'],[1,1200,1200],[2,800,1000],[3,1500,1166.67],[4,700,1000],[5,900,1033.33],[6,600,733.33]], caption:'Result' }, result:'The averages smooth out the jumps between orders.' },
  practice:{ q:'Change the query to average the current order and the next one only.', hint:'Use CURRENT ROW and 1 FOLLOWING.', solution:'AVG(amount) OVER (\n  ORDER BY order_date\n  ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING\n)', explain:'Each row averages itself with the following row. The last row uses only itself.' },
  interview:[
    { level:'Basic', q:'What is a moving average?', a:'An average calculated over a sliding window of rows, such as the last 3 days, to smooth short-term changes.' },
    { level:'Intermediate', q:'How do you write a 7-day moving average?', a:'AVG(sales) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW). Six rows before plus the current one makes seven.' },
    { level:'Intermediate', q:'Why are the first rows different?', a:'There are not enough earlier rows, so the window is smaller. Some reports hide or flag those rows.' },
    { level:'Scenario', q:'Missing days break your 7-row window. What do you do?', a:'Generate a full calendar with a recursive CTE and LEFT JOIN the sales, filling zeros, so each row is one day.' }
  ],
  mcq:[
    { q:'`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` covers:', o:['Three rows','Two rows','Five rows','One row'], a:0, why:'Two before plus the current.' },
    { q:'Moving average at order 3:', o:['1166.67','1000','1500','1200'], a:0, why:'(1200 + 800 + 1500) / 3.' },
    { q:'The first row\'s average uses:', o:['Only itself','Three rows','Zero rows','All rows'], a:0, why:'No earlier rows exist.' },
    { q:'Which frame centres on the row?', o:['1 PRECEDING AND 1 FOLLOWING','UNBOUNDED PRECEDING','CURRENT ROW only','2 FOLLOWING'], a:0, why:'One row each side.' },
    { q:'What does it smooth?', o:['Short-term changes','Duplicates','NULLs','Dates'], a:0, why:'It reveals the trend.' }
  ],
  recap:['A moving average uses a ROWS frame such as 2 PRECEDING AND CURRENT ROW.','The first rows are partial.','Use a calendar table when days are missing.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- window-intro --- */
DEEP['window-intro'] = {
  level:'Advanced',
  tldr:'A window function calculates across related rows while **keeping every row**, unlike GROUP BY, which folds rows together.',
  intuition:{ text:[
    'GROUP BY works like folding a pile of papers into a single summary sheet per group: the individual papers are gone. A window function works like holding a transparent frame over the pile: you read a number through the frame, and write it next to each paper without removing any.',
    'The frame is defined by the OVER clause. PARTITION BY says which rows belong together, ORDER BY says in what order, and an optional frame says how far to look around the current row.'
  ], analogy:'A class ranking printed on every student\'s report card: each student keeps their own row, but the class average is shown next to it.' },
  how:[
    'The query runs FROM, WHERE, GROUP BY and HAVING first.',
    'For every remaining row, the database finds its **partition**: the rows that share the PARTITION BY values.',
    'Inside the partition, rows are ordered by the ORDER BY of OVER.',
    'The function looks at the **frame**: the part of the partition around the current row (default: the whole partition, or start-to-current row when ORDER BY is present).',
    'The result is added as a new column. No rows are removed.',
    'Because this happens in the SELECT step, you cannot filter on it in WHERE. Wrap it in a CTE or subquery.'
  ],
  diagrams:[
    { type:'flow', arrows:['collapses rows','keeps rows'], panels:[
      { title:'GROUP BY dept_id', rows:[['dept_id','avg_salary'],[10,55000],[20,40000],[30,45000],['NULL',35000]], note:'4 rows: detail is lost.' },
      { title:'AVG() OVER (PARTITION BY dept_id)', rows:[['name','dept','salary','dept_avg'],['Asha',10,50000,55000],['Chitra',10,60000,55000],['Bilal',20,40000,40000],['Esha',20,40000,40000],['Deepak',30,45000,45000],['Farhan','NULL',35000,35000]], hl:{1:'hit',2:'hit'}, note:'6 rows: every row keeps its detail.' }
    ] },
    { type:'flow', panels:[
      { title:'Frame: 2 PRECEDING AND CURRENT ROW (at order 4)', rows:[['order','amount'],[1,1200],[2,800],[3,1500],[4,700],[5,900],[6,600]], hl:{2:'range',3:'range',4:'find'}, note:'Orders 2, 3 and 4 are averaged: (800 + 1500 + 700) / 3 = 1000.' }
    ], caption:'The yellow row is the current row. The shaded rows are the frame the function can see.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Share of the department payroll', scenario:'Show each salary as a percentage of its department total.', table:T(EMP,'Table: employees'), task:'Divide each salary by the department sum.',
      formula:'SELECT name, dept_id, salary,\n       ROUND(salary * 100.0 /\n             SUM(salary) OVER (PARTITION BY dept_id), 2) AS pct_of_dept\nFROM employees;', steps:['SUM(salary) OVER (PARTITION BY dept_id) is 110000 for department 10.','Asha: 50000 / 110000 = 45.45%.'], table2:{ rows:[['name','dept_id','salary','pct_of_dept'],['Asha',10,50000,45.45],['Bilal',20,40000,50],['Chitra',10,60000,54.55],['Deepak',30,45000,100],['Esha',20,40000,50],['Farhan','NULL',35000,100]], caption:'Result' }, result:'Deepak and Farhan are alone in their groups, so each is 100%.' },
    { level:'Business case', title:'Orders compared with the customer\'s own average', scenario:'Flag each order as above or below that customer\'s usual order value.', table:T(ORD,'Table: orders'), task:'Add the customer average and a label.',
      formula:'SELECT order_id, customer_id, amount,\n       ROUND(AVG(amount) OVER (PARTITION BY customer_id), 0) AS cust_avg,\n       CASE\n         WHEN amount > AVG(amount) OVER (PARTITION BY customer_id) THEN \'Above\'\n         WHEN amount < AVG(amount) OVER (PARTITION BY customer_id) THEN \'Below\'\n         ELSE \'Equal\'\n       END AS vs_avg\nFROM orders;', steps:['Customer 101 averages 1100, 102 averages 850, 103 averages 700.','Each order is compared with its own customer\'s average, not the global one.'], table2:{ rows:[['order_id','customer_id','amount','cust_avg','vs_avg'],[1,101,1200,1100,'Above'],[2,102,800,850,'Below'],[3,101,1500,1100,'Above'],[4,103,700,700,'Equal'],[5,102,900,850,'Above'],[6,101,600,1100,'Below']], caption:'Result' }, result:'This is the kind of comparison that needs a window function: GROUP BY alone would lose the individual orders.' }
  ],
  edge:[
    { t:'You cannot filter on a window function in WHERE', d:'Window functions are computed at the SELECT step. Put the query in a CTE or derived table and filter in the outer query.' },
    { t:'ORDER BY inside OVER changes the meaning of aggregates', d:'`SUM(x) OVER ()` is the total on every row. `SUM(x) OVER (ORDER BY d)` is a **running** total, because the default frame becomes start-to-current-row.' },
    { t:'ROWS versus RANGE with ties', d:'The default frame with ORDER BY is RANGE, which includes all rows tied on the ORDER BY value. Write `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` for predictable running totals.' },
    { t:'NULL partitions', d:'Rows with a NULL partition value form their own partition, just like GROUP BY.' },
    { t:'MySQL version', d:'Window functions need MySQL 8.0 or later. They are standard in PostgreSQL, SQL Server and Oracle.' },
    { t:'No nesting', d:'You cannot put one window function inside another. Compute the inner one in a CTE first.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show each employee with the highest salary in their department next to their own salary.', table:T(EMP,'Table: employees'), hint:'MAX() OVER (PARTITION BY dept_id).', solution:'SELECT name, dept_id, salary,\n       MAX(salary) OVER (PARTITION BY dept_id) AS dept_max\nFROM employees;', explain:'Asha sees 60000 (Chitra\'s salary), and Bilal and Esha both see 40000.' },
    { level:'Interview', q:'Return only the employees who earn more than the average of their own department.', table:T(EMP,'Table: employees'), hint:'Compute the window average in a derived table, then filter outside.', solution:'SELECT name, salary, dept_avg\nFROM (\n  SELECT name, salary,\n         AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg\n  FROM employees\n) t\nWHERE salary > dept_avg;', explain:'Only Chitra (60000 against 55000) qualifies. The filter cannot be in the inner query\'s WHERE, because the window value does not exist yet.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between GROUP BY and a window function?', a:'GROUP BY collapses rows into one row per group. A window function calculates over a set of related rows but returns a value for every row, so the detail is kept. For example, AVG(salary) OVER (PARTITION BY dept_id) puts the department average next to every employee.',
      structure:'Say "collapse versus keep", define PARTITION BY, then give the department average example.',
      follow:[ { q:'Can you use GROUP BY and a window function together?', a:'Yes. The window function runs after grouping, so it can window over the grouped results, for example ranking departments by their total payroll.' } ] },
    { level:'Intermediate', q:'Why can you not use a window function in WHERE?', a:'The order of execution is FROM, WHERE, GROUP BY, HAVING, then SELECT, where window functions are computed. WHERE runs earlier, so the value does not exist yet. I wrap the query in a CTE or subquery and filter in the outer query.',
      follow:[ { q:'Is there an exception?', a:'Some databases offer QUALIFY (Snowflake, BigQuery) to filter on window results. MySQL does not, so the CTE pattern is needed.' } ] },
    { level:'Scenario', q:'Your running total is wrong when two orders fall on the same date. Why?', a:'The default frame with ORDER BY is RANGE, which treats rows with the same date as peers and adds them together at once. I order by a unique column as well, or explicitly write ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.',
      tradeoff:'ROWS is deterministic but depends on the tie order unless the ordering is unique.' }
  ],
  ref:{ headers:['Part','Role'], rows:[['`PARTITION BY`','Splits rows into independent groups (optional)'],['`ORDER BY`','Orders rows inside each partition'],['Frame (`ROWS BETWEEN`)','Which rows around the current one to use'],['No `ORDER BY`','Frame is the whole partition'],['`ORDER BY` present','Default frame runs from the start to the current row']] },
  related:['row-number','rank-sql','running-total','moving-average','lag']
};

/* --- row-number --- */
DEEP['row-number'] = {
  level:'Intermediate',
  tldr:'ROW_NUMBER numbers rows 1, 2, 3 in a chosen order, restarting for each partition. Filtering on it gives "exactly N rows per group".',
  intuition:{ text:[
    'Imagine every customer\'s orders laid out by date and numbered 1, 2, 3. "Number 1" is the first order, and the highest number is the latest. That numbering is useful for three jobs: pick the first or last row of each group, remove duplicates, and split results into pages.',
    'ROW_NUMBER never repeats a number, even for ties. That is its main difference from RANK, and it is why it is the standard tool for "one row per group".'
  ], analogy:'Taking a numbered ticket at a counter: everyone gets a different number, even if two people arrive together.' },
  how:[
    '`PARTITION BY` splits the rows into groups, such as one per customer.',
    '`ORDER BY` inside OVER decides the numbering order.',
    'Each row gets 1, 2, 3 ... inside its partition.',
    'Wrap the query in a CTE or derived table.',
    'Filter on the number, for example `rn = 1`, in the outer query.'
  ],
  diagrams:[
    { type:'flow', arrows:['PARTITION BY customer_id ORDER BY order_date DESC'], panels:[
      { title:'Orders', rows:[['order_id','customer_id','order_date'],[1,101,'2026-01-05'],[3,101,'2026-02-03'],[6,101,'2026-03-15'],[2,102,'2026-01-18'],[5,102,'2026-03-09']] },
      { title:'With row number', rows:[['order_id','customer_id','rn'],[6,101,1],[3,101,2],[1,101,3],[5,102,1],[2,102,2]], hl:{1:'hit',4:'hit'}, note:'rn = 1 is the latest order per customer.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Pagination', scenario:'A report shows 2 orders per page. Show page 2.', table:T(ORD,'Table: orders'), task:'Number the orders by date, then take rows 3 and 4.',
      formula:'WITH numbered AS (\n  SELECT order_id, order_date, amount,\n         ROW_NUMBER() OVER (ORDER BY order_date) AS rn\n  FROM orders\n)\nSELECT order_id, order_date, amount\nFROM numbered\nWHERE rn BETWEEN 3 AND 4;', steps:['The rows are numbered in date order.','Page 2 with 2 rows per page covers rows 3 and 4.'], table2:{ rows:[['order_id','order_date','amount'],[3,'2026-02-03',1500],[4,'2026-02-21',700]], caption:'Result' }, result:'Orders 3 and 4.' },
    { level:'Business case', title:'The latest order of every customer', scenario:'A CRM export needs one row per customer: their most recent order.', table:T(ORD,'Table: orders'), task:'Number each customer\'s orders from the newest.',
      formula:'WITH ranked AS (\n  SELECT order_id, customer_id, order_date, amount,\n         ROW_NUMBER() OVER (\n           PARTITION BY customer_id\n           ORDER BY order_date DESC, order_id DESC\n         ) AS rn\n  FROM orders\n)\nSELECT order_id, customer_id, order_date, amount\nFROM ranked\nWHERE rn = 1;', steps:['DESC order puts the newest order first, so it gets rn = 1.','order_id breaks ties when two orders share a date.'], table2:{ rows:[['order_id','customer_id','order_date','amount'],[6,101,'2026-03-15',600],[5,102,'2026-03-09',900],[4,103,'2026-02-21',700]], caption:'Result' }, result:'One row per customer, deterministic even with ties.' }
  ],
  edge:[
    { t:'Always add a tie-breaker', d:'If two rows tie on the ORDER BY, their numbers are arbitrary and may change between runs. Add a unique column last.' },
    { t:'You cannot filter in the same SELECT', d:'`WHERE rn = 1` fails in the query that creates rn. Use a CTE or derived table.' },
    { t:'ROW_NUMBER hides ties', d:'It gives different numbers to equal values. If ties should all be kept, use RANK instead.' },
    { t:'Deleting duplicates', d:'Number rows per duplicate group and delete rn > 1. MySQL does not allow deleting directly from a CTE, so join back on the primary key.' },
    { t:'Pagination on big tables', d:'Numbering the whole table to take a page is expensive. Keyset pagination (WHERE id > last_id LIMIT n) scales better.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return each customer\'s **first** order.', table:T(ORD,'Table: orders'), hint:'Order ascending and keep rn = 1.', solution:'WITH r AS (\n  SELECT order_id, customer_id, order_date,\n         ROW_NUMBER() OVER (\n           PARTITION BY customer_id ORDER BY order_date\n         ) AS rn\n  FROM orders\n)\nSELECT order_id, customer_id, order_date\nFROM r\nWHERE rn = 1;', explain:'Orders 1 (customer 101), 2 (customer 102) and 4 (customer 103).' },
    { level:'Interview', q:'A table has duplicate rows. Keep one row per (customer, city) and list the rows that would be deleted.', table:withHl({rows:[['id','customer','city'],[1,'Asha','Pune'],[2,'Bilal','Delhi'],[3,'Asha','Pune'],[4,'Chitra','Pune'],[5,'Bilal','Delhi']]},{},'Table: cust_dup'), hint:'Number rows within each duplicate group, then select rn > 1.',
      solution:'WITH n AS (\n  SELECT id, customer, city,\n         ROW_NUMBER() OVER (\n           PARTITION BY customer, city ORDER BY id\n         ) AS rn\n  FROM cust_dup\n)\nSELECT id, customer, city\nFROM n\nWHERE rn > 1;', explain:'Ids 3 (Asha, Pune) and 5 (Bilal, Delhi) are the extra copies. Deleting them leaves ids 1, 2 and 4.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does ROW_NUMBER do?', a:'It assigns a unique sequential number to each row within a partition, in the order given in OVER. Ties receive different numbers.',
      follow:[ { q:'How is it different from RANK?', a:'RANK gives ties the same number, and then skips. ROW_NUMBER always gives distinct numbers.' } ] },
    { level:'Intermediate', q:'How do you get the latest row per group?', a:'ROW_NUMBER() OVER (PARTITION BY group ORDER BY date DESC) in a CTE, then filter rn = 1. I add a unique tie-breaker such as the id so the result is repeatable.',
      tradeoff:'Alternatives are a correlated subquery with MAX, or a join to a MAX-per-group table. ROW_NUMBER is the most flexible.' },
    { level:'Scenario', q:'You must delete duplicate rows but keep the earliest. How?', a:'Number the rows in each duplicate group by id, then delete the rows with rn > 1. In MySQL, join the table to the numbered result by primary key and delete matching rows. I preview with a SELECT and run it inside a transaction.' }
  ],
  ref:{ headers:['Use','Pattern'], rows:[['Latest per group','`PARTITION BY g ORDER BY d DESC`, keep `rn = 1`'],['First per group','`ORDER BY d ASC`, keep `rn = 1`'],['Pagination','`rn BETWEEN start AND end`'],['Duplicates','`PARTITION BY dup columns`, keep `rn > 1` to remove']] },
  related:['rank-sql','top-n-per-group','delete-duplicate-rows','window-intro']
};

/* --- rank-sql --- */
DEEP['rank-sql'] = {
  level:'Advanced',
  tldr:'ROW_NUMBER, RANK and DENSE_RANK differ only in how they treat **ties**: unique numbers, gaps after ties, or no gaps.',
  intuition:{ text:[
    'Imagine a race where two runners finish at exactly the same time. RANK gives both second place and then skips third, so the next runner is fourth, as in a real competition. DENSE_RANK also gives both second place but the next runner is third, with no gap. ROW_NUMBER ignores the tie completely and numbers the runners 1, 2, 3, 4 anyway.',
    'The choice depends on the business question: do you want exactly N rows, everyone tied at the cut-off, or the Nth distinct value?'
  ], analogy:'Olympic medals: two silver medals mean there is no bronze (RANK). A "top three distinct scores" list has three values, however many people share them (DENSE_RANK).' },
  how:[
    'Choose the grouping with PARTITION BY (optional).',
    'Order the rows with ORDER BY inside OVER. This decides what "first" means.',
    'ROW_NUMBER numbers rows 1, 2, 3 ... with no repeats.',
    'RANK gives ties the same number, then skips ahead.',
    'DENSE_RANK gives ties the same number and continues with the next integer.',
    'To keep only the top ranks, wrap the query in a CTE and filter on the rank.'
  ],
  diagrams:[
    { type:'flow', panels:[
      { title:'Same salaries, three functions (ORDER BY salary DESC)', rows:[['name','salary','ROW_NUMBER','RANK','DENSE_RANK'],['Chitra',60000,1,1,1],['Asha',50000,2,2,2],['Deepak',45000,3,3,3],['Bilal',40000,4,4,4],['Esha',40000,5,4,4],['Farhan',35000,6,6,5]], hl:{4:'find',5:'find',6:'range'}, note:'Bilal and Esha tie. Watch the last row: 6, 6 and 5.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Ranking within each department', scenario:'Restart the ranking for every department.', table:T(EMP,'Table: employees'), task:'Rank salaries inside each department, highest first.',
      formula:'SELECT name, dept_id, salary,\n       DENSE_RANK() OVER (\n         PARTITION BY dept_id\n         ORDER BY salary DESC\n       ) AS dept_rank\nFROM employees;', steps:['PARTITION BY gives each department its own ranking.','Bilal and Esha tie, so both are rank 1 in department 20.'], table2:{ rows:[['name','dept_id','salary','dept_rank'],['Chitra',10,60000,1],['Asha',10,50000,2],['Bilal',20,40000,1],['Esha',20,40000,1],['Deepak',30,45000,1],['Farhan','NULL',35000,1]], caption:'Result' }, result:'Each department starts again at 1.' },
    { level:'Business case', title:'Each customer\'s largest order', scenario:'Customer success wants the biggest single order of every customer.', table:T(ORD,'Table: orders'), task:'Keep exactly one row per customer.',
      formula:'WITH ranked AS (\n  SELECT order_id, customer_id, amount,\n         ROW_NUMBER() OVER (\n           PARTITION BY customer_id\n           ORDER BY amount DESC, order_id\n         ) AS rn\n  FROM orders\n)\nSELECT order_id, customer_id, amount\nFROM ranked\nWHERE rn = 1;', steps:['ROW_NUMBER guarantees exactly one row numbered 1 per customer.','order_id is a tie-breaker, so the answer is repeatable.'], table2:{ rows:[['order_id','customer_id','amount'],[3,101,1500],[5,102,900],[4,103,700]], caption:'Result' }, result:'Use ROW_NUMBER when you need exactly one row per group, and RANK when ties should all be kept.' }
  ],
  edge:[
    { t:'No tie-breaker means unstable results', d:'With ROW_NUMBER and a tie, the database may number the tied rows differently on each run. Add a second ORDER BY column such as the primary key.' },
    { t:'Gaps in RANK', d:'After a tie, RANK skips numbers: 1, 2, 2, 4. If you filter `rank = 3`, you get nothing. Use DENSE_RANK for "the Nth distinct value".' },
    { t:'NULLs in ORDER BY', d:'NULLs sort first in ascending order in MySQL. Rank on a column with NULLs and the NULL rows may land at the top. Filter or COALESCE them.' },
    { t:'Ranking after aggregation', d:'To rank departments by payroll, group first, then rank over the grouped result: `RANK() OVER (ORDER BY SUM(salary) DESC)` works in the same query as GROUP BY.' },
    { t:'Filtering needs a CTE', d:'You cannot write `WHERE rn = 1` in the same SELECT. Use a CTE or derived table.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Number each customer\'s orders from the first to the latest.', table:T(ORD,'Table: orders'), hint:'ROW_NUMBER with PARTITION BY customer_id ORDER BY order_date.', solution:'SELECT order_id, customer_id, order_date,\n       ROW_NUMBER() OVER (\n         PARTITION BY customer_id\n         ORDER BY order_date\n       ) AS order_no\nFROM orders;', explain:'Customer 101\'s orders 1, 3 and 6 are numbered 1, 2 and 3.' },
    { level:'Interview', q:'Return the highest-paid employee of each department, **including ties**.', table:T(EMP,'Table: employees'), hint:'Use RANK (or DENSE_RANK) and keep rank 1.', solution:'WITH r AS (\n  SELECT name, dept_id, salary,\n         RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk\n  FROM employees\n)\nSELECT name, dept_id, salary\nFROM r\nWHERE rnk = 1;', explain:'Department 20 returns both Bilal and Esha, because they tie at 40000. ROW_NUMBER would have dropped one of them arbitrarily.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Explain ROW_NUMBER, RANK and DENSE_RANK.', a:'All three number rows in an order. ROW_NUMBER gives every row a unique number. RANK gives tied rows the same number and then skips numbers, such as 1, 2, 2, 4. DENSE_RANK gives tied rows the same number without skipping, such as 1, 2, 2, 3.',
      structure:'Name the three, show one ties example with the numbers, then say when you use each.',
      follow:[ { q:'Which would you use for the third highest salary?', a:'DENSE_RANK, because the third distinct salary is wanted, and ties should not push it down.' },
               { q:'Which for one row per group?', a:'ROW_NUMBER, because it never repeats a number.' } ] },
    { level:'Intermediate', q:'How do you get the top 2 products by sales in each category?', a:'Rank products inside each category with DENSE_RANK or ROW_NUMBER, using PARTITION BY category and ORDER BY sales DESC, in a CTE, then keep rank <= 2.',
      tradeoff:'ROW_NUMBER returns exactly two rows per category. RANK or DENSE_RANK can return more when there are ties. Decide with the business which behaviour is correct and say so.',
      follow:[ { q:'Why not use LIMIT 2?', a:'LIMIT cuts the whole result set, not each group.' } ] },
    { level:'Scenario', q:'A report shows rank 1 for two people, but a manager asks for "the runner-up". What do you do?', a:'I clarify the meaning. With RANK the runner-up may be rank 3, because 2 is skipped after the tie. If the manager means the next distinct score, I use DENSE_RANK = 2. I would also show the scores so the tie is visible.',
      structure:'Clarify the requirement first, then show how each function would answer it.' }
  ],
  ref:{ headers:['Function','Ties','Gaps','Best for'], rows:[['`ROW_NUMBER`','Different numbers','n/a','Exactly one row per group; deduplication; paging'],['`RANK`','Same number','Yes (1, 2, 2, 4)','Competition-style rankings'],['`DENSE_RANK`','Same number','No (1, 2, 2, 3)','Nth highest distinct value'],['`NTILE(n)`','Splits by position','n/a','Quartiles, deciles']] },
  related:['row-number','dense-rank','top-n-per-group','second-highest','window-intro']
};

/* --- dense-rank --- */
DEEP['dense-rank'] = {
  level:'Advanced',
  tldr:'DENSE_RANK gives tied rows the same rank, and the next rank follows **without gaps**. It is the right tool for the "Nth highest distinct value".',
  intuition:{ text:[
    'Imagine the distinct scores in a quiz: 95, 90, 90, 85. With DENSE_RANK the ranks are 1, 2, 2, 3. The question "who has the third highest score?" has a sensible answer: the person with 85, because 85 is the third distinct score. With RANK it would be 1, 2, 2, 4, and there would be no rank 3 at all.',
    'That is why DENSE_RANK is the standard tool for "Nth highest" questions.'
  ], analogy:'Podium positions counted by distinct results, not by number of athletes.' },
  how:[
    'Choose the grouping (optional `PARTITION BY`).',
    'Order the rows by the value that defines the ranking.',
    'DENSE_RANK assigns 1 to the top value, and the next distinct value always gets the next integer.',
    'Rows with equal values share a rank.',
    'Filter on the rank in an outer query.'
  ],
  diagrams:[
    { type:'flow', panels:[
      { title:'Salaries ranked', rows:[['salary','RANK','DENSE_RANK'],[60000,1,1],[50000,2,2],[45000,3,3],[40000,4,4],[40000,4,4],[35000,6,5]], hl:{4:'find',5:'find',6:'range'}, note:'After the tie at 40000, RANK jumps to 6, DENSE_RANK continues with 5.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'The top three distinct salaries', scenario:'List everyone earning one of the three highest distinct salaries.', table:T(EMP,'Table: employees'), task:'Rank, then keep ranks 1 to 3.',
      formula:'WITH r AS (\n  SELECT name, salary,\n         DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\n  FROM employees\n)\nSELECT name, salary, dr\nFROM r\nWHERE dr <= 3;', steps:['The distinct salaries rank as 60000 (1), 50000 (2), 45000 (3), 40000 (4), 35000 (5).','Ranks 1 to 3 are kept.'], table2:{ rows:[['name','salary','dr'],['Chitra',60000,1],['Asha',50000,2],['Deepak',45000,3]], caption:'Result' }, result:'Three people. If two people earned 50000, both would be rank 2 and both would appear.' },
    { level:'Business case', title:'The runner-up order value per customer', scenario:'For each customer, find the second largest distinct order amount, if it exists.', table:T(ORD,'Table: orders'), task:'Rank amounts inside each customer.',
      formula:'WITH r AS (\n  SELECT customer_id, amount,\n         DENSE_RANK() OVER (\n           PARTITION BY customer_id\n           ORDER BY amount DESC\n         ) AS dr\n  FROM orders\n)\nSELECT customer_id, amount\nFROM r\nWHERE dr = 2;', steps:['Customer 101 amounts: 1500 (1), 1200 (2), 600 (3).','Customer 102 amounts: 900 (1), 800 (2).','Customer 103 has one order, so no rank 2.'], table2:{ rows:[['customer_id','amount'],[101,1200],[102,800]], caption:'Result' }, result:'Customer 103 does not appear, because no second amount exists.' }
  ],
  edge:[
    { t:'Ties share a rank', d:'Many rows can have rank 1, so `dr = 1` can return several rows. If you need exactly one row, use ROW_NUMBER.' },
    { t:'Ordering direction', d:'`ORDER BY salary DESC` makes the highest value rank 1. Forgetting DESC gives the lowest.' },
    { t:'NULLs', d:'In MySQL, NULLs sort first in ascending order and last in descending order. Filter NULLs out if they should not be ranked.' },
    { t:'Missing ranks', d:'If a group has fewer than N distinct values, rank N does not exist, and no row is returned for that group.' },
    { t:'Filter outside', d:'You cannot write `WHERE dr = 2` in the same query. Use a CTE or derived table.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the 2nd highest distinct salary in each department.', table:T(EMP,'Table: employees'), hint:'PARTITION BY dept_id.', solution:'WITH r AS (\n  SELECT dept_id, salary,\n         DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dr\n  FROM employees\n)\nSELECT DISTINCT dept_id, salary\nFROM r\nWHERE dr = 2;', explain:'Only department 10 has two distinct salaries, so the result is (10, 50000). Department 20 has two people at 40000, which is a single distinct value.' },
    { level:'Interview', q:'Why would RANK give a wrong answer for "the 3rd highest salary" on our data, and DENSE_RANK the right one?', hint:'Use the tie at 40000.', solution:'RANK values for the descending distinct salaries are 1, 2, 3, 4, 4, 6. For "3rd highest" RANK = 3 gives 45000, which is correct here, but for "4th highest" it gives two people at 40000, and "5th highest" does not exist because 5 is skipped.\nDENSE_RANK gives 1, 2, 3, 4, 4, 5, so the Nth distinct salary always exists when N distinct values exist.', explain:'The example for the 5th highest (35000) makes the gap concrete.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between RANK and DENSE_RANK?', a:'Both give tied rows the same rank. RANK then skips the following ranks (1, 2, 2, 4), while DENSE_RANK continues with the next integer (1, 2, 2, 3).',
      follow:[ { q:'Which one for Nth highest?', a:'DENSE_RANK, because it counts distinct values.' } ] },
    { level:'Intermediate', q:'Find the third highest salary per department.', a:'DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) in a CTE, then filter dr = 3. Departments with fewer than three distinct salaries return no row.',
      tradeoff:'If every department must appear, LEFT JOIN the departments to the result and use COALESCE for missing values.' },
    { level:'Scenario', q:'Show the top 3 products by revenue, including ties at the cut-off.', a:'DENSE_RANK over revenue descending, then keep rank <= 3. All products tied at rank 3 appear, so more than three rows can be returned.' }
  ],
  ref:{ headers:['Function','Example for 90, 80, 80, 70'], rows:[['`ROW_NUMBER`','1, 2, 3, 4'],['`RANK`','1, 2, 2, 4'],['`DENSE_RANK`','1, 2, 2, 3']] },
  related:['rank-sql','row-number','second-highest','top-n-per-group']
};

/* --- ntile --- */
D('ntile',{ l:'Intermediate', t:'NTILE(n) splits ordered rows into n buckets, such as quartiles. Ties may fall into different buckets.',
  i:['"Top 25% of customers" needs a way to cut the ranked list into equal parts. NTILE does it: it numbers the rows 1 to n so each bucket holds about the same number of rows.','If the rows do not divide evenly, the first buckets get one extra row.'], a:'Dealing sorted cards into n equal piles.',
  h:['Order the rows in OVER.','`NTILE(4)` makes quartiles.','Bucket 1 holds the first rows in the order.','Add PARTITION BY for buckets within groups.'],
  d:[FL(['NTILE(2)'],[{ title:'Result', rows:[['name','salary','half'],['Chitra',60000,1],['Asha',50000,1],['Deepak',45000,1],['Bilal',40000,2],['Esha',40000,2],['Farhan',35000,2]] }])],
  x:[X('Variation','Quartiles','Split into four groups.','NTILE(4).','SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) AS quartile FROM employees;',['6 rows into 4 buckets: sizes 2, 2, 1, 1.'],'Chitra and Asha are in quartile 1.',T(EMP,'Table: employees')),
     X('Business case','Top 25 percent of customers','Target the best customers.','NTILE then filter.','WITH t AS (\n  SELECT customer_id, SUM(amount) AS total,\n         NTILE(4) OVER (ORDER BY SUM(amount) DESC) AS q\n  FROM orders GROUP BY customer_id)\nSELECT * FROM t WHERE q = 1;',['Customers are ranked by total spend.'],'Customer 101 (and possibly 102 depending on 3 customers across 4 buckets).',T(ORD,'Table: orders'))],
  e:[['Uneven splits','The first buckets get the extra rows.'],['Ties','Equal values can land in different buckets.'],['Few rows','More buckets than rows leaves empty buckets.'],['Filter in a CTE','Window results cannot be used in WHERE directly.']],
  p:[P('Medium','Two groups: higher and lower earners.','NTILE(2).','NTILE(2) OVER (ORDER BY salary DESC)','Three rows each.',T(EMP,'Table: employees')),
     P('Interview','10 rows into 3 buckets: sizes?','Remainder.','4, 3, 3.','The first bucket gets the extra row.')],
  q:[Q('Basic','What does NTILE do?','It splits ordered rows into n roughly equal buckets.',{ f:[['Quartiles?','NTILE(4).']] }),
     Q('Scenario','Label customers as top 10 percent.','NTILE(10) by spend and keep bucket 1.',{ t:'Ties may split across buckets.' })],
  r:RT(['Use','Write'],[['Quartiles','`NTILE(4)`'],['Halves','`NTILE(2)`'],['Per group','`PARTITION BY`'],['Order','`ORDER BY` required']]), rel:['row-number','rank-sql','dense-rank','window-intro'] });

/* --- lag --- */
DEEP['lag'] = {
  level:'Intermediate',
  tldr:'LAG reads a value from an **earlier row**, so each row can be compared with the one before it.',
  intuition:{ text:[
    'To know whether sales went up, you need today\'s number next to yesterday\'s. In a spreadsheet you point at the cell above. In SQL, rows have no "above", so LAG provides it: for each row, the value from the previous row in the order you choose.',
    'Subtract it from the current value and you get the change. Divide by it and you get growth. LEAD does the same with the next row.'
  ], analogy:'Looking over your shoulder at the previous page of a ledger.' },
  how:[
    'Define the order with `ORDER BY` inside OVER (required).',
    'Optionally add `PARTITION BY` so each group has its own sequence.',
    '`LAG(col)` returns the value one row back; `LAG(col, 2)` two rows back.',
    'The first row of each partition has no previous row, so it returns NULL, or the default you provide.',
    'Combine with arithmetic to get differences and percentages.'
  ],
  diagrams:[
    { type:'flow', arrows:['LAG(amount) OVER (ORDER BY order_date)'], panels:[
      { title:'Orders by date', rows:[['order_id','amount'],[1,1200],[2,800],[3,1500],[4,700]] },
      { title:'With previous amount', rows:[['order_id','amount','prev','change'],[1,1200,'NULL','NULL'],[2,800,1200,-400],[3,1500,800,700],[4,700,1500,-800]], hl:{3:'hit'} }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Days between a customer\'s orders', scenario:'How long does each customer wait between purchases?', table:T(ORD,'Table: orders'), task:'Compare each order date with the customer\'s previous one.',
      formula:'SELECT order_id, customer_id, order_date,\n       DATEDIFF(order_date,\n         LAG(order_date) OVER (\n           PARTITION BY customer_id ORDER BY order_date)\n       ) AS days_since_last\nFROM orders;', steps:['PARTITION BY gives each customer a separate sequence.','The first order of each customer has no previous date, so the result is NULL.'], table2:{ rows:[['order_id','customer_id','order_date','days_since_last'],[1,101,'2026-01-05','NULL'],[2,102,'2026-01-18','NULL'],[3,101,'2026-02-03',29],[4,103,'2026-02-21','NULL'],[5,102,'2026-03-09',50],[6,101,'2026-03-15',40]], caption:'Result' }, result:'Customer 101 reorders every 29 to 40 days.' },
    { level:'Business case', title:'Orders larger than the previous order', scenario:'Find orders where the amount rose compared with the previous order overall.', table:T(ORD,'Table: orders'), task:'Filter on the comparison in an outer query.',
      formula:'WITH x AS (\n  SELECT order_id, order_date, amount,\n         LAG(amount) OVER (ORDER BY order_date) AS prev_amount\n  FROM orders\n)\nSELECT order_id, amount, prev_amount\nFROM x\nWHERE amount > prev_amount;', steps:['LAG supplies the previous amount.','The filter is applied outside, because window values cannot be used in WHERE.'], table2:{ rows:[['order_id','amount','prev_amount'],[3,1500,800],[5,900,700]], caption:'Result' }, result:'Orders 3 and 5 grew compared with the order before them.' }
  ],
  edge:[
    { t:'The first row is NULL', d:'There is no previous row, so LAG returns NULL. Provide a default: `LAG(amount, 1, 0)`.' },
    { t:'Order matters', d:'Without a clear, unique ORDER BY, "previous" is undefined. Add a tie-breaker.' },
    { t:'Partitions', d:'Without PARTITION BY the sequence runs across all rows. Add it to compare within customers, products or regions.' },
    { t:'Missing periods', d:'LAG looks at the previous **row**, not the previous month. If a month has no row, it will compare with two months ago. Use a calendar table.' },
    { t:'Filter in an outer query', d:'You cannot use the LAG result in WHERE of the same query.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show each month\'s total and the previous month\'s total (monthly totals are 2000, 2200 and 1500).', table:T(ORD,'Table: orders'), hint:'Aggregate in a CTE first, then use LAG.', solution:'WITH m AS (\n  SELECT MONTH(order_date) AS month, SUM(amount) AS total\n  FROM orders\n  GROUP BY MONTH(order_date)\n)\nSELECT month, total,\n       LAG(total) OVER (ORDER BY month) AS prev_total\nFROM m;', explain:'January has NULL as previous, February shows 2000 and March shows 2200.' },
    { level:'Interview', q:'Find customers whose most recent order is smaller than their previous order.', table:T(ORD,'Table: orders'), hint:'LAG per customer, then keep the latest row per customer.', solution:'WITH x AS (\n  SELECT customer_id, order_date, amount,\n         LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amount,\n         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, amount, prev_amount\nFROM x\nWHERE rn = 1 AND amount < prev_amount;', explain:'Customer 101: latest 600 against previous 1500, so it qualifies. Customer 102: 900 against 800, which is higher. Customer 103 has one order.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does LAG do and what is it used for?', a:'LAG returns a value from a previous row in the window. I use it to compare a row with the one before it: change since the last period, days between orders, or growth.',
      follow:[ { q:'What does it return for the first row?', a:'NULL, unless a default is given as the third argument.' } ] },
    { level:'Intermediate', q:'How do you calculate month-over-month growth?', a:'Aggregate sales by month in a CTE, then (total - LAG(total) OVER (ORDER BY month)) * 100.0 / LAG(total) OVER (ORDER BY month), guarding with NULLIF against a zero previous value.',
      tradeoff:'If a month is missing, LAG compares with the earlier month. A calendar table with zero-filled months avoids misleading growth.' },
    { level:'Scenario', q:'How do you find gaps longer than 30 days between a customer\'s orders?', a:'Compute days since the previous order with DATEDIFF and LAG partitioned by customer, then filter the result in an outer query for values above 30.' }
  ],
  ref:{ headers:['Function','Looks at'], rows:[['`LAG(x)`','Previous row'],['`LAG(x, n)`','n rows back'],['`LAG(x, 1, 0)`','Previous row, default 0'],['`LEAD(x)`','Next row']] },
  related:['lead','month-over-month','running-total','window-intro']
};

/* --- lead --- */
D('lead',{ l:'Intermediate', t:'LEAD reads a value from the next row in the window. It is LAG looking forward.',
  i:['To know what happens after each event, such as the date of the next order, each row needs a peek at the row that follows.','LEAD provides it. The last row has no next row, so it returns NULL.'], a:'Looking over the page to see what comes next.',
  h:['Order the rows in OVER (required).','`LEAD(col)` returns the next row\'s value.','Offset and default are optional.','Partition to compare within groups.'],
  d:[FL(['LEAD(amount)'],[{ title:'Result', rows:[['order_id','amount','next_amount'],[1,1200,800],[2,800,1500],[3,1500,700],[6,600,'NULL']], hl:{4:'miss'} }])],
  x:[X('Variation','Days until the next order','Per customer.','LEAD on dates.','SELECT order_id, customer_id,\n  DATEDIFF(LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date), order_date) AS days_to_next\nFROM orders;',['Customer 101: 29 days then 40.'],'The last order of each customer is NULL.',T(ORD,'Table: orders')),
     X('Business case','A subscription gap','Find gaps longer than 30 days between orders.','Filter in an outer query.','WITH x AS (SELECT customer_id, order_date,\n  DATEDIFF(LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date), order_date) AS gap FROM orders)\nSELECT * FROM x WHERE gap > 30;',['Customer 101: Feb 3 to Mar 15 is 40 days.','Customer 102: Jan 18 to Mar 9 is 50 days.'],'Two gaps exceed 30 days.',T(ORD,'Table: orders'))],
  e:[['Last row is NULL','Provide a default as the third argument.'],['Order matters','Needs ORDER BY and ideally a tie-breaker.'],['Partition','Without it, rows of different groups mix.'],['Filter outside','You cannot use LEAD in WHERE.']],
  p:[P('Medium','Next order amount for each order.','LEAD(amount).','LEAD(amount) OVER (ORDER BY order_date)','Order 1 shows 800.',T(ORD,'Table: orders')),
     P('Interview','LAG versus LEAD?','Direction.','LAG reads the previous row, LEAD the next row.','Mention the NULL at the edges.')],
  q:[Q('Basic','What does LEAD do?','It returns a value from a following row in the window.',{ f:[['Last row?','NULL or a default.']] }),
     Q('Scenario','Find customers who waited more than 30 days between orders.','LEAD dates per customer, DATEDIFF, filter in an outer query.',{ t:'LAG gives the same result looking backward.' })],
  r:RT(['Function','Looks at'],[['`LEAD(x)`','Next row'],['`LEAD(x, 2)`','Two ahead'],['`LAG(x)`','Previous row'],['Default','`LEAD(x, 1, 0)`']]), rel:['lag','window-intro','month-over-month','datediff'] });

/* --- first-value --- */
D('first-value',{ l:'Intermediate to Advanced', t:'FIRST_VALUE returns the first value in the window. LAST_VALUE needs a wider frame, because the default frame ends at the current row.',
  i:['Comparing each row with the best, earliest or latest in its group is a common need: each order against the customer\'s first order, each employee against the top earner.','FIRST_VALUE does this directly. LAST_VALUE is a trap because of the default frame.'], a:'Looking at the first name on a sorted list from any row.',
  h:['`FIRST_VALUE(col) OVER (PARTITION BY g ORDER BY o)`.','The first row in that order supplies the value.','For LAST_VALUE add `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.','Alternatively, reverse the order and use FIRST_VALUE.'],
  d:[FL(['FIRST_VALUE(name)'],[{ title:'Top earner of each department', rows:[['name','dept','top_earner'],['Asha',10,'Chitra'],['Chitra',10,'Chitra'],['Bilal',20,'Bilal'],['Esha',20,'Bilal']] }])],
  x:[X('Variation','The LAST_VALUE trap','LAST_VALUE returns the current row.','Widen the frame.','LAST_VALUE(name) OVER (PARTITION BY dept_id ORDER BY salary DESC\n  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)',['Without the frame, the last row of the frame is the current row.'],'Now it returns the lowest earner of the department.'),
     X('Business case','Each order versus the first order','Compare each order amount with the customer\'s first.','FIRST_VALUE per customer.','SELECT order_id, customer_id, amount,\n  amount - FIRST_VALUE(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS vs_first\nFROM orders;',['Customer 101\'s first order is 1200.'],'Order 3: +300, order 6: -600.',T(ORD,'Table: orders'))],
  e:[['LAST_VALUE default frame','The frame ends at the current row. Widen it.'],['Ties','Add a tie-breaker to ORDER BY.'],['NULLs','FIRST_VALUE can return NULL; some databases support IGNORE NULLS.'],['Version','MySQL 8.0+.']],
  p:[P('Medium','Top earner name next to each employee in the department.','FIRST_VALUE.','FIRST_VALUE(name) OVER (PARTITION BY dept_id ORDER BY salary DESC, name)','Asha sees Chitra.',T(EMP,'Table: employees')),
     P('Interview','Why does LAST_VALUE return the current row?','Frame.','The default frame is from the start to the current row, so the last row in the frame is the current one.','Fix with the unbounded frame.')],
  q:[Q('Basic','What does FIRST_VALUE do?','It returns the first value in the window per ORDER BY.',{ f:[['Simpler way to get the last?','Reverse the order and use FIRST_VALUE.']] }),
     Q('Scenario','Show each employee beside the department maximum.','MAX(salary) OVER (PARTITION BY dept_id), or FIRST_VALUE with ORDER BY salary DESC.',{ t:'MAX is simpler for values only.' })],
  r:RT(['Need','Write'],[['First','`FIRST_VALUE(x) OVER (...)`'],['Last','add the full frame'],['Simpler','`MAX(x) OVER (...)`'],['Ties','Add a tie-breaker']]), rel:['window-intro','lag','running-total','row-number'] });

/* --- running-total --- */
DEEP['running-total'] = {
  level:'Intermediate',
  tldr:'A running total is `SUM(x) OVER (ORDER BY ...)`: each row shows the sum of everything up to and including itself.',
  intuition:{ text:[
    'A bank statement shows the balance after every transaction, not just the final balance. That is a running total: row by row, the amounts accumulate.',
    'In SQL you get it by adding ORDER BY to a window SUM. The order decides the direction of accumulation, and PARTITION BY restarts it for each group.'
  ], analogy:'A bank statement balance column.' },
  how:[
    'Choose the order of accumulation, such as the order date.',
    'Write `SUM(amount) OVER (ORDER BY order_date)`.',
    'For predictable results write the frame: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.',
    'Add `PARTITION BY customer_id` to restart the total for each customer.',
    'Divide by the grand total to get a cumulative percentage.'
  ],
  diagrams:[
    { type:'flow', arrows:['accumulate'], panels:[
      { title:'Orders by date', rows:[['order_id','amount','running_total'],[1,1200,1200],[2,800,2000],[3,1500,3500],[4,700,4200],[5,900,5100],[6,600,5700]], hl:{6:'hit'}, note:'The last running total equals the grand total: 5700.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Running total per customer', scenario:'Each customer has their own cumulative spend.', table:T(ORD,'Table: orders'), task:'Restart the total for each customer.',
      formula:'SELECT order_id, customer_id, amount,\n       SUM(amount) OVER (\n         PARTITION BY customer_id\n         ORDER BY order_date\n         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS customer_running\nFROM orders;', steps:['PARTITION BY gives each customer a separate accumulation.','Customer 101 runs 1200, 2700, 3300.'], table2:{ rows:[['order_id','customer_id','amount','customer_running'],[1,101,1200,1200],[3,101,1500,2700],[6,101,600,3300],[2,102,800,800],[5,102,900,1700],[4,103,700,700]], caption:'Result (grouped by customer for readability)' }, result:'Each customer\'s last row equals their total spend.' },
    { level:'Business case', title:'Cumulative share of revenue', scenario:'Management wants to see how quickly sales build up through the period.', table:T(ORD,'Table: orders'), task:'Show the cumulative percentage of total sales.',
      formula:'SELECT order_id, order_date, amount,\n       SUM(amount) OVER (ORDER BY order_date, order_id) AS running,\n       ROUND(100.0 * SUM(amount) OVER (ORDER BY order_date, order_id)\n             / SUM(amount) OVER (), 2) AS cum_pct\nFROM orders;', steps:['The first window is a running total.','`SUM(amount) OVER ()` is the grand total, 5700, on every row.','Dividing gives the cumulative percentage.'], table2:{ rows:[['order_id','running','cum_pct'],[1,1200,21.05],[2,2000,35.09],[3,3500,61.4],[4,4200,73.68],[5,5100,89.47],[6,5700,100]], caption:'Result' }, result:'Over 60% of revenue arrives by the third order.' }
  ],
  edge:[
    { t:'ROWS versus RANGE', d:'The default frame with ORDER BY is RANGE, which adds all rows tied on the order value at once. Two orders on the same date then show the same running total. Use ROWS for row-by-row accumulation.' },
    { t:'Add a unique tie-breaker', d:'Order by date and id so the accumulation order is repeatable.' },
    { t:'Without ORDER BY it is not running', d:'`SUM(x) OVER ()` is the grand total on every row. `SUM(x) OVER (ORDER BY d)` is the running total.' },
    { t:'Restarting', d:'Use PARTITION BY for per-customer, or per-year totals such as year-to-date.' },
    { t:'Performance', d:'Large partitions require sorting. An index on the partition and order columns helps.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show a year-to-date total by month, restarting every year (monthly totals: Jan 2000, Feb 2200, Mar 1500).', table:T(ORD,'Table: orders'), hint:'Aggregate by year and month, then SUM OVER partitioned by year.', solution:'WITH m AS (\n  SELECT YEAR(order_date) AS yr, MONTH(order_date) AS mo, SUM(amount) AS total\n  FROM orders\n  GROUP BY YEAR(order_date), MONTH(order_date)\n)\nSELECT yr, mo, total,\n       SUM(total) OVER (PARTITION BY yr ORDER BY mo) AS ytd\nFROM m;', explain:'2026: January 2000, February 4200 and March 5700. A new year would restart at its first month.' },
    { level:'Interview', q:'Two orders have the same date and your running total shows the same value for both. Why, and how do you fix it?', hint:'Think about the default frame.', solution:'The default frame is RANGE, which includes all peer rows with the same ORDER BY value, so tied rows share one total.\nFix: add a unique column to ORDER BY (such as order_id) and/or write ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.', explain:'This shows you understand the difference between logical (RANGE) and physical (ROWS) frames.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you calculate a running total in SQL?', a:'With a window function: SUM(amount) OVER (ORDER BY order_date). Each row shows the sum of all rows up to and including itself.',
      follow:[ { q:'How do you restart it for each customer?', a:'Add PARTITION BY customer_id inside OVER.' } ] },
    { level:'Intermediate', q:'What is the difference between ROWS and RANGE frames?', a:'ROWS counts physical rows. RANGE includes all rows with the same ORDER BY value as the current row, so ties are added together. I use ROWS for a clean row-by-row running total.',
      tradeoff:'RANGE is the default, which can surprise you when dates repeat.' },
    { level:'Scenario', q:'Produce a year-to-date report by month. What do you do?', a:'Aggregate to one row per month, then SUM(total) OVER (PARTITION BY year ORDER BY month). The partition restarts the total every year.' }
  ],
  ref:{ headers:['Goal','Window'], rows:[['Running total','`SUM(x) OVER (ORDER BY d)`'],['Per group','add `PARTITION BY g`'],['Grand total on each row','`SUM(x) OVER ()`'],['Cumulative %','running / `SUM(x) OVER ()`'],['Safe frame','`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`']] },
  related:['window-intro','moving-average','month-over-month','lag']
};

/* --- moving-average --- */
DEEP['moving-average'] = {
  level:'Advanced',
  tldr:'A moving average uses a **frame** such as `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` to average a sliding window of rows.',
  intuition:{ text:[
    'Daily numbers jump around: a quiet Tuesday, a busy Friday. A moving average smooths them by averaging each day with the days just before it, so the trend becomes visible.',
    'In SQL, the window moves with the current row. The frame clause says how many rows before and after it to include. The first rows have fewer rows available, so their averages cover a shorter window, a detail that is easy to forget.'
  ], analogy:'Looking at the road through a small sliding window instead of a single point.' },
  how:[
    'Order the rows (`ORDER BY` inside OVER). The order decides what "before" means.',
    'Choose the frame, such as `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` (3 rows).',
    'Apply AVG over that frame.',
    'The first rows use a smaller window until enough previous rows exist.',
    'Add `PARTITION BY` to restart the average for each group.'
  ],
  diagrams:[
    { type:'flow', panels:[
      { title:'Frame at order 4 (2 PRECEDING AND CURRENT ROW)', rows:[['order','amount'],[1,1200],[2,800],[3,1500],[4,700],[5,900],[6,600]], hl:{2:'range',3:'range',4:'find'}, note:'(800 + 1500 + 700) / 3 = 1000' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A centred window', scenario:'Average each order with the one before and the one after.', table:T(ORD,'Table: orders'), task:'Use 1 PRECEDING and 1 FOLLOWING.',
      formula:'SELECT order_id, amount,\n       ROUND(AVG(amount) OVER (\n         ORDER BY order_date\n         ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING\n       ), 0) AS centred_avg\nFROM orders;', steps:['Each row averages itself with its neighbours.','The first and last rows have only one neighbour.'], table2:{ rows:[['order_id','amount','centred_avg'],[1,1200,1000],[2,800,1167],[3,1500,1000],[4,700,1033],[5,900,733],[6,600,750]], caption:'Result' }, result:'Order 3 averages 800, 1500 and 700.' },
    { level:'Business case', title:'Flagging incomplete windows', scenario:'A report should show the 3-order moving average only when three orders are available, otherwise leave it blank.', table:T(ORD,'Table: orders'), task:'Count the rows in the frame.',
      formula:'SELECT order_id, amount,\n       CASE WHEN COUNT(*) OVER w = 3\n            THEN ROUND(AVG(amount) OVER w, 0) END AS ma3\nFROM orders\nWINDOW w AS (\n  ORDER BY order_date\n  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n);', steps:['The named window `w` is defined once and reused.','COUNT(*) OVER w tells how many rows are in the frame.','Only full windows of 3 rows show an average.'], table2:{ rows:[['order_id','amount','ma3'],[1,1200,'NULL'],[2,800,'NULL'],[3,1500,1167],[4,700,1000],[5,900,1033],[6,600,733]], caption:'Result' }, result:'The first two rows are blank, so nobody mistakes a partial average for a real trend.' }
  ],
  edge:[
    { t:'ROWS versus RANGE', d:'ROWS counts physical rows, RANGE includes all peers with the same ORDER BY value. Use ROWS for a fixed-size moving average.' },
    { t:'Missing days break the window', d:'"3 rows" is not "3 days" if days are missing. Generate a full calendar with a recursive CTE and LEFT JOIN the data.' },
    { t:'Partial windows at the start', d:'Early rows average fewer values. Hide them, flag them, or start the chart later.' },
    { t:'Ties in ORDER BY', d:'Add a unique tie-breaker to get repeatable results.' },
    { t:'Named windows', d:'`WINDOW w AS (...)` avoids repeating the OVER clause when several functions share it.' },
    { t:'Version', d:'Window functions need MySQL 8.0 or later.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Calculate a 2-order moving sum (the current order and the previous one).', table:T(ORD,'Table: orders'), hint:'SUM with 1 PRECEDING.', solution:'SELECT order_id, amount,\n       SUM(amount) OVER (\n         ORDER BY order_date\n         ROWS BETWEEN 1 PRECEDING AND CURRENT ROW\n       ) AS sum2\nFROM orders;', explain:'The values are 1200, 2000, 2300, 2200, 1600 and 1500. The first row has no previous row, so it is just 1200.' },
    { level:'Interview', q:'You need a 7-day moving average of daily sales, but some days have no rows. What goes wrong and how do you fix it?', hint:'The frame counts rows, not days.', solution:'A 7-row frame spans more than 7 days when days are missing, so the average covers the wrong period.\nFix: build a calendar (recursive CTE or calendar table), LEFT JOIN daily totals with COALESCE(total, 0), then apply the 7-row frame.', explain:'Recognising that "rows" are not "days" is the key insight.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you calculate a moving average in SQL?', a:'With AVG as a window function and a frame: AVG(amount) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) averages the current row and the two before it.',
      follow:[ { q:'What happens at the first rows?', a:'There are fewer rows available, so the average covers a shorter window.' } ] },
    { level:'Intermediate', q:'What is the difference between ROWS and RANGE in a window frame?', a:'ROWS counts physical rows around the current row. RANGE is based on the value of the ORDER BY column and includes all peer rows with the same value. For fixed-size moving averages I use ROWS.' },
    { level:'Scenario', q:'Show a 7-day moving average in a dashboard. What are the pitfalls?', a:'Missing days, partial windows at the start, and time zones. I build a complete calendar, show the average only when seven days are available, and align days to one time zone.',
      tradeoff:'Calendar joins cost a little extra query work but give correct, comparable windows.' }
  ],
  ref:{ headers:['Frame','Covers'], rows:[['`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`','The current row and the two before it'],['`ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING`','Centred window of 3'],['`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`','Running total'],['`ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING`','From here to the end']] },
  related:['running-total','lag','window-intro','recursive-cte']
};
})();
