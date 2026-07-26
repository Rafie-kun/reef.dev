'use client';

import { useState, useEffect } from 'react';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

interface NavSlot {
  id: string;
  label: string;
  icon: string;
}

const SLOTS: NavSlot[] = [
  { id: 'home', label: 'Home', icon: 'mc-home' },
  { id: 'about', label: 'About', icon: 'mc-player' },
  { id: 'projects', label: 'Projects', icon: 'mc-chest' },
  { id: 'library', label: 'Library', icon: 'mc-book' },
  { id: 'friends', label: 'Friends', icon: 'mc-globe' },
  { id: 'contact', label: 'Contact', icon: 'mc-email' },
];

export default function NavHotbar() {
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = SLOTS.map((s) => document.getElementById(s.id)).filter(Boolean);
      let current = 'home';
      for (const el of sections) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200) current = el.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    audio.play('nav-select');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className="
          pointer-events-auto
          mt-3 px-2 py-1.5
          border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
          border-b-[#00000088] border-r-[#00000088]
          bg-[rgba(0,0,0,0.8)]
          flex items-center gap-1
          sm:gap-1.5
        "
      >
        <button
          className="sm:hidden mc-btn p-1 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          onMouseEnter={() => audio.play('hover')}
          aria-label="Toggle navigation"
        >
          <McIcon name="mc-home" size={18} />
        </button>

        <div className={`${mobileOpen ? 'flex' : 'hidden'} sm:flex items-center gap-1 sm:gap-1.5`}>
          {SLOTS.map((slot) => {
            const isActive = active === slot.id;
            return (
              <div
                key={slot.id}
                className="relative"
                onMouseEnter={() => { setHovered(slot.id); audio.play('hover'); }}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  onClick={() => scrollTo(slot.id)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1.5
                    border-2 cursor-pointer transition-colors duration-75
                    font-pixel text-[10px] leading-none
                    ${isActive
                      ? 'border-[#FFD700] bg-[#FFD70022] text-[#FFD700]'
                      : 'border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] bg-[#8B8B8B] text-[#FFF] hover:bg-[#9B9B9B]'
                    }
                  `}
                  style={{ imageRendering: 'pixelated' }}
                >
                  <McIcon name={slot.icon as any} size={12} />
                  <span className="hidden sm:inline">{slot.label}</span>
                </button>
                {hovered === slot.id && !isActive && (
                  <div
                    className="
                      absolute -top-8 left-1/2 -translate-x-1/2
                      whitespace-nowrap px-2 py-0.5
                      border-2 border-[#8B008B] bg-[#1a001a]
                      font-mono-alt text-xs text-[#E0E0E0]
                      pointer-events-none z-50
                    "
                  >
                    {slot.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
