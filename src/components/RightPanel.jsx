import { useStore } from '../store/useStore.js';

export default function RightPanel() {
  const rightOpen = useStore(s => s.rightOpen);
  const setRightOpen = (v) => useStore.setState({ rightOpen: v });
  const selectedIndices = useStore(s => s.selectedIndices);
  const animations = useStore(s => s.animations);
  const selectedPreset = useStore(s => s.selectedPreset);
  const currentCategory = useStore(s => s.currentCategory);
  const setCurrentCategory = (v) => useStore.setState({ currentCategory: v });
  const categories = useStore(s => s.categories);
  const catLabel = useStore(s => s.catLabel);
  const filteredPresets = useStore(s => s.filteredPresets);
  const editDuration = useStore(s => s.editDuration);
  const editDelay = useStore(s => s.editDelay);
  const editStart = useStore(s => s.editStart);
  const editStagger = useStore(s => s.editStagger);
  const editEasing = useStore(s => s.editEasing);
  const editRepeat = useStore(s => s.editRepeat);
  const easingOptions = useStore(s => s.easingOptions);
  const repeatOptions = useStore(s => s.repeatOptions);
  const selectPreset = useStore(s => s.selectPreset);
  const assignAnimation = useStore(s => s.assignAnimation);
  const clearAnimation = useStore(s => s.clearAnimation);

  const setEd = (key, val) => useStore.setState({ [`edit${key}`]: val });

  return (
    <aside className={"right-panel" + (rightOpen ? " open" : "")}>
      <button className="panel-toggle" onClick={() => setRightOpen(!rightOpen)}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
      <div className="panel-header"><span>Properties</span></div>
      {selectedIndices.length > 0 ? (
        <div className="panel-scroll">
          {/* Preset picker */}
          <div className="prop-section">
            <div className="prop-label">Animation Preset</div>
            <div className="preset-cat-row">
              {categories.map(cat => (
                <button key={cat} className={"cat-pill" + (currentCategory === cat ? " active" : "")} onClick={() => setCurrentCategory(cat)}>{catLabel(cat)}</button>
              ))}
            </div>
            <div className="preset-list">
              {filteredPresets().map(p => (
                <div key={p.id}
                  className={"preset-row" + ((animations[selectedIndices[0]]?.preset || selectedPreset) === p.id ? " selected" : "")}
                  onClick={() => selectPreset(p.id)}>
                  <span className="preset-row-name">{p.name}</span>
                  <span className="preset-row-cat">{p.cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div className="prop-section">
            <div className="prop-label">Timing</div>
            <div className="prop-control">
              <label>Duration</label>
              <div className="slider-row">
                <input type="range" min="0.1" max="5" step="0.1" value={editDuration} onChange={e => setEd('Duration', parseFloat(e.target.value))} />
                <span className="slider-val">{editDuration.toFixed(1)}s</span>
              </div>
            </div>
            <div className="prop-control">
              <label>Delay</label>
              <div className="slider-row">
                <input type="range" min="0" max="5" step="0.1" value={editDelay} onChange={e => setEd('Delay', parseFloat(e.target.value))} />
                <span className="slider-val">{editDelay.toFixed(1)}s</span>
              </div>
            </div>
            <div className="prop-control">
              <label>Start (timeline)</label>
              <div className="slider-row">
                <input type="range" min="0" max="10" step="0.1" value={editStart} onChange={e => setEd('Start', parseFloat(e.target.value))} />
                <span className="slider-val">{editStart.toFixed(1)}s</span>
              </div>
            </div>
            {selectedIndices.length > 1 && (
              <div className="prop-control">
                <label>Stagger</label>
                <div className="slider-row">
                  <input type="range" min="0" max="1000" step="10" value={editStagger} onChange={e => setEd('Stagger', parseFloat(e.target.value))} />
                  <span className="slider-val">{editStagger}ms</span>
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="prop-section">
            <div className="prop-label">Options</div>
            <div className="prop-control">
              <label>Easing</label>
              <div className="seg-group">
                {easingOptions.map(opt => (
                  <button key={opt.value} className={"seg-btn" + (editEasing === opt.value ? " active" : "")} onClick={() => setEd('Easing', opt.value)}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div className="prop-control">
              <label>Repeat</label>
              <div className="seg-group">
                {repeatOptions.map(opt => (
                  <button key={opt.value} className={"seg-btn" + (editRepeat === opt.value ? " active" : "")} onClick={() => setEd('Repeat', opt.value)}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="prop-actions">
            <button className="action-btn primary" onClick={assignAnimation}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Assign Animation
            </button>
            {selectedIndices.length === 1 && animations[selectedIndices[0]] && (
              <button className="action-btn" onClick={() => clearAnimation(selectedIndices[0])}>Remove Animation</button>
            )}
          </div>
        </div>
      ) : (
        <div className="panel-scroll">
          <div className="empty-hint">Select an element to edit its animation.</div>
        </div>
      )}
    </aside>
  );
}