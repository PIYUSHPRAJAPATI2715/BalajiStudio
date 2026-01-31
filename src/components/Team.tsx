'use client';

import { motion } from 'framer-motion';
import { Phone, User } from 'lucide-react';

const team = [
    {
        name: 'Vishnu Prajapati',
        role: 'Event Manager',
        phone: '+91 78917 66624',
        // Using renamed files as per user request
        image: '/assets/vishnu.jpg',
    },
    {
        name: 'Manoj Prajapati',
        role: 'Finance Manager',
        phone: '+91 97821 30139',
        image: '/assets/mannu.jpg',
    },
    {
        name: 'Piyush Prajapati',
        role: 'Production Manager',
        phone: '+91 95493 48495',
        image: '/assets/piyush.jpg',
    },
];

export default function Team() {
    return (
        <section id="team" className="py-24 bg-zinc-950 text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-primary font-medium tracking-wider uppercase mb-2">The Team</h2>
                    <h3 className="text-4xl md:text-5xl font-bold font-heading">Meet the Creatives</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all group"
                        >
                            <div className="h-72 overflow-hidden relative">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4">
                                    <h4 className="text-xl font-bold text-white font-heading">{member.name}</h4>
                                    <p className="text-primary text-sm">{member.role}</p>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <a href={`tel:${member.phone.replace(/ /g, '')}`} className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors text-sm">
                                    <Phone className="w-5 h-5" />
                                    <span>{member.phone}</span>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
