/* Datapath | Cleaning, EDA and case studies | lessons.js
 * Course manifest: lesson order and sections. Lesson content is in content.js.
 */
window.Datapath.registerCourse({
  id:'cases',
  title:'Cleaning, EDA and case studies',
  planned:'22 lessons',
  open:true,
  blurb:'Prepare trustworthy data, explore patterns and work through realistic analyst case studies.',
  sections:[
    { title:'Prepare reliable data', lessons:[
      'case-analysis-workflow','case-first-audit','case-grain-keys','case-data-types',
      'case-missing-values','case-duplicates','case-standardize','case-validity-outliers',
      'case-join-quality'
    ]},
    { title:'Explore and explain the data', lessons:[
      'case-eda-questions','case-distributions','case-group-comparisons',
      'case-time-trends','case-relationships','case-visual-choice','case-communicate'
    ]},
    { title:'Apply the workflow to cases', lessons:[
      'case-retail-clean','case-retail-eda','case-subscription-churn',
      'case-delivery-delays','case-marketing-test','case-capstone'
    ]}
  ]
});