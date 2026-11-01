import React, { useState } from 'react';
import { PageType, UserProgress } from '../types';
import { sound } from '../lib/sound';
import { ArrowLeft, ShieldCheck, RotateCcw, Lightbulb, Check } from 'lucide-react';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { TiltCard } from '../components/TiltCard';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface ErrorDiagPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
}

export const ErrorDiagPage: React.FC<ErrorDiagPageProps> = ({ onNavigate, progress }) => {
  const [practiceInput, setPracticeInput] = useState('');
  const targetCode = 'print("Hello World")';
  const isPracticeCorrect = practiceInput === targetCode;

  const handlePracticeChange = (val: string) => {
    sound.playKeyTick();
    setPracticeInput(val);
    if (val === targetCode) {
      sound.playLaserShot();
      sound.playCombo(3);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header matching Screen 6 */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playKeyTick();
              onNavigate('shooter');
            }}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Кодын харваач</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/30 text-cyan-300">
              3-р шат · Python · 7-р даалгавар
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span className="text-white font-bold">{progress.score} оноо</span> · Хугацаа түр зогссон
        </div>
      </motion.div>

      {/* Title & Badge */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-semibold shadow">
          ✦ Алдаа бол сурах нэг алхам
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Ганцхан үсгийг хамтдаа засъя.
        </h1>
      </div>

      {/* Main Grid: Mascot on Left, Diff on Right matching Screen 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Mascot & Comfort Speech with AnimatedMascot */}
        <div className="space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="relative">
            <AnimatedMascot
              zodiacId="khulgana"
              name="Овсгоотой Хулгана"
              size="lg"
              mood={isPracticeCorrect ? 'happy' : 'sad'}
            />
          </div>

          <div className="p-4 rounded-3xl bg-indigo-950/40 border border-indigo-400/20 text-slate-200 text-xs leading-relaxed space-y-2 w-full shadow-lg">
            <div className="font-bold text-cyan-300">
              Овсгоотой Хулгана: "Надад ч бас андуурах үе бий."
            </div>
            <p className="text-slate-300">
              {isPracticeCorrect
                ? 'Гайхалтай! Чи алдаагаа олж төгс заслаа! Одоо 12 жилийн тулаандаа буцан орцгооё.'
                : 'Яарах хэрэггүй. Жижиг латин "i" ба "l" үсгийн ялгааг ажиглаад дахин бичээрэй.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Амь хасагдаагүй.
          </div>
        </div>

        {/* Diff Comparison Boxes with 3D TiltCards matching Screen 6 */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Box 1: What student typed */}
          <TiltCard glowColor="purple" className="p-5 rounded-3xl bg-slate-950/90 border border-rose-500/40 space-y-2 shadow-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ЧИНИЙ БИЧСЭН КОМАНД
            </div>
            
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-wide flex items-center">
              <span className="text-white">pr</span>
              {/* Highlighted mistaken char with red box */}
              <span className="px-1.5 py-0.5 mx-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500 animate-pulse">
                l
              </span>
              <span className="text-white">nt("Hello World")</span>
            </div>

            <div className="text-xs text-rose-400 font-semibold pt-1">
              3 дахь тэмдэгт: <span className="font-mono">l → i</span>
            </div>
          </TiltCard>

          {/* Box 2: Correct command with explanation */}
          <TiltCard glowColor="cyan" className="p-5 rounded-3xl bg-[#06181b] border border-cyan-500/40 space-y-2 shadow-xl">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              ЗӨВ КОМАНД
            </div>

            <div className="font-mono text-xl sm:text-2xl font-bold tracking-wide flex items-center">
              <span className="text-slate-200">pr</span>
              <span className="px-1.5 py-0.5 mx-0.5 rounded bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_#44e5d4]">
                i
              </span>
              <span className="text-slate-200">nt("Hello World")</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              <code className="text-cyan-300 font-mono">print</code> гэдэг нэрэнд жижиг латин <strong className="text-cyan-300 font-mono">i</strong> үсэг ордог. Чи оронд нь <strong className="text-rose-400 font-mono">l</strong> бичжээ. Бусад тэмдэгтүүд чинь зөв байна.
            </p>
          </TiltCard>

          {/* Key shortcut reminder */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-start gap-3 text-xs text-slate-400">
            <div className="px-2 py-1 rounded-lg bg-slate-800 border border-white/10 font-mono text-cyan-300 font-bold text-xs flex-shrink-0">
              i
            </div>
            <div className="space-y-1">
              <div>
                Санамж: гар дээрх <span className="font-mono text-white">i</span> товчийг үсэг томруулах товч даралгүй бич.
              </div>
              <div className="font-mono text-[11px] text-cyan-400">
                print("Сайн уу!") → Гаралт: Сайн уу!
              </div>
            </div>
          </div>

          {/* Live quick practice tester */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Шууд дадлага хийж шалгах:</span>
              {isPracticeCorrect && (
                <span className="text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
                  <Check className="w-3.5 h-3.5" />
                  Зөв боллоо!
                </span>
              )}
            </div>
            <input
              type="text"
              value={practiceInput}
              onChange={e => handlePracticeChange(e.target.value)}
              placeholder='print("Hello World") гэж энд бичиж туршаарай...'
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border font-mono text-sm outline-none transition-colors ${
                isPracticeCorrect
                  ? 'border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'border-white/15 focus:border-cyan-400 text-white'
              }`}
            />
          </div>

        </div>

      </div>

      {/* Bottom Actions matching Screen 6 */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5">
        <button
          onClick={() => {
            sound.playKeyTick(1.2);
            onNavigate('shooter');
          }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          ДАХИН ОРОЛДОХ
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            sound.playKeyTick();
            onNavigate('lesson');
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-xs uppercase hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
          ТАЙЛБАРЫГ ҮЗЭХ
        </button>
      </div>

    </div>
  );
};
