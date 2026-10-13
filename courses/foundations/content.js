/* Datapath | Analytics foundations | lesson content
 * Introductory lessons developed from the analysis practices in the case-study course.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

  const lessons = {
    'foundation-analysis-workflow': {
      title:'Follow an analysis workflow',
      tagline:'Move from a decision question to a checked, useful result.',
      what:['A reliable analysis follows a sequence: clarify the decision, inspect the data, prepare it, explore results, then communicate what the evidence supports.','The workflow is iterative: a data-quality finding may require revisiting the question or metric.'],
      why:['A clear sequence reduces the risk of answering the wrong question.','Checks and documented decisions make results easier to review and repeat.'],
      points:['Clarify who will use the result and what decision it should inform.','Define the outcome, population, comparison and time period.','Inspect and prepare the data before calculating or charting.','Validate results, explain limitations and recommend a proportionate next step.'],
      mistakes:['Starting with a chart before defining what it should answer.','Changing data without recording the rule or checking its effect.','Treating an observed difference as proof of its cause.'],
      example:{title:'Did checkout become faster?',scenario:'A store manager asks whether checkout improved this month. You have transaction timestamps and the dates of a service change.',task:'Set out a defensible first pass.',steps:['Agree on when a checkout wait starts and ends.','Choose which transactions and dates count, and select a comparison period.','Check missing, duplicated and impossible timestamps.','Compare the defined measure, then report what changed and what remains uncertain.'],result:'The conclusion is tied to a defined measure and checked data, rather than an impression from a chart.'},
      practice:{q:'A delivery manager asks whether a new process improved service. What do you do before calculating?',hint:'Start with the intended decision, outcome and comparison.',solution:'Clarify what “improved” means, such as delivery time or on-time share; define eligible deliveries and dates; and agree on a suitable baseline or comparison group.',explain:'These definitions determine which records and calculations can answer the request.'},
      interview:[{level:'Basic',q:'What steps do you follow in an analysis?',a:'I clarify the decision and measures, inspect and prepare the data, explore and validate the results, then communicate findings, limitations and a next step.'}],
      mcq:[
        {q:'What should guide an analysis?',o:['A decision or question','The first chart available','The largest number in the file','A preferred conclusion'],a:0,why:'The analysis should answer a defined question that informs a decision.'},
        {q:'When should data-quality checks happen?',o:['Only after publishing','Before and during analysis','Only if the result looks wrong','Never for small files'],a:1,why:'Early checks reveal problems that could invalidate later calculations.'},
        {q:'What should you do after finding a data issue?',o:['Hide it','Change values without noting it','Investigate, document and validate any correction','Delete the whole dataset'],a:2,why:'Data changes need a justified rule and checks that show their effect.'},
        {q:'An observed difference between periods proves the process change caused it.',o:['True in every case','False; other explanations may exist','True if shown in a chart','True when the sample is large'],a:1,why:'An observed association alone does not establish causation.'},
        {q:'What belongs in a useful final result?',o:['Only a chart','A number with no definition','Evidence, limitations and a relevant next step','Every calculation ever tried'],a:2,why:'A clear result gives decision-makers context and an appropriately cautious action.'}
      ],
      recap:['Start from the decision and define the measure.','Check and prepare data before interpreting results.','Communicate evidence, limitations and a useful next step.']
    },
    'foundation-measurable-question': {
      title:'Turn a request into a measurable question',
      tagline:'Replace vague goals with outcomes and comparisons you can define.',
      what:['A measurable question states the outcome, who or what is included, the time period and any comparison.','A decision question also makes clear how the answer will be used.'],
      why:['Different definitions of a vague word such as “better” can produce different answers.','Agreeing on scope prevents selecting a metric after seeing which result looks favorable.'],
      points:['Ask what decision the answer should support.','Define the outcome in observable terms and state its unit.','Specify the population, time window and baseline or comparison.','Record exclusions and assumptions before looking at results.'],
      mistakes:['Treating “customer satisfaction improved” as a complete metric definition.','Comparing periods with different lengths or eligibility rules.','Changing the outcome after seeing the data.'],
      example:{title:'Make “customers are happier” measurable',scenario:'A team wants to know whether a new support process made customers happier.',task:'Write a more specific question.',steps:['Choose an observable outcome, such as the share of eligible respondents selecting a top-box rating.','Define which support interactions and customer responses are eligible.','Set the period and a comparable baseline.','State how missing responses will be handled and what decision the result will inform.'],result:'A defined outcome, population, period and baseline make the question answerable and reviewable.'},
      practice:{q:'A request says “Did sales improve?” What details should you clarify?',hint:'Name the measure, scope and comparison.',solution:'Clarify whether sales means revenue, units, orders or another measure; the products, regions and channels included; the period; and the baseline for comparison.',explain:'The answer can change with the metric, scope and comparison chosen.'},
      interview:[{level:'Scenario',q:'How do you handle a vague analysis request?',a:'I ask what decision is needed, agree on an observable outcome, define who and when is included, and establish a comparison before analyzing.'}],
      mcq:[
        {q:'Which makes a question measurable?',o:['“Make things better”','An outcome, population, period and comparison','A chart type','A large dataset'],a:1,why:'Those details define what evidence is relevant.'},
        {q:'Why define a metric before inspecting results?',o:['To prevent changing the target to fit an observed result','To guarantee the metric rises','To avoid checking the data','To remove the need for context'],a:0,why:'Predefining the outcome reduces result-driven metric selection.'},
        {q:'Which is an observable customer-support outcome?',o:['Happier in every way','Share of eligible respondents giving a 5/5 rating','Better service somehow','More positive feeling'],a:1,why:'A defined response and denominator make the measure interpretable.'},
        {q:'What should a comparison period have?',o:['A similar scope and stated definition','A different metric','No dates','Only favorable results'],a:0,why:'Comparable scope and definitions make the comparison meaningful.'},
        {q:'What should you clarify first about a business request?',o:['Which conclusion to publish','What decision the analysis should inform','Which color to use','How to maximize the metric'],a:1,why:'The decision establishes the purpose and needed evidence.'}
      ],
      recap:['Translate vague words into observable outcomes.','Define population, period and comparison.','Agree on assumptions before reviewing results.']
    },
    'foundation-grain-and-metrics': {
      title:'Understand rows, grain and metrics',
      tagline:'Know what one record represents before counting or joining.',
      what:['The grain is the real-world unit represented by one row, such as one order, one order line or one customer per month.','A metric is a defined calculation whose numerator, denominator, unit and eligible records match the question.'],
      why:['Counting rows as business entities can overcount when each entity has multiple records.','Clear metric definitions make rates and summaries comparable.'],
      points:['Describe one row in a sentence before aggregating.','Identify a key that distinguishes records at that grain.','Check whether repeated IDs represent valid detail or duplicate records.','For a rate, name both numerator and denominator and ensure the denominator matches the target population.'],
      mistakes:['Assuming one row equals one order when rows are order lines.','Removing repeated customer IDs even when each represents a separate order.','Reporting a percentage without its count, denominator or period.'],
      example:{title:'Orders and order lines',scenario:'An order-lines table contains two products for order A-10 and one product for order A-11.',table:{rows:[['Order ID','Line','Product'],['A-10','1','Desk'],['A-10','2','Chair'],['A-11','1','Lamp']]},task:'How many orders and how many order lines are represented?',steps:['Each row represents one order line, so there are three lines.','Order ID repeats for valid lines in the same order.','There are two distinct orders.','Use Order ID plus line number, or a line identifier, to identify each line.'],result:'The row count is three order lines, not three orders.'},
      practice:{q:'A file has 500 rows but 320 distinct customer IDs. Can you report 500 customers?',hint:'Determine the row grain and why IDs repeat.',solution:'Not without checking. If each row is a transaction, customers can have multiple rows; count distinct eligible customer IDs for a customer count.',explain:'Row counts describe records at the table grain, not automatically unique entities.'},
      interview:[{level:'Basic',q:'What does grain mean in a dataset?',a:'It is what one row represents. I identify it before counting entities, aggregating measures or joining tables.'}],
      mcq:[
        {q:'What is the grain of a table?',o:['The color of its chart','The real-world unit represented by one row','The number of columns','A table title'],a:1,why:'Grain describes what each record represents.'},
        {q:'An order has three product lines. In a line-level table, how many rows may it have?',o:['One always','Three','Zero','One per customer'],a:1,why:'A line-level table can contain one row per product line.'},
        {q:'What is a repeated customer ID in a transaction table?',o:['Always a duplicate error','Potentially valid multiple transactions','Proof the table is corrupted','A missing value'],a:1,why:'Repeated IDs can be expected when the grain is transaction-level.'},
        {q:'What should accompany a reported rate?',o:['Numerator, denominator and period','Only a rounded percentage','A color legend','A file name'],a:0,why:'The counts and period explain how the rate was calculated.'},
        {q:'How many customers are represented by 500 rows and 320 distinct customer IDs?',o:['Always 500','320 distinct IDs, subject to eligibility and data checks','820','Unknown because rows cannot be counted'],a:1,why:'Distinct IDs count customers if the identifier and eligible population are valid.'}
      ],
      recap:['State what one row represents.','Distinguish record counts from entity counts.','Define the numerator, denominator and period for rates.']
    },
    'foundation-data-audit': {
      title:'Audit data before using it',
      tagline:'Inspect the source and quality before cleaning or calculating.',
      what:['A data audit records where data came from, what its fields and rows mean, and whether its values are complete and plausible for the question.','An audit identifies items to investigate; it does not assume every unusual value is an error.'],
      why:['Unexpected blanks, duplicates or types can change a result.','A saved raw source and recorded checks make transformations easier to review.'],
      points:['Keep an untouched source copy and note its origin and date.','Check dimensions, field meanings, types, missingness, unique values and ranges.','Inspect suspicious records against source information or business rules.','Record cleaning decisions and validate row counts and key measures afterward.'],
      mistakes:['Checking only the first few rows.','Dropping every duplicate-looking ID without understanding the grain.','Replacing blanks with zero without confirming what a blank means.'],
      example:{title:'A first look at an order file',scenario:'A file has 1,200 rows, four blank unit values, mixed “North” and “north” labels, and two more rows than distinct order IDs.',task:'Choose checks before changing the data.',steps:['Confirm whether a row is an order or an order line; repeated order IDs may be valid.','Inspect the records with blank units and determine whether the value is unknown, not applicable or an error.','Check whether region casing represents the same category.','Verify the source and meaning of each issue before applying a documented rule.'],result:'The audit produces questions to resolve while preserving the original data.'},
      practice:{q:'A numeric column includes a value far above the rest. What do you do?',hint:'A flag is a reason to investigate, not an instruction to delete.',solution:'Check the source record, units, business rules and related fields. If the value is valid, retain it and consider how it affects summaries; if it is wrong, document and validate the correction.',explain:'An extreme value can be either an error or a valid rare event.'},
      interview:[{level:'Scenario',q:'What do you do when an audit finds unusual values?',a:'I inspect the affected records and verify them against the source or a business rule before changing anything. I document the decision and check its impact.'}],
      mcq:[
        {q:'What is the purpose of a data audit?',o:['To delete unusual rows quickly','To understand source, structure and quality before analysis','To guarantee a desired outcome','To make every column numeric'],a:1,why:'An audit establishes context and surfaces issues for investigation.'},
        {q:'How should an unusual value be treated?',o:['Always delete it','Investigate it against source and context','Always replace it with the mean','Ignore it'],a:1,why:'Unusual observations can be errors or valid events.'},
        {q:'Why preserve an untouched source?',o:['To compare and review transformations','To prevent all missing values','To hide changes','To avoid defining fields'],a:0,why:'A raw copy supports an auditable record of data changes.'},
        {q:'A repeated ID means duplicate rows.',o:['Always true','Not necessarily; check the row grain','True for every dataset','Only if the file is large'],a:1,why:'Repeated IDs can represent legitimate multiple records for one entity.'},
        {q:'What should follow a cleaning change?',o:['No further checks','Validation of rows and relevant measures','Deletion of the source','A new unrecorded edit'],a:1,why:'Validation helps ensure the transformation had the intended effect.'}
      ],
      recap:['Understand source, structure and row meaning first.','Investigate anomalies before editing.','Document changes and validate their effects.']
    },
    'foundation-exploratory-analysis': {
      title:'Explore patterns responsibly',
      tagline:'Use summaries and charts to learn what to investigate next.',
      what:['Exploratory data analysis (EDA) uses summaries, tables and visualizations to understand quality, distributions, trends, group differences and possible relationships.','Exploration helps form questions; a pattern found while exploring is not automatically a confirmed explanation.'],
      why:['A single average can hide skew, gaps or distinct groups.','Careful exploration can locate where a change occurred and guide follow-up analysis.'],
      points:['Start with the question, definitions and data-quality checks.','Inspect distributions and trends before drilling into many subgroups.','Compare groups with consistent definitions, periods and denominators.','Keep exploratory patterns labeled as hypotheses until they are validated.'],
      mistakes:['Searching many slices until one looks favorable.','Comparing counts when group sizes differ substantially.','Claiming a cause based only on an observed association.'],
      example:{title:'Investigate a weekly order drop',scenario:'Weekly orders appear 8% lower than the prior week.',task:'Plan an initial exploration without assuming a cause.',steps:['Confirm week boundaries, order status and counting grain.','Check that expected dates and data sources loaded for both weeks.','Compare daily counts and examine relevant regions or channels with consistent denominators.','Check operational context as possible explanations and treat them as hypotheses.'],result:'EDA can locate when and where the decrease appears; it does not prove why it happened.'},
      practice:{q:'After checking dozens of segments, one shows a large increase. How should you report it?',hint:'Think about how the pattern was discovered and whether it was planned.',solution:'Label it exploratory, check its data and denominator, report how many comparisons were examined, and validate it with suitable additional evidence before presenting it as confirmed.',explain:'Many comparisons can produce striking-looking patterns by chance.'},
      interview:[{level:'Basic',q:'What is exploratory data analysis used for?',a:'To understand data quality, distributions and patterns, and to develop questions for further analysis without overstating what the exploration proves.'}],
      mcq:[
        {q:'What is EDA primarily for?',o:['Finding patterns and questions to investigate','Proving causation from any chart','Replacing data checks','Picking the most favorable segment'],a:0,why:'EDA helps understand data and guide further analysis.'},
        {q:'What should you check before comparing weekly counts?',o:['Week definitions, grain and completeness','Chart colors only','Whether the totals are identical','Nothing if the difference is large'],a:0,why:'Consistent definitions and complete data are needed for a fair comparison.'},
        {q:'A pattern discovered after many segment comparisons is best described as:',o:['A guaranteed causal result','An exploratory hypothesis to validate','A proven forecast','A data-quality rule'],a:1,why:'Post-hoc patterns need validation and appropriate caveats.'},
        {q:'Why use rates as well as counts for unequal groups?',o:['Rates account for different group sizes','Rates always prove causation','Counts cannot be checked','Rates remove missing data'],a:0,why:'A denominator puts counts in context when group sizes differ.'},
        {q:'Does an association by itself prove a cause?',o:['Yes, if plotted','No; other explanations may account for it','Yes, for large files','Only for weekly data'],a:1,why:'Association alone does not establish causation.'}
      ],
      recap:['Explore quality, distributions and patterns.','Use consistent denominators and definitions.','Treat exploratory findings as hypotheses until validated.']
    },
    'foundation-communicate-evidence': {
      title:'Communicate evidence and limitations',
      tagline:'Give decision-makers a clear result they can interpret responsibly.',
      what:['A useful analytical message states the question, the result, the evidence behind it, important limitations and a practical next step.','Recommendations should be proportionate to the strength and scope of the evidence.'],
      why:['Decision-makers need context to understand what a number does and does not mean.','Explicit definitions and caveats make results more trustworthy and reusable.'],
      points:['Lead with the answer to the agreed question.','Include the measure, units, population and period.','Show the relevant comparison and supporting counts.','Separate observed results from interpretation, limitations and recommendations.'],
      mistakes:['Showing a percentage without a denominator or timeframe.','Using causal wording for an observational comparison.','Hiding caveats that could change the decision.'],
      example:{title:'Report a delivery-time comparison',scenario:'A reviewed sample has a median delivery delay of 19 minutes; 2 of 10 deliveries exceeded 30 minutes.',task:'Write a concise, careful summary.',steps:['State the defined sample and time period.','Report the median with units and the long-delay share with its denominator.','Explain that these summaries describe the sample and do not establish why delays occurred.','Recommend checking routes and operating conditions before choosing an intervention.'],result:'The report gives a clear descriptive result and a follow-up without claiming an unproven cause.'},
      practice:{q:'A dashboard says “conversion improved by 15%.” What context should accompany the claim?',hint:'Clarify the calculation and study context.',solution:'State the control and treatment rates, absolute percentage-point change, counts and denominators, time window, assignment or comparison method, and relevant uncertainty or limitations.',explain:'Relative lift alone can obscure the baseline rate and the amount of evidence behind the comparison.'},
      interview:[{level:'Scenario',q:'How do you present an uncertain finding to a manager?',a:'I state the result and its definition, show the comparison and supporting counts, explain the uncertainty and limitations, and recommend a next step that fits the evidence.'}],
      mcq:[
        {q:'What makes a metric interpretable?',o:['Definition, units, population and period','A large font','A rounded value alone','A chart title only'],a:0,why:'These details clarify what the number describes.'},
        {q:'How should an observational result be described?',o:['As proof of cause','As an observed association unless causal evidence supports more','Without any context','As a guaranteed forecast'],a:1,why:'Avoid causal claims that the study design does not support.'},
        {q:'What should support a reported rate?',o:['Its numerator and denominator','Only its color','An unrelated total','No counts'],a:0,why:'Counts reveal the scale and denominator behind the rate.'},
        {q:'How strong should a recommendation be?',o:['As strong as the headline sounds','Proportionate to the evidence and limitations','Always immediate and permanent','Unrelated to the question'],a:1,why:'The action should reflect evidence strength and uncertainty.'},
        {q:'What belongs in a concise analytical report?',o:['Result, evidence, limitations and next step','Only raw data','Only the analyst’s opinion','Every intermediate calculation'],a:0,why:'These elements help users understand and act on the result responsibly.'}
      ],
      recap:['State the result with its definition and context.','Separate evidence from interpretation and limitations.','Match the recommendation to what the evidence supports.']
    }
  };

  const deep = {
    'foundation-analysis-workflow': {
      level:'Beginner',
      tldr:'A repeatable workflow connects a defined decision to checked data and a proportionate recommendation.',
      intuition:{text:['Analysis is a chain of decisions, not just a calculation. Each step should preserve the link between the original question and the final message.'],analogy:'Treat the workflow like a recipe: define the intended result, check the ingredients, follow recorded steps and taste-test before serving.'},
      how:['Write down the decision and the outcome it depends on.','Check the population, period, source and row grain.','Prepare the data with documented rules.','Explore and validate the result, then communicate limitations and the next step.']
    },
    'foundation-measurable-question': {
      level:'Beginner',
      tldr:'Define the outcome, population, time period and comparison before examining results.',
      intuition:{text:['A question is measurable when two analysts can identify which records to use and which calculation answers it.'],analogy:'A vague destination such as “somewhere better” cannot guide a route; a measurable question names the destination and starting point.'},
      how:['Clarify the decision.','Translate vague terms into an observable outcome.','Specify eligible records, time window and comparison.','Document assumptions before analysis.']
    },
    'foundation-grain-and-metrics': {
      level:'Beginner',
      tldr:'Understand what a row represents and define the counts behind each metric.',
      intuition:{text:['A table is a collection of records at a particular level of detail. Counting records is not the same as counting customers, orders or other entities.'],analogy:'A receipt can list many line items but still belong to one purchase.'},
      how:['Describe one row in plain language.','Identify the key at that level.','Check repeated identifiers against the business meaning.','Define each metric, including units and denominator.']
    },
    'foundation-data-audit': {
      level:'Beginner',
      tldr:'Inspect the source, structure and quality before deciding how to clean data.',
      intuition:{text:['An audit is a list of questions to verify, not a license to change every value that looks unusual.'],analogy:'Like checking labels and quantities before cooking, inspect the data before using it in a calculation.'},
      how:['Record source and preserve a raw copy.','Check dimensions, types, missingness, unique values and ranges.','Investigate anomalies against source or rules.','Document changes and validate downstream measures.']
    },
    'foundation-exploratory-analysis': {
      level:'Beginner',
      tldr:'Use EDA to understand patterns and form questions, not to overstate exploratory results.',
      intuition:{text:['Exploration is a map of where to look next; it is not, by itself, an explanation of why a pattern happened.'],analogy:'A weather map helps identify where to investigate but does not alone explain the cause of every storm.'},
      how:['Check definitions and completeness.','Summarize distributions and trends.','Compare relevant groups with consistent denominators.','Validate exploratory findings before turning them into conclusions.']
    },
    'foundation-communicate-evidence': {
      level:'Beginner',
      tldr:'Report the result with enough context to judge its meaning, limits and appropriate next step.',
      intuition:{text:['A number becomes useful when the reader knows what it measures, who it describes, when it applies and how certain it is.'],analogy:'A measurement without units is like a distance without saying whether it is metres or kilometres.'},
      how:['Lead with the answer to the agreed question.','Give the definition, period, comparison and counts.','State limitations and separate association from cause.','Recommend a proportionate next step.']
    }
  };

  DP.addLessons(lessons);
  Object.keys(deep).forEach(id => { DP.deep[id] = deep[id]; });
})();
