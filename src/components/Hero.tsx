'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Star, Sparkles, Calendar, Award, Camera } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const stats = [
    { value: '500+', label: 'Luxury Events', icon: Camera },
    { value: '5.0 ★', label: 'Top Customer Rating', icon: Star },
    { value: '10+ Yrs', label: 'Crafting Memories', icon: Award },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-12">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 scale-105 transition-transform duration-1000"
      >
        <source src="/assets/background.mp4" type="video/mp4" />
        <div className="absolute inset-0 bg-black/90" />
      </video>

      {/* Layered Overlays for Luxury Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none z-10" />

      {/* Background Marquee Text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-10 pointer-events-none select-none">
        <div className="marquee-container">
          <div className="marquee-content whitespace-nowrap text-[22vh] md:text-[32vh] font-extrabold font-heading text-amber-300/20">
            <span className="mx-6">SIDHI VINAYAK EVENTS</span>
            <span className="mx-6">SIDHI VINAYAK EVENTS</span>
            <span className="mx-6">SIDHI VINAYAK EVENTS</span>
            <span className="mx-6">SIDHI VINAYAK EVENTS</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 my-auto flex flex-col items-center text-center">
        {/* Floating Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-gold mb-6 text-xs md:text-sm font-semibold tracking-wider text-amber-300 uppercase shadow-lg shadow-amber-500/10 border border-amber-500/30"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Jaipur's Premier Event Management & Wedding Photography</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight mb-6 uppercase leading-none"
        >
          <span className="text-white drop-shadow-lg">You Dream, We Create</span> <br />
          <span className="text-gradient-gold drop-shadow-2xl">Memories</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mb-10 font-light leading-relaxed px-2"
        >
          Transforming your grand celebrations, destination weddings, & intimate moments into timeless, cinematic masterpieces.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
        >
          <Link
            href="#contact"
            className="group relative px-8 py-4 bg-gradient-gold text-black font-bold rounded-full overflow-hidden shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-base"
          >
            <Calendar className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
            <span>Book Your Date</span>
            <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          <Link
            href="#portfolio"
            className="px-8 py-4 glass-panel text-white font-semibold rounded-full hover:bg-white/10 hover:border-amber-400/50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 text-base border border-white/20"
          >
            <span>Explore Portfolio</span>
          </Link>
        </motion.div>

        {/* Live Trust Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-14 grid grid-cols-3 gap-3 md:gap-8 max-w-3xl w-full px-2"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-panel p-3 md:p-5 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all text-center group"
            >
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-amber-400 font-heading group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="relative z-20 flex justify-center mt-6"
      >
        <Link
          href="#about"
          aria-label="Scroll down to About section"
          className="p-3 rounded-full glass-panel hover:border-amber-400/50 transition-colors animate-bounce text-amber-400/80 hover:text-amber-300"
        >
          <ArrowDown className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  );
}
