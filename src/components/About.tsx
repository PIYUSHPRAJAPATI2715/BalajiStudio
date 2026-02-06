'use client';

import { motion } from 'framer-motion';
import { Camera, Heart, Award } from 'lucide-react';
import Image from 'next/image';

export default function About() {
    return (
        <section className="py-20 bg-black text-white" id="about">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Image/Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2 relative"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500">
                                <Image src="/assets/wedding_1.png" alt="Best Wedding Photography in Jaipur by Sidhi Vinayak Events" fill className="object-cover" />
                            </div>
                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500 mt-4">
                                <Image src="/assets/prewedding_1.png" alt="Creative Pre-Wedding Shoot Jaipur - Sidhi Vinayak Events" fill className="object-cover" />
                            </div>
                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500">
                                <Image src="/assets/c1.jfif" alt="Professional Cinematic Wedding Film Jaipur" fill className="object-cover" />
                            </div>

                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500">
                                <Image src="/assets/b1.jfif" alt="Traditional Bride Entry Photography Jaipur" fill className="object-cover" />
                            </div>
                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500 mt-4">
                                <Image src="/assets/v1.jfif" alt="Vermala Ceremony Photography Best Event Planner Jaipur" fill className="object-cover" />
                            </div>
                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500">
                                <Image src="/assets/s1.jfif" alt="Elegant Baby Shower Photography jaipur" fill className="object-cover" />
                            </div>

                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500">
                                <Image src="/assets/p1.jfif" alt="Vibrant Birthday Party Photography Jaipur" fill className="object-cover" />
                            </div>
                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500 mt-4">
                                <Image src="/assets/h1.jfif" alt="House Opening Event Management Jaipur" fill className="object-cover" />
                            </div>
                            <div className="relative h-24 w-full rounded-lg border border-white/5 overflow-hidden hover:scale-105 transition-transform duration-500">
                                <Image src="/assets/d1.jfif" alt="Modern Drone Coverage for Events Jaipur" fill className="object-cover" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
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

                        <div className="grid grid-cols-3 gap-2 md:gap-6">
                            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                                <Camera className="w-8 h-8 text-primary" />
                                <span className="font-bold text-xl">5+ Years</span>
                                <span className="text-sm text-gray-500">Experience</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                                <Heart className="w-8 h-8 text-primary" />
                                <span className="font-bold text-xl">200+</span>
                                <span className="text-sm text-gray-500">Happy Couples</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
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
