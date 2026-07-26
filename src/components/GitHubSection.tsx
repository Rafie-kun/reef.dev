'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/lib/types';
import McIcon from './McIcon';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  Ruby: '#701516',
  Shell: '#89e051',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

export default function GitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ public_repos: 0, followers: 0, totalCommits: 0 });

  useEffect(() => {
    fetch('/api/github')
      .then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then((d) => {
        const repoList: GitHubRepo[] = d.repos ?? d ?? [];
        setRepos(Array.isArray(repoList) ? repoList : []);
        setStats({
          public_repos: d.public_repos ?? 0,
          followers: d.followers ?? 0,
          totalCommits: d.totalCommits ?? 0,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="relative px-4 py-20 max-w-6xl mx-auto">
      <h2 className="font-pixel text-xl text-[#FFD700] mb-8 flex items-center gap-3">
        <McIcon name="mc-chest" size={24} />
        Projects &amp; Code
      </h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="
                p-3
                border-2 border-t-[#00000088] border-l-[#00000088]
                border-b-[#FFFFFF44] border-r-[#FFFFFF44]
                bg-[#8B8B8B] animate-pulse
              "
            >
              <div className="h-3 bg-[#666] w-3/4 mb-2" />
              <div className="h-2 bg-[#666] w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          className="
            p-6 text-center
            border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
            border-b-[#00000088] border-r-[#00000088]
            bg-[rgba(0,0,0,0.7)]
          "
        >
          <McIcon name="mc-unknown" size={32} />
          <p className="font-mono-alt text-[#F44] mt-2">Failed to load repositories.</p>
        </div>
      )}

      {!loading && !error && repos.length === 0 && (
        <div
          className="
            p-6 text-center
            border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
            border-b-[#00000088] border-r-[#00000088]
            bg-[rgba(0,0,0,0.7)]
          "
        >
          <McIcon name="mc-unknown" size={32} />
          <p className="font-mono-alt text-[#AAA] mt-2">No repositories found.</p>
        </div>
      )}

      {!loading && !error && repos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                p-3 block
                border-2 border-t-[#00000088] border-l-[#00000088]
                border-b-[#FFFFFF44] border-r-[#FFFFFF44]
                bg-[#8B8B8B] hover:bg-[#9B9B9B]
                transition-colors duration-75
                cursor-pointer
              "
            >
              <p className="font-pixel text-[10px] text-[#FFF] truncate">{repo.name}</p>
              {repo.description && (
                <p className="font-mono-alt text-[10px] text-[#AAA] mt-1 line-clamp-2">{repo.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-[10px]">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#888' }}
                    />
                    <span className="font-mono-alt text-[#CCC]">{repo.language}</span>
                  </span>
                )}
                <span className="font-mono-alt text-[#FFD700] flex items-center gap-0.5">
                  <McIcon name="mc-star" size={8} />
                  {repo.stargazers_count}
                </span>
                <span className="font-mono-alt text-[#AAA] flex items-center gap-0.5">
                  <McIcon name="mc-link" size={8} />
                  {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div
        className="
          mt-8 p-4
          border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
          border-b-[#00000088] border-r-[#00000088]
          bg-[rgba(0,0,0,0.7)]
        "
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-pixel text-lg text-[#FFD700]">{stats.public_repos}</p>
            <p className="font-mono-alt text-xs text-[#AAA]">Total Repos</p>
          </div>
          <div>
            <p className="font-pixel text-lg text-[#FFD700]">{stats.followers}</p>
            <p className="font-mono-alt text-xs text-[#AAA]">Followers</p>
          </div>
          <div>
            <p className="font-pixel text-lg text-[#FFD700]">{stats.totalCommits}</p>
            <p className="font-mono-alt text-xs text-[#AAA]">Commits</p>
          </div>
        </div>
      </div>
    </section>
  );
}
