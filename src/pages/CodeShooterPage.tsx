import React, { useState, useEffect, useRef } from 'react';
import { PageType, UserProgress, TargetEnemy, MongolianRealmId } from '../types';
import { INITIAL_SHOOTER_TARGETS, COMPANIONS_DATA } from '../data/mockData';
import { MONGOLIAN_REALMS } from '../data/mongolianRealms';
import { sound } from '../lib/sound';
import {
  ArrowLeft,
  Heart,
  Pause,
  Play,
  Sparkles,
  CornerDownLeft,
  ShieldAlert,
  RotateCcw,
  Zap,
  Target,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CodeCrystalTarget } from '../components/CodeCrystalTarget';
import { ParticleExplosion, ExplosionTrigger } from '../components/ParticleExplosion';
import { MongolianZodiacMascot } from '../components/MongolianZodiacMascot';
import { UlziiKhee, AlkhanKheeBorder, ToonoRing } from '../components/MongolianOrnaments';
import { MascotAnimationState } from '../types';

interface CodeShooterPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  reducedMotion?: boolean;
}

export const CodeShooterPage: React.FC<CodeShooterPageProps> = ({
  onNavigate,
  progress,
  onUpdateProgress,
  reducedMotion = false,
}) => {
  // Wave & Realm state
  const [currentWave, setCurrentWave] = useState(1);
  const [activeRealmId, setActiveRealmId] = useState<MongolianRealmId>('tenger');
  const [countdownNumber, setCountdownNumber] = useState<number | null>(3);
  const [targets, setTargets] = useState<TargetEnemy[]>(INITIAL_SHOOTER_TARGETS);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(102); // 01:42
  const [laserFiring, setLaserFiring] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [comboLevel, setComboLevel] = useState(1);
  const [explosions, setExplosions] = useState<ExplosionTrigger[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [coPilotMood, setCoPilotMood] = useState<MascotAnimationState>('idle');
  const [coPilotQuote, setCoPilotQuote] = useState<string>('Командаа зөв харваарай!');

  // Stats tracking
  const [totalKeypresses, setTotalKeypresses] = useState(0);
  const [correctKeypresses, setCorrectKeypresses] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  // Active Companion
  const activeCompanion =
    COMPANIONS_DATA.find((c) => c.id === progress.activeCompanionId) || COMPANIONS_DATA[0];
  const activeRealm =
    MONGOLIAN_REALMS.find((r) => r.id === activeRealmId) || MONGOLIAN_REALMS[0];

  const activeTarget = targets[currentTargetIndex] || targets[0];
  const targetCode = activeTarget?.code || '';

  // Calculate live WPM & Accuracy
  const elapsedMinutes = Math.max((Date.now() - startTime) / 60000, 0.1);
  const currentWpm = Math.round(correctKeypresses / 5 / elapsedMinutes) || 44;
  const currentAccuracy =
    totalKeypresses > 0 ? Math.round((correctKeypresses / totalKeypresses) * 100) : 98;

  // Wave start countdown
  useEffect(() => {
    let count = 3;
    sound.playCountdown(false);
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        sound.playCountdown(false);
        setCountdownNumber(count);
      } else if (count === 0) {
        sound.playCountdown(true);
        setCountdownNumber(0);
      } else {
        clearInterval(interval);
        setCountdownNumber(null);
        inputRef.current?.focus();
      }
    }, 800);

    return () => clearInterval(interval);
  }, [currentWave]);

  // Timer countdown
  useEffect(() => {
    if (isPaused || countdownNumber !== null || gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, countdownNumber, gameOver]);

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keep focus on input for typing capture
  useEffect(() => {
    const focusInput = () => {
      if (!isPaused && !gameOver && countdownNumber === null && inputRef.current) {
        inputRef.current.focus();
      }
    };
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, [isPaused, gameOver, countdownNumber]);

  // Handle typing input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPaused || gameOver || countdownNumber !== null) return;

    // Handle Backspace
    if (e.key === 'Backspace') {
      sound.playKeyTick(0.9);
      setTypedText((prev) => prev.slice(0, -1));
      return;
    }

    // Ignore non-printable keys
    if (e.key.length !== 1) return;

    const nextChar = e.key;
    const expectedChar = targetCode[typedText.length];

    setTotalKeypresses((prev) => prev + 1);

    if (nextChar === expectedChar) {
      // Correct character typed
      const pitchMultiplier = 1.0 + (typedText.length / Math.max(targetCode.length, 1)) * 0.4;
      sound.playKeyTick(pitchMultiplier);
      setCorrectKeypresses((prev) => prev + 1);
      const newTyped = typedText + nextChar;
      setTypedText(newTyped);

      // Check if current target completed
      if (newTyped.length === targetCode.length) {
        // Laser blast & explosion trigger!
        setLaserFiring(true);
        sound.playLaserShot();
        sound.playExplosion();

        const nextCombo = comboLevel >= 8 ? 16 : comboLevel >= 4 ? 8 : comboLevel >= 2 ? 4 : 2;
        setComboLevel(nextCombo);
        sound.playCombo(nextCombo / 2);

        // Co-pilot cheer
        setCoPilotMood('happy');
        setCoPilotQuote(activeCompanion.quotes.happy || 'Гайхалтай бичлээ!');

        // Spawn particle explosion
        const newExp: ExplosionTrigger = {
          id: `exp-${Date.now()}`,
          x: activeTarget.x,
          y: activeTarget.y,
          color: nextCombo >= 8 ? '#facc15' : nextCombo >= 4 ? '#38bdf8' : '#22d3ee',
          scoreText: `+${140 + nextCombo * 10} Оноо!`,
          comboText: `КОМБО ×${nextCombo}`,
        };
        setExplosions((prev) => [...prev, newExp]);

        // Increment user progress
        onUpdateProgress((prev) => {
          const newStreak = prev.streak + 1;
          const scoreDelta = 140 + nextCombo * 10;
          const xpDelta = 30;
          return {
            ...prev,
            score: prev.score + scoreDelta,
            xp: prev.xp + xpDelta,
            streak: newStreak,
            maxStreak: Math.max(prev.maxStreak, newStreak),
            wpm: currentWpm,
            accuracy: currentAccuracy,
          };
        });

        setTimeout(() => {
          setLaserFiring(false);

          // Advance to next target or next wave / victory
          if (currentTargetIndex + 1 < targets.length) {
            setCurrentTargetIndex((prev) => prev + 1);
            setTypedText('');
            sound.playLockOn();
          } else {
            // Check next wave
            if (currentWave < 2) {
              setCurrentWave((prev) => prev + 1);
              setCurrentTargetIndex(0);
              setTypedText('');
              setCountdownNumber(3);
              setCoPilotMood('victory');
              sound.playVictory();
            } else {
              // Level Victory! Confetti & fanfare
              confetti({
                particleCount: 160,
                spread: 100,
                origin: { y: 0.6 },
              });
              sound.playVictory();
              onNavigate('victory');
            }
          }
        }, 360);
      }
    } else {
      // Typo made!
      sound.playError();
      setComboLevel(1);
      setCoPilotMood('sad');
      setCoPilotQuote(activeCompanion.quotes.sad || 'Зүгээр ээ, дахин оролдоорой!');

      if (!reducedMotion) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 450);
      }

      onUpdateProgress((prev) => {
        const nextHearts = Math.max(0, prev.hearts - 1);
        if (nextHearts === 0) {
          setGameOver(true);
        }
        return {
          ...prev,
          hearts: nextHearts,
          streak: 0,
          lastErrorSnippet: {
            userTyped: typedText + nextChar,
            expected: targetCode,
            mistakeIndex: typedText.length,
            errorChar: nextChar,
            expectedChar: expectedChar || '',
            hint: `${activeTarget.language} код бичихдээ тэмдэгтүүдийг анхааралтай ажиглаарай.`,
          },
        };
      });
    }
  };

  const handleRestart = () => {
    sound.playKeyTick();
    setGameOver(false);
    setCurrentTargetIndex(0);
    setTypedText('');
    setTimeLeft(102);
    setComboLevel(1);
    setCountdownNumber(3);
    setCoPilotMood('idle');
    onUpdateProgress((prev) => ({ ...prev, hearts: 3 }));
  };

  const handleActivateZodiacPower = () => {
    if (comboLevel < 2) return;
    sound.playVictory();
    sound.playLaserShot();
    setCoPilotMood('level_up');
    setCoPilotQuote(`${activeCompanion.mongolianName}: "${activeCompanion.specialMove}" идэвхжлээ!`);
    onUpdateProgress((prev) => ({
      ...prev,
      score: prev.score + 250,
      xp: prev.xp + 50,
    }));
  };

  return (
    <div
      className={`relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden select-none transition-all ${
        isShaking ? 'translate-x-1.5 -translate-y-1' : ''
      }`}
      style={{
        background: `linear-gradient(180deg, #070b19 0%, ${activeRealm.accentColor}15 50%, #070b19 100%)`,
      }}
    >
      {/* Hidden input to capture physical keyboard input */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -top-10 left-0 w-1 h-1 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {/* Dynamic Screen Flash on Mistake */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 ${
          isShaking ? 'bg-rose-500/25 border-4 border-rose-500' : 'opacity-0'
        }`}
      />

      {/* Particle Explosions Canvas */}
      <ParticleExplosion
        explosions={explosions}
        onComplete={(id) => setExplosions((prev) => prev.filter((e) => e.id !== id))}
      />

      {/* Top HUD Header with Mongolian Ornaments */}
      <div className="border-b border-white/10 bg-[#080d21]/90 backdrop-blur-md px-4 sm:px-6 py-2.5 z-20 relative">
        <div className="absolute top-0 left-0 right-0 opacity-30">
          <AlkhanKheeBorder color="cyan" height={6} />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 pt-1">
          {/* Left: Back & Game Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playKeyTick();
                onNavigate('catalog');
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <UlziiKhee size={16} color="gold" />
                <span className="text-sm font-black text-white">Кодын харваач</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-mono">
                  {currentWave === 1 ? '12 Жилийн сорил · Wave 1' : 'Талстын мастер · Wave 2'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>3-р шат · {progress.xp} туршлага</span>
                <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${((currentTargetIndex + 1) / targets.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Live Score, Combo & Hearts */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Оноо
            </span>
            <span className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {progress.score.toLocaleString()}
              {comboLevel > 1 && (
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 animate-bounce">
                  КОМБО ×{comboLevel}
                </span>
              )}
            </span>

            {/* Health Hearts */}
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    heartIndex <= progress.hearts
                      ? 'text-pink-500 fill-pink-500 scale-100'
                      : 'text-slate-700 scale-75 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Realm Selector, Timer & Pause */}
          <div className="flex items-center gap-3">
            {/* Realm Selector Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-xl text-xs">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={activeRealmId}
                onChange={(e) => {
                  sound.playKeyTick();
                  setActiveRealmId(e.target.value as MongolianRealmId);
                }}
                className="bg-transparent text-slate-200 text-xs font-bold outline-none cursor-pointer"
              >
                {MONGOLIAN_REALMS.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 px-3 py-1 rounded-xl">
              <span className="text-xs font-mono font-bold text-cyan-300">
                ⏱ {formatTime(timeLeft)}
              </span>
              <button
                onClick={() => {
                  sound.playKeyTick();
                  setIsPaused(!isPaused);
                }}
                className="text-slate-400 hover:text-white cursor-pointer ml-1"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cosmic Battlefield Arena with 3D Orbital Rings & Toono Geometry */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Orbital Mongolian Toono Radar Rings in Sky */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <ToonoRing size={520} spinning color="cyan" />
        </div>

        {/* Floating 3D Code Crystals Targets */}
        <div className="relative w-full max-w-5xl h-[340px] sm:h-[400px]">
          {targets.map((target, idx) => (
            <CodeCrystalTarget
              key={target.id}
              target={target}
              isCurrent={idx === currentTargetIndex}
              typedLength={idx === currentTargetIndex ? typedText.length : 0}
              onClick={() => {
                if (idx !== currentTargetIndex) {
                  sound.playLockOn();
                  setCurrentTargetIndex(idx);
                  setTypedText('');
                }
              }}
            />
          ))}

          {/* Active 12 Zodiac Co-Pilot Mascot Console (Bottom Left of Arena) */}
          <div className="absolute left-2 sm:left-6 bottom-2 z-20 flex items-end gap-3 pointer-events-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center">
              <MongolianZodiacMascot
                zodiacId={activeCompanion.zodiacId}
                mood={coPilotMood}
                size="md"
                showAura={true}
                showOrnaments={false}
              />
            </div>

            <div className="space-y-1">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-400/30 text-[11px] text-cyan-200 max-w-[200px] shadow-lg">
                <span className="font-bold text-amber-300 block text-[10px]">
                  {activeCompanion.mongolianName}
                </span>
                <span>{coPilotQuote}</span>
              </div>

              {comboLevel >= 2 && (
                <button
                  onClick={handleActivateZodiacPower}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow-md shadow-amber-400/30 cursor-pointer animate-pulse"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  ШИДЭТ ХҮЧ АШИГЛАХ (+250)
                </button>
              )}
            </div>
          </div>

          {/* Combo Multiplier Meter in Arena */}
          {comboLevel > 1 && (
            <div className="absolute right-4 sm:right-16 top-16 flex flex-col items-end animate-pulse">
              <span className="text-cyan-300 text-lg sm:text-2xl font-black tracking-tight drop-shadow-[0_0_15px_#22d3ee]">
                +{30 * comboLevel} туршлага
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 fill-amber-300" />
                <span>
                  {progress.streak} ДАРААЛЛАА! ×{comboLevel}
                </span>
              </div>
            </div>
          )}

          {/* Player Ship / Delta Turret at Bottom Center */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            {/* Dynamic Cyan Laser Aiming Beam */}
            {activeTarget && (
              <svg className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[800px] h-[340px] pointer-events-none overflow-visible">
                <line
                  x1="400"
                  y1="340"
                  x2={400 + (activeTarget.x - 50) * 8}
                  y2={(activeTarget.y / 100) * 340}
                  stroke="#22d3ee"
                  strokeWidth={laserFiring ? '4.5' : '1.5'}
                  strokeDasharray={laserFiring ? 'none' : '5,5'}
                  strokeOpacity={laserFiring ? '1' : '0.45'}
                  filter="drop-shadow(0 0 8px #22d3ee)"
                />
              </svg>
            )}

            {/* Radar Turret Ring with Delta Ship */}
            <div className="relative w-16 h-16 rounded-full border-2 border-cyan-400/60 bg-[#091129]/95 flex items-center justify-center shadow-xl shadow-cyan-400/30">
              <div className="w-9 h-9 rounded-full border border-cyan-400/40 flex items-center justify-center bg-cyan-950/40">
                <span className="text-cyan-300 font-black text-sm">▲</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Terminal HUD & Typing Display */}
      <div className="border-t border-white/10 bg-[#070b1a]/95 backdrop-blur-xl px-4 sm:px-6 py-4 z-20 relative">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Status strip */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="text-[11px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              ЗӨВ БИЧИЖ БАЙНА · {currentTargetIndex + 1} / {targets.length}
            </span>
            <div className="flex items-center gap-4 font-semibold">
              <span className="text-slate-200">{currentWpm} үг/мин</span>
              <span>·</span>
              <span className="text-emerald-400">{currentAccuracy}% нарийвчлал</span>
              <span>·</span>
              <span className="text-amber-300 font-bold">+200 туршлага</span>
            </div>
          </div>

          {/* Big Terminal Command Display Box */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="group relative rounded-2xl bg-[#091026] border-2 border-cyan-400/60 p-4 sm:p-5 shadow-xl shadow-cyan-950/40 cursor-text flex items-center justify-between transition-all hover:border-cyan-400"
          >
            <div className="font-mono text-base sm:text-xl font-bold flex items-center flex-wrap gap-0.5">
              <span className="text-cyan-400 mr-2 select-none">&gt;</span>

              {/* Correctly typed characters in cyan */}
              <span className="text-cyan-300 font-bold">{typedText}</span>

              {/* Pulsing Caret Cursor */}
              <span className="inline-block w-2.5 h-5 bg-cyan-400 animate-cursor align-middle mx-0.5" />

              {/* Remaining expected characters in gray */}
              <span className="text-slate-500">{targetCode.slice(typedText.length)}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-400">
              <span>Командаа гүйцэтгээд</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>

          {/* Character Breakdown line */}
          <div className="hidden sm:flex items-center justify-center gap-3 font-mono text-xs text-slate-400 pt-1">
            {targetCode.split('').map((char, i) => {
              const isTyped = i < typedText.length;
              return (
                <div key={i} className="flex flex-col items-center">
                  <span className={isTyped ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                    {char === ' ' ? '␣' : char}
                  </span>
                  <span
                    className={`w-3.5 h-0.5 rounded-full mt-0.5 transition-colors ${
                      isTyped ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-700'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3..2..1..GO! Countdown Modal Overlay */}
      <AnimatePresence>
        {countdownNumber !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#070b19]/85 backdrop-blur-md z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              key={countdownNumber}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-2"
            >
              <div className="text-7xl sm:text-9xl font-black text-cyan-400 drop-shadow-[0_0_40px_#22d3ee]">
                {countdownNumber === 0 ? 'ХАРВА!' : countdownNumber}
              </div>
              <div className="text-sm font-bold text-amber-300 uppercase tracking-widest font-mono">
                {activeRealm.name} · {currentWave}-Р ШАТ
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#070b19]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full p-8 rounded-3xl bg-[#091026] border border-rose-500/40 shadow-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white uppercase">Цаг эсвэл амь дууслаа</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Зүгээр ээ, 12 жилийн сахиус чинь хамт байна. Дахин оролдоод амжилтаа ахиулаарай!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-around text-xs font-mono">
                <div>
                  <div className="text-slate-400">Цуглуулсан</div>
                  <div className="text-white font-bold text-base">{progress.score} Оноо</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <div className="text-slate-400">Хурд</div>
                  <div className="text-cyan-300 font-bold text-base">{currentWpm} WPM</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  ДАХИН ЭХЛЭХ
                </button>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-5 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-xs uppercase hover:border-cyan-400 cursor-pointer"
                >
                  Цэс рүү
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
