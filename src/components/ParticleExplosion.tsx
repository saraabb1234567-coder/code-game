import React, { useEffect, useRef } from 'react';

export interface ExplosionTrigger {
  id: string;
  x: number; // percentage or px
  y: number;
  color?: string;
  scoreText?: string;
  comboText?: string;
}

interface ParticleExplosionProps {
  explosions: ExplosionTrigger[];
  onComplete?: (id: string) => void;
}

export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({
  explosions,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || explosions.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }

    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
    }

    interface FloatText {
      id: string;
      x: number;
      y: number;
      score: string;
      combo?: string;
      alpha: number;
      vy: number;
    }

    const particles: Particle[] = [];
    const shockwaves: Shockwave[] = [];
    const floatTexts: FloatText[] = [];

    const colors = ['#44e5d4', '#38bdf8', '#a855f7', '#f43f5e', '#facc15', '#ffffff'];

    // Spawn burst for each explosion
    explosions.forEach(exp => {
      const originX = (exp.x / 100) * canvas.width;
      const originY = (exp.y / 100) * canvas.height;

      // Shockwave
      shockwaves.push({
        x: originX,
        y: originY,
        radius: 10,
        maxRadius: 80,
        alpha: 0.9,
        color: exp.color || '#44e5d4',
      });

      // 40 particles
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3.5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
        });
      }

      // Floating Score Text
      if (exp.scoreText) {
        floatTexts.push({
          id: exp.id,
          x: originX,
          y: originY - 15,
          score: exp.scoreText,
          combo: exp.comboText,
          alpha: 1,
          vy: -1.8,
        });
      }
    });

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 3.5;
        sw.alpha -= 0.04;
        if (sw.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = sw.color;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Render & update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render & update floating text
      for (let i = floatTexts.length - 1; i >= 0; i--) {
        const ft = floatTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;

        if (ft.alpha <= 0) {
          onComplete?.(ft.id);
          floatTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#44e5d4';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#44e5d4';
        ctx.textAlign = 'center';
        ctx.fillText(ft.score, ft.x, ft.y);

        if (ft.combo) {
          ctx.font = 'black 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.fillText(ft.combo, ft.x, ft.y + 16);
        }
        ctx.restore();
      }

      if (particles.length > 0 || shockwaves.length > 0 || floatTexts.length > 0) {
        animId = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [explosions, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
