"use client";
import { useApp } from "./AppProvider";
import Range from "./Range";
import { PauseIcon, PlayIcon } from "./icons";

export default function Dock() {
  const { current, playing, dock, dockToggle, seek, setVolume } = useApp();
  return (
    <div id="dock" className={current ? "on" : ""} role="region" aria-label="Player de preview" onContextMenu={(e) => e.preventDefault()}>
      <div className="wrap dock-in">
        <button className="play" id="dPlay" aria-label="Tocar ou pausar" onClick={dockToggle}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div style={{ minWidth: 0 }}>
          <div className="dock-t" id="dTitle">{current ? current.name : "—"}</div>
          <div className="bar">
            <span id="dCur">{dock.curLabel}</span>
            <Range id="dSeek" min={0} max={100} step={0.1} value={dock.progress} label="Progresso" onChange={seek} />
            <span id="dDur">{dock.durLabel}</span>
          </div>
          <div className="dock-s" id="dMeta">{current ? `${current.bpm} BPM · ${current.key}` : ""}</div>
        </div>
        <div className="vol">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" /></svg>
          <Range id="dVol" min={0} max={1} step={0.01} value={dock.volume} label="Volume" onChange={setVolume} />
        </div>
      </div>
    </div>
  );
}
