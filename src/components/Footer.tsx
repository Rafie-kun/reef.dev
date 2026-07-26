'use client';

import { useEffect, useState } from 'react';
import SoundToggle from './SoundToggle';

const EASTER_EGGS = [
  'Also try Limbo!',
  'Also try sleeping!',
  'Also try touching grass!',
  'Also try the End!',
  'Also try the Nether!',
  'Also try a double jump!',
];

export default function Footer() {
  const [eggIndex, setEggIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEggIndex((prev) => (prev + 1) % EASTER_EGGS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="
        relative px-4 py-6 mt-8
        border-t-4 border-t-[#FFFFFF88]
        bg-[rgba(0,0,0,0.85)]
      "
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3 text-center">
        <p className="font-pixel text-xs text-[#888]">
          &copy; Reef 2026. Do not distribute!
        </p>

        <p className="font-mono-alt text-sm text-[#555] animate-pulse">
          {EASTER_EGGS[eggIndex]}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={scrollToTop}
            className="
              w-10 h-10 rounded-full
              border-2 border-[#9B59B6]
              bg-[rgba(155,89,182,0.2)]
              flex items-center justify-center
              cursor-pointer
              transition-all duration-150
              hover:bg-[rgba(155,89,182,0.4)]
              hover:shadow-[0_0_12px_rgba(155,89,182,0.6)]
            "
            aria-label="Back to top"
            title="Back to top (Ender Pearl)"
          >
            <svg
              viewBox="0 0 16 16"
              className="w-5 h-5"
              fill="none"
              stroke="#D2B4DE"
              strokeWidth="2"
              strokeLinecap="square"
            >
              <path d="M8 12V4M4 8l4-4 4 4" />
            </svg>
          </button>

          <SoundToggle />
        </div>
      </div>
    </footer>
  );
}
