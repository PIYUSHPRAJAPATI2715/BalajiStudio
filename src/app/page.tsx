import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

const Services = dynamic(() => import('@/components/Services'));
const About = dynamic(() => import('@/components/About'));
const Gallery = dynamic(() => import('@/components/Gallery'));
const Team = dynamic(() => import('@/components/Team'));
const Reviews = dynamic(() => import('@/components/Reviews'));
const BookingCalendar = dynamic(() => import('@/components/BookingCalendar'));
const FAQ = dynamic(() => import('@/components/FAQ'));
const Contact = dynamic(() => import('@/components/Contact'));
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'));
const JsonLd = dynamic(() => import('@/components/JsonLd'));


export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black overflow-x-hidden">
      <JsonLd />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Team />
      <Reviews />
      <BookingCalendar />
      <FAQ />
      <Contact />
      <WhatsAppButton />
    </main>
  );
}
