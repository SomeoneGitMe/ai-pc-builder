'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../src/utils/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [builds, setBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/');
      } else {
        setUser(data.user);
        fetchBuilds(data.user.id);
      }
    };
    checkUser();
  }, [router]);

  const fetchBuilds = async (userId: string) => {
    const { data, error } = await supabase
      .from('saved_builds')
      .select('*')
      .eq('user_id', userId);
    
    if (data) setBuilds(data);
    setLoading(false);
  };

  if (!user) return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="text-xl font-black tracking-tight">APEX</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500">SYSTEMS</span>
          </Link>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">Sign Out</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full py-20 px-6">
        <h1 className="text-4xl font-black uppercase mb-2">My Dashboard</h1>
        <p className="text-zinc-400 mb-10">Welcome back. Here are your saved AI configurations.</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-4">Saved Builds</h2>
          
          {loading ? (
            <p className="text-zinc-500">Loading builds...</p>
          ) : builds.length === 0 ? (
            <p className="text-zinc-500">You have no saved builds yet. Go chat with Apex AI!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {builds.map((build) => (
                <div key={build.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <h3 className="font-bold text-white text-lg">{build.build_name}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{build.components.category}</p>
                  <p className="text-xl font-bold text-blue-400 mt-4">${build.total_price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}