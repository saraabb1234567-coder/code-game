import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZodiacAnimalId, MascotAnimationState } from '../types';
import { sound } from '../lib/sound';
import { UlziiKhee, ToonoRing } from './MongolianOrnaments';
import { Sparkles, Star, Zap, Moon, Box } from 'lucide-react';
import { ThreeZodiacCanvas } from './three/ThreeZodiacCanvas';

export interface MongolianZodiacMascotProps {
  zodiacId: ZodiacAnimalId;
  name?: string;
  mood?: MascotAnimationState;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  interactive?: boolean;
  showAura?: boolean;
  showOrnaments?: boolean;
  enable3DRotation?: boolean;
  render3D?: boolean;
  allow3DToggle?: boolean;
  onClick?: () => void;
}

interface ZodiacMeta {
  name: string;
  yearName: string;
  element: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  accentDeelColor: string;
  beltColor: string;
  quote: string;
}

export const ZODIAC_METAS: Record<ZodiacAnimalId, ZodiacMeta> = {
  khulgana: {
    name: 'Овсгоотой Хулгана',
    yearName: 'Хулгана жил',
    element: 'Ус',
    primaryColor: '#94a3b8',
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    accentDeelColor: '#0284c7',
    beltColor: '#fbbf24',
    quote: 'Овсгоотой, хурдан, сэргэлэн байж шинэ кодоо эхлүүлцгээе!',
  },
  ukher: {
    name: 'Хүчит Үхэр',
    yearName: 'Үхэр жил',
    element: 'Шороо',
    primaryColor: '#78716c',
    secondaryColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.45)',
    accentDeelColor: '#0d9488',
    beltColor: '#fbbf24',
    quote: 'Тэвчээр, тайван чанар бол алдаагүй програмистын нууц хүч.',
  },
  bar: {
    name: 'Зоригт Бар',
    yearName: 'Бар жил',
    element: 'Мод',
    primaryColor: '#f97316',
    secondaryColor: '#fbbf24',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    accentDeelColor: '#ea580c',
    beltColor: '#38bdf8',
    quote: 'Эрч хүч, зоригтойгоор ямар ч хэцүү алгоритмыг даван туулна!',
  },
  tuulai: {
    name: 'Сэргэлэн Туулай',
    yearName: 'Туулай жил',
    element: 'Мод',
    primaryColor: '#e2e8f0',
    secondaryColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    accentDeelColor: '#9333ea',
    beltColor: '#34d399',
    quote: 'Хурдан, сэргэлэн, өхөөрдөм байж кодын алдааг хормын төдийд засна.',
  },
  luu: {
    name: 'Сүрлэг Луу',
    yearName: 'Луу жил',
    element: 'Шороо',
    primaryColor: '#06b6d4',
    secondaryColor: '#fbbf24',
    glowColor: 'rgba(6, 182, 212, 0.55)',
    accentDeelColor: '#0891b2',
    beltColor: '#ef4444',
    quote: 'Сүрлэг, ид шидтэй, хүчирхэг оюун ухаан бүхнийг ялна.',
  },
  mogoi: {
    name: 'Цэцэн Могой',
    yearName: 'Могой жил',
    element: 'Гал',
    primaryColor: '#10b981',
    secondaryColor: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    accentDeelColor: '#047857',
    beltColor: '#fbbf24',
    quote: 'Ухаалаг, нууцлаг, гүн бодол логикийг төгс болгодог.',
  },
  mori: {
    name: 'Хийморьт Хүлэг',
    yearName: 'Морь жил',
    element: 'Гал',
    primaryColor: '#dc2626',
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    accentDeelColor: '#b91c1c',
    beltColor: '#fbbf24',
    quote: 'Хурдтай, эрх чөлөөтэй салхи мэт кодоо харван давхицгаая!',
  },
  khoni: {
    name: 'Дөлгөөн Хонь',
    yearName: 'Хонь жил',
    element: 'Шороо',
    primaryColor: '#f1f5f9',
    secondaryColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    accentDeelColor: '#d97706',
    beltColor: '#38bdf8',
    quote: 'Дөлгөөн, нөхөрсөг, тусархуу сэтгэл багийн амжилтын тулгуур.',
  },
  bich: {
    name: 'Авхаалжит Бич',
    yearName: 'Бич жил',
    element: 'Төмөр',
    primaryColor: '#f59e0b',
    secondaryColor: '#22d3ee',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    accentDeelColor: '#b45309',
    beltColor: '#ef4444',
    quote: 'Хөгжилтэй, авхаалжтай арга барилаар хамгийн сонирхолтой шийдэл гарна.',
  },
  takhia: {
    name: 'Сэргэлэн Тахиа',
    yearName: 'Тахиа жил',
    element: 'Төмөр',
    primaryColor: '#ef4444',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    accentDeelColor: '#dc2626',
    beltColor: '#38bdf8',
    quote: 'Өглөөний наран шиг сэргэлэн, идэвхтэйгээр өнөөдрийн хичээлээ дуусгая!',
  },
  nokhoi: {
    name: 'Үнэнч Банхар',
    yearName: 'Нохой жил',
    element: 'Шороо',
    primaryColor: '#334155',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    accentDeelColor: '#1e293b',
    beltColor: '#38bdf8',
    quote: 'Үнэнч, хамгаалагч Банхар найз чинь кодын бүх алдаанаас сэргийлнэ.',
  },
  gakhai: {
    name: 'Өгөөмөр Гахай',
    yearName: 'Гахай жил',
    element: 'Ус',
    primaryColor: '#f472b6',
    secondaryColor: '#fbbf24',
    glowColor: 'rgba(244, 114, 182, 0.5)',
    accentDeelColor: '#db2777',
    beltColor: '#38bdf8',
    quote: 'Өгөөмөр, хөгжилтэй найрсаг байдал их оноо, туршлагыг дуудна!',
  },
};

export const MongolianZodiacMascot: React.FC<MongolianZodiacMascotProps> = ({
  zodiacId,
  mood = 'idle',
  size = 'md',
  className = '',
  interactive = true,
  showAura = true,
  showOrnaments = true,
  enable3DRotation = false,
  render3D,
  allow3DToggle = true,
  onClick,
}) => {
  const [internalMood, setInternalMood] = useState<MascotAnimationState>(mood);
  const [burstKey, setBurstKey] = useState(0);
  const [dragRotateY, setDragRotateY] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [is3DMode, setIs3DMode] = useState<boolean>(() => {
    if (render3D !== undefined) return render3D;
    return enable3DRotation && (size === 'lg' || size === 'xl' || size === '2xl');
  });

  useEffect(() => {
    if (render3D !== undefined) {
      setIs3DMode(render3D);
    }
  }, [render3D]);

  const meta = ZODIAC_METAS[zodiacId] || ZODIAC_METAS.khulgana;

  useEffect(() => {
    setInternalMood(mood);
  }, [mood]);

  // Periodic eye-blink animation for genuine alive feeling
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const sizeDimensions = {
    sm: { w: 68, h: 68, ring: 76 },
    md: { w: 112, h: 112, ring: 124 },
    lg: { w: 168, h: 168, ring: 184 },
    xl: { w: 220, h: 220, ring: 240 },
    '2xl': { w: 290, h: 290, ring: 310 },
  }[size];

  // Motion variants for authentic alive states
  const variants = {
    idle: {
      y: [0, -6, 0],
      rotate: [-1, 1, -1],
      scale: [1, 1.02, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    hover: {
      y: -10,
      scale: 1.08,
      rotate: 2,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
    click: {
      y: [0, -26, 0, -10, 0],
      rotate: [0, -8, 8, 0],
      scale: [1, 1.18, 0.94, 1.05, 1],
      transition: {
        duration: 0.65,
        ease: 'easeOut' as const,
      },
    },
    victory: {
      y: [0, -22, 0, -16, 0],
      rotate: [-4, 6, -4, 6, 0],
      scale: [1, 1.15, 0.98, 1.1, 1],
      transition: {
        duration: 1.2,
        repeat: 3,
        ease: 'easeInOut' as const,
      },
    },
    happy: {
      y: [0, -18, 0, -10, 0],
      rotate: [-3, 3, -3, 0],
      scale: [1, 1.12, 0.96, 1.04, 1],
      transition: {
        duration: 0.9,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    dance: {
      x: [-6, 6, -6, 6, 0],
      y: [0, -12, 0, -12, 0],
      rotate: [-7, 7, -7, 7, 0],
      scale: [1, 1.06, 0.96, 1.06, 1],
      transition: {
        duration: 0.85,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    level_up: {
      y: [0, -32, -18, -25, 0],
      scale: [1, 1.25, 1.1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 1.4,
        ease: 'easeInOut' as const,
      },
    },
    sleep: {
      y: [0, 4, 0],
      rotate: [-1, 1, -1],
      scale: [0.97, 0.95, 0.97],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    walk_run: {
      x: [-4, 4, -4],
      y: [0, -10, 0, -10, 0],
      rotate: [-3, 3, -3],
      scale: [1, 1.04, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    },
    walk: {
      x: [-3, 3, -3],
      y: [0, -6, 0, -6, 0],
      rotate: [-2, 2, -2],
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.7,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    },
    run: {
      x: [-6, 6, -6],
      y: [0, -14, 0, -14, 0],
      rotate: [-4, 4, -4],
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.38,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    },
    jump: {
      y: [0, -32, 0],
      scale: [1, 1.15, 0.95, 1],
      transition: {
        duration: 0.65,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    attack: {
      x: [0, 24, 0],
      rotate: [0, 12, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.45,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    defeat: {
      y: [0, 8, 0],
      rotate: [-3, 0, -3],
      scale: [0.93, 0.9, 0.93],
      transition: {
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    sad: {
      y: [0, 5, 0],
      rotate: [-2, 0, -2],
      scale: [0.95, 0.93, 0.95],
      transition: {
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const handleClick = () => {
    if (!interactive) return;
    sound.playLaserShot();
    sound.playKeyTick(1.3);
    setBurstKey((prev) => prev + 1);
    setInternalMood('click');
    setTimeout(() => {
      setInternalMood(mood);
    }, 700);
    onClick?.();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: sizeDimensions.w,
        height: sizeDimensions.h,
      }}
    >
      {/* Dynamic Mongolian Cyber Aura */}
      {showAura && (
        <div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none transform scale-110 transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${meta.glowColor} 0%, rgba(7,11,25,0) 70%)`,
            opacity: internalMood === 'level_up' || internalMood === 'victory' ? 0.9 : 0.6,
          }}
        />
      )}

      {/* Rotating Celestial Toono Halo for Level-Up or Victory */}
      {showOrnaments && (internalMood === 'level_up' || internalMood === 'victory') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <ToonoRing
            size={sizeDimensions.ring}
            spinning
            color={zodiacId === 'luu' || zodiacId === 'bar' ? 'gold' : 'cyan'}
          />
        </div>
      )}

      {/* Floating Sparkles / Runes / Zzz */}
      <AnimatePresence>
        {internalMood === 'sleep' && (
          <motion.div
            key="sleep-zzz"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -30, x: [0, 10, 18] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="absolute -top-6 right-2 text-cyan-300 font-bold text-xs flex items-center gap-1 pointer-events-none z-30"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
            <span>zZz...</span>
          </motion.div>
        )}

        {(internalMood === 'victory' || internalMood === 'happy' || internalMood === 'click') && (
          <motion.div
            key={`burst-${burstKey}`}
            initial={{ opacity: 1, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.6, y: -40 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute -top-7 flex items-center gap-2 pointer-events-none z-30"
          >
            <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin" />
            <UlziiKhee size={18} color="gold" />
            <Sparkles className="w-5 h-5 text-cyan-300 fill-cyan-300" />
          </motion.div>
        )}

        {internalMood === 'level_up' && (
          <motion.div
            key="levelup-burst"
            initial={{ opacity: 1, scale: 0.4 }}
            animate={{ opacity: 0, scale: 2.2, y: -50 }}
            transition={{ duration: 1.3 }}
            className="absolute -top-10 flex items-center gap-3 pointer-events-none z-30"
          >
            <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400 animate-bounce" />
            <span className="text-xs font-black text-amber-300 tracking-wider font-mono">
              LEVEL UP!
            </span>
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Mascot Character Rendered with WebGL or Layered Vector Art */}
      {is3DMode ? (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <ThreeZodiacCanvas
            zodiacId={zodiacId}
            animationState={internalMood}
            size={
              size === '2xl' || size === 'xl'
                ? 'hero'
                : size === 'lg'
                ? 'lg'
                : size === 'md'
                ? 'md'
                : 'sm'
            }
            autoRotate={enable3DRotation}
            interactive={interactive}
            showAura={showAura}
          />
          {allow3DToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playKeyTick();
                setIs3DMode(false);
              }}
              className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-slate-900/95 border border-cyan-400/60 text-[10px] font-mono text-cyan-300 hover:text-white cursor-pointer shadow-lg flex items-center gap-1 z-20 backdrop-blur-md"
              title="2D горимд шилжих"
            >
              <Box className="w-2.5 h-2.5 text-cyan-400 animate-spin" />
              <span>3D WebGL</span>
            </button>
          )}
        </div>
      ) : (
        <motion.div
          animate={variants[internalMood] || variants.idle}
          whileHover={interactive ? variants.hover : undefined}
          style={{
            rotateY: enable3DRotation ? dragRotateY : 0,
            transformStyle: 'preserve-3d',
          }}
          drag={enable3DRotation ? 'x' : false}
          dragConstraints={{ left: -120, right: 120 }}
          onDrag={(_, info) => {
            if (enable3DRotation) {
              setDragRotateY((prev) => Math.max(-65, Math.min(65, prev + info.delta.x * 0.45)));
            }
          }}
          onClick={handleClick}
          className={`relative z-10 ${interactive ? 'cursor-pointer' : ''} flex items-center justify-center`}
          title={`${meta.name} (${meta.yearName})`}
        >
        <svg
          width={sizeDimensions.w}
          height={sizeDimensions.h}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* 3D Sphere Shading for Body */}
            <radialGradient id={`body-grad-${zodiacId}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="35%" stopColor={meta.primaryColor} />
              <stop offset="90%" stopColor="#0a1228" />
            </radialGradient>

            {/* Deel Fabric Gradient */}
            <linearGradient id={`deel-grad-${zodiacId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.accentDeelColor} />
              <stop offset="100%" stopColor="#070c1a" />
            </linearGradient>

            {/* Gold Metal Collar & Buckle Gradient */}
            <linearGradient id={`gold-metal-${zodiacId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>

            {/* Eye Pupil Radial Gradient */}
            <radialGradient id={`eye-grad-${zodiacId}`} cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor={meta.secondaryColor} />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
          </defs>

          {/* 1. SHADOW UNDER MASCOT */}
          <ellipse cx="100" cy="182" rx="48" ry="12" fill="rgba(0,0,0,0.4)" />

          {/* 2. BODY & MONGOLIAN CYBER DEEL */}
          {/* Mongolian Deel Robe */}
          <path
            d="M 64 120 C 58 140, 52 170, 52 176 C 75 178, 125 178, 148 176 C 148 170, 142 140, 136 120 Z"
            fill={`url(#deel-grad-${zodiacId})`}
            stroke="#0f172a"
            strokeWidth="3"
          />

          {/* Golden Crossed Deel Collar (Монгол дээлийн захны эмжээр) */}
          <path
            d="M 80 120 Q 94 135 116 135 L 126 142 Q 100 148 76 135 Z"
            fill={`url(#gold-metal-${zodiacId})`}
          />

          {/* Embroidered Mongolian Belt with Silver/Gold Knot Buckle (Мөнгөн бүс, Өлзий товруу) */}
          <rect x="62" y="146" width="76" height="12" rx="4" fill={meta.beltColor} />
          <circle cx="100" cy="152" r="7" fill={`url(#gold-metal-${zodiacId})`} stroke="#0f172a" strokeWidth="2" />
          <rect x="98" y="150" width="4" height="4" fill="#0284c7" />

          {/* Traditional Mongolian Curved Boots (Монгол гутал) */}
          <path d="M 68 174 L 64 186 Q 74 188 84 184 L 82 174 Z" fill="#0f172a" />
          <path d="M 118 174 L 116 184 Q 126 188 136 186 L 132 174 Z" fill="#0f172a" />
          <path d="M 64 186 Q 60 183 62 181" stroke={meta.beltColor} strokeWidth="2" fill="none" />
          <path d="M 136 186 Q 140 183 138 181" stroke={meta.beltColor} strokeWidth="2" fill="none" />

          {/* 3. ANIMAL-SPECIFIC DISTINCTIVE HEAD, EARS & HORNS */}
          {/* Specific Animal Features: */}
          {zodiacId === 'khulgana' && (
            // Big round cyber mouse ears
            <g>
              <circle cx="52" cy="56" r="28" fill={meta.primaryColor} stroke="#0f172a" strokeWidth="3" />
              <circle cx="52" cy="56" r="18" fill="#f472b6" opacity="0.6" />
              <circle cx="148" cy="56" r="28" fill={meta.primaryColor} stroke="#0f172a" strokeWidth="3" />
              <circle cx="148" cy="56" r="18" fill="#f472b6" opacity="0.6" />
              {/* Whiskers */}
              <line x1="72" y1="102" x2="42" y2="98" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <line x1="72" y1="106" x2="40" y2="108" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <line x1="128" y1="102" x2="158" y2="98" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <line x1="128" y1="106" x2="160" y2="108" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {zodiacId === 'ukher' && (
            // Curved Metallic Steppe Ox Horns
            <g>
              <path
                d="M 58 66 C 36 60, 20 40, 26 22 C 34 32, 48 50, 68 54 Z"
                fill={`url(#gold-metal-${zodiacId})`}
                stroke="#0f172a"
                strokeWidth="2.5"
              />
              <path
                d="M 142 66 C 164 60, 180 40, 174 22 C 166 32, 152 50, 132 54 Z"
                fill={`url(#gold-metal-${zodiacId})`}
                stroke="#0f172a"
                strokeWidth="2.5"
              />
              {/* Steppe Ox cyber nose ring */}
              <circle cx="100" cy="116" r="9" fill="none" stroke="#fbbf24" strokeWidth="3" />
            </g>
          )}

          {zodiacId === 'bar' && (
            // Golden Tiger round ears & glowing neon stripes
            <g>
              <circle cx="58" cy="52" r="20" fill="#ea580c" stroke="#0f172a" strokeWidth="3" />
              <circle cx="58" cy="52" r="11" fill="#fde047" />
              <circle cx="142" cy="52" r="20" fill="#ea580c" stroke="#0f172a" strokeWidth="3" />
              <circle cx="142" cy="52" r="11" fill="#fde047" />
              {/* Glowing Forehead Tiger Rune (Хаан тамга) */}
              <path d="M 94 48 H 106 M 100 48 V 64 M 92 64 H 108" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              {/* Cyber tiger cheeks stripes */}
              <path d="M 56 86 L 68 90 L 58 96" stroke="#0f172a" strokeWidth="3" fill="none" />
              <path d="M 144 86 L 132 90 L 142 96" stroke="#0f172a" strokeWidth="3" fill="none" />
            </g>
          )}

          {zodiacId === 'tuulai' && (
            // Long Moon Rabbit Ears
            <g>
              <path
                d="M 68 62 C 60 20, 52 0, 66 0 C 80 0, 84 25, 78 62 Z"
                fill={meta.primaryColor}
                stroke="#0f172a"
                strokeWidth="3"
              />
              <path d="M 68 50 C 64 26, 60 12, 66 12 C 72 12, 74 26, 74 50 Z" fill="#f472b6" opacity="0.6" />
              <path
                d="M 132 62 C 140 20, 148 0, 134 0 C 120 0, 116 25, 122 62 Z"
                fill={meta.primaryColor}
                stroke="#0f172a"
                strokeWidth="3"
              />
              <path d="M 132 50 C 136 26, 140 12, 134 12 C 128 12, 126 26, 126 50 Z" fill="#f472b6" opacity="0.6" />
            </g>
          )}

          {zodiacId === 'luu' && (
            // Azure Celestial Dragon Antlers & Whiskers
            <g>
              {/* Golden Dragon Antlers */}
              <path
                d="M 62 58 C 48 38, 38 30, 28 32 C 38 42, 46 44, 52 50 C 44 40, 36 34, 26 38 C 38 52, 54 58, 66 64 Z"
                fill="#fbbf24"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <path
                d="M 138 58 C 152 38, 162 30, 172 32 C 162 42, 154 44, 148 50 C 156 40, 164 34, 174 38 C 162 52, 146 58, 134 64 Z"
                fill="#fbbf24"
                stroke="#0f172a"
                strokeWidth="2"
              />
              {/* Whiskers */}
              <path d="M 80 106 Q 52 118 42 134" stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 120 106 Q 148 118 158 134" stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {zodiacId === 'mogoi' && (
            // Mystic Cobra Hood with Cyber Runes
            <g>
              <path
                d="M 44 90 C 40 50, 65 35, 100 35 C 135 35, 160 50, 156 90 C 150 110, 138 122, 100 126 C 62 122, 50 110, 44 90 Z"
                fill="#047857"
                stroke="#0f172a"
                strokeWidth="3"
              />
              <circle cx="100" cy="50" r="6" fill="#34d399" />
              <path d="M 94 50 L 106 50 M 100 44 L 100 56" stroke="#022c22" strokeWidth="2" />
            </g>
          )}

          {zodiacId === 'mori' && (
            // Cosmic Wind Horse Solar Mane & Forehead Star
            <g>
              {/* Pointed ears */}
              <polygon points="68,54 60,26 78,44" fill="#b91c1c" stroke="#0f172a" strokeWidth="2.5" />
              <polygon points="132,54 140,26 122,44" fill="#b91c1c" stroke="#0f172a" strokeWidth="2.5" />
              {/* Solar Wind Starlight Mane */}
              <path
                d="M 92 36 C 88 18, 98 6, 114 4 C 112 16, 118 24, 122 36 Z"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="2"
              />
              {/* Golden Forehead Star (Хийморь Сүлд) */}
              <polygon points="100,48 103,56 111,56 105,61 107,69 100,64 93,69 95,61 89,56 97,56" fill="#fbbf24" />
            </g>
          )}

          {zodiacId === 'khoni' && (
            // Cloud Crest Ram Spiraling Golden Horns & Fluffy Wool
            <g>
              <path
                d="M 64 64 C 44 54, 30 68, 38 84 C 46 96, 62 88, 56 76 C 52 68, 44 72, 46 76"
                stroke="#fbbf24"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 136 64 C 156 54, 170 68, 162 84 C 154 96, 138 88, 144 76 C 148 68, 156 72, 154 76"
                stroke="#fbbf24"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* Fluffy cloud wool tuft */}
              <circle cx="86" cy="44" r="14" fill="#f8fafc" />
              <circle cx="100" cy="38" r="16" fill="#f8fafc" />
              <circle cx="114" cy="44" r="14" fill="#f8fafc" />
            </g>
          )}

          {zodiacId === 'bich' && (
            // Golden Monkey ears & Golden Circlet
            <g>
              <circle cx="54" cy="74" r="18" fill="#d97706" stroke="#0f172a" strokeWidth="3" />
              <circle cx="54" cy="74" r="10" fill="#fde68a" />
              <circle cx="146" cy="74" r="18" fill="#d97706" stroke="#0f172a" strokeWidth="3" />
              <circle cx="146" cy="74" r="10" fill="#fde68a" />
              {/* Golden Headband (Алтан цагариг) */}
              <path d="M 66 58 Q 100 48 134 58" stroke="#fbbf24" strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="100" cy="52" r="5" fill="#ef4444" stroke="#fbbf24" strokeWidth="2" />
            </g>
          )}

          {zodiacId === 'takhia' && (
            // Solar Rooster Fiery Comb & Beak
            <g>
              {/* Radiant Fiery Comb (Улаан залаа) */}
              <path
                d="M 82 44 C 80 26, 92 18, 96 34 C 98 16, 112 16, 110 36 C 114 26, 124 28, 120 44 Z"
                fill="#ef4444"
                stroke="#0f172a"
                strokeWidth="2.5"
              />
              {/* Golden Beak */}
              <polygon points="94,98 106,98 100,110" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
              {/* Red Wattle */}
              <ellipse cx="100" cy="116" rx="5" ry="8" fill="#ef4444" />
            </g>
          )}

          {zodiacId === 'nokhoi' && (
            // Mongolian Cyber Bankhar with 4-Eyed Markings & Floppy Ears
            <g>
              {/* Floppy heavy dog ears */}
              <path d="M 56 62 Q 40 76 44 102 Q 58 100 64 78 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
              <path d="M 144 62 Q 160 76 156 102 Q 142 100 136 78 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
              {/* Classic Mongolian 4-Eyed Bankhar Yellow Brow Spots (Дөрвөн нүд) */}
              <ellipse cx="80" cy="68" rx="6" ry="4" fill="#f59e0b" />
              <ellipse cx="120" cy="68" rx="6" ry="4" fill="#f59e0b" />
            </g>
          )}

          {zodiacId === 'gakhai' && (
            // Golden Prosperity Boar Rounded Snout & Tusks
            <g>
              {/* Boar Ears */}
              <polygon points="62,56 46,32 74,42" fill="#db2777" stroke="#0f172a" strokeWidth="3" />
              <polygon points="138,56 154,32 126,42" fill="#db2777" stroke="#0f172a" strokeWidth="3" />
              {/* Golden Tusks */}
              <path d="M 76 108 Q 72 100 74 96" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 124 108 Q 128 100 126 96" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 4. MAIN HEAD SPHERE WITH 3D GRADIENT */}
          <circle
            cx="100"
            cy="86"
            r="42"
            fill={`url(#body-grad-${zodiacId})`}
            stroke="#0f172a"
            strokeWidth="3.5"
          />

          {/* Mongolian National Hat (Тоорцог / Жинстэй малгай) on specific characters */}
          {(zodiacId === 'khulgana' || zodiacId === 'tuulai' || zodiacId === 'mori') && (
            <g>
              <path
                d="M 80 48 Q 100 36 120 48 L 126 56 Q 100 48 74 56 Z"
                fill="#b91c1c"
                stroke="#0f172a"
                strokeWidth="2"
              />
              {/* Golden Crown Jewel (Жинс) */}
              <circle cx="100" cy="40" r="5" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="100" y1="40" x2="108" y2="34" stroke="#ef4444" strokeWidth="2" />
            </g>
          )}

          {/* 5. BIG EXPRESSIVE 3D CARTOON EYES WITH BLINK ANIMATION */}
          {isBlinking || internalMood === 'sleep' ? (
            // Closed happy blinking eye arcs
            <g>
              <path d="M 76 86 Q 86 96 96 86" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 104 86 Q 114 96 124 86" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            // Open sparkling cartoon eyes
            <g>
              {/* Left Eye */}
              <ellipse cx="84" cy="84" rx="12" ry="15" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
              <ellipse cx="85" cy="85" rx="8" ry="11" fill={`url(#eye-grad-${zodiacId})`} />
              {/* Sparkle highlights */}
              <circle cx="82" cy="80" r="3.5" fill="#ffffff" />
              <circle cx="87" cy="88" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="116" cy="84" rx="12" ry="15" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
              <ellipse cx="115" cy="85" rx="8" ry="11" fill={`url(#eye-grad-${zodiacId})`} />
              {/* Sparkle highlights */}
              <circle cx="113" cy="80" r="3.5" fill="#ffffff" />
              <circle cx="118" cy="88" r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* 6. NOSE & MOUTH */}
          {/* Cute Snout/Nose */}
          {zodiacId === 'gakhai' ? (
            // Oval pig snout
            <g>
              <ellipse cx="100" cy="100" rx="14" ry="10" fill="#f472b6" stroke="#0f172a" strokeWidth="2" />
              <ellipse cx="95" cy="100" rx="2.5" ry="4" fill="#831843" />
              <ellipse cx="105" cy="100" rx="2.5" ry="4" fill="#831843" />
            </g>
          ) : (
            // Triangular small cute nose
            <polygon
              points="97,94 103,94 100,98"
              fill={zodiacId === 'bar' ? '#f59e0b' : '#0f172a'}
            />
          )}

          {/* Cheerful Mouth */}
          {internalMood === 'sad' ? (
            <path d="M 94 108 Q 100 102 106 108" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M 92 104 Q 100 114 108 104" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Rosy Cheeks */}
          <circle cx="70" cy="94" r="6" fill="#f43f5e" opacity="0.35" />
          <circle cx="130" cy="94" r="6" fill="#f43f5e" opacity="0.35" />
        </svg>
        </motion.div>
      )}

      {/* Switch to 3D button when in 2D mode for larger sizes */}
      {!is3DMode && allow3DToggle && (size === 'lg' || size === 'xl' || size === '2xl') && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sound.playKeyTick();
            setIs3DMode(true);
          }}
          className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-amber-400/50 text-[10px] font-mono text-amber-300 hover:text-white cursor-pointer shadow-lg flex items-center gap-1 z-20 backdrop-blur-md opacity-80 hover:opacity-100 transition-opacity"
          title="Жинхэнэ 3D WebGL горимд шилжих"
        >
          <Box className="w-2.5 h-2.5 text-amber-400" />
          <span>3D загвар</span>
        </button>
      )}
    </div>
  );
};
