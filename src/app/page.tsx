import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Gallery from '@/components/Gallery';
import Team from '@/components/Team';
import Reviews from '@/components/Reviews';
import BookingCalendar from '@/components/BookingCalendar';
import Contact from '@/components/Contact';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import JsonLd from '@/components/JsonLd';


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
      <Contact />
      <WhatsAppButton />
    </main>
  );
}
