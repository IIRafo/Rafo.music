"use client";
import { SITE } from "@/data/site";
import { brl } from "@/lib/format";
import { priceFor } from "@/lib/licensing";
import type { LicenseType } from "@/types";
import { useApp } from "./AppProvider";
import { contactUrl } from "@/lib/contact";

export default function LicenseSection() {
  const { selected, toast } = useApp();
  const price = (l: LicenseType) => brl(selected ? priceFor(selected, l) : SITE.defaultPrices[l]);

  /* Pagamento e entrega são combinados direto no Instagram. O preço continua sendo mostrado aqui.
     A mensagem já pronta é copiada para a área de transferência, para o cliente só colar no direct. */
  const LABEL: Record<LicenseType, string> = { basic: "Basic", premium: "Premium", exclusive: "Exclusive" };
  const buy = (type: LicenseType) => {
    if (!selected) { toast("Escolha um beat e clique em VER LICENÇAS."); document.getElementById("beats")?.scrollIntoView(); return; }
    const msg = `Olá! Quero a licença ${LABEL[type]} do beat ${selected.name} (${selected.id}), por ${brl(priceFor(selected, type))}.`;
    window.open(contactUrl(), "_blank", "noopener");
    navigator.clipboard?.writeText(msg).then(
      () => toast("Mensagem copiada. Cole no direct do Instagram para me chamar."),
      () => toast(`Me chame no Instagram e diga: ${msg}`)
    );
  };

  return (
    <section id="licencas" aria-labelledby="h-lic" style={{ background: "var(--bg2)" }}>
      <div className="wrap">
        <h2 id="h-lic">ESCOLHA SUA LICENÇA</h2>
        <p className="lead">Compare as três opções e escolha a que combina com o seu lançamento.</p>
        <p id="sel" role="status">{selected ? `Beat selecionado: ${selected.name} (${selected.bpm} BPM, ${selected.key})` : ""}</p>
        <div className="plans">
          <article className="plan">
            <h3>BASIC</h3>
            <div className="price">{price("basic")}</div>
            <ul>
              <li>MP3</li><li>Uso em uma música</li><li>Streaming</li><li>YouTube</li><li>Redes sociais</li><li>Monetização</li><li>Apresentações ao vivo</li><li>Crédito ao produtor</li>
              <li className="no">Sem WAV</li><li className="no">Sem stems</li><li className="no">Sem exclusividade</li>
            </ul>
            <button className="btn" onClick={() => buy("basic")}>ESCOLHER BASIC</button>
          </article>
          <article className="plan pop">
            <span className="tag">MAIS POPULAR</span>
            <h3>PREMIUM</h3>
            <div className="price">{price("premium")}</div>
            <ul>
              <li>MP3</li><li>WAV</li><li>Stems/Multitracks</li><li>Uso comercial</li><li>Streaming</li><li>YouTube</li><li>Redes sociais</li><li>Monetização</li><li>Apresentações ao vivo</li><li>Videoclipes</li><li>Possibilidade de edição/adaptação</li>
            </ul>
            <button className="btn solid" onClick={() => buy("premium")}>ESCOLHER PREMIUM</button>
          </article>
          <article className="plan">
            <h3>EXCLUSIVE</h3>
            <div className="price">{price("exclusive")}</div>
            <p style={{ color: "var(--mute)" }}>Negociação personalizada, feita por conversa direta.</p>
            <ul>
              <li>WAV</li><li>Stems/Multitracks</li><li>Uso comercial</li><li>Streaming</li><li>YouTube</li><li>Redes sociais</li><li>Monetização</li><li>Apresentações</li><li>Videoclipes</li><li>Exclusividade para novas licenças do beat</li>
            </ul>
            <p className="obs">A licença exclusiva não significa automaticamente transferência total dos direitos autorais. Consulte os termos da licença.</p>
            <button className="btn" onClick={() => buy("exclusive")}>CONSULTAR EXCLUSIVE</button>
          </article>
        </div>
        <p className="note">Pagamento e entrega dos arquivos são combinados diretamente comigo pelo Instagram.</p>
        <p className="legal">Os direitos concedidos dependem da licença adquirida e dos termos do contrato.</p>
      </div>
    </section>
  );
}