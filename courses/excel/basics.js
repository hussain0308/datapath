/* Datapath | Excel | Excel basics
 * Lessons in this file: cell-references, sum, average, count, counta, max, min
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
  const { withHl, X, P, Q, FL, D, RT } = DP.builders;
  const { MONTHS5, GST, ATTEND } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- cell-references --- */
'cell-references': {
  title:'Cell references: relative, absolute, mixed', tagline:'Control what changes and what stays fixed when you copy a formula.',
  prereq:[],
  what:['A cell reference points to a cell, such as B2.','**Relative** (B2) changes when the formula is copied.','**Absolute** ($B$2) never changes.','**Mixed** ($B2 or B$2) locks only the column or only the row.'],
  why:['Almost every real formula is copied down or across.','Wrong references are the most common cause of wrong totals.'],
  syntax:{ code:'B2     relative\n$B$2   absolute\n$B2    column locked\nB$2    row locked', parts:[
    ['B2','Both the column and row move when the formula is copied.'],
    ['$B$2','Neither moves. Use it for fixed values such as a tax rate.'],
    ['$B2 / B$2','Only the part without $ moves.']
  ]},
  points:['Press **F4** while editing a reference to cycle through B2, $B$2, B$2 and $B2.','A $ before the column letter locks the column; a $ before the row number locks the row.','Use absolute references for fixed inputs and lookup tables.','Use mixed references when one formula is copied both down and across.','A reference to another sheet looks like `Sheet2!B2`.'],
  mistakes:['Forgetting $ on a lookup table, so the range drifts as the formula is copied down.','Locking more than needed, so the formula cannot adapt.','Typing $ by hand instead of pressing F4.'],
  example:{
    title:'Applying one GST rate to every row', scenario:'The GST rate sits in F2. Each row needs its amount multiplied by that same rate.',
    table:withHl(GST,{'D3':'find','F2':'find','E3':'hit'},'Sheet: Bills'),
    task:'Write the GST for Book (row 3) so it can be copied down.', formula:'=D3*$F$2',
    steps:['D3 is relative, so it becomes D4 when copied one row down.','$F$2 is absolute, so every row keeps using the same rate.','120 multiplied by 18% gives 21.6.'],
    result:'The formula returns 21.6, and stays correct when copied down.'
  },
  practice:{ q:'Prices are in column B and the discount rate is in E2. Write a formula for C2 that returns the price after discount, and can be copied down.',
    table:withHl({rows:[['Item','Price','Discount price','','Discount'],['Pen',100,'','','10%'],['Book',200,'','',''],['Bag',500,'','','']]},{},'Sheet: Prices'),
    hint:'Lock the discount cell with $ signs.', solution:'=B2*(1-$E$2)',
    explain:'B2 moves down with each row, while $E$2 always points at the discount rate. For Pen the result is 90.' },
  interview:[
    { level:'Basic', q:'What is the difference between relative, absolute and mixed references?', a:'A relative reference such as B2 changes when copied. An absolute reference such as $B$2 stays fixed. A mixed reference such as $B2 or B$2 locks only the column or only the row.' },
    { level:'Basic', q:'What does the F4 key do while editing a formula?', a:'It cycles the selected reference through relative, absolute, row-locked and column-locked forms, so I do not have to type the dollar signs.' },
    { level:'Intermediate', q:'When would you use a mixed reference?', a:'When one formula is copied both down and across, such as a multiplication table: =$A2*B$1 locks the row headings to column A and the column headings to row 1.' },
    { level:'Scenario', q:'You copy a VLOOKUP down and the results turn into #N/A after a few rows. What is likely wrong?', a:'The table range was relative, so it shifted down as the formula was copied. I lock it with dollar signs, for example $A$2:$D$100, and copy again.' }
  ],
  mcq:[
    { q:'Which reference never changes when copied?', o:['B2','$B$2','B$2','$B2'], a:1, why:'Dollar signs before both the column and the row lock the reference.' },
    { q:'Which key cycles through reference types?', o:['F2','F4','F5','F9'], a:1, why:'F4 toggles between relative, absolute and mixed forms.' },
    { q:'What does `B$2` lock?', o:['The column','The row','Both','Neither'], a:1, why:'The $ before 2 locks the row.' },
    { q:'A tax rate in F1 is used by every row. Which reference should the formula use?', o:['F1','$F$1','F$1 only','$F1 only'], a:1, why:'A fixed input should be absolute.' },
    { q:'What does `Sheet2!B2` mean?', o:['Cell B2 on Sheet2','Row 2 of all sheets','A named range','An error'], a:0, why:'The exclamation mark separates the sheet name from the cell.' }
  ],
  recap:['Relative changes, absolute stays, mixed locks one direction.','Press F4 to add or change dollar signs.','Lock fixed inputs and lookup tables before copying.']
},

/* --- sum --- */
'sum': {
  title:'SUM', tagline:'Add up numbers in cells, ranges or a mix of both.',
  prereq:['cell-references'],
  what:['SUM adds all the numbers in the cells you give it.','It ignores text and empty cells.','It is the most used function in Excel.'],
  why:['Totals in every report: monthly sales, expenses, headcount.','The fastest way to add a long column.'],
  syntax:{ code:'=SUM(number1, [number2], ...)', parts:[['number1','A cell, a range such as B2:B6, or a number.'],['number2, ...','Optional. More cells, ranges or numbers.']] },
  points:['Shortcut: **Alt + =** inserts a SUM for the selected range.','You can mix ranges: `=SUM(B2:B6, D2:D6)`.','Text and empty cells are ignored.','Numbers stored as text are **not** added.','The status bar shows the sum of selected cells without a formula.'],
  mistakes:['Numbers stored as text, which are silently left out.','A range that stops one row short after new rows are added.','Typing +B2+B3+B4 by hand for long lists.'],
  example:{ title:'Adding monthly sales', scenario:'Five months of sales are listed. You want the total.',
    table:withHl(MONTHS5,{'B2:B6':'range'},'Sheet: Sales'), task:'Add all five months.', formula:'=SUM(B2:B6)',
    steps:['The range B2:B6 holds the five sales values.','SUM adds 1200 + 1500 + 900 + 1800 + 1100.'], result:'The formula returns 6500.' },
  practice:{ q:'Write a formula to add the sales for January to March only.', table:withHl(MONTHS5,{},'Sheet: Sales'),
    hint:'January to March is B2:B4.', solution:'=SUM(B2:B4)', explain:'1200 + 1500 + 900 gives 3600.' },
  interview:[
    { level:'Basic', q:'What does SUM do with text and empty cells?', a:'It ignores them and adds only numbers.' },
    { level:'Intermediate', q:'A SUM total looks too low. What could be wrong?', a:'Some values may be stored as text, so SUM skips them. I check with ISNUMBER, convert them with VALUE or Text to Columns, and make sure the range covers all rows.' },
    { level:'Intermediate', q:'How do you add two separate ranges?', a:'Separate them with a comma: =SUM(B2:B6, D2:D6).' },
    { level:'Scenario', q:'New rows are added below your data every month. How do you keep the total correct?', a:'I convert the data to an Excel Table and use a structured reference such as =SUM(Sales[Amount]), which expands automatically, instead of a fixed range.' }
  ],
  mcq:[
    { q:'What does `=SUM(B2:B6)` return for the monthly sales?', o:['6500','5400','1300','5'], a:0, why:'1200 + 1500 + 900 + 1800 + 1100 = 6500.' },
    { q:'What shortcut inserts a SUM?', o:['Alt + =','Ctrl + S','Ctrl + Shift + L','F4'], a:0, why:'Alt + = adds an AutoSum for the selected range.' },
    { q:'What does SUM do with numbers stored as text?', o:['Adds them','Ignores them','Shows an error','Converts them'], a:1, why:'They are treated as text, so they are skipped.' },
    { q:'Which formula adds two ranges?', o:['=SUM(B2:B6, D2:D6)','=SUM(B2:B6; D2:D6 only)','=B2:B6+D2:D6','=ADD(B2:B6)'], a:0, why:'Arguments are separated by commas.' },
    { q:'What does SUM do with empty cells?', o:['Treats them as 1','Ignores them','Shows an error','Stops adding'], a:1, why:'Empty cells are ignored.' }
  ],
  recap:['SUM adds numbers and ignores text and empty cells.','Numbers stored as text are not added.','Use Alt + = for a quick total.']
},

/* --- average --- */
'average': {
  title:'AVERAGE', tagline:'Find the mean of a set of numbers.',
  prereq:['sum'],
  what:['AVERAGE adds the numbers and divides by how many there are.','It ignores text and empty cells.','It shows the typical value.'],
  why:['Average sales, marks, delivery time or order value.','A quick way to compare groups.'],
  syntax:{ code:'=AVERAGE(number1, [number2], ...)', parts:[['number1','A cell, a range or a number.'],['number2, ...','Optional. More cells, ranges or numbers.']] },
  points:['It divides by the **count of numbers**, not the count of cells.','Empty cells and text are ignored, but a cell containing 0 is included.','Averages can hide outliers, so check the highest and lowest values too.','Use AVERAGEIF or AVERAGEIFS for conditional averages.','If there are no numbers at all, it returns `#DIV/0!`.'],
  mistakes:['Treating a blank as 0 in your head. Blanks are skipped, zeros are counted.','Averaging averages of groups with different sizes.','Ignoring outliers that pull the average.'],
  example:{ title:'Average monthly sales', scenario:'You want the typical monthly sales across five months.',
    table:withHl(MONTHS5,{'B2:B6':'range'},'Sheet: Sales'), task:'Find the average sales.', formula:'=AVERAGE(B2:B6)',
    steps:['The total of the five values is 6500.','There are 5 numbers, so 6500 divided by 5.'], result:'The formula returns 1300.' },
  practice:{ q:'Write a formula for the average of the last three months (Mar to May).', table:withHl(MONTHS5,{},'Sheet: Sales'),
    hint:'March to May is B4:B6.', solution:'=AVERAGE(B4:B6)', explain:'(900 + 1800 + 1100) divided by 3 gives 1266.67.' },
  interview:[
    { level:'Basic', q:'How does AVERAGE treat blank cells and zeros?', a:'It skips blank cells and text, but includes zeros as real values, so a zero lowers the average while a blank does not.' },
    { level:'Intermediate', q:'Why can an average be misleading?', a:'A few very large or very small values pull it away from the typical value. I also look at the median and the minimum and maximum before drawing conclusions.' },
    { level:'Intermediate', q:'What does AVERAGE return if all cells are empty?', a:'#DIV/0!, because there are no numbers to divide. I wrap it in IFERROR if that can happen.' },
    { level:'Scenario', q:'A manager wants the average sale per region from one list. Which functions would you use?', a:'AVERAGEIF for one condition, or AVERAGEIFS for several, rather than filtering and averaging by hand.' }
  ],
  mcq:[
    { q:'What does `=AVERAGE(B2:B6)` return for the monthly sales?', o:['1300','6500','1200','5'], a:0, why:'6500 divided by 5 is 1300.' },
    { q:'How does AVERAGE treat a cell containing 0?', o:['Ignores it','Includes it','Shows an error','Treats it as blank'], a:1, why:'Zero is a number, so it counts.' },
    { q:'How does AVERAGE treat an empty cell?', o:['As 0','Ignores it','Shows an error','Counts it'], a:1, why:'Empty cells are skipped.' },
    { q:'What error appears if there are no numbers?', o:['#N/A','#DIV/0!','#VALUE!','#REF!'], a:1, why:'Dividing by a count of 0 gives #DIV/0!.' },
    { q:'Which function averages with a condition?', o:['AVERAGEIF','COUNTIF','SUMIF','MAXIFS'], a:0, why:'AVERAGEIF averages the cells that meet a condition.' }
  ],
  recap:['AVERAGE divides the total by the count of numbers.','Blanks are skipped, zeros are counted.','Check outliers before trusting an average.']
},

/* --- count --- */
'count': {
  title:'COUNT', tagline:'Count how many cells contain numbers.',
  prereq:['sum'],
  what:['COUNT counts the cells that contain **numbers** (including dates).','It ignores text and empty cells.','It tells you how many numeric values you have.'],
  why:['Check how many valid numbers a column has.','Spot missing or non-numeric entries.'],
  syntax:{ code:'=COUNT(value1, [value2], ...)', parts:[['value1','A cell or range to count.'],['value2, ...','Optional. More cells or ranges.']] },
  points:['Numbers and dates are counted.','Text, errors and empty cells are not counted.','Numbers stored as text are not counted.','Compare with COUNTA, which counts every non-empty cell.','`COUNT(range)` versus `COUNTA(range)` shows how many cells are not numeric.'],
  mistakes:['Using COUNT when you meant COUNTA for text.','Numbers stored as text making the count look low.','Expecting COUNT to count blanks.'],
  example:{ title:'Counting valid marks', scenario:'Some students have marks, one is Absent and one is blank. You want the number of numeric marks.',
    table:withHl(ATTEND,{'B2':'hit','B4':'hit','B6':'hit'},'Sheet: Marks'), task:'Count the numeric marks.', formula:'=COUNT(B2:B6)',
    steps:['82, 45 and 58 are numbers.','"Absent" is text and Deepak\'s cell is empty, so both are ignored.'], result:'The formula returns 3.' },
  practice:{ q:'Write a formula that counts the numeric values in the Sales column.', table:withHl(MONTHS5,{},'Sheet: Sales'),
    hint:'The sales values are in B2:B6.', solution:'=COUNT(B2:B6)', explain:'All five cells hold numbers, so the result is 5.' },
  interview:[
    { level:'Basic', q:'What does COUNT count?', a:'It counts cells that contain numbers, including dates. It ignores text, errors and empty cells.' },
    { level:'Basic', q:'What is the difference between COUNT and COUNTA?', a:'COUNT counts only numbers. COUNTA counts every non-empty cell, whether it holds numbers, text or errors.' },
    { level:'Intermediate', q:'A column should hold numbers but COUNT returns fewer than expected. Why?', a:'Some values may be stored as text, or the cells may be empty. I check with ISNUMBER and COUNTA, and convert text numbers.' },
    { level:'Scenario', q:'How do you find how many entries in a column are not numeric?', a:'=COUNTA(B2:B100)-COUNT(B2:B100) counts the non-empty cells that are not numbers.' }
  ],
  mcq:[
    { q:'What does `=COUNT(B2:B6)` return for the marks list?', o:['3','4','5','1'], a:0, why:'Only 82, 45 and 58 are numbers.' },
    { q:'Does COUNT count text?', o:['Yes','No','Only if quoted','Only in COUNTIF'], a:1, why:'COUNT counts numbers only.' },
    { q:'Are dates counted by COUNT?', o:['Yes, they are numbers','No','Only formatted dates','Only text dates'], a:0, why:'Excel stores dates as numbers.' },
    { q:'Which function counts every non-empty cell?', o:['COUNT','COUNTA','COUNTBLANK','COUNTIF'], a:1, why:'COUNTA counts all non-empty cells.' },
    { q:'Which formula counts non-numeric, non-empty entries?', o:['=COUNTA(B2:B6)-COUNT(B2:B6)','=COUNT(B2:B6)-COUNTA(B2:B6)','=COUNTBLANK(B2:B6)','=SUM(B2:B6)'], a:0, why:'Total non-empty minus numbers leaves the non-numeric entries.' }
  ],
  recap:['COUNT counts numbers and dates only.','Text, errors and blanks are ignored.','COUNTA minus COUNT gives the non-numeric entries.']
},

/* --- counta --- */
'counta': {
  title:'COUNTA', tagline:'Count every cell that is not empty.',
  prereq:['count'],
  what:['COUNTA counts cells that contain **anything**: numbers, text, dates or errors.','It only skips truly empty cells.','COUNTBLANK counts the empty cells.'],
  why:['Count how many rows are filled in a form or list.','Find missing entries by comparing with the total rows.'],
  syntax:{ code:'=COUNTA(value1, [value2], ...)', parts:[['value1','A cell or range to count.'],['value2, ...','Optional. More cells or ranges.']] },
  points:['It counts text, numbers, dates, TRUE/FALSE and errors.','A cell holding an empty text result (`""`) from a formula **is** counted.','A cell with only a space is counted too.','`COUNTBLANK(range)` counts empty cells and cells showing `""`.','Rows in a list = COUNTA of a column that is always filled, such as an ID.'],
  mistakes:['Thinking cells with spaces are blank.','Using COUNTA when only numbers should be counted.','Forgetting that formulas returning "" are counted.'],
  example:{ title:'How many students have an entry?', scenario:'The marks column holds numbers, one word (Absent) and one empty cell.',
    table:withHl(ATTEND,{'B2':'hit','B3':'hit','B4':'hit','B6':'hit'},'Sheet: Marks'), task:'Count the non-empty cells in the marks column.', formula:'=COUNTA(B2:B6)',
    steps:['82, Absent, 45 and 58 are all non-empty.','Deepak\'s cell is empty, so it is skipped.'], result:'The formula returns 4.' },
  practice:{ q:'Write a formula that counts the empty cells in the marks column.', table:withHl(ATTEND,{},'Sheet: Marks'),
    hint:'Use the function whose name says it counts blanks.', solution:'=COUNTBLANK(B2:B6)', explain:'Only Deepak\'s cell is empty, so the result is 1.' },
  interview:[
    { level:'Basic', q:'What does COUNTA count?', a:'Every non-empty cell, including text, numbers, dates and errors.' },
    { level:'Intermediate', q:'Why might COUNTA count a cell that looks empty?', a:'The cell may contain a space or a formula that returns an empty text string. These are not truly empty, so COUNTA counts them.' },
    { level:'Intermediate', q:'How do you count the rows in a list?', a:'I use COUNTA on a column that is always filled, such as an ID column, and subtract 1 if the range includes the header.' },
    { level:'Scenario', q:'How would you find how many customers have not given a phone number?', a:'=COUNTBLANK(C2:C500), after checking that missing values are truly empty and do not contain spaces.' }
  ],
  mcq:[
    { q:'What does `=COUNTA(B2:B6)` return for the marks list?', o:['4','3','5','1'], a:0, why:'Four cells are non-empty: 82, Absent, 45 and 58.' },
    { q:'Does COUNTA count text?', o:['Yes','No','Only numbers','Only dates'], a:0, why:'COUNTA counts anything that is not empty.' },
    { q:'Does COUNTA count a cell that contains only a space?', o:['Yes','No','Only in tables','Only in 365'], a:0, why:'A space is content, so the cell is not empty.' },
    { q:'Which function counts empty cells?', o:['COUNTBLANK','COUNTA','COUNT','COUNTIF only'], a:0, why:'COUNTBLANK is built for empty cells.' },
    { q:'Which function counts only numbers?', o:['COUNT','COUNTA','COUNTBLANK','LEN'], a:0, why:'COUNT counts numbers only.' }
  ],
  recap:['COUNTA counts every non-empty cell.','Spaces and "" results are counted as content.','COUNTBLANK counts empty cells.']
},

/* --- max --- */
'max': {
  title:'MAX', tagline:'Return the largest number in a set.',
  prereq:['sum'],
  what:['MAX returns the highest number in the cells you give it.','It ignores text and empty cells.','It also works on dates, where the largest is the latest.'],
  why:['Find the best month, the highest score or the latest date.','Quick check for unusual values.'],
  syntax:{ code:'=MAX(number1, [number2], ...)', parts:[['number1','A cell, a range or a number.'],['number2, ...','Optional. More cells, ranges or numbers.']] },
  points:['It ignores text and empty cells.','If there are no numbers, it returns `0`.','On dates, MAX returns the latest date.','Combine with MATCH and INDEX to find **which** item has the maximum.','For a condition, use MAXIFS.'],
  mistakes:['Reading 0 as a real maximum when there were no numbers.','Numbers stored as text being ignored.','Forgetting that MAX returns the value, not the label.'],
  example:{ title:'Finding the best month', scenario:'You want the highest monthly sales figure.',
    table:withHl(MONTHS5,{'B5':'hit'},'Sheet: Sales'), task:'Find the maximum sales.', formula:'=MAX(B2:B6)',
    steps:['MAX compares 1200, 1500, 900, 1800 and 1100.','The highest value is in April.'], result:'The formula returns 1800.' },
  practice:{ q:'Write a formula that returns the name of the month with the highest sales.', table:withHl(MONTHS5,{},'Sheet: Sales'),
    hint:'Use MATCH to find the position of the maximum, then INDEX to return the month.', solution:'=INDEX(A2:A6, MATCH(MAX(B2:B6), B2:B6, 0))',
    explain:'MAX gives 1800, MATCH finds it in position 4, and INDEX returns the 4th month, Apr.' },
  interview:[
    { level:'Basic', q:'What does MAX return?', a:'The largest number in the cells given. It ignores text and empty cells.' },
    { level:'Intermediate', q:'How do you find which month has the highest sales?', a:'=INDEX(A2:A6, MATCH(MAX(B2:B6), B2:B6, 0)). MAX finds the value, MATCH finds its position and INDEX returns the month name.' },
    { level:'Intermediate', q:'What does MAX return for a range of dates?', a:'The latest date, because dates are stored as numbers.' },
    { level:'Scenario', q:'You need the highest sale for each region. What would you use?', a:'MAXIFS with the region as the condition, in Excel 2019 or later, or MAX(IF()) as an array formula in older versions.' }
  ],
  mcq:[
    { q:'What does `=MAX(B2:B6)` return for the monthly sales?', o:['1800','900','6500','1500'], a:0, why:'1800 is the highest value.' },
    { q:'What does MAX return for a range of dates?', o:['The earliest date','The latest date','The count','An error'], a:1, why:'Larger date numbers mean later dates.' },
    { q:'What does MAX return if there are no numbers?', o:['0','#N/A','#VALUE!','Blank'], a:0, why:'MAX returns 0 when it finds no numbers.' },
    { q:'Which function finds a conditional maximum?', o:['MAXIFS','MAXA only','COUNTIF','SUMIFS'], a:0, why:'MAXIFS adds conditions to MAX.' },
    { q:'Which pair finds the label of the maximum value?', o:['INDEX and MATCH','SUM and COUNT','LEFT and RIGHT','IF and AND'], a:0, why:'MATCH finds the position and INDEX returns the label.' }
  ],
  recap:['MAX returns the largest number, or the latest date.','No numbers gives 0.','Use INDEX and MATCH to find the label.']
},

/* --- min --- */
'min': {
  title:'MIN', tagline:'Return the smallest number in a set.',
  prereq:['max'],
  what:['MIN returns the lowest number in the cells you give it.','It ignores text and empty cells.','On dates, it returns the earliest date.'],
  why:['Find the weakest month, the lowest price or the earliest date.','Spot outliers at the low end.'],
  syntax:{ code:'=MIN(number1, [number2], ...)', parts:[['number1','A cell, a range or a number.'],['number2, ...','Optional. More cells, ranges or numbers.']] },
  points:['It ignores text and empty cells.','If there are no numbers, it returns `0`.','Blank cells are skipped, but zeros count, so a 0 can become the minimum.','On dates, MIN returns the earliest date.','For a condition, use MINIFS.'],
  mistakes:['A stray 0 becoming the minimum.','Reading 0 as a real minimum when there were no numbers.','Numbers stored as text being ignored.'],
  example:{ title:'Finding the weakest month', scenario:'You want the lowest monthly sales figure.',
    table:withHl(MONTHS5,{'B4':'hit'},'Sheet: Sales'), task:'Find the minimum sales.', formula:'=MIN(B2:B6)',
    steps:['MIN compares 1200, 1500, 900, 1800 and 1100.','The lowest value is in March.'], result:'The formula returns 900.' },
  practice:{ q:'Write a formula that returns the difference between the highest and lowest sales.', table:withHl(MONTHS5,{},'Sheet: Sales'),
    hint:'Subtract MIN from MAX.', solution:'=MAX(B2:B6)-MIN(B2:B6)', explain:'1800 minus 900 gives 900. This is called the range of the data.' },
  interview:[
    { level:'Basic', q:'What does MIN return?', a:'The smallest number in the cells given. It ignores text and empty cells.' },
    { level:'Intermediate', q:'Why might MIN return 0 when you expected something larger?', a:'A cell holding 0 counts as a number, so it becomes the minimum. Blank cells are skipped, but zeros are not. I check for zeros that should really be blanks.' },
    { level:'Intermediate', q:'How do you find the earliest date in a column?', a:'=MIN(A2:A100), formatted as a date, because dates are numbers and earlier dates are smaller.' },
    { level:'Scenario', q:'How would you find the lowest sale per region?', a:'MINIFS with the region as the condition in Excel 2019 or later. Older versions can use MIN(IF()) as an array formula.' }
  ],
  mcq:[
    { q:'What does `=MIN(B2:B6)` return for the monthly sales?', o:['900','1800','1100','1200'], a:0, why:'900 is the lowest value.' },
    { q:'How does MIN treat a cell containing 0?', o:['Ignores it','Counts it as a number','Shows an error','Treats it as blank'], a:1, why:'Zero is a number, so it can be the minimum.' },
    { q:'What does MIN return for a range of dates?', o:['The latest date','The earliest date','The count of dates','An error'], a:1, why:'Earlier dates are smaller numbers.' },
    { q:'Which formula gives the spread between highest and lowest?', o:['=MAX(B2:B6)-MIN(B2:B6)','=MIN(B2:B6)-MAX(B2:B6)','=SUM(B2:B6)','=COUNT(B2:B6)'], a:0, why:'Subtracting the minimum from the maximum gives the range.' },
    { q:'Which function finds a conditional minimum?', o:['MINIFS','MIN only','SUMIFS','AVERAGEIFS'], a:0, why:'MINIFS adds conditions to MIN.' }
  ],
  recap:['MIN returns the smallest number, or the earliest date.','Zeros count as numbers, blanks do not.','MAX minus MIN gives the range.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- cell-references --- */
DEEP['cell-references'] = {
  level:'Beginner',
  tldr:'A dollar sign **locks** part of a reference. Without it, Excel adjusts the reference when you copy the formula.',
  intuition:{ text:[
    'When you copy a formula, Excel does not copy the cell addresses literally. It copies the **relationship**: "the cell one to the left, two rows up". That is why a formula in row 2 that refers to B2 refers to B3 when it is copied to row 3.',
    'Sometimes that is exactly what you want, and sometimes you want one reference to stay put, such as a tax rate in a single cell. The dollar sign is how you tell Excel which parts must not move.'
  ], analogy:'Directions: "go two blocks left of where you stand" (relative) versus "go to 12 Park Street" (absolute).' },
  how:[
    'Type a formula such as `=D3*F2` in the first cell.',
    'Press **F4** inside a reference to add dollar signs: `F2`, `$F$2`, `F$2`, `$F2`.',
    'A `$` before the **column letter** locks the column. A `$` before the **row number** locks the row.',
    'Copy or drag the formula. Locked parts stay, unlocked parts move.',
    'Check one copied cell, and read its formula, before filling thousands of rows.'
  ],
  diagrams:[
    { type:'flow', arrows:['copy down one row'], panels:[
      { title:'E3 (original)', text:'=D3*$F$2', note:'D3 moves, $F$2 stays' },
      { title:'E4 (copied)', text:'=D4*$F$2', note:'Still points at the tax rate in F2' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A multiplication table with mixed references', scenario:'One formula, copied in both directions, must read the row heading from column A and the column heading from row 1.', table:withHl({rows:[['x',1,2,3],[10,10,20,30],[20,20,40,60],[30,30,60,90]]},{'B2':'hit','A2':'find','B1':'find'},'Sheet: Table (formula in B2)'),
      task:'Write the formula in B2 so it can be copied to the whole grid.', formula:'=$A2*B$1', steps:['`$A2` locks the column, so every cell reads column A, but the row moves.','`B$1` locks the row, so every cell reads row 1, but the column moves.','Copying right and down fills the grid correctly.'], result:'B2 returns 10. Copied to D4, the formula becomes =$A4*D$1 and returns 90.' },
    { level:'Business case', title:'Copying a lookup down 5,000 lines', scenario:'Each order line has a product id, and the price list sits in F2:G100. The price must be looked up for every line.', table:withHl({rows:[['Line','ProductID','Price'],[1,'P103',1499],[2,'P101',799],[3,'P105',899]]},{'C2:C4':'hit'},'Sheet: Order lines (price list in F2:G100)'),
      task:'Write the price formula so it can be copied down.', formula:'=VLOOKUP(B2, $F$2:$G$100, 2, FALSE)', steps:['`B2` is relative, so each line reads its own product id.','`$F$2:$G$100` is absolute, so the price list does not slide down with each row.'], result:'Without the dollars, row 50 would search F50:G148, miss the list and return #N/A.' }
  ],
  edge:[
    { t:'Copy versus cut', d:'Copying adjusts references. **Cutting and pasting** moves the cell and keeps its formula exactly as it was, because the cell itself has moved.' },
    { t:'Inserting rows and columns', d:'Excel updates references when you insert rows or columns, including absolute ones. A range `$A$2:$A$100` expands if you insert a row inside it.' },
    { t:'Wrong lock = quietly wrong answers', d:'A formula that locks too little gives wrong numbers with no error. Check the last copied cell, not just the first.' },
    { t:'Absolute is not "never changes"', d:'`$B$2` stays pointing at B2, but if someone deletes row 2 you get `#REF!`. Named ranges and Tables are more robust.' },
    { t:'References to other sheets', d:'`Sheet2!$B$2` locks the cell but the sheet name stays. If the sheet is renamed, Excel updates the formulas automatically.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Build a table where each cell is column heading (B1:D1 = 1, 2, 3) plus the row heading (A2:A4 = 100, 200, 300), with one formula copied in both directions.', hint:'Lock the column of the row heading and the row of the column heading.', solution:'=$A2+B$1', explain:'B2 gives 101 and D4 gives 303. If you forget a dollar, one direction will read the wrong heading.' },
    { level:'Interview', q:'You copied =VLOOKUP(A2, F2:G100, 2, FALSE) down, and from row 20 onwards the results show #N/A. What went wrong and how do you fix it?', hint:'What does the table range look like in row 20?', solution:'The table range was relative, so in row 20 it points at F20:G118 and no longer includes the top rows.\nFix: lock it: =VLOOKUP(A2, $F$2:$G$100, 2, FALSE), then copy down again.', explain:'Bugs that appear only part-way down a column are a classic sign of a missing absolute reference.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between relative, absolute and mixed references?', a:'A relative reference such as B2 changes when copied. An absolute reference such as $B$2 never changes. A mixed reference locks only the column ($B2) or only the row (B$2).',
      structure:'Define the three, give what $ locks, then one example for each.',
      follow:[ { q:'What does F4 do?', a:'It cycles a reference through the four forms while you are editing.' } ] },
    { level:'Intermediate', q:'When would you use a mixed reference?', a:'When one formula must be copied both across and down, such as a multiplication table or a matrix of totals, where the row heading must stay in one column and the column heading in one row.',
      tradeoff:'Mixed references make one formula do the job of a whole grid, but they are harder to read, so test a few cells.' },
    { level:'Scenario', q:'A tax rate is used in hundreds of formulas and changes yearly. How do you structure the workbook?', a:'Put the rate in a single input cell, give it a name such as Tax_Rate, and refer to it with an absolute reference or the name. Then changing one cell updates every formula.',
      follow:[ { q:'Why is a named range better than $F$2?', a:'It is readable, it survives layout changes better, and a formula such as =D3*Tax_Rate explains itself.' } ] }
  ],
  ref:{ headers:['Type','Example','Locks'], rows:[['Relative','`B2`','Nothing'],['Absolute','`$B$2`','Column and row'],['Mixed','`$B2`','Column only'],['Mixed','`B$2`','Row only']] },
  related:['sum','named-ranges','vlookup','excel-tables']
};

/* --- sum --- */
D('sum',{ l:'Beginner', t:'SUM adds the numbers in cells and ranges, and silently ignores text and blanks.',
  i:['A total is the most common calculation in any sheet. SUM adds everything you point at, so you never type cell addresses one by one, and it keeps working when rows change.','Its habit of skipping text and empty cells is helpful and dangerous at once: a number stored as text is skipped without any warning.'], a:'A calculator tape that ignores anything that is not a number.',
  h:['Click the cell for the total and type `=SUM(`.','Select the range, or several ranges separated by commas.','Close the bracket and press Enter. The shortcut **Alt + =** does this for the selected cells.','Check the status bar total as a quick second opinion.'],
  d:[FL(['add the numbers'],[{ title:'B2:B6', rows:[['Month','Sales'],['Jan',1200],['Feb',1500],['Mar',900],['Apr',1800],['May',1100]], hl:{1:'hit',2:'hit',3:'hit',4:'hit',5:'hit'} },{ title:'Result', text:'**6500**' }])],
  x:[X('Variation','Several separate ranges','Add January, February, April and May, skipping March.','Join two ranges with a comma.','=SUM(B2:B3, B5:B6)',['The two ranges are added together.','March (B4) is not included.'],'The formula returns 5600.',withHl(MONTHS5,{'B2:B3':'hit','B5:B6':'hit'},'Sheet: Sales')),
     X('Business case','A total that looks too low','March was pasted as text, so the total misses it.','Find and fix the problem.','=SUM(B2:B5)  ->  4500 (should be 5400)',['SUM ignores the text "900".','Convert the cell to a number (Text to Columns, or VALUE), and the total corrects itself.'],'Always compare a SUM against a second source, such as a pivot or the status bar count.',withHl({rows:[['Month','Sales'],['Jan',1200],['Feb',1500],['Mar','900 (text)'],['Apr',1800]]},{'B4':'miss'},'Sheet: Sales'))],
  e:[['Numbers stored as text','They look right but are skipped. Use ISNUMBER to test, and VALUE or Text to Columns to convert.'],['Errors spread','One #N/A in the range makes the whole SUM an error. `AGGREGATE(9, 6, range)` ignores errors.'],['Filtered and hidden rows','SUM still adds them. Use SUBTOTAL(109, range) for visible rows.'],['Ranges that stop short','Rows added below are not included. Use an Excel Table or a whole-column reference.']],
  p:[P('Medium','Add the sales for January to March only.','Which cells are Jan to Mar?','=SUM(B2:B4)','1200 + 1500 + 900 gives 3600.',withHl(MONTHS5,{},'Sheet: Sales')),
     P('Interview','A SUM is lower than the pivot table total. List causes in order.','Think data types and ranges.','1. Numbers stored as text.\n2. Range does not cover all rows.\n3. Hidden duplicates or filters.\n4. Errors elsewhere.','A checklist from cheapest to least likely shows a systematic approach.')],
  q:[Q('Basic','What does SUM do with text and blank cells?','It ignores them and adds only numbers. That is why a number stored as text is not added.',{ f:[['How do you check?','ISNUMBER on the cell, or compare the status bar total with the formula.']] }),
     Q('Scenario','Your monthly total ignores the newest rows. How do you prevent that?','Convert the data to an Excel Table and use =SUM(tblSales[Sales]), which grows with the table.',{ t:'Whole-column references also work but are less precise.' })],
  r:RT(['Need','Formula'],[['Total','`=SUM(B2:B6)`'],['Two ranges','`=SUM(B2:B3, B5:B6)`'],['Quick sum','`Alt + =`'],['Visible rows only','`=SUBTOTAL(109, B2:B6)`']]), rel:['average','sumif','subtotal','excel-tables'] });

/* --- average --- */
D('average',{ l:'Beginner', t:'AVERAGE divides the total by the count of numbers. Blanks are skipped, zeros are counted.',
  i:['An average summarises many numbers with one typical value. Excel adds the numbers and divides by how many there are.','The detail that trips people is the denominator: it counts numbers only. A blank cell does not count, but a cell containing 0 does, and it pulls the average down.'], a:'Sharing a bill equally among the people who actually ate.',
  h:['Select the range with the numbers.','Write `=AVERAGE(range)`.','Excel adds the numbers and divides by the count of numeric cells.','Look at the maximum and minimum too, since an average can hide outliers.'],
  d:[FL(['total / count'],[{ title:'Values', rows:[['Sales'],[1200],[1500],[900],[1800],[1100]] },{ title:'6500 / 5', text:'**1300**' }])],
  x:[X('Variation','A zero that is really "closed"','March was closed, and a 0 was typed instead of leaving it blank.','Average only the open months.','=AVERAGEIF(B2:B6, ">0")',['AVERAGE would include the 0 and give 1120.','AVERAGEIF ignores it and averages the other four months.'],'1120 with the zero, 1400 without. Decide which is the truth for the business.',withHl({rows:[['Month','Sales'],['Jan',1200],['Feb',1500],['Mar',0],['Apr',1800],['May',1100]]},{'B4':'miss'},'Sheet: Sales')),
     X('Business case','Average of averages','Two branches report average order values. Can you average them?','Calculate the correct overall average.','=SUMPRODUCT(avg, orders) / SUM(orders)',['A simple average of averages ignores how many orders each branch had.','Weight each average by its order count.'],'Branch A: 100 orders at 50, branch B: 300 orders at 70. The correct average is 65, not 60.')],
  e:[['Blank versus zero','Blanks are skipped, zeros are counted. Be explicit about which one a missing value should be.'],['Text numbers are ignored','Like SUM, AVERAGE skips text, so the count of values is smaller than expected.'],['#DIV/0!','If there are no numbers at all, there is nothing to divide. Wrap with IFERROR.'],['Outliers','One very large value pulls the mean. Check MEDIAN, MIN and MAX before reporting.']],
  p:[P('Medium','Average the last three months (Mar to May).','Which cells?','=AVERAGE(B4:B6)','(900 + 1800 + 1100) / 3 is 1266.67.',withHl(MONTHS5,{},'Sheet: Sales')),
     P('Interview','Why can an average mislead, and what would you show alongside it?','Think distribution.','Outliers and skew distort the mean. Show the median, the minimum and maximum, and the count.','Showing spread as well as centre is the mark of a careful analyst.')],
  q:[Q('Basic','How does AVERAGE treat blank cells and zeros?','It skips blanks and text, but counts zeros as real values.',{ f:[['How do you ignore zeros?','AVERAGEIF(range, ">0").']] }),
     Q('Intermediate','Is the average of group averages the overall average?','Only when the groups are the same size. Otherwise weight by group size with SUMPRODUCT or compute total divided by count.',{ t:'The simple version is wrong most often when groups differ in size.' })],
  r:RT(['Need','Formula'],[['Mean','`=AVERAGE(range)`'],['Ignore zeros','`=AVERAGEIF(range, ">0")`'],['Conditional mean','`=AVERAGEIFS(...)`'],['Weighted mean','`=SUMPRODUCT(v, w) / SUM(w)`']]), rel:['sum','averageif','large','sumproduct'] });

/* --- count --- */
D('count',{ l:'Beginner', t:'COUNT counts the cells that hold numbers (including dates). Text, errors and blanks are not counted.',
  i:['COUNT answers "how many numeric values do I have?". It is the quickest check that a column is really numeric.','Comparing COUNT with COUNTA tells you how many cells hold something that is not a number, which is often the first sign of dirty data.'], a:'A turnstile that only clicks for tickets (numbers), not for visitors holding something else.',
  h:['Write `=COUNT(range)`.','Excel counts cells that contain numbers or dates.','Compare with `=COUNTA(range)` to see how many non-empty cells are not numbers.','Investigate the difference.'],
  d:[FL(['numbers only'],[{ title:'Marks', rows:[['Marks'],[82],['Absent'],[45],[''],[58]], hl:{1:'hit',3:'hit',5:'hit',2:'miss'} },{ title:'COUNT', text:'**3**' }])],
  x:[X('Variation','Dates are numbers','A column holds order dates. How many valid dates are there?','Count the dates.','=COUNT(A2:A100)',['Dates are stored as numbers, so COUNT includes them.','Text dates such as "15/08/2026" typed as text are not counted.'],'A low count compared with the rows is a sign that some dates are text.'),
     X('Business case','Finding the non-numeric entries','A marks column should be numeric, but some cells say Absent.','Count the entries that are not numbers.','=COUNTA(B2:B6) - COUNT(B2:B6)',['COUNTA counts all non-empty cells (4).','COUNT counts the numbers (3).'],'The difference, 1, is the Absent entry.',withHl(ATTEND,{'B3':'miss'},'Sheet: Marks'))],
  e:[['Numbers stored as text','They are not counted. A count lower than expected is the clue.'],['Logical values','TRUE and FALSE typed into cells are not counted, but ones passed directly in the formula are.'],['Errors','Error values are not counted.'],['Blank versus ""','A formula returning "" is text, so COUNT skips it and COUNTA counts it.']],
  p:[P('Medium','Count how many marks are above 50.','Conditions need another function.','=COUNTIF(B2:B6, ">50")','Only COUNTIF counts by a condition. COUNT has none. Here 82 and 58 qualify: 2.',withHl(ATTEND,{},'Sheet: Marks')),
     P('Interview','A column should have 1,000 numbers but COUNT returns 940. How do you find the rest?','Compare with COUNTA and filter.','1. COUNTA to see how many cells are filled.\n2. Filter by text, or use ISNUMBER in a helper column.\n3. Fix text numbers and dates.','The process, not the cause, is the answer.')],
  q:[Q('Basic','What is the difference between COUNT, COUNTA and COUNTIF?','COUNT counts numbers, COUNTA counts non-empty cells, COUNTIF counts cells meeting a condition.',{ f:[['Does COUNT count dates?','Yes, dates are numbers.']] }),
     Q('Scenario','How do you check that a column is fully numeric?','Compare =COUNT(range) with =COUNTA(range). If they differ, some entries are text.',{ t:'It does not catch numbers stored as text that look numeric: use ISNUMBER on a sample.' })],
  r:RT(['Function','Counts'],[['`COUNT`','Numbers and dates'],['`COUNTA`','All non-empty cells'],['`COUNTBLANK`','Empty cells'],['`COUNTIF`','Cells meeting a condition']]), rel:['counta','countif','sum','is-null'] });

/* --- counta --- */
D('counta',{ l:'Beginner', t:'COUNTA counts every cell that is not empty, whatever it contains.',
  i:['COUNTA is the "how many rows are filled?" function. It counts numbers, text, dates and even errors, and only skips cells that are truly empty.','That includes a cell with a single space and a formula returning an empty string, which look blank but are not.'], a:'Counting occupied seats in a theatre, whoever is sitting there.',
  h:['Choose a column that is always filled, such as an ID.','Write `=COUNTA(A2:A1000)`.','Subtract 1 if the range includes the header.','Use `COUNTBLANK` to count the empty cells instead.'],
  d:[FL(['non-empty'],[{ title:'Marks column', rows:[['Marks'],[82],['Absent'],[45],[''],[58]], hl:{1:'hit',2:'hit',3:'hit',5:'hit',4:'miss'} },{ title:'COUNTA', text:'**4**' }])],
  x:[X('Variation','Counting the empty cells','How many students have no entry?','Use COUNTBLANK.','=COUNTBLANK(B2:B6)',['COUNTBLANK counts empty cells and cells showing "".'],'The result is 1 (Deepak).',withHl(ATTEND,{'B5':'miss'},'Sheet: Marks')),
     X('Business case','How many rows of data do I have?','A data sheet grows every day, and a dashboard cell must show the row count.','Count the IDs.','=COUNTA(A2:A10000)',['An ID column is always filled, so it counts the rows.','Using a Table: =ROWS(tblSales).'],'The count updates as rows are added.')],
  e:[['Spaces count','A cell holding only a space is not empty, so COUNTA counts it.'],['Formulas returning ""','They are counted by COUNTA, but COUNTBLANK also counts them as blank.'],['Include the header?','A range starting at the header adds 1 to the count.'],['Errors are counted','COUNTA counts #N/A and other errors as content.']],
  p:[P('Medium','Count the non-numeric entries in the marks column.','COUNTA minus COUNT.','=COUNTA(B2:B6) - COUNT(B2:B6)','4 non-empty minus 3 numbers is 1 (Absent).',withHl(ATTEND,{},'Sheet: Marks')),
     P('Interview','COUNTA shows 105 but you see only 100 names. What could be wrong?','Invisible content.','Spaces, formulas returning "", or leftover characters in blank-looking cells. Check with LEN, use TRIM, or filter for non-blanks.','Hidden content is the usual cause.')],
  q:[Q('Basic','What does COUNTA count?','Every non-empty cell, including text, numbers, dates and errors.',{ f:[['How do you count blanks?','COUNTBLANK.']] }),
     Q('Scenario','How do you count the rows in a growing list?','COUNTA on an always-filled column, or ROWS on a Table column, which expands automatically.',{ t:'COUNTA on a whole column includes the header and anything below the data.' })],
  r:RT(['Function','Counts'],[['`COUNTA`','Non-empty cells'],['`COUNTBLANK`','Empty cells'],['`COUNT`','Numbers'],['`ROWS(tbl)`','Rows of a table']]), rel:['count','countif','excel-tables','trim'] });

/* --- max --- */
D('max',{ l:'Beginner', t:'MAX returns the largest number, or the latest date. Pair it with MATCH and INDEX to find who or when.',
  i:['MAX answers "what is the highest?". It ignores text and blanks, and works on dates too, where the largest date is the latest.','It returns the value, not the label. To find which month or person holds it, combine it with MATCH and INDEX.'], a:'Reading the top of a leaderboard.',
  h:['Write `=MAX(range)`.','Excel compares all numbers in the range.','It returns the largest one (0 if there are no numbers).','To find the label, use `INDEX(labels, MATCH(MAX(values), values, 0))`.'],
  d:[FL(['largest'],[{ title:'Sales', rows:[['Month','Sales'],['Jan',1200],['Feb',1500],['Mar',900],['Apr',1800],['May',1100]], hl:{4:'hit'} },{ title:'MAX', text:'**1800**' }])],
  x:[X('Variation','The latest date','A list of order dates needs the most recent one.','Take the MAX of the date column.','=MAX(A2:A100)',['Dates are numbers, so larger means later.','Format the result as a date.'],'The formula returns the latest order date.'),
     X('Business case','Which month was the best?','A report must show the month name, not only the number.','Combine MAX, MATCH and INDEX.','=INDEX(A2:A6, MATCH(MAX(B2:B6), B2:B6, 0))',['MAX gives 1800.','MATCH finds it at position 4.','INDEX returns the 4th month.'],'The formula returns Apr.',withHl(MONTHS5,{'B5':'hit','A5':'hit'},'Sheet: Sales'))],
  e:[['No numbers returns 0','An empty range gives 0, which can look like a real maximum.'],['Text numbers are ignored','A value stored as text is skipped, so the maximum may be wrong.'],['Ties','MATCH returns the first of tied maximums. Decide how to handle ties.'],['Conditional maximum','Use MAXIFS (2019+) or MAX(IF(...)) as an array formula.']],
  p:[P('Medium','Return the highest sales and the month it happened in one sentence, such as "Apr: 1800".','Join INDEX/MATCH with MAX.','=INDEX(A2:A6, MATCH(MAX(B2:B6), B2:B6, 0)) & ": " & MAX(B2:B6)','The text and number are joined with &.',withHl(MONTHS5,{},'Sheet: Sales')),
     P('Interview','How do you find the maximum for each region?','Think MAXIFS and compatibility.','MAXIFS(sales, region, x) in Excel 2019 and later. Earlier: =MAX(IF(region=x, sales)) entered as an array formula, or a pivot table with Max.','Naming both versions shows practical range.')],
  q:[Q('Basic','What does MAX do with dates?','It returns the latest date, since dates are stored as numbers.',{ f:[['What if the range has no numbers?','It returns 0.']] }),
     Q('Intermediate','How do you find the name that goes with the highest value?','INDEX(names, MATCH(MAX(values), values, 0)).',{ t:'With ties, only the first name is returned.' })],
  r:RT(['Need','Formula'],[['Highest','`=MAX(range)`'],['Latest date','`=MAX(dates)`'],['Name of the highest','`=INDEX(names, MATCH(MAX(v), v, 0))`'],['By condition','`=MAXIFS(...)`']]), rel:['min','large','maxifs','index-match'] });

/* --- min --- */
D('min',{ l:'Beginner', t:'MIN returns the smallest number, or the earliest date. A stray zero can hide the real minimum.',
  i:['MIN is the mirror of MAX. It finds the lowest price, the earliest date or the weakest month, and ignores text and blanks.','The trap is zero: a placeholder 0 is a number, so it becomes the minimum. Decide whether zeros mean "none" or "missing" before you trust the result.'], a:'The bottom row of a league table.',
  h:['Write `=MIN(range)`.','Excel compares all numbers in the range.','It returns the smallest (0 if there are no numbers).','To ignore zeros, use `MINIFS(range, range, ">0")`.'],
  d:[FL(['smallest'],[{ title:'Sales', rows:[['Month','Sales'],['Jan',1200],['Feb',1500],['Mar',900],['Apr',1800],['May',1100]], hl:{3:'hit'} },{ title:'MIN', text:'**900**' }])],
  x:[X('Variation','Ignoring placeholder zeros','Unsold products have a 0 price, but the cheapest real price is wanted.','Use MINIFS with a condition.','=MINIFS(B2:B10, B2:B10, ">0")',['MIN would return 0.','MINIFS (Excel 2019+) restricts to positive values.'],'The cheapest priced product is found, not the placeholder.'),
     X('Business case','The range of a data set','A QA check needs the spread between highest and lowest.','Subtract MIN from MAX.','=MAX(B2:B6) - MIN(B2:B6)',['MAX is 1800 and MIN is 900.'],'The spread is 900. A very large spread flags outliers worth checking.',withHl(MONTHS5,{},'Sheet: Sales'))],
  e:[['Zero beats everything','A 0 placeholder becomes the minimum. Use MINIFS or clean the data.'],['No numbers returns 0','An empty range gives 0, which is misleading.'],['Text numbers are ignored','A value stored as text is skipped.'],['Dates','MIN of dates is the earliest date; format the result as a date.']],
  p:[P('Medium','Return the earliest date in A2:A100.','MIN on dates.','=MIN(A2:A100)','Format the cell as a date, or you will see a serial number.'),
     P('Interview','A minimum shows 0 but no product costs 0. What do you check?','Blank-looking zeros.','Cells containing 0 or formulas returning 0 for blanks. Use MINIFS(...,">0") or fix the formulas to return "" for blanks.','Understanding that 0 is a value is the key.')],
  q:[Q('Basic','What does MIN return for an empty range?','0, which can mislead.',{ f:[['How do you guard against it?','Check COUNT(range)>0 first, or use IF.']] }),
     Q('Scenario','How do you find the lowest non-zero value?','MINIFS(range, range, ">0") in Excel 2019 and later, or an array formula MIN(IF(range>0, range)) in older versions.',{ t:'MINIFS is clearer, but needs a newer version.' })],
  r:RT(['Need','Formula'],[['Lowest','`=MIN(range)`'],['Earliest date','`=MIN(dates)`'],['Lowest above 0','`=MINIFS(r, r, ">0")`'],['Spread','`=MAX(r) - MIN(r)`']]), rel:['max','small','minifs','round'] });
})();
