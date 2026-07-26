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

  const baseStyle = 'mc-btn ' + (disabled ? 'opacity-50 cursor-not-allowed' : '');
  const combined = `${baseStyle} ${className}`;

  if (href && !disabled) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combined} onClick={() => audio.play('click')}
        onMouseEnter={() => audio.play('hover')}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={handleClick} className={combined} disabled={disabled}
      onMouseEnter={() => audio.play('hover')}>
      {children}
    </button>
  );
}
