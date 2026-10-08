"use client";
import { useMemo, useState } from "react";
import { GENRES } from "@/data/beats";
import type { Beat } from "@/types";
import BeatCard from "./BeatCard";

const PAGE_SIZE = 6; // quantos beats aparecem por vez; o botão "VER MAIS BEATS" mostra mais {PAGE_SIZE}

type Sort = "recent" | "popular" | "bpm";

export default function BeatCatalog({ beats }: { beats: Beat[] }) {
  const [filter, setFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState<Sort>("recent");
  const [shown, setShown] = useState(PAGE_SIZE);

  const list = useMemo(() => {
    const l = beats.filter((b) => b.status !== "hidden")
      .filter((b) => filter === "Todos" || (b.genre ?? "").toLowerCase().includes(filter.toLowerCase()));
    if (sortBy === "recent") l.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sortBy === "popular") l.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    if (sortBy === "bpm") l.sort((a, b) => a.bpm - b.bpm);
    return l;
  }, [beats, filter, sortBy]);

  return (
    <section id="beats" aria-labelledby="h-beats">
      <div className="wrap">
        <h2 id="h-beats">BEATS</h2>
        <div className="tools">
          <div className="chips" id="filters" role="group" aria-label="Filtrar por estilo">
            {GENRES.map((g) => (
              <button key={g} className="chip" aria-pressed={g === filter} onClick={() => { setFilter(g); setShown(PAGE_SIZE); }}>{g}</button>
            ))}
          </div>
          <label>
            <span className="sr" style={{ position: "absolute", left: -9999 }}>Ordenar por</span>
            <select id="sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value as Sort); setShown(PAGE_SIZE); }}>
              <option value="recent">Mais recentes</option>
              <option value="popular">Mais populares</option>
              <option value="bpm">BPM</option>
            </select>
          </label>
        </div>
        <div className="grid" id="grid" aria-live="polite">
          {list.length
            ? list.slice(0, shown).map((b) => <BeatCard key={b.id} beat={b} />)
            : <p className="empty">Nenhum beat nesse estilo por enquanto.</p>}
        </div>
        {list.length > shown && (
          <p style={{ textAlign: "center", marginTop: 32 }}>
            <button className="btn" onClick={() => setShown((n) => n + PAGE_SIZE)}>VER MAIS BEATS</button>
          </p>
        )}
        <p className="note">Preview protegido por tag.</p>
      </div>
    </section>
  );
}
