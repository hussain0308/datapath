/* Datapath | Excel | Tables and names
 * Lessons in this file: excel-tables, named-ranges
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
  const { withHl, T } = DP.builders;
  const { SALESLOG } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- excel-tables --- */
'excel-tables': {
  title:'Excel Tables', tagline:'Turn a range into a smart table that grows and keeps formulas readable.',
  prereq:['sum'],
  what:['An Excel Table is a named, structured range with its own features.','It expands automatically when you add rows.','It lets formulas use column names instead of cell addresses.'],
  why:['Totals, charts and pivots that update when new data is added.','Easier to read formulas and fewer broken ranges.'],
  syntax:{ code:'Insert > Table     (shortcut: Ctrl + T)\n=SUM(tblSales[Sales])', parts:[['tblSales','The table name, set in Table Design > Table Name.'],['[Sales]','A column of the table, used in a structured reference.']] },
  points:['Shortcut: **Ctrl + T**. Tick "My table has headers".','New rows added below are included automatically.','Formulas fill down the whole column (calculated column).','Structured references are written like `tblSales[Sales]`.','Pivot tables and charts based on a table update when the table grows.','Slicers work on tables too.'],
  mistakes:['Leaving blank rows between table rows.','Using the default name Table1 instead of a clear name.','Merged cells in the data, which tables do not allow.'],
  example:{ title:'A total that grows with the data', scenario:'The sales log keeps growing. The total must include new rows automatically.',
    table:withHl(SALESLOG,{'D2:D9':'range'},'Sheet: Sales log (converted to table tblSales)'), task:'Total the Sales column using the table.', formula:'=SUM(tblSales[Sales])',
    steps:['Click inside the data and press Ctrl + T, then name the table tblSales.','The formula refers to the Sales column by name.','When a new row is added, the table expands and the total updates.'], result:'The formula returns 81500 now, and a bigger total after rows are added.' },
  practice:{ q:'Write a formula that counts the North orders using the table column Region.', hint:'Use COUNTIF with the structured reference.', solution:'=COUNTIF(tblSales[Region], "North")', explain:'The table column name replaces B2:B9, and the formula still works when rows are added. The result is 3.' },
  interview:[
    { level:'Basic', q:'What is an Excel Table, and how do you create one?', a:'A named, structured range with automatic expansion and filter buttons. I select the data and press Ctrl + T.' },
    { level:'Intermediate', q:'What are structured references?', a:'Formulas that use table and column names, such as =SUM(tblSales[Sales]), instead of cell addresses. They are easier to read and expand automatically.' },
    { level:'Intermediate', q:'Why base a pivot table or chart on a table?', a:'The source range grows with the table, so the pivot and chart include new rows after a refresh, with no need to change the range.' },
    { level:'Scenario', q:'Your SUM stops including new rows every month. What do you do?', a:'I convert the data to a table, so the formula uses tblSales[Sales]. New rows are then included automatically.' }
  ],
  mcq:[
    { q:'What is the shortcut to create a table?', o:['Ctrl + T','Ctrl + L','Ctrl + E','Ctrl + H'], a:0, why:'Ctrl + T converts the range to a table.' },
    { q:'What happens when you type below a table?', o:['The table expands','Nothing','An error','The table is deleted'], a:0, why:'Tables grow automatically.' },
    { q:'How is a table column referenced in a formula?', o:['tblSales[Sales]','D2:D9 only','tblSales(D)','Sales.D'], a:0, why:'Structured references use the table and column names.' },
    { q:'Do tables allow merged cells?', o:['No','Yes','Only in headers','Only in total rows'], a:0, why:'Merged cells are not allowed inside a table.' },
    { q:'Which benefit helps pivots and charts?', o:['Their source grows with the table','They become faster to type','They hide data','They sort automatically'], a:0, why:'A table-based source expands automatically.' }
  ],
  recap:['Ctrl + T makes a table that expands automatically.','Structured references such as tblSales[Sales] are readable.','Pivots, charts and formulas based on a table stay up to date.']
},

/* --- named-ranges --- */
'named-ranges': {
  title:'Named Ranges', tagline:'Give a cell or range a meaningful name and use it in formulas.',
  prereq:['cell-references'],
  what:['A named range gives a cell or range a name, such as Sales_Amount.','You can use the name in formulas instead of an address.','Names stay the same when the sheet changes.'],
  why:['Formulas become readable: =SUM(Sales_Amount) instead of =SUM(D2:D9).','Fixed inputs such as a tax rate get one clear name.'],
  syntax:{ code:'Formulas > Define Name\nName Box (left of the formula bar)\nCtrl + F3  Name Manager', parts:[['Name','Letters, numbers, underscores and dots. No spaces, and it cannot look like a cell address such as A1.'],['Refers to','The cell or range the name points to.'],['Scope','Workbook (anywhere) or one sheet.']] },
  points:['Quickest way: select the range and type the name in the **Name Box**.','No spaces: use `Sales_Amount`.','Names are absolute references by default.','Use **Name Manager** (Ctrl + F3) to edit or delete names.','Excel Tables give you named columns automatically.'],
  mistakes:['Names with spaces or names that look like cell addresses.','Forgetting that a name still points to the old range after rows are inserted outside it.','Too many unclear names.'],
  example:{ title:'Naming the sales column', scenario:'You use the sales amounts in many formulas.',
    table:withHl(SALESLOG,{'D2:D9':'range'},'Sheet: Sales log'), task:'Name D2:D9 Sales_Amount and total it.', formula:'=SUM(Sales_Amount)',
    steps:['Select D2:D9.','Type Sales_Amount in the Name Box and press Enter.','Use the name in any formula.'], result:'The formula returns 81500.' },
  practice:{ q:'Write a formula that uses the name Sales_Amount to find the average sale.', hint:'Replace the range with the name.', solution:'=AVERAGE(Sales_Amount)', explain:'81500 divided by 8 orders gives 10187.5.' },
  interview:[
    { level:'Basic', q:'What is a named range?', a:'A cell or range given a meaningful name, so formulas can use the name instead of cell addresses.' },
    { level:'Intermediate', q:'What are the naming rules?', a:'No spaces, it must start with a letter or underscore, and it cannot look like a cell address. I use underscores, such as Sales_Amount.' },
    { level:'Intermediate', q:'How do you manage or delete names?', a:'Formulas > Name Manager, or Ctrl + F3, where I can edit what a name refers to or delete it.' },
    { level:'Scenario', q:'A tax rate is used in hundreds of formulas. How do you make it easy to change?', a:'I name the rate cell, for example Tax_Rate, and use it in formulas. Changing the one cell updates every formula, and the names make formulas readable.' }
  ],
  mcq:[
    { q:'Where is the quickest place to create a name?', o:['The Name Box','The status bar','The ribbon title','The sheet tab'], a:0, why:'Select cells and type the name in the Name Box.' },
    { q:'Which name is valid?', o:['Sales_Amount','Sales Amount','A1','2026 Sales'], a:0, why:'No spaces, and it cannot look like a cell address.' },
    { q:'Which shortcut opens Name Manager?', o:['Ctrl + F3','Ctrl + F4','Ctrl + N','Ctrl + M'], a:0, why:'Ctrl + F3 opens it.' },
    { q:'What does `=SUM(Sales_Amount)` do?', o:['Adds the named range','Creates a name','Counts the cells','Sorts the range'], a:0, why:'The name stands for the range.' },
    { q:'What is a benefit of naming a tax rate cell?', o:['One change updates every formula','Formulas run faster','It hides the cell','It becomes text'], a:0, why:'All formulas use the same named cell.' }
  ],
  recap:['A named range replaces cell addresses with readable names.','No spaces; create via the Name Box.','Name Manager edits and deletes names.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- excel-tables --- */
DEEP['excel-tables'] = {
  level:'Beginner to Intermediate',
  tldr:'An Excel Table is a range that **grows by itself**, names its columns, and keeps formulas, pivots and charts up to date.',
  intuition:{ text:[
    'A plain range is just cells. Nothing knows that row 101 belongs to the data above it. A Table is a living object: when you type below it, it expands, formulas fill down, and anything built on it follows.',
    'This one change removes a whole class of errors, such as totals that forget new rows and charts that stop at last month.'
  ], analogy:'A rubber-band around your data that stretches when you add a row.' },
  how:[
    'Click inside the data and press **Ctrl + T**, with "My table has headers" ticked.',
    'Give the table a clear name in **Table Design** (for example tblSales).',
    'Type or paste below the last row. The table expands automatically.',
    'Write formulas with column names, such as `=SUM(tblSales[Sales])`.',
    'Build pivots, charts and validation lists on the table, and they grow with it.'
  ],
  diagrams:[
    { type:'flow', arrows:['new row typed','auto'], panels:[
      { title:'Table before', rows:[['Order','Region','Sales'],['O-101','North',12000],['O-102','South',8000]] },
      { title:'After typing a row below', rows:[['Order','Region','Sales'],['O-101','North',12000],['O-102','South',8000],['O-103','North',15000]], hl:{3:'hit'} },
      { title:'=SUM(tblSales[Sales])', text:'20000 becomes **35000**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A calculated column fills itself', scenario:'You add a column that calculates a 10% discount price. Excel copies the formula to every row, including new ones.', table:withHl({rows:[['Item','Price','Discounted'],['Pen',100,90],['Book',200,180],['Bag',500,450]]},{'C2:C4':'hit'},'Table: tblPrices'), task:'Add the discounted price column.',
      formula:'=[@Price] * 0.9', steps:['`[@Price]` means "the Price of this row".','Excel fills the formula down the whole column.','New rows get the formula automatically.'], result:'The structured reference is readable and cannot point at the wrong row.' },
    { level:'Business case', title:'A dashboard that follows the data', scenario:'A pivot and a chart summarise monthly sales. Each month, 500 new rows are pasted below the data.', table:T({rows:[['Item','Built on']]},'Dependencies'), task:'Make everything update with one click.',
      formula:'Source of the pivot and chart: tblSales\nThen: Data > Refresh All', steps:['The pivot reads tblSales, so new rows are inside its source.','The chart reads the pivot.','Refresh All updates every pivot and query.'], result:'No ranges to resize and no formulas to extend. Last month\'s dashboard becomes this month\'s in one click.' }
  ],
  edge:[
    { t:'No blank rows or merged cells', d:'Tables do not allow merged cells, and blank rows between data break the table apart.' },
    { t:'Structured reference syntax', d:'`tblSales[Sales]` is a whole column. `[@Sales]` is this row. `tblSales[[#Totals],[Sales]]` is the total row.' },
    { t:'Names must be unique', d:'Table names cannot match a named range or contain spaces. Use a prefix such as tbl.' },
    { t:'Converting back', d:'**Convert to Range** removes the table behaviour but keeps the formatting, and structured references turn back into normal ones.' },
    { t:'Data validation lists', d:'A table column does not work directly as a validation source in old versions. Use a named range or INDIRECT with the table column.' },
    { t:'Performance', d:'Tables with tens of thousands of rows and many calculated columns are fine, but volatile functions slow them.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Write a formula that counts the North orders using the table column Region.', hint:'COUNTIF with the structured reference.', solution:'=COUNTIF(tblSales[Region], "North")', explain:'The reference grows with the table. The result is 3 today and increases as North rows are added.' },
    { level:'Interview', q:'Why do analysts convert data to a Table before building a pivot or a lookup?', hint:'Think about what happens when rows are added.', solution:'1. The source range expands automatically, so pivots and charts include new rows after a refresh.\n2. Formulas use readable column names.\n3. Calculated columns fill themselves.\n4. Slicers and banded formatting are built in.', explain:'The main benefit is removing manual range updates, the usual cause of silent reporting errors.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What are Excel Tables and how do you create one?', a:'A Table is a structured, named range that expands automatically and supports structured references. I select the data and press Ctrl + T.',
      follow:[ { q:'What is a structured reference?', a:'A formula reference that uses table and column names, such as =SUM(tblSales[Sales]).' } ] },
    { level:'Intermediate', q:'Your monthly SUM stops including new rows. How do you prevent that?', a:'Convert the data to a Table and use =SUM(tblSales[Sales]). The table grows as I add rows, so the total always covers everything.',
      tradeoff:'Tables are better than whole-column references such as SUM(A:A) because they remain precise and efficient.' },
    { level:'Scenario', q:'How would you design a template that a team fills monthly?', a:'A Table for input with data validation on its columns, calculated columns for derived fields, a pivot and chart on a separate sheet based on the Table, and Refresh All as the final step.' }
  ],
  ref:{ headers:['Syntax','Meaning'], rows:[['`tblSales[Sales]`','Whole column'],['`[@Sales]`','This row\'s value'],['`tblSales[#Headers]`','The header row'],['`tblSales[#Totals]`','The total row'],['`Ctrl + T`','Create a table']] },
  related:['pivot-basics','named-ranges','sum','data-validation']
};

/* --- named-ranges --- */
DEEP['named-ranges'] = {
  level:'Beginner to Intermediate',
  tldr:'A named range gives a cell or range a meaningful name, so formulas read like sentences and fixed inputs live in one place.',
  intuition:{ text:[
    '`=B2*$F$1` tells the reader nothing. `=B2*Tax_Rate` explains itself. Names turn cryptic addresses into labels, which makes formulas easier to read, check and hand over to someone else.',
    'They also centralise inputs. A tax rate named once can be used in hundreds of formulas, and changing the one cell updates them all.'
  ], analogy:'Putting a label on a drawer instead of remembering its position in the cabinet.' },
  how:[
    'Select the cell or range.',
    'Type a name in the **Name Box** (left of the formula bar) and press Enter, or use **Formulas > Define Name**.',
    'Names have no spaces, start with a letter or underscore and cannot look like a cell address.',
    'Use the name in formulas, such as `=SUM(Sales_Amount)`.',
    'Manage names in **Formulas > Name Manager** (Ctrl + F3).'
  ],
  diagrams:[
    { type:'flow', arrows:['name the range'], panels:[
      { title:'Before', text:'=SUM($D$2:$D$9) * $F$1' },
      { title:'After', text:'=SUM(Sales_Amount) * Tax_Rate' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'A named constant', scenario:'The GST rate (18%) is used in many formulas.', table:withHl({rows:[['Name','Refers to'],['GST_Rate','=Inputs!$B$2 (18%)']]},{},'Name Manager'), task:'Use the name in a formula.', formula:'=B2 * GST_Rate', steps:['The name points to one input cell.','Changing the rate in that cell updates every formula that uses the name.'], result:'A price of 500 gives 90. When GST changes, edit the input once.' },
    { level:'Business case', title:'A drop-down list that grows', scenario:'A form has a product drop-down. New products must appear in the list automatically.', table:withHl({rows:[['Setting','Value'],['Name','ProductList'],['Refers to','=tblProducts[Product]']]},{},'Name Manager'), task:'Use the name as the data validation source.', formula:'Data Validation > Allow: List > Source: =ProductList',
      steps:['The name points at a Table column.','A Table grows when rows are added, so the list grows too.'], result:'No one edits the validation rule when products are added.' }
  ],
  edge:[
    { t:'Naming rules', d:'No spaces (use underscores), cannot look like a cell reference (`A1`), cannot start with a number.' },
    { t:'Scope', d:'A name can be workbook-wide or limited to one sheet. Two sheets can each have their own `Total`.' },
    { t:'Names are absolute', d:'A named range does not shift when copied, like an absolute reference.' },
    { t:'Broken names', d:'Deleting the cells a name refers to leaves `#REF!`. Check Name Manager after structural changes.' },
    { t:'Table columns already have names', d:'`tblSales[Sales]` is a built-in structured reference. You do not need a separate name for every column.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Name D2:D9 as Sales_Amount and C2:C9 as Category, then write a SUMIF using the names.', hint:'Use the names inside the formula.', solution:'=SUMIF(Category, "Electronics", Sales_Amount)', explain:'The formula reads like a sentence. The result is 52500.' },
    { level:'Interview', q:'What are the advantages and risks of using named ranges?', hint:'Readability versus hidden complexity.', solution:'Advantages: readable formulas, one place to change inputs, easier validation lists, easier navigation (Name Box).\nRisks: names can hide where data lives, become stale or broken, and too many names make a model hard to audit. Keep names few, clear and documented.', explain:'Balanced answers show judgement rather than a sales pitch.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a named range?', a:'A cell or range given a meaningful name, such as Sales_Amount, which can be used in formulas instead of cell addresses.',
      follow:[ { q:'How do you create one?', a:'Select the cells and type a name in the Name Box, or use Formulas > Define Name.' } ] },
    { level:'Intermediate', q:'Named ranges or Tables?', a:'Tables are better for lists of records because they expand automatically and have structured references. Named ranges suit single inputs (a tax rate) and fixed reference areas. I often combine them: a name pointing at a table column for validation lists.' },
    { level:'Scenario', q:'You inherit a workbook with 200 names, some broken. What do you do?', a:'Open Name Manager, filter for errors, delete names that are unused, repair the ones that are needed, and document the important ones. Then check formulas that use them.' }
  ],
  ref:{ headers:['Task','How'], rows:[['Create','Name Box, or Formulas > Define Name'],['Manage','`Ctrl + F3` (Name Manager)'],['Use in a formula','Type the name, or press F3'],['Rules','No spaces, not a cell address']] },
  related:['cell-references','excel-tables','data-validation','vlookup']
};
})();
