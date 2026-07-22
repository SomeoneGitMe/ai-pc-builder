import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-12 py-12 bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="text-white font-bold uppercase mb-4 text-xs tracking-wider">Shop</h4>
          <ul className="space-y-2">
            <li><Link href="/gaming-pcs" className="hover:text-white transition">Gaming PCs</Link></li>
            <li><Link href="/workstations" className="hover:text-white transition">Workstations</Link></li>
            <li><Link href="/laptops" className="hover:text-white transition">Laptops</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-4 text-xs tracking-wider">Support</h4>
          <ul className="space-y-2">
            <li><Link href="/support" className="hover:text-white transition">Help Center</Link></li>
            <li><Link href="/support" className="hover:text-white transition">Order Status</Link></li>
            <li><Link href="/support" className="hover:text-white transition">Warranty</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-4 text-xs tracking-wider">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-4 text-xs tracking-wider">Newsletter</h4>
          <p className="mb-2">Get the latest Apex updates.</p>
          <input type="email" placeholder="Email address" className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg w-full text-white outline-none focus:border-blue-500 text-xs" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-600 uppercase tracking-widest">
        © 2024 Apex Systems. AI-Engineered Solutions.
      </div>
    </footer>
  );
}