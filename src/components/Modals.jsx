import { useStore } from '../store/useStore.js';

export default function Modals() {
  const showPasteModal = useStore(s => s.showPasteModal);
  const setShowPasteModal = (v) => useStore.setState({ showPasteModal: v });
  const pasteText = useStore(s => s.pasteText);
  const setPasteText = (v) => useStore.setState({ pasteText: v });
  const confirmPaste = useStore(s => s.confirmPaste);
  const showCssModal = useStore(s => s.showCssModal);
  const setShowCssModal = (v) => useStore.setState({ showCssModal: v });
  const cssOutput = useStore(s => s.cssOutput);
  const copyCSS = useStore(s => s.copyCSS);

  return (
    <>
      {showPasteModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowPasteModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Paste SVG Code</span>
              <button className="modal-close" onClick={() => setShowPasteModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder="Paste SVG markup here..." />
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowPasteModal(false)}>Cancel</button>
              <button className="action-btn primary" onClick={confirmPaste}>Load SVG</button>
            </div>
          </div>
        </div>
      )}

      {showCssModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowCssModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Generated CSS</span>
              <button className="modal-close" onClick={() => setShowCssModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <pre className="code-output">{cssOutput}</pre>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setShowCssModal(false)}>Close</button>
              <button className="action-btn primary" onClick={copyCSS}>Copy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}