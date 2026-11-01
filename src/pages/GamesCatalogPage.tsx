import React, { useState, useMemo } from 'react';
import { PageType, UserProgress } from '../types';
import { UNIVERSE_GAMES, GAME_CATEGORIES, GameCategory, UniverseGame } from '../data/gamesUniverse';
import { Play, Search, Code2, Clock, Sparkles, Filter, Swords, Zap, Check } from 'lucide-react';
import { sound } from '../lib/sound';
import { TiltCard } from '../components/TiltCard';
import { MongolianZodiacMascot } from '../components/MongolianZodiacMascot';
import { UlziiKhee, AlkhanKheeBorder, ToonoRing } from '../components/MongolianOrnaments';
import { GameModalContainer } from '../components/games/GameModalContainer';
import { motion, AnimatePresence } from 'motion/react';

interface GamesCatalogPageProps {
  onNavigate: (page: PageType) => void;
  progress: UserProgress;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const GamesCatalogPage: React.FC<GamesCatalogPageProps> = ({
  onNavigate,
  progress,
  onUpdateProgress = () => {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Бүгд' | 'Хялбар' | 'Дунд' | 'Ахисан'>('Бүгд');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGameModal, setActiveGameModal] = useState<UniverseGame | null>(null);

  const filteredGames = useMemo(() => {
    return UNIVERSE_GAMES.filter((g) => {
      // Category filter
      if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
      // Difficulty filter
      if (selectedDifficulty !== 'Бүгд' && g.difficulty !== selectedDifficulty) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = g.title.toLowerCase().includes(q) || g.mongolianTitle.toLowerCase().includes(q);
        const matchDesc = g.description.toLowerCase().includes(q);
        const matchTags = g.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const featuredGame = UNIVERSE_GAMES[0]; // Endless runner

  const handleLaunchGame = (game: UniverseGame) => {
    sound.playKeyTick(1.3);
    sound.playLaserShot();
    setActiveGameModal(game);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header with Ulzii branding */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UlziiKhee size={16} color="gold" />
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-mono">
              ИХ ЕРТӨНЦИЙН ТОГЛООМЫН САН · 24+ ТОГЛООМ
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Өнөөдөр юуг байлдан дагуулах вэ?</span>
            <ToonoRing size={28} color="cyan" className="hidden sm:inline-block" />
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Action & Arcade, Оньс, Программчлал, Инженер, Стратеги, 1v1 тулаан зэрэг 6 чиглэлээр 12 жилийн сахиус амьтдын хамт тоглож ур чадвараа ахиул.
          </p>
        </div>

        {/* Global Leaderboard Shortcut */}
        <button
          onClick={() => {
            const leaderboardGame = UNIVERSE_GAMES.find((g) => g.id === 'global_leaderboard');
            if (leaderboardGame) handleLaunchGame(leaderboardGame);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-bold font-mono transition-all cursor-pointer shadow-lg self-start sm:self-auto"
        >
          <Swords className="w-4 h-4 text-amber-400" />
          <span>Дэлхийн Чансаа</span>
        </button>
      </motion.div>

      {/* Featured Hero Game Card */}
      <TiltCard
        glowColor="cyan"
        onClick={() => handleLaunchGame(featuredGame)}
        className="relative overflow-hidden rounded-3xl glass-card-active p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/20 border border-cyan-400/40 cursor-pointer shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 opacity-40">
          <AlkhanKheeBorder color="cyan" height={6} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-1">
          <div className="max-w-xl space-y-3.5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Онцлох Тоглоом · Action & Arcade
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {featuredGame.mongolianTitle}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {featuredGame.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
                <Code2 className="w-4 h-4" />
                {featuredGame.difficulty}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {featuredGame.duration}
              </span>
              <span>·</span>
              <span className="text-amber-300 font-bold">
                +{featuredGame.xpReward} XP
              </span>
            </div>

            <div className="pt-2">
              <button className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-400/30 transition-all cursor-pointer hover:bg-cyan-300">
                ШУУД ТОГЛОХ
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Right Mascot Artwork */}
          <div className="relative w-48 sm:w-56 h-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/25 rounded-full blur-2xl pointer-events-none" />
            <MongolianZodiacMascot
              zodiacId={featuredGame.guardianZodiac}
              size="lg"
              mood="happy"
              enable3DRotation={true}
              render3D={true}
              showAura={true}
            />
          </div>
        </div>
      </TiltCard>

      {/* Categories Bar & Search Toolbar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              sound.playKeyTick();
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25'
                : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>🌟</span>
            <span>Бүгд ({UNIVERSE_GAMES.length})</span>
          </button>

          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playKeyTick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25'
                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>
                {cat.name} ({cat.count})
              </span>
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Тоглоом, чадвар, рун хайх..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-all shadow"
            />
          </div>

          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 self-start sm:self-auto text-xs font-mono">
            {(['Бүгд', 'Хялбар', 'Дунд', 'Ахисан'] as const).map((d) => (
              <button
                key={d}
                onClick={() => {
                  sound.playKeyTick();
                  setSelectedDifficulty(d);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedDifficulty === d
                    ? 'bg-cyan-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, idx) => {
          const glowColor =
            game.difficulty === 'Хялбар'
              ? 'emerald'
              : game.difficulty === 'Ахисан'
              ? 'purple'
              : 'cyan';

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
            >
              <TiltCard
                glowColor={glowColor}
                onClick={() => handleLaunchGame(game)}
                className="relative h-full flex flex-col justify-between overflow-hidden rounded-3xl glass-card p-6 bg-slate-950/80 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all duration-300 shadow-xl group"
              >
                {/* Top Badge Row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-400">
                      {game.categoryName}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        game.difficulty === 'Хялбар'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                          : game.difficulty === 'Дунд'
                          ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40'
                          : 'border-purple-500/40 text-purple-400 bg-purple-950/40'
                      }`}
                    >
                      {game.difficulty}
                    </span>
                  </div>

                  {/* Character Icon & Title */}
                  <div className="flex items-start gap-3">
                    <MongolianZodiacMascot
                      zodiacId={game.guardianZodiac}
                      size="sm"
                      interactive={false}
                      showAura={false}
                      className="shrink-0 group-hover:scale-110 transition-transform"
                    />
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors uppercase leading-tight">
                        {game.mongolianTitle}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {game.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Info & Action */}
                <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300 font-bold">+{game.xpReward} XP</span>
                    <span>·</span>
                    <span>{game.duration}</span>
                  </div>

                  <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform font-bold">
                    Тоглох <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm text-slate-400 font-mono">
            Хайсан шалгуурт тохирох тоглоом олдсонгүй.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('Бүгд');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300 hover:text-white cursor-pointer"
          >
            Бүх шүүлтүүрийг арилгах
          </button>
        </div>
      )}

      {/* Active Game Modal */}
      <AnimatePresence>
        {activeGameModal && (
          <GameModalContainer
            game={activeGameModal}
            progress={progress}
            onClose={() => setActiveGameModal(null)}
            onUpdateProgress={onUpdateProgress}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
