'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "What services does Sidhi Vinayak Events offer?",
        answer: "We offer comprehensive event management and photography services in Jaipur, including Wedding Photography, Cinematography, Pre-wedding shoots, Destination Wedding Planning, Birthday Party planning, and Corporate Event management."
    },
    {
        question: "Do you provide destination wedding photography outside Jaipur?",
        answer: "Yes, while we are based in Jaipur, we provide premium destination wedding photography and event management services across Rajasthan and throughout India."
    },
    {
        question: "How far in advance should I book Sidhi Vinayak Events?",
        answer: "For major events like weddings, we recommend booking at least 3-6 months in advance to ensure availability, especially during the peak wedding season in Jaipur."
    },
    {
        question: "Do you offer customizable photography packages?",
        answer: "Absolutely! We understand every event is unique. We offer flexible and customizable packages for photography, cinematography, and event planning to suit your specific needs and budget."
    },
    {
        question: "What makes Sidhi Vinayak Events the best event planner in Jaipur?",
        answer: "Our commitment to quality, attention to detail, and over 5 years of experience in capturing emotions make us a top choice. we use state-of-the-art equipment and a creative approach to turn your moments into timeless memories."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section id="faq" className="py-24 bg-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-primary font-medium tracking-wider uppercase mb-2">Inquiry</h2>
                    <h3 className="text-4xl md:text-5xl font-bold font-heading">Common Questions</h3>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-4 border-b border-white/10">
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                aria-expanded={activeIndex === index}
                                aria-controls={`faq-answer-${index}`}
                                className="w-full py-6 flex justify-between items-center text-left hover:text-primary transition-colors focus:outline-none"
                            >
                                <span className="text-xl font-medium pr-8">{faq.question}</span>
                                {activeIndex === index ? (
                                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-gray-500 flex-shrink-0" />
                                )}
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        id={`faq-answer-${index}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-6 text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
