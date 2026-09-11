import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { HelmetProvider } from "react-helmet-async";
import Lenis from "lenis";
import { LeftRail } from "./components/layout/LeftRail";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { CaseStudies } from "./pages/CaseStudies";
import { Services } from "./pages/Services";
import { ServicePage } from "./pages/ServicePage";
import { NotFound } from "./pages/NotFound";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { CustomCursor } from "./components/ui/CustomCursor";
import { ScrollIndicator } from "./components/ui/ScrollIndicator";
import { StickyCTA } from "./components/ui/StickyCTA";
import { LeadMagnet } from "./components/ui/LeadMagnet";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <CustomCursor />
        <StickyCTA />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-20 focus:z-[100] focus:bg-brand-accent focus:text-brand-primary focus:px-6 focus:py-3 focus:rounded-full focus:font-black focus:uppercase focus:text-xs"
        >
          Skip to content
        </a>
        <div className="min-h-screen relative bg-brand-primary">
          <LeftRail />
          <Navbar />
          <ScrollIndicator />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}
