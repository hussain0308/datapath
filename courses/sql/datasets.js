/* Datapath | SQL | datasets.js
 * Sample tables used by the SQL lessons. Shared by the lesson files in this folder.
 * Add a new shared table here, then list it in the export at the bottom.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

const EMP = { rows:[['emp_id','name','dept_id','salary','manager_id'],[1,'Asha',10,50000,'NULL'],[2,'Bilal',20,40000,1],[3,'Chitra',10,60000,1],[4,'Deepak',30,45000,2],[5,'Esha',20,40000,2],[6,'Farhan','NULL',35000,3]] };
const DEPT = { rows:[['dept_id','dept_name'],[10,'Sales'],[20,'Finance'],[30,'HR'],[40,'IT']] };
const CUST = { rows:[['customer_id','name','city'],[101,'Asha','Pune'],[102,'Bilal','Delhi'],[103,'Chitra','Pune'],[104,'Deepak','Mumbai']] };
const ORD = { rows:[['order_id','customer_id','order_date','amount'],[1,101,'2026-01-05',1200],[2,102,'2026-01-18',800],[3,101,'2026-02-03',1500],[4,103,'2026-02-21',700],[5,102,'2026-03-09',900],[6,101,'2026-03-15',600]] };

  DP.datasets.sql = { EMP, DEPT, CUST, ORD };
})();
