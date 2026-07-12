import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore.js';

export default function Canvas() {
  const svgStageRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const selectionOverlayRef = useRef(null);

  const svgHtml = useStore(s => s.svgHtml);
  const elements = useStore(s => s.elements);
  const selectedIndices = useStore(s => s.selectedIndices);
  const canvasInfo = useStore(s => s.canvasInfo);
  const selectedInfo = useStore(s => s.selectedInfo);
  const onCanvasClick = useStore(s => s.onCanvasClick);
  const onCanvasOver = useStore(s => s.onCanvasOver);
  const onCanvasOut = useStore(s => s.onCanvasOut);

  const updateSelectionBox = useCallback(() => {
    const overlay = selectionOverlayRef.current;
    if (!overlay) return;
    overlay.innerHTML = '';
    const svg = svgStageRef.current?.querySelector('svg');
    if (!svg || selectedIndices.length === 0) return;
    const wrapRect = canvasWrapRef.current.getBoundingClientRect();
    selectedIndices.forEach(idx => {
      const el = elements[idx]?.el;
      if (!el || !el.getBBox) return;
      try {
        const bbox = el.getBBox();
        const pt = svg.createSVGPoint();
        pt.x = bbox.x; pt.y = bbox.y;
        const ctm = el.getCTM();
        if (ctm) {
          const screenPt = pt.matrixTransform(ctm);
          const screenPt2 = svg.createSVGPoint();
          screenPt2.x = bbox.x + bbox.width; screenPt2.y = bbox.y + bbox.height;
          const screenPt2T = screenPt2.matrixTransform(ctm);
          const svgRect = svg.getBoundingClientRect();
          const x = svgRect.left - wrapRect.left + Math.min(screenPt.x, screenPt2T.x);
          const y = svgRect.top - wrapRect.top + Math.min(screenPt.y, screenPt2T.y);
          const w = Math.abs(screenPt2T.x - screenPt.x);
          const h = Math.abs(screenPt2T.y - screenPt.y);
          const box = document.createElement('div');
          box.className = 'sel-box';
          box.style.left = x + 'px'; box.style.top = y + 'px';
          box.style.width = w + 'px'; box.style.height = h + 'px';
          overlay.appendChild(box);
        }
      } catch { /* ignore */ }
    });
  });

  useEffect(() => { updateSelectionBox(); }, [selectedIndices, updateSelectionBox]);

  useEffect(() => {
    const handler = () => updateSelectionBox();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [updateSelectionBox]);

  // Wrap the store click handlers to pass DOM context
  const handleClick = (e) => {
    const store = useStore.getState();
    const svg = svgStageRef.current?.querySelector('svg');
    if (!svg) return;
    let target = e.target;
    while (target && target !== svg && target !== svgStageRef.current) {
      const idx = store.elements.findIndex(item => item.el === target);
      if (idx !== -1) {
        if (e.ctrlKey || e.metaKey) store.toggleSelect(idx);
        else store.selectSingle(idx);
        return;
      }
      target = target.parentNode;
    }
    if (!e.ctrlKey && !e.metaKey) store.clearSelection();
  };

  const handleOver = (e) => {
    const svg = svgStageRef.current?.querySelector('svg'); if (!svg) return;
    const store = useStore.getState();
    let t = e.target;
    while (t && t !== svg) {
      const idx = store.elements.findIndex(item => item.el === t);
      if (idx !== -1) { if (!store.selectedIndices.includes(idx)) t.classList.add('hover-element'); return; }
      t = t.parentNode;
    }
  };

  const handleOut = () => {
    svgStageRef.current?.querySelectorAll('.hover-element').forEach(el => el.classList.remove('hover-element'));
  };

  const selectAll = useStore(s => s.selectAll);
  const clearSelection = useStore(s => s.clearSelection);
  const createGroup = useStore(s => s.createGroup);

  return (
    <section className="canvas-section">
      <div className="canvas-toolbar">
        <div className="canvas-info">
          <span className="info-chip">{canvasInfo()}</span>
          {selectedIndices.length > 0 && <span className="info-chip accent">{selectedInfo()}</span>}
        </div>
        <div className="canvas-actions">
          <button className="mini-btn" onClick={selectAll} title="Select All (Ctrl+A)">All</button>
          <button className="mini-btn" onClick={clearSelection} title="Deselect">None</button>
          {selectedIndices.length >= 2 && <button className="mini-btn" onClick={createGroup}>Group</button>}
        </div>
      </div>
      <div className="canvas-wrap" ref={canvasWrapRef}>
        <div className="svg-stage" ref={svgStageRef} dangerouslySetInnerHTML={{ __html: svgHtml }}
          onClick={handleClick} onMouseOver={handleOver} onMouseOut={handleOut}>
        </div>
        <div className="selection-overlay" ref={selectionOverlayRef}></div>
      </div>
    </section>
  );
}