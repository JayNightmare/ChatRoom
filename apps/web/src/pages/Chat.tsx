import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useSocket } from '../hooks/useSocket';
import { MessageItem } from '../components/MessageItem';
import { ProfilePanel } from '../components/ProfilePanel';

export interface ChatMessage {
  id: string;
  userId: string;
  displayName: string;
  nameColor: string;
  messageColor: string;
  text: string;
  timestamp: number;
  system?: boolean;
}

export const Chat: React.FC = () => {
  const { profile } = useAppStore();
  const { socket, messages } = useSocket(profile.userId);
  const [text, setText] = useState('');
  const [showProfile, setShowProfile] = useState(!localStorage.getItem('chatroom_profile_complete'));
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function send() {
    if (!text.trim()) return;
    socket?.emit('chat:send', { text, userId: profile.userId });
    setText('');
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 bg-panel shadow-theme border-b border-border">
        <strong className="tracking-wide">ChatRoom</strong>
        <button aria-label="Edit Profile" className="text-sm px-3 py-1 rounded bg-accent text-white" onClick={()=>setShowProfile(s=>!s)}>Profile</button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-2" aria-live="polite">
        {messages.map(m => <MessageItem key={m.id + m.timestamp} msg={m} self={m.userId===profile.userId} />)}
        <div ref={endRef} />
      </div>
      <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2 p-3 bg-panel border-t border-border">
        <input aria-label="Message" value={text} onChange={e=>setText(e.target.value)} className="flex-1 rounded bg-bg border border-border px-3 py-2 outline-none focus:border-accent" placeholder="Type a message" maxLength={500} />
        <button disabled={!text.trim()} type="submit" className="px-4 py-2 rounded bg-accent disabled:opacity-50 text-white font-medium">Send</button>
      </form>
      {showProfile && <ProfilePanel onClose={()=>{ setShowProfile(false); localStorage.setItem('chatroom_profile_complete','1'); }} />}
    </div>
  );
};
