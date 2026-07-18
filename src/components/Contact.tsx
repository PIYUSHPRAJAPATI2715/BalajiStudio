'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, ExternalLink, Youtube, Instagram, Sparkles, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const text = `*New Inquiry via Website*
        
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Message:* ${formData.message}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/917891766624?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden" id="contact">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

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
            <span>Connect With Us</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading mb-4 uppercase tracking-tight">
            Let's Plan Your <span className="text-gradient-gold">Dream Event</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light">
            Fill out the form to instantly send an inquiry via WhatsApp or book a consultation call.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          
          {/* Contact Information & Socials */}
          <div className="w-full lg:w-2/5 space-y-6">
            <div className="glass-panel-gold p-8 rounded-3xl relative overflow-hidden shadow-2xl">
              <Link href="/admin" className="absolute top-4 right-4 text-xs text-amber-400/60 hover:text-amber-300 transition-colors flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Admin Portal
              </Link>
              
              <h3 className="text-2xl font-bold font-heading mb-8 text-white">Contact Information</h3>

              <div className="space-y-6">
                <a href="tel:+917891766624" className="flex items-start gap-4 group">
                  <div className="p-3.5 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Direct Call / WhatsApp</p>
                    <p className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">+91 78917 66624</p>
                    <p className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">+91 97821 30139</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Email Us</p>
                    <p className="font-bold text-base text-white break-all">contact@sidhivinayakevents.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Jaipur Office</p>
                    <p className="font-bold text-base text-white">Niwaru, Jhotwara, Jaipur, Rajasthan 302012</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-8 mt-8 border-t border-white/10">
                <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-4">Follow Our Work</p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://www.youtube.com/@SidhiVinayak-Jaipur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3.5 rounded-2xl glass-panel hover:bg-red-600/20 hover:border-red-500/50 text-gray-200 hover:text-white transition-all text-sm font-semibold"
                  >
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://www.instagram.com/sidhivinayak_eventsjaipur/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3.5 rounded-2xl glass-panel hover:bg-pink-600/20 hover:border-pink-500/50 text-gray-200 hover:text-white transition-all text-sm font-semibold"
                  >
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-3/5 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Your Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950/80 border border-white/10 focus:border-amber-500/80 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all"
                    placeholder="Rahul Sharma"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Phone / WhatsApp</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-950/80 border border-white/10 focus:border-amber-500/80 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950/80 border border-white/10 focus:border-amber-500/80 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="rahul@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Event Type & Requirements</label>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-950/80 border border-white/10 focus:border-amber-500/80 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 outline-none h-32 resize-none transition-all"
                  placeholder="Mention event dates, location, & services needed (e.g. Wedding Photography + Pre-Wedding Shoot)..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-gold text-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 text-base"
              >
                {loading ? (
                  <span>Connecting to WhatsApp...</span>
                ) : status === 'success' ? (
                  <span>Message Sent Successfully!</span>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 fill-current" />
                    <span>Send Inquiry on WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
