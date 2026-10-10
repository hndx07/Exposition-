import React, { useEffect, useState } from 'react';

interface SparkleOverlayProps {
  show: boolean;
  message?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const SparkleOverlay: React.FC<SparkleOverlayProps> = ({ show, message }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#FFF1B8', '#FFD6C9', '#CDEFD9', '#CFE6FF', '#E3D4FF'];
      const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 60,
        size: 16 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute anim-sparkle select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: p.color,
          }}
        >
          🔥
        </div>
      ))}

      {message && (
        <div className="bg-[#3B3355]/95 border-3 border-[#FFF1B8] text-[#FFF1B8] px-5 py-3 rounded-3xl shadow-2xl font-heading font-extrabold text-sm tracking-wide anim-bob text-center">
          {message}
        </div>
      )}
    </div>
  );
};
