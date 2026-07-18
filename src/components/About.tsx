'use client';

import { motion } from 'framer-motion';
import { Camera, Heart, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  const images = [
    { src: '/assets/wedding_1.png', alt: 'Wedding Photography' },
    { src: '/assets/prewedding_1.png', alt: 'Pre-Wedding Shoot' },
    { src: '/assets/c1.jfif', alt: 'Cinematic Films' },
    { src: '/assets/b1.jfif', alt: 'Bride Entry' },
    { src: '/assets/v1.jfif', alt: 'Vermala Special' },
    { src: '/assets/s1.jfif', alt: 'Baby Shower' },
  ];

  const highlights = [
    'Cinematic 4K Ultra HD Drone Coverage',
    'Custom Luxury Decor & Theme Planning',
    'Candid & Traditional Storytelling',
    'Dedicated On-Site Event Coordinators',
  ];

  return (
    <section className="relative py-24 bg-zinc-950 text-white overflow-hidden" id="about">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14">
          
          {/* Visual Collage Grid */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-36 sm:h-44 w-full rounded-2xl border border-white/10 overflow-hidden shadow-lg shadow-black/60 group gold-glow-hover"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-semibold text-amber-300 font-heading">{img.alt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading mb-6 uppercase tracking-tight leading-tight">
              Crafting <span className="text-gradient-gold">Unforgettable</span> Stories & Celebrations
            </h2>

            <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed font-light">
              At <strong className="text-amber-400 font-semibold">Sidhi Vinayak Events</strong>, we don't just manage events; we design unforgettable life experiences. Combining high-end cinematic technology with Jaipur's rich royal heritage, we transform your dream celebration into reality.
            </p>

            {/* Key Highlights Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Experience Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 border-t border-white/10">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Camera className="w-5 h-5" />
                  <span className="font-extrabold text-2xl font-heading text-white">10+ Yrs</span>
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Experience</span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Heart className="w-5 h-5" />
                  <span className="font-extrabold text-2xl font-heading text-white">500+</span>
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Couples Loved</span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Award className="w-5 h-5" />
                  <span className="font-extrabold text-2xl font-heading text-white">100%</span>
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Perfection</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
