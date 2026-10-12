import { useScrollReveal } from "./hooks/useScrollReveal";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Countdown from "./sections/Countdown";
import {
  About,
  Competitions,
  Information,
  Registration,
  Schedule,
} from "./sections/EventSections";
import FAQ from "./sections/FAQ";
import Footer from "./sections/Footer";
export default function App() {
  useScrollReveal();
  return (
    <>
      <SplashScreen />
      <a className="skip-link" href="#main">
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Countdown />
        <About />
        <Competitions />
        <Schedule />
        <Information />
        <Registration />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
