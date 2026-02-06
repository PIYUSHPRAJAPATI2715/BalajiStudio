'use client';

import { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Phone } from 'lucide-react';

type Booking = {
    date: string; // ISO string or 'YYYY-MM-DD'
    location: string;
    programName: string;
    status?: 'upcoming' | 'completed';
};

export default function BookingCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    // Scroll to details on date select (Mobile UX)
    useEffect(() => {
        if (selectedDate && window.innerWidth < 1024 && detailsRef.current) {
            setTimeout(() => {
                detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }, [selectedDate]);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                console.log("Fetched bookings:", data);
                setBookings(data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    // Check if a date is booked (and not completed)
    const getBookingForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return bookings.find(b => b.date === dateStr && b.status !== 'completed');
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const handleWhatsAppRedirect = (booking?: Booking) => {
        if (!selectedDate) return;

        const dateStr = format(selectedDate, 'dd MMMM yyyy');
        let message = '';

        if (booking) {
            // Admin booked logic handled? No, usually clients click.
            // If booked, maybe they want to inquire about other time?
            message = `Hi, I saw that ${dateStr} is booked for ${booking.programName}. Is there any availability nearby?`;
        } else {
            message = `Hi, I want to book a slot for an event on ${dateStr}. Please let me know the details.`;
        }

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/917891766624?text=${encodedMessage}`, '_blank');
    };

    return (
        <section className="py-12 md:py-20 bg-black text-white" id="booking">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-primary">Check Availability</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Check our calendar for available dates. Green slots are free, Red slots are booked!
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
                    {/* Calendar UI */}
                    <div className="w-full lg:w-1/2 bg-zinc-900/50 p-4 md:p-6 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-center mb-8">
                            <button onClick={prevMonth} aria-label="Previous month" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ChevronLeft />
                            </button>
                            <h3 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h3>
                            <button onClick={nextMonth} aria-label="Next month" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ChevronRight />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-500 text-sm font-medium">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {/* Padding for start of month - simplified for now, ensuring correct day alignment requires getting day index */}
                            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {days.map((day: Date) => {
                                const booking = getBookingForDate(day);
                                const isSelected = selectedDate ? isSameDay(selectedDate, day) : false;

                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => handleDateClick(day)}
                                        aria-label={`Select ${format(day, 'MMMM d, yyyy')}${booking ? ' - Booked' : ''}`}
                                        className={`
                                            relative h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-300
                                            ${isSelected
                                                ? 'ring-2 ring-primary bg-primary/20 scale-105 z-10 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                                                : ''}
                                            ${booking
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                                : isSelected ? '' : 'bg-zinc-800/50 text-white hover:bg-zinc-700/80 border border-white/5 hover:border-primary/30'}
                                        `}
                                    >
                                        <span className={`text-sm ${isToday(day) ? 'font-bold text-primary' : ''}`}>
                                            {format(day, 'd')}
                                        </span>
                                        {booking && (
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 animate-pulse"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-4 mt-6 text-sm justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-zinc-800 border border-white/5 rounded-full"></div>
                                <span className="text-gray-400">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded-full"></div>
                                <span className="text-gray-400">Booked</span>
                            </div>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div ref={detailsRef} className="w-full lg:w-1/3 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {selectedDate ? (
                                <motion.div
                                    key="selected"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-zinc-900 border border-white/10 rounded-2xl p-8 h-full flex flex-col"
                                >
                                    <h3 className="text-2xl font-bold mb-2 text-primary">{format(selectedDate, 'EEEE, d MMMM')}</h3>

                                    {getBookingForDate(selectedDate) ? (
                                        <div className="mt-8 flex-grow">
                                            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl mb-6">
                                                <h4 className="text-red-400 font-bold text-lg mb-2">Booked</h4>
                                                <p className="text-gray-300 mb-1">
                                                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Event</span>
                                                    {getBookingForDate(selectedDate)?.programName}
                                                </p>
                                                <p className="text-gray-300">
                                                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Location</span>
                                                    {getBookingForDate(selectedDate)?.location}
                                                </p>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-6">
                                                This slot is already taken. However, you can still contact us to check for potential adjustments or other services.
                                            </p>
                                            <button
                                                onClick={() => handleWhatsAppRedirect(getBookingForDate(selectedDate))}
                                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-semibold"
                                            >
                                                <Phone className="w-5 h-5" />
                                                Enquire Anyway
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-8 flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl mb-6">
                                                    <h4 className="text-green-400 font-bold text-lg mb-2">Available</h4>
                                                    <p className="text-gray-300">
                                                        This date is currently available for booking!
                                                    </p>
                                                </div>
                                                <p className="text-gray-400">
                                                    Click the button below to message us on WhatsApp with your booking details for this date.
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleWhatsAppRedirect()}
                                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-bold mt-8 shadow-lg shadow-green-900/20 animate-pulse"
                                            >
                                                <Phone className="w-5 h-5" />
                                                Book on WhatsApp
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl bg-zinc-900/30"
                                >
                                    <CalendarIcon className="w-16 h-16 text-zinc-700 mb-4" />
                                    <h3 className="text-xl font-bold text-zinc-500">Select a Date</h3>
                                    <p className="text-zinc-600">Click on any date in the calendar to check status or make a booking.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
