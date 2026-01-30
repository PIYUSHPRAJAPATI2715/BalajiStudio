'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

// Sample data - normally this would come from a CMS or API
const images = [
    '/assets/portfolio_new_1.png',
    '/assets/portfolio_new_2.png',
    '/assets/WhatsApp Image 2026-01-30 at 9.54.00 PM.jpeg',
    '/assets/WhatsApp Image 2026-01-30 at 9.54.06 PM.jpeg',
    '/assets/WhatsApp Image 2026-01-30 at 9.54.36 PM.jpeg',
    '/assets/WhatsApp Image 2026-01-30 at 9.54.37 PM.jpeg',
];

const videos = [
    '/assets/WhatsApp Video 2026-01-30 at 10.12.20 PM.mp4',
    '/assets/WhatsApp Video 2026-01-30 at 9.54.39 PM.mp4',
];

export default function Gallery() {
    const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

    return (
        <section id="portfolio" className="py-24 bg-black text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-primary font-medium tracking-wider uppercase mb-2">Portfolio</h2>
                    <h3 className="text-4xl md:text-5xl font-bold font-heading mb-8">Our Latest Work</h3>

                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`px-6 py-2 rounded-full transition-all ${activeTab === 'photos' ? 'bg-primary text-black font-semibold' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                }`}
                        >
                            Photography
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-6 py-2 rounded-full transition-all ${activeTab === 'videos' ? 'bg-primary text-black font-semibold' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                }`}
                        >
                            Cinematography
                        </button>
                    </div>
                </motion.div>

                {activeTab === 'photos' ? (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {images.map((src, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8 },
                                    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
                                }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="relative aspect-[3/4] group overflow-hidden rounded-lg cursor-pointer"
                            >
                                {/* Note: Using standard img for local files without known dimensions, or Next.js Image with fill if we disable optimization/configure it */}
                                <div className="w-full h-full bg-zinc-900">
                                    <img
                                        src={src}
                                        alt={`Portfolio item ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white border border-white px-6 py-2 rounded-full font-medium tracking-wide hover:bg-white hover:text-black transition-all transform hover:scale-105">View Full</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {videos.map((src, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="rounded-xl overflow-hidden bg-zinc-900"
                            >
                                <video
                                    controls
                                    className="w-full h-auto"
                                >
                                    <source src={src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="p-4">
                                    <h4 className="text-xl font-bold font-heading">Pre-Wedding Video</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
