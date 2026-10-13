/* Datapath | builders.js
 * Small helper functions that lesson files use to describe content compactly.
 * Shared by every course. Exposed as Datapath.builders.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

  /* A table with highlighted cells: { rows, hl, caption } */
  const withHl = (t, hl, caption) => ({ rows:t.rows, hl, caption });
  /* A plain table (no highlights) with an optional caption */
  const T = (t, cap) => withHl(t, {}, cap);

  /* Extended-content builders */
  const X = (level, title, scenario, task, formula, steps, result, table, table2) => { const o = { level, title, scenario, task, formula, steps, result }; if (table) o.table = table; if (table2) o.table2 = table2; return o; };
  const P = (level, q, hint, solution, explain, table) => { const o = { level, q, hint, solution, explain }; if (table) o.table = table; return o; };
  const Q = (level, q, a, extra) => { const o = { level, q, a }; if (extra) { if (extra.s) o.structure = extra.s; if (extra.t) o.tradeoff = extra.t; if (extra.f) o.follow = extra.f.map(p => ({ q: p[0], a: p[1] })); } return o; };
  const FL = (arrows, panels, caption) => { const o = { type:'flow', arrows, panels }; if (caption) o.caption = caption; return o; };
  const RT = (headers, rows) => ({ headers, rows });

  /* D(id, spec): compact form of an extended-content entry; writes into Datapath.deep */
  function D(id, o){
    DP.deep[id] = { level:o.l, tldr:o.t, intuition:{ text:o.i, analogy:o.a }, how:o.h, diagrams:o.d,
      examples:[{ base:true, level:'Basic' }, o.x[0], o.x[1]], edge:o.e.map(p => ({ t:p[0], d:p[1] })),
      tiers:[{ base:true, level:'Easy' }, o.p[0], o.p[1]], interviewPlus:o.q, ref:o.r, related:o.rel };
  }

  DP.builders = { withHl, T, X, P, Q, FL, D, RT };
})();
