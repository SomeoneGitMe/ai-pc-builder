'use client';

import Link from 'next/link';
import { useState } from 'react';

// Legitimate mock data structured for LLM parsing (Balanced AMD/NVIDIA)
const allGamingPcs = [
  // NVIDIA Builds
  { id: 1, name: "Apex Scout", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i5-13400F", gpu: "NVIDIA RTX 4060", ram: "16GB DDR5 5200MHz", storage: "1TB NVMe SSD", price: 1099, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600" },
  { id: 2, name: "Apex Striker", brand: "AMD", gpuBrand: "NVIDIA", cpu: "AMD Ryzen 5 7600X", gpu: "NVIDIA RTX 4060 Ti", ram: "32GB DDR5 6000MHz", storage: "1TB NVMe SSD", price: 1399, img: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600" },
  { id: 3, name: "Apex Vanguard", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i7-14700K", gpu: "NVIDIA RTX 4070 Ti Super", ram: "32GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 1899, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600" },
  { id: 4, name: "Apex Nomad", brand: "AMD", gpuBrand: "NVIDIA", cpu: "AMD Ryzen 7 7800X3D", gpu: "NVIDIA RTX 4070", ram: "32GB DDR5 6000MHz", storage: "1TB NVMe SSD", price: 1649, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600" },
  { id: 5, name: "Apex Titan", brand: "AMD", gpuBrand: "NVIDIA", cpu: "AMD Ryzen 9 7950X3D", gpu: "NVIDIA RTX 4080 Super", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 2499, img: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600" },
  { id: 6, name: "Apex Creator", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i9-14900K", gpu: "NVIDIA RTX 4080 Super", ram: "64GB DDR5 7200MHz", storage: "4TB NVMe SSD", price: 2899, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600" },
  { id: 7, name: "Apex Genesis", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i9-14900KS", gpu: "NVIDIA RTX 4090", ram: "64GB DDR5 7200MHz", storage: "4TB NVMe SSD", price: 3299, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600" },
  
  // AMD Radeon Builds
  { id: 8, name: "Apex Rogue", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 5 7600", gpu: "AMD Radeon RX 7600", ram: "16GB DDR5 5200MHz", storage: "1TB NVMe SSD", price: 999, img: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600" },
  { id: 9, name: "Apex Maverick", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 7 7700X", gpu: "AMD Radeon RX 7700 XT", ram: "32GB DDR5 6000MHz", storage: "1TB NVMe SSD", price: 1349, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600" },
  { id: 10, name: "Apex Spectre", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 7 7800X3D", gpu: "AMD Radeon RX 7800 XT", ram: "32GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 1599, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600" },
  { id: 11, name: "Apex Behemoth", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 9 7900X3D", gpu: "AMD Radeon RX 7900 XT", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 2399, img: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600" },
  { id: 12, name: "Apex Extreme", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 9 9950X", gpu: "AMD Radeon RX 7900 XTX", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 2799, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600" },
];

export default function GamingPCs() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Filter State
  const [activeBrands, setActiveBrands] = useState<string[]>(['Intel', 'AMD']);
  const [activeGpus, setActiveGpus] = useState<string[]>(['NVIDIA', 'AMD']);
  const [maxPrice, setMaxPrice] = useState(3500);

  const handleToggle = (value: string, stateArray: string[], setter: Function) => {
    if (stateArray.includes(value)) {
      setter(stateArray.filter(b => b !== value));
    } else {
      setter([...stateArray, value]);
    }
  };

  // Apply filters to the product list
  const filteredPcs = allGamingPcs.filter(pc => 
    activeBrands.includes(pc.brand) && 
    activeGpus.includes(pc.gpuBrand) && 
    pc.price <= maxPrice
  );

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
            <Link href="/gaming-pcs" className="text-white border-b-2 border-blue-500 pb-1">Gaming PCs</Link>
            <Link href="/workstations" className="hover:text-white transition">Workstations</Link>
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/support" className="hover:text-white transition">Support</Link>
          </div>
          
          <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Configure</button>
        </div>
      </nav>

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="max-w-7xl mx-auto w-full py-12 px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        {/* Sidebar Filters */}
        <aside className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-black uppercase mb-6 border-b border-zinc-800 pb-4">Filters</h2>
          
          {/* Price Filter */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-zinc-400 mb-4">Max Price</h3>
            <input 
              type="range" 
              min="900" 
              max="3500" 
              step="100" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="w-full accent-blue-600"
            />
            <p className="text-center text-blue-400 font-bold mt-2">${maxPrice.toLocaleString()}</p>
          </div>

          {/* CPU Brand Filter */}
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

          {/* GPU Brand Filter */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-zinc-400 mb-4">Graphics Card</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer hover:text-white transition">
                <input type="checkbox" checked={activeGpus.includes('NVIDIA')} onChange={() => handleToggle('NVIDIA', activeGpus, setActiveGpus)} className="w-4 h-4 accent-blue-600" />
                <span className={activeGpus.includes('NVIDIA') ? 'text-white' : 'text-zinc-500'}>NVIDIA GeForce</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-white transition">
                <input type="checkbox" checked={activeGpus.includes('AMD')} onChange={() => handleToggle('AMD', activeGpus, setActiveGpus)} className="w-4 h-4 accent-blue-600" />
                <span className={activeGpus.includes('AMD') ? 'text-white' : 'text-zinc-500'}>AMD Radeon</span>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <button 
            onClick={() => { setActiveBrands(['Intel', 'AMD']); setActiveGpus(['NVIDIA', 'AMD']); setMaxPrice(3500); }} 
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold py-2 rounded-lg uppercase tracking-wide transition"
          >
            Reset Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black uppercase mb-1">All Gaming PCs</h1>
              <p className="text-zinc-500 text-sm">{filteredPcs.length} Systems Available</p>
            </div>
            <select className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm px-4 py-2 rounded-lg outline-none">
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPcs.map((pc) => (
              <div key={pc.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-800 transition group flex flex-col">
                <div className="h-44 bg-zinc-900 relative overflow-hidden">
                  <img src={pc.img} alt={pc.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent z-10"></div>
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
                    <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition">Customize</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Concierge Widget (Shared across pages) */}
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
          <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-sm text-zinc-200">
              Welcome to Apex Systems. Tell me your budget and what you'll be using the PC for, and I'll build your perfect rig instantly.
            </div>
          </div>
          <div className="p-4 border-t border-zinc-800 flex gap-3 bg-zinc-950">
            <input className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-xl outline-none border border-zinc-800 focus:border-blue-500 text-sm" placeholder="Tell Apex your budget..." />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white text-sm">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}