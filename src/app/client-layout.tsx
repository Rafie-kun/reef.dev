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

  return <>{children}</>;
}
