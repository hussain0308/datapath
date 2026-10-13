/* Datapath | Excel | PivotTables
 * Lessons in this file: pivot-basics, pivot-fields, pivot-grouping, slicers, calculated-field
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
  const { SALESLOG, ORDERS_DT, PROFIT } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- pivot-basics --- */
'pivot-basics': {
  title:'PivotTable basics', tagline:'Summarise thousands of rows in seconds without writing formulas.',
  prereq:['excel-tables'],
  what:['A PivotTable summarises data by groups, such as total sales per region.','You build it by dragging fields, with no formulas.','It does not change the source data.'],
  why:['The fastest way to answer "how much by what" questions.','The foundation of most MIS reports and dashboards.'],
  syntax:{ code:'Insert > PivotTable > choose the data > OK', parts:[['Rows','Fields whose values become row labels, such as Region.'],['Values','The numbers to summarise, such as Sum of Sales.'],['Filters / Columns','Extra ways to slice or spread the data.']] },
  points:['The data needs **headers** and no blank rows or columns.','Drag a text field to **Rows** and a number field to **Values**.','Values default to Sum for numbers and Count for text; change it in **Value Field Settings**.','**Refresh** (right-click > Refresh) after the source data changes.','Use a **Table** as the source so new rows are included.','Double-click a value to see the rows behind it.'],
  mistakes:['Blank rows or missing headers in the source.','Forgetting to refresh.','Text numbers being counted instead of summed.'],
  example:{ title:'Sales by region', scenario:'You need the total sales for each region from the sales log.',
    table:withHl(SALESLOG,{'B1':'find','D1':'find'},'Sheet: Sales log'), task:'Build a PivotTable of total sales by region.', formula:'Insert > PivotTable > Rows: Region > Values: Sales (Sum)',
    steps:['Click inside the data and choose Insert > PivotTable.','Drag Region to Rows.','Drag Sales to Values, where it becomes Sum of Sales.'],
    table2:{ rows:[['Row Labels','Sum of Sales'],['East',15500],['North',34000],['South',32000],['Grand Total',81500]], caption:'PivotTable result (regions sorted A to Z)' }, result:'North 34000, South 32000, East 15500, with a grand total of 81500.' },
  practice:{ q:'How do you change the pivot to show the number of orders per region instead of the total sales?', hint:'Change how the Values field is summarised.', solution:'Click Sum of Sales > Value Field Settings > Count > OK', explain:'Count gives East 2, North 3 and South 3, a total of 8 orders.' },
  interview:[
    { level:'Basic', q:'What is a PivotTable?', a:'A tool that summarises data by groups, such as total sales per region, using drag and drop, without formulas.' },
    { level:'Intermediate', q:'What do you do when the source data changes?', a:'I refresh the pivot (right-click > Refresh or Data > Refresh All). If the source is a Table, new rows are included automatically.' },
    { level:'Intermediate', q:'Why might a pivot count instead of summing a numeric column?', a:'Some values are stored as text, or the column has blanks, so Excel defaults to Count. I fix the data types and set the field to Sum.' },
    { level:'Scenario', q:'How do you see the rows behind a pivot value?', a:'Double-click the value, and Excel creates a new sheet with the underlying rows.' }
  ],
  mcq:[
    { q:'What does the Values area contain?', o:['The numbers to summarise','The labels down the side','The slicers','The filters only'], a:0, why:'Values holds fields such as Sum of Sales.' },
    { q:'What must you do after changing the source data?', o:['Refresh the pivot','Delete the pivot','Sort the pivot','Merge cells'], a:0, why:'The pivot does not update until it is refreshed.' },
    { q:'What does the source data need?', o:['Headers and no blank rows or columns','Merged cells','Only text','A chart'], a:0, why:'Clean, headed data builds a reliable pivot.' },
    { q:'How do you change Sum to Average?', o:['Value Field Settings','Sort','Filter','Format Cells'], a:0, why:'Value Field Settings changes the calculation.' },
    { q:'What happens when you double-click a value?', o:['The rows behind it appear on a new sheet','The pivot is deleted','The value doubles','A chart appears'], a:0, why:'This drill-down shows the detail rows.' }
  ],
  recap:['A PivotTable summarises data by groups with drag and drop.','Source data needs headers and no blank rows; use a Table.','Refresh after the data changes.']
},

/* --- pivot-fields --- */
'pivot-fields': {
  title:'Rows, Columns, Values and Filters', tagline:'Use the four pivot areas to slice the same data in different ways.',
  prereq:['pivot-basics'],
  what:['**Rows** run down the left side.','**Columns** run across the top.','**Values** hold the numbers being summarised.','**Filters** limit the whole pivot to a chosen item.'],
  why:['Cross-tabs such as region by category answer comparison questions.','One data set gives many different reports by moving fields.'],
  syntax:{ code:'PivotTable Fields pane\nRows | Columns | Values | Filters', parts:[['Rows','Items listed down the side.'],['Columns','Items listed across the top.'],['Values','The numbers to calculate.'],['Filters','A drop-down that filters the entire pivot.']] },
  points:['Put one field in Rows and another in Columns for a **cross-tab**.','Dragging a field to a new area updates the pivot immediately.','**Show Values As** displays values as a percentage of the total, row or column.','Several fields in Rows create a hierarchy.','The same field can appear in Values twice, with different calculations.','Grand totals can be switched off in Design.'],
  mistakes:['Putting too many fields in Rows and getting an unreadable report.','Using Filters when Slicers would be easier to use.','Forgetting Show Values As when percentages are needed.'],
  example:{ title:'Region by category', scenario:'You want sales for each region split by category.',
    table:withHl(SALESLOG,{'B1':'find','C1':'find','D1':'find'},'Sheet: Sales log'), task:'Build a cross-tab of Sum of Sales.', formula:'Rows: Region   Columns: Category   Values: Sum of Sales',
    steps:['Drag Region to Rows.','Drag Category to Columns.','Drag Sales to Values.'],
    table2:{ rows:[['Sum of Sales','Electronics','Furniture','Grand Total'],['East',9500,6000,15500],['North',19000,15000,34000],['South',24000,8000,32000],['Grand Total',52500,29000,81500]], caption:'PivotTable result' }, result:'North sold 19000 in Electronics and 15000 in Furniture.' },
  practice:{ q:'How would you show each region\'s share of total sales as a percentage?', hint:'Right-click a value and use Show Values As.', solution:'Right-click a value > Show Values As > % of Grand Total', explain:'North becomes about 41.7%, South 39.3% and East 19.0%.' },
  interview:[
    { level:'Basic', q:'What are the four areas of a PivotTable?', a:'Rows, Columns, Values and Filters. Rows and Columns set the layout, Values holds the numbers and Filters limits the whole pivot.' },
    { level:'Intermediate', q:'How do you show percentages in a pivot?', a:'Right-click a value, choose Show Values As, and pick for example % of Grand Total or % of Row Total.' },
    { level:'Intermediate', q:'What is the difference between Filters and Slicers?', a:'Filters are drop-downs in a fixed place. Slicers are buttons that are easier to see and use, and can control several pivots.' },
    { level:'Scenario', q:'A pivot with five fields in Rows is unreadable. What would you do?', a:'I reduce the fields in Rows, move a field to Columns or Filters, and use Compact or Tabular layout. A good pivot answers one question clearly.' }
  ],
  mcq:[
    { q:'Which area spreads items across the top?', o:['Columns','Rows','Values','Filters'], a:0, why:'Columns run horizontally.' },
    { q:'What does Show Values As > % of Grand Total do?', o:['Shows each value as a share of the total','Deletes values','Sorts values','Adds a chart'], a:0, why:'It converts values to percentages.' },
    { q:'What is a cross-tab?', o:['Fields in both Rows and Columns','A chart','A filter','A macro'], a:0, why:'Row and column fields form a grid.' },
    { q:'Which area limits the whole pivot to one item?', o:['Filters','Values','Columns','Rows'], a:0, why:'The filter field applies to the entire pivot.' },
    { q:'Can a field be used twice in Values?', o:['Yes, with different calculations','No','Only numbers','Only text'], a:0, why:'For example, Sum and % of total of the same field.' }
  ],
  recap:['Rows, Columns, Values and Filters shape every pivot.','A field in Rows and another in Columns makes a cross-tab.','Show Values As gives percentages.']
},

/* --- pivot-grouping --- */
'pivot-grouping': {
  title:'Grouping in PivotTables', tagline:'Group dates into months, quarters and years, or numbers into ranges.',
  prereq:['pivot-basics'],
  what:['Grouping combines items in a pivot into larger buckets.','Dates can be grouped by days, months, quarters and years.','Numbers can be grouped into ranges, such as 0 to 5000.'],
  why:['Monthly and quarterly sales trends from daily data.','Age bands or price bands in a report.'],
  syntax:{ code:'Right-click a date or number in the pivot > Group', parts:[['By','For dates: Days, Months, Quarters, Years.'],['Starting at / Ending at / By','For numbers: the range start, end and bucket size.']] },
  points:['Dates must be **real dates**, not text, and with no blanks.','Select several options, such as Years and Months, to avoid mixing years.','Excel 2016 and later often groups dates automatically.','Select **Ungroup** to remove the grouping.','If Excel says "Cannot group that selection", check for text or blank cells in the field.'],
  mistakes:['Grouping by months only when the data spans several years.','Dates stored as text.','Blank cells in the date column.'],
  example:{ title:'Monthly totals from daily orders', scenario:'Orders have exact dates, and you need monthly totals.',
    table:withHl(ORDERS_DT,{'B2:B6':'range'},'Sheet: Orders'), task:'Group the dates by month.', formula:'Rows: Date   Values: Sum of Sales   Right-click a date > Group > Months',
    steps:['Build a pivot with Date in Rows and Sales in Values.','Right-click a date and choose Group.','Select Months (and Years if the data spans years) and press OK.'],
    table2:{ rows:[['Row Labels','Sum of Sales'],['Jan',2000],['Feb',2200],['Mar',900],['Grand Total',5100]], caption:'PivotTable result' }, result:'Jan 2000, Feb 2200 and Mar 900, a total of 5100.' },
  practice:{ q:'The error "Cannot group that selection" appears. What do you check?', hint:'Think about what is in the date column.', solution:'Check for text values and blank cells in the date column, convert them to real dates, refresh, and group again.', explain:'Grouping needs every item in the field to be a valid date (or number).' },
  interview:[
    { level:'Basic', q:'How do you group dates in a PivotTable?', a:'I right-click a date in the pivot, choose Group, and select Months, Quarters or Years.' },
    { level:'Intermediate', q:'Why select Years as well as Months?', a:'If the data spans several years, grouping only by months merges January 2025 with January 2026. Selecting both keeps the years apart.' },
    { level:'Intermediate', q:'What does "Cannot group that selection" mean?', a:'The field contains text, errors or blanks. I fix the data so every value is a valid date or number, and refresh the pivot.' },
    { level:'Scenario', q:'How would you create age bands in a pivot?', a:'I put Age in Rows, right-click, choose Group, and set Starting at, Ending at and By, for example 0, 60 and 10.' }
  ],
  mcq:[
    { q:'How do you start grouping?', o:['Right-click > Group','Data > Sort','Insert > Chart','Home > Fill'], a:0, why:'Right-click an item and choose Group.' },
    { q:'Why include Years when grouping by Months?', o:['To avoid mixing the same month of different years','To make it faster','To change the format','To add totals'], a:0, why:'Months from different years would merge.' },
    { q:'What blocks grouping?', o:['Text or blanks in the field','A chart','A filter','Colours'], a:0, why:'The field must hold valid dates or numbers.' },
    { q:'How do you remove grouping?', o:['Ungroup','Delete the pivot','Refresh','Sort'], a:0, why:'Ungroup restores the original items.' },
    { q:'Can numbers be grouped?', o:['Yes, into ranges','No','Only dates','Only text'], a:0, why:'Use Starting at, Ending at and By.' }
  ],
  recap:['Group dates by months, quarters or years and numbers by ranges.','Include Years to keep years apart.','Dates must be real, with no blanks.']
},

/* --- slicers --- */
'slicers': {
  title:'Slicers and Timelines', tagline:'Filter pivots with clickable buttons.',
  prereq:['pivot-fields'],
  what:['A slicer is a set of buttons that filters a PivotTable or Table.','Clicking a button shows only that item.','A Timeline is a slicer for dates.'],
  why:['Dashboards that are easy to use without knowing pivots.','One slicer can control several pivots and charts.'],
  syntax:{ code:'PivotTable Analyze > Insert Slicer\nPivotTable Analyze > Insert Timeline', parts:[['Slicer','Buttons for the items of a field, such as each Region.'],['Timeline','A date bar to choose months, quarters or years.'],['Report Connections','Link one slicer to several pivots.']] },
  points:['Hold **Ctrl** to select several buttons.','The **Clear Filter** icon resets the slicer.','Slicers also work on Excel Tables.','**Report Connections** connects one slicer to many pivots.','Timelines need real date fields.','Slicers show the current selection clearly, unlike filter drop-downs.'],
  mistakes:['Using Filters instead of slicers on dashboards.','Not connecting the slicer to all pivots.','Too many slicers.'],
  example:{ title:'Filtering by region', scenario:'A pivot shows sales by category. You want buttons to switch regions.',
    table:withHl(SALESLOG,{'B1':'find'},'Sheet: Sales log'), task:'Add a Region slicer and select North.', formula:'PivotTable Analyze > Insert Slicer > Region > OK > click North',
    steps:['Click inside the pivot and choose Insert Slicer.','Tick Region and press OK.','Click North on the slicer.'],
    table2:{ rows:[['Row Labels','Sum of Sales'],['Electronics',19000],['Furniture',15000],['Grand Total',34000]], caption:'Pivot after selecting North' }, result:'The pivot shows only North: Electronics 19000 and Furniture 15000.' },
  practice:{ q:'How do you make one slicer control two pivots?', hint:'Look for Report Connections.', solution:'Select the slicer > Slicer tab > Report Connections > tick both PivotTables > OK', explain:'The slicer then filters both pivots at once, which is how dashboards stay consistent.' },
  interview:[
    { level:'Basic', q:'What is a slicer?', a:'A set of buttons that filters a PivotTable or Table. Clicking an item shows only that item.' },
    { level:'Intermediate', q:'How is a slicer different from a Filter field?', a:'A slicer is more visible, shows the current selection clearly, and can control several pivots. A filter is a drop-down controlling one pivot.' },
    { level:'Intermediate', q:'What is a Timeline?', a:'A slicer for dates. It lets me pick months, quarters or years on a bar.' },
    { level:'Scenario', q:'A slicer changes only one of your three pivots. What is wrong?', a:'The other pivots are not connected. I use Report Connections on the slicer and tick all the pivots that should respond.' }
  ],
  mcq:[
    { q:'How do you select several slicer buttons?', o:['Hold Ctrl','Hold Alt','Double-click','Right-click'], a:0, why:'Ctrl allows multiple selections.' },
    { q:'What is a Timeline?', o:['A slicer for dates','A chart','A macro','A formula'], a:0, why:'It filters by date ranges.' },
    { q:'What links a slicer to many pivots?', o:['Report Connections','Data Validation','Name Manager','Sort'], a:0, why:'Report Connections ticks which pivots it controls.' },
    { q:'What does the Clear Filter icon do?', o:['Resets the slicer selection','Deletes the slicer','Sorts items','Closes the file'], a:0, why:'It shows all items again.' },
    { q:'Can slicers be used on Tables?', o:['Yes','No','Only pivots','Only charts'], a:0, why:'Slicers work on Tables too.' }
  ],
  recap:['Slicers are clickable filters; Timelines are for dates.','Ctrl selects several items.','Report Connections links one slicer to several pivots.']
},

/* --- calculated-field --- */
'calculated-field': {
  title:'Calculated Fields', tagline:'Add your own formula-based field to a PivotTable.',
  prereq:['pivot-fields'],
  what:['A calculated field is a new field built from existing fields, such as Profit = Revenue - Cost.','It is calculated on the totals in the pivot.','It appears in the field list like any other field.'],
  why:['Profit, margin or average price without changing the source data.','Keep the calculation inside the pivot.'],
  syntax:{ code:'PivotTable Analyze > Fields, Items & Sets > Calculated Field', parts:[['Name','The name of the new field, such as Profit.'],['Formula','Uses other fields, such as =Revenue-Cost.']] },
  points:['It works on the **sum** of each field, not row by row.','Division, such as `=Profit/Revenue`, is calculated on totals, which is correct for margins.','You cannot use cell references or lookups inside it.','Add the new field to Values like any other field.','Adding a helper column to the source is an alternative for row-level logic.'],
  mistakes:['Expecting row-by-row calculation.','Using cell references.','Forgetting to add the new field to Values.'],
  example:{ title:'Adding a Profit field', scenario:'The data has Revenue and Cost, and you want Profit in the pivot.',
    table:withHl(PROFIT,{'B1':'find','C1':'find'},'Sheet: Products'), task:'Create the calculated field Profit.', formula:'Calculated Field > Name: Profit > Formula: =Revenue-Cost > Add > OK',
    steps:['Click inside the pivot and open Fields, Items & Sets > Calculated Field.','Name it Profit and type =Revenue-Cost.','Add Profit to Values.'],
    table2:{ rows:[['Row Labels','Sum of Revenue','Sum of Cost','Sum of Profit'],['Bag',12000,9000,3000],['Book',8000,5000,3000],['Pen',5000,3000,2000],['Grand Total',25000,17000,8000]], caption:'PivotTable result' }, result:'Total profit is 8000 on 25000 revenue.' },
  practice:{ q:'Write the formula for a calculated field called Margin that gives profit as a share of revenue.', hint:'Divide the difference of two fields by Revenue.', solution:'=(Revenue-Cost)/Revenue', explain:'On the totals, the margin is 8000 divided by 25000, which is 32%. Format the field as a percentage.' },
  interview:[
    { level:'Basic', q:'What is a calculated field?', a:'A new pivot field defined by a formula on existing fields, such as Profit = Revenue - Cost.' },
    { level:'Intermediate', q:'How does it calculate: row by row or on totals?', a:'On the totals of the fields. Sum of Revenue minus Sum of Cost, not each source row separately. That is right for sums and margins, but not for row-level logic.' },
    { level:'Intermediate', q:'What if you need a row-level calculation?', a:'I add a helper column in the source data (or a calculated column in the Table or Power Query) and use it in the pivot.' },
    { level:'Scenario', q:'Your pivot shows profit margin. How do you create it?', a:'A calculated field with =(Revenue-Cost)/Revenue, added to Values and formatted as a percentage.' }
  ],
  mcq:[
    { q:'Where is a calculated field created?', o:['PivotTable Analyze > Fields, Items & Sets','Home > Styles','Data > Sort','Insert > Chart'], a:0, why:'The Calculated Field option is under Fields, Items & Sets.' },
    { q:'On what does a calculated field calculate?', o:['The sums of the fields','Each source row','Cell references','Text only'], a:0, why:'It uses the pivot totals of the fields.' },
    { q:'What is Profit if Revenue is 12000 and Cost is 9000?', o:['3000','21000','9000','0.75'], a:0, why:'12000 minus 9000.' },
    { q:'Can a calculated field use cell references?', o:['No','Yes','Only absolute ones','Only with names'], a:0, why:'It uses field names only.' },
    { q:'What do you do after creating the field?', o:['Add it to Values','Delete the pivot','Sort it','Merge cells'], a:0, why:'It appears in the Values area once added.' }
  ],
  recap:['A calculated field is a formula built from pivot fields.','It works on totals, not row by row.','Use helper columns for row-level logic.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- pivot-basics --- */
DEEP['pivot-basics'] = {
  level:'Beginner to Intermediate',
  tldr:'A PivotTable summarises thousands of rows by dragging fields into **Rows**, **Columns**, **Values** and **Filters**, without writing formulas.',
  intuition:{ text:[
    'A list of transactions is hard to read: thousands of rows, one fact per row. A PivotTable answers questions like "how much per region?" by grouping the rows for you and adding them up, instantly, without changing the original data.',
    'The mental model is a layout board. You drag a field to Rows to list its values down the side, to Columns to spread them across the top, and to Values to summarise it. Dragging a field to another place rebuilds the report in a second.'
  ], analogy:'A pivot is a report builder: the data stays in the warehouse, and you rearrange the display shelves.' },
  how:[
    'Click inside the data (ideally an Excel Table) and choose **Insert > PivotTable**.',
    'Drag a text field, such as Region, into **Rows**.',
    'Drag a number field, such as Sales, into **Values**. It becomes **Sum of Sales**.',
    'Optionally drag a second field to **Columns**, or to **Filters**.',
    'Change the calculation (Sum, Count, Average, % of total) in **Value Field Settings**.',
    'After the data changes, press **Refresh**. The pivot does not update by itself.'
  ],
  diagrams:[
    { type:'flow', arrows:['drag fields','Excel summarises'], panels:[
      { title:'Source data', rows:[['Order','Region','Category','Sales'],['O-101','North','Electronics',12000],['O-102','South','Furniture',8000],['O-103','North','Furniture',15000],['O-104','East','Electronics',9500],['...','...','...','...']] },
      { title:'PivotTable Fields', text:'**Rows:** Region\n**Values:** Sum of Sales' },
      { title:'Pivot result', rows:[['Row Labels','Sum of Sales'],['East',15500],['North',34000],['South',32000],['Grand Total',81500]], hl:{4:'hit'} }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Percent of the grand total', scenario:'Show each region\'s share, next to the amount.', table:withHl(SALESLOG,{'B1':'find','D1':'find'},'Sheet: Sales log'), task:'Add Sales to Values a second time and show it as a percentage.',
      formula:'Drag Sales to Values again > Value Field Settings > Show Values As > % of Grand Total', steps:['The first Sales field stays as Sum.','The second Sales field is set to % of Grand Total.'],
      table2:{ rows:[['Region','Sum of Sales','% of Grand Total'],['East',15500,'19.0%'],['North',34000,'41.7%'],['South',32000,'39.3%'],['Grand Total',81500,'100.0%']], caption:'Pivot result' }, result:'North brings 41.7% of sales.' },
    { level:'Business case', title:'New data arrives: refresh', scenario:'A new order, O-109 (East, Furniture, 2500), is added to the table. The pivot still shows the old numbers until it is refreshed.', table:withHl({rows:[['Order','Region','Category','Sales'],['O-109','East','Furniture',2500]]},{'A2:D2':'hit'},'New row added to the source table'),
      task:'Refresh the pivot.', formula:'Right-click the pivot > Refresh      (or Data > Refresh All)', steps:['Because the source is an Excel Table, the new row is part of the source range.','Refresh re-reads the table and recalculates every group.'],
      table2:{ rows:[['Row Labels','Sum of Sales'],['East',18000],['North',34000],['South',32000],['Grand Total',84000]], caption:'Pivot after refresh' }, result:'East rises from 15500 to 18000, and the grand total from 81500 to 84000.' }
  ],
  edge:[
    { t:'A pivot is a snapshot until refreshed', d:'Changing the source does not change the pivot. Refresh manually, or set "Refresh data when opening the file".' },
    { t:'Source must be clean', d:'Blank header cells, blank rows, merged cells and repeated headers break the pivot or create "(blank)" items.' },
    { t:'Count instead of Sum', d:'If a number column is stored as text, or has blanks, Excel defaults to Count. Fix the data, then set the field to Sum.' },
    { t:'A fixed range misses new rows', d:'If the pivot source is a normal range, rows added below are not included. Use a Table (Ctrl+T) as the source.' },
    { t:'Grand total depends on filters', d:'The grand total is the total of what is currently visible after filters and slicers, not always the whole dataset.' },
    { t:'File size', d:'Every pivot stores a cache of the data. Several pivots on the same data should share one cache, or the file grows quickly.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Build a pivot that shows the number of orders and the average sales per category.', table:withHl(SALESLOG,{},'Sheet: Sales log'), hint:'Add Sales to Values twice and change one to Count and one to Average.', solution:'Rows: Category\nValues: Count of Order, Average of Sales', explain:'Electronics has 5 orders with an average of 10500. Furniture has 3 orders with an average of 9666.67.' },
    { level:'Interview', q:'Your pivot shows "Count of Sales" instead of "Sum of Sales". Why, and how do you fix it?', hint:'Think about what makes Excel treat a numeric-looking column as text.', solution:'Cause: some Sales values are text (or blank), so the whole column is not numeric.\nFix: convert the text to numbers (Text to Columns or VALUE), remove blanks or fill them, refresh the pivot, then set the field to Sum in Value Field Settings.', explain:'Excel decides the default by looking at the column. A single text cell is enough to make it Count. Checking the data type first saves a lot of time.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a PivotTable and when would you use one?', a:'A PivotTable is a tool that summarises large data sets by grouping rows and calculating totals, counts or averages through drag and drop, without formulas. I use it to answer "how much by what" questions quickly, such as sales by region and month, and as the base of dashboards.',
      structure:'Define it, explain the four areas, give a typical question it answers.',
      follow:[ { q:'What are the four areas?', a:'Rows, Columns, Values and Filters.' },
               { q:'Does the pivot change the source data?', a:'No. It reads the data and builds a separate summary.' } ] },
    { level:'Intermediate', q:'Your pivot does not include the new rows added to the data. Why?', a:'The pivot has not been refreshed, or its source is a fixed range that does not include the new rows. I refresh it, and I convert the source to an Excel Table so the range grows automatically.',
      tradeoff:'Refreshing is manual by default. Automatic refresh on open is available but can be slow for big data.',
      follow:[ { q:'How do you refresh all pivots at once?', a:'Data > Refresh All, which also refreshes Power Query connections.' } ] },
    { level:'Scenario', q:'A manager wants sales by month and year from daily transactions. How do you build it?', a:'I insert a pivot from a Table, put the date field in Rows, group it by Months and Years so years are not mixed, put Sales in Values and add a slicer for region. If grouping fails, I check for text dates or blanks in the date column.',
      follow:[ { q:'Why group by years as well as months?', a:'Otherwise January 2025 and January 2026 are added together.' } ] }
  ],
  ref:{ headers:['Area','Holds','Example'], rows:[['Rows','Items listed down the side','Region'],['Columns','Items spread across the top','Category'],['Values','Numbers to summarise','Sum of Sales'],['Filters','Limits the whole pivot','Year']] },
  related:['pivot-fields','pivot-grouping','slicers','excel-tables','dashboard']
};

/* --- pivot-fields --- */
DEEP['pivot-fields'] = {
  level:'Intermediate',
  tldr:'Rows, Columns, Values and Filters are four places to drop a field. Moving a field rebuilds the whole report.',
  intuition:{ text:[
    'The same data can answer many questions, depending on how you arrange it. Region down the side and Category across the top shows a grid of sales. Swap them and you see the same numbers from the other side.',
    'Think of the four areas as roles. Rows and Columns are the axes of the report, Values is the measurement, and Filters narrow what is included.'
  ], analogy:'A spreadsheet-shaped photograph that you can rotate to view the same scene from another side.' },
  how:[
    'Drag a field into **Rows** to list its items down the side.',
    'Drag another into **Columns** to spread its items across the top and make a cross-tab.',
    'Drag a number into **Values**. Choose how to summarise it: Sum, Count, Average, and so on.',
    'Drag a field into **Filters** to limit the whole pivot to one item or a few.',
    'Right-click a value and use **Show Values As** for percentages and comparisons.'
  ],
  diagrams:[
    { type:'flow', arrows:['Rows: Region, Columns: Category'], panels:[
      { title:'Fields', text:'**Rows:** Region\n**Columns:** Category\n**Values:** Sum of Sales' },
      { title:'Pivot', rows:[['','Electronics','Furniture','Total'],['East',9500,6000,15500],['North',19000,15000,34000],['South',24000,8000,32000],['Total',52500,29000,81500]], hl:{2:'hit'} }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Percent of the row total', scenario:'Show, for each region, how its sales split between categories.', table:withHl(SALESLOG,{},'Sheet: Sales log'), task:'Change the value display.', formula:'Right-click a value > Show Values As > % of Row Total',
      steps:['The grid keeps the same layout.','Each cell is divided by its row total.'], table2:{ rows:[['','Electronics','Furniture','Total'],['East','61.3%','38.7%','100%'],['North','55.9%','44.1%','100%'],['South','75.0%','25.0%','100%']], caption:'Result' }, result:'South depends most on Electronics (75%).' },
    { level:'Business case', title:'Two row fields and a filter', scenario:'A manager wants sales by region, then category inside each region, for one year only.', table:withHl(SALESLOG,{},'Sheet: Sales log (with a Year column in the real file)'), task:'Build the layout.',
      formula:'Rows: Region, then Category\nValues: Sum of Sales\nFilters: Year', steps:['The second field in Rows creates a hierarchy, with Category nested under Region.','The Year filter limits all numbers to one year.'], result:'Region subtotals appear with their category rows below. Move Year to Columns to compare years side by side.' }
  ],
  edge:[
    { t:'Too many fields in Rows', d:'More than three row fields becomes unreadable. Use Filters or slicers for the extra dimensions.' },
    { t:'Order of fields in Rows', d:'Region then Category gives subtotals by region. Category then Region gives subtotals by category. The totals are the same, the story differs.' },
    { t:'Same field twice in Values', d:'Add Sales twice to show Sum and % of total side by side.' },
    { t:'Blank items', d:'"(blank)" appears when the source has empty cells in a row field. Fill them or filter them out.' },
    { t:'Report layout', d:'Compact, Outline and Tabular layouts change how row fields display. Tabular is best for copying data into other tools.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show each region\'s sales and its share of the grand total, side by side.', hint:'Add Sales twice and change the second.', solution:'Rows: Region\nValues: Sum of Sales, then Sum of Sales again set to % of Grand Total', explain:'North is 34000 (41.7%), South 32000 (39.3%) and East 15500 (19.0%).' },
    { level:'Interview', q:'A pivot shows Region in Rows and Category in Columns, but the manager wants categories down the side. How do you change it, and does the grand total change?', hint:'Drag the fields to the other area.', solution:'Drag Category to Rows and Region to Columns. The grand total does not change, only the layout.', explain:'Pivots separate data from layout. Rearranging is free, which is why you can explore the data interactively.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Explain Rows, Columns, Values and Filters.', a:'Rows list items down the side, Columns spread items across the top, Values holds the numbers being summarised, and Filters limits the whole pivot to selected items.',
      follow:[ { q:'What is a cross-tab?', a:'A pivot with one field in Rows and another in Columns, so each cell is the value for a pair of items.' } ] },
    { level:'Intermediate', q:'How do you show percentages in a pivot?', a:'Right-click a value, choose Show Values As, and pick, for example, % of Grand Total, % of Row Total or % of Column Total.' },
    { level:'Scenario', q:'A pivot with five fields in Rows is unreadable. What do you do?', a:'Reduce Rows to the key one or two fields, move other dimensions to Filters or slicers, and use Tabular layout if the output is copied. A good pivot answers one question clearly.',
      tradeoff:'More fields give more detail but reduce readability. Build several focused pivots instead of one overloaded one.' }
  ],
  ref:{ headers:['Area','Role','Example'], rows:[['Rows','Categories down the side','Region'],['Columns','Categories across the top','Category'],['Values','The number','Sum of Sales'],['Filters','Limits everything','Year']] },
  related:['pivot-basics','pivot-grouping','slicers','calculated-field']
};

/* --- pivot-grouping --- */
DEEP['pivot-grouping'] = {
  level:'Intermediate',
  tldr:'Grouping turns detailed dates or numbers into buckets, such as months, quarters, years or age bands, directly inside a pivot.',
  intuition:{ text:[
    'Daily data is too detailed to read. Managers think in months and quarters. Grouping lets a pivot combine the daily rows into larger buckets without adding helper columns to the data.',
    'The same idea works for numbers: ages into ten-year bands, order values into ranges. The pivot calculates the buckets for you, and you can change them in seconds.'
  ], analogy:'Folding daily pages of a diary into month chapters.' },
  how:[
    'Build a pivot with the date (or number) field in Rows.',
    'Right-click a date in the pivot and choose **Group**.',
    'Select Months, Quarters or Years (select several to keep years apart).',
    'For numbers, set Starting at, Ending at and By.',
    'Use **Ungroup** to remove the grouping.'
  ],
  diagrams:[
    { type:'flow', arrows:['Group by Months'], panels:[
      { title:'Daily rows', rows:[['Date','Sales'],['05-Jan',1200],['18-Jan',800],['03-Feb',1500],['21-Feb',700],['09-Mar',900]] },
      { title:'Grouped', rows:[['Month','Sum of Sales'],['Jan',2000],['Feb',2200],['Mar',900]] }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Quarters and years together', scenario:'Two years of data must be summarised by quarter without mixing years.', table:withHl(ORDERS_DT,{'B2:B6':'range'},'Sheet: Orders'), task:'Group by Years and Quarters.', formula:'Right-click a date > Group > select Years and Quarters > OK',
      steps:['Selecting both keeps Q1 2025 and Q1 2026 separate.','The pivot shows the year, with quarters nested underneath.'], table2:{ rows:[['Years / Quarters','Sum of Sales'],['2026',''],['  Qtr1',5100]], caption:'Result for the sample data' }, result:'All sample orders fall in Q1 2026, with a total of 5100.' },
    { level:'Business case', title:'Age bands for a customer analysis', scenario:'Marketing wants customer counts by ten-year age bands.', table:withHl({rows:[['Customer','Age'],['A',23],['B',27],['C',34],['D',41],['E',45],['F',52]]},{'B2:B7':'range'},'Sheet: Customers'), task:'Group the Age field in a pivot.', formula:'Rows: Age, Values: Count of Customer\nRight-click an age > Group > Starting at 20, Ending at 59, By 10',
      steps:['The bands are 20-29, 30-39, 40-49 and 50-59.','The pivot counts the customers in each band.'], table2:{ rows:[['Age band','Count'],['20-29',2],['30-39',1],['40-49',2],['50-59',1]], caption:'Result' }, result:'Changing the band width from 10 to 5 rebuilds the report instantly.' }
  ],
  edge:[
    { t:'"Cannot group that selection"', d:'The field contains text, errors or blanks. Fix the data so every value is a real date or number, then refresh.' },
    { t:'Dates stored as text', d:'Text dates cannot be grouped. Convert them with Text to Columns or DATEVALUE.' },
    { t:'Years must be included', d:'Grouping by Months alone merges the same month from different years. Select Years too.' },
    { t:'Fiscal years', d:'Pivot grouping uses calendar years. For a fiscal year starting in April, add a helper column in the data.' },
    { t:'New data and grouping', d:'After refresh, new dates fall into existing groups, but dates outside the original range may not. Check Starting at and Ending at.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Build a pivot of average sales by weekday from a date and sales column.', hint:'Weekday is not a built-in group. Add a helper column.', solution:'Helper column in the data: =TEXT(A2, "dddd")\nPivot: Rows = helper, Values = Average of Sales', explain:'Pivot grouping covers years, quarters, months, days, hours and minutes, but not weekdays. A helper column fills the gap.' },
    { level:'Interview', q:'Your pivot dates won\'t group, and the error says "Cannot group that selection". List your checks.', hint:'What can be in a date column?', solution:'1. Text dates: convert them.\n2. Blank cells: fill or remove.\n3. Error values (#N/A): fix.\n4. Mixed text and dates.\n5. Refresh the pivot after cleaning.', explain:'A short, ordered checklist shows practical experience.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you group dates in a pivot?', a:'Right-click a date in the pivot, choose Group, and select Months, Quarters, Years or Days. Selecting several keeps years apart.',
      follow:[ { q:'Why include Years?', a:'Otherwise January of different years is added together.' } ] },
    { level:'Intermediate', q:'How do you create age bands in a pivot?', a:'Put the age field in Rows, right-click, choose Group, and enter Starting at, Ending at and By, for example 20, 59 and 10. A count of customers per band appears.' },
    { level:'Scenario', q:'A fiscal year starts in April. How do you report by fiscal quarter?', a:'Add helper columns in the data: Fiscal Year and Fiscal Quarter calculated from the date, then use them in the pivot instead of the built-in date grouping.',
      tradeoff:'Helper columns add a little data work, but they make the report match the company calendar.' }
  ],
  ref:{ headers:['Need','How'], rows:[['Group dates','Right-click > Group > Months, Quarters, Years'],['Group numbers','Group > Starting at, Ending at, By'],['Remove grouping','Ungroup'],['Fiscal periods','Helper columns in the data']] },
  related:['pivot-basics','pivot-fields','slicers','date']
};

/* --- slicers --- */
D('slicers',{ l:'Intermediate', t:'Slicers are clickable filter buttons for pivots and tables. One slicer can control several pivots when you connect them.',
  i:['A filter drop-down is hidden until you open it. A slicer shows the current choice on the screen, so anyone reading a dashboard sees what is selected.','Because a slicer can be connected to many pivots, one click changes the whole dashboard at once.'], a:'A row of buttons that all the charts obey.',
  h:['Click a pivot and choose **Insert Slicer**.','Tick the fields to filter by, such as Region.','Click buttons to filter; hold Ctrl to pick several.','Use **Report Connections** to connect the slicer to other pivots.'],
  d:[FL(['click North'],[{ title:'Slicer', rows:[['Region'],['North'],['South'],['East']], hl:{1:'hit'} },{ title:'Pivot', rows:[['Category','Sum of Sales'],['Electronics',19000],['Furniture',15000],['Total',34000]] }])],
  x:[X('Variation','Several selections','Show North and East together.','Hold Ctrl while clicking.','Click North, Ctrl + click East',['Both are included.'],'The pivot shows the two regions combined.'),
     X('Business case','One slicer, three pivots','A KPI pivot, a region pivot and a category pivot must all respond.','Connect the slicer.','Slicer > Report Connections > tick all three pivots',['Without it, only the original pivot filters.'],'Clicking Year changes every number and chart.')],
  e:[['Not connected','A slicer controls only the pivots it is connected to.'],['Too many slicers','They clutter the page. Keep two or three.'],['Timeline slicer','For dates, use Insert Timeline.'],['Tables too','Slicers also work on Excel Tables.']],
  p:[P('Medium','Add a Region slicer to a pivot and show only North.','Insert Slicer.','PivotTable Analyze > Insert Slicer > Region > click North','The pivot shows North only.'),
     P('Interview','A slicer changes only one of your three pivots. Why?','Connections.','The others are not connected. Use Report Connections to tick them.','Typical dashboard bug.')],
  q:[Q('Basic','What is a slicer?','A set of buttons that filters a pivot or table.',{ f:[['How do you select several items?','Hold Ctrl.']] }),
     Q('Scenario','Slicers should control a pivot and its chart.','Charts follow their pivot, so connect the slicer to the pivots behind the charts.',{ t:'Pivot charts and pivots share the filter.' })],
  r:RT(['Task','How'],[['Insert','PivotTable Analyze > Insert Slicer'],['Multi-select','`Ctrl + click`'],['Connect','Report Connections'],['Dates','Insert Timeline']]), rel:['pivot-basics','pivot-fields','dashboard','filter'] });

/* --- calculated-field --- */
D('calculated-field',{ l:'Intermediate', t:'A calculated field adds a formula-based field to a pivot. It calculates on the totals of fields, not row by row.',
  i:['Sometimes the number you need is not in the data: profit is revenue minus cost, margin is profit divided by revenue. A calculated field lets the pivot compute it without changing the source.','The key point is the order of operations: the pivot first adds up each field, then applies your formula to the totals.'], a:'A formula applied to the totals line of a report.',
  h:['Click inside the pivot.','Choose **PivotTable Analyze > Fields, Items & Sets > Calculated Field**.','Name the field and write a formula using field names, such as `=Revenue-Cost`.','Add the new field to Values.'],
  d:[FL(['Revenue - Cost'],[{ title:'Pivot totals', rows:[['Product','Revenue','Cost','Profit'],['Pen',5000,3000,2000],['Book',8000,5000,3000],['Bag',12000,9000,3000],['Total',25000,17000,8000]], hl:{4:'hit'} }])],
  x:[X('Variation','A margin field','Add profit margin as a percentage.','Divide profit by revenue.','=(Revenue-Cost)/Revenue',['On the grand total: 8000 / 25000.'],'The margin is 32%. Format the field as a percentage.',withHl(PROFIT,{},'Sheet: Products')),
     X('Business case','When row-by-row is needed','A discount of 10% applies only to rows with quantity above 100.','Calculated fields cannot do row logic.','Add a helper column in the source, or use Power Query',['The calculated field works on sums.','Row-level logic belongs in the data.'],'Choose the helper column approach for conditional calculations.')],
  e:[['Works on totals','Not row by row. That is fine for differences and ratios of sums.'],['No cell references or lookups','Only field names.'],['Add it to Values','The field appears in the field list but must be dragged in.'],['Data Model alternative','Power Pivot measures (DAX) are more powerful.']],
  p:[P('Medium','Create a Profit field.','Fields, Items & Sets.','Name: Profit, Formula: =Revenue-Cost','The field then appears in the field list.'),
     P('Interview','Calculated field versus helper column?','Where does the logic live?','A calculated field is quick and lives in the pivot. A helper column handles row-level logic and can be reused outside the pivot.','Say when each is right.')],
  q:[Q('Basic','What is a calculated field?','A pivot field defined by a formula using other fields, such as Profit = Revenue - Cost.',{ f:[['Does it calculate per row?','No, on the sums of the fields.']] }),
     Q('Scenario','A pivot must show profit margin.','A calculated field =(Revenue-Cost)/Revenue, added to Values and formatted as a percentage.',{ t:'Power Pivot measures scale better for complex logic.' })],
  r:RT(['Rule','Detail'],[['Location','Fields, Items & Sets'],['Calculates on','Sums of fields'],['Cannot use','Cell references'],['Alternative','Helper column or DAX measure']]), rel:['pivot-fields','pivot-basics','sumproduct','dashboard'] });
})();
