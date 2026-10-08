"use client";
import { useState } from "react";
import { SITE } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href="#topo" id="logo">{SITE.artistName}</a>
        <ul className={"menu" + (open ? " open" : "")} id="menu"
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}>
          <li><a href="#beats">Beats</a></li>
          <li><a href="#stems">Stems</a></li>
          <li><a href="#licencas">Licenças</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contato">Contato</a></li>
          <li><a className="btn solid m-cta" href="#beats">OUVIR BEATS</a></li>
        </ul>
        <a className="btn solid sm" href="#beats">OUVIR BEATS</a>
        <button className="burger" id="burger" aria-label="Abrir menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </header>
  );
}
