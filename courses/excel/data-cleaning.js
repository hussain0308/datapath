/* Datapath | Excel | Sorting, cleaning and formatting
 * Lessons in this file: sort, filter, remove-duplicates, text-to-columns, flash-fill, find-replace, data-validation, conditional-formatting
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
  const { SALESLOG, DUPS } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- sort --- */
'sort': {
  title:'Sort', tagline:'Put rows in order by one or more columns.',
  prereq:[],
  what:['Sorting rearranges rows by the values in a column.','You can sort A to Z, Z to A, smallest to largest or largest to smallest.','You can sort by several columns, one after another.'],
  why:['See top and bottom performers quickly.','Group similar rows together before reviewing or cleaning.'],
  syntax:{ code:'Data > Sort\nData > Sort A to Z / Z to A', parts:[['Sort by','The main column to sort on.'],['Sort On / Order','Cell values, and A to Z or Z to A (smallest to largest or largest to smallest).'],['Add Level','Adds a second or third sort column.']] },
  points:['Always select a cell inside the data (or the whole table) so all columns move together.','Check **My data has headers**, so the header row is not sorted.','Multi-level sort: for example Region A to Z, then Sales largest to smallest.','Custom lists sort months or priorities in a meaningful order, not alphabetically.','Sorting changes the actual row order. Undo with Ctrl+Z, or keep an index column.'],
  mistakes:['Sorting one column only, which scrambles the rows.','Not including the header option.','Sorting data with merged cells.'],
  example:{ title:'Finding the biggest orders', scenario:'You want the sales log ordered from the largest sales to the smallest.',
    table:withHl(SALESLOG,{'D2:D9':'range'},'Sheet: Sales log'), task:'Sort the table by Sales, largest to smallest.', formula:'Data > Sort > Sort by: Sales > Order: Largest to Smallest',
    steps:['Click any cell in the table.','Open Data > Sort and choose the Sales column.','Choose Largest to Smallest and press OK. All columns move together.'],
    table2:{ rows:[['Order','Region','Category','Sales'],['O-103','North','Furniture',15000],['O-108','South','Electronics',13000],['O-101','North','Electronics',12000],['O-105','South','Electronics',11000],['O-104','East','Electronics',9500],['O-102','South','Furniture',8000],['O-106','North','Electronics',7000],['O-107','East','Furniture',6000]], caption:'Result after sorting' }, result:'The largest order, O-103 at 15000, is now at the top.' },
  practice:{ q:'How would you sort the sales log by Region A to Z, and within each region by Sales largest to smallest?', hint:'Use a multi-level sort with Add Level.', solution:'Data > Sort > Sort by Region (A to Z) > Add Level > Then by Sales (Largest to Smallest) > OK', explain:'The first level groups the rows by region. The second level orders the sales inside each region, so the North block starts with 15000.' },
  interview:[
    { level:'Basic', q:'How do you sort data in Excel?', a:'I select a cell in the data, go to Data > Sort, choose the column and order, and confirm that my data has headers. All columns move together.' },
    { level:'Intermediate', q:'What goes wrong if you sort only one column?', a:'The other columns stay in place, so the values no longer match their rows. The data gets scrambled. Selecting a single cell in the table, or using a Table, avoids this.' },
    { level:'Intermediate', q:'How do you sort by more than one column?', a:'In the Sort dialog I add levels, for example Region first and Sales second. Excel sorts by the first level and then by the next level within equal values.' },
    { level:'Scenario', q:'Months sort alphabetically (Apr, Aug, Dec). How do you fix it?', a:'I use a custom list in the Sort dialog (Order > Custom List > Jan, Feb, Mar...), or add a month-number helper column and sort by that.' }
  ],
  mcq:[
    { q:'What is the safest way to sort a table?', o:['Click one cell inside it and sort','Select only the sort column','Delete the headers first','Sort each column separately'], a:0, why:'Excel then moves whole rows together.' },
    { q:'What does "My data has headers" do?', o:['Keeps the header row out of the sort','Sorts the header too','Deletes the header','Hides the header'], a:0, why:'The first row is treated as headings.' },
    { q:'How do you sort by two columns?', o:['Add Level in the Sort dialog','Sort twice by hand only','Merge the columns','Use SUM'], a:0, why:'Each level adds a sort column.' },
    { q:'What does Largest to Smallest mean?', o:['Descending order','Ascending order','Random order','Alphabetical'], a:0, why:'The biggest value goes first.' },
    { q:'Months sort alphabetically. What helps?', o:['A custom list','The SUM function','Merging cells','A pivot'], a:0, why:'A custom list sets a meaningful order such as Jan, Feb, Mar.' }
  ],
  recap:['Sort whole rows together by clicking inside the data.','Use levels for multi-column sorting.','Custom lists fix month and priority order.']
},

/* --- filter --- */
'filter': {
  title:'Filter', tagline:'Show only the rows you want and hide the rest.',
  prereq:['sort'],
  what:['A filter hides the rows that do not meet your condition.','The hidden rows are not deleted.','You can filter by value, text, number, colour or date.'],
  why:['Look at one region, month or status at a time.','Quick answers without writing formulas.'],
  syntax:{ code:'Data > Filter     (shortcut: Ctrl + Shift + L)', parts:[['Filter buttons','Drop-down arrows that appear on the header row.'],['Text / Number / Date filters','Conditions such as contains, greater than, between.'],['Clear','Removes the filter and shows all rows again.']] },
  points:['Shortcut: **Ctrl + Shift + L** switches filters on and off.','You can filter several columns at the same time; they work as AND.','Row numbers turn blue to show a filter is on.','SUM adds hidden rows too. Use `SUBTOTAL(9, ...)` for visible rows only.','To copy only the visible rows, select them and paste; Excel copies only the visible cells.'],
  mistakes:['Forgetting that a filter is on and missing rows.','Using SUM instead of SUBTOTAL on filtered data.','Having blank rows in the data, so the filter stops early.'],
  example:{ title:'Showing one region', scenario:'You want to see only North orders in the sales log.',
    table:withHl(SALESLOG,{'B2':'hit','B4':'hit','B7':'hit'},'Sheet: Sales log'), task:'Filter the Region column to North.', formula:'Data > Filter > Region drop-down > select North only > OK',
    steps:['Click inside the table and press Ctrl + Shift + L.','Open the Region drop-down and clear Select All, then tick North.','Rows for South and East are hidden.'],
    table2:{ rows:[['Order','Region','Category','Sales'],['O-101','North','Electronics',12000],['O-103','North','Furniture',15000],['O-106','North','Electronics',7000]], caption:'Visible rows after filtering' }, result:'Three North orders remain visible, and the other rows are only hidden.' },
  practice:{ q:'How do you show only orders with sales of 10000 or more?', hint:'Use the Number Filters option in the Sales drop-down.', solution:'Data > Filter > Sales drop-down > Number Filters > Greater Than Or Equal To > 10000 > OK', explain:'Four orders qualify: O-101, O-103, O-105 and O-108.' },
  interview:[
    { level:'Basic', q:'What does a filter do, and does it delete data?', a:'A filter hides rows that do not meet the condition. The data is not deleted, and clearing the filter brings every row back.' },
    { level:'Intermediate', q:'What is the shortcut to apply or remove filters?', a:'Ctrl + Shift + L.' },
    { level:'Intermediate', q:'Why does SUM give the full total on a filtered list?', a:'SUM includes hidden rows. SUBTOTAL(9, range) adds only the visible rows, so I use it for totals on filtered data.' },
    { level:'Scenario', q:'A filter seems to miss part of your data. What do you check?', a:'I check for blank rows or columns that split the data, because the filter stops there. I also check that no other column filter is still active.' }
  ],
  mcq:[
    { q:'What shortcut turns filters on and off?', o:['Ctrl + Shift + L','Ctrl + F','Ctrl + H','Alt + F4'], a:0, why:'Ctrl + Shift + L toggles AutoFilter.' },
    { q:'Does filtering delete rows?', o:['No, it hides them','Yes','Only text rows','Only blank rows'], a:0, why:'Hidden rows are still in the sheet.' },
    { q:'Which function totals only visible rows?', o:['SUBTOTAL','SUM','COUNT','ROUND'], a:0, why:'SUBTOTAL ignores rows hidden by a filter.' },
    { q:'How do filters on several columns combine?', o:['AND','OR','XOR','They do not'], a:0, why:'A row must pass every column filter.' },
    { q:'What can make a filter stop early?', o:['A blank row in the data','A long header','Bold text','A number format'], a:0, why:'A blank row splits the data range.' }
  ],
  recap:['Filters hide rows without deleting them.','Ctrl + Shift + L toggles filters.','Use SUBTOTAL for totals on filtered data.']
},

/* --- remove-duplicates --- */
'remove-duplicates': {
  title:'Remove Duplicates', tagline:'Delete repeated rows and keep one copy.',
  prereq:['filter'],
  what:['Remove Duplicates deletes rows that repeat on the columns you select.','It keeps the **first** occurrence.','It permanently deletes the other rows.'],
  why:['Clean customer, product or transaction lists.','Prevent double counting in reports.'],
  syntax:{ code:'Data > Remove Duplicates', parts:[['Columns','Choose which columns decide whether a row is a duplicate.'],['My data has headers','Keeps the header row out of the check.']] },
  points:['Rows are duplicates only if **all selected columns** match.','It is not case sensitive.','Leading or trailing spaces make values different, so TRIM first.','Work on a **copy** of the data, because deletion is permanent.','To only mark duplicates, use conditional formatting or `COUNTIF`.'],
  mistakes:['Running it on the only copy of the data.','Selecting too few or too many columns.','Not trimming spaces, so some duplicates stay.'],
  example:{ title:'Cleaning a customer list', scenario:'The customer list contains repeated rows.',
    table:withHl(DUPS,{'A4':'hit','B4':'hit','A6':'hit','B6':'hit'},'Sheet: Customers'), task:'Remove the rows that repeat on both Customer and City.', formula:'Data > Remove Duplicates > tick Customer and City > OK',
    steps:['Rows 4 and 6 repeat rows 2 and 3 exactly.','Excel keeps the first occurrences and deletes the repeats.','A message reports 2 duplicates removed and 3 unique values remaining.'],
    table2:{ rows:[['Customer','City'],['Asha','Pune'],['Bilal','Delhi'],['Chitra','Pune']], caption:'Result' }, result:'Three unique customers remain.' },
  practice:{ q:'In the customer list, how would you keep one row per customer name, whatever the city?', hint:'Tick only the Customer column in the dialog.', solution:'Data > Remove Duplicates > tick only Customer > OK', explain:'Only the Customer column is compared. Asha, Bilal and Chitra each remain once.' },
  interview:[
    { level:'Basic', q:'What does Remove Duplicates do?', a:'It deletes rows that repeat on the columns I select and keeps the first occurrence.' },
    { level:'Intermediate', q:'Why are some duplicates not removed?', a:'Extra spaces or small differences make values unequal. I TRIM the text first. Remove Duplicates ignores case, so case is not the cause.' },
    { level:'Intermediate', q:'How can you find duplicates without deleting them?', a:'Conditional formatting > Highlight Cells Rules > Duplicate Values, or a helper column with =COUNTIF($A$2:$A$100,A2)>1.' },
    { level:'Scenario', q:'Before cleaning a large list, what do you do?', a:'I copy the sheet or keep the raw data, because Remove Duplicates permanently deletes rows. I also TRIM text and decide which columns define a duplicate.' }
  ],
  mcq:[
    { q:'Which occurrence does Remove Duplicates keep?', o:['The first','The last','A random one','All of them'], a:0, why:'The first row stays and later repeats are deleted.' },
    { q:'When are two rows duplicates?', o:['All selected columns match','Any column matches','The first column matches','Never'], a:0, why:'Only the selected columns are compared.' },
    { q:'Is Remove Duplicates case sensitive?', o:['No','Yes','Only for names','Only for numbers'], a:0, why:'Asha and ASHA are treated as the same.' },
    { q:'What should you do before using it?', o:['Work on a copy','Delete headers','Sort the data','Merge cells'], a:0, why:'The deletion is permanent.' },
    { q:'How can you mark duplicates without deleting?', o:['Conditional formatting','Remove Duplicates','Sort','Filter by colour only'], a:0, why:'Highlight Duplicate Values shows them.' }
  ],
  recap:['Remove Duplicates keeps the first row and deletes the repeats.','Choose the columns that define a duplicate.','Work on a copy and TRIM first.']
},

/* --- text-to-columns --- */
'text-to-columns': {
  title:'Text to Columns', tagline:'Split text in one column into several columns.',
  prereq:['trim'],
  what:['Text to Columns splits the text of a cell at a delimiter, such as a space or comma.','It can also split at fixed widths.','The result is static values, not formulas.'],
  why:['Split full names, addresses and imported CSV data.','Fix numbers and dates that came in as text.'],
  syntax:{ code:'Data > Text to Columns', parts:[['Delimited','Split at a separator such as comma, space, tab or semicolon.'],['Fixed width','Split at set positions, such as after the 3rd character.'],['Destination','Where the split parts go. Change it so you do not overwrite data.']] },
  points:['Step 1: choose Delimited or Fixed width.','Step 2: choose the delimiter (comma, space, other).','Step 3: set each column format (General, Text, Date) and the destination.','Cells to the right are overwritten unless you change the destination.','Formula alternatives: `LEFT`, `MID`, `FIND`, or `TEXTSPLIT` in Microsoft 365.'],
  mistakes:['Overwriting columns to the right.','Splitting numbers with leading zeros without setting the column to Text.','Using space as a delimiter for names with three parts.'],
  example:{ title:'Splitting full names', scenario:'Full names are in one column and you want first and last names separately.',
    table:withHl({rows:[['Full name'],['Asha Rao'],['Kiran Reddy']]},{'A2:A3':'range'},'Sheet: Staff'), task:'Split the names at the space.', formula:'Data > Text to Columns > Delimited > Space > Finish',
    steps:['Select A2:A3 and open Data > Text to Columns.','Choose Delimited, then tick Space as the delimiter.','Set the destination to B2 so column A stays intact, and press Finish.'],
    table2:{ rows:[['Full name','First','Last'],['Asha Rao','Asha','Rao'],['Kiran Reddy','Kiran','Reddy']], caption:'Result' }, result:'First and last names are now in separate columns.' },
  practice:{ q:'A cell holds Pune,Maharashtra. How do you split it into city and state?', hint:'Use the comma as the delimiter.', solution:'Data > Text to Columns > Delimited > Comma > Finish', explain:'The text before the comma goes into the first column and the text after it goes into the next.' },
  interview:[
    { level:'Basic', q:'What does Text to Columns do?', a:'It splits the text in a column into several columns at a delimiter such as a space, comma or tab, or at fixed widths.' },
    { level:'Intermediate', q:'What is the risk of using it without setting a destination?', a:'It overwrites the columns to the right of the data. I set a destination, or insert empty columns first.' },
    { level:'Intermediate', q:'How do you keep leading zeros when splitting codes such as 00123?', a:'In step 3 I set that column to Text format, otherwise Excel converts it to a number and the zeros disappear.' },
    { level:'Scenario', q:'How would you split names with formulas, so the result updates?', a:'LEFT with FIND for the first name and MID or RIGHT for the rest, or TEXTSPLIT in Microsoft 365. Text to Columns is a one-time action and does not update.' }
  ],
  mcq:[
    { q:'What does Delimited mean?', o:['Split at a separator character','Split at fixed positions','Merge columns','Delete columns'], a:0, why:'A delimiter is a character such as a comma or space.' },
    { q:'Is the result of Text to Columns a formula?', o:['No, it is static values','Yes','Only for numbers','Only for dates'], a:0, why:'It does not update when the source changes.' },
    { q:'How do you avoid overwriting the next column?', o:['Set a destination','Sort the data','Filter the data','Merge cells'], a:0, why:'The destination decides where the output starts.' },
    { q:'How do you keep leading zeros?', o:['Set the column format to Text','Use General','Use Date','Use Percentage'], a:0, why:'Text format keeps the zeros.' },
    { q:'Which formulas can replace it?', o:['LEFT, MID and FIND','SUM and AVERAGE','ROUND and RANK','COUNT and MAX'], a:0, why:'They can split text with live formulas.' }
  ],
  recap:['Text to Columns splits text at a delimiter or fixed width.','Set a destination and the column format.','The result is static, not a formula.']
},

/* --- flash-fill --- */
'flash-fill': {
  title:'Flash Fill', tagline:'Let Excel copy a pattern you show by example.',
  prereq:['text-to-columns'],
  what:['Flash Fill fills a column by recognising the pattern in your first example.','It works for splitting, joining and reformatting text.','The result is static values.'],
  why:['Extract first names, initials or codes quickly.','Reformat phone numbers or IDs without writing formulas.'],
  syntax:{ code:'Type an example, then press Ctrl + E\n(or Data > Flash Fill)', parts:[['Example','Type the result you want in the first cell next to your data.'],['Ctrl + E','Excel fills the rest of the column based on the pattern.']] },
  points:['Available from **Excel 2013**.','You show 1 or 2 examples, and Excel guesses the pattern.','Always check the results. Excel can guess wrong.','The result does not update if the source changes.','It stops when the pattern is unclear. Type another example to correct it.'],
  mistakes:['Trusting the result without checking.','Expecting live updates.','Examples that do not show a clear pattern.'],
  example:{ title:'Extracting first names', scenario:'Full names are in column A. You want only the first names.',
    table:withHl({rows:[['Full name','First name'],['Asha Rao','Asha'],['Kiran Reddy',''],['Meera Nair','']]},{'A2':'find','B2':'hit'},'Sheet: Staff'), task:'Fill the first name column.', formula:'Type Asha in B2, then press Ctrl + E in B3',
    steps:['Type the first name for the first row yourself.','Click B3 and press Ctrl + E.','Excel recognises the pattern and fills the rest.'],
    table2:{ rows:[['Full name','First name'],['Asha Rao','Asha'],['Kiran Reddy','Kiran'],['Meera Nair','Meera']], caption:'Result' }, result:'Excel fills Kiran and Meera.' },
  practice:{ q:'Phone numbers look like 9876543210. How would you make them look like 98765-43210 with Flash Fill?', hint:'Type the first number in the new format, then use the shortcut.', solution:'Type 98765-43210 next to the first number, then press Ctrl + E', explain:'Excel sees that a hyphen is inserted after the 5th digit and applies it to the rest.' },
  interview:[
    { level:'Basic', q:'What is Flash Fill?', a:'A feature that fills a column by recognising the pattern from an example I type. The shortcut is Ctrl + E.' },
    { level:'Intermediate', q:'What is the difference between Flash Fill and formulas?', a:'Flash Fill writes static values, so it does not update when the source changes. Formulas stay live, but they take longer to write.' },
    { level:'Intermediate', q:'What do you do if Flash Fill guesses wrongly?', a:'I check the results, then type a second or third example that shows the pattern better and run it again.' },
    { level:'Scenario', q:'When would you avoid Flash Fill?', a:'For data that changes regularly or needs to be repeatable, because it does not update. I use formulas, or Power Query for repeatable cleaning.' }
  ],
  mcq:[
    { q:'What is the shortcut for Flash Fill?', o:['Ctrl + E','Ctrl + F','Ctrl + H','Ctrl + K'], a:0, why:'Ctrl + E triggers Flash Fill.' },
    { q:'Does Flash Fill update when the source changes?', o:['No','Yes','Only for text','Only in tables'], a:0, why:'It creates static values.' },
    { q:'From which version is Flash Fill available?', o:['Excel 2013','Excel 2007','Excel 2003','Excel 2010'], a:0, why:'It was introduced in Excel 2013.' },
    { q:'What should you do after using Flash Fill?', o:['Check the results','Delete the source','Merge cells','Sort the data'], a:0, why:'Excel may guess the pattern incorrectly.' },
    { q:'How do you teach Flash Fill a pattern?', o:['Type an example','Write a macro','Use SUM','Sort the data'], a:0, why:'It learns from your typed example.' }
  ],
  recap:['Flash Fill learns a pattern from your example (Ctrl + E).','The results are static and need checking.','Use formulas or Power Query when the data changes.']
},

/* --- find-replace --- */
'find-replace': {
  title:'Find and Replace', tagline:'Search for text or values and change them in bulk.',
  prereq:[],
  what:['Find locates text or numbers in a sheet or workbook.','Replace changes them to something else.','It supports options such as match case and whole-cell matching.'],
  why:['Fix spelling, codes and abbreviations in many cells at once.','Remove unwanted characters in imported data.'],
  syntax:{ code:'Ctrl + F   Find\nCtrl + H   Replace', parts:[['Find what','The text or value to look for. Wildcards * and ? work.'],['Replace with','The new text. Leave empty to delete.'],['Options','Match case, Match entire cell contents, Within sheet or workbook, Look in formulas or values.']] },
  points:['**Match entire cell contents** replaces only cells that equal the text exactly.','Without it, Excel replaces the text **inside** longer text too.','Wildcards: `*` any characters, `?` one character, `~` to search for a real * or ?.','Use **Find All** first to see what will change.','Replace All cannot be undone after saving, so test on a copy.'],
  mistakes:['Replacing without Match entire cell contents and damaging longer text.','Using Replace All without checking Find All.','Forgetting the search scope (sheet or workbook).'],
  example:{ title:'Expanding an abbreviation', scenario:'Some cities were typed as Hyd. You want Hyderabad, but Hyderabad already exists in the list.',
    table:withHl({rows:[['City'],['Hyd'],['Pune'],['Hyderabad'],['Hyd']]},{'A2':'hit','A5':'hit'},'Sheet: Cities'), task:'Replace Hyd with Hyderabad safely.', formula:'Ctrl + H > Find what: Hyd > Replace with: Hyderabad > Options > tick Match entire cell contents > Replace All',
    steps:['Without the option, Excel would also change Hyderabad into Hyderabaderabad.','With Match entire cell contents, only cells that equal Hyd are replaced.'],
    table2:{ rows:[['City'],['Hyderabad'],['Pune'],['Hyderabad'],['Hyderabad']], caption:'Result' }, result:'Two cells are corrected and the existing Hyderabad stays correct.' },
  practice:{ q:'How would you delete all hyphens from the phone numbers in a column?', hint:'Leave Replace with empty.', solution:'Ctrl + H > Find what: - > Replace with: (leave empty) > Replace All', explain:'Each hyphen is replaced by nothing, so 98765-43210 becomes 9876543210.' },
  interview:[
    { level:'Basic', q:'What are the shortcuts for Find and Replace?', a:'Ctrl + F opens Find and Ctrl + H opens Replace.' },
    { level:'Intermediate', q:'What does Match entire cell contents do?', a:'It replaces only cells whose whole content equals the search text. Without it, Excel also changes matches inside longer text.' },
    { level:'Intermediate', q:'How do wildcards work in Find?', a:'* stands for any number of characters and ? for one character. To search for a real asterisk or question mark, put ~ before it.' },
    { level:'Scenario', q:'You need to replace text in the whole workbook, not just one sheet. How?', a:'In the Find and Replace options, set Within to Workbook. I use Find All first to review the matches before replacing.' }
  ],
  mcq:[
    { q:'Which shortcut opens Replace?', o:['Ctrl + H','Ctrl + F','Ctrl + R','Ctrl + G'], a:0, why:'Ctrl + H is Replace.' },
    { q:'What does Match entire cell contents do?', o:['Replaces only exact whole-cell matches','Replaces all text inside cells','Matches case','Deletes cells'], a:0, why:'It avoids changing parts of longer text.' },
    { q:'Which wildcard stands for any number of characters?', o:['*','?','~','#'], a:0, why:'* matches any characters.' },
    { q:'What should you do before Replace All?', o:['Use Find All to review','Delete the sheet','Merge cells','Sort the data'], a:0, why:'Find All shows what will change.' },
    { q:'What does an empty Replace with do?', o:['Deletes the found text','Adds a space','Causes an error','Replaces with 0'], a:0, why:'The found text is replaced by nothing.' }
  ],
  recap:['Ctrl + F finds, Ctrl + H replaces.','Use Match entire cell contents for exact whole-cell changes.','Check with Find All before Replace All.']
},

/* --- data-validation --- */
'data-validation': {
  title:'Data Validation', tagline:'Control what people can type into a cell.',
  prereq:[],
  what:['Data Validation sets rules for what can be entered in a cell.','It can show a drop-down list, or limit numbers, dates and text length.','It shows a message when the rule is broken.'],
  why:['Prevent typing errors and inconsistent values such as Open, open and OPEN.','Make forms and trackers reliable.'],
  syntax:{ code:'Data > Data Validation', parts:[['Allow','The type of rule: List, Whole number, Decimal, Date, Text length or Custom.'],['Input Message','A hint shown when the cell is selected.'],['Error Alert','What happens on invalid entry: Stop, Warning or Information.']] },
  points:['A **List** rule creates a drop-down: type items separated by commas, or point to a range.','Whole number and Date rules can use between, greater than and so on.','**Stop** blocks invalid data; Warning and Information only warn.','Pasted data can bypass validation.','**Circle Invalid Data** marks cells that break the rules.'],
  mistakes:['Assuming validation stops pasted values.','Typing list items with extra spaces.','Using Warning when Stop is needed.'],
  example:{ title:'A status drop-down', scenario:'A ticket tracker should only allow Open, Pending or Closed in the Status column.',
    table:withHl({rows:[['Ticket','Status'],['T-1','Open'],['T-2','Pending'],['T-3','']]},{'B2:B4':'range'},'Sheet: Tickets'), task:'Restrict B2:B4 to three choices.', formula:'Data > Data Validation > Allow: List > Source: Open,Pending,Closed',
    steps:['Select B2:B4 and open Data > Data Validation.','Choose Allow: List.','Type Open,Pending,Closed in Source, and keep In-cell dropdown ticked.'], result:'Each cell shows a drop-down arrow, and other entries are rejected.' },
  practice:{ q:'How do you allow only whole numbers between 1 and 100 in a column?', hint:'Choose Whole number and the between option.', solution:'Data > Data Validation > Allow: Whole number > Data: between > Minimum: 1 > Maximum: 100', explain:'Entries such as 0, 101 or 5.5 are rejected with the Stop error alert.' },
  interview:[
    { level:'Basic', q:'What is Data Validation?', a:'A feature that restricts what can be entered in a cell, for example a drop-down list or numbers between two values.' },
    { level:'Intermediate', q:'What are the three error alert styles?', a:'Stop blocks the entry, Warning lets the user decide, and Information only informs the user.' },
    { level:'Intermediate', q:'Can users bypass validation?', a:'Yes, by pasting values into the cell, which skips the rule. I use Circle Invalid Data to find such cells.' },
    { level:'Scenario', q:'How do you create a drop-down that updates when new items are added?', a:'I keep the list in an Excel Table or use a dynamic range as the source, so the drop-down grows with the list.' }
  ],
  mcq:[
    { q:'Which Allow option creates a drop-down?', o:['List','Whole number','Date','Custom'], a:0, why:'List shows a drop-down with the allowed items.' },
    { q:'Which alert style blocks invalid entries?', o:['Stop','Warning','Information','Silent'], a:0, why:'Stop does not let the entry in.' },
    { q:'Can pasting bypass validation?', o:['Yes','No','Only for numbers','Only in tables'], a:0, why:'Pasted data skips the rules.' },
    { q:'How do you list items directly in the Source box?', o:['Separate them with commas','Separate them with spaces','Use quotes only','Use plus signs'], a:0, why:'Type Open,Pending,Closed.' },
    { q:'What does Circle Invalid Data do?', o:['Marks cells that break the rules','Deletes them','Sorts them','Locks them'], a:0, why:'Red circles show invalid cells.' }
  ],
  recap:['Data Validation restricts what can be typed.','Lists create drop-downs; Stop blocks bad entries.','Pasting can bypass it; Circle Invalid Data finds problems.']
},

/* --- conditional-formatting --- */
'conditional-formatting': {
  title:'Conditional Formatting', tagline:'Change how cells look automatically based on their values.',
  prereq:[],
  what:['Conditional Formatting colours cells when they meet a rule.','It updates when the data changes.','It can use highlight rules, data bars, colour scales, icon sets or your own formula.'],
  why:['Spot high, low or overdue values at a glance.','Make reports easier to read.'],
  syntax:{ code:'Home > Conditional Formatting', parts:[['Highlight Cells Rules','Greater than, less than, between, duplicate values, text that contains.'],['Data Bars / Color Scales / Icon Sets','Visual scales inside cells.'],['New Rule > Use a formula','Your own TRUE or FALSE rule, for example =$D2>=10000.']] },
  points:['A formula rule can format a **whole row**: select A2:D9 and use `=$D2>=10000`.','Lock the column with `$` and leave the row relative.','Rules are applied in order; **Manage Rules** lets you reorder or stop them.','Rules do not change the cell values.','Use formula rules for dates, such as overdue: `=$C2<TODAY()`.'],
  mistakes:['Missing the $ in a formula rule, so the highlight shifts.','Too many colours, making the sheet hard to read.','Applying the rule to the wrong range.'],
  example:{ title:'Highlighting big orders', scenario:'You want every order with sales of 10000 or more to stand out.',
    table:withHl(SALESLOG,{'D2':'hit','D4':'hit','D6':'hit','D9':'hit'},'Sheet: Sales log'), task:'Highlight sales of 10000 or more.', formula:'Home > Conditional Formatting > New Rule > Use a formula > =D2>=10000 > Format > OK',
    steps:['Select D2:D9.','Open New Rule and choose Use a formula to determine which cells to format.','Enter =D2>=10000 and choose a fill colour.'], result:'The four cells with 12000, 15000, 11000 and 13000 are coloured.' },
  practice:{ q:'Write a formula rule that colours the whole row (A2:D9) when the Region is North.', hint:'Lock the column and leave the row relative.', solution:'=$B2="North"', explain:'The rule is checked for each row, so all four cells of a North row are coloured.' },
  interview:[
    { level:'Basic', q:'What is Conditional Formatting?', a:'A feature that changes a cell\'s appearance automatically when its value meets a rule, and updates when the data changes.' },
    { level:'Intermediate', q:'How do you highlight a whole row based on one column?', a:'I select the full range and create a New Rule using a formula such as =$D2>=10000, with the column locked and the row relative.' },
    { level:'Intermediate', q:'How do you highlight overdue dates?', a:'A formula rule such as =AND($C2<TODAY(), $D2<>"Done"), applied to the range, so overdue and unfinished tasks are coloured.' },
    { level:'Scenario', q:'Two rules conflict on the same cell. What decides which one shows?', a:'The order in Manage Rules. The rule higher in the list takes priority, and I can reorder rules or use Stop If True.' }
  ],
  mcq:[
    { q:'Which formula rule highlights rows where column B is North?', o:['=$B2="North"','=B2:B9="North"','=North','=B2=North'], a:0, why:'Lock the column and keep the row relative.' },
    { q:'Does Conditional Formatting change cell values?', o:['No','Yes','Only numbers','Only text'], a:0, why:'It only changes the appearance.' },
    { q:'Where do you reorder rules?', o:['Manage Rules','Sort','Filter','Page Layout'], a:0, why:'Manage Rules lists them in priority order.' },
    { q:'What does a colour scale do?', o:['Shades cells by value','Deletes values','Sorts values','Adds values'], a:0, why:'Colours vary from low to high values.' },
    { q:'Which rule highlights overdue dates in column C?', o:['=$C2<TODAY()','=C2>TODAY','=TODAY($C2)','=$C2=0'], a:0, why:'A date earlier than today is overdue.' }
  ],
  recap:['Conditional formatting colours cells by rules and updates automatically.','Formula rules with $ can colour whole rows.','Manage Rules controls the order.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- sort --- */
D('sort',{ l:'Beginner', t:'Sorting rearranges whole rows by one or more columns. Always select inside the data so every column moves together.',
  i:['A sorted list is a readable list: top performers first, names A to Z, dates newest first. Sorting changes the actual order of rows, so each row must move as a unit.','The classic disaster is sorting one column alone: names and numbers fall out of step and the data is scrambled.'], a:'Reordering whole index cards, never just one line on each card.',
  h:['Click any cell inside the data (or convert it to a Table).','Choose **Data > Sort** and tick "My data has headers".','Pick the column, the sort-on option and the order.','Use **Add Level** for a second and third column.'],
  d:[FL(['Sort by Sales, largest first'],[{ title:'Before', rows:[['Order','Sales'],['O-101',12000],['O-102',8000],['O-103',15000]] },{ title:'After', rows:[['Order','Sales'],['O-103',15000],['O-101',12000],['O-102',8000]], hl:{1:'hit'} }])],
  x:[X('Variation','Two levels','Group by region, then biggest sales first inside each region.','Add a level in the Sort dialog.','Data > Sort > Region (A to Z) > Add Level > Sales (Largest to Smallest)',['The first level groups, the second orders within each group.'],'North orders appear together, with 15000 first.',withHl(SALESLOG,{},'Sheet: Sales log')),
     X('Business case','Months in calendar order','Months sort alphabetically (Apr, Aug, Dec).','Use a custom list.','Data > Sort > Order > Custom List > Jan, Feb, Mar ...',['A custom list defines the order you want.','Or add a month-number helper and sort by that.'],'Months now sort Jan to Dec.')],
  e:[['Sorting one column alone','It scrambles the rows. Select a cell in the data, not just one column.'],['Merged cells','Sorting fails or misbehaves with merged cells. Unmerge first.'],['Formulas with relative references','Sorting can change what they point at. Check formulas that refer to other rows.'],['No way back','Keep an index column (1, 2, 3 ...) to restore the original order.']],
  p:[P('Medium','Sort the sales log by region A to Z, then sales high to low.','Two levels.','Data > Sort: Region ascending, Add Level, Sales descending.','The first level groups, the second orders within groups.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','Your sorted data now has the wrong names next to the numbers. What happened?','Selection.','Only one column was selected, so only that column moved. Undo (Ctrl+Z), select a cell inside the data and sort again.','Prevent it by using Tables.')],
  q:[Q('Basic','How do you sort data safely?','Click a cell inside the data, use Data > Sort, tick headers, and choose columns. Whole rows move together.',{ f:[['How do you sort months properly?','A custom list or a month-number helper.']] }),
     Q('Scenario','You need to sort but also restore the original order later.','Add an index column first, and sort by it to restore.',{ t:'Alternatively keep the original sheet and sort a copy.' })],
  r:RT(['Need','How'],[['Sort one column','Data > Sort A to Z'],['Several levels','Add Level'],['Custom order','Order > Custom List'],['Formula-based','`SORT()` (365)']]), rel:['filter','excel-tables','sort-function','remove-duplicates'] });

/* --- filter --- */
D('filter',{ l:'Beginner', t:'A filter hides rows that do not meet your condition. The data is not deleted, and SUM still counts hidden rows.',
  i:['Filtering lets you look at one region, month or status at a time. It is the quickest way to answer "show me only these".','The hidden rows are still there, which surprises people when a SUM total does not change.'], a:'Looking through a window that only shows part of the data.',
  h:['Click inside the data and press **Ctrl + Shift + L**.','Open a column drop-down and tick the items to show.','Use Text, Number or Date filters for conditions.','Clear the filter to show everything.'],
  d:[FL(['Region = North'],[{ title:'All rows', rows:[['Order','Region','Sales'],['O-101','North',12000],['O-102','South',8000],['O-103','North',15000]], hl:{2:'miss'} },{ title:'Visible', rows:[['Order','Region','Sales'],['O-101','North',12000],['O-103','North',15000]], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','A number filter','Show orders of 10000 or more.','Use Number Filters.','Sales drop-down > Number Filters > Greater Than Or Equal To > 10000',['Only matching rows stay visible.'],'Four orders remain.',withHl(SALESLOG,{},'Sheet: Sales log')),
     X('Business case','Totals that follow the filter','A total under a filtered list must match what is visible.','Use SUBTOTAL.','=SUBTOTAL(109, D2:D9)',['SUM would add hidden rows too.','SUBTOTAL ignores them.'],'With the North filter the total is 34000, not 81500.')],
  e:[['Hidden rows are still in formulas','SUM, COUNT and AVERAGE include them. Use SUBTOTAL or AGGREGATE.'],['Blank rows stop the filter','A blank row splits the data range.'],['Filters on several columns','They combine as AND.'],['Copying filtered data','Only visible cells are copied by normal paste.']],
  p:[P('Medium','Show only Electronics orders from the North region.','Two filters.','Filter Region to North and Category to Electronics.','Filters on different columns work as AND.',withHl(SALESLOG,{},'Sheet: Sales log')),
     P('Interview','The total at the bottom of a filtered list did not change. Why?','Which function?','It uses SUM, which includes hidden rows. Use SUBTOTAL(109, range).','This is a very common mistake.')],
  q:[Q('Basic','Does filtering delete rows?','No, it hides them. Clearing the filter shows them again.',{ f:[['What is the shortcut?','Ctrl + Shift + L.']] }),
     Q('Scenario','Build a total that follows slicers or filters.','Use SUBTOTAL(109, ...) or a Table total row.',{ t:'Keep a separate grand total if needed.' })],
  r:RT(['Need','How'],[['Toggle filter','`Ctrl + Shift + L`'],['Visible total','`=SUBTOTAL(109, r)`'],['Clear','Data > Clear'],['Formula list','`FILTER()` (365)']]), rel:['sort','subtotal','filter-function','excel-tables'] });

/* --- remove-duplicates --- */
DEEP['remove-duplicates'] = {
  level:'Beginner to Intermediate',
  tldr:'Remove Duplicates deletes rows that repeat on the columns you choose, and keeps the **first** occurrence. It is permanent, so work on a copy.',
  intuition:{ text:[
    'Duplicates inflate counts and totals: a customer entered twice is counted twice, and their sales may be added twice. Removing them is a routine cleaning step, but it is also destructive: the deleted rows are gone.',
    'The two decisions that matter are which columns define "the same" row, and whether the text is clean enough for equal-looking values to match.'
  ], analogy:'Merging two address books: keep the first entry for each person and throw away the repeats.' },
  how:[
    'Work on a copy of the data, or a copy of the sheet.',
    'Clean the key columns first: TRIM, consistent case.',
    'Select a cell in the data and choose **Data > Remove Duplicates**.',
    'Tick the columns that define a duplicate, and confirm whether the data has headers.',
    'Excel reports how many duplicates were removed and how many unique rows remain.'
  ],
  diagrams:[
    { type:'flow', arrows:['Remove Duplicates (Customer + City)'], panels:[
      { title:'Before (5 rows)', rows:[['Customer','City'],['Asha','Pune'],['Bilal','Delhi'],['Asha','Pune'],['Chitra','Pune'],['Bilal','Delhi']], hl:{3:'miss',5:'miss'} },
      { title:'After (3 rows)', rows:[['Customer','City'],['Asha','Pune'],['Bilal','Delhi'],['Chitra','Pune']] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Choosing fewer columns', scenario:'One row per customer is needed, whatever the city.', table:withHl({rows:[['Customer','City'],['Asha','Pune'],['Asha','Mumbai'],['Bilal','Delhi']]},{'A3:B3':'miss'},'Sheet: Customers'), task:'Tick only the Customer column.', formula:'Data > Remove Duplicates > tick Customer only > OK',
      steps:['Asha appears twice, with different cities.','Only the first row per customer is kept.'], result:'Asha keeps Pune and the Mumbai row is deleted. Think about which row should survive before choosing, and sort first if needed.' },
    { level:'Business case', title:'Near-duplicates caused by spaces and case', scenario:'The same customer was typed as "Asha Rao" and " asha rao ". Remove Duplicates ignores case, but not spaces.', table:withHl({rows:[['Name','Clean name'],['Asha Rao','Asha Rao'],[' asha rao ','asha rao']]},{'A3':'miss'},'Sheet: Contacts'), task:'Clean first, then remove.',
      formula:'Helper: =PROPER(TRIM(A2))\nPaste values, then Data > Remove Duplicates on the clean column', steps:['TRIM removes the stray spaces and PROPER standardises the case.','Now the two rows are identical.'], result:'The duplicate is detected. Without cleaning, Remove Duplicates would keep both rows.' }
  ],
  edge:[
    { t:'It is permanent', d:'Deleted rows can only be recovered with Undo or a backup. Copy the data first.' },
    { t:'Keeps the first occurrence', d:'Sort before removing if the "best" row should survive (for example the latest date at the top).' },
    { t:'Case is ignored, spaces are not', d:'"Asha" and "ASHA" count as duplicates. "Asha" and "Asha " do not.' },
    { t:'Selected columns decide', d:'Two rows are duplicates only if all ticked columns match. Ticking all columns is stricter.' },
    { t:'Alternatives', d:'To only mark duplicates, use conditional formatting or a COUNTIF helper. In Microsoft 365, `UNIQUE` creates a de-duplicated list without touching the source. Power Query has a repeatable Remove Duplicates step.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Flag duplicates without deleting them, so a reviewer can decide.', hint:'COUNTIF with an expanding range.', solution:'=IF(COUNTIF($A$2:A2, A2) > 1, "Duplicate", "")', explain:'The expanding range counts occurrences up to the current row. The first occurrence is blank, and later ones are flagged, mirroring what Remove Duplicates would delete.' },
    { level:'Interview', q:'You removed duplicates and the customer count dropped from 1,000 to 980, but finance expects 970. What do you check?', hint:'Equal-looking values and key choice.', solution:'1. Near-duplicates not removed because of spaces or spelling: TRIM, PROPER, and compare with a fuzzy check.\n2. Whether the right columns were selected as the key.\n3. Different ids for the same customer.\n4. Whether finance counts differently (for example, active customers only).', explain:'The point is to reconcile the definitions as well as the data.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you remove duplicates in Excel?', a:'Select the data, go to Data > Remove Duplicates, tick the columns that define a duplicate, and press OK. Excel keeps the first occurrence and deletes the rest.',
      follow:[ { q:'Is it reversible?', a:'Only with Undo right away, or a backup, so I work on a copy.' } ] },
    { level:'Intermediate', q:'Some duplicates are not removed. Why?', a:'Extra spaces, different spellings, or differing values in one of the ticked columns. I clean with TRIM and consistent case first, and review the key columns.' },
    { level:'Scenario', q:'How do you get a list of unique customers without changing the original data?', a:'In Microsoft 365, =UNIQUE(range). In older versions, copy the data to a new sheet and use Remove Duplicates, or use Power Query so the step repeats on refresh.' }
  ],
  ref:{ headers:['Goal','Tool'], rows:[['Delete repeats once','Data > Remove Duplicates'],['Mark duplicates','Conditional formatting or `COUNTIF`'],['Unique list, source untouched','`UNIQUE` (365)'],['Repeatable cleaning','Power Query']] },
  related:['countif','trim','power-query','unique']
};

/* --- text-to-columns --- */
D('text-to-columns',{ l:'Beginner to Intermediate', t:'Text to Columns splits text at a separator or fixed width. The result is static values, and it can overwrite columns to its right.',
  i:['Imported data often arrives packed into one column: "Asha Rao", "Pune,Maharashtra", a CSV line. Text to Columns spreads the pieces into separate columns in one step.','It is a one-off action. If the source changes, it does not update, and it will overwrite whatever sits to the right unless you set a destination.'], a:'Cutting a ribbon at each knot into separate pieces.',
  h:['Select the column to split.','Choose **Data > Text to Columns**.','Pick Delimited (separator) or Fixed width.','Choose the separator, set column formats, and set the **destination**.'],
  d:[FL(['split at the space'],[{ title:'Full name', rows:[['Full name'],['Asha Rao'],['Kiran Reddy']] },{ title:'Result', rows:[['First','Last'],['Asha','Rao'],['Kiran','Reddy']], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','Keeping leading zeros','Codes like 00123 lose their zeros when split.','Set the column format to Text.','Step 3 > select the column > Column data format: Text',['Without it, Excel converts to a number.'],'The codes keep their zeros.'),
     X('Business case','Fixing dates stored as text','Dates like 15.08.2026 are text.','Use the Date format.','Text to Columns > Delimited (none) > Column data format: Date (DMY)',['Excel converts the text into real dates.'],'The column can now be used in pivots and formulas.')],
  e:[['Overwrites to the right','Set a destination, or insert empty columns first.'],['Static result','It does not update when the source changes. Use formulas for live splitting.'],['Leading zeros and long numbers','Set the format to Text.'],['Several spaces','Tick "Treat consecutive delimiters as one".']],
  p:[P('Medium','Split Pune,Maharashtra into city and state.','Delimiter comma.','Data > Text to Columns > Delimited > Comma > Finish','Set the destination so you do not overwrite neighbours.'),
     P('Interview','When do you prefer formulas or Power Query to Text to Columns?','Think repeatability.','When the data changes or the task repeats: formulas (LEFT, MID, FIND, TEXTSPLIT) or Power Query refresh. Text to Columns is for one-off clean-ups.','Say what you gain: repeatability.')],
  q:[Q('Basic','What is Text to Columns?','A tool that splits text in a column into several columns at a separator or fixed width.',{ f:[['Is the result a formula?','No, it is static.']] }),
     Q('Scenario','Split a monthly export with the same layout each time.','Use Power Query so the steps repeat on refresh.',{ t:'Text to Columns is quick but manual.' })],
  r:RT(['Step','Option'],[['1','Delimited or Fixed width'],['2','Pick the delimiter'],['3','Column formats and destination'],['Formula alternative','`TEXTSPLIT` or `LEFT/MID/FIND`']]), rel:['flash-fill','left','find','power-query'] });

/* --- flash-fill --- */
D('flash-fill',{ l:'Beginner to Intermediate', t:'Flash Fill (Ctrl + E) learns a pattern from your example and fills the rest. Check the result, because it can guess wrongly.',
  i:['You type what you want in the first cell, and Excel tries to see the pattern: first names from full names, initials, reformatted phone numbers.','It writes static values and sometimes misreads the pattern, so a quick review of the result is part of the job.'], a:'A colleague who sees what you are doing and offers to finish the job.',
  h:['Type the desired result for the first row next to your data.','Start the second row, or press **Ctrl + E**.','Excel fills the column from the pattern.','Check the preview and the odd rows.'],
  d:[FL(['example, then Ctrl+E'],[{ title:'Type one example', rows:[['Full name','First'],['Asha Rao','Asha'],['Kiran Reddy',''],['Meera Nair','']] },{ title:'Result', rows:[['Full name','First'],['Asha Rao','Asha'],['Kiran Reddy','Kiran'],['Meera Nair','Meera']], hl:{2:'hit',3:'hit'} }])],
  x:[X('Variation','Reformatting numbers','Show 9876543210 as 98765-43210.','Type one example.','Type 98765-43210, then Ctrl + E',['Excel sees the hyphen after the fifth digit.'],'The other numbers are formatted the same way.'),
     X('Business case','When it guesses wrong','A list has names with middle names, and Flash Fill returns the wrong part for some.','Give another example.','Type a second, tricky example, then Ctrl + E again',['More examples teach the pattern better.','If it stays unreliable, use formulas.'],'Check the unusual rows before using the results.')],
  e:[['Static values','Results do not update when the source changes.'],['Pattern guessing','Always spot-check odd rows.'],['Needs adjacent data','The example must sit next to the source column.'],['Switched off?','File > Options > Advanced > Automatically Flash Fill.']],
  p:[P('Medium','Extract the domain from emails with Flash Fill.','Type one example.','Type example.com next to the first email, then Ctrl + E.','Then verify a few rows.'),
     P('Interview','Flash Fill versus formulas: when each?','Think update and reliability.','Flash Fill for quick one-off cleaning. Formulas or Power Query when data changes or accuracy is critical.','Match the tool to repeatability.')],
  q:[Q('Basic','What is Flash Fill?','A feature that fills a column by recognising a pattern from an example. The shortcut is Ctrl + E.',{ f:[['From which version?','Excel 2013.']] }),
     Q('Scenario','A manager wants initials from 5,000 names.','Flash Fill with a couple of examples, then spot-check; use a formula if exact rules are needed.',{ t:'Flash Fill is fast but not guaranteed.' })],
  r:RT(['Need','How'],[['Fill by example','`Ctrl + E`'],['Live version','Formulas'],['Repeatable','Power Query'],['Check','Spot-check unusual rows']]), rel:['text-to-columns','left','find','power-query'] });

/* --- find-replace --- */
D('find-replace',{ l:'Beginner', t:'Find and Replace changes text in bulk. Use "Match entire cell contents" so only exact cells change.',
  i:['Fixing a misspelling or an abbreviation in 5,000 cells by hand is impossible. Replace does it in one step.','The danger is replacing inside longer text: changing "Hyd" to "Hyderabad" also changes cells that already say Hyderabad.'], a:'A word processor\'s replace-all, with a safety switch for whole words.',
  h:['Press **Ctrl + H**.','Type the text to find and the replacement.','Open Options: tick **Match entire cell contents** if you need exact cells only.','Use **Find All** first to preview, then Replace All.'],
  d:[FL(['Hyd -> Hyderabad'],[{ title:'Without whole-cell match', rows:[['City'],['Hyd'],['Hyderabad']] },{ title:'Result', rows:[['City'],['Hyderabad'],['Hyderabaderabad']], hl:{2:'miss'} }])],
  x:[X('Variation','Deleting characters','Remove hyphens from phone numbers.','Leave Replace with empty.','Ctrl + H > Find: - > Replace with: (empty) > Replace All',['The hyphen is replaced by nothing.'],'98765-43210 becomes 9876543210.'),
     X('Business case','Wildcards','Replace everything after "Dept:" with nothing.','Use *.','Find: Dept:* > Replace with: (empty)',['The asterisk matches any text.'],'Always test with Find All first.')],
  e:[['Replacing inside longer text','Tick Match entire cell contents for exact changes.'],['Replace All is hard to undo','Save a copy or use Find All to preview.'],['Search scope','Within sheet or workbook; look in formulas or values.'],['Wildcards','`*` and `?` work; `~` makes them literal.']],
  p:[P('Medium','Replace Hyd with Hyderabad only in cells that equal Hyd.','Whole-cell matching.','Ctrl+H, Options > Match entire cell contents > Replace All.','Hyderabad stays unchanged.'),
     P('Interview','Replace text in the whole workbook but only in formulas.','Options.','Ctrl+H > Options > Within: Workbook, Look in: Formulas.','Naming scope options shows care.')],
  q:[Q('Basic','What are the shortcuts?','Ctrl + F finds, Ctrl + H replaces.',{ f:[['What does Match entire cell contents do?','Changes only cells equal to the search text.']] }),
     Q('Scenario','You must replace across 20 sheets safely.','Use Find All to preview, set Within to Workbook, and work on a copy.',{ t:'Power Query is safer for repeated cleaning.' })],
  r:RT(['Option','Effect'],[['Match case','Case sensitive'],['Match entire cell','Whole-cell only'],['Within','Sheet or workbook'],['Look in','Formulas or values']]), rel:['substitute','trim','power-query','text-to-columns'] });

/* --- data-validation --- */
DEEP['data-validation'] = {
  level:'Beginner to Intermediate',
  tldr:'Data validation controls what can be typed in a cell, so errors are blocked **before** they enter the sheet.',
  intuition:{ text:[
    'Cleaning bad data afterwards is expensive. It is far cheaper to prevent it: a status cell that only accepts Open, Pending or Closed can never contain "opne". Data validation is the bouncer for your cells.',
    'It also makes sheets easier to use, because a drop-down shows the valid choices instead of leaving people to guess.'
  ], analogy:'A form with tick boxes instead of free text.' },
  how:[
    'Select the cells and choose **Data > Data Validation**.',
    'Under **Allow**, pick a rule type: List, Whole number, Decimal, Date, Text length or Custom.',
    'For a list, type the items separated by commas or point to a range.',
    'Add an **Input Message** to guide users and an **Error Alert** to explain mistakes.',
    'Choose the alert style: Stop (blocks), Warning or Information.'
  ],
  diagrams:[
    { type:'flow', arrows:['Allow: List','user picks'], panels:[
      { title:'Rule', text:'Source: Open,Pending,Closed' },
      { title:'Cell shows a drop-down', rows:[['Status'],['Open'],['Pending'],['Closed']] },
      { title:'Invalid entry', text:'"opne" is rejected with an error message' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A dependent drop-down', scenario:'After choosing a region, the city list should show only the cities of that region.', table:withHl({rows:[['Region','City'],['South','Hyderabad'],['West','Pune']]},{'A2':'find','B2':'hit'},'Sheet: Form'), task:'Make the city list depend on the region.',
      formula:'Source for City: =INDIRECT(A2)\n(each region name is a named range of its cities)', steps:['Create a named range for each region, such as South containing its cities.','INDIRECT turns the chosen text into that named range.'], result:'Choosing South lists South cities; choosing West lists West cities. Microsoft 365 users can use FILTER for the same effect.' },
    { level:'Business case', title:'A clean order entry form', scenario:'Sales reps enter orders. Quantity must be a whole number from 1 to 100, the date cannot be in the future, and the product comes from a list.', table:withHl({rows:[['Field','Rule'],['Quantity','Whole number between 1 and 100'],['Order date','Date less than or equal to TODAY()'],['Product','List from the products sheet']]},{},'Validation rules'),
      task:'Apply three rules.', formula:'Quantity: Whole number, between 1 and 100\nOrder date: Date, less than or equal to =TODAY()\nProduct: List, =Products!$A$2:$A$100', steps:['Each cell range gets its own rule.','Error messages explain the allowed values.'], result:'Typing 0, 500 or a future date is blocked, so the data stays clean from the first row.' }
  ],
  edge:[
    { t:'Pasting bypasses validation', d:'Pasted values skip the rules. Use Data > Data Validation > **Circle Invalid Data** to find cells that break the rules.' },
    { t:'List source as a range', d:'A list that points to a range updates when the range changes. A typed list does not. Use a Table column or named range for lists that grow.' },
    { t:'Spaces in typed lists', d:'`Open, Pending` with a space after the comma creates items with leading spaces. Type them without spaces.' },
    { t:'Error alert styles', d:'Stop blocks the entry. Warning and Information allow it. Use Stop for strict rules.' },
    { t:'Hidden characters', d:'Validation does not clean existing data. Existing invalid values stay until you change them.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Restrict a column to dates in 2026 only.', hint:'Choose Date, between two dates.', solution:'Data Validation > Allow: Date > Data: between > Start: 01-Jan-2026 > End: 31-Dec-2026', explain:'Any other date is rejected with the Stop alert.' },
    { level:'Interview', q:'How do you create a drop-down list that automatically includes new items added to the list?', hint:'The source should grow.', solution:'Put the list in an Excel Table (Ctrl+T) and use the table column as the source, for example =INDIRECT("tblStatus[Status]").\nIn Microsoft 365, use a dynamic array source such as =Lists!$A$2# (a spilled range).', explain:'A source that expands means no one has to edit the validation rule when new items are added.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is data validation and why use it?', a:'Data validation restricts what can be entered in a cell, for example a list of allowed values, or numbers between limits. It prevents errors at entry, which is cheaper than cleaning data later.',
      follow:[ { q:'What are the three alert styles?', a:'Stop blocks the entry, Warning lets the user choose, and Information only notifies.' } ] },
    { level:'Intermediate', q:'How can a user bypass validation, and how do you find invalid data?', a:'By pasting values, which skips the rules. I use Circle Invalid Data to find cells that break the rules, and I protect the sheet where necessary.',
      tradeoff:'Strict validation protects quality but can frustrate users if the allowed values are incomplete. Keep lists up to date.' },
    { level:'Scenario', q:'Design validation for a survey form with age, email and country.', a:'Age: whole number from 0 to 120. Country: a list. Email: a custom rule such as =AND(ISNUMBER(FIND("@",A2)),ISNUMBER(FIND(".",A2))). Add input messages so users know what to enter.' }
  ],
  ref:{ headers:['Need','Allow'], rows:[['Drop-down','List'],['Numbers within limits','Whole number or Decimal'],['Dates within a window','Date'],['Limit text size','Text length'],['Any formula','Custom']] },
  related:['conditional-formatting','excel-tables','named-ranges','if']
};

/* --- conditional-formatting --- */
DEEP['conditional-formatting'] = {
  level:'Beginner to Intermediate',
  tldr:'Conditional formatting colours cells automatically from rules. A **formula rule** can colour a whole row based on one cell.',
  intuition:{ text:[
    'A table of numbers is hard to scan. Conditional formatting lets the sheet draw your attention to what matters: overdue tasks in red, top performers in green, small values pale and large values dark.',
    'The formatting is not stored in the cell. It is a rule applied to a range, so it updates by itself whenever the data changes.'
  ], analogy:'A highlighter pen that moves by itself when the data changes.' },
  how:[
    'Select the range to format.',
    'Choose **Home > Conditional Formatting** and pick a rule type: highlight cells, top/bottom, data bars, colour scales, icon sets, or **New Rule > Use a formula**.',
    'For a formula rule, write a test for the **first** cell of the selection.',
    'Lock the column with `$` when the whole row should react to one column.',
    'Choose the format, press OK, and manage priorities in **Manage Rules**.'
  ],
  diagrams:[
    { type:'flow', arrows:['rule =$D2>=10000'], panels:[
      { title:'Applied to A2:D9', rows:[['Order','Region','Category','Sales'],['O-101','North','Electronics',12000],['O-102','South','Furniture',8000],['O-103','North','Furniture',15000],['O-104','East','Electronics',9500]], hl:{1:'hit',3:'hit'}, note:'Whole rows turn green when column D is 10000 or more.' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Whole rows from one column', scenario:'Highlight the entire row when the sales amount is high, not only the amount cell.', table:withHl(SALESLOG,{'A2:D2':'hit','A4:D4':'hit','A6:D6':'hit','A9:D9':'hit'},'Sheet: Sales log'), task:'Create the rule.',
      formula:'Select A2:D9 > New Rule > Use a formula > =$D2>=10000', steps:['The rule is written for the first row of the selection.','`$D` locks the column, so every cell in the row checks column D.','The row number is not locked, so each row checks itself.'], result:'Four whole rows are highlighted.' },
    { level:'Business case', title:'A task tracker with overdue alerts', scenario:'A project sheet should highlight tasks that are past their due date and not done.', table:withHl({rows:[['Task','Due date','Status'],['Report','08-Oct-2026','Open'],['Audit','15-Oct-2026','Open'],['Budget','05-Oct-2026','Done']]},{'A2:C2':'miss'},'Sheet: Tasks (today = 10-Oct-2026)'),
      task:'Colour overdue, unfinished tasks red.', formula:'=AND($B2<TODAY(), $C2<>"Done")', steps:['The date must be earlier than today.','The status must not be Done.','Budget is past due but Done, so it is not highlighted.'], result:'Only Report is highlighted. The rule updates every day without anyone touching it.' }
  ],
  edge:[
    { t:'Write the rule for the first cell', d:'Excel applies the formula relative to the top-left cell of the selected range. Select first, then write the formula for that cell.' },
    { t:'Dollar signs decide the behaviour', d:'`=$D2>=10000` colours rows. `=D2>=10000` colours each cell by its own value in the first column only. Wrong locking gives odd patterns.' },
    { t:'Rule order and conflicts', d:'Rules higher in Manage Rules win when they conflict. Use "Stop If True" to prevent lower rules applying.' },
    { t:'Copy and paste multiplies rules', d:'Copying cells copies their rules, and many small rules slow the workbook. Clean up in Manage Rules.' },
    { t:'Not a value', d:'Colours cannot be used in formulas or sorted by formula. If you need the flag as data, add a helper column with the same test.' },
    { t:'Accessibility', d:'Do not rely on colour alone. Add an icon or a text flag for colour-blind readers.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Highlight rows where Region is North and Sales is above 10000.', hint:'AND two tests, with the columns locked.', solution:'=AND($B2="North", $D2>10000)', explain:'Only rows O-101 (12000) and O-103 (15000) qualify. Both tests are locked to their columns so the entire row is coloured.' },
    { level:'Interview', q:'A conditional format highlights the wrong rows after you copied the formula rule. What do you check?', hint:'Selection and references.', solution:'1. Manage Rules: is "Applies to" the intended range?\n2. Was the formula written for the first cell of that range?\n3. Are the dollar signs correct for rows versus cells?\n4. Are other rules conflicting?', explain:'Most problems come from relative references written for the wrong top-left cell.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is conditional formatting used for?', a:'It formats cells automatically based on rules, such as highlighting values above a threshold, overdue dates, duplicates, or showing data bars and colour scales. It updates whenever the data changes.',
      follow:[ { q:'Name some rule types.', a:'Highlight cell rules, top and bottom rules, data bars, colour scales, icon sets and formula-based rules.' } ] },
    { level:'Intermediate', q:'How do you highlight an entire row based on one column?', a:'Select the full range, choose New Rule with a formula, and write a test for the first row with the column locked, such as =$D2>=10000.',
      tradeoff:'Formula rules are the most flexible, but they are harder to audit than built-in rules.' },
    { level:'Scenario', q:'How would you show overdue items in red and items due within 3 days in amber?', a:'Two formula rules on the range: overdue =AND($B2<TODAY(),$C2<>"Done") in red, and due soon =AND($B2>=TODAY(),$B2<=TODAY()+3,$C2<>"Done") in amber, with the overdue rule first in priority.' }
  ],
  ref:{ headers:['Goal','Rule'], rows:[['Highlight big numbers','Highlight Cells > Greater Than'],['Whole row from one column','`=$D2>=10000`'],['Duplicates','Highlight Cells > Duplicate Values'],['Overdue dates','`=$B2<TODAY()`'],['Visual scale','Data Bars or Color Scales']] },
  related:['data-validation','if','today','pivot-basics']
};
})();
