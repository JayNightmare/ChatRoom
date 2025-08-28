import { create } from 'zustand';

export type Theme = 'retro' | 'xp' | 'modern';

export interface UserProfile {
  userId: string;
  displayName: string;
  theme: Theme;
  nameColor: string;
  messageColor: string;
}

interface AppState {
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;
  mutedUntil?: number;
  setMuted: (until: number) => void;
  lastProfileError?: string;
  profileSuggestions: string[];
  setProfileResponse: (err?: string, suggestions?: string[]) => void;
}

const stored = localStorage.getItem('chatroom_profile');
const defaultProfile: UserProfile = stored ? JSON.parse(stored) : {
  userId: crypto.randomUUID(),
  displayName: 'Anon',
  theme: 'modern',
  nameColor: '#6366f1',
  messageColor: '#f5f5f5'
};

export const useAppStore = create<AppState>((set) => ({
  profile: defaultProfile,
  setProfile: (p) => set(s => {
    const merged = { ...s.profile, ...p };
    localStorage.setItem('chatroom_profile', JSON.stringify(merged));
    document.documentElement.setAttribute('data-theme', merged.theme);
    return { profile: merged };
  }),
  setMuted: (until) => set(() => ({ mutedUntil: until })),
  profileSuggestions: [],
  setProfileResponse: (err, suggestions=[]) => set(()=>({ lastProfileError: err, profileSuggestions: suggestions }))
}));

document.documentElement.setAttribute('data-theme', defaultProfile.theme);
