import { z } from 'zod';

export const ChatSendSchema = z.object({
  text: z.string().min(1).max(500),
});

export function sanitizeMessage(text: string) {
  let cleaned = String(text);
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  cleaned = cleaned.replace(/[\p{Cc}\p{Cf}]+/gu, '');
  return cleaned.slice(0, 500);
}

const badWords = ['badword1', 'badword2'];
export function maskProfanity(text: string) {
  const re = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
  return text.replace(re, (m) => '*'.repeat(m.length));
}
