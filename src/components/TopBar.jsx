import { useRef } from 'react';
import { useStore } from '../store/useStore.js';

export default function TopBar() {
  const fileInputRef = useRef(null);
  const isPlaying = useStore(s => s.isPlaying);
  const playhead = useStore(s => s.playhead);
  const duration = useStore(s => s.duration);
  const togglePlay = useStore(s => s.togglePlay);
  const seekToStart = useStore(s => s.seekToStart);
  const seekToEnd = useStore(s => s.seekToEnd);
  const onFileUpload = useStore(s => s.onFileUpload);
  const setShowPasteModal = useStore(s => s.setShowPasteModal);
  const exportLottie = useStore(s => s.exportLottie);
  const exportCSS = useStore(s => s.exportCSS);
  const formatTime = useStore(s => s.formatTime);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-14 9V3z" /></svg>
        </div>
        <div className="logo-text">SVG <span>Animation</span> Studio</div>
      </div>

      <div className="topbar-center">
        <div className="playback-controls">
          <button className="pb-btn" onClick={seekToStart} title="Start">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
          </button>
          <button className={"pb-btn pb-play" + (isPlaying ? " active" : "")} onClick={togglePlay}>
            {!isPlaying
              ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>}
          </button>
          <button className="pb-btn" onClick={seekToEnd} title="End">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>
          </button>
          <div className="time-display">
            <span className="time-current">{formatTime(playhead)}</span>
            <span className="time-sep">/</span>
            <span className="time-total">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <button className="tb-btn" onClick={() => fileInputRef.current?.click()}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          Import SVG
        </button>
        <button className="tb-btn" onClick={() => setShowPasteModal(true)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          Paste
        </button>
        <div className="tb-divider"></div>
        <button className="tb-btn tb-accent" onClick={exportLottie}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export Lottie
        </button>
        <button className="tb-btn" onClick={exportCSS}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
          CSS
        </button>
        <input type="file" ref={fileInputRef} accept=".svg,image/svg+xml" hidden onChange={onFileUpload} />
      </div>
    </header>
  );
}