'use client';

import { useEffect, useState } from 'react';
import { FriendBadge } from '@/lib/types';
import McIcon from './McIcon';
import MinecraftButton from './MinecraftButton';

export default function FriendsSection() {
  const [badges, setBadges] = useState<FriendBadge[]>([]);

  useEffect(() => {
    fetch('/api/cms/friends')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.friends ?? [];
        setBadges(list);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="friends" className="relative px-4 py-20 max-w-4xl mx-auto text-center">
      <h2 className="font-pixel text-xl text-[#FFD700] mb-8">
        [ Friends &amp; Allies ]
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {badges.length === 0 && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="
                  w-[88px] h-[31px]
                  border-2 border-t-[#00000088] border-l-[#00000088]
                  border-b-[#FFFFFF44] border-r-[#FFFFFF44]
                  bg-[#8B8B8B] flex items-center justify-center
                "
              >
                <McIcon name="mc-unknown" size={14} />
              </div>
            ))}
          </>
        )}
        {badges.map((badge) => (
          <a
            key={badge.id}
            href={badge.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-[88px] h-[31px]
              border-2 border-t-[#00000088] border-l-[#00000088]
              border-b-[#FFFFFF44] border-r-[#FFFFFF44]
              bg-[#8B8B8B] overflow-hidden
              hover:bg-[#9B9B9B] transition-colors duration-75
              block
            "
          >
            {badge.imageUrl && !badge.imageUrl.includes('placeholder') ? (
              <img
                src={badge.imageUrl}
                alt={badge.name}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <McIcon name="mc-unknown" size={14} />
              </div>
            )}
          </a>
        ))}
      </div>

      <MinecraftButton href="https://discord.com/users/744808879036170272">
        <McIcon name="mc-chat" size={14} />
        <span className="ml-1">Say hi!</span>
      </MinecraftButton>
    </section>
  );
}
