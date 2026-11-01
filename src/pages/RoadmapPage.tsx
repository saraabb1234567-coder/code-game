import React, { useState, useEffect } from 'react';
import { PageType, UserProgress } from '../types';
import { CURRICULUM_STEPS } from '../data/mockData';
import { sound } from '../lib/sound';
import { ArrowRight, CheckCircle2, Lock, Play, Keyboard, Zap, Target, Star, Award, Sparkles } from 'lucide-react';
import { TiltCard } from '../components/TiltCard';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { MongolianZodiacMascot } from '../components/MongolianZodiacMascot';
import { UlziiKhee } from '../components/MongolianOrnaments';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface RoadmapPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
}

// Animated rolling counter component
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate, progress }) => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const weekDays = [
    { day: 'Да', min: 14, height: '35%' },
    { day: 'Мя', min: 22, height: '65%' },
    { day: 'Лх', min: 16, height: '45%' },
    { day: 'Пү', min: 28, height: '80%' },
    { day: 'Ба', min: 35, height: '100%', active: true },
    { day: 'Бя', min: 0, height: '10%' },
    { day: 'Ня', min: 0, height: '10%' },
  ];

  const handleBadgeClick = (badgeName: string) => {
    sound.playCombo(2);
    setSelectedBadge(badgeName);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Metrics Row with Animated Numbers matching Screen 8 */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-3xl bg-slate-900/60 border border-white/10 text-center shadow-xl backdrop-blur-md"
      >
        <TiltCard glowColor="cyan" className="p-2 bg-transparent">
          <div className="text-xl sm:text-2xl font-black text-cyan-400">
            {progress.level} · {progress.track}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Шат</div>
        </TiltCard>

        <TiltCard glowColor="purple" className="p-2 bg-transparent">
          <div className="text-xl sm:text-2xl font-black text-white">
            <AnimatedNumber value={progress.xp} />
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Туршлага (XP)</div>
        </TiltCard>

        <TiltCard glowColor="emerald" className="p-2 bg-transparent">
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            <AnimatedNumber value={progress.wpm} /> <span className="text-xs font-normal">үг/мин</span>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Хурд</div>
        </TiltCard>

        <TiltCard glowColor="amber" className="p-2 bg-transparent">
          <div className="text-xl sm:text-2xl font-black text-purple-300">
            <AnimatedNumber value={progress.accuracy} />%
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Нарийвчлал</div>
        </TiltCard>

        <TiltCard glowColor="cyan" className="col-span-2 sm:col-span-1 p-2 bg-transparent">
          <div className="text-xl sm:text-2xl font-black text-amber-300">
            <AnimatedNumber value={progress.completedTasksCount} />
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Дууссан даалгавар</div>
        </TiltCard>
      </motion.div>

      {/* Title */}
      <div className="space-y-1">
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          МИНИЙ ЗАМНАЛ
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          {progress.name}, чи урагшилж байна.
        </h1>
        <p className="text-sm text-slate-400">
          Өнөөдрийн зорилт: анхан шатны мэдлэгээ баталгаажуулах.
        </p>
      </div>

      {/* Main Grid: Left Current Spotlight + Skills, Right 10-step curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (1 col): Current Active Challenge & Acquired Skills */}
        <div className="space-y-6">
          
          {/* Current Challenge Card with 3D Mascot */}
          <TiltCard
            glowColor="cyan"
            className="rounded-3xl glass-card-active p-6 text-center space-y-4 border border-cyan-400/40 shadow-2xl"
          >
            <div className="relative inline-block">
              <AnimatedMascot
                zodiacId={progress.activeCompanionId as any || 'bar'}
                size="lg"
                mood="idle"
                enable3DRotation
              />
            </div>

            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/40 text-[10px] font-bold text-cyan-300">
                • Чиний одоогийн цэг
              </div>
              <h2 className="text-lg font-black text-white">
                Анхны Python гаралт
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                3-р шатны 7-р даалгавар. print() ашиглан мэндчилгээгээ дэлгэцэнд харуул.
              </p>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full"
              />
            </div>

            <button
              onClick={() => {
                sound.playKeyTick(1.2);
                onNavigate('shooter');
              }}
              className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/30 transition-all cursor-pointer"
            >
              ҮРГЭЛЖЛҮҮЛЭХ
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </TiltCard>

          {/* Acquired Skills Card */}
          <div className="rounded-2xl glass-card p-5 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Чиний чадварууд
            </h3>
            
            <div className="space-y-2 text-xs text-slate-300">
              {['Гарын зөв байрлал', 'Тэмдэгт, хашилт, хаалт', 'Богино командын бичилт', 'Python гаралтын суурь'].map((skill, idx) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{skill}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (2 cols): 10-step curriculum flowchart matching Screen 8 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Бүтээгч болох 10 шат
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              2 дууссан · 1 идэвхтэй
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CURRICULUM_STEPS.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <TiltCard
                    glowColor={isActive ? 'cyan' : isCompleted ? 'emerald' : 'purple'}
                    onClick={() => {
                      if (isActive) onNavigate('shooter');
                    }}
                    className={`relative rounded-2xl p-4 transition-all h-full ${
                      isActive
                        ? 'glass-card-active border-2 border-cyan-400 shadow-xl shadow-cyan-950/40 cursor-pointer'
                        : isCompleted
                        ? 'glass-card border border-emerald-500/30'
                        : 'bg-slate-950/40 border border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                            isActive
                              ? 'bg-cyan-400 text-slate-950'
                              : isCompleted
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-900 text-slate-500'
                          }`}
                        >
                          {step.step}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">
                              {step.title}
                            </h4>
                            {step.guardianZodiac && (
                              <div className="w-5 h-5 flex items-center justify-center">
                                <MongolianZodiacMascot
                                  zodiacId={step.guardianZodiac}
                                  size="sm"
                                  showAura={false}
                                  interactive={false}
                                  className="w-5 h-5 scale-60"
                                />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {step.tasksCompleted} / {step.totalTasks} даалгавар
                          </span>
                        </div>
                      </div>

                      <div>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isActive ? (
                          <Play className="w-4 h-4 text-cyan-400 fill-current" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                      {step.description}
                    </p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
            Шат ахих тусам команд уртасч, зөв бичилт, хурд, кодын логик болон асуудал шийдэх шаардлага нэмэгдэнэ. Өмнөх шатны даалгавруудаа дуусгаад дараагийнхыг нээнэ.
          </p>
        </div>

      </div>

      {/* Bottom Section: Weekly Activity & Badges matching Screen 8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Weekly Activity Chart with Animated Bars */}
        <div className="rounded-2xl glass-card p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Энэ долоо хоног</h3>
            <span className="text-xs font-mono font-bold text-cyan-400">92 минут</span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-28 pt-2 px-2 border-b border-white/10">
            {weekDays.map(item => (
              <div key={item.day} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-full max-w-[28px] h-20 flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: item.height }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`w-full rounded-t-lg transition-all ${
                      item.active
                        ? 'bg-cyan-400 shadow-[0_0_12px_#44e5d4]'
                        : 'bg-purple-600/40 hover:bg-purple-500/60'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Хурд <span className="text-emerald-400 font-bold">+8 үг/мин</span> · 5 өдөр дадлага хийсэн
          </div>
        </div>

        {/* Small Victories & Companion unlock badge with 3D reward popups */}
        <div className="rounded-2xl glass-card p-5 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Жижиг ялалтууд, том урам</h3>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              
              <TiltCard
                glowColor="purple"
                onClick={() => handleBadgeClick('Эхний алхам')}
                className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-300 font-semibold">Эхний алхам</div>
              </TiltCard>

              <TiltCard
                glowColor="cyan"
                onClick={() => handleBadgeClick('40 үг/мин')}
                className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-300 font-semibold">40 үг/мин</div>
              </TiltCard>

              <TiltCard
                glowColor="emerald"
                onClick={() => handleBadgeClick('95% зөв')}
                className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-300 font-semibold">95% зөв</div>
              </TiltCard>

            </div>
          </div>

          <TiltCard
            glowColor="amber"
            onClick={() => onNavigate('companions')}
            className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-400/30 text-xs text-slate-300 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300 animate-spin" />
              <span>3 / 5 хамтрагч · Дараагийнх: <strong>Очхон</strong></span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </TiltCard>
        </div>

      </div>

    </div>
  );
};
