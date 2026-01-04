import React, { useState } from 'react';
import { THEMES, AppSettings } from '../types';
import { translations } from '../utils/translations';
import { ChevronRight, Globe } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, settings, onUpdateSettings }) => {
  const [step, setStep] = useState(0);
  const themeColors = THEMES[settings.theme];
  const t = translations[settings.language];

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete();
  };

  const steps = [
    {
      title: t.onboarding.welcomeTitle,
      desc: t.onboarding.welcomeDesc,
      icon: "🕉️",
      showLang: true
    },
    {
      title: t.onboarding.tapTitle,
      desc: t.onboarding.tapDesc,
      icon: "👆"
    },
    {
      title: t.onboarding.modesTitle,
      desc: t.onboarding.modesDesc,
      icon: "📿"
    },
    {
      title: t.onboarding.featuresTitle,
      desc: t.onboarding.featuresDesc,
      icon: "✨"
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in fade-in duration-300 relative">
        
        {/* Progress Bar */}
        <div className="flex h-1.5 w-full bg-slate-100">
          {[0, 1, 2, 3].map((i) => (
             <div 
               key={i} 
               className={`flex-1 transition-colors duration-500 ${i <= step ? themeColors.bg.replace('bg-', 'bg-') : 'bg-transparent'} ${i <= step ? themeColors.button : ''}`} 
               style={{ opacity: i <= step ? 1 : 0 }}
             />
          ))}
        </div>

        <div className="p-8 text-center flex flex-col items-center min-h-[400px]">
           <div className="text-6xl mb-6 animate-bounce delay-700 duration-1000">{current.icon}</div>
           
           <h2 className={`text-2xl font-bold mb-4 ${themeColors.accent}`}>{current.title}</h2>
           <p className="text-slate-600 leading-relaxed mb-8">{current.desc}</p>

           {current.showLang && (
             <div className="mb-8 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-center gap-2 mb-3 text-sm font-semibold text-slate-500">
                  <Globe size={16} /> Select Language / भाषा चुनें
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={() => onUpdateSettings({...settings, language: 'en'})}
                     className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border-2 ${settings.language === 'en' ? `${themeColors.button} border-transparent text-white` : 'bg-white border-slate-200 text-slate-500'}`}
                   >
                     English
                   </button>
                   <button 
                     onClick={() => onUpdateSettings({...settings, language: 'hi'})}
                     className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border-2 ${settings.language === 'hi' ? `${themeColors.button} border-transparent text-white` : 'bg-white border-slate-200 text-slate-500'}`}
                   >
                     हिंदी
                   </button>
                </div>
             </div>
           )}

           <div className="mt-auto w-full">
             <button 
               onClick={nextStep}
               className={`w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${themeColors.button}`}
             >
               {step === 3 ? t.onboarding.start : (settings.language === 'hi' ? 'आगे' : 'Next')}
               {step < 3 && <ChevronRight size={18} />}
             </button>
           </div>
        </div>

        {/* Step dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
           {steps.map((_, i) => (
             <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-slate-400' : 'bg-slate-200'}`} />
           ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;