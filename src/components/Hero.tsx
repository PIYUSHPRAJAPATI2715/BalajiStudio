'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src="/assets/background.mp4" type="video/mp4" />
                {/* Fallback if video fails to load or for different screen sizes if needed */}
                <div className="absolute inset-0 bg-black/80" />
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Background Marquee Text */}
            <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-10 pointer-events-none select-none">
                <motion.div
                    className="whitespace-nowrap flex text-[20vh] md:text-[30vh] font-bold font-heading text-white/20"
                    animate={{ x: [0, -1000] }} // specific value might be needed or use percentage if width is known, but simplistic loop works for now. Better to use percentage with repeat.
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                    style={{ x: 0 }}
                >
                    <span className="mx-4">SIDHI VINAYAK EVENTS</span>
                    <span className="mx-4">SIDHI VINAYAK EVENTS</span>
                    <span className="mx-4">SIDHI VINAYAK EVENTS</span>
                    <span className="mx-4">SIDHI VINAYAK EVENTS</span>
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-primary mb-4 uppercase">
                        Capturing Emotions
                    </h2>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    className="text-4xl md:text-6xl lg:text-8xl font-bold font-heading mb-6 uppercase drop-shadow-2xl"
                >
                    <span className="text-gradient-gold">Sidhi Vinayak</span> <br className="hidden md:block" /> <span className="text-white">events</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-lg md:text-2xl text-gray-200 max-w-2xl mb-12 font-light"
                >
                    Premium Event Management services. Creating timeless memories for your special moments.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="flex flex-col md:flex-row gap-6"
                >
                    <Link
                        href="#contact"
                        className="px-8 py-4 bg-primary text-black font-semibold rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
                    >
                        Book Now
                    </Link>
                    <Link
                        href="#portfolio"
                        className="px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300"
                    >
                        View Work
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <ArrowDown className="w-8 h-8 text-white/70" />
                </motion.div>
            </motion.div>
        </section>
    );
}
