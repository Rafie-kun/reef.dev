'use client';

import { useEffect, useState } from 'react';
import McIcon from './McIcon';

export default function ContactSection() {
  const [email, setEmail] = useState('reef@example.com');

  useEffect(() => {
    fetch('/api/cms/bio').then(r => r.ok && r.json()).then(d => { if (d?.email) setEmail(d.email); }).catch(() => {});
  }, []);

  return (
    <section id="contact" className="mc-section" style={{textAlign:'center',maxWidth:600}}>
      <h2 className="mc-section-title" style={{justifyContent:'center'}}><McIcon name="mc-email" size={18} /> Contact / Connect</h2>
      <div className="mc-panel" style={{padding:32}}>
        <div style={{display:'flex',flexDirection:'column',gap:12,alignItems:'center'}}>
          <a href="https://discord.com/users/744808879036170272" target="_blank" rel="noopener noreferrer" className="mc-btn">
            DM on Discord
          </a>
          <a href={`mailto:${email}`} className="mc-btn">
            Email me
          </a>
          <a href="https://github.com/Rafie-kun" target="_blank" rel="noopener noreferrer" className="mc-btn">
            Follow on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
