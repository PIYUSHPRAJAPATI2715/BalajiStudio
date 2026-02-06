import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import About from '@/components/About';
import dynamic from 'next/dynamic';

const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: true });
const Team = dynamic(() => import('@/components/Team'), { ssr: true });
const Reviews = dynamic(() => import('@/components/Reviews'), { ssr: true });
const BookingCalendar = dynamic(() => import('@/components/BookingCalendar'), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: true });
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });
const JsonLd = dynamic(() => import('@/components/JsonLd'), { ssr: true });


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
