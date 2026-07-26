'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';
import MinecraftPanel from '@/components/MinecraftPanel';
import McIcon from '@/components/McIcon';
import { audio } from '@/lib/audio';

export default function SoundSettings() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
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
      .then((data) => setSoundEnabled(data.soundEnabled !== false))
      .catch(() => {});
  }, [authed]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/cms/bio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soundEnabled }),
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
        <h1 className="font-pixel text-3xl text-[#55FF55] mb-6">Sound Settings</h1>
        <MinecraftPanel className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <McIcon name={soundEnabled ? 'mc-sound-on' : 'mc-sound-off'} size={24} />
            <span className="font-mono-alt text-sm text-[#FFF]">Default sound {soundEnabled ? 'ON' : 'OFF'}</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`ml-auto w-12 h-6 rounded-none border-2 transition-colors ${
                soundEnabled
                  ? 'bg-[#55FF55] border-t-[#FFFFFF88] border-l-[#FFFFFF88] border-b-[#00000088] border-r-[#00000088]'
                  : 'bg-[#555] border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44]'
              }`}
            >
              <div className={`w-4 h-4 bg-[#FFF] transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <MinecraftButton disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</MinecraftButton>
          {msg && <span className={`font-pixel text-xs ${msg === 'Saved!' ? 'text-[#55FF55]' : 'text-red-500'}`}>{msg}</span>}
          <div className="font-mono-alt text-xs text-[#AAAAAA] leading-relaxed">
            <p className="font-pixel text-sm text-[#FFAA00] mb-1">Instructions</p>
            <p>Place .ogg sound files in the <code className="text-[#55FF55]">/public/sounds/</code> directory to use custom sounds.</p>
            <p className="mt-1">Supported file names: click, hover, nav-select, section-enter, save-success, save-error, tab-switch, login-success.</p>
          </div>
        </MinecraftPanel>
      </div>
    </div>
  );
}
