'use client';

import { useState, useEffect } from 'react';

const EASTER_EGGS = [
  'Also try Limbo!', 'Also try sleeping!', 'Also try touching grass!',
  'Also try the End!', 'Also try the Nether!',
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
      <button className="mc-btn" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>▲ Back to top</button>
    </footer>
  );
}
