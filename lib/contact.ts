import { SITE } from "@/data/site";
import { safeUrl } from "./format";

export const igHandle = (u: string) => u.split("/").filter(Boolean).pop()!.replace("@", "");

/* Link que abre a conversa (direct) com o perfil. Se não abrir no seu caso, preencha SITE.instagramContactUrl
   com o link do perfil (ex.: https://instagram.com/seuperfil). */
export function contactUrl(): string {
  if (safeUrl(SITE.instagramContactUrl)) return SITE.instagramContactUrl;
  return safeUrl(SITE.instagram) ? `https://ig.me/m/${igHandle(SITE.instagram)}` : `mailto:${SITE.email}`;
}
