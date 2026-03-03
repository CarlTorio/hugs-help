import { useState, useCallback, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import ParallaxQuote from "@/components/ParallaxQuote";
import MenuSection from "@/components/MenuSection";
import EventsSection from "@/components/EventsSection";

import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="noise-overlay">
      {!loaded && <LoadingScreen onComplete={handleComplete} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <Navbar />
        <HeroSection loaded={loaded} />
        <AboutSection />
        <GallerySection />
        <ParallaxQuote />
        <MenuSection />
        <EventsSection />
        
        <LocationSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
