export const DEFAULT_SVG = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1c26"/><stop offset="100%" stop-color="#0a0b10"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffd84a"/><stop offset="50%" stop-color="#ff6b4a"/><stop offset="100%" stop-color="#c4ff3d"/>
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f0f1f5"/><stop offset="100%" stop-color="#c0c2cc"/>
    </linearGradient>
  </defs>
  <rect id="background" x="0" y="0" width="400" height="400" fill="url(#skyGrad)"/>
  <g id="stars">
    <circle cx="50" cy="50" r="1.5" fill="#fff" opacity="0.8"/>
    <circle cx="120" cy="30" r="1" fill="#fff"/>
    <circle cx="280" cy="60" r="1.5" fill="#fff" opacity="0.6"/>
    <circle cx="350" cy="40" r="1" fill="#fff"/>
    <circle cx="200" cy="20" r="1" fill="#fff" opacity="0.7"/>
    <circle cx="80" cy="100" r="0.8" fill="#fff"/>
    <circle cx="320" cy="120" r="1" fill="#fff" opacity="0.5"/>
  </g>
  <circle id="planet" cx="340" cy="80" r="22" fill="#ff6b4a"/>
  <ellipse id="planetRing" cx="340" cy="80" rx="34" ry="8" fill="none" stroke="#c4ff3d" stroke-width="1.5" opacity="0.6" transform="rotate(-20 340 80)"/>
  <g id="rocket">
    <path id="body" d="M200,130 Q175,130 175,180 L175,270 Q175,290 200,290 Q225,290 225,270 L225,180 Q225,130 200,130 Z" fill="url(#bodyGrad)"/>
    <path id="bodyAccent" d="M175,240 L225,240 L225,260 Q225,270 215,270 L185,270 Q175,270 175,260 Z" fill="#ff6b4a"/>
    <circle id="window" cx="200" cy="200" r="16" fill="#1a1c26" stroke="#c4ff3d" stroke-width="2"/>
    <circle id="windowInner" cx="200" cy="200" r="9" fill="#c4ff3d"/>
    <path id="leftFin" d="M175,250 L150,290 L175,285 Z" fill="#ff6b4a"/>
    <path id="rightFin" d="M225,250 L250,290 L225,285 Z" fill="#ff6b4a"/>
    <path id="flame" d="M183,290 Q200,335 217,290 Q210,310 200,322 Q190,310 183,290 Z" fill="url(#flameGrad)"/>
  </g>
  <g id="clouds">
    <ellipse id="cloud1" cx="80" cy="340" rx="38" ry="9" fill="#f0f1f5" opacity="0.18"/>
    <ellipse id="cloud2" cx="320" cy="360" rx="48" ry="11" fill="#f0f1f5" opacity="0.12"/>
  </g>
  <rect id="ground" x="0" y="375" width="400" height="25" fill="#1a1c26"/>
</svg>`;