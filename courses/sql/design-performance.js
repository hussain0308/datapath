/* Datapath | SQL | Design and performance
 * Lessons in this file: normalization, execution-order, query-optimization, stored-procedures
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

/* --- normalization --- */
'normalization': {
  title:'Normalization (1NF, 2NF, 3NF)', tagline:'Organise tables to avoid repeated data.',
  prereq:['primary-key','foreign-key'],
  what:['Normalization splits data into related tables to remove repetition.','It prevents update, insert and delete problems.','The main steps are the **normal forms**: 1NF, 2NF, 3NF.'],
  why:['Cleaner, consistent data.','A standard interview topic.'],
  syntax:{ code:'1NF: one value per cell, no repeating groups\n2NF: 1NF + no partial dependency on part of a key\n3NF: 2NF + no dependency between non-key columns', parts:[['1NF','Each cell holds a single value; each row is unique.'],['2NF','Every non-key column depends on the **whole** primary key.'],['3NF','Non-key columns depend **only** on the key, not on each other.']] },
  points:['A customer\'s city stored on every order is repeated data.','Fix: put customers in their own table and link with a foreign key.','Normalized tables need joins to combine them.','**Denormalization** repeats data on purpose for faster reporting.','Analytics warehouses often use denormalized star schemas.'],
  mistakes:['Storing lists in one cell, such as "Excel, SQL".','Repeating customer details on every order row.','Over-normalizing a reporting table.'],
  example:{ title:'Splitting repeated customer data', scenario:'One orders table repeats the customer name and city on every row.',
    table:T({rows:[['order_id','customer','city','amount'],[1,'Asha','Pune',1200],[3,'Asha','Pune',1500],[6,'Asha','Pune',600]]},'orders (not normalized)'), task:'Remove the repetition.', formula:'customers(customer_id, name, city)\norders(order_id, customer_id, amount)',
    steps:['Asha and Pune are repeated on three rows.','If Asha moves, three rows must change, and one may be missed.','Store the customer once and reference it with customer_id.'],
    table2:{ rows:[['customer_id','name','city'],[101,'Asha','Pune']], caption:'customers (Asha stored once)' }, result:'Changing the city now means updating one row.' },
  practice:{ q:'A column skills holds the text \'Excel, SQL, Python\'. Which normal form does this break and how do you fix it?', hint:'One value per cell.', solution:'It breaks 1NF. Create a separate table employee_skills(emp_id, skill) with one row per skill.', explain:'Each cell should hold a single value, so every skill gets its own row.' },
  interview:[
    { level:'Basic', q:'What is normalization?', a:'Organising data into related tables to reduce repetition and avoid update anomalies.' },
    { level:'Intermediate', q:'Explain 1NF, 2NF and 3NF briefly.', a:'1NF: one value per cell and unique rows. 2NF: every non-key column depends on the whole key. 3NF: non-key columns depend only on the key, not on each other.' },
    { level:'Intermediate', q:'What is denormalization and why use it?', a:'Deliberately repeating data to avoid joins and speed up reads, common in reporting and data warehouses.' },
    { level:'Scenario', q:'Why are update anomalies a problem?', a:'If the same fact is stored in many rows, an update may change some and miss others, leaving inconsistent data.' }
  ],
  mcq:[
    { q:'1NF requires:', o:['One value per cell','No keys','Many tables','No NULLs'], a:0, why:'Atomic values.' },
    { q:'3NF removes dependencies between:', o:['Non-key columns','Keys and tables','Rows','Databases'], a:0, why:'Transitive dependencies.' },
    { q:'Denormalization is:', o:['Repeating data on purpose','Deleting data','Adding keys','Sorting'], a:0, why:'For read speed.' },
    { q:'Storing \'Excel, SQL\' in one cell breaks:', o:['1NF','2NF','3NF','None'], a:0, why:'Not atomic.' },
    { q:'A downside of normalization:', o:['More joins','Duplicates','Inconsistency','More columns per table'], a:0, why:'Data is spread across tables.' }
  ],
  recap:['Normalization removes repetition by splitting tables.','1NF atomic, 2NF whole key, 3NF only the key.','Warehouses often denormalize on purpose.']
},

/* --- execution-order --- */
'execution-order': {
  title:'Logical order of execution', tagline:'The order SQL really processes a query.',
  prereq:['where','group-by','having'],
  what:['You write SELECT first, but the database processes it **last**.','The logical order is FROM, JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT.','It explains many "why does this fail?" errors.'],
  why:['Why WHERE cannot use aliases or aggregates.','A very common interview question.'],
  syntax:{ code:'1 FROM / JOIN\n2 WHERE\n3 GROUP BY\n4 HAVING\n5 SELECT (and window functions)\n6 DISTINCT\n7 ORDER BY\n8 LIMIT', parts:[['FROM / JOIN','Builds the working set of rows.'],['WHERE / GROUP BY / HAVING','Filter rows, form groups, filter groups.'],['SELECT','Calculates columns and aliases.'],['ORDER BY / LIMIT','Sort and cut the final result.']] },
  points:['WHERE runs before SELECT, so it cannot use **aliases**.','WHERE runs before GROUP BY, so it cannot use **aggregates**.','ORDER BY runs after SELECT, so it **can** use aliases.','Window functions run in SELECT, after WHERE and GROUP BY.','Optimisers may reorder work physically, but results follow this logic.'],
  mistakes:['Using an alias in WHERE.','An aggregate in WHERE.','Expecting LIMIT to run before ORDER BY.'],
  example:{ title:'Why an alias fails in WHERE', scenario:'You try to filter on annual salary.',
    table:T({rows:[['Step','Clause']]},'Logical steps'), task:'Spot the problem.', formula:'SELECT name, salary * 12 AS annual\nFROM employees\nWHERE annual > 500000;   -- error',
    steps:['WHERE runs at step 2, before SELECT creates the alias at step 5.','At step 2 the alias annual does not exist yet.','Fix: repeat the expression, or use a derived table or CTE.'],
    table2:{ rows:[['Order','Clause','Can use aliases?'],[1,'FROM / JOIN','n/a'],[2,'WHERE','No'],[3,'GROUP BY','No (MySQL allows)'],[4,'HAVING','MySQL allows'],[5,'SELECT','Creates them'],[6,'ORDER BY','Yes'],[7,'LIMIT','n/a']], caption:'Execution order' }, result:'WHERE salary * 12 > 500000 works, and so does a CTE.' },
  practice:{ q:'In what order are WHERE, HAVING and GROUP BY processed?', hint:'Rows are filtered, then grouped, then groups are filtered.', solution:'WHERE, then GROUP BY, then HAVING', explain:'WHERE cuts rows first, GROUP BY builds groups, and HAVING filters those groups.' },
  interview:[
    { level:'Basic', q:'What is the logical order of execution of a SELECT?', a:'FROM and JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, then LIMIT.' },
    { level:'Intermediate', q:'Why can ORDER BY use an alias but WHERE cannot?', a:'ORDER BY runs after SELECT, when the alias exists. WHERE runs before SELECT.' },
    { level:'Intermediate', q:'Why can you not filter on a window function in WHERE?', a:'Window functions are computed at the SELECT step, after WHERE. I filter in an outer query or CTE.' },
    { level:'Scenario', q:'A query with HAVING on a plain column is slow. How do you improve it?', a:'Move plain-column conditions to WHERE, so rows are removed before grouping.' }
  ],
  mcq:[
    { q:'Which runs first?', o:['FROM','SELECT','ORDER BY','HAVING'], a:0, why:'The data source comes first.' },
    { q:'Which runs before GROUP BY?', o:['WHERE','HAVING','ORDER BY','LIMIT'], a:0, why:'Rows are filtered first.' },
    { q:'Can WHERE use a SELECT alias?', o:['No','Yes','Only in MySQL 8','Only with LIMIT'], a:0, why:'The alias does not exist yet.' },
    { q:'Can ORDER BY use a SELECT alias?', o:['Yes','No','Only numbers','Only with HAVING'], a:0, why:'It runs after SELECT.' },
    { q:'LIMIT runs:', o:['Last','First','After WHERE only','Never'], a:0, why:'It cuts the final result.' }
  ],
  recap:['Logical order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.','Aliases exist only after SELECT.','Aggregates exist only after GROUP BY.']
},

/* --- query-optimization --- */
'query-optimization': {
  title:'Query optimization', tagline:'Practical ways to make queries faster.',
  prereq:['indexes','execution-order'],
  what:['Optimization means getting the same result with less work.','Start by measuring with EXPLAIN.','Most gains come from a few habits.'],
  why:['Slow queries waste time and money.','Interviewers ask "how would you speed this query up?".'],
  syntax:{ code:'EXPLAIN SELECT ...;', parts:[['type','How rows are found. ALL is a full scan; ref and range use an index.'],['key','The index used, if any.'],['rows','Estimated rows examined.']] },
  points:['Select **only needed columns**, not `*`.','Filter early with WHERE, on indexed columns.','Do not wrap indexed columns in functions: use ranges.','Avoid a leading `%` in LIKE.','Join on indexed key columns of matching types.','Prefer EXISTS over IN for large subqueries, and UNION ALL over UNION when duplicates do not matter.','Use LIMIT when you only need a few rows.'],
  mistakes:['Optimizing without EXPLAIN.','Indexing everything.','Premature tuning of small tables.'],
  example:{ title:'Rewriting a slow date filter', scenario:'This query ignores the index on order_date.',
    table:withHl(ORD,{'C2:C7':'range'},'Table: orders (order_date is indexed)'), task:'Make it index-friendly.', formula:'-- slow\nSELECT * FROM orders WHERE YEAR(order_date) = 2026;\n\n-- faster\nSELECT order_id, amount FROM orders\nWHERE order_date >= \'2026-01-01\'\n  AND order_date <  \'2027-01-01\';',
    steps:['YEAR(order_date) forces the database to compute YEAR for every row.','A date range lets it use the index.','Selecting only needed columns reduces the data read.'],
    table2:{ rows:[['Version','type','key'],['YEAR(order_date) = 2026','ALL','NULL'],['Date range','range','idx_order_date']], caption:'EXPLAIN summary (illustrative)' }, result:'The range query reads only the matching part of the index.' },
  practice:{ q:'Name three changes that speed up SELECT * FROM orders WHERE customer_id = 101 ORDER BY order_date on a huge table.', hint:'Index, columns, order.', solution:'1. Index (customer_id, order_date)\n2. Select only the needed columns\n3. Add LIMIT if only recent rows are needed', explain:'The composite index finds the customer\'s rows already sorted, so no separate sort is needed.' },
  interview:[
    { level:'Basic', q:'How do you find out why a query is slow?', a:'I run EXPLAIN to see how the database executes it: full scans, missing indexes and large row estimates.' },
    { level:'Intermediate', q:'List common optimization techniques.', a:'Select only needed columns, filter early, add suitable indexes, avoid functions on indexed columns, avoid leading wildcards, and join on indexed keys.' },
    { level:'Intermediate', q:'UNION or UNION ALL for speed?', a:'UNION ALL, when duplicates are impossible or acceptable, because UNION adds a distinct step.' },
    { level:'Scenario', q:'A report query takes minutes. What is your plan?', a:'Check EXPLAIN, add or fix indexes, reduce columns and rows early, pre-aggregate in a summary table or CTE, and test with realistic data.' }
  ],
  mcq:[
    { q:'First step in tuning?', o:['Run EXPLAIN','Add many indexes','Rewrite everything','Use SELECT *'], a:0, why:'Measure first.' },
    { q:'EXPLAIN type ALL means:', o:['Full table scan','Index lookup','Cached','Joined'], a:0, why:'Every row is read.' },
    { q:'Which is index-friendly?', o:['A date range','YEAR(col) = 2026','LIKE \'%x\'','UPPER(col)'], a:0, why:'No function on the column.' },
    { q:'Prefer UNION ALL when:', o:['Duplicates do not matter','Duplicates must go','Tables differ','Columns differ'], a:0, why:'It skips the distinct step.' },
    { q:'Select only needed columns because:', o:['Less data is read','Keys are created','It sorts rows','It adds rows'], a:0, why:'Smaller results are faster.' }
  ],
  recap:['Measure with EXPLAIN before changing anything.','Select less, filter early, index wisely, avoid functions on indexed columns.','UNION ALL and EXISTS are often cheaper.']
},

/* --- stored-procedures --- */
'stored-procedures': {
  title:'Stored procedures', tagline:'Save a block of SQL on the server and call it by name.',
  prereq:['views','transactions'],
  what:['A stored procedure is saved SQL code with a name and optional parameters.','You run it with CALL.','It can contain several statements and logic.'],
  why:['Reuse logic, reduce repeated code and control access.','Often asked how procedures differ from functions and views.'],
  syntax:{ code:'DELIMITER //\nCREATE PROCEDURE proc_name (IN param INT)\nBEGIN\n  SELECT ... WHERE col = param;\nEND //\nDELIMITER ;\n\nCALL proc_name(101);', parts:[['IN param','An input parameter.'],['BEGIN ... END','The body.'],['DELIMITER','Lets the client accept semicolons inside the body.'],['CALL','Runs the procedure.']] },
  points:['Parameters can be IN, OUT or INOUT.','A procedure can change data; a function returns one value and is used inside queries.','Procedures can contain transactions and loops.','They reduce network traffic by running on the server.','Business logic in procedures can be harder to version and test.'],
  mistakes:['Forgetting DELIMITER in the MySQL client.','Putting too much logic in procedures.','Confusing procedures with functions.'],
  example:{ title:'Orders of one customer', scenario:'You often need all orders of a customer.',
    table:withHl(ORD,{'B2':'find','B4':'find','B7':'find'},'Table: orders'), task:'Create and call a procedure.', formula:'DELIMITER //\nCREATE PROCEDURE get_orders (IN cid INT)\nBEGIN\n  SELECT order_id, order_date, amount\n  FROM orders\n  WHERE customer_id = cid;\nEND //\nDELIMITER ;\n\nCALL get_orders(101);',
    steps:['The procedure takes one input, cid.','CALL get_orders(101) runs the SELECT with 101.'],
    table2:{ rows:[['order_id','order_date','amount'],[1,'2026-01-05',1200],[3,'2026-02-03',1500],[6,'2026-03-15',600]], caption:'Result of CALL get_orders(101)' }, result:'The three orders of customer 101.' },
  practice:{ q:'What is the difference between a stored procedure and a view?', hint:'Parameters and logic.', solution:'A view is a saved SELECT that you query like a table. A procedure is a block of code with parameters that you CALL, and it can change data.', explain:'Views cannot take parameters, and procedures are not used inside a SELECT.' },
  interview:[
    { level:'Basic', q:'What is a stored procedure?', a:'A named block of SQL stored in the database that can take parameters and is run with CALL.' },
    { level:'Intermediate', q:'Procedure vs function?', a:'A function returns a value and can be used inside a query. A procedure is called on its own, can return result sets or OUT values, and can change data.' },
    { level:'Intermediate', q:'Advantages of stored procedures?', a:'Reuse, less repeated SQL, faster execution on the server, and controlled access to data.' },
    { level:'Scenario', q:'Why do you need DELIMITER in the MySQL command line?', a:'The client treats a semicolon as the end of a statement. Changing the delimiter lets the whole procedure body, which contains semicolons, be sent as one statement.' }
  ],
  mcq:[
    { q:'How do you run a procedure?', o:['CALL','RUN','EXEC only','SELECT'], a:0, why:'CALL name(args).' },
    { q:'Which parameter type passes a value in?', o:['IN','OUT','RETURN','PUT'], a:0, why:'IN is input.' },
    { q:'A function differs because it:', o:['Returns a value usable in queries','Takes no parameters','Cannot be stored','Is a view'], a:0, why:'Functions return one value.' },
    { q:'Why DELIMITER?', o:['The body contains semicolons','To rename tables','To sort','To commit'], a:0, why:'The client needs a different statement end.' },
    { q:'CALL get_orders(101) returns how many rows?', o:['3','6','1','0'], a:0, why:'Customer 101 has three orders.' }
  ],
  recap:['A stored procedure is named, saved SQL run with CALL.','It can take parameters and change data.','Functions return values; views are saved SELECTs.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- normalization --- */
DEEP['normalization'] = {
  level:'Intermediate',
  tldr:'Normalization splits data into related tables so each fact is stored **once**, which prevents inconsistencies. Warehouses often denormalize on purpose for speed.',
  intuition:{ text:[
    'Imagine a spreadsheet where every order row repeats the customer\'s name and city. If Asha moves from Pune to Mumbai, you must correct every one of her rows. Miss one, and the data contradicts itself.',
    'Normalization fixes this by storing the customer once in a customers table and referring to it from orders by id. Each fact lives in exactly one place, so it can only be wrong in one place.'
  ], analogy:'A contact in your phone: one entry used everywhere, instead of retyping the number in every message.' },
  how:[
    '**1NF**: every cell holds one value, and every row is unique (no lists in cells, no repeating columns).',
    '**2NF**: every non-key column depends on the **whole** primary key (matters for composite keys).',
    '**3NF**: non-key columns depend only on the key, not on each other.',
    'Split tables where a group of columns depends on something other than the key.',
    'Link the new tables with primary and foreign keys.'
  ],
  diagrams:[
    { type:'flow', arrows:['split'], panels:[
      { title:'One table (repeats)', rows:[['order_id','customer','city','amount'],[1,'Asha','Pune',1200],[3,'Asha','Pune',1500],[6,'Asha','Pune',600]], hl:{1:'miss',2:'miss',3:'miss'} },
      { title:'customers', rows:[['customer_id','name','city'],[101,'Asha','Pune']], hl:{1:'hit'} },
      { title:'orders', rows:[['order_id','customer_id','amount'],[1,101,1200],[3,101,1500],[6,101,600]] }
    ], caption:'Asha and Pune are now stored once.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'1NF: a list in a cell', scenario:'An employee table stores skills as the text "Excel, SQL, Python" in one cell.', table:withHl({rows:[['emp_id','name','skills'],[1,'Asha','Excel, SQL, Python']]},{'C2':'miss'},'Not in 1NF'), task:'Normalise it.', formula:'employee_skills(emp_id, skill)\n  (1, \'Excel\'), (1, \'SQL\'), (1, \'Python\')', steps:['A cell must hold a single value.','Each skill becomes its own row in a linking table.'], table2:{ rows:[['emp_id','skill'],[1,'Excel'],[1,'SQL'],[1,'Python']], caption:'employee_skills' }, result:'Searching for everyone who knows SQL is now a simple WHERE, not a LIKE on text.' },
    { level:'Business case', title:'Normalise for correctness, denormalise for reporting', scenario:'The transaction system uses normalised tables, but the BI team builds a wide reporting table.', table:T({rows:[['Layer','Design']]},'Two layers'), task:'Choose the design for each layer.', formula:'OLTP (orders system):  customers, orders, products (3NF)\nReporting layer:       fact_sales + dim_customer + dim_product (star schema)',
      steps:['The transaction system needs correctness and fast small writes, so it is normalised.','The reporting layer needs fast reads with few joins, so it repeats descriptive data in dimension tables.'], result:'Both designs are right for their purpose. Naming the purpose is the interview answer.' }
  ],
  edge:[
    { t:'Update anomalies', d:'Repeated data can be updated in some rows and not others, producing contradictions.' },
    { t:'Insert and delete anomalies', d:'You cannot add a customer who has no orders yet, or deleting the last order loses the customer, if both live in one table.' },
    { t:'Over-normalisation', d:'Splitting everything into tiny tables makes simple queries need many joins. Stop when the design is clear and consistent.' },
    { t:'Denormalisation is deliberate', d:'Data warehouses repeat data for speed. It is acceptable when the source is controlled and the repeated data is refreshed.' },
    { t:'Keys matter', d:'Normal forms depend on the choice of primary key. Check that the key really identifies the row.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'An order_items table has the key (order_id, product_id) and the columns product_name and quantity. Which normal form is broken and how do you fix it?', hint:'product_name depends on only part of the key.', solution:'2NF is broken: product_name depends only on product_id, not on the whole key.\nFix: move product_name into a products table (product_id, product_name), and keep order_items (order_id, product_id, quantity).', explain:'A partial dependency is the signature of a 2NF violation.' },
    { level:'Interview', q:'An employees table has dept_id, dept_name and dept_location. Which normal form does it break and what do you do?', hint:'Non-key columns depending on another non-key column.', solution:'3NF: dept_name and dept_location depend on dept_id, which is not the key of employees.\nFix: create departments (dept_id, dept_name, dept_location) and keep only dept_id in employees as a foreign key.', explain:'This is a transitive dependency. It is also the structure used throughout this course.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is normalization and why do we do it?', a:'Normalization organises data into related tables so each fact is stored once. It reduces redundancy and prevents update, insert and delete anomalies, which keeps the data consistent.',
      structure:'Define, give the customer-repeated-on-every-order example, then name the normal forms.',
      follow:[ { q:'Explain 1NF, 2NF and 3NF in one line each.', a:'1NF: one value per cell. 2NF: every non-key column depends on the whole key. 3NF: non-key columns depend only on the key.' } ] },
    { level:'Intermediate', q:'What is denormalization and when is it appropriate?', a:'Deliberately repeating data to avoid joins and speed up reads, as in reporting tables and data warehouses. It is appropriate when read performance matters more than update simplicity, and the data is loaded in a controlled way.',
      tradeoff:'Faster, simpler queries against a higher risk of inconsistency and more storage.' },
    { level:'Scenario', q:'You are asked to design tables for an online shop. What do you create?', a:'customers, products, orders and order_items (a linking table with order_id, product_id, quantity and price at the time of sale). Orders reference customers, items reference orders and products, all with primary and foreign keys.' }
  ],
  ref:{ headers:['Form','Rule'], rows:[['1NF','One value per cell, unique rows'],['2NF','Whole key determines each non-key column'],['3NF','Only the key determines non-key columns'],['Denormalised','Repeats data for fast reads']] },
  related:['primary-key','foreign-key','create-table','constraints']
};

/* --- execution-order --- */
DEEP['execution-order'] = {
  level:'Intermediate',
  tldr:'SQL is written starting with SELECT, but processed in a different order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.',
  intuition:{ text:[
    'You write a query as a sentence: "select these columns from this table where ...". The database does not read it that way. It first builds the data (FROM and JOIN), then filters rows (WHERE), groups them, filters the groups, and only then decides which columns to show.',
    'Once you know this order, many confusing errors become obvious: an alias cannot be used in WHERE because it is created later, and an aggregate cannot be used in WHERE because the groups do not exist yet.'
  ], analogy:'A factory line: raw material (FROM), quality check (WHERE), packing (GROUP BY), box check (HAVING), labelling (SELECT), sorting (ORDER BY), shipping (LIMIT).' },
  how:[
    '**FROM / JOIN**: build the working set of rows.',
    '**WHERE**: remove rows that fail the condition.',
    '**GROUP BY**: form groups from the remaining rows.',
    '**HAVING**: remove groups that fail a condition on aggregates.',
    '**SELECT**: calculate columns, aliases and window functions.',
    '**DISTINCT, ORDER BY, LIMIT**: remove duplicates, sort, then cut the result.'
  ],
  diagrams:[
    { type:'flow', arrows:['','','','','',''], panels:[
      { title:'1', text:'FROM / JOIN' },{ title:'2', text:'WHERE' },{ title:'3', text:'GROUP BY' },{ title:'4', text:'HAVING' },{ title:'5', text:'SELECT' },{ title:'6', text:'ORDER BY, LIMIT' }
    ], caption:'You write SELECT first, but it runs fifth.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Why ORDER BY can use an alias', scenario:'ORDER BY runs after SELECT, so the alias already exists.', table:T(EMP,'Table: employees'), task:'Sort by the annual salary alias.',
      formula:'SELECT name, salary * 12 AS annual\nFROM employees\nORDER BY annual DESC\nLIMIT 3;', steps:['SELECT creates `annual` at step 5.','ORDER BY at step 6 can use it.','LIMIT cuts the sorted result to 3 rows.'], table2:{ rows:[['name','annual'],['Chitra',720000],['Asha',600000],['Deepak',540000]], caption:'Result' }, result:'The query works because the alias exists by the time ORDER BY runs.' },
    { level:'Business case', title:'Debugging a failing report query', scenario:'An analyst writes this and gets "Unknown column" and "Invalid use of group function" errors.', table:T(ORD,'Table: orders'), task:'Fix both errors using the order of execution.',
      formula:'-- broken\nSELECT customer_id, SUM(amount) AS total\nFROM orders\nWHERE total > 1500\nGROUP BY customer_id;\n\n-- fixed\nSELECT customer_id, SUM(amount) AS total\nFROM orders\nGROUP BY customer_id\nHAVING SUM(amount) > 1500;', steps:['WHERE runs before SELECT and before grouping, so neither the alias nor the aggregate exist there.','HAVING runs after grouping, so the aggregate is available.'], table2:{ rows:[['customer_id','total'],[101,3300],[102,1700]], caption:'Result' }, result:'Customers 101 and 102 are returned.' }
  ],
  edge:[
    { t:'Aliases in WHERE', d:'Not allowed, because WHERE runs before SELECT creates the alias. Repeat the expression, or use a CTE.' },
    { t:'MySQL leniency', d:'MySQL allows aliases in GROUP BY and HAVING as an extension. SQL Server and standard SQL do not, so queries may not port.' },
    { t:'Window functions', d:'They are computed in the SELECT step, so you cannot filter on them in WHERE. Use a CTE.' },
    { t:'LIMIT after ORDER BY', d:'LIMIT cuts the sorted result. Without ORDER BY, which rows you get is undefined.' },
    { t:'Logical versus physical', d:'The optimizer may reorder work, for example filtering earlier, but the result always matches the logical order.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Why does `SELECT name, salary * 12 AS annual FROM employees WHERE annual > 500000;` fail, and how do you fix it?', table:T(EMP,'Table: employees'), hint:'Which clause creates the alias?', solution:'WHERE runs before SELECT, so annual does not exist yet.\nFix: WHERE salary * 12 > 500000, or wrap the query in a CTE and filter in the outer query.', explain:'The condition salary * 12 > 500000 is equivalent to salary > 41666.67, which keeps Asha and Chitra and Deepak.' },
    { level:'Interview', q:'In what order do these clauses run: ORDER BY, HAVING, FROM, GROUP BY, SELECT, WHERE, LIMIT?', hint:'Build, filter, group, filter groups, show, sort, cut.', solution:'FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT', explain:'Be ready to add that JOIN belongs with FROM, DISTINCT comes after SELECT, and window functions are evaluated in the SELECT step.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the order of execution of a SQL query?', a:'FROM and JOIN, then WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY and finally LIMIT.',
      follow:[ { q:'Why can ORDER BY use an alias but WHERE cannot?', a:'ORDER BY runs after SELECT, when the alias exists. WHERE runs before SELECT.' } ] },
    { level:'Intermediate', q:'Why can WHERE not use aggregate functions?', a:'WHERE filters rows before grouping, so aggregates have not been calculated. HAVING runs after GROUP BY and can use them.',
      structure:'Name the order, then say what exists at each step.' },
    { level:'Scenario', q:'A query filters on a window function and fails. What do you do?', a:'Window functions are evaluated in SELECT, after WHERE. I put the query with the window function in a CTE or derived table, and filter in the outer query.' }
  ],
  ref:{ headers:['Step','Clause','Can use aliases?','Can use aggregates?'], rows:[['1','`FROM / JOIN`','n/a','No'],['2','`WHERE`','No','No'],['3','`GROUP BY`','Not in standard SQL','No'],['4','`HAVING`','Not in standard SQL','Yes'],['5','`SELECT`','Creates them','Yes'],['6','`ORDER BY`','Yes','Yes']] },
  related:['group-by','having','where','window-intro']
};

/* --- query-optimization --- */
DEEP['query-optimization'] = {
  level:'Advanced',
  tldr:'Measure first with EXPLAIN, then fix the biggest cost: read fewer columns and rows, use indexes, and avoid functions on indexed columns.',
  intuition:{ text:[
    'Slow queries are rarely mysterious. They do too much work: they read too many rows, too many columns, or read them in a way indexes cannot help. The job is to find out which, and reduce it.',
    'Guessing wastes time. EXPLAIN tells you what the database plans to do: which indexes it uses, how many rows it expects to read. Optimisation is a loop: measure, change one thing, measure again.'
  ], analogy:'Finding a book: use the catalogue (index) instead of walking every shelf, and take only the page you need.' },
  how:[
    'Run `EXPLAIN` on the query and read `type`, `key` and `rows`.',
    '`type = ALL` means a full table scan: check for a missing index or a function on the column.',
    'Select only the needed columns (no `SELECT *`) and filter early with WHERE.',
    'Rewrite conditions so the indexed column stands alone (`order_date >= x`, not `YEAR(order_date) = y`).',
    'Join on indexed keys with matching types.',
    'Re-run EXPLAIN and compare the row estimates and the actual runtime.'
  ],
  diagrams:[
    { type:'flow', arrows:['rewrite and index'], panels:[
      { title:'Before', rows:[['type','key','rows'],['ALL','NULL','20,000,000']], hl:{1:'miss'}, note:'Full scan; the function on the column blocks the index.' },
      { title:'After', rows:[['type','key','rows'],['range','idx_order_date','1,200,000']], hl:{1:'hit'}, note:'Index range scan on the date range.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'EXISTS instead of a large IN list', scenario:'Customers who have orders, on big tables.', table:T(CUST,'Table: customers'), task:'Prefer EXISTS with an indexed link column.',
      formula:'-- often slower on huge lists\nSELECT name FROM customers\nWHERE customer_id IN (SELECT customer_id FROM orders);\n\n-- usually fine and stops at the first match\nSELECT name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);', steps:['EXISTS can stop at the first matching order for each customer.','Index orders.customer_id so each probe is a quick lookup.'], result:'Modern optimizers often rewrite one into the other, so always confirm with EXPLAIN on your data.' },
    { level:'Business case', title:'Tuning a slow monthly report', scenario:'A report totals sales by customer for the year and takes 40 seconds.', table:T({rows:[['Step','Change']]},'Tuning log'), task:'Apply the checklist.', formula:'-- before\nSELECT * FROM orders WHERE YEAR(order_date) = 2026;\n\n-- after: needed columns, range, indexed\nSELECT customer_id, SUM(amount) AS total\nFROM orders\nWHERE order_date >= \'2026-01-01\' AND order_date < \'2027-01-01\'\nGROUP BY customer_id;\n-- plus: CREATE INDEX idx_orders_date_cust ON orders (order_date, customer_id);',
      steps:['Replace SELECT * with the two columns needed.','Replace the YEAR() function with a date range.','Add a composite index that covers the filter and the grouping column.'], table2:{ rows:[['Step','Time'],['Original','40 s'],['After range and columns','9 s'],['After covering index','0.6 s']], caption:'Illustrative result' }, result:'Each change is measured, so you know which one helped.' }
  ],
  edge:[
    { t:'Measure before and after', d:'Without EXPLAIN and timing, you do not know whether a change helped. Test with realistic data volumes.' },
    { t:'Indexes are not free', d:'They speed reads and slow writes. Add the ones the key queries need.' },
    { t:'Functions on columns', d:'`UPPER(col)`, `DATE(col)`, `col + 0` stop index use. Compare the raw column with a computed value instead.' },
    { t:'Implicit conversions', d:'Comparing a text column with a number, or mismatched collations in joins, can disable indexes.' },
    { t:'OFFSET pagination', d:'`LIMIT 10 OFFSET 1000000` reads and discards a million rows. Use keyset pagination (`WHERE id > last_id LIMIT 10`).' },
    { t:'Premature optimisation', d:'Small tables rarely need tuning. Focus on the queries that actually run slowly or often.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List five common causes of a slow query and the fix for each.', hint:'Think rows, columns, indexes, functions, joins.', solution:'1. SELECT * : select needed columns.\n2. No index on filter/join columns: add one.\n3. Function on an indexed column: rewrite as a range.\n4. Leading wildcard LIKE: use a prefix search or full-text.\n5. Joining unindexed or mismatched keys: index and align types.', explain:'Each cause has a measurable symptom in EXPLAIN (type ALL, rows large).' },
    { level:'Interview', q:'Walk me through how you would diagnose a query that takes minutes.', hint:'A repeatable process.', solution:'1. Reproduce and time it on realistic data.\n2. Run EXPLAIN: find full scans, large row counts, filesorts.\n3. Check indexes on WHERE, JOIN and ORDER BY columns.\n4. Remove functions on columns, reduce selected columns.\n5. Test rewrites (EXISTS vs IN, pre-aggregation) and indexes one at a time.\n6. Re-measure, document the result.', explain:'A calm, ordered process shows seniority more than any single trick.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you make a slow query faster?', a:'First I look at the execution plan with EXPLAIN to see how it runs. Then I add missing indexes on columns used in WHERE, JOIN and ORDER BY, select only the needed columns, filter early, and avoid functions on indexed columns.',
      structure:'Measure first, then fix the biggest cost, then measure again.',
      follow:[ { q:'What does type = ALL mean in EXPLAIN?', a:'A full table scan: every row is read.' } ] },
    { level:'Intermediate', q:'Why can an index on a column fail to speed up a query?', a:'A function or calculation is applied to the column, the condition has a leading wildcard, the types do not match, the column has low selectivity, or the optimizer judges a scan cheaper.',
      tradeoff:'Over-indexing slows writes, so I verify the benefit with EXPLAIN before keeping an index.' },
    { level:'Scenario', q:'A dashboard query is slow because it aggregates 100 million rows every time. What are your options?', a:'Pre-aggregate into a summary table updated on a schedule, add a covering index, partition by date, or cache the result. The right choice depends on freshness needs and write load.' }
  ],
  ref:{ headers:['Symptom in EXPLAIN','Likely fix'], rows:[['`type = ALL`','Add index or rewrite the condition'],['Huge `rows`','Filter earlier, better index'],['`Using filesort`','Index covering the ORDER BY'],['`Using temporary`','Rewrite GROUP BY, index the columns']] },
  related:['indexes','execution-order','exists-sql','window-intro']
};

/* --- stored-procedures --- */
D('stored-procedures',{ l:'Intermediate to Advanced', t:'A stored procedure is named, saved SQL you run with CALL. It can take parameters, change data and contain logic.',
  i:['Some tasks are repeated with different inputs: fetch the orders of customer X, close the month. A stored procedure saves the logic in the database and takes parameters.','It differs from a view, which is a saved SELECT without parameters, and from a function, which returns a value usable inside a query.'], a:'A recipe card stored in the kitchen: you provide the ingredients.',
  h:['Change the delimiter in the client (`DELIMITER //`).','`CREATE PROCEDURE name (IN param type) BEGIN ... END`.','Reset the delimiter.','Run it with `CALL name(args)`.'],
  d:[FL(['CALL get_orders(101)'],[{ title:'Procedure', text:'SELECT order_id, amount\nFROM orders\nWHERE customer_id = cid' },{ title:'Result', rows:[['order_id','amount'],[1,1200],[3,1500],[6,600]] }])],
  x:[X('Variation','An OUT parameter','Return a total.','Use OUT.','CREATE PROCEDURE total_for (IN cid INT, OUT t DECIMAL(10,2))\nBEGIN\n  SELECT SUM(amount) INTO t FROM orders WHERE customer_id = cid;\nEND;',['The OUT value is read after CALL.'],'3300 for customer 101.'),
     X('Business case','A month-end routine','Several statements must run together.','Wrap in a transaction.','CREATE PROCEDURE close_month ()\nBEGIN\n  START TRANSACTION;\n  INSERT INTO monthly_totals SELECT ...;\n  UPDATE orders SET closed = 1 WHERE ...;\n  COMMIT;\nEND;',['The steps are saved and run as one.'],'One CALL replaces a fragile script.')],
  e:[['DELIMITER','The client treats ; as the end of a statement. Change it for the body.'],['Business logic in the database','Hard to version, test and debug. Keep it deliberate.'],['Permissions','EXECUTE privilege controls who can call it.'],['Portability','Syntax differs across databases.']],
  p:[P('Medium','Procedure returning a customer\'s orders.','IN parameter.','CREATE PROCEDURE get_orders (IN cid INT) BEGIN SELECT * FROM orders WHERE customer_id = cid; END;','CALL get_orders(101).'),
     P('Interview','Procedure versus function?','Return value.','A function returns a value and can be used in a query. A procedure is called with CALL, can return result sets and change data.','Add views.')],
  q:[Q('Basic','What is a stored procedure?','Named SQL code stored in the database and run with CALL.',{ f:[['Parameter types?','IN, OUT and INOUT.']] }),
     Q('Scenario','When would you avoid procedures?','When logic needs version control, testing and portability. Keep it in application code or SQL scripts under source control.',{ t:'Procedures help performance and access control.' })],
  r:RT(['Part','Role'],[['`DELIMITER //`','Allow ; in the body'],['`IN / OUT`','Parameters'],['`CALL`','Run it'],['Alternative','Function, view']]), rel:['views','transactions','create-table','insert-into'] });
})();
