'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftPanel from '@/components/MinecraftPanel';
import MinecraftButton from '@/components/MinecraftButton';

const cards = [
  { emoji: '📝', title: 'Bio Editor', desc: 'Edit your profile bio and email', href: '/admin/dashboard/bio' },
  { emoji: '🔗', title: 'Social Links', desc: 'Manage your social media links', href: '/admin/dashboard/socials' },
  { emoji: '📦', title: 'Library', desc: 'Organize games, music, and projects', href: '/admin/dashboard/library' },
  { emoji: '👥', title: 'Friends Badges', desc: 'Manage 88x31 friend badges', href: '/admin/dashboard/friends' },
  { emoji: '🚀', title: 'Projects', desc: 'Showcase your projects', href: '/admin/dashboard/projects' },
  { emoji: '🥚', title: 'Easter Eggs', desc: 'Hidden phrase triggers', href: '/admin/dashboard/easter-eggs' },
  { emoji: '🔊', title: 'Sound Settings', desc: 'Toggle default sound on/off', href: '/admin/dashboard/sounds' },
];

export default function Dashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch('/api/auth/verify')
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.push('/admin');
        else setAuthed(true);
      })
      .catch(() => router.push('/admin'));
  }, [router]);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-pixel text-3xl text-[#55FF55]">Dashboard</h1>
          <MinecraftButton href="/">Preview Site</MinecraftButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <a key={card.href} href={card.href} className="block transition-transform hover:scale-[1.02]">
              <MinecraftPanel className="p-4 h-full cursor-pointer hover:border-t-[#55FF55] hover:border-l-[#55FF55]">
                <div className="text-2xl mb-2">{card.emoji}</div>
                <h2 className="font-pixel text-sm text-[#55FF55] mb-1">{card.title}</h2>
                <p className="font-mono-alt text-xs text-[#AAAAAA]">{card.desc}</p>
              </MinecraftPanel>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
