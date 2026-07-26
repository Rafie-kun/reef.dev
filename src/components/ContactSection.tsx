'use client';

import { useEffect, useState } from 'react';
import McIcon from './McIcon';
import MinecraftButton from './MinecraftButton';

export default function ContactSection() {
  const [email, setEmail] = useState('reef@example.com');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch('/api/cms/bio')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.email) setEmail(d.email);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="contact" className="relative px-4 py-20 max-w-2xl mx-auto text-center">
      <div
        className="
          p-8
          border-4 border-t-[#FFFFFF88] border-l-[#FFFFFF88]
          border-b-[#00000088] border-r-[#00000088]
          bg-[rgba(0,0,0,0.75)]
        "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h2 className="font-pixel text-xl text-[#FFD700] mb-6">
          Contact / Connect
        </h2>

        <div className="flex flex-col items-center gap-4">
          <MinecraftButton href="https://discord.com/users/744808879036170272">
            <McIcon name="mc-discord" size={14} />
            <span className="ml-1">DM on Discord</span>
          </MinecraftButton>

          <MinecraftButton href={`mailto:${email}`}>
            <McIcon name="mc-email" size={14} />
            <span className="ml-1">Email me</span>
          </MinecraftButton>

          <MinecraftButton href="https://github.com/Rafie-kun">
            <McIcon name="mc-github" size={14} />
            <span className="ml-1">Follow on GitHub</span>
          </MinecraftButton>
        </div>

        <div className="mt-6 h-12 flex items-center justify-center overflow-hidden">
          <div
            className={`
              transition-transform duration-300 ease-in-out
              ${hovered ? 'scale-110 -translate-y-1' : 'scale-100'}
            `}
          >
            <McIcon name="mc-email" size={32} />
          </div>
        </div>
      </div>
    </section>
  );
}
