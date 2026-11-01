import React, { useState, useEffect } from 'react';
import { sound } from '../../lib/sound';
import { Sparkles, Trophy, HelpCircle, Timer, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface CyberQuizGameProps {
  onGameOver: (score: number, xpEarned: number) => void;
  difficulty?: 'Хялбар' | 'Дунд' | 'Ахисан';
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Компьютерт өгөгдлийг хамгийн бага хэмжих нэгж юу вэ?',
    options: ['Байт (Byte)', 'Бит (Bit: 0 эсвэл 1)', 'Килобайт (KB)', 'Мегабайт (MB)'],
    correctIdx: 1,
    explanation: 'Бит (Bit) нь binary digit үгийн товчлол бөгөөд 0 эсвэл 1 гэсэн 2 л утга авдаг хамгийн анхдагч нэгж юм.',
  },
  {
    id: 2,
    question: 'Python хэл дээр дэлгэцэнд мэдээлэл хэвлэх үндсэн команд аль нь вэ?',
    options: ['console.log()', 'echo', 'print()', 'system.out()'],
    correctIdx: 2,
    explanation: 'Python хэлэнд текст болон хувьсагчийн утгыг терминалд хэвлэхдээ print() функцийг ашигладаг.',
  },
  {
    id: 3,
    question: 'HTML хэлэнд вэб хуудасны гол агуулгыг агуулдаг үндсэн таг юу вэ?',
    options: ['<head>', '<body>', '<header>', '<meta>'],
    correctIdx: 1,
    explanation: '<body> таг дотор хэрэглэгчийн дэлгэц дээр харагдах бүх зураг, текст, товчлуурууд байрладаг.',
  },
  {
    id: 4,
    question: 'Git хувилбар удирдах системд өөрчлөлтөө хадгалах команд аль нь вэ?',
    options: ['git push', 'git init', 'git commit -m "..."', 'git clone'],
    correctIdx: 2,
    explanation: 'git commit нь хийсэн өөрчлөлтүүдийг түүхэнд шинэ цэг болгон тайлбартайгаар найдвартай бүртгэдэг.',
  },
  {
    id: 5,
    question: 'Boolean өгөгдлийн төрөл ямар хоёр утга авах боломжтой вэ?',
    options: ['0 ба 100', 'True ба False', 'Yes ба No', 'String ба Number'],
    correctIdx: 1,
    explanation: 'Boolean нь Жорж Булийн нэрээр нэрлэгдсэн үнэн (True) эсвэл худал (False) гэсэн хоёрхон логик төлөвийг илэрхийлдэг.',
  },
];

export const CyberQuizGame: React.FC<CyberQuizGameProps> = ({
  onGameOver,
}) => {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const q = QUIZ_QUESTIONS[currentQIdx];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(15);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [used5050, setUsed5050] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Question countdown timer
  useEffect(() => {
    if (isAnswered || isFinished) return;
    if (timer <= 0) {
      handleSelectOption(-1); // timeout
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, isAnswered, isFinished]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === q.correctIdx) {
      sound.playVictory();
      sound.playCombo(Math.min(4, streak + 1));
      const mult = 1 + streak * 0.5;
      const points = Math.floor(100 * mult);
      setScore((s) => s + points);
      setStreak((s) => s + 1);
    } else {
      sound.playError();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimer(15);
      setHiddenOptions([]);
      sound.playLaserShot();
    } else {
      setIsFinished(true);
      onGameOver(score, Math.min(300, Math.floor(score / 3)));
    }
  };

  const use5050Lifeline = () => {
    if (used5050 || isAnswered) return;
    setUsed5050(true);
    sound.playKeyTick(1.5);
    const wrongIndices = q.options
      .map((_, i) => i)
      .filter((i) => i !== q.correctIdx);
    // Hide 2 wrong options
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptions(toHide);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-900/90 border border-cyan-400/30 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-cyan-400" />
          <span className={`font-bold ${timer <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
            {timer} сек
          </span>
        </div>

        <div className="text-amber-400 font-bold">
          {streak > 1 ? `КОМБО x${streak} 🔥` : `Асуулт ${currentQIdx + 1} / ${QUIZ_QUESTIONS.length}`}
        </div>

        <div className="text-cyan-300 font-black">
          {score} ОНОО
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/10 shadow-2xl space-y-6 relative">
        <h3 className="text-lg sm:text-xl font-black text-white text-center leading-relaxed">
          {q.question}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {q.options.map((opt, i) => {
            if (hiddenOptions.includes(i)) {
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-white/5 bg-slate-950/40 opacity-20 pointer-events-none"
                >
                  <span className="text-slate-600 font-mono text-xs">Хасагдсан</span>
                </div>
              );
            }

            const isSelected = selectedOption === i;
            const isCorrect = i === q.correctIdx;

            let btnStyle = 'bg-slate-900 border-white/10 text-white hover:border-cyan-400/50';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-500/20';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-rose-500/20';
              } else {
                btnStyle = 'bg-slate-900/50 border-white/5 text-slate-500';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Lifeline & Explanation */}
        {isAnswered ? (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Зөв хариултын тайлбар:</span>
            </div>
            <p className="leading-relaxed">{q.explanation}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={use5050Lifeline}
              disabled={used5050}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                used5050
                  ? 'border-white/5 text-slate-600 bg-slate-900 cursor-not-allowed'
                  : 'border-amber-400/40 text-amber-300 bg-amber-500/10 hover:border-amber-400 cursor-pointer'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> 50:50 Боломж {used5050 ? '(Ашигласан)' : ''}
            </button>
            <span className="text-[11px] text-slate-500 font-mono">Дараалсан зөв хариулт комбо өгнө</span>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer shadow-lg shadow-cyan-400/30 hover:bg-cyan-300"
            >
              {currentQIdx < QUIZ_QUESTIONS.length - 1 ? 'Дараагийн Асуулт →' : 'Дүн Харах'}
            </button>
          </div>
        )}
      </div>

      {/* Quiz Finish */}
      {isFinished && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-400 text-center space-y-3 w-full shadow-2xl">
          <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black text-white uppercase">ТЕСТ ДУУСЛАА!</h3>
          <p className="text-sm text-slate-300">
            Чи нийт <strong className="text-amber-400">{score}</strong> оноо авлаа!
          </p>
        </div>
      )}
    </div>
  );
};
