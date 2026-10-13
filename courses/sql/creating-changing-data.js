/* Datapath | SQL | Creating and changing data
 * Lessons in this file: create-table, alter-table, drop-truncate, insert-into, update-sql, delete-sql, constraints, indexes, views, transactions
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

/* --- create-table --- */
'create-table': {
  title:'CREATE TABLE', tagline:'Define a new table with its columns and rules.',
  prereq:['sql-data-types','primary-key'],
  what:['CREATE TABLE makes a new table.','You list each column with its data type and rules.','It is a DDL command.'],
  why:['Build practice tables and analysis tables.','Design questions come up in interviews.'],
  syntax:{ code:'CREATE TABLE table_name (\n  column1 datatype constraints,\n  column2 datatype constraints\n);', parts:[['column datatype','Name and type of each column.'],['constraints','PRIMARY KEY, NOT NULL, DEFAULT and so on.']] },
  points:['Use `IF NOT EXISTS` to avoid errors when the table exists.','`AUTO_INCREMENT` numbers rows automatically in MySQL.','`DEFAULT` gives a value when none is supplied.','`CREATE TABLE new AS SELECT ...` copies query results into a new table.','Choose clear, lowercase names.'],
  mistakes:['Forgetting the primary key.','Wrong data types.','Reusing an existing table name.'],
  example:{ title:'A products table', scenario:'You want a table with an id, a name and a price.',
    table:T({rows:[['Plan'],['product_id: whole number, primary key, automatic'],['product_name: text, required'],['price: money, default 0']]},'Plan'), task:'Create the table.', formula:'CREATE TABLE products (\n  product_id INT PRIMARY KEY AUTO_INCREMENT,\n  product_name VARCHAR(50) NOT NULL,\n  price DECIMAL(10,2) DEFAULT 0\n);',
    steps:['product_id is the key and numbers itself.','product_name must always have a value.','price is 0 unless given.'],
    table2:{ rows:[['Field','Type','Null','Key','Default'],['product_id','int','NO','PRI','NULL'],['product_name','varchar(50)','NO','','NULL'],['price','decimal(10,2)','YES','','0.00']], caption:'DESCRIBE products' }, result:'The table exists and is empty.' },
  practice:{ q:'Write a CREATE TABLE statement for customers with customer_id (key), name and city.', hint:'Follow the products example.', solution:'CREATE TABLE customers (\n  customer_id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  city VARCHAR(50)\n);', explain:'The key identifies each row, the name is required and the city may be empty.' },
  interview:[
    { level:'Basic', q:'How do you create a table?', a:'CREATE TABLE name (column datatype constraints, ...); I add a primary key and NOT NULL where needed.' },
    { level:'Intermediate', q:'How do you copy a table\'s structure and data?', a:'CREATE TABLE copy AS SELECT * FROM original; this copies columns and data but not keys or indexes. CREATE TABLE copy LIKE original copies the structure.' },
    { level:'Intermediate', q:'What does AUTO_INCREMENT do?', a:'It assigns the next number automatically to a new row when no value is given.' },
    { level:'Scenario', q:'Run the script twice without an error.', a:'CREATE TABLE IF NOT EXISTS ... so it does nothing when the table already exists.' }
  ],
  mcq:[
    { q:'CREATE TABLE is:', o:['DDL','DML','DQL','TCL'], a:0, why:'It defines structure.' },
    { q:'Which avoids an error if the table exists?', o:['IF NOT EXISTS','OR REPLACE ALL','SKIP','IGNORE'], a:0, why:'CREATE TABLE IF NOT EXISTS.' },
    { q:'DEFAULT does what?', o:['Supplies a value when none is given','Makes a key','Sorts','Deletes'], a:0, why:'A fallback value.' },
    { q:'Which copies results into a new table?', o:['CREATE TABLE x AS SELECT','COPY TABLE','INSERT TABLE','CLONE'], a:0, why:'CTAS.' },
    { q:'Does CTAS copy keys and indexes?', o:['No','Yes','Only primary keys','Only unique'], a:0, why:'Only columns and data.' }
  ],
  recap:['CREATE TABLE defines columns, types and constraints.','IF NOT EXISTS makes scripts re-runnable.','CTAS copies data but not keys.']
},

/* --- alter-table --- */
'alter-table': {
  title:'ALTER TABLE', tagline:'Change the structure of an existing table.',
  prereq:['create-table'],
  what:['ALTER TABLE changes a table that already exists.','You can add, change or drop columns, and rename the table.','It is a DDL command.'],
  why:['Requirements change after a table is created.'],
  syntax:{ code:'ALTER TABLE products ADD COLUMN category VARCHAR(30);\nALTER TABLE products MODIFY price DECIMAL(12,2);\nALTER TABLE products DROP COLUMN category;\nALTER TABLE products RENAME TO items;', parts:[['ADD COLUMN','Adds a column.'],['MODIFY','Changes a column\'s type or rules.'],['DROP COLUMN','Removes a column and its data.'],['RENAME TO','Renames the table.']] },
  points:['Existing rows get NULL (or the default) in a new column.','`DROP COLUMN` deletes the data in it.','Changing a type can fail or lose data.','Big tables may lock during changes.','Constraints can be added: `ADD CONSTRAINT ...`.'],
  mistakes:['Dropping a column by mistake.','Shrinking a type and truncating data.','Altering large tables during busy hours.'],
  example:{ title:'Adding a category', scenario:'The products table needs a category column.',
    table:T({rows:[['Field','Type'],['product_id','int'],['product_name','varchar(50)'],['price','decimal(10,2)']]},'products (before)'), task:'Add a category column.', formula:'ALTER TABLE products\n  ADD COLUMN category VARCHAR(30);',
    steps:['The column is added at the end.','Existing rows have NULL in category.'],
    table2:{ rows:[['Field','Type'],['product_id','int'],['product_name','varchar(50)'],['price','decimal(10,2)'],['category','varchar(30)']], caption:'products (after)' }, result:'The table has four columns.' },
  practice:{ q:'Write a statement that removes the category column again.', hint:'DROP COLUMN.', solution:'ALTER TABLE products\n  DROP COLUMN category;', explain:'The column and its data are gone.' },
  interview:[
    { level:'Basic', q:'How do you add a column to an existing table?', a:'ALTER TABLE table_name ADD COLUMN name datatype;' },
    { level:'Intermediate', q:'What value do existing rows get in a new column?', a:'NULL, or the DEFAULT value if one was given.' },
    { level:'Intermediate', q:'What are the risks of ALTER TABLE?', a:'Dropping a column deletes its data, changing a type may truncate values, and large tables can lock. I back up and test first.' },
    { level:'Scenario', q:'Rename a column in MySQL 8.', a:'ALTER TABLE products RENAME COLUMN price TO unit_price;' }
  ],
  mcq:[
    { q:'ALTER TABLE belongs to:', o:['DDL','DML','DQL','DCL'], a:0, why:'It changes structure.' },
    { q:'A new column holds in existing rows:', o:['NULL or the default','0','Empty text','Random'], a:0, why:'No data was supplied.' },
    { q:'Which removes a column?', o:['DROP COLUMN','DELETE COLUMN','REMOVE','CUT'], a:0, why:'ALTER TABLE ... DROP COLUMN.' },
    { q:'Which changes a column\'s type?', o:['MODIFY','CHANGE ROWS','SET TYPE only','UPDATE'], a:0, why:'MODIFY in MySQL.' },
    { q:'A risk of shrinking a type:', o:['Data truncation','Faster queries','More rows','Extra indexes'], a:0, why:'Values may not fit.' }
  ],
  recap:['ALTER TABLE adds, modifies and drops columns.','New columns start as NULL or the default.','Back up before risky changes.']
},

/* --- drop-truncate --- */
'drop-truncate': {
  title:'DROP, TRUNCATE and DELETE', tagline:'Three ways to remove things, and how they differ.',
  prereq:['alter-table'],
  what:['**DELETE** removes selected rows.','**TRUNCATE** removes all rows quickly and keeps the table.','**DROP** removes the table itself.'],
  why:['A very common interview question.'],
  syntax:{ code:'DELETE FROM table_name WHERE condition;\nTRUNCATE TABLE table_name;\nDROP TABLE table_name;', parts:[['DELETE','DML. Removes rows, can use WHERE.'],['TRUNCATE','DDL. Empties the table.'],['DROP','DDL. Removes the table and its structure.']] },
  points:['DELETE can use WHERE and can be rolled back inside a transaction.','TRUNCATE has no WHERE, is faster, resets AUTO_INCREMENT and usually cannot be rolled back.','DROP removes the structure, data and indexes.','DELETE without WHERE removes every row, one by one.','`DROP TABLE IF EXISTS` avoids errors.'],
  mistakes:['DELETE without WHERE.','Using TRUNCATE when a rollback may be needed.','Dropping the wrong table.'],
  example:{ title:'Comparing the three commands', scenario:'You need to clear a table, and choose the right command.',
    table:T({rows:[['Command','Removes']]},'Which one?'), task:'Compare them.', formula:'DELETE FROM orders WHERE order_id = 6;\nTRUNCATE TABLE orders;\nDROP TABLE orders;',
    steps:['DELETE removes only order 6.','TRUNCATE removes every row but keeps the table.','DROP removes the table entirely.'],
    table2:{ rows:[['Command','Type','WHERE?','Rollback','Resets AUTO_INCREMENT','Table remains'],['DELETE','DML','Yes','Yes (in a transaction)','No','Yes'],['TRUNCATE','DDL','No','Usually no','Yes','Yes'],['DROP','DDL','No','No','n/a','No']], caption:'Comparison' }, result:'DELETE is the most precise, DROP the most final.' },
  practice:{ q:'Which command would you use to remove only the orders before 2026-02-01, and why?', hint:'You need a condition.', solution:'DELETE FROM orders WHERE order_date < \'2026-02-01\';', explain:'Only DELETE accepts a WHERE clause.' },
  interview:[
    { level:'Basic', q:'What is the difference between DELETE, TRUNCATE and DROP?', a:'DELETE removes selected rows. TRUNCATE removes all rows and keeps the table. DROP removes the whole table.' },
    { level:'Intermediate', q:'Can TRUNCATE be rolled back?', a:'In MySQL it commits implicitly, so normally not. DELETE inside a transaction can be rolled back.' },
    { level:'Intermediate', q:'Why is TRUNCATE faster?', a:'It deallocates the table\'s data in one step instead of removing and logging each row.' },
    { level:'Scenario', q:'You must empty a table but keep the structure, and keep foreign keys working.', a:'DELETE FROM table (TRUNCATE is blocked by foreign keys in MySQL), then reset AUTO_INCREMENT if needed.' }
  ],
  mcq:[
    { q:'Which accepts a WHERE clause?', o:['DELETE','TRUNCATE','DROP','All'], a:0, why:'Only DELETE.' },
    { q:'Which removes the table itself?', o:['DROP','DELETE','TRUNCATE','UPDATE'], a:0, why:'DROP removes structure.' },
    { q:'TRUNCATE is:', o:['DDL','DML','DQL','TCL'], a:0, why:'It acts on structure.' },
    { q:'Which resets AUTO_INCREMENT?', o:['TRUNCATE','DELETE','UPDATE','SELECT'], a:0, why:'The counter restarts.' },
    { q:'DELETE without WHERE:', o:['Removes all rows','Removes nothing','Errors','Drops the table'], a:0, why:'Every row goes.' }
  ],
  recap:['DELETE: rows with WHERE. TRUNCATE: all rows, fast. DROP: the table.','Only DELETE (in a transaction) can be rolled back safely.','Double-check before running any of them.']
},

/* --- insert-into --- */
'insert-into': {
  title:'INSERT INTO', tagline:'Add new rows to a table.',
  prereq:['create-table'],
  what:['INSERT INTO adds one or more rows.','You name the columns and give the values.','It can also copy rows from a SELECT.'],
  why:['Load data into practice and analysis tables.'],
  syntax:{ code:'INSERT INTO table_name (column1, column2)\nVALUES (value1, value2);\n\nINSERT INTO table_name (column1, column2)\nSELECT ... FROM other_table;', parts:[['(column1, column2)','The columns you fill.'],['VALUES (...)','The values, in the same order.']] },
  points:['Always **name the columns**; a missing list depends on the table order.','Several rows: `VALUES (...), (...), (...)`.','Skipped columns get their DEFAULT or NULL.','AUTO_INCREMENT columns can be left out.','`INSERT ... SELECT` copies query results.','Text and dates need single quotes.'],
  mistakes:['No column list.','Values in the wrong order.','Violating constraints, such as duplicate keys.'],
  example:{ title:'Adding products', scenario:'You add two products to the products table.',
    table:T({rows:[['product_id','product_name','price']]},'products (empty)'), task:'Insert two rows.', formula:'INSERT INTO products (product_name, price)\nVALUES (\'Pen\', 10),\n       (\'Book\', 60);',
    steps:['product_id is AUTO_INCREMENT, so it is left out.','Both rows are added in one statement.'],
    table2:{ rows:[['product_id','product_name','price'],[1,'Pen',10],[2,'Book',60]], caption:'products (after)' }, result:'Two rows were inserted.' },
  practice:{ q:'Write an INSERT that adds a customer with id 105, name Gita and city Delhi.', hint:'Name the three columns.', solution:'INSERT INTO customers (customer_id, name, city)\nVALUES (105, \'Gita\', \'Delhi\');', explain:'One new row is added.' },
  interview:[
    { level:'Basic', q:'How do you insert a row?', a:'INSERT INTO table (columns) VALUES (values);' },
    { level:'Intermediate', q:'Why list the columns?', a:'It keeps the statement correct if columns are added or reordered, and makes it readable.' },
    { level:'Intermediate', q:'How do you insert the result of a query?', a:'INSERT INTO target (cols) SELECT cols FROM source WHERE ...;' },
    { level:'Scenario', q:'Insert or update if the key exists.', a:'INSERT ... ON DUPLICATE KEY UPDATE in MySQL, or MERGE in SQL Server and Oracle.' }
  ],
  mcq:[
    { q:'INSERT is:', o:['DML','DDL','DQL','DCL'], a:0, why:'It changes data.' },
    { q:'How do you add several rows at once?', o:['List several VALUES groups','Run SELECT','Use UPDATE','Use LIMIT'], a:0, why:'VALUES (...), (...).' },
    { q:'A skipped column gets:', o:['Default or NULL','0','Empty text','An error'], a:0, why:'Unless NOT NULL without default.' },
    { q:'Text values need:', o:['Single quotes','Brackets','Hash signs','Nothing'], a:0, why:'\'Pen\'.' },
    { q:'Which copies query results into a table?', o:['INSERT ... SELECT','UPDATE ... SELECT','COPY','LOAD'], a:0, why:'INSERT INTO ... SELECT.' }
  ],
  recap:['INSERT adds rows; name the columns.','Several rows go in one VALUES list.','INSERT ... SELECT copies rows.']
},

/* --- update-sql --- */
'update-sql': {
  title:'UPDATE', tagline:'Change existing values.',
  prereq:['where','insert-into'],
  what:['UPDATE changes values in existing rows.','WHERE decides which rows change.','Without WHERE, **every row** changes.'],
  why:['Fix data, apply raises, correct statuses.'],
  syntax:{ code:'UPDATE table_name\nSET column1 = value1, column2 = value2\nWHERE condition;', parts:[['SET','The new values.'],['WHERE','Which rows to change.']] },
  points:['**Always** include WHERE, unless you really mean all rows.','Preview with a SELECT using the same WHERE.','Calculations work: `SET salary = salary * 1.10`.','Use a transaction so you can ROLLBACK.','MySQL safe-update mode blocks UPDATE without a key WHERE.'],
  mistakes:['Forgetting WHERE.','Updating without a backup or transaction.','Wrong condition changing too many rows.'],
  example:{ title:'A 10 percent raise for Finance', scenario:'Finance employees (dept 20) get a 10 percent raise.',
    table:withHl(EMP,{'C3':'hit','D3':'hit','C6':'hit','D6':'hit'},'Table: employees (before)'), task:'Update the salaries.', formula:'UPDATE employees\nSET salary = salary * 1.10\nWHERE dept_id = 20;',
    steps:['WHERE dept_id = 20 selects Bilal and Esha.','SET multiplies their salary by 1.10.'],
    table2:{ rows:[['emp_id','name','dept_id','salary'],[2,'Bilal',20,44000],[5,'Esha',20,44000]], caption:'Changed rows (others unchanged)' }, result:'Two rows changed from 40000 to 44000.' },
  practice:{ q:'Before running the UPDATE, how can you check which rows it will change?', hint:'Use SELECT with the same condition.', solution:'SELECT * FROM employees WHERE dept_id = 20;', explain:'It shows exactly the rows the UPDATE will change.' },
  interview:[
    { level:'Basic', q:'What does UPDATE do?', a:'It changes the values of existing rows that meet the WHERE condition.' },
    { level:'Intermediate', q:'What happens if you forget WHERE?', a:'Every row in the table is updated. I preview with SELECT and use a transaction so I can roll back.' },
    { level:'Intermediate', q:'How do you update using another table?', a:'UPDATE a JOIN b ON a.key = b.key SET a.col = b.col WHERE ...; (MySQL syntax).' },
    { level:'Scenario', q:'You updated the wrong rows. What now?', a:'If still in a transaction, ROLLBACK. Otherwise restore from backup or reverse the change using saved before-values.' }
  ],
  mcq:[
    { q:'UPDATE without WHERE changes:', o:['All rows','No rows','One row','Only NULLs'], a:0, why:'Every row.' },
    { q:'UPDATE is:', o:['DML','DDL','DQL','TCL'], a:0, why:'It changes data.' },
    { q:'Safe habit before UPDATE:', o:['Run SELECT with the same WHERE','Drop the table','Add DISTINCT','Use LIMIT 0'], a:0, why:'Preview the rows.' },
    { q:'Bilal\'s new salary in the example:', o:['44000','40000','50000','4000'], a:0, why:'40000 x 1.10.' },
    { q:'Which undoes an update in a transaction?', o:['ROLLBACK','COMMIT','SAVE','UNDO'], a:0, why:'ROLLBACK reverses uncommitted changes.' }
  ],
  recap:['UPDATE changes rows; WHERE limits them.','Preview with SELECT first.','Use transactions to be able to ROLLBACK.']
},

/* --- delete-sql --- */
'delete-sql': {
  title:'DELETE', tagline:'Remove rows from a table.',
  prereq:['update-sql'],
  what:['DELETE removes rows that match a condition.','Without WHERE it removes every row.','The table structure stays.'],
  why:['Remove wrong or old rows.'],
  syntax:{ code:'DELETE FROM table_name\nWHERE condition;', parts:[['WHERE','Which rows to remove.']] },
  points:['Always use WHERE unless you mean all rows.','Preview with SELECT first.','Foreign keys can block deleting parent rows.','Use a transaction.','To remove duplicates, delete by a key or row number.','DELETE can be rolled back within a transaction.'],
  mistakes:['No WHERE.','Deleting parent rows with children.','No backup.'],
  example:{ title:'Removing one order', scenario:'Order 6 was entered by mistake.',
    table:withHl(ORD,{'A7':'hit','B7':'hit','C7':'hit','D7':'hit'},'Table: orders (before)'), task:'Delete order 6.', formula:'DELETE FROM orders\nWHERE order_id = 6;',
    steps:['WHERE order_id = 6 identifies one row.','Only that row is removed.'],
    table2:{ rows:[['order_id','customer_id','order_date','amount'],[1,101,'2026-01-05',1200],[2,102,'2026-01-18',800],[3,101,'2026-02-03',1500],[4,103,'2026-02-21',700],[5,102,'2026-03-09',900]], caption:'orders (after)' }, result:'Five rows remain.' },
  practice:{ q:'Write a DELETE for all orders before February 2026.', hint:'Compare order_date.', solution:'DELETE FROM orders\nWHERE order_date < \'2026-02-01\';', explain:'Orders 1 and 2 are removed.' },
  interview:[
    { level:'Basic', q:'How do you delete rows?', a:'DELETE FROM table WHERE condition;' },
    { level:'Intermediate', q:'What if you delete a department that has employees?', a:'The foreign key blocks it, or cascades the delete, depending on the ON DELETE rule.' },
    { level:'Intermediate', q:'How do you delete duplicates, keeping one row?', a:'Delete rows that have a lower-id twin: DELETE c FROM t c JOIN t d ON c.col = d.col AND c.id > d.id.' },
    { level:'Scenario', q:'How do you make a delete safe?', a:'START TRANSACTION, preview with SELECT, run the DELETE, check the row count, then COMMIT or ROLLBACK.' }
  ],
  mcq:[
    { q:'DELETE without WHERE:', o:['Removes all rows','Removes none','Drops table','Errors'], a:0, why:'Every row is deleted.' },
    { q:'Does DELETE remove the table?', o:['No','Yes','Only empty tables','Only in MySQL'], a:0, why:'Only rows.' },
    { q:'Rows left after the example:', o:['5','6','1','0'], a:0, why:'One of six removed.' },
    { q:'Which can block a delete?', o:['A foreign key','An alias','A view only','DISTINCT'], a:0, why:'Referenced rows are protected.' },
    { q:'Safest workflow:', o:['Transaction, preview, delete, check','Delete then check','Drop first','No WHERE'], a:0, why:'You can ROLLBACK.' }
  ],
  recap:['DELETE removes rows that match WHERE.','Foreign keys can block it.','Use a transaction and preview first.']
},

/* --- constraints --- */
'constraints': {
  title:'Constraints', tagline:'Rules that keep data valid.',
  prereq:['primary-key','foreign-key'],
  what:['Constraints are rules enforced by the database.','They reject data that breaks the rules.','Types: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT.'],
  why:['Clean data at the source, not afterwards.'],
  syntax:{ code:'CREATE TABLE employees (\n  emp_id INT PRIMARY KEY,\n  email VARCHAR(100) UNIQUE,\n  name VARCHAR(50) NOT NULL,\n  salary DECIMAL(10,2) CHECK (salary > 0),\n  status VARCHAR(10) DEFAULT \'active\'\n);', parts:[['NOT NULL','A value is required.'],['UNIQUE','No duplicates (NULL allowed).'],['CHECK','A condition that must be true.'],['DEFAULT','A value when none is given.']] },
  points:['PRIMARY KEY = UNIQUE + NOT NULL, one per table.','UNIQUE allows several NULLs.','CHECK is enforced in MySQL **8.0.16 and later**.','FOREIGN KEY links to another table.','Name constraints with `CONSTRAINT name ...` for clearer errors.'],
  mistakes:['Relying only on application checks.','Adding constraints after bad data exists.','Old MySQL ignoring CHECK.'],
  example:{ title:'What the rules reject', scenario:'The table above enforces several rules. Which inserts fail?',
    table:T({rows:[['Rule'],['name NOT NULL'],['email UNIQUE'],['salary CHECK > 0']]},'Rules'), task:'Try four inserts.', formula:'INSERT ... (name = NULL)\nINSERT ... (email already used)\nINSERT ... (salary = -5)\nINSERT ... (status omitted)',
    steps:['A NULL name breaks NOT NULL.','A repeated email breaks UNIQUE.','A negative salary breaks CHECK.','An omitted status uses the DEFAULT, so it works.'],
    table2:{ rows:[['Insert','Result'],['name = NULL','Error: column cannot be null'],['duplicate email','Error: duplicate entry'],['salary = -5','Error: check constraint violated'],['status omitted','OK, status = active']], caption:'Outcome' }, result:'Bad data is rejected, and defaults fill gaps.' },
  practice:{ q:'Write a column definition for age that must be between 18 and 60.', hint:'Use CHECK.', solution:'age INT CHECK (age BETWEEN 18 AND 60)', explain:'Any other age is rejected.' },
  interview:[
    { level:'Basic', q:'What are constraints?', a:'Rules on columns or tables, such as NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK and DEFAULT, that keep data valid.' },
    { level:'Intermediate', q:'PRIMARY KEY vs UNIQUE?', a:'Both prevent duplicates. A primary key is also NOT NULL and there is one per table. UNIQUE columns can be many and allow NULL.' },
    { level:'Intermediate', q:'Is CHECK enforced in MySQL?', a:'From 8.0.16 yes. Earlier versions parse it but ignore it.' },
    { level:'Scenario', q:'Add a rule to an existing table.', a:'ALTER TABLE t ADD CONSTRAINT chk_salary CHECK (salary > 0); existing rows must already satisfy it.' }
  ],
  mcq:[
    { q:'Which ensures a value is present?', o:['NOT NULL','UNIQUE','CHECK','DEFAULT'], a:0, why:'No NULLs.' },
    { q:'UNIQUE vs PRIMARY KEY:', o:['UNIQUE allows NULL','Same','PK allows NULL','UNIQUE is one per table'], a:0, why:'Primary keys cannot be NULL.' },
    { q:'DEFAULT does what?', o:['Fills a value when none is given','Rejects values','Links tables','Sorts'], a:0, why:'A fallback.' },
    { q:'CHECK is enforced in MySQL from:', o:['8.0.16','5.7','5.0','Never'], a:0, why:'Earlier versions ignore it.' },
    { q:'Which links two tables?', o:['FOREIGN KEY','CHECK','UNIQUE','DEFAULT'], a:0, why:'Referential integrity.' }
  ],
  recap:['Constraints enforce validity in the database.','PRIMARY KEY = UNIQUE + NOT NULL.','CHECK needs MySQL 8.0.16+.']
},

/* --- indexes --- */
'indexes': {
  title:'Indexes', tagline:'Make lookups fast, at a small cost to writes.',
  prereq:['primary-key'],
  what:['An index is a sorted structure that helps the database find rows quickly.','Like the index of a book.','The database uses it for WHERE, JOIN and ORDER BY.'],
  why:['The first fix for slow queries.','A very common interview topic.'],
  syntax:{ code:'CREATE INDEX idx_dept ON employees (dept_id);\nCREATE UNIQUE INDEX idx_email ON users (email);\nDROP INDEX idx_dept ON employees;', parts:[['idx_dept','The index name.'],['(dept_id)','The column or columns indexed.']] },
  points:['Primary and unique keys are indexed automatically.','Indexes **speed up reads** but **slow down** INSERT, UPDATE and DELETE and use space.','Index columns used in WHERE, JOIN and ORDER BY.','A **composite index** on (a, b) helps queries on a, or a and b, but not b alone (leftmost prefix).','Functions on the column, or a leading `%` in LIKE, stop index use.','Check with `EXPLAIN`.'],
  mistakes:['Indexing every column.','Wrapping the indexed column in a function.','Ignoring column order in composite indexes.'],
  example:{ title:'Speeding up a department search', scenario:'Queries filter employees by dept_id on a table with millions of rows.',
    table:withHl(EMP,{'C2:C7':'range'},'Table: employees'), task:'Create an index and compare plans.', formula:'CREATE INDEX idx_dept ON employees (dept_id);\nEXPLAIN SELECT * FROM employees WHERE dept_id = 10;',
    steps:['Without an index, the database scans every row.','With the index, it jumps straight to the rows for department 10.'],
    table2:{ rows:[['Plan','type','rows examined'],['Before the index','ALL (full scan)','all rows'],['After the index','ref (index lookup)','only matching rows']], caption:'EXPLAIN summary (illustrative)' }, result:'The query reads only the rows it needs.' },
  practice:{ q:'Which index helps WHERE city = \'Pune\' ORDER BY name on the customers table?', hint:'A composite index with the filter column first.', solution:'CREATE INDEX idx_city_name ON customers (city, name);', explain:'The database finds the Pune rows through the first column and reads them already sorted by name.' },
  interview:[
    { level:'Basic', q:'What is an index?', a:'A data structure that lets the database find rows quickly without scanning the whole table.' },
    { level:'Intermediate', q:'What are the downsides of indexes?', a:'They use storage and slow writes, because every INSERT, UPDATE and DELETE must also update the indexes.' },
    { level:'Intermediate', q:'What is the leftmost prefix rule?', a:'A composite index on (a, b, c) can be used for a, for a and b, and for a, b and c, but not for b or c alone.' },
    { level:'Scenario', q:'WHERE YEAR(order_date) = 2026 is slow although order_date is indexed. Why?', a:'The function on the column stops the index being used. I rewrite it as a range: order_date >= \'2026-01-01\' AND order_date < \'2027-01-01\'.' }
  ],
  mcq:[
    { q:'Indexes mainly speed up:', o:['Reads','Writes','Backups','Deletes only'], a:0, why:'Lookups are faster.' },
    { q:'Cost of indexes:', o:['Slower writes and more storage','Slower reads','Lost data','Locked tables'], a:0, why:'They must be maintained.' },
    { q:'Index on (a, b) helps a query on:', o:['a','b alone','neither','only both'], a:0, why:'Leftmost prefix.' },
    { q:'What blocks index use?', o:['A function on the column','An alias','ORDER BY','LIMIT'], a:0, why:'The stored values are not transformed.' },
    { q:'Which command shows the plan?', o:['EXPLAIN','SHOW INDEX only','DESCRIBE','ANALYZE TABLE only'], a:0, why:'EXPLAIN SELECT ...' }
  ],
  recap:['Indexes speed up reads and slow down writes.','Index columns in WHERE, JOIN and ORDER BY; mind column order.','Avoid functions on indexed columns; use EXPLAIN.']
},

/* --- views --- */
'views': {
  title:'Views', tagline:'Save a query under a name and use it like a table.',
  prereq:['select','create-table'],
  what:['A view is a stored SELECT query.','It looks like a table, but holds no data of its own.','Each time you query it, the stored SELECT runs.'],
  why:['Reuse complex queries and hide columns for security.','Give analysts a simple, safe layer.'],
  syntax:{ code:'CREATE VIEW view_name AS\nSELECT ...;\n\nCREATE OR REPLACE VIEW view_name AS\nSELECT ...;\nDROP VIEW view_name;', parts:[['CREATE VIEW','Stores the query.'],['OR REPLACE','Updates an existing view.']] },
  points:['A view stores the **query**, not the data.','It always shows current data.','Good for security: expose only some columns or rows.','Simple views can be updated; complex ones (joins, aggregates) usually cannot.','A **materialized view** stores results (not in MySQL).','Dropping a view does not delete table data.'],
  mistakes:['Thinking a view stores data.','Stacking many views, which slows queries.','Trying to update a complex view.'],
  example:{ title:'A high earners view', scenario:'Managers should see only employees earning 50000 or more, without other columns.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Create the view and query it.', formula:'CREATE VIEW high_earners AS\nSELECT name, salary\nFROM employees\nWHERE salary >= 50000;\n\nSELECT * FROM high_earners;',
    steps:['The view stores the SELECT.','Querying the view runs it against the current employees table.'],
    table2:{ rows:[['name','salary'],['Asha',50000],['Chitra',60000]], caption:'SELECT * FROM high_earners' }, result:'The view always shows the current high earners.' },
  practice:{ q:'Create a view called customer_totals that shows each customer id and the total of their orders.', hint:'GROUP BY customer_id inside the view.', solution:'CREATE VIEW customer_totals AS\nSELECT customer_id, SUM(amount) AS total\nFROM orders\nGROUP BY customer_id;', explain:'Querying customer_totals returns 3300, 1700 and 700 for customers 101, 102 and 103.' },
  interview:[
    { level:'Basic', q:'What is a view?', a:'A saved SELECT query that behaves like a virtual table. It stores no data itself.' },
    { level:'Intermediate', q:'Why use views?', a:'To reuse complex queries, simplify access for analysts, and restrict access to certain columns or rows.' },
    { level:'Intermediate', q:'View vs materialized view?', a:'A view runs its query every time. A materialized view stores the result and must be refreshed. MySQL has no native materialized views.' },
    { level:'Scenario', q:'Can you INSERT into a view?', a:'Only if it is a simple view on one table that includes the required columns. Views with joins, aggregates or DISTINCT are not updatable.' }
  ],
  mcq:[
    { q:'A view stores:', o:['A query','The data','An index','A backup'], a:0, why:'Only the SELECT.' },
    { q:'Does a view show current data?', o:['Yes','No, a snapshot','Only after refresh','Only in MySQL 8'], a:0, why:'The query runs each time.' },
    { q:'Which drops a view?', o:['DROP VIEW','DELETE VIEW','REMOVE VIEW','TRUNCATE VIEW'], a:0, why:'DROP VIEW name.' },
    { q:'A good use of views:', o:['Hide columns from users','Speed up writes','Create keys','Back up data'], a:0, why:'Security layer.' },
    { q:'Dropping a view deletes the table data?', o:['No','Yes','Only some','Only in MySQL'], a:0, why:'The tables are untouched.' }
  ],
  recap:['A view is a saved query, not stored data.','It simplifies and secures access.','Complex views are usually read-only.']
},

/* --- transactions --- */
'transactions': {
  title:'Transactions and ACID', tagline:'Make several changes succeed or fail together.',
  prereq:['update-sql','sql-command-types'],
  what:['A **transaction** groups several statements into one unit.','Either all of them are saved (COMMIT) or none (ROLLBACK).','InnoDB, the default MySQL engine, supports transactions.'],
  why:['Money transfers, orders and stock updates must not be half done.','ACID is a classic interview question.'],
  syntax:{ code:'START TRANSACTION;\nUPDATE ...;\nUPDATE ...;\nCOMMIT;   -- or ROLLBACK;', parts:[['START TRANSACTION','Begins the unit of work.'],['COMMIT','Saves all changes permanently.'],['ROLLBACK','Undoes all changes since the start.'],['SAVEPOINT','A point to roll back to partially.']] },
  points:['**A**tomicity: all or nothing.','**C**onsistency: the data stays valid.','**I**solation: transactions do not see each other\'s half-done work.','**D**urability: committed data survives a crash.','DDL such as CREATE or TRUNCATE commits implicitly in MySQL.','Autocommit is on by default in MySQL, so each statement commits itself.'],
  mistakes:['Forgetting to COMMIT.','Long transactions that lock rows.','Assuming DDL can be rolled back.'],
  example:{ title:'Transferring 200', scenario:'Move 200 from account A to account B. Both updates must happen, or neither.',
    table:T({rows:[['account','balance'],['A',1000],['B',500]]},'Table: accounts (before)'), task:'Do the transfer safely.', formula:'START TRANSACTION;\nUPDATE accounts SET balance = balance - 200 WHERE account = \'A\';\nUPDATE accounts SET balance = balance + 200 WHERE account = \'B\';\nCOMMIT;',
    steps:['Both updates are inside one transaction.','If either fails, ROLLBACK restores both balances.','COMMIT saves both together.'],
    table2:{ rows:[['account','balance'],['A',800],['B',700]], caption:'accounts (after COMMIT)' }, result:'The total stays 1500 whatever happens.' },
  practice:{ q:'The second UPDATE fails after the first succeeded. Which command restores the original balances?', hint:'Undo everything since START TRANSACTION.', solution:'ROLLBACK;', explain:'Atomicity means both changes are undone, so A and B go back to 1000 and 500.' },
  interview:[
    { level:'Basic', q:'What is a transaction?', a:'A group of SQL statements executed as one unit: either all changes are committed or all are rolled back.' },
    { level:'Basic', q:'What does ACID stand for?', a:'Atomicity, Consistency, Isolation and Durability.' },
    { level:'Intermediate', q:'COMMIT vs ROLLBACK?', a:'COMMIT makes the changes permanent. ROLLBACK undoes the changes since the transaction began.' },
    { level:'Scenario', q:'Two users update the same row at the same time. What protects the data?', a:'Isolation and locking. The database makes one wait or applies an isolation level, so they do not overwrite each other\'s half-done work.' }
  ],
  mcq:[
    { q:'What does A in ACID mean?', o:['Atomicity','Accuracy','Access','Archive'], a:0, why:'All or nothing.' },
    { q:'Which saves changes permanently?', o:['COMMIT','ROLLBACK','SAVEPOINT','BEGIN'], a:0, why:'COMMIT.' },
    { q:'Which undoes uncommitted changes?', o:['ROLLBACK','COMMIT','TRUNCATE','DROP'], a:0, why:'ROLLBACK.' },
    { q:'Durability means:', o:['Committed data survives a crash','Data is encrypted','Data is copied','Data is sorted'], a:0, why:'It is stored safely.' },
    { q:'After the transfer, the total of A and B is:', o:['1500','1000','1200','800'], a:0, why:'Unchanged.' }
  ],
  recap:['A transaction is all-or-nothing: COMMIT or ROLLBACK.','ACID: atomicity, consistency, isolation, durability.','MySQL autocommit is on by default; DDL commits implicitly.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- create-table --- */
D('create-table',{ l:'Beginner', t:'CREATE TABLE defines columns, types and constraints. Add a primary key, NOT NULL where needed, and use IF NOT EXISTS in scripts.',
  i:['Before data can be stored, you must describe its shape: which columns, which types, which rules. CREATE TABLE is that description.','Good tables are designed with keys and constraints from the start, because fixing them later is harder.'], a:'Drawing the columns of a form before anyone fills it in.',
  h:['Name the table and list the columns with types.','Add constraints: PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, CHECK.','`IF NOT EXISTS` makes the script re-runnable.','`CREATE TABLE x AS SELECT ...` copies results.'],
  d:[FL(['CREATE TABLE'],[{ title:'DESCRIBE products', rows:[['Field','Type','Null','Key'],['product_id','int','NO','PRI'],['product_name','varchar(50)','NO',''],['price','decimal(10,2)','YES','']] }])],
  x:[X('Variation','Copying a table','Make a backup copy with data.','CREATE TABLE AS SELECT.','CREATE TABLE orders_backup AS SELECT * FROM orders;',['Data is copied, but keys and indexes are not.'],'A snapshot of orders.'),
     X('Business case','A re-runnable script','Setup scripts run repeatedly.','Use IF NOT EXISTS.','CREATE TABLE IF NOT EXISTS products (\n  product_id INT PRIMARY KEY AUTO_INCREMENT,\n  product_name VARCHAR(50) NOT NULL,\n  price DECIMAL(10,2) DEFAULT 0\n);',['Running it twice does not fail.'],'Safe for deployment scripts.')],
  e:[['Copies lose constraints','CTAS copies columns and data only. Use LIKE to copy structure.'],['Choose types carefully','Changing later requires migration.'],['Name clearly','Lowercase, no spaces.'],['Primary key','Every table should have one.']],
  p:[P('Medium','Create customers with an id, required name and optional city.','Keys and NOT NULL.','CREATE TABLE customers (customer_id INT PRIMARY KEY, name VARCHAR(50) NOT NULL, city VARCHAR(50));','City may be NULL.'),
     P('Interview','Copy only the structure of a table.','LIKE.','CREATE TABLE copy LIKE original;','Then INSERT ... SELECT for data.')],
  q:[Q('Basic','How do you create a table?','CREATE TABLE name (columns with types and constraints).',{ f:[['What does AUTO_INCREMENT do?','Numbers new rows automatically.']] }),
     Q('Scenario','Make a deployment script safe to run twice.','Use IF NOT EXISTS.',{ t:'Version your schema changes.' })],
  r:RT(['Option','Use'],[['`PRIMARY KEY`','Unique id'],['`NOT NULL`','Required'],['`DEFAULT`','Fallback value'],['`IF NOT EXISTS`','Re-runnable']]), rel:['sql-data-types','primary-key','constraints','alter-table'] });

/* --- alter-table --- */
D('alter-table',{ l:'Beginner to Intermediate', t:'ALTER TABLE changes a table\'s structure: add, modify or drop columns. Dropping deletes the data, so back up first.',
  i:['Requirements change after a table exists. ALTER TABLE lets you evolve it without recreating it.','New columns start as NULL (or the default) for existing rows, and dropping a column destroys its data.'], a:'Renovating a room without rebuilding the house.',
  h:['`ADD COLUMN` adds a column.','`MODIFY` changes a type or rule.','`DROP COLUMN` removes it.','`RENAME` renames the table or a column.'],
  d:[FL(['ADD COLUMN category'],[{ title:'Before', rows:[['product_id','product_name','price']] },{ title:'After', rows:[['product_id','product_name','price','category']], hl:{0:'hit'} }])],
  x:[X('Variation','Adding a NOT NULL column','Existing rows need a value.','Provide a default.','ALTER TABLE products ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT \'active\';',['Existing rows receive active.'],'No NULLs appear.'),
     X('Business case','A safe change','A column type must grow.','Backup, test, apply.','ALTER TABLE products MODIFY price DECIMAL(12,2);',['A wider type is safe; a narrower one may truncate.'],'Test on a copy of production first.')],
  e:[['Dropping deletes data','No undo without a backup.'],['Locks on big tables','Some changes lock the table for a long time.'],['Narrowing a type','May truncate or fail.'],['DDL commits','Cannot be rolled back in MySQL.']],
  p:[P('Medium','Add a category column to products.','ADD COLUMN.','ALTER TABLE products ADD COLUMN category VARCHAR(30);','Existing rows have NULL.'),
     P('Interview','Risks of ALTER TABLE on a large live table?','Locks and data loss.','Long locks, possible truncation, no rollback. Test on a copy, run in a quiet window, back up.','Name the mitigation.')],
  q:[Q('Basic','How do you add a column?','ALTER TABLE t ADD COLUMN name type.',{ f:[['New rows value?','NULL or the default.']] }),
     Q('Scenario','Rename a column in MySQL 8.','ALTER TABLE t RENAME COLUMN old TO new.',{ t:'Update dependent code and views.' })],
  r:RT(['Task','Write'],[['Add','`ADD COLUMN`'],['Change','`MODIFY`'],['Remove','`DROP COLUMN`'],['Rename','`RENAME COLUMN`']]), rel:['create-table','drop-truncate','constraints','sql-command-types'] });

/* --- drop-truncate --- */
D('drop-truncate',{ l:'Beginner', t:'DELETE removes selected rows, TRUNCATE empties a table quickly, and DROP removes the table itself.',
  i:['Three commands remove things at three levels: some rows, all rows, the whole table. Choosing the wrong one is an expensive mistake.','Only DELETE accepts a condition, and only DELETE (inside a transaction) can normally be rolled back.'], a:'Removing a few books, emptying the shelf, or removing the shelf.',
  h:['`DELETE ... WHERE` removes chosen rows.','`TRUNCATE TABLE` removes all rows and resets AUTO_INCREMENT.','`DROP TABLE` removes structure and data.','Back up before any of them.'],
  d:[FL([''],[{ title:'Comparison', rows:[['Command','Removes','WHERE','Rollback'],['DELETE','Rows','Yes','Yes (in transaction)'],['TRUNCATE','All rows','No','Usually no'],['DROP','The table','No','No']] }])],
  x:[X('Variation','Which one?','Remove only orders before February.','Use DELETE with WHERE.','DELETE FROM orders WHERE order_date < \'2026-02-01\';',['Only DELETE accepts a condition.'],'Orders 1 and 2 are removed.',T(ORD,'Table: orders')),
     X('Business case','Reloading a staging table','A nightly load needs an empty staging table.','TRUNCATE is fast.','TRUNCATE TABLE staging_orders;',['It deallocates data rather than deleting row by row.'],'Fast, but cannot be rolled back, and foreign keys may block it.')],
  e:[['TRUNCATE is DDL','It commits implicitly in MySQL.'],['Foreign keys','TRUNCATE is blocked if other tables reference it.'],['DELETE without WHERE','Removes all rows, slowly.'],['AUTO_INCREMENT','Reset by TRUNCATE, not by DELETE.']],
  p:[P('Medium','Remove order 6 only.','DELETE with WHERE.','DELETE FROM orders WHERE order_id = 6;','One row.',T(ORD,'Table: orders')),
     P('Interview','DELETE, TRUNCATE and DROP differences?','Rows, all rows, table.','DELETE removes rows with a condition and can be rolled back. TRUNCATE empties the table quickly. DROP removes the table.','Add transaction behaviour.')],
  q:[Q('Basic','What is the difference between DELETE and TRUNCATE?','DELETE removes selected rows and can use WHERE. TRUNCATE removes all rows quickly.',{ f:[['Can DROP be rolled back?','No.']] }),
     Q('Scenario','Empty a table but keep foreign keys working.','DELETE FROM table, because TRUNCATE is blocked by foreign keys in MySQL.',{ t:'DELETE is slower on large tables.' })],
  r:RT(['Command','Effect'],[['`DELETE`','Rows, with WHERE'],['`TRUNCATE`','All rows, fast'],['`DROP`','The table'],['Safety','Transaction and backup']]), rel:['delete-sql','alter-table','transactions','sql-command-types'] });

/* --- insert-into --- */
D('insert-into',{ l:'Beginner', t:'INSERT adds rows. Always name the columns, and use one VALUES list for several rows.',
  i:['New data arrives through INSERT. Naming the columns makes the statement independent of the table\'s column order and readable.','You can insert one row, many rows, or the result of a SELECT.'], a:'Adding new lines to a ledger.',
  h:['`INSERT INTO t (cols) VALUES (...)`.','Several rows: `VALUES (...), (...)`.','Skipped columns get DEFAULT or NULL.','`INSERT ... SELECT` copies rows.'],
  d:[FL(['INSERT'],[{ title:'Statement', text:'INSERT INTO products (product_name, price)\nVALUES (\'Pen\', 10), (\'Book\', 60);' },{ title:'Table', rows:[['product_id','product_name','price'],[1,'Pen',10],[2,'Book',60]], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','Insert from a query','Copy large orders to an archive.','INSERT ... SELECT.','INSERT INTO big_orders (order_id, amount)\nSELECT order_id, amount FROM orders WHERE amount >= 1000;',['The query result becomes the rows.'],'Orders 1 and 3 are copied.',T(ORD,'Table: orders')),
     X('Business case','Insert or update','A feed may contain existing ids.','Use ON DUPLICATE KEY UPDATE.','INSERT INTO customers (customer_id, name, city)\nVALUES (101, \'Asha\', \'Mumbai\')\nON DUPLICATE KEY UPDATE city = VALUES(city);',['If the key exists, the city is updated instead.'],'An upsert in one statement.')],
  e:[['No column list','Depends on the table order and breaks when columns change.'],['Constraint errors','Duplicate keys and NOT NULL violations are rejected.'],['Quoting','Text and dates need single quotes.'],['Large loads','Use multi-row inserts or LOAD DATA.']],
  p:[P('Medium','Add customer 105, Gita, Delhi.','Name the columns.','INSERT INTO customers (customer_id, name, city) VALUES (105, \'Gita\', \'Delhi\');','One row.'),
     P('Interview','Insert a row or update it if the key exists.','Upsert.','INSERT ... ON DUPLICATE KEY UPDATE in MySQL, MERGE in SQL Server and Oracle.','Mention dialects.')],
  q:[Q('Basic','How do you insert a row?','INSERT INTO table (columns) VALUES (values).',{ f:[['Why name the columns?','Safety against column order changes.']] }),
     Q('Scenario','Load 1 million rows.','Batch multi-row inserts or LOAD DATA, inside a transaction.',{ t:'Disable non-essential indexes only with a plan.' })],
  r:RT(['Form','Use'],[['`VALUES (...)`','One row'],['`VALUES (...), (...)`','Many rows'],['`INSERT ... SELECT`','From a query'],['Upsert','`ON DUPLICATE KEY UPDATE`']]), rel:['update-sql','create-table','constraints','transactions'] });

/* --- update-sql --- */
D('update-sql',{ l:'Beginner', t:'UPDATE changes rows. Always include WHERE, preview with a SELECT, and use a transaction.',
  i:['UPDATE rewrites values in existing rows. The WHERE clause decides which rows. Without it, every row changes.','The safest habit is to run the same WHERE in a SELECT first, wrap the UPDATE in a transaction, and check the affected row count.'], a:'Correcting entries in a ledger: check the page before erasing.',
  h:['Write `UPDATE table SET col = value`.','Add `WHERE` to choose rows.','Preview with `SELECT * ... WHERE`.','Run inside a transaction and check the count.'],
  d:[FL(['SET salary = salary * 1.1 WHERE dept_id = 20'],[{ title:'Before', rows:[['name','salary'],['Bilal',40000],['Esha',40000]] },{ title:'After', rows:[['name','salary'],['Bilal',44000],['Esha',44000]], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','Update from another table','Copy a department name into employees (denormalise).','Use a join.','UPDATE employees e JOIN departments d ON e.dept_id = d.dept_id\nSET e.dept_name = d.dept_name;',['The join pairs each employee with their department.'],'Each employee gets a name.'),
     X('Business case','A safe update workflow','A raise for Finance must not touch others.','Preview, transaction, check.','SELECT * FROM employees WHERE dept_id = 20;\nSTART TRANSACTION;\nUPDATE employees SET salary = salary * 1.10 WHERE dept_id = 20;\n-- check ROW_COUNT(): expect 2\nCOMMIT;',['The SELECT shows which rows change.','A wrong count means ROLLBACK.'],'Bilal and Esha change to 44000.',T(EMP,'Table: employees'))],
  e:[['No WHERE','Updates every row.'],['Safe-update mode','MySQL can refuse updates without a key condition.'],['Self-reference','SET a = a + 1 uses the old value.'],['Triggers and cascades','Updates may fire triggers or foreign key actions.']],
  p:[P('Medium','Give Finance a 10% raise.','Salary times 1.10.','UPDATE employees SET salary = salary * 1.10 WHERE dept_id = 20;','Bilal and Esha to 44000.',T(EMP,'Table: employees')),
     P('Interview','You forgot WHERE. What now?','Transaction.','If still in a transaction, ROLLBACK. Otherwise restore from backup.','Prevention: transactions and previews.')],
  q:[Q('Basic','What does UPDATE do?','It changes values in existing rows that match WHERE.',{ f:[['Without WHERE?','Every row changes.']] }),
     Q('Scenario','How do you make updates safe?','SELECT first, wrap in a transaction, check the row count, then COMMIT.',{ t:'Keep before-values for rollback.' })],
  r:RT(['Habit','Why'],[['Preview with SELECT','See affected rows'],['Transaction','Allows ROLLBACK'],['Check row count','Catches mistakes'],['Backup','Last resort']]), rel:['delete-sql','transactions','insert-into','where'] });

/* --- delete-sql --- */
D('delete-sql',{ l:'Beginner', t:'DELETE removes rows matching WHERE. Without WHERE it removes all rows, and foreign keys can block it.',
  i:['DELETE is the most destructive everyday command. The same safe workflow applies: preview with SELECT, delete inside a transaction, check the count.','Rows referenced by other tables may be protected by foreign keys.'], a:'Tearing pages out of a notebook: check the page first.',
  h:['`DELETE FROM table WHERE condition`.','Preview with the same WHERE in a SELECT.','Use a transaction.','Check the affected row count.'],
  d:[FL(['DELETE WHERE order_id = 6'],[{ title:'Before (6 rows)', rows:[['order_id','amount'],[5,900],[6,600]], hl:{2:'miss'} },{ title:'After', rows:[['order_id','amount'],[5,900]] }])],
  x:[X('Variation','Delete by a condition on dates','Remove orders before February.','Date condition.','DELETE FROM orders WHERE order_date < \'2026-02-01\';',['Orders 1 and 2 match.'],'Two rows removed.',T(ORD,'Table: orders')),
     X('Business case','Blocked by a foreign key','Deleting a customer who has orders.','See the error.','DELETE FROM customers WHERE customer_id = 101;',['Orders reference this customer.'],'Error 1451: a foreign key constraint fails. Delete or reassign the orders first, or choose ON DELETE rules deliberately.')],
  e:[['No WHERE','Deletes everything.'],['Foreign keys','Parent rows with children cannot be deleted under RESTRICT.'],['Soft deletes','Many systems mark rows inactive instead of deleting.'],['Performance','Large deletes are slow; delete in batches.']],
  p:[P('Medium','Delete orders before 2026-02-01.','Date condition.','DELETE FROM orders WHERE order_date < \'2026-02-01\';','Orders 1 and 2.',T(ORD,'Table: orders')),
     P('Interview','How do you make a DELETE safe?','Workflow.','Preview with SELECT, START TRANSACTION, DELETE, check ROW_COUNT, COMMIT or ROLLBACK, and keep a backup.','Mention batching for large tables.')],
  q:[Q('Basic','What does DELETE do?','It removes rows that match the condition.',{ f:[['Does it drop the table?','No.']] }),
     Q('Scenario','Delete 50 million old rows.','Delete in batches with LIMIT, or partition by date and drop partitions.',{ t:'Large single deletes lock tables and bloat logs.' })],
  r:RT(['Command','Effect'],[['`DELETE ... WHERE`','Selected rows'],['No WHERE','All rows'],['Blocked by','Foreign keys'],['Safer','Soft delete, transaction']]), rel:['update-sql','drop-truncate','transactions','delete-duplicate-rows'] });

/* --- constraints --- */
DEEP['constraints'] = {
  level:'Intermediate',
  tldr:'Constraints are rules enforced by the database itself: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK and DEFAULT.',
  intuition:{ text:[
    'Applications have bugs, files get loaded by scripts, and people type in data. If the only protection is "the form checks it", bad data eventually arrives. Constraints move the rules into the database, where they apply to every source of data without exception.',
    'Think of them as the data\'s own quality control: a row that breaks a rule is rejected before it is stored.'
  ], analogy:'Locks on a warehouse door: whoever tries to bring in the wrong item is stopped at the door.' },
  how:[
    'Declare constraints when you create the table, or add them with `ALTER TABLE`.',
    'On every INSERT or UPDATE, the database checks the rules.',
    'A row that breaks a rule is rejected with an error.',
    '`DEFAULT` is the exception: it supplies a value when none is given.',
    'Existing data must satisfy a constraint before you can add it.'
  ],
  diagrams:[
    { type:'flow', panels:[
      { title:'Constraints and what they reject', rows:[['Constraint','Rejects'],['NOT NULL','a missing value'],['UNIQUE','a duplicate value'],['PRIMARY KEY','duplicates and NULL'],['FOREIGN KEY','a value with no parent row'],['CHECK','a value failing a condition'],['DEFAULT','(fills a missing value)']] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Adding a constraint to an existing table', scenario:'Salaries must be positive, and the table already exists.', table:T(EMP,'Table: employees'), task:'Add and test a CHECK constraint.', formula:'ALTER TABLE employees\n  ADD CONSTRAINT chk_salary CHECK (salary > 0);\n\nINSERT INTO employees (emp_id, name, salary)\nVALUES (7, \'Gita\', -5);   -- rejected', steps:['Existing rows are checked first. All salaries are positive, so the constraint is added.','The insert with -5 violates the rule and fails.'], result:'Error: Check constraint \'chk_salary\' is violated. Note that CHECK is enforced from MySQL 8.0.16.' },
    { level:'Business case', title:'Foreign key behaviour on delete', scenario:'What should happen to orders when a customer is deleted? The foreign key rule decides.', table:withHl({rows:[['ON DELETE','Effect on orders']]},{},'Options'), task:'Compare the options.',
      formula:'FOREIGN KEY (customer_id) REFERENCES customers(customer_id)\n  ON DELETE RESTRICT   -- block the delete\n  ON DELETE CASCADE    -- delete the orders too\n  ON DELETE SET NULL   -- keep orders, clear the customer', steps:['RESTRICT protects history: customers with orders cannot be deleted.','CASCADE removes dependent rows automatically, which can be dangerous.','SET NULL keeps the orders but loses the link.'], table2:{ rows:[['Rule','Customer with orders deleted'],['RESTRICT','Error: delete blocked'],['CASCADE','Customer and orders deleted'],['SET NULL','Customer deleted, orders kept with NULL customer']], caption:'Outcome' }, result:'For financial data, RESTRICT (or soft deletes) is usually the safest choice.' }
  ],
  edge:[
    { t:'CHECK in older MySQL', d:'MySQL before 8.0.16 parses CHECK but ignores it. Test that your version enforces it.' },
    { t:'UNIQUE allows NULLs', d:'A UNIQUE column can hold several NULLs, because NULLs are not equal to each other. A PRIMARY KEY cannot be NULL.' },
    { t:'Constraints and bulk loads', d:'Constraints slow bulk inserts slightly. Never drop them to load faster without a plan to validate afterwards.' },
    { t:'Existing bad data', d:'Adding a constraint fails if existing rows violate it. Find and fix them first with a query.' },
    { t:'Name your constraints', d:'`CONSTRAINT chk_salary CHECK ...` gives clear error messages and makes it easy to drop later.' },
    { t:'Application checks are still needed', d:'Constraints are the last line of defence. Friendly validation in the application gives better messages.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Write a CREATE TABLE for products with an auto-numbered key, a required unique name, a price that cannot be negative, and a default status of active.', hint:'Four different constraints.', solution:'CREATE TABLE products (\n  product_id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(50) NOT NULL UNIQUE,\n  price DECIMAL(10,2) CHECK (price >= 0),\n  status VARCHAR(10) DEFAULT \'active\'\n);', explain:'Each column states its own rule. Inserting a negative price or a duplicate name is rejected, and a missing status becomes active.' },
    { level:'Interview', q:'What is the difference between PRIMARY KEY and UNIQUE?', hint:'NULL and count.', solution:'Both prevent duplicates. A table has exactly one PRIMARY KEY, which cannot contain NULL. A table can have several UNIQUE constraints, and the columns may allow NULL (in MySQL, multiple NULLs).', explain:'Adding "the primary key is also what other tables reference" completes the answer.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What are constraints in SQL?', a:'Rules enforced by the database on the data in a table: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK and DEFAULT. They prevent invalid data from being stored.',
      follow:[ { q:'Why not just validate in the application?', a:'Data can arrive from many places: scripts, imports, other applications. Constraints protect the data no matter the source.' } ] },
    { level:'Intermediate', q:'What does ON DELETE CASCADE do and when is it dangerous?', a:'It deletes child rows automatically when the parent row is deleted. It is dangerous when an accidental delete of a parent silently removes a lot of related history, so I prefer RESTRICT for important data.' },
    { level:'Scenario', q:'You must add a UNIQUE constraint on email to a table that already has duplicates. What do you do?', a:'Find the duplicates with GROUP BY and HAVING, decide which rows to keep, clean or merge them (and standardise case and spaces first), then add the constraint. I do it in a transaction on a copy first.' }
  ],
  ref:{ headers:['Constraint','Ensures'], rows:[['`NOT NULL`','A value is present'],['`UNIQUE`','No duplicates (NULL allowed)'],['`PRIMARY KEY`','Unique and not NULL'],['`FOREIGN KEY`','Value exists in another table'],['`CHECK`','A condition holds (8.0.16+)'],['`DEFAULT`','A fallback value']] },
  related:['primary-key','foreign-key','create-table','alter-table']
};

/* --- indexes --- */
DEEP['indexes'] = {
  level:'Intermediate',
  tldr:'An index is a sorted lookup structure that lets the database find rows without scanning the whole table. It speeds up reads and slows down writes.',
  intuition:{ text:[
    'Without an index, finding "all employees in department 10" means reading every row. With an index on dept_id, the database jumps straight to the right place, like using the index at the back of a book instead of reading every page.',
    'The price is that the index must be updated every time a row is inserted, changed or deleted, and it takes disk space. So you index the columns you search, join and sort on, not everything.'
  ], analogy:'The index at the back of a textbook: fast to find a topic, but someone must update it whenever a page changes.' },
  how:[
    'Create an index on a column: `CREATE INDEX idx_dept ON employees (dept_id);`.',
    'Primary and unique keys are indexed automatically.',
    'The optimizer uses an index when a query filters, joins or sorts on its leading column.',
    'Use `EXPLAIN` to see whether the index is used (`key`) and how many rows are examined.',
    'A **composite index** on (a, b) is used for queries on a, or on a and b, but not on b alone.'
  ],
  diagrams:[
    { type:'flow', arrows:['CREATE INDEX'], panels:[
      { title:'Without an index', text:'Scan **every** row\nlooking for dept_id = 10' },
      { title:'With an index', text:'Jump to dept_id = 10\nread only matching rows' }
    ], caption:'EXPLAIN shows type = ALL (full scan) before, and ref (index lookup) after.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A composite index and the leftmost prefix', scenario:'Queries often filter by region and then sort by date.', table:T(ORD,'Table: orders'), task:'Create one index to serve both.',
      formula:'CREATE INDEX idx_cust_date\n  ON orders (customer_id, order_date);\n\n-- uses the index\nSELECT * FROM orders WHERE customer_id = 101 ORDER BY order_date;\n-- cannot use it efficiently\nSELECT * FROM orders WHERE order_date = \'2026-02-03\';', steps:['The index is sorted by customer_id, then order_date inside each customer.','The first query finds the customer and reads dates already sorted.','The second query skips the leading column, so the index does not help.'], result:'The order of columns in a composite index decides which queries it can serve.' },
    { level:'Business case', title:'A slow report and the fix', scenario:'A dashboard filters 20 million orders by year, and takes 40 seconds.', table:T({rows:[['Query','Plan']]},'EXPLAIN comparison'), task:'Diagnose and fix.',
      formula:'-- slow: function on the column\nSELECT SUM(amount) FROM orders WHERE YEAR(order_date) = 2026;\n\n-- fast: range on an indexed column\nSELECT SUM(amount) FROM orders\nWHERE order_date >= \'2026-01-01\' AND order_date < \'2027-01-01\';', steps:['YEAR(order_date) forces the database to compute the year for every row.','A date range can use an index on order_date.'], table2:{ rows:[['Version','type','key'],['YEAR(order_date) = 2026','ALL','NULL'],['Date range','range','idx_order_date']], caption:'EXPLAIN summary (illustrative)' }, result:'Rewriting the filter plus an index on order_date turns a full scan into a range scan.' }
  ],
  edge:[
    { t:'Functions on indexed columns', d:'`WHERE YEAR(col) = 2026`, `UPPER(col) = ...` and `col + 0 = ...` stop the index being used. Rewrite as ranges or index the expression.' },
    { t:'Leading wildcards', d:'`LIKE \'%text\'` cannot use an index. `LIKE \'text%\'` can.' },
    { t:'Low-selectivity columns', d:'An index on a column with few distinct values (such as a yes/no flag) rarely helps, because it matches half the table.' },
    { t:'Write cost', d:'Every index slows INSERT, UPDATE and DELETE. Tables with heavy writes should have only the indexes they need.' },
    { t:'Column order in composite indexes', d:'Put equality columns first and range or sort columns after. (a, b) does not help a query on b alone.' },
    { t:'Type mismatch', d:'Comparing a number column with a string can disable the index. Keep types identical.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Which index best helps `SELECT * FROM customers WHERE city = \'Pune\' ORDER BY name`?', table:T(CUST,'Table: customers'), hint:'Filter column first, sort column second.', solution:'CREATE INDEX idx_city_name ON customers (city, name);', explain:'The database finds the Pune rows through the first column and reads them already sorted by name, so no extra sort is needed.' },
    { level:'Interview', q:'You added an index on order_date, but `WHERE DATE(order_date) = \'2026-02-03\'` is still slow. Why and what do you change?', hint:'A function is wrapped around the column.', solution:'DATE(order_date) transforms every value, so the index cannot be used.\nRewrite: WHERE order_date >= \'2026-02-03\' AND order_date < \'2026-02-04\'.', explain:'Sargable conditions, where the column stands alone on one side, can use an index.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is an index and why use one?', a:'An index is a data structure that lets the database find rows quickly without scanning the whole table. It speeds up queries that filter, join or sort on the indexed columns.',
      follow:[ { q:'What is the downside?', a:'It uses storage and slows down writes, because the index must be maintained on every insert, update and delete.' } ] },
    { level:'Intermediate', q:'Explain the leftmost prefix rule.', a:'A composite index on (a, b, c) can be used for queries that filter on a, on a and b, or on a, b and c. It is not useful for b or c alone, because the index is sorted by a first.',
      structure:'State the rule, give the (a, b, c) example, then explain why: the sort order.' },
    { level:'Scenario', q:'A query is slow. How do you decide whether an index will help?', a:'I run EXPLAIN to see the access type and rows examined, check which columns are in WHERE, JOIN and ORDER BY, look at selectivity, and test an index on a copy. I also check whether a function or type mismatch prevents index use.',
      tradeoff:'More indexes help reads but hurt writes. For write-heavy tables, add only the proven ones.' }
  ],
  ref:{ headers:['Question','Answer'], rows:[['Auto-indexed','Primary key, unique key'],['Helps','WHERE, JOIN, ORDER BY on the leading column'],['Does not help','Function on column, leading `%`, low selectivity'],['Check with','`EXPLAIN`'],['Cost','Slower writes, more space']] },
  related:['query-optimization','primary-key','execution-order','like-sql']
};

/* --- views --- */
D('views',{ l:'Intermediate', t:'A view is a saved query that behaves like a table. It stores no data, always shows current results, and can hide columns for security.',
  i:['If analysts repeat a complicated query, save it as a view and let them query it like a table. If some columns are sensitive, expose a view without them.','A view is only a stored SELECT, so it is always up to date, and using it runs the query each time.'], a:'A saved search that you can open like a folder.',
  h:['`CREATE VIEW name AS SELECT ...`.','Query it like a table.','`CREATE OR REPLACE VIEW` updates it.','`DROP VIEW` removes it; table data is untouched.'],
  d:[FL(['CREATE VIEW high_earners'],[{ title:'Stored query', text:'SELECT name, salary\nFROM employees\nWHERE salary >= 50000' },{ title:'SELECT * FROM high_earners', rows:[['name','salary'],['Asha',50000],['Chitra',60000]], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','A summary view','Customer totals.','Group inside the view.','CREATE VIEW customer_totals AS\nSELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id;',['Querying the view re-runs the aggregate.'],'3300, 1700, 700.',T(ORD,'Table: orders')),
     X('Business case','Hiding sensitive columns','HR data includes salary, but managers should not see it.','Expose a limited view.','CREATE VIEW staff_public AS SELECT emp_id, name, dept_id FROM employees;\nGRANT SELECT ON staff_public TO \'manager\'@\'%\';',['The view omits salary.'],'Managers see names but not pay.',T(EMP,'Table: employees'))],
  e:[['No data stored','A view re-runs its query. Complex views can be slow.'],['Updatable views','Only simple single-table views can be updated.'],['Stacked views','Views on views are hard to debug and slow.'],['Materialised views','Not native in MySQL; other databases store results.']],
  p:[P('Medium','A view of high earners.','SELECT with WHERE.','CREATE VIEW high_earners AS SELECT name, salary FROM employees WHERE salary >= 50000;','Asha and Chitra.',T(EMP,'Table: employees')),
     P('Interview','View versus table?','Stored data.','A table stores data. A view stores a query and shows current data from tables.','Mention security.')],
  q:[Q('Basic','What is a view?','A saved SELECT that behaves like a virtual table.',{ f:[['Does it store data?','No.']] }),
     Q('Scenario','Give analysts safe access.','Views that expose approved columns and rows, with SELECT privileges on the views only.',{ t:'Document view definitions.' })],
  r:RT(['Fact','Detail'],[['Stores','A query'],['Data','Always current'],['Use','Reuse and security'],['Update','Simple views only']]), rel:['create-table','cte','stored-procedures','sql-command-types'] });

/* --- transactions --- */
DEEP['transactions'] = {
  level:'Intermediate',
  tldr:'A transaction groups statements so they succeed or fail **together**: COMMIT saves them all, ROLLBACK undoes them all.',
  intuition:{ text:[
    'Moving money from one account to another takes two updates: subtract from A, add to B. If the system crashes between them, money disappears. A transaction promises that either both happen or neither does.',
    'The same idea protects any multi-step change: create an order and reduce stock, or move rows between tables. Transactions are what let a database be trusted with important data.'
  ], analogy:'Writing on a whiteboard in pencil: nothing is permanent until you ink it (COMMIT), and you can erase everything (ROLLBACK).' },
  how:[
    '`START TRANSACTION` begins the unit of work.',
    'Run the statements. Other sessions do not see your uncommitted changes (depending on the isolation level).',
    '`COMMIT` makes all changes permanent.',
    '`ROLLBACK` undoes everything since the start.',
    'MySQL runs in **autocommit** mode by default: each statement commits itself unless you start a transaction.'
  ],
  diagrams:[
    { type:'flow', arrows:['both updates ok','something fails'], panels:[
      { title:'START TRANSACTION', text:'A: 1000 → 800\nB: 500 → 700' },
      { title:'COMMIT', text:'Both changes saved' },
      { title:'ROLLBACK', text:'A: 1000, B: 500 (unchanged)' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A SAVEPOINT for partial rollback', scenario:'You load a batch in two parts and want to undo only the second part if it fails.', table:T({rows:[['step','action']]},'Steps'), task:'Use a savepoint.', formula:'START TRANSACTION;\nINSERT INTO orders VALUES (7, 101, \'2026-03-20\', 500);\nSAVEPOINT after_first;\nINSERT INTO orders VALUES (8, 999, \'2026-03-20\', 300); -- fails: unknown customer\nROLLBACK TO after_first;\nCOMMIT;',
      steps:['The first insert succeeds.','The second fails the foreign key check.','ROLLBACK TO undoes only changes after the savepoint.'], result:'Order 7 is saved, order 8 is not.' },
    { level:'Business case', title:'Placing an order and reducing stock', scenario:'Creating an order must also reduce stock. A crash between the two steps would leave the data inconsistent.', table:withHl({rows:[['product','stock'],['Pen',100]]},{},'Table: stock'), task:'Make both steps atomic.',
      formula:'START TRANSACTION;\nINSERT INTO orders (customer_id, product, qty) VALUES (101, \'Pen\', 5);\nUPDATE stock SET stock = stock - 5 WHERE product = \'Pen\';\n-- check: stock must not go negative\nCOMMIT;', steps:['Both statements run inside one transaction.','If any step fails, ROLLBACK leaves both tables as they were.'], result:'The order and the stock level always agree, even if the server crashes mid-way.' }
  ],
  edge:[
    { t:'Autocommit', d:'By default, MySQL commits every statement. A transaction only exists after START TRANSACTION (or SET autocommit = 0).' },
    { t:'DDL commits implicitly', d:'CREATE, ALTER, DROP and TRUNCATE end the current transaction in MySQL. You cannot roll them back.' },
    { t:'Storage engine', d:'Transactions need InnoDB. MyISAM tables ignore them.' },
    { t:'Long transactions', d:'They hold locks and block others. Keep them short, and commit promptly.' },
    { t:'Isolation levels', d:'READ COMMITTED, REPEATABLE READ (MySQL default) and SERIALIZABLE trade consistency against concurrency. Know the default.' },
    { t:'Deadlocks', d:'Two transactions waiting for each other\'s locks. The database rolls one back; the application should retry.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'You ran an UPDATE without WHERE inside a transaction and noticed immediately. What do you do?', hint:'Undo.', solution:'ROLLBACK;', explain:'Because the change was never committed, ROLLBACK restores all rows. This is why risky changes should always be wrapped in a transaction.' },
    { level:'Interview', q:'Explain ACID with an example.', hint:'Four properties; use the bank transfer.', solution:'Atomicity: both updates happen or neither.\nConsistency: balances stay valid (no negative balance if forbidden).\nIsolation: another session never sees money removed from A but not yet added to B.\nDurability: after COMMIT the transfer survives a crash.', explain:'Four short sentences tied to one example are better than abstract definitions.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a transaction and what does ACID stand for?', a:'A transaction is a group of statements executed as one unit: all are committed or all are rolled back. ACID stands for atomicity, consistency, isolation and durability.',
      structure:'Define, give the bank transfer, then one line per property.',
      follow:[ { q:'What is the difference between COMMIT and ROLLBACK?', a:'COMMIT saves all changes permanently. ROLLBACK discards them back to the start of the transaction or a savepoint.' } ] },
    { level:'Intermediate', q:'What are isolation levels?', a:'They control how much a transaction sees of other transactions\' uncommitted or newly committed changes. From weakest to strongest: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ (the MySQL default) and SERIALIZABLE. Stronger isolation avoids anomalies but reduces concurrency.' },
    { level:'Scenario', q:'Two users update the same row at the same time. What protects the data?', a:'Row locks. The second transaction waits until the first commits or rolls back, or fails with a lock timeout or deadlock, in which case the application retries.',
      tradeoff:'Short transactions reduce waiting. Optimistic approaches (version columns) trade lock time for retries.' }
  ],
  ref:{ headers:['Command','Effect'], rows:[['`START TRANSACTION`','Begin'],['`COMMIT`','Save all changes'],['`ROLLBACK`','Undo all changes'],['`SAVEPOINT x` / `ROLLBACK TO x`','Partial undo'],['Autocommit','On by default in MySQL']] },
  related:['update-sql','delete-sql','sql-command-types','constraints']
};
})();
