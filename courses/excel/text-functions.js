/* Datapath | Excel | Text functions
 * Lessons in this file: left, right, mid, len, trim, upper, lower, proper, concat, textjoin, substitute, find, text
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
  const { CODES, CODEST } = DP.datasets.excel;
  const DEEP = DP.deep;

  /* ================= 1. CORE CONTENT ================= */
  DP.addLessons({

/* --- left --- */
'left': {
  title:'LEFT', tagline:'Take characters from the start of a text.',
  prereq:[],
  what:['LEFT returns the first characters of a text.','You choose how many characters to take.','It works on text and on numbers stored as text.'],
  why:['Pull a prefix from codes such as EMP-1021.','Extract a username before an @ sign, or a country code from a phone number.'],
  syntax:{ code:'=LEFT(text, [num_chars])', parts:[['text','The text or cell to take characters from.'],['num_chars','Optional. How many characters to return. Default is 1.']] },
  points:['If num_chars is left out, LEFT returns **1** character.','If num_chars is larger than the text, LEFT returns the whole text.','The result is always **text**, even if it looks like a number.','Combine with FIND to take everything before a character.','Use `VALUE()` or `--` to turn the result back into a number.'],
  mistakes:['Forgetting that the result is text, so it will not add up.','Counting characters wrongly, including spaces.','Using LEFT for variable-length text without FIND.'],
  example:{ title:'Reading the department prefix', scenario:'Employee codes start with a 3-letter prefix such as EMP or MGR.',
    table:withHl(CODEST('First 3','EMP'),{'A2':'find','B2':'hit'},'Sheet: Codes'), task:'Get the prefix of the first code.', formula:'=LEFT(A2, 3)',
    steps:['A2 holds EMP-1021.','LEFT takes the first 3 characters.'], result:'The formula returns EMP.' },
  practice:{ q:'Write a formula that returns the first 4 characters of the code in A4.', table:withHl(CODES,{},'Sheet: Codes'), hint:'The code in A4 is MGR-2005.', solution:'=LEFT(A4, 4)', explain:'The first four characters are M, G, R and the hyphen, so the result is MGR-.' },
  interview:[
    { level:'Basic', q:'What does LEFT do?', a:'LEFT returns the first characters of a text. LEFT("EMP-1021",3) returns EMP.' },
    { level:'Intermediate', q:'How do you take everything before the @ in an email address?', a:'=LEFT(A2, FIND("@", A2)-1). FIND gives the position of @ and LEFT takes the characters before it.' },
    { level:'Intermediate', q:'Why can a result from LEFT not be added to other numbers?', a:'LEFT returns text. I wrap it in VALUE, or multiply by 1, to convert it back to a number.' },
    { level:'Scenario', q:'Product codes have different lengths, but the region is always before the first hyphen. How do you extract it?', a:'=LEFT(A2, FIND("-", A2)-1). FIND locates the first hyphen so the length does not need to be fixed.' }
  ],
  mcq:[
    { q:'What does `=LEFT("EMP-1021", 3)` return?', o:['EMP','1021','EMP-','P-1'], a:0, why:'The first three characters are E, M and P.' },
    { q:'What does LEFT return if num_chars is left out?', o:['The first character','The whole text','An error','Nothing'], a:0, why:'The default for num_chars is 1.' },
    { q:'What data type does LEFT return?', o:['Text','Number','Date','Boolean'], a:0, why:'LEFT returns text, even when the characters are digits.' },
    { q:'Which formula returns the text before the @ in A2?', o:['=LEFT(A2,FIND("@",A2)-1)','=LEFT(A2,"@")','=RIGHT(A2,FIND("@",A2))','=MID(A2,"@")'], a:0, why:'FIND locates @, and subtracting 1 stops before it.' },
    { q:'What happens if num_chars is longer than the text?', o:['The whole text is returned','An error','Spaces are added','Blank'], a:0, why:'LEFT simply returns all the characters it has.' }
  ],
  recap:['LEFT takes characters from the start of a text.','The result is text; convert with VALUE when needed.','Pair it with FIND for variable lengths.']
},

/* --- right --- */
'right': {
  title:'RIGHT', tagline:'Take characters from the end of a text.',
  prereq:['left'],
  what:['RIGHT returns the last characters of a text.','You choose how many characters to take.','It is the mirror image of LEFT.'],
  why:['Pull the number part of codes such as EMP-1021.','Get file extensions or the last digits of an account number.'],
  syntax:{ code:'=RIGHT(text, [num_chars])', parts:[['text','The text or cell to take characters from.'],['num_chars','Optional. How many characters to return. Default is 1.']] },
  points:['The default is **1** character.','If num_chars is larger than the text, RIGHT returns the whole text.','The result is always text.','For variable lengths, combine with LEN and FIND.','Trailing spaces count as characters, so TRIM first.'],
  mistakes:['Trailing spaces changing what RIGHT returns.','Forgetting that the result is text.','Hard-coding the length for variable-length text.'],
  example:{ title:'Reading the number part of a code', scenario:'Codes end with a 4-digit number.',
    table:withHl(CODEST('Last 4','1021'),{'A2':'find','B2':'hit'},'Sheet: Codes'), task:'Get the last 4 characters of the first code.', formula:'=RIGHT(A2, 4)',
    steps:['A2 holds EMP-1021.','RIGHT takes the last 4 characters.'], result:'The formula returns 1021 (as text).' },
  practice:{ q:'Write a formula that returns the last 4 digits as a real number, not text.', table:withHl(CODES,{},'Sheet: Codes'), hint:'Wrap RIGHT in VALUE.', solution:'=VALUE(RIGHT(A2, 4))', explain:'RIGHT returns the text 1021, and VALUE turns it into the number 1021.' },
  interview:[
    { level:'Basic', q:'What does RIGHT do?', a:'RIGHT returns the last characters of a text. RIGHT("EMP-1021",4) returns 1021.' },
    { level:'Intermediate', q:'How do you get the text after the last hyphen when the length varies?', a:'=RIGHT(A2, LEN(A2)-FIND("-",A2)) works for a single hyphen. RIGHT takes the characters after it, and LEN minus the hyphen position gives how many.' },
    { level:'Intermediate', q:'Why might RIGHT return unexpected characters?', a:'Trailing spaces count as characters, so the last characters are spaces. I use TRIM on the text first.' },
    { level:'Scenario', q:'You need the last 4 digits of account numbers for a masked display. How?', a:'="XXXX"&RIGHT(A2,4). RIGHT takes the last four digits and the ampersand joins them to the mask.' }
  ],
  mcq:[
    { q:'What does `=RIGHT("EMP-1021", 4)` return?', o:['1021','EMP-','P-10','021'], a:0, why:'The last four characters are 1, 0, 2 and 1.' },
    { q:'What does RIGHT return if num_chars is left out?', o:['The last character','The whole text','An error','Nothing'], a:0, why:'The default is 1.' },
    { q:'What data type does RIGHT return?', o:['Text','Number','Date','Error'], a:0, why:'The result is text.' },
    { q:'How do you turn the RIGHT result into a number?', o:['VALUE(RIGHT(...))','TEXT(RIGHT(...))','LEN(RIGHT(...))','UPPER(RIGHT(...))'], a:0, why:'VALUE converts text digits to a number.' },
    { q:'Why use TRIM before RIGHT?', o:['Trailing spaces would be counted as characters','To make the text bigger','To change the case','To remove digits'], a:0, why:'Extra spaces at the end shift what RIGHT returns.' }
  ],
  recap:['RIGHT takes characters from the end.','Use VALUE to turn the result into a number.','TRIM first if trailing spaces are possible.']
},

/* --- mid --- */
'mid': {
  title:'MID', tagline:'Take characters from the middle of a text.',
  prereq:['left','right'],
  what:['MID returns characters from any position inside a text.','You give the starting position and the number of characters.','Positions start at 1.'],
  why:['Pull the middle part of codes, IDs or dates stored as text.','Extract fixed-position fields, such as a year inside a reference number.'],
  syntax:{ code:'=MID(text, start_num, num_chars)', parts:[['text','The text or cell to read.'],['start_num','Position of the first character to return. The first character of the text is 1.'],['num_chars','How many characters to return.']] },
  points:['All three arguments are required.','Position counting starts at 1, and the hyphen counts as a character.','If start_num is beyond the end, MID returns empty text.','The result is text.','Combine with FIND when the start position varies.'],
  mistakes:['Starting at 0 instead of 1.','Forgetting that hyphens and spaces count as characters.','Treating the result as a number.'],
  example:{ title:'Reading the middle of a code', scenario:'You want the number part of EMP-1021 using its position.',
    table:withHl(CODEST('MID result','1021'),{'A2':'find','B2':'hit'},'Sheet: Codes'), task:'Take 4 characters starting at position 5.', formula:'=MID(A2, 5, 4)',
    steps:['Positions: E=1, M=2, P=3, -=4, 1=5.','Starting at 5, take 4 characters: 1, 0, 2, 1.'], result:'The formula returns 1021.' },
  practice:{ q:'Write a formula that returns the 2nd and 3rd characters of the code in A2.', table:withHl(CODES,{},'Sheet: Codes'), hint:'Start at position 2 and take 2 characters.', solution:'=MID(A2, 2, 2)', explain:'EMP-1021: position 2 is M and position 3 is P, so the result is MP.' },
  interview:[
    { level:'Basic', q:'What are the arguments of MID?', a:'MID(text, start_num, num_chars): the text, the starting position (first character is 1) and how many characters to return.' },
    { level:'Intermediate', q:'What is the difference between LEFT, RIGHT and MID?', a:'LEFT takes characters from the start, RIGHT from the end and MID from any position in the middle.' },
    { level:'Intermediate', q:'How do you extract the text between two hyphens when the length varies?', a:'Find the positions of the hyphens with FIND, then use MID with start = first hyphen + 1 and length = second hyphen minus first hyphen minus 1.' },
    { level:'Scenario', q:'Invoice numbers look like INV-2026-0045 and you need the year. How?', a:'=MID(A2, 5, 4) takes four characters starting at position 5. For varying prefixes, I find the first hyphen with FIND and start one position after it.' }
  ],
  mcq:[
    { q:'What does `=MID("EMP-1021", 5, 4)` return?', o:['1021','EMP-','P-10','021'], a:0, why:'Position 5 is the first digit, and four characters give 1021.' },
    { q:'Where does position counting start in MID?', o:['1','0','2','It depends'], a:0, why:'The first character is position 1.' },
    { q:'How many arguments does MID require?', o:['3','2','1','4'], a:0, why:'Text, start_num and num_chars are all required.' },
    { q:'What does MID return if start_num is beyond the text length?', o:['Empty text','An error','The whole text','0'], a:0, why:'There are no characters to return.' },
    { q:'Which function finds a variable start position for MID?', o:['FIND','SUM','ROUND','COUNT'], a:0, why:'FIND returns the position of a character.' }
  ],
  recap:['MID(text, start, length) takes characters from the middle.','The first character is position 1; hyphens and spaces count.','Use FIND to handle varying positions.']
},

/* --- len --- */
'len': {
  title:'LEN', tagline:'Count the characters in a text.',
  prereq:[],
  what:['LEN returns the number of characters in a cell.','Spaces and punctuation count.','Numbers are counted as characters too.'],
  why:['Check that IDs or phone numbers have the right length.','Find hidden spaces that break lookups.'],
  syntax:{ code:'=LEN(text)', parts:[['text','The text or cell to measure.']] },
  points:['Spaces, hyphens and symbols all count.','LEN of an empty cell is `0`.','Compare `LEN(A2)` with `LEN(TRIM(A2))` to find extra spaces.','A 10-digit phone number has LEN 10; a hyphenated one has 11.','Use LEN with IF to validate lengths.'],
  mistakes:['Not realising that spaces count.','Expecting LEN to count the display, not the stored value.','Forgetting that formatted numbers lose their formatting in LEN.'],
  example:{ title:'Checking code length', scenario:'Every employee code should be exactly 8 characters.',
    table:withHl(CODEST('Length',8),{'A2':'find','B2':'hit'},'Sheet: Codes'), task:'Count the characters in the first code.', formula:'=LEN(A2)',
    steps:['EMP-1021 has 3 letters, a hyphen and 4 digits.','3 + 1 + 4 = 8 characters.'], result:'The formula returns 8.' },
  practice:{ q:'Write a formula that returns "OK" when the code in A2 has exactly 8 characters, otherwise "Check".', table:withHl(CODES,{},'Sheet: Codes'), hint:'Put LEN inside an IF.', solution:'=IF(LEN(A2)=8, "OK", "Check")', explain:'LEN(A2) is 8, so the IF returns OK.' },
  interview:[
    { level:'Basic', q:'What does LEN return?', a:'The number of characters in a text, counting spaces and symbols.' },
    { level:'Intermediate', q:'How do you detect extra spaces in a cell?', a:'Compare LEN(A2) with LEN(TRIM(A2)). If they differ, the cell has leading, trailing or double spaces.' },
    { level:'Intermediate', q:'How would you check that phone numbers have 10 digits?', a:'=IF(LEN(A2)=10, "OK", "Check"). If numbers have hyphens or spaces, I first remove them with SUBSTITUTE.' },
    { level:'Scenario', q:'A VLOOKUP fails even though the ID looks identical. How can LEN help?', a:'LEN shows whether one ID has extra characters, such as a trailing space. If the lengths differ, I TRIM the data and try again.' }
  ],
  mcq:[
    { q:'What does `=LEN("EMP-1021")` return?', o:['8','7','9','4'], a:0, why:'Three letters, one hyphen and four digits make 8 characters.' },
    { q:'Do spaces count in LEN?', o:['Yes','No','Only leading spaces','Only trailing spaces'], a:0, why:'Every character counts, including spaces.' },
    { q:'What does LEN return for an empty cell?', o:['0','1','An error','Blank'], a:0, why:'There are no characters.' },
    { q:'Which comparison finds extra spaces?', o:['LEN(A2)<>LEN(TRIM(A2))','LEN(A2)=0','LEN(A2)>10','LEN(A2)=A2'], a:0, why:'TRIM removes extra spaces, so a different length means there were some.' },
    { q:'What is `=LEN(12345)`?', o:['5','1','12345','Error'], a:0, why:'Numbers are counted as characters too.' }
  ],
  recap:['LEN counts all characters including spaces.','Compare LEN with LEN(TRIM()) to find hidden spaces.','Use it with IF to validate lengths.']
},

/* --- trim --- */
'trim': {
  title:'TRIM', tagline:'Remove extra spaces from a text.',
  prereq:['len'],
  what:['TRIM removes spaces at the start and end of a text.','It also reduces repeated spaces between words to a single space.','It is the first step in cleaning imported data.'],
  why:['Hidden spaces make VLOOKUP, MATCH and COUNTIF fail.','Data copied from websites and systems is full of them.'],
  syntax:{ code:'=TRIM(text)', parts:[['text','The text or cell to clean.']] },
  points:['It removes leading and trailing spaces.','It collapses multiple spaces between words to one.','It does **not** remove non-breaking spaces (`CHAR(160)`) from web data.','To remove those, use `SUBSTITUTE(A2, CHAR(160), " ")` first.','Paste the cleaned values back with Paste Special > Values.'],
  mistakes:['Expecting TRIM to remove non-breaking spaces from web pages.','Leaving formulas in place instead of pasting values.','Not cleaning both lookup columns.'],
  example:{ title:'Cleaning a name', scenario:'A name was typed with a leading space, three spaces between the words and a trailing space.',
    table:withHl({rows:[['Name (raw)','Length','Clean name'],[' Asha   Rao ',12,'Asha Rao']]},{'A2':'find','C2':'hit'},'Sheet: Names'), task:'Clean the name in A2.', formula:'=TRIM(A2)',
    steps:['The raw name has 12 characters, with 1 + 3 + 1 extra spaces around and between the words.','TRIM removes the leading and trailing spaces and keeps a single space between the words.'], result:'The formula returns Asha Rao (8 characters).' },
  practice:{ q:'Write a formula that returns TRUE when the text in A2 has extra spaces.', hint:'Compare LEN of the cell with LEN of the trimmed cell.', solution:'=LEN(A2)<>LEN(TRIM(A2))', explain:'If TRIM changes the length, there were extra spaces. In the example, 12 is not equal to 8, so the result is TRUE.' },
  interview:[
    { level:'Basic', q:'What does TRIM do?', a:'TRIM removes leading and trailing spaces and reduces multiple spaces between words to one.' },
    { level:'Intermediate', q:'Why does VLOOKUP fail on values that look identical?', a:'Often one of them has a trailing space. TRIM on both columns fixes it.' },
    { level:'Intermediate', q:'TRIM does not fix some spaces from web data. Why?', a:'Web pages use non-breaking spaces, CHAR(160), which TRIM does not remove. I replace them with SUBSTITUTE(A2,CHAR(160)," ") and then TRIM.' },
    { level:'Scenario', q:'You cleaned 5,000 names with TRIM in a helper column. How do you finish?', a:'I copy the column and use Paste Special > Values over the original column, then delete the helper column, so the cleaned text replaces the raw text.' }
  ],
  mcq:[
    { q:'What does `=TRIM("  Asha   Rao ")` return?', o:['Asha Rao','AshaRao','Asha   Rao','Asha Rao '], a:0, why:'Leading and trailing spaces go, and the spaces between words become one.' },
    { q:'Does TRIM remove non-breaking spaces?', o:['No','Yes','Only at the end','Only in 365'], a:0, why:'Non-breaking spaces need SUBSTITUTE with CHAR(160).' },
    { q:'Why is TRIM useful before lookups?', o:['Hidden spaces make matches fail','It sorts data','It changes numbers','It adds spaces'], a:0, why:'An extra space makes two values different.' },
    { q:'How do you keep cleaned results without formulas?', o:['Paste Special > Values','Delete the original','Sort the column','Use TRIM again'], a:0, why:'Pasting values replaces the formulas with their results.' },
    { q:'What does TRIM do to spaces between words?', o:['Reduces them to one','Removes them all','Doubles them','Nothing'], a:0, why:'Only a single space remains between words.' }
  ],
  recap:['TRIM removes leading, trailing and repeated spaces.','It does not remove non-breaking spaces (CHAR(160)).','Paste values after cleaning.']
},

/* --- upper --- */
'upper': {
  title:'UPPER', tagline:'Turn all letters of a text into capitals.',
  prereq:[],
  what:['UPPER changes every letter to uppercase.','Numbers and symbols stay the same.','It is used to standardise codes and IDs.'],
  why:['Make codes and states consistent, such as "mh" and "Mh" becoming MH.','Compare text where case should not matter.'],
  syntax:{ code:'=UPPER(text)', parts:[['text','The text or cell to convert.']] },
  points:['Only letters change; digits and symbols stay.','Lookups already ignore case, but clean data looks better.','Use for IDs, state codes and abbreviations.','The result is a formula, so paste values to keep it.','`EXACT(A2, B2)` is case sensitive, unlike `=`.'],
  mistakes:['Using UPPER on text that should keep its case, such as names.','Forgetting to paste values.','Assuming = is case sensitive.'],
  example:{ title:'Standardising codes', scenario:'A list has codes typed in mixed case.',
    table:withHl({rows:[['Code (raw)','Standard'],['emp-1021','EMP-1021'],['Mgr-2005','MGR-2005']]},{'A2':'find','B2':'hit'},'Sheet: Codes'), task:'Convert the first code to uppercase.', formula:'=UPPER(A2)',
    steps:['emp-1021 has lowercase letters.','UPPER changes each letter and leaves digits and the hyphen.'], result:'The formula returns EMP-1021.' },
  practice:{ q:'Write a formula that returns the first 3 letters of A2 in capitals.', hint:'Wrap LEFT inside UPPER.', solution:'=UPPER(LEFT(A2, 3))', explain:'LEFT gives emp and UPPER makes it EMP.' },
  interview:[
    { level:'Basic', q:'What does UPPER do?', a:'It converts all letters in a text to uppercase.' },
    { level:'Intermediate', q:'Is the comparison A2="north" case sensitive?', a:'No. The equals operator ignores case. For a case-sensitive comparison I use EXACT(A2,"north").' },
    { level:'Intermediate', q:'When should you not use UPPER?', a:'On names or free text where capitalisation matters. For names, PROPER is more suitable.' },
    { level:'Scenario', q:'State codes are typed in mixed case and need to be standardised. How?', a:'I use =UPPER(TRIM(A2)) in a helper column, then paste the results as values over the original column.' }
  ],
  mcq:[
    { q:'What does `=UPPER("emp-1021")` return?', o:['EMP-1021','Emp-1021','emp-1021','EMP1021'], a:0, why:'All letters become uppercase.' },
    { q:'What happens to digits in UPPER?', o:['They stay the same','They are removed','They become text','An error'], a:0, why:'Only letters change.' },
    { q:'Is `="a"="A"` TRUE?', o:['Yes','No','Only with EXACT','Error'], a:0, why:'Excel comparisons ignore case.' },
    { q:'Which function is case sensitive?', o:['EXACT','UPPER','LEN','TRIM'], a:0, why:'EXACT compares text including case.' },
    { q:'Which formula cleans and standardises?', o:['=UPPER(TRIM(A2))','=UPPER(A2,TRIM)','=TRIM(UPPER)','=UPPER+TRIM'], a:0, why:'Nest the functions: TRIM first, then UPPER.' }
  ],
  recap:['UPPER turns letters into capitals.','Comparisons with = ignore case; EXACT does not.','Combine with TRIM to standardise data.']
},

/* --- lower --- */
'lower': {
  title:'LOWER', tagline:'Turn all letters of a text into lowercase.',
  prereq:['upper'],
  what:['LOWER changes every letter to lowercase.','Numbers and symbols stay the same.','It is common for email addresses and usernames.'],
  why:['Standardise emails, usernames and tags.','Make text consistent before comparing or removing duplicates.'],
  syntax:{ code:'=LOWER(text)', parts:[['text','The text or cell to convert.']] },
  points:['Only letters change.','Email addresses are usually stored in lowercase.','Combine with TRIM for clean data.','Remove Duplicates already ignores case, so mixed-case duplicates are removed.','Paste values to keep the cleaned result.'],
  mistakes:['Using LOWER on names that should be capitalised.','Forgetting to paste values.','Assuming LOWER removes spaces.'],
  example:{ title:'Standardising emails', scenario:'Emails were typed in mixed case.',
    table:withHl({rows:[['Email (raw)','Standard'],['Asha.Rao@Example.com','asha.rao@example.com']]},{'A2':'find','B2':'hit'},'Sheet: Contacts'), task:'Convert the email to lowercase.', formula:'=LOWER(A2)',
    steps:['The raw email has capital letters.','LOWER converts every letter to lowercase.'], result:'The formula returns asha.rao@example.com.' },
  practice:{ q:'Write a formula that returns a clean lowercase email from A2, removing extra spaces.', hint:'Combine TRIM and LOWER.', solution:'=LOWER(TRIM(A2))', explain:'TRIM removes extra spaces and LOWER makes all letters lowercase.' },
  interview:[
    { level:'Basic', q:'What does LOWER do?', a:'It converts all letters in a text to lowercase.' },
    { level:'Intermediate', q:'Why standardise the case of emails?', a:'Emails are not case sensitive in practice, and consistent text prevents duplicates and mismatches in reports and imports.' },
    { level:'Intermediate', q:'What is the difference between LOWER, UPPER and PROPER?', a:'LOWER makes all letters lowercase, UPPER makes them all capitals and PROPER capitalises the first letter of each word.' },
    { level:'Scenario', q:'You must create usernames from names, such as asha.rao from Asha Rao. How?', a:'=LOWER(SUBSTITUTE(TRIM(A2)," ",".")). TRIM cleans the spaces, SUBSTITUTE swaps the space for a dot and LOWER makes it lowercase.' }
  ],
  mcq:[
    { q:'What does `=LOWER("Asha.Rao@Example.com")` return?', o:['asha.rao@example.com','Asha.rao@example.com','ASHA.RAO@EXAMPLE.COM','asha rao'], a:0, why:'Every letter becomes lowercase.' },
    { q:'Does LOWER change numbers?', o:['No','Yes','Only digits above 5','It removes them'], a:0, why:'Only letters change.' },
    { q:'Which function capitalises the first letter of each word?', o:['PROPER','LOWER','UPPER','TRIM'], a:0, why:'PROPER is built for names.' },
    { q:'Which formula cleans an email?', o:['=LOWER(TRIM(A2))','=TRIM(A2)LOWER','=LOWER+TRIM(A2)','=A2.LOWER'], a:0, why:'Nest TRIM inside LOWER.' },
    { q:'After cleaning with formulas, what should you do to keep the results?', o:['Paste values','Delete the sheet','Add a space','Sort'], a:0, why:'Paste Special > Values replaces the formulas with their results.' }
  ],
  recap:['LOWER turns letters into lowercase.','Use it with TRIM to standardise emails.','PROPER is for names; UPPER is for codes.']
},

/* --- proper --- */
'proper': {
  title:'PROPER', tagline:'Capitalise the first letter of every word.',
  prereq:['lower'],
  what:['PROPER makes the first letter of each word a capital and the rest lowercase.','It is designed for names and titles.','It changes mixed or all-caps text into a clean format.'],
  why:['Clean up names typed in capitals or lowercase.','Make lists look consistent in reports.'],
  syntax:{ code:'=PROPER(text)', parts:[['text','The text or cell to convert.']] },
  points:['Each word starts with a capital.','The rest of every word becomes lowercase.','Letters after an apostrophe or hyphen are also capitalised: o\'neil becomes O\'Neil.','It does not know special cases such as McDonald or "PhD".','Combine with TRIM for clean names.'],
  mistakes:['Expecting it to handle special names such as McDonald correctly.','Using it on codes, such as EMP-1021.','Forgetting to paste values.'],
  example:{ title:'Cleaning names', scenario:'Names were typed in mixed styles.',
    table:withHl({rows:[['Name (raw)','Clean name'],['asha RAO','Asha Rao'],['KIRAN reddy','Kiran Reddy']]},{'A3':'find','B3':'hit'},'Sheet: Names'), task:'Clean the name in A3.', formula:'=PROPER(A3)',
    steps:['KIRAN reddy has capitals in the wrong places.','PROPER capitalises the first letter of each word and lowers the rest.'], result:'The formula returns Kiran Reddy.' },
  practice:{ q:'Write a formula that cleans the name in A2 by removing extra spaces and fixing the capitals.', hint:'Combine PROPER and TRIM.', solution:'=PROPER(TRIM(A2))', explain:'TRIM removes extra spaces, then PROPER fixes the capitalisation.' },
  interview:[
    { level:'Basic', q:'What does PROPER do?', a:'It capitalises the first letter of each word and converts all other letters to lowercase.' },
    { level:'Intermediate', q:'What are its limitations?', a:'It does not know exceptions such as McDonald, PhD or abbreviations, so it may produce Mcdonald or Phd. For such cases I fix a few cells manually after using it.' },
    { level:'Intermediate', q:'How do you clean full names from a messy column?', a:'=PROPER(TRIM(A2)) in a helper column, then paste values over the original.' },
    { level:'Scenario', q:'A report shows names in ALL CAPS. How can you change them quickly?', a:'Use PROPER in a helper column and paste values. Flash Fill can also do this by typing one example, but PROPER is more consistent for a large list.' }
  ],
  mcq:[
    { q:'What does `=PROPER("KIRAN reddy")` return?', o:['Kiran Reddy','KIRAN Reddy','kiran reddy','Kiran reddy'], a:0, why:'Each word starts with a capital and the rest is lowercase.' },
    { q:'What does PROPER do to the letter after an apostrophe?', o:['Capitalises it','Lowercases it','Removes it','Nothing'], a:0, why:'PROPER treats it as the start of a new word.' },
    { q:'What is a limitation of PROPER?', o:['It cannot handle names like McDonald','It cannot handle spaces','It removes digits','It only works on numbers'], a:0, why:'It capitalises mechanically, so McDonald becomes Mcdonald.' },
    { q:'Which formula cleans and fixes the capitals?', o:['=PROPER(TRIM(A2))','=PROPER+TRIM','=TRIM.PROPER(A2)','=A2.PROPER'], a:0, why:'Nest TRIM inside PROPER.' },
    { q:'Which function is best for codes such as EMP-1021?', o:['UPPER','PROPER','LOWER','TRIM only'], a:0, why:'Codes are normally all capitals.' }
  ],
  recap:['PROPER capitalises each word and lowercases the rest.','It does not know special names.','Use PROPER(TRIM()) for names.']
},

/* --- concat --- */
'concat': {
  title:'CONCAT and the & operator', tagline:'Join text from several cells into one.',
  prereq:[],
  what:['CONCAT joins text from cells or ranges.','The ampersand (&) does the same and works in every version.','CONCATENATE is the older name and still works.'],
  why:['Build full names, addresses, IDs and messages.','Create lookup keys by joining two columns.'],
  syntax:{ code:'=CONCAT(text1, [text2], ...)\n=A2 & " " & B2', parts:[['text1, text2, ...','Cells, ranges or text to join. Put spaces and separators inside quotes.'],['&','Joins two values and works in all versions.']] },
  points:['Spaces and commas are not added automatically: write `" "` between values.','CONCAT is available in Excel 2019, 2021 and Microsoft 365.','The `&` operator works in every version.','CONCAT accepts ranges, but without separators.','Use TEXTJOIN to add a separator and skip blanks.'],
  mistakes:['Forgetting the space, giving AshaRao.','Joining numbers and dates without TEXT, which shows raw numbers.','Using CONCAT in old versions.'],
  example:{ title:'Building a full name', scenario:'First and last names are in separate columns.',
    table:withHl({rows:[['First','Last','Full name'],['Asha','Rao','Asha Rao'],['Kiran','Reddy','Kiran Reddy']]},{'A2':'find','B2':'find','C2':'hit'},'Sheet: Staff'), task:'Join the first and last name of row 2.', formula:'=CONCAT(A2, " ", B2)',
    steps:['A2 is Asha and B2 is Rao.','The " " in the middle adds the space.'], result:'The formula returns Asha Rao. The same result comes from =A2&" "&B2.' },
  practice:{ q:'Write a formula using & that builds "Rao, Asha" from the first name in A2 and last name in B2.', hint:'Put the last name first, then a comma and a space in quotes.', solution:'=B2 & ", " & A2', explain:'The text between the quotes adds a comma and a space.' },
  interview:[
    { level:'Basic', q:'What are the ways to join text in Excel?', a:'The ampersand operator, CONCATENATE (old), CONCAT (Excel 2019 and later) and TEXTJOIN (which adds a separator and can skip blanks).' },
    { level:'Intermediate', q:'Why does =A2&B2 give AshaRao?', a:'Excel does not add spaces automatically. I write =A2&" "&B2 to add one.' },
    { level:'Intermediate', q:'How do you join text with a date so it displays correctly?', a:'Wrap the date in TEXT, for example ="Due on "&TEXT(A2,"dd-mmm-yyyy"). Without TEXT the date shows as a serial number.' },
    { level:'Scenario', q:'You need a lookup key from Region and Product, such as North-Pen. How?', a:'=A2&"-"&B2 in a helper column on both sheets. Then I can look up on the combined key.' }
  ],
  mcq:[
    { q:'What does `=A2 & " " & B2` return for Asha and Rao?', o:['Asha Rao','AshaRao','Asha  Rao','Rao Asha'], a:0, why:'The quoted space is placed between the values.' },
    { q:'Which versions support CONCAT?', o:['Excel 2019 and later','All versions','Only 365','Excel 2003'], a:0, why:'CONCAT came with Excel 2019 and Microsoft 365.' },
    { q:'Which operator joins text in all versions?', o:['&','+','#','@'], a:0, why:'The ampersand works in every version.' },
    { q:'Which function adds a separator and skips blanks?', o:['TEXTJOIN','CONCAT','LEN','TRIM'], a:0, why:'TEXTJOIN is built for this.' },
    { q:'How do you show a date inside joined text?', o:['Use TEXT with a format','Nothing needed','Use VALUE','Use LEN'], a:0, why:'TEXT turns the date into formatted text.' }
  ],
  recap:['Use & or CONCAT to join text; add separators yourself.','CONCAT needs Excel 2019 or later; & works everywhere.','TEXTJOIN adds separators and skips blanks.']
},

/* --- textjoin --- */
'textjoin': {
  title:'TEXTJOIN', tagline:'Join many cells with a separator, skipping blanks.',
  prereq:['concat'],
  what:['TEXTJOIN joins text from several cells using a separator you choose.','It can skip empty cells.','It accepts whole ranges.'],
  why:['Build lists like "Excel, SQL, Python" from several columns.','Create addresses without extra commas for blank parts.'],
  syntax:{ code:'=TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)', parts:[['delimiter','The separator, such as ", " or " - ".'],['ignore_empty','TRUE skips empty cells, FALSE includes them.'],['text1, ...','Cells or ranges to join.']] },
  points:['One formula can join a whole range: `TEXTJOIN(", ", TRUE, A2:C2)`.','TRUE for ignore_empty avoids doubled separators.','Available in **Excel 2019, 2021 and Microsoft 365**.','Older versions show `#NAME?`.','With FILTER or UNIQUE it can build a list in one cell.'],
  mistakes:['Using FALSE and getting extra commas.','Using it in old Excel versions.','Forgetting the delimiter argument.'],
  example:{ title:'Joining skills', scenario:'Each person has up to three skills in separate columns, and some are blank.',
    table:withHl({rows:[['Skill 1','Skill 2','Skill 3','Skills'],['Excel','SQL','','Excel, SQL']]},{'A2':'find','B2':'find','D2':'hit'},'Sheet: Skills'), task:'Join the skills of row 2.', formula:'=TEXTJOIN(", ", TRUE, A2:C2)',
    steps:['The delimiter is ", ".','TRUE skips the empty third cell.'], result:'The formula returns Excel, SQL, with no trailing comma.' },
  practice:{ q:'Write a formula that joins the cells A2:C2 with " | " between them, skipping empty cells.', hint:'Change the delimiter.', solution:'=TEXTJOIN(" | ", TRUE, A2:C2)', explain:'For Excel, SQL and a blank, the result is Excel | SQL.' },
  interview:[
    { level:'Basic', q:'What does TEXTJOIN do?', a:'It joins text from cells or ranges with a chosen separator, and can skip empty cells.' },
    { level:'Intermediate', q:'What is the advantage over CONCAT or the & operator?', a:'It adds the separator for me, accepts a whole range and can ignore blanks, so there are no stray commas.' },
    { level:'Intermediate', q:'Which versions have TEXTJOIN?', a:'Excel 2019, Excel 2021 and Microsoft 365. Older versions give #NAME?.' },
    { level:'Scenario', q:'How would you list all orders of one customer in a single cell?', a:'=TEXTJOIN(", ", TRUE, FILTER(A2:A100, B2:B100=F1)) in Excel 2021 or Microsoft 365, where FILTER returns the matching orders and TEXTJOIN joins them.' }
  ],
  mcq:[
    { q:'What does the second argument of TEXTJOIN control?', o:['Whether empty cells are ignored','The delimiter','The case','The first character'], a:0, why:'TRUE skips empty cells and FALSE includes them.' },
    { q:'What does `=TEXTJOIN(", ", TRUE, "Excel", "SQL", "")` return?', o:['Excel, SQL','Excel, SQL,','Excel,SQL','SQL, Excel'], a:0, why:'The empty text is skipped, so no extra comma.' },
    { q:'Which versions support TEXTJOIN?', o:['Excel 2019 and later','All versions','Excel 2010 and later','Only the web'], a:0, why:'TEXTJOIN arrived with Excel 2019.' },
    { q:'Can TEXTJOIN take a range?', o:['Yes','No','Only a single column','Only numbers'], a:0, why:'It accepts ranges directly.' },
    { q:'What does the first argument set?', o:['The separator','The range','The case','The count'], a:0, why:'The delimiter is placed between joined values.' }
  ],
  recap:['TEXTJOIN joins with a separator and can skip blanks.','It accepts ranges.','It needs Excel 2019 or later.']
},

/* --- substitute --- */
'substitute': {
  title:'SUBSTITUTE', tagline:'Replace specific text inside a text.',
  prereq:['len'],
  what:['SUBSTITUTE swaps old text for new text inside a cell.','It can replace every occurrence or just one.','It is case sensitive.'],
  why:['Remove hyphens from phone numbers or IDs.','Clean special characters from imported data.'],
  syntax:{ code:'=SUBSTITUTE(text, old_text, new_text, [instance_num])', parts:[['text','The text or cell to change.'],['old_text','The text to find.'],['new_text','What to put in its place. Use "" to delete.'],['instance_num','Optional. Which occurrence to replace. If left out, all are replaced.']] },
  points:['Use `""` as new_text to delete characters.','It is **case sensitive**.','Without instance_num, every occurrence is replaced.','`REPLACE` works by position, while SUBSTITUTE works by content.','Count occurrences: `LEN(A2)-LEN(SUBSTITUTE(A2,"-",""))`.'],
  mistakes:['Forgetting that it is case sensitive.','Using SUBSTITUTE when REPLACE (by position) is needed, or the reverse.','Forgetting the quotes around text.'],
  example:{ title:'Cleaning phone numbers', scenario:'Phone numbers contain a hyphen that should be removed.',
    table:withHl({rows:[['Phone (raw)','Clean'],['98765-43210','9876543210']]},{'A2':'find','B2':'hit'},'Sheet: Phones'), task:'Remove the hyphen from the number.', formula:'=SUBSTITUTE(A2, "-", "")',
    steps:['old_text is "-".','new_text is "", which means nothing.'], result:'The formula returns 9876543210 (as text).' },
  practice:{ q:'Write a formula that counts how many hyphens are in the text in A2.', hint:'Compare the length before and after removing hyphens.', solution:'=LEN(A2) - LEN(SUBSTITUTE(A2, "-", ""))', explain:'For 98765-43210, LEN is 11 and without the hyphen it is 10, so the result is 1.' },
  interview:[
    { level:'Basic', q:'What does SUBSTITUTE do?', a:'It replaces old text with new text inside a cell, for example removing hyphens or changing a word.' },
    { level:'Intermediate', q:'What is the difference between SUBSTITUTE and REPLACE?', a:'SUBSTITUTE replaces text by matching its content. REPLACE changes characters at a given position and length.' },
    { level:'Intermediate', q:'How do you count occurrences of a character in a cell?', a:'LEN(A2)-LEN(SUBSTITUTE(A2,"-","")) gives how many hyphens were removed, which is the count.' },
    { level:'Scenario', q:'Web data contains non-breaking spaces that TRIM does not remove. How do you fix it?', a:'=TRIM(SUBSTITUTE(A2, CHAR(160), " ")). SUBSTITUTE swaps the non-breaking space for a normal space and TRIM then cleans the rest.' }
  ],
  mcq:[
    { q:'What does `=SUBSTITUTE("98765-43210","-","")` return?', o:['9876543210','98765-43210','98765','43210'], a:0, why:'The hyphen is replaced by nothing.' },
    { q:'Is SUBSTITUTE case sensitive?', o:['Yes','No','Only for numbers','Only with instance_num'], a:0, why:'It matches the exact case of old_text.' },
    { q:'What happens if instance_num is left out?', o:['All occurrences are replaced','Only the first one','An error','Nothing'], a:0, why:'Every occurrence is replaced by default.' },
    { q:'Which function replaces by position?', o:['REPLACE','SUBSTITUTE','FIND','LEN'], a:0, why:'REPLACE uses a start position and length.' },
    { q:'What does `new_text` of "" do?', o:['Deletes the old text','Adds a space','Causes an error','Replaces with 0'], a:0, why:'Empty text removes the match.' }
  ],
  recap:['SUBSTITUTE replaces text by content; REPLACE works by position.','It is case sensitive.','Use "" to delete text.']
},

/* --- find --- */
'find': {
  title:'FIND', tagline:'Find the position of a character or text inside another text.',
  prereq:['left'],
  what:['FIND returns the position where text starts inside another text.','It is **case sensitive**.','SEARCH is similar but ignores case and allows wildcards.'],
  why:['Locate an @ in an email, a hyphen in a code or a space between names.','The key to LEFT, MID and RIGHT with variable lengths.'],
  syntax:{ code:'=FIND(find_text, within_text, [start_num])', parts:[['find_text','The text to look for.'],['within_text','The text to search in.'],['start_num','Optional. Position to start searching from. Default is 1.']] },
  points:['It returns a number: the position of the first character found.','Not found gives `#VALUE!`.','It is case sensitive and does not allow wildcards.','`SEARCH` is not case sensitive and allows wildcards.','Wrap in IFERROR when the text may be missing.'],
  mistakes:['Expecting case-insensitive matching.','Forgetting the #VALUE! when the text is not found.','Mixing up the order of the first two arguments.'],
  example:{ title:'Finding the @ in an email', scenario:'You want the position of the @ sign to split an email.',
    table:withHl({rows:[['Email','Position of @'],['asha.rao@example.com',9]]},{'A2':'find','B2':'hit'},'Sheet: Contacts'), task:'Find the position of @.', formula:'=FIND("@", A2)',
    steps:['"asha.rao" has 8 characters.','The @ is the 9th character.'], result:'The formula returns 9.' },
  practice:{ q:'Write a formula that returns the username (the text before @) from the email in A2.', hint:'LEFT with FIND minus 1.', solution:'=LEFT(A2, FIND("@", A2) - 1)', explain:'FIND returns 9, minus 1 is 8, and LEFT takes the first 8 characters: asha.rao.' },
  interview:[
    { level:'Basic', q:'What does FIND return?', a:'The position of the first character of the found text inside another text.' },
    { level:'Intermediate', q:'What is the difference between FIND and SEARCH?', a:'FIND is case sensitive and does not allow wildcards. SEARCH ignores case and allows wildcards such as * and ?.' },
    { level:'Intermediate', q:'What happens if the text is not found?', a:'FIND returns #VALUE!. I wrap it in IFERROR, or use ISNUMBER(FIND()) to test whether text exists.' },
    { level:'Scenario', q:'Split "Rao, Asha" into last and first names.', a:'Last name: =LEFT(A2, FIND(",", A2)-1). First name: =TRIM(MID(A2, FIND(",", A2)+1, 100)). FIND locates the comma so the lengths can vary.' }
  ],
  mcq:[
    { q:'What does `=FIND("@","asha.rao@example.com")` return?', o:['9','8','10','0'], a:0, why:'The @ is the 9th character.' },
    { q:'Is FIND case sensitive?', o:['Yes','No','Only with numbers','Only in 365'], a:0, why:'Use SEARCH for case-insensitive matching.' },
    { q:'What error appears when the text is not found?', o:['#VALUE!','#N/A','#DIV/0!','#REF!'], a:0, why:'FIND returns #VALUE! when there is no match.' },
    { q:'Which function allows wildcards?', o:['SEARCH','FIND','LEN','MID'], a:0, why:'SEARCH supports * and ?.' },
    { q:'Which formula checks whether A2 contains an @?', o:['=ISNUMBER(FIND("@",A2))','=FIND(A2,"@")','=LEN("@")','=@A2'], a:0, why:'FIND returns a number if the text is found, so ISNUMBER gives TRUE.' }
  ],
  recap:['FIND returns the position of text inside another text.','It is case sensitive; SEARCH is not.','Use it with LEFT, MID and RIGHT for variable lengths.']
},

/* --- text --- */
'text': {
  title:'TEXT', tagline:'Convert a number or date into text with a format you choose.',
  prereq:['concat'],
  what:['TEXT turns a value into text using a format code.','It controls how numbers and dates look when joined with other text.','The result is text, not a number.'],
  why:['Show dates as 15-Aug-2026 inside messages.','Display percentages or fixed decimals in joined text.'],
  syntax:{ code:'=TEXT(value, format_text)', parts:[['value','The number or date to format.'],['format_text','The format in quotes, such as "dd-mmm-yyyy", "0.00" or "0%".']] },
  points:['Date formats: `"dd-mmm-yyyy"` gives 15-Aug-2026, `"mmmm"` gives the month name.','Number formats: `"0.00"` gives two decimals, `"0%"` gives a percentage, `"#,##0"` adds thousand separators.','The result is text, so it cannot be added.','Format codes depend on the language settings of Excel.','Use it when joining numbers or dates into sentences.'],
  mistakes:['Joining a date with & and seeing a serial number such as 46249.','Trying to calculate with the text result.','Wrong format code.'],
  example:{ title:'Showing a date inside a sentence', scenario:'A due date should appear in a message such as "Due on 15-Aug-2026".',
    table:withHl({rows:[['Due date','Message'],['15-Aug-2026','Due on 15-Aug-2026']]},{'A2':'find','B2':'hit'},'Sheet: Tasks'), task:'Build the message from the date in A2.', formula:'="Due on " & TEXT(A2, "dd-mmm-yyyy")',
    steps:['TEXT turns the date into the text 15-Aug-2026.','& joins it to the words.'], result:'The formula returns Due on 15-Aug-2026.' },
  practice:{ q:'Write a formula that shows 0.18 as the text 18%.', hint:'Use the format "0%".', solution:'=TEXT(0.18, "0%")', explain:'The format code 0% multiplies by 100 and adds a percent sign.' },
  interview:[
    { level:'Basic', q:'What does the TEXT function do?', a:'It converts a number or date into text using a format code, such as "dd-mmm-yyyy" or "0.00".' },
    { level:'Intermediate', q:'Why does a joined date show as a number like 46249?', a:'Excel stores dates as serial numbers. Joining without TEXT shows the number. TEXT(A2,"dd-mmm-yyyy") shows it as a date.' },
    { level:'Intermediate', q:'Can you calculate with the result of TEXT?', a:'Not directly, because it returns text. Keep the original number for calculations and use TEXT only for display.' },
    { level:'Scenario', q:'You want the month name for each date in a report. How?', a:'=TEXT(A2, "mmmm") returns the full month name, and "mmm" returns the short form.' }
  ],
  mcq:[
    { q:'What does `=TEXT(0.18, "0%")` return?', o:['18%','0.18','0%','18'], a:0, why:'The format multiplies by 100 and adds the percent sign.' },
    { q:'What data type does TEXT return?', o:['Text','Number','Date','Boolean'], a:0, why:'TEXT always returns text.' },
    { q:'Which format code shows a date like 15-Aug-2026?', o:['"dd-mmm-yyyy"','"0.00"','"#,##0"','"hh:mm"'], a:0, why:'dd is the day, mmm the short month and yyyy the year.' },
    { q:'Which format shows two decimals?', o:['"0.00"','"0%"','"mmm"','"dd"'], a:0, why:'Two zeros after the point show two decimals.' },
    { q:'Why use TEXT when joining dates into a sentence?', o:['To avoid showing the serial number','To sort the dates','To add days','To remove spaces'], a:0, why:'TEXT formats the date as readable text.' }
  ],
  recap:['TEXT formats a value as text using a format code.','Use it when joining dates and numbers into sentences.','Keep the original value for calculations.']
}

  });

  /* ================= 2. EXTENDED CONTENT ================= */

/* --- left --- */
D('left',{ l:'Beginner', t:'LEFT takes characters from the start of a text. Pair it with FIND when the length varies.',
  i:['Codes, ids and names often start with a fixed prefix: EMP for employees, MH for Maharashtra. LEFT lifts that prefix out of the cell so you can group or count by it.','When the prefix has no fixed length, find the separator with FIND and take everything before it.'], a:'Tearing off the first words of a sentence.',
  h:['Write `=LEFT(text, n)` to take the first n characters.','If n is omitted, you get one character.','For variable length, use `LEFT(text, FIND(sep, text) - 1)`.','The result is text, even if it looks like a number.'],
  d:[FL(['first 3 characters'],[{ title:'EMP-1021', text:'E M P - 1 0 2 1' },{ title:'LEFT(A2, 3)', text:'**EMP**' }])],
  x:[X('Variation','The part before the @','Take the username from an email address.','Combine LEFT and FIND.','=LEFT(A2, FIND("@", A2) - 1)',['FIND gives the position of @ (9 for asha.rao@example.com).','LEFT takes the 8 characters before it.'],'The formula returns asha.rao.'),
     X('Business case','Counting employees by code prefix','Codes start with EMP or MGR. How many of each?','Use LEFT inside COUNTIF with a helper column.','Helper: =LEFT(A2, 3)\nCount: =COUNTIF(B:B, "EMP")',['The helper extracts the prefix.','COUNTIF counts the rows with each prefix.'],'The prefix column also feeds a pivot table.',withHl(CODES,{},'Sheet: Codes'))],
  e:[['The result is text','`LEFT("2026-01", 4)` is the text "2026". Use VALUE to calculate with it.'],['Fixed length assumption','Hard-coded lengths break when data varies. Use FIND for the separator.'],['Spaces count','Leading spaces are characters. TRIM first.'],['n larger than the text','Returns the whole text, with no error.']],
  p:[P('Medium','Return the first 4 characters of MGR-2005.','LEFT with 4.','=LEFT(A4, 4)','The result is MGR-.',withHl(CODES,{},'Sheet: Codes')),
     P('Interview','Extract the area code (before the first hyphen) from 080-23456789 and 0120-4567890.','Variable length.','=LEFT(A2, FIND("-", A2) - 1)','The results are 080 and 0120. FIND handles different lengths.')],
  q:[Q('Basic','What does LEFT do?','It returns the first n characters of a text.',{ f:[['What does it return if n is omitted?','One character.']] }),
     Q('Scenario','Extract the first name from many full names.','LEFT(A2, FIND(" ", A2) - 1), wrapped in IFERROR for names without a space.',{ t:'Flash Fill is faster for a one-off.' })],
  r:RT(['Need','Formula'],[['First n characters','`LEFT(t, n)`'],['Before a separator','`LEFT(t, FIND(sep, t) - 1)`'],['As a number','`VALUE(LEFT(t, n))`'],['Last n characters','`RIGHT(t, n)`']]), rel:['right','mid','find','len'] });

/* --- right --- */
D('right',{ l:'Beginner', t:'RIGHT takes characters from the end of a text, such as the last four digits of an account number.',
  i:['The useful part of a code is often at the end: the number after a prefix, the file extension, the last digits of a phone number.','RIGHT lifts that tail out. For a variable-length tail, combine it with LEN and FIND.'], a:'Reading the last words of a sentence.',
  h:['Write `=RIGHT(text, n)`.','Excel counts n characters from the end.','For a tail after a separator, use `RIGHT(t, LEN(t) - FIND(sep, t))`.','Trim the text first if trailing spaces are possible.'],
  d:[FL(['last 4 characters'],[{ title:'EMP-1021', text:'E M P - **1 0 2 1**' },{ title:'RIGHT(A2, 4)', text:'**1021**' }])],
  x:[X('Variation','A masked account number','Show only the last 4 digits.','Join a mask to the tail.','="XXXX-" & RIGHT(A2, 4)',['RIGHT takes the last four digits.','& joins them to the mask.'],'A number ending 1234 shows as XXXX-1234.'),
     X('Business case','The file extension','A list of file names needs its extension.','Find the dot, take the rest.','=RIGHT(A2, LEN(A2) - FIND(".", A2))',['FIND locates the dot.','LEN minus that position is the tail length.'],'report.xlsx returns xlsx. Names with several dots need a smarter formula.')],
  e:[['Trailing spaces','They are characters, so the tail is wrong. TRIM first.'],['Text, not number','RIGHT returns text. Wrap in VALUE to calculate.'],['Several separators','FIND returns the first one. For the last use SUBSTITUTE tricks or TEXTAFTER (365).'],['n larger than the text','Returns the whole text.']],
  p:[P('Medium','Return the last 4 digits of the code in A2 as a number.','VALUE around RIGHT.','=VALUE(RIGHT(A2, 4))','1021 becomes a number you can calculate with.',withHl(CODES,{},'Sheet: Codes')),
     P('Interview','Get the text after the last space in a full name with a middle name.','Variable word count.','=TRIM(RIGHT(SUBSTITUTE(A2, " ", REPT(" ", 100)), 100)), or TEXTAFTER(A2, " ", -1) in Microsoft 365.','The padding trick isolates the last word.')],
  q:[Q('Basic','What does RIGHT do?','It returns the last n characters of a text.',{ f:[['What type does it return?','Text.']] }),
     Q('Scenario','Show only the last 4 digits of card numbers in a report.','="XXXX-"&RIGHT(A2,4). Never include the full number in the report.',{ t:'Mask at the source where possible.' })],
  r:RT(['Need','Formula'],[['Last n characters','`RIGHT(t, n)`'],['After a separator','`RIGHT(t, LEN(t) - FIND(sep, t))`'],['Last word','`TRIM(RIGHT(SUBSTITUTE(t," ",REPT(" ",100)),100))`'],['As number','`VALUE(RIGHT(t, n))`']]), rel:['left','mid','len','find'] });

/* --- mid --- */
D('mid',{ l:'Beginner to Intermediate', t:'MID takes characters from the middle of a text, given a start position and a length.',
  i:['Structured codes hide information in the middle: INV-2026-0045 holds a year in positions 5 to 8. MID lifts out exactly that slice.','Positions count from 1, and every character, including hyphens, counts.'], a:'Cutting a slice from the middle of a loaf.',
  h:['Work out the start position (first character is 1).','Decide how many characters to take.','Write `=MID(text, start, length)`.','When the position varies, calculate it with FIND.'],
  d:[FL(['start 5, length 4'],[{ title:'INV-2026-0045', text:'I N V - **2 0 2 6** - 0 0 4 5' },{ title:'MID(A2, 5, 4)', text:'**2026**' }])],
  x:[X('Variation','A slice after a separator','Take the part after the first hyphen.','Use FIND for the start.','=MID(A2, FIND("-", A2) + 1, 100)',['FIND gives the first hyphen position.','100 is a length longer than any tail.'],'INV-2026-0045 returns 2026-0045.'),
     X('Business case','Rebuilding a date from digits','An export stores dates as 20260815.','Slice and join with DATE.','=DATE(LEFT(A2,4), MID(A2,5,2), RIGHT(A2,2))',['LEFT takes the year, MID the month and RIGHT the day.','DATE builds a real date.'],'The result is 15-Aug-2026, a real date that works in formulas.')],
  e:[['Position counts from 1','Starting at 0 gives an error.'],['Separators count','Hyphens and spaces are characters in the position count.'],['Result is text','Use VALUE or DATE to convert.'],['Start beyond the end','Returns an empty string.']],
  p:[P('Medium','Return the two letters after the first letter of the code in A2.','Start 2, length 2.','=MID(A2, 2, 2)','EMP-1021 gives MP.',withHl(CODES,{},'Sheet: Codes')),
     P('Interview','Extract the text between the first and second hyphen when lengths vary.','Two FINDs.','=MID(A2, FIND("-",A2)+1, FIND("-",A2,FIND("-",A2)+1)-FIND("-",A2)-1)','The nested FIND with a start position gives the second hyphen.')],
  q:[Q('Basic','What are the arguments of MID?','The text, the start position (first character is 1) and the number of characters.',{ f:[['How does it differ from LEFT?','LEFT always starts at the beginning. MID starts anywhere.']] }),
     Q('Scenario','Parse structured IDs like PUN-2026-0045 into parts.','MID or Text to Columns on the hyphen. FIND makes the formula robust to varying lengths.',{ t:'Text to Columns is quicker for one-off cleaning.' })],
  r:RT(['Need','Formula'],[['Slice','`MID(t, start, len)`'],['After a separator','`MID(t, FIND(sep,t)+1, 100)`'],['Digits to date','`DATE(LEFT(t,4),MID(t,5,2),RIGHT(t,2))`'],['Position','`FIND(sep, t)`']]), rel:['left','right','find','date'] });

/* --- len --- */
D('len',{ l:'Beginner', t:'LEN counts the characters in a cell, including spaces. Comparing it with LEN(TRIM()) reveals hidden spaces.',
  i:['LEN is a small function with a big use: validation. A phone number must have 10 digits, an ID must have 8 characters, and a cell with hidden spaces is longer than it should be.','Because every character counts, LEN is also the fastest way to detect invisible differences between two cells that look equal.'], a:'Measuring a ribbon to check it is the right length.',
  h:['Write `=LEN(cell)`.','Spaces, hyphens and symbols all count.','Compare with the expected length in an IF.','Compare with `LEN(TRIM(cell))` to find extra spaces.'],
  d:[FL(['count characters'],[{ title:'EMP-1021', text:'8 characters' },{ title:'" Asha   Rao "', text:'12 characters (8 after TRIM)' }])],
  x:[X('Variation','Validating a phone number','Phone numbers must have exactly 10 digits.','Use LEN inside IF.','=IF(LEN(A2)=10, "OK", "Check")',['A hyphenated number has 11 characters and fails.','Remove hyphens first if they are allowed.'],'Flagged rows are easy to filter and fix.'),
     X('Business case','Finding cells with hidden spaces','A lookup fails and you suspect spaces.','Count the affected cells.','=SUMPRODUCT(--(LEN(A2:A100) <> LEN(TRIM(A2:A100))))',['Each cell whose length changes after TRIM has extra spaces.'],'The result is the number of cells to clean.')],
  e:[['Numbers become text','`LEN(12345)` is 5. Formatting such as thousand separators is not counted.'],['Empty cell is 0','LEN of a blank is 0.'],['Spaces count','A trailing space adds 1.'],['Non-breaking spaces','They count too, and TRIM does not remove them.']],
  p:[P('Medium','Return OK when the code in A2 has exactly 8 characters.','LEN inside IF.','=IF(LEN(A2)=8, "OK", "Check")','EMP-1021 has 8 characters.',withHl(CODES,{},'Sheet: Codes')),
     P('Interview','Two names look identical but a lookup fails. How does LEN help?','Compare lengths.','Compare LEN of both. A difference means hidden characters. TRIM and SUBSTITUTE(CHAR(160)) usually fix it.','LEN turns an invisible difference into a number.')],
  q:[Q('Basic','What does LEN return?','The number of characters in a text, counting spaces and symbols.',{ f:[['Does it count spaces?','Yes.']] }),
     Q('Scenario','How do you find all cells with extra spaces?','Compare LEN(A2) with LEN(TRIM(A2)). A different value means extra spaces.',{ t:'Non-breaking spaces need SUBSTITUTE with CHAR(160).' })],
  r:RT(['Need','Formula'],[['Length','`LEN(A2)`'],['Extra spaces?','`LEN(A2)<>LEN(TRIM(A2))`'],['Validate length','`IF(LEN(A2)=10,"OK","Check")`'],['Count a character','`LEN(t)-LEN(SUBSTITUTE(t,"-",""))`']]), rel:['trim','left','substitute','find'] });

/* --- trim --- */
DEEP['trim'] = {
  level:'Beginner',
  tldr:'TRIM removes leading, trailing and repeated spaces. It is the first step in cleaning text before matching or counting.',
  intuition:{ text:[
    'Two names can look identical on screen but differ by one invisible space at the end. For Excel, `"Asha"` and `"Asha "` are different values, so a lookup fails, a COUNTIF undercounts and a pivot table shows two entries.',
    'TRIM is the cheap fix. Build the habit of cleaning keys with TRIM before using them, and a whole family of confusing errors disappears.'
  ], analogy:'Wiping the whiteboard before writing: you cannot see the old marks, but they confuse the result.' },
  how:[
    'TRIM removes all spaces from the start and the end of the text.',
    'It reduces any run of spaces between words to a single space.',
    'It does not remove non-breaking spaces (`CHAR(160)`), which come from web pages.',
    'Combine with `SUBSTITUTE` to deal with those.',
    'Paste the cleaned results back as values to replace the dirty originals.'
  ],
  diagrams:[
    { type:'flow', arrows:['TRIM'], panels:[
      { title:'Before (12 characters)', text:'" Asha   Rao "' },
      { title:'After (8 characters)', text:'"Asha Rao"' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'Spaces copied from a web page', scenario:'Text pasted from a website still has spaces after TRIM, because they are non-breaking spaces.', table:withHl({rows:[['Raw','Length'],['Pune',5],['Pune (with non-breaking space)',5]]},{},'Sheet: Cities'), task:'Clean both kinds of space.',
      formula:'=TRIM(SUBSTITUTE(A2, CHAR(160), " "))', steps:['SUBSTITUTE replaces each non-breaking space with a normal one.','TRIM then removes the extra spaces.'], result:'The text finally matches the clean value, and the lookup works.' },
    { level:'Business case', title:'Cleaning keys before a lookup', scenario:'Order ids typed by hand have stray spaces, so VLOOKUP returns #N/A for some rows.', table:withHl({rows:[['Typed ID','Clean ID','Price'],['P103 ','P103',1499],[' P101','P101',799],['P105','P105',899]]},{'A2':'miss','A3':'miss','B2:B4':'hit'},'Sheet: Orders'),
      task:'Add a clean key and use it in the lookup.', formula:'=TRIM(A2)\n=VLOOKUP(B2, $F$2:$G$100, 2, FALSE)', steps:['The helper column holds the trimmed id.','VLOOKUP uses the helper instead of the raw value.'], result:'All three lookups now succeed. Paste the clean ids as values and delete the raw column once verified.' }
  ],
  edge:[
    { t:'Non-breaking spaces', d:'Data from websites and some systems uses `CHAR(160)`. TRIM leaves it alone, so use SUBSTITUTE first.' },
    { t:'Numbers stored as text', d:'TRIM returns text. `=TRIM("123")` is text, not a number. Wrap with VALUE if you need to calculate.' },
    { t:'Detecting hidden spaces', d:'`=LEN(A2)<>LEN(TRIM(A2))` returns TRUE when a cell has extra spaces. Use it to count how many cells need cleaning.' },
    { t:'Formulas versus values', d:'TRIM is a formula. To keep the cleaned text, copy and Paste Special > Values over the original.' },
    { t:'Other invisible characters', d:'Line breaks and control characters need `CLEAN`. A full cleaner is `=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))`.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Count how many cells in A2:A100 contain extra spaces.', hint:'Compare each cell with its trimmed version.', solution:'=SUMPRODUCT(--(LEN(A2:A100) <> LEN(TRIM(A2:A100))))', explain:'Each cell whose length changes after TRIM has extra spaces. The double minus turns TRUE and FALSE into 1 and 0 so SUMPRODUCT can add them.' },
    { level:'Interview', q:'Two values look identical but VLOOKUP fails. Walk through how you find out why.', hint:'Think of invisible differences.', solution:'1. Compare LEN() of both: different lengths mean extra characters.\n2. TRIM, then compare again.\n3. If the lengths still differ, check CHAR(160) with SUBSTITUTE.\n4. Check text versus number with ISNUMBER.\n5. Use CODE(MID(...)) to inspect suspicious characters.', explain:'A systematic checklist beats guessing, and it shows you have debugged real data.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does TRIM do?', a:'TRIM removes leading and trailing spaces and reduces repeated spaces between words to one.',
      follow:[ { q:'Why does it matter for lookups?', a:'A trailing space makes two otherwise equal values different, so the lookup returns #N/A.' } ] },
    { level:'Intermediate', q:'TRIM does not seem to work on data from a web page. Why?', a:'Web pages often use non-breaking spaces, CHAR(160), which TRIM ignores. I replace them with normal spaces first: =TRIM(SUBSTITUTE(A2, CHAR(160), " ")).' },
    { level:'Scenario', q:'You must clean 50,000 customer names. What is your approach?', a:'Add a helper column with TRIM (and PROPER for names), check a sample, then paste the results as values over the original and remove the helper. For recurring files, I would do the same cleaning in Power Query so it repeats automatically.' }
  ],
  ref:{ headers:['Problem','Fix'], rows:[['Leading, trailing, double spaces','`TRIM(A2)`'],['Non-breaking spaces','`SUBSTITUTE(A2, CHAR(160), " ")`'],['Line breaks, control characters','`CLEAN(A2)`'],['All together','`TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))`'],['Detect','`LEN(A2) <> LEN(TRIM(A2))`']] },
  related:['len','substitute','proper','remove-duplicates']
};

/* --- upper --- */
D('upper',{ l:'Beginner', t:'UPPER converts all letters to capitals. Use it to standardise codes and identifiers.',
  i:['Excel comparisons ignore case, but humans and other systems do not. Codes such as MH, DL or EMP look better and import more reliably when written in one case.','UPPER makes the case consistent, usually together with TRIM.'], a:'Writing everything in block capitals on a form.',
  h:['Write `=UPPER(text)`.','Every letter becomes a capital.','Digits and symbols are unchanged.','Paste values over the original to keep the result.'],
  d:[FL(['UPPER'],[{ title:'emp-1021', text:'emp-1021' },{ title:'Result', text:'**EMP-1021**' }])],
  x:[X('Variation','Clean codes','Remove spaces and standardise case.','Nest TRIM inside UPPER.','=UPPER(TRIM(A2))',['TRIM removes stray spaces.','UPPER fixes the case.'],'" mgr-2005 " becomes MGR-2005.'),
     X('Business case','Case-sensitive comparison','Two systems must match IDs exactly, including case.','Use EXACT.','=EXACT(A2, B2)',['`=` ignores case, EXACT does not.','UPPER on both sides makes them comparable.'],'EXACT("abc","ABC") is FALSE, and EXACT(UPPER(...),UPPER(...)) is TRUE.')],
  e:[['Not for names','Names deserve PROPER, not all capitals.'],['Equality ignores case','`A2="abc"` is TRUE for ABC. Use EXACT for case-sensitive tests.'],['Formulas not values','Paste Special > Values to keep the cleaned text.'],['Accents','UPPER handles accented letters, but locale rules can vary.']],
  p:[P('Medium','Return the first 3 letters of a code in capitals.','Nest LEFT.','=UPPER(LEFT(A2, 3))','emp-1021 gives EMP.'),
     P('Interview','Are Excel text comparisons case sensitive?','Think of the = operator.','No: ="a"="A" is TRUE. Use EXACT for a case-sensitive comparison.','This also explains why lookups match regardless of case.')],
  q:[Q('Basic','What does UPPER do?','It converts all letters in a text to capitals.',{ f:[['Does it change numbers?','No.']] }),
     Q('Scenario','Clean state codes typed in mixed case.','=UPPER(TRIM(A2)) in a helper column, then paste values over the original.',{ t:'For repeated cleaning use Power Query.' })],
  r:RT(['Function','Result'],[['`UPPER`','ASHA RAO'],['`LOWER`','asha rao'],['`PROPER`','Asha Rao'],['`EXACT`','Case-sensitive compare']]), rel:['lower','proper','trim','substitute'] });

/* --- lower --- */
D('lower',{ l:'Beginner', t:'LOWER converts all letters to lowercase. It is the standard for email addresses and usernames.',
  i:['Emails and usernames are normally stored in lowercase, so that the same address typed two ways is treated as one.','LOWER, together with TRIM, makes such fields consistent before you remove duplicates or look them up.'], a:'Writing everything in small letters so it is uniform.',
  h:['Write `=LOWER(text)`.','Every letter becomes lowercase.','Combine with TRIM for clean data.','Paste values over the original.'],
  d:[FL(['LOWER'],[{ title:'Asha.Rao@Example.com', text:'mixed case' },{ title:'Result', text:'**asha.rao@example.com**' }])],
  x:[X('Variation','A clean email','Remove spaces and fix case.','Nest TRIM inside LOWER.','=LOWER(TRIM(A2))',['TRIM then LOWER cleans the cell.'],'" ASHA@X.com " becomes asha@x.com.'),
     X('Business case','A username from a name','Create asha.rao from Asha Rao.','Combine LOWER and SUBSTITUTE.','=LOWER(SUBSTITUTE(TRIM(A2), " ", "."))',['TRIM cleans spaces, SUBSTITUTE swaps the space for a dot.'],'The result is asha.rao.')],
  e:[['Do not lowercase names','Use PROPER for people\'s names.'],['Duplicates','Remove Duplicates ignores case, but a LOWER helper makes COUNTIF matching explicit.'],['Pasting values','Keep cleaned text with Paste Special > Values.'],['Locale','Rare letters (such as Turkish i) follow locale rules.']],
  p:[P('Medium','Standardise an email in A2.','Nest TRIM.','=LOWER(TRIM(A2))','The result has no spaces and no capitals.'),
     P('Interview','Why standardise case in emails before removing duplicates?','Think of equal-looking values.','Different case or spaces make otherwise equal values look different to some tools. Standardising ensures duplicates are detected consistently.','Cleaning first makes duplicate detection reliable.')],
  q:[Q('Basic','What does LOWER do?','It converts every letter to lowercase.',{ f:[['Which function capitalises each word?','PROPER.']] }),
     Q('Scenario','Clean a column of 50,000 emails.','LOWER(TRIM()) in a helper column, check a sample, then paste values. For regular files use Power Query.',{ t:'A formula column is easy to audit.' })],
  r:RT(['Need','Formula'],[['Lowercase','`LOWER(t)`'],['Clean email','`LOWER(TRIM(t))`'],['Username','`LOWER(SUBSTITUTE(TRIM(t)," ","."))`'],['Names','`PROPER(t)`']]), rel:['upper','proper','trim','remove-duplicates'] });

/* --- proper --- */
D('proper',{ l:'Beginner', t:'PROPER capitalises the first letter of every word and lowercases the rest. It is made for names, with a few known exceptions.',
  i:['Names arrive in every style: all capitals, all lowercase, mixed. PROPER gives them one tidy format for reports and mail merges.','It works by rule, not by knowledge, so McDonald becomes Mcdonald and an apostrophe starts a new word.'], a:'A copy editor fixing capitals on a list of names.',
  h:['Write `=PROPER(text)`.','The first letter of each word becomes a capital.','Everything else becomes lowercase.','Combine with TRIM and fix known exceptions by hand.'],
  d:[FL(['PROPER'],[{ title:'KIRAN reddy', text:'wrong capitals' },{ title:'Result', text:'**Kiran Reddy**' }])],
  x:[X('Variation','Names with spaces','Clean spacing and capitals.','Nest TRIM.','=PROPER(TRIM(A2))',['TRIM removes the extra spaces.','PROPER fixes the capitals.'],'"  aSHA   rao " becomes Asha Rao.'),
     X('Business case','Exceptions','A client list contains O\'Neil, McDonald and the abbreviation LLC.','Know the limits.','=PROPER("o\'neil")  -> O\'Neil\n=PROPER("mcdonald") -> Mcdonald',['The apostrophe is treated as a word boundary.','PROPER does not know Mc, Mac or abbreviations.'],'Review special names manually, or keep a small exceptions list.')],
  e:[['Special names','McDonald, DeSouza and abbreviations are not handled.'],['Apostrophes and hyphens','The letter after each is capitalised.'],['Not for codes','Do not use PROPER on codes like EMP-1021.'],['Paste values','Keep the result with Paste Special > Values.']],
  p:[P('Medium','Fix capitals and spaces of a name in A2.','Nest TRIM.','=PROPER(TRIM(A2))','Both problems are fixed in one formula.'),
     P('Interview','PROPER turned "NASA" into "Nasa". What do you do?','Exceptions.','Use a short exceptions table with SUBSTITUTE or a lookup, or correct those cells manually.','Say clearly that PROPER is rule-based, not intelligent.')],
  q:[Q('Basic','What does PROPER do?','It capitalises the first letter of each word and converts the rest to lowercase.',{ f:[['What are its limitations?','It does not know exceptions such as McDonald or abbreviations.']] }),
     Q('Scenario','Clean 10,000 names.','PROPER(TRIM()) in a helper column, then review exceptions. Power Query has a Capitalize Each Word step for repeated files.',{ t:'Accept that a few special names need manual fixes.' })],
  r:RT(['Function','Example result'],[['`PROPER`','Asha Rao'],['`UPPER`','ASHA RAO'],['`LOWER`','asha rao'],['Clean name','`PROPER(TRIM(t))`']]), rel:['upper','lower','trim','concat'] });

/* --- concat --- */
D('concat',{ l:'Beginner', t:'Join text with `&` (all versions) or CONCAT (2019+). Add the spaces and separators yourself.',
  i:['Reports need full names, addresses and labels built from separate cells. Joining text is the way to build them, and also to build lookup keys from two columns.','Excel does not add spaces for you. If you forget the separator, the names run together.'], a:'Gluing words together, with a space where you want one.',
  h:['Use `=A2 & " " & B2`, with the separator in quotes.','Or `=CONCAT(A2, " ", B2)` in Excel 2019 and later.','For dates and numbers, wrap them in TEXT first.','For many cells with a separator, use TEXTJOIN.'],
  d:[FL(['join'],[{ title:'Asha | Rao', text:'two cells' },{ title:'A2 & " " & B2', text:'**Asha Rao**' }])],
  x:[X('Variation','Last name first','Show names as "Rao, Asha".','Reorder and add a comma.','=B2 & ", " & A2',['The text in quotes adds the comma and space.'],'The result is Rao, Asha.'),
     X('Business case','A lookup key from two columns','Match on Region and Product together.','Build the key with &.','=A2 & "|" & B2',['A separator that cannot appear in the data prevents false matches.','Use the same formula on both sheets.'],'North|Pen is unique, and VLOOKUP can search on it.')],
  e:[['No automatic spaces','Add them yourself in quotes.'],['Dates become numbers','`"Due " & A2` shows 46249. Use TEXT(A2, "dd-mmm-yyyy").'],['Version','CONCAT needs Excel 2019+. The & operator works everywhere.'],['Blank cells','Joining blanks leaves double separators. TEXTJOIN with ignore_empty fixes that.']],
  p:[P('Medium','Build "Asha Rao (Pune)" from first name, last name and city in A2, B2, C2.','Use & and quotes.','=A2 & " " & B2 & " (" & C2 & ")"','Each piece of fixed text goes in quotes.'),
     P('Interview','Why use a separator when building a lookup key from two columns?','Think of false matches.','Without it, "AB"+"C" and "A"+"BC" both become ABC. A separator such as | keeps them different.','This avoids hard-to-find mismatches.')],
  q:[Q('Basic','How do you join text in Excel?','With the & operator, CONCATENATE (old), CONCAT (2019+) or TEXTJOIN.',{ f:[['Why does a joined date show a number?','Dates are numbers; wrap them in TEXT.']] }),
     Q('Scenario','Build a lookup key from two columns.','=A2&"|"&B2 on both sheets, then look up on the key.',{ t:'XLOOKUP can also match two columns without a helper key.' })],
  r:RT(['Need','Formula'],[['Join','`=A2 & " " & B2`'],['CONCAT','`=CONCAT(A2, " ", B2)`'],['With a date','`="Due " & TEXT(A2,"dd-mmm-yyyy")`'],['With separator','`=TEXTJOIN(", ", TRUE, A2:C2)`']]), rel:['textjoin','text','trim','vlookup'] });

/* --- textjoin --- */
D('textjoin',{ l:'Intermediate', t:'TEXTJOIN joins many cells with one separator and can skip blanks. It needs Excel 2019 or later.',
  i:['Joining ten cells with & is long, and blanks leave double commas. TEXTJOIN takes a whole range, a separator, and a switch that says whether to skip empty cells.','It is the natural tool for lists such as skills, tags, or all matching items in one cell.'], a:'A string that ties items together with the same knot, skipping empty slots.',
  h:['Write `=TEXTJOIN(separator, ignore_empty, range)`.','The separator goes in quotes, such as `", "`.','`TRUE` skips empty cells; `FALSE` keeps them.','Combine with FILTER to join all matching items.'],
  d:[FL(['join, skip blanks'],[{ title:'Excel | SQL | (blank)', text:'3 cells' },{ title:'TEXTJOIN(", ", TRUE, A2:C2)', text:'**Excel, SQL**' }])],
  x:[X('Variation','Keeping blanks','Show every slot, including the empty ones.','Set ignore_empty to FALSE.','=TEXTJOIN(", ", FALSE, A2:C2)',['The empty cell still gets a separator.'],'The result is Excel, SQL, (with a trailing separator).'),
     X('Business case','All orders of a customer in one cell','A summary shows each customer\'s order ids in a single cell.','Combine FILTER and TEXTJOIN.','=TEXTJOIN(", ", TRUE, FILTER(A2:A100, B2:B100=F2))',['FILTER returns the order ids of the customer in F2.','TEXTJOIN joins them.'],'Asha shows O-101, O-103, O-106. Requires Microsoft 365 for FILTER.')],
  e:[['Version','Excel 2019, 2021 and Microsoft 365. Older versions show #NAME?.'],['TRUE skips blanks','Empty strings from formulas are also skipped when ignore_empty is TRUE.'],['Cell limit','The result is limited to 32,767 characters.'],['Order','Items are joined in the order of the range.']],
  p:[P('Medium','Join A2:C2 with " | " and skip blanks.','Change the separator.','=TEXTJOIN(" | ", TRUE, A2:C2)','Excel | SQL for a blank third cell.'),
     P('Interview','Join all values in a column into one cell without helper columns in Excel 2016.','No TEXTJOIN.','Use a helper column with running concatenation (=B2&", "&A3), or Power Query\'s Group By with Combine, or VBA.','Know the alternatives for older versions.')],
  q:[Q('Basic','What does TEXTJOIN do?','It joins text from cells or ranges with a separator and can skip empty cells.',{ f:[['What does the second argument do?','TRUE skips empty cells, FALSE keeps them.']] }),
     Q('Scenario','List the products of one order in a single cell.','TEXTJOIN with FILTER, or Power Query if the version is older.',{ t:'Long lists in one cell are hard to use in later analysis.' })],
  r:RT(['Argument','Meaning'],[['`delimiter`','Separator, in quotes'],['`ignore_empty`','TRUE skips blanks'],['`text1...`','Cells or ranges'],['Versions','2019, 2021, 365']]), rel:['concat','filter-function','unique','text'] });

/* --- substitute --- */
D('substitute',{ l:'Beginner to Intermediate', t:'SUBSTITUTE replaces specific text inside a cell. It is case sensitive, and an empty replacement deletes text.',
  i:['Cleaning often means swapping one piece of text for another: remove hyphens from phone numbers, change a department name, drop a unit from a number.','SUBSTITUTE does this by content, which differs from REPLACE, which works by position.'], a:'Find and Replace as a formula.',
  h:['Write `=SUBSTITUTE(text, old, new)`.','Every occurrence of `old` becomes `new`.','Use `""` as new text to delete.','Add a fourth argument to replace only one occurrence.'],
  d:[FL(['remove "-"'],[{ title:'98765-43210', text:'with hyphen' },{ title:'SUBSTITUTE(A2, "-", "")', text:'**9876543210**' }])],
  x:[X('Variation','Counting a character','How many hyphens are in a code?','Compare lengths.','=LEN(A2) - LEN(SUBSTITUTE(A2, "-", ""))',['Removing hyphens shortens the text by one per hyphen.'],'INV-2026-0045 has 2 hyphens.'),
     X('Business case','Cleaning web data','Spaces copied from a website do not respond to TRIM.','Replace the non-breaking space first.','=TRIM(SUBSTITUTE(A2, CHAR(160), " "))',['CHAR(160) is a non-breaking space.','SUBSTITUTE swaps it for a normal space and TRIM cleans up.'],'Lookups on the cleaned text now work.')],
  e:[['Case sensitive','"a" does not match "A". Use LOWER or nest two SUBSTITUTEs.'],['All occurrences by default','Use the 4th argument for one occurrence.'],['SUBSTITUTE versus REPLACE','REPLACE changes characters at a position and length.'],['Result is text','Convert numbers with VALUE.']],
  p:[P('Medium','Remove spaces and hyphens from a phone number.','Nest two SUBSTITUTEs.','=SUBSTITUTE(SUBSTITUTE(A2, "-", ""), " ", "")','98765 43210 becomes 9876543210.'),
     P('Interview','What is the difference between SUBSTITUTE and REPLACE?','Content versus position.','SUBSTITUTE replaces text by matching its content. REPLACE changes characters at a start position and length.','Say when you would use each.')],
  q:[Q('Basic','What does SUBSTITUTE do?','It replaces occurrences of old text with new text inside a cell.',{ f:[['Is it case sensitive?','Yes.']] }),
     Q('Scenario','Clean currency symbols and thousand separators to calculate.','=VALUE(SUBSTITUTE(SUBSTITUTE(A2, "₹", ""), ",", "")).',{ t:'For many files, Power Query is cleaner.' })],
  r:RT(['Need','Formula'],[['Replace text','`SUBSTITUTE(t, old, new)`'],['Delete text','`SUBSTITUTE(t, "x", "")`'],['Count characters','`LEN(t)-LEN(SUBSTITUTE(t,"x",""))`'],['By position','`REPLACE(t, start, n, new)`']]), rel:['trim','find','len','find-replace'] });

/* --- find --- */
DEEP['find'] = {
  level:'Intermediate',
  tldr:'FIND returns the **position** of a character or text inside another text. It is the key to extracting variable-length parts with LEFT, MID and RIGHT.',
  intuition:{ text:[
    'LEFT, MID and RIGHT work when you know how many characters to take. In real data you rarely do: names have different lengths, emails have different usernames. FIND tells you where the separator is, and then the other functions can cut around it.',
    'The pattern is always the same: find the separator, then take everything before it, or everything after it.'
  ], analogy:'Finding the comma in a sentence so you know where the first clause ends.' },
  how:[
    '`FIND(find_text, within_text)` returns the position of the first match, starting from 1.',
    'To take the text **before** the separator: `LEFT(text, FIND(sep, text) - 1)`.',
    'To take the text **after** it: `MID(text, FIND(sep, text) + 1, 100)`.',
    'If the text is not found, FIND returns `#VALUE!`, so wrap in IFERROR when that can happen.',
    'FIND is case sensitive. SEARCH is the same but ignores case and allows wildcards.'
  ],
  diagrams:[
    { type:'flow', arrows:['FIND(" ", A2) = 5','LEFT, MID'], panels:[
      { title:'"Asha Rao"', text:'A s h a ␣ R a o\n1 2 3 4 **5** 6 7 8' },
      { title:'First name', text:'LEFT(A2, 5-1) = Asha' },
      { title:'Last name', text:'MID(A2, 5+1, 100) = Rao' }
    ] }
  ],
  examples:[
    { base:true, level:'Basic' },
    { level:'Variation', title:'FIND is case sensitive, SEARCH is not', scenario:'Look for the letter R in Asha Rao.', table:withHl({rows:[['Text','FIND("r")','SEARCH("r")'],['Asha Rao','#VALUE!',6]]},{'B2':'miss','C2':'hit'},'Sheet: Demo'), task:'Compare the two functions.', formula:'=FIND("r", A2)\n=SEARCH("r", A2)', steps:['The text contains a capital R, not a lowercase r.','FIND requires the exact case, so it fails.','SEARCH ignores case and finds the R at position 6.'], result:'Use SEARCH when case does not matter, and FIND when it does.' },
    { level:'Business case', title:'Splitting full names into two columns', scenario:'A contact list has full names in one column, and the mail merge needs first and last names separately.', table:withHl({rows:[['Full name','First','Last'],['Asha Rao','Asha','Rao'],['Kiran Reddy','Kiran','Reddy']]},{'A2':'find','B2:C2':'hit'},'Sheet: Contacts'),
      task:'Split on the first space.', formula:'First: =LEFT(A2, FIND(" ", A2) - 1)\nLast:  =MID(A2, FIND(" ", A2) + 1, 100)', steps:['FIND locates the space, at position 5 for Asha Rao.','LEFT takes the 4 characters before it.','MID takes everything after it (100 is just a number larger than any remaining text).'], result:'Names of any length are split correctly. Wrap with TRIM and IFERROR for messy data.' }
  ],
  edge:[
    { t:'#VALUE! when not found', d:'A name with no space, such as "Madonna", gives `#VALUE!`. Wrap: `=IFERROR(LEFT(A2, FIND(" ", A2)-1), A2)`.' },
    { t:'Only the first match', d:'FIND returns the position of the first occurrence. For the last space, use a trick with SUBSTITUTE, or TEXTAFTER in Microsoft 365.' },
    { t:'Case sensitivity', d:'FIND is case sensitive and has no wildcards. SEARCH is not and allows `*` and `?`.' },
    { t:'start_num argument', d:'`FIND(" ", A2, 6)` starts searching from position 6, which finds the second space.' },
    { t:'Newer functions', d:'In Microsoft 365, `TEXTBEFORE`, `TEXTAFTER` and `TEXTSPLIT` do these jobs more simply. FIND is still necessary for older versions.' }
  ],
  tiers:[
    { base:true, level:'Easy' },
    { level:'Medium', q:'Extract the domain (the part after the @) from an email in A2.', hint:'MID starting just after the @.', solution:'=MID(A2, FIND("@", A2) + 1, 100)', explain:'For asha.rao@example.com the result is example.com.' },
    { level:'Interview', q:'Extract the middle part of the code INV-2026-0045 (the year), when the prefix length can vary.', hint:'Find both hyphens.', solution:'=MID(A2, FIND("-", A2) + 1, FIND("-", A2, FIND("-", A2) + 1) - FIND("-", A2) - 1)', explain:'The first FIND gives the first hyphen, the nested FIND (using start_num) gives the second. The length is the distance between them minus 1. The result is 2026.' }
  ],
  interviewPlus:[
    { level:'Basic', q:'What does FIND do and how is it different from SEARCH?', a:'FIND returns the position of text inside another text and is case sensitive. SEARCH does the same but ignores case and allows wildcards.',
      follow:[ { q:'What does it return if the text is missing?', a:'#VALUE!. I wrap it in IFERROR or test with ISNUMBER(FIND(...)).' } ] },
    { level:'Intermediate', q:'How do you split a full name into first and last names?', a:'First: =LEFT(A2, FIND(" ", A2) - 1). Last: =MID(A2, FIND(" ", A2) + 1, 100). FIND locates the space so the lengths can vary.',
      tradeoff:'Text to Columns or Flash Fill are faster for a one-off, but formulas update when the data changes.' },
    { level:'Scenario', q:'Some names have middle names. How do you get the last word?', a:'Replace spaces with many spaces, take the right part and trim, or in Microsoft 365 use TEXTAFTER(A2, " ", -1). The old trick is =TRIM(RIGHT(SUBSTITUTE(A2, " ", REPT(" ", 100)), 100)).' }
  ],
  ref:{ headers:['Goal','Formula'], rows:[['Position of a character','`FIND(char, text)`'],['Text before it','`LEFT(text, FIND(char, text) - 1)`'],['Text after it','`MID(text, FIND(char, text) + 1, 100)`'],['Ignore case','`SEARCH`'],['Exists?','`ISNUMBER(FIND(...))`']] },
  related:['left','mid','right','trim','substitute']
};

/* --- text --- */
D('text',{ l:'Intermediate', t:'TEXT converts a number or date to text using a format code. Use it when joining numbers and dates into sentences.',
  i:['Join a date to a sentence with & and you see a serial number such as 46249. TEXT formats the date first, so the sentence reads naturally.','The format codes are the same ones you use in Format Cells, written as a string.'], a:'A translator that turns a number into the form people expect to read.',
  h:['Write `=TEXT(value, "format")`.','Date codes: dd, mmm, mmmm, yyyy. Number codes: 0, 0.00, #,##0, 0%.','The result is text, so keep the original for calculations.','Join it with & to build messages.'],
  d:[FL(['TEXT(date, "dd-mmm-yyyy")'],[{ title:'46249', text:'serial number' },{ title:'Result', text:'**15-Aug-2026**' }])],
  x:[X('Variation','Percent and decimals','Show 0.18 as 18% and 1234.5 with two decimals.','Use format codes.','=TEXT(0.18, "0%")  -> 18%\n=TEXT(1234.5, "#,##0.00") -> 1,234.50',['The code controls the appearance of the number.'],'The results are text.'),
     X('Business case','A dynamic report title','The title should read "Sales for August 2026".','Join text and a formatted date.','="Sales for " & TEXT(A1, "mmmm yyyy")',['TEXT turns the date into the month name and year.'],'Changing the date in A1 updates the title.')],
  e:[['Result is text','You cannot add it. Keep the original value.'],['Locale','Format codes depend on language settings, such as dd/mm vs jj.'],['Wrong code','An invalid code returns an unexpected result or #VALUE!.'],['Leading zeros','`TEXT(5, "000")` gives 005, useful for ids.']],
  p:[P('Medium','Show a date as 15-Aug-2026 inside a message.','dd-mmm-yyyy.','="Due on " & TEXT(A2, "dd-mmm-yyyy")','Without TEXT the date would appear as a number.'),
     P('Interview','Pad ids to five digits with leading zeros.','Use a format with zeros.','=TEXT(A2, "00000")','47 becomes 00047.')],
  q:[Q('Basic','What does TEXT do?','It converts a value to text using a format code.',{ f:[['Why use it with dates?','To avoid seeing the serial number when joining text.']] }),
     Q('Scenario','Build a month label for a report from a date.','=TEXT(A2, "mmm yyyy"). For sorting, keep a real date or a yyyy-mm key.',{ t:'Text months sort alphabetically.' })],
  r:RT(['Code','Example'],[['`"dd-mmm-yyyy"`','15-Aug-2026'],['`"mmmm"`','August'],['`"0.00"`','1234.50'],['`"0%"`','18%'],['`"000"`','005']]), rel:['concat','date','month','round'] });
})();
