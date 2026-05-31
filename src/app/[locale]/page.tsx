import HeroSection from "@/components/sections/HeroSection";
import ScrollQuotes from "@/components/sections/ScrollQuotes";
import PhilosophySection from "@/components/sections/PhilosophySection";
import PersonalizationSection from "@/components/sections/PersonalizationSection";
import CommunicationSection from "@/components/sections/CommunicationSection";
import PumaStory from "@/components/sections/PumaStory";
import DifferenceSection from "@/components/sections/DifferenceSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CtaSection from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ScrollQuotes />
      <PhilosophySection />
      <PersonalizationSection />
      <CommunicationSection />
      <PumaStory />
      <DifferenceSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
