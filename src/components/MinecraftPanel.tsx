'use client';

interface MinecraftPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'panel' | 'slot' | 'tooltip';
}

export default function MinecraftPanel({ children, className = '', variant = 'panel' }: MinecraftPanelProps) {
  const variants = {
    panel: 'border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88] border-b-[#00000088] border-r-[#00000088] bg-[rgba(0,0,0,0.7)]',
    slot: 'border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] bg-[#8B8B8B]',
    tooltip: 'border-2 border-[#8B008B] bg-[#1a001a] text-[#E0E0E0]',
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
