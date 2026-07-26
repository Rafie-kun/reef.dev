'use client';

import { useEffect, useState } from 'react';
import { FriendBadge } from '@/lib/types';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

export default function FriendsSection() {
  const [badges, setBadges] = useState<FriendBadge[]>([]);

  useEffect(() => {
    fetch('/api/cms/friends').then(r => r.ok && r.json()).then(d => setBadges(d?.friends ?? [])).catch(() => {});
  }, []);

  return (
    <section id="friends" className="mc-section" style={{textAlign:'center'}}>
      <h2 className="mc-section-title" style={{justifyContent:'center'}}>
        <McIcon name="mc-globe" size={20} /> [ Friends &amp; Allies ]
      </h2>
      <div className="mc-friends-grid" style={{justifyContent:'center'}}>
        {(badges.length === 0 ? Array.from({length:6}, (_,i) => ({id:`p-${i}`,name:'???',url:'#',imageUrl:''})) : badges).map(badge => (
          <a key={badge.id} href={badge.url} target="_blank" rel="noopener noreferrer" className="mc-badge"
            onClick={() => audio.play('click')} onMouseEnter={() => audio.play('badge-hover')}>
            {badge.imageUrl && !badge.imageUrl.includes('placeholder') ? (
              <img src={badge.imageUrl} alt={badge.name} width={88} height={31} style={{imageRendering:'pixelated',display:'block'}} />
            ) : (
              <div className="mc-badge-placeholder">
                <McIcon name="mc-unknown" size={12} />
              </div>
            )}
          </a>
        ))}
      </div>
      <a href="https://discord.com/users/744808879036170272" target="_blank" rel="noopener noreferrer" className="mc-btn" style={{marginTop:20}}
        onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
        <McIcon name="mc-chat" size={14} /> Say hi!
      </a>
    </section>
  );
}
