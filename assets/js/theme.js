/* Datapath | theme.js
 * Light/dark theme switching. Saves the choice under the original key datapath_theme.
 * With no saved choice, the system preference (prefers-color-scheme) applies through the CSS.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $ } = DP.utils;
  const store = DP.store;

  /* Theme */
  function applyTheme(t){ if (t) document.documentElement.setAttribute('data-theme', t); }
  applyTheme(store.get('datapath_theme'));
  $('themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next); store.set('datapath_theme', next);
  });

  DP.theme = { apply: applyTheme };
})();
