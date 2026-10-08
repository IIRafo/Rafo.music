"use client";
import type { CSSProperties } from "react";

/* <input type="range"> com a variável --p que o CSS original usa para pintar a barra de progresso. */
type Props = { value: number; min: number; max: number; step: number; label: string; id?: string; onChange: (v: number) => void };
export default function Range({ value, min, max, step, label, id, onChange }: Props) {
  const style = { "--p": `${((value - min) / (max - min)) * 100}%` } as CSSProperties;
  return (
    <input type="range" id={id} min={min} max={max} step={step} value={value} aria-label={label} style={style}
      onChange={(e) => onChange(+e.target.value)} />
  );
}
