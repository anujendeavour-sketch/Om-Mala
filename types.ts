export interface Mantra {
  text: string;
  meaning: string;
  pronunciation: string;
}

export interface SessionData {
  currentCount: number;
  roundsCompleted: number;
  totalCountsLifetime: number;
  startTime: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  durationSeconds: number;
  totalCount: number;
  rounds: number;
}

export type HapticIntensity = 'low' | 'medium' | 'high';
export type Language = 'en' | 'hi';
export type BeadSound = 'soft' | 'click' | 'wood' | 'stone';
export type MalaSound = 'bell' | 'gong' | 'chime';

export interface TargetConfig {
  enabled: boolean;
  mode: 'count' | 'round'; // 'count' = total beads, 'round' = total malas
  value: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  hapticIntensity: HapticIntensity;
  beadCount: 108 | 54 | 27;
  countingMode: 'bead' | 'mala';
  target: TargetConfig;
  theme: 'wood' | 'stone' | 'rudraksha' | 'lotus' | 'ocean' | 'nebula' | 'midnight' | 'forest' | 'crimson';
  language: Language;
  customBackgroundImage?: string;
  beadSound: BeadSound;
  malaSound: MalaSound;
}

export const THEMES = {
  wood: {
    bead: '#D2B48C',
    beadActive: '#8B4513',
    bg: 'bg-[#fdfbf7]',
    accent: 'text-amber-800',
    button: 'bg-amber-700 hover:bg-amber-800 text-white',
    buttonSecondary: 'bg-amber-100 text-amber-900 hover:bg-amber-200',
  },
  stone: {
    bead: '#94a3b8',
    beadActive: '#334155',
    bg: 'bg-slate-50',
    accent: 'text-slate-700',
    button: 'bg-slate-700 hover:bg-slate-800 text-white',
    buttonSecondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  },
  rudraksha: {
    bead: '#A0522D',
    beadActive: '#60100B', // Darker red-brown for active rudraksha
    bg: 'bg-orange-50',
    accent: 'text-orange-900',
    button: 'bg-orange-800 hover:bg-orange-900 text-white',
    buttonSecondary: 'bg-orange-100 text-orange-900 hover:bg-orange-200',
  },
  lotus: {
    bead: '#fbcfe8',
    beadActive: '#db2777',
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    accent: 'text-pink-700',
    button: 'bg-pink-600 hover:bg-pink-700 text-white',
    buttonSecondary: 'bg-white text-pink-600 hover:bg-pink-50 border border-pink-200',
  },
  ocean: {
    bead: '#a5f3fc',
    beadActive: '#0891b2',
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    accent: 'text-cyan-800',
    button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    buttonSecondary: 'bg-white text-cyan-600 hover:bg-cyan-50 border border-cyan-200',
  },
  nebula: {
    bead: '#c4b5fd',
    beadActive: '#7c3aed',
    bg: 'bg-gradient-to-br from-violet-50 to-fuchsia-50',
    accent: 'text-violet-900',
    button: 'bg-violet-600 hover:bg-violet-700 text-white',
    buttonSecondary: 'bg-white text-violet-600 hover:bg-violet-50 border border-violet-200',
  },
  midnight: {
    bead: '#475569',
    beadActive: '#f8fafc',
    bg: 'bg-slate-900',
    accent: 'text-slate-200',
    button: 'bg-slate-100 hover:bg-white text-slate-900',
    buttonSecondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600',
  },
  forest: {
    bead: '#86efac',
    beadActive: '#15803d',
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    accent: 'text-emerald-900',
    button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    buttonSecondary: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200',
  },
  crimson: {
    bead: '#fca5a5',
    beadActive: '#991b1b',
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    accent: 'text-red-900',
    button: 'bg-red-800 hover:bg-red-900 text-white',
    buttonSecondary: 'bg-red-100 text-red-900 hover:bg-red-200',
  }
};