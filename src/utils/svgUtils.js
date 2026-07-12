const ELEMENT_COLORS = ['#ff6b4a','#c4ff3d','#4ade80','#a78bfa','#fbbf24','#60a5fa','#f472b6','#34d399','#fb923c','#22d3ee','#facc15','#e879f9'];

export function elemColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) { h = ((h << 5) - h) + name.charCodeAt(i); h |= 0; }
  return ELEMENT_COLORS[Math.abs(h) % ELEMENT_COLORS.length];
}

export function cssEscape(s) {
  return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

export function parseColor(v) {
  if (!v || v === 'none') return [0, 0, 0, 0];
  const named = { red: [1, 0, 0, 1], green: [0, 0.5, 0, 1], blue: [0, 0, 1, 1], white: [1, 1, 1, 1], black: [0, 0, 0, 1], yellow: [1, 1, 0, 1], cyan: [0, 1, 1, 1], magenta: [1, 0, 1, 1], orange: [1, 0.65, 0, 1], purple: [0.5, 0, 0.5, 1], pink: [1, 0.75, 0.8, 1], gray: [0.5, 0.5, 0.5, 1], transparent: [0, 0, 0, 0], currentcolor: [1, 1, 1, 1] };
  const l = v.trim().toLowerCase();
  if (named[l]) return named[l];
  if (l.startsWith('url(')) return [1, 1, 1, 1];
  if (l.startsWith('rgb')) { const m = l.match(/[\d.]+/g); if (m) return [+m[0] / 255, +m[1] / 255, +m[2] / 255, 1]; }
  const h = v.replace('#', '');
  return [parseInt(h.substring(0, 2), 16) / 255 || 0, parseInt(h.substring(2, 4), 16) / 255 || 0, parseInt(h.substring(4, 6), 16) / 255 || 0, 1];
}

export function getBounds(el) {
  try { const b = el.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height, cx: b.x + b.width / 2, cy: b.y + b.height / 2 }; }
  catch { return { x: 0, y: 0, w: 100, h: 100, cx: 50, cy: 50 }; }
}

export function pathToShapes(d) {
  const shapes = [];
  let cur = { i: [], o: [], v: [], c: false };
  let cx = 0, cy = 0, sx = 0, sy = 0;
  const close = () => { if (cur.v.length) { cur.c = true; shapes.push(cur); } cur = { i: [], o: [], v: [], c: false }; };
  const emit = () => { if (cur.v.length) { shapes.push(cur); cur = { i: [], o: [], v: [], c: false }; } };
  const addV = (x, y, ix, iy, ox, oy) => { cur.v.push([x, y]); cur.i.push([ix, iy]); cur.o.push([ox, oy]); };
  const pN = (s, i) => { const m = s.substring(i).match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/); return m ? [parseFloat(m[0]), i + m[0].length] : [0, i]; };
  const pC = (s, i, n) => { const v = []; while (v.length < n && i < s.length) { const [r, ni] = pN(s, i); v.push(r); i = ni; while (i < s.length && /[\s,]/.test(s[i])) i++; } return [v, i]; };
  let i = 0;
  while (i < d.length) {
    while (i < d.length && /[\s,]/.test(d[i])) i++;
    if (i >= d.length) break;
    const cmd = d[i]; i++;
    while (i < d.length && /[\s,]/.test(d[i])) i++;
    switch (cmd) {
      case 'M': { emit(); const [v, ni] = pC(d, i, 2); cx = v[0]; cy = v[1]; sx = cx; sy = cy; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'm': { emit(); const [v, ni] = pC(d, i, 2); cx += v[0]; cy += v[1]; sx = cx; sy = cy; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'L': { const [v, ni] = pC(d, i, 2); cx = v[0]; cy = v[1]; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'l': { const [v, ni] = pC(d, i, 2); cx += v[0]; cy += v[1]; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'H': { const [v, ni] = pC(d, i, 1); cx = v[0]; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'h': { const [v, ni] = pC(d, i, 1); cx += v[0]; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'V': { const [v, ni] = pC(d, i, 1); cy = v[0]; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'v': { const [v, ni] = pC(d, i, 1); cy += v[0]; addV(cx, cy, 0, 0, 0, 0); i = ni; break; }
      case 'C': { const [cv, ci] = pC(d, i, 6); const x1 = cv[0], y1 = cv[1], x2 = cv[2], y2 = cv[3], x3 = cv[4], y3 = cv[5]; const pv = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; if (cur.o.length) cur.o[cur.o.length - 1] = [x1 - pv[0], y1 - pv[1]]; cx = x3; cy = y3; addV(cx, cy, pv[0] - x2, pv[1] - y2, 0, 0); i = ci; break; }
      case 'c': { const [cv, ci] = pC(d, i, 6); const x1 = cx + cv[0], y1 = cy + cv[1], x2 = cx + cv[2], y2 = cy + cv[3], x3 = cx + cv[4], y3 = cy + cv[5]; const pv = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; if (cur.o.length) cur.o[cur.o.length - 1] = [x1 - pv[0], y1 - pv[1]]; cx = x3; cy = y3; addV(cx, cy, pv[0] - x2, pv[1] - y2, 0, 0); i = ci; break; }
      case 'S': { const [sv, si] = pC(d, i, 4); const x2 = sv[0], y2 = sv[1], x3 = sv[2], y3 = sv[3]; const pv = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; const po = cur.o.length ? cur.o[cur.o.length - 1] : [0, 0]; const x1 = pv[0] + (pv[0] - (pv[0] - po[0])), y1 = pv[1] + (pv[1] - (pv[1] - po[1])); if (cur.o.length) cur.o[cur.o.length - 1] = [x1 - pv[0], y1 - pv[1]]; cx = x3; cy = y3; addV(cx, cy, pv[0] - x2, pv[1] - y2, 0, 0); i = si; break; }
      case 's': { const [sv, si] = pC(d, i, 4); const pv = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; const po = cur.o.length ? cur.o[cur.o.length - 1] : [0, 0]; const x1 = pv[0] + (pv[0] - (pv[0] - po[0])), y1 = pv[1] + (pv[1] - (pv[1] - po[1])); const x2 = pv[0] + sv[0], y2 = pv[1] + sv[1], x3 = pv[0] + sv[2], y3 = pv[1] + sv[3]; if (cur.o.length) cur.o[cur.o.length - 1] = [x1 - pv[0], y1 - pv[1]]; cx = x3; cy = y3; addV(cx, cy, pv[0] - x2, pv[1] - y2, 0, 0); i = si; break; }
      case 'Q': { const [qv, qi] = pC(d, i, 4); const p0 = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; const cx1 = p0[0] + (qv[0] - p0[0]) * 2 / 3, cy1 = p0[1] + (qv[1] - p0[1]) * 2 / 3; const cx2 = qv[2] + (qv[0] - qv[2]) * 2 / 3, cy2 = qv[3] + (qv[1] - qv[3]) * 2 / 3; if (cur.o.length) cur.o[cur.o.length - 1] = [cx1 - p0[0], cy1 - p0[1]]; cx = qv[2]; cy = qv[3]; addV(cx, cy, p0[0] - cx2, p0[1] - cy2, 0, 0); i = qi; break; }
      case 'q': { const [qv, qi] = pC(d, i, 4); const p0 = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; const qx1 = p0[0] + qv[0], qy1 = p0[1] + qv[1], qx2 = p0[0] + qv[2], qy2 = p0[1] + qv[3]; const cx1 = p0[0] + (qx1 - p0[0]) * 2 / 3, cy1 = p0[1] + (qy1 - p0[1]) * 2 / 3; const cx2 = qx2 + (qx1 - qx2) * 2 / 3, cy2 = qy2 + (qy1 - qy2) * 2 / 3; if (cur.o.length) cur.o[cur.o.length - 1] = [cx1 - p0[0], cy1 - p0[1]]; cx = qx2; cy = qy2; addV(cx, cy, p0[0] - cx2, p0[1] - cy2, 0, 0); i = qi; break; }
      case 'T': { const [tv, ti] = pC(d, i, 2); const p0 = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; const po = cur.o.length >= 2 ? cur.o[cur.o.length - 2] : [0, 0]; const rfX = p0[0] + (p0[0] - (p0[0] - po[0])), rfY = p0[1] + (p0[1] - (p0[1] - po[1])); const qx1 = p0[0] + (rfX - p0[0]), qy1 = p0[1] + (rfY - p0[1]); const cx1 = p0[0] + (qx1 - p0[0]) * 2 / 3, cy1 = p0[1] + (qy1 - p0[1]) * 2 / 3; const cx2 = tv[0] + (qx1 - tv[0]) * 2 / 3, cy2 = tv[1] + (qy1 - tv[1]) * 2 / 3; if (cur.o.length) cur.o[cur.o.length - 1] = [cx1 - p0[0], cy1 - p0[1]]; cx = tv[0]; cy = tv[1]; addV(cx, cy, p0[0] - cx2, p0[1] - cy2, 0, 0); i = ti; break; }
      case 't': { const [tv, ti] = pC(d, i, 2); const p0 = cur.v.length ? cur.v[cur.v.length - 1] : [cx, cy]; const po = cur.o.length >= 2 ? cur.o[cur.o.length - 2] : [0, 0]; const rfX = p0[0] + (p0[0] - (p0[0] - po[0])), rfY = p0[1] + (p0[1] - (p0[1] - po[1])); const qx1 = p0[0] + (rfX - p0[0]), qy1 = p0[1] + (rfY - p0[1]); const cx1 = p0[0] + (qx1 - p0[0]) * 2 / 3, cy1 = p0[1] + (qy1 - p0[1]) * 2 / 3; const qx2 = p0[0] + tv[0], qy2 = p0[1] + tv[1]; const cx2 = qx2 + (qx1 - qx2) * 2 / 3, cy2 = qy2 + (qy1 - qy2) * 2 / 3; if (cur.o.length) cur.o[cur.o.length - 1] = [cx1 - p0[0], cy1 - p0[1]]; cx = qx2; cy = qy2; addV(cx, cy, p0[0] - cx2, p0[1] - cy2, 0, 0); i = ti; break; }
      case 'A': case 'a': { const [av, ai] = pC(d, i, 7); const rx = Math.abs(av[0]), ry = Math.abs(av[1]), xRot = av[2] * Math.PI / 180; const laf = av[3], sf = av[4]; let ex = av[5], ey = av[6]; if (cmd === 'a') { ex += cx; ey += cy; } if (rx < 0.01 || ry < 0.01) { addV(cx, cy, 0, 0, 0, 0); cx = ex; cy = ey; i = ai; break; } const dx = (cx - ex) / 2, dy = (cy - ey) / 2; const cosR = Math.cos(xRot), sinR = Math.sin(xRot); const x1p = cosR * dx + sinR * dy, y1p = -sinR * dx + cosR * dy; const rx2 = rx * rx, ry2 = ry * ry, x1p2 = x1p * x1p, y1p2 = y1p * y1p; let rad = Math.sqrt(Math.max(0, (rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2))); if (laf === sf) rad = -rad; const cxp = rad * rx * y1p / ry, cyp = -rad * ry * x1p / rx; const ccx = cosR * cxp - sinR * cyp + (cx + ex) / 2, ccy = sinR * cxp + cosR * cyp + (cy + ey) / 2; const startA = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx), endA = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx); let da = endA - startA; if (sf === 0 && da > 0) da -= 2 * Math.PI; if (sf === 1 && da < 0) da += 2 * Math.PI; const segs = Math.max(4, Math.ceil(Math.abs(da) / (Math.PI / 4))); for (let k = 1; k <= segs; k++) { const t = k / segs, a = startA + da * t; const px = ccx + rx * cosR * Math.cos(a) - ry * sinR * Math.sin(a); const py = ccy + rx * sinR * Math.cos(a) + ry * cosR * Math.sin(a); addV(px, py, 0, 0, 0, 0); } cx = ex; cy = ey; i = ai; break; }
      case 'Z': case 'z': { close(); cx = sx; cy = sy; break; }
      default: i++; break;
    }
  }
  emit();
  return shapes;
}

export function buildShape(el) {
  const tag = el.tagName.toLowerCase();
  const bounds = getBounds(el);
  const fill = parseColor(el.getAttribute('fill'));
  const stroke = parseColor(el.getAttribute('stroke'));
  const sw = parseFloat(el.getAttribute('stroke-width')) || 0;
  let shapes;
  switch (tag) {
    case 'rect': { const x = +el.getAttribute('x') || 0, y = +el.getAttribute('y') || 0, w = +el.getAttribute('width') || 100, h = +el.getAttribute('height') || 100; const rx = +el.getAttribute('rx') || 0, rr = Math.min(rx, w / 2, h / 2); const d = rr > 0 ? `M${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h - rr} Q${x + w},${y + h} ${x + w - rr},${y + h} L${x + rr},${y + h} Q${x},${y + h} ${x},${y + h - rr} L${x},${y + rr} Q${x},${y} ${x + rr},${y} Z` : `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`; shapes = pathToShapes(d); break; }
    case 'circle': { const cx = +el.getAttribute('cx') || 50, cy = +el.getAttribute('cy') || 50, r = +el.getAttribute('r') || 40; shapes = pathToShapes(`M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`); break; }
    case 'ellipse': { const cx = +el.getAttribute('cx') || 50, cy = +el.getAttribute('cy') || 50, rx = +el.getAttribute('rx') || 40, ry = +el.getAttribute('ry') || 30; shapes = pathToShapes(`M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy} Z`); break; }
    case 'path': shapes = pathToShapes(el.getAttribute('d') || ''); break;
    case 'line': { const x1 = +el.getAttribute('x1') || 0, y1 = +el.getAttribute('y1') || 0, x2 = +el.getAttribute('x2') || 100, y2 = +el.getAttribute('y2') || 100; shapes = pathToShapes(`M${x1},${y1} L${x2},${y2}`); break; }
    case 'polygon': case 'polyline': { const pts = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number); let d = ''; for (let j = 0; j < pts.length; j += 2) d += (j === 0 ? 'M' : 'L') + pts[j] + ',' + pts[j + 1]; if (tag === 'polygon') d += ' Z'; shapes = pathToShapes(d); break; }
    default: { const b = bounds; shapes = pathToShapes(`M${b.x},${b.y} L${b.x + b.w},${b.y} L${b.x + b.w},${b.y + b.h} L${b.x},${b.y + b.h} Z`); break; }
  }
  return { shapes, fill, stroke, sw, bounds };
}