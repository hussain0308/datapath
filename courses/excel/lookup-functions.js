/* Datapath | Excel | Lookup functions
 * Lessons in this file: vlookup, hlookup, xlookup, index, match, index-match, lookup-compare
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
  const { PRODUCTS, SALES, STAFF, MONTHLY, SALESLOG } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- vlookup --- */
'vlookup': {
  title:'VLOOKUP', tagline:'Find a value in the first column of a table and return something from the same row.',
  prereq:[],
  what:[
    'VLOOKUP searches for a value in the **first column** of a table.',
    'When it finds the value, it returns data from another column in the **same row**.',
    'The V stands for vertical: it looks down a column.',
    'Think of it as looking up a name in a phone book and reading the number next to it.'
  ],
  why:[
    'Bring details such as price, department or region from a master list into a report.',
    'Match two lists using a common key, such as an ID, without copy and paste.',
    'It is one of the most common Excel tasks in MIS and data analyst jobs.'
  ],
  syntax:{ code:'=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])', parts:[
    ['lookup_value','The value you are searching for, for example an ID such as P103.'],
    ['table_array','The table to search. Its first column must hold the lookup values.'],
    ['col_index_num','Which column of the table to return, counted from 1 starting at the first column of table_array.'],
    ['range_lookup','FALSE for an exact match. TRUE (or left out) for an approximate match on sorted data.']
  ]},
  points:[
    'It always searches the **leftmost column** of the table you give it.',
    'It can only return values from columns to the **right** of the lookup column.',
    'Use `FALSE` for IDs, names and codes. This gives an exact match.',
    'If the value appears more than once, VLOOKUP returns the **first** match.',
    'With an exact match, a missing value gives the `#N/A` error.',
    'Lock the table with dollar signs, like `$A$2:$D$6`, before copying the formula down.',
    'It is not case sensitive: "p103" and "P103" are treated the same.',
    'Approximate match (`TRUE`) finds the largest value less than or equal to the lookup value. The first column must be sorted ascending. It suits slabs and grade bands.'
  ],
  mistakes:[
    'Leaving out the last argument. Excel then uses approximate match and can return wrong answers without any error.',
    'Choosing a lookup value that is not in the first column of the table.',
    'Extra spaces or numbers stored as text, which cause `#N/A` even when the value looks present.',
    'Forgetting the dollar signs, so the table range shifts when the formula is copied down.',
    'Inserting a column inside the table. The column number does not update, so the formula can return the wrong column.'
  ],
  example:{
    title:'Finding the price of a product',
    scenario:'A store keeps a product list. A manager types a product ID and wants the price. The ID is in column A and the price is in column D.',
    table:withHl(PRODUCTS,{'A4':'find','D4':'hit','A2:D6':'range'},'Sheet: Products'),
    task:'Find the price of product P103.',
    formula:'=VLOOKUP("P103", A2:D6, 4, FALSE)',
    steps:[
      'Lookup value: "P103", the ID to search for.',
      'Table: A2:D6, where column A holds the IDs.',
      'Column number: 4, because Price is the 4th column of the table (A=1, B=2, C=3, D=4).',
      'FALSE: only accept an exact match.'
    ],
    result:'The formula returns 1499.'
  },
  practice:{
    q:'Using the Products table above, write a formula that returns the **Category** of product P104. Then change it so the ID is read from cell F2 and can be copied down.',
    hint:'Category is the 3rd column of the table. For copying down, lock the table range with $ signs.',
    solution:'=VLOOKUP("P104", A2:D6, 3, FALSE)\n=VLOOKUP(F2, $A$2:$D$6, 3, FALSE)',
    explain:'P104 is found in column A, and the 3rd column of the table is Category, so the result is Stationery. In the second formula, F2 holds the ID and $A$2:$D$6 stays fixed when copied down.'
  },
  interview:[
    { level:'Basic', q:'What is VLOOKUP and when would you use it?',
      a:'VLOOKUP searches for a value in the first column of a table and returns a value from another column in the same row. I use it to pull details such as price, department or region from a master list into a report, using a common key like an ID.' },
    { level:'Basic', q:'What is the difference between exact and approximate match in VLOOKUP?',
      a:'With FALSE, VLOOKUP returns a result only if it finds the value exactly, otherwise it gives #N/A. With TRUE, it finds the largest value that is less than or equal to the lookup value, and the first column must be sorted ascending. I use exact match for IDs and names, and approximate match for slabs like tax rates or grade bands.' },
    { level:'Intermediate', q:'What are the limitations of VLOOKUP?',
      a:'It can only look to the right of the lookup column, because it always searches the first column of the table. The column index is a fixed number, so inserting or deleting columns can break it. It returns only the first match, and one column per formula.' },
    { level:'Intermediate', q:'VLOOKUP returns #N/A, but you can see the value in the table. What do you check?',
      a:'I check for extra spaces (TRIM fixes this), numbers stored as text, or the reverse. I confirm the lookup value really is in the first column of the range, that the range includes the row, and that the last argument is FALSE, because approximate match on unsorted data can also fail.' },
    { level:'Scenario', q:'You have 10,000 orders and a customer master list. You need each order\'s region. How do you do it, and how do you handle IDs missing from the master?',
      a:'I use VLOOKUP with the customer ID as the lookup value, the master table locked with dollar signs, the region column number and FALSE. I wrap it in IFERROR to show "Not found" for missing IDs, then filter on that label to list the missing IDs and ask the data owner about them. I also check the master for duplicate IDs, because VLOOKUP only returns the first match.' }
  ],
  mcq:[
    { q:'Which column does VLOOKUP search for the lookup value?', o:['Any column in the sheet','The first (leftmost) column of table_array','The last column of table_array','The column given by col_index_num'], a:1,
      why:'VLOOKUP always searches the first column of the table. The column number only decides which column to return.' },
    { q:'In `=VLOOKUP(F2, A2:D6, 3, FALSE)`, what does the number 3 mean?', o:['Return the value from the 3rd column of A2:D6','Search in column 3 of the sheet','Return the 3rd match found','Look three rows down'], a:0,
      why:'col_index_num counts columns inside the table you gave, starting from 1.' },
    { q:'What happens if you leave out the last argument of VLOOKUP?', o:['Excel uses exact match','Excel shows an error','Excel uses approximate match, which can return wrong results on unsorted data','Excel returns all matches'], a:2,
      why:'The default is TRUE (approximate match). This is why you should type FALSE for IDs and names.' },
    { q:'What does VLOOKUP return with an exact match when the value is not in the table?', o:['0','An empty cell','#REF!','#N/A'], a:3,
      why:'#N/A means "not available". You can handle it with IFERROR.' },
    { q:'Which task can VLOOKUP NOT do directly?', o:['Return a value from a column to the left of the lookup column','Return a value from a column to the right','Use an exact match','Look up text values'], a:0,
      why:'Because the lookup column must be first in the table, VLOOKUP cannot return from columns on its left. INDEX + MATCH and XLOOKUP can.' }
  ],
  recap:[
    'VLOOKUP searches the first column of a table and returns a value from the same row.',
    'Always type FALSE for an exact match, and lock the table range with $ signs.',
    'It cannot look left, and it returns only the first match.'
  ]
},

/* --- hlookup --- */
'hlookup': {
  title:'HLOOKUP', tagline:'The sideways version of VLOOKUP: search across the top row, return from a row below.',
  prereq:['vlookup'],
  what:[
    'HLOOKUP searches for a value in the **first row** of a table.',
    'When it finds the value, it returns data from a row below, in the **same column**.',
    'The H stands for horizontal: it looks across a row.',
    'It suits reports where headings such as months run across the top.'
  ],
  why:[
    'Monthly or quarterly summary sheets often have months across the columns.',
    'Dashboards use it to show one month\'s numbers when a month is selected.'
  ],
  syntax:{ code:'=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])', parts:[
    ['lookup_value','The value to find in the top row, for example "Mar".'],
    ['table_array','The table to search. Its first row must hold the lookup values.'],
    ['row_index_num','Which row of the table to return, counted from 1 starting at the top row of the table.'],
    ['range_lookup','FALSE for an exact match. TRUE (or left out) for approximate match on sorted data.']
  ]},
  points:[
    'It always searches the **top row** of the table.',
    'It can only return from the top row or rows **below** it, never above.',
    'Row numbers count inside the table, not by sheet row number.',
    'Type `FALSE` for an exact match, just like VLOOKUP.',
    'A missing value gives `#N/A` with an exact match.',
    'It is less common than VLOOKUP because most data stores fields in columns.',
    'In Excel 2021 and Microsoft 365, XLOOKUP can replace it.'
  ],
  mistakes:[
    'Using VLOOKUP on data that is laid out sideways.',
    'Counting the row number from the sheet instead of from the top of the table.',
    'Leaving out FALSE and getting an approximate match.',
    'Starting the table range below the header row, so the lookup row is not first.'
  ],
  example:{
    title:'Finding revenue for a month',
    scenario:'A monthly summary has the months across the top and the metrics down the side. You want March revenue.',
    table:withHl(MONTHLY,{'D1':'find','D2':'hit','A1:E4':'range'},'Sheet: Monthly summary'),
    task:'Find the revenue for March.',
    formula:'=HLOOKUP("Mar", A1:E4, 2, FALSE)',
    steps:[
      'Lookup value: "Mar", searched in the top row of the table.',
      'Table: A1:E4. Row 1 holds the months, so it is the lookup row.',
      'Row number: 2, because Revenue is the 2nd row of the table.',
      'FALSE: exact match only.'
    ],
    result:'The formula returns 98000.'
  },
  practice:{
    q:'Using the Monthly summary table, write a formula that returns the **Units sold** in April.',
    hint:'Rows inside the table: 1 = month headings, 2 = Revenue, 3 = Units sold, 4 = Returns.',
    solution:'=HLOOKUP("Apr", A1:E4, 3, FALSE)',
    explain:'"Apr" is found in the top row (column E). Row 3 of the table is Units sold, so the result is 410.'
  },
  interview:[
    { level:'Basic', q:'What is the difference between VLOOKUP and HLOOKUP?',
      a:'VLOOKUP searches down the first column and returns a value from another column. HLOOKUP searches across the first row and returns a value from a row below it. I use HLOOKUP when headings run across the top, such as months in columns.' },
    { level:'Intermediate', q:'Why is HLOOKUP used less often than VLOOKUP?',
      a:'Most datasets store fields in columns and records in rows, which suits VLOOKUP. HLOOKUP is mainly for sideways layouts like monthly summary reports. In newer Excel versions, XLOOKUP handles both directions.' },
    { level:'Intermediate', q:'Can HLOOKUP return a value from a row above the lookup row?',
      a:'No. It searches the top row of the table and can only return from that row or the rows below it. For other layouts I use INDEX + MATCH or XLOOKUP.' },
    { level:'Scenario', q:'A dashboard has a month dropdown, and the months run across the columns of the data sheet. How do you show the selected month\'s revenue?',
      a:'I create the dropdown with a data validation list in a cell, say G1, then use =HLOOKUP(G1, A1:M4, 2, FALSE), wrapped in IFERROR in case the month is missing. When the user changes the dropdown, the revenue updates.' }
  ],
  mcq:[
    { q:'Where does HLOOKUP search for the lookup value?', o:['The first column of the table','The top (first) row of the table','Every cell in the table','The last row of the table'], a:1,
      why:'HLOOKUP searches the top row, and returns a value from a row below it.' },
    { q:'In `=HLOOKUP("Feb", A1:E4, 3, FALSE)`, what does 3 mean?', o:['The 3rd column','The 3rd match','The 3rd row of the table','Sheet row 3'], a:2,
      why:'row_index_num counts rows inside the table, starting at 1 for the top row of the table.' },
    { q:'When is HLOOKUP the right tool?', o:['Headings run across the top, such as months in columns','Data is in a long list with IDs down column A','You need to look up values to the left','You need to count rows'], a:0,
      why:'HLOOKUP is built for data laid out horizontally.' },
    { q:'Which modern function can replace both VLOOKUP and HLOOKUP?', o:['MATCH','XLOOKUP','COUNTIF','SUMIF'], a:1,
      why:'XLOOKUP works on both columns and rows, in Excel 2021 and Microsoft 365.' },
    { q:'What does HLOOKUP return with an exact match when the value is missing?', o:['#N/A','0','The first value','#VALUE!'], a:0,
      why:'Like VLOOKUP, a missing exact match gives #N/A.' }
  ],
  recap:[
    'HLOOKUP searches the top row and returns from a row below it.',
    'The row number counts from the top row of the table, starting at 1.',
    'It is for sideways data; XLOOKUP is the modern replacement.'
  ]
},

/* --- xlookup --- */
'xlookup': {
  title:'XLOOKUP', tagline:'The modern lookup: look in any direction, handle missing values, no column numbers.',
  prereq:['vlookup'],
  what:[
    'XLOOKUP finds a value in one range and returns the matching value from another range.',
    'You give it the **lookup range** and the **return range** separately.',
    'It works down columns and across rows with the same formula.',
    'It was designed to fix the weak points of VLOOKUP and HLOOKUP.'
  ],
  why:[
    'It can return values from the left of the lookup column.',
    'It has a built-in argument for "not found", so you do not need IFERROR for that case.',
    'Formulas are shorter and easier to read than INDEX + MATCH.'
  ],
  syntax:{ code:'=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])', parts:[
    ['lookup_value','The value to find.'],
    ['lookup_array','The single column or row to search in.'],
    ['return_array','The column or row that holds the answer. It must be the same size as lookup_array.'],
    ['if_not_found','Optional. What to show when there is no match, such as "Not found".'],
    ['match_mode','Optional. 0 exact (default), -1 exact or next smaller, 1 exact or next larger, 2 wildcard match.'],
    ['search_mode','Optional. 1 first to last (default), -1 last to first, 2 or -2 for binary search on sorted data.']
  ]},
  points:[
    'The default match is **exact**, so you do not need to type FALSE.',
    'It can look left or right, because lookup and return ranges are separate.',
    'There is no column number, so inserting columns does not break it.',
    'Use `if_not_found` to show your own message instead of `#N/A`.',
    'Set `search_mode` to `-1` to get the **last** match instead of the first.',
    'It works vertically and horizontally.',
    'It is available in **Excel 2021, Excel 2024 and Microsoft 365**, and Excel for the web. Excel 2019 and older do not have it.'
  ],
  mistakes:[
    'Using it in a file shared with people on Excel 2019 or older. They will see `#NAME?`.',
    'Choosing a return range with a different size than the lookup range.',
    'Selecting more than one column as lookup_array.',
    'Using IFERROR everywhere instead of if_not_found, which hides unrelated errors too.'
  ],
  example:{
    title:'Finding an employee name from an ID',
    scenario:'A staff list has the name in column A and the employee ID in column C. HR types an ID and wants the name. The answer is to the left of the ID.',
    table:withHl(STAFF,{'C4':'find','A4':'hit'},'Sheet: Staff'),
    task:'Find the employee with ID E203.',
    formula:'=XLOOKUP("E203", C2:C6, A2:A6, "Not found")',
    steps:[
      'Lookup value: "E203".',
      'Lookup array: C2:C6, the column of IDs.',
      'Return array: A2:A6, the column of names. It is on the left, which VLOOKUP could not do.',
      'if_not_found: show "Not found" when the ID does not exist.'
    ],
    result:'The formula returns Arjun Reddy.'
  },
  practice:{
    q:'Using the Staff table, write a formula that returns the **Department** for ID E204, and shows "Invalid ID" when the ID does not exist.',
    hint:'The IDs are in C2:C6 and departments are in B2:B6. The 4th argument is the not-found message.',
    solution:'=XLOOKUP("E204", C2:C6, B2:B6, "Invalid ID")',
    explain:'E204 is found in C5, so the formula returns the matching value in B5, which is HR. If you search for E999, it returns Invalid ID.'
  },
  interview:[
    { level:'Basic', q:'Why is XLOOKUP preferred over VLOOKUP?',
      a:'XLOOKUP separates the lookup and return ranges, so it can look left or right. It defaults to exact match, has a built-in if_not_found argument, does not use a column number so inserting columns does not break it, and works both vertically and horizontally.' },
    { level:'Intermediate', q:'What is the if_not_found argument, and how is it different from IFERROR?',
      a:'if_not_found is the fourth argument. It returns your own text, such as "Not found", when there is no match. IFERROR hides every kind of error, including mistakes like a wrong range, so if_not_found is safer because it only handles the no-match case.' },
    { level:'Intermediate', q:'How do you get the last match instead of the first when there are duplicates?',
      a:'Set search_mode to -1. XLOOKUP then searches from the bottom up, so it returns the last match.' },
    { level:'Scenario', q:'Your team shares a workbook, and some colleagues use Excel 2016. Would you use XLOOKUP?',
      a:'No. XLOOKUP is not available in Excel 2019 or older, so those users see #NAME?. For shared workbooks I would use INDEX + MATCH, which works in every version, or confirm that everyone has Excel 2021 or Microsoft 365.' }
  ],
  mcq:[
    { q:'Which XLOOKUP argument lets you show your own message when no match is found?', o:['match_mode','search_mode','if_not_found','return_array'], a:2,
      why:'if_not_found is the optional fourth argument.' },
    { q:'What is the default match type in XLOOKUP?', o:['Approximate match','Exact match','Wildcard match','Sorted match'], a:1,
      why:'The default is exact match (match_mode 0), so you do not need to type FALSE.' },
    { q:'Can XLOOKUP return a value from a column to the left of the lookup column?', o:['No, never','Only if sorted','Yes, because lookup and return ranges are separate','Only with IFERROR'], a:2,
      why:'This is one of its biggest advantages over VLOOKUP.' },
    { q:'Which Excel version does NOT have XLOOKUP?', o:['Microsoft 365','Excel 2021','Excel for the web','Excel 2019'], a:3,
      why:'XLOOKUP arrived with Microsoft 365 and Excel 2021. Excel 2019 and older do not support it.' },
    { q:'What does `search_mode` set to -1 do?', o:['Searches last to first and returns the last match','Returns an error','Sorts the data','Returns every match'], a:0,
      why:'-1 reverses the search direction, which is useful when you want the most recent entry in a list.' }
  ],
  recap:[
    'XLOOKUP takes a lookup range and a separate return range.',
    'It defaults to exact match and has a built-in not-found argument.',
    'It needs Excel 2021 or Microsoft 365; use INDEX + MATCH for older versions.'
  ]
},

/* --- index --- */
'index': {
  title:'INDEX', tagline:'Return the value at a given row and column position inside a range.',
  prereq:[],
  what:[
    'INDEX returns the value at a **position** inside a range.',
    'You tell it which row and which column of the range to use.',
    'It does not search for anything. You give it the position.',
    'It is usually paired with MATCH, which finds the position.'
  ],
  why:[
    'It is the first half of INDEX + MATCH, a lookup that works in every Excel version.',
    'It picks values from a table by position, such as the 3rd item in a list.',
    'It is useful in reports where positions are known or calculated.'
  ],
  syntax:{ code:'=INDEX(array, row_num, [column_num])', parts:[
    ['array','The range to take the value from.'],
    ['row_num','Which row of the range, counted from 1 at the top of the range.'],
    ['column_num','Optional. Which column of the range, counted from 1 at the left of the range. Not needed for a one-column range.']
  ]},
  points:[
    'Positions count **inside the range** you give, not from the sheet edges.',
    'For a single column or row, you only need one position number.',
    'A position outside the range gives the `#REF!` error.',
    'A row_num of `0` returns the whole column, for example inside `SUM`.',
    'INDEX does not look for values. It only fetches by position.',
    'It changes nothing in the sheet. It only returns a value.'
  ],
  mistakes:[
    'Counting positions from the sheet row or column number instead of from the start of the range.',
    'Asking for a row or column larger than the range, which gives #REF!.',
    'Expecting INDEX to search for a value. That is the job of MATCH.',
    'Including the header row in the range and then being off by one.'
  ],
  example:{
    title:'Picking a value by position',
    scenario:'A quarterly sales table lists regions down the side and quarters across the top. You need the value in the 3rd row, 2nd column of the numbers.',
    table:withHl(SALES,{'C4':'hit','B2:D5':'range'},'Sheet: Sales (in thousands)'),
    task:'Return the value in the 3rd row and 2nd column of B2:D5.',
    formula:'=INDEX(B2:D5, 3, 2)',
    steps:[
      'Array: B2:D5, the numbers without the headings.',
      'Row 3 of this range is East (sheet row 4).',
      'Column 2 of this range is Q2 (sheet column C).'
    ],
    result:'The formula returns 360, the Q2 sales of East.'
  },
  practice:{
    q:'Using the Sales table, write a formula that returns **West\'s Q3** sales using INDEX only.',
    hint:'In B2:D5, West is the 4th row and Q3 is the 3rd column.',
    solution:'=INDEX(B2:D5, 4, 3)',
    explain:'Row 4 of the range is West, column 3 is Q3, so the result is 470.'
  },
  interview:[
    { level:'Basic', q:'What does the INDEX function do?',
      a:'INDEX returns the value at a given row and column position inside a range. For example, =INDEX(B2:D5,3,2) returns the value in the 3rd row and 2nd column of that range.' },
    { level:'Intermediate', q:'How is INDEX different from VLOOKUP?',
      a:'VLOOKUP searches for a value and returns related data. INDEX does not search, it fetches by position. That is why INDEX is usually paired with MATCH, which finds the position.' },
    { level:'Intermediate', q:'What does a row_num of 0 do in INDEX?',
      a:'It returns every row of the chosen column. It is used inside other functions, for example =SUM(INDEX(B2:D5,0,2)) totals the second column of the range.' },
    { level:'Intermediate', q:'Why does =INDEX(B2:D5,5,1) show an error?',
      a:'The range B2:D5 has only 4 rows, so row 5 is outside it. INDEX returns #REF! when the position is outside the range.' }
  ],
  mcq:[
    { q:'What does `=INDEX(B2:D5, 2, 1)` return in the Sales table?', o:['380','450','520','410'], a:0,
      why:'Row 2 of the range is South and column 1 is Q1. South\'s Q1 sales are 380.' },
    { q:'Does INDEX search for a value?', o:['Yes, in the first column','Yes, in the first row','No, it fetches by position','Only with FALSE'], a:2,
      why:'INDEX uses positions. MATCH is the function that finds positions.' },
    { q:'In INDEX, row_num is counted from:', o:['The first row of the range you give','Row 1 of the sheet','The header row of the sheet','The last row of the range'], a:0,
      why:'Positions are relative to the range, not to the sheet.' },
    { q:'Which function is usually paired with INDEX to find the position?', o:['SUM','MATCH','COUNT','LEN'], a:1,
      why:'MATCH returns a position, which INDEX can use.' },
    { q:'What does `=INDEX(A2:A10, 3)` return?', o:['The value in A3','The value in A4','The 3rd row of the sheet','The value in C2'], a:1,
      why:'The 3rd cell of A2:A10 is A4 (A2 is 1st, A3 is 2nd, A4 is 3rd).' }
  ],
  recap:[
    'INDEX returns the value at a row and column position inside a range.',
    'Positions count from the start of the range, not from the sheet edge.',
    'INDEX does not search. Pair it with MATCH to find the position.'
  ]
},

/* --- match --- */
'match': {
  title:'MATCH', tagline:'Find where a value sits in a row or column and return its position.',
  prereq:[],
  what:[
    'MATCH looks for a value in a single row or column.',
    'It returns the **position** of the value, not the value itself.',
    'For example, if East is the 3rd item in a list, MATCH returns 3.',
    'It is the second half of INDEX + MATCH.'
  ],
  why:[
    'It turns a value into a position that INDEX can use.',
    'It checks where something sits in a list, such as a column heading.',
    'With approximate match it finds the right band for a number, such as a commission slab.'
  ],
  syntax:{ code:'=MATCH(lookup_value, lookup_array, [match_type])', parts:[
    ['lookup_value','The value to find.'],
    ['lookup_array','A single row or column to search.'],
    ['match_type','0 exact match. 1 (default) largest value less than or equal, needs ascending data. -1 smallest value greater than or equal, needs descending data.']
  ]},
  points:[
    'It returns a **number**: the relative position inside the range.',
    'Use `0` as the third argument for an exact match.',
    'If you leave match_type out, Excel uses `1`, which expects sorted data.',
    'The range must be a single row or a single column.',
    'It is not case sensitive.',
    'With match_type 0 and text, wildcards work: `*` for any characters and `?` for one character.',
    'A value that is not found gives `#N/A`.'
  ],
  mistakes:[
    'Leaving out the 0 and getting wrong results on unsorted data.',
    'Expecting the value back instead of its position.',
    'Using a two-dimensional range as lookup_array.',
    'Extra spaces or text-versus-number mismatches that cause #N/A.'
  ],
  example:{
    title:'Finding the position of a region',
    scenario:'You need to know which position East holds in the region list, so INDEX can use it later.',
    table:withHl(SALES,{'A4':'find','A2:A5':'range'},'Sheet: Sales (in thousands)'),
    task:'Find the position of East in the region list.',
    formula:'=MATCH("East", A2:A5, 0)',
    steps:[
      'Lookup value: "East".',
      'Lookup array: A2:A5, the list of regions.',
      '0: exact match.'
    ],
    result:'The formula returns 3, because East is the 3rd item in A2:A5.'
  },
  practice:{
    q:'Using the Sales table, write a formula that returns the **position of Q3** in the heading row.',
    hint:'The headings Q1, Q2, Q3 are in B1:D1. Use 0 for an exact match.',
    solution:'=MATCH("Q3", B1:D1, 0)',
    explain:'Q3 is the 3rd item in B1:D1, so MATCH returns 3.'
  },
  interview:[
    { level:'Basic', q:'What does MATCH return?',
      a:'MATCH returns the relative position of a value inside a single row or column, not the value itself. For example, =MATCH("East",A2:A5,0) returns 3 when East is the third item.' },
    { level:'Intermediate', q:'Explain the three match types in MATCH.',
      a:'0 is exact match, which is what I want most of the time. 1, the default, finds the largest value that is less than or equal to the lookup value and needs ascending data. -1 finds the smallest value that is greater than or equal and needs descending data. Leaving the argument out can quietly give wrong answers.' },
    { level:'Intermediate', q:'Where is approximate MATCH useful?',
      a:'For banded lookups, such as finding which commission slab a sale falls into. If the slab starting points are sorted ascending, MATCH(sale, slab_starts, 1) gives the position of the slab.' },
    { level:'Scenario', q:'MATCH returns #N/A for a value that looks present. What do you check?',
      a:'I check for trailing spaces, numbers stored as text, spelling differences, and that match_type is 0. TRIM removes extra spaces, and VALUE or multiplying by 1 converts text numbers.' }
  ],
  mcq:[
    { q:'What does MATCH return?', o:['The matching value','The position of the value in the range','TRUE or FALSE','The row number of the sheet'], a:1,
      why:'MATCH returns a position number relative to the range.' },
    { q:'What does `=MATCH("South", A2:A5, 0)` return in the Sales table?', o:['1','2','380','South'], a:1,
      why:'South is the 2nd item in A2:A5.' },
    { q:'Which match_type gives an exact match?', o:['1','-1','0','2'], a:2,
      why:'0 means exact match.' },
    { q:'What happens if you leave out match_type?', o:['Exact match is used','Excel uses 1, which expects ascending sorted data','An error appears','Excel uses -1'], a:1,
      why:'The default is 1. On unsorted data this can give wrong results.' },
    { q:'What does `=MATCH("W*", A2:A5, 0)` return in the Sales table?', o:['3','1','4','#N/A'], a:2,
      why:'The wildcard W* matches West, the 4th item.' }
  ],
  recap:[
    'MATCH returns the position of a value in a single row or column.',
    'Use 0 as the third argument for an exact match.',
    'On its own it gives a number; with INDEX it becomes a lookup.'
  ]
},

/* --- index-match --- */
'index-match': {
  title:'INDEX + MATCH', tagline:'Pair the two to build a flexible lookup that works in every Excel version.',
  prereq:['index','match'],
  what:[
    '**MATCH** finds the position of the lookup value.',
    '**INDEX** uses that position to return a value from another range.',
    'Together they work like a lookup that can go left, right, or both ways.',
    'They work in all Excel versions, including old ones.'
  ],
  why:[
    'You can return from a column to the left of the lookup column.',
    'Inserting columns does not break it, because it points directly at the return range.',
    'It supports two-way lookups, finding a row and a column at once.',
    'Many existing models use it, so analysts are expected to read and write it.'
  ],
  syntax:{ code:'=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))', parts:[
    ['return_range','The column that holds the answer.'],
    ['lookup_value','The value to search for.'],
    ['lookup_range','The column to search in. It must be the same size as return_range.'],
    ['0','Exact match. Always include it.']
  ]},
  points:[
    'MATCH runs first and gives a position. INDEX then uses that position.',
    'The return range and lookup range must **line up row by row**.',
    'It can look left or right, because the two ranges are separate.',
    'For a two-way lookup, use two MATCH functions: one for the row and one for the column.',
    'Always use `0` in MATCH for an exact match.',
    'Wrap it in `IFERROR` if you want a friendly message for missing values.'
  ],
  mistakes:[
    'Forgetting the 0 in MATCH.',
    'Using ranges of different sizes or starting at different rows.',
    'Including the header in one range and not the other, which makes the answer off by one row.',
    'Using XLOOKUP in a file for people on older Excel when INDEX + MATCH would work for everyone.'
  ],
  example:{
    title:'Two-way lookup: sales for a region and a quarter',
    scenario:'A manager picks a region and a quarter and wants the sales number. You need to find the row for the region and the column for the quarter.',
    table:withHl(SALES,{'A4':'find','C1':'find','C4':'hit','B2:D5':'range'},'Sheet: Sales (in thousands)'),
    task:'Find the sales for East in Q2.',
    formula:'=INDEX(B2:D5, MATCH("East", A2:A5, 0), MATCH("Q2", B1:D1, 0))',
    steps:[
      'MATCH("East", A2:A5, 0) returns 3, the row position.',
      'MATCH("Q2", B1:D1, 0) returns 2, the column position.',
      'INDEX(B2:D5, 3, 2) returns the value at row 3, column 2 of the range.'
    ],
    result:'The formula returns 360.'
  },
  practice:{
    q:'Using the Staff table, write an INDEX + MATCH formula that returns the **Employee** name for ID E205. The name is to the left of the ID.',
    table:withHl(STAFF,{},'Sheet: Staff'),
    hint:'Return range: A2:A6. Lookup range: C2:C6. Use 0 in MATCH.',
    solution:'=INDEX(A2:A6, MATCH("E205", C2:C6, 0))',
    explain:'MATCH finds E205 at position 5 in C2:C6. INDEX returns the 5th value in A2:A6, which is Kiran Rao.'
  },
  interview:[
    { level:'Basic', q:'Why do we combine INDEX and MATCH?',
      a:'INDEX returns a value by position and MATCH finds that position. Combined, MATCH finds the row where the key is, and INDEX returns the value from that row in whichever column I choose.' },
    { level:'Intermediate', q:'What are the advantages of INDEX + MATCH over VLOOKUP?',
      a:'It can look left as well as right, it is not affected when columns are inserted because it points directly at the return column, it supports two-way lookups, and it works in every Excel version.' },
    { level:'Intermediate', q:'Explain what =INDEX(C2:C6, MATCH("E203", A2:A6, 0)) does, step by step.',
      a:'MATCH looks for "E203" in A2:A6 and returns its position, say 3. INDEX then returns the 3rd value in C2:C6.' },
    { level:'Scenario', q:'Someone inserts a new column into your table and your VLOOKUP now shows wrong data. How does INDEX + MATCH help?',
      a:'VLOOKUP uses a fixed column number, so after the insert the number can point to a different column. INDEX + MATCH references the return column directly, so Excel moves the reference automatically.' },
    { level:'Scenario', q:'When would you choose INDEX + MATCH over XLOOKUP?',
      a:'XLOOKUP is simpler to write and read, so I use it when everyone has Excel 2021 or Microsoft 365. I use INDEX + MATCH for compatibility with older versions, and when I am working in existing models that already use it.' }
  ],
  mcq:[
    { q:'In `=INDEX(B2:B10, MATCH(F1, A2:A10, 0))`, what does MATCH provide?', o:['The final answer','The position that INDEX uses','The sum of the range','The column number'], a:1,
      why:'MATCH returns the position of F1 in A2:A10, and INDEX returns the value at that position in B2:B10.' },
    { q:'Why do we use 0 as the last argument of MATCH here?', o:['It sorts the data','It makes the formula faster','It gives an exact match','It returns the last match'], a:2,
      why:'0 asks for an exact match, which is what lookups need.' },
    { q:'Which option works in Excel 2010?', o:['XLOOKUP','INDEX + MATCH','Dynamic arrays','All of them'], a:1,
      why:'INDEX and MATCH are old functions that exist in all versions.' },
    { q:'Why is INDEX + MATCH safer than VLOOKUP when columns are inserted?', o:['It copies the table automatically','It locks the sheet','The return range is a direct reference that Excel updates','It ignores new columns'], a:2,
      why:'VLOOKUP uses a fixed number, while INDEX + MATCH points at actual ranges.' },
    { q:'How do you build a two-way lookup (row and column)?', o:['Use two MATCH functions inside INDEX','Use two VLOOKUPs','Use SUM twice','Use two IF functions'], a:0,
      why:'One MATCH gives the row position and the other gives the column position.' }
  ],
  recap:[
    'MATCH finds the position and INDEX returns the value at that position.',
    'It looks left or right, survives inserted columns, and works in every version.',
    'Always use 0 in MATCH, and keep both ranges the same size.'
  ]
},

/* --- lookup-compare --- */
'lookup-compare': {
  title:'VLOOKUP vs XLOOKUP vs INDEX + MATCH', tagline:'Know which lookup function to pick and be able to explain why.',
  prereq:['vlookup','xlookup','index-match'],
  whatTitle:'What are we comparing?',
  what:[
    'All three find a value by a key and return related data.',
    'They differ in direction, defaults, error handling and Excel version support.',
    '"Which lookup would you use, and why?" is one of the most common Excel interview questions.'
  ],
  why:[
    'Picking the right one avoids broken reports and wrong numbers.',
    'You can explain your choice clearly in an interview or to a teammate.'
  ],
  compare:{
    headers:['','VLOOKUP','XLOOKUP','INDEX + MATCH'],
    rows:[
      ['Look to the left of the key','No','Yes','Yes'],
      ['Default match','Approximate if the last argument is left out','Exact','MATCH defaults to approximate, so type 0'],
      ['Missing value','#N/A, wrap in IFERROR','Built-in if_not_found','#N/A, wrap in IFERROR'],
      ['Inserting columns','Can break (column number)','Safe','Safe'],
      ['Excel versions','All','2021, 2024, Microsoft 365, web','All'],
      ['Ease of writing','Easy','Easy','Moderate']
    ]
  },
  points:[
    '**VLOOKUP**: simple and widely known, but it cannot look left and uses a fixed column number.',
    '**XLOOKUP**: the cleanest option when everyone has a modern Excel version.',
    '**INDEX + MATCH**: the safe choice for older Excel and for existing models.',
    'For sideways data, use HLOOKUP, XLOOKUP, or INDEX + MATCH.'
  ],
  mistakes:[
    'Choosing VLOOKUP out of habit when the return column is on the left.',
    'Sharing an XLOOKUP workbook with people on Excel 2019 or older.',
    'Forgetting 0 in MATCH or FALSE in VLOOKUP.'
  ],
  example:{
    title:'Choosing the right function',
    unordered:true,
    scenario:'Three situations from a typical analyst week, and the choice for each.',
    steps:[
      'The ID is in column D, the name is in column A, and everyone uses Microsoft 365. Choose **XLOOKUP**: it looks left and is simple to read.',
      'The same task, but one colleague uses Excel 2016. Choose **INDEX + MATCH**: it works in every version.',
      'You need the commission rate for a sale value, using slabs sorted ascending. Choose **VLOOKUP with TRUE**, or XLOOKUP with match_mode -1, since approximate match is wanted.'
    ],
    result:'Rule of thumb: XLOOKUP for modern files, INDEX + MATCH for compatibility, VLOOKUP when it is already the standard in the team.'
  },
  practice:{
    q:'Choose the best function and say why. (a) Find the price for a product ID when the price column is to the left of the ID, in a file used only on Microsoft 365. (b) Same task in a file that people on Excel 2016 also open.',
    hint:'Think about direction (left lookup) and Excel version support.',
    solution:'(a) XLOOKUP\n(b) INDEX + MATCH',
    explain:'(a) XLOOKUP looks left and is simple. (b) XLOOKUP does not exist in Excel 2016, so INDEX + MATCH is the safe choice, and it also looks left.'
  },
  interview:[
    { level:'Basic', q:'What are the key differences between VLOOKUP and XLOOKUP?',
      a:'XLOOKUP can look left, defaults to exact match, has a built-in not-found argument, and does not use a column number. VLOOKUP only looks right, defaults to approximate match when the last argument is omitted, and can break when columns are inserted.' },
    { level:'Intermediate', q:'When would you still use INDEX + MATCH today?',
      a:'When the workbook must work in older Excel versions, and when I am maintaining existing models built with it. It also handles two-way lookups well.' },
    { level:'Intermediate', q:'Which of the three defaults to approximate match, and why does it matter?',
      a:'VLOOKUP does when the last argument is left out, and MATCH does when match_type is left out. On unsorted data this can return wrong results without any error, so I always type FALSE or 0. XLOOKUP defaults to exact match.' },
    { level:'Scenario', q:'Your manager sends a workbook to colleagues on mixed Excel versions. Which lookup do you use, and why?',
      a:'INDEX + MATCH, because it works in every version and still allows left lookups. If I confirmed everyone has Excel 2021 or Microsoft 365, I would switch to XLOOKUP for readability.' }
  ],
  mcq:[
    { q:'Which function cannot return a value from a column to the left of the lookup column?', o:['XLOOKUP','INDEX + MATCH','VLOOKUP','All of them can'], a:2,
      why:'VLOOKUP always searches the first column of its table, so it can only return from the right.' },
    { q:'What happens in VLOOKUP when you leave out the last argument?', o:['It uses exact match','It uses approximate match','It returns an error','It returns all matches'], a:1,
      why:'The default is TRUE, approximate match.' },
    { q:'Which lookup is the safest choice for a workbook shared with Excel 2016 users?', o:['XLOOKUP','INDEX + MATCH','Dynamic arrays','LET'], a:1,
      why:'INDEX + MATCH works in all versions.' },
    { q:'Which function has a built-in argument for "not found"?', o:['VLOOKUP','HLOOKUP','XLOOKUP','MATCH'], a:2,
      why:'XLOOKUP\'s fourth argument, if_not_found, handles this.' },
    { q:'Which single function can replace both VLOOKUP and HLOOKUP in modern Excel?', o:['INDEX','XLOOKUP','COUNTIF','OFFSET'], a:1,
      why:'XLOOKUP works on columns and rows.' }
  ],
  recap:[
    'XLOOKUP for modern files, INDEX + MATCH for older Excel and existing models.',
    'VLOOKUP cannot look left and defaults to approximate match when FALSE is left out.',
    'Always be ready to explain your choice in terms of direction, defaults and version.'
  ]
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- vlookup --- */
DEEP['vlookup'] = {
  level:'Beginner to Intermediate',
  tldr:'VLOOKUP finds a value in the **first column** of a table, then reads across the number of columns you give it.',
  intuition:{ text:[
    'Think of a printed phone directory. You search the name column on the left, find the row, and then read across to the phone number. VLOOKUP does exactly that: the lookup value is the name, the first column of your table is the directory, and col_index_num is how many columns you move to the right.',
    'Two things follow from this picture. It can only read to the **right** of the column it searches, and the number you give is a **position inside the table**, so inserting a column in the middle can change which column you read.'
  ], analogy:'Looking up a contact: find the name in column A, then slide your finger across to the phone column.' },
  how:[
    'Excel takes the lookup value (for example the text P103).',
    'It scans the **first column** of table_array from top to bottom.',
    'With FALSE it looks for an exact match; with TRUE it looks for the largest value that is not bigger (the column must be sorted ascending).',
    'When it finds the row, it counts across `col_index_num` columns, with the first column counted as 1.',
    'It returns that cell. If nothing matches, it returns `#N/A`.'
  ],
  diagrams:[
    { type:'flow', arrows:['exact match in row 4','move to column 4'], panels:[
      { title:'1. Lookup value', text:'"P103"' },
      { title:'2. Search the first column (A)', rows:[['A: ProductID','B: Product','C: Category','D: Price'],['P101','Wireless Mouse','Accessories',799],['P102','USB-C Cable','Accessories',349],['P103','Laptop Stand','Furniture',1499],['P104','Notebook Pack','Stationery',220],['P105','Desk Lamp','Furniture',899]], hl:{3:'find'} },
      { title:'3. Read column 4', text:'**1499**', note:'col_index_num = 4' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Approximate match for commission slabs', scenario:'Commission depends on which slab the sales value falls into. The slab table is sorted ascending.', table:withHl({rows:[['Sales from','Rate'],[0,'0%'],[10000,'2%'],[50000,'5%'],[100000,'8%']]},{'A4':'find','B4':'hit'},'Sheet: Slabs'),
      task:'Find the commission rate for sales of 72000.', formula:'=VLOOKUP(72000, A2:B5, 2, TRUE)', steps:['TRUE asks for the largest value that is less than or equal to 72000.','That is 50000, in row 4.','Column 2 of that row holds the rate.'], result:'The formula returns 5%. If the slab column were not sorted ascending, the result could be silently wrong.' },
    { level:'Business case', title:'Bringing the region into 10,000 orders', scenario:'The order sheet has only a customer id. The region lives in a separate customer master. Some ids are missing from the master.',
      table:withHl({rows:[['OrderID','CustID','Region'],['S-1','C-02','Delhi'],['S-2','C-01','Pune'],['S-3','C-99','Not found']]},{'B2:B4':'find','C2:C4':'hit'},'Sheet: Orders (Region column holds the formula)'),
      task:'Fill the Region column safely, so it can be copied down.', formula:'=IFERROR(VLOOKUP(B2, Master!$A$2:$B$500, 2, FALSE), "Not found")',
      steps:['The master range is locked with dollar signs so it does not slide down.','FALSE forces an exact match on the customer id.','IFERROR replaces #N/A with a label, which can then be filtered to list ids missing from the master.'], result:'Orders with a known customer get their region, and S-3 shows Not found, ready for follow-up with the data owner.' }
  ],
  edge:[
    { t:'Duplicates: only the first match counts', d:'If the key appears twice in the first column, VLOOKUP silently returns the first. Check the master for duplicates with COUNTIF before trusting it.' },
    { t:'Numbers stored as text', d:'`123` (number) and `"123"` (text) look the same but do not match. Convert with VALUE, multiply by 1, or Text to Columns.' },
    { t:'Hidden spaces', d:'`"P103 "` with a trailing space fails to match `"P103"`. Clean the data with TRIM or compare `LEN()` of both sides.' },
    { t:'Forgetting FALSE', d:'The default is approximate match. On unsorted data it can return a wrong row with no error at all.' },
    { t:'Inserted columns', d:'The column number is fixed. Insert a column inside the table and `4` may now point to a different column. INDEX/MATCH and XLOOKUP do not have this problem.' },
    { t:'Performance on big sheets', d:'Exact match scans the column top to bottom. Thousands of lookups over huge ranges slow a workbook. Limit the range, or use XLOOKUP/INDEX-MATCH with exact ranges.' },
    { t:'Wildcards in the lookup value', d:'With FALSE, `"P1*"` matches the first ID starting with P1. Useful, but easy to trigger by accident when the text contains * or ?.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the Category for the product ID typed in F2, showing "Not found" for unknown ids, in a way that can be copied down.', table:withHl(PRODUCTS,{},'Sheet: Products'), hint:'Lock the table with $, use FALSE, wrap with IFERROR.',
      solution:'=IFERROR(VLOOKUP($F$2, $A$2:$D$6, 3, FALSE), "Not found")', explain:'For P104 the result is Stationery. For an unknown id, VLOOKUP gives #N/A and IFERROR shows Not found. In a copied-down column use F2 without the dollars so it moves with each row.' },
    { level:'Interview', q:'A VLOOKUP returns #N/A although P103 is clearly in the table. List your checks in order.', hint:'Think about what can make two equal-looking values different.',
      solution:'1. Is the key really in the FIRST column of the range?\n2. Is the last argument FALSE?\n3. Trailing or double spaces: compare LEN() and use TRIM.\n4. Text versus number: ISNUMBER on both sides.\n5. Is the range locked and does it include the row?\n6. Non-breaking spaces from web data: SUBSTITUTE(x, CHAR(160), "").', explain:'The answer to this question is the process, not one cause. Naming a sequence from cheapest to most obscure checks shows interviewers that you debug systematically.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How does VLOOKUP work, and what are its limitations?', a:'VLOOKUP searches the first column of a table for a value and returns a value from another column in the same row, counted from the left. Its limitations are that it can only look to the right of the lookup column, the column number is fixed so inserted columns can break it, it returns only the first match, and a forgotten FALSE gives approximate matching.',
      structure:'Describe the mechanism in one sentence, then list limitations in order of how often they bite: direction, fixed column number, first match, approximate default.',
      follow:[ { q:'What does the fourth argument do?', a:'FALSE (or 0) means exact match. TRUE (or omitted) means approximate match on a sorted first column. I use FALSE for ids and names, and TRUE for slabs.' },
               { q:'What does #N/A tell you?', a:'No match was found. It is the expected result for a missing key, so I handle it with IFERROR or IFNA, and I check for spaces and type mismatches when a key looks present.' } ] },
    { level:'Intermediate', q:'VLOOKUP, INDEX/MATCH or XLOOKUP: which would you choose and why?', a:'If everyone has Excel 2021 or Microsoft 365, XLOOKUP, because it looks left and right, defaults to exact match, has a not-found argument and is not broken by inserted columns. For compatibility with older versions, INDEX/MATCH. I use VLOOKUP when it is already the standard in the team or for quick one-off lookups.',
      tradeoff:'XLOOKUP is easiest to read but not available in Excel 2019 or earlier. INDEX/MATCH works everywhere but is longer. VLOOKUP is the most widely understood.',
      follow:[ { q:'Which is fastest?', a:'Differences are small for normal workbooks. For very large sheets, limiting ranges and sorting with a binary search (approximate match) matter more than the function choice.' } ] },
    { level:'Scenario', q:'You must add the customer region to 100,000 orders, but some customer ids are not in the master. How do you proceed?', a:'I clean both key columns (TRIM, same data type), check the master for duplicate ids, then use an exact-match lookup with IFERROR returning a clear label. I filter on that label to list missing ids, and report them rather than leaving blanks. Then I convert the lookups to values if the file will be shared.',
      structure:'Prepare the data, build the lookup, handle misses, validate the result, then deliver.',
      follow:[ { q:'How would you validate it?', a:'Compare the count of rows with a region against the count of orders, and spot-check a few ids by hand. Also check the master for duplicates, because VLOOKUP hides them.' } ] }
  ],
  ref:{ headers:['Argument','Meaning','Tip'], rows:[['`lookup_value`','What you search for','Clean with TRIM; match the data type'],['`table_array`','Where to search','Lock with `$A$2:$D$100`'],['`col_index_num`','Which column to return','Counts from 1 inside the table'],['`range_lookup`','FALSE exact, TRUE approximate','Almost always FALSE']] },
  related:['xlookup','index-match','lookup-compare','iferror','hlookup']
};

/* --- hlookup --- */
D('hlookup',{ l:'Beginner to Intermediate', t:'HLOOKUP searches the top row of a table and returns a value from a row below it. It is VLOOKUP turned sideways.',
  i:['Some reports have their headings across the top, such as months in columns. VLOOKUP searches down, so it cannot read them. HLOOKUP searches across the first row and then moves down a number of rows.','It is less common today, because XLOOKUP handles both directions, but it still appears in older workbooks and in interviews.'], a:'Finding the column heading, then reading down it to the row you want.',
  h:['Give the value to find in the top row, such as "Mar".','Give the table, with the heading row as its first row.','Give the row number to return, counted from 1 in the table.','Use FALSE for an exact match.'],
  d:[FL(['find Mar in row 1','go down 2 rows'],[{ title:'Table A1:E4', rows:[['Metric','Jan','Feb','Mar','Apr'],['Revenue',120000,135000,98000,150000],['Units sold',340,390,280,410],['Returns',12,9,15,7]], hl:{} },{ title:'Result', text:'**98000**' }])],
  x:[X('Variation','A selected month in a dropdown','The month is chosen in G1, and the sheet shows revenue.','Use the cell as the lookup value.','=HLOOKUP($G$1, $A$1:$E$4, 2, FALSE)',['The month is searched in the heading row.','Row 2 of the table is Revenue.'],'Selecting Apr returns 150000.',withHl(MONTHLY,{},'Sheet: Monthly summary')),
     X('Business case','Switching to a more robust formula','Rows are inserted in the table, and the row number 2 now points to the wrong row.','Match the row label too.','=INDEX($B$2:$E$4, MATCH("Revenue", $A$2:$A$4, 0), MATCH($G$1, $B$1:$E$1, 0))',['MATCH finds the row by label.','MATCH finds the column by month.'],'The formula survives inserted rows, which HLOOKUP with a fixed row number does not.')],
  e:[['Fixed row number','Inserting a row can shift the meaning of 2. INDEX/MATCH or XLOOKUP do not have this problem.'],['Only returns downwards','It cannot return from a row above the heading row.'],['Approximate default','Omitting FALSE gives approximate matching on sorted headings.'],['Version note','XLOOKUP replaces HLOOKUP in Excel 2021 and Microsoft 365.']],
  p:[P('Medium','Return the units sold in April.','Row 3 of the table.','=HLOOKUP("Apr", A1:E4, 3, FALSE)','Row 3 of the table is Units sold, so the result is 410.',withHl(MONTHLY,{},'Sheet: Monthly summary')),
     P('Interview','Rewrite the HLOOKUP as an XLOOKUP.','Use the heading row and the data row.','=XLOOKUP("Mar", B1:E1, B2:E2)','No row counting needed. The answer is 98000.')],
  q:[Q('Basic','How does HLOOKUP differ from VLOOKUP?','VLOOKUP searches the first column and returns from a column. HLOOKUP searches the first row and returns from a row below.',{ f:[['When would you use it?','When headings run across the top, such as months in columns.']] }),
     Q('Scenario','Months are across the top and a user picks one from a dropdown. How do you show its revenue?','HLOOKUP with the dropdown cell, or INDEX/MATCH on the month heading, wrapped in IFERROR.',{ t:'INDEX/MATCH or XLOOKUP is safer when rows may be inserted.' })],
  r:RT(['Argument','Meaning'],[['`lookup_value`','Value in the top row'],['`table_array`','Table with headings first'],['`row_index_num`','Row to return (from 1)'],['`range_lookup`','FALSE exact']]), rel:['vlookup','xlookup','index-match','lookup-compare'] });

/* --- xlookup --- */
DEEP['xlookup'] = {
  level:'Intermediate',
  tldr:'XLOOKUP finds a value in one range and returns the matching value from **another** range, in any direction, with a built-in "not found" message.',
  intuition:{ text:[
    'VLOOKUP forces you to give a table and count columns. XLOOKUP removes that step: you name the column to search and, separately, the column to return. Because they are separate, the answer can be on either side.',
    'The other improvement is safety. XLOOKUP defaults to an exact match, handles missing values with one argument, and does not depend on column numbers.'
  ], analogy:'Instead of "find the row and count 4 columns across", you say "look in this list, and give me the matching item from that list".' },
  how:[
    'XLOOKUP searches `lookup_array` for the lookup value.',
    'By default it looks for an exact match, from first to last.',
    'When it finds a match at position n, it returns item n of `return_array`.',
    'If nothing matches, it returns `if_not_found` (or `#N/A` if you left it out).',
    'Optional `match_mode` and `search_mode` change the matching and the search direction.'
  ],
  diagrams:[
    { type:'flow', arrows:['position 3','same position'], panels:[
      { title:'lookup_array C2:C6', rows:[['EmpID'],['E201'],['E202'],['E203'],['E204'],['E205']], hl:{3:'find'} },
      { title:'return_array A2:A6', rows:[['Employee'],['Ravi Kumar'],['Meera Nair'],['Arjun Reddy'],['Sana Khan'],['Kiran Rao']], hl:{3:'hit'} }
    ], caption:'The two ranges are matched by position, so the answer can be to the left.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'The latest purchase of a customer', scenario:'The same customer appears several times. You want the most recent row, which is the last one in the list.', table:withHl({rows:[['Customer','Date','Amount'],['Asha','05-Jan-2026',1200],['Bilal','18-Jan-2026',800],['Asha','03-Feb-2026',1500],['Asha','15-Mar-2026',600]]},{'A2':'find','A4':'find','A5':'find','C5':'hit'},'Sheet: Purchases'),
      task:'Return the last Amount for Asha.', formula:'=XLOOKUP("Asha", A2:A5, C2:C5, "None", 0, -1)', steps:['match_mode 0 means exact match.','search_mode -1 searches from the bottom up, so the last match is found first.'], result:'The formula returns 600. VLOOKUP could only return the first match, 1200.' },
    { level:'Business case', title:'Several columns at once, with a safe not-found message', scenario:'An HR page should show both the name and the department when someone types an employee id.', table:withHl(STAFF,{'C4':'find','A4':'hit','B4':'hit'},'Sheet: Staff'),
      task:'Return name and department for E203.', formula:'=XLOOKUP("E203", C2:C6, A2:B6, "Unknown ID")', steps:['The return array A2:B6 has two columns.','The result spills into two cells: the name, and next to it the department.','An unknown id returns the text Unknown ID.'], result:'The formula returns Arjun Reddy and Operations in two adjacent cells.' }
  ],
  edge:[
    { t:'Version availability', d:'XLOOKUP exists in Excel 2021, Excel 2024 and Microsoft 365. In Excel 2019 and older it shows `#NAME?`. For shared files, check who will open them.' },
    { t:'Same-size ranges', d:'`lookup_array` and `return_array` must have the same number of rows (or columns). Mismatched sizes give `#VALUE!`.' },
    { t:'Spilling and #SPILL!', d:'A multi-column result needs free cells to spill into. Anything in the way gives `#SPILL!`.' },
    { t:'Approximate matches', d:'Use `match_mode` -1 (exact or next smaller) for slabs. Unlike VLOOKUP, the table does not have to be sorted unless you use a binary search mode.' },
    { t:'Wildcards', d:'`match_mode` 2 enables wildcards, such as `"P1*"`. Without it, an asterisk is treated as a normal character.' },
    { t:'if_not_found versus IFERROR', d:'`if_not_found` only handles "no match". Wrapping the formula in IFERROR also hides unrelated errors, such as a wrong range.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the commission rate for sales of 72000 from the slab table (A2:A5 = 0, 10000, 50000, 100000; B2:B5 = rates).', hint:'Use match_mode -1: exact match or the next smaller item.', solution:'=XLOOKUP(72000, A2:A5, B2:B5, , -1)', explain:'The next smaller value than 72000 is 50000, so the rate for that slab is returned (5%). The empty argument skips if_not_found.' },
    { level:'Interview', q:'Rewrite =VLOOKUP(A2, $F$2:$H$100, 3, FALSE) as an XLOOKUP and explain two benefits.', hint:'The lookup column is F and the third column is H.', solution:'=XLOOKUP(A2, $F$2:$F$100, $H$2:$H$100, "Not found")', explain:'Benefit 1: no column number, so inserting columns cannot break it. Benefit 2: a built-in not-found message and exact-match default. It can also return a column to the left of F.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Why is XLOOKUP better than VLOOKUP?', a:'It looks left and right, defaults to an exact match, has a not-found argument, does not use a column number, works vertically and horizontally, and can return several columns.',
      structure:'List the four main fixes to VLOOKUP, then mention the one limitation: version support.',
      follow:[ { q:'Is there any reason to still use VLOOKUP?', a:'Compatibility with Excel 2019 or older, and when a team already standardises on it.' } ] },
    { level:'Intermediate', q:'How do you get the last match instead of the first?', a:'Set search_mode to -1, so XLOOKUP searches from the bottom of the list upwards.',
      follow:[ { q:'How would you do it in VLOOKUP?', a:'You cannot directly. You would sort the list descending, or use LOOKUP(2, 1/(range=value), return_range), which is less readable.' } ] },
    { level:'Scenario', q:'Your workbook uses XLOOKUP and a colleague with Excel 2016 sees errors. What do you do?', a:'I either replace the formulas with INDEX/MATCH, which works in every version, or confirm that the colleague can upgrade or open it in Excel for the web, which supports XLOOKUP.',
      tradeoff:'INDEX/MATCH is universal but longer. XLOOKUP is cleaner but needs a modern version.' }
  ],
  ref:{ headers:['Argument','Purpose'], rows:[['`lookup_value`','What to find'],['`lookup_array`','Where to look (one row or column)'],['`return_array`','What to return (same size)'],['`if_not_found`','Text when no match'],['`match_mode`','0 exact, -1 next smaller, 1 next larger, 2 wildcard'],['`search_mode`','1 first to last, -1 last to first']] },
  related:['vlookup','index-match','lookup-compare','hlookup']
};

/* --- index --- */
DEEP['index'] = {
  level:'Intermediate',
  tldr:'INDEX returns the value at a given **row and column position** inside a range. It does not search; it fetches by position.',
  intuition:{ text:[
    'INDEX is like a seat finder in a theatre: "row 3, seat 2". If you know the coordinates, you get the person sitting there. It does not look for a name. That is the job of MATCH, which is why the two are used together.',
    'Used alone, INDEX is still handy for fixed layouts, for returning whole rows or columns, and for picking the k-th item of a list.'
  ], analogy:'A chessboard reference: column C, row 4 gives a square.' },
  how:[
    'Give INDEX a range, such as `B2:D5`.',
    'Give a row number counted **inside the range**, from 1.',
    'Optionally give a column number, also inside the range.',
    'INDEX returns the value at that intersection.',
    'A row or column number of 0 returns the whole column or row.'
  ],
  diagrams:[
    { type:'flow', arrows:[''], panels:[
      { title:'=INDEX(B2:D5, 3, 2)', rows:[['Region','Q1','Q2','Q3'],['North',450,520,480],['South',380,410,450],['East',300,360,390],['West',420,400,470]], hl:{3:'find'}, note:'Row 3 of the range, column 2: **360**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Returning a whole column', scenario:'Total all Q2 sales without naming column C.', table:withHl(SALES,{'C2:C5':'hit'},'Sheet: Sales'), task:'Sum column 2 of the range.', formula:'=SUM(INDEX(B2:D5, 0, 2))',
      steps:['A row number of 0 means every row.','INDEX returns the whole second column, C2:C5.'], result:'The formula returns 1690 (520 + 410 + 360 + 400).' },
    { level:'Business case', title:'The region with the second highest Q2 sales', scenario:'A ranking table must show the name of the runner-up.', table:withHl(SALES,{'A3':'hit','C3':'find'},'Sheet: Sales'), task:'Combine LARGE, MATCH and INDEX.',
      formula:'=INDEX(A2:A5, MATCH(LARGE(C2:C5, 2), C2:C5, 0))', steps:['LARGE(C2:C5, 2) is 410, the second largest Q2 value.','MATCH finds 410 at position 2.','INDEX returns the 2nd region name.'], result:'The formula returns South.' }
  ],
  edge:[
    { t:'Positions count inside the range', d:'`INDEX(B2:D5,3,2)` is the third row of the range (sheet row 4), not sheet row 3.' },
    { t:'#REF! for out-of-range positions', d:'A row or column number larger than the range gives `#REF!`. This often signals a MATCH that returned the wrong position.' },
    { t:'One-dimensional ranges', d:'For a single column, one number is enough: `INDEX(A2:A10, 3)`.' },
    { t:'INDEX returns a reference', d:'It can sit on either side of a range operator: `SUM(B2:INDEX(B2:B10, 3))` sums the first three cells.' },
    { t:'Header rows', d:'Include headers in the range and positions shift by one. Decide whether the range includes them, and stay consistent.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the Q3 sales of the **last** region in the list, whatever the list length (ranges B2:B100 may contain blanks).', hint:'COUNTA gives the position of the last entry.', solution:'=INDEX(D2:D100, COUNTA(A2:A100))', explain:'COUNTA counts the filled region names, giving the position of the last one, and INDEX returns the matching Q3 value. Works as long as there are no gaps in the list.' },
    { level:'Interview', q:'Why is INDEX usually combined with MATCH, and what would you use instead in Microsoft 365?', hint:'INDEX needs a position.', solution:'INDEX needs a row or column number. MATCH finds that number from a lookup value, giving INDEX/MATCH a flexible lookup.\nIn Microsoft 365, XLOOKUP does the same in one function.', explain:'Showing you know both the classic and modern way is the point.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does INDEX do?', a:'INDEX returns the value at a given row and column position inside a range. For example, =INDEX(B2:D5,3,2) returns the value in the third row and second column of that range.',
      follow:[ { q:'Does INDEX search for a value?', a:'No. It fetches by position. MATCH finds the position.' } ] },
    { level:'Intermediate', q:'What does row_num 0 do?', a:'It returns the whole column. It is useful inside functions such as SUM, for example =SUM(INDEX(B2:D5,0,2)) totals the second column of the range.' },
    { level:'Scenario', q:'Build a lookup that returns a value from the column chosen by the user in a dropdown.', a:'Use two MATCH functions: =INDEX(B2:D5, MATCH(region, A2:A5, 0), MATCH(quarter, B1:D1, 0)). The user picks the region and the quarter, and the formula picks the cell.',
      tradeoff:'Readable and flexible, but errors in either MATCH produce #N/A, so wrap in IFERROR or validate the dropdowns.' }
  ],
  ref:{ headers:['Use','Formula'], rows:[['One cell','`INDEX(range, r, c)`'],['Whole column','`INDEX(range, 0, c)`'],['Whole row','`INDEX(range, r, 0)`'],['Lookup','`INDEX(return, MATCH(value, lookup, 0))`']] },
  related:['match','index-match','xlookup','large']
};

/* --- match --- */
DEEP['match'] = {
  level:'Intermediate',
  tldr:'MATCH returns the **position** of a value in a single row or column. Use `0` as the third argument for an exact match.',
  intuition:{ text:[
    'MATCH answers "which number in the list is this?". If East is the third region in the list, MATCH returns 3. It never returns the value itself, only its place, which is exactly what INDEX needs.',
    'A second use is as a test. If MATCH finds the value, you get a number, and if not, `#N/A`. Wrapping it in ISNUMBER turns that into TRUE or FALSE, which is a neat way to check whether an item exists in a list.'
  ], analogy:'Telling someone "it is the third door on the left" instead of describing the door.' },
  how:[
    'Give MATCH a value and a single row or column to search.',
    'Third argument 0: look for an exact match, from the start of the range.',
    'Third argument 1 (default): find the largest value not greater than the lookup value; the range must be sorted ascending.',
    'Third argument -1: find the smallest value not smaller; the range must be sorted descending.',
    'It returns the position inside the range, or `#N/A` when nothing matches.'
  ],
  diagrams:[
    { type:'flow', arrows:['position'], panels:[
      { title:'=MATCH("East", A2:A5, 0)', rows:[['Region'],['North'],['South'],['East'],['West']], hl:{3:'find'} },
      { title:'Result', text:'**3**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Approximate match for slabs', scenario:'Which slab does a sales value belong to?', table:withHl({rows:[['Slab start'],[0],[10000],[50000],[100000]]},{'A4':'find'},'Sheet: Slabs (A2:A5, sorted ascending)'), task:'Find the slab position for 72000.', formula:'=MATCH(72000, A2:A5, 1)',
      steps:['Match type 1 finds the largest value that is not greater than 72000.','That is 50000, in position 3.'], result:'The formula returns 3, which INDEX can use to read the rate for that slab.' },
    { level:'Business case', title:'Checking typed regions against a master list', scenario:'Reps type a region in a form. A helper column must show whether each entry is valid.', table:withHl({rows:[['Typed','Valid?'],['East','TRUE'],['Central','FALSE'],['north','TRUE']]},{'B3':'miss'},'Sheet: Entries (master list in A2:A5)'), task:'Return TRUE or FALSE.',
      formula:'=ISNUMBER(MATCH(A2, $A$2:$A$5, 0))', steps:['MATCH returns a number if the value is found, otherwise #N/A.','ISNUMBER converts that into TRUE or FALSE.','Matching ignores case, so "north" is valid.'], result:'"Central" is flagged FALSE. Use it with conditional formatting to highlight bad entries.' }
  ],
  edge:[
    { t:'Always write the 0', d:'The default match type is 1 (approximate). On unsorted data, MATCH may return a wrong position without any error.' },
    { t:'Single row or column only', d:'The lookup range must be one row or one column. A two-dimensional range gives `#N/A`.' },
    { t:'Position is relative', d:'The result counts from the start of the lookup range, not from the sheet.' },
    { t:'Wildcards', d:'With match type 0 and text, `*` and `?` work: `MATCH("W*", A2:A5, 0)`.' },
    { t:'Text versus number', d:'A text 5 does not match the number 5. Clean the data, or the lookup returns #N/A.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the column position of the quarter typed in F1 within the headings B1:D1.', hint:'MATCH with 0.', solution:'=MATCH(F1, B1:D1, 0)', explain:'For Q3 the result is 3. The position can drive INDEX, so a dashboard can read whichever quarter is selected.' },
    { level:'Interview', q:'MATCH returns the wrong row on an unsorted list, but no error. What is the likely cause?', hint:'Third argument.', solution:'The match type was omitted, so Excel used 1 (approximate match), which assumes ascending sorted data and uses a binary search.\nFix: add 0 as the third argument.', explain:'Silent wrong answers are worse than errors, so naming this trap is a strong answer.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does MATCH return?', a:'The relative position of a value in a single row or column, not the value itself. =MATCH("East",A2:A5,0) returns 3 if East is the third item.',
      follow:[ { q:'What does the third argument do?', a:'0 means exact match, 1 largest value not above (sorted ascending), -1 smallest value not below (sorted descending).' } ] },
    { level:'Intermediate', q:'How do you check whether a value exists in a list?', a:'=ISNUMBER(MATCH(value, list, 0)). MATCH returns a number when found, and #N/A when not, so ISNUMBER gives TRUE or FALSE.',
      tradeoff:'COUNTIF(list, value)>0 is another way, and it also counts how many times it appears.' },
    { level:'Scenario', q:'A lookup works in some rows and returns #N/A in others. How do you debug it?', a:'I test with ISNUMBER(MATCH()) to find the failing rows, compare LEN of the lookup value and the list item to spot spaces, and check text versus number. Then I clean with TRIM and VALUE.' }
  ],
  ref:{ headers:['match_type','Finds','List must be'], rows:[['`0`','Exact match','Any order'],['`1` (default)','Largest value not above','Ascending'],['`-1`','Smallest value not below','Descending']] },
  related:['index','index-match','xlookup','countif']
};

/* --- index-match --- */
DEEP['index-match'] = {
  level:'Intermediate',
  tldr:'MATCH finds the **position** of a value, and INDEX returns the value at that position. Together they work as a flexible lookup.',
  intuition:{ text:[
    'Think of a map reference. MATCH is the person who tells you "the town you want is in row 3". INDEX is the person who walks to row 3 and reads what is written there. Each does one small job, and combining them gives a lookup that can go left, right or in two directions at once.',
    'Because the return range is an actual range reference, not a column number, inserting columns cannot break it. That is why many analysts prefer it to VLOOKUP, and why interviewers ask about it.'
  ], analogy:'A library: MATCH looks up the shelf number in the catalogue, INDEX goes to that shelf and takes the book.' },
  how:[
    'MATCH looks for the lookup value in one row or column and returns its position (1, 2, 3 ...).',
    'INDEX takes a range and a position and returns the value at that position.',
    'For a one-way lookup: `INDEX(return_range, MATCH(value, lookup_range, 0))`.',
    'For a two-way lookup, use two MATCH functions: one for the row and one for the column.',
    'The `0` in MATCH is essential. It asks for an exact match.'
  ],
  diagrams:[
    { type:'flow', arrows:['MATCH row','MATCH column','INDEX picks the cell'], panels:[
      { title:'MATCH("East", A2:A5, 0)', text:'returns **3**' },
      { title:'MATCH("Q2", B1:D1, 0)', text:'returns **2**' },
      { title:'INDEX(B2:D5, 3, 2)', rows:[['Region','Q1','Q2','Q3'],['North',450,520,480],['South',380,410,450],['East',300,360,390],['West',420,400,470]], hl:{3:'find'}, note:'Row 3, column 2 of the numbers: **360**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Looking up to the left', scenario:'The staff list has the ID in column C and the name in column A. VLOOKUP cannot return a column to the left.', table:withHl(STAFF,{'C4':'find','A4':'hit'},'Sheet: Staff'),
      task:'Return the employee name for ID E203.', formula:'=INDEX(A2:A6, MATCH("E203", C2:C6, 0))', steps:['MATCH finds E203 at position 3 in C2:C6.','INDEX returns the 3rd value of A2:A6.'], result:'The formula returns Arjun Reddy.' },
    { level:'Business case', title:'A dashboard cell driven by two dropdowns', scenario:'A manager picks a region in G1 and a quarter in G2, and the dashboard shows the sales number.', table:withHl(SALES,{'B2:D5':'range'},'Sheet: Sales (G1 = South, G2 = Q3)'),
      task:'Return the value for the selected region and quarter.', formula:'=INDEX($B$2:$D$5, MATCH($G$1, $A$2:$A$5, 0), MATCH($G$2, $B$1:$D$1, 0))', steps:['MATCH($G$1, ...) gives the row position for South: 2.','MATCH($G$2, ...) gives the column position for Q3: 3.','INDEX returns row 2, column 3 of the numbers.'], result:'The formula returns 450. Change either dropdown and the number updates, with no formula edits.' }
  ],
  edge:[
    { t:'Always write the 0', d:'MATCH defaults to `1`, approximate matching on sorted data. Without the 0 you can get a wrong position with no error.' },
    { t:'Ranges must line up', d:'The return range and lookup range must start on the same row and have the same size, or the position points to the wrong row.' },
    { t:'Headers off by one', d:'If the lookup range includes the header but the return range does not, the answer is shifted by one row. Count both from the same row.' },
    { t:'#N/A causes', d:'Trailing spaces, text versus number, or a value that really is missing. Check with TRIM and ISNUMBER.' },
    { t:'Two criteria need an array', d:'To look up on two columns, use `MATCH(1, (A2:A9=x)*(B2:B9=y), 0)`. In older Excel this must be entered with Ctrl+Shift+Enter.' },
    { t:'MATCH on large data', d:'Exact MATCH scans the range. For huge sheets, restrict the range and avoid entire-column references inside many formulas.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the name of the region with the highest Q2 sales.', table:withHl(SALES,{},'Sheet: Sales'), hint:'MATCH the maximum of column C, then INDEX the region column.', solution:'=INDEX(A2:A5, MATCH(MAX(C2:C5), C2:C5, 0))', explain:'MAX(C2:C5) is 520. MATCH finds it at position 1, and INDEX returns North.' },
    { level:'Interview', q:'Using the sales log, return the sales of the order that is North AND Furniture (two criteria).', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'Multiply two TRUE/FALSE tests inside MATCH.', solution:'=INDEX(D2:D9, MATCH(1, (B2:B9="North")*(C2:C9="Furniture"), 0))', explain:'The product is 1 only where both tests are true: row for O-103. The result is 15000. In Excel 2019 and earlier, confirm the formula with Ctrl+Shift+Enter. In Microsoft 365, XLOOKUP is simpler for this.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Why would you use INDEX/MATCH instead of VLOOKUP?', a:'INDEX/MATCH can look to the left, is not affected by inserted columns because it references the return range directly, supports two-way lookups, and works in all Excel versions. VLOOKUP is simpler but less flexible.',
      structure:'Give the three practical advantages, then admit the cost: longer to write.',
      follow:[ { q:'Explain the formula step by step.', a:'MATCH returns the position of the lookup value in the lookup range. INDEX then returns the value at that position in the return range.' } ] },
    { level:'Intermediate', q:'INDEX/MATCH versus XLOOKUP?', a:'XLOOKUP is easier to read and write, has a built-in not-found argument and defaults to exact match. INDEX/MATCH is the safe choice when the workbook must open in Excel 2019 or earlier, and when maintaining existing models.',
      tradeoff:'Readability and fewer mistakes versus compatibility.',
      follow:[ { q:'Which handles two-way lookups?', a:'Both. INDEX with two MATCH functions, or XLOOKUP nested inside XLOOKUP.' } ] },
    { level:'Scenario', q:'A colleague inserted a column and your VLOOKUP reports wrong numbers. How do you prevent it?', a:'VLOOKUP stores a column number, so the number now points to a different column. I replace it with INDEX/MATCH or XLOOKUP, which reference the return range directly and move automatically when columns are inserted.' }
  ],
  ref:{ headers:['Pattern','Formula'], rows:[['One-way lookup','`=INDEX(return, MATCH(value, lookup, 0))`'],['Look left','Same pattern, with the return range on the left'],['Two-way lookup','`=INDEX(grid, MATCH(row, rows, 0), MATCH(col, cols, 0))`'],['Position only','`=MATCH(value, range, 0)`']] },
  related:['index','match','xlookup','vlookup','lookup-compare']
};

/* --- lookup-compare --- */
DEEP['lookup-compare'] = {
  level:'Intermediate',
  tldr:'Choose by **version, direction and maintenance**: XLOOKUP for modern files, INDEX/MATCH for compatibility, VLOOKUP only when it is already the team standard.',
  intuition:{ text:[
    'The three functions solve the same problem. The difference is which pain points each one removes. VLOOKUP is the oldest, so it is the most widely understood and the most fragile. INDEX/MATCH fixed direction and fragility but is longer. XLOOKUP combines both fixes in one readable formula.',
    'Interviewers rarely want the "best" function. They want to hear you reason about trade-offs: who opens the file, which Excel version, how the data may change, and who maintains it.'
  ], analogy:'Choosing a tool for a job: the old reliable screwdriver, the adjustable wrench, or the new power tool that not everyone owns yet.' },
  how:[
    'Ask: does everyone have Excel 2021 or Microsoft 365? If yes, prefer XLOOKUP.',
    'If the file must open in older versions, use INDEX/MATCH.',
    'If the answer is to the **left** of the key, VLOOKUP is out.',
    'If columns may be inserted later, avoid a fixed column number.',
    'If the team has a standard, follow it unless it causes errors.'
  ],
  diagrams:[
    { type:'flow', arrows:['yes','no'], panels:[
      { title:'Everyone on Excel 2021 / 365?', text:'Yes: use **XLOOKUP**' },
      { title:'Older Excel versions involved?', text:'Use **INDEX + MATCH**' },
      { title:'Only a quick, right-hand lookup?', text:'**VLOOKUP** is acceptable' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Return a column to the left of the key', scenario:'The id is in column C and the name is in column A.', table:withHl(STAFF,{'C4':'find','A4':'hit'},'Sheet: Staff'), task:'Look up the name for E203 with each approach.',
      formula:'VLOOKUP:      not possible (answer is left of the key)\nINDEX/MATCH:  =INDEX(A2:A6, MATCH("E203", C2:C6, 0))\nXLOOKUP:      =XLOOKUP("E203", C2:C6, A2:A6)', steps:['VLOOKUP can only return columns to the right of its first column.','The other two reference the return range directly.'], result:'Both INDEX/MATCH and XLOOKUP return Arjun Reddy.' },
    { level:'Business case', title:'Choosing for a shared monthly report', scenario:'A report is emailed to 40 managers. Some use Excel 2016. Columns are sometimes inserted by finance.', table:T({rows:[['Requirement','Decision']]},'Decision log'), task:'Pick the function and justify it.', formula:'=INDEX($D$2:$D$500, MATCH($A2, $B$2:$B$500, 0))',
      steps:['Excel 2016 users rule out XLOOKUP.','Inserted columns rule out a fixed column number, so VLOOKUP is risky.','INDEX/MATCH satisfies both, and can be switched to XLOOKUP later.'], result:'INDEX/MATCH is the right answer, and saying why is what interviewers want to hear.' }
  ],
  edge:[
    { t:'Default matching differs', d:'VLOOKUP and MATCH default to approximate match. XLOOKUP defaults to exact. Forgetting FALSE or 0 is the classic bug.' },
    { t:'Not-found handling', d:'XLOOKUP has a built-in argument. The others return `#N/A`, which you wrap with IFERROR or IFNA.' },
    { t:'Performance', d:'For normal workbooks the difference is negligible. On very large sheets, restricted ranges and avoiding repeated lookups matter more than the function.' },
    { t:'Readability for the next person', d:'A formula that you can explain in one sentence is easier to maintain. XLOOKUP usually wins here.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Rewrite =VLOOKUP(F2, A2:D6, 4, FALSE) as INDEX/MATCH and as XLOOKUP.', hint:'Return D, search A.', solution:'=INDEX(D2:D6, MATCH(F2, A2:A6, 0))\n=XLOOKUP(F2, A2:A6, D2:D6)', explain:'Both reference the return column directly, so inserting a column in between no longer breaks the formula.' },
    { level:'Interview', q:'Your manager asks you to standardise the workbook on one lookup approach. Which do you recommend, and what would change your mind?', hint:'Give a recommendation, then the conditions.', solution:'Recommend XLOOKUP if everyone is on Excel 2021 or Microsoft 365, for readability, built-in not-found handling and robustness to inserted columns.\nChange the recommendation to INDEX/MATCH if anyone uses Excel 2019 or older.', explain:'A good answer states a default and the condition that overrides it.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Compare VLOOKUP, XLOOKUP and INDEX/MATCH.', a:'VLOOKUP is simple but looks only right, uses a fixed column number and defaults to approximate match. INDEX/MATCH looks both ways and survives inserted columns but is longer. XLOOKUP combines the advantages, and adds a not-found argument, but needs Excel 2021 or Microsoft 365.',
      structure:'Three functions, one sentence each on strengths and weaknesses, then your recommendation.' },
    { level:'Scenario', q:'Which would you use for a workbook shared with mixed Excel versions, and why?', a:'INDEX/MATCH, because it works in every version and also looks left. I would document the formula, lock the ranges, and plan to switch to XLOOKUP when the versions are standardised.',
      tradeoff:'Compatibility now versus readability later.',
      follow:[ { q:'How do you handle missing values?', a:'Wrap in IFERROR, or IFNA to only catch "not found" and let real errors show.' } ] }
  ],
  ref:{ headers:['','VLOOKUP','XLOOKUP','INDEX + MATCH'], rows:[['Look left','No','Yes','Yes'],['Default match','Approximate','Exact','MATCH: approximate'],['Not found','`#N/A`','Built-in','`#N/A`'],['Inserted columns','Can break','Safe','Safe'],['Versions','All','2021 and 365','All']] },
  related:['vlookup','xlookup','index-match','iferror']
};
})();
