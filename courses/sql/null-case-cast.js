/* Datapath | SQL | NULLs, CASE and CAST
 * Lessons in this file: coalesce, ifnull, nullif, case-when, cast-sql
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

/* --- coalesce --- */
'coalesce': {
  title:'COALESCE', tagline:'Return the first value that is not NULL.',
  prereq:['is-null'],
  what:['COALESCE takes a list of values and returns the first one that is not NULL.','It is the standard way to replace NULL with a default.','It works in every SQL system.'],
  why:['Show 0 or "Unknown" instead of blanks.','Make totals and joins safe from NULLs.'],
  syntax:{ code:'COALESCE(value1, value2, ..., valueN)', parts:[['value1 ... valueN','Checked in order. The first non-NULL one is returned.']] },
  points:['If all values are NULL, the result is NULL.','Accepts two or more arguments.','Types should be compatible: do not mix text and numbers carelessly.','Common after a LEFT JOIN.','`COALESCE(SUM(x), 0)` makes empty sums 0.'],
  mistakes:['Mixing incompatible types.','Replacing NULL with 0 when NULL has a meaning.','Forgetting it returns NULL when all are NULL.'],
  example:{ title:'Employees without a manager', scenario:'Asha has no manager, so manager_id is NULL. The report should show 0 instead.',
    table:withHl(EMP,{'E2':'hit'},'Table: employees'), task:'Replace the NULL manager with 0.', formula:'SELECT name, COALESCE(manager_id, 0) AS manager\nFROM employees;',
    steps:['For Asha, manager_id is NULL, so COALESCE returns the next value, 0.','For the others it returns manager_id.'],
    table2:{ rows:[['name','manager'],['Asha',0],['Bilal',1],['Chitra',1],['Deepak',2],['Esha',2],['Farhan',3]], caption:'Result' }, result:'No blanks remain in the manager column.' },
  practice:{ q:'Write a query that returns the total order amount of customer 104, showing 0 when there are no orders.', table:T(ORD,'Table: orders'), hint:'SUM of no rows is NULL.', solution:'SELECT COALESCE(SUM(amount), 0)\nFROM orders\nWHERE customer_id = 104;', explain:'No rows match, so SUM is NULL and COALESCE turns it into 0.' },
  interview:[
    { level:'Basic', q:'What does COALESCE do?', a:'It returns the first non-NULL value from a list of arguments.' },
    { level:'Intermediate', q:'How is COALESCE different from IFNULL?', a:'IFNULL takes exactly two arguments and is MySQL-specific. COALESCE takes any number and is standard SQL.' },
    { level:'Intermediate', q:'How do you use COALESCE after a LEFT JOIN?', a:'COALESCE(d.dept_name, \'Unassigned\') replaces NULLs from non-matching rows with a label.' },
    { level:'Scenario', q:'Return a contact: mobile, otherwise home phone, otherwise "none".', a:'COALESCE(mobile, home_phone, \'none\').' }
  ],
  mcq:[
    { q:'COALESCE(NULL, NULL, 5) returns:', o:['5','NULL','0','Error'], a:0, why:'The first non-NULL value.' },
    { q:'COALESCE with all NULLs returns:', o:['NULL','0','Empty text','Error'], a:0, why:'There is no value to return.' },
    { q:'How many arguments can COALESCE take?', o:['Two or more','Exactly two','Exactly three','One'], a:0, why:'Any number.' },
    { q:'Which makes an empty SUM show 0?', o:['COALESCE(SUM(x),0)','SUM(COALESCE)','NULLIF(SUM(x),0)','IS NULL'], a:0, why:'COALESCE replaces the NULL result.' },
    { q:'COALESCE is:', o:['Standard SQL','MySQL only','SQL Server only','Oracle only'], a:0, why:'It works across systems.' }
  ],
  recap:['COALESCE returns the first non-NULL value.','Use it for defaults and after LEFT JOINs.','It is standard SQL.']
},

/* --- ifnull --- */
'ifnull': {
  title:'IFNULL, ISNULL and NVL', tagline:'Two-argument NULL replacement in different systems.',
  prereq:['coalesce'],
  what:['IFNULL(a, b) returns a, or b if a is NULL (MySQL).','SQL Server calls it ISNULL; Oracle calls it NVL.','COALESCE is the portable choice.'],
  why:['Interviews ask about the differences between systems.','Handy shorthand in MySQL.'],
  syntax:{ code:'IFNULL(value, replacement)   -- MySQL\nISNULL(value, replacement)   -- SQL Server\nNVL(value, replacement)      -- Oracle', parts:[['value','The value to test.'],['replacement','Returned when value is NULL.']] },
  points:['Always exactly **two** arguments.','In MySQL, ISNULL(x) takes one argument and returns 1 or 0.','Types are decided by the first argument in SQL Server.','Prefer COALESCE for portable code.','Result type may be affected by the arguments.'],
  mistakes:['Using ISNULL(a, b) in MySQL.','Expecting more than two arguments.','Type conversion surprises.'],
  example:{ title:'A label for a missing manager', scenario:'You want the manager id, or the word None.',
    table:withHl(EMP,{'E2':'hit'},'Table: employees'), task:'Show None when there is no manager.', formula:'SELECT name, IFNULL(manager_id, \'None\') AS manager\nFROM employees;',
    steps:['IFNULL returns manager_id when it exists.','For Asha it returns the text None.'],
    table2:{ rows:[['name','manager'],['Asha','None'],['Bilal','1'],['Chitra','1'],['Deepak','2'],['Esha','2'],['Farhan','3']], caption:'Result' }, result:'The manager column shows text, with None for Asha.' },
  practice:{ q:'Write the SQL Server version of IFNULL(manager_id, 0).', hint:'SQL Server calls it ISNULL.', solution:'ISNULL(manager_id, 0)', explain:'Same logic, different name.' },
  interview:[
    { level:'Basic', q:'What does IFNULL do?', a:'It returns the first argument, or the second if the first is NULL.' },
    { level:'Intermediate', q:'What are the names in SQL Server and Oracle?', a:'ISNULL in SQL Server and NVL in Oracle. COALESCE works everywhere.' },
    { level:'Intermediate', q:'IFNULL vs COALESCE?', a:'IFNULL has two arguments and is MySQL-specific. COALESCE is standard and takes many.' },
    { level:'Scenario', q:'You must support MySQL and SQL Server with the same query.', a:'Use COALESCE, which both support.' }
  ],
  mcq:[
    { q:'IFNULL(NULL, 5) returns:', o:['5','NULL','0','Error'], a:0, why:'The replacement is used.' },
    { q:'SQL Server version:', o:['ISNULL','IFNULL','NVL','COALESCEX'], a:0, why:'ISNULL(a, b).' },
    { q:'Oracle version:', o:['NVL','IFNULL','ISNULL','NULLIF'], a:0, why:'NVL(a, b).' },
    { q:'Which is portable?', o:['COALESCE','IFNULL','NVL','ISNULL'], a:0, why:'COALESCE is standard.' },
    { q:'IFNULL takes how many arguments?', o:['Two','Three','One','Any'], a:0, why:'Exactly two.' }
  ],
  recap:['IFNULL (MySQL), ISNULL (SQL Server), NVL (Oracle) take two arguments.','COALESCE is the portable option.','Watch the data types.']
},

/* --- nullif --- */
'nullif': {
  title:'NULLIF', tagline:'Return NULL when two values are equal.',
  prereq:['coalesce'],
  what:['NULLIF(a, b) returns NULL if a equals b, otherwise a.','Its best-known use is to avoid division by zero.','It turns unwanted values into NULL.'],
  why:['Safe divisions and treating placeholders (0, blank) as missing.'],
  syntax:{ code:'NULLIF(value1, value2)', parts:[['value1','The value to return.'],['value2','If equal to value1, NULL is returned.']] },
  points:['Division by NULL gives NULL instead of an error (in most systems).','`x / NULLIF(y, 0)` is the standard safe division.','`NULLIF(col, \'\')` turns empty strings into NULL.','Combine with COALESCE to show a default.','AVG, MIN and MAX ignore the NULLs created.'],
  mistakes:['Dividing by zero without protection.','Confusing NULLIF with IFNULL.','Forgetting the result is NULL, not 0.'],
  example:{ title:'Revenue per unit', scenario:'Book has zero units, which would cause a division by zero.',
    table:withHl({rows:[['product','revenue','units'],['Pen',5000,100],['Book',8000,0]]},{'C3':'find'},'Table: sales'), task:'Return revenue per unit safely.', formula:'SELECT product,\n       revenue / NULLIF(units, 0) AS per_unit\nFROM sales;',
    steps:['For Book, NULLIF(0, 0) returns NULL.','Dividing by NULL gives NULL, not an error.'],
    table2:{ rows:[['product','per_unit'],['Pen',50],['Book','NULL']], caption:'Result' }, result:'Pen gives 50, and Book gives NULL.' },
  practice:{ q:'Write the expression that shows "n/a" instead of NULL for revenue per unit.', hint:'Wrap the safe division in COALESCE; cast to text first.', solution:'COALESCE(CAST(revenue / NULLIF(units, 0) AS CHAR), \'n/a\')', explain:'NULLIF prevents the error, and COALESCE replaces the NULL with a label.' },
  interview:[
    { level:'Basic', q:'What does NULLIF do?', a:'It returns NULL when the two arguments are equal, otherwise the first argument.' },
    { level:'Intermediate', q:'How do you avoid division by zero?', a:'Divide by NULLIF(divisor, 0). The result is NULL when the divisor is 0.' },
    { level:'Intermediate', q:'Turn empty strings into NULL?', a:'NULLIF(col, \'\').' },
    { level:'Scenario', q:'A column uses 0 for unknown and AVG is too low. How do you fix it?', a:'AVG(NULLIF(col, 0)) ignores the zeros, because AVG skips NULLs.' }
  ],
  mcq:[
    { q:'NULLIF(5, 5) returns:', o:['NULL','5','0','Error'], a:0, why:'Equal values give NULL.' },
    { q:'NULLIF(5, 3) returns:', o:['5','NULL','3','0'], a:0, why:'Different values return the first.' },
    { q:'Safe division uses:', o:['x / NULLIF(y,0)','x / IFNULL(y,0)','x / COALESCE(y)','x / y'], a:0, why:'Zero becomes NULL.' },
    { q:'What does 8000 / NULL give?', o:['NULL','0','Error','8000'], a:0, why:'Arithmetic with NULL gives NULL.' },
    { q:'AVG(NULLIF(col, 0)) does what?', o:['Ignores zeros','Counts zeros','Sums zeros','Errors'], a:0, why:'Zeros become NULL, which AVG skips.' }
  ],
  recap:['NULLIF returns NULL when the values are equal.','x / NULLIF(y, 0) avoids division by zero.','Use it to treat placeholders as missing.']
},

/* --- case-when --- */
'case-when': {
  title:'CASE WHEN', tagline:'If-then logic inside a query.',
  prereq:['select','where'],
  what:['CASE checks conditions in order and returns the result of the first true one.','It is SQL\'s version of IF / ELSE IF.','It can be used in SELECT, ORDER BY, GROUP BY and aggregates.'],
  why:['Create bands, labels and flags.','Build pivot-style summaries with SUM(CASE ...).'],
  syntax:{ code:'CASE\n  WHEN condition1 THEN result1\n  WHEN condition2 THEN result2\n  ELSE default_result\nEND', parts:[['WHEN ... THEN','A condition and its result.'],['ELSE','Optional. Result if nothing matches; otherwise NULL.'],['END','Closes the CASE.']] },
  points:['Conditions are tested **in order**; the first true one wins.','Without ELSE, unmatched rows return NULL.','Give the column an alias.','Use inside aggregates: `SUM(CASE WHEN ... THEN amount ELSE 0 END)`.','All THEN results should share a data type.'],
  mistakes:['Wrong order of conditions.','Forgetting END.','Forgetting ELSE and getting NULLs.'],
  example:{ title:'Salary bands', scenario:'You want to label salaries: 50000 and above is High, 40000 and above is Medium, otherwise Low.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Return each employee\'s band.', formula:'SELECT name, salary,\n  CASE\n    WHEN salary >= 50000 THEN \'High\'\n    WHEN salary >= 40000 THEN \'Medium\'\n    ELSE \'Low\'\n  END AS band\nFROM employees;',
    steps:['Each row is tested against the conditions from top to bottom.','The first true condition decides the label.'],
    table2:{ rows:[['name','salary','band'],['Asha',50000,'High'],['Bilal',40000,'Medium'],['Chitra',60000,'High'],['Deepak',45000,'Medium'],['Esha',40000,'Medium'],['Farhan',35000,'Low']], caption:'Result' }, result:'Asha and Chitra are High, and Farhan is Low.' },
  practice:{ q:'Label each order as Large (amount 1000 or more) or Small.', table:T(ORD,'Table: orders'), hint:'One WHEN and one ELSE.', solution:'SELECT order_id, amount,\n  CASE WHEN amount >= 1000 THEN \'Large\' ELSE \'Small\' END AS size\nFROM orders;', explain:'Orders 1 (1200) and 3 (1500) are Large. The others are Small.' },
  interview:[
    { level:'Basic', q:'What is CASE in SQL?', a:'A conditional expression that returns a result for the first WHEN condition that is true, with an optional ELSE.' },
    { level:'Intermediate', q:'What happens if no condition matches and there is no ELSE?', a:'The result is NULL.' },
    { level:'Intermediate', q:'How do you use CASE to pivot data?', a:'Inside an aggregate: SUM(CASE WHEN month = 1 THEN amount ELSE 0 END) AS jan, and the same for other months.' },
    { level:'Scenario', q:'Count orders by size in one query.', a:'SELECT SUM(amount >= 1000) ... or COUNT(CASE WHEN amount >= 1000 THEN 1 END) AS large, COUNT(CASE WHEN amount < 1000 THEN 1 END) AS small FROM orders;' }
  ],
  mcq:[
    { q:'What does CASE return when no WHEN matches and there is no ELSE?', o:['NULL','0','An error','The first result'], a:0, why:'The default is NULL.' },
    { q:'In what order are conditions tested?', o:['Top to bottom','Bottom to top','Randomly','All at once'], a:0, why:'The first true one wins.' },
    { q:'Which closes a CASE?', o:['END','STOP','CLOSE','DONE'], a:0, why:'CASE ... END.' },
    { q:'Salary 45000 in the band example is:', o:['Medium','High','Low','NULL'], a:0, why:'45000 is 40000 or more but below 50000.' },
    { q:'Where can CASE be used?', o:['SELECT, ORDER BY, GROUP BY and aggregates','Only SELECT','Only WHERE','Only JOIN'], a:0, why:'It is an expression usable almost anywhere.' }
  ],
  recap:['CASE returns the result of the first true WHEN.','No ELSE gives NULL.','Use it for bands, flags and pivots.']
},

/* --- cast-sql --- */
'cast-sql': {
  title:'CAST and CONVERT', tagline:'Change a value from one data type to another.',
  prereq:['sql-data-types'],
  what:['CAST converts a value to a different type.','Examples: text to number, text to date, number to text.','CONVERT does the same with different syntax.'],
  why:['Fix text numbers that sort wrongly.','Make types match for joins and maths.'],
  syntax:{ code:'CAST(value AS type)\nCONVERT(value, type)', parts:[['type','SIGNED, UNSIGNED, DECIMAL(10,2), CHAR, DATE, DATETIME and so on.']] },
  points:['Text numbers sort as text: 10, 100, 9. Cast to a number to sort properly.','`CAST(\'2026-03-15\' AS DATE)` turns text into a date.','Bad values may become 0 or NULL, with warnings.','`CONVERT(value, type)` is the MySQL form.','SQL Server also has TRY_CAST, which returns NULL on failure.'],
  mistakes:['Sorting numbers stored as text.','Casting invalid text without checking.','Losing decimals when casting to an integer type.'],
  example:{ title:'Sorting numbers stored as text', scenario:'An id column is stored as text, so 100 sorts before 9.',
    table:withHl({rows:[['code'],['10'],['9'],['100']]},{'A2:A4':'range'},'Table: codes (text)'), task:'Sort them as numbers.', formula:'SELECT code\nFROM codes\nORDER BY CAST(code AS UNSIGNED);',
    steps:['Plain ORDER BY gives 10, 100, 9 (text order).','CAST turns each code into a number first.'],
    table2:{ rows:[['code'],['9'],['10'],['100']], caption:'Result' }, result:'The codes sort in numeric order.' },
  practice:{ q:'What does CAST(\'2026-03-15\' AS DATE) + INTERVAL 1 DAY return?', hint:'Convert text to a date, then add a day.', solution:'2026-03-16', explain:'The text becomes a real date, so date arithmetic works.' },
  interview:[
    { level:'Basic', q:'What does CAST do?', a:'It converts a value to another data type, such as text to a number or date.' },
    { level:'Intermediate', q:'Why do text numbers sort wrongly?', a:'Text is compared character by character, so \'100\' comes before \'9\'. Casting to a number fixes it.' },
    { level:'Intermediate', q:'What if the text cannot be converted?', a:'MySQL returns 0 or NULL with a warning, and SQL Server raises an error. TRY_CAST in SQL Server returns NULL instead.' },
    { level:'Scenario', q:'Join a text id column to an integer id column.', a:'Cast one side so types match, such as ON CAST(a.id AS UNSIGNED) = b.id, and then fix the column type properly.' }
  ],
  mcq:[
    { q:'How do text numbers 10, 9, 100 sort?', o:['10, 100, 9','9, 10, 100','100, 10, 9','Random'], a:0, why:'Character order.' },
    { q:'Which turns text into a date?', o:['CAST(x AS DATE)','DATE(x) only','TODATE','CONVERT DATE'], a:0, why:'CAST(... AS DATE).' },
    { q:'MySQL CONVERT syntax:', o:['CONVERT(value, type)','CONVERT(value AS type)','CONVERT type value','CONVERT(type, value)'], a:0, why:'Comma-separated.' },
    { q:'SQL Server function that returns NULL on failure:', o:['TRY_CAST','CAST','NULLCAST','SAFE'], a:0, why:'TRY_CAST.' },
    { q:'What can happen casting 12.7 to an integer type?', o:['Decimals are lost or rounded','Nothing','Text appears','Date appears'], a:0, why:'Integer types hold no decimals.' }
  ],
  recap:['CAST changes the data type of a value.','Text numbers sort wrongly until cast.','TRY_CAST (SQL Server) fails safely.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- coalesce --- */
DEEP['coalesce'] = {
  level:'Beginner to Intermediate',
  tldr:'COALESCE returns the **first non-NULL** value from a list. Use it for defaults and to protect calculations from NULLs.',
  intuition:{ text:[
    'NULLs propagate: add a NULL to a number and the answer is NULL, join with a NULL in CONCAT and the whole text is NULL. That is rarely what a report needs. COALESCE gives you a fallback: "use this value, and if it is missing, use that one".',
    'Because it accepts any number of arguments, it can also express a chain of preferences: mobile number, otherwise home number, otherwise "none".'
  ], analogy:'A list of backup plans: take the first one that is available.' },
  how:[
    'COALESCE looks at its arguments from left to right.',
    'It returns the first one that is not NULL.',
    'If every argument is NULL, the result is NULL.',
    'All arguments should be of compatible types.',
    'It works in all major databases, unlike IFNULL, ISNULL and NVL.'
  ],
  diagrams:[
    { type:'flow', arrows:['','',''], panels:[
      { title:'mobile', text:'NULL' },{ title:'home', text:'NULL' },{ title:'COALESCE(mobile, home, \'none\')', text:'**none**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'First available contact', scenario:'Use the mobile number, else the home number, else a message.', table:T({rows:[['name','mobile','home'],['Asha','98765','NULL'],['Bilal','NULL','04012'],['Chitra','NULL','NULL']]},'Table: contacts'), task:'Pick the best contact.',
      formula:'SELECT name,\n       COALESCE(mobile, home, \'no phone\') AS contact\nFROM contacts;', steps:['Asha has a mobile, so it is used.','Bilal has no mobile, so his home number is used.','Chitra has neither, so the text is used.'], table2:{ rows:[['name','contact'],['Asha','98765'],['Bilal','04012'],['Chitra','no phone']], caption:'Result' }, result:'One column shows the best available contact.' },
    { level:'Business case', title:'A revenue report with zeros after a LEFT JOIN', scenario:'Customers without orders produce NULL totals. The report must show 0.', table:T(CUST,'Table: customers'), task:'Replace the NULL total.',
      formula:'SELECT c.name,\n       COALESCE(SUM(o.amount), 0) AS revenue\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name;', steps:['SUM of no rows is NULL.','COALESCE converts that NULL to 0.'], table2:{ rows:[['name','revenue'],['Asha',3300],['Bilal',1700],['Chitra',700],['Deepak',0]], caption:'Result' }, result:'No blanks in the report.' }
  ],
  edge:[
    { t:'Replacing NULL with 0 changes meaning', d:'A missing value is not the same as zero. Averages and counts change. Decide whether "unknown" or "zero" is the truth.' },
    { t:'Type compatibility', d:'Mixing numbers and text in COALESCE can cause implicit conversions or errors. Cast the arguments to a common type.' },
    { t:'All NULL stays NULL', d:'If the last argument is also NULL, the result is NULL. Provide a literal default as the final argument.' },
    { t:'COALESCE versus IFNULL', d:'IFNULL has two arguments and is MySQL-only. COALESCE is standard and portable.' },
    { t:'In aggregates', d:'`SUM(COALESCE(x, 0))` and `COALESCE(SUM(x), 0)` differ when there are no rows: only the second turns the NULL total into 0.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show each employee\'s manager id, or the text "none" for the top person.', table:T(EMP,'Table: employees'), hint:'Cast the number to text so the types match.', solution:'SELECT name,\n       COALESCE(CAST(manager_id AS CHAR), \'none\') AS manager\nFROM employees;', explain:'Asha shows none. The others show their manager id as text.' },
    { level:'Interview', q:'What is the difference between `COALESCE(SUM(x), 0)` and `SUM(COALESCE(x, 0))`?', hint:'Think about an empty set and about NULLs inside the data.', solution:'COALESCE(SUM(x), 0): sums the non-NULL values, then replaces a NULL total with 0 (useful when there are no rows).\nSUM(COALESCE(x, 0)): treats each NULL as 0 before adding. The total is the same, but with no rows it is still NULL.', explain:'Both give the same total for rows with NULLs. They differ only for an empty set. COALESCE outside is the one that guarantees a number.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does COALESCE do?', a:'It returns the first non-NULL value from its list of arguments, so I use it to replace NULL with a default value.',
      follow:[ { q:'What if all arguments are NULL?', a:'The result is NULL.' } ] },
    { level:'Intermediate', q:'COALESCE versus IFNULL, ISNULL and NVL?', a:'They all substitute a value for NULL, but IFNULL (MySQL), ISNULL (SQL Server) and NVL (Oracle) take exactly two arguments and are specific to a database. COALESCE is standard SQL, takes many arguments and works everywhere.',
      tradeoff:'COALESCE is the portable choice. The others are shorter if you are tied to one database.' },
    { level:'Scenario', q:'A report shows blanks for customers without orders. What do you do?', a:'I LEFT JOIN so every customer is kept and wrap the aggregate with COALESCE(SUM(...), 0) so the report shows 0 instead of blank. I also consider whether "no orders" should be shown as 0 or as a dash.' }
  ],
  ref:{ headers:['Function','Arguments','Portable?'], rows:[['`COALESCE`','Two or more','Yes'],['`IFNULL`','Exactly two','MySQL only'],['`ISNULL`','Two (SQL Server)','SQL Server only'],['`NVL`','Two','Oracle']] },
  related:['ifnull','nullif','is-null','left-join']
};

/* --- ifnull --- */
D('ifnull',{ l:'Beginner', t:'IFNULL(a, b) is MySQL\'s two-argument NULL replacement. SQL Server calls it ISNULL and Oracle NVL; COALESCE works everywhere.',
  i:['All these functions do the same: use a replacement when a value is NULL. They differ by name and, slightly, by behaviour.','For portable code, prefer COALESCE.'], a:'A spare key kept for when the first is missing.',
  h:['`IFNULL(value, replacement)` in MySQL.','`ISNULL` in SQL Server, `NVL` in Oracle.','Exactly two arguments.','Use COALESCE for more than two or portability.'],
  d:[FL(['IFNULL'],[{ title:'manager_id', rows:[['name','manager_id'],['Asha','NULL'],['Bilal',1]] },{ title:'IFNULL(manager_id, 0)', rows:[['name','manager'],['Asha',0],['Bilal',1]], hl:{1:'hit'} }])],
  x:[X('Variation','A text label','Show None for the top manager.','Use a text replacement.','SELECT name, IFNULL(manager_id, \'None\') FROM employees;',['The result column becomes text.'],'Asha shows None.',T(EMP,'Table: employees')),
     X('Business case','Writing portable SQL','The same report runs on MySQL and SQL Server.','Use COALESCE.','SELECT name, COALESCE(manager_id, 0) FROM employees;',['COALESCE works in both.'],'No dialect branching.',T(EMP,'Table: employees'))],
  e:[['Two arguments only','IFNULL cannot take more.'],['Type conversion','Mixing numbers and text converts the result type.'],['MySQL ISNULL','ISNULL(x) with one argument returns 1 or 0.'],['Portability','Use COALESCE for cross-database code.']],
  p:[P('Medium','Show 0 for a missing manager.','IFNULL.','SELECT name, IFNULL(manager_id, 0) FROM employees;','Asha shows 0.',T(EMP,'Table: employees')),
     P('Interview','IFNULL versus COALESCE?','Arguments and standard.','IFNULL takes two arguments and is MySQL-specific. COALESCE is standard and takes many.','Recommend COALESCE.')],
  q:[Q('Basic','What does IFNULL do?','It returns the first argument, or the second if the first is NULL.',{ f:[['Oracle name?','NVL.']] }),
     Q('Scenario','One query for MySQL and SQL Server.','Use COALESCE.',{ t:'Avoid dialect-specific functions in shared code.' })],
  r:RT(['System','Function'],[['MySQL','`IFNULL`'],['SQL Server','`ISNULL`'],['Oracle','`NVL`'],['Standard','`COALESCE`']]), rel:['coalesce','nullif','is-null','case-when'] });

/* --- nullif --- */
D('nullif',{ l:'Beginner to Intermediate', t:'NULLIF(a, b) returns NULL when a equals b. The classic use is dividing safely: `x / NULLIF(y, 0)`.',
  i:['Division by zero is an error in many databases. NULLIF turns a zero denominator into NULL, and dividing by NULL gives NULL, not an error.','It is also how you tell SQL "treat this placeholder as missing".'], a:'A filter that turns a chosen value into "unknown".',
  h:['`NULLIF(value1, value2)`.','If equal, the result is NULL, otherwise value1.','Use in denominators: `x / NULLIF(y, 0)`.','Combine with COALESCE for a default.'],
  d:[FL(['8000 / NULLIF(0, 0)'],[{ title:'NULLIF(0, 0)', text:'NULL' },{ title:'8000 / NULL', text:'**NULL** (no error)' }])],
  x:[X('Variation','Ignoring placeholder zeros','AVG should skip zeros.','Turn them into NULL.','SELECT AVG(NULLIF(score, 0)) FROM results;',['AVG skips NULLs.'],'Zeros no longer lower the average.'),
     X('Business case','Revenue per unit','A product has zero units.','Use NULLIF in the denominator.','SELECT product, revenue / NULLIF(units, 0) AS per_unit FROM sales;',['Zero units give NULL, not an error.'],'Pen 50, Book NULL.',withHl({rows:[['product','revenue','units'],['Pen',5000,100],['Book',8000,0]]},{},'Table: sales'))],
  e:[['Result is NULL, not 0','Decide how reports show it.'],['Empty strings','NULLIF(col, \'\') turns blanks into NULL.'],['Types','Both arguments should be comparable.'],['MySQL division','MySQL returns NULL for division by zero by default, but strict modes may raise errors.']],
  p:[P('Medium','Safe revenue per unit with n/a.','Combine with COALESCE.','COALESCE(CAST(revenue / NULLIF(units, 0) AS CHAR), \'n/a\')','Type-safe label.'),
     P('Interview','How do you avoid division by zero?','NULLIF.','Divide by NULLIF(denominator, 0).','Explain why NULL propagates.')],
  q:[Q('Basic','What does NULLIF do?','It returns NULL if two values are equal.',{ f:[['Common use?','x / NULLIF(y, 0).']] }),
     Q('Scenario','A column uses 0 for unknown and AVG is too low.','AVG(NULLIF(col, 0)).',{ t:'Better, store unknown as NULL.' })],
  r:RT(['Use','Write'],[['Safe division','`x / NULLIF(y, 0)`'],['Zero as missing','`NULLIF(col, 0)`'],['Blank as NULL','`NULLIF(col, \'\')`'],['Default','`COALESCE(..., 0)`']]), rel:['coalesce','ifnull','avg-sql','is-null'] });

/* --- case-when --- */
DEEP['case-when'] = {
  level:'Intermediate',
  tldr:'CASE is SQL\'s if-then-else. It returns the result of the **first** condition that is true, and it works almost anywhere an expression can.',
  intuition:{ text:[
    'In a spreadsheet you use IF. In SQL you use CASE. It lets a query make decisions row by row: label a salary as High or Low, sort some rows first, or count only the rows that meet a rule.',
    'The most powerful use is **conditional aggregation**: putting CASE inside SUM or COUNT to build several summaries in one pass, which is how pivots are made in MySQL.'
  ], analogy:'A sorting machine with gates: each row meets the first gate it qualifies for and leaves.' },
  how:[
    'SQL reads the `WHEN` conditions from top to bottom.',
    'The first condition that is true decides the result, and the rest are skipped.',
    'If none is true, the `ELSE` result is used, or NULL when there is no ELSE.',
    '`END` closes the expression.',
    'The result can be used in SELECT, WHERE, GROUP BY, ORDER BY or inside aggregates.'
  ],
  diagrams:[
    { type:'flow', arrows:['top to bottom'], panels:[
      { title:'CASE for salary 45000', text:'>= 50000? no\n>= 40000? **yes**' },
      { title:'Result', text:'**Medium**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Custom sort order with CASE', scenario:'List employees by department, but show those without a department last.', table:T(EMP,'Table: employees'), task:'Use CASE in ORDER BY.',
      formula:'SELECT name, dept_id\nFROM employees\nORDER BY CASE WHEN dept_id IS NULL THEN 1 ELSE 0 END,\n         dept_id,\n         name;', steps:['The CASE gives 0 to rows with a department and 1 to rows without.','Sorting by it first pushes NULL departments to the bottom.'], table2:{ rows:[['name','dept_id'],['Asha',10],['Chitra',10],['Bilal',20],['Esha',20],['Deepak',30],['Farhan','NULL']], caption:'Result' }, result:'Farhan moves to the end instead of the top (where MySQL puts NULLs by default).' },
    { level:'Business case', title:'Conditional aggregation: large and small orders per month', scenario:'A monthly report needs the number of large (1000 or more) and small orders in one query.', table:T(ORD,'Table: orders'), task:'Count both kinds in separate columns.',
      formula:'SELECT MONTH(order_date) AS month,\n       SUM(CASE WHEN amount >= 1000 THEN 1 ELSE 0 END) AS large,\n       SUM(CASE WHEN amount <  1000 THEN 1 ELSE 0 END) AS small\nFROM orders\nGROUP BY MONTH(order_date)\nORDER BY month;', steps:['Each CASE returns 1 for a matching order, otherwise 0.','SUM adds the 1s inside each month.'], table2:{ rows:[['month','large','small'],[1,1,1],[2,1,1],[3,0,2]], caption:'Result' }, result:'This technique replaces a pivot table: one pass over the data, several columns.' }
  ],
  edge:[
    { t:'Order of WHEN matters', d:'The first true condition wins. Put the strictest condition first, as with nested IF.' },
    { t:'No ELSE means NULL', d:'Rows matching no WHEN return NULL. Add an ELSE so unexpected values are visible.' },
    { t:'Mixed result types', d:'All THEN results should share a type. Mixing text and numbers causes conversions or errors.' },
    { t:'NULL in conditions', d:'`WHEN col = NULL` never matches. Use `WHEN col IS NULL`.' },
    { t:'Simple versus searched CASE', d:'`CASE col WHEN 1 THEN ...` compares equality only. `CASE WHEN col > 1 THEN ...` allows any condition.' },
    { t:'Alias in GROUP BY', d:'MySQL lets you GROUP BY the CASE alias. SQL Server needs the full CASE expression.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Label each order as Large (1500 or more), Medium (800 to 1499) or Small.', table:T(ORD,'Table: orders'), hint:'Three outcomes: two WHENs and an ELSE.', solution:'SELECT order_id, amount,\n  CASE\n    WHEN amount >= 1500 THEN \'Large\'\n    WHEN amount >= 800  THEN \'Medium\'\n    ELSE \'Small\'\n  END AS size\nFROM orders;', explain:'Order 3 (1500) is Large. Orders 1 (1200), 2 (800) and 5 (900) are Medium. Orders 4 (700) and 6 (600) are Small.' },
    { level:'Interview', q:'Show total sales per customer in three columns: January, February and March (a pivot in MySQL).', table:T(ORD,'Table: orders'), hint:'SUM(CASE WHEN MONTH(...) = n THEN amount ELSE 0 END), grouped by customer.', solution:'SELECT customer_id,\n  SUM(CASE WHEN MONTH(order_date)=1 THEN amount ELSE 0 END) AS jan,\n  SUM(CASE WHEN MONTH(order_date)=2 THEN amount ELSE 0 END) AS feb,\n  SUM(CASE WHEN MONTH(order_date)=3 THEN amount ELSE 0 END) AS mar\nFROM orders\nGROUP BY customer_id;', explain:'Customer 101 gets 1200, 1500 and 600. Customer 102 gets 800, 0 and 900. Customer 103 gets 0, 700 and 0.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is CASE in SQL?', a:'CASE is a conditional expression. It checks WHEN conditions in order and returns the result of the first one that is true, or the ELSE result, or NULL if there is no ELSE.',
      structure:'Compare with IF in Excel, then mention the ELSE rule.',
      follow:[ { q:'Where can you use CASE?', a:'In SELECT, WHERE, ORDER BY, GROUP BY and inside aggregate functions.' } ] },
    { level:'Intermediate', q:'How do you pivot rows into columns in MySQL?', a:'With conditional aggregation: SUM(CASE WHEN category = \'A\' THEN value ELSE 0 END) AS a, repeated for each new column, with a GROUP BY on the row key.',
      tradeoff:'The column list is fixed in the query. A dynamic pivot needs dynamic SQL.' },
    { level:'Scenario', q:'Count the orders above and below 1000 per customer in one query.', a:'SELECT customer_id, SUM(amount >= 1000) AS large, SUM(amount < 1000) AS small FROM orders GROUP BY customer_id; In portable SQL I use SUM(CASE WHEN amount >= 1000 THEN 1 ELSE 0 END).' }
  ],
  ref:{ headers:['Form','Example'], rows:[['Searched CASE','`CASE WHEN x > 5 THEN \'a\' ELSE \'b\' END`'],['Simple CASE','`CASE x WHEN 1 THEN \'one\' ELSE \'other\' END`'],['In aggregate','`SUM(CASE WHEN ... THEN 1 ELSE 0 END)`'],['In ORDER BY','`ORDER BY CASE WHEN ... THEN 0 ELSE 1 END`']] },
  related:['pivot-with-case','group-by','coalesce','if']
};

/* --- cast-sql --- */
D('cast-sql',{ l:'Beginner to Intermediate', t:'CAST converts a value to another type. It fixes text numbers that sort wrongly and makes types match for joins.',
  i:['Data often arrives as text: numbers in a VARCHAR column, dates as strings. CAST tells SQL to treat the value as another type for this expression.','Without it, text numbers sort as 1, 10, 2, and joins on mismatched types can be slow or fail.'], a:'Relabelling a value so the database treats it as a number or a date.',
  h:['`CAST(value AS type)`, for example `CAST(code AS UNSIGNED)`.','Common targets: SIGNED, UNSIGNED, DECIMAL(10,2), CHAR, DATE, DATETIME.','`CONVERT(value, type)` is the MySQL alternative.','SQL Server has `TRY_CAST`, which returns NULL on failure.'],
  d:[FL(['CAST(code AS UNSIGNED)'],[{ title:'Text order', rows:[['code'],['10'],['100'],['9']] },{ title:'Numeric order', rows:[['code'],['9'],['10'],['100']], hl:{1:'hit',2:'hit',3:'hit'} }])],
  x:[X('Variation','Text to date','A date stored as text.','Cast and use date maths.','SELECT CAST(\'2026-03-15\' AS DATE) + INTERVAL 1 DAY;',['The text becomes a real date.'],'2026-03-16.'),
     X('Business case','A join on mismatched types','orders.customer_id is INT but a staging table stores it as text.','Cast one side.','JOIN stage s ON o.customer_id = CAST(s.customer_id AS UNSIGNED)',['Types now match.','Fix the column type properly afterwards.'],'The join works, but casting a column can block index use.')],
  e:[['Failed conversions','Invalid text becomes 0 or NULL with warnings (MySQL), or an error (SQL Server).'],['Casting columns blocks indexes','Fix the column type instead.'],['Decimals lost','Casting 12.7 to an integer type rounds or truncates.'],['Dates','Use CAST(... AS DATE) or STR_TO_DATE with a format.']],
  p:[P('Medium','Sort text numbers 10, 9, 100 numerically.','CAST in ORDER BY.','SELECT code FROM codes ORDER BY CAST(code AS UNSIGNED);','9, 10, 100.'),
     P('Interview','Why do text numbers sort wrongly?','Character order.','Text compares character by character, so \'100\' comes before \'9\'. Cast to a number.','Better still, use the right type.')],
  q:[Q('Basic','What does CAST do?','It converts a value to another data type.',{ f:[['SQL Server safe version?','TRY_CAST.']] }),
     Q('Scenario','Join text ids to integer ids.','Cast one side and plan to fix the column type.',{ t:'Casting a column in a join can disable its index.' })],
  r:RT(['Need','Write'],[['Text to number','`CAST(x AS UNSIGNED)`'],['Text to date','`CAST(x AS DATE)`'],['To text','`CAST(x AS CHAR)`'],['Safe (SQL Server)','`TRY_CAST`']]), rel:['sql-data-types','date-format','coalesce','indexes'] });
})();
