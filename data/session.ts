import type { Session } from "@/types";

/* SESSÃO MULTITRACK (seção "Por dentro do beat").
   Enquanto TODOS os "file" estiverem vazios, a DAW toca um áudio DEMO gerado no navegador.
   Para usar os stems reais: preencha "file" de cada track (ex. "stems/eclipse/drums.mp3").
   - Todos os stems devem começar no mesmo ponto (exportados a partir do compasso 1) para ficarem em sincronia.
   - Recomendado: trecho de 30–45 s, MP3 192 kbps. Qualquer arquivo servido no site pode ser baixado por quem souber procurar,
     então não publique os stems completos (eles fazem parte das licenças Premium/Exclusive).
   - O site precisa estar num servidor (hospedagem ou local). Aberto direto do arquivo, o navegador bloqueia o carregamento.
   kind (ícone e som demo): drums | bass | pad | keys | guitar | lead | vocal | fx */
export const SESSION: Session = {
  title: "Eclipse", beatId: "B001", bpm: 140, key: "F minor",
  stems: [
    { name:"Drums",      kind:"drums",  color:"#d6a92a", file:"" },
    { name:"808",        kind:"bass",   color:"#a3b42b", file:"" },
    { name:"Synth Pad",  kind:"pad",    color:"#4cb33a", file:"" },
    { name:"E-Piano",    kind:"keys",   color:"#27ad9b", file:"" },
    { name:"Guitar",     kind:"guitar", color:"#2a9fc9", file:"" },
    { name:"Lead Synth", kind:"lead",   color:"#4d6fd6", file:"" },
    { name:"FX",         kind:"fx",     color:"#9a45d1", file:"" }
  ]
};
