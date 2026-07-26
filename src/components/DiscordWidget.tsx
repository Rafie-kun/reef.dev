'use client';

import { useEffect, useState } from 'react';
import { useLanyard } from '@/lib/lanyard';
import McIcon from './McIcon';

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  online: { color: 'bg-green-400', label: 'Online' },
  idle: { color: 'bg-yellow-400', label: 'Idle' },
  dnd: { color: 'bg-red-500', label: 'Do Not Disturb' },
  offline: { color: 'bg-gray-500', label: 'Offline' },
};

export default function DiscordWidget() {
  const { data, connected } = useLanyard();
  const [profile, setProfile] = useState<{ avatarUrl: string; username: string; globalName?: string } | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetch('/api/discord')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) setProfile(d);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const status = data?.discord_status ?? 'offline';
  const statusInfo = STATUS_MAP[status] ?? STATUS_MAP.offline;
  const spotify = data?.spotify ?? null;
  const activeGame = data?.activities?.find((a) => a.type === 0) ?? null;

  const isActive = status === 'online' || status === 'idle' || status === 'dnd';

  let progressPercent = 0;
  if (spotify) {
    const elapsed = now - spotify.timestamps.start;
    const total = spotify.timestamps.end - spotify.timestamps.start;
    progressPercent = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;
  }

  const displayName = profile?.globalName ?? profile?.username ?? 'Reef';

  return (
    <div
      className={`
        relative p-5 rounded-none
        border-4 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
        border-b-[#00000088] border-r-[#00000088]
        bg-[rgba(0,0,0,0.75)]
        ${isActive ? 'animate-[discord-pulse_3s_ease-in-out_infinite]' : ''}
      `}
    >
      {!connected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-600 font-mono-alt text-xs text-white">
          Reconnecting...
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <div
            className="
              w-full h-full
              border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
              border-b-[#00000088] border-r-[#00000088]
              bg-[rgba(0,0,0,0.5)] overflow-hidden
            "
          >
            <img
              src={profile?.avatarUrl ?? '/api/discord'}
              alt={displayName}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${statusInfo.color}`} />
        </div>

        <div className="min-w-0">
          <h3 className="font-pixel text-sm text-[#FFF] truncate">{displayName}</h3>
          <p className="font-mono-alt text-xs text-[#AAA]">{statusInfo.label}</p>
        </div>
      </div>

      {activeGame && !spotify && (
        <div className="mt-4 pt-3 border-t border-[#333]">
          <div className="flex items-start gap-2">
            <McIcon name="mc-controller" size={16} />
            <div className="min-w-0">
              <p className="font-pixel text-[11px] text-[#FFD700] truncate">{activeGame.name}</p>
              {activeGame.state && (
                <p className="font-mono-alt text-xs text-[#CCC] truncate">{activeGame.state}</p>
              )}
              {activeGame.details && (
                <p className="font-mono-alt text-[11px] text-[#888] truncate">{activeGame.details}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {spotify && (
        <div className="mt-4 pt-3 border-t border-[#333]">
          <div className="flex items-start gap-3">
            <div className="relative w-14 h-14 flex-shrink-0">
              <img
                src={spotify.album_art_url}
                alt={spotify.album}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="absolute -top-1.5 -right-1.5 animate-spin" style={{ animationDuration: '3s' }}>
                <McIcon name="mc-noteblock" size={12} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-pixel text-[11px] text-[#1DB954] truncate">{spotify.song}</p>
              <p className="font-mono-alt text-xs text-[#CCC] truncate">{spotify.artist}</p>
              <p className="font-mono-alt text-[10px] text-[#666] truncate">{spotify.album}</p>
              <div className="mt-2 w-full h-2 border border-[#444] bg-[#222] relative overflow-hidden">
                <div
                  className="h-full bg-[#1DB954] transition-none"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes discord-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(59, 130, 246, 0.15); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.35); }
        }
      `}</style>
    </div>
  );
}
