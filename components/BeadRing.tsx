import React, { useMemo } from 'react';
import { THEMES, AppSettings } from '../types';
import { translations } from '../utils/translations';

interface BeadRingProps {
  count: number; 
  rounds: number;
  settings: AppSettings;
  size?: number;
  isSessionActive?: boolean;
  totalCount?: number;
}

const BeadRing: React.FC<BeadRingProps> = ({ count, rounds, settings, size = 320, isSessionActive = false, totalCount = 0 }) => {
  const isMalaMode = settings.countingMode === 'mala';
  const t = translations[settings.language];
  const BEAD_COUNT = settings.beadCount || 108;
  const VISUAL_CAPACITY = isMalaMode ? 108 : BEAD_COUNT; 
  
  const currentProgress = isMalaMode ? (rounds % VISUAL_CAPACITY) : count;

  const RADIUS = 140;
  
  // Adjust bead size
  const BASE_BEAD_RADIUS = VISUAL_CAPACITY === 27 ? 12 : VISUAL_CAPACITY === 54 ? 8 : 5;
  const GURU_BEAD_RADIUS = BASE_BEAD_RADIUS * 2.2;
  const CENTER_X = size / 2;
  const CENTER_Y = size / 2;

  const themeColors = THEMES[settings.theme];
  const isRudraksha = settings.theme === 'rudraksha';

  // Calculate bead positions
  const beads = useMemo(() => {
    return Array.from({ length: VISUAL_CAPACITY }).map((_, index) => {
      // Start from top (-90 degrees) and go clockwise
      const angleDeg = (index * (360 / VISUAL_CAPACITY)) - 90 + (360 / VISUAL_CAPACITY);
      const angleRad = (angleDeg * Math.PI) / 180;
      
      return {
        cx: CENTER_X + RADIUS * Math.cos(angleRad),
        cy: CENTER_Y + RADIUS * Math.sin(angleRad),
        index
      };
    });
  }, [CENTER_X, CENTER_Y, VISUAL_CAPACITY]);

  // Guru bead position (Top Center)
  const guruBead = {
    cx: CENTER_X,
    cy: CENTER_Y - RADIUS - (BASE_BEAD_RADIUS * 2), // Slightly offset outwards
  };

  // Target Progress Calculation
  const target = settings.target;
  let targetProgress = 0;
  if (target.enabled && target.value > 0) {
     const current = target.mode === 'round' ? rounds : totalCount;
     targetProgress = Math.min(Math.max(current / target.value, 0), 1);
  }

  const PROGRESS_RADIUS = 75;
  const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;
  const progressDashOffset = PROGRESS_CIRCUMFERENCE - (targetProgress * PROGRESS_CIRCUMFERENCE);

  return (
    <div className="relative flex items-center justify-center select-none pointer-events-none">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className={`overflow-visible transition-opacity duration-1000 ${isSessionActive ? 'animate-pulse-gentle' : ''}`}
      >
        <defs>
            {isRudraksha && (
               <filter id="rudraksha-texture" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="noise" result="coloredNoise" />
                  <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                  <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
               </filter>
            )}
        </defs>

        {/* String connecting beads */}
        <circle 
          cx={CENTER_X} 
          cy={CENTER_Y} 
          r={RADIUS} 
          fill="none" 
          stroke={themeColors.bead} 
          strokeOpacity={0.5} 
          strokeWidth={1.5} 
        />

        {/* Target Progress Ring */}
        {target.enabled && (
             <g className={`${themeColors.accent} transition-colors duration-300`}>
                {/* Background Track */}
                <circle 
                   cx={CENTER_X} 
                   cy={CENTER_Y} 
                   r={PROGRESS_RADIUS} 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="1.5" 
                   opacity="0.1" 
                />
                {/* Progress Indicator */}
                <circle 
                   cx={CENTER_X} 
                   cy={CENTER_Y} 
                   r={PROGRESS_RADIUS} 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="3" 
                   strokeDasharray={PROGRESS_CIRCUMFERENCE}
                   strokeDashoffset={progressDashOffset}
                   strokeLinecap="round"
                   transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
                   className="transition-all duration-700 ease-out"
                />
             </g>
        )}

        {/* Regular Beads */}
        {beads.map((bead) => {
          const isCompleted = bead.index < currentProgress;
          const isActive = bead.index === currentProgress - 1;
          
          return (
            <circle
              key={bead.index}
              cx={bead.cx}
              cy={bead.cy}
              r={isActive ? BASE_BEAD_RADIUS * 1.5 : BASE_BEAD_RADIUS}
              fill={isCompleted ? themeColors.beadActive : themeColors.bead}
              opacity={isCompleted ? 1 : 0.4}
              filter={isRudraksha ? "url(#rudraksha-texture)" : undefined}
              className={`transition-all duration-300 origin-center pointer-events-auto cursor-pointer hover:scale-125 hover:opacity-100 hover:drop-shadow-md ${isActive ? 'bead-shadow' : ''} ${isCompleted ? 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]' : ''}`}
            />
          );
        })}

        {/* Guru Bead (Tassel) */}
        <circle
          cx={guruBead.cx}
          cy={guruBead.cy}
          r={GURU_BEAD_RADIUS}
          fill={themeColors.beadActive}
          filter={isRudraksha ? "url(#rudraksha-texture)" : undefined}
          className="bead-shadow pointer-events-auto cursor-pointer hover:scale-110 transition-transform origin-center duration-300"
        />
        {/* Tassel decoration */}
        <path
          d={`M${guruBead.cx},${guruBead.cy + GURU_BEAD_RADIUS} L${guruBead.cx - (BASE_BEAD_RADIUS * 1.2)},${guruBead.cy + GURU_BEAD_RADIUS + 20} L${guruBead.cx + (BASE_BEAD_RADIUS * 1.2)},${guruBead.cy + GURU_BEAD_RADIUS + 20} Z`}
          fill={themeColors.beadActive}
          className="pointer-events-auto"
        />
      </svg>
      
      {/* Center Counter Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-6xl font-light ${themeColors.accent} drop-shadow-sm transition-all duration-300`}>
          {isMalaMode ? rounds : count}
        </span>
        <span className={`text-sm opacity-60 uppercase tracking-widest ${themeColors.accent} font-semibold mt-1`}>
          {isMalaMode ? t.rounds : t.beads}
        </span>
        
        {settings.target.enabled && (
           <div className={`mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 ${themeColors.accent}`}>
              Target: {settings.target.value} {settings.target.mode === 'round' ? 'M' : 'B'}
           </div>
        )}
      </div>
    </div>
  );
};

export default BeadRing;