import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Petals */}
      <path d="M50 5 C60 25 85 35 90 50 C85 65 60 75 50 95 C40 75 15 65 10 50 C15 35 40 25 50 5Z" fill={color} fillOpacity="0.2" />
      <path d="M95 50 C75 60 65 85 50 90 C35 85 25 60 5 50 C25 40 35 15 50 10 C65 15 75 40 95 50Z" fill={color} fillOpacity="0.2" transform="rotate(45 50 50)" />
      
      {/* Inner Bead Ring */}
      <circle cx="50" cy="50" r="25" stroke={color} strokeWidth="3" fill="none" />
      
      {/* Beads */}
      <circle cx="50" cy="25" r="3" fill={color} />
      <circle cx="75" cy="50" r="3" fill={color} />
      <circle cx="50" cy="75" r="3" fill={color} />
      <circle cx="25" cy="50" r="3" fill={color} />
      
      <circle cx="67.7" cy="32.3" r="3" fill={color} />
      <circle cx="67.7" cy="67.7" r="3" fill={color} />
      <circle cx="32.3" cy="67.7" r="3" fill={color} />
      <circle cx="32.3" cy="32.3" r="3" fill={color} />

      {/* Center Om / Zen symbol abstract */}
      <path d="M45 45 C45 40 55 40 55 45 C55 50 45 50 45 55 C45 60 55 60 55 55" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;