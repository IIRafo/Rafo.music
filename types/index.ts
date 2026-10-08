export type BeatStatus = "available" | "exclusive_sold" | "hidden";
export type LicenseType = "basic" | "premium" | "exclusive";

export type Beat = {
  id: string;
  name: string;
  bpm: number;
  key: string;
  genre?: string;
  description?: string;
  duration?: string;
  previewAudio: string;
  cover?: string;
  basicPrice: number;
  premiumPrice: number;
  exclusivePrice: number;
  status: BeatStatus;
  createdAt: string;
  plays?: number;
};

export type Stem = { name: string; kind: string; color: string; file: string };
export type Session = { title: string; beatId: string; bpm: number; key: string; stems: Stem[] };
