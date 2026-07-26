'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/lib/types';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Rust: '#dea584', Go: '#00ADD8',
  Java: '#b07219', C: '#555555', 'C++': '#f34b7d', Ruby: '#701516',
  Shell: '#89e051', PHP: '#4F5D95', Swift: '#ffac45', Kotlin: '#A97BFF', Dart: '#00B4AB',
};

export default function GitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ public_repos: 0, followers: 0, totalCommits: 0 });

  useEffect(() => {
    fetch('/api/github').then(r => { if (!r.ok) throw Error(); return r.json(); })
      .then(d => {
        setRepos(Array.isArray(d.repos) ? d.repos.slice(0, 12) : []);
        setStats({ public_repos: d.public_repos ?? 0, followers: d.followers ?? 0, totalCommits: d.totalCommits ?? 0 });
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <section id="projects" className="mc-section">
      <h2 className="mc-section-title"><McIcon name="mc-chest" size={20} /> Projects &amp; Code</h2>

      {loading && (
        <div className="mc-chest-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))'}}>
          {Array.from({length:8}).map((_, i) => (
            <div key={i} className="mc-repo-card" style={{height:120}}>
              <div style={{height:12,background:'#555',width:'60%'}} />
              <div style={{height:8,background:'#444',width:'80%'}} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mc-panel" style={{textAlign:'center'}}>
          <McIcon name="mc-unknown" size={32} />
          <p style={{fontFamily:"'VT323',monospace",fontSize:18,color:'#F44',marginTop:8}}>Failed to load repositories.</p>
        </div>
      )}

      {!loading && !error && repos.length === 0 && (
        <div className="mc-panel" style={{textAlign:'center'}}>
          <McIcon name="mc-unknown" size={32} />
          <p style={{fontFamily:"'VT323',monospace",fontSize:18,color:'#AAA',marginTop:8}}>No repositories found.</p>
        </div>
      )}

      {!loading && !error && repos.length > 0 && (
        <div className="mc-chest-grid">
          {repos.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="mc-repo-card"
               onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
              <span className="mc-repo-name">{repo.name}</span>
              {repo.description && <span className="mc-repo-desc">{repo.description}</span>}
              <div className="mc-repo-stats">
                {repo.language && (
                  <span><span className="mc-lang-dot" style={{background:LANG_COLORS[repo.language]??'#888'}} />{repo.language}</span>
                )}
                <span>⭐ {repo.stargazers_count}</span>
                <span>⑂ {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mc-panel" style={{marginTop:24,textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'center',gap:48,flexWrap:'wrap'}}>
          <div><p style={{fontFamily:"'Press Start 2P',monospace",fontSize:18,color:'#FFD700'}}>{stats.public_repos}</p><p className="mc-stat-label">Repos</p></div>
          <div><p style={{fontFamily:"'Press Start 2P',monospace",fontSize:18,color:'#FFD700'}}>{stats.followers}</p><p className="mc-stat-label">Followers</p></div>
          <div><p style={{fontFamily:"'Press Start 2P',monospace",fontSize:18,color:'#FFD700'}}>{stats.totalCommits}</p><p className="mc-stat-label">Commits</p></div>
        </div>
      </div>
    </section>
  );
}
