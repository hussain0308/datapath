/* Datapath | visuals.js
 * Visual building blocks used by lessons: SVG charts, spreadsheet grids and diagrams (Venn and flow).
 * Exposed as Datapath.visuals.
 */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { esc, fmt } = DP.utils;

  /* ---------- Charts (simple SVG) ---------- */
  function niceMax(v){ const p = Math.pow(10, Math.floor(Math.log10(v))); const f = v / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
  const fmtN = n => Number(n).toLocaleString('en-US');
  function chartHTML(c){
    const W = 560, H = 270, labels = c.labels || [], n = labels.length;
    const cols = ['var(--accent)','var(--chart2)','#6C8EE6','#B56BC9','#8C9A91'];
    const muted = 'style="fill:var(--muted)" font-size="12"';
    let s = '<div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(c.title) + '" width="100%">';
    s += '<text x="' + (W/2) + '" y="18" text-anchor="middle" style="fill:var(--ink);font:600 14px var(--body-font)">' + esc(c.title) + '</text>';
    if (c.type === 'scatter'){
      const m = { l:64, r:24, t:38, b:48 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      const xs = c.points.map(p => p.x), ys = c.points.map(p => p.y);
      const xmin = c.xmin === undefined ? Math.min.apply(null, xs) : c.xmin;
      const xmax = c.xmax === undefined ? Math.max.apply(null, xs) : c.xmax;
      const ymin = c.ymin === undefined ? Math.min.apply(null, ys) : c.ymin;
      const ymax = c.ymax === undefined ? Math.max.apply(null, ys) : c.ymax;
      const xspan = xmax - xmin || 1, yspan = ymax - ymin || 1;
      for (let i = 0; i <= 4; i++){
        const x = m.l + iw * i / 4, y = m.t + ih - ih * i / 4;
        s += '<line x1="' + x + '" x2="' + x + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" style="stroke:var(--line)"/>';
        s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--line)"/>';
        s += '<text x="' + x + '" y="' + (H - 27) + '" text-anchor="middle" ' + muted + '>' + (xmin + xspan * i / 4).toFixed(1) + '</text>';
        s += '<text x="' + (m.l - 8) + '" y="' + (y + 4) + '" text-anchor="end" ' + muted + '>' + (ymin + yspan * i / 4).toFixed(1) + '</text>';
      }
      c.points.forEach(p => {
        const x = m.l + iw * (p.x - xmin) / xspan, y = m.t + ih - ih * (p.y - ymin) / yspan;
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" style="fill:var(--accent);stroke:var(--surface);stroke-width:1.5"/>';
      });
      s += '<text x="' + (W/2) + '" y="' + (H - 3) + '" text-anchor="middle" ' + muted + '>' + esc(c.xLabel || '') + '</text>';
      s += '<text x="16" y="' + (H/2) + '" transform="rotate(-90 16 ' + (H/2) + ')" text-anchor="middle" ' + muted + '>' + esc(c.yLabel || '') + '</text>';
    } else if (c.type === 'interval'){
      const m = { l:72, r:24, t:38, b:42 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      const lo = Math.min.apply(null, c.low), hi = Math.max.apply(null, c.high);
      const pad = (hi - lo || 1) * .12, ymin = lo - pad, ymax = hi + pad, span = ymax - ymin;
      for (let i = 0; i <= 4; i++){
        const y = m.t + ih - ih * i / 4, v = ymin + span * i / 4;
        s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--line)"/>';
        s += '<text x="' + (m.l - 8) + '" y="' + (y + 4) + '" text-anchor="end" ' + muted + '>' + v.toFixed(1) + '</text>';
      }
      const step = iw / c.labels.length;
      c.labels.forEach((label, i) => {
        const x = m.l + step * i + step / 2;
        const y = v => m.t + ih - ih * (v - ymin) / span;
        s += '<line x1="' + x + '" x2="' + x + '" y1="' + y(c.low[i]) + '" y2="' + y(c.high[i]) + '" style="stroke:var(--chart2);stroke-width:3"/>';
        s += '<line x1="' + (x - 8) + '" x2="' + (x + 8) + '" y1="' + y(c.low[i]) + '" y2="' + y(c.low[i]) + '" style="stroke:var(--chart2);stroke-width:2"/>';
        s += '<line x1="' + (x - 8) + '" x2="' + (x + 8) + '" y1="' + y(c.high[i]) + '" y2="' + y(c.high[i]) + '" style="stroke:var(--chart2);stroke-width:2"/>';
        s += '<circle cx="' + x + '" cy="' + y(c.values[i]) + '" r="6" style="fill:var(--accent);stroke:var(--surface);stroke-width:2"/>';
        s += '<text x="' + x + '" y="' + (H - 12) + '" text-anchor="middle" style="fill:var(--ink)" font-size="13">' + esc(label) + '</text>';
      });
    } else if (c.type === 'pie'){
      const total = c.values.reduce((a,b) => a + b, 0), cx = 140, cy = 150, r = 95; let ang = -Math.PI / 2;
      c.values.forEach((v,i) => {
        const a2 = ang + v / total * 2 * Math.PI;
        const x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
        s += '<path d="M' + cx + ',' + cy + ' L' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + (v / total > 0.5 ? 1 : 0) + ' 1 ' + x2.toFixed(1) + ',' + y2.toFixed(1) + ' Z" style="fill:' + cols[i % cols.length] + ';stroke:var(--surface);stroke-width:2"/>';
        ang = a2;
      });
      c.values.forEach((v,i) => {
        const y = 110 + i * 32;
        s += '<rect x="290" y="' + (y - 12) + '" width="14" height="14" rx="3" style="fill:' + cols[i % cols.length] + '"/><text x="312" y="' + y + '" style="fill:var(--ink)" font-size="14">' + esc(labels[i]) + ': ' + (v / total * 100).toFixed(1) + '% (' + fmtN(v) + ')</text>';
      });
    } else {
      const m = { l:58, r: c.values2 ? 52 : 18, t:34, b:36 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      const max = niceMax(Math.max.apply(null, c.values)), max2 = c.values2 ? niceMax(Math.max.apply(null, c.values2)) : 0;
      for (let i = 0; i <= 4; i++){
        const y = m.t + ih - ih * i / 4;
        s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--line)"/>';
        s += '<text x="' + (m.l - 8) + '" y="' + (y + 4) + '" text-anchor="end" ' + muted + '>' + fmtN(max * i / 4) + '</text>';
        if (c.values2) s += '<text x="' + (W - m.r + 8) + '" y="' + (y + 4) + '" ' + muted + '>' + (max2 * i / 4) + (c.suffix2 || '') + '</text>';
      }
      const step = iw / n;
      const px = i => m.l + step * i + step / 2;
      if (c.type === 'bar' || c.type === 'combo' || c.type === 'histogram'){
        const bw = step * (c.type === 'histogram' ? 0.96 : 0.5);
        c.values.forEach((v,i) => {
          const h = ih * v / max, x = px(i) - bw / 2, y = m.t + ih - h;
          s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3" style="fill:var(--accent)"/>';
          s += '<text x="' + px(i).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" style="fill:var(--ink)" font-size="12">' + fmtN(v) + '</text>';
        });
      }
      const lineVals = c.type === 'line' ? c.values : (c.type === 'combo' ? c.values2 : null);
      const lineMax = c.type === 'line' ? max : max2;
      if (lineVals){
        const pts = lineVals.map((v,i) => px(i).toFixed(1) + ',' + (m.t + ih - ih * v / lineMax).toFixed(1));
        s += '<polyline points="' + pts.join(' ') + '" fill="none" style="stroke:var(--chart2);stroke-width:3"/>';
        lineVals.forEach((v,i) => {
          const x = px(i), y = m.t + ih - ih * v / lineMax;
          s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.5" style="fill:var(--chart2);stroke:var(--surface);stroke-width:2"/>';
          s += '<text x="' + x.toFixed(1) + '" y="' + (y - 10).toFixed(1) + '" text-anchor="middle" style="fill:var(--ink)" font-size="12">' + (c.type === 'line' ? fmtN(v) : v + (c.suffix2 || '')) + '</text>';
        });
      }
      labels.forEach((l,i) => { s += '<text x="' + px(i).toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" style="fill:var(--ink)" font-size="13">' + esc(l) + '</text>'; });
    }
    return s + '</svg></div>';
  }

  /* ---------- Spreadsheet grid ---------- */
  function expandRange(r){
    const m = r.match(/^([A-Z])(\d+):([A-Z])(\d+)$/); const out = [];
    if (!m) return out;
    for (let c = m[1].charCodeAt(0); c <= m[3].charCodeAt(0); c++)
      for (let rw = +m[2]; rw <= +m[4]; rw++) out.push(String.fromCharCode(c) + rw);
    return out;
  }
  function gridHTML(t){
    const hl = t.hl || {}, map = {};
    Object.keys(hl).filter(k => k.includes(':')).forEach(k => expandRange(k).forEach(c => map[c] = hl[k]));
    Object.keys(hl).filter(k => !k.includes(':')).forEach(k => map[k] = hl[k]);
    const used = new Set(Object.values(map));
    const cols = t.rows[0].length;
    let h = '';
    if (t.caption) h += '<p class="cap">' + esc(t.caption) + '</p>';
    h += '<div class="sheet-wrap"><table class="sheet"><thead><tr><th class="corner"></th>';
    for (let c = 0; c < cols; c++) h += '<th>' + String.fromCharCode(65 + c) + '</th>';
    h += '</tr></thead><tbody>';
    t.rows.forEach((row, ri) => {
      h += '<tr><th class="rowh">' + (ri + 1) + '</th>';
      row.forEach((v, ci) => {
        const ref = String.fromCharCode(65 + ci) + (ri + 1);
        const cls = [map[ref] || '', ri === 0 ? 'hd' : '', typeof v === 'number' ? 'num' : ''].join(' ').trim();
        h += '<td class="' + cls + '">' + esc(v) + '</td>';
      });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    if (used.size){
      h += '<div class="legend">';
      if (used.has('find')) h += '<span><i class="l-find"></i>Value being looked up</span>';
      if (used.has('hit')) h += '<span><i class="l-hit"></i>Result</span>';
      if (used.has('range')) h += '<span><i class="l-range"></i>Range used in the formula</span>';
      h += '</div>';
    }
    return h;
  }

  /* ---------- Diagrams ---------- */
  let vennN = 0;
  function vennHTML(d){
    const id = 'vn' + (++vennN), k = d.kind;
    const A = { cx:190, cy:112, r:86 }, B = { cx:290, cy:112, r:86 };
    const aOn = k === 'left' || k === 'full' || k === 'left-anti';
    const bOn = k === 'right' || k === 'full';
    const inter = k === 'inner' || k === 'left' || k === 'right' || k === 'full';
    const on = 'fill:var(--accent);fill-opacity:.78', off = 'fill:var(--surface)';
    let s = '<svg viewBox="0 0 480 232" role="img" aria-label="' + esc(d.caption || 'Venn diagram') + '" width="100%" style="max-width:520px">';
    s += '<defs><clipPath id="' + id + '"><circle cx="' + A.cx + '" cy="' + A.cy + '" r="' + A.r + '"/></clipPath></defs>';
    s += '<circle cx="' + A.cx + '" cy="' + A.cy + '" r="' + A.r + '" style="' + (aOn ? on : off) + '"/>';
    s += '<circle cx="' + B.cx + '" cy="' + B.cy + '" r="' + B.r + '" style="' + (bOn ? on : off) + '"/>';
    if (inter) s += '<circle cx="' + B.cx + '" cy="' + B.cy + '" r="' + B.r + '" clip-path="url(#' + id + ')" style="fill:var(--accent);fill-opacity:.95"/>';
    if (k === 'left-anti') s += '<circle cx="' + B.cx + '" cy="' + B.cy + '" r="' + B.r + '" clip-path="url(#' + id + ')" style="fill:var(--surface)"/>';
    s += '<circle cx="' + A.cx + '" cy="' + A.cy + '" r="' + A.r + '" fill="none" style="stroke:var(--ink);stroke-opacity:.55;stroke-width:1.5"/>';
    s += '<circle cx="' + B.cx + '" cy="' + B.cy + '" r="' + B.r + '" fill="none" style="stroke:var(--ink);stroke-opacity:.55;stroke-width:1.5"/>';
    s += '<text x="140" y="116" text-anchor="middle" style="fill:var(--ink)" font-size="14" font-weight="600">' + esc(d.a || 'A') + '</text>';
    s += '<text x="340" y="116" text-anchor="middle" style="fill:var(--ink)" font-size="14" font-weight="600">' + esc(d.b || 'B') + '</text>';
    if (d.mid) s += '<text x="240" y="116" text-anchor="middle" style="fill:var(--ink)" font-size="12" font-weight="600">' + esc(d.mid) + '</text>';
    s += '<text x="240" y="222" text-anchor="middle" style="fill:var(--muted)" font-size="13">Shaded = rows in the result</text>';
    return s + '</svg>';
  }
  function miniTable(t, hl){
    let s = '<table class="mini"><tbody>';
    t.forEach((row, ri) => {
      s += '<tr class="' + (ri === 0 ? 'mh ' : '') + (hl && hl[ri] ? 'r-' + hl[ri] : '') + '">' + row.map(v => '<td' + (String(v) === 'NULL' ? ' class="nul"' : '') + '>' + esc(v) + '</td>').join('') + '</tr>';
    });
    return s + '</tbody></table>';
  }
  function flowHTML(d){
    let s = '<div class="flowd">';
    d.panels.forEach((p, i) => {
      if (i > 0) s += '<div class="flow-a"><span>' + esc(d.arrows && d.arrows[i - 1] ? d.arrows[i - 1] : '') + '</span><i>&rarr;</i></div>';
      s += '<div class="flow-p"><div class="flow-t">' + esc(p.title) + '</div>' + (p.rows ? miniTable(p.rows, p.hl) : '') + (p.text ? '<div class="flow-x">' + fmt(p.text) + '</div>' : '') + (p.note ? '<div class="flow-n">' + fmt(p.note) + '</div>' : '') + '</div>';
    });
    return s + '</div>';
  }
  function diagramHTML(d){
    return '<figure class="figure">' + (d.type === 'venn' ? vennHTML(d) : flowHTML(d)) + (d.caption ? '<figcaption>' + fmt(d.caption) + '</figcaption>' : '') + '</figure>';
  }

  DP.visuals = { chartHTML, gridHTML, diagramHTML };
})();
