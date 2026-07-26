'use client';

import { useEffect } from 'react';

function Particle({ index }: { index: number }) {
  const size = 2 + (index % 3);
  const left = `${(index * 7.3 + 13) % 100}%`;
  const delay = `${(index * 1.7) % 15}s`;
  const duration = `${12 + (index % 8)}s`;
  const opacity = 0.15 + (index % 5) * 0.05;
  return (
    <div
      className="absolute rounded-sm"
      style={{
        width: size,
        height: size,
        left,
        bottom: '-4px',
        opacity,
        backgroundColor: '#fff',
        animation: `panorama-float ${duration} linear ${delay} infinite`,
      }}
    />
  );
}

export default function PanoramaBackground() {
  useEffect(() => {
    if (document.getElementById('panorama-keyframes')) return;
    const sheet = document.createElement('style');
    sheet.id = 'panorama-keyframes';
    sheet.textContent = `
      @keyframes panorama-sky {
        0%   { background-position: 0% 0%; }
        50%  { background-position: 0% 100%; }
        100% { background-position: 0% 0%; }
      }
      @keyframes panorama-float {
        0%   { transform: translateY(0) translateX(0); opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
      }
    `;
    document.head.appendChild(sheet);
    return () => {
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
    };
  }, []);

  const particles = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="fixed inset-0 -z-1 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              #0a0a2e 0%,
              #1a1a4e 10%,
              #2a1a4e 20%,
              #4a2a3e 30%,
              #7a3a2e 40%,
              #b05a2a 50%,
              #d47a2a 55%,
              #e89a3a 60%,
              #b05a2a 65%,
              #7a3a2e 70%,
              #2a1a4e 85%,
              #0a0a2e 100%
            )
          `,
          backgroundSize: '100% 200%',
          animation: 'panorama-sky 30s ease-in-out infinite',
        }}
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)]" />
      {particles.map((i) => (
        <Particle key={i} index={i} />
      ))}
    </div>
  );
}
