import React, { useState, useEffect } from 'react';
import { sound } from '../../lib/sound';
import { ZodiacAnimalId } from '../../types';
import { MongolianZodiacMascot } from '../MongolianZodiacMascot';
import { Sparkles, RotateCcw, Trophy, Timer } from 'lucide-react';

interface MemoryMatchGameProps {
  onGameOver: (score: number, xpEarned: number) => void;
  difficulty?: 'Хялбар' | 'Дунд' | 'Ахисан';
}

interface CardItem {
  id: number;
  zodiacId: ZodiacAnimalId;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ZODIAC_SUBSET: { zodiacId: ZodiacAnimalId; name: string }[] = [
  { zodiacId: 'khulgana', name: 'Хулгана' },
  { zodiacId: 'bar', name: 'Бар' },
  { zodiacId: 'tuulai', name: 'Туулай' },
  { zodiacId: 'luu', name: 'Луу' },
  { zodiacId: 'mori', name: 'Морь' },
  { zodiacId: 'nokhoi', name: 'Банхар' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  onGameOver,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize deck with shuffled pairs
  const initGame = () => {
    const deck: CardItem[] = [];
    let idCounter = 1;

    ZODIAC_SUBSET.forEach((item) => {
      // 2 identical cards per animal
      deck.push({ id: idCounter++, zodiacId: item.zodiacId, name: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, zodiacId: item.zodiacId, name: item.name, isFlipped: false, isMatched: false });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setSeconds(0);
    setIsFinished(false);
    sound.playCombo(2);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const handleCardClick = (cardId: number) => {
    if (flippedIds.length >= 2) return;
    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    sound.playKeyTick(1.4);
    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.id === newFlipped[0])!;
      const secondCard = clickedCard;

      if (firstCard.zodiacId === secondCard.zodiacId) {
        // Matched!
        sound.playCombo(2);
        sound.playVictory();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setMatchedPairs((p) => {
            const nextPairs = p + 1;
            if (nextPairs === ZODIAC_SUBSET.length) {
              setIsFinished(true);
              const score = Math.max(100, 1000 - moves * 20 - seconds * 5);
              onGameOver(score, 200);
            }
            return nextPairs;
          });
        }, 500);
      } else {
        // Mismatch: flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6">
      {/* Top Stats */}
      <div className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-900/90 border border-cyan-400/30 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Timer className="w-4 h-4" />
          <span>{seconds} сек</span>
        </div>
        <div className="text-slate-300">
          Нүүдэл: <strong className="text-white">{moves}</strong>
        </div>
        <div className="text-amber-300 font-bold">
          Хос: {matchedPairs} / {ZODIAC_SUBSET.length}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 w-full">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`h-28 sm:h-32 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center relative p-2 shadow-lg select-none ${
              card.isMatched
                ? 'bg-emerald-950/60 border-emerald-400/60 shadow-emerald-500/20'
                : card.isFlipped
                ? 'bg-slate-900 border-cyan-400/80 shadow-cyan-500/25 scale-105'
                : 'bg-slate-950 border-white/10 hover:border-cyan-400/40 hover:bg-slate-900/70'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="flex flex-col items-center justify-center space-y-1">
                <MongolianZodiacMascot
                  zodiacId={card.zodiacId}
                  size="sm"
                  interactive={false}
                  showAura={false}
                />
                <span className="text-[10px] font-bold text-white font-mono">{card.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 opacity-60">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-[9px] font-mono text-slate-400">12 ЖИЛ</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Win Banner / Restart */}
      {isFinished && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-center space-y-2 w-full">
          <h4 className="text-lg font-black text-white">БАЯР ХҮРГЭЕ! БҮХ ХОСЫГ ОЛЛОО!</h4>
          <p className="text-xs text-slate-300">
            Нийт {moves} нүүдэл, {seconds} секундэд амжилттай дуусгалаа.
          </p>
          <button
            onClick={initGame}
            className="px-6 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
          >
            Дахин эхлэх
          </button>
        </div>
      )}
    </div>
  );
};
