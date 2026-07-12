export function presetToCSS(name, preset) {
  const kf = preset.keyframes;
  const maxLen = Math.max(...Object.values(kf).map(v => v.length));
  const lines = [];
  for (let i = 0; i < maxLen; i++) {
    const pct = Math.round(i / (maxLen - 1) * 100);
    const props = [];
    if (kf.opacity) props.push(`opacity:${kf.opacity[i]}`);
    const t = [];
    if (kf.scale) t.push(`scale(${kf.scale[i]})`);
    else { const sx = kf.scaleX?.[i] ?? 1, sy = kf.scaleY?.[i] ?? 1; if (sx !== 1 || sy !== 1) t.push(`scale(${sx},${sy})`); }
    if (kf.x || kf.y) t.push(`translate(${kf.x?.[i] ?? 0}px,${kf.y?.[i] ?? 0}px)`);
    if (kf.rotation) t.push(`rotate(${kf.rotation[i]}deg)`);
    if (kf.skewX) t.push(`skewX(${kf.skewX[i]}deg)`);
    if (t.length) props.push(`transform:${t.join(' ')};transform-origin:center;transform-box:fill-box`);
    lines.push(`  ${pct}% { ${props.join('; ')} }`);
  }
  return `@keyframes ${name} {\n${lines.join('\n')}\n}`;
}

export function easingVal(e) {
  return { ease: 'ease', 'ease-in-out': 'ease-in-out', bounce: 'cubic-bezier(.68,-0.55,.27,1.55)', linear: 'linear' }[e] || 'ease';
}