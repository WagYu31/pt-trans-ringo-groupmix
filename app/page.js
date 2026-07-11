import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import VisionMission from './components/VisionMission';
import Services from './components/Services';
import Team from './components/Team';
import Legality from './components/Legality';
import Brochures from './components/Brochures';
import Clients from './components/Clients';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import WhatsAppWidget from './components/WhatsAppWidget';

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Navbar />
      <main>
        <Hero />
        <About />
        <VisionMission />
        <Services />
        <Team />
        <Legality />
        <Brochures />
        <Clients />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
