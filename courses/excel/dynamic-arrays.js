/* Datapath | Excel | Dynamic arrays
 * Lessons in this file: unique, filter-function, sort-function
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
  const { SALESLOG } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- unique --- */
'unique': {
  title:'UNIQUE', tagline:'Return a list of distinct values from a range.',
  prereq:[],
  what:['UNIQUE returns each different value from a range once.','The result **spills** into the cells below.','It updates automatically when the data changes.'],
  why:['List all regions, products or customers without duplicates.','Feed dropdowns, SUMIFS summaries and counts.'],
  syntax:{ code:'=UNIQUE(array, [by_col], [exactly_once])', parts:[['array','The range to read.'],['by_col','Optional. TRUE compares columns instead of rows.'],['exactly_once','Optional. TRUE returns only values that appear once.']] },
  points:['Available in **Excel 2021 and Microsoft 365** only.','The result spills; the cells below must be empty or you get `#SPILL!`.','Values appear in order of first occurrence.','Refer to the whole spill with `F2#`.','Use `COUNTA(UNIQUE(range))` to count distinct values.'],
  mistakes:['Using it in Excel 2019 or older.','Blocking the spill range with data.','Typing it in a cell that cannot spill, such as inside a Table.'],
  example:{ title:'Listing the regions', scenario:'The sales log repeats region names. You want each region once.',
    table:withHl(SALESLOG,{'B2:B9':'range'},'Sheet: Sales log'), task:'List the distinct regions.', formula:'=UNIQUE(B2:B9)',
    steps:['UNIQUE reads B2:B9.','It returns each region once, in order of first appearance.'],
    table2:{ rows:[['Spilled result'],['North'],['South'],['East']], caption:'Result spilled into F2:F4' }, result:'The formula returns North, South and East.' },
  practice:{ q:'Write a formula that counts how many distinct categories there are in C2:C9.', hint:'Count the UNIQUE list.', solution:'=COUNTA(UNIQUE(C2:C9))', explain:'The categories are Electronics and Furniture, so the result is 2.' },
  interview:[
    { level:'Basic', q:'What does UNIQUE do?', a:'It returns the distinct values from a range, each once. The result spills into neighbouring cells.' },
    { level:'Intermediate', q:'What is a #SPILL! error?', a:'It means the cells where the result should spill are not empty. I clear the blocking cells and the result appears.' },
    { level:'Intermediate', q:'How do you count distinct values with UNIQUE?', a:'=COUNTA(UNIQUE(range)). In older Excel, a SUMPRODUCT with COUNTIF is needed.' },
    { level:'Scenario', q:'Which versions support UNIQUE, and what is the alternative for older ones?', a:'Excel 2021 and Microsoft 365. For older versions, I use Remove Duplicates on a copy of the data or a pivot table to list the distinct values.' }
  ],
  mcq:[
    { q:'What does `=UNIQUE(B2:B9)` return for the sales log regions?', o:['North, South, East','North, South, East, North, South, East, North, South','3','North'], a:0, why:'Each distinct region is returned once.' },
    { q:'What causes a #SPILL! error?', o:['Cells in the spill range are not empty','The range is too short','The formula is long','Missing quotes'], a:0, why:'A blocked spill range prevents the result from showing.' },
    { q:'Which versions have UNIQUE?', o:['Excel 2021 and Microsoft 365','All versions','Excel 2010 and later','Excel 2016'], a:0, why:'UNIQUE is a dynamic array function.' },
    { q:'Which formula counts distinct values?', o:['=COUNTA(UNIQUE(C2:C9))','=COUNT(C2:C9)','=UNIQUE(COUNT)','=SUM(UNIQUE)'], a:0, why:'COUNTA counts the items in the spilled list.' },
    { q:'In what order does UNIQUE return values?', o:['Order of first appearance','Alphabetical','Largest first','Random'], a:0, why:'It keeps the first-appearance order.' }
  ],
  recap:['UNIQUE returns distinct values that spill down.','It needs Excel 2021 or Microsoft 365.','#SPILL! means the spill range is blocked.']
},

/* --- filter-function --- */
'filter-function': {
  title:'FILTER function', tagline:'Return only the rows that meet a condition, as a live list.',
  prereq:['unique'],
  what:['FILTER returns the rows of a range that meet a condition.','The result spills into the cells below and to the right.','It updates when the data changes.'],
  why:['Show all orders of one region without using the filter buttons.','Build reports and dashboards that react to a selected value.'],
  syntax:{ code:'=FILTER(array, include, [if_empty])', parts:[['array','The range to return rows from.'],['include','A condition for each row, such as B2:B9="North".'],['if_empty','Optional. What to show when no row matches.']] },
  points:['Available in **Excel 2021 and Microsoft 365**.','The include range must have the same number of rows as the array.','Combine conditions: AND with `*`, OR with `+`.','Use `if_empty` to avoid `#CALC!` when nothing matches.','Headers are not included automatically.'],
  mistakes:['Using it in Excel 2019 or older.','Blocking the spill range.','A condition range of the wrong size.'],
  example:{ title:'Orders from one region', scenario:'You want all North orders as a separate list.',
    table:withHl(SALESLOG,{'A2:D9':'range'},'Sheet: Sales log'), task:'Return the rows where Region is North.', formula:'=FILTER(A2:D9, B2:B9="North", "No orders")',
    steps:['The condition B2:B9="North" gives TRUE for rows 2, 4 and 7.','FILTER returns those three full rows.'],
    table2:{ rows:[['Order','Region','Category','Sales'],['O-101','North','Electronics',12000],['O-103','North','Furniture',15000],['O-106','North','Electronics',7000]], caption:'Spilled result (headers added for clarity)' }, result:'The formula returns the three North orders.' },
  practice:{ q:'Write a formula that returns the orders where the sales are 10000 or more and the region is South.', hint:'Multiply the two conditions, because multiplication works as AND.', solution:'=FILTER(A2:D9, (B2:B9="South")*(D2:D9>=10000), "None")', explain:'South orders of 10000 or more are O-105 (11000) and O-108 (13000), so two rows are returned.' },
  interview:[
    { level:'Basic', q:'What does FILTER do?', a:'It returns the rows of a range that meet a condition, as a live list that spills into the sheet.' },
    { level:'Intermediate', q:'How do you use AND and OR conditions in FILTER?', a:'Multiply conditions for AND, such as (B2:B9="North")*(D2:D9>10000), and add them for OR, such as (B2:B9="North")+(B2:B9="East").' },
    { level:'Intermediate', q:'What does the if_empty argument do?', a:'It shows a message when no rows match, instead of the #CALC! error.' },
    { level:'Scenario', q:'A dashboard should show the orders of a region picked from a dropdown in F1. How?', a:'=FILTER(A2:D9, B2:B9=F1, "No orders"). When the dropdown changes, the list updates automatically.' }
  ],
  mcq:[
    { q:'How do you write AND conditions in FILTER?', o:['Multiply them','Add them','Use commas','Use the word AND'], a:0, why:'TRUE*TRUE is 1, so only rows meeting both conditions are kept.' },
    { q:'How do you write OR conditions?', o:['Add them','Multiply them','Subtract them','Use &'], a:0, why:'A sum above 0 means at least one condition is TRUE.' },
    { q:'What does `if_empty` prevent?', o:['The #CALC! error when nothing matches','The #SPILL! error','The #NAME? error','Sorting'], a:0, why:'It shows your message instead.' },
    { q:'Which versions support FILTER?', o:['Excel 2021 and Microsoft 365','All versions','Excel 2019','Excel 2016'], a:0, why:'It is a dynamic array function.' },
    { q:'How many rows does the include range need?', o:['The same as the array','One fewer','Any number','Twice as many'], a:0, why:'Each row needs one TRUE or FALSE.' }
  ],
  recap:['FILTER returns the rows that meet a condition and spills them.','Multiply for AND, add for OR.','It needs Excel 2021 or Microsoft 365.']
},

/* --- sort-function --- */
'sort-function': {
  title:'SORT function', tagline:'Return a sorted copy of a range as a live list.',
  prereq:['unique'],
  what:['SORT returns a sorted version of a range without changing the original.','You choose the column and the direction.','The result spills and updates automatically.'],
  why:['Show the top orders or an alphabetical list in a report.','Build rankings that update when the data changes.'],
  syntax:{ code:'=SORT(array, [sort_index], [sort_order], [by_col])', parts:[['array','The range to sort.'],['sort_index','Which column to sort by, counted inside the range. Default is 1.'],['sort_order','1 for ascending (default), -1 for descending.']] },
  points:['Available in **Excel 2021 and Microsoft 365**.','The original data stays unchanged.','`sort_index` counts columns inside the array.','Combine with FILTER: `SORT(FILTER(...), 4, -1)`.','`SORTBY` sorts by a column outside the result.'],
  mistakes:['Using it in older versions.','Blocking the spill range.','Counting sort_index from the sheet instead of from the array.'],
  example:{ title:'Orders from largest to smallest', scenario:'You want all orders sorted by sales, highest first.',
    table:withHl(SALESLOG,{'D2:D9':'range'},'Sheet: Sales log'), task:'Sort the table by the Sales column, largest first.', formula:'=SORT(A2:D9, 4, -1)',
    steps:['The Sales column is the 4th column of A2:D9.','-1 means descending order.'],
    table2:{ rows:[['Order','Region','Category','Sales'],['O-103','North','Furniture',15000],['O-108','South','Electronics',13000],['O-101','North','Electronics',12000],['O-105','South','Electronics',11000],['O-104','East','Electronics',9500],['O-102','South','Furniture',8000],['O-106','North','Electronics',7000],['O-107','East','Furniture',6000]], caption:'Spilled result (headers added for clarity)' }, result:'The formula returns the orders from 15000 down to 6000.' },
  practice:{ q:'Write a formula that shows the top 3 orders by sales.', hint:'Wrap SORT in TAKE, or use INDEX with a row range. In Microsoft 365, TAKE is the simplest.', solution:'=TAKE(SORT(A2:D9, 4, -1), 3)', explain:'SORT puts the largest first and TAKE keeps the first 3 rows: O-103, O-108 and O-101. TAKE exists in Microsoft 365 only.' },
  interview:[
    { level:'Basic', q:'What does SORT do?', a:'It returns a sorted copy of a range, leaving the original data unchanged. The result spills and updates automatically.' },
    { level:'Intermediate', q:'What is the difference between the Sort button and the SORT function?', a:'The Sort button rearranges the original data once. The SORT function creates a separate live sorted list that updates when the source changes.' },
    { level:'Intermediate', q:'How do you combine FILTER and SORT?', a:'=SORT(FILTER(A2:D9, B2:B9="North"), 4, -1) first keeps the North rows and then sorts them by sales, largest first.' },
    { level:'Scenario', q:'You need an alphabetical, duplicate-free list of customers for a dropdown. How?', a:'=SORT(UNIQUE(A2:A500)). UNIQUE removes duplicates and SORT puts them in order.' }
  ],
  mcq:[
    { q:'What does sort_order -1 mean?', o:['Descending','Ascending','No sort','Random'], a:0, why:'-1 sorts from largest to smallest.' },
    { q:'Does SORT change the original data?', o:['No','Yes','Only for numbers','Only in tables'], a:0, why:'It returns a separate sorted copy.' },
    { q:'How is sort_index counted?', o:['Columns inside the array','Columns of the sheet','Rows of the array','From the right'], a:0, why:'It is the column number within the array you give.' },
    { q:'Which formula gives a sorted list without duplicates?', o:['=SORT(UNIQUE(A2:A500))','=UNIQUE(SORT)','=SORT+UNIQUE','=ORDER(A2:A500)'], a:0, why:'Nest UNIQUE inside SORT.' },
    { q:'Which versions support SORT?', o:['Excel 2021 and Microsoft 365','All versions','Excel 2016','Excel 2010'], a:0, why:'SORT is a dynamic array function.' }
  ],
  recap:['SORT returns a live sorted copy of a range.','sort_index counts inside the array; -1 is descending.','Combine with FILTER and UNIQUE; needs Excel 2021 or Microsoft 365.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- unique --- */
D('unique',{ l:'Intermediate', t:'UNIQUE returns the distinct values of a range as a live, spilling list. It needs Excel 2021 or Microsoft 365.',
  i:['A column of regions repeats the same names hundreds of times. UNIQUE lists each one once, and keeps the list up to date as the data changes.','It spills: you write one formula, and Excel fills the cells below with the answer.'], a:'A list of the different flavours on a menu, however often each is ordered.',
  h:['Write `=UNIQUE(range)`.','Excel returns each distinct value once, in order of first appearance.','The result spills downward into empty cells.','Refer to the whole list with `A2#`.'],
  d:[FL(['UNIQUE'],[{ title:'Region column', rows:[['Region'],['North'],['South'],['North'],['East'],['South']] },{ title:'Result (spills)', rows:[['Region'],['North'],['South'],['East']], hl:{1:'hit',2:'hit',3:'hit'} }])],
  x:[X('Variation','Counting distinct values','How many different regions are there?','Count the unique list.','=COUNTA(UNIQUE(B2:B9))',['UNIQUE gives 3 values.','COUNTA counts them.'],'The result is 3.',withHl(SALESLOG,{},'Sheet: Sales log')),
     X('Business case','A sorted drop-down source','A region drop-down must always list current regions, sorted.','Combine SORT and UNIQUE.','=SORT(UNIQUE(B2:B9))',['UNIQUE removes duplicates, SORT orders them.','Use the spill reference as a validation list: =A2#.'],'New regions appear in the drop-down automatically.')],
  e:[['Version','Excel 2021 and Microsoft 365 only.'],['#SPILL!','The cells below must be empty.'],['Rows or columns','Pass `TRUE` for by_col to compare columns.'],['Exactly once','`UNIQUE(range, , TRUE)` returns only values that appear once.'],['Blanks','A blank cell appears as a 0 in the result. Filter them out first.']],
  p:[P('Medium','List the unique categories in C2:C9.','UNIQUE.','=UNIQUE(C2:C9)','Electronics and Furniture.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','Get unique values in Excel 2016.','No UNIQUE.','Use Remove Duplicates on a copy, an Advanced Filter with Unique records only, a pivot table, or Power Query.','State at least two alternatives.')],
  q:[Q('Basic','What does UNIQUE do?','It returns the distinct values of a range as a spilling list.',{ f:[['What causes #SPILL!?','Non-empty cells where the result should appear.']] }),
     Q('Scenario','Build a summary table with one row per customer.','UNIQUE for the customer list, then SUMIFS beside it, so new customers appear automatically.',{ t:'A pivot table gives the same result with less typing.' })],
  r:RT(['Need','Formula'],[['Distinct list','`=UNIQUE(r)`'],['Count distinct','`=COUNTA(UNIQUE(r))`'],['Sorted distinct','`=SORT(UNIQUE(r))`'],['Appear once','`=UNIQUE(r,,TRUE)`']]), rel:['filter-function','sort-function','remove-duplicates','countif'] });

/* --- filter-function --- */
DEEP['filter-function'] = {
  level:'Intermediate',
  tldr:'FILTER returns only the rows that meet a condition, as a live list that **spills** into the cells below. It needs Excel 2021 or Microsoft 365.',
  intuition:{ text:[
    'The Filter button hides rows in the data. The FILTER function does something different: it creates a **separate list** of the matching rows somewhere else, and keeps it up to date. That makes it ideal for reports and dashboards, where the source stays untouched.',
    'The result spills: you write the formula in one cell, and Excel fills as many cells as the answer needs. If the data changes, the list grows or shrinks.'
  ], analogy:'A photocopier that makes a fresh copy of only the pages that match, every time the originals change.' },
  how:[
    'Give FILTER the range to return, for example `A2:D9`.',
    'Give a condition with the same number of rows, such as `B2:B9="North"`.',
    'Optionally give a message for "no results".',
    'Excel evaluates the condition for every row and returns the rows where it is TRUE.',
    'Combine conditions with `*` for AND and `+` for OR.'
  ],
  diagrams:[
    { type:'flow', arrows:['B2:B9 = "North"'], panels:[
      { title:'Source (8 rows)', rows:[['Order','Region','Category','Sales'],['O-101','North','Electronics',12000],['O-102','South','Furniture',8000],['O-103','North','Furniture',15000],['O-104','East','Electronics',9500]], hl:{1:'hit',3:'hit'} },
      { title:'FILTER result (spills)', rows:[['Order','Region','Category','Sales'],['O-101','North','Electronics',12000],['O-103','North','Furniture',15000],['O-106','North','Electronics',7000]] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'AND and OR conditions', scenario:'You want South orders of 10000 or more, or any East order.', table:withHl(SALESLOG,{},'Sheet: Sales log'), task:'Combine conditions.', formula:'=FILTER(A2:D9,\n  ((B2:B9="South")*(D2:D9>=10000)) + (B2:B9="East"),\n  "No orders")',
      steps:['Multiplication is AND: South and at least 10000.','Addition is OR: either that group, or East.','The result contains O-104, O-105, O-107 and O-108.'], table2:{ rows:[['Order','Region','Category','Sales'],['O-104','East','Electronics',9500],['O-105','South','Electronics',11000],['O-107','East','Furniture',6000],['O-108','South','Electronics',13000]], caption:'Result' }, result:'Four rows, kept in the original order.' },
    { level:'Business case', title:'A report that follows a dropdown, sorted', scenario:'A manager picks a region in G1, and the sheet lists that region\'s orders, largest first.', table:withHl(SALESLOG,{},'Sheet: Sales log (G1 = North)'), task:'Combine FILTER and SORT.', formula:'=SORT(FILTER(A2:D9, B2:B9=G1, "No orders"), 4, -1)',
      steps:['FILTER returns the North rows.','SORT orders them by column 4 (Sales), descending.'], table2:{ rows:[['Order','Region','Category','Sales'],['O-103','North','Furniture',15000],['O-101','North','Electronics',12000],['O-106','North','Electronics',7000]], caption:'Result' }, result:'Change G1 to South and the whole list rebuilds itself.' }
  ],
  edge:[
    { t:'#SPILL!', d:'The cells the result needs must be empty. Anything in the way, even a space, gives `#SPILL!`. Clear the range.' },
    { t:'#CALC! when empty', d:'If no rows match and you gave no message, FILTER returns `#CALC!`. Always supply the third argument.' },
    { t:'Condition size', d:'The condition range must have the same number of rows as the array. Otherwise `#VALUE!`.' },
    { t:'Headers are not included', d:'FILTER returns data rows only. Add headings in the row above, or use `VSTACK` in Microsoft 365.' },
    { t:'Version', d:'FILTER needs Excel 2021 or Microsoft 365. In older versions use the Advanced Filter, a pivot table or helper formulas.' },
    { t:'Refer to the spill', d:'`F2#` refers to the entire spilled range, for use in charts, sums or other formulas.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List only the Electronics orders and show the count of results above it.', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'FILTER, then ROWS around a second FILTER.', solution:'List: =FILTER(A2:D9, C2:C9="Electronics", "None")\nCount: =ROWS(FILTER(A2:D9, C2:C9="Electronics"))', explain:'Five orders qualify. If nothing matched, ROWS would return an error, so wrap with IFERROR for 0.' },
    { level:'Interview', q:'Replicate FILTER in Excel 2016, which has no dynamic arrays.', hint:'What other tools return a subset of rows?', solution:'Options:\n1. Data > Advanced Filter with "Copy to another location".\n2. A pivot table.\n3. A helper column that numbers the matching rows, then INDEX/MATCH to fetch each in turn.\n4. Power Query to filter and load to a sheet.', explain:'Listing alternatives, with trade-offs, shows you can work in whatever version the client uses.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does the FILTER function do?', a:'It returns the rows of a range that meet a condition, as a dynamic list that spills into neighbouring cells and updates when the data changes.',
      follow:[ { q:'How do you combine conditions?', a:'Multiply for AND and add for OR.' } ] },
    { level:'Intermediate', q:'What causes #SPILL! and how do you fix it?', a:'The cells where the result should appear are not empty. I clear them or move the formula. Merged cells and tables in the way also cause it.',
      tradeoff:'Spilled results cannot be placed inside Tables, so reports are built on normal ranges.' },
    { level:'Scenario', q:'Build a "top 5 customers" box that updates automatically.', a:'Summarise sales per customer with a pivot or SUMIFS, then =TAKE(SORT(table, 2, -1), 5) in Microsoft 365, or FILTER with a rank condition: =FILTER(table, rank_column<=5).',
      tradeoff:'FILTER with a rank column works in Excel 2021. TAKE requires Microsoft 365.' }
  ],
  ref:{ headers:['Pattern','Formula'], rows:[['One condition','`=FILTER(data, col="x", "none")`'],['AND','`(c1)*(c2)`'],['OR','`(c1)+(c2)`'],['Sorted','`=SORT(FILTER(...), col, -1)`'],['Whole spill','`F2#`']] },
  related:['unique','sort-function','xlookup','pivot-fields']
};

/* --- sort-function --- */
D('sort-function',{ l:'Intermediate', t:'SORT returns a sorted copy of a range as a live list and leaves the source untouched. It needs Excel 2021 or Microsoft 365.',
  i:['The Sort button rearranges your data once. The SORT function builds a separate sorted list that updates when the source changes, which is perfect for leaderboards and dashboards.','You pick the column to sort by and the direction.'], a:'A photocopy of the list in the order you want, refreshed automatically.',
  h:['Write `=SORT(range, column, order)`.','The column is counted inside the range.','Order 1 is ascending, -1 is descending.','Combine with FILTER and UNIQUE for dynamic reports.'],
  d:[FL(['SORT by Sales, descending'],[{ title:'Source', rows:[['Order','Sales'],['O-101',12000],['O-102',8000],['O-103',15000]] },{ title:'Result', rows:[['Order','Sales'],['O-103',15000],['O-101',12000],['O-102',8000]], hl:{1:'hit'} }])],
  x:[X('Variation','Sorting by two columns','Region A to Z, then sales high to low.','Pass arrays of columns and orders.','=SORT(A2:D9, {2,4}, {1,-1})',['Column 2 (region) ascending, then column 4 (sales) descending.'],'The list is grouped by region with the biggest orders first.',withHl(SALESLOG,{},'Sheet: Sales log')),
     X('Business case','A top 3 list that updates itself','A dashboard shows the three largest orders.','Combine SORT and TAKE.','=TAKE(SORT(A2:D9, 4, -1), 3)',['SORT puts the biggest first.','TAKE keeps three rows (Microsoft 365).'],'O-103, O-108 and O-101 appear, and the list updates when data changes.')],
  e:[['Version','Excel 2021 and Microsoft 365. TAKE is 365 only.'],['Column index','Counted inside the range, not on the sheet.'],['Source unchanged','SORT does not modify the data, unlike the Sort button.'],['#SPILL!','Needs free cells below.'],['Ties','Equal values keep their original order.']],
  p:[P('Medium','List the orders sorted by sales, largest first.','Column 4, order -1.','=SORT(A2:D9, 4, -1)','O-103 (15000) is first.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','Sort a list in Excel 2016 so it updates automatically.','No SORT function.','Use a helper rank column (RANK + COUNTIF) and INDEX/MATCH to pull rows in order, or Power Query with refresh.','Name a refreshable approach.')],
  q:[Q('Basic','What does SORT do?','It returns a sorted copy of a range as a live, spilling list.',{ f:[['How does it differ from the Sort button?','The button changes the data once. SORT leaves it unchanged and updates automatically.']] }),
     Q('Scenario','A dashboard needs the top 5 customers by sales.','TAKE(SORT(summary, 2, -1), 5) in Microsoft 365, or a rank column with INDEX/MATCH in older versions.',{ t:'Dynamic formulas keep the dashboard current.' })],
  r:RT(['Need','Formula'],[['Sort ascending','`=SORT(r, 1, 1)`'],['Sort descending by col 4','`=SORT(r, 4, -1)`'],['Sort and unique','`=SORT(UNIQUE(r))`'],['Top n','`=TAKE(SORT(r, 4, -1), n)`']]), rel:['unique','filter-function','sort','rank'] });
})();
