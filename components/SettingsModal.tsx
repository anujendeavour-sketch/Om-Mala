import React, { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, Settings as SettingsIcon, Check, Palette, Globe, Image as ImageIcon, Music } from 'lucide-react';
import { THEMES, AppSettings, HapticIntensity, BeadSound, MalaSound } from '../types';
import { translations } from '../utils/translations';
import WallpaperGeneratorModal from './WallpaperGeneratorModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings 
}) => {
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);

  if (!isOpen) return null;

  const themeColors = THEMES[settings.theme];
  const t = translations[settings.language];

  const handleIntensityChange = (intensity: HapticIntensity) => {
    onUpdateSettings({ ...settings, hapticIntensity: intensity });
    if (navigator.vibrate) {
      const patterns = { low: 2, medium: 5, high: 15 };
      navigator.vibrate(patterns[intensity]);
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/20">
        
        {/* Header */}
        <div className={`p-6 flex justify-between items-center ${themeColors.bg} border-b border-black/5`}>
          <div className="flex items-center gap-3">
            <SettingsIcon className={`w-6 h-6 ${themeColors.accent}`} />
            <h2 className={`font-bold text-2xl ${themeColors.accent}`}>{t.settings}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className={`w-6 h-6 ${themeColors.accent}`} />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* Language Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${themeColors.bg}`}>
                <Globe className={`w-5 h-5 ${themeColors.accent}`} />
              </div>
              <span className="font-bold text-slate-700">{t.language}</span>
            </div>
            <div className="flex gap-3">
               <button 
                 onClick={() => onUpdateSettings({...settings, language: 'en'})}
                 className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${settings.language === 'en' ? `${themeColors.button} border-transparent shadow-md` : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
               >
                 English
               </button>
               <button 
                 onClick={() => onUpdateSettings({...settings, language: 'hi'})}
                 className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${settings.language === 'hi' ? `${themeColors.button} border-transparent shadow-md` : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
               >
                 हिंदी
               </button>
            </div>
          </div>
          
          <div className="h-px bg-slate-100" />
          
          {/* Sound Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${themeColors.bg}`}>
                  {settings.soundEnabled ? 
                    <Volume2 className={`w-5 h-5 ${themeColors.accent}`} /> : 
                    <VolumeX className={`w-5 h-5 ${themeColors.accent}`} />
                  }
                </div>
                <span className="font-bold text-slate-700">{t.soundEffects}</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${settings.soundEnabled ? themeColors.button : 'bg-slate-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform duration-200 ${settings.soundEnabled ? 'left-7' : 'left-1'} shadow-sm`} />
              </button>
            </div>

            {settings.soundEnabled && (
               <div className="space-y-4 pl-12 animate-in slide-in-from-top-2 fade-in duration-200">
                  {/* Bead Sound Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.beadSound}</label>
                    <div className="grid grid-cols-2 gap-2">
                       {(['click', 'wood', 'stone', 'soft'] as BeadSound[]).map((sound) => (
                          <button
                            key={sound}
                            onClick={() => onUpdateSettings({ ...settings, beadSound: sound })}
                            className={`py-2 rounded-xl text-xs font-bold transition-all border ${settings.beadSound === sound ? `${themeColors.bg} ${themeColors.accent} border-current` : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                          >
                             {t.sounds[sound]}
                          </button>
                       ))}
                    </div>
                  </div>

                  {/* Mala Sound Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.malaSound}</label>
                    <div className="grid grid-cols-3 gap-2">
                       {(['bell', 'gong', 'chime'] as MalaSound[]).map((sound) => (
                          <button
                            key={sound}
                            onClick={() => onUpdateSettings({ ...settings, malaSound: sound })}
                            className={`py-2 rounded-xl text-xs font-bold transition-all border ${settings.malaSound === sound ? `${themeColors.bg} ${themeColors.accent} border-current` : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                          >
                             {t.sounds[sound]}
                          </button>
                       ))}
                    </div>
                  </div>
               </div>
            )}
          </div>

          <div className="h-px bg-slate-100" />

          {/* Haptics Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${themeColors.bg}`}>
                  <Smartphone className={`w-5 h-5 ${themeColors.accent}`} />
                </div>
                <span className="font-bold text-slate-700">{t.hapticFeedback}</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ ...settings, hapticsEnabled: !settings.hapticsEnabled })}
                className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${settings.hapticsEnabled ? themeColors.button : 'bg-slate-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform duration-200 ${settings.hapticsEnabled ? 'left-7' : 'left-1'} shadow-sm`} />
              </button>
            </div>

            {settings.hapticsEnabled && (
              <div className="pl-12 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => handleIntensityChange(level)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        settings.hapticIntensity === level 
                          ? 'bg-white text-slate-800 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100" />

          {/* Theme Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${themeColors.bg}`}>
                    <Palette className={`w-5 h-5 ${themeColors.accent}`} />
                  </div>
                  <span className="font-bold text-slate-700">{t.theme}</span>
                </div>
                <button 
                  onClick={() => setIsWallpaperModalOpen(true)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1`}
                >
                    <ImageIcon size={14} />
                    Customize
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {(['wood', 'stone', 'rudraksha', 'lotus', 'ocean', 'nebula', 'midnight', 'forest', 'crimson'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdateSettings({ ...settings, theme: t })}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                    settings.theme === t 
                      ? `${THEMES[t].accent.replace('text-', 'border-')} bg-white shadow-sm` 
                      : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: THEMES[t].bead, border: `2px solid ${THEMES[t].beadActive}` }}
                  />
                  <span className={`text-xs font-bold capitalize ${settings.theme === t ? 'text-slate-900' : 'text-slate-500'}`}>
                    {t}
                  </span>
                  {settings.theme === t && (
                    <div className={`absolute top-2 right-2 ${THEMES[t].accent}`}>
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <WallpaperGeneratorModal 
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
    />
    </>
  );
};

export default SettingsModal;