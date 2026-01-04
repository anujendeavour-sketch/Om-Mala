import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX, Lightbulb, History as HistoryIcon, Target, CheckCircle2, MoreHorizontal, Settings, Sparkles, Trophy, Trash2 } from 'lucide-react';
import BeadRing from './components/BeadRing';
import GoalModal from './components/CalculatorModal'; 
import HistoryModal from './components/HistoryModal';
import SettingsModal from './components/SettingsModal';
import MantraGeneratorModal from './components/MantraGeneratorModal';
import Onboarding from './components/Onboarding';
import Logo from './components/Logo';
import { generateMantra } from './services/geminiService';
import { Mantra, AppSettings, THEMES, HistoryEntry } from './types';
import { translations } from './utils/translations';
import confetti from 'https://esm.sh/canvas-confetti@1.6.0';

const App: React.FC = () => {
  // State - Session
  const [count, setCount] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0); // Current session rounds
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [sessionTotalCount, setSessionTotalCount] = useState<number>(0); // Total clicks in this session
  
  // State - Global
  const [totalLifetime, setTotalLifetime] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
    hapticIntensity: 'medium',
    beadCount: 108,
    countingMode: 'bead',
    target: {
      enabled: false,
      mode: 'count',
      value: 108
    },
    theme: 'wood',
    language: 'en',
    beadSound: 'click',
    malaSound: 'bell'
  });
  
  // State - UI
  const [mantra, setMantra] = useState<Mantra | null>(null);
  const [loadingMantra, setLoadingMantra] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMantraGeneratorOpen, setIsMantraGeneratorOpen] = useState(false);
  const [showActiveMantra, setShowActiveMantra] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  
  // Onboarding Check
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('zenmala_data_v2');
    const hasVisited = localStorage.getItem('zenmala_visited');
    
    if (!hasVisited) {
        setShowOnboarding(true);
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTotalLifetime(parsed.totalLifetime || 0);
        setHistory(parsed.history || []);
        
        // Restore settings if they exist
        if (parsed.settings) {
          // Merge with defaults to ensure new fields exist
          setSettings(prev => ({ 
             ...prev, 
             ...parsed.settings,
             target: parsed.settings.target || prev.target,
             countingMode: parsed.settings.countingMode || prev.countingMode,
             language: parsed.settings.language || 'en',
             customBackgroundImage: parsed.settings.customBackgroundImage,
             beadSound: parsed.settings.beadSound || 'click',
             malaSound: parsed.settings.malaSound || 'bell'
          }));
        }

        // Restore active session if it exists and isn't too old (e.g., 24h)
        if (parsed.currentSession) {
          const { count, rounds, sessionStartTime, sessionTotalCount } = parsed.currentSession;
          if (Date.now() - sessionStartTime < 86400000) {
            setCount(count || 0);
            setRounds(rounds || 0);
            setSessionStartTime(sessionStartTime || Date.now());
            setSessionTotalCount(sessionTotalCount || 0);
          }
        }
      } catch (e) {
        console.error("Failed to load save data");
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      totalLifetime,
      history,
      settings,
      currentSession: {
        count,
        rounds,
        sessionStartTime,
        sessionTotalCount
      }
    };
    localStorage.setItem('zenmala_data_v2', JSON.stringify(dataToSave));
  }, [totalLifetime, history, settings, count, rounds, sessionStartTime, sessionTotalCount]);

  const completeOnboarding = () => {
      localStorage.setItem('zenmala_visited', 'true');
      setShowOnboarding(false);
  };

  // Handle Bead Count Change Reset
  useEffect(() => {
     if (count > settings.beadCount) {
         setCount(0);
     }
  }, [settings.beadCount]);

  // Goal Check
  useEffect(() => {
    if (settings.target.enabled && !goalReached) {
      let reached = false;
      if (settings.target.mode === 'count' && sessionTotalCount >= settings.target.value) reached = true;
      if (settings.target.mode === 'round' && rounds >= settings.target.value) reached = true;
      
      if (reached) {
        setGoalReached(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [themeColors.bead, themeColors.beadActive, '#ffffff']
        });
        playSound('mala');
      }
    }
    // Reset goal reached flag if we reset session
    if (sessionTotalCount === 0) setGoalReached(false);
  }, [sessionTotalCount, rounds, settings.target, goalReached]);


  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'bead' | 'mala') => {
    if (!settings.soundEnabled) return;
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if(ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'bead') {
       const beadSound = settings.beadSound;
       if (beadSound === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
       } else if (beadSound === 'soft') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.1);
       } else if (beadSound === 'wood') {
          // Rudraksha / Wood sound: lower pitch, quick drop
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.1);
       } else if (beadSound === 'stone') {
          // Sharp, higher pitch, quick
          osc.type = 'triangle'; // Using triangle for more harmonics than sine
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.05);
       }
    } else {
      // Mala Completion Sound
      const malaSound = settings.malaSound;
      
      if (malaSound === 'bell') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(523.25 / 2, now + 1.5);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
        osc.start(now);
        osc.stop(now + 2);
      } else if (malaSound === 'gong') {
        osc.type = 'sawtooth';
        // Simulating a low gong is harder with single osc, but we try a low freq
        osc.frequency.setValueAtTime(110, now); // A2
        
        // Lowpass filter to muffle the sawtooth harshness
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        
        osc.disconnect();
        osc.connect(filter);
        filter.connect(gain);
        
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3);
        osc.start(now);
        osc.stop(now + 3);
      } else if (malaSound === 'chime') {
         // High pitch sine cluster simulation (just one tone for now)
         osc.type = 'sine';
         osc.frequency.setValueAtTime(2093, now); // C7
         gain.gain.setValueAtTime(0.1, now);
         gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
         osc.start(now);
         osc.stop(now + 2.5);
      }
    }
  }, [settings.soundEnabled, settings.beadSound, settings.malaSound]);

  const triggerHaptic = useCallback(() => {
    if (settings.hapticsEnabled && navigator.vibrate) {
      const patterns = {
        low: 2,
        medium: 5,
        high: 15
      };
      navigator.vibrate(patterns[settings.hapticIntensity]);
    }
  }, [settings.hapticsEnabled, settings.hapticIntensity]);

  const handleTap = () => {
    // Logic varies by mode
    if (settings.countingMode === 'bead') {
        const maxBeads = settings.beadCount;
        const newCount = count + 1;
        setTotalLifetime(prev => prev + 1);
        setSessionTotalCount(prev => prev + 1);

        if (newCount > maxBeads) return;

        if (newCount === maxBeads) {
          // Round Complete
          setCount(0); 
          setRounds(r => r + 1);
          playSound('mala');
          
          if (settings.hapticsEnabled && navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
          }
        } else {
          setCount(newCount);
          playSound('bead');
          triggerHaptic();
        }
    } else {
        // Mala Mode: Tap counts as a Round completion
        setRounds(r => r + 1);
        const beadsAdded = settings.beadCount;
        setSessionTotalCount(prev => prev + beadsAdded);
        setTotalLifetime(prev => prev + beadsAdded);
        
        playSound('mala'); // Sound like a round completion
        if (settings.hapticsEnabled && navigator.vibrate) {
            navigator.vibrate([30, 30]);
        }
    }
  };

  const resetSession = () => {
    if (window.confirm("Reset current session progress?")) {
        setCount(0);
        setRounds(0);
        setSessionTotalCount(0);
        setSessionStartTime(Date.now());
        setGoalReached(false);
    }
  };

  const finishSession = () => {
    if (sessionTotalCount === 0) return;

    const now = Date.now();
    const duration = Math.floor((now - sessionStartTime) / 1000);
    
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: now,
      durationSeconds: duration,
      totalCount: sessionTotalCount,
      rounds: rounds
    };

    setHistory(prev => [newEntry, ...prev]);
    
    // Reset session
    setCount(0);
    setRounds(0);
    setSessionTotalCount(0);
    setSessionStartTime(Date.now());
    setGoalReached(false);
    
    setIsHistoryOpen(true);
  };

  const handleOpenMantraGenerator = () => {
     if (!process.env.API_KEY) {
        alert("API Key not configured for AI features.");
        return;
    }
    setIsMantraGeneratorOpen(true);
  };

  const handleGenerateMantra = async (intent: string) => {
    setLoadingMantra(true);
    setMantra(null); 
    const result = await generateMantra(intent);
    setMantra(result);
    setLoadingMantra(false);
    setShowActiveMantra(true);
  };

  const toggleMode = () => {
    const newMode = settings.countingMode === 'bead' ? 'mala' : 'bead';
    setSettings(s => ({...s, countingMode: newMode}));
  };

  const themeColors = THEMES[settings.theme];
  const t = translations[settings.language];
  const hasCustomBg = !!settings.customBackgroundImage;

  return (
    <div 
      className={`min-h-screen flex flex-col transition-all duration-700 ease-in-out overflow-hidden relative ${!hasCustomBg ? themeColors.bg : 'bg-slate-900 text-white'}`}
      style={hasCustomBg ? { backgroundImage: `url(${settings.customBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      
      {/* Background Overlay for readability if custom image is used */}
      {hasCustomBg && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />
      )}

      {/* Onboarding Overlay */}
      {showOnboarding && (
         <Onboarding 
           onComplete={completeOnboarding} 
           settings={settings}
           onUpdateSettings={setSettings}
         />
      )}

      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl ${hasCustomBg ? 'bg-white/20 backdrop-blur-md text-white' : themeColors.button} flex items-center justify-center shadow-lg ring-1 ring-white/20`}>
            <Logo className="w-8 h-8" color="currentColor" />
          </div>
          <div>
             <h1 className={`font-bold text-2xl tracking-tight leading-none ${hasCustomBg ? 'text-white' : themeColors.accent}`}>{t.appName}</h1>
             <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 ${hasCustomBg ? 'text-white' : 'text-slate-500'}`}>Meditation</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 p-1.5 rounded-full ${hasCustomBg ? 'bg-black/30 backdrop-blur-md border border-white/10' : 'bg-white/60 border border-slate-100 shadow-sm'}`}>
           <button 
            onClick={() => setIsGoalModalOpen(true)}
            className={`p-3 rounded-full transition-all active:scale-95 ${hasCustomBg ? 'hover:bg-white/20 text-white' : `hover:bg-black/5 ${themeColors.accent}`}`}
            title={t.goals}
          >
            {settings.target.enabled ? <Trophy size={22} /> : <Target size={22} />}
          </button>
           <button 
            onClick={() => setIsHistoryOpen(true)}
            className={`p-3 rounded-full transition-all active:scale-95 ${hasCustomBg ? 'hover:bg-white/20 text-white' : `hover:bg-black/5 ${themeColors.accent}`}`}
            title={t.history}
          >
            <HistoryIcon size={22} />
          </button>
          
          <div className={`w-px h-6 mx-1 ${hasCustomBg ? 'bg-white/20' : 'bg-black/10'}`}></div>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`p-3 rounded-full transition-all active:scale-95 ${hasCustomBg ? 'hover:bg-white/20 text-white' : `hover:bg-black/5 ${themeColors.accent}`}`}
            title={t.settings}
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Main Interaction Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full max-w-xl mx-auto z-10">
        
        {/* Mode Switcher Pill */}
        <div className={`absolute top-0 z-20 flex rounded-full p-1.5 shadow-lg border ${hasCustomBg ? 'bg-black/40 backdrop-blur-xl border-white/20' : 'bg-white/80 backdrop-blur-xl border-white/60'}`}>
           <button 
             onClick={() => setSettings(s => ({...s, countingMode: 'bead'}))}
             className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${settings.countingMode === 'bead' ? `${hasCustomBg ? 'bg-white text-slate-900' : themeColors.button} shadow-md` : `${hasCustomBg ? 'text-white/70 hover:bg-white/10' : 'text-slate-500 hover:bg-black/5'}`}`}
           >
             {t.beads}
           </button>
           <button 
             onClick={() => setSettings(s => ({...s, countingMode: 'mala'}))}
             className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${settings.countingMode === 'mala' ? `${hasCustomBg ? 'bg-white text-slate-900' : themeColors.button} shadow-md` : `${hasCustomBg ? 'text-white/70 hover:bg-white/10' : 'text-slate-500 hover:bg-black/5'}`}`}
           >
             {t.malas}
           </button>
        </div>

        {/* Mantra Card (Floating Display) */}
        {mantra && showActiveMantra && !isMantraGeneratorOpen && (
          <div className="absolute top-16 left-6 right-6 z-20 animate-in slide-in-from-top-4 fade-in duration-500">
             <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] shadow-2xl border border-white/40 relative ring-1 ring-white/50">
                <div className="flex justify-center mb-3">
                  <Sparkles size={20} className={`${themeColors.accent} opacity-50`} />
                </div>
                <p className="text-xl font-medium text-center text-slate-800 font-serif leading-relaxed">"{mantra.text}"</p>
                <p className="text-sm text-center text-slate-500 mt-2 italic">{mantra.pronunciation}</p>
                <button 
                  onClick={() => setShowActiveMantra(false)} 
                  className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg text-slate-400 hover:text-red-500 transition-colors"
                >
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-lg leading-none">&times;</div>
                </button>
             </div>
          </div>
        )}

        {/* Goal Reached Banner */}
        {goalReached && (
           <div className="absolute top-32 z-30 animate-in zoom-in fade-in duration-500">
              <div className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-3 border-4 border-yellow-200">
                <Trophy size={20} fill="currentColor" />
                <span>{t.goalReached}</span>
              </div>
           </div>
        )}

        {/* The Bead Ring */}
        <div 
          className="relative cursor-pointer active:scale-[0.98] transition-all duration-300 touch-manipulation tap-highlight-transparent p-4 mt-8"
          onClick={handleTap}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Container background for ring to improve contrast on custom bg */}
          {hasCustomBg && (
             <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-90" />
          )}

          <BeadRing 
            count={count} 
            rounds={rounds}
            settings={settings} 
            size={Math.min(window.innerWidth - 40, 340)} 
            isSessionActive={sessionTotalCount > 0}
            totalCount={sessionTotalCount}
          />
          
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
            <p className={`text-sm font-bold tracking-widest uppercase opacity-70 ${hasCustomBg ? 'text-white' : themeColors.accent} transition-opacity duration-500 ${sessionTotalCount > 0 ? 'opacity-40' : 'opacity-80 animate-pulse'}`}>
              {sessionTotalCount > 0 
                ? (settings.countingMode === 'bead' ? t.tapToCount : t.tapToComplete) 
                : t.appName === 'ज़ेन माला' ? 'शुरू करने के लिए टैप करें' : 'Tap to start'}
            </p>
          </div>
        </div>

      </main>

      {/* Modern Footer - Material You style */}
      <footer className="px-6 py-8 pb-10 z-10 w-full max-w-xl mx-auto">
        <div className={`backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-2xl border ring-1 ${hasCustomBg ? 'bg-black/30 border-white/10 ring-white/5 text-white' : 'bg-white/80 border-white/60 ring-white/50'}`}>
          
          {/* Stats Row */}
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex flex-col">
               <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 opacity-60 ${hasCustomBg ? 'text-white' : 'text-slate-500'}`}>{t.session}</span>
               <div className="flex items-baseline gap-1">
                 <span className={`text-3xl font-bold ${hasCustomBg ? 'text-white' : themeColors.accent}`}>{sessionTotalCount}</span>
               </div>
            </div>
            
            <div className={`h-10 w-px ${hasCustomBg ? 'bg-white/20' : 'bg-slate-200'}`}></div>

            <div className="flex flex-col items-center">
               <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 opacity-60 ${hasCustomBg ? 'text-white' : 'text-slate-500'}`}>{t.rounds}</span>
               <div className="flex items-baseline gap-1">
                 <span className={`text-3xl font-bold ${hasCustomBg ? 'text-white' : themeColors.accent}`}>{rounds}</span>
               </div>
            </div>

            <div className={`h-10 w-px ${hasCustomBg ? 'bg-white/20' : 'bg-slate-200'}`}></div>

            <div className="flex flex-col items-end">
               <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 opacity-60 ${hasCustomBg ? 'text-white' : 'text-slate-500'}`}>{t.lifetime}</span>
               <div className="flex items-baseline gap-1">
                 <span className={`text-3xl font-bold ${hasCustomBg ? 'text-white' : themeColors.accent}`}>{totalLifetime}</span>
               </div>
            </div>
          </div>

          {/* Actions Row - FAB style buttons */}
          <div className="flex gap-4">
             <button 
              onClick={handleOpenMantraGenerator}
              className={`flex-1 h-16 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${hasCustomBg ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md' : `${themeColors.buttonSecondary}`}`}
            >
              <Lightbulb size={24} />
              <span>{t.getMantra}</span>
            </button>
            
            {sessionTotalCount > 0 ? (
              <>
                <button
                    onClick={resetSession}
                    className={`w-16 h-16 shrink-0 rounded-[1.5rem] flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${hasCustomBg ? 'bg-red-500/20 text-red-200 hover:bg-red-500/30' : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'}`}
                    title={t.discardSession}
                >
                    <Trash2 size={24} />
                </button>
                <button 
                    onClick={finishSession}
                    className={`flex-[1.5] h-16 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${hasCustomBg ? 'bg-white text-slate-900' : `${themeColors.button}`}`}
                >
                    <CheckCircle2 size={24} />
                    <span>{t.saveSession}</span>
                </button>
              </>
            ) : (
               <button 
                disabled
                className={`flex-1 h-16 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm font-bold cursor-not-allowed border ${hasCustomBg ? 'bg-white/5 border-white/10 text-white/30' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
              >
                <MoreHorizontal size={24} />
                <span>{t.startChanting}</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GoalModal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)} 
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        settings={settings}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <MantraGeneratorModal
        isOpen={isMantraGeneratorOpen}
        onClose={() => setIsMantraGeneratorOpen(false)}
        onGenerate={handleGenerateMantra}
        loading={loadingMantra}
        mantra={mantra}
        settings={settings}
      />

    </div>
  );
};

export default App;