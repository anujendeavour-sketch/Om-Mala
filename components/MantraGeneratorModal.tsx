import React, { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { Mantra, AppSettings, THEMES } from '../types';
import { translations } from '../utils/translations';

interface MantraGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (intent: string) => Promise<void>;
  loading: boolean;
  mantra: Mantra | null;
  settings: AppSettings;
}

const MantraGeneratorModal: React.FC<MantraGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  loading,
  mantra,
  settings
}) => {
  const [intent, setIntent] = useState('');
  const [activePreset, setActivePreset] = useState('');
  
  if (!isOpen) return null;

  const themeColors = THEMES[settings.theme];
  const t = translations[settings.language];
  const presets = [
    t.presets.peace, 
    t.presets.fear, 
    t.presets.focus, 
    t.presets.healing, 
    t.presets.gratitude, 
    t.presets.strength
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (intent.trim()) {
      onGenerate(intent);
    }
  };

  const handlePresetClick = (preset: string) => {
    setIntent(preset);
    setActivePreset(preset);
    onGenerate(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in fade-in duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className={`p-5 flex justify-between items-center ${themeColors.bg} border-b border-black/5 shrink-0`}>
          <div className="flex items-center gap-2">
            <Sparkles className={`w-5 h-5 ${themeColors.accent}`} />
            <h2 className={`font-bold text-xl ${themeColors.accent}`}>{t.aiMantraGuide}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <X className={`w-5 h-5 ${themeColors.accent}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center h-full">
               <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-6 ${themeColors.accent.replace('text-', 'border-')}`}></div>
               <p className="text-slate-600 font-medium animate-pulse">{t.consultingWisdom}</p>
               <p className="text-sm text-slate-400 mt-2">{t.findingMantra} "{intent}"</p>
             </div>
          ) : mantra ? (
             <div className="flex flex-col h-full justify-between">
               <div>
                 <h3 className={`text-xs uppercase tracking-widest font-bold mb-6 text-slate-400 text-center`}>{t.recommendedMantra}</h3>
                 <div className="mb-8 relative text-center">
                   <div className="absolute -top-4 left-0 right-0 text-6xl opacity-5 font-serif select-none">"</div>
                   <p className="text-3xl font-medium text-slate-800 mb-4 font-serif leading-tight relative z-10">{mantra.text}</p>
                   <p className="text-base text-slate-500 italic bg-slate-50 inline-block px-4 py-1 rounded-full">{mantra.pronunciation}</p>
                 </div>
                 
                 <div className={`rounded-xl p-5 mb-6 text-base text-slate-700 leading-relaxed border border-slate-100 ${themeColors.bg}`}>
                    <span className="font-semibold block mb-1 text-xs uppercase opacity-70">{t.meaning}</span>
                    {mantra.meaning}
                 </div>
               </div>

               <div className="space-y-3 mt-auto pt-4">
                 <button 
                  onClick={onClose}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${themeColors.button}`}
                 >
                   {t.useMantra}
                 </button>
                 <button 
                  onClick={() => onGenerate(intent)}
                  className="w-full py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                 >
                   {t.tryAnother}
                 </button>
               </div>
             </div>
          ) : (
             <div className="flex flex-col h-full">
               <p className="text-slate-600 mb-6 text-center leading-relaxed">
                 {t.intentionPrompt} <br/>
                 <span className="text-sm text-slate-400">{t.selectTopic}</span>
               </p>

               <div className="grid grid-cols-2 gap-3 mb-6">
                 {presets.map(preset => (
                   <button
                     key={preset}
                     onClick={() => handlePresetClick(preset)}
                     className={`p-3 rounded-xl text-sm font-medium transition-all text-left border ${
                       activePreset === preset 
                       ? `${themeColors.bg} ${themeColors.accent} border-current` 
                       : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:shadow-sm'
                     }`}
                   >
                     {preset}
                   </button>
                 ))}
               </div>

               <form onSubmit={handleSubmit} className="mt-auto relative">
                 <input
                   type="text"
                   value={intent}
                   onChange={(e) => {
                     setIntent(e.target.value);
                     setActivePreset('');
                   }}
                   placeholder={t.intentionPlaceholder}
                   className={`w-full pl-5 pr-12 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-slate-800 placeholder:text-slate-400 shadow-sm ${themeColors.accent.replace('text-', 'focus:ring-')}`}
                 />
                 <button 
                   type="submit"
                   disabled={!intent.trim()}
                   className={`absolute right-2 top-2 bottom-2 aspect-square rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${themeColors.button}`}
                 >
                   <Send size={18} />
                 </button>
               </form>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MantraGeneratorModal;