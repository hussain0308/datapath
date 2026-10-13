/* Datapath | Excel | Charts and dashboards
 * Lessons in this file: column-chart, line-chart, pie-chart, combo-chart, dashboard
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
  const { MONTHS5 } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- column-chart --- */
'column-chart': {
  title:'Column and Bar charts', tagline:'Compare values across categories.',
  prereq:['pivot-basics'],
  what:['A column chart uses vertical bars; a bar chart uses horizontal bars.','Each bar shows the value of one category.','They are the standard chart for comparisons.'],
  why:['Compare regions, products or teams at a glance.','The easiest chart for people to read correctly.'],
  syntax:{ code:'Select the data > Insert > Column or Bar Chart', parts:[['Clustered','Bars side by side for comparing series.'],['Stacked','Series piled on top of each other to show parts of a total.'],['Bar (horizontal)','Better for long category names.']] },
  points:['**Start the axis at zero**, or the bars mislead.','Sort bars from largest to smallest unless the order has a meaning.','Use horizontal bars for long labels.','Add a clear title and data labels; remove clutter.','Avoid 3-D effects.','Use one colour unless colour carries meaning.'],
  mistakes:['Axis not starting at zero.','Too many categories.','Using 3-D charts.'],
  example:{ title:'Sales by region', scenario:'You want to compare total sales across regions.',
    table:withHl({rows:[['Region','Sales'],['North',34000],['South',32000],['East',15500]]},{'A1:B4':'range'},'Sheet: Summary'), task:'Create a column chart.', formula:'Select A1:B4 > Insert > Column or Bar Chart > Clustered Column',
    steps:['Select the region names and totals.','Insert a clustered column chart.','Add a title and data labels, and keep the axis at zero.'],
    chart:{ type:'bar', title:'Sales by region', labels:['North','South','East'], values:[34000,32000,15500] }, result:'North is the highest, and East is less than half of North.' },
  practice:{ q:'You have 12 product names with long labels. Which chart type is better and why?', hint:'Think about label length.', solution:'A horizontal bar chart, sorted from largest to smallest.', explain:'Long labels fit horizontally, and sorting makes the ranking easy to read.' },
  interview:[
    { level:'Basic', q:'When do you use a column chart?', a:'To compare values across categories, such as sales by region.' },
    { level:'Intermediate', q:'Why should column charts start at zero?', a:'The bar length represents the value. A cut axis exaggerates the differences and misleads the reader.' },
    { level:'Intermediate', q:'What is the difference between clustered and stacked columns?', a:'Clustered columns place series side by side for comparing them. Stacked columns pile series on top of each other to show how parts make up a total.' },
    { level:'Scenario', q:'You have 20 categories with long names. How do you present them?', a:'A sorted horizontal bar chart, possibly showing only the top 10 and grouping the rest as Other.' }
  ],
  mcq:[
    { q:'Where should a column chart axis start?', o:['At zero','At the lowest value','At 100','Anywhere'], a:0, why:'Bars represent lengths from zero.' },
    { q:'Which chart suits long category names?', o:['Horizontal bar','Pie','Line','Radar'], a:0, why:'Horizontal labels have room.' },
    { q:'What does a stacked column show?', o:['Parts of a total','Only totals','Trends over time','Correlation'], a:0, why:'Series are piled up.' },
    { q:'What should you avoid?', o:['3-D effects','Titles','Data labels','Sorting'], a:0, why:'3-D distorts the heights.' },
    { q:'How should bars usually be ordered?', o:['Largest to smallest','Random','By colour','Alphabetically always'], a:0, why:'Sorted bars show the ranking clearly.' }
  ],
  recap:['Column and bar charts compare categories.','Start at zero, sort the bars and avoid 3-D.','Use horizontal bars for long labels.']
},

/* --- line-chart --- */
'line-chart': {
  title:'Line charts', tagline:'Show how a value changes over time.',
  prereq:['column-chart'],
  what:['A line chart connects points over time.','The horizontal axis is usually dates or months.','It shows trends, rises and falls.'],
  why:['Monthly sales, website visits, stock prices and any trend.','Easy to compare a few series.'],
  syntax:{ code:'Select the data > Insert > Line Chart', parts:[['Line with Markers','Shows each data point.'],['Multiple lines','One line per series, such as each region.']] },
  points:['Use for **time series**; keep time in order, left to right.','Use up to about five lines.','The axis does not have to start at zero, but say so when it does not.','Markers help when there are few points.','Label the lines directly if possible.','Avoid using line charts for unrelated categories.'],
  mistakes:['Using a line chart for categories without order.','Too many lines.','Unsorted dates.'],
  example:{ title:'Monthly sales trend', scenario:'You want to see how sales moved from January to May.',
    table:withHl(MONTHS5,{'A1:B6':'range'},'Sheet: Sales'), task:'Create a line chart.', formula:'Select A1:B6 > Insert > Line Chart > Line with Markers',
    steps:['Select the months and sales.','Insert a line chart with markers.','Add a title and axis labels.'],
    chart:{ type:'line', title:'Monthly sales', labels:['Jan','Feb','Mar','Apr','May'], values:[1200,1500,900,1800,1100] }, result:'Sales dipped in March, peaked in April, and fell again in May.' },
  practice:{ q:'Would you use a line chart for sales by product category? Explain.', hint:'Think about order.', solution:'No. Categories have no natural order, so a column or bar chart is better.', explain:'A line suggests a trend between points. That only makes sense for ordered data such as time.' },
  interview:[
    { level:'Basic', q:'When do you use a line chart?', a:'To show a trend over time, such as monthly sales.' },
    { level:'Intermediate', q:'Why not use a line chart for categories such as regions?', a:'A line implies a continuous change between points. Regions have no order, so a column or bar chart is better.' },
    { level:'Intermediate', q:'How many lines are too many?', a:'More than about five makes the chart hard to read. I highlight the key lines and grey out the rest, or use small multiples.' },
    { level:'Scenario', q:'Your dates are not evenly spaced and the line looks distorted. What do you do?', a:'I set the axis to a Date axis so Excel spaces the points by real time, rather than as equal text categories.' }
  ],
  mcq:[
    { q:'What does a line chart show best?', o:['Trends over time','Parts of a whole','Rankings','Correlations only'], a:0, why:'The line connects ordered points.' },
    { q:'What belongs on the horizontal axis?', o:['Time','Categories without order','Totals','Colours'], a:0, why:'Time progresses left to right.' },
    { q:'How many lines are usually readable?', o:['About five or fewer','At least 20','Exactly 2','Only 1'], a:0, why:'Too many lines become messy.' },
    { q:'What does a Date axis do?', o:['Spaces points by real time','Sorts alphabetically','Adds totals','Removes markers'], a:0, why:'Uneven dates are spaced correctly.' },
    { q:'When is a line chart the wrong choice?', o:['Unordered categories','Monthly data','Daily data','Yearly data'], a:0, why:'A line implies order.' }
  ],
  recap:['Line charts show trends over time.','Keep time in order and limit the lines.','Use a column chart for unordered categories.']
},

/* --- pie-chart --- */
'pie-chart': {
  title:'Pie charts', tagline:'Show parts of a whole, when there are only a few parts.',
  prereq:['column-chart'],
  what:['A pie chart divides a circle into slices.','Each slice is a share of the total.','The slices always add up to 100 percent.'],
  why:['Show simple shares, such as sales split by region.','Good for a quick message with 2 to 5 parts.'],
  syntax:{ code:'Select the data > Insert > Pie Chart', parts:[['Pie','A circle with slices.'],['Doughnut','A pie with a hole in the middle, with the same limits.']] },
  points:['Use only for **parts of one whole**.','Keep it to **2 to 5 slices**.','Show percentage labels directly on the slices.','Sort slices from largest, starting at 12 o\'clock.','If slices are similar in size, use a bar chart instead.','Never use a pie chart for values that do not sum to a whole.'],
  mistakes:['Too many slices.','Using it to compare close values.','3-D pies.'],
  example:{ title:'Share of sales by region', scenario:'You want to show each region\'s share of total sales.',
    table:withHl({rows:[['Region','Sales'],['North',34000],['South',32000],['East',15500]]},{'A1:B4':'range'},'Sheet: Summary'), task:'Create a pie chart.', formula:'Select A1:B4 > Insert > Pie Chart > Pie > add percentage labels',
    steps:['Select the regions and totals.','Insert a pie chart and add data labels showing percentages.','North is 41.7%, South 39.3% and East 19.0% of the 81500 total.'],
    chart:{ type:'pie', title:'Share of sales', labels:['North','South','East'], values:[34000,32000,15500] }, result:'North and South together make up about 81% of sales.' },
  practice:{ q:'Two slices are 41.7% and 39.3%. Is a pie chart a good way to show which is bigger?', hint:'Think about comparing close values.', solution:'No. A bar chart shows small differences more clearly.', explain:'It is hard to compare similar angles. Bars compare lengths on a shared axis.' },
  interview:[
    { level:'Basic', q:'When should you use a pie chart?', a:'To show how a whole is divided into a few parts, such as 2 to 5 shares that add to 100 percent.' },
    { level:'Intermediate', q:'Why are pie charts often criticised?', a:'People compare angles and areas poorly, so close values are hard to rank. A bar chart is clearer for comparisons.' },
    { level:'Intermediate', q:'How would you show 10 categories?', a:'A sorted bar chart, not a pie. Or I show the top 4 and group the rest as Other.' },
    { level:'Scenario', q:'A manager asks for a pie chart of monthly sales for the year. What do you say?', a:'Monthly sales are not parts of one whole to compare by angle. A column or line chart shows the pattern better, so I suggest that and explain why.' }
  ],
  mcq:[
    { q:'What do the slices of a pie chart add up to?', o:['100 percent','The average','Zero','Any number'], a:0, why:'Slices are shares of a whole.' },
    { q:'How many slices are best?', o:['2 to 5','10 to 20','1','Exactly 12'], a:0, why:'More slices become unreadable.' },
    { q:'Which chart compares close values better?', o:['Bar chart','Pie chart','Doughnut','3-D pie'], a:0, why:'Lengths on a common axis are easier to compare.' },
    { q:'What should you avoid?', o:['3-D pies','Percent labels','A title','Sorting slices'], a:0, why:'3-D distorts the slices.' },
    { q:'What is the share of East in 34000, 32000 and 15500?', o:['About 19%','About 42%','About 39%','About 50%'], a:0, why:'15500 divided by 81500 is about 19%.' }
  ],
  recap:['Pie charts show shares of one whole with few slices.','Use bars to compare close values.','Avoid 3-D and too many slices.']
},

/* --- combo-chart --- */
'combo-chart': {
  title:'Combo charts', tagline:'Combine columns and a line, even with different scales.',
  prereq:['column-chart','line-chart'],
  what:['A combo chart mixes chart types, such as columns for amounts and a line for a percentage.','A secondary axis lets values with different scales share a chart.','It shows two related measures together.'],
  why:['Revenue (amount) and margin (percent) in one view.','Sales and target, or volume and price.'],
  syntax:{ code:'Select the data > Insert > Combo Chart > Clustered Column - Line on Secondary Axis', parts:[['Primary axis','The left axis, usually for the columns.'],['Secondary axis','The right axis, for the line when its scale is different.']] },
  points:['Use a **secondary axis** when the units or sizes differ a lot.','Label both axes clearly.','Use two different colours.','Use sparingly: two scales can confuse readers.','Columns for amounts, line for rates or percentages is the usual pairing.','Do not use a secondary axis to make unrelated data look correlated.'],
  mistakes:['A secondary axis without labels.','Combining unrelated measures.','Too many series.'],
  example:{ title:'Revenue and margin', scenario:'You want to show revenue and profit margin per product.',
    table:withHl({rows:[['Product','Revenue','Margin'],['Pen',5000,'40%'],['Book',8000,'37.5%'],['Bag',12000,'25%']]},{'A1:C4':'range'},'Sheet: Products'), task:'Create a combo chart.', formula:'Select A1:C4 > Insert > Combo Chart > Revenue: Clustered Column > Margin: Line, Secondary Axis',
    steps:['Select the table and insert a combo chart.','Set Revenue as clustered column and Margin as a line on the secondary axis.','Add axis titles for both axes.'],
    chart:{ type:'combo', title:'Revenue and margin', labels:['Pen','Book','Bag'], values:[5000,8000,12000], values2:[40,37.5,25], suffix2:'%' }, result:'Revenue rises from Pen to Bag, while the margin falls from 40% to 25%.' },
  practice:{ q:'Why do we put the margin line on a secondary axis?', hint:'Compare the sizes of 5000 and 40.', solution:'The margin is a small percentage and the revenue is in thousands, so on one axis the line would look flat.', explain:'The secondary axis gives the line its own scale from 0 to 50 percent.' },
  interview:[
    { level:'Basic', q:'What is a combo chart?', a:'A chart that combines two chart types, such as columns and a line, usually to show two related measures.' },
    { level:'Intermediate', q:'When do you need a secondary axis?', a:'When the two measures have very different scales or units, such as revenue in thousands and margin in percent.' },
    { level:'Intermediate', q:'What is the risk of dual-axis charts?', a:'Readers can misread the scales or see a false relationship. I label both axes clearly and use them only for related measures.' },
    { level:'Scenario', q:'Show monthly sales against a target line. How?', a:'Sales as columns, target as a line on the same axis since they have the same units. A secondary axis is not needed.' }
  ],
  mcq:[
    { q:'What does a secondary axis allow?', o:['A different scale for one series','Sorting','Filtering','Rounding'], a:0, why:'The second scale is shown on the right side.' },
    { q:'Which pairing is typical?', o:['Columns for amounts, line for a percentage','Pie and line','Two pies','Line and text'], a:0, why:'Amounts and rates have different scales.' },
    { q:'What should you always add to a dual-axis chart?', o:['Axis titles','3-D','More colours','Gridlines only'], a:0, why:'Clear labels prevent misreading.' },
    { q:'When is a secondary axis NOT needed?', o:['Same units, such as sales and target','Percent and amount','Different scales','Never'], a:0, why:'Same units share one axis.' },
    { q:'What is a risk of combo charts?', o:['They may suggest a false relationship','They hide the data','They cannot be sorted','They break pivots'], a:0, why:'Two scales can make unrelated data look linked.' }
  ],
  recap:['Combo charts mix chart types, often columns with a line.','Use a secondary axis for very different scales.','Label axes and use sparingly.']
},

/* --- dashboard --- */
'dashboard': {
  title:'Building a dashboard', tagline:'Put KPIs, charts and filters on one page that answers a business question.',
  prereq:['slicers','combo-chart','pie-chart'],
  what:['A dashboard is a single page with the key numbers and charts for a decision.','It is built from pivots, charts, KPI cells and slicers.','It updates when you refresh the data.'],
  why:['Managers want answers on one screen.','It is the visible result of your whole data analyst skill set.'],
  syntax:{ code:'1. Question  2. KPIs  3. Pivots  4. Charts  5. Slicers  6. Layout  7. Refresh', parts:[['KPI','A key number such as total sales or average order value.'],['Visuals','3 to 5 charts that explain the KPIs.'],['Slicers','Controls for region, category or date.']] },
  points:['Start with the **question** and the audience, not the charts.','Put the **KPIs at the top**, charts below, filters on the side or top.','Use 3 to 5 visuals, and one clear colour scheme.','Keep calculations and pivots on a **separate sheet**.','Connect slicers to all pivots, and hide gridlines.','Build from an Excel Table, so Refresh All updates everything.'],
  mistakes:['Too many charts and colours.','Starting with charts instead of the question.','Hard-coded numbers that do not update.'],
  example:{ title:'A sales dashboard', scenario:'The manager wants one page showing how sales are doing by region.',
    table:withHl({rows:[['KPI','Value','Formula'],['Total sales',81500,'=SUM(tblSales[Sales])'],['Orders',8,'=COUNTA(tblSales[Order])'],['Average order',10187.5,'=AVERAGE(tblSales[Sales])'],['Top region','North','=INDEX(...)']]},{'B2:B5':'hit'},'Sheet: KPI cells'), task:'Plan the page.', formula:'Top: 4 KPI cells | Middle: column chart (by region), pie chart (by category) | Side: slicers (Region, Category)',
    steps:['Place the four KPI cells across the top.','Add a column chart of sales by region and a pie chart of category share from pivots.','Add Region and Category slicers and connect them to both pivots.','Hide gridlines, align the objects, and use a consistent colour.'],
    chart:{ type:'bar', title:'Sales by region (dashboard chart)', labels:['North','South','East'], values:[34000,32000,15500] }, result:'The manager opens the page, clicks a slicer and sees every number and chart change together.' },
  practice:{ q:'List the steps to keep a dashboard up to date when new rows are added.', hint:'Think about tables and refresh.', solution:'1. Keep the data in an Excel Table.\n2. Base all pivots on the Table.\n3. Data > Refresh All.', explain:'The Table grows with the new rows, and Refresh All updates every pivot and chart.' },
  interview:[
    { level:'Basic', q:'What is a dashboard?', a:'A single page that shows the key numbers and charts needed to answer a business question, usually with filters.' },
    { level:'Intermediate', q:'How do you decide what goes on a dashboard?', a:'I start with the audience and the question they need answered, then choose a few KPIs and the charts that explain them. If something does not help the decision, I leave it out.' },
    { level:'Intermediate', q:'How do you make an Excel dashboard refresh easily?', a:'The data sits in an Excel Table, pivots and charts are built on it, slicers are connected, and I use Data > Refresh All.' },
    { level:'Scenario', q:'A manager says your dashboard is too busy. What do you do?', a:'I remove low-value visuals, limit colours, put KPIs first, group related items and keep only the filters people actually use.' }
  ],
  mcq:[
    { q:'What do you start with when building a dashboard?', o:['The business question','The charts','The colours','The slicers'], a:0, why:'The question decides what to show.' },
    { q:'Where do KPIs usually go?', o:['At the top','At the bottom','On another file','Hidden'], a:0, why:'Key numbers should be seen first.' },
    { q:'How many visuals are usually best?', o:['3 to 5','15 to 20','1','30'], a:0, why:'More becomes cluttered.' },
    { q:'What updates all pivots at once?', o:['Refresh All','Sort','Filter','Paste values'], a:0, why:'Data > Refresh All updates every pivot and query.' },
    { q:'Where should pivots and calculations live?', o:['On a separate sheet','On the dashboard','Nowhere','In comments'], a:0, why:'A separate sheet keeps the dashboard clean.' }
  ],
  recap:['Start with the question, then KPIs, 3 to 5 visuals and slicers.','Build on a Table and use Refresh All.','Keep it clean and consistent.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- column-chart --- */
D('column-chart',{ l:'Beginner', t:'Column and bar charts compare values across categories. Start the axis at zero, sort the bars, and avoid 3-D.',
  i:['A column chart turns a table of numbers into lengths you can compare at a glance. It is the safest and most readable chart for comparing categories.','Because the eye reads bar length, the axis must start at zero. A cut axis makes small differences look huge.'], a:'A row of towers: the tallest is the biggest.',
  h:['Select the labels and values.','Choose **Insert > Column or Bar Chart**.','Sort bars by size, add a title and data labels.','Keep one colour, and the axis at zero.'],
  d:[FL(['Insert column chart'],[{ title:'Data', rows:[['Region','Sales'],['North',34000],['South',32000],['East',15500]] },{ title:'Chart', text:'North ██████████\nSouth █████████\nEast  ████' }])],
  x:[X('Variation','A long category list','Twenty product names with long labels.','Use a sorted horizontal bar chart.','Insert > Bar Chart, then sort the data descending',['Horizontal labels have room to read.'],'The ranking is clear, and labels do not overlap.'),
     X('Business case','Stacked versus clustered','Show sales by region and also how categories split inside each region.','Choose stacked columns.','Insert > Stacked Column',['Stacked shows parts of a total.','Clustered compares categories side by side.'],'Use stacked for composition and clustered for comparison.')],
  e:[['Truncated axis','Starting above zero exaggerates differences.'],['3-D effects','They distort heights.'],['Too many categories','Group the small ones as Other.'],['Colour','Use one colour; highlight only what matters.']],
  p:[P('Medium','Chart sales by region for North, South and East.','Select two columns.','Select A1:B4 > Insert > Clustered Column','Add a title and labels.'),
     P('Interview','A manager asks to cut the axis at 30000 so differences look bigger. What do you say?','Misleading.','Bars encode value as length, so a cut axis exaggerates differences. Show the full axis or use a dot plot if the differences are small.','Honest charts build trust.')],
  q:[Q('Basic','When do you use a column chart?','To compare values across categories.',{ f:[['Why start at zero?','Bar length represents the value.']] }),
     Q('Scenario','Show 20 categories with long names.','A sorted horizontal bar chart, possibly top 10 plus Other.',{ t:'Fewer bars read better.' })],
  r:RT(['Type','Use'],[['Clustered column','Compare categories'],['Stacked column','Parts of a total'],['Bar','Long labels'],['Rule','Axis starts at zero']]), rel:['line-chart','pie-chart','pivot-basics','dashboard'] });

/* --- line-chart --- */
D('line-chart',{ l:'Beginner', t:'A line chart shows how a value changes over time. Use it for ordered data, with a limited number of lines.',
  i:['Lines connect points, so they suggest a continuous path. That is right for time (months, days) and wrong for unordered categories like regions.','The chart answers "is it rising, falling or seasonal?".'], a:'A heart monitor trace: you read the shape over time.',
  h:['Select the time labels and the values.','Choose **Insert > Line Chart** (with markers if few points).','Keep time in order, left to right.','Limit to about five lines, and label them directly.'],
  d:[FL(['Insert line chart'],[{ title:'Data', rows:[['Month','Sales'],['Jan',1200],['Feb',1500],['Mar',900],['Apr',1800],['May',1100]] },{ title:'Shape', text:'up, dip in Mar, peak in Apr, drop in May' }])],
  x:[X('Variation','Uneven dates','Dates are not evenly spaced and the line looks distorted.','Use a Date axis.','Format Axis > Axis Type > Date axis',['Points are spaced by real time.'],'The slope now reflects the true time gaps.'),
     X('Business case','Two lines','Compare this year with last year.','Add a second series.','Select both series, Insert > Line',['Use two clear colours and a legend.'],'Seasonal patterns become visible.')],
  e:[['Unordered categories','A line implies order. Use columns for regions.'],['Too many lines','More than five becomes hard to read.'],['Axis not at zero','Acceptable for lines, but say so.'],['Missing data','Empty cells leave gaps; choose how to display them.']],
  p:[P('Medium','Chart the monthly sales.','Select Month and Sales.','Insert > Line with Markers','Add a title and axis labels.'),
     P('Interview','Why not use a line chart for sales by product category?','Order.','Categories have no natural order, so a line would imply a trend between unrelated items. Use a column or bar chart.','State the reason for each chart choice.')],
  q:[Q('Basic','When do you use a line chart?','To show a trend over time.',{ f:[['How many lines are readable?','About five or fewer.']] }),
     Q('Scenario','The line looks jagged with daily data.','Use a moving average line alongside the raw data, or aggregate to weeks.',{ t:'Smoothing hides detail.' })],
  r:RT(['Rule','Why'],[['Time on x-axis','Shows trend'],['Few lines','Readability'],['Date axis','Even spacing'],['Not for categories','Implies order']]), rel:['column-chart','combo-chart','pivot-grouping','dashboard'] });

/* --- pie-chart --- */
D('pie-chart',{ l:'Beginner', t:'A pie chart shows shares of one whole with a few slices. If slices are close in size, use a bar chart.',
  i:['A pie answers "what share does each part have?". It works for two to five parts that add up to 100%.','People judge angles poorly, so close values are hard to compare, and many slices turn into confetti.'], a:'Slicing a cake: you read the shares, not the exact numbers.',
  h:['Select the labels and values.','Choose **Insert > Pie Chart**.','Add percentage labels on the slices.','Order slices from the largest, starting at 12 o\'clock.'],
  d:[FL(['share of total'],[{ title:'Sales by region', rows:[['Region','Sales','Share'],['North',34000,'41.7%'],['South',32000,'39.3%'],['East',15500,'19.0%']] },{ title:'Message', text:'North and South are 81% of sales' }])],
  x:[X('Variation','Too many slices','Ten categories in a pie.','Group the small ones.','Show the top 4 and combine the rest as Other',['Fewer slices read clearly.'],'A bar chart is better for ten items.'),
     X('Business case','Close values','North is 41.7% and South 39.3%. Which is bigger?','Compare in a bar chart.','Insert > Bar Chart',['Lengths on a common axis are easier to compare than angles.'],'Use a pie only when the message is the part-to-whole.')],
  e:[['Values must form a whole','Do not use a pie for unrelated numbers, such as monthly sales.'],['Many slices','More than five is unreadable.'],['3-D pies','They distort size.'],['Labels','Show percentages directly on slices.']],
  p:[P('Medium','Chart the region shares of sales.','Percent labels.','Select A1:B4 > Insert > Pie > Data Labels > Percentage','North is about 42%.'),
     P('Interview','A manager asks for a pie chart of monthly sales for the year. What do you say?','Whole versus trend.','Monthly sales are a trend, not shares of one whole, and 12 slices are unreadable. A column or line chart shows it better.','Suggest the better chart and say why.')],
  q:[Q('Basic','When should you use a pie chart?','To show shares of a whole with two to five slices.',{ f:[['Why do critics dislike pies?','Angles are hard to compare.']] }),
     Q('Scenario','Show market share for 12 competitors.','A sorted bar chart, or the top 5 plus Other.',{ t:'Pies suit a simple message only.' })],
  r:RT(['Rule','Detail'],[['Slices','2 to 5'],['Values','Add to a whole'],['Avoid','3-D, many slices'],['Better for comparing','Bar chart']]), rel:['column-chart','line-chart','combo-chart','dashboard'] });

/* --- combo-chart --- */
D('combo-chart',{ l:'Intermediate', t:'A combo chart mixes chart types, such as columns for amounts and a line for a percentage. Use a secondary axis when the scales differ.',
  i:['Revenue is in thousands and margin is a percentage. On one axis, the margin line would look flat. A combo chart gives each its own scale: columns on the left, line on the right.','The danger is confusion: two scales can mislead, so label both clearly.'], a:'Two rulers side by side, one for each measure.',
  h:['Select the data with both series.','Choose **Insert > Combo Chart**.','Set one series as columns, the other as a line on the **secondary axis**.','Label both axes.'],
  d:[FL(['columns + line'],[{ title:'Data', rows:[['Product','Revenue','Margin'],['Pen',5000,'40%'],['Book',8000,'37.5%'],['Bag',12000,'25%']] },{ title:'Message', text:'Revenue rises, margin falls' }])],
  x:[X('Variation','Same units, one axis','Monthly sales and a target line.','No secondary axis needed.','Columns for sales, a line for target on the same axis',['Same units share one axis.'],'Fewer axes mean less confusion.'),
     X('Business case','A misleading dual axis','Two unrelated series on two axes appear correlated.','Be careful.','Check that the measures are related and the axes are labelled',['Dual axes can create a false story.'],'Use only when the relationship is meaningful.')],
  e:[['Unlabelled secondary axis','Readers cannot tell which scale applies.'],['Unrelated measures','Plotting them together suggests a link.'],['Too many series','More than two or three is clutter.'],['Percent versus amount','The classic valid use.']],
  p:[P('Medium','Chart revenue as columns and margin as a line.','Secondary axis.','Insert > Combo > Margin: Line, Secondary Axis','Add axis titles.'),
     P('Interview','Why use a secondary axis, and what is the risk?','Scales.','When measures have very different scales or units. The risk is misleading comparisons, so label both axes and use sparingly.','Balanced answer.')],
  q:[Q('Basic','What is a combo chart?','A chart combining two chart types, usually columns and a line.',{ f:[['When do you need a secondary axis?','When units or sizes differ a lot.']] }),
     Q('Scenario','Sales against a target.','Same units: columns and a line on one axis.',{ t:'Keep it simple.' })],
  r:RT(['Pair','Axis'],[['Amount and percent','Secondary axis'],['Sales and target','Same axis'],['Always','Label both axes'],['Avoid','Unrelated series']]), rel:['column-chart','line-chart','dashboard','calculated-field'] });

/* --- dashboard --- */
DEEP['dashboard'] = {
  level:'Intermediate to Advanced',
  tldr:'A dashboard answers one business question on one page: KPIs on top, three to five charts below, and slicers to explore.',
  intuition:{ text:[
    'The mistake most beginners make is to start with charts. A good dashboard starts with a question: "Are we on track this quarter, and where are we losing sales?". The question decides which numbers matter, and everything that does not help answer it is removed.',
    'The technical part is easy once the data is in a Table: pivots feed charts, slicers control them, and Refresh All updates everything. The hard part is design and restraint.'
  ], analogy:'A car dashboard: only what the driver needs right now, placed where the eye expects it.' },
  how:[
    'Write the question and name the audience.',
    'Choose 3 to 5 KPIs, such as total sales, orders, average order and top region.',
    'Prepare the data in an Excel Table, and build pivots on a separate **Calc** sheet.',
    'Create charts from the pivots, and place KPIs at the top, charts below.',
    'Add slicers and connect them to every pivot.',
    'Hide gridlines, align everything, use one colour scheme, then test **Refresh All**.'
  ],
  diagrams:[
    { type:'flow', arrows:['','',''], panels:[
      { title:'Data', text:'Excel Table' },{ title:'Pivots and KPIs', text:'Calc sheet' },{ title:'Charts and slicers', text:'Dashboard sheet' },{ title:'Refresh All', text:'one click' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'One slicer controlling several visuals', scenario:'A Region slicer should filter the KPI cells, the column chart and the pie chart together.', table:T({rows:[['Item','Connected?']]},'Slicer connections'), task:'Connect the slicer to all pivots.', formula:'Select the slicer > Slicer tab > Report Connections > tick every PivotTable > OK',
      steps:['Each chart is built on its own pivot.','The slicer filters all ticked pivots at once.'], result:'Clicking North updates the KPIs and both charts together.' },
    { level:'Business case', title:'A design checklist for a review', scenario:'A manager says the dashboard is too busy. Use a checklist to simplify it.', table:withHl({rows:[['Check','Pass?'],['Opens with the answer to one question','Yes'],['4 KPIs at the top','Yes'],['Max 5 visuals','No: 9 charts'],['One colour scheme','No: 6 colours'],['Gridlines hidden','Yes'],['Slicers connected to all pivots','Yes']]},{'A4:B5':'miss'},'Review'),
      task:'Fix the failing checks.', formula:'Remove or merge low-value charts; use one accent colour plus grey', steps:['Cut charts that do not support the main question.','Use colour to highlight, not decorate.'], result:'Fewer visuals and a calmer palette make the message clearer.' }
  ],
  edge:[
    { t:'Charts that do not refresh', d:'A chart based on a normal range does not include new rows. Build pivots from a Table and use Refresh All.' },
    { t:'Hard-coded numbers', d:'A KPI typed by hand goes stale. Every number should be a formula or pivot reference.' },
    { t:'Slicers not connected', d:'A slicer only controls the pivots it is connected to. Check Report Connections for every one.' },
    { t:'Misleading charts', d:'Truncated axes, 3-D effects and too many slices distort the message. Start bars at zero and avoid pies with many slices.' },
    { t:'Calculations on the dashboard sheet', d:'Keep working tables on a separate sheet, so the dashboard stays clean and cannot be broken accidentally.' },
    { t:'Performance', d:'Many pivots on the same data should share a pivot cache. Use the Data Model for very large data.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'List the pivots and charts you would build for a sales dashboard of 4 KPIs and 3 visuals.', hint:'Think of the questions a sales manager asks.', solution:'KPIs: total sales, orders, average order value, top region.\nVisuals: column chart of sales by region, line chart of sales by month, pie or bar chart of sales by category.\nSlicers: Region and Year.', explain:'Each visual answers one question: where, when and what. Everything else is detail that can be drilled into.' },
    { level:'Interview', q:'Walk me through how you would build a monthly sales dashboard, and how you would keep it updated.', hint:'From data to refresh.', solution:'1. Agree the question and the KPIs with the stakeholder.\n2. Clean the data and load it as a Table (or through Power Query).\n3. Build pivots on a Calc sheet.\n4. Create charts and KPI cells, add slicers and connect them.\n5. Design: layout, colours, no gridlines.\n6. Test with fresh data, then use Refresh All each month.', explain:'Naming the stakeholder conversation first, and the refresh process last, shows you think beyond the charts.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a dashboard and what makes a good one?', a:'A dashboard is a single page that presents the key numbers and charts needed to answer a business question, usually with filters. A good one has a clear purpose, a few relevant KPIs, simple charts, consistent design and updates easily.',
      structure:'Define, then purpose, simplicity and maintainability.',
      follow:[ { q:'How many visuals?', a:'Typically three to five. More dilutes the message.' } ] },
    { level:'Intermediate', q:'How do you make an Excel dashboard refresh easily?', a:'Keep the data in a Table or Power Query, base pivots on it, connect slicers to all pivots and use Data > Refresh All. KPIs are formulas that reference pivots or the Table, not typed numbers.' },
    { level:'Scenario', q:'A manager wants 15 charts on one page. How do you respond?', a:'I ask what decision the dashboard supports, and propose a focused one-page view with drill-down detail on other sheets or through slicers. I explain that more charts make it harder to see what matters.',
      tradeoff:'Giving stakeholders everything feels safe, but clarity usually gets the dashboard used.' }
  ],
  ref:{ headers:['Element','Guidance'], rows:[['Purpose','One question, one audience'],['KPIs','3 to 5, at the top'],['Charts','3 to 5, simple types'],['Filters','Slicers connected to all pivots'],['Maintenance','Table + Refresh All']] },
  related:['pivot-basics','slicers','combo-chart','power-query','excel-tables']
};
})();
