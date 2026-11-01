import React, { useState } from 'react';
import { PageType, UserProgress } from '../types';
import { sound } from '../lib/sound';
import { ArrowLeft, Play, CheckCircle2, RotateCcw, Lightbulb, Code2, Sparkles } from 'lucide-react';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { TiltCard } from '../components/TiltCard';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface LessonPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
}

export const LessonPage: React.FC<LessonPageProps> = ({ onNavigate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testedCode, setTestedCode] = useState('Hello World');
  const [completed, setCompleted] = useState(false);

  const handleTestRun = () => {
    sound.playKeyTick(1.2);
    setIsRunning(true);
    setTestedCode('...');
    
    setTimeout(() => {
      sound.playLaserShot();
      sound.playCombo(2);
      setTestedCode('Hello World');
      setIsRunning(false);
      setCompleted(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Breadcrumbs matching Screen 5 */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playKeyTick();
              onNavigate('catalog');
            }}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-400/35 text-xs font-bold text-cyan-300 shadow">
            • 3-р шат · Python · 7-р даалгавар
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="text-cyan-400">Ойлгох</span>
          <span>→</span>
          <span>Дадлага</span>
          <span>→</span>
          <span>Тоглох</span>
        </div>
      </motion.div>

      {/* Title */}
      <div>
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
          ТОГЛОХЫН ӨМНӨ ОЙЛГОЁ
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Нэг мөр код. Анхны мэндчилгээ.
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Кодыг цээжлэхээс өмнө юу хийдгийг нь мэдье.
        </p>
      </div>

      {/* Main 2-column Grid matching Screen 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Mascot teacher & Explanations */}
        <div className="space-y-6">
          
          {/* Mascot Speech Card with AnimatedMascot */}
          <TiltCard
            glowColor="cyan"
            className="flex items-start gap-4 p-5 rounded-3xl glass-card border border-white/10"
          >
            <AnimatedMascot
              zodiacId="tuulai"
              name="Сэргэлэн Туулай"
              size="md"
              mood="happy"
            />
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-400/20 text-slate-200 text-xs leading-relaxed flex-1">
              <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Сэргэлэн Туулай: "Сайн уу, бүтээгч ээ!"
              </div>
              <p>
                print бол кодоороо 12 жилийн сахиус амьтад болон дэлхийтэй мэндлэх хамгийн анхны найдвартай арга юм шүү.
              </p>
            </div>
          </TiltCard>

          {/* 3 Key Concepts with hover cards */}
          <div className="space-y-4 text-sm">
            <TiltCard glowColor="cyan" className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <h3 className="font-bold text-white text-sm">Юу хийдэг вэ?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                <code className="text-cyan-300 font-mono bg-cyan-950/60 px-1 py-0.5 rounded">print()</code> нь хаалт доторх утгыг дэлгэцийн гаралтад хэвлэнэ.
              </p>
            </TiltCard>

            <TiltCard glowColor="purple" className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <h3 className="font-bold text-white text-sm">Яагаад ашигладаг вэ?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Мэдээлэл харуулах, тооцооны хариугаа харах, кодоо шалгахад хэрэглэнэ.
              </p>
            </TiltCard>

            <TiltCard glowColor="emerald" className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <h3 className="font-bold text-white text-sm">Хаана ашиглах вэ?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Python программ, жижиг хэрэгсэл, сургалтын дасгал болон автоматжуулалтын бүртгэлд ашиглана.
              </p>
            </TiltCard>
          </div>

        </div>

        {/* Right Column: Code Breakdown & Interactive Console matching Screen 5 */}
        <div className="space-y-6">
          
          {/* Code Editor Box with 3D Tilt */}
          <TiltCard glowColor="cyan" className="rounded-3xl glass-card overflow-hidden border border-white/10 shadow-2xl">
            <div className="px-4 py-3 bg-[#090e24] border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Python · Анхны гаралт</span>
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="p-6 font-mono text-sm sm:text-base bg-slate-950/90 text-slate-100 flex items-center gap-3">
              <span className="text-slate-600 select-none">1</span>
              <div>
                <span className="text-cyan-400 font-bold">print</span>
                <span className="text-white">(</span>
                <span className="text-emerald-400 font-semibold">"Hello World"</span>
                <span className="text-white">)</span>
              </div>
            </div>

            {/* Syntax Breakdown Anatomy matching Screen 5 */}
            <div className="p-4 bg-slate-900/80 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl hover:bg-cyan-950/40 transition-colors">
                <span className="font-mono text-xs font-bold text-cyan-400">print</span>
                <div className="text-[10px] text-slate-400 mt-0.5">Хэвлэх функц</div>
              </div>
              <div className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
                <span className="font-mono text-xs font-bold text-white">( )</span>
                <div className="text-[10px] text-slate-400 mt-0.5">Утгыг хүрээлнэ</div>
              </div>
              <div className="p-2 rounded-xl hover:bg-emerald-950/40 transition-colors">
                <span className="font-mono text-xs font-bold text-emerald-400">" "</span>
                <div className="text-[10px] text-slate-400 mt-0.5">Текстийг тэмдэглэнэ</div>
              </div>
            </div>

            {/* Live Interactive Output Display */}
            <div className="p-5 bg-[#06141a] border-t border-cyan-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  ДЭЛГЭЦЭНД ГАРАХ ҮР ДҮН
                </div>
                <button
                  onClick={handleTestRun}
                  disabled={isRunning}
                  className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-[11px] flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isRunning ? 'Ажиллаж байна...' : 'КОДЫГ АЖИЛЛУУЛАХ'}
                </button>
              </div>

              <div className="text-lg font-mono font-bold text-emerald-300">
                {testedCode}
              </div>

              <p className="text-[11px] text-slate-400">
                Хашилт нь кодын хэсэг учраас гаралтад харагдахгүй.
              </p>
            </div>
          </TiltCard>

          {/* Real world example card */}
          <TiltCard glowColor="purple" className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2 text-xs">
            <div className="font-bold text-slate-300">
              Жишээ: захиалга баталгаажуулах
            </div>
            <div className="font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-xl border border-white/5">
              print("Захиалга баталгаажлаа!")
            </div>
            <div className="text-slate-400">
              Гаралт: <span className="text-emerald-400 font-bold">Захиалга баталгаажлаа!</span>
            </div>
          </TiltCard>

        </div>

      </div>

      {/* Confirmation bar matching Screen 5 */}
      <div className="p-4 rounded-3xl bg-cyan-950/40 border border-cyan-400/35 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span className="text-xs text-slate-200">
            Тийм ээ, <code className="text-cyan-300 font-mono">print()</code> дэлгэцэнд мэдээлэл хэвлэнэ. Ойлголтоо баталлаа. Одоо 7-р даалгаврын бичих сорил нээгдэнэ.
          </span>
        </div>

        <button
          onClick={() => {
            sound.playKeyTick();
            handleTestRun();
          }}
          className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-md shadow-cyan-400/30"
        >
          Ойлголоо ✓
        </button>
      </div>

      {/* Bottom Actions matching Screen 5 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              sound.playKeyTick();
              onNavigate('catalog');
            }}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-xs uppercase hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ОЙЛГОЛОО →
          </button>

          <button
            onClick={() => {
              sound.playKeyTick();
              handleTestRun();
            }}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs uppercase hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            ДАХИН ТАЙЛБАРЛА →
          </button>
        </div>

        <button
          onClick={() => {
            sound.playKeyTick(1.2);
            onNavigate('shooter');
          }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-400/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          ОДОО ТОГЛОЁ
          <Play className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

    </div>
  );
};
