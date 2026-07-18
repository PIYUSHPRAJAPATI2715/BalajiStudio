'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Heart, Home, Gift, Baby, Star, Zap, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ServiceModal from './ServiceModal';

const services = [
  {
    name: 'Full Wedding Shoots',
    icon: Heart,
    description: 'Complete royal wedding coverage, candid films, and memories to last forever.',
    image: '/assets/wedding_1.png',
    images: [
      '/assets/wedding_1.png',
      '/assets/wedding_2.png',
      '/assets/wedding_3.png',
      '/assets/wedding_4.png',
      '/assets/wedding_5.png'
    ]
  },
  {
    name: 'Pre-Wedding Shoots',
    icon: Camera,
    description: 'Artistic & romantic pre-wedding shoots at iconic palaces and scenic locations.',
    image: '/assets/prewedding_1.png',
    images: [
      '/assets/prewedding_1.png',
      '/assets/prewedding_2.png',
      '/assets/prewedding_3.png',
      '/assets/prewedding_4.png',
      '/assets/prewedding_5.png'
    ]
  },
  {
    name: 'Cinematic Photography',
    icon: Video,
    description: 'Hollywood-style cinematic color grading and 4K video storytelling.',
    image: '/assets/c1.jfif',
    images: [
      '/assets/c1.jfif',
      '/assets/c2.jfif',
      '/assets/c3.jfif',
      '/assets/c4.jfif',
      '/assets/c5.jfif',
      '/assets/c6.jfif'
    ]
  },
  {
    name: 'Bride Entry',
    icon: Star,
    description: 'Magical entry setup with pyros, cold sparks, and slow-motion video captures.',
    image: '/assets/b1.jfif',
    images: ['/assets/b1.jfif', '/assets/b2.jfif', '/assets/b3.jfif', '/assets/b4.jfif', '/assets/b5.jfif', '/assets/b6.jfif']
  },
  {
    name: 'Vermala Special',
    icon: Heart,
    description: 'Breathtaking stage setup, revolving platforms, & grand garland exchange.',
    image: '/assets/v1.jfif',
    images: ['/assets/v1.jfif', '/assets/v2.jfif', '/assets/v3.jfif', '/assets/v4.jfif', '/assets/v5.jfif', '/assets/v6.jfif']
  },
  {
    name: 'Baby Shower Shoots',
    icon: Baby,
    description: 'Cherishing the beauty of new beginnings with elegant maternity portraits.',
    image: '/assets/s1.jfif',
    images: ['/assets/s1.jfif', '/assets/s2.jfif', '/assets/s3.jfif', '/assets/s4.jfif', '/assets/s5.jfif', '/assets/s6.jfif']
  },
  {
    name: 'Birthday Parties',
    icon: Gift,
    description: 'Vibrant theme decorations, live entertainment, and joyful party coverage.',
    image: '/assets/p1.jfif',
    images: ['/assets/p1.jfif', '/assets/p2.jfif', '/assets/p3.jfif', '/assets/p4.jfif', '/assets/p5.jfif', '/assets/p6.jfif']
  },
  {
    name: 'House Opening (Griha Pravesh)',
    icon: Home,
    description: 'Auspicious ritual coverage and luxury interior showcase photography.',
    image: '/assets/h1.jfif',
    images: ['/assets/h1.jfif', '/assets/h2.jfif', '/assets/h3.jfif', '/assets/h4.jfif', '/assets/h5.jfif', '/assets/h6.jfif']
  },
  {
    name: 'Drone & Aerial View',
    icon: Zap,
    description: 'Licensed 4K drone cinematography capturing grand venues from above.',
    image: '/assets/d1.jfif',
    images: ['/assets/d1.jfif', '/assets/d2.jfif', '/assets/d3.jfif', '/assets/d4.jfif', '/assets/d5.jfif', '/assets/d6.jfif']
  },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Signature Offerings</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading mb-4 uppercase tracking-tight">
            Premium <span className="text-gradient-gold">Event Services</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light">
            Tap any service to view exclusive gallery photos & detailed booking packages.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => handleServiceClick(service)}
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-500/50 shadow-2xl transition-all duration-500 gold-glow-hover"
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-amber-300 font-medium flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                  <span>Explore Photos</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 backdrop-blur-md text-amber-400 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-white group-hover:text-amber-300 transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  <p className="text-gray-300 text-sm font-light line-clamp-2 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </section>
  );
}
