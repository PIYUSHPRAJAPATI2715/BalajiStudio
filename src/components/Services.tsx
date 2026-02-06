'use client';

import { motion } from 'framer-motion';
import { Camera, Video, Heart, Home, Gift, Baby, Star, Zap, Aperture } from 'lucide-react';
import Image from 'next/image';

const services = [
    {
        name: 'Full Wedding Shoots',
        icon: Heart,
        description: 'Complete coverage of your big day, capturing every emotion.',
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
        description: 'Romantic and artistic shoots before the wedding bells ring.',
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
        description: 'Movie-like quality for your most precious memories.',
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
        description: 'Special focus on the grand entry of the bride.',
        image: '/assets/b1.jfif',
        images: ['/assets/b1.jfif', '/assets/b2.jfif', '/assets/b3.jfif', '/assets/b4.jfif', '/assets/b5.jfif', '/assets/b6.jfif']
    },
    {
        name: 'Vermala',
        icon: Heart,
        description: 'Capturing the beautiful moment of garland exchange.',
        image: '/assets/v1.jfif',
        images: ['/assets/v1.jfif', '/assets/v2.jfif', '/assets/v3.jfif', '/assets/v4.jfif', '/assets/v5.jfif', '/assets/v6.jfif']
    },
    {
        name: 'Baby Shower Shoots',
        icon: Baby,
        description: 'Celebrating the journey of motherhood with elegance.',
        image: '/assets/s1.jfif',
        images: ['/assets/s1.jfif', '/assets/s2.jfif', '/assets/s3.jfif', '/assets/s4.jfif', '/assets/s5.jfif', '/assets/s6.jfif']
    },
    {
        name: 'Birthday Parties',
        icon: Gift,
        description: 'Fun and vibrant photography for birthday celebrations.',
        image: '/assets/p1.jfif',
        images: ['/assets/p1.jfif', '/assets/p2.jfif', '/assets/p3.jfif', '/assets/p4.jfif', '/assets/p5.jfif', '/assets/p6.jfif']
    },
    {
        name: 'House Opening Shoots',
        icon: Home,
        description: 'Documenting the joy of your new beginning (Griha Pravesh).',
        image: '/assets/h1.jfif',
        images: ['/assets/h1.jfif', '/assets/h2.jfif', '/assets/h3.jfif', '/assets/h4.jfif', '/assets/h5.jfif', '/assets/h6.jfif']
    },
    {
        name: 'Drone Coverage',
        icon: Zap,
        description: 'Spectacular aerial views of your venue and events.',
        image: '/assets/d1.jfif',
        images: ['/assets/d1.jfif', '/assets/d2.jfif', '/assets/d3.jfif', '/assets/d4.jfif', '/assets/d5.jfif', '/assets/d6.jfif']
    },
];

import { useState } from 'react';
import ServiceModal from './ServiceModal';

export default function Services() {
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleServiceClick = (service: any) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };
    return (
        <section id="services" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-primary font-medium tracking-wider uppercase mb-2">Our Expertise</h2>
                    <h3 className="text-4xl md:text-5xl font-bold font-heading">Services We Provide</h3>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            whileHover={{ y: -10 }}
                            onClick={() => handleServiceClick(service)}
                            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xl"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={service.image}
                                    alt={`${service.name} in Jaipur - Best Event Management by Sidhi Vinayak Events`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Bottom Gradient for Text Readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="mb-4 inline-flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 backdrop-blur-md rounded-lg text-primary">
                                        <service.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-2xl font-bold font-heading text-white">
                                        {service.name}
                                    </h4>
                                </div>
                                <p className="text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={selectedService}
            />
        </section>
    );
}
