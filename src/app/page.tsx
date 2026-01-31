import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Team from '@/components/Team';
import Reviews from '@/components/Reviews';
import BookingCalendar from '@/components/BookingCalendar';
import Contact from '@/components/Contact';
import Navbar from '@/components/Navbar';


export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Team />
      <Reviews />
      <BookingCalendar />
      <Contact />

    </main>
  );
}
