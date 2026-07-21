'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Support() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const supportModules = [
    { title: "Contact Us", desc: "Phone, email, or chat with our 24/7 AI Support team.", icon: "📞" },
    { title: "Order Status", desc: "Track your current build and view shipping details.", icon: "📦" },
    { title: "FAQ / Knowledge Base", desc: "Troubleshooting guides and common questions.", icon: "📚" },
    { title: "Apex Warranty", desc: "View warranty terms and submit a claim.", icon: "🛡️" },
    { title: "Driver Downloads", desc: "Get the latest BIOS and driver updates for your rig.", icon: "💾" },
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
            <Link href="/support" className="text-white border-b-2 border-blue-500 pb-1">Support</Link>
          </div>
          <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Configure</button>
        </div>
      </nav>

      {/* Support Content */}
      <div className="max-w-5xl mx-auto w-full py-24 px-6 text-center">
        <h1 className="text-5xl font-black uppercase mb-4">We are keen to help you.</h1>
        <p className="text-zinc-400 mb-16 max-w-2xl mx-auto">Select an option below to get started. Our AI Architect is also available 24/7 in the bottom right corner.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {supportModules.map((module, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-800 transition cursor-pointer group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition">{module.icon}</div>
              <h3 className="text-xl font-bold uppercase mb-2 text-white">{module.title}</h3>
              <p className="text-zinc-500 text-sm">{module.desc}</p>
            </div>
          ))}
          
          {/* AI Support Card */}
          <div className="bg-blue-950 border border-blue-800 rounded-2xl p-8 hover:bg-blue-900 transition cursor-pointer group" onClick={() => setIsChatOpen(true)}>
            <div className="text-4xl mb-6 group-hover:scale-110 transition">🤖</div>
            <h3 className="text-xl font-bold uppercase mb-2 text-white">AI Architect</h3>
            <p className="text-blue-300 text-sm">Chat with our 24/7 AI Configurator for instant support.</p>
          </div>
        </div>
      </div>

      {/* AI Concierge Widget */}
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
              Welcome to Apex Systems. How can I assist you today?
            </div>
          </div>
          <div className="p-4 border-t border-zinc-800 flex gap-3 bg-zinc-950">
            <input className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-xl outline-none border border-zinc-800 focus:border-blue-500 text-sm" placeholder="Ask Apex..." />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white text-sm">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}