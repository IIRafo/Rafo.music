import type { Beat } from "@/types";

/* DADOS DOS BEATS (migrados do arquivo original; ids, nomes e preços inalterados).
   status: "available" | "exclusive_sold" (antes "exclusive") | "hidden".
   cover/previewAudio vazios: capa gerada automaticamente e o player avisa que não há áudio.
   createdAt e plays servem só para ordenação. Para marcar um beat como vendido em Exclusive, troque o status para "exclusive_sold". */
export const BEATS: Beat[] = [
  { id:"B001", name:"Dollar",  bpm:140, key:"B minor", genre:"Drill", description:"Placeholder", duration:"2:37",
    cover:"", previewAudio:"/audio/Dollar MP3 - Copia.mp3", basicPrice:49.90, premiumPrice:149.90, exclusivePrice:799.90, status:"available", createdAt:"2026-03-01", plays:0 },
  { id:"B002", name:"Insanity",    bpm:133, key:"B minor", genre:"Hard Trap",  description:"Placeholder", duration:"3:30",
    cover:"", previewAudio:"/audio/INSANIDADE MP3 - Copia.mp3", basicPrice:49.90, premiumPrice:149.90, exclusivePrice:799.90, status:"available", createdAt:"2026-02-01", plays:0 },
  { id:"B003", name:"Gross", bpm:128, key:"C minor", genre:"Hard Trap",             description:"Placeholder", duration:"3:08",
    cover:"", previewAudio:"/audio/Gross MP3 - Copia.mp3", basicPrice:49.90, premiumPrice:149.90, exclusivePrice:799.90, status:"available", createdAt:"2026-01-01", plays:0 },
  { id:"B004", name:"Redenção", bpm:133, key:"E minor", genre:"Trap", description:"Placeholder", duration:"3:17",
     cover:"", previewAudio:"/audio/Redenção MP3.mp3",
     basicPrice:49.90, premiumPrice:149.90, exclusivePrice:799.90,
     status:"available", createdAt:"2026-10-09", plays:0 },
  { id:"B005", name:"GRITOS", bpm:157, key:"D minor", genre:"Trap", description:"Placeholder", duration:"4:16",
     cover:"", previewAudio:"/audio/GRITOS.mp3",
     basicPrice:49.90, premiumPrice:149.90, exclusivePrice:799.90,
     status:"available", createdAt:"2026-10-09", plays:0 },
];

export const GENRES = ["Todos","Trap","Alternative","R&B","Drill","Hard Trap"];
