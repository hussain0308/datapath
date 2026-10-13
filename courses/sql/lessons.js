/* Datapath | SQL | lessons.js
 * Course manifest: the title, summary and the ordered list of sections and lesson ids for SQL.
 * This file decides WHAT appears in the sidebar and in what order. The lesson content itself lives in the
 * topic files of this folder (each lesson id listed below is defined in exactly one of them).
 */
window.Datapath.registerCourse({
  id:'sql',
  title:'SQL',
  planned:'94 lessons',
  blurb:'Queries, joins, subqueries, window functions, database design and interview patterns.',
  sections:[
    { title:'SQL foundations', lessons:['sql-intro','sql-data-types','primary-key','foreign-key','sql-command-types'] },
    { title:'Querying data', lessons:['select','select-distinct','where','sql-and-or-not','in-sql','between-sql','like-sql','is-null','order-by','limit-sql','aliases'] },
    { title:'Aggregate functions', lessons:['count-sql','count-distinct','sum-sql','avg-sql','max-sql','min-sql','group-by','having'] },
    { title:'String functions', lessons:['upper-sql','lower-sql','length-sql','substring-sql','concat-sql','trim-sql','replace-sql'] },
    { title:'Numeric functions', lessons:['round-sql','ceil-sql','floor-sql','mod-sql'] },
    { title:'Date functions', lessons:['now-curdate','year-sql','month-sql','date-format','datediff','date-add'] },
    { title:'NULLs, CASE and CAST', lessons:['coalesce','ifnull','nullif','case-when','cast-sql'] },
    { title:'Joins', lessons:['inner-join','left-join','right-join','full-outer-join','cross-join','self-join','multiple-joins'] },
    { title:'Set operations', lessons:['union','union-all','intersect-except'] },
    { title:'Subqueries and CTEs', lessons:['subquery-where','derived-table','correlated-subquery','exists-sql','any-all','cte','recursive-cte'] },
    { title:'Window functions', lessons:['window-intro','row-number','rank-sql','dense-rank','ntile','lag','lead','first-value','running-total','moving-average'] },
    { title:'Creating and changing data', lessons:['create-table','alter-table','drop-truncate','insert-into','update-sql','delete-sql','constraints','indexes','views','transactions'] },
    { title:'Design and performance', lessons:['normalization','execution-order','query-optimization','stored-procedures'] },
    { title:'Interview patterns', lessons:['second-highest','top-n-per-group','find-duplicates','customers-without-orders','month-over-month','pivot-with-case','delete-duplicate-rows'] }
  ]
});
