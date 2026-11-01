import React, { useEffect } from 'react';
import { PageType, UserProgress } from '../types';
import { sound } from '../lib/sound';
import { ArrowRight, RotateCcw, Sparkles, Unlock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { TiltCard } from '../components/TiltCard';
import { motion } from 'motion/react';

interface VictoryPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
}

export const VictoryPage: React.FC<VictoryPageProps> = ({ onNavigate, progress }) => {
  useEffect(() => {
    sound.playVictory();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-center">
      
      {/* Top Banner & Title matching Screen 7 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          7-р даалгавар амжилттай дууслаа
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight drop-shadow-[0_0_25px_rgba(68,229,212,0.4)]">
          Чи чадлаа, бүтээгч ээ!
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          12 командыг зөв бичиж, анхны Python гаралтыг авлаа.
        </p>
      </motion.div>

      {/* Floating Mascots Celebration Showcase with Animated Mascots */}
      <div className="relative py-4 flex flex-col items-center justify-center">
        
        {/* +250 XP Badge with pulse */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 px-5 py-2 rounded-full bg-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-xl shadow-cyan-400/40 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          +250 туршлага
        </motion.div>

        {/* 4 Zodiac Mascots celebrating in synchronization */}
        <div className="flex items-end justify-center gap-4 sm:gap-8 max-w-lg mx-auto">
          <div className="flex flex-col items-center">
            <AnimatedMascot
              zodiacId="khulgana"
              name="Овсгоотой Хулгана"
              size="sm"
              mood="dance"
            />
            <span className="text-[10px] text-slate-400 font-semibold mt-1">Хулгана</span>
          </div>

          <div className="flex flex-col items-center">
            <AnimatedMascot
              zodiacId="tuulai"
              name="Сэргэлэн Туулай"
              size="sm"
              mood="happy"
            />
            <span className="text-[10px] text-slate-400 font-semibold mt-1">Туулай</span>
          </div>

          <div className="flex flex-col items-center -translate-y-2">
            <AnimatedMascot
              zodiacId="bar"
              name="Зоригт Бар"
              size="md"
              mood="victory"
            />
            <span className="text-[10px] text-amber-300 font-bold mt-1">Зоригт Бар ★</span>
          </div>

          <div className="flex flex-col items-center">
            <AnimatedMascot
              zodiacId="luu"
              name="Сүрлэг Луу"
              size="sm"
              mood="victory"
            />
            <span className="text-[10px] text-slate-400 font-semibold mt-1">Сүрлэг Луу</span>
          </div>
        </div>
      </div>

      {/* 4 Stats Grid with 3D TiltCards matching Screen 7 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
        <TiltCard glowColor="cyan" className="p-4 rounded-3xl glass-card border border-white/10 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Нийт оноо
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300">
            2 240
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            Шинэ дээд амжилт
          </div>
        </TiltCard>

        <TiltCard glowColor="emerald" className="p-4 rounded-3xl glass-card border border-white/10 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Нарийвчлал
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            96%
          </div>
          <div className="text-[11px] text-slate-400">
            Тогтвортой зөв бичилт
          </div>
        </TiltCard>

        <TiltCard glowColor="purple" className="p-4 rounded-3xl glass-card border border-white/10 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Бичих хурд
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            42 <span className="text-xs font-normal text-slate-400">үг/мин</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Өөрийн хэмнэлээ оллоо
          </div>
        </TiltCard>

        <TiltCard glowColor="amber" className="p-4 rounded-3xl glass-card border border-white/10 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Хамгийн урт дараалал
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400">
            12
          </div>
          <div className="text-[11px] text-slate-400">
            Онооны үржүүлэгч ×2
          </div>
        </TiltCard>
      </div>

      {/* Progression Bar & Next Unlock Card with 3D TiltCards matching Screen 7 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
        
        {/* XP Level progress */}
        <TiltCard glowColor="cyan" className="p-5 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>3-р шат · Python</span>
            <span className="font-mono text-cyan-300">2 450 → 2 700</span>
          </div>
          
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full"
            />
          </div>

          <div className="text-[11px] text-slate-400">
            Нийт 19 даалгавар дууссан · Python: 7 / 12
          </div>
        </TiltCard>

        {/* Unlocked ability card */}
        <TiltCard glowColor="cyan" className="p-5 rounded-3xl glass-card-active border border-cyan-400/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center flex-shrink-0 text-cyan-300 shadow-md">
            <Unlock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              НЭЭГДЛЭЭ · 8-Р ДААЛГАВАР
            </div>
            <div className="text-sm font-bold text-white">
              Хэрэглэгчээс мэдээлэл авах
            </div>
            <div className="font-mono text-xs text-slate-300">
              input()
            </div>
          </div>
        </TiltCard>

      </div>

      {/* Action Buttons matching Screen 7 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => {
            sound.playKeyTick();
            onNavigate('shooter');
          }}
          className="px-6 py-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-bold text-xs uppercase hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          ДАХИН ХАРАХ
        </button>

        <button
          onClick={() => {
            sound.playKeyTick(1.2);
            onNavigate('roadmap');
          }}
          className="px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-cyan-400/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          ҮРГЭЛЖЛҮҮЛЭХ
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            sound.playKeyTick();
            onNavigate('companions');
          }}
          className="px-6 py-3.5 rounded-xl bg-[#141b34] hover:bg-[#1a2344] border border-white/15 text-white font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer"
        >
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          12 ЖИЛИЙГ ҮЗЭХ
        </button>
      </div>

    </div>
  );
};
