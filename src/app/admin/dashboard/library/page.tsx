'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';
import MinecraftPanel from '@/components/MinecraftPanel';
import { audio } from '@/lib/audio';

interface LibraryItem {
  title: string;
  imageUrl: string;
  description: string;
  link: string;
  tags: string[];
  category: string;
}

const TABS = ['Games', 'Music', 'Projects', 'Reading'];

export default function LibraryManager() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
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
    fetch('/api/cms/library')
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {});
  }, [authed]);

  const filtered = items.filter((item) => item.category === activeTab.toLowerCase());
  const filteredIndices = items
    .map((item, idx) => (item.category === activeTab.toLowerCase() ? idx : -1))
    .filter((i) => i !== -1);

  const updateItem = (globalIdx: number, field: keyof LibraryItem, value: any) => {
    setItems((prev) => prev.map((item, idx) => (idx === globalIdx ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { title: '', imageUrl: '', description: '', link: '', tags: [], category: activeTab.toLowerCase() }]);
  };

  const removeItem = (globalIdx: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== globalIdx));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/cms/library', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
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
        <h1 className="font-pixel text-3xl text-[#55FF55] mb-6">Library Items</h1>
        <div className="flex gap-2 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); audio.play('tab-switch'); }}
              className={`font-pixel text-xs px-4 py-2 border-2 transition-colors ${
                activeTab === tab
                  ? 'border-t-[#55FF55] border-l-[#55FF55] border-b-[#00000088] border-r-[#00000088] bg-[#2b2b2b] text-[#55FF55]'
                  : 'border-t-[#FFFFFF88] border-l-[#FFFFFF88] border-b-[#00000088] border-r-[#00000088] bg-[rgba(0,0,0,0.7)] text-[#AAAAAA] hover:text-[#FFF]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 mb-4">
          {filteredIndices.map((globalIdx) => {
            const item = items[globalIdx];
            return (
              <MinecraftPanel key={globalIdx} className="p-3 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[120px]">
                    <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(globalIdx, 'title', e.target.value)}
                      className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={item.imageUrl}
                      onChange={(e) => updateItem(globalIdx, 'imageUrl', e.target.value)}
                      className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Link</label>
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) => updateItem(globalIdx, 'link', e.target.value)}
                      className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(globalIdx, 'description', e.target.value)}
                    rows={2}
                    className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none resize-vertical"
                  />
                </div>
                <div>
                  <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={item.tags.join(', ')}
                    onChange={(e) => updateItem(globalIdx, 'tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                    className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                  />
                </div>
                <div>
                  <MinecraftButton onClick={() => removeItem(globalIdx)}>Remove</MinecraftButton>
                </div>
              </MinecraftPanel>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <MinecraftButton onClick={addItem}>Add Item</MinecraftButton>
          <MinecraftButton disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</MinecraftButton>
          {msg && <span className={`font-pixel text-xs ${msg === 'Saved!' ? 'text-[#55FF55]' : 'text-red-500'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
