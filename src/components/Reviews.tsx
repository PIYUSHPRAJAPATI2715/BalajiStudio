'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Plus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

type Review = {
    id: string;
    name: string;
    event: string;
    rating: number;
    text: string;
    image: string;
    createdAt: string;
};

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        event: '',
        rating: 5,
        text: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([...reviews, newReview]);
                setIsFormOpen(false);
                setFormData({ name: '', event: '', rating: 5, text: '' });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

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
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        See what our happy clients have to say about their experience with Sidhi Vinayak events.
                    </p>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Write a Review
                    </button>
                </motion.div>

                {/* Review Form Modal */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                            onClick={() => setIsFormOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md relative"
                            >
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <h3 className="text-2xl font-bold mb-6 text-primary font-heading">Share Your Experience</h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="review-name" className="block text-sm text-gray-400 mb-2">Your Name</label>
                                        <input
                                            id="review-name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="event-type" className="block text-sm text-gray-400 mb-2">Event Type</label>
                                        <input
                                            id="event-type"
                                            type="text"
                                            value={formData.event}
                                            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                                            placeholder="e.g. Wedding, Birthday"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <span className="block text-sm text-gray-400 mb-2">Rating</span>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    aria-label={`Rate ${star} stars`}
                                                    className={`transition-colors ${star <= formData.rating ? 'text-yellow-500' : 'text-zinc-700'}`}
                                                >
                                                    <Star className="w-8 h-8 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="review-text" className="block text-sm text-gray-400 mb-2">Review</label>
                                        <textarea
                                            id="review-text"
                                            value={formData.text}
                                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-24 resize-none"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : 'Submit Review'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="hidden md:block relative overflow-hidden w-full">
                        {/* Gradient Masks */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-zinc-900 to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-zinc-900 to-transparent pointer-events-none"></div>

                        <motion.div
                            className="flex gap-8 w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: Math.max(20, reviews.length * 5) // Dynamic speed
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                        >
                            {/* Duplicate reviews for seamless loop */}
                            {[...reviews, ...reviews].map((review, index) => (
                                <div
                                    key={`${review.id}-${index}`}
                                    className="w-[350px] md:w-[450px] flex-shrink-0 bg-zinc-800/50 p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
                                >
                                    <div className="flex items-center gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="mb-6 relative flex-grow">
                                        <Quote className="w-10 h-10 text-primary/20 absolute -top-2 -left-2" />
                                        <p className="text-gray-300 relative z-10 pl-6 italic line-clamp-4">
                                            "{review.text}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-zinc-700 flex-shrink-0 relative">
                                            {review.image ? (
                                                <Image src={review.image} alt={review.name} fill unoptimized sizes="48px" className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                                                    {review.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white truncate w-40">{review.name}</h4>
                                            <p className="text-primary text-sm truncate w-40">{review.event}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                )}

                {/* Mobile View: Vertical List */}
                {!loading && (
                    <div className="md:hidden flex flex-col gap-4 mt-8">
                        {reviews.slice(0, 3).map((review) => (
                            <div
                                key={review.id}
                                className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                                        />
                                    ))}
                                </div>

                                <div className="mb-4 relative flex-grow">
                                    <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                                    <p className="text-gray-300 relative z-10 pl-6 italic line-clamp-3 text-sm">
                                        "{review.text}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-zinc-700 flex-shrink-0 relative">
                                        {review.image ? (
                                            <Image src={review.image} alt={review.name} fill unoptimized sizes="40px" className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                                                {review.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm truncate w-32">{review.name}</h4>
                                        <p className="text-primary text-xs truncate w-32">{review.event}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {reviews.length > 3 && (
                            <button
                                onClick={() => setShowAllReviews(true)}
                                className="w-full bg-zinc-800 text-white py-3 rounded-xl border border-white/10 font-bold hover:bg-zinc-700 transition-colors"
                            >
                                View All Reviews
                            </button>
                        )}
                    </div>
                )}

                {/* View All Reviews Modal */}
                <AnimatePresence>
                    {showAllReviews && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6 sticky top-0 bg-black/90 py-4 z-10 border-b border-white/10">
                                <h3 className="text-2xl font-bold text-primary font-heading">All Reviews</h3>
                                <button
                                    onClick={() => setShowAllReviews(false)}
                                    className="text-gray-400 hover:text-white bg-zinc-800 p-2 rounded-full"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 pb-20">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-zinc-900 border border-white/10 p-6 rounded-xl"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-zinc-800 flex-shrink-0 relative">
                                                    {review.image ? (
                                                        <Image src={review.image} alt={review.name} fill unoptimized sizes="40px" className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                                                            {review.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{review.name}</h4>
                                                    <p className="text-xs text-primary">{review.event}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            "{review.text}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
