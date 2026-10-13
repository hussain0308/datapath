/* Datapath | Analytics foundations | lessons.js
 * Course manifest: sections and the ordered list of foundational lesson ids.
 */
window.Datapath.registerCourse({
  id:'foundations',
  title:'Analytics foundations',
  planned:'6 lessons',
  open:true,
  blurb:'Frame an analysis, understand its data, explore evidence and communicate a useful result.',
  sections:[
    { title:'Start with the decision', lessons:[
      'foundation-analysis-workflow','foundation-measurable-question'
    ]},
    { title:'Understand your data', lessons:[
      'foundation-grain-and-metrics','foundation-data-audit'
    ]},
    { title:'Explore and explain', lessons:[
      'foundation-exploratory-analysis','foundation-communicate-evidence'
    ]}
  ]
});
