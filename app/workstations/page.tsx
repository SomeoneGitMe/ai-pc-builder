'use client';

import Link from 'next/link';
import { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import Footer from '../components/Footer';

const allWorkstations = [
  { id: 1, name: "Apex Compile", brand: "Intel", cpu: "Intel Core i9-14900K", gpu: "NVIDIA RTX A2000", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 2799, img: "https://content.ibuypower.com/cdn-cgi/image/width=256,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32117/01-HYTE-X50-White-Main-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 2, name: "Apex Render", brand: "Intel", cpu: "Intel Xeon w7-2495X", gpu: "NVIDIA RTX 4000 Ada", ram: "64GB DDR5 ECC", storage: "2TB NVMe SSD", price: 3499, img: "https://content.ibuypower.com/cdn-cgi/image/width=256,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32135/01-HYTE-X50-Black-Main-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 3, name: "Apex Engineer", brand: "AMD", cpu: "AMD Threadripper 7970X", gpu: "NVIDIA RTX 4070 Ti", ram: "64GB DDR5 5200MHz", storage: "2TB NVMe SSD", price: 3899, img: "https://content.ibuypower.com/cdn-cgi/image/width=256,format=auto,quality=85/https://content.ibuypower.com/Images/Components/27602/CS-FRACTAL-008-400-V1.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 4, name: "Apex Studio", brand: "AMD", cpu: "AMD Threadripper 7960X", gpu: "NVIDIA RTX 4080 Super", ram: "128GB DDR5 5200MHz", storage: "4TB NVMe SSD", price: 4299, img: "https://content.ibuypower.com/cdn-cgi/image/width=256,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32117/01-HYTE-X50-White-Main-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 5, name: "Apex ML Pro", brand: "Intel", cpu: "Intel Xeon w9-3495X", gpu: "2x NVIDIA RTX 4500 Ada", ram: "256GB DDR5 ECC", storage: "4TB NVMe SSD", price: 8999, img: "https://content.ibuypower.com/cdn-cgi/image/width=256,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32135/01-HYTE-X50-Black-Main-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 6, name: "Apex AI Titan", brand: "AMD", cpu: "AMD Threadripper 9970X", gpu: "NVIDIA RTX 4090", ram: "128GB DDR5 5200MHz", storage: "4TB NVMe SSD", price: 5999, img: "https://content.ibuypower.com/cdn-cgi/image/width=256,format=auto,quality=85/https://content.ibuypower.com/Images/Components/27602/CS-FRACTAL-008-400-V1.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
];

export default function Workstations() {
  const [activeBrands, setActiveBrands] = useState<string[]>(['Intel', 'AMD']);
  const [maxPrice, setMaxPrice] = useState(10000);

  const handleToggle = (value: string, stateArray: string[], setter: Function) => {
    if (stateArray.includes(value)) {
      setter(stateArray.filter(b => b !== value));
    } else {
      setter([...stateArray, value]);
    }
  };

  const filteredPcs = allWorkstations.filter(pc => 
    activeBrands.includes(pc.brand) && pc.price <= maxPrice
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="text-xl font-black tracking-tight">APEX</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500">SYSTEMS</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400 uppercase tracking-wider">
            <Link href="/gaming-pcs" className="hover:text-white transition">Gaming PCs</Link>
            <Link href="/workstations" className="text-white border-b-2 border-blue-500 pb-1">Workstations</Link>
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/support" className="hover:text-white transition">Support</Link>
          </div>
          <Link href="/apex-ai" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Configure</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full py-12 px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 flex-grow">
        <aside className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-black uppercase mb-6 border-b border-zinc-800 pb-4">Filters</h2>
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-zinc-400 mb-4">Max Price</h3>
            <input type="range" min="2000" max="10000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-600" />
            <p className="text-center text-blue-400 font-bold mt-2">${maxPrice.toLocaleString()}</p>
          </div>
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-zinc-400 mb-4">Processor Brand</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer hover:text-white transition">
                <input type="checkbox" checked={activeBrands.includes('Intel')} onChange={() => handleToggle('Intel', activeBrands, setActiveBrands)} className="w-4 h-4 accent-blue-600" />
                <span className={activeBrands.includes('Intel') ? 'text-white' : 'text-zinc-500'}>Intel</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-white transition">
                <input type="checkbox" checked={activeBrands.includes('AMD')} onChange={() => handleToggle('AMD', activeBrands, setActiveBrands)} className="w-4 h-4 accent-blue-600" />
                <span className={activeBrands.includes('AMD') ? 'text-white' : 'text-zinc-500'}>AMD</span>
              </label>
            </div>
          </div>
          <button onClick={() => { setActiveBrands(['Intel', 'AMD']); setMaxPrice(10000); }} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold py-2 rounded-lg uppercase tracking-wide transition">Reset Filters</button>
        </aside>

        <div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black uppercase mb-1">Workstations</h1>
              <p className="text-zinc-500 text-sm">{filteredPcs.length} Systems Available</p>
            </div>
            <select className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm px-4 py-2 rounded-lg outline-none">
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPcs.map((pc) => (
              <div key={pc.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-800 transition group flex flex-col">
                <div className="h-44 bg-zinc-900 relative overflow-hidden flex items-center justify-center p-4">
                  <img src={pc.img} alt={pc.name} className="absolute inset-0 w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold uppercase text-white">{pc.name}</h3>
                  <div className="mt-3 space-y-1.5 text-xs text-zinc-400 flex-grow">
                    <p><span className="text-zinc-600">CPU:</span> {pc.cpu}</p>
                    <p><span className="text-zinc-600">GPU:</span> {pc.gpu}</p>
                    <p><span className="text-zinc-600">RAM:</span> {pc.ram}</p>
                    <p><span className="text-zinc-600">Storage:</span> {pc.storage}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-4">
                    <span className="text-xl font-black text-blue-400">${pc.price.toLocaleString()}</span>
                    <Link href={{ pathname: '/apex-ai', query: { preset: pc.name, price: pc.price } }} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition">Customize</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <ChatBubble />
    </div>
  );
}