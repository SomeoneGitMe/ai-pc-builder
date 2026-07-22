'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../src/utils/supabaseClient';
import AuthModal from './components/AuthModal';
import ChatBubble from './components/ChatBubble';

export default function Home() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthModalOpen(false);
        } else {
          setUser(null);
        }
      }
    );

    const savedCart = localStorage.getItem('apex_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="text-xl font-black tracking-tight">APEX</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500">SYSTEMS</span>
          </Link>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400 uppercase tracking-wider">
            <Link href="/gaming-pcs" className="hover:text-white transition">Gaming PCs</Link>
            <Link href="/workstations" className="hover:text-white transition">Workstations</Link>
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/support" className="hover:text-white transition">Support</Link>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Cart Button */}
            <Link href="/checkout" className="relative bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <button onClick={handleSignOut} className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">Sign Out</button>
                <button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Dashboard</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsAuthModalOpen(true)} className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">Sign In</button>
                <button onClick={() => router.push('/apex-ai')} className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Configure</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] z-0"></div>
        
        <div className="relative z-10 text-center py-24 px-4">
          <span className="inline-block bg-blue-950 border border-blue-800 text-blue-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">AI-Powered PC Configurator</span>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 uppercase text-white">
            Build Your <span className="text-blue-500">Apex</span> Rig
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 font-light">
            Stop guessing compatibility. Let our 24/7 AI Architect analyze your needs, budget, and workflow to engineer the perfect custom PC in seconds.
          </p>
          <button 
            onClick={() => router.push('/apex-ai')}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition shadow-xl shadow-blue-500/30 hover:scale-105"
          >
            Start Building with AI
          </button>
        </div>
      </div>

      {/* Featured Builds Storefront */}
      <div className="max-w-7xl mx-auto w-full py-20 px-6">
        <h2 className="text-3xl font-black uppercase mb-8 border-l-4 border-blue-600 pl-4">Featured Builds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-800 transition group">
            <div className="h-56 bg-zinc-900 relative overflow-hidden">
              <img src="https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/27658/CS-IBP-SCALE-B-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" alt="Sentinel PC" className="absolute inset-0 w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">Sale</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase">The Sentinel</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-4">Perfect for 1080p and Esports</p>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                <span className="text-2xl font-black text-blue-400">$1,299</span>
                <Link href="/apex-ai?preset=Sentinel" className="text-sm font-bold uppercase text-zinc-400 hover:text-white">Customize</Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900 border border-blue-800 rounded-2xl overflow-hidden transition group relative shadow-xl shadow-blue-900/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 z-20"></div>
            <div className="h-56 bg-zinc-900 relative overflow-hidden">
              <img src="https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32055/01-TraceX-Black-Main-400-RGB.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" alt="Vanguard PC" className="absolute inset-0 w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">Popular</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase">The Vanguard</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-4">1440p Gaming and Streaming</p>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                <span className="text-2xl font-black text-blue-400">$1,899</span>
                <Link href="/apex-ai?preset=Vanguard" className="text-sm font-bold uppercase text-blue-400 hover:text-blue-300">Customize</Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-800 transition group">
            <div className="h-56 bg-zinc-900 relative overflow-hidden">
              <img src="https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/26643/gaming-pc-01-Y40-VCTA-R005-main-400-.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" alt="Titan PC" className="absolute inset-0 w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">New</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase">The Titan</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-4">4K Rendering and AI Dev</p>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                <span className="text-2xl font-black text-blue-400">$2,499</span>
                <Link href="/apex-ai?preset=Titan" className="text-sm font-bold uppercase text-zinc-400 hover:text-white">Customize</Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Value Prop Banner */}
      <div className="bg-blue-950 border-t border-b border-blue-900 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-2xl font-black text-blue-400 mb-2">24/7 AI Support</h4>
            <p className="text-zinc-400 text-sm">Our AI Architect never sleeps. Get expert advice at 3 AM.</p>
          </div>
          <div>
            <h4 className="text-2xl font-black text-blue-400 mb-2">Guaranteed Compatibility</h4>
            <p className="text-zinc-400 text-sm">Zero guesswork. Every part fits perfectly.</p>
          </div>
          <div>
            <h4 className="text-2xl font-black text-blue-400 mb-2">Free Lifetime Support</h4>
            <p className="text-zinc-400 text-sm">We stand by your rig for life. Period.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
        © 2024 Apex Systems. AI-Engineered Solutions.
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ChatBubble />

    </div>
  );
}