import { useStore } from '../store/useStore.js';

export default function LeftPanel() {
  const elements = useStore(s => s.elements);
  const selectedIndices = useStore(s => s.selectedIndices);
  const animations = useStore(s => s.animations);
  const onElemClick = useStore(s => s.onElemClick);
  const getPresetName = useStore(s => s.getPresetName);

  return (
    <aside className="left-panel">
      <div className="panel-header">
        <span>Elements</span>
        <span className="count-badge">{elements.length}</span>
      </div>
      <div className="panel-scroll">
        {elements.length === 0 && <div className="empty-hint">Import an SVG to see elements.</div>}
        {elements.map((item, idx) => (
          <div key={item.id}
            className={"elem-row" + (selectedIndices.includes(idx) ? " selected" : "") + (animations[idx] ? " assigned" : "")}
            onClick={(e) => onElemClick(idx, e)}>
            <div className="elem-color-dot" style={{ background: item.color }}></div>
            <span className="elem-label">{item.name}</span>
            <span className="elem-type">{item.tag}</span>
            {animations[idx] && <span className="elem-preset-badge">{getPresetName(animations[idx].preset)}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}