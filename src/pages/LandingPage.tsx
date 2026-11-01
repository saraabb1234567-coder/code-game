import React from 'react';
import { PageType, UserProgress } from '../types';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ChevronRight, Play } from 'lucide-react';
import { sound } from '../lib/sound';
import { TiltCard } from '../components/TiltCard';
import { MongolianZodiacMascot } from '../components/MongolianZodiacMascot';
import { UlziiKhee, AlkhanKheeBorder, ToonoRing } from '../components/MongolianOrnaments';

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, progress }) => {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden">
      {/* Subtle Mongolian Alkhan top accent */}
      <div className="absolute top-0 left-0 right-0 opacity-20 pointer-events-none">
        <AlkhanKheeBorder color="cyan" height={5} />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Typography & CTAs with Staggered Motion */}
        <div className="max-w-xl text-left space-y-6 lg:space-y-8 z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-semibold tracking-wide shadow-lg shadow-cyan-950/40"
          >
            <UlziiKhee size={16} color="gold" />
            <span>Монгол 12 Жилийн Боловсролын Кибер Ертөнц</span>
          </motion.div>

          {/* Headline with cinematic glow */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]"
          >
            ТОГЛОЖ СУРААД,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
              ИРЭЭДҮЙГ БҮТЭЭ.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg font-medium"
          >
            Монголын үндэсний соёл, 12 жилийн сахиус амьтадтайгаа хамт программчлал, AI, роботик, автоматжуулалтыг бодит кодын тоглоомоор эзэмш.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(34,211,238,0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sound.playKeyTick(1.2);
                onNavigate('shooter');
              }}
              className="px-7 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-cyan-400/25 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              ТОГЛООМ ЭХЛҮҮЛЭХ
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sound.playKeyTick();
                onNavigate('companions');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#141a2e]/90 hover:bg-[#1a233d] border border-white/15 text-white font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              12 ЖИЛИЙГ ҮЗЭХ
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
          </motion.div>

          {/* Mini Footnote Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-xs text-slate-400 font-medium"
          >
            <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">
              ⌨
            </div>
            Жинхэнэ гар дээр код бич. 12 жилийн сахиус амьтадтайгаа хамтар.
          </motion.div>
        </div>

        {/* Right Column: 3D Mongolian 12 Zodiac Mascot Arena Showcase with Toono Halo */}
        <div className="relative w-full max-w-lg lg:max-w-xl h-[420px] sm:h-[480px] flex items-center justify-center">
          {/* Orbital Mongolian Toono Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <ToonoRing size={460} spinning color="cyan" />
          </div>

          {/* 12 Zodiac Mascot Hero Composition */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 w-full h-full flex items-center justify-center"
          >
            {/* Center Main Hero (Зоригт Бар) */}
            <div className="relative z-20 flex flex-col items-center">
              <MongolianZodiacMascot
                zodiacId="bar"
                mood="idle"
                size="xl"
                enable3DRotation={true}
                showAura={true}
              />

              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, repeat: Infinity, repeatType: 'reverse', duration: 4 }}
                className="mt-3 px-4 py-2 rounded-2xl bg-slate-900/95 border border-cyan-400/40 text-xs font-bold text-cyan-200 shadow-xl backdrop-blur-md cursor-pointer hover:border-cyan-300 transition-all hover:scale-105"
                onClick={() => {
                  sound.playKeyTick();
                  onNavigate('shooter');
                }}
              >
                Зоригтойгоор кодоо харвахад бэлэн үү? 🚀
              </motion.div>
            </div>

            {/* Orbiting Zodiac Companion 1 (Сүрлэг Луу - Top Right) */}
            <div className="absolute -top-2 right-4 z-10 hidden sm:block">
              <MongolianZodiacMascot
                zodiacId="luu"
                mood="happy"
                size="md"
                interactive={true}
                showAura={false}
              />
            </div>

            {/* Orbiting Zodiac Companion 2 (Сэргэлэн Туулай - Top Left) */}
            <div className="absolute -top-4 left-4 z-10 hidden sm:block">
              <MongolianZodiacMascot
                zodiacId="tuulai"
                mood="happy"
                size="sm"
                interactive={true}
                showAura={false}
              />
            </div>

            {/* Orbiting Zodiac Companion 3 (Үнэнч Банхар - Bottom Right) */}
            <div className="absolute bottom-4 right-2 z-10 hidden sm:block">
              <MongolianZodiacMascot
                zodiacId="nokhoi"
                mood="idle"
                size="md"
                interactive={true}
                showAura={false}
              />
            </div>

            {/* Orbiting Zodiac Companion 4 (Овсгоотой Хулгана - Bottom Left) */}
            <div className="absolute bottom-6 left-2 z-10 hidden sm:block">
              <MongolianZodiacMascot
                zodiacId="khulgana"
                mood="dance"
                size="sm"
                interactive={true}
                showAura={false}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Metrics Bar with 3D Tilt Cards */}
      <div className="border-t border-white/10 bg-[#0a1024]/85 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-center">
          <TiltCard glowColor="cyan" className="p-3 bg-transparent">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1.5">
              <span>12</span>
              <UlziiKhee size={18} color="cyan" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Монгол 12 жилийн сахиус</div>
          </TiltCard>

          <TiltCard glowColor="purple" className="p-3 bg-transparent">
            <div className="text-2xl sm:text-3xl font-black text-white">7</div>
            <div className="text-xs text-slate-400 font-medium">Монгол тоглоомын ертөнц</div>
          </TiltCard>

          <TiltCard glowColor="amber" className="p-3 bg-transparent">
            <div className="text-2xl sm:text-3xl font-black text-white">10</div>
            <div className="text-xs text-slate-400 font-medium">Бодит төсөл хүртэлх шат</div>
          </TiltCard>

          {/* Next action card with interactive pulse */}
          <TiltCard
            glowColor="cyan"
            onClick={() => {
              sound.playKeyTick(1.2);
              onNavigate('shooter');
            }}
            className="col-span-2 sm:col-span-1 p-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/35 hover:border-cyan-400/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                Чиний дараагийн алхам
              </div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Python · 7-р даалгавар
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};
