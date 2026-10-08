"use client";
import type { Beat } from "@/types";
import { useApp } from "./AppProvider";
import CoverArt from "./CoverArt";
import { PauseIcon, PlayIcon } from "./icons";

export default function BeatCard({ beat: b }: { beat: Beat }) {
  const { current, playing, playBeat, selectBeat } = useApp();
  const sold = b.status === "exclusive_sold";
  const on = !!current && current.id === b.id && playing;
  return (
    <article className="card" data-id={b.id}>
      <div className="cover">
        {b.cover
          ? <img src={b.cover} alt={`Capa do beat ${b.name}`} loading="lazy" width={400} height={400} />
          : <CoverArt beat={b} />}
        {sold && <span className="badge">EXCLUSIVE SOLD</span>}
        <button className="play" aria-label={`Ouvir preview de ${b.name}`} onClick={() => playBeat(b)}>
          {on ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="info">
        <h3>{b.name}</h3>
        <div className="meta">
          <span><b>{b.bpm}</b> BPM</span><span><b>{b.key}</b></span><span>{b.genre}</span><span>{b.duration}</span>
        </div>
        {sold
          ? <p className="meta">Mantido no catálogo como portfólio.</p>
          : <button className="btn" onClick={() => { selectBeat(b); document.getElementById("licencas")?.scrollIntoView(); }}>VER LICENÇAS</button>}
      </div>
    </article>
  );
}
