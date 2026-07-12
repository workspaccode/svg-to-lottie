import { useEffect } from 'react';
import { useStore } from './store/useStore.js';
import { DEFAULT_SVG } from './data/defaultSvg.js';
import TopBar from './components/TopBar.jsx';
import LeftPanel from './components/LeftPanel.jsx';
import Canvas from './components/Canvas.jsx';
import RightPanel from './components/RightPanel.jsx';
import Timeline from './components/Timeline.jsx';
import Modals from './components/Modals.jsx';
import Toasts from './components/Toasts.jsx';

export default function App() {
  const theme = useStore(s => s.theme);
  const loadSVG = useStore(s => s.loadSVG);
  const stopPlay = useStore(s => s.stopPlay);
  const clearSelection = useStore(s => s.clearSelection);
  const togglePlay = useStore(s => s.togglePlay);
  const selectAll = useStore(s => s.selectAll);

  useEffect(() => {
    loadSVG(DEFAULT_SVG);
  }, [loadSVG]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      else if (e.code === 'Escape') { stopPlay(); clearSelection(); }
      else if (e.code === 'KeyA' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); selectAll(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stopPlay, clearSelection, togglePlay, selectAll]);

  return (
    <div id="app" className={'theme-' + theme}>
      <TopBar />
      <div className="body">
        <LeftPanel />
        <Canvas />
        <RightPanel />
      </div>
      <Timeline />
      <Modals />
      <Toasts />
    </div>
  );
}