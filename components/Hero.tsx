import type { CSSProperties } from "react";

export default function Hero() {
  const bars = Array.from({ length: 64 }, (_, i) => {
    const v = 20 + Math.abs(Math.sin(i * 0.45) * 50 + Math.sin(i * 1.3) * 30);
    const style = { "--h": `${v}%`, "--d": `${(0.9 + (i % 7) * 0.22).toFixed(2)}s`, animationDelay: `-${(i % 9) * 0.3}s` } as CSSProperties;
    return <i key={i} style={style} />;
  });
  return (
    <section className="hero" aria-labelledby="h-hero">
      <div className="wave" id="wave" aria-hidden="true">{bars}</div>
      <div className="wrap">
        <h1 id="h-hero">Beats for artists with something to say.</h1>
        <p className="sub">Instrumentais com identidade para artistas que querem fugir do óbvio.</p>
        <div className="cta">
          <a className="btn solid" href="#beats">OUVIR BEATS</a>
          <a className="btn" href="#como-funciona">COMO FUNCIONA</a>
        </div>
      </div>
    </section>
  );
}
