/* Datapath | SQL | SQL foundations
 * Lessons in this file: sql-intro, sql-data-types, primary-key, foreign-key, sql-command-types
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
  const { EMP, DEPT, ORD } = DP.datasets.sql;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- sql-intro --- */
'sql-intro': {
  title:'What is SQL?', tagline:'The language for asking questions of a relational database.',
  prereq:[], whatTitle:'What is SQL?',
  what:['SQL (Structured Query Language) is used to read and manage data in relational databases.','A database holds **tables**. A table has **rows** (records) and **columns** (fields).','MySQL, PostgreSQL, SQL Server and Oracle are database systems that all use SQL.'],
  why:['Analysts pull data straight from company databases with millions of rows.','SQL is asked in almost every data analyst interview.'],
  syntax:{ code:'SELECT column1, column2\nFROM table_name;', parts:[['SELECT','Which columns to return.'],['FROM','Which table to read from.'],[';','Ends the statement.']] },
  points:['Keywords such as SELECT are not case sensitive, but are written in capitals by convention.','Text values go in **single quotes**: `\'Pune\'`.','Every statement ends with a semicolon.','Comments: `-- one line` or `/* many lines */`.','This course uses **MySQL** syntax, and notes where SQL Server or PostgreSQL differ.','SQL describes **what** you want, not how to get it.'],
  mistakes:['Forgetting the semicolon between statements.','Using double quotes for text.','Using SELECT * on huge tables.'],
  example:{ title:'Reading two columns', scenario:'A company keeps its staff in a table called employees. You want each name with the salary.',
    table:withHl(EMP,{'B1':'find','D1':'find'},'Table: employees'), task:'Return the name and salary of every employee.', formula:'SELECT name, salary\nFROM employees;',
    steps:['FROM employees says which table to read.','SELECT name, salary picks the two columns.'],
    table2:{ rows:[['name','salary'],['Asha',50000],['Bilal',40000],['Chitra',60000],['Deepak',45000],['Esha',40000],['Farhan',35000]], caption:'Result' }, result:'Six rows come back, one for each employee.' },
  practice:{ q:'Write a query that returns every column of the departments table.', table:T(DEPT,'Table: departments'), hint:'Use the star symbol to mean all columns.', solution:'SELECT *\nFROM departments;', explain:'The star returns all columns. It is fine for learning, but in real work name the columns you need.' },
  interview:[
    { level:'Basic', q:'What is SQL?', a:'Structured Query Language, the standard language for reading and managing data stored in relational databases.' },
    { level:'Basic', q:'What is the difference between SQL and MySQL?', a:'SQL is the language. MySQL is a database system that understands SQL. PostgreSQL and SQL Server are other systems that use their own versions of SQL.' },
    { level:'Intermediate', q:'What is a relational database?', a:'A database that stores data in tables with rows and columns, and links tables using keys, such as employees linked to departments by dept_id.' },
    { level:'Intermediate', q:'Is SQL case sensitive?', a:'Keywords are not. Table and column names may be, depending on the system and settings, so I use consistent lowercase names.' }
  ],
  mcq:[
    { q:'What does SQL stand for?', o:['Structured Query Language','Simple Question Language','Sorted Query List','System Query Logic'], a:0, why:'SQL is Structured Query Language.' },
    { q:'What is a row in a table?', o:['One record','One column','One database','One query'], a:0, why:'A row holds one record, such as one employee.' },
    { q:'Which quotes are used for text in SQL?', o:['Single quotes','Square brackets','Hash signs','No quotes'], a:0, why:'Standard SQL uses single quotes for text values.' },
    { q:'Which is a database system, not a language?', o:['MySQL','SELECT','WHERE','JOIN'], a:0, why:'MySQL is software that runs SQL.' },
    { q:'What ends a SQL statement?', o:['A semicolon','A full stop','A comma','Nothing'], a:0, why:'The semicolon marks the end.' }
  ],
  recap:['SQL reads and manages data in relational databases.','Tables hold rows and columns; text goes in single quotes.','SELECT picks columns and FROM names the table.']
},

/* --- sql-data-types --- */
'sql-data-types': {
  title:'Data types', tagline:'Choose the right type for every column.',
  prereq:['sql-intro'],
  what:['Every column has a **data type** that decides what it can store.','Numbers, text and dates each have their own types.','The right type saves space and prevents wrong results.'],
  why:['Sorting, maths and date logic only work correctly with the right type.','Interviewers ask when to use DECIMAL, VARCHAR and DATE.'],
  syntax:{ code:'INT\nDECIMAL(10,2)\nVARCHAR(50)\nCHAR(2)\nDATE\nDATETIME\nBOOLEAN', parts:[['INT','Whole numbers.'],['DECIMAL(p,s)','Exact numbers with p digits, s after the point. Use for money.'],['VARCHAR(n)','Text up to n characters.'],['DATE / DATETIME','A date, or a date with time.']] },
  points:['Use **DECIMAL** for money, not FLOAT, which can give tiny rounding errors.','VARCHAR stores variable text; CHAR is fixed length, for codes such as state codes.','Store dates as **DATE**, never as text.','BOOLEAN is stored as 0 or 1 in MySQL.','TEXT holds long text such as comments.','Wrong types make sorting odd: text numbers sort as 1, 10, 2.'],
  mistakes:['Storing dates or phone numbers in the wrong type.','Using FLOAT for money.','Making VARCHAR far too long.'],
  example:{ title:'Types for an orders table', scenario:'You design the orders table and choose a type for each column.',
    table:T(ORD,'Table: orders (sample rows)'), task:'See the types used by the table.', formula:'DESCRIBE orders;',
    steps:['IDs are whole numbers, so INT.','order_date is a real date, so DATE.','amount is money, so DECIMAL(10,2).'],
    table2:{ rows:[['Field','Type'],['order_id','int'],['customer_id','int'],['order_date','date'],['amount','decimal(10,2)']], caption:'Output of DESCRIBE' }, result:'Each column has a type matching the data it holds.' },
  practice:{ q:'Which type would you use for: (a) a price, (b) a customer name, (c) a joining date, (d) a two-letter state code?', hint:'Money needs exact decimals; codes have a fixed length.', solution:'(a) DECIMAL(10,2)\n(b) VARCHAR(100)\n(c) DATE\n(d) CHAR(2)', explain:'DECIMAL keeps money exact, VARCHAR fits names of varying length, DATE allows date maths, and CHAR(2) suits fixed codes.' },
  interview:[
    { level:'Basic', q:'What is the difference between CHAR and VARCHAR?', a:'CHAR has a fixed length and pads shorter values. VARCHAR stores only the characters given, up to a maximum. I use CHAR for fixed codes and VARCHAR for names.' },
    { level:'Intermediate', q:'Why use DECIMAL instead of FLOAT for money?', a:'DECIMAL is exact. FLOAT is approximate, so sums can drift by tiny amounts, which is not acceptable for money.' },
    { level:'Intermediate', q:'Why not store dates as text?', a:'Text dates sort alphabetically, cannot be used in date functions and allow invalid values. A DATE column validates and supports date maths.' },
    { level:'Scenario', q:'A phone number column was created as INT. What goes wrong?', a:'Leading zeros are lost, long numbers can overflow and plus signs cannot be stored. VARCHAR is better, because we never do arithmetic on phone numbers.' }
  ],
  mcq:[
    { q:'Which type is best for money?', o:['DECIMAL','FLOAT','TEXT','DATE'], a:0, why:'DECIMAL stores exact values.' },
    { q:'Which type stores a date?', o:['DATE','VARCHAR','INT','CHAR'], a:0, why:'DATE is made for dates.' },
    { q:'Which is variable-length text?', o:['VARCHAR','CHAR','INT','DATE'], a:0, why:'VARCHAR stores up to a maximum length.' },
    { q:'How do text numbers sort?', o:['1, 10, 2','1, 2, 10','10, 2, 1','Randomly'], a:0, why:'Text sorts character by character.' },
    { q:'Which suits a fixed 2-letter code?', o:['CHAR(2)','TEXT','DECIMAL','DATETIME'], a:0, why:'CHAR has a fixed length.' }
  ],
  recap:['Pick the type that matches the data: DECIMAL for money, DATE for dates.','VARCHAR is variable text and CHAR is fixed.','Never store dates or numbers as text.']
},

/* --- primary-key --- */
'primary-key': {
  title:'Primary key', tagline:'The column that identifies each row uniquely.',
  prereq:['sql-data-types'],
  what:['A **primary key** uniquely identifies every row in a table.','It cannot contain NULL and cannot repeat.','Each table has only one primary key.'],
  why:['It is how other tables refer to a row.','Without it, duplicates and wrong joins appear.'],
  syntax:{ code:'CREATE TABLE employees (\n  emp_id INT PRIMARY KEY,\n  name VARCHAR(50)\n);', parts:[['PRIMARY KEY','Makes the column unique and not NULL.'],['AUTO_INCREMENT','Optional. Gives each new row the next number automatically.']] },
  points:['A primary key is **unique** and **NOT NULL**.','Only one primary key per table, but it may have several columns (a composite key).','It is usually a number such as emp_id, with AUTO_INCREMENT.','The database creates an index on it automatically.','Choose a value that never changes.'],
  mistakes:['Using a changeable value, such as an email, as the key.','Thinking a table can have two primary keys.','Leaving a table without a key.'],
  example:{ title:'emp_id as the key', scenario:'Every employee has a unique emp_id, so it works as the primary key.',
    table:withHl(EMP,{'A2:A7':'range'},'Table: employees'), task:'Try to insert a second employee with emp_id 3.', formula:'INSERT INTO employees (emp_id, name) VALUES (3, \'Gita\');',
    steps:['emp_id 3 already belongs to Chitra.','The primary key does not allow duplicates, so the database rejects the row.'], result:'The database returns an error: Duplicate entry \'3\' for key \'PRIMARY\'.' },
  practice:{ q:'Write the column definition that makes customer_id the primary key of a customers table.', hint:'Add PRIMARY KEY after the data type.', solution:'CREATE TABLE customers (\n  customer_id INT PRIMARY KEY,\n  name VARCHAR(50),\n  city VARCHAR(50)\n);', explain:'Each customer_id must now be unique and not NULL.' },
  interview:[
    { level:'Basic', q:'What is a primary key?', a:'A column (or set of columns) that uniquely identifies each row. It cannot be NULL or duplicated.' },
    { level:'Basic', q:'Can a table have more than one primary key?', a:'No, one primary key per table. It can be a composite key made of several columns.' },
    { level:'Intermediate', q:'What is the difference between a primary key and a unique key?', a:'Both prevent duplicates. A primary key cannot be NULL and there is only one per table. A table can have several unique keys, and they may allow NULL.' },
    { level:'Scenario', q:'Would you use an email address as a primary key?', a:'Usually not, because emails can change. A stable surrogate key such as an AUTO_INCREMENT id is safer, with a unique constraint on the email.' }
  ],
  mcq:[
    { q:'Can a primary key contain NULL?', o:['No','Yes','Only once','Only in MySQL'], a:0, why:'Primary keys are NOT NULL.' },
    { q:'How many primary keys can a table have?', o:['One','Two','Any number','None'], a:0, why:'Only one, though it can span several columns.' },
    { q:'What happens on a duplicate key insert?', o:['An error','The row is overwritten','It is ignored silently','NULL is stored'], a:0, why:'The database rejects the duplicate.' },
    { q:'What does AUTO_INCREMENT do?', o:['Generates the next number automatically','Sorts rows','Deletes duplicates','Joins tables'], a:0, why:'It assigns the next id for each new row.' },
    { q:'What is a composite key?', o:['A key made of several columns','A key with text','A foreign key','An index only'], a:0, why:'Together the columns are unique.' }
  ],
  recap:['A primary key is unique and NOT NULL.','One per table, possibly multi-column.','Prefer a stable id over a changeable value.']
},

/* --- foreign-key --- */
'foreign-key': {
  title:'Foreign key', tagline:'The column that links one table to another.',
  prereq:['primary-key'],
  what:['A **foreign key** is a column that refers to the primary key of another table.','It links rows between tables, such as employees to departments.','It keeps the data consistent.'],
  why:['It is the basis of joins.','It stops orphan rows, such as an employee in a department that does not exist.'],
  syntax:{ code:'CREATE TABLE employees (\n  emp_id INT PRIMARY KEY,\n  dept_id INT,\n  FOREIGN KEY (dept_id) REFERENCES departments(dept_id)\n);', parts:[['FOREIGN KEY (dept_id)','The column that points to another table.'],['REFERENCES departments(dept_id)','The table and key it points to.']] },
  points:['The foreign key value must exist in the parent table, or be NULL.','It can repeat: many employees share one dept_id.','**ON DELETE** rules: RESTRICT, CASCADE or SET NULL.','A foreign key keeps **referential integrity**.','The parent column must be a primary or unique key.'],
  mistakes:['Inserting child rows before the parent row exists.','Deleting parent rows that still have children.','Mismatched data types between the two columns.'],
  example:{ title:'Employees and departments', scenario:'employees.dept_id points to departments.dept_id.',
    table:withHl(EMP,{'C2:C7':'range'},'Table: employees (dept_id is the foreign key)'), task:'Try to add an employee in department 99.', formula:'INSERT INTO employees (emp_id, name, dept_id)\nVALUES (7, \'Gita\', 99);',
    steps:['Department 99 does not exist in departments.','The foreign key rule rejects the row.'], result:'The database returns an error: Cannot add or update a child row: a foreign key constraint fails.' },
  practice:{ q:'Which column in orders should be a foreign key, and which table does it reference?', table:T(ORD,'Table: orders'), hint:'Which column identifies the customer?', solution:'customer_id in orders references customers(customer_id)', explain:'Each order belongs to a customer, so customer_id must exist in customers.' },
  interview:[
    { level:'Basic', q:'What is a foreign key?', a:'A column that references the primary key of another table, linking the two and keeping the data consistent.' },
    { level:'Intermediate', q:'What does ON DELETE CASCADE do?', a:'When a parent row is deleted, the child rows that refer to it are deleted too. RESTRICT blocks the delete, and SET NULL clears the child column.' },
    { level:'Intermediate', q:'Can a foreign key be NULL?', a:'Yes, unless the column is NOT NULL. A NULL means the row is not linked to any parent, like Farhan with no department.' },
    { level:'Scenario', q:'You cannot delete a department. Why?', a:'Employees still reference it through a foreign key. I reassign or delete those employees first, or use a suitable ON DELETE rule.' }
  ],
  mcq:[
    { q:'What does a foreign key reference?', o:['A key in another table','A column in the same row','A view','An index only'], a:0, why:'It points to the parent table key.' },
    { q:'Can foreign key values repeat?', o:['Yes','No','Only once','Only NULL'], a:0, why:'Many child rows can point to one parent.' },
    { q:'What does referential integrity mean?', o:['Links always point to existing rows','All values are unique','Tables are sorted','Columns are numeric'], a:0, why:'No orphan rows are allowed.' },
    { q:'Which rule deletes child rows with the parent?', o:['ON DELETE CASCADE','ON DELETE RESTRICT','SET NULL','NO ACTION only'], a:0, why:'CASCADE removes the children too.' },
    { q:'What must the referenced column be?', o:['A primary or unique key','Any column','A text column','An alias'], a:0, why:'The parent column must be unique.' }
  ],
  recap:['A foreign key points to another table\'s key.','It keeps data consistent and enables joins.','ON DELETE rules decide what happens to child rows.']
},

/* --- sql-command-types --- */
'sql-command-types': {
  title:'DDL, DML, DQL, DCL and TCL', tagline:'The five families of SQL commands.',
  prereq:['sql-intro'],
  what:['**DDL** defines structure: CREATE, ALTER, DROP, TRUNCATE.','**DML** changes data: INSERT, UPDATE, DELETE.','**DQL** reads data: SELECT.','**DCL** controls access: GRANT, REVOKE.','**TCL** controls transactions: COMMIT, ROLLBACK, SAVEPOINT.'],
  why:['A very common interview question.','Knowing the families helps you choose the right command.'],
  syntax:{ code:'DDL  CREATE ALTER DROP TRUNCATE\nDML  INSERT UPDATE DELETE\nDQL  SELECT\nDCL  GRANT REVOKE\nTCL  COMMIT ROLLBACK SAVEPOINT', parts:[['DDL','Data Definition Language.'],['DML','Data Manipulation Language.'],['DQL','Data Query Language.'],['DCL / TCL','Data Control and Transaction Control Language.']] },
  points:['DDL statements usually commit automatically in MySQL.','DML changes can be rolled back inside a transaction.','TRUNCATE is DDL; DELETE is DML.','Some books place SELECT under DML.','Analysts mostly use DQL; admins use DDL and DCL.'],
  mistakes:['Calling TRUNCATE a DML command.','Thinking DDL can always be rolled back.','Mixing up DCL and TCL.'],
  example:{ title:'Sorting commands into families', scenario:'You are given a list of commands and must name each family.',
    table:withHl({rows:[['Command','Family'],['CREATE TABLE','DDL'],['INSERT','DML'],['SELECT','DQL'],['GRANT','DCL'],['COMMIT','TCL']]},{'A2:A6':'find','B2:B6':'hit'},'Classification'), task:'Classify the five commands.', formula:'CREATE TABLE ... ; INSERT ... ; SELECT ... ; GRANT ... ; COMMIT;',
    steps:['CREATE defines structure, so DDL.','INSERT changes data, so DML; SELECT reads it, so DQL.','GRANT controls access (DCL) and COMMIT saves a transaction (TCL).'], result:'Each command belongs to exactly one family.' },
  practice:{ q:'Classify DELETE, TRUNCATE, REVOKE and ROLLBACK.', hint:'Think structure, data, access and transactions.', solution:'DELETE: DML\nTRUNCATE: DDL\nREVOKE: DCL\nROLLBACK: TCL', explain:'DELETE removes rows (data), TRUNCATE empties a table by redefining it, REVOKE removes permissions and ROLLBACK undoes a transaction.' },
  interview:[
    { level:'Basic', q:'What are the types of SQL commands?', a:'DDL (CREATE, ALTER, DROP, TRUNCATE), DML (INSERT, UPDATE, DELETE), DQL (SELECT), DCL (GRANT, REVOKE) and TCL (COMMIT, ROLLBACK, SAVEPOINT).' },
    { level:'Intermediate', q:'Is TRUNCATE DDL or DML?', a:'DDL. It empties the table by deallocating its data pages, cannot be filtered with WHERE and usually cannot be rolled back, unlike DELETE.' },
    { level:'Intermediate', q:'Which command family do analysts use most?', a:'DQL, mostly SELECT, with some DML in practice databases. DDL and DCL are usually handled by database administrators.' },
    { level:'Scenario', q:'You ran DELETE by mistake inside a transaction. What do you do?', a:'ROLLBACK, a TCL command, undoes uncommitted DML changes. After COMMIT, I would need a backup.' }
  ],
  mcq:[
    { q:'Which family is INSERT?', o:['DML','DDL','DCL','TCL'], a:0, why:'INSERT changes data.' },
    { q:'Which family is CREATE?', o:['DDL','DML','DQL','TCL'], a:0, why:'CREATE defines structure.' },
    { q:'Which command is TCL?', o:['COMMIT','GRANT','SELECT','ALTER'], a:0, why:'COMMIT controls transactions.' },
    { q:'Which command is DCL?', o:['GRANT','UPDATE','DROP','ROLLBACK'], a:0, why:'GRANT gives permissions.' },
    { q:'Is TRUNCATE DDL or DML?', o:['DDL','DML','DQL','TCL'], a:0, why:'It redefines the table contents at structure level.' }
  ],
  recap:['DDL structure, DML data, DQL queries, DCL access, TCL transactions.','TRUNCATE is DDL; DELETE is DML.','Analysts use mostly SELECT.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- sql-intro --- */
D('sql-intro',{ l:'Beginner', t:'SQL asks a relational database for data in tables. A query says **what** you want, and the database works out how.',
  i:['Companies store data in tables of rows and columns, linked by keys. SQL is the language you use to read it, summarise it and change it, without opening files or copying anything.','You describe the result you want, such as employees with their salary, and the database chooses how to find it.'], a:'Asking a librarian for books by describing them, instead of searching the shelves yourself.',
  h:['Name the table with `FROM`.','Choose the columns with `SELECT`.','Add conditions with `WHERE` and sorting with `ORDER BY`.','End with a semicolon and run the query.'],
  d:[FL(['SELECT name, salary'],[{ title:'employees (table)', rows:[['emp_id','name','dept_id','salary'],[1,'Asha',10,50000],[2,'Bilal',20,40000]] },{ title:'Result', rows:[['name','salary'],['Asha',50000],['Bilal',40000]], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','Filter and sort','Sales employees, highest paid first.','Add WHERE and ORDER BY.','SELECT name, salary\nFROM employees\nWHERE dept_id = 10\nORDER BY salary DESC;',['WHERE keeps department 10.','ORDER BY sorts by salary, highest first.'],'Chitra (60000) then Asha (50000).',T(EMP,'Table: employees'),{ rows:[['name','salary'],['Chitra',60000],['Asha',50000]], caption:'Result' }),
     X('Business case','A first analyst question','Who are the three best-paid employees?','Sort and limit.','SELECT name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 3;',['Sort by salary descending.','LIMIT keeps the first three rows.'],'Chitra, Asha and Deepak.',T(EMP,'Table: employees'),{ rows:[['name','salary'],['Chitra',60000],['Asha',50000],['Deepak',45000]], caption:'Result' })],
  e:[['Keywords are not case sensitive','`select` and `SELECT` work. Table and column names may be case sensitive on some systems.'],['Text needs single quotes','`\'Pune\'`, not `"Pune"` in standard SQL.'],['Dialects differ','LIMIT is MySQL; SQL Server uses TOP; Oracle uses FETCH FIRST.'],['Read-only does not mean harmless','SELECT does not change data, but a heavy query can slow a shared database.']],
  p:[P('Medium','List the names of all employees in department 20.','WHERE.','SELECT name FROM employees WHERE dept_id = 20;','Bilal and Esha.',T(EMP,'Table: employees')),
     P('Interview','Explain the difference between SQL and MySQL.','Language versus product.','SQL is the language. MySQL is a database system that implements it, like PostgreSQL and SQL Server, each with small differences.','Short and exact.')],
  q:[Q('Basic','What is SQL?','Structured Query Language, used to read and manage data in relational databases.',{ f:[['What is a relational database?','Data stored in tables linked by keys.']] }),
     Q('Scenario','You must pull last month\'s sales without Excel. How?','Write a SELECT with a date filter and aggregate, then export the result.',{ t:'SQL scales to millions of rows where Excel struggles.' })],
  r:RT(['Clause','Purpose'],[['`SELECT`','Which columns'],['`FROM`','Which table'],['`WHERE`','Which rows'],['`ORDER BY`','Sort order']]), rel:['select','where','order-by','sql-data-types'] });

/* --- sql-data-types --- */
D('sql-data-types',{ l:'Beginner', t:'Every column has a data type. Use DECIMAL for money, DATE for dates, and never store numbers or dates as text.',
  i:['The type decides what a column can hold and how it behaves: numbers add, text sorts alphabetically, dates support date maths. The wrong type causes wrong sorting and failed calculations.','A good rule: store each fact in the type that matches its meaning, not how it looks.'], a:'Choosing the right container: a jug for liquids, a box for parts.',
  h:['Whole numbers: `INT`.','Exact decimals (money): `DECIMAL(10,2)`.','Text: `VARCHAR(n)` for variable length, `CHAR(n)` for fixed.','Dates and times: `DATE`, `DATETIME`.'],
  d:[FL([''],[{ title:'Choosing types', rows:[['Data','Type'],['id','INT'],['price','DECIMAL(10,2)'],['name','VARCHAR(50)'],['state code','CHAR(2)'],['order date','DATE']] }])],
  x:[X('Variation','Money needs exactness','Floating point types accumulate tiny errors.','Compare DECIMAL and DOUBLE.','SELECT 0.1 + 0.2;            -- 0.3 (decimal)\nSELECT 0.1e0 + 0.2e0;        -- 0.30000000000000004 (double)',['DECIMAL stores exact decimal values.','DOUBLE is approximate.'],'Use DECIMAL for money and quantities that must add exactly.'),
     X('Business case','Text numbers sort wrongly','An id column was created as VARCHAR.','See the effect.','SELECT id FROM t ORDER BY id;   -- 1, 10, 2',['Text sorts character by character.'],'Change the column to INT, or sort with CAST(id AS UNSIGNED).')],
  e:[['FLOAT for money','Approximate types drift. Use DECIMAL.'],['Dates as text','They sort and filter wrongly and allow invalid values.'],['Phone numbers as INT','Leading zeros are lost. Use VARCHAR.'],['VARCHAR length','Choose a sensible maximum; very large lengths waste memory in some engines.']],
  p:[P('Medium','Choose types for price, customer name, joining date and a two-letter state code.','Exactness and length.','price DECIMAL(10,2); name VARCHAR(100); joined DATE; state CHAR(2)','Each type matches the meaning.'),
     P('Interview','Why not store dates as text?','Think sorting and validation.','Text dates sort alphabetically, cannot use date functions without conversion, and accept invalid values. A DATE column validates and supports date arithmetic.','A concrete failure example helps.')],
  q:[Q('Basic','What is the difference between CHAR and VARCHAR?','CHAR is fixed length, VARCHAR stores only what is given up to a maximum.',{ f:[['Which for money?','DECIMAL.']] }),
     Q('Scenario','A phone column was created as INT. What goes wrong?','Leading zeros and plus signs are lost and long numbers overflow. Use VARCHAR because phone numbers are identifiers, not quantities.',{ t:'Changing types later needs a migration.' })],
  r:RT(['Need','Type'],[['Whole number','`INT`'],['Money','`DECIMAL(10,2)`'],['Text','`VARCHAR(n)`'],['Date','`DATE`'],['Date and time','`DATETIME`']]), rel:['create-table','cast-sql','primary-key','constraints'] });

/* --- primary-key --- */
D('primary-key',{ l:'Beginner', t:'A primary key uniquely identifies each row. It cannot be NULL, and a table has only one.',
  i:['To refer to one row you need a value that points at exactly that row: employee 3, order 105. The primary key is that value, and the database enforces that it is unique.','Other tables link to it. That is why it should be stable: an email can change, an id should not.'], a:'A passport number: unique to one person, used by everyone to refer to them.',
  h:['Choose a column that is unique and never changes.','Declare it `PRIMARY KEY` (often with `AUTO_INCREMENT`).','The database creates an index and rejects duplicates and NULLs.','Other tables reference it with foreign keys.'],
  d:[FL([''],[{ title:'employees', rows:[['emp_id (PK)','name'],[1,'Asha'],[2,'Bilal'],[3,'Chitra']], hl:{1:'hit',2:'hit',3:'hit'}, note:'No value repeats, none is NULL.' }])],
  x:[X('Variation','A composite key','An order has many products, and each product appears once per order.','Use two columns together.','CREATE TABLE order_items (\n  order_id INT,\n  product_id INT,\n  qty INT,\n  PRIMARY KEY (order_id, product_id)\n);',['Neither column is unique alone.','Together they are.'],'The same product cannot be added twice to one order.'),
     X('Business case','Natural versus surrogate key','Should email be the key?','Prefer a stable id.','customer_id INT PRIMARY KEY AUTO_INCREMENT,\nemail VARCHAR(100) UNIQUE',['Emails can change, so they break links.','A surrogate id never changes.'],'Keep the email unique but not the primary key.')],
  e:[['Only one primary key','But it can span several columns.'],['Never NULL','A NULL cannot identify a row.'],['Do not reuse ids','A deleted id should not be assigned to a new row.'],['AUTO_INCREMENT gaps','Gaps are normal after failed inserts or deletes.']],
  p:[P('Medium','Write the key definition for a customers table with customer_id, name and city.','PRIMARY KEY.','CREATE TABLE customers (customer_id INT PRIMARY KEY, name VARCHAR(50), city VARCHAR(50));','Each customer_id must be unique.'),
     P('Interview','PRIMARY KEY versus UNIQUE?','NULL and count.','Both prevent duplicates. A table has one primary key which cannot be NULL. A table can have several UNIQUE constraints which may allow NULL.','Add that the PK is what other tables reference.')],
  q:[Q('Basic','What is a primary key?','A column or set of columns that uniquely identifies each row and cannot be NULL.',{ f:[['How many per table?','One.']] }),
     Q('Scenario','Is email a good primary key?','Usually not, since emails change. Use a surrogate id and make email UNIQUE.',{ t:'Natural keys are fine when truly stable.' })],
  r:RT(['Rule','Detail'],[['Unique','Yes'],['NULL','Not allowed'],['Per table','One (can be composite)'],['Indexed','Automatically']]), rel:['foreign-key','constraints','create-table','inner-join'] });

/* --- foreign-key --- */
D('foreign-key',{ l:'Beginner', t:'A foreign key points to the primary key of another table. It keeps links valid and makes joins possible.',
  i:['An order must belong to a real customer. The order stores the customer\'s id, and a foreign key makes the database check that this customer exists.','It is the relationship you later follow with a JOIN, so the keys on both sides must have the same type.'], a:'A reference number on a form that must exist in the register.',
  h:['The parent table has a primary key.','The child table has a column with matching values.','Declare `FOREIGN KEY (col) REFERENCES parent(key)`.','The database rejects child rows pointing at missing parents.'],
  d:[FL(['dept_id references'],[{ title:'employees (child)', rows:[['name','dept_id (FK)'],['Asha',10],['Bilal',20]] },{ title:'departments (parent)', rows:[['dept_id (PK)','dept_name'],[10,'Sales'],[20,'Finance']] }])],
  x:[X('Variation','Orphan rows','Find orders whose customer is missing (possible without a constraint).','Use an anti join.','SELECT o.order_id\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.customer_id\nWHERE c.customer_id IS NULL;',['Orders with no matching customer have NULL on the customer side.'],'A foreign key would have prevented them.'),
     X('Business case','Choosing the delete rule','What happens to orders when a customer is deleted?','Pick a rule.','FOREIGN KEY (customer_id) REFERENCES customers(customer_id)\n  ON DELETE RESTRICT',['RESTRICT blocks the delete.','CASCADE deletes the orders, SET NULL clears the link.'],'For financial history, RESTRICT is safest.')],
  e:[['NULL is allowed','A foreign key column can be NULL unless NOT NULL, meaning "no parent".'],['Types must match','A text id cannot reference an integer key.'],['Delete order','You cannot delete a parent that still has children (with RESTRICT).'],['Index','The child column is indexed automatically in MySQL InnoDB.']],
  p:[P('Medium','Which column of orders should be a foreign key, and to which table?','Who placed the order?','customer_id references customers(customer_id)','Every order must have a real customer.',T(ORD,'Table: orders')),
     P('Interview','What does referential integrity mean?','Links stay valid.','Every foreign key value must match an existing parent key (or be NULL), so there are no orphan rows.','The database enforces it, not the application.')],
  q:[Q('Basic','What is a foreign key?','A column that references the primary key of another table.',{ f:[['Can it repeat?','Yes, many children can share a parent.']] }),
     Q('Scenario','You cannot delete a department. Why?','Employees still reference it through a foreign key. Reassign or delete them first, or use a different ON DELETE rule.',{ t:'CASCADE is convenient but dangerous.' })],
  r:RT(['Rule','Effect'],[['`RESTRICT`','Block parent delete'],['`CASCADE`','Delete children too'],['`SET NULL`','Clear the link'],['Types','Must match the parent key']]), rel:['primary-key','inner-join','left-join','constraints'] });

/* --- sql-command-types --- */
D('sql-command-types',{ l:'Beginner', t:'SQL commands fall into DDL (structure), DML (data), DQL (queries), DCL (access) and TCL (transactions).',
  i:['Knowing the families tells you what a statement can do and how dangerous it is. SELECT only reads. INSERT, UPDATE and DELETE change rows. CREATE and DROP change the structure itself.','It is also how permissions are organised: an analyst may get SELECT only.'], a:'A building: designing the rooms (DDL), moving furniture (DML), looking inside (DQL), giving keys (DCL).',
  h:['**DDL**: CREATE, ALTER, DROP, TRUNCATE.','**DML**: INSERT, UPDATE, DELETE.','**DQL**: SELECT.','**DCL** (GRANT, REVOKE) and **TCL** (COMMIT, ROLLBACK, SAVEPOINT).'],
  d:[FL([''],[{ title:'Families', rows:[['Family','Commands'],['DDL','CREATE ALTER DROP TRUNCATE'],['DML','INSERT UPDATE DELETE'],['DQL','SELECT'],['DCL','GRANT REVOKE'],['TCL','COMMIT ROLLBACK']] }])],
  x:[X('Variation','Classify statements','Name the family of each statement.','Match each one.','DELETE -> DML\nTRUNCATE -> DDL\nREVOKE -> DCL\nROLLBACK -> TCL',['TRUNCATE is DDL because it resets the table, not row by row.'],'A classic interview check.'),
     X('Business case','Giving an analyst safe access','An analyst should read but not change data.','Grant only SELECT.','GRANT SELECT ON sales.* TO \'analyst\'@\'%\';',['DCL controls who can do what.'],'The analyst cannot INSERT, UPDATE or DELETE.')],
  e:[['TRUNCATE is DDL','It cannot be rolled back in MySQL.'],['DDL commits implicitly','CREATE, ALTER and DROP end the current transaction.'],['SELECT is sometimes called DML','Textbooks differ. Say DQL, and mention both.'],['DROP is permanent','There is no undo without a backup.']],
  p:[P('Medium','Classify INSERT, CREATE, GRANT, COMMIT.','Four families.','INSERT: DML, CREATE: DDL, GRANT: DCL, COMMIT: TCL','Each family has a different purpose.'),
     P('Interview','Is TRUNCATE DDL or DML?','Think of what it does.','DDL. It empties the table by deallocating data, cannot use WHERE and usually cannot be rolled back, unlike DELETE.','Contrast with DELETE.')],
  q:[Q('Basic','What are the types of SQL commands?','DDL, DML, DQL, DCL and TCL.',{ f:[['Which family does an analyst use most?','DQL (SELECT).']] }),
     Q('Scenario','You ran DELETE by mistake inside a transaction.','ROLLBACK undoes it. After COMMIT you need a backup.',{ t:'Always test destructive commands in a transaction.' })],
  r:RT(['Family','Example'],[['DDL','`CREATE TABLE`'],['DML','`UPDATE`'],['DQL','`SELECT`'],['DCL','`GRANT`'],['TCL','`COMMIT`']]), rel:['create-table','insert-into','transactions','drop-truncate'] });
})();
