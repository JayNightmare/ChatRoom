import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatMessage } from '../pages/Chat';

export function useSocket(userId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const s = io('http://localhost:4000', { auth: { userId } });
    setSocket(s);
    s.on('chat:history', (hist: ChatMessage[]) => setMessages(hist));
    s.on('chat:new', (msg: ChatMessage) => setMessages(m => [...m, msg].slice(-600))); // soft cap
    return () => { s.disconnect(); };
  }, [userId]);

  return { socket, messages };
}
