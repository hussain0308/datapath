/* Datapath | SQL | Joins
 * Lessons in this file: inner-join, left-join, right-join, full-outer-join, cross-join, self-join, multiple-joins
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

/* --- inner-join --- */
'inner-join': {
  title:'INNER JOIN', tagline:'Return only the rows that match in both tables.',
  prereq:['foreign-key','aliases'],
  what:['A join combines rows from two tables using a matching column.','INNER JOIN keeps only rows that have a match in **both** tables.','Rows without a match are left out.'],
  why:['Real data lives in many tables.','The most important SQL topic for analysts.'],
  syntax:{ code:'SELECT columns\nFROM table1 a\nINNER JOIN table2 b\n  ON a.key = b.key;', parts:[['ON a.key = b.key','The matching condition.'],['INNER','Optional word; JOIN alone means INNER JOIN.']] },
  points:['Only matching rows appear.','Rows with NULL keys do not match anything.','Use table aliases and prefix columns: `e.name`.','A one-to-many match repeats the parent row.','Join on keys, usually primary key = foreign key.','The ON condition must not be forgotten, or you get a cross join.'],
  mistakes:['Forgetting the ON clause.','Joining on the wrong columns.','Not realising that unmatched rows disappear.'],
  example:{ title:'Employees with department names', scenario:'You want each employee with the name of their department.',
    table:withHl(EMP,{'C2:C7':'range'},'Table: employees'), task:'Join employees to departments.', formula:'SELECT e.name, d.dept_name\nFROM employees e\nINNER JOIN departments d\n  ON e.dept_id = d.dept_id;',
    steps:['Rows are matched where e.dept_id equals d.dept_id.','Farhan has a NULL dept_id, so he finds no match and is dropped.','The IT department has no employees, so it does not appear.'],
    table2:{ rows:[['name','dept_name'],['Asha','Sales'],['Bilal','Finance'],['Chitra','Sales'],['Deepak','HR'],['Esha','Finance']], caption:'Result' }, result:'Five rows come back. Farhan and the IT department are missing.' },
  practice:{ q:'Which table does departments join on, and how many rows does an INNER JOIN of employees and departments return?', table:T(DEPT,'Table: departments'), hint:'Count the employees whose dept_id exists in departments.', solution:'ON e.dept_id = d.dept_id\n5 rows', explain:'Farhan\'s NULL does not match, so five of the six employees match.' },
  interview:[
    { level:'Basic', q:'What does INNER JOIN return?', a:'Only the rows that have matching values in both tables.' },
    { level:'Intermediate', q:'Why is an employee with NULL dept_id missing from an inner join?', a:'NULL never equals anything, so no row in departments matches. To keep such rows, use a LEFT JOIN.' },
    { level:'Intermediate', q:'What happens if you forget the ON clause?', a:'In MySQL you get a cross join: every row of one table paired with every row of the other.' },
    { level:'Scenario', q:'A join returns more rows than the larger table. Why?', a:'A one-to-many or many-to-many match repeats rows, or the join key is not unique. I check the keys and the join condition.' }
  ],
  mcq:[
    { q:'INNER JOIN keeps:', o:['Rows matching in both tables','All rows of the left table','All rows of both tables','Only unmatched rows'], a:0, why:'Only matches survive.' },
    { q:'Does NULL match NULL in an equality join?', o:['No','Yes','Only in MySQL','Only for numbers'], a:0, why:'NULL never equals NULL.' },
    { q:'Employees INNER JOIN departments returns how many rows?', o:['5','6','4','10'], a:0, why:'Farhan has no match.' },
    { q:'What is JOIN without a keyword?', o:['INNER JOIN','LEFT JOIN','CROSS JOIN','FULL JOIN'], a:0, why:'The default is inner.' },
    { q:'Which clause gives the match condition?', o:['ON','WHERE only','HAVING','USING only'], a:0, why:'ON states how rows match.' }
  ],
  recap:['INNER JOIN keeps rows that match in both tables.','Join on keys with ON; unmatched rows are dropped.','A missing ON creates a cross join.']
},

/* --- left-join --- */
'left-join': {
  title:'LEFT JOIN', tagline:'Keep every row of the left table, matched or not.',
  prereq:['inner-join'],
  what:['LEFT JOIN returns all rows from the left table.','Matching rows from the right table are added.','Where there is no match, the right columns are NULL.'],
  why:['Find customers without orders.','Keep every record while adding extra information.'],
  syntax:{ code:'SELECT columns\nFROM left_table a\nLEFT JOIN right_table b\n  ON a.key = b.key;', parts:[['left_table','Every row of this table is kept.'],['right_table','Only matching rows; NULL otherwise.']] },
  points:['The **left** table is the one written before the word JOIN.','Unmatched rows show NULL in right-table columns.','To find unmatched rows: `WHERE b.key IS NULL`.','Filtering the right table in WHERE turns it into an inner join; put such filters in ON.','`COUNT(b.col)` counts matches only; `COUNT(*)` counts every row.'],
  mistakes:['A WHERE filter on the right table that removes the NULL rows.','Using COUNT(*) and getting 1 for unmatched rows.','Mixing up which table is left.'],
  example:{ title:'Every employee, even without a department', scenario:'You want all employees with their department name, including those without one.',
    table:withHl(EMP,{'C7':'hit'},'Table: employees'), task:'Use a LEFT JOIN.', formula:'SELECT e.name, d.dept_name\nFROM employees e\nLEFT JOIN departments d\n  ON e.dept_id = d.dept_id;',
    steps:['All six employees are kept.','Farhan has no matching department, so dept_name is NULL.'],
    table2:{ rows:[['name','dept_name'],['Asha','Sales'],['Bilal','Finance'],['Chitra','Sales'],['Deepak','HR'],['Esha','Finance'],['Farhan','NULL']], caption:'Result' }, result:'Six rows, with NULL for Farhan.' },
  practice:{ q:'Write a query that shows each customer with the number of orders, including customers with none.', table:T(CUST,'Table: customers'), hint:'LEFT JOIN orders and COUNT a column from orders.', solution:'SELECT c.name, COUNT(o.order_id) AS orders\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name;', explain:'Asha has 3, Bilal 2, Chitra 1 and Deepak 0, because COUNT(o.order_id) skips NULLs.' },
  interview:[
    { level:'Basic', q:'What does LEFT JOIN return?', a:'All rows from the left table, and the matching rows from the right table. NULL fills the right columns where there is no match.' },
    { level:'Intermediate', q:'How do you find rows in the left table with no match?', a:'LEFT JOIN, then WHERE right_table.key IS NULL.' },
    { level:'Intermediate', q:'Why can a WHERE condition on the right table turn a LEFT JOIN into an INNER JOIN?', a:'Unmatched rows have NULL there, and a condition such as o.amount > 100 is false for NULL, so those rows are dropped. I move the condition into ON.' },
    { level:'Scenario', q:'Why does COUNT(*) show 1 for a customer with no orders?', a:'The customer row still exists after the join, so COUNT(*) counts it. COUNT(o.order_id) counts only real matches.' }
  ],
  mcq:[
    { q:'LEFT JOIN keeps all rows of:', o:['The left table','The right table','Both tables','Neither'], a:0, why:'The table before JOIN.' },
    { q:'Unmatched right-side columns are:', o:['NULL','0','Empty text','Removed'], a:0, why:'NULL fills the gaps.' },
    { q:'How do you find customers without orders?', o:['WHERE o.order_id IS NULL','WHERE o.order_id = 0','HAVING','LIMIT 0'], a:0, why:'Unmatched rows have NULL keys.' },
    { q:'COUNT(o.order_id) for a customer with no orders gives:', o:['0','1','NULL','Error'], a:0, why:'NULLs are not counted.' },
    { q:'Employees LEFT JOIN departments returns how many rows?', o:['6','5','4','24'], a:0, why:'All six employees are kept.' }
  ],
  recap:['LEFT JOIN keeps every left row.','Unmatched right columns are NULL.','Filter unmatched with IS NULL; put right-table filters in ON.']
},

/* --- right-join --- */
'right-join': {
  title:'RIGHT JOIN', tagline:'Keep every row of the right table.',
  prereq:['left-join'],
  what:['RIGHT JOIN returns all rows from the right table.','Matching left rows are added; NULL where there is no match.','It is a LEFT JOIN with the tables swapped.'],
  why:['Find departments without employees.','Understand legacy queries.'],
  syntax:{ code:'SELECT columns\nFROM left_table a\nRIGHT JOIN right_table b\n  ON a.key = b.key;', parts:[['right_table','Every row of this table is kept.']] },
  points:['`A RIGHT JOIN B` equals `B LEFT JOIN A`.','Most analysts prefer LEFT JOIN for readability.','Unmatched left columns are NULL.','Find unmatched right rows with `WHERE a.key IS NULL`.','Mixing LEFT and RIGHT in one query is confusing.'],
  mistakes:['Mixing LEFT and RIGHT joins.','Forgetting which table is on the right.','Filtering in WHERE and dropping NULL rows.'],
  example:{ title:'Departments without employees', scenario:'You want every department, with its employees if it has any.',
    table:T(DEPT,'Table: departments (the right table)'), task:'Use a RIGHT JOIN from employees to departments.', formula:'SELECT d.dept_name, e.name\nFROM employees e\nRIGHT JOIN departments d\n  ON e.dept_id = d.dept_id\nORDER BY d.dept_id, e.name;',
    steps:['All four departments are kept.','IT has no matching employee, so name is NULL.'],
    table2:{ rows:[['dept_name','name'],['Sales','Asha'],['Sales','Chitra'],['Finance','Bilal'],['Finance','Esha'],['HR','Deepak'],['IT','NULL']], caption:'Result' }, result:'IT appears with a NULL employee.' },
  practice:{ q:'Write a query that lists only the departments that have no employees.', table:T(DEPT,'Table: departments'), hint:'RIGHT JOIN, then keep rows where the employee side is NULL.', solution:'SELECT d.dept_name\nFROM employees e\nRIGHT JOIN departments d\n  ON e.dept_id = d.dept_id\nWHERE e.emp_id IS NULL;', explain:'Only IT has no employees.' },
  interview:[
    { level:'Basic', q:'What does RIGHT JOIN return?', a:'All rows of the right table and matching rows of the left table, with NULL where there is no match.' },
    { level:'Intermediate', q:'How is RIGHT JOIN related to LEFT JOIN?', a:'A RIGHT JOIN B gives the same result as B LEFT JOIN A, so I normally write LEFT JOINs for consistency.' },
    { level:'Intermediate', q:'How do you find departments with no employees?', a:'Departments LEFT JOIN employees WHERE employees.emp_id IS NULL, or the RIGHT JOIN form of the same.' },
    { level:'Scenario', q:'Why avoid mixing LEFT and RIGHT joins?', a:'It makes the direction of the data hard to follow. I order tables so the main table is first and use only LEFT JOINs.' }
  ],
  mcq:[
    { q:'RIGHT JOIN keeps all rows of:', o:['The right table','The left table','Both','None'], a:0, why:'The table after JOIN.' },
    { q:'A RIGHT JOIN B equals:', o:['B LEFT JOIN A','A INNER JOIN B','A LEFT JOIN B','A CROSS JOIN B'], a:0, why:'Swap the tables.' },
    { q:'Which department has no employees?', o:['IT','Sales','HR','Finance'], a:0, why:'No employee has dept_id 40.' },
    { q:'Unmatched left columns are:', o:['NULL','0','Removed','Empty text'], a:0, why:'NULL fills the gaps.' },
    { q:'Which is the common convention?', o:['Use LEFT JOIN only','Mix both','RIGHT only','CROSS only'], a:0, why:'Consistency helps readability.' }
  ],
  recap:['RIGHT JOIN keeps every right-table row.','A RIGHT JOIN B = B LEFT JOIN A.','Prefer LEFT JOIN for consistency.']
},

/* --- full-outer-join --- */
'full-outer-join': {
  title:'FULL OUTER JOIN', tagline:'Keep every row from both tables.',
  prereq:['right-join'],
  what:['FULL OUTER JOIN returns all rows from both tables.','Matches are combined; unmatched rows show NULL on the other side.','**MySQL does not support it.** You combine LEFT JOIN and RIGHT JOIN with UNION.'],
  why:['Compare two lists to see what is in one, the other or both.','A classic interview question, especially "how in MySQL?".'],
  syntax:{ code:'-- SQL Server, PostgreSQL, Oracle\nSELECT ... FROM a FULL OUTER JOIN b ON a.key = b.key;\n\n-- MySQL\nSELECT ... FROM a LEFT JOIN b ON a.key = b.key\nUNION\nSELECT ... FROM a RIGHT JOIN b ON a.key = b.key;', parts:[['FULL OUTER JOIN','All rows from both tables.'],['UNION','Combines the LEFT and RIGHT results and removes duplicates.']] },
  points:['Unmatched rows from either side appear with NULLs.','MySQL needs the LEFT JOIN ... UNION ... RIGHT JOIN workaround.','Use UNION, not UNION ALL, so matched rows are not duplicated.','Find rows in only one table with WHERE on a NULL key.','It is used less often than LEFT JOIN.'],
  mistakes:['Writing FULL OUTER JOIN in MySQL.','Using UNION ALL and duplicating rows.','Not understanding NULLs on both sides.'],
  example:{ title:'Employees and departments, nothing left out', scenario:'You want every employee and every department, matched where possible.',
    table:T(EMP,'Table: employees'), task:'Emulate a full outer join in MySQL.', formula:'SELECT e.name, d.dept_name\nFROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id\nUNION\nSELECT e.name, d.dept_name\nFROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id;',
    steps:['The LEFT JOIN part keeps all employees, including Farhan.','The RIGHT JOIN part keeps all departments, including IT.','UNION merges them and removes the repeated matched rows.'],
    table2:{ rows:[['name','dept_name'],['Asha','Sales'],['Bilal','Finance'],['Chitra','Sales'],['Deepak','HR'],['Esha','Finance'],['Farhan','NULL'],['NULL','IT']], caption:'Result' }, result:'Seven rows: five matches, Farhan with no department and IT with no employee.' },
  practice:{ q:'Which two rows in the result show unmatched data, and which side is NULL in each?', hint:'Look for NULLs.', solution:'Farhan: dept_name is NULL\nIT: name is NULL', explain:'Farhan exists only in employees, and IT only in departments.' },
  interview:[
    { level:'Basic', q:'What does FULL OUTER JOIN return?', a:'All rows from both tables, matched where possible, with NULLs where there is no match.' },
    { level:'Intermediate', q:'MySQL has no FULL OUTER JOIN. What do you do?', a:'Run a LEFT JOIN and a RIGHT JOIN and combine them with UNION, which removes the duplicated matched rows.' },
    { level:'Intermediate', q:'Why UNION and not UNION ALL here?', a:'Matched rows appear in both queries. UNION removes those duplicates, while UNION ALL would keep them twice.' },
    { level:'Scenario', q:'Find rows that exist in only one of two tables.', a:'FULL OUTER JOIN, then WHERE a.key IS NULL OR b.key IS NULL.' }
  ],
  mcq:[
    { q:'Does MySQL support FULL OUTER JOIN?', o:['No','Yes','Only 8.0','Only with LIMIT'], a:0, why:'Use LEFT + RIGHT with UNION.' },
    { q:'Which keeps unmatched rows from both sides?', o:['FULL OUTER JOIN','INNER JOIN','CROSS JOIN','SELF JOIN'], a:0, why:'Both sides are fully kept.' },
    { q:'Which operator merges the LEFT and RIGHT results?', o:['UNION','JOIN','INTERSECT','EXISTS'], a:0, why:'UNION combines and de-duplicates.' },
    { q:'How many rows are in the example result?', o:['7','5','6','11'], a:0, why:'Five matches plus Farhan plus IT.' },
    { q:'Why not UNION ALL?', o:['It repeats matched rows','It is slower only','It is invalid','It sorts'], a:0, why:'Matched rows would appear twice.' }
  ],
  recap:['FULL OUTER JOIN keeps all rows from both tables.','In MySQL: LEFT JOIN UNION RIGHT JOIN.','Use it to compare two lists.']
},

/* --- cross-join --- */
'cross-join': {
  title:'CROSS JOIN', tagline:'Pair every row of one table with every row of another.',
  prereq:['inner-join'],
  what:['CROSS JOIN returns every combination of rows.','There is no matching condition.','Two tables of 6 and 4 rows give 24 rows.'],
  why:['Generate all combinations, such as sizes and colours.','Build calendars or scenario grids.'],
  syntax:{ code:'SELECT columns\nFROM table1\nCROSS JOIN table2;', parts:[['CROSS JOIN','All combinations: rows of table1 times rows of table2.']] },
  points:['The result size is rows1 x rows2.','No ON clause is used.','A join missing its ON clause behaves like a cross join.','It can be huge: use it with care.','Often followed by a LEFT JOIN to fill in data.'],
  mistakes:['Accidental cross joins from missing ON conditions.','Using it on big tables.','Expecting matched rows only.'],
  example:{ title:'Sizes and colours', scenario:'A shop sells shirts in sizes S and M, and in the colours Red and Blue. You want every combination.',
    table:withHl({rows:[['size'],['S'],['M']]},{},'Table: sizes (the colours table has Red and Blue)'), task:'Combine sizes and colours.', formula:'SELECT s.size, c.color\nFROM sizes s\nCROSS JOIN colors c;',
    steps:['Each of the 2 sizes is paired with each of the 2 colours.','2 x 2 gives 4 rows.'],
    table2:{ rows:[['size','color'],['S','Red'],['S','Blue'],['M','Red'],['M','Blue']], caption:'Result' }, result:'Four combinations.' },
  practice:{ q:'How many rows does employees CROSS JOIN departments return?', table:T(DEPT,'Table: departments'), hint:'Multiply the row counts: 6 employees and 4 departments.', solution:'24 rows', explain:'6 x 4 = 24.' },
  interview:[
    { level:'Basic', q:'What does CROSS JOIN do?', a:'It pairs every row of the first table with every row of the second, giving rows1 x rows2 results.' },
    { level:'Intermediate', q:'When is a cross join useful?', a:'To generate all combinations, such as every product with every month, before filling in values with a LEFT JOIN.' },
    { level:'Intermediate', q:'What causes an accidental cross join?', a:'A join with no ON condition, or a condition that is always true.' },
    { level:'Scenario', q:'A query suddenly returns billions of rows. What do you check?', a:'A missing or wrong join condition that turned a join into a cross join.' }
  ],
  mcq:[
    { q:'3 rows CROSS JOIN 4 rows gives:', o:['12','7','3','4'], a:0, why:'3 x 4.' },
    { q:'Does CROSS JOIN need ON?', o:['No','Yes','Only in MySQL','Always'], a:0, why:'It has no condition.' },
    { q:'Which creates all combinations?', o:['CROSS JOIN','INNER JOIN','LEFT JOIN','SELF JOIN'], a:0, why:'Every row with every row.' },
    { q:'What is a common cause of an accidental cross join?', o:['A missing ON clause','A wrong data type','A LIMIT','An index'], a:0, why:'No condition pairs everything.' },
    { q:'Result size of the sizes x colours example:', o:['4','2','6','8'], a:0, why:'2 x 2.' }
  ],
  recap:['CROSS JOIN gives all combinations (rows1 x rows2).','No ON clause.','Watch for accidental cross joins.']
},

/* --- self-join --- */
'self-join': {
  title:'SELF JOIN', tagline:'Join a table to itself.',
  prereq:['left-join','aliases'],
  what:['A self join joins a table to itself using two aliases.','It compares rows within the same table.','Typical use: employees and their managers.'],
  why:['Hierarchies, such as manager and employee.','Comparing rows, such as pairs in the same city.'],
  syntax:{ code:'SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m\n  ON e.manager_id = m.emp_id;', parts:[['e','The employee copy of the table.'],['m','The manager copy of the same table.']] },
  points:['You **must** use different aliases for the two copies.','The join links a foreign key in the table to its own primary key.','Use LEFT JOIN to keep top-level rows with no manager.','Can also compare rows: `a.city = b.city AND a.id < b.id`.','For deep hierarchies, use a recursive CTE.'],
  mistakes:['Forgetting aliases.','Using INNER JOIN and losing the top manager.','Joining on the wrong columns.'],
  example:{ title:'Employees and their managers', scenario:'manager_id in employees points to another employee\'s emp_id.',
    table:withHl(EMP,{'E2:E7':'range','A2:A7':'range'},'Table: employees'), task:'List each employee with the name of their manager.', formula:'SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m\n  ON e.manager_id = m.emp_id;',
    steps:['e is the employee row, m is the manager row.','Bilal\'s manager_id is 1, which is Asha\'s emp_id.','Asha has a NULL manager_id, so LEFT JOIN keeps her with a NULL manager.'],
    table2:{ rows:[['employee','manager'],['Asha','NULL'],['Bilal','Asha'],['Chitra','Asha'],['Deepak','Bilal'],['Esha','Bilal'],['Farhan','Chitra']], caption:'Result' }, result:'Asha is at the top. Bilal and Chitra report to Asha.' },
  practice:{ q:'Write a query that returns the names of employees who manage at least one person.', table:T(EMP,'Table: employees'), hint:'Join the table to itself, matching manager_id to emp_id, and use DISTINCT.', solution:'SELECT DISTINCT m.name\nFROM employees e\nJOIN employees m\n  ON e.manager_id = m.emp_id;', explain:'Asha, Bilal and Chitra each have at least one report.' },
  interview:[
    { level:'Basic', q:'What is a self join?', a:'A join of a table with itself, using two aliases, to relate rows within the same table.' },
    { level:'Intermediate', q:'Why use LEFT JOIN in the manager example?', a:'The top person has no manager. An INNER JOIN would drop that row.' },
    { level:'Intermediate', q:'How would you find employees who earn more than their manager?', a:'JOIN employees e to employees m on e.manager_id = m.emp_id and WHERE e.salary > m.salary.' },
    { level:'Scenario', q:'Show the full chain of command, any depth.', a:'A recursive CTE, because a self join only goes one level.' }
  ],
  mcq:[
    { q:'What is required in a self join?', o:['Two aliases for the same table','A second table','A subquery','A view'], a:0, why:'Otherwise column names clash.' },
    { q:'Which condition links employee to manager?', o:['e.manager_id = m.emp_id','e.emp_id = m.emp_id','e.name = m.name','e.salary = m.salary'], a:0, why:'A foreign key to the same table.' },
    { q:'Why LEFT JOIN?', o:['To keep the top manager','To speed it up','To sort','To count'], a:0, why:'The top person has NULL manager.' },
    { q:'Who is Farhan\'s manager in the example?', o:['Chitra','Asha','Bilal','Deepak'], a:0, why:'Farhan\'s manager_id is 3.' },
    { q:'Which handles unlimited depth?', o:['Recursive CTE','Self join','CROSS JOIN','UNION'], a:0, why:'It repeats until no rows are left.' }
  ],
  recap:['A self join uses two aliases of one table.','manager_id links to emp_id.','LEFT JOIN keeps the top level; recursive CTEs handle depth.']
},

/* --- multiple-joins --- */
'multiple-joins': {
  title:'Joining three or more tables', tagline:'Chain joins to combine several tables.',
  prereq:['left-join','self-join'],
  what:['You can chain joins: each JOIN adds one more table.','Each join has its own ON condition.','The result of one join becomes the input for the next.'],
  why:['Real reports combine facts, people and categories.','Common in interviews.'],
  syntax:{ code:'SELECT columns\nFROM a\nJOIN b ON a.k = b.k\nJOIN c ON b.k2 = c.k2;', parts:[['JOIN b ON ...','Adds the second table.'],['JOIN c ON ...','Adds the third table, matching to any table already joined.']] },
  points:['Join step by step, and check the row count after each join.','Use LEFT JOIN when a link may be missing.','Use clear aliases and prefix every column.','One-to-many joins multiply rows, so aggregate carefully.','The order of INNER joins does not change the result, but LEFT joins can.'],
  mistakes:['Row explosion from many-to-many joins.','Mixing INNER and LEFT joins carelessly.','Unprefixed ambiguous column names.'],
  example:{ title:'Employee, department and manager', scenario:'You want each employee with their department name and manager name.',
    table:T(EMP,'Table: employees (joined to departments and to itself)'), task:'Join three sources in one query.', formula:'SELECT e.name AS employee,\n       d.dept_name,\n       m.name AS manager\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.dept_id\nLEFT JOIN employees m ON e.manager_id = m.emp_id;',
    steps:['The first join adds the department name.','The second join adds the manager from the same table.','LEFT JOINs keep Asha (no manager) and Farhan (no department).'],
    table2:{ rows:[['employee','dept_name','manager'],['Asha','Sales','NULL'],['Bilal','Finance','Asha'],['Chitra','Sales','Asha'],['Deepak','HR','Bilal'],['Esha','Finance','Bilal'],['Farhan','NULL','Chitra']], caption:'Result' }, result:'Six rows, with NULLs where a link is missing.' },
  practice:{ q:'In which order do you write the tables if you want every customer, and their orders, and keep customers with no orders?', table:T(CUST,'Table: customers'), hint:'Start from customers and use LEFT JOIN.', solution:'FROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id', explain:'The table you want to keep entirely goes first, then LEFT JOIN the others.' },
  interview:[
    { level:'Basic', q:'How do you join three tables?', a:'Chain JOIN clauses, each with its own ON condition, so each new table links to one already in the query.' },
    { level:'Intermediate', q:'What is a row explosion?', a:'Joining one-to-many or many-to-many tables multiplies rows, so totals and counts become too big. I check row counts after each join and aggregate before joining if needed.' },
    { level:'Intermediate', q:'Does join order matter?', a:'For INNER JOINs not for the result, though the optimiser may reorder them. For LEFT JOINs it does matter.' },
    { level:'Scenario', q:'A three-table report totals are doubled. What is the first thing you check?', a:'Whether one of the joins duplicates rows, for example joining orders to both items and payments. I aggregate each table separately first.' }
  ],
  mcq:[
    { q:'How many ON conditions does a three-table join need?', o:['Two','One','Three','None'], a:0, why:'One for each added table.' },
    { q:'A row explosion is caused by:', o:['One-to-many or many-to-many joins','Indexes','NULLs','LIMIT'], a:0, why:'Rows multiply.' },
    { q:'Which join keeps rows with a missing link?', o:['LEFT JOIN','INNER JOIN','CROSS JOIN','EXISTS'], a:0, why:'LEFT keeps unmatched rows.' },
    { q:'Why use aliases?', o:['Shorter, clearer queries','They speed queries','They are required for WHERE','They create indexes'], a:0, why:'Readability and no ambiguity.' },
    { q:'Who is Esha\'s manager in the example?', o:['Bilal','Asha','Chitra','Deepak'], a:0, why:'Esha\'s manager_id is 2.' }
  ],
  recap:['Chain JOINs, one ON per added table.','Watch for row explosion; check counts after each join.','Use LEFT JOIN where links may be missing.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- inner-join --- */
DEEP['inner-join'] = {
  level:'Intermediate',
  tldr:'INNER JOIN keeps only the rows whose join key exists on **both** sides. Everything else disappears.',
  intuition:{ text:[
    'Imagine two lists at a conference: the registration list (employees) and the room-allocation list (departments). An inner join gives you only the people who appear on both lists, with the details from each list side by side.',
    'The database never looks at a table as a whole. It takes each row of one table and asks: is there a row in the other table with an equal key? If yes, the two rows are glued together into one result row. If no, the row is dropped.'
  ], analogy:'Matching name tags to seats: a tag with no seat, and a seat with no tag, are both left out of the seating plan.' },
  how:[
    'The database reads the **left** table (employees).',
    'For each row it looks up the join key (`dept_id`) in the **right** table (departments).',
    'Every pair of rows whose keys are equal becomes one result row.',
    'If one left row matches several right rows, it appears **several times**.',
    'Rows with no match, and rows whose key is NULL, produce nothing.',
    'WHERE, GROUP BY and SELECT then run on the joined rows.'
  ],
  diagrams:[
    { type:'venn', kind:'inner', a:'employees', b:'departments', mid:'match', caption:'Only the overlap is returned: employees whose dept_id exists in departments.' },
    { type:'flow', arrows:['ON e.dept_id = d.dept_id','only matches'], panels:[
      { title:'employees', rows:[['name','dept_id'],['Asha',10],['Bilal',20],['Farhan','NULL']], hl:{3:'miss'}, note:'Farhan has no department.' },
      { title:'departments', rows:[['dept_id','dept_name'],[10,'Sales'],[20,'Finance'],[40,'IT']], hl:{3:'miss'}, note:'IT has no employees.' },
      { title:'INNER JOIN result', rows:[['name','dept_name'],['Asha','Sales'],['Bilal','Finance']], hl:{1:'hit',2:'hit'} }
    ], caption:'Red rows find no partner and are dropped.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Headcount and payroll by department name', scenario:'Join first, then group, so the report shows department names instead of ids.',
      table:T(EMP,'Table: employees (joined to departments)'), task:'Count employees and total salary per department name, largest payroll first.',
      formula:'SELECT d.dept_name,\n       COUNT(*) AS employees,\n       SUM(e.salary) AS payroll\nFROM employees e\nINNER JOIN departments d\n  ON e.dept_id = d.dept_id\nGROUP BY d.dept_name\nORDER BY payroll DESC;',
      steps:['The join produces five rows (Farhan is dropped).','GROUP BY collapses them into one row per department name.','Sales has Asha and Chitra: 50000 + 60000.'],
      table2:{ rows:[['dept_name','employees','payroll'],['Sales',2,110000],['Finance',2,80000],['HR',1,45000]], caption:'Result' }, result:'Departments with no employees (IT) or employees with no department (Farhan) are absent from this report.' },
    { level:'Business case', title:'Revenue by customer city', scenario:'Management wants to know which city brings the most revenue. Orders hold amounts, and customers hold cities.',
      table:T(ORD,'Table: orders (joined to customers on customer_id)'), task:'Total the revenue and order count per city.',
      formula:'SELECT c.city,\n       SUM(o.amount) AS revenue,\n       COUNT(*) AS orders\nFROM orders o\nINNER JOIN customers c\n  ON o.customer_id = c.customer_id\nGROUP BY c.city\nORDER BY revenue DESC;',
      steps:['Every order finds its customer, so all six orders survive the join.','Pune combines customers 101 (3300) and 103 (700).','Mumbai has Deepak but he placed no orders, so Mumbai does not appear.'],
      table2:{ rows:[['city','revenue','orders'],['Pune',4000,4],['Delhi',1700,2]], caption:'Result' }, result:'Pune brings 4000 from 4 orders. The total of 5700 matches the sum of all orders, a useful sanity check.' }
  ],
  edge:[
    { t:'NULL keys never match', d:'`NULL = NULL` is unknown, not true. An employee with a NULL dept_id disappears from an inner join even if the department table also contains a NULL.' },
    { t:'Duplicate keys multiply rows', d:'If departments accidentally had two rows for dept 10, every Sales employee would appear twice and `SUM(salary)` would double. Check the lookup side with `COUNT(*)` against `COUNT(DISTINCT key)`.' },
    { t:'A missing ON clause', d:'In MySQL a JOIN without ON becomes a cross join: 6 employees x 4 departments = 24 rows. The old comma style `FROM a, b WHERE ...` has the same risk.' },
    { t:'Ambiguous column names', d:'Both tables have `dept_id`. Always prefix columns with the table alias (`e.dept_id`), or the query fails with an ambiguity error.' },
    { t:'Mismatched types and hidden spaces', d:'Joining a text id to a number id, or `\'P103 \'` to `\'P103\'`, silently loses rows. TRIM text keys and keep key types identical.' },
    { t:'Filter in ON or WHERE?', d:'For an INNER JOIN the result is identical. The difference appears only with LEFT JOIN, so build the habit now: row filters belong in WHERE, extra matching rules in ON.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show the total amount per customer **name**, highest first. Customers with no orders should not appear.', table:T(ORD,'Table: orders'), hint:'Join orders to customers, then GROUP BY the customer.',
      solution:'SELECT c.name, SUM(o.amount) AS total\nFROM customers c\nINNER JOIN orders o\n  ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name\nORDER BY total DESC;', explain:'Asha 3300, Bilal 1700, Chitra 700. Deepak has no orders, so the inner join drops him. Grouping by the id as well as the name stops two customers with the same name from merging.' },
    { level:'Interview', q:'Return employees from Sales or Finance who earn more than 42000, with their department name.', table:T(EMP,'Table: employees'), hint:'Join, then filter on the department name and the salary.',
      solution:'SELECT e.name, d.dept_name, e.salary\nFROM employees e\nINNER JOIN departments d\n  ON e.dept_id = d.dept_id\nWHERE d.dept_name IN (\'Sales\', \'Finance\')\n  AND e.salary > 42000;', explain:'Asha (50000) and Chitra (60000) qualify. Bilal and Esha earn exactly 40000 and fail the salary test.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Explain INNER JOIN with an example.', a:'An INNER JOIN combines rows from two tables where the join condition is true and returns only those matching rows. For example, joining employees to departments on dept_id returns each employee with their department name. An employee with no department, or a department with no employees, does not appear.',
      structure:'Definition in one line, then the matching rule, then a small example that includes a row that gets dropped, then when you would use a different join.',
      follow:[ { q:'What happens to rows where the key is NULL?', a:'They never match, because NULL = NULL is unknown. They are dropped in an inner join. A LEFT JOIN keeps them.' },
               { q:'How many rows can an inner join return?', a:'At least 0 and at most rows(A) x rows(B). For a normal primary-key to foreign-key join, it is at most the number of rows on the foreign-key side.' } ] },
    { level:'Intermediate', q:'Your join returns more rows than the largest table. What went wrong?', a:'The join key is not unique on one side, or there is a many-to-many relationship, so rows are multiplied. I confirm by comparing COUNT(*) with COUNT(DISTINCT key) on the lookup table, then fix it by de-duplicating or aggregating that table before joining.',
      structure:'State a hypothesis, say how you would confirm it, then give the fix.',
      tradeoff:'De-duplicating hides a data problem. If the duplicates are wrong, fix the source or add a constraint rather than only patching the query.',
      follow:[ { q:'How do you keep only one matching row?', a:'Number the lookup rows with ROW_NUMBER() OVER (PARTITION BY key ORDER BY some_date DESC) in a CTE and join to rn = 1, or pre-aggregate with GROUP BY.' } ] },
    { level:'Scenario', q:'INNER JOIN or EXISTS to list customers who have orders?', a:'If I only need customers, EXISTS is cleaner, because a customer with three orders appears once. An INNER JOIN would repeat that customer three times unless I add DISTINCT. I join when I also need columns from the orders table.',
      structure:'Compare the two on the shape of the result first, then on performance.',
      tradeoff:'Modern optimizers often treat them similarly. Index the join key on the orders table either way.',
      follow:[ { q:'And for customers without orders?', a:'NOT EXISTS or LEFT JOIN ... WHERE o.key IS NULL. Avoid NOT IN when NULLs are possible.' } ] }
  ],
  ref:{ headers:['Question','Answer'], rows:[['Keeps unmatched rows?','No'],['`NULL = NULL`','Unknown, so no match'],['Typical ON','primary key = foreign key'],['Result size','Up to rows(A) x rows(B); usually the size of the foreign-key side'],['Keyword','`JOIN` alone means INNER JOIN']] },
  related:['left-join','right-join','multiple-joins','exists-sql']
};

/* --- left-join --- */
DEEP['left-join'] = {
  level:'Intermediate',
  tldr:'LEFT JOIN keeps **every** row of the left table, and fills the right-hand columns with NULL when there is no match.',
  intuition:{ text:[
    'Think of a class register and the exam results. Every student must stay on the report. Students who skipped the exam are not removed; their result column is simply blank.',
    'That is the whole difference from an inner join: the left table is protected. The right table only adds information where it can.'
  ], analogy:'A guest list with a "meal choice" column: guests who did not reply stay on the list, with the choice left empty.' },
  how:[
    'Every row of the left table is kept, always.',
    'For each one, matching rows from the right table are attached.',
    'If there are several matches, the left row repeats once per match.',
    'If there is no match, one row is returned with NULL in every right-table column.',
    'WHERE then filters this joined result, which is where many bugs come from.'
  ],
  diagrams:[
    { type:'venn', kind:'left', a:'customers', b:'orders', mid:'match', caption:'All of customers, plus the matching part of orders.' },
    { type:'flow', arrows:['LEFT JOIN on customer_id','result'], panels:[
      { title:'customers', rows:[['customer_id','name'],[101,'Asha'],[102,'Bilal'],[104,'Deepak']], hl:{3:'find'} },
      { title:'orders', rows:[['order_id','customer_id'],[1,101],[2,102],[3,101]] },
      { title:'Result', rows:[['name','order_id'],['Asha',1],['Asha',3],['Bilal',2],['Deepak','NULL']], hl:{4:'find'}, note:'Deepak stays, with NULL.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Customers who never ordered (anti join)', scenario:'Marketing wants to contact customers who have not bought anything.', table:T(CUST,'Table: customers'),
      task:'Return customers with no orders.', formula:'SELECT c.name, c.city\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;',
      steps:['LEFT JOIN keeps every customer.','Customers without orders have NULL in o.order_id.','WHERE keeps exactly those rows.'], table2:{ rows:[['name','city'],['Deepak','Mumbai']], caption:'Result' }, result:'Test a column that can never be NULL in a real match, such as the order key.' },
    { level:'Business case', title:'Revenue per customer, including inactive customers', scenario:'A revenue report must list every customer, with 0 for those who did not buy.', table:T(ORD,'Table: orders'),
      task:'Show each customer with total revenue, highest first.', formula:'SELECT c.name, c.city,\n       COALESCE(SUM(o.amount), 0) AS revenue\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name, c.city\nORDER BY revenue DESC;',
      steps:['The LEFT JOIN keeps Deepak with NULL amounts.','SUM of only NULL values is NULL.','COALESCE turns that NULL into 0.'], table2:{ rows:[['name','city','revenue'],['Asha','Pune',3300],['Bilal','Delhi',1700],['Chitra','Pune',700],['Deepak','Mumbai',0]], caption:'Result' }, result:'Four customers appear, and the revenue adds to 5700.' }
  ],
  edge:[
    { t:'A WHERE filter on the right table kills the NULL rows', d:'`WHERE o.amount > 1000` is false for the NULL rows of unmatched customers, so they vanish and the LEFT JOIN behaves like an INNER JOIN. Move the condition into ON: `ON ... AND o.amount > 1000`.' },
    { t:'COUNT(*) counts the NULL row', d:'A customer with no orders still produces one row, so `COUNT(*)` returns 1. Use `COUNT(o.order_id)` to get 0.' },
    { t:'Repeated left rows inflate left-side sums', d:'A customer with 3 orders appears 3 times. Summing a customer-level column, such as a credit limit, would triple it. Aggregate the many side first.' },
    { t:'Table order matters', d:'`A LEFT JOIN B` and `B LEFT JOIN A` give different results. Write first the table you want all rows from.' },
    { t:'Is the NULL "no match" or a real NULL?', d:'A real NULL in a right-hand column looks identical to a missing match. Test the right table\'s key to detect a missing match.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List customers who placed **no orders in February 2026**.', table:T(ORD,'Table: orders'), hint:'Put the date condition in ON, then test for a missing match.',
      solution:'SELECT c.name\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id\n AND o.order_date >= \'2026-02-01\'\n AND o.order_date <  \'2026-03-01\'\nWHERE o.order_id IS NULL;', explain:'Only customers 101 and 103 ordered in February. The result is Bilal and Deepak. If the date test were in WHERE, every customer without a match would be dropped.' },
    { level:'Interview', q:'For each customer return the number of orders and a status: Active (1 or more) or Inactive.', table:T(CUST,'Table: customers'), hint:'LEFT JOIN, COUNT a column of orders, then CASE.',
      solution:'SELECT c.name,\n       COUNT(o.order_id) AS orders,\n       CASE WHEN COUNT(o.order_id) > 0 THEN \'Active\' ELSE \'Inactive\' END AS status\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name;', explain:'Asha 3 Active, Bilal 2 Active, Chitra 1 Active, Deepak 0 Inactive. COUNT(o.order_id) skips NULLs, which is why Deepak gets 0.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between INNER JOIN and LEFT JOIN?', a:'INNER JOIN returns only rows that match in both tables. LEFT JOIN returns every row of the left table, and fills the right-hand columns with NULL where no match exists.',
      structure:'Contrast the two in one sentence each, then give the employee and department example including the unmatched employee.',
      follow:[ { q:'When would you pick LEFT JOIN?', a:'When the left table is the master list and must stay complete: all customers, all products, all days in a calendar.' } ] },
    { level:'Intermediate', q:'My LEFT JOIN returns the same rows as an INNER JOIN. Why?', a:'A WHERE condition on a right-table column removes the rows where the right side is NULL, which cancels the LEFT JOIN. I move the condition into the ON clause, or write it as `col IS NULL OR condition` when that is what I need.',
      structure:'Name the cause, show the failing query, show the fix.',
      follow:[ { q:'Where do you put filters on the left table?', a:'In WHERE. They only remove left rows, which is what a filter on the master list should do.' } ] },
    { level:'Scenario', q:'Report every customer with the number of orders, including zero. What could go wrong?', a:'Using COUNT(*) gives 1 for customers without orders. I use COUNT(o.order_id). Also, if I join two one-to-many tables, rows multiply, so I aggregate each side in a subquery before joining.',
      tradeoff:'Pre-aggregating each side in a CTE is a little longer, but it prevents double counting.',
      follow:[ { q:'How would you add total revenue as well?', a:'LEFT JOIN a derived table with GROUP BY customer_id, or compute SUM(o.amount) in the same query, because both come from the same orders join.' } ] }
  ],
  ref:{ headers:['Situation','What to use'], rows:[['Keep all left rows','`LEFT JOIN`'],['Find left rows with no match','`LEFT JOIN ... WHERE right.key IS NULL`'],['Count matches, zero allowed','`COUNT(right.key)`'],['Filter the right table but keep left rows','Put the condition in `ON`'],['Default for NULL results','`COALESCE(col, 0)`']] },
  related:['inner-join','right-join','customers-without-orders','coalesce']
};

/* --- right-join --- */
D('right-join',{ l:'Beginner to Intermediate', t:'RIGHT JOIN keeps every row of the right table. It equals a LEFT JOIN with the tables swapped, and most analysts use LEFT JOIN only.',
  i:['A RIGHT JOIN is a mirror image: all rows from the table after JOIN, with matches from the first table and NULLs where none exist.','Readability is the argument against it: mixing LEFT and RIGHT in one query makes the direction hard to follow.'], a:'A LEFT JOIN written backwards.',
  h:['Write `A RIGHT JOIN B ON ...`.','All rows of B are kept.','Unmatched A columns are NULL.','Rewrite as `B LEFT JOIN A` for consistency.'],
  d:[{ type:'venn', kind:'right', a:'employees', b:'departments', mid:'match', caption:'All departments, with matching employees.' }],
  x:[X('Variation','Departments with no employees','Find empty departments.','RIGHT JOIN and test for NULL.','SELECT d.dept_name FROM employees e\nRIGHT JOIN departments d ON e.dept_id = d.dept_id\nWHERE e.emp_id IS NULL;',['IT has no matching employee.'],'IT.',T(DEPT,'Table: departments')),
     X('Business case','Rewrite for consistency','A colleague\'s query mixes LEFT and RIGHT joins.','Make all LEFT.','FROM departments d\nLEFT JOIN employees e ON e.dept_id = d.dept_id',['Same result, one direction.'],'Easier to read and review.')],
  e:[['Equivalent to LEFT JOIN','A RIGHT JOIN B = B LEFT JOIN A.'],['Mixing directions','Confuses readers.'],['WHERE filters','A condition on the left table in WHERE removes the NULL rows.'],['Rarely needed','Reorder tables instead.']],
  p:[P('Medium','List every department with its employees, including empty departments.','RIGHT JOIN.','SELECT d.dept_name, e.name FROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id;','IT shows NULL.',T(DEPT,'Table: departments')),
     P('Interview','Why do most analysts avoid RIGHT JOIN?','Readability.','It can always be rewritten as a LEFT JOIN, and mixing directions makes queries harder to read.','Show the rewrite.')],
  q:[Q('Basic','What does RIGHT JOIN return?','All rows of the right table and matching left rows, with NULL where none match.',{ f:[['Equivalent?','Swap the tables and use LEFT JOIN.']] }),
     Q('Scenario','Find unmatched right rows.','RIGHT JOIN with WHERE left.key IS NULL, or LEFT JOIN with swapped tables.',{ t:'Pick one direction for the whole query.' })],
  r:RT(['Form','Equals'],[['`A RIGHT JOIN B`','`B LEFT JOIN A`'],['Unmatched','`WHERE a.key IS NULL`'],['Style','Prefer LEFT'],['Keeps','Every right row']]), rel:['left-join','inner-join','full-outer-join','customers-without-orders'] });

/* --- full-outer-join --- */
DEEP['full-outer-join'] = {
  level:'Advanced',
  tldr:'A full outer join keeps every row from **both** tables. MySQL has none, so combine a LEFT JOIN and a RIGHT JOIN with UNION.',
  intuition:{ text:[
    'Two lists never match perfectly: some items exist only in the first, some only in the second, and some in both. A full outer join shows all three groups at once, which makes it the natural tool for **reconciliation**: invoices versus payments, system A versus system B.',
    'Rows that exist on only one side appear with NULLs on the other, and those NULLs are your list of discrepancies.'
  ], analogy:'Comparing the guest list with the attendance sheet: who came uninvited, who did not show, and who matched.' },
  how:[
    'A LEFT JOIN keeps all rows from the left table.',
    'A RIGHT JOIN keeps all rows from the right table.',
    '`UNION` combines both results and removes the duplicated matched rows.',
    'Rows from only one table show NULL for the other table\'s columns.',
    'Filter on those NULLs to isolate the mismatches.'
  ],
  diagrams:[
    { type:'venn', kind:'full', a:'invoices', b:'payments', mid:'match', caption:'Everything from both tables is returned.' },
    { type:'flow', arrows:['LEFT JOIN + UNION + RIGHT JOIN'], panels:[
      { title:'invoices', rows:[['inv_id'],[101],[102],[103]], hl:{1:'find'} },
      { title:'payments', rows:[['inv_id'],[102],[103],[104]], hl:{3:'find'} },
      { title:'Full outer join', rows:[['inv_id','payment_for'],[101,'NULL'],[102,102],[103,103],['NULL',104]], hl:{1:'miss',4:'miss'}, note:'Red rows are the mismatches.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Only the mismatches', scenario:'Show only rows that exist in one table but not the other.', table:T(EMP,'Table: employees (joined to departments)'), task:'Filter the full join for NULLs on either side.',
      formula:'SELECT e.name, d.dept_name\nFROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id\nWHERE d.dept_id IS NULL\nUNION\nSELECT e.name, d.dept_name\nFROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id\nWHERE e.emp_id IS NULL;', steps:['The first part finds employees with no department (Farhan).','The second part finds departments with no employees (IT).'], table2:{ rows:[['name','dept_name'],['Farhan','NULL'],['NULL','IT']], caption:'Result' }, result:'Two mismatches: Farhan has no department, and IT has no employee.' },
    { level:'Business case', title:'Reconciling invoices and payments', scenario:'Finance wants invoices without a payment, and payments without an invoice.', table:T({rows:[['invoices'],[101],[102],[103]]},'invoices: 101, 102, 103 | payments reference: 102, 103, 104'), task:'Full outer join on the invoice id.',
      formula:'SELECT i.inv_id AS invoice, p.inv_id AS payment_for\nFROM invoices i\nLEFT JOIN payments p ON i.inv_id = p.inv_id\nUNION\nSELECT i.inv_id, p.inv_id\nFROM invoices i\nRIGHT JOIN payments p ON i.inv_id = p.inv_id;', steps:['101 is invoiced but unpaid.','104 was paid but has no invoice, which is a data issue to investigate.','102 and 103 match.'], table2:{ rows:[['invoice','payment_for'],[101,'NULL'],[102,102],[103,103],['NULL',104]], caption:'Result' }, result:'The two NULL rows are the reconciliation exceptions that finance must follow up.' }
  ],
  edge:[
    { t:'MySQL has no FULL OUTER JOIN', d:'The keyword is a syntax error in MySQL. Use LEFT JOIN UNION RIGHT JOIN. SQL Server, PostgreSQL and Oracle support the keyword.' },
    { t:'UNION versus UNION ALL', d:'Use UNION, so matched rows are not repeated. UNION ALL would return them twice.' },
    { t:'Rows with identical values', d:'UNION removes exact duplicates, which may hide genuine duplicate rows. Add a key column to keep them distinct.' },
    { t:'Column alignment', d:'Both SELECTs must return the same columns in the same order.' },
    { t:'Performance', d:'The tables are scanned twice. Make sure both join keys are indexed.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Which rows of the full outer join of employees and departments contain NULL, and what does each mean?', table:T(DEPT,'Table: departments'), hint:'Look for unmatched rows on each side.', solution:'Farhan: dept_name is NULL (an employee with no department).\nIT: name is NULL (a department with no employees).', explain:'NULL on the right side means no match in the right table, and NULL on the left means no match in the left table.' },
    { level:'Interview', q:'Write the query that returns rows present in invoices but missing from payments, without a full outer join.', hint:'An anti join.', solution:'SELECT i.inv_id\nFROM invoices i\nLEFT JOIN payments p ON i.inv_id = p.inv_id\nWHERE p.inv_id IS NULL;', explain:'Result: 101. When you only need one side of the mismatches, an anti join is simpler and faster than a full outer join.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does a FULL OUTER JOIN return?', a:'All rows from both tables. Rows that match are combined, and rows without a match on either side appear with NULLs for the other table\'s columns.',
      follow:[ { q:'How do you do it in MySQL?', a:'MySQL does not support it, so I run a LEFT JOIN and a RIGHT JOIN and combine them with UNION.' } ] },
    { level:'Intermediate', q:'Why UNION and not UNION ALL in the MySQL workaround?', a:'Matched rows appear in both the LEFT and RIGHT results. UNION removes those duplicates, and UNION ALL would show them twice.',
      tradeoff:'UNION also removes legitimate identical rows, so include a key column.' },
    { level:'Scenario', q:'How do you reconcile two systems that should hold the same customers?', a:'Full outer join on the customer id, then filter for rows where either side is NULL to get the customers missing from one system. Then investigate field-level differences on the matched rows.' }
  ],
  ref:{ headers:['Question','Answer'], rows:[['Keeps unmatched rows','Both sides'],['MySQL syntax','`LEFT JOIN ... UNION ... RIGHT JOIN ...`'],['Find only mismatches','Add `WHERE a.key IS NULL OR b.key IS NULL`'],['Typical use','Reconciliation']] },
  related:['left-join','right-join','union','customers-without-orders']
};

/* --- cross-join --- */
D('cross-join',{ l:'Intermediate', t:'CROSS JOIN pairs every row of one table with every row of another. It is useful for combinations, and dangerous when it happens by accident.',
  i:['Normally a join matches rows. A cross join does no matching at all: every row meets every other row. Two small tables give a grid of all combinations, such as sizes and colours.','The danger is size: 1,000 x 1,000 rows is a million. A join without a condition becomes a cross join silently.'], a:'A multiplication table: every row with every column.',
  h:['Write `A CROSS JOIN B` (no ON).','Rows returned = rows(A) x rows(B).','Often followed by a LEFT JOIN to fill in data.','Check row counts to catch accidents.'],
  d:[FL(['all combinations'],[{ title:'sizes x colours', rows:[['size','color'],['S','Red'],['S','Blue'],['M','Red'],['M','Blue']], note:'2 x 2 = 4 rows' }])],
  x:[X('Variation','A grid of departments and months','Every department for every month, to fill missing values later.','Cross join then LEFT JOIN.','SELECT d.dept_name, m.month\nFROM departments d CROSS JOIN months m;',['Each department meets each month.'],'4 departments x 12 months = 48 rows.'),
     X('Business case','An accidental cross join','A join is written without ON and the result explodes.','Spot it by row count.','SELECT COUNT(*) FROM employees e, departments d;  -- 24',['6 x 4 = 24 rows.'],'Always include a join condition.')],
  e:[['Row explosion','The result size is the product of the sizes.'],['Missing ON','Older comma syntax or a forgotten ON gives a cross join.'],['Intentional use','Calendar grids and scenario tables.'],['Filtering later','A WHERE condition turns it into an inner join.']],
  p:[P('Medium','How many rows for employees CROSS JOIN departments?','6 x 4.','24','Multiply the row counts.',T(DEPT,'Table: departments')),
     P('Interview','When is a cross join useful?','Combinations.','Generating all combinations, such as every product with every month, before LEFT JOINing actual values to show zeros.','Name the zero-filling use.')],
  q:[Q('Basic','What does CROSS JOIN do?','It pairs every row of one table with every row of another.',{ f:[['Result size?','Rows(A) times rows(B).']] }),
     Q('Scenario','A query suddenly returns millions of rows.','Check for a missing join condition that turned a join into a cross join.',{ t:'Run COUNT(*) after each join.' })],
  r:RT(['Fact','Detail'],[['ON clause','None'],['Rows','`rows(A) x rows(B)`'],['Use','All combinations'],['Danger','Missing ON']]), rel:['inner-join','multiple-joins','recursive-cte','left-join'] });

/* --- self-join --- */
DEEP['self-join'] = {
  level:'Intermediate',
  tldr:'A self join joins a table to **itself** using two aliases, so rows can be compared with other rows of the same table.',
  intuition:{ text:[
    'Some relationships live inside one table. An employee row holds the id of that employee\'s manager, and the manager is another row of the same table. To show "employee and manager" side by side, you need that table twice: once to play the employee, and once to play the manager.',
    'SQL cannot use the same table name twice, so you give each copy an alias. After that, a self join works exactly like any other join.'
  ], analogy:'Two photocopies of the same staff list laid side by side, with lines drawn from each employee to their manager.' },
  how:[
    'Write the table twice in FROM with different aliases, such as `employees e` and `employees m`.',
    'Join them where the **foreign key** of the first copy equals the **primary key** of the second: `e.manager_id = m.emp_id`.',
    'Use a LEFT JOIN if rows without a partner (the top manager) must stay.',
    'Prefix every column with its alias.',
    'Add WHERE conditions that compare the two copies, such as `e.salary > m.salary`.'
  ],
  diagrams:[
    { type:'flow', arrows:['e.manager_id = m.emp_id'], panels:[
      { title:'employees e (the employee)', rows:[['emp_id','name','manager_id'],[2,'Bilal',1],[3,'Chitra',1],[4,'Deepak',2]] },
      { title:'employees m (the manager)', rows:[['emp_id','name'],[1,'Asha'],[2,'Bilal']] },
      { title:'Result', rows:[['employee','manager'],['Bilal','Asha'],['Chitra','Asha'],['Deepak','Bilal']] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Pairs in the same city', scenario:'Find pairs of customers who live in the same city.', table:T(CUST,'Table: customers'), task:'List each pair once.',
      formula:'SELECT a.name AS customer_1,\n       b.name AS customer_2,\n       a.city\nFROM customers a\nJOIN customers b\n  ON a.city = b.city\n AND a.customer_id < b.customer_id;', steps:['The join links customers with the same city.','`a.customer_id < b.customer_id` removes self-pairs and mirrored pairs (Asha-Chitra and Chitra-Asha).'], table2:{ rows:[['customer_1','customer_2','city'],['Asha','Chitra','Pune']], caption:'Result' }, result:'Only the Pune customers form a pair.' },
    { level:'Business case', title:'Employees who earn more than their manager', scenario:'A classic audit question: who is paid more than their own manager?', table:T(EMP,'Table: employees'), task:'Compare the two copies.',
      formula:'SELECT e.name AS employee,\n       e.salary AS employee_salary,\n       m.name AS manager,\n       m.salary AS manager_salary\nFROM employees e\nJOIN employees m\n  ON e.manager_id = m.emp_id\nWHERE e.salary > m.salary;', steps:['Chitra (60000) reports to Asha (50000).','Deepak (45000) reports to Bilal (40000).','Bilal, Esha and Farhan earn the same as or less than their managers.'], table2:{ rows:[['employee','employee_salary','manager','manager_salary'],['Chitra',60000,'Asha',50000],['Deepak',45000,'Bilal',40000]], caption:'Result' }, result:'Two employees out-earn their manager.' }
  ],
  edge:[
    { t:'Aliases are mandatory', d:'Without different aliases the database cannot tell which copy a column belongs to, and returns an ambiguity error.' },
    { t:'The top of the hierarchy', d:'Asha has a NULL manager. An INNER JOIN drops her. Use LEFT JOIN to keep the top person with a NULL manager.' },
    { t:'Mirrored pairs', d:'Comparing every row with every other row produces each pair twice. Use `a.id < b.id` to keep one of each.' },
    { t:'Only one level', d:'A self join shows the manager, not the manager\'s manager. For any depth, use a recursive CTE.' },
    { t:'Performance', d:'Index the join key (`manager_id`) and the referenced key. Self joins on big tables without indexes are slow.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List managers (people who have at least one report) with the number of people reporting to them.', table:T(EMP,'Table: employees'), hint:'Group the employee copy by manager.', solution:'SELECT m.name AS manager, COUNT(*) AS reports\nFROM employees e\nJOIN employees m\n  ON e.manager_id = m.emp_id\nGROUP BY m.emp_id, m.name;', explain:'Asha has 2 reports (Bilal and Chitra), Bilal has 2 (Deepak and Esha) and Chitra has 1 (Farhan).' },
    { level:'Interview', q:'Show each employee with their manager\'s manager (two levels up), keeping everyone.', table:T(EMP,'Table: employees'), hint:'Join the table three times, using LEFT JOINs.', solution:'SELECT e.name AS employee,\n       m1.name AS manager,\n       m2.name AS grand_manager\nFROM employees e\nLEFT JOIN employees m1 ON e.manager_id = m1.emp_id\nLEFT JOIN employees m2 ON m1.manager_id = m2.emp_id;', explain:'Deepak shows Bilal and Asha. Asha shows NULL and NULL. For unlimited depth, a recursive CTE is the right tool.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a self join and when do you use it?', a:'A self join joins a table to itself, using two aliases, to relate rows within the same table. A typical case is an employee table that holds a manager id, so I join employees to employees to show each employee with their manager.',
      structure:'Define it, name the need for aliases, then give the manager example.',
      follow:[ { q:'Why LEFT JOIN?', a:'The top person has no manager. An INNER JOIN would drop that row.' } ] },
    { level:'Intermediate', q:'How do you find employees who earn more than their manager?', a:'Join employees e to employees m on e.manager_id = m.emp_id and filter WHERE e.salary > m.salary.',
      follow:[ { q:'How would you find pairs of customers in the same city without duplicates?', a:'Join on city and add a.customer_id < b.customer_id.' } ] },
    { level:'Scenario', q:'You need every employee\'s full reporting chain, of any depth. Can a self join do it?', a:'Not in one query without knowing the depth, because each self join adds one level. A recursive CTE walks the hierarchy until no more rows are found.',
      tradeoff:'Self joins are simple for a fixed number of levels. A recursive CTE is general but more complex.' }
  ],
  ref:{ headers:['Item','Rule'], rows:[['Aliases','Required, two different'],['Key link','`child.manager_id = parent.emp_id`'],['Keep the top row','`LEFT JOIN`'],['Avoid mirrored pairs','`a.id < b.id`'],['Any depth','Recursive CTE']] },
  related:['left-join','inner-join','recursive-cte','aliases']
};

/* --- multiple-joins --- */
DEEP['multiple-joins'] = {
  level:'Intermediate',
  tldr:'Chain joins one table at a time, each with its own ON condition, and check the row count after every join.',
  intuition:{ text:[
    'Real questions span several tables: employees, their departments and their managers. You build the answer step by step: start with the main table, join the next one, then the next. Each join adds columns from one more table.',
    'The danger is invisible. One join that matches several rows multiplies the rows, and every total after it is inflated. The discipline is to know how many rows to expect after each join.'
  ], analogy:'Assembling a report from several folders: add one folder at a time, and check the page count each time.' },
  how:[
    'Start FROM the table that defines one row of the answer (the **grain**).',
    'Add `JOIN table2 ON ...` and check that the row count is what you expect.',
    'Add the next join, always linking to a table already in the query.',
    'Use LEFT JOIN where a link may be missing and the main row must stay.',
    'Aggregate **after** the joins, or aggregate each many-side separately before joining.'
  ],
  diagrams:[
    { type:'flow', arrows:['LEFT JOIN departments','LEFT JOIN employees (manager)'], panels:[
      { title:'employees (6 rows)', text:'one row per employee' },
      { title:'+ department name', text:'still 6 rows' },
      { title:'+ manager name', text:'still 6 rows' }
    ], caption:'Each join keeps the grain: one row per employee.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Aggregating after the joins', scenario:'Headcount and payroll for each manager, with the manager\'s department.', table:T(EMP,'Table: employees'), task:'Join employees to managers and departments, then group.',
      formula:'SELECT m.name AS manager,\n       d.dept_name AS manager_dept,\n       COUNT(*) AS reports,\n       SUM(e.salary) AS team_payroll\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nLEFT JOIN departments d ON m.dept_id = d.dept_id\nGROUP BY m.emp_id, m.name, d.dept_name;', steps:['The self join attaches each employee to a manager.','The second join adds the manager\'s department name.','GROUP BY collapses to one row per manager.'], table2:{ rows:[['manager','manager_dept','reports','team_payroll'],['Asha','Sales',2,100000],['Bilal','Finance',2,85000],['Chitra','Sales',1,35000]], caption:'Result' }, result:'Asha manages 2 people with a team payroll of 100000.' },
    { level:'Business case', title:'Spotting a row explosion', scenario:'A query joins customers to orders and to a second table that holds several contacts per customer. Revenue triples.', table:withHl({rows:[['customer','orders','contacts','revenue (wrong)','revenue (right)'],['Asha',1,3,'3 x amount','1 x amount']]},{'D2':'miss','E2':'hit'},'Illustration'),
      task:'Fix by aggregating each many-side first.', formula:'SELECT c.name, o.total_amount, k.contacts\nFROM customers c\nLEFT JOIN (SELECT customer_id, SUM(amount) AS total_amount\n           FROM orders GROUP BY customer_id) o\n  ON c.customer_id = o.customer_id\nLEFT JOIN (SELECT customer_id, COUNT(*) AS contacts\n           FROM contacts GROUP BY customer_id) k\n  ON c.customer_id = k.customer_id;', steps:['Each derived table has one row per customer.','Joining one-row-per-customer tables cannot multiply rows.'], result:'The totals are correct. This is the standard fix for double counting.' }
  ],
  edge:[
    { t:'Know the grain', d:'Decide what one row of the result represents before joining. Every join must preserve it, or you must aggregate.' },
    { t:'Row multiplication', d:'Two one-to-many joins from the same parent multiply each other (3 orders x 4 contacts = 12 rows per customer).' },
    { t:'Mixing INNER and LEFT joins', d:'An INNER JOIN after a LEFT JOIN on the right table can silently remove the unmatched rows. Check the order.' },
    { t:'Ambiguous columns', d:'Prefix every column with its alias, especially when tables share names like `id` or `name`.' },
    { t:'Join order and performance', d:'The optimizer can reorder inner joins, but start with the most selective table and index every join key.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List each order with the customer name and city, using the orders and customers tables.', table:T(ORD,'Table: orders'), hint:'One join, with aliases.', solution:'SELECT o.order_id, c.name, c.city, o.amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id;', explain:'All six orders match a customer, so six rows return: for example order 1 shows Asha from Pune.' },
    { level:'Interview', q:'Your three-table report shows revenue twice as high as the finance total. How do you find and fix the problem?', hint:'Compare row counts at each step.', solution:'1. Run the query with COUNT(*) after each join to see where the row count jumps.\n2. Check whether a joined table has several rows per key.\n3. Fix: aggregate that table to one row per key before joining, or join on a unique key.\n4. Reconcile the total against the source table.', explain:'Showing a debugging method (count after each step) is stronger than guessing.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you join more than two tables?', a:'Chain JOIN clauses, each with its own ON condition, so each new table links to a table already in the query. I start from the main table and add one join at a time.',
      follow:[ { q:'Does the order of INNER joins change the result?', a:'No, but the order of LEFT joins can, because each one depends on the rows kept so far.' } ] },
    { level:'Intermediate', q:'What is a row explosion and how do you prevent it?', a:'Joining one-to-many tables multiplies rows, which inflates sums and counts. I prevent it by knowing the grain, checking the row counts after each join, and aggregating each many-side table before joining.',
      tradeoff:'Pre-aggregating adds subqueries but guarantees each fact is counted once.' },
    { level:'Scenario', q:'Build a customer 360 view: name, total orders, total revenue and number of support tickets.', a:'Start from customers. LEFT JOIN a derived table of orders aggregated by customer, and another of tickets aggregated by customer. Because each derived table has one row per customer, the counts are not multiplied.' }
  ],
  ref:{ headers:['Rule','Why'], rows:[['Start from the grain table','Defines the row count'],['One join at a time','Easier to debug'],['LEFT JOIN optional links','Keep the main rows'],['Aggregate many-sides first','Avoids double counting'],['Alias every table','Avoids ambiguity']] },
  related:['inner-join','left-join','self-join','derived-table']
};
})();
