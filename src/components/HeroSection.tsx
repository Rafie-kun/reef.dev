'use client';

import { useEffect, useState } from 'react';
import { audio } from '@/lib/audio';

const EASTER_EGGS = [
  'Also try touching grass!',
  'Also try sleeping!',
  'Also try GitHub!',
  'Also try talking to Reef!',
  'Also try Limbo!',
];

export default function HeroSection() {
  const [eggIndex, setEggIndex] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetch('/api/discord').then(r => r.ok && r.json()).then(d => { if (d?.avatarUrl) setAvatarUrl(d.avatarUrl); }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setEggIndex(prev => (prev + 1) % EASTER_EGGS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="mc-hero">
      <h1 className="mc-logo">REEF</h1>
      <p className="mc-subtitle">// personal site &amp; portfolio</p>

      <div className="mc-avatar-frame">
        <a href="https://discord.com/users/744808879036170272" target="_blank" rel="noopener noreferrer"
          onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
          <img
            src={avatarUrl || '/api/discord'}
            alt="Reef"
            width={96}
            height={96}
          />
        </a>
      </div>

      <p className="mc-also-try">{EASTER_EGGS[eggIndex]}</p>
    </section>
  );
}
