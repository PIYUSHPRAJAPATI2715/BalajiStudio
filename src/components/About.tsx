'use client';

import { motion } from 'framer-motion';
import { Camera, Heart, Award } from 'lucide-react';

export default function About() {
    return (
        <section className="py-20 bg-black text-white" id="about">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Image/Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=800&auto=format&fit=crop"
                                alt="Wedding Photography"
                                className="rounded-2xl border border-white/5 hover:scale-105 transition-transform duration-500"
                            />
                            <div className="space-y-4 pt-8">
                                <img
                                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
                                    alt="Event Decoration"
                                    className="rounded-2xl border border-white/5 hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <h2 className="text-primary font-medium tracking-wider uppercase mb-2">About Us</h2>
                        <h3 className="text-4xl md:text-5xl font-bold font-heading mb-6">Turning Moments into Memories</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            At Sidhi Vinayak events, we don't just organize events; we craft experiences. With years of expertise in wedding photography, cinematography, and event management, we bring your vision to life with precision and passion.
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            From the subtle glances to the grand celebrations, our team is dedicated to capturing every emotion and detail. We believe in storytelling through our lens and creating an ambiance that leaves a lasting impression.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <Camera className="w-8 h-8 text-primary" />
                                <span className="font-bold text-xl">5+ Years</span>
                                <span className="text-sm text-gray-500">Experience</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Heart className="w-8 h-8 text-primary" />
                                <span className="font-bold text-xl">200+</span>
                                <span className="text-sm text-gray-500">Happy Couples</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Award className="w-8 h-8 text-primary" />
                                <span className="font-bold text-xl">100%</span>
                                <span className="text-sm text-gray-500">Commitment</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
