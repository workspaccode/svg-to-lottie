import { PRESETS } from '../data/presets.js';
import { buildShape } from './svgUtils.js';

export function buildLottie(elements, animations, svgEl) {
  const fr = 60;
  const vb = svgEl?.getAttribute('viewBox') || '0 0 400 400';
  const parts = vb.split(/\s+/).map(Number);
  const w = parts[2] || 400, h = parts[3] || 400;
  const layers = [];
  let maxOp = 60;

  const animatedIndices = Object.keys(animations).map(Number).filter(i => i < elements.length);

  animatedIndices.forEach((idx, layerIdx) => {
    const elInfo = elements[idx];
    const a = animations[idx];
    const preset = PRESETS[a.preset];
    if (!preset) return;
    const sd = buildShape(elInfo.el);
    const lottieShapes = [];
    sd.shapes.forEach((s, vi) => {
      const vd = s.v.map((p) => ({
        i: { x: [s.i[vi]?.[0] || 0], y: [s.i[vi]?.[1] || 0] },
        o: { x: [s.o[vi]?.[0] || 0], y: [s.o[vi]?.[1] || 0] },
        c: s.c, v: [p[0], p[1]]
      }));
      lottieShapes.push({ ty: 'sh', d: 1, ks: { a: 0, k: { a: 0, k: [{ t: 0, s: vd }] } } });
    });
    lottieShapes.push({ ty: 'fl', o: { a: 0, k: 100 }, c: { a: 0, k: sd.fill }, r: 1, bm: 0 });
    if (sd.sw > 0) lottieShapes.push({ ty: 'st', o: { a: 0, k: 100 }, c: { a: 0, k: sd.stroke }, w: { a: 0, k: sd.sw }, lc: 1, lj: 1, bm: 0 });

    const startFr = Math.round((a.start || 0) * fr);
    const delayFr = Math.round((a.delay || 0) * fr);
    const durFr = Math.round((a.duration || 0.6) * fr);
    const rep = typeof a.repeat === 'number' ? a.repeat : 1;
    const kf = preset.keyframes;
    const b = sd.bounds;
    const hasX = kf.x?.some(v => v !== 0), hasY = kf.y?.some(v => v !== 0);
    const hasScale = kf.scale?.some(v => v !== 1);
    const hasScaleX = kf.scaleX?.some(v => v !== 1), hasScaleY = kf.scaleY?.some(v => v !== 1);
    const hasRot = kf.rotation?.some(v => v !== 0);
    const hasOpacity = kf.opacity?.some(v => v !== 1);
    const hasSkew = kf.skewX?.some(v => v !== 0);
    const ei = { x: [0.66], y: [0] }, eo = { x: [0.34], y: [1] };

    function mkKF(vals, mult) {
      return vals.map((v, i) => ({
        t: startFr + delayFr + Math.round(i / (vals.length - 1 || 1) * durFr),
        s: [typeof v === 'number' ? v * (mult || 1) : v],
        i: { x: [ei.x[0]], y: [ei.y[0]] }, o: { x: [eo.x[0]], y: [eo.y[0]] }
      }));
    }

    function posKF(xV, yV) {
      const len = Math.max(xV.length, yV.length);
      return Array.from({ length: len }, (_, i) => ({
        t: startFr + delayFr + Math.round(i / (len - 1 || 1) * durFr),
        s: [(xV[i] ?? 0) + b.cx, (yV[i] ?? 0) + b.cy, 0],
        i: { x: [ei.x[0]], y: [ei.y[0]] }, o: { x: [eo.x[0]], y: [eo.y[0]] }, to: [0, 0], ti: [0, 0]
      }));
    }

    const transform = {
      anchor: [b.cx, b.cy, 0],
      position: hasX || hasY ? { a: 1, k: posKF(kf.x || [0, 0], kf.y || [0, 0]) } : { a: 0, k: [b.cx, b.cy, 0] }, // eslint-disable-line
      scale: hasScale ? { a: 1, k: mkKF(kf.scale, 100) } :
        hasScaleX || hasScaleY ? { a: 1, k: (kf.scaleX || kf.scaleY).map((_, i) => ({
          t: startFr + delayFr + Math.round(i / ((kf.scaleX || kf.scaleY).length - 1 || 1) * durFr),
          s: [(kf.scaleX?.[i] ?? 1) * 100, (kf.scaleY?.[i] ?? 1) * 100, 100],
          i: { x: [ei.x[0]], y: [ei.y[0]] }, o: { x: [eo.x[0]], y: [eo.y[0]] }
        })) } : { a: 0, k: [100, 100, 100] },
      rotation: hasRot ? { a: 1, k: mkKF(kf.rotation) } : { a: 0, k: [0] },
      opacity: hasOpacity ? { a: 1, k: mkKF(kf.opacity.map(v => v * 100)) } : { a: 0, k: [100] },
    };

    const layerFrames = startFr + delayFr + durFr * rep;
    if (layerFrames > maxOp) maxOp = layerFrames;

    const layer = {
      dd: 0, ty: 4, nm: elInfo.name, sr: 1, st: 0, ip: startFr, op: layerFrames,
      ks: { a: { a: 0, k: transform.anchor }, p: transform.position, s: transform.scale, r: transform.rotation, o: transform.opacity },
      shapes: lottieShapes, ind: layerIdx + 1
    };
    if (hasSkew) { layer.ks.sk = { a: 1, k: mkKF(kf.skewX) }; layer.ks.sa = { a: 0, k: [0] }; }
    layers.push(layer);
  });

  return { v: '5.5.2', fr, ip: 0, op: maxOp, w, h, nm: 'Animation', ddd: 0, assets: [], layers, markers: [] };
}

export function downloadLottie(lottieData) {
  const blob = new Blob([JSON.stringify(lottieData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lottie-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}