'use client';

import { useState, useEffect } from 'react';

const SLOTS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'library', label: 'Library' },
  { id: 'friends', label: 'Friends' },
  { id: 'contact', label: 'Contact' },
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
            document.getElementById(slot.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {slot.label}
        </a>
      ))}
    </nav>
  );
}
