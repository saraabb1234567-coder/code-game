import React from 'react';

interface OrnamentProps {
  className?: string;
  size?: number;
  color?: 'cyan' | 'gold' | 'crimson' | 'emerald' | 'purple' | 'white';
}

const colorMap = {
  cyan: {
    stroke: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.45)',
    fill: 'rgba(34, 211, 238, 0.12)',
  },
  gold: {
    stroke: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.45)',
    fill: 'rgba(251, 191, 36, 0.12)',
  },
  crimson: {
    stroke: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.45)',
    fill: 'rgba(244, 63, 94, 0.12)',
  },
  emerald: {
    stroke: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    fill: 'rgba(16, 185, 129, 0.12)',
  },
  purple: {
    stroke: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.45)',
    fill: 'rgba(192, 132, 252, 0.12)',
  },
  white: {
    stroke: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.3)',
    fill: 'rgba(255, 255, 255, 0.08)',
  },
};

/**
 * Өлзий хээ (Ulzii Khee - Mongolian Eternal Knot)
 * Symbol of endless knowledge, happiness, and prosperity.
 */
export const UlziiKhee: React.FC<OrnamentProps> = ({
  className = '',
  size = 28,
  color = 'cyan',
}) => {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`inline-block select-none ${className}`}
      style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central interwoven geometric paths */}
      <path
        d="M 50 12 L 68 30 L 68 44 L 56 44 L 56 56 L 68 56 L 68 70 L 50 88 L 32 70 L 32 56 L 44 56 L 44 44 L 32 44 L 32 30 Z"
        stroke={c.stroke}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={c.fill}
      />
      {/* Inner loop ribbons */}
      <path
        d="M 50 24 L 60 34 L 50 44 L 40 34 Z"
        stroke={c.stroke}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 50 56 L 60 66 L 50 76 L 40 66 Z"
        stroke={c.stroke}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 22 50 L 32 40 L 42 50 L 32 60 Z"
        stroke={c.stroke}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 78 50 L 68 40 L 58 50 L 68 60 Z"
        stroke={c.stroke}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Central diamond */}
      <rect
        x="45"
        y="45"
        width="10"
        height="10"
        transform="rotate(45 50 50)"
        fill={c.stroke}
      />
    </svg>
  );
};

/**
 * Алхан хээ (Alkhan Khee - Meander / Key pattern border strip)
 */
export const AlkhanKheeBorder: React.FC<{
  className?: string;
  color?: 'cyan' | 'gold' | 'crimson';
  height?: number;
}> = ({ className = '', color = 'cyan', height = 12 }) => {
  const c = colorMap[color];
  return (
    <div
      className={`w-full overflow-hidden select-none pointer-events-none ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        width="100%"
        height={height}
        viewBox="0 0 400 20"
        preserveAspectRatio="repeat-x"
        fill="none"
      >
        <pattern
          id={`alkhan-pat-${color}`}
          x="0"
          y="0"
          width="40"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 10 H 12 V 4 H 26 V 16 H 18 V 10 H 22 M 26 4 H 36 V 16 H 40"
            stroke={c.stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </pattern>
        <rect width="100%" height="20" fill={`url(#alkhan-pat-${color})`} />
      </svg>
    </div>
  );
};

/**
 * Монгол гэрийн тооно (Toono Ring - 12 Uni Celestial Radiance)
 * Represents the 12 cosmic zodiacs of the sky dome.
 */
export const ToonoRing: React.FC<{
  size?: number;
  className?: string;
  spinning?: boolean;
  color?: 'cyan' | 'gold' | 'crimson';
}> = ({ size = 64, className = '', spinning = false, color = 'cyan' }) => {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`inline-block select-none ${spinning ? 'animate-spin' : ''} ${className}`}
      style={{
        filter: `drop-shadow(0 0 8px ${c.glow})`,
        animationDuration: spinning ? '25s' : '0s',
      }}
      fill="none"
    >
      {/* Outer Toono Circular Rim */}
      <circle cx="50" cy="50" r="44" stroke={c.stroke} strokeWidth="3.5" />
      <circle cx="50" cy="50" r="38" stroke={c.stroke} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      <circle cx="50" cy="50" r="16" stroke={c.stroke} strokeWidth="3" fill={c.fill} />
      <circle cx="50" cy="50" r="6" fill={c.stroke} />

      {/* 12 Radiating Uni Spokes corresponding to the 12 Zodiac animals */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={50 + 38 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
          stroke={c.stroke}
          strokeWidth={i % 3 === 0 ? '2.5' : '1.5'}
          strokeLinecap="round"
        />
      ))}

      {/* Crossbeams inside inner center */}
      <line x1="34" y1="50" x2="66" y2="50" stroke={c.stroke} strokeWidth="2.5" />
      <line x1="50" y1="34" x2="50" y2="66" stroke={c.stroke} strokeWidth="2.5" />
    </svg>
  );
};

/**
 * Морин хуур Cyber Badge (Futuristic Horsehead Fiddle Motif)
 */
export const MorinKhuurBadge: React.FC<{
  size?: number;
  className?: string;
  color?: 'cyan' | 'gold' | 'crimson';
}> = ({ size = 24, className = '', color = 'cyan' }) => {
  const c = colorMap[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`inline-block select-none ${className}`}
      style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
      fill="none"
    >
      {/* Trapezoidal Sound Box */}
      <polygon
        points="22,34 42,34 46,58 18,58"
        stroke={c.stroke}
        strokeWidth="2.5"
        fill={c.fill}
      />
      {/* Neck */}
      <line x1="32" y1="14" x2="32" y2="58" stroke={c.stroke} strokeWidth="3" />
      {/* 2 Strings */}
      <line x1="30" y1="16" x2="30" y2="56" stroke={c.stroke} strokeWidth="1" opacity="0.8" />
      <line x1="34" y1="16" x2="34" y2="56" stroke={c.stroke} strokeWidth="1" opacity="0.8" />
      {/* Pegs */}
      <line x1="24" y1="18" x2="40" y2="18" stroke={c.stroke} strokeWidth="2.5" />
      {/* Stylized Cyber Horsehead Crown */}
      <path
        d="M 32 14 C 30 11, 26 10, 24 6 C 28 6, 32 7, 36 9 C 38 7, 40 5, 41 7 C 39 10, 36 12, 32 14 Z"
        fill={c.stroke}
      />
    </svg>
  );
};
