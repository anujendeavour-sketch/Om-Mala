import React, { useState } from 'react';
import { X, Calculator, Target, Info } from 'lucide-react';
import { THEMES, AppSettings, TargetConfig } from '../types';
import { translations } from '../utils/translations';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'goal' | 'calc'>('goal');
  const t = translations[settings.language];
  
  // Goal State
  const [goalValue, setGoalValue] = useState<string>(settings.target.value.toString());
  const [goalMode, setGoalMode] = useState<'count' | 'round'>(settings.target.mode);
  const [goalEnabled, setGoalEnabled] = useState<boolean>(settings.target.enabled);

  // Calc State
  const [calcTarget, setCalcTarget] = useState<string>('10000');
  
  if (!isOpen) return null;

  const themeColors = THEMES[settings.theme];

  const handleSaveGoal = () => {
    const val = parseInt(goalValue);
    if (!isNaN(val) && val > 0) {
      onUpdateSettings({
        ...settings,
        target: {
          enabled: goalEnabled,
          mode: goalMode,
          value: val
        }
      });
      onClose();
    }
  };

  // Calculator Logic
  const calcVal = parseInt(calcTarget) || 0;
  const malasNeeded = (calcVal / settings.beadCount).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className={`p-5 flex justify-between items-center ${themeColors.bg} shrink-0`}>
          <div className="flex items-center gap-2">
            <Target className={`w-5 h-5 ${themeColors.accent}`} />
            <h2 className={`font-bold text-xl ${themeColors.accent}`}>{t.goals}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <X className={`w-5 h-5 ${themeColors.accent}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 shrink-0">
          <button
            onClick={() => setActiveTab('goal')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'goal' ? `text-slate-800 border-b-2 ${themeColors.accent.replace('text-', 'border-')}` : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t.setTarget}
          </button>
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'calc' ? `text-slate-800 border-b-2 ${themeColors.accent.replace('text-', 'border-')}` : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t.malaCalculator}
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'goal' ? (
            <div className="space-y-6">
               <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                 <span className="font-medium text-slate-700">{t.enableGoal}</span>
                 <button 
                  onClick={() => setGoalEnabled(!goalEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${goalEnabled ? themeColors.button : 'bg-slate-200'}`}
                 >
                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${goalEnabled ? 'left-7' : 'left-1'}`} />
                 </button>
               </div>

               <div className={`space-y-4 transition-opacity duration-200 ${goalEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                 <div>
                   <label className="block text-xs uppercase font-bold text-slate-400 mb-2">{t.targetType}</label>
                   <div className="flex gap-2">
                     <button
                       onClick={() => setGoalMode('count')}
                       className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${goalMode === 'count' ? `${themeColors.button} border-transparent text-white shadow-md` : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                     >
                       {t.totalChants}
                     </button>
                     <button
                       onClick={() => setGoalMode('round')}
                       className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${goalMode === 'round' ? `${themeColors.button} border-transparent text-white shadow-md` : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                     >
                       {t.totalMalas}
                     </button>
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs uppercase font-bold text-slate-400 mb-2">{t.targetValue}</label>
                   <input
                    type="number"
                    value={goalValue}
                    onChange={(e) => setGoalValue(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-current text-2xl font-bold text-center"
                    style={{ color: THEMES[settings.theme].beadActive }}
                   />
                 </div>
               </div>

               <button
                 onClick={handleSaveGoal}
                 className={`w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95 ${themeColors.button} mt-4`}
               >
                 {t.saveGoal}
               </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  {t.desiredCount}
                </label>
                <input
                  type="number"
                  value={calcTarget}
                  onChange={(e) => setCalcTarget(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-current text-xl"
                  style={{ color: THEMES[settings.theme].beadActive }}
                />
              </div>

              <div className={`p-6 rounded-2xl ${themeColors.bg} flex flex-col items-center justify-center space-y-2`}>
                <span className="text-slate-500 text-sm font-medium">{t.beadsPerMala}: {settings.beadCount}</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`text-5xl font-bold ${themeColors.accent}`}>
                    {malasNeeded}
                  </span>
                  <span className={`text-xl ${themeColors.accent}`}>{t.rounds}</span>
                </div>
              </div>
              
              <div className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg text-xs text-slate-500 leading-relaxed">
                 <Info size={14} className="shrink-0 mt-0.5" />
                 <p>{t.calcInfo}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalModal;