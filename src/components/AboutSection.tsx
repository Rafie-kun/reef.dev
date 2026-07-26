'use client';

import { useEffect, useState } from 'react';
import { SocialLink } from '@/lib/types';
import McIcon from './McIcon';
import MinecraftButton from './MinecraftButton';

interface DiscordProfile {
  username: string;
  globalName: string;
  avatarUrl: string;
}

interface GitHubStats {
  public_repos: number;
  followers: number;
}

interface DiscordStats {
  joinedAt: string;
}

interface CommitStats {
  totalCommits: number;
}

export default function AboutSection() {
  const [bio, setBio] = useState('');
  const [discordProfile, setDiscordProfile] = useState<DiscordProfile | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [discordJoined, setDiscordJoined] = useState('');
  const [commits, setCommits] = useState(0);

  useEffect(() => {
    fetch('/api/cms/bio')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setBio(d.bio ?? '');
          setSocials(d.socials ?? []);
        }
      })
      .catch(() => {});

    fetch('/api/discord')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setDiscordProfile(d);
          if (d.joinedAt) setDiscordJoined(new Date(d.joinedAt).toLocaleDateString());
        }
      })
      .catch(() => {});

    fetch('/api/github')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setGithubStats({ public_repos: d.public_repos ?? 0, followers: d.followers ?? 0 });
          setCommits(d.totalCommits ?? 0);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="relative px-4 py-20 max-w-5xl mx-auto">
      <div
        className="
          relative grid grid-cols-1 md:grid-cols-2 gap-0
          border-4 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
          border-b-[#00000088] border-r-[#00000088]
          bg-[rgba(0,0,0,0.7)]
        "
      >
        <div
          className="
            p-6 md:p-8
            border-b-4 md:border-b-0 md:border-r-4
            border-[#00000088]
            flex flex-col items-center gap-4
          "
        >
          {discordProfile && (
            <div
              className="
                w-24 h-24 sm:w-28 sm:h-28
                border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
                border-b-[#00000088] border-r-[#00000088]
                bg-[rgba(0,0,0,0.5)] overflow-hidden
              "
            >
              <img
                src={discordProfile.avatarUrl}
                alt={discordProfile.username}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          )}
          <h2 className="font-pixel text-lg text-[#FFD700] text-center">
            {discordProfile?.globalName ?? discordProfile?.username ?? 'Reef'}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {socials.filter((s) => s.url).map((s) => (
              <MinecraftButton key={s.id} href={s.url}>
                <McIcon name={s.icon as any} size={14} />
                <span className="ml-1">{s.name}</span>
              </MinecraftButton>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <p className="font-mono-alt text-base text-[#E0E0E0] leading-relaxed whitespace-pre-wrap">
            {bio || 'Hey, I\'m Reef. I build things, break things, and occasionally sleep. Welcome to my little corner of the internet.'}
          </p>
        </div>
      </div>

      <div
        className="
          mt-8 p-4
          border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
          border-b-[#00000088] border-r-[#00000088]
          bg-[rgba(0,0,0,0.7)]
        "
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox label="GitHub Repos" value={githubStats?.public_repos ?? 0} icon="mc-chest" />
          <StatBox label="GitHub Followers" value={githubStats?.followers ?? 0} icon="mc-player" />
          <StatBox label="Commits" value={commits} icon="mc-sword" />
          <StatBox label="Discord Joined" value={discordJoined || '...'} icon="mc-discord" />
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div
      className="
        flex flex-col items-center gap-1 p-3
        border-2 border-t-[#00000088] border-l-[#00000088]
        border-b-[#FFFFFF44] border-r-[#FFFFFF44]
        bg-[#8B8B8B]
      "
    >
      <McIcon name={icon as any} size={20} />
      <span className="font-pixel text-xs text-[#FFF]">{value}</span>
      <span className="font-mono-alt text-[10px] text-[#AAA] text-center">{label}</span>
    </div>
  );
}
