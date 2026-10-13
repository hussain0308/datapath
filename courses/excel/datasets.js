/* Datapath | Excel | datasets.js
 * Sample tables used by the Excel lessons. Shared by the lesson files in this folder.
 * Add a new shared table here, then list it in the export at the bottom.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

const PRODUCTS = {
  rows:[
    ['ProductID','Product','Category','Price'],
    ['P101','Wireless Mouse','Accessories',799],
    ['P102','USB-C Cable','Accessories',349],
    ['P103','Laptop Stand','Furniture',1499],
    ['P104','Notebook Pack','Stationery',220],
    ['P105','Desk Lamp','Furniture',899]
  ]
};
const SALES = {
  rows:[
    ['Region','Q1','Q2','Q3'],
    ['North',450,520,480],
    ['South',380,410,450],
    ['East',300,360,390],
    ['West',420,400,470]
  ]
};
const STAFF = {
  rows:[
    ['Employee','Department','EmpID'],
    ['Ravi Kumar','Sales','E201'],
    ['Meera Nair','Finance','E202'],
    ['Arjun Reddy','Operations','E203'],
    ['Sana Khan','HR','E204'],
    ['Kiran Rao','Sales','E205']
  ]
};
const MONTHLY = {
  rows:[
    ['Metric','Jan','Feb','Mar','Apr'],
    ['Revenue',120000,135000,98000,150000],
    ['Units sold',340,390,280,410],
    ['Returns',12,9,15,7]
  ]
};
const MARKS_RESULT = { rows:[['Student','Marks','Result'],['Asha',82,'Pass'],['Bilal',67,'Pass'],['Chitra',45,'Fail'],['Deepak',91,'Pass'],['Esha',58,'Pass']] };
const GRADES = { rows:[['Student','Marks','Grade'],['Asha',82,'B'],['Bilal',67,'C'],['Chitra',45,'Fail'],['Deepak',91,'A'],['Esha',58,'C']] };
const TWO_SUBJECTS = { rows:[['Student','Maths','Science','Result'],['Asha',72,65,'Pass'],['Bilal',35,80,'Fail'],['Chitra',55,38,'Fail'],['Deepak',90,88,'Pass']] };
const CUSTOMERS = { rows:[['Customer','Type','Order value','Discount'],['Rahul','Premium',3000,'Yes'],['Sneha','Regular',6000,'Yes'],['Imran','Regular',2000,'No'],['Divya','Premium',8000,'Yes']] };
const EMAILS = { rows:[['Customer','Email','Check'],['Asha','asha@example.com','Has email'],['Bilal','','Missing email'],['Chitra','chitra@example.com','Has email'],['Deepak','','Missing email']] };
const LOANS = { rows:[['Applicant','Salary','Credit score','Guarantor','Decision'],['Asha',45000,720,'No','Approve'],['Bilal',28000,750,'Yes','Reject'],['Chitra',35000,650,'Yes','Approve'],['Deepak',40000,640,'No','Reject']] };
const UNITS = { rows:[['Product','Revenue','Units','Revenue per unit'],['Pen',5000,100,50],['Book',8000,0,'No units'],['Bag',12000,150,80],['Cap',3000,60,50]] };
const SALESLOG = { rows:[['Order','Region','Category','Sales'],['O-101','North','Electronics',12000],['O-102','South','Furniture',8000],['O-103','North','Furniture',15000],['O-104','East','Electronics',9500],['O-105','South','Electronics',11000],['O-106','North','Electronics',7000],['O-107','East','Furniture',6000],['O-108','South','Electronics',13000]] };
const MONTHS5 = { rows:[['Month','Sales'],['Jan',1200],['Feb',1500],['Mar',900],['Apr',1800],['May',1100]] };
const GST = { rows:[['Item','Price','Qty','Amount','GST','GST rate'],['Pen',10,5,50,9,'18%'],['Book',60,2,120,21.6,''],['Bag',500,1,500,90,'']] };
const ATTEND = { rows:[['Student','Marks'],['Asha',82],['Bilal','Absent'],['Chitra',45],['Deepak',''],['Esha',58]] };
const RANKS = { rows:[['Student','Marks','Rank'],['Asha',82,2],['Bilal',67,4],['Chitra',45,5],['Deepak',91,1],['Esha',82,2]] };
const COSTS = { rows:[['Product','Cost','Rounded'],['A',12.678,12.68],['B',45.341,45.34],['C',7.5,7.5]] };
const BASKET = { rows:[['Item','Qty','Price'],['Pen',5,10],['Book',2,60],['Bag',1,500]] };
const CODES = { rows:[['Code'],['EMP-1021'],['EMP-1022'],['MGR-2005']] };
const CODEST = (label, res) => ({ rows:[['Code',label],['EMP-1021',res],['EMP-1022',''],['MGR-2005','']] });
const ORD_DATES = { rows:[['Order','Order date'],['O-1','15-Aug-2026'],['O-2','03-Jan-2026'],['O-3','28-Feb-2025']] };
const DUPS = { rows:[['Customer','City'],['Asha','Pune'],['Bilal','Delhi'],['Asha','Pune'],['Chitra','Pune'],['Bilal','Delhi']] };
const ORDERS_DT = { rows:[['Order','Date','Sales'],['O-1','05-Jan-2026',1200],['O-2','18-Jan-2026',800],['O-3','03-Feb-2026',1500],['O-4','21-Feb-2026',700],['O-5','09-Mar-2026',900]] };
const PROFIT = { rows:[['Product','Revenue','Cost'],['Pen',5000,3000],['Book',8000,5000],['Bag',12000,9000]] };

  DP.datasets.excel = { PRODUCTS, SALES, STAFF, MONTHLY, MARKS_RESULT, GRADES, TWO_SUBJECTS, CUSTOMERS, EMAILS, LOANS, UNITS, SALESLOG, MONTHS5, GST, ATTEND, RANKS, COSTS, BASKET, CODES, CODEST, ORD_DATES, DUPS, ORDERS_DT, PROFIT };
})();
