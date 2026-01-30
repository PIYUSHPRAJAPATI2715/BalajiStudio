import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Team from '@/components/Team';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Team />
      <Footer />
    </main>
  );
}
