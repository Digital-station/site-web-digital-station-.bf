import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Cpu, 
  Brain, 
  Search, 
  Eye, 
  ShieldCheck, 
  Zap,
  Globe,
  MessageSquare
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const FutureMarketing2026 = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Trends header reveal
      gsap.fromTo(".future-header > *", 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".future-header",
            start: "top 95%"
          }
        }
      );

      // Trend cards stagger
      gsap.fromTo(".trend-card", 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".trend-card-grid",
            start: "top 95%",
            toggleActions: "play none none none"
          }
        }
      );

      // Knowledge hub sections
      gsap.fromTo(".knowledge-hub-item", 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          scrollTrigger: {
            trigger: ".knowledge-hub-grid",
            start: "top 95%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const trends = [
    {
      year: "2026",
      title: "The Zero-Click Search Era",
      desc: "By 2026, AI Overviews will answer 80% of informational queries directly. Marketing shifts from 'clicks' to 'brand mentions' in LLM training sets.",
      icon: Search,
      impact: "High Strategy Shift"
    },
    {
      year: "2026",
      title: "AI-Powered Shopping",
      desc: "Marketing will no longer target humans exclusively; we will market to AI assistants that shop and compare products for their users.",
      icon: Brain,
      impact: "Technical Integration"
    },
    {
      year: "2026",
      title: "Data Privacy & Trust",
      desc: "Third-party cookies are disappearing. 2026 is the year of 'Direct Data' where brands must build real trust to get users to share information voluntarily.",
      icon: ShieldCheck,
      impact: "Privacy Dominance"
    },
    {
      year: "2026",
      title: "Hyper-Personalized Video",
      desc: "Real-time generative video based on individual user data. Every ad is unique, rendered on-the-fly for the person watching.",
      icon: Eye,
      impact: "Creative Automation"
    }
  ];

  return (
    <div ref={containerRef} className="mt-40 md:mt-60 lg:pl-16 pb-32 md:pb-40 relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-20 relative z-10">
        <header className="future-header mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-12 overflow-hidden">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-brand-accent mb-6">
              <Cpu className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Temporal Analysis // 2026</span>
            </div>
            <h2 className="text-5xl md:text-[8vw] lg:text-[9vw] font-black uppercase tracking-tighter text-white leading-[0.8] mb-8">
              The 2026 <br />
              <span className="italic font-serif font-light lowercase text-brand-accent">Horizon.</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-xl font-light leading-relaxed">
              Digital marketing is evolving faster than current infrastructure can adapt. Here is the roadmap of the impending shift in the digital meta.
            </p>
          </div>
          
          <div className="hidden lg:block bg-brand-surface border border-white/5 p-10 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-sm">
             <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Market Prediction Confidence</div>
             <div className="flex items-end gap-1 h-32 mb-8">
                {[0.4, 0.6, 0.5, 0.8, 0.9, 0.85].map((h, i) => (
                  <div key={i} className="flex-1 bg-brand-accent/20 rounded-t-lg transition-all hover:bg-brand-accent" style={{ height: `${h * 100}%` }} />
                ))}
             </div>
             <div className="text-xs text-white/60 leading-relaxed font-medium italic">"The transition from Search Engines to Answer Engines will be complete by Q4 2026."</div>
          </div>
        </header>

        <div className="trend-card-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trends.map((trend, i) => (
            <div key={i} className="trend-card group relative p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] hover:bg-white/[0.04] transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-8 md:mb-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-primary transition-all">
                    <trend.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-white/20">{trend.year}</span>
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tighter mb-4 leading-tight">{trend.title}</h4>
                <p className="text-neutral-500 text-xs leading-relaxed group-hover:text-neutral-300 transition-colors font-light">
                  {trend.desc}
                </p>
              </div>
              <div className="mt-8 md:mt-12 pt-6 border-t border-white/5">
                <div className="text-[9px] font-black uppercase text-brand-accent tracking-widest bg-brand-accent/10 px-3 py-1.5 rounded-full inline-block">
                  Impact: {trend.impact}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Basic Knowledge Hub */}
        <div className="knowledge-hub-grid mt-24 md:mt-40 grid lg:grid-cols-12 gap-8 lg:gap-12">
           <div className="lg:col-span-12 mb-8 md:mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Digital Foundations <span className="text-brand-accent font-serif lowercase italic">0.1</span></h3>
           </div>
           
           <div className="knowledge-hub-item lg:col-span-8 space-y-6 md:space-y-8">
              <div className="p-8 md:p-12 bg-brand-surface border border-brand-border rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group">
                 <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div>
                       <h4 className="text-2xl font-black text-white uppercase mb-6 tracking-tighter leading-none">The Marketing <br/> Funnel Logic.</h4>
                       <p className="text-neutral-500 text-xs md:text-sm leading-relaxed mb-8 font-light">
                          Most businesses fail because they try to sell to people who don't know them yet. A successful strategy is a simple 3-step path that leads a stranger to becoming a happy customer.
                       </p>
                       <ul className="space-y-4">
                          {['Step 1: Get Noticed (Attract)', 'Step 2: Build Trust (Engage)', 'Step 3: Close the Sale (Convert)'].map((step, i) => (
                             <li key={i} className="flex gap-4 items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{step}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div className="relative mt-12 md:mt-0 p-8 bg-black/40 border border-white/5 rounded-[2rem] flex items-center justify-center overflow-hidden">
                       {/* Background Glow */}
                       <div className="absolute inset-0 bg-brand-accent/5 blur-[40px] rounded-full"></div>
                       
                       {/* Funnel Viz */}
                       <div className="relative flex flex-col items-center gap-3 w-full max-w-[200px] z-10">
                          {/* Top Lead Particles */}
                          {[...Array(5)].map((_, i) => (
                             <motion.div
                                key={i}
                                initial={{ y: -40, opacity: 0, scale: 0 }}
                                animate={{ 
                                   y: [0, 120], 
                                   opacity: [0, 1, 1, 0],
                                   scale: [0.5, 1, 0.8, 0.5],
                                   x: [0, (i - 2) * 10, 0]
                                }}
                                transition={{ 
                                   duration: 3, 
                                   repeat: Infinity, 
                                   delay: i * 0.6,
                                   ease: "easeInOut"
                                }}
                                className="absolute top-0 w-2 h-2 rounded-full bg-white/40 shadow-[0_0_10px_white]"
                             />
                          ))}

                          {/* Conversion Coins */}
                          {[...Array(3)].map((_, i) => (
                             <motion.div
                                key={`coin-${i}`}
                                initial={{ y: 80, opacity: 0, scale: 0 }}
                                animate={{ 
                                   y: [80, 160], 
                                   opacity: [0, 1, 0],
                                   scale: [0, 1.5, 2],
                                   x: [0, (i - 1) * 30, (i - 1) * 50],
                                   rotate: [0, 360]
                                }}
                                transition={{ 
                                   duration: 1.5, 
                                   repeat: Infinity, 
                                   delay: i * 0.5 + 2, // Delay to start after "leads" pass through
                                   ease: "easeOut"
                                }}
                                className="absolute w-4 h-4 rounded-full bg-brand-accent flex items-center justify-center text-[8px] font-black text-brand-primary"
                             >
                                $
                             </motion.div>
                          ))}

                          <motion.div 
                             whileHover={{ scale: 1.02 }}
                             className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group/step"
                          >
                             <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/step:translate-y-0 transition-transform"></div>
                             <span className="text-[10px] font-black text-white/30 tracking-widest relative z-10">GET NOTICED</span>
                          </motion.div>
                          
                          <motion.div 
                             whileHover={{ scale: 1.02 }}
                             className="w-[85%] h-12 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group/step"
                          >
                             <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/step:translate-y-0 transition-transform"></div>
                             <span className="text-[10px] font-black text-white/40 tracking-widest relative z-10 font-bold">BUILD TRUST</span>
                          </motion.div>
                          
                          <motion.div 
                             initial={{ boxShadow: "0 0 0px rgba(193,255,114,0)" }}
                             animate={{ 
                                boxShadow: ["0 0 0px rgba(193,255,114,0)", "0 0 20px rgba(193,255,114,0.3)", "0 0 0px rgba(193,255,114,0)"]
                             }}
                             transition={{ duration: 2, repeat: Infinity }}
                             whileHover={{ scale: 1.05 }}
                             className="w-[70%] h-14 bg-brand-accent border border-brand-accent rounded-2xl flex items-center justify-center relative overflow-hidden shadow-[0_10px_30px_rgba(193,255,114,0.2)]"
                          >
                             <motion.div 
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                             />
                             <span className="text-[11px] font-black text-brand-primary tracking-widest relative z-10">TAKE ACTION</span>
                          </motion.div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                 <div className="p-8 md:p-10 bg-brand-surface border border-brand-border rounded-[2rem] md:rounded-[3rem]">
                    <Globe className="w-8 h-8 md:w-10 md:h-10 text-brand-accent mb-6" />
                    <h4 className="text-lg font-bold text-white uppercase mb-3">Multi-Platform Visibility</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed font-light">
                       Modern users see a brand 8+ times across different sites before buying. We sync your social, search, and ads for a seamless experience.
                    </p>
                 </div>
                 <div className="p-8 md:p-10 bg-brand-surface border border-brand-border rounded-[2rem] md:rounded-[3rem]">
                    <Zap className="w-8 h-8 md:w-10 md:h-10 text-brand-accent mb-6" />
                    <h4 className="text-lg font-bold text-white uppercase mb-3">Smart Follow-Up Systems</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed font-light">
                       Don't lose potential customers. We use advanced tracking to re-engage people who showed interest but haven't contacted you yet.
                    </p>
                 </div>
              </div>
           </div>

           <div className="knowledge-hub-item lg:col-span-4 mt-8 lg:mt-0">
              <div className="h-full bg-brand-accent p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col justify-between">
                 <div>
                    <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-brand-primary mb-8 md:mb-12 opacity-30" />
                    <h4 className="text-3xl font-black text-brand-primary uppercase tracking-tighter leading-none mb-6 italic">The Trust <br/> Builder Engine.</h4>
                    <p className="text-sm font-bold text-brand-primary/70 leading-relaxed md:leading-relaxed">
                       Online Trust is your strongest asset in 2026. Reviews, Case Studies, and Customer Photos are not optional—they are the key to growing your business.
                    </p>
                 </div>
                 <div className="mt-8 md:mt-12 space-y-6">
                    <div className="flex justify-between text-[10px] font-black uppercase text-brand-primary">
                       <span>Trust Score</span>
                       <span>98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-primary/10 rounded-full overflow-hidden">
                       <div className="w-[98%] h-full bg-brand-primary transition-all duration-[2000ms]" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
