/* Datapath | Excel | Math and ranking
 * Lessons in this file: round, rank, large, small, sumproduct, subtotal
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
  const { SALESLOG, MONTHS5, RANKS, COSTS, BASKET } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- round --- */
'round': {
  title:'ROUND', tagline:'Round a number to the number of digits you choose.',
  prereq:['sum'],
  what:['ROUND changes a number to a set number of decimal places.','It rounds half up: 2.5 becomes 3, and 12.345 to 2 places becomes 12.35.','It changes the **value**, not just how it looks.'],
  why:['Prices and money amounts need two decimals.','Rounding avoids tiny differences when totals are compared.'],
  syntax:{ code:'=ROUND(number, num_digits)', parts:[['number','The number or cell to round.'],['num_digits','How many decimal places to keep. Use 0 for whole numbers and a negative number to round to tens, hundreds and so on.']] },
  points:['`ROUND(12.678, 2)` gives 12.68.','`ROUND(12.678, 0)` gives 13.','`ROUND(1234, -2)` gives 1200.','`ROUNDUP` always rounds away from zero and `ROUNDDOWN` always towards zero.','Formatting hides decimals but keeps them in the cell; ROUND really removes them.'],
  mistakes:['Using number formatting when the real value needs rounding.','Rounding each item and then summing, which can differ from rounding the total.','Mixing up the sign of num_digits.'],
  example:{ title:'Rounding costs to two decimals', scenario:'Costs have three decimals but invoices need two.',
    table:withHl(COSTS,{'B2':'find','C2':'hit'},'Sheet: Costs'), task:'Round the cost of product A.', formula:'=ROUND(B2, 2)',
    steps:['B2 is 12.678.','Two decimals keeps 12.67 and looks at the next digit, 8.','8 is 5 or more, so the result rounds up.'], result:'The formula returns 12.68.' },
  practice:{ q:'Round 1234 to the nearest hundred.', hint:'Use a negative number of digits.', solution:'=ROUND(1234, -2)', explain:'A negative num_digits rounds to the left of the decimal point. -2 means hundreds, so 1234 becomes 1200.' },
  interview:[
    { level:'Basic', q:'What is the difference between ROUND and formatting a cell to two decimals?', a:'Formatting only changes how the number looks, while the cell keeps the full value. ROUND changes the stored value, so later calculations use the rounded number.' },
    { level:'Intermediate', q:'What do ROUNDUP and ROUNDDOWN do?', a:'ROUNDUP rounds away from zero and ROUNDDOWN rounds towards zero, whatever the next digit is.' },
    { level:'Intermediate', q:'What does a negative num_digits do?', a:'It rounds to the left of the decimal point. ROUND(1234,-2) gives 1200 and ROUND(1234,-3) gives 1000.' },
    { level:'Scenario', q:'An invoice total is off by 0.01 compared with the sum of its lines. What do you check?', a:'Whether each line was rounded separately or only displayed with two decimals. I decide on one rule, usually rounding each line with ROUND, and apply it consistently.' }
  ],
  mcq:[
    { q:'What does `=ROUND(12.678, 2)` return?', o:['12.68','12.67','12.7','13'], a:0, why:'The third decimal, 8, rounds the second decimal up.' },
    { q:'What does `=ROUND(1234, -2)` return?', o:['1200','1230','1300','1000'], a:0, why:'-2 rounds to the nearest hundred.' },
    { q:'Which function always rounds away from zero?', o:['ROUNDUP','ROUNDDOWN','ROUND','INT'], a:0, why:'ROUNDUP always moves away from zero.' },
    { q:'Does number formatting change the cell value?', o:['Yes','No, it only changes the display','Only for decimals','Only for dates'], a:1, why:'Formatting changes the display, not the stored value.' },
    { q:'What does `=ROUND(2.5, 0)` return?', o:['2','3','2.5','4'], a:1, why:'Excel rounds half away from zero, so 2.5 becomes 3.' }
  ],
  recap:['ROUND changes the stored value; formatting only changes the display.','num_digits: positive for decimals, 0 for whole, negative for tens and hundreds.','ROUNDUP and ROUNDDOWN force the direction.']
},

/* --- rank --- */
'rank': {
  title:'RANK', tagline:'Show the position of a value within a list.',
  prereq:['cell-references'],
  what:['RANK tells you the position of a number in a list: 1 is the highest (or lowest).','Tied values get the same rank, and the next rank is skipped.','Modern Excel uses RANK.EQ, which behaves the same way.'],
  why:['Rank students, salespeople, products or branches.','Interviews often ask how ties are handled.'],
  syntax:{ code:'=RANK.EQ(number, ref, [order])', parts:[['number','The value to rank.'],['ref','The list of numbers to compare against.'],['order','0 or omitted: largest is rank 1. Any other number: smallest is rank 1.']] },
  points:['`RANK` still works for old files; `RANK.EQ` is the current name.','Lock the list with `$`, so it stays fixed when copied down.','Ties share a rank: two people ranked 2 are followed by rank 4.','Order 0 ranks high to low; order 1 ranks low to high.','`RANK.AVG` gives tied values the average of their ranks.'],
  mistakes:['Not locking the ref range.','Expecting rank 3 after a tie for rank 2.','Using the wrong order for the job, such as ranking times high to low.'],
  example:{ title:'Ranking students by marks', scenario:'Five students have marks. Asha and Esha both scored 82.',
    table:withHl(RANKS,{'B2':'find','B2:B6':'range','C2':'hit'},'Sheet: Marks'), task:'Rank Asha among all students, highest first.', formula:'=RANK.EQ(B2, $B$2:$B$6, 0)',
    steps:['91 (Deepak) is rank 1.','Asha and Esha tie at 82, so both get rank 2.','The next score, 67, gets rank 4, because rank 3 is skipped.'], result:'The formula returns 2 for Asha.' },
  practice:{ q:'Write a formula for row 2 that ranks the marks with the **lowest** mark as rank 1, and can be copied down.', table:withHl(RANKS,{},'Sheet: Marks'),
    hint:'Set the order argument to 1 and lock the list.', solution:'=RANK.EQ(B2, $B$2:$B$6, 1)', explain:'With order 1, 45 is rank 1 and 91 is rank 5. For Asha (82), the two 82s share rank 3.' },
  interview:[
    { level:'Basic', q:'What does RANK do?', a:'RANK returns the position of a number in a list. By default the largest value gets rank 1.' },
    { level:'Intermediate', q:'How are ties handled in RANK?', a:'Tied values share the same rank, and the following rank is skipped. Two values tied at rank 2 are followed by rank 4. RANK.AVG would give both the average rank, 2.5.' },
    { level:'Intermediate', q:'Why do you lock the ref range when copying RANK down?', a:'The list must stay the same for every row. Without dollar signs the range shifts down and the ranks become wrong.' },
    { level:'Scenario', q:'How do you rank without gaps after ties?', a:'I use a dense rank formula such as =SUMPRODUCT(($B$2:$B$6>B2)/COUNTIF($B$2:$B$6,$B$2:$B$6))+1. It counts each higher distinct value once, so tied values share a rank and no rank is skipped.' }
  ],
  mcq:[
    { q:'What does `=RANK.EQ(82, B2:B6, 0)` mean for the marks list?', o:['Rank of 82, highest first','Rank of 82, lowest first','Count of 82','Sum of 82'], a:0, why:'Order 0 ranks from highest to lowest.' },
    { q:'Two students tie at rank 2. What rank does the next student get?', o:['3','4','2','5'], a:1, why:'Rank 3 is skipped after a tie for rank 2.' },
    { q:'What does an order of 1 do?', o:['Smallest is rank 1','Largest is rank 1','Skips ties','Removes ranks'], a:0, why:'Any non-zero order ranks ascending.' },
    { q:'Why use `$B$2:$B$6` in the ref argument?', o:['To keep the list fixed when copied','To sort the list','To hide the list','To round the list'], a:0, why:'Absolute references keep the range the same on every row.' },
    { q:'Which function gives tied values the average rank?', o:['RANK.AVG','RANK.EQ','LARGE','COUNT'], a:0, why:'RANK.AVG averages the tied ranks.' }
  ],
  recap:['RANK.EQ returns the position, with 1 as the highest by default.','Ties share a rank and the next rank is skipped.','Always lock the list with $ before copying down.']
},

/* --- large --- */
'large': {
  title:'LARGE', tagline:'Return the 1st, 2nd, 3rd, ... largest value in a list.',
  prereq:['max'],
  what:['LARGE returns the k-th largest number.','LARGE(range, 1) is the same as MAX.','LARGE(range, 2) is the second largest.'],
  why:['Top 3 sales, top 5 scores, second highest salary.','A common interview question: "find the second highest value".'],
  syntax:{ code:'=LARGE(array, k)', parts:[['array','The range of numbers.'],['k','The position from the top: 1 is the largest, 2 the second largest, and so on.']] },
  points:['`k = 1` is the maximum.','Duplicates count separately: if two values are equal, both are used.','If k is bigger than the number of values, it returns `#NUM!`.','Combine with INDEX and MATCH to return the label of the k-th largest.','`SMALL` is the opposite.'],
  mistakes:['Using k = 0, which gives #NUM!.','Not expecting duplicates to appear twice.','Returning the value when the label was needed.'],
  example:{ title:'Second highest sales', scenario:'You want the second best month.',
    table:withHl(MONTHS5,{'B3':'hit','B2:B6':'range'},'Sheet: Sales'), task:'Find the second largest sales value.', formula:'=LARGE(B2:B6, 2)',
    steps:['Sorted from largest: 1800, 1500, 1200, 1100, 900.','The 2nd largest is 1500.'], result:'The formula returns 1500.' },
  practice:{ q:'Write a formula that returns the sum of the top 3 sales values.', table:withHl(MONTHS5,{},'Sheet: Sales'),
    hint:'Add LARGE for k = 1, 2 and 3. An array constant such as {1,2,3} also works with SUM.', solution:'=LARGE(B2:B6,1)+LARGE(B2:B6,2)+LARGE(B2:B6,3)',
    explain:'1800 + 1500 + 1200 = 4500. The shorter form is =SUM(LARGE(B2:B6,{1,2,3})).' },
  interview:[
    { level:'Basic', q:'What does LARGE do?', a:'LARGE returns the k-th largest value in a range. LARGE(range,1) is the maximum and LARGE(range,2) is the second largest.' },
    { level:'Intermediate', q:'How do you find the second highest value in a column?', a:'=LARGE(B2:B100, 2). If the maximum appears twice, LARGE counts both, so the result can equal the maximum. To skip duplicates I would use UNIQUE first.' },
    { level:'Intermediate', q:'What error appears if k is larger than the list?', a:'#NUM!. For example, asking for the 6th largest in a list of 5 values.' },
    { level:'Scenario', q:'You need the names of the top 3 salespeople. How?', a:'=INDEX(names, MATCH(LARGE(sales, 1), sales, 0)) for the first, and the same with k = 2 and 3. If sales can tie, I handle duplicates separately or use SORT in newer Excel.' }
  ],
  mcq:[
    { q:'What does `=LARGE(B2:B6, 2)` return for the monthly sales?', o:['1500','1800','1200','900'], a:0, why:'The second largest value is 1500.' },
    { q:'LARGE(range, 1) is the same as:', o:['MAX','MIN','AVERAGE','COUNT'], a:0, why:'The first largest is the maximum.' },
    { q:'What error appears when k is greater than the number of values?', o:['#NUM!','#N/A','#DIV/0!','#REF!'], a:0, why:'There is no k-th value to return.' },
    { q:'Which function returns the k-th smallest?', o:['SMALL','SMALLEST','LOW','MINK'], a:0, why:'SMALL is the opposite of LARGE.' },
    { q:'If two values are equal, how does LARGE treat them?', o:['As separate values','As one value','It ignores both','It shows an error'], a:0, why:'Duplicates each take a position.' }
  ],
  recap:['LARGE returns the k-th largest value.','k = 1 is MAX; duplicates count separately.','Combine with INDEX and MATCH for the label.']
},

/* --- small --- */
'small': {
  title:'SMALL', tagline:'Return the 1st, 2nd, 3rd, ... smallest value in a list.',
  prereq:['large'],
  what:['SMALL returns the k-th smallest number.','SMALL(range, 1) is the same as MIN.','It is the mirror image of LARGE.'],
  why:['Bottom 3 sales, lowest scores, second cheapest price.','Used with LARGE to build top and bottom lists.'],
  syntax:{ code:'=SMALL(array, k)', parts:[['array','The range of numbers.'],['k','The position from the bottom: 1 is the smallest, 2 the second smallest, and so on.']] },
  points:['`k = 1` is the minimum.','Duplicates count separately.','k larger than the count gives `#NUM!`.','Blank cells and text are ignored.','Combine with INDEX and MATCH to return labels.'],
  mistakes:['Confusing the k-th smallest with the k-th largest.','Using k = 0.','Zeros being counted as the smallest values.'],
  example:{ title:'Second lowest sales', scenario:'You want the second weakest month.',
    table:withHl(MONTHS5,{'B6':'hit','B2:B6':'range'},'Sheet: Sales'), task:'Find the second smallest sales value.', formula:'=SMALL(B2:B6, 2)',
    steps:['Sorted from smallest: 900, 1100, 1200, 1500, 1800.','The 2nd smallest is 1100.'], result:'The formula returns 1100.' },
  practice:{ q:'Write a formula that returns the average of the two lowest sales values.', table:withHl(MONTHS5,{},'Sheet: Sales'),
    hint:'Average SMALL for k = 1 and 2.', solution:'=AVERAGE(SMALL(B2:B6,1), SMALL(B2:B6,2))', explain:'(900 + 1100) divided by 2 gives 1000.' },
  interview:[
    { level:'Basic', q:'What does SMALL do?', a:'SMALL returns the k-th smallest value in a range. SMALL(range,1) is the minimum.' },
    { level:'Intermediate', q:'How do you find the second lowest salary in a column?', a:'=SMALL(B2:B100, 2). Duplicates of the lowest value count as separate values, so I check the data if ties are possible.' },
    { level:'Intermediate', q:'What is the difference between SMALL and MIN?', a:'MIN gives only the smallest value. SMALL can give the smallest, second smallest, third smallest and so on.' },
    { level:'Scenario', q:'Build a bottom-3 report of sales. How?', a:'Use SMALL with k = 1, 2 and 3 for the values, and INDEX with MATCH to get the names, taking care of ties.' }
  ],
  mcq:[
    { q:'What does `=SMALL(B2:B6, 2)` return for the monthly sales?', o:['1100','900','1200','1500'], a:0, why:'Sorted ascending: 900, 1100, ... so the second smallest is 1100.' },
    { q:'SMALL(range, 1) is the same as:', o:['MIN','MAX','AVERAGE','LARGE(range,1)'], a:0, why:'The first smallest value is the minimum.' },
    { q:'Which error appears when k is larger than the list?', o:['#NUM!','#N/A','#VALUE!','#NAME?'], a:0, why:'There is no k-th value.' },
    { q:'Which pair builds a top and bottom report?', o:['LARGE and SMALL','SUM and AVERAGE','LEFT and RIGHT','IF and AND'], a:0, why:'LARGE gives the top values and SMALL gives the bottom values.' },
    { q:'Do text cells count in SMALL?', o:['No, they are ignored','Yes','Only with quotes','As zero'], a:0, why:'Text and blank cells are ignored.' }
  ],
  recap:['SMALL returns the k-th smallest value.','k = 1 is MIN; duplicates count separately.','Use it with LARGE for top and bottom lists.']
},

/* --- sumproduct --- */
'sumproduct': {
  title:'SUMPRODUCT', tagline:'Multiply matching values in lists, then add the results.',
  prereq:['sum'],
  what:['SUMPRODUCT multiplies items in two or more ranges row by row.','Then it adds all the products.','It replaces a helper column of multiplications.'],
  why:['Total revenue = quantity times price, summed.','Weighted averages, and conditional sums with several conditions.'],
  syntax:{ code:'=SUMPRODUCT(array1, [array2], ...)', parts:[['array1','The first range of numbers.'],['array2, ...','More ranges. They must be the same size as array1.']] },
  points:['Ranges must be the **same size**, or the result is `#VALUE!`.','Text in a range is treated as 0.','Weighted average: `=SUMPRODUCT(values, weights)/SUM(weights)`.','Conditional totals: `=SUMPRODUCT((B2:B9="North")*(D2:D9))`.','It works in all Excel versions without Ctrl+Shift+Enter.'],
  mistakes:['Ranges of different sizes.','Joining arrays with commas when conditions need `*`.','Including the header row.'],
  example:{ title:'Total value of a basket', scenario:'A basket has quantities and prices. You want the total value without a helper column.',
    table:withHl(BASKET,{'B2:C4':'range'},'Sheet: Basket'), task:'Find the total value.', formula:'=SUMPRODUCT(B2:B4, C2:C4)',
    steps:['Pen: 5 x 10 = 50.','Book: 2 x 60 = 120.','Bag: 1 x 500 = 500. Then 50 + 120 + 500.'], result:'The formula returns 670.' },
  practice:{ q:'Write a formula for the weighted average price, where the quantity is the weight.', table:withHl(BASKET,{},'Sheet: Basket'),
    hint:'Divide SUMPRODUCT of price and quantity by SUM of quantity.', solution:'=SUMPRODUCT(B2:B4, C2:C4)/SUM(B2:B4)', explain:'670 divided by 8 items gives about 83.75.' },
  interview:[
    { level:'Basic', q:'What does SUMPRODUCT do?', a:'It multiplies the matching items in the given ranges and then adds the results. For quantity and price columns, it gives the total value in one formula.' },
    { level:'Intermediate', q:'How do you calculate a weighted average?', a:'=SUMPRODUCT(values, weights)/SUM(weights). For example, marks multiplied by credit weights, divided by the total weight.' },
    { level:'Intermediate', q:'What happens if the ranges have different sizes?', a:'SUMPRODUCT returns #VALUE!. All arrays must have the same dimensions.' },
    { level:'Scenario', q:'How would you use SUMPRODUCT to sum sales for North in Electronics?', a:'=SUMPRODUCT((B2:B9="North")*(C2:C9="Electronics")*D2:D9). Each condition gives TRUE or FALSE, which become 1 or 0 when multiplied, so only matching rows add up. SUMIFS is simpler when it is available.' }
  ],
  mcq:[
    { q:'What does `=SUMPRODUCT(B2:B4, C2:C4)` return for the basket?', o:['670','560','8','500'], a:0, why:'50 + 120 + 500 = 670.' },
    { q:'What do the ranges in SUMPRODUCT need?', o:['The same size','Different sizes','Text only','Dates only'], a:0, why:'Different sizes give #VALUE!.' },
    { q:'Which formula gives a weighted average?', o:['=SUMPRODUCT(v,w)/SUM(w)','=SUM(v)/SUM(w)','=AVERAGE(v)','=MAX(v)*w'], a:0, why:'Sum of value times weight, divided by the sum of weights.' },
    { q:'How is text in a SUMPRODUCT range treated?', o:['As 0','As 1','As an error','It is deleted'], a:0, why:'Non-numeric entries count as zero.' },
    { q:'What does multiplying conditions like (B2:B9="North")*(...) do?', o:['Turns them into 1s and 0s','Sorts the data','Counts text','Deletes rows'], a:0, why:'TRUE becomes 1 and FALSE becomes 0, so only matching rows contribute.' }
  ],
  recap:['SUMPRODUCT multiplies matching items and adds the results.','Ranges must be the same size.','It builds weighted averages and multi-condition sums.']
},

/* --- subtotal --- */
'subtotal': {
  title:'SUBTOTAL', tagline:'Calculate a total that follows your filters.',
  prereq:['sum','average'],
  what:['SUBTOTAL runs SUM, AVERAGE, COUNT, MAX or MIN on a range.','It **ignores rows hidden by a filter**.','It also ignores other SUBTOTAL results inside the range.'],
  why:['Totals that change when you filter a list.','Reports where the total must match what is visible.'],
  syntax:{ code:'=SUBTOTAL(function_num, ref1, [ref2], ...)', parts:[['function_num','Which calculation: 9 sum, 1 average, 2 count, 3 counta, 4 max, 5 min. Add 100 (109, 101, ...) to also ignore manually hidden rows.'],['ref1','The range to calculate on.']] },
  points:['`SUBTOTAL(9, range)` is a sum that respects filters.','Numbers 1 to 11 ignore filtered rows but include manually hidden rows.','Numbers 101 to 111 ignore both filtered and manually hidden rows.','Plain SUM adds hidden rows too.','Excel also inserts SUBTOTAL when you use Data > Subtotal.'],
  mistakes:['Using SUM under a filtered list and getting the full total.','Using 9 when rows are hidden manually and should be excluded.','Nesting SUBTOTAL inside SUM.'],
  example:{ title:'Total of a filtered list', scenario:'The sales log is filtered to show only North orders. The total should show only what is visible.',
    table:withHl(SALESLOG,{'B2':'find','B4':'find','B7':'find','D2':'hit','D4':'hit','D7':'hit'},'Sheet: Sales log (filtered to North)'), task:'Add the visible sales.', formula:'=SUBTOTAL(9, D2:D9)',
    steps:['Function number 9 means SUM.','Rows for South and East are hidden by the filter, so they are skipped.','Only 12000 + 15000 + 7000 are added.'], result:'The formula returns 34000 (SUM would return 81500).' },
  practice:{ q:'Write a formula that counts the visible orders in a filtered list in D2:D9, ignoring filtered-out rows.', hint:'Function number 2 is COUNT.', solution:'=SUBTOTAL(2, D2:D9)', explain:'COUNT with function number 2 counts only the visible numeric cells. Use 102 to also ignore manually hidden rows.' },
  interview:[
    { level:'Basic', q:'What is the difference between SUM and SUBTOTAL(9, ...)?', a:'SUM adds every cell in the range, including filtered-out rows. SUBTOTAL(9, ...) adds only the visible rows after a filter.' },
    { level:'Intermediate', q:'What is the difference between function numbers 9 and 109?', a:'Both ignore rows hidden by a filter. 109 also ignores rows that were hidden manually. 9 includes manually hidden rows.' },
    { level:'Intermediate', q:'Why does SUBTOTAL ignore other SUBTOTAL formulas in its range?', a:'To avoid double counting, so you can have group subtotals and a grand total in the same range.' },
    { level:'Scenario', q:'A manager filters a long list and wants the total at the top to update. What do you use?', a:'=SUBTOTAL(9, range) in the total cell. It recalculates every time the filter changes.' }
  ],
  mcq:[
    { q:'What does `=SUBTOTAL(9, D2:D9)` return for the North-filtered sales log?', o:['34000','81500','15000','3'], a:0, why:'Only the visible North rows are added.' },
    { q:'What does function number 9 mean?', o:['SUM','AVERAGE','COUNT','MAX'], a:0, why:'9 is SUM.' },
    { q:'Which numbers also ignore manually hidden rows?', o:['101 to 111','1 to 11','21 to 31','1000 and up'], a:0, why:'Adding 100 to the function number ignores manually hidden rows too.' },
    { q:'Does SUM ignore filtered-out rows?', o:['Yes','No','Only for text','Only in tables'], a:1, why:'SUM adds everything in the range.' },
    { q:'Which number gives COUNT?', o:['2','9','4','1'], a:0, why:'Function number 2 is COUNT.' }
  ],
  recap:['SUBTOTAL follows filters; SUM does not.','9 is SUM, 1 average, 2 count, 4 max, 5 min.','Add 100 to also ignore manually hidden rows.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- round --- */
D('round',{ l:'Beginner', t:'ROUND changes the stored value, unlike number formatting, which only changes how it looks.',
  i:['Formatting a cell to two decimals only changes the display. The cell still holds 12.678, and totals use that full value. ROUND really changes the number.','This matters for money: printed lines that look like 33.33 each but add up to a total that shows 100.00 will confuse an auditor.'], a:'Cutting a plank to length (ROUND), versus painting a mark on it (formatting).',
  h:['Write `=ROUND(number, digits)`.','A positive `digits` keeps decimals, 0 gives a whole number.','A negative `digits` rounds to tens, hundreds and so on.','Use ROUNDUP and ROUNDDOWN to force the direction.'],
  d:[FL(['ROUND(x, 2)'],[{ title:'12.678', text:'stored value' },{ title:'12.68', text:'rounded value (third decimal 8)' }])],
  x:[X('Variation','Rounding to hundreds','A budget is shown in hundreds.','Round to the nearest hundred.','=ROUND(1234, -2)',['A negative digit rounds to the left of the decimal point.'],'The formula returns 1200. Use ROUNDUP for 1300 and ROUNDDOWN for 1200.'),
     X('Business case','Lines that do not add up','An invoice splits 100 into three equal lines of 33.333.','Choose a rounding policy.','Line: =ROUND(100/3, 2)    Last line: =100 - 2 * line',['Each line rounds to 33.33.','Three lines add to 99.99, not 100.','Give the last line the remainder, 33.34.'],'Document the rule so lines always add to the total.')],
  e:[['Display versus value','Format Cells shows fewer decimals but keeps the full value. Use ROUND when later calculations must use the rounded number.'],['Rounding too early','Round at the end of a calculation, not at each step, to avoid accumulating errors.'],['Half cases','Excel rounds 2.5 to 3 and -2.5 to -3 (away from zero).'],['Floating point','Binary arithmetic can leave tiny errors such as 0.1+0.2. ROUND hides them.']],
  p:[P('Medium','Round 7142.857 to two decimals and to the nearest ten.','Digits 2 and -1.','=ROUND(7142.857, 2) -> 7142.86\n=ROUND(7142.857, -1) -> 7140','The second digit argument selects the position.'),
     P('Interview','Why do totals in a printed report sometimes differ by 0.01 from the sum of lines?','Display versus value.','The lines are shown rounded by formatting but hold full values, so the total is the sum of unrounded values.\nFix: ROUND each line, or ROUND the total with a stated policy.','A clear rule beats a manual adjustment.')],
  q:[Q('Basic','What is the difference between ROUND and formatting?','ROUND changes the stored value. Formatting changes only how it is displayed.',{ f:[['What do ROUNDUP and ROUNDDOWN do?','They round away from zero and towards zero, whatever the next digit is.']] }),
     Q('Scenario','Invoice lines and the total differ by 0.01. What do you do?','Agree a rounding policy, round each line with ROUND, and give any remainder to the last line so the total matches.',{ t:'Rounding per line or on the total are both valid, but the choice must be consistent.' })],
  r:RT(['Formula','Result'],[['`ROUND(12.678, 2)`','12.68'],['`ROUND(1234, -2)`','1200'],['`ROUNDUP(12.01, 0)`','13'],['`ROUNDDOWN(12.99, 0)`','12']]), rel:['sum','average','text','sumproduct'] });

/* --- rank --- */
DEEP['rank'] = {
  level:'Intermediate',
  tldr:'RANK gives each value its position in a list. Equal values share a rank, and the next rank is skipped.',
  intuition:{ text:[
    'A leaderboard needs more than a sort. It needs a number beside each name that says "you are second". RANK produces that number, and updates it if the data changes.',
    'The interesting part is ties. Two people with 82 are both second, and nobody is third. Knowing this, and how to break ties when you need a unique rank, is what interviewers ask about.'
  ], analogy:'A race result: two runners finish together in second place, so the next finisher is fourth.' },
  how:[
    'RANK compares the value with every value in the reference list.',
    'With order 0 (default), the rank is 1 plus the number of values that are **larger**.',
    'With order 1, it is 1 plus the number of values that are **smaller**.',
    'Equal values therefore get the same rank, and the next rank skips ahead.'
  ],
  diagrams:[
    { type:'flow', panels:[
      { title:'Marks and ranks', rows:[['Student','Marks','Rank'],['Deepak',91,1],['Asha',82,2],['Esha',82,2],['Bilal',67,4],['Chitra',45,5]], hl:{2:'find',3:'find'}, note:'Two students tie at 2, so rank 3 is skipped.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Lowest value first', scenario:'For a race, the smallest time should be rank 1.', table:withHl({rows:[['Runner','Seconds','Rank'],['A',12.4,2],['B',11.9,1],['C',13.1,3]]},{'B2':'find','C2':'hit'},'Sheet: Race'), task:'Rank the times with the smallest first.',
      formula:'=RANK.EQ(B2, $B$2:$B$4, 1)', steps:['Order 1 ranks ascending.','12.4 has one smaller value (11.9), so its rank is 2.'], result:'A is ranked 2, B is ranked 1.' },
    { level:'Business case', title:'A leaderboard with no ties', scenario:'A report needs unique positions, even when two students have the same marks.', table:withHl(RANKS,{'B2:B6':'range','C2':'hit'},'Sheet: Marks'), task:'Break ties by order in the list.',
      formula:'=RANK.EQ(B2, $B$2:$B$6) + COUNTIF($B$2:B2, B2) - 1', steps:['RANK gives the shared rank (2 for both 82s).','COUNTIF counts how many times this mark has appeared so far, including this row.','Adding that count minus 1 pushes later duplicates down.'], table2:{ rows:[['Student','Marks','Unique rank'],['Asha',82,2],['Bilal',67,4],['Chitra',45,5],['Deepak',91,1],['Esha',82,3]], caption:'Result' }, result:'Asha is 2 and Esha is 3. Every position is now unique.' }
  ],
  edge:[
    { t:'Ties and gaps', d:'Two values at rank 2 mean there is no rank 3. If you need a dense ranking without gaps, use `SUMPRODUCT((range>x)/COUNTIF(range,range))+1`.' },
    { t:'Lock the reference list', d:'`$B$2:$B$6` must be absolute. Otherwise the list slides down as the formula is copied.' },
    { t:'RANK versus RANK.EQ', d:'`RANK` is the old name, kept for compatibility. `RANK.EQ` is the same. `RANK.AVG` gives tied values the average rank.' },
    { t:'Text and blanks', d:'Text and blank cells in the list are ignored. A text number is not ranked.' },
    { t:'Ranking within groups', d:'Excel has no built-in group rank. Use `COUNTIFS(group_range, group, value_range, ">"&value)+1`.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Rank each employee\'s sales **within their region**.', hint:'Count how many in the same region have larger sales, then add 1.', solution:'=COUNTIFS($B$2:$B$9, B2, $D$2:$D$9, ">"&D2) + 1', explain:'For each row it counts the larger sales in the same region. In North, the highest sale gets 1 because no North sale is larger.' },
    { level:'Interview', q:'How would you show the top 3 names and scores from a list, in a way that handles ties without losing anyone?', hint:'Create unique ranks first, then look up ranks 1 to 3.', solution:'Helper column: unique rank =RANK.EQ(B2,$B$2:$B$100)+COUNTIF($B$2:B2,B2)-1\nTop list: =INDEX($A$2:$A$100, MATCH(1, $C$2:$C$100, 0)) for rank 1, then 2, then 3.', explain:'A unique rank guarantees that MATCH finds exactly one row for each position, so tied people are both shown in order.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How does RANK treat ties?', a:'Tied values get the same rank, and the next rank is skipped. Two values tied at rank 2 are followed by rank 4.',
      follow:[ { q:'What is RANK.AVG?', a:'It gives tied values the average of the ranks they occupy, for example 2.5 for two values tied at ranks 2 and 3.' } ] },
    { level:'Intermediate', q:'How do you create a ranking without gaps or ties?', a:'For unique positions, add a tie-breaker: RANK.EQ(x, range) + COUNTIF($B$2:B2, B2) - 1. For a dense rank without gaps, use SUMPRODUCT((range>x)/COUNTIF(range, range)) + 1.',
      tradeoff:'Unique ranks are arbitrary among ties. Mention that the tie order follows the list order, which may need a business rule.' },
    { level:'Scenario', q:'A manager wants a live top 5 on a dashboard. How do you build it?', a:'Add a unique rank column, then use INDEX/MATCH (or XLOOKUP) to pull the name and score for ranks 1 to 5. In Microsoft 365, SORT with TAKE gives the same result in one formula.' }
  ],
  ref:{ headers:['Function','Ties','Gaps'], rows:[['`RANK.EQ`','Same rank','Yes'],['`RANK.AVG`','Average rank','n/a'],['Dense rank formula','Same rank','No'],['Unique rank formula','Broken by position','No']] },
  related:['large','small','sumproduct','vlookup']
};

/* --- large --- */
D('large',{ l:'Beginner', t:'LARGE returns the k-th largest value: LARGE(range, 1) is MAX, LARGE(range, 2) is the runner-up.',
  i:['MAX gives only the top. LARGE lets you ask for the second, third or tenth, which is how top-N lists and "second highest" questions are answered.','Duplicates count as separate values, so two equal top values occupy ranks 1 and 2.'], a:'Reading down a sorted leaderboard to a chosen position.',
  h:['Write `=LARGE(range, k)`.','k = 1 is the highest, 2 the second highest, and so on.','If k is larger than the count, the result is `#NUM!`.','To get the name, combine with INDEX and MATCH.'],
  d:[FL(['k = 2'],[{ title:'Sorted high to low', rows:[['Rank','Sales'],[1,1800],[2,1500],[3,1200],[4,1100],[5,900]], hl:{2:'hit'} },{ title:'LARGE(B2:B6, 2)', text:'**1500**' }])],
  x:[X('Variation','The sum of the top three','Total the three best months.','Use an array constant for k.','=SUM(LARGE(B2:B6, {1,2,3}))',['LARGE returns 1800, 1500 and 1200.','SUM adds them.'],'The formula returns 4500.',withHl(MONTHS5,{},'Sheet: Sales')),
     X('Business case','A live top-3 table with names','A dashboard lists the best three months.','Use LARGE for the value and INDEX/MATCH for the month.','=INDEX($A$2:$A$6, MATCH(LARGE($B$2:$B$6, 1), $B$2:$B$6, 0))',['Change 1 to 2 and 3 for the next rows.','Ties would return the same name twice, so add a tie-breaker if needed.'],'The table shows Apr, Feb and Jan with their values.')],
  e:[['Ties repeat','Two equal values both appear in the ranking. The second MATCH returns the first name again.'],['k too large','A k above the number of values gives `#NUM!`.'],['Text and blanks','They are ignored.'],['Microsoft 365','SORT and TAKE give a top-N list in one formula.']],
  p:[P('Medium','Return the second highest sales value.','LARGE with k = 2.','=LARGE(B2:B6, 2)','The sorted values are 1800, 1500, ... so the answer is 1500.',withHl(MONTHS5,{},'Sheet: Sales')),
     P('Interview','Return the second highest distinct value even when the top value appears twice.','Duplicates count in LARGE.','Make the list distinct first (UNIQUE) then LARGE: =LARGE(UNIQUE(B2:B100), 2). In older versions use a helper or SUMPRODUCT/COUNTIF trick.','Mentioning duplicates is the point of the question.')],
  q:[Q('Basic','What does LARGE do?','It returns the k-th largest value in a range. LARGE(range,1) equals MAX.',{ f:[['What is the opposite function?','SMALL.']] }),
     Q('Scenario','How do you build a top-5 list with names?','LARGE for the values and INDEX/MATCH for the names, handling ties with a helper rank column.',{ t:'In Microsoft 365, TAKE(SORT(...), 5) does it in one formula.' })],
  r:RT(['Need','Formula'],[['Second highest','`=LARGE(r, 2)`'],['Sum of top 3','`=SUM(LARGE(r, {1,2,3}))`'],['Name of k-th','`=INDEX(n, MATCH(LARGE(v,k), v, 0))`'],['Highest','`=MAX(r)`']]), rel:['small','max','rank','index-match'] });

/* --- small --- */
D('small',{ l:'Beginner', t:'SMALL returns the k-th smallest value: SMALL(range, 1) is MIN, SMALL(range, 2) is the second lowest.',
  i:['SMALL is LARGE from the bottom. It answers "the cheapest three", "the lowest two scores" or "the second smallest price".','It is the other half of any top-and-bottom report.'], a:'Counting up from the bottom of a ranked list.',
  h:['Write `=SMALL(range, k)`.','k = 1 is the minimum, 2 the second smallest.','k beyond the count gives `#NUM!`.','Pair with LARGE to report the top and the bottom.'],
  d:[FL(['k = 2'],[{ title:'Sorted low to high', rows:[['Rank','Sales'],[1,900],[2,1100],[3,1200],[4,1500],[5,1800]], hl:{2:'hit'} },{ title:'SMALL(B2:B6, 2)', text:'**1100**' }])],
  x:[X('Variation','Average of the two lowest','Smooth out the weakest months.','Average two SMALL results.','=AVERAGE(SMALL(B2:B6,1), SMALL(B2:B6,2))',['The two smallest values are 900 and 1100.'],'The result is 1000.',withHl(MONTHS5,{},'Sheet: Sales')),
     X('Business case','Top and bottom table','A report shows the best and worst two months.','Combine LARGE and SMALL.','=LARGE(B2:B6, 1)   =LARGE(B2:B6, 2)\n=SMALL(B2:B6, 1)   =SMALL(B2:B6, 2)',['Rank positions run top-down for LARGE and bottom-up for SMALL.'],'Best: 1800 and 1500. Worst: 900 and 1100.')],
  e:[['Zero placeholders','A 0 becomes the smallest value. Filter zeros first.'],['Ties','Equal values occupy separate ranks.'],['k too large','Gives `#NUM!`.'],['Mixed types','Text and blanks are ignored.']],
  p:[P('Medium','Return the third smallest value.','SMALL with k = 3.','=SMALL(B2:B6, 3)','The sorted order 900, 1100, 1200 gives 1200.',withHl(MONTHS5,{},'Sheet: Sales')),
     P('Interview','Return the second lowest salary ignoring blanks and zeros.','Filter first.','=SMALL(IF(B2:B100>0, B2:B100), 2) as an array formula, or =SMALL(FILTER(B2:B100, B2:B100>0), 2) in Microsoft 365.','Stating the cleaning rule first is part of the answer.')],
  q:[Q('Basic','How is SMALL different from MIN?','MIN returns only the smallest. SMALL can return the k-th smallest.',{ f:[['What error appears when k is too large?','#NUM!.']] }),
     Q('Scenario','Build a bottom-3 list with names.','SMALL for values and INDEX/MATCH for names, with a tie-breaker helper column.',{ t:'Ties return the same name twice without it.' })],
  r:RT(['Need','Formula'],[['Second lowest','`=SMALL(r, 2)`'],['Lowest','`=MIN(r)`'],['Bottom 3 sum','`=SUM(SMALL(r, {1,2,3}))`'],['Top','`=LARGE(r, k)`']]), rel:['large','min','rank','index-match'] });

/* --- sumproduct --- */
DEEP['sumproduct'] = {
  level:'Intermediate to Advanced',
  tldr:'SUMPRODUCT multiplies matching items in two or more ranges and adds the results. With conditions, it becomes a flexible multi-criteria sum.',
  intuition:{ text:[
    'Total revenue is quantity times price for each line, added up. With ordinary formulas you need a helper column for the multiplication. SUMPRODUCT does it in one step: it multiplies row by row and adds the products.',
    'Its second superpower comes from the fact that a test such as `(B2:B9="North")` produces TRUE or FALSE for each row, which become 1 or 0 when multiplied. Multiply several tests and the numbers, and only the rows meeting all conditions survive.'
  ], analogy:'A cashier multiplying each item\'s quantity by its price on a long receipt, then adding the line totals.' },
  how:[
    'Give SUMPRODUCT two or more ranges of the same size.',
    'Excel multiplies the first item of each range together, then the second items, and so on.',
    'It adds all the products.',
    'To add conditions, include tests joined with `*`, such as `(B2:B9="North")*(C2:C9="Electronics")*D2:D9`.',
    'Non-numeric entries are treated as 0.'
  ],
  diagrams:[
    { type:'flow', arrows:['multiply row by row','add'], panels:[
      { title:'Quantity and price', rows:[['Item','Qty','Price','Qty x Price'],['Pen',5,10,50],['Book',2,60,120],['Bag',1,500,500]] },
      { title:'SUMPRODUCT', text:'50 + 120 + 500 = **670**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A weighted average', scenario:'Compute the average price weighted by quantity.', table:withHl(BASKET,{'B2:C4':'range'},'Sheet: Basket'), task:'Divide the total value by the total quantity.', formula:'=SUMPRODUCT(B2:B4, C2:C4) / SUM(B2:B4)', steps:['SUMPRODUCT gives total value, 670.','SUM gives total quantity, 8.'], result:'The weighted average price is 83.75, not the simple average of the three prices (190).' },
    { level:'Business case', title:'A multi-criteria sum without SUMIFS', scenario:'Total Electronics sales in North. SUMIFS would work, but SUMPRODUCT also handles OR logic and calculations on the fly.', table:withHl(SALESLOG,{'D2':'hit','D7':'hit'},'Sheet: Sales log'), task:'Multiply two tests and the sales column.',
      formula:'=SUMPRODUCT((B2:B9="North") * (C2:C9="Electronics") * D2:D9)', steps:['Each test returns TRUE or FALSE for each row.','Multiplication turns them into 1 and 0.','Only rows with 1 and 1 keep their sales.'], result:'The formula returns 19000. For OR logic, add the tests instead: `((B2:B9="North")+(B2:B9="East"))`.' }
  ],
  edge:[
    { t:'Same-size ranges', d:'Different sizes return `#VALUE!`. Every range must have the same number of rows and columns.' },
    { t:'Text is treated as zero', d:'With comma-separated arrays, text counts as 0. With `*` multiplication, text causes `#VALUE!`. Know which form you use.' },
    { t:'Comma versus asterisk', d:'`SUMPRODUCT(A, B)` treats non-numbers as 0. `SUMPRODUCT(A*B)` is stricter. Conditions need `*`, or `--` to convert TRUE/FALSE.' },
    { t:'Performance', d:'It processes whole arrays at once. On very large ranges, several SUMPRODUCTs slow the workbook; prefer SUMIFS where it is enough.' },
    { t:'No array entry needed', d:'Unlike many array formulas, SUMPRODUCT works without Ctrl+Shift+Enter in every Excel version.' },
    { t:'Whole-column references', d:'Avoid `A:A` inside SUMPRODUCT. It processes a million rows per range. Use exact ranges or a Table.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Count the orders in North with sales above 10000 using SUMPRODUCT.', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'Multiply two tests; no sum range needed.', solution:'=SUMPRODUCT((B2:B9="North") * (D2:D9>10000))', explain:'North orders above 10000 are O-101 (12000) and O-103 (15000), so the result is 2.' },
    { level:'Interview', q:'When would you choose SUMPRODUCT over SUMIFS?', hint:'Think about what SUMIFS cannot do.', solution:'1. OR conditions across different columns.\n2. Calculations inside the condition (for example MONTH(date)=3).\n3. Weighted averages and products of columns.\n4. Compatibility with very old versions.\nOtherwise SUMIFS is faster and easier to read.', explain:'A balanced answer says SUMPRODUCT is the more flexible tool, and SUMIFS the better default.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does SUMPRODUCT do?', a:'It multiplies the matching items in two or more ranges and adds the results, for example quantity times price for every line, summed in one formula.',
      follow:[ { q:'How do you use it for a weighted average?', a:'SUMPRODUCT(values, weights) / SUM(weights).' } ] },
    { level:'Intermediate', q:'How does SUMPRODUCT handle conditions?', a:'A condition such as (B2:B9="North") gives TRUE or FALSE per row. Multiplying conditions and values converts TRUE and FALSE into 1 and 0, so only matching rows are included in the sum.',
      structure:'Explain the TRUE/FALSE to 1/0 idea, then give a two-condition example.',
      tradeoff:'SUMIFS is clearer for AND conditions. SUMPRODUCT is needed for OR across columns or calculations on the data.' },
    { level:'Scenario', q:'Total the sales of March from a date column, without a helper column.', a:'=SUMPRODUCT((MONTH(A2:A100)=3) * B2:B100). A date-range SUMIFS is faster, but this works when the condition needs a calculation such as MONTH.' }
  ],
  ref:{ headers:['Pattern','Formula'], rows:[['Total value','`SUMPRODUCT(qty, price)`'],['Weighted average','`SUMPRODUCT(v, w) / SUM(w)`'],['AND condition','`SUMPRODUCT((r1=x)*(r2=y)*values)`'],['OR condition','`SUMPRODUCT(((r1=x)+(r1=y)>0)*values)`'],['Count with conditions','`SUMPRODUCT((r1=x)*(r2>n))`']] },
  related:['sumifs','countifs','sum','average']
};

/* --- subtotal --- */
DEEP['subtotal'] = {
  level:'Intermediate',
  tldr:'SUBTOTAL calculates a total that **follows your filters**. Function 9 sums only visible rows, and 109 also ignores manually hidden rows.',
  intuition:{ text:[
    'SUM adds everything in the range, even rows hidden by a filter. That causes embarrassing reports: you filter to North, but the total at the bottom still shows all regions. SUBTOTAL fixes this by adding only the rows you can see.',
    'It also ignores other SUBTOTAL formulas in the range, so a grand total never double counts group subtotals.'
  ], analogy:'A calculator that only adds the receipts currently on your desk, not those in the drawer.' },
  how:[
    'The first argument chooses the calculation: 9 sum, 1 average, 2 count, 3 counta, 4 max, 5 min.',
    'Numbers 1 to 11 ignore rows hidden by a **filter**, but include rows hidden manually.',
    'Numbers 101 to 111 ignore both.',
    'The second argument is the range.',
    'The result changes whenever you apply or clear a filter.'
  ],
  diagrams:[
    { type:'flow', arrows:['filter Region = North'], panels:[
      { title:'All rows: SUM = 81500', rows:[['Order','Region','Sales'],['O-101','North',12000],['O-102','South',8000],['O-103','North',15000],['O-104','East',9500],['O-106','North',7000]], hl:{2:'miss',4:'miss'} },
      { title:'Visible rows: SUBTOTAL(9) = 34000', rows:[['Order','Region','Sales'],['O-101','North',12000],['O-103','North',15000],['O-106','North',7000]], hl:{1:'hit',2:'hit',3:'hit'} }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'9 versus 109', scenario:'Row 3 is hidden by hand (Hide Row), and no filter is active.', table:withHl(SALESLOG,{'D3':'miss'},'Sheet: Sales log (row 3 hidden manually)'), task:'Compare the two function numbers.', formula:'=SUBTOTAL(9, D2:D9)     -> 81500 (hidden row is still counted)\n=SUBTOTAL(109, D2:D9)   -> 73500 (hidden row is ignored)',
      steps:['Function 9 only reacts to filters.','Function 109 also ignores rows hidden manually.'], result:'The difference is 8000, the hidden row\'s value. Choose 109 for reports where hidden rows should disappear.' },
    { level:'Business case', title:'A total row that follows slicers', scenario:'A table with slicers should show the visible total, so management reads the number they filtered for.', table:T({rows:[['Setting','Value']]},'Table total row'), task:'Use the table\'s total row.', formula:'=SUBTOTAL(109, tblSales[Sales])',
      steps:['When you switch on the Total Row, Excel inserts a SUBTOTAL formula automatically.','Slicers filter the table, so the total changes with each selection.'], result:'The total row always matches what is on screen.' }
  ],
  edge:[
    { t:'SUM ignores filters, SUBTOTAL does not', d:'A total below filtered data must use SUBTOTAL, or readers see a number that does not match the visible rows.' },
    { t:'Nested subtotals', d:'SUBTOTAL ignores other SUBTOTAL results in its range, so a grand total over group subtotals does not double count.' },
    { t:'Hidden columns', d:'SUBTOTAL only looks at hidden **rows**. Hiding columns does not change the result.' },
    { t:'Manual hide vs filter', d:'1 to 11 include rows hidden manually; 101 to 111 exclude them. Many analysts use 109 as the safe default.' },
    { t:'AGGREGATE', d:'`AGGREGATE` is a more powerful relative that can also ignore errors.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show the number of visible orders and their average sales after filtering.', hint:'Function numbers for count and average.', solution:'Count: =SUBTOTAL(102, D2:D9)\nAverage: =SUBTOTAL(101, D2:D9)', explain:'102 is COUNT and 101 is AVERAGE, both ignoring hidden rows. With the North filter, the count is 3 and the average is 11333.' },
    { level:'Interview', q:'A manager filters a long list and says the total at the bottom is wrong. What do you check?', hint:'Which function is used?', solution:'The total uses SUM, which counts filtered-out rows. Replace it with SUBTOTAL(109, range). Also check that the range covers all data rows, and that no other subtotal rows overlap it.', explain:'This is a classic: the formula is not wrong, it just answers a different question than the manager is asking.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between SUM and SUBTOTAL?', a:'SUM adds every cell in the range, including filtered-out rows. SUBTOTAL(9, range) adds only the visible rows, so the total follows the filter.',
      follow:[ { q:'What is the difference between 9 and 109?', a:'Both ignore filtered rows. 109 also ignores rows hidden manually.' } ] },
    { level:'Intermediate', q:'What happens if the range contains other SUBTOTAL formulas?', a:'They are ignored, so group subtotals and a grand total can coexist without double counting.' },
    { level:'Scenario', q:'Build a table report where the total updates with slicer selections.', a:'Convert the data to a Table, enable the Total Row (which uses SUBTOTAL 109), and attach slicers. The total always reflects the visible rows.',
      tradeoff:'SUBTOTAL totals only the visible state. Keep a separate grand total elsewhere if both views are needed.' }
  ],
  ref:{ headers:['Function','With filters','With manual hide'], rows:[['`SUM`','Counts all','Counts all'],['`SUBTOTAL(9)`','Visible only','Counts hidden'],['`SUBTOTAL(109)`','Visible only','Visible only']] },
  related:['sum','excel-tables','slicers','pivot-basics']
};
})();
