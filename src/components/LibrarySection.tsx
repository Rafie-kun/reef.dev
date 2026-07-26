'use client';

import { useEffect, useState } from 'react';
import { LibraryItem } from '@/lib/types';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

const TABS = [
  { id: 'games' as const, label: 'Games', icon: '🎮' },
  { id: 'music' as const, label: 'Music', icon: '🎵' },
  { id: 'projects' as const, label: 'Projects', icon: '⚔️' },
  { id: 'reading' as const, label: 'Reading', icon: '📚' },
];

export default function LibrarySection() {
  const [activeTab, setActiveTab] = useState<'games' | 'music' | 'projects' | 'reading'>('games');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cms/library').then(r => r.ok && r.json()).then(d => setItems(d?.library ?? [])).catch(() => {});
  }, []);

  const filtered = items.filter(item => item.tab === activeTab);

  return (
    <section id="library" className="mc-section">
      <h2 className="mc-section-title"><McIcon name="mc-chest" size={20} /> Library</h2>
      <div className="mc-inventory">
        <div className="mc-inv-tabs">
          {TABS.map(tab => (
            <button key={tab.id} className={`mc-inv-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { audio.play('tab-switch'); setActiveTab(tab.id); }}
              onMouseEnter={() => audio.play('hover')}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="mc-panel" style={{textAlign:'center',marginTop:4}}>
            <McIcon name="mc-unknown" size={32} />
            <p style={{fontFamily:"'VT323',monospace",fontSize:18,color:'#AAA',marginTop:8}}>Nothing here yet...</p>
          </div>
        ) : (
          <div className="mc-inv-grid" style={{marginTop:4}}>
            {filtered.map(item => (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="mc-inv-item"
                onClick={() => audio.play('click')} onMouseEnter={() => { audio.play('hover'); setHovered(item.id); }} onMouseLeave={() => setHovered(null)}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} style={{width:40,height:40,imageRendering:'pixelated',objectFit:'cover'}} />
                ) : (
                  <McIcon name="mc-unknown" size={24} />
                )}
                <span className="mc-inv-item-label">{item.title}</span>
                {hovered === item.id && (
                  <div className="mc-tooltip" style={{position:'absolute',bottom:'100%',left:'50%',transform:'translateX(-50%)',marginBottom:4,whiteSpace:'nowrap',zIndex:9999}}>
                    {item.title}{item.description ? ` — ${item.description}` : ''}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
