'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../src/utils/supabaseClient';
import AuthModal from './components/AuthModal';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
};

export default function Home() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to Apex Systems. I'm your 24/7 AI Configurator. Tell me your budget and what you'll be using the PC for, and I'll build your perfect rig instantly."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAddToCart = async (part: any) => {
    if (!user) {
      alert("Please sign in to save your build.");
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_builds')
        .insert([
          { 
            user_id: user.id, 
            build_name: part.name, 
            components: part, 
            total_price: part.price 
          }
        ]);

      if (error) {
        alert("Error saving build: " + error.message);
      } else {
        alert(`${part.name} added to your saved builds!`);
      }
    } catch (err) {
      console.error("Supabase insert error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: data.reply,
          recommendations: data.recommendations 
        }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I encountered an error." }]);
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      setMessages([...newMessages, { role: 'assistant', content: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const inventory = [
    { "id": "cpu1", "name": "AMD Ryzen 7 7800X3D", "category": "CPU", "price": 399, "specs": "8-Core, 16-Thread, 3D V-Cache. Best for gaming.", "stock": 5 },
    { "id": "cpu2", "name": "Intel Core i7-14700K", "category": "CPU", "price": 409, "specs": "20-Core, 28-Thread. Great for gaming and productivity.", "stock": 8 },
    { "id": "gpu1", "name": "NVIDIA RTX 4070 Ti Super", "category": "GPU", "price": 799, "specs": "16GB VRAM. Excellent for 1440p and entry 4K gaming.", "stock": 3 },
    { "id": "gpu2", "name": "AMD Radeon RX 7900 XTX", "category": "GPU", "price": 999, "specs": "24GB VRAM. Great for 4K and Linux drivers.", "stock": 2 },
    { "id": "ram1", "name": "Corsair Vengeance 32GB DDR5 6000MHz", "category": "RAM", "price": 120, "specs": "Low latency CL30. Sweet spot for AMD CPUs.", "stock": 15 },
    { "id": "mb1", "name": "ASUS ROG Strix B650-A Gaming Wifi", "category": "Motherboard", "price": 229, "specs": "AM5 Socket, DDR5, PCIe 5.0. Great AMD foundation.", "stock": 6 },
    { "id": "mb2", "name": "MSI MAG Z790 Tomahawk WiFi", "category": "Motherboard", "price": 279, "specs": "LGA 1700 Socket, DDR5. Great Intel foundation.", "stock": 4 }
  ];

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
            {user ? (
              <>
                <button onClick={handleSignOut} className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">Sign Out</button>
                <button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Dashboard</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsAuthModalOpen(true)} className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">Sign In</button>
                <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Configure</button>
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
            onClick={() => setIsChatOpen(true)}
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
              <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800" alt="Sentinel PC" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">Sale</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase">The Sentinel</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-4">Perfect for 1080p and Esports</p>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                <span className="text-2xl font-black text-blue-400">$1,299</span>
                <button onClick={() => setIsChatOpen(true)} className="text-sm font-bold uppercase text-zinc-400 hover:text-white">Customize</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900 border border-blue-800 rounded-2xl overflow-hidden transition group relative shadow-xl shadow-blue-900/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 z-20"></div>
            <div className="h-56 bg-zinc-900 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800" alt="Vanguard PC" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">Popular</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase">The Vanguard</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-4">1440p Gaming and Streaming</p>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                <span className="text-2xl font-black text-blue-400">$1,899</span>
                <button onClick={() => setIsChatOpen(true)} className="text-sm font-bold uppercase text-blue-400 hover:text-blue-300">Customize</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-800 transition group">
            <div className="h-56 bg-zinc-900 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800" alt="Titan PC" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">New</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase">The Titan</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-4">4K Rendering and AI Dev</p>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                <span className="text-2xl font-black text-blue-400">$2,499</span>
                <button onClick={() => setIsChatOpen(true)} className="text-sm font-bold uppercase text-zinc-400 hover:text-white">Customize</button>
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

      {/* The 24/7 AI Concierge Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 flex flex-col overflow-hidden">
          <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">AI</div>
              <div>
                <h2 className="font-bold text-white text-sm">Apex AI Architect</h2>
                <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Online 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-zinc-500 hover:text-white text-xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900 border border-zinc-800'} p-4 rounded-2xl shadow-md`}>
                  <p className="text-zinc-100 leading-relaxed text-sm">{m.content}</p>
                  
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {m.recommendations.map((rec: any, idx: number) => {
                        const part = inventory.find(p => p.id === rec.id);
                        if (!part) return null;
                        return (
                          <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex gap-4">
                            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-xl font-bold text-blue-500">
                              {part.category[0]}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-sm">{part.name}</h3>
                              <p className="text-xs text-zinc-500 mt-1">{part.specs}</p>
                              <p className="text-xs text-blue-400 mt-2 italic">AI: {rec.reason}</p>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <span className="text-sm font-bold text-green-400">${part.price}</span>
                              <button onClick={() => handleAddToCart(part)} className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 rounded font-semibold">Add</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-4 rounded-2xl animate-pulse text-sm">Analyzing your needs...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 flex gap-3 bg-zinc-950">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell Apex your budget..."
              className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-xl outline-none border border-zinc-800 focus:border-blue-500 text-sm"
            />
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50 text-sm">
              Send
            </button>
          </form>
        </div>
      )}

      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 w-16 h-16 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-2xl transition-transform hover:scale-105"
        >
          🤖
        </button>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

    </div>
  );
}