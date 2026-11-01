import React, { useEffect, useRef } from 'react';
import { TargetEnemy } from '../types';
import { AnimatedMascot } from './AnimatedMascot';
import { ToonoRing, UlziiKhee } from './MongolianOrnaments';

interface CodeCrystalTargetProps {
  target: TargetEnemy;
  isCurrent: boolean;
  typedLength: number;
  onClick?: () => void;
}

export const CodeCrystalTarget: React.FC<CodeCrystalTargetProps> = ({
  target,
  isCurrent,
  typedLength,
  onClick,
}) => {
  const crystalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = crystalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = Math.random() * Math.PI * 2;
    const size = 64;
    canvas.width = size;
    canvas.height = size;

    // 3D Polyhedron vertices (Octahedron energy crystal)
    const vertices = [
      { x: 0, y: -22, z: 0 }, // Top
      { x: 15, y: 0, z: 15 }, // Front right
      { x: -15, y: 0, z: 15 }, // Front left
      { x: -15, y: 0, z: -15 }, // Back left
      { x: 15, y: 0, z: -15 }, // Back right
      { x: 0, y: 22, z: 0 }, // Bottom
    ];

    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4], // Top to equator
      [5, 1], [5, 2], [5, 3], [5, 4], // Bottom to equator
      [1, 2], [2, 3], [3, 4], [4, 1], // Equator ring
    ];

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      angle += isCurrent ? 0.04 : 0.015;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosB = Math.cos(angle * 0.7);
      const sinB = Math.sin(angle * 0.7);

      const projected = vertices.map((v) => {
        // Rotate Y
        const x1 = v.x * cosA - v.z * sinA;
        const z1 = v.x * sinA + v.z * cosA;
        // Rotate X
        const y2 = v.y * cosB - z1 * sinB;
        const z2 = v.y * sinB + z1 * cosB;

        const fov = 100;
        const scale = fov / (fov + z2 + 25);
        return {
          x: x1 * scale + size / 2,
          y: y2 * scale + size / 2,
          z: z2,
        };
      });

      // Draw glowing core
      const coreColor = isCurrent ? '#22d3ee' : '#fbbf24';
      ctx.save();
      ctx.fillStyle = coreColor;
      ctx.shadowBlur = isCurrent ? 22 : 10;
      ctx.shadowColor = coreColor;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, isCurrent ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw wireframe edges
      ctx.save();
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = isCurrent ? 1.8 : 1.0;
      ctx.globalAlpha = isCurrent ? 0.9 : 0.6;
      ctx.shadowBlur = isCurrent ? 14 : 5;
      ctx.shadowColor = coreColor;

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i].x, projected[i].y);
        ctx.lineTo(projected[j].x, projected[j].y);
        ctx.stroke();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isCurrent]);

  const targetCode = target.code;

  return (
    <div
      onClick={onClick}
      style={{ left: `${target.x}%`, top: `${target.y}%` }}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 select-none ${
        isCurrent ? 'scale-115 z-20' : 'scale-90 opacity-75 z-10 hover:opacity-100 hover:scale-95'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Mascot Rider on Crystal Beacon */}
        <div className="relative">
          <AnimatedMascot
            imageSrc={target.monsterImage}
            zodiacId={target.zodiacId}
            name={target.monsterType}
            size="sm"
            mood={isCurrent ? 'happy' : 'idle'}
            showParticles={isCurrent}
            className="transform -translate-y-1"
          />

          {/* 3D Wireframe Crystal Base beneath Mascot */}
          <div className="flex justify-center -mt-3">
            <canvas ref={crystalCanvasRef} className="block pointer-events-none" />
          </div>

          {/* Mongolian Toono Targeting Halo if Active */}
          {isCurrent && (
            <div className="absolute inset-0 -m-5 flex items-center justify-center pointer-events-none">
              <ToonoRing size={80} spinning color="cyan" />
            </div>
          )}
        </div>

        {/* Code Bubble Hologram with Alkhan accents */}
        <div
          className={`mt-1 px-3.5 py-1.5 rounded-xl font-mono text-xs shadow-xl transition-all flex items-center gap-1.5 ${
            isCurrent
              ? 'bg-[#091129]/95 border-2 border-cyan-400 text-cyan-300 shadow-cyan-400/40 font-bold scale-105'
              : 'bg-slate-950/85 border border-white/15 text-slate-400'
          }`}
        >
          {isCurrent && <UlziiKhee size={12} color="cyan" />}
          {isCurrent ? (
            <span>
              <span className="text-emerald-400 font-bold">
                {targetCode.slice(0, typedLength)}
              </span>
              <span className="text-cyan-200">
                {targetCode.slice(typedLength)}
              </span>
            </span>
          ) : (
            <span>{targetCode}</span>
          )}
        </div>

        {/* Floating Language Tag */}
        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5 font-mono">
          {target.language}
        </span>
      </div>
    </div>
  );
};
