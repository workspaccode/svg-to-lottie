import { useRef } from 'react';
import { useStore } from '../store/useStore.js';

export default function Timeline() {
  const timelineRef = useRef(null);
  const duration = useStore(s => s.duration);
  const playhead = useStore(s => s.playhead);
  const rulerTicks = useStore(s => s.rulerTicks);
  const selectedAnimStart = useStore(s => s.selectedAnimStart);
  const timelineTracks = useStore(s => s.timelineTracks);
  const selectedIndices = useStore(s => s.selectedIndices);
  const animatedElements = useStore(s => s.animatedElements);
  const trackBarStyle = useStore(s => s.trackBarStyle);
  const selectSingle = useStore(s => s.selectSingle);
  const onTimelineClick = useStore(s => s.onTimelineClick);
  const startScrub = useStore(s => s.startScrub);

  return (
    <footer className="timeline" ref={timelineRef} onClick={(e) => { if (e.target === timelineRef.current) onTimelineClick(e, timelineRef.current); }}>
      <div className="timeline-ruler">
        <div className="ruler-track">
          {rulerTicks().map(t => (
            <div key={t} className={"ruler-tick" + (selectedAnimStart() === t ? " tick-start" : "")}
              style={{ left: (t / duration * 100) + '%' }}>
              <span className="tick-label">{t.toFixed(1)}s</span>
              <div className="tick-mark"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="timeline-tracks">
        {animatedElements().length === 0 && <div className="timeline-empty">No animations yet. Select an element and assign a preset.</div>}
        {timelineTracks().map(track => (
          <div key={track.idx} className={"track-row" + (selectedIndices.includes(track.idx) ? " selected" : "")}
            onClick={() => selectSingle(track.idx)}>
            <div className="track-label">
              <span className="track-dot" style={{ background: track.color }}></span>
              <span className="track-name">{track.name}</span>
            </div>
            <div className="track-bar-area">
              <div className={"track-bar cat-" + track.cat} style={trackBarStyle(track)}>
                <span className="track-bar-label">{track.presetName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="playhead" style={{ left: (playhead / duration * 100) + '%' }}>
        <div className="playhead-handle" onMouseDown={(e) => startScrub(e, timelineRef.current)}></div>
        <div className="playhead-line"></div>
      </div>
    </footer>
  );
}