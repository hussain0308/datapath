/* Datapath | SQL | Numeric functions
 * Lessons in this file: round-sql, ceil-sql, floor-sql, mod-sql
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
  const { EMP, ORD } = DP.datasets.sql;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- round-sql --- */
'round-sql': {
  title:'ROUND', tagline:'Round a number to a chosen number of decimals.',
  prereq:['select'],
  what:['ROUND rounds a number to the digits you choose.','A negative digit count rounds to tens, hundreds and so on.','It changes the returned value.'],
  why:['Money and percentages in reports.'],
  syntax:{ code:'ROUND(number, decimals)', parts:[['number','The value to round.'],['decimals','Digits after the decimal point. Default is 0. Negative rounds left of the point.']] },
  points:['`ROUND(7142.857, 2)` gives 7142.86.','`ROUND(1234, -2)` gives 1200.','Exact values (DECIMAL) round half away from zero.','Use FLOOR or CEIL to force a direction.','Round only at the end of a calculation.'],
  mistakes:['Rounding too early.','Mixing up the sign of decimals.','Expecting the stored value to change.'],
  example:{ title:'Salary per day, rounded', scenario:'You divide each salary by 7 and show two decimals.',
    table:withHl(EMP,{'D2:D7':'range'},'Table: employees'), task:'Return salary divided by 7, rounded to 2 decimals.', formula:'SELECT name, ROUND(salary / 7, 2) AS per_unit\nFROM employees;',
    steps:['50000 / 7 = 7142.857142...','ROUND keeps two decimals, and the third decimal (7) rounds up.'],
    table2:{ rows:[['name','per_unit'],['Asha',7142.86],['Bilal',5714.29],['Chitra',8571.43],['Deepak',6428.57],['Esha',5714.29],['Farhan',5000]], caption:'Result' }, result:'Each value shows two decimals.' },
  practice:{ q:'What does ROUND(1234.5678, 1) return, and what does ROUND(1234, -2) return?', hint:'Look at the digit after the last kept digit.', solution:'ROUND(1234.5678, 1) = 1234.6\nROUND(1234, -2) = 1200', explain:'The next digit after .5 is 6, so it rounds up to .6. The negative value rounds to the nearest hundred.' },
  interview:[
    { level:'Basic', q:'What does ROUND do?', a:'It rounds a number to a given number of decimals, such as ROUND(7142.857, 2) = 7142.86.' },
    { level:'Intermediate', q:'What does a negative decimals argument do?', a:'It rounds to the left of the decimal point: ROUND(1234, -2) gives 1200.' },
    { level:'Intermediate', q:'When should you round?', a:'At the end of the calculation, so rounding errors do not accumulate.' },
    { level:'Scenario', q:'Show average order value in rupees with two decimals.', a:'SELECT ROUND(AVG(amount), 2) FROM orders;' }
  ],
  mcq:[
    { q:'ROUND(7142.857, 2) returns:', o:['7142.86','7142.85','7143','7142.9'], a:0, why:'The third decimal rounds up.' },
    { q:'ROUND(1234, -2) returns:', o:['1200','1230','1300','1000'], a:0, why:'Nearest hundred.' },
    { q:'Default number of decimals:', o:['0','2','1','None'], a:0, why:'ROUND(x) gives a whole number.' },
    { q:'Does ROUND change stored data?', o:['No','Yes','Always','Only DECIMAL'], a:0, why:'It changes the returned value only.' },
    { q:'When to round?', o:['At the end','At every step','Never','Before SUM'], a:0, why:'Avoids accumulated errors.' }
  ],
  recap:['ROUND(x, d) keeps d decimals; negative d rounds left.','Round at the end of calculations.','It does not change stored data.']
},

/* --- ceil-sql --- */
'ceil-sql': {
  title:'CEIL (CEILING)', tagline:'Round up to the next whole number.',
  prereq:['round-sql'],
  what:['CEIL returns the smallest whole number that is not less than the value.','It always goes up.','CEILING is the same function.'],
  why:['How many boxes, trucks or pages are needed?'],
  syntax:{ code:'CEIL(number)', parts:[['number','The value to round up.']] },
  points:['`CEIL(2.1)` is 3.','`CEIL(-2.5)` is -2, because it moves toward the larger number.','Whole numbers stay unchanged.','FLOOR is the opposite.','Use it for "at least how many" questions.'],
  mistakes:['Thinking CEIL on negatives goes away from zero.','Using ROUND where a minimum count is needed.','Forgetting to divide first.'],
  example:{ title:'Trucks needed', scenario:'Each truck carries goods worth 500. How many trucks does each order need?',
    table:withHl(ORD,{'D2:D7':'range'},'Table: orders'), task:'Round the number of trucks up.', formula:'SELECT order_id, amount, CEIL(amount / 500) AS trucks\nFROM orders;',
    steps:['1200 / 500 = 2.4, which needs 3 trucks.','CEIL always rounds up to the next whole number.'],
    table2:{ rows:[['order_id','amount','trucks'],[1,1200,3],[2,800,2],[3,1500,3],[4,700,2],[5,900,2],[6,600,2]], caption:'Result' }, result:'Order 3 (1500) fits exactly three trucks.' },
  practice:{ q:'What do CEIL(2.1) and CEIL(-2.5) return?', hint:'CEIL moves toward the larger number.', solution:'CEIL(2.1) = 3\nCEIL(-2.5) = -2', explain:'-2 is larger than -2.5, so CEIL moves up on the number line.' },
  interview:[
    { level:'Basic', q:'What does CEIL do?', a:'It rounds a number up to the next whole number.' },
    { level:'Intermediate', q:'What is CEIL(-2.5)?', a:'-2, because CEIL returns the smallest integer that is greater than or equal to the value.' },
    { level:'Intermediate', q:'CEIL versus ROUND?', a:'ROUND goes to the nearest value. CEIL always goes up, even for 2.1.' },
    { level:'Scenario', q:'How many pages are needed for 53 records at 10 per page?', a:'CEIL(53 / 10) = 6 pages.' }
  ],
  mcq:[
    { q:'CEIL(2.1) returns:', o:['3','2','2.1','2.5'], a:0, why:'Always rounds up.' },
    { q:'CEIL(-2.5) returns:', o:['-2','-3','-2.5','2'], a:0, why:'Toward the larger number.' },
    { q:'CEIL(5) returns:', o:['5','6','4','0'], a:0, why:'Whole numbers are unchanged.' },
    { q:'Which suits "how many boxes are needed"?', o:['CEIL','FLOOR','ABS','MOD'], a:0, why:'A partial box still needs a box.' },
    { q:'Another name for CEIL:', o:['CEILING','TOP','UP','RAISE'], a:0, why:'CEILING is a synonym.' }
  ],
  recap:['CEIL rounds up to the next whole number.','Negatives move toward the larger number.','Use it for minimum counts.']
},

/* --- floor-sql --- */
'floor-sql': {
  title:'FLOOR', tagline:'Round down to the previous whole number.',
  prereq:['ceil-sql'],
  what:['FLOOR returns the largest whole number that is not greater than the value.','It always goes down.','It is the opposite of CEIL.'],
  why:['How many full boxes, whole years or complete units?'],
  syntax:{ code:'FLOOR(number)', parts:[['number','The value to round down.']] },
  points:['`FLOOR(7.9)` is 7.','`FLOOR(-7.1)` is -8.','Whole numbers stay unchanged.','Different from truncating: negatives round away from zero.','Use it for "how many complete" questions.'],
  mistakes:['Assuming FLOOR on negatives goes toward zero.','Using it instead of ROUND.','Forgetting to divide first.'],
  example:{ title:'Full trucks', scenario:'Each truck carries goods worth 500. How many trucks can be completely filled by each order?',
    table:withHl(ORD,{'D2:D7':'range'},'Table: orders'), task:'Round the number of full trucks down.', formula:'SELECT order_id, amount, FLOOR(amount / 500) AS full_trucks\nFROM orders;',
    steps:['1200 / 500 = 2.4.','FLOOR drops the .4, so 2 full trucks.'],
    table2:{ rows:[['order_id','amount','full_trucks'],[1,1200,2],[2,800,1],[3,1500,3],[4,700,1],[5,900,1],[6,600,1]], caption:'Result' }, result:'Order 1 fills two trucks completely.' },
  practice:{ q:'What do FLOOR(7.9) and FLOOR(-7.1) return?', hint:'FLOOR moves toward the smaller number.', solution:'FLOOR(7.9) = 7\nFLOOR(-7.1) = -8', explain:'-8 is smaller than -7.1, so FLOOR moves down on the number line.' },
  interview:[
    { level:'Basic', q:'What does FLOOR do?', a:'It rounds a number down to the previous whole number.' },
    { level:'Intermediate', q:'FLOOR(-7.1)?', a:'-8, because FLOOR returns the largest integer less than or equal to the value.' },
    { level:'Intermediate', q:'FLOOR versus TRUNCATE?', a:'For positive numbers they agree. For negatives, FLOOR goes down (to -8) and TRUNCATE removes the decimals (to -7).' },
    { level:'Scenario', q:'Calculate complete years of service from days.', a:'FLOOR(days / 365.25) gives complete years.' }
  ],
  mcq:[
    { q:'FLOOR(7.9) returns:', o:['7','8','7.9','9'], a:0, why:'Always rounds down.' },
    { q:'FLOOR(-7.1) returns:', o:['-8','-7','7','-7.1'], a:0, why:'Toward the smaller number.' },
    { q:'Which is the opposite of FLOOR?', o:['CEIL','ROUND','ABS','MOD'], a:0, why:'CEIL rounds up.' },
    { q:'FLOOR(1200/500) returns:', o:['2','3','2.4','1'], a:0, why:'2.4 rounded down is 2.' },
    { q:'Use FLOOR for:', o:['Complete units','Minimum units needed','Averages','Dates'], a:0, why:'Partial units are dropped.' }
  ],
  recap:['FLOOR rounds down to the previous whole number.','Negatives move toward the smaller number.','Use it for complete units.']
},

/* --- mod-sql --- */
'mod-sql': {
  title:'MOD', tagline:'Get the remainder of a division.',
  prereq:['select'],
  what:['MOD(a, b) returns the remainder after dividing a by b.','The % operator does the same in MySQL.','It is used to find even or odd numbers and every n-th row.'],
  why:['Pick even ids, every third row, or cycle through groups.'],
  syntax:{ code:'MOD(a, b)\na % b', parts:[['a','The number to divide.'],['b','The divisor.']] },
  points:['`MOD(7, 3)` is 1.','Even numbers: `MOD(n, 2) = 0`.','Dividing by zero returns NULL in MySQL.','Useful for sampling every n-th row.','SQL Server uses `%`; Oracle uses MOD.'],
  mistakes:['Dividing by zero.','Forgetting that remainder 0 means exact division.','Using / instead of MOD.'],
  example:{ title:'Even-numbered orders', scenario:'You want the orders whose id is even.',
    table:withHl(ORD,{'A3':'hit','A5':'hit','A7':'hit'},'Table: orders'), task:'Return the even order ids.', formula:'SELECT order_id\nFROM orders\nWHERE MOD(order_id, 2) = 0;',
    steps:['MOD(order_id, 2) is the remainder when dividing by 2.','A remainder of 0 means the id is even.'],
    table2:{ rows:[['order_id'],[2],[4],[6]], caption:'Result' }, result:'Orders 2, 4 and 6.' },
  practice:{ q:'Write a query for every third order (ids 3 and 6).', table:T(ORD,'Table: orders'), hint:'MOD(order_id, 3) = 0.', solution:'SELECT order_id\nFROM orders\nWHERE MOD(order_id, 3) = 0;', explain:'Orders 3 and 6 are divisible by 3.' },
  interview:[
    { level:'Basic', q:'What does MOD return?', a:'The remainder of a division, such as MOD(7,3) = 1.' },
    { level:'Intermediate', q:'How do you select even-numbered rows?', a:'WHERE MOD(id, 2) = 0.' },
    { level:'Intermediate', q:'What does MOD(x, 0) return in MySQL?', a:'NULL. Dividing by zero does not raise an error in MySQL, but I avoid it.' },
    { level:'Scenario', q:'Take roughly every 10th row as a sample.', a:'WHERE MOD(id, 10) = 0 on a sequential id.' }
  ],
  mcq:[
    { q:'MOD(7, 3) returns:', o:['1','2','3','0'], a:0, why:'7 = 2 x 3 + 1.' },
    { q:'Which finds even numbers?', o:['MOD(n,2)=0','MOD(n,2)=1','n/2','n%3=0'], a:0, why:'Even numbers leave no remainder.' },
    { q:'Another way to write MOD(a,b) in MySQL:', o:['a % b','a // b','a ^ b','a div b'], a:0, why:'% is the modulo operator.' },
    { q:'MOD(10, 5) returns:', o:['0','5','2','1'], a:0, why:'10 divides exactly by 5.' },
    { q:'MOD(8, 0) in MySQL returns:', o:['NULL','0','8','Error always'], a:0, why:'Division by zero gives NULL.' }
  ],
  recap:['MOD(a, b) is the remainder.','MOD(n, 2) = 0 finds even numbers.','Use for every n-th row.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- round-sql --- */
D('round-sql',{ l:'Beginner', t:'ROUND rounds to a number of decimals, and a negative digit count rounds to tens or hundreds. Round at the end of a calculation.',
  i:['Money and ratios need tidy decimals. ROUND controls how many, and a negative number rounds to the left of the decimal point.','Round once, at the end: rounding at every step accumulates error.'], a:'Trimming a measurement to the precision you need.',
  h:['`ROUND(x, 2)` keeps two decimals.','`ROUND(x)` gives a whole number.','`ROUND(x, -2)` rounds to hundreds.','Use `FLOOR`/`CEIL` to force a direction.'],
  d:[FL(['ROUND(salary/7, 2)'],[{ title:'50000 / 7', text:'7142.857142...' },{ title:'ROUND', text:'**7142.86**' }])],
  x:[X('Variation','Rounding to hundreds','Show a budget in hundreds.','Negative digits.','SELECT ROUND(1234, -2);',['-2 means the hundreds position.'],'1200.'),
     X('Business case','Percentages in a report','Share of total, one decimal.','Round the percentage only.','SELECT order_id, ROUND(amount * 100.0 / (SELECT SUM(amount) FROM orders), 1) AS pct FROM orders;',['The division is exact, rounding comes last.'],'21.1, 14.0, 26.3 ... adding to 100.0.',T(ORD,'Table: orders'))],
  e:[['Rounding too early','Round the final value, not intermediates.'],['Half cases','DECIMAL rounds half away from zero; floating point may differ.'],['Display versus value','ROUND changes the returned value.'],['Integer division','In some databases 5/2 is 2. Use a decimal.']],
  p:[P('Medium','Salary divided by 7, two decimals.','ROUND.','SELECT name, ROUND(salary / 7, 2) FROM employees;','Asha 7142.86.',T(EMP,'Table: employees')),
     P('Interview','Why round only at the end?','Error accumulation.','Rounding intermediate values compounds errors; compute exactly, then round the final figure.','Give an example with sums of rounded lines.')],
  q:[Q('Basic','What does ROUND(x, -2) do?','It rounds to the nearest hundred.',{ f:[['Default digits?','0.']] }),
     Q('Scenario','A report total differs by 0.01 from the sum of lines.','Decide on a rounding policy (per line or on the total) and apply it consistently.',{ t:'Show unrounded totals for audit.' })],
  r:RT(['Call','Result'],[['`ROUND(7142.857, 2)`','7142.86'],['`ROUND(1234, -2)`','1200'],['`CEIL(2.1)`','3'],['`FLOOR(7.9)`','7']]), rel:['ceil-sql','floor-sql','avg-sql','cast-sql'] });

/* --- ceil-sql --- */
D('ceil-sql',{ l:'Beginner', t:'CEIL rounds up to the next whole number. Use it for "at least how many are needed".',
  i:['If each box holds 10 items and you have 53, you need 6 boxes, not 5.3. CEIL answers capacity questions by always rounding up.','Negative numbers round toward the larger number: CEIL(-2.5) is -2.'], a:'Counting boxes: a partly filled box is still a box.',
  h:['Divide to get the raw figure.','Wrap in `CEIL(...)`.','Whole numbers are unchanged.','Use FLOOR for "full units".'],
  d:[FL(['CEIL(amount / 500)'],[{ title:'1200 / 500', text:'2.4' },{ title:'CEIL', text:'**3** trucks' }])],
  x:[X('Variation','Pages needed','53 records, 10 per page.','CEIL of the division.','SELECT CEIL(53 / 10);',['5.3 rounds up.'],'6 pages.'),
     X('Business case','Trucks per order','Each truck carries 500 in value.','CEIL per order.','SELECT order_id, amount, CEIL(amount / 500) AS trucks FROM orders;',['1200 needs 3 trucks.'],'Order 3 (1500) needs exactly 3.',T(ORD,'Table: orders'))],
  e:[['Negatives','CEIL(-2.5) is -2, not -3.'],['Integer division','Use 500.0 or a decimal so the quotient is not truncated.'],['Synonym','CEILING.'],['Floating point','Tiny errors can push 3.0000001 up to 4. Round first.']],
  p:[P('Medium','What are CEIL(2.1) and CEIL(-2.5)?','Toward larger.','3 and -2','CEIL moves toward the larger number.'),
     P('Interview','CEIL versus ROUND?','Direction.','ROUND goes to the nearest value, CEIL always up.','Use CEIL for minimum counts.')],
  q:[Q('Basic','What does CEIL do?','It rounds up to the next whole number.',{ f:[['Another name?','CEILING.']] }),
     Q('Scenario','How many pages for 53 records at 10 per page?','CEIL(53 / 10) = 6.',{ t:'Mind integer division in some databases.' })],
  r:RT(['Function','Direction'],[['`CEIL`','Up'],['`FLOOR`','Down'],['`ROUND`','Nearest'],['`TRUNCATE`','Toward zero']]), rel:['floor-sql','round-sql','mod-sql','cast-sql'] });

/* --- floor-sql --- */
D('floor-sql',{ l:'Beginner', t:'FLOOR rounds down to the previous whole number. Use it for "how many complete units".',
  i:['If each truck carries 500 and an order is 1200, two trucks are completely full. FLOOR counts complete units.','For negatives, FLOOR moves toward the smaller number: FLOOR(-7.1) is -8.'], a:'Counting only the full boxes.',
  h:['Compute the ratio.','Wrap in `FLOOR(...)`.','Whole numbers unchanged.','TRUNCATE drops decimals toward zero, which differs for negatives.'],
  d:[FL(['FLOOR(amount / 500)'],[{ title:'1200 / 500', text:'2.4' },{ title:'FLOOR', text:'**2** full trucks' }])],
  x:[X('Variation','Complete years','Years of service from days.','Floor the division.','SELECT FLOOR(days / 365.25) AS years FROM staff;',['Partial years are dropped.'],'800 days gives 2 years.'),
     X('Business case','Full trucks per order','How many trucks are completely filled?','FLOOR per order.','SELECT order_id, FLOOR(amount / 500) AS full_trucks FROM orders;',['1200 fills two trucks.'],'Order 1: 2, order 3: 3.',T(ORD,'Table: orders'))],
  e:[['Negatives','FLOOR(-7.1) is -8.'],['FLOOR versus TRUNCATE','Equal for positives, different for negatives.'],['Integer division','Beware databases that truncate integer division.'],['Floating point','Use DECIMAL for exact quotients.']],
  p:[P('Medium','FLOOR(7.9) and FLOOR(-7.1).','Toward smaller.','7 and -8','FLOOR moves toward the smaller number.'),
     P('Interview','FLOOR versus CEIL?','Opposites.','FLOOR rounds down, CEIL rounds up.','Use FLOOR for full units, CEIL for minimum units needed.')],
  q:[Q('Basic','What does FLOOR do?','It rounds down to the previous whole number.',{ f:[['FLOOR(-7.1)?','-8.']] }),
     Q('Scenario','Complete years between two dates.','TIMESTAMPDIFF(YEAR, start, end), or FLOOR(DATEDIFF/365.25) as an approximation.',{ t:'TIMESTAMPDIFF is exact.' })],
  r:RT(['Function','Result'],[['`FLOOR(7.9)`','7'],['`FLOOR(-7.1)`','-8'],['`CEIL(7.1)`','8'],['`ROUND(7.5)`','8']]), rel:['ceil-sql','round-sql','mod-sql','datediff'] });

/* --- mod-sql --- */
D('mod-sql',{ l:'Beginner', t:'MOD returns the remainder of a division. Use it for even or odd rows and for every n-th row.',
  i:['The remainder tells you about divisibility: MOD(n, 2) = 0 means even, MOD(n, 3) = 0 means every third item.','It is a handy trick for sampling, alternating groups and checks.'], a:'What is left over after dividing candies equally.',
  h:['Write `MOD(a, b)` or `a % b`.','Remainder 0 means exact division.','Use in WHERE to select every n-th row.','Dividing by zero returns NULL in MySQL.'],
  d:[FL(['MOD(order_id, 2) = 0'],[{ title:'order_id', rows:[['order_id','MOD 2'],[1,1],[2,0],[3,1],[4,0],[5,1],[6,0]], hl:{2:'hit',4:'hit',6:'hit'} },{ title:'Result', text:'2, 4, 6' }])],
  x:[X('Variation','Every third row','Sample orders 3 and 6.','MOD by 3.','SELECT order_id FROM orders WHERE MOD(order_id, 3) = 0;',['Orders 3 and 6 divide exactly by 3.'],'Two rows.',T(ORD,'Table: orders')),
     X('Business case','Alternating groups','Assign employees to two teams.','MOD on the id.','SELECT name, CASE WHEN MOD(emp_id, 2) = 0 THEN \'B\' ELSE \'A\' END AS team FROM employees;',['Even ids go to B.'],'Asha A, Bilal B, Chitra A ...',T(EMP,'Table: employees'))],
  e:[['Divide by zero','MOD(x, 0) is NULL in MySQL.'],['Negatives','MOD(-7, 3) is -1 in MySQL (sign of the dividend).'],['Sequential ids required','Gaps make "every n-th" uneven.'],['Operator','`%` in MySQL and SQL Server; `MOD()` in Oracle.']],
  p:[P('Medium','Select even-numbered orders.','MOD 2.','SELECT order_id FROM orders WHERE MOD(order_id, 2) = 0;','2, 4, 6.',T(ORD,'Table: orders')),
     P('Interview','Take roughly every 10th row as a sample.','MOD on a sequential id.','WHERE MOD(id, 10) = 0.','Mention randomness: use RAND for true sampling.')],
  q:[Q('Basic','What does MOD return?','The remainder after division.',{ f:[['MOD(7, 3)?','1.']] }),
     Q('Scenario','Split users into 4 test groups.','MOD(user_id, 4) gives groups 0 to 3.',{ t:'Hashing the id avoids pattern bias.' })],
  r:RT(['Need','Write'],[['Remainder','`MOD(a, b)`'],['Even','`MOD(n, 2) = 0`'],['Every 3rd','`MOD(n, 3) = 0`'],['Operator','`a % b`']]), rel:['floor-sql','ceil-sql','case-when','where'] });
})();
