/* Datapath | SQL | String functions
 * Lessons in this file: upper-sql, lower-sql, length-sql, substring-sql, concat-sql, trim-sql, replace-sql
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
  const { CUST } = DP.datasets.sql;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- upper-sql --- */
'upper-sql': {
  title:'UPPER', tagline:'Turn text into capital letters.',
  prereq:['select'],
  what:['UPPER converts every letter to uppercase.','Numbers and symbols stay as they are.','UCASE is a synonym in MySQL.'],
  why:['Standardise codes and states.','Compare text without worrying about case.'],
  syntax:{ code:'UPPER(text)', parts:[['text','A column or text value.']] },
  points:['Does not change the stored data, only the result.','Useful for case-insensitive comparison on case-sensitive systems.','Works inside WHERE, ORDER BY and joins.','Combine with TRIM for clean codes.','Applying it to an indexed column in WHERE can stop index use.'],
  mistakes:['Expecting the table to change.','Using it on a large indexed column in WHERE.','Forgetting NULL stays NULL.'],
  example:{ title:'City codes in capitals', scenario:'A report needs cities in capital letters.',
    table:withHl(CUST,{'C2:C5':'range'},'Table: customers'), task:'Return the city in uppercase.', formula:'SELECT name, UPPER(city) AS city_upper\nFROM customers;',
    steps:['UPPER converts each city.'],
    table2:{ rows:[['name','city_upper'],['Asha','PUNE'],['Bilal','DELHI'],['Chitra','PUNE'],['Deepak','MUMBAI']], caption:'Result' }, result:'Cities are in capitals; the table is unchanged.' },
  practice:{ q:'Write a query that returns each customer\'s name in capitals.', table:T(CUST,'Table: customers'), hint:'Use UPPER(name).', solution:'SELECT UPPER(name)\nFROM customers;', explain:'The result is ASHA, BILAL, CHITRA and DEEPAK.' },
  interview:[
    { level:'Basic', q:'What does UPPER do?', a:'It returns the text with all letters in capitals.' },
    { level:'Intermediate', q:'Does UPPER change the data in the table?', a:'No. It only changes the value in the result. To change stored data, I use UPDATE with UPPER.' },
    { level:'Intermediate', q:'Why might UPPER in WHERE slow a query?', a:'A function on the column prevents the database from using an index on it. I store clean data or use a functional index.' },
    { level:'Scenario', q:'Join two tables where state codes differ in case.', a:'ON UPPER(a.state) = UPPER(b.state), or better, clean the data once so the plain join works.' }
  ],
  mcq:[
    { q:'What does UPPER(\'asha\') return?', o:['ASHA','Asha','asha','ASHa'], a:0, why:'All letters become capitals.' },
    { q:'Does UPPER change the table?', o:['No','Yes','Only in MySQL','Only text'], a:0, why:'Only the result changes.' },
    { q:'UPPER(NULL) returns:', o:['NULL','Empty text','0','Error'], a:0, why:'Functions on NULL give NULL.' },
    { q:'MySQL synonym for UPPER:', o:['UCASE','UP','CAPS','TOUPPER'], a:0, why:'UCASE does the same.' },
    { q:'A drawback of UPPER on an indexed column in WHERE:', o:['Index may not be used','Table locks','Data changes','Error'], a:0, why:'Functions can block index use.' }
  ],
  recap:['UPPER returns text in capitals.','It does not change stored data.','Avoid wrapping indexed columns in WHERE.']
},

/* --- lower-sql --- */
'lower-sql': {
  title:'LOWER', tagline:'Turn text into lowercase letters.',
  prereq:['upper-sql'],
  what:['LOWER converts every letter to lowercase.','LCASE is a synonym in MySQL.','Numbers and symbols stay the same.'],
  why:['Standardise emails and usernames.','Prepare text for comparison.'],
  syntax:{ code:'LOWER(text)', parts:[['text','A column or text value.']] },
  points:['Does not change stored data.','Emails are usually stored in lowercase.','Combine with TRIM for clean values.','UPDATE with LOWER can clean the table permanently.','NULL stays NULL.'],
  mistakes:['Using LOWER on names for display.','Expecting stored data to change.','Forgetting TRIM.'],
  example:{ title:'Cities in lowercase', scenario:'You want cities in lowercase for matching.',
    table:withHl(CUST,{'C2:C5':'range'},'Table: customers'), task:'Return the city in lowercase.', formula:'SELECT name, LOWER(city) AS city_lower\nFROM customers;',
    steps:['LOWER converts each city.'],
    table2:{ rows:[['name','city_lower'],['Asha','pune'],['Bilal','delhi'],['Chitra','pune'],['Deepak','mumbai']], caption:'Result' }, result:'All cities appear in lowercase.' },
  practice:{ q:'Write a query that returns names in lowercase.', table:T(CUST,'Table: customers'), hint:'Use LOWER(name).', solution:'SELECT LOWER(name)\nFROM customers;', explain:'The result is asha, bilal, chitra and deepak.' },
  interview:[
    { level:'Basic', q:'What does LOWER do?', a:'It converts all letters in a text to lowercase.' },
    { level:'Intermediate', q:'How do you permanently store emails in lowercase?', a:'UPDATE users SET email = LOWER(TRIM(email)); I test with a SELECT first.' },
    { level:'Intermediate', q:'Is a comparison with = case sensitive in MySQL?', a:'By default no, because of the collation. In other systems, such as PostgreSQL, it is, and LOWER on both sides helps.' },
    { level:'Scenario', q:'Find duplicate emails that differ only by case.', a:'SELECT LOWER(email), COUNT(*) FROM users GROUP BY LOWER(email) HAVING COUNT(*) > 1;' }
  ],
  mcq:[
    { q:'What does LOWER(\'ASHA\') return?', o:['asha','Asha','ASHA','aSHA'], a:0, why:'All letters become lowercase.' },
    { q:'Does LOWER change the table?', o:['No','Yes','Only emails','Only text'], a:0, why:'Only results change.' },
    { q:'MySQL synonym for LOWER:', o:['LCASE','LOW','SMALL','TOLOWER'], a:0, why:'LCASE is a synonym.' },
    { q:'Which cleans an email for storage?', o:['LOWER(TRIM(email))','LOWER+TRIM','TRIM(LOW)','UPPER(email)'], a:0, why:'Nest TRIM inside LOWER.' },
    { q:'LOWER(NULL) returns:', o:['NULL','Empty text','0','Error'], a:0, why:'NULL in, NULL out.' }
  ],
  recap:['LOWER returns text in lowercase.','Combine with TRIM to clean emails.','UPDATE with LOWER makes it permanent.']
},

/* --- length-sql --- */
'length-sql': {
  title:'LENGTH and CHAR_LENGTH', tagline:'Count the characters in a text.',
  prereq:['select'],
  what:['LENGTH returns the size of a text.','In MySQL, LENGTH counts **bytes** and CHAR_LENGTH counts **characters**.','SQL Server and PostgreSQL use LEN and LENGTH for characters.'],
  why:['Validate IDs and phone numbers.','Find overly long or empty text.'],
  syntax:{ code:'CHAR_LENGTH(text)\nLENGTH(text)', parts:[['CHAR_LENGTH','Number of characters.'],['LENGTH','Number of bytes in MySQL.']] },
  points:['For plain English text, LENGTH and CHAR_LENGTH match.','For characters such as accented letters or emoji, they differ.','Spaces count as characters.','LENGTH(NULL) is NULL.','SQL Server uses `LEN` (ignores trailing spaces).'],
  mistakes:['Using LENGTH for characters in MySQL with non-English text.','Forgetting spaces count.','Using LEN in MySQL.'],
  example:{ title:'Name lengths', scenario:'You want to know how long each customer name is.',
    table:withHl(CUST,{'B2:B5':'range'},'Table: customers'), task:'Return each name with its length.', formula:'SELECT name, CHAR_LENGTH(name) AS len\nFROM customers;',
    steps:['CHAR_LENGTH counts the characters of each name.'],
    table2:{ rows:[['name','len'],['Asha',4],['Bilal',5],['Chitra',6],['Deepak',6]], caption:'Result' }, result:'Asha has 4 characters and Chitra and Deepak have 6.' },
  practice:{ q:'Write a query for customers whose name is longer than 5 characters.', table:T(CUST,'Table: customers'), hint:'Use CHAR_LENGTH in WHERE.', solution:'SELECT name\nFROM customers\nWHERE CHAR_LENGTH(name) > 5;', explain:'Chitra (6) and Deepak (6) qualify.' },
  interview:[
    { level:'Basic', q:'What does LENGTH return in MySQL?', a:'The length in bytes. For characters I use CHAR_LENGTH.' },
    { level:'Intermediate', q:'What are the equivalents in SQL Server and PostgreSQL?', a:'SQL Server uses LEN (characters, ignoring trailing spaces) and PostgreSQL uses LENGTH or CHAR_LENGTH for characters.' },
    { level:'Intermediate', q:'How do you find phone numbers that are not 10 digits?', a:'WHERE CHAR_LENGTH(phone) <> 10, after removing hyphens and spaces with REPLACE.' },
    { level:'Scenario', q:'How do you detect values with hidden spaces?', a:'WHERE CHAR_LENGTH(col) <> CHAR_LENGTH(TRIM(col)).' }
  ],
  mcq:[
    { q:'CHAR_LENGTH(\'Deepak\') returns:', o:['6','5','7','4'], a:0, why:'Six characters.' },
    { q:'LENGTH in MySQL counts:', o:['Bytes','Characters','Words','Lines'], a:0, why:'Use CHAR_LENGTH for characters.' },
    { q:'SQL Server function for length:', o:['LEN','LENGTH','SIZE','COUNT'], a:0, why:'SQL Server uses LEN.' },
    { q:'Do spaces count?', o:['Yes','No','Only leading','Only trailing'], a:0, why:'Spaces are characters.' },
    { q:'LENGTH(NULL) returns:', o:['NULL','0','1','Error'], a:0, why:'NULL in, NULL out.' }
  ],
  recap:['CHAR_LENGTH counts characters; MySQL LENGTH counts bytes.','SQL Server uses LEN.','Compare with TRIM to find hidden spaces.']
},

/* --- substring-sql --- */
'substring-sql': {
  title:'SUBSTRING, LEFT and RIGHT', tagline:'Take part of a text.',
  prereq:['length-sql'],
  what:['SUBSTRING takes characters from a position.','LEFT and RIGHT take from the start or end.','Positions start at 1.'],
  why:['Pull prefixes, codes, years from references.'],
  syntax:{ code:'SUBSTRING(text, start, length)\nLEFT(text, n)\nRIGHT(text, n)', parts:[['start','First position, counting from 1.'],['length','How many characters to return. Optional.'],['n','Number of characters from the start or end.']] },
  points:['Positions start at **1**, not 0.','Without length, SUBSTRING returns everything from start.','Negative start counts from the end in MySQL.','`SUBSTR` is a synonym.','Use with LOCATE or INSTR for variable positions.'],
  mistakes:['Starting at 0.','Forgetting spaces count.','Hard-coding positions for variable text.'],
  example:{ title:'First three letters', scenario:'You want a short code made of the first three letters of each name.',
    table:withHl(CUST,{'B2:B5':'range'},'Table: customers'), task:'Return the first three letters.', formula:'SELECT name, SUBSTRING(name, 1, 3) AS code\nFROM customers;',
    steps:['Start at position 1 and take 3 characters.'],
    table2:{ rows:[['name','code'],['Asha','Ash'],['Bilal','Bil'],['Chitra','Chi'],['Deepak','Dee']], caption:'Result' }, result:'LEFT(name, 3) gives the same result.' },
  practice:{ q:'Write a query that returns the last two letters of each name.', table:T(CUST,'Table: customers'), hint:'Use RIGHT.', solution:'SELECT RIGHT(name, 2)\nFROM customers;', explain:'The result is ha, al, ra and ak.' },
  interview:[
    { level:'Basic', q:'What are the arguments of SUBSTRING?', a:'The text, the start position (first character is 1) and optionally how many characters to return.' },
    { level:'Intermediate', q:'How do you take the text before the @ in an email?', a:'SUBSTRING_INDEX(email, \'@\', 1) in MySQL, or LEFT(email, LOCATE(\'@\', email) - 1).' },
    { level:'Intermediate', q:'What is the difference between LEFT and SUBSTRING?', a:'LEFT(text, n) is shorthand for SUBSTRING(text, 1, n).' },
    { level:'Scenario', q:'Invoice numbers look like INV-2026-0045. Extract the year.', a:'SUBSTRING(inv_no, 5, 4) takes four characters from position 5.' }
  ],
  mcq:[
    { q:'Where do positions start in SUBSTRING?', o:['1','0','2','-1'], a:0, why:'The first character is position 1.' },
    { q:'SUBSTRING(\'Chitra\', 1, 3) returns:', o:['Chi','Chit','hit','tra'], a:0, why:'Three characters from position 1.' },
    { q:'RIGHT(\'Deepak\', 2) returns:', o:['ak','De','ea','pa'], a:0, why:'The last two characters.' },
    { q:'LEFT(text, 3) equals:', o:['SUBSTRING(text,1,3)','SUBSTRING(text,0,3)','RIGHT(text,3)','LENGTH(text)'], a:0, why:'LEFT starts at position 1.' },
    { q:'Which MySQL function splits on a delimiter?', o:['SUBSTRING_INDEX','SPLIT','CUT','PARSE'], a:0, why:'SUBSTRING_INDEX returns text before or after a delimiter.' }
  ],
  recap:['SUBSTRING takes characters from a position starting at 1.','LEFT and RIGHT take from the ends.','Use SUBSTRING_INDEX or LOCATE for variable positions.']
},

/* --- concat-sql --- */
'concat-sql': {
  title:'CONCAT and CONCAT_WS', tagline:'Join text values into one.',
  prereq:['select'],
  what:['CONCAT joins values into one text.','CONCAT_WS joins with a separator and skips NULLs.','The standard operator is `||` in PostgreSQL and Oracle.'],
  why:['Build full names, addresses and labels.'],
  syntax:{ code:'CONCAT(text1, text2, ...)\nCONCAT_WS(separator, text1, text2, ...)', parts:[['CONCAT','Joins as given. Any NULL makes the whole result NULL.'],['CONCAT_WS','Separator first; NULL values are skipped.']] },
  points:['In MySQL, CONCAT with a NULL returns NULL.','CONCAT_WS skips NULLs and puts separators only between values.','Numbers are converted to text automatically.','PostgreSQL and Oracle use `||`; SQL Server uses `+` or CONCAT.','Add spaces yourself: `CONCAT(a, \' \', b)`.'],
  mistakes:['A NULL silently blanking the whole result.','Forgetting spaces.','Using + in MySQL.'],
  example:{ title:'Name and city label', scenario:'You want a label such as Asha - Pune.',
    table:withHl(CUST,{'B2:C5':'range'},'Table: customers'), task:'Join name and city with a dash.', formula:'SELECT CONCAT(name, \' - \', city) AS label\nFROM customers;',
    steps:['CONCAT joins the name, a dash with spaces, and the city.'],
    table2:{ rows:[['label'],['Asha - Pune'],['Bilal - Delhi'],['Chitra - Pune'],['Deepak - Mumbai']], caption:'Result' }, result:'One text value per customer.' },
  practice:{ q:'Write a query that returns city and name as "Pune, Asha" using CONCAT_WS.', table:T(CUST,'Table: customers'), hint:'The separator comes first.', solution:'SELECT CONCAT_WS(\', \', city, name)\nFROM customers;', explain:'CONCAT_WS puts \', \' between the values, giving Pune, Asha for the first row.' },
  interview:[
    { level:'Basic', q:'What does CONCAT do?', a:'It joins several values into one text.' },
    { level:'Intermediate', q:'What happens when one argument of CONCAT is NULL?', a:'In MySQL the result is NULL. I use CONCAT_WS, which skips NULLs, or COALESCE each value.' },
    { level:'Intermediate', q:'How do you join text in PostgreSQL?', a:'With the || operator, or CONCAT, which treats NULL as empty.' },
    { level:'Scenario', q:'Build an address from street, city and an optional landmark.', a:'CONCAT_WS(\', \', street, landmark, city). NULL landmarks are skipped without stray commas.' }
  ],
  mcq:[
    { q:'MySQL CONCAT with a NULL argument returns:', o:['NULL','The other text','Empty','Error'], a:0, why:'Any NULL makes the result NULL.' },
    { q:'Which skips NULLs?', o:['CONCAT_WS','CONCAT','JOIN','MERGE'], a:0, why:'CONCAT_WS ignores NULLs.' },
    { q:'Which operator joins text in PostgreSQL?', o:['||','+','&','.'], a:0, why:'|| is the standard.' },
    { q:'CONCAT(\'A\', \' \', \'B\') returns:', o:['A B','AB','A  B','B A'], a:0, why:'The space is included.' },
    { q:'CONCAT_WS takes the separator:', o:['First','Last','Anywhere','Never'], a:0, why:'The separator is the first argument.' }
  ],
  recap:['CONCAT joins text; NULL makes it NULL.','CONCAT_WS adds a separator and skips NULLs.','Other systems use || or +.']
},

/* --- trim-sql --- */
'trim-sql': {
  title:'TRIM, LTRIM and RTRIM', tagline:'Remove unwanted spaces or characters.',
  prereq:['select'],
  what:['TRIM removes spaces from both ends of a text.','LTRIM removes from the left, RTRIM from the right.','TRIM can also remove other characters.'],
  why:['Hidden spaces break joins and comparisons.','Cleaning imported data.'],
  syntax:{ code:'TRIM(text)\nTRIM(LEADING \'0\' FROM text)\nLTRIM(text)\nRTRIM(text)', parts:[['TRIM(text)','Removes leading and trailing spaces.'],['LEADING / TRAILING / BOTH','Choose the side and the character to remove.']] },
  points:['TRIM does **not** remove spaces inside the text.','`TRIM(BOTH \'x\' FROM text)` removes a chosen character.','Use before comparing or joining text.','UPDATE with TRIM to clean stored data.','Non-breaking spaces need REPLACE.'],
  mistakes:['Expecting inner spaces to go.','Forgetting to TRIM join keys.','Leaving data dirty and trimming in every query.'],
  example:{ title:'Cleaning a name', scenario:'A name was stored with spaces at both ends.',
    table:withHl({rows:[['name_raw'],['  Asha Rao  ']]},{'A2':'find'},'Table: contacts'), task:'Clean the name.', formula:'SELECT TRIM(name_raw) AS name_clean\nFROM contacts;',
    steps:['TRIM removes the leading and trailing spaces.','The space between Asha and Rao stays.'],
    table2:{ rows:[['name_clean'],['Asha Rao']], caption:'Result' }, result:'The result is Asha Rao.' },
  practice:{ q:'Remove the leading zeros from the code \'00123\'.', hint:'Use TRIM(LEADING ...).', solution:'SELECT TRIM(LEADING \'0\' FROM \'00123\');', explain:'The result is 123.' },
  interview:[
    { level:'Basic', q:'What does TRIM do?', a:'It removes leading and trailing spaces, or a chosen character, from a text.' },
    { level:'Intermediate', q:'Why do joins fail on values that look equal?', a:'Often one side has trailing spaces. TRIM both join columns, or better, clean the data once.' },
    { level:'Intermediate', q:'Does TRIM remove spaces between words?', a:'No, only at the ends. I use REPLACE for inner spaces.' },
    { level:'Scenario', q:'Clean a whole column permanently.', a:'UPDATE contacts SET name = TRIM(name); I run a SELECT first to preview the change, and do it in a transaction.' }
  ],
  mcq:[
    { q:'TRIM(\'  Asha  \') returns:', o:['Asha','  Asha','Asha  ','A s h a'], a:0, why:'Both ends are trimmed.' },
    { q:'Does TRIM remove inner spaces?', o:['No','Yes','Only one','Only tabs'], a:0, why:'Only the ends are affected.' },
    { q:'Which removes only leading characters?', o:['LTRIM or TRIM(LEADING ...)','RTRIM','REPLACE','TRIM(BOTH)'], a:0, why:'LTRIM works on the left.' },
    { q:'TRIM(LEADING \'0\' FROM \'00123\') returns:', o:['123','00123','0123','12'], a:0, why:'Leading zeros are removed.' },
    { q:'Why TRIM join keys?', o:['Hidden spaces cause mismatches','To sort faster','To change case','To add rows'], a:0, why:'Spaces make equal-looking values different.' }
  ],
  recap:['TRIM cleans the ends of a text.','It can remove a chosen character.','Clean join keys to avoid mismatches.']
},

/* --- replace-sql --- */
'replace-sql': {
  title:'REPLACE', tagline:'Swap one piece of text for another.',
  prereq:['select'],
  what:['REPLACE changes every occurrence of a piece of text.','It is case sensitive in MySQL.','Use an empty string to delete text.'],
  why:['Remove hyphens from phone numbers.','Fix spellings and formats in bulk.'],
  syntax:{ code:'REPLACE(text, old_text, new_text)', parts:[['old_text','The text to find.'],['new_text','The text to put in its place. Use \'\' to delete.']] },
  points:['All occurrences are replaced.','Case sensitive in MySQL.','REPLACE(text, \'-\', \'\') removes hyphens.','Can be nested to apply several replacements.','Use UPDATE ... SET col = REPLACE(...) to change stored data.'],
  mistakes:['Case differences preventing a match.','Forgetting it changes every match.','Replacing without testing first.'],
  example:{ title:'Removing hyphens', scenario:'A phone number is stored as 98765-43210.',
    table:withHl({rows:[['phone'],['98765-43210']]},{'A2':'find'},'Table: contacts'), task:'Remove the hyphen.', formula:'SELECT REPLACE(phone, \'-\', \'\') AS phone_clean\nFROM contacts;',
    steps:['old_text is a hyphen.','new_text is an empty string, so the hyphen is deleted.'],
    table2:{ rows:[['phone_clean'],['9876543210']], caption:'Result' }, result:'The result is 9876543210.' },
  practice:{ q:'Write a query that replaces every lowercase a in the customer names with a capital A.', table:T(CUST,'Table: customers'), hint:'REPLACE is case sensitive.', solution:'SELECT REPLACE(name, \'a\', \'A\')\nFROM customers;', explain:'Asha becomes AshA, Bilal becomes BilAl, Chitra becomes ChitrA and Deepak becomes DeepAk.' },
  interview:[
    { level:'Basic', q:'What does REPLACE do?', a:'It replaces every occurrence of one text with another inside a value.' },
    { level:'Intermediate', q:'How do you remove a character?', a:'REPLACE(col, \'x\', \'\'), replacing it with an empty string.' },
    { level:'Intermediate', q:'Is REPLACE case sensitive?', a:'In MySQL yes. To ignore case I replace each variant, or convert with LOWER first.' },
    { level:'Scenario', q:'Clean 50,000 phone numbers permanently.', a:'UPDATE contacts SET phone = REPLACE(REPLACE(phone, \'-\', \'\'), \' \', \'\'); after previewing with SELECT and inside a transaction.' }
  ],
  mcq:[
    { q:'REPLACE(\'98765-43210\', \'-\', \'\') returns:', o:['9876543210','98765','43210','98765 43210'], a:0, why:'The hyphen is removed.' },
    { q:'REPLACE changes:', o:['Every occurrence','Only the first','Only the last','Nothing'], a:0, why:'All matches are replaced.' },
    { q:'Is REPLACE case sensitive in MySQL?', o:['Yes','No','Only for numbers','Only in WHERE'], a:0, why:'Match the case exactly.' },
    { q:'How do you delete text with REPLACE?', o:['Replace with an empty string','Replace with NULL','Use DELETE','Use TRIM'], a:0, why:'An empty string removes it.' },
    { q:'How do you change stored data?', o:['UPDATE ... SET col = REPLACE(...)','SELECT REPLACE','ALTER TABLE','INSERT'], a:0, why:'SELECT only shows the changed value.' }
  ],
  recap:['REPLACE swaps text for other text.','Case sensitive in MySQL; empty string deletes.','Use UPDATE to change stored data.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- upper-sql --- */
D('upper-sql',{ l:'Beginner', t:'UPPER converts text to capitals in the result. It does not change stored data, and functions on indexed columns can slow queries.',
  i:['Standardising case helps comparisons and reports. UPPER returns the text in capitals for that query only.','Be careful in WHERE: wrapping an indexed column in a function can stop the database using the index.'], a:'Writing in block capitals on a form.',
  h:['Write `UPPER(text)`.','Every letter becomes a capital.','Use in SELECT for display or in comparisons.','To change stored data, use UPDATE with UPPER.'],
  d:[FL(['UPPER'],[{ title:'city', rows:[['city'],['Pune'],['Delhi']] },{ title:'UPPER(city)', rows:[['city_upper'],['PUNE'],['DELHI']], hl:{1:'hit',2:'hit'} }])],
  x:[X('Variation','Cleaning codes','Trim and standardise.','Combine TRIM and UPPER.','SELECT UPPER(TRIM(code)) FROM products;',['TRIM removes spaces, UPPER fixes the case.'],'" mh-12 " becomes MH-12.'),
     X('Business case','Joining on codes with different case','Two sources store state codes in different case (MySQL is case-insensitive by default, PostgreSQL is not).','Standardise before joining.','ON UPPER(a.state) = UPPER(b.state)',['Both sides are made the same case.'],'Better still, clean the data once so the plain join works.')],
  e:[['Not stored','UPPER changes the result only.'],['Index use','`WHERE UPPER(col) = ...` can prevent index use.'],['NULL stays NULL','UPPER(NULL) is NULL.'],['MySQL collation','Comparisons are usually case-insensitive already.']],
  p:[P('Medium','Return customer names in capitals.','UPPER(name).','SELECT UPPER(name) FROM customers;','ASHA, BILAL, CHITRA, DEEPAK.',T(CUST,'Table: customers')),
     P('Interview','Does UPPER change the table?','Result versus data.','No. Use UPDATE ... SET col = UPPER(col) to change stored data.','Distinguish SELECT from UPDATE.')],
  q:[Q('Basic','What does UPPER do?','It returns the text with all letters in capitals.',{ f:[['Synonym in MySQL?','UCASE.']] }),
     Q('Scenario','Standardise 1 million state codes.','UPDATE with UPPER(TRIM()) in batches inside a transaction, after previewing.',{ t:'Then add a constraint to keep it clean.' })],
  r:RT(['Function','Result'],[['`UPPER(\'asha\')`','ASHA'],['`LOWER(\'ASHA\')`','asha'],['Clean','`UPPER(TRIM(x))`'],['Persist','`UPDATE ... SET x = UPPER(x)`']]), rel:['lower-sql','trim-sql','concat-sql','update-sql'] });

/* --- lower-sql --- */
D('lower-sql',{ l:'Beginner', t:'LOWER converts text to lowercase. Use it to standardise emails and to find duplicates that differ only by case.',
  i:['Emails and usernames are conventionally lowercase. LOWER makes values comparable and exposes duplicates like Asha@x.com and asha@x.com.','As with UPPER, the stored data is not changed by a SELECT.'], a:'Writing everything in small letters so it is uniform.',
  h:['Write `LOWER(text)`.','Combine with TRIM.','Group by LOWER(TRIM(email)) to find duplicates.','UPDATE to store the cleaned value.'],
  d:[FL(['LOWER'],[{ title:'email', rows:[['email'],['Asha@Example.com']] },{ title:'LOWER(email)', rows:[['clean'],['asha@example.com']], hl:{1:'hit'} }])],
  x:[X('Variation','Clean emails','Standardise before use.','LOWER and TRIM.','SELECT LOWER(TRIM(email)) FROM subscribers;',['Both steps in one expression.'],'Clean values ready for comparison.'),
     X('Business case','Case-hidden duplicates','Count emails that repeat ignoring case.','Group on the cleaned value.','SELECT LOWER(TRIM(email)) AS e, COUNT(*) AS n\nFROM subscribers\nGROUP BY LOWER(TRIM(email))\nHAVING COUNT(*) > 1;',['Case and spaces no longer hide duplicates.'],'The duplicates are listed.')],
  e:[['Display versus storage','SELECT shows lowercase; the table is unchanged.'],['Collation matters','In MySQL equal comparisons are often case-insensitive already.'],['Names','Do not lowercase names for display.'],['Index use','Functions on indexed columns slow filters.']],
  p:[P('Medium','Return lowercase cities.','LOWER.','SELECT LOWER(city) FROM customers;','pune, delhi, pune, mumbai.',T(CUST,'Table: customers')),
     P('Interview','Case-insensitive search in a case-sensitive database.','Compare lowercased values.','WHERE LOWER(col) = LOWER(\'Value\'), or use a case-insensitive collation or ILIKE.','Mention index implications.')],
  q:[Q('Basic','What does LOWER do?','It converts letters to lowercase.',{ f:[['MySQL synonym?','LCASE.']] }),
     Q('Scenario','Find duplicate emails differing by case.','GROUP BY LOWER(TRIM(email)) HAVING COUNT(*) > 1.',{ t:'Fix at the source with a unique constraint on the cleaned value.' })],
  r:RT(['Need','Write'],[['Lowercase','`LOWER(x)`'],['Clean email','`LOWER(TRIM(x))`'],['Find duplicates','`GROUP BY LOWER(TRIM(x))`'],['Persist','`UPDATE`']]), rel:['upper-sql','trim-sql','find-duplicates','group-by'] });

/* --- length-sql --- */
D('length-sql',{ l:'Beginner', t:'CHAR_LENGTH counts characters. In MySQL LENGTH counts bytes, and SQL Server uses LEN.',
  i:['Length checks validate data: phone numbers with ten digits, codes with eight characters. They also reveal hidden spaces.','The portability trap is that MySQL LENGTH measures bytes, which differs from characters for accented or non-Latin text.'], a:'Measuring a word by letters or by the ink it uses.',
  h:['Use `CHAR_LENGTH(text)` for characters.','`LENGTH(text)` is bytes in MySQL.','Compare with `CHAR_LENGTH(TRIM(text))` for hidden spaces.','SQL Server: `LEN`.'],
  d:[FL(['CHAR_LENGTH'],[{ title:'name', rows:[['name','len'],['Asha',4],['Bilal',5],['Chitra',6],['Deepak',6]] }])],
  x:[X('Variation','Names longer than five characters','Filter by length.','Use CHAR_LENGTH in WHERE.','SELECT name FROM customers WHERE CHAR_LENGTH(name) > 5;',['Chitra and Deepak have six letters.'],'Two rows.',T(CUST,'Table: customers')),
     X('Business case','Hidden spaces','Find values with extra spaces.','Compare lengths.','SELECT code FROM products\nWHERE CHAR_LENGTH(code) <> CHAR_LENGTH(TRIM(code));',['A difference means leading or trailing spaces.'],'These rows explain failed joins.')],
  e:[['Bytes versus characters','LENGTH counts bytes in MySQL. Use CHAR_LENGTH for characters.'],['Other databases','SQL Server uses LEN (ignores trailing spaces).'],['NULL','Length of NULL is NULL.'],['Spaces count','Every character counts.']],
  p:[P('Medium','Customers whose name is longer than 5 characters.','CHAR_LENGTH.','SELECT name FROM customers WHERE CHAR_LENGTH(name) > 5;','Chitra and Deepak.',T(CUST,'Table: customers')),
     P('Interview','LENGTH versus CHAR_LENGTH in MySQL?','Bytes versus characters.','LENGTH returns bytes, CHAR_LENGTH returns characters. They differ for multi-byte text.','Show an accented example.')],
  q:[Q('Basic','What does CHAR_LENGTH return?','The number of characters.',{ f:[['SQL Server equivalent?','LEN.']] }),
     Q('Scenario','Validate 10-digit phone numbers.','WHERE CHAR_LENGTH(REPLACE(phone, \'-\', \'\')) <> 10.',{ t:'Also check digits only with REGEXP.' })],
  r:RT(['System','Function'],[['MySQL characters','`CHAR_LENGTH`'],['MySQL bytes','`LENGTH`'],['SQL Server','`LEN`'],['PostgreSQL','`LENGTH`']]), rel:['trim-sql','substring-sql','replace-sql','like-sql'] });

/* --- substring-sql --- */
D('substring-sql',{ l:'Beginner', t:'SUBSTRING takes characters from a position (first character is 1). LEFT and RIGHT take from the ends.',
  i:['Structured codes hide information inside: a prefix, a year, a number. SUBSTRING, LEFT and RIGHT lift it out.','Positions start at 1, and every character, including hyphens, counts.'], a:'Cutting a slice from a word.',
  h:['`LEFT(text, n)` takes the first n characters.','`RIGHT(text, n)` takes the last n.','`SUBSTRING(text, start, length)` takes a slice.','For variable positions use `LOCATE` or `SUBSTRING_INDEX`.'],
  d:[FL(['SUBSTRING(name, 1, 3)'],[{ title:'name', rows:[['name'],['Asha'],['Bilal'],['Chitra']] },{ title:'Result', rows:[['code'],['Ash'],['Bil'],['Chi']], hl:{1:'hit',2:'hit',3:'hit'} }])],
  x:[X('Variation','Before the @','Take the username of an email.','Use SUBSTRING_INDEX.','SELECT SUBSTRING_INDEX(email, \'@\', 1) FROM subscribers;',['Everything before the first @.'],'asha.rao from asha.rao@example.com.'),
     X('Business case','Year from an invoice number','INV-2026-0045 holds the year.','Slice by position.','SELECT SUBSTRING(inv_no, 5, 4) AS yr FROM invoices;',['Position 5, length 4.'],'2026.')],
  e:[['Positions start at 1','Not 0.'],['Fixed positions are fragile','Use LOCATE or SUBSTRING_INDEX when lengths vary.'],['Negative start','In MySQL counts from the end.'],['SUBSTR synonym','Same as SUBSTRING.']],
  p:[P('Medium','Last two letters of each name.','RIGHT.','SELECT RIGHT(name, 2) FROM customers;','ha, al, ra, ak.',T(CUST,'Table: customers')),
     P('Interview','LEFT(x, 3) versus SUBSTRING(x, 1, 3)?','Equivalent.','They are the same. LEFT is shorthand for starting at position 1.','Short answer.')],
  q:[Q('Basic','What are SUBSTRING arguments?','The text, the start position (first is 1) and the length.',{ f:[['Which function splits on a delimiter?','SUBSTRING_INDEX in MySQL.']] }),
     Q('Scenario','Extract the domain from emails.','SUBSTRING_INDEX(email, \'@\', -1).',{ t:'Store the domain in its own column if used often.' })],
  r:RT(['Need','Write'],[['First n','`LEFT(x, n)`'],['Last n','`RIGHT(x, n)`'],['Slice','`SUBSTRING(x, start, len)`'],['Split','`SUBSTRING_INDEX(x, sep, n)`']]), rel:['length-sql','concat-sql','replace-sql','like-sql'] });

/* --- concat-sql --- */
D('concat-sql',{ l:'Beginner', t:'CONCAT joins text. In MySQL a NULL makes the whole result NULL, so use CONCAT_WS, which skips NULLs.',
  i:['Reports need full names and addresses built from separate columns. CONCAT joins values, and CONCAT_WS adds a separator between them.','The danger is NULL: one missing part blanks the whole text in plain CONCAT.'], a:'Gluing words, skipping any missing piece.',
  h:['`CONCAT(a, \' \', b)` joins values.','`CONCAT_WS(sep, a, b, c)` uses a separator and skips NULLs.','Numbers are converted to text.','PostgreSQL and Oracle use `||`.'],
  d:[FL(['CONCAT'],[{ title:'name | city', rows:[['name','city'],['Asha','Pune']] },{ title:'CONCAT(name, " - ", city)', text:'**Asha - Pune**' }])],
  x:[X('Variation','A NULL part','One of the parts is NULL.','Compare CONCAT and CONCAT_WS.','CONCAT(\'Asha\', NULL, \'Pune\')        -> NULL\nCONCAT_WS(\', \', \'Asha\', NULL, \'Pune\') -> Asha, Pune',['CONCAT_WS skips the NULL.'],'Use CONCAT_WS for optional parts.'),
     X('Business case','An address line','Street, optional landmark and city.','Use CONCAT_WS.','SELECT CONCAT_WS(\', \', street, landmark, city) AS address FROM customers;',['A NULL landmark leaves no stray comma.'],'Clean addresses.')],
  e:[['NULL blanks the result','CONCAT with a NULL returns NULL in MySQL.'],['Spaces are not automatic','Add them yourself.'],['Operators','`||` in PostgreSQL and Oracle; `+` in SQL Server.'],['Numbers and dates','Format dates with DATE_FORMAT first.']],
  p:[P('Medium','City then name as "Pune, Asha".','CONCAT_WS.','SELECT CONCAT_WS(\', \', city, name) FROM customers;','Pune, Asha.',T(CUST,'Table: customers')),
     P('Interview','What does CONCAT return if an argument is NULL?','MySQL behaviour.','NULL. Use CONCAT_WS, or COALESCE each part.','Mention other databases.')],
  q:[Q('Basic','What does CONCAT do?','It joins values into one text.',{ f:[['Which skips NULLs?','CONCAT_WS.']] }),
     Q('Scenario','Build full names with optional middle names.','CONCAT_WS(\' \', first, middle, last).',{ t:'No double spaces appear for missing middle names.' })],
  r:RT(['System','Join'],[['MySQL','`CONCAT`, `CONCAT_WS`'],['PostgreSQL / Oracle','`||`'],['SQL Server','`+` or `CONCAT`'],['Skip NULLs','`CONCAT_WS`']]), rel:['coalesce','trim-sql','substring-sql','date-format'] });

/* --- trim-sql --- */
D('trim-sql',{ l:'Beginner', t:'TRIM removes spaces (or a chosen character) from the ends of text. Clean join keys before joining.',
  i:['Two values can look identical but differ by one trailing space, so joins and comparisons fail. TRIM removes the invisible difference.','It only touches the ends: spaces between words stay.'], a:'Wiping the edges of a page so the text lines up.',
  h:['`TRIM(text)` removes both ends.','`LTRIM` and `RTRIM` do one side.','`TRIM(LEADING \'0\' FROM x)` removes a chosen character.','`UPDATE ... SET x = TRIM(x)` cleans stored data.'],
  d:[FL(['TRIM'],[{ title:'"  Asha Rao  "', text:'12 characters' },{ title:'TRIM', text:'**"Asha Rao"** (8)' }])],
  x:[X('Variation','Removing leading zeros','Strip zeros from codes.','Use LEADING.','SELECT TRIM(LEADING \'0\' FROM \'00123\');',['Only the leading zeros are removed.'],'123.'),
     X('Business case','A join that fails on spaces','Customer ids typed with trailing spaces do not match.','Trim both sides.','JOIN b ON TRIM(a.code) = TRIM(b.code)',['The spaces no longer matter.'],'Then clean the data so the plain join works.')],
  e:[['Only the ends','Inner spaces stay. Use REPLACE for those.'],['Non-breaking spaces','Not removed by TRIM. Use REPLACE with CHAR(160).'],['Index use','TRIM in a join can prevent index use. Clean the data once.'],['PostgreSQL','Same function.']],
  p:[P('Medium','Remove leading zeros from \'00123\'.','LEADING.','SELECT TRIM(LEADING \'0\' FROM \'00123\');','123.'),
     P('Interview','Why do two similar-looking values not join?','Hidden characters.','Trailing spaces or other invisible characters. Compare lengths and TRIM.','Check with CHAR_LENGTH.')],
  q:[Q('Basic','What does TRIM do?','It removes leading and trailing spaces or a chosen character.',{ f:[['Does it remove inner spaces?','No.']] }),
     Q('Scenario','Clean a text column permanently.','UPDATE t SET col = TRIM(col) after previewing, inside a transaction.',{ t:'Add a constraint or load-time cleaning to prevent recurrence.' })],
  r:RT(['Form','Effect'],[['`TRIM(x)`','Both ends'],['`LTRIM(x)`','Left only'],['`RTRIM(x)`','Right only'],['`TRIM(LEADING c FROM x)`','Remove a character']]), rel:['length-sql','replace-sql','upper-sql','update-sql'] });

/* --- replace-sql --- */
D('replace-sql',{ l:'Beginner', t:'REPLACE swaps every occurrence of one text for another. An empty replacement deletes it.',
  i:['Cleaning often means removing hyphens, changing abbreviations or fixing a spelling in many rows. REPLACE does it by content.','It is case sensitive in MySQL, and it changes every occurrence, so test before updating.'], a:'Find and replace inside a query.',
  h:['`REPLACE(text, old, new)`.','Every occurrence is changed.','Use `\'\'` as new to delete.','Nest calls for several replacements.'],
  d:[FL(['REPLACE(phone, "-", "")'],[{ title:'98765-43210', text:'with hyphen' },{ title:'Result', text:'**9876543210**' }])],
  x:[X('Variation','Several replacements','Remove hyphens and spaces.','Nest REPLACE.','SELECT REPLACE(REPLACE(phone, \'-\', \'\'), \' \', \'\') FROM contacts;',['Each REPLACE handles one character.'],'A clean digit string.'),
     X('Business case','Preview, then update','Standardise a city abbreviation.','SELECT first, UPDATE after.','SELECT city, REPLACE(city, \'Hyd\', \'Hyderabad\') FROM customers;\nUPDATE customers SET city = REPLACE(city, \'Hyd\', \'Hyderabad\') WHERE city = \'Hyd\';',['The WHERE avoids changing "Hyderabad" into "Hyderabaderabad".'],'Always restrict the UPDATE.')],
  e:[['Case sensitive','"a" does not match "A" in MySQL REPLACE.'],['All occurrences','Not just the first.'],['Replacing inside longer text','Add a WHERE or exact match.'],['Regular expressions','REGEXP_REPLACE (MySQL 8) for patterns.']],
  p:[P('Medium','Replace every lowercase a in names with A.','Case sensitive.','SELECT REPLACE(name, \'a\', \'A\') FROM customers;','AshA, BilAl, ChitrA, DeepAk.',T(CUST,'Table: customers')),
     P('Interview','How do you delete a character from a column?','Empty replacement.','REPLACE(col, \'x\', \'\').','Say UPDATE to make it permanent.')],
  q:[Q('Basic','What does REPLACE do?','It replaces all occurrences of a text with another.',{ f:[['Is it case sensitive?','In MySQL, yes.']] }),
     Q('Scenario','Clean 50,000 phone numbers.','Preview with SELECT, then UPDATE with nested REPLACE in a transaction.',{ t:'Regex functions handle complex patterns.' })],
  r:RT(['Need','Write'],[['Replace','`REPLACE(x, old, new)`'],['Delete','`REPLACE(x, \'-\', \'\')`'],['Pattern','`REGEXP_REPLACE`'],['Persist','`UPDATE`']]), rel:['trim-sql','substring-sql','update-sql','like-sql'] });
})();
