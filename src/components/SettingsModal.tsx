import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../lib/sound';
import { Volume2, VolumeX, Music, Sparkles, X, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [sfxMuted, setSfxMuted] = useState(sound.getSfxMuted());
  const [musicMuted, setMusicMuted] = useState(sound.getMusicMuted());

  if (!isOpen) return null;

  const handleToggleSfx = () => {
    const next = !sfxMuted;
    sound.setSfxMuted(next);
    setSfxMuted(next);
    if (!next) sound.playKeyTick(1.2);
  };

  const handleToggleMusic = () => {
    const next = !musicMuted;
    sound.setMusicMuted(next);
    setMusicMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-3xl glass-card-active p-6 sm:p-7 border border-cyan-400/40 space-y-6 shadow-2xl shadow-cyan-950/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
              ⚙
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Тохиргоо (Settings)
              </h3>
              <p className="text-[11px] text-slate-400">
                Тоглоомын дуу болон визуал эффектүүдийг тохируулах
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playKeyTick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setting Options */}
        <div className="space-y-4">
          
          {/* SFX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                {sfxMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-bold text-white">Дууны эффект (SFX)</div>
                <div className="text-[11px] text-slate-400">Гар даралт, лазер, дэлбэрэлт, комбо дуу</div>
              </div>
            </div>

            <button
              onClick={handleToggleSfx}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                !sfxMuted ? 'bg-cyan-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  !sfxMuted ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Ambient Cosmic Music Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Сансрын хөгжим (Ambient BGM)</div>
                <div className="text-[11px] text-slate-400">Арын намуухан синтезатор аялгуу</div>
              </div>
            </div>

            <button
              onClick={handleToggleMusic}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                !musicMuted ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  !musicMuted ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Хөдөлгөөнийг багасгах</div>
                <div className="text-[11px] text-slate-400">Screen shake, хурдан эффектийг зөөлрүүлэх</div>
              </div>
            </div>

            <button
              onClick={onToggleReducedMotion}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                reducedMotion ? 'bg-emerald-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              sound.playKeyTick();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            ХААХ
          </button>
        </div>
      </motion.div>
    </div>
  );
};
