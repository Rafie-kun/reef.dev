'use client';

import { audio } from '@/lib/audio';

interface MinecraftButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

export default function MinecraftButton({ children, onClick, href, className = '', disabled }: MinecraftButtonProps) {
  const handleClick = () => {
    audio.play('click');
    onClick?.();
  };

  const baseStyle =
    'mc-btn inline-block select-none text-center font-pixel text-xs leading-none cursor-pointer ' +
    'px-4 py-2 transition-all duration-75 active:scale-[0.97] ' +
    (disabled ? 'opacity-50 cursor-not-allowed' : '');

  const combined = `${baseStyle} ${className}`;

  if (href && !disabled) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combined} onClick={() => audio.play('click')}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={handleClick} className={combined} disabled={disabled}>
      {children}
    </button>
  );
}
