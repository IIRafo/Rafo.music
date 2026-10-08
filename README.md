# Rafo Beats (Next.js): site vitrine

Site de vitrine: catálogo com previews, comparação de licenças com preços por beat, explicação sobre stems, FAQ e contato. **Não há pagamento nem entrega automáticos.** Os botões de compra levam ao Instagram, onde você combina o pagamento e envia os arquivos manualmente. Não há banco de dados nem backend.

## Como rodar

Requer Node.js 18.18 ou superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run start      # serve o build
npm run typecheck  # checagem de tipos
```

## Onde editar

| O quê | Onde |
|---|---|
| Beats, preços, status, capas e previews | `data/beats.ts` |
| Instagram, TikTok, YouTube, e-mail, foto | `data/site.ts` |
| FAQ | `data/faq.ts` |
| Seção "O que são stems?" (texto + mixer interativo) | `components/DawSection.tsx`; stems da demonstração em `data/session.ts` |
| CSS original | `app/globals.css` (não alterado); textos da seção de stems em `app/stems.css` |

**Adicionar um beat:** copie um objeto de `data/beats.ts` e troque `id`, nome, BPM, tonalidade e preços. Coloque a capa em `public/images/` (`cover: "/images/x.jpg"`) e o preview em `public/audio/` (`previewAudio: "/audio/x-preview.mp3"`). Sem capa, ela é gerada; sem áudio, o player avisa.

**Preços:** cada beat tem `basicPrice`, `premiumPrice` e `exclusivePrice`. Na seção de licenças, os valores mudam conforme o beat selecionado em VER LICENÇAS.

## Como funciona a compra

Ao clicar em ESCOLHER BASIC, ESCOLHER PREMIUM ou CONSULTAR EXCLUSIVE com um beat selecionado, o site abre o direct do Instagram (`https://ig.me/m/<perfil>`, tirado de `SITE.instagram`) e copia para a área de transferência uma mensagem pronta, como: "Olá! Quero a licença Premium do beat Eclipse (B001), por R$ 149,90." O cliente só precisa colar. O botão FALE COMIGO abre o mesmo direct. Se o link `ig.me` não abrir a conversa, preencha `SITE.instagramContactUrl` com o link do perfil.

## Exclusividade (controle manual)

`status` do beat em `data/beats.ts`: `available`, `exclusive_sold` ou `hidden`.

- `exclusive_sold`: o beat continua no catálogo como portfólio, com "EXCLUSIVE SOLD", toca o preview e não tem botão de licenças.
- A venda Exclusive vale só para vendas futuras: licenças Basic e Premium vendidas antes continuam válidas. Por isso **mantenha uma planilha** com beat, licença, cliente, data e valor de cada venda.
- Antes de fechar uma Exclusive, confira a planilha e se não há outra negociação em andamento para o mesmo beat.
- Depois de editar o arquivo, publique o site de novo.

## Segurança dos arquivos

`/public` é totalmente público: coloque nele só capas e previews com tag. WAV, MP3 limpo e stems **nunca** vão para o site; envie-os por link privado (Google Drive, Dropbox) depois de confirmar o pagamento.

## Seção "O que são stems?"

Explica o que são stems e traz um mixer interativo, parecido com uma DAW (play, mute, solo, volume por track). Ele usa **uma sessão de demonstração** (`data/session.ts`) com áudio gerado no navegador, então você não precisa exportar stems de cada beat. Para usar stems reais de um beat, coloque trechos curtos em `public/stems/` e preencha o campo `file` de cada stem em `data/session.ts`. Esses arquivos ficam públicos: nunca coloque neles os stems completos que você vende.

## Muitos beats

Não há limite de beats. O catálogo mostra 6 por vez e um botão "VER MAIS BEATS" libera mais 6. Para mudar a quantidade, edite `PAGE_SIZE` em `components/BeatCatalog.tsx`. Dicas ao adicionar beats: use um `createdAt` mais novo para o beat aparecer primeiro em "Mais recentes", e se usar um estilo que não existe nos filtros, acrescente-o em `GENRES` no fim de `data/beats.ts`.

## O que foi removido

Os testes do checkout, o backend de pedidos, o Mercado Pago e o Prisma/PostgreSQL foram retirados. Se quiser voltar a eles no futuro, use o zip da versão 0.2.0.
