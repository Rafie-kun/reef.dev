'use client';

import { useEffect, useState } from 'react';
import McIcon from './McIcon';

export default function FriendsSection() {
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cms/friends').then(r => r.ok && r.json()).then(d => setBadges(d?.friends ?? [])).catch(() => {});
  }, []);

  const list = badges.length === 0
    ? Array.from({length:6}, (_,i) => ({id:`p-${i}`,name:'???',url:'#',imageUrl:''}))
    : badges;

  return (
    <section id="friends" className="mc-section" style={{textAlign:'center'}}>
      <h2 className="mc-section-title" style={{justifyContent:'center'}}><McIcon name="mc-globe" size={18} /> Friends &amp; Allies</h2>
      <div className="mc-badge-grid" style={{justifyContent:'center'}}>
        {list.map((badge: any) => (
          <a key={badge.id} href={badge.url} target="_blank" rel="noopener noreferrer" className="mc-badge">
            {badge.imageUrl && !badge.imageUrl.includes('placeholder') ? (
              <img src={badge.imageUrl} alt={badge.name} width={88} height={31} style={{display:'block'}} />
            ) : (
              <div className="mc-badge-placeholder">???</div>
            )}
          </a>
        ))}
      </div>
      <a href="https://discord.com/users/744808879036170272" target="_blank" rel="noopener noreferrer" className="mc-btn" style={{marginTop:20}}>Say hi!</a>
    </section>
  );
}
