'use client';

import { useEffect, useState } from 'react';
import { useLanyard } from '@/lib/lanyard';
import McIcon from './McIcon';
import { audio } from '@/lib/audio';

const STATUS_LABEL: Record<string, string> = { online:'Online', idle:'Idle', dnd:'Do Not Disturb', offline:'Offline' };

export default function DiscordWidget() {
  const { data, connected } = useLanyard();
  const [profile, setProfile] = useState({ avatarUrl: '', username: '', globalName: '' });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetch('/api/discord').then(r => r.ok && r.json()).then(d => { if (d) setProfile(d); }).catch(() => {});
  }, []);

  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);

  const status = data?.discord_status ?? 'offline';
  const spotify = data?.spotify ?? null;
  const game = data?.activities?.find(a => a.type === 0) ?? null;
  let progress = 0;
  if (spotify) {
    const e = now - spotify.timestamps.start;
    const t = spotify.timestamps.end - spotify.timestamps.start;
    progress = t > 0 ? Math.min((e / t) * 100, 100) : 0;
  }

  const name = profile.globalName || profile.username || 'Reef';

  return (
    <section className="mc-section" style={{ maxWidth: 500 }}>
      <h2 className="mc-section-title"><McIcon name="mc-discord" size={18} /> Presence</h2>
      <div className="mc-presence-card">
        {!connected && (
          <div style={{ background: '#B8860B', padding: '4px 12px', fontFamily: "'VT323', monospace", fontSize: 16, color: '#FFF', marginBottom: 12, textAlign: 'center' }}>
            Reconnecting...
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
          <div style={{ width: 64, height: 64, position: 'relative' }}>
            <img src={profile.avatarUrl || '/api/discord'} alt="" style={{ width: 64, height: 64, imageRendering: 'pixelated', border: '4px solid var(--mc-stone)' }} />
            <div className={`mc-status-dot ${status}`} />
          </div>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: '#FFF' }}>{name}</div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: '#AAA' }}>{STATUS_LABEL[status]}</div>
          </div>
        </div>

        {game && !spotify && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <div style={{ marginTop: 2 }}><McIcon name="mc-controller" size={16} /></div>
            <div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#FFD700' }}>{game.name}</div>
              {game.state && <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: '#CCC' }}>{game.state}</div>}
            </div>
          </div>
        )}

        {spotify && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <img src={spotify.album_art_url} alt="" style={{ width: 56, height: 56 }} />
              <div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#1DB954' }}>{spotify.song}</div>
                <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: '#CCC' }}>{spotify.artist}</div>
                <div className="mc-xp-bar" style={{ marginTop: 8 }}><div className="mc-xp-fill" style={{ width: `${progress}%` }} /></div>
              </div>
            </div>
          </div>
        )}

        {!game && !spotify && status === 'offline' && (
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: '#666', marginTop: 12, textAlign: 'center' }}>Offline</div>
        )}
      </div>
    </section>
  );
}
