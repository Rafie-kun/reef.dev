'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import MinecraftButton from '@/components/MinecraftButton';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
      <div className="border-2 border-t-[#FFFFFF88] border-l-[#FFFFFF88] border-b-[#00000088] border-r-[#00000088] bg-[rgba(0,0,0,0.85)] p-8 w-full max-w-sm">
        <h1 className="font-pixel text-2xl text-center text-[#55FF55] mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Username</label>
            <input
              type="text"
              value="Reef"
              disabled
              className="w-full font-mono-alt text-sm px-3 py-2 bg-[#555] text-[#888] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="font-mono-alt text-xs text-[#AAAAAA] block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-mono-alt text-sm px-3 py-2 bg-[#2b2b2b] text-[#FFF] border-2 border-t-[#00000088] border-l-[#00000088] border-b-[#FFFFFF44] border-r-[#FFFFFF44] outline-none focus:border-t-[#55FF55] focus:border-l-[#55FF55]"
              placeholder="Enter password..."
            />
          </div>
          {error && <p className="font-pixel text-xs text-red-500 text-center">{error}</p>}
          <MinecraftButton disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </MinecraftButton>
        </form>
      </div>
    </div>
  );
}
