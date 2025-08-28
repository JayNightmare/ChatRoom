/* eslint-disable */
import React from 'react';
import type { ChatMessage } from '../pages/Chat';

export const MessageItem: React.FC<{ msg: ChatMessage; self: boolean }> = ({ msg, self }) => {
  if (msg.system) {
    return <div className="text-center text-xs text-muted italic">{msg.text}</div>;
  }
  return (
    <div
      className={
        'flex flex-col max-w-[75%] ' + (self ? 'ml-auto items-end' : 'items-start')
      }
      style={{ ['--name-color' as string]: msg.nameColor, ['--msg-color' as string]: msg.messageColor } as React.CSSProperties}
    >
      <div className="text-xs opacity-70 mb-0.5 font-semibold" style={{ color: 'var(--name-color)' }}>
        {msg.displayName}
      </div>
      <div className="px-3 py-2 rounded border border-border bg-panel shadow-theme text-sm" style={{ color: 'var(--msg-color)' }}>
        <span>{msg.text}</span>
      </div>
    </div>
  );
};
