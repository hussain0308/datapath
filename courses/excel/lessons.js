/* Datapath | Excel | lessons.js
 * Course manifest: the title, summary and the ordered list of sections and lesson ids for Excel.
 * This file decides WHAT appears in the sidebar and in what order. The lesson content itself lives in the
 * topic files of this folder (each lesson id listed below is defined in exactly one of them).
 */
window.Datapath.registerCourse({
  id:'excel',
  title:'Excel',
  planned:'84 lessons',
  open:true,
  blurb:'Formulas, lookups, text and date functions, pivots, charts, Power Query and macros.',
  sections:[
    { title:'Excel basics', lessons:['cell-references','sum','average','count','counta','max','min'] },
    { title:'Math and ranking', lessons:['round','rank','large','small','sumproduct','subtotal'] },
    { title:'Logical functions', lessons:['if','nested-if','ifs','and','or','not','if-and-or','iferror'] },
    { title:'Lookup functions', lessons:['vlookup','hlookup','xlookup','index','match','index-match','lookup-compare'] },
    { title:'Conditional math', lessons:['criteria','countif','countifs','sumif','sumifs','averageif','averageifs','maxifs','minifs'] },
    { title:'Text functions', lessons:['left','right','mid','len','trim','upper','lower','proper','concat','textjoin','substitute','find','text'] },
    { title:'Date functions', lessons:['today','year','month','day','date','datedif','eomonth','networkdays'] },
    { title:'Dynamic arrays', lessons:['unique','filter-function','sort-function'] },
    { title:'Sorting, cleaning and formatting', lessons:['sort','filter','remove-duplicates','text-to-columns','flash-fill','find-replace','data-validation','conditional-formatting'] },
    { title:'Tables and names', lessons:['excel-tables','named-ranges'] },
    { title:'PivotTables', lessons:['pivot-basics','pivot-fields','pivot-grouping','slicers','calculated-field'] },
    { title:'Charts and dashboards', lessons:['column-chart','line-chart','pie-chart','combo-chart','dashboard'] },
    { title:'Power Query and macros', lessons:['power-query','macros','vba-basics'] }
  ]
});
