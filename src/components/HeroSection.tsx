'use client';

import { useEffect, useState } from 'react';
import { audio } from '@/lib/audio';
import { useLanyard } from '@/lib/lanyard';
import { CMSEasterEgg } from '@/lib/types';
import McIcon from './McIcon';

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-green-400',
  idle: 'bg-yellow-400',
  dnd: 'bg-red-500',
  offline: 'bg-gray-500',
};

function getDiscordAvatarUrl() {
  return '/api/discord';
}

async function fetchEasterEggs(): Promise<CMSEasterEgg[]> {
  try {
    const res = await fetch('/api/cms/easter-eggs');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.easterEggs ?? [];
    }
  } catch {}
  return [];
}

export default function HeroSection() {
  const { data: lanyard } = useLanyard();
  const [eggs, setEggs] = useState<CMSEasterEgg[]>([]);
  const [eggIndex, setEggIndex] = useState(0);
  const [profileData, setProfileData] = useState<{ avatarUrl?: string; username?: string }>({});

  useEffect(() => {
    audio.play('section-enter');
    fetchEasterEggs().then(setEggs);
    fetch('/api/discord')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) setProfileData(d);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (eggs.length <= 1) return;
    const interval = setInterval(() => {
      setEggIndex((prev) => (prev + 1) % eggs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [eggs.length]);

  const status = lanyard?.discord_status ?? 'offline';
  const currentActivity = lanyard?.activities?.find((a) => a.type === 0) ?? null;
  const spotify = lanyard?.spotify ?? null;
  const displayActivity = spotify
    ? { name: 'Spotify', details: `${spotify.song} — ${spotify.artist}` }
    : currentActivity
      ? { name: currentActivity.name, details: currentActivity.state ?? currentActivity.details ?? '' }
      : null;

  const avatarUrl = profileData.avatarUrl ?? getDiscordAvatarUrl();

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24"
    >
      <div className="text-center">
        <h1
          className="font-pixel text-6xl sm:text-8xl md:text-9xl leading-none select-none"
          style={{
            color: '#3b82f6',
            textShadow: `
              4px 4px 0 #1e3a8a,
              8px 8px 0 #1e3a8a,
              12px 12px 0 #1e3a8a
            `,
            animation: 'hero-shimmer 3s ease-in-out infinite',
          }}
        >
          REEF
        </h1>
        <p
          className="font-mono-alt text-xl sm:text-2xl text-[#aaa] mt-4"
          style={{ textShadow: '2px 2px 0 #000' }}
        >
          // personal site &amp; portfolio
        </p>
      </div>

      <div className="relative mt-12 group">
        <a
          href="https://discord.com/users/744808879036170272"
          target="_blank"
          rel="noopener noreferrer"
          className="block relative"
        >
          <div
            className="
              relative w-28 h-28 sm:w-36 sm:h-36
              border-4 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
              border-b-[#00000088] border-r-[#00000088]
              bg-[rgba(0,0,0,0.7)] overflow-hidden
              transition-transform duration-150 group-hover:scale-105
              cursor-pointer
            "
          >
            <img
              src={avatarUrl}
              alt="Reef"
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
            <div
              className={`
                absolute -bottom-0.5 -right-0.5 w-5 h-5
                rounded-full border-2 border-black
                ${STATUS_COLORS[status]}
              `}
            />
          </div>
        </a>
      </div>

      {displayActivity && (
        <div
          className="
            mt-6 px-4 py-2
            border-2 border-[#8B008B] bg-[#1a001a]
            font-mono-alt text-sm text-[#E0E0E0]
            flex items-center gap-2
          "
        >
          <McIcon name="mc-noteblock" size={14} />
          <span className="text-[#aaa] text-xs">{displayActivity.name}:</span>
          <span className="truncate max-w-[240px]">{displayActivity.details}</span>
        </div>
      )}

      {eggs.length > 0 && (
        <p className="font-mono-alt text-sm text-[#777] mt-8 animate-pulse">
          {eggs[eggIndex]?.phrase ?? ''}
        </p>
      )}

      <style>{`
        @keyframes hero-shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      `}</style>
    </section>
  );
}
