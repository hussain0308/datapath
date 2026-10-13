/* Datapath | Excel | Power Query and macros
 * Lessons in this file: power-query, macros, vba-basics
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
  const { SALESLOG } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- power-query --- */
'power-query': {
  title:'Power Query basics', tagline:'Clean and reshape data with repeatable steps, then refresh with one click.',
  prereq:['excel-tables'],
  what:['Power Query imports data from files, databases and the web.','You clean and reshape it in an editor, and every step is recorded.','When the source changes, **Refresh** repeats all steps automatically.'],
  why:['Monthly reports with the same cleaning every time.','Combining many files, unpivoting and fixing types without formulas.'],
  syntax:{ code:'Data > Get Data > From File / From Table or Range\nData > Refresh All', parts:[['Power Query Editor','The window where you transform data.'],['Applied Steps','The recorded list of transformations, which can be reordered or edited.'],['Close & Load','Sends the cleaned data to a sheet or the data model.']] },
  points:['Common steps: remove duplicates, change data type, split column, trim text, remove blank rows.','**Unpivot Columns** turns columns such as Jan, Feb, Mar into rows.','**Merge Queries** joins two tables like a lookup; **Append Queries** stacks tables.','The steps are recorded in a language called M, but you rarely need to write it.','The source data is never changed.','It is built into Excel 2016 and later (as Get & Transform).'],
  mistakes:['Doing manual clean-up in the sheet instead of using steps.','Changing column names in the source, which breaks the query.','Forgetting to refresh.'],
  example:{ title:'Unpivoting monthly columns', scenario:'A sales file has one column per month. Pivot tables and charts work better with one row per product and month.',
    table:withHl({rows:[['Product','Jan','Feb'],['Pen',100,120],['Book',80,90]]},{'B1:C1':'find'},'Sheet: Monthly file'), task:'Reshape the data so each product-month is a row.', formula:'Data > Get Data > From Table/Range > select Jan and Feb > Transform > Unpivot Columns > Close & Load',
    steps:['Load the table into Power Query.','Select the Product column and choose Unpivot Other Columns (or select the month columns and Unpivot Columns).','Rename the new columns Month and Sales, then Close & Load.'],
    table2:{ rows:[['Product','Month','Sales'],['Pen','Jan',100],['Pen','Feb',120],['Book','Jan',80],['Book','Feb',90]], caption:'Result loaded to a new sheet' }, result:'Next month, a new column is picked up by Refresh without repeating the steps.' },
  practice:{ q:'Name three clean-up steps you would apply in Power Query to a raw export with extra spaces, duplicate rows and text numbers.', hint:'Think about spaces, duplicates and data types.', solution:'Transform > Format > Trim\nHome > Remove Rows > Remove Duplicates\nTransform > Data Type > Whole Number (or Decimal Number)', explain:'Each step is recorded in Applied Steps, so the same cleaning runs again on every refresh.' },
  interview:[
    { level:'Basic', q:'What is Power Query?', a:'A tool in Excel (Get & Transform) for importing, cleaning and reshaping data using recorded steps that can be refreshed.' },
    { level:'Intermediate', q:'Why use Power Query instead of formulas for cleaning?', a:'The steps are recorded and repeatable. When new data arrives, I refresh and the same cleaning runs again, without copying formulas or fixing ranges.' },
    { level:'Intermediate', q:'What does Unpivot do?', a:'It turns columns, such as one per month, into rows with an attribute column and a value column. This format works better for pivot tables and charts.' },
    { level:'Scenario', q:'You receive 12 monthly CSV files with the same layout. How do you combine them?', a:'I use Get Data > From Folder and combine the files in Power Query. New files added to the folder are included on refresh.' }
  ],
  mcq:[
    { q:'What happens when you click Refresh All?', o:['The recorded steps run again on the source','The source is deleted','The sheet is sorted','Macros run'], a:0, why:'Power Query repeats the applied steps on the latest data.' },
    { q:'What does Unpivot Columns do?', o:['Turns columns into rows','Turns rows into columns','Deletes columns','Sorts columns'], a:0, why:'It converts a wide table into a long one.' },
    { q:'Is the source data changed by Power Query?', o:['No','Yes','Only text','Only numbers'], a:0, why:'The source stays untouched.' },
    { q:'What is Merge Queries similar to?', o:['A lookup join of two tables','A sort','A filter','A chart'], a:0, why:'It matches rows by a key column.' },
    { q:'Where are transformations listed?', o:['Applied Steps','Name Manager','Conditional Formatting','Data Validation'], a:0, why:'Applied Steps lists every recorded step.' }
  ],
  recap:['Power Query records cleaning steps and repeats them on refresh.','Unpivot, merge and append reshape and combine data.','The source data is never changed.']
},

/* --- macros --- */
'macros': {
  title:'Macros: record and run', tagline:'Record your clicks once and replay them with one command.',
  prereq:[],
  what:['A macro is a recorded set of actions that Excel can replay.','You do not need to write code to record one.','Macros save time on repeated formatting and clean-up tasks.'],
  why:['Format a weekly report in one click.','Remove repeated manual steps and mistakes.'],
  syntax:{ code:'View > Macros > Record Macro\nDeveloper > Record Macro\nAlt + F8  Run a macro\nAlt + F11 Open the VBA editor', parts:[['Macro name','No spaces, such as FormatReport.'],['Shortcut key','Optional, such as Ctrl + Shift + F.'],['Store macro in','This Workbook, or Personal Macro Workbook to use it everywhere.']] },
  points:['Save the file as **.xlsm** (macro-enabled), or the macro is lost.','The recorder copies every step, including selections.','**Use Relative References** makes a macro work from the current cell instead of fixed cells.','Only enable macros in files from sources you trust: macros can run harmful code.','Edit or view the recorded code in the VBA editor (Alt + F11).','Macros cannot be undone with Ctrl + Z, so test on a copy.'],
  mistakes:['Saving as .xlsx and losing the macro.','Recording unnecessary clicks.','Running macros from unknown files.'],
  example:{ title:'Formatting a report in one click', scenario:'Every week you make the header bold, fill it with a colour and apply a filter to the sales log.',
    table:withHl(SALESLOG,{'A1:D1':'find'},'Sheet: Sales log'), task:'Record a macro called FormatReport.', formula:'View > Macros > Record Macro > Name: FormatReport > OK > do the steps > Stop Recording',
    steps:['Start the recorder and name the macro FormatReport.','Select the header row, make it bold, add a fill colour and turn on the filter.','Click Stop Recording, then save the file as .xlsm.'], result:'Next week, Alt + F8 > FormatReport > Run repeats all the steps at once.' },
  practice:{ q:'Which file type must you choose to keep a macro, and which shortcut runs one?', hint:'The file ends with m for macro.', solution:'Save as Excel Macro-Enabled Workbook (.xlsm)\nRun a macro with Alt + F8', explain:'A normal .xlsx file cannot store macros. Alt + F8 lists the macros so you can run one.' },
  interview:[
    { level:'Basic', q:'What is a macro?', a:'A recorded series of actions that Excel can repeat with one command. It is stored as VBA code.' },
    { level:'Intermediate', q:'What file format keeps macros?', a:'Excel Macro-Enabled Workbook, .xlsm. Saving as .xlsx removes the macros.' },
    { level:'Intermediate', q:'What are the security risks of macros?', a:'Macros can run harmful code. I only enable macros in files from trusted sources, and I keep macro security settings on.' },
    { level:'Scenario', q:'A recorded macro only works on the original cells. How do you fix it?', a:'I re-record it with Use Relative References switched on, or edit the VBA code so it works from the active cell instead of fixed addresses.' }
  ],
  mcq:[
    { q:'Which file type stores macros?', o:['.xlsm','.xlsx','.csv','.pdf'], a:0, why:'.xlsm is macro-enabled.' },
    { q:'Which shortcut opens the VBA editor?', o:['Alt + F11','Alt + F8','Ctrl + F11','F4'], a:0, why:'Alt + F11 opens the VBA editor.' },
    { q:'Which shortcut lists macros to run?', o:['Alt + F8','Alt + F11','Ctrl + M','F9'], a:0, why:'Alt + F8 opens the macro list.' },
    { q:'What does Use Relative References do?', o:['Records actions relative to the active cell','Locks cells','Deletes macros','Sorts data'], a:0, why:'The macro works from wherever the cursor is.' },
    { q:'Can Ctrl + Z undo a macro?', o:['No','Yes','Only formatting','Only for text'], a:0, why:'Macro actions generally cannot be undone, so test on a copy.' }
  ],
  recap:['Macros record and replay your actions.','Save as .xlsm; run with Alt + F8.','Enable only trusted macros and test on a copy.']
},

/* --- vba-basics --- */
'vba-basics': {
  title:'VBA basics', tagline:'Read and write short Excel macros in code.',
  prereq:['macros'],
  what:['VBA (Visual Basic for Applications) is the language behind macros.','You write code in the VBA editor to automate Excel.','Even simple code can loop through rows and make decisions.'],
  why:['Do things the recorder cannot, such as loops and conditions.','Automate repeated clean-up and reporting.'],
  syntax:{ code:'Sub MacroName()\n    ...code...\nEnd Sub', parts:[['Sub ... End Sub','A macro. Everything between the two lines runs when the macro runs.'],['Dim','Declares a variable, such as Dim r As Long.'],['For ... Next','Repeats code for each row or item.'],['If ... Then ... End If','Runs code only when a condition is true.']] },
  points:['Open the editor with **Alt + F11**; insert a module and write the code.','`Cells(row, column).Value` reads or writes a cell.','`Range("A1").Value = "Hello"` writes to a named cell.','Use `Dim` to declare variables, and `Option Explicit` to catch typos.','`MsgBox` shows a message.','Stop a macro that runs forever with **Esc** or **Ctrl + Break**.'],
  mistakes:['Not saving the file as .xlsm.','Looping through more rows than needed.','Running untested code on the only copy of the data.'],
  example:{ title:'Highlighting big orders with code', scenario:'You want to colour every sales amount of 10000 or more. The sales are in column D, rows 2 to 9.',
    table:withHl(SALESLOG,{'D2':'hit','D4':'hit','D6':'hit','D9':'hit'},'Sheet: Sales log'), task:'Run this macro.',
    formula:'Sub HighlightBigSales()\n    Dim r As Long\n    For r = 2 To 9\n        If Cells(r, 4).Value >= 10000 Then\n            Cells(r, 4).Interior.Color = RGB(255, 230, 128)\n        End If\n    Next r\nEnd Sub',
    steps:['The loop sets r to each row from 2 to 9.','Cells(r, 4) is column D in that row.','If the value is 10000 or more, the cell is filled with colour.'], result:'D2, D4, D6 and D9 are coloured (12000, 15000, 11000 and 13000).' },
  practice:{ q:'Write one line of VBA that puts the text Done in cell A1.', hint:'Use Range with .Value.', solution:'Range("A1").Value = "Done"', explain:'Range("A1") points to the cell and .Value sets its content. Text goes in double quotes.' },
  interview:[
    { level:'Basic', q:'What is VBA?', a:'Visual Basic for Applications, the programming language of Excel macros. It lets me automate tasks with code.' },
    { level:'Intermediate', q:'What is the difference between recording a macro and writing VBA?', a:'Recording copies my exact actions and cannot use loops or decisions. Writing VBA allows loops, conditions and flexible code, so one macro can handle many cases.' },
    { level:'Intermediate', q:'How do you refer to a cell in VBA?', a:'With Range("A1") or Cells(row, column), for example Cells(2, 4) is D2. Then I use .Value to read or write it.' },
    { level:'Scenario', q:'You must clean 5,000 rows by checking each one. Which VBA structure do you use?', a:'A For loop with an If inside: loop through the rows, test the cell, and change it when the condition is met. For speed, I turn off screen updating while it runs.' }
  ],
  mcq:[
    { q:'Which statements enclose a macro?', o:['Sub and End Sub','Start and Stop','Begin and End','Macro and End Macro'], a:0, why:'A macro is a Sub procedure.' },
    { q:'What does `Cells(2, 4)` refer to?', o:['D2','B4','D4','B2'], a:0, why:'Cells(row, column): row 2, column 4 is D2.' },
    { q:'Which keyword declares a variable?', o:['Dim','Var','Set only','Let'], a:0, why:'Dim declares a variable.' },
    { q:'Which statement repeats code for each row?', o:['For ... Next','If ... Then','Sub','MsgBox'], a:0, why:'For ... Next loops through a range of numbers.' },
    { q:'How do you stop a runaway macro?', o:['Esc or Ctrl + Break','Alt + F4','Ctrl + Z','F5'], a:0, why:'Esc or Ctrl + Break interrupts the code.' }
  ],
  recap:['VBA is the code behind macros: Sub, Dim, For and If.','Cells(row, column).Value reads and writes cells.','Test on a copy and save as .xlsm.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- power-query --- */
DEEP['power-query'] = {
  level:'Intermediate',
  tldr:'Power Query **records** your cleaning steps, then replays them on fresh data when you press Refresh.',
  intuition:{ text:[
    'Cleaning data by hand works once. The next month, you receive a similar file and must repeat the same twenty clicks. Power Query turns those clicks into a recipe. Every step is saved, and when new data arrives, one Refresh runs the whole recipe again.',
    'The source file is never changed. Power Query reads it, transforms a copy, and loads the result into a sheet or the data model.'
  ], analogy:'A cooking recipe: write it once, and cook the same dish every time with new ingredients.' },
  how:[
    'Choose **Data > Get Data** and pick a source: file, folder, database, web or a table in the workbook.',
    'The **Power Query Editor** opens with a preview of the data.',
    'Apply transformations: remove columns, change types, split, trim, filter, unpivot, merge.',
    'Each action is added to **Applied Steps**, which you can edit, reorder or delete.',
    'Choose **Close & Load** to send the result to a sheet.',
    'Next time, use **Refresh All** and every step runs on the latest data.'
  ],
  diagrams:[
    { type:'flow', arrows:['recorded steps','Close & Load'], panels:[
      { title:'Source (never changed)', text:'Monthly sales.csv\nwith blanks, spaces and text numbers' },
      { title:'Power Query steps', text:'1 Remove blank rows\n2 Trim text\n3 Change type\n4 Unpivot months' },
      { title:'Clean table in Excel', text:'Refresh updates it from the new file' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Merging two tables (a lookup without formulas)', scenario:'Orders have a customer id, and the region sits in a customer table. Instead of VLOOKUP, you merge the queries.', table:withHl({rows:[['OrderID','CustID'],['S-1','C-02'],['S-2','C-01']]},{'B2:B3':'find'},'Query: Orders'),
      task:'Add the Region column from Customers.', formula:'Home > Merge Queries > Orders and Customers > match CustID > Left Outer > expand Region', steps:['Choose the matching columns in both tables.','Left Outer keeps every order, like a LEFT JOIN.','Expand the Region column into the result.'], table2:{ rows:[['OrderID','CustID','Region'],['S-1','C-02','Delhi'],['S-2','C-01','Pune']], caption:'Result' }, result:'The merge is refreshable and handles hundreds of thousands of rows better than VLOOKUP.' },
    { level:'Business case', title:'Combining twelve monthly files', scenario:'Finance receives one CSV per month with the same layout, and wants one table for the year.', table:T({rows:[['File','Rows'],['2026-01.csv',1200],['2026-02.csv',1350],['2026-03.csv',1100]]},'Folder of files'),
      task:'Combine all files, and include next month\'s file automatically.', formula:'Data > Get Data > From File > From Folder > Combine & Transform', steps:['Point Power Query at the folder.','Combine & Transform builds one query that appends every file.','Add cleaning steps once, then Close & Load.'], result:'When 2026-04.csv is added to the folder, Refresh includes it. No formulas to copy, no manual pasting.' }
  ],
  edge:[
    { t:'Renamed columns break steps', d:'A step that refers to a column by name fails if the source renames it. Keep the source layout stable, or review the failing step.' },
    { t:'Data types matter', d:'Set types early. A column typed as text will not sort or sum as numbers, and Power Query can show errors in rows that do not fit.' },
    { t:'Load destination', d:'Load to a Table for use in formulas, or to the Data Model for PivotTables with millions of rows.' },
    { t:'Refresh is manual unless set', d:'Use Data > Refresh All, or set the query to refresh when the file opens.' },
    { t:'Privacy levels and credentials', d:'Combining sources can prompt about privacy levels. Set them deliberately.' },
    { t:'Not a formula engine', d:'Power Query transforms data before it reaches the sheet. Results do not update live as you type, only on refresh.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List the steps to clean a CSV that has leading spaces, blank rows and numbers stored as text.', hint:'Think trim, remove, change type.', solution:'1. Transform > Format > Trim (for text columns)\n2. Home > Remove Rows > Remove Blank Rows\n3. Transform > Data Type > Decimal Number (for amount columns)\n4. Close & Load', explain:'The steps are saved in Applied Steps and run again on every refresh.' },
    { level:'Interview', q:'Compare Power Query with VBA macros for cleaning data. When do you choose each?', hint:'Think maintainability and how each is built.', solution:'Power Query: visual, recorded as steps, safe to refresh, handles large data, easy for others to read. Choose it for repeatable cleaning and combining files.\nVBA: code you write, flexible for custom logic and automating Excel itself (formatting, buttons, emails). Choose it when you must control the Excel interface.', explain:'A balanced answer shows you pick tools by the job. For data preparation, Power Query is usually the first choice.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is Power Query and why use it?', a:'Power Query (Get & Transform) imports data from many sources and lets you clean and reshape it using recorded steps. When new data arrives, I refresh and the same steps run again, which makes the process repeatable and less error prone than manual work.',
      structure:'Define, then the main benefit (repeatability), then an example such as combining monthly files.',
      follow:[ { q:'Does it change the source data?', a:'No. It reads the source and loads a transformed copy.' } ] },
    { level:'Intermediate', q:'What is the difference between Merge Queries and Append Queries?', a:'Merge adds columns by matching a key, like a JOIN or VLOOKUP. Append stacks rows from tables with the same columns, like UNION ALL.' },
    { level:'Scenario', q:'Your monthly report takes two hours of manual cleaning. How would you automate it?', a:'I would load the file in Power Query, record the cleaning steps, parameterise the file path or use a folder source, load to a Table, and connect pivots and charts to it. Next month it is a Refresh All.',
      tradeoff:'Setup takes time once, but pays off monthly and reduces human error.' }
  ],
  ref:{ headers:['Task','Power Query step'], rows:[['Remove duplicates','Home > Remove Rows > Remove Duplicates'],['Split a column','Transform > Split Column'],['Columns to rows','Transform > Unpivot Columns'],['Join tables','Home > Merge Queries'],['Stack tables','Home > Append Queries'],['Refresh','Data > Refresh All']] },
  related:['excel-tables','remove-duplicates','text-to-columns','macros']
};

/* --- macros --- */
D('macros',{ l:'Beginner to Intermediate', t:'A macro records your clicks and replays them. Save the file as .xlsm, enable macros only from trusted sources, and test on a copy.',
  i:['If you repeat the same formatting steps every week, a macro can do them in one click. You do not need to write code: Excel records what you do and converts it into VBA.','Macros can also run harmful code, so they are only enabled from trusted files, and they cannot be undone with Ctrl+Z.'], a:'Recording yourself doing a task, then playing the recording back.',
  h:['Enable the Developer tab, or use **View > Macros > Record Macro**.','Name it (no spaces) and choose where to store it.','Perform the steps, then **Stop Recording**.','Run it with **Alt + F8**, and save as **.xlsm**.'],
  d:[FL(['record','replay'],[{ title:'Steps', text:'bold header\nfill colour\nturn on filter' },{ title:'FormatReport macro', text:'saved in the .xlsm file' },{ title:'Alt + F8', text:'one click formatting' }])],
  x:[X('Variation','Relative references','The macro must work from the active cell, not fixed cells.','Switch on Use Relative References.','View > Macros > Use Relative References, then record',['Actions are recorded relative to the starting cell.'],'The macro formats whichever block you select.'),
     X('Business case','A weekly formatting macro','Every Monday the exported report needs the same formatting.','Record once and assign a button.','Record FormatReport > Insert > Shapes > Assign Macro',['The button runs the macro.'],'Report cleanup takes seconds, and is consistent.')],
  e:[['.xlsx loses macros','Save as .xlsm.'],['Security','Only enable macros from trusted sources.'],['No undo','Macro actions are generally not undoable. Test on a copy.'],['Recorded code is verbose','You can clean it in the VBA editor (Alt + F11).']],
  p:[P('Medium','Record a macro that bolds row 1 and applies a filter.','Record steps.','Record Macro > bold row 1 > Ctrl+Shift+L > Stop','Run with Alt + F8.'),
     P('Interview','Your macro stopped working after you saved the file. Why?','File type.','The file was saved as .xlsx, which drops macros. Save as Excel Macro-Enabled Workbook (.xlsm).','A classic beginner problem.')],
  q:[Q('Basic','What is a macro?','A recorded set of actions stored as VBA code that Excel can replay.',{ f:[['Which file type keeps macros?','.xlsm.']] }),
     Q('Scenario','A colleague sends a file with macros. What do you do?','Check the source, review the code, keep macro security on, and enable only if trusted.',{ t:'Malicious macros are a real attack route.' })],
  r:RT(['Shortcut','Action'],[['`Alt + F8`','Run a macro'],['`Alt + F11`','VBA editor'],['File type','.xlsm'],['Safety','Test on a copy']]), rel:['vba-basics','power-query','remove-duplicates','dashboard'] });

/* --- vba-basics --- */
D('vba-basics',{ l:'Intermediate', t:'VBA is the code behind macros: Sub, Dim, For and If. It lets you write loops and decisions that the recorder cannot.',
  i:['A recorded macro repeats your exact steps. VBA lets you write logic: loop through every row, test a condition, change only the rows that qualify.','You do not need to learn the whole language: cells, loops, conditions and a message box cover most automation.'], a:'Writing the recipe yourself instead of filming someone cooking.',
  h:['Press **Alt + F11**, insert a module.','Write `Sub Name()` ... `End Sub`.','Use `Cells(row, column).Value` to read or write cells.','Use `For ... Next` to loop and `If ... Then` to decide.'],
  d:[FL(['loop, test, change'],[{ title:'For r = 2 To 9', text:'each row' },{ title:'If sales >= 10000', text:'test' },{ title:'colour the cell', text:'action' }])],
  x:[X('Variation','Writing a value','Put the text Done in A1.','Use Range.','Range("A1").Value = "Done"',['Range points at the cell, .Value sets the content.'],'A1 now contains Done.'),
     X('Business case','Highlight big sales with a loop','Colour every sales amount of 10000 or more in D2:D9.','Loop and test.','Dim r As Long\nFor r = 2 To 9\n  If Cells(r, 4).Value >= 10000 Then Cells(r, 4).Interior.Color = RGB(255, 230, 128)\nNext r',['The loop visits each row.','The If keeps only large values.'],'Four cells are coloured. Conditional formatting does this live; VBA does it on demand.')],
  e:[['Test on a copy','Macros usually cannot be undone.'],['Declare variables','Use Dim and Option Explicit to catch typos.'],['Loop only what you need','Looping 1,000,000 rows is slow; find the last row first.'],['Screen updating','Set Application.ScreenUpdating = False for speed.']],
  p:[P('Medium','Write a macro that shows a message box with the text Hello.','MsgBox.','Sub Hello()\n  MsgBox "Hello"\nEnd Sub','Run it with Alt + F8.'),
     P('Interview','When would you choose VBA over Power Query?','Think of the job.','VBA for controlling Excel itself (formatting, buttons, workbooks). Power Query for repeatable data cleaning and combining files.','Pick the tool by the task.')],
  q:[Q('Basic','What is VBA?','Visual Basic for Applications, the language of Excel macros.',{ f:[['How do you open the editor?','Alt + F11.']] }),
     Q('Scenario','Automate a repeated clean-up with decisions per row.','Write a VBA loop with an If, test on a copy, and save as .xlsm. Consider Power Query for data steps.',{ t:'VBA is flexible but needs maintenance.' })],
  r:RT(['Keyword','Use'],[['`Sub ... End Sub`','A macro'],['`Dim`','Declare a variable'],['`For ... Next`','Loop'],['`If ... Then`','Decide']]), rel:['macros','power-query','conditional-formatting','data-validation'] });
})();
