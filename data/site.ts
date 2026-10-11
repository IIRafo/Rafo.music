/* Configuração pública do site. Nada aqui é segredo. */
export const SITE = {
  artistName: "Rafo",
  instagram: "https://instagram.com/raafo.music",
  /* Opcional: link usado pelos botões de compra e "FALE COMIGO". Vazio = abre o direct do Instagram acima. */
  instagramContactUrl: "",
  tiktok: "https://tiktok.com/@rafo.music",
  youtube: "",                // TROCAR: link do canal (vazio = não aparece)
  email: "contact.rafo.music@gmail.com",
  photo: "/images/rafo.jpg",                  // TROCAR: ex. "/images/rafo.jpg" (arquivo em /public/images)
  /* Preços exibidos na seção de licenças enquanto nenhum beat foi selecionado.
     Ao clicar em VER LICENÇAS, valem os preços do próprio beat (data/beats.ts). */
  defaultPrices: { basic: 49.9, premium: 149.9, exclusive: 799.9 },
} as const;
