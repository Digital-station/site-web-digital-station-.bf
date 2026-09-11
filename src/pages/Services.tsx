import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  Target, 
  BarChart3, 
  Cpu, 
  ShieldCheck, 
  Activity,
  Plus,
  MapPin,
  Search,
  PenTool,
  Share2,
  Database,
  Palette,
  MessageCircle,
  TrendingUp,
  BrainCircuit,
  Filter
} from "lucide-react";
import { SERVICES } from "../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getServiceIcon = (slug: string) => {
  switch (slug) {
    case "gbp-optimization": return MapPin;
    case "seo-strategy": return Search;
    case "content-marketing": return PenTool;
    case "social-media": return Share2;
    case "ppc-advertising": return TrendingUp;
    case "ai-receptionist": return MessageCircle;
    case "crm-integrations": return Database;
    case "global-branding": return Palette;
    case "marketing-funnel": return Filter;
    default: return Zap;
  }
};

export const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal title text
      gsap.fromTo(".reveal-text", 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "all"
        }
      );

      // Background parallax
      gsap.to(".bg-orb", {
        x: (i) => (i === 0 ? 100 : -100),
        y: (i) => (i === 0 ? 50 : -50),
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true
        }
      });

      // Service cards staggered reveal
      gsap.fromTo(".service-card", 
        { 
          y: 40, 
          opacity: 0, 
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        }
      );

      // Knowledge sections
      gsap.fromTo(".knowledge-item",
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".knowledge-grid",
            start: "top 95%",
            toggleActions: "play none none none"
          }
        }
      );
    }, containerRef);

    // Force a refresh after a small delay to handle any late layout shifts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  const philosophy = [
    {
      title: "Data-First Logic",
      desc: "Every creative decision is backed by cold, hard performance data. No guesswork, just growth.",
      icon: BarChart3
    },
    {
      title: "Semantic Dominance",
      desc: "We don't just target keywords; we target search intent and user psychology at every level.",
      icon: Target
    },
    {
      title: "Technical Superiority",
      desc: "Our code and infrastructure are built for speed. If a site takes 3 seconds to load, it's too slow.",
      icon: Cpu
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-primary pt-24 md:pt-44 pb-40 lg:pl-16 relative overflow-hidden">
      <Helmet>
        <title>Our Services | Digital Marketing Infrastructure</title>
        <meta name="description" content="Explore our suite of technical marketing services: SEO, GMB Optimization, AI Receptionists, and more. Built for 2026 performance levels." />
        <link rel="canonical" href="https://bestprodigital.com/services" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Digital Marketing Services Matrix",
              "description": "Premium technical marketing services including GBP Optimization, SEO Strategy, and AI integrations.",
              "itemListElement": [
                ${SERVICES.map((s, i) => `{
                  "@type": "ListItem",
                  "position": ${i + 1},
                  "name": "${s.title}",
                  "url": "https://bestprodigital.com/services/${s.slug}"
                }`).join(',')}
              ]
            }
          `}
        </script>
      </Helmet>
      
      {/* Dynamic Background Elements */}
      <div className="bg-orb absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="bg-orb absolute bottom-0 left-[-10%] w-[50vw] h-[50vw] bg-white/2 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <header className="mb-20 md:mb-24 lg:mb-32">
          <div className="flex items-center gap-3 text-brand-accent mb-8 overflow-hidden">
            <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex items-center gap-2"
            >
               <Sparkles className="w-5 h-5 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">The Growth Protocol</span>
            </motion.div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter text-white">
              <span className="reveal-text block">Architecting</span>
              <span className="reveal-text block italic font-serif font-light text-brand-accent lowercase leading-tight">Digital</span>
              <span className="reveal-text block">Monoliths.</span>
            </h1>
          </div>
          
          <div className="mt-10 md:mt-16 flex flex-col lg:flex-row gap-10 md:gap-12 items-start lg:items-end">
            <p className="text-base md:text-xl lg:text-2xl text-neutral-400 max-w-2xl font-light leading-relaxed reveal-text">
              We build custom CRM systems, ERP platforms, business websites, and e-commerce solutions to help companies grow and operate efficiently </p>
            <div className="hidden lg:block h-px flex-grow bg-white/10 mb-6" />
            <div className="flex gap-8 md:gap-10">
               <div className="reveal-text">
                  <div className="text-3xl md:text-4xl font-black text-white">$14M+</div>
                  <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mt-1">Managed Spend</div>
               </div>
               <div className="reveal-text">
                  <div className="text-3xl md:text-4xl font-black text-white">4.8x</div>
                  <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mt-1">Ad Growth</div>
               </div>
            </div>
          </div>
        </header>

        {/* Tactical Philosophy Grid */}
        <section className="mb-24 md:mb-32 lg:mb-48 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
           {philosophy.map((item, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white/5 transition-all lg:aspect-square flex flex-col justify-center group"
             >
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-brand-accent mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500" />
                <h4 className="text-xl md:text-2xl font-black text-white uppercase mb-4 tracking-tighter">{item.title}</h4>
                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-light">{item.desc}</p>
             </motion.div>
           ))}
        </section>

        {/* Main Service Matrix */}
        <div className="mb-12 md:mb-16 lg:mb-24 flex items-center justify-between overflow-hidden">
           <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">Service <span className="text-brand-accent italic font-serif lowercase">Infrastructure</span></h2>
           <div className="hidden md:flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-widest">
              <span>Scroll to explore</span>
              <div className="w-16 h-px bg-white/20" />
           </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service) => {
            const Icon = getServiceIcon(service.slug);
            return (
              <Link 
                key={service.slug}
                to={`/services/${service.slug}`}
                className="service-card group relative h-[420px] md:h-[480px] lg:h-[520px] rounded-[2rem] md:rounded-[3rem] lg:rounded-[3.5rem] overflow-hidden bg-brand-surface border border-white/5 p-8 md:p-10 lg:p-12 transition-all hover:scale-[1.02] hover:border-brand-accent/50"
              >
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-8 md:mb-10 lg:mb-12">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-primary transition-all duration-700">
                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <span className="text-4xl md:text-6xl font-black text-white/5 font-mono tracking-tighter">
                        {service.num}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white leading-[0.8] mb-4 md:mb-6 lg:mb-8">
                      {service.title.split(' ').map((word, wi) => (
                         <span key={wi} className={wi === 1 ? "text-neutral-500 block mb-1 md:mb-2" : "block mb-1 md:mb-2"}>{word}</span>
                      ))}
                    </h3>
                    <p className="text-neutral-500 text-[11px] md:text-xs lg:text-sm leading-relaxed group-hover:text-white/60 transition-colors max-w-[95%] font-light">
                      {service.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {service.benefits.slice(0, 3).map((benefit) => (
                      <span key={benefit} className="text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 md:px-4 md:py-1.5 bg-white/5 text-white/20 rounded-full group-hover:border-brand-accent/30 border border-transparent transition-all">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Decorations */}
                <div className="absolute top-0 right-0 p-6 lg:p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                   <div className="w-8 h-8 md:w-12 md:h-12 bg-brand-accent rounded-full flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-700">
                      <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 text-brand-primary" />
                   </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </Link>
            );
          })}
        </div>


        {/* New Knowledge Base Section */}
        <section className="mt-32 md:mt-40 border-t border-white/5 pt-24 md:pt-32">
           <header className="mb-16 md:mb-24">
              <div className="flex items-center gap-3 text-brand-accent mb-6">
                 <BrainCircuit className="w-6 h-6" />
                 <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">The Knowledge Base</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-[0.9]">
                Demystifying the <br/> <span className="italic font-serif font-light lowercase text-brand-accent">Machine.</span>
              </h2>
              <p className="max-w-2xl text-neutral-400 text-base md:text-lg font-light leading-relaxed">
                Understanding digital marketing is about understanding human psychology at scale. Here is the foundational logic behind each of our core pillars.
              </p>
           </header>

           <div className="knowledge-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-y-16 md:gap-y-24 gap-x-8 md:gap-x-12">
              {SERVICES.map((s) => {
                 const Icon = getServiceIcon(s.slug);
                 return (
                    <div key={s.slug} className="knowledge-item border-l border-white/10 pl-6 md:pl-8 group">
                       <div className="flex items-center gap-4 mb-6">
                          <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-accent" />
                          <h4 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">{s.title}</h4>
                       </div>
                       <p className="text-neutral-500 text-xs md:text-[13px] leading-relaxed mb-6 group-hover:text-neutral-300 transition-colors font-light">
                          {s.longDesc}
                       </p>
                       <ul className="space-y-3">
                          {s.benefits.map((b, bi) => (
                             <li key={bi} className="flex items-center gap-3">
                                <Plus className="w-3 h-3 text-brand-accent opacity-40" />
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-wider font-mono">{b}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 );
              })}
           </div>
        </section>

        {/* Global Strategy Section */}
        <section className="mt-32 md:mt-40 lg:mt-60 bg-white/5 border border-white/5 rounded-[2.5rem] md:rounded-[4.5rem] p-8 md:p-16 lg:p-24 relative overflow-hidden group">
           <div className="relative z-10 grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
              <div>
                 <div className="flex items-center gap-3 text-brand-accent mb-8 md:mb-10">
                    <Activity className="w-6 h-6" />
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">Engine Performance</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-8 md:mb-12 leading-[0.85]">
                    Built for <br/> <span className="text-brand-accent italic font-serif lowercase">Global Scale.</span>
                 </h2>
                 <p className="text-neutral-400 text-lg md:text-xl leading-relaxed mb-10 md:mb-16 max-w-lg font-light">
                    Whether you are targeting a local zip code or a global market, our systems are built to adapt and dominate. 
                 </p>
                 
                 <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
                    <div className="flex gap-6 items-start">
                       <ShieldCheck className="w-8 h-8 text-brand-accent flex-shrink-0" />
                       <div>
                          <h4 className="text-white font-bold uppercase tracking-tight mb-2">Omni-Channel</h4>
                          <p className="text-neutral-500 text-xs leading-relaxed font-light">Unified data across Search, Social, and Display.</p>
                       </div>
                    </div>
                    <div className="flex gap-6 items-start">
                       <Zap className="w-8 h-8 text-brand-accent flex-shrink-0" />
                       <div>
                          <h4 className="text-white font-bold uppercase tracking-tight mb-2">Zero-Latency</h4>
                          <p className="text-neutral-500 text-xs leading-relaxed font-light">Instant response times for leads and ad optimizations.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="relative flex justify-center">
                 {/* Large Data Visualization Hub */}
                 <div className="aspect-square w-full max-w-sm md:max-w-lg bg-neutral-900 shadow-2xl rounded-full border border-white/10 relative flex items-center justify-center overflow-hidden group/viz">
                    <div className="absolute inset-0 opacity-10 pattern-grid-white"></div>
                    <motion.div 
                       animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: -360
                       }}
                       transition={{ 
                          scale: { duration: 5, repeat: Infinity }, 
                          rotate: { duration: 90, repeat: Infinity, ease: "linear" } 
                       }}
                       className="w-[80%] h-[80%] border-[2px] border-dashed border-brand-accent/20 rounded-full flex items-center justify-center"
                    />
                    <motion.div 
                       animate={{ 
                          rotate: 360
                       }}
                       transition={{ 
                          duration: 40, repeat: Infinity, ease: "linear" 
                       }}
                       className="absolute w-[95%] h-[95%] border border-white/5 rounded-full"
                    />
                    
                    <div className="absolute flex flex-col items-center">
                       <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent/20 rounded-full blur-2xl absolute animate-pulse" />
                       <span className="text-[8px] md:text-[10px] font-black uppercase text-brand-accent tracking-[0.5em] mb-4 relative z-10">System Diagnostic</span>
                       <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white italic relative z-10">Optimized.</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Discovery CTA */}
        <section className="mt-40 md:mt-60 text-center pb-20">
           <div className="inline-block px-8 py-3 bg-white/5 border border-white/10 rounded-full mb-10 md:mb-12">
              <span className="text-[10px] md:text-[11px] font-black uppercase text-white/40 tracking-[0.3em]">Ready to activate your protocol?</span>
           </div>
           <h2 className="text-5xl md:text-8xl lg:text-[10vw] font-black uppercase tracking-tighter text-white mb-16 md:mb-20 leading-[0.8]">
              Join the <br/> <span className="text-brand-accent italic font-serif lowercase">monolith.</span>
           </h2>
           <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
              <Link 
                to="/contact"
                aria-label="Start your engagement journey"
                className="group w-full sm:w-auto flex gap-6 md:gap-8 items-center justify-center bg-brand-accent text-brand-primary px-8 md:px-16 py-6 md:py-8 text-xs md:text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
              >
                Start Your Journey
                <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              </Link>
              <Link 
                to="/case-studies"
                className="group w-full sm:w-auto flex gap-4 items-center justify-center border border-white/10 text-white px-8 md:px-16 py-6 md:py-8 text-xs md:text-sm font-black uppercase tracking-[0.2em] transition-all hover:bg-white/5"
              >
                The Evidence
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </Link>
           </div>
        </section>
      </div>
    </div>
  );
};

