import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../lib/sound';
import { MongolianZodiacMascot } from '../MongolianZodiacMascot';
import { Sparkles, Trophy, Swords, Zap, Shield, RotateCcw } from 'lucide-react';

interface SpeedCodeBattleGameProps {
  onGameOver: (score: number, xpEarned: number) => void;
  difficulty?: 'Хялбар' | 'Дунд' | 'Ахисан';
}

const SNIPPETS = [
  'const energy = await system.charge(100);',
  'const filtered = array.filter(x => x > 0);',
  'import { Zodiac } from "@future/steppe";',
  'function launchRocket(thrust) { return thrust * 9.8; }',
];

export const SpeedCodeBattleGame: React.FC<SpeedCodeBattleGameProps> = ({
  onGameOver,
  difficulty = 'Дунд',
}) => {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const targetText = SNIPPETS[snippetIdx];
  const [userInput, setUserInput] = useState('');
  const [aiProgress, setAiProgress] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [aiHp, setAiHp] = useState(100);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [snippetIdx]);

  // AI Typing Simulation
  useEffect(() => {
    if (isBattleOver) return;

    const aiSpeed = difficulty === 'Хялбар' ? 350 : difficulty === 'Дунд' ? 220 : 160;
    const aiInterval = setInterval(() => {
      setAiProgress((prev) => {
        const next = prev + 1;
        if (next >= targetText.length) {
          // AI completed snippet first!
          sound.playError();
          setPlayerHp((hp) => {
            const nextHp = hp - 35;
            if (nextHp <= 0) {
              setIsBattleOver(true);
              setWinner('ai');
              onGameOver(100, 50);
            }
            return Math.max(0, nextHp);
          });
          // Reset to next snippet
          setTimeout(() => {
            setSnippetIdx((idx) => (idx + 1) % SNIPPETS.length);
            setUserInput('');
          }, 400);
          return 0;
        }
        return next;
      });
    }, aiSpeed);

    return () => clearInterval(aiInterval);
  }, [isBattleOver, targetText.length, difficulty, onGameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isBattleOver) return;
    const val = e.target.value;

    // Validate typing match
    if (targetText.startsWith(val)) {
      setUserInput(val);
      sound.playKeyTick(1.2 + val.length * 0.02);

      if (val === targetText) {
        // Player completed snippet first!
        sound.playCombo(3);
        sound.playLaserShot();
        setAiHp((hp) => {
          const nextHp = hp - 35;
          if (nextHp <= 0) {
            sound.playVictory();
            setIsBattleOver(true);
            setWinner('player');
            onGameOver(500, 320);
          }
          return Math.max(0, nextHp);
        });

        // Next snippet
        setTimeout(() => {
          setSnippetIdx((idx) => (idx + 1) % SNIPPETS.length);
          setUserInput('');
          setAiProgress(0);
        }, 300);
      }
    } else {
      sound.playError();
    }
  };

  const restartBattle = () => {
    setSnippetIdx(0);
    setUserInput('');
    setAiProgress(0);
    setPlayerHp(100);
    setAiHp(100);
    setIsBattleOver(false);
    setWinner(null);
    sound.playCombo(2);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-6">
      {/* Versus Banner */}
      <div className="w-full flex items-center justify-between px-6 py-4 rounded-3xl bg-slate-900/90 border border-cyan-400/30">
        {/* Player Left */}
        <div className="flex items-center gap-3">
          <MongolianZodiacMascot zodiacId="bar" size="sm" interactive={false} showAura={false} />
          <div>
            <div className="text-xs font-mono font-bold text-cyan-300">ЧИ (КИБЕР КОДЧ)</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-cyan-400 transition-all" style={{ width: `${playerHp}%` }} />
              </div>
              <span className="text-[10px] font-mono text-white">{playerHp}%</span>
            </div>
          </div>
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center p-2.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
          <Swords className="w-5 h-5" />
        </div>

        {/* AI Right */}
        <div className="flex items-center gap-3 flex-row-reverse text-right">
          <MongolianZodiacMascot zodiacId="luu" size="sm" interactive={false} showAura={false} />
          <div>
            <div className="text-xs font-mono font-bold text-amber-400">КИБЕР ТЭМҮҮЖИН (AI)</div>
            <div className="flex items-center gap-2 mt-1 justify-end">
              <span className="text-[10px] font-mono text-white">{aiHp}%</span>
              <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-amber-400 transition-all" style={{ width: `${aiHp}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/10 shadow-2xl relative space-y-6">
        <div className="text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            ДААЛГАВАР {snippetIdx + 1} / {SNIPPETS.length}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Өрсөлдөгчөөсөө түрүүлэн доорх кодыг яг алдаагүй шивж цохилт хий!
          </p>
        </div>

        {/* Code to Type (Highlighted) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-400/40 font-mono text-sm sm:text-base tracking-wide flex flex-wrap gap-0 select-none">
          {targetText.split('').map((char, i) => {
            const isTyped = i < userInput.length;
            const isCurrent = i === userInput.length;

            return (
              <span
                key={i}
                className={`${
                  isTyped
                    ? 'text-cyan-300 font-bold bg-cyan-500/20'
                    : isCurrent
                    ? 'text-white border-b-2 border-cyan-400 bg-slate-800'
                    : 'text-slate-500'
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden Input Field (Listens to Keystrokes) */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isBattleOver}
            placeholder="Гараас кодоо шивж эхэл..."
            className="w-full px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-cyan-400/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition-all shadow-lg"
          />
        </div>

        {/* Real-time Progress Comparison */}
        <div className="space-y-3 pt-2">
          {/* Player Progress */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-cyan-300">Чиний явц</span>
              <span className="text-white">{Math.round((userInput.length / targetText.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
              <div
                className="h-full bg-cyan-400 transition-all duration-150"
                style={{ width: `${(userInput.length / targetText.length) * 100}%` }}
              />
            </div>
          </div>

          {/* AI Progress */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-amber-300">Өрсөлдөгчийн явц</span>
              <span className="text-white">{Math.round((aiProgress / targetText.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
              <div
                className="h-full bg-amber-400 transition-all duration-150"
                style={{ width: `${(aiProgress / targetText.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Battle Result Modal */}
      {isBattleOver && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-400/50 text-center space-y-4 w-full shadow-2xl">
          <div className="inline-flex p-3 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase">
            {winner === 'player' ? 'ЧИ ЯЛАЛТ БАЙГУУЛЛАА!' : 'КИБЕР ТЭМҮҮЖИН ХОЖЛОО!'}
          </h3>
          <p className="text-xs text-slate-300">
            {winner === 'player'
              ? 'Маш хурдан бөгөөд алдаагүй шивж 500 оноо + 320 XP хүртлээ.'
              : 'Бүү бууж өг! Хурдаа нэмэн дахин тулалдаарай.'}
          </p>
          <button
            onClick={restartBattle}
            className="px-8 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-cyan-400/30"
          >
            <RotateCcw className="w-4 h-4" /> ДАХИН ТУЛАЛДАХ
          </button>
        </div>
      )}
    </div>
  );
};
