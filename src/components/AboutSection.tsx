'use client';

import { useEffect, useState } from 'react';
import { SocialLink } from '@/lib/types';
import McIcon from './McIcon';

export default function AboutSection() {
  const [bio, setBio] = useState('');
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [profile, setProfile] = useState<{ avatarUrl?: string; username?: string; globalName?: string }>({});
  const [stats, setStats] = useState({ public_repos: 0, followers: 0, commits: 0, joined: '' });

  useEffect(() => {
    fetch('/api/cms/bio').then(r => r.ok && r.json()).then(d => {
      if (d) { setBio(d.bio ?? ''); setSocials(d.socials ?? []); }
    }).catch(() => {});
    fetch('/api/discord').then(r => r.ok && r.json()).then(d => {
      if (d) { setProfile(d); if (d.createdAt) setStats(s => ({...s, joined: new Date(d.createdAt).toLocaleDateString()})); }
    }).catch(() => {});
    fetch('/api/github').then(r => r.ok && r.json()).then(d => {
      if (d) setStats(s => ({...s, public_repos: d.public_repos ?? 0, followers: d.followers ?? 0, commits: d.totalCommits ?? 0}));
    }).catch(() => {});
  }, []);

  return (
    <section id="about" className="mc-section">
      <h2 className="mc-section-title"><McIcon name="mc-player" size={20} /> About</h2>
      <div className="mc-book">
        <div className="mc-book-page" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          {profile?.avatarUrl && (
            <img src={profile.avatarUrl} alt="" style={{width:80,height:80,imageRendering:'pixelated',border:'3px solid #5C3A1E'}} />
          )}
          <h3 style={{fontFamily:"'Press Start 2P',monospace",fontSize:12,color:'#5C3A1E'}}>
            {profile?.globalName ?? profile?.username ?? 'Reef'}
          </h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
            {socials.filter(s => s.url).map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="mc-social-btn"
                 onClick={() => { const a = new Audio(); /* click handled by mc-btn */ }}
                 onMouseEnter={() => { const a = new Audio(); }}>
                <McIcon name={s.icon as any} size={14} />
                {s.name}
              </a>
            ))}
          </div>
          <div className="mc-book-page-lines" />
        </div>
        <div className="mc-book-page">
          <p style={{fontSize:18,lineHeight:1.6}}>{bio || "Hey, I'm Reef. I build things, break things, and occasionally sleep. Welcome to my little corner of the internet."}</p>
        </div>
      </div>

      <div className="mc-panel" style={{marginTop:24}}>
        <div className="mc-stats-grid">
          <div className="mc-stat-card"><span className="mc-stat-value">{stats.public_repos}</span><span className="mc-stat-label">GitHub Repos</span></div>
          <div className="mc-stat-card"><span className="mc-stat-value">{stats.followers}</span><span className="mc-stat-label">GitHub Followers</span></div>
          <div className="mc-stat-card"><span className="mc-stat-value">{stats.commits}</span><span className="mc-stat-label">Commits</span></div>
          <div className="mc-stat-card"><span className="mc-stat-value">{stats.joined || '...'}</span><span className="mc-stat-label">Discord Joined</span></div>
        </div>
      </div>
    </section>
  );
}
