import { create } from 'zustand';
import { PRESETS, PRESET_LIST, CATEGORIES } from '../data/presets.js';
import { DEFAULT_SVG } from '../data/defaultSvg.js';
import { elemColor, cssEscape } from '../utils/svgUtils.js';
import { presetToCSS, easingVal } from '../utils/cssGen.js';
import { computeAnimState } from '../utils/keyframe.js';
import { buildLottie, downloadLottie } from '../utils/lottieExport.js';

const EASING_OPTIONS = [{ value: 'ease', label: 'Ease' }, { value: 'ease-in-out', label: 'E-I-O' }, { value: 'bounce', label: 'Bounce' }, { value: 'linear', label: 'Linear' }];
const REPEAT_OPTIONS = [{ value: 1, label: '1×' }, { value: 2, label: '2×' }, { value: 3, label: '3×' }, { value: 'infinite', label: '∞' }];

let toastIdCounter = 0;

export const useStore = create((set, get) => ({
  // ===== State =====
  theme: 'dark',
  svgHtml: '',
  svgEl: null,
  elements: [],
  selectedIndices: [],
  groups: [],
  selectedGroupId: null,
  animations: {},
  selectedPreset: null,
  currentCategory: 'all',
  editDuration: 0.6,
  editDelay: 0,
  editStart: 0,
  editStagger: 0,
  editEasing: 'ease',
  editRepeat: 1,
  isPlaying: false,
  playhead: 0,
  duration: 5,
  lastFrameTime: 0,
  isScrubbing: false,
  rightOpen: true,
  showPasteModal: false,
  showCssModal: false,
  pasteText: '',
  cssOutput: '',
  toasts: [],
  rafId: null,

  // ===== Constants =====
  categories: CATEGORIES,
  easingOptions: EASING_OPTIONS,
  repeatOptions: REPEAT_OPTIONS,

  // ===== Derived getters =====
  catLabel: (c) => c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1),
  getPresetName: (id) => PRESETS[id]?.name || id,
  filteredPresets: () => {
    const s = get();
    return s.currentCategory === 'all' ? PRESET_LIST : PRESET_LIST.filter(p => p.cat === s.currentCategory);
  },
  canvasInfo: () => get().svgEl ? `viewBox ${get().svgEl.getAttribute('viewBox') || ''}` : 'No SVG',
  selectedInfo: () => {
    const s = get();
    if (s.selectedIndices.length === 0) return 'None';
    if (s.selectedIndices.length === 1) { const e = s.elements[s.selectedIndices[0]]; return `${e.tag} · ${e.name}`; }
    return `${s.selectedIndices.length} elements`;
  },
  animatedElements: () => Object.keys(get().animations).map(Number).filter(i => i < get().elements.length),
  rulerTicks: () => {
    const s = get();
    if (s.selectedIndices.length === 1 && s.animations[s.selectedIndices[0]]) {
      const a = s.animations[s.selectedIndices[0]];
      const rep = typeof a.repeat === 'number' ? a.repeat : 1;
      const animStart = a.start || 0;
      const delay = a.delay || 0;
      const dur = a.duration || 0.6;
      const totalEnd = animStart + delay + dur * rep;
      const ticks = [0];
      ticks.push(Math.round(animStart * 10) / 10);
      if (delay > 0) ticks.push(Math.round((animStart + delay) * 10) / 10);
      for (let r = 0; r < rep; r++) {
        const segEnd = animStart + delay + dur * (r + 1);
        ticks.push(Math.round(Math.min(segEnd, totalEnd) * 10) / 10);
      }
      const all = [...new Set(ticks)].sort((a, b) => a - b);
      return all.filter(t => t <= s.duration + 0.01);
    }
    const ticks = [];
    const step = s.duration <= 3 ? 0.5 : 1;
    for (let t = 0; t <= s.duration + 0.01; t += step) ticks.push(Math.round(t * 10) / 10);
    return ticks;
  },
  selectedAnimStart: () => {
    const s = get();
    if (s.selectedIndices.length === 1 && s.animations[s.selectedIndices[0]]) {
      const a = s.animations[s.selectedIndices[0]];
      return Math.round(((a.start || 0) + (a.delay || 0)) * 10) / 10;
    }
    return null;
  },
  timelineTracks: () => {
    const s = get();
    return s.animatedElements().map(idx => {
      const a = s.animations[idx];
      const preset = PRESETS[a.preset];
      const el = s.elements[idx];
      return { idx, name: el.name, color: el.color, cat: preset.cat, presetName: preset.name, anim: a };
    });
  },
  trackBarStyle: (track) => {
    const s = get();
    const a = track.anim;
    const rep = typeof a.repeat === 'number' ? a.repeat : 1;
    const totalDur = a.duration * rep;
    const left = ((a.start || 0) + (a.delay || 0)) / s.duration * 100;
    const width = totalDur / s.duration * 100;
    return { left: left + '%', width: Math.max(width, 2) + '%' };
  },
  formatTime: (t) => t.toFixed(1) + 's',

  // ===== SVG Loading =====
  loadSVG: (text) => {
    try {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      if (doc.querySelector('parsererror')) throw new Error('Invalid SVG');
      const svg = doc.querySelector('svg');
      if (!svg) throw new Error('No <svg> root');
      get().stopPlay();
      svg.querySelectorAll('*').forEach(e => { if (e.style) e.style.pointerEvents = 'auto'; });
      const html = svg.outerHTML;
      set({
        svgEl: svg,
        svgHtml: html,
        selectedIndices: [],
        animations: {},
        selectedPreset: null,
        playhead: 0,
      });
      get().parseElements();
      get().toast(`Loaded · ${get().elements.length} elements`, 'success');
      setTimeout(() => { get().syncRefs(); get().updateDuration(); }, 0);
    } catch (err) { get().toast('Failed: ' + err.message, 'error'); }
  },

  syncRefs: () => {
    const s = get();
    const svg = document.querySelector('.svg-stage svg');
    if (!svg) return;
    set({ svgEl: svg });
    s.elements.forEach(item => {
      const live = svg.querySelector(`#${cssEscape(item.id)}`);
      if (live) item.el = live;
    });
  },

  parseElements: () => {
    const svg = get().svgEl;
    const elements = [];
    const tags = ['rect', 'circle', 'ellipse', 'path', 'text', 'g', 'polygon', 'polyline', 'line', 'image', 'use'];
    const counters = {};
    svg.querySelectorAll('*').forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (!tags.includes(tag)) return;
      let id = el.getAttribute('id');
      let name = id || el.getAttribute('data-name');
      let autoNamed = false;
      if (!name) {
        counters[tag] = (counters[tag] || 0) + 1;
        name = `${tag}-${counters[tag]}`;
        id = `sas-${tag}-${counters[tag]}`;
        while (svg.querySelector(`#${cssEscape(id)}`)) { counters[tag]++; id = `sas-${tag}-${counters[tag]}`; name = `${tag}-${counters[tag]}`; }
        el.setAttribute('id', id);
        autoNamed = true;
      }
      elements.push({ el, name, tag, id, color: elemColor(name), selector: `#${cssEscape(id)}`, autoNamed });
    });
    set({ elements });
  },

  onFileUpload: (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => get().loadSVG(ev.target.result);
    r.readAsText(f);
    e.target.value = '';
  },

  confirmPaste: () => {
    const t = get().pasteText.trim();
    if (!t) { get().toast('Paste SVG first', 'error'); return; }
    get().loadSVG(t);
    set({ showPasteModal: false, pasteText: '' });
  },

  // ===== Selection =====
  onElemClick: (idx, e) => {
    if (e.ctrlKey || e.metaKey) get().toggleSelect(idx);
    else get().selectSingle(idx);
  },
  selectSingle: (idx) => {
    set({ selectedIndices: [idx], selectedGroupId: null });
    get().loadEditProps(idx);
  },
  toggleSelect: (idx) => {
    const sel = [...get().selectedIndices];
    const i = sel.indexOf(idx);
    if (i !== -1) sel.splice(i, 1); else sel.push(idx);
    set({ selectedIndices: sel, selectedGroupId: null });
    if (sel.length === 1) get().loadEditProps(sel[0]);
  },
  selectAll: () => set({ selectedIndices: get().elements.map((_, i) => i) }),
  clearSelection: () => set({ selectedIndices: [] }),

  loadEditProps: (idx) => {
    const a = get().animations[idx];
    if (a) {
      set({
        editDuration: a.duration, editDelay: a.delay, editStart: a.start,
        editEasing: a.easing, editRepeat: a.repeat, selectedPreset: a.preset,
      });
    }
  },

  // ===== Groups =====
  createGroup: () => {
    const sel = get().selectedIndices;
    if (sel.length < 2) return;
    const groups = [...get().groups, { id: 'g-' + Date.now(), name: `Group ${get().groups.length + 1}`, indices: [...sel] }];
    set({ groups });
    get().toast(`Group ${get().groups.length} created`, 'success');
  },

  // ===== Presets =====
  selectPreset: (id) => set({ selectedPreset: id }),

  // ===== Assign =====
  assignAnimation: () => {
    const s = get();
    if (s.selectedIndices.length === 0) { s.toast('Select element(s) first', 'error'); return; }
    if (!s.selectedPreset) { s.toast('Select a preset first', 'error'); return; }
    const stagger = s.editStagger;
    const animations = { ...s.animations };
    s.selectedIndices.forEach((idx, i) => {
      animations[idx] = {
        preset: s.selectedPreset,
        duration: s.editDuration,
        delay: s.editDelay,
        start: s.editStart + (stagger * i / 1000),
        easing: s.editEasing,
        repeat: s.editRepeat,
      };
    });
    set({ animations });
    get().updateDuration();
    s.toast(`Assigned ${PRESETS[s.selectedPreset].name}`, 'success');
    set({ playhead: s.editStart });
    get().applyLiveAnimations(get().playhead);
  },

  clearAnimation: (idx) => {
    const animations = { ...get().animations };
    delete animations[idx];
    set({ animations });
    get().updateDuration();
    get().toast('Animation removed', 'success');
  },

  // ===== Duration calc =====
  updateDuration: () => {
    let maxEnd = 3;
    Object.values(get().animations).forEach(a => {
      const rep = typeof a.repeat === 'number' ? a.repeat : 1;
      const end = (a.start || 0) + (a.delay || 0) + (a.duration || 0.6) * rep;
      if (end > maxEnd) maxEnd = end;
    });
    set({ duration: Math.ceil(maxEnd + 0.5) });
  },

  // ===== Playback =====
  togglePlay: () => { if (get().isPlaying) get().stopPlay(); else get().startPlay(); },
  startPlay: () => {
    const s = get();
    if (s.animatedElements().length === 0) { s.toast('No animations to play', 'error'); return; }
    let playhead = s.playhead;
    if (playhead >= s.duration) playhead = 0;
    set({ isPlaying: true, playhead, lastFrameTime: performance.now() });
    const loop = (now) => {
      const st = get();
      if (!st.isPlaying) return;
      const dt = (now - st.lastFrameTime) / 1000;
      let ph = st.playhead + dt;
      if (ph >= st.duration) {
        st.stopPlay();
        set({ playhead: st.duration });
        return;
      }
      set({ playhead: ph, lastFrameTime: now });
      st.applyLiveAnimations(ph);
      const rafId = requestAnimationFrame(loop);
      set({ rafId });
    };
    const rafId = requestAnimationFrame(loop);
    set({ rafId });
  },
  stopPlay: () => {
    const rafId = get().rafId;
    if (rafId) cancelAnimationFrame(rafId);
    set({ isPlaying: false, rafId: null });
  },
  seekToStart: () => { get().stopPlay(); set({ playhead: 0 }); get().applyLiveAnimations(0); },
  seekToEnd: () => { get().stopPlay(); set({ playhead: get().duration }); get().applyLiveAnimations(get().duration); },

  // ===== Live animation application =====
  applyLiveAnimations: (time) => {
    const s = get();
    const svg = s.svgEl || document.querySelector('.svg-stage svg');
    if (!svg) return;
    s.animatedElements().forEach(idx => {
      const el = s.elements[idx]?.el;
      if (!el) return;
      const a = s.animations[idx];
      const state = computeAnimState(a, time);
      el.style.opacity = state.opacity;
      el.style.transform = state.transform;
      el.style.transformOrigin = 'center';
      el.style.transformBox = 'fill-box';
    });
    s.elements.forEach((item, idx) => {
      if (!s.animations[idx] && item.el) {
        item.el.style.opacity = '';
        item.el.style.transform = '';
      }
    });
    if (time === 0) {
      s.elements.forEach(item => { if (item.el) { item.el.style.opacity = ''; item.el.style.transform = ''; } });
    }
  },

  // ===== Timeline interaction =====
  onTimelineClick: (e, timelineEl) => {
    const rect = timelineEl.getBoundingClientRect();
    const labelW = 140;
    const x = e.clientX - rect.left - labelW;
    const w = rect.width - labelW;
    if (x < 0) return;
    const t = Math.max(0, Math.min(get().duration, (x / w) * get().duration));
    get().stopPlay();
    set({ playhead: t });
    get().applyLiveAnimations(t);
  },

  startScrub: (e, timelineEl) => {
    e.preventDefault();
    set({ isScrubbing: true });
    get().stopPlay();
    const move = (ev) => {
      const rect = timelineEl.getBoundingClientRect();
      const labelW = 140;
      const x = ev.clientX - rect.left - labelW;
      const w = rect.width - labelW;
      const ph = Math.max(0, Math.min(get().duration, (x / w) * get().duration));
      set({ playhead: ph });
      get().applyLiveAnimations(ph);
    };
    const up = () => { set({ isScrubbing: false }); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  },

  // ===== Export CSS =====
  exportCSS: () => {
    const s = get();
    if (s.animatedElements().length === 0) { s.toast('Assign animations first', 'error'); return; }
    let css = '';
    s.animatedElements().forEach(idx => {
      const a = s.animations[idx];
      const preset = PRESETS[a.preset];
      const animName = `anim-${a.preset}-${idx}`;
      css += presetToCSS(animName, preset) + '\n';
      const rep = a.repeat === 'infinite' ? 'infinite' : a.repeat;
      css += `#svgCanvas ${s.elements[idx].selector} {\n  animation: ${animName} ${a.duration}s ${easingVal(a.easing)} ${a.delay}s ${rep} both;\n  animation-delay: ${(a.start || 0) + (a.delay || 0)}s;\n}\n\n`;
    });
    set({ cssOutput: css, showCssModal: true });
  },

  copyCSS: async () => {
    try { await navigator.clipboard.writeText(get().cssOutput); get().toast('CSS copied', 'success'); set({ showCssModal: false }); }
    catch {
      const ta = document.createElement('textarea'); ta.value = get().cssOutput; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      get().toast('CSS copied', 'success'); set({ showCssModal: false });
    }
  },

  // ===== Export Lottie =====
  exportLottie: () => {
    const s = get();
    if (s.animatedElements().length === 0) { s.toast('Assign animations first', 'error'); return; }
    const lottieData = buildLottie(s.elements, s.animations, s.svgEl);
    downloadLottie(lottieData);
    s.toast('Lottie exported', 'success');
  },

  // ===== Toast =====
  toast: (msg, type = 'info') => {
    const id = ++toastIdCounter;
    set({ toasts: [...get().toasts, { id, message: msg, type }] });
    setTimeout(() => { set({ toasts: get().toasts.filter(t => t.id !== id) }); }, 3000);
  },
}));