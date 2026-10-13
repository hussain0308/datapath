/* Datapath | Excel | Logical functions
 * Lessons in this file: if, nested-if, ifs, and, or, not, if-and-or, iferror
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
  const { PRODUCTS, MARKS_RESULT, GRADES, TWO_SUBJECTS, CUSTOMERS, EMAILS, LOANS, UNITS } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- if --- */
'if': {
  title:'IF', tagline:'Make a formula choose between two results based on a condition.',
  prereq:[],
  what:[
    'IF tests a condition and returns one result when it is TRUE and another when it is FALSE.',
    'It is how a spreadsheet makes a decision.',
    'Example: show Pass when marks are 50 or more, otherwise show Fail.',
    'Most other logical functions are used together with IF.'
  ],
  why:[
    'Label data automatically, such as Pass or Fail, Late or On time, High or Low.',
    'Calculate different values by case, such as a bonus only when a target is met.',
    'Flag rows that need attention in a report.'
  ],
  syntax:{ code:'=IF(logical_test, value_if_true, [value_if_false])', parts:[
    ['logical_test','A condition that is either TRUE or FALSE, such as B2>=50.'],
    ['value_if_true','What to return when the condition is TRUE.'],
    ['value_if_false','Optional. What to return when the condition is FALSE.']
  ]},
  points:[
    'Comparison operators: `=` equal, `<>` not equal, `>` greater, `<` less, `>=` greater or equal, `<=` less or equal.',
    'Text results go inside double quotes, like `"Pass"`. Numbers do not.',
    'If you leave out value_if_false and the test is FALSE, the cell shows `FALSE`.',
    'The results can be calculations, such as `B2*0.05`.',
    'Use `""` as a result to show an empty-looking cell.',
    'Text comparison is not case sensitive: "pass" equals "PASS".'
  ],
  mistakes:[
    'Forgetting the double quotes around text results.',
    'Using `>` when you meant `>=`, which changes the result for the boundary value.',
    'Comparing a number with a number stored as text.',
    'Missing a closing bracket.'
  ],
  example:{
    title:'Showing Pass or Fail',
    scenario:'A teacher has marks in column B and wants column C to show Pass for 50 or more, otherwise Fail.',
    table:withHl(MARKS_RESULT,{'B4':'find','C4':'hit'},'Sheet: Marks'),
    task:'Work out the result for Chitra (row 4).',
    formula:'=IF(B4>=50, "Pass", "Fail")',
    steps:[
      'Test: B4>=50 checks whether the marks are 50 or more.',
      'Chitra has 45, so the test is FALSE.',
      'Excel returns the third argument, "Fail".'
    ],
    result:'The formula returns Fail.'
  },
  practice:{
    q:'A sales sheet has the sales amount in column B. Write a formula for row 2 that shows "Yes" when sales are 100000 or more, and "No" otherwise.',
    table:withHl({rows:[['Rep','Sales'],['Ravi',120000],['Meera',85000]]},{},'Sheet: Sales'),
    hint:'The test is B2>=100000. Put the text results in double quotes.',
    solution:'=IF(B2>=100000, "Yes", "No")',
    explain:'For Ravi, 120000 is at least 100000, so the result is Yes. Copied down to row 3, the same formula returns No for Meera.'
  },
  interview:[
    { level:'Basic', q:'What does the IF function do?',
      a:'IF checks a condition and returns one value if the condition is TRUE and another value if it is FALSE. For example, =IF(B2>=50,"Pass","Fail") labels each student based on marks.' },
    { level:'Basic', q:'What happens if you leave out the value_if_false argument?',
      a:'If the condition is FALSE, the cell shows the word FALSE. If I want a blank-looking cell instead, I use "" as the third argument.' },
    { level:'Intermediate', q:'Can IF return a calculation instead of text?',
      a:'Yes. Either result can be a formula. For example, =IF(B2>=100000, B2*0.05, 0) returns a 5 percent commission when sales reach the target, and 0 otherwise.' },
    { level:'Scenario', q:'You have due dates in column C and delivery dates in column D. How do you flag late deliveries?',
      a:'I would use =IF(D2>C2, "Late", "On time") and copy it down. A delivery date after the due date means the delivery was late. I would also decide what to show for rows with no delivery date yet, for example by checking for a blank first.' }
  ],
  mcq:[
    { q:'What does `=IF(A1>10, "High", "Low")` return when A1 is 7?', o:['High','Low','FALSE','An error'], a:1,
      why:'7 is not greater than 10, so the test is FALSE and Excel returns the third argument, "Low".' },
    { q:'Which argument of IF runs when the condition is FALSE?', o:['logical_test','value_if_true','value_if_false','None of them'], a:2,
      why:'The third argument is the FALSE result.' },
    { q:'What does IF show when the condition is FALSE and the third argument is left out?', o:['0','An empty cell','FALSE','#N/A'], a:2,
      why:'Excel returns the logical value FALSE.' },
    { q:'Which operator means "not equal to"?', o:['!=','<>','=!','><'], a:1,
      why:'In Excel, <> means not equal to.' },
    { q:'How should a text result be written inside IF?', o:['In double quotes','In square brackets','With a dollar sign','No special marks'], a:0,
      why:'Text must be inside double quotes, otherwise Excel treats it as a name and shows #NAME?.' }
  ],
  recap:[
    'IF returns one result when a condition is TRUE and another when it is FALSE.',
    'Put text results in double quotes, and use >= or > carefully at boundaries.',
    'Either result can be a calculation, not just text.'
  ]
},

/* --- nested-if --- */
'nested-if': {
  title:'Nested IF', tagline:'Put one IF inside another to check several conditions in order.',
  prereq:['if'],
  what:[
    'A nested IF places an IF inside the false part of another IF.',
    'It lets one formula choose between **more than two** results.',
    'Excel checks the conditions from left to right and stops at the first one that is TRUE.',
    'Example: grade A for 90 and above, B for 75 and above, C for 50 and above, otherwise Fail.'
  ],
  why:[
    'Grading, commission slabs, delivery fees and priority labels need more than two outcomes.',
    'It is a classic interview topic, and reading nested formulas is a daily skill.'
  ],
  syntax:{ code:'=IF(test1, result1, IF(test2, result2, IF(test3, result3, else_result)))', parts:[
    ['test1','The first condition. If TRUE, Excel returns result1 and stops.'],
    ['IF(test2, ...)','Placed in the false part of the first IF. It runs only when test1 is FALSE.'],
    ['else_result','What to return when none of the conditions is TRUE.']
  ]},
  points:[
    '**Order matters.** Excel returns the result of the first TRUE test.',
    'Start with the strictest condition, such as the highest threshold.',
    'Each IF needs its own closing bracket, so three IFs end with three brackets.',
    'The last false result covers everything not matched earlier.',
    'Excel allows up to 64 levels, but more than three or four becomes hard to read.',
    'For many conditions, IFS or a lookup table is easier to maintain.'
  ],
  mistakes:[
    'Testing the lowest threshold first, which catches everything and hides the later tests.',
    'Missing or extra closing brackets.',
    'Forgetting the final else result.',
    'Hard-coding slabs in many cells instead of keeping them in a table.'
  ],
  example:{
    title:'Grading students',
    scenario:'Marks are in column B. Grades: 90 or more is A, 75 or more is B, 50 or more is C, below 50 is Fail.',
    table:withHl(GRADES,{'B2':'find','C2':'hit'},'Sheet: Grades'),
    task:'Work out the grade for Asha (row 2, marks 82).',
    formula:'=IF(B2>=90, "A", IF(B2>=75, "B", IF(B2>=50, "C", "Fail")))',
    steps:[
      'Is 82 >= 90? No, so move to the next IF.',
      'Is 82 >= 75? Yes, so return "B" and stop.',
      'The remaining tests are never checked.'
    ],
    result:'The formula returns B.'
  },
  practice:{
    q:'A delivery fee rule: orders of 1000 or more are free (0), orders of 500 or more cost 40, and all other orders cost 80. Write a nested IF for row 2.',
    table:withHl({rows:[['Order','Value'],['O-1',700],['O-2',1200]]},{},'Sheet: Orders'),
    hint:'Start with the highest threshold, 1000, then 500, and use 80 as the final result.',
    solution:'=IF(B2>=1000, 0, IF(B2>=500, 40, 80))',
    explain:'For 700: is 700 >= 1000? No. Is 700 >= 500? Yes, so the fee is 40.'
  },
  interview:[
    { level:'Basic', q:'What is a nested IF?',
      a:'A nested IF is an IF function placed inside another IF, usually in the false argument, so that one formula can test several conditions in order and return more than two results.' },
    { level:'Intermediate', q:'Why does the order of conditions matter in a nested IF?',
      a:'Excel stops at the first TRUE test. If I tested B2>=50 before B2>=90, a score of 95 would return the result for 50 and the 90 test would never run. So I start with the strictest condition.' },
    { level:'Intermediate', q:'What are the drawbacks of long nested IFs, and what can you use instead?',
      a:'They are hard to read, easy to break with a bracket mistake, and hard to update when rules change. For a few conditions I use IFS, and for many slabs I keep the rules in a table and use a lookup with approximate match.' },
    { level:'Scenario', q:'Commission slabs change every quarter. How would you build the commission formula?',
      a:'I would not hard-code the slabs in a nested IF. I would store the slab starting points and rates in a small table and use VLOOKUP with approximate match, or XLOOKUP with match_mode -1. When the slabs change, I only edit the table.' }
  ],
  mcq:[
    { q:'What does Excel do when a test in a nested IF is TRUE?', o:['Checks all remaining tests too','Returns that result and stops','Returns an error','Returns the last result'], a:1,
      why:'Excel returns the result of the first TRUE test and ignores the rest.' },
    { q:'`=IF(A1>=50, "C", IF(A1>=90, "A", "Fail"))` is used with A1 = 95. What does it return?', o:['A','C','Fail','#VALUE!'], a:1,
      why:'95 is at least 50, so the first test is TRUE and it returns C. The conditions are in the wrong order.' },
    { q:'Where does the next IF go in a nested IF?', o:['In the logical_test','In the value_if_false argument','After the closing bracket','In a separate cell'], a:1,
      why:'The next IF handles everything the first test did not match, so it goes in the false argument.' },
    { q:'Which function is a cleaner alternative when you have many conditions?', o:['IFS','COUNT','LEN','ROUND'], a:0,
      why:'IFS lists the conditions one after another without stacking brackets.' },
    { q:'How many closing brackets does a formula with three IF functions need?', o:['1','2','3','4'], a:2,
      why:'Each IF needs its own closing bracket.' }
  ],
  recap:[
    'A nested IF puts another IF in the false argument to handle more than two outcomes.',
    'Excel stops at the first TRUE test, so order the conditions from strictest to loosest.',
    'For many rules, use IFS or a lookup table instead.'
  ]
},

/* --- ifs --- */
'ifs': {
  title:'IFS', tagline:'Test several conditions in a row without stacking IFs inside each other.',
  prereq:['nested-if'],
  what:[
    'IFS checks a list of conditions in order and returns the result for the first one that is TRUE.',
    'It does the same job as a nested IF but is easier to read.',
    'Each condition is followed directly by its result.'
  ],
  why:[
    'Grade bands, slabs and priority labels become a flat list instead of a stack of brackets.',
    'Formulas are easier to check and edit.'
  ],
  syntax:{ code:'=IFS(test1, result1, test2, result2, ...)', parts:[
    ['test1, result1','The first condition and what to return if it is TRUE.'],
    ['test2, result2','The next condition and its result. You can add more pairs.'],
    ['TRUE, default','Optional last pair. TRUE always passes, so it works as the else result.']
  ]},
  points:[
    'Conditions are checked **in order**, and the first TRUE one wins.',
    'IFS has no built-in else. If no condition is TRUE, it returns `#N/A`.',
    'Add `TRUE, "default"` as the last pair to cover everything else.',
    'Every test needs a result. A missing result gives an error.',
    'It is available in **Excel 2019, Excel 2021 and Microsoft 365**.',
    'Older Excel versions show `#NAME?`.'
  ],
  mistakes:[
    'Forgetting the final TRUE pair, then seeing #N/A for unmatched values.',
    'Ordering conditions from loosest to strictest, so the first test catches everything.',
    'Sending the file to someone on an older Excel version.',
    'Leaving a test without a result.'
  ],
  example:{
    title:'Grading with IFS',
    scenario:'Same grading rule as before: 90 or more A, 75 or more B, 50 or more C, otherwise Fail.',
    table:withHl(GRADES,{'B6':'find','C6':'hit'},'Sheet: Grades'),
    task:'Work out the grade for Esha (row 6, marks 58).',
    formula:'=IFS(B6>=90, "A", B6>=75, "B", B6>=50, "C", TRUE, "Fail")',
    steps:[
      '58 >= 90 is FALSE, and 58 >= 75 is FALSE.',
      '58 >= 50 is TRUE, so IFS returns "C".',
      'The final TRUE, "Fail" pair is only used when no earlier test matches.'
    ],
    result:'The formula returns C.'
  },
  practice:{
    q:'Rewrite the delivery fee rule with IFS for row 2: 1000 or more is 0, 500 or more is 40, everything else is 80.',
    table:withHl({rows:[['Order','Value'],['O-1',700],['O-2',1200]]},{},'Sheet: Orders'),
    hint:'Use TRUE, 80 as the last pair so every order gets a fee.',
    solution:'=IFS(B2>=1000, 0, B2>=500, 40, TRUE, 80)',
    explain:'For 700, the first test fails and the second passes, so the fee is 40. Without the TRUE pair, a value below 500 would give #N/A.'
  },
  interview:[
    { level:'Basic', q:'What is IFS, and how is it different from a nested IF?',
      a:'IFS checks pairs of condition and result in order and returns the first TRUE result. A nested IF does the same job by stacking IFs inside each other. IFS is flatter, so it is easier to read and edit.' },
    { level:'Intermediate', q:'What does IFS return when no condition is TRUE, and how do you handle it?',
      a:'It returns #N/A. I add TRUE as the last test with a default result, such as TRUE, "Other", so every value gets an answer.' },
    { level:'Intermediate', q:'Which Excel versions support IFS?',
      a:'Excel 2019, Excel 2021 and Microsoft 365. Older versions, such as Excel 2016 without a subscription, show #NAME?.' },
    { level:'Scenario', q:'Your workbook is shared with colleagues on an older Excel. Would you use IFS?',
      a:'No. I would use a nested IF or, better, a lookup table with approximate match, because both work in every version. I would use IFS only after confirming everyone has a supported version.' }
  ],
  mcq:[
    { q:'What does IFS return when none of the conditions is TRUE?', o:['0','An empty cell','#N/A','FALSE'], a:2,
      why:'IFS has no default result, so you get #N/A unless you add a TRUE pair.' },
    { q:'Which trick gives IFS a default result?', o:['End with TRUE and a result','End with FALSE and a result','Add an extra IF','Use quotation marks'], a:0,
      why:'TRUE always passes, so the last pair acts as the else.' },
    { q:'What does IFS return when several conditions are TRUE?', o:['The result of the first TRUE test','The result of the last TRUE test','All results','An error'], a:0,
      why:'Conditions are checked in order and the first TRUE one wins.' },
    { q:'Which version does NOT have IFS?', o:['Microsoft 365','Excel 2021','Excel 2019','Excel 2016 without a subscription'], a:3,
      why:'IFS arrived with Excel 2019 and Microsoft 365.' },
    { q:'What is the main benefit of IFS over nested IF?', o:['It is much faster','It has no brackets to stack, so it is easier to read','It works in all versions','It returns two results'], a:1,
      why:'The conditions sit side by side, which makes the formula easier to read and edit.' }
  ],
  recap:[
    'IFS lists condition and result pairs and returns the first TRUE one.',
    'End with TRUE and a default result to avoid #N/A.',
    'It needs Excel 2019, 2021 or Microsoft 365.'
  ]
},

/* --- and --- */
'and': {
  title:'AND', tagline:'Check that every condition is TRUE at the same time.',
  prereq:['if'],
  what:[
    'AND returns TRUE only when **all** of its conditions are TRUE.',
    'If even one condition is FALSE, AND returns FALSE.',
    'On its own it returns only TRUE or FALSE, so it is normally placed inside IF.'
  ],
  why:[
    'Rules often need several things to be true, such as "passed Maths and Science".',
    'It is used for eligibility checks, approvals and range checks.'
  ],
  syntax:{ code:'=AND(logical1, [logical2], ...)', parts:[
    ['logical1','The first condition.'],
    ['logical2, ...','Optional. More conditions, up to 255.']
  ]},
  points:[
    'AND is TRUE only if **every** condition is TRUE.',
    'It returns the logical values `TRUE` or `FALSE`, not text.',
    'Use it inside IF: `=IF(AND(B2>=40, C2>=40), "Pass", "Fail")`.',
    'Range check: `=AND(A1>=10, A1<=20)` tests that a value is between 10 and 20.',
    'Excel has no word AND between conditions. Always write the function.',
    'You cannot chain comparisons like `10<=A1<=20`.'
  ],
  mistakes:[
    'Writing `IF(B2>=40 AND C2>=40, ...)`, which is not valid Excel.',
    'Chaining a range check as `10<=A1<=20`, which gives the wrong answer.',
    'Using AND when the rule really needs OR.',
    'Forgetting that one FALSE makes the whole AND FALSE.'
  ],
  example:{
    title:'Passing only if both subjects are 40 or more',
    scenario:'A student passes only if Maths and Science are both at least 40.',
    table:withHl(TWO_SUBJECTS,{'B3':'find','C3':'find','D3':'hit'},'Sheet: Results'),
    task:'Work out the result for Bilal (row 3: Maths 35, Science 80).',
    formula:'=IF(AND(B3>=40, C3>=40), "Pass", "Fail")',
    steps:[
      'B3>=40 is FALSE, because 35 is below 40.',
      'C3>=40 is TRUE, because 80 is at least 40.',
      'AND needs both to be TRUE, so AND returns FALSE and IF returns "Fail".'
    ],
    result:'The formula returns Fail.'
  },
  practice:{
    q:'A bonus is given only when sales are 100000 or more AND the rating is 4 or more. Write a formula for row 2 that shows "Eligible" or "Not eligible".',
    table:withHl({rows:[['Rep','Sales','Rating'],['Ravi',120000,4.5],['Meera',130000,3.8]]},{},'Sheet: Performance'),
    hint:'Put both tests inside AND, and put AND inside IF.',
    solution:'=IF(AND(B2>=100000, C2>=4), "Eligible", "Not eligible")',
    explain:'Ravi meets both tests, so the result is Eligible. Meera (row 3) has a rating of 3.8, so the same formula returns Not eligible.'
  },
  interview:[
    { level:'Basic', q:'What does the AND function return?',
      a:'AND returns TRUE only if all of its conditions are TRUE, and FALSE if any one is FALSE.' },
    { level:'Intermediate', q:'Why is AND usually combined with IF?',
      a:'AND on its own only returns TRUE or FALSE. Placing it in the logical_test of IF lets me return a useful result, such as Pass or Eligible, when several conditions are true together.' },
    { level:'Intermediate', q:'How do you check that a value in A1 is between 10 and 20?',
      a:'=AND(A1>=10, A1<=20). I cannot write 10<=A1<=20 in Excel, because that chain does not work as expected.' },
    { level:'Scenario', q:'HR says an employee is eligible for a promotion if tenure is at least 2 years and the rating is at least 3. How do you build it?',
      a:'I use =IF(AND(C2>=2, D2>=3), "Eligible", "Not eligible"), with tenure in column C and rating in column D. I also keep the thresholds in separate cells so HR can change them without editing the formula.' }
  ],
  mcq:[
    { q:'What does `=AND(TRUE, FALSE)` return?', o:['TRUE','FALSE','0','An error'], a:1,
      why:'AND needs every condition to be TRUE. One FALSE makes the result FALSE.' },
    { q:'When does AND return TRUE?', o:['When at least one condition is TRUE','When all conditions are TRUE','When no condition is TRUE','Always'], a:1,
      why:'AND is strict: all conditions must be TRUE.' },
    { q:'What does `=AND(5>3, 10<20)` return?', o:['TRUE','FALSE','5','#VALUE!'], a:0,
      why:'Both comparisons are TRUE.' },
    { q:'Which formula checks that A1 is between 10 and 20 (inclusive)?', o:['=10<=A1<=20','=AND(A1>=10, A1<=20)','=IF(A1 AND 10, 20)','=BETWEEN(A1,10,20)'], a:1,
      why:'Excel needs two separate comparisons inside AND.' },
    { q:'What does AND return when used alone in a cell?', o:['Text','A number','TRUE or FALSE','The first condition'], a:2,
      why:'AND returns a logical value. Use IF around it to show your own text.' }
  ],
  recap:[
    'AND is TRUE only when every condition is TRUE.',
    'Combine it with IF to return real results, and use it for range checks.',
    'Excel has no AND keyword between conditions: always write AND(...).'
  ]
},

/* --- or --- */
'or': {
  title:'OR', tagline:'Check that at least one condition is TRUE.',
  prereq:['if'],
  what:[
    'OR returns TRUE when **at least one** of its conditions is TRUE.',
    'It returns FALSE only when all conditions are FALSE.',
    'Like AND, it is normally placed inside IF.'
  ],
  why:[
    'Rules often accept any of several reasons, such as "premium customer or large order".',
    'It is used for discounts, escalations and exception flags.'
  ],
  syntax:{ code:'=OR(logical1, [logical2], ...)', parts:[
    ['logical1','The first condition.'],
    ['logical2, ...','Optional. More conditions, up to 255.']
  ]},
  points:[
    'OR is TRUE if **any** condition is TRUE.',
    'OR is FALSE only if **every** condition is FALSE.',
    'It returns `TRUE` or `FALSE`, so use it inside IF to show real results.',
    'Text checks are not case sensitive: `B3="premium"` matches Premium.',
    'Compare AND and OR: AND is strict (all), OR is flexible (any).',
    'Same-column options can be written as separate tests: `OR(B2="East", B2="West")`.'
  ],
  mistakes:[
    'Using AND when the rule says "any of these".',
    'Using OR when the rule says "all of these".',
    'Forgetting the quotes around text such as "Premium".',
    'Writing `OR(B2="East","West")`, which does not test B2 against West.'
  ],
  example:{
    title:'Giving a discount for premium customers or big orders',
    scenario:'A customer gets a discount if they are Premium or their order value is 5000 or more.',
    table:withHl(CUSTOMERS,{'B3':'find','C3':'find','D3':'hit'},'Sheet: Customers'),
    task:'Work out the discount for Sneha (row 3: Regular, 6000).',
    formula:'=IF(OR(B3="Premium", C3>=5000), "Yes", "No")',
    steps:[
      'B3="Premium" is FALSE, because Sneha is Regular.',
      'C3>=5000 is TRUE, because 6000 is at least 5000.',
      'OR needs only one TRUE, so OR returns TRUE and IF returns "Yes".'
    ],
    result:'The formula returns Yes.'
  },
  practice:{
    q:'A support ticket needs escalation if its priority is "High" OR it has been open for more than 5 days. Write a formula for row 2 that shows "Escalate" or "Normal".',
    table:withHl({rows:[['Ticket','Priority','Days open'],['T-1','High',2],['T-2','Low',7],['T-3','Low',3]]},{},'Sheet: Tickets'),
    hint:'Test B2="High" and C2>5 inside OR.',
    solution:'=IF(OR(B2="High", C2>5), "Escalate", "Normal")',
    explain:'T-1 is High priority, so the first test is TRUE and the result is Escalate. T-2 (row 3) is Low but open for 7 days, so the second test is TRUE. T-3 (row 4) fails both and returns Normal.'
  },
  interview:[
    { level:'Basic', q:'What does the OR function return?',
      a:'OR returns TRUE if at least one of its conditions is TRUE, and FALSE only when all of them are FALSE.' },
    { level:'Intermediate', q:'What is the difference between AND and OR?',
      a:'AND needs all conditions to be TRUE, so it is strict. OR needs only one, so it is flexible. For example, "premium and over 5000" uses AND, while "premium or over 5000" uses OR.' },
    { level:'Intermediate', q:'How do you combine AND and OR in one formula?',
      a:'I nest them and use brackets to make the logic clear, for example =IF(AND(B2>=30000, OR(C2>=700, D2="Yes")), "Approve", "Reject"). OR is evaluated first because it is inside the brackets.' },
    { level:'Scenario', q:'Flag an invoice for review if the amount is over 50000 or the vendor is new. How do you do it?',
      a:'=IF(OR(C2>50000, D2="New"), "Review", "OK"), with the amount in column C and the vendor type in column D. One TRUE condition is enough to trigger the review.' }
  ],
  mcq:[
    { q:'What does `=OR(TRUE, FALSE)` return?', o:['TRUE','FALSE','0','An error'], a:0,
      why:'OR needs only one TRUE condition.' },
    { q:'When does OR return FALSE?', o:['When one condition is FALSE','When all conditions are FALSE','When one condition is TRUE','Never'], a:1,
      why:'OR is FALSE only when every condition is FALSE.' },
    { q:'Is `B3="premium"` TRUE when B3 contains Premium?', o:['Yes, text comparison is not case sensitive','No, the case must match exactly','Only inside OR','Only with EXACT'], a:0,
      why:'Excel compares text without caring about upper or lower case.' },
    { q:'What does `=OR(5>10, 3>1)` return?', o:['FALSE','TRUE','5','#N/A'], a:1,
      why:'3>1 is TRUE, so OR returns TRUE.' },
    { q:'Which rule needs OR rather than AND?', o:['Both marks must be at least 40','Free delivery if the order is over 1000 or the customer is a member','The value must be between 10 and 20','The age must be over 18 and under 60'], a:1,
      why:'"Or" in the rule means that any one condition is enough.' }
  ],
  recap:[
    'OR is TRUE when at least one condition is TRUE.',
    'Use AND for "all of these" and OR for "any of these".',
    'Place OR inside IF to return a useful result.'
  ]
},

/* --- not --- */
'not': {
  title:'NOT', tagline:'Flip TRUE to FALSE and FALSE to TRUE.',
  prereq:['if'],
  what:[
    'NOT reverses a logical value.',
    'NOT(TRUE) gives FALSE, and NOT(FALSE) gives TRUE.',
    'It takes a single condition.'
  ],
  why:[
    'Some rules are easier to say as "not this", such as "email is not blank".',
    'It pairs with functions that return TRUE or FALSE, such as ISBLANK and ISNUMBER.'
  ],
  syntax:{ code:'=NOT(logical)', parts:[
    ['logical','A value or condition that is TRUE or FALSE.']
  ]},
  points:[
    'NOT takes **one** argument.',
    '`NOT(B2="Closed")` is the same as `B2<>"Closed"`.',
    'Common pairing: `NOT(ISBLANK(B2))` means "this cell is not empty".',
    'It returns TRUE or FALSE, so it is normally used inside IF.',
    'A cell that holds an empty text result (`""`) is not truly blank, so ISBLANK says FALSE for it.',
    'Often `<>` is shorter, but NOT is clearer with function results.'
  ],
  mistakes:[
    'Giving NOT more than one condition.',
    'Using NOT when a simple `<>` would be clearer.',
    'Forgetting that a formula returning "" is not blank for ISBLANK.',
    'Mixing up TRUE and FALSE after reversing.'
  ],
  example:{
    title:'Finding customers who have an email',
    scenario:'A customer list has an Email column. Some cells are empty. You want to label each row.',
    table:withHl(EMAILS,{'B3':'find','C3':'hit'},'Sheet: Customers'),
    task:'Work out the check for Bilal (row 3, empty email).',
    formula:'=IF(NOT(ISBLANK(B3)), "Has email", "Missing email")',
    steps:[
      'ISBLANK(B3) is TRUE, because the cell is empty.',
      'NOT(TRUE) is FALSE.',
      'IF gets FALSE, so it returns the third argument, "Missing email".'
    ],
    result:'The formula returns Missing email.'
  },
  practice:{
    q:'A ticket list has the status in column B. Write a formula for row 2 that shows "Active" when the status is not "Closed", and "Done" otherwise. Use NOT.',
    table:withHl({rows:[['Ticket','Status'],['T-1','Open'],['T-2','Closed']]},{},'Sheet: Tickets'),
    hint:'Test B2="Closed" and reverse it with NOT.',
    solution:'=IF(NOT(B2="Closed"), "Active", "Done")',
    explain:'For T-1, B2="Closed" is FALSE, NOT makes it TRUE, so the result is Active. For T-2 (row 3), it returns Done. You could also write B2<>"Closed".'
  },
  interview:[
    { level:'Basic', q:'What does the NOT function do?',
      a:'NOT reverses a logical value: it turns TRUE into FALSE and FALSE into TRUE.' },
    { level:'Intermediate', q:'What is the difference between NOT(B2="Closed") and B2<>"Closed"?',
      a:'They give the same result. <> is shorter, while NOT is handy when I want to reverse the result of a function, such as NOT(ISBLANK(B2)).' },
    { level:'Intermediate', q:'How do you test that a cell is not empty?',
      a:'=NOT(ISBLANK(A2)) returns TRUE when the cell has something in it. Inside IF, I can write =IF(NOT(ISBLANK(A2)), "Filled", "Missing"). Note that a cell holding an empty text result from a formula is not truly blank.' },
    { level:'Scenario', q:'You need to highlight rows where the email is missing. What logic would you use?',
      a:'In conditional formatting I would use a formula rule such as =ISBLANK($B2), or =NOT(ISBLANK($B2)) to highlight rows that do have an email. I would check whether the missing values are truly blank or just empty text before relying on ISBLANK.' }
  ],
  mcq:[
    { q:'What does `=NOT(TRUE)` return?', o:['TRUE','FALSE','0','1'], a:1,
      why:'NOT flips the logical value.' },
    { q:'What does `=NOT(5>3)` return?', o:['TRUE','FALSE','5','An error'], a:1,
      why:'5>3 is TRUE, and NOT turns it into FALSE.' },
    { q:'Which condition is equivalent to `B2<>"Closed"`?', o:['NOT(B2="Closed")','B2="Closed"','AND(B2,"Closed")','OR(B2,"Closed")'], a:0,
      why:'Not equal to Closed is the same as reversing "equal to Closed".' },
    { q:'Which function is often paired with NOT to check for empty cells?', o:['LEN','ISBLANK','ROUND','TRIM'], a:1,
      why:'NOT(ISBLANK(A2)) means the cell is not empty.' },
    { q:'How many conditions does NOT accept?', o:['One','Two','Up to 255','None'], a:0,
      why:'NOT takes a single logical argument.' }
  ],
  recap:[
    'NOT flips TRUE and FALSE.',
    'NOT(B2="x") is the same as B2<>"x"; NOT(ISBLANK(B2)) tests that a cell is filled.',
    'Use it inside IF to return real results.'
  ]
},

/* --- if-and-or --- */
'if-and-or': {
  title:'IF with AND and OR', tagline:'Combine conditions to express real business rules in one formula.',
  prereq:['and','or'],
  what:[
    'Real rules often mix "all of" and "any of", such as "salary above 30000 and either a good credit score or a guarantor".',
    'You build these by putting AND and OR inside each other, inside IF.',
    'Brackets decide which part is checked first.'
  ],
  why:[
    'Loan approvals, shipping rules and eligibility checks are rarely a single condition.',
    'Interviewers like scenario questions that need this combination.'
  ],
  syntax:{ code:'=IF(AND(test1, OR(test2, test3)), result_if_true, result_if_false)', parts:[
    ['AND(test1, ...)','Every part must be TRUE.'],
    ['OR(test2, test3)','Inside AND, at least one of these must be TRUE.'],
    ['result_if_true / result_if_false','The two outcomes IF can return.']
  ]},
  points:[
    'Read the rule in plain words first, then split it into AND and OR parts.',
    '"A and (B or C)" becomes `AND(A, OR(B, C))`.',
    '"A or (B and C)" becomes `OR(A, AND(B, C))`.',
    'Excel works from the inside brackets outwards.',
    'Test the formula with rows that should pass and rows that should fail.',
    'If a formula gets long, put the thresholds in cells and refer to them.'
  ],
  mistakes:[
    'Missing or misplaced brackets, which change the meaning of the rule.',
    'Mixing up which part belongs inside OR.',
    'Testing only the cases that should pass.',
    'Hard-coding thresholds inside long formulas.'
  ],
  example:{
    title:'Approving a loan',
    scenario:'Approve when salary is at least 30000 and either the credit score is at least 700 or there is a guarantor.',
    table:withHl(LOANS,{'B4':'find','C4':'find','D4':'find','E4':'hit'},'Sheet: Applicants'),
    task:'Work out the decision for Chitra (row 4: 35000, score 650, guarantor Yes).',
    formula:'=IF(AND(B4>=30000, OR(C4>=700, D4="Yes")), "Approve", "Reject")',
    steps:[
      'B4>=30000 is TRUE.',
      'Inside OR: C4>=700 is FALSE, but D4="Yes" is TRUE, so OR is TRUE.',
      'AND now has TRUE and TRUE, so it is TRUE and IF returns "Approve".'
    ],
    result:'The formula returns Approve.'
  },
  practice:{
    q:'Shipping is free if the order value is 1000 or more, OR if the customer is a member ("Yes") and the order value is 500 or more. Write a formula for row 2 that shows "Free" or "Paid".',
    table:withHl({rows:[['Order','Value','Member'],['O-1',650,'Yes'],['O-2',650,'No']]},{},'Sheet: Orders'),
    hint:'The rule is: value>=1000 OR (member AND value>=500). Put AND inside OR.',
    solution:'=IF(OR(B2>=1000, AND(C2="Yes", B2>=500)), "Free", "Paid")',
    explain:'For O-1, 650 is below 1000, but the customer is a member and 650 is at least 500, so the AND is TRUE and the shipping is Free. For O-2 (row 3), the customer is not a member, so the result is Paid.'
  },
  interview:[
    { level:'Basic', q:'How do you test two conditions in one IF?',
      a:'I place AND or OR in the logical_test: AND when both must be true, OR when either is enough. For example, =IF(AND(B2>=40, C2>=40), "Pass", "Fail").' },
    { level:'Intermediate', q:'How would you write "A and either B or C"?',
      a:'=IF(AND(A, OR(B, C)), result_if_true, result_if_false), where A, B and C are conditions. OR sits inside AND, so at least one of B and C must be true, and A must be true as well.' },
    { level:'Intermediate', q:'Why do brackets matter in combined logic?',
      a:'Brackets decide which conditions are grouped together. "A and (B or C)" and "(A and B) or C" give different results for the same data, so the formula must follow the exact rule.' },
    { level:'Scenario', q:'A manager gives you a rule with several conditions. How do you make sure your formula is right?',
      a:'I restate the rule in plain words, split it into AND and OR parts, build the formula, then test it with rows that should pass and rows that should fail, especially the boundary values. I also keep thresholds in cells so the rule can change without editing the formula.' }
  ],
  mcq:[
    { q:'Which formula expresses "A and either B or C"?', o:['AND(A, OR(B, C))','OR(A, AND(B, C))','AND(A, B, C)','OR(A, B, C)'], a:0,
      why:'A must be true, and at least one of B and C must be true.' },
    { q:'In `=IF(AND(A1>5, OR(B1>5, C1>5)), "Yes", "No")`, A1 is 3. What does it return?', o:['Yes','No','An error','TRUE'], a:1,
      why:'A1>5 is FALSE, so AND is FALSE no matter what OR returns.' },
    { q:'Which part does Excel evaluate first?', o:['The outer function','The innermost brackets','The last argument','The result values'], a:1,
      why:'Excel works from the inside out.' },
    { q:'Which formula expresses "A or (B and C)"?', o:['OR(A, AND(B, C))','AND(A, OR(B, C))','AND(A, B, C)','OR(A, B, C)'], a:0,
      why:'A alone is enough, or B and C must both be true.' },
    { q:'What is a good way to check a combined formula?', o:['Test only rows that pass','Test passing rows and failing rows, including boundary values','Trust it if it has no error','Use fewer brackets'], a:1,
      why:'Testing both outcomes catches logic mistakes that do not show as errors.' }
  ],
  recap:[
    'Put AND and OR inside each other, inside IF, to express real rules.',
    'Brackets decide the grouping, so follow the rule exactly.',
    'Test rows that should pass and rows that should fail.'
  ]
},

/* --- iferror --- */
'iferror': {
  title:'IFERROR', tagline:'Replace error messages with a result you choose.',
  prereq:['if'],
  what:[
    'IFERROR returns the normal result when a formula works.',
    'When the formula gives an error, it returns the alternative you set.',
    'It keeps reports clean, with a message instead of #N/A or #DIV/0!.'
  ],
  why:[
    'Lookups return `#N/A` when a value is missing.',
    'Divisions return `#DIV/0!` when the divisor is zero.',
    'Errors in a report look unprofessional and break totals that depend on them.'
  ],
  syntax:{ code:'=IFERROR(value, value_if_error)', parts:[
    ['value','The formula or value to check for errors.'],
    ['value_if_error','What to return if the first argument is an error.']
  ]},
  points:[
    'It catches **all** error types: `#N/A`, `#DIV/0!`, `#VALUE!`, `#REF!`, `#NAME?`, `#NUM!` and `#NULL!`.',
    'Wrap it around the formula that may fail, such as a lookup or a division.',
    '`IFNA` is stricter: it handles only `#N/A`, so other errors still show.',
    'Choose the replacement carefully: text such as "Not found", or "" for blank.',
    'Replacing errors with 0 can distort averages and totals.',
    'IFERROR can hide real mistakes, such as a wrong range or a typo in a name.'
  ],
  mistakes:[
    'Wrapping every formula in IFERROR, so real problems stay hidden.',
    'Replacing errors with 0 and then averaging the column.',
    'Not investigating why the errors happen.',
    'Using IFERROR where IFNA would be safer for lookups.'
  ],
  example:{
    title:'Avoiding a divide-by-zero error',
    scenario:'A sheet divides revenue by units to get revenue per unit. One product has zero units.',
    table:withHl(UNITS,{'B3':'find','C3':'find','D3':'hit'},'Sheet: Products'),
    task:'Work out revenue per unit for Book (row 3).',
    formula:'=IFERROR(B3/C3, "No units")',
    steps:[
      'B3/C3 is 8000 divided by 0, which is #DIV/0!.',
      'IFERROR sees the error and returns the second argument.',
      'For the other rows there is no error, so IFERROR returns the normal result.'
    ],
    result:'The formula returns No units for Book, and normal values for the others.'
  },
  practice:{
    q:'Using the Products table below, write a formula that looks up the price (column D) for the ID typed in F2, and shows "Not found" when the ID does not exist.',
    table:withHl(PRODUCTS,{},'Sheet: Products'),
    hint:'Put the VLOOKUP inside IFERROR. Use FALSE for an exact match and lock the table range.',
    solution:'=IFERROR(VLOOKUP(F2, $A$2:$D$6, 4, FALSE), "Not found")',
    explain:'If F2 holds P103, the formula returns 1499. If F2 holds an ID that is not in the list, VLOOKUP gives #N/A and IFERROR shows Not found.'
  },
  interview:[
    { level:'Basic', q:'What does IFERROR do?',
      a:'IFERROR returns the result of a formula if it works, and a replacement value of my choice if the formula returns an error. For example, =IFERROR(B2/C2, "No units") avoids #DIV/0!.' },
    { level:'Intermediate', q:'What is the difference between IFERROR and IFNA?',
      a:'IFERROR catches every error type. IFNA catches only #N/A. For lookups, IFNA is safer because it hides only "not found" and still shows other errors, which may point to real mistakes.' },
    { level:'Intermediate', q:'What are the risks of using IFERROR everywhere?',
      a:'It can hide real problems, such as a wrong range or a misspelled function. Replacing errors with 0 can also distort averages and totals. I investigate the cause of errors first and use IFERROR only where an error is an expected case.' },
    { level:'Scenario', q:'Your margin report divides profit by revenue, and some months have zero revenue. How do you handle it?',
      a:'I use =IFERROR(profit/revenue, "") or a clear text such as "n/a" instead of 0, because 0 would suggest a real 0 percent margin and would distort averages. Alternatively I can test the divisor explicitly with IF(revenue=0, "n/a", profit/revenue).' }
  ],
  mcq:[
    { q:'What does `=IFERROR(10/0, "Error")` return?', o:['10','0','Error','#DIV/0!'], a:2,
      why:'10/0 is an error, so IFERROR returns the second argument.' },
    { q:'Which errors does IFERROR catch?', o:['Only #N/A','Only #DIV/0!','All error types','Only #REF!'], a:2,
      why:'IFERROR handles every error type.' },
    { q:'Which function handles only #N/A?', o:['IFERROR','IFNA','ISERROR','IFS'], a:1,
      why:'IFNA is stricter, so other errors are still visible.' },
    { q:'What is a main risk of IFERROR?', o:['It slows Excel down badly','It can hide real mistakes in a formula','It changes the data','It only works with text'], a:1,
      why:'A wrong range or typo can produce an error that IFERROR quietly covers.' },
    { q:'What does `=IFERROR(5/1, "x")` return?', o:['x','5','#VALUE!','0'], a:1,
      why:'There is no error, so IFERROR returns the normal result, 5.' }
  ],
  recap:[
    'IFERROR returns your replacement value when a formula gives an error.',
    'Use it for expected errors, such as missing lookups or division by zero.',
    'Prefer IFNA for lookups, and avoid hiding real mistakes or filling with 0.'
  ]
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- if --- */
DEEP['if'] = {
  level:'Beginner',
  tldr:'IF asks a yes/no question and returns one result for yes and another for no.',
  intuition:{ text:[
    'Every decision in a spreadsheet is a fork in the road: if the condition is true, take the first road, otherwise take the second. IF is the spreadsheet\'s way of writing that fork, and almost every other logical function (AND, OR, NOT, IFS, IFERROR) is used inside it or beside it.',
    'The skill is not the syntax. It is turning a business sentence, such as "give a bonus if sales reach 100000", into a condition that is either TRUE or FALSE for every row.'
  ], analogy:'A traffic light for data: green or red, depending on a rule you define.' },
  how:[
    'Excel evaluates the **logical test**, such as `B4>=50`, to TRUE or FALSE.',
    'If TRUE, it returns `value_if_true`.',
    'If FALSE, it returns `value_if_false` (or the word FALSE if you left that argument out).',
    'Only the chosen branch is evaluated, so the other branch can contain a formula that would otherwise fail.',
    'The result can be text, a number or another formula.'
  ],
  diagrams:[
    { type:'flow', arrows:['evaluate','FALSE, so take the second branch'], panels:[
      { title:'Formula', text:'=IF(B4>=50, "Pass", "Fail")' },
      { title:'Logical test for Chitra', text:'45 >= 50 is **FALSE**' },
      { title:'Result', text:'**Fail**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Returning a calculation', scenario:'Commission is 5% of sales when the target of 100000 is reached, otherwise nothing.', table:withHl({rows:[['Rep','Sales','Commission'],['Ravi',120000,6000],['Meera',85000,0]]},{'B2':'find','C2':'hit'},'Sheet: Sales'),
      task:'Calculate the commission for Ravi.', formula:'=IF(B2>=100000, B2*0.05, 0)', steps:['The test 120000 >= 100000 is TRUE.','IF returns the first result, the calculation B2*0.05.'], result:'The formula returns 6000. For Meera the test is FALSE and the result is 0.' },
    { level:'Business case', title:'A bonus with two conditions', scenario:'A bonus of 5% is paid only if sales reach 100000 and the customer rating is at least 4.', table:withHl({rows:[['Rep','Sales','Rating','Bonus'],['Ravi',120000,4.5,6000],['Meera',130000,3.8,0],['Imran',90000,4.8,0]]},{'B2:C2':'find','D2':'hit'},'Sheet: Performance'),
      task:'Calculate the bonus for Ravi.', formula:'=IF(AND(B2>=100000, C2>=4), B2*0.05, 0)', steps:['AND needs both tests to be TRUE.','Ravi: 120000 >= 100000 and 4.5 >= 4, so the bonus is paid.','Meera fails the rating test, and Imran fails the sales test.'], result:'Ravi gets 6000, and the other two get 0. Keep the thresholds in cells so the rule can change without editing the formula.' }
  ],
  edge:[
    { t:'Boundary values', d:'`>` and `>=` differ exactly at the boundary. "50 or more" is `>=50`. Always test the boundary value itself.' },
    { t:'Text that looks like numbers', d:'A cell holding the text `"50"` is not greater than the number 40 in the way you expect. Check with ISNUMBER and convert if needed.' },
    { t:'Blank cells', d:'A blank cell is treated as 0 in numeric comparisons and as an empty string in text ones. Test for blanks explicitly: `B2=""`.' },
    { t:'The default FALSE', d:'If you omit `value_if_false` and the test fails, the cell shows the word FALSE, which looks like a bug. Always give both results.' },
    { t:'Text results need quotes', d:'`"Pass"` is text. Without quotes, Excel looks for a name called Pass and shows `#NAME?`.' },
    { t:'Nesting limit', d:'You can nest up to 64 IFs, but readability collapses after three. Use IFS or a lookup table instead.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Show "Overdue" if the due date in B2 is before today, "Due today" if it is today, and "On track" otherwise.', hint:'Two tests, so nest a second IF in the false part.', solution:'=IF(B2<TODAY(), "Overdue", IF(B2=TODAY(), "Due today", "On track"))', explain:'The first test catches past dates. Only if it is FALSE does Excel check for today. Order matters: a later test is only reached when earlier ones fail.' },
    { level:'Interview', q:'Show "Missing" if B2 is blank, otherwise "Pass" for marks of 50 or more and "Fail" otherwise.', hint:'Test for blank first, because a blank is treated as 0 in numeric tests.', solution:'=IF(B2="", "Missing", IF(B2>=50, "Pass", "Fail"))', explain:'If the blank test came second, a blank cell would be compared as 0 and return Fail. Putting the special case first prevents that. Mention ISBLANK as an alternative, with the caveat that a formula returning "" is not blank for ISBLANK.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'Explain the IF function with an example.', a:'IF tests a condition and returns one value when it is TRUE and another when it is FALSE. For example, =IF(B2>=50,"Pass","Fail") labels each student based on marks.',
      structure:'Name the three arguments, give a one-line example, then mention that either result can be a calculation.',
      follow:[ { q:'What happens if you leave out the third argument?', a:'When the test is FALSE, the cell shows FALSE. Use "" to show an empty-looking cell.' } ] },
    { level:'Intermediate', q:'How do you test several conditions?', a:'For "all of these" I use AND inside the test, for "any of these" OR, and for several outcomes I nest IFs, or use IFS. For many outcomes with changing rules I use a lookup table with approximate match, which is easier to maintain.',
      tradeoff:'Nested IFs are fast to write but hard to maintain. A table is slower to set up but changes without editing formulas.',
      follow:[ { q:'Why does the order of nested conditions matter?', a:'Excel stops at the first TRUE test. If a broad test comes first, it hides the narrower tests after it.' } ] },
    { level:'Scenario', q:'A manager changes the bonus threshold every quarter. How do you build the model?', a:'I put the threshold and the bonus rate in input cells and refer to them with absolute references, such as =IF(B2>=$F$1, B2*$F$2, 0). Then a change means editing one cell, not hundreds of formulas.' }
  ],
  ref:{ headers:['Operator','Meaning'], rows:[['`=`','Equal to'],['`<>`','Not equal to'],['`>` `<`','Greater than, less than'],['`>=` `<=`','Greater or equal, less or equal'],['`AND(...)` `OR(...)` `NOT(...)`','Combine tests']] },
  related:['nested-if','ifs','and','or','iferror']
};

/* --- nested-if --- */
DEEP['nested-if'] = {
  level:'Intermediate',
  tldr:'A nested IF tests conditions **in order** and stops at the first one that is true, so the order of the tests is part of the logic.',
  intuition:{ text:[
    'Think of a series of doors. At the first door the question is "90 or more?". If yes, you leave with an A. If no, you walk to the next door and ask "75 or more?", and so on. The last answer is what you get when no door let you out.',
    'This is why order matters. If the doors were in the opposite order, the first question would let everyone out and the rest would never be asked.'
  ], analogy:'A waterfall of questions: each one catches a group and lets the rest fall through.' },
  how:[
    'Excel evaluates the first test. If TRUE, it returns the first result and stops.',
    'If FALSE, it moves to the IF placed in the false argument.',
    'That IF repeats the process for the next test.',
    'The final false argument is the "everything else" result.',
    'Each IF needs its own closing bracket: three IFs end with three brackets.'
  ],
  diagrams:[
    { type:'flow', arrows:['no','no','no'], panels:[
      { title:'Marks >= 90?', text:'Yes: **A**' },
      { title:'Marks >= 75?', text:'Yes: **B**' },
      { title:'Marks >= 50?', text:'Yes: **C**' },
      { title:'Otherwise', text:'**Fail**' }
    ], caption:'For 82: no at 90, yes at 75, so the answer is B. The remaining tests are never evaluated.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'The same rule in the wrong order', scenario:'What if the loosest test is written first?', table:withHl(GRADES,{'B5':'find'},'Sheet: Grades'), task:'Predict the result for Deepak (91).',
      formula:'=IF(B5>=50, "C", IF(B5>=75, "B", IF(B5>=90, "A", "Fail")))', steps:['The first test is 91 >= 50, which is TRUE.','Excel returns C and never reaches the other tests.'], result:'Deepak gets C instead of A. Always put the strictest test first.' },
    { level:'Business case', title:'Delivery fee slabs', scenario:'Orders of 1000 or more ship free, orders of 500 or more cost 40, and the rest cost 80.', table:withHl({rows:[['Order','Value','Fee'],['O-1',1200,0],['O-2',700,40],['O-3',250,80]]},{'B3':'find','C3':'hit'},'Sheet: Orders'), task:'Calculate the fee for O-2.',
      formula:'=IF(B3>=1000, 0, IF(B3>=500, 40, 80))', steps:['700 >= 1000 is FALSE, so go on.','700 >= 500 is TRUE, so the fee is 40.'], result:'The fee is 40. If the slabs change often, store them in a table and use a lookup instead of editing formulas.' }
  ],
  edge:[
    { t:'Order of tests', d:'The first TRUE test wins. Tests must go from most specific to least specific.' },
    { t:'Bracket counting', d:'Three IFs need three closing brackets. Excel colours matching brackets as you type, which helps.' },
    { t:'Boundaries', d:'`>=` and `>` give different results at the boundary. Test 90, 89 and 91.' },
    { t:'The 64-level limit', d:'Excel allows 64 nested IFs, but anything beyond three or four is hard to read and maintain.' },
    { t:'Blank cells', d:'A blank is 0 in comparisons, so it falls through to the last result. Handle blanks with a first test such as `B2=""`.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Classify an age in B2: under 13 is Child, 13 to 19 is Teen, 20 to 64 is Adult, 65 or more is Senior.', hint:'Start with the smallest bound, and use < tests.', solution:'=IF(B2<13, "Child", IF(B2<20, "Teen", IF(B2<65, "Adult", "Senior")))', explain:'Each test only runs when the earlier ones failed, so the lower bounds do not need repeating.' },
    { level:'Interview', q:'Rewrite the delivery-fee rule so that a non-programmer can change the slabs without editing a formula.', hint:'Move the rules into a table and use an approximate lookup.', solution:'Table (sorted ascending): 0 → 80, 500 → 40, 1000 → 0.\n=VLOOKUP(B2, $F$2:$G$4, 2, TRUE)', explain:'The approximate match finds the largest slab start that is not above the value. Changing the table changes every result.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is a nested IF and when do you use it?', a:'A nested IF places an IF inside the false argument of another IF so that one formula can choose among more than two results, for example grading or fee slabs.',
      structure:'Define it, give a three-outcome example, then mention the ordering rule.',
      follow:[ { q:'Why does the order matter?', a:'Excel stops at the first TRUE test, so a broad test placed first hides the narrower ones.' } ] },
    { level:'Intermediate', q:'What are the drawbacks of nested IFs and what are the alternatives?', a:'They are hard to read, easy to break with a bracket, and rules are hard-coded in formulas. Alternatives are IFS for a flat list, and a lookup table with approximate match when the rules change often.',
      tradeoff:'Nested IF needs no setup, IFS is cleaner but needs Excel 2019 or later, and a lookup table is the most maintainable.' },
    { level:'Scenario', q:'A commission formula has six nested IFs and the slabs change every quarter. What do you do?', a:'I move the slabs into a small table and replace the formula with a lookup using approximate match. Then updating the slabs means editing the table, and the formula becomes one line.' }
  ],
  ref:{ headers:['Tip','Why'], rows:[['Strictest test first','First TRUE wins'],['Count the brackets','One per IF'],['Test boundaries','`>=` versus `>`'],['More than 3 levels?','Use IFS or a lookup table']] },
  related:['if','ifs','vlookup','and']
};

/* --- ifs --- */
DEEP['ifs'] = {
  level:'Intermediate',
  tldr:'IFS lists condition and result pairs and returns the result of the **first true** condition. It has no built-in "else", so end with `TRUE`.',
  intuition:{ text:[
    'A nested IF stacks questions inside each other, and the brackets pile up. IFS flattens the same logic into a list: question, answer, question, answer. Excel reads down the list and stops at the first question that is true.',
    'The flat shape makes rules easier to read and to audit, which matters when a formula encodes business policy. The one thing it does not do for you is the catch-all: if no condition is true, you get `#N/A` unless you add one.'
  ], analogy:'A checklist read from the top: the first box that applies decides the outcome.' },
  how:[
    'Excel tests the first condition. If true, it returns the paired result and stops.',
    'Otherwise it moves to the next pair.',
    'If no condition is true, IFS returns `#N/A`.',
    'Add `TRUE, "default"` as the last pair to cover everything else, because TRUE is always true.',
    'Every condition must have its own result; a missing result gives an error.'
  ],
  diagrams:[
    { type:'flow', arrows:['no','no','no'], panels:[
      { title:'B2 >= 90', text:'A' },{ title:'B2 >= 75', text:'B' },{ title:'B2 >= 50', text:'C' },{ title:'TRUE', text:'Fail' }
    ], caption:'For 58: no, no, yes at the third test, so the result is C. The default is only reached when nothing earlier matches.' }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'What happens without the default', scenario:'A rule is missing its catch-all.', table:withHl({rows:[['Student','Marks','Grade'],['Asha',82,'B'],['Farhan',35,'#N/A']]},{'B3':'find','C3':'miss'},'Sheet: Grades'), task:'Predict the result for 35.', formula:'=IFS(B3>=90, "A", B3>=75, "B", B3>=50, "C")',
      steps:['35 fails every test.','There is no TRUE pair, so IFS returns #N/A.'], result:'Add `TRUE, "Fail"` as the last pair, and 35 returns Fail.' },
    { level:'Business case', title:'A task status that updates every day', scenario:'A tracker should show Overdue, Due today, Due soon (within 3 days) or On track. Suppose today is 10-Oct-2026.', table:withHl({rows:[['Task','Due','Status'],['Audit','08-Oct-2026','Overdue'],['Report','10-Oct-2026','Due today'],['Review','12-Oct-2026','Due soon'],['Plan','20-Oct-2026','On track']]},{'C2:C5':'hit'},'Sheet: Tasks'),
      task:'Write the status formula.', formula:'=IFS(B2<TODAY(), "Overdue",\n     B2=TODAY(), "Due today",\n     B2<=TODAY()+3, "Due soon",\n     TRUE, "On track")', steps:['The tests run from the most urgent to the least.','Order matters: "within 3 days" would also catch overdue dates if it came first.'], result:'The status changes automatically each day, with no manual updates.' }
  ],
  edge:[
    { t:'No default means #N/A', d:'Always end with `TRUE, "something"` unless an unmatched value should be flagged as an error.' },
    { t:'Order of tests', d:'The first true condition wins, as in a nested IF. Put the strictest test first.' },
    { t:'Version support', d:'IFS needs Excel 2019, Excel 2021 or Microsoft 365. Older versions show `#NAME?`. For shared files, use a nested IF or a lookup table.' },
    { t:'Pairs must be complete', d:'A condition without a result returns an error: "You\'ve entered too few arguments".' },
    { t:'Errors inside conditions', d:'If a condition itself errors (for example a lookup that fails), IFS returns that error even if a later pair would have matched. Wrap risky tests in IFERROR.' },
    { t:'Many rules?', d:'Beyond five or six rules, a lookup table with approximate match is easier to maintain than any IF formula.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Convert =IF(B2>=1000,0,IF(B2>=500,40,80)) into IFS.', hint:'One pair per outcome, last pair TRUE.', solution:'=IFS(B2>=1000, 0, B2>=500, 40, TRUE, 80)', explain:'Same logic, but flat. An order of 700 gives 40. A value of 250 reaches the TRUE pair and gives 80.' },
    { level:'Interview', q:'Your IFS works on your PC but shows #NAME? on a colleague\'s. What happened and what do you do?', hint:'Version.', solution:'The colleague\'s Excel does not support IFS (Excel 2016 or earlier).\nOptions: rewrite as nested IF, use a lookup table with approximate match, or ask them to open the file in Excel for the web.', explain:'Naming the cause (version) first, then offering options with their trade-offs is the structure interviewers like.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What is IFS and how is it different from a nested IF?', a:'IFS checks several conditions in order and returns the result for the first one that is true. It does the same job as a nested IF, but as a flat list of pairs, so it is easier to read and edit. It needs Excel 2019 or later.',
      follow:[ { q:'How do you add an "else"?', a:'Use TRUE as the last condition with the default result.' } ] },
    { level:'Intermediate', q:'When would you avoid IFS?', a:'When the file must open in older Excel versions, or when there are many rules that change often. A lookup table with approximate match is easier to maintain and does not need formula edits.',
      tradeoff:'IFS is more readable than nested IF but still hard-codes the rules in the formula.' },
    { level:'Scenario', q:'Design a formula that labels invoices Current, 1-30 days, 31-60 days or 60+ days overdue.', a:'With days overdue in B2: =IFS(B2<=0,"Current", B2<=30,"1-30 days", B2<=60,"31-60 days", TRUE,"60+ days"). I keep the thresholds in cells if the buckets may change.' }
  ],
  ref:{ headers:['Part','Rule'], rows:[['Pairs','condition, result, condition, result'],['Evaluation','Top to bottom, first true wins'],['Default','`TRUE, "default"` as last pair'],['No match','`#N/A`'],['Versions','2019, 2021, 365']] },
  related:['nested-if','if','if-and-or','vlookup']
};

/* --- and --- */
D('and',{ l:'Beginner', t:'AND returns TRUE only when every condition is TRUE. Use it inside IF.',
  i:['Some rules need several things to be true together: both subjects passed, the sale is high and the rating is good. AND combines the tests into one TRUE or FALSE.','It does not return a message by itself. Its job is to feed IF, conditional formatting or a filter.'], a:'A door that opens only if every lock is unlocked.',
  h:['Write each condition as a test, such as `B2>=40`.','Put them inside `AND(test1, test2, ...)`.','AND returns TRUE if all are TRUE, otherwise FALSE.','Wrap it in IF to return a result.'],
  d:[FL(['all must be TRUE'],[{ title:'Bilal', rows:[['Test','Result'],['Maths >= 40 (35)','FALSE'],['Science >= 40 (80)','TRUE']], hl:{1:'miss',2:'hit'} },{ title:'AND', text:'**FALSE**' }])],
  x:[X('Variation','A range check','A value must be between 10 and 20 inclusive.','Use two comparisons.','=AND(A1>=10, A1<=20)',['`10<=A1<=20` does not work in Excel.','AND combines the two tests.'],'A1 = 15 gives TRUE, and 25 gives FALSE.'),
     X('Business case','Eligibility for a bonus','Sales of at least 100000 and a rating of at least 4.','Use AND inside IF.','=IF(AND(B2>=100000, C2>=4), "Eligible", "Not eligible")',['Both tests must pass.','Keep the thresholds in cells for flexibility.'],'Ravi (120000, 4.5) is eligible. Meera (130000, 3.8) is not.',withHl({rows:[['Rep','Sales','Rating'],['Ravi',120000,4.5],['Meera',130000,3.8]]},{},'Sheet: Performance'))],
  e:[['No chained comparisons','Always write two comparisons joined by AND.'],['No short-circuit','Every argument is evaluated, so an error in one makes AND an error.'],['Text is not case sensitive','"Yes" equals "yes", but a trailing space breaks it.'],['Blank cells','A blank is 0 in numeric tests. Add `B2<>""` if blanks should fail.']],
  p:[P('Medium','Return "Pass" only if Maths (B2) and Science (C2) are both at least 40.','AND inside IF.','=IF(AND(B2>=40, C2>=40), "Pass", "Fail")','Both tests must be TRUE for Pass.'),
     P('Interview','What does AND return if one argument is an error?','Think about evaluation.','An error. Excel evaluates all arguments, so wrap risky tests in IFERROR.','Knowing there is no short-circuit prevents confusing bugs.')],
  q:[Q('Basic','What does AND do?','It returns TRUE only if all its conditions are TRUE.',{ f:[['How do you check a value is in a range?','AND(x>=low, x<=high).']] }),
     Q('Scenario','How do you combine AND with OR in one rule?','Nest them with brackets that mirror the sentence, such as AND(A, OR(B, C)).',{ t:'Test with passing and failing rows, including boundaries.' })],
  r:RT(['Use','Formula'],[['Both true','`AND(a, b)`'],['In a range','`AND(x>=lo, x<=hi)`'],['With IF','`IF(AND(...), "Yes", "No")`'],['Any true','`OR(a, b)`']]), rel:['or','not','if-and-or','if'] });

/* --- or --- */
D('or',{ l:'Beginner', t:'OR returns TRUE when at least one condition is TRUE.',
  i:['OR expresses alternatives: premium customer or large order, priority high or open too long. It is TRUE as soon as any one test is TRUE.','Like AND, it normally lives inside IF, where it decides which result to return.'], a:'A door with several keys: any one of them opens it.',
  h:['Write each alternative as a test.','Put them inside `OR(test1, test2, ...)`.','OR is FALSE only when every test is FALSE.','Wrap in IF to return text or numbers.'],
  d:[FL(['any TRUE'],[{ title:'Sneha', rows:[['Test','Result'],['Type = Premium','FALSE'],['Order >= 5000 (6000)','TRUE']], hl:{1:'miss',2:'hit'} },{ title:'OR', text:'**TRUE**' }])],
  x:[X('Variation','Several allowed values','A region code must be East or West.','Test the same cell against each value.','=OR(B2="East", B2="West")',['Do not write OR(B2="East","West"): the second item is not a test of B2.'],'North returns FALSE, East returns TRUE.'),
     X('Business case','Escalation rule','A ticket is escalated if the priority is High or it has been open more than 5 days.','Use OR inside IF.','=IF(OR(B2="High", C2>5), "Escalate", "Normal")',['Either condition is enough.'],'A Low ticket open for 7 days is still escalated.',withHl({rows:[['Ticket','Priority','Days open'],['T-1','High',2],['T-2','Low',7],['T-3','Low',3]]},{},'Sheet: Tickets'))],
  e:[['Not exclusive','OR is TRUE when both are TRUE. For exactly one use XOR.'],['Text comparisons','Case does not matter, but spaces do.'],['Many values','For long lists, use `COUNTIF(list, x)>0` or MATCH instead of a long OR.'],['Errors','An error in any argument makes the whole OR an error.']],
  p:[P('Medium','Give a discount to Premium customers or orders of 5000 or more.','OR inside IF.','=IF(OR(B2="Premium", C2>=5000), "Yes", "No")','Either test earns the discount.'),
     P('Interview','Rewrite OR(A1="x", A1="y", A1="z", A1="w") in a shorter, more maintainable way.','Use a list.','=COUNTIF(ListRange, A1) > 0, or =ISNUMBER(MATCH(A1, ListRange, 0)).','A list on a sheet can change without editing formulas.')],
  q:[Q('Basic','What is the difference between AND and OR?','AND needs all conditions true, OR needs at least one.',{ f:[['When is OR false?','Only when all conditions are false.']] }),
     Q('Scenario','How would you flag rows that match any of 30 regions?','Put the regions in a list and use COUNTIF or MATCH against it.',{ t:'A long OR is hard to maintain.' })],
  r:RT(['Use','Formula'],[['Any true','`OR(a, b)`'],['Value in a short list','`OR(x="a", x="b")`'],['Value in a long list','`COUNTIF(list, x)>0`'],['Exactly one','`XOR(a, b)`']]), rel:['and','not','if-and-or','countif'] });

/* --- not --- */
D('not',{ l:'Beginner', t:'NOT reverses TRUE and FALSE. It is handy with functions like ISBLANK and ISNUMBER.',
  i:['Some rules are easier to say as "not": the cell is not empty, the value is not a number. NOT flips a test so you can use it where the other form is clumsy.','Often `<>` is shorter, but NOT reads better when wrapping a function result.'], a:'A light switch: it turns on to off and off to on.',
  h:['Write the test whose opposite you need.','Wrap it in `NOT(...)`.','TRUE becomes FALSE and FALSE becomes TRUE.','Use inside IF for readable rules.'],
  d:[FL(['reverse'],[{ title:'ISBLANK(B3)', text:'TRUE (the cell is empty)' },{ title:'NOT(ISBLANK(B3))', text:'**FALSE**' }])],
  x:[X('Variation','Excluding a status','Treat everything except Closed as active.','Use NOT or <>.','=IF(NOT(B2="Closed"), "Active", "Done")',['`NOT(B2="Closed")` equals `B2<>"Closed"`.'],'Open returns Active, Closed returns Done.'),
     X('Business case','Finding missing emails','A mailing list needs rows that already have an email.','Test the cell is not blank.','=IF(NOT(ISBLANK(B2)), "Has email", "Missing email")',['ISBLANK is TRUE for empty cells.','NOT turns it into "has content".'],'Empty cells are labelled Missing email.',withHl(EMAILS,{},'Sheet: Customers'))],
  e:[['Single argument','NOT takes exactly one condition.'],['Empty string is not blank','A formula returning "" is not blank for ISBLANK, so NOT(ISBLANK()) is TRUE.'],['<> is often simpler','`B2<>"x"` is clearer than `NOT(B2="x")`.'],['Double negatives','Avoid NOT(NOT(...)). Rewrite the condition.']],
  p:[P('Medium','Return "Filled" when B2 is not empty, otherwise "Empty".','NOT with ISBLANK.','=IF(NOT(ISBLANK(B2)), "Filled", "Empty")','Equivalent to IF(ISBLANK(B2), "Empty", "Filled").'),
     P('Interview','Why can NOT(ISBLANK(A2)) be TRUE for a cell that looks empty?','Hidden content.','The cell may contain a space or a formula returning "". Use LEN(TRIM(A2))>0 for a stricter test.','Invisible content is a classic cleaning problem.')],
  q:[Q('Basic','What does NOT do?','It reverses a logical value: NOT(TRUE) is FALSE.',{ f:[['How do you test a cell is not empty?','NOT(ISBLANK(A2)) or A2<>"".']] }),
     Q('Scenario','Highlight rows where an email is missing.','Use a formula rule with =ISBLANK($B2), or =$B2="" to also catch empty strings.',{ t:'Decide whether spaces count as empty.' })],
  r:RT(['Need','Formula'],[['Reverse','`NOT(test)`'],['Not empty','`NOT(ISBLANK(A2))`'],['Not a number','`NOT(ISNUMBER(A2))`'],['Not equal','`A2<>"x"`']]), rel:['and','or','is-null','if'] });

/* --- if-and-or --- */
DEEP['if-and-or'] = {
  level:'Intermediate',
  tldr:'Put AND and OR **inside** IF to express rules with several conditions. Brackets decide which conditions are grouped.',
  intuition:{ text:[
    'Real policies are rarely a single test. "Approve if salary is at least 30000 and either the credit score is 700 or there is a guarantor" has two kinds of connection: all of these, and any of these.',
    'AND means every condition must hold, OR means one is enough. To translate a sentence, split it into its parts, decide which words mean "all" and which mean "any", and let the brackets mirror the grouping.'
  ], analogy:'Entry rules for a club: an age check AND (a membership card OR a guest pass).' },
  how:[
    'Write the rule in plain words and mark every "and" and "or".',
    'Turn each part into a TRUE/FALSE test, such as `B2>=30000`.',
    'Group alternatives with `OR(...)` and requirements with `AND(...)`.',
    'Nest them so that the brackets match the grouping in the sentence.',
    'Put the final combination inside `IF(..., result_if_true, result_if_false)`.'
  ],
  diagrams:[
    { type:'flow', arrows:['',''], panels:[
      { title:'Salary >= 30000', text:'Required (AND)' },
      { title:'Credit score >= 700 OR guarantor', text:'Either is enough (OR)' },
      { title:'Both groups true?', text:'Approve' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'OR containing an AND', scenario:'Shipping is free if the order is 1000 or more, or if the customer is a member and the order is at least 500.', table:withHl({rows:[['Order','Value','Member','Shipping'],['O-1',650,'Yes','Free'],['O-2',650,'No','Paid'],['O-3',1200,'No','Free']]},{'B2:C2':'find','D2':'hit'},'Sheet: Orders'), task:'Write the shipping rule for row 2.',
      formula:'=IF(OR(B2>=1000, AND(C2="Yes", B2>=500)), "Free", "Paid")', steps:['The first OR branch checks the big order.','The second branch needs both membership and at least 500.','Order 1 qualifies through the second branch.'], result:'O-1 is Free, O-2 is Paid and O-3 is Free.' },
    { level:'Business case', title:'Thresholds kept in input cells', scenario:'HR changes the rule every year: minimum sales, minimum rating and bonus rate. The formula must not need editing.', table:withHl({rows:[['Input','Value'],['Min sales',100000],['Min rating',4],['Bonus rate','5%']]},{'B2:B4':'find'},'Sheet: Inputs (B1:B3 hold the values)'),
      task:'Calculate the bonus for a rep with sales in B6 and rating in C6.', formula:'=IF(AND(B6>=$B$1, C6>=$B$2), B6*$B$3, 0)', steps:['The thresholds are absolute references to the input cells.','Changing an input updates every bonus at once.'], result:'The rule is visible, auditable and editable by non-technical users.' }
  ],
  edge:[
    { t:'AND and OR evaluate every argument', d:'Excel does not short-circuit. If one argument is an error, the whole AND or OR is an error, even when another argument already decides the result.' },
    { t:'Brackets change meaning', d:'`AND(A, OR(B, C))` is not the same as `OR(AND(A, B), C)`. Test with rows that should pass and rows that should fail.' },
    { t:'No chained comparisons', d:'`10<=A1<=20` does not work. Use `AND(A1>=10, A1<=20)`.' },
    { t:'Blank cells', d:'A blank is 0 in numeric tests and "" in text tests. Add an explicit blank check if blanks should not qualify.' },
    { t:'Text comparisons', d:'`"Yes"` and `"yes"` are equal in Excel, but `"Yes "` with a trailing space is not. Clean the inputs.' },
    { t:'OR for several values', d:'`OR(B2="East", B2="West")` is clear. Do not write `OR(B2="East","West")`, which does not test B2 against West.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Mark an employee "Eligible" if tenure (C2) is at least 2 years and rating (D2) is at least 3, or if they hold a special approval (E2 = "Yes").', hint:'The approval is an alternative to the whole AND.', solution:'=IF(OR(AND(C2>=2, D2>=3), E2="Yes"), "Eligible", "Not eligible")', explain:'The AND groups the two requirements, and the OR adds the alternative route. Brackets mirror the sentence structure.' },
    { level:'Interview', q:'Explain how you would test a complex IF formula before releasing it to others.', hint:'Think about test cases.', solution:'1. Write the rule in words and list every condition.\n2. Build a test table with rows for each branch: should pass, should fail, and boundary values (exactly at the threshold).\n3. Check blanks and text inputs.\n4. Compare the result against the expected column.\n5. Move thresholds into input cells.', explain:'Testing with expected results turns a formula into something you can defend.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'How do you test two conditions in one IF?', a:'Put AND or OR in the logical test: AND when both must be true, OR when either is enough, for example =IF(AND(B2>=40,C2>=40),"Pass","Fail").',
      follow:[ { q:'What is the difference between AND and OR?', a:'AND needs all conditions true. OR needs at least one.' } ] },
    { level:'Intermediate', q:'How would you write "A and either B or C"?', a:'=IF(AND(A, OR(B, C)), result_true, result_false), where A, B and C are tests. OR is inside AND, so one of B and C must hold and A must hold as well.',
      structure:'Say the structure in words, then the formula, then test it on a pass and a fail row.' },
    { level:'Scenario', q:'A rule keeps changing: thresholds, rates and eligibility. How do you build it?', a:'Keep the thresholds in labelled input cells and refer to them with absolute references or names. The formula then expresses only the logic, and the numbers can change without editing it.',
      tradeoff:'More cells to maintain, but far fewer errors from editing formulas.' }
  ],
  ref:{ headers:['Sentence','Formula shape'], rows:[['A and B','`AND(A, B)`'],['A or B','`OR(A, B)`'],['A and (B or C)','`AND(A, OR(B, C))`'],['A or (B and C)','`OR(A, AND(B, C))`'],['not A','`NOT(A)`']] },
  related:['and','or','not','if','ifs']
};

/* --- iferror --- */
DEEP['iferror'] = {
  level:'Beginner to Intermediate',
  tldr:'IFERROR replaces an error with a value you choose, but it also **hides** mistakes, so use it only for errors you expect.',
  intuition:{ text:[
    'Errors in a report look unprofessional and break totals. IFERROR is a safety net: if the formula works, you get the result, and if it fails, you get a message of your choice.',
    'The danger is that a net catches everything. A typo in a range and a legitimate "not found" both turn into the same friendly message, so an analyst must decide which errors are expected before wrapping them.'
  ], analogy:'A smoke alarm with a mute button: useful for toast, dangerous for a real fire.' },
  how:[
    'Excel evaluates the first argument, `value`.',
    'If it returns a normal result, IFERROR returns it unchanged.',
    'If it returns any error (`#N/A`, `#DIV/0!`, `#VALUE!`, `#REF!`, `#NAME?`, `#NUM!`, `#NULL!`), it returns `value_if_error`.',
    '`IFNA` is stricter: it replaces only `#N/A`, so other errors still show.'
  ],
  diagrams:[
    { type:'flow', arrows:['formula works','formula fails'], panels:[
      { title:'=IFERROR(B2/C2, "No units")', text:'Pen: 5000 / 100 = **50**' },
      { title:'Same formula, Book', text:'8000 / 0 = #DIV/0! so **No units**' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'IFNA keeps real errors visible', scenario:'A lookup should show Not found only when the key is missing. A mistyped range should still show an error.', table:withHl(PRODUCTS,{},'Sheet: Products'), task:'Compare the two wrappers.',
      formula:'=IFNA(VLOOKUP(F2, $A$2:$D$6, 4, FALSE), "Not found")\n=IFERROR(VLOOKUP(F2, $A$2:$D$6, 4, FALSE), "Not found")', steps:['A missing id gives #N/A, so both return Not found.','If someone changes 4 to 9 (beyond the table), VLOOKUP returns #REF!.','IFNA still shows #REF!, which signals the bug. IFERROR hides it.'], result:'Prefer IFNA for lookups, so genuine errors remain visible.' },
    { level:'Business case', title:'A margin report that never shows an error', scenario:'Margin is profit divided by revenue. Some months have no revenue, and 0 would be misleading.', table:withHl({rows:[['Month','Revenue','Profit','Margin'],['Jan',50000,10000,'20%'],['Feb',0,0,'n/a'],['Mar',40000,6000,'15%']]},{'D3':'hit'},'Sheet: Margins'),
      task:'Show n/a when revenue is 0.', formula:'=IF(B3=0, "n/a", C3/B3)', steps:['Here an explicit IF is clearer than IFERROR, because only one case is expected.','"n/a" is better than 0, which would pull averages down.'], result:'February shows n/a, and averages ignore the text. Choose replacements that do not distort later calculations.' }
  ],
  edge:[
    { t:'Hiding real errors', d:'A wrong range, a deleted sheet or a typo in a function name all become your friendly message. Wrap only the part of the formula that can fail in an expected way.' },
    { t:'Replacing with 0', d:'Zeros distort averages and totals. Prefer text such as "n/a", or an empty string, when the value is genuinely missing.' },
    { t:'IFERROR versus IFNA', d:'`IFNA` handles only `#N/A`, the error of a failed lookup. It is the safer choice for lookups.' },
    { t:'Performance', d:'IFERROR evaluates the formula once and returns the result, so it does not double the work.' },
    { t:'Auditing', d:'Add a check column that counts how many rows fell back to the message, so a sudden rise draws attention.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Return the price for the id in F2, or the text "Check ID" when the id is missing, without hiding other errors.', table:withHl(PRODUCTS,{},'Sheet: Products'), hint:'Use IFNA instead of IFERROR.', solution:'=IFNA(VLOOKUP($F$2, $A$2:$D$6, 4, FALSE), "Check ID")', explain:'Only a failed lookup shows Check ID. A broken column index or range still shows its error.' },
    { level:'Interview', q:'Why can wrapping every formula in IFERROR be dangerous?', hint:'Think about what the report will look like when something breaks.', solution:'It converts every error, including genuine mistakes, into a clean-looking value. The report appears to work while the numbers are wrong, and nobody notices.\nUse it only for expected errors, prefer IFNA for lookups, and add checks that count the fallbacks.', explain:'Interviewers want to hear that you treat errors as information, not decoration.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does IFERROR do?', a:'IFERROR returns the normal result of a formula, or a replacement value you specify if the formula produces an error. For example, =IFERROR(B2/C2,"No units") avoids #DIV/0!.',
      follow:[ { q:'Which errors does it catch?', a:'All of them: #N/A, #DIV/0!, #VALUE!, #REF!, #NAME?, #NUM! and #NULL!.' } ] },
    { level:'Intermediate', q:'IFERROR versus IFNA: which and when?', a:'IFNA catches only #N/A, the "not found" error, so I use it with lookups. IFERROR catches everything and is appropriate when any error should become a default, such as a division that may involve zero.',
      tradeoff:'IFERROR is shorter, but it can mask real bugs.' },
    { level:'Scenario', q:'A dashboard shows "Not found" for 30% of rows after a new data load. What do you do?', a:'I treat it as a data problem: check key formats, trailing spaces and whether the master list was updated. A sudden jump in fallbacks is a sign of a change in the data, not a formula problem.',
      structure:'Quantify, locate, find the cause in the data, fix at the source.' }
  ],
  ref:{ headers:['Function','Catches','Use for'], rows:[['`IFERROR`','Every error','Expected errors such as division by zero'],['`IFNA`','`#N/A` only','Lookups'],['`IF(ISERROR())`','Every error (older style)','Legacy workbooks']] },
  related:['if','vlookup','xlookup','coalesce']
};
})();
