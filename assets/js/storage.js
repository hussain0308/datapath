/* Datapath | storage.js
 * Safe browser storage. Uses localStorage and falls back to memory if the browser blocks it.
 * Exposed as Datapath.store. Storage keys are unchanged from the original site: datapath_progress_v1 and datapath_theme.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

  /* ---------- Storage (safe) ---------- */
  const mem = {};
  const store = {
    get(k){ try { const v = localStorage.getItem(k); return v === null ? (mem[k] ?? null) : v; } catch(e){ return mem[k] ?? null; } },
    set(k,v){ mem[k] = v; try { localStorage.setItem(k,v); } catch(e){} }
  };

  DP.store = store;
})();
