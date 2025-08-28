import Fastify from 'fastify';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerSockets } from './sockets.js';

export const THEMES = {
  retro: { name: '8-bit Retro', background: '#001b00' },
  xp: { name: 'Windows XP', background: '#3a6ea5' },
  modern: { name: 'Modern Sleek', background: '#1e1f22' },
};

export async function createApp() {
  const fastify = Fastify({ logger: false });
  fastify.get('/health', async () => ({ ok: true }));
  fastify.get('/config/themes', async () => THEMES);
  const httpServer = createServer(fastify.server);
  const io = new Server(httpServer, { cors: { origin: '*' } });
  registerSockets(io);
  return { fastify, io, httpServer };
}
