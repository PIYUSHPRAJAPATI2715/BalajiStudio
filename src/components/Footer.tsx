import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-12 border-t border-amber-500/20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/50 relative">
              <Image
                src="/logo.png"
                alt="Sidhi Vinayak Events Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold font-heading text-gradient-gold">Sidhi Vinayak Events</span>
          </Link>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-medium">
            <Link href="#about" className="hover:text-amber-400 transition-colors">About Us</Link>
            <Link href="#services" className="hover:text-amber-400 transition-colors">Services</Link>
            <Link href="#portfolio" className="hover:text-amber-400 transition-colors">Portfolio</Link>
            <Link href="#booking" className="hover:text-amber-400 transition-colors">Book Date</Link>
            <Link href="#contact" className="hover:text-amber-400 transition-colors">Contact</Link>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Sidhi Vinayak Events Jaipur. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-amber-500 fill-current" /> for Memories
            </span>
            <Link href="/admin" className="text-gray-700 hover:text-amber-400 transition-colors underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
