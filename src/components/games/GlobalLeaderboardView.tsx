import React, { useState } from 'react';
import { UserProgress } from '../../types';
import { MongolianZodiacMascot } from '../MongolianZodiacMascot';
import { UlziiKhee } from '../MongolianOrnaments';
import { Trophy, Medal, Crown, Flame, Shield, Users, Star } from 'lucide-react';
import { sound } from '../../lib/sound';

interface GlobalLeaderboardViewProps {
  progress: UserProgress;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  zodiacId: 'luu' | 'bar' | 'mori' | 'nokhoi' | 'tuulai' | 'khulgana';
  clan: string;
  level: number;
  xp: number;
  score: number;
  badge: string;
}

const TOP_PLAYERS: LeaderboardUser[] = [
  { rank: 1, name: 'Билгүүн (Master Dev)', zodiacId: 'luu', clan: 'Тэнгэрийн Луу', level: 24, xp: 12450, score: 38200, badge: 'Grandmaster' },
  { rank: 2, name: 'Номин (Algo Queen)', zodiacId: 'bar', clan: 'Алтайн Барс', level: 22, xp: 10890, score: 34100, badge: 'Diamond' },
  { rank: 3, name: 'Тэмүүлэн (Cyber Steppe)', zodiacId: 'mori', clan: 'Талын Хүлэг', level: 20, xp: 9540, score: 31200, badge: 'Diamond' },
  { rank: 4, name: 'Анударь (Code Archer)', zodiacId: 'tuulai', clan: 'Тэнгэрийн Луу', level: 19, xp: 8750, score: 28900, badge: 'Platinum' },
  { rank: 5, name: 'Энх-Амгалан (Bankhar Guard)', zodiacId: 'nokhoi', clan: 'Говийн Үнэг', level: 18, xp: 8120, score: 26400, badge: 'Platinum' },
  { rank: 6, name: 'Хүслэн (Rapid Python)', zodiacId: 'khulgana', clan: 'Алтайн Барс', level: 16, xp: 7400, score: 24100, badge: 'Gold' },
];

const CLANS = [
  { name: 'Тэнгэрийн Луу', emblem: '🐉', members: 1420, totalXp: '2.4M XP', rank: 1, color: 'text-cyan-400' },
  { name: 'Алтайн Барс', emblem: '🐅', members: 1280, totalXp: '2.1M XP', rank: 2, color: 'text-amber-400' },
  { name: 'Талын Хүлэг', emblem: '🐎', members: 1150, totalXp: '1.8M XP', rank: 3, color: 'text-blue-400' },
  { name: 'Говийн Үнэг', emblem: '🦊', members: 980, totalXp: '1.5M XP', rank: 4, color: 'text-rose-400' },
];

export const GlobalLeaderboardView: React.FC<GlobalLeaderboardViewProps> = ({
  progress,
}) => {
  const [tab, setTab] = useState<'individual' | 'clans'>('individual');

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10 self-center">
        <button
          onClick={() => {
            sound.playKeyTick();
            setTab('individual');
          }}
          className={`px-5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            tab === 'individual'
              ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Хувь Хүний Чансаа (Top 10)
        </button>
        <button
          onClick={() => {
            sound.playKeyTick();
            setTab('clans');
          }}
          className={`px-5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            tab === 'clans'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Кланы Тулаан (Clans)
        </button>
      </div>

      {tab === 'individual' ? (
        <div className="w-full space-y-4">
          {/* User Rank Card */}
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900/90 border border-cyan-400/50 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center">
                #7
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{progress.name} (ЧИ)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    Түвшин {progress.level}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Клан: <strong className="text-cyan-300">Алтайн Барс</strong> · Нарийвчлал: {progress.accuracy}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-amber-300 font-mono">{progress.xp} XP</div>
              <div className="text-[10px] text-slate-400">{progress.score} Оноо</div>
            </div>
          </div>

          {/* Top Players List */}
          <div className="w-full rounded-3xl bg-slate-950 border border-white/10 shadow-2xl divide-y divide-white/5 overflow-hidden">
            {TOP_PLAYERS.map((player) => (
              <div
                key={player.rank}
                className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 flex items-center justify-center">
                    {player.rank === 1 ? (
                      <Crown className="w-6 h-6 text-yellow-400" />
                    ) : player.rank === 2 ? (
                      <Medal className="w-5 h-5 text-slate-300" />
                    ) : player.rank === 3 ? (
                      <Medal className="w-5 h-5 text-amber-600" />
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-500">#{player.rank}</span>
                    )}
                  </div>

                  <MongolianZodiacMascot zodiacId={player.zodiacId} size="sm" interactive={false} showAura={false} />

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{player.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-400">
                        {player.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {player.clan} · Түвшин {player.level}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-cyan-300 font-mono">{player.xp} XP</div>
                  <div className="text-[10px] text-slate-400 font-mono">{player.score} оноо</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Clans List */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {CLANS.map((clan) => (
            <div
              key={clan.name}
              className="p-5 rounded-3xl bg-slate-950 border border-white/10 shadow-xl space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{clan.emblem}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">
                  Чансаа #{clan.rank}
                </span>
              </div>

              <div>
                <h4 className={`text-base font-black ${clan.color}`}>{clan.name}</h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {clan.members} гишүүн · {clan.totalXp}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Сар бүрийн шагнал:</span>
                <span className="text-amber-300 font-bold">+1000 XP & Титэм</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
