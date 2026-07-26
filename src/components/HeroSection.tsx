'use client';

import { useEffect, useState } from 'react';
import { audio } from '@/lib/audio';
import { useLanyard } from '@/lib/lanyard';
import { CMSEasterEgg } from '@/lib/types';
import McIcon from './McIcon';

const STATUS = { online: 'online', idle: 'idle', dnd: 'dnd', offline: 'offline' } as const;

export default function HeroSection() {
  const { data: lanyard } = useLanyard();
  const [eggs, setEggs] = useState<CMSEasterEgg[]>([]);
  const [eggIndex, setEggIndex] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    audio.play('section-enter');
    fetch('/api/cms/easter-eggs').then(r => r.ok && r.json()).then(d => setEggs(d?.easterEggs ?? [])).catch(() => {});
    fetch('/api/discord').then(r => r.ok && r.json()).then(d => { if (d?.avatarUrl) setAvatarUrl(d.avatarUrl); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (eggs.length <= 1) return;
    const interval = setInterval(() => setEggIndex(prev => (prev + 1) % eggs.length), 4000);
    return () => clearInterval(interval);
  }, [eggs.length]);

  const status = (lanyard?.discord_status ?? 'offline') as keyof typeof STATUS;
  const spotify = lanyard?.spotify ?? null;
  const game = lanyard?.activities?.find(a => a.type === 0) ?? null;
  const activity = spotify
    ? { name: '🎵 Spotify', details: `${spotify.song} — ${spotify.artist}` }
    : game ? { name: `🎮 ${game.name}`, details: game.state ?? game.details ?? '' } : null;

  return (
    <section id="home" className="mc-hero">
      <h1 className="mc-logo">REEF</h1>
      <p className="mc-subtitle">// personal site &amp; portfolio</p>

      <div className="mc-avatar-frame" style={{ marginTop: 16 }}>
        <a href="https://discord.com/users/744808879036170272" target="_blank" rel="noopener noreferrer"
           onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
          <img src={avatarUrl || '/api/discord'} alt="Reef" />
          <div className={`mc-status-dot ${STATUS[status]}`} />
        </a>
      </div>

      {activity && (
        <div className="mc-panel" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 400 }}
             onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
          <McIcon name="mc-noteblock" size={16} />
          <span style={{fontFamily: "'VT323', monospace", fontSize: 18}}>{activity.name}:</span>
          <span style={{fontFamily: "'VT323', monospace", fontSize: 16, color: '#AAA'}}>{activity.details}</span>
        </div>
      )}

      {eggs.length > 0 && (
        <p className="mc-also-try" style={{marginTop: 24}}>{eggs[eggIndex]?.phrase ?? ''}</p>
      )}
    </section>
  );
}
