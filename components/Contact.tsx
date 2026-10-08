import { SITE } from "@/data/site";
import { safeUrl } from "@/lib/format";
import { contactUrl } from "@/lib/contact";

const handle = (u: string) => "@" + u.split("/").filter(Boolean).pop()!.replace("@", "");

export default function Contact() {
  return (
    <section id="contato" aria-labelledby="h-contact">
      <div className="wrap">
        <h2 id="h-contact">CONTATO</h2>
        <dl className="contact" id="contactList">
          {safeUrl(SITE.instagram) && <div><dt>Instagram</dt><dd><a href={SITE.instagram} target="_blank" rel="noopener">{handle(SITE.instagram)}</a></dd></div>}
          {safeUrl(SITE.tiktok) && <div><dt>TikTok</dt><dd><a href={SITE.tiktok} target="_blank" rel="noopener">{handle(SITE.tiktok)}</a></dd></div>}
          {SITE.email && <div><dt>E-mail</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>}
        </dl>
        <p style={{ marginTop: 36 }}>
          <a className="btn solid" id="contactBtn" href={contactUrl()} target="_blank" rel="noopener">FALE COMIGO</a>
        </p>
      </div>
    </section>
  );
}
