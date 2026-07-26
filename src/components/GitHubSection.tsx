'use client';

import { useEffect, useState } from 'react';
import McIcon from './McIcon';
import { audio } from '@/lib/audio';

const LANG_COLORS: Record<string, string> = {
  TypeScript:'#3178c6', JavaScript:'#f1e05a', Python:'#3572A5',
  HTML:'#e34c26', CSS:'#563d7c', Rust:'#dea584', Go:'#00ADD8',
  Java:'#b07219', C:'#555', 'C++':'#f34b7d', Ruby:'#701516',
  Shell:'#89e051', PHP:'#4F5D95', Swift:'#ffac45',
};

export default function GitHubSection() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ public_repos: 0, followers: 0, totalCommits: 0 });

  useEffect(() => {
    fetch('/api/github').then(r => { if (!r.ok) throw Error(); return r.json(); })
      .then(d => {
        setRepos(Array.isArray(d.repos) ? d.repos.slice(0, 12) : []);
        setStats({ public_repos: d.public_repos ?? 0, followers: d.followers ?? 0, totalCommits: d.totalCommits ?? 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="mc-section">
      <h2 className="mc-section-title"><McIcon name="mc-chest" size={18} /> Projects &amp; Code</h2>

      {loading ? (
        <div className="mc-chest-grid">
          {Array.from({length:6}).map((_,i) => <div key={i} className="mc-repo-card" style={{height:80}}
            onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')} />)}
        </div>
      ) : repos.length === 0 ? (
        <div className="mc-panel" style={{textAlign:'center',color:'#AAA',fontSize:18}}>No repositories found.</div>
      ) : (
        <div className="mc-chest-grid">
          {repos.map((repo: any) => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="mc-repo-card"
              onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
              <span className="mc-repo-name">{repo.name}</span>
              {repo.description && <span className="mc-repo-desc">{repo.description}</span>}
              <div className="mc-repo-stats">
                {repo.language && <span><span className="mc-lang-dot" style={{background:LANG_COLORS[repo.language]||'#888'}} />{repo.language}</span>}
                <span>⭐ {repo.stargazers_count}</span>
                <span>⑂ {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mc-stats-grid" style={{ marginTop: 16 }}>
        <div className="mc-stat-card" onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
          <span className="mc-stat-value">{stats.public_repos}</span>
          <span className="mc-stat-label">Repos</span>
        </div>
        <div className="mc-stat-card" onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
          <span className="mc-stat-value">{stats.followers}</span>
          <span className="mc-stat-label">Followers</span>
        </div>
        <div className="mc-stat-card" onClick={() => audio.play('click')} onMouseEnter={() => audio.play('hover')}>
          <span className="mc-stat-value">{stats.totalCommits}</span>
          <span className="mc-stat-label">Commits</span>
        </div>
      </div>
    </section>
  );
}
