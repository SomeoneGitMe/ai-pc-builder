'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', card: '' });

  useEffect(() => {
    const savedCart = localStorage.getItem('apex_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleRemoveItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('apex_cart', JSON.stringify(newCart));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('apex_cart');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem('apex_cart');
    setCart([]);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center max-w-lg shadow-2xl">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-black uppercase mb-4">Thank You for your Purchase!</h1>
          <p className="text-zinc-400 mb-8">A confirmation email has been sent to {formData.email || 'your email'}. Your Apex rig is now in the queue for building.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold uppercase tracking-wide transition inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase mb-4">Your Cart is Empty</h1>
          <p className="text-zinc-400 mb-8">Chat with our AI Architect to start building your rig.</p>
          <Link href="/apex-ai" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold uppercase tracking-wide transition inline-block">
            Start Building
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="text-xl font-black tracking-tight">APEX</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500">SYSTEMS</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto w-full py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black uppercase">Checkout</h1>
          <button onClick={handleClearCart} className="text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-wide transition">Clear Cart</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4">Billing Details</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Email Address</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Shipping Address</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Card Number (Mock)</label>
                <input type="text" required placeholder="4242 4242 4242 4242" value={formData.card} onChange={(e) => setFormData({...formData, card: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg uppercase tracking-wide transition mt-4">
                Complete Purchase
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white text-sm">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-blue-400">${item.price}</span>
                    <button onClick={() => handleRemoveItem(idx)} className="text-zinc-600 hover:text-red-500 text-xs uppercase transition">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 mt-6 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold uppercase">Total</span>
              <span className="text-2xl font-black text-blue-400">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}