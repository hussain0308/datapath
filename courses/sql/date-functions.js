/* Datapath | SQL | Date functions
 * Lessons in this file: now-curdate, year-sql, month-sql, date-format, datediff, date-add
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
  const { ORD } = DP.datasets.sql;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- now-curdate --- */
'now-curdate': {
  title:'NOW, CURDATE and CURTIME', tagline:'Get the current date and time.',
  prereq:['select'],
  what:['NOW() returns the current date and time.','CURDATE() returns today\'s date.','CURTIME() returns the current time.'],
  why:['Filter recent data, stamp rows, calculate ages and days since.'],
  syntax:{ code:'SELECT NOW();\nSELECT CURDATE();\nSELECT CURTIME();', parts:[['NOW()','Date and time.'],['CURDATE()','Date only.'],['CURTIME()','Time only.']] },
  points:['SQL Server uses `GETDATE()`; PostgreSQL uses `NOW()` and `CURRENT_DATE`.','`CURRENT_DATE` and `CURRENT_TIMESTAMP` are standard.','Use `CURDATE() - INTERVAL 30 DAY` for relative dates.','Results depend on the server time zone.','Avoid functions on indexed date columns; compare to computed dates.'],
  mistakes:['Forgetting time zones.','Using NOW() when only the date is needed.','Hard-coding dates in reports.'],
  example:{ title:'Today and now', scenario:'Suppose the server date is 11 October 2026, at 09:30.',
    table:withHl({rows:[['Function','Meaning']]},{},'Current date and time functions'), task:'Return the current date and time.', formula:'SELECT CURDATE() AS today, NOW() AS now_time;',
    steps:['CURDATE() gives only the date.','NOW() adds the time.'],
    table2:{ rows:[['today','now_time'],['2026-10-11','2026-10-11 09:30:00']], caption:'Result (sample)' }, result:'The values change every time the query runs.' },
  practice:{ q:'Write a WHERE condition for orders placed in the last 30 days.', hint:'Subtract an interval from CURDATE().', solution:'WHERE order_date >= CURDATE() - INTERVAL 30 DAY', explain:'The condition keeps dates from 30 days ago up to today, and updates every day.' },
  interview:[
    { level:'Basic', q:'What is the difference between NOW and CURDATE?', a:'NOW returns the date and time. CURDATE returns only the date.' },
    { level:'Intermediate', q:'What are the equivalents in SQL Server and PostgreSQL?', a:'SQL Server uses GETDATE() or SYSDATETIME(). PostgreSQL uses NOW(), CURRENT_DATE and CURRENT_TIMESTAMP.' },
    { level:'Intermediate', q:'How do you get orders from the last 7 days?', a:'WHERE order_date >= CURDATE() - INTERVAL 7 DAY.' },
    { level:'Scenario', q:'Report totals differ between two servers at midnight. Why?', a:'Servers may use different time zones, so CURDATE returns different dates. I check or fix the time zone setting.' }
  ],
  mcq:[
    { q:'Which returns date and time?', o:['NOW()','CURDATE()','CURTIME()','TODAY()'], a:0, why:'NOW includes both.' },
    { q:'Which returns only the date?', o:['CURDATE()','NOW()','CURTIME()','TIME()'], a:0, why:'CURDATE has no time.' },
    { q:'SQL Server current date function:', o:['GETDATE()','NOW()','CURDATE()','SYSNOW()'], a:0, why:'SQL Server uses GETDATE.' },
    { q:'Which gives the last 30 days?', o:['>= CURDATE() - INTERVAL 30 DAY','= 30','< NOW','BETWEEN 30'], a:0, why:'Subtract an interval from today.' },
    { q:'Results of NOW() depend on:', o:['Server time zone','Table size','Index','Column type'], a:0, why:'The server clock and zone decide.' }
  ],
  recap:['NOW has date and time, CURDATE only the date.','Use INTERVAL for relative dates.','Time zones can change results.']
},

/* --- year-sql --- */
'year-sql': {
  title:'YEAR', tagline:'Extract the year from a date.',
  prereq:['now-curdate'],
  what:['YEAR returns the year of a date.','MONTH, DAY and others work the same way.','The standard form is EXTRACT(YEAR FROM date).'],
  why:['Group sales by year.','Filter data for one year.'],
  syntax:{ code:'YEAR(date)\nEXTRACT(YEAR FROM date)', parts:[['date','A DATE or DATETIME value.']] },
  points:['Returns a number such as 2026.','Works on columns, literals and NOW().','EXTRACT is the standard form for PostgreSQL.','For filtering, a date range is faster than YEAR(col) = 2026 because it can use an index.','NULL date gives NULL.'],
  mistakes:['Applying YEAR to a text date column.','Using YEAR(col) = in WHERE on huge tables.','Forgetting the year when grouping months.'],
  example:{ title:'Total sales per year', scenario:'You want yearly totals of orders.',
    table:withHl(ORD,{'C2:C7':'range'},'Table: orders'), task:'Sum amounts by year.', formula:'SELECT YEAR(order_date) AS yr,\n       SUM(amount) AS total\nFROM orders\nGROUP BY YEAR(order_date);',
    steps:['YEAR extracts 2026 from every order date.','GROUP BY forms one group, and SUM adds the amounts.'],
    table2:{ rows:[['yr','total'],[2026,5700]], caption:'Result' }, result:'All six orders belong to 2026 and total 5700.' },
  practice:{ q:'Write the faster, index-friendly way to select all 2026 orders without YEAR().', table:T(ORD,'Table: orders'), hint:'Use a date range.', solution:'SELECT *\nFROM orders\nWHERE order_date >= \'2026-01-01\'\n  AND order_date <  \'2027-01-01\';', explain:'The database can use an index on order_date, which it cannot do through YEAR(order_date).' },
  interview:[
    { level:'Basic', q:'What does YEAR do?', a:'It returns the year number of a date.' },
    { level:'Intermediate', q:'What is the standard SQL way to extract a year?', a:'EXTRACT(YEAR FROM date), supported by MySQL, PostgreSQL and Oracle.' },
    { level:'Intermediate', q:'Why prefer a date range over YEAR(col) = 2026 in WHERE?', a:'A function on the column prevents index use. A range lets the database use the index.' },
    { level:'Scenario', q:'Show total sales per year and month.', a:'GROUP BY YEAR(order_date), MONTH(order_date), so the same month in different years is not mixed.' }
  ],
  mcq:[
    { q:'YEAR(\'2026-03-15\') returns:', o:['2026','3','15','26'], a:0, why:'The year part.' },
    { q:'Standard way to get a year:', o:['EXTRACT(YEAR FROM date)','GETYEAR(date)','DATE.YEAR','YR(date)'], a:0, why:'EXTRACT is standard.' },
    { q:'Which is better for filtering a year?', o:['A date range','YEAR(col) = 2026','LIKE \'2026%\'','LEFT(col,4)'], a:0, why:'Range conditions can use indexes.' },
    { q:'YEAR(NULL) returns:', o:['NULL','0','Error','2026'], a:0, why:'NULL in, NULL out.' },
    { q:'Why group by YEAR too when grouping months?', o:['To keep years apart','To speed up','To sort','To remove NULL'], a:0, why:'January 2025 and January 2026 differ.' }
  ],
  recap:['YEAR extracts the year; EXTRACT is the standard form.','Date ranges are faster than YEAR() in WHERE.','Group by year and month together.']
},

/* --- month-sql --- */
'month-sql': {
  title:'MONTH and MONTHNAME', tagline:'Extract the month from a date.',
  prereq:['year-sql'],
  what:['MONTH returns the month number, 1 to 12.','MONTHNAME returns the name, such as January.','Both are used to build monthly reports.'],
  why:['Monthly totals, seasonality and trends.'],
  syntax:{ code:'MONTH(date)\nMONTHNAME(date)', parts:[['MONTH','Number from 1 to 12.'],['MONTHNAME','Month name in text.']] },
  points:['Combine with YEAR for multi-year data.','`DATE_FORMAT(date, \'%Y-%m\')` gives year and month in one value.','Month names depend on the language setting.','Sorting by MONTHNAME is alphabetical; sort by MONTH instead.','`DAY(date)` and `DAYNAME(date)` work in the same way.'],
  mistakes:['Sorting month names alphabetically.','Mixing months from different years.','Forgetting to GROUP BY the expression.'],
  example:{ title:'Monthly totals', scenario:'You want total sales for each month.',
    table:withHl(ORD,{'C2:C7':'range'},'Table: orders'), task:'Total the amounts by month.', formula:'SELECT MONTH(order_date) AS month_no,\n       SUM(amount) AS total\nFROM orders\nGROUP BY MONTH(order_date)\nORDER BY month_no;',
    steps:['MONTH gives 1, 1, 2, 2, 3 and 3.','SUM adds 1200 + 800, then 1500 + 700, then 900 + 600.'],
    table2:{ rows:[['month_no','total'],[1,2000],[2,2200],[3,1500]], caption:'Result' }, result:'January 2000, February 2200 and March 1500.' },
  practice:{ q:'Write a query for the orders placed in March.', table:T(ORD,'Table: orders'), hint:'Filter on MONTH(order_date) = 3.', solution:'SELECT *\nFROM orders\nWHERE MONTH(order_date) = 3;', explain:'Orders 5 and 6 were placed in March.' },
  interview:[
    { level:'Basic', q:'What does MONTH return?', a:'The month number, 1 to 12.' },
    { level:'Intermediate', q:'How do you list months by name in the right order?', a:'Select MONTHNAME(date) but ORDER BY MONTH(date), because sorting names alphabetically puts April first.' },
    { level:'Intermediate', q:'How do you get a "2026-03" label?', a:'DATE_FORMAT(order_date, \'%Y-%m\') in MySQL.' },
    { level:'Scenario', q:'Monthly totals that work across years?', a:'GROUP BY YEAR(order_date), MONTH(order_date), or by DATE_FORMAT(order_date, \'%Y-%m\').' }
  ],
  mcq:[
    { q:'MONTH(\'2026-03-15\') returns:', o:['3','15','2026','March'], a:0, why:'The month number.' },
    { q:'MONTHNAME(\'2026-03-15\') returns:', o:['March','3','Mar','03'], a:0, why:'The full month name.' },
    { q:'How should month names be ordered?', o:['By MONTH number','Alphabetically','By length','Randomly'], a:0, why:'Alphabetical order puts April before January.' },
    { q:'Monthly total for March 2026 in the orders table is:', o:['1500','2000','2200','900'], a:0, why:'900 + 600.' },
    { q:'Which avoids mixing years?', o:['GROUP BY YEAR and MONTH','GROUP BY MONTH only','ORDER BY','DISTINCT'], a:0, why:'The same month in two years stays separate.' }
  ],
  recap:['MONTH is 1 to 12; MONTHNAME is the text name.','Order by the number, not the name.','Group by year and month.']
},

/* --- date-format --- */
'date-format': {
  title:'DATE_FORMAT', tagline:'Show dates in the format you want.',
  prereq:['month-sql'],
  what:['DATE_FORMAT turns a date into text with a pattern.','Format codes start with a percent sign.','It is used in reports and for grouping by month.'],
  why:['Readable dates like 05-Jan-2026.','A year-month key such as 2026-01.'],
  syntax:{ code:'DATE_FORMAT(date, format)', parts:[['%Y %y','Four-digit and two-digit year.'],['%m %b %M','Month number, short name, full name.'],['%d','Day of the month.'],['%W','Weekday name.']] },
  points:['`\'%d-%b-%Y\'` gives 05-Jan-2026.','`\'%Y-%m\'` gives 2026-01 and sorts correctly.','The result is text, not a date.','SQL Server uses `FORMAT`; PostgreSQL uses `TO_CHAR`.','`STR_TO_DATE` goes the other way: text to date.'],
  mistakes:['Treating the result as a date.','Wrong case in codes (%M vs %m).','Sorting on a text format like %d-%b-%Y.'],
  example:{ title:'Readable dates', scenario:'You want order dates as 05-Jan-2026.',
    table:withHl(ORD,{'C2:C7':'range'},'Table: orders'), task:'Format the dates.', formula:'SELECT order_id,\n       DATE_FORMAT(order_date, \'%d-%b-%Y\') AS shown\nFROM orders;',
    steps:['%d is the day, %b the short month name and %Y the four-digit year.'],
    table2:{ rows:[['order_id','shown'],[1,'05-Jan-2026'],[2,'18-Jan-2026'],[3,'03-Feb-2026'],[4,'21-Feb-2026'],[5,'09-Mar-2026'],[6,'15-Mar-2026']], caption:'Result' }, result:'Dates show in a friendly format.' },
  practice:{ q:'Write a query that shows the month and year of each order, for example January 2026.', table:T(ORD,'Table: orders'), hint:'Use %M and %Y.', solution:'SELECT DATE_FORMAT(order_date, \'%M %Y\')\nFROM orders;', explain:'%M is the full month name and %Y the year, so order 1 shows January 2026.' },
  interview:[
    { level:'Basic', q:'What does DATE_FORMAT do?', a:'It converts a date to text in a pattern I choose, using codes such as %d, %m and %Y.' },
    { level:'Intermediate', q:'What is the difference between %m, %b and %M?', a:'%m is the month number, %b the short name (Jan) and %M the full name (January).' },
    { level:'Intermediate', q:'Why should you not sort by a text date like 05-Jan-2026?', a:'It sorts alphabetically, not by date. I sort by the original date column, or use the %Y-%m-%d format.' },
    { level:'Scenario', q:'Show monthly totals with labels like 2026-03.', a:'SELECT DATE_FORMAT(order_date, \'%Y-%m\') AS ym, SUM(amount) FROM orders GROUP BY ym ORDER BY ym;' }
  ],
  mcq:[
    { q:'Which code gives the four-digit year?', o:['%Y','%y','%m','%d'], a:0, why:'%Y is four digits.' },
    { q:'%b returns:', o:['Short month name','Full month name','Month number','Day'], a:0, why:'For example Jan.' },
    { q:'DATE_FORMAT returns:', o:['Text','A date','A number','A boolean'], a:0, why:'The result is text.' },
    { q:'SQL Server equivalent:', o:['FORMAT','TO_CHAR','DATE_FORMAT','STRFTIME'], a:0, why:'SQL Server uses FORMAT.' },
    { q:'Which sorts correctly as text?', o:['%Y-%m-%d','%d-%b-%Y','%M %Y','%W'], a:0, why:'Year first sorts chronologically.' }
  ],
  recap:['DATE_FORMAT builds text dates from codes.','%Y-%m-%d sorts correctly.','SQL Server uses FORMAT, PostgreSQL TO_CHAR.']
},

/* --- datediff --- */
'datediff': {
  title:'DATEDIFF', tagline:'Count the days between two dates.',
  prereq:['date-format'],
  what:['DATEDIFF returns the number of days between two dates.','In MySQL, the later date comes first.','SQL Server has a different argument order.'],
  why:['Delivery time, age of an invoice, days since last order.'],
  syntax:{ code:'DATEDIFF(later_date, earlier_date)', parts:[['later_date','The end date.'],['earlier_date','The start date.']] },
  points:['MySQL DATEDIFF returns **days** only.','The result is negative if the first date is earlier.','**SQL Server:** `DATEDIFF(day, start, end)`, with the unit first.','For months or years use `TIMESTAMPDIFF(MONTH, start, end)`.','Time parts are ignored.'],
  mistakes:['Swapping the dates and getting a negative number.','Using the SQL Server order in MySQL.','Expecting months or years.'],
  example:{ title:'Span of the order history', scenario:'You want the number of days between the first and last order.',
    table:withHl(ORD,{'C2':'find','C7':'find'},'Table: orders'), task:'Days from the first to the last order.', formula:'SELECT DATEDIFF(MAX(order_date), MIN(order_date)) AS days\nFROM orders;',
    steps:['MAX(order_date) is 2026-03-15 and MIN(order_date) is 2026-01-05.','The difference is 69 days.'],
    table2:{ rows:[['days'],[69]], caption:'Result' }, result:'The order history spans 69 days.' },
  practice:{ q:'Write a query for the days between 5 January 2026 and 3 February 2026.', hint:'Later date first.', solution:'SELECT DATEDIFF(\'2026-02-03\', \'2026-01-05\');', explain:'January has 26 days left after the 5th, plus 3 days in February, which is 29.' },
  interview:[
    { level:'Basic', q:'What does DATEDIFF return in MySQL?', a:'The number of days between two dates, first date minus second date.' },
    { level:'Intermediate', q:'How does SQL Server DATEDIFF differ?', a:'It takes a unit first: DATEDIFF(day, start, end), and subtracts in the opposite order.' },
    { level:'Intermediate', q:'How do you find months between two dates in MySQL?', a:'TIMESTAMPDIFF(MONTH, start_date, end_date).' },
    { level:'Scenario', q:'Calculate the delivery time in days for each order.', a:'DATEDIFF(delivery_date, order_date), and I check for NULL or negative values, which signal data errors.' }
  ],
  mcq:[
    { q:'DATEDIFF(\'2026-03-15\', \'2026-01-05\') returns:', o:['69','-69','70','68'], a:0, why:'69 days later.' },
    { q:'What is the argument order in MySQL?', o:['Later date first','Earlier date first','Unit first','Any'], a:0, why:'The first date minus the second.' },
    { q:'SQL Server begins DATEDIFF with:', o:['A unit such as day','The later date','A format','NULL'], a:0, why:'DATEDIFF(day, start, end).' },
    { q:'Which gives months in MySQL?', o:['TIMESTAMPDIFF(MONTH, a, b)','DATEDIFF(a,b)/30','MONTHDIFF','DATEDIFF MONTH'], a:0, why:'TIMESTAMPDIFF accepts units.' },
    { q:'DATEDIFF with the earlier date first returns:', o:['A negative number','Zero','An error','NULL'], a:0, why:'The sign flips.' }
  ],
  recap:['MySQL DATEDIFF(later, earlier) returns days.','SQL Server takes the unit first.','TIMESTAMPDIFF handles months and years.']
},

/* --- date-add --- */
'date-add': {
  title:'DATE_ADD and DATE_SUB', tagline:'Move a date forward or backward.',
  prereq:['datediff'],
  what:['DATE_ADD adds an interval to a date.','DATE_SUB subtracts one.','Intervals can be days, weeks, months or years.'],
  why:['Due dates, expiry dates and rolling windows.'],
  syntax:{ code:'DATE_ADD(date, INTERVAL n unit)\nDATE_SUB(date, INTERVAL n unit)\ndate + INTERVAL n unit', parts:[['n','The number of units.'],['unit','DAY, WEEK, MONTH, YEAR, HOUR and so on.']] },
  points:['`date + INTERVAL 7 DAY` is the same as DATE_ADD.','Adding months to the 31st clamps to the last day: 31 Jan plus 1 month is 28 Feb 2026.','SQL Server uses `DATEADD(day, n, date)`.','PostgreSQL uses `date + INTERVAL \'7 days\'`.','The result keeps the date type.'],
  mistakes:['Forgetting the word INTERVAL.','Month-end surprises.','Using SQL Server syntax in MySQL.'],
  example:{ title:'Payment due in 7 days', scenario:'Each order is due 7 days after the order date.',
    table:withHl(ORD,{'C2:C7':'range'},'Table: orders'), task:'Return the due date.', formula:'SELECT order_id,\n       DATE_ADD(order_date, INTERVAL 7 DAY) AS due_date\nFROM orders;',
    steps:['Each order date moves forward by seven days.'],
    table2:{ rows:[['order_id','due_date'],[1,'2026-01-12'],[2,'2026-01-25'],[3,'2026-02-10'],[4,'2026-02-28'],[5,'2026-03-16'],[6,'2026-03-22']], caption:'Result' }, result:'Order 4 is due on 2026-02-28.' },
  practice:{ q:'What does DATE_ADD(\'2026-01-31\', INTERVAL 1 MONTH) return?', hint:'February 2026 has 28 days.', solution:'2026-02-28', explain:'MySQL clamps to the last valid day of the month.' },
  interview:[
    { level:'Basic', q:'What does DATE_ADD do?', a:'It adds an interval, such as 7 DAY or 1 MONTH, to a date.' },
    { level:'Intermediate', q:'What happens when you add one month to 31 January?', a:'MySQL returns the last day of February, since there is no 31 February.' },
    { level:'Intermediate', q:'How do you write the same in SQL Server and PostgreSQL?', a:'SQL Server: DATEADD(day, 7, date). PostgreSQL: date + INTERVAL \'7 days\'.' },
    { level:'Scenario', q:'Orders from the last 3 months.', a:'WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH).' }
  ],
  mcq:[
    { q:'DATE_ADD(\'2026-01-05\', INTERVAL 7 DAY) returns:', o:['2026-01-12','2026-01-07','2026-02-05','2026-01-11'], a:0, why:'Seven days later.' },
    { q:'DATE_SUB does:', o:['Subtracts an interval','Adds an interval','Formats a date','Counts days'], a:0, why:'It moves the date back.' },
    { q:'31 Jan 2026 plus 1 month gives:', o:['2026-02-28','2026-03-03','2026-02-31','Error'], a:0, why:'MySQL clamps to the last day.' },
    { q:'SQL Server uses:', o:['DATEADD(day, n, date)','DATE_ADD(date, n)','date PLUS n','ADDDATE'], a:0, why:'Unit first.' },
    { q:'`order_date + INTERVAL 7 DAY` equals:', o:['DATE_ADD(order_date, INTERVAL 7 DAY)','DATE_SUB','DATEDIFF','NOW()'], a:0, why:'The same operation.' }
  ],
  recap:['DATE_ADD and DATE_SUB move dates by an interval.','Month-end dates are clamped.','Other systems use DATEADD or INTERVAL strings.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- now-curdate --- */
D('now-curdate',{ l:'Beginner', t:'NOW() returns date and time, CURDATE() the date. SQL Server uses GETDATE(). Results depend on the server time zone.',
  i:['Many queries are relative to now: orders in the last 30 days, time since last login. The current-date functions provide the reference point.','Because the answer depends on the server clock and time zone, two servers can disagree around midnight.'], a:'The server\'s wall clock.',
  h:['`NOW()` gives date and time.','`CURDATE()` gives only the date.','Subtract intervals: `CURDATE() - INTERVAL 30 DAY`.','Check the time zone setting.'],
  d:[FL(['server clock'],[{ title:'Function', rows:[['Function','Returns'],['NOW()','2026-10-11 09:30:00'],['CURDATE()','2026-10-11'],['CURTIME()','09:30:00']] }])],
  x:[X('Variation','The last 30 days','Recent orders.','Compare with CURDATE().','SELECT * FROM orders\nWHERE order_date >= CURDATE() - INTERVAL 30 DAY;',['Subtract an interval from today.'],'A rolling window that moves each day.'),
     X('Business case','Time zones at midnight','Two reports run at 23:30 and disagree on "today".','Use a fixed reference.','SET time_zone = \'+05:30\';  -- or store UTC and convert',['Servers in different zones disagree on the date.'],'Agree on UTC storage and a reporting time zone.')],
  e:[['Time zones','NOW() follows the session or server zone.'],['Index friendliness','Compare the column to a computed date, not a function of the column.'],['Dialects','GETDATE() in SQL Server; CURRENT_DATE is standard.'],['Determinism','Queries using NOW() are not repeatable.']],
  p:[P('Medium','Orders from the last 7 days.','INTERVAL.','WHERE order_date >= CURDATE() - INTERVAL 7 DAY','A rolling week.'),
     P('Interview','NOW versus CURDATE?','Time part.','NOW has date and time; CURDATE only the date.','Add the SQL Server name.')],
  q:[Q('Basic','What is the difference between NOW and CURDATE?','NOW includes the time.',{ f:[['SQL Server equivalent?','GETDATE().']] }),
     Q('Scenario','Reports differ between two servers at midnight.','Check time zone settings and use UTC or one reporting zone.',{ t:'Document the zone in the report.' })],
  r:RT(['Database','Current date and time'],[['MySQL','`NOW()`'],['PostgreSQL','`NOW()`, `CURRENT_DATE`'],['SQL Server','`GETDATE()`'],['Standard','`CURRENT_TIMESTAMP`']]), rel:['date-add','datediff','year-sql','between-sql'] });

/* --- year-sql --- */
D('year-sql',{ l:'Beginner', t:'YEAR extracts the year from a date. In WHERE, a date range is faster than YEAR(col) = 2026.',
  i:['Grouping by year needs the year as a value. YEAR extracts it.','But YEAR(col) = 2026 in WHERE forces a calculation on every row and blocks index use. A range does the same job faster.'], a:'Reading the year off a date.',
  h:['`YEAR(date)` returns a number.','Use in SELECT and GROUP BY.','For filters use `>= start AND < next start`.','Standard form: `EXTRACT(YEAR FROM date)`.'],
  d:[FL(['YEAR'],[{ title:'2026-03-15', text:'date' },{ title:'YEAR()', text:'**2026**' }])],
  x:[X('Variation','Totals per year','Sales per year.','Group by YEAR.','SELECT YEAR(order_date) AS yr, SUM(amount) FROM orders GROUP BY YEAR(order_date);',['All six orders are in 2026.'],'2026: 5700.',T(ORD,'Table: orders')),
     X('Business case','An index-friendly filter','All orders of 2026 on a huge table.','Use a range.','WHERE order_date >= \'2026-01-01\' AND order_date < \'2027-01-01\'',['The index on order_date can be used.'],'Faster than YEAR(order_date) = 2026.')],
  e:[['Functions block indexes','Compare the raw column to computed bounds.'],['NULL','YEAR(NULL) is NULL.'],['Text dates','Convert first.'],['Fiscal years','Calendar years differ from fiscal years.']],
  p:[P('Medium','Total sales per year.','GROUP BY YEAR.','SELECT YEAR(order_date), SUM(amount) FROM orders GROUP BY YEAR(order_date);','One row for 2026.',T(ORD,'Table: orders')),
     P('Interview','YEAR(col) = 2026 versus a date range?','Index use.','The range lets the database use an index. The function forces a computation per row.','Show the range query.')],
  q:[Q('Basic','What does YEAR return?','The year of a date.',{ f:[['Standard form?','EXTRACT(YEAR FROM date).']] }),
     Q('Scenario','Year and month totals across years.','Group by YEAR and MONTH, or DATE_FORMAT(date, \'%Y-%m\').',{ t:'Month alone merges years.' })],
  r:RT(['Need','Write'],[['Year','`YEAR(d)`'],['Standard','`EXTRACT(YEAR FROM d)`'],['Filter','`d >= start AND d < next`'],['Year-month','`DATE_FORMAT(d, \'%Y-%m\')`']]), rel:['month-sql','date-format','between-sql','indexes'] });

/* --- month-sql --- */
D('month-sql',{ l:'Beginner', t:'MONTH returns 1 to 12 and MONTHNAME the name. Group by year and month together to avoid mixing years.',
  i:['Monthly reports need the month as a value. MONTH gives the number, and MONTHNAME the text.','Grouping by month alone merges January of different years, so include the year.'], a:'Reading the month off a calendar.',
  h:['`MONTH(date)` gives 1 to 12.','`MONTHNAME(date)` gives January and so on.','Sort by the number, not the name.','Group by `YEAR`, `MONTH` or `DATE_FORMAT(d, \'%Y-%m\')`.'],
  d:[FL(['MONTH'],[{ title:'2026-03-15', text:'date' },{ title:'MONTH()', text:'**3**' }])],
  x:[X('Variation','Month names in order','List months by name, ordered correctly.','Sort by number.','SELECT MONTHNAME(order_date) AS month, SUM(amount)\nFROM orders GROUP BY MONTH(order_date), MONTHNAME(order_date)\nORDER BY MONTH(order_date);',['Sorting names would put April first.'],'January, February, March.',T(ORD,'Table: orders')),
     X('Business case','Monthly totals','Totals per month.','Group by month.','SELECT MONTH(order_date) AS m, SUM(amount) AS total FROM orders GROUP BY MONTH(order_date);',['Month totals: 2000, 2200, 1500.'],'Add the year when data spans years.',T(ORD,'Table: orders'))],
  e:[['Years merge','Include the year.'],['Names sort alphabetically','Sort by number.'],['Language','Month names depend on lc_time_names.'],['Index use','A function on the column blocks the index.']],
  p:[P('Medium','Orders placed in March.','MONTH = 3.','SELECT * FROM orders WHERE MONTH(order_date) = 3;','Orders 5 and 6.',T(ORD,'Table: orders')),
     P('Interview','Sort months by name correctly.','Use the number.','ORDER BY MONTH(date) while selecting MONTHNAME(date).','Explain why names fail.')],
  q:[Q('Basic','What does MONTH return?','1 to 12.',{ f:[['MONTHNAME?','The name.']] }),
     Q('Scenario','Monthly totals over two years.','GROUP BY YEAR(date), MONTH(date).',{ t:'Or a year-month key.' })],
  r:RT(['Need','Write'],[['Number','`MONTH(d)`'],['Name','`MONTHNAME(d)`'],['Year-month key','`DATE_FORMAT(d, \'%Y-%m\')`'],['Sort','By the number']]), rel:['year-sql','date-format','group-by','month-over-month'] });

/* --- date-format --- */
D('date-format',{ l:'Beginner', t:'DATE_FORMAT turns a date into text using codes like %Y, %m and %d. The result is text, and %Y-%m-%d sorts correctly.',
  i:['Reports want friendly dates: 05-Jan-2026, January 2026. DATE_FORMAT builds them from format codes.','The output is text, so sort by the original date or by a yyyy-mm-dd key.'], a:'Choosing how a date is written on a label.',
  h:['`DATE_FORMAT(date, format)`.','`%Y` year, `%m` month number, `%b` short month, `%M` month name, `%d` day.','The result is text.','SQL Server uses FORMAT, PostgreSQL TO_CHAR.'],
  d:[FL(['%d-%b-%Y'],[{ title:'2026-01-05', text:'date' },{ title:'DATE_FORMAT', text:'**05-Jan-2026**' }])],
  x:[X('Variation','Month and year label','January 2026 style.','Use %M %Y.','SELECT DATE_FORMAT(order_date, \'%M %Y\') FROM orders;',['%M is the full month name.'],'January 2026 for order 1.',T(ORD,'Table: orders')),
     X('Business case','A year-month key','Group by month across years.','Use %Y-%m.','SELECT DATE_FORMAT(order_date, \'%Y-%m\') AS ym, SUM(amount) FROM orders GROUP BY ym ORDER BY ym;',['The text key sorts chronologically.'],'2026-01: 2000, 2026-02: 2200, 2026-03: 1500.',T(ORD,'Table: orders'))],
  e:[['Result is text','You cannot do date arithmetic on it.'],['Sorting formatted text','%d-%b-%Y sorts alphabetically. Use %Y-%m-%d.'],['Case of codes','%m is month, %M is month name.'],['Dialects','FORMAT in SQL Server, TO_CHAR in PostgreSQL.']],
  p:[P('Medium','Show order dates as dd-Mon-yyyy.','%d-%b-%Y.','SELECT DATE_FORMAT(order_date, \'%d-%b-%Y\') FROM orders;','05-Jan-2026.',T(ORD,'Table: orders')),
     P('Interview','Why not sort on a formatted date?','Text sorting.','Formatted text sorts alphabetically. Sort on the original date column or a yyyy-mm-dd string.','Give an example.')],
  q:[Q('Basic','What does DATE_FORMAT do?','It converts a date to text in a pattern.',{ f:[['%b versus %M?','Short versus full month name.']] }),
     Q('Scenario','Monthly labels that sort correctly.','Use %Y-%m as the key and format a friendly label separately.',{ t:'Keep the key for sorting, the label for display.' })],
  r:RT(['Code','Meaning'],[['`%Y`','4-digit year'],['`%m`','Month number'],['`%b` / `%M`','Short / full month name'],['`%d`','Day']]), rel:['month-sql','year-sql','cast-sql','concat-sql'] });

/* --- datediff --- */
D('datediff',{ l:'Beginner', t:'MySQL DATEDIFF(later, earlier) returns days. SQL Server takes the unit first. Use TIMESTAMPDIFF for months and years.',
  i:['"How many days between two dates?" is one of the most common questions: delivery time, invoice age, customer tenure.','The order of arguments differs between databases, which is a classic source of negative results.'], a:'Counting days on a calendar between two marks.',
  h:['MySQL: `DATEDIFF(end_date, start_date)`.','The result is in days.','Months and years: `TIMESTAMPDIFF(MONTH, start, end)`.','SQL Server: `DATEDIFF(day, start, end)`.'],
  d:[FL(['DATEDIFF(later, earlier)'],[{ title:'2026-01-05 → 2026-03-15', text:'**69 days**' }])],
  x:[X('Variation','Months between','Whole months between two dates.','Use TIMESTAMPDIFF.','SELECT TIMESTAMPDIFF(MONTH, \'2026-01-05\', \'2026-03-15\');',['Two complete months.'],'2.'),
     X('Business case','Days since the last order','Find customers inactive for a while.','Compare with a reference date.','SELECT customer_id, DATEDIFF(\'2026-03-20\', MAX(order_date)) AS days_inactive\nFROM orders GROUP BY customer_id;',['Last orders: Mar 15, Mar 9, Feb 21.'],'101: 5, 102: 11, 103: 27 days.',T(ORD,'Table: orders'))],
  e:[['Argument order','Later date first in MySQL, opposite in SQL Server.'],['Time ignored','DATEDIFF in MySQL ignores the time part.'],['Negative result','A negative number usually means swapped arguments.'],['Months and years','Use TIMESTAMPDIFF.']],
  p:[P('Medium','Days between 5 Jan 2026 and 3 Feb 2026.','Later first.','SELECT DATEDIFF(\'2026-02-03\', \'2026-01-05\');','29.'),
     P('Interview','How does DATEDIFF differ in SQL Server?','Unit first.','SQL Server: DATEDIFF(day, start, end), unit first and start date first.','Mention the sign.')],
  q:[Q('Basic','What does DATEDIFF return in MySQL?','The number of days between two dates.',{ f:[['For months?','TIMESTAMPDIFF(MONTH, a, b).']] }),
     Q('Scenario','Delivery time in days per order.','DATEDIFF(delivery_date, order_date), with checks for NULL and negatives.',{ t:'Negatives flag data errors.' })],
  r:RT(['Database','Syntax'],[['MySQL','`DATEDIFF(end, start)`'],['SQL Server','`DATEDIFF(day, start, end)`'],['Months','`TIMESTAMPDIFF(MONTH, s, e)`'],['PostgreSQL','`end - start`']]), rel:['date-add','now-curdate','month-over-month','lag'] });

/* --- date-add --- */
D('date-add',{ l:'Beginner', t:'DATE_ADD and DATE_SUB move a date by an interval. Adding a month to the 31st clamps to the last day.',
  i:['Due dates, expiry dates and rolling windows are all "date plus interval". DATE_ADD does it with units from seconds to years.','Month arithmetic is calendar-aware: 31 January plus a month is 28 February.'], a:'Counting forward or back on a calendar.',
  h:['`DATE_ADD(date, INTERVAL n unit)`.','`DATE_SUB` goes backward.','Or `date + INTERVAL n DAY`.','SQL Server: `DATEADD(day, n, date)`.'],
  d:[FL(['+ INTERVAL 7 DAY'],[{ title:'2026-01-05', text:'order date' },{ title:'DATE_ADD', text:'**2026-01-12**' }])],
  x:[X('Variation','Month-end clamp','31 January plus one month.','See the clamp.','SELECT DATE_ADD(\'2026-01-31\', INTERVAL 1 MONTH);',['February has 28 days in 2026.'],'2026-02-28.'),
     X('Business case','Payment due in 7 days','Each order is due a week later.','Add an interval.','SELECT order_id, DATE_ADD(order_date, INTERVAL 7 DAY) AS due FROM orders;',['Every date moves forward by seven days.'],'Order 4 is due 2026-02-28.',T(ORD,'Table: orders'))],
  e:[['Month clamping','The result is the last valid day, not an overflow.'],['Dialects','DATEADD in SQL Server; PostgreSQL uses INTERVAL strings.'],['Units','DAY, WEEK, MONTH, YEAR, HOUR and so on.'],['Index friendliness','Add to the constant, not the column.']],
  p:[P('Medium','Due date 14 days after the order date.','DATE_ADD.','SELECT DATE_ADD(order_date, INTERVAL 14 DAY) FROM orders;','Order 1: 2026-01-19.',T(ORD,'Table: orders')),
     P('Interview','What is DATE_ADD(\'2026-01-31\', INTERVAL 1 MONTH)?','Month end.','2026-02-28. MySQL clamps to the last valid day.','Contrast with a naive overflow.')],
  q:[Q('Basic','What does DATE_ADD do?','It adds an interval to a date.',{ f:[['How do you subtract?','DATE_SUB.']] }),
     Q('Scenario','Orders in the last 3 months.','WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH).',{ t:'The constant moves, the column stays raw so an index works.' })],
  r:RT(['Database','Syntax'],[['MySQL','`DATE_ADD(d, INTERVAL 7 DAY)`'],['Shortcut','`d + INTERVAL 7 DAY`'],['SQL Server','`DATEADD(day, 7, d)`'],['Back in time','`DATE_SUB`']]), rel:['datediff','now-curdate','month-sql','between-sql'] });
})();
