import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../../lib/sound';
import { Sparkles, Heart, Play, RotateCcw, Trophy, ArrowUp, ArrowDown } from 'lucide-react';

interface EndlessRunnerGameProps {
  onGameOver: (score: number, xpEarned: number) => void;
  difficulty?: 'Хялбар' | 'Дунд' | 'Ахисан';
}

export const EndlessRunnerGame: React.FC<EndlessRunnerGameProps> = ({
  onGameOver,
  difficulty = 'Хялбар',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [distance, setDistance] = useState(0);

  const gameState = useRef({
    playerY: 0,
    playerVy: 0,
    isJumping: false,
    isDucking: false,
    groundY: 260,
    speed: difficulty === 'Хялбар' ? 5 : difficulty === 'Дунд' ? 6.5 : 8,
    distanceRun: 0,
    coinsCollected: 0,
    obstacles: [] as { x: number; y: number; width: number; height: number; type: 'spike' | 'drone' | 'barrier' }[],
    crystals: [] as { x: number; y: number; collected: boolean }[],
    lastObstacleSpawn: 0,
    lastCrystalSpawn: 0,
    heartsLeft: 3,
    invincibleTimer: 0,
  });

  const jump = useCallback(() => {
    const s = gameState.current;
    if (!s.isJumping) {
      s.playerVy = -13.5;
      s.isJumping = true;
      sound.playLaserShot();
    }
  }, []);

  const duck = useCallback((ducking: boolean) => {
    gameState.current.isDucking = ducking;
  }, []);

  const startGame = () => {
    const s = gameState.current;
    s.playerY = 0;
    s.playerVy = 0;
    s.isJumping = false;
    s.isDucking = false;
    s.distanceRun = 0;
    s.coinsCollected = 0;
    s.obstacles = [];
    s.crystals = [];
    s.heartsLeft = 3;
    s.invincibleTimer = 0;
    s.speed = difficulty === 'Хялбар' ? 5 : difficulty === 'Дунд' ? 6.5 : 8;

    setScore(0);
    setCoins(0);
    setHearts(3);
    setDistance(0);
    setIsGameOver(false);
    setIsPlaying(true);
    sound.playCombo(2);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) {
        if (e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        jump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        duck(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        duck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, isGameOver, jump, duck]);

  // Main 60fps Canvas Loop
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
      const s = gameState.current;

      // 1. Update Game Physics
      s.distanceRun += s.speed * 0.05;
      s.speed += 0.0008; // gradual acceleration

      // Gravity & Jumping
      s.playerY += s.playerVy;
      s.playerVy += 0.8; // Gravity

      if (s.playerY >= 0) {
        s.playerY = 0;
        s.playerVy = 0;
        s.isJumping = false;
      }

      if (s.invincibleTimer > 0) s.invincibleTimer--;

      // Spawn Obstacles
      if (tick - s.lastObstacleSpawn > Math.max(50, 110 - s.speed * 4)) {
        const obsType = Math.random() > 0.4 ? 'spike' : 'drone';
        const height = obsType === 'drone' ? 36 : 42;
        const width = obsType === 'drone' ? 44 : 32;
        const yPos = obsType === 'drone' ? s.groundY - 75 : s.groundY - height;

        s.obstacles.push({
          x: canvas.width + 20,
          y: yPos,
          width,
          height,
          type: obsType,
        });
        s.lastObstacleSpawn = tick;
      }

      // Spawn Crystals
      if (tick - s.lastCrystalSpawn > 75) {
        s.crystals.push({
          x: canvas.width + 30,
          y: s.groundY - (Math.random() > 0.5 ? 90 : 35),
          collected: false,
        });
        s.lastCrystalSpawn = tick;
      }

      // Update & Move Obstacles
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= s.speed;

        // Player Hitbox
        const pWidth = s.isDucking ? 46 : 38;
        const pHeight = s.isDucking ? 26 : 56;
        const pX = 85;
        const pY = s.groundY - pHeight + s.playerY;

        // Collision Check
        if (
          s.invincibleTimer === 0 &&
          pX < obs.x + obs.width &&
          pX + pWidth > obs.x &&
          pY < obs.y + obs.height &&
          pY + pHeight > obs.y
        ) {
          // Hit!
          sound.playError();
          s.heartsLeft--;
          s.invincibleTimer = 60; // 1 sec invincibility
          setHearts(s.heartsLeft);

          if (s.heartsLeft <= 0) {
            setIsGameOver(true);
            setIsPlaying(false);
            const finalScore = Math.floor(s.distanceRun * 10 + s.coinsCollected * 50);
            const xp = Math.min(300, Math.floor(finalScore / 10));
            onGameOver(finalScore, xp);
            return;
          }
        }

        // Cleanup offscreen
        if (obs.x < -60) {
          s.obstacles.splice(i, 1);
        }
      }

      // Update & Move Crystals
      for (let i = s.crystals.length - 1; i >= 0; i--) {
        const c = s.crystals[i];
        c.x -= s.speed;

        const pWidth = s.isDucking ? 46 : 38;
        const pHeight = s.isDucking ? 26 : 56;
        const pX = 85;
        const pY = s.groundY - pHeight + s.playerY;

        if (
          !c.collected &&
          pX < c.x + 22 &&
          pX + pWidth > c.x &&
          pY < c.y + 22 &&
          pY + pHeight > c.y
        ) {
          c.collected = true;
          s.coinsCollected++;
          sound.playKeyTick(1.6);
          setCoins(s.coinsCollected);
        }

        if (c.x < -40 || c.collected) {
          s.crystals.splice(i, 1);
        }
      }

      setDistance(Math.floor(s.distanceRun));
      setScore(Math.floor(s.distanceRun * 10 + s.coinsCollected * 50));

      // 2. Render Scene
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Gradient (Cyber Steppe Night)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#070b19');
      bgGrad.addColorStop(0.7, '#0f172a');
      bgGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant Cyber Mountains
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      for (let x = 0; x <= canvas.width; x += 120) {
        const mHeight = 80 + Math.sin(x * 0.01 + tick * 0.005) * 35;
        ctx.lineTo(x, s.groundY - mHeight);
      }
      ctx.lineTo(canvas.width, s.groundY);
      ctx.closePath();
      ctx.fill();

      // Neon Cyber Ground Grid
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, s.groundY, canvas.width, canvas.height - s.groundY);

      // Glowing Ground Line (Meander style)
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(canvas.width, s.groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving Grid Markings on Ground
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.lineWidth = 1.5;
      const gridOffset = (tick * s.speed) % 40;
      for (let x = -gridOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, s.groundY);
        ctx.lineTo(x - 30, canvas.height);
        ctx.stroke();
      }

      // Draw Crystals (Golden Ulzii Gems)
      for (const c of s.crystals) {
        ctx.save();
        ctx.translate(c.x + 10, c.y + 10);
        ctx.rotate((tick * 0.05) % (Math.PI * 2));
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        // Diamond gem
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(9, 0);
        ctx.lineTo(0, 9);
        ctx.lineTo(-9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw Obstacles
      for (const obs of s.obstacles) {
        if (obs.type === 'spike') {
          // Cyber Barrier Spikes
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Floating Glitch Drone
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 8);
          ctx.fill();

          // Red Drone Eye
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Player (Tuulai - Cyber Rabbit Runner)
      const pX = 85;
      const pHeight = s.isDucking ? 26 : 56;
      const pY = s.groundY - pHeight + s.playerY;

      ctx.save();
      if (s.invincibleTimer > 0 && tick % 6 < 3) {
        ctx.globalAlpha = 0.4;
      }

      // Rabbit Cyber Aura
      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.beginPath();
      ctx.ellipse(pX + 18, pY + pHeight / 2, 28, pHeight / 2 + 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deel Body
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.roundRect(pX, pY + (s.isDucking ? 0 : 18), 36, s.isDucking ? 26 : 38, 8);
      ctx.fill();

      // Golden Belt
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(pX + 2, pY + (s.isDucking ? 10 : 36), 32, 5);

      if (!s.isDucking) {
        // Head
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(pX + 18, pY + 14, 15, 0, Math.PI * 2);
        ctx.fill();

        // Tall Bunny Ears
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(pX + 8, pY - 18, 6, 20, 3);
        ctx.roundRect(pX + 20, pY - 18, 6, 20, 3);
        ctx.fill();

        // Inner Pink Ears
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(pX + 9.5, pY - 14, 3, 14);
        ctx.fillRect(pX + 21.5, pY - 14, 3, 14);

        // Cute Eye
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(pX + 24, pY + 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, difficulty, onGameOver]);

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      {/* Top HUD Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900/90 border border-cyan-400/30 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Амь:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>{coins} талст</span>
          </div>
          <div className="text-cyan-300 font-bold">
            <span>{distance} м</span>
          </div>
          <div className="text-white font-black text-sm">
            <span>{score} ОНОО</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-400/40 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={680}
          height={320}
          className="block w-full max-w-2xl h-auto"
        />

        {/* Start / Overlay Screen */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            {isGameOver ? (
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">АЯЛАЛ ӨНДӨРЛӨВ!</h3>
                <p className="text-sm text-slate-300">
                  Нийт оноо: <strong className="text-amber-400">{score}</strong> · Зай:{' '}
                  <strong className="text-cyan-300">{distance}м</strong>
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-cyan-400/30 hover:bg-cyan-300 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> ДАХИН ТОГЛОХ (SPACE)
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <div className="inline-flex p-3 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  Сэргэлэн Туулайн Сансрын Гүйлт
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Лазер хаалт, нисдэг дронуудаас үсрэн бултаж, эрчим хүчний талстуудыг цуглуул.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-cyan-300">
                  <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-white/10">
                    <ArrowUp className="w-3.5 h-3.5" /> Үсрэх: Space / W
                  </span>
                  <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-white/10">
                    <ArrowDown className="w-3.5 h-3.5" /> Гулгах: S / Сум
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

      {/* On-screen touch / mobile friendly controls */}
      <div className="flex items-center justify-center gap-4 pt-1 sm:hidden">
        <button
          onTouchStart={() => duck(true)}
          onTouchEnd={() => duck(false)}
          className="px-6 py-3 rounded-xl bg-slate-800 border border-white/20 text-white font-bold text-xs"
        >
          ГУЛГАХ (DOWN)
        </button>
        <button
          onClick={jump}
          className="px-8 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs"
        >
          ҮСРЭХ (JUMP)
        </button>
      </div>
    </div>
  );
};
