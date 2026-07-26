'use client';

interface MinecraftPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'panel' | 'dark' | 'slot';
}

export default function MinecraftPanel({ children, className = '', variant = 'panel' }: MinecraftPanelProps) {
  const variants = {
    panel: 'mc-panel',
    dark: 'mc-panel-dark',
    slot: 'mc-slot',
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
