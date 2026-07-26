'use client';

import { useEffect, useState } from 'react';
import { useLanyard } from '@/lib/lanyard';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

const STATUS_LABEL: Record<string, string> = {
  online: 'Online', idle: 'Idle', dnd: 'Do Not Disturb', offline: 'Offline',
};

export default function DiscordWidget() {
  const { data, connected } = useLanyard();
  const [profile, setProfile] = useState<{ avatarUrl: string; username?: string; globalName?: string } | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetch('/api/discord').then(r => r.ok && r.json()).then(d => { if (d) setProfile(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const status = data?.discord_status ?? 'offline';
  const spotify = data?.spotify ?? null;
  const game = data?.activities?.find(a => a.type === 0) ?? null;
  const isActive = status !== 'offline';

  let progress = 0;
  if (spotify) {
    const elapsed = now - spotify.timestamps.start;
    const total = spotify.timestamps.end - spotify.timestamps.start;
    progress = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;
  }

  return (
    <section className="mc-section" style={{maxWidth:500}}>
      <h2 className="mc-section-title"><McIcon name="mc-discord" size={20} /> Presence</h2>
      <div className="mc-presence-card" onClick={() => audio.play('click')}>
        {!connected && (
          <div style={{background:'#B8860B',padding:'4px 12px',fontFamily:"'VT323',monospace",fontSize:16,color:'#FFF',marginBottom:12,textAlign:'center'}}>
            Reconnecting...
          </div>
        )}
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{position:'relative',width:64,height:64,flexShrink:0}}>
            <img src={profile?.avatarUrl || '/api/discord'} alt="" style={{width:64,height:64,imageRendering:'pixelated',border:'2px solid #555'}} />
            <div className={`mc-status-dot ${status}`} style={{bottom:2,right:2}} />
          </div>
          <div>
            <h3 style={{fontFamily:"'Press Start 2P',monospace",fontSize:11,color:'#FFF'}}>
              {profile?.globalName ?? profile?.username ?? 'Reef'}
            </h3>
            <p style={{fontFamily:"'VT323',monospace",fontSize:18,color:'#AAA'}}>{STATUS_LABEL[status] ?? 'Offline'}</p>
          </div>
        </div>

        {game && !spotify && (
          <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid #333',display:'flex',gap:8}}>
            <McIcon name="mc-controller" size={16} />
            <div>
              <p style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:'#FFD700'}}>{game.name}</p>
              {game.state && <p style={{fontFamily:"'VT323',monospace",fontSize:16,color:'#CCC'}}>{game.state}</p>}
            </div>
          </div>
        )}

        {spotify && (
          <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid #333',display:'flex',gap:12}}>
            <div style={{position:'relative',width:56,height:56,flexShrink:0}}>
              <img src={spotify.album_art_url} alt={spotify.album} style={{width:56,height:56,imageRendering:'pixelated'}} />
              <div style={{position:'absolute',top:-8,right:-8,width:16,height:16,animation:'spin-record 3s linear infinite'}}>
                <McIcon name="mc-noteblock" size={14} />
              </div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:'#1DB954'}} className="mc-repo-name">{spotify.song}</p>
              <p style={{fontFamily:"'VT323',monospace",fontSize:16,color:'#CCC'}}>{spotify.artist}</p>
              <div className="mc-xp-bar" style={{marginTop:8}}>
                <div className="mc-xp-fill" style={{width:`${progress}%`}} />
              </div>
            </div>
          </div>
        )}

        {!game && !spotify && status === 'offline' && (
          <p style={{fontFamily:"'VT323',monospace",fontSize:16,color:'#666',marginTop:12,textAlign:'center'}}>Offline</p>
        )}
      </div>
    </section>
  );
}
