'use client';

import { useEffect, useState } from 'react';
import McIcon from './McIcon';

export default function AboutSection() {
  const [bio, setBio] = useState('');
  const [socials, setSocials] = useState([]);
  const [profile, setProfile] = useState({ avatarUrl: '', username: '', globalName: '' });
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
      <h2 className="mc-section-title"><McIcon name="mc-player" size={18} /> About</h2>

      <div className="mc-panel">
        <div style={{ textAlign: 'center' }}>
          {profile.avatarUrl && (
            <img src={profile.avatarUrl} alt="" className="mc-avatar" style={{ width: 80, height: 80 }} />
          )}
          <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#FFD700', marginTop: 12 }}>
            {profile.globalName || profile.username || 'Reef'}
          </h3>
        </div>
        <div style={{ marginTop: 12 }}>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: '#E0E0E0', lineHeight: 1.6 }}>
            {bio || "Hey, I'm Reef. I build things, break things, and occasionally sleep. Welcome to my little corner of the internet."}
          </p>
        </div>
        {socials.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
            {socials.filter((s: any) => s.url).map((s: any) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="mc-social-btn">
                {s.name}
              </a>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 16 }}>
        <div className="mc-stat-box"><span className="mc-stat-value">{stats.public_repos}</span><span className="mc-stat-label">GitHub Repos</span></div>
        <div className="mc-stat-box"><span className="mc-stat-value">{stats.followers}</span><span className="mc-stat-label">Followers</span></div>
        <div className="mc-stat-box"><span className="mc-stat-value">{stats.commits}</span><span className="mc-stat-label">Commits</span></div>
        <div className="mc-stat-box"><span className="mc-stat-value">{stats.joined || '...'}</span><span className="mc-stat-label">Discord Joined</span></div>
      </div>
    </section>
  );
}
