import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BeatCatalog from "@/components/BeatCatalog";
import DawSection from "@/components/DawSection";
import LicenseSection from "@/components/LicenseSection";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Dock from "@/components/Dock";
import { BEATS } from "@/data/beats";

export default function Page() {
  return (
    <>
      <Header />
      <main id="topo">
        <Hero />
        <BeatCatalog beats={BEATS} />
        <DawSection beats={BEATS} />
        <LicenseSection />
        <HowItWorks />
        <About />
        <Faq />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
      <Dock />
    </>
  );
}
