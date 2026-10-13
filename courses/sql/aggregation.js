/* Datapath | SQL | Aggregate functions and grouping
 * Lessons in this file: count-sql, count-distinct, sum-sql, avg-sql, max-sql, min-sql, group-by, having
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

/* --- count-sql --- */
'count-sql': {
  title:'COUNT', tagline:'Count rows or non-empty values.',
  prereq:['select'],
  what:['COUNT returns how many rows or values there are.','`COUNT(*)` counts all rows.','`COUNT(column)` counts rows where that column is not NULL.'],
  why:['How many orders, customers or tickets?','Check data completeness by comparing counts.'],
  syntax:{ code:'SELECT COUNT(*) FROM table_name;\nSELECT COUNT(column) FROM table_name;', parts:[['COUNT(*)','Counts every row, NULLs included.'],['COUNT(column)','Counts non-NULL values only.']] },
  points:['COUNT(*) counts rows; COUNT(column) skips NULLs.','COUNT returns 0, never NULL, when no rows match.','Combine with WHERE to count a subset.','`COUNT(DISTINCT column)` counts unique values.','Often used with GROUP BY.'],
  mistakes:['Using COUNT(column) when you wanted all rows.','Forgetting that NULLs are skipped.','Counting after a join that duplicated rows.'],
  example:{ title:'Rows versus filled values', scenario:'One employee has no department. You compare COUNT(*) with COUNT(dept_id).',
    table:withHl(EMP,{'C7':'hit'},'Table: employees'), task:'Count all employees and those with a department.', formula:'SELECT COUNT(*) AS total,\n       COUNT(dept_id) AS with_dept\nFROM employees;',
    steps:['COUNT(*) counts all six rows.','COUNT(dept_id) skips Farhan\'s NULL, so it counts five.'],
    table2:{ rows:[['total','with_dept'],[6,5]], caption:'Result' }, result:'6 employees in total, and 5 with a department.' },
  practice:{ q:'Write a query that counts the orders of customer 101.', table:T(ORD,'Table: orders'), hint:'Add a WHERE clause.', solution:'SELECT COUNT(*)\nFROM orders\nWHERE customer_id = 101;', explain:'Orders 1, 3 and 6 belong to customer 101, so the result is 3.' },
  interview:[
    { level:'Basic', q:'What is the difference between COUNT(*) and COUNT(column)?', a:'COUNT(*) counts all rows. COUNT(column) counts only rows where the column is not NULL.' },
    { level:'Intermediate', q:'What does COUNT return on an empty set?', a:'0. Unlike SUM, AVG, MIN and MAX, which return NULL.' },
    { level:'Intermediate', q:'How do you count the NULLs in a column?', a:'COUNT(*) - COUNT(column), or SUM(column IS NULL) in MySQL.' },
    { level:'Scenario', q:'How would you check how complete the phone column is?', a:'Compare COUNT(phone) with COUNT(*), or compute COUNT(phone) * 100.0 / COUNT(*) as a completeness percentage.' }
  ],
  mcq:[
    { q:'What does COUNT(*) count?', o:['All rows','Non-NULL values only','Distinct values','Columns'], a:0, why:'It counts every row.' },
    { q:'Does COUNT(column) count NULLs?', o:['No','Yes','Only the first','Always'], a:0, why:'NULLs are skipped.' },
    { q:'What does COUNT return when no rows match?', o:['0','NULL','An error','1'], a:0, why:'COUNT returns zero.' },
    { q:'COUNT(*) vs COUNT(dept_id) differ by:', o:['The number of NULL dept_id rows','The number of departments','Nothing','The number of tables'], a:0, why:'The difference equals the NULLs.' },
    { q:'Which counts unique values?', o:['COUNT(DISTINCT col)','COUNT(UNIQUE col)','DISTINCT COUNT(col)','COUNT(col) DISTINCT'], a:0, why:'DISTINCT goes inside COUNT.' }
  ],
  recap:['COUNT(*) counts rows; COUNT(column) skips NULLs.','COUNT returns 0, not NULL.','Use COUNT(DISTINCT col) for unique values.']
},

/* --- count-distinct --- */
'count-distinct': {
  title:'COUNT(DISTINCT)', tagline:'Count how many different values there are.',
  prereq:['count-sql','select-distinct'],
  what:['COUNT(DISTINCT column) counts each different value once.','NULLs are ignored.','It answers "how many unique customers, products or days?".'],
  why:['Unique customers per month, distinct products sold.','A frequent interview topic.'],
  syntax:{ code:'SELECT COUNT(DISTINCT column)\nFROM table_name;', parts:[['DISTINCT','Inside COUNT, removes repeats before counting.']] },
  points:['Ignores NULL values.','Works with one column inside the brackets.','For combinations, concatenate columns or use a subquery.','Slower than COUNT(*) on huge tables.','Often grouped: unique customers per month.'],
  mistakes:['Using COUNT(*) when unique values are needed.','Expecting NULL to count as a value.','Counting duplicates created by joins.'],
  example:{ title:'How many different customers ordered?', scenario:'Six orders were placed, but some customers ordered more than once.',
    table:withHl(ORD,{'B2:B7':'range'},'Table: orders'), task:'Count the unique customers in orders.', formula:'SELECT COUNT(DISTINCT customer_id) AS customers\nFROM orders;',
    steps:['customer_id values are 101, 102, 101, 103, 102, 101.','DISTINCT keeps 101, 102 and 103.'],
    table2:{ rows:[['customers'],[3]], caption:'Result' }, result:'3 different customers placed orders.' },
  practice:{ q:'Write a query that counts the unique departments used in the employees table.', table:T(EMP,'Table: employees'), hint:'dept_id has 10, 20, 30 and a NULL.', solution:'SELECT COUNT(DISTINCT dept_id)\nFROM employees;', explain:'The distinct values are 10, 20 and 30. NULL is ignored, so the result is 3.' },
  interview:[
    { level:'Basic', q:'What does COUNT(DISTINCT col) return?', a:'The number of different non-NULL values in the column.' },
    { level:'Intermediate', q:'How do you count unique customers per month?', a:'SELECT MONTH(order_date), COUNT(DISTINCT customer_id) FROM orders GROUP BY MONTH(order_date);' },
    { level:'Intermediate', q:'COUNT(*) is 100 but COUNT(DISTINCT id) is 80. What does it mean?', a:'There are 20 repeated ids, so some ids appear in more than one row. I check whether that is expected or duplicate data.' },
    { level:'Scenario', q:'Count unique (customer, month) pairs.', a:'Use a subquery: SELECT COUNT(*) FROM (SELECT DISTINCT customer_id, MONTH(order_date) FROM orders) t;' }
  ],
  mcq:[
    { q:'Does COUNT(DISTINCT col) count NULL?', o:['No','Yes','Once','Twice'], a:0, why:'NULLs are ignored.' },
    { q:'For customer ids 101,102,101,103,102,101 the result is:', o:['3','6','2','1'], a:0, why:'Three different ids.' },
    { q:'Which finds how many different cities?', o:['COUNT(DISTINCT city)','COUNT(city)','DISTINCT(COUNT)','COUNT(*)'], a:0, why:'DISTINCT inside COUNT.' },
    { q:'COUNT(*)=10 and COUNT(DISTINCT id)=10 means:', o:['No repeated ids','All ids repeat','NULLs exist','Error'], a:0, why:'Each id appears once.' },
    { q:'Is COUNT(DISTINCT) usually faster than COUNT(*)?', o:['No, slower','Yes','Same','Only on small tables'], a:0, why:'Removing duplicates takes extra work.' }
  ],
  recap:['COUNT(DISTINCT col) counts unique non-NULL values.','Compare with COUNT(*) to find repeats.','Combine with GROUP BY for unique counts per group.']
},

/* --- sum-sql --- */
'sum-sql': {
  title:'SUM', tagline:'Add up the values of a numeric column.',
  prereq:['select'],
  what:['SUM adds all non-NULL values in a column.','It works on numeric columns only.','It returns NULL if there are no rows to add.'],
  why:['Total sales, revenue, expenses and quantities.'],
  syntax:{ code:'SELECT SUM(column)\nFROM table_name;', parts:[['SUM(column)','The total of the column, ignoring NULLs.']] },
  points:['NULLs are ignored.','On an empty set, SUM returns **NULL**, not 0. Use `COALESCE(SUM(x), 0)`.','Combine with WHERE to total a subset.','With GROUP BY it gives totals per group.','`SUM(DISTINCT col)` adds each different value once.'],
  mistakes:['Expecting 0 for an empty set.','Summing after a join that duplicated rows.','Summing text columns.'],
  example:{ title:'Total order value', scenario:'You want the total amount of all orders.',
    table:withHl(ORD,{'D2:D7':'range'},'Table: orders'), task:'Add up the amounts.', formula:'SELECT SUM(amount) AS total_amount\nFROM orders;',
    steps:['SUM adds 1200 + 800 + 1500 + 700 + 900 + 600.'],
    table2:{ rows:[['total_amount'],[5700]], caption:'Result' }, result:'The total is 5700.' },
  practice:{ q:'Write a query for the total amount of customer 101\'s orders.', table:T(ORD,'Table: orders'), hint:'Use WHERE and SUM.', solution:'SELECT SUM(amount)\nFROM orders\nWHERE customer_id = 101;', explain:'1200 + 1500 + 600 gives 3300.' },
  interview:[
    { level:'Basic', q:'What does SUM do with NULL values?', a:'It ignores them. If every value is NULL, or there are no rows, the result is NULL.' },
    { level:'Intermediate', q:'How do you make SUM return 0 on an empty set?', a:'COALESCE(SUM(amount), 0).' },
    { level:'Intermediate', q:'Why can SUM be wrong after a join?', a:'A one-to-many join repeats rows, so the amounts are counted several times. I aggregate before joining, or join on a unique key.' },
    { level:'Scenario', q:'Total sales per customer?', a:'SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id;' }
  ],
  mcq:[
    { q:'What does SUM return for no rows?', o:['NULL','0','An error','1'], a:0, why:'SUM of nothing is NULL.' },
    { q:'Does SUM include NULL values?', o:['No, ignored','Yes as 0','Yes as 1','Error'], a:0, why:'NULLs are skipped.' },
    { q:'Which returns 0 for an empty set?', o:['COALESCE(SUM(x),0)','SUM(x)+NULL','SUM(0)','NULLIF(SUM(x),0)'], a:0, why:'COALESCE replaces NULL.' },
    { q:'SUM(amount) for the orders table is:', o:['5700','5100','950','6'], a:0, why:'The sum of six amounts.' },
    { q:'Can SUM work on text columns?', o:['No','Yes','Only numbers stored as text always','Only in MySQL'], a:0, why:'It needs numeric values.' }
  ],
  recap:['SUM totals non-NULL values.','Empty set gives NULL; use COALESCE.','Watch for row duplication in joins.']
},

/* --- avg-sql --- */
'avg-sql': {
  title:'AVG', tagline:'Find the average of a numeric column.',
  prereq:['sum-sql'],
  what:['AVG returns the mean of the non-NULL values.','It divides the sum by the count of non-NULL values.','It returns NULL for an empty set.'],
  why:['Average order value, average salary, average delivery time.'],
  syntax:{ code:'SELECT AVG(column)\nFROM table_name;', parts:[['AVG(column)','Sum divided by the count of non-NULL values.']] },
  points:['NULLs are **not** counted as 0, so they do not lower the average.','Use `COALESCE(col, 0)` if NULL should count as zero.','Round the result with ROUND.','AVG can hide outliers; check MIN and MAX too.','Per group: `GROUP BY`.'],
  mistakes:['Thinking NULL counts as zero.','Averaging averages.','Not rounding long decimals.'],
  example:{ title:'Average salary', scenario:'You want the average salary of all employees.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Return the average salary.', formula:'SELECT AVG(salary) AS avg_salary\nFROM employees;',
    steps:['The total salary is 270000.','There are six salaries, so 270000 / 6.'],
    table2:{ rows:[['avg_salary'],[45000]], caption:'Result' }, result:'The average salary is 45000.' },
  practice:{ q:'Write a query for the average order amount of customer 102, rounded to 1 decimal.', table:T(ORD,'Table: orders'), hint:'Wrap AVG in ROUND.', solution:'SELECT ROUND(AVG(amount), 1)\nFROM orders\nWHERE customer_id = 102;', explain:'(800 + 900) / 2 = 850, shown as 850.0.' },
  interview:[
    { level:'Basic', q:'How does AVG treat NULL?', a:'It ignores NULLs, so they are not counted in either the sum or the count.' },
    { level:'Intermediate', q:'How do you treat NULL as zero in an average?', a:'AVG(COALESCE(col, 0)). Then NULLs count as zero values.' },
    { level:'Intermediate', q:'Is the average of group averages equal to the overall average?', a:'Only if the groups are the same size. Otherwise I calculate SUM / COUNT over the whole data.' },
    { level:'Scenario', q:'Show departments with an average salary above 45000.', a:'SELECT dept_id, AVG(salary) FROM employees GROUP BY dept_id HAVING AVG(salary) > 45000;' }
  ],
  mcq:[
    { q:'AVG(salary) for the employees table is:', o:['45000','50000','40000','270000'], a:0, why:'270000 divided by 6.' },
    { q:'Does AVG count NULL as 0?', o:['No','Yes','Sometimes','Only in MySQL'], a:0, why:'NULLs are skipped entirely.' },
    { q:'What returns the mean treating NULL as 0?', o:['AVG(COALESCE(x,0))','AVG(x)+0','SUM(x)','COUNT(x)'], a:0, why:'COALESCE converts NULL first.' },
    { q:'What does AVG return on an empty set?', o:['NULL','0','Error','1'], a:0, why:'Nothing to average.' },
    { q:'Which filters on an average per group?', o:['HAVING AVG(x) > n','WHERE AVG(x) > n','ORDER BY AVG','LIKE'], a:0, why:'Aggregates need HAVING.' }
  ],
  recap:['AVG ignores NULLs.','Use COALESCE if NULL should count as 0.','Filter averages with HAVING.']
},

/* --- max-sql --- */
'max-sql': {
  title:'MAX', tagline:'Find the largest value in a column.',
  prereq:['select'],
  what:['MAX returns the highest value.','It works on numbers, dates and text.','NULLs are ignored.'],
  why:['Highest salary, latest order date, biggest sale.'],
  syntax:{ code:'SELECT MAX(column)\nFROM table_name;', parts:[['MAX(column)','The largest non-NULL value.']] },
  points:['On dates, MAX returns the **latest** date.','On text, it returns the last in alphabetical order.','Returns NULL for an empty set.','It returns the **value**, not the row; to get the employee, use a subquery or ORDER BY with LIMIT.','With GROUP BY, MAX per group.'],
  mistakes:['Selecting name together with MAX(salary) and expecting the matching name.','Forgetting GROUP BY for non-aggregated columns.','Using MAX on text numbers.'],
  example:{ title:'Highest salary', scenario:'You want the largest salary paid.',
    table:withHl(EMP,{'D4':'hit'},'Table: employees'), task:'Return the maximum salary.', formula:'SELECT MAX(salary) AS highest\nFROM employees;',
    steps:['MAX compares all six salaries.','The largest is Chitra\'s 60000.'],
    table2:{ rows:[['highest'],[60000]], caption:'Result' }, result:'The highest salary is 60000.' },
  practice:{ q:'Write a query that returns the date of the latest order.', table:T(ORD,'Table: orders'), hint:'MAX works on dates.', solution:'SELECT MAX(order_date)\nFROM orders;', explain:'The latest date is 2026-03-15.' },
  interview:[
    { level:'Basic', q:'What does MAX do on a date column?', a:'It returns the latest date.' },
    { level:'Intermediate', q:'How do you get the name of the highest-paid employee?', a:'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 1; or WHERE salary = (SELECT MAX(salary) FROM employees) to include ties.' },
    { level:'Intermediate', q:'Why does SELECT name, MAX(salary) FROM employees fail or mislead?', a:'name is not aggregated, so which name goes with the maximum is undefined. Strict MySQL mode rejects it.' },
    { level:'Scenario', q:'Latest order date per customer?', a:'SELECT customer_id, MAX(order_date) FROM orders GROUP BY customer_id;' }
  ],
  mcq:[
    { q:'MAX on dates returns:', o:['The latest date','The earliest date','The count','NULL'], a:0, why:'Later dates are larger.' },
    { q:'MAX(salary) in employees is:', o:['60000','35000','50000','45000'], a:0, why:'Chitra earns the most.' },
    { q:'How do you get the row with the maximum?', o:['ORDER BY ... DESC LIMIT 1','MAX(*)','SELECT MAX','GROUP MAX'], a:0, why:'Sort and take one row.' },
    { q:'MAX on an empty set returns:', o:['NULL','0','Error','1'], a:0, why:'Nothing to compare.' },
    { q:'Does MAX ignore NULL?', o:['Yes','No','Only dates','Only text'], a:0, why:'NULLs are skipped.' }
  ],
  recap:['MAX returns the largest value, or latest date.','It returns a value, not the whole row.','Use ORDER BY ... LIMIT 1 to get the row.']
},

/* --- min-sql --- */
'min-sql': {
  title:'MIN', tagline:'Find the smallest value in a column.',
  prereq:['max-sql'],
  what:['MIN returns the lowest value.','It works on numbers, dates and text.','NULLs are ignored.'],
  why:['Lowest salary, earliest date, cheapest price.'],
  syntax:{ code:'SELECT MIN(column)\nFROM table_name;', parts:[['MIN(column)','The smallest non-NULL value.']] },
  points:['On dates, MIN returns the **earliest** date.','Returns NULL for an empty set.','NULLs are ignored, so a missing value never becomes the minimum.','Zeros count as values.','Per group with GROUP BY.'],
  mistakes:['Expecting the matching row.','Zeros hiding the real minimum.','Mixing MIN with non-aggregated columns.'],
  example:{ title:'Earliest order', scenario:'You want to know when the first order was placed.',
    table:withHl(ORD,{'C2':'hit'},'Table: orders'), task:'Return the earliest order date.', formula:'SELECT MIN(order_date) AS first_order\nFROM orders;',
    steps:['MIN compares all six dates.','The earliest is 2026-01-05.'],
    table2:{ rows:[['first_order'],['2026-01-05']], caption:'Result' }, result:'The first order was on 2026-01-05.' },
  practice:{ q:'Write a query that returns the lowest salary and the highest salary in one result.', table:T(EMP,'Table: employees'), hint:'Use MIN and MAX together.', solution:'SELECT MIN(salary) AS lowest,\n       MAX(salary) AS highest\nFROM employees;', explain:'The result is 35000 and 60000.' },
  interview:[
    { level:'Basic', q:'What does MIN return?', a:'The smallest non-NULL value in the column, or the earliest date.' },
    { level:'Intermediate', q:'How do you find the first order date for each customer?', a:'SELECT customer_id, MIN(order_date) FROM orders GROUP BY customer_id;' },
    { level:'Intermediate', q:'How do you get the lowest-paid employee?', a:'ORDER BY salary ASC LIMIT 1, or WHERE salary = (SELECT MIN(salary) FROM employees).' },
    { level:'Scenario', q:'A column has zeros for "unknown" and MIN returns 0. What do you do?', a:'Treat zeros as missing with NULLIF(col, 0), because MIN ignores NULL, or filter them out with WHERE col > 0.' }
  ],
  mcq:[
    { q:'MIN on dates returns:', o:['The earliest date','The latest date','The count','NULL'], a:0, why:'Earlier dates are smaller.' },
    { q:'MIN(salary) in employees is:', o:['35000','40000','60000','45000'], a:0, why:'Farhan earns the least.' },
    { q:'Does MIN ignore NULL?', o:['Yes','No','Only numbers','Only dates'], a:0, why:'NULLs are skipped.' },
    { q:'MIN of an empty set is:', o:['NULL','0','Error','1'], a:0, why:'Nothing to compare.' },
    { q:'How do you ignore zeros in MIN?', o:['MIN(NULLIF(col,0))','MIN(col)+0','MIN(0)','MIN(DISTINCT)'], a:0, why:'NULLIF turns zero into NULL.' }
  ],
  recap:['MIN returns the smallest value or earliest date.','NULLs are ignored; zeros are not.','Use ORDER BY ... LIMIT 1 for the row.']
},

/* --- group-by --- */
'group-by': {
  title:'GROUP BY', tagline:'Summarise rows by groups.',
  prereq:['count-sql','sum-sql'],
  what:['GROUP BY splits rows into groups that share a value.','Aggregate functions then work on each group.','It is how you get totals per department, customer or month.'],
  why:['The heart of reporting: "how much per what".','Always asked in interviews.'],
  syntax:{ code:'SELECT column, AGGREGATE(column)\nFROM table_name\nGROUP BY column;', parts:[['GROUP BY column','Rows with the same value form one group.']] },
  points:['Every non-aggregated column in SELECT must be in GROUP BY.','NULL forms its **own group**.','GROUP BY runs after WHERE and before HAVING.','You can group by several columns.','Add ORDER BY to control the output order.','You can group by an expression such as `MONTH(order_date)`.'],
  mistakes:['A SELECT column missing from GROUP BY.','Filtering aggregates with WHERE instead of HAVING.','Forgetting the NULL group.'],
  example:{ title:'Employees and payroll per department', scenario:'You want the number of employees and total salary of each department.',
    table:withHl(EMP,{'C2:C7':'range','D2:D7':'range'},'Table: employees'), task:'Summarise by dept_id.', formula:'SELECT dept_id,\n       COUNT(*) AS employees,\n       SUM(salary) AS total_salary\nFROM employees\nGROUP BY dept_id\nORDER BY dept_id;',
    steps:['Rows are grouped by dept_id, with NULL as its own group.','COUNT and SUM are calculated inside each group.'],
    table2:{ rows:[['dept_id','employees','total_salary'],['NULL',1,35000],[10,2,110000],[20,2,80000],[30,1,45000]], caption:'Result' }, result:'Department 10 has 2 employees with a payroll of 110000.' },
  practice:{ q:'Write a query for the total order amount per customer.', table:T(ORD,'Table: orders'), hint:'Group by customer_id and use SUM.', solution:'SELECT customer_id, SUM(amount) AS total\nFROM orders\nGROUP BY customer_id;', explain:'Customer 101 totals 3300, customer 102 totals 1700 and customer 103 totals 700.' },
  interview:[
    { level:'Basic', q:'What does GROUP BY do?', a:'It groups rows that share the same value so aggregate functions can be calculated for each group.' },
    { level:'Intermediate', q:'Why must non-aggregated columns be in GROUP BY?', a:'Each group returns one row, and a column that is neither grouped nor aggregated has several possible values, so SQL cannot pick one.' },
    { level:'Intermediate', q:'How does GROUP BY treat NULL?', a:'All NULLs are placed in one group.' },
    { level:'Scenario', q:'Monthly sales from an orders table?', a:'SELECT MONTH(order_date) AS month, SUM(amount) FROM orders GROUP BY MONTH(order_date); For several years, group by YEAR as well.' }
  ],
  mcq:[
    { q:'What forms a group?', o:['Rows with the same value','All rows','Rows with NULL','Only the first row'], a:0, why:'Equal values are grouped together.' },
    { q:'Where must non-aggregated SELECT columns appear?', o:['In GROUP BY','In WHERE','In ORDER BY only','Nowhere'], a:0, why:'Otherwise the result is ambiguous.' },
    { q:'How many groups do NULLs form?', o:['One','One per NULL','None','Two'], a:0, why:'NULLs are grouped together.' },
    { q:'Order of execution: which is first?', o:['WHERE then GROUP BY','GROUP BY then WHERE','HAVING then WHERE','ORDER then WHERE'], a:0, why:'Filter rows, then group.' },
    { q:'Can you group by two columns?', o:['Yes','No','Only numbers','Only dates'], a:0, why:'Each combination forms a group.' }
  ],
  recap:['GROUP BY summarises rows per group.','Select only grouped or aggregated columns.','NULL forms its own group.']
},

/* --- having --- */
'having': {
  title:'HAVING', tagline:'Filter groups after aggregation.',
  prereq:['group-by'],
  what:['HAVING filters groups, not rows.','It can use aggregate functions.','It runs after GROUP BY.'],
  why:['"Departments with payroll over 100000" or "customers with more than one order".','WHERE versus HAVING is a favourite interview question.'],
  syntax:{ code:'SELECT column, AGGREGATE(column)\nFROM table_name\nGROUP BY column\nHAVING AGGREGATE(column) > value;', parts:[['HAVING','A condition on the aggregated result.']] },
  points:['**WHERE** filters rows before grouping; **HAVING** filters groups after.','HAVING can use aggregates; WHERE cannot.','Use WHERE for row filters whenever possible, because it is faster.','MySQL lets HAVING use SELECT aliases.','Order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.'],
  mistakes:['Using HAVING for plain row filters.','Using an aggregate in WHERE.','Forgetting GROUP BY.'],
  example:{ title:'Big departments by payroll', scenario:'You want departments whose total salary is above 100000.',
    table:withHl(EMP,{'C2:D7':'range'},'Table: employees'), task:'Return those departments.', formula:'SELECT dept_id, SUM(salary) AS total_salary\nFROM employees\nGROUP BY dept_id\nHAVING SUM(salary) > 100000;',
    steps:['GROUP BY forms the groups and SUM totals each.','HAVING keeps only groups with a total above 100000.'],
    table2:{ rows:[['dept_id','total_salary'],[10,110000]], caption:'Result' }, result:'Only department 10 qualifies.' },
  practice:{ q:'Write a query for the customers who placed more than one order.', table:T(ORD,'Table: orders'), hint:'Group by customer_id and use HAVING COUNT(*).', solution:'SELECT customer_id, COUNT(*) AS orders\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 1;', explain:'Customer 101 has 3 orders and customer 102 has 2. Customer 103 has only 1.' },
  interview:[
    { level:'Basic', q:'What is the difference between WHERE and HAVING?', a:'WHERE filters individual rows before grouping and cannot use aggregates. HAVING filters groups after aggregation and can.' },
    { level:'Intermediate', q:'Can you use HAVING without GROUP BY?', a:'Yes, the whole table is treated as one group, but it is rare.' },
    { level:'Intermediate', q:'How do you decide between WHERE and HAVING for a condition?', a:'If it involves a plain column, use WHERE to cut rows early. If it involves an aggregate, use HAVING.' },
    { level:'Scenario', q:'Departments with at least 2 employees earning above 40000?', a:'SELECT dept_id, COUNT(*) FROM employees WHERE salary > 40000 GROUP BY dept_id HAVING COUNT(*) >= 2; WHERE filters the rows, HAVING filters the groups.' }
  ],
  mcq:[
    { q:'What does HAVING filter?', o:['Groups','Rows before grouping','Columns','Tables'], a:0, why:'HAVING works after GROUP BY.' },
    { q:'Can WHERE use SUM()?', o:['No','Yes','Only with HAVING','Only in MySQL'], a:0, why:'Use HAVING for aggregates.' },
    { q:'Which runs first?', o:['WHERE','HAVING','Both together','SELECT'], a:0, why:'WHERE filters rows first.' },
    { q:'Which is faster for a plain column filter?', o:['WHERE','HAVING','Same','Neither'], a:0, why:'WHERE reduces rows before grouping.' },
    { q:'HAVING COUNT(*) > 1 on orders per customer returns:', o:['Customers 101 and 102','All customers','Customer 103','Nobody'], a:0, why:'101 has 3 orders and 102 has 2.' }
  ],
  recap:['WHERE filters rows; HAVING filters groups.','HAVING can use aggregates.','Prefer WHERE for plain row filters.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- count-sql --- */
DEEP['count-sql'] = {
  level:'Beginner to Intermediate',
  tldr:'COUNT(*) counts **rows**. COUNT(column) counts **non-NULL values**. COUNT(DISTINCT column) counts different values.',
  intuition:{ text:[
    'Counting seems simple until NULLs arrive. "How many employees?" is a row question, so COUNT(*). "How many employees have a department?" is a value question, so COUNT(dept_id). The difference between the two is exactly the number of NULLs.',
    'Putting CASE inside COUNT lets you count several categories in one pass, which is the basis of most summary reports.'
  ], analogy:'Counting people in a room (rows) versus counting how many of them wear a name badge (non-NULL values).' },
  how:[
    '`COUNT(*)` counts every row of the group, whatever the values.',
    '`COUNT(col)` counts the rows where `col` is not NULL.',
    '`COUNT(DISTINCT col)` counts different non-NULL values.',
    '`COUNT(CASE WHEN condition THEN 1 END)` counts rows meeting a condition, because CASE returns NULL otherwise.',
    'With no rows, COUNT returns 0, never NULL.'
  ],
  diagrams:[
    { type:'flow', panels:[
      { title:'dept_id column', rows:[['dept_id'],[10],[20],[10],[30],[20],['NULL']], hl:{6:'miss'}, note:'COUNT(*) = 6, COUNT(dept_id) = 5, COUNT(DISTINCT dept_id) = 3' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'COUNT with GROUP BY', scenario:'Orders per customer.', table:T(ORD,'Table: orders'), task:'Count the orders of each customer.', formula:'SELECT customer_id, COUNT(*) AS orders\nFROM orders\nGROUP BY customer_id;', steps:['GROUP BY forms one group per customer.','COUNT(*) counts the rows in each group.'], table2:{ rows:[['customer_id','orders'],[101,3],[102,2],[103,1]], caption:'Result' }, result:'Customer 101 has the most orders.' },
    { level:'Business case', title:'Conditional counts in one pass', scenario:'Customer success wants, for each customer, the number of orders and how many were large (1000 or more).', table:T(ORD,'Table: orders'), task:'Use COUNT with CASE.',
      formula:'SELECT customer_id,\n       COUNT(*) AS orders,\n       COUNT(CASE WHEN amount >= 1000 THEN 1 END) AS large_orders\nFROM orders\nGROUP BY customer_id;', steps:['CASE returns 1 for large orders and NULL otherwise.','COUNT skips the NULLs, so only large orders are counted.'], table2:{ rows:[['customer_id','orders','large_orders'],[101,3,2],[102,2,0],[103,1,0]], caption:'Result' }, result:'Customer 101 has 2 large orders out of 3.' }
  ],
  edge:[
    { t:'COUNT(*) versus COUNT(col)', d:'They differ by the number of NULLs in the column. Use the difference to measure data completeness.' },
    { t:'COUNT returns 0 on no rows', d:'Unlike SUM, AVG, MIN and MAX, which return NULL, COUNT returns 0 for an empty set.' },
    { t:'LEFT JOIN trap', d:'After a LEFT JOIN, COUNT(*) counts the unmatched row as 1. Use `COUNT(right_table.key)` to get 0.' },
    { t:'COUNT(1) and COUNT(*)', d:'They are equivalent. There is no performance difference in modern databases.' },
    { t:'Duplicates from joins', d:'Counting after a one-to-many join counts the repeated rows. Use `COUNT(DISTINCT key)`.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show the completeness (percentage of non-NULL values) of manager_id in the employees table.', table:T(EMP,'Table: employees'), hint:'COUNT(col) divided by COUNT(*).', solution:'SELECT ROUND(COUNT(manager_id) * 100.0 / COUNT(*), 2) AS pct_filled\nFROM employees;', explain:'5 of 6 rows have a manager, so the result is 83.33.' },
    { level:'Interview', q:'Return every customer with their number of orders, including customers with none, and explain a common mistake.', table:T(CUST,'Table: customers'), hint:'LEFT JOIN and a column from the right table.', solution:'SELECT c.name, COUNT(o.order_id) AS orders\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name;', explain:'Deepak gets 0. The common mistake is COUNT(*), which returns 1 for him because the unmatched row still exists after the join.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between COUNT(*), COUNT(column) and COUNT(DISTINCT column)?', a:'COUNT(*) counts all rows. COUNT(column) counts rows where the column is not NULL. COUNT(DISTINCT column) counts the different non-NULL values.',
      structure:'One line each, with a small table example that includes a NULL and a repeated value.',
      follow:[ { q:'What does COUNT return for an empty table?', a:'0, unlike the other aggregates, which return NULL.' } ] },
    { level:'Intermediate', q:'How do you count rows meeting a condition inside a group?', a:'COUNT(CASE WHEN condition THEN 1 END), or SUM(CASE WHEN condition THEN 1 ELSE 0 END). CASE returns NULL when the condition fails, and COUNT ignores NULLs.' },
    { level:'Scenario', q:'A report shows 1 order for customers who never ordered. Why?', a:'COUNT(*) counts the row created by the LEFT JOIN. I use COUNT(o.order_id), which counts only real matches.' }
  ],
  ref:{ headers:['Form','Counts'], rows:[['`COUNT(*)`','All rows'],['`COUNT(col)`','Non-NULL values'],['`COUNT(DISTINCT col)`','Different non-NULL values'],['`COUNT(CASE WHEN c THEN 1 END)`','Rows meeting a condition']] },
  related:['count-distinct','group-by','left-join','is-null']
};

/* --- count-distinct --- */
D('count-distinct',{ l:'Beginner to Intermediate', t:'COUNT(DISTINCT col) counts the different non-NULL values.',
  i:['COUNT(*) counts rows, but "how many different customers?" needs distinct values. COUNT(DISTINCT customer_id) collapses repeats before counting.','A large gap between COUNT(*) and COUNT(DISTINCT) means many repeats.'], a:'Counting the different people who visited, not the number of visits.',
  h:['Write `COUNT(DISTINCT column)`.','Duplicates are removed first, then the values are counted.','NULL is ignored.','Combine with GROUP BY for unique counts per group.'],
  d:[FL(['DISTINCT then count'],[{ title:'customer_id in orders', rows:[['customer_id'],[101],[102],[101],[103],[102],[101]] },{ title:'COUNT(DISTINCT)', text:'**3**' }])],
  x:[X('Variation','Per group','Unique customers per month.','Group by month.','SELECT MONTH(order_date) AS month,\n       COUNT(DISTINCT customer_id) AS customers\nFROM orders GROUP BY MONTH(order_date);',['Each month has two different customers.'],'Months 1, 2 and 3 each show 2.',T(ORD,'Table: orders')),
     X('Business case','Orders per customer','Average orders per active customer.','Divide counts.','SELECT COUNT(*) / COUNT(DISTINCT customer_id) AS orders_per_customer\nFROM orders;',['6 orders over 3 customers.'],'The result is 2.',T(ORD,'Table: orders'))],
  e:[['NULL is ignored','NULL is not counted as a value.'],['Slower than COUNT(*)','Distinct counting needs extra work.'],['Combinations','Use a subquery or concatenation for unique pairs.'],['Joins inflate COUNT(*)','Use DISTINCT on the key to count real entities.']],
  p:[P('Medium','Count the distinct departments in employees.','NULL is ignored.','SELECT COUNT(DISTINCT dept_id) FROM employees;','3: 10, 20, 30.',T(EMP,'Table: employees')),
     P('Interview','COUNT(*) is 100 but COUNT(DISTINCT id) is 80. What does it tell you?','Repeats.','Twenty rows repeat an id. Check whether that is legitimate or duplicate data.','Interpretation, not just the number.')],
  q:[Q('Basic','What does COUNT(DISTINCT) do?','It counts different non-NULL values.',{ f:[['Does it count NULL?','No.']] }),
     Q('Scenario','Unique buyers per month.','COUNT(DISTINCT customer_id) with GROUP BY month.',{ t:'Group by year and month across years.' })],
  r:RT(['Form','Counts'],[['`COUNT(*)`','Rows'],['`COUNT(col)`','Non-NULL'],['`COUNT(DISTINCT col)`','Different non-NULL'],['Per group','Add `GROUP BY`']]), rel:['count-sql','select-distinct','group-by','inner-join'] });

/* --- sum-sql --- */
D('sum-sql',{ l:'Beginner', t:'SUM adds non-NULL values and returns NULL, not 0, when there are no rows. Wrap with COALESCE in reports.',
  i:['SUM totals a numeric column, optionally for a group or a filtered set. It ignores NULLs.','Two traps: an empty set gives NULL, and joining one-to-many tables repeats rows so totals inflate.'], a:'Adding the receipts in a pile.',
  h:['Write `SUM(column)`.','Add WHERE to total a subset.','Add GROUP BY for totals per group.','Wrap with `COALESCE(SUM(x), 0)` when no rows must show 0.'],
  d:[FL(['SUM(amount)'],[{ title:'orders', rows:[['order_id','amount'],[1,1200],[2,800],[3,1500],[4,700],[5,900],[6,600]] },{ title:'SUM', text:'**5700**' }])],
  x:[X('Variation','Conditional sum','Total of large orders only.','Use CASE inside SUM.','SELECT SUM(CASE WHEN amount >= 1000 THEN amount ELSE 0 END) AS large_total\nFROM orders;',['Only 1200 and 1500 pass.'],'The result is 2700.',T(ORD,'Table: orders')),
     X('Business case','Inflated totals','After joining orders to order items, totals double.','Aggregate before joining.','SELECT c.name, o.total\nFROM customers c\nJOIN (SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id) o\n  ON c.customer_id = o.customer_id;',['The subquery has one row per customer.'],'Joining it cannot multiply totals.')],
  e:[['Empty set gives NULL','Use COALESCE(SUM(x), 0).'],['NULLs ignored','They are skipped, not treated as 0.'],['Join duplicates','One-to-many joins repeat the summed rows.'],['Data types','Summing text numbers can give odd results; cast first.']],
  p:[P('Medium','Total amount for customer 101.','WHERE.','SELECT SUM(amount) FROM orders WHERE customer_id = 101;','3300.',T(ORD,'Table: orders')),
     P('Interview','SUM of no rows: NULL or 0?','Empty set.','NULL. Use COALESCE(SUM(x), 0) when the report needs 0.','Contrast with COUNT.')],
  q:[Q('Basic','What does SUM do with NULL?','It ignores NULLs; with no values it returns NULL.',{ f:[['How do you get 0 instead?','COALESCE.']] }),
     Q('Scenario','Totals look too big after a join.','A one-to-many join repeated rows. Aggregate first or join on unique keys.',{ t:'Check the row count after each join.' })],
  r:RT(['Need','Write'],[['Total','`SUM(x)`'],['Total or 0','`COALESCE(SUM(x), 0)`'],['Conditional','`SUM(CASE WHEN c THEN x ELSE 0 END)`'],['Per group','`GROUP BY`']]), rel:['avg-sql','group-by','coalesce','multiple-joins'] });

/* --- avg-sql --- */
D('avg-sql',{ l:'Beginner', t:'AVG ignores NULLs, so they are not counted as zero. Use COALESCE inside AVG if NULL should mean 0.',
  i:['AVG divides the sum by the number of non-NULL values. A missing value does not drag the average down, because it is not counted at all.','Whether that is right depends on meaning: "unknown" is different from "zero".'], a:'The average height of those who were measured.',
  h:['Write `AVG(column)`.','NULLs are excluded from both sum and count.','Use `AVG(COALESCE(col, 0))` to treat NULL as 0.','Round with ROUND for tidy output.'],
  d:[FL(['AVG(manager_id)'],[{ title:'manager_id', rows:[['manager_id'],['NULL'],[1],[1],[2],[2],[3]] },{ title:'Result', text:'9 / 5 = **1.8** (NULL skipped)' }])],
  x:[X('Variation','NULL as zero','Average manager_id counting NULL as 0.','Wrap with COALESCE.','SELECT AVG(manager_id) AS skip_null,\n       AVG(COALESCE(manager_id, 0)) AS null_as_zero\nFROM employees;',['The first averages 5 values, the second 6.'],'1.8 versus 1.5.',T(EMP,'Table: employees')),
     X('Business case','Average per customer versus per order','Average order value and average spend per customer differ.','Compute both.','SELECT AVG(amount) AS per_order FROM orders;\nSELECT AVG(total) FROM (SELECT SUM(amount) AS total FROM orders GROUP BY customer_id) t;',['Per order: 950.','Per customer: 1900.'],'They answer different questions.',T(ORD,'Table: orders'))],
  e:[['NULL is not zero','AVG skips NULLs. Decide what a missing value means.'],['Empty set','Returns NULL.'],['Average of averages','Weight by counts.'],['Outliers','One large value distorts. Also report MEDIAN-like measures.']],
  p:[P('Medium','Average order amount of customer 102, rounded to 1 decimal.','ROUND.','SELECT ROUND(AVG(amount), 1) FROM orders WHERE customer_id = 102;','850.0.',T(ORD,'Table: orders')),
     P('Interview','Is the average of group averages the overall average?','Group sizes.','Only if groups are the same size. Otherwise use total divided by count.','Give a numeric counterexample.')],
  q:[Q('Basic','How does AVG treat NULL?','It ignores NULLs.',{ f:[['How do you count NULL as 0?','AVG(COALESCE(col, 0)).']] }),
     Q('Scenario','Departments with average salary above 45000.','GROUP BY dept_id HAVING AVG(salary) > 45000.',{ t:'HAVING filters on aggregates.' })],
  r:RT(['Need','Write'],[['Mean','`AVG(x)`'],['NULL as 0','`AVG(COALESCE(x, 0))`'],['Rounded','`ROUND(AVG(x), 2)`'],['Per group','`GROUP BY`']]), rel:['sum-sql','count-sql','having','is-null'] });

/* --- max-sql --- */
D('max-sql',{ l:'Beginner', t:'MAX returns the largest value or latest date, not the whole row. Use ORDER BY with LIMIT, or a subquery, to get the row.',
  i:['MAX answers "what is the highest salary?". It does not tell you who earns it. A column in the SELECT list that is not aggregated has no defined value in that group.','To return the row, sort and take one, or compare with MAX in a subquery.'], a:'Reading the highest number on a leaderboard without the name.',
  h:['Write `MAX(column)`.','On dates it returns the latest date.','To get the full row, use `ORDER BY ... DESC LIMIT 1`.','Per group, add GROUP BY.'],
  d:[FL(['MAX(salary)'],[{ title:'salary', rows:[['salary'],[50000],[40000],[60000],[45000],[40000],[35000]], hl:{3:'hit'} },{ title:'MAX', text:'**60000**' }])],
  x:[X('Variation','The row with the maximum','Who earns the most (including ties)?','Compare with MAX.','SELECT name, salary FROM employees\nWHERE salary = (SELECT MAX(salary) FROM employees);',['The subquery returns 60000.'],'Chitra.',T(EMP,'Table: employees')),
     X('Business case','Latest order per customer date','Last order date per customer.','Group and MAX.','SELECT customer_id, MAX(order_date) AS last_order\nFROM orders GROUP BY customer_id;',['One row per customer.'],'101: 2026-03-15, 102: 2026-03-09, 103: 2026-02-21.',T(ORD,'Table: orders'))],
  e:[['Not the row','`SELECT name, MAX(salary)` is invalid or arbitrary.'],['Ties','Several rows can share the maximum.'],['NULL ignored','NULLs are skipped.'],['Text values','MAX works on text alphabetically.']],
  p:[P('Medium','The latest order date.','MAX on dates.','SELECT MAX(order_date) FROM orders;','2026-03-15.',T(ORD,'Table: orders')),
     P('Interview','Why does SELECT name, MAX(salary) fail?','Aggregation.','name is not aggregated, so which name goes with the maximum is undefined. Use a subquery or ORDER BY LIMIT 1.','Explain the rule.')],
  q:[Q('Basic','What does MAX return for dates?','The latest date.',{ f:[['How do you get the row?','ORDER BY DESC LIMIT 1 or a subquery.']] }),
     Q('Scenario','Highest sale per region with the name of the product.','Rank rows with ROW_NUMBER per region and keep rn = 1.',{ t:'MAX alone loses the other columns.' })],
  r:RT(['Need','Write'],[['Highest','`MAX(x)`'],['Latest','`MAX(date)`'],['The row','`ORDER BY x DESC LIMIT 1`'],['Per group','`GROUP BY`']]), rel:['min-sql','group-by','subquery-where','row-number'] });

/* --- min-sql --- */
D('min-sql',{ l:'Beginner', t:'MIN returns the smallest value or earliest date. Zeros count, so a placeholder 0 can hide the real minimum.',
  i:['MIN is MAX\'s mirror: the lowest price, the earliest date, the first order.','It ignores NULLs but not zeros, so check whether 0 means "none".'], a:'The bottom of a leaderboard.',
  h:['Write `MIN(column)`.','On dates it returns the earliest date.','Combine with GROUP BY for per-group minimums.','Use `MIN(NULLIF(col, 0))` to ignore zeros.'],
  d:[FL(['MIN(order_date)'],[{ title:'order_date', rows:[['order_date'],['2026-01-05'],['2026-01-18'],['2026-02-03']], hl:{1:'hit'} },{ title:'MIN', text:'**2026-01-05**' }])],
  x:[X('Variation','Lowest and highest together','Show the salary range.','Use both.','SELECT MIN(salary) AS lowest, MAX(salary) AS highest\nFROM employees;',['One row with both values.'],'35000 and 60000.',T(EMP,'Table: employees')),
     X('Business case','First order date per customer','Calculate tenure from the first order.','MIN per customer.','SELECT customer_id,\n       MIN(order_date) AS first_order,\n       DATEDIFF(\'2026-03-20\', MIN(order_date)) AS days_as_customer\nFROM orders GROUP BY customer_id;',['101 first ordered on 2026-01-05, so 74 days to 2026-03-20.'],'102: 61 days, 103: 27 days.',T(ORD,'Table: orders'))],
  e:[['Zeros are values','Use NULLIF(col, 0) to ignore them.'],['Not the row','As with MAX, only the value is returned.'],['NULL ignored','NULLs are skipped.'],['Empty set','Returns NULL.']],
  p:[P('Medium','The lowest salary.','MIN.','SELECT MIN(salary) FROM employees;','35000.',T(EMP,'Table: employees')),
     P('Interview','A minimum shows 0 although no real value is 0. What do you do?','Placeholders.','Treat 0 as missing with MIN(NULLIF(col,0)), or filter WHERE col > 0.','Say why zeros are values.')],
  q:[Q('Basic','What does MIN return?','The smallest non-NULL value or earliest date.',{ f:[['Does it ignore zeros?','No.']] }),
     Q('Scenario','Earliest purchase date per customer.','MIN(order_date) with GROUP BY customer_id.',{ t:'It gives the first order date but not the order id.' })],
  r:RT(['Need','Write'],[['Lowest','`MIN(x)`'],['Earliest','`MIN(date)`'],['Ignore zeros','`MIN(NULLIF(x, 0))`'],['Per group','`GROUP BY`']]), rel:['max-sql','group-by','nullif','row-number'] });

/* --- group-by --- */
DEEP['group-by'] = {
  level:'Intermediate',
  tldr:'GROUP BY turns many rows into **one row per group**, and aggregate functions summarise each group.',
  intuition:{ text:[
    'Imagine a pile of shop receipts. GROUP BY sorts them into piles by shop, and the aggregate functions tell you how many receipts are in each pile and how much they add up to.',
    'After grouping, a result row stands for a whole pile, not for a single receipt. That is why you can only show the grouping column or a summary of the pile.'
  ], analogy:'Sorting laundry into piles by colour, then counting and weighing each pile.' },
  how:[
    'FROM and JOIN build the working rows.',
    'WHERE removes rows you do not want, **before** grouping.',
    'GROUP BY puts rows with equal values in the grouping columns into one group (NULLs form one group).',
    'Aggregate functions are calculated inside each group.',
    'HAVING filters the groups.',
    'SELECT returns grouping columns and aggregates, then ORDER BY sorts the result.'
  ],
  diagrams:[
    { type:'flow', arrows:['group by dept_id','COUNT, SUM'], panels:[
      { title:'Rows', rows:[['name','dept','salary'],['Asha',10,50000],['Chitra',10,60000],['Bilal',20,40000],['Esha',20,40000],['Deepak',30,45000],['Farhan','NULL',35000]], hl:{1:'hit',2:'hit',3:'find',4:'find',5:'range',6:'miss'} },
      { title:'Groups (one colour each)', text:'10: 2 rows\n20: 2 rows\n30: 1 row\nNULL: 1 row' },
      { title:'One row per group', rows:[['dept','COUNT','SUM'],[10,2,110000],[20,2,80000],[30,1,45000],['NULL',1,35000]] }
    ], caption:'Six rows become four groups. NULL is a group of its own.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Monthly order summary', scenario:'Group by an expression, and use several aggregates at once.', table:T(ORD,'Table: orders'), task:'Return orders, total and average per month.',
      formula:'SELECT MONTH(order_date) AS month,\n       COUNT(*) AS orders,\n       SUM(amount) AS total,\n       ROUND(AVG(amount), 0) AS avg_amount\nFROM orders\nGROUP BY MONTH(order_date)\nORDER BY month;',
      steps:['MONTH(order_date) is computed for every row, and rows with the same month form a group.','Each month has two orders.'], table2:{ rows:[['month','orders','total','avg_amount'],[1,2,2000,1000],[2,2,2200,1100],[3,2,1500,750]], caption:'Result' }, result:'February is the biggest month, and March the weakest.' },
    { level:'Business case', title:'Salary bands', scenario:'HR wants to know how many people fall in each pay band and the average pay in each.', table:T(EMP,'Table: employees'), task:'Group by a CASE expression.',
      formula:'SELECT CASE\n         WHEN salary >= 50000 THEN \'High\'\n         WHEN salary >= 40000 THEN \'Medium\'\n         ELSE \'Low\'\n       END AS band,\n       COUNT(*) AS employees,\n       ROUND(AVG(salary)) AS avg_salary\nFROM employees\nGROUP BY band;',
      steps:['CASE labels each row with a band.','Rows with the same band form a group.','Medium holds Bilal, Deepak and Esha: (40000 + 45000 + 40000) / 3.'], table2:{ rows:[['band','employees','avg_salary'],['High',2,55000],['Medium',3,41667],['Low',1,35000]], caption:'Result' }, result:'Grouping by an expression is how analysts build bands, buckets and categories. MySQL lets GROUP BY use the alias; SQL Server needs the full expression.' }
  ],
  edge:[
    { t:'Every SELECT column must be grouped or aggregated', d:'`SELECT name, SUM(salary) ... GROUP BY dept_id` is invalid: which name represents the group? MySQL with ONLY_FULL_GROUP_BY rejects it. Older settings silently return an arbitrary name.' },
    { t:'NULL forms its own group', d:'Farhan\'s NULL department is a group of one. Add `WHERE dept_id IS NOT NULL` if you do not want it, or COALESCE it to a label.' },
    { t:'WHERE versus HAVING', d:'WHERE cuts rows before grouping. HAVING cuts groups after aggregation. Plain-column filters belong in WHERE because they reduce the work.' },
    { t:'Joins can inflate sums', d:'Joining a one-to-many table before grouping repeats rows, so sums become too large. Aggregate the many side first, or join on unique keys.' },
    { t:'Group by the key, not only the name', d:'Two customers named Asha would merge if you group by name only. Group by the id as well as the name.' },
    { t:'COUNT(*) versus COUNT(column)', d:'Inside a group, COUNT(*) counts rows and COUNT(column) counts non-NULL values. They differ whenever the column has NULLs.' }
  ],
  tiers:[
    { level:'Easy', q:'Count the orders of each customer.', table:T(ORD,'Table: orders'), hint:'GROUP BY customer_id with COUNT(*).', solution:'SELECT customer_id, COUNT(*) AS orders\nFROM orders\nGROUP BY customer_id;', explain:'Customer 101 has 3 orders, 102 has 2 and 103 has 1.' },
    { level:'Medium', q:'Average salary per department, leaving out employees without a department.', table:T(EMP,'Table: employees'), hint:'Filter the NULL group with WHERE before grouping.',
      solution:'SELECT dept_id, AVG(salary) AS avg_salary\nFROM employees\nWHERE dept_id IS NOT NULL\nGROUP BY dept_id;', explain:'Department 10 averages 55000, 20 averages 40000 and 30 averages 45000. Farhan is removed by WHERE before the groups are formed.' },
    { level:'Interview', q:'Which customers have an average order amount above the average of all orders?', table:T(ORD,'Table: orders'), hint:'HAVING can compare an aggregate with a subquery.',
      solution:'SELECT customer_id, AVG(amount) AS avg_amount\nFROM orders\nGROUP BY customer_id\nHAVING AVG(amount) > (SELECT AVG(amount) FROM orders);', explain:'The overall average is 950. Customer 101 averages 1100, customer 102 averages 850 and customer 103 averages 700, so only 101 qualifies.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does GROUP BY do and why must SELECT columns be in it?', a:'GROUP BY puts rows with the same values in the grouping columns into groups, and returns one row per group. Any other column in SELECT must be wrapped in an aggregate function, because the group contains many values and SQL cannot pick one.',
      structure:'Define it, explain one row per group, then give the rule and the reason for it.',
      follow:[ { q:'What happens when ONLY_FULL_GROUP_BY is off in MySQL?', a:'MySQL returns an arbitrary value from the group for the non-aggregated column, which makes results unreliable.' },
               { q:'How does GROUP BY treat NULL?', a:'All NULLs go into a single group.' } ] },
    { level:'Intermediate', q:'What is the logical order of WHERE, GROUP BY, HAVING and SELECT?', a:'FROM and JOIN, then WHERE, then GROUP BY, then HAVING, then SELECT, then ORDER BY and LIMIT. That is why WHERE cannot use aggregates and why aliases from SELECT are not available in WHERE.',
      follow:[ { q:'Can ORDER BY use an alias?', a:'Yes, because ORDER BY runs after SELECT.' } ] },
    { level:'Scenario', q:'After joining orders to order items, the revenue is much larger than expected. Why?', a:'The join repeated order rows once per item, so an order-level amount was added several times. I aggregate items to the order level first in a subquery or CTE, then join, or sum a column that belongs to the item level.',
      tradeoff:'Pre-aggregation is slightly more code but guarantees each fact is counted once.' }
  ],
  ref:{ headers:['Clause','Purpose','Can use aggregates?'], rows:[['WHERE','Filter rows before grouping','No'],['GROUP BY','Form groups','No'],['HAVING','Filter groups','Yes'],['SELECT','Choose output columns','Yes'],['ORDER BY','Sort the result','Yes']] },
  related:['having','count-sql','sum-sql','execution-order']
};

/* --- having --- */
DEEP['having'] = {
  level:'Intermediate',
  tldr:'WHERE filters **rows before** grouping. HAVING filters **groups after** aggregation.',
  intuition:{ text:[
    'Think of a nightclub with two checks. The first check (WHERE) happens at the door: individual people are turned away. The second check (HAVING) happens inside, when guests have already formed groups: whole tables are asked to leave based on the total they spent.',
    'Because HAVING runs after the groups exist, it can use totals, counts and averages. WHERE cannot, because at that point the groups have not been built yet.'
  ], analogy:'WHERE is the bouncer at the door. HAVING is the manager checking each table\'s bill.' },
  how:[
    'WHERE removes individual rows that fail the condition.',
    'GROUP BY forms groups from the remaining rows.',
    'Aggregates are calculated for each group.',
    'HAVING keeps only the groups whose aggregate meets the condition.'
  ],
  diagrams:[
    { type:'flow', arrows:['WHERE salary > 40000','GROUP BY dept + HAVING SUM > 100000'], panels:[
      { title:'All rows (6)', rows:[['name','dept','salary'],['Asha',10,50000],['Chitra',10,60000],['Bilal',20,40000],['Esha',20,40000],['Deepak',30,45000],['Farhan','NULL',35000]], hl:{3:'miss',4:'miss',6:'miss'} },
      { title:'After WHERE (3 rows)', rows:[['name','dept','salary'],['Asha',10,50000],['Chitra',10,60000],['Deepak',30,45000]] },
      { title:'After HAVING', rows:[['dept','SUM'],[10,110000]], hl:{1:'hit'}, note:'Dept 30 totals 45000, so its group is dropped.' }
    ], caption:'Rows are removed first, then groups.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'WHERE and HAVING together', scenario:'Use WHERE for the row rule and HAVING for the group rule.', table:T(EMP,'Table: employees'), task:'Among employees earning more than 40000, find departments with at least two people.',
      formula:'SELECT dept_id, COUNT(*) AS employees\nFROM employees\nWHERE salary > 40000\nGROUP BY dept_id\nHAVING COUNT(*) >= 2;', steps:['WHERE keeps Asha, Chitra and Deepak.','Department 10 has two of them, department 30 only one.'], table2:{ rows:[['dept_id','employees'],[10,2]], caption:'Result' }, result:'Only department 10 has two high earners.' },
    { level:'Business case', title:'Repeat, high-value customers', scenario:'Sales wants customers with more than one order and a total above 2000.', table:T(ORD,'Table: orders'), task:'Filter on two aggregates.',
      formula:'SELECT customer_id,\n       COUNT(*) AS orders,\n       SUM(amount) AS total\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 1\n   AND SUM(amount) > 2000;', steps:['Customer 101: 3 orders, total 3300.','Customer 102: 2 orders, but total only 1700.','Customer 103: 1 order.'], table2:{ rows:[['customer_id','orders','total'],[101,3,3300]], caption:'Result' }, result:'Only customer 101 passes both group conditions.' }
  ],
  edge:[
    { t:'An aggregate in WHERE is an error', d:'`WHERE SUM(amount) > 100` fails because the groups do not exist yet. Use HAVING.' },
    { t:'A plain condition in HAVING is slower', d:'`HAVING dept_id = 10` works in MySQL but forces the database to group every row first. Put it in WHERE.' },
    { t:'Aliases', d:'MySQL lets HAVING use a SELECT alias (`HAVING total > 2000`). SQL Server and standard SQL do not, so repeat the expression to stay portable.' },
    { t:'HAVING without GROUP BY', d:'Allowed: the whole table is one group. `SELECT COUNT(*) FROM t HAVING COUNT(*) > 5` returns a row only if the count exceeds 5.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show departments whose average salary is below 45000, ignoring employees without a department.', table:T(EMP,'Table: employees'), hint:'WHERE for the NULL rows, HAVING for the average.', solution:'SELECT dept_id, AVG(salary) AS avg_salary\nFROM employees\nWHERE dept_id IS NOT NULL\nGROUP BY dept_id\nHAVING AVG(salary) < 45000;', explain:'Only department 20 (average 40000) qualifies. Department 30 averages exactly 45000, which is not below it.' },
    { level:'Interview', q:'Find customers whose total spend is above the average total spend per customer.', table:T(ORD,'Table: orders'), hint:'Use a subquery that averages the customer totals.', solution:'SELECT customer_id, SUM(amount) AS total\nFROM orders\nGROUP BY customer_id\nHAVING SUM(amount) > (\n  SELECT AVG(t.total)\n  FROM (SELECT SUM(amount) AS total FROM orders GROUP BY customer_id) t\n);', explain:'Totals are 3300, 1700 and 700, with an average of 1900. Only customer 101 is above it.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between WHERE and HAVING?', a:'WHERE filters individual rows before grouping and cannot use aggregate functions. HAVING filters groups after aggregation and can. So WHERE is for conditions on columns, and HAVING is for conditions on totals, counts and averages.',
      structure:'One sentence each, mention order of execution, then a concrete example using both.',
      follow:[ { q:'Can you use both in one query?', a:'Yes, and it is the best practice: WHERE reduces the rows, then GROUP BY and HAVING work on a smaller set.' },
               { q:'Which is faster for a column condition?', a:'WHERE, because rows are discarded before the grouping work.' } ] },
    { level:'Intermediate', q:'Why does `SELECT dept_id, SUM(salary) FROM employees WHERE SUM(salary) > 100000 GROUP BY dept_id` fail?', a:'WHERE runs before grouping, so SUM(salary) does not exist yet. The condition must move to HAVING SUM(salary) > 100000.',
      follow:[ { q:'How does this relate to the order of execution?', a:'FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY. Aggregates are produced at the GROUP BY step, so only HAVING and later clauses can use them.' } ] },
    { level:'Scenario', q:'Find departments where more than half of the employees earn above 40000.', a:'Group by department and compare `SUM(salary > 40000)` with `COUNT(*) / 2` in HAVING. The boolean expression `salary > 40000` is 1 or 0 in MySQL, so its SUM counts the high earners.',
      tradeoff:'In SQL Server use `SUM(CASE WHEN salary > 40000 THEN 1 ELSE 0 END)`, which is portable.' }
  ],
  ref:{ headers:['','WHERE','HAVING'], rows:[['Filters','Rows','Groups'],['Runs','Before GROUP BY','After GROUP BY'],['Aggregates allowed','No','Yes'],['Use for','Column conditions','Totals, counts, averages']] },
  related:['group-by','where','execution-order','count-sql']
};
})();
