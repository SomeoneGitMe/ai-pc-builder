'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../../src/utils/supabaseClient';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
};

export default function ApexTerminalPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadHistory = () => {
    const saved = localStorage.getItem('apex_chat_history');
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('apex-chat-update', loadHistory);
    
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
    };
    getUser();

    const savedCart = localStorage.getItem('apex_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    return () => window.removeEventListener('apex-chat-update', loadHistory);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const presetName = params.get('preset');
      const presetPrice = params.get('price');
      
      if (presetName && presetPrice && messages.length === 0) {
        handleSend(`Show me a complete build for the "${presetName}" rig. The target budget for this build is $${presetPrice}. Include all 7 components.`);
      }
    }
  }, [messages.length]);

  const syncChat = (newMessages: Message[]) => {
    setMessages(newMessages);
    localStorage.setItem('apex_chat_history', JSON.stringify(newMessages));
    window.dispatchEvent(new Event('apex-chat-update'));
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('apex_chat_history');
    window.dispatchEvent(new Event('apex-chat-update'));
  };

  const handleAddToCart = (part: any) => {
    const newCart = [...cart, part];
    setCart(newCart);
    localStorage.setItem('apex_cart', JSON.stringify(newCart));
    alert(`${part.name} added to your cart!`);

    if (user) {
      supabase.from('saved_builds').insert([
        { user_id: user.id, build_name: part.name, components: part, total_price: part.price }
      ]).then(({ error }) => {
        if (error) console.error("Supabase insert error:", error);
      });
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    const newMessages = [...messages, userMessage];
    
    syncChat(newMessages);
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
        syncChat([...newMessages, { role: 'assistant', content: data.reply, recommendations: data.recommendations }]);
      } else {
        syncChat([...newMessages, { role: 'assistant', content: "Sorry, I encountered an error." }]);
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      syncChat([...newMessages, { role: 'assistant', content: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const renderContent = (content: string | any[]) => {
    if (typeof content === 'string') return content;
    return content.map((c: any, i: number) => {
      if (c.type === 'text') return <span key={i}>{c.text}</span>;
      if (c.type === 'image_url') return <img key={i} src={c.image_url.url} alt="Chart" className="mt-2 rounded-lg max-w-full" />;
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="text-xl font-black tracking-tight">APEX</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500">SYSTEMS</span>
          </Link>
          <div className="flex gap-4 items-center">
            {messages.length > 0 && (
              <button onClick={handleClearChat} className="text-zinc-500 hover:text-white text-sm font-bold uppercase tracking-wide transition">Clear Chat</button>
            )}
            <Link href="/checkout" className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition">
              Cart ({cart.length})
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col p-8 max-w-4xl w-full mx-auto">
        <h1 className="text-3xl font-black uppercase mb-6">Apex AI Terminal</h1>
        
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-20">
                <p className="text-zinc-500 text-lg">How can I assist with your build today?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}>
                  {renderContent(m.content)}
                  
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {m.recommendations.map((rec: any, idx: number) => {
                        const inventory = [
                          { "id": "cpu1", "name": "AMD Ryzen 5 5600", "category": "CPU", "price": 115, "specs": "6-Core, 12-Thread." },
                          { "id": "cpu2", "name": "Intel Core i5-12400F", "category": "CPU", "price": 130, "specs": "6-Core, 12-Thread." },
                          { "id": "cpu3", "name": "AMD Ryzen 5 7600X", "category": "CPU", "price": 199, "specs": "6-Core, 12-Thread, AM5." },
                          { "id": "cpu4", "name": "Intel Core i7-14700K", "category": "CPU", "price": 409, "specs": "20-Core, 28-Thread." },
                          { "id": "cpu5", "name": "AMD Ryzen 9 7950X3D", "category": "CPU", "price": 599, "specs": "16-Core, 32-Thread." },
                          { "id": "mb1", "name": "MSI B550-A PRO", "category": "Motherboard", "price": 90, "specs": "AM4 Socket, DDR4." },
                          { "id": "mb2", "name": "ASRock B660M", "category": "Motherboard", "price": 85, "specs": "LGA 1700 Socket, DDR4." },
                          { "id": "mb3", "name": "ASUS ROG Strix B650-A", "category": "Motherboard", "price": 229, "specs": "AM5 Socket, DDR5." },
                          { "id": "mb4", "name": "MSI MAG Z790 Tomahawk", "category": "Motherboard", "price": 279, "specs": "LGA 1700 Socket, DDR5." },
                          { "id": "gpu1", "name": "AMD Radeon RX 7600", "category": "GPU", "price": 249, "specs": "8GB VRAM." },
                          { "id": "gpu2", "name": "NVIDIA RTX 4060", "category": "GPU", "price": 299, "specs": "8GB VRAM." },
                          { "id": "gpu3", "name": "AMD Radeon RX 7700 XT", "category": "GPU", "price": 449, "specs": "12GB VRAM." },
                          { "id": "gpu4", "name": "NVIDIA RTX 4070 Ti Super", "category": "GPU", "price": 799, "specs": "16GB VRAM." },
                          { "id": "gpu5", "name": "AMD Radeon RX 7900 XTX", "category": "GPU", "price": 999, "specs": "24GB VRAM." },
                          { "id": "gpu6", "name": "NVIDIA RTX 4090", "category": "GPU", "price": 1799, "specs": "24GB VRAM." },
                          { "id": "ram1", "name": "Corsair Vengeance 16GB DDR4", "category": "RAM", "price": 40, "specs": "3200MHz." },
                          { "id": "ram2", "name": "TEAMGROUP 16GB DDR5", "category": "RAM", "price": 55, "specs": "5200MHz." },
                          { "id": "ram3", "name": "Corsair Vengeance 32GB DDR5", "category": "RAM", "price": 120, "specs": "6000MHz CL30." },
                          { "id": "ram4", "name": "G.Skill Trident Z5 64GB DDR5", "category": "RAM", "price": 250, "specs": "7200MHz." },
                          { "id": "storage1", "name": "Crucial P3 500GB NVMe", "category": "Storage", "price": 40, "specs": "PCIe 3.0." },
                          { "id": "storage2", "name": "WD Black SN770 1TB NVMe", "category": "Storage", "price": 79, "specs": "PCIe 4.0." },
                          { "id": "storage3", "name": "Samsung 990 Pro 2TB NVMe", "category": "Storage", "price": 169, "specs": "PCIe 4.0." },
                          { "id": "storage4", "name": "Samsung 990 Pro 4TB NVMe", "category": "Storage", "price": 299, "specs": "Massive storage." },
                          { "id": "psu1", "name": "EVGA 600 W1 600W", "category": "Power Supply", "price": 50, "specs": "600W, 80+ White." },
                          { "id": "psu2", "name": "Corsair RM750e 750W", "category": "Power Supply", "price": 99, "specs": "750W, 80+ Gold." },
                          { "id": "psu3", "name": "Corsair RM850e 850W", "category": "Power Supply", "price": 124, "specs": "850W, ATX 3.0." },
                          { "id": "psu4", "name": "Seasonic Vertex GX-1000", "category": "Power Supply", "price": 189, "specs": "1000W, 80+ Gold." },
                          { "id": "case1", "name": "Montech AIR 100 ARGB", "category": "Case", "price": 60, "specs": "Micro-ATX, Mesh front." },
                          { "id": "case2", "name": "NZXT H7 Flow", "category": "Case", "price": 109, "specs": "Mid Tower, Mesh front." },
                          { "id": "case3", "name": "Lian Li O11 Dynamic EVO", "category": "Case", "price": 159, "specs": "Mid Tower, Tempered Glass." }
                        ];
                        const part = inventory.find(p => p.id === rec.id);
                        if (!part) return null;
                        return (
                          <div key={idx} className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 flex gap-3 items-center">
                            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-blue-500 font-bold">{part.category[0]}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-sm">{part.name}</h4>
                              <p className="text-zinc-500 text-xs">{part.specs}</p>
                              <p className="text-blue-400 text-xs mt-1 italic">AI: {rec.reason}</p>
                            </div>
                            <div className="flex flex-col items-end justify-between h-full">
                              <span className="text-green-400 text-sm font-bold">${part.price}</span>
                              <button onClick={() => handleAddToCart(part)} className="bg-blue-600 text-white text-xs px-2 py-1 rounded mt-1">Add</button>
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
                <div className="bg-zinc-800 text-zinc-400 p-4 rounded-xl animate-pulse">Analyzing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 flex gap-3 bg-zinc-950">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Apex about macro events, risk exposure, or strategy..."
              className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-xl outline-none border border-zinc-800 focus:border-blue-500"
            />
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-white disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}