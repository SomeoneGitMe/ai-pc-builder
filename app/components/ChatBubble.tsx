'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/utils/supabaseClient';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
};

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  const loadHistory = () => {
    const saved = localStorage.getItem('apex_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) { console.error("Failed to parse chat history", e); }
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

  const syncChat = (newMessages: Message[]) => {
    setMessages(newMessages);
    localStorage.setItem('apex_chat_history', JSON.stringify(newMessages));
    window.dispatchEvent(new Event('apex-chat-update'));
  };

  // NEW: Clear chat history
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
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
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-indigo-400">Apex AI Architect</h3>
              <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Online 24/7</p>
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button onClick={handleClearChat} className="text-zinc-500 hover:text-white text-xs uppercase tracking-wide transition">Clear</button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950">
            {messages.length === 0 && (
              <p className="text-zinc-500 text-sm text-center mt-10">Ask Apex to build your rig...</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-200'}`}>
                  {renderContent(m.content)}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2">
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
                          <div key={idx} className="bg-zinc-950 border border-zinc-700 rounded-lg p-2 flex gap-2 items-center">
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-xs">{part.name}</h4>
                              <p className="text-blue-400 text-xs italic">AI: {rec.reason}</p>
                            </div>
                            <span className="text-green-400 text-xs font-bold">${part.price}</span>
                            <button onClick={() => handleAddToCart(part)} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Add</button>
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
                <div className="bg-zinc-800 text-zinc-400 p-3 rounded-lg text-sm animate-pulse">Typing...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800 flex gap-2 bg-zinc-950">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Apex..."
              className="flex-1 bg-zinc-900 text-white px-3 py-2 rounded-lg outline-none text-sm border border-zinc-800 focus:border-blue-500"
            />
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 w-14 h-14 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-2xl transition-transform hover:scale-105"
      >
        {isOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
}