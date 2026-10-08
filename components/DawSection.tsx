"use client";
import { useEffect, useRef } from "react";
import type { Beat } from "@/types";
import { SESSION } from "@/data/session";
import { createDaw } from "@/lib/daw/engine";
import { useApp } from "./AppProvider";

/* O HTML da seção é React; o motor de áudio/canvas é o código original (lib/daw/engine.ts),
   ligado ao DOM por useEffect. A seção não tem estado React, então nunca re-renderiza por cima do motor. */
export default function DawSection({ beats }: { beats: Beat[] }) {
  const ref = useRef<HTMLElement>(null);
  const { toast, selectBeat, pausePreview, registerDawPause } = useApp();

  useEffect(() => {
    const daw = createDaw(ref.current, {
      session: SESSION, beats, toast, pausePreview,
      onLicense: (b: Beat) => { selectBeat(b); document.getElementById("licencas")?.scrollIntoView(); },
    });
    registerDawPause(daw.pause);
    return () => { registerDawPause(null); daw.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="stems" aria-labelledby="h-stems" ref={ref}>
      <div className="wrap">
        <h2 id="h-stems">O QUE SÃO STEMS?</h2>
        <p className="lead">Stems são as camadas separadas de um beat: bateria, 808, melodias, texturas e efeitos, cada elemento exportado em um arquivo próprio. Em vez de um único arquivo com tudo misturado, você recebe cada parte para mixar com mais controle.</p>
        <ul className="stem-uses">
          <li><h3>Mixar com mais controle</h3><p>Ajuste volume, equalização e efeitos de cada elemento separadamente.</p></li>
          <li><h3>Abrir espaço para a voz</h3><p>Abaixe ou retire o que disputa espaço com o vocal e deixe sua voz em destaque.</p></li>
          <li><h3>Adaptar ao seu arranjo</h3><p>Mude a estrutura e a energia do beat para encaixar na sua música.</p></li>
        </ul>
        <h3 className="stem-try">Experimente: ouça cada camada separada</h3>
        <p className="lead" style={{ marginBottom: 24 }}>Aperte play e use mute (M) e solo (S) em cada track, como numa DAW. Ajuste também o volume de cada uma.</p>
        <div className="daw" id="daw" role="region" aria-label="Sessão multitrack interativa">
          <div className="daw-top">
            <button className="tbtn main" id="dawPlay" aria-label="Tocar"></button>
            <button className="tbtn" id="dawStop" aria-label="Parar e voltar ao início"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5" /></svg></button>
            <div className="lcd"><div><small>COMPASSO</small><b id="dawBar">1.1.1</b></div><div><small>TEMPO</small><b id="dawTime">0:00 / 0:00</b></div></div>
            <div className="daw-info"><b id="dawTitle">{SESSION.title}</b><span id="dawMeta">{`${SESSION.bpm} BPM · ${SESSION.key}`}</span></div>
            <span className="daw-st" id="dawSt"></span>
            <button className="tbtn txt" id="dawReset" title="Limpar mute, solo e volumes">RESET</button>
            <label className="daw-vol"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" /></svg><input type="range" id="dawVol" min={0} max={1} step={0.01} defaultValue={0.85} aria-label="Volume geral" /></label>
          </div>
          <div className="daw-grid" id="dawGrid">
            <div className="corner">TRACKS</div>
            <div className="ruler" id="dawRuler" tabIndex={0} role="slider" aria-label="Posição na música" aria-valuemin={0} aria-valuemax={0} aria-valuenow={0}><canvas></canvas></div>
            <div className="ph" id="dawPh" aria-hidden="true"></div>
            <div className="daw-msg" id="dawMsg">Carregando stems…</div>
          </div>
        </div>
        <div className="daw-foot">
          <p className="note">Espaço: play/pause · clique ou arraste na timeline para navegar · M: mute · S: solo (Alt+S: solo exclusivo)</p>
          <button className="btn sm" id="dawLic" hidden>LICENCIAR ESTE BEAT</button>
        </div>
        <p className="note">Stems/Multitracks estão incluídos nas licenças Premium e Exclusive. A licença Basic inclui apenas o MP3.{SESSION.stems.every((s) => !s.file) ? " Esta é uma sessão de demonstração, com áudio gerado no navegador." : ""}</p>
      </div>
    </section>
  );
}
