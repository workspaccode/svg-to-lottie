import { PRESETS } from '../data/presets.js';

export function interpKeyframe(kfArray, t01) {
  if (!kfArray || kfArray.length === 0) return 0;
  if (kfArray.length === 1) return kfArray[0];
  const scaled = t01 * (kfArray.length - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;
  if (i >= kfArray.length - 1) return kfArray[kfArray.length - 1];
  return kfArray[i] + (kfArray[i + 1] - kfArray[i]) * frac;
}

export function computeAnimState(anim, time) {
  const preset = PRESETS[anim.preset];
  if (!preset) return { opacity: 1, transform: '' };
  const start = anim.start || 0;
  const delay = anim.delay || 0;
  const dur = anim.duration || 0.6;
  const localTime = time - start - delay;
  if (localTime < 0) return { opacity: 1, transform: '' };
  const t01 = Math.min(localTime / dur, 1);
  const kf = preset.keyframes;
  const opacity = kf.opacity ? interpKeyframe(kf.opacity, t01) : 1;
  const transforms = [];
  if (kf.scale) transforms.push(`scale(${interpKeyframe(kf.scale, t01)})`);
  else {
    const sx = kf.scaleX ? interpKeyframe(kf.scaleX, t01) : 1;
    const sy = kf.scaleY ? interpKeyframe(kf.scaleY, t01) : 1;
    if (sx !== 1 || sy !== 1) transforms.push(`scale(${sx},${sy})`);
  }
  if (kf.x || kf.y) transforms.push(`translate(${interpKeyframe(kf.x || [0, 0], t01)}px,${interpKeyframe(kf.y || [0, 0], t01)}px)`); // eslint-disable-line
  if (kf.rotation) transforms.push(`rotate(${interpKeyframe(kf.rotation, t01)}deg)`);
  if (kf.skewX) transforms.push(`skewX(${interpKeyframe(kf.skewX, t01)}deg)`);
  return { opacity, transform: transforms.join(' ') };
}