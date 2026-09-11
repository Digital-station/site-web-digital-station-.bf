import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export const ScrollIndicator = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const dotRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const sections = [
    { id: "hero", label: "Elite Performance" },
    { id: "services", label: "Core Services" },
    { id: "case-studies-peek", label: "Portfolio Peek" },
    { id: "cta", label: "Apply Now" }
  ];

  const isHome = location.pathname === "/";

  useEffect(() => {
    // Movement of the progress dot - Always run on any page
    const st = ScrollTrigger.create({
      start: 0,
      end: "bottom bottom",
      onUpdate: (self) => {
        if (dotRef.current) {
          const progress = self.progress;
          // Track is 104px total height
          const totalTrackHeight = 98; 
          gsap.to(dotRef.current, { 
            y: progress * totalTrackHeight,
            duration: 0.3,
            ease: "circ.out"
          });
        }
      }
    });

    // Tracking active sections - Only if on Home page
    let triggers: ScrollTrigger[] = [];
    if (isHome) {
      triggers = sections.map(({ id }) => {
        return ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActiveSection(id);
          }
        });
      });
    }

    return () => {
      st.kill();
      triggers.forEach(t => t.kill());
    };
  }, [location.pathname, isHome]);

  const scrollTo = (id: string) => {
    if (!isHome) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center hidden lg:flex md:right-10">
      {/* Visual Track (Matching Screenshot) */}
      <div className="relative flex flex-col items-center gap-2">
        {/* Top Dot */}
        <button 
          onClick={() => scrollTo("hero")}
          disabled={!isHome}
          className={`group relative w-1.5 h-1.5 bg-white/20 transition-all ${isHome ? 'hover:bg-white/40 cursor-pointer' : 'cursor-default'} outline-none`}
        >
          {isHome && (
            <div className="absolute right-10 px-3 py-1.5 bg-brand-primary border-l-2 border-brand-accent text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-2xl whitespace-nowrap pointer-events-none rounded-sm backdrop-blur-md">
              The Beginning
            </div>
          )}
        </button>

        {/* Second Dot */}
        <button 
          onClick={() => scrollTo("services")}
          disabled={!isHome}
          className={`group relative w-1.5 h-1.5 bg-white/20 transition-all ${isHome ? 'hover:bg-white/40 cursor-pointer' : 'cursor-default'} outline-none`}
        >
          {isHome && (
            <div className="absolute right-10 px-3 py-1.5 bg-brand-primary border-l-2 border-brand-accent text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-2xl whitespace-nowrap pointer-events-none rounded-sm backdrop-blur-md">
              Capabilities
            </div>
          )}
        </button>

        {/* The Vertical Line Segment */}
        <div className="w-1.5 h-12 bg-white/10" />

        {/* Third Dot */}
        <button 
          onClick={() => scrollTo("case-studies-peek")}
          disabled={!isHome}
          className={`group relative w-1.5 h-1.5 bg-white/20 transition-all ${isHome ? 'hover:bg-white/40 cursor-pointer' : 'cursor-default'} outline-none`}
        >
          {isHome && (
            <div className="absolute right-10 px-3 py-1.5 bg-brand-primary border-l-2 border-brand-accent text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-2xl whitespace-nowrap pointer-events-none rounded-sm backdrop-blur-md">
              Success Stories
            </div>
          )}
        </button>

        {/* Fourth Dot */}
        <button 
          onClick={() => scrollTo("cta")}
          disabled={!isHome}
          className={`group relative w-1.5 h-1.5 bg-white/20 transition-all ${isHome ? 'hover:bg-white/40 cursor-pointer' : 'cursor-default'} outline-none`}
        >
          {isHome && (
            <div className="absolute right-10 px-3 py-1.5 bg-brand-primary border-l-2 border-brand-accent text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-2xl whitespace-nowrap pointer-events-none rounded-sm backdrop-blur-md">
              Scale Now
            </div>
          )}
        </button>

        {/* THE MOVING GREEN INDICATOR DOT */}
        <div 
          ref={dotRef}
          className="absolute top-0 left-0 w-1.5 h-1.5 bg-brand-accent shadow-[0_0_15px_rgba(193,255,114,0.8)] z-10 pointer-events-none"
        />
      </div>
    </div>
  );
};
