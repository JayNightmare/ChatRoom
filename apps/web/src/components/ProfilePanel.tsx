import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { contrastRatio } from '../utils/color';

interface Props { onClose: () => void }

const themeBg: Record<string,string> = { retro:'#001b00', xp:'#3a6ea5', modern:'#1e1f22'};

export const ProfilePanel: React.FC<Props> = ({ onClose }) => {
  const { profile, setProfile } = useAppStore();
  const [draft, setDraft] = useState(profile);
  const bg = themeBg[draft.theme];
  const nameContrast = contrastRatio(draft.nameColor, bg);
  const nameOk = nameContrast >= 4.5;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="w-full max-w-md bg-panel border border-border rounded shadow-theme p-4 space-y-4">
        <header className="flex justify-between items-center">
          <h2 className="font-semibold">Profile</h2>
          <button onClick={onClose} aria-label="Close" className="text-sm px-2 py-1 bg-accent text-white rounded">Close</button>
        </header>
        <label className="block text-sm space-y-1">
          <span>Display Name</span>
          <input value={draft.displayName} onChange={e=>setDraft(p=>({...p, displayName: e.target.value.slice(0,24)}))} className="w-full px-2 py-1 rounded bg-bg border border-border" />
        </label>
        <div className="flex gap-2">
          {(['retro','xp','modern'] as const).map(t => (
            <button key={t} onClick={()=>setDraft(p=>({...p, theme:t}))} className={`flex-1 border rounded px-2 py-1 text-sm ${draft.theme===t?'border-accent':'border-border'}`}>{t}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm space-y-1">
            <span>Name Color</span>
            <input type="color" value={draft.nameColor} onChange={e=>setDraft(p=>({...p, nameColor: e.target.value}))} />
            <div className={`text-xs ${nameOk?'text-green-400':'text-red-400'}`}>Contrast {nameContrast.toFixed(2)} {nameOk?'OK':'Fail'}</div>
          </label>
          <label className="text-sm space-y-1">
            <span>Message Color</span>
            <input type="color" value={draft.messageColor} onChange={e=>setDraft(p=>({...p, messageColor: e.target.value}))} />
          </label>
        </div>
        <button disabled={!draft.displayName.trim() || !nameOk} onClick={()=>{ setProfile(draft); onClose(); }} className="w-full py-2 rounded bg-accent text-white font-medium disabled:opacity-50">Save</button>
      </div>
    </div>
  );
};
