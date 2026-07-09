// ===== State =====
const state = {
  svgContent: null,
  svgElement: null,
  elements: [],
  selectedIndices: [],
  groups: [],
  selectedGroupId: null,
  selectedPreset: null,
  elementAnimations: {},
  currentCategory: 'all',
  lastAssigned: null,
  duration: 0.6,
  delay: 0,
  stagger: 0,
  repeat: 1,
  easing: 'ease',
  injectedStyles: [],
  animTimer: null,
};

// ===== Default SVG =====
const DEFAULT_SVG = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a1c26"/>
      <stop offset="100%" stop-color="#0a0b10"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffd84a"/>
      <stop offset="50%" stop-color="#ff6b4a"/>
      <stop offset="100%" stop-color="#c4ff3d"/>
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f0f1f5"/>
      <stop offset="100%" stop-color="#c0c2cc"/>
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

// ===== Presets (60) =====
const P = (id, name, cat, kf) => ({ id, name, cat, keyframes: kf });
function presetCSS(kf) {
  const parts = [];
  const maxLen = Math.max(...Object.values(kf).map(v => v.length));
  for (let i = 0; i < maxLen; i++) {
    const pct = Math.round(i / (maxLen - 1) * 100);
    const props = [];
    if (kf.opacity) props.push(`opacity: ${kf.opacity[i]};`);
    if (kf.scale) props.push(`transform: scale(${kf.scale[i]});`);
    else if (kf.scaleX || kf.scaleY) props.push(`transform: scale(${kf.scaleX?.[i] ?? 1}, ${kf.scaleY?.[i] ?? 1});`);
    else if (kf.x || kf.y) props.push(`transform: translate(${kf.x?.[i] ?? 0}px, ${kf.y?.[i] ?? 0}px);`);
    if (kf.rotation) props.push(`transform: rotate(${kf.rotation[i]}deg);`);
    parts.push(`${pct}% { ${props.join(' ')} }`);
  }
  return parts.join('\n');
}
const PRESETS = {
  fade: P('fade', 'Fade In', 'entrance', { opacity: [0, 1] }),
  fadeUp: P('fadeUp', 'Fade In Up', 'entrance', { opacity: [0, 1], y: [40, 0] }),
  fadeDown: P('fadeDown', 'Fade In Down', 'entrance', { opacity: [0, 1], y: [-40, 0] }),
  fadeLeft: P('fadeLeft', 'Fade In Left', 'entrance', { opacity: [0, 1], x: [-60, 0] }),
  fadeRight: P('fadeRight', 'Fade In Right', 'entrance', { opacity: [0, 1], x: [60, 0] }),
  fadeScale: P('fadeScale', 'Fade + Scale', 'entrance', { opacity: [0, 1], scale: [0.5, 1] }),
  slideUp: P('slideUp', 'Slide In Up', 'entrance', { y: [80, 0] }),
  slideDown: P('slideDown', 'Slide In Down', 'entrance', { y: [-80, 0] }),
  slideLeft: P('slideLeft', 'Slide In Left', 'entrance', { x: [-120, 0] }),
  slideRight: P('slideRight', 'Slide In Right', 'entrance', { x: [120, 0] }),
  zoomIn: P('zoomIn', 'Zoom In', 'entrance', { scale: [0, 1], opacity: [0, 1] }),
  zoomOut: P('zoomOut', 'Zoom Out (Enter)', 'entrance', { scale: [1.5, 1], opacity: [0, 1] }),
  flipInX: P('flipInX', 'Flip In X', 'entrance', { scaleX: [0, 1], opacity: [0, 1] }),
  flipInY: P('flipInY', 'Flip In Y', 'entrance', { scaleY: [0, 1], opacity: [0, 1] }),
  bounceIn: P('bounceIn', 'Bounce In', 'entrance', { scale: [0, 1.15, 0.9, 1.05, 1], opacity: [0, 1, 1, 1, 1] }),
  pulse: P('pulse', 'Pulse', 'emphasis', { scale: [1, 1.08, 1] }),
  bounce: P('bounce', 'Bounce', 'emphasis', { y: [0, -20, 0] }),
  shake: P('shake', 'Shake', 'emphasis', { x: [0, -10, 10, -10, 10, 0] }),
  headShake: P('headShake', 'Head Shake', 'emphasis', { x: [0, -6, 6, -6, 6, 0], rotation: [0, -8, 8, -8, 8, 0] }),
  swing: P('swing', 'Swing', 'emphasis', { rotation: [0, -10, 10, -5, 5, 0] }),
  tada: P('tada', 'Tada', 'emphasis', { scale: [1, 0.9, 1.1, 1], rotation: [0, -3, 3, -3, 3, 0] }),
  wobble: P('wobble', 'Wobble', 'emphasis', { x: [0, -25, 20, -15, 10, -5, 0], rotation: [0, -5, 3, -3, 2, -1, 0] }),
  jello: P('jello', 'Jello', 'emphasis', { scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1], scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1] }),
  flash: P('flash', 'Flash', 'emphasis', { opacity: [1, 0, 1, 0, 1] }),
  heartBeat: P('heartBeat', 'Heart Beat', 'emphasis', { scale: [1, 1.15, 1, 1.15, 1] }),
  rubber: P('rubber', 'Rubber Band', 'emphasis', { scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1], scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1] }),
  glow: P('glow', 'Glow', 'emphasis', { opacity: [1, 0.6, 1] }),
  wave: P('wave', 'Wave', 'emphasis', { rotation: [0, 8, -8, 6, -6, 3, -3, 0] }),
  spin: P('spin', 'Spin', 'emphasis', { rotation: [0, 360] }),
  spinHalf: P('spinHalf', 'Spin Half', 'emphasis', { rotation: [0, 180] }),
  spinSlow: P('spinSlow', 'Spin Slow', 'emphasis', { rotation: [0, 360] }),
  pulseQuick: P('pulseQuick', 'Pulse Quick', 'emphasis', { scale: [1, 1.05, 1] }),
  vibrate: P('vibrate', 'Vibrate', 'emphasis', { x: [0, -2, 2, -2, 2, -2, 2, 0] }),
  vertBounce: P('vertBounce', 'Vertical Bounce', 'emphasis', { y: [0, -12, 0] }),
  horizBounce: P('horizBounce', 'Horiz Bounce', 'emphasis', { x: [0, 12, -12, 0] }),
  rotateScale: P('rotateScale', 'Rotate + Scale', 'emphasis', { rotation: [0, 360], scale: [1, 1.2, 1] }),
  blink: P('blink', 'Blink', 'emphasis', { opacity: [1, 0, 1, 0, 1, 0, 1] }),
  flip: P('flip', 'Flip', 'emphasis', { scaleX: [1, -1, 1] }),
  wobbleV: P('wobbleV', 'Wobble Vertical', 'emphasis', { y: [0, -8, 6, -5, 3, -2, 0], rotation: [0, -3, 2, -2, 1, 0, 0] }),
  skew: P('skew', 'Skew', 'emphasis', { skewX: [0, -15, 15, -10, 10, 0] }),
  fadeOut: P('fadeOut', 'Fade Out', 'exit', { opacity: [1, 0] }),
  fadeOutUp: P('fadeOutUp', 'Fade Out Up', 'exit', { opacity: [1, 0], y: [0, -40] }),
  fadeOutDown: P('fadeOutDown', 'Fade Out Down', 'exit', { opacity: [1, 0], y: [0, 40] }),
  fadeOutLeft: P('fadeOutLeft', 'Fade Out Left', 'exit', { opacity: [1, 0], x: [0, -60] }),
  fadeOutRight: P('fadeOutRight', 'Fade Out Right', 'exit', { opacity: [1, 0], x: [0, 60] }),
  slideOutUp: P('slideOutUp', 'Slide Out Up', 'exit', { y: [0, -80] }),
  slideOutDown: P('slideOutDown', 'Slide Out Down', 'exit', { y: [0, 80] }),
  slideOutLeft: P('slideOutLeft', 'Slide Out Left', 'exit', { x: [0, -120] }),
  slideOutRight: P('slideOutRight', 'Slide Out Right', 'exit', { x: [0, 120] }),
  zoomOutExit: P('zoomOutExit', 'Zoom Out', 'exit', { scale: [1, 0], opacity: [1, 0] }),
  zoomOutBig: P('zoomOutBig', 'Zoom Out Big', 'exit', { scale: [1, 2], opacity: [1, 0] }),
  flipOutX: P('flipOutX', 'Flip Out X', 'exit', { scaleX: [1, 0], opacity: [1, 0] }),
  flipOutY: P('flipOutY', 'Flip Out Y', 'exit', { scaleY: [1, 0], opacity: [1, 0] }),
  bounceOut: P('bounceOut', 'Bounce Out', 'exit', { scale: [1, 1.15, 0.9, 0], opacity: [1, 1, 1, 0] }),
  collapse: P('collapse', 'Collapse', 'exit', { scaleY: [1, 0], opacity: [1, 0] }),
  fold: P('fold', 'Fold', 'exit', { scaleX: [1, 0], opacity: [1, 0], x: [0, 60] }),
  dissolve: P('dissolve', 'Dissolve', 'exit', { opacity: [1, 0.8, 0.5, 0.2, 0] }),
  dropOut: P('dropOut', 'Drop Out', 'exit', { y: [0, 120], opacity: [1, 0], rotation: [0, 20] }),
  wipeOut: P('wipeOut', 'Wipe Out', 'exit', { scaleX: [1, 0] }),
  vanish: P('vanish', 'Vanish', 'exit', { opacity: [1, 0], scale: [1, 0.8] }),
};
const PRESET_LIST = Object.values(PRESETS);
const CATEGORIES = ['all', 'entrance', 'emphasis', 'exit'];

const ELEMENT_COLORS = ['#ff6b4a', '#c4ff3d', '#4ade80', '#a78bfa', '#fbbf24', '#60a5fa', '#f472b6', '#34d399', '#fb923c', '#22d3ee', '#facc15', '#e879f9'];

function getElementColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return ELEMENT_COLORS[Math.abs(hash) % ELEMENT_COLORS.length];
}

function cssEscape(s) {
  if (window.CSS && CSS.escape) return CSS.escape(s);
  return String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

// ===== DOM refs =====
const $ = (sel) => document.querySelector(sel);
const elementsList = $('#elementsList');
const groupsList = $('#groupsList');
const svgCanvas = $('#svgCanvas');
const presetGrid = $('#presetGrid');
const canvasInfo = $('#canvasInfo');
const selectedInfo = $('#selectedInfo');
const elementCountEl = $('#elementCount');
const groupCountEl = $('#groupCount');
const animIndicator = $('#animIndicator');
const animText = $('#animText');
const createGroupBtn = $('#createGroupBtn');
const staggerControl = $('#staggerControl');

// ===== Init presets (60 with category tabs) =====
function initPresets() {
  const header = document.createElement('div');
  header.className = 'preset-categories';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'preset-cat-btn' + (cat === state.currentCategory ? ' active' : '');
    btn.textContent = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.addEventListener('click', () => {
      state.currentCategory = cat;
      renderPresets();
      header.querySelectorAll('.preset-cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    });
    btn.dataset.cat = cat;
    header.appendChild(btn);
  });
  presetGrid.parentNode.insertBefore(header, presetGrid);
  renderPresets();
}

function renderPresets() {
  presetGrid.innerHTML = '';
  const filtered = state.currentCategory === 'all' ? PRESET_LIST : PRESET_LIST.filter(p => p.cat === state.currentCategory);
  filtered.forEach(preset => {
    const card = document.createElement('div');
    card.className = 'preset-card preset-card-sm' + (preset.id === state.selectedPreset ? ' selected' : '');
    card.dataset.preset = preset.id;
    card.innerHTML = `<div class="preset-name">${preset.name}</div><div class="preset-cat-tag">${preset.cat}</div>`;
    card.addEventListener('click', () => selectPreset(preset.id));
    presetGrid.appendChild(card);
  });
}

// ===== Load SVG =====
function loadSVG(svgText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) throw new Error('Invalid SVG markup');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) throw new Error('No <svg> root element found');

    clearInjectedStyles();
    state.svgContent = svgText;
    state.svgElement = svgEl.cloneNode(true);

    // Ensure pointer events on all drawable elements
    state.svgElement.querySelectorAll('*').forEach(el => {
      if (el.style) el.style.pointerEvents = 'auto';
    });

    svgCanvas.innerHTML = '';
    svgCanvas.appendChild(state.svgElement);

    parseElements();
    renderElementsList();
    renderGroups();

    state.selectedIndices = [];
    state.selectedGroupId = null;
    state.groups = [];
    state.selectedPreset = null;
    state.elementAnimations = {};
    document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('selected'));
    updateSelectionUI();

    const vb = svgEl.getAttribute('viewBox') || '';
    canvasInfo.textContent = vb ? `viewBox ${vb}` : 'SVG loaded';
    showToast(`SVG loaded · ${state.elements.length} elements found`, 'success');
  } catch (err) {
    showToast('Failed to load SVG: ' + err.message, 'error');
  }
}

// ===== Parse ALL drawable elements (auto-name unnamed ones) =====
function parseElements() {
  state.elements = [];
  const drawableTags = ['rect', 'circle', 'ellipse', 'path', 'text', 'g', 'polygon', 'polyline', 'line', 'image', 'use'];
  const counters = {};
  const allElements = state.svgElement.querySelectorAll('*');

  allElements.forEach(el => {
    const tag = el.tagName.toLowerCase();
    if (!drawableTags.includes(tag)) return;

    let id = el.getAttribute('id');
    let dataName = el.getAttribute('data-name');
    let name = id || dataName;
    let autoNamed = false;

    if (!name) {
      // Auto-name unnamed elements
      counters[tag] = (counters[tag] || 0) + 1;
      name = `${tag}-${counters[tag]}`;
      // Assign a real id so CSS can target it
      id = `sas-${tag}-${counters[tag]}`;
      // Make sure id is unique
      while (state.svgElement.querySelector(`#${cssEscape(id)}`)) {
        counters[tag]++;
        id = `sas-${tag}-${counters[tag]}`;
        name = `${tag}-${counters[tag]}`;
      }
      el.setAttribute('id', id);
      autoNamed = true;
    }

    state.elements.push({
      el, name, tag, id,
      color: getElementColor(name),
      selector: `#${cssEscape(id)}`,
      autoNamed
    });
  });
}

// ===== Render elements list =====
function renderElementsList() {
  elementsList.innerHTML = '';
  elementCountEl.textContent = state.elements.length;

  if (state.elements.length === 0) {
    elementsList.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div>No drawable elements found.</div>
    </div>`;
    return;
  }

  state.elements.forEach((item, idx) => {
    const elItem = document.createElement('div');
    elItem.className = 'element-item';
    elItem.dataset.idx = idx;
    const assigned = state.elementAnimations[idx];
    elItem.innerHTML = `
      <div class="element-dot" style="background:${item.color};color:${item.color};"></div>
      <div class="element-name">${item.name}</div>
      ${item.autoNamed ? '<span class="element-auto-badge">AUTO</span>' : ''}
      <div class="element-tag">${item.tag}</div>
      ${assigned ? `<span class="element-anim-badge">${PRESETS[assigned.preset]?.name || assigned.preset}</span>` : ''}`;
    elItem.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey) {
        toggleInSelection(idx);
      } else {
        selectSingle(idx);
      }
    });
    elItem.addEventListener('mouseenter', () => {
      if (!state.selectedIndices.includes(idx)) {
        item.el.classList.add('hover-element');
      }
    });
    elItem.addEventListener('mouseleave', () => {
      item.el.classList.remove('hover-element');
    });
    elementsList.appendChild(elItem);
  });
}

// ===== Render groups =====
function renderGroups() {
  groupsList.innerHTML = '';
  groupCountEl.textContent = state.groups.length;

  if (state.groups.length === 0) {
    groupsList.innerHTML = `<div class="empty-state" style="padding:16px 12px;font-size:11px;">
      Select 2+ elements, then click "Group" to create a group.
    </div>`;
    return;
  }

  state.groups.forEach(group => {
    const item = document.createElement('div');
    item.className = 'group-item';
    item.dataset.groupId = group.id;
    if (state.selectedGroupId === group.id) item.classList.add('selected');
    item.innerHTML = `
      <div class="element-dot" style="background:${group.color};color:${group.color};"></div>
      <div class="element-name">${group.name}</div>
      <div class="element-tag">${group.indices.length}</div>
      <button class="group-delete" data-group-id="${group.id}" title="Delete group">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    item.addEventListener('click', (e) => {
      if (e.target.closest('.group-delete')) return;
      selectGroup(group.id);
    });
    groupsList.appendChild(item);
  });

  groupsList.querySelectorAll('.group-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteGroup(btn.dataset.groupId);
    });
  });
}

// ===== Preview on select =====
function previewAssignedAnimation(idx) {
  const anim = state.elementAnimations[idx];
  if (!anim || !state.svgElement) return;
  const el = state.elements[idx]?.el;
  if (!el) return;
  const preset = PRESETS[anim.preset];
  if (!preset) return;
  const animName = `quick-${anim.preset}-${idx}`;
  const easingVal = getEasingValue(anim.easing);
  let css = presetToCSS(animName, preset);
  css += `\n#svgCanvas ${state.elements[idx].selector} {\n  animation: ${animName} ${Math.min(anim.duration, 0.8)}s ${easingVal} ${anim.delay}s 1 both;\n}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  state.injectedStyles.push(style);
  el.classList.add('anim-preview');
  const dur = (anim.delay + Math.min(anim.duration, 0.8)) * 1000 + 100;
  setTimeout(() => {
    el.classList.remove('anim-preview');
  }, dur);
}

function addClickFeedback(el) {
  if (!el) return;
  el.classList.remove('click-feedback');
  void el.offsetWidth;
  el.classList.add('click-feedback');
  setTimeout(() => el.classList.remove('click-feedback'), 300);
}

// ===== Selection =====
function selectSingle(idx) {
  state.selectedIndices = [idx];
  state.selectedGroupId = null;
  updateSelectionUI();
  loadElementAnimation(idx);
  addClickFeedback(state.elements[idx]?.el);
  setTimeout(() => previewAssignedAnimation(idx), 100);
}

function loadElementAnimation(idx) {
  const anim = state.elementAnimations[idx] || state.lastAssigned;
  // Load preset
  if (anim.preset) {
    state.selectedPreset = anim.preset;
    document.querySelectorAll('.preset-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.preset === anim.preset);
    });
  }
  // Load duration
  if (anim.duration != null) {
    state.duration = anim.duration;
    $('#durationSlider').value = anim.duration;
    $('#durationValue').textContent = anim.duration.toFixed(1) + 's';
  }
  // Load delay
  if (anim.delay != null) {
    state.delay = anim.delay;
    $('#delaySlider').value = anim.delay;
    $('#delayValue').textContent = anim.delay.toFixed(1) + 's';
  }
  // Load repeat
  if (anim.repeat != null) {
    state.repeat = anim.repeat;
    document.querySelectorAll('[data-repeat]').forEach(b => {
      b.classList.toggle('active', (b.dataset.repeat === 'infinite' ? 'infinite' : parseInt(b.dataset.repeat)) === anim.repeat);
    });
  }
  // Load easing
  if (anim.easing) {
    state.easing = anim.easing;
    document.querySelectorAll('[data-easing]').forEach(b => {
      b.classList.toggle('active', b.dataset.easing === anim.easing);
    });
  }
}

function toggleInSelection(idx) {
  state.selectedGroupId = null;
  const i = state.selectedIndices.indexOf(idx);
  if (i !== -1) {
    state.selectedIndices.splice(i, 1);
  } else {
    state.selectedIndices.push(idx);
    addClickFeedback(state.elements[idx]?.el);
    setTimeout(() => previewAssignedAnimation(idx), 100);
  }
  updateSelectionUI();
}

function selectAll() {
  state.selectedIndices = state.elements.map((_, i) => i);
  state.selectedGroupId = null;
  updateSelectionUI();
}

function clearSelection() {
  state.selectedIndices = [];
  state.selectedGroupId = null;
  updateSelectionUI();
  if (state.svgElement) {
    state.svgElement.querySelectorAll('.click-feedback').forEach(el => el.classList.remove('click-feedback'));
  }
}

function selectGroup(groupId) {
  const group = state.groups.find(g => g.id === groupId);
  if (!group) return;
  state.selectedIndices = [...group.indices];
  state.selectedGroupId = groupId;
  updateSelectionUI();
}

function updateSelectionUI() {
  // Update sidebar items
  document.querySelectorAll('.element-item').forEach((el, i) => {
    el.classList.toggle('selected', state.selectedIndices.includes(i));
  });

  // Update group items
  document.querySelectorAll('.group-item').forEach(el => {
    el.classList.toggle('selected', el.dataset.groupId === state.selectedGroupId);
  });

  // Update canvas visuals
  if (state.svgElement) {
    state.svgElement.querySelectorAll('.selected-element').forEach(el => {
      el.classList.remove('selected-element');
    });
    state.selectedIndices.forEach(idx => {
      if (state.elements[idx]) {
        state.elements[idx].el.classList.add('selected-element');
        state.elements[idx].el.classList.remove('hover-element');
      }
    });
  }

  // Update info bar
  if (state.selectedIndices.length === 0) {
    selectedInfo.textContent = 'No element selected';
  } else if (state.selectedIndices.length === 1) {
    const el = state.elements[state.selectedIndices[0]];
    selectedInfo.textContent = `${el.tag} · ${el.name}`;
  } else {
    if (state.selectedGroupId) {
      const group = state.groups.find(g => g.id === state.selectedGroupId);
      selectedInfo.textContent = `${group ? group.name : 'Group'} · ${state.selectedIndices.length} elements`;
    } else {
      selectedInfo.textContent = `${state.selectedIndices.length} elements selected`;
    }
  }

  // Show/hide stagger control
  const showStagger = state.selectedIndices.length > 1;
  staggerControl.classList.toggle('control-hidden', !showStagger);

  // Show/hide create group button
  createGroupBtn.style.display = state.selectedIndices.length >= 2 ? 'inline-flex' : 'none';
}

// ===== Groups =====
function createGroup() {
  if (state.selectedIndices.length < 2) return;
  const groupNum = state.groups.length + 1;
  const group = {
    id: 'group-' + Date.now(),
    name: `Group ${groupNum}`,
    color: getElementColor('group-' + groupNum + '-' + Date.now()),
    indices: [...state.selectedIndices]
  };
  state.groups.push(group);
  state.selectedGroupId = group.id;
  renderGroups();
  updateSelectionUI();
  showToast(`"${group.name}" created with ${group.indices.length} elements`, 'success');
}

function deleteGroup(groupId) {
  state.groups = state.groups.filter(g => g.id !== groupId);
  if (state.selectedGroupId === groupId) {
    state.selectedGroupId = null;
  }
  renderGroups();
  updateSelectionUI();
  showToast('Group deleted', 'success');
}

// ===== Preset selection =====
function selectPreset(key) {
  state.selectedPreset = key;
  document.querySelectorAll('.preset-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.preset === key);
  });
}

// ===== Assign animation to selected element(s) =====
  $('#assignBtn').addEventListener('click', () => {
  if (state.selectedIndices.length === 0) { showToast('Select element(s) first', 'error'); return; }
  if (!state.selectedPreset) { showToast('Select a preset first', 'error'); return; }
  const dur = state.duration;
  const del = state.delay;
  const rep = state.repeat;
  const eas = state.easing;
  state.selectedIndices.forEach(idx => {
    state.elementAnimations[idx] = { preset: state.selectedPreset, duration: dur, delay: del, repeat: rep, easing: eas };
  });
  state.lastAssigned = { preset: state.selectedPreset, duration: dur, delay: del, repeat: rep, easing: eas };
  renderElementsList();
  const label = state.selectedIndices.length === 1
    ? state.elements[state.selectedIndices[0]].name
    : `${state.selectedIndices.length} elements`;
  showToast(`Assigned "${PRESETS[state.selectedPreset].name}" to ${label}`, 'success');
});

// ===== Controls =====
  $('#durationSlider').addEventListener('input', (e) => {
  state.duration = parseFloat(e.target.value);
  $('#durationValue').textContent = state.duration.toFixed(1) + 's';
});
 $('#delaySlider').addEventListener('input', (e) => {
  state.delay = parseFloat(e.target.value);
  $('#delayValue').textContent = state.delay.toFixed(1) + 's';
});
 $('#staggerSlider').addEventListener('input', (e) => {
  state.stagger = parseFloat(e.target.value);
  $('#staggerValue').textContent = Math.round(state.stagger) + 'ms';
});
document.querySelectorAll('[data-repeat]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-repeat]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const val = btn.dataset.repeat;
    state.repeat = val === 'infinite' ? 'infinite' : parseInt(val);
  });
});
document.querySelectorAll('[data-easing]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-easing]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.easing = btn.dataset.easing;
  });
});

function getEasingValue(easing) {
  const map = {
    'ease': 'ease',
    'ease-in-out': 'ease-in-out',
    'bounce': 'cubic-bezier(.68, -0.55, .27, 1.55)',
    'linear': 'linear'
  };
  return map[easing] || 'ease';
}

// ===== Generate CSS from numeric keyframe data =====
function presetToCSS(name, preset) {
  const kf = preset.keyframes;
  const maxLen = Math.max(...Object.values(kf).map(v => v.length));
  const lines = [];
  for (let i = 0; i < maxLen; i++) {
    const pct = Math.round(i / (maxLen - 1) * 100);
    const props = [];
    if (kf.opacity) props.push(`opacity: ${kf.opacity[i]};`);
    const transforms = [];
    if (kf.scale) transforms.push(`scale(${kf.scale[i]})`);
    else {
      const sx = kf.scaleX?.[i] ?? 1;
      const sy = kf.scaleY?.[i] ?? 1;
      if (sx !== 1 || sy !== 1) transforms.push(`scale(${sx}, ${sy})`);
    }
    if (kf.x || kf.y) transforms.push(`translate(${kf.x?.[i] ?? 0}px, ${kf.y?.[i] ?? 0}px)`);
    if (kf.rotation) transforms.push(`rotate(${kf.rotation[i]}deg)`);
    if (kf.skewX) transforms.push(`skewX(${kf.skewX[i]}deg)`);
    if (transforms.length) props.push(`transform: ${transforms.join(' ')}; transform-origin: center; transform-box: fill-box;`);
    lines.push(`  ${pct}% { ${props.join(' ')} }`);
  }
  return `@keyframes ${name} {\n${lines.join('\n')}\n}`;
}

function generateCSS() {
  if (state.selectedIndices.length === 0 || !state.selectedPreset) return null;
  const preset = PRESETS[state.selectedPreset];
  const animName = `anim-${state.selectedPreset}`;
  const repeat = state.repeat === 'infinite' ? 'infinite' : state.repeat;
  const easingVal = getEasingValue(state.easing);

  let css = presetToCSS(animName, preset) + '\n';

  if (state.selectedIndices.length === 1 || state.stagger === 0) {
    const selectors = state.selectedIndices.map(idx =>
      `#svgCanvas ${state.elements[idx].selector}`
    ).join(',\n');
    css += `\n${selectors} {\n  animation: ${animName} ${state.duration}s ${easingVal} ${state.delay}s ${repeat} both;\n}`;
  } else {
    state.selectedIndices.forEach((idx, i) => {
      const staggerDelay = state.delay + (state.stagger * i / 1000);
      css += `\n#svgCanvas ${state.elements[idx].selector} {\n  animation: ${animName} ${state.duration}s ${easingVal} ${staggerDelay.toFixed(2)}s ${repeat} both;\n}`;
    });
  }

  return { css, animName, preset, indices: state.selectedIndices };
}

// ===== Run animation =====
 $('#runBtn').addEventListener('click', () => {
  if (state.selectedIndices.length === 0) {
    showToast('Select at least one element first', 'error');
    return;
  }
  if (!state.selectedPreset) {
    showToast('Select an animation preset', 'error');
    return;
  }
  const result = generateCSS();
  if (!result) return;

  clearInjectedStyles();
  const style = document.createElement('style');
  style.textContent = result.css;
  document.head.appendChild(style);
  state.injectedStyles.push(style);

  // Show indicator
  const elemDesc = result.indices.length === 1
    ? state.elements[result.indices[0]].name
    : `${result.indices.length} elements`;
  animText.textContent = `${result.preset.name} → ${elemDesc}`;
  animIndicator.classList.add('active');

  if (state.animTimer) clearTimeout(state.animTimer);
  if (state.repeat !== 'infinite') {
    const lastStagger = state.stagger * (result.indices.length - 1) / 1000;
    const totalTime = (state.delay + lastStagger + state.duration * (state.repeat === 'infinite' ? 1 : state.repeat)) * 1000;
    state.animTimer = setTimeout(() => {
      animIndicator.classList.remove('active');
    }, totalTime + 150);
  }

  showToast(`Running ${result.preset.name} on ${elemDesc}`, 'success');
});

// ===== Reset =====
 $('#resetBtn').addEventListener('click', () => {
  clearInjectedStyles();
  clearSelection();
  state.selectedPreset = null;
  document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('selected'));
  animIndicator.classList.remove('active');
  showToast('Reset complete', 'success');
});

function clearInjectedStyles() {
  state.injectedStyles.forEach(s => s.remove());
  state.injectedStyles = [];
  if (state.animTimer) { clearTimeout(state.animTimer); state.animTimer = null; }
}

// ===== Export CSS =====
 $('#exportCssBtn').addEventListener('click', () => {
  if (state.selectedIndices.length === 0) {
    showToast('Select at least one element first', 'error');
    return;
  }
  if (!state.selectedPreset) {
    showToast('Select an animation preset first', 'error');
    return;
  }
  const result = generateCSS();
  if (!result) return;
  const highlighted = highlightCSS(result.css);
  $('#cssOutput').innerHTML = highlighted;
  $('#cssModal').classList.add('active');
});

function highlightCSS(css) {
  return css
    .replace(/(@keyframes [\w-]+)/g, '<span class="kw">$1</span>')
    .replace(/(\d+%\s*\{)/g, '<span class="num">$1</span>')
    .replace(/(#[\w-]+|\[[^\]]+\])/g, '<span class="sel">$1</span>')
    .replace(/([\w-]+)(\s*:)/g, '<span class="prop">$1</span>$2')
    .replace(/(\b\d+\.?\d*s?\b|\binfinite\b|\bboth\b|\bease(?:-in-out)?\b|\blinear\b|cubic-bezier\([^)]+\))/g, '<span class="num">$1</span>');
}

 $('#copyCssBtn').addEventListener('click', async () => {
  const css = $('#cssOutput').textContent;
  try {
    await navigator.clipboard.writeText(css);
    showToast('CSS copied to clipboard', 'success');
    $('#cssModal').classList.remove('active');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = css;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('CSS copied to clipboard', 'success'); }
    catch { showToast('Failed to copy', 'error'); }
    document.body.removeChild(ta);
    $('#cssModal').classList.remove('active');
  }
});

 $('#closeCssModal').addEventListener('click', () => $('#cssModal').classList.remove('active'));
 $('#closeCssModalBtn').addEventListener('click', () => $('#cssModal').classList.remove('active'));

// ===== Export Lottie (uses per-element assigned animations, with fallback to current selection) =====
 $('#exportLottieBtn').addEventListener('click', () => {
  const lottie = generateLottie();
  if (!lottie) return;
  const json = JSON.stringify(lottie, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lottie-animation-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Lottie JSON exported', 'success');
});

function parseLottieColor(val) {
  if (!val || val === 'none') return [0, 0, 0, 0];
  const named = { red:[1,0,0,1], green:[0,0.5,0,1], blue:[0,0,1,1], white:[1,1,1,1], black:[0,0,0,1], yellow:[1,1,0,1], cyan:[0,1,1,1], magenta:[1,0,1,1], orange:[1,0.65,0,1], purple:[0.5,0,0.5,1], pink:[1,0.75,0.8,1], gray:[0.5,0.5,0.5,1], transparent:[0,0,0,0], currentcolor:[1,1,1,1] };
  const lower = val.trim().toLowerCase();
  if (named[lower]) return named[lower];
  if (lower.startsWith('url(')) return [1,1,1,1];
  if (lower.startsWith('rgb')) {
    const m = lower.match(/[\d.]+/g);
    if (m) return [parseInt(m[0])/255, parseInt(m[1])/255, parseInt(m[2])/255, 1];
  }
  const v = val.replace('#', '');
  return [parseInt(v.substring(0, 2), 16) / 255 || 0, parseInt(v.substring(2, 4), 16) / 255 || 0, parseInt(v.substring(4, 6), 16) / 255 || 0, 1];
}

function getElementBounds(el) {
  try {
    const bbox = el.getBBox ? el.getBBox() : { x: 0, y: 0, width: 100, height: 100 };
    return { x: bbox.x, y: bbox.y, w: bbox.width, h: bbox.height, cx: bbox.x + bbox.width / 2, cy: bbox.y + bbox.height / 2 };
  } catch { return { x: 0, y: 0, w: 100, h: 100, cx: 50, cy: 50 }; }
}

function svgPathToLottie(d) {
  const shapes = [];
  let cur = { i: [], o: [], v: [], c: false };
  let cx = 0, cy = 0, sx = 0, sy = 0;
  function close() { if (cur.v.length) { cur.c = true; shapes.push(cur); } cur = { i: [], o: [], v: [], c: false }; }
  function emit() { if (cur.v.length) { shapes.push(cur); cur = { i: [], o: [], v: [], c: false }; } }
  function addV(x, y, ix, iy, ox, oy) { cur.v.push([x, y]); cur.i.push([ix, iy]); cur.o.push([ox, oy]); }
  function pN(s, i) { const m = s.substring(i).match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/); return m ? [parseFloat(m[0]), i + m[0].length] : [0, i]; }
  function pC(s, i, n) { const vals = []; while (vals.length < n && i < s.length) { const [v, ni] = pN(s, i); vals.push(v); i = ni; while (i < s.length && /[\s,]/.test(s[i])) i++; } return [vals, i]; }

  let i = 0;
  while (i < d.length) {
    while (i < d.length && /[\s,]/.test(d[i])) i++;
    if (i >= d.length) break;
    const cmd = d[i]; i++;
    while (i < d.length && /[\s,]/.test(d[i])) i++;
    switch (cmd) {
      case 'M': { emit(); const [v,ni]=pC(d,i,2); cx=v[0]; cy=v[1]; sx=cx; sy=cy; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'm': { emit(); const [v,ni]=pC(d,i,2); cx+=v[0]; cy+=v[1]; sx=cx; sy=cy; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'L': { const [v,ni]=pC(d,i,2); cx=v[0]; cy=v[1]; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'l': { const [v,ni]=pC(d,i,2); cx+=v[0]; cy+=v[1]; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'H': { const [v,ni]=pC(d,i,1); cx=v[0]; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'h': { const [v,ni]=pC(d,i,1); cx+=v[0]; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'V': { const [v,ni]=pC(d,i,1); cy=v[0]; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'v': { const [v,ni]=pC(d,i,1); cy+=v[0]; addV(cx,cy,0,0,0,0); i=ni; break; }
      case 'C': {
        const [cv,ci]=pC(d,i,6); const x1=cv[0],y1=cv[1],x2=cv[2],y2=cv[3],x3=cv[4],y3=cv[5];
        const pv = cur.v.length ? cur.v[cur.v.length-1] : [cx,cy];
        if (cur.o.length) { cur.o[cur.o.length-1] = [x1-pv[0], y1-pv[1]]; }
        cx=x3; cy=y3; addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0); i=ci; break;
      }
      case 'c': {
        const [cv,ci]=pC(d,i,6); const x1=cx+cv[0],y1=cy+cv[1],x2=cx+cv[2],y2=cy+cv[3],x3=cx+cv[4],y3=cy+cv[5];
        const pv = cur.v.length ? cur.v[cur.v.length-1] : [cx,cy];
        if (cur.o.length) { cur.o[cur.o.length-1] = [x1-pv[0], y1-pv[1]]; }
        cx=x3; cy=y3; addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0); i=ci; break;
      }
      case 'S': {
        const [sv,si]=pC(d,i,4); const x2=sv[0],y2=sv[1],x3=sv[2],y3=sv[3];
        const pv = cur.v.length ? cur.v[cur.v.length-1] : [cx,cy];
        const po = cur.o.length ? cur.o[cur.o.length-1] : [0,0];
        const x1 = pv[0] + (pv[0]-(pv[0]-po[0])), y1 = pv[1] + (pv[1]-(pv[1]-po[1]));
        if (cur.o.length) { cur.o[cur.o.length-1] = [x1-pv[0], y1-pv[1]]; }
        cx=x3; cy=y3; addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0); i=si; break;
      }
      case 's': {
        const [sv,si]=pC(d,i,4); const pv=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];
        const po=cur.o.length?cur.o[cur.o.length-1]:[0,0];
        const x1=pv[0]+(pv[0]-(pv[0]-po[0])),y1=pv[1]+(pv[1]-(pv[1]-po[1]));
        const x2=pv[0]+sv[0],y2=pv[1]+sv[1],x3=pv[0]+sv[2],y3=pv[1]+sv[3];
        if(cur.o.length){cur.o[cur.o.length-1]=[x1-pv[0],y1-pv[1]];}
        cx=x3;cy=y3;addV(cx,cy,pv[0]-x2,pv[1]-y2,0,0);i=si;break;
      }
      case 'Q': {
        const [qv,qi]=pC(d,i,4);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];
        const cx1=p0[0]+(qv[0]-p0[0])*2/3,cy1=p0[1]+(qv[1]-p0[1])*2/3;
        const cx2=qv[2]+(qv[0]-qv[2])*2/3,cy2=qv[3]+(qv[1]-qv[3])*2/3;
        if(cur.o.length){cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];}
        cx=qv[2];cy=qv[3];addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=qi;break;
      }
      case 'q': {
        const [qv,qi]=pC(d,i,4);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];
        const qx1=p0[0]+qv[0],qy1=p0[1]+qv[1],qx2=p0[0]+qv[2],qy2=p0[1]+qv[3];
        const cx1=p0[0]+(qx1-p0[0])*2/3,cy1=p0[1]+(qy1-p0[1])*2/3;
        const cx2=qx2+(qx1-qx2)*2/3,cy2=qy2+(qy1-qy2)*2/3;
        if(cur.o.length){cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];}
        cx=qx2;cy=qy2;addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=qi;break;
      }
      case 'T': {
        const [tv,ti]=pC(d,i,2);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];
        const po=cur.o.length>=2?cur.o[cur.o.length-2]:[0,0];
        const rfX=p0[0]+(p0[0]-(p0[0]-po[0])),rfY=p0[1]+(p0[1]-(p0[1]-po[1]));
        const qx1=p0[0]+(rfX-p0[0]),qy1=p0[1]+(rfY-p0[1]);
        const cx1=p0[0]+(qx1-p0[0])*2/3,cy1=p0[1]+(qy1-p0[1])*2/3;
        const cx2=tv[0]+(qx1-tv[0])*2/3,cy2=tv[1]+(qy1-tv[1])*2/3;
        if(cur.o.length){cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];}
        cx=tv[0];cy=tv[1];addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=ti;break;
      }
      case 't': {
        const [tv,ti]=pC(d,i,2);const p0=cur.v.length?cur.v[cur.v.length-1]:[cx,cy];
        const po=cur.o.length>=2?cur.o[cur.o.length-2]:[0,0];
        const rfX=p0[0]+(p0[0]-(p0[0]-po[0])),rfY=p0[1]+(p0[1]-(p0[1]-po[1]));
        const qx1=p0[0]+(rfX-p0[0]),qy1=p0[1]+(rfY-p0[1]);
        const cx1=p0[0]+(qx1-p0[0])*2/3,cy1=p0[1]+(qy1-p0[1])*2/3;
        const qx2=p0[0]+tv[0],qy2=p0[1]+tv[1];
        const cx2=qx2+(qx1-qx2)*2/3,cy2=qy2+(qy1-qy2)*2/3;
        if(cur.o.length){cur.o[cur.o.length-1]=[cx1-p0[0],cy1-p0[1]];}
        cx=qx2;cy=qy2;addV(cx,cy,p0[0]-cx2,p0[1]-cy2,0,0);i=ti;break;
      }
      case 'A': case 'a': {
        const [av,ai]=pC(d,i,7);const rx=Math.abs(av[0]),ry=Math.abs(av[1]),xRot=av[2]*Math.PI/180;
        const laf=av[3],sf=av[4];
        let ex=av[5],ey=av[6];
        if(cmd==='a'){ex+=cx;ey+=cy;}
        if(rx<0.01||ry<0.01){addV(cx,cy,0,0,0,0);cx=ex;cy=ey;i=ai;break;}
        // SVG arc → center parameterization
        const dx=(cx-ex)/2,dy=(cy-ey)/2;
        const cosR=Math.cos(xRot),sinR=Math.sin(xRot);
        const x1p=cosR*dx+sinR*dy,y1p=-sinR*dx+cosR*dy;
        const rx2=rx*rx,ry2=ry*ry,x1p2=x1p*x1p,y1p2=y1p*y1p;
        let rad=Math.sqrt(Math.max(0,(rx2*ry2-rx2*y1p2-ry2*x1p2)/(rx2*y1p2+ry2*x1p2)));
        if(laf===sf)rad=-rad;
        const cxp=rad*rx*y1p/ry,cyp=-rad*ry*x1p/rx;
        const ccx=cosR*cxp-sinR*cyp+(cx+ex)/2,ccy=sinR*cxp+cosR*cyp+(cy+ey)/2;
        const startA=Math.atan2((y1p-cyp)/ry,(x1p-cxp)/rx),endA=Math.atan2((-y1p-cyp)/ry,(-x1p-cxp)/rx);
        let da=endA-startA;
        if(sf===0&&da>0)da-=2*Math.PI;
        if(sf===1&&da<0)da+=2*Math.PI;
        const segs=Math.max(4,Math.ceil(Math.abs(da)/(Math.PI/4)));
        for(let k=1;k<=segs;k++){
          const t=k/segs,a=startA+da*t;
          const px=ccx+rx*cosR*Math.cos(a)-ry*sinR*Math.sin(a);
          const py=ccy+rx*sinR*Math.cos(a)+ry*cosR*Math.sin(a);
          addV(px,py,0,0,0,0);
        }
        cx=ex;cy=ey;i=ai;break;
      }
      case 'Z':case 'z':{close();cx=sx;cy=sy;break;}
      default: i++; break;
    }
  }
  emit();
  return shapes;
}

function buildLottieShape(el) {
  const tag = el.tagName.toLowerCase();
  const bounds = getElementBounds(el);
  const fill = parseLottieColor(el.getAttribute('fill'));
  const stroke = parseLottieColor(el.getAttribute('stroke'));
  const sw = parseFloat(el.getAttribute('stroke-width')) || 0;
  let shapeData;

  switch (tag) {
    case 'rect': {
      const x = parseFloat(el.getAttribute('x')) || 0;
      const y = parseFloat(el.getAttribute('y')) || 0;
      const w = parseFloat(el.getAttribute('width')) || 100;
      const h = parseFloat(el.getAttribute('height')) || 100;
      const rx = parseFloat(el.getAttribute('rx')) || 0;
      const rr = Math.min(rx, w/2, h/2);
      const d = rr > 0
        ? `M${x+rr},${y} L${x+w-rr},${y} Q${x+w},${y} ${x+w},${y+rr} L${x+w},${y+h-rr} Q${x+w},${y+h} ${x+w-rr},${y+h} L${x+rr},${y+h} Q${x},${y+h} ${x},${y+h-rr} L${x},${y+rr} Q${x},${y} ${x+rr},${y} Z`
        : `M${x},${y} L${x+w},${y} L${x+w},${y+h} L${x},${y+h} Z`;
      shapeData = { shapes: svgPathToLottie(d), fill, stroke, sw, bounds };
      break;
    }
    case 'circle': {
      const cx = parseFloat(el.getAttribute('cx')) || 50;
      const cy = parseFloat(el.getAttribute('cy')) || 50;
      const r = parseFloat(el.getAttribute('r')) || 40;
      shapeData = { shapes: svgPathToLottie(`M${cx-r},${cy} A${r},${r} 0 1,1 ${cx+r},${cy} A${r},${r} 0 1,1 ${cx-r},${cy} Z`), fill, stroke, sw, bounds };
      break;
    }
    case 'ellipse': {
      const cx = parseFloat(el.getAttribute('cx')) || 50;
      const cy = parseFloat(el.getAttribute('cy')) || 50;
      const rx = parseFloat(el.getAttribute('rx')) || 40;
      const ry = parseFloat(el.getAttribute('ry')) || 30;
      shapeData = { shapes: svgPathToLottie(`M${cx-rx},${cy} A${rx},${ry} 0 1,1 ${cx+rx},${cy} A${rx},${ry} 0 1,1 ${cx-rx},${cy} Z`), fill, stroke, sw, bounds };
      break;
    }
    case 'path': {
      shapeData = { shapes: svgPathToLottie(el.getAttribute('d') || ''), fill, stroke, sw, bounds };
      break;
    }
    case 'line': {
      const x1 = parseFloat(el.getAttribute('x1')) || 0;
      const y1 = parseFloat(el.getAttribute('y1')) || 0;
      const x2 = parseFloat(el.getAttribute('x2')) || 100;
      const y2 = parseFloat(el.getAttribute('y2')) || 100;
      shapeData = { shapes: svgPathToLottie(`M${x1},${y1} L${x2},${y2}`), fill, stroke, sw, bounds };
      break;
    }
    case 'polygon': case 'polyline': {
      const pts = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number);
      let d = '';
      for (let j = 0; j < pts.length; j += 2) d += (j === 0 ? 'M' : 'L') + pts[j] + ',' + pts[j+1];
      if (tag === 'polygon') d += ' Z';
      shapeData = { shapes: svgPathToLottie(d), fill, stroke, sw, bounds };
      break;
    }
    default: {
      const b = bounds;
      shapeData = { shapes: svgPathToLottie(`M${b.x},${b.y} L${b.x+b.w},${b.y} L${b.x+b.w},${b.y+b.h} L${b.x},${b.y+b.h} Z`), fill, stroke, sw, bounds };
    }
  }
  return shapeData;
}

function buildLottieTransform(anim, bounds) {
  const preset = PRESETS[anim.preset];
  if (!preset) return null;
  const fr = 60;
  const delayFr = Math.round(anim.delay * fr);
  const durFr = Math.round(anim.duration * fr);
  const cx = bounds.cx, cy = bounds.cy;
  const easeMap = { 'ease': { x: [0.66], y: [0] }, 'ease-in-out': { x: [0.5], y: [0] }, 'bounce': { x: [0.68], y: [-0.55] }, 'linear': { x: [0], y: [0] } };
  const easeOutMap = { 'ease': { x: [0.34], y: [1] }, 'ease-in-out': { x: [0.5], y: [1] }, 'bounce': { x: [0.27], y: [1.55] }, 'linear': { x: [1], y: [1] } };
  const ei = easeMap[anim.easing] || easeMap.ease;
  const eo = easeOutMap[anim.easing] || easeOutMap.ease;

  function mkKF(vals, mult) {
    return vals.map((v, idx) => {
      const t = delayFr + Math.round((idx / (vals.length - 1 || 1)) * durFr);
      return { t, s: [typeof v === 'number' ? v * (mult || 1) : v], i: { x: [ei.x[0]], y: [ei.y[0]] }, o: { x: [eo.x[0]], y: [eo.y[0]] } };
    });
  }

  const kf = preset.keyframes;
  const hasX = kf.x?.some(v => v !== 0);
  const hasY = kf.y?.some(v => v !== 0);
  const hasScale = kf.scale?.some(v => v !== 1);
  const hasScaleX = kf.scaleX?.some(v => v !== 1);
  const hasScaleY = kf.scaleY?.some(v => v !== 1);
  const hasRot = kf.rotation?.some(v => v !== 0);
  const hasOpacity = kf.opacity?.some(v => v !== 1);
  const hasSkew = kf.skewX?.some(v => v !== 0);

  function posKF(xVals, yVals) {
    const len = Math.max(xVals.length, yVals.length);
    return Array.from({length: len}, (_, idx) => ({
      t: delayFr + Math.round((idx / (len - 1 || 1)) * durFr),
      s: [(xVals[idx] ?? 0) + cx, (yVals[idx] ?? 0) + cy, 0],
      i: { x: [ei.x[0]], y: [ei.y[0]] },
      o: { x: [eo.x[0]], y: [eo.y[0]] },
      to: [0, 0], ti: [0, 0]
    }));
  }



  return {
    anchor: [cx, cy, 0],
    position: hasX || hasY
      ? { a: 1, k: posKF(kf.x || [0,0], kf.y || [0,0]) }
      : { a: 0, k: [cx, cy, 0] },
    scale: hasScale
      ? { a: 1, k: mkKF(kf.scale, 100) }
      : hasScaleX || hasScaleY
        ? { a: 1, k: (kf.scaleX || kf.scaleY).map((_, idx) => ({
            t: delayFr + Math.round((idx / ((kf.scaleX||kf.scaleY).length - 1 || 1)) * durFr),
            s: [(kf.scaleX?.[idx] ?? 1) * 100, (kf.scaleY?.[idx] ?? 1) * 100, 100],
            i: { x: [ei.x[0]], y: [ei.y[0]] },
            o: { x: [eo.x[0]], y: [eo.y[0]] }
          })) }
        : { a: 0, k: [100, 100, 100] },
    rotation: hasRot ? { a: 1, k: mkKF(kf.rotation) } : { a: 0, k: [0] },
    opacity: hasOpacity ? { a: 1, k: mkKF(kf.opacity.map(v => v * 100)) } : { a: 0, k: [100] },
    skew: hasSkew ? { a: 1, k: mkKF(kf.skewX) } : undefined,
    skewAxis: hasSkew ? { a: 0, k: [0] } : undefined,
  };
}

function generateLottie() {
  // Use assigned animations, or fall back to current selection
  const assigned = Object.keys(state.elementAnimations).filter(k => {
    const idx = parseInt(k);
    return idx >= 0 && idx < state.elements.length;
  }).map(Number);

  const useIndices = assigned.length > 0 ? assigned : state.selectedIndices;

  if (useIndices.length === 0) {
    showToast('Assign animations to elements first, or select elements', 'error');
    return null;
  }

  const framerate = 60;
  const vb = state.svgElement?.getAttribute('viewBox') || '0 0 400 400';
  const vbParts = vb.split(/\s+/).map(Number);
  const w = vbParts[2] || 400;
  const h = vbParts[3] || 400;

  const layers = [];
  let maxOp = 0;

  useIndices.forEach((idx, layerIdx) => {
    const el = state.elements[idx];
    const anim = state.elementAnimations[idx] || { preset: state.selectedPreset || 'fade', duration: state.duration, delay: state.delay, repeat: state.repeat, easing: state.easing };
    const preset = PRESETS[anim.preset];
    if (!preset) return;

    const shapeData = buildLottieShape(el.el);
    const lottieShapes = [];

    shapeData.shapes.forEach(s => {
      const vertData = s.v.map((p, vi) => ({
        i: { x: [s.i[vi]?.[0] || 0], y: [s.i[vi]?.[1] || 0] },
        o: { x: [s.o[vi]?.[0] || 0], y: [s.o[vi]?.[1] || 0] },
        c: s.c,
        v: [p[0], p[1]]
      }));
      lottieShapes.push({ ty: 'sh', d: 1, ks: { a: 0, k: { a: 0, k: [{ t: 0, s: vertData }] } } });
    });

    lottieShapes.push({ ty: 'fl', o: { a: 0, k: 100 }, c: { a: 0, k: shapeData.fill }, r: 1, bm: 0 });
    if (shapeData.sw > 0) {
      lottieShapes.push({ ty: 'st', o: { a: 0, k: 100 }, c: { a: 0, k: shapeData.stroke }, w: { a: 0, k: shapeData.sw }, lc: 1, lj: 1, bm: 0 });
    }

    const transform = buildLottieTransform(anim, shapeData.bounds);
    const repeat = typeof anim.repeat === 'number' ? anim.repeat : 1;
    const layerDuration = (anim.delay + anim.duration) * repeat;
    const layerFrames = Math.max(Math.round(layerDuration * 60), 1);
    if (layerFrames > maxOp) maxOp = layerFrames;

    const layer = {
      dd: 0, ty: 4, nm: el.name, sr: 1, st: 0, op: layerFrames, ip: 0,
      ks: {
        a: { a: 0, k: transform.anchor },
        p: transform.position,
        s: transform.scale,
        r: transform.rotation,
        o: transform.opacity,
      },
      shapes: lottieShapes,
      ind: layerIdx + 1
    };
    if (transform.skew) layer.ks.sk = transform.skew;
    if (transform.skewAxis) layer.ks.sa = transform.skewAxis;
    layers.push(layer);
  });

  return {
    v: '5.5.2', fr: framerate, ip: 0, op: Math.max(maxOp, 60),
    w, h, nm: 'Animation', ddd: 0, assets: [], layers, markers: []
  };
}

// ===== Upload / Paste =====
 $('#uploadBtn').addEventListener('click', () => $('#fileInput').click());
 $('#fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => loadSVG(ev.target.result);
  reader.readAsText(file);
  e.target.value = '';
});
 $('#pasteBtn').addEventListener('click', () => {
  $('#pasteModal').classList.add('active');
  setTimeout(() => $('#pasteTextarea').focus(), 100);
});
 $('#confirmPaste').addEventListener('click', () => {
  const text = $('#pasteTextarea').value.trim();
  if (!text) { showToast('Paste SVG code first', 'error'); return; }
  loadSVG(text);
  $('#pasteModal').classList.remove('active');
  $('#pasteTextarea').value = '';
});
 $('#cancelPaste').addEventListener('click', () => $('#pasteModal').classList.remove('active'));
 $('#closePasteModal').addEventListener('click', () => $('#pasteModal').classList.remove('active'));

// ===== Select All / Create Group =====
 $('#selectAllBtn').addEventListener('click', selectAll);
createGroupBtn.addEventListener('click', createGroup);

// ===== Theme toggle =====
 $('#themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  const icon = $('#themeIcon');
  if (next === 'light') {
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  } else {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
});

// ===== Drawer toggle =====
const rightPanel = $('#rightPanel');
const drawerToggle = $('#drawerToggle');
const drawerClose = $('#drawerClose');
function openDrawer() { rightPanel.classList.add('open'); drawerToggle.classList.add('open'); }
function closeDrawer() { rightPanel.classList.remove('open'); drawerToggle.classList.remove('open'); }
drawerToggle.addEventListener('click', () => {
  if (rightPanel.classList.contains('open')) closeDrawer(); else openDrawer();
});
drawerClose.addEventListener('click', closeDrawer);

// ===== Tab switching =====
document.querySelectorAll('.drawer-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById('tab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
    if (target) target.classList.add('active');
    if (tab.dataset.tab === 'elements') renderElementAssignments();
  });
});

// ===== Render element assignments (Elements tab) =====
function renderElementAssignments() {
  const container = $('#elementAssignmentsList');
  if (!container) return;
  if (!state.elements || state.elements.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div>No elements loaded.</div>
    </div>`;
    return;
  }
  container.innerHTML = '';
  state.elements.forEach((item, idx) => {
    const anim = state.elementAnimations[idx];
    const card = document.createElement('div');
    card.className = 'element-card';
    const badgeHtml = anim
      ? `<span class="elem-badge">${PRESETS[anim.preset]?.name || anim.preset}</span>`
      : `<span class="elem-badge" style="background:var(--surface-2);color:var(--fg-dim);font-weight:400;">—</span>`;
    const detailsHtml = anim
      ? `<div class="elem-details"><span>${anim.duration.toFixed(1)}s</span><span>d:${anim.delay.toFixed(1)}s</span><span>r:${anim.repeat}</span><span>${anim.easing}</span></div>`
      : '';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="elem-dot" style="background:${item.color}"></div>
      <div class="elem-info">
        <div class="elem-name">${item.name}</div>
        <div class="elem-tag">${item.tag}</div>
        ${detailsHtml}
      </div>
      ${badgeHtml}
      ${anim ? `<button class="elem-clear" data-idx="${idx}" title="Clear animation">✕</button>` : ''}`;
    card.addEventListener('click', (e) => {
      if (e.target.closest('.elem-clear')) return;
      selectSingle(idx);
    });
    container.appendChild(card);
  });
  container.querySelectorAll('.elem-clear').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      delete state.elementAnimations[idx];
      renderElementsList();
      renderElementAssignments();
      showToast('Animation cleared', 'success');
    });
  });
}

// Patch renderElementsList to also update Elements tab
const _origRenderElementsList = renderElementsList;
renderElementsList = function() {
  _origRenderElementsList();
  renderElementAssignments();
};

// ===== Canvas click → select element =====
svgCanvas.addEventListener('click', (e) => {
  if (!state.svgElement) return;
  let target = e.target;
  // Walk up from click target to find a selectable element
  while (target && target !== state.svgElement && target !== svgCanvas && target !== document) {
    const idx = state.elements.findIndex(item => item.el === target);
    if (idx !== -1) {
      addClickFeedback(target);
      if (e.ctrlKey || e.metaKey) {
        toggleInSelection(idx);
      } else {
        selectSingle(idx);
      }
      return;
    }
    target = target.parentNode;
  }
  // Clicked on empty SVG area — clear selection (unless ctrl held)
  if (!e.ctrlKey && !e.metaKey) {
    clearSelection();
  }
});

// Hover on canvas elements
svgCanvas.addEventListener('mouseover', (e) => {
  if (!state.svgElement) return;
  let target = e.target;
  while (target && target !== state.svgElement && target !== svgCanvas) {
    const idx = state.elements.findIndex(item => item.el === target);
    if (idx !== -1) {
      if (!state.selectedIndices.includes(idx)) {
        target.classList.add('hover-element');
      }
      return;
    }
    target = target.parentNode;
  }
});

svgCanvas.addEventListener('mouseout', (e) => {
  if (!state.svgElement) return;
  state.svgElement.querySelectorAll('.hover-element').forEach(el => {
    el.classList.remove('hover-element');
  });
});

// ===== Keyboard shortcuts =====
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
    if (e.code === 'Escape') e.target.blur();
    return;
  }
  if (e.code === 'Space') {
    e.preventDefault();
    $('#runBtn').click();
    // Visual feedback on selected elements
    if (state.svgElement) {
      state.selectedIndices.forEach(idx => {
        const el = state.elements[idx]?.el;
        if (el) addClickFeedback(el);
      });
    }
  }
  else if (e.code === 'Escape') {
    if (document.querySelector('.modal-backdrop.active')) {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    } else {
      $('#resetBtn').click();
    }
    if (state.svgElement) {
      state.svgElement.querySelectorAll('.click-feedback, .anim-preview').forEach(el => {
        el.classList.remove('click-feedback', 'anim-preview');
      });
    }
  }
  else if (e.code === 'KeyA' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    selectAll();
  }
});

// ===== Toast =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const iconSvg = type === 'success'
    ? '<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    : type === 'error'
    ? '<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  toast.innerHTML = iconSvg + '<span>' + message + '</span>';
  $('#toastContainer').appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ===== Init =====
initPresets();
loadSVG(DEFAULT_SVG);
