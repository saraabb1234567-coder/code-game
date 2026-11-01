import React, { useState } from 'react';
import { UniverseGame } from '../../data/gamesUniverse';
import { UserProgress } from '../../types';
import { sound } from '../../lib/sound';
import { MongolianZodiacMascot } from '../MongolianZodiacMascot';
import { UlziiKhee, AlkhanKheeBorder, ToonoRing } from '../MongolianOrnaments';
import { EndlessRunnerGame } from './EndlessRunnerGame';
import { SpaceShooterMiniGame } from './SpaceShooterMiniGame';
import { CircuitLogicGame } from './CircuitLogicGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { PythonChallengeGame } from './PythonChallengeGame';
import { SpeedCodeBattleGame } from './SpeedCodeBattleGame';
import { CyberQuizGame } from './CyberQuizGame';
import { GlobalLeaderboardView } from './GlobalLeaderboardView';
import { X, Sparkles, Trophy, RotateCcw, Volume2, HelpCircle, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameModalContainerProps {
  game: UniverseGame;
  progress: UserProgress;
  onClose: () => void;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const GameModalContainer: React.FC<GameModalContainerProps> = ({
  game,
  progress,
  onClose,
  onUpdateProgress,
}) => {
  const [difficulty, setDifficulty] = useState<'Хялбар' | 'Дунд' | 'Ахисан'>(game.difficulty);
  const [showInstructions, setShowInstructions] = useState(false);
  const [completedState, setCompletedState] = useState<{
    score: number;
    xpEarned: number;
  } | null>(null);

  const handleGameOver = (score: number, xpEarned: number) => {
    sound.playVictory();
    sound.playCombo(3);
    setCompletedState({ score, xpEarned });

    // Update real user progress
    onUpdateProgress((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
      score: prev.score + score,
      streak: prev.streak + 1,
      completedTasksCount: prev.completedTasksCount + 1,
    }));
  };

  // Render specific game component or suitable category engine
  const renderGameContent = () => {
    switch (game.id) {
      case 'endless_runner':
      case 'platformer':
      case 'survival_arena':
        return <EndlessRunnerGame onGameOver={handleGameOver} difficulty={difficulty} />;

      case 'space_shooter':
      case 'boss_battle':
      case 'tower_defense':
        return <SpaceShooterMiniGame onGameOver={handleGameOver} difficulty={difficulty} />;

      case 'circuit_logic':
      case 'cyber_sudoku':
      case 'pattern_recognition':
      case 'escape_room':
        return <CircuitLogicGame onGameOver={handleGameOver} difficulty={difficulty} />;

      case 'memory_match':
      case 'word_puzzle':
        return <MemoryMatchGame onGameOver={handleGameOver} difficulty={difficulty} />;

      case 'python_challenge':
      case 'code_runner':
      case 'javascript_battle':
      case 'debugging_game':
      case 'algorithm_puzzle':
      case 'terminal_simulator':
      case 'build_ai_agent':
      case 'robot_programming':
        return <PythonChallengeGame onGameOver={handleGameOver} difficulty={difficulty} />;

      case 'speed_code_battle':
        return <SpeedCodeBattleGame onGameOver={handleGameOver} difficulty={difficulty} />;

      case 'cyber_quiz':
      case 'physics_lab':
      case 'drone_simulator':
      case 'steppe_city_builder':
      case 'resource_management':
        return <CyberQuizGame onGameOver={handleGameOver} difficulty={difficulty} />;

      case 'global_leaderboard':
        return <GlobalLeaderboardView progress={progress} />;

      default:
        return <EndlessRunnerGame onGameOver={handleGameOver} difficulty={difficulty} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-cyan-400/40 shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Top Mongolian Alkhan Border */}
        <div className="w-full opacity-60">
          <AlkhanKheeBorder color="cyan" height={6} />
        </div>

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <MongolianZodiacMascot
              zodiacId={game.guardianZodiac}
              size="sm"
              interactive={false}
              showAura={false}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  {game.categoryName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/30">
                  +{game.xpReward} XP
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>{game.mongolianTitle}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Difficulty Selector */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
              {(['Хялбар', 'Дунд', 'Ахисан'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    sound.playKeyTick();
                    setDifficulty(d);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-cyan-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                sound.playKeyTick();
                setShowInstructions(!showInstructions);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="Заавар харах"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playKeyTick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Хаах"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instructions Banner (Collapsible) */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/10 bg-slate-950/90 px-6 py-3 text-xs text-slate-300 space-y-1 font-mono"
            >
              <div>
                <strong className="text-cyan-300">Даалгавар:</strong> {game.instructions}
              </div>
              <div>
                <strong className="text-amber-300">Удирдлага:</strong> {game.controls}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Play Area */}
        <div className="p-4 sm:p-8 flex-1 flex flex-col items-center justify-center bg-[#070b19] min-h-[420px]">
          {renderGameContent()}
        </div>

        {/* Victory / Rewards Overlay */}
        {completedState && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-5">
            <div className="relative">
              <ToonoRing size={90} color="gold" spinning />
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                ДААЛГАВАР АМЖИЛТТАЙ!
              </h3>
              <p className="text-xs text-slate-300">
                12 жилийн сахиус амьтад чиний ур чадварыг сайшаан шагнаж байна.
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((star) => (
                <Star key={star} className="w-6 h-6 text-amber-400 fill-amber-400" />
              ))}
            </div>

            {/* Earned XP pill */}
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 text-sm font-mono">
              <div className="text-cyan-300 font-bold">
                Оноо: <strong className="text-white font-black">{completedState.score}</strong>
              </div>
              <div className="text-slate-600">|</div>
              <div className="text-amber-300 font-bold">
                Авсан шагнал: <strong className="text-white font-black">+{completedState.xpEarned} XP</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCompletedState(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Дахин тоглох
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-lg shadow-cyan-400/30 flex items-center gap-1.5"
              >
                Цааш Үргэлжлүүлэх <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
