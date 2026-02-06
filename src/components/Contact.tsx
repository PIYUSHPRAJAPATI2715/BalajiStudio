'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, ExternalLink, Youtube, Instagram } from 'lucide-react';

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

        // Construct WhatsApp Message
        const text = `*New Inquiry via Website*
        
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Message:* ${formData.message}`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/917891766624?text=${encodedText}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Also save to backend (optional, but good for backup)
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
                setStatus('error'); // Silent fail if backend fails, since WhatsApp opened
            }
        } catch (error) {
            console.error(error);
            // Don't show error to user if WhatsApp opened successfully
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-12 md:py-20 bg-zinc-950 text-white" id="contact">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-primary">Get in Touch</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Have a question or want to discuss your event? Fill out the form below or contact us directly.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                    {/* Contact Info Card */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-zinc-900/80 p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                            <Link href="/admin" className="absolute top-4 right-4 text-xs text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> Admin
                            </Link>
                            <h3 className="text-2xl font-bold mb-8 text-white">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-zinc-800 rounded-xl text-primary border border-white/5">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary mb-1 font-medium">Call Us</p>
                                        <p className="font-bold text-lg">+91 78917 66624</p>
                                        <p className="font-bold text-lg">+91 97821 30139</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-zinc-800 rounded-xl text-primary border border-white/5">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary mb-1 font-medium">Email Us</p>
                                        <p className="font-bold text-lg break-all">contact@sidhivinayakevents.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-zinc-800 rounded-xl text-primary border border-white/5">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary mb-1 font-medium">Visit Us</p>
                                        <p className="font-bold text-lg">Niwaru, Jhotwara, Jaipur, Rajasthan</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/10">
                                <p className="text-sm text-primary mb-4 font-medium">Follow Us</p>
                                <div className="flex gap-4">
                                    <a
                                        href="https://www.youtube.com/@SidhiVinayak-Jaipur"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Visit our YouTube channel"
                                        className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl border border-white/5 hover:border-primary/50 transition-all group flex-1"
                                    >
                                        <div className="p-2 bg-red-600/20 rounded-lg text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <Youtube className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-gray-300 group-hover:text-white">YouTube</span>
                                    </a>
                                    <a
                                        href="https://www.instagram.com/sidhivinayak_eventsjaipur/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Follow us on Instagram"
                                        className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl border border-white/5 hover:border-primary/50 transition-all group flex-1"
                                    >
                                        <div className="p-2 bg-pink-600/20 rounded-lg text-pink-500 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                            <Instagram className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-gray-300 group-hover:text-white">Instagram</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="w-full lg:w-2/3 bg-zinc-900 p-8 rounded-2xl border border-white/10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                        placeholder="+91 99999 99999"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea
                                    id="contact-message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-32 resize-none transition-colors"
                                    placeholder="Tell us about your event..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === 'success'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-primary text-black hover:bg-white'
                                    }`}
                            >
                                {loading ? (
                                    <span>Sending...</span>
                                ) : status === 'success' ? (
                                    <span>Message Sent Successfully!</span>
                                ) : (
                                    <>
                                        SendMessage <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            {status === 'error' && (
                                <p className="text-red-500 text-center text-sm">Something went wrong. Please try again.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div >
        </section >
    );
}
