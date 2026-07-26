'use client';

import { useEffect } from 'react';
import { audio } from '@/lib/audio';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    audio.init();
    const handleGesture = () => {
      audio.play('page-load');
      document.removeEventListener('click', handleGesture);
    };
    document.addEventListener('click', handleGesture);
    return () => document.removeEventListener('click', handleGesture);
  }, []);

  return (
    <>
      <div className="panorama" />
      <div className="particles">
        {Array.from({length: 20}).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * 10}s`,
            width: i % 3 === 0 ? '6px' : '4px',
            height: i % 3 === 0 ? '6px' : '4px',
          }} />
        ))}
      </div>
      <div style={{position:'relative',zIndex:10}}>{children}</div>
    </>
  );
}
