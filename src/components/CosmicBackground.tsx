import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundProps {
  warpSpeed?: boolean;
  intensity?: 'normal' | 'intense' | 'crimson' | 'purple';
  reducedMotion?: boolean;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  warpSpeed = false,
  intensity = 'normal',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Starfield in 3D
    const STAR_COUNT = reducedMotion ? 60 : 180;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * 1000 + 1,
      size: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.4 ? '#44e5d4' : Math.random() > 0.5 ? '#a855f7' : '#ffffff',
    }));

    // Floating stardust particles
    const DUST_COUNT = reducedMotion ? 15 : 40;
    const dustParticles = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const render = () => {
      // Ease mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const parallaxOffsetX = (mouseX - width / 2) * 0.04;
      const parallaxOffsetY = (mouseY - height / 2) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Starfield rendering with 3D projection
      const speed = reducedMotion ? 0.3 : warpSpeed ? 14 : 1.2;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 300 / star.z;
        const px = star.x * k + width / 2 + parallaxOffsetX;
        const py = star.y * k + height / 2 + parallaxOffsetY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const starSize = Math.max(0.5, star.size * k * 0.8);
          const alpha = Math.min(1, Math.max(0.1, (1000 - star.z) / 800));

          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;

          if (warpSpeed && !reducedMotion) {
            // Motion blur streak during warp/combo
            const prevK = 300 / (star.z + speed * 2.5);
            const prevPx = star.x * prevK + width / 2 + parallaxOffsetX;
            const prevPy = star.y * prevK + height / 2 + parallaxOffsetY;

            ctx.beginPath();
            ctx.strokeStyle = star.color;
            ctx.lineWidth = starSize;
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, starSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Gentle drifting cosmic dust
      if (!reducedMotion) {
        ctx.fillStyle = intensity === 'crimson' ? '#f43f5e' : '#38bdf8';
        for (let i = 0; i < dustParticles.length; i++) {
          const p = dustParticles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.globalAlpha = p.alpha * 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [warpSpeed, intensity, reducedMotion]);

  // Color theme overlays based on intensity/level
  const nebulaGlow =
    intensity === 'crimson'
      ? 'from-rose-950/20 via-purple-950/20 to-slate-950/95'
      : intensity === 'purple'
      ? 'from-indigo-950/30 via-purple-950/20 to-slate-950/95'
      : intensity === 'intense'
      ? 'from-cyan-950/35 via-indigo-950/30 to-slate-950/95'
      : 'from-blue-950/20 via-slate-950/40 to-slate-950/95';

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Subtle Mongolian Celestial Constellation Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-12 pointer-events-none">
        <svg
          width="800"
          height="800"
          viewBox="0 0 800 800"
          className="w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] animate-spin"
          style={{ animationDuration: '180s' }}
        >
          <circle cx="400" cy="400" r="380" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 8" fill="none" />
          <circle cx="400" cy="400" r="260" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2 6" fill="none" />
          <circle cx="400" cy="400" r="140" stroke="#38bdf8" strokeWidth="0.8" fill="none" />
          {/* 12 Celestial Zodiac Coordinates */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 400 + 380 * Math.cos(rad);
            const y = 400 + 380 * Math.sin(rad);
            const xInner = 400 + 140 * Math.cos(rad);
            const yInner = 400 + 140 * Math.sin(rad);
            return (
              <g key={i}>
                <line x1={xInner} y1={yInner} x2={x} y2={y} stroke="#22d3ee" strokeWidth="0.5" opacity="0.6" />
                <circle cx={x} cy={y} r="3" fill="#fbbf24" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Vignette border */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,8,19,0.85)_100%)] pointer-events-none" />
    </div>
  );
};
