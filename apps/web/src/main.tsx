import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './themes/base.css';
import './themes/retro.css';
import './themes/xp.css';
import './themes/modern.css';
import { Chat } from './pages/Chat';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<Chat />);
} else {
  console.error('Root element not found');
}
