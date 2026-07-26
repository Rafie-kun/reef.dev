'use client';

import { McIconName, renderMcIcon } from '@/lib/icons';

interface McIconProps {
  name: McIconName;
  size?: number;
  className?: string;
}

export default function McIcon({ name, size = 16, className = '' }: McIconProps) {
  return (
    <span
      className={`inline-block align-middle ${className}`}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
        flexShrink: 0,
      }}
    >
      {renderMcIcon(name)}
    </span>
  );
}
