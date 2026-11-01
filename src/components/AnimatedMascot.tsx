import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../lib/sound';
import { Sparkles, Heart, Star } from 'lucide-react';
import { ZodiacAnimalId, MascotAnimationState } from '../types';
import { MongolianZodiacMascot } from './MongolianZodiacMascot';

export type MascotMood = MascotAnimationState | 'shoot';

interface AnimatedMascotProps {
  imageSrc?: string;
  zodiacId?: ZodiacAnimalId;
  name?: string;
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showParticles?: boolean;
  enable3DRotation?: boolean;
  onClick?: () => void;
}

// Map legacy IDs or image keywords to the 12 Mongolian Zodiac animals
const inferZodiacId = (name?: string, imageSrc?: string): ZodiacAnimalId | undefined => {
  const combined = `${name || ''} ${imageSrc || ''}`.toLowerCase();
  if (combined.includes('khulgana') || combined.includes('nulimskhan') || combined.includes('cyan')) {
    return 'khulgana'; // Хулгана
  }
  if (combined.includes('ukher') || combined.includes('ox')) {
    return 'ukher'; // Үхэр
  }
  if (combined.includes('bar') || combined.includes('tiger') || combined.includes('ochkhon') || combined.includes('star')) {
    return 'bar'; // Бар
  }
  if (combined.includes('tuulai') || combined.includes('rabbit') || combined.includes('sakhius') || combined.includes('angel')) {
    return 'tuulai'; // Туулай
  }
  if (combined.includes('luu') || combined.includes('dragon') || combined.includes('uulkhan')) {
    return 'luu'; // Луу
  }
  if (combined.includes('mogoi') || combined.includes('snake')) {
    return 'mogoi'; // Могой
  }
  if (combined.includes('mori') || combined.includes('horse')) {
    return 'mori'; // Морь
  }
  if (combined.includes('khoni') || combined.includes('sheep') || combined.includes('ram')) {
    return 'khoni'; // Хонь
  }
  if (combined.includes('bich') || combined.includes('monkey')) {
    return 'bich'; // Бич
  }
  if (combined.includes('takhia') || combined.includes('rooster')) {
    return 'takhia'; // Тахиа
  }
  if (combined.includes('nokhoi') || combined.includes('dog') || combined.includes('bankhar') || combined.includes('sarguul') || combined.includes('fox')) {
    return 'nokhoi'; // Нохой (Банхар)
  }
  if (combined.includes('gakhai') || combined.includes('boar') || combined.includes('pig')) {
    return 'gakhai'; // Гахай
  }
  return undefined;
};

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  imageSrc,
  zodiacId,
  name = 'Mascot',
  mood = 'idle',
  size = 'md',
  className = '',
  showParticles = true,
  enable3DRotation = false,
  onClick,
}) => {
  const [internalMood, setInternalMood] = useState<MascotMood>(mood);
  const [burstKey, setBurstKey] = useState(0);
  const [dragRotateY, setDragRotateY] = useState(0);

  // Determine active zodiac ID
  const activeZodiac = zodiacId || inferZodiacId(name, imageSrc) || 'khulgana';

  useEffect(() => {
    setInternalMood(mood);
  }, [mood]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-64 h-64 sm:w-72 sm:h-72',
  }[size];

  // Motion variants for image fallback
  const variants = {
    idle: {
      y: [0, -8, 0],
      rotate: [-1.5, 1.5, -1.5],
      scale: [1, 1.025, 1],
      transition: {
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    happy: {
      y: [0, -22, 0, -12, 0],
      rotate: [-3, 4, -2, 0],
      scale: [1, 1.15, 0.98, 1.08, 1],
      transition: {
        duration: 1.1,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    dance: {
      x: [-6, 6, -6, 6, 0],
      y: [0, -14, 0, -14, 0],
      rotate: [-6, 6, -6, 6, 0],
      scale: [1, 1.06, 0.96, 1.06, 1],
      transition: {
        duration: 0.9,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    sad: {
      y: [0, 4, 0],
      rotate: [-1, 1, -1],
      scale: [0.96, 0.94, 0.96],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    shoot: {
      scale: [1, 1.18, 0.92, 1],
      y: [0, -8, 2, 0],
      transition: {
        duration: 0.45,
        ease: 'easeOut' as const,
      },
    },
  };

  const handleClick = () => {
    sound.playKeyTick(1.2);
    setBurstKey((prev) => prev + 1);
    setInternalMood('happy');
    setTimeout(() => {
      setInternalMood(mood);
    }, 2200);
    onClick?.();
  };

  // If a Mongolian Zodiac mascot can be rendered, use the 3D vector character
  if (activeZodiac) {
    const zodiacMood: MascotAnimationState =
      internalMood === 'shoot' ? 'click' : internalMood;

    return (
      <MongolianZodiacMascot
        zodiacId={activeZodiac}
        mood={zodiacMood}
        size={size}
        className={className}
        interactive={true}
        showAura={true}
        enable3DRotation={enable3DRotation}
        onClick={onClick}
      />
    );
  }

  // Fallback to image if ever specified without a zodiac mapping
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Soft Ambient Mascot Aura */}
      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none transform scale-90 animate-pulse duration-1000" />

      {/* Floating Sparkles / Hearts on happy or celebration */}
      {showParticles && (internalMood === 'happy' || internalMood === 'dance') && (
        <AnimatePresence>
          <motion.div
            key={burstKey}
            initial={{ opacity: 1, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.5, y: -45 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -top-6 flex items-center gap-3 pointer-events-none z-30"
          >
            <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin" />
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            <Sparkles className="w-5 h-5 text-cyan-300 fill-cyan-300" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Interactive 3D Mascot Image */}
      <motion.div
        animate={variants[internalMood as keyof typeof variants] || variants.idle}
        style={{
          rotateY: enable3DRotation ? dragRotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        drag={enable3DRotation ? 'x' : false}
        dragConstraints={{ left: -100, right: 100 }}
        onDrag={(_, info) => {
          if (enable3DRotation) {
            setDragRotateY((prev) => Math.max(-60, Math.min(60, prev + info.delta.x * 0.4)));
          }
        }}
        onClick={handleClick}
        className={`relative z-10 cursor-pointer ${sizeClasses}`}
      >
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] hover:brightness-110 transition-all"
        />
      </motion.div>
    </div>
  );
};
