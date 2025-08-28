import { z } from 'zod';
import { HexColor, contrastRatio, isTooClose } from './color.js';

export const ProfileSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().min(1).max(24),
  theme: z.enum(['retro', 'xp', 'modern']),
  nameColor: HexColor,
  messageColor: HexColor,
});

export function sanitizeDisplayName(name: string) {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  return trimmed.slice(0, 24);
}

export function validateNameColorAgainstBg(nameColor: string, bg: string) {
  const ratio = contrastRatio(nameColor, bg);
  if (ratio < 4.5 || isTooClose(nameColor, bg)) {
    return false;
  }
  return true;
}
