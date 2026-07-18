'use client';

import { motion } from 'framer-motion';
import { Phone, Sparkles } from 'lucide-react';
import Image from 'next/image';

const team = [
  {
    name: 'Vishnu Prajapati',
    role: 'Event Director',
    phone: '+91 78917 66624',
    image: '/assets/vishnu.jpg',
  },
  {
    name: 'Manoj Prajapati',
    role: 'Finance & Operations',
    phone: '+91 97821 30139',
    image: '/assets/mannu.jpg',
  },
  {
    name: 'Piyush Prajapati',
    role: 'Production & Creative Lead',
    phone: '+91 95493 48495',
    image: '/assets/piyush.jpg',
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Masterminds Behind The Magic</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading mb-4 uppercase tracking-tight">
            Meet Our <span className="text-gradient-gold">Leadership</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light">
            Dedicated event planners & cinematographers bringing your dream celebrations to life.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-500 group gold-glow-hover"
            >
              <div className="h-72 overflow-hidden relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white font-heading group-hover:text-amber-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-amber-400 font-semibold text-xs uppercase tracking-wider mt-1">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-white/10 flex items-center justify-between bg-zinc-950/60">
                <a
                  href={`tel:${member.phone.replace(/ /g, '')}`}
                  className="w-full py-3 rounded-2xl glass-panel-gold flex items-center justify-center gap-2.5 text-amber-300 hover:bg-amber-500 hover:text-black font-semibold text-sm transition-all"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call {member.name.split(' ')[0]}</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
