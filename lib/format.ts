export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmt = (s: number) =>
  isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00";
export function setRange(r: HTMLInputElement) {
  r.style.setProperty("--p", ((+r.value - +r.min) / (+r.max - +r.min)) * 100 + "%");
}
export const safeUrl = (u?: string) => /^https?:\/\//i.test(u || "");
