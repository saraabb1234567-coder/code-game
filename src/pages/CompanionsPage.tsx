import React, { useState } from 'react';
import { PageType, UserProgress, Companion, ZodiacElement } from '../types';
import { COMPANIONS_DATA } from '../data/mockData';
import { sound } from '../lib/sound';
import {
  Sparkles,
  Check,
  Lock,
  Star,
  Smile,
  Moon,
  ArrowRight,
  Zap,
  Flame,
  Droplet,
  Mountain,
  Shield,
  Activity,
  Compass,
} from 'lucide-react';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { MongolianZodiacMascot } from '../components/MongolianZodiacMascot';
import { TiltCard } from '../components/TiltCard';
import { UlziiKhee, AlkhanKheeBorder, ToonoRing } from '../components/MongolianOrnaments';
import { motion } from 'motion/react';
import { MascotAnimationState } from '../types';

interface CompanionsPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const CompanionsPage: React.FC<CompanionsPageProps> = ({
  onNavigate,
  progress,
  onUpdateProgress,
}) => {
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(
    progress.activeCompanionId || 'bar'
  );
  const [currentMood, setCurrentMood] = useState<MascotAnimationState>('idle');
  const [activeElementFilter, setActiveElementFilter] = useState<string>('Бүгд');

  const selectedCompanion =
    COMPANIONS_DATA.find((c) => c.id === selectedCompanionId) || COMPANIONS_DATA[0];
  const isActive = progress.activeCompanionId === selectedCompanion.id;

  const handleSelectActive = (companion: Companion) => {
    if (!companion.unlocked) return;
    sound.playCombo(3);
    sound.playVictory();
    onUpdateProgress((prev) => ({
      ...prev,
      activeCompanionId: companion.id,
    }));
  };

  const handleTriggerMood = (mood: MascotAnimationState) => {
    setCurrentMood(mood);
    if (mood === 'level_up') {
      sound.playVictory();
      sound.playLaserShot();
    } else if (mood === 'victory' || mood === 'happy') {
      sound.playCombo(2);
    } else if (mood === 'sleep') {
      sound.playKeyTick(0.8);
    } else {
      sound.playKeyTick(1.2);
    }
  };

  const elementFilters = ['Бүгд', 'Гал', 'Шороо', 'Төмөр', 'Ус', 'Мод'];

  const filteredCompanions = COMPANIONS_DATA.filter((comp) => {
    if (activeElementFilter === 'Бүгд') return true;
    return comp.element === activeElementFilter;
  });

  const unlockedCount = COMPANIONS_DATA.filter((c) => c.unlocked).length;

  const getElementBadgeColor = (el: ZodiacElement) => {
    switch (el) {
      case 'Гал':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
      case 'Шороо':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'Төмөр':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      case 'Ус':
        return 'text-blue-400 bg-blue-950/60 border-blue-500/40';
      case 'Мод':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header with Mongolian Cyberpunk Branding */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UlziiKhee size={18} color="gold" />
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase font-mono">
              МОНГОЛЫН 12 ЖИЛИЙН САХИУС АМЬТАД · {unlockedCount} / 12 НЭЭГДСЭН
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Аялал чинь ганцаардмал биш.</span>
            <ToonoRing size={32} color="cyan" className="hidden sm:inline-block" />
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Монголын уламжлалт 12 жилийн сахиус амьтад кодын замналд чамтай нэгдэж, онцгой шидэт чадвараар даалгавруудыг давахад тусална.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              sound.playKeyTick();
              onNavigate('shooter');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase cursor-pointer shadow-lg shadow-cyan-400/25 transition-all active:scale-95"
          >
            <span>ХАРВААЧИД ОРОХ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Main 3D Mascot Showcase Panel */}
      <div className="rounded-3xl glass-card-active p-6 sm:p-10 border border-cyan-400/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-[#070b19] shadow-2xl relative overflow-hidden">
        {/* Subtle Mongolian Alkhan top trim */}
        <div className="absolute top-0 left-0 right-0 opacity-40">
          <AlkhanKheeBorder color="cyan" height={8} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
          {/* Left Column: 3D Mascot Avatar & Animation Triggers */}
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Big Mascot with 3D WebGL & Layered Animations */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full blur-3xl bg-cyan-500/20 pointer-events-none" />

              <MongolianZodiacMascot
                zodiacId={selectedCompanion.zodiacId}
                mood={currentMood}
                size="2xl"
                enable3DRotation={true}
                render3D={true}
                allow3DToggle={true}
                showAura={true}
                showOrnaments={true}
              />
            </div>

            {/* Instruction tooltip */}
            <div className="text-[11px] text-cyan-300/80 font-mono flex items-center gap-1.5 text-center">
              <span>↻ 360° Хулганаар чирч эргүүлэх боломжтой 3D WebGL загвар</span>
            </div>

            {/* 8 Interactive Animation States */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg">
              <button
                onClick={() => handleTriggerMood('idle')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'idle'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Хүлээх</span>
              </button>

              <button
                onClick={() => handleTriggerMood('walk')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'walk'
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Алхах</span>
              </button>

              <button
                onClick={() => handleTriggerMood('run')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'run'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Гүйх</span>
              </button>

              <button
                onClick={() => handleTriggerMood('jump')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'jump'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Үсрэх</span>
              </button>

              <button
                onClick={() => handleTriggerMood('dance')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'dance'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Бүжиглэх</span>
              </button>

              <button
                onClick={() => handleTriggerMood('attack')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'attack'
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Довтлох</span>
              </button>

              <button
                onClick={() => handleTriggerMood('victory')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'victory'
                    ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Ялах</span>
              </button>

              <button
                onClick={() => handleTriggerMood('defeat')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  currentMood === 'defeat'
                    ? 'bg-slate-600/30 border-slate-400 text-slate-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Ялагдах</span>
              </button>
            </div>
          </div>

          {/* Right Column: Character Lore, Stats & Selection */}
          <div className="space-y-6">
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-400/40 text-cyan-300">
                {selectedCompanion.zodiacIndex}-Р ЖИЛ · {selectedCompanion.zodiacYearName}
              </span>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1 ${getElementBadgeColor(
                  selectedCompanion.element
                )}`}
              >
                <Flame className="w-3.5 h-3.5" />
                Махбод: {selectedCompanion.element}
              </span>

              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-300">
                {selectedCompanion.rarity}
              </span>
            </div>

            {/* Name and Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                {selectedCompanion.mongolianName}
              </h2>
              <p className="text-sm font-semibold text-cyan-400 mt-1">
                "{selectedCompanion.title}"
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedCompanion.description}
            </p>

            {/* Special Realm & Move Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                <div className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                  Уугуул орчин
                </div>
                <div className="text-xs font-bold text-white">{selectedCompanion.realm}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                <div className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Тусгай чадвар
                </div>
                <div className="text-xs font-bold text-amber-300">{selectedCompanion.specialMove}</div>
              </div>
            </div>

            {/* Bonus Box */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <div className="text-[11px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Тоглоомын идэвхтэй урамшуулал
              </div>
              <p className="text-xs text-slate-200 font-semibold">{selectedCompanion.bonus}</p>
            </div>

            {/* Traits */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Зан чанар:</span>
              {selectedCompanion.traits.map((trait, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5"
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Active Companion Button */}
            <div className="pt-2">
              <button
                onClick={() => handleSelectActive(selectedCompanion)}
                disabled={isActive}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/25'
                }`}
              >
                {isActive ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ОДООГИЙН ИДЭВХТЭЙ ХАМТРАГЧ</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>ИДЭВХТЭЙ ХАМТРАГЧААР СОНГОХ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Element Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UlziiKhee size={16} color="cyan" />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              12 Жилийн амьтдын цуглуулга
            </h3>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 overflow-x-auto">
            {elementFilters.map((elem) => (
              <button
                key={elem}
                onClick={() => {
                  sound.playKeyTick();
                  setActiveElementFilter(elem);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeElementFilter === elem
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {elem}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Zodiac Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCompanions.map((comp) => {
            const isSelected = comp.id === selectedCompanion.id;
            const isEquipped = comp.id === progress.activeCompanionId;

            return (
              <TiltCard
                key={comp.id}
                maxTilt={8}
                onClick={() => {
                  sound.playKeyTick(1.2);
                  setSelectedCompanionId(comp.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-400/20'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/30'
                }`}
              >
                {/* Equipped Badge */}
                {isEquipped && (
                  <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    СОНГОСОН
                  </div>
                )}

                {/* Character preview */}
                <div className="flex flex-col items-center py-3">
                  <div className="w-24 h-24 relative flex items-center justify-center">
                    <MongolianZodiacMascot
                      zodiacId={comp.zodiacId}
                      mood={isSelected ? 'happy' : 'idle'}
                      size="md"
                      showAura={false}
                      interactive={false}
                    />
                  </div>

                  <div className="text-center mt-2">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">
                      {comp.zodiacIndex}-Р ЖИЛ
                    </div>
                    <div className="text-sm font-black text-white truncate max-w-[150px]">
                      {comp.mongolianName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                      {comp.role}
                    </div>
                  </div>
                </div>

                {/* Bottom stats pill */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${getElementBadgeColor(
                      comp.element
                    )}`}
                  >
                    {comp.element}
                  </span>
                  <span className="text-slate-400 font-mono">Түвшин {comp.level}</span>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
