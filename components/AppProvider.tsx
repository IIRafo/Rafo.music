"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Beat } from "@/types";
import { fmt } from "@/lib/format";

/* Estado global do app: toast, beat selecionado (para a seção de licenças) e o player de preview (dock).
   Um único <audio> compartilhado, como no original. */
type Ctx = {
  toast: (m: string) => void;
  selected: Beat | null;
  selectBeat: (b: Beat | null) => void;
  current: Beat | null;
  playing: boolean;
  playBeat: (b: Beat) => void;
  dock: { curLabel: string; durLabel: string; progress: number; volume: number };
  dockToggle: () => void;
  seek: (pct: number) => void;
  setVolume: (v: number) => void;
  pausePreview: () => void;
  registerDawPause: (fn: (() => void) | null) => void;
};
const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp fora do AppProvider");
  return c;
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dawPause = useRef<(() => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [msg, setMsg] = useState("");
  const [selected, selectBeat] = useState<Beat | null>(null);
  const [current, setCurrent] = useState<Beat | null>(null);
  const [playing, setPlaying] = useState(false);
  const [curLabel, setCurLabel] = useState("0:00");
  const [durLabel, setDurLabel] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const [volume, setVol] = useState(0.9);

  const toast = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 3200);
  }, []);

  useEffect(() => {
    const a = new Audio();
    a.preload = "none";
    a.volume = 0.9;
    audioRef.current = a;
    const onPlay = () => { setPlaying(true); dawPause.current?.(); }; // dock e DAW nunca tocam juntos
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setProgress(0); };
    const onMeta = () => setDurLabel(fmt(a.duration));
    const onTime = () => {
      if (!a.duration) return;
      setProgress((a.currentTime / a.duration) * 100);
      setCurLabel(fmt(a.currentTime));
    };
    a.addEventListener("play", onPlay); a.addEventListener("pause", onPause); a.addEventListener("ended", onEnded);
    a.addEventListener("loadedmetadata", onMeta); a.addEventListener("timeupdate", onTime);
    return () => {
      a.pause();
      a.removeEventListener("play", onPlay); a.removeEventListener("pause", onPause); a.removeEventListener("ended", onEnded);
      a.removeEventListener("loadedmetadata", onMeta); a.removeEventListener("timeupdate", onTime);
    };
  }, []);

  const playBeat = (b: Beat) => {
    const a = audioRef.current!;
    if (current && current.id === b.id) {
      if (a.paused) a.play().catch(() => {}); else a.pause();
      return;
    }
    setCurrent(b);
    a.pause();
    setProgress(0); setCurLabel("0:00"); setDurLabel(b.duration || "0:00");
    if (!b.previewAudio) {
      a.removeAttribute("src");
      setPlaying(false);
      toast("Áudio de preview ainda não adicionado a este beat.");
      return;
    }
    a.src = b.previewAudio;
    a.play().catch(() => toast("Não foi possível tocar o preview."));
  };
  const dockToggle = () => {
    const a = audioRef.current!;
    if (!current) return;
    if (!a.src) { toast("Áudio de preview ainda não adicionado."); return; }
    if (a.paused) a.play().catch(() => {}); else a.pause();
  };
  const seek = (pct: number) => {
    const a = audioRef.current!;
    if (a.duration) a.currentTime = (pct / 100) * a.duration;
    setProgress(pct);
  };
  const setVolume = (v: number) => { audioRef.current!.volume = v; setVol(v); };
  const pausePreview = useCallback(() => { const a = audioRef.current; if (a && !a.paused) a.pause(); }, []);
  const registerDawPause = useCallback((fn: (() => void) | null) => { dawPause.current = fn; }, []);

  return (
    <AppCtx.Provider value={{ toast, selected, selectBeat, current, playing, playBeat,
      dock: { curLabel, durLabel, progress, volume }, dockToggle, seek, setVolume, pausePreview, registerDawPause }}>
      {children}
      <div id="toast" role="status" style={{ display: msg ? "block" : "none" }}>{msg}</div>
    </AppCtx.Provider>
  );
}
