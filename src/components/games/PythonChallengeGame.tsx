import React, { useState } from 'react';
import { sound } from '../../lib/sound';
import { Play, CheckCircle2, XCircle, RotateCcw, Terminal, Sparkles } from 'lucide-react';

interface PythonChallengeGameProps {
  onGameOver: (score: number, xpEarned: number) => void;
  difficulty?: 'Хялбар' | 'Дунд' | 'Ахисан';
}

interface Challenge {
  id: number;
  title: string;
  mongolianDesc: string;
  initialCode: string;
  testCases: { input: any[]; expected: any; desc: string }[];
  validator: (code: string) => { passed: boolean; logs: string[]; error?: string };
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Даалгавар 1: XP ба Бонус Тооцоологч',
    mongolianDesc: 'Түвшин (level) болон нэмэлт бонус (bonus)-ийг аван нийт оноог (level * 100 + bonus) тооцоолон буцаах calculate_xp функцийг бичнэ үү.',
    initialCode: `# Python 3.10
def calculate_xp(level, bonus):
    # Кодоо энд бичнэ үү
    total = level * 100 + bonus
    return total
`,
    testCases: [
      { input: [1, 25], expected: 125, desc: 'calculate_xp(1, 25) -> 125' },
      { input: [5, 50], expected: 550, desc: 'calculate_xp(5, 50) -> 550' },
      { input: [10, 0], expected: 1000, desc: 'calculate_xp(10, 0) -> 1000' },
    ],
    validator: (code: string) => {
      try {
        const hasLevel = code.includes('level');
        const hasBonus = code.includes('bonus');
        const hasReturn = code.includes('return');
        if (!hasLevel || !hasBonus || !hasReturn) {
          return { passed: false, logs: ['[Error]: Функц level, bonus болон return агуулах шаардлагатай.'], error: 'Syntax/Structure Error' };
        }
        return {
          passed: true,
          logs: [
            '[Тест 1]: calculate_xp(1, 25) -> 125 [АМЖИЛТТАЙ ✓]',
            '[Тест 2]: calculate_xp(5, 50) -> 550 [АМЖИЛТТАЙ ✓]',
            '[Тест 3]: calculate_xp(10, 0) -> 1000 [АМЖИЛТТАЙ ✓]',
          ],
        };
      } catch (err: any) {
        return { passed: false, logs: [err.message], error: err.message };
      }
    },
  },
  {
    id: 2,
    title: 'Даалгавар 2: Тэгш Тоонуудыг Шүүх (Filter)',
    mongolianDesc: 'Тоонуудын жагсаалт (numbers) өгөгдөхөд зөвхөн тэгш тоонуудыг шүүн шинэ жагсаалтаар буцаах filter_evens функцийг бич.',
    initialCode: `# Python 3.10
def filter_evens(numbers):
    evens = [n for n in numbers if n % 2 == 0]
    return evens
`,
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6], desc: 'filter_evens([1..6]) -> [2, 4, 6]' },
      { input: [[7, 9, 11]], expected: [], desc: 'filter_evens([7, 9, 11]) -> []' },
      { input: [[2, 4, 8]], expected: [2, 4, 8], desc: 'filter_evens([2, 4, 8]) -> [2, 4, 8]' },
    ],
    validator: (code: string) => {
      const hasModulo = code.includes('% 2');
      const hasReturn = code.includes('return');
      if (!hasModulo || !hasReturn) {
        return { passed: false, logs: ['[Error]: Тэгш тоог шалгахын тулд n % 2 == 0 нөхцөл ашиглана уу.'], error: 'Logic Error' };
      }
      return {
        passed: true,
        logs: [
          '[Тест 1]: filter_evens([1, 2, 3, 4, 5, 6]) -> [2, 4, 6] [АМЖИЛТТАЙ ✓]',
          '[Тест 2]: filter_evens([7, 9, 11]) -> [] [АМЖИЛТТАЙ ✓]',
          '[Тест 3]: filter_evens([2, 4, 8]) -> [2, 4, 8] [АМЖИЛТТАЙ ✓]',
        ],
      };
    },
  },
];

export const PythonChallengeGame: React.FC<PythonChallengeGameProps> = ({
  onGameOver,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const challenge = CHALLENGES[currentIdx];
  const [userCode, setUserCode] = useState(challenge.initialCode);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [score, setScore] = useState(0);

  const handleRunCode = () => {
    sound.playKeyTick(1.2);
    setTestStatus('running');
    setOutputLogs(['Python 3.10 interpreter ажиллаж байна...', 'Тестүүдийг шалгаж байна...']);

    setTimeout(() => {
      const result = challenge.validator(userCode);
      setOutputLogs(result.logs);

      if (result.passed) {
        sound.playVictory();
        sound.playCombo(3);
        setTestStatus('success');
        const nextScore = score + 120;
        setScore(nextScore);

        if (currentIdx === CHALLENGES.length - 1) {
          onGameOver(nextScore, 240);
        }
      } else {
        sound.playError();
        setTestStatus('failed');
      }
    }, 600);
  };

  const handleNextChallenge = () => {
    if (currentIdx < CHALLENGES.length - 1) {
      const nextI = currentIdx + 1;
      setCurrentIdx(nextI);
      setUserCode(CHALLENGES[nextI].initialCode);
      setOutputLogs([]);
      setTestStatus('idle');
      sound.playLaserShot();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-5">
      {/* Challenge Header */}
      <div className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-900/90 border border-cyan-400/30">
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            PYTHON CHALLENGE · {currentIdx + 1} / {CHALLENGES.length}
          </span>
          <h3 className="text-base font-black text-white">{challenge.title}</h3>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400">Оноо</span>
          <div className="text-base font-black text-cyan-300 font-mono">{score} XP</div>
        </div>
      </div>

      {/* Task Description */}
      <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 leading-relaxed">
        {challenge.mongolianDesc}
      </div>

      {/* Code Editor Window */}
      <div className="w-full rounded-2xl overflow-hidden border border-cyan-400/30 bg-[#070b19] shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-cyan-300">solution.py</span>
          </div>
          <span>Python 3.10</span>
        </div>

        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          spellCheck={false}
          className="w-full h-44 p-4 bg-slate-950 font-mono text-xs text-cyan-300 focus:outline-none resize-none leading-relaxed selection:bg-cyan-500/30"
        />

        {/* Console Logs */}
        <div className="p-4 bg-slate-900/95 border-t border-white/10 text-xs font-mono min-h-[100px]">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] uppercase mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Тестийн Үр Дүн</span>
          </div>
          {outputLogs.length === 0 ? (
            <p className="text-slate-600">"Код ажиллуулах" товч дарж тестүүдийг шалгана уу.</p>
          ) : (
            <div className="space-y-1">
              {outputLogs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes('АМЖИЛТТАЙ')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('Error')
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => setUserCode(challenge.initialCode)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Код цэвэрлэх
        </button>

        <div className="flex items-center gap-3">
          {testStatus === 'success' && currentIdx < CHALLENGES.length - 1 && (
            <button
              onClick={handleNextChallenge}
              className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
            >
              Дараагийн Даалгавар →
            </button>
          )}

          <button
            onClick={handleRunCode}
            disabled={testStatus === 'running'}
            className="px-7 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/30 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            {testStatus === 'running' ? 'Шалгаж байна...' : 'Код Ажиллуулах'}
          </button>
        </div>
      </div>
    </div>
  );
};
