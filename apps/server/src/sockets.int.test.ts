import { describe, it, expect } from 'vitest';
import { createApp } from './serverApp';
import { io as Client } from 'socket.io-client';

describe('socket integration', () => {
  it('connects and receives history', async () => {
    const { httpServer } = await createApp();
    await new Promise<void>((res) => httpServer.listen(0, res));
    const address = httpServer.address();
    if (!address || typeof address === 'string') throw new Error('no addr');
    const url = `http://localhost:${address.port}`;
    const client = Client(url, { auth: { userId: 'test-user' } });
    const history: unknown[] = await new Promise((res) =>
      client.once('chat:history', res),
    );
    expect(Array.isArray(history)).toBe(true);
    client.close();
  });
});
