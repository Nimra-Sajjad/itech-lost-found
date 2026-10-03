import React from 'react';

interface UniversityLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  className?: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  className = '',
}) => {
  const sizeMap = {
    sm: { crest: 38, textClass: 'text-sm', subClass: 'text-[10px]' },
    md: { crest: 48, textClass: 'text-base', subClass: 'text-xs' },
    lg: { crest: 64, textClass: 'text-lg', subClass: 'text-xs' },
    xl: { crest: 84, textClass: 'text-2xl', subClass: 'text-sm' },
  };

  const { crest, textClass, subClass } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact iTECH University Crest SVG */}
      <svg
        width={crest}
        height={crest}
        viewBox="0 0 240 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105"
        aria-label="iTECH University Crest"
      >
        <defs>
          {/* Circular text paths */}
          <path
            id="leftArch"
            d="M 28 85 A 108 108 0 0 0 120 226"
            fill="none"
          />
          <path
            id="rightArch"
            d="M 120 226 A 108 108 0 0 0 212 85"
            fill="none"
          />
          {/* Shield clipping path */}
          <clipPath id="shieldClip">
            <path d="M 120 24 L 188 44 C 188 124 164 168 120 204 C 76 168 52 124 52 44 Z" />
          </clipPath>
        </defs>

        {/* Top Typography: iTECH */}
        <text
          x="120"
          y="19"
          textAnchor="middle"
          fill="#16325C"
          fontSize="22"
          fontWeight="bold"
          fontFamily="'Cinzel', Georgia, serif"
          letterSpacing="3"
        >
          iTECH
        </text>

        {/* Arched Ring Text */}
        <text fill="#16325C" fontSize="9.5" fontWeight="600" letterSpacing="0.4" fontFamily="'Inter', sans-serif">
          <textPath href="#leftArch" startOffset="50%" textAnchor="middle">
            International Institute of Technology
          </textPath>
        </text>
        <text fill="#16325C" fontSize="9.5" fontWeight="600" letterSpacing="0.4" fontFamily="'Inter', sans-serif">
          <textPath href="#rightArch" startOffset="50%" textAnchor="middle">
            Culture &amp; Health Sciences
          </textPath>
        </text>

        {/* Outer Shield Outline */}
        <path
          d="M 120 20 L 192 42 C 192 128 167 173 120 210 C 73 173 48 128 48 42 Z"
          fill="#FFFFFF"
          stroke="#16325C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Shield (Clipped into 4 Quadrants) */}
        <g clipPath="url(#shieldClip)">
          {/* Quadrant 1 (Top-Left): NAVY */}
          <rect x="40" y="20" width="80" height="92" fill="#16325C" />
          {/* Quadrant 2 (Top-Right): CRIMSON */}
          <rect x="120" y="20" width="80" height="92" fill="#A82024" />
          {/* Quadrant 3 (Bottom-Left): CRIMSON */}
          <rect x="40" y="112" width="80" height="100" fill="#A82024" />
          {/* Quadrant 4 (Bottom-Right): NAVY */}
          <rect x="120" y="112" width="80" height="100" fill="#16325C" />

          {/* Central Quadrant Divider Cross */}
          <line x1="120" y1="20" x2="120" y2="210" stroke="#FFFFFF" strokeWidth="3" />
          <line x1="48" y1="112" x2="192" y2="112" stroke="#FFFFFF" strokeWidth="3" />

          {/* --- Quadrant 1 Icon: Fountain Pen Nib & Academic Mortarboard (Education & Academics) --- */}
          <g transform="translate(73, 50)" fill="#FFFFFF">
            {/* Mortarboard hat on top */}
            <polygon points="13,0 26,4.5 13,9 0,4.5" />
            <polygon points="10,8 10,13 16,13 16,8" />
            <line x1="22" y1="5.5" x2="24" y2="14" stroke="#FFFFFF" strokeWidth="1" />
            {/* Pen nib */}
            <path d="M 5 14 L 21 14 L 17 32 L 13 40 L 9 32 Z" />
            <circle cx="13" cy="27" r="1.6" fill="#16325C" />
            <line x1="13" y1="27" x2="13" y2="40" stroke="#16325C" strokeWidth="1.2" />
          </g>

          {/* --- Quadrant 2 Icon: Laptop with Gear & Analytics (Applied Technology) --- */}
          <g transform="translate(136, 52)" fill="#FFFFFF">
            {/* Laptop screen */}
            <rect x="4" y="5" width="32" height="21" rx="1.5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            {/* Base */}
            <path d="M 1 27 L 39 27 L 35 30 L 5 30 Z" fill="#FFFFFF" />
            {/* Gear on screen */}
            <circle cx="20" cy="11" r="2.5" fill="#FFFFFF" />
            <circle cx="20" cy="11" r="1.2" fill="#A82024" />
            {/* Mini bar chart on screen */}
            <rect x="11" y="18" width="3" height="5" rx="0.5" fill="#FFFFFF" />
            <rect x="16" y="15" width="3" height="8" rx="0.5" fill="#FFFFFF" />
            <rect x="21" y="17" width="3" height="6" rx="0.5" fill="#FFFFFF" />
            <rect x="26" y="14" width="3" height="9" rx="0.5" fill="#FFFFFF" />
          </g>

          {/* --- Quadrant 3 Icon: Circle of United People (Culture & Society) --- */}
          <g transform="translate(71, 130)" fill="#FFFFFF">
            {/* Central hub */}
            <circle cx="15" cy="15" r="3.2" fill="#FFFFFF" />
            {/* 6 radial stylized heads and joining arms */}
            <circle cx="15" cy="4" r="2.2" />
            <circle cx="24.5" cy="9.5" r="2.2" />
            <circle cx="24.5" cy="20.5" r="2.2" />
            <circle cx="15" cy="26" r="2.2" />
            <circle cx="5.5" cy="20.5" r="2.2" />
            <circle cx="5.5" cy="9.5" r="2.2" />
            {/* Connecting arcs/arms */}
            <path d="M 12 7 C 15 10 15 10 18 7" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 21 12 C 18 15 18 15 21 18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 18 23 C 15 20 15 20 12 23" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 9 18 C 12 15 12 15 9 12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>

          {/* --- Quadrant 4 Icon: Medical Cross & Human Figure (Health Sciences) --- */}
          <g transform="translate(138, 130)" fill="#FFFFFF">
            {/* Medical cross outline/fill behind figure */}
            <path
              d="M 10 3 H 24 V 11 H 32 V 22 H 24 V 30 H 10 V 22 H 2 V 11 H 10 Z"
              fill="#FFFFFF"
              opacity="0.95"
            />
            {/* Human anatomy figure in center */}
            <circle cx="17" cy="7.5" r="2" fill="#16325C" />
            {/* Body */}
            <path
              d="M 15 11 C 15 10.5 19 10.5 19 11 L 20 18 L 18.5 18 L 18 27 L 16 27 L 15.5 18 L 14 18 Z"
              fill="#16325C"
            />
          </g>
        </g>
      </svg>

      {/* University & Portal Name Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-brand-title font-bold tracking-tight ${
                textColor === 'light' ? 'text-white' : 'text-[#16325C]'
              } ${textClass}`}
            >
              iTECH
            </span>
            <span
              className={`font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded text-[10px] ${
                textColor === 'light'
                  ? 'bg-red-900/60 text-red-200 border border-red-500/30'
                  : 'bg-red-50 text-[#A82024] border border-red-200'
              }`}
            >
              Lost &amp; Found
            </span>
          </div>
          <span
            className={`font-medium tracking-tight mt-1 line-clamp-1 ${
              textColor === 'light' ? 'text-slate-300' : 'text-slate-500'
            } ${subClass}`}
          >
            International Institute of Tech, Culture &amp; Health Sciences
          </span>
        </div>
      )}
    </div>
  );
};
