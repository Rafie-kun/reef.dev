'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';
import MinecraftPanel from '@/components/MinecraftPanel';
import { audio } from '@/lib/audio';

interface Project {
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
}

export default function ProjectsManager() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
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
    fetch('/api/cms/projects')
      .then((r) => r.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => {});
  }, [authed]);

  const updateProject = (i: number, field: keyof Project, value: any) => {
    setProjects((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const addProject = () => setProjects((prev) => [...prev, { title: '', description: '', imageUrl: '', techStack: [], liveUrl: '', repoUrl: '' }]);

  const removeProject = (i: number) => setProjects((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/cms/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
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
        <h1 className="font-pixel text-3xl text-[#55FF55] mb-6">Projects</h1>
        <div className="flex flex-col gap-3 mb-4">
          {projects.map((project, i) => (
            <MinecraftPanel key={i} className="p-3 flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[120px]">
                  <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Title</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(i, 'title', e.target.value)}
                    className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={project.imageUrl}
                    onChange={(e) => updateProject(i, 'imageUrl', e.target.value)}
                    className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(i, 'description', e.target.value)}
                  rows={2}
                  className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none resize-vertical"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[120px]">
                  <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Live URL</label>
                  <input
                    type="text"
                    value={project.liveUrl}
                    onChange={(e) => updateProject(i, 'liveUrl', e.target.value)}
                    className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Repo URL</label>
                  <input
                    type="text"
                    value={project.repoUrl}
                    onChange={(e) => updateProject(i, 'repoUrl', e.target.value)}
                    className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={project.techStack.join(', ')}
                  onChange={(e) => updateProject(i, 'techStack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  className="w-full font-mono-alt text-sm px-2 py-1 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none"
                />
              </div>
              <div>
                <MinecraftButton onClick={() => removeProject(i)}>Remove</MinecraftButton>
              </div>
            </MinecraftPanel>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <MinecraftButton onClick={addProject}>Add Project</MinecraftButton>
          <MinecraftButton disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</MinecraftButton>
          {msg && <span className={`font-pixel text-xs ${msg === 'Saved!' ? 'text-[#55FF55]' : 'text-red-500'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
