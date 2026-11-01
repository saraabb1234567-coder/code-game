import React, { useState } from 'react';
import { PageType, UserProgress } from '../types';
import { COMPANIONS_DATA } from '../data/mockData';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Settings } from 'lucide-react';
import { sound } from '../lib/sound';
import { SettingsModal } from './SettingsModal';
import { UlziiKhee, AlkhanKheeBorder } from './MongolianOrnaments';
import { MongolianZodiacMascot } from './MongolianZodiacMascot';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  progress,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getSfxMuted());

  const activeCompanion =
    COMPANIONS_DATA.find((c) => c.id === progress.activeCompanionId) || COMPANIONS_DATA[0];

  const handleToggleSound = () => {
    const next = !isMuted;
    sound.setSfxMuted(next);
    setIsMuted(next);
    if (!next) {
      sound.playKeyTick(1.2);
    }
  };

  const navItems = [
    { id: 'catalog' as PageType, label: 'Тоглоомууд' },
    { id: 'roadmap' as PageType, label: 'Миний замнал' },
    { id: 'companions' as PageType, label: '12 Жил · Цуглуулга' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070b19]/85 backdrop-blur-xl transition-all">
        {/* Subtle Mongolian Alkhan top border */}
        <div className="absolute top-0 left-0 right-0 opacity-25">
          <AlkhanKheeBorder color="cyan" height={4} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo with dynamic glowing badge and Ulzii emblem */}
          <button
            onClick={() => {
              sound.playKeyTick(1.1);
              onNavigate('landing');
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer transition-transform active:scale-95"
          >
            <div className="relative w-8 h-8 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-400/40 group-hover:bg-cyan-300 group-hover:shadow-cyan-400/60 transition-all">
              <UlziiKhee size={20} color="white" />
              <div className="absolute inset-0 rounded-lg bg-cyan-400 animate-ping opacity-25 pointer-events-none" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white uppercase group-hover:text-cyan-300 transition-colors block leading-tight">
                FUTURE LAB
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase hidden sm:block">
                Монгол 12 Жилийн Кибер Ертөнц
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links with animated indicator */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playKeyTick();
                    onNavigate(item.id);
                  }}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-400/40 shadow-md shadow-cyan-400/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right side: Audio, Settings & Active 12 Zodiac Companion Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Quick sound toggle */}
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Дууг нээх' : 'Дууг хаах'}
              className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-pointer active:scale-95"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Settings modal trigger */}
            <button
              onClick={() => {
                sound.playKeyTick();
                setSettingsOpen(true);
              }}
              title="Тохиргоо"
              className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-pointer active:scale-95"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Info with Active 12 Zodiac Companion mini 3D Mascot */}
            <button
              onClick={() => {
                sound.playKeyTick();
                onNavigate('companions');
              }}
              title="Хамтрагчаа өөрчлөх"
              className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full bg-slate-900/90 border border-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-950/40 transition-all cursor-pointer text-right group active:scale-95"
            >
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors flex items-center justify-end gap-1">
                  <span>{activeCompanion.mongolianName}</span>
                </div>
                <div className="text-[10px] text-cyan-400/80 leading-tight font-mono">
                  {activeCompanion.zodiacYearName} · Түвшин {activeCompanion.level}
                </div>
              </div>

              <div className="relative w-8 h-8 rounded-full bg-slate-800 border border-cyan-400/50 flex items-center justify-center overflow-hidden shadow-sm">
                <MongolianZodiacMascot
                  zodiacId={activeCompanion.zodiacId}
                  mood="idle"
                  size="sm"
                  showAura={false}
                  showOrnaments={false}
                  interactive={false}
                  className="w-8 h-8 scale-75"
                />
              </div>
            </button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#070b19]/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-lg">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playKeyTick();
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-400/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={onToggleReducedMotion}
      />
    </>
  );
};
