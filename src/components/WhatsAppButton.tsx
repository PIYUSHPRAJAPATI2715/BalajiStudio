'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/917891766624"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 group"
            aria-label="Chat on WhatsApp"
        >
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                Chat with us!
            </span>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-shadow"
            >
                <MessageCircle className="w-8 h-8 fill-current" />
            </motion.div>
        </a>
    );
}
