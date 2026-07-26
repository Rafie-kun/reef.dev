'use client';

import { useEffect, useState } from 'react';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

export default function ContactSection() {
  const [email, setEmail] = useState('reef@example.com');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch('/api/cms/bio').then(r => r.ok && r.json()).then(d => { if (d?.email) setEmail(d.email); }).catch(() => {});
  }, []);

  return (
    <section id="contact" className="mc-section" style={{textAlign:'center',maxWidth:600}}>
      <h2 className="mc-section-title" style={{justifyContent:'center'}}>
        <McIcon name="mc-email" size={20} /> Contact / Connect
      </h2>
      <div className="mc-panel" style={{padding:32}}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{display:'flex',flexDirection:'column',gap:12,alignItems:'center'}}>
          <a href="https://discord.com/users/744808879036170272" target="_blank" rel="noopener noreferrer" className="mc-btn"
            onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
            <McIcon name="mc-discord" size={14} /> DM on Discord
          </a>
          <a href={`mailto:${email}`} className="mc-btn"
            onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
            <McIcon name="mc-email" size={14} /> Email me
          </a>
          <a href="https://github.com/Rafie-kun" target="_blank" rel="noopener noreferrer" className="mc-btn"
            onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
            <McIcon name="mc-github" size={14} /> Follow on GitHub
          </a>
        </div>
        <div style={{marginTop:24,height:48,display:'flex',alignItems:'center',justifyContent:'center',transition:'transform 0.3s',transform:hovered ? 'scale(1.15) translateY(-4px)' : 'scale(1)'}}>
          <McIcon name="mc-email" size={32} />
        </div>
      </div>
    </section>
  );
}
