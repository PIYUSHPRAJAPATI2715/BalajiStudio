'use client';

import { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Phone, Sparkles, CheckCircle2 } from 'lucide-react';

type Booking = {
  date: string;
  location: string;
  programName: string;
  status?: 'upcoming' | 'completed';
};

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

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
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getBookingForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.find(b => b.date === dateStr && b.status !== 'completed');
  };

  const handleWhatsAppRedirect = (booking?: Booking) => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'dd MMMM yyyy');
    let message = '';
    if (booking) {
      message = `Hi Sidhi Vinayak Events, I saw that ${dateStr} is booked for ${booking.programName}. Do you have secondary slot availability nearby?`;
    } else {
      message = `Hi Sidhi Vinayak Events, I would like to book a slot for an event on ${dateStr}. Please share package details & availability!`;
    }
    window.open(`https://wa.me/917891766624?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden" id="booking">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Booking Schedule</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading mb-4 uppercase tracking-tight">
            Check Event <span className="text-gradient-gold">Availability</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light">
            Select any date to check availability or instantly reserve your date via WhatsApp.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-5xl mx-auto">
          
          {/* Calendar UI */}
          <div className="w-full lg:w-3/5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="p-3 rounded-full hover:bg-white/10 text-white transition-colors border border-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-gradient-gold">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="p-3 rounded-full hover:bg-white/10 text-white transition-colors border border-white/5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-3 text-center text-amber-400/80 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {days.map((day: Date) => {
                const booking = getBookingForDate(day);
                const isSelected = selectedDate ? isSameDay(selectedDate, day) : false;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    aria-label={`Select ${format(day, 'MMMM d, yyyy')}${booking ? ' - Booked' : ''}`}
                    className={`
                      relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 font-medium text-sm sm:text-base
                      ${isSelected
                        ? 'bg-amber-500 text-black font-bold scale-105 z-10 shadow-lg shadow-amber-500/30'
                        : booking
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-zinc-900/80 text-white hover:bg-white/10 border border-white/5 hover:border-amber-500/40'}
                    `}
                  >
                    <span className={isToday(day) && !isSelected ? 'text-amber-400 font-bold underline' : ''}>
                      {format(day, 'd')}
                    </span>
                    {booking && (
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-6 mt-8 text-xs sm:text-sm justify-center border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-800 border border-white/20 rounded-full" />
                <span className="text-gray-300 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-gray-300 font-medium">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-gray-300 font-medium">Selected</span>
              </div>
            </div>
          </div>

          {/* Selected Date Details Panel */}
          <div ref={detailsRef} className="w-full lg:w-2/5">
            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-panel-gold p-6 sm:p-8 rounded-3xl h-full flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Selected Date</span>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-white mt-1 mb-6">
                      {format(selectedDate, 'EEEE, d MMMM yyyy')}
                    </h3>

                    {getBookingForDate(selectedDate) ? (
                      <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl mb-6">
                        <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                          <span>Reserved Slot</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">
                          <strong className="text-white">Event:</strong> {getBookingForDate(selectedDate)?.programName}
                        </p>
                        <p className="text-gray-300 text-sm">
                          <strong className="text-white">Location:</strong> {getBookingForDate(selectedDate)?.location}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl mb-6">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Slot Fully Available!</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          This date is currently open for wedding photography, pre-wedding shoot, or event coverage.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleWhatsAppRedirect(getBookingForDate(selectedDate))}
                    className="w-full py-4 bg-gradient-gold text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all text-base mt-6"
                  >
                    <Phone className="w-5 h-5 fill-current" />
                    <span>Inquire / Book on WhatsApp</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-8 rounded-3xl h-full flex flex-col items-center justify-center text-center min-h-[320px]"
                >
                  <CalendarIcon className="w-14 h-14 text-amber-400/60 mb-4 animate-float" />
                  <h3 className="text-xl font-bold text-white font-heading mb-2">Select Any Date</h3>
                  <p className="text-gray-400 text-sm font-light">
                    Click any calendar date to check booking availability or request instant WhatsApp reservation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
