/* Datapath | SQL | SELECT, DISTINCT and aliases
 * Lessons in this file: select, select-distinct, aliases
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

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- select --- */
'select': {
  title:'SELECT', tagline:'Choose which columns to return from a table.',
  prereq:['sql-intro'],
  what:['SELECT chooses the columns of the result.','`SELECT *` returns every column.','You can also select expressions, such as salary times 12.'],
  why:['Every query starts with SELECT.','Choosing only the needed columns makes results clear and fast.'],
  syntax:{ code:'SELECT column1, column2, ...\nFROM table_name;', parts:[['column1, column2','The columns to return, separated by commas.'],['*','All columns.']] },
  points:['List only the columns you need.','The order in SELECT sets the order of the result columns.','Expressions work: `salary * 12`.','`SELECT 5 + 3;` works without a table.','`SELECT *` is fine for exploring, not for reports.','The original table is never changed.'],
  mistakes:['Using * on huge tables.','A trailing comma before FROM.','Misspelling column names.'],
  example:{ title:'Choosing columns', scenario:'You want each employee\'s name and department id only.',
    table:withHl(EMP,{'B1':'find','C1':'find'},'Table: employees'), task:'Return name and dept_id.', formula:'SELECT name, dept_id\nFROM employees;',
    steps:['FROM employees reads the table.','SELECT keeps only the name and dept_id columns.'],
    table2:{ rows:[['name','dept_id'],['Asha',10],['Bilal',20],['Chitra',10],['Deepak',30],['Esha',20],['Farhan','NULL']], caption:'Result' }, result:'Six rows, two columns.' },
  practice:{ q:'Write a query that returns the city and name of every customer, with city first.', table:T(CUST,'Table: customers'), hint:'The order in SELECT sets the column order.', solution:'SELECT city, name\nFROM customers;', explain:'The result has two columns, city first and name second.' },
  interview:[
    { level:'Basic', q:'What does SELECT do?', a:'It chooses which columns, or expressions, appear in the result of a query.' },
    { level:'Intermediate', q:'Why avoid SELECT * in production?', a:'It returns unneeded columns, is slower on big tables, and breaks code when columns are added or reordered. I name the columns I need.' },
    { level:'Intermediate', q:'Can you SELECT without a FROM clause?', a:'Yes, in MySQL, for expressions or functions, such as SELECT NOW(); or SELECT 5+3;.' },
    { level:'Scenario', q:'A report needs annual salary. How do you calculate it in the query?', a:'SELECT name, salary * 12 AS annual_salary FROM employees; The expression is computed for each row and does not change the table.' }
  ],
  mcq:[
    { q:'What does `SELECT *` return?', o:['All columns','Only the first column','All tables','Only numbers'], a:0, why:'* means every column.' },
    { q:'What sets the column order of the result?', o:['The order in SELECT','The table order','Alphabetical order','FROM'], a:0, why:'Columns appear as listed in SELECT.' },
    { q:'Does SELECT change the table?', o:['No','Yes','Only with *','Only with WHERE'], a:0, why:'SELECT only reads.' },
    { q:'Which is valid?', o:['SELECT 5 + 3;','SELECT FROM 5;','SELECT = 5;','FROM 5 SELECT;'], a:0, why:'Expressions can be selected without a table.' },
    { q:'What separates columns in SELECT?', o:['Commas','Semicolons','Colons','Spaces only'], a:0, why:'Use commas.' }
  ],
  recap:['SELECT chooses the columns of the result.','Name the columns you need instead of *.','Expressions can be calculated in SELECT.']
},

/* --- select-distinct --- */
'select-distinct': {
  title:'SELECT DISTINCT', tagline:'Remove repeated rows from the result.',
  prereq:['select'],
  what:['DISTINCT returns each different value only once.','With several columns, it removes repeated **combinations**.','It affects the result only, not the table.'],
  why:['List unique departments, cities or products.','Check how many different values a column has.'],
  syntax:{ code:'SELECT DISTINCT column1, column2\nFROM table_name;', parts:[['DISTINCT','Placed right after SELECT; applies to all selected columns together.']] },
  points:['NULL is treated as one value: only one NULL appears.','DISTINCT applies to the whole row of selected columns.','`COUNT(DISTINCT col)` counts unique values.','It can slow down large queries because of the sorting or hashing.','GROUP BY can give the same result with aggregates.'],
  mistakes:['Using DISTINCT to hide a bad join that creates duplicates.','Expecting DISTINCT to apply to one column only.','Using it everywhere out of habit.'],
  example:{ title:'Unique department ids', scenario:'Several employees share a department. You want the list of departments in use.',
    table:withHl(EMP,{'C2:C7':'range'},'Table: employees'), task:'List each dept_id once.', formula:'SELECT DISTINCT dept_id\nFROM employees;',
    steps:['The dept_id column holds 10, 20, 10, 30, 20 and NULL.','DISTINCT keeps one of each, including one NULL.'],
    table2:{ rows:[['dept_id'],[10],[20],[30],['NULL']], caption:'Result' }, result:'Four rows: 10, 20, 30 and NULL.' },
  practice:{ q:'Write a query that lists each city in the customers table once.', table:T(CUST,'Table: customers'), hint:'Put DISTINCT right after SELECT.', solution:'SELECT DISTINCT city\nFROM customers;', explain:'Pune appears twice in the table but once in the result, so the output is Pune, Delhi and Mumbai.' },
  interview:[
    { level:'Basic', q:'What does DISTINCT do?', a:'It removes duplicate rows from the result so each combination of the selected columns appears once.' },
    { level:'Intermediate', q:'How does DISTINCT work with two columns?', a:'It removes rows where the combination of both columns repeats. (Asha, Pune) twice becomes one row, but (Asha, Pune) and (Asha, Delhi) both stay.' },
    { level:'Intermediate', q:'How do you count unique values?', a:'COUNT(DISTINCT column), for example SELECT COUNT(DISTINCT dept_id) FROM employees; which ignores NULL.' },
    { level:'Scenario', q:'A join returns duplicate rows and someone adds DISTINCT. What is your view?', a:'DISTINCT may hide a wrong join condition. I first check why duplicates appear, such as a missing join key, and fix that.' }
  ],
  mcq:[
    { q:'Where does DISTINCT go?', o:['Right after SELECT','After FROM','After WHERE','At the end'], a:0, why:'SELECT DISTINCT column ...' },
    { q:'How many NULLs does DISTINCT return?', o:['One','None','All of them','Two'], a:0, why:'NULLs are treated as the same value.' },
    { q:'DISTINCT with two columns removes:', o:['Repeated combinations','Repeats in the first column only','All NULLs','Nothing'], a:0, why:'The whole row of selected columns is compared.' },
    { q:'Which counts unique values?', o:['COUNT(DISTINCT col)','DISTINCT(COUNT col)','COUNT(UNIQUE)','SUM(DISTINCT)'], a:0, why:'COUNT with DISTINCT inside.' },
    { q:'Does DISTINCT change the table?', o:['No','Yes','Only the first rows','Only text'], a:0, why:'It only affects the result.' }
  ],
  recap:['DISTINCT removes duplicate result rows.','With several columns it compares the combination.','Do not use it to hide join problems.']
},

/* --- aliases --- */
'aliases': {
  title:'Aliases (AS)', tagline:'Give columns and tables a temporary, clearer name.',
  prereq:['select'],
  what:['An **alias** is a temporary name for a column or table.','It exists only for that query.','`AS` makes it explicit, though it is optional.'],
  why:['Readable column headings in reports.','Short table names make joins easier to write.'],
  syntax:{ code:'SELECT column AS alias_name\nFROM table_name AS t;', parts:[['column AS alias','A new heading for a column or expression.'],['table AS t','A short name for a table.']] },
  points:['Use quotes if the alias has spaces: `AS "Annual Salary"` or backticks in MySQL.','You can use an alias in ORDER BY.','You **cannot** use a SELECT alias in WHERE in MySQL.','Table aliases are essential for self joins.','Aliases do not change the table.'],
  mistakes:['Using a column alias in WHERE.','Aliases with spaces and no quotes.','Same alias for two tables.'],
  example:{ title:'Annual salary', scenario:'You want name and annual pay, with readable headings.',
    table:withHl(EMP,{'B1':'find','D1':'find'},'Table: employees'), task:'Return employee and annual salary.', formula:'SELECT name AS employee,\n       salary * 12 AS annual_salary\nFROM employees;',
    steps:['salary * 12 is calculated for each row.','AS gives the headings employee and annual_salary.'],
    table2:{ rows:[['employee','annual_salary'],['Asha',600000],['Bilal',480000],['Chitra',720000],['Deepak',540000],['Esha',480000],['Farhan',420000]], caption:'Result' }, result:'Each row shows the name and yearly salary.' },
  practice:{ q:'Rewrite a query on employees using the table alias e and return e.name and e.salary.', table:T(EMP,'Table: employees'), hint:'Put the alias after the table name.', solution:'SELECT e.name, e.salary\nFROM employees AS e;', explain:'The alias e is a short name, handy when several tables are joined.' },
  interview:[
    { level:'Basic', q:'What is an alias in SQL?', a:'A temporary name given to a column or table within a query, using AS.' },
    { level:'Intermediate', q:'Why can you not use a column alias in WHERE?', a:'WHERE is evaluated before SELECT, so the alias does not exist yet. I repeat the expression, or use a subquery or CTE.' },
    { level:'Intermediate', q:'Where are aliases essential?', a:'In self joins, where one table is used twice, and in joins with many tables, to keep the query short and clear.' },
    { level:'Scenario', q:'How do you give a heading with a space, like Annual Salary?', a:'Put the alias in quotes or backticks: AS `Annual Salary`.' }
  ],
  mcq:[
    { q:'Which keyword creates an alias?', o:['AS','LIKE','IN','ON'], a:0, why:'AS names the column or table.' },
    { q:'Does an alias change the table?', o:['No','Yes','Only columns','Only tables'], a:0, why:'Aliases are temporary.' },
    { q:'Can WHERE use a SELECT alias in MySQL?', o:['No','Yes','Only numbers','Only text'], a:0, why:'WHERE runs before SELECT.' },
    { q:'Can ORDER BY use an alias?', o:['Yes','No','Only in tables','Only with LIMIT'], a:0, why:'ORDER BY runs after SELECT.' },
    { q:'When are table aliases required?', o:['Self joins','Single-table queries','Every query','ORDER BY'], a:0, why:'The same table appears twice.' }
  ],
  recap:['Aliases rename columns and tables for one query.','ORDER BY can use them, WHERE cannot.','Essential for self joins.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- select --- */
D('select',{ l:'Beginner', t:'SELECT chooses the columns of the result. Name the columns you need instead of `*`.',
  i:['Every query starts with SELECT. It decides which columns, and which calculated expressions, appear in the output. The original table is never changed.','Choosing only the columns you need makes results clearer and faster, and keeps reports stable when columns are added to the table.'], a:'Choosing which columns of a spreadsheet to print.',
  h:['List the columns after `SELECT`, separated by commas.','Add expressions such as `salary * 12`.','Give them aliases for clear headings.','Use `*` only for quick exploration.'],
  d:[FL(['SELECT name, dept_id'],[{ title:'employees', rows:[['emp_id','name','dept_id','salary'],[1,'Asha',10,50000],[2,'Bilal',20,40000]] },{ title:'Result', rows:[['name','dept_id'],['Asha',10],['Bilal',20]], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','Expressions and functions','Show the annual salary.','Use arithmetic.','SELECT name, salary * 12 AS annual_salary\nFROM employees;',['The expression is calculated per row.','The table is unchanged.'],'Asha: 600000.',T(EMP,'Table: employees')),
     X('Business case','Why not SELECT *','A report query uses SELECT * and breaks when someone adds a column.','Name the columns.','SELECT order_id, customer_id, amount\nFROM orders;',['The result shape is fixed.','Less data is read.'],'Reports stay stable and fast.',T(ORD,'Table: orders'))],
  e:[['SELECT * in production','Returns unneeded data and breaks code when columns change.'],['A trailing comma','`SELECT a, b, FROM` is a syntax error.'],['Expressions without FROM','`SELECT 5 + 3;` works in MySQL.'],['Column order','Follows the SELECT list, not the table.']],
  p:[P('Medium','Return the city and name of each customer, city first.','Order of columns.','SELECT city, name FROM customers;','The result starts with city.',T(CUST,'Table: customers')),
     P('Interview','Why avoid SELECT * in production?','Think maintenance and performance.','It reads unneeded columns, is slower on big tables, hides which columns a query depends on, and breaks when columns change.','Name two reasons.')],
  q:[Q('Basic','What does SELECT do?','It chooses which columns or expressions appear in the result.',{ f:[['Does it change the table?','No.']] }),
     Q('Scenario','Add annual salary to a report.','SELECT name, salary * 12 AS annual_salary FROM employees;',{ t:'Aliases keep headings readable.' })],
  r:RT(['Form','Meaning'],[['`SELECT a, b`','Chosen columns'],['`SELECT *`','All columns'],['`SELECT x AS y`','Alias'],['`SELECT 5+3`','Expression']]), rel:['where','aliases','select-distinct','order-by'] });

/* --- select-distinct --- */
D('select-distinct',{ l:'Beginner', t:'DISTINCT removes duplicate result rows. With several columns it compares the combination.',
  i:['A column such as department repeats for every employee. DISTINCT collapses the repeats so you see the list of different values.','With two columns, it removes only rows where both values repeat. It affects the result, not the table.'], a:'Listing the different flavours on a menu, however often each was ordered.',
  h:['Write `SELECT DISTINCT column`.','Rows with identical selected values collapse to one.','NULLs count as one value.','Use `COUNT(DISTINCT col)` to count the different values.'],
  d:[FL(['DISTINCT dept_id'],[{ title:'dept_id column', rows:[['dept_id'],[10],[20],[10],[30],[20],['NULL']] },{ title:'Result', rows:[['dept_id'],[10],[20],[30],['NULL']], hl:{1:'hit',2:'hit',3:'hit',4:'hit'} }])],
  x:[X('Variation','Two columns','Distinct combinations of department and salary.','Select both columns.','SELECT DISTINCT dept_id, salary\nFROM employees;',['Bilal and Esha share (20, 40000), so they collapse.'],'Five distinct combinations remain.',T(EMP,'Table: employees')),
     X('Business case','How many customers ordered?','Orders repeat customers.','Count distinct customers.','SELECT COUNT(DISTINCT customer_id) AS customers\nFROM orders;',['The ids are 101, 102, 101, 103, 102, 101.'],'The result is 3.',T(ORD,'Table: orders'))],
  e:[['DISTINCT hides join problems','If a join creates duplicates, fix the join instead of adding DISTINCT.'],['NULL counts once','All NULLs form one value.'],['Applies to all selected columns','Not just the first.'],['Performance','It needs sorting or hashing, so avoid it on huge unneeded results.']],
  p:[P('Medium','List each city in customers once.','DISTINCT city.','SELECT DISTINCT city FROM customers;','Pune, Delhi and Mumbai.',T(CUST,'Table: customers')),
     P('Interview','Does DISTINCT apply to one column or all selected columns?','Think combinations.','All selected columns together. Rows are removed only when the whole combination repeats.','Give a two-column example.')],
  q:[Q('Basic','What does DISTINCT do?','It removes duplicate rows from the result.',{ f:[['How do you count unique values?','COUNT(DISTINCT col).']] }),
     Q('Scenario','A join returns duplicates and someone adds DISTINCT.','Investigate first. DISTINCT may hide a wrong join condition.',{ t:'Use it when duplicates are legitimate and unwanted.' })],
  r:RT(['Form','Use'],[['`SELECT DISTINCT a`','Unique values'],['`SELECT DISTINCT a, b`','Unique pairs'],['`COUNT(DISTINCT a)`','Number of unique values'],['NULL','One value']]), rel:['count-distinct','group-by','select','inner-join'] });

/* --- aliases --- */
D('aliases',{ l:'Beginner', t:'An alias gives a column or table a temporary name for one query. Table aliases are essential in joins.',
  i:['Calculated columns have ugly names, and long table names make joins hard to read. An alias gives them short, clear names.','Aliases exist only inside the query, and a SELECT alias cannot be used in WHERE because WHERE runs earlier.'], a:'A nickname used only during one conversation.',
  h:['Write `expression AS alias`.','Write `table AS t` or `table t`.','Prefix columns with the table alias.','Use backticks or quotes for aliases with spaces.'],
  d:[FL(['AS'],[{ title:'salary * 12', text:'unnamed column' },{ title:'AS annual_salary', text:'**annual_salary**' }])],
  x:[X('Variation','Table aliases in a join','Short names make the query readable.','Alias both tables.','SELECT e.name, d.dept_name\nFROM employees e\nJOIN departments d ON e.dept_id = d.dept_id;',['e and d are only valid in this query.'],'Five rows with names and departments.'),
     X('Business case','A report heading with a space','Management wants a heading "Annual Salary".','Quote the alias.','SELECT name, salary * 12 AS `Annual Salary`\nFROM employees;',['Backticks allow spaces in MySQL.'],'The column heading reads Annual Salary.',T(EMP,'Table: employees'))],
  e:[['WHERE cannot use SELECT aliases','WHERE runs before SELECT.'],['ORDER BY can','It runs after SELECT.'],['Self joins need aliases','The same table appears twice.'],['Aliases are temporary','They never change the table.']],
  p:[P('Medium','Rewrite SELECT name FROM employees using the alias e.','Table alias.','SELECT e.name FROM employees AS e;','Same result, with a short prefix.',T(EMP,'Table: employees')),
     P('Interview','Why can you not use a column alias in WHERE?','Order of execution.','WHERE runs before SELECT creates the alias. Repeat the expression or use a CTE.','Link to the execution order.')],
  q:[Q('Basic','What is an alias?','A temporary name for a column or table within a query.',{ f:[['Can ORDER BY use it?','Yes.']] }),
     Q('Scenario','Where are aliases essential?','Self joins and joins with many tables.',{ t:'Readable aliases are part of good SQL style.' })],
  r:RT(['Use','Example'],[['Column','`salary * 12 AS annual`'],['Table','`employees e`'],['With a space','`AS \\`Annual Salary\\``'],['WHERE','Cannot use SELECT aliases']]), rel:['select','self-join','execution-order','inner-join'] });
})();
