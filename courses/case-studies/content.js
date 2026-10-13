/* Datapath | Cleaning, EDA and case studies | lesson content
 * Examples use small illustrative datasets so that every calculation can be checked by hand.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

  const lessons = [
    {
      id:'case-analysis-workflow', title:'Follow a reliable analysis workflow',
      tagline:'Move from a decision question to a checked, useful result.',
      definition:'An analysis workflow is a repeatable sequence for understanding the question, checking the data, preparing it, exploring it and communicating what the evidence supports.',
      why:['It prevents an attractive chart from hiding a data problem.','It makes assumptions and transformations reviewable.','It keeps the conclusion tied to the original decision.'],
      points:['Clarify the decision, outcome, population and time period before calculating.','Inspect the raw data and its structure before changing values.','Clean only with documented rules, validate the result, then explore and communicate it.'],
      mistakes:['Starting with a chart before checking what each row means.','Deleting inconvenient records without documenting why.','Treating a pattern in observational data as proof of cause.'],
      example:{title:'A checkout-time question',scenario:'A store manager asks whether checkout became faster this month. The analyst has transaction timestamps and a list of service changes.',task:'Choose the first steps before comparing average times.',steps:['Define the start and end timestamps for “checkout time.”','Confirm which transactions belong in the population and which dates count.','Check missing, duplicated or impossible timestamps.','Compare a suitable baseline with this month and report uncertainty and limits.'],result:'The question and definitions are fixed before looking for a favorable result.'},
      practice:{q:'A manager asks whether a new delivery process improved service. What should you clarify before opening a chart?',hint:'Name the decision, outcome, comparison and population.',solution:'Define what “improved” means (for example, delivery time or on-time share), which deliveries count, the time window and the comparison group or baseline.',explain:'Without these definitions, the same data can produce several incompatible answers.'},
      interview:[{level:'Basic',q:'What is your first step in an analysis?',a:'I clarify the decision and define the outcome, population, comparison and time period before examining results.'},{level:'Scenario',q:'Why not clean the data immediately?',a:'I first inspect its structure and quality so that I can choose cleaning rules that fit the question and preserve valid information.'}],
      recap:['Start with the decision and definitions, not the chart.','Document changes and validate them.','State what the evidence does and does not support.'],
      quiz:[
        ['What does a reliable analysis workflow provide?',0],
        ['What should be clarified before calculating a result?',1],
        ['Which sequence is most defensible?',2],
        ['Which behavior is a common mistake?',3],
        ['Which statement avoids overclaiming?',4]
      ]
    },
    {
      id:'case-first-audit', title:'Audit a dataset before cleaning',
      tagline:'Learn what the file contains before you edit it.',
      definition:'A first-pass data audit checks the source, dimensions, column meanings, row examples, missing values, distinct categories, ranges and obvious quality issues before transformations begin.',
      why:['It reveals problems that are not visible in a few sample rows.','It helps distinguish genuine unusual data from recording errors.','It provides a baseline for checking that cleaning changed only what was intended.'],
      points:['Keep an untouched source copy and record where it came from.','Check row and column counts, field meanings, data types, blanks, unique values and value ranges.','Record each suspected issue and verify it with a source or business rule before changing data.'],
      mistakes:['Assuming the column heading fully explains its meaning.','Checking only the first few rows and treating them as representative.','Changing source values before saving an auditable original.'],
      example:{title:'A quick order-file audit',scenario:'A sales file has 1,200 rows and columns for order ID, date, region, units, unit price and status.',table:{rows:[['Audit check','Finding'],['Rows / columns','1,200 / 6'],['Distinct order IDs','1,198'],['Blank unit values','4'],['Region labels','North, north, South, East'],['Unit-price range','$0 to $9,999']]},task:'What should be investigated first?',steps:['There are two more rows than distinct order IDs, but the repeated IDs could represent legitimate order lines or duplicate orders. Inspect the affected rows and confirm the grain.','Inspect the four missing unit values and the rows they belong to.','Confirm whether “North” and “north” mean the same region.','Verify the $9,999 price against a product list or source record.'],result:'The audit creates questions to verify; it does not assume every unusual value is an error.'},
      practice:{q:'A file contains a date column with some blanks and several future dates. What do you do first?',hint:'Check the source definition and intended time period before editing.',solution:'Inspect the affected records and confirm the expected date range and whether future dates are valid (for example, scheduled orders).',explain:'Blanks and future dates can be valid or invalid depending on the field and question; an audit identifies them for checking.'},
      interview:[{level:'Basic',q:'What do you inspect before cleaning?',a:'Source and grain, row and column counts, definitions, data types, missingness, distinct categories, ranges and likely quality issues.'},{level:'Scenario',q:'You find an unexpectedly high value. Do you remove it?',a:'No. I verify it against the source and business rules first; it may be a valid rare event.'}],
      recap:['Profile the whole dataset, not just a few rows.','Treat audit findings as items to verify.','Preserve a raw copy and document what changes.'],
      quiz:[['What is the purpose of an initial audit?',0],['What does a suspicious value require?',1],['Which source practice supports an audit trail?',2],['Which action is a common mistake?',3],['Which statement accurately describes an audit?',4]]
    },
    {
      id:'case-grain-keys', title:'Identify the row grain and keys',
      tagline:'Know what one row represents before counting or joining.',
      definition:'The grain is the real-world unit represented by one row, such as one order, one order line or one customer per month. A key identifies that unit at the chosen grain.',
      why:['A wrong grain can duplicate totals or hide valid detail.','Counting rows is meaningful only when row meaning is known.','A reliable key helps detect duplicates and check joins.'],
      points:['Write one sentence describing one row.','Find the field or combination of fields that should identify that row uniquely.','Check uniqueness and null keys; if an order has multiple product lines, order ID alone may not identify a row.'],
      mistakes:['Assuming one row per order when the file has one row per order line.','Removing repeated customer IDs even when customers legitimately have many orders.','Counting rows as orders without checking the grain.'],
      example:{title:'Orders versus order lines',scenario:'An order table has Order ID and Order Date. An order-lines table also has Product and Quantity.',table:{rows:[['Order ID','Line','Product','Units'],['A-10','1','Desk','1'],['A-10','2','Chair','2'],['A-11','1','Lamp','1']]},task:'Identify the grain and suitable key for the lines table.',steps:['The rows represent individual product lines, not whole orders.','Order ID repeats because an order can contain multiple products.','Use Order ID plus Line (or a stable line ID) to identify a line.','Aggregate lines to order grain only when the question requires order-level results.'],result:'The lines table has 3 rows but only 2 distinct orders; counting its rows as orders would overcount.'},
      practice:{q:'A customer ID appears 12 times in a transactions table. Is that automatically a duplicate?',hint:'Compare the row grain with the key.',solution:'No. If each row is a transaction, repeated customer IDs are expected. Check whether the transaction key is unique instead.',explain:'Duplicate detection must use the key for the row’s grain, not any field that happens to repeat.'},
      interview:[{level:'Basic',q:'What does grain mean?',a:'It states what one row represents in a dataset.'},{level:'Intermediate',q:'How can a wrong grain affect a metric?',a:'It can cause overcounting or undercounting, especially after joins or when aggregating line-level data.'}],
      recap:['Define one row in plain language.','Use a key that matches that row definition.','Repeated values are not automatically duplicate records.'],
      quiz:[['What is the grain?',0],['What should a key identify?',1],['Why can a customer ID repeat in transactions?',2],['Which action is a common mistake?',3],['Which principle guides duplicate checks?',4]]
    },
    {
      id:'case-data-types', title:'Check data types and formats',
      tagline:'Make sure values are stored and interpreted as intended.',
      definition:'A data type describes how a field is represented and what operations make sense, such as date, text, whole number, decimal, category or true/false.',
      why:['Correct types enable valid sorting, calculations and date analysis.','Identifiers and categories can look numeric without being quantities.','Format problems can turn valid values into missing or incorrect values.'],
      points:['Compare stored types with the field meaning and source documentation.','Preserve leading zeros in identifiers such as postal codes or account numbers.','Parse dates and numeric values using the correct locale, currency and unit.'],
      mistakes:['Treating an ID as a quantity and averaging it.','Reading 03/04/2026 without checking whether the format is day/month or month/day.','Removing leading zeros from codes.'],
      example:{title:'A mixed-format date field',scenario:'A report contains 04/05/2026, 2026-05-04 and the text “May 4, 2026”.',task:'Normalize dates without changing their meaning.',steps:['Check the source system’s date convention; the first value is ambiguous without it.','Parse the records using the confirmed convention.','Store them as dates and display them consistently, for example 2026-05-04.','Keep the original source value if auditability is important.'],result:'All three values can represent May 4, 2026 only after the source convention is confirmed.'},
      practice:{q:'A product code is stored as 000742. Should it be converted to the number 742?',hint:'Ask whether arithmetic on the value has meaning.',solution:'No, if it is an identifier. Preserve it as text so the leading zeros remain.',explain:'A product code labels an item; it is not a measured quantity.'},
      interview:[{level:'Basic',q:'Why check data types?',a:'A field may be stored in a form that prevents correct calculations or changes its meaning, such as a date stored as text.'},{level:'Scenario',q:'A date parses differently on two computers. What do you check?',a:'The locale and source format, especially ambiguous day/month order, before applying an explicit parsing rule.'}],
      recap:['Types should match meaning.','Confirm ambiguous formats at the source.','Preserve identifiers as identifiers.'],
      quiz:[['What does a data type indicate?',0],['How should an ambiguous date be handled?',1],['How should a code with leading zeros be stored?',2],['Which behavior is a common mistake?',3],['What should determine how a field is parsed?',4]]
    },
    {
      id:'case-missing-values', title:'Handle missing values with care',
      tagline:'Find out why data is missing before filling or removing it.',
      definition:'A missing value means an expected value was not recorded or is unavailable. Its cause may be unknown, not applicable, not collected, withheld or lost.',
      why:['Missingness can change group comparisons and denominators.','A blank is not always zero or “no.”','A documented rule helps prevent silent bias.'],
      points:['Measure how much is missing and where it occurs by field, group and time.','Determine whether the field is required and why it is missing.','Choose to retain, exclude, impute or label missing values based on the analysis and a stated rule; compare results when the choice matters.'],
      mistakes:['Replacing every blank with zero.','Dropping every row with any blank without checking its role.','Filling missing values with a group average without noting the distortion this can cause.'],
      example:{title:'Missing unit counts',scenario:'A completed order has a known unit price of $80 but no recorded quantity.',table:{rows:[['Order','Status','Quantity','Unit price'],['R-205','Completed','Missing','$80'],['R-206','Completed','4','$25']]},task:'Can revenue be calculated for R-205?',steps:['Revenue is quantity multiplied by unit price.','The quantity for R-205 is unknown; a blank is not evidence of zero units.','Check the source order or mark the revenue as unavailable under a documented rule.','Do not include an invented value in the total.'],result:'R-205 revenue cannot be calculated from the displayed data; R-206 revenue is 4 × $25 = $100.'},
      practice:{q:'A blank “cancellation date” appears on an active subscription. Is that necessarily missing data?',hint:'Consider whether the field applies to active records.',solution:'Not necessarily. It may be “not applicable” for an active subscription. Confirm the field definition and represent that meaning consistently.',explain:'Distinguishing not-applicable from not-recorded avoids treating valid states as data errors.'},
      interview:[{level:'Basic',q:'How do you decide what to do with missing values?',a:'I check their pattern and likely cause, the field definition and the analysis goal, then document and test an appropriate handling rule.'},{level:'Scenario',q:'Why is replacing missing sales with zero risky?',a:'It treats unknown sales as known no-sales, lowering totals and averages and potentially biasing comparisons.'}],
      recap:['Missing does not automatically mean zero.','Investigate patterns and causes.','Document handling and test its impact.'],
      quiz:[['What can a blank represent?',0],['What should guide handling?',1],['Can a missing quantity support a revenue calculation?',2],['Which action is a common mistake?',3],['What is the safest general rule?',4]]
    },
    {
      id:'case-duplicates', title:'Find and resolve duplicate records',
      tagline:'Remove repeated records only when the row meaning proves they are duplicates.',
      definition:'A duplicate is a repeated representation of the same real-world record at a defined grain. Exact copies and repeated key values are clues, but not proof, that a row should be removed.',
      why:['Duplicates can inflate counts and sums.','Legitimate repeat transactions must be preserved.','A documented resolution makes totals reproducible.'],
      points:['Use the row grain and key to define what counts as the same record.','Compare repeated records across relevant fields and source timestamps.','Keep the original, record the rule and verify row counts and totals after resolution.'],
      mistakes:['Removing every repeated customer or order number without checking line-level detail.','Keeping the first copy when later records contain corrected information.','Deduplicating without logging how many rows were affected.'],
      example:{title:'Exact duplicate line',scenario:'An order export contains the same line twice, including the same line ID and all field values.',table:{rows:[['Order','Line ID','Product','Units'],['R-106','R-106-1','Lamp','4'],['R-106','R-106-1','Lamp','4'],['R-106','R-106-2','Shade','1']]},task:'Resolve the repeated line without removing a valid second product.',steps:['Use line ID as the unique key for the row grain.','The first two rows have the same line ID and matching values, so they are an exact repeated export.','Retain one representation and log one removed duplicate.','Keep line R-106-2; it has a different key and is a valid line in the same order.'],result:'The export has 3 rows; after removing the one confirmed repeated line it has 2 valid order lines.'},
      practice:{q:'An order ID appears on three rows with different product line IDs. How many rows should remain?',hint:'The table grain is order line, not order.',solution:'Keep all three rows unless the line IDs or other evidence show that a particular line is duplicated.',explain:'Multiple lines can belong to one order; repeated order ID alone is not sufficient for removal.'},
      interview:[{level:'Basic',q:'How do you identify duplicates?',a:'I define the record grain and key, then compare repeated keys and relevant fields against source evidence.'},{level:'Scenario',q:'Two rows share a key but have different amounts. What do you do?',a:'I investigate whether one is a correction, version or legitimate detail row before resolving the conflict; I do not arbitrarily keep one.'}],
      recap:['Define duplicate at the row grain.','Verify before deleting.','Log the resolution and recheck totals.'],
      quiz:[['What makes a record a duplicate?',0],['What evidence should be checked?',1],['Should valid order lines with different line IDs be retained?',2],['Which action is a common mistake?',3],['What must happen after deduplication?',4]]
    },
    {
      id:'case-standardize', title:'Standardize text and category labels',
      tagline:'Make equivalent labels consistent without guessing.',
      definition:'Standardization applies consistent formatting or documented mappings so values that mean the same thing use the same representation.',
      why:['Whitespace, case and spelling variants split group totals.','Consistent categories improve filters, joins and charts.','An explicit mapping preserves the reason for every recode.'],
      points:['Inspect distinct values and counts before changing labels.','Apply safe formatting rules such as trimming outer spaces and consistent case.','Map spelling variants only when context confirms they have the same meaning; preserve raw values when needed.'],
      mistakes:['Combining labels that sound similar but represent different business concepts.','Replacing text by broad substring rules that change unrelated values.','Overwriting the raw category without a mapping or record of the change.'],
      example:{title:'Region labels',scenario:'A region field contains “North”, “ north ” and “NORTH”. Source documentation confirms they refer to one region.',table:{rows:[['Raw value','Clean value'],['North','North'],[' north ','North'],['NORTH','North']]},task:'Standardize the labels and verify the impact.',steps:['Trim leading and trailing spaces.','Apply a consistent capitalization rule.','Compare the distinct-value list before and after.','Check that no other region was merged accidentally.'],result:'Three formatting variants become one “North” category; the underlying records remain present.'},
      practice:{q:'A field contains “NY”, “New York” and “New York City”. Should all become “New York”?',hint:'Formatting variants and different geographic levels are not the same thing.',solution:'Do not merge them without confirming the intended category definition; “New York City” may be a city while “New York” may mean a state.',explain:'Standardization must preserve business meaning, not just make labels look alike.'},
      interview:[{level:'Basic',q:'How do you standardize categories safely?',a:'I inspect distinct values and counts, confirm equivalence with a data owner, apply an explicit mapping, and compare before and after.'},{level:'Scenario',q:'Why keep the raw category?',a:'It lets another analyst audit and reproduce the mapping and helps trace an unexpected result to the source.'}],
      recap:['Inspect categories before mapping.','Normalize format consistently.','Do not merge meanings based on appearance alone.'],
      quiz:[['What is the goal of standardization?',0],['What should happen before mapping labels?',1],['Do the example records disappear?',2],['Which action is a common mistake?',3],['What should a mapping preserve?',4]]
    },
    {
      id:'case-validity-outliers', title:'Check invalid values and unusual outliers',
      tagline:'Use rules to flag values, then investigate their meaning.',
      definition:'A validation rule checks whether a value fits an expected range, format or relationship. An outlier is unusually distant from other values under a selected method; it is not automatically an error.',
      why:['Invalid values can distort summaries and models.','A valid rare event may be important to a business decision.','Separate flags from corrections so that decisions remain auditable.'],
      points:['Set checks from source definitions and business constraints, such as quantity greater than zero for completed lines.','Flag suspicious records, verify them with source evidence and domain context, and correct only when the intended value is known.','If an unusual value is valid, retain it and consider robust summaries or a separate investigation.'],
      mistakes:['Deleting every point outside a statistical fence.','Clipping values just to make a chart look normal.','Calling every value in a rare category invalid.'],
      example:{title:'A very long delivery time',scenario:'Most delivery times are under one hour; one valid delivery took nine hours during a documented road closure.',task:'Decide whether the value should be removed from the service analysis.',steps:['Check the timestamp calculation and source record.','Confirm the road closure and that the delivery belongs to the stated population.','Retain the valid delay when analyzing real customer experience.','Also report a robust center such as the median if the mean is strongly affected.'],result:'The nine-hour delivery remains in the operational dataset; an outlier flag prompts investigation rather than deletion.'},
      practice:{q:'A completed order has quantity −2. What should you do?',hint:'Use a business validation rule and inspect the source.',solution:'Flag it and check whether it is a return, correction or data-entry error; do not silently change it to +2 or zero.',explain:'The meaning depends on the data model. A negative quantity may be invalid for a sale but valid for a return record.'},
      interview:[{level:'Basic',q:'What is the difference between an outlier and an error?',a:'An outlier is unusual relative to a chosen method; an error is incorrect according to the source or business rules. An unusual value may still be valid.'},{level:'Scenario',q:'What do you do with an extreme but verified delivery delay?',a:'Retain it for the relevant operational question, explain the event and consider robust summaries or separate reporting.'}],
      recap:['Use validation rules to flag.','Verify before correcting or removing.','Valid extremes may contain important business information.'],
      quiz:[['What does an outlier flag prove?',0],['What should support a correction?',1],['What happens to the verified nine-hour delivery?',2],['Which action is a common mistake?',3],['How should unusual values be handled?',4]]
    },
    {
      id:'case-join-quality', title:'Check joins and row counts',
      tagline:'Verify that a merge did not multiply, lose or mismatch records.',
      definition:'A join combines tables through matching keys. Its result depends on key uniqueness, missing matches and whether each source has one-to-one, one-to-many or many-to-many relationships.',
      why:['Unexpected many-to-many joins can multiply totals.','Unmatched keys can silently drop or create incomplete records.','Row-count and reconciliation checks reveal merge problems.'],
      points:['Check key meaning, type, nulls and uniqueness in each table before joining.','Predict the expected relationship and row behavior.','After joining, check matched and unmatched rows, row counts, duplicate keys and reconciled totals.'],
      mistakes:['Joining on a name when a stable identifier exists.','Assuming a left join preserves one row per left record when the right key repeats.','Ignoring unmatched records after a merge.'],
      example:{title:'Orders joined to a product list',scenario:'There are 4 order lines. The product table has one row per product except the “Desk” product appears twice with two different prices.',table:{rows:[['Table','Rows','Key issue'],['Order lines','4','One row per line'],['Products','5','Desk product ID appears twice']]},task:'What can happen when the tables are joined by product ID?',steps:['The duplicate Desk key matches each Desk order line to two product rows.','Those order lines can appear twice in the joined result.','Check product key uniqueness and resolve the conflicting product records before joining.','Reconcile joined row counts and sales totals with the original order lines.'],result:'A join to a non-unique lookup key can increase the output beyond 4 rows and inflate totals.'},
      practice:{q:'A left table has 100 rows and the right-side lookup has duplicate keys. The join returns 130 rows. What should you inspect?',hint:'Check cardinality and the right-side key.',solution:'Identify which right keys repeat, determine whether they are legitimate detail records or data issues, and define the intended relationship before aggregating.',explain:'The extra rows can multiply measures; do not simply delete them until the join grain is understood.'},
      interview:[{level:'Basic',q:'What checks do you make after a join?',a:'I check row counts, key uniqueness, matched and unmatched records, expected cardinality and reconciled measures.'},{level:'Scenario',q:'Why did sales double after joining a product table?',a:'The lookup may have multiple rows per product key, causing each matching sales row to repeat.'}],
      recap:['Check keys and cardinality before a join.','Inspect unmatched records and output row counts.','Reconcile totals to detect multiplication or loss.'],
      quiz:[['What determines whether a join can multiply rows?',0],['What should be checked before joining?',1],['What can duplicate lookup keys do?',2],['Which action is a common mistake?',3],['What should a post-join check include?',4]]
    },
    {
      id:'case-eda-questions', title:'Plan exploratory data analysis',
      tagline:'Use EDA to learn what to investigate, not to cherry-pick a result.',
      definition:'Exploratory data analysis (EDA) uses summaries, tables and visualizations to understand data quality, distributions, patterns, group differences and possible relationships before drawing conclusions.',
      why:['It can reveal data problems and questions a predefined metric misses.','It helps choose appropriate summaries and later analyses.','It distinguishes observations worth testing from conclusions supported by evidence.'],
      points:['Write the decision question and a small set of relevant measures first.','Inspect overall data quality and distributions before slicing into many subgroups.','Record exploratory findings as hypotheses until they are checked with suitable evidence.'],
      mistakes:['Searching many breakdowns until one appears favorable.','Treating an exploratory association as a confirmed causal finding.','Using a chart without checking its denominator or time period.'],
      example:{title:'Investigate a drop in orders',scenario:'Weekly orders fell by 8% compared with the prior week.',task:'Plan an initial EDA without assuming the cause.',steps:['Confirm the week definitions, order status and counting grain.','Check whether all expected dates and sources loaded.','Compare daily counts and segment by region or channel using consistent denominators.','Check promotions, holidays or outages as possible explanations and label them as hypotheses.'],result:'The initial EDA identifies where and when the change occurred; it does not establish a cause by itself.'},
      practice:{q:'You inspect 40 segments and one shows a large increase. What should you do before sharing it as a finding?',hint:'Consider how many comparisons were made and whether the pattern was planned.',solution:'Label it exploratory, verify data and denominators, check whether the pattern is stable or replicated, and avoid presenting it as a prespecified confirmed effect.',explain:'Searching many groups increases the chance of finding a seemingly striking result by chance.'},
      interview:[{level:'Basic',q:'What is EDA for?',a:'To understand structure, quality, distributions and patterns, and to form questions for further analysis.'},{level:'Scenario',q:'How do you avoid cherry-picking during EDA?',a:'I define the main questions, report how I explored groups and outcomes, and validate exploratory patterns before presenting them as findings.'}],
      recap:['Explore to understand and ask better questions.','Keep metrics and denominators explicit.','Treat post-hoc patterns as hypotheses.'],
      quiz:[['What is EDA primarily used for?',0],['What should be defined before slicing data?',1],['What does a first EDA pattern establish?',2],['Which behavior is a common mistake?',3],['How should exploratory discoveries be reported?',4]]
    },
    {
      id:'case-distributions', title:'Summarize distributions, not just averages',
      tagline:'Use center, spread and shape together.',
      definition:'A distribution summary describes the values in a field, including center, spread, shape, gaps and unusual observations.',
      why:['Averages can hide skew and subgroups.','Spread helps explain how consistent or variable outcomes are.','A distribution plot can reveal patterns a single number cannot.'],
      points:['Use a mean with spread for reasonably balanced numeric data; consider a median and percentiles for skewed data.','Inspect a histogram or box plot for shape, gaps, tails and possible outliers.','State the units and number of observations alongside the summary.'],
      mistakes:['Calling the mean a typical value when a long tail dominates it.','Comparing averages from datasets with very different spreads without noting it.','Using inconsistent histogram bins when comparing groups.'],
      example:{title:'Delivery delay summary',scenario:'Ten delays in minutes are 5, 10, 12, 15, 18, 20, 22, 25, 31 and 50.',table:{rows:[['Summary','Calculation','Result'],['Mean','208 ÷ 10','20.8 min'],['Median','(18 + 20) ÷ 2','19 min'],['More than 30 min','2 ÷ 10','20%']]},task:'Describe the center and the long-delay tail.',steps:['The values are already sorted.','Their sum is 208, so the mean is 20.8 minutes.','With 10 values, the median is the mean of the fifth and sixth values: (18 + 20) ÷ 2 = 19.','Two deliveries exceed 30 minutes, showing a tail that the center alone does not describe.'],result:'The mean is 20.8 minutes, the median is 19 minutes, and 20% of these deliveries took more than 30 minutes.'},
      practice:{q:'Two groups have the same median wait, but one has a much wider IQR. What can you conclude?',hint:'Separate center from variability.',solution:'Their middle values are similar, but the central half of waits is more spread out in the group with the larger IQR.',explain:'The median describes center; IQR describes the spread of the middle half.'},
      interview:[{level:'Basic',q:'Why report more than an average?',a:'Because center alone hides spread, skew, gaps and outliers; the appropriate summary depends on the distribution and question.'},{level:'Scenario',q:'When might you use a median?',a:'For skewed data or when extreme values pull the mean away from a useful description of the middle.'}],
      recap:['Inspect the shape before choosing a summary.','Report center and spread in context.','Use a distribution plot to reveal details a single number hides.'],
      quiz:[['What does a distribution describe?',0],['What can a histogram reveal?',1],['How many of the example delays exceed 30 minutes?',2],['Which behavior is a common mistake?',3],['What should accompany a center summary?',4]]
    },
    {
      id:'case-group-comparisons', title:'Compare groups with fair denominators',
      tagline:'Counts alone can mislead when group sizes differ.',
      definition:'A fair group comparison uses a consistent outcome definition, comparable time period and an appropriate denominator for each group.',
      why:['Larger groups often have larger raw counts even when their rates are lower.','Consistent definitions make comparisons interpretable.','Group composition can shift an overall result even when subgroup rates do not.'],
      points:['Show group sizes and calculate a rate using the relevant eligible population.','Compare like periods and equivalent definitions.','Check whether a change in group mix explains an overall change.'],
      mistakes:['Comparing counts as if they were rates.','Using different denominators across groups without saying so.','Assuming an overall average change means every group changed similarly.'],
      example:{title:'Support complaints by store size',scenario:'Large stores report 30 complaints from 3,000 orders. Small stores report 12 complaints from 600 orders.',table:{rows:[['Store group','Complaints','Orders','Complaints per 1,000 orders'],['Large','30','3,000','10'],['Small','12','600','20']]},task:'Which group has the higher complaint rate?',steps:['Large stores: 30 ÷ 3,000 × 1,000 = 10 complaints per 1,000 orders.','Small stores: 12 ÷ 600 × 1,000 = 20 complaints per 1,000 orders.','Compare rates, while keeping sample sizes visible.'],result:'Large stores have more complaints by count, but small stores have twice the complaint rate in this example.'},
      practice:{q:'A region with 2,000 customers has 100 cancellations; another with 500 customers has 40. Which cancellation rate is higher?',hint:'Divide cancellations by customers in each region.',solution:'Region 1: 100 ÷ 2,000 = 5%. Region 2: 40 ÷ 500 = 8%.',explain:'The second region has fewer cancellations by count but a higher rate.'},
      interview:[{level:'Basic',q:'Why use rates when comparing differently sized groups?',a:'Rates account for the size of the eligible group and make the outcomes more comparable than raw counts.'},{level:'Scenario',q:'The overall rate changes while each segment rate is stable. What do you check?',a:'I check whether the segment sizes or weights changed, because the group mix can move the overall rate.'}],
      recap:['Use an appropriate denominator.','Keep definitions and periods consistent.','Check group mix as well as group-level results.'],
      quiz:[['What makes a group comparison fairer?',0],['How is a rate calculated?',1],['Which group has a higher complaint rate in the example?',2],['Which behavior is a common mistake?',3],['What should be shown with a rate?',4]]
    },
    {
      id:'case-time-trends', title:'Explore time trends and seasonality',
      tagline:'Check the time axis, coverage and comparison window.',
      definition:'Time-series exploration examines observations in time order to identify trend, seasonality, repeated cycles, sudden changes and missing periods.',
      why:['Time order can reveal shifts hidden by an overall average.','Seasonal patterns can make adjacent periods incomparable.','Data gaps and partial periods can look like real declines.'],
      points:['Use a consistent time unit and sort dates chronologically.','Check missing dates, partial periods, timezone and event timing.','Compare with an appropriate seasonal baseline and avoid inferring cause from timing alone.'],
      mistakes:['Comparing a full month with a partial month.','Sorting date labels alphabetically.','Calling a seasonal peak or dip a lasting trend based on one cycle.'],
      example:{title:'Weekly orders around a holiday',scenario:'Orders were 100, 105, 110, 70 and 108 over five consecutive weeks; the fourth week included a one-day store closure.',table:{rows:[['Week','Orders','Context'],['1','100','Normal'],['2','105','Normal'],['3','110','Normal'],['4','70','One-day closure'],['5','108','Normal']]},task:'Describe the pattern without overstating it.',steps:['The series generally rises from 100 to 110 before a one-week dip.','The closure is a plausible explanation to investigate, not proof of cause.','The fifth week returns near the earlier range at 108.','Compare with the same holiday period in other years before claiming seasonality.'],result:'The data show a one-week dip and rebound; five observations do not establish a lasting trend or seasonal pattern.'},
      practice:{q:'This month has 20 days of data, while last month has 30. Can raw totals be compared directly?',hint:'Think about exposure time and whether both periods are complete.',solution:'Not fairly without adjustment. Compare equivalent complete periods or use a suitable daily rate and explain the difference.',explain:'A partial period has fewer opportunities to accumulate events.'},
      interview:[{level:'Basic',q:'What do you check before analyzing a time trend?',a:'Date parsing and order, missing periods, consistent time units, partial periods, timezone and known events.'},{level:'Scenario',q:'Why compare year over year?',a:'It can help account for recurring seasonal patterns, provided the periods and definitions are comparable.'}],
      recap:['Keep observations in chronological order.','Check gaps, partial windows and known events.','Timing alone does not prove a cause.'],
      quiz:[['What can time-series EDA reveal?',0],['What is an important date check?',1],['What does one observed dip prove?',2],['Which behavior is a common mistake?',3],['What can help with recurring seasonal patterns?',4]]
    },
    {
      id:'case-relationships', title:'Explore relationships without claiming cause',
      tagline:'Check direction, shape, confounders and unusual points.',
      definition:'Relationship analysis examines how two or more variables vary together. A plot can reveal direction, shape, clusters and outliers, but association alone does not establish causation.',
      why:['It can identify useful leads for further analysis.','Plots reveal nonlinear patterns that a single correlation can miss.','Confounding and selection can explain an observed association.'],
      points:['Plot paired observations and inspect shape and unusual values.','Check whether time, group membership or another variable could influence both fields.','Use randomized or otherwise credible causal designs before attributing an outcome to an intervention.'],
      mistakes:['Saying X caused Y because the two move together.','Ignoring a third variable or a trend over time.','Using correlation without checking nonlinearity or influential points.'],
      example:{title:'Advertising and weekly sales',scenario:'Weeks with larger advertising spend also show larger sales.',task:'State what the pattern can support.',steps:['Plot spend against sales and inspect whether the pattern is approximately linear.','Check whether holidays, discounts or seasonality also changed.','Describe the relationship as an association in the observed weeks.','Use an experiment or credible causal method to estimate an advertising effect.'],result:'The association can motivate a causal question, but it does not by itself show that advertising increased sales.'},
      practice:{q:'Ice-cream sales and swimming incidents both rise in summer. Does this show ice-cream causes incidents?',hint:'What seasonal factor could affect both?',solution:'No. Warm weather and increased outdoor activity may affect both; the association alone does not establish a causal link.',explain:'A confounder can create or change the observed relationship.'},
      interview:[{level:'Basic',q:'What can a scatterplot show?',a:'Direction, form, clusters, spread and unusual observations for paired numeric variables.'},{level:'Scenario',q:'How do you respond to a claim that a correlated metric caused another?',a:'I check the design and alternative explanations, including time trends and confounding; association alone is not causal evidence.'}],
      recap:['Plot before summarizing a relationship.','Look for confounders and nonlinearity.','Separate association from causation.'],
      quiz:[['What can a relationship plot reveal?',0],['What should be checked besides the two variables?',1],['What does an observed association establish?',2],['Which behavior is a common mistake?',3],['What supports a causal claim?',4]]
    },
    {
      id:'case-visual-choice', title:'Choose a chart that fits the question',
      tagline:'Use the visual form that makes the comparison honest and clear.',
      definition:'A chart encodes data visually. The chart type, scale, labels and ordering should match the variable types and comparison being made.',
      why:['A suitable chart helps readers see the intended pattern.','Poor scales or chart forms can exaggerate differences.','Clear labels and units reduce interpretation errors.'],
      points:['Use bars for category comparisons, lines for ordered time series, histograms for numeric distributions and scatterplots for two numeric variables.','Start bar charts at zero when bar length encodes magnitude; clearly mark any justified alternative scale.','Label units, population, period and denominator, and avoid decorative effects that obscure values.'],
      mistakes:['Using a pie chart for many categories or unrelated quantities.','Connecting unordered categories with a line.','Truncating a bar chart axis so a small difference looks enormous.'],
      example:{title:'Select a chart for three questions',scenario:'An analyst needs to show monthly sales, order-value distribution and advertising versus sales.',table:{rows:[['Question','Suitable starting chart'],['How did sales change by month?','Line chart'],['How are order values distributed?','Histogram'],['Do spend and sales move together?','Scatterplot']]},task:'Match each question to a chart.',steps:['Months are ordered in time, so a line chart shows sequence.','Order value is numeric; a histogram summarizes its distribution.','Advertising spend and sales are paired numeric fields, so a scatterplot shows their relationship.'],result:'The chart choice follows the question and variable types.'},
      practice:{q:'You want to compare cancellation rates across five regions. What chart is a clear starting point?',hint:'The regions are categories and the outcome is a rate.',solution:'A bar or dot chart with one rate per region, with the denominator and period stated.',explain:'Categories are compared directly, while the rate and denominator keep group size visible.'},
      interview:[{level:'Basic',q:'How do you choose a chart?',a:'I identify the question and variable types, then choose a chart whose visual encoding matches the comparison.'},{level:'Scenario',q:'Why can a truncated bar axis mislead?',a:'Bar length implies magnitude from its baseline; truncating zero can exaggerate visual differences.'}],
      recap:['Match chart form to data and question.','Show units, period and denominator.','Use scales that do not exaggerate the comparison.'],
      quiz:[['Which chart suits values over time?',0],['Which chart suits a numeric distribution?',1],['Which chart suits two numeric variables?',2],['Which behavior is a common mistake?',3],['What information makes a chart interpretable?',4]]
    },
    {
      id:'case-communicate', title:'Communicate an EDA finding responsibly',
      tagline:'Give readers the result, its scope, its uncertainty and the next step.',
      definition:'A responsible finding states what was measured, for whom and when, what was observed, how certain it is, and what limitations or follow-up matter.',
      why:['Decision-makers need context as well as a number.','A clear limitation prevents an exploratory pattern from becoming an unsupported claim.','A practical next step links analysis to action.'],
      points:['Lead with the question and result, using clear units and denominators.','State population, period, comparison and the main caveat.','Separate observed facts, possible explanations and recommended actions.'],
      mistakes:['Saying “proved” when the analysis only found an association.','Reporting percentages without the denominator or period.','Hiding uncertainty or inconvenient segments.'],
      example:{title:'Write a clear summary',scenario:'In the illustrative delivery sample, 2 of 10 orders took more than 30 minutes.',task:'Write one sentence that reports the finding without generalizing beyond the sample.',steps:['Name the observed group and period if known.','Report the count and share: 2 of 10, or 20%.','State that this is a small sample and not automatically the ongoing delivery rate.'],result:'“In this 10-order sample, 2 deliveries (20%) took more than 30 minutes; a larger, representative sample is needed to estimate the usual rate.”'},
      practice:{q:'A chart shows sales rising after a campaign, but there was no control group. What can the report say?',hint:'Separate what happened from why it happened.',solution:'Sales rose during the observed period after the campaign; the chart alone does not show that the campaign caused the rise.',explain:'Seasonality, prices, other promotions or changes in customer mix may also explain the pattern.'},
      interview:[{level:'Basic',q:'What belongs in an analyst’s conclusion?',a:'The finding, population and period, metric and denominator, uncertainty or caveat, and a decision-relevant next step.'},{level:'Scenario',q:'How do you explain an exploratory result?',a:'I label it exploratory, describe how it was found, and recommend validation rather than presenting it as a confirmed causal effect.'}],
      recap:['Use units, denominator and scope.','Keep facts separate from explanations.','Recommend a next step that fits the evidence.'],
      quiz:[['What should a finding include?',0],['What helps a percent make sense?',1],['What does a post-campaign rise prove?',2],['Which behavior is a common mistake?',3],['How should an exploratory pattern be framed?',4]]
    },
    {
      id:'case-retail-clean', title:'Case study: clean a small retail orders file',
      tagline:'Apply grain, duplicate, status and missing-value checks before totaling sales.',
      definition:'A cleaning case applies documented quality rules to a small dataset while retaining a clear account of which records are included in the analysis.',
      why:['Order data can contain duplicated exports, inconsistent labels, cancelled orders and incomplete quantities.','Each issue affects totals differently.','A small worked dataset makes inclusion rules and arithmetic visible.'],
      points:['Define the grain as one order line and identify a line-level key.','Remove only a confirmed duplicate line; exclude cancelled orders from completed-sales revenue and keep incomplete records out of calculated revenue until resolved.','Calculate revenue as units multiplied by unit price for eligible completed lines, then reconcile the included records.'],
      mistakes:['Counting an exact repeated line twice.','Treating a missing quantity as zero.','Including cancelled orders in completed-sales revenue.'],
      example:{title:'Raw retail order lines',scenario:'Illustrative extract. Each row should be one order line; the source confirms “ north ” is the same region as “North”, and R-106-1 is accidentally exported twice.',table:{rows:[['Line ID','Region','Product','Units','Price','Status'],['R-101-1','North','Desk','2','$150','Completed'],['R-102-1',' north ','Chair','3','$80','Completed'],['R-103-1','South','Desk','1','$150','Completed'],['R-104-1','East','Lamp','2','$25','Cancelled'],['R-105-1','East','Chair','Missing','$80','Completed'],['R-106-1','East','Lamp','4','$25','Completed'],['R-106-1','East','Lamp','4','$25','Completed']]},task:'Calculate completed-sales revenue using only complete, non-duplicated completed lines.',steps:['Remove one confirmed repeated copy of R-106-1; retain one valid line.','Standardize “ north ” to “North” using the confirmed region mapping.','Do not count cancelled line R-104-1 as completed sales.','Do not invent a quantity for R-105-1; set it aside until the source is checked.','Calculate: R-101-1 = 2×150 = $300; R-102-1 = 3×80 = $240; R-103-1 = 1×150 = $150; R-106-1 = 4×25 = $100.','Add the four eligible lines: 300 + 240 + 150 + 100 = $790.'],result:'There are 4 eligible completed lines with known quantities and $790 total revenue. One duplicate copy, one cancelled line and one incomplete line are not included.'},
      practice:{q:'If the missing quantity for R-105-1 is later verified as 2, what happens to the eligible revenue total?',hint:'Add its line revenue to the checked total.',solution:'Add 2 × $80 = $160, giving $790 + $160 = $950.',explain:'The record becomes eligible only after the source confirms its quantity and the analysis rule allows it.'},
      interview:[{level:'Scenario',q:'How did you decide which records to include?',a:'I defined completed-sales revenue, deduplicated by the line key, excluded cancelled lines, and held the unknown-quantity line until it could be verified.'},{level:'Intermediate',q:'Why retain a log of excluded rows?',a:'It makes the total reproducible and lets a reviewer check whether exclusions match the stated business rules.'}],
      recap:['Cleaning decisions depend on the metric definition.','Keep a record of exclusions and unresolved rows.','The checked example total is $790.'],
      quiz:[['What is the row grain in the example?',0],['Why is R-105-1 held out?',1],['How many eligible lines are used?',2],['Which behavior is a common mistake?',3],['What is the checked eligible revenue total?',4]]
    },
    {
      id:'case-retail-eda', title:'Case study: explore the cleaned retail sales',
      tagline:'Summarize revenue by region without losing the data-quality context.',
      definition:'Retail EDA summarizes a cleaned sales dataset to understand total performance, category or region differences, distribution and possible questions for follow-up.',
      why:['Business leaders need both overall and segment results.','Group totals show contribution but not necessarily performance per order.','The cleaning decisions define which records the results describe.'],
      points:['Use only the checked $790 subset from the preceding case and state that it excludes cancelled and unresolved lines.','Calculate revenue by region: North $540, South $150 and East $100.','Use order counts or rates alongside revenue when comparing performance across regions of different sizes.'],
      mistakes:['Describing the four-line illustrative extract as the whole company.','Treating higher revenue as proof that a region performs better without considering its number of orders.','Forgetting that the missing quantity was excluded.'],
      example:{title:'Revenue by region in the checked extract',scenario:'Use the four eligible completed lines from the cleaning case.',table:{rows:[['Region','Eligible revenue','Eligible lines'],['North','$540','2'],['South','$150','1'],['East','$100','1'],['Total','$790','4']]},task:'What share of the extract’s revenue came from North?',steps:['North revenue is $300 + $240 = $540.','The checked total is $790.','Share = $540 ÷ $790 × 100 ≈ 68.4%.','State that this is revenue share for the small checked extract, not a rate adjusted for market size.'],result:'North contributes about 68.4% of the $790 revenue in this illustrative extract.'},
      practice:{q:'North has $540 revenue from 2 lines; South has $150 from 1 line. Which has higher revenue per line?',hint:'Divide each region’s revenue by its eligible line count.',solution:'North: $540 ÷ 2 = $270 per line. South: $150 ÷ 1 = $150 per line.',explain:'This is average revenue per line in the extract. It is not automatically a fair store-performance comparison if orders or product mix differ.'},
      interview:[{level:'Scenario',q:'What would you tell a manager about the North result?',a:'North contributed about 68.4% of revenue in this small checked extract; I would not generalize it to the full business without a complete representative dataset.'},{level:'Intermediate',q:'Why show line counts with regional revenue?',a:'Counts provide context about how much data supports each regional total and help avoid treating totals as comparable rates.'}],
      recap:['Keep the cleaned-data scope visible.','Revenue shares describe contribution, not causal performance.','Show counts and compare equivalent denominators.'],
      quiz:[['What records does the $790 total describe?',0],['How much revenue is from North?',1],['Approximately what share is $540 of $790?',2],['Which behavior is a common mistake?',3],['What context should accompany a regional total?',4]]
    },
    {
      id:'case-subscription-churn', title:'Case study: define a subscription churn rate',
      tagline:'Choose the denominator and period before interpreting cancellations.',
      definition:'Customer churn rate is the share of customers active at the start of a defined period who cancel during that period, under a stated business definition.',
      why:['Different denominators produce different rates.','New customers joining during the period may not have had the full period at risk.','A consistent definition makes comparisons over time meaningful.'],
      points:['Specify customer versus revenue churn, cancellation rules and the time window.','For this example, divide start-of-period customers who cancelled by start-of-period active customers.','Report the numerator, denominator, period and any exclusions; do not count new signups in this start-cohort denominator.'],
      mistakes:['Dividing by end-of-period customers without stating that choice.','Mixing customer churn with revenue churn.','Comparing periods with different cancellation or reactivation rules.'],
      example:{title:'Monthly customer churn',scenario:'At the start of May there are 200 active customers. Of those starting customers, 30 cancel during May. Twenty new customers join during May.',table:{rows:[['Measure','Count'],['Active at May start','200'],['Starting customers who cancel','30'],['New customers during May','20']]},task:'Calculate the stated start-cohort customer churn rate.',steps:['Use starting active customers as the denominator: 200.','Use cancellations from that starting group as the numerator: 30.','Rate = 30 ÷ 200 × 100 = 15%.','New signups are not added to this denominator; other business definitions may differ.'],result:'The defined May start-cohort customer churn rate is 15%. Ending active customers would be 200 − 30 + 20 = 190 if there are no other additions, reactivations or adjustments.'},
      practice:{q:'If 10 of 100 customers active at the start cancel, what is the start-cohort churn rate?',hint:'Divide starting customers who cancelled by customers active at the start.',solution:'10 ÷ 100 × 100 = 10%.',explain:'The numerator and denominator use the same starting customer cohort and stated period.'},
      interview:[{level:'Basic',q:'How do you define churn?',a:'I state whether it is customer or revenue churn, define the time window and cancellation event, and identify the denominator.'},{level:'Scenario',q:'Why exclude new signups from this example’s denominator?',a:'The chosen method measures the share of customers active at the period start who cancel; new signups were not in that starting cohort.'}],
      recap:['State the churn definition and time window.','Match numerator and denominator to the same cohort.','Here, 30 ÷ 200 = 15%.'],
      quiz:[['What is the denominator in this case?',0],['What does the numerator count?',1],['What is the calculated May churn rate?',2],['Which behavior is a common mistake?',3],['How should churn be communicated?',4]]
    },
    {
      id:'case-delivery-delays', title:'Case study: investigate delivery delays',
      tagline:'Use a distribution and operational context to explain a service issue.',
      definition:'An operations case combines a clear outcome definition, validated event data, distribution summaries and segment or time comparisons to locate an issue for follow-up.',
      why:['A mean alone can hide a long-delay tail.','The cause may differ by route, day or operating condition.','Useful recommendations depend on reliable timestamps and comparable groups.'],
      points:['Define delay consistently and verify dispatch and arrival timestamps.','For the example, the 10 sorted delays total 208 minutes, so the mean is 20.8 and median is 19 minutes.','Two of 10 delays exceed 30 minutes (20%); inspect those records and their routes before proposing a cause.'],
      mistakes:['Calling 20.8 minutes the delay for every delivery.','Removing the two long delays because they raise the mean.','Claiming a route caused delays without checking workload, weather or distance.'],
      example:{title:'Ten delivery delays',scenario:'Delay values in minutes: 5, 10, 12, 15, 18, 20, 22, 25, 31, 50.',table:{rows:[['Measure','Calculation','Result'],['Mean','208 ÷ 10','20.8 min'],['Median','(18 + 20) ÷ 2','19 min'],['Over 30 minutes','2 ÷ 10','20%']]},task:'Propose the next analysis step.',steps:['Verify the long delays against timestamps and delivery records.','Break out delays by route and day, showing delivery counts.','Check route distance, workload and known disruptions as possible explanations.','Recommend an intervention only after the pattern is checked and a way to evaluate it is defined.'],result:'The sample has a long-delay tail; the data identify a follow-up question, not a proven cause.'},
      practice:{q:'One route has 3 delays over 30 minutes out of 20 deliveries; another has 2 out of 5. Which has the higher rate?',hint:'Compare proportions, not only counts.',solution:'First route: 3 ÷ 20 = 15%. Second route: 2 ÷ 5 = 40%.',explain:'The second route has fewer long delays by count but the higher rate; the small denominator should also be reported.'},
      interview:[{level:'Scenario',q:'How do you investigate a long-delay tail?',a:'I validate the records, examine the distribution and compare routes and time periods with counts and rates, then investigate operational factors.'},{level:'Intermediate',q:'Why report median and mean?',a:'The mean uses all values and is sensitive to long delays; the median shows the middle observation and helps describe a skewed distribution.'}],
      recap:['Validate timestamps and define delay.','Use more than one summary for skewed data.','Investigate segments before attributing a cause.'],
      quiz:[['What is the sample mean delay?',0],['How many delays exceed 30 minutes?',1],['What is the median delay?',2],['Which behavior is a common mistake?',3],['What should happen before claiming a cause?',4]]
    },
    {
      id:'case-marketing-test', title:'Case study: read a marketing A/B test',
      tagline:'Calculate absolute and relative lift, then respect uncertainty.',
      definition:'An A/B test compares an outcome between groups assigned to different experiences. Its interpretation depends on randomization, measurement, sample size and a prespecified analysis.',
      why:['A fair comparison can estimate the effect of a change more credibly than a before/after comparison.','Absolute and relative changes answer different questions.','A point estimate alone does not show uncertainty or business value.'],
      points:['Calculate each conversion rate with purchases divided by eligible visitors.','For control 100/1,000 = 10%; for treatment 115/1,000 = 11.5%, an absolute lift of 1.5 percentage points and relative lift of 15%.','Do not claim statistical certainty from these counts alone; check design, uncertainty interval, planned stopping and guardrails.'],
      mistakes:['Calling the 1.5 percentage-point increase a 1.5% relative increase.','Declaring a winner based only on a dashboard point estimate.','Ignoring cancellations, errors or unequal assignment.'],
      example:{title:'Control and treatment conversion',scenario:'Assume eligible visitors were randomly assigned once, the outcome window is the same, and tracking is valid.',table:{rows:[['Group','Visitors','Purchases','Conversion'],['Control','1,000','100','10.0%'],['Treatment','1,000','115','11.5%']]},task:'Calculate absolute and relative lift.',steps:['Control rate = 100 ÷ 1,000 = 10.0%.','Treatment rate = 115 ÷ 1,000 = 11.5%.','Absolute lift = 11.5% − 10.0% = 1.5 percentage points.','Relative lift = 1.5 ÷ 10.0 = 15%.','Assess a confidence interval, prespecified stopping rule and guardrails before making a rollout decision.'],result:'Treatment conversion is 1.5 percentage points higher (15% relative lift) in this sample. The counts alone do not establish statistical significance or business value.'},
      practice:{q:'Control conversion is 8%; treatment conversion is 9%. What is the absolute lift in percentage points and relative lift?',hint:'Subtract for percentage points; divide the difference by control for relative lift.',solution:'Absolute lift = 9% − 8% = 1 percentage point. Relative lift = 1 ÷ 8 = 12.5%.',explain:'Percentage points are an absolute difference; relative lift expresses the difference as a share of the control rate.'},
      interview:[{level:'Basic',q:'What is the difference between percentage points and relative percent lift?',a:'Percentage points subtract the rates. Relative lift divides that difference by the control rate.'},{level:'Scenario',q:'The treatment rate is higher. Is that enough to ship?',a:'Not by itself. I check randomization, tracking, uncertainty, prespecified rules, guardrails and whether the effect is practically worthwhile.'}],
      recap:['Show both rates and denominators.','Distinguish absolute from relative lift.','Use uncertainty and guardrails before deciding.'],
      quiz:[['What is the control conversion rate?',0],['What is the treatment conversion rate?',1],['What is the absolute lift?',2],['Which behavior is a common mistake?',3],['What do the counts alone establish?',4]]
    },
    {
      id:'case-capstone', title:'Capstone: turn a messy file into a decision',
      tagline:'Bring cleaning, EDA and careful communication together.',
      definition:'An end-to-end analysis links a decision question to a documented dataset, validated transformations, descriptive findings and an appropriately limited recommendation.',
      why:['Real analysis involves choices across the whole workflow.','Quality checks and definitions determine which results are trustworthy.','A useful deliverable tells stakeholders what to do next and what remains uncertain.'],
      points:['Start with a scoped question and define grain, measures, groups and time window.','Audit, clean and validate without silently changing or discarding records.','Explore distributions and fair comparisons, then communicate findings, limitations and the next evidence needed.'],
      mistakes:['Skipping reconciliation after cleaning or joining.','Mixing exploratory observations with confirmed conclusions.','Recommending a broad action when the evidence covers only a small sample or period.'],
      example:{title:'Project brief: improve completed-order revenue',scenario:'Use the small retail extract from the earlier cases. The business wants to understand revenue by region and whether to investigate a sales change.',task:'Prepare an analysis plan and a defensible summary.',steps:['Define revenue as units × unit price for completed order lines with verified units.','Check line-level keys, duplicated exports, status, missing quantities and region labels.','Reconcile the eligible extract: four lines and $790 revenue.','Describe the observed regional revenue: North $540, South $150 and East $100; label the extract as illustrative and small.','Recommend checking a complete period and comparing revenue per eligible order or line before changing regional targets.'],result:'The small extract supports a checked descriptive summary only. It does not establish which region is most effective or why revenue differs.'},
      practice:{q:'What should a final project deliver alongside charts?',hint:'Think about reproducibility and what a decision-maker needs to judge the claim.',solution:'The question and definitions, source and scope, cleaning rules and validation checks, findings with denominators, limitations and a decision-relevant next step.',explain:'A chart without these details is difficult to audit and easy to overinterpret.'},
      interview:[{level:'Scenario',q:'How would you present a messy-data project to a manager?',a:'I summarize the decision question, data scope, key cleaning rules and validation, the main results with denominators, limitations and a practical next step.'},{level:'Intermediate',q:'How do you make an analysis reproducible?',a:'I preserve source data, document transformations and definitions, record exclusions, validate key totals and keep the analysis steps versioned.'}],
      recap:['Connect every result to the original question.','Show cleaning rules and validation evidence.','Make a recommendation proportional to the evidence.'],
      quiz:[['What should an end-to-end analysis connect?',0],['What should happen after cleaning?',1],['What does the small retail extract establish?',2],['Which behavior is a common mistake?',3],['What should a project recommendation match?',4]]
    }
  ];

  const genericDistractors = [
    'Treat every blank as zero and every unusual value as an error.',
    'Remove records whenever they make the result less convenient.',
    'Assume a visible pattern proves that one variable caused another.',
    'Ignore row meaning, denominators and source definitions.'
  ];
  const uniqueOptions = values => Array.from(new Set(values));

  lessons.forEach((item, lessonIndex) => {
    item.prereq = [];
    item.what = [item.definition];
    item.mcq = item.quiz.map((_, questionIndex) => {
      const answers = [
        item.definition,
        item.points[0],
        item.example.result,
        item.mistakes[0],
        item.recap[0]
      ];
      const prompts = [
        'What does "' + item.title + '" mean?',
        'Which practice is recommended for ' + item.title.toLowerCase() + '?',
        'What did the worked example show?',
        'Which is a common mistake in ' + item.title.toLowerCase() + '?',
        'Which is a key takeaway from ' + item.title.toLowerCase() + '?'
      ];
      const correct = answers[questionIndex];
      const pool = questionIndex === 3
        ? item.points
        : item.mistakes.concat(genericDistractors);
      const distractors = uniqueOptions(pool.filter(text => text !== correct)).slice(0, 3);
      if (distractors.length !== 3) throw new Error('Not enough quiz distractors for lesson: ' + item.id);
      const answerPosition = (lessonIndex + questionIndex) % 4;
      const options = distractors.slice(0, 3);
      options.splice(answerPosition, 0, correct);
      return { q:prompts[questionIndex], o:options, a:answerPosition, why:correct };
    });
    delete item.quiz;
  });

  const registeredIds = DP.courses.find(course => course.id === 'cases').sections.flatMap(section => section.lessons);
  const lessonIds = lessons.map(item => item.id);
  if (registeredIds.length !== lessonIds.length || registeredIds.some((id, index) => id !== lessonIds[index])) {
    throw new Error('Cleaning, EDA and case-study manifest does not match lesson content order.');
  }
  const byId = Object.create(null);
  lessons.forEach(item => { byId[item.id] = item; });
  DP.addLessons(byId);
})();
