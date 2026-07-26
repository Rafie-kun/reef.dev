'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';
import MinecraftPanel from '@/components/MinecraftPanel';
import { audio } from '@/lib/audio';

interface FriendBadge {
  name: string;
  url: string;
  imageUrl: string;
}

export default function FriendsManager() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [friends, setFriends] = useState<FriendBadge[]>([]);
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
    fetch('/api/cms/friends')
      .then((r) => r.json())
      .then((data) => setFriends(data.friends ?? []))
      .catch(() => {});
  }, [authed]);

  const updateFriend = (i: number, field: keyof FriendBadge, value: string) => {
    setFriends((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  };

  const addFriend = () => setFriends((prev) => [...prev, { name: '', url: '', imageUrl: '' }]);

  const removeFriend = (i: number) => setFriends((prev) => prev.filter((_, idx) => idx !== i));

  const moveFriend = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= friends.length) return;
    setFriends((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/cms/friends', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friends }),
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
      <div className="max-w-3xl mx-auto">
        <a href="/admin/dashboard" className="font-mono-alt text-xs text-[#AAAAAA] hover:text-[#55FF55] mb-4 block">&larr; Back to Dashboard</a>
        <h1 className="font-pixel text-3xl text-[#55FF55] mb-6">Friends &amp; Badges</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {friends.map((friend, i) => (
            <MinecraftPanel key={i} className="p-3 flex flex-col gap-2">
              <div>
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Name</label>
                <input
                  type="text"
                  value={friend.name}
                  onChange={(e) => updateFriend(i, 'name', e.target.value)}
                  className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                />
              </div>
              <div>
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">URL</label>
                <input
                  type="text"
                  value={friend.url}
                  onChange={(e) => updateFriend(i, 'url', e.target.value)}
                  className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                />
              </div>
              <div>
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Image URL (88x31)</label>
                <input
                  type="text"
                  value={friend.imageUrl}
                  onChange={(e) => updateFriend(i, 'imageUrl', e.target.value)}
                  className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <MinecraftButton onClick={() => moveFriend(i, -1)} disabled={i === 0}>&#x25B2;</MinecraftButton>
                <MinecraftButton onClick={() => moveFriend(i, 1)} disabled={i === friends.length - 1}>&#x25BC;</MinecraftButton>
                <MinecraftButton onClick={() => removeFriend(i)}>Remove</MinecraftButton>
              </div>
            </MinecraftPanel>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <MinecraftButton onClick={addFriend}>Add Friend</MinecraftButton>
          <MinecraftButton disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</MinecraftButton>
          {msg && <span className={`font-pixel text-xs ${msg === 'Saved!' ? 'text-[#55FF55]' : 'text-red-500'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
