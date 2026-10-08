import { SITE } from "@/data/site";
import { safeUrl } from "@/lib/format";

export default function About() {
  const socials: [string, string][] = [["Instagram", SITE.instagram], ["TikTok", SITE.tiktok], ["YouTube", SITE.youtube]];
  return (
    <section id="sobre" aria-labelledby="h-about" style={{ background: "var(--bg2)" }}>
      <div className="wrap about">
        <div className="photo" id="photo">
          {SITE.photo
            ? <img src={SITE.photo} alt={`Foto de ${SITE.artistName}`} loading="lazy" />
            : <span>[ADICIONAR FOTO]<br /><small>Defina SITE.photo em data/site.ts</small></span>}
        </div>
        <div>
          <h2 id="h-about">MAIS DO QUE BEATS.</h2>
          <p className="lead" style={{ fontSize: "1.15rem" }}>Produzo instrumentais buscando uma identidade própria, misturando diferentes referências, texturas e elementos musicais para criar sons que não pareçam cópias do que já existe.</p>
          <div className="social" id="social">
            {socials.filter(([, u]) => safeUrl(u)).map(([n, u]) => (
              <a key={n} className="btn sm" href={u} target="_blank" rel="noopener">{n}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
