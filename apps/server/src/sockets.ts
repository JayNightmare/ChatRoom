import { Server, Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import { getRecentMessages, addMessage } from './db/prisma.js';
import { ProfileSchema, sanitizeDisplayName } from './validators/profile.js';
import {
  ChatSendSchema,
  sanitizeMessage,
  maskProfanity,
} from './validators/message.js';
import { contrastRatio, isTooClose, suggestions } from './validators/color.js';
import { SlidingWindowRateLimiter } from './rateLimit.js';

interface UserProfile {
  userId: string;
  displayName: string;
  theme: 'retro' | 'xp' | 'modern';
  nameColor: string;
  messageColor: string;
}

const userProfiles = new Map<string, UserProfile>();
const rateLimiters = new Map<string, SlidingWindowRateLimiter>();

const THEME_BACKGROUNDS: Record<string, string> = {
  retro: '#001b00',
  xp: '#3a6ea5',
  modern: '#1e1f22',
};

export function registerSockets(io: Server) {
  io.on('connection', async (socket: Socket) => {
    const userId = socket.handshake.auth?.userId as string | undefined;
    // send history
    const history = await getRecentMessages(100);
    socket.emit(
      'chat:history',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      history.map((m) => ({ ...m, timestamp: Number((m as any).timestamp) })),
    );

    socket.on('user:updateProfile', (raw) => {
      try {
        const parsed = ProfileSchema.parse(raw);
        const profile: UserProfile = {
          ...parsed,
          displayName: sanitizeDisplayName(parsed.displayName) || 'Anon',
        };
        // contrast validation
        const bg = THEME_BACKGROUNDS[profile.theme];
        if (!bg) return;
        const ratio = contrastRatio(profile.nameColor, bg);
        if (ratio < 4.5 || isTooClose(profile.nameColor, bg)) {
          socket.emit('user:profileUpdated', {
            error: 'nameColor contrast fail',
            suggestions: suggestions(profile.nameColor, bg),
          });
          return;
        }
        userProfiles.set(profile.userId, profile);
        io.emit('user:profileUpdated', profile);
      } catch (e: unknown) {
        socket.emit('user:profileUpdated', { error: (e as Error).message });
      }
    });

    socket.on('chat:send', async (raw: { userId?: string; text: string }) => {
      const limiter =
        rateLimiters.get(socket.id) || new SlidingWindowRateLimiter(5, 10_000);
      rateLimiters.set(socket.id, limiter);
      if (!limiter.attempt()) {
        socket.emit('chat:new', { system: true, text: 'Rate limit exceeded' });
        return;
      }
      try {
        const { text } = ChatSendSchema.parse(raw);
        const cleaned = maskProfanity(sanitizeMessage(text));
        const targetUserId = raw.userId || userId;
        if (!targetUserId) return;
        const profile = userProfiles.get(targetUserId);
        if (!profile) return;
        const msg = {
          id: nanoid(),
          userId: profile.userId,
          displayName: profile.displayName,
          nameColor: profile.nameColor,
          messageColor: profile.messageColor,
          text: cleaned,
          timestamp: Date.now(),
        };
        await addMessage(msg);
        io.emit('chat:new', msg);
      } catch (e: unknown) {
        socket.emit('chat:new', { system: true, text: 'Message rejected' });
      }
    });
  });
}
