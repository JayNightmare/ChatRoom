import { z } from 'zod';

export const hexColorRegex = /^#?[0-9a-fA-F]{6}$/;
export const HexColor = z.string().regex(hexColorRegex).transform(v => v.startsWith('#') ? v.toLowerCase() : `#${v.toLowerCase()}`);

function srgbToLin(c: number) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function parseHex(hex: string) {
  const m = hexColorRegex.exec(hex);
  if (!m) throw new Error('invalid hex');
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

export function relativeLuminance(hex: string) {
  const { r, g, b } = parseHex(hex);
  const R = srgbToLin(r);
  const G = srgbToLin(g);
  const B = srgbToLin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(a: string, b: string) {
  const L1 = relativeLuminance(a) + 0.05;
  const L2 = relativeLuminance(b) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

export function colorDistance(a: string, b: string) {
  const ca = parseHex(a);
  const cb = parseHex(b);
  const dr = ca.r - cb.r;
  const dg = ca.g - cb.g;
  const db = ca.b - cb.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function isTooClose(a: string, b: string) {
  return colorDistance(a, b) < 32; // heuristic
}

export function suggestions(target: string, bg: string, needed = 3): string[] {
  const results: string[] = [];
  let step = 15;
  let attempt = 0;
  const t = parseHex(target);
  while (results.length < needed && attempt < 500) {
    attempt++;
    const variants = [
      { r: (t.r + step) % 256, g: t.g, b: t.b },
      { r: t.r, g: (t.g + step) % 256, b: t.b },
      { r: t.r, g: t.g, b: (t.b + step) % 256 },
      { r: (t.r + 255 - step) % 256, g: t.g, b: t.b },
    ];
    for (const v of variants) {
      const hex = `#${v.r.toString(16).padStart(2, '0')}${v.g.toString(16).padStart(2, '0')}${v.b.toString(16).padStart(2, '0')}`;
      if (results.includes(hex)) continue;
      const ratio = contrastRatio(hex, bg);
      if (ratio >= 4.5 && !isTooClose(hex, bg)) {
        results.push(hex);
        if (results.length === needed) break;
      }
    }
    step += 17;
  }
  return results;
}
