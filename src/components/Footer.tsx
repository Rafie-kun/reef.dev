'use client';

import { useEffect, useState } from 'react';
import { audio } from '@/lib/audio';

const EASTER_EGGS = [
  'Also try Limbo!', 'Also try sleeping!', 'Also try touching grass!',
  'Also try the End!', 'Also try the Nether!', 'Also try a double jump!',
];

export default function Footer() {
  const [eggIndex, setEggIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setEggIndex(prev => (prev + 1) % EASTER_EGGS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mc-footer">
      <p className="mc-copyright">&copy; Reef 2026. Do not distribute!</p>
      <p style={{fontFamily:"'VT323',monospace",fontSize:16,color:'#555',marginBottom:16}}>{EASTER_EGGS[eggIndex]}</p>
      <div style={{display:'flex',justifyContent:'center',gap:12}}>
        <button className="mc-sound-toggle" onClick={() => { audio.toggleMute(); audio.play('click'); }}
          onMouseEnter={() => audio.play('hover')} aria-label="Toggle sound" title="Toggle sound">
          🔊
        </button>
        <button onClick={() => { window.scrollTo({top:0,behavior:'smooth'}); audio.play('click'); }}
          onMouseEnter={() => audio.play('hover')}
          style={{width:44,height:44,borderRadius:'50%',border:'2px solid #9B59B6',background:'rgba(155,89,182,0.2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#D2B4DE',fontSize:20}}
          aria-label="Back to top" title="Back to top (Ender Pearl)">
          ▲
        </button>
      </div>
    </footer>
  );
}
