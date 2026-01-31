'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Maximize2 } from 'lucide-react';
import { useState } from 'react';

type ServiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    service: {
        name: string;
        description: string;
        images?: string[]; // Optional array of image URLs
    } | null;
};

// Dummy images map if not provided in service object
const dummyImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop"
];

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!isOpen || !service) return null;

    const images = service.images || dummyImages;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 z-[60] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-zinc-900 border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl pointer-events-auto relative shadow-2xl shadow-primary/10">

                            {/* Header */}
                            <div className="sticky top-0 bg-zinc-900/95 backdrop-blur z-10 p-6 md:p-8 border-b border-white/5 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl md:text-4xl font-bold font-heading text-white mb-2">{service.name}</h2>
                                    <p className="text-gray-400">{service.description}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-300" />
                                </button>
                            </div>

                            {/* Gallery Grid */}
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {images.map((img, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="aspect-square rounded-xl overflow-hidden group relative cursor-zoom-in"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img
                                            src={img}
                                            alt={`${service.name} ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Maximize2 className="w-8 h-8 text-white" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="p-6 md:p-8 border-t border-white/5 bg-zinc-900/50 text-center">
                                <p className="text-gray-400 mb-4">Want a photoshoot like this?</p>
                                <a
                                    href="https://wa.me/917891766624?text=Hi, I love your work in ${service.title}. I want to book a session."
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors"
                                >
                                    Book This Service
                                </a>
                            </div>


                        </div>
                    </motion.div>

                    {/* Lightbox Overlay */}
                    <AnimatePresence>
                        {selectedImage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                                onClick={() => setSelectedImage(null)}
                            >
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                                <img
                                    src={selectedImage}
                                    alt="Full View"
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
