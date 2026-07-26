'use client';

import { useState, useEffect } from 'react';
import { audio } from '@/lib/audio';

const SLOTS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: '📖' },
  { id: 'projects', label: 'Projects', icon: '⚔️' },
  { id: 'library', label: 'Library', icon: '📦' },
  { id: 'friends', label: 'Friends', icon: '👥' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
];

export default function NavHotbar() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      let current = 'home';
      for (const s of SLOTS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 200) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="mc-hotbar">
      {SLOTS.map((slot) => (
        <a
          key={slot.id}
          href={`#${slot.id}`}
          className={`mc-hotbar-slot ${active === slot.id ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            audio.play('click');
            document.getElementById(slot.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          onMouseEnter={() => audio.play('hover')}
        >
          <span style={{fontSize: '20px', imageRendering: 'pixelated'}}>{slot.icon}</span>
          <span>{slot.label}</span>
        </a>
      ))}
    </nav>
  );
}
