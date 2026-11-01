import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../../lib/sound';
import { Sparkles, Shield, Play, RotateCcw, Trophy, Zap } from 'lucide-react';

interface SpaceShooterMiniGameProps {
  onGameOver: (score: number, xpEarned: number) => void;
  difficulty?: 'Хялбар' | 'Дунд' | 'Ахисан';
}

export const SpaceShooterMiniGame: React.FC<SpaceShooterMiniGameProps> = ({
  onGameOver,
  difficulty = 'Дунд',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [wave, setWave] = useState(1);

  const state = useRef({
    playerX: 340,
    playerY: 270,
    lasers: [] as { x: number; y: number; vy: number }[],
    enemies: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      hp: number;
      maxHp: number;
      type: 'bug' | 'asteroid' | 'cruiser';
    }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    lastFire: 0,
    lastSpawn: 0,
    score: 0,
    shield: 100,
    keys: { left: false, right: false, up: false, down: false, fire: false },
  });

  const startGame = () => {
    const s = state.current;
    s.playerX = 340;
    s.playerY = 270;
    s.lasers = [];
    s.enemies = [];
    s.particles = [];
    s.score = 0;
    s.shield = 100;
    setScore(0);
    setShield(100);
    setWave(1);
    setIsGameOver(false);
    setIsPlaying(true);
    sound.playCombo(2);
  };

  const fireLaser = useCallback(() => {
    const s = state.current;
    s.lasers.push({ x: s.playerX - 10, y: s.playerY - 14, vy: -12 });
    s.lasers.push({ x: s.playerX + 10, y: s.playerY - 14, vy: -12 });
    sound.playLaserShot();
  }, []);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) {
        if (e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') state.current.keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') state.current.keys.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') state.current.keys.down = true;
      if (e.code === 'Space') {
        e.preventDefault();
        fireLaser();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') state.current.keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') state.current.keys.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') state.current.keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, isGameOver, fireLaser]);

  // Canvas Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    state.current.playerX = (e.clientX - rect.left) * scaleX;
    state.current.playerY = Math.max(120, Math.min(300, (e.clientY - rect.top) * scaleY));
  };

  const handleMouseDown = () => {
    if (isPlaying) fireLaser();
  };

  // 60fps Loop
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const loop = () => {
      tick++;
      const s = state.current;

      // Handle Keyboard Movement
      const pSpeed = 6;
      if (s.keys.left) s.playerX = Math.max(30, s.playerX - pSpeed);
      if (s.keys.right) s.playerX = Math.min(canvas.width - 30, s.playerX + pSpeed);
      if (s.keys.up) s.playerY = Math.max(120, s.playerY - pSpeed);
      if (s.keys.down) s.playerY = Math.min(canvas.height - 30, s.playerY + pSpeed);

      // Auto fire laser every 18 ticks if space or mouse held
      if (tick % 18 === 0) {
        s.lasers.push({ x: s.playerX, y: s.playerY - 16, vy: -12 });
      }

      // Spawn Enemies
      const spawnInterval = difficulty === 'Хялбар' ? 55 : difficulty === 'Дунд' ? 40 : 30;
      if (tick - s.lastSpawn > spawnInterval) {
        const rand = Math.random();
        const type = rand > 0.6 ? 'cruiser' : rand > 0.3 ? 'bug' : 'asteroid';
        s.enemies.push({
          x: 40 + Math.random() * (canvas.width - 80),
          y: -30,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2 + Math.random() * 2,
          hp: type === 'cruiser' ? 3 : 1,
          maxHp: type === 'cruiser' ? 3 : 1,
          type,
        });
        s.lastSpawn = tick;
      }

      // Update Lasers
      for (let i = s.lasers.length - 1; i >= 0; i--) {
        const l = s.lasers[i];
        l.y += l.vy;
        if (l.y < -20) s.lasers.splice(i, 1);
      }

      // Update Enemies & Collisions
      for (let i = s.enemies.length - 1; i >= 0; i--) {
        const en = s.enemies[i];
        en.x += en.vx;
        en.y += en.vy;

        // Check Laser Collision
        for (let j = s.lasers.length - 1; j >= 0; j--) {
          const l = s.lasers[j];
          const dist = Math.hypot(en.x - l.x, en.y - l.y);
          if (dist < 24) {
            // Hit!
            en.hp--;
            s.lasers.splice(j, 1);
            sound.playKeyTick(1.8);

            // Hit Particles
            for (let p = 0; p < 4; p++) {
              s.particles.push({
                x: l.x,
                y: l.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#22d3ee',
                life: 15,
              });
            }

            if (en.hp <= 0) {
              // Destroyed!
              sound.playLaserShot();
              s.score += en.type === 'cruiser' ? 50 : 20;
              setScore(s.score);

              // Explosion Particles
              for (let p = 0; p < 12; p++) {
                s.particles.push({
                  x: en.x,
                  y: en.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: en.type === 'cruiser' ? '#f59e0b' : '#ef4444',
                  life: 25,
                });
              }

              s.enemies.splice(i, 1);
              break;
            }
          }
        }

        // Check Collision with Player
        if (s.enemies[i]) {
          const pDist = Math.hypot(en.x - s.playerX, en.y - s.playerY);
          if (pDist < 30) {
            sound.playError();
            s.shield -= 25;
            setShield(Math.max(0, s.shield));
            s.enemies.splice(i, 1);

            if (s.shield <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
              const xp = Math.min(350, Math.floor(s.score / 6));
              onGameOver(s.score, xp);
              return;
            }
          } else if (en.y > canvas.height + 40) {
            s.enemies.splice(i, 1);
          }
        }
      }

      // Update Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      // Wave calculation
      setWave(1 + Math.floor(s.score / 200));

      // 2. Render Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep Space background
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Moving Starfield
      ctx.fillStyle = '#ffffff';
      for (let sIdx = 0; sIdx < 40; sIdx++) {
        const sx = (sIdx * 67 + tick * 0.4) % canvas.width;
        const sy = (sIdx * 43 + tick * 1.8) % canvas.height;
        const rad = (sIdx % 3) + 0.8;
        ctx.globalAlpha = 0.3 + (sIdx % 5) * 0.15;
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw Lasers
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 10;
      for (const l of s.lasers) {
        ctx.beginPath();
        ctx.roundRect(l.x - 2.5, l.y, 5, 14, 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Draw Enemies
      for (const en of s.enemies) {
        ctx.save();
        ctx.translate(en.x, en.y);

        if (en.type === 'cruiser') {
          // Cyber Cruiser
          ctx.fillStyle = '#8b5cf6';
          ctx.beginPath();
          ctx.moveTo(0, 20);
          ctx.lineTo(24, -16);
          ctx.lineTo(-24, -16);
          ctx.closePath();
          ctx.fill();

          // Core
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (en.type === 'bug') {
          // Glitch Bug
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();

          // Spikes
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Asteroid
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.life * 0.15), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Player Celestial Dragon Ship (Сүрлэг Луу Хөлөг)
      ctx.save();
      ctx.translate(s.playerX, s.playerY);

      // Engine Thruster Glow
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(-8, 14);
      ctx.lineTo(8, 14);
      ctx.lineTo(0, 24 + Math.sin(tick * 0.5) * 6);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Main Hull (Cyber Arrowhead)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(20, 14);
      ctx.lineTo(0, 8);
      ctx.lineTo(-20, 14);
      ctx.closePath();
      ctx.fill();

      // Golden Dragon Wings
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(28, 6);
      ctx.lineTo(16, 12);
      ctx.lineTo(-16, 12);
      ctx.lineTo(-28, 6);
      ctx.closePath();
      ctx.fill();

      // Cockpit Dome
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(0, -4, 5, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, difficulty, onGameOver]);

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      {/* Top HUD */}
      <div className="w-full max-w-2xl flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-cyan-400/30 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Бамбай:</span>
          <div className="w-24 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-300 ${
                shield > 50 ? 'bg-cyan-400' : shield > 25 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${shield}%` }}
            />
          </div>
          <span className="font-bold text-white">{shield}%</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-amber-300 font-bold">
            <span>{wave}-Р ДАВАЛГАА</span>
          </div>
          <div className="text-white font-black text-sm">
            <span>{score} ОНОО</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-400/40 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={680}
          height={340}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          className="block w-full max-w-2xl h-auto cursor-crosshair"
        />

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            {isGameOver ? (
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">ТУЛААН ДУУСЛАА!</h3>
                <p className="text-sm text-slate-300">
                  Нийт оноо: <strong className="text-amber-400">{score}</strong> · Давалгаа:{' '}
                  <strong className="text-cyan-300">{wave}</strong>
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-cyan-400/30 hover:bg-cyan-300 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> ДАХИН ЭХЛҮҮЛЭХ
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <div className="inline-flex p-3 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300">
                  <Zap className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  Луугийн Сансрын Харваач
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Хулгана эсвэл сумаар хөлгөө удирдаж, дайсны вирусийг лазераар устган амьд үлд!
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-cyan-300">
                  <span className="bg-slate-900 px-2.5 py-1 rounded border border-white/10">
                    Удирдах: Хулгана / WASD
                  </span>
                  <span className="bg-slate-900 px-2.5 py-1 rounded border border-white/10">
                    Буудах: Хулгана / Space
                  </span>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-cyan-400/30 hover:bg-cyan-300 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" /> ЭХЛҮҮЛЭХ
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
