import React, { useState } from 'react';
import { Image as ImageIcon, X, Wand2, Download, Check } from 'lucide-react';
import { AppSettings, THEMES } from '../types';
import { generateWallpaper } from '../services/geminiService';
import { translations } from '../utils/translations';

interface WallpaperGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

const WallpaperGeneratorModal: React.FC<WallpaperGeneratorModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;

  const themeColors = THEMES[settings.theme];
  const t = translations[settings.language];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await generateWallpaper(prompt);
    setGeneratedImage(result);
    setLoading(false);
  };

  const handleSetWallpaper = () => {
    if (generatedImage) {
      onUpdateSettings({ ...settings, customBackgroundImage: generatedImage });
      onClose();
    }
  };

  const handleReset = () => {
     onUpdateSettings({ ...settings, customBackgroundImage: undefined });
     onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in fade-in duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className={`p-6 flex justify-between items-center ${themeColors.bg} border-b border-black/5`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/50`}>
                <ImageIcon className={`w-5 h-5 ${themeColors.accent}`} />
            </div>
            <h2 className={`font-bold text-xl ${themeColors.accent}`}>Wallpaper Studio</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <X className={`w-5 h-5 ${themeColors.accent}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          <div className="mb-6">
             <div className="aspect-[9/16] w-full rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group shadow-inner">
               {loading ? (
                 <div className="flex flex-col items-center p-6 text-center">
                    <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4 ${themeColors.accent.replace('text-', 'border-')}`}></div>
                    <p className="text-sm font-medium text-slate-500 animate-pulse">Dreaming up your wallpaper...</p>
                 </div>
               ) : generatedImage ? (
                 <img src={generatedImage} alt="Generated Wallpaper" className="w-full h-full object-cover" />
               ) : (
                 <div className="text-center p-6">
                   <Wand2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                   <p className="text-sm text-slate-400 font-medium">AI Generated Art</p>
                 </div>
               )}
             </div>
          </div>

          <div className="space-y-4">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Describe your vibe</label>
               <div className="relative">
                 <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Misty mountains at sunrise, zen garden, cosmic nebula..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-slate-800 placeholder:text-slate-400"
                    style={{ '--tw-ring-color': themeColors.beadActive } as React.CSSProperties}
                 />
                 <button 
                   onClick={handleGenerate}
                   disabled={loading || !prompt.trim()}
                   className={`absolute right-2 top-2 bottom-2 aspect-square rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-md ${themeColors.button}`}
                 >
                   <Wand2 size={20} />
                 </button>
               </div>
             </div>

             {generatedImage && (
               <button 
                 onClick={handleSetWallpaper}
                 className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${themeColors.button}`}
               >
                 <Check size={20} />
                 Set as Wallpaper
               </button>
             )}
             
             {settings.customBackgroundImage && (
                <button 
                  onClick={handleReset}
                  className="w-full py-3 rounded-2xl font-medium text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                >
                  Remove Current Wallpaper
                </button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WallpaperGeneratorModal;