'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';
import MinecraftPanel from '@/components/MinecraftPanel';
import McIcon from '@/components/McIcon';
import { ICON_NAMES } from '@/lib/icons';
import { audio } from '@/lib/audio';

interface SocialLink {
  icon: string;
  name: string;
  url: string;
}

export default function SocialsManager() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/auth/verify')
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.push('/admin');
        else setAuthed(true);
      })
      .catch(() => router.push('/admin'));
  }, [router]);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/cms/socials')
      .then((r) => r.json())
      .then((data) => setLinks(data.links ?? []))
      .catch(() => {});
  }, [authed]);

  const updateLink = (i: number, field: keyof SocialLink, value: string) => {
    setLinks((prev) => prev.map((link, idx) => (idx === i ? { ...link, [field]: value } : link)));
  };

  const addLink = () => setLinks((prev) => [...prev, { icon: 'mc-link', name: '', url: '' }]);

  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/cms/socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links }),
      });
      if (res.ok) {
        audio.play('save-success');
        setMsg('Saved!');
      } else {
        setMsg('Error saving');
      }
    } catch {
      setMsg('Error saving');
    } finally {
      setSaving(false);
    }
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-2xl mx-auto">
        <a href="/admin/dashboard" className="font-mono-alt text-xs text-[#AAAAAA] hover:text-[#55FF55] mb-4 block">&larr; Back to Dashboard</a>
        <h1 className="font-pixel text-3xl text-[#55FF55] mb-6">Social Links</h1>
        <div className="flex flex-col gap-3 mb-4">
          {links.map((link, i) => (
            <MinecraftPanel key={i} className="p-3 flex flex-wrap items-end gap-2">
              <div className="flex-1 min-w-[100px]">
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Icon</label>
                <select
                  value={link.icon}
                  onChange={(e) => updateLink(i, 'icon', e.target.value)}
                  className="w-full font-mono-alt text-sm px-2 py-2 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[2] min-w-[120px]">
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Name</label>
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => updateLink(i, 'name', e.target.value)}
                  className="w-full font-mono-alt text-sm px-2 py-2 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                />
              </div>
              <div className="flex-[3] min-w-[150px]">
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">URL</label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  className="w-full font-mono-alt text-sm px-2 py-2 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                />
              </div>
              <div className="flex items-center gap-1 pb-1">
                <McIcon name={link.icon as any} size={20} />
                <MinecraftButton onClick={() => removeLink(i)}>×</MinecraftButton>
              </div>
            </MinecraftPanel>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <MinecraftButton onClick={addLink}>Add Link</MinecraftButton>
          <MinecraftButton disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</MinecraftButton>
          {msg && <span className={`font-pixel text-xs ${msg === 'Saved!' ? 'text-[#55FF55]' : 'text-red-500'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
