import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType, UserProgress } from '../types';
import { sound } from '../lib/sound';
import { TiltCard } from '../components/TiltCard';
import { AnimatedMascot } from '../components/AnimatedMascot';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle2,
  MessageSquare,
  Bot,
  FileJson,
  GitFork,
  Sparkles,
  Cpu,
  RefreshCw,
  Terminal as TerminalIcon,
} from 'lucide-react';

interface AiAgentPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
}

export const AiAgentPage: React.FC<AiAgentPageProps> = ({ onNavigate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [typedOutput, setTypedOutput] = useState<string>('');
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'dance' | 'sad'>('idle');

  const steps = [
    {
      id: 0,
      title: 'Оролт',
      subtitle: 'Шинэ мессеж хүлээн авах',
      icon: MessageSquare,
      color: 'cyan',
    },
    {
      id: 1,
      title: 'AI агент',
      subtitle: 'Зорилго ба ангиллыг таних',
      icon: Bot,
      color: 'purple',
    },
    {
      id: 2,
      title: 'JSON үүсгэлт',
      subtitle: 'Бүтцийг шалгаж бэлтгэх',
      icon: FileJson,
      color: 'amber',
    },
    {
      id: 3,
      title: 'Үр дүн',
      subtitle: 'Тусламжийн дараалалд илгээх',
      icon: GitFork,
      color: 'emerald',
    },
  ];

  const fullJsonOutput = `{
  "category": "support",
  "priority": "normal",
  "route": "helpdesk",
  "confidence": 0.98,
  "status": "dispatched"
}`;

  const handleRunWorkflow = () => {
    if (isRunning) return;
    sound.playKeyTick(1.2);
    setIsRunning(true);
    setDispatched(false);
    setTypedOutput('');
    setActiveStep(1);
    setMascotMood('idle');

    setTimeout(() => {
      setActiveStep(2);
      sound.playLaserShot();
    }, 400);

    setTimeout(() => {
      setActiveStep(3);
      sound.playLaserShot();
      
      // Simulate rapid streaming typing of the JSON
      let index = 0;
      const interval = setInterval(() => {
        index += 6;
        if (index >= fullJsonOutput.length) {
          setTypedOutput(fullJsonOutput);
          clearInterval(interval);
          setIsRunning(false);
          setDispatched(true);
          setMascotMood('dance');
          sound.playCombo(2);
          sound.playVictory();
        } else {
          setTypedOutput(fullJsonOutput.slice(0, index));
          sound.playKeyTick(1.5);
        }
      }, 30);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Breadcrumbs matching Screen 10 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playKeyTick();
              onNavigate('catalog');
            }}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              8-Р ШАТ · 4-Р ДААЛГАВАР · УРЬДЧИЛАН ҮЗЭХ
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playKeyTick();
            onNavigate('roadmap');
          }}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
        >
          <span>Миний замнал руу буцах</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          Нэг мессежээс ухаалаг урсгал руу.
          <Sparkles className="w-6 h-6 text-amber-400 hidden sm:inline" />
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          AI агент хэрэглэгчийн мессежийн зорилгыг гүн ойлгож, автоматаар зөв бүтцэд оруулж дараагийн системд JSON өгөгдөл найдвартай дамжуулна.
        </p>
      </motion.div>

      {/* 4-Step Interactive Pipeline Flow Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md"
      >
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          const isDone = activeStep > step.id || dispatched;
          
          return (
            <button
              key={step.id}
              onClick={() => {
                sound.playKeyTick();
                setActiveStep(step.id);
              }}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-950/70 border-cyan-400/80 shadow-lg shadow-cyan-500/20 text-cyan-300'
                  : isDone
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-black text-white truncate flex items-center gap-1.5">
                  {step.title}
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-normal">
                  {step.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Main Content 2-column Grid matching Screen 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Request Prompt & Mascot Note */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Incoming message card */}
          <TiltCard
            maxTilt={6}
            className="p-5 rounded-2xl glass-card border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                Хүсэлтийг зөв багт хүргэ
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                LIVE
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                ИРСЭН МЕССЕЖ (USER INPUT)
              </span>
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-400/30 text-white font-medium text-sm flex items-center justify-between shadow-inner">
                <span>"Нууц үгээ сэргээхэд туслаач."</span>
                <span className="text-xs text-cyan-400">👤</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Агентын заавар: мессежийг <code className="text-cyan-300 font-mono bg-cyan-950/50 px-1 py-0.5 rounded">support</code>, <code className="text-cyan-300 font-mono bg-cyan-950/50 px-1 py-0.5 rounded">sales</code> эсвэл <code className="text-cyan-300 font-mono bg-cyan-950/50 px-1 py-0.5 rounded">other</code> гэж ангил. Зөвхөн category, priority, route талбартай JSON буцаа.
            </p>

            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>↳ Тусламжийн Helpdesk дараалалд автоматаар нэмэгдэнэ.</span>
            </div>
          </TiltCard>

          {/* Mascot Sarguul note with interactive 3D Mascot */}
          <TiltCard
            maxTilt={6}
            className="p-4 rounded-2xl glass-card border border-purple-500/30 space-y-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex-shrink-0 relative">
                <AnimatedMascot
                  zodiacId="mogoi"
                  name="Цэцэн Могой"
                  mood={mascotMood}
                  size="sm"
                  enable3DRotation
                  className="w-16 h-16"
                />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>Цэцэн Могой багшийн зөвлөгөө</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/50 text-emerald-200">
                    AI Mentor
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  "JSON түлхүүр ба текст утгыг заавал давхар хашилтад бичнэ. Сүүлийн талбарын ард илүү таслал тавихгүй байхыг анхаараарай!"
                </p>
              </div>
            </div>

            {/* Quick interactive mood triggers */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  sound.playKeyTick();
                  setMascotMood('happy');
                }}
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-purple-900/60 text-purple-200 cursor-pointer"
              >
                Баярлах ✨
              </button>
              <button
                onClick={() => {
                  sound.playLaserShot();
                  setMascotMood('dance');
                }}
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-purple-900/60 text-purple-200 cursor-pointer"
              >
                Бүжиглэх 🎵
              </button>
            </div>
          </TiltCard>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-white/5 text-[11px] text-slate-400">
            8-р шатны AI агентын бүрэн симуляц. Код болон JSON загварыг туршиж үзээд 'ТУРШИХ' товч дарснаар үр дүнг шалгана уу.
          </div>
        </motion.div>

        {/* Right Column: JavaScript Code & Structured JSON output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* JavaScript API Call Block */}
          <TiltCard
            maxTilt={4}
            className="rounded-2xl glass-card overflow-hidden border border-white/10"
          >
            <div className="px-4 py-3 bg-[#090e24] border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-200 font-mono">
                  JavaScript · Дасгалын API дуудлага
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/30 text-cyan-300 font-mono">
                node / agent.ts
              </span>
            </div>

            <div className="p-5 font-mono text-xs sm:text-sm bg-slate-950/95 text-slate-200 overflow-x-auto space-y-1.5 leading-relaxed">
              <div className="text-slate-400">
                <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> <span className="text-cyan-400 font-bold">fetch</span>(<span className="text-emerald-400">"/api/classify"</span>, {'{'}
              </div>
              <div className="pl-6 text-slate-300">
                method: <span className="text-emerald-400">"POST"</span>,
              </div>
              <div className="pl-6 text-slate-300">
                headers: {'{'} <span className="text-emerald-400">"Content-Type"</span>: <span className="text-emerald-400">"application/json"</span> {'}'},
              </div>
              <div className="pl-6 text-slate-300">
                body: JSON.<span className="text-cyan-400">stringify</span>({'{'}
              </div>
              <div className="pl-12 text-slate-300">
                message: <span className="text-emerald-400">"Нууц үгээ сэргээхэд туслаач."</span>,
              </div>
              <div className="pl-12 text-slate-300">
                categories: [<span className="text-emerald-400">"support"</span>, <span className="text-emerald-400">"sales"</span>, <span className="text-emerald-400">"other"</span>]
              </div>
              <div className="pl-6 text-slate-300">{'}'})</div>
              <div className="text-slate-400">{'}'});</div>
              <div className="text-slate-400">
                <span className="text-purple-400">const</span> result = <span className="text-purple-400">await</span> response.<span className="text-cyan-400">json</span>();
              </div>
              <div className="text-slate-400">
                console.<span className="text-cyan-400">log</span>(result);
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Агентын урсгалыг туршиж, бодит хугацаанд JSON бүтэц үүсгэх:
              </span>
              <button
                onClick={handleRunWorkflow}
                disabled={isRunning}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
                  isRunning
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Анализ хийж байна...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>ТУРШИЖ ҮЗЭХ</span>
                  </>
                )}
              </button>
            </div>
          </TiltCard>

          {/* Structured JSON Output Block */}
          <TiltCard
            maxTilt={3}
            className="p-5 rounded-2xl bg-[#06171b]/90 border border-cyan-500/40 space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                ХҮЛЭЭГДЭЖ БУЙ ГАРАЛТ (STRUCTURED JSON)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">schema: v1.2</span>
            </div>

            <pre className="font-mono text-xs sm:text-sm text-emerald-300 bg-slate-950/80 p-4 rounded-xl border border-emerald-500/20 overflow-x-auto min-h-[120px] shadow-inner leading-relaxed">
              {isRunning
                ? typedOutput || '// AI агент өгөгдлийг задалж байна...'
                : dispatched
                ? fullJsonOutput
                : `{
  "category": "support",
  "priority": "normal",
  "route": "helpdesk"
}`}
            </pre>

            <AnimatePresence>
              {dispatched && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs text-emerald-400 font-semibold p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Амжилттай: AI агент мессежийг 98% магадлалтайгаар "support" ангилалд багтааж тусламжийн дараалал руу чиглүүллээ!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>
        </motion.div>
      </div>

      {/* Bottom Bar matching Screen 10 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="text-xs text-slate-400">
          <span className="font-bold text-white">1 / 4 алхам</span> · Оролтоо ойлголоо &nbsp;|&nbsp; Ангилал → Зөв JSON → Зөв чиглэл
        </div>

        <button
          onClick={() => {
            sound.playKeyTick();
            onNavigate('roadmap');
          }}
          className="px-6 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md"
        >
          МИНИЙ ЗАМНАЛ РУУ
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
