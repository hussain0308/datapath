/* Datapath | SQL | Set operations
 * Lessons in this file: union, union-all, intersect-except
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
  const { EMP, CUST } = DP.datasets.sql;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- union --- */
'union': {
  title:'UNION', tagline:'Stack the results of two queries and remove duplicates.',
  prereq:['select'],
  what:['UNION combines the rows of two or more SELECT statements.','Duplicate rows are removed.','Columns must match in number and compatible type.'],
  why:['Combine similar tables, such as monthly tables or two lists of people.'],
  syntax:{ code:'SELECT column FROM table1\nUNION\nSELECT column FROM table2;', parts:[['UNION','Stacks the results and removes duplicates.']] },
  points:['Both queries need the **same number of columns** with compatible types.','Column names come from the first query.','Duplicates are removed, which needs extra work.','ORDER BY goes at the very end.','JOIN adds columns side by side; UNION adds rows on top of each other.'],
  mistakes:['Different column counts or types.','Expecting duplicates to remain.','Putting ORDER BY inside the first query.'],
  example:{ title:'All names from two tables', scenario:'You want a list of every name in customers and employees, each name once.',
    table:T(CUST,'Table: customers (names: Asha, Bilal, Chitra, Deepak)'), task:'Combine the two lists.', formula:'SELECT name FROM customers\nUNION\nSELECT name FROM employees;',
    steps:['Customers contribute 4 names, and employees contribute 6.','UNION removes the 4 names that appear in both.'],
    table2:{ rows:[['name'],['Asha'],['Bilal'],['Chitra'],['Deepak'],['Esha'],['Farhan']], caption:'Result' }, result:'Six unique names.' },
  practice:{ q:'Why must the two SELECT statements in a UNION return the same number of columns?', hint:'Think about stacking rows.', solution:'Each row of the result must have the same columns, so the two queries must return the same number of columns with compatible types.', explain:'UNION stacks rows, so a row from the first query and a row from the second must fit under the same headings.' },
  interview:[
    { level:'Basic', q:'What does UNION do?', a:'It combines the results of two SELECT statements into one result and removes duplicates.' },
    { level:'Intermediate', q:'What are the rules for UNION?', a:'The queries must have the same number of columns, with compatible data types in the same order. The column names come from the first query.' },
    { level:'Intermediate', q:'How is UNION different from JOIN?', a:'JOIN adds columns by matching rows. UNION adds rows by stacking results.' },
    { level:'Scenario', q:'Sales are stored in a separate table for each year. How do you report all years?', a:'UNION ALL the yearly tables into one result, or use a view, then aggregate.' }
  ],
  mcq:[
    { q:'UNION removes:', o:['Duplicate rows','NULLs','Columns','Tables'], a:0, why:'It returns distinct rows.' },
    { q:'Must columns match in number?', o:['Yes','No','Only names','Only text'], a:0, why:'The same number and compatible types.' },
    { q:'Column names come from:', o:['The first query','The last query','Both','Neither'], a:0, why:'The first SELECT decides.' },
    { q:'Customers UNION employees names gives how many rows?', o:['6','10','4','2'], a:0, why:'Six unique names.' },
    { q:'Where does ORDER BY go?', o:['At the end','In the first query','In the middle','Not allowed'], a:0, why:'It applies to the whole result.' }
  ],
  recap:['UNION stacks results and removes duplicates.','Same number of columns, compatible types.','JOIN adds columns; UNION adds rows.']
},

/* --- union-all --- */
'union-all': {
  title:'UNION ALL', tagline:'Stack the results of two queries and keep every row.',
  prereq:['union'],
  what:['UNION ALL combines results without removing duplicates.','It is faster than UNION.','It keeps every row.'],
  why:['Combine tables where duplicates are meaningful.','Faster when you know there are no duplicates.'],
  syntax:{ code:'SELECT column FROM table1\nUNION ALL\nSELECT column FROM table2;', parts:[['UNION ALL','Stacks results and keeps duplicates.']] },
  points:['No duplicate removal, so it is **faster**.','Use it when rows are known to be distinct, or duplicates are wanted.','Result rows = rows of query 1 + rows of query 2.','Add a label column to show the source.','Same column rules as UNION.'],
  mistakes:['Using UNION when UNION ALL is enough.','Using UNION ALL and getting unexpected duplicates.','Forgetting a source label.'],
  example:{ title:'Every name from both tables', scenario:'You want all names from customers and employees, including repeats, with the source.',
    table:T(CUST,'Table: customers'), task:'Stack the two lists.', formula:'SELECT name, \'customer\' AS source FROM customers\nUNION ALL\nSELECT name, \'employee\' FROM employees;',
    steps:['4 customer rows plus 6 employee rows.','No duplicate removal, so Asha appears twice.'],
    table2:{ rows:[['name','source'],['Asha','customer'],['Bilal','customer'],['Chitra','customer'],['Deepak','customer'],['Asha','employee'],['Bilal','employee'],['Chitra','employee'],['Deepak','employee'],['Esha','employee'],['Farhan','employee']], caption:'Result' }, result:'Ten rows: 4 + 6.' },
  practice:{ q:'Which of UNION and UNION ALL would you use to total sales from two yearly tables, and why?', hint:'Think about duplicates.', solution:'UNION ALL', explain:'Two identical sales rows in different years are valid. UNION would remove one and make the total too low.' },
  interview:[
    { level:'Basic', q:'What is the difference between UNION and UNION ALL?', a:'UNION removes duplicate rows. UNION ALL keeps all rows and is faster.' },
    { level:'Intermediate', q:'When is UNION ALL the right choice?', a:'When duplicates are meaningful, or the queries cannot overlap. It avoids the sorting needed to remove duplicates.' },
    { level:'Intermediate', q:'Risk of using UNION when you need totals?', a:'Identical rows are collapsed, so totals can be understated. For sums I use UNION ALL.' },
    { level:'Scenario', q:'Combine 12 monthly tables into one report.', a:'UNION ALL the 12 selects with a month label, or better, a single partitioned table or a view.' }
  ],
  mcq:[
    { q:'UNION ALL keeps:', o:['Duplicates','Only unique rows','Only NULLs','Nothing'], a:0, why:'No de-duplication.' },
    { q:'Which is faster?', o:['UNION ALL','UNION','Same','Depends on columns only'], a:0, why:'No distinct step.' },
    { q:'Rows in customers UNION ALL employees:', o:['10','6','4','2'], a:0, why:'4 + 6.' },
    { q:'Use UNION ALL for totals because:', o:['UNION would drop identical rows','It sorts','It indexes','It joins'], a:0, why:'Dropped rows lower the total.' },
    { q:'How can you show the source of each row?', o:['Add a literal label column','Use ORDER BY','Use DISTINCT','Use HAVING'], a:0, why:'A constant column identifies the query.' }
  ],
  recap:['UNION ALL keeps all rows and is faster.','Use it when duplicates matter, such as totals.','Add a label to show the source.']
},

/* --- intersect-except --- */
'intersect-except': {
  title:'INTERSECT and EXCEPT', tagline:'Find rows common to two queries, or only in the first.',
  prereq:['union'],
  what:['INTERSECT returns rows that appear in **both** queries.','EXCEPT (MINUS in Oracle) returns rows in the first query but not in the second.','Both remove duplicates.'],
  why:['Compare two lists: who is in both, who is missing?'],
  syntax:{ code:'SELECT name FROM employees\nINTERSECT\nSELECT name FROM customers;\n\nSELECT name FROM employees\nEXCEPT\nSELECT name FROM customers;', parts:[['INTERSECT','Rows present in both results.'],['EXCEPT','Rows in the first result only.']] },
  points:['MySQL supports them from **version 8.0.31**.','Older MySQL: use `IN` / `NOT IN`, `EXISTS` or a join.','Oracle uses `MINUS` instead of EXCEPT.','Same column rules as UNION.','Results are distinct.'],
  mistakes:['Using them in old MySQL versions.','Expecting duplicates.','Confusing the order in EXCEPT.'],
  example:{ title:'Who is in both lists, and who is only an employee?', scenario:'You compare customer names with employee names.',
    table:T(EMP,'Table: employees'), task:'Find names present in both, and names only in employees.', formula:'-- in both\nSELECT name FROM employees\nINTERSECT\nSELECT name FROM customers;\n\n-- only employees\nSELECT name FROM employees\nEXCEPT\nSELECT name FROM customers;',
    steps:['Asha, Bilal, Chitra and Deepak exist in both tables.','Esha and Farhan exist only in employees.'],
    table2:{ rows:[['INTERSECT','EXCEPT'],['Asha','Esha'],['Bilal','Farhan'],['Chitra',''],['Deepak','']], caption:'Results side by side' }, result:'INTERSECT returns 4 names, and EXCEPT returns 2.' },
  practice:{ q:'Write the old-MySQL equivalent of the EXCEPT query using NOT EXISTS or NOT IN.', hint:'Employees whose name is not found in customers.', solution:'SELECT DISTINCT e.name\nFROM employees e\nWHERE NOT EXISTS (\n  SELECT 1 FROM customers c WHERE c.name = e.name\n);', explain:'The result is Esha and Farhan. NOT EXISTS is safe even if names can be NULL.' },
  interview:[
    { level:'Basic', q:'What do INTERSECT and EXCEPT do?', a:'INTERSECT returns rows common to both queries. EXCEPT returns rows in the first query that are not in the second.' },
    { level:'Intermediate', q:'What is the equivalent of EXCEPT in Oracle?', a:'MINUS.' },
    { level:'Intermediate', q:'How do you emulate INTERSECT in MySQL before 8.0.31?', a:'With an INNER JOIN on the columns or WHERE EXISTS, plus DISTINCT.' },
    { level:'Scenario', q:'Find customers who have not placed any orders.', a:'SELECT customer_id FROM customers EXCEPT SELECT customer_id FROM orders; or LEFT JOIN with IS NULL, or NOT EXISTS.' }
  ],
  mcq:[
    { q:'INTERSECT returns:', o:['Rows in both queries','Rows in either','Rows in the first only','All rows'], a:0, why:'The overlap.' },
    { q:'EXCEPT returns:', o:['Rows in the first but not the second','Rows in both','All rows','NULLs'], a:0, why:'The difference.' },
    { q:'Oracle name for EXCEPT:', o:['MINUS','NOT','DIFF','LESS'], a:0, why:'Oracle uses MINUS.' },
    { q:'MySQL supports INTERSECT from:', o:['8.0.31','5.7','5.0','Never'], a:0, why:'Added in 8.0.31.' },
    { q:'Employees EXCEPT customers (names) gives:', o:['Esha and Farhan','Asha and Bilal','Chitra and Deepak','Nobody'], a:0, why:'They are only in employees.' }
  ],
  recap:['INTERSECT is the overlap; EXCEPT is the difference.','MySQL needs 8.0.31, or use EXISTS and joins.','Oracle uses MINUS.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- union --- */
D('union',{ l:'Beginner to Intermediate', t:'UNION stacks the results of queries and removes duplicates. The queries need the same number of compatible columns.',
  i:['JOIN adds columns side by side. UNION adds rows on top of each other, like stacking two lists. It is the tool for combining similar tables, such as customers and leads.','Because UNION removes duplicates, it behaves like DISTINCT on the combined result.'], a:'Merging two guest lists into one without repeats.',
  h:['Write two or more SELECTs with the same number of columns.','Join them with `UNION`.','Column names come from the first query.','`ORDER BY` goes once, at the end.'],
  d:[FL(['UNION'],[{ title:'customers.name', rows:[['name'],['Asha'],['Bilal'],['Chitra'],['Deepak']] },{ title:'employees.name', rows:[['name'],['Asha'],['Bilal'],['Chitra'],['Deepak'],['Esha'],['Farhan']] },{ title:'Result (6 unique)', rows:[['name'],['Asha'],['Bilal'],['Chitra'],['Deepak'],['Esha'],['Farhan']], hl:{5:'hit',6:'hit'} }])],
  x:[X('Variation','Different tables, same shape','Combine cities from two tables.','Select matching columns.','SELECT city FROM customers\nUNION\nSELECT city FROM suppliers;',['Both return one text column.'],'A distinct list of cities.'),
     X('Business case','A distinct contact list','Marketing wants every person once.','Union two sources.','SELECT name, \'customer\' AS source FROM customers\nUNION\nSELECT name, \'employee\' FROM employees;',['The label differs, so rows with the same name are kept as different rows.'],'Remove the label if you want names only.')],
  e:[['Duplicates removed','Identical rows collapse.'],['Same columns','Count and compatible types must match.'],['Names from the first query','Later aliases are ignored.'],['ORDER BY at the end','It applies to the whole result.']],
  p:[P('Medium','All distinct names from customers and employees.','UNION.','SELECT name FROM customers UNION SELECT name FROM employees;','Six names.',T(CUST,'Table: customers')),
     P('Interview','UNION versus JOIN?','Rows versus columns.','UNION stacks rows from similar results. JOIN combines columns from related tables by a key.','Give an example of each.')],
  q:[Q('Basic','What does UNION do?','It combines results and removes duplicates.',{ f:[['Column rules?','Same number and compatible types.']] }),
     Q('Scenario','Combine three yearly tables.','UNION ALL with a year label, if duplicates are meaningful.',{ t:'See UNION ALL.' })],
  r:RT(['Rule','Detail'],[['Duplicates','Removed'],['Columns','Same count, compatible types'],['Names','From the first query'],['Order','`ORDER BY` at the end']]), rel:['union-all','intersect-except','full-outer-join','cte'] });

/* --- union-all --- */
DEEP['union-all'] = {
  level:'Intermediate',
  tldr:'UNION ALL stacks the rows of two queries and **keeps every row**. UNION removes duplicates, which costs time and can hide real data.',
  intuition:{ text:[
    'A JOIN adds columns side by side. UNION adds rows on top of each other. If two tables have the same shape, such as online sales and store sales, stacking them gives one combined list.',
    'The choice between UNION and UNION ALL is about duplicates. UNION behaves like DISTINCT on the result: identical rows collapse into one. If two genuine sales of the same amount are collapsed, your total is too low. In most analytics work, UNION ALL is the right default.'
  ], analogy:'Putting two stacks of receipts into one pile (UNION ALL), versus throwing away receipts that look identical (UNION).' },
  how:[
    'Write two or more SELECT statements with the same number of columns and compatible types.',
    'Join them with `UNION ALL`.',
    'Column names come from the first query.',
    'Add a label column to remember which query each row came from.',
    'ORDER BY and LIMIT go once, at the very end.'
  ],
  diagrams:[
    { type:'flow', arrows:['UNION ALL'], panels:[
      { title:'online_sales', rows:[['order_id','amount'],[1,500],[2,500]] },
      { title:'store_sales', rows:[['order_id','amount'],[3,500]] },
      { title:'Result: all 3 rows kept', rows:[['order_id','amount','channel'],[1,500,'online'],[2,500,'online'],[3,500,'store']], note:'UNION (without ALL) would not collapse these: order ids differ. But two identical rows would collapse.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'The danger of UNION', scenario:'Two stores sold an item for 500 on the same day. Both rows are valid.', table:withHl({rows:[['store','day','amount'],['A','2026-03-01',500],['B','2026-03-01',500]]},{'A2:C3':'range'},'Two sales, identical values'), task:'Compare totals.', formula:'-- UNION collapses identical rows\nSELECT day, amount FROM store_a\nUNION\nSELECT day, amount FROM store_b;', steps:['If store_a and store_b both contain (2026-03-01, 500), UNION returns one row.','The total would be 500 instead of 1000.'], result:'UNION ALL returns both rows and the total is correct. Include a store column, so rows differ in a meaningful way anyway.' },
    { level:'Business case', title:'Combining channels into one report', scenario:'Sales are in separate tables for online and store channels. A manager wants totals per channel.', table:withHl({rows:[['channel','order_id','amount'],['online',1,500],['online',2,700],['store',3,400]]},{},'Combined rows'), task:'Stack both tables and summarise.',
      formula:'SELECT channel, SUM(amount) AS total\nFROM (\n  SELECT \'online\' AS channel, amount FROM online_sales\n  UNION ALL\n  SELECT \'store\', amount FROM store_sales\n) t\nGROUP BY channel;', steps:['Each query adds a literal channel label.','UNION ALL stacks the rows without removing any.','GROUP BY totals each channel.'], table2:{ rows:[['channel','total'],['online',1200],['store',400]], caption:'Result' }, result:'Online 1200 and store 400. The label column makes the source visible.' }
  ],
  edge:[
    { t:'UNION removes duplicates', d:'It compares entire rows. Identical rows from different sources collapse. Use UNION only when that is really wanted.' },
    { t:'Performance', d:'UNION must sort or hash all rows to find duplicates. UNION ALL does no extra work.' },
    { t:'Column counts and types', d:'Every SELECT must return the same number of columns, in the same order, with compatible types. Otherwise you get an error or odd conversions.' },
    { t:'Names come from the first query', d:'Later column names are ignored. Alias columns in the first SELECT.' },
    { t:'ORDER BY placement', d:'Put ORDER BY once at the end, applying to the whole result. Sorting inside a member query is ignored.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Combine customer names and employee names into one list, keeping every row, with a column that says which table each name came from.', table:T(CUST,'Table: customers (and employees)'), hint:'A literal label in each SELECT.', solution:'SELECT name, \'customer\' AS source FROM customers\nUNION ALL\nSELECT name, \'employee\' FROM employees;', explain:'The result has 10 rows: 4 customers and 6 employees. Asha appears twice, once for each source.' },
    { level:'Interview', q:'When is UNION the correct choice, and when is it a bug?', hint:'Think about whether duplicates are meaningful.', solution:'UNION is correct for building a distinct list, such as all unique email addresses from two sources.\nIt is a bug when rows are transactions: identical-looking transactions are separate facts, and removing duplicates understates totals.', explain:'A rule of thumb: lists of entities can be UNIONed, lists of events should be UNION ALLed.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between UNION and UNION ALL?', a:'UNION combines the results of two queries and removes duplicate rows. UNION ALL combines them and keeps every row, so it is faster and does not alter the data.',
      follow:[ { q:'Which is the default choice for analytics?', a:'UNION ALL, because it is faster and does not silently remove valid repeated rows.' } ] },
    { level:'Intermediate', q:'What rules must the queries in a UNION follow?', a:'The same number of columns, compatible types in the same order, and the column names come from the first query. ORDER BY applies to the final result.' },
    { level:'Scenario', q:'Monthly tables sales_2026_01, sales_2026_02, ... hold the same columns. How do you analyse the year?', a:'UNION ALL the tables with a month label, or create a view that does it so analysts query one object. A partitioned table is the better long-term design.',
      tradeoff:'A view hides the UNION ALL but still reads every table. Partitioning lets the database skip months it does not need.' }
  ],
  ref:{ headers:['','UNION','UNION ALL'], rows:[['Duplicates','Removed','Kept'],['Speed','Slower','Faster'],['Typical use','Distinct lists of entities','Combining transactions'],['Row count','Up to the sum','Exactly the sum']] },
  related:['union','intersect-except','cte','views']
};

/* --- intersect-except --- */
D('intersect-except',{ l:'Intermediate', t:'INTERSECT returns rows in both queries, and EXCEPT rows only in the first. MySQL supports them from 8.0.31; Oracle calls EXCEPT MINUS.',
  i:['Set operations answer "who is in both lists?" and "who is in the first but not the second?". They compare whole rows and return distinct results.','Older MySQL lacks them, so the same logic is written with IN, EXISTS or joins.'], a:'Overlapping circles: the overlap, and the part of one circle outside the other.',
  h:['`A INTERSECT B`: rows in both.','`A EXCEPT B`: rows in A but not B.','Columns must match as in UNION.','Older MySQL: use `EXISTS` / `NOT EXISTS`.'],
  d:[FL(['INTERSECT / EXCEPT'],[{ title:'employee names vs customer names', rows:[['INTERSECT','EXCEPT'],['Asha','Esha'],['Bilal','Farhan'],['Chitra',''],['Deepak','']] }])],
  x:[X('Variation','Old MySQL equivalent','INTERSECT on a server before 8.0.31.','Use EXISTS.','SELECT DISTINCT e.name FROM employees e\nWHERE EXISTS (SELECT 1 FROM customers c WHERE c.name = e.name);',['EXISTS checks membership.'],'Asha, Bilal, Chitra, Deepak.'),
     X('Business case','Who is missing?','Employees who are not customers.','Use EXCEPT.','SELECT name FROM employees\nEXCEPT\nSELECT name FROM customers;',['Only names present in the first query.'],'Esha and Farhan.')],
  e:[['Version','MySQL 8.0.31 or later.'],['Distinct results','Duplicates are removed (use ALL variants where supported).'],['NULLs','Set operations treat NULLs as equal.'],['Oracle','Uses MINUS.']],
  p:[P('Medium','Names in both employees and customers.','INTERSECT.','SELECT name FROM employees INTERSECT SELECT name FROM customers;','Asha, Bilal, Chitra, Deepak.',T(EMP,'Table: employees')),
     P('Interview','Write EXCEPT without EXCEPT.','NOT EXISTS.','SELECT name FROM employees e WHERE NOT EXISTS (SELECT 1 FROM customers c WHERE c.name = e.name);','Safe with NULLs.')],
  q:[Q('Basic','INTERSECT versus EXCEPT?','INTERSECT is the overlap, EXCEPT is the difference.',{ f:[['Oracle name?','MINUS.']] }),
     Q('Scenario','Customers who have not ordered.','EXCEPT of customer ids and order customer ids, or LEFT JOIN with IS NULL.',{ t:'Joins also let you return other columns.' })],
  r:RT(['Operator','Returns'],[['`INTERSECT`','In both'],['`EXCEPT`','In first only'],['`UNION`','In either'],['Old MySQL','`EXISTS` / `NOT EXISTS`']]), rel:['union','union-all','exists-sql','customers-without-orders'] });
})();
