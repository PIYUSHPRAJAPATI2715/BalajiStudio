'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "Rahul & Priya",
        event: "Wedding",
        rating: 5,
        text: "Sidhi Vinayak events made our wedding absolutely magical. The decoration, the flow of events, everything was perfect. Highly recommended!",
        image: "https://images.unsplash.com/photo-1663185566085-f5b248a8c430?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Amit Sharma",
        event: "Corporate Event",
        rating: 5,
        text: "Professionalism at its best. They handled our corporate gala with such ease. The team is very cooperative and creative.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Sneha Gupta",
        event: "Birthday Party",
        rating: 4,
        text: "Great management! The theme was exactly what we wanted for our daughter's birthday. Thank you for making it special.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
    }
];

export default function Reviews() {
    return (
        <section className="py-12 md:py-20 bg-zinc-900 text-white" id="reviews">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-primary">Client Love</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        See what our happy clients have to say about their experience with Sidhi Vinayak events.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-zinc-800/50 p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                                    />
                                ))}
                            </div>

                            <div className="mb-6 relative">
                                <Quote className="w-10 h-10 text-primary/20 absolute -top-2 -left-2" />
                                <p className="text-gray-300 relative z-10 pl-6 italic">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                    <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{review.name}</h4>
                                    <p className="text-primary text-sm">{review.event}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
