'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';
import MinecraftPanel from '@/components/MinecraftPanel';
import { audio } from '@/lib/audio';

interface EasterEgg {
  text: string;
}

export default function EasterEggsManager() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [phrases, setPhrases] = useState<EasterEgg[]>([]);
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
    fetch('/api/cms/easter-eggs')
      .then((r) => r.json())
      .then((data) => setPhrases(data.phrases ?? []))
      .catch(() => {});
  }, [authed]);

  const updatePhrase = (i: number, text: string) => {
    setPhrases((prev) => prev.map((p, idx) => (idx === i ? { text } : p)));
  };

  const addPhrase = () => setPhrases((prev) => [...prev, { text: '' }]);

  const removePhrase = (i: number) => setPhrases((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/cms/easter-eggs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrases }),
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
        <h1 className="font-pixel text-3xl text-[#55FF55] mb-6">Easter Egg Phrases</h1>
        <div className="flex flex-col gap-3 mb-4">
          {phrases.map((phrase, i) => (
            <MinecraftPanel key={i} className="p-3 flex items-center gap-2">
              <input
                type="text"
                value={phrase.text}
                onChange={(e) => updatePhrase(i, e.target.value)}
                placeholder="Enter trigger phrase..."
                className="flex-1 font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
              />
              <MinecraftButton onClick={() => removePhrase(i)}>×</MinecraftButton>
            </MinecraftPanel>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <MinecraftButton onClick={addPhrase}>Add Phrase</MinecraftButton>
          <MinecraftButton disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</MinecraftButton>
          {msg && <span className={`font-pixel text-xs ${msg === 'Saved!' ? 'text-[#55FF55]' : 'text-red-500'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
