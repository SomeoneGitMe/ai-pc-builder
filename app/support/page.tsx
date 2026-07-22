'use client';

import Link from 'next/link';
import { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import Footer from '../components/Footer';

export default function Support() {
  const [activeView, setActiveView] = useState('grid');
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    
    const randomDays = Math.floor(Math.random() * 7) + 1;
    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + randomDays);
    const formattedEta = etaDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const locations = [
      "Columbus, OH Distribution Center",
      "Atlanta, GA Regional Hub",
      "Dallas, TX Sorting Facility",
      "Denver, CO Transit Center",
      "Secaucus, NJ Distribution Center"
    ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    setTrackingResult({
      id: trackingId,
      status: "In Transit",
      eta: `Estimated Delivery: ${formattedEta}`,
      location: `Currently at: ${randomLocation}`,
      details: `Your Apex rig has departed the regional facility and is on its way to your local hub.`
    });
  };

  const faqs = [
    { q: "How does the Apex AI Architect work?", a: "Our AI Architect is powered by a custom fine-tuned Llama-3 model. It analyzes your budget, use-case, and compatibility requirements to instantly recommend the perfect components for your build." },
    { q: "What is your return policy?", a: "We offer a 30-day money-back guarantee on all unopened components. If your custom PC arrives with any issues, we cover return shipping and will repair or replace it immediately." },
    { q: "Can I upgrade my PC later?", a: "Absolutely. We design our systems with standard form factors so you can easily swap out GPUs, add more RAM, or upgrade storage down the line without needing a whole new system." },
    { q: "Do you offer financing?", a: "Yes, we partner with Affirm to offer flexible payment plans. You can select the financing option at checkout." }
  ];

  const renderContent = () => {
    if (activeView === 'order') {
      return (
        <div className="max-w-3xl mx-auto text-left">
          <button onClick={() => setActiveView('grid')} className="text-blue-400 mb-8 hover:text-blue-300 flex items-center gap-2">← Back to Support</button>
          <h1 className="text-4xl font-black uppercase mb-4">Order Status</h1>
          <p className="text-zinc-400 mb-8">Enter your tracking ID to see the live status of your Apex rig.</p>
          <form onSubmit={handleTrack} className="flex gap-4 mb-8">
            <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="e.g. APEX-8675309" className="flex-1 bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white">Track</button>
          </form>
          {trackingResult && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <span className="text-xl font-bold text-white">{trackingResult.status}</span>
                <span className="bg-green-950 text-green-400 px-3 py-1 rounded-lg text-sm font-bold">On Schedule</span>
              </div>
              <p className="text-zinc-300"><span className="text-zinc-500">Tracking ID:</span> {trackingResult.id}</p>
              <p className="text-zinc-300"><span className="text-zinc-500">Current Location:</span> {trackingResult.location}</p>
              <p className="text-zinc-300"><span className="text-zinc-500">ETA:</span> {trackingResult.eta}</p>
              <p className="text-zinc-400 text-sm pt-4 border-t border-zinc-800">{trackingResult.details}</p>
            </div>
          )}
        </div>
      );
    }

    if (activeView === 'faq') {
      return (
        <div className="max-w-3xl mx-auto text-left">
          <button onClick={() => setActiveView('grid')} className="text-blue-400 mb-8 hover:text-blue-300 flex items-center gap-2">← Back to Support</button>
          <h1 className="text-4xl font-black uppercase mb-4">FAQ / Knowledge Base</h1>
          <p className="text-zinc-400 mb-8">Find answers to the most common Apex Systems questions.</p>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full text-left p-5 flex justify-between items-center hover:bg-zinc-800/50 transition">
                  <span className="font-bold text-white">{faq.q}</span>
                  <span className={`text-blue-400 text-xl transform transition-transform ${openFaq === idx ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-zinc-400 text-sm border-t border-zinc-800/50 mt-2">
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeView === 'contact') {
      return (
        <div className="max-w-3xl mx-auto text-left">
          <button onClick={() => setActiveView('grid')} className="text-blue-400 mb-8 hover:text-blue-300 flex items-center gap-2">← Back to Support</button>
          <h1 className="text-4xl font-black uppercase mb-4">Contact Us</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase text-zinc-500 mb-1">AI Support</h3>
              <p className="text-white">Available 24/7 via the chat bubble in the bottom right corner.</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-zinc-500 mb-1">Human Support</h3>
              <p className="text-white">1-800-APEX-PC1 (1-800-273-9721)</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-zinc-500 mb-1">Email</h3>
              <p className="text-white">support@apexsystems.ai</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-zinc-500 mb-1">Business Hours</h3>
              <p className="text-white">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
              <p className="text-zinc-500 text-sm">AI Support is available outside these hours.</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === 'warranty') {
      return (
        <div className="max-w-3xl mx-auto text-left">
          <button onClick={() => setActiveView('grid')} className="text-blue-400 mb-8 hover:text-blue-300 flex items-center gap-2">← Back to Support</button>
          <h1 className="text-4xl font-black uppercase mb-4">Apex Warranty</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Standard 3-Year Warranty</h3>
              <p className="text-zinc-400">Every Apex system comes with a standard 3-year parts and labor warranty. If any component fails under normal use, we will repair or replace it free of charge.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Shipping Coverage</h3>
              <p className="text-zinc-400">If your PC requires service within the first year, we cover all shipping costs to and from our facility.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Submit a Claim</h3>
              <p className="text-zinc-400">To submit a warranty claim, please use our AI Architect to generate a support ticket, or email warranty@apexsystems.ai with your order number and a description of the issue.</p>
            </div>
          </div>
        </div>
      );
    }

    // Grid View (Default)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        <div onClick={() => setActiveView('contact')} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-800 transition cursor-pointer group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition">📞</div>
          <h3 className="text-xl font-bold uppercase mb-2 text-white">Contact Us</h3>
          <p className="text-zinc-500 text-sm">Phone, email, or chat with our 24/7 AI Support team.</p>
        </div>
        <div onClick={() => setActiveView('order')} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-800 transition cursor-pointer group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition">📦</div>
          <h3 className="text-xl font-bold uppercase mb-2 text-white">Order Status</h3>
          <p className="text-zinc-500 text-sm">Track your current build and view shipping details.</p>
        </div>
        <div onClick={() => setActiveView('faq')} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-800 transition cursor-pointer group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition">📚</div>
          <h3 className="text-xl font-bold uppercase mb-2 text-white">FAQ / Knowledge Base</h3>
          <p className="text-zinc-500 text-sm">Troubleshooting guides and common questions.</p>
        </div>
        <div onClick={() => setActiveView('warranty')} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-800 transition cursor-pointer group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition">🛡️</div>
          <h3 className="text-xl font-bold uppercase mb-2 text-white">Apex Warranty</h3>
          <p className="text-zinc-500 text-sm">View warranty terms and submit a claim.</p>
        </div>
        <Link href="/apex-ai" className="bg-blue-950 border border-blue-800 rounded-2xl p-8 hover:bg-blue-900 transition cursor-pointer group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition">🤖</div>
          <h3 className="text-xl font-bold uppercase mb-2 text-white">AI Architect</h3>
          <p className="text-blue-300 text-sm">Chat with our 24/7 AI Configurator for instant support.</p>
        </Link>
      </div>
    );
  };

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
            <Link href="/workstations" className="hover:text-white transition">Workstations</Link>
            <Link href="/laptops" className="hover:text-white transition">Laptops</Link>
            <Link href="/support" className="text-white border-b-2 border-blue-500 pb-1">Support</Link>
          </div>
          <Link href="/apex-ai" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition shadow-lg shadow-blue-500/20">Configure</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto w-full py-24 px-6 text-center flex-grow">
        {activeView === 'grid' && (
          <>
            <h1 className="text-5xl font-black uppercase mb-4">We are keen to help you.</h1>
            <p className="text-zinc-400 mb-16 max-w-2xl mx-auto">Select an option below to get started. Our AI Architect is also available 24/7 in the bottom right corner.</p>
          </>
        )}
        {renderContent()}
      </div>

      <Footer />
      <ChatBubble />
    </div>
  );
}