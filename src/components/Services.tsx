'use client';

import { motion } from 'framer-motion';
import { Camera, Video, Heart, Home, Gift, Baby, Star, Zap, Aperture } from 'lucide-react';

const services = [
    {
        name: 'Full Wedding Shoots',
        icon: Heart,
        description: 'Complete coverage of your big day, capturing every emotion.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS62SPEPEZzG2G2lRlKBS1rFG5aTJAL8VX8JA&s'
    },
    {
        name: 'Pre-Wedding Shoots',
        icon: Camera,
        description: 'Romantic and artistic shoots before the wedding bells ring.',
        image: 'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Cinematic Photography',
        icon: Video,
        description: 'Movie-like quality for your most precious memories.',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Bride Entry',
        icon: Star,
        description: 'Special focus on the grand entry of the bride.',
        image: 'https://img.weddingbazaar.com/photos/pictures/000/497/533/new_medium/Copy_of_RSWedding79.jpg?1535095586'
    },
    {
        name: 'Vermala',
        icon: Heart,
        description: 'Capturing the beautiful moment of garland exchange.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Maternity Shoots',
        icon: Baby,
        description: 'Celebrating the journey of motherhood with elegance.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHnAQkSn52B0AZ-iRiNtXeklc1PTd3iH5OMw&s'
    },
    {
        name: 'Birthday Parties',
        icon: Gift,
        description: 'Fun and vibrant photography for birthday celebrations.',
        image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'House Opening Shoots',
        icon: Home,
        description: 'Documenting the joy of your new beginning (Griha Pravesh).',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Product Shoots',
        icon: Zap,
        description: 'Professional photography to showcase your products.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Drone Cinematography',
        icon: Aperture,
        description: 'Stunning aerial views and 4K drone shots for your events.',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop'
    },
];

export default function Services() {
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
                    viewport={{ once: true, margin: "-100px" }}
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
                            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xl"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
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
        </section>
    );
}
