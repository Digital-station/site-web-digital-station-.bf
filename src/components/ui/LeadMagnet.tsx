import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Search, Sparkles, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

export const LeadMagnet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [website, setWebsite] = useState("");

  const handleNext = () => {
    if (website) setStep(2);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[100] lg:bottom-10 lg:left-24 bg-brand-surface border border-brand-border px-6 py-4 rounded-full flex items-center gap-3 group overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-brand-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <Search className="w-5 h-5 text-brand-accent group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white/80">Check Rankings</span>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 border-brand-primary bg-brand-surface flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-brand-accent fill-brand-accent" />
            </div>
          ))}
        </div>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-brand-primary/95 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(193,255,114,0.1)]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6 lg:w-8 lg:h-8" />
              </button>

              <div className="p-6 md:p-12 lg:p-16">
                <div className="flex items-center gap-2 text-brand-accent mb-6 md:mb-8">
                  <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em]">Proprietary GMB Radar</span>
                </div>

                {step === 1 ? (
                  <div className="space-y-8 md:space-y-12">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white italic">
                      Scan your <span className="text-brand-accent">Visibility</span> Velocity.
                    </h2>
                    <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-md">
                      Enter your domain to benchmark your Map Pack position against competitors in the 2026 local environment.
                    </p>
                    
                    <div className="relative group">
                      <input 
                        type="url" 
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourbusiness.com"
                        className="w-full bg-brand-primary/50 border-b-2 border-brand-border px-0 py-4 lg:py-6 text-xl lg:text-3xl font-bold text-white focus:border-brand-accent outline-none transition-all placeholder:text-white/10"
                      />
                      <button 
                        onClick={handleNext}
                        className={cn(
                          "absolute right-0 bottom-4 lg:bottom-6 text-brand-accent group-hover:translate-x-2 transition-transform",
                          !website && "opacity-20 cursor-not-allowed"
                        )}
                      >
                        <ArrowRight className="w-8 h-8 lg:w-12 lg:h-12" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 md:space-y-12">
                    <div className="flex items-center gap-4 text-emerald-400">
                      <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8" />
                      <span className="text-sm lg:text-base font-bold">Scanning Infrastructure Confirmed...</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white italic">
                      Critical <span className="text-brand-accent">Gaps</span> Inbound.
                    </h2>
                    <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                      We've identified 4 structural SEO anomalies in your profile. Where should we transmit the full technical breakdown?
                    </p>
                    <div className="space-y-6">
                      <input 
                        type="email" 
                        placeholder="Expert business email"
                        className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-6 py-4 lg:py-5 text-white outline-none focus:border-brand-accent transition-all"
                      />
                      <button className="btn-primary w-full py-4 lg:py-5 uppercase font-black tracking-widest text-xs lg:text-sm">
                        Request Full Radar Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
