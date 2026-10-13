/* Datapath | Excel | Date functions
 * Lessons in this file: today, year, month, day, date, datedif, eomonth, networkdays
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
  const { ORD_DATES } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- today --- */
'today': {
  title:'TODAY', tagline:'Return the current date, updated every day.',
  prereq:[],
  what:['TODAY returns today\'s date from your computer clock.','It takes no arguments.','It updates every time the workbook recalculates or is opened.'],
  why:['Calculate days left until a due date, or age and tenure.','Build reports that always compare against today.'],
  syntax:{ code:'=TODAY()', parts:[['(no arguments)','Just type the brackets. TODAY needs no input.']] },
  points:['It is **volatile**: the value changes every day.','You can add or subtract days: `=TODAY()+30`.','Days left = due date minus TODAY.','`NOW()` returns the date **and time**.','To keep a fixed date, type it or press **Ctrl + ;**.','Format result cells as numbers when you subtract dates, otherwise Excel may show a date.'],
  mistakes:['Using TODAY in records that should keep their original date, such as an invoice date.','Result formatted as a date after subtracting two dates.','Expecting it to update without recalculation.'],
  example:{ title:'Days left until a deadline', scenario:'A task list has due dates. Suppose today is 10-Oct-2026.',
    table:withHl({rows:[['Task','Due date','Days left'],['Report','15-Oct-2026',5],['Audit','08-Oct-2026',-2]]},{'B2':'find','C2':'hit'},'Sheet: Tasks'), task:'Find the days left for the Report.', formula:'=B2-TODAY()',
    steps:['TODAY() returns 10-Oct-2026.','15-Oct-2026 minus 10-Oct-2026 is 5 days.','A negative number, like the Audit row, means overdue.'], result:'The formula returns 5. Format the cell as a Number.' },
  practice:{ q:'Write a formula that returns "Overdue" when the due date in B2 is before today, otherwise "On track".', hint:'Compare B2 with TODAY() inside IF.', solution:'=IF(B2<TODAY(), "Overdue", "On track")', explain:'If today is 10-Oct-2026 and B2 is 08-Oct-2026, then B2 is earlier than today, so the result is Overdue.' },
  interview:[
    { level:'Basic', q:'What does TODAY return?', a:'The current date. It has no arguments and updates whenever the workbook recalculates.' },
    { level:'Intermediate', q:'What is a volatile function?', a:'One that recalculates every time the sheet recalculates, whatever changed. TODAY and NOW are volatile, so too many of them can slow large workbooks.' },
    { level:'Intermediate', q:'What is the difference between TODAY and NOW?', a:'TODAY returns only the date, NOW returns the date and the current time.' },
    { level:'Scenario', q:'An invoice date changes every day when the file opens. What went wrong?', a:'TODAY was used as the invoice date. I replace it with a fixed date, typed or entered with Ctrl+;, because TODAY always shows the current date.' }
  ],
  mcq:[
    { q:'How many arguments does TODAY take?', o:['None','One','Two','Three'], a:0, why:'You type =TODAY() with empty brackets.' },
    { q:'What does `=TODAY()+7` return?', o:['The date one week from now','The date a week ago','7','An error'], a:0, why:'Adding a number adds days.' },
    { q:'What does NOW return that TODAY does not?', o:['The time','The year','The month','The weekday'], a:0, why:'NOW returns the date and time.' },
    { q:'What shortcut enters a fixed date?', o:['Ctrl + ;','Ctrl + T','Ctrl + F','Alt + ;'], a:0, why:'Ctrl + ; inserts the current date as a fixed value.' },
    { q:'Why shouldn\'t TODAY be used for an invoice date?', o:['It changes every day','It is slow to type','It only works in 365','It returns text'], a:0, why:'The invoice date would keep changing.' }
  ],
  recap:['TODAY returns the current date and updates daily.','Due date minus TODAY gives days left.','Use a fixed date (Ctrl+;) for records.']
},

/* --- year --- */
'year': {
  title:'YEAR', tagline:'Return the year of a date.',
  prereq:['today'],
  what:['YEAR returns the year number from a date, such as 2026.','The date must be a real Excel date, not text.','It is used to group and filter by year.'],
  why:['Group sales by year in reports and pivots.','Calculate ages and anniversaries.'],
  syntax:{ code:'=YEAR(serial_number)', parts:[['serial_number','A date, or a cell that holds a date.']] },
  points:['Returns a number from 1900 to 9999.','Dates stored as **text** give `#VALUE!`.','Combine with MONTH to group by year and month.','Use `YEAR(TODAY())` for the current year.','Use SUMIFS with start and end dates when it is faster than YEAR on every row.'],
  mistakes:['Dates stored as text.','Two-digit years being read as 19xx or 20xx unexpectedly.','Using YEAR on a number that is not a date.'],
  example:{ title:'Pulling the year from an order date', scenario:'Orders have dates and you want the year of each.',
    table:withHl(ORD_DATES,{'B2':'find'},'Sheet: Orders'), task:'Get the year of the first order.', formula:'=YEAR(B2)',
    steps:['B2 holds 15-Aug-2026.','YEAR returns only the year part.'], result:'The formula returns 2026.' },
  practice:{ q:'Write a formula that returns "Current year" when the date in B2 falls in the same year as today, otherwise "Other year".', hint:'Compare YEAR(B2) with YEAR(TODAY()).', solution:'=IF(YEAR(B2)=YEAR(TODAY()), "Current year", "Other year")', explain:'In 2026, an order dated 15-Aug-2026 matches the current year.' },
  interview:[
    { level:'Basic', q:'What does YEAR return?', a:'The year number of a date, such as 2026.' },
    { level:'Intermediate', q:'YEAR returns #VALUE! on a date column. Why?', a:'The dates are probably stored as text. I convert them with DATEVALUE, Text to Columns or by changing the format, then try again.' },
    { level:'Intermediate', q:'How do you group sales by year in a formula?', a:'Add a helper column with =YEAR(A2) and use SUMIFS on it, or use a pivot table and group by years.' },
    { level:'Scenario', q:'How do you calculate a person\'s age in years from a birth date?', a:'=DATEDIF(A2, TODAY(), "Y") gives complete years. YEAR(TODAY())-YEAR(A2) is only approximate because it ignores the month and day.' }
  ],
  mcq:[
    { q:'What does `=YEAR(DATE(2026,8,15))` return?', o:['2026','8','15','46249'], a:0, why:'YEAR returns the year part.' },
    { q:'What happens if the date is stored as text?', o:['#VALUE!','It works','0','Blank'], a:0, why:'YEAR needs a real date.' },
    { q:'Which formula returns the current year?', o:['=YEAR(TODAY())','=YEAR()','=TODAY(YEAR)','=YEAR(NOW)'], a:0, why:'Pass TODAY() to YEAR.' },
    { q:'Which function gives complete years between two dates?', o:['DATEDIF','YEAR only','COUNT','ROUND'], a:0, why:'DATEDIF with "Y" counts complete years.' },
    { q:'What type of value does YEAR return?', o:['Number','Text','Date','Boolean'], a:0, why:'It returns a number such as 2026.' }
  ],
  recap:['YEAR returns the year number of a date.','Text dates cause #VALUE!.','Combine with MONTH and DAY for grouping and checks.']
},

/* --- month --- */
'month': {
  title:'MONTH', tagline:'Return the month number of a date.',
  prereq:['year'],
  what:['MONTH returns a number from 1 (January) to 12 (December).','The date must be a real date.','It is used to group by month.'],
  why:['Monthly sales reports and trends.','Check if a date falls in a particular month.'],
  syntax:{ code:'=MONTH(serial_number)', parts:[['serial_number','A date, or a cell that holds a date.']] },
  points:['Returns 1 to 12.','For the month **name**, use `TEXT(date, "mmmm")`.','Combine with YEAR to avoid mixing the same month of different years.','Dates stored as text give `#VALUE!`.','Use with SUMIFS and a helper column to total by month.'],
  mistakes:['Grouping by MONTH only, which mixes the same month from different years.','Expecting the month name.','Dates stored as text.'],
  example:{ title:'Pulling the month from an order date', scenario:'You need the month of each order for monthly totals.',
    table:withHl(ORD_DATES,{'B2':'find'},'Sheet: Orders'), task:'Get the month number of the first order.', formula:'=MONTH(B2)',
    steps:['B2 holds 15-Aug-2026.','August is the 8th month.'], result:'The formula returns 8.' },
  practice:{ q:'Write a formula that returns the month name (for example August) for the date in B2.', hint:'Use TEXT with the format "mmmm".', solution:'=TEXT(B2, "mmmm")', explain:'TEXT with "mmmm" returns the full month name, August. "mmm" returns Aug.' },
  interview:[
    { level:'Basic', q:'What does MONTH return?', a:'A number from 1 to 12 for the month of a date.' },
    { level:'Intermediate', q:'How do you get the month name?', a:'=TEXT(A2, "mmmm") for the full name or "mmm" for the short name.' },
    { level:'Intermediate', q:'Why is grouping by MONTH alone risky?', a:'If the data covers more than one year, January 2025 and January 2026 would be combined. I group by year and month together.' },
    { level:'Scenario', q:'How do you get monthly totals for one year?', a:'SUMIFS with a start and end date for each month, or a pivot table with dates grouped by months and years.' }
  ],
  mcq:[
    { q:'What does `=MONTH(DATE(2026,8,15))` return?', o:['8','15','2026','Aug'], a:0, why:'August is month 8.' },
    { q:'Which formula returns the month name?', o:['=TEXT(A2,"mmmm")','=MONTH(A2,"name")','=NAME(A2)','=MONTH(A2)+"name"'], a:0, why:'TEXT with "mmmm" returns the full month name.' },
    { q:'What range of numbers does MONTH return?', o:['1 to 12','0 to 11','1 to 31','1 to 52'], a:0, why:'Months are numbered 1 to 12.' },
    { q:'Why combine MONTH with YEAR?', o:['To keep the same month of different years apart','To make it faster','To change the format','To remove errors'], a:0, why:'Month alone would merge different years.' },
    { q:'What happens with text dates?', o:['#VALUE!','It works','0','1'], a:0, why:'MONTH needs real dates.' }
  ],
  recap:['MONTH returns 1 to 12.','Use TEXT for the month name.','Group by year and month together.']
},

/* --- day --- */
'day': {
  title:'DAY', tagline:'Return the day of the month from a date.',
  prereq:['month'],
  what:['DAY returns a number from 1 to 31.','It is the day part of a date.','The date must be a real date.'],
  why:['Check cut-off days such as the 25th for salary or billing.','Calculate day-based statistics.'],
  syntax:{ code:'=DAY(serial_number)', parts:[['serial_number','A date, or a cell that holds a date.']] },
  points:['Returns 1 to 31.','For the weekday name, use `TEXT(date, "dddd")`.','`DAY(EOMONTH(date,0))` gives the number of days in the month.','Dates stored as text give `#VALUE!`.','`WEEKDAY` gives the day of the week as a number.'],
  mistakes:['Confusing the day of the month with the day of the week.','Dates stored as text.','Forgetting leap years when calculating days manually.'],
  example:{ title:'Pulling the day from an order date', scenario:'You want the day of the month of each order.',
    table:withHl(ORD_DATES,{'B2':'find'},'Sheet: Orders'), task:'Get the day of the first order.', formula:'=DAY(B2)',
    steps:['B2 holds 15-Aug-2026.','The day part is 15.'], result:'The formula returns 15.' },
  practice:{ q:'Write a formula that returns the number of days in the month of the date in B2.', hint:'Use EOMONTH to get the last day, then DAY.', solution:'=DAY(EOMONTH(B2, 0))', explain:'EOMONTH gives 31-Aug-2026 and DAY returns 31.' },
  interview:[
    { level:'Basic', q:'What does DAY return?', a:'The day of the month, from 1 to 31.' },
    { level:'Intermediate', q:'How do you find the number of days in a month?', a:'=DAY(EOMONTH(A2,0)). EOMONTH returns the last date of the month and DAY returns its day number.' },
    { level:'Intermediate', q:'What is the difference between DAY and WEEKDAY?', a:'DAY returns the day of the month (1 to 31). WEEKDAY returns the day of the week as a number.' },
    { level:'Scenario', q:'Mark orders placed after the 25th as late-month orders. How?', a:'=IF(DAY(A2)>25, "Late month", "Regular").' }
  ],
  mcq:[
    { q:'What does `=DAY(DATE(2026,8,15))` return?', o:['15','8','2026','3'], a:0, why:'The day part is 15.' },
    { q:'Which formula gives the days in a month?', o:['=DAY(EOMONTH(A2,0))','=DAY(A2)*30','=MONTH(A2)','=DAYS(A2)'], a:0, why:'The last date of the month tells you the number of days.' },
    { q:'What range does DAY return?', o:['1 to 31','0 to 30','1 to 7','1 to 12'], a:0, why:'Days of the month go from 1 to 31.' },
    { q:'How do you show the weekday name?', o:['=TEXT(A2,"dddd")','=DAY(A2,"name")','=MONTH(A2)','=NAME(A2)'], a:0, why:'TEXT with "dddd" returns the full weekday name.' },
    { q:'What type of value does DAY return?', o:['Number','Text','Date','Boolean'], a:0, why:'A number from 1 to 31.' }
  ],
  recap:['DAY returns the day of the month.','Use TEXT(...,"dddd") for the weekday name.','DAY(EOMONTH()) gives days in a month.']
},

/* --- date --- */
'date': {
  title:'DATE', tagline:'Build a date from separate year, month and day numbers.',
  prereq:['day'],
  what:['DATE combines a year, month and day into one real date.','It handles overflow, such as month 13.','It is the safest way to create dates in formulas.'],
  why:['Build dates from separate columns in an import.','Calculate dates, such as the first day of next month.'],
  syntax:{ code:'=DATE(year, month, day)', parts:[['year','The year, such as 2026.'],['month','The month number. 13 means January of the next year.'],['day','The day number. 0 means the last day of the previous month.']] },
  points:['It returns a real date that you can format as you like.','Month 13 rolls into January of the next year.','Day 0 gives the last day of the previous month.','`DATE(2026,8,1)` is the first day of a month.','Better than typing dates as text, which can be misread.'],
  mistakes:['Typing text dates that Excel reads differently on different computers.','Forgetting to format the result as a date.','Confusing month and day order.'],
  example:{ title:'Building a date from parts', scenario:'An export has year, month and day in separate columns.',
    table:withHl({rows:[['Year','Month','Day','Date'],[2026,8,15,'15-Aug-2026']]},{'A2':'find','B2':'find','C2':'find','D2':'hit'},'Sheet: Import'), task:'Build the date from A2, B2 and C2.', formula:'=DATE(A2, B2, C2)',
    steps:['Year 2026, month 8, day 15.','DATE joins them into one real date.'], result:'The formula returns 15-Aug-2026, once the cell is formatted as a date.' },
  practice:{ q:'Write a formula that returns the first day of the month of the date in B2.', hint:'Use YEAR, MONTH and day 1.', solution:'=DATE(YEAR(B2), MONTH(B2), 1)', explain:'For 15-Aug-2026, this returns 01-Aug-2026.' },
  interview:[
    { level:'Basic', q:'What does DATE do?', a:'It builds a real date from separate year, month and day numbers.' },
    { level:'Intermediate', q:'What happens if you enter month 13?', a:'Excel rolls over to January of the next year, so DATE(2026,13,1) returns 01-Jan-2027.' },
    { level:'Intermediate', q:'How do you get the last day of the previous month with DATE?', a:'=DATE(year, month, 0). A day of 0 means the day before the first day of that month.' },
    { level:'Scenario', q:'An import has dates as 20260815 in one column. How do you convert it?', a:'=DATE(LEFT(A2,4), MID(A2,5,2), RIGHT(A2,2)). LEFT, MID and RIGHT split the digits, and DATE builds the real date.' }
  ],
  mcq:[
    { q:'What does `=DATE(2026,13,1)` return?', o:['01-Jan-2027','01-Dec-2026','13-Jan-2026','An error'], a:0, why:'Month 13 rolls into January of the next year.' },
    { q:'What does day 0 mean in DATE?', o:['The last day of the previous month','The first day of the month','An error','Today'], a:0, why:'Day 0 is the day before the 1st.' },
    { q:'What does DATE return?', o:['A real date (serial number)','Text','A string of digits','A boolean'], a:0, why:'It returns a date serial you can format.' },
    { q:'Which formula gives the first day of the month of A2?', o:['=DATE(YEAR(A2),MONTH(A2),1)','=DATE(A2,1,1)','=DAY(A2)','=MONTH(A2)'], a:0, why:'Keep the year and month and set the day to 1.' },
    { q:'Why use DATE instead of typing a date as text?', o:['Text can be read differently on other computers','It is shorter','It changes the year','It adds spaces'], a:0, why:'DATE is not affected by regional settings.' }
  ],
  recap:['DATE builds a real date from year, month and day.','Month 13 rolls over; day 0 is the last day of the previous month.','Use it to convert imports and build month starts.']
},

/* --- datedif --- */
'datedif': {
  title:'DATEDIF', tagline:'Count complete years, months or days between two dates.',
  prereq:['today','date'],
  what:['DATEDIF returns the difference between two dates in years, months or days.','It counts only **complete** units.','It is a hidden function: it does not appear in the function suggestions, but it works.'],
  why:['Calculate age, tenure and contract length.','HR and finance reports use it often.'],
  syntax:{ code:'=DATEDIF(start_date, end_date, unit)', parts:[['start_date','The earlier date.'],['end_date','The later date.'],['unit','"Y" complete years, "M" complete months, "D" days, "YM" months ignoring years, "MD" days ignoring months and years, "YD" days ignoring years.']] },
  points:['The start date must be earlier than the end date, or the result is `#NUM!`.','The unit goes in quotes.','Combine units: `"Y"` and `"YM"` give years and months.','It is hidden: Excel does not suggest it while typing.','It does not count partial years.'],
  mistakes:['Putting the dates in the wrong order.','Forgetting the quotes around the unit.','Using the "MD" unit, which can give odd results in edge cases.'],
  example:{ title:'Tenure of an employee', scenario:'An employee joined on 12-Mar-2022. Suppose today is 10-Oct-2026.',
    table:withHl({rows:[['Employee','Joined','Years','Months'],['Asha','12-Mar-2022',4,6]]},{'B2':'find','C2':'hit','D2':'hit'},'Sheet: Staff'), task:'Find the tenure in years and months.', formula:'=DATEDIF(B2, TODAY(), "Y") & " years, " & DATEDIF(B2, TODAY(), "YM") & " months"',
    steps:['"Y" counts complete years: 4 (up to 12-Mar-2026).','"YM" counts the remaining complete months: 6 (up to 12-Sep-2026).'], result:'The formula returns 4 years, 6 months.' },
  practice:{ q:'Write a formula that returns the total complete months between the dates in B2 and C2.', hint:'Use the unit "M".', solution:'=DATEDIF(B2, C2, "M")', explain:'From 12-Mar-2022 to 10-Oct-2026 there are 54 complete months, because the 10th is before the 12th.' },
  interview:[
    { level:'Basic', q:'What does DATEDIF do?', a:'It returns the number of complete years, months or days between two dates, depending on the unit.' },
    { level:'Intermediate', q:'Why do we not see DATEDIF in the function list?', a:'It is a legacy function kept for compatibility. It is not suggested while typing, but it works when typed in full.' },
    { level:'Intermediate', q:'What happens if the start date is later than the end date?', a:'DATEDIF returns #NUM!. The dates must be in order.' },
    { level:'Scenario', q:'Show an employee\'s tenure as "X years, Y months". How?', a:'=DATEDIF(A2,TODAY(),"Y")&" years, "&DATEDIF(A2,TODAY(),"YM")&" months". "Y" gives complete years and "YM" gives the remaining months.' }
  ],
  mcq:[
    { q:'What does the unit "Y" return?', o:['Complete years','Total days','Months','Weekdays'], a:0, why:'"Y" counts complete years between the dates.' },
    { q:'What happens if start_date is after end_date?', o:['#NUM!','0','#DIV/0!','A negative number'], a:0, why:'DATEDIF needs the earlier date first.' },
    { q:'Which unit gives months ignoring years?', o:['"YM"','"M"','"MD"','"D"'], a:0, why:'"YM" returns the remaining months after complete years.' },
    { q:'Does Excel suggest DATEDIF while typing?', o:['No, it is hidden','Yes','Only in 365','Only on Mac'], a:0, why:'It is a legacy function, but it still works.' },
    { q:'How many complete months are between 12-Mar-2022 and 10-Oct-2026?', o:['54','55','56','52'], a:0, why:'4 years and 6 complete months, which is 54 months.' }
  ],
  recap:['DATEDIF counts complete years, months or days.','The start date must come first, and the unit is in quotes.','It is hidden but works.']
},

/* --- eomonth --- */
'eomonth': {
  title:'EOMONTH', tagline:'Return the last day of a month, before or after a date.',
  prereq:['date'],
  what:['EOMONTH returns the last day of the month for a date.','You can move forward or backward by any number of months.','The result is a date serial, so format it as a date.'],
  why:['Payment due at the end of the month.','Month-end reports and period grouping.'],
  syntax:{ code:'=EOMONTH(start_date, months)', parts:[['start_date','The starting date.'],['months','How many months to move. 0 is the same month, 1 is next month, -1 is last month.']] },
  points:['`months = 0` returns the end of the **same** month.','Positive numbers move forward, negative numbers move back.','It handles different month lengths and leap years.','Add 1 to the result to get the first day of the next month.','`EDATE` moves by months but keeps the day number.'],
  mistakes:['Forgetting to format the result as a date.','Using 1 when the same month was needed.','Using EDATE when month-end was needed.'],
  example:{ title:'Due at the end of next month', scenario:'An invoice dated 15-Aug-2026 is due at the end of the following month.',
    table:withHl({rows:[['Invoice date','Due date'],['15-Aug-2026','30-Sep-2026']]},{'A2':'find','B2':'hit'},'Sheet: Invoices'), task:'Find the due date.', formula:'=EOMONTH(A2, 1)',
    steps:['months = 1 moves to September.','EOMONTH returns the last day of September.'], result:'The formula returns 30-Sep-2026.' },
  practice:{ q:'Write a formula that returns the first day of next month for the date in A2.', hint:'Take the end of the current month and add 1.', solution:'=EOMONTH(A2, 0) + 1', explain:'The end of August is 31-Aug-2026, and adding 1 gives 01-Sep-2026.' },
  interview:[
    { level:'Basic', q:'What does EOMONTH do?', a:'It returns the last day of the month that is a given number of months before or after a date.' },
    { level:'Intermediate', q:'What does months = 0 mean?', a:'It returns the last day of the same month as the start date.' },
    { level:'Intermediate', q:'How do you get the first day of the next month?', a:'=EOMONTH(A2,0)+1. The end of the current month plus one day is the first day of the next month.' },
    { level:'Scenario', q:'Payment terms are "end of next month". How do you apply this to a column of invoice dates?', a:'=EOMONTH(A2,1) in the due date column, formatted as a date, and copy it down.' }
  ],
  mcq:[
    { q:'What does `=EOMONTH(DATE(2026,8,15), 1)` return?', o:['30-Sep-2026','31-Aug-2026','15-Sep-2026','01-Sep-2026'], a:0, why:'It moves one month forward and returns the last day.' },
    { q:'What does months = -1 do?', o:['Goes back one month','Goes forward one month','Stays in the month','Causes an error'], a:0, why:'Negative numbers move back.' },
    { q:'Which formula gives the first day of the next month?', o:['=EOMONTH(A2,0)+1','=EOMONTH(A2,1)','=DAY(A2)+1','=DATE(A2,1,1)'], a:0, why:'End of the current month plus one day.' },
    { q:'What does EOMONTH return?', o:['A date serial','Text','A day number','A month name'], a:0, why:'Format the result as a date.' },
    { q:'Which function moves by months but keeps the day?', o:['EDATE','EOMONTH','DAY','YEAR'], a:0, why:'EDATE keeps the day number, EOMONTH returns the month end.' }
  ],
  recap:['EOMONTH returns the last day of a month, shifted by months.','0 is the same month, 1 is next, -1 is previous.','Add 1 to get the first day of the next month.']
},

/* --- networkdays --- */
'networkdays': {
  title:'NETWORKDAYS', tagline:'Count working days between two dates.',
  prereq:['date'],
  what:['NETWORKDAYS counts weekdays (Monday to Friday) between two dates, including both.','It can skip a list of holidays.','Weekends are excluded.'],
  why:['Project timelines and delivery estimates.','Payroll and SLA calculations.'],
  syntax:{ code:'=NETWORKDAYS(start_date, end_date, [holidays])', parts:[['start_date','The first date, included in the count.'],['end_date','The last date, included in the count.'],['holidays','Optional. A cell or range with holiday dates to exclude.']] },
  points:['Both the start and end dates are counted when they are working days.','Saturday and Sunday are excluded.','Holidays come from a range of dates.','`NETWORKDAYS.INTL` lets you choose which days are weekends.','`WORKDAY` adds working days to a date instead of counting them.'],
  mistakes:['Forgetting the holiday list.','Expecting it to exclude the start date.','Using it for weekends that are not Saturday and Sunday.'],
  example:{ title:'Working days in a period', scenario:'A task runs from 01-Oct-2026 to 09-Oct-2026. 02-Oct-2026 is a holiday.',
    table:withHl({rows:[['Start','End','Holiday','Working days'],['01-Oct-2026','09-Oct-2026','02-Oct-2026',6]]},{'A2':'find','B2':'find','C2':'find','D2':'hit'},'Sheet: Tasks'), task:'Count the working days.', formula:'=NETWORKDAYS(A2, B2, C2)',
    steps:['From Thu 1 Oct to Fri 9 Oct, the weekdays are 1, 2, 5, 6, 7, 8 and 9: seven days.','The holiday on 2 Oct is removed.'], result:'The formula returns 6.' },
  practice:{ q:'Write a formula that counts the working days between A2 and B2 without any holiday list.', hint:'Leave out the third argument.', solution:'=NETWORKDAYS(A2, B2)', explain:'With no holidays, the result for 01-Oct-2026 to 09-Oct-2026 is 7.' },
  interview:[
    { level:'Basic', q:'What does NETWORKDAYS do?', a:'It counts working days (Monday to Friday) between two dates, including both, and can exclude holidays.' },
    { level:'Intermediate', q:'How do you handle company holidays?', a:'I keep the holidays in a range and pass it as the third argument, for example =NETWORKDAYS(A2,B2,Holidays).' },
    { level:'Intermediate', q:'What if the weekend is Friday and Saturday?', a:'I use NETWORKDAYS.INTL, which lets me choose the weekend days.' },
    { level:'Scenario', q:'You need a delivery date 10 working days after an order date. Which function?', a:'WORKDAY(A2, 10, Holidays) returns the date that many working days later. NETWORKDAYS counts days, and WORKDAY gives dates.' }
  ],
  mcq:[
    { q:'Which days does NETWORKDAYS exclude by default?', o:['Saturday and Sunday','Only Sunday','Friday','Only holidays'], a:0, why:'The default weekend is Saturday and Sunday.' },
    { q:'Are the start and end dates counted?', o:['Yes, if they are working days','No','Only the start','Only the end'], a:0, why:'Both ends are included.' },
    { q:'What does the third argument do?', o:['Excludes holidays','Adds weekends','Sets the year','Rounds the result'], a:0, why:'It lists holiday dates to exclude.' },
    { q:'Which function allows custom weekends?', o:['NETWORKDAYS.INTL','NETWORKDAYS','DAY','DATE'], a:0, why:'INTL lets you set the weekend days.' },
    { q:'Which function adds working days to a date?', o:['WORKDAY','NETWORKDAYS','EOMONTH','DATEDIF'], a:0, why:'WORKDAY returns a date; NETWORKDAYS returns a count.' }
  ],
  recap:['NETWORKDAYS counts Monday to Friday days, both ends included.','Pass holidays as a range.','Use NETWORKDAYS.INTL for custom weekends and WORKDAY to add days.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- today --- */
D('today',{ l:'Beginner', t:'TODAY returns the current date and updates every day. It is volatile, so avoid it for fixed records.',
  i:['Many questions depend on "now": how many days left, how old, is it overdue. TODAY gives the current date from your computer, so formulas that use it refresh automatically.','The flip side is that anything built on TODAY changes tomorrow, so it must not be used for dates that should stay fixed, like an invoice date.'], a:'A clock that always shows the date.',
  h:['Type `=TODAY()` with empty brackets.','Subtract dates to get days: `=B2-TODAY()`.','Use `=TODAY()+30` for a date 30 days ahead.','For a fixed date, press Ctrl + ; instead.'],
  d:[FL(['due - today'],[{ title:'Today (10-Oct-2026)', text:'volatile' },{ title:'Due 15-Oct-2026', text:'**5 days left**' }])],
  x:[X('Variation','Overdue flag','Show Overdue for past due dates.','Compare with TODAY.','=IF(B2<TODAY(), "Overdue", "OK")',['A date earlier than today is overdue.'],'The label changes at midnight with no editing.'),
     X('Business case','A fixed record versus a live one','An invoice date must never change, but ageing must.','Separate the two.','Invoice date: type or Ctrl+;\nDays outstanding: =TODAY() - B2',['The invoice date is a constant.','The ageing uses TODAY.'],'Only the ageing recalculates daily.')],
  e:[['Volatile','TODAY recalculates whenever the workbook calculates. Many volatile formulas slow big files.'],['Not for history','A record using TODAY changes every day. Use a fixed date.'],['Format after subtraction','The result of two dates may show as a date; format as Number.'],['Time zones and computer date','TODAY uses the computer clock.']],
  p:[P('Medium','Show the number of days until the date in B2.','Subtract TODAY.','=B2 - TODAY()','Format as a Number. Negative means overdue.'),
     P('Interview','A file shows different values each time it is opened. What could cause it?','Volatile functions.','TODAY, NOW, RAND or OFFSET are volatile. Replace them with fixed values where the date should not change.','Naming volatility is the key.')],
  q:[Q('Basic','What does TODAY return?','The current date, updated whenever the sheet calculates.',{ f:[['What is NOW?','TODAY plus the current time.']] }),
     Q('Scenario','How do you keep an invoice date from changing?','Enter it as a fixed value (Ctrl+;) rather than TODAY.',{ t:'TODAY is right for ageing and deadlines.' })],
  r:RT(['Need','Formula'],[['Today','`=TODAY()`'],['Days left','`=B2-TODAY()`'],['In 30 days','`=TODAY()+30`'],['Fixed date','`Ctrl + ;`']]), rel:['datedif','date','networkdays','eomonth'] });

/* --- year --- */
D('year',{ l:'Beginner', t:'YEAR returns the year of a date. It works only on real dates, not text.',
  i:['To group or filter by year you need the year as its own value. YEAR extracts it from a date.','If a date column is text, YEAR returns an error, which is a good alarm that the data needs cleaning.'], a:'Reading the year off a calendar page.',
  h:['Write `=YEAR(date)`.','The result is a number such as 2026.','Use it in COUNTIFS or SUMIFS helper columns.','For ages, prefer DATEDIF.'],
  d:[FL(['YEAR'],[{ title:'15-Aug-2026', text:'date' },{ title:'YEAR(A2)', text:'**2026**' }])],
  x:[X('Variation','The current year','Highlight orders of this year.','Compare with YEAR(TODAY()).','=IF(YEAR(B2)=YEAR(TODAY()), "This year", "Earlier")',['YEAR(TODAY()) is the current year.'],'Orders from 2026 are labelled This year.'),
     X('Business case','Sales by year','A summary needs totals per year.','Add a helper column and use SUMIFS.','Helper: =YEAR(A2)\nTotal: =SUMIFS(C:C, D:D, 2026)',['The helper gives each row its year.','SUMIFS adds by that year.'],'A pivot can also group dates by years.')],
  e:[['Text dates give #VALUE!','Convert with DATEVALUE or Text to Columns.'],['Two-digit years','Excel interprets 26 as 2026, 99 as 1999. Be explicit.'],['Approximate ages','YEAR(TODAY())-YEAR(birth) ignores the month and day.'],['Fiscal years','Calendar years differ from fiscal years. Add a helper.']],
  p:[P('Medium','Return the year of the date in B2.','YEAR.','=YEAR(B2)','15-Aug-2026 gives 2026.',withHl(ORD_DATES,{},'Sheet: Orders')),
     P('Interview','Why is YEAR(TODAY())-YEAR(A2) a poor age calculation?','Month and day.','It ignores whether the birthday has happened this year. Use DATEDIF(A2, TODAY(), "Y").','Concrete counterexample: born in December.')],
  q:[Q('Basic','What does YEAR return?','The year number of a date.',{ f:[['What if the date is text?','#VALUE!.']] }),
     Q('Scenario','Group sales by year without a pivot.','A helper column with YEAR, then SUMIFS on it.',{ t:'A pivot with date grouping is quicker.' })],
  r:RT(['Need','Formula'],[['Year','`=YEAR(A2)`'],['Current year','`=YEAR(TODAY())`'],['Age','`=DATEDIF(A2,TODAY(),"Y")`'],['Month','`=MONTH(A2)`']]), rel:['month','day','date','datedif'] });

/* --- month --- */
D('month',{ l:'Beginner', t:'MONTH returns the month number (1 to 12). Use TEXT for the month name, and combine with YEAR to avoid mixing years.',
  i:['Monthly reports need the month as a separate value. MONTH extracts it, and TEXT can turn it into a name.','The usual mistake is grouping by month alone: January 2025 and January 2026 would be merged.'], a:'Reading the month off a calendar page.',
  h:['Write `=MONTH(date)`.','The result is 1 for January and 12 for December.','Use `TEXT(date, "mmmm")` for the name.','Combine with YEAR in a helper such as `=TEXT(A2, "yyyy-mm")`.'],
  d:[FL(['MONTH'],[{ title:'15-Aug-2026', text:'date' },{ title:'MONTH(A2)', text:'**8**' }])],
  x:[X('Variation','Month name','Show August instead of 8.','Use TEXT.','=TEXT(A2, "mmmm")',['"mmmm" is the full month name, "mmm" the short one.'],'The result is August.'),
     X('Business case','A month key that sorts','Reports must sort chronologically across years.','Use a yyyy-mm key.','=TEXT(A2, "yyyy-mm")',['The key sorts correctly as text.','A pivot with date grouping gives the same result.'],'2026-08 sorts after 2025-12.')],
  e:[['Months from different years merge','Always include the year.'],['Names sort alphabetically','Sort by the number or the yyyy-mm key.'],['Text dates','MONTH gives #VALUE! on text.'],['Fiscal months','Fiscal calendars need a helper.']],
  p:[P('Medium','Return the month number of the date in B2.','MONTH.','=MONTH(B2)','Jan 3 gives 1.',withHl(ORD_DATES,{},'Sheet: Orders')),
     P('Interview','A report shows 2025 and 2026 January combined. Why?','Grouping by month only.','The month number alone loses the year. Group by year and month or use a yyyy-mm key.','Name the cause and the fix.')],
  q:[Q('Basic','What does MONTH return?','A number from 1 to 12.',{ f:[['How do you get the month name?','TEXT(date, "mmmm").']] }),
     Q('Scenario','Monthly totals across two years.','A pivot grouped by Years and Months, or a yyyy-mm helper with SUMIFS.',{ t:'The pivot is faster; the helper is explicit.' })],
  r:RT(['Need','Formula'],[['Month number','`=MONTH(A2)`'],['Month name','`=TEXT(A2,"mmmm")`'],['Sortable key','`=TEXT(A2,"yyyy-mm")`'],['Year','`=YEAR(A2)`']]), rel:['year','day','date','text'] });

/* --- day --- */
D('day',{ l:'Beginner', t:'DAY returns the day of the month (1 to 31). For the weekday name use TEXT, and for days in a month use EOMONTH.',
  i:['Day is useful for cut-offs such as "orders after the 25th" and for building dates piece by piece.','Do not confuse the day of the month with the day of the week.'], a:'Reading the number printed on a calendar square.',
  h:['Write `=DAY(date)`.','The result is 1 to 31.','Weekday name: `=TEXT(date, "dddd")`.','Days in the month: `=DAY(EOMONTH(date, 0))`.'],
  d:[FL(['DAY'],[{ title:'15-Aug-2026', text:'date' },{ title:'DAY(A2)', text:'**15**' }])],
  x:[X('Variation','Days in a month','How many days are in the month of a date?','Use EOMONTH and DAY.','=DAY(EOMONTH(A2, 0))',['EOMONTH gives the last day.','DAY of that is the month length.'],'August returns 31, and February 2028 returns 29.'),
     X('Business case','Late-month orders','Flag orders placed after the 25th.','Test the day.','=IF(DAY(A2) > 25, "Late month", "Regular")',['Only the day number matters.'],'Orders on the 26th to 31st are flagged.')],
  e:[['Day of month versus weekday','DAY is 1 to 31. WEEKDAY returns 1 to 7.'],['Text dates','Give #VALUE!.'],['Month length varies','Do not assume 30 days.'],['Leap years','EOMONTH handles 29 February.']],
  p:[P('Medium','Show the weekday name of the date in B2.','TEXT with dddd.','=TEXT(B2, "dddd")','15-Aug-2026 gives Saturday.'),
     P('Interview','Return the last day of the month for a date.','EOMONTH.','=EOMONTH(A2, 0)','Format as a date.')],
  q:[Q('Basic','What does DAY return?','The day of the month, 1 to 31.',{ f:[['What is WEEKDAY?','The day of the week as a number.']] }),
     Q('Scenario','Find the number of days in each month of a calendar table.','=DAY(EOMONTH(A2,0)) per row.',{ t:'Never hard-code 30.' })],
  r:RT(['Need','Formula'],[['Day of month','`=DAY(A2)`'],['Weekday name','`=TEXT(A2,"dddd")`'],['Days in month','`=DAY(EOMONTH(A2,0))`'],['Weekday number','`=WEEKDAY(A2)`']]), rel:['month','year','eomonth','date'] });

/* --- date --- */
D('date',{ l:'Beginner to Intermediate', t:'DATE builds a real date from year, month and day, and handles overflow, such as month 13.',
  i:['Typing a date as text can be read differently on different computers. DATE builds a genuine date from three numbers, so it is safe and flexible.','It also does arithmetic on calendar boundaries: month 13 becomes January of the next year, and day 0 becomes the last day of the previous month.'], a:'Assembling a date from three labelled pieces.',
  h:['Write `=DATE(year, month, day)`.','Give numbers (or cell references) for each part.','Month 13 rolls into January of the next year.','Day 0 returns the last day of the previous month.'],
  d:[FL(['DATE'],[{ title:'2026 | 8 | 15', text:'three numbers' },{ title:'DATE(A2, B2, C2)', text:'**15-Aug-2026**' }])],
  x:[X('Variation','First day of a month','Build the first day of the month of a date.','Keep year and month, set the day to 1.','=DATE(YEAR(A2), MONTH(A2), 1)',['DATE assembles the pieces.'],'15-Aug-2026 gives 01-Aug-2026.'),
     X('Business case','Converting text in the form 20260815','Dates arrive as 20260815.','Slice and assemble.','=DATE(LEFT(A2,4), MID(A2,5,2), RIGHT(A2,2))',['LEFT, MID and RIGHT extract the parts.','DATE builds a real date.'],'A real date that works in pivots and SUMIFS.')],
  e:[['Overflow','Month 13 or day 40 roll into later months. This is useful, but also hides typos.'],['Regional settings','Typing 08/15/2026 may be read differently. DATE is unambiguous.'],['Format','The result is a serial number. Format as a date.'],['Years below 1900','Excel cannot handle them as normal dates.']],
  p:[P('Medium','Build the date for year 2026, month 8, day 15.','DATE.','=DATE(2026, 8, 15)','The result is 15-Aug-2026.'),
     P('Interview','Return the last day of the previous month using DATE.','Day 0 trick.','=DATE(YEAR(A2), MONTH(A2), 0)','Day 0 is the day before the 1st. EOMONTH(A2,-1) is clearer.')],
  q:[Q('Basic','What does DATE do?','It builds a real date from year, month and day numbers.',{ f:[['What does month 13 give?','January of the next year.']] }),
     Q('Scenario','Convert a column of yyyymmdd numbers to dates.','=DATE(LEFT(A2,4), MID(A2,5,2), RIGHT(A2,2)) and fill down.',{ t:'Power Query can do it with a type change.' })],
  r:RT(['Need','Formula'],[['Build a date','`=DATE(y, m, d)`'],['First of month','`=DATE(YEAR(A2),MONTH(A2),1)`'],['Last of prev month','`=DATE(y, m, 0)`'],['Next year same day','`=DATE(YEAR(A2)+1,MONTH(A2),DAY(A2))`']]), rel:['year','month','day','eomonth'] });

/* --- datedif --- */
DEEP['datedif'] = {
  level:'Intermediate',
  tldr:'DATEDIF returns **complete** years, months or days between two dates. It is hidden in Excel, but it works.',
  intuition:{ text:[
    'Subtracting two dates gives a number of days, but people think in years and months: "four years and six months of service". DATEDIF converts the difference into complete units, the way a birthday works: you are not 30 until the day you turn 30.',
    'Because it counts only complete units, it avoids the rounding errors of dividing days by 365.'
  ], analogy:'A birthday cake: you only add a candle when the whole year has passed.' },
  how:[
    'Give DATEDIF a start date, an end date and a unit in quotes.',
    '`"Y"` returns complete years, `"M"` complete months, `"D"` days.',
    '`"YM"` returns the months left over after complete years, and `"YD"` the days left over after complete years.',
    'Combine units with text to build "4 years, 6 months".',
    'The start date must not be later than the end date, or the result is `#NUM!`.'
  ],
  diagrams:[
    { type:'flow', arrows:['"Y"','"YM"'], panels:[
      { title:'12-Mar-2022 to 10-Oct-2026', text:'4 years, 7 months, minus 2 days' },
      { title:'Complete years', text:'**4** (until 12-Mar-2026)' },
      { title:'Months after those years', text:'**6** (until 12-Sep-2026)' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Total complete months', scenario:'A contract fee is billed monthly, so the number of complete months is needed.', table:withHl({rows:[['Start','End','Months'],['12-Mar-2022','10-Oct-2026',54]]},{'A2':'find','B2':'find','C2':'hit'},'Sheet: Contracts'), task:'Count complete months between the dates.',
      formula:'=DATEDIF(A2, B2, "M")', steps:['From March 2022 to October 2026 there are 55 calendar months.','The end day (10) is earlier than the start day (12), so the last month is incomplete.'], result:'The formula returns 54.' },
    { level:'Business case', title:'Employee seniority bands', scenario:'HR classifies staff by complete years of service: 5 or more is Senior, 2 to 4 is Mid, less is Junior.', table:withHl({rows:[['Employee','Joined','Years','Band'],['Asha','12-Mar-2019',7,'Senior'],['Bilal','01-Jun-2024',2,'Mid'],['Chitra','15-Sep-2026',0,'Junior']]},{'B2':'find','C2':'hit','D2':'hit'},'Sheet: Staff (today = 10-Oct-2026)'),
      task:'Calculate years and the band.', formula:'=DATEDIF(B2, TODAY(), "Y")\n=IFS(C2>=5, "Senior", C2>=2, "Mid", TRUE, "Junior")', steps:['DATEDIF gives complete years of service.','IFS maps the number to a band.'], result:'Asha is Senior, Bilal is Mid and Chitra is Junior.' }
  ],
  edge:[
    { t:'Hidden function', d:'DATEDIF does not appear in the formula suggestions or the function wizard. Type it in full. It is documented as a compatibility function.' },
    { t:'Order of dates', d:'If the start date is later than the end date you get `#NUM!`. Use `MIN` and `MAX` to guard it.' },
    { t:'The "MD" unit', d:'The "MD" unit (days ignoring months) is known to give odd results in some cases. Avoid it, and compute days with date arithmetic.' },
    { t:'Month-end dates', d:'31 January to 28 February is not a complete month, so DATEDIF returns 0 months. This is correct but surprises people.' },
    { t:'Alternatives', d:'`YEARFRAC` gives fractional years. `(end - start)/365.25` is approximate. Choose based on whether you need complete units.' },
    { t:'TODAY() changes', d:'Using TODAY() makes the result change every day. For reports about a fixed date, put that date in a cell.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show an age in the form "34 years, 2 months" for a birth date in B2.', hint:'Join two DATEDIF units with text.', solution:'=DATEDIF(B2, TODAY(), "Y") & " years, " & DATEDIF(B2, TODAY(), "YM") & " months"', explain:'"Y" gives complete years, and "YM" gives the extra complete months.' },
    { level:'Interview', q:'Why is (end - start)/365 not a reliable way to calculate age or tenure?', hint:'Think about leap years and partial years.', solution:'Years are not exactly 365 days (leap years), and the division gives a fraction, so an employee a few days short of an anniversary can show as complete.\nUse DATEDIF with "Y", which counts only complete years.', explain:'The answer shows you understand why a purpose-built function exists.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you calculate age or tenure in Excel?', a:'=DATEDIF(start, TODAY(), "Y") gives complete years. Combined with "YM" for the remaining months, it gives a result like 4 years, 6 months.',
      follow:[ { q:'Why not just subtract the years?', a:'YEAR(TODAY())-YEAR(birth) ignores the month and day, so it is wrong before the birthday in the current year.' } ] },
    { level:'Intermediate', q:'What are the DATEDIF units?', a:'"Y" complete years, "M" complete months, "D" days, "YM" months ignoring years, "YD" days ignoring years, and "MD" days ignoring months and years, which I avoid because of known quirks.' },
    { level:'Scenario', q:'A contract report shows tenure changing every time the file is opened. Why, and how do you fix it?', a:'It uses TODAY(), which recalculates daily. For a report as of a particular date, I put that date in an input cell and use it instead of TODAY().' }
  ],
  ref:{ headers:['Unit','Returns'], rows:[['`"Y"`','Complete years'],['`"M"`','Complete months'],['`"D"`','Days'],['`"YM"`','Months after complete years'],['`"YD"`','Days after complete years']] },
  related:['today','date','eomonth','networkdays']
};

/* --- eomonth --- */
DEEP['eomonth'] = {
  level:'Intermediate',
  tldr:'EOMONTH returns the **last day of a month**, shifted by any number of months. Add 1 to get the first day of the next month.',
  intuition:{ text:[
    'Months have different lengths, which makes date arithmetic with "30 days" unreliable. Business rules usually talk in month ends: invoices due at the end of next month, reports for the period ending 30 September. EOMONTH handles the calendar, including leap years, so you do not have to.',
    'It also gives you the building blocks of any reporting period: the first day is the previous month end plus one, and the last day is EOMONTH of the same month.'
  ], analogy:'A calendar that always knows where the month ends.' },
  how:[
    'Give EOMONTH a date and a number of months.',
    '0 returns the end of the same month, 1 the end of the next month, -1 the end of the previous month.',
    'The result is a date serial number, so format the cell as a date.',
    'First day of a month: `EOMONTH(date, -1) + 1`.',
    'First day of next month: `EOMONTH(date, 0) + 1`.'
  ],
  diagrams:[
    { type:'flow', arrows:['',''], panels:[
      { title:'Date', text:'15-Aug-2026' },
      { title:'EOMONTH(date, 0)', text:'31-Aug-2026' },
      { title:'EOMONTH(date, 1)', text:'30-Sep-2026' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'The first and last day of a report month', scenario:'A report picks any date in a month, and needs the period start and end.', table:withHl({rows:[['Picked date','Start','End'],['15-Aug-2026','01-Aug-2026','31-Aug-2026']]},{'A2':'find','B2:C2':'hit'},'Sheet: Report'), task:'Calculate both ends.', formula:'Start: =EOMONTH(A2, -1) + 1\nEnd:   =EOMONTH(A2, 0)', steps:['The end of the previous month, plus one day, is the first day of this month.','EOMONTH with 0 is the end of this month.'], result:'These two cells can feed SUMIFS with ">="&B2 and "<="&C2.' },
    { level:'Business case', title:'Payment due dates by terms', scenario:'A finance sheet needs the due date for three payment terms: net 30 days, end of month, and end of next month.', table:withHl({rows:[['Invoice date','Net 30','End of month','End of next month'],['15-Aug-2026','14-Sep-2026','31-Aug-2026','30-Sep-2026']]},{'A2':'find','B2:D2':'hit'},'Sheet: Invoices'),
      task:'Write the three formulas.', formula:'Net 30:           =A2 + 30\nEnd of month:     =EOMONTH(A2, 0)\nEnd of next month: =EOMONTH(A2, 1)', steps:['Adding 30 days moves 15 August to 14 September.','EOMONTH gives calendar month ends, whatever their length.'], result:'Each term gives a different due date, built from reliable date logic.' }
  ],
  edge:[
    { t:'Format as a date', d:'EOMONTH returns a serial number such as 46265. Format the cell as a date or you will see the number.' },
    { t:'Leap years', d:'EOMONTH handles 29 February correctly. `EOMONTH("15-Feb-2028", 0)` returns 29-Feb-2028.' },
    { t:'EOMONTH versus EDATE', d:'EDATE adds months and keeps the day: 31-Jan plus 1 month is 28-Feb (or 29). EOMONTH returns the month end.' },
    { t:'Text dates', d:'Dates stored as text can return `#VALUE!`. Convert them first.' },
    { t:'Days in a month', d:'`=DAY(EOMONTH(A2, 0))` returns the number of days in that month.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the number of days between a date in A2 and the end of its month.', hint:'Subtract the date from EOMONTH.', solution:'=EOMONTH(A2, 0) - A2', explain:'For 15-Aug-2026 the result is 16 (31 minus 15).' },
    { level:'Interview', q:'Sum the sales of a whole month for the date in F1, from a list with dates in A and amounts in B.', hint:'Use the first and last day with SUMIFS.', solution:'=SUMIFS(B:B, A:A, ">="&(EOMONTH(F1,-1)+1), A:A, "<="&EOMONTH(F1,0))', explain:'The period starts the day after the previous month ends and finishes on the month end. This pattern avoids hard-coding days such as 30 or 31.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does EOMONTH do?', a:'It returns the last day of the month that is a given number of months before or after a date. EOMONTH(date, 0) is the end of the same month.',
      follow:[ { q:'How do you get the first day of the month?', a:'EOMONTH(date, -1) + 1.' } ] },
    { level:'Intermediate', q:'EOMONTH versus EDATE?', a:'EDATE moves by months and keeps the day of the month, so it can land on the 28th for 31 January plus a month. EOMONTH always returns a month end.' },
    { level:'Scenario', q:'Build monthly reporting periods for a year in one column.', a:'Put the first month start in A2, then A3 as =EOMONTH(A2,0)+1 and copy down. A second column with =EOMONTH(A2,0) gives the period ends. Both feed SUMIFS or COUNTIFS.' }
  ],
  ref:{ headers:['Need','Formula'], rows:[['End of this month','`EOMONTH(d, 0)`'],['End of next month','`EOMONTH(d, 1)`'],['First day of this month','`EOMONTH(d, -1) + 1`'],['First day of next month','`EOMONTH(d, 0) + 1`'],['Days in month','`DAY(EOMONTH(d, 0))`']] },
  related:['date','datedif','networkdays','today']
};

/* --- networkdays --- */
DEEP['networkdays'] = {
  level:'Intermediate',
  tldr:'NETWORKDAYS counts working days between two dates, both included, skipping weekends and an optional list of holidays.',
  intuition:{ text:[
    'Delivery promises, SLAs and project plans are measured in working days, not calendar days. A task that starts on Thursday and ends on the following Monday spans five calendar days but only three working days.',
    'NETWORKDAYS does the counting, and WORKDAY goes the other way: given a start date and a number of working days, it returns the finish date.'
  ], analogy:'A calendar with the weekends and holidays crossed out.' },
  how:[
    'Give NETWORKDAYS a start date and an end date. Both are counted when they are working days.',
    'Saturdays and Sundays are excluded by default.',
    'Add a range of holiday dates as the third argument to skip them as well.',
    'For other weekend patterns, use `NETWORKDAYS.INTL`.',
    'To find an end date instead, use `WORKDAY(start, days, holidays)`.'
  ],
  diagrams:[
    { type:'flow', arrows:[''], panels:[
      { title:'1-Oct to 9-Oct 2026', rows:[['Date','Day','Counted?'],['01-Oct','Thu','Yes'],['02-Oct','Fri','Holiday'],['03-Oct','Sat','No'],['04-Oct','Sun','No'],['05-Oct','Mon','Yes'],['06-Oct','Tue','Yes'],['07-Oct','Wed','Yes'],['08-Oct','Thu','Yes'],['09-Oct','Fri','Yes']], hl:{2:'miss',3:'range',4:'range'}, note:'6 working days (7 without the holiday).' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'WORKDAY: the finish date', scenario:'A task takes 5 working days from 1 October 2026, and 2 October is a holiday.', table:withHl({rows:[['Start','Days','Holiday','Finish'],['01-Oct-2026',5,'02-Oct-2026','09-Oct-2026']]},{'D2':'hit'},'Sheet: Plan'), task:'Find the finish date.', formula:'=WORKDAY(A2, B2, C2)',
      steps:['Counting starts the day after the start date.','The working days are 5, 6, 7, 8 and 9 October (the 2nd is a holiday).'], result:'The formula returns 09-Oct-2026.' },
    { level:'Business case', title:'Support tickets: working days to resolution', scenario:'A ticket was opened on 1 October and closed on 9 October. The SLA counts elapsed working days, excluding the day it was opened.', table:withHl({rows:[['Opened','Closed','Working days'],['01-Oct-2026','09-Oct-2026',6]]},{'C2':'hit'},'Sheet: Tickets (holiday on 02-Oct)'), task:'Calculate elapsed working days.',
      formula:'=NETWORKDAYS(A2, B2, Holidays) - 1', steps:['NETWORKDAYS counts both ends, so the result is 6 working days with the holiday excluded.','Subtract 1 to exclude the day it was opened, as the SLA defines.'], result:'The ticket was resolved after 5 elapsed working days. Define clearly whether the start date counts.' }
  ],
  edge:[
    { t:'Both ends are counted', d:'Same-day start and end gives 1 on a working day. Subtract 1 if you want elapsed days.' },
    { t:'Holidays must be real dates', d:'A holiday list stored as text is ignored. Use a range of true dates.' },
    { t:'Different weekends', d:'For Friday-Saturday weekends, use `NETWORKDAYS.INTL(start, end, 7, holidays)`.' },
    { t:'Negative results', d:'If the end date is before the start date, NETWORKDAYS returns a negative number.' },
    { t:'Half days and hours', d:'NETWORKDAYS only counts whole days. For hours, combine with time calculations.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show the delivery date for an order placed on A2 with a 10 working-day lead time, skipping weekends and the holidays in H2:H10.', hint:'WORKDAY.', solution:'=WORKDAY(A2, 10, $H$2:$H$10)', explain:'The counting starts from the next working day. Keep the holiday list in a dedicated range for every formula to share.' },
    { level:'Interview', q:'A report counts a 1 January to 31 January period as 31 days, but the business says there were 21 working days. Which functions explain the difference, and what could still differ?', hint:'Weekends and holidays.', solution:'NETWORKDAYS(1-Jan, 31-Jan, holidays) counts weekdays and skips holidays.\nStill different: company-specific closures, half days, and regions with different weekend patterns (use NETWORKDAYS.INTL).', explain:'Showing you check definitions and local calendars is more valuable than quoting the formula.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you count working days between two dates?', a:'=NETWORKDAYS(start, end, holidays). It counts Monday to Friday, including both dates, and skips any dates listed as holidays.',
      follow:[ { q:'How do you add working days to a date?', a:'WORKDAY(start, days, holidays).' } ] },
    { level:'Intermediate', q:'The weekend in a country is Friday and Saturday. What do you use?', a:'NETWORKDAYS.INTL and WORKDAY.INTL, which let me choose which days are weekends, for example weekend code 7 for Friday-Saturday.' },
    { level:'Scenario', q:'Calculate whether each ticket met a 5 working-day SLA.', a:'=IF(NETWORKDAYS(opened, closed, Holidays) - 1 <= 5, "Met", "Breached"). I define in writing whether the opening day counts, because it changes results.',
      tradeoff:'A simple rule is easy to audit, but check it with business owners, since different teams define SLAs differently.' }
  ],
  ref:{ headers:['Function','Returns'], rows:[['`NETWORKDAYS(s, e, h)`','Number of working days, both ends included'],['`WORKDAY(s, n, h)`','The date n working days after s'],['`NETWORKDAYS.INTL`','Same, with custom weekends'],['`WORKDAY.INTL`','Same, with custom weekends']] },
  related:['eomonth','today','datedif','date']
};
})();
