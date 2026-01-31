import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-white pt-12 md:pt-16 pb-8 border-t border-white/10" id="contact">
            <div className="container mx-auto px-4">
                {/* Removed detailed columns as per request */}

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Sidhi Vinayak events. All rights reserved.</p>
                    <Link href="/admin" className="text-xs text-gray-700 hover:text-gray-500 mt-2 inline-block">Admin Login</Link>
                </div>
            </div>
        </footer>
    );
}
