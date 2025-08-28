import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class', '[data-theme="modern"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        text: 'var(--text)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        muted: 'var(--muted)'
      },
      boxShadow: {
        theme: 'var(--shadow)'
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace']
      }
    }
  },
  plugins: [plugin(function() {})]
};

export default config;
