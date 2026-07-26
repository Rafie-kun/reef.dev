'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';
import MinecraftPanel from '@/components/MinecraftPanel';
import { audio } from '@/lib/audio';

export default function BioEditor() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
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
    fetch('/api/cms/bio')
      .then((r) => r.json())
      .then((data) => {
        setBio(data.bio ?? '');
        setEmail(data.email ?? '');
      })
      .catch(() => {});
  }, [authed]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/cms/bio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, email }),
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
        <h1 className="font-pixel text-3xl text-[#55FF55] mb-6">Bio Editor</h1>
        <MinecraftPanel className="p-4 flex flex-col gap-4">
          <div>
            <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              className="w-full font-mono-alt text-sm px-3 py-2 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none resize-vertical"
            />
          </div>
          <div>
            <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-mono-alt text-sm px-3 py-2 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <MinecraftButton disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</MinecraftButton>
            {msg && <span className={`font-pixel text-xs ${msg === 'Saved!' ? 'text-[#55FF55]' : 'text-red-500'}`}>{msg}</span>}
          </div>
        </MinecraftPanel>
      </div>
    </div>
  );
}
