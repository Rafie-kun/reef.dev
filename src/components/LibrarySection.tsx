'use client';

import { useEffect, useState } from 'react';
import { LibraryItem } from '@/lib/types';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

const TABS = [
  { id: 'games' as const, label: 'Games', icon: 'mc-controller' },
  { id: 'music' as const, label: 'Music', icon: 'mc-noteblock' },
  { id: 'projects' as const, label: 'Projects', icon: 'mc-chest' },
  { id: 'reading' as const, label: 'Reading', icon: 'mc-book' },
];

export default function LibrarySection() {
  const [activeTab, setActiveTab] = useState<'games' | 'music' | 'projects' | 'reading'>('games');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cms/library')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.library ?? [];
        setItems(list);
      })
      .catch(() => {});
  }, []);

  const filtered = items.filter((item) => item.tab === activeTab);

  const handleTabChange = (tab: typeof activeTab) => {
    audio.play('tab-switch');
    setActiveTab(tab);
  };

  return (
    <section id="library" className="relative px-4 py-20 max-w-6xl mx-auto">
      <h2 className="font-pixel text-xl text-[#FFD700] mb-6 flex items-center gap-3">
        <McIcon name="mc-chest" size={24} />
        Library
      </h2>

      <div className="flex gap-1 mb-6 flex-wrap">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              onMouseEnter={() => audio.play('hover')}
              className={`
                flex items-center gap-1.5 px-3 py-2
                font-pixel text-[10px] leading-none
                border-2 cursor-pointer transition-colors duration-75
                ${isActive
                  ? 'border-[#FFD700] bg-[#FFD70022] text-[#FFD700]'
                  : 'border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] bg-[#8B8B8B] text-[#FFF] hover:bg-[#9B9B9B]'
                }
              `}
            >
              <McIcon name={tab.icon as any} size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="
            p-10 text-center
            border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
            border-b-[#00000088] border-r-[#00000088]
            bg-[rgba(0,0,0,0.7)]
          "
        >
          <McIcon name="mc-unknown" size={40} />
          <p className="font-mono-alt text-[#AAA] mt-3">Nothing here yet...</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="
                  p-2
                  border-2 border-t-[#00000088] border-l-[#00000088]
                  border-b-[#FFFFFF44] border-r-[#FFFFFF44]
                  bg-[#8B8B8B] hover:bg-[#9B9B9B]
                  transition-colors duration-75
                  cursor-pointer
                "
              >
                <div
                  className="
                    w-full aspect-square mb-2
                    border border-[#00000088] bg-[#00000044]
                    overflow-hidden
                  "
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <McIcon name="mc-unknown" size={24} />
                    </div>
                  )}
                </div>
                <p className="font-pixel text-[10px] text-[#FFF] truncate">{item.title}</p>
              </div>
              {hovered === item.id && (
                <div
                  className="
                    absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full
                    w-48 p-2 z-50
                    border-2 border-[#8B008B] bg-[#1a001a]
                    font-mono-alt text-xs text-[#E0E0E0]
                    pointer-events-none
                  "
                >
                  <p className="font-semibold">{item.title}</p>
                  {item.description && <p className="text-[#AAA] mt-1 text-[11px]">{item.description}</p>}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-1 bg-[#333] text-[#CCC]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
