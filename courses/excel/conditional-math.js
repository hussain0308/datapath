/* Datapath | Excel | Conditional math
 * Lessons in this file: criteria, countif, countifs, sumif, sumifs, averageif, averageifs, maxifs, minifs
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
  const { SALESLOG, ORDERS_DT } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- criteria --- */
'criteria': {
  title:'Criteria, operators and wildcards', tagline:'Learn how to tell COUNTIF, SUMIF and friends which cells to include.',
  prereq:['if'],
  whatTitle:'What are criteria?',
  what:[
    'A **criterion** tells a function which cells to include.',
    'COUNTIF, SUMIF, AVERAGEIF, MAXIFS and the other IF functions all use criteria.',
    'It can be a plain value, a comparison such as ">=10000", or text with wildcards.',
    'Learn this once and every conditional function becomes easy.'
  ],
  why:[
    'Most MIS reports count, add or average data by region, product, month or amount.',
    'Wrong criteria are the most common reason for wrong totals.'
  ],
  syntax:{ code:'"North"          text match\n500              number match\n">=10000"        comparison\n"<>East"         not equal to\n"Elec*"          starts with Elec\n">="&F1          comparison using a cell value', parts:[
    ['"North"','A plain value matches exactly. Text is not case sensitive.'],
    ['">=10000"','Operators go inside the quotes together with the number.'],
    ['"Elec*"','* stands for any number of characters. ? stands for exactly one.'],
    ['">="&F1','Join an operator with a cell reference using the & sign.']
  ]},
  points:[
    'Operators go **inside the quotes**: `">=10000"`, `"<>East"`.',
    'To compare with a cell value, join with `&`: `">="&F1`.',
    'Wildcards work only with **text**: `*` for any characters, `?` for one character.',
    'To search for a real `*` or `?`, type `~` before it, such as `"~*"`.',
    'Text criteria are not case sensitive.',
    '`"<>"` matches non-empty cells, and `"="` matches empty cells.',
    'For dates, join the operator with a date: `">="&DATE(2026,1,1)` or `">="&F1`.'
  ],
  mistakes:[
    'Writing the operator outside the quotes, such as `>=10000` without quotes.',
    'Forgetting `&` when using a cell reference: `">=F1"` searches for the text F1.',
    'Using wildcards on numbers, which does not work.',
    'Including the header row in the range.',
    'Numbers stored as text, which do not match numeric criteria.'
  ],
  example:{
    title:'Counting big orders',
    scenario:'A sales log has one row per order. You want to know how many orders are worth 10000 or more.',
    table:withHl(SALESLOG,{'D2':'hit','D4':'hit','D6':'hit','D9':'hit'},'Sheet: Sales log'),
    task:'Count the orders with sales of 10000 or more.',
    formula:'=COUNTIF(D2:D9, ">=10000")',
    steps:[
      'Range: D2:D9, the Sales column without the header.',
      'Criterion: ">=10000", with the operator inside the quotes.',
      'Four cells qualify: 12000, 15000, 11000 and 13000.'
    ],
    result:'The formula returns 4.'
  },
  practice:{
    q:'Using the sales log, write a formula that counts the orders whose region is **not** North.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'Region is in B2:B9. Use the not-equal operator, <>, inside the quotes.',
    solution:'=COUNTIF(B2:B9, "<>North")',
    explain:'North appears 3 times out of 8 orders, so 5 orders are not North (3 South and 2 East).'
  },
  interview:[
    { level:'Basic', q:'What is a criterion in functions like COUNTIF and SUMIF?',
      a:'A criterion is the condition that decides which cells are included. It can be a value, a comparison such as ">=10000", or text with wildcards, for example "Elec*".' },
    { level:'Intermediate', q:'How do you use a cell value together with an operator, such as greater than the number in F1?',
      a:'I join the operator and the cell with an ampersand: ">="&F1. Writing ">=F1" inside the quotes would search for the text F1 instead of using the cell value.' },
    { level:'Intermediate', q:'How do wildcards work in criteria?',
      a:'An asterisk matches any number of characters and a question mark matches exactly one. For example, "Elec*" matches Electronics, and "?orth" matches North. Wildcards work on text only, and ~ lets me search for a real asterisk or question mark.' },
    { level:'Scenario', q:'You need to count orders placed between two dates held in F1 and F2. How do you write the criteria?',
      a:'I use COUNTIFS with the date column twice: =COUNTIFS(A2:A500, ">="&F1, A2:A500, "<="&F2). Joining the operator with the cell reference keeps the dates flexible.' }
  ],
  mcq:[
    { q:'Which criterion counts values greater than 500?', o:['>500','">500"','"500>"','500'], a:1,
      why:'The operator and the number go together inside the quotes.' },
    { q:'How do you write "greater than or equal to the value in F1"?', o:['">=F1"','">="&F1','>=&F1','"F1>="'], a:1,
      why:'Join the operator text and the cell reference with the & sign.' },
    { q:'Which wildcard stands for any number of characters?', o:['?','*','~','#'], a:1,
      why:'* matches any number of characters. ? matches exactly one.' },
    { q:'What does the criterion "Elec*" match?', o:['Electronics','Furniture','Only the word Elec','Nothing'], a:0,
      why:'It matches any text that starts with Elec.' },
    { q:'Is the text criterion "north" case sensitive?', o:['Yes','No','Only with wildcards','Only in SUMIF'], a:1,
      why:'Text criteria ignore upper and lower case, so "north" matches North.' }
  ],
  recap:[
    'Criteria decide which cells are included, and operators go inside the quotes.',
    'Use ">="&F1 to combine an operator with a cell, and * or ? for text patterns.',
    'Text criteria are not case sensitive; wildcards work on text only.'
  ]
},

/* --- countif --- */
'countif': {
  title:'COUNTIF', tagline:'Count how many cells meet one condition.',
  prereq:['criteria'],
  what:[
    'COUNTIF counts the cells in a range that meet **one** condition.',
    'Example: how many orders came from the North region?',
    'It works with text, numbers and dates.'
  ],
  why:[
    'Count orders by region, tickets by status or employees by department.',
    'Find duplicates in a list.',
    'It is one of the most used functions in MIS reports.'
  ],
  syntax:{ code:'=COUNTIF(range, criteria)', parts:[
    ['range','The cells to look at.'],
    ['criteria','The condition, such as "North" or ">=10000".']
  ]},
  points:[
    'It counts **how many** cells match, not their total.',
    'It handles one condition. For several conditions, use COUNTIFS.',
    'Text criteria are not case sensitive, and wildcards work.',
    'No match returns `0`, not an error.',
    '`COUNT` counts numbers, `COUNTA` counts non-empty cells, `COUNTIF` counts cells that meet a condition.',
    'Find duplicates: `=COUNTIF($A$2:$A$100, A2)>1` is TRUE for repeated values.'
  ],
  mistakes:[
    'Forgetting the quotes around text or operators.',
    'Including the header row in the range.',
    'Using COUNTIF when two conditions are needed.',
    'Extra spaces in the data, so "North " does not match "North".'
  ],
  example:{
    title:'Counting orders from one region',
    scenario:'The sales log lists every order with its region. The manager asks how many orders came from North.',
    table:withHl(SALESLOG,{'B2':'hit','B4':'hit','B7':'hit'},'Sheet: Sales log'),
    task:'Count the North orders.',
    formula:'=COUNTIF(B2:B9, "North")',
    steps:[
      'Range: B2:B9, the Region column.',
      'Criterion: "North", an exact text match.',
      'North appears in rows 2, 4 and 7.'
    ],
    result:'The formula returns 3.'
  },
  practice:{
    q:'Write a formula that counts how many orders are in the **Furniture** category.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'Category is in C2:C9.',
    solution:'=COUNTIF(C2:C9, "Furniture")',
    explain:'Furniture appears in O-102, O-103 and O-107, so the result is 3.'
  },
  interview:[
    { level:'Basic', q:'What does COUNTIF do?',
      a:'COUNTIF counts the cells in a range that meet one condition. For example, =COUNTIF(B2:B9,"North") counts how many cells in the region column say North.' },
    { level:'Basic', q:'What is the difference between COUNT, COUNTA and COUNTIF?',
      a:'COUNT counts cells that contain numbers. COUNTA counts all non-empty cells. COUNTIF counts only the cells that meet a condition I give.' },
    { level:'Intermediate', q:'How do you find duplicate values in a list using COUNTIF?',
      a:'In a helper column, I use =COUNTIF($A$2:$A$100, A2)>1. It returns TRUE for any value that appears more than once, and I can filter on TRUE to review the duplicates.' },
    { level:'Scenario', q:'A report needs the number of customers with a missing phone number. How do you get it?',
      a:'I would use =COUNTBLANK(C2:C500), or COUNTIF(C2:C500, "=") to count empty cells. I would also check for cells that look empty but contain spaces, because those are not counted as blank.' }
  ],
  mcq:[
    { q:'What does `=COUNTIF(B2:B9, "East")` return for the sales log?', o:['2','3','8','15500'], a:0,
      why:'East appears twice, in O-104 and O-107.' },
    { q:'COUNTIF can check how many conditions?', o:['One','Two','Up to 127','As many as you like'], a:0,
      why:'COUNTIF handles one condition. COUNTIFS handles several.' },
    { q:'What does COUNTIF return when nothing matches?', o:['#N/A','#DIV/0!','0','An empty cell'], a:2,
      why:'No matches gives a count of 0.' },
    { q:'Which function counts all non-empty cells?', o:['COUNT','COUNTA','COUNTIF','COUNTBLANK'], a:1,
      why:'COUNTA counts every non-empty cell, whether it holds text or numbers.' },
    { q:'Which formula is TRUE for repeated values in A2:A100?', o:['=COUNTIF($A$2:$A$100, A2)>1','=COUNT(A2)>1','=SUM(A2)>1','=A2>1'], a:0,
      why:'It counts how often each value appears, and flags the ones that appear more than once.' }
  ],
  recap:[
    'COUNTIF counts cells that meet one condition.',
    'No matches returns 0; use COUNTIFS for more than one condition.',
    'COUNT counts numbers, COUNTA counts non-empty cells, COUNTIF counts by condition.'
  ]
},

/* --- countifs --- */
'countifs': {
  title:'COUNTIFS', tagline:'Count the rows that meet several conditions at the same time.',
  prereq:['countif'],
  what:[
    'COUNTIFS counts rows where **all** conditions are TRUE.',
    'Each condition has its own range and its own criterion.',
    'Example: how many orders are from North **and** in Electronics?'
  ],
  why:[
    'Real questions have more than one filter: region and category, status and month, amount and customer type.',
    'It is a frequent interview and MIS reporting task.'
  ],
  syntax:{ code:'=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)', parts:[
    ['criteria_range1','The first range to test.'],
    ['criteria1','The condition for the first range.'],
    ['criteria_range2, criteria2','Optional. More range and condition pairs.']
  ]},
  points:[
    'All conditions must be TRUE for a row to be counted (**AND** logic).',
    'All ranges must have the **same size**.',
    'Each range is followed by its own criterion.',
    'Use the same range twice for a range check: `">=10000"` and `"<=20000"`.',
    'For OR logic, add two COUNTIFS or COUNTIF formulas together.',
    'It works in Excel 2007 and later.'
  ],
  mistakes:[
    'Using ranges of different sizes, which gives #VALUE!.',
    'Expecting OR logic. COUNTIFS always uses AND.',
    'Forgetting quotes around operators and text.',
    'Mixing up the order of range and criterion.'
  ],
  example:{
    title:'Counting North orders in Electronics',
    scenario:'The manager wants the number of Electronics orders from the North region.',
    table:withHl(SALESLOG,{'B2':'hit','C2':'hit','B7':'hit','C7':'hit'},'Sheet: Sales log'),
    task:'Count the orders where Region is North and Category is Electronics.',
    formula:'=COUNTIFS(B2:B9, "North", C2:C9, "Electronics")',
    steps:[
      'First pair: Region range B2:B9 must equal "North".',
      'Second pair: Category range C2:C9 must equal "Electronics".',
      'Only rows 2 and 7 meet both conditions.'
    ],
    result:'The formula returns 2.'
  },
  practice:{
    q:'Count the orders from the **South** region with sales of **10000 or more**.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'Use two pairs: the Region range with "South" and the Sales range with ">=10000".',
    solution:'=COUNTIFS(B2:B9, "South", D2:D9, ">=10000")',
    explain:'South orders are 8000, 11000 and 13000. Two of them are 10000 or more, so the result is 2.'
  },
  interview:[
    { level:'Basic', q:'What is the difference between COUNTIF and COUNTIFS?',
      a:'COUNTIF checks one condition. COUNTIFS checks several, each with its own range and criterion, and counts only the rows that meet all of them.' },
    { level:'Intermediate', q:'How do you count with OR logic, such as orders from North or East?',
      a:'COUNTIFS always uses AND, so I add two counts: =COUNTIF(B2:B9,"North")+COUNTIF(B2:B9,"East"). That works because one cell cannot be both North and East.' },
    { level:'Intermediate', q:'What happens if the ranges in COUNTIFS have different sizes?',
      a:'Excel returns #VALUE!. All criteria ranges must have the same number of rows and columns.' },
    { level:'Scenario', q:'You need the number of orders between two dates in F1 and F2. How do you build it?',
      a:'=COUNTIFS(A2:A500, ">="&F1, A2:A500, "<="&F2). I use the same date range twice, once for the start and once for the end, and join the operators with the cell references.' }
  ],
  mcq:[
    { q:'What logic does COUNTIFS use for multiple conditions?', o:['AND','OR','XOR','It depends on the order'], a:0,
      why:'A row is counted only if every condition is TRUE.' },
    { q:'What does `=COUNTIFS(B2:B9,"North",C2:C9,"Electronics")` return for the sales log?', o:['3','2','5','1'], a:1,
      why:'North and Electronics match in rows 2 and 7 only.' },
    { q:'What do you get if the criteria ranges have different sizes?', o:['0','#VALUE!','#N/A','The smaller count'], a:1,
      why:'All ranges must be the same size.' },
    { q:'How do you count orders from North OR East?', o:['One COUNTIFS with both','Add two COUNTIF formulas','Use COUNTA','Use COUNT'], a:1,
      why:'COUNTIFS uses AND, so OR needs separate counts that are added together.' },
    { q:'Which is the first argument of COUNTIFS?', o:['The sum range','criteria_range1','criteria1','The count range'], a:1,
      why:'COUNTIFS starts with the first criteria range. There is no separate range to count.' }
  ],
  recap:[
    'COUNTIFS counts rows that meet all conditions at once.',
    'Each condition has its own range and criterion, and the ranges must match in size.',
    'For OR logic, add separate counts.'
  ]
},

/* --- sumif --- */
'sumif': {
  title:'SUMIF', tagline:'Add up values that meet one condition.',
  prereq:['criteria'],
  what:[
    'SUMIF adds the values in a range when a condition is met.',
    'It checks one range for the condition and adds from a sum range.',
    'Example: total sales for the North region.'
  ],
  why:[
    'Totals by region, product, salesperson or status are core MIS work.',
    'It replaces manual filtering and adding.'
  ],
  syntax:{ code:'=SUMIF(range, criteria, [sum_range])', parts:[
    ['range','The cells to test against the condition.'],
    ['criteria','The condition, such as "North" or ">=10000".'],
    ['sum_range','Optional. The cells to add. If left out, the cells in range are added.']
  ]},
  points:[
    'The order is **range, criteria, sum_range**.',
    'If sum_range is left out, SUMIF adds the cells in `range` itself.',
    'Example without sum_range: `=SUMIF(D2:D9, ">=10000")` adds the big orders.',
    'Keep the range and sum_range the same size.',
    'No match returns `0`.',
    'Use a cell for the criterion so the formula can be copied down: `=SUMIF($B$2:$B$9, F2, $D$2:$D$9)`.'
  ],
  mistakes:[
    'Swapping the order of the arguments, because SUMIFS uses a different order.',
    'Ranges of different sizes or in different rows.',
    'Forgetting to lock ranges with $ before copying down.',
    'Trying to use two conditions. SUMIFS is needed for that.'
  ],
  example:{
    title:'Total sales for one region',
    scenario:'The manager wants the total sales of the North region from the sales log.',
    table:withHl(SALESLOG,{'B2':'find','B4':'find','B7':'find','D2':'hit','D4':'hit','D7':'hit'},'Sheet: Sales log'),
    task:'Add up the sales where Region is North.',
    formula:'=SUMIF(B2:B9, "North", D2:D9)',
    steps:[
      'Range: B2:B9 is checked for "North".',
      'The matching rows are 2, 4 and 7.',
      'Sum range: D2:D9, so Excel adds 12000 + 15000 + 7000.'
    ],
    result:'The formula returns 34000.'
  },
  practice:{
    q:'Write a formula that returns the total sales of the **Furniture** category.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'The category is in C2:C9 and the sales in D2:D9.',
    solution:'=SUMIF(C2:C9, "Furniture", D2:D9)',
    explain:'Furniture orders are 8000, 15000 and 6000, which add up to 29000.'
  },
  interview:[
    { level:'Basic', q:'What does SUMIF do, and what are its arguments?',
      a:'SUMIF adds the values in a sum range for the rows where a condition is met. The arguments are range (where the condition is tested), criteria (the condition) and sum_range (the numbers to add).' },
    { level:'Intermediate', q:'What happens if you leave out sum_range?',
      a:'SUMIF adds the cells in the range itself. For example, =SUMIF(D2:D9,">=10000") adds all the sales that are 10000 or more.' },
    { level:'Intermediate', q:'How is the argument order of SUMIF different from SUMIFS?',
      a:'SUMIF is range, criteria, sum_range. SUMIFS starts with the sum range, then pairs of criteria range and criteria. Mixing them up is a common source of wrong totals.' },
    { level:'Scenario', q:'You have a list of regions in F2:F5 and want a total for each. How do you build it?',
      a:'In G2 I write =SUMIF($B$2:$B$9, F2, $D$2:$D$9) and copy it down. The dollar signs lock the data ranges, while F2 changes for each region.' }
  ],
  mcq:[
    { q:'What does `=SUMIF(B2:B9, "East", D2:D9)` return for the sales log?', o:['15500','9500','6000','31000'], a:0,
      why:'East sales are 9500 and 6000, which add up to 15500.' },
    { q:'What is the order of SUMIF arguments?', o:['range, criteria, sum_range','sum_range, range, criteria','criteria, range, sum_range','range, sum_range, criteria'], a:0,
      why:'SUMIF is range, criteria, sum_range.' },
    { q:'What happens if sum_range is omitted?', o:['An error','Excel adds the cells in range','Excel returns 0','Excel counts the cells'], a:1,
      why:'Excel adds the matching cells of the range itself.' },
    { q:'What does `=SUMIF(D2:D9, ">=10000")` return for the sales log?', o:['4','51000','81500','12000'], a:1,
      why:'The sales of at least 10000 are 12000, 15000, 11000 and 13000, which add up to 51000.' },
    { q:'What does SUMIF return when nothing matches?', o:['#N/A','0','#VALUE!','An empty cell'], a:1,
      why:'No match means nothing to add, so the result is 0.' }
  ],
  recap:[
    'SUMIF adds values that meet one condition: range, criteria, sum_range.',
    'Without sum_range it adds the range itself.',
    'Use SUMIFS for more than one condition.'
  ]
},

/* --- sumifs --- */
'sumifs': {
  title:'SUMIFS', tagline:'Add up values that meet several conditions at once.',
  prereq:['sumif','countifs'],
  what:[
    'SUMIFS adds the values in a sum range when **all** conditions are met.',
    'Each condition has its own range and criterion.',
    'Example: total sales for the North region in the Electronics category.'
  ],
  why:[
    'Totals are rarely by one field: region and product, month and salesperson.',
    'It is the workhorse of MIS reports and a common interview question.'
  ],
  syntax:{ code:'=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)', parts:[
    ['sum_range','The cells to add. It comes **first**.'],
    ['criteria_range1','The first range to test.'],
    ['criteria1','The condition for the first range.'],
    ['criteria_range2, criteria2','Optional. More range and condition pairs.']
  ]},
  points:[
    'The sum range comes **first**, unlike SUMIF where it comes last.',
    'All conditions must be TRUE (**AND** logic).',
    'All ranges must have the same size.',
    'The same range can be used as both a criteria range and the sum range.',
    'For OR logic, add two SUMIFS formulas.',
    'It works in Excel 2007 and later.'
  ],
  mistakes:[
    'Using the SUMIF argument order.',
    'Ranges of different sizes, which gives #VALUE!.',
    'Expecting OR logic.',
    'Forgetting to lock ranges before copying the formula down.'
  ],
  example:{
    title:'Total sales for North Electronics',
    scenario:'The manager wants the total Electronics sales made in the North region.',
    table:withHl(SALESLOG,{'B2':'find','C2':'find','B7':'find','C7':'find','D2':'hit','D7':'hit'},'Sheet: Sales log'),
    task:'Add up the sales where Region is North and Category is Electronics.',
    formula:'=SUMIFS(D2:D9, B2:B9, "North", C2:C9, "Electronics")',
    steps:[
      'Sum range: D2:D9, the Sales column.',
      'Condition 1: Region B2:B9 equals "North".',
      'Condition 2: Category C2:C9 equals "Electronics".',
      'Rows 2 and 7 qualify, so Excel adds 12000 + 7000.'
    ],
    result:'The formula returns 19000.'
  },
  practice:{
    q:'Write a formula that returns the total sales of **Electronics** orders worth **10000 or more**.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'Use the Sales range both as the sum range and as a criteria range with ">=10000".',
    solution:'=SUMIFS(D2:D9, C2:C9, "Electronics", D2:D9, ">=10000")',
    explain:'Electronics orders of at least 10000 are 12000, 11000 and 13000, which add up to 36000.'
  },
  interview:[
    { level:'Basic', q:'What is the difference between SUMIF and SUMIFS?',
      a:'SUMIF supports one condition and puts the sum range last. SUMIFS supports many conditions and puts the sum range first, followed by pairs of criteria range and criteria.' },
    { level:'Intermediate', q:'How do you add values with OR logic, such as North or East?',
      a:'SUMIFS uses AND, so I add two SUMIFS formulas, one for North and one for East. Because a row cannot be both, nothing is counted twice.' },
    { level:'Intermediate', q:'What happens if the ranges have different sizes?',
      a:'SUMIFS returns #VALUE!. The sum range and all criteria ranges must have the same dimensions.' },
    { level:'Scenario', q:'You have order dates in column A and amounts in column D, and need the total for a month given by a start date in F1 and an end date in F2.',
      a:'=SUMIFS(D2:D500, A2:A500, ">="&F1, A2:A500, "<="&F2). The date column is used twice to make a range, and the operators are joined to the cell references.' }
  ],
  mcq:[
    { q:'Which argument comes first in SUMIFS?', o:['criteria_range1','sum_range','criteria1','The first condition'], a:1,
      why:'SUMIFS starts with the range to add.' },
    { q:'What does `=SUMIFS(D2:D9, B2:B9, "South", C2:C9, "Electronics")` return for the sales log?', o:['24000','32000','19000','11000'], a:0,
      why:'South Electronics orders are 11000 and 13000, which add up to 24000.' },
    { q:'What logic does SUMIFS use for several conditions?', o:['OR','AND','XOR','NOT'], a:1,
      why:'Every condition must be TRUE.' },
    { q:'How do you add values for North OR East?', o:['One SUMIFS with both','Add two SUMIFS formulas','Use SUMIF with two ranges','Use COUNTIFS'], a:1,
      why:'SUMIFS cannot do OR directly, so the results of two formulas are added.' },
    { q:'What do you get if SUMIFS ranges have different sizes?', o:['0','#VALUE!','#N/A','A partial total'], a:1,
      why:'All ranges must have the same size.' }
  ],
  recap:[
    'SUMIFS adds values that meet all conditions: sum_range first, then range and criteria pairs.',
    'It uses AND logic and needs equal-sized ranges.',
    'For OR, add separate SUMIFS results.'
  ]
},

/* --- averageif --- */
'averageif': {
  title:'AVERAGEIF', tagline:'Find the average of values that meet one condition.',
  prereq:['criteria'],
  what:[
    'AVERAGEIF averages the values in a range for the rows that meet one condition.',
    'Example: the average order value for the Electronics category.'
  ],
  why:[
    'Averages by group show typical values, such as average sale per region.',
    'It is more reliable than averaging by hand after filtering.'
  ],
  syntax:{ code:'=AVERAGEIF(range, criteria, [average_range])', parts:[
    ['range','The cells to test against the condition.'],
    ['criteria','The condition, such as "Electronics".'],
    ['average_range','Optional. The cells to average. If left out, the cells in range are averaged.']
  ]},
  points:[
    'The order is **range, criteria, average_range**, like SUMIF.',
    'No matching cells gives `#DIV/0!`.',
    'Wrap it in IFERROR when a group may be empty.',
    'Empty cells and text in the average range are ignored.',
    'It handles one condition. Use AVERAGEIFS for more.',
    'Results often need rounding: wrap in `ROUND(..., 2)`.'
  ],
  mistakes:[
    'Expecting 0 when nothing matches. It returns #DIV/0!.',
    'Averaging an average. Keep the average at the row level.',
    'Ranges of different sizes.',
    'Text numbers in the average range, which are ignored.'
  ],
  example:{
    title:'Average sale in a category',
    scenario:'The manager wants the average order value for Electronics.',
    table:withHl(SALESLOG,{'C2':'find','C5':'find','C6':'find','C7':'find','C9':'find','D2':'hit','D5':'hit','D6':'hit','D7':'hit','D9':'hit'},'Sheet: Sales log'),
    task:'Average the sales where Category is Electronics.',
    formula:'=AVERAGEIF(C2:C9, "Electronics", D2:D9)',
    steps:[
      'Range: C2:C9 is checked for "Electronics".',
      'Five orders match: 12000, 9500, 11000, 7000 and 13000.',
      'Their total is 52500, divided by 5 orders.'
    ],
    result:'The formula returns 10500.'
  },
  practice:{
    q:'Write a formula for the **average sales of the East region**. Then wrap it so it shows "No orders" when the region has no rows.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'Region is in B2:B9, sales in D2:D9. IFERROR handles the no-match case.',
    solution:'=AVERAGEIF(B2:B9, "East", D2:D9)\n=IFERROR(AVERAGEIF(B2:B9, "East", D2:D9), "No orders")',
    explain:'East sales are 9500 and 6000, so the average is 7750. If the region had no rows, AVERAGEIF would give #DIV/0! and IFERROR would show No orders.'
  },
  interview:[
    { level:'Basic', q:'What does AVERAGEIF do?',
      a:'AVERAGEIF calculates the average of the cells in an average range for the rows that meet one condition, for example the average sale in the Electronics category.' },
    { level:'Intermediate', q:'What happens if no cells meet the condition?',
      a:'It returns #DIV/0!, because there is nothing to average. I wrap it in IFERROR and show a message such as "No orders" instead of 0, since 0 would look like a real average.' },
    { level:'Intermediate', q:'What is the difference between AVERAGEIF and AVERAGEIFS?',
      a:'AVERAGEIF uses one condition and puts the average range last. AVERAGEIFS handles several conditions and puts the average range first.' },
    { level:'Scenario', q:'Your manager wants the average sale per region in a summary table. How do you build it?',
      a:'I list the regions in a column and use =AVERAGEIF($B$2:$B$9, F2, $D$2:$D$9) next to each, locking the data ranges and copying the formula down. I wrap it in IFERROR and round the result.' }
  ],
  mcq:[
    { q:'What does `=AVERAGEIF(B2:B9, "East", D2:D9)` return for the sales log?', o:['7750','15500','9500','6000'], a:0,
      why:'East sales are 9500 and 6000. The average is 15500 divided by 2, which is 7750.' },
    { q:'What does AVERAGEIF return when no cell matches?', o:['0','#DIV/0!','#N/A','An empty cell'], a:1,
      why:'There are no values to average, so Excel returns #DIV/0!.' },
    { q:'Which function can hide the error when no cell matches?', o:['IFERROR','COUNT','ROUND','TRIM'], a:0,
      why:'IFERROR can show a message or blank instead of #DIV/0!.' },
    { q:'What is the order of AVERAGEIF arguments?', o:['range, criteria, average_range','average_range, range, criteria','criteria, range, average_range','range, average_range, criteria'], a:0,
      why:'AVERAGEIF follows the SUMIF pattern.' },
    { q:'How many conditions does AVERAGEIF accept?', o:['One','Two','As many as you like','None'], a:0,
      why:'Use AVERAGEIFS for several conditions.' }
  ],
  recap:[
    'AVERAGEIF averages values that meet one condition.',
    'No match returns #DIV/0!, so wrap it in IFERROR when needed.',
    'Use AVERAGEIFS for several conditions.'
  ]
},

/* --- averageifs --- */
'averageifs': {
  title:'AVERAGEIFS', tagline:'Average values that meet several conditions at once.',
  prereq:['averageif','sumifs'],
  what:[
    'AVERAGEIFS averages the values in a range for rows that meet **all** conditions.',
    'Each condition has its own range and criterion.',
    'Example: the average sale of North Electronics orders.'
  ],
  why:[
    'Group averages often need two or more filters, such as region and category.',
    'It is a natural next step after SUMIFS and COUNTIFS.'
  ],
  syntax:{ code:'=AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)', parts:[
    ['average_range','The cells to average. It comes **first**.'],
    ['criteria_range1','The first range to test.'],
    ['criteria1','The condition for the first range.'],
    ['criteria_range2, criteria2','Optional. More range and condition pairs.']
  ]},
  points:[
    'The average range comes **first**.',
    'All conditions must be TRUE (**AND** logic).',
    'All ranges must have the same size.',
    'No matching rows gives `#DIV/0!`.',
    'It works in Excel 2007 and later.',
    'AVERAGEIFS equals SUMIFS divided by COUNTIFS for the same conditions.'
  ],
  mistakes:[
    'Using the AVERAGEIF argument order.',
    'Ranges of different sizes.',
    'Not handling #DIV/0! when a combination has no rows.',
    'Expecting OR logic.'
  ],
  example:{
    title:'Average sale for North Electronics',
    scenario:'The manager wants the average order value for Electronics orders in the North region.',
    table:withHl(SALESLOG,{'B2':'find','C2':'find','B7':'find','C7':'find','D2':'hit','D7':'hit'},'Sheet: Sales log'),
    task:'Average the sales where Region is North and Category is Electronics.',
    formula:'=AVERAGEIFS(D2:D9, B2:B9, "North", C2:C9, "Electronics")',
    steps:[
      'Average range: D2:D9, the Sales column.',
      'Two conditions: Region is "North" and Category is "Electronics".',
      'Rows 2 and 7 qualify: 12000 and 7000, whose total is 19000, divided by 2.'
    ],
    result:'The formula returns 9500.'
  },
  practice:{
    q:'Write a formula for the **average sales of South Electronics orders**.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'The average range comes first, then the region pair, then the category pair.',
    solution:'=AVERAGEIFS(D2:D9, B2:B9, "South", C2:C9, "Electronics")',
    explain:'South Electronics orders are 11000 and 13000. The total is 24000 and the average is 12000.'
  },
  interview:[
    { level:'Basic', q:'What does AVERAGEIFS do?',
      a:'AVERAGEIFS averages the values in a range for the rows that meet all of several conditions, such as the average sale for North Electronics orders.' },
    { level:'Intermediate', q:'How is AVERAGEIFS related to SUMIFS and COUNTIFS?',
      a:'With the same conditions, AVERAGEIFS equals SUMIFS divided by COUNTIFS. That is also a useful way to check my result.' },
    { level:'Intermediate', q:'What do you do when AVERAGEIFS returns #DIV/0!?',
      a:'It means no row meets all the conditions. I check the criteria for typos or extra spaces, and if empty groups are expected, I wrap it in IFERROR and show a message instead of 0.' },
    { level:'Scenario', q:'You need the average order value per region and category in a matrix. How do you do it?',
      a:'I put regions down the side and categories across the top, then use one AVERAGEIFS with mixed references, such as =IFERROR(AVERAGEIFS($D$2:$D$9, $B$2:$B$9, $F3, $C$2:$C$9, G$2), "") and copy it across and down.' }
  ],
  mcq:[
    { q:'Which argument comes first in AVERAGEIFS?', o:['criteria_range1','average_range','criteria1','The count'], a:1,
      why:'AVERAGEIFS starts with the range to average.' },
    { q:'What does `=AVERAGEIFS(D2:D9, B2:B9, "East", C2:C9, "Electronics")` return for the sales log?', o:['9500','7750','6000','15500'], a:0,
      why:'Only O-104 is East and Electronics, with sales of 9500.' },
    { q:'What logic does AVERAGEIFS use?', o:['AND','OR','NOT','XOR'], a:0,
      why:'All conditions must be TRUE.' },
    { q:'What error appears when no row meets all conditions?', o:['#N/A','#DIV/0!','#VALUE!','#REF!'], a:1,
      why:'There are no values to average.' },
    { q:'AVERAGEIFS equals which combination?', o:['SUMIFS divided by COUNTIFS','SUMIFS times COUNTIFS','SUMIFS plus COUNTIFS','COUNTIFS divided by SUMIFS'], a:0,
      why:'Total divided by count is the average.' }
  ],
  recap:[
    'AVERAGEIFS averages values that meet all conditions; the average range comes first.',
    'No match returns #DIV/0!, so handle it with IFERROR if needed.',
    'It equals SUMIFS divided by COUNTIFS.'
  ]
},

/* --- maxifs --- */
'maxifs': {
  title:'MAXIFS', tagline:'Find the highest value among the rows that meet your conditions.',
  prereq:['sumifs'],
  what:[
    'MAXIFS returns the largest value in a range for the rows that meet the conditions.',
    'Example: the biggest order in the North region.'
  ],
  why:[
    'Find top orders, highest scores or latest dates per group.',
    'It replaces the older array formula `MAX(IF(...))`.'
  ],
  syntax:{ code:'=MAXIFS(max_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)', parts:[
    ['max_range','The cells to take the maximum from. It comes **first**.'],
    ['criteria_range1','The first range to test.'],
    ['criteria1','The condition for the first range.'],
    ['criteria_range2, criteria2','Optional. More range and condition pairs.']
  ]},
  points:[
    'The max range comes **first**, like SUMIFS.',
    'It supports several conditions (**AND** logic).',
    'If no cell matches, it returns `0`, which can be misleading.',
    'Available in **Excel 2019, Excel 2021 and Microsoft 365**.',
    'Older versions show `#NAME?`.',
    'It also works on dates, to find the latest date for a group.'
  ],
  mistakes:[
    'Reading a 0 result as a real maximum when nothing matched.',
    'Using MAXIFS in a workbook shared with Excel 2016.',
    'Ranges of different sizes.',
    'Wrong argument order.'
  ],
  example:{
    title:'Largest order in a region',
    scenario:'The manager wants the highest single order from the North region.',
    table:withHl(SALESLOG,{'B2':'find','B4':'find','B7':'find','D4':'hit'},'Sheet: Sales log'),
    task:'Find the maximum sales where Region is North.',
    formula:'=MAXIFS(D2:D9, B2:B9, "North")',
    steps:[
      'Max range: D2:D9, the Sales column.',
      'Condition: Region B2:B9 equals "North", in rows 2, 4 and 7.',
      'Their sales are 12000, 15000 and 7000, and the largest is 15000.'
    ],
    result:'The formula returns 15000.'
  },
  practice:{
    q:'Write a formula that returns the **highest sales among Electronics orders**.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'The max range is D2:D9 and the condition is on column C.',
    solution:'=MAXIFS(D2:D9, C2:C9, "Electronics")',
    explain:'Electronics sales are 12000, 9500, 11000, 7000 and 13000. The highest is 13000.'
  },
  interview:[
    { level:'Basic', q:'What does MAXIFS do?',
      a:'MAXIFS returns the largest value in a range for the rows that meet one or more conditions, for example the biggest order in the North region.' },
    { level:'Intermediate', q:'What does MAXIFS return when no rows match, and why can that be a problem?',
      a:'It returns 0. That can look like a real maximum, so when empty groups are possible I check with COUNTIFS first, or show a message when the count is 0.' },
    { level:'Intermediate', q:'How would you find a conditional maximum before MAXIFS existed?',
      a:'With an array formula such as =MAX(IF(B2:B9="North", D2:D9)), entered with Ctrl+Shift+Enter in older versions. MAXIFS does the same job without array entry.' },
    { level:'Scenario', q:'Your workbook is shared with colleagues using Excel 2016. Would you use MAXIFS?',
      a:'No. MAXIFS is not available in Excel 2016 without a subscription, so those users would see #NAME?. I would use the array formula MAX(IF()) or confirm that everyone has Excel 2019, 2021 or Microsoft 365.' }
  ],
  mcq:[
    { q:'What does `=MAXIFS(D2:D9, B2:B9, "South")` return for the sales log?', o:['13000','11000','8000','32000'], a:0,
      why:'South sales are 8000, 11000 and 13000. The highest is 13000.' },
    { q:'What does MAXIFS return when no row matches?', o:['#N/A','0','An empty cell','#VALUE!'], a:1,
      why:'MAXIFS returns 0 for no match, which can be misleading.' },
    { q:'Which argument comes first in MAXIFS?', o:['max_range','criteria_range1','criteria1','The count'], a:0,
      why:'The range to take the maximum from comes first.' },
    { q:'Which version does NOT have MAXIFS?', o:['Microsoft 365','Excel 2021','Excel 2019','Excel 2016 without a subscription'], a:3,
      why:'MAXIFS arrived with Excel 2019 and Microsoft 365.' },
    { q:'Which older formula did the same job as MAXIFS?', o:['MAX(IF(...)) as an array formula','SUM(IF(...))','VLOOKUP','COUNTA'], a:0,
      why:'MAX with IF inside, entered as an array formula, found a conditional maximum.' }
  ],
  recap:[
    'MAXIFS returns the largest value that meets the conditions; the max range comes first.',
    'No match returns 0, so be careful with empty groups.',
    'It needs Excel 2019, 2021 or Microsoft 365.'
  ]
},

/* --- minifs --- */
'minifs': {
  title:'MINIFS', tagline:'Find the lowest value among the rows that meet your conditions.',
  prereq:['maxifs'],
  what:[
    'MINIFS returns the smallest value in a range for the rows that meet the conditions.',
    'It works exactly like MAXIFS, but for the minimum.',
    'Example: the smallest order in the Furniture category.'
  ],
  why:[
    'Find the lowest price, the shortest delivery time or the earliest date per group.',
    'Useful for spotting weak spots in a report.'
  ],
  syntax:{ code:'=MINIFS(min_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)', parts:[
    ['min_range','The cells to take the minimum from. It comes **first**.'],
    ['criteria_range1','The first range to test.'],
    ['criteria1','The condition for the first range.'],
    ['criteria_range2, criteria2','Optional. More range and condition pairs.']
  ]},
  points:[
    'The min range comes **first**.',
    'It supports several conditions (**AND** logic).',
    'If no cell matches, it returns `0`, which can be misleading for a minimum.',
    'Available in **Excel 2019, Excel 2021 and Microsoft 365**.',
    'Older versions show `#NAME?`.',
    'It can find the earliest date for a group.'
  ],
  mistakes:[
    'Treating a 0 result as a real minimum when nothing matched.',
    'Using it in files shared with older Excel versions.',
    'Mixing up MINIFS and MAXIFS.',
    'Ranges of different sizes.'
  ],
  example:{
    title:'Smallest order in a category',
    scenario:'The manager wants to know the lowest order value in the Furniture category.',
    table:withHl(SALESLOG,{'C3':'find','C4':'find','C8':'find','D8':'hit'},'Sheet: Sales log'),
    task:'Find the minimum sales where Category is Furniture.',
    formula:'=MINIFS(D2:D9, C2:C9, "Furniture")',
    steps:[
      'Min range: D2:D9, the Sales column.',
      'Condition: Category C2:C9 equals "Furniture", in rows 3, 4 and 8.',
      'Their sales are 8000, 15000 and 6000, and the smallest is 6000.'
    ],
    result:'The formula returns 6000.'
  },
  practice:{
    q:'Write a formula that returns the **lowest sales in the North region**.',
    table:withHl(SALESLOG,{},'Sheet: Sales log'),
    hint:'The min range is D2:D9 and the condition is on column B.',
    solution:'=MINIFS(D2:D9, B2:B9, "North")',
    explain:'North sales are 12000, 15000 and 7000. The lowest is 7000.'
  },
  interview:[
    { level:'Basic', q:'What does MINIFS do?',
      a:'MINIFS returns the smallest value in a range for the rows that meet one or more conditions, for example the lowest order in the Furniture category.' },
    { level:'Intermediate', q:'What is risky about MINIFS returning 0 when nothing matches?',
      a:'A real minimum may be a small positive number, so a 0 can be mistaken for an actual value. I check the count with COUNTIFS first, or show a message when no rows match.' },
    { level:'Intermediate', q:'How would you find the earliest order date per customer?',
      a:'=MINIFS(date_range, customer_range, customer) returns the smallest date for that customer, because dates are numbers. I would format the result as a date.' },
    { level:'Scenario', q:'You need both the highest and lowest order per region in one summary table. How?',
      a:'I list the regions in a column and use MAXIFS in one column and MINIFS in the next, both referring to the same data ranges with locked references, then copy them down. I add COUNTIFS to show how many orders each region has, so empty groups are obvious.' }
  ],
  mcq:[
    { q:'What does `=MINIFS(D2:D9, B2:B9, "South")` return for the sales log?', o:['8000','11000','13000','32000'], a:0,
      why:'South sales are 8000, 11000 and 13000. The lowest is 8000.' },
    { q:'What does MINIFS return when no row matches?', o:['#N/A','0','#VALUE!','An empty cell'], a:1,
      why:'It returns 0 when nothing matches.' },
    { q:'Which versions support MINIFS?', o:['Excel 2007 and later','Excel 2010 and later','Excel 2019, 2021 and Microsoft 365','Only Microsoft 365'], a:2,
      why:'MINIFS arrived with MAXIFS in Excel 2019 and Microsoft 365.' },
    { q:'Which argument comes first in MINIFS?', o:['min_range','criteria_range1','criteria1','The count'], a:0,
      why:'The range to take the minimum from comes first.' },
    { q:'What does `=MINIFS(D2:D9, C2:C9, "Furniture")` return for the sales log?', o:['6000','8000','15000','29000'], a:0,
      why:'Furniture sales are 8000, 15000 and 6000. The lowest is 6000.' }
  ],
  recap:[
    'MINIFS returns the smallest value that meets the conditions; the min range comes first.',
    'No match returns 0, so check empty groups.',
    'It needs Excel 2019, 2021 or Microsoft 365.'
  ]
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- criteria --- */
D('criteria',{ l:'Beginner to Intermediate', t:'Criteria tell COUNTIF, SUMIF and their IFS cousins which cells to include. Operators go inside quotes and cell references need `&`.',
  i:['All the conditional functions work the same way: a range to test and a condition. Learn how to write the condition once, and COUNTIF, SUMIF, AVERAGEIF, MAXIFS and the rest all become easy.','A criterion can be a plain value, a comparison such as ">=10000", or text with wildcards such as "Elec*".'], a:'A search box that understands "bigger than" and "starts with".',
  h:['Plain value: `"North"` or `500` matches equal cells.','Comparison: write the operator and number inside one pair of quotes, `">=10000"`.','Using a cell: join with `&`, `">="&F1`.','Wildcards: `*` for any characters, `?` for one character, `~` to match a real * or ?.'],
  d:[FL([''],[{ title:'Criteria forms', rows:[['Criterion','Matches'],['"North"','equal to North'],['">=10000"','10000 or more'],['"<>East"','everything but East'],['"Elec*"','starts with Elec'],['">="&F1','at or above F1']] }])],
  x:[X('Variation','Counting with wildcards and operators','Count orders in Elec* categories, and those of 10000 or more.','Write two criteria.','=COUNTIF(C2:C9, "Elec*")  -> 5\n=COUNTIF(D2:D9, ">=10000") -> 4',['The asterisk matches any ending.','The operator and the number share one pair of quotes.'],'5 Electronics orders and 4 large orders.',withHl(SALESLOG,{},'Sheet: Sales log')),
     X('Business case','Criteria driven by input cells','A summary uses the threshold typed in F1 and the region in G1.','Join operators with cell references.','=SUMIFS(D2:D9, B2:B9, G1, D2:D9, ">="&F1)',['G1 is used directly as an equal-to criterion.','">="&F1 builds the text ">=10000" from the cell.'],'Changing F1 or G1 updates the total without editing the formula.')],
  e:[['Operators outside quotes','`>=10000` without quotes is a syntax error.'],['Forgetting the &','`">=F1"` searches for the text F1, not the cell value.'],['Wildcards need text','`*` and `?` work on text, not on numbers.'],['Dates as criteria','Join with a date: `">="&DATE(2026,1,1)`. Typing a date as text often gives 0.']],
  p:[P('Medium','Count cells that are not East.','Use <> in quotes.','=COUNTIF(B2:B9, "<>East")','Six orders are not East.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','Count the cells that contain a literal asterisk.','Escape the wildcard.','=COUNTIF(A2:A100, "~*")','The tilde makes the next character literal.','')],
  q:[Q('Basic','How do you write a condition with an operator in COUNTIF?','Put the operator and value in quotes, such as ">=10000". With a cell, join with &, such as ">="&F1.',{ f:[['What do * and ? do?','* matches any number of characters, ? matches exactly one.']] }),
     Q('Scenario','A COUNTIF returns 0 although matching values exist. What do you check?','Quotes and operators, text versus numbers, trailing spaces, and the range.',{ t:'Compare with a filter to confirm the matches exist.' })],
  r:RT(['Need','Write'],[['Equal','`"North"`'],['Not equal','`"<>East"`'],['At least','`">=10000"`'],['Starts with','`"Elec*"`'],['From a cell','`">="&F1`']]), rel:['countif','sumif','countifs','sumifs'] });

/* --- countif --- */
DEEP['countif'] = {
  level:'Beginner',
  tldr:'COUNTIF counts the cells in a range that meet **one** condition.',
  intuition:{ text:[
    'Counting by hand means looking at each row and asking "is this one a North order?" COUNTIF asks that question for every cell in the range and gives you the number of yes answers.',
    'Because the condition is the heart of the function, learning how to write criteria (operators, wildcards, cell references) matters more than the syntax.'
  ], analogy:'A tally clicker that only clicks when the cell passes your test.' },
  how:[
    'You give COUNTIF a range and a criterion.',
    'Excel tests each cell of the range against the criterion.',
    'Cells that pass are counted. Cells that fail, or are empty, are not.',
    'The result is a number, and it is 0 (not an error) when nothing matches.'
  ],
  diagrams:[
    { type:'flow', arrows:['test each cell','count the TRUE rows'], panels:[
      { title:'Region column', rows:[['Region','= "North"?'],['North','TRUE'],['South','FALSE'],['North','TRUE'],['East','FALSE'],['South','FALSE'],['North','TRUE'],['East','FALSE'],['South','FALSE']], hl:{1:'hit',3:'hit',6:'hit'} },
      { title:'Result', text:'**3**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Operators and wildcards', scenario:'You want the number of big orders and the number of orders in categories starting with Elec.', table:withHl(SALESLOG,{'D2':'hit','D4':'hit','D6':'hit','D9':'hit'},'Sheet: Sales log'), task:'Count orders of 10000 or more, then Elec* categories.',
      formula:'=COUNTIF(D2:D9, ">=10000")        -> 4\n=COUNTIF(C2:C9, "Elec*")          -> 5', steps:['The operator and number sit together inside quotes.','The asterisk matches any characters after Elec.'], result:'4 big orders, and 5 Electronics orders.' },
    { level:'Business case', title:'Flagging duplicate customer ids', scenario:'A customer list may contain the same id twice. A helper column flags repeated ids.', table:withHl({rows:[['CustID','Duplicate?'],['C-01','TRUE'],['C-02','FALSE'],['C-01','TRUE'],['C-03','FALSE']]},{'B2':'hit','B4':'hit'},'Sheet: Customers (formula in B2, copied down)'),
      task:'Mark ids that appear more than once.', formula:'=COUNTIF($A$2:$A$5, A2) > 1', steps:['The range is locked so it covers the whole list in every row.','COUNTIF counts how often the current id appears.','A count above 1 means the id is repeated.'], result:'C-01 is flagged in both of its rows. Filter on TRUE to review the duplicates.' }
  ],
  edge:[
    { t:'Quotes around operators and text', d:'`">=10000"` and `"North"` need quotes. A bare `>=10000` is a syntax error.' },
    { t:'Cell references with operators', d:'Join with an ampersand: `">="&F1`. Writing `">=F1"` searches for the text F1.' },
    { t:'Numbers stored as text', d:'A text 5 does not match the number 5. Convert, or the count looks too low.' },
    { t:'Case and spaces', d:'Matching is not case sensitive, but a trailing space makes `"North "` different from `"North"`.' },
    { t:'Counting blanks and non-blanks', d:'`"="` counts empty cells, `"<>"` counts non-empty ones. `COUNTBLANK` is a simpler alternative for blanks.' },
    { t:'Counting unique values', d:'`SUMPRODUCT(1/COUNTIF(range, range))` counts distinct values but fails with blanks and is slow. In Microsoft 365, use `COUNTA(UNIQUE(range))`.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Count the orders whose sales are below the value typed in F1.', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'Join the operator with the cell reference.', solution:'=COUNTIF(D2:D9, "<"&F1)', explain:'If F1 holds 9000, the orders below it are 8000, 7000 and 6000, so the result is 3.' },
    { level:'Interview', q:'How would you count how many different regions appear in B2:B9, in Excel 2019 and in Microsoft 365?', hint:'Distinct counting needs a trick in older versions.', solution:'Excel 2019: =SUMPRODUCT(1/COUNTIF(B2:B9, B2:B9))\nMicrosoft 365: =COUNTA(UNIQUE(B2:B9))', explain:'Both return 3 (North, South, East). The older formula divides each occurrence by how many times it appears, so each region adds up to 1. It breaks if the range has blanks.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does COUNTIF do and what are its arguments?', a:'COUNTIF counts the cells in a range that meet one condition. Its arguments are the range and the criterion, such as =COUNTIF(B2:B9,"North").',
      structure:'Say what it counts, name the two arguments, give one example with a text and one with a number criterion.',
      follow:[ { q:'What is the difference between COUNT, COUNTA and COUNTIF?', a:'COUNT counts numbers, COUNTA counts non-empty cells, COUNTIF counts cells that meet a condition.' } ] },
    { level:'Intermediate', q:'How do you find duplicates with COUNTIF?', a:'In a helper column, =COUNTIF($A$2:$A$100, A2) > 1 returns TRUE for repeated values. I filter on TRUE to review them. I clean spaces and case first, so near-duplicates are caught.',
      tradeoff:'COUNTIF is quick for a few thousand rows, but it recalculates the whole range for every row, so it is slow on very large lists.' },
    { level:'Scenario', q:'COUNTIF returns 0 although you can see matching rows. What do you check?', a:'Numbers stored as text, trailing spaces, a criterion typed without the operator quotes, and a range that does not include the data. I compare with a filter to see if the matches really exist.' }
  ],
  ref:{ headers:['Criterion','Counts'], rows:[['`"North"`','Cells equal to North'],['`">=10000"`','Numbers 10000 or more'],['`"<>East"`','Everything except East'],['`"Elec*"`','Text starting with Elec'],['`">="&F1`','Numbers at or above the value in F1'],['`"<>"`','Non-empty cells']] },
  related:['countifs','sumif','criteria','counta']
};

/* --- countifs --- */
DEEP['countifs'] = {
  level:'Intermediate',
  tldr:'COUNTIFS counts the rows where **all** conditions are true at the same time.',
  intuition:{ text:[
    'COUNTIF asks one question per row. COUNTIFS asks several and only counts a row when every answer is yes: "North **and** Electronics **and** over 10000". It is an AND machine.',
    'The ranges for the questions can be different columns, and they must line up row by row so that each row is judged on all of its own cells.'
  ], analogy:'A club that admits a person only if they pass every check at the door.' },
  how:[
    'Each pair of arguments is a range and a criterion.',
    'Excel tests row 1 against every pair. If all are true, the row is counted.',
    'It repeats for every row and returns the total.',
    'All ranges must be the same size, or the result is `#VALUE!`.'
  ],
  diagrams:[
    { type:'flow', arrows:['both true'], panels:[
      { title:'Row-by-row tests', rows:[['Order','North?','Electronics?','Counted?'],['O-101','TRUE','TRUE','Yes'],['O-103','TRUE','FALSE','No'],['O-104','FALSE','TRUE','No'],['O-106','TRUE','TRUE','Yes']], hl:{1:'hit',4:'hit'} },
      { title:'Result', text:'**2**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A numeric range with the same column twice', scenario:'Count the orders worth between 8000 and 12000, inclusive.', table:withHl(SALESLOG,{'D2':'hit','D3':'hit','D5':'hit','D6':'hit'},'Sheet: Sales log'), task:'Use the sales column for both bounds.',
      formula:'=COUNTIFS(D2:D9, ">=8000", D2:D9, "<=12000")', steps:['The same range appears twice, with a lower and an upper bound.','Orders of 8000, 9500, 11000 and 12000 qualify.'], result:'The formula returns 4.' },
    { level:'Business case', title:'Tickets that breached the SLA', scenario:'A support team must close High priority tickets within 5 days. Management wants the number of breaches.', table:withHl({rows:[['Ticket','Priority','Days open'],['T-1','High',2],['T-2','Low',7],['T-3','High',6],['T-4','High',9],['T-5','Low',3]]},{'B4':'hit','C4':'hit','B5':'hit','C5':'hit'},'Sheet: Tickets'),
      task:'Count High tickets open more than 5 days.', formula:'=COUNTIFS(B2:B6, "High", C2:C6, ">5")', steps:['Priority must equal High.','Days open must be greater than 5.','T-3 (6 days) and T-4 (9 days) qualify.'], result:'The formula returns 2 breaches.' }
  ],
  edge:[
    { t:'AND only', d:'COUNTIFS cannot express OR. Add two counts, or use `SUM(COUNTIFS(range, {"North","East"}))`.' },
    { t:'Different sizes give #VALUE!', d:'Every criteria range must have the same number of rows and columns.' },
    { t:'Criteria on dates', d:'Join the operator with a date: `">="&F1`, and `"<="&F2`, using the same date column twice for a period.' },
    { t:'Blanks', d:'To count rows where a column is blank use `"="`. To count non-blank use `"<>"`.' },
    { t:'No range to count', d:'Unlike SUMIFS, there is no separate range to count. The first argument is already a criteria range.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Count the orders from North **or** East.', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'COUNTIFS is AND, so add two counts.', solution:'=COUNTIFS(B2:B9,"North") + COUNTIFS(B2:B9,"East")', explain:'North has 3 orders and East has 2, so the total is 5. A single order cannot be both, so nothing is counted twice.' },
    { level:'Interview', q:'Count the orders placed between two dates held in F1 and F2, for the region in G1.', hint:'Use the date column twice, plus the region.', solution:'=COUNTIFS(B2:B500, G1, A2:A500, ">="&F1, A2:A500, "<="&F2)', explain:'Each criterion reads from a cell, so the report updates when the inputs change.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between COUNTIF and COUNTIFS?', a:'COUNTIF checks one condition. COUNTIFS checks several, each with its own range, and counts only rows where all are true.',
      follow:[ { q:'How do you count with OR logic?', a:'Add separate counts, or sum an array of criteria. COUNTIFS itself is always AND.' } ] },
    { level:'Intermediate', q:'COUNTIFS returns #VALUE!. Why?', a:'The criteria ranges are different sizes. They must have identical dimensions, so I check that all ranges start and end on matching rows.',
      structure:'Name the cause, then how you would check it.' },
    { level:'Scenario', q:'Build a report of orders by region and month from a transaction list.', a:'Regions down the side and month starts across the top, then one COUNTIFS with a locked region column, locked date column, and a date range from the month start to EOMONTH. Copy across and down.',
      tradeoff:'A pivot table is faster to create; COUNTIFS gives a fixed layout that can feed formulas and dashboards.' }
  ],
  ref:{ headers:['Rule','Detail'], rows:[['Logic','AND across all pairs'],['Range sizes','Must be identical'],['OR','Add separate COUNTIFS'],['Date window','Same date range twice, with `>=` and `<=`']] },
  related:['countif','sumifs','averageifs','criteria']
};

/* --- sumif --- */
DEEP['sumif'] = {
  level:'Beginner to Intermediate',
  tldr:'SUMIF adds the values of a range for the rows where **one** condition is true.',
  intuition:{ text:[
    'SUM adds everything. SUMIF adds only what you point at. You tell it where to look for the condition and where the numbers are, and it adds the numbers on the rows that pass.',
    'The two ranges can be different columns, which is the point: the condition is in one column (Region) and the amounts are in another (Sales).'
  ], analogy:'Adding the receipts in the "North" pile and ignoring the rest.' },
  how:[
    'Excel tests each cell in `range` against `criteria`.',
    'For every cell that passes, it takes the number from the same position in `sum_range`.',
    'It adds those numbers.',
    'If you leave out `sum_range`, it adds the cells of `range` itself, which is useful for conditions on the numbers.'
  ],
  diagrams:[
    { type:'flow', arrows:['condition on Region','add Sales'], panels:[
      { title:'Rows that pass', rows:[['Region','Sales'],['North',12000],['South',8000],['North',15000],['East',9500],['South',11000],['North',7000],['East',6000],['South',13000]], hl:{1:'hit',3:'hit',6:'hit'} },
      { title:'Result', text:'12000 + 15000 + 7000 = **34000**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Condition on the same column', scenario:'You want the total of all orders worth 10000 or more.', table:withHl(SALESLOG,{'D2':'hit','D4':'hit','D6':'hit','D9':'hit'},'Sheet: Sales log'), task:'Add the big orders.',
      formula:'=SUMIF(D2:D9, ">=10000")', steps:['No sum_range is given, so Excel adds the cells of the range that pass.'], result:'The formula returns 51000 (12000 + 15000 + 11000 + 13000).' },
    { level:'Business case', title:'A regional summary table that updates itself', scenario:'The region names are listed in F2:F4, and a total is needed beside each name.', table:withHl(SALESLOG,{},'Sheet: Sales log (data in A1:D9)'), task:'Build the totals so the formula can be copied down.',
      formula:'=SUMIF($B$2:$B$9, F2, $D$2:$D$9)', steps:['The data ranges are locked with dollar signs.','F2 is relative, so each row uses its own region name.'], table2:{ rows:[['Region','Total'],['North',34000],['South',32000],['East',15500]], caption:'Result' }, result:'The three totals add up to 81500, the total of the whole table.' }
  ],
  edge:[
    { t:'Argument order', d:'SUMIF is `range, criteria, sum_range`. SUMIFS is `sum_range, criteria_range, criteria`. Mixing them gives wrong totals.' },
    { t:'sum_range size', d:'Keep `range` and `sum_range` the same size and aligned. Excel resizes a differently sized sum_range from its top-left cell, which can quietly shift the rows.' },
    { t:'Criteria as text numbers', d:'A column of text numbers is not added. Convert it to numbers first.' },
    { t:'Wildcards', d:'`"N*"` matches North. A tilde (`~*`) matches a real asterisk.' },
    { t:'No match', d:'SUMIF returns 0, not an error, so a typo in the criterion silently gives 0. Check suspiciously small totals.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Total the sales of every region **except** East.', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'Use the not-equal operator inside quotes.', solution:'=SUMIF(B2:B9, "<>East", D2:D9)', explain:'The result is 66000 (34000 + 32000). Alternatively subtract East from the grand total.' },
    { level:'Interview', q:'Your SUMIF total is much smaller than the pivot table total. List likely causes.', hint:'Think about data types and criteria.', solution:'1. Numbers stored as text in the sum range.\n2. Trailing spaces or spelling differences in the criteria column.\n3. A range that stops before the last row.\n4. Criteria typed without the right operator or quotes.', explain:'A good answer lists causes from the most common to the least, and says how to verify with a pivot or filter.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Explain SUMIF with an example.', a:'SUMIF adds the values in a sum range for rows where a condition is met. For example, =SUMIF(B2:B9,"North",D2:D9) adds the sales of all rows where the region is North.',
      structure:'State the three arguments in order, then give the example.',
      follow:[ { q:'What if sum_range is left out?', a:'Excel adds the cells of the range itself that meet the criterion.' } ] },
    { level:'Intermediate', q:'SUMIF or SUMIFS?', a:'SUMIF for one condition, SUMIFS for several. Many analysts use SUMIFS everywhere, because it also handles one condition and one argument order is easier to remember.',
      tradeoff:'Consistency versus familiarity: SUMIFS has the sum range first, which is different from SUMIF.' },
    { level:'Scenario', q:'Total by region for 200 regions listed in a column. How do you build it?', a:'Put the region list in a column, write one SUMIF with locked data ranges and a relative reference to the region cell, then copy it down. I also add a check cell that compares the sum of the totals with the grand total.' }
  ],
  ref:{ headers:['Argument','Meaning'], rows:[['`range`','Cells that are tested'],['`criteria`','The condition'],['`sum_range`','Cells that are added (optional)']] },
  related:['sumifs','countif','criteria','pivot-basics']
};

/* --- sumifs --- */
DEEP['sumifs'] = {
  level:'Intermediate',
  tldr:'SUMIFS adds the values of one range, but only for the rows where **all** of your criteria are true.',
  intuition:{ text:[
    'Imagine highlighting rows in a printed report: you highlight the rows that are North, then, of those, the ones that are Electronics, and then add up the sales of the highlighted rows. SUMIFS does the same, without highlighting anything.',
    'Each pair of arguments (a range and a criterion) is one test. A row counts only if it passes every test, which is why SUMIFS is an AND function.'
  ], analogy:'A filter with several drop-downs, followed by an automatic total of what is left.' },
  how:[
    'Excel looks at the first criteria range and marks the rows that meet the first criterion.',
    'It does the same for the second pair, and any others.',
    'A row survives only if it passed **every** test.',
    'Excel adds the values of the sum range (the **first** argument) for the surviving rows.',
    'If nothing survives, the result is 0.'
  ],
  diagrams:[
    { type:'flow', arrows:['both tests true','add the Sales'], panels:[
      { title:'Test each row', rows:[['Order','Region = North','Category = Electronics','Both','Sales'],['O-101','TRUE','TRUE','TRUE',12000],['O-102','FALSE','FALSE','FALSE',8000],['O-103','TRUE','FALSE','FALSE',15000],['O-104','FALSE','TRUE','FALSE',9500],['O-105','FALSE','TRUE','FALSE',11000],['O-106','TRUE','TRUE','TRUE',7000],['O-107','FALSE','FALSE','FALSE',6000],['O-108','FALSE','TRUE','FALSE',13000]], hl:{1:'hit',6:'hit'} },
      { title:'Result', text:'12000 + 7000 = **19000**' }
    ], caption:'Only two rows pass both tests.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Operators and the same range twice', scenario:'You want the Electronics sales that are at least 10000.', table:withHl(SALESLOG,{'C2':'find','D2':'hit','C5':'find','D5':'hit','C6':'find','D6':'hit','C9':'find','D9':'hit'},'Sheet: Sales log'),
      task:'Total Electronics orders of 10000 or more.', formula:'=SUMIFS(D2:D9, C2:C9, "Electronics", D2:D9, ">=10000")', steps:['The sum range D2:D9 is also used as a criteria range.','The operator and number go together inside quotes: ">=10000".'], result:'The formula returns 36000 (12000 + 11000 + 13000).' },
    { level:'Business case', title:'A region by category summary matrix', scenario:'The manager wants one grid, with regions down the side and categories across the top, filled by a single formula copied in both directions.', table:withHl(SALESLOG,{},'Sheet: Sales log (data in A1:D9)'),
      task:'Build the matrix using mixed references.', formula:'=SUMIFS($D$2:$D$9, $B$2:$B$9, $F3, $C$2:$C$9, G$2)', steps:['$D$2:$D$9, $B$2:$B$9 and $C$2:$C$9 are fully locked.','$F3 locks the column but lets the row move, so each row reads its own region.','G$2 locks the row but lets the column move, so each column reads its own category.'],
      table2:{ rows:[['Region','Electronics','Furniture'],['North',19000,15000],['South',24000,8000],['East',9500,6000]], caption:'Result: one formula copied across and down' }, result:'The matrix totals 81500, equal to the sum of all orders: a good sanity check.' }
  ],
  edge:[
    { t:'The sum range comes first', d:'In SUMIFS the order is `sum_range, criteria_range1, criteria1`. SUMIF is the other way round, and mixing them up gives wrong totals.' },
    { t:'All ranges must have the same size', d:'Different sizes return `#VALUE!`. A range that stops one row short is a quiet cause of totals that are slightly wrong when data grows.' },
    { t:'AND only, never OR', d:'For "North or East", add two SUMIFS, or use `=SUM(SUMIFS(D2:D9,B2:B9,{"North","East"}))`.' },
    { t:'Numbers stored as text', d:'A sales cell holding text is skipped silently by the sum range, and a text criteria column will not match numeric criteria.' },
    { t:'Hidden and filtered rows are still counted', d:'SUMIFS ignores filters. Use SUBTOTAL or AGGREGATE if the total must follow what is visible.' },
    { t:'Dates', d:'Join the operator with the date: `">="&F1`. Typing a date as text inside the criterion is a common source of zeros.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Total the sales of the North **or** East regions.', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'SUMIFS is AND, so add two results, or use an array constant.', solution:'=SUMIFS(D2:D9,B2:B9,"North") + SUMIFS(D2:D9,B2:B9,"East")', explain:'North is 34000 and East is 15500, so the total is 49500. The shorter =SUM(SUMIFS(D2:D9,B2:B9,{"North","East"})) gives the same result.' },
    { level:'Interview', q:'Total the sales between two dates held in F1 and F2.', table:withHl(ORDERS_DT,{},'Sheet: Orders (Date in B, Sales in C)'), hint:'Use the date column twice, with a start and an end condition.', solution:'=SUMIFS(C2:C6, B2:B6, ">="&F1, B2:B6, "<="&F2)', explain:'For F1 = 01-Jan-2026 and F2 = 31-Jan-2026, the result is 2000 (1200 + 800). Joining the operator and the cell keeps the dates flexible.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is the difference between SUMIF and SUMIFS?', a:'SUMIF supports one condition and takes the sum range last. SUMIFS supports many conditions, takes the sum range first, and requires all conditions to be true.',
      structure:'Compare the number of conditions, then the argument order, then logic type.',
      follow:[ { q:'How would you add an OR condition?', a:'Add two SUMIFS, or sum an array of criteria, because one SUMIFS can only do AND.' } ] },
    { level:'Intermediate', q:'Your SUMIFS total is lower than expected. What do you check?', a:'I check for numbers stored as text in the sum range, spaces or spelling differences in the criteria column, ranges that do not cover all rows, and criteria written without the operator joined to the cell. I also compare against a pivot table total.',
      structure:'Walk through data type, text matching, range coverage and criteria syntax, then cross-check with a second method.',
      follow:[ { q:'How do you cross-check?', a:'A pivot table on the same data, or SUMPRODUCT with the same conditions, should give the same total.' } ] },
    { level:'Scenario', q:'Build a monthly sales report by region from a transaction list.', a:'I put the regions down the side and the month start dates across the top, then use one SUMIFS with the sum range locked, the region criterion with a locked column, and a date range using the month start and EOMONTH. Copying across and down fills the whole grid.',
      tradeoff:'A pivot table is faster to build. SUMIFS gives a fixed, formatted layout that updates with the data and can feed a dashboard.' }
  ],
  ref:{ headers:['Part','Remember'], rows:[['`sum_range`','Comes **first**'],['Criteria pairs','Each is range + criterion; all must match (AND)'],['Operators','Inside quotes: `">=10000"`'],['Cell criteria','Join with `&`: `">="&F1`'],['Result if none match','`0`']] },
  related:['sumif','countifs','averageifs','criteria','pivot-basics']
};

/* --- averageif --- */
D('averageif',{ l:'Beginner to Intermediate', t:'AVERAGEIF averages only the cells that meet one condition.',
  i:['An overall average hides differences between groups. AVERAGEIF gives the average for one group, such as the average sale in the Electronics category.','If nothing matches, there is nothing to divide, so the result is `#DIV/0!`.'], a:'The class average for one class, not the whole school.',
  h:['Give the range to test and the criterion.','Optionally give the range to average, if it is different.','Excel averages the matching cells.','Wrap in IFERROR for groups that may be empty.'],
  d:[FL(['Electronics only'],[{ title:'Category and Sales', rows:[['Category','Sales'],['Electronics',12000],['Furniture',8000],['Electronics',9500],['Electronics',11000],['Electronics',7000],['Electronics',13000]], hl:{1:'hit',3:'hit',4:'hit',5:'hit',6:'hit'} },{ title:'AVERAGEIF', text:'52500 / 5 = **10500**' }])],
  x:[X('Variation','A group that may be empty','The average for a region that may have no orders.','Use IFERROR.','=IFERROR(AVERAGEIF(B2:B9, "Central", D2:D9), "No orders")',['Central does not exist, so AVERAGEIF gives #DIV/0!.','IFERROR shows a message instead.'],'The report shows No orders instead of an error.',withHl(SALESLOG,{},'Sheet: Sales log')),
     X('Business case','Average per region in a table','A summary lists regions and wants an average beside each.','Use cell criteria and locked ranges.','=AVERAGEIF($B$2:$B$9, F2, $D$2:$D$9)',['The ranges are locked.','F2 changes for each row.'],'North 11333, South 10667, East 7750.',withHl(SALESLOG,{},'Sheet: Sales log'))],
  e:[['#DIV/0! on no match','Handle with IFERROR or a COUNTIF check.'],['Blanks and text ignored','Only numbers in the average range count.'],['Averaging averages','Do not average the results; weight by counts.'],['One condition only','Use AVERAGEIFS for several.']],
  p:[P('Medium','Average sales of the East region.','AVERAGEIF with D as the average range.','=AVERAGEIF(B2:B9, "East", D2:D9)','(9500 + 6000) / 2 = 7750.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','AVERAGEIF returns #DIV/0! for a region you know has orders. Why?','Matching problems.','Spelling or trailing spaces in the region, text numbers in the average range, or a range mismatch.','Matching issues behave like "no match".')],
  q:[Q('Basic','What does AVERAGEIF do?','It averages the cells that meet a condition, such as the average sale in one category.',{ f:[['What does it return if nothing matches?','#DIV/0!.']] }),
     Q('Scenario','Build an average-by-region table that never shows errors.','Locked ranges, a region list, AVERAGEIF with IFERROR around it.',{ t:'A pivot table with Average is faster to build.' })],
  r:RT(['Argument','Meaning'],[['`range`','Cells to test'],['`criteria`','The condition'],['`average_range`','Cells to average (optional)'],['No match','`#DIV/0!`']]), rel:['averageifs','sumif','countif','average'] });

/* --- averageifs --- */
D('averageifs',{ l:'Intermediate', t:'AVERAGEIFS averages the values where **all** conditions are true. The average range comes first.',
  i:['It is AVERAGEIF with several conditions, such as the average sale for North Electronics orders. A row counts only when it passes every test.','It equals SUMIFS divided by COUNTIFS for the same conditions, which is a handy way to verify the result.'], a:'The average of only the people who match every filter.',
  h:['Start with the range to average.','Add pairs of criteria range and criterion.','Excel keeps the rows that pass all tests.','It averages the values of those rows.'],
  d:[FL(['North and Electronics'],[{ title:'Passing rows', rows:[['Order','Sales'],['O-101',12000],['O-106',7000]], hl:{1:'hit',2:'hit'} },{ title:'AVERAGEIFS', text:'19000 / 2 = **9500**' }])],
  x:[X('Variation','A numeric range as a condition','Average Electronics sales between 8000 and 12000.','Use the same column twice.','=AVERAGEIFS(D2:D9, C2:C9, "Electronics", D2:D9, ">=8000", D2:D9, "<=12000")',['Three conditions all must hold.'],'Orders 12000, 9500 and 11000 qualify: average 10833.',withHl(SALESLOG,{},'Sheet: Sales log')),
     X('Business case','Verifying a result','The average from AVERAGEIFS must be cross-checked.','Divide SUMIFS by COUNTIFS.','=SUMIFS(...) / COUNTIFS(...)',['Use the same conditions in both.','The results must match.'],'A mismatch signals a range or criteria error.')],
  e:[['Average range first','The argument order matches SUMIFS, not AVERAGEIF.'],['Same-size ranges','Different sizes give `#VALUE!`.'],['No match','`#DIV/0!`.'],['AND logic only','For OR, add separate results with care for weights.']],
  p:[P('Medium','Average sales of South Electronics orders.','Two criteria.','=AVERAGEIFS(D2:D9, B2:B9, "South", C2:C9, "Electronics")','(11000 + 13000) / 2 = 12000.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','Why is averaging two group averages wrong, and what do you do instead?','Group sizes.','Different group sizes need weighting. Use SUMIFS / COUNTIFS across both groups, or SUMPRODUCT.','A simple mean of means ignores group size.')],
  q:[Q('Basic','What is the argument order of AVERAGEIFS?','The average range first, then pairs of criteria range and criterion.',{ f:[['How does it differ from AVERAGEIF?','AVERAGEIF takes the average range last and supports one condition.']] }),
     Q('Scenario','How do you verify an AVERAGEIFS result?','Compare it with SUMIFS divided by COUNTIFS using the same criteria.',{ t:'Also compare against a pivot table.' })],
  r:RT(['Part','Rule'],[['First argument','Range to average'],['Logic','AND'],['No match','`#DIV/0!`'],['Check','`SUMIFS / COUNTIFS`']]), rel:['averageif','sumifs','countifs','criteria'] });

/* --- maxifs --- */
D('maxifs',{ l:'Intermediate', t:'MAXIFS returns the largest value among the rows that meet your conditions. It needs Excel 2019 or later.',
  i:['"What is the biggest North order?" needs a maximum with a condition. MAXIFS adds the filter that MAX does not have.','Before MAXIFS, analysts used array formulas. MAXIFS does the same without special entry, but only in modern versions.'], a:'Looking for the tallest person in one team.',
  h:['The first argument is the range to take the maximum from.','Add pairs of criteria range and criterion.','Excel keeps the rows that pass all tests.','It returns the largest value among them (0 if none).'],
  d:[FL(['North only'],[{ title:'North orders', rows:[['Order','Sales'],['O-101',12000],['O-103',15000],['O-106',7000]], hl:{2:'hit'} },{ title:'MAXIFS', text:'**15000**' }])],
  x:[X('Variation','The latest date for a customer','Find the most recent order date of Asha.','MAXIFS works on dates too.','=MAXIFS(B2:B100, A2:A100, "Asha")',['Dates are numbers, so the maximum is the latest.'],'Format the result as a date.'),
     X('Business case','Compatibility with older Excel','The file must work in Excel 2016.','Use an array formula instead.','=MAX(IF(B2:B9="North", D2:D9))   (Ctrl+Shift+Enter)',['The IF returns the sales for North and FALSE otherwise.','MAX ignores FALSE.'],'The result is 15000. MAXIFS is simpler when the version allows.')],
  e:[['No match returns 0','A 0 may look like a real maximum. Check with COUNTIFS.'],['Version','Needs Excel 2019, 2021 or Microsoft 365; older versions show #NAME?.'],['Same-size ranges','Different sizes give #VALUE!.'],['Text numbers','Ignored in the max range.']],
  p:[P('Medium','Highest Electronics sale.','One criterion.','=MAXIFS(D2:D9, C2:C9, "Electronics")','The largest is 13000.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','MAXIFS shows 0 for a region. What does it mean?','No match.','No rows matched (or all values were 0). Check the spelling and spaces with COUNTIFS.','The function cannot tell "no match" from a real 0.')],
  q:[Q('Basic','What does MAXIFS do?','It returns the maximum of a range for rows that meet one or more conditions.',{ f:[['What did people use before?','MAX(IF(...)) entered as an array formula.']] }),
     Q('Scenario','Your colleague uses Excel 2016. What do you use?','The array formula MAX(IF()), a pivot table with Max, or ask them to upgrade.',{ t:'The array formula works everywhere but is less readable.' })],
  r:RT(['Need','Formula'],[['Max by condition','`=MAXIFS(v, crit_range, crit)`'],['Older Excel','`=MAX(IF(c=x, v))`'],['Min by condition','`=MINIFS(...)`'],['Check matches','`=COUNTIFS(...)`']]), rel:['minifs','max','sumifs','averageifs'] });

/* --- minifs --- */
D('minifs',{ l:'Intermediate', t:'MINIFS returns the smallest value among the rows that meet your conditions. It needs Excel 2019 or later.',
  i:['MINIFS answers "what is the lowest price in this category?" or "the earliest order for this customer?".','Like MAXIFS, it returns 0 when nothing matches, which can look like a genuine minimum.'], a:'Looking for the cheapest item on one shelf.',
  h:['The first argument is the range to take the minimum from.','Add pairs of criteria range and criterion.','Excel keeps the rows that pass all tests.','It returns the smallest value among them.'],
  d:[FL(['Furniture only'],[{ title:'Furniture orders', rows:[['Order','Sales'],['O-102',8000],['O-103',15000],['O-107',6000]], hl:{3:'hit'} },{ title:'MINIFS', text:'**6000**' }])],
  x:[X('Variation','The first purchase date','Find the earliest order of a customer.','Dates work as numbers.','=MINIFS(B2:B100, A2:A100, "Asha")',['The smallest date is the earliest.'],'Format as a date.'),
     X('Business case','Cheapest positive price per category','Zero prices mean "not priced" and must be ignored.','Use two conditions.','=MINIFS(C2:C100, A2:A100, "Pens", C2:C100, ">0")',['The second condition excludes zeros.'],'The cheapest real price in the Pens category.')],
  e:[['No match returns 0','A 0 can be mistaken for the real minimum.'],['Version','Needs Excel 2019 or later.'],['Placeholders','Zeros and blanks as 0 become the minimum unless excluded.'],['Same-size ranges','Required.']],
  p:[P('Medium','Lowest North sale.','One criterion.','=MINIFS(D2:D9, B2:B9, "North")','North sales are 12000, 15000 and 7000, so the minimum is 7000.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','Return the lowest sale per region in a summary table.','Locked ranges and cell criteria.','=MINIFS($D$2:$D$9, $B$2:$B$9, F2) copied down.','Pair it with MAXIFS for a min-max table.')],
  q:[Q('Basic','What does MINIFS do?','It returns the minimum value of a range for rows that meet conditions.',{ f:[['What does it return if nothing matches?','0.']] }),
     Q('Scenario','How do you ignore zeros in a minimum by category?','Add a second condition ">0" on the same column.',{ t:'Better still, store missing prices as blanks.' })],
  r:RT(['Need','Formula'],[['Min by condition','`=MINIFS(v, crit_range, crit)`'],['Ignore zeros','add `v, ">0"`'],['Older Excel','`=MIN(IF(c=x, v))`'],['Max version','`=MAXIFS(...)`']]), rel:['maxifs','min','averageifs','sumifs'] });
})();
