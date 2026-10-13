/* Datapath | Python and Pandas
 * Python manifest, core lessons and extended lesson content. Kept in this already-loaded
 * course file so the Python course can be completed without changing the shared app shell.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { T, X, P, Q, D, FL, RT } = DP.builders;
  const DEEP = DP.deep;

  const TOPICS = [
    { title:'Python foundations', lessons:[
      L('py-intro','What is Python?','Use a readable general-purpose language to automate analysis.','Python is a programming language used to load, transform, analyze and communicate data.','It turns repeatable analysis steps into code that can be rerun on new files.','print("Hello, analyst!")','print("Hello, analyst!")','Hello, analyst!','Display the message Hello, analyst!','print("Hello, analyst!")','print displays a value in the output.','Write a statement that displays the number 42.','Use print with the value inside parentheses.','Run a small example and inspect its output before scaling it to a full dataset.','Expect Python to infer every business meaning without clear variable names.'),
      L('py-variables','Variables and assignment','Give values clear names so analysis steps are easy to follow.','A variable is a name bound to a value; assignment with = stores or rebinds that value.','Named values make calculations readable and let later steps reuse results.','revenue = 12500\ncost = 8200\nprofit = revenue - cost','profit = 4300','revenue = 12500','Store revenue and cost, then calculate profit.','revenue = 12500\ncost = 8200\nprofit = revenue - cost','The assignment statements bind the names to numbers; subtraction creates profit.','Create a variable named units with the value 18.','Use one assignment statement and a descriptive name.','Use descriptive names and reassign only when the meaning stays clear.','Using = as if it tests equality; comparisons use ==.',['py-intro']),
      L('py-types','Numbers, strings and booleans','Choose and check the right kind of value before calculating.','Python values have types, including int, float, str and bool.','Type-aware operations prevent invalid calculations and make cleaned data trustworthy.','type(value)\nint("12")\nfloat("3.5")\nstr(12)','type(12) is int','amount = 19.5','Check a value type and convert a numeric string to an integer.','type(value)\nint("12")','type returns a value type; int converts valid digit text to an integer.','Convert the text "202" to an integer.','Use the int conversion function.','Check source values before conversion and retain identifiers as text when arithmetic is not intended.','Converting arbitrary dirty text with int or float without validating it.',['py-variables']),
      L('py-operators','Arithmetic, comparison and logical operators','Combine values and conditions to answer analytical questions.','Arithmetic operators calculate; comparison operators return booleans; and/or/not combine conditions.','They express metrics and filters directly and reproducibly.','revenue - cost\nsales > 1000\n(region == "West") and (sales > 1000)','True','sales = 1250\nCheck whether sales exceed 1000.','sales > 1000','The comparison returns True because 1250 is greater than 1000.','Check whether 8 is between 5 and 10 inclusive.','Combine >= and <= with and.','Use parentheses around compound conditions so the business rule is explicit.','Using and when comparing a Pandas Series; use element-wise & there.',['py-types']),
      L('py-strings','Working with strings','Clean, inspect and format text without changing its meaning.','A string is immutable text; methods such as strip, lower, replace and split return new strings.','Names, categories and imported identifiers often need consistent text handling.','"  NORTH ".strip().lower()','north','"  NORTH ".strip().lower()','Remove outside whitespace and normalize the word NORTH.','"  NORTH ".strip().lower()','strip removes outside spaces and lower changes letter case.','Make "Data Analyst" lowercase.','Call the lower string method.','Normalize text consistently before comparing or grouping it.','Expect strip to remove spaces from the middle of text.',['py-types']),
      L('py-lists','Lists and indexing','Store ordered values and retrieve items by position.','A list is an ordered, mutable collection; indexes start at zero and slices exclude the stop index.','Lists hold rows, column labels and intermediate results in everyday analysis code.','values = [12, 18, 25]\nvalues[0]\nvalues[1:3]','values[0] is 12','values = [12, 18, 25]','Read the first value and the last two values.','values[0]\nvalues[1:3]','The first element is at index 0; the slice includes indexes 1 and 2.','Get the final item from a list named months.','Use a negative index.','Check list length and boundaries before indexing external data.','Assuming the first item has index 1.',['py-variables']),
      L('py-tuples','Tuples and unpacking','Keep fixed records together and unpack related values clearly.','A tuple is an ordered, immutable collection; unpacking assigns its elements to names.','Fixed pairs and returned values can be represented without accidental in-place edits.','month, sales = ("Jan", 1200)','month is "Jan"','record = ("Jan", 1200)','Unpack a month and its sales from one tuple.','month, sales = ("Jan", 1200)','Unpacking matches each tuple position to the corresponding variable.','Create variables day and total from (3, 450).','Unpack the two tuple elements in order.','Use a tuple for a fixed record and a list when the collection must change.','Unpacking a tuple into a different number of names than it contains.',['py-lists']),
      L('py-dictionaries','Dictionaries and keys','Represent labelled values and look them up by meaningful keys.','A dictionary maps unique keys to values, for example a column name to a metric.','Named access is clearer and safer than relying on a position for structured records.','row = {"region": "West", "sales": 1250}\nrow["sales"]','1250','row = {"region": "West", "sales": 1250}','Retrieve the sales value using its key.','row["sales"]','The key "sales" identifies the value 1250.','Retrieve "region" from a dictionary named row.','Use square brackets with the key.','Check whether a key exists or use get when a field may be absent.','Assuming every dictionary contains a requested key.',['py-lists']),
      L('py-dictionary-iteration','Loop through dictionary keys and values','Read, update and safely check labelled values in a dictionary.','Use items() to visit key-value pairs, get() for an optional key, and assignment to add or update a value.','Dictionary operations help process settings, grouped summaries and records with named fields.','sales_by_region = {"North": 2700, "South": 13300}\nfor region, total in sales_by_region.items():\n    print(region, total)\nsales_by_region["West"] = 10000','Each key and its matching total can be used in the loop','sales_by_region = {"North": 2700, "South": 13300}','Print every region and total, then safely look up a region that may be missing.','for region, total in sales_by_region.items():\n    print(region, total)\nprint(sales_by_region.get("West", 0))','items() gives the key and value together. get() returns 0 when West is not a key.','Add the key "East" with total 400 to sales_by_region.','Assign 400 to sales_by_region["East"].','Use .get when a key may not exist and check before changing a dictionary during iteration.','Using row["missing_key"] when a key may be absent.',['py-dictionaries']),
      L('py-sets','Sets and unique values','Keep unique items and compare groups without counting repeats.','A set stores distinct values and supports membership, union, intersection and difference.','Sets help find unique categories, shared IDs and values present in only one group.','regions = {"North", "South", "North"}\nprint(len(regions))\nprint("West" in regions)','2\nFalse','regions = {"North", "South", "North"}','Count unique regions and check whether West is in the set.','len(regions)\n"West" in regions','Repeated values appear once in a set; in checks membership and returns True or False.','Find values shared by sets A and B.','Use A & B for their intersection.','Sets do not keep a reliable display order; use a list when order or positional access matters.','Expecting a set to keep duplicates or items in a fixed order.',['py-dictionaries'])
    ]},
    { title:'Control flow and reusable code', lessons:[
      L('py-conditionals','if, elif and else','Choose an action based on an explicit business rule.','Conditional statements run a block only when a boolean condition is true.','They encode rules such as flagging low stock or assigning a performance band.','if sales >= 1000:\n    status = "Target met"\nelse:\n    status = "Below target"','status = "Target met"','sales = 1250','Set status to Target met when sales are at least 1000.','if sales >= 1000:\n    status = "Target met"\nelse:\n    status = "Below target"','The condition selects exactly one branch.','Set status to "High" when score is at least 80; otherwise set it to "Review".','Write an if/else and indent each branch.','Test boundary values as well as typical values.','Using = instead of == in a condition.',['py-operators']),
      L('py-loops','for loops','Repeat a clear operation for every item in a collection.','A for loop assigns each iterable item to a loop variable and runs an indented block.','Loops automate repetitive checks and transformations over records or values.','for region in regions:\n    print(region)','Each region is printed once','regions = ["North", "South"]','Print every item in the regions list.','for region in regions:\n    print(region)','The loop visits items in order and runs its body once per item.','Add the numbers in values using a loop.','Start total at 0, then add each value.','Use a descriptive loop variable and keep the loop body focused.','Changing the collection while iterating over it unexpectedly.',['py-conditionals']),
      L('py-while-loops','while loops','Repeat a step while a condition remains true, and stop when it becomes false.','A while loop checks a condition before each repetition. If it is True, Python runs the indented body and checks again.','Use while when the number of repetitions depends on a condition, such as processing items until a limit is reached.','while condition:\n    repeated_steps','The body repeats while condition is True','sales = [120, 80, 150]\nindex = 0\nwhile index < len(sales):\n    print(sales[index])\n    index += 1','Process each sales value once using a while loop.','sales = [120, 80, 150]\nindex = 0\nwhile index < len(sales):\n    print(sales[index])\n    index += 1','index starts at 0. The condition checks that an item remains. After printing, index += 1 moves to the next item; when index reaches 3, the condition is False and the loop stops.','Use a while loop to add all values in a list named sales.','Start index and total at 0. While index is less than len(sales), add sales[index] to total and increase index by 1.','Make sure something in the loop body moves the condition toward False.','Forgetting to update the loop variable can create an infinite loop that never ends.',['py-loops']),
      L('py-range','range and numeric iteration','Generate a predictable sequence of integers for counted work.','range(stop) produces integers from zero up to, but not including, stop.','It is useful for repeat counts and indexed traversal when positions matter.','list(range(1, 5))','[1, 2, 3, 4]','range(1, 5)','Create the integers 1 through 4.','list(range(1, 5))','The stop value 5 is excluded from the generated sequence.','Generate even numbers 2, 4, 6, 8 with range.','Use start, stop and step.','Remember the stop boundary is exclusive.','Expect range(1, 5) to include 5.',['py-loops']),
      L('py-comprehensions','List comprehensions','Build a transformed or filtered list in one readable expression.','A list comprehension evaluates an expression for each item and may include a condition.','They make short, transparent transformations concise.','[x * 2 for x in values if x > 0]','[4, 6]','[x * 2 for x in values if x > 0]','Double each positive value in values.','[x * 2 for x in values if x > 0]','The if clause filters values before the expression is added to the new list.','Create a list of uppercase names from names.','Call upper for each name in a comprehension.','Prefer a regular loop when a comprehension becomes difficult to read.','Packing multiple side effects into a comprehension.',['py-loops']),
      L('py-functions','Functions and return values','Package a repeatable calculation behind a clear interface.','A function is defined with def, accepts parameters and can return a result.','Functions reduce copy-paste errors and make analysis steps testable.','def margin(revenue, cost):\n    return (revenue - cost) / revenue','margin(100, 60) returns 0.4','def margin(revenue, cost):\n    return (revenue - cost) / revenue','Write a function that returns revenue minus cost.','def profit(revenue, cost):\n    return revenue - cost','return sends the calculated result back to the caller.','Define a function named double that returns its input times two.','Use def, a parameter, and return.','Give functions one clear responsibility and return results instead of only printing them.','Printing a value when the caller needs a reusable result.',['py-conditionals']),
      L('py-parameters','Function parameters and defaults','Pass required and optional values into reusable analysis logic.','Parameters receive arguments; a default value makes an argument optional.','A single function can handle multiple datasets and documented options.','def rate(part, total=1):\n    return part / total','rate(25, 100) returns 0.25','def rate(part, total=1):\n    return part / total','Call rate with part 25 and total 100.','rate(25, 100)','Arguments are bound to parameters by position here.','Define greet with a name parameter and default "Analyst".','Put the default value in the function definition.','Use keyword arguments when they make a call easier to understand.','Putting a required parameter after a default parameter.',['py-functions']),
      L('py-modules','Importing modules','Reuse tested functionality from Python and installed libraries.','A module is importable Python code; import binds it to a name in the current file.','Libraries provide reliable tools for dates, statistics and data analysis.','import math\nmath.sqrt(25)','5.0','import math\nmath.sqrt(25)','Use the math module to calculate the square root of 25.','math.sqrt(25)','Importing math makes its sqrt function available through the module name.','Import datetime as dt.','Use the import ... as ... form.','Import only the libraries needed and use conventional aliases such as pd and np.','Assuming a package is available without installing or importing it.',['py-functions']),
      L('py-exceptions','Errors and defensive checks','Handle expected bad inputs explicitly and make failures understandable.','Exceptions report runtime failures; try/except handles specific expected error types.','Source files can contain missing or malformed values, so failures should be visible and actionable.','try:\n    quantity = int(raw_value)\nexcept ValueError:\n    quantity = None','Invalid numeric text is represented as None','try:\n    quantity = int(raw_value)\nexcept ValueError:\n    quantity = None','Convert raw_value to an integer, handling non-numeric text.','try:\n    quantity = int(raw_value)\nexcept ValueError:\n    quantity = None','Only ValueError from an invalid integer conversion is handled.','Handle division by zero with a clear message.','Catch ZeroDivisionError around the division.','Catch the narrow exception you expect and report invalid records for review.','Catching every exception and silently returning a normal-looking result.',['py-types'])
    ]},
    { title:'Object-oriented Python', lessons:[
      L('py-oop-classes','Classes and objects','Understand a class as a plan and an object as one usable instance.','A class defines a kind of object; each object is an instance made from that class.','A class describes a kind of thing, such as a dog; each individual dog is a separate object made from that class.','class Dog:\n    pass\n\nfirst_dog = Dog()\nsecond_dog = Dog()','first_dog and second_dog are separate Dog objects','class Dog:\n    pass\n\nfirst_dog = Dog()','Create a class named Dog and make one object from it.','class Dog:\n    pass\n\ndog = Dog()','The class describes the kind of thing; Dog() creates one object from it.','Create two separate objects from a class named Cat.','Write Cat() twice and store each result under a different name.','Use a class when your program needs to represent several things of the same kind.','Calling a class blueprint itself an object instance.',['py-functions']),
      L('py-oop-attributes-methods','Attributes, methods, self and __init__','Give each object its own data and actions, and understand how it is created.','__init__ sets starting attributes when an object is made; self refers to the particular object; methods are functions defined in a class.','Each dog can store its own name and use the same speak method to make a personalized response.','class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} says Woof"\n\ndog = Dog("Rex")\nprint(dog.speak())','Rex says Woof','class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} says Woof"\n\ndog = Dog("Rex")\nprint(dog.speak())','Make a Dog named Rex and display its spoken message.','dog = Dog("Rex")\nprint(dog.speak())','__init__ stores the name on this dog. self.name belongs to this object, and speak() uses it to return "Rex says Woof".','Make a Dog named Bella and display its spoken message.','Call Dog("Bella") and then call speak() on the new object.','Keep each object’s information on self and let its methods use that information.','Forgetting self in a method definition or confusing a class method with a call on an object.',['py-oop-classes']),
      L('py-oop-principles','The four main ideas in object-oriented programming','Understand encapsulation, abstraction, inheritance and polymorphism through everyday examples.','Encapsulation keeps related data and actions together; abstraction gives a simple way to use them; inheritance reuses a parent class; polymorphism lets different objects answer the same method call in their own way.','These ideas help organize programs that model things such as bank accounts, coffee machines, vehicles and animals. Each idea solves a different design problem.','class Animal:\n    def speak(self):\n        return "Some sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow"\n\nfor animal in [Dog(), Cat()]:\n    print(animal.speak())','Woof\nMeow','class Animal:\n    def speak(self):\n        return "Some sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow"\n\nfor animal in [Dog(), Cat()]:\n    print(animal.speak())','Use one shared Animal type and give Dog and Cat their own speak() behavior.','Dog and Cat inherit from Animal, then override speak() with their own response.','Inheritance lets a child reuse or replace behavior from a parent.','Add a Bird class that inherits from Animal and returns "Tweet" from speak().','Define class Bird(Animal) and give it a speak() method that returns "Tweet".','Use inheritance when a child truly is a kind of parent. Python uses naming conventions, not strict private fields, for everyday encapsulation.','Thinking all four ideas mean the same thing, or using inheritance only to avoid writing a few lines twice.',['py-oop-attributes-methods'])
    ]},
    { title:'NumPy fundamentals', lessons:[
      L('numpy-intro','NumPy for numerical analysis','Use efficient arrays for numerical work at scale.','NumPy provides homogeneous n-dimensional arrays and vectorized numerical operations.','It reduces Python-level looping for large numerical datasets and underpins much of the data stack.','import numpy as np\nvalues = np.array([10, 20, 30])','values is a NumPy array','import numpy as np\nvalues = np.array([10, 20, 30])','Create a NumPy array containing 10, 20 and 30.','np.array([10, 20, 30])','array converts a Python sequence to a NumPy array.','Import NumPy using the conventional alias np.','Use import numpy as np.','Inspect dtype and shape when data arrives from another source.','Assuming NumPy arrays behave exactly like Python lists.',['py-modules']),
      L('numpy-arrays','Creating NumPy arrays','Choose array constructors that match the shape and values you need.','NumPy arrays can be created from sequences or helpers such as zeros, ones and arange.','Explicit, predictable array construction helps prepare numeric features and test calculations.','np.array([2, 4, 6])\nnp.zeros(3)\nnp.arange(1, 4)','[1, 2, 3] from arange','np.arange(1, 4)','Create the integers 1, 2 and 3 as an array.','np.arange(1, 4)','arange includes the start and excludes the stop.','Create a 2-by-2 array of zeros.','Pass the shape tuple (2, 2) to np.zeros.','Use integer or float dtype intentionally when precision or storage matters.','Confusing arange stop behavior with an inclusive endpoint.',['numpy-intro']),
      L('numpy-shapes','Array shape and dimensions','Check how many rows and columns an array contains.','An array shape is a tuple of its dimensions; ndim gives the number of axes.','Shape checks catch mismatched inputs before calculations or model preparation.','matrix.shape\nmatrix.ndim\nmatrix.size','shape is (2, 3) for two rows and three columns','matrix = np.array([[1, 2, 3], [4, 5, 6]])','Check the shape and number of dimensions in a 2-by-3 array.','matrix.shape\nmatrix.ndim','The array has shape (2, 3) and two dimensions.','What shape has 4 rows and 2 columns?','Write the tuple in row, column order.','Check dimensions before combining arrays.','Reading a shape tuple as (columns, rows).',['numpy-arrays']),
      L('numpy-indexing','NumPy indexing and slicing','Select array elements and subarrays with explicit positions.','NumPy uses zero-based indexing and supports slices; a comma separates axes in multidimensional arrays.','Selecting the intended rows and columns is a basic step in analysis and feature preparation.','matrix[0, 1]\nmatrix[:, 0]','2 and the first column','matrix = np.array([[1, 2], [3, 4]])','Select the first row, second column value.','matrix[0, 1]','Both row and column indexes start at zero.','Select all rows from column 1 of matrix.','Use a colon for all rows and an index for the column.','Name row and column intent when slicing multidimensional arrays.','Using chained indexing when a single multi-axis index is clearer.',['numpy-shapes']),
      L('numpy-vectorization','Vectorized operations','Apply numerical operations to whole arrays without writing a Python loop.','Vectorization applies array operations element-wise using optimized NumPy routines.','It improves clarity and speed for repeated numeric calculations.','prices = np.array([10, 20, 30])\nprices * 1.1','[11.0, 22.0, 33.0]','prices * 1.1','Increase every price by 10 percent.','prices * 1.1','The scalar is applied to each element in the array.','Subtract 5 from every value in an array named scores.','Use an array operation rather than a loop.','Prefer vectorized operations for numeric arrays and verify units after scaling.','Using Python and on arrays instead of an element-wise NumPy operator.',['numpy-indexing']),
      L('numpy-aggregation','NumPy totals and summary statistics','Summarize numeric arrays with explicit aggregation functions.','NumPy functions such as sum, mean, min and max reduce values to summaries.','They provide fast measures for checking and comparing numeric data.','np.mean(values)\nnp.sum(values)\nnp.max(values)','mean of [10, 20, 30] is 20.0','values = np.array([10, 20, 30])','Calculate the mean of values.','np.mean(values)','The three values sum to 60, and 60 divided by 3 is 20.','Find the minimum of [8, 3, 11].','Use np.min or the array min method.','Specify an axis when summarizing a two-dimensional array.','Assuming a row-wise result when the default aggregates every value.',['numpy-vectorization']),
      L('numpy-broadcasting','Broadcasting arrays','Combine compatible shapes without manually repeating values.','Broadcasting aligns array dimensions from the right and permits equal sizes or dimensions of size one.','It supports clean column-wise calculations while avoiding copied data.','matrix + offset\n# matrix shape (2, 3), offset shape (3,)','Each row receives the three offsets','matrix = np.array([[1, 2, 3], [4, 5, 6]])\noffset = np.array([10, 20, 30])','Add the three offsets to each row.','matrix + offset','The one-dimensional array aligns with the matrix columns.','For a matrix of shape (4, 3), what length offset adds by column?','Use a one-dimensional array of length 3.','Check shapes from the last dimension when debugging a broadcast error.','Assuming any two different array shapes can be combined.',['numpy-shapes','numpy-vectorization'])
    ]},
    { title:'Pandas: load and inspect data', lessons:[
      L('pandas-intro','Pandas for tabular analysis','Work with labelled tables using Series and DataFrames.','Pandas is a Python library for labelled tabular data, built around Series and DataFrame objects.','It provides convenient file input, cleaning, grouping and joining for analyst workflows.','import pandas as pd\ndf = pd.DataFrame({"sales": [120, 180]})','df is a DataFrame','import pandas as pd\ndf = pd.DataFrame({"sales": [120, 180]})','Create a DataFrame with one sales column.','pd.DataFrame({"sales": [120, 180]})','The dictionary key becomes a column and the list supplies its values.','Import pandas as pd.','Use the conventional pd alias.','Check the table shape and column names immediately after loading data.','Treating a DataFrame as a plain nested list.',['py-modules']),
      L('pandas-series-dataframe','Series and DataFrames','Distinguish one labelled column from a two-dimensional table.','A Series is a labelled one-dimensional array; a DataFrame aligns one or more Series by index.','Understanding these objects makes selections and calculations predictable.','df["sales"]\ntype(df["sales"])','A single column selection is a Series','df = pd.DataFrame({"sales": [120, 180]})','Select the sales column as a Series.','df["sales"]','Selecting one column by label returns a Series.','Create a DataFrame from two equal-length columns.','Pass a dictionary of column names to lists.','Keep labels attached to values and check index alignment when combining Series.','Assuming row positions alone determine alignment after index changes.',['pandas-intro']),
      L('pandas-read-files','Read CSV and Excel files','Load external tables while checking paths and parsing options.','Pandas read_csv and read_excel read files into DataFrames.','Direct loading makes recurring work reproducible and avoids manual copy-paste.','df = pd.read_csv("sales.csv")\ndf = pd.read_excel("sales.xlsx", sheet_name="Orders")','df contains the loaded rows and columns','pd.read_csv("sales.csv")','Read sales.csv into a DataFrame named df.','df = pd.read_csv("sales.csv")','read_csv parses the header and records into labelled columns.','Read a CSV with a date column parsed as dates.','Use parse_dates with the date column name.','Confirm file path, delimiter, encoding and expected row count after loading.','Assuming a successful read means every column was parsed correctly.',['pandas-intro']),
      L('pandas-export-files','Save results to CSV and Excel','Write a finished DataFrame to a file that others can use.','to_csv writes a DataFrame to a CSV file; to_excel writes it to an Excel workbook.','Exporting lets you share clean results without copying and pasting rows by hand.','df.to_csv("cleaned_sales.csv", index=False)\ndf.to_excel("sales_summary.xlsx", sheet_name="Summary", index=False)','The files contain the DataFrame rows and column names, without an extra index column.','df.to_csv("cleaned_sales.csv", index=False)','Save df as cleaned_sales.csv without writing the row index as an extra column.','df.to_csv("cleaned_sales.csv", index=False)','index=False leaves out Pandas row labels, which usually are not part of the data table.','Save a summary DataFrame as an Excel sheet named Summary.','Use to_excel with sheet_name="Summary" and index=False.','Check the output path, row count and column names after saving; Excel export may need the openpyxl package.','Exporting the index unintentionally or overwriting the wrong output file.',['pandas-read-files']),
      L('pandas-inspect','Inspect a DataFrame','Use dimensions, samples, types and summaries before transforming data.','head, info, describe, shape and columns reveal different aspects of a DataFrame.','Initial inspection finds wrong types, unexpected missingness and suspicious ranges early.','df.head()\ndf.info()\ndf.describe(include="all")','head shows the first five rows by default','df.head()','Preview the first five rows of df.','df.head()','head returns a small preview without printing the full dataset.','Check row and column counts for df.','Read the shape attribute.','Pair a row sample with dtype and missing-value checks.','Using describe alone to validate every categorical and numeric column.',['pandas-read-files']),
      L('pandas-select-filter','Select columns and filter rows','Use labels and boolean masks to keep only relevant observations.','Column labels select variables; a boolean mask selects rows matching a condition.','Focused subsets simplify analysis and reduce accidental use of irrelevant records.','df[["region", "sales"]]\ndf[df["sales"] > 1000]','Rows with sales above 1000 remain','df[df["sales"] > 1000]','Keep rows whose sales exceed 1000.','df[df["sales"] > 1000]','The boolean mask is True for rows meeting the threshold.','Keep rows where region is West and sales exceed 1000.','Combine masks with & and wrap each comparison in parentheses.','Check filter row counts and use explicit parentheses for compound conditions.','Using Python and/or with Pandas boolean Series.',['pandas-inspect']),
      L('pandas-loc-iloc','Label and position selection with loc and iloc','Select precise rows and columns without ambiguity.','loc selects by index and column labels; iloc selects by integer positions.','Explicit row/column selection makes transformations easier to review.','df.loc[0, "sales"]\ndf.iloc[0, 4]','Both select the first order’s sales value, 1,200.','df.loc[df["region"] == "West", ["region", "sales"]]','Select region and sales for West rows using labels.','df.loc[df["region"] == "West", ["region", "sales"]]','loc accepts a boolean row mask and named columns.','Select rows at positions 0 and 1, and column at position 1, with iloc.','Use integer slices; iloc stop boundaries are excluded.','Use loc for business labels and iloc only when positional intent is clear.','Assuming loc slices and iloc slices have identical stop behavior.',['pandas-select-filter']),
      L('pandas-missing-values','Find and handle missing values','Measure missingness before choosing a defensible treatment.','isna detects missing values; dropna removes rows or columns; fillna replaces missing values.','Missing data can change denominators, trends and model inputs.','df.isna().sum()\ndf["sales"] = df["sales"].fillna(df["sales"].median())','Missing counts are reported; missing sales are filled with the median only when that treatment is justified.','df.isna().sum()','Count missing values in each column.','df.isna().sum()','isna creates a boolean table and sum counts missing cells by column.','Replace missing sales with the median sales value.','Calculate the median and pass it to fillna.','Record why values are missing and compare results before and after treatment.','Filling every missing value with zero without checking what missing means.',['pandas-inspect']),
      L('pandas-duplicates','Detect and remove duplicate rows','Identify repeated records before removing them by a documented rule.','duplicated flags repeated rows; drop_duplicates retains one copy by default.','Duplicates can inflate counts, revenue and customer totals.','df.duplicated().sum()\ndf = df.drop_duplicates()','Repeated rows are counted, then exact duplicates are removed','df.duplicated().sum()','Count fully duplicated rows in df.','df.duplicated().sum()','duplicated returns a boolean flag for rows repeated earlier.','Remove duplicates using order_id as the key.','Pass subset=["order_id"] to drop_duplicates.','Define the business key and sort or prioritize records before deduplication.','Removing rows based on all columns when the true duplicate key is only one identifier.',['pandas-inspect'])
    ]},
    { title:'Pandas: transform and combine', lessons:[
      L('pandas-dtypes','Inspect and convert column data types','Convert imported columns deliberately so sorting and calculations are correct.','Pandas dtypes describe each column; astype and to_numeric perform controlled conversion.','CSV imports may treat numeric values as text, producing incorrect sorting and summaries.','df["sales"] = pd.to_numeric(df["sales"], errors="coerce")','Invalid numeric text becomes missing with coerce','pd.to_numeric(df["sales"], errors="coerce")','Convert sales to numeric values and mark invalid strings as missing.','df["sales"] = pd.to_numeric(df["sales"], errors="coerce")','coerce makes invalid conversions visible as missing values instead of stopping.','Convert an ID column to string without treating it as a measurement.','Use astype("string") for identifiers.','Review coercion-created missing values and keep identifiers out of arithmetic.','Converting identifiers to numbers and losing leading zeros.',['pandas-inspect']),
      L('pandas-create-columns','Create and transform columns','Derive transparent metrics from existing DataFrame columns.','Assigning a Series or expression to df["new_column"] creates or replaces that column.','Derived measures such as margin and order value support consistent reporting.','df["profit"] = df["sales"] - df["cost"]','profit contains row-wise sales minus cost','df["profit"] = df["sales"] - df["cost"]','Create a profit column from sales and cost.','df["profit"] = df["sales"] - df["cost"]','Pandas subtracts the cost from the sales value in each row.','Create margin as profit divided by sales.','Divide the profit Series by the sales Series.','Handle zero denominators and name units in derived metrics.','Dividing by zero or mixing currency units without checking.',['pandas-select-filter']),
      L('pandas-string-methods','Clean text with Pandas string methods','Normalize text columns consistently across all rows.','The .str accessor applies string operations such as strip, lower, contains and replace to a Series.','Standardized labels prevent duplicate categories caused by whitespace or case differences.','df["region"] = df["region"].str.strip().str.title()','" west " becomes "West"','df["region"].str.strip().str.title()','Trim whitespace and title-case each region value.','df["region"] = df["region"].str.strip().str.title()','The chained .str methods operate on every string in the Series.','Find names containing "an" without case sensitivity.','Use .str.contains("an", case=False, na=False).','Inspect distinct values before and after normalization.','Calling a plain Python string method directly on an entire Series.',['pandas-dtypes']),
      L('pandas-regex','Find and extract text with regular expressions','Use text patterns to check, find or pull out parts of values.','A regular expression is a text pattern; Pandas string methods can test a pattern or extract matching parts.','Patterns help check IDs and pull structured details from messy text.','codes = pd.Series(["ORD-104", "bad"])\ncodes.str.contains(r"^ORD-\\d{3}$", na=False)','0     True\n1    False','codes = pd.Series(["ORD-104", "bad"])','Check which values have ORD- followed by exactly three digits.','codes.str.contains(r"^ORD-\\d{3}$", na=False)','^ means start, \\d means a digit, {3} means exactly three, and $ means end. na=False treats missing values as not matching.','Extract the digits from a Series named codes.','Use .str.extract with the pattern r"(\\d+)".','Test the pattern on valid, invalid and missing examples before changing or removing data.','Using a pattern without checking whether it accepts invalid values.',['pandas-string-methods']),
      L('pandas-datetime','Parse dates and use datetime properties','Convert date text to datetimes for reliable time-based analysis.','to_datetime parses date values; the .dt accessor exposes year, month and other components.','Correct date types enable sorting, period grouping and elapsed-time calculations.','df["date"] = pd.to_datetime(df["date"])\ndf["month"] = df["date"].dt.to_period("M")','A parsed date can be grouped by month','pd.to_datetime(df["date"])','Parse the date column and extract its year.','df["date"] = pd.to_datetime(df["date"])\ndf["year"] = df["date"].dt.year','The datetime conversion enables the .dt.year property.','Parse dates while marking invalid values as missing.','Pass errors="coerce" to to_datetime.','Specify day-first or format when source date strings are ambiguous.','Extracting a month from strings before parsing them as dates.',['pandas-dtypes']),
      L('pandas-time-series','Group dates into time periods and rolling summaries','Summarize values by month and compare nearby periods.','A time series is data ordered by date; resample groups dated rows into time periods, and rolling calculates a moving summary.','Monthly and rolling summaries reveal changes over time without comparing unrelated individual rows.','df["date"] = pd.to_datetime(df["date"])\nmonthly_sales = df.set_index("date")["sales"].resample("MS").sum()\nprint(monthly_sales)','Jan 2026: 2,000\nFeb 2026: 11,500\nMar 2026: 12,500','df["date"] = pd.to_datetime(df["date"])\nmonthly_sales = df.set_index("date")["sales"].resample("MS").sum()','Add sales by month, with each month labelled at its start date.','monthly_sales = df.set_index("date")["sales"].resample("MS").sum()','resample needs a date index. "MS" makes month-start groups and sum adds the sales in each month.','Calculate a two-month rolling mean from monthly_sales.','Use monthly_sales.rolling(2).mean().','Sort by date, choose the right period and aggregation, and remember a rolling result needs enough earlier periods.','Resampling before converting to dates or using the wrong aggregation for the question.',['pandas-datetime','pandas-groupby']),
      L('pandas-sort','Sort rows for review and reporting','Order data by one or more columns without changing its values.','sort_values orders rows by selected columns; ascending controls direction.','Sorting makes extremes, latest records and rankings easier to inspect.','df.sort_values("sales", ascending=False)','Highest sales appear first','df.sort_values("sales", ascending=False)','Sort rows from highest sales to lowest sales.','df.sort_values("sales", ascending=False)','ascending=False requests descending order.','Sort by region ascending, then sales descending.','Pass a list of columns and a matching ascending list.','Use a stable, explicit tie-breaker when the ranking must be reproducible.','Assuming sort_values modifies the original DataFrame by default.',['pandas-select-filter']),
      L('pandas-groupby','Summarize groups with groupby','Calculate totals and other metrics separately for each category.','groupby splits rows into groups; aggregations reduce each group to summaries.','Grouped metrics answer business questions such as sales by region or month.','df.groupby("region", as_index=False)["sales"].sum()','One total is returned for each region','df.groupby("region", as_index=False)["sales"].sum()','Calculate sales total for each region.','df.groupby("region", as_index=False)["sales"].sum()','Rows are grouped by region and sales are summed within each group.','Calculate average sales and order count per region.','Use named aggregation with mean and count.','Choose the grouping level and aggregation to match the question.','Summing a metric when the intended answer is an average or distinct count.',['pandas-create-columns']),
      L('pandas-merge','Join DataFrames with merge','Combine related tables using a clearly defined key.','merge joins DataFrames on key columns with join types such as inner, left and outer.','Analysts combine transactions with customers, products or reference tables.','orders.merge(customers, on="customer_id", how="left")','Every order is retained; matching customer fields are added','orders.merge(customers, on="customer_id", how="left")','Keep all orders and bring in matching customer attributes.','orders.merge(customers, on="customer_id", how="left")','A left join keeps every row from orders.','Join on customer_id and validate a many-to-one relationship.','Use validate="many_to_one" when each customer key should be unique.','Check key uniqueness and row counts before and after every join.','Joining on a non-unique key and unintentionally multiplying rows.',['pandas-groupby']),
      L('pandas-pivot','Reshape summaries with pivot_table','Turn grouped values into a compact comparison table.','pivot_table groups by index and columns, then aggregates values into cells.','A pivoted view supports cross-tab comparisons across categories and periods.','pd.pivot_table(df, values="sales", index="region", columns="month", aggfunc="sum")','Regions become rows and months become columns','pd.pivot_table(df, values="sales", index="region", columns="month", aggfunc="sum")','Summarize sales by region and month.','pd.pivot_table(df, values="sales", index="region", columns="month", aggfunc="sum")','The index and columns define groups; aggfunc resolves multiple values per cell.','Fill empty region-month combinations with zero.','Pass fill_value=0 when zero is a valid representation for absent combinations.','Choose an aggregation explicitly and distinguish absent combinations from true zero sales.','Leaving aggfunc implicit when multiple records can map to one cell.',['pandas-groupby'])
    ]},
    { title:'Cleaning and exploratory analysis', lessons:[
      L('pandas-cleaning-workflow','A repeatable data-cleaning workflow','Profile first, document choices, then verify the cleaned result.','A cleaning workflow inspects structure, fixes known issues, validates constraints and records changes.','Repeatable cleaning prevents silent assumptions from entering business reporting.','df.shape\ndf.info()\ndf.isna().sum()\ndf.duplicated().sum()','The checks reveal size, types, missingness and exact duplicates','df.info()','Start a cleaning pass by checking shape, types and missing values.','df.info()\ndf.isna().sum()','Metadata and missing counts show issues before any rows are changed.','Write a check that counts duplicate rows.','Use duplicated().sum().','Keep raw input unchanged and compare key quality metrics before and after cleaning.','Dropping records before documenting why they are invalid.',['pandas-inspect']),
      L('pandas-data-validation','Check data against clear rules','Catch missing IDs, duplicate records and impossible values before analysis.','Data validation checks whether records meet expected rules such as required fields, unique IDs and non-negative sales.','Clear checks prevent poor input from silently changing totals and reports.','if df["order_id"].isna().any():\n    raise ValueError("Order IDs cannot be blank")\nif df["order_id"].duplicated().any():\n    raise ValueError("Order IDs must be unique")\nif (df["sales"] < 0).any():\n    raise ValueError("Sales cannot be negative")\nprint("All checks passed")','The checks stop with a clear error if any rule is broken; otherwise, they display All checks passed.','df["order_id"].isna().sum()','Check that order IDs are present and unique and that sales are not negative before running a report.','if df["order_id"].isna().any():\n    raise ValueError("Order IDs cannot be blank")\nif df["order_id"].duplicated().any():\n    raise ValueError("Order IDs must be unique")\nif (df["sales"] < 0).any():\n    raise ValueError("Sales cannot be negative")\nprint("All checks passed")','Each check looks for a rule being broken. If one is broken, Python stops and shows that rule’s message. If all three checks pass, it prints All checks passed.','Check that sales contains no negative values.','Use (df["sales"] < 0).any() and raise a clear ValueError if it is True.','Base rules on the data meaning, report which rule failed and correct the source instead of silently hiding bad rows.','Treating every unusual value as invalid without checking the business rule.',['pandas-cleaning-workflow']),
      L('py-test-functions','Test Python calculations with pytest','Check a reusable function with small examples before using it on a full dataset.','A test gives known inputs to code and checks that the returned answer matches what should happen.','Small automated tests catch mistakes when analysis code changes or is reused.','def profit(sales, cost):\n    return sales - cost\n\ndef test_profit():\n    assert profit(1200, 700) == 500\n    assert profit(800, 300) == 500','Both expected profit checks pass when run with pytest.','def profit(sales, cost):\n    return sales - cost','Write a test for a profit function using one normal example and one zero-profit example.','def test_profit():\n    assert profit(1200, 700) == 500\n    assert profit(800, 800) == 0','assert compares the actual answer with the expected answer. If they differ, pytest reports a failed test.','Add a test that profit(900, 400) returns 500.','Write assert profit(900, 400) == 500 inside a function whose name starts with test_.','Test normal values, boundary cases and invalid inputs; run tests again after changing the function.','Testing only one example or changing expected values to make a failing test pass.',['py-functions']),
      L('pandas-text-cleaning','Standardize messy category labels','Make equivalent labels match while preserving the source for auditing.','Text cleaning combines whitespace removal, case normalization and explicit category mapping.','Inconsistent spellings split group totals and produce misleading dashboards.','df["channel"] = df["channel"].str.strip().str.lower()','" Online " becomes "online"','df["channel"].str.strip().str.lower()','Normalize channel values by trimming and lowercasing.','df["channel"] = df["channel"].str.strip().str.lower()','The string operations standardize whitespace and capitalization.','Map "web" and "online" to one documented category.','Use Series.replace with an explicit mapping dictionary.','Inspect value_counts before and after and retain a reversible raw column when needed.','Replacing labels based on guesswork without checking distinct values.',['pandas-string-methods']),
      L('pandas-outliers','Check outliers and unusual values','Investigate extreme values before deciding whether to keep or correct them.','Outliers are observations unusually far from the expected distribution or business constraints.','A few extreme values can distort averages and visual scales.','df["sales"].describe()\ndf[df["sales"] > upper_limit]','The filter isolates values for review','df[df["sales"] > 10000]','Review sales values greater than the chosen threshold.','df[df["sales"] > 10000]','A threshold makes candidate rows visible for investigation.','Count values below zero in a non-negative sales measure.','Filter sales < 0 and count the rows.','Validate outliers against source records and business rules before changing them.','Deleting every statistical outlier automatically.',['pandas-inspect']),
      L('pandas-descriptive-stats','Descriptive statistics','Summarize center, spread and range before making conclusions.','Mean, median, standard deviation, quantiles and counts describe different properties of data.','Basic summaries find skew, invalid ranges and differences between groups.','df["sales"].agg(["count", "mean", "median", "min", "max"])','The output reports count, center and range','df["sales"].agg(["count", "mean", "median", "min", "max"])','Calculate count, mean, median, minimum and maximum for sales.','df["sales"].agg(["count", "mean", "median", "min", "max"])','agg applies each requested summary to the column.','Compare mean and median for a skewed sales column.','Calculate both values and inspect their difference.','Report sample size and missingness alongside summary statistics.','Treating a mean as representative when the distribution is highly skewed.',['pandas-groupby']),
      L('pandas-correlation','Correlation and relationships','Measure linear association while avoiding causal claims.','Correlation measures the strength and direction of linear association between numeric variables.','It helps prioritize relationships for deeper analysis and quality checks.','df[["sales", "cost"]].corr()','The result is a pairwise correlation matrix','df[["sales", "cost"]].corr()','Calculate the correlation matrix for sales and cost.','df[["sales", "cost"]].corr()','corr computes pairwise correlations for selected numeric columns.','Check whether a relationship is driven by a few extreme observations.','Plot the variables and compare subgroup or robust summaries.','Check sample size, outliers and confounders; correlation alone does not establish causation.','Claiming one variable causes another because correlation is high.',['pandas-descriptive-stats']),
      L('pandas-eda','Exploratory data analysis','Turn a business question into checked summaries and useful comparisons.','EDA combines data validation, descriptive summaries and targeted visual or grouped comparisons.','A structured exploration catches data issues and helps form evidence-based follow-up questions.','df.groupby("region")["sales"].agg(["count", "mean", "sum"])','The summary compares volume, average and total by region','df.groupby("region")["sales"].agg(["count", "mean", "sum"])','Compare sales count, average and total by region.','df.groupby("region")["sales"].agg(["count", "mean", "sum"])','Multiple summaries reveal whether a high total comes from volume or average size.','Check whether the number of orders differs by region.','Group by region and count order_id.','State the question, verify data quality, compare relevant groups and communicate limitations.','Searching many unrelated patterns and presenting only a favorable result.',['pandas-groupby','pandas-descriptive-stats'])
    ]},
    { title:'Visualize and communicate findings', lessons:[
      L('python-matplotlib','Create charts with Matplotlib','Build reproducible charts by connecting data, marks and labels.','Matplotlib is a plotting library; pyplot provides common charting functions.','Charts make trends and comparisons easier to communicate than raw tables.','import matplotlib.pyplot as plt\nplt.plot(months, sales)','A line chart is created from paired x and y values','plt.plot(months, sales)','Plot sales over the ordered months.','plt.plot(months, sales)','plot maps each month to its corresponding sales value.','Import matplotlib.pyplot as plt.','Use the conventional plt alias.','Use a chart type that matches the question and label its units.','Making a chart without checking whether x and y values align.',['pandas-eda']),
      L('python-bar-line','Bar charts and line charts','Use bars for category comparisons and lines for ordered trends.','Bar charts compare discrete categories; line charts emphasize continuity across ordered values.','Matching the visual form to the analytical question reduces misleading interpretation.','plt.bar(regions, totals)\nplt.plot(months, sales, marker="o")','Bars compare regions; a line shows change by month','plt.bar(regions, totals)','Compare total sales across regions with a bar chart.','plt.bar(regions, totals)','Each category receives a bar whose height encodes its total.','Show monthly sales over time as a trend.','Use a line chart with dates ordered from earliest to latest.','Order time values before plotting and keep category labels readable.','Using a line chart for unordered categories.',['python-matplotlib']),
      L('python-distributions','Histograms and distributions','Inspect the shape, spread and unusual values of numeric data.','A histogram groups numeric observations into bins and shows their frequency.','Distribution shape helps assess skew, concentration, gaps and potential outliers.','plt.hist(df["sales"].dropna(), bins=10)','Bars show counts within numeric intervals','plt.hist(df["sales"].dropna(), bins=10)','Plot the distribution of non-missing sales values.','plt.hist(df["sales"].dropna(), bins=10)','hist divides values into bins and counts observations per bin.','Plot a histogram of sales using 10 bins.','Use plt.hist with bins=10; each bar counts values in one range.','State the bin choice and sample size when interpreting a histogram.','Comparing histograms with incompatible bin widths as if counts were directly comparable.',['python-matplotlib']),
      L('python-scatterplots','Scatterplots for two numeric variables','Inspect whether two numeric measures move together.','A scatterplot places one observation at each pair of x and y values.','It reveals direction, clusters, nonlinear patterns and unusual pairs.','plt.scatter(df["sales"], df["cost"])','Each point represents one observation','plt.scatter(df["sales"], df["cost"])','Plot sales against cost for each record.','plt.scatter(df["sales"], df["cost"])','The x and y values from each row form a point.','Add transparency to overlapping points.','Pass alpha=0.5 to scatter.','Check for clusters, outliers and subgroup effects before summarizing a relationship.','Interpreting a dense overplotted chart as a small number of observations.',['python-matplotlib','pandas-correlation']),
      L('python-chart-labels','Label, format and save charts','Make plots understandable outside the notebook that created them.','Titles, axis labels, legends and savefig metadata explain what a chart encodes.','Clear labels preserve meaning when charts are shared in reports or presentations.','plt.title("Monthly sales")\nplt.xlabel("Month")\nplt.ylabel("Sales ($)")\nplt.tight_layout()','The chart explains its subject and units','plt.ylabel("Sales ($)")','Label a chart axis with both the metric and its unit.','plt.ylabel("Sales ($)")','The label prevents readers from guessing the measure or scale.','Save the current chart as sales.png at 150 dpi.','Use savefig with dpi=150 and bbox_inches="tight".','Add descriptive titles, units, legends when needed and readable tick labels.','Saving an unlabeled chart that cannot be interpreted independently.',['python-bar-line'])
    ]},
    { title:'Seaborn for statistical visualization', lessons:[
      L('seaborn-intro','Seaborn foundations','Create attractive statistical charts directly from tidy DataFrames.','Seaborn is a statistical visualization library built on Matplotlib that works naturally with Pandas data.','It uses column names and sensible defaults to make common analysis charts concise and readable.','import seaborn as sns\nsns.set_theme()','Seaborn’s theme is applied to Matplotlib charts.','import seaborn as sns\nsns.set_theme()','Import Seaborn as sns and apply its default theme.','import seaborn as sns\nsns.set_theme()','Seaborn styles charts and adds statistical plotting functions on top of Matplotlib.','Import Seaborn using its conventional alias sns.','Write import seaborn as sns.','Seaborn uses Matplotlib; use plt functions when you need detailed figure control.','Assuming Seaborn replaces Matplotlib rather than building on it.',['python-matplotlib'] ),
      L('seaborn-distributions','Show distributions with Seaborn','Compare numeric distributions with histograms and density curves.','Seaborn histplot groups numeric observations into bins; kdeplot estimates a smooth density curve.','Distribution charts show spread, skew, gaps and differences between groups.','sns.histplot(data=df, x="sales", bins=10, kde=True)','The chart shows sales counts and an estimated density curve.','sns.histplot(data=df, x="sales", bins=5)','Plot the distribution of sales with five bins.','histplot counts observations in numeric intervals; kde adds a smoothed shape estimate.','Make a sales histogram with five bins and add a smooth estimate of where values gather.','Use sns.histplot with the sales column, bins=5 and kde=True.','Use comparable bin widths when comparing groups and remember a density curve is an estimate.','Comparing distributions with different bin widths without explanation.',['seaborn-intro','python-distributions'] ),
      L('seaborn-categorical','Compare categories with Seaborn','Choose a category chart that matches whether you need counts or a summary metric.','countplot displays how many observations are in each category; barplot summarizes a numeric measure by category.','Category comparisons help explain differences among regions, products or customer groups.','sns.barplot(data=df, x="region", y="sales")','Each bar shows the mean sales for one region by default.','sns.countplot(data=df, x="region")','Count orders in each region.','countplot counts rows in each category; it does not sum the sales column.','Make a bar chart showing average sales for each region.','Use sns.barplot with region as the group and sales as the number to summarize.','State whether a bar shows a count, sum or mean; barplot summarizes the numeric measure.','Reading a barplot as a total when it displays a mean.',['seaborn-intro','pandas-groupby'] ),
      L('seaborn-relationships','Explore relationships with Seaborn','Explore how two numeric variables relate and compare groups with color.','scatterplot displays observations as points; hue assigns colors by a third categorical variable.','The chart can reveal clusters or group differences that a single summary hides.','sns.scatterplot(data=df, x="sales", y="cost", hue="region")','Each point is an order, colored by region.','sns.scatterplot(data=df, x="sales", y="cost", hue="region")','Compare sales and cost for each order, using region as color.','Each row becomes a point; hue helps compare regions.','Plot sales against cost and color points by region.','Use sns.scatterplot with x="sales", y="cost" and hue="region".','Inspect overlap, sample size and outliers; a visible relationship does not prove cause.','Treating a visual association as proof that one variable causes another.',['seaborn-intro','python-scatterplots'] ),
      L('seaborn-heatmaps','Read correlation heatmaps','Use color to scan a matrix of pairwise numeric correlations.','A heatmap encodes each matrix value as a color; correlation matrices summarize pairwise linear associations.','Heatmaps make many relationships easier to scan, while annotations preserve exact values.','corr = df[["sales", "cost"]].corr()\nsns.heatmap(corr, annot=True, vmin=-1, vmax=1, cmap="coolwarm")','The cell color and annotation show the correlation for each pair.','Create a correlation matrix for sales and cost, then display it as an annotated heatmap.','corr = df[["sales", "cost"]].corr()\nsns.heatmap(corr, annot=True, vmin=-1, vmax=1, cmap="coolwarm")','corr calculates pairwise correlations; heatmap displays the values on a fixed -1 to 1 scale.','Make an annotated heatmap from a correlation matrix named corr.','Use sns.heatmap(corr, annot=True, vmin=-1, vmax=1).','Correlation describes association, not causation; use a consistent color scale for comparisons.','Using a changing color scale across charts and mistaking color for statistical significance.',['seaborn-intro','pandas-correlation'] )
    ]}
  ];

  function L(id, title, tagline, concept, why, syntax, code, output, task, solution, explain, practiceQ, hint, safe, mistake, prereq) {
    return { id, title, tagline, concept, why, syntax, code, output, task, solution, explain, practiceQ, hint, safe, mistake, prereq:prereq || [] };
  }

  const SALES_SAMPLE = { rows:[
    ['order_id','region','month','date','sales','cost','customer_id'],
    ['O-101','North','Jan','2026-01-05',1200,700,101],
    ['O-102','South','Jan','2026-01-18',800,450,102],
    ['O-103','North','Feb','2026-02-03',1500,850,101],
    ['O-104','West','Feb','2026-02-21',10000,5000,103],
    ['O-105','South','Mar','2026-03-09',12500,6200,102]
  ] };
  const MISSING_SAMPLE = { rows:[
    ['order_id','region','sales'],
    ['O-101','North',1200],
    ['O-102','South',''],
    ['O-103','North',1500],
    ['O-104','West',800]
  ] };
  const DUPLICATE_SAMPLE = { rows:[
    ['order_id','customer_id','sales'],
    ['O-101',101,1200],
    ['O-102',102,800],
    ['O-102',102,800],
    ['O-103',101,1500]
  ] };
  const TEXT_SAMPLE = { rows:[
    ['order_id','region','channel'],
    ['O-101',' North ','Online'],
    ['O-102','south',' web '],
    ['O-103','WEST','Retail']
  ] };
  const ORDER_SAMPLE = { rows:[
    ['order_id','customer_id','sales'],
    ['O-101',101,1200],['O-102',102,800],['O-103',101,1500]
  ] };
  const CUSTOMER_SAMPLE = { rows:[
    ['customer_id','customer_name'],
    [101,'Asha'],[102,'Bilal'],[103,'Chitra']
  ] };
  const RELATION_SAMPLE = { rows:[
    ['order_id','region','sales','cost'],
    ['O-101','North',1200,700],['O-102','South',800,450],
    ['O-103','North',1500,850],['O-104','West',10000,5000]
  ] };
  const SAMPLE_TABLES = {
    'pandas-select-filter':SALES_SAMPLE, 'pandas-loc-iloc':SALES_SAMPLE,
    'pandas-export-files':SALES_SAMPLE, 'pandas-time-series':SALES_SAMPLE,
    'pandas-data-validation':SALES_SAMPLE,
    'pandas-missing-values':MISSING_SAMPLE, 'pandas-duplicates':DUPLICATE_SAMPLE,
    'pandas-create-columns':SALES_SAMPLE, 'pandas-string-methods':TEXT_SAMPLE,
    'pandas-datetime':SALES_SAMPLE, 'pandas-sort':SALES_SAMPLE,
    'pandas-groupby':SALES_SAMPLE, 'pandas-merge':ORDER_SAMPLE,
    'pandas-pivot':SALES_SAMPLE, 'pandas-cleaning-workflow':MISSING_SAMPLE,
    'pandas-text-cleaning':TEXT_SAMPLE, 'pandas-outliers':SALES_SAMPLE,
    'pandas-descriptive-stats':SALES_SAMPLE, 'pandas-correlation':RELATION_SAMPLE,
    'pandas-eda':SALES_SAMPLE, 'python-bar-line':SALES_SAMPLE,
    'python-distributions':SALES_SAMPLE, 'python-scatterplots':RELATION_SAMPLE,
    'seaborn-distributions':SALES_SAMPLE, 'seaborn-categorical':SALES_SAMPLE,
    'seaborn-relationships':RELATION_SAMPLE, 'seaborn-heatmaps':RELATION_SAMPLE
  };
  const RELATED_TABLES = { 'pandas-merge':CUSTOMER_SAMPLE };

  const PLAIN_WORDS = [
    [/\bUse a readable general-purpose language to automate analysis\b/gi,'Use clear code to do data work automatically'],
    [/\bPython is a programming language used to load, transform, analyze and communicate data\b/gi,'Python is a language for writing steps to open, change, study and share data'],
    [/\bIt turns repeatable analysis steps into code that can be rerun on new files\b/gi,'Write the steps once, then run them again on other files'],
    [/\bA variable is a name bound to a value; assignment with = stores or rebinds that value\b/gi,'A variable is a name for a value. Use = to put a value under a name or change the value stored there'],
    [/\bType-aware operations prevent invalid calculations and make cleaned data trustworthy\b/gi,'Using the right kind of value helps prevent calculation errors and keeps cleaned data trustworthy'],
    [/\bThey express metrics and filters directly and reproducibly\b/gi,'They help you calculate measures and choose rows with clear steps you can use again'],
    [/\bA string is immutable text; methods such as strip, lower, replace and split return new strings\b/gi,'A string is text. Actions such as strip, lower, replace and split return new text instead of changing the original'],
    [/\bA tuple is an ordered, immutable collection; unpacking assigns its elements to names\b/gi,'A tuple is an ordered group of values that you cannot change. Unpacking puts its values into separate names'],
    [/\bA dictionary maps unique keys to values, for example a column name to a metric\b/gi,'A dictionary stores values under names, such as a column name and its total'],
    [/\bConditional statements run a block only when a boolean condition is true\b/gi,'An if statement runs its indented steps only when its True-or-False check is True'],
    [/\bThey encode rules such as flagging low stock or assigning a performance band\b/gi,'They let you write rules, such as marking low stock or choosing a performance group'],
    [/\bA for loop assigns each iterable item to a loop variable and runs an indented block\b/gi,'A for loop takes items from a group one at a time. For each item, Python runs the indented steps'],
    [/\bLoops automate repetitive checks and transformations over records or values\b/gi,'Loops run the same checks or changes for each row or value'],
    [/\bA Series is a labelled one-dimensional array; a DataFrame aligns one or more Series by index\b/gi,'A Series is one named column. A DataFrame is a table made from columns; Pandas matches their values by row labels'],
    [/\bDirect loading makes recurring work reproducible and avoids manual copy-paste\b/gi,'Loading files with code lets you repeat the same steps and avoids copying data by hand'],
    [/\bInitial inspection finds wrong types, unexpected missingness and suspicious ranges early\b/gi,'An early check can find the wrong kind of values, blank cells and unusual numbers'],
    [/\bFocused subsets simplify analysis and reduce accidental use of irrelevant records\b/gi,'Using only the rows and columns you need makes the work simpler and helps avoid unrelated data'],
    [/\bStandardized labels prevent duplicate categories caused by whitespace or case differences\b/gi,'Using the same spelling and letter case stops one group from being split into duplicates'],
    [/\bAn array shape is a tuple of its dimensions; ndim gives the number of axes\b/gi,'An array shape tells how many values it has in each direction. ndim tells how many directions it has'],
    [/\bNumPy uses zero-based indexing and supports slices; a comma separates axes in multidimensional arrays\b/gi,'NumPy starts counting positions at 0 and lets you choose a range of values. In a table, write the row choice first and the column choice second'],
    [/\bVectorization applies array operations element-wise using optimized NumPy routines\b/gi,'NumPy can apply one calculation to every value in an array without writing a loop'],
    [/\bNumPy functions such as sum, mean, min and max reduce values to summaries\b/gi,'NumPy functions such as sum, mean, min and max turn many values into one short answer'],
    [/\bPandas read_csv and read_excel read files into DataFrames\b/gi,'Pandas uses read_csv and read_excel to open files as tables'],
    [/\bhead, info, describe, shape and columns reveal different aspects of a DataFrame\b/gi,'Use head to see rows, info to check columns and values, describe for number summaries, and shape and columns to check the table size and names'],
    [/\bColumn labels select variables; a boolean mask selects rows matching a condition\b/gi,'Column names let you choose columns. A list of True-or-False answers lets you keep rows that match a rule'],
    [/\bDerived measures such as margin and order value support consistent reporting\b/gi,'New columns such as profit margin and order value help keep reports consistent'],
    [/\bto_datetime parses date values; the \\.dt accessor exposes year, month and other components\b/gi,'to_datetime turns date text into dates. Use .dt to get the year, month or other part of a date'],
    [/\bNumPy provides homogeneous n-dimensional arrays and vectorized numerical operations\b/gi,'NumPy provides groups of values of one kind, arranged in rows, columns or more directions, and can calculate on many numbers at once'],
    [/\bIt reduces Python-level looping for large numerical datasets and underpins much of the data stack\b/gi,'It can do calculations on large groups of numbers without writing a loop for each value'],
    [/\bBroadcasting aligns array dimensions from the right and permits equal sizes or dimensions of size one\b/gi,'Broadcasting lets NumPy use a smaller array in a larger calculation when the shapes match or one size is 1'],
    [/\bPandas is a Python library for labelled tabular data, built around Series and DataFrame objects\b/gi,'Pandas is a Python tool for working with named rows and columns in Series and DataFrame tables'],
    [/\bUnderstanding these objects makes selections and calculations predictable\b/gi,'Knowing how these columns and tables work helps you choose data and calculate correctly'],
    [/\bOperators are the building blocks for measures such as profit, percentage change and averages\b/gi,'Operators help you calculate profit, percentage change and averages'],
    [/\bThe assignment statements bind the names to numbers; subtraction creates profit\b/gi,'The = sign stores each number under its name. Subtracting cost from revenue gives the profit'],
    [/\bIt is useful for repeat counts and indexed traversal when positions matter\b/gi,'Use it to repeat steps a set number of times or work with item positions'],
    [/\bA list comprehension evaluates an expression for each item and may include a condition\b/gi,'A list comprehension makes a new list by changing each item or keeping only items that match a rule'],
    [/\bThey make short, transparent transformations concise\b/gi,'They give you a short, clear way to make a list from other values'],
    [/\bA module is importable Python code; import binds it to a name in the current file\b/gi,'A module is a Python file with extra tools. Use import to make those tools available in your code'],
    [/\bExceptions report runtime failures; try\/except handles specific expected error types\b/gi,'An exception is an error that happens while code runs. try and except let you choose what to do for a particular error'],
    [/\bExplicit, predictable array construction helps prepare numeric features and test calculations\b/gi,'Building an array carefully helps prepare number columns and check calculations'],
    [/\bShape checks catch mismatched inputs before calculations or model preparation\b/gi,'Checking array shapes helps find mismatched data before calculations'],
    [/\bSelecting the intended rows and columns is a basic step in analysis and feature preparation\b/gi,'Choosing the right rows and columns is an important step in data analysis'],
    [/\bIt improves clarity and speed for repeated numeric calculations\b/gi,'It can make repeated calculations on numbers clearer and faster'],
    [/\bThey provide fast measures for checking and comparing numeric data\b/gi,'They quickly calculate totals and other summaries so you can check and compare numbers'],
    [/\bIt supports clean column-wise calculations while avoiding copied data\b/gi,'It lets you calculate across columns without making extra copies of the data'],
    [/\bUnderstanding these objects makes selections and calculations predictable\b/gi,'Knowing how these columns and tables work helps you choose data and calculate correctly'],
    [/\bloc selects by index and column labels; iloc selects by integer positions\b/gi,'loc chooses rows and columns by name; iloc chooses them by their numbered position'],
    [/\bMissing data can change denominators, trends and model inputs\b/gi,'Blank values can change averages, patterns over time and data used by a model'],
    [/\bCSV imports may treat numeric values as text, producing incorrect sorting and summaries\b/gi,'When opening a CSV, number values may be read as text. This can make sorting and summaries wrong'],
    [/\bThe \\.str accessor applies string operations such as strip, lower, contains and replace to a Series\b/gi,'Use .str to apply text actions such as strip, lower, contains and replace to every value in a Series'],
    [/\bCorrect date types enable sorting, period grouping and elapsed-time calculations\b/gi,'Correct date values let you sort by date, group by month or year, and find how much time has passed'],
    [/\bgroupby splits rows into groups; aggregations reduce each group to summaries\b/gi,'groupby puts rows with matching values into groups. You can then find a total, average or count for each group'],
    [/\bmerge joins DataFrames on key columns with join types such as inner, left and outer\b/gi,'merge combines tables by matching key columns. Inner, left and outer joins decide which rows to keep'],
    [/\bpivot_table groups by index and columns, then aggregates values into cells\b/gi,'pivot_table makes a summary table using row and column groups, then calculates a value for each cell'],
    [/\bA cleaning workflow inspects structure, fixes known issues, validates constraints and records changes\b/gi,'A cleaning plan checks the table, fixes known problems, checks the rules and records each change'],
    [/\bText cleaning combines whitespace removal, case normalization and explicit category mapping\b/gi,'Clean text by removing extra spaces, using the same letter case and choosing consistent group names'],
    [/\bOutliers are observations unusually far from the expected distribution or business constraints\b/gi,'An outlier is a number much higher or lower than most values, or outside a rule for the data'],
    [/\bA few extreme values can distort averages and visual scales\b/gi,'A few very high or low numbers can change the average and make a chart harder to read'],
    [/\bMean, median, standard deviation, quantiles and counts describe different properties of data\b/gi,'The mean, median, spread, dividing values and counts each describe data in a different way'],
    [/\bBasic summaries find skew, invalid ranges and differences between groups\b/gi,'Simple summaries can reveal uneven data, values outside the expected range and differences between groups'],
    [/\bCorrelation measures the strength and direction of linear association between numeric variables\b/gi,'Correlation is a number that shows whether two number columns tend to move together, and how strongly'],
    [/\bIt helps prioritize relationships for deeper analysis and quality checks\b/gi,'It helps you decide which links between columns to check more closely'],
    [/\bEDA combines data validation, descriptive summaries and targeted visual or grouped comparisons\b/gi,'Exploring data means checking it, making simple number summaries, and comparing useful groups or charts'],
    [/\bA structured exploration catches data issues and helps form evidence-based follow-up questions\b/gi,'Looking through data in clear steps can reveal problems and help you choose what to check next'],
    [/\bMatplotlib is a plotting library; pyplot provides common charting functions\b/gi,'Matplotlib is a Python tool for making charts. pyplot contains common chart-making commands'],
    [/\bBar charts compare discrete categories; line charts emphasize continuity across ordered values\b/gi,'Bar charts compare separate groups. Line charts show how values change in order, often over time'],
    [/\bA histogram groups numeric observations into bins and shows their frequency\b/gi,'A histogram puts numbers into ranges and shows how many values fall in each range'],
    [/\bDistribution shape helps assess skew, concentration, gaps and potential outliers\b/gi,'A chart of number ranges can show where values gather, where they are uneven, or whether unusual values appear'],
    [/\bA scatterplot places one observation at each pair of x and y values\b/gi,'A scatterplot uses one dot for each row, placed by its two values'],
    [/\bIt reveals direction, clusters, nonlinear patterns and unusual pairs\b/gi,'It can show whether values move together, form groups, follow a curved pattern or include unusual pairs'],
    [/\bTitles, axis labels, legends and savefig metadata explain what a chart encodes\b/gi,'A title, axis labels, legend and saved-file details explain what a chart shows'],
    [/\bSeaborn is a statistical visualization library built on Matplotlib that works naturally with Pandas data\b/gi,'Seaborn is a chart-making tool built on Matplotlib. It works well with Pandas tables'],
    [/\bIt uses column names and sensible defaults to make common analysis charts concise and readable\b/gi,'It can use column names and ready-made settings to make common charts easier to create and read'],
    [/\bSeaborn histplot groups numeric observations into bins; kdeplot estimates a smooth density curve\b/gi,'Seaborn histplot counts numbers in ranges. kdeplot adds a smooth line that estimates where values gather'],
    [/\bDistribution charts show spread, skew, gaps and differences between groups\b/gi,'These charts show how spread out the numbers are, where they gather, and how groups differ'],
    [/\bcountplot displays how many observations are in each category; barplot summarizes a numeric measure by category\b/gi,'countplot counts rows in each group. barplot shows a number summary, such as the average, for each group'],
    [/\bscatterplot displays observations as points; hue assigns colors by a third categorical variable\b/gi,'scatterplot draws one dot for each row. hue uses color to show another group, such as region'],
    [/\bA heatmap encodes each matrix value as a color; correlation matrices summarize pairwise linear associations\b/gi,'A heatmap uses colored squares to show numbers. A correlation table shows how pairs of number columns move together'],
    [/\bHeatmaps make many relationships easier to scan, while annotations preserve exact values\b/gi,'A heatmap helps you compare many number pairs quickly; labels on the squares show the exact numbers'],
    [/\bPython foundations\b/gi,'Python basics'],
    [/\bControl flow and reusable code\b/gi,'Choose what code does next and use code again'],
    [/\bPandas: load and inspect data\b/gi,'Pandas: open and look at data'],
    [/\bPandas: transform and combine\b/gi,'Pandas: change and join tables'],
    [/\bCleaning and exploratory analysis\b/gi,'Clean data and look for useful patterns'],
    [/\bSeaborn for statistical visualization\b/gi,'Seaborn charts for data'],
    [/\bVisualize and communicate findings\b/gi,'Make charts and share what you find'],
    [/\bgeneral-purpose language\b/gi,'language you can use for many kinds of work'],
    [/\bstatistical visualization library\b/gi,'chart-making tool that can summarize data'],
    [/\bmatrix of pairwise numeric correlations\b/gi,'table showing how number columns move together'],
    [/\bcorrelation matrices\b/gi,'tables showing how number columns move together'],
    [/\bmatrix value\b/gi,'table cell'],
    [/\bpairwise linear associations\b/gi,'links between pairs of number columns'],
    [/\blinear associations\b/gi,'links between number columns'],
    [/\bnumeric data type\b/gi,'kind of data used to store numbers'],
    [/\bA list is an ordered, mutable collection\b/gi,'A list is an ordered group of values that you can change'],
    [/\bLoops automate repetitive checks and changes\b/gi,'Loops run repeated checks and changes automatically'],
    [/\bLoops automate repetitive checks and transformations\b/gi,'Loops run the same checks and changes for each row or value'],
    [/\bVectorized array operations\b/gi,'One calculation across many array values'],
    [/\bnumeric iteration\b/gi,'counting by position'],
    [/\btabular analysis\b/gi,'working with tables of data'],
    [/\btabular data\b/gi,'data arranged in rows and columns'],
    [/\bInitial inspection\b/gi,'An early check'],
    [/\bMake concise, transparent transformations\b/gi,'Make clear, easy-to-follow changes'],
    [/\bMake concise transformations\b/gi,'Make clear changes'],
    [/\bin-place edits\b/gi,'changes to the original'],
    [/\bboolean condition\b/gi,'True-or-False condition'],
    [/\bexploratory analysis\b/gi,'looking through data to find useful patterns'],
    [/\bExploratory data analysis\b/gi,'looking through data to understand it'],
    [/\bfundamentals\b/gi,'basics'],
    [/\bfoundation\b/gi,'starting point'],
    [/\bfoundations\b/gi,'basics'],
    [/\bcontrol flow\b/gi,'choosing what code does next'],
    [/\bnormalize text\b/gi,'make text consistent'],
    [/\bdtype\b/gi,'data type'],
    [/\bthresholds\b/gi,'limits'],
    [/\bthreshold\b/gi,'limit'],
    [/\bintervals\b/gi,'ranges'],
    [/\binterval\b/gi,'range'],
    [/\bdefault estimator\b/gi,'usual calculation'],
    [/\bdistinct\b/gi,'different'],
    [/\bautomatically and\b/gi,'automatically, and'],
    [/\bdenominator\b/gi,'bottom number in a fraction'],
    [/\bnumerator\b/gi,'top number in a fraction'],
    [/\bsubplots\b/gi,'small charts'],
    [/\bsubplot\b/gi,'small chart'],
    [/\boverplotting\b/gi,'points drawn on top of each other'],
    [/\bskipping\b/gi,'leaving out'],
    [/\bexclude\b/gi,'leave out'],
    [/\bexcludes\b/gi,'leaves out'],
    [/\bexcluded\b/gi,'left out'],
    [/\bparameterize\b/gi,'set up with choices'],
  ];

  function useSimpleEnglish(value, key) {
    if (typeof value === 'string') {
      if (['id','lessons','prereq','related'].includes(key)) return value;
      if (['code','formula','solution','answer','syntaxCode'].includes(key)) return value;
      return PLAIN_WORDS.reduce((text, [pattern, replacement]) => text.replace(pattern, match =>
        /^[A-Z]/.test(match) ? replacement[0].toUpperCase() + replacement.slice(1) : replacement
      ), value);
    }
    if (Array.isArray(value)) {
      if (['lessons','prereq','related'].includes(key)) return value;
      return value.map(item => useSimpleEnglish(item, key));
    }
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(childKey => { value[childKey] = useSimpleEnglish(value[childKey], childKey); });
    }
    return value;
  }

  const TERM_NOTES = {
    'py-intro':['Code: instructions written for the computer.','Program: a set of instructions that the computer follows.'],
    'py-variables':['Variable: a name that holds a value.','Assignment (`=`): putting a value under a name.'],
    'py-types':['Integer (`int`): a whole number.','Float (`float`): a number that can have a decimal point.','String (`str`): text inside quotes.','Boolean (`bool`): either `True` or `False`.','Mutable: a value that can be changed. Immutable: a value that cannot be changed after it is made.'],
    'py-operators':['Operator: a symbol or word that tells Python what to do with values.','Condition: a question whose answer is `True` or `False`.'],
    'py-strings':['String: text inside quotes.','Method: a built-in action you can use on a value, such as `.lower()` for text.'],
    'py-lists':['List: an ordered group of values that you can change.','Index: an item’s position; Python starts counting at 0.','Slice: a selected range of list items.'],
    'py-tuples':['Tuple: an ordered group of values that cannot be changed after it is made.','Unpacking: putting tuple items into separate names in order.'],
    'py-dictionaries':['Dictionary: a group of key-and-value pairs.','Key: the name used to look up its matching value.','Metric: a number used to track or compare something, such as total sales.'],
    'py-dictionary-iteration':['`.items()`: gives a loop each key and its value.','`.get(key, default)`: looks up a key and returns a chosen fallback when it is missing.'],
    'py-sets':['Set: a collection that keeps each distinct value once and does not promise a fixed order.','Union: all distinct values from either set (`A | B`).','Intersection: values present in both sets (`A & B`).','Difference: values in the first set but not the second (`A - B`).'],
    'py-oop-classes':['Class: a definition for a kind of object.','Object or instance: one value created from a class.','Parent class: a class that another class can reuse.','Child class: a class that reuses or changes parts of a parent class.','A Dog class defines the shared information and actions for individual dogs.'],
    'py-oop-attributes-methods':['Attribute: a value stored on one object.','Method: a function defined inside a class that can use that object’s data.','`self`: the usual first input name for the current object; Python supplies it when you call the method through that object.','`__init__`: a function Python calls when a new object is made, so it can store the starting values.'],
    'py-oop-principles':['OOP: short for object-oriented programming, a way to organize code around objects.','Encapsulation: keep related data and actions together and use clear methods to work with them.','Abstraction: give the user a simple action to use without needing to know every step inside it.','Inheritance: let a child class reuse or extend a parent class.','Polymorphism: call the same method on different object types and let each type provide its own behavior.','Overriding: giving a child class its own version of a method from its parent class.','In Python, a leading underscore is a convention for internal details, not a locked private field.'],
    'py-conditionals':['Condition: a question with a `True` or `False` answer.','Boolean: a value that is either `True` or `False`.','Indentation: spaces at the start of a line that show which steps belong together.'],
    'py-loops':['Loop: code that runs again and again.','Iterable: a group of items that a loop can visit one by one.','A `for` loop takes each item from a group, one at a time.'],
    'py-while-loops':['Condition: a question that Python checks before each turn of the loop.','Counter: a number that keeps track of which turn or list item comes next.'],
    'py-range':['`range(start, stop, step)`: a count of numbers that starts at `start`, stops before `stop`, and moves by `step`.'],
    'py-comprehensions':['List comprehension: a short way to make a new list by changing or choosing items from another group.'],
    'py-functions':['Function: named steps that you can run whenever you need them.','`return`: sends a result back to the code that called the function.'],
    'py-parameters':['Parameter: a name in a function that receives a value.','Argument: the value you give the function when you use it.'],
    'py-modules':['Module: a Python file of tools that you can bring into your code with `import`.','Alias: a shorter name for something, such as `pd` for Pandas.'],
    'py-exceptions':['Error: a problem that stops code from doing what you asked.','`try` runs code that might cause an error; `except` says what to do for a named error.'],
    'numpy-intro':['Array: an ordered group of values that NumPy can work on together.','Numeric: made of numbers.','NumPy is a Python tool for working with groups of numbers.'],
    'numpy-arrays':['`arange(start, stop)`: makes numbers from `start` up to, but not including, `stop`.'],
    'numpy-shapes':['Shape: the size of an array in each direction. For example, `(2, 3)` means 2 rows and 3 columns.','Dimension: one direction in an array, such as rows or columns.','Axis: one direction in an array.'],
    'numpy-indexing':['Index: the position of an item; counting starts at 0.','Matrix: a table of numbers.','In `matrix[row, column]`, the first number chooses the row and the second chooses the column.'],
    'numpy-vectorization':['Vectorized operation: one calculation applied to many array values at once.','Element-wise: done separately to each value in an array.','NumPy can apply one calculation to every number in an array without writing a loop.'],
    'numpy-aggregation':['Summary: a shorter answer made from many values, such as a total, average, smallest or largest value.'],
    'numpy-broadcasting':['Broadcasting: NumPy matches a short array to a larger array so it can do one calculation across the larger array.'],
    'pandas-intro':['DataFrame: a table with named columns and rows.','Tabular data: data arranged in rows and columns.','Pandas: a Python tool for working with tables of data.'],
    'pandas-series-dataframe':['Series: one named column of values.','DataFrame: a table made from one or more named columns.'],
    'pandas-read-files':['CSV: a plain-text file that stores table rows with commas between values.','`parse_dates`: an option that tells Pandas which columns contain dates.'],
    'pandas-export-files':['Export: save results from a program into a file for later use or sharing.','`index=False`: leave the DataFrame row labels out of the saved table.','Excel export may need an extra helper package called `openpyxl`.'],
    'pandas-inspect':['`shape`: the number of rows and columns.','`head()`: shows a small number of first rows.','`info()`: shows each column’s kind of data and how many values are present.'],
    'pandas-select-filter':['Filter: keep only the rows that match a rule.','Boolean mask: a list of `True` and `False` answers that tells Pandas which rows to keep.'],
    'pandas-loc-iloc':['`loc`: choose rows or columns by their names.','`iloc`: choose rows or columns by their number position.'],
    'pandas-missing-values':['Missing value: a blank or unknown value in the table.','Median: the middle value after the numbers are put in order.'],
    'pandas-duplicates':['Duplicate row: a row that repeats another row under the key you choose.','Key: the column or columns used to tell records apart.'],
    'pandas-dtypes':['Data type: what kind of value a column holds, such as a number, text or date.','Numeric: made of or used for numbers.','ID: a code used to identify something; it is usually text, not a number to calculate with. Read IDs as text when loading a file if leading zeros matter.'],
    'pandas-create-columns':['Derived column: a new column calculated from existing columns.','If sales is zero, a Pandas division can produce infinity or a missing value; decide how to handle zero sales before calculating a margin.'],
    'pandas-string-methods':['`.str`: Pandas’ tool for applying text actions to every value in a column.','Missing text values need a rule too; `na=False` treats them as not matching.'],
    'pandas-regex':['Regular expression (regex): a pattern that describes text to find or check.','`^`: the start of the text.','`\\d`: one digit.','`{3}`: exactly three of the preceding item.','`$`: the end of the text.','A raw string, such as `r"\\d+"`, tells Python to keep the backslash as written in the pattern.'],
    'pandas-datetime':['Datetime: a value that Python understands as a date or time.','`.dt`: Pandas’ tool for getting parts of dates, such as the year or month.'],
    'pandas-time-series':['Time series: values recorded in date or time order.','Index: the row labels used by Pandas; setting the date as the index lets time-based tools use those dates.','`resample("MS")`: group a date index into month-start periods.','Rolling summary: a calculation over the current period and a set number of nearby periods.'],
    'pandas-sort':['Ascending: from smallest to largest, or A to Z.','Descending: from largest to smallest, or Z to A.'],
    'pandas-groupby':['Group: rows that share the same value, such as orders from one region.','Aggregation: a summary such as total, average or count.','Metric: a number used to answer a question, such as total sales.'],
    'pandas-merge':['Merge: join two tables by matching values in a shared column.','Key: a column used to match rows between tables.','Inner join: keep rows that match in both tables.','Left join: keep every row in the first table and add matching details from the second.','Outer join: keep rows from both tables, whether or not they match.'],
    'pandas-pivot':['Pivot table: a summary table that puts one group down the rows and another across the columns.','`aggfunc`: tells Pandas how to combine multiple values, such as by adding them.'],
    'pandas-cleaning-workflow':['Data cleaning: finding and fixing problems in a table, while keeping track of what changed.','Repeatable steps: steps you can run again on new data.'],
    'pandas-data-validation':['Validation rule: a check that data must pass, such as requiring an order ID or preventing negative sales.','ID: a code that names a record, such as an order number.','`raise ValueError(...)`: stop the program and show a clear message when a value breaks a rule.'],
    'py-test-functions':['Test: code that checks whether another piece of code gives the expected result.','`pytest`: a separate Python test tool that finds functions whose names start with `test_`. Install it with `python -m pip install pytest` before running `python -m pytest`.','Expected result: the answer a test says the code should return.'],
    'pandas-text-cleaning':['Normalize text: make text values use the same spelling, letter case and spaces.'],
    'pandas-outliers':['Unusually high or low value: a value far from most others; check it before deciding it is wrong.'],
    'pandas-descriptive-stats':['Mean: add the numbers and divide by how many there are.','Median: the middle number after sorting the values.','Standard deviation: a number that describes how spread out values are.','Quantile: a value that divides sorted numbers into parts.'],
    'pandas-correlation':['Correlation: a number from -1 to 1 that shows whether two number columns tend to move together. It does not prove that one causes the other.'],
    'pandas-eda':['Exploratory data analysis: looking at a table in different ways to understand what it shows and find questions to check.'],
    'python-matplotlib':['Matplotlib: a Python tool for drawing charts.','`pyplot`: Matplotlib’s set of common chart-making functions.'],
    'python-bar-line':['Bar chart: compares separate groups.','Line chart: shows how values change in order, often over time.'],
    'python-distributions':['Histogram: groups numbers into ranges and counts how many values are in each range.','Bin: one range of numbers in a histogram.'],
    'python-scatterplots':['Scatterplot: a chart where each dot shows two values from one row.','Overlapping points: dots drawn on top of each other, which can hide how many rows there are.'],
    'python-chart-labels':['Axis: one direction on a chart; x usually goes left to right and y goes bottom to top.','Axis label: words that explain what a chart’s up-and-down or side-to-side numbers mean.','DPI: a setting that changes how much detail an image has when saved.'],
    'seaborn-intro':['Seaborn: a Python tool for drawing common data charts. It uses Matplotlib to make the charts.','Theme: a set of chart colors and text styles.'],
    'seaborn-distributions':['Histogram: groups numbers into ranges and counts the values in each range.','Density curve: a smooth line that estimates where values are most common.','Distribution: the way values are spread out.','Skew: a spread where more values gather on one side.','KDE: a smooth estimate of where values gather.'],
    'seaborn-categorical':['`countplot`: a bar chart that counts how many rows are in each group.','`barplot`: a bar chart that shows a number summary for each group; by default, it shows the average.'],
    'seaborn-relationships':['`hue`: a chart option that gives different groups different colors.','Category: a group or label, such as a region name.','A pattern in a chart does not prove that one thing caused another.'],
    'seaborn-heatmaps':['Heatmap: a table of colored squares; each color represents a number.','Matrix: a table of numbers.','Pairwise: looking at two things at a time.','Correlation: a number showing whether two number columns tend to move together. It does not prove that one causes the other.','Color scale: the rule that maps low and high numbers to colors.']
  };

  const TUTORING = {
    'py-intro': {
      definition:'Python is a language for writing instructions that a computer can follow. Analysts use it to open, change, study and show data.',
      why:'Instead of repeating the same clicks by hand, you can write the steps once and run them on another file.',
      parts:[['print(...)','print displays the value inside the parentheses.'],['"Hello, analyst!"','Quotation marks tell Python this value is text.']],
      walkthrough:['Python reads the command `print(...)`.','It displays the text between the quotation marks.','The displayed result is `Hello, analyst!`.'],
      answer:'Python is a programming language. I can use it to write steps for loading, cleaning and studying data, then run the same steps on new files.',
      scenario:'I would read the file, check its rows and columns, clean the values using clear rules, calculate the result, and check that result before sharing it.',
      watch:'Python follows the instructions you write. Give values clear names and check the result instead of assuming it understood the business meaning.'
    },
    'py-variables': {
      definition:'A variable is a name that lets you use a value later. The `=` sign stores a value under that name.',
      why:'Names such as `revenue` and `cost` make calculations easier to read and update than unexplained numbers.',
      parts:[['revenue = 12500','Store 12,500 under the name `revenue`.'],['cost = 8200','Store 8,200 under the name `cost`.'],['profit = revenue - cost','Subtract cost from revenue and store the answer as `profit`.']],
      walkthrough:['The first two lines store the sales and cost values.','The third line subtracts 8,200 from 12,500.','`profit` now holds `4300`.'],
      answer:'A variable is a name for a value. I use `=` to store a value, then use the name in later calculations. Clear names make the code easier to check.',
      scenario:'I would store each input under a clear name, calculate with those names, and check that the result matches a small example.',
      watch:'One `=` stores a value. Two equal signs, `==`, compare values.'
    },
    'py-types': {
      definition:'A type tells Python what kind of value it is working with: a whole number, a decimal number, text, or a True-or-False answer.',
      why:'Python can only do sensible operations when the values are the right kind. For example, text that looks like a number may need checking before you calculate with it.',
      parts:[['int','Whole numbers, such as `12`.'],['float','Numbers with a decimal point, such as `19.5`.'],['str','Text inside quotes, such as `"Sales"`.'],['bool','One of two answers: `True` or `False`.'],['int("12")','Turn digit text into the whole number `12`.']],
      walkthrough:['`amount = 19.5` stores a decimal number.','`label = "Sales"` stores text, and `active = True` stores a True-or-False value.','`type(amount).__name__` displays `float`.','`int("12")` changes digit text to the whole number `12`.'],
      answer:'Python values have types. For example, `int` is a whole number, `float` is a decimal, `str` is text, and `bool` is True or False. I check the type before converting or calculating.',
      scenario:'If a number column was read as text, I would check a few values, convert only valid number text, and review anything that became missing.',
      watch:'A customer ID may contain digits but is still a label. Keep it as text if you do not need to calculate with it.'
    },
    'py-operators': {
      definition:'Operators are symbols or words that tell Python to calculate, compare values, or combine True-or-False checks.',
      why:'They let you calculate measures such as profit and write exact rules for choosing rows.',
      parts:[
        ['=','Store a value: `sales = 8` puts 8 under the name sales.'],
        ['+','Add: `8 + 2` gives 10.'],
        ['-','Subtract: `8 - 2` gives 6.'],
        ['*','Multiply: `8 * 2` gives 16.'],
        ['/','Divide: `9 / 2` gives 4.5.'],
        ['//','Get the whole-number quotient: `9 // 2` gives 4.'],
        ['%','Get the remainder: `9 % 2` gives 1.'],
        ['**','Raise to a power: `2 ** 3` gives 8.'],
        ['==','Check whether values are equal: `5 == 5` gives `True`.'],
        ['!=','Check whether values differ: `5 != 3` gives `True`.'],
        ['>','Check whether the left value is greater: `5 > 3` gives `True`.'],
        ['<','Check whether the left value is smaller: `3 < 5` gives `True`.'],
        ['>=','Check whether the left value is greater or equal: `5 >= 5` gives `True`.'],
        ['<=','Check whether the left value is smaller or equal: `3 <= 3` gives `True`.'],
        ['and','Both checks must be True: `True and False` gives `False`.'],
        ['or','At least one check must be True: `True or False` gives `True`.'],
        ['not','Reverse a True-or-False value: `not True` gives `False`.'],
        ['& | ~','For Pandas columns, combine checks with `&` (both), `|` (either), or `~` (reverse); put each comparison in parentheses.']
      ],
      walkthrough:['`=` stores a value in a name; it does not compare two values.','`+`, `-`, `*` and `/` add, subtract, multiply and divide.','`//` gives the whole-number quotient, `%` gives the remainder, and `**` raises a number to a power.','`==`, `!=`, `>`, `<`, `>=` and `<=` compare values and return `True` or `False`.','`and` needs both checks to be True; `or` needs at least one; `not` reverses a check.','For Pandas columns, use `&`, `|` and `~` for checks on every row, with parentheses around each comparison.'],
      answer:'Arithmetic operators calculate, comparison operators return True or False, and `and`, `or` and `not` combine checks. For example, `sales >= 1000` checks whether sales meet a target.',
      scenario:'I would write each comparison in parentheses and check a case that should match and one that should not. For Pandas columns, I would use `&`, `|` and `~` rather than Python’s `and`, `or` and `not`.',
      watch:'`/` and `//` do different things: `7 / 2` is `3.5`, while `7 // 2` is `3`. For Pandas columns, use element-by-element operators such as `&` and put each comparison in parentheses.'
    },
    'py-strings': {
      definition:'A string is text. Python puts text inside single or double quotation marks.',
      why:'Names and group labels often contain extra spaces or different letter cases. Cleaning text helps matching and grouping work as expected.',
      parts:[['"  NORTH "','The original text has spaces at both ends.'],['.strip()','Remove spaces at the start and end.'],['.lower()','Change the remaining letters to lowercase.']],
      walkthrough:['Start with the text `"  NORTH "`.','`.strip()` returns `"NORTH"` by removing outside spaces.','`.lower()` returns `"north"` by changing the letter case.'],
      answer:'A string is text inside quotation marks. String methods such as `.strip()` remove outside spaces and `.lower()` changes letter case. They return cleaned text.',
      scenario:'I would inspect the original labels, remove unwanted spaces, make letter case consistent, and compare the unique values before and after.',
      watch:'`.strip()` removes spaces at the ends, not between words. These methods return a result, so save it if you want to keep the cleaned text.'
    },
    'py-lists': {
      definition:'A list keeps several values in order. Python starts counting list positions at zero.',
      why:'Lists are useful for holding related values, such as names, months or results from a calculation.',
      parts:[['[12, 18, 25]','Square brackets make a list with three values.'],['values[0]','Get the first value because counting starts at zero.'],['values[1:3]','Get positions 1 and 2; the stop position 3 is not included.']],
      walkthrough:['The list contains `12`, `18` and `25` at positions 0, 1 and 2.','`values[0]` gives `12`, the first value.','`values[1:3]` gives `[18, 25]`; the slice stops before position 3.'],
      answer:'A list is an ordered group of values. Its first position is 0. I can use an index for one value or a slice for a range of values.',
      scenario:'Before choosing a position, I would check the list length and remember that the first position is 0.',
      watch:'A slice includes its start but leaves out its stop. A list with three values has positions 0, 1 and 2.'
    },
    'py-tuples': {
      definition:'A tuple is an ordered group of values. Unlike a list, you do not change its items after creating it.',
      why:'A tuple is handy for a fixed set of related values, such as a month and its sales total.',
      parts:[['("Jan", 1200)','Make a tuple with a text value and a number.'],['month, sales = record','Put the first tuple value in `month` and the second in `sales`.']],
      walkthrough:['`record` holds `"Jan"` followed by `1200`.','Python matches each value to a name from left to right.','`month` is `"Jan"` and `sales` is `1200`.'],
      answer:'A tuple is an ordered group of values that stays fixed. Unpacking lets me put its values into separate names in the same order.',
      scenario:'I would use a tuple for a fixed group of values and make sure the number of names matches the number of tuple items.',
      watch:'Unpacking fails if you provide a different number of names from the number of values.'
    },
    'py-dictionaries': {
      definition:'A dictionary stores values under names called keys. You use a key to find its matching value.',
      why:'Named lookup is easier to understand than remembering that a value is in a certain position.',
      parts:[['"region": "West"','The key `"region"` is paired with the value `"West"`.'],['row["sales"]','Look up the value stored under the key `"sales"`.']],
      walkthrough:['The dictionary has two key-and-value pairs: region and sales.','`row["sales"]` asks Python for the value paired with `"sales"`.','The result is `1250`.'],
      answer:'A dictionary stores key-and-value pairs. I use a key, such as `"sales"`, to look up the value it names.',
      scenario:'Before looking up a key from uncertain data, I would check that it exists or use `.get()` when a missing key is expected.',
      watch:'A key that is not in the dictionary causes an error when you use square brackets.'
    },
    'py-dictionary-iteration': {
      definition:'A dictionary can be looped through by key, value, or key and value together.',
      why:'A loop lets you handle every named item in a summary without writing the same line for every key.',
      parts:[['sales_by_region.items()','Give the loop each region name and its matching total.'],['for region, total in ...','Put each key in `region` and its value in `total`.'],['sales_by_region.get("West", 0)','Look up West, using 0 if that key is not present.'],['sales_by_region["East"] = 400','Add a new key or replace the value stored under East.']],
      walkthrough:['The dictionary contains a key and a total for each region.','`.items()` lets the loop unpack one key and value on each pass.','`.get("West", 0)` returns 0 because West is not in this example dictionary.','Assigning to `["East"]` adds that new key and value.'],
      answer:'I use `.items()` to loop over keys and values together, `.get()` when a key may be missing, and square-bracket assignment to add or update a value.',
      scenario:'For a grouped summary, I would loop through `.items()` to report each category and its measure, then check whether optional keys exist before using them.',
      watch:'Do not change a dictionary while looping through that same dictionary; collect changes and apply them after the loop.'
    },
    'py-sets': {
      definition:'A set keeps one copy of each distinct value and does not promise a fixed order.',
      why:'Sets make it easy to check membership and compare groups without repeated values.',
      parts:[['{...}','Create a set with curly braces; an empty set is `set()`.'],['len(regions)','Count the distinct items in the set.'],['"West" in regions','Check whether West is present; the answer is True or False.'],['A & B','Get values found in both sets.'],['A | B','Get all distinct values from either set.'],['A - B','Get values in A that are not in B.']],
      walkthrough:['The repeated value `"North"` is stored only once.','The set therefore contains two distinct region names.','West is not one of them, so the membership check is `False`.','Sets are not indexed, so use a list if you need a stable order or a position.'],
      answer:'A set holds distinct values and is useful for quick membership checks and comparisons. It does not keep a reliable order, so it is not a replacement for a list when order matters.',
      scenario:'To find customers present in both monthly extracts, I would make a set of each month’s IDs and use intersection with `&`.',
      watch:'Numbers and text can be set items, but a list or dictionary cannot. Duplicate values are discarded.'
    },
    'py-oop-classes': {
      definition:'A class describes a kind of object. An object is one individual instance made from that class.',
      why:'A class is useful when several things share the same kind of information and actions, such as several dogs that each have a name.',
      parts:[['class Dog:','Define a new kind of object named `Dog`.'],['pass','Use a placeholder body while the class has no instructions yet.'],['Dog()','Create one new Dog object.'],['first_dog and second_dog','Two different objects made from the same class.']],
      walkthrough:['`class Dog` defines the shared type or plan.','`Dog()` creates one object from that class.','Calling it again creates another separate object.','The class is not one particular dog; it describes how Dog objects will be made and used.'],
      answer:'A class is a definition for a kind of object, and an object is one instance made from it. For example, Dog is the class; one particular dog is an object.',
      scenario:'If a program needs to represent several dogs with names and actions, a class can keep that shared structure together.',
      watch:'Defining a class does not create an object. Call the class, such as `Order()`, to make an instance.'
    },
    'py-oop-attributes-methods': {
      definition:'An object stores its own values in attributes and can run its class methods to work with those values.',
      why:'The same method can use each dog’s own name while keeping each object’s information separate.',
      parts:[['__init__(self, name)','Runs when a Dog is created and receives its starting name.'],['self','The current object. Python supplies it when a method is called through that object.'],['self.name = name','Save this dog’s name as an attribute on this object.'],['def speak(self):','Define a method that belongs to the class.'],['dog.speak()','Call the method on this particular object.']],
      walkthrough:['`Dog("Rex")` creates an object and Python calls `__init__` with that object and the name.','`self.name` saves Rex on that one dog. Another Dog object can have a different name.','When `dog.speak()` runs, Python passes `dog` as `self`.','The method uses the stored name and returns `Rex says Woof`.'],
      answer:'`__init__` sets up an object when it is made. `self` refers to that particular object. Attributes such as `self.name` store its data, and a method such as `speak()` uses that data.',
      scenario:'I would create each dog with its own name, then call the same speak method on each object.',
      watch:'Write `self` as the first method parameter, but do not pass it yourself when calling `dog.speak()`.'
    },
    'py-oop-principles': {
      definition:'Object-oriented programming (OOP) has four commonly taught ideas: encapsulation, abstraction, inheritance and polymorphism. They solve different problems, so each is best understood through its own example.',
      why:'Knowing the four ideas helps you understand programs that model everyday things, such as accounts, machines, vehicles and animals. It also helps you explain how classes keep code organized.',
      parts:[
        ['Encapsulation','Keep the data for one thing and the actions that use it together. Example: a bank account keeps its balance and provides a withdrawal action that checks whether the withdrawal is allowed.'],
        ['Abstraction','Give the user one clear action while hiding the smaller steps needed to do it. Example: press a coffee machine’s brew button; the machine handles heating water and moving it through the coffee.'],
        ['Inheritance','Make a more specific class from a general class so it can reuse its data or actions. Example: a car is a kind of vehicle and can reuse the vehicle’s shared speed behavior.'],
        ['Polymorphism','Use the same method call with different kinds of objects and let each object do the matching job. Example: call `speak()` on a dog or cat; each makes its own sound.'],
        ['Important difference','Encapsulation and abstraction are about how code is organized and used. Inheritance is about reusing a parent class. Polymorphism is about the same call working with different object types.']
      ],
      walkthrough:[
        'ENCAPSULATION — `BankAccount` keeps its balance with the actions that change it. Its `withdraw` method checks that the amount is positive and that enough money is available before changing the balance. This keeps the account rules with its data.',
        'ABSTRACTION — A coffee machine gives the user a simple `brew()` action. Inside, the machine heats water and moves it through the coffee. The user asks for coffee without controlling each internal step.',
        'INHERITANCE — `Car` is a kind of `Vehicle`. It receives shared behavior such as setting and showing speed from the parent class, then adds a car-specific action.',
        'POLYMORPHISM — `Dog` and `Cat` both have a `speak()` method. A loop can call `speak()` on either object; the dog says "Woof" and the cat says "Meow".',
        'These are separate ideas. A class can use one, several, or none of them. Choose classes when they make the program’s objects and behavior easier to understand.'
      ],
      answer:'Encapsulation keeps related data and actions together and checks changes against rules. Abstraction provides a simple action while hiding its smaller steps. Inheritance lets a child class reuse or extend a parent class. Polymorphism lets different kinds of objects respond to the same method call in their own way.',
      scenario:'In a game, I might use a general Character class with more specific Player and Enemy classes. Each can share common behavior and still have its own actions.',
      watch:'Do not treat the four ideas as synonyms. In Python, a leading underscore marks an internal detail by convention, but it does not lock the value away.'
    },
    'py-conditionals': {
      definition:'An `if` statement asks a True-or-False question and runs the matching indented steps.',
      why:'It lets code follow business rules, such as marking a sale as meeting a target.',
      parts:[['if sales >= 1000:','Check whether sales are at least 1,000.'],['    status = "Target met"','Run this indented line when the check is True.'],['else:','Choose this branch when the check is False.']],
      walkthrough:['Python checks whether `1250 >= 1000`; the answer is `True`.','Because the check is True, Python sets `status` to `"Target met"`.','If sales were below 1,000, Python would use the `else` branch instead.'],
      answer:'An `if` statement checks a condition. Python runs its indented block when the answer is True and uses `else` when it is False.',
      scenario:'I would check values just below, exactly at, and just above the target to make sure the rule handles the boundary correctly.',
      watch:'Use `==` to compare values. A single `=` assigns a value. Indentation shows which lines belong to each branch.'
    },
    'py-loops': {
      definition:'A `for` loop takes each item from a group in turn and runs the indented steps once for that item.',
      why:'A loop can perform the same action for every region or row without copying the same code many times.',
      parts:[['for region in regions:','Take one item at a time from `regions` and call it `region`.'],['    print(region)','Run this line once for the current item.']],
      walkthrough:['The list contains `"North"` and `"South"`.','On the first pass, `region` is `"North"` and Python prints it.','On the second pass, `region` is `"South"` and Python prints it.','The loop ends when there are no more items.'],
      answer:'A `for` loop goes through a group one item at a time and runs its body for each item. I use it when I want to do the same task for every item.',
      scenario:'To total a list of sales, I would start a total at zero, add each sale inside the loop, and check the final total.',
      watch:'The loop body is indented. Avoid changing the group you are going through unless you have a clear reason.'
    },
    'py-while-loops': {
      definition:'A `while` loop checks a condition before each turn. It repeats its indented steps while the answer is True.',
      why:'Use it when the loop should stop after something happens, rather than after a fixed number of items.',
      parts:[['while index < len(sales):','Keep going while `index` is a valid position in the list.'],['sales[index]','Get the current item.'],['index += 1','Add one to the position so the next turn moves forward.']],
      walkthrough:['Start with `index = 0`, the first list position.','Check `index < len(sales)` before each turn.','Print the item at that position, then add one to `index`.','When `index` reaches 3, the condition is False and the loop stops.'],
      answer:'A `while` loop repeats while its condition is True. I set up a stopping condition and update the value it checks, so the loop eventually ends.',
      scenario:'To process a list, I would start an index at zero, continue while it is less than the list length, process that item, and increase the index.',
      watch:'If the loop never changes a value used by its condition, it may never stop. Use `< len(items)` so the index never goes past the final item.'
    },
    'py-range': {
      definition:'`range()` gives a loop a count of whole numbers. It includes the start number but stops before the stop number.',
      why:'It is useful when you need to repeat something a set number of times or use numbered positions.',
      parts:[['range(start, stop, step)','Start at `start`, move by `step`, and stop before `stop`.'],['range(1, 5)','Gives 1, 2, 3 and 4; it does not include 5.']],
      walkthrough:['The start is 1 and the stop is 5.','The default step is 1, so the numbers increase by one.','The result is `1, 2, 3, 4`; 5 is left out.'],
      answer:'`range(start, stop, step)` creates a count of numbers. The stop number is not included, which is why `range(1, 5)` gives 1 through 4.',
      scenario:'I would check the first and last numbers I expect, remembering that the stop value is left out.',
      watch:'`range(5)` starts at 0 and gives 0 through 4, not 1 through 5.'
    },
    'py-comprehensions': {
      definition:'A list comprehension makes a new list by changing items from another group or keeping only items that pass a check.',
      why:'It is a short way to build a list when each output follows the same simple rule.',
      parts:[['value * 2','The value to put in the new list.'],['for value in values','Take each value from the old list.'],['if value > 0','Keep only values greater than zero.']],
      walkthrough:['Python takes each number from `values`.','It checks `value > 0`; negative numbers are skipped.','It doubles each kept number and puts it in the new list.','For `[-2, 2, 3]`, the result is `[4, 6]`.'],
      answer:'A list comprehension builds a new list from an existing group. It can change each item and can include a check to skip items.',
      scenario:'I would use one when the rule is short and easy to read. If the rule needs several steps, I would use a regular loop.',
      watch:'Do not put many actions into a comprehension just to make it shorter; clear code is easier to check.'
    },
    'py-functions': {
      definition:'A function is a named set of steps. You can run it by calling its name and give it values to work with.',
      why:'A function lets you write a useful calculation once and use it in several places.',
      parts:[['def profit(revenue, cost):','Create a function named `profit` with two inputs.'],['return revenue - cost','Send the difference back as the function result.'],['profit(100, 60)','Run the function with revenue 100 and cost 60.']],
      walkthrough:['`def` starts the function definition.','`revenue` and `cost` receive the two values passed in.','`return` sends back `revenue - cost`, which is 40 for these inputs.'],
      answer:'A function is a named set of steps that can take inputs and return a result. It helps me reuse a calculation and keep the code in one place.',
      scenario:'I would put a repeated calculation in a function, name its inputs clearly, return the result, and test it with known values.',
      watch:'`return` sends a value back. `print` only displays it; it does not give the result back to other code.'
    },
    'py-parameters': {
      definition:'A parameter is an input name in a function. An argument is the value you give that input when you call the function.',
      why:'Inputs let the same function work with different values. A default value is used when you leave that input out.',
      parts:[['def rate(part, total=1):','`part` is required; `total` uses 1 if no value is given.'],['rate(25, 100)','Give 25 to `part` and 100 to `total`.'],['rate(25)','Give 25 to `part`; use the default total of 1.']],
      walkthrough:['The function expects a `part` value.','The `total` input has a default value of 1.','Calling `rate(25, 100)` divides 25 by 100 and returns `0.25`.'],
      answer:'A parameter is a name in a function definition. An argument is the value passed to that name when the function runs. Defaults make some inputs optional.',
      scenario:'I would make required inputs clear, provide a default only when it is sensible, and test calls both with and without that optional value.',
      watch:'Put parameters without defaults before parameters with defaults.'
    },
    'py-modules': {
      definition:'A module is a Python file that contains tools. `import` makes those tools available to your code.',
      why:'Modules let you use existing tools for tasks such as working with dates, tables and charts.',
      parts:[['import math','Load the `math` module.'],['math.sqrt(25)','Use its square-root tool on 25.'],['import pandas as pd','Load Pandas and use the short name `pd`.']],
      walkthrough:['`import math` makes the module available.','`math.sqrt(25)` calls its square-root tool.','The answer is `5.0`.'],
      answer:'A module is a file of Python tools. I use `import` to load it, then use the module name to access its tools. A short name such as `pd` is an alias.',
      scenario:'I would import the library I need, use its usual short name if there is one, and confirm it is installed if Python cannot find it.',
      watch:'Writing an import does not install a missing library. Install it in the environment where the code will run.'
    },
    'py-exceptions': {
      definition:'An exception is an error that happens while code runs. `try` and `except` let you respond to a specific error.',
      why:'Files can contain missing or unexpected values. Handling a known problem clearly is better than letting it stop an entire analysis without explanation.',
      parts:[['try:','Run the lines that might cause the expected error.'],['except ValueError:','Run this block only if converting the text raises a `ValueError`.'],['quantity = None','Use a clear missing value when the text is not a valid number.']],
      walkthrough:['The text `"twelve"` cannot be changed into an integer.','Python raises a `ValueError` inside the `try` block.','The matching `except` block sets `quantity` to `None`.','The final line displays `None`.'],
      answer:'I use `try` for a step that may raise a known error, then `except` for that specific error. This lets me handle bad input without hiding unrelated problems.',
      scenario:'I would handle the expected conversion error, record or inspect the bad values, and avoid catching every possible error without a clear reason.',
      watch:'Do not use a broad `except` that hides unexpected problems. Catch the error you know how to handle.'
    },
    'numpy-intro': {
      definition:'NumPy is a Python tool for storing groups of numbers and calculating on many numbers at once.',
      why:'It is useful when a calculation needs to be applied to many values, and it is used by other data tools too.',
      parts:[['import numpy as np','Load NumPy and give it the short name `np`.'],['np.array([10, 20, 30])','Put the values into a NumPy array.'],['values * 2','Multiply every value in the array by 2.']],
      walkthrough:['Import NumPy as `np`.','Put 10, 20 and 30 into one array.','Multiplying the array by 2 gives `[20, 40, 60]`.'],
      answer:'NumPy is a Python library for working with groups of numbers. Its arrays let me apply a calculation to many values at once.',
      scenario:'I would put the numbers into an array, check its shape and type, then test the calculation on a small set of known values.',
      watch:'NumPy arrays usually hold one kind of value. Check the values and shape before combining arrays.'
    },
    'numpy-arrays': {
      definition:'A NumPy array is an ordered group of values that NumPy can calculate on together.',
      why:'Arrays make it easier to store and calculate with columns of numbers.',
      parts:[['np.array([...])','Make an array from values you already have.'],['np.zeros((2, 2))','Make an array with two rows and two columns, filled with zero.'],['np.arange(1, 4)','Make 1, 2 and 3; stop before 4.']],
      walkthrough:['`arange` starts at 1.','It adds 1 each time by default.','It stops before 4, so the array contains `[1, 2, 3]`.'],
      answer:'I can make an array from a list of values or use helpers such as `zeros` and `arange`. I check the number of values and their arrangement.',
      scenario:'I would choose an array shape that matches the data I need and check the first few values before using it in a calculation.',
      watch:'`arange` does not include its stop value. Use `np.zeros((2, 2))` for two rows and two columns, not `np.zeros(2, 2)`.'
    },
    'numpy-shapes': {
      definition:'An array shape tells how many values it has in each direction. For a table, the shape is rows first, then columns.',
      why:'Matching shapes help you catch problems before you combine or calculate with arrays.',
      parts:[['matrix.shape','Show the size in each direction.'],['matrix.ndim','Show how many directions the array has.'],['matrix.size','Show the total number of values.']],
      walkthrough:['The example has two rows.','Each row has three values, so it has three columns.','Its shape is `(2, 3)` and it has 2 directions.'],
      answer:'The shape tells the size of an array in each direction. For example, `(2, 3)` means two rows and three columns. I check shapes before combining arrays.',
      scenario:'If an operation fails because shapes do not match, I would print both shapes and check which direction is different.',
      watch:'The first number is the row count and the second is the column count.'
    },
    'numpy-indexing': {
      definition:'Indexing picks a value by its position. NumPy starts counting at zero; in a table, the row position comes before the column position.',
      why:'Choosing the correct row and column is essential when you need a precise part of an array.',
      parts:[['matrix[0, 1]','Choose row 0, then column 1: the value 2.'],['matrix[:, 0]','Choose every row (`:`) from column 0.'],['matrix[0:2, :]','Choose rows 0 and 1 and every column.']],
      walkthrough:['The first row is at position 0; the second is at position 1.','The first column is at position 0; the second is at position 1.','So `matrix[0, 1]` gives `2`.','A colon means “take all positions” in that direction.'],
      answer:'NumPy uses positions that start at zero. For a two-direction array, I write the row choice first and the column choice second.',
      scenario:'I would check the array shape and verify the first row and column before selecting positions from a larger array.',
      watch:'A slice includes its start and leaves out its stop. The colon `:` means all values in that direction.'
    },
    'numpy-vectorization': {
      definition:'Vectorization means writing one array calculation that NumPy applies to every value.',
      why:'This is shorter and often faster than writing a loop just to repeat the same number calculation.',
      parts:[['prices * 1.1','Multiply each price by 1.1, which increases it by 10%.'],['scores - 5','Subtract 5 from every score.'],['values > 10','Compare every value and get True-or-False answers.']],
      walkthrough:['The array contains 10, 20 and 30.','NumPy multiplies each value by 1.1.','The result is `[11.0, 22.0, 33.0]`.'],
      answer:'Vectorization lets NumPy apply the same calculation to every array value at once. It keeps repeated number calculations short and clear.',
      scenario:'I would check that the calculation applies to every intended value and that the units still make sense afterward.',
      watch:'Python `and` does not combine NumPy arrays element by element. Use NumPy comparisons and operators such as `&` when that is what you need.'
    },
    'numpy-aggregation': {
      definition:'A summary calculation turns many values into a shorter answer, such as a total, average, smallest value or largest value.',
      why:'Summaries help you quickly compare values and check whether a dataset looks reasonable.',
      parts:[['np.sum(values)','Add all the values.'],['np.mean(values)','Find the average.'],['np.min(values)','Find the smallest value.'],['np.max(values)','Find the largest value.']],
      walkthrough:['The values are 10, 20 and 30.','Their total is 60.','There are three values, so the average is 60 divided by 3: 20.'],
      answer:'NumPy summary functions such as `sum`, `mean`, `min` and `max` turn an array into a useful number. I choose the summary that answers the question.',
      scenario:'I would check whether missing or unusual values should be included and say whether I am reporting a total, average or another summary.',
      watch:'For a two-direction array, specify which direction to summarize when you need a result for each row or column.'
    },
    'numpy-broadcasting': {
      definition:'Broadcasting lets NumPy use a smaller array in a calculation with a larger array when their sizes line up.',
      why:'It lets you add or adjust a set of column values across many rows without copying those values by hand.',
      parts:[['matrix.shape','The larger example has shape `(2, 3)`: two rows and three columns.'],['offset.shape','The offset has shape `(3,)`: one value for each column.'],['matrix + offset','Add each offset to the value in the matching column.']],
      walkthrough:['The matrix has two rows and three columns.','The offset has three values, one for each column.','NumPy adds the same three offsets to both rows.'],
      answer:'Broadcasting lets NumPy use a smaller array in a larger calculation when their shapes line up. I check the shapes, especially the last number in each shape.',
      scenario:'If broadcasting gives a shape error, I would compare the two shapes from right to left and confirm that sizes are equal or one of them is 1.',
      watch:'Different shapes do not always work together. Check the shapes instead of assuming NumPy will match them as intended.'
    },
    'pandas-intro': {
      definition:'Pandas is a Python tool for working with data in named rows and columns.',
      why:'It helps you open tables, choose rows, clean values, group records and join related tables.',
      parts:[['import pandas as pd','Load Pandas and use the short name `pd`.'],['pd.DataFrame({...})','Make a table from named columns and their values.'],['df["sales"]','Choose the `sales` column.']],
      walkthrough:['Import Pandas as `pd`.','The dictionary key `"sales"` becomes a column name.','The list `[120, 180]` becomes the values in that column.'],
      answer:'Pandas is a Python library for working with data tables. Its main table type is called a DataFrame, and its single-column type is called a Series.',
      scenario:'I would load the data into a DataFrame, inspect its rows and columns, then clean and analyze the table using clear steps.',
      watch:'A DataFrame is a table with labels, not just a plain list. Check its column names before selecting a column.'
    },
    'pandas-series-dataframe': {
      definition:'A Series is one named column of values. A DataFrame is a table that can hold several named columns.',
      why:'Knowing the difference helps you select and combine data without losing track of column names.',
      parts:[['df["sales"]','Select one column; the result is a Series.'],['df[["sales"]]','Select one column but keep the result as a DataFrame.'],['df.shape','Get the row and column counts.']],
      walkthrough:['The DataFrame contains a `sales` column.','Selecting it with one pair of brackets returns a Series.','Pandas keeps row labels, which it uses to line up values when columns are combined.'],
      answer:'A Series is one labelled column. A DataFrame is a table of labelled columns. Selecting one column with `df["sales"]` returns a Series.',
      scenario:'I would check whether a step needs one column or a full table, and check row labels if I combine Series.',
      watch:'`df["sales"]` returns a Series; `df[["sales"]]` returns a DataFrame with one column.'
    },
    'pandas-read-files': {
      definition:'Pandas can read common table files, such as CSV and Excel, into a DataFrame.',
      why:'Reading a file with code makes the same loading steps easy to repeat and avoids manual copying.',
      parts:[['pd.read_csv("sales.csv")','Open a comma-separated text file.'],['pd.read_excel("sales.xlsx", sheet_name="Orders")','Open the named sheet in an Excel file.'],['parse_dates=[...]','Ask Pandas to read named columns as dates.']],
      walkthrough:['Give the file name to `read_csv`.','Pandas reads the heading row as column names and the remaining rows as data.','Store the result in `df`, then inspect it to check that the file was read as expected.'],
      answer:'I use `read_csv` for CSV files and `read_excel` for Excel files. After loading, I check the rows, column names, types and file settings.',
      scenario:'If the file loads but values look wrong, I would check the file path, separator, text encoding, sheet name and date settings.',
      watch:'A file can open successfully and still have the wrong column types or separators. Always inspect the loaded table.'
    },
    'pandas-export-files': {
      definition:'Exporting means saving a DataFrame to a file such as CSV or Excel.',
      why:'A saved file lets another person open the results, and code makes the same export repeatable.',
      parts:[['df.to_csv("cleaned_sales.csv", index=False)','Save the table as CSV without adding the row labels as a column.'],['df.to_excel("sales_summary.xlsx", sheet_name="Summary", index=False)','Save the table as an Excel sheet without the row labels.'],['index=False','Leave out the DataFrame index unless you need it as part of the output.']],
      walkthrough:['Choose the DataFrame to save and give the output file a name.','Use `to_csv` for a CSV or `to_excel` for an Excel workbook.','Use `index=False` when row labels are not part of the data.','Open or reload the file and check the path, headers and row count.'],
      answer:'I use `to_csv` or `to_excel` to save a DataFrame. I usually pass `index=False` so Pandas does not add its row labels as an extra column, then check the saved file.',
      scenario:'Before sharing an export, I would confirm the output path and format, make sure it contains the intended rows and columns, and avoid overwriting the original input file.',
      watch:'Excel export may require the optional `openpyxl` package. CSV and Excel files do not preserve every DataFrame feature or data type.'
    },
    'pandas-inspect': {
      definition:'Inspecting a DataFrame means checking its size, column names, value types and a sample of its rows.',
      why:'These checks can reveal missing values, wrong types and unexpected values before they affect your answers.',
      parts:[['df.head()','Show the first five rows by default.'],['df.shape','Show the number of rows and columns.'],['df.info()','Show column names, value types and non-empty counts.'],['df.describe()','Show common number summaries.']],
      walkthrough:['Use `head()` to see what the rows look like.','Use `shape` to learn the table size.','Use `info()` to check types and blank values.','Use `describe()` for a quick number summary.'],
      answer:'I inspect a table before changing it. `head` shows rows, `shape` shows its size, `info` shows types and non-empty counts, and `describe` gives number summaries.',
      scenario:'I would compare the table shape with what I expect, inspect example rows, and check types and missing values before calculating.',
      watch:'`describe()` alone does not explain every problem. Check the actual rows, types and blank values too.'
    },
    'pandas-select-filter': {
      definition:'Selecting chooses columns. Filtering keeps only rows that match a True-or-False rule.',
      why:'Working with just the columns and rows needed for a question makes the result easier to understand.',
      parts:[['df[["region", "sales"]]','Keep the named columns.'],['df["sales"] > 1000','Check each row and get True or False.'],['df[df["sales"] > 1000]','Keep rows where the check is True.']],
      walkthrough:['First, compare each sales value with 1,000.','Pandas makes one True-or-False answer for each row.','The outer selection keeps only rows whose answer is True.'],
      answer:'I select columns by their names and filter rows with a True-or-False check. The filter keeps rows where the check is True.',
      scenario:'For West-region sales above 1,000, I would put each comparison in parentheses and join the checks with `&`.',
      watch:'Use `&` between Pandas column checks, not Python `and`. Put parentheses around each comparison.'
    },
    'pandas-loc-iloc': {
      definition:'Use `loc` when choosing rows or columns by label. Use `iloc` when choosing them by numbered position.',
      why:'Being clear about labels or positions helps you select the intended part of a table.',
      parts:[['df.loc[row_labels, column_labels]','Choose using row and column names.'],['df.iloc[row_positions, column_positions]','Choose using row and column numbers starting at zero.'],[':','Select every row or column in that position.']],
      walkthrough:['The row choice goes before the comma.','The column choice goes after the comma.','With `loc`, those choices are labels; with `iloc`, they are number positions.'],
      answer:'`loc` selects rows and columns by labels, while `iloc` selects them by numbered positions. I use the one that matches how I want to identify the data.',
      scenario:'If I need West rows and the sales column, I would use `loc` with a row check and the column name.',
      watch:'With `iloc`, a slice stops before the ending position. With `loc`, label slices can include the ending label.'
    },
    'pandas-missing-values': {
      definition:'A missing value is a blank or unknown entry in a table.',
      why:'Missing values can change totals and averages, so decide how to handle them based on what the blank means.',
      parts:[['df.isna()','Mark each missing cell as True.'],['df.isna().sum()','Count missing cells in each column.'],['fillna(value)','Replace missing cells with a chosen value.'],['dropna()','Remove rows or columns that contain missing values.']],
      walkthrough:['`isna()` checks every cell.','`sum()` counts the True answers in each column.','Review the counts and decide whether to fill or remove missing values.'],
      answer:'I first count and inspect missing values. Then I choose whether to fill or remove them based on what the missing value means, and check how that choice changes the results.',
      scenario:'Before filling missing sales with zero, I would find out whether a blank means no sale or simply missing information.',
      watch:'Zero and missing are not always the same thing. Do not replace every blank with zero without checking its meaning.'
    },
    'pandas-duplicates': {
      definition:'A duplicate is a row or record that repeats another one under a rule you choose.',
      why:'Repeated records can make counts and totals too large.',
      parts:[['df.duplicated()','Mark rows that repeat earlier rows.'],['df.duplicated(subset=["order_id"])','Check repeats using the order ID only.'],['df.drop_duplicates(...)','Keep one row from each duplicate group.']],
      walkthrough:['Choose what makes a record a duplicate, such as a repeated order ID.','Count or inspect the matching rows before removing anything.','Remove duplicates only after deciding which copy to keep.'],
      answer:'I define what counts as a duplicate using the business key, inspect the repeated rows, decide which record to keep, then check the totals again.',
      scenario:'If an order ID appears twice with different sales values, I would investigate the records instead of deleting one automatically.',
      watch:'Checking all columns may miss records that share the same ID but differ in another field. Choose the duplicate key carefully.'
    },
    'pandas-dtypes': {
      definition:'A data type tells Pandas whether a column contains numbers, text, dates or another kind of value.',
      why:'The right type is needed for correct sorting, calculations and date-based analysis.',
      parts:[['df.dtypes','Show the type of each column.'],['pd.to_numeric(..., errors="coerce")','Convert valid values to numbers and mark invalid text as missing.'],['astype("string")','Treat existing values as text, such as customer IDs.'],['dtype={"customer_id": "string"}','Read an ID column as text so leading zeros are not lost.']],
      walkthrough:['Check the column type before calculating with it.','Convert number text with `to_numeric` when that column should hold numbers.','Review values that became missing because they were not valid numbers.'],
      answer:'A data type tells Pandas what kind of value a column holds. I check types after loading files and convert carefully so numbers, dates and IDs are handled correctly.',
      scenario:'If an ID contains leading zeros, I would read that column as text when loading the file. If a sales column contains number text, I would convert it and inspect invalid entries.',
      watch:'If Pandas already read "0042" as the number 42, changing it back to text cannot restore the lost zeros. Read IDs as text when loading the file.'
    },
    'pandas-create-columns': {
      definition:'A new column can be calculated from values in columns that are already in the table.',
      why:'Calculated columns provide useful measures, such as profit or order value, using the same rule for every row.',
      parts:[['df["profit"] = ...','Create a new column named `profit`.'],['df["sales"] - df["cost"]','Subtract the cost from the sales value in each row.'],['df["margin"] = df["profit"] / df["sales"]','Divide each row’s profit by its sales value.']],
      walkthrough:['Pandas lines up sales and cost values for each row.','It subtracts cost from sales for every row.','The answers are stored in the new `profit` column.'],
      answer:'I create a column by assigning a calculation to a new column name. Pandas applies the calculation row by row, and I check units and special cases such as zero sales.',
      scenario:'To calculate profit margin, I would subtract cost from sales, divide by sales, and decide what to do when sales is zero.',
      watch:'Check for zero before dividing and make sure both input columns use the same units.'
    },
    'pandas-string-methods': {
      definition:'The `.str` tool applies a text action to every value in a Pandas column.',
      why:'Cleaning spaces and letter case helps values that mean the same thing appear under one group.',
      parts:[['df["region"].str.strip()','Remove spaces at the start and end of each value.'],['.str.lower()','Change each text value to lowercase.'],['.str.contains("an", na=False)','Check for text and treat missing entries as not matching.']],
      walkthrough:['Pandas takes each value in the `region` column.','`.str.strip()` removes outside spaces.','`.str.title()` makes the first letter of each word uppercase.','The cleaned values are assigned back to the column.'],
      answer:'Pandas `.str` lets me apply text actions to a whole column. I can trim spaces, change letter case or look for matching text in each row.',
      scenario:'Before grouping regions, I would remove extra spaces, standardize letter case and compare the distinct labels.',
      watch:'Some text checks need a rule for missing values. Use options such as `na=False` when missing entries should count as no match.'
    },
    'pandas-regex': {
      definition:'A regular expression, or regex, is a pattern for checking or finding text.',
      why:'It can check that an ID follows a rule or extract a useful part from a longer text value.',
      parts:[['r"..."','A raw string keeps backslashes in the pattern as written.'],['^','Require a match at the start of the text.'],['\\d','Match a digit from 0 to 9.'],['{3}','Match exactly three of the previous item.'],['$','Require the match to end at the end of the text.'],['str.contains(...)','Check whether each value matches the pattern.']],
      walkthrough:['The pattern `^ORD-` requires the text to start with ORD-.','`\\d{3}` requires exactly three digits after the dash.','`$` requires the value to end immediately after those digits.','`na=False` makes a missing value count as not matching. Thus ORD-104 is True and bad is False.'],
      answer:'A regex is a text pattern. In `r"^ORD-\\d{3}$"`, `^` means start, `ORD-` is literal text, `\\d{3}` means exactly three digits, and `$` means end.',
      scenario:'I would write a pattern for a known ID format, try it on valid and invalid examples, and use `contains` to check or `extract` to pull out a matching part.',
      watch:'A pattern that is too loose can accept bad values; a pattern that is too strict can reject valid ones. Test both kinds before using it on a full column.'
    },
    'pandas-datetime': {
      definition:'A date or time type lets Pandas understand a value as a date instead of ordinary text.',
      why:'Correct dates can be sorted, grouped by month or year, and used to calculate time between events.',
      parts:[['pd.to_datetime(df["date"])','Turn date text into date values.'],['df["date"].dt.year','Get the year from each date.'],['df["date"].dt.month','Get the month number from each date.']],
      walkthrough:['The date column begins as text from the file.','`to_datetime` changes valid entries into date values.','`.dt.year` then reads the year from each date.'],
      answer:'I use `to_datetime` to turn date text into dates. Then `.dt` lets me use parts such as the year or month for sorting and grouping.',
      scenario:'I would parse the date column, check that invalid entries are visible, and confirm the date range before grouping by month.',
      watch:'Do not rely on sorting date strings unless you know they use a year-month-day format. Parse them as dates first.'
    },
    'pandas-time-series': {
      definition:'A time series is a set of values arranged by date or time.',
      why:'Grouping dates into weeks or months helps compare how a measure changes over time.',
      parts:[['set_index("date")','Use the parsed date column as the table index.'],['resample("MS")','Group a date index into month-start periods.'],['sum()','Add sales values within each month.'],['rolling(2).mean()','For each point, calculate the average across it and the previous point.']],
      walkthrough:['Convert the date column from text into Pandas dates before time grouping.','Set date as the index, because resample groups by a date index.','`"MS"` groups rows into month-start periods.','The sales values for January add to 2,000, February to 11,500 and March to 12,500.','A two-period rolling mean uses the current and previous month; the first result is missing because it has no previous month.'],
      answer:'I parse the dates, use them as the index, and call `resample` to group values into time periods. I choose sum, mean or another summary to match the question. A rolling calculation summarizes a fixed number of neighboring periods.',
      scenario:'For a monthly sales report, I would check that dates are valid and ordered, group by month, choose the right total or average, and verify that monthly totals match the source period.',
      watch:'A rolling window counts periods in the ordered series, not necessarily calendar days. Check for missing months and choose how empty periods should be handled.'
    },
    'pandas-sort': {
      definition:'Sorting puts rows in an order based on one or more columns.',
      why:'Sorting helps you review the largest values, most recent dates or top-ranked items.',
      parts:[['df.sort_values("sales")','Order rows by sales, smallest first by default.'],['ascending=False','Put the largest values first.'],['by=["region", "sales"]','Sort first by region, then by sales.']],
      walkthrough:['Choose the column that should determine the order.','Use `ascending=False` to put larger values first.','The rows move together, so their other column values stay with them.'],
      answer:'I use `sort_values` to order rows by a column. I choose ascending or descending order and check that rows, not just one column, are being sorted.',
      scenario:'To find the largest sales, I would sort sales in descending order and inspect the first rows.',
      watch:'Sort the full DataFrame so values in different columns stay on the correct rows.'
    },
    'pandas-groupby': {
      definition:'`groupby` puts rows with the same value into groups so you can calculate a result for each group.',
      why:'It answers questions such as total sales by region or average sales by month.',
      parts:[['df.groupby("region")','Make one group for each region.'],['["sales"].sum()','Add the sales values in each region.'],['.mean()','Find the average of non-missing sales values in each group.'],['.count()','Count non-missing values in the selected column for each group.'],['.size()','Count rows in each group, including rows with missing values.']],
      walkthrough:['Rows with the same region are placed together.','Pandas selects the sales values within each group.','`sum()` adds those values and returns one total for each region.'],
      answer:'I use `groupby` to split rows by a label, then apply a calculation such as sum or mean to each group. I state clearly what the result measures.',
      scenario:'For sales by region, I would group by region, sum sales, and check that the group totals add up to the overall total.',
      watch:'A sum, count and average answer different questions. Say which one you calculated.'
    },
    'pandas-merge': {
      definition:'Merging combines rows from two tables by matching values in one or more shared columns.',
      why:'It lets you add useful details, such as customer names, to a table of orders.',
      parts:[['on="customer_id"','Use the customer ID to match rows.'],['how="left"','Keep every row in the first table and add matches from the second.'],['how="inner"','Keep only rows with a match in both tables.']],
      walkthrough:['The orders table has a `customer_id` for each order.','The customer table has the same ID and a customer name.','A left merge keeps all orders and adds the matching name when one exists.'],
      answer:'I merge tables using a shared key column. I choose the join type based on which rows to keep and check for missing matches or unexpected row growth.',
      scenario:'Before merging orders with customers, I would check that customer IDs use the same format and whether the customer table has one row per ID.',
      watch:'Repeated keys on both sides can create extra rows. Check key uniqueness and row counts before and after the merge.'
    },
    'pandas-pivot': {
      definition:'A pivot table makes a summary with one group down the rows and another group across the columns.',
      why:'It makes it easier to compare a measure, such as sales, across two groups such as region and month.',
      parts:[['index="region"','Put each region on a separate row.'],['columns="month"','Put each month in a separate column.'],['values="sales"','Summarize the sales values in the cells.'],['aggfunc="sum"','Add values when more than one row fits a cell.']],
      walkthrough:['Each row is assigned to a region and month.','Those groups decide which pivot-table cell receives the row.','`aggfunc="sum"` adds sales when several rows belong in one cell.'],
      answer:'A pivot table summarizes values across row and column groups. I choose the groups, the value to summarize and the calculation, such as sum or average.',
      scenario:'I would check whether each cell should show a sum, count or average and compare the pivot totals with the source data.',
      watch:'If several source rows map to one cell, choose an aggregation rule. Do not assume the table will know what summary you want.'
    },
    'pandas-cleaning-workflow': {
      definition:'Data cleaning means finding and fixing data problems using clear rules, and keeping a record of what changed.',
      why:'A careful process prevents blank, repeated or wrongly formatted values from quietly changing a report.',
      parts:[['Inspect','Look at the rows, column types, missing values and repeated records.'],['Clean','Fix only problems you understand and can explain.'],['Check','Compare row counts, totals and key values before and after.']],
      walkthrough:['Start by looking at the table and identifying a specific issue.','Apply one clear fix, such as converting a number column or removing confirmed duplicates.','Check the result and record what changed.'],
      answer:'My cleaning steps are to inspect the data, fix known problems with clear rules, and check and record the changes. I do not remove values just because they look unusual.',
      scenario:'If I find blank sales values, I would find out what a blank means before choosing to fill it, remove it or leave it missing.',
      watch:'Keep a copy of the original data and write down why rows or values were changed.'
    },
    'pandas-data-validation': {
      definition:'Data validation checks that a table follows rules that are known to be correct for the data.',
      why:'Catching blank IDs, repeated keys or impossible amounts before a report prevents unreliable results.',
      parts:[['isna().any()','Check whether any required values are missing.'],['duplicated().any()','Check whether any key values repeat.'],['(df["sales"] < 0).any()','Check whether any sales values are negative.'],['raise ValueError("...")','Stop and show a message if a required rule fails.']],
      walkthrough:['Choose a rule based on what the column means.','The missing-ID check stops if even one order ID is blank.','The duplicate check verifies whether an order ID appears more than once.','The negative-sales check finds values that violate the example business rule.','A clear error message says what needs investigation instead of hiding the problem.'],
      answer:'I check required values, unique keys and business limits before analysis. If a rule fails, I stop with a clear message and investigate the source instead of silently dropping the record.',
      scenario:'Before reporting sales, I would check that order IDs are present and unique and that sales are in the expected range, then record any exceptions and their resolution.',
      watch:'Validation rules must come from the real business meaning. Negative values may be valid refunds in some datasets, so confirm the rule before rejecting them.'
    },
    'py-test-functions': {
      definition:'A test gives code a known input and checks that its result matches the expected answer.',
      why:'Tests let you check a calculation again whenever the code changes, using small examples with answers you already know.',
      parts:[['def test_profit():','Pytest finds a test function because its name starts with `test_`.'],['assert actual == expected','Fail the test if the two values do not match.'],['python -m pytest','Run pytest from the active Python environment.']],
      walkthrough:['Define the function you want to check, such as profit.','Write a test with a small input whose correct answer is easy to calculate.','The first assertion checks that 1,200 minus 700 is 500.','The second checks that equal sales and cost produce zero profit.','Run `python -m pytest`; pytest reports whether the checks pass.'],
      answer:'A test checks code with known inputs and expected outputs. I use pytest test functions that start with `test_` and `assert` statements to catch unexpected answers.',
      scenario:'For a profit calculation, I would test an ordinary case, a zero-profit case and any boundary or invalid-input case the function is expected to handle.',
      watch:'Pytest is not part of Python itself; install it in the same environment where you run the tests. A passing test only checks the cases you wrote.'
    },
    'pandas-text-cleaning': {
      definition:'Text cleaning makes written values use a consistent form, such as the same spaces, letter case and group names.',
      why:'If `"West"`, `"west"` and `" West "` are left different, one region can appear as three groups.',
      parts:[['.str.strip()','Remove extra spaces from the ends.'],['.str.lower()','Make all letters lowercase.'],['.replace(mapping)','Change known alternate labels to one chosen label.']],
      walkthrough:['Check the distinct values to find spelling, case or spacing differences.','Trim spaces and use a consistent letter case.','Map known alternate spellings to the agreed group name.','Check the distinct values again.'],
      answer:'I standardize text by trimming extra spaces, choosing consistent letter case, and mapping known spelling differences to one label. Then I check the unique values again.',
      scenario:'If `"web"`, `"Web"` and `" web "` all mean the same sales channel, I would standardize them and verify they now form one group.',
      watch:'Do not combine labels unless they have the same meaning. Keep a record of the mapping rule.'
    },
    'pandas-outliers': {
      definition:'An outlier is a value far from most of the other values or outside a known business rule.',
      why:'A few very high or low values can change averages and make charts harder to read.',
      parts:[['Sort the values','Look at the smallest and largest entries.'],['Compare with the source','Check whether an unusual value is a data-entry or unit problem.'],['Choose a rule','Keep, correct or exclude it only for a clear reason.']],
      walkthrough:['Sort sales to find unusually small or large values.','Compare each unusual value with its source and the business rules.','Decide whether it is a real event or an error before changing it.'],
      answer:'I flag values that are far from the rest, then check the source and business context. I do not remove an outlier just because it changes the average.',
      scenario:'If one sale is much larger than the others, I would confirm it in the source before deciding whether it is valid or a mistake.',
      watch:'An unusual value may be a real event. Do not delete it without checking its meaning and documenting the decision.'
    },
    'pandas-descriptive-stats': {
      definition:'Descriptive statistics are simple numbers that summarize a group of values.',
      why:'They help you understand typical values, how much values differ, and whether numbers look unusual.',
      parts:[['mean','Add the values and divide by how many values there are.'],['median','Put values in order and find the middle one.'],['standard deviation','Describe how spread out values are around the average.'],['quantile','Find a value that divides sorted data into parts.']],
      walkthrough:['The mean uses every value, so unusually large values can pull it upward.','The median is the middle value after sorting.','Compare both to see whether a few extreme values affect the average.'],
      answer:'The mean is the average; the median is the middle value after sorting. I compare summaries and check the data because unusual values can affect them differently.',
      scenario:'If the mean is much higher than the median, I would inspect the largest values before describing a typical result.',
      watch:'The mean can be pulled by extreme values. The median is often more useful for a typical value when the data has a long tail.'
    },
    'pandas-correlation': {
      definition:'Correlation is a number that describes whether two number columns tend to move together.',
      why:'It can help identify patterns worth checking more closely, but it does not tell you what caused them.',
      parts:[['df[["sales", "cost"]]','Choose the two number columns.'],['.corr()','Calculate how the columns move together.'],['-1 to 1','Values near 1 move together; near -1 move in opposite directions; near 0 show little straight-line pattern.']],
      walkthrough:['Choose the number columns to compare.','`.corr()` calculates a value for each pair.','Read the direction and strength, then check the number of rows and unusual values.'],
      answer:'Correlation describes the direction and strength of how two number columns move together. It does not prove that one causes the other.',
      scenario:'If sales and advertising spend are correlated, I would check the time period, other factors and number of records before making a claim.',
      watch:'A strong correlation does not prove cause and effect. Other factors may explain the pattern.'
    },
    'pandas-eda': {
      definition:'Exploring data means asking questions of a table, checking the answers and looking for problems or useful patterns.',
      why:'It helps you understand what the data contains before making a report or recommendation.',
      parts:[['Start with a question','Decide what you want to learn.'],['Summarize and compare','Use totals, averages, groups or charts that answer the question.'],['Check the result','Look for missing data, unusual values and other possible explanations.']],
      walkthrough:['Ask a clear question, such as which region has the highest sales.','Group or chart the values in a way that answers it.','Check sample size, missing values and unusual records before explaining the result.'],
      answer:'I explore data by checking its contents, making summaries and comparisons, and following up on patterns or problems. I check the evidence before making a recommendation.',
      scenario:'Before reporting that one region performs best, I would check its sales total, number of orders, time period and any unusual records.',
      watch:'A pattern in a small or incomplete sample may be misleading. Check what data was included.'
    },
    'python-matplotlib': {
      definition:'Matplotlib is a Python tool for drawing charts. Its `pyplot` commands make common chart types.',
      why:'A chart can make changes and comparisons easier to see than a list of numbers.',
      parts:[['plt.plot(months, sales)','Draw a line using one month and one sales value at each position.'],['plt.show()','Display the chart.'],['plt.title(...)','Add a title that tells the reader what the chart shows.']],
      walkthrough:['The `months` list supplies the horizontal positions.','The `sales` list supplies the values for those positions.','`plt.plot` draws the line; `plt.show()` displays it.'],
      answer:'Matplotlib is a Python charting library. I can use `pyplot` to create a chart, add labels, and show or save it.',
      scenario:'I would choose a chart that fits the question, check that x and y values match, label the chart and inspect it before sharing.',
      watch:'Each x value must line up with the y value at the same position.'
    },
    'python-bar-line': {
      definition:'A bar chart compares separate groups. A line chart shows how values change across an ordered sequence, often time.',
      why:'Choosing the chart that matches the question helps people read the comparison correctly.',
      parts:[['plt.bar(groups, values)','Draw one bar for each separate group.'],['plt.plot(times, values)','Connect values in their given order.'],['plt.xlabel(...)','Explain what the horizontal values represent.']],
      walkthrough:['Use bars when comparing regions or product groups.','Use a line when the order matters, such as month by month.','Label the chart so the reader knows what the values mean.'],
      answer:'I use a bar chart to compare separate groups and a line chart to show change across an order such as time. I label the chart and check that the chosen form matches the question.',
      scenario:'For monthly sales over a year, I would use a line chart and make sure the months are sorted in time order.',
      watch:'A line connects neighboring values, so do not use it for unrelated groups with no natural order.'
    },
    'python-distributions': {
      definition:'A histogram groups numbers into ranges and shows how many values fall in each range.',
      why:'It helps you see where values gather, how spread out they are and whether some values look unusual.',
      parts:[['plt.hist(values)','Draw a histogram of the values.'],['bins=5','Split the value range into five groups.'],['plt.show()','Display the chart.']],
      walkthrough:['The chart divides the sales range into bins.','It counts how many sales values fall in each bin.','Tall bars show ranges containing more values.'],
      answer:'A histogram groups numeric values into ranges and counts the values in each range. I use it to understand spread and look for gaps or unusual values.',
      scenario:'I would check the range and number of bins, then compare charts using the same bins if I am comparing groups.',
      watch:'Changing the number of bins can change how the shape looks. State the bin choice when it matters.'
    },
    'python-scatterplots': {
      definition:'A scatterplot uses one dot for each row, placed according to two number values from that row.',
      why:'It helps you see whether two values move together, form groups or include unusual pairs.',
      parts:[['plt.scatter(x, y)','Use one x and one y value for each dot.'],['alpha=0.5','Make dots partly see-through so overlapping dots are easier to notice.'],['plt.show()','Display the chart.']],
      walkthrough:['The sales value sets each dot’s left-to-right position.','The cost value sets its up-and-down position.','Each row becomes one dot, so groups and unusual values can be seen.'],
      answer:'A scatterplot shows the relationship between two number columns. Each dot is one row. It can reveal patterns, but a pattern alone does not prove cause.',
      scenario:'If two values appear related, I would inspect outliers, overlapping points, sample size and other factors before explaining the relationship.',
      watch:'If many dots overlap, the chart can hide how many rows are present. Use transparency or another view to check.'
    },
    'python-chart-labels': {
      definition:'Chart labels and titles explain what a chart shows. Saving a chart keeps it available for a report or presentation.',
      why:'A reader should be able to understand the chart without guessing what its values or units mean.',
      parts:[['plt.title(...)','Describe the main message or subject.'],['plt.xlabel(...) and plt.ylabel(...)','Name the values shown in each direction.'],['plt.savefig(..., dpi=150)','Save an image file; `dpi` controls image detail.']],
      walkthrough:['Add a title that says what is being compared.','Label both directions and include units where needed.','Save the figure after making sure the labels are visible.'],
      answer:'I add a clear title, labels with units, and a legend when needed. I check the saved image to make sure the text and chart are visible.',
      scenario:'Before sharing a chart, I would confirm the time period, units, labels and file name, then open the saved image to review it.',
      watch:'Save the figure before closing it, and use a tight layout so labels are not cut off.'
    },
    'seaborn-intro': {
      definition:'Seaborn is a Python tool for making common charts from table columns. It works with Pandas and uses Matplotlib underneath.',
      why:'You can often make a useful chart by naming the table and columns instead of preparing each point yourself.',
      parts:[['import seaborn as sns','Load Seaborn and use the short name `sns`.'],['sns.set_theme()','Set readable default chart styles.'],['data=df, x="sales"','Tell Seaborn which table and column to use.']],
      walkthrough:['Import Seaborn as `sns`.','Set a chart theme if you want consistent styles.','Give a chart function your DataFrame and the column names it needs.'],
      answer:'Seaborn is a Python charting tool that works well with Pandas tables. I use it for common charts and can use Matplotlib for more detailed control.',
      scenario:'I would choose a Seaborn chart based on the question, name the correct columns, and check the labels and scale.',
      watch:'Seaborn builds on Matplotlib; it does not replace Matplotlib or make chart choices correct automatically.'
    },
    'seaborn-distributions': {
      definition:'A distribution chart shows how number values are spread out. A histogram counts values in ranges; a smooth line estimates where they gather.',
      why:'It helps compare typical values, spread and unusual patterns between groups.',
      parts:[['sns.histplot(data=df, x="sales")','Count sales values in ranges.'],['bins=5','Choose five ranges for the histogram.'],['kde=True','Add a smooth estimated line.']],
      walkthrough:['Seaborn reads the `sales` values from the DataFrame.','The histogram groups values into ranges and counts them.','The smooth line estimates where values gather; it is not a count.'],
      answer:'A histogram counts values in ranges. A density curve is a smooth estimate of where values gather. I check the bins and remember the smooth line is only an estimate.',
      scenario:'To compare sales by group, I would use the same range and bin settings so the charts are easier to compare.',
      watch:'The height of a density curve is not the number of rows. Do not confuse it with the histogram count.'
    },
    'seaborn-categorical': {
      definition:'A category chart compares groups. `countplot` counts rows; `barplot` summarizes a number for each group.',
      why:'The chart makes it easier to compare regions, products or other named groups.',
      parts:[['sns.countplot(data=df, x="region")','Count rows in each region.'],['sns.barplot(data=df, x="region", y="sales")','Show a summary of sales for each region.'],['barplot default','Show the mean for each group unless you choose another summary.']],
      walkthrough:['Use `countplot` when the question is how many rows each group has.','Use `barplot` when the question is about a number such as sales.','By default, a barplot shows the average for each group.'],
      answer:'`countplot` counts rows in each group. `barplot` summarizes a number for each group, usually with the average by default. I state clearly which one the chart shows.',
      scenario:'If asked for total sales by region, I would not use the default barplot average; I would calculate or configure a sum.',
      watch:'A barplot does not automatically show a total. Check whether its bar is a count, average or another summary.'
    },
    'seaborn-relationships': {
      definition:'A relationship chart compares two number columns. Color can show a group, such as a region.',
      why:'It helps you notice whether values move together and whether groups look different.',
      parts:[['sns.scatterplot(...)','Draw one dot for each row.'],['x="sales", y="cost"','Choose the two number columns for dot positions.'],['hue="region"','Use a different color for each region.']],
      walkthrough:['Each row becomes a dot using its sales and cost values.','The `hue` setting colors the dot by region.','Look for groups or patterns, but do not treat a pattern as proof of cause.'],
      answer:'A scatterplot shows two number columns as dots. I can use `hue` to color a third group, then look for patterns while remembering that correlation does not prove cause.',
      scenario:'If the colors appear to form separate groups, I would check group sizes, overlapping dots and whether another factor could explain the pattern.',
      watch:'A visible link between two values does not prove that one caused the other.'
    },
    'seaborn-heatmaps': {
      definition:'A heatmap shows numbers as colored squares. It is useful for scanning a table of values, such as correlations between number columns.',
      why:'Color helps you compare many values quickly, while numbers printed in the squares show exact results.',
      parts:[['df[["sales", "cost"]].corr()','Make a table showing how the two number columns move together.'],['sns.heatmap(corr, annot=True)','Draw the values as colored squares and print each number.'],['vmin=-1, vmax=1','Keep the color scale fixed from -1 to 1.']],
      walkthrough:['Choose the number columns and calculate their correlations.','Pass that table to `heatmap`.','`annot=True` prints the numbers in the squares.','A fixed -1 to 1 scale makes colors comparable across charts.'],
      answer:'A heatmap uses color to display a table of numbers. For a correlation heatmap, I use a fixed -1 to 1 scale and remember correlation does not prove cause.',
      scenario:'Before comparing two heatmaps, I would make sure they use the same color scale and check the number of rows behind the correlations.',
      watch:'A color is not proof of a meaningful or causal result. Read the number and check the data behind it.'
    }
  };

  const GUIDES = {
    'py-intro':{code:'print("Hello, analyst!")',result:'Hello, analyst!',task:'Display the message Hello, analyst!',answer:'print(42)',explain:'print() displays the value you put inside its parentheses.'},
    'py-variables':{code:'revenue = 12500\ncost = 8200\nprofit = revenue - cost\nprint(profit)',result:'4300',task:'Store revenue and cost, then calculate profit.',answer:'units = 18',explain:'The name units now refers to the whole number 18. The = sign stores the value on its right under the name on its left.'},
    'py-types':{code:'amount = 19.5\nlabel = "Sales"\nactive = True\nprint(type(amount).__name__)\nprint(int("12"))',result:'float\n12',task:'Check the type of a decimal value and convert digit text to a whole number.',answer:'int("202")',explain:'int("202") changes the text "202" into the whole number 202. The quotation marks show that the starting value is text.'},
    'py-operators':{code:'revenue = 1200\ncost = 700\nprofit = revenue - cost\nprint(profit)\nprint(1200 >= 1000)',result:'500\nTrue',task:'Calculate profit and check whether revenue is at least 1,000.',answer:'profit = revenue - cost\nmeets_target = revenue >= 1000',explain:'Subtraction calculates 1,200 - 700 = 500. The >= comparison returns True because 1,200 is at least 1,000.'},
    'py-strings':{code:'region = "  NORTH "\nclean_region = region.strip().lower()\nprint(clean_region)',result:'north',task:'Remove the outside spaces from a region name and make its letters lowercase.',answer:'"Data Analyst".lower()',explain:'lower() returns a new string with its letters changed to lowercase. The result is "data analyst".'},
    'py-lists':{code:'values = [12, 18, 25]\nprint(values[0])\nprint(values[1:3])',result:'12\n[18, 25]',task:'Read the first value and then the last two values from a list.',answer:'months[-1]',explain:'The index -1 means the last item in a list, so months[-1] returns the final month.'},
    'py-tuples':{code:'record = ("Jan", 1200)\nmonth, sales = record\nprint(month)\nprint(sales)',result:'Jan\n1200',task:'Unpack a month and its sales amount from a tuple.',answer:'day, total = (3, 450)',explain:'Python assigns the first tuple item, 3, to day and the second item, 450, to total. This is called unpacking.'},
    'py-dictionaries':{code:'row = {"region": "West", "sales": 1250}\nprint(row["sales"])',result:'1250',task:'Look up the sales value in a dictionary using its key.',answer:'row["region"]',explain:'The square brackets look up a value by its key. Here, the key "region" gives the value "West".'},
    'py-dictionary-iteration':{code:'sales_by_region = {"North": 2700, "South": 13300}\nfor region, total in sales_by_region.items():\n    print(region, total)\nprint(sales_by_region.get("West", 0))',result:'North 2700\nSouth 13300\n0',task:'Print each region and total, then safely look up a region that may be missing.',answer:'sales_by_region["East"] = 400',explain:'Assigning a value to a dictionary key adds that key if it is new, or updates its value if it already exists.'},
    'py-sets':{code:'regions = {"North", "South", "North"}\nprint(len(regions))\nprint("West" in regions)',result:'2\nFalse',task:'Count unique regions and check whether West is in the set.',answer:'A & B',explain:'The & operator returns the intersection: the values that appear in both sets A and B.'},
    'py-oop-classes':{code:'class Dog:\n    pass\n\nfirst_dog = Dog()\nsecond_dog = Dog()\nprint(type(first_dog).__name__)\nprint(first_dog is second_dog)',result:'Dog\nFalse',task:'Create a class named Dog and make one object from it.',answer:'class Cat:\n    pass\n\nfirst_cat = Cat()\nsecond_cat = Cat()',explain:'Cat defines a class. Calling Cat() twice makes two separate objects from that class.'},
    'py-oop-attributes-methods':{code:'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} says Woof"\n\ndog = Dog("Rex")\nprint(dog.speak())',result:'Rex says Woof',task:'Make a Dog named Rex and display its spoken message.',answer:'dog = Dog("Bella")\nprint(dog.speak())',explain:'The new object stores Bella as its name. speak() uses that object’s name and returns "Bella says Woof".'},
    'py-oop-principles':{code:'class Account:\n    def __init__(self, balance):\n        self._balance = balance\n\n    def withdraw(self, amount):\n        if amount <= 0 or amount > self._balance:\n            return "Withdrawal not allowed"\n        self._balance -= amount\n        return self._balance\n\naccount = Account(100)\nprint(account.withdraw(30))',result:'70',task:'Use the Account class to withdraw 30 from a balance of 100 and show the new balance.',answer:'account.withdraw(30)',explain:'The method checks the withdrawal, subtracts 30 from the balance, and returns 70. The leading underscore signals that _balance is intended for internal use; it is not strict access protection. The worked examples below show each of the four ideas separately.'},
    'py-conditionals':{code:'sales = 1250\nif sales >= 1000:\n    status = "Target met"\nelse:\n    status = "Below target"\nprint(status)',result:'Target met',task:'Set a status based on whether sales meet the 1,000 target.',answer:'if score >= 80:\n    status = "High"\nelse:\n    status = "Review"',explain:'Python checks the condition, runs the indented if block when it is True, and otherwise runs else.'},
    'py-loops':{code:'regions = ["North", "South"]\nfor region in regions:\n    print(region)',result:'North\nSouth',task:'Print each region in a list using a for loop.',answer:'total = 0\nfor value in values:\n    total += value',explain:'The loop visits each list item in order and runs the indented body once for each item.'},
    'py-while-loops':{code:'sales = [120, 80, 150]\nindex = 0\nwhile index < len(sales):\n    print(sales[index])\n    index += 1',result:'120\n80\n150',task:'Use a while loop to print each value in the sales list.',answer:'index = 0\ntotal = 0\nwhile index < len(sales):\n    total += sales[index]\n    index += 1',explain:'Set index and total to 0 before the loop. Each pass adds one sales value to total and increases index so the loop reaches the end.'},
    'py-range':{code:'for number in range(1, 5):\n    print(number)',result:'1\n2\n3\n4',task:'Print the numbers from 1 up to, but not including, 5 with range().',answer:'list(range(2, 10, 2))',explain:'range(2, 10, 2) starts at 2, adds 2 each time and stops before 10, giving 2, 4, 6 and 8.'},
    'py-comprehensions':{code:'values = [-2, 2, 3]\ndoubled = [value * 2 for value in values if value > 0]\nprint(doubled)',result:'[4, 6]',task:'Make a new list by doubling only the positive values.',answer:'[name.upper() for name in names]',explain:'The expression name.upper() is evaluated for each name, creating a new list with uppercase versions.'},
    'py-functions':{code:'def profit(revenue, cost):\n    return revenue - cost\n\nprint(profit(100, 60))',result:'40',task:'Define and call a function that returns revenue minus cost.',answer:'def double(value):\n    return value * 2',explain:'double takes value as its input and returns value multiplied by 2.'},
    'py-parameters':{code:'def rate(part, total=1):\n    return part / total\n\nprint(rate(25, 100))',result:'0.25',task:'Call a function with two arguments to calculate 25 divided by 100.',answer:'def greet(name="Analyst"):\n    return f"Hello, {name}"',explain:'name is the parameter. If no name is supplied when greet() is called, it uses the default "Analyst".'},
    'py-modules':{code:'import math\nprint(math.sqrt(25))',result:'5.0',task:'Import the math module and use its square-root function.',answer:'import datetime as dt',explain:'import datetime as dt loads the datetime module and lets you refer to it by the shorter name dt.'},
    'py-exceptions':{code:'raw_value = "twelve"\ntry:\n    quantity = int(raw_value)\nexcept ValueError:\n    quantity = None\nprint(quantity)',result:'None',task:'Convert text to an integer and handle the error when the text is not a number.',answer:'try:\n    result = total / count\nexcept ZeroDivisionError:\n    print("Cannot divide by zero.")',explain:'ZeroDivisionError is raised when count is 0. The except block handles that case and shows a clear message.'},
    'py-test-functions':{code:'def profit(sales, cost):\n    return sales - cost\n\ndef test_profit():\n    assert profit(1200, 700) == 500\n    assert profit(800, 800) == 0',result:'Both expected profit checks pass when run with pytest.',task:'Write a test for a profit function using one normal example and one zero-profit example.',answer:'def test_profit():\n    assert profit(900, 400) == 500',explain:'The test checks that the function returns the expected value for this input. Pytest reports a failure if the actual and expected values differ.'},
    'numpy-intro':{code:'import numpy as np\nvalues = np.array([10, 20, 30])\nprint(values)',result:'[10 20 30]',task:'Import NumPy with the conventional alias np.',answer:'import numpy as np',explain:'import numpy loads the NumPy library. as np gives it the short name np, which is the common name used in examples.'},
    'numpy-arrays':{code:'values = np.arange(1, 4)\nprint(values)',result:'[1 2 3]',task:'Create a NumPy array containing the numbers 1, 2 and 3 with arange().',answer:'np.zeros((2, 2))',explain:'np.zeros((2, 2)) makes an array with 2 rows and 2 columns. Each of its four values is 0.'},
    'numpy-shapes':{code:'matrix = np.array([[1, 2, 3], [4, 5, 6]])\nprint(matrix.shape)\nprint(matrix.ndim)',result:'(2, 3)\n2',task:'Check the shape and number of dimensions of a two-row, three-column array.',answer:'(4, 2)',explain:'shape returns the row and column counts, giving (2, 3). ndim returns 2 because this array has rows and columns.'},
    'numpy-indexing':{code:'matrix = np.array([[1, 2], [3, 4]])\nprint(matrix[0, 1])\nprint(matrix[:, 0])',result:'2\n[1 3]',task:'Select the value in the first row and second column, then select the first column.',answer:'matrix[:, 1]',explain:'The colon means select every row. The 1 selects column position 1, which is the second column because positions start at 0.'},
    'numpy-vectorization':{code:'prices = np.array([10, 20, 30])\nprint(prices * 1.1)',result:'[11. 22. 33.]',task:'Increase every price in an array by 10 percent.',answer:'scores - 5',explain:'scores - 5 applies the subtraction to every value in the array and returns the adjusted values.'},
    'numpy-aggregation':{code:'values = np.array([10, 20, 30])\nprint(np.mean(values))\nprint(np.sum(values))',result:'20.0\n60',task:'Calculate the average and total of the values in a NumPy array.',answer:'np.min([8, 3, 11])',explain:'np.min(...) finds and returns the smallest value in the collection. Here, the smallest of 8, 3 and 11 is 3.'},
    'numpy-broadcasting':{code:'matrix = np.array([[1, 2, 3], [4, 5, 6]])\noffset = np.array([10, 20, 30])\nprint(matrix + offset)',result:'[[11 22 33]\n [14 25 36]]',task:'For an array with shape (4, 3), what length offset adds one value to each column?',answer:'An array with 3 values, such as np.array([10, 20, 30]).',explain:'The one-dimensional offset has length 3, matching the matrix columns, so NumPy adds it to each row.'},
    'pandas-intro':{code:'import pandas as pd\ndf = pd.DataFrame({"sales": [120, 180]})\nprint(df)',result:'   sales\n0    120\n1    180',task:'Create a DataFrame with one sales column containing 120 and 180.',answer:'import pandas as pd',explain:'import loads the pandas library so you can use its tools. as pd gives it the short name used throughout common Pandas examples.'},
    'pandas-series-dataframe':{code:'df = pd.DataFrame({"sales": [120, 180]})\nsales = df["sales"]\nprint(type(sales).__name__)',result:'Series',task:'Select the sales column from a DataFrame and check the selected object type.',answer:'pd.DataFrame({"sales": [120, 180], "region": ["East", "West"]})',explain:'The dictionary keys, "sales" and "region", become column names. Their equally sized lists provide the values for each row.'},
    'pandas-read-files':{code:'df = pd.read_csv("sales.csv")\nprint(df.head())',result:'A preview of the first five rows of sales.csv',task:'Read sales.csv into a DataFrame and preview its first five rows.',answer:'pd.read_csv("orders.csv", parse_dates=["order_date"])',explain:'read_csv loads a CSV into a DataFrame; parse_dates asks Pandas to convert the named date column.'},
    'pandas-export-files':{code:'df.to_csv("cleaned_sales.csv", index=False)\ndf.to_excel("sales_summary.xlsx", sheet_name="Summary", index=False)',result:'The CSV and Excel files are saved without an extra row-index column.',task:'Save cleaned_sales.csv and save a summary DataFrame as an Excel sheet named Summary, without adding row labels.',answer:'summary.to_excel("sales_summary.xlsx", sheet_name="Summary", index=False)',explain:'to_excel saves the DataFrame in the named sheet. index=False leaves out row labels that are not part of the table.'},
    'pandas-inspect':{code:'print(df.shape)\nprint(df.head())\ndf.info()',result:'The shape, first five rows, column types and non-missing counts are displayed.',task:'Inspect the table size, a few rows and the column types.',answer:'df.shape',explain:'shape gives row and column counts; head previews records; info reports column types and non-missing counts.'},
    'pandas-select-filter':{code:'west_orders = df.loc[(df["region"] == "West") & (df["sales"] > 1000), ["region", "sales"]]\nprint(west_orders)',result:'Only West rows with sales above 1,000 are shown, with region and sales columns.',task:'Keep West rows where sales exceed 1,000, and show the region and sales columns.',answer:'df[(df["region"] == "West") & (df["sales"] > 1000)]',explain:'Each comparison makes a True-or-False result for every row. & keeps a row only when both comparisons are True; put parentheses around each comparison.'},
    'pandas-loc-iloc':{code:'print(df.loc[0, "sales"])\nprint(df.iloc[0, 4])',result:'Both selections return 1,200, the sales value in the first sample row.',task:'Select the first order’s sales by row label, then select the same value by row and column position.',answer:'df.iloc[0:2, 1]',explain:'loc selects by labels; iloc selects by integer positions. In the sample table, sales is column position 4 because positions start at 0.'},
    'pandas-missing-values':{code:'print(df.isna().sum())\ndf["sales"] = df["sales"].fillna(df["sales"].median())',result:'Missing values are counted by column; missing sales are replaced with the sales median.',task:'Replace missing sales with the median sales value.',answer:'df["sales"] = df["sales"].fillna(df["sales"].median())',explain:'df["sales"].median() finds the middle non-missing sales value. fillna(...) puts that value in places where sales is missing.'},
    'pandas-duplicates':{code:'print(df.duplicated(subset=["order_id"]).sum())\ndf = df.drop_duplicates(subset=["order_id"])',result:'Duplicate order IDs are counted, then all but the first row for each ID are removed.',task:'Remove duplicates using order_id as the key.',answer:'df = df.drop_duplicates(subset=["order_id"])',explain:'subset chooses which columns define a duplicate. Confirm the key and which record to retain before dropping rows.'},
    'pandas-dtypes':{code:'df["sales"] = pd.to_numeric(df["sales"], errors="coerce")\nprint(df["sales"].dtype)',result:'A numeric dtype; invalid text is represented as missing.',task:'Convert the sales column to numbers and show its resulting type.',answer:'df["customer_id"] = df["customer_id"].astype("string")',explain:'astype("string") stores the current ID values as text. If a CSV could contain IDs such as "0042", read that column as text from the start with dtype={"customer_id": "string"} so Pandas does not remove the leading zeros.'},
    'pandas-create-columns':{code:'df["profit"] = df["sales"] - df["cost"]\ndf["margin"] = df["profit"] / df["sales"]',result:'Using the sample rows, profits are 500, 350, 650, 5,000 and 6,300. Margin ratios are about 0.417, 0.438, 0.433, 0.500 and 0.504 (41.7%, 43.8%, 43.3%, 50.0% and 50.4%).',task:'Create profit from sales minus cost, then calculate margin as profit divided by sales.',answer:'df["margin"] = df["profit"] / df["sales"]',explain:'Pandas applies arithmetic to matching rows. The formula divides each row’s profit by its sales; check that sales is not zero before calculating.'},
    'pandas-string-methods':{code:'df["region"] = df["region"].str.strip().str.title()\nprint(df["region"])',result:'Whitespace is removed and region names use title case.',task:'Remove outside spaces from region names and make them title case.',answer:'df["name"].str.contains("an", case=False, na=False)',explain:'str.contains("an", case=False) finds "an" in either upper- or lowercase. na=False makes missing names count as not matching.'},
    'pandas-regex':{code:'codes = pd.Series(["ORD-104", "bad"])\nprint(codes.str.contains(r"^ORD-\\d{3}$", na=False))',result:'0     True\n1    False\ndtype: bool',task:'Check which values have ORD- followed by exactly three digits.',answer:'codes.str.extract(r"(\\d+)")',explain:'The pattern in parentheses captures one or more digits. str.extract returns the captured text from each matching value.'},
    'pandas-datetime':{code:'df["date"] = pd.to_datetime(df["date"])\ndf["year"] = df["date"].dt.year',result:'The date column is parsed and year contains each date’s year.',task:'Parse the date column and add a column containing each date’s year.',answer:'pd.to_datetime(df["date"], errors="coerce")',explain:'pd.to_datetime changes date text into dates. errors="coerce" turns text that is not a valid date into a missing value instead of stopping with an error.'},
    'pandas-time-series':{code:'df["date"] = pd.to_datetime(df["date"])\nmonthly_sales = df.set_index("date")["sales"].resample("MS").sum()\nprint(monthly_sales)',result:'2026-01-01     2000\n2026-02-01    11500\n2026-03-01    12500\nFreq: MS, Name: sales, dtype: int64',task:'Add sales by month, with each month labelled at its start date.',answer:'monthly_sales.rolling(2).mean()',explain:'rolling(2) uses each month and the previous month. The first value is missing because there is no previous month in the series. The next two averages are 6,750 and 12,000.'},
    'pandas-sort':{code:'sorted_df = df.sort_values("sales", ascending=False)\nprint(sorted_df[["region", "sales"]])',result:'The order is South 12,500; West 10,000; North 1,500; North 1,200; South 800.',task:'Sort the rows by sales from highest to lowest and display region and sales.',answer:'df.sort_values(["region", "sales"], ascending=[True, False])',explain:'The column names set the sort order: region first, then sales. True sorts region A to Z; False sorts sales from highest to lowest.'},
    'pandas-groupby':{code:'totals = df.groupby("region", as_index=False)["sales"].sum()\nprint(totals)',result:'North sales total 2,700; South total 13,300; West total 10,000.',task:'Calculate the total sales for each region.',answer:'df.groupby("region").agg(avg_sales=("sales", "mean"), order_count=("order_id", "count"))',explain:'groupby("region") makes one group per region. agg then calculates average sales and counts non-missing order_id values in each group.'},
    'pandas-merge':{code:'result = orders.merge(customers, on="customer_id", how="left", validate="many_to_one")',result:'All order rows remain, with matching customer columns added.',task:'Join orders to customers, retaining every order and checking customer-key uniqueness.',answer:'orders.merge(customers, on="customer_id", how="left", validate="many_to_one")',explain:'A left join keeps all rows from orders. validate checks that each customer ID matches at most one customer row.'},
    'pandas-pivot':{code:'summary = pd.pivot_table(df, values="sales", index="region", columns="month", aggfunc="sum")\nprint(summary)',result:'Regions are rows and months are columns; cells show total sales, and region-month combinations with no rows are NaN by default.',task:'Summarize total sales with regions as rows and months as columns.',answer:'pd.pivot_table(df, values="sales", index="region", columns="month", aggfunc="sum", fill_value=0)',explain:'fill_value=0 puts 0 in empty cells of the summary. Use this only when an empty combination should mean zero sales.'},
    'pandas-cleaning-workflow':{code:'print(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())\nprint(df.duplicated().sum())',result:'The checks report dataset size, column types, missing-value counts and duplicate-row count.',task:'Add a check that counts fully duplicated rows.',answer:'df.duplicated().sum()',explain:'duplicated() marks each repeated full row as True. sum() counts those True values and gives the number of duplicate rows.'},
    'pandas-data-validation':{code:'if df["order_id"].isna().any():\n    raise ValueError("Order IDs cannot be blank")\nif df["order_id"].duplicated().any():\n    raise ValueError("Order IDs must be unique")\nif (df["sales"] < 0).any():\n    raise ValueError("Sales cannot be negative")\nprint("All checks passed")',result:'All checks pass for the sample table, so the output is All checks passed.',task:'Check that order IDs are present and unique and that sales are not negative before running a report.',answer:'if (df["sales"] < 0).any():\n    raise ValueError("Sales cannot be negative")',explain:'The comparison checks every sales value. If any value is negative, the program stops and explains which rule failed.'},
    'pandas-text-cleaning':{code:'df["channel_clean"] = df["channel"].str.strip().str.lower()\ndf["channel_clean"] = df["channel_clean"].replace({"web": "online"})',result:'Whitespace and case are standardized; the documented web label becomes online.',task:'Map "web" and "online" to one documented category after normalizing case and spaces.',answer:'clean = df["channel"].str.strip().str.lower().replace({"web": "online"})',explain:'strip() removes outside spaces, lower() makes the labels lowercase, and replace(...) changes the known label "web" to "online".'},
    'pandas-outliers':{code:'print(df["sales"].describe())\nreview = df.loc[df["sales"] > 10000]',result:'Summary statistics are displayed; O-105 with sales of 12,500 is the only sample row above 10,000.',task:'Review sales summary statistics and isolate records above 10,000 for checking.',answer:'(df["sales"] < 0).sum()',explain:'df["sales"] < 0 checks each sales value. sum() counts how many of those checks are True, giving the number of negative sales.'},
    'pandas-descriptive-stats':{code:'print(df["sales"].agg(["count", "mean", "median", "min", "max"]))',result:'For the sample, count is 5, mean is 5,200, median is 1,500, minimum is 800 and maximum is 12,500.',task:'Calculate both the mean and median of a sales column.',answer:'df["sales"].agg(["mean", "median"])',explain:'Mean is sensitive to extreme values; median is the middle value. Report sample size and missingness too.'},
    'pandas-correlation':{code:'print(df[["sales", "cost"]].corr())',result:'A correlation matrix shows pairwise linear correlations for sales and cost.',task:'Calculate the pairwise correlation between sales and cost.',answer:'Plot the two variables, inspect extreme points, then compare the correlation with and without verified anomalies.',explain:'Compare the relationship before and after checking extreme points. If it changes a lot, those points may be driving the pattern; investigate them before deciding what to report.'},
    'pandas-eda':{code:'summary = df.groupby("region")["sales"].agg(["count", "mean", "sum"])\nprint(summary)',result:'North: count 2, mean 1,350, total 2,700; South: count 2, mean 6,650, total 13,300; West: count 1, mean 10,000, total 10,000.',task:'Compare the sales count, average and total for each region.',answer:'df.groupby("region").size()',explain:'groupby("region") makes one group for each region. size() counts the rows in each group, so it gives the number of orders per region.'},
    'python-matplotlib':{code:'import matplotlib.pyplot as plt\nmonths = ["Jan", "Feb", "Mar"]\nsales = [1200, 1500, 900]\nplt.plot(months, sales)\nplt.show()',result:'A line chart displays the three monthly sales values.',task:'Draw a line chart of sales for January, February and March.',answer:'import matplotlib.pyplot as plt',explain:'import matplotlib.pyplot loads the pyplot charting tools. as plt gives them the short name commonly used in Python examples.'},
    'python-bar-line':{code:'totals = df.groupby("region")["sales"].sum()\nplt.bar(totals.index, totals.values)\nplt.show()',result:'Using the sample rows, total sales are North 2,700, South 13,300 and West 10,000.',task:'Compare total sales across regions using the sample data.',answer:'plt.plot(months, sales, marker="o")',explain:'Bars compare separate categories; a line emphasizes change across ordered values such as time.'},
    'python-distributions':{code:'plt.hist(df["sales"].dropna(), bins=5)\nplt.show()',result:'The histogram shows how many non-missing sales values fall into each of five intervals.',task:'Plot non-missing sales as a histogram using five bins.',answer:'plt.hist(df["sales"].dropna(), bins=10)',explain:'bins=10 divides the sales range into 10 intervals. Each bar shows how many sales values fall inside one interval.'},
    'python-scatterplots':{code:'plt.scatter(df["sales"], df["cost"], alpha=0.5)\nplt.show()',result:'Each point represents one row’s sales and cost values.',task:'Create a scatterplot of sales against cost with partially transparent points.',answer:'plt.scatter(df["sales"], df["cost"], alpha=0.5)',explain:'Each row becomes a point. Transparency helps reveal overlapping observations.'},
    'python-chart-labels':{code:'plt.title("Monthly sales")\nplt.xlabel("Month")\nplt.ylabel("Sales ($)")\nplt.tight_layout()\nplt.savefig("sales.png", dpi=150, bbox_inches="tight")',result:'The chart has a title and labelled axes, and it is saved as sales.png.',task:'Label the chart, adjust the layout and save the image as sales.png.',answer:'plt.savefig("sales.png", dpi=150, bbox_inches="tight")',explain:'savefig writes the current chart to sales.png. dpi=150 sets image detail, and bbox_inches="tight" helps keep labels inside the saved image.'},
    'seaborn-intro':{code:'import seaborn as sns\nsns.set_theme()',result:'Seaborn’s chart theme is applied.',task:'Import Seaborn and apply its default chart theme.',answer:'import seaborn as sns',explain:'import seaborn loads the library. as sns gives it the short name commonly used in examples.'},
    'seaborn-distributions':{code:'sns.histplot(data=df, x="sales", bins=5, kde=True)',result:'A histogram shows counts in five sales intervals, with a smooth density estimate.',task:'Plot sales as a histogram with five bins.',answer:'sns.histplot(data=df, x="sales", bins=5, kde=True)',explain:'data=df chooses the table, x="sales" chooses the column, and bins=5 divides the values into five ranges. kde=True adds a smooth estimated curve.'},
    'seaborn-categorical':{code:'sns.countplot(data=df, x="region")',result:'North and South each have 2 rows; West has 1 row.',task:'Compare the number of rows in each region with a count plot.',answer:'sns.barplot(data=df, x="region", y="sales")',explain:'x="region" makes one group for each region. y="sales" tells Seaborn which numbers to summarize; barplot shows their mean by default.'},
    'seaborn-relationships':{code:'sns.scatterplot(data=df, x="sales", y="cost", hue="region")',result:'Each point represents an order and its color identifies the region.',task:'Plot sales against cost and color points by region.',answer:'sns.scatterplot(data=df, x="sales", y="cost", hue="region")',explain:'data=df chooses the table, x and y choose the two number columns, and hue="region" gives each region a different color.'},
    'seaborn-heatmaps':{code:'corr = df[["sales", "cost"]].corr()\nsns.heatmap(corr, annot=True, vmin=-1, vmax=1, cmap="coolwarm")',result:'An annotated heatmap shows pairwise correlations on a consistent -1 to 1 scale.',task:'Create an annotated heatmap from a correlation matrix.',answer:'sns.heatmap(corr, annot=True, vmin=-1, vmax=1)',explain:'The correlation matrix contains pairwise associations; the fixed color scale makes colors comparable across charts.'}
  };

  DP.registerCourse(useSimpleEnglish({
    id:'python',
    title:'Python and Pandas',
    planned:TOPICS.reduce((count, topic) => count + topic.lessons.length, 0) + ' lessons',
    blurb:'Python basics, dictionaries and sets, object-oriented programming, NumPy, Pandas, regular expressions, data cleaning, time-series analysis, data checks and tests, file export, Matplotlib and Seaborn.',
    sections:TOPICS.map(topic => ({ title:topic.title, lessons:topic.lessons.map(lesson => lesson.id) }))
  }));

  const core = {};
  let lessonNumber = 0;
  const syntaxAlternatives = [
    'print(value)', 'len(values)', 'values[0]', 'for item in items:',
    'df.loc[rows, columns]', 'df.groupby("region")["sales"].sum()',
    'np.mean(values)', 'plt.plot(x_values, y_values)'
  ];
  TOPICS.forEach(topic => topic.lessons.forEach(s => {
    const guide = GUIDES[s.id];
    if (!guide) throw new Error('Missing Python teaching guide for lesson: ' + s.id);
    const tutor = TUTORING[s.id];
    if (!tutor) throw new Error('Missing beginner-friendly teaching notes for lesson: ' + s.id);
    const addQuestion = (q, answer, wrong, why, offset) => {
      const fallbackOptions = [
        'Use a fixed answer instead of calculating from the input.',
        'Keep every row without checking the rule.',
        'Change the original data before checking the result.',
        'Use a different column from the one named in the question.'
      ];
      const options = [answer].concat(wrong, fallbackOptions)
        .filter((option, index, all) => option && option !== answer || index === 0)
        .filter((option, index, all) => all.indexOf(option) === index)
        .slice(0, 4);
      const correctAt = (lessonNumber + offset) % options.length;
      options.splice(correctAt, 0, options.shift());
      return { q, o:options, a:correctAt, why };
    };
    const quiz = [
      addQuestion('Which statement best explains ' + s.title + '?', tutor.definition,
        [tutor.watch, s.mistake, 'It is useful only for this example and cannot be checked on new data.'],
        tutor.answer, 0),
      addQuestion('Which Python pattern is used in this lesson?', s.syntax,
        syntaxAlternatives.filter(x => x !== s.syntax),
        'The lesson pattern is:\n' + s.syntax, 1),
      addQuestion('Which code is the correct approach to this practice task?', guide.answer,
        [s.syntax, guide.code, 'Use an empty value instead of doing the requested calculation.'],
        guide.explain, 2),
      addQuestion('What does the worked example produce?', guide.result,
        ['No result is produced.', 'The operation always returns zero.', 'Python changes the source data automatically.'],
        tutor.walkthrough.join(' '), 3),
      addQuestion('Which practice makes this analysis more reliable?', s.safe,
        [s.mistake, 'Assume every input file is clean.', 'Skip checking the result.'],
        tutor.watch, 0)
    ];
    core[s.id] = {
      title:s.title, tagline:tutor.definition, prereq:s.prereq,
      whatTitle:'What this lesson covers',
      what:[tutor.definition].concat(TERM_NOTES[s.id] || []),
      why:[tutor.why],
      syntax:{ code:guide.code, parts:tutor.parts },
      points:[tutor.why, tutor.watch, 'Try the code with a small example and check the answer before using it on a full dataset.'],
      mistakes:[tutor.watch],
      example:{
        title:s.title + ': a worked example',
        scenario:tutor.scenario,
        table:SAMPLE_TABLES[s.id] ? T(SAMPLE_TABLES[s.id], 'Sample DataFrame') : undefined,
        table2:RELATED_TABLES[s.id] ? T(RELATED_TABLES[s.id], 'Lookup DataFrame') : undefined,
        task:guide.task,
        formula:guide.code,
        steps:tutor.walkthrough.concat(['Expected result: ' + guide.result]),
        result:guide.result
      },
      practice:{ q:s.practiceQ, hint:s.hint, solution:guide.answer, explain:guide.explain },
      interview:[
        { level:'Basic', q:'In simple terms, what is ' + s.title + '?', a:tutor.answer },
        { level:'Intermediate', q:'What is one common mistake to avoid with ' + s.title + '?', a:tutor.watch },
        { level:'Scenario', q:'How would you use or check this in a real analysis?', a:tutor.scenario }
      ],
      mcq:quiz,
      recap:[tutor.definition, tutor.answer, tutor.watch]
    };

    DEEP[s.id] = {
      level:lessonNumber < 16 ? 'Beginner' : lessonNumber < 39 ? 'Intermediate' : 'Applied',
      tldr:tutor.definition,
      intuition:{ text:[tutor.definition, tutor.why] },
      how:tutor.walkthrough,
      edge:[
        { t:'Watch for this', d:tutor.watch },
        { t:'In a real analysis', d:tutor.scenario }
      ],
      interviewPlus:[
        Q('Basic','Explain ' + s.title + ' to someone new to Python.',tutor.answer),
        Q('Scenario','How would you use or check this in a real analysis?',tutor.scenario)
      ],
      ref:RT(['Lesson note','Explanation'],[
        ...tutor.parts,
        ['Watch for',tutor.watch]
      ]),
      related:s.prereq.slice()
    };

    if (s.id === 'py-operators') {
      core[s.id] = {
        title:s.title,
        tagline:'Learn what each Python arithmetic, comparison and logical operator does, one symbol at a time.',
        prereq:s.prereq,
        whatTitle:'Three groups of operators',
        what:[
          '**Arithmetic operators** calculate with numbers.',
          '**Comparison operators** compare two values and produce `True` or `False`.',
          '**Logical operators** combine or reverse boolean conditions: `and`, `or` and `not`.'
        ],
        why:[
          'Operators let you calculate answers such as profit, percentage change and averages.',
          'They let you express clear rules for selecting records, such as sales above a target in one region.'
        ],
        syntax:{
          code:'Assignment:   =\nArithmetic:   +  -  *  /  //  %  **\nComparison:   ==  !=  >  <  >=  <=\nLogical:      and  or  not\nPandas rows:  &  |  ~',
          parts:[
            ['=','Assignment: store a value under a name. Example: `sales = 8` stores 8 as sales. It does not compare values.'],
            ['+','Addition: combines numbers. Example: 8 + 2 gives 10.'],
            ['-','Subtraction: finds the difference. Example: 8 - 2 gives 6.'],
            ['*','Multiplication: scales or multiplies values. Example: 8 * 2 gives 16.'],
            ['/','Division: returns a quotient as a float. Example: 7 / 2 gives 3.5.'],
            ['//','Whole-number division: count how many full times the right number fits into the left. Example: 7 // 2 gives 3.'],
            ['%','Remainder: show what is left after division. Example: 7 % 2 gives 1.'],
            ['**','Power: multiply a number by itself. Example: 2 ** 3 means 2 × 2 × 2 and gives 8.'],
            ['==','Equal to: `True` when the two values match.'],
            ['!=','Not equal to: `True` when the two values do not match.'],
            ['>','Greater than: `True` when the left value is larger.'],
            ['<','Less than: `True` when the left value is smaller.'],
            ['>=','Greater than or equal to: `True` when the left value is larger or the two values match.'],
            ['<=','Less than or equal to: `True` when the left value is smaller or the two values match.'],
            ['and','`True` only when both checks are `True`.'],
            ['or','`True` when at least one check is `True`.'],
            ['not','Changes a check to its opposite: `not True` is `False`; `not False` is `True`.'],
            ['&','For Pandas columns, both checks must match on a row. Example: `(sales > 10) & (region == "West")`.'],
            ['|','For Pandas columns, either check can match on a row. Example: `(sales > 10) | (region == "West")`.'],
            ['~','For Pandas columns, reverse each row’s answer. Example: `~(sales > 10)` selects rows where sales is 10 or less.']
          ]
        },
        compare:{
          headers:['Operator','Meaning','Example','Result'],
          rows:[
            ['+','Add','8 + 2','10'],['-','Subtract','8 - 2','6'],
            ['*','Multiply','8 * 2','16'],['/','Divide','7 / 2','3.5'],
            ['//','Floor divide','7 // 2','3'],['%','Remainder','7 % 2','1'],
            ['=','Store a value','target = 1000','target stores 1000'],['**','Power','2 ** 3','8'],['==','Equal','5 == 5','True'],
            ['!=','Not equal','5 != 3','True'],['>','Greater than','5 > 3','True'],
            ['<','Less than','3 < 5','True'],['>=','Greater than or equal','5 >= 5','True'],
            ['<=','Less than or equal','3 <= 5','True'],['and','Both conditions true','True and False','False'],
            ['or','Either condition true','True or False','True'],['not','Reverse a condition','not True','False'],
            ['&','Both checks for each Pandas row','(sales > 10) & (region == "West")','Both match'],
            ['|','Either check for each Pandas row','(sales > 10) | (region == "West")','At least one matches'],
            ['~','Reverse each Pandas row check','~(sales > 10)','sales is 10 or less']
          ]
        },
        points:[
          'Use `+`, `-`, `*` and `/` for the four familiar arithmetic operations.',
          '`//` counts whole times, `%` gives what is left over, and `**` multiplies a number by itself.',
          'Use `==` to compare values for equality; a single `=` assigns a value to a variable.',
          'A comparison such as `sales >= 1000` gives a `True` or `False` answer.',
          '`and` requires both conditions to be true; `or` requires at least one; `not` reverses a condition.',
          'Python allows chained comparisons: `5 <= score <= 10`.',
          'Use parentheses to make compound conditions easy to read.',
          'For Pandas columns, use `&`, `|` and `~` with parentheses to check each row—not Python `and`, `or` and `not`.'
        ],
        mistakes:[
          'Writing `=` when you mean equality. Use `=` to assign and `==` to compare.',
          'Expecting `/` to return an integer: `7 / 2` is `3.5`; `7 // 2` is `3`.',
          'Using `and` or `or` directly between Pandas Series conditions. Use parenthesized `&` or `|` instead.'
        ],
        example:{
          title:'Calculate profit and test a sales target',
          scenario:'An order has revenue of 1,200 and cost of 700. The target is 1,000 in the West region.',
          table:T(SALES_SAMPLE,'Sample order data'),
          task:'Calculate profit. Then check whether the order is from the West and meets the sales target.',
          formula:'revenue = 1200\ncost = 700\nsales = 1200\nregion = "West"\n\nprofit = revenue - cost\nmeets_target = sales >= 1000\nqualifies = (region == "West") and meets_target\n\nprint(profit)\nprint(meets_target)\nprint(qualifies)',
          steps:[
            '`revenue - cost` uses subtraction (`-`): 1,200 - 700 is 500.',
            '`sales >= 1000` uses greater-than-or-equal (`>=`): 1,200 is at least 1,000, so the result is `True`.',
            '`region == "West"` uses equality (`==`) and is `True`.',
            '`and` requires both conditions to be true, so `qualifies` is `True`.'
          ],
          table2:{ rows:[['Expression','Result'],['revenue - cost',500],['sales >= 1000','True'],['region == "West"','True'],['True and True','True']], caption:'Output explained' },
          result:'Profit is 500. The order meets the target and is in the West, so it qualifies.'
        },
        practice:{
          q:'For revenue = 850, cost = 500, sales = 850 and region = "East": (1) calculate profit; (2) test whether sales are below 1,000; (3) test whether the order is in the West OR sales are at least 1,000.',
          hint:'Use `-` for profit, `<` for below, `>=` for at least, `==` for equality, and `or` to combine the last two conditions.',
          solution:'profit = revenue - cost              # 350\nbelow_target = sales < 1000          # True\nqualifies = (region == "West") or (sales >= 1000)  # False',
          explain:'Profit is 850 - 500 = 350. Sales are below 1,000, so the comparison is True. The region is not West and sales are not at least 1,000, so both sides of `or` are False and the final result is False.'
        },
        interview:[
          { level:'Basic', q:'What does a comparison operator return in Python?', a:'A True-or-False answer. For example, 8 >= 5 returns True.' },
          { level:'Basic', q:'What is the difference between = and ==?', a:'A single = assigns a value, such as target = 1000. A double == compares two values, such as sales == target.' },
          { level:'Intermediate', q:'How do and, or and not differ?', a:'and is True only if both conditions are True; or is True if either condition is True; not reverses a boolean condition.' },
          { level:'Scenario', q:'Why can you not use and between two Pandas Series conditions?', a:'Python and expects one overall truth value, but each Series condition contains many booleans. Use (series_a) & (series_b) for element-wise combination, with parentheses around each comparison.' }
        ],
        mcq:[
          { q:'What is the result of 7 // 2?', o:['3','3.5','1','14'], a:0, why:'// performs floor division, giving 3.' },
          { q:'Which operator checks whether two values are equal?', o:['==','=','!=','>='], a:0, why:'== compares for equality; = assigns a value.' },
          { q:'When does A and B evaluate to True?', o:['When both A and B are True','When either A or B is True','When both are False','Whenever A is True'], a:0, why:'and requires both conditions to be True.' },
          { q:'What does 7 % 2 return?', o:['1','3','3.5','14'], a:0, why:'% returns the remainder after division; 7 divided by 2 leaves 1.' },
          { q:'What should combine two boolean conditions on Pandas Series element by element?', o:['(condition_a) & (condition_b)','condition_a and condition_b','condition_a, condition_b','not condition_a'], a:0, why:'Pandas uses & for element-wise AND; put parentheses around each comparison.' }
        ],
        recap:[
          'Arithmetic: `+` add, `-` subtract, `*` multiply, `/` divide, `//` count whole times, `%` give the remainder and `**` multiply a number by itself.',
          'Comparison: `==`, `!=`, `>`, `<`, `>=` and `<=` compare values and return True or False.',
          'Logical: `and` needs both conditions, `or` needs either, and `not` reverses a condition.',
          'For Pandas Series, combine parenthesized conditions with `&` or `|`.'
        ]
      };
      DEEP[s.id] = {
        level:'Beginner',
        tldr:'Arithmetic symbols calculate values; comparison symbols return True or False; and, or and not combine boolean conditions.',
        intuition:{
          text:[
            'An arithmetic operator takes numbers and calculates a new number.',
            'A comparison operator asks a yes-or-no question about two values.',
            'A logical operator combines the answers to yes-or-no questions into a larger rule.'
          ],
          analogy:'Arithmetic is the calculator, comparison is the checkpoint, and logical operators combine checkpoint results into one decision.'
        },
        how:[
          'Calculate a metric with arithmetic, such as profit = revenue - cost.',
          'Compare a value with a target, such as sales >= 1000. This produces True or False.',
          'Combine comparisons with and or or, or reverse one condition with not.',
          'For Pandas columns, use element-wise &, | or ~, and wrap each comparison in parentheses.'
        ],
        diagrams:[FL(['calculate','compare','combine'],[
          { title:'Arithmetic', rows:[['Input','Operation','Output'],[8,'+ 2',10]] },
          { title:'Comparison', rows:[['Question','Output'],['8 >= 5','True']] },
          { title:'Logical', rows:[['Conditions','Output'],['True and False','False']] }
        ],'Operators turn input values into calculations and boolean decisions.')],
        examples:[
          { base:true, level:'Basic' },
          X('Variation','Remainder and floor division','A pack has 17 items and holds 5 items per box.','How many full boxes are there, and how many items remain?','17 // 5  # 3 full boxes\n17 % 5   # 2 items remain',[
            '`//` returns the number of complete groups: 3.',
            '`%` returns the leftover count: 2.'
          ],'There are 3 full boxes and 2 items left.'),
          X('Business case','A clear eligibility rule','A report should include orders from the West with sales at least 1,000.','Build and evaluate the rule.','(region == "West") and (sales >= 1000)',[
            'Each comparison independently returns True or False.',
            'and is True only when both comparisons are True.'
          ],'Only records that satisfy both requirements qualify.')
        ],
        edge:[
          { t:'Division versus floor division', d:'`7 / 2` is 3.5. `7 // 2` is 3. For negative numbers, floor division rounds down toward negative infinity.' },
          { t:'Assignment versus comparison', d:'`=` stores a value in a variable. `==` tests whether two values are equal.' },
          { t:'Operator precedence', d:'Python evaluates exponentiation before multiplication and division, then addition and subtraction, then comparisons, then not, and, or. Use parentheses when it helps make intent clear.' },
          { t:'Pandas is element-wise', d:'A Series has many boolean values. Combine conditions with `(df["region"] == "West") & (df["sales"] >= 1000)`, not Python `and`.' }
        ],
        tiers:[
          { base:true, level:'Easy' },
          P('Medium','What are the results of 9 / 2, 9 // 2 and 9 % 2?','Compare regular division, floor division and remainder.','4.5, 4 and 1.','Regular division returns the fractional quotient; floor division gives the integer below it; modulo gives the remainder.'),
          P('Interview','How would you filter a Pandas DataFrame for sales over 1,000 in the West?','Use a parenthesized comparison for each condition and combine them element-wise.','df[(df["sales"] > 1000) & (df["region"] == "West")]','Each comparison produces a boolean Series; & combines the conditions row by row.')
        ],
        interviewPlus:[
          Q('Basic','Which operator checks equality, and what does it return?','== checks equality and returns True or False.',{ f:[['How is that different from =?','= assigns a value; == compares values.']] }),
          Q('Scenario','Why does a Pandas filter use & instead of and?','A Series contains one boolean per row, but and expects one truth value. & combines the two boolean Series element by element; parentheses keep each comparison grouped.',{ t:'Use (condition_a) & (condition_b), not condition_a & condition_b without parentheses.' })
        ],
        ref:RT(['Group','Symbols','Meaning'],[
          ['Arithmetic','+  -  *  /','Add, subtract, multiply, divide'],
          ['Arithmetic','//  %  **','Floor divide, remainder, exponent'],
          ['Comparison','==  !=','Equal, not equal'],
          ['Comparison','>  <  >=  <=','Greater, less, at least, at most'],
          ['Logical','and  or  not','Both, either, reverse'],
          ['Pandas Series','&  |  ~','Element-wise AND, OR, NOT']
        ]),
        related:['py-variables','py-conditionals','pandas-select-filter']
      };
    } else if (s.id === 'py-while-loops') {
      core[s.id].tagline = 'Repeat a step while a condition remains true; update your values so the loop eventually stops.';
      core[s.id].whatTitle = 'How a while loop works';
      core[s.id].what = [
        'A `while` loop checks a condition **before** each pass through its body.',
        'If the condition is `True`, Python runs the indented body. If it is `False`, Python skips the body and continues after the loop.',
        'The body should change something used by the condition so the loop can eventually finish.'
      ];
      core[s.id].syntax = {
        code:'while condition:\n    repeated_steps',
        parts:[
          ['while','Starts a loop that continues only while its condition is True.'],
          ['condition','A question that Python checks before every pass, such as index < len(sales).'],
          [':','Marks the start of the indented loop body.'],
          ['Indented body','The steps Python repeats while the condition is True.'],
          ['index += 1','Adds one to index. This update moves through the list and eventually makes the condition False.']
        ]
      };
      core[s.id].points = [
        'Set up the starting value before the loop, such as `index = 0`.',
        'Write a condition that is initially True when the loop should run.',
        'Update the value used by the condition inside the loop, such as `index += 1`.',
        'When the condition becomes False, Python exits the loop.',
        'Use `for` when you want to visit each item in a known collection; use `while` when repetition depends on a condition.',
        'If the condition never becomes False, the loop runs indefinitely.'
      ];
      core[s.id].mistakes = [
        'Forgetting to update the counter or other loop state, creating an infinite loop.',
        'Starting the counter at the wrong value and skipping or repeating a list item.',
        'Using `<= len(items)` when the last valid list index is `len(items) - 1`; use `< len(items)`.'
      ];
      core[s.id].example.steps = [
        '`index` starts at 0, so the condition `index < len(sales)` is True for the first item.',
        'Python prints `sales[index]`, then `index += 1` adds one to the index.',
        'Python checks the condition again before the next pass.',
        'After all three values have been printed, index is 3. The condition `3 < 3` is False, so the loop stops.'
      ];
      core[s.id].practice.explain = 'Each pass adds the current sales value to total, then index += 1 advances to the next item. Once index equals len(sales), the condition is False and the loop ends.';
      core[s.id].recap = [
        '`while condition:` repeats its indented body only while condition is True.',
        'Change the value used by the condition inside the loop so it can become False.',
        'A missing update can create an infinite loop; `< len(items)` keeps list indexes in range.'
      ];
      DEEP[s.id] = {
        level:'Beginner',
        tldr:'A while loop repeats its indented body while a condition is True; update the condition’s values so it eventually becomes False.',
        intuition:{
          text:[
            'Python checks the while condition before each pass through the loop.',
            'When it is True, the body runs. Python then returns to the condition and checks again.',
            'When it becomes False, Python exits the loop and continues with the next statement.'
          ],
          analogy:'A while loop is like checking a checklist: keep doing the next step while unfinished items remain, and stop when none remain.'
        },
        how:[
          'Initialize the loop state, for example `index = 0`.',
          'Write a condition that is True while work remains, for example `index < len(sales)`.',
          'Run the indented body for the current item.',
          'Update the state, for example `index += 1`, so the next pass makes progress.',
          'When the condition is False, Python exits the loop.'
        ],
        diagrams:[FL(['check condition','run body','update state','check again'],[
          { title:'Condition is True', rows:[['Step','Action'],['1','Run loop body'],['2','Update index'],['3','Check again']] },
          { title:'Condition is False', rows:[['Step','Action'],['1','Skip loop body'],['2','Continue after loop']] }
        ],'The condition is checked again before every repetition.')],
        examples:[
          { base:true, level:'Basic' },
          X('Variation','Stop at a sales threshold','Read sales values in order and stop once sales reach 1,000.','Use a while loop to find the first qualifying sale.','sales = [120, 800, 1200, 900]\nindex = 0\nwhile index < len(sales) and sales[index] < 1000:\n    index += 1\n\nif index < len(sales):\n    print(sales[index])',[
            'The condition checks that an item remains and that its sales value is below 1,000.',
            'index += 1 advances to the next value whenever the current sale is below the target.',
            'The loop stops at 1,200 because it meets the target.'
          ],'The first qualifying sale is 1,200.'),
          X('Business case','Process until a stopping rule is met','A data-quality check should inspect records until it finds a sales value marked None.','Stop at the first None value or when there are no rows left.','index = 0\nwhile index < len(sales) and sales[index] is not None:\n    index += 1',[
            'The first condition prevents the index from going beyond the list.',
            'The second condition stops when a value is None.',
            'If no None value is found, the index reaches the list length and the loop stops safely.'
          ],'The loop stops at the first None value, or after the last item.')
        ],
        edge:[
          { t:'Infinite loop', d:'If no value that affects the condition changes, a true condition can stay true forever. Make the progress step visible, such as `index += 1`.' },
          { t:'Empty collection', d:'When sales is empty, len(sales) is 0. The condition `0 < 0` is False, so the body correctly runs zero times.' },
          { t:'Index boundary', d:'For a list of length 3, valid indexes are 0, 1 and 2. Use `index < len(sales)`, not `index <= len(sales)`.' }
        ],
        tiers:[
          { base:true, level:'Easy' },
          P('Medium','How many times does `count = 0; while count < 3: count += 1` run?', 'Trace the values of count: 0, then 1, then 2; check the condition once more.', 'It runs 3 times. After the third pass, count is 3 and `3 < 3` is False.', 'The condition is checked before each pass, so count values 0, 1 and 2 each enter the loop.'),
          P('Interview','What is a common cause of an infinite while loop?', 'Look for whether the loop changes a value used by its condition.', 'The condition never becomes False, often because a counter or other loop state is not updated.', 'A while loop needs a clear stopping condition and a step that makes progress toward it.')
        ],
        interviewPlus:[
          Q('Basic','When does a while loop stop?', 'It stops when its condition evaluates to False before a pass.',{ f:[['When is the condition first checked?','Before the first pass and again before every later pass.']] }),
          Q('Scenario','How do you safely walk through every item in a list with while?', 'Initialize index to 0, continue while index < len(items), process items[index], and increment index by 1 in the loop body.',{ t:'Use < rather than <= so the index never equals the out-of-range list length.' })
        ],
        ref:RT(['Part','Purpose'],[
          ['while condition:','Repeat only while the condition is True'],
          ['Indented body','The work repeated each pass'],
          ['State update','Move toward the stopping condition, for example index += 1'],
          ['Stopping condition','Becomes False when the loop has finished'],
          ['for loop','Often simpler when visiting every item in a collection']
        ]),
        related:['py-loops','py-conditionals','py-range']
      };
    }
    if (s.id === 'py-oop-principles') {
      core[s.id].example = {
        title:'Four OOP ideas, four separate examples',
        scenario:'Use the examples below to see what each idea means on its own.',
        task:'Read each example and identify which OOP idea it demonstrates.',
        formula:GUIDES[s.id].code,
        steps:TUTORING[s.id].walkthrough,
        result:'The examples demonstrate encapsulation, abstraction, inheritance and polymorphism separately.'
      };
      core[s.id].practice = {
        q:'A Dog and a Cat both have a speak() method. What will the loop print, and which OOP idea does this show?',
        hint:'Follow the same speak() call for each object in the list.',
        solution:'class Dog:\n    def speak(self):\n        return "Woof"\n\nclass Cat:\n    def speak(self):\n        return "Meow"\n\nfor animal in [Dog(), Cat()]:\n    print(animal.speak())',
        explain:'The loop prints Woof and then Meow. It calls the same method on different object types, and each object responds in its own way. This is polymorphism.'
      };
      core[s.id].mcq = [
        { q:'Which OOP idea keeps an object’s data and the actions that use it together?', o:['Encapsulation','Inheritance','Polymorphism','Abstraction'], a:0, why:'Encapsulation groups related data and actions and can keep the rules for changing that data nearby.' },
        { q:'A coffee machine lets someone call brew() without operating its heating steps. Which idea is shown?', o:['Abstraction','Inheritance','Encapsulation','Polymorphism'], a:0, why:'The machine provides a simple action and handles the internal steps itself.' },
        { q:'Car is a child class of Vehicle. Which idea is shown?', o:['Inheritance','Abstraction','Polymorphism','Encapsulation'], a:0, why:'Car reuses or extends behavior from its parent class Vehicle.' },
        { q:'A Dog and a Cat each respond differently to speak(). Which idea is shown?', o:['Polymorphism','Encapsulation','Inheritance','Abstraction'], a:0, why:'Different object types provide their own response to the same method call.' },
        { q:'In Python, does a leading underscore make an attribute impossible to access?', o:['No; it is a convention for an internal detail','Yes; Python blocks all access','Yes; it encrypts the value','No; it changes the value to a global variable'], a:0, why:'A leading underscore signals that a name is intended for internal use, but it is not strict access protection.' }
      ];
      core[s.id].recap = [
        'Encapsulation groups related data and actions, and keeps relevant rules close to that data.',
        'Abstraction gives the caller a clear action without requiring it to manage the steps inside.',
        'Inheritance lets a child class reuse or extend a parent class.',
        'Polymorphism lets different objects respond to the same method call in their own way.',
        'Use classes when they make related data and actions easier to understand; not every analysis needs OOP.'
      ];
      DEEP[s.id] = {
        level:'Beginner',
        tldr:'Encapsulation groups data and actions; abstraction hides detail behind a simple action; inheritance reuses a parent class; polymorphism lets different objects answer the same call in their own way.',
        intuition:{
          text:[
            'The four ideas are related to classes, but each answers a different question: Where do the data and actions belong? What details should the caller need to know? Can a more specific class reuse a general one? Can different objects support the same action?',
            'The examples use familiar things—a bank account, a coffee machine, vehicles and animals—so you can focus on one idea at a time.'
          ],
          analogy:'Think of a car: it keeps its own details and actions together, a driver uses simple controls without managing the engine’s inner steps, it is a kind of vehicle, and it can respond to a shared action such as move() in its own way.'
        },
        how:TUTORING[s.id].walkthrough,
        examples:[
          X('Encapsulation','Keep account data with its rules','An account has a balance of 100. A withdrawal should be allowed only when it is positive and does not exceed the balance.','Try a valid withdrawal, then one that is too large.','class Account:\n    def __init__(self, balance):\n        self._balance = balance\n\n    def withdraw(self, amount):\n        if amount <= 0 or amount > self._balance:\n            return "Withdrawal not allowed"\n        self._balance -= amount\n        return self._balance\n\naccount = Account(100)\nprint(account.withdraw(30))\nprint(account.withdraw(100))',[
            '`Account` keeps the balance and the `withdraw` action together.',
            'The first call checks 30, subtracts it from 100 and returns 70.',
            'The next call checks 100 against the remaining 70 and refuses it. The balance stays 70.'
          ],'70\nWithdrawal not allowed'),
          X('Abstraction','Use one simple coffee-machine control','Someone wants a cup of coffee without managing how the machine heats water and brews it.','Call brew() and let the coffee machine handle its internal steps.','class CoffeeMachine:\n    def brew(self):\n        self._heat_water()\n        self._brew_coffee()\n        return "Coffee is ready"\n\n    def _heat_water(self):\n        print("Heating water")\n\n    def _brew_coffee(self):\n        print("Brewing coffee")\n\nmachine = CoffeeMachine()\nprint(machine.brew())',[
            '`brew()` is the simple action the user needs to know.',
            'Inside the method, the machine heats the water and then brews the coffee.',
            'The user asks for coffee without calling each internal step separately.'
          ],'Heating water\nBrewing coffee\nCoffee is ready'),
          X('Inheritance','Reuse shared vehicle behavior','A car and a bicycle are both vehicles. They can share a speed value and a method for showing it, while each can have its own movement action.','Make Car inherit the shared speed behavior from Vehicle.','class Vehicle:\n    def __init__(self, speed):\n        self.speed = speed\n\n    def show_speed(self):\n        return f"Speed: {self.speed} km/h"\n\nclass Car(Vehicle):\n    def honk(self):\n        return "Beep!"\n\ncar = Car(60)\nprint(car.show_speed())\nprint(car.honk())',[
            '`Car(Vehicle)` states that Car is a more specific kind of Vehicle.',
            'Car receives the parent’s speed setup and `show_speed()` method.',
            'Car also defines its own `honk()` action.'
          ],'Speed: 60 km/h\nBeep!'),
          X('Polymorphism','Give different animals the same speak() action','A program has a dog and a cat and should ask each animal to make its own sound.','Call speak() on each object using the same loop.','class Dog:\n    def speak(self):\n        return "Woof"\n\nclass Cat:\n    def speak(self):\n        return "Meow"\n\nanimals = [Dog(), Cat()]\nfor animal in animals:\n    print(animal.speak())',[
            'Dog and Cat both provide a method named `speak()`.',
            'The loop makes the same method call for each animal.',
            'Dog returns "Woof"; Cat returns "Meow". Each object supplies its own behavior.'
          ],'Woof\nMeow')
        ],
        edge:[
          { t:'Encapsulation is not strict privacy in Python', d:'A leading underscore, such as `_balance`, is a signal that a value is for internal use. It does not prevent a person from accessing it. Methods can help enforce rules, but Python does not automatically lock ordinary attributes.' },
          { t:'Abstraction does not mean hiding everything', d:'The caller still needs to know what a method does and what inputs it expects. The method hides implementation steps, not its purpose. In the coffee-machine example, brew() is the public action; the underscore in _heat_water() signals an internal helper.' },
          { t:'Inheritance should express a real “is a” relationship', d:'A Car is a kind of Vehicle, so inheritance makes sense. Do not add a parent class only to save a couple of lines.' },
          { t:'Polymorphism depends on a shared action', d:'The objects do not need the same class parent in Python. They need to support the method the caller uses, such as `speak()`.' }
        ],
        tiers:[
          { base:true, level:'Easy' },
          P('Medium','A Car uses setup and a method from Vehicle, then adds its own honk() method. Which idea allows Car to reuse Vehicle behavior?','Look for the parent class and the more specific child class.','Inheritance. Car is a child of Vehicle and reuses the parent’s behavior.','Inheritance models a real “is a” relationship and allows a child class to reuse or extend a parent class.'),
          P('Interview','Dog and Cat both have speak(), but they return different sounds. Must they inherit from the same parent class?','Separate the common method call from parent-child reuse.','No. This demonstrates polymorphism: each object supports the same call and provides its own response. In Python, they do not have to share a parent class.','Inheritance is one way to share or extend class behavior; polymorphism is about different objects supporting a common action.')
        ],
        interviewPlus:[
          Q('Basic','Explain encapsulation and give an example.', 'Encapsulation keeps related data and actions together. An Account object can keep its balance and provide a withdraw method that checks the amount before changing it.', { f:[['Does a leading underscore make a Python attribute truly private?','No. It is a convention that signals internal use, not access protection.']] }),
          Q('Basic','How is abstraction different from encapsulation?', 'Encapsulation concerns grouping related data and actions. Abstraction concerns giving a caller a simple action without requiring it to manage the implementation steps.', { f:[['Can one class use both ideas?','Yes. A class can keep data and methods together and provide simple methods that hide their internal steps.']] }),
          Q('Intermediate','What does inheritance let a child class do?', 'A child class can reuse or extend a parent class. For example, Car can inherit speed setup and show_speed() from Vehicle, then add a honk() method.', { f:[['What does super() do when used in a child initializer?','It calls the parent class initializer so the shared setup can run.']] }),
          Q('Scenario','How would you explain polymorphism using animals?', 'Dog and Cat can both provide speak(). A loop calls the same method on each object, and each returns its own sound. The classes do not have to inherit from one another.', { t:'Polymorphism does not require the classes to share a parent in Python.' })
        ],
        ref:RT(['Idea','Main question','Example in this lesson'],[
          ['Encapsulation','Where should related data and actions live?','Account keeps its balance and withdrawal rules together.'],
          ['Abstraction','What simple action should the caller use?','Call brew() without controlling the machine’s internal steps.'],
          ['Inheritance','What shared class behavior can be reused?','Car reuses speed behavior from Vehicle.'],
          ['Polymorphism','Can one call work with different object types?','Call speak() for a dog and a cat.']
        ]),
        related:['py-oop-classes','py-oop-attributes-methods']
      };
    }
    lessonNumber++;
  }));
  useSimpleEnglish(core);
  Object.keys(DEEP).forEach(id => useSimpleEnglish(DEEP[id]));
  DP.addLessons(core);
})();
