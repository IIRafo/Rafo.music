import type { Beat } from "@/types";

/* Capa gerada (quando o beat não tem imagem). Mesma lógica do original. */
export default function CoverArt({ beat }: { beat: Beat }) {
  let s = 0;
  for (const c of beat.id + beat.name) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  const hue = s % 360;
  const rnd = (i: number) => ((s >> (i % 16)) & 15) / 15;
  const bars = Array.from({ length: 28 }, (_, i) => {
    const hh = 30 + rnd(i + 3) * 140 * Math.abs(Math.sin(i * 0.5 + rnd(1) * 6));
    return <rect key={i} x={14 + i * 6.3} y={100 - hh / 2} width={3.6} height={hh} rx={1.8} fill={`hsl(${hue} 70% 82%)`} opacity={0.85} />;
  });
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Capa gerada do beat ${beat.name}`} preserveAspectRatio="xMidYMid slice">
      <rect width={200} height={200} fill={`hsl(${hue} 30% 16%)`} />
      <circle cx={40 + rnd(5) * 120} cy={40 + rnd(7) * 120} r={60 + rnd(2) * 30} fill={`hsl(${(hue + 40) % 360} 45% 26%)`} />
      {bars}
    </svg>
  );
}
