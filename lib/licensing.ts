import type { Beat, LicenseType } from "@/types";

export const priceFor = (b: Beat, l: LicenseType) =>
  ({ basic: b.basicPrice, premium: b.premiumPrice, exclusive: b.exclusivePrice })[l];
