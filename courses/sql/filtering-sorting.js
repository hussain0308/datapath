/* Datapath | SQL | Filtering, sorting and limiting
 * Lessons in this file: where, sql-and-or-not, in-sql, between-sql, like-sql, is-null, order-by, limit-sql
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

/* --- where --- */
'where': {
  title:'WHERE', tagline:'Keep only the rows that meet a condition.',
  prereq:['select'],
  what:['WHERE filters rows before anything else is calculated.','Only rows where the condition is TRUE are kept.','It works with numbers, text and dates.'],
  why:['Most analysis starts by choosing the right rows.','Filtering early makes queries faster.'],
  syntax:{ code:'SELECT columns\nFROM table_name\nWHERE condition;', parts:[['condition','A test such as salary > 45000 or dept_id = 10.']] },
  points:['Operators: `=`, `<>` (or `!=`), `>`, `<`, `>=`, `<=`.','Text and dates go in single quotes.','WHERE runs **before** GROUP BY.','You cannot use a column alias from SELECT in WHERE (in MySQL).','Rows where the condition is NULL or FALSE are left out.','Use AND, OR, IN, BETWEEN and LIKE for richer conditions.'],
  mistakes:['Using `=` with NULL.','Missing quotes around text.','Using an aggregate function in WHERE; use HAVING.'],
  example:{ title:'Employees of one department', scenario:'You want only the employees of department 10.',
    table:withHl(EMP,{'C2':'hit','C4':'hit'},'Table: employees'), task:'Return name and salary for dept_id 10.', formula:'SELECT name, salary\nFROM employees\nWHERE dept_id = 10;',
    steps:['WHERE dept_id = 10 keeps rows 1 and 3.','SELECT then shows the name and salary of those rows.'],
    table2:{ rows:[['name','salary'],['Asha',50000],['Chitra',60000]], caption:'Result' }, result:'Two rows: Asha and Chitra.' },
  practice:{ q:'Write a query that returns the names of employees with a salary above 40000.', table:T(EMP,'Table: employees'), hint:'Use the greater-than operator.', solution:'SELECT name\nFROM employees\nWHERE salary > 40000;', explain:'Asha (50000), Chitra (60000) and Deepak (45000) qualify. Bilal and Esha earn exactly 40000, so they are excluded.' },
  interview:[
    { level:'Basic', q:'What does the WHERE clause do?', a:'It filters rows, keeping only those for which the condition is true.' },
    { level:'Intermediate', q:'Why can you not use an aggregate such as SUM in WHERE?', a:'WHERE runs before grouping, so aggregates do not exist yet. I use HAVING to filter on aggregates.' },
    { level:'Intermediate', q:'Why does WHERE salary = NULL return nothing?', a:'Comparing anything with NULL gives unknown, not true. I use IS NULL instead.' },
    { level:'Scenario', q:'A query returns too many rows and is slow. How can WHERE help?', a:'Filter as early as possible on indexed columns so the database reads fewer rows, and select only the columns needed.' }
  ],
  mcq:[
    { q:'What does WHERE filter?', o:['Rows','Columns','Tables','Databases'], a:0, why:'WHERE keeps or drops rows.' },
    { q:'Which operator means not equal?', o:['<>','=!','==','!!'], a:0, why:'<> or != means not equal.' },
    { q:'Can WHERE use SUM()?', o:['No, use HAVING','Yes','Only in MySQL','Only with GROUP BY'], a:0, why:'WHERE runs before aggregation.' },
    { q:'How do you write a text condition?', o:['city = \'Pune\'','city = Pune','city == "Pune"','city := Pune'], a:0, why:'Text goes in single quotes.' },
    { q:'Which rows does WHERE keep?', o:['Those where the condition is TRUE','Those where it is NULL','All rows','Only the first'], a:0, why:'FALSE and NULL rows are dropped.' }
  ],
  recap:['WHERE keeps rows where the condition is TRUE.','It runs before GROUP BY, so no aggregates.','Use IS NULL, not = NULL.']
},

/* --- sql-and-or-not --- */
'sql-and-or-not': {
  title:'AND, OR and NOT', tagline:'Combine several conditions in a WHERE clause.',
  prereq:['where'],
  what:['**AND** needs both conditions to be true.','**OR** needs at least one to be true.','**NOT** reverses a condition.'],
  why:['Real questions have several filters.','Wrong brackets are a classic source of wrong results.'],
  syntax:{ code:'WHERE condition1 AND condition2\nWHERE condition1 OR condition2\nWHERE NOT condition', parts:[['AND','Both must be true.'],['OR','Either may be true.'],['NOT','Flips true and false.']] },
  points:['Order of evaluation: **NOT, then AND, then OR**.','Use brackets to make the logic clear.','`NOT dept_id = 10` is the same as `dept_id <> 10`.','AND narrows the result; OR widens it.','With NULL, a condition can be unknown, and the row is dropped.'],
  mistakes:['Mixing AND and OR without brackets.','Using OR when the rule says "both".','Writing `dept_id = 10 OR 20`.'],
  example:{ title:'Two conditions', scenario:'You want employees in department 20 who earn at least 40000.',
    table:withHl(EMP,{'C3':'hit','D3':'hit','C6':'hit','D6':'hit'},'Table: employees'), task:'Return the name and salary.', formula:'SELECT name, salary\nFROM employees\nWHERE dept_id = 20 AND salary >= 40000;',
    steps:['dept_id = 20 keeps Bilal and Esha.','salary >= 40000 is true for both.'],
    table2:{ rows:[['name','salary'],['Bilal',40000],['Esha',40000]], caption:'Result' }, result:'Two rows: Bilal and Esha.' },
  practice:{ q:'What do these two queries return? (a) WHERE dept_id = 20 OR dept_id = 10 AND salary > 55000  (b) WHERE (dept_id = 20 OR dept_id = 10) AND salary > 55000', table:T(EMP,'Table: employees'), hint:'AND is evaluated before OR.', solution:'(a) Bilal, Chitra and Esha\n(b) Chitra only', explain:'In (a), AND runs first: dept 10 AND salary above 55000 gives Chitra, and OR adds every dept 20 employee (Bilal and Esha). In (b), the brackets make both departments subject to the salary condition, so only Chitra passes.' },
  interview:[
    { level:'Basic', q:'What is the difference between AND and OR?', a:'AND requires all conditions to be true, so it narrows results. OR requires at least one, so it widens results.' },
    { level:'Intermediate', q:'What is the order of precedence of NOT, AND and OR?', a:'NOT first, then AND, then OR. I use brackets so the meaning is obvious.' },
    { level:'Intermediate', q:'What is wrong with WHERE city = \'Pune\' OR \'Delhi\'?', a:'The second part is not a condition on city. The right forms are city = \'Pune\' OR city = \'Delhi\', or city IN (\'Pune\',\'Delhi\').' },
    { level:'Scenario', q:'A rule says: sales or finance staff earning above 45000. Write the condition.', a:'WHERE (dept_id = 10 OR dept_id = 20) AND salary > 45000. The brackets make the OR run before the AND.' }
  ],
  mcq:[
    { q:'Which runs first?', o:['AND','OR','Both together','Neither'], a:0, why:'AND has higher precedence than OR.' },
    { q:'AND returns a row when:', o:['Both conditions are true','Either is true','Both are false','Neither is NULL'], a:0, why:'All conditions must be true.' },
    { q:'`NOT dept_id = 10` is the same as:', o:['dept_id <> 10','dept_id = 10','dept_id > 10','dept_id IS NULL'], a:0, why:'NOT reverses the condition.' },
    { q:'Which is correct for Pune or Delhi?', o:['city IN (\'Pune\',\'Delhi\')','city = \'Pune\' OR \'Delhi\'','city = Pune, Delhi','city LIKE Pune Delhi'], a:0, why:'IN lists the allowed values.' },
    { q:'What makes mixed AND/OR clear?', o:['Brackets','More columns','Quotes','Aliases'], a:0, why:'Brackets set the grouping.' }
  ],
  recap:['AND needs all, OR needs any, NOT flips.','NOT, then AND, then OR; use brackets.','Write each condition completely.']
},

/* --- in-sql --- */
'in-sql': {
  title:'IN', tagline:'Match a column against a list of values.',
  prereq:['where'],
  what:['IN checks whether a value is in a list.','It is a shorter way to write several OR conditions.','The list can also come from a subquery.'],
  why:['Cleaner than a chain of ORs.','Common for filtering by several departments, cities or ids.'],
  syntax:{ code:'WHERE column IN (value1, value2, ...)\nWHERE column NOT IN (value1, value2, ...)', parts:[['IN (...)','True when the column equals any listed value.'],['NOT IN (...)','True when it equals none.']] },
  points:['`dept_id IN (10, 30)` equals `dept_id = 10 OR dept_id = 30`.','Works with text, numbers and dates.','With a subquery: `IN (SELECT ...)`.','**NOT IN with a NULL in the list returns no rows.**','Prefer NOT EXISTS when NULLs are possible.'],
  mistakes:['NOT IN on a list that contains NULL.','Very long lists instead of a join.','Forgetting brackets.'],
  example:{ title:'Several departments', scenario:'You want employees of departments 10 and 30.',
    table:withHl(EMP,{'C2':'hit','C4':'hit','C5':'hit'},'Table: employees'), task:'Return name and dept_id.', formula:'SELECT name, dept_id\nFROM employees\nWHERE dept_id IN (10, 30);',
    steps:['IN (10, 30) keeps rows where dept_id is 10 or 30.','Farhan\'s NULL does not match any value.'],
    table2:{ rows:[['name','dept_id'],['Asha',10],['Chitra',10],['Deepak',30]], caption:'Result' }, result:'Three rows: Asha, Chitra and Deepak.' },
  practice:{ q:'Write a query for the employees named Asha or Esha using IN.', table:T(EMP,'Table: employees'), hint:'Put the names in single quotes inside the brackets.', solution:'SELECT *\nFROM employees\nWHERE name IN (\'Asha\', \'Esha\');', explain:'Two rows are returned, one for each name.' },
  interview:[
    { level:'Basic', q:'What does IN do?', a:'It tests whether a value matches any value in a list, as a shorter form of several OR conditions.' },
    { level:'Intermediate', q:'What is the danger of NOT IN with NULLs?', a:'If the list or subquery contains a NULL, NOT IN returns no rows, because the comparison with NULL is unknown. I use NOT EXISTS or filter the NULLs out.' },
    { level:'Intermediate', q:'IN versus a JOIN: when do you choose which?', a:'IN is simple for a short list or a one-column check. A JOIN is better when I also need columns from the other table.' },
    { level:'Scenario', q:'Find employees in the Sales or Finance departments using department names.', a:'WHERE dept_id IN (SELECT dept_id FROM departments WHERE dept_name IN (\'Sales\',\'Finance\')). A join would also work.' }
  ],
  mcq:[
    { q:'`dept_id IN (10, 30)` is the same as:', o:['dept_id = 10 OR dept_id = 30','dept_id = 10 AND dept_id = 30','dept_id BETWEEN 10 AND 30','dept_id > 10'], a:0, why:'IN is shorthand for ORs.' },
    { q:'What does NOT IN do when the list contains NULL?', o:['Returns no rows','Returns all rows','Returns an error','Ignores NULL'], a:0, why:'The comparison becomes unknown for every row.' },
    { q:'Can IN take a subquery?', o:['Yes','No','Only numbers','Only in MySQL 5'], a:0, why:'IN (SELECT ...) is common.' },
    { q:'Which is valid?', o:['name IN (\'Asha\',\'Esha\')','name IN \'Asha\',\'Esha\'','name = (\'Asha\',\'Esha\')','name IN [Asha, Esha]'], a:0, why:'Values go in brackets, with quotes for text.' },
    { q:'A safer alternative to NOT IN is:', o:['NOT EXISTS','NOT LIKE','NOT BETWEEN','NOT NULL'], a:0, why:'NOT EXISTS is not affected by NULLs.' }
  ],
  recap:['IN matches a column against a list.','It replaces several ORs.','Beware NOT IN with NULLs.']
},

/* --- between-sql --- */
'between-sql': {
  title:'BETWEEN', tagline:'Filter values within a range, ends included.',
  prereq:['where'],
  what:['BETWEEN checks whether a value lies in a range.','Both ends are **included**.','It works with numbers, dates and text.'],
  why:['Salary bands, date ranges and price ranges.'],
  syntax:{ code:'WHERE column BETWEEN low AND high', parts:[['low','The smallest accepted value.'],['high','The largest accepted value.']] },
  points:['`BETWEEN 40000 AND 50000` equals `>= 40000 AND <= 50000`.','The lower value must come first.','Dates: `BETWEEN \'2026-02-01\' AND \'2026-02-28\'`.','With datetimes, the end date means midnight, so later times that day are missed.','`NOT BETWEEN` excludes the range.'],
  mistakes:['Putting the high value first, which returns nothing.','Forgetting that the ends are included.','Using BETWEEN with datetimes and missing the last day.'],
  example:{ title:'A salary band', scenario:'You want employees earning from 40000 to 50000.',
    table:withHl(EMP,{'D2':'hit','D3':'hit','D5':'hit','D6':'hit'},'Table: employees'), task:'Return name and salary.', formula:'SELECT name, salary\nFROM employees\nWHERE salary BETWEEN 40000 AND 50000;',
    steps:['40000 and 50000 are both included.','Chitra (60000) and Farhan (35000) are outside the range.'],
    table2:{ rows:[['name','salary'],['Asha',50000],['Bilal',40000],['Deepak',45000],['Esha',40000]], caption:'Result' }, result:'Four rows.' },
  practice:{ q:'Write a query for the orders placed in February 2026.', table:T(ORD,'Table: orders'), hint:'Use BETWEEN with the first and last day.', solution:'SELECT *\nFROM orders\nWHERE order_date BETWEEN \'2026-02-01\' AND \'2026-02-28\';', explain:'Orders 3 (2026-02-03) and 4 (2026-02-21) fall in the range.' },
  interview:[
    { level:'Basic', q:'Is BETWEEN inclusive?', a:'Yes, both the low and high values are included.' },
    { level:'Intermediate', q:'What happens if you write BETWEEN 50000 AND 40000?', a:'It returns no rows, because the low value must come first. The condition means >= 50000 and <= 40000, which is impossible.' },
    { level:'Intermediate', q:'What is the risk of BETWEEN on a DATETIME column?', a:'\'2026-02-28\' means midnight, so rows later that day are missed. I use >= start and < the next day instead.' },
    { level:'Scenario', q:'Get all orders of a month robustly.', a:'WHERE order_date >= \'2026-02-01\' AND order_date < \'2026-03-01\'. It works for DATE and DATETIME and handles any month length.' }
  ],
  mcq:[
    { q:'Are the ends of BETWEEN included?', o:['Yes','No','Only the low end','Only the high end'], a:0, why:'BETWEEN is inclusive.' },
    { q:'What does BETWEEN 50 AND 10 return?', o:['No rows','All rows','Rows from 10 to 50','An error'], a:0, why:'The range is impossible.' },
    { q:'BETWEEN 40000 AND 50000 equals:', o:['>= 40000 AND <= 50000','> 40000 AND < 50000','>= 40000 OR <= 50000','= 40000'], a:0, why:'Inclusive ends.' },
    { q:'Which excludes a range?', o:['NOT BETWEEN','OUTSIDE','EXCEPT BETWEEN','BETWEEN NOT'], a:0, why:'NOT BETWEEN.' },
    { q:'What is safer for datetime months?', o:['>= start AND < next month start','BETWEEN with last day','LIKE','IN'], a:0, why:'It includes the whole last day.' }
  ],
  recap:['BETWEEN includes both ends.','Low value first.','For datetimes, use >= and < the next day.']
},

/* --- like-sql --- */
'like-sql': {
  title:'LIKE', tagline:'Search text with patterns.',
  prereq:['where'],
  what:['LIKE matches text against a pattern.','`%` stands for any number of characters.','`_` stands for exactly one character.'],
  why:['Find names starting with a letter, emails from a domain, codes with a pattern.'],
  syntax:{ code:'WHERE column LIKE \'pattern\'', parts:[['%','Any number of characters, including none.'],['_','Exactly one character.']] },
  points:['`\'A%\'` starts with A; `\'%a\'` ends with a; `\'%an%\'` contains an.','`\'_s%\'` has s as the second letter.','In MySQL, LIKE is not case sensitive by default.','`NOT LIKE` excludes matches.','A leading `%` stops the database from using an index.','Escape a real percent sign with a backslash.'],
  mistakes:['Using = with wildcards.','A leading % on huge tables.','Forgetting the quotes.'],
  example:{ title:'Names ending in a', scenario:'You want employees whose name ends with the letter a.',
    table:withHl(EMP,{'B2':'hit','B4':'hit','B6':'hit'},'Table: employees'), task:'Return the matching names.', formula:'SELECT name\nFROM employees\nWHERE name LIKE \'%a\';',
    steps:['\'%a\' means any characters followed by a.','Asha, Chitra and Esha end with a.'],
    table2:{ rows:[['name'],['Asha'],['Chitra'],['Esha']], caption:'Result' }, result:'Three rows.' },
  practice:{ q:'Write a query for the names whose second letter is s.', table:T(EMP,'Table: employees'), hint:'Use an underscore for the first letter and % for the rest.', solution:'SELECT name\nFROM employees\nWHERE name LIKE \'_s%\';', explain:'The underscore matches one character and s must follow. Asha and Esha match.' },
  interview:[
    { level:'Basic', q:'What do % and _ mean in LIKE?', a:'% matches any number of characters, including none. _ matches exactly one character.' },
    { level:'Intermediate', q:'Is LIKE case sensitive?', a:'In MySQL with the default collation it is not. In PostgreSQL LIKE is case sensitive, and ILIKE is the insensitive form.' },
    { level:'Intermediate', q:'Why is LIKE \'%text\' slow on large tables?', a:'A leading wildcard stops the database from using an index, so it scans every row. A pattern with a fixed start can use the index.' },
    { level:'Scenario', q:'Find all customers with a Gmail address.', a:'WHERE email LIKE \'%@gmail.com\'. The percent sign matches any username before the domain.' }
  ],
  mcq:[
    { q:'What does % match?', o:['Any number of characters','Exactly one character','A digit','A space'], a:0, why:'% is the multi-character wildcard.' },
    { q:'What does \'A%\' match?', o:['Text starting with A','Text ending with A','Text containing A only','Exactly A'], a:0, why:'The pattern fixes the start.' },
    { q:'What does _ match?', o:['Exactly one character','Any characters','Nothing','A number'], a:0, why:'_ is a single-character wildcard.' },
    { q:'Which finds names containing "an"?', o:['LIKE \'%an%\'','LIKE \'an\'','LIKE \'an%\'','= \'%an%\''], a:0, why:'Wildcards on both sides.' },
    { q:'Why is a leading % slow?', o:['Indexes cannot be used','It sorts the table','It locks the table','It copies rows'], a:0, why:'The database must scan every value.' }
  ],
  recap:['LIKE uses % for many characters and _ for one.','Default MySQL matching ignores case.','Avoid leading % on big tables.']
},

/* --- is-null --- */
'is-null': {
  title:'IS NULL and IS NOT NULL', tagline:'Find missing values correctly.',
  prereq:['where'],
  what:['NULL means a value is missing or unknown.','NULL is not zero and not an empty string.','Use IS NULL to test for it.'],
  why:['Missing data is everywhere in real tables.','A wrong NULL test silently returns no rows.'],
  syntax:{ code:'WHERE column IS NULL\nWHERE column IS NOT NULL', parts:[['IS NULL','True when the value is missing.'],['IS NOT NULL','True when a value exists.']] },
  points:['`= NULL` is never true; always use `IS NULL`.','Any comparison with NULL is unknown, not true or false.','Aggregates such as SUM and AVG ignore NULLs; `COUNT(*)` does not.','`COUNT(column)` counts only non-NULL values.','Use COALESCE to replace NULL with a value.'],
  mistakes:['Writing `= NULL` or `<> NULL`.','Confusing NULL with an empty string or 0.','Forgetting NULLs when counting.'],
  example:{ title:'Employees without a department', scenario:'Farhan has no department yet.',
    table:withHl(EMP,{'C7':'hit'},'Table: employees'), task:'Find employees whose dept_id is missing.', formula:'SELECT name\nFROM employees\nWHERE dept_id IS NULL;',
    steps:['IS NULL tests for a missing value.','Only Farhan has no dept_id.'],
    table2:{ rows:[['name'],['Farhan']], caption:'Result' }, result:'One row: Farhan. WHERE dept_id = NULL would return nothing.' },
  practice:{ q:'Write a query that returns employees who do have a manager.', table:T(EMP,'Table: employees'), hint:'Test manager_id with IS NOT NULL.', solution:'SELECT name\nFROM employees\nWHERE manager_id IS NOT NULL;', explain:'Asha is the only employee with a missing manager, so five rows are returned.' },
  interview:[
    { level:'Basic', q:'What is NULL in SQL?', a:'A marker for a missing or unknown value. It is not zero and not an empty string.' },
    { level:'Basic', q:'Why does WHERE column = NULL return nothing?', a:'Comparing with NULL gives unknown, not true. The right test is IS NULL.' },
    { level:'Intermediate', q:'How do aggregates treat NULL?', a:'SUM, AVG, MIN, MAX and COUNT(column) ignore NULLs. COUNT(*) counts all rows.' },
    { level:'Scenario', q:'A report shows blank departments. How do you show "Unassigned"?', a:'COALESCE(dept_name, \'Unassigned\') replaces NULL with a label, usually after a LEFT JOIN.' }
  ],
  mcq:[
    { q:'How do you test for a missing value?', o:['IS NULL','= NULL','== NULL','LIKE NULL'], a:0, why:'Only IS NULL works.' },
    { q:'Is NULL the same as 0?', o:['No','Yes','Only for numbers','Only in MySQL'], a:0, why:'NULL means unknown, 0 is a value.' },
    { q:'Does COUNT(column) count NULLs?', o:['No','Yes','Only the first','Only text'], a:0, why:'It counts non-NULL values.' },
    { q:'Does COUNT(*) count rows with NULLs?', o:['Yes','No','Only if all NULL','Never'], a:0, why:'It counts all rows.' },
    { q:'What does `5 = NULL` give?', o:['Unknown (not true)','TRUE','FALSE only','5'], a:0, why:'Comparison with NULL is unknown.' }
  ],
  recap:['Use IS NULL and IS NOT NULL.','NULL is unknown, not zero or empty.','Aggregates ignore NULL, except COUNT(*).']
},

/* --- order-by --- */
'order-by': {
  title:'ORDER BY', tagline:'Sort the result by one or more columns.',
  prereq:['select'],
  what:['ORDER BY sorts the rows of the result.','ASC is smallest first (default). DESC is largest first.','You can sort by several columns.'],
  why:['Top and bottom lists, alphabetical reports and stable output.','Without it, row order is not guaranteed.'],
  syntax:{ code:'SELECT columns\nFROM table_name\nORDER BY column1 [ASC|DESC], column2 [ASC|DESC];', parts:[['column1','The main sort column.'],['column2','Breaks ties from the first column.']] },
  points:['Without ORDER BY, the order is **not guaranteed**.','ASC is the default.','NULLs sort first in ASC order in MySQL.','You can use column aliases or positions (ORDER BY 2).','Add a second column to break ties.','ORDER BY runs near the end of the query.'],
  mistakes:['Relying on the natural order.','Ties left unresolved.','Sorting huge results you do not need.'],
  example:{ title:'Highest salary first', scenario:'You want employees from the highest to the lowest salary, with names breaking ties.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Return name and salary sorted.', formula:'SELECT name, salary\nFROM employees\nORDER BY salary DESC, name ASC;',
    steps:['salary DESC puts the largest salary first.','Bilal and Esha both earn 40000, so name ASC puts Bilal first.'],
    table2:{ rows:[['name','salary'],['Chitra',60000],['Asha',50000],['Deepak',45000],['Bilal',40000],['Esha',40000],['Farhan',35000]], caption:'Result' }, result:'Chitra has the highest salary and Farhan the lowest.' },
  practice:{ q:'Write a query that lists customers alphabetically by city, then by name.', table:T(CUST,'Table: customers'), hint:'Two columns in ORDER BY.', solution:'SELECT *\nFROM customers\nORDER BY city, name;', explain:'Cities are sorted A to Z: Delhi, Mumbai, Pune. In Pune, Asha comes before Chitra.' },
  interview:[
    { level:'Basic', q:'What does ORDER BY do and what is the default direction?', a:'It sorts the result. The default is ascending (ASC).' },
    { level:'Intermediate', q:'Is the order guaranteed without ORDER BY?', a:'No. Rows can come back in any order, so I always add ORDER BY when order matters.' },
    { level:'Intermediate', q:'How do you break ties?', a:'Add more sort columns, for example ORDER BY salary DESC, name ASC.' },
    { level:'Scenario', q:'Show the 3 highest-paid employees.', a:'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3; I add a second sort column if ties matter.' }
  ],
  mcq:[
    { q:'What is the default order?', o:['ASC','DESC','Random','By id'], a:0, why:'ASC is the default.' },
    { q:'Is row order guaranteed without ORDER BY?', o:['No','Yes','Only in MySQL','Only for numbers'], a:0, why:'The database may return rows in any order.' },
    { q:'How do you sort largest first?', o:['ORDER BY col DESC','ORDER BY col ASC','SORT col','ORDER col BIG'], a:0, why:'DESC reverses the order.' },
    { q:'What does a second sort column do?', o:['Breaks ties','Replaces the first','Filters rows','Joins tables'], a:0, why:'It orders rows that tie on the first column.' },
    { q:'Where does ORDER BY go?', o:['At the end (before LIMIT)','Right after SELECT','Before FROM','After HAVING only'], a:0, why:'It comes late in the statement.' }
  ],
  recap:['ORDER BY sorts; ASC is default.','Always use it when order matters.','Add columns to break ties.']
},

/* --- limit-sql --- */
'limit-sql': {
  title:'LIMIT and OFFSET', tagline:'Return only the first rows, or a page of rows.',
  prereq:['order-by'],
  what:['LIMIT keeps only the first n rows of a result.','OFFSET skips rows first, which is how paging works.','Use it with ORDER BY for top-n lists.'],
  why:['Top 3 salaries, latest 10 orders, page 2 of a report.','Faster previews of large tables.'],
  syntax:{ code:'SELECT columns\nFROM table_name\nORDER BY column\nLIMIT n OFFSET m;', parts:[['LIMIT n','How many rows to return.'],['OFFSET m','How many rows to skip first.']] },
  points:['Always combine with ORDER BY, or the rows returned are arbitrary.','`LIMIT 3 OFFSET 3` returns rows 4 to 6.','MySQL also allows `LIMIT 3, 3` (offset, count).','**SQL Server** uses `TOP 3`; **Oracle** uses `FETCH FIRST 3 ROWS ONLY`.','Large offsets get slow.'],
  mistakes:['Using LIMIT without ORDER BY.','Mixing up the order in LIMIT offset, count.','Using LIMIT in SQL Server.'],
  example:{ title:'Top three salaries', scenario:'You want the three highest-paid employees.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Return the top three by salary.', formula:'SELECT name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 3;',
    steps:['ORDER BY puts the highest salary first.','LIMIT 3 keeps the first three rows.'],
    table2:{ rows:[['name','salary'],['Chitra',60000],['Asha',50000],['Deepak',45000]], caption:'Result' }, result:'Chitra, Asha and Deepak.' },
  practice:{ q:'Write a query for the next three employees (rows 4 to 6) in the same salary order, with ties broken by name.', table:T(EMP,'Table: employees'), hint:'Add OFFSET 3.', solution:'SELECT name, salary\nFROM employees\nORDER BY salary DESC, name\nLIMIT 3 OFFSET 3;', explain:'The first three rows are skipped. The result is Bilal, Esha and Farhan.' },
  interview:[
    { level:'Basic', q:'What does LIMIT do?', a:'It restricts the result to the first n rows. With OFFSET, it skips rows first.' },
    { level:'Intermediate', q:'Why is ORDER BY needed with LIMIT?', a:'Without ORDER BY the database may return any rows, so the top n are not meaningful.' },
    { level:'Intermediate', q:'How do you write a top-3 query in SQL Server?', a:'SELECT TOP 3 name, salary FROM employees ORDER BY salary DESC; SQL Server uses TOP instead of LIMIT.' },
    { level:'Scenario', q:'How do you build page 3 of a report with 10 rows per page?', a:'LIMIT 10 OFFSET 20, with a stable ORDER BY, because page 3 skips the first 20 rows.' }
  ],
  mcq:[
    { q:'What does `LIMIT 3` do?', o:['Returns at most 3 rows','Skips 3 rows','Returns 3 columns','Deletes 3 rows'], a:0, why:'It caps the number of rows.' },
    { q:'What does `LIMIT 3 OFFSET 3` return?', o:['Rows 4 to 6','Rows 1 to 3','Rows 3 to 6','Row 3 only'], a:0, why:'The first three rows are skipped.' },
    { q:'Which keyword does SQL Server use?', o:['TOP','LIMIT','FIRST','ROWNUM'], a:0, why:'SELECT TOP n.' },
    { q:'Why pair LIMIT with ORDER BY?', o:['Otherwise rows are arbitrary','It is faster','It is required by syntax','It adds columns'], a:0, why:'The top n only makes sense in a defined order.' },
    { q:'Which gives page 2 with 5 rows per page?', o:['LIMIT 5 OFFSET 5','LIMIT 2 OFFSET 5','LIMIT 5 OFFSET 2','LIMIT 10'], a:0, why:'Skip the first 5 rows.' }
  ],
  recap:['LIMIT caps rows; OFFSET skips rows.','Always use ORDER BY with it.','SQL Server: TOP; Oracle: FETCH FIRST.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- where --- */
DEEP['where'] = {
  level:'Beginner to Intermediate',
  tldr:'WHERE keeps only the rows where the condition is **TRUE**. Rows where it is FALSE or UNKNOWN are dropped.',
  intuition:{ text:[
    'A table may have millions of rows, but a question usually concerns a few of them. WHERE is the filter that decides which rows take part in everything that follows: grouping, sorting, joining.',
    'The word to remember is TRUE. A row stays only when the condition is definitely true. If the condition is false, or unknown because of a NULL, the row leaves. That single rule explains most surprising WHERE results.'
  ], analogy:'A security gate that only lets in people whose pass is valid. An unreadable pass is treated as invalid.' },
  how:[
    'The database reads the rows from FROM (and any joins).',
    'It evaluates the WHERE condition for each row.',
    'Rows where it is TRUE are kept. FALSE and UNKNOWN (NULL) rows are dropped.',
    'Only then do GROUP BY, HAVING, SELECT and ORDER BY run.',
    'Because WHERE runs early, filtering well makes everything after it cheaper.'
  ],
  diagrams:[
    { type:'flow', arrows:['WHERE salary > 45000'], panels:[
      { title:'employees', rows:[['name','salary'],['Asha',50000],['Bilal',40000],['Chitra',60000],['Deepak',45000],['Esha',40000],['Farhan',35000]], hl:{2:'miss',4:'miss',5:'miss',6:'miss'} },
      { title:'Result', rows:[['name','salary'],['Asha',50000],['Chitra',60000]], hl:{1:'hit',2:'hit'}, note:'Deepak earns exactly 45000, which is not greater than 45000.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Operators, text and NULL', scenario:'Combine different kinds of conditions.', table:T(EMP,'Table: employees'), task:'Employees not in department 20, including those with no department.', formula:'SELECT name, dept_id\nFROM employees\nWHERE dept_id <> 20\n   OR dept_id IS NULL;', steps:['`dept_id <> 20` is UNKNOWN for Farhan (NULL), so he would be dropped.','The OR dept_id IS NULL branch keeps him.'], table2:{ rows:[['name','dept_id'],['Asha',10],['Chitra',10],['Deepak',30],['Farhan','NULL']], caption:'Result' }, result:'Four rows. Without the IS NULL branch, Farhan would be missing.' },
    { level:'Business case', title:'A realistic combined filter', scenario:'Finance wants orders from customers 101 and 102, placed from February to March 2026, above 800.', table:T(ORD,'Table: orders'), task:'Combine IN, a date range and a comparison.',
      formula:'SELECT order_id, customer_id, order_date, amount\nFROM orders\nWHERE customer_id IN (101, 102)\n  AND order_date >= \'2026-02-01\'\n  AND order_date <  \'2026-04-01\'\n  AND amount > 800;', steps:['IN keeps customers 101 and 102.','The date range keeps orders 3, 5 and 6.','amount > 800 drops order 6 (600).'], table2:{ rows:[['order_id','customer_id','order_date','amount'],[3,101,'2026-02-03',1500],[5,102,'2026-03-09',900]], caption:'Result' }, result:'Two orders remain. A date range with `>=` and `<` is safer than BETWEEN for DATETIME columns.' }
  ],
  edge:[
    { t:'NULL comparisons are UNKNOWN', d:'`dept_id <> 20` drops NULL rows, and `dept_id = NULL` never matches. Use `IS NULL` and `IS NOT NULL`.' },
    { t:'Aggregates are not allowed', d:'`WHERE SUM(amount) > 100` fails because groups do not exist yet. Use HAVING.' },
    { t:'Aliases are not available', d:'A SELECT alias cannot be used in WHERE. Repeat the expression or use a CTE.' },
    { t:'Precedence of AND and OR', d:'AND is evaluated before OR. Use brackets whenever you mix them.' },
    { t:'Functions on indexed columns', d:'`WHERE YEAR(order_date) = 2026` prevents index use. A date range does not.' },
    { t:'Type and case', d:'Comparing text with numbers may cause implicit conversion. In MySQL, text comparison is case-insensitive by default.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return employees in department 10 or 20 who earn at least 45000.', table:T(EMP,'Table: employees'), hint:'Brackets around the OR.', solution:'SELECT name, dept_id, salary\nFROM employees\nWHERE dept_id IN (10, 20)\n  AND salary >= 45000;', explain:'Asha (50000) and Chitra (60000) qualify. Bilal and Esha earn 40000.' },
    { level:'Interview', q:'Explain why `WHERE dept_id <> 20` does not return the employee with a NULL department, and fix it.', table:T(EMP,'Table: employees'), hint:'Three-valued logic.', solution:'NULL <> 20 evaluates to UNKNOWN, not TRUE, so the row is dropped.\nFix: WHERE dept_id <> 20 OR dept_id IS NULL, or WHERE COALESCE(dept_id, 0) <> 20.', explain:'Naming UNKNOWN shows you understand NULL logic, which is a favourite topic.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does WHERE do and when does it run?', a:'WHERE filters rows by a condition. It runs after FROM and JOIN and before GROUP BY, so it cannot use aggregates, and it reduces the rows the rest of the query must process.',
      follow:[ { q:'Why can it not use a column alias?', a:'The alias is created in SELECT, which runs after WHERE.' } ] },
    { level:'Intermediate', q:'What is the difference between WHERE and HAVING?', a:'WHERE filters rows before grouping and cannot use aggregates. HAVING filters groups after aggregation and can.' },
    { level:'Scenario', q:'A query with a WHERE condition on a large table is slow. What do you check?', a:'Whether the filtered column is indexed, whether a function is wrapped around it, whether a leading wildcard is used in LIKE, and the plan shown by EXPLAIN. I also select only the columns I need.',
      tradeoff:'Adding an index speeds up reads but slows writes, so index columns that are filtered often.' }
  ],
  ref:{ headers:['Goal','Write'], rows:[['Equal / not equal','`=`  `<>`'],['Range','`BETWEEN a AND b`'],['List','`IN (...)`'],['Pattern','`LIKE \'A%\'`'],['Missing','`IS NULL`'],['Combine','`AND`, `OR`, `NOT` with brackets']] },
  related:['having','sql-and-or-not','is-null','execution-order']
};

/* --- sql-and-or-not --- */
D('sql-and-or-not',{ l:'Beginner', t:'AND needs all conditions, OR needs any, and NOT reverses one. AND runs before OR, so use brackets.',
  i:['A real question has several conditions. AND narrows the result, OR widens it, and NOT excludes.','Operator precedence is the trap: without brackets, `A OR B AND C` means `A OR (B AND C)`, which is rarely what the sentence meant.'], a:'A club entry rule written in words, with brackets to show the grouping.',
  h:['Write each condition completely.','Combine with AND, OR and NOT.','Group with brackets when mixing AND and OR.','Test with rows that should pass and fail.'],
  d:[FL([''],[{ title:'Precedence', rows:[['Order','Operator'],[1,'NOT'],[2,'AND'],[3,'OR']], note:'Use brackets to override.' }])],
  x:[X('Variation','The precedence trap','(a) dept 20 OR dept 10 AND salary > 55000, versus (b) with brackets.','Compare the results.','(a) WHERE dept_id = 20 OR dept_id = 10 AND salary > 55000\n(b) WHERE (dept_id = 20 OR dept_id = 10) AND salary > 55000',['(a): AND first, so dept 10 with salary above 55000, plus all of dept 20.','(b): both departments must pass the salary test.'],'(a) returns Bilal, Chitra and Esha. (b) returns Chitra only.',T(EMP,'Table: employees')),
     X('Business case','A combined eligibility rule','Customers eligible: city Pune or Delhi, and at least one order over 1000.','Use brackets and EXISTS.','SELECT name FROM customers c\nWHERE c.city IN (\'Pune\', \'Delhi\')\n  AND EXISTS (SELECT 1 FROM orders o\n              WHERE o.customer_id = c.customer_id AND o.amount > 1000);',['IN is a tidy OR on one column.','EXISTS checks the order condition.'],'Only Asha qualifies.',T(CUST,'Table: customers'))],
  e:[['AND before OR','Brackets make the grouping explicit.'],['NULL in conditions','A condition with NULL is UNKNOWN, and the row is dropped.'],['OR across columns and indexes','OR can prevent index use. Consider UNION.'],['NOT with NULL','`NOT (x = 1)` is still UNKNOWN for NULL x.']],
  p:[P('Medium','Employees in dept 10 or 20 earning at least 45000.','Brackets around OR.','SELECT name FROM employees WHERE dept_id IN (10, 20) AND salary >= 45000;','Asha and Chitra.',T(EMP,'Table: employees')),
     P('Interview','Order of precedence of NOT, AND, OR?','Highest first.','NOT, then AND, then OR.','Add: use brackets anyway.')],
  q:[Q('Basic','AND versus OR?','AND needs all conditions true, OR needs at least one.',{ f:[['What runs first?','AND.']] }),
     Q('Scenario','A rule is "A and either B or C".','WHERE A AND (B OR C).',{ t:'Brackets prevent misreading.' })],
  r:RT(['Operator','Meaning'],[['`AND`','All true'],['`OR`','Any true'],['`NOT`','Reverse'],['Order','NOT, AND, OR']]), rel:['where','in-sql','is-null','exists-sql'] });

/* --- in-sql --- */
D('in-sql',{ l:'Beginner', t:'IN matches a column against a list. NOT IN fails silently when the list contains NULL.',
  i:['IN is shorthand for several OR conditions on one column. It reads naturally: department in 10 or 30.','The trap is NOT IN with a NULL in the list: the comparison becomes UNKNOWN for every row and nothing is returned.'], a:'A guest list: you are in if your name is on it.',
  h:['Write `column IN (value1, value2, ...)`.','Or use a subquery: `IN (SELECT ...)`.','`NOT IN` excludes the listed values.','Check the list for NULLs before using NOT IN.'],
  d:[FL(['IN (10, 30)'],[{ title:'employees', rows:[['name','dept_id'],['Asha',10],['Bilal',20],['Deepak',30]], hl:{2:'miss'} },{ title:'Result', rows:[['name','dept_id'],['Asha',10],['Deepak',30]], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','The NOT IN trap','Employees not in the departments of Farhan (his dept_id is NULL).','See the empty result.','SELECT name FROM employees\nWHERE dept_id NOT IN (SELECT dept_id FROM employees WHERE name = \'Farhan\');',['The subquery returns NULL.','NOT IN with NULL is never true.'],'No rows are returned. NOT EXISTS would work correctly.',T(EMP,'Table: employees')),
     X('Business case','IN with a subquery','Employees in departments named Sales or Finance.','Look up department ids first.','SELECT name FROM employees\nWHERE dept_id IN (\n  SELECT dept_id FROM departments\n  WHERE dept_name IN (\'Sales\', \'Finance\'));',['The subquery returns 10 and 20.'],'Asha, Bilal, Chitra and Esha.',T(DEPT,'Table: departments'))],
  e:[['NOT IN and NULL','Returns no rows if the list has a NULL. Use NOT EXISTS.'],['NULL on the left','`NULL IN (...)` is UNKNOWN, so the row is dropped.'],['Long lists','Hundreds of values are better in a join with a table.'],['Type matching','Compare like with like.']],
  p:[P('Medium','Employees named Asha or Esha.','IN with text.','SELECT * FROM employees WHERE name IN (\'Asha\', \'Esha\');','Two rows.',T(EMP,'Table: employees')),
     P('Interview','Why can NOT IN return nothing?','NULL.','If the list contains NULL, x NOT IN (...) is UNKNOWN for every row. Use NOT EXISTS or filter NULLs.','This is a favourite question.')],
  q:[Q('Basic','What does IN do?','It tests whether a value matches any value in a list.',{ f:[['What is it equivalent to?','Several ORs on one column.']] }),
     Q('Scenario','Find customers not in a list of blocked ids.','NOT EXISTS against the blocked table, to be safe with NULLs.',{ t:'LEFT JOIN with IS NULL is another safe option.' })],
  r:RT(['Form','Note'],[['`IN (a, b)`','Short for ORs'],['`IN (subquery)`','List from another table'],['`NOT IN`','Dangerous with NULL'],['Alternative','`NOT EXISTS`']]), rel:['exists-sql','is-null','customers-without-orders','subquery-where'] });

/* --- between-sql --- */
D('between-sql',{ l:'Beginner', t:'BETWEEN includes both ends. For dates and datetimes, `>=` and `<` the next day is safer.',
  i:['BETWEEN checks a range, and both limits are included: BETWEEN 40000 AND 50000 means 40000 up to and including 50000.','The surprise appears with DATETIME columns: \'2026-02-28\' means midnight, so orders later that day are missed.'], a:'A ruler: both marks count.',
  h:['Write `column BETWEEN low AND high`.','The lower value must come first.','For datetimes, use `>= start AND < next day`.','`NOT BETWEEN` excludes the range.'],
  d:[FL(['BETWEEN 40000 AND 50000'],[{ title:'employees', rows:[['name','salary'],['Asha',50000],['Bilal',40000],['Chitra',60000],['Deepak',45000],['Farhan',35000]], hl:{3:'miss',5:'miss'} },{ title:'Result', rows:[['name','salary'],['Asha',50000],['Bilal',40000],['Deepak',45000]], hl:{1:'hit',2:'hit',3:'hit'} }])],
  x:[X('Variation','Dates','Orders placed in February 2026.','Use the first and last day.','SELECT * FROM orders\nWHERE order_date BETWEEN \'2026-02-01\' AND \'2026-02-28\';',['Both ends are included.'],'Orders 3 and 4.',T(ORD,'Table: orders')),
     X('Business case','The datetime trap','A column holds date and time. An order at 2026-02-28 15:30 is missed by BETWEEN.','Use a half-open range.','WHERE order_ts >= \'2026-02-01\'\n  AND order_ts <  \'2026-03-01\'',['The end is the start of the next month.'],'Every moment of February is included, whatever the time.')],
  e:[['Reversed bounds return nothing','BETWEEN 50 AND 10 is empty.'],['Inclusive','Both ends count, which can double count adjacent bands.'],['Datetime end date','The time part is midnight. Use a half-open range.'],['NULL','NULL is never between anything.']],
  p:[P('Medium','Orders placed in March 2026.','Use two dates.','WHERE order_date >= \'2026-03-01\' AND order_date < \'2026-04-01\'','Orders 5 and 6.',T(ORD,'Table: orders')),
     P('Interview','Why is BETWEEN risky for salary bands such as 0-50000 and 50000-100000?','Inclusive ends.','A value of exactly 50000 falls into both bands. Use half-open ranges: >= low AND < high.','Show the boundary value.')],
  q:[Q('Basic','Is BETWEEN inclusive?','Yes, both ends are included.',{ f:[['What if the low value comes second?','No rows.']] }),
     Q('Scenario','Monthly report on a DATETIME column.','>= first day AND < first day of next month.',{ t:'It works for any month length and any time of day.' })],
  r:RT(['Need','Write'],[['Inclusive range','`BETWEEN a AND b`'],['Half-open range','`>= a AND < b`'],['Outside','`NOT BETWEEN`'],['Dates','Prefer half-open']]), rel:['where','date-add','month-sql','sql-and-or-not'] });

/* --- like-sql --- */
DEEP['like-sql'] = {
  level:'Beginner to Intermediate',
  tldr:'LIKE matches text against a pattern: `%` stands for any number of characters, and `_` for exactly one.',
  intuition:{ text:[
    'Equality needs the exact text. But often you only know part of it: names that start with A, emails at a particular domain, product codes in a series. A pattern lets you describe the shape of the text instead of the exact value.',
    'The two wildcards are all you need. `%` is a stretchy placeholder that can match nothing or a long string, and `_` is a single-character placeholder.'
  ], analogy:'A crossword clue: "A _ _ A" (four letters, starting and ending with A) versus "A anything A".' },
  how:[
    'Write the pattern in single quotes: `LIKE \'A%\'`.',
    '`%` matches zero or more characters, `_` matches exactly one.',
    'The pattern must match the **whole** text, so `\'A%\'` means starts with A.',
    'Use `NOT LIKE` to exclude matches.',
    'Escape a real percent sign or underscore with a backslash: `\'50\\%\'`.'
  ],
  diagrams:[
    { type:'flow', panels:[
      { title:'Patterns on the names Asha, Esha, Chitra', rows:[['Pattern','Matches'],['\'A%\'','Asha'],['\'%a\'','Asha, Esha, Chitra'],['\'_s%\'','Asha, Esha'],['\'%tr%\'','Chitra']] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Contains, starts with, NOT LIKE', scenario:'Find customers whose city contains "un" and exclude names starting with A.', table:T(CUST,'Table: customers'), task:'Combine LIKE and NOT LIKE.', formula:'SELECT name, city\nFROM customers\nWHERE city LIKE \'%un%\'\n  AND name NOT LIKE \'A%\';', steps:['`%un%` matches Pune.','Asha is Pune, but her name starts with A, so she is excluded.'], table2:{ rows:[['name','city'],['Chitra','Pune']], caption:'Result' }, result:'Chitra is the only match.' },
    { level:'Business case', title:'Email domain analysis', scenario:'Marketing wants to separate company addresses from personal ones.', table:withHl({rows:[['id','email'],[1,'asha@example.com'],[2,'bilal@gmail.com'],[3,'chitra@example.com'],[4,'deepak@yahoo.com']]},{},'Table: subscribers'), task:'Find company emails (not Gmail or Yahoo).',
      formula:'SELECT id, email\nFROM subscribers\nWHERE email LIKE \'%@example.com\'\n  AND email NOT LIKE \'%@gmail.com\'\n  AND email NOT LIKE \'%@yahoo.com\';', steps:['The leading `%` matches any username.','The domain after @ is fixed.'], table2:{ rows:[['id','email'],[1,'asha@example.com'],[3,'chitra@example.com']], caption:'Result' }, result:'For a cleaner approach, store the domain in its own column, or extract it with SUBSTRING_INDEX.' }
  ],
  edge:[
    { t:'Leading % is slow', d:'`LIKE \'%text\'` cannot use an index and scans every row. `LIKE \'text%\'` can use one.' },
    { t:'Case sensitivity differs', d:'MySQL with the default collation ignores case. PostgreSQL LIKE is case sensitive (use ILIKE).' },
    { t:'Whole-text matching', d:'`LIKE \'A\'` matches only the text A. You need `LIKE \'A%\'` for "starts with".' },
    { t:'Wildcards in data', d:'To search for a literal `%` or `_`, escape it: `LIKE \'50\\%\'`, or use `ESCAPE`.' },
    { t:'NULL', d:'`NULL LIKE \'%\'` is UNKNOWN, so NULL rows never match, even with a pattern of just %.' },
    { t:'Better tools', d:'For serious text search, use full-text indexes or regular expressions (`REGEXP`).' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Find employees whose name has exactly four letters.', table:T(EMP,'Table: employees'), hint:'Four underscores.', solution:'SELECT name FROM employees WHERE name LIKE \'____\';', explain:'Asha has four letters. Bilal and Esha have five and four: Esha matches too, so the result is Asha and Esha.' },
    { level:'Interview', q:'Why is `WHERE name LIKE \'%sha\'` slow on a table with 50 million rows, and what can you do?', hint:'Indexes and wildcards.', solution:'The leading % means the database cannot use a B-tree index and scans every row.\nOptions: change the requirement to a prefix search; store a reversed copy of the column and search with a prefix; use a full-text index; or use a search engine.', explain:'Naming the cause (leading wildcard) and several remedies is a complete answer.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What do % and _ do in LIKE?', a:'% matches any number of characters, including none, and _ matches exactly one character. For example, LIKE \'A%\' matches text starting with A.',
      follow:[ { q:'How do you search for a literal percent sign?', a:'Escape it with a backslash, or use the ESCAPE clause.' } ] },
    { level:'Intermediate', q:'LIKE versus REGEXP?', a:'LIKE supports only two wildcards and is simpler. REGEXP supports full regular expressions for complex patterns, but is slower and less portable.' },
    { level:'Scenario', q:'Find all products whose code matches the format two letters, a dash, and three digits.', a:'LIKE can approximate it with \'__-___\', but cannot enforce letters and digits. REGEXP \'^[A-Z]{2}-[0-9]{3}$\' is exact.',
      tradeoff:'LIKE is index-friendly for prefixes, REGEXP is more precise but scans.' }
  ],
  ref:{ headers:['Pattern','Meaning'], rows:[['`\'A%\'`','Starts with A'],['`\'%a\'`','Ends with a'],['`\'%an%\'`','Contains an'],['`\'_s%\'`','Second letter is s'],['`NOT LIKE`','Excludes matches']] },
  related:['where','in-sql','is-null','query-optimization']
};

/* --- is-null --- */
DEEP['is-null'] = {
  level:'Intermediate',
  tldr:'NULL means **unknown**, so any comparison with it is unknown, not true or false. Always test with `IS NULL`.',
  intuition:{ text:[
    'A NULL is not zero and not an empty string. It is a marker that says "we do not know this value". Is an unknown number equal to another unknown number? You cannot say, so SQL answers UNKNOWN.',
    'SQL therefore uses three values instead of two: TRUE, FALSE and UNKNOWN. A WHERE clause keeps a row only when the condition is TRUE, so UNKNOWN rows are silently dropped. Most NULL bugs come from forgetting this.'
  ], analogy:'Asking "is the box on the table the same colour as the box in the cupboard?" when nobody has opened either box. The honest answer is "unknown".' },
  how:[
    'Comparisons (`=`, `<>`, `>`, `<`) with NULL return UNKNOWN.',
    '`IS NULL` and `IS NOT NULL` are the only tests that return TRUE or FALSE for NULL.',
    'WHERE and HAVING keep only rows where the condition is TRUE.',
    'Aggregates (SUM, AVG, MIN, MAX, COUNT(column)) skip NULLs; COUNT(*) does not.',
    'Arithmetic and most functions return NULL when an input is NULL.'
  ],
  diagrams:[
    { type:'flow', arrows:['evaluates to'], panels:[
      { title:'Expression', rows:[['Expression'],['NULL = NULL'],['5 > NULL'],['NULL <> 3'],['NULL IS NULL'],['NULL AND FALSE'],['NULL OR TRUE']] },
      { title:'Result', rows:[['Result'],['UNKNOWN'],['UNKNOWN'],['UNKNOWN'],['TRUE'],['FALSE'],['TRUE']], hl:{4:'hit'} }
    ], caption:'Only IS NULL gives a definite answer. AND/OR can still decide when one side is certain.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Three kinds of COUNT', scenario:'The dept_id column has one NULL. See how each COUNT treats it.', table:T(EMP,'Table: employees'), task:'Compare COUNT(*), COUNT(dept_id) and COUNT(DISTINCT dept_id).',
      formula:'SELECT COUNT(*) AS all_rows,\n       COUNT(dept_id) AS with_dept,\n       COUNT(DISTINCT dept_id) AS distinct_depts\nFROM employees;', steps:['COUNT(*) counts every row: 6.','COUNT(dept_id) skips the NULL: 5.','COUNT(DISTINCT dept_id) counts 10, 20 and 30: 3.'], table2:{ rows:[['all_rows','with_dept','distinct_depts'],[6,5,3]], caption:'Result' }, result:'6, 5 and 3. The gap between the first two is the number of NULLs.' },
    { level:'Business case', title:'A data completeness report', scenario:'Before analysing a table, a good analyst checks how complete each column is.', table:T(EMP,'Table: employees'), task:'Return the percentage of filled values for dept_id and manager_id.',
      formula:'SELECT COUNT(*) AS total_rows,\n       ROUND(COUNT(dept_id) * 100.0 / COUNT(*), 2) AS dept_filled_pct,\n       ROUND(COUNT(manager_id) * 100.0 / COUNT(*), 2) AS manager_filled_pct\nFROM employees;', steps:['COUNT(column) counts only non-NULL values.','5 of 6 rows have a department, and 5 of 6 have a manager.'], table2:{ rows:[['total_rows','dept_filled_pct','manager_filled_pct'],[6,83.33,83.33]], caption:'Result' }, result:'Both columns are 83.33% complete. Missing values like these should be explained or fixed before reporting.' }
  ],
  edge:[
    { t:'NOT IN with a NULL in the list returns nothing', d:'`dept_id NOT IN (10, NULL)` is never TRUE, so no rows come back. Use NOT EXISTS, or filter the NULLs out of the subquery.' },
    { t:'A NULL on the left side also drops out', d:'`dept_id NOT IN (30)` is UNKNOWN for Farhan (NULL), so he is excluded even though he is clearly not in department 30. Add `OR dept_id IS NULL` if he should stay.' },
    { t:'NULL in ORDER BY', d:'MySQL sorts NULLs first in ascending order and last in descending. Other databases differ (PostgreSQL puts them last in ascending). Use `NULLS FIRST/LAST` where supported.' },
    { t:'DISTINCT and GROUP BY treat NULLs as equal', d:'Unlike `=`, DISTINCT and GROUP BY put all NULLs into one value or group.' },
    { t:'Concatenation and arithmetic', d:'`CONCAT(a, NULL)` and `5 + NULL` return NULL in MySQL. Use COALESCE or CONCAT_WS to protect a calculation.' },
    { t:'Empty string is not NULL', d:'A cell containing `\'\'` is a value, and `IS NULL` will not find it. Check both when cleaning data.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return employees who are NOT in department 30, including the one with no department.', table:T(EMP,'Table: employees'), hint:'A plain `<> 30` drops the NULL row.', solution:'SELECT name\nFROM employees\nWHERE dept_id <> 30\n   OR dept_id IS NULL;', explain:'The result is Asha, Bilal, Chitra, Esha and Farhan. Without the IS NULL branch, Farhan would be lost.' },
    { level:'Interview', q:'What does this query return, and why? `SELECT name FROM employees WHERE dept_id NOT IN (SELECT manager_id FROM employees)`', table:T(EMP,'Table: employees'), hint:'Look at the values the subquery returns.', solution:'No rows.', explain:'The subquery returns manager_id values that include NULL (Asha has no manager). `x NOT IN (..., NULL)` is never TRUE, so every row is rejected. Using NOT EXISTS, or adding WHERE manager_id IS NOT NULL inside the subquery, fixes it.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Why does `WHERE column = NULL` return no rows?', a:'Any comparison with NULL evaluates to UNKNOWN, not TRUE, and WHERE keeps only TRUE rows. The correct test is `column IS NULL`.',
      structure:'Say what NULL means, name the three-valued logic, then give the right syntax.',
      follow:[ { q:'What does NULL = NULL return?', a:'UNKNOWN. Two unknown values are not known to be equal.' },
               { q:'How do you compare two columns that may both be NULL as equal?', a:'MySQL has the null-safe operator `<=>`. In standard SQL, use `a = b OR (a IS NULL AND b IS NULL)`, or IS NOT DISTINCT FROM where supported.' } ] },
    { level:'Intermediate', q:'How do aggregate functions treat NULL?', a:'SUM, AVG, MIN, MAX and COUNT(column) ignore NULLs. COUNT(*) counts all rows. So AVG(col) is the average of the non-NULL values only, not treating NULL as zero.',
      tradeoff:'If NULL should mean zero for your business rule, say so explicitly with AVG(COALESCE(col, 0)).',
      follow:[ { q:'What does SUM return for a column of only NULLs?', a:'NULL, not 0. Wrap with COALESCE(SUM(col), 0) for reports.' } ] },
    { level:'Scenario', q:'A NOT IN subquery suddenly returns nothing after new data was loaded. What is the likely cause?', a:'The subquery now returns at least one NULL, which makes NOT IN unknown for every row. I rewrite it with NOT EXISTS, or add `IS NOT NULL` inside the subquery, and add a NOT NULL constraint if NULLs should never exist.',
      structure:'Hypothesis, check with a quick COUNT of NULLs, fix, then prevent.' }
  ],
  ref:{ headers:['Need','Write'], rows:[['Test for missing','`col IS NULL`'],['Test for present','`col IS NOT NULL`'],['Replace NULL','`COALESCE(col, default)`'],['Count filled values','`COUNT(col)`'],['Count all rows','`COUNT(*)`'],['Null-safe equality (MySQL)','`a <=> b`']] },
  related:['coalesce','nullif','in-sql','exists-sql']
};

/* --- order-by --- */
D('order-by',{ l:'Beginner', t:'ORDER BY sorts the result. Without it, row order is not guaranteed, and ties need an extra column.',
  i:['A table has no built-in order. Unless you ask for one, rows can come back in any order, and the order may change from one run to the next.','ORDER BY makes the order explicit: by one column, several columns, or an expression, ascending or descending.'], a:'Lining people up by height, then by name when heights tie.',
  h:['Add `ORDER BY column` at the end of the query.','`ASC` is the default; use `DESC` for largest first.','Add more columns to break ties.','ORDER BY can use aliases, because it runs after SELECT.'],
  d:[FL(['ORDER BY salary DESC, name'],[{ title:'Result', rows:[['name','salary'],['Chitra',60000],['Asha',50000],['Deepak',45000],['Bilal',40000],['Esha',40000],['Farhan',35000]], hl:{4:'find',5:'find'}, note:'Bilal and Esha tie, so name decides.' }])],
  x:[X('Variation','Sort by an alias','Order by annual salary.','Use the alias.','SELECT name, salary * 12 AS annual\nFROM employees\nORDER BY annual DESC;',['ORDER BY runs after SELECT, so the alias exists.'],'Chitra first (720000).',T(EMP,'Table: employees')),
     X('Business case','NULLs last','Show employees without a department at the bottom.','Sort by an expression first.','SELECT name, dept_id FROM employees\nORDER BY dept_id IS NULL, dept_id;',['`dept_id IS NULL` is 0 or 1.','Sorting by it first pushes NULLs to the end.'],'Farhan moves to the bottom.',T(EMP,'Table: employees'))],
  e:[['No ORDER BY, no guarantee','Never rely on the natural order.'],['Ties','Add a unique column so the order is repeatable.'],['NULL position','MySQL puts NULLs first in ASC. Others differ.'],['ORDER BY and LIMIT','Always sort before taking the top rows.']],
  p:[P('Medium','List customers by city, then name.','Two columns.','SELECT * FROM customers ORDER BY city, name;','Delhi, Mumbai, Pune.',T(CUST,'Table: customers')),
     P('Interview','Is the order of rows guaranteed without ORDER BY?','No.','No. The database can return rows in any order, so I always add ORDER BY when order matters.','State it plainly.')],
  q:[Q('Basic','What does ORDER BY do?','It sorts the result by one or more columns.',{ f:[['Default direction?','Ascending.']] }),
     Q('Scenario','Top 3 earners.','ORDER BY salary DESC LIMIT 3, with a second column to break ties.',{ t:'Ties at the cut-off need a rule.' })],
  r:RT(['Form','Effect'],[['`ORDER BY a`','Ascending'],['`ORDER BY a DESC`','Descending'],['`ORDER BY a, b`','Ties by b'],['NULL last','`ORDER BY a IS NULL, a`']]), rel:['limit-sql','aliases','group-by','row-number'] });

/* --- limit-sql --- */
D('limit-sql',{ l:'Beginner', t:'LIMIT keeps the first n rows and OFFSET skips rows. Always pair it with ORDER BY.',
  i:['"Top 3", "the last 10 orders" and "page 2" are all LIMIT questions. LIMIT cuts the result after sorting.','Without ORDER BY the first rows are arbitrary, so the answer would be meaningless.'], a:'Taking the first few cards from a sorted deck.',
  h:['Sort the rows with ORDER BY.','Add `LIMIT n` to keep n rows.','Add `OFFSET m` to skip m rows first.','SQL Server uses TOP, Oracle uses FETCH FIRST.'],
  d:[FL(['ORDER BY salary DESC LIMIT 3'],[{ title:'Sorted', rows:[['name','salary'],['Chitra',60000],['Asha',50000],['Deepak',45000],['Bilal',40000]] },{ title:'LIMIT 3', rows:[['name','salary'],['Chitra',60000],['Asha',50000],['Deepak',45000]], hl:{1:'hit',2:'hit',3:'hit'} }])],
  x:[X('Variation','Page 2','Three rows per page; show page 2.','Skip three rows.','SELECT name, salary FROM employees\nORDER BY salary DESC, name\nLIMIT 3 OFFSET 3;',['The first three rows are skipped.'],'Bilal, Esha, Farhan.',T(EMP,'Table: employees')),
     X('Business case','LIMIT cuts ties','Top 4 salaries: two people tie for 4th place.','Be aware of ties.','... ORDER BY salary DESC LIMIT 4',['LIMIT 4 returns Chitra, Asha, Deepak and one of Bilal or Esha.'],'Use RANK or DENSE_RANK when ties must all appear.')],
  e:[['No ORDER BY','The rows returned are arbitrary.'],['Ties at the cut-off','LIMIT keeps an arbitrary one. Use a window function to include ties.'],['Large OFFSET','Reads and discards many rows. Use keyset pagination.'],['Dialects','TOP (SQL Server), FETCH FIRST (Oracle, PostgreSQL).']],
  p:[P('Medium','The two most recent orders.','ORDER BY date desc.','SELECT * FROM orders ORDER BY order_date DESC LIMIT 2;','Orders 6 and 5.',T(ORD,'Table: orders')),
     P('Interview','Write the SQL Server version of a top-3 query.','TOP.','SELECT TOP 3 name, salary FROM employees ORDER BY salary DESC;','Different keyword, same idea.')],
  q:[Q('Basic','What does LIMIT do?','It restricts the result to the first n rows.',{ f:[['Why ORDER BY?','Otherwise which rows you get is arbitrary.']] }),
     Q('Scenario','Page 3 with 10 rows per page.','LIMIT 10 OFFSET 20 with a stable ORDER BY.',{ t:'Keyset pagination scales better.' })],
  r:RT(['Database','Syntax'],[['MySQL / PostgreSQL','`LIMIT n OFFSET m`'],['SQL Server','`TOP n`'],['Oracle','`FETCH FIRST n ROWS ONLY`'],['Always','`ORDER BY` first']]), rel:['order-by','row-number','dense-rank','second-highest'] });
})();
