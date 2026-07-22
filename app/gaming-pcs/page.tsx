'use client';

import Link from 'next/link';
import { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import Footer from '../components/Footer';

const allGamingPcs = [
  { id: 1, name: "Apex Scout", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i5-13400F", gpu: "NVIDIA RTX 4060", ram: "16GB DDR5 5200MHz", storage: "1TB NVMe SSD", price: 1099, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/27658/CS-IBP-SCALE-B-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 2, name: "Apex Striker", brand: "AMD", gpuBrand: "NVIDIA", cpu: "AMD Ryzen 5 7600X", gpu: "NVIDIA RTX 4060 Ti", ram: "32GB DDR5 6000MHz", storage: "1TB NVMe SSD", price: 1399, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32055/01-TraceX-Black-Main-400-RGB.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 3, name: "Apex Vanguard", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i7-14700K", gpu: "NVIDIA RTX 4070 Ti Super", ram: "32GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 1899, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/26643/gaming-pc-01-Y40-VCTA-R005-main-400-.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 4, name: "Apex Nomad", brand: "AMD", gpuBrand: "NVIDIA", cpu: "AMD Ryzen 7 7800X3D", gpu: "NVIDIA RTX 4070", ram: "32GB DDR5 6000MHz", storage: "1TB NVMe SSD", price: 1649, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/27658/CS-IBP-SCALE-B-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 5, name: "Apex Titan", brand: "AMD", gpuBrand: "NVIDIA", cpu: "AMD Ryzen 9 7950X3D", gpu: "NVIDIA RTX 4080 Super", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 2499, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32055/01-TraceX-Black-Main-400-RGB.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 6, name: "Apex Creator", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i9-14900K", gpu: "NVIDIA RTX 4080 Super", ram: "64GB DDR5 7200MHz", storage: "4TB NVMe SSD", price: 2899, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/26643/gaming-pc-01-Y40-VCTA-R005-main-400-.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 7, name: "Apex Genesis", brand: "Intel", gpuBrand: "NVIDIA", cpu: "Intel Core i9-14900KS", gpu: "NVIDIA RTX 4090", ram: "64GB DDR5 7200MHz", storage: "4TB NVMe SSD", price: 3299, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/27658/CS-IBP-SCALE-B-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 8, name: "Apex Rogue", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 5 7600", gpu: "AMD Radeon RX 7600", ram: "16GB DDR5 5200MHz", storage: "1TB NVMe SSD", price: 999, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32055/01-TraceX-Black-Main-400-RGB.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 9, name: "Apex Maverick", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 7 7700X", gpu: "AMD Radeon RX 7700 XT", ram: "32GB DDR5 6000MHz", storage: "1TB NVMe SSD", price: 1349, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/26643/gaming-pc-01-Y40-VCTA-R005-main-400-.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 10, name: "Apex Spectre", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 7 7800X3D", gpu: "AMD Radeon RX 7800 XT", ram: "32GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 1599, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/27658/CS-IBP-SCALE-B-400.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 11, name: "Apex Behemoth", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 9 7900X3D", gpu: "AMD Radeon RX 7900 XT", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 2399, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/32055/01-TraceX-Black-Main-400-RGB.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
  { id: 12, name: "Apex Extreme", brand: "AMD", gpuBrand: "AMD", cpu: "AMD Ryzen 9 9950X", gpu: "AMD Radeon RX 7900 XTX", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe SSD", price: 2799, img: "https://content.ibuypower.com/cdn-cgi/image/width=1080,format=auto,quality=85/https://content.ibuypower.com/Images/Components/26643/gaming-pc-01-Y40-VCTA-R005-main-400-.png?v=3a6b3421d6c82306d9655f42ab70589bfdae5306" },
];

export default function GamingPCs() {
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

  const filteredPcs = allGamingPcs.filter(pc => 
    activeBrands.includes(pc.brand) && activeGpus.includes(pc.gpuBrand) && pc.price <= maxPrice
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
            <Link href="/gaming-pcs" className="text-white border-b-2 border-blue-500 pb-1">Gaming PCs</Link>
            <Link href="/workstations" className="hover:text-white transition">Workstations</Link>
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
            <input type="range" min="900" max="3500" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-600" />
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
          <button onClick={() => { setActiveBrands(['Intel', 'AMD']); setActiveGpus(['NVIDIA', 'AMD']); setMaxPrice(3500); }} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold py-2 rounded-lg uppercase tracking-wide transition">Reset Filters</button>
        </aside>

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