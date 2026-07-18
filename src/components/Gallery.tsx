'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Maximize2, X, Play } from 'lucide-react';

const mediaItems = [
  { type: 'image', src: '/assets/portfolio_new_1.png', category: 'Weddings', title: 'Royal Palace Mandap Setup' },
  { type: 'image', src: '/assets/portfolio_new_2.png', category: 'Weddings', title: 'Luxury Reception Night' },
  { type: 'image', src: '/assets/WhatsApp Image 2026-01-30 at 9.54.00 PM.jpeg', category: 'Pre-Wedding', title: 'Romantic Sunset Shoot' },
  { type: 'image', src: '/assets/WhatsApp Image 2026-01-30 at 9.54.06 PM.jpeg', category: 'Pre-Wedding', title: 'Heritage Fort Couple Story' },
  { type: 'image', src: '/assets/c1.jfif', category: 'Cinematic', title: 'Cinematic Bridal Portrait' },
  { type: 'image', src: '/assets/v1.jfif', category: 'Weddings', title: 'Royal Vermala Moment' },
  { type: 'image', src: '/assets/b1.jfif', category: 'Weddings', title: 'Grand Bride Entry' },
  { type: 'image', src: '/assets/s1.jfif', category: 'Baby Shower', title: 'Maternity Celebration' },
  { type: 'image', src: '/assets/d1.jfif', category: 'Drone', title: 'Aerial Venue Perspective' },
  { type: 'video', src: '/assets/WhatsApp Video 2026-01-30 at 10.12.20 PM.mp4', category: 'Videos', title: 'Pre-Wedding Cinematic Highlights' },
  { type: 'video', src: '/assets/WhatsApp Video 2026-01-30 at 9.54.39 PM.mp4', category: 'Videos', title: 'Wedding Day Teaser' },
];

const categories = ['All', 'Weddings', 'Pre-Wedding', 'Cinematic', 'Videos'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = mediaItems.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="portfolio" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Visual Masterpieces</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading mb-4 uppercase tracking-tight">
            Latest <span className="text-gradient-gold">Portfolio</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light">
            Browse through our portfolio of royal weddings, cinematic pre-weddings, & aerial shoots.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-gold text-black shadow-lg shadow-amber-500/20 scale-105'
                    : 'glass-panel text-gray-300 hover:text-white hover:border-amber-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightboxIndex(index)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-500/50 shadow-xl gold-glow-hover"
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <video
                    src={item.src}
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Hover Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <div className="p-2 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                      {item.type === 'video' ? <Play className="w-4 h-4 fill-current" /> : <Maximize2 className="w-4 h-4" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-heading text-white group-hover:text-amber-300 transition-colors mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400">Click to view full preview</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {filteredItems[lightboxIndex].type === 'image' ? (
                  <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden">
                    <Image
                      src={filteredItems[lightboxIndex].src}
                      alt={filteredItems[lightboxIndex].title}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <video
                    src={filteredItems[lightboxIndex].src}
                    controls
                    autoPlay
                    className="max-h-[70vh] w-full rounded-2xl"
                  />
                )}
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-bold font-heading text-white">{filteredItems[lightboxIndex].title}</h3>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{filteredItems[lightboxIndex].category}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
