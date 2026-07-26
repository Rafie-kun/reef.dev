'use client';

import { useEffect, useState } from 'react';
import McIcon from './McIcon';
import { audio } from '@/lib/audio';

const TABS = ['games', 'music', 'projects', 'reading'] as const;

export default function LibrarySection() {
  const [activeTab, setActiveTab] = useState<'games' | 'music' | 'projects' | 'reading'>('games');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cms/library').then(r => r.ok && r.json()).then(d => setItems(d?.library ?? [])).catch(() => {});
  }, []);

  const filtered = items.filter(item => item.tab === activeTab);

  return (
    <section id="library" className="mc-section">
      <h2 className="mc-section-title"><McIcon name="mc-chest" size={18} /> Library</h2>
      <div className="mc-inventory">
        <div className="mc-inv-tabs">
          {TABS.map(tab => (
            <button key={tab} className={`mc-inv-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { audio.play('click'); setActiveTab(tab); }}
              onMouseEnter={() => audio.play('hover')}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{color:'#333',fontFamily:"'VT323',monospace",fontSize:18,textAlign:'center',padding:20}}>Nothing here yet...</div>
        ) : (
          <div className="mc-inv-grid">
            {filtered.map((item: any) => (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="mc-inv-item"
                onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
                {item.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
