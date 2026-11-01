import React, { useState, useEffect, useRef } from 'react';
import { PageType, UserProgress } from '../types';
import { TERMINAL_EXERCISES } from '../data/mockData';
import { sound } from '../lib/sound';
import { ArrowLeft, CornerDownLeft, Sparkles, Terminal } from 'lucide-react';
import { TiltCard } from '../components/TiltCard';
import { AnimatedMascot } from '../components/AnimatedMascot';
import { motion } from 'motion/react';

interface TerminalGamePageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  reducedMotion?: boolean;
}

export const TerminalGamePage: React.FC<TerminalGamePageProps> = ({
  onNavigate,
  progress,
  onUpdateProgress,
  reducedMotion = false,
}) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [typedCommand, setTypedCommand] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(28);
  const [streakCount, setStreakCount] = useState(8);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'sad'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentExercise = TERMINAL_EXERCISES[exerciseIndex] || TERMINAL_EXERCISES[0];
  const targetCommand = currentExercise.command;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Autofocus input
  useEffect(() => {
    inputRef.current?.focus();
    const handleFocus = () => inputRef.current?.focus();
    window.addEventListener('click', handleFocus);
    return () => window.removeEventListener('click', handleFocus);
  }, []);

  // Handle typing character by character
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      sound.playKeyTick(0.9);
      setTypedCommand(prev => prev.slice(0, -1));
      return;
    }

    if (e.key.length !== 1) return;

    const nextChar = e.key;
    const expectedChar = targetCommand[typedCommand.length];

    if (nextChar === expectedChar) {
      sound.playKeyTick(1.1);
      const updated = typedCommand + nextChar;
      setTypedCommand(updated);

      if (updated === targetCommand) {
        sound.playLaserShot();
        sound.playCombo(2);
        setStreakCount(prev => prev + 1);
        setSecondsLeft(prev => prev + 3); // Bonus 3 seconds!
        setMascotMood('happy');

        onUpdateProgress(prev => ({
          ...prev,
          score: prev.score + 100,
          xp: prev.xp + 20,
          streak: prev.streak + 1,
        }));

        setTimeout(() => {
          setTypedCommand('');
          setMascotMood('idle');
          if (exerciseIndex + 1 < TERMINAL_EXERCISES.length) {
            setExerciseIndex(prev => prev + 1);
          } else {
            setExerciseIndex(0);
          }
        }, 450);
      }
    } else {
      sound.playError();
      setStreakCount(0);
      setMascotMood('sad');
      setTimeout(() => setMascotMood('idle'), 1500);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
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
          <div>
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              ТЕРМИНАЛЫН ДАСГАЛ
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Командын хурд
            </h1>
            <p className="text-xs text-slate-400">
              Цагтай уралд. Командаа зөв бич. Дарааллаа хадгал.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs text-slate-300 self-start sm:self-auto shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Чөлөөт дасгал · шат ахихгүй
        </div>
      </motion.div>

      {/* Hidden input for physical keyboard */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -top-10 left-0 w-1 h-1 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {/* Main Grid: Left Terminal, Right Timer & Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Terminal Window with 3D Tilt matching Screen 4 */}
        <TiltCard
          glowColor="cyan"
          className="lg:col-span-2 rounded-3xl glass-card overflow-hidden border border-white/10 flex flex-col justify-between shadow-2xl"
        >
          {/* Terminal Window Titlebar */}
          <div className="px-4 py-3 bg-[#0a0f24] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                Дасгалын орчин · Git
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400">&gt;_</span>
          </div>

          {/* Terminal Content Body */}
          <div className="p-6 font-mono text-xs sm:text-sm space-y-5 select-text">
            
            {/* Historical context commands */}
            {currentExercise.contextOutput.map((item, idx) => (
              <div key={idx} className="space-y-1.5 opacity-80">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">$</span>
                    <span>{item.cmd}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-sans font-bold">
                    {item.status}
                  </span>
                </div>
                <div className="text-slate-400 pl-4">
                  {item.out}
                </div>
              </div>
            ))}

            <div className="border-t border-white/10 my-4" />

            {/* Current Active Command */}
            <div className="space-y-2">
              <div className="text-xs font-sans text-cyan-400 font-bold">
                ОДООГИЙН КОМАНД · 9 / 15
              </div>
              <div className="text-sm font-sans font-black text-white">
                {currentExercise.title}
              </div>
              <div className="text-xs text-slate-400">
                {targetCommand}
              </div>

              {/* Typing Box */}
              <div
                onClick={() => inputRef.current?.focus()}
                className="mt-3 p-4 rounded-xl bg-slate-950 border-2 border-cyan-400/60 shadow-xl shadow-cyan-950/40 flex items-center justify-between cursor-text hover:border-cyan-400 transition-colors"
              >
                <div className="font-mono text-base font-bold flex items-center">
                  <span className="text-cyan-400 mr-2">$</span>
                  <span className="text-cyan-300">{typedCommand}</span>
                  <span className="w-2.5 h-4 bg-cyan-400 animate-cursor inline-block mx-0.5" />
                  <span className="text-slate-600">
                    {targetCommand.slice(typedCommand.length)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <span>Гүйцэтгээд</span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                <span>{typedCommand.length} / {targetCommand.length} тэмдэгт зөв</span>
                <span className="text-cyan-400/80">{currentExercise.hint}</span>
              </div>
            </div>

          </div>

          <div className="p-4 bg-slate-950/60 border-t border-white/5 text-[11px] text-slate-500">
            Дараагийн даалгавар автоматаар шилжинэ.
          </div>
        </TiltCard>

        {/* Right Side: Countdown Card & Mascot Coach */}
        <div className="space-y-6">
          
          {/* Countdown timer card */}
          <TiltCard
            glowColor="cyan"
            className="rounded-3xl glass-card p-6 text-center space-y-3 border border-white/10 shadow-xl"
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ҮЛДЭСЭН ХУГАЦАА
            </div>
            
            <div className="text-5xl font-mono font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              {formatSeconds(secondsLeft)}
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-1000"
                style={{ width: `${Math.min((secondsLeft / 60) * 100, 100)}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400">
              Зөв команд бүр +3 секунд
            </div>
          </TiltCard>

          {/* Coach Mascot Speech Card with AnimatedMascot */}
          <TiltCard
            glowColor="amber"
            className="rounded-3xl glass-card p-6 border border-white/10 flex flex-col items-center text-center space-y-4 shadow-xl"
          >
            <div className="relative">
              <AnimatedMascot
                zodiacId="nokhoi"
                name="Үнэнч Банхар"
                size="md"
                mood={mascotMood}
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-left space-y-1 w-full">
              <div className="text-xs font-bold text-cyan-300">
                Үнэнч Банхар: "Амжина аа, тайван бичээрэй!"
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Хурдаас илүү зөв бичих нь чухал. Git болон Линукс төслийн файлуудыг Банхар найз нь найдвартай хамгаалж байна.
              </p>
            </div>
          </TiltCard>

        </div>

      </div>

      {/* Bottom HUD stats strip matching Screen 4 */}
      <div className="rounded-2xl glass-card p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs shadow-lg">
        <div className="flex items-center gap-6 font-semibold">
          <span className="text-slate-300 font-mono text-sm">42 үг/мин</span>
          <span className="text-emerald-400 font-mono text-sm">96% зөв</span>
          <span className="text-purple-300 font-mono text-sm">{streakCount} дараалсан зөв команд</span>
          <span className="text-amber-300 font-mono text-sm">780 оноо</span>
        </div>

        <div className="text-xs text-slate-400">
          Дараагийнх: <span className="font-mono text-cyan-300">{currentExercise.nextCmd}</span>
        </div>
      </div>

    </div>
  );
};
