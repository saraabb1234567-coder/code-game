import React, { useState } from 'react';
import { sound } from '../../lib/sound';
import { ToonoRing, UlziiKhee } from '../MongolianOrnaments';
import { Sparkles, RotateCcw, CheckCircle2, Zap, HelpCircle } from 'lucide-react';

interface CircuitLogicGameProps {
  onGameOver: (score: number, xpEarned: number) => void;
  difficulty?: 'Хялбар' | 'Дунд' | 'Ахисан';
}

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR';

interface PuzzleLevel {
  level: number;
  title: string;
  description: string;
  inputs: boolean[];
  gates: { id: number; type: GateType; allowedTypes: GateType[]; inA: number; inB: number }[];
  targetOutput: boolean;
}

const LEVELS: PuzzleLevel[] = [
  {
    level: 1,
    title: 'Анхны Цахилгаан · AND & OR Хаалга',
    description: 'Хоёр урсгалыг зөв тохируулан төв Тооно-д гүйдэл (1) дамжуул.',
    inputs: [true, false, true],
    gates: [
      { id: 1, type: 'AND', allowedTypes: ['AND', 'OR'], inA: 0, inB: 1 },
      { id: 2, type: 'OR', allowedTypes: ['AND', 'OR', 'XOR'], inA: 1, inB: 2 },
      { id: 3, type: 'AND', allowedTypes: ['AND', 'OR', 'XOR'], inA: 0, inB: 2 },
    ],
    targetOutput: true,
  },
  {
    level: 2,
    title: 'Хувиргагч · NOT & XOR Хаалга',
    description: 'NOT хаалга нь утгыг эсрэгээр эргүүлнэ (1 -> 0). Тэнцвэрийг ол.',
    inputs: [false, true, false, true],
    gates: [
      { id: 1, type: 'NOT', allowedTypes: ['NOT', 'AND'], inA: 0, inB: 0 },
      { id: 2, type: 'XOR', allowedTypes: ['AND', 'OR', 'XOR'], inA: 1, inB: 2 },
      { id: 3, type: 'AND', allowedTypes: ['AND', 'OR', 'XOR'], inA: 0, inB: 1 },
    ],
    targetOutput: true,
  },
  {
    level: 3,
    title: 'Ариун Тоонот Түгжээ · Цогц Систем',
    description: 'Бүх 4 хаалгыг оновчтой тохируулж дээд хүчдэлийг үүсгэ.',
    inputs: [true, true, false, false],
    gates: [
      { id: 1, type: 'XOR', allowedTypes: ['AND', 'OR', 'XOR'], inA: 0, inB: 1 },
      { id: 2, type: 'OR', allowedTypes: ['AND', 'OR'], inA: 2, inB: 3 },
      { id: 3, type: 'AND', allowedTypes: ['AND', 'OR', 'XOR'], inA: 0, inB: 2 },
    ],
    targetOutput: true,
  },
];

export const CircuitLogicGame: React.FC<CircuitLogicGameProps> = ({
  onGameOver,
}) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];
  const [inputs, setInputs] = useState<boolean[]>(currentLevel.inputs);
  const [gates, setGates] = useState(currentLevel.gates);
  const [isWon, setIsWon] = useState(false);
  const [score, setScore] = useState(0);

  // Compute logic gate output
  const evaluateGate = (type: GateType, valA: boolean, valB: boolean): boolean => {
    switch (type) {
      case 'AND':
        return valA && valB;
      case 'OR':
        return valA || valB;
      case 'NOT':
        return !valA;
      case 'XOR':
        return valA !== valB;
    }
  };

  // Evaluate current network
  const g1Out = evaluateGate(gates[0].type, inputs[gates[0].inA], inputs[gates[0].inB]);
  const g2Out = evaluateGate(gates[1].type, inputs[gates[1].inA], inputs[gates[1].inB]);
  const finalOut = evaluateGate(gates[2].type, g1Out, g2Out);

  const toggleInput = (idx: number) => {
    sound.playKeyTick(1.3);
    setInputs((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const cycleGateType = (gateId: number) => {
    sound.playKeyTick(1.1);
    setGates((prev) =>
      prev.map((g) => {
        if (g.id !== gateId) return g;
        const currentIdx = g.allowedTypes.indexOf(g.type);
        const nextType = g.allowedTypes[(currentIdx + 1) % g.allowedTypes.length];
        return { ...g, type: nextType };
      })
    );
  };

  const checkSolution = () => {
    if (finalOut === currentLevel.targetOutput) {
      sound.playVictory();
      sound.playCombo(3);
      setIsWon(true);
      const levelScore = 100 * (currentLevelIdx + 1);
      setScore((s) => s + levelScore);

      if (currentLevelIdx === LEVELS.length - 1) {
        onGameOver(score + levelScore, 250);
      }
    } else {
      sound.playError();
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      const nextIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextIdx);
      setInputs(LEVELS[nextIdx].inputs);
      setGates(LEVELS[nextIdx].gates);
      setIsWon(false);
      sound.playLaserShot();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-900/90 border border-cyan-400/30">
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            ТҮВШИН {currentLevel.level} / {LEVELS.length}
          </span>
          <h3 className="text-lg font-black text-white">{currentLevel.title}</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Оноо</span>
          <div className="text-lg font-black text-cyan-300 font-mono">{score}</div>
        </div>
      </div>

      {/* Circuit Schematic Board */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/10 shadow-2xl relative overflow-hidden">
        <p className="text-xs text-slate-300 mb-6 text-center">{currentLevel.description}</p>

        <div className="grid grid-cols-3 gap-6 items-center">
          {/* Column 1: Input Pins (0 / 1 switches) */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase mb-2">
              Оролтууд (Inputs)
            </div>
            {inputs.map((val, idx) => (
              <button
                key={idx}
                onClick={() => toggleInput(idx)}
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between font-mono text-xs font-bold transition-all cursor-pointer shadow-md ${
                  val
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-500/20'
                    : 'bg-slate-900 border-white/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>Оролт {idx + 1}</span>
                <span className={`px-2 py-0.5 rounded ${val ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800'}`}>
                  {val ? '1 (TRUE)' : '0 (FALSE)'}
                </span>
              </button>
            ))}
          </div>

          {/* Column 2: Logic Gates (Click to cycle type) */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono text-amber-300 font-bold uppercase mb-2 text-center">
              Логик Хаалга (Gates)
            </div>
            {gates.slice(0, 2).map((gate) => (
              <button
                key={gate.id}
                onClick={() => cycleGateType(gate.id)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-amber-400/40 hover:border-amber-400 text-center transition-all cursor-pointer shadow-md group"
              >
                <div className="text-[10px] text-slate-400 uppercase font-mono">
                  Хаалга #{gate.id} (Товших)
                </div>
                <div className="text-xl font-black text-amber-300 group-hover:scale-110 transition-transform font-mono">
                  {gate.type}
                </div>
              </button>
            ))}
          </div>

          {/* Column 3: Final Central Gate & Toono Light */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-[11px] font-mono text-purple-300 font-bold uppercase mb-1">
              Төгсгөлийн Хаалга
            </div>
            <button
              onClick={() => cycleGateType(gates[2].id)}
              className="p-3.5 rounded-xl bg-slate-900 border border-purple-400/40 hover:border-purple-400 text-center transition-all cursor-pointer shadow-md group w-full"
            >
              <div className="text-[10px] text-slate-400 uppercase font-mono">Эцсийн хаалга</div>
              <div className="text-xl font-black text-purple-300 group-hover:scale-110 transition-transform font-mono">
                {gates[2].type}
              </div>
            </button>

            {/* Glowing Toono Power Receptor */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center space-y-1 ${
                finalOut
                  ? 'bg-cyan-500/25 border-cyan-400 shadow-xl shadow-cyan-400/30'
                  : 'bg-slate-900 border-white/10 opacity-50'
              }`}
            >
              <ToonoRing size={48} color={finalOut ? 'cyan' : 'gold'} spinning={finalOut} />
              <span className={`text-[11px] font-mono font-bold mt-1 ${finalOut ? 'text-cyan-300' : 'text-slate-500'}`}>
                {finalOut ? 'ТООНО АСЛАА (1)' : 'УНТРААТАЙ (0)'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {isWon ? (
            <button
              onClick={nextLevel}
              className="px-8 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-400/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> ДАРААГИЙН ТҮВШИН
            </button>
          ) : (
            <button
              onClick={checkSolution}
              className="px-8 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/30 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" /> ШАЛГАХ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
