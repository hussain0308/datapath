/* Datapath | utils.js
 * Small shared helpers: DOM lookup, HTML escaping, inline formatting (`code` and **bold**), list builder, shuffle and two icons.
 * Exposed as Datapath.utils.
 */
(function () {
  "use strict";
  const DP = window.Datapath;

  /* ---------- Helpers ---------- */
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const fmt = s => esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  const li = arr => '<ul>' + arr.map(x => '<li>' + fmt(x) + '</li>').join('') + '</ul>';
  function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  const CHECK = '<svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="var(--accent-ink)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.4l2.4 2.4 4.6-5"/></svg>';
  const CHEV = '<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

  DP.utils = { $, esc, fmt, li, shuffle, CHECK, CHEV };
})();
